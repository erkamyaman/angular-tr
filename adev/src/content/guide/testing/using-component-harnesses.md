# Test'lerde component harness'ları kullanma

## Başlamadan önce

TIP: Bu kılavuz, [bileşen donanımları genel bakış kılavuzunu](guide/testing/component-harnesses-overview) zaten okuduğunuzu varsayar. Bileşen donanımlarını kullanmaya yeni başlıyorsanız önce onu okuyun.

### CDK Kurulumu

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories), bileşen oluşturmak için bir davranış temelleri setidir. Bileşen donanımlarını kullanmak için önce npm'den `@angular/cdk` yükleyin. Bunu terminalinizden Angular CLI kullanarak yapabilirsiniz:

```shell
ng add @angular/cdk
```

## Test harness ortamları ve yükleyicileri

Bileşen test donanımlarını farklı test ortamlarında kullanabilirsiniz. Angular CDK iki yerleşik ortamı destekler:

- Angular'ın `TestBed`'i ile birim testleri
- [WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver) ile uçtan uca testler

Her ortam bir <strong>donanım yükleyicisi</strong> sağlar. Yükleyici, testleriniz boyunca kullandığınız donanım örneklerini oluşturur. Desteklenen test ortamları hakkında daha spesifik rehberlik için aşağıya bakın.

Ek test ortamları özel bağlamalar gerektirir. Daha fazla bilgi için [ek test ortamları için donanım desteği ekleme kılavuzuna](guide/testing/component-harnesses-testing-environments) bakın.

### Birim test'leri için `TestbedHarnessEnvironment`'dan yükleyici kullanma

Birim testleri için [TestbedHarnessEnvironment](/api/cdk/testing/TestbedHarnessEnvironment)'dan bir donanım yükleyicisi oluşturabilirsiniz. Bu ortam, Angular'ın `TestBed`'i tarafından oluşturulan bir [bileşen fixture'ı](api/core/testing/ComponentFixture) kullanır.

Fixture'ın kök öğesinde köklenen bir donanım yükleyicisi oluşturmak için `loader()` metodunu kullanın:

```ts
const fixture = TestBed.createComponent(MyComponent);

// Fixture'dan bir harness yükleyici oluştur
const loader = TestbedHarnessEnvironment.loader(fixture);
...

// Harness örneklerini almak için yükleyiciyi kullan
const myComponentHarness = await loader.getHarness(MyComponent);
```

Fixture dışına düşen öğeler için donanımlar oluşturmak üzere `documentRootLoader()` metodunu kullanın. Örneğin, kayan bir öğe veya açılır pencere görüntüleyen kod genellikle DOM öğelerini doğrudan belge gövdesine ekler, örneğin Angular CDK'daki `Overlay` servisi.

Ayrıca o fixture'ın kök öğesinde doğrudan bir donanım için `harnessForFixture()` ile doğrudan bir donanım yükleyicisi oluşturabilirsiniz.

### Uçtan uca test'ler için `SeleniumWebDriverHarnessEnvironment`'dan yükleyici kullanma

WebDriver tabanlı uçtan uca testler için `SeleniumWebDriverHarnessEnvironment` ile bir donanım yükleyicisi oluşturabilirsiniz.

Mevcut HTML belgesi için donanım yükleyici örneğini almak üzere `loader()` metodunu kullanın; belgenin kök öğesinde köklenir. Bu ortam bir WebDriver istemcisi kullanır.

```ts
let wd: webdriver.WebDriver = getMyWebDriverClient();
const loader = SeleniumWebDriverHarnessEnvironment.loader(wd);
...
const myComponentHarness = await loader.getHarness(MyComponent);
```

## Harness yükleyici kullanma

Donanım yükleyici örnekleri belirli bir DOM öğesine karşılık gelir ve o belirli öğenin altındaki öğeler için bileşen donanımı örnekleri oluşturmak üzere kullanılır.

Öğenin ilk örneği için `ComponentHarness` almak üzere `getHarness()` metodunu kullanın. Tüm `ComponentHarness` örneklerini almak için `getAllHarnesses()` metodunu kullanın.

```ts
// Öğenin ilk örneği için harness al
const myComponentHarness = await loader.getHarness(MyComponent);

// Öğenin tüm örnekleri için harness'ları al
const myComponentHarnesses = await loader.getHarnesses(MyComponent);
```

`getHarness` ve `getAllHarnesses`'a ek olarak, `HarnessLoader` donanımları sorgulamak için birkaç başka kullanışlı metoda sahiptir:

- `getHarnessAtIndex(...)`: Belirli bir dizindeki verilen kriterlere uyan bileşen için donanımı alır.
- `countHarnesses(...)`: Verilen kriterlere uyan bileşen örneklerinin sayısını sayar.
- `hasHarness(...)`: Verilen kriterlere uyan en az bir bileşen örneği olup olmadığını kontrol eder.

Örnek olarak, tıklandığında bir diyalog açan yeniden kullanılabilir bir dialog-button bileşeni düşünün. Aşağıdaki bileşenleri içerir ve her birinin karşılık gelen bir donanımı vardır:

- `MyDialogButton` (kullanışlı bir API ile `MyButton` ve `MyDialog`'u bir araya getirir)
- `MyButton` (standart bir düğme bileşeni)
- `MyDialog` (tıklamada `MyDialogButton` tarafından `document.body`'ye eklenen bir diyalog)

Aşağıdaki test bu bileşenlerin her biri için donanımları yükler:

```ts
let fixture: ComponentFixture<MyDialogButton>;
let loader: HarnessLoader;
let rootLoader: HarnessLoader;

beforeEach(() => {
  fixture = TestBed.createComponent(MyDialogButton);
  loader = TestbedHarnessEnvironment.loader(fixture);
  rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
});

it('loads harnesses', async () => {
  // `harnessForFixture` ile başlatılan bileşen için harness yükle
  dialogButtonHarness = await TestbedHarnessEnvironment.harnessForFixture(
    fixture,
    MyDialogButtonHarness,
  );

  // Düğme öğesi fixture'ın kök öğesinin içinde, bu yüzden `loader` kullanırız.
  const buttonHarness = await loader.getHarness(MyButtonHarness);

  // Diyalogu açmak için düğmeye tıkla
  await buttonHarness.click();

  // Diyalog `document.body`'ye eklenir, fixture'ın kök öğesinin dışında,
  // bu yüzden bu durumda `rootLoader` kullanırız.
  const dialogHarness = await rootLoader.getHarness(MyDialogHarness);

  // ... bazı doğrulamalar yap
});
```

### Farklı ortamlarda harness davranışı

Donanımlar tüm ortamlarda tamamen aynı davranmayabilir. Gerçek kullanıcı etkileşimi ile birim testlerinde oluşturulan simüle edilmiş olaylar arasında bazı farklar kaçınılmazdır. Angular CDK, davranışı mümkün olduğunca normalleştirmek için en iyi çabayı gösterir.

### Alt öğelerle etkileşim

Bu donanım yükleyicisinin kök öğesinin altındaki öğelerle etkileşim kurmak için bir alt öğenin `HarnessLoader` örneğini kullanın. Alt öğenin ilk örneği için `getChildLoader()` metodunu kullanın. Alt öğenin tüm örnekleri için `getAllChildLoaders()` metodunu kullanın.

```ts
const myComponentHarness = await loader.getHarness(MyComponent);

// '.child' seçicili alt öğenin ilk örneği için yükleyici al
const childLoader = await myComponentHarness.getLoader('.child');

// '.child' seçicili alt öğelerin tüm örnekleri için yükleyicileri al
const allChildLoaders = await myComponentHarness.getAllChildLoaders('.child');
```

### Harness'ları filtreleme

Bir sayfada belirli bir bileşenin birden fazla örneği olduğunda, bileşenin bazı özelliklerine göre filtreleme yaparak belirli bir bileşen örneği almak isteyebilirsiniz. Bunu yapmak için bir <strong>donanım yüklemi</strong> kullanabilirsiniz; bu, bir `ComponentHarness` sınıfını bileşen örneklerini filtrelemek için kullanılabilecek yüklem fonksiyonlarıyla ilişkilendirmek için kullanılan bir sınıftır.

Bir `HarnessLoader`'dan donanım istediğinizde, aslında bir HarnessQuery sağlıyorsunuz. Bir sorgu iki şeyden biri olabilir:

- Bir donanım yapıcısı. Bu sadece o donanımı alır
- Bir `HarnessPredicate`, bir veya daha fazla koşula göre filtrelenmiş donanımları alır

`HarnessPredicate`, `ComponentHarness`'ı genişleten herhangi bir şey üzerinde çalışan bazı temel filtreleri (selector, ancestor) destekler.

```ts
// Bir harness yüklemi ile MyButtonComponentHarness yükleme örneği
const disabledButtonPredicate = new HarnessPredicate(MyButtonComponentHarness, {
  selector: '[disabled]',
});
const disabledButton = await loader.getHarness(disabledButtonPredicate);
```

Ancak donanımların bileşene özgü filtreleme seçeneklerini kabul eden ve bir `HarnessPredicate` döndüren statik bir `with()` metodu uygulaması yaygındır.

```ts
// Belirli bir seçici ile MyButtonComponentHarness yükleme örneği
const button = await loader.getHarness(MyButtonComponentHarness.with({selector: 'btn'}));
```

Ek filtreleme seçenekleri her donanım uygulamasına özgü olduğundan, daha fazla ayrıntı için spesifik donanım belgelerine başvurun.

## Test harness API'lerini kullanma

Her donanım karşılık gelen bileşenine özgü bir API tanımlasa da, hepsi ortak bir temel sınıfı paylaşır: [ComponentHarness](/api/cdk/testing/ComponentHarness). Bu temel sınıf, donanım sınıfını DOM'daki bileşen örnekleriyle eşleştiren `hostSelector` statik özelliğini tanımlar.

Bunun ötesinde, herhangi bir donanımın API'si karşılık gelen bileşenine özgüdür; belirli bir donanımı nasıl kullanacağınızı öğrenmek için bileşenin belgelerine başvurun.

Örnek olarak, aşağıda [Angular Material slider bileşeni donanımını](https://material.angular.dev/components/slider/api#MatSliderHarness) kullanan bir bileşen için bir test yer almaktadır:

```ts
it('should get value of slider thumb', async () => {
  const slider = await loader.getHarness(MatSliderHarness);
  const thumb = await slider.getEndThumb();
  expect(await thumb.getValue()).toBe(50);
});
```

## Angular değişiklik algılama ile etkileşim

Varsayılan olarak test donanımları, bir DOM öğesinin durumunu okumadan önce ve bir DOM öğesiyle etkileştikten sonra Angular'ın [değişiklik algılamasını](/best-practices/runtime-performance) çalıştırır.

Testlerinizde değişiklik algılama üzerinde daha ince taneli kontrole ihtiyaç duyabileceğiniz zamanlar olabilir, örneğin bir asenkron işlem devam ederken bir bileşenin durumunu kontrol etmek gibi. Bu durumlarda, bir kod bloğu için otomatik değişiklik algılama yönetimini devre dışı bırakmak üzere `manualChangeDetection` fonksiyonunu kullanın.

```ts
it('checks state while async action is in progress', async () => {
  const buttonHarness = loader.getHarness(MyButtonHarness);
  await manualChangeDetection(async () => {
    await buttonHarness.click();
    fixture.detectChanges();
    // Asenkron tıklama işlemi devam ederken beklentileri kontrol et.
    expect(isProgressSpinnerVisible()).toBe(true);
    await fixture.whenStable();
    // Asenkron tıklama işlemi tamamlandıktan sonra beklentileri kontrol et.
    expect(isProgressSpinnerVisible()).toBe(false);
  });
});
```

Neredeyse tüm donanım metotları asenkrondur ve aşağıdakileri desteklemek için bir `Promise` döndürür:

- Birim testleri desteği
- Uçtan uca testler desteği
- Testleri asenkron davranıştaki değişikliklere karşı yalıtma

Angular ekibi, test okunabilirliğini artırmak için [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) kullanmayı önerir. `await` çağrısı, ilişkili `Promise` çözülene kadar testinizin yürütülmesini engeller.

Bazen birden fazla eylemi aynı anda gerçekleştirmek ve her birini sırayla yapmak yerine hepsinin tamamlanmasını beklemek isteyebilirsiniz. Örneğin, tek bir bileşenin birden fazla özelliğini okumak. Bu durumlarda işlemleri paralel hale getirmek için `parallel` fonksiyonunu kullanın. Parallel fonksiyonu `Promise.all`'a benzer şekilde çalışır ve aynı zamanda değişiklik algılama kontrollerini optimize eder.

```ts
it('reads properties in parallel', async () => {
  const checkboxHarness = loader.getHarness(MyCheckboxHarness);
  // checked ve intermediate özelliklerini aynı anda oku.
  const [checked, indeterminate] = await parallel(() => [
    checkboxHarness.isChecked(),
    checkboxHarness.isIndeterminate(),
  ]);
  expect(checked).toBe(false);
  expect(indeterminate).toBe(true);
});
```
