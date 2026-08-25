/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {Component, Injector, computed, inject, input} from '@angular/core';
import {DocContent, DocViewer} from '@angular/docs';
import {AppScroller} from '../../app-scroller';

@Component({
  selector: 'docs-docs',
  imports: [DocViewer],
  styleUrls: ['./docs.component.scss'],
  templateUrl: './docs.component.html',
  host: {
    '[class.overview]': 'isOverview()',
  },
})
export default class DocsComponent {
  // Based on current route, proper static content for doc page is fetched.
  // In case when exists example-viewer placeholders, then ExampleViewer
  // components are going to be rendered.

  docContent = input<DocContent>();
  isOverview = computed(() => this.docContent()?.id.includes('what-is-angular'));

  private readonly appScroller = inject(AppScroller);
  private readonly injector = inject(Injector);

  protected onContentLoaded(): void {
    this.appScroller.scrollAfterContentRendered(this.injector);
  }
}
