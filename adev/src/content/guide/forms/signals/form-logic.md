# Adding form logic

Signal Forms, şemalar kullanarak formunuza mantık eklemenize olanak tanır. Doğrulama mantığı [Doğrulama kılavuzunda](guide/forms/signals/validation) ele alınmaktadır ve bu kılavuz şemalarda mevcut olan diğer kuralları tartışır. Alanları koşullu olarak devre dışı bırakabilir, diğer değerlere göre gizleyebilir, salt okunur yapabilir, kullanıcı girdisini geciktirebilir ve özel kontroller için meta veri ekleyebilirsiniz.

Bu kılavuz, alan davranışını kontrol etmek için `disabled()`, `hidden()`, `readonly()`, `debounce()` ve `metadata()` gibi kuralların nasıl kullanılacağını gösterir.

## When to add form logic

Alan davranışı diğer alan değerlerine bağlı olduğunda veya reaktif olarak güncellenmesi gerektiğinde kuralları kullanın. Örneğin:

- Sipariş toplamı çok düşük olduğunda devre dışı bırakılan bir kupon kodu alanı
- Kargo gerekmedikçe gizlenen bir adres alanı
- API çağrılarını azaltmak için geciktirilen bir arama alanı

## How rules work

Kurallar, formunuzdaki belirli alanlara reaktif mantık bağlar. Çoğu kural, isteğe bağlı bir argüman olarak reaktif mantık fonksiyonu kabul eder. Reaktif mantık fonksiyonu, referans verdiği sinyaller değiştiğinde otomatik olarak yeniden hesaplanır, tıpkı bir `computed` gibi.

```ts
const orderForm = form(this.orderModel, (schemaPath) => {
  disabled(schemaPath.couponCode, ({valueOf}) => valueOf(schemaPath.total) < 50);
  //~~~~~~ ~~~~~~~~~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //kural    yol                   reaktif mantık fonksiyonu
});
```

Reaktif mantık fonksiyonları, `valueOf()` ve `stateOf()` gibi yardımcı fonksiyonlar aracılığıyla alan değerlerine ve durumuna erişim sağlayan bir `FieldContext` nesnesi alır. Bu yardımcılara doğrudan erişmek için genellikle parçalama yapılır.

NOTE: Şema geri çağırma parametresi (bu örneklerde `schemaPath`) formunuzdaki tüm alanlara yollar sağlayan bir `SchemaPathTree` nesnesidir. Bu parametreyi istediğiniz gibi adlandırabilirsiniz.

`FieldContext` özellikleri ve yöntemleri hakkında tam ayrıntılar için [Doğrulama kılavuzuna](guide/forms/signals/validation) bakın.

## Prevent field updates with `disabled()`

`disabled()` kuralı bir alanın devre dışı durumunu yapılandırır.

Alanın durumuna göre `disabled` niteliğini otomatik olarak bağlamak için `[formField]` direktifiyle çalışır, bu nedenle şablonunuza manuel olarak `[disabled]="yourForm.fieldName().disabled()"` eklemenize gerek yoktur.

NOTE: Devre dışı alanlar doğrulamayı atlar -- form doğrulama kontrollerine katılmazlar. Alanın değeri korunur ancak doğrulanmaz. Doğrulama davranışı hakkında ayrıntılar için [Doğrulama kılavuzuna](guide/forms/signals/validation) bakın.

### Always disabled

Bir alanı kalıcı olarak devre dışı bırakmak için `disabled()`'ı yalnızca alan yoluyla çağırın:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-settings',
  imports: [FormField],
  template: `
    <label>
      System ID (cannot be changed)
      <input [formField]="settingsForm.systemId" />
    </label>
  `,
})
export class Settings {
  settingsModel = signal({
    systemId: 'SYS-12345',
    userName: '',
  });

  settingsForm = form(this.settingsModel, (schemaPath) => {
    disabled(schemaPath.systemId);
  });
}
```

### Conditional disabling

Koşullara göre bir alanı devre dışı bırakmak için, `true` (devre dışı) veya `false` (etkin) döndüren bir reaktif mantık fonksiyonu sağlayın:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <label>
      Order Total
      <input type="number" [formField]="orderForm.total" />
    </label>

    <label>
      Coupon Code
      <input [formField]="orderForm.couponCode" />
    </label>
  `,
})
export class Order {
  orderModel = signal({
    total: 25,
    couponCode: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    disabled(schemaPath.couponCode, ({valueOf}) => valueOf(schemaPath.total) < 50);
  });
}
```

Bu örnekte, sipariş toplamı 50$'dan az olduğunda kupon kodu alanı devre dışı bırakılır.

### Disabled reasons

Bir alanı devre dışı bıraktığınızda, `true` yerine bir dize döndürerek kullanıcıya yönelik açıklamalar sağlayın:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <label>
      Order Total
      <input type="number" [formField]="orderForm.total" />
    </label>

    <label>
      Coupon Code
      <input [formField]="orderForm.couponCode" />
    </label>

    @if (orderForm.couponCode().disabled()) {
      <div class="info">
        @for (reason of orderForm.couponCode().disabledReasons(); track reason) {
          <p>{{ reason.message }}</p>
        }
      </div>
    }
  `,
})
export class Order {
  orderModel = signal({
    total: 25,
    couponCode: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    disabled(schemaPath.couponCode, ({valueOf}) =>
      valueOf(schemaPath.total) < 50 ? 'Order must be $50 or more to use a coupon' : false,
    );
  });
}
```

Reaktif mantık fonksiyonu şunları döndürür:

- Alanı bir nedenle devre dışı bırakmak için bir **dize**
- Alanı etkinleştirmek için `false` (herhangi bir falsy değer değil - açıkça `false` kullanın)

Nedenlere alan durumundaki `disabledReasons()` sinyali aracılığıyla erişin. Her nedenin döndürdüğünüz dizeyi içeren bir `message` özelliği vardır.

#### Multiple disabled reasons

Aynı alanda `disabled()`'ı birden fazla kez de çağırabilirsiniz ve döndürülen tüm nedenler birikir:

```angular-ts
orderForm = form(this.orderModel, (schemaPath) => {
  disabled(schemaPath.promoCode, ({valueOf}) =>
    !valueOf(schemaPath.hasAccount) ? 'You must have an account to use promo codes' : false,
  );
  disabled(schemaPath.promoCode, ({valueOf}) =>
    valueOf(schemaPath.total) < 25 ? 'Order must be at least $25' : false,
  );
});
```

Her iki koşul da doğruysa, alan her iki devre dışı nedenini gösterir. Bu kalıp, ayrı tutmak istediğiniz karmaşık kullanılabilirlik kuralları için yararlıdır.

## Configuring `hidden()` state on fields

`hidden()` kuralı bir alanın gizli durumunu yapılandırır. Ancak bu yalnızca programatik bir durum ayarlar. **Alanın kullanıcı arayüzünde görünüp görünmeyeceğini siz kontrol edersiniz**.

IMPORTANT: `disabled` ve `readonly`'den farklı olarak, `hidden` durumu için yerel bir DOM özelliği yoktur. `[formField]` direktifi öğelere `hidden` niteliği uygulamaz. `hidden()` durumuna göre alanları koşullu olarak oluşturmak için şablonunuzda `@if` veya CSS kullanmalısınız.

NOTE: Devre dışı alanlar gibi, gizli alanlar da doğrulamayı atlar. Ayrıntılar için [Doğrulama kılavuzuna](guide/forms/signals/validation) bakın.

### Basic field hiding

`true` (gizli) veya `false` (görünür) döndüren bir reaktif mantık fonksiyonuyla `hidden()` kullanın:

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

## Display uneditable fields with `readonly()`

`readonly()` kuralı kullanıcıların bir alanı güncellemesini engeller. `[FormField]` direktifi, bu durumu HTML `readonly` niteliğine otomatik olarak bağlar ve bu, düzenlemeyi engellerken kullanıcıların odaklanmasına ve metin seçmesine izin verir.

NOTE: Salt okunur alanlar [doğrulamayı](guide/forms/signals/validation) atlar.

### Always readonly

Bir alanı kalıcı olarak salt okunur yapmak için `readonly()`'yi yalnızca alan yoluyla çağırın:

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

`[FormField]` direktifi, alanın durumuna göre `readonly` niteliğini otomatik olarak bağlar.

### Conditional readonly

Koşullara göre bir alanı salt okunur yapmak için reaktif mantık fonksiyonu sağlayın:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, readonly} from '@angular/forms/signals';

@Component({
  selector: 'app-document',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="documentForm.isLocked" />
      Lock document
    </label>

    <label>
      Document Title
      <input [formField]="documentForm.title" />
    </label>
  `,
})
export class Document {
  documentModel = signal({
    isLocked: false,
    title: 'Untitled',
  });

  documentForm = form(this.documentModel, (schemaPath) => {
    readonly(schemaPath.title, ({valueOf}) => valueOf(schemaPath.isLocked));
  });
}
```

`isLocked` doğru olduğunda, başlık alanı salt okunur olur.

## Choose between hidden, disabled, and readonly

Bu üç yapılandırma fonksiyonu alan kullanılabilirliğini farklı şekillerde kontrol eder:

Alan şu durumlarda `hidden()` seçin:

- Kullanıcı arayüzünde hiç görünmemeli
- Mevcut form durumuyla ilgisiz
- Örnek: "Faturayla aynı" işaretlendiğinde kargo adresi alanları

Alan şu durumlarda `disabled()` seçin:

- Görünür ama düzenlenemez olmalı
- Neden kullanılamadığını göstermesi gerekiyor (devre dışı nedenleri kullanarak)
- HTML form gönderiminden hariç tutulmalı
- Örnek: Form geçerli olana kadar devre dışı gönder düğmesi, yönetici olmayan kullanıcılar için devre dışı onay alanları

Alan şu durumlarda `readonly()` seçin:

- Görünür ama düzenlenemez olmalı
- Kullanıcıların görmesi, seçmesi veya kopyalaması gereken veriler içeriyor
- HTML form gönderime dahil edilmeli
- Örnek: Sipariş onay numarası, sistem tarafından oluşturulan referans kodları

Üçü de aktifken doğrulamayı atlar ve kullanıcı düzenlemeyi engeller. Temel farklar:

| Özellik                              | `hidden()` | `disabled()` | `readonly()` |
| ------------------------------------ | ---------- | ------------ | ------------ |
| Kullanıcı arayüzünde görünür         | Hayır      | Evet         | Evet         |
| Kullanıcılar odaklanabilir/seçebilir | Hayır      | Hayır        | Evet         |
| HTML form gönderime dahil            | Hayır      | Hayır        | Evet         |

## Delay input operations with `debounce()`

`debounce()` kuralı form modelinin güncellenmesini geciktirir. Bu, performans optimizasyonu ve hızlı girdi sırasında gereksiz işlemleri azaltmak için kullanışlıdır.

### What debouncing does

Geciktirme olmadan, her tuş vuruşu form modelini anında günceller. Bu şunları tetikleyebilir:

- Her değişiklikte yeniden hesaplanan pahalı computed sinyaller
- Her karakterden sonra doğrulama kontrolleri
- Model değerine bağlı API çağrıları veya diğer yan etkiler

Geciktirme bu güncellemeleri erteler ve gereksiz işleri azaltır.

### Basic debouncing

Milisaniye cinsinden bir gecikme belirterek bir alanı geciktirebilirsiniz:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, debounce} from '@angular/forms/signals';

@Component({
  selector: 'app-search',
  imports: [FormField],
  template: `
    <label>
      Search
      <input [formField]="searchForm.query" />
    </label>

    <p>Searching for: {{ searchForm.query().value() }}</p>
  `,
})
export class Search {
  searchModel = signal({
    query: '',
  });

  searchForm = form(this.searchModel, (schemaPath) => {
    debounce(schemaPath.query, 300);
  });
}
```

300ms geciktirme ile:

- Kullanıcı girdi alanına yazar
- Form modeli yalnızca 300ms yazma hareketsizliğinden sonra güncellenir
- Kullanıcı yazmaya devam ederse, zamanlayıcı her tuş vuruşuyla sıfırlanır
- Kullanıcı 300ms durduğunda, model son değerle güncellenir

### Timing guarantees

`debounce()` fonksiyonu, kullanıcıların bu mekanizmalar aracılığıyla veri kaybetmemesini sağlar:

- **Dokunulmuş olarak işaretlendiğinde:** Değer anında senkronize olur ve bekleyen geciktirme gecikmesini iptal eder. Bu, alan odağını kaybettiğinde (blur) veya açıkça dokunulmuş olarak işaretlendiğinde gerçekleşir.
- **Form gönderiminde:** Tüm alanlar doğrulamadan önce dokunulmuş olarak işaretlenir ve bu, tüm geciktirilmiş değerlerin anında senkronize olmasını sağlar.

Bu, kullanıcıların geciktirme gecikmelerinin sona ermesini beklemeden hızlı yazabilecekleri, sekmeyle geçebilecekleri veya formu gönderebilecekleri anlamına gelir.

### Custom debounce logic

Gelişmiş kontrol için, değerin ne zaman senkronize edileceğini kontrol eden bir geciktirici fonksiyon sağlayın. Bu fonksiyon, kontrol değeri her güncellendiğinde çağrılır ve anında senkronize etmek için `undefined` veya çözülene kadar senkronizasyonu engelleyen bir Promise döndürebilir:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, debounce} from '@angular/forms/signals';

@Component({
  selector: 'app-search',
  imports: [FormField],
  template: `
    <label>
      Search
      <input [formField]="searchForm.query" />
    </label>
  `,
})
export class Search {
  searchModel = signal({
    query: '',
  });

  searchForm = form(this.searchModel, (schemaPath) => {
    debounce(schemaPath.query, () => {
      // 500ms sonra çözülen bir promise döndür
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    });
  });
}
```

Geciktirici fonksiyon şunları döndürebilir:

- Değeri anında senkronize etmek için `undefined`
- Çözülene kadar senkronizasyonu engelleyen bir `Promise<void>`

Özel geciktirme mantığı için kullanım durumları:

- Basit gecikmelerin ötesinde özel zamanlama mantığı uygulama
- Senkronizasyonu harici olaylarla koordine etme
- Uygulama durumuna göre koşullu geciktirme

### When to use debouncing

Geciktirme en çok şu durumlarda kullanışlıdır:

- Alan değerine bağlı pahalı computed sinyalleriniz varsa
- Alan API çağrıları veya diğer yan etkileri tetikliyorsa
- Hızlı yazma sırasında doğrulama yükünü azaltmak istiyorsanız
- Performans profilleme, model güncellemelerinin yavaşlamalara neden olduğunu gösteriyorsa

Şu durumlarda geciktirme kullanmayın:

- Alan iyi kullanıcı deneyimi için anında güncellemelere ihtiyaç duyuyorsa (hesap makinesi girdileri gibi)
- Performans faydası ihmal edilebilirse
- Kullanıcılar gerçek zamanlı geri bildirim bekliyorsa

## Associate data with a field using `metadata()`

Meta veri, [özel kontroller](guide/forms/signals/custom-controls) veya form mantığı tarafından okunabilecek hesaplanmış bilgileri alanlara eklemenize olanak tanır. Yaygın kullanım durumları arasında HTML girdi nitelikleri (min, max, maxlength, pattern), özel kullanıcı arayüzü ipuçları (yer tutucu metin, yardım metni) ve erişilebilirlik bilgileri bulunur.

### Pre-defined metadata keys

Signal Forms, doğrulama kurallarının otomatik olarak doldurduğu altı önceden tanımlanmış meta veri anahtarı sağlar:

- `REQUIRED` - Alanın zorunlu olup olmadığı (`boolean`)
- `MIN` - Minimum sayısal değer (`number | undefined`)
- `MAX` - Maksimum sayısal değer (`number | undefined`)
- `MIN_LENGTH` - Minimum dize/dizi uzunluğu (`number | undefined`)
- `MAX_LENGTH` - Maksimum dize/dizi uzunluğu (`number | undefined`)
- `PATTERN` - Düzenli ifade kalıbı (`RegExp[]` - birden fazla kalıbı desteklemek için dizi)

`required()` veya `min()` gibi doğrulama kuralları kullandığınızda, ilgili meta verileri otomatik olarak ayarlarlar. `metadata()` fonksiyonu, bir alanla ilişkili ek veriler yayınlamak için bir yol sağlar.

### Reading pre-defined metadata

`[FormField]` direktifi, yerleşik meta verileri otomatik olarak HTML niteliklerine bağlar. Ayrıca alan durumundaki yerleşik erişimcileri kullanarak meta verileri doğrudan okuyabilirsiniz:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, min, max} from '@angular/forms/signals';

@Component({
  selector: 'app-age',
  imports: [FormField],
  template: `
    <label>
      Age (between {{ ageForm.age().min() }} and {{ ageForm.age().max() }})
      <input type="number" [formField]="ageForm.age" />
    </label>

    @if (ageForm.age().required()) {
      <span class="required-indicator">*</span>
    }
  `,
})
export class Age {
  ageModel = signal({
    age: 0,
  });

  ageForm = form(this.ageModel, (schemaPath) => {
    required(schemaPath.age);
    min(schemaPath.age, 18);
    max(schemaPath.age, 120);
  });
}
```

`[formField]` direktifi otomatik olarak `required`, `min` ve `max` niteliklerini girdiye bağlar. Görüntüleme veya mantık amaçları için bu değerleri `field().required()`, `field().min()` ve `field().max()` kullanarak okuyabilirsiniz.

### Setting metadata manually

Doğrulama kuralları bunları otomatik olarak ayarlamadığında meta veri değerlerini ayarlamak için `metadata()` fonksiyonunu kullanın. `MIN` ve `MAX` gibi yerleşik meta veriler için doğrulama kurallarını tercih edin:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, min, max, validate} from '@angular/forms/signals';

@Component({
  selector: 'app-custom',
  imports: [formField],
  template: ` <input [formField]="customForm.score" /> `,
})
export class Custom {
  customModel = signal({score: 0});

  customForm = form(this.customModel, (schemaPath) => {
    // Yerleşik doğrulama kurallarını kullanın - meta verileri otomatik olarak ayarlarlar
    min(schemaPath.score, 0);
    max(schemaPath.score, 100);

    // Gerekirse özel doğrulama mantığı ekleyin
    validate(schemaPath.score, ({value}) => {
      const score = value();
      // min/max ötesinde özel doğrulama (örn. 5'in katı olmalı)
      if (score % 5 !== 0) {
        return {kind: 'increment', message: 'Score must be a multiple of 5'};
      }
      return null;
    });
  });
}
```

### Creating custom metadata keys

Uygulamaya özgü bilgiler için kendi meta veri anahtarlarınızı oluşturun:

```angular-ts
import {createMetadataKey, metadata} from '@angular/forms/signals';

// Modül düzeyinde tanımlayın (bileşenlerin içinde değil)
export const PLACEHOLDER = createMetadataKey<string>();
export const HELP_TEXT = createMetadataKey<string>();

// Şemada kullanın
form(model, (schemaPath) => {
  metadata(schemaPath.email, PLACEHOLDER, () => 'user@example.com');
  metadata(schemaPath.email, HELP_TEXT, () => 'We will never share your email');
});

// Bileşende okuyun
const placeholderText = myForm.email().metadata(PLACEHOLDER);
const helpText = myForm.email().metadata(HELP_TEXT);
```

Varsayılan olarak, özel meta veri anahtarları "son yazan kazanır" stratejisi kullanır -- aynı anahtarla `metadata()`'yı birden fazla kez çağırırsanız yalnızca son değer tutulur.

**Önemli:** Meta veri anahtarlarını her zaman modül düzeyinde tanımlayın, asla bileşenlerin içinde değil. Meta veri anahtarları nesne kimliğine dayanır ve bunları yeniden oluşturmak o kimliği kaybeder.

### Accumulating metadata with reducers

Varsayılan olarak, aynı anahtarla `metadata()`'yı birden fazla kez çağırmak "son yazan kazanır" kullanır -- yalnızca son değer tutulur. Bunun yerine değerleri biriktirmek için `createMetadataKey()`'e bir indirgeyici geçirin:

```angular-ts
import {createMetadataKey, metadata, MetadataReducer} from '@angular/forms/signals';

// Değerleri bir diziye biriktiren bir anahtar oluşturun
export const HINTS = createMetadataKey<string, string[]>(MetadataReducer.list());

// Birden fazla çağrı değerleri biriktirir
form(model, (schemaPath) => {
  metadata(schemaPath.password, HINTS, () => 'At least 8 characters');
  metadata(schemaPath.password, HINTS, () => 'Include a number');
  metadata(schemaPath.password, HINTS, () => 'Include a special character');
});

// Sonuç: Biriktirilmiş diziyi içeren sinyal
const passwordHints = passwordForm.password().metadata(HINTS)();
// ['At least 8 characters', 'Include a number', 'Include a special character']
```

Angular, `MetadataReducer` aracılığıyla yerleşik indirgeyiciler sağlar:

- `MetadataReducer.list()` - Değerleri bir diziye biriktirir
- `MetadataReducer.min()` - Minimum değeri tutar
- `MetadataReducer.max()` - Maksimum değeri tutar
- `MetadataReducer.or()` - Boolean değerlerin mantıksal VEYA'sı
- `MetadataReducer.and()` - Boolean değerlerin mantıksal VE'si

### Managed metadata keys

Biriktirilmiş sonuçtan yeni bir değer hesaplamanız gerektiğinde `createManagedMetadataKey()` kullanın. Dönüşüm fonksiyonu, indirgenmiş değerin bir sinyalini alır ve hesaplanmış sonucu döndürür:

```angular-ts
import {createManagedMetadataKey, metadata, MetadataReducer} from '@angular/forms/signals';

// İpuçlarını biriktirin ve sonuçtan ek veri hesaplayın
export const HINTS = createManagedMetadataKey(
  (signal) =>
    computed(() => {
      const hints = signal();
      return {
        messages: hints,
        count: hints?.length ?? 0,
      };
    }),
  MetadataReducer.list(),
);

// Birden fazla çağrı değerleri biriktirir
form(model, (schemaPath) => {
  metadata(schemaPath.password, HINTS, () => 'At least 8 characters');
  metadata(schemaPath.password, HINTS, () => 'Include a number');
  metadata(schemaPath.password, HINTS, () => 'Include a special character');
});

// Sonuç: Dönüştürülmüş değere sahip sinyal
const passwordHints = passwordForm.password().metadata(HINTS)();
// { messages: ['At least 8 characters', 'Include a number', 'Include a special character'], count: 3 }
```

Yönetilen meta veri anahtarı iki argüman alır:

1. **Dönüşüm fonksiyonu** - Biriktirilmiş sonuçtan yeni bir değer hesaplar (indirgenmiş değerin bir sinyalini alır)
2. **İndirgeyici** - Değerlerin nasıl biriktiğini belirler (isteğe bağlı - varsayılan "son yazan kazanır")

### Reactive metadata

Meta verileri diğer alan değerlerine reaktif yapın:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, max} from '@angular/forms/signals';

@Component({
  selector: 'app-inventory',
  imports: [formField],
  template: `
    <label>
      Item
      <select [formField]="inventoryForm.item">
        <option value="widget">Widget</option>
        <option value="gadget">Gadget</option>
      </select>
    </label>

    <label>
      Quantity (max: {{ inventoryForm.quantity().max() }})
      <input
        type="number"
        [formField]="inventoryForm.quantity"
        [max]="inventoryForm.quantity().max()"
      />
    </label>
  `,
})
export class Inventory {
  inventoryModel = signal({
    item: 'widget',
    quantity: 0,
  });

  inventoryForm = form(this.inventoryModel, (schemaPath) => {
    max(schemaPath.quantity, ({valueOf}) => {
      const item = valueOf(schemaPath.item);
      return item === 'widget' ? 100 : 50;
    });
  });
}
```

`max()` doğrulama kuralı, seçilen öğeye göre `MAX` meta verilerini reaktif olarak ayarlar. Bu, doğrulama kurallarının diğer alanlar güncellendiğinde değişen koşullu değerlere nasıl sahip olabileceğini gösterir.

### Using metadata in custom controls

Özel kontroller, HTML niteliklerini ve davranışlarını yapılandırmak için meta verileri okuyabilir:

```angular-ts
import {Component, input, computed, model} from '@angular/core';
import {FormValueControl, Field, PLACEHOLDER} from '@angular/forms/signals';

@Component({
  selector: 'custom-input',
  template: `
    <input
      type="number"
      [value]="state().value()"
      (input)="state().value.set(($event.target as HTMLInputElement).valueAsNumber)"
      [min]="state().min()"
      [max]="state().max()"
      [required]="state().required()"
      [placeholder]="placeholderText()"
    />
  `,
})
export class CustomInput implements FormValueControl<number> {
  // Form alanına bağlan.
  formField = input.required<Field<number>>();

  // Mevcut alan durumunu hesapla.
  state = computed(() => this.formField()());

  // FormValueControl arayüzünün zorunlu özelliği.
  value = model(0);

  placeholderText = computed(() => this.state().metadata(PLACEHOLDER)() ?? '');
}
```

Bu kalıp, özel kontrollerin şemada tanımlanan doğrulama kurallarına ve meta verilere göre kendilerini otomatik olarak yapılandırmasına olanak tanır.

TIP: Özel kontroller oluşturma hakkında daha fazla bilgi için [Özel Kontroller kılavuzuna](guide/forms/signals/custom-controls) bakın.

## Combining rules

Aynı alana birden fazla kural uygulayabilir ve form durumuna göre tüm kural gruplarını uygulamak için koşullu mantık kullanabilirsiniz.

### Multiple rules on one field

Bir alanın davranışının tüm yönlerini yapılandırmak için birden fazla kural uygulayın:

```angular-ts
import {Component, signal} from '@angular/core';
import {
  form,
  FormField,
  disabled,
  hidden,
  debounce,
  metadata,
  PLACEHOLDER,
} from '@angular/forms/signals';

@Component({
  selector: 'app-promo',
  imports: [formField],
  template: `
    @if (!promoForm.promoCode().hidden()) {
      <label>
        Promo Code
        <input [formField]="promoForm.promoCode" />
      </label>
    }
  `,
})
export class Promo {
  promoModel = signal({
    hasAccount: false,
    subscriptionType: 'free' as 'free' | 'premium',
    promoCode: '',
  });

  promoForm = form(this.promoModel, (schemaPath) => {
    disabled(schemaPath.promoCode, ({valueOf}) =>
      !valueOf(schemaPath.hasAccount) ? 'You must have an account' : false,
    );
    hidden(schemaPath.promoCode, ({valueOf}) => valueOf(schemaPath.subscriptionType) === 'free');
    debounce(schemaPath.promoCode, 300);
    metadata(schemaPath.promoCode, PLACEHOLDER, () => 'Enter promo code');
  });
}
```

Bu kurallar birlikte çalışır:

- Gizli öncelik alır - alan gizliyse devre dışı durumunun önemi yoktur
- Devre dışı, salt okunur durumdan bağımsız olarak düzenlemeyi engeller
- Geciktirme, diğer durumdan bağımsız olarak model güncellemelerini etkiler
- Meta veri bağımsızdır ve her zaman kullanılabilir

### Conditional logic with applyWhen

Tüm kural gruplarını koşullu olarak uygulamak için `applyWhen()` kullanın:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, applyWhen, required, pattern} from '@angular/forms/signals';

@Component({
  selector: 'app-address',
  imports: [formField],
  template: `
    <label>
      Country
      <select [formField]="addressForm.country">
        <option value="US">United States</option>
        <option value="CA">Canada</option>
      </select>
    </label>

    <label>
      Zip/Postal Code
      <input [formField]="addressForm.zipCode" />
    </label>
  `,
})
export class Address {
  addressModel = signal({
    country: 'US',
    zipCode: '',
  });

  addressForm = form(this.addressModel, (schemaPath) => {
    applyWhen(
      schemaPath,
      ({valueOf}) => valueOf(schemaPath.country) === 'US',
      (schemaPath) => {
        // Yalnızca ülke US olduğunda uygulanır
        required(schemaPath.zipCode);
        pattern(schemaPath.zipCode, /^\d{5}(-\d{4})?$/);
      },
    );
  });
}
```

`applyWhen()` fonksiyonu şunları alır:

1. Mantık uygulanacak yol (genellikle kök form yolu)
2. `true` (uygula) veya `false` (uygulama) döndüren reaktif mantık fonksiyonu
3. Koşullu kuralları tanımlayan şema fonksiyonu

Koşullu kurallar yalnızca koşul doğru olduğunda çalışır. Bu, doğrulama kurallarının veya davranışın kullanıcı seçimlerine göre değiştiği karmaşık formlar için kullanışlıdır.

### Reusable schema functions

Yaygın kural yapılandırmalarını yeniden kullanılabilir fonksiyonlara çıkarın:

```angular-ts
import {SchemaPath, debounce, metadata, maxLength, PLACEHOLDER} from '@angular/forms/signals';

function emailFieldConfig(path: SchemaPath<string>) {
  debounce(path, 300);
  metadata(path, PLACEHOLDER, () => 'user@example.com');
  maxLength(path, 255);
}

// Birden fazla formda kullanın
const contactForm = form(contactModel, (schemaPath) => {
  emailFieldConfig(schemaPath.email);
  emailFieldConfig(schemaPath.alternateEmail);
});

const registrationForm = form(registrationModel, (schemaPath) => {
  emailFieldConfig(schemaPath.email);
});
```

Bu kalıp, uygulamanızda birden fazla formda kullandığınız standart alan yapılandırmalarınız olduğunda yararlıdır.

## Next steps

Signal Forms hakkında daha fazla bilgi edinmek için şu ilgili kılavuzlara göz atın:

- [Field State Management](guide/forms/signals/field-state-management) - Bu fonksiyonlar tarafından oluşturulan durum sinyallerini şablonlarınızda ve bileşen mantığınızda nasıl kullanacağınızı öğrenin
- [Validation](guide/forms/signals/validation) - Doğrulama kuralları ve hata yönetimi hakkında bilgi edinin
- [Custom Controls](guide/forms/signals/custom-controls) - Özel kontrollerin kendilerini otomatik olarak yapılandırmak için meta verileri ve durumu nasıl okuyabileceğini öğrenin
