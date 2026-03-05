# Creating libraries

Bu sayfa, Angular işlevselliğini genişletmek için yeni kütüphanelerin nasıl oluşturulacağı ve yayınlanacağına dair kavramsal bir genel bakış sunar.

Birden fazla uygulamada aynı sorunu çözmeniz gerektiğini fark ederseniz \(veya çözümünüzü diğer geliştiricilerle paylaşmak isterseniz\), bir kütüphane adayınız var demektir.
Basit bir örnek, kullanıcıları şirket web sitenize yönlendiren ve şirketinizin oluşturduğu tüm uygulamalarda yer alacak bir düğme olabilir.

## Getting started

Aşağıdaki komutlarla yeni bir çalışma alanında yeni bir kütüphane iskeleti oluşturmak için Angular CLI'yi kullanın.

```shell

ng new my-workspace --no-create-application
cd my-workspace
ng generate library my-lib

```

<docs-callout title="Naming your library">

Kütüphanenizi daha sonra npm gibi herkese açık bir paket kayıt defterinde yayınlamak istiyorsanız, adını seçerken çok dikkatli olmalısınız.
Bkz. [Publishing your library](tools/libraries/creating-libraries#publishing-your-library).

`ng-library` gibi `ng-` ön ekiyle başlayan bir ad kullanmaktan kaçının.
`ng-` ön eki, Angular framework'ü ve kütüphaneleri tarafından kullanılan ayrılmış bir anahtar kelimedir.
`ngx-` ön eki, kütüphanenin Angular ile kullanıma uygun olduğunu belirtmek için kullanılan bir gelenektir.
Ayrıca kayıt defteri tüketicilerinin farklı JavaScript framework'lerinin kütüphanelerini ayırt etmeleri için mükemmel bir göstergedir.

</docs-callout>

`ng generate` komutu, çalışma alanınızda bir bileşen içeren `projects/my-lib` klasörünü oluşturur.

HELPFUL: Bir kütüphane projesinin nasıl yapılandırıldığına ilişkin daha fazla ayrıntı için [Project File Structure kılavuzunun](reference/configs/file-structure) [Library project files](reference/configs/file-structure#library-project-files) bölümüne bakın.

Aynı çalışma alanını birden fazla proje için kullanmak üzere monorepo modelini kullanın.
Bkz. [Setting up for a multi-project workspace](reference/configs/file-structure#multiple-projects).

Yeni bir kütüphane oluşturduğunuzda, çalışma alanı yapılandırma dosyası `angular.json`, `library` türünde bir projeyle güncellenir.

```json

"projects": {
  …
  "my-lib": {
    "root": "projects/my-lib",
    "sourceRoot": "projects/my-lib/src",
    "projectType": "library",
    "prefix": "lib",
    "architect": {
      "build": {
        "builder": "@angular-devkit/build-angular:ng-packagr",
        …

```

CLI komutlarıyla projeyi derleyin, test edin ve lint yapın:

```shell

ng build my-lib --configuration development
ng test my-lib
ng lint my-lib

```

Proje için yapılandırılmış builder'ın, uygulama projeleri için varsayılan builder'dan farklı olduğuna dikkat edin.
Bu builder, diğer şeylerin yanı sıra, kütüphanenin her zaman [AOT derleyicisi](tools/cli/aot-compiler) ile derlenmesini sağlar.

Kütüphane kodunu yeniden kullanılabilir hale getirmek için bunun için bir genel API tanımlamalısınız.
Bu "kullanıcı katmanı", kütüphanenizin tüketicilerine neyin sunulduğunu tanımlar.
Kütüphanenizin bir kullanıcısı, genel işlevselliğe \(servis sağlayıcıları ve genel yardımcı fonksiyonlar gibi\) tek bir içe aktarma yolu aracılığıyla erişebilmelidir.

Kütüphanenizin genel API'si, kütüphane klasörünüzdeki `public-api.ts` dosyasında yönetilir.
Bu dosyadan dışa aktarılan her şey, kütüphaneniz bir uygulamaya aktarıldığında herkese açık hale gelir.

Kütüphaneniz, kurulum ve bakım için belgeler \(genellikle bir README dosyası\) sağlamalıdır.

## Refactoring parts of an application into a library

Çözümünüzü yeniden kullanılabilir hale getirmek için, uygulamaya özel koda bağımlı olmayacak şekilde ayarlamanız gerekir.
Uygulama işlevselliğini bir kütüphaneye taşırken dikkate alınması gereken bazı noktalar şunlardır.

- Bileşenler ve pipe'lar gibi bildirimler durumsuz olarak tasarlanmalıdır, yani harici değişkenlere bağlı olmamalı veya bunları değiştirmemelidir.
  Duruma bağlıysanız, her durumu değerlendirmeli ve bunun uygulama durumu mu yoksa kütüphanenin yöneteceği bir durum mu olduğuna karar vermelisiniz.

- Bileşenlerin dahili olarak abone olduğu tüm observable'lar, bu bileşenlerin yaşam döngüsü sırasında temizlenmeli ve elden çıkarılmalıdır
- Bileşenler etkileşimlerini, bağlam sağlamak için input'lar ve diğer bileşenlere olay iletmek için output'lar aracılığıyla açığa çıkarmalıdır

- Tüm dahili bağımlılıkları kontrol edin.
  - Bileşenlerde veya servislerde kullanılan özel sınıflar veya arayüzler için, bunların da taşınması gereken ek sınıflara veya arayüzlere bağlı olup olmadığını kontrol edin
  - Benzer şekilde, kütüphane kodunuz bir servise bağlıysa, o servisin de taşınması gerekir
  - Kütüphane kodunuz veya şablonları diğer kütüphanelere \(örneğin Angular Material gibi\) bağlıysa, kütüphanenizi bu bağımlılıklarla yapılandırmalısınız

- İstemci uygulamalarına servisleri nasıl sağladığınızı düşünün.
  - Servisler, NgModule veya bir bileşende sağlayıcı bildirmek yerine kendi sağlayıcılarını bildirmelidir.
    Bir sağlayıcı bildirmek, o servisi _tree-shakable_ yapar.
    Bu uygulama, derleyicinin kütüphaneyi içe aktaran uygulamaya hiç enjekte edilmeyen servisi paket dışında bırakmasına olanak tanır.
    Bu konuda daha fazla bilgi için bkz. [Tree-shakable providers](guide/di/lightweight-injection-tokens).

  - Global servis sağlayıcıları kaydediyorsanız bir `provideXYZ()` sağlayıcı fonksiyonu sunun.
  - Kütüphaneniz tüm istemci uygulamaları tarafından kullanılmayabilecek isteğe bağlı servisler sağlıyorsa, bu durum için [hafif token tasarım deseni](guide/di/lightweight-injection-tokens) kullanarak uygun tree-shaking desteği sağlayın

## Integrating with the CLI using code-generation schematics

Bir kütüphane genellikle bir projeye aktardığınız bileşenler, servisler ve diğer Angular yapıtaşlarını \(pipe'lar, direktifler\) tanımlayan _yeniden kullanılabilir kod_ içerir.
Bir kütüphane, yayınlama ve paylaşım için bir npm paketine paketlenir.
Bu paket ayrıca, CLI'nin `ng generate component` ile genel yeni bir bileşen oluşturmasıyla aynı şekilde, doğrudan projenizde kod oluşturmak veya dönüştürmek için talimatlar sağlayan şematikler de içerebilir.
Bir kütüphaneyle paketlenmiş bir şematik, örneğin Angular CLI'ye, o kütüphanede tanımlanmış belirli bir özelliği veya özellik kümesini yapılandıran ve kullanan bir bileşen oluşturmak için gereken bilgileri sağlayabilir.
Bunun bir örneği, CDK'nın [BreakpointObserver](https://material.angular.dev/cdk/layout/overview#breakpointobserver)'ını yapılandıran ve bunu Material'in [MatSideNav](https://material.angular.dev/components/sidenav/overview) ve [MatToolbar](https://material.angular.dev/components/toolbar/overview) bileşenleriyle kullanan [Angular Material'in navigasyon şematiği](https://material.angular.dev/guide/schematics#navigation-schematic)dir.

Aşağıdaki türde şematikler oluşturun ve dahil edin:

- `ng add`'in kütüphanenizi bir projeye ekleyebilmesi için bir kurulum şematiği dahil edin
- `ng generate`'in tanımladığınız yapıtaşlarını \(bileşenler, servisler, testler\) bir projede iskele olarak oluşturabilmesi için kütüphanenize oluşturma şematikleri dahil edin
- `ng update`'in kütüphanenizin bağımlılıklarını güncelleyebilmesi ve yeni sürümlerdeki kırılma değişiklikleri için geçişler sağlayabilmesi için bir güncelleme şematiği dahil edin

Kütüphanenize neleri dahil edeceğiniz görevinize bağlıdır.
Örneğin, bir uygulamaya nasıl ekleneceğini göstermek için önceden doldurulmuş verilerle bir açılır menü oluşturan bir şematik tanımlayabilirsiniz.
Her seferinde farklı aktarılan değerler içerecek bir açılır menü istiyorsanız, kütüphaneniz belirli bir yapılandırmayla oluşturmak için bir şematik tanımlayabilir.
Geliştiriciler daha sonra kendi uygulamaları için bir örnek yapılandırmak üzere `ng generate` komutunu kullanabilir.

Bir yapılandırma dosyasını okumak ve ardından bu yapılandırmaya dayalı bir form oluşturmak istediğinizi varsayalım.
Bu form, kütüphanenizi kullanan geliştirici tarafından ek özelleştirme gerektiriyorsa, bir şematik olarak en iyi şekilde çalışabilir.
Ancak form her zaman aynı olacak ve geliştiriciler tarafından fazla özelleştirme gerektirmeyecekse, yapılandırmayı alan ve formu oluşturan dinamik bir bileşen oluşturabilirsiniz.
Genel olarak, özelleştirme ne kadar karmaşıksa, şematik yaklaşımı o kadar kullanışlıdır.

Daha fazla bilgi için bkz. [Schematics Overview](tools/cli/schematics) ve [Schematics for Libraries](tools/cli/schematics-for-libraries).

## Publishing your library

Kütüphanenizi bir npm paketi olarak derlemek ve yayınlamak için Angular CLI'yi ve npm paket yöneticisini kullanın.

Angular CLI, derlenmiş kodunuzdan npm'e yayınlanabilecek paketler oluşturmak için [ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/master/README.md) adlı bir araç kullanır.
`ng-packagr` tarafından desteklenen dağıtım formatları ve kütüphaneniz için doğru formatı seçme konusunda rehberlik için bkz. [Building libraries with Ivy](tools/libraries/creating-libraries#publishing-libraries).

Dağıtım için kütüphaneleri her zaman `production` yapılandırmasını kullanarak derlemelisiniz.
Bu, oluşturulan çıktının uygun optimizasyonları ve npm için doğru paket formatını kullanmasını sağlar.

```shell

ng build my-lib
cd dist/my-lib
npm publish

```

## Managing assets in a library

Angular kütüphanenizde, dağıtılabilir paket tema dosyaları, Sass mixin'leri veya belgeler \(değişiklik günlüğü gibi\) gibi ek varlıklar içerebilir.
Daha fazla bilgi için [varlıkları derlemenin bir parçası olarak kütüphanenize kopyalama](https://github.com/ng-packagr/ng-packagr/blob/master/docs/copy-assets.md) ve [varlıkları bileşen stillerine gömme](https://github.com/ng-packagr/ng-packagr/blob/master/docs/embed-assets-css.md) konularına bakın.

IMPORTANT: Sass mixin'leri veya önceden derlenmiş CSS gibi ek varlıklar dahil ederken, bunları birincil giriş noktasının `package.json` dosyasındaki koşullu ["exports"](tools/libraries/angular-package-format#exports) bölümüne manuel olarak eklemeniz gerekir.

`ng-packagr`, elle yazılmış `"exports"` ile otomatik oluşturulanları birleştirir ve kütüphane yazarlarının ek dışa aktarma alt yolları veya özel koşullar yapılandırmasına olanak tanır.

```json

"exports": {
  ".": {
    "sass": "./_index.scss",
  },
  "./theming": {
    "sass": "./_theming.scss"
  },
  "./prebuilt-themes/indigo-pink.css": {
    "style": "./prebuilt-themes/indigo-pink.css"
  }
}

```

Yukarıdaki, [@angular/material](https://unpkg.com/browse/@angular/material/package.json) dağıtılabilir paketinden bir alıntıdır.

## Peer dependencies

Angular kütüphaneleri, kütüphanenin bağımlı olduğu tüm `@angular/*` bağımlılıklarını eş bağımlılıklar olarak listelemelidir.
Bu, modüller Angular istediğinde hepsinin tam olarak aynı modülü almasını sağlar.
Bir kütüphane `@angular/core`'u `peerDependencies` yerine `dependencies`'te listelerse, farklı bir Angular modülü alabilir ve bu da uygulamanızın bozulmasına neden olabilir.

## Using your own library in applications

Kütüphanenizi aynı çalışma alanında kullanmak için npm paket yöneticisine yayınlamanız gerekmez, ancak önce derlemeniz gerekir.

Kendi kütüphanenizi bir uygulamada kullanmak için:

- Kütüphaneyi derleyin.
  Derlenmeden önce bir kütüphaneyi kullanamazsınız.

```shell
  ng build my-lib
```

- Uygulamalarınızda kütüphaneden ada göre içe aktarın:

```ts
import {myExport} from 'my-lib';
```

### Building and rebuilding your library

Kütüphanenizi npm paketi olarak yayınlamadıysanız ve ardından paketi npm'den uygulamanıza geri yüklemediyseniz derleme adımı önemlidir.
Örneğin, git deponuzu klonlayıp `npm install` çalıştırırsanız, kütüphanenizi henüz derlemediyseniz editörünüz `my-lib` içe aktarımlarını eksik olarak gösterir.

HELPFUL: Bir Angular uygulamasında bir kütüphaneden bir şey içe aktardığınızda, Angular kütüphane adı ile disk üzerindeki bir konum arasında bir eşleme arar.
Bir kütüphane paketi yüklediğinizde, eşleme `node_modules` klasöründedir.
Kendi kütüphanenizi derlediğinizde, eşlemeyi `tsconfig` yollarınızda bulması gerekir.

Angular CLI ile bir kütüphane oluşturmak, yolunu otomatik olarak `tsconfig` dosyasına ekler.
Angular CLI, derleme sistemine kütüphaneyi nerede bulacağını söylemek için `tsconfig` yollarını kullanır.

Daha fazla bilgi için bkz. [Path mapping overview](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping).

Kütüphanenizde her değişiklik yaptığınızda yeniden derleyebilirsiniz, ancak bu ek adım zaman alır.
_Artımlı derleme_ işlevselliği kütüphane geliştirme deneyimini iyileştirir.
Bir dosya her değiştirildiğinde, değiştirilen dosyaları yayan kısmi bir derleme gerçekleştirilir.

Artımlı derlemeler, geliştirme ortamınızda arka plan işlemi olarak çalıştırılabilir.
Bu özellikten yararlanmak için derleme komutuna `--watch` bayrağını ekleyin:

```shell

ng build my-lib --watch

```

IMPORTANT: CLI `build` komutu, kütüphaneler için uygulamalardan farklı bir builder kullanır ve farklı bir derleme aracı çağırır.

- Uygulamalar için derleme sistemi `@angular-devkit/build-angular`, `webpack` tabanlıdır ve tüm yeni Angular CLI projelerine dahildir
- Kütüphaneler için derleme sistemi `ng-packagr` tabanlıdır.
  Yalnızca `ng generate library my-lib` kullanarak bir kütüphane eklediğinizde bağımlılıklarınıza eklenir.

İki derleme sistemi farklı şeyleri destekler ve aynı şeyleri desteklediklerinde bile bunları farklı şekilde yaparlar.
Bu, TypeScript kaynağının derlenmiş bir kütüphanede, derlenmiş bir uygulamadakinden farklı JavaScript koduna dönüşebileceği anlamına gelir.

Bu nedenle, bir kütüphaneye bağımlı olan bir uygulama yalnızca _derlenmiş kütüphaneye_ işaret eden TypeScript yol eşlemelerini kullanmalıdır.
TypeScript yol eşlemeleri kütüphane kaynağı `.ts` dosyalarına _işaret etmemelidir_.

### Linking libraries for local development

Bu bölüm, monorepo çalışma alanı yapısına veya NPM kayıt defterine yayınlamaya bağlı kalmadan, yerel geliştirme sırasında bağımsız bir Angular kütüphanesini harici bir uygulama ile test etmek için paket yöneticinizin yerel bağlama özelliğini
([`npm link`](https://docs.npmjs.com/cli/v11/commands/npm-link) veya [`pnpm link`](https://pnpm.io/cli/link) gibi) nasıl kullanacağınızı açıklar.

NOTE: Kütüphaneniz ve uygulamanız aynı Angular çalışma alanındaysa (monorepo kurulumu), standart monorepo iş akışı bağlamayı otomatik olarak yönetir ve genellikle daha verimlidir. Bu yerel bağlama yaklaşımı en iyi şu durumlarda kullanılır:

- Bağımsız bir kütüphane geliştiriyorsunuz ve değişiklikleri harici, tüketen bir uygulama ile test etmeniz gerekiyor.
- Kütüphane değişikliklerini monorepo çalışma alanı dışındaki tüketen bir uygulamada test ediyorsunuz.

#### Configuring the consuming application

Bağlanmış kütüphaneleri kullanmak için uygulamanızın `angular.json` dosyasını aşağıdaki ayarlarla yapılandırmanız gerekir:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "preserveSymlinks": true
          },
          "configurations": {
            "development": {
              "sourceMap": {
                "scripts": true,
                "styles": true,
                "vendor": true
              }
            }
          }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": {
            "prebundle": {
              "exclude": ["my-lib"]
            }
          }
        }
      }
    }
  }
}
```

**Configuration options explained:**

- `preserveSymlinks: true`: Derleme sistemine, sembolik bağlantının orijinal konumuna çözümlemek yerine paket yöneticinizin bağlama komutuyla oluşturulan sembolik bağlantıları takip etmesini söyler. Bu, bağımlı node paketlerinin birden fazla kopyasını önlemek için gereklidir.
- `sourceMap.vendor`: Bağlanmış kütüphane kodunun daha kolay hata ayıklaması için satıcı kaynak haritalarını etkinleştirme (özellikle `vendor: true`).
- `prebundle.exclude`: Varsayılan olarak, Angular CLI tüm node bağımlılıklarını önceden paketleyebilir. Kütüphanenizi hariç tutmak, bağlanmış kaynak kodunun düzgün şekilde izlenmesini ve değişiklikler olduğunda yeniden derlenmesini sağlar.

## Publishing libraries

Bir kütüphaneyi yayınlarken kullanılacak iki dağıtım formatı vardır:

| Distribution formats        | Details                                                                                                                                                                                                                                                                                                           |
| :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Partial-Ivy \(recommended\) | v12'den itibaren Angular'ın herhangi bir sürümüyle derlenen Ivy uygulamaları tarafından tüketilebilen taşınabilir kod içerir.                                                                                                                                                                                     |
| Full-Ivy                    | Angular'ın farklı sürümleri arasında çalışması garanti edilmeyen özel Angular Ivy talimatları içerir. Bu format, kütüphanenin ve uygulamanın _tam olarak_ aynı Angular sürümüyle derlenmesini gerektirir. Bu format, tüm kütüphane ve uygulama kodunun doğrudan kaynaktan derlendiği ortamlar için kullanışlıdır. |

npm'e yayınlamak için, Angular'ın yama sürümleri arasında kararlı olduğu için partial-Ivy formatını kullanın.

Oluşturulan Ivy talimatları Angular'ın genel API'sinin bir parçası olmadığından ve yama sürümleri arasında değişebileceğinden, npm'e yayınlıyorsanız kütüphaneleri full-Ivy koduyla derlemeyin.

## Ensuring library version compatibility

Bir uygulamayı derlemek için kullanılan Angular sürümü her zaman, bağımlı kütüphanelerinin herhangi birini derlemek için kullanılan Angular sürümleriyle aynı veya daha yüksek olmalıdır.
Örneğin, Angular sürüm 13 kullanan bir kütüphaneniz varsa, o kütüphaneye bağımlı olan uygulama Angular sürüm 13 veya üstünü kullanmalıdır.
Angular, uygulama için daha eski bir sürüm kullanmayı desteklemez.

Kütüphanenizi npm'e yayınlamak istiyorsanız, `tsconfig.prod.json`'da `"compilationMode": "partial"` ayarlayarak partial-Ivy koduyla derleyin.
Bu kısmi format, Angular'ın farklı sürümleri arasında kararlıdır, bu nedenle npm'e yayınlamak güvenlidir.
Bu formattaki kod, uygulama derlemesi sırasında Angular derleyicisinin aynı sürümü kullanılarak işlenir ve uygulamanın ve tüm kütüphanelerinin tek bir Angular sürümü kullanmasını sağlar.

Oluşturulan Ivy talimatları Angular'ın genel API'sinin bir parçası olmadığından ve yama sürümleri arasında değişebileceğinden, npm'e yayınlıyorsanız kütüphaneleri full-Ivy koduyla derlemeyin.

npm'de daha önce hiç paket yayınlamadıysanız, bir kullanıcı hesabı oluşturmanız gerekir.
Daha fazla bilgi için bkz. [Publishing npm Packages](https://docs.npmjs.com/getting-started/publishing-npm-packages).

## Consuming partial-Ivy code outside the Angular CLI

Bir uygulama, `node_modules` dizinine npm'den birçok Angular kütüphanesi yükler.
Ancak bu kütüphanelerdeki kod, tam olarak derlenmediği için doğrudan derlenmiş uygulamayla birlikte paketlenemez.
Derlemeyi tamamlamak için Angular bağlayıcısını kullanın.

Angular CLI kullanmayan uygulamalar için bağlayıcı, bir [Babel](https://babeljs.io) eklentisi olarak mevcuttur.
Eklenti, `@angular/compiler-cli/linker/babel`'den içe aktarılır.

Angular bağlayıcı Babel eklentisi derleme önbelleklemeyi destekler, yani kütüphanelerin diğer npm işlemlerinden bağımsız olarak bağlayıcı tarafından yalnızca bir kez işlenmesi gerekir.

Bağlayıcıyı, [babel-loader](https://webpack.js.org/loaders/babel-loader/#options) kullanarak [Babel](https://babeljs.io) eklentisi olarak kaydederek özel bir [webpack](https://webpack.js.org) derlemesine entegre etme örneği.

<docs-code header="webpack.config.mjs" path="adev/src/content/examples/angular-linker-plugin/webpack.config.mjs" region="webpack-config"/>

HELPFUL: Angular CLI bağlayıcı eklentisini otomatik olarak entegre eder, dolayısıyla kütüphanenizin tüketicileri CLI kullanıyorsa, herhangi bir ek yapılandırma olmadan npm'den Ivy-native kütüphaneleri yükleyebilirler.
