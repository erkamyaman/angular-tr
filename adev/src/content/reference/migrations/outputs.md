# output fonksiyonuna geçiş

Angular, v17.3'te çıktılar için geliştirilmiş bir API tanıttı ve bu API v19 itibarıyla üretime hazır kabul edilmektedir. Bu API, `input()` API'sini taklit eder ancak Signals'e dayalı değildir.
Özel olaylar output fonksiyonu ve faydaları hakkında daha fazla bilgi için [özel kılavuzu](guide/components/outputs) okuyun.

Output fonksiyonunu kullanmak isteyen mevcut projeleri desteklemek için Angular ekibi, `@Output` özel olaylarını yeni `output()` API'sine dönüştüren otomatik bir geçiş sağlar.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```bash
ng generate @angular/core:output-migration
```

## Geçiş neyi değiştirir?

1. `@Output()` sınıf üyeleri `output()` eşdeğerlerine güncellenir.
2. Bileşenlerin veya direktiflerin dosyasındaki TypeScript modül düzeyindeki içe aktarmalar da güncellenir.
3. Kullanımı önerilmeyen `event.next()` gibi API fonksiyonlarını `event.emit()`'e geçirir ve `event.complete()` çağrılarını kaldırır.

**Önce**

```typescript
import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  template: `<button (click)="someMethod('test')">emit</button>`,
})
export class MyComponent {
  @Output() someChange = new EventEmitter<string>();

  someMethod(value: string): void {
    this.someChange.emit(value);
  }
}
```

**Sonra**

```typescript
import {Component, output} from '@angular/core';

@Component({
  template: `<button (click)="someMethod('test')">emit</button>`,
})
export class MyComponent {
  readonly someChange = output<string>();

  someMethod(value: string): void {
    this.someChange.emit(value);
  }
}
```

## Yapılandırma seçenekleri

Geçiş, belirli ihtiyaçlarınıza göre ince ayar yapmak için birkaç seçeneği destekler.

### `--path`

Belirtilmezse, geçiş sizden bir yol isteyecek ve tüm Angular CLI çalışma alanınızı güncelleyecektir.
Bu seçeneği kullanarak geçişi belirli bir alt dizinle sınırlayabilirsiniz.

### `--analysis-dir`

Büyük projelerde, analiz edilen dosya miktarını azaltmak için bu seçeneği kullanabilirsiniz.
Varsayılan olarak, geçiş `--path` seçeneğinden bağımsız olarak tüm çalışma alanını analiz eder,
böylece bir `@Output()` geçişinden etkilenen tüm referansları günceller.

Bu seçenekle, analizi bir alt klasörle sınırlayabilirsiniz. Bu dizin dışındaki herhangi bir
referansın sessizce atlanacağını ve potansiyel olarak derlemenizi bozabileceğini unutmayın.

Bu seçenekleri aşağıda gösterildiği gibi kullanın:

```bash
ng generate @angular/core:output-migration --path src/app/sub-folder
```

## İstisnalar

Bazı durumlarda, geçiş koda dokunmayacaktır.
Bu istisnalardan biri, olayın `pipe()` yöntemiyle kullanıldığı durumdur.
Aşağıdaki kod geçirilmeyecektir:

```typescript
export class MyDialogComponent {
  @Output() close = new EventEmitter<void>();
  doSome(): void {
    this.close.complete();
  }
  otherThing(): void {
    this.close.pipe();
  }
}
```
