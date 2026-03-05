# Designing your form model

Signal Forms, model odaklı bir yaklaşım kullanır ve formun durumunu ile yapısını doğrudan sağladığınız modelden türetir. Tüm formun temeli olarak hizmet ettiğinden, iyi tasarlanmış bir form modeli ile başlamak önemlidir. Bu kılavuz, form modelleri tasarlamak için en iyi uygulamaları inceler.

## Form model vs domain model

Formlar, kullanıcı girdisi toplamak için kullanılır. Uygulamanızda muhtemelen bu girdiyi iş mantığı veya depolama için optimize edilmiş bir şekilde temsil eden bir alan modeli (domain model) vardır. Ancak bu, verileri formumuzda modellemek istediğimiz şekilden genellikle _farklıdır_.

Form modeli, ham kullanıcı girdisini arayüzde göründüğü şekliyle temsil eder. Örneğin, bir formda kullanıcıdan randevu için bir tarih ve bir zaman dilimi seçmesini ayrı girdi alanları olarak isteyebilirsiniz, alan modeliniz bunu tek bir JavaScript `Date` nesnesi olarak temsil etse bile.

```ts
interface AppointmentFormModel {
  name: string; // Appointment owner's name
  date: Date; // Appointment date (carries only date information, time component is unused)
  time: string; // Selected time as a string
}

interface AppointmentDomainModel {
  name: string; // Appointment owner's name
  time: Date; // Appointment time (carries both date and time information)
}
```

Formlar, alan modelini doğrudan yeniden kullanmak yerine, girdi deneyimine uygun bir form modeli kullanmalıdır.

## Form model best practices

### Use specific types

[TypeScript türlerini kullanma](/guide/forms/signals/models#using-typescript-types) bölümünde gösterildiği gibi modelleriniz için her zaman arayüzler veya türler tanımlayın. Açık türler daha iyi IntelliSense sağlar, derleme zamanında hataları yakalar ve formun hangi verileri içerdiğine dair belge görevi görür.

### Initialize all fields

Modelinizdeki her alan için başlangıç değerleri sağlayın:

```ts {prefer, header: 'All fields initialized'}
const taskModel = signal({
  title: '',
  description: '',
  priority: 'medium',
  completed: false,
});
```

```ts {avoid, header: 'Partial initialization'}
const taskModel = signal({
  title: '',
  // Missing description, priority, completed
});
```

Eksik başlangıç değerleri, bu alanların alan ağacında var olmayacağı anlamına gelir ve form etkileşimleri için erişilemez hale gelirler.

### Keep models focused

Her model tek bir formu veya birbiriyle ilişkili tutarlı bir veri setini temsil etmelidir:

```ts {prefer, header: 'Focused on a single purpose'}
const loginModel = signal({
  email: '',
  password: '',
});
```

```ts {avoid, header: 'Mixing unrelated concerns'}
const appModel = signal({
  // Login data
  email: '',
  password: '',
  // User preferences
  theme: 'light',
  language: 'en',
  // Shopping cart
  cartItems: [],
});
```

Farklı ilgi alanları için ayrı modeller, formların anlaşılmasını ve yeniden kullanılmasını kolaylaştırır. Farklı veri setlerini yönetiyorsanız birden fazla form oluşturun.

### Consider validation requirements

Modelleri doğrulamayı göz önünde bulundurarak tasarlayın. Birlikte doğrulanan alanları gruplandırın:

```ts {prefer, header: 'Related fields grouped for comparison'}
// Password fields grouped for comparison
interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

Bu yapı, çapraz alan doğrulamayı (`newPassword` ile `confirmPassword` eşleşmesini kontrol etmek gibi) daha doğal hale getirir.

### Match data types to UI controls

Form modelinizdeki özellikler, arayüz kontrollerinizin beklediği veri türleriyle eşleşmelidir.

Örneğin, bir `size` alanı (6, 12 veya 24'lük paket) ve bir `quantity` alanı olan bir içecek sipariş formunu düşünün. Arayüz, boyut için bir açılır menü (`<select>`) ve miktar için bir sayı girdisi (`<input type="number">`) kullanır.

Boyut seçenekleri sayısal görünse de, `<select>` elemanları dize değerleriyle çalışır, bu nedenle `size` bir dize olarak modellenmelidir. Öte yandan `<input type="number">` sayılarla çalışır, bu nedenle `quantity` bir sayı olarak modellenebilir.

```ts {prefer, header: 'Appropriate data types for the bound UI controls'}
interface BeverageOrderFormModel {
  size: string; // Bound to: <select> (option values: "6", "12", "24")
  quantity: number; // Bound to: <input type="number">
}
```

### Avoid `undefined`

Bir form modeli `undefined` değerleri veya özellikleri içermemelidir. Signal Forms'ta formun yapısı modelin yapısından türetilir ve `undefined`, boş değerli bir alan yerine _bir alanın yokluğunu_ ifade eder. Bu, isteğe bağlı alanlardan da kaçınmanız gerektiği anlamına gelir (örn. `{property?: string}`), çünkü bunlar örtük olarak `undefined`'a izin verir.

Form modelinizde boş değerli bir özelliği temsil etmek için, arayüz kontrolünün "boş" anlamına geldiğini anladığı bir değer kullanın (örn. `<input type="text">` için `""`). Özel bir arayüz kontrolü tasarlıyorsanız, `null` genellikle "boş" anlamını ifade etmek için iyi bir değer olarak çalışır.

```ts {prefer, header: 'Appropriate empty values'}
interface UserFormModel {
  name: string; // Bound to <input type="text">
  birthday: Date | null; // Bound to <input type="date">
}

// Initialize our form with empty values.
form(signal({name: '', birthday: null}));
```

### Avoid models with dynamic structure

Bir form modelinin dinamik yapısı, değerine bağlı olarak şekil değiştirmesi (nesne üzerindeki özelliklerin değişmesi) durumunda söz konusudur. Bu, model türü farklı şekillere sahip değerlere izin verdiğinde gerçekleşir; örneğin farklı özelliklere sahip nesne türlerinin birleşimi veya bir nesne ile ilkel türün birleşimi gibi. Aşağıdaki bölümler, dinamik yapıya sahip modellerin cazip görünebileceği ancak nihayetinde sorunlu olduğu birkaç yaygın senaryoyu inceler.

#### Empty value for a complex object

Formları genellikle mevcut verileri düzenlemek yerine kullanıcılardan yepyeni veriler girmesini istemek için kullanırız. Bunun iyi bir örneği hesap oluşturma formudur. Bunu aşağıdaki form modelini kullanarak modelleyebiliriz.

```ts
interface CreateAccountFormModel {
  name: {
    first: string;
    last: string;
  };
  username: string;
}
```

Formu oluştururken bir ikilemle karşılaşırız: modeldeki başlangıç değeri ne olmalıdır? Kullanıcıdan henüz herhangi bir girdimiz olmadığı için `form<CreateAccountFormModel | null>()` oluşturmak cazip gelebilir.

```ts {avoid, header: 'Using null as empty value for complex object'}
createAccountForm = form<CreateAccountFormModel | null>(signal(/* what goes here, null? */));
```

Ancak, Signal Forms'un _model odaklı_ olduğunu hatırlamak önemlidir. Modelimiz `null` ise ve `null`'ın `name` veya `username` özelliği yoksa, bu formumuzun da bu alt alanlara sahip olmayacağı anlamına gelir. Bunun yerine gerçekten istediğimiz şey, tüm yaprak alanları boş bir değere ayarlanmış bir `CreateAccountFormModel` örneğidir.

```ts {prefer, header: 'Same shape value with empty values for properties'}
createAccountForm = form<CreateAccountFormModel>(
  signal({
    name: {
      first: '',
      last: '',
    },
    username: '',
  }),
);
```

Bu gösterimi kullanarak, ihtiyacımız olan tüm alt alanlar artık mevcuttur ve bunları şablonumuzda `[formField]` direktifi kullanarak bağlayabiliriz.

```html
First: <input [formField]="createAccountForm.name.first" /> Last:
<input [formField]="createAccountForm.name.last" /> Username:
<input [formField]="createAccountForm.username" />
```

#### Fields that are conditionally hidden or unavailable

Formlar her zaman doğrusal değildir. Önceki kullanıcı girdisine dayalı olarak sıklıkla koşullu yollar oluşturmanız gerekir. Bunun bir örneği, kullanıcıya farklı ödeme seçenekleri sunduğumuz bir formdur. Böyle bir formun arayüzünün nasıl görünebileceğini hayal ederek başlayalım.

```html
Name: <input type="text" />

<section>
  <h2>Payment Info</h2>
  <input type="radio" /> Credit Card @if (/* credit card selected */) {
  <section>
    Card Number <input type="text" /> Security Code <input type="text" /> Expiration
    <input type="text" />
  </section>
  }
  <input type="radio" /> Bank Account @if (/* bank account selected */) {
  <section>Account Number <input type="text" /> Routing Number <input type="text" /></section>
  }
</section>
```

Bunu ele almanın en iyi yolu, _tüm_ olası ödeme yöntemleri için alanlar içeren statik yapıya sahip bir form modeli kullanmaktır. Şemamızda, şu anda mevcut olmayan alanları gizleyebilir veya devre dışı bırakabiliriz.

```ts {prefer, header: 'Static structure model'}
interface BillPayFormModel {
  name: string;
  method: {
    type: string;
    card: {
      cardNumber: string;
      securityCode: string;
      expiration: string;
    };
    bank: {
      accountNumber: string;
      routingNumber: string;
    };
  };
}

const billPaySchema = schema<BillPayFormModel>((billPay) => {
  // Hide credit card details when user has selected a method other than credit card.
  hidden(billPay.method.card, ({valueOf}) => valueOf(billPay.method.type) !== 'card');
  // Hide bank account details when user has selected a method other than bank account.
  hidden(billPay.method.bank, ({valueOf}) => valueOf(billPay.method.type) !== 'bank');
});
```

Bu modeli kullanarak, hem `card` hem de `bank` nesneleri formun durumunda her zaman mevcuttur. Kullanıcı ödeme yöntemlerini değiştirdiğinde, yalnızca `type` özelliğini günceleriz. Kart alanlarına girdikleri veriler `card` nesnesinde güvenle saklanır ve geri geçiş yaparlarsa yeniden görüntülenmeye hazırdır.

Buna karşılık, dinamik bir form modeli bu kullanım durumu için başlangıçta iyi bir seçenek gibi görünebilir. Sonuçta, kullanıcı "Kredi Kartı" seçtiyse hesap ve yönlendirme numarası alanlarına ihtiyacımız yoktur. Bunu ayrımcı birleşim olarak modellemek cazip olabilir:

```ts {avoid, header: 'Dynamic structure model'}
interface BillPayFormModel {
  name: string;
  method:
    | {
        type: 'card';
        cardNumber: string;
        securityCode: string;
        expiration: string;
      }
    | {
        type: 'bank';
        accountNumber: string;
        routingNumber: string;
      };
}
```

Ancak, aşağıdaki senaryoda ne olacağını düşünün:

1. Kullanıcı adını ve kredi kartı bilgilerini doldurur
2. Göndermek üzereyken, son anda kolaylık ücretini fark eder.
3. Ücretten kaçınmak için banka hesabı seçeneğine geçer.
4. Banka hesabı bilgilerini girmek üzereyken, ikinci düşünceler yaşar - bilgilerin bir sızıntıda ortaya çıkmasını istemez.
5. Kredi kartı seçeneğine geri döner, ancak az önce girdiği tüm bilgilerin kaybolduğunu fark eder!

Bu, dinamik yapıya sahip form modellerinin bir başka sorununu gösterir: veri kaybına neden olabilirler. Böyle bir model, bir alan gizlendiğinde içindeki bilgilerin bir daha asla gerekmeyeceğini varsayar. Kredi kartı bilgilerini banka bilgileriyle değiştirir ve kredi kartı bilgilerini geri almanın bir yolu yoktur.

#### Exceptions

Statik yapı genellikle tercih edilse de, dinamik yapının gerekli ve desteklendiği belirli senaryolar vardır.

##### Arrays

Diziler en yaygın istisnadır. Formlar genellikle değişken sayıda öğe toplamak zorundadır; telefon numaralarının listesi, katılımcılar veya bir siparişin kalemleri gibi.

```ts
interface SendEmailFormModel {
  subject: string;
  recipientEmails: string[];
}
```

Bu durumda, `recipientEmails` dizisi kullanıcı formla etkileşim kurdukça büyür ve küçülür. Dizinin uzunluğu dinamik olsa da, bireysel öğelerin yapısı tutarlı olmalıdır (her öğe aynı şekle sahip olmalıdır).

##### Fields that are treated atomically by the UI control

Dinamik yapının kabul edilebilir olduğu bir diğer durum, karmaşık bir nesnenin arayüz kontrolü tarafından tekil, atomik bir değer olarak ele alınmasıdır. Yani, kontrol alt alanlarından herhangi birine ayrı ayrı bağlanmaya veya erişmeye çalışmaz. Bu senaryoda, kontrol iç özelliklerini değiştirmek yerine tüm nesneyi bir kerede değiştirerek değeri günceller. Bu senaryoda form yapısı önemsiz olduğundan, bu yapının dinamik olması kabul edilebilir.

Örneğin, bir `location` alanı içeren bir kullanıcı profil formunu düşünün. Konum, bir koordinat nesnesi döndüren karmaşık bir "konum seçici" bileşeni (belki bir harita veya arama önermeli açılır menü) kullanılarak seçilir. Konumun henüz seçilmediği veya kullanıcının konumunu paylaşmamayı tercih ettiği durumda, seçici konumu `null` olarak belirtir.

```ts {prefer, header: 'Dynamic structure is ok when field is treated as atomic'}
interface Location {
  lat: number;
  lng: number;
}

interface UserProfileFormModel {
  username: string;
  // This property has dynamic structure,
  // but that's ok because the location picker treats this field as atomic.
  location: Location | null;
}
```

Şablonda, `location` alanını doğrudan özel kontrolümüze bağlarız:

```html
Username: <input [formField]="userForm.username" /> Location:
<location-picker [formField]="userForm.location"></location-picker>
```

Burada, `<location-picker>` tüm `Location` nesnesini (veya `null`) tüketir ve üretir, ve `userForm.location.lat` veya `userForm.location.lng`'ye erişmez. Bu nedenle, `location` model odaklı formların ilkelerini ihlal etmeden güvenle dinamik bir şekle sahip olabilir.

## Translating between form model and domain model

Form modeli ve alan modeli aynı kavramı farklı şekillerde temsil ettiğinden, bu farklı gösterimler arasında dönüşüm yapmanın bir yoluna ihtiyacımız var. Sistemdeki mevcut verileri bir formda kullanıcıya sunmak istediğimizde, bunları alan modeli gösteriminden form modeli gösterimine dönüştürmemiz gerekir. Tersine, bir kullanıcının değişikliklerini kaydetmek istediğimizde, verileri form modeli gösteriminden alan modeli gösterimine dönüştürmemiz gerekir.

Bir alan modeli ve bir form modelimiz olduğunu ve aralarında dönüşüm yapmak için bazı fonksiyonlar yazdığımızı hayal edelim.

```ts
interface MyDomainModel { ... }

interface MyFormModel { ... }

// Instance of `MyFormModel` populated with empty input (e.g. `''` for string inputs, etc.)
const EMPTY_MY_FORM_MODEL: MyFormModel = { ... };

function domainModelToFormModel(domainModel: MyDomainModel): MyFormModel { ... }

function formModelToDomainModel(formModel: MyFormModel): MyDomainModel { ... }
```

### Domain model to form model

Sistemdeki mevcut bir alan modelini düzenlemek için bir form oluşturduğumuzda, bu alan modelini genellikle form bileşenimize bir `input()` olarak veya bir arka uçtan (örn. resource aracılığıyla) alırız. Her iki durumda da, `linkedSignal` dönüşümümüzü uygulamak için mükemmel bir yol sağlar.

Alan modelini bir `input()` olarak aldığımız durumda, girdi sinyalinden yazılabilir bir form modeli oluşturmak için `linkedSignal` kullanabiliriz.

```ts {prefer, header: 'Use linkedSignal to convert domain model to form model'}
@Component(...)
class MyForm {
  // The domain model to initialize the form with, if not given we start with an empty form.
  readonly domainModel = input<MyDomainModel>();

  private readonly formModel = linkedSignal({
    // Linked signal based on the domain model
    source: this.domainModel,
    // If domain model is defined convert it to a form model, otherwise use an empty form model.
    computation: (domainModel) => domainModel
      ? domainModelToFormModel(domainModel)
      : EMPTY_MY_FORM_MODEL
  });

  protected readonly myForm = form(this.formModel);
}
```

Benzer şekilde, alan modelini bir resource aracılığıyla arka uçtan aldığımızda, `formModel`'imizi oluşturmak için değerine dayalı bir `linkedSignal` oluşturabiliriz. Bu senaryoda, alan modelinin getirilmesi biraz zaman alabilir ve veriler yüklenene kadar formu devre dışı bırakmalıyız.

```ts {prefer, header: 'Disable or hide the form when data is unavailable'}
@Component(...)
class MyForm {
  // Fetch the domain model from the backend.
  readonly domainModelResource: ResourceRef<MyDomainModel | undefined> = httpResource(...);

  private readonly formModel = linkedSignal({
    // Linked signal based on the domain model resource
    source: this.domainModelResource.value,
    // Convert the domain model once it loads, use an empty form model while loading.
    computation: (domainModel) => domainModel
      ? domainModelToFormModel(domainModel)
      : EMPTY_MY_FORM_MODEL
  });

  protected readonly myForm = form(this.formModel, (root) => {
    // Disable the entire form when the resource is loading.
    disabled(root, () => this.domainModelResource.isLoading());
  });
}
```

Yukarıdaki örnekler, form modelinin doğrudan alan modelinden saf bir türetilmesini gösterir. Ancak, bazı durumlarda yeni alan modeli değeri ile önceki alan modeli ve form modeli değerleri arasında daha gelişmiş bir fark (diff) işlemi yapmak isteyebilirsiniz. Bu, `linkedSignal` [önceki durum](/guide/signals/linked-signal#accounting-for-previous-state) özelliğine dayalı olarak uygulanabilir.

### Form model to domain model

Kullanıcının girdisini sisteme geri kaydetmeye hazır olduğumuzda, bunu alan modeli gösterimine dönüştürmemiz gerekir. Bu, genellikle kullanıcı formu gönderdiğinde veya otomatik kaydetme yapan bir form için kullanıcı düzenleme yaptıkça sürekli olarak gerçekleşir.

Gönderim sırasında kaydetmek için, dönüşümü `submit` fonksiyonunda gerçekleştirebiliriz.

```ts {prefer, header: 'Convert form model to domain model on submit'}
@Component(...)
class MyForm {
  private readonly myDataService = inject(MyDataService);

  protected readonly myForm = form<MyFormModel>(...);

  handleSubmit() {
    submit(this.myForm, async () => {
      await this.myDataService.update(formModelToDomainModel(this.myForm.value()));
    });
  };
}
```

Alternatif olarak, form modelini doğrudan sunucuya gönderebilir ve form modelinden alan modeline dönüşümü sunucuda yapabilirsiniz.

Sürekli kaydetme için, alan modelini bir `effect` içinde güncelleyin.

```ts {prefer, header: 'Convert form model to domain model in an effect for auto-saving'}
@Component(...)
class MyForm {
  readonly domainModel = model.required<MyDomainModel>()

  protected readonly myForm = form(...);

  constructor() {
    effect(() => {
      // When the form model changes to a valid value, update the domain model.
      if (this.myForm().valid()) {
        this.domainModel.set(formModelToDomainModel(this.myForm.value()));
      }
    });
  };
}
```

Yukarıdaki örnekler, form modelinden alan modeline saf bir dönüşümü gösterir. Ancak, yalnızca form modeli değerine ek olarak tam form durumunu da dikkate almak tamamen kabul edilebilir. Örneğin, bayt tasarrufu için kullanıcının neyi değiştirdiğine dayalı olarak sunucuya yalnızca kısmi güncellemeler göndermek isteyebiliriz. Bu durumda dönüşüm fonksiyonumuz, tüm form durumunu alacak ve formun değerleri ile kirlilik durumuna dayalı seyrek bir alan modeli döndürecek şekilde tasarlanabilir.

```ts
type Sparse<T> = T extends object ? {
    [P in keyof T]?: Sparse<T[P]>;
} : T;

function formStateToPartialDomainModel(
  formState: FieldState<MyFormModel>
): Sparse<MyDomainModel> { ... }
```
