# Form Doğrulama

Formlarla çalışırken karşılaşılan bir diğer yaygın senaryo, doğru verilerin gönderildiğinden emin olmak için girdilerin doğrulanması gerekliliğidir.

NOTE: [Detaylı kılavuzda form girdisi doğrulama](/guide/forms/reactive-forms#form-girdisini-doğrulama) hakkında daha fazla bilgi edinin.

Bu aktivitede, reaktif formlarla formları nasıl doğrulayacağınızı öğreneceksiniz.

<hr>

<docs-workflow>

<docs-step title="Doğrulayıcıları içe aktarın">

Angular bir dizi doğrulama aracı sağlar. Bunları kullanmak için önce bileşeni `@angular/forms` paketinden `Validators`'ı içe aktaracak şekilde güncelleyin.

```ts {highlight:[1]}
import {ReactiveFormsModule, Validators} from '@angular/forms';

@Component({...})
export class App {}
```

</docs-step>

<docs-step title="Forma doğrulama ekleyin">

Her `FormControl`'a, `FormControl` değerlerini doğrulamak için kullanmak istediğiniz `Validators`'lar aktarılabilir. Örneğin, `profileForm` içindeki `name` alanını zorunlu yapmak istiyorsanız `Validators.required` kullanın.
Angular formumuzdaki `email` alanı için, alanın boş bırakılmamasını ve geçerli bir e-posta adresi yapısına uymasını sağlamak istiyoruz. Bunu `Validators.required` ve `Validators.email` doğrulayıcılarını bir dizi içinde birleştirerek başarabiliriz.
`name` ve `email` `FormControl`'larını güncelleyin:

```ts
profileForm = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
});
```

</docs-step>

<docs-step title="Şablonda form doğrulamasını kontrol edin">

Bir formun geçerli olup olmadığını belirlemek için `FormGroup` sınıfının `valid` özelliği vardır.
Bu özelliği kullanarak nitelikleri dinamik olarak bağlayabilirsiniz. Gönder `button` düğmesini formun geçerliliğine göre etkinleştirilecek şekilde güncelleyin.

```angular-html
<button type="submit" [disabled]="!profileForm.valid">Submit</button>
```

</docs-step>

</docs-workflow>

Artık reaktif formlarla doğrulamanın nasıl çalıştığının temellerini biliyorsunuz.

Angular'da formlarla çalışmanın bu temel kavramlarını öğrendiğiniz için harika iş. Daha fazla bilgi edinmek istiyorsanız, [Angular form belgelerine](guide/forms/form-validation) başvurduğunuzdan emin olun.
