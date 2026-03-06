# Angular uygulamalarını derleme

Angular CLI uygulamanızı veya kütüphanenizi `ng build` komutuyla derleyebilirsiniz.
Bu, TypeScript kodunuzu JavaScript'e derler ve çıktıyı uygun şekilde optimize eder, paketler ve küçültür.

`ng build` yalnızca `angular.json` içinde belirtilen varsayılan projedeki `build` hedefi için builder'ı çalıştırır.
Angular CLI, genellikle `build` hedefleri olarak kullanılan dört builder içerir:

| Builder                                         | Amaç                                                                                                                                                                                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@angular-devkit/build-angular:application`     | [esbuild](https://esbuild.github.io/) ile istemci tarafı paketi, bir Node sunucusu ve derleme zamanı önceden işlenmiş rotalar içeren bir uygulama derler.                                                                                 |
| `@angular-devkit/build-angular:browser-esbuild` | [esbuild](https://esbuild.github.io/) ile tarayıcıda kullanım için istemci tarafı uygulamasını paketler. Daha fazla bilgi için [`browser-esbuild` belgelerine](tools/cli/build-system-migration#uyumluluk-builderına-manuel-geçiş) bakın. |
| `@angular-devkit/build-angular:browser`         | [webpack](https://webpack.js.org/) ile tarayıcıda kullanım için istemci tarafı uygulamasını paketler.                                                                                                                                     |
| `@angular-devkit/build-angular:ng-packagr`      | [Angular Paket Formatı](tools/libraries/angular-package-format)'na uygun bir Angular kütüphanesi derler.                                                                                                                                  |

`ng new` tarafından oluşturulan uygulamalar varsayılan olarak `@angular-devkit/build-angular:application` kullanır.
`ng generate library` tarafından oluşturulan kütüphaneler varsayılan olarak `@angular-devkit/build-angular:ng-packagr` kullanır.

Belirli bir proje için hangi builder'ın kullanıldığını, o projenin `build` hedefine bakarak belirleyebilirsiniz.

```json
{
  "projects": {
    "my-app": {
      "architect": {
        // `ng build`, `build` adlı Architect hedefini çağırır.
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          …
        },
        "serve": { … }
        "test": { … }
        …
      }
    }
  }
}
```

Bu sayfa `@angular-devkit/build-angular:application` kullanımını ve seçeneklerini tartışır.

## Çıktı dizini

Bu derleme sürecinin sonucu varsayılan olarak bir dizine (`dist/${PROJECT_NAME}`) çıktılanır.

## Boyut bütçelerini yapılandırma

Uygulamalar işlevsellik açısından büyüdükçe boyut olarak da büyürler.
CLI, yapılandırmanızda boyut eşikleri belirlemenize olanak tanır, böylece uygulamanızın parçalarının tanımladığınız boyut sınırları içinde kalmasını sağlayabilirsiniz.

Boyut sınırlarınızı CLI yapılandırma dosyası `angular.json` içinde, her [yapılandırılmış ortam](tools/cli/environments) için bir `budgets` bölümünde tanımlayın.

```json
{
  …
  "configurations": {
    "production": {
      …
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "250kb",
          "maximumError": "500kb"
        },
      ]
    }
  }
}
```

Tüm uygulama ve belirli parçalar için boyut bütçeleri belirleyebilirsiniz.
Her bütçe girişi, belirli bir türde bir bütçe yapılandırır.
Boyut değerlerini aşağıdaki biçimlerde belirtin:

| Boyut değeri      | Ayrıntılar                                                                      |
| :---------------- | :------------------------------------------------------------------------------ |
| `123` veya `123b` | Bayt cinsinden boyut.                                                           |
| `123kb`           | Kilobayt cinsinden boyut.                                                       |
| `123mb`           | Megabayt cinsinden boyut.                                                       |
| `12%`             | Temel değere göre yüzde olarak boyut. \(Temel değerler için geçerli değildir.\) |

Bir bütçe yapılandırdığınızda, uygulamanın belirli bir parçası belirlediğiniz sınır boyutuna ulaştığında veya aştığında builder uyarı verir veya hata bildirir.

Her bütçe girişi aşağıdaki özelliklere sahip bir JSON nesnesidir:

| Özellik        | Değer                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | Bütçe türü. Şunlardan biri: <table> <thead> <tr> <th> Değer </th> <th> Ayrıntılar </th> </tr> </thead> <tbody> <tr> <td> <code>bundle</code> </td> <td> Belirli bir paketin boyutu. </td> </tr> <tr> <td> <code>initial</code> </td> <td> Uygulamayı başlatmak için gereken JavaScript ve CSS boyutu. Varsayılan olarak 500kb'de uyarı ve 1mb'de hata verir. </td> </tr> <tr> <td> <code>allScript</code> </td> <td> Tüm betiklerin boyutu. </td> </tr> <tr> <td> <code>all</code> </td> <td> Tüm uygulamanın boyutu. </td> </tr> <tr> <td> <code>anyComponentStyle</code> </td> <td> Herhangi bir bileşen stil sayfasının boyutu. Varsayılan olarak 2kb'de uyarı ve 4kb'de hata verir. </td> </tr> <tr> <td> <code>anyScript</code> </td> <td> Herhangi bir betiğin boyutu. </td> </tr> <tr> <td> <code>any</code> </td> <td> Herhangi bir dosyanın boyutu. </td> </tr> </tbody> </table> |
| name           | Paketin adı (`type=bundle` için).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| baseline       | Karşılaştırma için temel boyut.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| maximumWarning | Temel değere göre uyarı için maksimum eşik.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| maximumError   | Temel değere göre hata için maksimum eşik.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| minimumWarning | Temel değere göre uyarı için minimum eşik.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| minimumError   | Temel değere göre hata için minimum eşik.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| warning        | Temel değere göre uyarı eşiği (min ve maks).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| error          | Temel değere göre hata eşiği (min ve maks).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |

## CommonJS bağımlılıklarını yapılandırma

Uygulamanız ve bağımlılıkları boyunca her zaman yerel [ECMAScript modüllerini](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) (ESM) tercih edin.
ESM, güçlü statik analiz desteğine sahip, tam olarak belirlenmiş bir web standardı ve JavaScript dil özelliğidir. Bu, paket optimizasyonlarını diğer modül formatlarından daha güçlü hale getirir.

Angular CLI ayrıca projenize [CommonJS](https://nodejs.org/api/modules.html) bağımlılıklarını içe aktarmayı destekler ve bu bağımlılıkları otomatik olarak paketler.
Ancak CommonJS modülleri, paketleyicilerin ve küçültücülerin bu modülleri etkili bir şekilde optimize etmesini engelleyebilir, bu da daha büyük paket boyutlarına neden olur.
Daha fazla bilgi için [CommonJS paketlerinizi nasıl büyütüyor](https://web.dev/commonjs-larger-bundles) makalesine bakın.

Angular CLI, tarayıcı uygulamanızın CommonJS modüllerine bağımlı olduğunu tespit ederse uyarı verir.
Bir CommonJS bağımlılığıyla karşılaştığınızda, bakımcıdan ECMAScript modüllerini desteklemesini istemeyi, bu desteği kendiniz sağlamayı veya ihtiyaçlarınızı karşılayan alternatif bir bağımlılık kullanmayı düşünün.
En iyi seçenek bir CommonJS bağımlılığı kullanmaksa, `angular.json` içindeki `build` seçeneklerinde bulunan `allowedCommonJsDependencies` seçeneğine CommonJS modül adını ekleyerek bu uyarıları devre dışı bırakabilirsiniz.

```json
"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
     "allowedCommonJsDependencies": [
        "lodash"
     ]
     …
   }
   …
},
```

## Tarayıcı uyumluluğunu yapılandırma

Angular CLI, farklı tarayıcı sürümleriyle uyumluluk sağlamak için [Browserslist](https://github.com/browserslist/browserslist) kullanır.
Desteklenen tarayıcılara bağlı olarak, Angular belirli JavaScript ve CSS özelliklerini otomatik olarak dönüştürerek derlenen uygulamanın desteklenen bir tarayıcı tarafından uygulanmamış bir özellik kullanmamasını sağlar. Ancak Angular CLI, eksik Web API'lerini tamamlamak için otomatik olarak polyfill eklemez. Polyfill eklemek için `angular.json` içindeki `polyfills` seçeneğini kullanın.

Varsayılan olarak, Angular CLI mevcut ana sürüm için [Angular tarafından desteklenen tarayıcılarla eşleşen](reference/versions#tarayıcı-desteği) bir `browserslist` yapılandırması kullanır.

Dahili yapılandırmayı geçersiz kılmak için, Angular'ın desteklenen tarayıcılarıyla eşleşen bir `.browserslistrc` yapılandırma dosyası oluşturan [`ng generate config browserslist`](cli/generate/config) komutunu çalıştırın.

`browserslist` sorgusu ile belirli tarayıcıları ve sürümleri nasıl hedefleyeceğinize dair daha fazla örnek için [browserslist deposuna](https://github.com/browserslist/browserslist) bakın.
Bu listeyi daha fazla tarayıcıya genişletmekten kaçının. Uygulama kodunuz daha geniş uyumluluğa sahip olsa bile, Angular'ın kendisi olmayabilir.
Bu listedeki tarayıcı veya sürüm setini yalnızca _azaltmalısınız_.

HELPFUL: Bir `browserslist` sorgusu için uyumlu tarayıcıları görüntülemek üzere [browsersl.ist](https://browsersl.ist) kullanın.

## Tailwind yapılandırma

Angular, yardımcı program öncelikli bir CSS çerçevesi olan [Tailwind CSS](https://tailwindcss.com/)'i destekler.

Tailwind CSS'i Angular CLI ile entegre etmek için [Angular ile Tailwind CSS kullanma](guide/tailwind) belgesine bakın.

## Kritik CSS satır içi yerleştirme

Angular, [First Contentful Paint (FCP)](https://web.dev/first-contentful-paint) performansını artırmak için uygulamanızın kritik CSS tanımlarını satır içine alabilir.
Bu seçenek varsayılan olarak etkindir. Bu satır içi yerleştirmeyi [`styles` özelleştirme seçeneklerinde](reference/configs/workspace-config#stil-optimizasyon-seçenekleri) devre dışı bırakabilirsiniz.

Bu optimizasyon, başlangıç görünüm alanını oluşturmak için gereken CSS'i çıkarır ve doğrudan oluşturulan HTML'ye satır içi olarak yerleştirir, böylece tarayıcının tam stil sayfalarının yüklenmesini beklemeden içeriği daha hızlı görüntülemesini sağlar. Kalan CSS daha sonra arka planda asenkron olarak yüklenir. Angular CLI, uygulamanızın HTML ve stillerini analiz etmek için [Beasties](https://github.com/danielroe/beasties) kullanır.
