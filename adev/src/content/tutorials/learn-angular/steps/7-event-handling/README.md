# Event handling

Olay yönetimi, web uygulamalarında etkileşimli özellikleri mümkün kılar. Geliştirici olarak buton tıklamaları, form gönderimleri ve daha fazlası gibi kullanıcı eylemlerine yanıt verme imkanı sağlar.

NOTE: [Temel bilgiler kılavuzundaki kullanıcı etkileşimini yönetme](/essentials/templates#kullanıcı-etkileşimini-yönetme) hakkında daha fazla bilgi edinin.

Bu aktivitede, bir olay yöneticisi eklemeyi öğreneceksiniz.

<hr />

Angular'da olaylara parantez sözdizimi `()` ile bağlanırsınız. Belirli bir öğede, bağlanmak istediğiniz olayı parantez içine alın ve bir olay yöneticisi ayarlayın. Bu `button` örneğini inceleyin:

```angular-ts
@Component({
  ...
  template: `<button (click)="greet()">`
})
export class App {
  greet() {
    console.log('Hello, there 👋');
  }
}
```

Bu örnekte, butona her tıklandığında `greet()` fonksiyonu çalışacaktır. `greet()` sözdiziminin sondaki parantezleri içerdiğine dikkat edin.

Pekala, şimdi sıra sizde:

<docs-workflow>

<docs-step title="Bir olay yöneticisi ekleyin">
`App` sınıfına `showSecretMessage()` olay yöneticisi fonksiyonunu ekleyin. Uygulama olarak aşağıdaki kodu kullanın:

```ts
showSecretMessage() {
  this.message = 'Way to go 🚀';
}
```

</docs-step>

<docs-step title="Şablon olayına bağlayın">
`app.ts` dosyasındaki şablon kodunu, `section` öğesinin `mouseover` olayına bağlanacak şekilde güncelleyin.

<!-- prettier-ignore -->
```angular-html
<section (mouseover)="showSecretMessage()">
```

</docs-step>

</docs-workflow>

Birkaç adımda Angular'da ilk olay yöneticinizi oluşturdunuz. Bu işte oldukça iyi oluyorsunuz gibi görünüyor, harika çalışmaya devam edin.
