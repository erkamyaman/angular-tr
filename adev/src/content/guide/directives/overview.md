<docs-decorative-header title="Built-in directives" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
Direktifler, Angular uygulamalarınızdaki elemanlara ek davranış ekleyen sınıflardır.
</docs-decorative-header>

Formları, listeleri, stilleri ve kullanıcıların gördüklerini yönetmek için Angular'ın yerleşik direktiflerini kullanın.

Angular direktiflerinin farklı türleri şunlardır:

| Directive Types                                                  | Details                                                                                   |
| :--------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| [Components](guide/components)                                   | Bir şablonla kullanılır. Bu direktif türü en yaygın direktif türüdür.                     |
| [Attribute directives](#built-in-attribute-directives)           | Bir elemanın, bileşenin veya başka bir direktifin görünümünü veya davranışını değiştirir. |
| [Structural directives](/guide/directives/structural-directives) | DOM elemanları ekleyerek ve kaldırarak DOM düzenini değiştirir.                           |

Bu kılavuz yerleşik [nitelik direktiflerini](#built-in-attribute-directives) kapsar.

## Built-in attribute directives

Nitelik direktifleri, diğer HTML elemanlarının, niteliklerin, özelliklerin ve bileşenlerin davranışını dinler ve değiştirir.

En yaygın nitelik direktifleri şunlardır:

| Common directives                                      | Details                                                |
| :----------------------------------------------------- | :----------------------------------------------------- |
| [`NgClass`](#adding-and-removing-classes-with-ngclass) | Bir dizi CSS sınıfı ekler ve kaldırır.                 |
| [`NgStyle`](#setting-inline-styles-with-ngstyle)       | Bir dizi HTML stili ekler ve kaldırır.                 |
| [`NgModel`](guide/forms/template-driven-forms)         | Bir HTML form elemanına çift yönlü veri bağlama ekler. |

HELPFUL: Yerleşik direktifler yalnızca genel API'leri kullanır. Diğer direktiflerin erişemediği hiçbir özel API'ye özel erişimleri yoktur.

## Adding and removing classes with `NgClass`

`ngClass` ile aynı anda birden fazla CSS sınıfı ekleyin veya kaldırın.

HELPFUL: _Tek_ bir sınıf eklemek veya kaldırmak için `NgClass` yerine [sınıf bağlama](/guide/templates/binding#css-class-and-style-property-bindings) kullanın.

### Import `NgClass` in the component

`NgClass` kullanmak için bileşenin `imports` listesine ekleyin.

```angular-ts
import {NgClass} from '@angular/common';

@Component({
  /* ... */
  imports: [NgClass],
})
export class AppComponent {}
```

### Using `NgClass` with an expression

Stil vermek istediğiniz elemana `[ngClass]` ekleyin ve bir ifadeye eşitleyin.
Bu durumda, `isSpecial` `app.component.ts` içinde `true` olarak ayarlanmış bir boolean'dır.
`isSpecial` true olduğundan, `ngClass` `<div>`'e `special` sınıfını uygular.

<docs-code header="app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" region="special-div"/>

### Using `NgClass` with a method

1. `NgClass`'i bir yöntemle kullanmak için, yöntemi bileşen sınıfına ekleyin.
   Aşağıdaki örnekte, `setCurrentClasses()`, `currentClasses` özelliğini diğer üç bileşen özelliğinin `true` veya `false` durumuna göre üç sınıfı ekleyen veya kaldıran bir nesne ile ayarlar.

   Nesnenin her anahtarı bir CSS sınıf adıdır.
   Bir anahtar `true` ise, `ngClass` sınıfı ekler.
   Bir anahtar `false` ise, `ngClass` sınıfı kaldırır.

   <docs-code header="app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" region="setClasses"/>

1. Şablonda, elemanın sınıflarını ayarlamak için `ngClass` özellik bağlamasını `currentClasses`'a ekleyin:

   <docs-code header="app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" region="NgClass-1"/>

Bu kullanım durumu için Angular, sınıfları başlatmada ve `currentClasses` nesnesinin yeniden atanmasının neden olduğu değişiklikler durumunda uygular.
Tam örnek, ilk olarak `ngOnInit()` ile ve kullanıcı `Refresh currentClasses` düğmesine tıkladığında `setCurrentClasses()`'ı çağırır.
Bu adımlar `ngClass`'i uygulamak için gerekli değildir.

## Setting inline styles with `NgStyle`

HELPFUL: _Tek_ bir stili eklemek veya kaldırmak için `NgStyle` yerine [stil bağlamalarını](guide/templates/binding#css-class-and-style-property-bindings) kullanın.

### Import `NgStyle` in the component

`NgStyle` kullanmak için bileşenin `imports` listesine ekleyin.

```angular-ts
import {NgStyle} from '@angular/common';

@Component({
  /* ... */
  imports: [NgStyle],
})
export class AppComponent {}
```

Bileşenin durumuna göre aynı anda birden fazla satır içi stili ayarlamak için `NgStyle` kullanın.

1. `NgStyle` kullanmak için bileşen sınıfına bir yöntem ekleyin.

   Aşağıdaki örnekte, `setCurrentStyles()`, diğer üç bileşen özelliğinin durumuna göre üç stili tanımlayan bir nesne ile `currentStyles` özelliğini ayarlar.

   <docs-code header="app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" region="setStyles"/>

1. Elemanın stillerini ayarlamak için `currentStyles`'a bir `ngStyle` özellik bağlaması ekleyin.

   <docs-code header="app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" region="NgStyle-2"/>

Bu kullanım durumu için Angular, stilleri başlatmada ve değişiklikler durumunda uygular.
Bunu yapmak için tam örnek, ilk olarak `ngOnInit()` ile ve bağımlı özellikler bir düğme tıklamasıyla değiştiğinde `setCurrentStyles()`'ı çağırır.
Ancak bu adımlar `ngStyle`'ı kendi başına uygulamak için gerekli değildir.

## Hosting a directive without a DOM element

Angular `<ng-container>`, Angular'ın DOM'a yerleştirmediği için stilleri veya düzeni etkilemeyen bir gruplama elemanıdır.

Direktifi barındıracak tek bir eleman olmadığında `<ng-container>` kullanın.

İşte `<ng-container>` kullanan koşullu bir paragraf.

<docs-code header="app.component.html (ngif-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" region="ngif-ngcontainer"/>

<img alt="ngcontainer paragraph with proper style" src="assets/images/guide/structural-directives/good-paragraph.png">

1. `FormsModule`'dan `ngModel` direktifini içe aktarın.

1. `FormsModule`'ü ilgili Angular modülünün imports bölümüne ekleyin.

1. Bir `<option>`'ı koşullu olarak hariç tutmak için `<option>`'ı bir `<ng-container>` içine sarın.

   <docs-code header="app.component.html (select-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" region="select-ngcontainer"/>

   <img alt="ngcontainer options work properly" src="assets/images/guide/structural-directives/select-ngcontainer-anim.gif">

## What's next

<docs-pill-row>
  <docs-pill href="guide/directives/attribute-directives" title="Attribute Directives"/>
  <docs-pill href="guide/directives/structural-directives" title="Structural Directives"/>
  <docs-pill href="guide/directives/directive-composition-api" title="Directive composition API"/>
</docs-pill-row>
