# Angular çalışma alanı yapılandırması

Bir Angular çalışma alanının kök düzeyindeki `angular.json` dosyası, çalışma alanı genelinde ve projeye özgü yapılandırma varsayılanları sağlar. Bunlar Angular CLI tarafından sağlanan derleme ve geliştirme araçları için kullanılır.
Yapılandırmada verilen yol değerleri, kök çalışma alanı dizinine görelidir.

## Genel JSON yapısı

`angular.json` dosyasının en üst düzeyinde, birkaç özellik çalışma alanını yapılandırır ve bir `projects` bölümü kalan proje bazlı yapılandırma seçeneklerini içerir.
Çalışma alanı düzeyinde ayarlanan Angular CLI varsayılanlarını proje düzeyinde ayarlanan varsayılanlarla geçersiz kılabilirsiniz.
Proje düzeyinde ayarlanan varsayılanları da komut satırını kullanarak geçersiz kılabilirsiniz.

Aşağıdaki özellikler, dosyanın en üst düzeyinde çalışma alanını yapılandırır.

| Özellikler       | Ayrıntılar                                                                                                                                                                                       |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`        | Yapılandırma dosyası sürümü.                                                                                                                                                                     |
| `newProjectRoot` | `ng generate application` veya `ng generate library` gibi araçlarla yeni projelerin oluşturulduğu yol. Yol mutlak veya çalışma alanı dizinine göreceli olabilir. Varsayılan değer `projects`'tir |
| `cli`            | [Angular CLI](tools/cli)'yi özelleştiren bir dizi seçenek. Aşağıdaki [Angular CLI yapılandırma seçenekleri](#angular-cli-yapılandırma-seçenekleri) bölümüne bakın.                               |
| `schematics`     | Bu çalışma alanı için `ng generate` alt komut seçenek varsayılanlarını özelleştiren bir dizi [şematik](tools/cli/schematics). Aşağıdaki [şematikler](#şematikler) bölümüne bakın.                |
| `projects`       | Çalışma alanındaki her uygulama veya kütüphane için projeye özgü yapılandırma seçenekleri içeren bir alt bölüm içerir.                                                                           |

`ng new app-name` ile oluşturduğunuz ilk uygulama "projects" altında listelenir:

`ng generate library` ile bir kütüphane projesi oluşturduğunuzda, kütüphane projesi de `projects` bölümüne eklenir.

HELPFUL: Yapılandırma dosyasının `projects` bölümü, çalışma alanı dosya yapısıyla tam olarak uyuşmaz.

<!-- markdownlint-disable-next-line MD032 -->

- `ng new` tarafından oluşturulan ilk uygulama, çalışma alanı dosya yapısının en üst düzeyindedir.
- Diğer uygulamalar ve kütüphaneler varsayılan olarak `projects` dizini altındadır.

Daha fazla bilgi için [Çalışma alanı ve proje dosya yapısı](reference/configs/file-structure) bölümüne bakın.

## Angular CLI yapılandırma seçenekleri

Aşağıdaki özellikler, Angular CLI'yi özelleştiren bir dizi seçenektir.

| Özellik                | Ayrıntılar                                                                                                                                                                                     | Değer türü                                    | Varsayılan değer |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------- | :--------------- |
| `analytics`            | Angular Ekibi ile anonim kullanım verilerini paylaşır. Bir boolean değeri veri paylaşılıp paylaşılmayacağını belirtirken, bir UUID dizesi takma adlı bir tanımlayıcı kullanarak veri paylaşır. | `boolean` \| `string`                         | `false`          |
| `cache`                | [Angular CLI Oluşturucuları](tools/cli/cli-builder) tarafından kullanılan [kalıcı disk önbelleğini](cli/cache) kontrol eder.                                                                   | [Önbellek seçenekleri](#önbellek-seçenekleri) | `{}`             |
| `schematicCollections` | `ng generate`'da kullanılacak şematik koleksiyonlarını listeler.                                                                                                                               | `string[]`                                    | `[]`             |
| `packageManager`       | Tercih edilen paket yöneticisi aracı.                                                                                                                                                          | `npm` \| `cnpm` \| `pnpm` \| `yarn`\| `bun`   | `npm`            |
| `warnings`             | Angular CLI'ye özgü konsol uyarılarını kontrol eder.                                                                                                                                           | [Uyarı seçenekleri](#uyarı-seçenekleri)       | `{}`             |

### Önbellek seçenekleri

| Özellik       | Ayrıntılar                                                                                                                                                                                                                                                                    | Değer türü               | Varsayılan değer |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- | :--------------- |
| `enabled`     | Derlemeler için disk önbelleğinin etkin olup olmadığını yapılandırır.                                                                                                                                                                                                         | `boolean`                | `true`           |
| `environment` | Disk önbelleğinin hangi ortamda etkinleştirileceğini yapılandırır.<br><br>_ `ci` önbelleği yalnızca sürekli entegrasyon (CI) ortamlarında etkinleştirir.<br>_ `local` önbelleği yalnızca CI ortamları _dışında_ etkinleştirir.<br>\* `all` önbelleği her yerde etkinleştirir. | `local` \| `ci` \| `all` | `local`          |
| `path`        | Önbellek sonuçlarının saklanması için kullanılan dizin.                                                                                                                                                                                                                       | `string`                 | `.angular/cache` |

### Uyarı seçenekleri

| Özellik           | Ayrıntılar                                                                  | Değer türü | Varsayılan değer |
| :---------------- | :-------------------------------------------------------------------------- | :--------- | :--------------- |
| `versionMismatch` | Global Angular CLI sürümü yerel sürümden yeni olduğunda bir uyarı gösterir. | `boolean`  | `true`           |

## Proje yapılandırma seçenekleri

Aşağıdaki üst düzey yapılandırma özellikleri, `projects['project-name']` altında her proje için kullanılabilir.

| Özellik       | Ayrıntılar                                                                                                                                                                                              | Değer türü                                                                                 | Varsayılan değer |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------- | :--------------- |
| `root`        | Bu projenin dosyaları için kök dizin, çalışma alanı dizinine göreceli. Çalışma alanının en üst düzeyinde bulunan ilk uygulama için boştur.                                                              | `string`                                                                                   | Yok (gerekli)    |
| `projectType` | "application" veya "library" değerlerinden biri. Bir uygulama tarayıcıda bağımsız olarak çalışabilir, ancak bir kütüphane çalışamaz.                                                                    | `application` \| `library`                                                                 | Yok (gerekli)    |
| `sourceRoot`  | Bu projenin kaynak dosyaları için kök dizin.                                                                                                                                                            | `string`                                                                                   | `''`             |
| `prefix`      | `ng generate` kullanarak yeni bileşenler, direktifler ve pipe'lar oluştururken Angular'ın seçicilerin başına eklediği bir dize. Bir uygulamayı veya özellik alanını tanımlamak için özelleştirilebilir. | `string`                                                                                   | `'app'`          |
| `schematics`  | Bu proje için `ng generate` alt komut seçenek varsayılanlarını özelleştiren bir dizi şematik. [Oluşturma şematikleri](#şematikler) bölümüne bakın.                                                      | [Şematikler](#şematikler) bölümüne bakın                                                   | `{}`             |
| `architect`   | Bu proje için Architect oluşturucu hedefleri yapılandırma varsayılanları.                                                                                                                               | [Oluşturucu hedeflerini yapılandırma](#oluşturucu-hedeflerini-yapılandırma) bölümüne bakın | `{}`             |

## Şematikler

[Angular şematikleri](tools/cli/schematics), yeni dosyalar ekleyerek veya mevcut dosyaları değiştirerek bir projeyi değiştirme talimatlarıdır.
Bunlar, şematik adını bir dizi varsayılan seçenekle eşleyerek yapılandırılabilir.

Bir şematiğin "adı" şu biçimdedir: `<schematic-package>:<schematic-name>`.
Varsayılan Angular CLI `ng generate` alt komutları için şematikler [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json) paketinde toplanmıştır.
Örneğin, `ng generate component` ile bir bileşen oluşturma şematiği `@schematics/angular:component`'tir.

Şematiğin şemasında verilen alanlar, Angular CLI alt komut seçenekleri için izin verilen komut satırı argüman değerlerine ve varsayılanlarına karşılık gelir.
Bir alt komut seçeneği için farklı bir varsayılan ayarlamak üzere çalışma alanı şema dosyanızı güncelleyebilirsiniz. Örneğin, `ng generate component`'te varsayılan olarak `standalone`'u devre dışı bırakmak için:

```json
{
  "projects": {
    "my-app": {
      "schematics": {
        "@schematics/angular:component": {
          "standalone": false
        }
      }
    }
  }
}
```

## CLI oluşturucularını yapılandırma

Architect, Angular CLI'nin derleme ve test çalıştırma gibi karmaşık görevleri gerçekleştirmek için kullandığı araçtır.
Architect, bir hedef yapılandırmasına göre belirli bir görevi gerçekleştirmek için belirlenmiş bir oluşturucuyu çalıştıran bir kabuktur.
Angular CLI'yi genişletmek için yeni oluşturucular ve hedefler tanımlayabilir ve yapılandırabilirsiniz.
[Angular CLI Oluşturucuları](tools/cli/cli-builder) bölümüne bakın.

### Varsayılan Architect oluşturucuları ve hedefleri

Angular, belirli komutlarla veya genel `ng run` komutuyla kullanılmak üzere varsayılan oluşturucular tanımlar.
Bu oluşturucuların her biri için seçenekleri ve varsayılanları tanımlayan JSON şemaları [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/builders.json) paketinde toplanmıştır.
Şemalar aşağıdaki oluşturucular için seçenekleri yapılandırır.

### Oluşturucu hedeflerini yapılandırma

`angular.json` dosyasının `architect` bölümü bir dizi Architect hedefi içerir.
Hedeflerin çoğu, onları çalıştıran Angular CLI komutlarına karşılık gelir.
Diğer hedefler `ng run` komutu kullanılarak yürütülebilir ve kendi hedeflerinizi tanımlayabilirsiniz.

Her hedef nesnesi, o hedef için `builder`'ı belirtir; bu, Architect'in çalıştırdığı araç için npm paketidir.
Her hedefin ayrıca hedef için varsayılan seçenekleri yapılandıran bir `options` bölümü ve hedef için alternatif yapılandırmaları adlandıran ve belirten bir `configurations` bölümü vardır.
Aşağıdaki [Derleme hedefi](#derleme-hedefi) bölümündeki örneğe bakın.

| Özellik        | Ayrıntılar                                                                                                                                                                                                |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`        | `ng build` komutunun seçenekleri için varsayılanları yapılandırır. Daha fazla bilgi için [Derleme hedefi](#derleme-hedefi) bölümüne bakın.                                                                |
| `serve`        | Derleme varsayılanlarını geçersiz kılar ve `ng serve` komutu için ek sunma varsayılanları sağlar. `ng build` komutu için mevcut seçeneklerin yanı sıra, uygulamanın sunulmasıyla ilgili seçenekler ekler. |
| `e2e`          | `ng e2e` komutu kullanılarak uçtan uca test uygulamaları derlemek için derleme varsayılanlarını geçersiz kılar.                                                                                           |
| `test`         | Test derlemeleri için derleme varsayılanlarını geçersiz kılar ve `ng test` komutu için ek test çalıştırma varsayılanları sağlar.                                                                          |
| `lint`         | Proje kaynak dosyaları üzerinde statik kod analizi gerçekleştiren `ng lint` komutunun seçenekleri için varsayılanları yapılandırır.                                                                       |
| `extract-i18n` | Kaynak kodundan yerelleştirilmiş mesaj dizelerini çıkaran ve uluslararasılaştırma için çeviri dosyaları üreten `ng extract-i18n` komutunun seçenekleri için varsayılanları yapılandırır.                  |

HELPFUL: Yapılandırma dosyasındaki tüm seçenekler, komut satırında kullanılan `dash-case` yerine `camelCase` kullanmalıdır.

## Derleme hedefi

`architect` altındaki her hedef aşağıdaki özelliklere sahiptir:

| Özellik          | Ayrıntılar                                                                                                                                                                                                                                                                           |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `builder`        | Bu hedefi oluşturmak için kullanılan CLI oluşturucusu, `<package-name>:<builder-name>` biçimindedir.                                                                                                                                                                                 |
| `options`        | Derleme hedefi varsayılan seçenekleri.                                                                                                                                                                                                                                               |
| `configurations` | Hedefi yürütmek için alternatif yapılandırmalar. Her yapılandırma, hedeflenen ortam için varsayılan seçenekleri ayarlar ve `options` altındaki ilişkili değeri geçersiz kılar. Aşağıdaki [Alternatif derleme yapılandırmaları](#alternatif-derleme-yapılandırmaları) bölümüne bakın. |

Örneğin, optimizasyonları devre dışı bırakılmış bir derleme yapılandırmak için:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "optimization": false
          }
        }
      }
    }
  }
}
```

### Alternatif derleme yapılandırmaları

Angular CLI iki derleme yapılandırmasıyla birlikte gelir: `production` ve `development`.
Varsayılan olarak, `ng build` komutu aşağıdaki gibi çeşitli derleme optimizasyonları uygulayan `production` yapılandırmasını kullanır:

- Dosyaları paketleme
- Fazla boşlukları en aza indirme
- Yorumları ve ölü kodu kaldırma
- Kısa, karışık adlar kullanmak için kodu küçültme

Geliştirme sürecinize uygun ek alternatif yapılandırmalar (örneğin `staging` gibi) tanımlayabilir ve adlandırabilirsiniz.
`--configuration` komut satırı bayrağına adını ileterek alternatif bir yapılandırma seçebilirsiniz.

Örneğin, optimizasyonun yalnızca üretim derlemeleri için etkinleştirildiği bir derleme yapılandırmak için (`ng build --configuration production`):

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "optimization": false
          },
          "configurations": {
            "production": {
              "optimization": true
            }
          }
        }
      }
    }
  }
}
```

Virgülle ayrılmış bir liste olarak birden fazla yapılandırma adı da iletebilirsiniz.
Örneğin, hem `staging` hem de `french` derleme yapılandırmalarını uygulamak için `ng build --configuration staging,french` komutunu kullanın.
Bu durumda, komut adlandırılmış yapılandırmaları soldan sağa ayrıştırır.
Birden fazla yapılandırma aynı ayarı değiştirirse, son ayarlanan değer nihai değer olur.
Bu örnekte, hem `staging` hem de `french` yapılandırmaları çıktı yolunu ayarlarsa, `french`'teki değer kullanılır.

### Ek derleme ve test seçenekleri

Varsayılan veya hedefli bir derleme için yapılandırılabilir seçenekler genellikle [`ng build`](cli/build) ve [`ng test`](cli/test) komutları için mevcut seçeneklere karşılık gelir.
Bu seçeneklerin ve olası değerlerinin ayrıntıları için [Angular CLI Referanslarına](cli) bakın.

| Seçenek özellikleri        | Ayrıntılar                                                                                                                                                                                                                                                                                           |
| :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets`                   | Uygulama ile birlikte sunulacak statik varlıklara giden yolları içeren bir nesne. Varsayılan yollar projenin `public` dizinine işaret eder. Daha fazla bilgi için [Varlık yapılandırması](#varlık-yapılandırması) bölümüne bakın.                                                                    |
| `styles`                   | Projenin genel bağlamına eklenecek CSS dosyalarından oluşan bir dizi. Angular CLI, CSS içe aktarmalarını ve tüm önemli CSS ön işlemcilerini destekler. Daha fazla bilgi için [Stiller ve betikler yapılandırması](#stiller-ve-betikler-yapılandırması) bölümüne bakın.                               |
| `stylePreprocessorOptions` | Stil ön işlemcilerine iletilecek seçenek-değer çiftlerini içeren bir nesne. Daha fazla bilgi için [Stiller ve betikler yapılandırması](#stiller-ve-betikler-yapılandırması) bölümüne bakın.                                                                                                          |
| `scripts`                  | Uygulamaya eklenecek JavaScript dosyalarını içeren bir nesne. Betikler, tam olarak `index.html` içinde `<script>` etiketi eklemiş gibi yüklenir. Daha fazla bilgi için [Stiller ve betikler yapılandırması](#stiller-ve-betikler-yapılandırması) bölümüne bakın.                                     |
| `budgets`                  | Uygulamanızın tamamı veya bölümleri için varsayılan boyut bütçesi türü ve eşikleri. Çıktı bir eşik boyutuna ulaştığında veya aştığında oluşturucuyu uyarı veya hata bildirmeye yapılandırabilirsiniz. [Boyut bütçeleri yapılandırma](tools/cli/build#boyut-bütçelerini-yapılandırma) bölümüne bakın. |
| `fileReplacements`         | Dosyaları ve derleme zamanı değiştirmelerini içeren bir nesne. Daha fazla bilgi için [Hedefe özgü dosya değiştirmelerini yapılandırma](tools/cli/environments#ortama-özgü-varsayılan-değerleri-yapılandırma) bölümüne bakın.                                                                         |
| `index`                    | Uygulamayı yükleyen temel HTML belgesi. Daha fazla bilgi için [Dizin yapılandırması](#dizin-yapılandırması) bölümüne bakın.                                                                                                                                                                          |
| `security`                 | `true` veya `false` olarak ayarlanabilen `autoCsp` anahtarını içeren bir nesne                                                                                                                                                                                                                       |

### Ek sunma seçenekleri

Geliştirme sunucusu, genellikle [`ng serve`](cli/serve) komutu için mevcut seçeneklere karşılık gelen kendi seçenek setine sahiptir.

| Seçenek özellikleri | Ayrıntılar                                                                                                                                                                                                                 |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedHosts`      | Geliştirme sunucusunun yanıt vereceği sunucu dizisi. Bu seçenek, aynı adlı Vite seçeneğini ayarlar. Daha fazla ayrıntı için [vite dokümantasyonuna bakın](https://vite.dev/config/server-options.html#server-allowedhosts) |

## Karmaşık yapılandırma değerleri

`assets`, `index`, `outputPath`, `styles` ve `scripts` seçenekleri basit yol dizesi değerlerine veya belirli alanlara sahip nesne değerlerine sahip olabilir.
`sourceMap` ve `optimization` seçenekleri basit bir boolean değerine ayarlanabilir. Yapılandırma dosyası kullanılarak karmaşık bir değer de verilebilir.

Aşağıdaki bölümler, bu karmaşık değerlerin her durumda nasıl kullanıldığı hakkında daha fazla ayrıntı sağlar.

### Varlık yapılandırması

Her `build` hedef yapılandırması, projenizi derlerken olduğu gibi kopyalamak istediğiniz dosya veya klasörleri listeleyen bir `assets` dizisi içerebilir.
Varsayılan olarak, `public/` dizininin içerikleri kopyalanır.

Bir varlığı hariç tutmak için, onu varlık yapılandırmasından kaldırabilirsiniz.

Varlıkları, çalışma alanı köküne göre basit yollar yerine nesneler olarak belirterek kopyalanacak şekilde daha ayrıntılı yapılandırabilirsiniz.
Bir varlık belirtim nesnesi aşağıdaki alanlara sahip olabilir.

| Alanlar          | Ayrıntılar                                                                                                                                                            |
| :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `glob`           | Temel dizin olarak `input` kullanan bir [node-glob](https://github.com/isaacs/node-glob/blob/master/README.md).                                                       |
| `input`          | Çalışma alanı köküne göre bir yol.                                                                                                                                    |
| `output`         | `outDir`'a göre bir yol. Güvenlik etkileri nedeniyle, Angular CLI hiçbir zaman proje çıktı yolunun dışına dosya yazmaz.                                               |
| `ignore`         | Hariç tutulacak glob'ların bir listesi.                                                                                                                               |
| `followSymlinks` | Glob kalıplarının sembolik bağlantı dizinlerini takip etmesine izin verir. Bu, sembolik bağlantının alt dizinlerinin aranmasını sağlar. Varsayılan değer `false`'tur. |

Örneğin, varsayılan varlık yolları aşağıdaki nesneler kullanılarak daha ayrıntılı olarak temsil edilebilir.

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "src/assets/",
                "output": "/assets/"
              },
              {
                "glob": "favicon.ico",
                "input": "src/",
                "output": "/"
              }
            ]
          }
        }
      }
    }
  }
}
```

Aşağıdaki örnek, varlıklar dizinindeki belirli dosyaları derlemeye kopyalanmaktan hariç tutmak için `ignore` alanını kullanır:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "src/assets/",
                "ignore": ["**/*.svg"],
                "output": "/assets/"
              }
            ]
          }
        }
      }
    }
  }
}
```

### Stiller ve betikler yapılandırması

`styles` ve `scripts` seçenekleri için bir dizi girişi basit bir yol dizesi veya ek bir giriş noktası dosyasına işaret eden bir nesne olabilir.
İlişkili oluşturucu, bu dosyayı ve bağımlılıklarını derleme sırasında ayrı bir paket olarak yükler.
Bir yapılandırma nesnesiyle, `bundleName` alanını kullanarak giriş noktası için paketi adlandırma seçeneğiniz vardır.

Paket varsayılan olarak enjekte edilir, ancak paketi enjeksiyondan hariç tutmak için `inject`'i `false` olarak ayarlayabilirsiniz.
Örneğin, aşağıdaki nesne değerleri stiller ve betikler içeren bir paket oluşturur ve adlandırır, ve enjeksiyondan hariç tutar:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "styles": [
              {
                "input": "src/external-module/styles.scss",
                "inject": false,
                "bundleName": "external-module"
              }
            ],
            "scripts": [
              {
                "input": "src/external-module/main.js",
                "inject": false,
                "bundleName": "external-module"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### Stil ön işlemci seçenekleri

Sass'ta, hem bileşen hem de genel stiller için `includePaths` özelliğini kullanabilirsiniz. Bu, içe aktarmalar için kontrol edilen ek temel yollar eklemenize olanak tanır.

Yol eklemek için `stylePreprocessorOptions` seçeneğini kullanın:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "stylePreprocessorOptions": {
              "includePaths": ["src/style-paths"]
            }
          }
        }
      }
    }
  }
}
```

Bu dizindeki dosyalar, örneğin `src/style-paths/_variables.scss`, projenizin herhangi bir yerinden göreceli yol olmadan içe aktarılabilir:

```scss
// src/app/app.scss
// Göreceli yol çalışır
@import '../style-paths/variables';

// Ama artık bu da çalışır
@import 'variables';
```

HELPFUL: Birim testleri için ihtiyacınız varsa, stilleri veya betikleri `test` oluşturucusuna da eklemeniz gerekir.
Ayrıca [Uygulamanızda çalışma zamanı global kütüphanelerini kullanma](tools/libraries/using-libraries#uygulamanızda-çalışma-zamanı-global-kütüphanelerini-kullanma) bölümüne de bakın.

### Optimizasyon yapılandırması

`optimization` seçeneği, derleme çıktısının daha ayrıntılı yapılandırılması için bir boolean veya nesne olabilir.
Bu seçenek, derleme çıktısının aşağıdaki gibi çeşitli optimizasyonlarını etkinleştirir:

- Betik ve stillerin küçültülmesi
- Tree-shaking
- Ölü kod eliminasyonu
- [Kritik CSS satır içi ekleme](/tools/cli/build#kritik-css-satır-içi-yerleştirme)
- Font satır içi ekleme

Bir uygulamanın optimizasyonunu ince ayarlamak için çeşitli seçenekler kullanılabilir.

| Seçenekler | Ayrıntılar                                                             | Değer türü                                                                   | Varsayılan değer |
| :--------- | :--------------------------------------------------------------------- | :--------------------------------------------------------------------------- | :--------------- |
| `scripts`  | Betik çıktısının optimizasyonunu etkinleştirir.                        | `boolean`                                                                    | `true`           |
| `styles`   | Stil çıktısının optimizasyonunu etkinleştirir.                         | `boolean` \| [Stil optimizasyon seçenekleri](#stil-optimizasyon-seçenekleri) | `true`           |
| `fonts`    | Fontlar için optimizasyonu etkinleştirir. İnternet erişimi gerektirir. | `boolean` \| [Font optimizasyon seçenekleri](#font-optimizasyon-seçenekleri) | `true`           |

#### Stil optimizasyon seçenekleri

| Seçenekler              | Ayrıntılar                                                                                                                            | Değer türü | Varsayılan değer |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------ | :--------- | :--------------- |
| `minify`                | Fazla boşlukları ve yorumları kaldırarak, tanımlayıcıları birleştirerek ve değerleri en aza indirerek CSS tanımlarını küçültür.       | `boolean`  | `true`           |
| `inlineCritical`        | [İlk İçerikli Boyama](https://web.dev/first-contentful-paint)'yı iyileştirmek için kritik CSS tanımlarını çıkarır ve satır içi ekler. | `boolean`  | `true`           |
| `removeSpecialComments` | `@license` veya `@preserve` içeren ya da `//!` veya `/*!` ile başlayan genel CSS'deki yorumları kaldırır.                             | `boolean`  | `true`           |

#### Font optimizasyon seçenekleri

| Seçenekler | Ayrıntılar                                                                                                                                                                                                              | Değer türü | Varsayılan değer |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :--------------- |
| `inline`   | Harici Google Fonts ve Adobe Fonts CSS tanımlarını uygulamanın HTML dizin dosyasında satır içi ekleyerek [render engelleyen istekleri](https://web.dev/render-blocking-resources) azaltır. İnternet erişimi gerektirir. | `boolean`  | `true`           |

Optimizasyonu birine veya diğerine uygulamak için aşağıdaki gibi bir değer sağlayabilirsiniz:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "stylePreprocessorOptions": {
              "includePaths": ["src/style-paths"]
            }
          }
        }
      }
    }
  }
}
```

### Kaynak haritası yapılandırması

`sourceMap` oluşturucu seçeneği, bir uygulamanın kaynak haritalarını kontrol etmek için bir boolean veya daha ayrıntılı yapılandırma nesnesi olabilir.

| Seçenekler       | Ayrıntılar                                                                   | Değer türü | Varsayılan değer |
| :--------------- | :--------------------------------------------------------------------------- | :--------- | :--------------- |
| `scripts`        | Tüm betikler için kaynak haritaları çıktılar.                                | `boolean`  | `true`           |
| `styles`         | Tüm stiller için kaynak haritaları çıktılar.                                 | `boolean`  | `true`           |
| `vendor`         | Satıcı paketleri kaynak haritalarını çözümler.                               | `boolean`  | `false`          |
| `hidden`         | Çıktı JavaScript'ten kaynak haritalarına bağlantıyı atlar.                   | `boolean`  | `false`          |
| `sourcesContent` | Kaynak haritaları içindeki dosyalar için orijinal kaynak içeriğini çıktılar. | `boolean`  | `true`           |

Aşağıdaki örnek, kaynak haritası çıktılarını yapılandırmak için bir veya daha fazla değerin nasıl değiştirileceğini gösterir:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "sourceMap": {
              "scripts": true,
              "styles": false,
              "hidden": true,
              "vendor": true
            }
          }
        }
      }
    }
  }
}
```

HELPFUL: Gizli kaynak haritaları kullanırken, kaynak haritaları pakette referans gösterilmez.
Bunlar, tarayıcı geliştirici araçlarında görünmeden yalnızca hata raporlama araçlarında yığın izlerini eşleştirmek istiyorsanız faydalıdır.
`hidden` kaynak haritasının çıktı paketinde bağlanmasını önlese de, dağıtım sürecinizin üretimde oluşturulan kaynak haritalarını sunmadığından emin olması gerektiğini unutmayın, aksi takdirde bilgi yine de sızdırılır.

#### Kaynak içeriği olmadan kaynak haritaları

`sourcesContent` alanı olmadan, yani orijinal kaynak kodunu içermeyen kaynak haritaları oluşturabilirsiniz.
Bu, kaynak kodunuzu ifşa etmeden daha iyi hata raporlaması için orijinal kaynak adlarıyla üretim ortamına kaynak haritaları dağıtmanıza olanak tanır.

Kaynak haritalarından kaynak içeriğini hariç tutmak için `sourcesContent` seçeneğini `false` olarak ayarlayın:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "sourceMap": {
              "scripts": true,
              "styles": true,
              "sourcesContent": false
            }
          }
        }
      }
    }
  }
}
```

### Dizin yapılandırması

Uygulamanın HTML dizininin oluşturulmasını yapılandırır.

`index` seçeneği, daha ayrıntılı yapılandırma için bir dize veya nesne olabilir.

Değer bir dize olarak sağlandığında, belirtilen yolun dosya adı oluşturulan dosya için kullanılır ve uygulamanın yapılandırılmış çıktı yolunun kökünde oluşturulur.

#### Dizin seçenekleri

| Seçenekler | Ayrıntılar                                                                                                                                               | Değer türü | Varsayılan değer |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :--------------- |
| `input`    | Uygulamanın oluşturulan HTML dizini için kullanılacak dosyanın yolu.                                                                                     | `string`   | Yok (gerekli)    |
| `output`   | Uygulamanın oluşturulan HTML dizin dosyasının çıktı yolu. Sağlanan tam yol kullanılır ve uygulamanın yapılandırılmış çıktı yoluna göreceli kabul edilir. | `string`   | `index.html`     |

### Çıktı yolu yapılandırması

`outputPath` seçeneği, `base` değeri olarak kullanılacak bir Dize veya daha ayrıntılı yapılandırma için bir Nesne olabilir.

Bir uygulamanın çıktı yapısını ince ayarlamak için çeşitli seçenekler kullanılabilir.

| Seçenekler | Ayrıntılar                                                                                                                                                   | Değer türü | Varsayılan değer |
| :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :--------------- |
| `base`     | Çalışma alanı köküne göre çıktı yolunu belirtir.                                                                                                             | `string`   |                  |
| `browser`  | Temel çıktı yolu içindeki tarayıcı derlemeniz için çıktı dizini adı. Bu, kullanıcılara güvenle sunulabilir.                                                  | `string`   | `browser`        |
| `server`   | Çıktı yolu tabanı içindeki sunucu derlemenizin çıktı dizini adı.                                                                                             | `string`   | `server`         |
| `media`    | Çıktı tarayıcı dizini içinde bulunan medya dosyalarınız için çıktı dizini adı. Bu medya dosyaları CSS dosyalarında yaygın olarak kaynak olarak adlandırılır. | `string`   | `media`          |
