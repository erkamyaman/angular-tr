# Alan durumu yönetimi

Signal Forms'un alan durumu, doğrulama durumu (`valid`, `invalid`, `errors` gibi), etkileşim takibi (`touched`, `dirty` gibi) ve kullanılabilirlik (`disabled`, `hidden` gibi) için reaktif sinyaller sağlayarak kullanıcı etkileşimlerine tepki vermenize olanak tanır.

## Alan durumunu anlama

[`form()`](api/forms/signals/form) fonksiyonu ile bir form oluşturduğunuzda, bir **alan ağacı** döndürür - form modelinizi yansıtan bir nesne yapısı. Ağaçtaki her alana nokta gösterimi ile erişilebilir ([`form.email`](api/forms/signals/form#email) gibi).

### Alan durumuna erişim

Alan ağacındaki herhangi bir alanı fonksiyon olarak çağırdığınızda ([`form.email()`](api/forms/signals/form#email) gibi), alanın doğrulama, etkileşim ve kullanılabilirlik durumunu izleyen reaktif sinyaller içeren bir `FieldState` nesnesi döndürür. Örneğin, `invalid()` sinyali alanın doğrulama hataları olup olmadığını söyler:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, email} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <input type="email" [formField]="registrationForm.email" />

    @if (registrationForm.email().invalid()) {
      <p class="error">Email has validation errors:</p>
      <ul>
        @for (error of registrationForm.email().errors(); track error) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }
  `,
})
export class Registration {
  registrationModel = signal({
    email: '',
    password: '',
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    email(schemaPath.email, {message: 'Enter a valid email address'});
  });
}
```

Bu örnekte, şablon bir hata mesajı gösterip göstermemeye karar vermek için `registrationForm.email().invalid()` değerini kontrol eder.

### Alan durumu sinyalleri

En yaygın kullanılan sinyal, alanın geçerli değerine erişim sağlayan bir `WritableSignal` olan `value()`'dur:

```ts
const emailValue = registrationForm.email().value();
console.log(emailValue); // Geçerli email dizesi
```

`value()` dışında, alan durumu doğrulama, etkileşim takibi ve kullanılabilirlik kontrolü için sinyaller içerir:

| Category                                      | Signal       | Description                                                                           |
| --------------------------------------------- | ------------ | ------------------------------------------------------------------------------------- |
| **[Validation](#doğrulama-durumu)**           | `valid()`    | Alan tüm doğrulama kurallarını geçer ve bekleyen doğrulayıcı yoktur                   |
|                                               | `invalid()`  | Alanın doğrulama hataları var                                                         |
|                                               | `errors()`   | Doğrulama hata nesneleri dizisi                                                       |
|                                               | `pending()`  | Asenkron doğrulama devam ediyor                                                       |
| **[Interaction](#etkileşim-durumu)**          | `touched()`  | Kullanıcı alana odaklanmış ve odağı bırakmış (etkileşimli ise)                        |
|                                               | `dirty()`    | Kullanıcı alanı değiştirmiş (etkileşimli ise), değer başlangıç durumuyla eşleşse bile |
| **[Availability](#kullanılabilirlik-durumu)** | `disabled()` | Alan devre dışı ve üst form durumunu etkilemiyor                                      |
|                                               | `hidden()`   | Alanın gizlenmesi gerektiğini belirtir; şablonda görünürlük `@if` ile kontrol edilir  |
|                                               | `readonly()` | Alan salt okunur ve üst form durumunu etkilemiyor                                     |

Bu sinyaller, kullanıcı davranışına tepki veren, manuel olay işleme gerektirmeyen duyarlı form kullanıcı deneyimleri oluşturmanızı sağlar. Aşağıdaki bölümler her kategoriyi ayrıntılı olarak inceler.

## Doğrulama durumu

Doğrulama durumu sinyalleri, bir alanın geçerli olup olmadığını ve hangi hataları içerdiğini söyler.

NOTE: Bu kılavuz, şablonlarınızda ve mantığınızda doğrulama durumunu **kullanmaya** odaklanır (geri bildirim göstermek için `valid()`, `invalid()`, `errors()` okuma gibi). Doğrulama kuralları **tanımlama** ve özel doğrulayıcılar oluşturma hakkında bilgi için [Doğrulama kılavuzuna](guide/forms/signals/validation) bakın.

### Geçerliliği kontrol etme

Doğrulama durumunu kontrol etmek için `valid()` ve `invalid()` kullanın:

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="loginForm.email" />

    @if (loginForm.email().invalid()) {
      <p class="error">Email is invalid</p>
    }
    @if (loginForm.email().valid()) {
      <p class="success">Email looks good</p>
    }
  `,
})
export class Login {
  loginModel = signal({email: '', password: ''});
  loginForm = form(this.loginModel);
}
```

| Signal      | Returns `true` when                                                 |
| ----------- | ------------------------------------------------------------------- |
| `valid()`   | Alan tüm doğrulama kurallarını geçer ve bekleyen doğrulayıcı yoktur |
| `invalid()` | Alanın doğrulama hataları var                                       |

Kodda geçerlilik kontrol ederken, "hataları var" ile "doğrulama beklemede" durumlarını ayırt etmek istiyorsanız `!valid()` yerine `invalid()` kullanın. Bunun nedeni, asenkron doğrulama beklemedeyken hem `valid()` hem de `invalid()` aynı anda `false` olabilmesidir; çünkü doğrulama henüz tamamlanmadığı için alan geçerli değildir ve henüz hata bulunmadığı için de geçersiz değildir.

### Doğrulama hatalarını okuma

Doğrulama hatalarının dizisine `errors()` ile erişin. Her hata nesnesi şunları içerir:

| Property    | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `kind`      | Başarısız olan doğrulama kuralı ("required" veya "email" gibi) |
| `message`   | İsteğe bağlı okunabilir hata mesajı                            |
| `fieldTree` | Hatanın oluştuğu `FieldTree`'ye referans                       |

NOTE: `message` özelliği isteğe bağlıdır. Doğrulayıcılar özel hata mesajları sağlayabilir, ancak belirtilmezse hata `kind` değerlerini kendi mesajlarınızla eşlemeniz gerekebilir.

İşte şablonunuzda hataları nasıl göstereceğinize dair bir örnek:

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="loginForm.email" />

    @if (loginForm.email().errors().length > 0) {
      <div class="errors">
        @for (error of loginForm.email().errors(); track error) {
          <p>{{ error.message }}</p>
        }
      </div>
    }
  `
})
```

Bu yaklaşım, bir alan için tüm hataları döngüye alarak her hata mesajını kullanıcıya gösterir.

### Bekleyen doğrulama

`pending()` sinyali, asenkron doğrulamanın devam ettiğini belirtir:

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="signupForm.email" />

    @if (signupForm.email().pending()) {
      <p>Checking if email is available...</p>
    }

    @if (signupForm.email().invalid() && !signupForm.email().pending()) {
      <p>Email is already taken</p>
    }
  `
})
```

Bu sinyal, asenkron doğrulama yürütülürken yükleme durumları göstermenizi sağlar.

## Etkileşim durumu

Etkileşim durumu, kullanıcıların alanlarla etkileşim kurup kurmadığını izler ve "hataları yalnızca kullanıcı alana dokunduktan sonra göster" gibi kalıpları mümkün kılar.

### Dokunulmuş durumu

`touched()` sinyali, bir kullanıcının bir alana odaklanıp ardından odağı bırakıp bırakmadığını izler. Kullanıcı, kullanıcı etkileşimi (programatik olmayan) yoluyla bir alana odaklanıp ardından odağı bıraktığında `true` olur. Gizli, devre dışı ve salt okunur alanlar etkileşimsizdir ve kullanıcı etkileşimlerinden dokunulmuş hale gelmez.

### Kirli durumu

Formlar genellikle verilerin gerçekten değişip değişmediğini tespit etmek zorundadır - örneğin, kullanıcıları kaydedilmemiş değişiklikler hakkında uyarmak veya bir kaydet düğmesini yalnızca gerektiğinde etkinleştirmek için. `dirty()` sinyali, kullanıcının alanı değiştirip değiştirmediğini izler.

`dirty()` sinyali, kullanıcı etkileşimli bir alanın değerini değiştirdiğinde `true` olur ve değer başlangıç değeriyle eşleşecek şekilde geri değiştirilse bile `true` kalır:

```angular-ts
@Component({
  template: `
    <form novalidate>
      <input [formField]="profileForm.name" />
      <input [formField]="profileForm.bio" />

      @if (profileForm().dirty()) {
        <p class="warning">You have unsaved changes</p>
      }
    </form>
  `,
})
export class Profile {
  profileModel = signal({name: 'Alice', bio: 'Developer'});
  profileForm = form(this.profileModel);
}
```

"Kaydedilmemiş değişiklikler" uyarıları için veya yalnızca veriler değiştiğinde kaydet düğmelerini etkinleştirmek için `dirty()` kullanın.

### Dokunulmuş ve kirli karşılaştırması

Bu sinyaller farklı kullanıcı etkileşimlerini izler:

| Signal      | When it becomes true                                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `touched()` | Kullanıcı etkileşimli bir alana odaklanmış ve odağı bırakmış (hiçbir şey değiştirmese bile)                             |
| `dirty()`   | Kullanıcı etkileşimli bir alanı değiştirmiş (odağı hiç bırakmasa bile ve mevcut değer başlangıç değeriyle eşleşse bile) |

Bir alan farklı kombinasyonlarda olabilir:

| State                      | Scenario                                                               |
| -------------------------- | ---------------------------------------------------------------------- |
| Dokunulmuş ama kirli değil | Kullanıcı alana odaklanmış ve odağı bırakmış ancak değişiklik yapmamış |
| Hem dokunulmuş hem kirli   | Kullanıcı alana odaklanmış, değeri değiştirmiş ve odağı bırakmış       |

NOTE: Gizli, devre dışı ve salt okunur alanlar etkileşimsizdir - kullanıcı etkileşimlerinden dokunulmuş veya kirli hale gelmezler.

## Kullanılabilirlik durumu

Kullanılabilirlik durumu sinyalleri, alanların etkileşimli, düzenlenebilir veya görünür olup olmadığını kontrol eder. Devre dışı, gizli ve salt okunur alanlar etkileşimsizdir. Üst formlarının geçerli, dokunulmuş veya kirli olup olmadığını etkilemezler.

### Devre dışı alanlar

`disabled()` sinyali, bir alanın kullanıcı girdisi kabul edip etmediğini belirtir. Devre dışı alanlar arayüzde görünür ancak kullanıcılar bunlarla etkileşim kuramaz.

```angular-ts
import { Component, signal } from '@angular/core'
import { form, FormField, disabled } from '@angular/forms/signals'

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <!-- İPUCU: `[formField]` direktifi, alanın `disabled()` durumuna göre `disabled` niteliğini otomatik olarak bağlar, bu yüzden manuel olarak `[disabled]="field().disabled()"` eklemenize gerek yoktur -->
    <input [formField]="orderForm.couponCode" />

    @if (orderForm.couponCode().disabled()) {
      <p class="info">Coupon code is only available for orders over $50</p>
    }
  `
})
export class Order {
  orderModel = signal({
    total: 25,
    couponCode: ''
  })

  orderForm = form(this.orderModel, schemaPath => {
    disabled(schemaPath.couponCode, ({valueOf}) => valueOf(schemaPath.total) < 50)
  })
}
```

Bu örnekte, `couponCode`'un devre dışı olup olmadığını belirlemek için `total` alanının değerini kontrol etmek üzere `valueOf(schemaPath.total)` kullanıyoruz.

NOTE: Şema geri çağırma parametresi (bu örneklerde `schemaPath`), formunuzdaki tüm alanlara yollar sağlayan bir `SchemaPathTree` nesnesidir. Bu parametreyi istediğiniz gibi adlandırabilirsiniz.

`disabled()`, `hidden()` veya `readonly()` gibi kurallar tanımlarken, mantık geri çağırma fonksiyonu genellikle parçalanan (`({valueOf})` gibi) bir `FieldContext` nesnesi alır. Doğrulama kurallarında yaygın olarak kullanılan iki yöntem:

- `valueOf(schemaPath.otherField)` - Formdaki başka bir alanın değerini okur
- `value()` - Kuralın uygulandığı alanın değerini içeren bir sinyal

Devre dışı alanlar, üst formun doğrulama durumuna katkıda bulunmaz. Devre dışı bir alan geçersiz olsa bile, üst form yine de geçerli olabilir. `disabled()` durumu etkileşimi ve doğrulamayı etkiler, ancak alanın değerini değiştirmez.

### Gizli alanlar

`hidden()` sinyali, bir alanın koşullu olarak gizli olup olmadığını belirtir. Koşullara dayalı olarak alanları göstermek veya gizlemek için `hidden()` ile `@if` kullanın:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, hidden} from '@angular/forms/signals';

@Component({
  selector: 'app-profile',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="profileForm.isPublic" />
      Make profile public
    </label>

    @if (!profileForm.publicUrl().hidden()) {
      <label>
        Public URL
        <input [formField]="profileForm.publicUrl" />
      </label>
    }
  `,
})
export class Profile {
  profileModel = signal({
    isPublic: false,
    publicUrl: '',
  });

  profileForm = form(this.profileModel, (schemaPath) => {
    hidden(schemaPath.publicUrl, ({valueOf}) => !valueOf(schemaPath.isPublic));
  });
}
```

Gizli alanlar doğrulamaya katılmaz. Zorunlu bir alan gizliyse, form gönderimini engellemez. `hidden()` durumu kullanılabilirliği ve doğrulamayı etkiler, ancak alanın değerini değiştirmez.

### Salt okunur alanlar

`readonly()` sinyali, bir alanın salt okunur olup olmadığını belirtir. Salt okunur alanlar değerlerini gösterir ancak kullanıcılar bunları düzenleyemez:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, readonly} from '@angular/forms/signals';

@Component({
  selector: 'app-account',
  imports: [FormField],
  template: `
    <label>
      Username (cannot be changed)
      <input [formField]="accountForm.username" />
    </label>

    <label>
      Email
      <input [formField]="accountForm.email" />
    </label>
  `,
})
export class Account {
  accountModel = signal({
    username: 'johndoe',
    email: 'john@example.com',
  });

  accountForm = form(this.accountModel, (schemaPath) => {
    readonly(schemaPath.username);
  });
}
```

NOTE: `[formField]` direktifi, alanın `readonly()` durumuna göre `readonly` niteliğini otomatik olarak bağlar, bu yüzden manuel olarak `[readonly]="field().readonly()"` eklemenize gerek yoktur.

Devre dışı ve gizli alanlar gibi, salt okunur alanlar da etkileşimsizdir ve üst form durumunu etkilemez. `readonly()` durumu düzenlenebilirliği ve doğrulamayı etkiler, ancak alanın değerini değiştirmez.

### Her birini ne zaman kullanmalı

| State        | Use when                                                                   | User can see it  | User can interact | Contributes to validation |
| ------------ | -------------------------------------------------------------------------- | ---------------- | ----------------- | ------------------------- |
| `disabled()` | Alan geçici olarak kullanılamaz (diğer alan değerlerine bağlı olarak gibi) | Evet             | Hayır             | Hayır                     |
| `hidden()`   | Alan mevcut bağlamda ilgili değil                                          | Hayır (with @if) | Hayır             | Hayır                     |
| `readonly()` | Değer görünür olmalı ama düzenlenemez                                      | Evet             | Hayır             | Hayır                     |

## Form düzeyinde durum

Kök form da alan ağacındaki bir alandır. Onu fonksiyon olarak çağırdığınızda, tüm alt alanların durumunu toplayan bir `FieldState` nesnesi de döndürür.

### Form durumuna erişim

```angular-ts
@Component({
  template: `
    <form novalidate>
      <input [formField]="loginForm.email" />
      <input [formField]="loginForm.password" />

      <button [disabled]="!loginForm().valid()">Sign In</button>
    </form>
  `,
})
export class Login {
  loginModel = signal({email: '', password: ''});
  loginForm = form(this.loginModel);
}
```

Bu örnekte, form yalnızca tüm alt alanlar geçerli olduğunda geçerlidir. Bu, genel form geçerliliğine göre gönder düğmelerini etkinleştirmenizi/devre dışı bırakmanızı sağlar.

### Form düzeyinde sinyaller

Kök form bir alan olduğu için, aynı sinyallere sahiptir (`valid()`, `invalid()`, `touched()`, `dirty()`, vb. gibi).

| Signal      | Form-level behavior                                            |
| ----------- | -------------------------------------------------------------- |
| `valid()`   | Tüm etkileşimli alanlar geçerli ve bekleyen doğrulayıcı yok    |
| `invalid()` | En az bir etkileşimli alanın doğrulama hataları var            |
| `pending()` | En az bir etkileşimli alanın bekleyen asenkron doğrulaması var |
| `touched()` | Kullanıcı en az bir etkileşimli alana dokunmuş                 |
| `dirty()`   | Kullanıcı en az bir etkileşimli alanı değiştirmiş              |

### Form düzeyi ve alan düzeyi ne zaman kullanılmalı

**Form düzeyinde durumu şunlar için kullanın:**

- Gönder düğmesi etkin/devre dışı durumu
- "Kaydet" düğmesi durumu
- Genel form geçerlilik kontrolleri
- Kaydedilmemiş değişiklik uyarıları

**Alan düzeyinde durumu şunlar için kullanın:**

- Bireysel alan hata mesajları
- Alana özgü stil
- Alan bazında doğrulama geri bildirimi
- Koşullu alan kullanılabilirliği

## Durum yayılımı

Alan durumu, alt alanlardan üst alan grupları aracılığıyla kök forma kadar yukarı yayılır.

### Alt alan durumu üst formları nasıl etkiler

Bir alt alan geçersiz olduğunda, üst alan grubu da geçersiz olur ve kök form da öyle. Bir alt alan dokunulmuş veya kirli olduğunda, üst alan grubu ve kök form bu değişikliği yansıtır. Bu toplama, herhangi bir düzeyde - alan veya tüm form - geçerliliği kontrol etmenizi sağlar.

```ts
const userModel = signal({
  profile: {
    firstName: '',
    lastName: '',
  },
  address: {
    street: '',
    city: '',
  },
});

const userForm = form(userModel);

// firstName geçersizse, profile da geçersizdir
userForm.profile.firstName().invalid() === true;
// → userForm.profile().invalid() === true
// → userForm().invalid() === true
```

### Gizli, devre dışı ve salt okunur alanlar

Gizli, devre dışı ve salt okunur alanlar etkileşimsizdir ve üst form durumunu etkilemez:

```ts
const orderModel = signal({
  customerName: '',
  requiresShipping: false,
  shippingAddress: '',
});

const orderForm = form(orderModel, (schemaPath) => {
  hidden(schemaPath.shippingAddress, ({valueOf}) => !valueOf(schemaPath.requiresShipping));
});
```

Bu örnekte, `shippingAddress` gizli olduğunda form geçerliliğini etkilemez. Sonuç olarak, `shippingAddress` boş ve zorunlu olsa bile form geçerli olabilir.

Bu davranış, gizli, devre dışı veya salt okunur alanların form gönderimini engellemesini veya doğrulama, dokunulmuş ve kirli durumunu etkilemesini önler.

## Şablonlarda durumu kullanma

Alan durumu sinyalleri, Angular şablonlarıyla sorunsuz bir şekilde entegre olarak manuel olay işleme gerektirmeden reaktif form kullanıcı deneyimleri sağlar.

### Koşullu hata gösterimi

Hataları yalnızca kullanıcı alanla etkileşim kurduktan sonra gösterin:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, email} from '@angular/forms/signals';

@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: `
    <label>
      Email
      <input type="email" [formField]="signupForm.email" />
    </label>

    @if (signupForm.email().touched() && signupForm.email().invalid()) {
      <p class="error">{{ signupForm.email().errors()[0].message }}</p>
    }
  `,
})
export class Signup {
  signupModel = signal({email: '', password: ''});

  signupForm = form(this.signupModel, (schemaPath) => {
    email(schemaPath.email);
  });
}
```

Bu kalıp, kullanıcılar alanla etkileşim kurma fırsatı bulmadan hataların gösterilmesini önler. Hatalar yalnızca kullanıcı alana odaklanıp ardından alandan ayrıldıktan sonra görünür.

### Koşullu alan kullanılabilirliği

Alanları koşullu olarak göstermek veya gizlemek için `hidden()` sinyalini `@if` ile kullanın:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, hidden} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="orderForm.requiresShipping" />
      Requires shipping
    </label>

    @if (!orderForm.shippingAddress().hidden()) {
      <label>
        Shipping Address
        <input [formField]="orderForm.shippingAddress" />
      </label>
    }
  `,
})
export class Order {
  orderModel = signal({
    requiresShipping: false,
    shippingAddress: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    hidden(schemaPath.shippingAddress, ({valueOf}) => !valueOf(schemaPath.requiresShipping));
  });
}
```

Gizli alanlar doğrulamaya katılmaz, bu da gizli alan aksi takdirde geçersiz olsa bile formun gönderilmesine olanak tanır.

### Dizi alanları için değerleri izleme

Signal forms'da, bir alan kümesi üzerindeki `@for` bloğu alan kimliğine göre izlenmelidir.

```angular-ts
@Component({
  imports: [FormField],
  template: `
    @for (field of form.emails; track field) {
      <input [formField]="field" />
    }
  `,
})
export class App {
  formModel = signal({emails: ['john.doe@mail.com', 'max.musterman@mail.com']});
  form = form(this.formModel);
}
```

Form sistemi zaten dizi içindeki model değerlerini izlemekte ve oluşturduğu alanların kararlı kimliğini otomatik olarak sürdürmektedir.

Bir öğe değiştiğinde, bazı özellikleri aynı görünse bile yeni bir mantıksal varlığı temsil edebilir. Kimliğe göre izleme, çerçevenin mevcut arayüz öğelerini yeniden kullanmak yerine onu ayrı bir öğe olarak ele almasını sağlar. Bu, form girdileri gibi durumsal öğelerin yanlış paylaşılmasını önler ve bağlamaları modelin doğru kısmıyla hizalı tutar.

## Bileşen mantığında alan durumunu kullanma

Alan durumu sinyalleri, gelişmiş form mantığı için Angular'ın `computed()` ve `effect()` gibi reaktif temel yapılarıyla çalışır.

### Göndermeden önce doğrulama kontrolleri

Bileşen yöntemlerinde form geçerliliğini kontrol edin:

```ts
export class Registration {
  registrationModel = signal({
    username: '',
    email: '',
    password: '',
  });

  registrationForm = form(this.registrationModel);

  async onSubmit() {
    // Bekleyen asenkron doğrulamayı bekle
    if (this.registrationForm().pending()) {
      console.log('Doğrulama bekleniyor...');
      return;
    }

    // Geçersiz gönderimlere karşı koruma
    if (this.registrationForm().invalid()) {
      console.error('Form geçersiz');
      return;
    }

    const data = this.registrationModel();
    await this.api.register(data);
  }
}
```

Bu, yalnızca geçerli ve tamamen doğrulanmış verilerin API'nize ulaşmasını sağlar.

### computed ile türetilmiş durum

Alan durumu değiştiğinde otomatik olarak güncellenen, alan durumuna dayalı hesaplanmış sinyaller oluşturun:

```ts
export class Password {
  passwordModel = signal({password: '', confirmPassword: ''});
  passwordForm = form(this.passwordModel);

  // Şifre güçlülük göstergesini hesapla
  passwordStrength = computed(() => {
    const password = this.passwordForm.password().value();
    if (password.length < 8) return 'weak';
    if (password.length < 12) return 'medium';
    return 'strong';
  });

  // Tüm zorunlu alanların doldurulup doldurulmadığını kontrol et
  allFieldsFilled = computed(() => {
    return (
      this.passwordForm.password().value().length > 0 &&
      this.passwordForm.confirmPassword().value().length > 0
    );
  });
}
```

### Programatik durum değişiklikleri

Alan durumu genellikle kullanıcı etkileşimleri (yazma, odaklanma, odağı bırakma) aracılığıyla güncellenir, ancak bazen programatik olarak kontrol etmeniz gerekir. Yaygın senaryolar arasında form gönderimi ve formları sıfırlama yer alır.

#### Form gönderimi

Signal Forms, form gönderimini basitleştiren bir `FormRoot` direktifi sağlar. Varsayılan tarayıcı form gönderim davranışını otomatik olarak engeller ve `<form>` elemanına `novalidate` niteliğini ayarlar.

```angular-ts
@Component({
  imports: [FormRoot, FormField],
  template: `
    <form [formRoot]="registrationForm">
      <input [formField]="registrationForm.username" />
      <input type="email" [formField]="registrationForm.email" />
      <input type="password" [formField]="registrationForm.password" />

      <button type="submit">Register</button>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: '', email: '', password: ''});

  registrationForm = form(
    this.registrationModel,
    (schemaPath) => {
      required(schemaPath.username);
      email(schemaPath.email);
      required(schemaPath.password);
    },
    {
      submission: {
        action: async () => this.submitToServer(),
      },
    },
  );

  private submitToServer() {
    // Veriyi sunucuya gönder
  }
}
```

`FormRoot` kullandığınızda, formu göndermek otomatik olarak `submit()` fonksiyonunu çağırır; bu fonksiyon tüm alanları dokunulmuş olarak işaretler (doğrulama hatalarını ortaya çıkarır) ve form geçerliyse `action` geri çağırma fonksiyonunuzu çalıştırır.

Ayrıca direktif kullanmadan, `submit(this.registrationForm)` çağırarak bir formu manuel olarak da gönderebilirsiniz. `submit` fonksiyonunu bu şekilde açıkça çağırırken, formun varsayılan `submission` mantığını geçersiz kılmak için bir `FormSubmitOptions` iletebilirsiniz: `submit(this.registrationForm, {action: () => /* ... */ })`.

#### Gönderdikten sonra formları sıfırlama

Bir formu başarıyla gönderdikten sonra, onu başlangıç durumuna döndürmek isteyebilirsiniz - hem kullanıcı etkileşim geçmişini hem de alan değerlerini temizleyerek. `reset()` yöntemi dokunulmuş ve kirli bayraklarını temizler. Model verilerini güncellemek için `reset()` fonksiyonuna isteğe bağlı bir değer de iletebilirsiniz:

```ts
export class Contact {
  private readonly INITIAL_MODEL = {name: '', email: '', message: ''};
  contactModel = signal({...this.INITIAL_MODEL});
  contactForm = form(this.contactModel, {
    submission: {
      action: async (f) => {
        await this.api.sendMessage(this.contactModel());
        // Etkileşim durumunu (touched, dirty) temizle ve başlangıç değerlerine sıfırla
        f().reset({...this.INITIAL_MODEL});
      },
    },
  });
}
```

Bu, formun eski hata mesajları veya kirli durum göstergeleri göstermeden yeni girdi için hazır olmasını sağlar.

## Doğrulama durumuna göre stillendirme

Doğrulama durumuna dayalı olarak CSS sınıflarını bağlayarak formunuza özel stiller uygulayabilirsiniz:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, email} from '@angular/forms/signals';

@Component({
  template: `
    <input
      type="email"
      [formField]="form.email"
      [class.is-invalid]="form.email().touched() && form.email().invalid()"
      [class.is-valid]="form.email().touched() && form.email().valid()"
    />
  `,
  styles: `
    input.is-invalid {
      border: 2px solid red;
      background-color: white;
    }

    input.is-valid {
      border: 2px solid green;
    }
  `,
})
export class StyleExample {
  model = signal({email: ''});

  form = form(this.model, (schemaPath) => {
    email(schemaPath.email);
  });
}
```

Hem `touched()` hem de doğrulama durumunu kontrol etmek, stillerin yalnızca kullanıcı alanla etkileşim kurduktan sonra görünmesini sağlar.

## Sonraki adımlar

Bu kılavuz, doğrulama ve kullanılabilirlik durumu işleme, etkileşim takibi ve alan durumu yayılımını ele aldı. İlgili kılavuzlar Signal Forms'un diğer yönlerini inceler:

<!-- TODO: KILAVUZLAR MEVCUT OLDUĞUNDA YORUM İŞARETİNİ KALDIR -->
<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="Form models" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Custom controls" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
