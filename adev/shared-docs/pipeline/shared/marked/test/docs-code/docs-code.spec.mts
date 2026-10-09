/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {parseMarkdown} from '../../parse.mjs';
import {resolve} from 'node:path';
import {readFile} from 'fs/promises';
import {JSDOM} from 'jsdom';
import {rendererContext, setHighlighter} from '../renderer-context.mjs';
import {processForApiLinks} from '../../extensions/docs-code/format/index.mjs';
import {findUnlinkableMemberLink} from '../../../linking.mjs';

describe('markdown to html', () => {
  let markdownDocument: DocumentFragment;

  beforeAll(async () => {
    await setHighlighter();
    const markdownContent = await readFile(resolve('./docs-code.md'), {encoding: 'utf-8'});
    markdownDocument = JSDOM.fragment(await parseMarkdown(markdownContent, rendererContext));
  });

  it('converts docs-code elements into a code block', () => {
    const codeBlock = markdownDocument.querySelectorAll('code')[0];
    expect(codeBlock).toBeTruthy();
    expect(codeBlock?.textContent?.trim()).toBe('this is code');
  });

  it('removes eslint comments from the code', () => {
    const codeBlock = markdownDocument.querySelectorAll('code')[1];
    expect(codeBlock).toBeTruthy();
    expect(codeBlock?.textContent?.trim()).not.toContain('// eslint');
  });

  it('extract regions from the code', () => {
    // This unit test is sensible to additional node, like text nodes between the lines.
    // The specific index here makes sure there is no space/linebreak between the code lines
    const codeBlock = markdownDocument.querySelectorAll('code')[2];
    expect(codeBlock).toBeTruthy();

    expect(codeBlock?.textContent?.trim()).toContain(`const x = 'within the region';`);
    expect(codeBlock?.textContent?.trim()).not.toContain('docregion');
  });

  it('should load header and html code', () => {
    const codeBlock = markdownDocument.querySelectorAll('code')[3];
    expect(codeBlock).toBeTruthy();
    expect(codeBlock?.textContent).not.toContain('docregion');
  });

  it('should not link property names in object literals', () => {
    const codeBlock = markdownDocument.querySelectorAll('code')[4];
    expect(codeBlock?.innerHTML).not.toContain('<a href="/api/animations/state">state</a>');
  });

  it('should not link names accessed on another object', () => {
    const codeBlock = Array.from(markdownDocument.querySelectorAll('.docs-code')).find((block) =>
      block.textContent?.includes('Member access should not be linked'),
    );

    expect(codeBlock?.querySelectorAll('a[href="/api/angular/router/Router"]').length).toBe(2);
    expect(codeBlock?.querySelectorAll('a[href="/api/angular/core/ApplicationRef"]').length).toBe(
      1,
    );
  });

  it('should parse the hideDollar attribute', () => {
    const codeBlock = markdownDocument.querySelectorAll('.docs-code')[5];
    expect(codeBlock.getAttribute('hideDollar')).toBe('true');
  });

  it('should deindent inline code blocks correctly', () => {
    const codeBlock = markdownDocument.querySelectorAll('.docs-code')[6]?.querySelector('code');
    expect(codeBlock?.textContent).toMatch(/^  \/\/ bar/m);
  });
});

describe('processForApiLinks', () => {
  const apiEntries = {Router: {moduleName: 'angular/router'}};

  function link(html: string): Element {
    const code = JSDOM.fragment(`<code>${html}</code>`).firstElementChild!;
    processForApiLinks(code, apiEntries);
    return code;
  }

  it('should link a standalone symbol', () => {
    const code = link('<span>inject(</span><span>Router</span><span>)</span>');

    expect(code.querySelectorAll('a[href="/api/angular/router/Router"]').length).toBe(1);
  });

  it('should not link a name that follows a dot in its own span', () => {
    const code = link('<span>this</span><span>.</span><span>Router</span>');

    expect(code.querySelectorAll('a').length).toBe(0);
  });

  it('should link a capitalized name accessed on a capitalized name', () => {
    const code = link('<span>Router</span><span>.</span><span>Router</span>');

    expect(code.querySelectorAll('a[href="/api/angular/router/Router"]').length).toBe(2);
  });

  it('should not link a name that starts with the dot', () => {
    const code = link('<span>this</span><span>.Router</span>');

    expect(code.querySelectorAll('a').length).toBe(0);
  });

  it('should not link a name after an optional chaining access', () => {
    const code = link(
      '<span>this</span><span>.</span><span>app</span><span>?.</span><span>Router</span>',
    );

    expect(code.querySelectorAll('a').length).toBe(0);
  });
});

describe('findUnlinkableMemberLink', () => {
  const findMemberLink = (html: string) => findUnlinkableMemberLink(JSDOM.fragment(html));

  const block = (code: string) =>
    `<pre><code>${code}</code></pre><p>Router is <a href="/api/angular/router/Router">linked</a> here</p>`;
  const api = (name: string) => `<a href="/api/angular/core/${name}">${name}</a>`;

  it('should accept links that are not members of another object', () => {
    expect(findMemberLink(block(`inject(${api('Router')});`))).toBeUndefined();
    expect(findMemberLink(block(`${api('Router')}.${api('Scroll')}`))).toBeUndefined();
    expect(findMemberLink(block(`[...${api('Router')}]`))).toBeUndefined();
  });

  it('should report a link on a member of another object', () => {
    expect(findMemberLink(block(`this.${api('model')}`))).toBe('this.model');
    expect(
      findMemberLink(block(`<span>TestBed</span>.<span>${api('createComponent')}</span>`)),
    ).toBe('TestBed.createComponent');
  });

  it('should treat an anchor split over several text nodes as one link', () => {
    const split = '<a href="/api/core/model"><span>mo</span><span>del</span></a>';

    expect(findMemberLink(block(`this.${split}`))).toBe('this.model');
    expect(findMemberLink(block(`x ${split}`))).toBeUndefined();
  });

  it('should ignore links outside of code blocks', () => {
    expect(findMemberLink(`<p>this.${api('model')}</p>`)).toBeUndefined();
  });
});
