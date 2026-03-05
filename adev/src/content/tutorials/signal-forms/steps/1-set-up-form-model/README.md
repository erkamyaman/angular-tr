# Set up the form model

Her Signal Form, bir form veri modeli ile başlar - verilerinizin şeklini tanımlayan ve form verilerinizi depolayan bir sinyal.

Bu derste şunları öğreneceksiniz:

- Form verileriniz için bir TypeScript arayüzü (interface) tanımlama
- Form değerlerini tutmak için bir sinyal oluşturma
- Signal Form oluşturmak için `form()` fonksiyonunu kullanma

Giriş formumuzun temelini oluşturalım!

<hr />

<docs-workflow>

<docs-step title="Define the LoginData interface">
Giriş formu verilerinizin yapısını tanımlayan bir TypeScript arayüzü oluşturun. Form şunları içerecek:

- Bir `email` alanı (string)
- Bir `password` alanı (string)
- Bir `rememberMe` alanı (boolean)

```ts
interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}
```

Bu arayüzü `@Component` dekoratörünün üzerine ekleyin.
</docs-step>

<docs-step title="Import signal and form">
`@angular/core` paketinden `signal` fonksiyonunu ve `@angular/forms/signals` paketinden `form` fonksiyonunu içe aktarın:

```ts
import {Component, signal} from '@angular/core';
import {form} from '@angular/forms/signals';
```

</docs-step>

<docs-step title="Create the form model signal">
Bileşen sınıfınızda, başlangıç değerleriyle bir `loginModel` sinyali oluşturun. Tür parametresi olarak `LoginData` arayüzünü kullanın:

```ts
loginModel = signal<LoginData>({
  email: '',
  password: '',
  rememberMe: false,
});
```

Başlangıç değerleri, metin alanları için boş dizeler ve onay kutusu için `false` olarak ayarlanır.
</docs-step>

<docs-step title="Create the form">
Şimdi model sinyalinizi `form()` fonksiyonuna ileterek formu oluşturun:

```ts
loginForm = form(this.loginModel);
```

`form()` fonksiyonu, modelinizden bir form oluşturarak alan durumu ve doğrulama erişimi sağlar.
</docs-step>

</docs-workflow>

Mükemmel! Form modelinizi kurdunuz. `loginModel` sinyali form verilerinizi tutar ve `loginForm` tür güvenliğiyle her alana erişim sağlar.

Ardından, [formunuzu şablona nasıl bağlayacağınızı](/tutorials/signal-forms/2-connect-form-template) öğreneceksiniz!
