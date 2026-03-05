# Pipes

## Overview

Pipe'lar, Angular sablon ifadelerinde verileri sablonunuzda bildirimsel olarak donusturmenize olanak taniyan ozel bir operatordur. Pipe'lar, bir donusum fonksiyonunu bir kez bildirmenize ve ardindan bu donusumu birden fazla sablonda kullanmaniza imkan tanir. Angular pipe'lari, [Unix pipe](<https://en.wikipedia.org/wiki/Pipeline_(Unix)>)'indan esinlenerek dikey cizgi karakterini (`|`) kullanir.

NOTE: Angular'in pipe sozdizimi, dikey cizgi karakterini [bitsel VEYA operatoru](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR) icin kullanan standart JavaScript'ten sapma gosterir. Angular sablon ifadeleri bitsel operatorleri desteklemez.

Iste Angular'in sagladigi bazi yerlesik pipe'lari kullanan bir ornek:

```angular-ts
import {Component} from '@angular/core';
import {CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  template: `
    <main>
      <!-- Transform the company name to title-case and
       transform the purchasedOn date to a locale-formatted string -->
      <h1>Purchases from {{ company | titlecase }} on {{ purchasedOn | date }}</h1>

      <!-- Transform the amount to a currency-formatted string -->
      <p>Total: {{ amount | currency }}</p>
    </main>
  `,
})
export class ShoppingCart {
  amount = 123.45;
  company = 'acme corporation';
  purchasedOn = '2024-07-08';
}
```

Angular bileseni islerken, uygun tarih formati ve para biriminin kullanicinin yerel ayarina dayali olmasini saglar. Kullanici Amerika Birlesik Devletleri'nde ise, su sekilde islenecektir:

```angular-html
<main>
  <h1>Purchases from Acme Corporation on Jul 8, 2024</h1>
  <p>Total: $123.45</p>
</main>
```

Angular'in degerleri nasil yerellestigirdigi hakkinda daha fazla bilgi edinmek icin [i18n derinlemesine rehberine](/guide/i18n) bakin.

### Built-in Pipes

Angular, `@angular/common` paketinde bir dizi yerlesik pipe icerir:

| Ad                                            | Aciklama                                                                             |
| --------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`AsyncPipe`](api/common/AsyncPipe)           | Bir `Promise` veya RxJS `Observable`'dan degeri okur.                                |
| [`CurrencyPipe`](api/common/CurrencyPipe)     | Bir sayiyi yerel kurallara gore bicimlenmis para birimi dizgesine donusturur.        |
| [`DatePipe`](api/common/DatePipe)             | Bir `Date` degerini yerel kurallara gore bicimlendirir.                              |
| [`DecimalPipe`](api/common/DecimalPipe)       | Bir sayiyi yerel kurallara gore bicimlenmis ondalik noktali dizgeye donusturur.      |
| [`I18nPluralPipe`](api/common/I18nPluralPipe) | Bir degeri yerel kurallara gore cogulan bir dizgeye esler.                           |
| [`I18nSelectPipe`](api/common/I18nSelectPipe) | Bir anahtari istenen degeri donduren ozel bir seciciye esler.                        |
| [`JsonPipe`](api/common/JsonPipe)             | Bir nesneyi `JSON.stringify` ile dizge temsiline donusturur, hata ayiklama amaciyla. |
| [`KeyValuePipe`](api/common/KeyValuePipe)     | Object veya Map'i anahtar-deger cifti dizisine donusturur.                           |
| [`LowerCasePipe`](api/common/LowerCasePipe)   | Metni tamamen kucuk harfe donusturur.                                                |
| [`PercentPipe`](api/common/PercentPipe)       | Bir sayiyi yerel kurallara gore bicimlenmis yuzde dizgesine donusturur.              |
| [`SlicePipe`](api/common/SlicePipe)           | Elemanlarin bir alt kumesini (dilim) iceren yeni bir Dizi veya Dizge olusturur.      |
| [`TitleCasePipe`](api/common/TitleCasePipe)   | Metni baslik durumuna donusturur.                                                    |
| [`UpperCasePipe`](api/common/UpperCasePipe)   | Metni tamamen buyuk harfe donusturur.                                                |

## Using pipes

Angular'in pipe operatoru, bir sablon ifadesi icinde dikey cizgi karakterini (`|`) kullanir. Pipe operatoru ikili (binary) bir operatordur -- sol taraftaki operand donusum fonksiyonuna gecirilen degerdir, sag taraftaki operand ise pipe'in adi ve ek argumanlaridir (asagida aciklanmistir).

```angular-html
<p>Total: {{ amount | currency }}</p>
```

Bu ornekte, `amount` degeri pipe adi `currency` olan `CurrencyPipe`'a gecirilir. Ardindan kullanicinin yerel ayarina gore varsayilan para birimini isler.

### Combining multiple pipes in the same expression

Birden fazla pipe operatoru kullanarak bir degere birden fazla donusum uygulayabilirsiniz. Angular pipe'lari soldan saga dogru calistirir.

Asagidaki ornek, yerellestirilmis bir tarihi tamamen buyuk harfle gostermek icin bir pipe kombinasyonunu gosterir:

```angular-html
<p>The event will occur on {{ scheduledOn | date | uppercase }}.</p>
```

### Passing parameters to pipes

Bazi pipe'lar donusumu yapilandirmak icin parametreler kabul eder. Bir parametre belirtmek icin, pipe adinin ardindan iki nokta (`:`) ve parametre degerini ekleyin.

Ornegin, `DatePipe` tarihi belirli bir sekilde bicmlendirmek icin parametreler alabilir.

```angular-html
<p>The event will occur at {{ scheduledOn | date: 'hh:mm' }}.</p>
```

Bazi pipe'lar birden fazla parametre kabul edebilir. Iki nokta karakteriyle (`:`) ayrilmis ek parametre degerleri belirtebilirsiniz.

Ornegin, saat dilimini kontrol etmek icin ikinci bir istege bagli parametre de gecebiliriz.

```angular-html
<p>The event will occur at {{ scheduledOn | date: 'hh:mm' : 'UTC' }}.</p>
```

## How pipes work

Kavramsal olarak, pipe'lar bir giris degeri kabul eden ve donusturulmus bir deger donduren fonksiyonlardir.

```angular-ts
import {Component} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe],
  template: `
    <main>
      <p>Total: {{ amount | currency }}</p>
    </main>
  `,
})
export class AppComponent {
  amount = 123.45;
}
```

Bu ornekte:

1. `CurrencyPipe`, `@angular/common`'dan iceri aktarilir
1. `CurrencyPipe`, `imports` dizisine eklenir
1. `amount` verisi `currency` pipe'ina gecirilir

### Pipe operator precedence

Pipe operatoru, `+`, `-`, `*`, `/`, `%`, `&&`, `||` ve `??` dahil diger ikili operatorlerden daha dusuk onceliige sahiptir.

```angular-html
<!-- firstName and lastName are concatenated before the result is passed to the uppercase pipe -->
{{ firstName + lastName | uppercase }}
```

Pipe operatoru, kosullu (uclu) operatorden daha yuksek onceliige sahiptir.

```angular-html
{{ (isAdmin ? 'Access granted' : 'Access denied') | uppercase }}
```

Ayni ifade parantez olmadan yazilsaydi:

<!-- prettier-ignore -->
```angular-html
{{ isAdmin ? 'Access granted' : 'Access denied' | uppercase }}
```

Su sekilde cozumlenecekti:

```angular-html
{{ isAdmin ? 'Access granted' : ('Access denied' | uppercase) }}
```

Operator onceligi belirsiz olabilecek ifadelerinizde her zaman parantez kullanin.

### Change detection with pipes

Varsayilan olarak, tum pipe'lar `pure` (saf) olarak kabul edilir, yani yalnizca ilkel bir giris degeri (`String`, `Number`, `Boolean` veya `Symbol` gibi) veya bir nesne referansi (`Array`, `Object`, `Function` veya `Date` gibi) degistiginde calistirilir. Saf pipe'lar, gecirilen deger degismediyse Angular'in donusum fonksiyonunu cagirmaktan kacinmasini saglayarak bir performans avantaji sunar.

Sonuc olarak bu, nesne ozelliklerindeki veya dizi ogelerindeki mutasyonlarin, tum nesne veya dizi referansi farkli bir ornekle degistirilmedikce algilanmadigi anlamina gelir. Bu duzey degisiklik algilamasi istiyorsaniz, [diziler veya nesneler icindeki degisiklikleri algilama](#detecting-change-within-arrays-or-objects) bolumune bakin.

## Creating custom pipes

Ozel bir pipe'i, `@Pipe` dekoratoru ile bir TypeScript sinifi uygulayarak tanimlayabilirsiniz. Bir pipe'in iki seye sahip olmasi gerekir:

- Pipe dekoratorunde belirtilen bir ad
- Deger donusumunu gerceklestiren `transform` adinda bir yontem.

TypeScript sinifi ayrica bir pipe icin tur imzasini karsiladigini garanti etmek icin `PipeTransform` arayuzunu uygulamalidir.

Iste dizgeleri kebab-case'e donusturen ozel bir pipe ornegi:

```angular-ts
// kebab-case.pipe.ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'kebabCase',
})
export class KebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/ /g, '-');
  }
}
```

### Using the `@Pipe` decorator

Ozel bir pipe olustururken, `@angular/core` paketinden `Pipe`'i iceri aktarin ve TypeScript sinifi icin dekorator olarak kullanin.

```angular-ts
import {Pipe} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe {}
```

`@Pipe` dekoratoru, pipe'in bir sablonda nasil kullanilacagini kontrol eden bir `name` gerektirir.

### Naming convention for custom pipes

Ozel pipe'lar icin adlandirma kurali iki kuraldan olusur:

- `name` - camelCase onerilir. Tire kullanmayin.
- `class name` - `name`'in PascalCase surumu, sonuna `Pipe` eklenmis halidir

### Implement the `PipeTransform` interface

`@Pipe` dekoratorune ek olarak, ozel pipe'lar her zaman `@angular/core`'dan `PipeTransform` arayuzunu uygulamalidir.

```angular-ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {}
```

Bu arayuzu uygulamak, pipe sinifinizin dogru yapiya sahip olmasini saglar.

### Transforming the value of a pipe

Her donusum, `transform` yontemi tarafindan cagirilir; ilk parametre gecirilen degerdir ve donus degeri donusturulmus degerdir.

```angular-ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string): string {
    return `My custom transformation of ${value}.`;
  }
}
```

### Adding parameters to a custom pipe

`transform` yontemine ek parametreler ekleyerek donusumunuze parametreler ekleyebilirsiniz:

```angular-ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string, format: string): string {
    let msg = `My custom transformation of ${value}.`;

    if (format === 'uppercase') {
      return msg.toUpperCase();
    } else {
      return msg;
    }
  }
}
```

### Detecting change within arrays or objects

Bir pipe'in diziler veya nesneler icindeki degisiklikleri algilamasini istediginizde, `pure` bayragi `false` degeriyle gecirilerek saf olmayan (impure) olarak isaretlenmelidir.

IMPORTANT: Kesinlikle gerekli olmadikca saf olmayan pipe olusturmaktan kacinin, cunku dikkatsizce kullanilirsa onemli bir performans cezasina neden olabilir.

```angular-ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'joinNamesImpure',
  pure: false,
})
export class JoinNamesImpurePipe implements PipeTransform {
  transform(names: string[]): string {
    return names.join();
  }
}
```

Angular gelistiricileri, diger gelistiricilere olasi performans tuzagini belirtmek icin genellikle pipe `name`'ine ve sinif adina `Impure` ekleme kuralini benimser.
