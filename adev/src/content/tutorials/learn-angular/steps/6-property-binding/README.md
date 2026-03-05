# Property Binding in Angular

Angular'da özellik bağlama, HTML öğelerinin, Angular bileşenlerinin ve daha fazlasının özellikleri için değer belirlemenizi sağlar.

Özellikler ve nitelikler için dinamik olarak değer ayarlamak üzere özellik bağlamayı kullanın. Buton özelliklerini değiştirme, resim yollarını programatik olarak ayarlama ve bileşenler arasında değer paylaşma gibi işlemler yapabilirsiniz.

NOTE: [Temel bilgiler kılavuzundaki dinamik özellik ve nitelik ayarlama](/essentials/templates#setting-dynamic-properties-and-attributes) hakkında daha fazla bilgi edinin.

Bu aktivitede, şablonlarda özellik bağlamayı nasıl kullanacağınızı öğreneceksiniz.

<hr />

Bir öğenin niteliğine bağlanmak için nitelik adını köşeli parantez içine alın. İşte bir örnek:

```angular-html
<img alt="photo" [src]="imageURL" />
```

Bu örnekte, `src` niteliğinin değeri `imageURL` sınıf özelliğine bağlanacaktır. `imageURL`'nin değeri ne olursa olsun, `img` etiketinin `src` niteliği olarak ayarlanacaktır.

<docs-workflow>

<docs-step title="Add a property called `isEditable`" header="app.ts" language="ts">
`app.ts` dosyasındaki kodu, `App` sınıfına `isEditable` adında ve başlangıç değeri `true` olan bir özellik ekleyerek güncelleyin.

```ts {highlight:[2]}
export class App {
  isEditable = true;
}
```

</docs-step>

<docs-step title="Bind to `contentEditable`" header="app.ts" language="ts">
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

Özellik bağlama, Angular'ın birçok güçlü özelliğinden biridir. Daha fazla bilgi edinmek isterseniz [Angular belgelerine](guide/templates/binding#css-class-and-style-property-bindings) göz atın.
