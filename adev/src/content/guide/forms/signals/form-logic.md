# Form mantığı ekleme

Signal Forms, şemalar kullanarak formunuza mantık eklemenize olanak tanır. Doğrulama mantığı [Doğrulama kılavuzunda](guide/forms/signals/validation) ele alınmaktadır ve bu kılavuz şemalarda mevcut olan diğer kuralları tartışır. Alanları koşullu olarak devre dışı bırakabilir, diğer değerlere göre gizleyebilir, salt okunur yapabilir, kullanıcı girdisini geciktirebilir ve özel kontroller için meta veri ekleyebilirsiniz.

Bu kılavuz, alan davranışını kontrol etmek için `disabled()`, `hidden()`, `readonly()`, `debounce()` ve `metadata()` gibi kuralların nasıl kullanılacağını gösterir.

## Form mantığı ne zaman eklenmeli

Alan davranışı diğer alan değerlerine bağlı olduğunda veya reaktif olarak güncellenmesi gerektiğinde kuralları kullanın. Örneğin:

- Sipariş toplamı çok düşük olduğunda devre dışı bırakılan bir kupon kodu alanı
- Kargo gerekmedikçe gizlenen bir adres alanı
- API çağrılarını azaltmak için geciktirilen bir arama alanı

## Kurallar nasıl çalışır

Kurallar, formunuzdaki belirli alanlara reaktif mantık bağlar. Çoğu koşullu kural, bir `when` fonksiyonu içeren bir seçenekler nesnesi kabul eder. `when` fonksiyonu, referans verdiği sinyaller değiştiğinde otomatik olarak yeniden hesaplanır, tıpkı bir `computed` gibi.

```ts
const orderForm = form(this.orderModel, (schemaPath) => {
  disabled(schemaPath.couponCode, {when: ({valueOf}) => valueOf(schemaPath.total) < 50});
  //~~~~~~ ~~~~~~~~~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //kural    yol                   reaktif mantık fonksiyonu
});
```

Reaktif mantık fonksiyonları, `valueOf()` ve `stateOf()` gibi yardımcı fonksiyonlar aracılığıyla alan değerlerine ve durumuna erişim sağlayan bir `FieldContext` nesnesi alır. Bu yardımcılara doğrudan erişmek için genellikle parçalama yapılır.

NOTE: Şema geri çağırma parametresi (bu örneklerde `schemaPath`) formunuzdaki tüm alanlara yollar sağlayan bir `SchemaPathTree` nesnesidir. Bu parametreyi istediğiniz gibi adlandırabilirsiniz.

`FieldContext` özellikleri ve yöntemleri hakkında tam ayrıntılar için [Doğrulama kılavuzuna](guide/forms/signals/validation) bakın.

## `disabled()` ile alan güncellemelerini engelleme {#prevent-field-updates-with-disabled}

`disabled()` kuralı bir alanın devre dışı durumunu yapılandırır.

Alanın durumuna göre `disabled` niteliğini otomatik olarak bağlamak için `[formField]` direktifiyle çalışır, bu nedenle şablonunuza manuel olarak `[disabled]="yourForm.fieldName().disabled()"` eklemenize gerek yoktur.

NOTE: Devre dışı alanlar doğrulamayı atlar -- form doğrulama kontrollerine katılmazlar. Alanın değeri korunur ancak doğrulanmaz. Doğrulama davranışı hakkında ayrıntılar için [Doğrulama kılavuzuna](guide/forms/signals/validation) bakın.

### Her zaman devre dışı

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

### Koşullu devre dışı bırakma

Koşullara göre bir alanı devre dışı bırakmak için, `true` (devre dışı) veya `false` (etkin) döndüren bir `when` fonksiyonu sağlayın:

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
    disabled(schemaPath.couponCode, {when: ({valueOf}) => valueOf(schemaPath.total) < 50});
  });
}
```

Bu örnekte, sipariş toplamı 50$'dan az olduğunda kupon kodu alanı devre dışı bırakılır.

### Devre dışı bırakma nedenleri {#disabled-reasons}

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
    disabled(schemaPath.couponCode, {
      when: ({valueOf}) =>
        valueOf(schemaPath.total) < 50 ? 'Order must be $50 or more to use a coupon' : false,
    });
  });
}
```

`when` fonksiyonu şunları döndürür:

- Alanı bir nedenle devre dışı bırakmak için bir **dize**
- Alanı etkinleştirmek için `false` (herhangi bir falsy değer değil - açıkça `false` kullanın)

Nedenlere alan durumundaki `disabledReasons()` sinyali aracılığıyla erişin. Her nedenin döndürdüğünüz dizeyi içeren bir `message` özelliği vardır.

#### Birden fazla devre dışı bırakma nedeni

Aynı alanda `disabled()`'ı birden fazla kez de çağırabilirsiniz ve döndürülen tüm nedenler birikir:

```angular-ts
orderForm = form(this.orderModel, (schemaPath) => {
  disabled(schemaPath.promoCode, {
    when: ({valueOf}) =>
      !valueOf(schemaPath.hasAccount) ? 'You must have an account to use promo codes' : false,
  });
  disabled(schemaPath.promoCode, {
    when: ({valueOf}) => (valueOf(schemaPath.total) < 25 ? 'Order must be at least $25' : false),
  });
});
```

Her iki koşul da doğruysa, alan her iki devre dışı nedenini gösterir. Bu kalıp, ayrı tutmak istediğiniz karmaşık kullanılabilirlik kuralları için yararlıdır.

## Alanlarda `hidden()` durumunu yapılandırma {#configuring-hidden-state-on-fields}

`hidden()` kuralı bir alanın gizli durumunu yapılandırır. Ancak bu yalnızca programatik bir durum ayarlar. **Alanın kullanıcı arayüzünde görünüp görünmeyeceğini siz kontrol edersiniz**.

IMPORTANT: `disabled` ve `readonly`'den farklı olarak, `hidden` durumu için yerel bir DOM özelliği yoktur. `[formField]` direktifi öğelere `hidden` niteliği uygulamaz. `hidden()` durumuna göre alanları koşullu olarak oluşturmak için şablonunuzda `@if` veya CSS kullanmalısınız.

NOTE: Devre dışı alanlar gibi, gizli alanlar da doğrulamayı atlar. Ayrıntılar için [Doğrulama kılavuzuna](guide/forms/signals/validation) bakın.

### Temel alan gizleme

`true` (gizli) veya `false` (görünür) döndüren bir `when` fonksiyonuyla `hidden()` kullanın:

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
    hidden(schemaPath.publicUrl, {when: ({valueOf}) => !valueOf(schemaPath.isPublic)});
  });
}
```

### Her zaman gizli

Bir alanı kalıcı olarak gizli yapmak için `hidden()`'ı yalnızca alan yoluyla çağırın:

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

    <!-- publicUrl kalıcı olarak gizli, bu yüzden bu blok hiç render edilmez -->
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
    // Bu alan artık kalıcı olarak gizli ve aktif doğrulamanın dışında
    hidden(schemaPath.publicUrl);
  });
}
```

## `readonly()` ile düzenlenemez alanları görüntüleme {#display-uneditable-fields-with-readonly}

`readonly()` kuralı kullanıcıların bir alanı güncellemesini engeller. `[FormField]` direktifi, bu durumu HTML `readonly` niteliğine otomatik olarak bağlar ve bu, düzenlemeyi engellerken kullanıcıların odaklanmasına ve metin seçmesine izin verir.

NOTE: Salt okunur alanlar [doğrulamayı](guide/forms/signals/validation) atlar.

### Her zaman salt okunur

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

### Koşullu salt okunur

Koşullara göre bir alanı salt okunur yapmak için bir `when` fonksiyonu sağlayın:

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
    readonly(schemaPath.title, {when: ({valueOf}) => valueOf(schemaPath.isLocked)});
  });
}
```

`isLocked` doğru olduğunda, başlık alanı salt okunur olur.

## hidden, disabled ve readonly arasında seçim yapma

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

## `debounce()` ile girdi işlemlerini geciktirme {#delay-input-operations-with-debounce}

`debounce()` kuralı form modelinin güncellenmesini geciktirir. Bu, performans optimizasyonu ve hızlı girdi sırasında gereksiz işlemleri azaltmak için kullanışlıdır.

### Geciktirme ne yapar

Geciktirme olmadan, her tuş vuruşu form modelini anında günceller. Bu şunları tetikleyebilir:

- Her değişiklikte yeniden hesaplanan pahalı computed sinyaller
- Her karakterden sonra doğrulama kontrolleri
- Model değerine bağlı API çağrıları veya diğer yan etkiler

Geciktirme bu güncellemeleri erteler ve gereksiz işleri azaltır.

### Temel geciktirme

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

### Zamanlama garantileri

`debounce()` fonksiyonu, kullanıcıların bu mekanizmalar aracılığıyla veri kaybetmemesini sağlar:

- **Dokunulmuş olarak işaretlendiğinde:** Değer anında senkronize olur ve bekleyen geciktirme gecikmesini iptal eder. Bu, alan odağını kaybettiğinde (blur) veya açıkça dokunulmuş olarak işaretlendiğinde gerçekleşir.
- **Form gönderiminde:** Tüm alanlar doğrulamadan önce dokunulmuş olarak işaretlenir ve bu, tüm geciktirilmiş değerlerin anında senkronize olmasını sağlar.

Bu, kullanıcıların geciktirme gecikmelerinin sona ermesini beklemeden hızlı yazabilecekleri, sekmeyle geçebilecekleri veya formu gönderebilecekleri anlamına gelir.

### Özel geciktirme mantığı

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
      // 500ms sonra çözümlenen bir promise döndür
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

### Geciktirme ne zaman kullanılmalı

Geciktirme en çok şu durumlarda kullanışlıdır:

- Alan değerine bağlı pahalı computed sinyalleriniz varsa
- Alan API çağrıları veya diğer yan etkileri tetikliyorsa
- Hızlı yazma sırasında doğrulama yükünü azaltmak istiyorsanız
- Performans profilleme, model güncellemelerinin yavaşlamalara neden olduğunu gösteriyorsa

Şu durumlarda geciktirme kullanmayın:

- Alan iyi kullanıcı deneyimi için anında güncellemelere ihtiyaç duyuyorsa (hesap makinesi girdileri gibi)
- Performans faydası ihmal edilebilirse
- Kullanıcılar gerçek zamanlı geri bildirim bekliyorsa

## `metadata()` kullanarak bir alana veri ilişkilendirme

Meta veri, bir alana reaktif veri ekler. Doğrulama kuralları bu sistemi dahili olarak kullanır ve yardım metni, yapılandırma veya hesaplanmış görüntüleme değerleri gibi uygulamaya özgü bilgiler için kendi anahtarlarınızı yayınlayabilirsiniz.

Signal Forms, yerleşik doğrulayıcıların otomatik olarak doldurduğu önceden tanımlanmış meta veri anahtarları sağlar:

| Anahtar      | Dolduran             | Okuma yolu            |
| ------------ | -------------------- | --------------------- |
| `REQUIRED`   | `required()`         | `field().required()`  |
| `MIN`        | `min()`, `minDate()` | `field().min()`       |
| `MAX`        | `max()`, `maxDate()` | `field().max()`       |
| `MIN_LENGTH` | `minLength()`        | `field().minLength()` |
| `MAX_LENGTH` | `maxLength()`        | `field().maxLength()` |
| `PATTERN`    | `pattern()`          | `field().pattern()`   |

`[formField]` direktifi bunlardan beşini (`REQUIRED`, `MIN`, `MAX`, `MIN_LENGTH` ve `MAX_LENGTH`) yerel bir form kontrolündeki ilgili HTML niteliğine otomatik olarak bağlar. `PATTERN` istisnadır, çünkü Signal Forms alan başına birden fazla kalıbı destekler ancak HTML `pattern` niteliği yalnızca tek bir düzenli ifade kabul eder.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, min, max} from '@angular/forms/signals';

@Component({
  selector: 'app-age',
  imports: [FormField],
  template: `
    <label>
      Age (between {{ ageForm.age().min?.() }} and {{ ageForm.age().max?.() }})
      <input type="number" [formField]="ageForm.age" />
    </label>

    @if (ageForm.age().required()) {
      <span class="required-indicator">*</span>
    }
  `,
})
export class Age {
  ageModel = signal({age: 0});

  ageForm = form(this.ageModel, (schemaPath) => {
    required(schemaPath.age);
    min(schemaPath.age, 18);
    max(schemaPath.age, 120);
  });
}
```

### Reaktif meta veri

Doğrulama kuralları, kısıtlamalarını diğer alanlardan türetebilir ve böylece yayınlanan meta veriyi reaktif hale getirebilir:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, max} from '@angular/forms/signals';

@Component({
  selector: 'app-inventory',
  imports: [FormField],
  template: `
    <label>
      Item
      <select [formField]="inventoryForm.item">
        <option value="widget">Widget</option>
        <option value="gadget">Gadget</option>
      </select>
    </label>

    <label>
      Quantity (max: {{ inventoryForm.quantity().max?.() }})
      <input type="number" [formField]="inventoryForm.quantity" />
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

`max()` doğrulama kuralı, seçilen öğeye göre `MAX` meta verisini reaktif olarak ayarlar, böylece `field().max()`'ı okuyan herhangi bir şablon veya kontrol, öğe değiştiğinde güncellenir.

Özel anahtarların nasıl tanımlanacağı, katkıların indirgeyicilerle nasıl birleştirileceği ve yaşam döngüsü farkındalığına sahip nesneler için yönetilen meta verinin nasıl kullanılacağı dahil olmak üzere daha derin bir kapsam için [Alan meta verisi kılavuzuna](guide/forms/signals/field-metadata) bakın.

## Kuralları birleştirme

Aynı alana birden fazla kural uygulayabilir ve form durumuna göre tüm kural gruplarını uygulamak için koşullu mantık kullanabilirsiniz.

### Bir alanda birden fazla kural

Bir alanın davranışının tüm yönlerini yapılandırmak için birden fazla kural uygulayın:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled, hidden, debounce, metadata} from '@angular/forms/signals';
import {PLACEHOLDER} from './metadata-keys';

@Component({
  selector: 'app-promo',
  imports: [FormField],
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
    disabled(schemaPath.promoCode, {
      when: ({valueOf}) => (!valueOf(schemaPath.hasAccount) ? 'You must have an account' : false),
    });
    hidden(schemaPath.promoCode, {
      when: ({valueOf}) => valueOf(schemaPath.subscriptionType) === 'free',
    });
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

### applyWhen ile koşullu mantık

Tüm kural gruplarını koşullu olarak uygulamak için `applyWhen()` kullanın:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, applyWhen, required, pattern} from '@angular/forms/signals';

@Component({
  selector: 'app-address',
  imports: [FormField],
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

### Yeniden kullanılabilir şema fonksiyonları

Yaygın kural yapılandırmalarını yeniden kullanılabilir fonksiyonlara çıkarın:

```ts
import {SchemaPath, debounce, metadata, maxLength} from '@angular/forms/signals';
import {PLACEHOLDER} from './metadata-keys';

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

## Sonraki adımlar

Signal Forms hakkında daha fazla bilgi edinmek için şu ilgili kılavuzlara göz atın:

- [Field State Management](guide/forms/signals/field-state-management) - Bu fonksiyonlar tarafından oluşturulan durum sinyallerini şablonlarınızda ve bileşen mantığınızda nasıl kullanacağınızı öğrenin
- [Validation](guide/forms/signals/validation) - Doğrulama kuralları ve hata yönetimi hakkında bilgi edinin
- [Custom Controls](guide/forms/signals/custom-controls) - Özel kontrollerin kendilerini otomatik olarak yapılandırmak için meta verileri ve durumu nasıl okuyabileceğini öğrenin
