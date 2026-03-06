# Özel Kontroller

NOTE: Bu kılavuz, [Signal Forms temelleri](essentials/signal-forms) konusuna aşinalık olduğunu varsayar.

Tarayıcının yerleşik form kontrolleri (input, select, textarea gibi) yaygın durumları karşılar, ancak uygulamalar genellikle özelleştirilmiş girdilere ihtiyaç duyar. Takvim arayüzüne sahip bir tarih seçici, biçimlendirme araç çubuğuna sahip bir zengin metin düzenleyici veya otomatik tamamlamalı bir etiket seçici, hepsi özel uygulamalar gerektirir.

Signal Forms, belirli arayüzleri uygulayan herhangi bir bileşenle çalışır. Bir **kontrol arayüzü**, bileşeninizin form sistemiyle iletişim kurmasını sağlayan özellikleri ve sinyalleri tanımlar. Bileşeniniz bu arayüzlerden birini uyguladığında, `[formField]` direktifi kontrolünüzü otomatik olarak form durumu, doğrulama ve veri bağlamaya bağlar.

## Temel bir özel kontrol oluşturma

Minimal bir uygulama ile başlayalım ve ihtiyaç duydukça özellikler ekleyelim.

### Minimal girdi kontrolü

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
  /** Geçerli girdi değeri */
  value = model('');
}
```

### Minimal onay kutusu kontrolü

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
  /** Geçiş düğmesinin işaretli olup olmadığı */
  checked = model<boolean>(false);

  toggle() {
    this.checked.update((val) => !val);
  }
}
```

### Özel kontrolünüzü kullanma

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

## Kontrol arayüzlerini anlama

Özel kontrolleri çalışırken gördüğünüze göre, şimdi Signal Forms ile nasıl entegre olduklarını inceleyelim.

### Kontrol arayüzleri

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

### İsteğe bağlı durum özellikleri

Hem `FormValueControl` hem de `FormCheckboxControl`, form durumuyla entegrasyon için isteğe bağlı özellikler sağlayan temel arayüz `FormUiControl`'ü genişletir.

Tüm özellikler isteğe bağlıdır. Yalnızca kontrolünüzün ihtiyaç duyduklarını uygulayın.

#### Etkileşim durumu

Kullanıcıların kontrolünüzle ne zaman etkileşim kurduğunu takip edin:

| Property  | Purpose                                           |
| --------- | ------------------------------------------------- |
| `touched` | Kullanıcının alanla etkileşim kurup kurmadığı     |
| `dirty`   | Değerin başlangıç durumundan farklı olup olmadığı |

#### Doğrulama durumu

Kullanıcılara doğrulama geri bildirimi gösterin:

| Property  | Purpose                                   |
| --------- | ----------------------------------------- |
| `errors`  | Mevcut doğrulama hatalarının dizisi       |
| `valid`   | Alanın geçerli olup olmadığı              |
| `invalid` | Alanın doğrulama hataları olup olmadığı   |
| `pending` | Asenkron doğrulamanın devam edip etmediği |

#### Kullanılabilirlik durumu

Kullanıcıların alanınızla etkileşim kurup kuramayacağını kontrol edin:

| Property          | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| `disabled`        | Alanın devre dışı olup olmadığı                             |
| `disabledReasons` | Alanın neden devre dışı olduğunun nedenleri                 |
| `readonly`        | Alanın salt okunur olup olmadığı (görünür ama düzenlenemez) |
| `hidden`          | Alanın görünümden gizli olup olmadığı                       |

NOTE: `disabledReasons`, `DisabledReason` nesnelerinden oluşan bir dizidir. Her nesnenin bir `field` özelliği (alan ağacına referans) ve isteğe bağlı bir `message` özelliği vardır. Mesaja `reason.message` üzerinden erişin.

#### Doğrulama kısıtlamaları

Formdan doğrulama kısıtlama değerlerini alın:

| Property    | Purpose                                              |
| ----------- | ---------------------------------------------------- |
| `required`  | Alanın zorunlu olup olmadığı                         |
| `min`       | Minimum sayısal değer (kısıtlama yoksa `undefined`)  |
| `max`       | Maksimum sayısal değer (kısıtlama yoksa `undefined`) |
| `minLength` | Minimum dize uzunluğu (kısıtlama yoksa undefined)    |
| `maxLength` | Maksimum dize uzunluğu (kısıtlama yoksa undefined)   |
| `pattern`   | Eşleştirilecek düzenli ifade kalıpları dizisi        |

#### Alan metadata'sı

| Property | Purpose                                                              |
| -------- | -------------------------------------------------------------------- |
| `name`   | Alanın name niteliği (formlar ve uygulamalar genelinde benzersizdir) |

Aşağıdaki "[Adding state signals](#durum-sinyalleri-ekleme)" bölümü, bu özelliklerin kontrollerinizde nasıl uygulanacağını gösterir.

### FormField direktifi nasıl çalışır

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

## Durum sinyalleri ekleme

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
  // Gerekli
  value = model<string>('');

  // Yazılabilir etkileşim durumu - kontrol bunları günceller
  touched = model<boolean>(false);

  // Salt okunur durum - form sistemi bunları yönetir
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

### Durum özellikleri için sinyal türleri

Çoğu durum özelliği `input()` (formdan salt okunur) kullanır. Kontrolünüz kullanıcı etkileşiminde güncellediğinde `touched` için `model()` kullanın. `touched` özelliği, ihtiyaçlarınıza bağlı olarak benzersiz bir şekilde `model()`, `input()` veya `OutputRef` desteği sunar.

## Değer dönüşümü

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
  // Sayısal değeri saklar (1234.56)
  readonly value = model.required<number>();

  // Görüntüleme değerini saklar ("1,234.56")
  readonly displayValue = linkedSignal(() => formatCurrency(this.value(), 'en', 'USD'));

  // Görüntüleme değerinden modeli güncelle.
  updateModel() {
    this.value.set(parseCurrency(this.displayValue()));
  }
}

// Bir para birimi dizesini sayıya dönüştürür (ör. "USD1,234.56" -> 1234.56).
function parseCurrency(value: string): number {
  return parseFloat(value.replace(/^[^\d-]+/, '').replace(/,/g, ''));
}
```

## Doğrulama entegrasyonu

Kontroller doğrulama durumunu görüntüler ancak doğrulama gerçekleştirmez. Doğrulama form şemasında gerçekleşir - kontrolünüz FormField direktifinden `invalid()` ve `errors()` sinyallerini alır ve bunları görüntüler (yukarıdaki StatefulInput örneğinde gösterildiği gibi).

FormField direktifi ayrıca `required`, `min`, `max`, `minLength`, `maxLength` ve `pattern` gibi doğrulama kısıtlama değerlerini de iletir. Kontrolünüz bunları arayüzü geliştirmek için kullanabilir:

```ts
export class NumberInput implements FormValueControl<number> {
  value = model<number>(0);

  // Şema doğrulama kurallarından kısıtlama değerleri
  required = input<boolean>(false);
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
}
```

Şemaya `min()` ve `max()` doğrulama kuralları eklediğinizde, FormField direktifi bu değerleri kontrolünüze iletir. Bunları HTML5 nitelikleri uygulamak veya şablonunuzda kısıtlama ipuçları göstermek için kullanın.

IMPORTANT: Kontrolünüzde doğrulama mantığı uygulamayın. Doğrulama kurallarını form şemasında tanımlayın ve kontrolünüzün sonuçları göstermesini sağlayın:

```ts {avoid}
// Kaçının: Kontrolde doğrulama
export class BadControl implements FormValueControl<string> {
  value = model<string>('');
  isValid() {
    return this.value().length >= 8;
  } // Bunu yapmayın!
}
```

```ts {prefer}
// İyi: Şemada doğrulama, kontrol sonuçları gösterir
accountForm = form(this.accountModel, (schemaPath) => {
  minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});
});
```

## Sonraki adımlar

Bu kılavuz, Signal Forms ile entegre olan özel kontroller oluşturmayı ele aldı. İlgili kılavuzlar Signal Forms'un diğer yönlerini inceler:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="Form models" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Field state management" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
