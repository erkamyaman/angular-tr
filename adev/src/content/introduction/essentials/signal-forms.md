<docs-decorative-header title="Sinyallerle formlar" imgSrc="adev/src/assets/images/signals.svg"> </docs-decorative-header>

Signal Forms, Angular Sinyalleri ile veri modeliniz ve kullanıcı arayüzü arasında otomatik senkronizasyon sağlamak için Angular sinyallerini kullanarak form durumunu yönetir.

Bu kılavuz, Signal Forms ile form oluşturmanın temel kavramlarında size yol gösterir. İşte nasıl çalıştığı:

## İlk Formunuzu Oluşturma

### 1. `signal()` ile Bir Form Modeli Oluşturun

Her form, formunuzun veri modelini tutan bir sinyal oluşturarak başlar:

```ts
interface LoginData {
  email: string;
  password: string;
}

const loginModel = signal<LoginData>({
  email: '',
  password: '',
});
```

### 2. Bir `FieldTree` Oluşturmak İçin Form Modelini `form()` Fonksiyonuna Geçirin

Ardından, form modelinizi `form()` fonksiyonuna geçirerek bir **alan ağacı (field tree)** oluşturursunuz - modelinizin yapısını yansıtan ve nokta notasyonuyla alanlara erişmenizi sağlayan bir nesne yapısı.

Hem kök form nesnesi hem de iç içe özellikleri birer `FieldTree` düğümüdür:

```ts
const loginForm = form(loginModel);

loginForm; // bir FieldTree'dir
loginForm.email; // o da bir FieldTree'dir
```

### 3. HTML Girdilerini `[formField]` Direktifi ile Bağlayın

Ardından, HTML girdilerinizi `[formField]` direktifi kullanarak forma bağlarsınız; bu, aralarında iki yönlü bağlama oluşturur:

```html
<input type="email" [formField]="loginForm.email" />
<input type="password" [formField]="loginForm.password" />
```

Sonuç olarak, kullanıcı değişiklikleri (alana yazma gibi) formu otomatik olarak günceller.

NOTE: `[formField]` direktifi ayrıca uygun olduğunda `required`, `disabled` ve `readonly` gibi öznitelikler için alan durumunu da senkronize eder.

### 4. `FieldTree` Sinyalleriyle Durumu Okuyun

`FieldTree` düğümünü bir fonksiyon olarak çağırarak ağacın herhangi bir parçasının durumuna erişebilirsiniz. Bu, değer, doğrulama durumu ve etkileşim durumu için reaktif sinyaller içeren bir durum nesnesi döndürür:

```ts
loginForm(); // Tüm formun durumunu döndürür
loginForm.email(); // email alanının durumunu döndürür
```

Mevcut değeri okumak için `value()` sinyaline erişin:

```html
<!-- Kullanıcı yazarken otomatik olarak güncellenen değerleri render et -->
<p>Form value: {{ loginForm().value() | json }}</p>
<p>Email: {{ loginForm.email().value() }}</p>
```

```ts
// Mevcut değeri al
const currentEmail = loginForm.email().value();
```

### 5. `set()` ile Değerleri Güncelleyin

Herhangi bir düğümde `value.set()` metodunu kullanarak değerleri programatik olarak güncelleyebilirsiniz. Bu, hem `FieldTree`'yi hem de alttaki model sinyalini günceller:

```ts
// Değeri programatik olarak güncelle
loginForm.email().value.set('alice@wonderland.com');
```

Sonuç olarak, hem alan değeri hem de model sinyali otomatik olarak güncellenir:

```ts
// Model sinyali de güncellenir
console.log(loginModel().email); // 'alice@wonderland.com'
```

### Eksiksiz örnek

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.css"/>
</docs-code-multifile>

## Temel Kullanım

`[formField]` direktifi tüm standart HTML girdi türleriyle çalışır. İşte en yaygın kullanım kalıpları:

### Metin Girdileri

Metin girdileri çeşitli `type` öznitelikleri ve textarea'larla çalışır:

```html
<!-- Metin ve e-posta -->
<input type="text" [formField]="form.name" />
<input type="email" [formField]="form.email" />
```

#### Sayılar

Sayı girdileri, dizeler ve sayılar arasında otomatik olarak dönüşüm yapar:

```html
<!-- Sayı - otomatik olarak sayı türüne dönüştürür -->
<input type="number" [formField]="form.age" />
```

#### Tarih ve Saat

Tarih girdileri değerleri `YYYY-MM-DD` dizesi olarak saklar ve zaman girdileri `HH:mm` biçimini kullanır:

```html
<!-- Tarih ve saat - ISO biçiminde dize olarak saklar -->
<input type="date" [formField]="form.eventDate" />
<input type="time" [formField]="form.eventTime" />
```

Tarih dizelerini Date nesnelerine dönüştürmeniz gerekiyorsa, alan değerini `Date()` fonksiyonuna geçirerek bunu yapabilirsiniz:

```ts
const dateObject = new Date(form.eventDate().value());
```

#### Çok Satırlı Metin

Textarea'lar metin girdileriyle aynı şekilde çalışır:

```html
<!-- Metin alanı -->
<textarea [formField]="form.message" rows="4"></textarea>
```

### Onay Kutuları

Onay kutuları boolean değerlere bağlanır:

```html
<!-- Tekli onay kutusu -->
<label>
  <input type="checkbox" [formField]="form.agreeToTerms" />
  I agree to the terms
</label>
```

#### Çoklu Onay Kutuları

Birden fazla seçenek için her biri için ayrı bir boolean `formField` oluşturun:

```html
<label>
  <input type="checkbox" [formField]="form.emailNotifications" />
  Email notifications
</label>
<label>
  <input type="checkbox" [formField]="form.smsNotifications" />
  SMS notifications
</label>
```

### Radyo Düğmeleri

Radyo düğmeleri onay kutularına benzer şekilde çalışır. Radyo düğmeleri aynı `[formField]` değerini kullandığı sürece, Signal Forms otomatik olarak hepsine aynı `name` özniteliğini bağlar:

```html
<label>
  <input type="radio" value="free" [formField]="form.plan" />
  Free
</label>
<label>
  <input type="radio" value="premium" [formField]="form.plan" />
  Premium
</label>
```

Kullanıcı bir radyo düğmesi seçtiğinde, form `formField` o radyo düğmesinin `value` özniteliğindeki değeri saklar. Örneğin, "Premium" seçildiğinde `form.plan().value()` `"premium"` olarak ayarlanır.

### Select Açılır Menüler

Select elementleri hem statik hem de dinamik seçeneklerle çalışır:

```angular-html
<!-- Statik seçenekler -->
<select [formField]="form.country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>

<!-- @for ile dinamik seçenekler -->
<select [formField]="form.productId">
  <option value="">Select a product</option>
  @for (product of products; track product.id) {
    <option [value]="product.id">{{ product.name }}</option>
  }
</select>
```

NOTE: Çoklu seçim (`<select multiple>`) şu anda `[formField]` direktifi tarafından desteklenmemektedir.

## Doğrulama ve Durum

Signal Forms, form alanlarınıza uygulayabileceğiniz yerleşik doğrulayıcılar sağlar. Doğrulama eklemek için `form()` fonksiyonuna ikinci argüman olarak bir şema fonksiyonu geçirin:

```ts
const loginForm = form(loginModel, (schemaPath) => {
  debounce(schemaPath.email, 500);
  required(schemaPath.email);
  email(schemaPath.email);
});
```

Şema fonksiyonu, doğrulama kurallarını yapılandırmak için alanlarınıza yollar sağlayan bir **şema yolu** parametresi alır.

Yaygın doğrulayıcılar şunlardır:

- **`required()`** - Alanın bir değere sahip olmasını sağlar
- **`email()`** - E-posta biçimini doğrular
- **`min()`** / **`max()`** - Sayı aralıklarını doğrular
- **`minLength()`** / **`maxLength()`** - Dize veya koleksiyon uzunluğunu doğrular
- **`pattern()`** - Bir regex kalıbına göre doğrular

Doğrulayıcıya ikinci argüman olarak bir seçenekler nesnesi geçirerek hata mesajlarını da özelleştirebilirsiniz:

```ts
required(schemaPath.email, {message: 'Email is required'});
email(schemaPath.email, {message: 'Please enter a valid email address'});
```

`FieldTree` içindeki her düğüm, doğrulama ve etkileşim durumunu reaktif sinyaller aracılığıyla sunar.

### FieldTree Durum Sinyalleri

Kök form nesnesi dahil ağaçtaki her düğüm, durumunu izlemek için aynı sinyalleri sağlar. Her düğüm bir `FieldTree` olduğundan, geçerliliği ve etkileşimi izleme API'si her seviyede aynıdır.

| Durum        | Açıklama                                                                            |
| ------------ | ----------------------------------------------------------------------------------- |
| `valid()`    | Düğüm tüm doğrulama kurallarını geçerse `true` döndürür                             |
| `invalid()`  | Doğrulama hataları varsa `true` döndürür                                            |
| `pending()`  | Asenkron doğrulama devam ediyorsa `true` döndürür                                   |
| `touched()`  | Kullanıcı alana veya herhangi bir alt alana odaklanıp ayrıldıysa `true` döndürür    |
| `dirty()`    | Değer kullanıcı tarafından değiştirildiyse `true` döndürür                          |
| `disabled()` | Düğüm devre dışı bırakıldıysa `true` döndürür                                       |
| `readonly()` | Düğüm salt okunursa `true` döndürür                                                 |
| `errors()`   | `kind` ve `message` özelliklerine sahip doğrulama hatalarının bir dizisini döndürür |

### Eksiksiz örnek

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.css"/>
</docs-code-multifile>

## Sonraki Adımlar

Signal Forms ve nasıl çalıştığı hakkında daha fazla bilgi edinmek için detaylı kılavuzlara göz atın:

- [Overview](guide/forms/signals/overview) - Signal Forms'a giriş ve ne zaman kullanılacağı
- [Form models](guide/forms/signals/models) - Sinyallerle form verisi oluşturma ve yönetme
- [Field state management](guide/forms/signals/field-state-management) - Doğrulama durumu, etkileşim takibi ve alan görünürlüğü ile çalışma
- [Validation](guide/forms/signals/validation) - Yerleşik doğrulayıcılar, özel doğrulama kuralları ve asenkron doğrulama

<docs-pill-row>
  <docs-pill title="Bağımlılık enjeksiyonu ile modüler tasarım" href="essentials/dependency-injection" />
</docs-pill-row>
