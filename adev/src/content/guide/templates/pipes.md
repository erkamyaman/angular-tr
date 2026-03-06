# Pipe'lar

## Genel Bakış

Pipe'lar, Angular şablon ifadelerinde verileri şablonunuzda bildirimsel olarak dönüştürmenize olanak tanıyan özel bir operatördür. Pipe'lar, bir dönüşüm fonksiyonunu bir kez bildirmenize ve ardından bu dönüşümü birden fazla şablonda kullanmanıza imkan tanır. Angular pipe'ları, [Unix pipe](<https://en.wikipedia.org/wiki/Pipeline_(Unix)>)'ından esinlenerek dikey çizgi karakterini (`|`) kullanır.

NOTE: Angular'ın pipe sözdizimi, dikey çizgi karakterini [bitsel VEYA operatörü](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR) için kullanan standart JavaScript'ten sapma gösterir. Angular şablon ifadeleri bitsel operatörleri desteklemez.

İşte Angular'ın sağladığı bazı yerleşik pipe'ları kullanan bir örnek:

```angular-ts
import {Component} from '@angular/core';
import {CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  template: `
    <main>
      <!-- Şirket adını başlık durumuna dönüştür ve
       purchasedOn tarihini yerel biçimlendirilmiş dizgeye dönüştür -->
      <h1>Purchases from {{ company | titlecase }} on {{ purchasedOn | date }}</h1>

      <!-- Tutarı para birimi biçimlendirilmiş dizgeye dönüştür -->
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

Angular bileşeni işlerken, uygun tarih formatı ve para biriminin kullanıcının yerel ayarına dayalı olmasını sağlar. Kullanıcı Amerika Birleşik Devletleri'nde ise, şu şekilde işlenecektir:

```angular-html
<main>
  <h1>Purchases from Acme Corporation on Jul 8, 2024</h1>
  <p>Total: $123.45</p>
</main>
```

Angular'ın değerleri nasıl yerelleştirdiği hakkında daha fazla bilgi edinmek için [i18n derinlemesine rehberine](/guide/i18n) bakın.

### Yerleşik Pipe'lar

Angular, `@angular/common` paketinde bir dizi yerleşik pipe içerir:

| Ad                                            | Açıklama                                                                             |
| --------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`AsyncPipe`](api/common/AsyncPipe)           | Bir `Promise` veya RxJS `Observable`'dan değeri okur.                                |
| [`CurrencyPipe`](api/common/CurrencyPipe)     | Bir sayıyı yerel kurallara göre biçimlenmiş para birimi dizgesine dönüştürür.        |
| [`DatePipe`](api/common/DatePipe)             | Bir `Date` değerini yerel kurallara göre biçimlendirir.                              |
| [`DecimalPipe`](api/common/DecimalPipe)       | Bir sayıyı yerel kurallara göre biçimlenmiş ondalık noktalı dizgeye dönüştürür.      |
| [`I18nPluralPipe`](api/common/I18nPluralPipe) | Bir değeri yerel kurallara göre çoğulan bir dizgeye eşler.                           |
| [`I18nSelectPipe`](api/common/I18nSelectPipe) | Bir anahtarı istenen değeri döndüren özel bir seçiciye eşler.                        |
| [`JsonPipe`](api/common/JsonPipe)             | Bir nesneyi `JSON.stringify` ile dizge temsiline dönüştürür, hata ayıklama amacıyla. |
| [`KeyValuePipe`](api/common/KeyValuePipe)     | Object veya Map'i anahtar-değer çifti dizisine dönüştürür.                           |
| [`LowerCasePipe`](api/common/LowerCasePipe)   | Metni tamamen küçük harfe dönüştürür.                                                |
| [`PercentPipe`](api/common/PercentPipe)       | Bir sayıyı yerel kurallara göre biçimlenmiş yüzde dizgesine dönüştürür.              |
| [`SlicePipe`](api/common/SlicePipe)           | Elemanların bir alt kümesini (dilim) içeren yeni bir Dizi veya Dizge oluşturur.      |
| [`TitleCasePipe`](api/common/TitleCasePipe)   | Metni başlık durumuna dönüştürür.                                                    |
| [`UpperCasePipe`](api/common/UpperCasePipe)   | Metni tamamen büyük harfe dönüştürür.                                                |

## Pipe'ları kullanma

Angular'ın pipe operatörü, bir şablon ifadesi içinde dikey çizgi karakterini (`|`) kullanır. Pipe operatörü ikili (binary) bir operatördür -- sol taraftaki operand dönüşüm fonksiyonuna geçirilen değerdir, sağ taraftaki operand ise pipe'ın adı ve ek argümanlardır (aşağıda açıklanmıştır).

```angular-html
<p>Total: {{ amount | currency }}</p>
```

Bu örnekte, `amount` değeri pipe adı `currency` olan `CurrencyPipe`'a geçirilir. Ardından kullanıcının yerel ayarına göre varsayılan para birimini işler.

### Aynı ifadede birden fazla pipe'ı birleştirme

Birden fazla pipe operatörü kullanarak bir değere birden fazla dönüşüm uygulayabilirsiniz. Angular pipe'ları soldan sağa doğru çalıştırır.

Aşağıdaki örnek, yerelleştirilmiş bir tarihi tamamen büyük harfle göstermek için bir pipe kombinasyonunu gösterir:

```angular-html
<p>The event will occur on {{ scheduledOn | date | uppercase }}.</p>
```

### Pipe'lara parametre geçirme

Bazı pipe'lar dönüşümü yapılandırmak için parametreler kabul eder. Bir parametre belirtmek için, pipe adının ardından iki nokta (`:`) ve parametre değerini ekleyin.

Örneğin, `DatePipe` tarihi belirli bir şekilde biçimlendirmek için parametreler alabilir.

```angular-html
<p>The event will occur at {{ scheduledOn | date: 'hh:mm' }}.</p>
```

Bazı pipe'lar birden fazla parametre kabul edebilir. İki nokta karakteriyle (`:`) ayrılmış ek parametre değerleri belirtebilirsiniz.

Örneğin, saat dilimini kontrol etmek için ikinci bir isteğe bağlı parametre de geçebiliriz.

```angular-html
<p>The event will occur at {{ scheduledOn | date: 'hh:mm' : 'UTC' }}.</p>
```

## Pipe'lar nasıl çalışır

Kavramsal olarak, pipe'lar bir giriş değeri kabul eden ve dönüştürülmüş bir değer döndüren fonksiyonlardır.

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

Bu örnekte:

1. `CurrencyPipe`, `@angular/common`'dan içeri aktarılır
1. `CurrencyPipe`, `imports` dizisine eklenir
1. `amount` verisi `currency` pipe'ına geçirilir

### Pipe operatörü önceliği

Pipe operatörü, `+`, `-`, `*`, `/`, `%`, `&&`, `||` ve `??` dahil diğer ikili operatörlerden daha düşük önceliğe sahiptir.

```angular-html
<!-- firstName ve lastName birleştirilir, ardından sonuç uppercase pipe'ına geçirilir -->
{{ firstName + lastName | uppercase }}
```

Pipe operatörü, koşullu (üçlü) operatörden daha yüksek önceliğe sahiptir.

```angular-html
{{ (isAdmin ? 'Access granted' : 'Access denied') | uppercase }}
```

Aynı ifade parantez olmadan yazılsaydı:

<!-- prettier-ignore -->
```angular-html
{{ isAdmin ? 'Access granted' : 'Access denied' | uppercase }}
```

Şu şekilde çözümlenecekti:

```angular-html
{{ isAdmin ? 'Access granted' : ('Access denied' | uppercase) }}
```

Operatör önceliği belirsiz olabilecek ifadelerinizde her zaman parantez kullanın.

### Pipe'larla değişiklik algılama

Varsayılan olarak, tüm pipe'lar `pure` (saf) olarak kabul edilir, yani yalnızca ilkel bir giriş değeri (`String`, `Number`, `Boolean` veya `Symbol` gibi) veya bir nesne referansı (`Array`, `Object`, `Function` veya `Date` gibi) değiştiğinde çalıştırılır. Saf pipe'lar, geçirilen değer değişmediyse Angular'ın dönüşüm fonksiyonunu çağırmaktan kaçınmasını sağlayarak bir performans avantajı sunar.

Sonuç olarak bu, nesne özelliklerindeki veya dizi öğelerindeki mutasyonların, tüm nesne veya dizi referansı farklı bir örnekle değiştirilmedikçe algılanmadığı anlamına gelir. Bu düzey değişiklik algılaması istiyorsanız, [diziler veya nesneler içindeki değişiklikleri algılama](#diziler-veya-nesneler-içindeki-değişiklikleri-algılama) bölümüne bakın.

## Özel pipe'lar oluşturma

Özel bir pipe'ı, `@Pipe` dekoratörü ile bir TypeScript sınıfı uygulayarak tanımlayabilirsiniz. Bir pipe'ın iki şeye sahip olması gerekir:

- Pipe dekoratöründe belirtilen bir ad
- Değer dönüşümünü gerçekleştiren `transform` adında bir yöntem.

TypeScript sınıfı ayrıca bir pipe için tür imzasını karşıladığını garanti etmek için `PipeTransform` arayüzünü uygulamalıdır.

İşte dizgeleri kebab-case'e dönüştüren özel bir pipe örneği:

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

### `@Pipe` dekoratörünü kullanma

Özel bir pipe oluştururken, `@angular/core` paketinden `Pipe`'ı içeri aktarın ve TypeScript sınıfı için dekoratör olarak kullanın.

```angular-ts
import {Pipe} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe {}
```

`@Pipe` dekoratörü, pipe'ın bir şablonda nasıl kullanılacağını kontrol eden bir `name` gerektirir.

### Özel pipe'lar için adlandırma kuralı

Özel pipe'lar için adlandırma kuralı iki kuraldan oluşur:

- `name` - camelCase önerilir. Tire kullanmayın.
- `class name` - `name`'in PascalCase sürümü, sonuna `Pipe` eklenmiş halidir

### `PipeTransform` arayüzünü uygulama

`@Pipe` dekoratörüne ek olarak, özel pipe'lar her zaman `@angular/core`'dan `PipeTransform` arayüzünü uygulamalıdır.

```angular-ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {}
```

Bu arayüzü uygulamak, pipe sınıfınızın doğru yapıya sahip olmasını sağlar.

### Pipe'ın değerini dönüştürme

Her dönüşüm, `transform` yöntemi tarafından çağrılır; ilk parametre geçirilen değerdir ve dönüş değeri dönüştürülmüş değerdir.

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

### Özel pipe'a parametre ekleme

`transform` yöntemine ek parametreler ekleyerek dönüşümünüze parametreler ekleyebilirsiniz:

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

### Diziler veya nesneler içindeki değişiklikleri algılama

Bir pipe'ın diziler veya nesneler içindeki değişiklikleri algılamasını istediğinizde, `pure` bayrağı `false` değeriyle geçirilerek saf olmayan (impure) olarak işaretlenmelidir.

IMPORTANT: Kesinlikle gerekli olmadıkça saf olmayan pipe oluşturmaktan kaçının, çünkü dikkatsizce kullanılırsa önemli bir performans cezasına neden olabilir.

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

Angular geliştiricileri, diğer geliştiricilere olası performans tuzağını belirtmek için genellikle pipe `name`'ine ve sınıf adına `Impure` ekleme kuralını benimser.
