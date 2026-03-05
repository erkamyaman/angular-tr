# Component host elements

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okudugunuzu varsayar. Angular'da yeniyseniz once onu okuyun.

Angular, bilesnenin secicisiyle eslesen her HTML elemani icin bilesnenin bir ornegini olusturur. Bir bilesnenin secicisiyle eslesen DOM elemani, o bilesnenin **host elemani**dir. Bir bilesnenin sablonunun icerigi, host elemani icerisinde render edilir.

```angular-ts
// Component source
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo" />`,
})
export class ProfilePhoto {}
```

```angular-html
<!-- Using the component -->
<h3>Your profile photo</h3>
<profile-photo />
<button>Upload a new profile photo</button>
```

```angular-html
<!-- Rendered DOM -->
<h3>Your profile photo</h3>
<profile-photo>
  <img src="profile-photo.jpg" alt="Your profile photo" />
</profile-photo>
<button>Upload a new profile photo</button>
```

Yukaridaki ornekte, `<profile-photo>` bileseni `ProfilePhoto` bilesnenin host elemanidir.

## Binding to the host element

Bir bilesen, host elemanina ozellikler, nitelikler, stiller ve olaylar baglayabilir. Bu, bilesnenin sablonu icerisindeki elemanlardaki baglamalarla ayni sekilde calisir, ancak `@Component` dekoratorundeki `host` ozelligi ile tanimlanir:

```angular-ts
@Component({
  ...,
  host: {
    'role': 'slider',
    '[attr.aria-valuenow]': 'value',
    '[class.active]': 'isActive()',
    '[style.background]' : `hasError() ? 'red' : 'green'`,
    '[tabIndex]': 'disabled ? -1 : 0',
    '(keydown)': 'updateValue($event)',
  },
})
export class CustomSlider {
  value: number = 0;
  disabled: boolean = false;
  isActive = signal(false);
  hasError = signal(false);
  updateValue(event: KeyboardEvent) { /* ... */ }

  /* ... */
}
```

NOTE: Bir olay adinin onune eklenebilecek genel hedef adlari `document:`, `window:` ve `body:` dir.

## The `@HostBinding` and `@HostListener` decorators

Alternatif olarak, sinif uyelerine `@HostBinding` ve `@HostListener` dekoratorlerini uygulayarak host elemanina baglama yapabilirsiniz.

`@HostBinding`, host ozelliklerini ve niteliklerini ozellikler ve getter'lara baglamaniza olanak tanir:

```ts
@Component({
  /* ... */
})
export class CustomSlider {
  @HostBinding('attr.aria-valuenow')
  value: number = 0;

  @HostBinding('tabIndex')
  get tabIndex() {
    return this.disabled ? -1 : 0;
  }

  /* ... */
}
```

`@HostListener`, host elemanina olay dinleyicileri baglamaniza olanak tanir. Dekorator bir olay adi ve istege bagli bir arguman dizisi kabul eder:

```ts
export class CustomSlider {
  @HostListener('keydown', ['$event'])
  updateValue(event: KeyboardEvent) {
    /* ... */
  }
}
```

<docs-callout critical title="Prefer using the `host` property over the decorators">
  **Her zaman `@HostBinding` ve `@HostListener` yerine `host` ozelligini kullanmayi tercih edin.** Bu dekoratorler yalnizca geriye donuk uyumluluk icin mevcuttur.
</docs-callout>

## Binding collisions

Bir sablonda bilesen kullandiginizda, o bilesen orneginin elemanina baglamalar ekleyebilirsiniz. Bilesen ayni zamanda ayni ozellikler veya nitelikler icin host baglamalari da tanimlayabilir.

```angular-ts
@Component({
  ...,
  host: {
    'role': 'presentation',
    '[id]': 'id',
  }
})
export class ProfilePhoto { /* ... */ }
```

```angular-html
<profile-photo role="group" [id]="otherId" />
```

Bu gibi durumlarda, hangi degerin kazanacagini asagidaki kurallar belirler:

- Her iki deger de statikse, ornek baglamasi kazanir.
- Bir deger statik ve digeri dinamikse, dinamik deger kazanir.
- Her iki deger de dinamikse, bilesnenin host baglamasi kazanir.

## Styling with CSS custom properties

Gelistiriciler, bilesen stillerinin esnek yapilandirilmasini saglamak icin siklikla [CSS Ozel Ozellikleri](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)'ne guvenirler.
Bu tur ozel ozellikleri host elemani uzerinde bir [stil baglamasi][stil baglamasi](guide/templates/binding#css-style-properties) ile ayarlayabilirsiniz.

```angular-ts
@Component({
  /* ... */
  host: {
    '[style.--my-background]': 'color()',
  },
})
export class MyComponent {
  color = signal('lightgreen');
}
```

Bu ornekte, `--my-background` CSS ozel ozelligi `color` sinyaline baglidir. Ozel ozelligin degeri, `color` sinyali her degistiginde otomatik olarak guncellenecektir. Bu, mevcut bileseni ve bu ozel ozellige dayanan tum alt bilesenleri etkileyecektir.

### Setting custom properties on children components

Alternatif olarak, alt bilesenlerin host elemani uzerinde bir [stil baglamasi](guide/templates/binding#css-style-properties) ile CSS ozel ozelliklerini ayarlamak da mumkundur.

```angular-ts
@Component({
  selector: 'my-component',
  template: `<my-child [style.--my-background]="color()" />`,
})
export class MyComponent {
  color = signal('lightgreen');
}
```

## Injecting host element attributes

Bilesenlere ve direktiflere, [`inject`](api/core/inject) fonksiyonu ile birlikte `HostAttributeToken` kullanarak host elemanlarindan statik nitelikler okunabilir.

```ts
import { Component, HostAttributeToken, inject } from '@angular/core';

@Component({
  selector: 'app-button',
  ...,
})
export class Button {
  variation = inject(new HostAttributeToken('variation'));
}
```

```angular-html
<app-button variation="primary">Click me</app-button>
```

HELPFUL: Enjeksiyon istege bagli olarak isaretlenmedikce, nitelik eksik oldugunda `HostAttributeToken` bir hata verir.
