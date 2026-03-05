# Validating form input

Doğruluk ve bütünlük için kullanıcı girdisini doğrulayarak genel veri kalitesini artırabilirsiniz.
Bu sayfa, hem reaktif hem de şablon odaklı formlarda kullanıcı arayüzünden kullanıcı girdisinin nasıl doğrulanacağını ve yararlı doğrulama mesajlarının nasıl görüntüleneceğini gösterir.

## Validating input in template-driven forms

Şablon odaklı bir forma doğrulama eklemek için, [yerel HTML form doğrulamasıyla](https://developer.mozilla.org/docs/Web/Guide/HTML/HTML5/Constraint_validation) eklediğiniz aynı doğrulama niteliklerini eklersiniz.
Angular, bu nitelikleri çerçevedeki doğrulayıcı fonksiyonlarla eşleştirmek için direktifler kullanır.

Bir form kontrolünün değeri her değiştiğinde, Angular doğrulamayı çalıştırır ve ya `INVALID` durumuyla sonuçlanan bir doğrulama hataları listesi ya da VALID durumuyla sonuçlanan null döndürür.

Daha sonra `ngModel`'i yerel bir şablon değişkenine dışa aktararak kontrolün durumunu inceleyebilirsiniz.
Aşağıdaki örnek, `NgModel`'i `name` adlı bir değişkene dışa aktarır:

<docs-code header="actor-form-template.component.html (name)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" region="name-with-error-msg"/>

Örnekle gösterilen aşağıdaki özelliklere dikkat edin.

- `<input>` öğesi HTML doğrulama niteliklerini taşır: `required` ve `minlength`.
  Ayrıca özel bir doğrulayıcı direktif olan `forbiddenName`'i taşır.
  Daha fazla bilgi için [Özel doğrulayıcılar](#defining-custom-validators) bölümüne bakın.

- `#name="ngModel"`, `NgModel`'i `name` adlı yerel bir değişkene dışa aktarır.
  `NgModel`, altta yatan `FormControl` örneğinin birçok özelliğini yansıtır, böylece bunu şablonda `valid` ve `dirty` gibi kontrol durumlarını kontrol etmek için kullanabilirsiniz.
  Kontrol özelliklerinin tam listesi için [AbstractControl](api/forms/AbstractControl) API referansına bakın.
  - En dıştaki `@if`, bir dizi iç içe mesaj ortaya koyar, ancak yalnızca `name` geçersiz ve kontrol `dirty` veya `touched` ise.

  - Her iç içe `@if`, olası doğrulama hatalarından biri için özel bir mesaj sunabilir.
    `required`, `minlength` ve `forbiddenName` için mesajlar vardır.

HELPFUL: Doğrulayıcının, kullanıcının formu düzenleme fırsatı bulamadan hataları görüntülemesini önlemek için, bir kontrolde `dirty` veya `touched` durumunu kontrol etmelisiniz.

- Kullanıcı izlenen alandaki değeri değiştirdiğinde, kontrol "dirty" olarak işaretlenir
- Kullanıcı form kontrol öğesinden odağı kaldırdığında, kontrol "touched" olarak işaretlenir

## Validating input in reactive forms

Reaktif bir formda doğruluk kaynağı bileşen sınıfıdır.
Şablondaki nitelikler aracılığıyla doğrulayıcılar eklemek yerine, doğrulayıcı fonksiyonları doğrudan bileşen sınıfındaki form kontrol modeline eklersiniz.
Angular daha sonra kontrolün değeri her değiştiğinde bu fonksiyonları çağırır.

### Validator functions

Doğrulayıcı fonksiyonlar senkron veya asenkron olabilir.

| Doğrulayıcı türü        | Ayrıntılar                                                                                                                                                                                                             |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Senkron doğrulayıcılar  | Bir kontrol örneği alan ve hemen ya bir doğrulama hataları kümesi ya da `null` döndüren senkron fonksiyonlar. Bir `FormControl` örneklerken ikinci argüman olarak bunları geçirin.                                     |
| Asenkron doğrulayıcılar | Bir kontrol örneği alan ve daha sonra bir doğrulama hataları kümesi veya `null` yayan bir Promise veya Observable döndüren asenkron fonksiyonlar. Bir `FormControl` örneklerken üçüncü argüman olarak bunları geçirin. |

Performans nedenleriyle, Angular asenkron doğrulayıcıları yalnızca tüm senkron doğrulayıcılar geçtiğinde çalıştırır.
Her biri hatalar ayarlanmadan önce tamamlanmalıdır.

### Built-in validator functions

[Kendi doğrulayıcı fonksiyonlarınızı yazmayı](#defining-custom-validators) seçebilir veya Angular'ın bazı yerleşik doğrulayıcılarını kullanabilirsiniz.

Şablon odaklı formlarda nitelik olarak kullanılabilen aynı yerleşik doğrulayıcılar, `required` ve `minlength` gibi, `Validators` sınıfından fonksiyon olarak kullanılabilir.
Yerleşik doğrulayıcıların tam listesi için [Validators](api/forms/Validators) API referansına bakın.

Aktör formunu reaktif form olarak güncellemek için, aynı yerleşik doğrulayıcılardan bazılarını kullanın -- bu sefer, aşağıdaki örnekte olduğu gibi fonksiyon biçiminde.

<docs-code header="actor-form-reactive.component.ts (validator functions)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" region="form-group"/>

Bu örnekte, `name` kontrolü iki yerleşik doğrulayıcı (`Validators.required` ve `Validators.minLength(4)`) ve bir özel doğrulayıcı (`forbiddenNameValidator`) ayarlar.

Bu doğrulayıcıların tümü senkrondur, bu nedenle ikinci argüman olarak geçirilir.
Fonksiyonları bir dizi olarak geçirerek birden fazla doğrulayıcıyı destekleyebileceğinize dikkat edin.

Bu örnek ayrıca birkaç getter yöntemi ekler.
Reaktif bir formda, herhangi bir form kontrolüne her zaman üst grubundaki `get` yöntemiyle erişebilirsiniz, ancak bazen şablon için kısayol olarak getter'lar tanımlamak yararlıdır.

`name` girdisi için şablona tekrar bakarsanız, şablon odaklı örneğe oldukça benzerdir.

<docs-code header="actor-form-reactive.component.html (name with error msg)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" region="name-with-error-msg"/>

Bu form, şablon odaklı sürümden farklıdır çünkü artık herhangi bir direktif dışa aktarmaz. Bunun yerine, bileşen sınıfında tanımlanan `name` getter'ını kullanır.

`required` niteliğinin hala şablonda mevcut olduğuna dikkat edin. Doğrulama için gerekli olmasa da, erişilebilirlik amacıyla korunmalıdır.

## Defining custom validators

Yerleşik doğrulayıcılar her zaman uygulamanızın tam kullanım durumuna uymaz, bu nedenle bazen özel bir doğrulayıcı oluşturmanız gerekir.

Önceki örnekteki `forbiddenNameValidator` fonksiyonunu düşünün.
Bu fonksiyonun tanımı şöyle görünür.

<docs-code header="forbidden-name.directive.ts (forbiddenNameValidator)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" region="custom-validator"/>

Fonksiyon, _belirli_ bir yasaklı adı tespit etmek için bir düzenli ifade alan ve bir doğrulayıcı fonksiyon döndüren bir fabrikadır.

Bu örnekte, yasaklı ad "bob"dur, bu nedenle doğrulayıcı "bob" içeren herhangi bir aktör adını reddeder.
Başka bir yerde "alice"i veya yapılandıran düzenli ifadenin eşleştiği herhangi bir adı reddedebilir.

`forbiddenNameValidator` fabrikası, yapılandırılmış doğrulayıcı fonksiyonu döndürür.
Bu fonksiyon bir Angular kontrol nesnesi alır ve kontrol değeri geçerliyse _null_ veya bir doğrulama hatası nesnesi döndürür.
Doğrulama hatası nesnesi genellikle adı doğrulama anahtarı olan `'forbiddenName'` ve değeri hata mesajına ekleyebileceğiniz rastgele bir değerler sözlüğü olan `{name}` bir özelliğe sahiptir.

Özel asenkron doğrulayıcılar senkron doğrulayıcılara benzer, ancak bunun yerine daha sonra null veya bir doğrulama hatası nesnesi yayan bir Promise veya observable döndürmelidir.
Bir observable durumunda, observable tamamlanmalıdır; bu noktada form doğrulama için yayılan son değeri kullanır.

### Adding custom validators to reactive forms

Reaktif formlarda, fonksiyonu doğrudan `FormControl`'a geçirerek özel bir doğrulayıcı ekleyin.

<docs-code header="actor-form-reactive.component.ts (validator functions)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" region="custom-validator"/>

### Adding custom validators to template-driven forms

Şablon odaklı formlarda, doğrulayıcı fonksiyonu saran direktifi şablona ekleyin.
Örneğin, karşılık gelen `ForbiddenValidatorDirective`, `forbiddenNameValidator` etrafında bir sarmalayıcı görevi görür.

Angular, aşağıdaki örnekte gösterildiği gibi direktifin kendisini `NG_VALIDATORS` sağlayıcısına kaydetmesi nedeniyle doğrulama sürecindeki rolünü tanır.
`NG_VALIDATORS`, genişletilebilir bir doğrulayıcılar koleksiyonuna sahip önceden tanımlanmış bir sağlayıcıdır.

<docs-code header="forbidden-name.directive.ts (providers)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" region="directive-providers"/>

Direktif sınıfı daha sonra `Validator` arayüzünü uygular, böylece Angular formlarıyla kolayca entegre olabilir.
Hepsinin nasıl bir araya geldiğini anlamanıza yardımcı olmak için direktifin geri kalanı burada.

<docs-code header="forbidden-name.directive.ts (directive)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" region="directive"/>

`ForbiddenValidatorDirective` hazır olduğunda, etkinleştirmek için seçicisini `appForbiddenName`'i herhangi bir girdi öğesine ekleyebilirsiniz.
Örneğin:

<docs-code header="actor-form-template.component.html (forbidden-name-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" region="name-input"/>

HELPFUL: Özel doğrulama direktifinin `useClass` yerine `useExisting` ile örneklendiğine dikkat edin.
Kayıtlı doğrulayıcı, `forbiddenName` özelliği "bob"a bağlı formda yer alan `ForbiddenValidatorDirective`'in _bu örneği_ olmalıdır.

`useExisting` yerine `useClass` kullanırsanız, `forbiddenName` özelliğine sahip olmayan yeni bir sınıf örneği kaydedersiniz.

## Control status CSS classes

Angular, kontrol özelliklerinin birçoğunu otomatik olarak form kontrol öğesine CSS sınıfları olarak yansıtır.
Form kontrol öğelerini formun durumuna göre stilize etmek için bu sınıfları kullanın.
Şu anda aşağıdaki sınıflar desteklenmektedir.

- `.ng-valid`
- `.ng-invalid`
- `.ng-pending`
- `.ng-pristine`
- `.ng-dirty`
- `.ng-untouched`
- `.ng-touched`
- `.ng-submitted` \(yalnızca kapsayan form öğesi\)

Aşağıdaki örnekte, aktör formu her form kontrolünün kenar rengini ayarlamak için `.ng-valid` ve `.ng-invalid` sınıflarını kullanır.

<docs-code header="forms.css (status classes)" path="adev/src/content/examples/form-validation/src/assets/forms.css"/>

## Cross-field validation

Çapraz alan doğrulayıcı, bir formdaki farklı alanların değerlerini karşılaştıran ve bunları kombinasyon halinde kabul eden veya reddeden bir [özel doğrulayıcıdır](#defining-custom-validators 'Read about custom validators').
Örneğin, birbirine uyumsuz seçenekler sunan bir formunuz olabilir, böylece kullanıcı A veya B'yi seçebilir, ancak ikisini birden seçemez.
Bazı alan değerleri de diğerlerine bağlı olabilir; bir kullanıcının B'yi yalnızca A da seçiliyse seçmesine izin verilebilir.

Aşağıdaki çapraz doğrulama örnekleri şunları nasıl yapacağınızı gösterir:

- İki kardeş kontrolün değerlerine dayalı olarak reaktif veya şablon tabanlı form girdisini doğrulama,
- Kullanıcı formla etkileşime girdikten ve doğrulama başarısız olduktan sonra açıklayıcı bir hata mesajı gösterme.

Örnekler, aktörlerin Aktör Formunu doldurarak rollerinde aynı adı yeniden kullanmamalarını sağlamak için çapraz doğrulama kullanır.
Doğrulayıcılar bunu aktör adları ve rollerin eşleşmediğini kontrol ederek yapar.

### Adding cross-validation to reactive forms

Formun yapısı aşağıdaki gibidir:

```ts
const actorForm = new FormGroup({
  'name': new FormControl(),
  'role': new FormControl(),
  'skill': new FormControl(),
});
```

`name` ve `role`'ün kardeş kontroller olduğuna dikkat edin.
Her iki kontrolü tek bir özel doğrulayıcıda değerlendirmek için, doğrulamayı ortak bir ata kontrolde gerçekleştirmelisiniz: `FormGroup`.
Alt kontrollerini sorgulamak ve değerlerini karşılaştırmak için `FormGroup`'u sorgularsınız.

Doğrulayıcıyı `FormGroup`'a eklemek için, oluşturma sırasında yeni doğrulayıcıyı ikinci argüman olarak geçirin.

```ts
const actorForm = new FormGroup(
  {
    'name': new FormControl(),
    'role': new FormControl(),
    'skill': new FormControl(),
  },
  {validators: unambiguousRoleValidator},
);
```

Doğrulayıcı kodu aşağıdaki gibidir.

<docs-code header="unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" region="cross-validation-validator"/>

`unambiguousRoleValidator` doğrulayıcısı, `ValidatorFn` arayüzünü uygular.
Bir Angular kontrol nesnesini argüman olarak alır ve form geçerliyse null, aksi takdirde `ValidationErrors` döndürür.

Doğrulayıcı, `FormGroup`'un [get](api/forms/AbstractControl#get) yöntemini çağırarak alt kontrolleri alır, ardından `name` ve `role` kontrollerinin değerlerini karşılaştırır.

Değerler eşleşmiyorsa, rol açıktır, her ikisi de geçerlidir ve doğrulayıcı null döndürür.
Eşleşirlerse, aktörün rolü belirsizdir ve doğrulayıcı bir hata nesnesi döndürerek formu geçersiz olarak işaretlemelidir.

Daha iyi kullanıcı deneyimi sağlamak için, form geçersiz olduğunda şablon uygun bir hata mesajı gösterir.

<docs-code header="actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" region="cross-validation-error-message"/>

Bu `@if`, `FormGroup`'ta `unambiguousRoleValidator` doğrulayıcısı tarafından döndürülen çapraz doğrulama hatası varsa hatayı görüntüler, ancak yalnızca kullanıcı [formla etkileşimi tamamladıysa](#control-status-css-classes).

### Adding cross-validation to template-driven forms

Şablon odaklı bir form için, doğrulayıcı fonksiyonunu sarmak üzere bir direktif oluşturmanız gerekir.
Aşağıdaki örnekte gösterildiği gibi, [`NG_VALIDATORS` token'ını](/api/forms/NG_VALIDATORS) kullanarak bu direktifi doğrulayıcı olarak sağlarsınız.

<docs-code header="unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" region="cross-validation-directive"/>

Yeni direktifi HTML şablonuna eklemeniz gerekir.
Doğrulayıcının formda en üst düzeyde kaydedilmesi gerektiğinden, aşağıdaki şablon direktifi `form` etiketine yerleştirir.

<docs-code header="actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" region="cross-validation-register-validator"/>

Daha iyi kullanıcı deneyimi sağlamak için, form geçersiz olduğunda uygun bir hata mesajı görünür.

<docs-code header="actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" region="cross-validation-error-message"/>

Bu, hem şablon odaklı hem de reaktif formlarda aynıdır.

## Creating asynchronous validators

Asenkron doğrulayıcılar, `AsyncValidatorFn` ve `AsyncValidator` arayüzlerini uygular.
Bunlar senkron karşılıklarına çok benzer, ancak aşağıdaki farklılıklara sahiptir.

- `validate()` fonksiyonları bir Promise veya observable döndürmelidir,
- Döndürülen observable sonlu olmalıdır, yani bir noktada tamamlanmalıdır.
  Sonsuz bir observable'ı sonlu birine dönüştürmek için, observable'ı `first`, `last`, `take` veya `takeUntil` gibi bir filtreleme operatöründen geçirin.

Asenkron doğrulama, senkron doğrulamadan sonra gerçekleşir ve yalnızca senkron doğrulama başarılı olduğunda çalıştırılır.
Bu kontrol, daha temel doğrulama yöntemleri zaten geçersiz girdi bulmuşsa formların potansiyel olarak pahalı asenkron doğrulama süreçlerini \(HTTP isteği gibi\) atlamasına olanak tanır.

Asenkron doğrulama başladıktan sonra, form kontrolü `pending` durumuna girer.
Kontrolün `pending` özelliğini inceleyin ve devam eden doğrulama işlemi hakkında görsel geri bildirim vermek için kullanın.

Yaygın bir kullanıcı arayüzü kalıbı, asenkron doğrulama yapılırken bir döndürücü göstermektir.
Aşağıdaki örnek, bunu şablon odaklı bir formda nasıl gerçekleştireceğinizi gösterir.

```angular-html
<input [(ngModel)]="name" #model="ngModel" appSomeAsyncValidator />

@if (model.pending) {
  <app-spinner />
}
```

### Implementing a custom async validator

Aşağıdaki örnekte, bir asenkron doğrulayıcı aktörlerin henüz alınmamış bir role atanmasını sağlar.
Yeni aktörler sürekli seçmelere katılıyor ve eski aktörler emekli oluyor, bu nedenle mevcut rollerin listesi önceden alınamaz.
Olası rol girişini doğrulamak için, doğrulayıcı şu anda atanmış tüm aktörlerin merkezi bir veritabanına danışmak üzere asenkron bir işlem başlatmalıdır.

Aşağıdaki kod, `AsyncValidator` arayüzünü uygulayan `UniqueRoleValidator` doğrulayıcı sınıfını oluşturur.

<docs-code header="role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" region="async-validator"/>

`actorsService` özelliği, aşağıdaki arayüzü tanımlayan `ActorsService` token'ının bir örneğiyle başlatılır.

```ts
interface ActorsService {
  isRoleTaken: (role: string) => Observable<boolean>;
}
```

Gerçek bir uygulamada, `ActorsService` rolün mevcut olup olmadığını kontrol etmek için aktör veritabanına bir HTTP isteği yapmaktan sorumlu olacaktır.
Doğrulayıcının bakış açısından, hizmetin gerçek uygulaması önemli değildir, bu nedenle örnek yalnızca `ActorsService` arayüzüne karşı kod yazabilir.

Doğrulama başladığında, `UniqueRoleValidator` mevcut kontrol değeriyle `ActorsService` `isRoleTaken()` yöntemine delege eder.
Bu noktada kontrol `pending` olarak işaretlenir ve `validate()` yönteminden döndürülen observable zinciri tamamlanana kadar bu durumda kalır.

`isRoleTaken()` yöntemi, rolün mevcut olup olmadığını kontrol eden bir HTTP isteği gönderir ve sonuç olarak `Observable<boolean>` döndürür.
`validate()` yöntemi, yanıtı `map` operatörü aracılığıyla doğrulama sonucuna dönüştürür.

Yöntem daha sonra, herhangi bir doğrulayıcı gibi, form geçerliyse `null` döndürür, geçerli değilse `ValidationErrors` döndürür.
Bu doğrulayıcı, `catchError` operatörüyle olası hataları yönetir.
Bu durumda, doğrulayıcı `isRoleTaken()` hatasını başarılı bir doğrulama olarak ele alır, çünkü bir doğrulama isteğinin başarısız olması rolün geçersiz olduğu anlamına gelmez.
Hatayı farklı şekilde yönetebilir ve bunun yerine `ValidationError` nesnesini döndürebilirsiniz.

Bir süre sonra, observable zinciri tamamlanır ve asenkron doğrulama biter.
`pending` bayrağı `false` olarak ayarlanır ve formun geçerliliği güncellenir.

### Adding async validators to reactive forms

Reaktif formlarda asenkron doğrulayıcı kullanmak için, doğrulayıcıyı bileşen sınıfının bir özelliğine enjekte ederek başlayın.

<docs-code header="actor-form-reactive.component.2.ts" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" region="async-validator-inject"/>

Ardından, doğrulayıcı fonksiyonu doğrudan `FormControl`'a geçirerek uygulayın.

Aşağıdaki örnekte, `UniqueRoleValidator`'ın `validate` fonksiyonu, kontrolün `asyncValidators` seçeneğine geçirilerek ve `ActorFormReactiveComponent`'e enjekte edilen `UniqueRoleValidator` örneğine bağlanarak `roleControl`'a uygulanır.
`asyncValidators`'ın değeri tek bir asenkron doğrulayıcı fonksiyon veya bir fonksiyonlar dizisi olabilir.
`FormControl` seçenekleri hakkında daha fazla bilgi edinmek için [AbstractControlOptions](api/forms/AbstractControlOptions) API referansına bakın.

<docs-code header="actor-form-reactive.component.2.ts" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" region="async-validator-usage"/>

### Adding async validators to template-driven forms

Şablon odaklı formlarda asenkron doğrulayıcı kullanmak için, yeni bir direktif oluşturun ve üzerinde `NG_ASYNC_VALIDATORS` sağlayıcısını kaydedin.

Aşağıdaki örnekte, direktif gerçek doğrulama mantığını içeren `UniqueRoleValidator` sınıfını enjekte eder ve doğrulama yapılması gerektiğinde Angular tarafından tetiklenen `validate` fonksiyonunda çağırır.

<docs-code header="role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" region="async-validator-directive"/>

Ardından, senkron doğrulayıcılarda olduğu gibi, etkinleştirmek için direktifin seçicisini bir girdiye ekleyin.

<docs-code header="actor-form-template.component.html (unique-unambiguous-role-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" region="role-input"/>

### Optimizing performance of async validators

Varsayılan olarak, tüm doğrulayıcılar her form değeri değişikliğinden sonra çalışır.
Senkron doğrulayıcılarda, bu genellikle uygulama performansı üzerinde belirgin bir etkiye sahip değildir.
Ancak asenkron doğrulayıcılar yaygın olarak kontrolü doğrulamak için bir tür HTTP isteği yapar.
Her tuşa basıştan sonra bir HTTP isteği göndermek arka uç API'si üzerinde baskı oluşturabilir ve mümkünse bundan kaçınılmalıdır.

`updateOn` özelliğini `change` (varsayılan) yerine `submit` veya `blur` olarak değiştirerek form geçerliliği güncellemesini geciktirebilirsiniz.

Şablon odaklı formlarda, özelliği şablonda ayarlayın.

```angular-html
<input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}" />
```

Reaktif formlarda, özelliği `FormControl` örneğinde ayarlayın.

```ts
new FormControl('', {updateOn: 'blur'});
```

## Interaction with native HTML form validation

Angular varsayılan olarak kapsayan `<form>`'a `novalidate` niteliği ekleyerek [yerel HTML form doğrulamasını](https://developer.mozilla.org/docs/Web/Guide/HTML/Constraint_validation) devre dışı bırakır ve bu nitelikleri çerçevedeki doğrulayıcı fonksiyonlarla eşleştirmek için direktifler kullanır.
Angular tabanlı doğrulamayla **birlikte** yerel doğrulamayı kullanmak istiyorsanız, `ngNativeValidate` direktifiyle yeniden etkinleştirebilirsiniz.
Ayrıntılar için [API belgelerine](api/forms/NgForm#native-dom-validation-ui) bakın.
