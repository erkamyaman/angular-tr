# Testing Utility APIs

NOTE: Bu kılavuz Vitest için güncellenirken, yardımcı API'lerin bazı açıklamaları ve örnekleri şu anda Karma/Jasmine bağlamında sunulmaktadır. Uygulanabilir yerlerde Vitest eşdeğerlerini ve güncellenmiş rehberliği sağlamak için aktif olarak çalışıyoruz.

Bu sayfa en kullanışlı Angular test özelliklerini açıklar.

Angular test araçları `TestBed`, `ComponentFixture` ve test ortamını kontrol eden bir avuç fonksiyon içerir.
[`TestBed`](#testbed-class-summary) ve [`ComponentFixture`](#the-componentfixture) sınıfları ayrı ayrı ele alınmaktadır.

İşte bağımsız fonksiyonların olası kullanım sırasına göre bir özeti:

| Fonksiyon    | Ayrıntılar                                                                                                                                                                                                                                                             |
| :----------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`inject`]   | Mevcut `TestBed` enjektöründen bir veya daha fazla servisi bir test fonksiyonuna enjekte eder. Bileşenin kendisi tarafından sağlanan bir servisi enjekte edemez. [debugElement.injector](guide/testing/components-scenarios#get-injected-services) tartışmasına bakın. |
| `getTestBed` | `TestBed`'in mevcut örneğini alır. Genellikle gereksizdir çünkü `TestBed` sınıfının statik sınıf metotları genellikle yeterlidir. `TestBed` örneği, statik metotlar olarak mevcut olmayan nadiren kullanılan birkaç üyeyi ortaya çıkarır.                              |

Karmaşık asenkron senaryoları ele almak veya eski Zone.js tabanlı uygulamaları test etmek için [Zone.js Test Araçları](guide/testing/zone-js-testing-utilities) kılavuzuna bakın.

## `TestBed` class summary

`TestBed` sınıfı, temel Angular test araçlarından biridir.
API'si oldukça geniştir ve onu parça parça keşfedene kadar bunaltıcı olabilir.
Tam API'yi kavramaya çalışmadan önce temelleri almak için bu kılavuzun ilk bölümünü okuyun.

`configureTestingModule`'a aktarılan modül tanımı, `@NgModule` meta veri özelliklerinin bir alt kümesidir.

```ts
type TestModuleMetadata = {
  providers?: any[];
  declarations?: any[];
  imports?: any[];
  schemas?: Array<SchemaMetadata | any[]>;
};
```

Her geçersiz kılma metodu, `T`'nin metoda uygun meta veri türü olduğu, yani bir `@NgModule`, `@Component`, `@Directive` veya `@Pipe` parametresi olan bir `MetadataOverride<T>` alır.

```ts
type MetadataOverride<T> = {
  add?: Partial<T>;
  remove?: Partial<T>;
  set?: Partial<T>;
};
```

`TestBed` API'si, `TestBed`'in _global_ bir örneğini güncelleyen veya referans alan statik sınıf metotlarından oluşur.

Dahili olarak, tüm statik metotlar, `getTestBed()` fonksiyonu tarafından da döndürülen mevcut çalışma zamanı `TestBed` örneğinin metotlarını kapsar.

Her bireysel testten önce yeni bir başlangıç sağlamak için `TestBed` metotlarını bir `beforeEach()` _içinde_ çağırın.

İşte olası kullanım sırasına göre en önemli statik metotlar.

| Metotlar                 | Ayrıntılar                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configureTestingModule` | Test shim'leri [başlangıç test ortamını](guide/testing) ve her test yazarının ihtiyaç duyduğu temel bildirimler ve bazı Angular servis yedekleri ile yapılandırılmış varsayılan bir test modülü oluşturur. <br /> Belirli bir test kümesi için test modülü yapılandırmasını imports, declarations \(bileşenler, yönergeler ve pipe'lar\) ve providers ekleyip kaldırarak iyileştirmek için `configureTestingModule` çağırın. |
| `compileComponents`      | Yapılandırmayı tamamladıktan sonra test modülünü asenkron olarak derleyin. Test modülü bileşenlerinden _herhangi birinin_ asenkron olarak yüklenen kaynakları (ör. @defer blokları) varsa bu metodu **çağırmalısınız**. <br /> `compileComponents` çağrıldıktan sonra, `TestBed` yapılandırması mevcut spesifikasyonun süresi boyunca dondurulur.                                                                            |
| `createComponent<T>`     | Mevcut `TestBed` yapılandırmasına dayalı olarak `T` tipinde bir bileşen örneği oluşturun. `createComponent` çağrıldıktan sonra, `TestBed` yapılandırması mevcut spesifikasyonun süresi boyunca dondurulur.                                                                                                                                                                                                                   |
| `overrideComponent`      | Bir iç modülde derinlere gömülü olabilecek verilen bileşen sınıfı için meta verileri değiştirin.                                                                                                                                                                                                                                                                                                                             |
| `overrideDirective`      | Bir iç modülde derinlere gömülü olabilecek verilen yönerge sınıfı için meta verileri değiştirin.                                                                                                                                                                                                                                                                                                                             |
| `overridePipe`           | Bir iç modülde derinlere gömülü olabilecek verilen pipe sınıfı için meta verileri değiştirin.                                                                                                                                                                                                                                                                                                                                |
| `overrideModule`         | Verilen `NgModule` için meta verileri değiştirin. Modüllerin diğer modülleri içe aktarabileceğini hatırlayın. `overrideModule` metodu, bu iç modüllerden birini değiştirmek için mevcut test modülünün derinlerine ulaşabilir.                                                                                                                                                                                               |

|
`inject` | Mevcut `TestBed` enjektöründen bir servis alın. `inject` fonksiyonu genellikle bu amaç için yeterlidir. Ancak servisi sağlayamazsa `inject` bir hata fırlatır. <br /> Servis isteğe bağlı ise? <br /> `TestBed.inject()` metodu, Angular sağlayıcıyı bulamazsa döndürülecek nesne olan isteğe bağlı ikinci bir parametre alır \(bu örnekte `null`\): `expect(TestBed.inject(NotProvided, null)).toBeNull();` `TestBed.inject` çağrıldıktan sonra, `TestBed` yapılandırması mevcut spesifikasyonun süresi boyunca dondurulur. |
|
`initTestEnvironment` | Tüm test çalıştırması için test ortamını başlatın. <br /> Test shim'leri bunu sizin için çağırır, bu nedenle kendiniz çağırmanız için nadiren bir neden vardır. <br /> Bu metodu _tam olarak bir kez_ çağırın. Bir test çalıştırmasının ortasında bu varsayılanı değiştirmek için önce `resetTestEnvironment` çağırın. <br /> Angular derleyici fabrikasını, bir `PlatformRef`'i ve varsayılan Angular test modülünü belirtin. Tarayıcı olmayan platformlar için alternatifler `@angular/platform-<platform_name>/testing/<platform_name>` genel biçiminde mevcuttur. |
| `resetTestEnvironment` | Varsayılan test modülü dahil olmak üzere başlangıç test ortamını sıfırlayın. |

Statik `TestBed` _sınıf_ metotları tarafından kapsanmayan birkaç `TestBed` örnek metodu vardır.
Bunlara nadiren ihtiyaç duyulur.

## The `ComponentFixture`

`TestBed.createComponent<T>`, `T` bileşeninin bir örneğini oluşturur ve o bileşen için güçlü tipli bir `ComponentFixture` döndürür.

`ComponentFixture` özellikleri ve metotları, bileşene, DOM temsiline ve Angular ortamının yönlerine erişim sağlar.

### `ComponentFixture` properties

İşte test yazarları için olası kullanım sırasına göre en önemli özellikler.

| Özellikler          | Ayrıntılar                                                                                                                                                                                                                                                  |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `componentInstance` | `TestBed.createComponent` tarafından oluşturulan bileşen sınıfının örneği.                                                                                                                                                                                  |
| `debugElement`      | Bileşenin kök öğesiyle ilişkili `DebugElement`. <br /> `debugElement`, test ve hata ayıklama sırasında bileşen ve DOM öğesi hakkında içgörü sağlar. Test yazarları için kritik bir özelliktir. En ilginç üyeleri [aşağıda](#debugelement) ele alınmaktadır. |
| `nativeElement`     | Bileşenin kökündeki yerel DOM öğesi.                                                                                                                                                                                                                        |
| `changeDetectorRef` | Bileşen için `ChangeDetectorRef`. <br /> `ChangeDetectorRef`, `ChangeDetectionStrategy.OnPush` yöntemine sahip bir bileşeni test ederken veya bileşenin değişiklik algılaması programatik kontrolünüz altında olduğunda en değerlidir.                      |

### `ComponentFixture` methods

_Fixture_ metotları, Angular'ın bileşen ağacında belirli görevleri yerine getirmesini sağlar.
Simüle edilmiş kullanıcı eylemine yanıt olarak Angular davranışını tetiklemek için bu metotları çağırın.

İşte test yazarları için en kullanışlı metotlar.

| Metotlar            | Ayrıntılar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `detectChanges`     | Bileşen için bir değişiklik algılama döngüsü tetikleyin. <br /> Bileşeni başlatmak için \(`ngOnInit` çağırır\) ve test kodunuzdan sonra bileşenin veri bağlı özellik değerlerini değiştirmek için çağırın. Angular, `personComponent.name`'i değiştirdiğinizi göremez ve siz `detectChanges`'i çağırana kadar `name` bağlamasını güncellemez. <br /> Dairesel güncellemeler olmadığını doğrulamak için arkasından `checkNoChanges` çalıştırır; `detectChanges(false)` olarak çağrılmadıkça.                                                                                                                        |
| `autoDetectChanges` | Fixture'ın değişiklikleri otomatik algılamasını istediğinizde bunu `true` olarak ayarlayın. <br /> Otomatik algılama `true` olduğunda, test fixture'ı bileşeni oluşturduktan hemen sonra `detectChanges`'i çağırır. Ardından ilgili zone olaylarını dinler ve buna göre `detectChanges`'i çağırır. Test kodunuz bileşen özellik değerlerini doğrudan değiştirdiğinde, veri bağlama güncellemelerini tetiklemek için muhtemelen hâlâ `fixture.detectChanges`'i çağırmanız gerekir. <br /> Varsayılan `false`'tur. Test davranışı üzerinde ince kontrol tercih eden test yazarları bunu `false` tutma eğilimindedir. |
| `checkNoChanges`    | Bekleyen değişiklik olmadığından emin olmak için bir değişiklik algılama çalıştırması yapın. Varsa bir istisna fırlatır.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `isStable`          | Fixture şu anda _kararlı_ ise `true` döndürür. Tamamlanmamış asenkron görevler varsa `false` döndürür.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `whenStable`        | Fixture kararlı olduğunda çözülen bir promise döndürür. <br /> Asenkron etkinliğin veya asenkron değişiklik algılamanın tamamlanmasından sonra teste devam etmek için bu promise'a bağlanın. [whenStable](guide/testing/components-scenarios#whenstable) bakın.                                                                                                                                                                                                                                                                                                                                                    |
| `destroy`           | Bileşen yok edilmesini tetikleyin.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

#### `DebugElement`

`DebugElement`, bileşenin DOM temsili hakkında kritik içgörüler sağlar.

`fixture.debugElement` tarafından döndürülen test kök bileşeninin `DebugElement`'inden, fixture'ın tüm öğe ve bileşen alt ağacını yürüyebilir \(ve sorgulayabilirsiniz\).

İşte test yazarları için yaklaşık kullanım sırasına göre en kullanışlı `DebugElement` üyeleri:

| Üyeler                | Ayrıntılar                                                                                                                                                                                                                                                                                                                              |
| :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nativeElement`       | Tarayıcıdaki karşılık gelen DOM öğesi                                                                                                                                                                                                                                                                                                   |
| `query`               | `query(predicate: Predicate<DebugElement>)` çağrısı, alt ağaçta herhangi bir derinlikte yüklemle eşleşen ilk `DebugElement`'i döndürür.                                                                                                                                                                                                 |
| `queryAll`            | `queryAll(predicate: Predicate<DebugElement>)` çağrısı, alt ağaçta herhangi bir derinlikte yüklemle eşleşen tüm `DebugElement`'leri döndürür.                                                                                                                                                                                           |
| `injector`            | Ana bağımlılık enjektörü. Örneğin, kök öğenin bileşen örneği enjektörü.                                                                                                                                                                                                                                                                 |
| `componentInstance`   | Varsa öğenin kendi bileşen örneği.                                                                                                                                                                                                                                                                                                      |
| `context`             | Bu öğe için üst bağlamı sağlayan bir nesne. Genellikle bu öğeyi yöneten bir üst bileşen örneği. <br /> Bir öğe `@for` bloğu içinde tekrarlandığında, bağlam `$implicit` özelliği satır örneği değeri olan bir `RepeaterContext`'tir. Örneğin, `@for(hero of heroes; ...)` içindeki `hero`.                                              |
| `children`            | Doğrudan `DebugElement` alt öğeleri. `children` üzerinden inerek ağaçta yürüyün. `DebugElement` ayrıca `DebugNode` nesnelerinin bir listesi olan `childNodes`'a sahiptir. `DebugElement`, `DebugNode` nesnelerinden türer ve genellikle öğelerden daha fazla düğüm vardır. Test yazarları genellikle düz düğümleri görmezden gelebilir. |
| `parent`              | `DebugElement` üst öğesi. Bu kök öğe ise Null.                                                                                                                                                                                                                                                                                          |
| `name`                | Bir öğe ise öğe etiketi adı.                                                                                                                                                                                                                                                                                                            |
| `triggerEventHandler` | Öğenin `listeners` koleksiyonunda karşılık gelen bir dinleyici varsa olayı adıyla tetikler. İkinci parametre, işleyicinin beklediği _olay nesnesidir_. <br /> Olayda bir dinleyici yoksa veya başka bir sorun varsa, `nativeElement.dispatchEvent(eventObject)` çağırmayı düşünün.                                                      |
| `listeners`           | Bileşenin `@Output` özelliklerine ve/veya öğenin olay özelliklerine bağlı geri çağırma fonksiyonları.                                                                                                                                                                                                                                   |
| `providerTokens`      | Bu bileşenin enjektör arama belirteçleri. Bileşenin kendisini ve bileşenin `providers` meta verisinde listelediği belirteçleri içerir.                                                                                                                                                                                                  |
| `source`              | Bu öğenin kaynak bileşen şablonunda bulunduğu yer.                                                                                                                                                                                                                                                                                      |
| `references`          | Şablon yerel değişkenleriyle \(örneğin `#foo`\) ilişkili nesnelerin sözlüğü, yerel değişken adına göre anahtarlanmış.                                                                                                                                                                                                                   |

`DebugElement.query(predicate)` ve `DebugElement.queryAll(predicate)` metotları, kaynak öğenin alt ağacını eşleşen `DebugElement` için filtreleyen bir yüklem alır.

Yüklem, bir `DebugElement` alan ve _doğru_ bir değer döndüren herhangi bir metottur.
Aşağıdaki örnek, "content" adlı bir şablon yerel değişkenine referansı olan tüm `DebugElement`'leri bulur:

```ts
// Filter for DebugElements with a #content reference
const contentRefs = el.queryAll((de) => de.references['content']);
```

Angular `By` sınıfı, yaygın yüklemler için üç statik metoda sahiptir:

| Statik metot              | Ayrıntılar                                                               |
| :------------------------ | :----------------------------------------------------------------------- |
| `By.all`                  | Tüm öğeleri döndürür                                                     |
| `By.css(selector)`        | Eşleşen CSS seçicilere sahip öğeleri döndürür                            |
| `By.directive(directive)` | Angular'ın yönerge sınıfının bir örneğiyle eşleştirdiği öğeleri döndürür |

```ts
// Can find DebugElement either by css selector or by directive
const h2 = fixture.debugElement.query(By.css('h2'));
const directive = fixture.debugElement.query(By.directive(Highlight));
```
