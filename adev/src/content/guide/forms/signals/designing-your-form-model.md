# Form modelinizi tasarlama

Signal Forms, model odaklı bir yaklaşım kullanır ve formun durumunu ile yapısını doğrudan sağladığınız modelden türetir. Tüm formun temeli olarak hizmet ettiğinden, iyi tasarlanmış bir form modeli ile başlamak önemlidir. Bu kılavuz, form modelleri tasarlamak için en iyi uygulamaları inceler.

## Form modeli ve alan modeli karşılaştırması

Formlar, kullanıcı girdisi toplamak için kullanılır. Uygulamanızda muhtemelen bu girdiyi iş mantığı veya depolama için optimize edilmiş bir şekilde temsil eden bir alan modeli (domain model) vardır. Ancak bu, verileri formumuzda modellemek istediğimiz şekilden genellikle _farklıdır_.

Form modeli, ham kullanıcı girdisini arayüzde göründüğü şekliyle temsil eder. Örneğin, bir formda kullanıcıdan randevu için bir tarih ve bir zaman dilimi seçmesini ayrı girdi alanları olarak isteyebilirsiniz, alan modeliniz bunu tek bir JavaScript `Date` nesnesi olarak temsil etse bile.

```ts
interface AppointmentFormModel {
  name: string; // Randevu sahibinin adı
  date: Date; // Randevu tarihi (yalnızca tarih bilgisi taşır, saat bileşeni kullanılmaz)
  time: string; // Seçilen saat, dize olarak
}

interface AppointmentDomainModel {
  name: string; // Randevu sahibinin adı
  time: Date; // Randevu saati (hem tarih hem saat bilgisi taşır)
}
```

Formlar, alan modelini doğrudan yeniden kullanmak yerine, girdi deneyimine uygun bir form modeli kullanmalıdır.

## Form modeli en iyi uygulamaları

### Belirli türler kullanın

[TypeScript türlerini kullanma](/guide/forms/signals/models#typescript-türlerini-kullanma) bölümünde gösterildiği gibi modelleriniz için her zaman arayüzler veya türler tanımlayın. Açık türler daha iyi IntelliSense sağlar, derleme zamanında hataları yakalar ve formun hangi verileri içerdiğine dair belge görevi görür.

### Tüm alanları başlatın

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
  // Eksik: description, priority, completed
});
```

Eksik başlangıç değerleri, bu alanların alan ağacında var olmayacağı anlamına gelir ve form etkileşimleri için erişilemez hale gelirler.

### Modelleri odaklı tutun

Her model tek bir formu veya birbiriyle ilişkili tutarlı bir veri setini temsil etmelidir:

```ts {prefer, header: 'Focused on a single purpose'}
const loginModel = signal({
  email: '',
  password: '',
});
```

```ts {avoid, header: 'Mixing unrelated concerns'}
const appModel = signal({
  // Giriş verileri
  email: '',
  password: '',
  // Kullanıcı tercihleri
  theme: 'light',
  language: 'en',
  // Alışveriş sepeti
  cartItems: [],
});
```

Farklı ilgi alanları için ayrı modeller, formların anlaşılmasını ve yeniden kullanılmasını kolaylaştırır. Farklı veri setlerini yönetiyorsanız birden fazla form oluşturun.

### Doğrulama gereksinimlerini göz önünde bulundurun

Modelleri doğrulamayı göz önünde bulundurarak tasarlayın. Birlikte doğrulanan alanları gruplandırın:

```ts {prefer, header: 'Related fields grouped for comparison'}
// Karşılaştırma için gruplandırılmış şifre alanları
interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

Bu yapı, çapraz alan doğrulamayı (`newPassword` ile `confirmPassword` eşleşmesini kontrol etmek gibi) daha doğal hale getirir.

### Veri türlerini arayüz kontrolleriyle eşleştirin

Form modelinizdeki özellikler, arayüz kontrollerinizin beklediği veri türleriyle eşleşmelidir.

Örneğin, bir `size` alanı (6, 12 veya 24'lük paket) ve bir `quantity` alanı olan bir içecek sipariş formunu düşünün. Arayüz, boyut için bir açılır menü (`<select>`) ve miktar için bir sayı girdisi (`<input type="number">`) kullanır.

Boyut seçenekleri sayısal görünse de, `<select>` elemanları dize değerleriyle çalışır, bu nedenle `size` bir dize olarak modellenmelidir. Öte yandan `<input type="number">` sayılarla çalışır, bu nedenle `quantity` bir sayı olarak modellenebilir.

```ts {prefer, header: 'Appropriate data types for the bound UI controls'}
interface BeverageOrderFormModel {
  size: string; // Bağlı olduğu: <select> (seçenek değerleri: "6", "12", "24")
  quantity: number; // Bağlı olduğu: <input type="number">
}
```

### `undefined` kullanmaktan kaçının

Bir form modeli `undefined` değerleri veya özellikleri içermemelidir. Signal Forms'ta formun yapısı modelin yapısından türetilir ve `undefined`, boş değerli bir alan yerine _bir alanın yokluğunu_ ifade eder. Bu, isteğe bağlı alanlardan da kaçınmanız gerektiği anlamına gelir (örn. `{property?: string}`), çünkü bunlar örtük olarak `undefined`'a izin verir.

Form modelinizde boş değerli bir özelliği temsil etmek için, arayüz kontrolünün "boş" anlamına geldiğini anladığı bir değer kullanın (örn. `<input type="text">` için `""`). Özel bir arayüz kontrolü tasarlıyorsanız, `null` genellikle "boş" anlamını ifade etmek için iyi bir değer olarak çalışır.

```ts {prefer, header: 'Appropriate empty values'}
interface UserFormModel {
  name: string; // <input type="text"> ile bağlı
  birthday: Date | null; // <input type="date"> ile bağlı
}

// Formumuzu boş değerlerle başlat.
form(signal({name: '', birthday: null}));
```

### Dinamik yapıya sahip modellerden kaçının

Bir form modelinin dinamik yapısı, değerine bağlı olarak şekil değiştirmesi (nesne üzerindeki özelliklerin değişmesi) durumunda söz konusudur. Bu, model türü farklı şekillere sahip değerlere izin verdiğinde gerçekleşir; örneğin farklı özelliklere sahip nesne türlerinin birleşimi veya bir nesne ile ilkel türün birleşimi gibi. Aşağıdaki bölümler, dinamik yapıya sahip modellerin cazip görünebileceği ancak nihayetinde sorunlu olduğu birkaç yaygın senaryoyu inceler.

#### Karmaşık bir nesne için boş değer

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

#### Koşullu olarak gizlenen veya kullanılamayan alanlar

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
  // Kullanıcı kredi kartı dışında bir yöntem seçtiğinde kredi kartı ayrıntılarını gizle.
  hidden(billPay.method.card, ({valueOf}) => valueOf(billPay.method.type) !== 'card');
  // Kullanıcı banka hesabı dışında bir yöntem seçtiğinde banka hesabı ayrıntılarını gizle.
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

#### İstisnalar

Statik yapı genellikle tercih edilse de, dinamik yapının gerekli ve desteklendiği belirli senaryolar vardır.

##### Diziler

Diziler en yaygın istisnadır. Formlar genellikle değişken sayıda öğe toplamak zorundadır; telefon numaralarının listesi, katılımcılar veya bir siparişin kalemleri gibi.

```ts
interface SendEmailFormModel {
  subject: string;
  recipientEmails: string[];
}
```

Bu durumda, `recipientEmails` dizisi kullanıcı formla etkileşim kurdukça büyür ve küçülür. Dizinin uzunluğu dinamik olsa da, bireysel öğelerin yapısı tutarlı olmalıdır (her öğe aynı şekle sahip olmalıdır).

##### Arayüz kontrolü tarafından atomik olarak ele alınan alanlar

Dinamik yapının kabul edilebilir olduğu bir diğer durum, karmaşık bir nesnenin arayüz kontrolü tarafından tekil, atomik bir değer olarak ele alınmasıdır. Yani, kontrol alt alanlarından herhangi birine ayrı ayrı bağlanmaya veya erişmeye çalışmaz. Bu senaryoda, kontrol iç özelliklerini değiştirmek yerine tüm nesneyi bir kerede değiştirerek değeri günceller. Bu senaryoda form yapısı önemsiz olduğundan, bu yapının dinamik olması kabul edilebilir.

Örneğin, bir `location` alanı içeren bir kullanıcı profil formunu düşünün. Konum, bir koordinat nesnesi döndüren karmaşık bir "konum seçici" bileşeni (belki bir harita veya arama önermeli açılır menü) kullanılarak seçilir. Konumun henüz seçilmediği veya kullanıcının konumunu paylaşmamayı tercih ettiği durumda, seçici konumu `null` olarak belirtir.

```ts {prefer, header: 'Dynamic structure is ok when field is treated as atomic'}
interface Location {
  lat: number;
  lng: number;
}

interface UserProfileFormModel {
  username: string;
  // Bu özellik dinamik yapıya sahip,
  // ancak konum seçici bu alanı atomik olarak ele aldığı için sorun yok.
  location: Location | null;
}
```

Şablonda, `location` alanını doğrudan özel kontrolümüze bağlarız:

```html
Username: <input [formField]="userForm.username" /> Location:
<location-picker [formField]="userForm.location"></location-picker>
```

Burada, `<location-picker>` tüm `Location` nesnesini (veya `null`) tüketir ve üretir, ve `userForm.location.lat` veya `userForm.location.lng`'ye erişmez. Bu nedenle, `location` model odaklı formların ilkelerini ihlal etmeden güvenle dinamik bir şekle sahip olabilir.

## Form modeli ve alan modeli arasında dönüşüm

Form modeli ve alan modeli aynı kavramı farklı şekillerde temsil ettiğinden, bu farklı gösterimler arasında dönüşüm yapmanın bir yoluna ihtiyacımız var. Sistemdeki mevcut verileri bir formda kullanıcıya sunmak istediğimizde, bunları alan modeli gösteriminden form modeli gösterimine dönüştürmemiz gerekir. Tersine, bir kullanıcının değişikliklerini kaydetmek istediğimizde, verileri form modeli gösteriminden alan modeli gösterimine dönüştürmemiz gerekir.

Bir alan modeli ve bir form modelimiz olduğunu ve aralarında dönüşüm yapmak için bazı fonksiyonlar yazdığımızı hayal edelim.

```ts
interface MyDomainModel { ... }

interface MyFormModel { ... }

// Boş girdilerle doldurulmuş `MyFormModel` örneği (ör. string girdiler için `''`, vb.)
const EMPTY_MY_FORM_MODEL: MyFormModel = { ... };

function domainModelToFormModel(domainModel: MyDomainModel): MyFormModel { ... }

function formModelToDomainModel(formModel: MyFormModel): MyDomainModel { ... }
```

### Alan modelinden form modeline

Sistemdeki mevcut bir alan modelini düzenlemek için bir form oluşturduğumuzda, bu alan modelini genellikle form bileşenimize bir `input()` olarak veya bir arka uçtan (örn. resource aracılığıyla) alırız. Her iki durumda da, `linkedSignal` dönüşümümüzü uygulamak için mükemmel bir yol sağlar.

Alan modelini bir `input()` olarak aldığımız durumda, girdi sinyalinden yazılabilir bir form modeli oluşturmak için `linkedSignal` kullanabiliriz.

```ts {prefer, header: 'Use linkedSignal to convert domain model to form model'}
@Component(...)
class MyForm {
  // Formu başlatmak için kullanılacak alan modeli, verilmezse boş bir formla başlarız.
  readonly domainModel = input<MyDomainModel>();

  private readonly formModel = linkedSignal({
    // Alan modeline dayalı bağlı sinyal
    source: this.domainModel,
    // Alan modeli tanımlıysa form modeline dönüştür, değilse boş form modeli kullan.
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
  // Alan modelini arka uçtan getir.
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

Yukarıdaki örnekler, form modelinin doğrudan alan modelinden saf bir türetilmesini gösterir. Ancak, bazı durumlarda yeni alan modeli değeri ile önceki alan modeli ve form modeli değerleri arasında daha gelişmiş bir fark (diff) işlemi yapmak isteyebilirsiniz. Bu, `linkedSignal` [önceki durum](/guide/signals/linked-signal#önceki-durumu-dikkate-alma) özelliğine dayalı olarak uygulanabilir.

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
