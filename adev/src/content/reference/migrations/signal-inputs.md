# Migration to signal inputs

Angular, v19 itibarıyla üretime hazır kabul edilen girdiler için geliştirilmiş bir API tanıttı.
Sinyal girdileri ve faydaları hakkında daha fazla bilgi için [özel kılavuzu](guide/components/inputs) okuyun.

Sinyal girdilerini kullanmak isteyen mevcut ekipleri desteklemek için Angular ekibi, `@Input` alanlarını yeni `input()` API'sine dönüştüren otomatik bir geçiş sağlar.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```bash
ng generate @angular/core:signal-input-migration
```

Alternatif olarak, geçiş VSCode'da bir [kod yeniden düzenleme eylemi](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) olarak mevcuttur.
VSCode uzantısının en son sürümünü kurun ve bir `@Input` alanına tıklayın.
Daha fazla ayrıntı için [aşağıdaki](#vscode-extension) bölüme bakın.

## What does the migration change?

1. `@Input()` sınıf üyeleri, sinyal `input()` eşdeğerlerine güncellenir.
2. Geçirilen girdilere yapılan referanslar, sinyali çağıracak şekilde güncellenir.
   - Bu, şablonlardaki, ana bağlamalardaki veya TypeScript kodundaki referansları içerir.

**Before**

```angular-ts
import {Component, Input} from '@angular/core';

@Component({
  template: `Name: {{ name ?? '' }}`,
})
export class MyComponent {
  @Input() name: string | undefined = undefined;

  someMethod(): number {
    if (this.name) {
      return this.name.length;
    }
    return -1;
  }
}
```

**After**

```angular-ts {[[4],[7], [10,12]]}
import {Component, input} from '@angular/core';

@Component({
  template: `Name: {{ name() ?? '' }}`,
})
export class MyComponent {
  readonly name = input<string>();

  someMethod(): number {
    const name = this.name();
    if (name) {
      return name.length;
    }
    return -1;
  }
}
```

## Configuration options

Geçiş, belirli ihtiyaçlarınıza göre ince ayar yapmak için birkaç seçeneği destekler.

### `--path`

Varsayılan olarak, geçiş tüm Angular CLI çalışma alanınızı güncelleyecektir.
Bu seçeneği kullanarak geçişi belirli bir alt dizinle sınırlayabilirsiniz.

### `--best-effort-mode`

Varsayılan olarak, geçiş güvenli bir şekilde geçirilemeyen girdileri atlar.
Geçiş, kodu mümkün olduğunca güvenli bir şekilde yeniden düzenlemeye çalışır.

`--best-effort-mode` bayrağı etkinleştirildiğinde, geçiş, derlemenizi bozabilse bile mümkün olduğunca çok şeyi geçirmeye istekli bir şekilde çalışır.

### `--insert-todos`

Etkinleştirildiğinde, geçiş geçirilemeyen girdilere TODO'lar ekler.
TODO'lar, girdilerin neden atlandığına dair gerekçeyi içerir. Örneğin:

```ts
// TODO: Skipped for migration because:
//  Your application code writes to the input. This prevents migration.
@Input() myInput = false;
```

### `--analysis-dir`

Büyük projelerde, analiz edilen dosya miktarını azaltmak için bu seçeneği kullanabilirsiniz.
Varsayılan olarak, geçiş `--path` seçeneğinden bağımsız olarak tüm çalışma alanını analiz eder,
böylece bir `@Input()` geçişinden etkilenen tüm referansları günceller.

Bu seçenekle, analizi bir alt klasörle sınırlayabilirsiniz. Bu dizin dışındaki herhangi bir
referansın sessizce atlanacağını ve potansiyel olarak derlemenizi bozabileceğini unutmayın.

## VSCode extension

![Screenshot of the VSCode extension and clicking on an `@Input` field](assets/images/migrations/signal-inputs-vscode.png 'Screenshot of the VSCode extension and clicking on an `@Input` field.')

Geçiş, VSCode'da bir [kod yeniden düzenleme eylemi](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) olarak mevcuttur.

Geçişi VSCode aracılığıyla kullanmak için VSCode uzantısının en son sürümünü kurun ve şunlardan birine tıklayın:

- bir `@Input` alanına.
- veya bir direktif/bileşene

Ardından, sarı ampul VSCode yeniden düzenleme düğmesinin görünmesini bekleyin.
Bu düğme aracılığıyla sinyal girdi geçişini seçebilirsiniz.
