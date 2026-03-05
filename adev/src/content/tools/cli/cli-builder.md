# Angular CLI builders

Birçok Angular CLI komutu, kodunuz üzerinde uygulamanızı derleme, test etme veya sunma gibi karmaşık bir süreç çalıştırır.
Komutlar, istenen görevi gerçekleştirmek için başka bir aracı (paketleyici, test çalıştırıcısı, sunucu) çağıran _CLI builder'larını_ çalıştırmak için Architect adlı dahili bir araç kullanır.
Özel builder'lar tamamen yeni bir görev gerçekleştirebilir veya mevcut bir komut tarafından kullanılan üçüncü taraf aracını değiştirebilir.

Bu belge, CLI builder'larının çalışma alanı yapılandırma dosyasıyla nasıl entegre olduğunu açıklar ve kendi builder'ınızı nasıl oluşturabileceğinizi gösterir.

HELPFUL: Burada kullanılan örneklerdeki kodu bu [GitHub deposunda](https://github.com/mgechev/cli-builders-demo) bulabilirsiniz.

## CLI builders

Dahili Architect aracı, _builder_ adı verilen işleyici fonksiyonlara iş devreder.
Bir builder işleyici fonksiyonu iki argüman alır:

| Argüman   | Tür              |
| :-------- | :--------------- |
| `options` | `JSONObject`     |
| `context` | `BuilderContext` |

Buradaki sorumlulukların ayrılması, kodunuza dokunan diğer CLI komutları (örneğin `ng generate`) için kullanılan [şematiklerle](tools/cli/schematics-authoring) aynıdır.

- `options` nesnesi CLI kullanıcısının seçenekleri ve yapılandırması tarafından sağlanırken, `context` nesnesi CLI Builder API'si tarafından otomatik olarak sağlanır.
- Bağlamsal bilgilere ek olarak, `context` nesnesi ayrıca bir zamanlama metoduna, `context.scheduleTarget()`'a erişim sağlar.
  Zamanlayıcı, belirli bir hedef yapılandırmasıyla builder işleyici fonksiyonunu çalıştırır.

Builder işleyici fonksiyonu senkron (bir değer döndürür), asenkron (bir `Promise` döndürür) veya izleme yaparak birden fazla değer döndürebilir (bir `Observable` döndürür).
Döndürülen değerler her zaman `BuilderOutput` türünde olmalıdır.
Bu nesne, bir Boolean `success` alanı ve bir hata mesajı içerebilen isteğe bağlı bir `error` alanı içerir.

Angular, `ng build` ve `ng test` gibi komutlar için CLI tarafından kullanılan bazı builder'lar sağlar.
Bu ve diğer yerleşik CLI builder'ları için varsayılan hedef yapılandırmaları, [çalışma alanı yapılandırma dosyasının](reference/configs/workspace-config) `angular.json` "architect" bölümünde bulunabilir ve yapılandırılabilir.
Ayrıca, [`ng run` CLI komutuyla](cli/run) doğrudan çalıştırabileceğiniz kendi builder'larınızı oluşturarak Angular'ı genişletin ve özelleştirin.

### Builder project structure

Bir builder, bir Angular çalışma alanına benzer yapıda bir "proje" klasöründe bulunur; üst düzeyde global yapılandırma dosyaları ve kaynak klasöründe davranışı tanımlayan kod dosyalarıyla daha spesifik yapılandırma bulunur.
Örneğin, `myBuilder` klasörünüz aşağıdaki dosyaları içerebilir.

| Dosyalar                 | Amaç                                                                                                                  |
| :----------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `src/my-builder.ts`      | Builder tanımı için ana kaynak dosyası.                                                                               |
| `src/my-builder.spec.ts` | Testler için kaynak dosyası.                                                                                          |
| `src/schema.json`        | Builder girdi seçeneklerinin tanımı.                                                                                  |
| `builders.json`          | Builder'lar tanımı.                                                                                                   |
| `package.json`           | Bağımlılıklar. [https://docs.npmjs.com/files/package.json](https://docs.npmjs.com/files/package.json) adresine bakın. |
| `tsconfig.json`          | [TypeScript yapılandırması](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).                         |

Builder'lar `npm`'e yayınlanabilir, [Kütüphanenizi Yayınlama](tools/libraries/creating-libraries) belgesine bakın.

## Creating a builder

Örnek olarak, bir dosyayı yeni bir konuma kopyalayan bir builder oluşturun.
Bir builder oluşturmak için `createBuilder()` CLI Builder fonksiyonunu kullanın ve bir `Promise<BuilderOutput>` nesnesi döndürün.

<docs-code header="src/my-builder.ts (builder skeleton)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="builder-skeleton"/>

Şimdi biraz mantık ekleyelim.
Aşağıdaki kod, kaynak ve hedef dosya yollarını kullanıcı seçeneklerinden alır ve dosyayı kaynaktan hedefe kopyalar \([yerleşik NodeJS `copyFile()` fonksiyonunun Promise sürümünü](https://nodejs.org/api/fs.html#fs_fspromises_copyfile_src_dest_mode) kullanarak\).
Kopyalama işlemi başarısız olursa, altta yatan sorun hakkında bir mesajla bir hata döndürür.

<docs-code header="src/my-builder.ts (builder)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="builder"/>

### Handling output

Varsayılan olarak, `copyFile()` sürecin standart çıktısına veya hatasına hiçbir şey yazdırmaz.
Bir hata oluşursa, sorun meydana geldiğinde builder'ın tam olarak ne yapmaya çalıştığını anlamak zor olabilir.
`Logger` API'sini kullanarak ek bilgi loglayarak daha fazla bağlam ekleyin.
Bu ayrıca builder'ın kendisinin, standart çıktı ve hata devre dışı bırakılmış olsa bile ayrı bir süreçte yürütülmesine olanak tanır.

Bağlamdan bir `Logger` örneği alabilirsiniz.

<docs-code header="src/my-builder.ts (handling output)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="handling-output"/>

### Progress and status reporting

CLI Builder API'si, belirli fonksiyonlar ve arayüzler için ipuçları sağlayabilen ilerleme ve durum raporlama araçlarını içerir.

İlerleme bildirmek için, argüman olarak geçerli bir değer, isteğe bağlı bir toplam ve durum dizesi alan `context.reportProgress()` metodunu kullanın.
Toplam herhangi bir sayı olabilir. Örneğin, kaç dosya işlemeniz gerektiğini biliyorsanız, toplam dosya sayısı olabilir ve geçerli şimdiye kadar işlenen sayı olmalıdır.
Yeni bir dize değeri geçirmediğiniz sürece durum dizesi değiştirilmez.

Örneğimizde, kopyalama işlemi ya biter ya da hala yürütülmektedir, bu nedenle ilerleme raporu gerekmez, ancak builder'ımızı çağıran bir üst builder'ın neler olduğunu bilmesi için durum raporlayabilirsiniz.
Herhangi bir uzunlukta bir durum dizesi oluşturmak için `context.reportStatus()` metodunu kullanın.

HELPFUL: Uzun bir dizenin tamamen gösterilme garantisi yoktur; onu görüntüleyen kullanıcı arayüzüne sığacak şekilde kesilebilir.

Durumu kaldırmak için boş bir dize geçirin.

<docs-code header="src/my-builder.ts (progress reporting)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="progress-reporting"/>

## Builder input

Bir builder'ı `ng build` gibi bir CLI komutuyla dolaylı olarak veya Angular CLI `ng run` komutuyla doğrudan çağırabilirsiniz.
Her iki durumda da, gerekli girdileri sağlamanız gerekir, ancak diğer girdilerin bir [yapılandırma](tools/cli/environments) tarafından belirtilen belirli bir _hedef_ için önceden yapılandırılmış değerlere veya komut satırında ayarlanmış değerlere varsayılan olmasına izin verebilirsiniz.

### Input validation

Builder girdilerini o builder'la ilişkili bir JSON şemasında tanımlarsınız.
Şematiklere benzer şekilde, Architect aracı çözümlenen girdi değerlerini bir `options` nesnesine toplar ve builder fonksiyonuna geçirmeden önce türlerini şemaya göre doğrular.

Örnek builder'ımız için `options`, iki anahtarlı bir `JsonObject` olmalıdır:
her biri bir dize olan bir `source` ve bir `destination`.

Bu değerlerin tür doğrulaması için aşağıdaki şemayı sağlayabilirsiniz.

```json {header: "schema.json"}
{
  "$schema": "http://json-schema.org/schema",
  "type": "object",
  "properties": {
    "source": {
      "type": "string"
    },
    "destination": {
      "type": "string"
    }
  }
}
```

HELPFUL: Bu minimal bir örnektir, ancak doğrulama için şema kullanımı çok güçlü olabilir.
Daha fazla bilgi için [JSON şemaları web sitesine](http://json-schema.org) bakın.

Builder uygulamamızı şeması ve adıyla bağlamak için `package.json`'da işaret edebileceğiniz bir _builder tanımı_ dosyası oluşturmanız gerekir.

Şöyle görünen `builders.json` adlı bir dosya oluşturun:

```json {header: "builders.json"}
{
  "builders": {
    "copy": {
      "implementation": "./dist/my-builder.js",
      "schema": "./src/schema.json",
      "description": "Copies a file."
    }
  }
}
```

`package.json` dosyasında, Architect aracına builder tanımı dosyamızı nerede bulacağını söyleyen bir `builders` anahtarı ekleyin.

```json {header: "package.json"}
{
  "name": "@example/copy-file",
  "version": "1.0.0",
  "description": "Builder for copying files",
  "builders": "builders.json",
  "dependencies": {
    "@angular-devkit/architect": "~0.1200.0",
    "@angular-devkit/core": "^12.0.0"
  }
}
```

Builder'ımızın resmi adı artık `@example/copy-file:copy`'dir.
İlk kısım paket adıdır ve ikinci kısım `builders.json` dosyasında belirtilen builder adıdır.

Bu değerlere `options.source` ve `options.destination` üzerinden erişilir.

<docs-code header="src/my-builder.ts (report status)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="report-status"/>

### Target configuration

Bir builder'ın, onu belirli bir girdi yapılandırması ve proje ile ilişkilendiren tanımlanmış bir hedefi olmalıdır.

Hedefler, `angular.json` [CLI yapılandırma dosyasında](reference/configs/workspace-config) tanımlanır.
Bir hedef, kullanılacak builder'ı, varsayılan seçenek yapılandırmasını ve adlandırılmış alternatif yapılandırmaları belirtir.
Angular CLI'daki Architect, belirli bir çalıştırma için girdi seçeneklerini çözmek üzere hedef tanımını kullanır.

`angular.json` dosyası, her proje için bir bölüme sahiptir ve her projenin "architect" bölümü, 'build', 'test' ve 'serve' gibi CLI komutları tarafından kullanılan builder'lar için hedefleri yapılandırır.
Örneğin varsayılan olarak, `ng build` komutu derleme görevini gerçekleştirmek için `@angular-devkit/build-angular:browser` builder'ını çalıştırır ve `angular.json`'da `build` hedefi için belirtilen varsayılan seçenek değerlerini geçirir.

```json {header: "angular.json"}
{
  "myApp": {
    "...": "...",
    "architect": {
      "build": {
        "builder": "@angular-devkit/build-angular:browser",
        "options": {
          "outputPath": "dist/myApp",
          "index": "src/index.html",
          "...": "..."
        },
        "configurations": {
          "production": {
            "fileReplacements": [
              {
                "replace": "src/environments/environment.ts",
                "with": "src/environments/environment.prod.ts"
              }
            ],
            "optimization": true,
            "outputHashing": "all",
            "...": "..."
          }
        }
      },
      "...": "..."
    }
  }
}
```

Komut, "options" bölümünde belirtilen varsayılan seçenek setini builder'a geçirir.
`--configuration=production` bayrağını geçirirseniz, `production` yapılandırmasında belirtilen geçersiz kılma değerlerini kullanır.
Komut satırında tek tek daha fazla seçenek geçersiz kılması belirtin.

#### Target strings

Genel `ng run` CLI komutu, ilk argümanı olarak aşağıdaki biçimde bir hedef dizesi alır.

```shell

project:target[:configuration]

```

|               | Ayrıntılar                                                                                                                              |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------- |
| project       | Hedefin ilişkili olduğu Angular CLI projesinin adı.                                                                                     |
| target        | `angular.json` dosyasının `architect` bölümünden adlandırılmış bir builder yapılandırması.                                              |
| configuration | (isteğe bağlı) `angular.json` dosyasında tanımlandığı şekliyle, belirli bir hedef için adlandırılmış bir yapılandırma geçersiz kılması. |

Builder'ınız başka bir builder'ı çağırıyorsa, geçirilen bir hedef dizesini okuması gerekebilir.
Bu dizeyi bir nesneye ayrıştırmak için `@angular-devkit/architect` paketindeki `targetFromTargetString()` yardımcı fonksiyonunu kullanın.

## Schedule and run

Architect, builder'ları asenkron olarak çalıştırır.
Bir builder'ı çağırmak için, tüm yapılandırma çözümlemesi tamamlandığında çalıştırılacak bir görev zamanlarsınız.

Builder fonksiyonu, zamanlayıcı bir `BuilderRun` kontrol nesnesi döndürene kadar yürütülmez.
CLI genellikle `context.scheduleTarget()` fonksiyonunu çağırarak görevleri zamanlar ve ardından `angular.json` dosyasındaki hedef tanımını kullanarak girdi seçeneklerini çözer.

Architect, belirli bir hedef için girdi seçeneklerini; varsayılan seçenekler nesnesini alarak, ardından yapılandırmadaki değerleri üzerine yazarak ve ardından `context.scheduleTarget()`'a geçirilen overrides nesnesindeki değerleri daha da üzerine yazarak çözer.
Angular CLI için overrides nesnesi komut satırı argümanlarından oluşturulur.

Architect, sonuçta ortaya çıkan seçenek değerlerini builder'ın şemasına göre doğrular.
Girdiler geçerliyse, Architect bağlamı oluşturur ve builder'ı çalıştırır.

Daha fazla bilgi için [Çalışma Alanı Yapılandırması](reference/configs/workspace-config) belgesine bakın.

HELPFUL: `context.scheduleBuilder()` çağırarak doğrudan başka bir builder'dan veya testten de bir builder'ı çağırabilirsiniz.
Bir `options` nesnesini doğrudan metoda geçirirsiniz ve bu seçenek değerleri, daha fazla ayarlama yapılmadan builder'ın şemasına göre doğrulanır.

Yalnızca `context.scheduleTarget()` metodu, yapılandırma ve overrides'ı `angular.json` dosyası aracılığıyla çözer.

### Default architect configuration

Hedef yapılandırmalarını bağlama yerleştiren basit bir `angular.json` dosyası oluşturalım.

Builder'ı npm'e yayınlayabilir ([Kütüphanenizi Yayınlama](tools/libraries/creating-libraries#publishing-your-library) belgesine bakın) ve aşağıdaki komutla yükleyebilirsiniz:

```shell

npm install @example/copy-file

```

`ng new builder-test` ile yeni bir proje oluşturursanız, oluşturulan `angular.json` dosyası yalnızca varsayılan builder yapılandırmalarıyla şöyle görünür.

```json {header: "angular.json"}
{
  "projects": {
    "builder-test": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/builder-test",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "src/tsconfig.app.json"
          },
          "configurations": {
            "production": {
              "optimization": true,
              "aot": true,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}
```

### Adding a target

Bir dosyayı kopyalamak için builder'ımızı çalıştıracak yeni bir hedef ekleyin.
Bu hedef, builder'a `package.json` dosyasını kopyalamasını söyler.

- Projemiz için `architect` nesnesine yeni bir hedef bölümü ekleyeceğiz
- `copy-package` adlı hedef, `@example/copy-file` olarak yayınladığınız builder'ımızı kullanır.
- Seçenekler nesnesi, tanımladığınız iki girdi için varsayılan değerleri sağlar.
  - `source` - Kopyaladığınız mevcut dosya.
  - `destination` - Kopyalamak istediğiniz yol.

```json {header: "angular.json"}
{
  "projects": {
    "builder-test": {
      "architect": {
        "copy-package": {
          "builder": "@example/copy-file:copy",
          "options": {
            "source": "package.json",
            "destination": "package-copy.json"
          }
        }
        // Existing targets...
      }
    }
  }
}
```

### Running the builder

Builder'ımızı yeni hedefin varsayılan yapılandırmasıyla çalıştırmak için aşağıdaki CLI komutunu kullanın.

```shell

ng run builder-test:copy-package

```

Bu, `package.json` dosyasını `package-copy.json`'a kopyalar.

Yapılandırılmış varsayılanları geçersiz kılmak için komut satırı argümanlarını kullanın.
Örneğin, farklı bir `destination` değeriyle çalıştırmak için aşağıdaki CLI komutunu kullanın.

```shell

ng run builder-test:copy-package --destination=package-other.json

```

Bu, dosyayı `package-copy.json` yerine `package-other.json`'a kopyalar.
_source_ seçeneğini geçersiz kılmadığınız için, yine varsayılan `package.json` dosyasından kopyalayacaktır.

## Testing a builder

Builder'ınız için entegrasyon testi kullanın, böylece Architect zamanlayıcısını kullanarak bu [örnekteki](https://github.com/mgechev/cli-builders-demo) gibi bir bağlam oluşturabilirsiniz.
Builder kaynak dizininde `my-builder.spec.ts` adlı yeni bir test dosyası oluşturun. Test, `JsonSchemaRegistry` (şema doğrulama için), `TestingArchitectHost` (`ArchitectHost`'un bellek içi uygulaması) ve `Architect`'in yeni örneklerini oluşturur.

Dosya kopyalama builder'ını çalıştıran bir test örneği burada.
Test, `package.json` dosyasını kopyalamak için builder'ı kullanır ve kopyalanan dosyanın içeriğinin kaynakla aynı olduğunu doğrular.

<docs-code header="src/my-builder.spec.ts" path="adev/src/content/examples/cli-builder/src/my-builder.spec.ts"/>

HELPFUL: Bu testi deponuzda çalıştırırken [`ts-node`](https://github.com/TypeStrong/ts-node) paketine ihtiyacınız vardır.
`my-builder.spec.ts`'yi `my-builder.spec.js` olarak yeniden adlandırarak bundan kaçınabilirsiniz.

### Watch mode

Çoğu builder bir kez çalışır ve döner. Ancak bu davranış, değişiklikleri izleyen bir builder ile (örneğin bir geliştirme sunucusu) tamamen uyumlu değildir.
Architect izleme modunu destekleyebilir, ancak dikkat edilmesi gereken bazı şeyler vardır.

- İzleme moduyla kullanılmak için, bir builder işleyici fonksiyonu bir `Observable` döndürmelidir.
  Architect, `Observable`'a tamamlanana kadar abone olur ve builder aynı argümanlarla tekrar zamanlanırsa onu yeniden kullanabilir.

- Builder, her yürütmeden sonra her zaman bir `BuilderOutput` nesnesi yayınlamalıdır.
  Yürütüldüğünde, harici bir olay tarafından tetiklenmek üzere izleme moduna girebilir.
  Bir olay yeniden başlamayı tetiklerse, builder Architect'e tekrar çalıştığını söylemek için `context.reportRunning()` fonksiyonunu çağırmalıdır.
  Bu, başka bir çalıştırma zamanlanırsa Architect'in builder'ı durdurmasını önler.

Builder'ınız izleme modundan çıkmak için `BuilderRun.stop()` çağırdığında, Architect builder'ın `Observable`'ından aboneliğini iptal eder ve temizleme mantığını çalıştırmak için builder'ın teardown mantığını çağırır.
Bu davranış ayrıca uzun süren derlemelerin durdurulmasına ve temizlenmesine olanak tanır.

Genel olarak, builder'ınız harici bir olayı izliyorsa, çalıştırmanızı üç aşamaya ayırmalısınız.

| Aşamalar  | Ayrıntılar                                                                                                                                                                                                                                                    |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Çalışma   | Gerçekleştirilen görev, örneğin bir derleyiciyi çağırma. Bu, derleyici bittiğinde ve builder'ınız bir `BuilderOutput` nesnesi yayınladığında sona erer.                                                                                                       |
| İzleme    | İki çalıştırma arasında harici bir olay akışını izleme. Örneğin, dosya sistemindeki herhangi bir değişikliği izleme. Bu, derleyici yeniden başladığında ve `context.reportRunning()` çağrıldığında sona erer.                                                 |
| Tamamlama | Görev tamamen tamamlanmış (örneğin birkaç kez çalışması gereken bir derleyici) veya builder çalıştırması durdurulmuş (`BuilderRun.stop()` kullanılarak). Architect teardown mantığını çalıştırır ve builder'ınızın `Observable`'ından aboneliğini iptal eder. |

## Summary

CLI Builder API'si, özel mantığı yürütmek için builder'lar kullanarak Angular CLI'ın davranışını değiştirme aracı sağlar.

- Builder'lar senkron veya asenkron olabilir, bir kez yürütülebilir veya harici olayları izleyebilir ve diğer builder'ları veya hedefleri zamanlayabilir.
- Builder'ların `angular.json` yapılandırma dosyasında belirtilen seçenek varsayılanları vardır, bunlar hedef için alternatif bir yapılandırmayla üzerine yazılabilir ve komut satırı bayraklarıyla daha da üzerine yazılabilir
- Angular ekibi, Architect builder'larını test etmek için entegrasyon testleri kullanmanızı önerir. Builder'ın yürüttüğü mantığı doğrulamak için birim testleri kullanın.
- Builder'ınız bir `Observable` döndürüyorsa, o `Observable`'ın teardown mantığında builder'ı temizlemelidir.
