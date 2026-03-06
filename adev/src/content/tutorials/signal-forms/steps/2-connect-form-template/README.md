# Formunuzu şablona bağlama

Şimdi, `[formField]` direktifini kullanarak formunuzu şablona bağlamanız gerekiyor. Bu, form modeliniz ile input elemanları arasında iki yönlü veri bağlama oluşturur.

Bu derste şunları öğreneceksiniz:

- `FormField` direktifini içe aktarma
- Form alanlarını input'lara bağlamak için `[formField]` direktifini kullanma
- Metin input'larını ve onay kutularını formunuza bağlama
- Form alan değerlerini şablonda görüntüleme

Şablonu bağlayalım!

<hr />

<docs-workflow>

<docs-step title="Import the FormField directive">
`@angular/forms/signals` paketinden `FormField` direktifini içe aktarın ve bileşeninizin imports dizisine ekleyin:

```ts
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
```

</docs-step>

<docs-step title="Bind the email field">
Şablonunuzda, e-posta input'una `[formField]` direktifini ekleyin:

```html
<input type="email" [formField]="loginForm.email" />
```

`loginForm.email` ifadesi, formunuzdaki e-posta alanına erişir.
</docs-step>

<docs-step title="Bind the password field">
Parola input'una `[formField]` direktifini ekleyin:

```html
<input type="password" [formField]="loginForm.password" />
```

</docs-step>

<docs-step title="Bind the checkbox field">
Onay kutusu input'una `[formField]` direktifini ekleyin:

```html
<input type="checkbox" [formField]="loginForm.rememberMe" />
```

</docs-step>

<docs-step title="Display the form values">
Formun altında, mevcut form değerlerini gösteren bir hata ayıklama bölümü var. `.value()` kullanarak her alan değerini görüntüleyin:

```angular-html
<p>Email: {{ loginForm.email().value() }}</p>
<p>Password: {{ loginForm.password().value() ? '••••••••' : '(empty)' }}</p>
<p>Remember me: {{ loginForm.rememberMe().value() ? 'Yes' : 'No' }}</p>
```

Form alan değerleri sinyaldir, bu nedenle siz yazdıkça görüntülenen değerler otomatik olarak güncellenir.
</docs-step>

</docs-workflow>

Harika iş! Formunuzu şablona bağladınız ve form değerlerini görüntülediniz. `[formField]` direktifi iki yönlü veri bağlamayı otomatik olarak yönetir - siz yazdıkça `loginModel` sinyali güncellenir ve görüntülenen değerler anında güncellenir.

Ardından, [formunuza doğrulama eklemeyi](/tutorials/signal-forms/3-add-validation) öğreneceksiniz!
