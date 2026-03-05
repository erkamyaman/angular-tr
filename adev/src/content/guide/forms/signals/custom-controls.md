# Custom Controls

NOTE: Bu kılavuz, [Signal Forms temelleri](essentials/signal-forms) konusuna aşinalık olduğunu varsayar.

Tarayıcının yerleşik form kontrolleri (input, select, textarea gibi) yaygın durumları karşılar, ancak uygulamalar genellikle özelleştirilmiş girdilere ihtiyaç duyar. Takvim arayüzüne sahip bir tarih seçici, biçimlendirme araç çubuğuna sahip bir zengin metin düzenleyici veya otomatik tamamlamalı bir etiket seçici, hepsi özel uygulamalar gerektirir.

Signal Forms, belirli arayüzleri uygulayan herhangi bir bileşenle çalışır. Bir **kontrol arayüzü**, bileşeninizin form sistemiyle iletişim kurmasını sağlayan özellikleri ve sinyalleri tanımlar. Bileşeniniz bu arayüzlerden birini uyguladığında, `[formField]` direktifi kontrolünüzü otomatik olarak form durumu, doğrulama ve veri bağlamaya bağlar.

## Creating a basic custom control

Minimal bir uygulama ile başlayalım ve ihtiyaç duydukça özellikler ekleyelim.

### Minimal input control

Temel bir özel girdi yalnızca `FormValueControl` arayüzünü uygulamak ve gerekli `value` model sinyalini tanımlamak zorundadır.

```angular-ts
import {Component, model} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-basic-input',
  template: `
    <div class="basic-input">
      <input
        type="text"
        [value]="value()"
        (input)="value.set($event.target.value)"
        placeholder="Enter text..."
      />
    </div>
  `,
})
export class BasicInput implements FormValueControl<string> {
  /** The current input value */
  value = model('');
}
```

### Minimal checkbox control

Bir onay kutusu tarzı kontrol iki şeye ihtiyaç duyar:

1. `FormField` direktifinin onu bir form kontrolü olarak tanıması için `FormCheckboxControl` arayüzünü uygulaması
2. Bir `checked` model sinyali sağlaması

```angular-ts
import {Component, model, ChangeDetectionStrategy} from '@angular/core';
import {FormCheckboxControl} from '@angular/forms/signals';

@Component({
  selector: 'app-basic-toggle',
  template: `
    <button type="button" [class.active]="checked()" (click)="toggle()">
      <span class="toggle-slider"></span>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicToggle implements FormCheckboxControl {
  /** Whether the toggle is checked */
  checked = model<boolean>(false);

  toggle() {
    this.checked.update((val) => !val);
  }
}
```

### Using your custom control

Bir kontrol oluşturduktan sonra, `FormField` direktifini ekleyerek yerleşik bir girdi kullanacağınız her yerde kullanabilirsiniz:

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';
import {BasicInput} from './basic-input';
import {BasicToggle} from './basic-toggle';

@Component({
  imports: [FormField, BasicInput, BasicToggle],
  template: `
    <form novalidate>
      <label>
        Email
        <app-basic-input [formField]="registrationForm.email" />
      </label>

      <label>
        Accept terms
        <app-basic-toggle [formField]="registrationForm.acceptTerms" />
      </label>

      <button type="submit" [disabled]="registrationForm().invalid()">Register</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registration {
  registrationModel = signal({
    email: '',
    acceptTerms: false,
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    required(schemaPath.acceptTerms, {message: 'You must accept the terms'});
  });
}
```

NOTE: Şema geri çağırma parametresi (bu örneklerde `schemaPath`), formunuzdaki tüm alanlara yollar sağlayan bir `SchemaPathTree` nesnesidir. Bu parametreyi istediğiniz gibi adlandırabilirsiniz.

`[formField]` direktifi, özel kontroller ve yerleşik girdiler için aynı şekilde çalışır. Signal Forms bunlara aynı şekilde davranır - doğrulama çalışır, durum güncellenir ve veri bağlama otomatik olarak gerçekleşir.

## Understanding control interfaces

Özel kontrolleri çalışırken gördüğünüze göre, şimdi Signal Forms ile nasıl entegre olduklarını inceleyelim.

### Control interfaces

Oluşturduğunuz `BasicInput` ve `BasicToggle` bileşenleri, Signal Forms'a onlarla nasıl etkileşim kuracağını söyleyen belirli kontrol arayüzlerini uygular.

#### FormValueControl

`FormValueControl`, çoğu girdi türü için arayüzdür - metin girdileri, sayı girdileri, tarih seçiciler, seçim açılır menüleri ve tek bir değeri düzenleyen herhangi bir kontrol. Bileşeniniz bu arayüzü uyguladığında:

- **Gerekli özellik**: Bileşeniniz bir `value` model sinyali sağlamalıdır
- **FormField direktifinin yaptığı**: Form alanının değerini kontrolünüzün `value` sinyaline bağlar

IMPORTANT: `FormValueControl` uygulayan kontrollerde `checked` özelliği bulunmamalıdır

#### FormCheckboxControl

`FormCheckboxControl`, onay kutusu benzeri kontroller için arayüzdür - geçiş düğmeleri, anahtarlar ve boolean açık/kapalı durumunu temsil eden herhangi bir kontrol. Bileşeniniz bu arayüzü uyguladığında:

- **Gerekli özellik**: Bileşeniniz bir `checked` model sinyali sağlamalıdır
- **FormField direktifinin yaptığı**: Form alanının değerini kontrolünüzün `checked` sinyaline bağlar

IMPORTANT: `FormCheckboxControl` uygulayan kontrollerde `value` özelliği bulunmamalıdır

### Optional state properties

Hem `FormValueControl` hem de `FormCheckboxControl`, form durumuyla entegrasyon için isteğe bağlı özellikler sağlayan temel arayüz `FormUiControl`'ü genişletir.

Tüm özellikler isteğe bağlıdır. Yalnızca kontrolünüzün ihtiyaç duyduklarını uygulayın.

#### Interaction state

Kullanıcıların kontrolünüzle ne zaman etkileşim kurduğunu takip edin:

| Property  | Purpose                                           |
| --------- | ------------------------------------------------- |
| `touched` | Kullanıcının alanla etkileşim kurup kurmadığı     |
| `dirty`   | Değerin başlangıç durumundan farklı olup olmadığı |

#### Validation state

Kullanıcılara doğrulama geri bildirimi gösterin:

| Property  | Purpose                                   |
| --------- | ----------------------------------------- |
| `errors`  | Mevcut doğrulama hatalarının dizisi       |
| `valid`   | Alanın geçerli olup olmadığı              |
| `invalid` | Alanın doğrulama hataları olup olmadığı   |
| `pending` | Asenkron doğrulamanın devam edip etmediği |

#### Availability state

Kullanıcıların alanınızla etkileşim kurup kuramayacağını kontrol edin:

| Property          | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| `disabled`        | Alanın devre dışı olup olmadığı                             |
| `disabledReasons` | Alanın neden devre dışı olduğunun nedenleri                 |
| `readonly`        | Alanın salt okunur olup olmadığı (görünür ama düzenlenemez) |
| `hidden`          | Alanın görünümden gizli olup olmadığı                       |

NOTE: `disabledReasons`, `DisabledReason` nesnelerinden oluşan bir dizidir. Her nesnenin bir `field` özelliği (alan ağacına referans) ve isteğe bağlı bir `message` özelliği vardır. Mesaja `reason.message` üzerinden erişin.

#### Validation constraints

Formdan doğrulama kısıtlama değerlerini alın:

| Property    | Purpose                                              |
| ----------- | ---------------------------------------------------- |
| `required`  | Alanın zorunlu olup olmadığı                         |
| `min`       | Minimum sayısal değer (kısıtlama yoksa `undefined`)  |
| `max`       | Maksimum sayısal değer (kısıtlama yoksa `undefined`) |
| `minLength` | Minimum dize uzunluğu (kısıtlama yoksa undefined)    |
| `maxLength` | Maksimum dize uzunluğu (kısıtlama yoksa undefined)   |
| `pattern`   | Eşleştirilecek düzenli ifade kalıpları dizisi        |

#### Field metadata

| Property | Purpose                                                              |
| -------- | -------------------------------------------------------------------- |
| `name`   | Alanın name niteliği (formlar ve uygulamalar genelinde benzersizdir) |

Aşağıdaki "[Adding state signals](#adding-state-signals)" bölümü, bu özelliklerin kontrollerinizde nasıl uygulanacağını gösterir.

### How the FormField directive works

`[formField]` direktifi, kontrolünüzün hangi arayüzü uyguladığını algılar ve uygun sinyalleri otomatik olarak bağlar:

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';
import {CustomInput} from './custom-input';
import {CustomToggle} from './custom-toggle';

@Component({
  selector: 'app-my-form',
  imports: [FormField, CustomInput, CustomToggle],
  template: `
    <form novalidate>
      <app-custom-input [formField]="userForm.username" />
      <app-custom-toggle [formField]="userForm.subscribe" />
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyForm {
  formModel = signal({
    username: '',
    subscribe: false,
  });

  userForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});
  });
}
```

TIP: Form modellerini oluşturma ve yönetme konusunda kapsamlı bilgi için [Form Models kılavuzuna](guide/forms/signals/models) bakın.

`[formField]="userForm.username"` bağladığınızda, FormField direktifi:

1. Kontrolünüzün `FormValueControl` uyguladığını algılar
2. Dahili olarak `userForm.username().value()` değerine erişir ve bunu kontrolünüzün `value` model sinyaline bağlar
3. Form durum sinyallerini (`disabled()`, `errors()`, vb.) kontrolünüzün isteğe bağlı girdi sinyallerine bağlar
4. Güncellemeler sinyal reaktivitesi aracılığıyla otomatik olarak gerçekleşir

## Adding state signals

Yukarıda gösterilen minimal kontroller çalışır, ancak form durumuna tepki vermezler. Kontrollerinizin devre dışı durumuna tepki vermesi, doğrulama hatalarını göstermesi ve kullanıcı etkileşimini izlemesi için isteğe bağlı girdi sinyalleri ekleyebilirsiniz.

İşte yaygın durum özelliklerini uygulayan kapsamlı bir örnek:

```angular-ts
import {Component, model, input, ChangeDetectionStrategy} from '@angular/core';
import {
  FormValueControl,
  WithOptionalFieldTree,
  ValidationError,
  DisabledReason,
} from '@angular/forms/signals';

@Component({
  selector: 'app-stateful-input',
  template: `
    @if (!hidden()) {
      <div class="input-container">
        <input
          type="text"
          [value]="value()"
          (input)="value.set($event.target.value)"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [class.invalid]="invalid()"
          [attr.aria-invalid]="invalid()"
          (blur)="touched.set(true)"
        />

        @if (invalid()) {
          <div class="error-messages" role="alert">
            @for (error of errors(); track error) {
              <span class="error">{{ error.message }}</span>
            }
          </div>
        }

        @if (disabled() && disabledReasons().length > 0) {
          <div class="disabled-reasons">
            @for (reason of disabledReasons(); track reason) {
              <span>{{ reason.message }}</span>
            }
          </div>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatefulInput implements FormValueControl<string> {
  // Required
  value = model<string>('');

  // Writable interaction state - control updates these
  touched = model<boolean>(false);

  // Read-only state - form system manages these
  disabled = input<boolean>(false);
  disabledReasons = input<readonly DisabledReason[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
}
```

Sonuç olarak, kontrolü doğrulama ve durum yönetimi ile kullanabilirsiniz:

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required, email} from '@angular/forms/signals';
import {StatefulInput} from './stateful-input';

@Component({
  imports: [FormField, StatefulInput],
  template: `
    <form novalidate>
      <label>
        Email
        <app-stateful-input [formField]="loginForm.email" />
      </label>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  loginModel = signal({email: ''});

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    email(schemaPath.email, {message: 'Enter a valid email address'});
  });
}
```

Kullanıcı geçersiz bir e-posta yazdığında, FormField direktifi `invalid()` ve `errors()` değerlerini otomatik olarak günceller. Kontrolünüz doğrulama geri bildirimini gösterebilir.

### Signal types for state properties

Çoğu durum özelliği `input()` (formdan salt okunur) kullanır. Kontrolünüz kullanıcı etkileşiminde güncellediğinde `touched` için `model()` kullanın. `touched` özelliği, ihtiyaçlarınıza bağlı olarak benzersiz bir şekilde `model()`, `input()` veya `OutputRef` desteği sunar.

## Value transformation

Kontroller bazen değerleri form modelinin sakladığından farklı şekilde görüntüler - bir tarih seçici "2024-01-15" saklarken "15 Ocak 2024" gösterebilir veya bir para birimi girdisi 1234.56 saklarken "$1,234.56" gösterebilir.

Model değerini görüntüleme için dönüştürmek üzere `linkedSignal()` (`@angular/core`'dan) kullanın ve kullanıcı girdisini depolama biçimine geri ayrıştırmak için girdi olaylarını işleyin:

```angular-ts
import {formatCurrency} from '@angular/common';
import {ChangeDetectionStrategy, Component, linkedSignal, model} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-currency-input',
  template: `
    <input
      type="text"
      [value]="displayValue()"
      (input)="displayValue.set($event.target.value)"
      (blur)="updateModel()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyInput implements FormValueControl<number> {
  // Stores numeric value (1234.56)
  readonly value = model.required<number>();

  // Stores display value ("1,234.56")
  readonly displayValue = linkedSignal(() => formatCurrency(this.value(), 'en', 'USD'));

  // Update the model from the display value.
  updateModel() {
    this.value.set(parseCurrency(this.displayValue()));
  }
}

// Converts a currency string to a number (e.g. "USD1,234.56" -> 1234.56).
function parseCurrency(value: string): number {
  return parseFloat(value.replace(/^[^\d-]+/, '').replace(/,/g, ''));
}
```

## Validation integration

Kontroller doğrulama durumunu görüntüler ancak doğrulama gerçekleştirmez. Doğrulama form şemasında gerçekleşir - kontrolünüz FormField direktifinden `invalid()` ve `errors()` sinyallerini alır ve bunları görüntüler (yukarıdaki StatefulInput örneğinde gösterildiği gibi).

FormField direktifi ayrıca `required`, `min`, `max`, `minLength`, `maxLength` ve `pattern` gibi doğrulama kısıtlama değerlerini de iletir. Kontrolünüz bunları arayüzü geliştirmek için kullanabilir:

```ts
export class NumberInput implements FormValueControl<number> {
  value = model<number>(0);

  // Constraint values from schema validation rules
  required = input<boolean>(false);
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
}
```

Şemaya `min()` ve `max()` doğrulama kuralları eklediğinizde, FormField direktifi bu değerleri kontrolünüze iletir. Bunları HTML5 nitelikleri uygulamak veya şablonunuzda kısıtlama ipuçları göstermek için kullanın.

IMPORTANT: Kontrolünüzde doğrulama mantığı uygulamayın. Doğrulama kurallarını form şemasında tanımlayın ve kontrolünüzün sonuçları göstermesini sağlayın:

```ts {avoid}
// Avoid: Validation in control
export class BadControl implements FormValueControl<string> {
  value = model<string>('');
  isValid() {
    return this.value().length >= 8;
  } // Don't do this!
}
```

```ts {prefer}
// Good: Validation in schema, control displays results
accountForm = form(this.accountModel, (schemaPath) => {
  minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});
});
```

## Next steps

Bu kılavuz, Signal Forms ile entegre olan özel kontroller oluşturmayı ele aldı. İlgili kılavuzlar Signal Forms'un diğer yönlerini inceler:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="Form models" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Field state management" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
