<docs-decorative-header title="Sinyallerle formlar" imgSrc="adev/src/assets/images/signals.svg"> </docs-decorative-header>

IMPORTANT: Signal Forms [deneyseldir](/reference/releases#deneysel). API, gelecek sürümlerde değişebilir. Riskleri anlamadan deneysel API'leri üretim uygulamalarında kullanmaktan kaçının.

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

Ardından, form modelinizi `form()` fonksiyonuna geçirerek bir **alan ağacı (field tree)** oluşturursunuz - modelinizin yapısını yansıtan ve nokta notasyonuyla alanlara erişmenizi sağlayan bir nesne yapısı:

```ts
const loginForm = form(loginModel);

// Alanlara doğrudan özellik adıyla erişin
loginForm.email;
loginForm.password;
```

### 3. HTML Girdilerini `[formField]` Direktifi ile Bağlayın

Ardından, HTML girdilerinizi `[formField]` direktifi kullanarak forma bağlarsınız; bu, aralarında iki yönlü bağlama oluşturur:

```html
<input type="email" [formField]="loginForm.email" />
<input type="password" [formField]="loginForm.password" />
```

Sonuç olarak, kullanıcı değişiklikleri (alana yazma gibi) formu otomatik olarak günceller.

NOTE: `[formField]` direktifi ayrıca uygun olduğunda `required`, `disabled` ve `readonly` gibi öznitelikler için alan durumunu da senkronize eder.

### 4. `value()` ile Alan Değerlerini Okuyun

Alanı bir fonksiyon olarak çağırarak alan durumuna erişebilirsiniz. Bu, alanın değeri, doğrulama durumu ve etkileşim durumu için reaktif sinyaller içeren bir `FieldState` nesnesi döndürür:

```ts
loginForm.email(); // Returns FieldState with value(), valid(), touched(), etc.
```

Alanın mevcut değerini okumak için `value()` sinyaline erişin:

```html
<!-- Kullanıcı yazarken otomatik olarak güncellenen form değerini render et -->
<p>Email: {{ loginForm.email().value() }}</p>
```

```ts
// Mevcut değeri al
const currentEmail = loginForm.email().value();
```

### 5. `set()` ile Alan Değerlerini Güncelleyin

Bir alanın değerini `value.set()` metodunu kullanarak programatik olarak güncelleyebilirsiniz. Bu, hem alanı hem de alttaki model sinyalini günceller:

```ts
// Değeri programatik olarak güncelle
loginForm.email().value.set('alice@wonderland.com');
```

Sonuç olarak, hem alan değeri hem de model sinyali otomatik olarak güncellenir:

```ts
// Model sinyali de güncellenir
console.log(loginModel().email); // 'alice@wonderland.com'
```

İşte eksiksiz bir örnek:

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

Her form alanı, doğrulama durumunu sinyaller aracılığıyla sunar. Örneğin, doğrulamanın geçip geçmediğini görmek için `field().valid()`, kullanıcının etkileşimde bulunup bulunmadığını görmek için `field().touched()` ve doğrulama hatalarının listesini almak için `field().errors()` kontrol edebilirsiniz.

İşte eksiksiz bir örnek:

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.css"/>
</docs-code-multifile>

### Alan Durumu Sinyalleri

Her `field()` şu durum sinyallerini sağlar:

| Durum        | Açıklama                                                                            |
| ------------ | ----------------------------------------------------------------------------------- |
| `valid()`    | Alan tüm doğrulama kurallarını geçerse `true` döndürür                              |
| `touched()`  | Kullanıcı alana odaklanıp ayrıldıysa `true` döndürür                                |
| `dirty()`    | Kullanıcı değeri değiştirdiyse `true` döndürür                                      |
| `disabled()` | Alan devre dışı bırakıldıysa `true` döndürür                                        |
| `readonly()` | Alan salt okunursa `true` döndürür                                                  |
| `pending()`  | Asenkron doğrulama devam ediyorsa `true` döndürür                                   |
| `errors()`   | `kind` ve `message` özelliklerine sahip doğrulama hatalarının bir dizisini döndürür |

## Sonraki Adımlar

Signal Forms ve nasıl çalıştığı hakkında daha fazla bilgi edinmek için detaylı kılavuzlara göz atın:

- [Overview](guide/forms/signals/overview) - Signal Forms'a giriş ve ne zaman kullanılacağı
- [Form models](guide/forms/signals/models) - Sinyallerle form verisi oluşturma ve yönetme
- [Field state management](guide/forms/signals/field-state-management) - Doğrulama durumu, etkileşim takibi ve alan görünürlüğü ile çalışma
- [Validation](guide/forms/signals/validation) - Yerleşik doğrulayıcılar, özel doğrulama kuralları ve asenkron doğrulama
