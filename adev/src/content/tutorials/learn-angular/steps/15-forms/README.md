# Formlar

Formlar birçok uygulamanın önemli bir parçasıdır çünkü uygulamanızın kullanıcı girdisi kabul etmesini sağlar. Angular'da formların nasıl işlendiğini öğrenelim.

Angular'da iki tür form vardır: şablon odaklı ve reaktif. Önümüzdeki birkaç aktivitede her ikisini de öğreneceksiniz.

NOTE: [Angular'da formlar hakkında detaylı kılavuzdan](/guide/forms) daha fazla bilgi edinin.

Bu aktivitede, şablon odaklı yaklaşım kullanarak bir form oluşturmayı öğreneceksiniz.

<hr>

<docs-workflow>

<docs-step title="Bir giriş alanı oluşturun">

`user.ts` dosyasında, `id` değeri `framework` ve type değeri `text` olarak ayarlanmış bir metin giriş alanı ekleyerek şablonu güncelleyin.

```angular-html
<label for="framework">
  Favorite Framework:
  <input id="framework" type="text" />
</label>
```

</docs-step>

<docs-step title="`FormsModule`'ü içe aktarın">

Bu formun, formlara veri bağlama özelliklerini etkinleştiren Angular özelliklerini kullanabilmesi için `FormsModule`'ü içe aktarmanız gerekir.

`FormsModule`'ü `@angular/forms` paketinden içe aktarın ve `User` bileşeninin `imports` dizisine ekleyin.

```ts {highlight:[2,6]}
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
...
imports: [FormsModule],
})
export class User {}
```

</docs-step>

<docs-step title="Girdi değerine bağlama ekleyin">

`FormsModule`, giriş alanının değerini sınıfınızdaki bir özelliğe bağlayan `ngModel` adında bir direktife sahiptir.

Giriş alanını `ngModel` direktifini kullanacak şekilde güncelleyin, özellikle `favoriteFramework` özelliğine bağlamak için `[(ngModel)]="favoriteFramework"` sözdizimini kullanın.

```html {highlight:[3]}
<label for="framework">
  Favorite Framework:
  <input id="framework" type="text" [(ngModel)]="favoriteFramework" />
</label>
```

Değişiklikleri yaptıktan sonra, giriş alanına bir değer girmeyi deneyin. Ekranda nasıl güncellendiğine dikkat edin (evet, çok havalı).

NOTE: `[()]` sözdizimi "banana in a box" (kutudaki muz) olarak bilinir ancak iki yönlü bağlamayı temsil eder: özellik bağlama ve olay bağlama. [Angular'ın iki yönlü veri bağlama belgelerinden](guide/templates/two-way-binding) daha fazla bilgi edinin.

</docs-step>

</docs-workflow>

Angular ile form oluşturma yolunda önemli bir ilk adım attınız.

Harika iş. İvmeyi korumaya devam edelim!
