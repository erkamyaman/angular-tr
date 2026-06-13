# Sinyal sorgularına geçiş

Angular, v19 itibarıyla üretime hazır kabul edilen sorgular için geliştirilmiş API'ler tanıttı.
Sinyal sorguları ve faydaları hakkında daha fazla bilgi için [özel kılavuzu](guide/components/queries) okuyun.

Sinyal sorgularını kullanmak isteyen mevcut ekipleri desteklemek için Angular ekibi, mevcut dekoratör sorgu alanlarını yeni API'ye dönüştüren otomatik bir geçiş sağlar.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```bash
ng generate @angular/core:signal-queries-migration
```

Alternatif olarak, geçiş VSCode'da bir [kod yeniden düzenleme eylemi](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) olarak mevcuttur.
VSCode uzantısının en son sürümünü kurun ve örneğin bir `@ViewChild` alanına tıklayın.
Daha fazla ayrıntı için [aşağıdaki](#vscode-eklentisi) bölüme bakın.

## Geçiş ne değiştirir?

1. `@ViewChild()`, `@ViewChildren`, `@ContentChild` ve `@ContentChildren` sınıf üyeleri
   sinyal eşdeğerlerine güncellenir.
2. Uygulamanızdaki geçirilen sorgulara yapılan referanslar, sinyali çağıracak şekilde güncellenir.
   - Bu, şablonlardaki, ana bağlamalardaki veya TypeScript kodundaki referansları içerir.

**Before**

```angular-ts
import {Component, ContentChild} from '@angular/core';

@Component({
  template: `Has ref: {{ someRef ? 'Yes' : 'No' }}`,
})
export class MyComponent {
  @ContentChild('someRef') ref: ElementRef | undefined = undefined;

  someMethod(): void {
    if (this.ref) {
      this.ref.nativeElement;
    }
  }
}
```

**After**

```angular-ts
import {Component, contentChild} from '@angular/core';

@Component({
  template: `Has ref: {{ someRef() ? 'Yes' : 'No' }}`,
})
export class MyComponent {
  readonly ref = contentChild<ElementRef>('someRef');

  someMethod(): void {
    const ref = this.ref();
    if (ref) {
      ref.nativeElement;
    }
  }
}
```

## Yapılandırma seçenekleri

Geçiş, belirli ihtiyaçlarınıza göre ince ayar yapmak için birkaç seçeneği destekler.

### `--path`

Varsayılan olarak, geçiş tüm Angular CLI çalışma alanınızı güncelleyecektir.
Bu seçeneği kullanarak geçişi belirli bir alt dizinle sınırlayabilirsiniz.

### `--best-effort-mode`

Varsayılan olarak, geçiş güvenli bir şekilde geçirilemeyen sorguları atlar.
Geçiş, kodu mümkün olduğunca güvenli bir şekilde yeniden düzenlemeye çalışır.

`--best-effort-mode` bayrağı etkinleştirildiğinde, geçiş, derlemenizi bozabilse bile mümkün olduğunca çok şeyi geçirmeye istekli bir şekilde çalışır.

### `--insert-todos`

Etkinleştirildiğinde, geçiş geçirilemeyen sorgulara TODO'lar ekler.
TODO'lar, sorguların neden atlandığına dair gerekçeyi içerir. Örneğin:

```ts
// TODO: Skipped for migration because:
//  Your application code writes to the query. This prevents migration.
@ViewChild('ref') ref?: ElementRef;
```

### `--analysis-dir`

Büyük projelerde, analiz edilen dosya miktarını azaltmak için bu seçeneği kullanabilirsiniz.
Varsayılan olarak, geçiş `--path` seçeneğinden bağımsız olarak tüm çalışma alanını analiz eder,
böylece bir sorgu bildiriminin geçişinden etkilenen tüm referansları günceller.

Bu seçenekle, analizi bir alt klasörle sınırlayabilirsiniz. Bu dizin dışındaki herhangi bir
referansın sessizce atlanacağını ve potansiyel olarak derlemenizi bozabileceğini unutmayın.

## VSCode eklentisi

![Screenshot of the VSCode extension and clicking on an `@ViewChild` field](assets/images/migrations/signal-queries-vscode.png 'Screenshot of the VSCode extension and clicking on an `@ViewChild` field.')

Geçiş, VSCode'da bir [kod yeniden düzenleme eylemi](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) olarak mevcuttur.

Geçişi VSCode aracılığıyla kullanmak için VSCode uzantısının en son sürümünü kurun ve şunlardan birine tıklayın:

- bir `@ViewChild`, `@ViewChildren`, `@ContentChild` veya `@ContentChildren` alanına.
- bir direktif/bileşene

Ardından, sarı ampul VSCode yeniden düzenleme düğmesinin görünmesini bekleyin.
Bu düğme aracılığıyla sinyal sorguları geçişini seçebilirsiniz.
