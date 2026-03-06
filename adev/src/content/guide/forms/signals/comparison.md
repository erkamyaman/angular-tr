# Diğer form yaklaşımlarıyla karşılaştırma

Angular, form oluşturmak için üç yaklaşım sunar: Signal Forms, Reactive Forms ve Template-driven Forms. Her birinin durum yönetimi, doğrulama ve veri akışı için farklı kalıpları vardır. Bu kılavuz, farklılıkları anlamanıza ve projeniz için doğru yaklaşımı seçmenize yardımcı olur.

NOTE: Signal Forms, Angular v21 itibarıyla [deneyseldir](reference/releases#deneysel). API, kararlı hale gelmeden önce değişebilir.

## Hızlı karşılaştırma

| Feature          | Signal Forms                                | Reactive Forms                           | Template-driven Forms        |
| ---------------- | ------------------------------------------- | ---------------------------------------- | ---------------------------- |
| Source of truth  | Kullanıcı tanımlı yazılabilir sinyal modeli | `FormControl`/`FormGroup`                | Bileşendeki kullanıcı modeli |
| Type safety      | Modelden çıkarılır                          | Tipli formlarla açık                     | Minimal                      |
| Validation       | Yol tabanlı doğrulayıcılarla şema           | Kontrollere iletilen doğrulayıcı listesi | Direktif tabanlı             |
| State management | Sinyal tabanlı                              | Observable tabanlı                       | Angular tarafından yönetilir |
| Setup            | Sinyal + şema fonksiyonu                    | FormControl ağacı                        | Şablonda NgModel             |
| Best for         | Sinyal tabanlı uygulamalar                  | Karmaşık formlar                         | Basit formlar                |
| Learning curve   | Orta                                        | Orta-Yüksek                              | Düşük                        |
| Status           | Deneysel (v21+)                             | Kararlı                                  | Kararlı                      |

## Örnekle: Giriş formu

Farklılıkları anlamanın en iyi yolu, aynı formun her üç yaklaşımda uygulandığını görmektir.

<docs-code-multifile>
  <docs-code language="angular-ts" header="Signal forms" path="adev/src/content/examples/signal-forms/src/comparison/app/signal-forms.ts"/>
  <docs-code header="Reactive forms" path="adev/src/content/examples/signal-forms/src/comparison/app/reactive-forms.ts"/>
  <docs-code header="Template-driven forms" path="adev/src/content/examples/signal-forms/src/comparison/app/template-driven-forms.ts"/>
</docs-code-multifile>

## Farklılıkları anlama

Üç yaklaşım, formlarınızı nasıl yazdığınızı ve sürdürdüğünüzü etkileyen farklı tasarım tercihleri yapar. Bu farklılıklar, her yaklaşımın form durumunu nerede sakladığından ve doğrulamayı nasıl yönettiğinden kaynaklanır.

### Form verileriniz nerede bulunur

En temel fark, her yaklaşımın form değerleri için "doğruluk kaynağı"nı nerede gördüğüdür.

Signal Forms verileri yazılabilir bir sinyalde saklar. Mevcut form değerlerine ihtiyaç duyduğunuzda sinyali çağırırsınız:

```ts
const credentials = this.loginModel(); // { email: '...', password: '...' }
```

Bu, form verilerinizi değerler değiştiğinde Angular'ı otomatik olarak bilgilendiren tek bir reaktif konteyner içinde tutar. Form yapısı, veri modelinizi tam olarak yansıtır.

Reactive Forms verileri FormControl ve FormGroup örneklerinin içinde saklar. Değerlere form hiyerarşisi aracılığıyla erişirsiniz:

```ts
const credentials = this.loginForm.value; // { email: '...', password: '...' }
```

Bu, form durum yönetimini bileşeninizin veri modelinden ayırır. Form yapısı açıktır ancak daha fazla kurulum kodu gerektirir.

Template-driven Forms verileri bileşen özelliklerinde saklar. Değerlere doğrudan erişirsiniz:

```ts
const credentials = {email: this.email, password: this.password};
```

Bu en doğrudan yaklaşımdır ancak ihtiyaç duyduğunuzda değerleri manuel olarak bir araya getirmenizi gerektirir. Angular, form durumunu şablondaki direktifler aracılığıyla yönetir.

### Doğrulama nasıl çalışır

Her yaklaşım doğrulama kurallarını farklı şekilde tanımlar; bu, doğrulama mantığınızın nerede yaşadığını ve nasıl sürdürdüğünüzü etkiler.

Signal Forms, doğrulayıcıları alan yollarına bağladığınız bir şema fonksiyonu kullanır:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, {message: 'Email is required'});
  email(fieldPath.email, {message: 'Enter a valid email address'});
});
```

Tüm doğrulama kuralları tek bir yerde bir arada bulunur. Şema fonksiyonu form oluşturma sırasında bir kez çalışır ve doğrulayıcılar alan değerleri değiştiğinde otomatik olarak yürütülür. Hata mesajları doğrulama tanımının bir parçasıdır.

Reactive Forms, kontrolleri oluştururken doğrulayıcıları ekler:

```ts
loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
});
```

Doğrulayıcılar, form yapısındaki bireysel kontrollere bağlıdır. Bu, doğrulamayı form tanımınız boyunca dağıtır. Hata mesajları genellikle şablonunuzda bulunur.

Template-driven Forms, şablonda direktif niteliklerini kullanır:

```html
<input [(ngModel)]="email" required email />
```

Doğrulama kuralları, HTML'nin yanında şablonunuzda bulunur. Bu, doğrulamayı kullanıcı arayüzüne yakın tutar ancak mantığı şablon ve bileşen arasında yayar.

### Tür güvenliği ve otomatik tamamlama

TypeScript entegrasyonu yaklaşımlar arasında önemli ölçüde farklılık gösterir ve derleyicinin hataları önlemenize ne kadar yardımcı olduğunu etkiler.

Signal Forms türleri model yapınızdan çıkarır:

```ts
const loginModel = signal({email: '', password: ''});
const loginForm = form(loginModel);
// TypeScript bilir: loginForm.email mevcuttur ve FieldState<string> döndürür
```

Veri şeklinizi sinyalde bir kez tanımlarsınız ve TypeScript otomatik olarak hangi alanların var olduğunu ve türlerini bilir. `loginForm.username`'e (mevcut olmayan) erişmek bir tür hatası üretir.

Reactive Forms, tipli formlarla açık tür ek açıklamaları gerektirir:

```ts
const loginForm = new FormGroup({
  email: new FormControl<string>(''),
  password: new FormControl<string>(''),
});
// TypeScript bilir: loginForm.controls.email bir FormControl<string>'dir
```

Her kontrol için türleri ayrı ayrı belirtirsiniz. TypeScript form yapınızı doğrular, ancak tür bilgisini veri modelinizden ayrı olarak sürdürürsünüz.

Template-driven Forms minimum düzeyde tür güvenliği sunar:

```ts
email = '';
password = '';
// TypeScript yalnızca bunların string olduğunu bilir, form düzeyinde tür bilgisi yoktur
```

TypeScript bileşen özelliklerinizi anlar ancak form yapısı veya doğrulama hakkında bilgisi yoktur. Form işlemleri için derleme zamanı kontrolünü kaybedersiniz.

## Yaklaşımınızı seçin

### Şu durumlarda Signal Forms kullanın:

- Yeni sinyal tabanlı uygulamalar geliştiriyorsanız (Angular v21+)
- Model yapınızdan çıkarılan tür güvenliği istiyorsanız
- Deneysel özelliklerle çalışmaktan rahat hissediyorsanız
- Şema tabanlı doğrulama size çekici geliyorsa
- Ekibiniz sinyallere aşinaysa

### Şu durumlarda Reactive Forms kullanın:

- Üretime hazır kararlılığa ihtiyaç duyuyorsanız
- Karmaşık, dinamik formlar oluşturuyorsanız
- Observable tabanlı kalıpları tercih ediyorsanız
- Form durumu üzerinde ayrıntılı kontrol istiyorsanız
- Mevcut bir reactive forms kod tabanı üzerinde çalışıyorsanız

### Şu durumlarda Template-driven Forms kullanın:

- Basit formlar oluşturuyorsanız (giriş, iletişim, arama)
- Hızlı prototipleme yapıyorsanız
- Form mantığınız basit ve doğrudansa
- Form mantığını şablonlarda tutmayı tercih ediyorsanız
- Mevcut bir template-driven kod tabanı üzerinde çalışıyorsanız

## Sonraki adımlar

Her yaklaşım hakkında daha fazla bilgi edinmek için:

- **Signal Forms**: Başlamak için [Genel Bakış kılavuzuna](guide/forms/signals/overview) bakın veya [Form Modelleri](guide/forms/signals/models), [Doğrulama](guide/forms/signals/validation) ve [Alan Durumu Yönetimi](guide/forms/signals/field-state-management) konularına dalın
- **Reactive Forms**: Angular dokümantasyonundaki [Reactive Forms kılavuzuna](guide/forms/reactive-forms) bakın
- **Template-driven Forms**: Angular dokümantasyonundaki [Template-driven Forms kılavuzuna](guide/forms/template-driven-forms) bakın
