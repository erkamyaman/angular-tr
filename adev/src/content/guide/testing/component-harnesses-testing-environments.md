# Ek test ortamları için harness desteği ekleme

## Başlamadan önce

TIP: Bu kılavuz, [bileşen donanımları genel bakış kılavuzunu](guide/testing/component-harnesses-overview) zaten okuduğunuzu varsayar. Bileşen donanımlarını kullanmaya yeni başlıyorsanız önce onu okuyun.

### Bir test ortamı için destek eklemek ne zaman mantıklıdır?

Aşağıdaki ortamlarda bileşen donanımlarını kullanmak için Angular CDK'nın iki yerleşik ortamını kullanabilirsiniz:

- Birim testleri
- WebDriver uçtan uca testleri

Desteklenen bir test ortamı kullanmak için [Bileşenleriniz için donanım oluşturma kılavuzunu](guide/testing/creating-component-harnesses) okuyun.

Aksi takdirde, diğer ortamlar için destek eklemek istiyorsanız, ortamınızda bir DOM öğesiyle nasıl etkileşim kurulacağını ve DOM etkileşimlerinin nasıl çalıştığını tanımlamanız gerekir. Daha fazla bilgi edinmek için okumaya devam edin.

### CDK Kurulumu

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories), bileşen oluşturmak için bir davranış temelleri setidir. Bileşen donanımlarını kullanmak için önce npm'den `@angular/cdk` yükleyin. Bunu terminalinizden Angular CLI kullanarak yapabilirsiniz:

```shell
ng add @angular/cdk
```

## Bir `TestElement` uygulaması oluşturma

Her test ortamı bir `TestElement` uygulaması tanımlamalıdır. `TestElement` arayüzü, bir DOM öğesinin ortamdan bağımsız temsili olarak hizmet eder. Donanımların, altta yatan ortamdan bağımsız olarak DOM öğeleriyle etkileşim kurmasını sağlar. Bazı ortamlar DOM öğeleriyle senkron etkileşimi desteklemediğinden (ör. WebDriver), tüm `TestElement` metotları asenkrondur ve işlemin sonucuyla birlikte bir `Promise` döndürür.

`TestElement`, altta yatan DOM ile etkileşim kurmak için `blur()`, `click()`, `getAttribute()` ve daha fazlası gibi bir dizi metot sunar. Metotların tam listesi için [TestElement API referans sayfasına](/api/cdk/testing/TestElement) bakın.

`TestElement` arayüzü büyük ölçüde `HTMLElement` üzerinde mevcut metotlara benzeyen metotlardan oluşur. Çoğu test ortamında benzer metotlar mevcuttur ve bu da metotların uygulanmasını oldukça basit hale getirir. Ancak `sendKeys` metodunu uygularken dikkat edilmesi gereken önemli bir fark, `TestKey` enum'undaki tuş kodlarının muhtemelen test ortamında kullanılan tuş kodlarından farklı olacağıdır. Ortam yazarları, `TestKey` kodlarından belirli test ortamında kullanılan kodlara bir eşleme sürdürmelidir.

Angular CDK'daki [UnitTestElement](/api/cdk/testing/testbed/UnitTestElement) ve [SeleniumWebDriverElement](/api/cdk/testing/selenium-webdriver/SeleniumWebDriverElement) uygulamaları, bu arayüzün uygulamalarına iyi örnekler olarak hizmet eder.

## Bir `HarnessEnvironment` uygulaması oluşturma

Test yazarları, testlerde kullanmak üzere bileşen donanımı örnekleri oluşturmak için `HarnessEnvironment` kullanır. `HarnessEnvironment`, yeni ortam için somut bir alt sınıf oluşturmak üzere genişletilmesi gereken soyut bir sınıftır. Yeni bir test ortamını desteklerken, tüm soyut üyeler için somut uygulamalar ekleyen bir `HarnessEnvironment` alt sınıfı oluşturun.

`HarnessEnvironment` bir genel tip parametresine sahiptir: `HarnessEnvironment<E>`. Bu `E` parametresi, ortamın ham öğe tipini temsil eder. Örneğin, birim test ortamları için bu parametre Element'tir.

Aşağıdakiler uygulanması gereken soyut metotlardır:

| Metot                                                        | Açıklama                                                                                                                                                              |
| :----------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `abstract getDocumentRoot(): E`                              | Ortam için kök öğeyi alır (ör. `document.body`).                                                                                                                      |
| `abstract createTestElement(element: E): TestElement`        | Verilen ham öğe için bir `TestElement` oluşturur.                                                                                                                     |
| `abstract createEnvironment(element: E): HarnessEnvironment` | Verilen ham öğede köklenen bir `HarnessEnvironment` oluşturur.                                                                                                        |
| `abstract getAllRawElements(selector: string): Promise<E[]>` | Ortamın kök öğesi altında verilen seçiciyle eşleşen tüm ham öğeleri alır.                                                                                             |
| `abstract forceStabilize(): Promise<void>`                   | `NgZone` kararlı olduğunda çözülen bir `Promise` alır. Ayrıca uygulanabilirse, `NgZone`'a kararlı hale gelmesini söyler (ör. `fakeAsync` testinde `flush()` çağrısı). |
| `abstract waitForTasksOutsideAngular(): Promise<void>`       | `NgZone`'un üst zone'u kararlı olduğunda çözülen bir `Promise` alır.                                                                                                  |

Bu eksik metotları uygulamanın yanı sıra, bu sınıf test yazarlarının `ComponentHarness` örnekleri alması için bir yol sağlamalıdır. Korumalı bir yapıcı tanımlamalı ve bir `HarnessLoader` örneği döndüren `loader` adlı statik bir metot sağlamalısınız. Bu, test yazarlarının şu şekilde kod yazmasına olanak tanır: `SomeHarnessEnvironment.loader().getHarness(...)`. Belirli ortamın ihtiyaçlarına bağlı olarak, sınıf birkaç farklı statik metot sağlayabilir veya argümanların aktarılmasını gerektirebilir. (Örneğin, `TestbedHarnessEnvironment` üzerindeki `loader` metodu bir `ComponentFixture` alır ve sınıf `documentRootLoader` ve `harnessForFixture` adlı ek statik metotlar sağlar).

Angular CDK'daki [`TestbedHarnessEnvironment`](/api/cdk/testing/testbed/TestbedHarnessEnvironment) ve [SeleniumWebDriverHarnessEnvironment](/api/cdk/testing/selenium-webdriver/SeleniumWebDriverHarnessEnvironment) uygulamaları, bu arayüzün uygulamalarına iyi örnekler olarak hizmet eder.

## Otomatik değişiklik algılamayı yönetme

`manualChangeDetection` ve parallel API'leri desteklemek için ortamınız, otomatik değişiklik algılama durumu için bir işleyici yüklemelidir.

Ortamınız otomatik değişiklik algılama durumunu ele almaya başlamak istediğinde `handleAutoChangeDetectionStatus(handler)` çağrılabilir. İşleyici fonksiyonu, iki özelliğe sahip bir `AutoChangeDetectionStatus` alacaktır: `isDisabled` ve `onDetectChangesNow()`. Daha fazla bilgi için [AutoChangeDetectionStatus API referans sayfasına](/api/cdk/testing/AutoChangeDetectionStatus) bakın.
Ortamınız otomatik değişiklik algılama durumunu ele almayı durdurmak isterse `stopHandlingAutoChangeDetectionStatus()` çağrılabilir.
