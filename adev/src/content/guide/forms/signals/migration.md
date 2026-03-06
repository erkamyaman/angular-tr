# Mevcut form'ları Signal Form'lara taşıma

Bu kılavuz, mevcut kod tabanlarını Signal Forms'a taşımak için stratejiler sunar ve mevcut Reactive Forms ile birlikte çalışabilirliğe odaklanır.

## `compatForm` kullanarak yukarıdan aşağıya taşıma

Bazen mevcut reaktif `FormControl` örneklerini bir Signal Form içinde kullanmak isteyebilirsiniz. Bu, aşağıdakileri içeren kontroller için kullanışlıdır:

- Karmaşık asenkron mantık.
- Henüz taşınmamış karmaşık RxJS operatörleri.
- Mevcut üçüncü taraf kütüphanelerle entegrasyon.

### Bir `FormControl`'ü signal form'a entegre etme

Özelleştirilmiş bir `enterprisePasswordValidator` kullanan mevcut bir `passwordControl` düşünün. Doğrulayıcıyı yeniden yazmak yerine, kontrolü sinyal durumunuza köprüleyebilirsiniz.

Bunu `compatForm` kullanarak yapabiliriz:

```typescript
import {signal} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {compatForm} from '@angular/forms/signals/compat';

// 1. Özel bir doğrulayıcı ile mevcut kontrol
const passwordControl = new FormControl('', {
  validators: [Validators.required, enterprisePasswordValidator()],
  nonNullable: true,
});

// 2. Form durum sinyalinizin içine sarın
const user = signal({
  email: '',
  password: passwordControl, // Mevcut kontrolü doğrudan iç içe yerleştirin
});

// 3. Formu oluşturun
const f = compatForm(user);

// Sinyal ağacı üzerinden değerlere erişin
console.log(f.email().value()); // Mevcut e-posta değeri
console.log(f.password().value()); // passwordControl'ün mevcut değeri

// Reaktif durum otomatik olarak proxy yapılır
const isPasswordValid = f.password().valid();
const passwordErrors = f.password().errors(); // Mevcut doğrulayıcı başarısız olursa CompatValidationError döndürür
```

Şablonda, temel kontrolü bağlayarak standart reaktif sözdizimini kullanın:

```angular-html
<form novalidate>
  <div>
    <label>
      Email:
      <input [formField]="f.email" />
    </label>
  </div>

  <div>
    <label>
      Password:
      <input [formField]="f.password" type="password" />
    </label>

    @if (f.password().touched() && f.password().invalid()) {
      <div class="error-list">
        @for (error of f.password().errors(); track error) {
          <p>{{ error.message || error.kind }}</p>
        }
      </div>
    }
  </div>
</form>
```

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/compat-form-control-integration/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/compat-form-control-integration/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/compat-form-control-integration/app/app.html"/>
</docs-code-multifile>

### Bir `FormGroup`'u signal form'a entegre etme

Ayrıca bir `FormGroup`'un tamamını da sarmalayabilirsiniz. Bu, formun yeniden kullanılabilir bir alt bölümünün - örneğin bir **Adres Bloğu** - hâlâ mevcut Reactive Forms tarafından yönetildiği durumlarda yaygındır.

```typescript
import {signal} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {compatForm} from '@angular/forms/signals/compat';

// 1. Kendi doğrulama mantığına sahip mevcut bir adres grubu
const addressGroup = new FormGroup({
  street: new FormControl('123 Angular Way', Validators.required),
  city: new FormControl('Mountain View', Validators.required),
  zip: new FormControl('94043', Validators.required),
});

// 2. Bir değermiş gibi duruma dahil edin
const checkoutModel = signal({
  customerName: 'Pirojok the Cat',
  shippingAddress: addressGroup,
});

const f = compatForm(checkoutModel, (p) => {
  required(p.customerName);
});
```

`shippingAddress` alanı, Signal Form ağacınızda bir dal olarak işlev görür. Bu iç içe geçmiş kontrolleri, temel mevcut kontrollere `.control()` üzerinden erişerek şablonunuzda bağlayabilirsiniz:

```angular-html
<form novalidate>
  <h3>Shipping Details</h3>

  <div>
    <label>
      Customer Name:
      <input [formField]="f.customerName" />
    </label>

    @if (f.customerName().touched() && f.customerName().invalid()) {
      <div class="error-list">
        <p>Customer name is required.</p>
      </div>
    }
  </div>

  <fieldset>
    <legend>Address</legend>

    @let street = f.shippingAddress().control().controls.street;
    <div>
      <label>
        Street:
        <input [formControl]="street" />
      </label>
      @if (street.touched && street.invalid) {
        <div class="error-list">
          <p>Street is required</p>
        </div>
      }
    </div>

    @let city = f.shippingAddress().control().controls.city;
    <div>
      <label>
        City:
        <input [formControl]="city" />
      </label>
      @if (city.touched && city.invalid) {
        <div class="error-list">
          <p>City is required</p>
        </div>
      }
    </div>

    @let zip = f.shippingAddress().control().controls.zip;
    <div>
      <label>
        Zip Code:
        <input [formControl]="zip" />
      </label>
      @if (zip.touched && zip.invalid) {
        <div class="error-list">
          <p>Zip Code is required</p>
        </div>
      }
    </div>
  </fieldset>
</form>
```

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/compat-form-group-integration/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/compat-form-group-integration/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/compat-form-group-integration/app/app.html"/>
</docs-code-multifile>

### Değerlere erişim

`compatForm` değer erişimini `FormControl` düzeyinde proxy yaparken, tam form değeri kontrolü korur:

```typescript
const passwordControl = new FormControl('password' /** ... */);

const user = signal({
  email: '',
  password: passwordControl, // Mevcut kontrolü doğrudan iç içe yerleştirin
});

const form = compatForm(user);
form.password().value(); // 'password'
form().value(); // { email: '', password: FormControl}
```

Tüm form değerine ihtiyacınız varsa, bunu manuel olarak oluşturmanız gerekir:

```typescript
const formValue = computed(() => ({
  email: form.email().value(),
  password: form.password().value(),
})); // {email: '', password: ''}
```

## Aşağıdan yukarıya taşıma

### Signal Form'u bir `FormGroup`'a entegre etme

Sinyal tabanlı bir formu standart bir `FormControl` olarak dışa aktarmak için `SignalFormControl` kullanabilirsiniz. Bu, üst `FormGroup` yapısını korurken formun yaprak düğümlerini Sinyallere taşımak istediğinizde kullanışlıdır.

```typescript
import {Component, signal} from '@angular/core';
import {ReactiveFormsModule, FormGroup} from '@angular/forms';
import {SignalFormControl} from '@angular/forms/signals/compat';
import {required} from '@angular/forms/signals';

@Component({
  // ...
  imports: [ReactiveFormsModule],
})
export class UserProfile {
  // 1. SignalFormControl oluşturun, signal form kurallarını kullanın.
  emailControl = new SignalFormControl('', (p) => {
    required(p, {message: 'Email is required'});
  });

  // 2. Mevcut bir FormGroup'ta kullanın
  form = new FormGroup({
    email: this.emailControl,
  });
}
```

`SignalFormControl`, değerleri ve doğrulama durumunu çift yönlü olarak senkronize eder:

- **Signal -> Control**: `email.set(...)` değişikliği `emailControl.value` ve üst `form.value` değerini günceller.
- **Control -> Signal**: Girdiye yazma (`emailControl`'ü güncelleme) `email` sinyalini günceller.
- **Validation**: Şema doğrulayıcıları (`required` gibi) hataları `emailControl.errors`'a yayar.

### Disabling/Enabling control.

Etkin/devre dışı durumunu değiştirmek için zorunlu API'ler (`enable()`, `disable()` gibi) `SignalFormControl`'de kasıtlı olarak desteklenmez. Bunun nedeni, kontrolün durumunun sinyal durumundan ve kurallardan türetilmesi gerektiğidir.

disable/enable çağırmaya çalışmak bir hata fırlatır.

```typescript {avoid}
import {signal, effect} from '@angular/core';

export class UserProfile {
  readonly emailControl = new SignalFormControl('');

  readonly isLoading = signal(false);

  constructor() {
    // This will throw an error
    effect(() => {
      if (this.isLoading()) {
        this.emailControl.disable();
      } else {
        this.emailControl.enable();
      }
    });
  }
}
```

Bunun yerine, disabled kuralını kullanın:

```typescript {prefer}
import {signal} from '@angular/core';
import {SignalFormControl} from '@angular/forms/signals/compat';
import {disabled} from '@angular/forms/signals';

export class UserProfile {
  readonly isLoading = signal(false);

  readonly emailControl = new SignalFormControl('', (p) => {
    // The control becomes disabled whenever isLoading is true
    disabled(p, () => this.isLoading());
  });

  async saveData() {
    this.isLoading.set(true);
    // ... perform save ...
    this.isLoading.set(false);
  }
}
```

### Dynamic manipulation

Doğrulayıcı eklemek veya kaldırmak için zorunlu API'ler (`addValidators()`, `removeValidators()`, `setValidators()` gibi) `SignalFormControl`'de kasıtlı olarak desteklenmez.

Bu yöntemleri çağırmaya çalışmak bir hata fırlatır.

```typescript {avoid}
export class UserProfile {
  readonly emailControl = new SignalFormControl('');
  readonly isRequired = signal(false);

  toggleRequired() {
    this.isRequired.update((v) => !v);
    // This will throw an error
    if (this.isRequired()) {
      this.emailControl.addValidators(Validators.required);
    } else {
      this.emailControl.removeValidators(Validators.required);
    }
  }
}
```

Bunun yerine, doğrulayıcıları koşullu olarak uygulamak için `applyWhen` kuralını kullanın:

```typescript {prefer}
import {signal} from '@angular/core';
import {SignalFormControl} from '@angular/forms/signals/compat';
import {applyWhen, required} from '@angular/forms/signals';

export class UserProfile {
  readonly isRequired = signal(false);

  readonly emailControl = new SignalFormControl('', (p) => {
    // The control becomes required whenever isRequired is true
    applyWhen(
      p,
      () => this.isRequired(),
      (p) => {
        required(p);
      },
    );
  });
}
```

### Manual Error Selection

`setErrors()` ve `markAsPending()` yöntemleri desteklenmez. Signal Forms'ta hatalar doğrulama kurallarından ve asenkron doğrulama durumundan türetilir. Bir hata bildirmeniz gerekiyorsa, bu şemadaki bir doğrulama kuralı aracılığıyla bildirimsel olarak yapılmalıdır.

## Automatic status classes

Reactive/Template Forms, kontrol durumlarının stillendirilmesini kolaylaştırmak için otomatik olarak [class nitelikleri](/guide/forms/template-driven-forms#kontrol-durumlarını-takip-etme) ekler (`.ng-valid` veya `.ng-dirty` gibi). Signal Forms bunu yapmaz.

Bu davranışı korumak istiyorsanız, `NG_STATUS_CLASSES` ön ayarını sağlayabilirsiniz:

```typescript
import {provideSignalFormsConfig} from '@angular/forms/signals';
import {NG_STATUS_CLASSES} from '@angular/forms/signals/compat';

bootstrapApplication(App, {
  providers: [
    provideSignalFormsConfig({
      classes: NG_STATUS_CLASSES,
    }),
  ],
});
```

Ayrıca kendi özel mantığınıza dayalı olarak istediğiniz sınıfları uygulamak için kendi özel yapılandırmanızı da sağlayabilirsiniz:

```typescript
import {provideSignalFormsConfig} from '@angular/forms/signals';

bootstrapApplication(App, {
  providers: [
    provideSignalFormsConfig({
      classes: {
        'ng-valid': ({state}) => state().valid(),
        'ng-invalid': ({state}) => state().invalid(),
        'ng-touched': ({state}) => state().touched(),
        'ng-dirty': ({state}) => state().dirty(),
      },
    }),
  ],
});
```

<!-- TODO: include some high level usage comment about how people should mostly interact with this via the signal forms API exposed on .fieldTree, not via the reactive forms methods. -->
<!-- TODO: Elaborate on why the value taken is not a signal. -->
