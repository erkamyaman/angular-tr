<docs-decorative-header title="Templates" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
Dinamik kullanıcı arayüzleri oluşturmak için Angular'ın şablon sözdizimini kullanın.
</docs-decorative-header>

Bileşen şablonları sadece statik HTML değildir -- bileşen sınıfınızdaki verileri kullanabilir ve kullanıcı etkileşimi için işleyiciler kurabilir.

## Showing dynamic text

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

## Setting dynamic properties and attributes

Angular, köşeli parantezlerle DOM özelliklerine dinamik değerler bağlamayı destekler:

```angular-ts
@Component({
  /*...*/
  // Set the `disabled` property of the button based on the value of `isValidUserId`.
  template: `<button [disabled]="!isValidUserId()">Save changes</button>`,
})
export class UserProfile {
  isValidUserId = signal(false);
}
```

Ayrıca öznitelik adının önüne `attr.` ekleyerek HTML _özniteliklerine_ de bağlama yapabilirsiniz:

```angular-html
<!-- Bind the `role` attribute on the `<ul>` element to value of `listRole`. -->
<ul [attr.role]="listRole()"></ul>
```

Angular, bağlanan değer değiştiğinde DOM özelliklerini ve özniteliklerini otomatik olarak günceller.

## Handling user interaction

Angular, şablonunuzdaki bir elemana parantezlerle olay dinleyicileri eklemenizi sağlar:

```angular-ts
@Component({
  /*...*/
  // Add an 'click' event handler that calls the `cancelSubscription` method.
  template: `<button (click)="cancelSubscription()">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription() {
    /* Your event handling code goes here. */
  }
}
```

[Olay](https://developer.mozilla.org/docs/Web/API/Event) nesnesini dinleyicinize geçirmeniz gerekiyorsa, fonksiyon çağrısı içinde Angular'ın yerleşik `$event` değişkenini kullanabilirsiniz:

```angular-ts
@Component({
  /*...*/
  // Add an 'click' event handler that calls the `cancelSubscription` method.
  template: `<button (click)="cancelSubscription($event)">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription(event: Event) {
    /* Your event handling code goes here. */
  }
}
```

## Control flow with `@if` and `@for`

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

Angular, yukarıdaki örnekte gösterilen `track` anahtar kelimesini, `@for` tarafından oluşturulan DOM elementleriyle verileri ilişkilendirmek için kullanır. Daha fazla bilgi için [_@for bloklarında track neden önemlidir?_](guide/templates/control-flow#why-is-track-in-for-blocks-important) bölümüne bakın.

TIP: Angular şablonları hakkında daha fazla bilgi edinmek ister misiniz? Tüm ayrıntılar için [Detaylı Şablonlar kılavuzuna](guide/templates) bakın.

## Next Step

Uygulamada dinamik veri ve şablonlara sahip olduğunuza göre, belirli elementleri koşullu olarak gizleme veya gösterme, elementler üzerinde döngü yapma ve daha fazlasıyla şablonları nasıl geliştireceğinizi öğrenmenin zamanı geldi.

<docs-pill-row>
  <docs-pill title="Modular design with dependency injection" href="essentials/dependency-injection" />
  <docs-pill title="In-depth template guide" href="guide/templates" />
</docs-pill-row>
