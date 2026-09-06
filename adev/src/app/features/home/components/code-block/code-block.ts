/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {AsyncPipe, isPlatformBrowser} from '@angular/common';
import {Component, PLATFORM_ID, computed, inject, input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {ThemeManager, preferredScheme} from '../../../../core/services/theme-manager.service';
import {CodeHighlighter} from '../../code-highlighting/code-highlighter';

@Component({
  selector: 'adev-code-block',
  template: `<pre><code [innerHTML]="highlightedCode() | async"></code></pre>`,
  imports: [AsyncPipe],
  styles: `
    ::ng-deep pre {
      margin: 0;
    }
  `,
})
export class CodeBlock {
  codeHighlighter = inject(CodeHighlighter);
  code = input.required<string>();
  language = input<'angular-html' | 'angular-ts'>('angular-ts');
  sanitizer = inject(DomSanitizer);
  theme = inject(ThemeManager);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly isDarkMode = computed(() => {
    const theme = this.theme.theme();
    if (theme === 'dark' || theme === 'light') {
      return theme === 'dark';
    }
    return isPlatformBrowser(this.platformId) && preferredScheme() === 'dark';
  });

  highlightedCode = computed(() => {
    return this.codeHighlighter
      .codeToHtml(this.code(), {
        cssVariablePrefix: '--shiki-',
        lang: this.language(),
        theme: this.isDarkMode() ? 'github-dark' : 'github-light',
      })
      .then((hightlightedHtml) => {
        return this.sanitizer.bypassSecurityTrustHtml(hightlightedHtml);
      });
  });
}
