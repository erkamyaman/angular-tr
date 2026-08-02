<docs-decorative-header title="Direktifler" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
Direktifler, Angular uygulamalarınızdaki elemanlara ve bileşenlere davranış ekler.
</docs-decorative-header>

Bir direktif; bir elemanın nasıl göründüğünü, nasıl davrandığını veya DOM'a nasıl yerleştiğini değiştirebilir. Angular çeşitli yerleşik direktiflerle gelir ve kendi direktiflerinizi de yazabilirsiniz.

## Ne zaman direktif kullanmalı

Direktifler, mevcut bir elemana veya bileşene uygulamak istediğiniz **yeniden kullanılabilir** davranışı kapsüllediklerinde en etkilidir.

Yaygın örnekler şunlardır:

- Otomatik odaklanma veya ipucu balonu gibi aynı görünüm ya da davranışı birçok elemana uygulamak.
- Host elemanının DOM'unu, özniteliklerini veya sınıflarını okumak ya da bunlara yazmak.
- Sahibi olmadığınız bir bileşene, kaynağını değiştirmeden davranış eklemek.

Kendi işaretlemenizi render etmeniz veya kendi şablonu olan bir arayüz parçasını yönetmeniz gerekiyorsa, kendi şablonuna sahip özelleşmiş bir direktif olan [bileşene](guide/components) yönelin.

## Hızlı bir örnek

Kullanıcı fareyle üzerine geldiğinde elemanların vurgulanmasını, yani arka plan renklerinin sarıya dönmesini istediğinizi varsayalım. Aynı olay işleme mantığını her elemanda tekrarlamak yerine, bu davranışı bir direktifte paketleyip ihtiyaç duyduğunuz her yerde uygulayabilirsiniz.

Aşağıdaki `appHighlight` direktifi, fare elemanın üzerine geldiğinde host elemanının arka plan rengini ayarlar ve fare ayrıldığında temizler:

```ts
import {Directive, signal} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'isHovered.set(true)',
    '(mouseleave)': 'isHovered.set(false)',
    '[style.background-color]': 'isHovered() ? "yellow" : null',
  },
})
export class HighlightDirective {
  protected isHovered = signal(false);
}
```

`host` meta verisi, `isHovered` sinyalini güncellemek için fare olaylarını dinler ve host elemanının `background-color` stilini sinyalin değerine bağlar.

Direktifi, seçicisini bir elemana öznitelik olarak ekleyerek uygularsınız:

```angular-html
<p appHighlight>Highlight me!</p>
```

`appHighlight` özniteliğini taşıyan her eleman, mantığı tek bir yerde tanımlanmış olan aynı hover davranışını kazanır.

## Direktif türleri

Angular'da üç temel direktif türü vardır:

| Direktif türü                                                   | Ayrıntılar                                                                                 |
| :-------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| [Bileşenler](guide/components)                                  | Kendi şablonlarına sahip, yeniden kullanılabilir arayüz tanımlar.                          |
| [Öznitelik direktifleri](guide/directives/attribute-directives) | Bir elemanın, bileşenin veya başka bir direktifin görünümünü ya da davranışını değiştirir. |
| [Yapısal direktifler](guide/directives/structural-directives)   | DOM elemanları ekleyip kaldırarak DOM düzenini değiştirir.                                 |

## Sırada ne var

Aşağıdaki kılavuzlarda her direktif türü hakkında daha fazla bilgi edinin.

<docs-pill-row>
  <docs-pill href="guide/directives/attribute-directives" title="Öznitelik direktifleri"/>
  <docs-pill href="guide/directives/structural-directives" title="Yapısal direktifler"/>
  <docs-pill href="guide/directives/directive-composition-api" title="Direktif kompozisyon API'si"/>
</docs-pill-row>
