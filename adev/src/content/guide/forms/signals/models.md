# Form modelleri

Form modelleri, Signal Forms'un temelidir ve form verileriniz için tek doğruluk kaynağı olarak hizmet eder. Bu kılavuz, form modellerinin nasıl oluşturulacağını, güncelleneceğini ve sürdürülebilirlik için nasıl tasarlanacağını inceler.

NOTE: Form modelleri, bileşen çift yönlü bağlama için kullanılan Angular'ın `model()` sinyalinden farklıdır. Form modeli, form verilerini saklayan yazılabilir bir sinyaldir, `model()` ise ebeveyn/alt bileşen iletişimi için girdiler/çıktılar oluşturur.

## Form modellerinin çözdüğü sorunlar

Formlar, zamanla değişen verileri yönetmeyi gerektirir. Net bir yapı olmadan, bu veriler bileşen özellikleri arasında dağılabilir ve bu da değişiklikleri takip etmeyi, girdiyi doğrulamayı veya verileri bir sunucuya göndermeyi zorlaştırır.

Form modelleri, form verilerini tek bir yazılabilir sinyalde merkezileştirerek bu sorunu çözer. Model güncellendiğinde, form bu değişiklikleri otomatik olarak yansıtır. Kullanıcılar formla etkileşime girdiğinde, model buna göre güncellenir.

## Model oluşturma

Form modeli, Angular'ın `signal()` fonksiyonuyla oluşturulan yazılabilir bir sinyaldir. Sinyal, formunuzun veri yapısını temsil eden bir nesne tutar.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  imports: [FormField],
  template: `
    <input type="email" [formField]="loginForm.email" />
    <input type="password" [formField]="loginForm.password" />
  `,
})
export class LoginComponent {
  loginModel = signal({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel);
}
```

[`form()`](api/forms/signals/form) fonksiyonu model sinyalini kabul eder ve bir **alan ağacı** oluşturur -- modelinizin şeklini yansıtan özel bir nesne yapısı. Alan ağacı hem gezinilebilir (nokta gösterimi ile alt alanlara erişim, örn. `loginForm.email`) hem de çağrılabilirdir (durumuna erişmek için bir alanı fonksiyon olarak çağırın).

`[formField]` direktifi, her girdi öğesini alan ağacındaki karşılık gelen alana bağlayarak kullanıcı arayüzü ile model arasında otomatik çift yönlü senkronizasyon sağlar.

### TypeScript türlerini kullanma

TypeScript nesne sabitlerinden türleri çıkarsa da, açık türler tanımlamak kod kalitesini artırır ve daha iyi IntelliSense desteği sağlar.

```ts
interface LoginData {
  email: string;
  password: string;
}

export class LoginComponent {
  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel);
}
```

Açık türlerle, alan ağacı tam tür güvenliği sağlar. `loginForm.email`'e erişim `FieldTree<string>` olarak türlendirilir ve var olmayan bir özelliğe erişme girişimi derleme zamanı hatasına neden olur.

```ts
// TypeScript bunun FieldTree<string> olduğunu bilir
const emailField = loginForm.email;

// TypeScript hatası: 'username' özelliği mevcut değil
const usernameField = loginForm.username;
```

### Tüm alanları başlatma

Form modelleri, alan ağacına dahil etmek istediğiniz tüm alanlar için başlangıç değerleri sağlamalıdır.

```ts {prefer}
// İyi: Tüm alanlar başlatılmış
const userModel = signal({
  name: '',
  email: '',
  age: 0,
});
```

```ts {avoid}
// Kaçının: Eksik başlangıç değeri
const userModel = signal({
  name: '',
  email: '',
  // age alanı tanımlı değil - userForm.age'e erişilemiyor
});
```

Opsiyonel alanlar için, bunları açıkça boş bir değere veya `null`'a ayarlayın:

```ts
interface UserData {
  name: string;
  email: string;
  phoneNumber: string | null;
}

const userModel = signal<UserData>({
  name: '',
  email: '',
  phoneNumber: null,
});
```

HELPFUL: `<input type=text>` ve `<textarea>` gibi yerel metin kontrolleri `null`'ı desteklemez, boş bir değeri temsil etmek için `''` kullanın.

`undefined` olarak ayarlanan alanlar alan ağacından hariç tutulur. `{value: undefined}` içeren bir model `{}` ile aynı şekilde davranır -- alana erişim bir `FieldTree` yerine `undefined` döndürür.

## Model değerlerini okuma

Form değerlerine iki şekilde erişebilirsiniz: doğrudan model sinyalinden veya bireysel alanlar aracılığıyla. Her yaklaşım farklı bir amaca hizmet eder.

### Modelden okuma

Form gönderimi sırasında olduğu gibi tam form verilerine ihtiyacınız olduğunda model sinyaline erişin:

```ts
async onSubmit() {
  const formData = this.loginModel();
  console.log(formData.email, formData.password);

  // Sunucuya gönder
  await this.authService.login(formData);
}
```

Model sinyali tüm veri nesnesini döndürür ve bu da onu tam form durumuyla çalışan işlemler için ideal kılar.

### Alan durumundan okuma

Alan ağacındaki her alan bir fonksiyondur. Bir alanı çağırmak, alanın değeri, doğrulama durumu ve etkileşim durumu için reaktif sinyaller içeren bir `FieldState` nesnesi döndürür.

Şablonlarda veya reaktif hesaplamalarda bireysel alanlarla çalışırken alan durumuna erişin:

```angular-ts
@Component({
  template: `
    <p>Mevcut e-posta: {{ loginForm.email().value() }}</p>
    <p>Şifre uzunluğu: {{ passwordLength() }}</p>
  `,
})
export class LoginComponent {
  loginModel = signal({email: '', password: ''});
  loginForm = form(this.loginModel);

  passwordLength = computed(() => {
    return this.loginForm.password().value().length;
  });
}
```

Alan durumu, her alanın değeri için reaktif sinyaller sağlar ve bu da onu alana özgü bilgileri görüntülemek veya türetilmiş durum oluşturmak için uygun kılar.

TIP: Alan durumu `value()` ötesinde birçok sinyal daha içerir; doğrulama durumu (örn. valid, invalid, errors), etkileşim takibi (örn. touched, dirty) ve görünürlük (örn. hidden, disabled) gibi.

<!-- TODO: UNCOMMENT BELOW WHEN GUIDE IS AVAILABLE -->
<!-- Tam kapsam için [Alan Durumu Yönetimi kılavuzuna](guide/forms/signals/field-state-management) bakın. -->

## Form modellerini programatik olarak güncelleme

### `set()` ile form modellerini değiştirme

Tüm değeri değiştirmek için form modelinde `set()` kullanın:

```ts
loadUserData() {
  this.userModel.set({
    name: 'Alice',
    email: 'alice@example.com',
    age: 30,
  });
}

resetForm() {
  this.userModel.set({
    name: '',
    email: '',
    age: 0,
  });
}
```

Bu yaklaşım, bir API'den veri yüklerken veya tüm formu sıfırlarken iyi çalışır.

### `set()` veya `update()` ile tek bir alanı doğrudan güncelleme

Alan durumunu doğrudan güncellemek için bireysel alan değerlerinde `set()` kullanın:

```ts
clearEmail() {
  this.userForm.email().value.set('');
}

incrementAge() {
  this.userForm.age().value.update(currentAge => currentAge + 1);
}
```

Bunlar "alan düzeyinde güncellemeler" olarak da bilinir. Model sinyaline otomatik olarak yayılır ve her ikisini de senkronize tutar.

### Örnek: API'den veri yükleme

Yaygın bir kalıp, veri çekmeyi ve modeli doldurmayı içerir:

```ts
export class UserProfileComponent {
  userModel = signal({
    name: '',
    email: '',
    bio: '',
  });

  userForm = form(this.userModel);
  private userService = inject(UserService);

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const userData = await this.userService.getUserProfile();
    this.userModel.set(userData);
  }
}
```

Model değiştiğinde form alanları otomatik olarak güncellenir ve ek kod olmadan çekilen verileri görüntüler.

## Çift yönlü veri bağlama

`[formField]` direktifi, model, form durumu ve kullanıcı arayüzü arasında otomatik çift yönlü senkronizasyon oluşturur.

### Verinin nasıl aktığı

Değişiklikler çift yönlü olarak akar:

**Kullanıcı girdisi -> Model:**

1. Kullanıcı bir girdi öğesine yazar
2. `[formField]` direktifi değişikliği algılar
3. Alan durumu güncellenir
4. Model sinyali güncellenir

**Programatik güncelleme -> Kullanıcı Arayüzü:**

1. Kod modeli `set()` veya `update()` ile günceller
2. Model sinyali aboneleri bilgilendirir
3. Alan durumu güncellenir
4. `[formField]` direktifi girdi öğesini günceller

Bu senkronizasyon otomatik olarak gerçekleşir. Modeli ve kullanıcı arayüzünü senkronize tutmak için abonelik veya olay yöneticisi yazmazsınız.

### Örnek: Her iki yön

```angular-ts
@Component({
  template: `
    <input type="text" [formField]="userForm.name" />
    <button (click)="setName('Bob')">Adı Bob Olarak Ayarla</button>
    <p>Mevcut ad: {{ userModel().name }}</p>
  `,
})
export class UserComponent {
  userModel = signal({name: ''});
  userForm = form(this.userModel);

  setName(name: string) {
    this.userForm.name().value.set(name);
    // Girdi otomatik olarak 'Bob' görüntüler
  }
}
```

Kullanıcı girdiye yazdığında, `userModel().name` güncellenir. Düğmeye tıklandığında, girdi değeri "Bob" olarak değişir. Manuel senkronizasyon kodu gerekmez.

## Model yapısı kalıpları

Form modelleri düz nesneler olabilir veya iç içe nesneler ve diziler içerebilir. Seçtiğiniz yapı, alanlara nasıl eriştiğinizi ve doğrulamayı nasıl organize ettiğinizi etkiler.

### Düz ve iç içe modeller

Düz form modelleri tüm alanları en üst seviyede tutar:

```ts
// Düz yapı
const userModel = signal({
  name: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zip: '',
});
```

İç içe modeller ilişkili alanları gruplar:

```ts
// İç içe yapı
const userModel = signal({
  name: '',
  email: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
  },
});
```

**Düz yapıları şu durumlarda kullanın:**

- Alanların net kavramsal gruplandırmaları yoksa
- Daha basit alan erişimi istiyorsanız (`userForm.city` vs `userForm.address.city`)
- Doğrulama kuralları birden fazla olası grubu kapsıyorsa

**İç içe yapıları şu durumlarda kullanın:**

- Alanlar net bir kavramsal grup oluşturuyorsa (adres gibi)
- Gruplanmış veriler API yapınızla eşleşiyorsa
- Grubu bir birim olarak doğrulamak istiyorsanız

### İç içe nesnelerle çalışma

Nesne yolunu takip ederek iç içe alanlara erişebilirsiniz:

```ts
const userModel = signal({
  profile: {
    firstName: '',
    lastName: '',
  },
  settings: {
    theme: 'light',
    notifications: true,
  },
});

const userForm = form(userModel);

// İç içe alanlara erişim
userForm.profile.firstName; // FieldTree<string>
userForm.settings.theme; // FieldTree<string>
```

Şablonlarda, iç içe alanları üst düzey alanlarla aynı şekilde bağlarsınız:

```angular-ts
@Component({
  template: `
    <input [formField]="userForm.profile.firstName" />
    <input [formField]="userForm.profile.lastName" />

    <select [formField]="userForm.settings.theme">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  `,
})
```

### Dizilerle çalışma

Modeller, öğe koleksiyonları için diziler içerebilir:

```ts
const orderModel = signal({
  customerName: '',
  items: [{product: '', quantity: 0, price: 0}],
});

const orderForm = form(orderModel);

// Dizi öğelerine dizine göre erişim
orderForm.items[0].product; // FieldTree<string>
orderForm.items[0].quantity; // FieldTree<number>
```

Nesne içeren dizi öğeleri otomatik olarak takip kimlikleri alır ve bu, öğeler dizide konum değiştirdiğinde bile alan durumunu korumanıza yardımcı olur. Bu, diziler yeniden sıralandığında doğrulama durumunun ve kullanıcı etkileşimlerinin doğru şekilde korunmasını sağlar.

<!-- TBD: Dinamik diziler ve karmaşık dizi işlemleri için [Dizilerle çalışma kılavuzuna](guide/forms/signals/arrays) bakın. -->

## Sonraki adımlar

Bu kılavuz, modeller oluşturmayı ve değerleri güncellemeyi ele aldı. İlgili kılavuzlar, Signal Forms'un diğer yönlerini inceler:

<!-- TODO: UNCOMMENT WHEN THE GUIDES ARE AVAILABLE -->
<docs-pill-row>
  <docs-pill href="guide/forms/signals/field-state-management" title="Field state management" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Custom controls" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
