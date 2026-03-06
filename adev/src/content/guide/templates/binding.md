# Dinamik metin, özellik ve nitelikleri bağlama

Angular'da bir **bağlama (binding)**, bir bileşenin şablonu ile verileri arasında dinamik bir bağlantı oluşturur. Bu bağlantı, bileşenin verilerindeki değişikliklerin işlenmiş şablonu otomatik olarak güncellemesini sağlar.

## Metin interpolasyonu ile dinamik metin işleme

Şablonlarda dinamik metni çifte süslü parantezlerle bağlayabilirsiniz; bu, Angular'a içindeki ifadeden sorumlu olduğunu ve doğru şekilde güncellenmesini sağlamasını bildirir. Buna **metin interpolasyonu** denir.

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

Bu örnekte, parça sayfaya işlendiğinde Angular `{{ theme }}` yerine `dark` koyacaktır.

```angular-html
<!-- İşlenmiş Çıktı -->
<p>Your color preference is dark.</p>
```

Zaman içinde değişen bağlamalar değerleri [signal'lerden](/guide/signals) okumalıdırlar. Angular, şablonda okunan signal'leri takip eder ve bu signal değerleri değiştiğinde işlenmiş sayfayı günceller.

```angular-ts
@Component({
  template: `
    <!-- `welcomeMessage` değiştiğinde mutlaka güncellenmez. -->
    <p>{{ welcomeMessage }}</p>

    <p>Your color preference is {{ theme() }}.</p> <!-- `theme` signal'inin değeri değiştiğinde her zaman güncellenir. -->
  `
  ...
})
export class App {
  welcomeMessage = "Welcome, enjoy this app that we built for you";
  theme = signal('dark');
}
```

Daha fazla bilgi için [Signal'ler rehberine](/guide/signals) bakın.

Tema örneğiyle devam edersek, bir kullanıcı sayfa yüklendikten sonra `theme` signal'ini `'light'` olarak güncelleyen bir butona tıklarsa, sayfa buna uygun olarak güncellenir:

```angular-html
<!-- İşlenmiş Çıktı -->
<p>Your color preference is light.</p>
```

Metin interpolasyonunu HTML'de normalde metin yazdığınız her yerde kullanabilirsiniz.

Tüm ifade değerleri bir dizgeye dönüştürülür. Nesneler ve diziler değerin `toString` yöntemi kullanılarak dönüştürülür.

## Dinamik özellik ve nitelikleri bağlama

Angular, köşeli parantezlerle nesne özelliklerine ve HTML niteliklerine dinamik değerler bağlamayı destekler.

Bir HTML elemanının DOM örneğindeki, bir [bileşenin](guide/components) örneğindeki veya bir [direktifin](guide/directives) örneğindeki özelliklere bağlama yapabilirsiniz.

### Yerel eleman özellikleri

Her HTML elemanının karşılık gelen bir DOM temsili vardır. Örneğin, her `<button>` HTML elemanı DOM'da bir `HTMLButtonElement` örneğine karşılık gelir. Angular'da, elemanların DOM temsiline doğrudan değer ayarlamak için özellik bağlamalarını kullanırsınız.

```angular-html
<!-- Button elemanının DOM nesnesindeki `disabled` özelliğini bağla -->
<button [disabled]="isFormValid()">Save</button>
```

Bu örnekte, `isFormValid` her değiştiğinde Angular otomatik olarak `HTMLButtonElement` örneğinin `disabled` özelliğini ayarlar.

### Bileşen ve direktif özellikleri

Bir eleman Angular bileşeni olduğunda, aynı köşeli parantez sözdizimini kullanarak bileşen giriş özelliklerini ayarlamak için özellik bağlamalarını kullanabilirsiniz.

```angular-html
<!-- `MyListbox` bileşen örneğindeki `value` özelliğini bağla. -->
<my-listbox [value]="mySelection()" />
```

Bu örnekte, `mySelection` her değiştiğinde Angular otomatik olarak `MyListbox` örneğinin `value` özelliğini ayarlar.

Direktif özelliklerine de bağlama yapabilirsiniz.

```angular-html
<!-- `NgOptimizedImage` direktifinin `ngSrc` özelliğine bağla  -->
<img [ngSrc]="profilePhotoUrl()" alt="The current user's profile photo" />
```

### Nitelikler

Karşılık gelen DOM özellikleri olmayan HTML niteliklerini (örneğin SVG nitelikleri) ayarlamanız gerektiğinde, şablonunuzdaki elemanlara `attr.` öneki ile nitelik bağlayabilirsiniz.

<!-- prettier-ignore -->
```angular-html
<!-- `<ul>` elemanındaki `role` niteliğini bileşenin `listRole` özelliğine bağla. -->
<ul [attr.role]="listRole()">
```

Bu örnekte, `listRole` her değiştiğinde Angular otomatik olarak `setAttribute` çağırarak `<ul>` elemanının `role` niteliğini ayarlar.

Bir nitelik bağlamasının değeri `null` ise, Angular `removeAttribute` çağırarak niteliği kaldırır.

### Özellik ve niteliklerde metin interpolasyonu

Özellik ve niteliklerde metin interpolasyonu sözdizimini de kullanabilirsiniz; bunun için özellik veya nitelik adının etrafında köşeli parantezler yerine çifte süslü parantez sözdizimini kullanırsınız. Bu sözdizimini kullandığınızda Angular, atama işlemini bir özellik bağlaması olarak değerlendirir.

```angular-html
<!-- Görsel elemanının DOM nesnesindeki `alt` özelliğine bir değer bağlar. -->
<img src="profile-photo.jpg" alt="Profile photo of {{ firstName() }}" />
```

## CSS sınıfı ve stil özelliği bağlamaları

Angular, elemanlara CSS sınıflarını ve CSS stil özelliklerini bağlamak için ek özellikler destekler.

### CSS sınıfları

Bağlı değerin [truthy veya falsy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) olmasına göre bir elemana CSS sınıfı koşullu olarak eklemek veya kaldırmak için bir CSS sınıf bağlaması oluşturabilirsiniz.

<!-- prettier-ignore -->
```angular-html
<!-- `isExpanded` truthy olduğunda `expanded` CSS sınıfını ekle. -->
<ul [class.expanded]="isExpanded()">
```

Ayrıca doğrudan `class` özelliğine bağlama da yapabilirsiniz. Angular üç tür değeri kabul eder:

| `class` değerinin açıklaması                                                                                                                                       | TypeScript türü       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| Boşlukla ayrılmış bir veya daha fazla CSS sınıfı içeren bir dizge                                                                                                  | `string`              |
| CSS sınıf dizgelerinden oluşan bir dizi                                                                                                                            | `string[]`            |
| Her özellik adının bir CSS sınıf adı olduğu ve karşılık gelen her değerin o sınıfın elemana uygulanıp uygulanmayacağını truthy değerine göre belirlediği bir nesne | `Record<string, any>` |

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

Yukarıdaki örnek aşağıdaki DOM'u işler:

<!-- prettier-ignore -->
```angular-html
<ul class="full-width outlined"> ... </ul>
<section class="expandable elevated"> ... </section>
<button class="highlighted"> ... </button>
```

Angular geçerli CSS sınıf adları olmayan dizge değerlerini yok sayar.

Statik CSS sınıflarını, doğrudan `class` bağlamasını ve belirli sınıf bağlamalarını birlikte kullanırken Angular, işlenmiş sonuçta tüm sınıfları akıllı bir şekilde birleştirir.

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

Yukarıdaki örnekte Angular, `ul` elemanını üç CSS sınıfının tümünü uygulayarak işler.

<!-- prettier-ignore -->
```angular-html
<ul class="list box expanded">
```

Angular, işlenmiş elemanlardaki CSS sınıflarının belirli bir sırasını garanti etmez.

`class`'ı bir diziye veya nesneye bağlarken, Angular önceki değeri mevcut değerle üçlü eşittir operatörü (`===`) kullanarak karşılaştırır. Angular'ın güncellemeleri uygulayabilmesi için bu değerleri değiştirdiğinizde yeni bir nesne veya dizi örneği oluşturmanız gerekir.

Bir eleman aynı CSS sınıfı için birden fazla bağlamaya sahipse, Angular stil öncelik sırasına göre çatışmaları çözümler.

NOTE: Sınıf bağlamaları, tek bir anahtarda boşlukla ayrılmış sınıf adlarını desteklemez. Ayrıca bağlama referansı aynı kaldığı için nesnelerdeki mutasyonları da algılayamaz. Bunlardan birini veya diğerini kullanmanız gerekiyorsa, [ngClass](/api/common/NgClass) direktifini kullanın.

### CSS stil özellikleri

Ayrıca doğrudan bir elemana CSS stil özelliklerini de bağlayabilirsiniz.

<!-- prettier-ignore -->
```angular-html
<!-- `isExpanded` özelliğine göre CSS `display` özelliğini ayarla. -->
<section [style.display]="isExpanded() ? 'block' : 'none'">
```

Birim kabul eden CSS özellikleri için birimleri de belirtebilirsiniz.

<!-- prettier-ignore -->
```angular-html
<!-- `sectionHeightInPixels` özelliğine göre CSS `height` özelliğini piksel değeri olarak ayarla. -->
<section [style.height.px]="sectionHeightInPixels()">
```

Ayrıca bir bağlamada birden fazla stil değerini de ayarlayabilirsiniz. Angular aşağıdaki değer türlerini kabul eder:

| `style` değerinin açıklaması                                                                                           | TypeScript türü       |
| ---------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Sıfır veya daha fazla CSS bildirimi içeren bir dizge, örneğin `"display: flex; margin: 8px"`.                          | `string`              |
| Her özellik adının bir CSS özellik adı olduğu ve karşılık gelen her değerin o CSS özelliğinin değeri olduğu bir nesne. | `Record<string, any>` |

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

Yukarıdaki örnek aşağıdaki DOM'u işler.

<!-- prettier-ignore -->
```angular-html
<ul style="display: flex; padding: 8px"> ... </ul>
<section style="border: 1px solid black; font-weight: bold"> ... </section>
```

`style`'ı bir nesneye bağlarken, Angular önceki değeri mevcut değerle üçlü eşittir operatörü (`===`) kullanarak karşılaştırır. Angular'ın güncellemeleri uygulayabilmesi için bu değerleri değiştirdiğinizde yeni bir nesne örneği oluşturmanız gerekir.

Bir eleman aynı stil özelliği için birden fazla bağlamaya sahipse, Angular stil öncelik sırasına göre çatışmaları çözümler.

## ARIA nitelikleri

Angular, ARIA niteliklerine dizge değerleri bağlamayı destekler.

```angular-html
<button type="button" [aria-label]="actionLabel()">
  {{ actionLabel() }}
</button>
```

Angular, dizge değerini elemanın `aria-label` niteliğine yazar ve bağlı değer `null` olduğunda kaldırır.

Bazı ARIA özellikleri, yapılı değerler (örneğin eleman referansları) kabul eden DOM özellikleri veya direktif girişleri sunar. Bu durumlar için standart özellik bağlamalarını kullanın. Örnekler ve ek rehberlik için [erişilebilirlik rehberine](best-practices/a11y#aria-özellikleri-ve-nitelikleri) bakın.
