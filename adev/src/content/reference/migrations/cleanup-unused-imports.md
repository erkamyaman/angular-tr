# Kullanılmayan import'ları temizleme

Sürüm 19 itibarıyla, Angular bir bileşenin `imports` dizisi şablonunda kullanılmayan semboller içerdiğinde bunu bildirir.

Bu şematiği çalıştırmak, proje içindeki tüm kullanılmayan içe aktarmaları temizleyecektir.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```shell
ng generate @angular/core:cleanup-unused-imports
```

#### Önce

```angular-ts
import {Component} from '@angular/core';
import {UnusedDirective} from './unused';

@Component({
  template: 'Hello',
  imports: [UnusedDirective],
})
export class MyComp {}
```

#### Sonra

```angular-ts
import {Component} from '@angular/core';

@Component({
  template: 'Hello',
  imports: [],
})
export class MyComp {}
```
