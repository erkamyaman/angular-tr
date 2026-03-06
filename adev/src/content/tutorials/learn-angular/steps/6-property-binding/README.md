# Property Binding

Angular'da özellik bağlama, HTML öğelerinin, Angular bileşenlerinin ve daha fazlasının özellikleri için değer belirlemenizi sağlar.

Özellikler ve nitelikler için dinamik olarak değer ayarlamak üzere özellik bağlamayı kullanın. Buton özelliklerini değiştirme, resim yollarını programatik olarak ayarlama ve bileşenler arasında değer paylaşma gibi işlemler yapabilirsiniz.

NOTE: [Temel bilgiler kılavuzundaki dinamik özellik ve nitelik ayarlama](/essentials/templates#dinamik-özellikler-ve-öznitelikler-ayarlama) hakkında daha fazla bilgi edinin.

Bu aktivitede, şablonlarda özellik bağlamayı nasıl kullanacağınızı öğreneceksiniz.

<hr />

Bir öğenin niteliğine bağlanmak için nitelik adını köşeli parantez içine alın. İşte bir örnek:

```angular-html
<img alt="photo" [src]="imageURL" />
```

Bu örnekte, `src` niteliğinin değeri `imageURL` sınıf özelliğine bağlanacaktır. `imageURL`'nin değeri ne olursa olsun, `img` etiketinin `src` niteliği olarak ayarlanacaktır.

<docs-workflow>

<docs-step title="`isEditable` adlı bir özellik ekleyin" header="app.ts" language="ts">
`app.ts` dosyasındaki kodu, `App` sınıfına `isEditable` adında ve başlangıç değeri `true` olan bir özellik ekleyerek güncelleyin.

```ts {highlight:[2]}
export class App {
  isEditable = true;
}
```

</docs-step>

<docs-step title="`contentEditable`'a bağlayın" header="app.ts" language="ts">
Sonra, `div`'in `contentEditable` niteliğini `isEditable` özelliğine <code aria-label="square brackets">[]</code> sözdizimini kullanarak bağlayın.

```angular-ts {highlight:[3]}
@Component({
  ...
  template: `<div [contentEditable]="isEditable"></div>`,
})
```

</docs-step>

</docs-workflow>

Div artık düzenlenebilir durumda. Harika is!

Özellik bağlama, Angular'ın birçok güçlü özelliğinden biridir. Daha fazla bilgi edinmek isterseniz [Angular belgelerine](guide/templates/binding#css-sınıfı-ve-stil-özelliği-bağlamaları) göz atın.
