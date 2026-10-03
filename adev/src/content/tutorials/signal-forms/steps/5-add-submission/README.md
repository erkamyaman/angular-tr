# Form gönderimini ekleme

Son olarak, form gönderimini nasıl yöneteceğimizi öğrenelim. Form geçerli olduğunda asenkron işlemleri çalıştırmak için `submit()` fonksiyonunu kullanmayı ve formda hatalar olduğunda gönder düğmesini devre dışı bırakmayı öğreneceksiniz.

Bu aktivitede şunları öğreneceksiniz:

- `submit()` fonksiyonunu içe aktarma
- Bir gönderim işleyici metodu oluşturma
- Yalnızca geçerli olduğunda mantık çalıştırmak için `submit()` kullanma
- Form durumuna göre gönder düğmesini devre dışı bırakma

Formu tamamlayalım!

<hr />

<docs-workflow>

<docs-step title="`submit` fonksiyonunu içe aktarın">
`@angular/forms/signals` paketinden `submit` fonksiyonunu içe aktarın:

```ts
import {form, FormField, required, email, submit} from '@angular/forms/signals';
```

</docs-step>

<docs-step title="`onSubmit` metodunu ekleyin">
Bileşen sınıfınızda, form gönderimini yöneten bir `onSubmit()` metodu ekleyin:

```ts
onSubmit(event: Event) {
  event.preventDefault();
  submit(this.loginForm, async () => {
    const credentials = this.loginModel();
    console.log('Logging in with:', credentials);
    // Add your login logic here
  });
}
```

`submit()` fonksiyonu, asenkron geri çağrınızı yalnızca form geçerli olduğunda çalıştırır. Ayrıca formun gönderim durumunu otomatik olarak yönetir.
</docs-step>

<docs-step title="Gönderim yöneticisini forma bağlayın">
Şablonunuzda, `onSubmit()` metodunu formun submit olayına bağlayın:

```html
<form (submit)="onSubmit($event)"></form>
```

</docs-step>

<docs-step title="Form geçersizken düğmeyi devre dışı bırakın">
Form geçersiz olduğunda gönder düğmesini devre dışı bırakmak için güncelleyin:

```html
<button type="submit" [disabled]="loginForm().invalid()">Log in</button>
```

Bu, formda doğrulama hataları olduğunda gönderimi engeller.
</docs-step>

</docs-workflow>

Tebrikler! Signal Forms ile eksiksiz bir giriş formu oluşturdunuz.

Öğrendiklerinizi gözden geçirmeye ve ileri düzey konuları keşfetmeye hazır mısınız? [Sonraki adımlara](/tutorials/signal-forms/6-next-steps) devam edin!
