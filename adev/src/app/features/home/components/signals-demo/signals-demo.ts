/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {CodeBlock} from '../code-block/code-block';

@Component({
  selector: 'adev-signals-demo',
  imports: [RouterLink, CodeBlock],
  templateUrl: './signals-demo.html',
  styleUrls: ['./signals-demo.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalsDemo {
  tsExample = tsExample;
  htmlExample = htmlExample;

  items = signal([
    'Apple',
    'Apricot',
    'Avocado',
    'Banana',
    'Blueberry',
    'Cherry',
    'Date',
    'Dragonfruit',
  ]);
  searchTerm = signal('');

  // Filtrelenmiş listeyi türeten bir computed sinyal.
  // Bir bağımlılık değiştiğinde otomatik olarak yeniden çalışır.
  filteredItems = computed(() => {
    const lowerCaseSearchTerm = this.searchTerm().toLowerCase();
    return this.items().filter((item) => item.toLowerCase().includes(lowerCaseSearchTerm));
  });

  onSearch(searchTerm: string) {
    this.searchTerm.set(searchTerm);
  }
}

const tsExample = `
// Durum için kaynak sinyalleri.
items = signal(['Apple', 'Banana', /*...*/ ]);
searchTerm = signal('');
// Filtrelenmiş listeyi türeten bir computed sinyal.
// Bir bağımlılık değiştiğinde otomatik olarak yeniden çalışır.
filteredItems = computed(() => {
  const lowerCaseSearchTerm = this.searchTerm().toLowerCase();
  return this.items().filter(item =>
    item.toLowerCase().includes(lowerCaseSearchTerm)
  );
});
`.trim();

const htmlExample = `
<input [value]="searchTerm()" (input)="searchTerm.set($event.target.value)" />
<ul>
  @for (item of filteredItems(); track $index) {
    <li>{{ item }}</li>
  }
</ul>
`.trim();
