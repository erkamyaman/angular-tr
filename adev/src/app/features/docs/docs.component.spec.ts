/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {ComponentFixture, TestBed} from '@angular/core/testing';

import DocsComponent from './docs.component';
import {provideRouter} from '@angular/router';
import {DOCS_CONTENT_LOADER, WINDOW} from '@angular/docs';
import {AppScroller} from '../../app-scroller';

describe('DocsComponent', () => {
  let component: DocsComponent;
  let fixture: ComponentFixture<DocsComponent>;
  const fakeWindow = {
    addEventListener: () => {},
    removeEventListener: () => {},
  };
  const fakeContentLoader = {
    getContent: (id: string) => undefined,
  };
  let appScrollerSpy: jasmine.SpyObj<AppScroller>;

  beforeEach(async () => {
    appScrollerSpy = jasmine.createSpyObj<AppScroller>('AppScroller', [
      'scrollAfterContentRendered',
    ]);
    TestBed.configureTestingModule({
      imports: [DocsComponent],
      providers: [
        provideRouter([]),
        {
          provide: AppScroller,
          useValue: appScrollerSpy,
        },
        {
          provide: WINDOW,
          useValue: fakeWindow,
        },
        {
          provide: DOCS_CONTENT_LOADER,
          useValue: fakeContentLoader,
        },
      ],
    });
    fixture = TestBed.createComponent(DocsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should re-apply the scroll once the doc content has rendered', async () => {
    expect(appScrollerSpy.scrollAfterContentRendered).not.toHaveBeenCalled();

    fixture.componentRef.setInput('docContent', {id: 'guide', contents: '<h2 id="a">A</h2>'});
    await fixture.whenStable();

    expect(appScrollerSpy.scrollAfterContentRendered).toHaveBeenCalled();
  });
});
