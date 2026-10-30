/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import type {NavigationItem} from '@angular/docs';

export const DOCS_SUB_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: 'Introduction',
    children: [
      {
        label: 'What is Angular?',
        path: 'overview',
        contentPath: 'introduction/what-is-angular',
      },
    ],
  },
  {
    label: 'In-depth Guides',
    children: [
      {
        label: 'Signals',
        children: [
          {
            label: 'Overview',
            path: 'guide/signals',
            contentPath: 'guide/signals/overview',
          },
        ],
      },
      {
        label: 'Components',
        children: [
          {
            label: 'Anatomy of components',
            path: 'guide/components',
            contentPath: 'guide/components/anatomy-of-components',
          },
        ],
      },
    ],
  },
  {
    label: 'Reference',
    children: [
      {
        label: 'Error Encyclopedia',
        children: [
          {
            label: 'Overview',
            path: 'errors',
            contentPath: 'reference/errors/overview',
          },
        ],
      },
    ],
  },
];

export const FOOTER_NAVIGATION_DATA: NavigationItem[] = [
  {label: 'What\'s new?', path: 'roadmap'},
];
