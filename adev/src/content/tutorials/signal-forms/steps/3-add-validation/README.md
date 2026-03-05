# Add validation to your form

Kullanıcıların geçerli veri girmesini sağlamak için formunuza doğrulama eklemek kritik öneme sahiptir. Signal Forms, `form()` fonksiyonuna ilettiğiniz bir şema fonksiyonunda doğrulayıcılar (validators) kullanır.

Bu aktivitede şunları öğreneceksiniz:

- Yerleşik doğrulayıcıları içe aktarma
- Formunuz için bir şema fonksiyonu tanımlama
- Özel hata mesajlarıyla belirli alanlara doğrulayıcılar uygulama

Doğrulama ekleyelim!

<hr />

<docs-workflow>

<docs-step title="Import the validators">
`@angular/forms/signals` paketinden `required` ve `email` doğrulayıcılarını içe aktarın:

```ts
import {form, FormField, required, email} from '@angular/forms/signals';
```

</docs-step>

<docs-step title="Add a schema function to your form">
`form()` çağrınızı, ikinci parametre olarak bir şema fonksiyonu içerecek şekilde güncelleyin. Şema fonksiyonu, her alana erişmenizi sağlayan bir `fieldPath` parametresi alır:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  // Validators will go here
});
```

</docs-step>

<docs-step title="Add validation to the email field">
Şema fonksiyonunun içinde, e-posta alanı için doğrulama ekleyin. Hem `required()` hem de `email()` doğrulayıcılarını kullanın:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, {message: 'Email is required'});
  email(fieldPath.email, {message: 'Enter a valid email address'});
});
```

`message` seçeneği, kullanıcılar için özel hata mesajları sağlar.
</docs-step>

<docs-step title="Add validation to the password field">
`required()` doğrulayıcısını kullanarak parola alanı için doğrulama ekleyin:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, {message: 'Email is required'});
  email(fieldPath.email, {message: 'Enter a valid email address'});
  required(fieldPath.password, {message: 'Password is required'});
});
```

</docs-step>

</docs-workflow>

Mükemmel! Formunuza doğrulama eklediniz. Doğrulayıcılar, kullanıcılar formla etkileşime geçtikçe otomatik olarak çalışır. Doğrulama başarısız olduğunda, alanın durumu hataları yansıtacaktır.

Ardından, [şablonda doğrulama hatalarını nasıl göstereceğinizi](/tutorials/signal-forms/4-display-errors) öğreneceksiniz!
