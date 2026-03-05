# Convert CommonModule usage to standalone imports

Bu geçiş, bileşenlerin içindeki `CommonModule` içe aktarmalarını kaldırarak her şablonun gerektirdiği minimum direktif ve pipe içe aktarma setini (örneğin `NgIf`, `NgFor`, `AsyncPipe` vb.) ekleyerek projelere yardımcı olur.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```shell
ng generate @angular/core:common-to-standalone
```

## Options

| Seçenek | Ayrıntılar                                                                                                                                  |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `path`  | Geçirilecek yol (proje köküne göreceli). Varsayılan değer `./`'dir. Projenizin bir alt kümesini aşamalı olarak geçirmek için bunu kullanın. |

## Example

Before:

```angular-ts
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-example',
  imports: [CommonModule],
  template: `
    <div *ngIf="show">
      {{ data | async | json }}
    </div>
  `,
})
export class Example {
  show = true;
  data = Promise.resolve({message: 'Hello'});
}
```

Geçiş çalıştırıldıktan sonra (bileşen içe aktarmaları eklendi, CommonModule kaldırıldı):

```angular-ts
import {Component} from '@angular/core';
import {AsyncPipe, JsonPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-example',
  imports: [AsyncPipe, JsonPipe, NgIf],
  template: `
    <div *ngIf="show">
      {{ data | async | json }}
    </div>
  `,
})
export class Example {
  show = true;
  data = Promise.resolve({message: 'Hello'});
}
```
