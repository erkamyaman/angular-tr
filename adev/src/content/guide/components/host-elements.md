# Bileşen host elemanları

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okuduğunuzu varsayar. Angular'da yeniyseniz önce onu okuyun.

Angular, bileşenin seçicisiyle eşleşen her HTML elemanı için bileşenin bir örneğini oluşturur. Bir bileşenin seçicisiyle eşleşen DOM elemanı, o bileşenin **host elemanı**dır. Bir bileşenin şablonunun içeriği, host elemanı içerisinde render edilir.

```angular-ts
// Bileşen kaynağı
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo" />`,
})
export class ProfilePhoto {}
```

```angular-html
<!-- Bileşeni kullanma -->
<h3>Your profile photo</h3>
<profile-photo />
<button>Upload a new profile photo</button>
```

```angular-html
<!-- Render edilmiş DOM -->
<h3>Your profile photo</h3>
<profile-photo>
  <img src="profile-photo.jpg" alt="Your profile photo" />
</profile-photo>
<button>Upload a new profile photo</button>
```

Yukarıdaki örnekte, `<profile-photo>` bileşeni `ProfilePhoto` bileşenin host elemanıdır.

## Host elemanına bağlama {#binding-to-the-host-element}

Bir bileşen, host elemanına özellikler, nitelikler, stiller ve olaylar bağlayabilir. Bu, bileşenin şablonu içerisindeki elemanlardaki bağlamalarla aynı şekilde çalışır, ancak `@Component` dekoratöründeki `host` özelliği ile tanımlanır:

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

NOTE: Bir olay adının önüne eklenebilecek genel hedef adları `document:`, `window:` ve `body:` dir.

NOTE: `'(keydown.enter)'` gibi tuş adları, kullanıcının klavye düzenine ve giriş diline bağlı olan
`KeyboardEvent.key` ile eşleştirilir. Düzenden bağımsız olarak fiziksel bir tuşu eşleştirmek için bunun yerine
`code` değiştiricisini kullanın, örneğin `'(keydown.code.Enter)'`. Ayrıntılar için
[Tuş değiştiricilerini kullanma](guide/templates/event-listeners#using-key-modifiers) bölümüne bakın.

## `@HostBinding` ve `@HostListener` dekoratörleri

Alternatif olarak, sınıf üyelerine `@HostBinding` ve `@HostListener` dekoratörlerini uygulayarak host elemanına bağlama yapabilirsiniz.

`@HostBinding`, host özelliklerini ve niteliklerini özellikler ve getter'lara bağlamanıza olanak tanır:

```ts
@Component({/* ... */})
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

`@HostListener`, host elemanına olay dinleyicileri bağlamanıza olanak tanır. Dekoratör bir olay adı ve isteğe bağlı bir argüman dizisi kabul eder:

```ts
export class CustomSlider {
  @HostListener('keydown', ['$event'])
  updateValue(event: KeyboardEvent) {
    /* ... */
  }
}
```

<docs-callout critical title="Dekoratörler yerine `host` özelliğini tercih edin">
  **Her zaman `@HostBinding` ve `@HostListener` yerine `host` özelliğini kullanmayı tercih edin.** Bu dekoratörler yalnızca geriye dönük uyumluluk için mevcuttur.
</docs-callout>

## Bağlama çakışmaları

Bir şablonda bileşen kullanırken, o bileşenin elemanına bağlamalar uygulayabilirsiniz. Bileşen (veya ona uygulanan direktifler) aynı özellikler, nitelikler, sınıflar veya stiller için de host bağlamaları tanımlayabilir.

Angular'ın bu çakışmaları nasıl ele aldığı bağlamanın türüne bağlıdır:

### Sınıf ve stil bağlamaları

Sınıf ve stil bağlamalarının tanımlı bir öncelik sırası vardır. Şablonda tanımlanan bağlamalar, direktifler veya bileşenler üzerinde tanımlanan host bağlamalarına göre önceliklidir:

1. **Şablon bağlamaları** (örn. `[class.active]` veya `[style.color]`)
2. **Statik şablon değerleri** (örn. şablondaki `class="..."` veya `style="..."`)
3. **Direktif host bağlamaları**
4. **Bileşen host bağlamaları**
5. **Statik host değerleri** (örn. `host: {class: '...'}`)

Bir bağlamanın değeri `undefined` ise Angular bir sonraki seviyeye geri döner. `null` değeri ise geri dönmeden sınıfı veya stili kaldırır.

### Özellik ve nitelik çakışmaları

Stil dışı özellikler ve nitelikler için (`id`, `role` veya `[attr.aria-*]` gibi):

- **Statik nitelikler:** Hem şablon hem de bileşen statik bir nitelik tanımlıyorsa (örn. `<my-cmp id="parent">` ve `host: {id: 'child'}`), şablonda ayarlanan nitelik kazanır.
- **Statik ve dinamik:** Bir değer statik, diğeri dinamikse dinamik değer kazanır.
- **Dinamik bağlamalar:** Aynı DOM özelliğine veya niteliğine hem şablonda hem de host bağlamalarıyla bağlama yapmaktan kaçının. Angular yinelenen özellik bağlamalarını uzlaştırmaz; çakışan dinamik bağlamalar, değişiklik algılama yürütme sırasına bağlı olarak beklenmedik üzerine yazmalara yol açabilir.

## CSS özel özellikleri ile stillendirme

Geliştiriciler, bileşen stillerinin esnek yapılandırılmasını sağlamak için sıklıkla [CSS Özel Özellikleri](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties)'ne güvenirler.
Bu tür özel özellikleri host elemanı üzerinde bir [stil bağlaması](guide/templates/binding#css-stil-özellikleri) ile ayarlayabilirsiniz.

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

Bu örnekte, `--my-background` CSS özel özelliği `color` sinyaline bağlıdır. Özel özelliğin değeri, `color` sinyali her değiştiğinde otomatik olarak güncellenecektir. Bu, mevcut bileşeni ve bu özel özelliğe dayanan tüm alt bileşenleri etkileyecektir.

### Alt bileşenlerde özel özellikleri ayarlama

Alternatif olarak, alt bileşenlerin host elemanı üzerinde bir [stil bağlaması](guide/templates/binding#css-stil-özellikleri) ile CSS özel özelliklerini ayarlamak da mümkündür.

```angular-ts
@Component({
  selector: 'my-component',
  template: `<my-child [style.--my-background]="color()" />`,
})
export class MyComponent {
  color = signal('lightgreen');
}
```

## Host eleman niteliklerini enjekte etme {#injecting-host-element-attributes}

Bileşenlere ve direktiflere, [`inject`](api/core/inject) fonksiyonu ile birlikte `HostAttributeToken` kullanarak host elemanlarından statik nitelikler okunabilir.

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

HELPFUL: Enjeksiyon isteğe bağlı olarak işaretlenmedikçe, nitelik eksik olduğunda `HostAttributeToken` bir hata verir.
