# Display validation errors

Artık formu doğrulayabildiğinize göre, doğrulama hatalarını kullanıcılara göstermek önemlidir.

Bu aktivitede şunları öğreneceksiniz:

- Doğrulama sinyalleriyle alan durumuna erişme
- Hataları koşullu olarak göstermek için `@if` kullanma
- `@for` ile hatalar arasında döngü oluşturma
- Hataları yalnızca kullanıcı etkileşiminden sonra gösterme

Doğrulama geri bildirimi gösterelim!

<hr />

<docs-workflow>

<docs-step title="Add error display for email field">
E-posta input'unun altına, koşullu hata görüntüleme ekleyin. Bu, yalnızca alan hem geçersiz hem de dokunulmuş (touched) olduğunda hataları gösterecektir:

```angular-html
<label>
  Email
  <input type="email" [formField]="loginForm.email" />
</label>
@if (loginForm.email().invalid() && loginForm.email().touched()) {
  <div class="error">
    @for (error of loginForm.email().errors(); track error.kind) {
      <span>{{ error.message }}</span>
    }
  </div>
}
```

`loginForm.email()` çağrısı, alanın durum sinyaline erişir. `invalid()` metodu doğrulama başarısız olduğunda `true` döndürür, `touched()` kullanıcı alanla etkileşime girdikten sonra `true` döndürür ve `errors()` özel mesajlarıyla birlikte doğrulama hataları dizisi sağlar.
</docs-step>

<docs-step title="Add error display for password field">
Parola input'unun altına, parola hataları için aynı deseni ekleyin:

```angular-html
<label>
  Password
  <input type="password" [formField]="loginForm.password" />
</label>
@if (loginForm.password().invalid() && loginForm.password().touched()) {
  <div class="error">
    @for (error of loginForm.password().errors(); track error.kind) {
      <span>{{ error.message }}</span>
    }
  </div>
}
```

</docs-step>

</docs-workflow>

Mükemmel! Formunuza hata görüntüleme eklediniz. Hatalar yalnızca kullanıcılar bir alanla etkileşime girdikten sonra görünür ve müdahaleci olmadan yararlı geri bildirim sağlar.

Ardından, [form gönderimini nasıl yöneteceğinizi](/tutorials/signal-forms/5-add-submission) öğreneceksiniz!
