# Binding dynamic text, properties and attributes

Angular'da bir **bağlama (binding)**, bir bilesenin sablonu ile verileri arasinda dinamik bir baglanti olusturur. Bu baglanti, bilesenin verilerindeki degisikliklerin islenmis sablonu otomatik olarak guncellemesini saglar.

## Render dynamic text with text interpolation

Sablonlarda dinamik metni cifte suslu parantezlerle baglayabilirsiniz; bu, Angular'a icindeki ifadeden sorumlu oldugunu ve dogru sekilde guncellenmesini saglamasini bildirir. Buna **metin interpolasyonu** denir.

```angular-ts
@Component({
  template: `
    <p>Your color preference is {{ theme }}.</p>
  `,
  ...
})
export class App {
  theme = 'dark';
}
```

Bu ornekte, parca sayfaya islendiginde Angular `{{ theme }}` yerine `dark` koyacaktir.

```angular-html
<!-- Rendered Output -->
<p>Your color preference is dark.</p>
```

Zaman icinde degisen baglamalar degerleri [signal'lerden](/guide/signals) okumalidirlar. Angular, sablonda okunan signal'leri takip eder ve bu signal degerleri degistiginde islenmis sayfayi gunceller.

```angular-ts
@Component({
  template: `
    <!-- Does not necessarily update when `welcomeMessage` changes. -->
    <p>{{ welcomeMessage }}</p>

    <p>Your color preference is {{ theme() }}.</p> <!-- Always updates when the value of the `theme` signal changes. -->
  `
  ...
})
export class App {
  welcomeMessage = "Welcome, enjoy this app that we built for you";
  theme = signal('dark');
}
```

Daha fazla bilgi icin [Signal'ler rehberine](/guide/signals) bakin.

Tema ornegiyle devam edersek, bir kullanici sayfa yuklendikten sonra `theme` signal'ini `'light'` olarak guncelleyen bir butona tiklarsa, sayfa buna uygun olarak guncellenir:

```angular-html
<!-- Rendered Output -->
<p>Your color preference is light.</p>
```

Metin interpolasyonunu HTML'de normalde metin yazdginiz her yerde kullanabilirsiniz.

Tum ifade degerleri bir dizgeye donusturulur. Nesneler ve diziler degerin `toString` yontemi kullanilarak donusturulur.

## Binding dynamic properties and attributes

Angular, koseli parantezlerle nesne ozelliklerine ve HTML niteliklerine dinamik degerler baglamayi destekler.

Bir HTML elemaninin DOM ornegindeki, bir [bilesenin](guide/components) ornegindeki veya bir [direktifin](guide/directives) ornegindeki ozelliklere baglama yapabilirsiniz.

### Native element properties

Her HTML elemaninin karsilik gelen bir DOM temsili vardir. Ornegin, her `<button>` HTML elemani DOM'da bir `HTMLButtonElement` ornegine karsilik gelir. Angular'da, elemanlarin DOM temsiline dogrudan deger ayarlamak icin ozellik baglamalarini kullanirsiniz.

```angular-html
<!-- Bind the `disabled` property on the button element's DOM object -->
<button [disabled]="isFormValid()">Save</button>
```

Bu ornekte, `isFormValid` her degistiginde Angular otomatik olarak `HTMLButtonElement` orneginin `disabled` ozelligini ayarlar.

### Component and directive properties

Bir eleman Angular bileseni oldugunda, ayni koseli parantez sozdizimini kullanarak bilesen giris ozelliklerini ayarlamak icin ozellik baglamalarini kullanabilirsiniz.

```angular-html
<!-- Bind the `value` property on the `MyListbox` component instance. -->
<my-listbox [value]="mySelection()" />
```

Bu ornekte, `mySelection` her degistiginde Angular otomatik olarak `MyListbox` orneginin `value` ozelligini ayarlar.

Direktif ozelliklerine de baglama yapabilirsiniz.

```angular-html
<!-- Bind to the `ngSrc` property of the `NgOptimizedImage` directive  -->
<img [ngSrc]="profilePhotoUrl()" alt="The current user's profile photo" />
```

### Attributes

Karsilik gelen DOM ozellikleri olmayan HTML niteliklerini (ornegin SVG nitelikleri) ayarlamaniz gerektiginde, sablonunuzdaki elemanlara `attr.` oneki ile nitelik baglayabilirsiniz.

<!-- prettier-ignore -->
```angular-html
<!-- Bind the `role` attribute on the `<ul>` element to the component's `listRole` property. -->
<ul [attr.role]="listRole()">
```

Bu ornekte, `listRole` her degistiginde Angular otomatik olarak `setAttribute` cagirarak `<ul>` elemaninin `role` nitelligini ayarlar.

Bir nitelik baglamasinin degeri `null` ise, Angular `removeAttribute` cagirarak niteligi kaldirir.

### Text interpolation in properties and attributes

Ozellik ve niteliklerde metin interpolasyonu sozdizimini de kullanabilirsiniz; bunun icin ozellik veya nitelik adinin etrafinda koseli parantezler yerine cifte suslu parantez sozdizimini kullanirsiniz. Bu sozdizimini kullandiginizda Angular, atama islemini bir ozellik baglamasi olarak degerlendirir.

```angular-html
<!-- Binds a value to the `alt` property of the image element's DOM object. -->
<img src="profile-photo.jpg" alt="Profile photo of {{ firstName() }}" />
```

## CSS class and style property bindings

Angular, elemanlara CSS siniflarini ve CSS stil ozelliklerini baglamak icin ek ozellikler destekler.

### CSS classes

Bagli degerin [truthy veya falsy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) olmasina gore bir elemana CSS sinifi kosullu olarak eklemek veya kaldirmak icin bir CSS sinif baglamasi olusturabilirsiniz.

<!-- prettier-ignore -->
```angular-html
<!-- When `isExpanded` is truthy, add the `expanded` CSS class. -->
<ul [class.expanded]="isExpanded()">
```

Ayrica dogrudan `class` ozelligine baglama da yapabilirsiniz. Angular uc tur degeri kabul eder:

| `class` degerinin aciklamasi                                                                                                                                       | TypeScript turu       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| Boslukla ayrilmis bir veya daha fazla CSS sinifi iceren bir dizge                                                                                                  | `string`              |
| CSS sinif dizgelerinden olusan bir dizi                                                                                                                            | `string[]`            |
| Her ozellik adinin bir CSS sinif adi oldugu ve karsilik gelen her degerin o sinifin elemana uygulanip uygulanmayacagini truthy degerine gore belirledigi bir nesne | `Record<string, any>` |

```angular-ts
@Component({
  template: `
    <ul [class]="listClasses"> ... </ul>
    <section [class]="sectionClasses()"> ... </section>
    <button [class]="buttonClasses()"> ... </button>
  `,
  ...
})
export class UserProfile {
  listClasses = 'full-width outlined';
  sectionClasses = signal(['expandable', 'elevated']);
  buttonClasses = signal({
    highlighted: true,
    embiggened: false,
  });
}
```

Yukaridaki ornek asagidaki DOM'u isler:

<!-- prettier-ignore -->
```angular-html
<ul class="full-width outlined"> ... </ul>
<section class="expandable elevated"> ... </section>
<button class="highlighted"> ... </button>
```

Angular gecerli CSS sinif adlari olmayan dizge degerlerini yok sayar.

Statik CSS siniflarini, dogrudan `class` baglamasini ve belirli sinif baglamalarini birlikte kullanirken Angular, islenmis sonucta tum siniflari akilli bir sekilde birlestirir.

```angular-ts
@Component({
  template: `<ul class="list" [class]="listType()" [class.expanded]="isExpanded()"> ...`,
  ...
})
export class Listbox {
  listType = signal('box');
  isExpanded = signal(true);
}
```

Yukaridaki ornekte Angular, `ul` elemanini uc CSS sinifinin tumunu uygulayarak isler.

<!-- prettier-ignore -->
```angular-html
<ul class="list box expanded">
```

Angular, islenmis elemanlardaki CSS siniflarinin belirli bir sirasini garanti etmez.

`class`'i bir diziye veya nesneye baglarken, Angular onceki degeri mevcut degerle uclu esittir operatoru (`===`) kullanarak karsilastirir. Angular'in guncellemeleri uygulayabilmesi icin bu degerleri degistirdiginizde yeni bir nesne veya dizi ornegi olusturmaniz gerekir.

Bir eleman ayni CSS sinifi icin birden fazla baglamaya sahipse, Angular stil oncelik sirasina gore catismalari cozumler.

NOTE: Sinif baglamalari, tek bir anahtarda boslukla ayrilmis sinif adlarini desteklemez. Ayrica baglama referansi ayni kaldigi icin nesnelerdeki mutasyonlari da algilayamaz. Bunlardan birini veya digerini kullanmaniz gerekiyorsa, [ngClass](/api/common/NgClass) direktifini kullanin.

### CSS style properties

Ayrica dogrudan bir elemana CSS stil ozelliklerini de baglayabilirsiniz.

<!-- prettier-ignore -->
```angular-html
<!-- Set the CSS `display` property based on the `isExpanded` property. -->
<section [style.display]="isExpanded() ? 'block' : 'none'">
```

Birim kabul eden CSS ozellikleri icin birimleri de belirtebilirsiniz.

<!-- prettier-ignore -->
```angular-html
<!-- Set the CSS `height` property to a pixel value based on the `sectionHeightInPixels` property. -->
<section [style.height.px]="sectionHeightInPixels()">
```

Ayrica bir baglamada birden fazla stil degerini de ayarlayabilirsiniz. Angular asagidaki deger turlerini kabul eder:

| `style` degerinin aciklamasi                                                                                           | TypeScript turu       |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Sifir veya daha fazla CSS bildirimi iceren bir dizge, ornegin `"display: flex; margin: 8px"`.                          | `string`              |
| Her ozellik adinin bir CSS ozellik adi oldugu ve karsilik gelen her degerin o CSS ozelliginin degeri oldugu bir nesne. | `Record<string, any>` |

```angular-ts
@Component({
  template: `
    <ul [style]="listStyles()"> ... </ul>
    <section [style]="sectionStyles()"> ... </section>
  `,
  ...
})
export class UserProfile {
  listStyles = signal('display: flex; padding: 8px');
  sectionStyles = signal({
    border: '1px solid black',
    'font-weight': 'bold',
  });
}
```

Yukaridaki ornek asagidaki DOM'u isler.

<!-- prettier-ignore -->
```angular-html
<ul style="display: flex; padding: 8px"> ... </ul>
<section style="border: 1px solid black; font-weight: bold"> ... </section>
```

`style`'i bir nesneye baglarken, Angular onceki degeri mevcut degerle uclu esittir operatoru (`===`) kullanarak karsilastirir. Angular'in guncellemeleri uygulayabilmesi icin bu degerleri degistirdiginizde yeni bir nesne ornegi olusturmaniz gerekir.

Bir eleman ayni stil ozelligi icin birden fazla baglamaya sahipse, Angular stil oncelik sirasina gore catismalari cozumler.

## ARIA attributes

Angular, ARIA niteliklerine dizge degerleri baglamayi destekler.

```angular-html
<button type="button" [aria-label]="actionLabel()">
  {{ actionLabel() }}
</button>
```

Angular, dizge degerini elemanin `aria-label` nitelligine yazar ve bagli deger `null` oldugunda kaldirrir.

Bazi ARIA ozellikleri, yapili degerler (ornegin eleman referanslari) kabul eden DOM ozellikleri veya direktif girisleri sunar. Bu durumlar icin standart ozellik baglamalarini kullanin. Ornekler ve ek rehberlik icin [erisilebilirlik rehberine](best-practices/a11y#aria-attributes-and-properties) bakin.
