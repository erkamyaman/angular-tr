<docs-decorative-header title="Şablonlar" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
Dinamik kullanıcı arayüzleri oluşturmak için Angular'ın şablon sözdizimini kullanın.
</docs-decorative-header>

Bileşen şablonları sadece statik HTML değildir -- bileşen sınıfınızdaki verileri kullanabilir ve kullanıcı etkileşimi için işleyiciler kurabilir.

## Dinamik Metin Gösterme

Angular'da bir _bağlama (binding)_, bir bileşenin şablonu ile verileri arasında dinamik bir bağlantı oluşturur. Bu bağlantı, bileşenin verilerindeki değişikliklerin render edilen şablonu otomatik olarak güncellemesini sağlar.

Bir şablonda dinamik metin göstermek için çift süslü parantez kullanarak bir bağlama oluşturabilirsiniz:

```angular-ts
@Component({
  selector: 'user-profile',
  template: `<h1>Profile for {{ userName() }}</h1>`,
})
export class UserProfile {
  userName = signal('pro_programmer_123');
}
```

Angular bileşeni render ettiğinde şunu görürsünüz:

```html
<h1>Profile for pro_programmer_123</h1>
```

Angular, sinyalin değeri değiştiğinde bağlamayı otomatik olarak güncel tutar. Yukarıdaki örneği temel alarak, `userName` sinyalinin değerini güncellersek:

```typescript
this.userName.set('cool_coder_789');
```

Render edilen sayfa yeni değeri yansıtacak şekilde güncellenir:

```html
<h1>Profile for cool_coder_789</h1>
```

## Dinamik Özellikler ve Öznitelikler Ayarlama

Angular, köşeli parantezlerle DOM özelliklerine dinamik değerler bağlamayı destekler:

```angular-ts
@Component({
  /*...*/
  // `isValidUserId` değerine göre butonun `disabled` özelliğini ayarla.
  template: `<button [disabled]="!isValidUserId()">Save changes</button>`,
})
export class UserProfile {
  isValidUserId = signal(false);
}
```

Ayrıca öznitelik adının önüne `attr.` ekleyerek HTML _özniteliklerine_ de bağlama yapabilirsiniz:

```angular-html
<!-- `<ul>` elementindeki `role` özniteliğini `listRole` değerine bağla. -->
<ul [attr.role]="listRole()"></ul>
```

Angular, bağlanan değer değiştiğinde DOM özelliklerini ve özniteliklerini otomatik olarak günceller.

## Kullanıcı Etkileşimini Yönetme

Angular, şablonunuzdaki bir elemana parantezlerle olay dinleyicileri eklemenizi sağlar:

```angular-ts
@Component({
  /*...*/
  // `cancelSubscription` metodunu çağıran bir 'click' olay işleyicisi ekle.
  template: `<button (click)="cancelSubscription()">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription() {
    /* Olay işleme kodunuz buraya gelecek. */
  }
}
```

[Olay](https://developer.mozilla.org/docs/Web/API/Event) nesnesini dinleyicinize geçirmeniz gerekiyorsa, fonksiyon çağrısı içinde Angular'ın yerleşik `$event` değişkenini kullanabilirsiniz:

```angular-ts
@Component({
  /*...*/
  // `cancelSubscription` metodunu çağıran bir 'click' olay işleyicisi ekle.
  template: `<button (click)="cancelSubscription($event)">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription(event: Event) {
    /* Olay işleme kodunuz buraya gelecek. */
  }
}
```

## `@if` ve `@for` ile Kontrol Akışı

Angular'ın `@if` bloğu ile bir şablonun bazı kısımlarını koşullu olarak gizleyip gösterebilirsiniz:

```angular-html
<h1>User profile</h1>

@if (isAdmin()) {
  <h2>Admin settings</h2>
  <!-- ... -->
}
```

`@if` bloğu ayrıca isteğe bağlı bir `@else` bloğunu da destekler:

```angular-html
<h1>User profile</h1>

@if (isAdmin()) {
  <h2>Admin settings</h2>
  <!-- ... -->
} @else {
  <h2>User settings</h2>
  <!-- ... -->
}
```

Angular'ın `@for` bloğu ile bir şablonun bir kısmını birden fazla kez tekrarlayabilirsiniz:

```angular-html
<h1>User profile</h1>

<ul class="user-badge-list">
  @for (badge of badges(); track badge.id) {
    <li class="user-badge">{{ badge.name }}</li>
  }
</ul>
```

Angular, yukarıdaki örnekte gösterilen `track` anahtar kelimesini, `@for` tarafından oluşturulan DOM elementleriyle verileri ilişkilendirmek için kullanır. Daha fazla bilgi için [_@for bloklarında track neden önemlidir?_](guide/templates/control-flow#for-bloklarında-track-neden-önemlidir) bölümüne bakın.

TIP: Angular şablonları hakkında daha fazla bilgi edinmek ister misiniz? Tüm ayrıntılar için [Detaylı Şablonlar kılavuzuna](guide/templates) bakın.

## Sonraki Adım

Uygulamada dinamik veri ve şablonlara sahip olduğunuza göre, belirli elementleri koşullu olarak gizleme veya gösterme, elementler üzerinde döngü yapma ve daha fazlasıyla şablonları nasıl geliştireceğinizi öğrenmenin zamanı geldi.

<docs-pill-row>
  <docs-pill title="Bağımlılık enjeksiyonu ile modüler tasarım" href="essentials/dependency-injection" />
  <docs-pill title="Detaylı şablon kılavuzu" href="guide/templates" />
</docs-pill-row>
