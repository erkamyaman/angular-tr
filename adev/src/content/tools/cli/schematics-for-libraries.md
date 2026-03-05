# Schematics for libraries

Bir Angular kütüphanesi oluşturduğunuzda, Angular CLI ile entegre eden şematiklerle birlikte sağlayabilir ve paketleyebilirsiniz.
Şematiklerinizle, kullanıcılarınız kütüphanenizin başlangıç sürümünü yüklemek için `ng add`'ı,
kütüphanenizde tanımlanan yapıtları oluşturmak için `ng generate`'i ve bozucu değişiklikler içeren yeni bir sürüm için projelerini uyarlamak üzere `ng update`'i kullanabilir.

Her üç şematik türü de kütüphanenizle paketleyebileceğiniz bir koleksiyonun parçası olabilir.

## Creating a schematics collection

Bir koleksiyon başlatmak için şematik dosyalarını oluşturmanız gerekir.
Aşağıdaki adımlar, herhangi bir proje dosyasını değiştirmeden başlangıç desteğini nasıl ekleyeceğinizi gösterir.

1. Kütüphanenizin kök klasöründe bir `schematics` klasörü oluşturun.
1. `schematics/` klasöründe, ilk şematiğiniz için bir `ng-add` klasörü oluşturun.
1. `schematics` klasörünün kök düzeyinde bir `collection.json` dosyası oluşturun.
1. `collection.json` dosyasını düzenleyerek koleksiyonunuzun başlangıç şemasını tanımlayın.

   <docs-code header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.1.json"/>
   - `$schema` yolu, Angular Devkit koleksiyon şemasına görelidir.
   - `schematics` nesnesi, bu koleksiyonun parçası olan adlandırılmış şematikleri tanımlar.
   - İlk giriş, `ng-add` adlı bir şematik içindir.
     Açıklamayı içerir ve şematiğiniz çalıştırıldığında çağrılan fabrika fonksiyonuna işaret eder.

1. Kütüphane projenizin `package.json` dosyasında, şema dosyanızın yolunu içeren bir "schematics" girişi ekleyin.
   Angular CLI, komutları çalıştırırken koleksiyonunuzdaki adlandırılmış şematikleri bulmak için bu girişi kullanır.

<docs-code header="projects/my-lib/package.json (Schematics Collection Reference)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" region="collection"/>

Oluşturduğunuz başlangıç şeması, CLI'a `ng add` komutunu destekleyen şematiğin nerede bulunacağını söyler.
Artık o şematiği oluşturmaya hazırsınız.

## Providing installation support

`ng add` komutu için bir şematik, kullanıcılarınız için başlangıç kurulum sürecini iyileştirebilir.
Aşağıdaki adımlar bu tür bir şematiği tanımlar.

1. `<lib-root>/schematics/ng-add` klasörüne gidin.
1. Ana dosya olan `index.ts`'yi oluşturun.
1. `index.ts`'yi açın ve şematik fabrika fonksiyonunuz için kaynak kodunu ekleyin.

<docs-code header="projects/my-lib/schematics/ng-add/index.ts (ng-add Rule Factory)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/ng-add/index.ts"/>

Angular CLI, kütüphanenin en son sürümünü otomatik olarak yükler ve bu örnek, uygulamanın köküne `MyLibModule`'u ekleyerek bir adım daha ileri gider. `addRootImport` fonksiyonu, bir kod bloğu döndürmesi gereken bir geri çağrım kabul eder. `code` fonksiyonuyla etiketlenen dizenin içine herhangi bir kod yazabilirsiniz ve herhangi bir harici sembol, uygun import deyimlerinin oluşturulmasını sağlamak için `external` fonksiyonuyla sarılmalıdır.

### Define dependency type

Kütüphanenin projenin `package.json` yapılandırma dosyasındaki `dependencies`'e mi, `devDependencies`'e mi yoksa hiç kaydedilmemesi mi gerektiğini yapılandırmak için `ng-add`'in `save` seçeneğini kullanın.

<docs-code header="projects/my-lib/package.json (ng-add Reference)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" region="ng-add"/>

Olası değerler:

| Değerler            | Ayrıntılar                     |
| :------------------ | :----------------------------- |
| `false`             | Paketi `package.json`'a ekleme |
| `true`              | Paketi dependencies'e ekle     |
| `"dependencies"`    | Paketi dependencies'e ekle     |
| `"devDependencies"` | Paketi devDependencies'e ekle  |

## Building your schematics

Şematiklerinizi kütüphanenizle birlikte paketlemek için kütüphaneyi şematikleri ayrı olarak derleyecek şekilde yapılandırmanız ve ardından bunları pakete eklemeniz gerekir.
Şematiklerinizi kütüphanenizi derledikten _sonra_ derlemeniz gerekir, böylece doğru dizine yerleştirilirler.

- Kütüphanenizin, şematiklerinizi dağıtılan kütüphanenize nasıl derleyeceğine ilişkin talimatlar içeren özel bir TypeScript yapılandırma dosyasına ihtiyacı vardır
- Şematikleri kütüphane paketine eklemek için kütüphanenin `package.json` dosyasına betikler ekleyin

Angular çalışma alanınızda `my-lib` adlı bir kütüphane projeniz olduğunu varsayalım.
Kütüphaneye şematikleri nasıl derleyeceğini söylemek için, kütüphane derlemesini yapılandıran oluşturulan `tsconfig.lib.json` dosyasının yanına bir `tsconfig.schematics.json` dosyası ekleyin.

1. `tsconfig.schematics.json` dosyasını düzenleyerek aşağıdaki içeriği ekleyin.

   <docs-code header="projects/my-lib/tsconfig.schematics.json (TypeScript Config)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/tsconfig.schematics.json"/>

   | Seçenekler | Ayrıntılar                                                                                                         |
   | :--------- | :----------------------------------------------------------------------------------------------------------------- |
   | `rootDir`  | `schematics` klasörünüzün derlenecek girdi dosyalarını içerdiğini belirtir.                                        |
   | `outDir`   | Kütüphanenin çıktı klasörüne eşlenir. Varsayılan olarak bu, çalışma alanınızın kökündeki `dist/my-lib` klasörüdür. |

1. Şematik kaynak dosyalarınızın kütüphane paketine derlendiğinden emin olmak için, kütüphane projenizin kök klasöründeki (`projects/my-lib`) `package.json` dosyasına aşağıdaki betikleri ekleyin.

   <docs-code header="projects/my-lib/package.json (Build Scripts)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json"/>
   - `build` betiği, özel `tsconfig.schematics.json` dosyasını kullanarak şematiğinizi derler
   - `postbuild` betiği, `build` betiği tamamlandıktan sonra şematik dosyalarını kopyalar
   - Hem `build` hem de `postbuild` betikleri `copyfiles` ve `typescript` bağımlılıklarını gerektirir.
     Bağımlılıkları yüklemek için `devDependencies` içinde tanımlanan yola gidin ve betikleri çalıştırmadan önce `npm install` komutunu çalıştırın.

## Providing generation support

Kullanıcılarınızın kütüphanenizde tanımlanan bir yapıtı oluşturmak için `ng generate` komutunu kullanmalarına olanak tanıyan, koleksiyonunuza adlandırılmış bir şematik ekleyebilirsiniz.

Kütüphanenizin bazı kurulum gerektiren `my-service` adlı bir servis tanımladığını varsayalım.
Kullanıcılarınızın aşağıdaki CLI komutunu kullanarak bunu oluşturabilmesini istiyorsunuz.

```shell

ng generate my-lib:my-service

```

Başlamak için `schematics` klasöründe `my-service` adlı yeni bir alt klasör oluşturun.

### Configure the new schematic

Koleksiyona bir şematik eklediğinizde, koleksiyonun şemasında ona işaret etmeniz ve bir kullanıcının komuta geçirebileceği seçenekleri tanımlayan yapılandırma dosyaları sağlamanız gerekir.

1. `schematics/collection.json` dosyasını düzenleyerek yeni şematik alt klasörüne işaret edin ve yeni şematik için girdileri belirten bir şema dosyasına bir işaretçi ekleyin.

   <docs-code header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.json"/>

1. `<lib-root>/schematics/my-service` klasörüne gidin.
1. Bir `schema.json` dosyası oluşturun ve şematik için mevcut seçenekleri tanımlayın.

   <docs-code header="projects/my-lib/schematics/my-service/schema.json (Schematic JSON Schema)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.json"/>
   - _id_: Koleksiyondaki şema için benzersiz bir kimlik.
   - _title_: Şemanın insan tarafından okunabilir bir açıklaması.
   - _type_: Özellikler tarafından sağlanan türün açıklayıcısı.
   - _properties_: Şematik için mevcut seçenekleri tanımlayan bir nesne.

   Her seçenek bir anahtarı bir tür, açıklama ve isteğe bağlı takma adla ilişkilendirir.
   Tür, beklediğiniz değerin biçimini tanımlar ve açıklama, kullanıcı şematiğiniz için kullanım yardımı istediğinde görüntülenir.

   Şematik seçenekleri için ek özelleştirmeler hakkında çalışma alanı şemasına bakın.

1. Bir `schema.ts` dosyası oluşturun ve `schema.json` dosyasında tanımlanan seçeneklerin değerlerini depolayan bir arayüz tanımlayın.

   <docs-code header="projects/my-lib/schematics/my-service/schema.ts (Schematic Interface)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.ts"/>

   | Seçenekler | Ayrıntılar                                                                                                                                |
   | :--------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
   | name       | Oluşturulan servis için sağlamak istediğiniz ad.                                                                                          |
   | path       | Şematiğe sağlanan yolu geçersiz kılar. Varsayılan yol değeri geçerli çalışma dizinine dayanır.                                            |
   | project    | Şematiğin çalıştırılacağı belirli bir proje sağlar. Şematikte, seçenek kullanıcı tarafından sağlanmazsa bir varsayılan sağlayabilirsiniz. |

### Add template files

Bir projeye yapıtlar eklemek için şematiğinizin kendi şablon dosyalarına ihtiyacı vardır.
Şematik şablonları, kod çalıştırma ve değişken değiştirme için özel sözdizimini destekler.

1. `schematics/my-service/` klasörü içinde bir `files/` klasörü oluşturun.
1. Dosya oluşturmak için kullanılacak bir şablonu tanımlayan `__name@dasherize__.service.ts.template` adlı bir dosya oluşturun.
   Bu şablon, Angular'ın `HttpClient`'ını zaten bir `http` özelliğine enjekte edilmiş olarak içeren bir servis oluşturacaktır.

   ```ts {header:projects/my-lib/schematics/my-service/files/__name@dasherize__.service.ts.template (Schematic Template)}

   import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';

   @Injectable({
      providedIn: 'root'
   })
   export class <%= classify(name) %>Service {
      private http = inject(HttpClient);
   }

   ```

   - `classify` ve `dasherize` metotları, şematiğinizin kaynak şablonunu ve dosya adını dönüştürmek için kullandığı yardımcı fonksiyonlardır.
   - `name`, fabrika fonksiyonunuzdan bir özellik olarak sağlanır.
     Şemada tanımladığınız `name` ile aynıdır.

### Add the factory function

Artık altyapı yerinde olduğuna göre, kullanıcının projesinde ihtiyaç duyduğunuz değişiklikleri gerçekleştiren ana fonksiyonu tanımlayabilirsiniz.

Schematics çerçevesi, hem yol hem de içerik şablonlarını destekleyen bir dosya şablonlama sistemi sağlar.
Sistem, girdi `Tree`'sine yüklenen dosyalar veya yollar içinde tanımlanan yer tutucular üzerinde çalışır.
Bunları `Rule`'a geçirilen değerlerle doldurur.

Bu veri yapıları ve sözdiziminin ayrıntıları için [Schematics README](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/schematics/README.md) belgesine bakın.

1. Ana dosya `index.ts`'yi oluşturun ve şematik fabrika fonksiyonunuz için kaynak kodunu ekleyin.
1. İlk olarak, ihtiyacınız olacak şematik tanımlarını içe aktarın.
   Schematics çerçevesi, bir şematiği çalıştırırken kurallar oluşturmak ve kullanmak için birçok yardımcı fonksiyon sunar.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Imports)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="schematics-imports"/>

1. Şematiğinizin seçenekleri için tür bilgisi sağlayan tanımlı şema arayüzünü içe aktarın.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="schema-imports"/>

1. Oluşturma şematiğini oluşturmak için boş bir kural fabrikasıyla başlayın.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Initial Rule)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.1.ts" region="factory"/>

Bu kural fabrikası, ağacı değiştirmeden döndürür.
Seçenekler, `ng generate` komutundan geçirilen seçenek değerleridir.

## Define a generation rule

Artık kullanıcının uygulamasını, kütüphanenizde tanımlanan servis için kurmak üzere gerçekten değiştiren kodu oluşturmak için çerçeveye sahipsiniz.

Kullanıcının kütüphanenizi yüklediği Angular çalışma alanı birden fazla proje \(uygulama ve kütüphane\) içerir.
Kullanıcı projeyi komut satırında belirtebilir veya varsayılana bırakabilir.
Her iki durumda da, bu şematiğin uygulandığı belirli projeyi tanımlamanız gerekir, böylece proje yapılandırmasından bilgi alabilirsiniz.

Bunu, fabrika fonksiyonuna geçirilen `Tree` nesnesini kullanarak yapın.
`Tree` metotları, çalışma alanınızdaki eksiksiz dosya ağacına erişmenizi sağlar ve şematiğin yürütülmesi sırasında dosyaları okumanıza ve yazmanıza olanak tanır.

### Get the project configuration

1. Hedef projeyi belirlemek için, çalışma alanı yapılandırma dosyası `angular.json`'ın içeriğini okumak üzere `workspaces.readWorkspace` metodunu kullanın.
   `workspaces.readWorkspace` kullanmak için `Tree`'den bir `workspaces.WorkspaceHost` oluşturmanız gerekir.
   Fabrika fonksiyonunuza aşağıdaki kodu ekleyin.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="workspace"/>

   Bağlamın var olduğunu kontrol ettiğinizden ve uygun hatayı fırlattığınızdan emin olun.

1. Artık proje adına sahip olduğunuza göre, projeye özgü yapılandırma bilgilerini almak için kullanın.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Project)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="project-info"/>

   `workspace.projects` nesnesi, projeye özgü tüm yapılandırma bilgilerini içerir.

1. `options.path`, şematik uygulandığında şematik şablon dosyalarının taşınacağı yeri belirler.

   Şematiğin şemasındaki `path` seçeneği varsayılan olarak geçerli çalışma diziniyle değiştirilir.
   `path` tanımlanmamışsa, proje yapılandırmasından `sourceRoot`'u `projectType` ile birlikte kullanın.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Project Info)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="path"/>

### Define the rule

Bir `Rule`, harici şablon dosyalarını kullanabilir, dönüştürebilir ve dönüştürülmüş şablonla başka bir `Rule` nesnesi döndürebilir.
Şematiğiniz için gereken özel dosyaları oluşturmak üzere şablonlamayı kullanın.

1. Fabrika fonksiyonunuza aşağıdaki kodu ekleyin.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Template transform)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="template"/>

   | Metotlar           | Ayrıntılar                                                                                                                                                                                                               |
   | :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `apply()`          | Bir kaynağa birden fazla kural uygular ve dönüştürülmüş kaynağı döndürür. 2 argüman alır, bir kaynak ve kurallar dizisi.                                                                                                 |
   | `url()`            | Dosya sisteminizden, şematiğe göre kaynak dosyaları okur.                                                                                                                                                                |
   | `applyTemplates()` | Şematik şablonuna ve şematik dosya adlarına sunmak istediğiniz metotların ve özelliklerin bir argümanını alır. Bir `Rule` döndürür. Burada `classify()` ve `dasherize()` metotlarını ve `name` özelliğini tanımlarsınız. |
   | `classify()`       | Bir değer alır ve değeri başlık harfleriyle döndürür. Örneğin, sağlanan ad `my service` ise, `MyService` olarak döndürülür.                                                                                              |
   | `dasherize()`      | Bir değer alır ve değeri tireli ve küçük harflerle döndürür. Örneğin, sağlanan ad MyService ise, `my-service` olarak döndürülür.                                                                                         |
   | `move()`           | Şematik uygulandığında sağlanan kaynak dosyaları hedeflerine taşır.                                                                                                                                                      |

1. Son olarak, kural fabrikası bir kural döndürmelidir.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Chain Rule)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="chain"/>

   `chain()` metodu, birden fazla kuralı tek bir kurala birleştirmenize olanak tanır, böylece tek bir şematikte birden fazla işlem gerçekleştirebilirsiniz.
   Burada yalnızca şablon kurallarını şematik tarafından yürütülen herhangi bir kodla birleştiriyorsunuz.

Aşağıdaki şematik kural fonksiyonunun eksiksiz bir örneğine bakın.

<docs-code header="projects/my-lib/schematics/my-service/index.ts" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts"/>

Kurallar ve yardımcı metotlar hakkında daha fazla bilgi için [Sağlanan Kurallar](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/schematics#provided-rules) belgesine bakın.

## Running your library schematic

Kütüphanenizi ve şematiklerinizi derledikten sonra, projenize karşı çalıştırmak için şematik koleksiyonunu yükleyebilirsiniz.
Aşağıdaki adımlar, daha önce oluşturduğunuz şematiği kullanarak bir servis oluşturmayı gösterir.

### Build your library and schematics

Çalışma alanınızın kökünden, kütüphaneniz için `ng build` komutunu çalıştırın.

```shell

ng build my-lib

```

Ardından, şematiği derlemek için kütüphane dizininize geçin

```shell

cd projects/my-lib
npm run build

```

### Link the library

Kütüphaneniz ve şematikleriniz paketlenmiş ve çalışma alanınızın kökündeki `dist/my-lib` klasörüne yerleştirilmiştir.
Şematiği çalıştırmak için kütüphaneyi `node_modules` klasörünüze bağlamanız gerekir.
Çalışma alanınızın kökünden, dağıtılabilir kütüphanenizin yolunu belirterek `npm link` komutunu çalıştırın.

```shell

npm link dist/my-lib

```

### Run the schematic

Artık kütüphaneniz yüklü olduğuna göre, `ng generate` komutunu kullanarak şematiği çalıştırın.

```shell

ng generate my-lib:my-service --name my-data

```

Konsolda, şematiğin çalıştırıldığını ve `my-data.service.ts` dosyasının uygulama klasörünüzde oluşturulduğunu göreceksiniz.

```shell {hideCopy}

CREATE src/app/my-data.service.ts (208 bytes)

```
