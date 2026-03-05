# Validation

Formlar, gönderimden önce kullanıcıların doğru ve eksiksiz veriler sağlamasını garanti etmek için doğrulamaya ihtiyaç duyar. Doğrulama olmadan, sunucuda veri kalitesi sorunlarını yönetmeniz, net olmayan hata mesajlarıyla zayıf kullanıcı deneyimi sunmanız ve her kısıtlamayı manuel olarak kontrol etmeniz gerekirdi.

Signal Forms, şema tabanlı bir doğrulama yaklaşımı sunar. Doğrulama kuralları, bir şema fonksiyonu kullanarak alanlara bağlanır, değerler değiştiğinde otomatik olarak çalışır ve hataları alan durumu sinyalleri aracılığıyla açığa çıkarır. Bu, kullanıcılar formla etkileşime girdikçe güncellenen reaktif doğrulamayı mümkün kılar.

<docs-code-multifile preview hideCode path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.css"/>
</docs-code-multifile>

## Validation basics

Signal Forms'ta doğrulama, `form()`'a ikinci argüman olarak geçirilen bir şema fonksiyonu aracılığıyla tanımlanır.

### The schema function

Şema fonksiyonu, doğrulama kurallarınızı tanımlamanıza olanak tanıyan bir `SchemaPathTree` nesnesi alır:

<docs-code
  header="app.ts"
  path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts"
  visibleLines="[21,22,23,24,25,26,27]"
  highlight="[23,24,26]"
/>

Şema fonksiyonu, form başlatma sırasında bir kez çalışır. Doğrulama kuralları, şema yol parametresi kullanılarak alanlara bağlanır (`schemaPath.email`, `schemaPath.password` gibi) ve doğrulama, alan değerleri değiştiğinde otomatik olarak çalışır.

NOTE: Şema geri çağırma parametresi (bu örneklerde `schemaPath`) formunuzdaki tüm alanlara yollar sağlayan bir `SchemaPathTree` nesnesidir. Bu parametreyi istediğiniz gibi adlandırabilirsiniz.

### How validation works

Signal Forms'ta doğrulama şu kalıbı takip eder:

1. **Doğrulama kurallarını şemada tanımlayın** - Doğrulama kurallarını şema fonksiyonundaki alanlara bağlayın
2. **Otomatik yürütme** - Doğrulama kuralları alan değerleri değiştiğinde çalışır
3. **Hata yayılımı** - Doğrulama hataları alan durumu sinyalleri aracılığıyla açığa çıkar
4. **Reaktif güncellemeler** - Doğrulama durumu değiştiğinde kullanıcı arayüzü otomatik olarak güncellenir

Doğrulama, etkileşimli alanlar için her değer değişikliğinde çalışır. Gizli ve devre dışı alanlar doğrulama çalıştırmaz -- alan tekrar etkileşimli olana kadar doğrulama kuralları atlanır.

### Validation timing

Doğrulama kuralları şu sırayla yürütülür:

1. **Senkron doğrulama** - Değer değiştiğinde tüm senkron doğrulama kuralları çalışır
2. **Asenkron doğrulama** - Asenkron doğrulama kuralları yalnızca tüm senkron doğrulama kuralları geçtikten sonra çalışır
3. **Alan durumu güncellemeleri** - `valid()`, `invalid()`, `errors()` ve `pending()` sinyalleri güncellenir

Senkron doğrulama kuralları (`required()`, `email()` gibi) anında tamamlanır. Asenkron doğrulama kuralları (`validateHttp()` gibi) zaman alabilir ve yürütülürken `pending()` sinyalini `true` olarak ayarlar.

Tüm doğrulama kuralları her değişiklikte çalışır -- doğrulama ilk hatadan sonra kısa devre yapmaz. Bir alanda hem `required()` hem de `email()` doğrulama kuralları varsa, her ikisi de çalışır ve her ikisi de aynı anda hata üretebilir.

## Built-in validation rules

Signal Forms, yaygın doğrulama senaryoları için doğrulama kuralları sağlar. Tüm yerleşik doğrulama kuralları, özel hata mesajları ve koşullu mantık için bir seçenekler nesnesi kabul eder.

### required()

`required()` doğrulama kuralı bir alanın değere sahip olmasını sağlar:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Username
        <input [formField]="registrationForm.username" />
      </label>

      <label>
        Email
        <input type="email" [formField]="registrationForm.email" />
      </label>

      <button type="submit">Register</button>
    </form>
  `,
})
export class RegistrationComponent {
  registrationModel = signal({
    username: '',
    email: '',
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});
    required(schemaPath.email, {message: 'Email is required'});
  });
}
```

Bir alan şu durumlarda "boş" kabul edilir:

| Koşul          | Örnek   |
| -------------- | ------- |
| Değer `null`   | `null`, |
| Değer boş dize | `''`    |

Koşullu gereksinimler için `when` seçeneğini kullanın:

```ts
registrationForm = form(this.registrationModel, (schemaPath) => {
  required(schemaPath.promoCode, {
    message: 'Promo code is required for discounts',
    when: ({valueOf}) => valueOf(schemaPath.applyDiscount),
  });
});
```

Doğrulama kuralı yalnızca `when` fonksiyonu `true` döndürdüğünde çalışır.

NOTE: `required`, boş dizi için `true` döndürür. Dizileri doğrulamak için [`minLength()`](#minlength-and-maxlength) kullanın.

### email()

`email()` doğrulama kuralı geçerli e-posta biçimini kontrol eder:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, email} from '@angular/forms/signals';

@Component({
  selector: 'app-contact',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Your Email
        <input type="email" [formField]="contactForm.email" />
      </label>
    </form>
  `,
})
export class ContactComponent {
  contactModel = signal({email: ''});

  contactForm = form(this.contactModel, (schemaPath) => {
    email(schemaPath.email, {message: 'Please enter a valid email address'});
  });
}
```

`email()` doğrulama kuralı standart bir e-posta biçimi regex'i kullanır. `user@example.com` gibi adresleri kabul eder ancak `user@` veya `@example.com` gibi hatalı biçimlendirilmiş adresleri reddeder.

### min() and max()

`min()` ve `max()` doğrulama kuralları sayısal değerlerle çalışır:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, min, max} from '@angular/forms/signals';

@Component({
  selector: 'app-age-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Age
        <input type="number" [formField]="ageForm.age" />
      </label>

      <label>
        Rating (1-5)
        <input type="number" [formField]="ageForm.rating" />
      </label>
    </form>
  `,
})
export class AgeFormComponent {
  ageModel = signal({
    age: 0,
    rating: 0,
  });

  ageForm = form(this.ageModel, (schemaPath) => {
    min(schemaPath.age, 18, {message: 'You must be at least 18 years old'});
    max(schemaPath.age, 120, {message: 'Please enter a valid age'});

    min(schemaPath.rating, 1, {message: 'Rating must be at least 1'});
    max(schemaPath.rating, 5, {message: 'Rating cannot exceed 5'});
  });
}
```

Dinamik kısıtlamalar için hesaplanmış değerler kullanabilirsiniz:

```ts
ageForm = form(this.ageModel, (schemaPath) => {
  min(schemaPath.participants, () => this.minimumRequired(), {
    message: 'Not enough participants',
  });
});
```

### minLength() and maxLength()

`minLength()` ve `maxLength()` doğrulama kuralları dizeler ve dizilerle çalışır:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, minLength, maxLength} from '@angular/forms/signals';

@Component({
  selector: 'app-password-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Password
        <input type="password" [formField]="passwordForm.password" />
      </label>

      <label>
        Bio
        <textarea [formField]="passwordForm.bio"></textarea>
      </label>
    </form>
  `,
})
export class PasswordFormComponent {
  passwordModel = signal({
    password: '',
    bio: '',
  });

  passwordForm = form(this.passwordModel, (schemaPath) => {
    minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});
    maxLength(schemaPath.password, 100, {message: 'Password is too long'});

    maxLength(schemaPath.bio, 500, {message: 'Bio cannot exceed 500 characters'});
  });
}
```

Dizeler için "uzunluk" karakter sayısı anlamına gelir. Diziler için "uzunluk" eleman sayısı anlamına gelir.

### pattern()

`pattern()` doğrulama kuralı bir düzenli ifadeye karşı doğrular:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, pattern} from '@angular/forms/signals';

@Component({
  selector: 'app-phone-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Phone Number
        <input [formField]="phoneForm.phone" placeholder="555-123-4567" />
      </label>

      <label>
        Postal Code
        <input [formField]="phoneForm.postalCode" placeholder="12345" />
      </label>
    </form>
  `,
})
export class PhoneFormComponent {
  phoneModel = signal({
    phone: '',
    postalCode: '',
  });

  phoneForm = form(this.phoneModel, (schemaPath) => {
    pattern(schemaPath.phone, /^\d{3}-\d{3}-\d{4}$/, {
      message: 'Phone must be in format: 555-123-4567',
    });

    pattern(schemaPath.postalCode, /^\d{5}$/, {
      message: 'Postal code must be 5 digits',
    });
  });
}
```

Yaygın kalıplar:

| Kalıp Türü       | Düzenli İfade           | Örnek        |
| ---------------- | ----------------------- | ------------ |
| Telefon          | `/^\d{3}-\d{3}-\d{4}$/` | 555-123-4567 |
| Posta kodu (ABD) | `/^\d{5}$/`             | 12345        |
| Alfanümerik      | `/^[a-zA-Z0-9]+$/`      | abc123       |
| URL güvenli      | `/^[a-zA-Z0-9_-]+$/`    | my-url_123   |

## Validation of array items

Formlar iç içe nesnelerin dizilerini içerebilir (örneğin, bir sipariş öğeleri listesi). Bir dizideki her öğeye doğrulama kuralları uygulamak için şema fonksiyonunuzun içinde `applyEach()` kullanın. `applyEach()`, dizi yolunu yineleyerek her öğe için üst düzey alanlar gibi doğrulayıcılar uygulayabileceğiniz bir yol sağlar.

```ts
import {Component, signal} from '@angular/core';
import {applyEach, FormField, form, min, required, SchemaPathTree} from '@angular/forms/signals';

type Item = {name: string; quantity: number};

interface Order {
  title: string;
  description: string;
  items: Item[];
}

function ItemSchema(item: SchemaPathTree<Item>) {
  required(item.name, {message: 'Item name is required'});
  min(item.quantity, 1, {message: 'Quantity must be at least 1'});
}

@Component(/* ... */)
export class OrderComponent {
  orderModel = signal<Order>({
    title: '',
    description: '',
    items: [{name: '', quantity: 0}],
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    required(schemaPath.title);
    required(schemaPath.description);

    applyEach(schemaPath.items, ItemSchema);
  });
}
```

## Validation errors

Doğrulama kuralları başarısız olduğunda, neyin yanlış gittiğini tanımlayan hata nesneleri üretir. Hata yapısını anlamak, kullanıcılara net geri bildirim sağlamanıza yardımcı olur.

<!-- TODO: Uncomment when field state management guide is published

NOTE: Bu bölüm doğrulama kurallarının ürettiği hataları ele alır. Doğrulama hatalarını kullanıcı arayüzünüzde görüntüleme ve kullanma hakkında [Alan Durumu Yönetimi kılavuzuna](guide/forms/signals/field-state-management) bakın. -->

### Error structure

Her doğrulama hatası nesnesi şu özellikleri içerir:

| Özellik   | Açıklama                                                                |
| --------- | ----------------------------------------------------------------------- |
| `kind`    | Başarısız olan doğrulama kuralı (örn. "required", "email", "minLength") |
| `message` | İsteğe bağlı insan tarafından okunabilir hata mesajı                    |

Yerleşik doğrulama kuralları `kind` özelliğini otomatik olarak ayarlar. `message` özelliği isteğe bağlıdır -- doğrulama kuralı seçenekleri aracılığıyla özel mesajlar sağlayabilirsiniz.

### Custom error messages

Tüm yerleşik doğrulama kuralları, özel hata metni için bir `message` seçeneği kabul eder:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, minLength} from '@angular/forms/signals';

@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Username
        <input [formField]="signupForm.username" />
      </label>

      <label>
        Password
        <input type="password" [formField]="signupForm.password" />
      </label>
    </form>
  `,
})
export class SignupComponent {
  signupModel = signal({
    username: '',
    password: '',
  });

  signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.username, {
      message: 'Please choose a username',
    });

    required(schemaPath.password, {
      message: 'Password cannot be empty',
    });
    minLength(schemaPath.password, 12, {
      message: 'Password must be at least 12 characters for security',
    });
  });
}
```

Özel mesajlar net, spesifik olmalı ve kullanıcılara sorunu nasıl düzelteceklerini söylemelidir. "Geçersiz girdi" yerine "Güvenlik için şifre en az 12 karakter olmalıdır" kullanın.

### Multiple errors per field

Bir alanda birden fazla doğrulama kuralı olduğunda, her doğrulama kuralı bağımsız olarak çalışır ve bir hata üretebilir:

```ts
signupForm = form(this.signupModel, (schemaPath) => {
  required(schemaPath.email, {message: 'Email is required'});
  email(schemaPath.email, {message: 'Enter a valid email address'});
  minLength(schemaPath.email, 5, {message: 'Email is too short'});
});
```

E-posta alanı boşsa, yalnızca `required()` hatası görünür. Kullanıcı "a@b" yazarsa, hem `email()` hem de `minLength()` hataları görünür. Tüm doğrulama kuralları çalışır -- doğrulama ilk başarısızlıktan sonra durmaz.

TIP: Hataların kullanıcılar alanla etkileşime girmeden önce görünmesini önlemek için şablonlarınızda `touched() && invalid()` kalıbını kullanın. Doğrulama hatalarını görüntüleme hakkında kapsamlı rehberlik için [Alan Durumu Yönetimi kılavuzuna](guide/forms/signals/field-state-management#conditional-error-display) bakın.

## Custom validation rules

Yerleşik doğrulama kuralları yaygın durumları ele alsa da, iş kuralları, karmaşık biçimler veya alana özgü kısıtlamalar için sıklıkla özel doğrulama mantığına ihtiyaç duyarsınız.

### Using validate()

`validate()` fonksiyonu özel doğrulama kuralları oluşturur. Alan bağlamına erişen ve şunları döndüren bir doğrulayıcı fonksiyon alır:

| Dönüş Değeri            | Anlam          |
| ----------------------- | -------------- |
| Hata nesnesi            | Değer geçersiz |
| `null` veya `undefined` | Değer geçerli  |

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, validate} from '@angular/forms/signals';

@Component({
  selector: 'app-url-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Website URL
        <input [formField]="urlForm.website" />
      </label>
    </form>
  `,
})
export class UrlFormComponent {
  urlModel = signal({website: ''});

  urlForm = form(this.urlModel, (schemaPath) => {
    validate(schemaPath.website, ({value}) => {
      if (!value().startsWith('https://')) {
        return {
          kind: 'https',
          message: 'URL must start with https://',
        };
      }

      return null;
    });
  });
}
```

Doğrulayıcı fonksiyon şunları içeren bir `FieldContext` nesnesi alır:

| Özellik         | Tür        | Açıklama                                     |
| --------------- | ---------- | -------------------------------------------- |
| `value`         | Signal     | Mevcut alan değerini içeren sinyal           |
| `state`         | FieldState | Alan durumu referansı                        |
| `field`         | FieldTree  | Alan ağacı referansı                         |
| `valueOf()`     | Yöntem     | Yola göre başka bir alanın değerini alma     |
| `stateOf()`     | Yöntem     | Yola göre başka bir alanın durumunu alma     |
| `fieldTreeOf()` | Yöntem     | Yola göre başka bir alanın alan ağacını alma |
| `pathKeys`      | Signal     | Kökten mevcut alana kadar yol anahtarları    |

NOTE: Alt alanların ayrıca bir `key` sinyali vardır ve dizi öğesi alanlarının hem `key` hem de `index` sinyalleri vardır.

Doğrulama başarısız olduğunda `kind` ve `message` ile bir hata nesnesi döndürün. Doğrulama geçtiğinde `null` veya `undefined` döndürün.

### Using validateTree()

`validateTree()` fonksiyonu, birden fazla alanı hedefleyebilen veya tüm alt ağaç için karmaşık doğrulama mantığı sağlayan özel doğrulama kuralları oluşturur.

```angular-ts
import {Component, model} from '@angular/core';
import {form, FormField, validateTree} from '@angular/forms/signals';

interface User {
  firstName: string;
  lastName: string;
}

@Component({
  /* ... */
})
export class UserFormComponent {
  readonly userModel = model<DTO>({
    firstName: '',
    lastName: '',
  });

  userForm = form(this.userModel, (path) => {
    validateTree(path, (ctx) => {
      if (ctx.valueOf(path.firstName).length < 5) {
        return {
          kind: 'minLength5',
          message: 'First name must be at least 5 characters',
          fieldTree: ctx.fieldTree.lastName,
        };
      }

      return null;
    });
  });
}
```

`validateTree()` doğrulayıcı fonksiyonu, `validate()` ile aynı `FieldContext` nesnesini alır.

### Reusable validation rules

`validate()`'i sararak yeniden kullanılabilir doğrulama kuralı fonksiyonları oluşturun:

```ts
function url(path: SchemaPath<string>, options?: {message?: string}) {
  validate(path, ({value}) => {
    try {
      new URL(value());
      return null;
    } catch {
      return {
        kind: 'url',
        message: options?.message || 'Enter a valid URL',
      };
    }
  });
}

function phoneNumber(path: SchemaPath<string>, options?: {message?: string}) {
  validate(path, ({value}) => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    if (!phoneRegex.test(value())) {
      return {
        kind: 'phoneNumber',
        message: options?.message || 'Phone must be in format: 555-123-4567',
      };
    }

    return null;
  });
}
```

Özel doğrulama kurallarını yerleşik doğrulama kuralları gibi kullanabilirsiniz:

```ts
urlForm = form(this.urlModel, (schemaPath) => {
  url(schemaPath.website, {message: 'Please enter a valid website URL'});
  phoneNumber(schemaPath.phone);
});
```

## Cross-field validation

Çapraz alan doğrulama, birden fazla alan değerini karşılaştırır veya ilişkilendirir.

Çapraz alan doğrulama için yaygın bir senaryo şifre onayıdır:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, minLength, validate} from '@angular/forms/signals';

@Component({
  selector: 'app-password-change',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        New Password
        <input type="password" [formField]="passwordForm.password" />
      </label>

      <label>
        Confirm Password
        <input type="password" [formField]="passwordForm.confirmPassword" />
      </label>

      <button type="submit">Change Password</button>
    </form>
  `,
})
export class PasswordChangeComponent {
  passwordModel = signal({
    password: '',
    confirmPassword: '',
  });

  passwordForm = form(this.passwordModel, (schemaPath) => {
    required(schemaPath.password, {message: 'Password is required'});
    minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});

    required(schemaPath.confirmPassword, {message: 'Please confirm your password'});

    validate(schemaPath.confirmPassword, ({value, valueOf}) => {
      const confirmPassword = value();
      const password = valueOf(schemaPath.password);

      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match',
        };
      }

      return null;
    });
  });
}
```

Onay doğrulama kuralı, `valueOf(schemaPath.password)` kullanarak şifre alanı değerine erişir ve onay değeriyle karşılaştırır. Bu doğrulama kuralı reaktif olarak çalışır -- şifrelerden herhangi biri değişirse, doğrulama otomatik olarak yeniden çalışır.

## Async validation

Asenkron doğrulama, kullanıcı adı kullanılabilirliğini bir sunucuda kontrol etmek veya bir API'ye karşı doğrulama gibi harici veri kaynaklarını gerektiren doğrulamayı ele alır.

### Using validateHttp()

`validateHttp()` fonksiyonu HTTP tabanlı doğrulama gerçekleştirir:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, validateHttp} from '@angular/forms/signals';

@Component({
  selector: 'app-username-form',|
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Username
        <input [formField]="usernameForm.username" />

        @if (usernameForm.username().pending()) {
          <span class="checking">Checking availability...</span>
        }
      </label>
    </form>
  `,
})
export class UsernameFormComponent {
  usernameModel = signal({username: ''});

  usernameForm = form(this.usernameModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});

    validateHttp(schemaPath.username, {
      request: ({value}) => `/api/check-username?username=${value()}`,
      onSuccess: (response: any) => {
        if (response.taken) {
          return {
            kind: 'usernameTaken',
            message: 'Username is already taken',
          };
        }
        return null;
      },
      onError: (error) => ({
        kind: 'networkError',
        message: 'Could not verify username availability',
      }),
    });
  });
}
```

`validateHttp()` doğrulama kuralı:

1. `request` fonksiyonu tarafından döndürülen URL'yi veya isteği çağırır
2. `onSuccess` kullanarak başarılı yanıtı bir doğrulama hatasına veya `null`'a eşler
3. İstek başarısızlıklarını (ağ hataları, HTTP hataları) `onError` kullanarak yönetir
4. İstek devam ederken `pending()`'i `true` olarak ayarlar
5. Yalnızca tüm senkron doğrulama kuralları geçtikten sonra çalışır

### Pending state

Asenkron doğrulama çalışırken, alanın `pending()` sinyali `true` döndürür. Yükleme göstergeleri göstermek için bunu kullanın:

```angular-html
@if (form.username().pending()) {
  <span class="spinner">Checking...</span>
}
```

`valid()` sinyali, doğrulama beklemedeyken henüz hata olmasa bile `false` döndürür. `invalid()` sinyali yalnızca hatalar mevcutsa `true` döndürür.

## Integration with schema validation libraries

Signal Forms, [Zod](https://zod.dev/) veya [Valibot](https://valibot.dev/) gibi [Standard Schema](https://standardschema.dev/)'ya uygun kütüphaneler için yerleşik desteğe sahiptir. Entegrasyon, `validateStandardSchema` fonksiyonu aracılığıyla sağlanır. Bu, Signal Forms'un reaktif doğrulama avantajlarını koruyarak mevcut şemaları kullanmanıza olanak tanır.

```ts
import {form, validateStandardSchema} from '@angular/forms/signals';
import * as z from 'zod';

// Şemanızı tanımlayın
const userSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

// Signal Forms ile kullanın
const userForm = form(signal({email: '', password: ''}), (schemaPath) => {
  validateStandardSchema(schemaPath, userSchema);
});
```

### Dynamic schemas

Doğrulama şemasının bağımlılıkları değiştiğinde otomatik olarak güncellenmesi için statik bir şema yerine bir sinyal geçirebilirsiniz.

```angular-ts
import {Component, computed, signal} from '@angular/core';
import {form, FormField, validateStandardSchema} from '@angular/forms/signals';
import z from 'zod';

@Component({
  /* ... */
})
export class DynamicSchema {
  model = signal({document: '', type: 'dni'});

  // Şema otomatik olarak tür değişikliklerine tepki verir
  schema = computed(() =>
    z.object({
      document:
        this.model().type === 'dni'
          ? z.string().length(8, 'DNI must be 8 digits')
          : z.string().min(12, 'Passport must be at least 12 characters'),
    }),
  );

  f = form(this.model, (p) => validateStandardSchema(p, () => this.schema()));
}
```

## Next steps

Bu kılavuz doğrulama kuralları oluşturmayı ve uygulamayı ele aldı. İlgili kılavuzlar Signal Forms'un diğer yönlerini inceler:

<!-- TODO: UNCOMMENT WHEN THE GUIDES ARE AVAILABLE -->
<docs-pill-row>
  <docs-pill href="guide/forms/signals/field-state-management" title="Field state management" />
  <docs-pill href="guide/forms/signals/models" title="Form models" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Custom controls" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
