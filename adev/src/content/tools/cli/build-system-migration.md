# Angular application build system

v17 ve üzeri sürümlerde, yeni derleme sistemi Angular uygulamalarını derlemek için geliştirilmiş bir yol sunar. Bu yeni derleme sistemi şunları içerir:

- Tembel modül yüklemesini desteklemek için dinamik import ifadeleri kullanan ESM ile modern bir çıktı formatı.
- Hem ilk derlemeler hem de artımlı yeniden derlemeler için daha hızlı derleme zamanı performansı.
- [esbuild](https://esbuild.github.io/) ve [Vite](https://vitejs.dev/) gibi daha yeni JavaScript ekosistemi araçları.
- Entegre SSR ve önceden oluşturma yetenekleri.
- Otomatik global ve bileşen stil sayfası sıcak değiştirme.

Bu yeni derleme sistemi kararlıdır ve Angular uygulamalarıyla kullanım için tam olarak desteklenir.
`browser` builder'ını kullanan uygulamalarla yeni derleme sistemine geçiş yapabilirsiniz.
Özel bir builder kullanıyorsanız, olası geçiş seçenekleri hakkında lütfen o builder'ın belgelerine bakın.

IMPORTANT: Mevcut webpack tabanlı derleme sistemi hâlâ kararlı ve tam olarak desteklenen olarak kabul edilmektedir.
Uygulamalar `browser` builder'ını kullanmaya devam edebilir ve projeler güncelleme sırasında geçiş yapmayı tercih etmeyebilir.

## For new applications

Yeni uygulamalar, `application` builder'ı aracılığıyla varsayılan olarak bu yeni derleme sistemini kullanacaktır.

## For existing applications

Projenin gereksinimlerine bağlı olarak hem otomatik hem de manuel prosedürler mevcuttur.
v18'den başlayarak, güncelleme süreci otomatik geçiş aracılığıyla mevcut uygulamaları yeni derleme sistemini kullanmaya geçirmek isteyip istemediğinizi soracaktır.
Geçiş yapmadan önce, projeniz için ilgili bilgiler içerebilecek [Bilinen Sorunlar](#known-issues) bölümünü incelemeyi düşünün.

HELPFUL: SSR kullanıyorsanız, uygulama sunucu kodundaki `require`, `__filename`, `__dirname` veya [CommonJS modül kapsamındaki](https://nodejs.org/api/modules.html#the-module-scope) diğer yapılar gibi CommonJS varsayımlarını kaldırmayı unutmayın. Tüm uygulama kodu ESM uyumlu olmalıdır. Bu, üçüncü taraf bağımlılıklar için geçerli değildir.

### Automated migration (Recommended)

Otomatik geçiş, `angular.json` içindeki uygulama yapılandırmasını ve önceki webpack'e özgü özellik kullanımını kaldırmak için kodu ve stil sayfalarını ayarlayacaktır.
Birçok değişiklik otomatikleştirilebilir ve çoğu uygulama ek değişiklik gerektirmez, ancak her uygulama benzersizdir ve bazı manuel değişiklikler gerekebilir.
Geçişten sonra lütfen uygulamayı derlemeyi deneyin çünkü kod içinde ayarlama gerektiren yeni hatalar olabilir.
Hatalar mümkün olduğunda soruna çözüm önerileri sunmaya çalışacaktır ve bu kılavuzun sonraki bölümleri karşılaşabileceğiniz daha yaygın durumlardan bazılarını açıklamaktadır.
Angular v18'e `ng update` aracılığıyla güncelleme yaparken, geçişi yürütmeniz istenecektir.
Bu geçiş v18 için tamamen isteğe bağlıdır ve bir güncellemeden sonra herhangi bir zamanda aşağıdaki komutla manuel olarak da çalıştırılabilir:

```shell

ng update @angular/cli --name use-application-builder

```

Geçiş şunları yapar:

- Mevcut `browser` veya `browser-esbuild` hedefini `application`'a dönüştürür
- Önceki SSR builder'larını kaldırır (çünkü `application` artık bunu yapar).
- Yapılandırmayı buna göre günceller.
- `tsconfig.server.json`'ı `tsconfig.app.json` ile birleştirir ve `express` import'larının [ESM uyumlu](#esm-default-imports-vs-namespace-imports) olmasını sağlamak için TypeScript seçeneği `"esModuleInterop": true`'yu ekler.
- Uygulama sunucu kodunu yeni önyükleme ve çıktı dizin yapısını kullanacak şekilde günceller.
- `@import`/`url()` içindeki tilde veya şapka gibi webpack'e özgü builder stil sayfası kullanımlarını kaldırır ve eşdeğer davranışı sağlamak için yapılandırmayı günceller
- Başka bir `@angular-devkit/build-angular` kullanımı bulunamazsa, yeni daha az bağımlılığa sahip `@angular/build` Node.js paketini kullanmaya dönüştürür.

### Manual migration

Ek olarak, mevcut projeler için uygulama bazında iki farklı seçenekle yeni builder'ı kullanmayı manuel olarak tercih edebilirsiniz.
Her iki seçenek de kararlı kabul edilir ve Angular ekibi tarafından tam olarak desteklenir.
Hangi seçeneğin kullanılacağı, geçiş için ne kadar değişiklik yapmanız gerektiğine ve projede hangi yeni özellikleri kullanmak istediğinize bağlıdır.

- `browser-esbuild` builder'ı, mevcut derleme sistemini sağlayan mevcut `browser` builder'ı ile uyumlu olacak şekilde tasarlanmış bir uygulamanın yalnızca istemci tarafı paketini derler.
  Bu builder eşdeğer derleme seçenekleri sunar ve birçok durumda mevcut `browser` uygulamaları için doğrudan yerine geçen bir çözüm olarak hizmet eder.
- `application` builder'ı, istemci tarafı paketi gibi tüm uygulamayı kapsar, ayrıca isteğe bağlı olarak sunucu tarafı oluşturma için bir sunucu derler ve statik sayfaların derleme zamanı önceden oluşturmasını gerçekleştirir.

`application` builder'ı genel olarak tercih edilir çünkü sunucu tarafı oluşturulan (SSR) derlemeleri iyileştirir ve istemci tarafı oluşturulan projelerin gelecekte SSR'yi benimsemesini kolaylaştırır.
Ancak, özellikle mevcut SSR uygulamaları için manuel olarak yapıldığında biraz daha fazla geçiş çabası gerektirir.
`application` builder'ının projeniz için benimsenmesi zorsa, `browser-esbuild` daha az bozucu değişiklikle derleme performans avantajlarının çoğunu sağlayan daha kolay bir çözüm olabilir.

#### Manual migration to the compatibility builder

`@angular-devkit/build-angular` paketinde, Angular CLI tarafından oluşturulan bir uygulamada bulunan `browser-esbuild` adlı bir builder mevcuttur.
`browser` builder'ını kullanan uygulamalar için yeni derleme sistemini deneyebilirsiniz.
Özel bir builder kullanıyorsanız, olası geçiş seçenekleri hakkında lütfen o builder'ın belgelerine bakın.

Uyumluluk seçeneği, uygulamalarınızı başlangıçta geçirmek için gereken değişiklik miktarını en aza indirmek amacıyla uygulanmıştır.
Bu, alternatif bir builder (`browser-esbuild`) aracılığıyla sağlanır.
Yeni derleme sistemine geçiş yapmak için herhangi bir uygulama hedefinin `build` hedefini güncelleyebilirsiniz.

`angular.json`'da bir uygulama için tipik olarak bulacağınız şey şudur:

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
```

`builder` alanını değiştirmek yapmanız gereken tek değişikliktir.

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser-esbuild",
...
```

#### Manual migration to the new `application` builder

`@angular-devkit/build-angular` paketinde, Angular CLI tarafından oluşturulan bir uygulamada bulunan `application` adlı bir builder de mevcuttur.
Bu builder, `ng new` aracılığıyla oluşturulan tüm yeni uygulamalar için varsayılandır.

`angular.json`'da bir uygulama için tipik olarak bulacağınız şey şudur:

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
```

`builder` alanını değiştirmek yapmanız gereken ilk değişikliktir.

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:application",
...
```

Builder adı değiştirildikten sonra, `build` hedefindeki seçeneklerin güncellenmesi gerekecektir.
Aşağıdaki liste, ayarlanması gereken tüm `browser` builder seçeneklerini tartışır.

- `main`, `browser` olarak yeniden adlandırılmalıdır.
- `polyfills`, tek bir dosya yerine bir dizi olmalıdır.
- `buildOptimizer` kaldırılmalıdır, çünkü bu `optimization` seçeneği tarafından karşılanır.
- `resourcesOutputPath` kaldırılmalıdır, bu artık her zaman `media`'dır.
- `vendorChunk` kaldırılmalıdır, çünkü bu artık gerekli olmayan bir performans optimizasyonuydu.
- `commonChunk` kaldırılmalıdır, çünkü bu artık gerekli olmayan bir performans optimizasyonuydu.
- `deployUrl` kaldırılmalıdır ve desteklenmez. Bunun yerine [`<base href>`](guide/routing/common-router-tasks) tercih edin. Daha fazla bilgi için [dağıtım belgelerine](tools/cli/deployment#--deploy-url) bakın.
- `ngswConfigPath`, `serviceWorker` olarak yeniden adlandırılmalıdır.

Uygulama şu anda SSR kullanmıyorsa, `ng build`'in çalışması için bu son adım olmalıdır.
İlk kez `ng build` çalıştırıldıktan sonra, davranışsal farklılıklara veya uygulamanın webpack'e özgü özellik kullanımına dayalı yeni uyarılar veya hatalar olabilir.
Uyarıların çoğu, sorunu nasıl çözeceğinize dair öneriler sunacaktır.
Bir uyarının yanlış olduğu veya çözümün belirgin olmadığı görülüyorsa, lütfen [GitHub](https://github.com/angular/angular-cli/issues) üzerinde bir sorun açın.
Ayrıca, bu kılavuzun sonraki bölümleri birkaç belirli durum ve mevcut bilinen sorunlar hakkında ek bilgi sağlamaktadır.

SSR konusunda yeni olan uygulamalar için, [Angular SSR Kılavuzu](guide/ssr) bir uygulamaya SSR ekleme kurulum süreci hakkında ek bilgi sağlar.

Halihazırda SSR kullanan uygulamalar için, yeni entegre SSR yeteneklerini desteklemek üzere uygulama sunucusunu güncellemek için ek ayarlamalar gerekecektir.
`application` builder'ı artık aşağıdaki mevcut builder'ların tamamı için entegre işlevsellik sağlamaktadır:

- `app-shell`
- `prerender`
- `server`
- `ssr-dev-server`

`ng update` süreci, bu builder'lardan bazılarının daha önce bulunduğu `@nguniversal` kapsamı paketlerinin kullanımlarını otomatik olarak kaldıracaktır.
Yeni `@angular/ssr` paketi de otomatik olarak eklenecek ve güncelleme sırasında yapılandırma ve kod ayarlanarak kullanılacaktır.
`@angular/ssr` paketi hem `browser` builder'ını hem de `application` builder'ını destekler.

## Executing a build

Uygulama yapılandırmasını güncelledikten sonra, derlemeler daha önce olduğu gibi `ng build` kullanılarak gerçekleştirilebilir.
Seçilen builder geçişine bağlı olarak, bazı komut satırı seçenekleri farklı olabilir.
Derleme komutu herhangi bir `npm` veya diğer betiklerde yer alıyorsa, bunların gözden geçirildiğinden ve güncellendiğinden emin olun.
`application` builder'ına geçiş yapmış ve SSR ve/veya önceden oluşturma kullanan uygulamalar için, artık `ng build`'in entegre SSR desteğine sahip olması nedeniyle betiklerden ek `ng run` komutlarını kaldırabilirsiniz.

```shell

ng build

```

## Starting the development server

Geliştirme sunucusu yeni derleme sistemini otomatik olarak algılayacak ve uygulamayı derlemek için kullanacaktır.
Geliştirme sunucusunu başlatmak için `dev-server` builder yapılandırmasında veya komut satırında herhangi bir değişiklik gerekmez.

```shell

ng serve

```

Geliştirme sunucusuyla daha önce kullandığınız [komut satırı seçeneklerini](/cli/serve) kullanmaya devam edebilirsiniz.

HELPFUL: Geliştirme sunucusuyla, sunucu başlatılırken küçük bir Stillenmemiş İçerik Yanıp Sönmesi (FOUC) görebilirsiniz.
Geliştirme sunucusu, yeniden derleme sürelerini iyileştirmek için stil sayfalarının işlenmesini ilk kullanıma kadar ertelemeye çalışır.
Bu, geliştirme sunucusu dışındaki derlemelerde oluşmayacaktır.

### Hot module replacement

Sıcak Modül Değiştirme (HMR), bir uygulamanın yalnızca bir parçası değiştirildiğinde tüm sayfanın yeniden yüklenmesini önlemek için geliştirme sunucuları tarafından kullanılan bir tekniktir.
Birçok durumda değişiklikler hemen tarayıcıda gösterilebilir ve bu, bir uygulamayı geliştirirken geliştirilmiş bir düzenleme/yenileme döngüsü sağlar.
Genel JavaScript tabanlı sıcak modül değiştirme (HMR) şu anda desteklenmese de, birkaç daha spesifik HMR biçimi mevcuttur:

- **global stil sayfası** (`styles` derleme seçeneği)
- **bileşen stil sayfası** (satır içi ve dosya tabanlı)
- **bileşen şablonu** (satır içi ve dosya tabanlı)

HMR yetenekleri otomatik olarak etkinleştirilir ve kullanmak için herhangi bir kod veya yapılandırma değişikliği gerektirmez.
Angular hem dosya tabanlı (`templateUrl`/`styleUrl`/`styleUrls`) hem de satır içi (`template`/`styles`) bileşen stilleri ve şablonları için HMR desteği sağlar.
Derleme sistemi, yalnızca bir stil sayfası değişikliği algıladığında minimum miktarda uygulama kodunu derlemeye ve işlemeye çalışacaktır.

Tercih edilirse, HMR yetenekleri `hmr` geliştirme sunucusu seçeneğini `false` olarak ayarlayarak devre dışı bırakılabilir.
Bu, komut satırından da şu şekilde değiştirilebilir:

```shell

ng serve --no-hmr

```

### Vite as a development server

Angular CLI'da Vite'ın kullanımı şu anda yalnızca bir _geliştirme sunucusu kapasitesindedir_. Temel Vite derleme sistemini kullanmasa bile, Vite düşük bağımlılıklı bir npm paketine paketlenmiş, istemci tarafı desteğine sahip tam özellikli bir geliştirme sunucusu sağlar. Bu, onu kapsamlı geliştirme sunucusu işlevselliği sağlamak için ideal bir aday yapar. Mevcut geliştirme sunucusu süreci, bellekte uygulamanın bir geliştirme derlemesini oluşturmak için yeni derleme sistemini kullanır ve sonuçları uygulamayı sunması için Vite'a iletir. Webpack tabanlı geliştirme sunucusu gibi Vite'ın kullanımı da Angular CLI `dev-server` builder'ı içinde kapsüllenmiştir ve şu anda doğrudan yapılandırılamaz.

### Prebundling

Ön paketleme, geliştirme sunucusunu kullanırken geliştirilmiş derleme ve yeniden derleme süreleri sağlar.
Vite, Angular CLI kullanılırken varsayılan olarak etkinleştirilen [ön paketleme yetenekleri](https://vite.dev/guide/dep-pre-bundling) sağlar.
Ön paketleme süreci, bir proje içindeki tüm üçüncü taraf proje bağımlılıklarını analiz eder ve geliştirme sunucusu ilk kez yürütüldüğünde bunları işler.
Bu süreç, her yeniden derlemede veya geliştirme sunucusu yürütüldüğünde projenin bağımlılıklarını yeniden derleme ve paketleme ihtiyacını ortadan kaldırır.

Çoğu durumda ek özelleştirme gerekmez. Ancak, gerekebilecek bazı durumlar şunlardır:

- Bağımlılık içindeki import'lar için yükleyici davranışını özelleştirme, örneğin [`loader` seçeneği](#file-extension-loader-customization)
- Bir bağımlılığı yerel geliştirme için yerel koda sembolik olarak bağlama, örneğin [`npm link`](https://docs.npmjs.com/cli/v10/commands/npm-link)
- Bir bağımlılığın ön paketlemesi sırasında karşılaşılan bir hatanın giderilmesi

Ön paketleme süreci tamamen devre dışı bırakılabilir veya bir projenin ihtiyaç duyması halinde bireysel bağımlılıklar hariç tutulabilir.
Bu özelleştirmeler için `dev-server` builder'ının `prebundle` seçeneği kullanılabilir.
Belirli bağımlılıkları hariç tutmak için `prebundle.exclude` seçeneği mevcuttur:

```json
    "serve": {
      "builder": "@angular/build:dev-server",
      "options": {
        "prebundle": {
          "exclude": ["some-dep"]
        }
      },
```

Varsayılan olarak, `prebundle` `true` olarak ayarlanmıştır ancak ön paketlemeyi tamamen devre dışı bırakmak için `false` olarak ayarlanabilir.
Ancak, ön paketleme devre dışı bırakıldığında yeniden derleme süreleri artacağından, belirli bağımlılıkları hariç tutmak önerilir.

```json
    "serve": {
      "builder": "@angular/build:dev-server",
      "options": {
        "prebundle": false
      },
```

## New features

Uygulama derleme sisteminin ana avantajlarından biri geliştirilmiş derleme ve yeniden derleme hızıdır.
Ancak yeni uygulama derleme sistemi, `browser` builder'ında bulunmayan ek özellikler de sağlar.

IMPORTANT: Burada açıklanan `application` builder'ının yeni özellikleri, dahili olarak `browser` builder'ını kullandığı için varsayılan olarak `karma` test builder'ı ile uyumlu değildir.
Kullanıcılar, `karma` builder'ı için `builderMode` seçeneğini `application` olarak ayarlayarak `application` builder'ını kullanmayı tercih edebilir.
Bu seçenek şu anda geliştirici önizlemesindedir.
Herhangi bir sorun fark ederseniz, lütfen [buradan](https://github.com/angular/angular-cli/issues) bildirin.

### Build-time value replacement with `define`

`define` seçeneği, kodda bulunan tanımlayıcıların derleme zamanında başka bir değerle değiştirilmesine olanak tanır.
Bu, daha önce üçüncü taraf builder'ları kullanan bazı özel Webpack yapılandırmalarında kullanılan Webpack'in `DefinePlugin`'inin davranışına benzerdir.
Seçenek, `angular.json` yapılandırma dosyasında veya komut satırında kullanılabilir.
`angular.json` içinde `define` yapılandırması, değerlerin sabit olduğu ve kaynak kontrolüne eklenebilecek durumlar için kullanışlıdır.

Yapılandırma dosyasında, seçenek bir nesne biçimindedir.
Nesnenin anahtarları değiştirilecek tanımlayıcıyı, nesnenin değerleri ise tanımlayıcı için karşılık gelen değiştirme değerini temsil eder.
Bir örnek şu şekildedir:

```json
  "build": {
    "builder": "@angular/build:application",
    "options": {
      ...
      "define": {
          "SOME_NUMBER": "5",
          "ANOTHER": "'this is a string literal, note the extra single quotes'",
          "REFERENCE": "globalThis.someValue.noteTheAbsentSingleQuotes"
      }
    }
  }
```

HELPFUL: Tüm değiştirme değerleri yapılandırma dosyasında dize olarak tanımlanır.
Değiştirmenin gerçek bir dize literali olması amaçlanıyorsa, tek tırnak işaretleri içine alınmalıdır.
Bu, herhangi bir geçerli JSON türünün yanı sıra farklı bir tanımlayıcının değiştirme olarak kullanılma esnekliğini sağlar.

Komut satırı kullanımı, git commit hash'i veya ortam değişkeni gibi her derleme yürütmesinde değişebilen değerler için tercih edilir.
CLI, komut satırından `--define` değerlerini `angular.json`'daki `define` değerleriyle birleştirir ve her ikisini de bir derlemeye dahil eder.
Aynı tanımlayıcı her ikisinde de mevcutsa komut satırı kullanımı önceliklidir.
Komut satırı kullanımı için, `--define` seçeneği `IDENTIFIER=VALUE` biçimini kullanır.

```shell
ng build --define SOME_NUMBER=5 --define "ANOTHER='these will overwrite existing'"
```

Ortam değişkenleri de bir derlemeye seçici olarak dahil edilebilir.
Windows dışı kabuklarda, hash literalinin etrafındaki tırnak işaretleri tercih edilirse doğrudan kaçırılabilir.
Bu örnek bash benzeri bir kabuk varsayar ancak diğer kabuklar için de benzer davranış mevcuttur.

```shell
export MY_APP_API_HOST="http://example.com"
export API_RETRY=3
ng build --define API_HOST=\'$MY_APP_API_HOST\' --define API_RETRY=$API_RETRY
```

Her iki kullanım için de TypeScript'in, derleme sırasında tür denetimi hatalarını önlemek üzere tanımlayıcıların türlerinden haberdar olması gerekir.
Bu, uygulama kaynak kodu içinde ek bir tür tanım dosyası ile gerçekleştirilebilir (örneğin `src/types.d.ts`) ve benzer içerikle:

```ts
declare const SOME_NUMBER: number;
declare const ANOTHER: string;
declare const GIT_HASH: string;
declare const API_HOST: string;
declare const API_RETRY: number;
```

Varsayılan proje yapılandırması, proje kaynak dizinlerinde bulunan herhangi bir tür tanım dosyasını kullanmak üzere zaten ayarlanmıştır.
Projenin TypeScript yapılandırması değiştirilmişse, yeni eklenen bu tür tanım dosyasına başvurmak için ayarlanması gerekebilir.

IMPORTANT: Bu seçenek, Component veya Directive dekoratörü gibi Angular meta verileri içindeki tanımlayıcıları değiştirmeyecektir.

### File extension loader customization

IMPORTANT: Bu özellik yalnızca `application` builder'ı ile kullanılabilir.

Bazı projeler, belirli bir dosya uzantısına sahip tüm dosyaların nasıl yükleneceğini ve bir uygulamaya nasıl paketleneceğini kontrol etmesi gerekebilir.
`application` builder'ını kullanırken, bu durumları ele almak için `loader` seçeneği kullanılabilir.
Seçenek, bir projenin belirtilen bir dosya uzantısıyla kullanılacak yükleyici türünü tanımlamasına olanak tanır.
Tanımlanan uzantıya sahip bir dosya daha sonra bir import deyimi veya dinamik import ifadesi aracılığıyla uygulama kodu içinde kullanılabilir.
Kullanılabilecek yükleyiciler şunlardır:

- `text` - içeriği varsayılan dışa aktarma olarak kullanılabilen bir `string` olarak satır içi yerleştirir
- `binary` - içeriği varsayılan dışa aktarma olarak kullanılabilen bir `Uint8Array` olarak satır içi yerleştirir
- `file` - dosyayı uygulama çıktı yoluna yayar ve dosyanın çalışma zamanı konumunu varsayılan dışa aktarma olarak sağlar
- `dataurl` - içeriği bir [data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) olarak satır içi yerleştirir.
- `base64` - içeriği Base64 kodlanmış bir dize olarak satır içi yerleştirir.
- `empty` - içeriği boş olarak kabul eder ve paketlere dahil etmez

`empty` değeri, daha az yaygın olmakla birlikte, kaldırılması gereken paketleyiciye özgü import kullanımı içerebilen üçüncü taraf kütüphanelerin uyumluluğu için yararlı olabilir.
Bunun bir örneği, tarayıcıda hiçbir etkisi olmayan CSS dosyalarının yan etkili import'larıdır (`import 'my.css';`).
Bunun yerine, proje `empty` kullanabilir ve ardından CSS dosyaları `styles` derleme seçeneğine eklenebilir veya başka bir enjeksiyon yöntemi kullanılabilir.

Loader seçeneği, anahtarların dosya uzantısını tanımlamak ve değerlerin yükleyici türünü tanımlamak için kullanıldığı nesne tabanlı bir seçenektir.

SVG dosyalarının içeriğini paketlenmiş uygulamaya satır içi yerleştirmek için derleme seçeneği kullanımının bir örneği şu şekilde olacaktır:

```json
  "build": {
    "builder": "@angular/build:application",
    "options": {
      ...
      "loader": {
        ".svg": "text"
      }
    }
  }
```

Bir SVG dosyası daha sonra içe aktarılabilir:

```ts
import contents from './some-file.svg';

console.log(contents); // <svg>...</svg>
```

Ek olarak, TypeScript'in derleme sırasında tür denetimi hatalarını önlemek için import'un modül türünden haberdar olması gerekir. Bu, uygulama kaynak kodu içinde ek bir tür tanım dosyası (örneğin `src/types.d.ts`) ile aşağıdaki veya benzer içerikle gerçekleştirilebilir:

```ts
declare module '*.svg' {
  const content: string;
  export default content;
}
```

Varsayılan proje yapılandırması, proje kaynak dizinlerinde bulunan herhangi bir tür tanım dosyasını (`.d.ts` dosyaları) kullanmak üzere zaten ayarlanmıştır. Projenin TypeScript yapılandırması değiştirilmişse, yeni eklenen bu tür tanım dosyasına başvurmak için tsconfig'in ayarlanması gerekebilir.

### Import attribute loader customization

Yalnızca belirli dosyaların belirli bir şekilde yüklenmesi gereken durumlar için, yükleme davranışı üzerinde dosya bazında kontrol mevcuttur.
Bu, hem import deyimleri hem de ifadeleriyle kullanılabilen bir `loader` [import özniteliği](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) ile gerçekleştirilir.
Import özniteliğinin varlığı, JS/TS ve herhangi bir `loader` derleme seçeneği değerleri dahil tüm diğer yükleme davranışlarına göre önceliklidir.
Desteklenmeyen bir dosya türünün tüm dosyaları için genel yükleme için [`loader`](#file-extension-loader-customization) derleme seçeneği önerilir.

Import özniteliği için aşağıdaki yükleyici değerleri desteklenir:

- `text` - içeriği varsayılan dışa aktarma olarak kullanılabilen bir `string` olarak satır içi yerleştirir
- `binary` - içeriği varsayılan dışa aktarma olarak kullanılabilen bir `Uint8Array` olarak satır içi yerleştirir
- `file` - dosyayı uygulama çıktı yoluna yayar ve dosyanın çalışma zamanı konumunu varsayılan dışa aktarma olarak sağlar
- `dataurl` - içeriği bir [data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) olarak satır içi yerleştirir.
- `base64` - içeriği Base64 kodlanmış bir dize olarak satır içi yerleştirir.

Import özniteliklerini kullanmak için ek bir gereksinim, TypeScript'in uygulama kodunu başarıyla derleyebilmesi için TypeScript `module` seçeneğinin `esnext` olarak ayarlanması gerektiğidir.
TypeScript içinde `ES2025` kullanılabilir olduğunda, bu değişiklik artık gerekli olmayacaktır.

Bu aşamada, TypeScript import öznitelik değerlerine dayalı tür tanımlarını desteklememektedir.
`@ts-expect-error`/`@ts-ignore` kullanımı veya bireysel tür tanım dosyalarının kullanımı (dosyanın yalnızca aynı loader özniteliğiyle içe aktarıldığı varsayılarak) şu anda gereklidir.
Örnek olarak, bir SVG dosyası metin olarak şu şekilde içe aktarılabilir:

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import contents from './some-file.svg' with {loader: 'text'};
```

Aynı şey bir async fonksiyon içindeki bir import ifadesiyle de gerçekleştirilebilir.

```ts
async function loadSvg(): Promise<string> {
  // @ts-expect-error TypeScript cannot provide types based on attributes yet
  return import('./some-file.svg', {with: {loader: 'text'}}).then((m) => m.default);
}
```

Import ifadesi için, `loader` değerinin statik olarak analiz edilebilmesi için bir dize literali olması gerekir.
Değer bir dize literali değilse bir uyarı verilecektir.

`file` yükleyicisi, bir dosyanın çalışma zamanında `fetch()`, bir görüntü öğesinin `src`'sine ayarlama veya benzeri bir yöntemle yükleneceği durumlarda yararlıdır.

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import imagePath from './image.webp' with {loader: 'file'};

console.log(imagePath); // media/image-ULK2SIIB.webp
```

`base64` yükleyicisi, bir dosyanın doğrudan pakete kodlanmış bir dize olarak gömülmesi ve daha sonra bir Data URL oluşturmak için kullanılması gerektiğinde yararlıdır.

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import logo from './logo.png' with {loader: 'base64'};

console.log(logo); // "iVBORw0KGgoAAAANSUhEUgAA..."
```

Varlıkları tam Data URL'leri olarak satır içi yerleştirmek için `dataurl` yükleyicisi.

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import icon from './icon.svg' with {loader: 'dataurl'};

console.log(icon); // "data:image/svg+xml;..."
```

Yukarıdaki kod yorumunda gösterildiği gibi üretim derlemeleri için, uzun süreli önbellekleme amacıyla yola otomatik olarak hash eklenir.

HELPFUL: Geliştirme sunucusunu kullanırken ve bir Node.js paketinden dosya içe aktarmak için `loader` özniteliği kullanırken, o paketin geliştirme sunucusu `prebundle` seçeneği aracılığıyla ön paketlemeden hariç tutulması gerekir.

### Import/export conditions

Projelerin, derleme türüne göre belirli import yollarını farklı dosyalara eşlemesi gerekebilir.
Bu, özellikle `ng serve`'in hata ayıklama/geliştirmeye özgü kodu kullanması gerektiği ancak `ng build`'in herhangi bir geliştirme özelliği/bilgisi olmayan kodu kullanması gerektiği durumlar için yararlı olabilir.
Bu proje ihtiyaçlarını desteklemek için birkaç import/export [koşulu](https://nodejs.org/api/packages.html#community-conditions-definitions) otomatik olarak uygulanır:

- Optimize edilmiş derlemeler için `production` koşulu etkinleştirilir.
- Optimize edilmemiş derlemeler için `development` koşulu etkinleştirilir.
- Tarayıcı çıktı kodu için `browser` koşulu etkinleştirilir.

Optimize edilmiş bir derleme, `optimization` seçeneğinin değerine göre belirlenir.
`optimization` `true` olarak ayarlandığında veya daha spesifik olarak `optimization.scripts` `true` olarak ayarlandığında, derleme optimize edilmiş kabul edilir.
Bu sınıflandırma hem `ng build` hem de `ng serve` için geçerlidir.
Yeni bir projede, `ng build` varsayılan olarak optimize edilmiş, `ng serve` ise varsayılan olarak optimize edilmemiştir.

Bu koşulları uygulama kodu içinde kullanmanın yararlı bir yöntemi, bunları [alt yol import'ları](https://nodejs.org/api/packages.html#subpath-imports) ile birleştirmektir.
Aşağıdaki import deyimini kullanarak:

```ts
import {verboseLogging} from '#logger';
```

Dosya, `package.json`'daki `imports` alanında değiştirilebilir:

```json
{
  ...
  "imports": {
    "#logger": {
      "development": "./src/logging/debug.ts",
      "default": "./src/logging/noop.ts"
    }
  }
}
```

SSR de kullanan uygulamalar için, tarayıcı ve sunucu kodu `browser` koşulu kullanılarak değiştirilebilir:

```json
{
  ...
  "imports": {
    "#crashReporter": {
      "browser": "./src/browser-logger.ts",
      "default": "./src/server-logger.ts"
    }
  }
}
```

Bu koşullar, Node.js paketleri ve paketler içinde tanımlanan herhangi bir [`exports`](https://nodejs.org/api/packages.html#conditional-exports) için de geçerlidir.

HELPFUL: Şu anda `fileReplacements` derleme seçeneğini kullanıyorsanız, bu özellik onun kullanımını değiştirebilir.

## Known Issues

Yeni derleme sistemini denerken karşılaşabileceğiniz şu anda bilinen birkaç sorun vardır. Bu liste güncel kalmak üzere güncellenecektir. Bu sorunlardan herhangi biri şu anda yeni derleme sistemini denemenizi engelliyorsa, çözülmüş olabileceği için gelecekte tekrar kontrol edin.

### Type-checking of Web Worker code and processing of nested Web Workers

Web Worker'lar, `browser` builder'ı ile desteklenen aynı sözdizimi (`new Worker(new URL('<workerfile>', import.meta.url))`) kullanılarak uygulama kodu içinde kullanılabilir.
Ancak Worker içindeki kod şu anda TypeScript derleyicisi tarafından tür denetiminden geçirilmeyecektir. TypeScript kodu desteklenir ancak tür denetimi yapılmaz.
Ek olarak, iç içe geçmiş worker'lar derleme sistemi tarafından işlenmeyecektir. İç içe geçmiş bir worker, başka bir Worker dosyası içindeki bir Worker başlatmasıdır.

### ESM default imports vs. namespace imports

TypeScript varsayılan olarak, varsayılan dışa aktarmaların namespace import'ları olarak içe aktarılmasına ve ardından çağrı ifadelerinde kullanılmasına izin verir.
Bu ne yazık ki ECMAScript spesifikasyonundan bir sapmadır.
Yeni derleme sistemi içindeki temel paketleyici (`esbuild`), spesifikasyona uygun ESM kodu bekler.
Derleme sistemi artık uygulamanız bir paketin yanlış türde import'unu kullanıyorsa bir uyarı üretecektir.
Ancak, TypeScript'in doğru kullanımı kabul etmesi için uygulamanın `tsconfig` dosyasında bir TypeScript seçeneğinin etkinleştirilmesi gerekir.
Etkinleştirildiğinde, [`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) seçeneği ECMAScript spesifikasyonu ile daha iyi uyum sağlar ve TypeScript ekibi tarafından da önerilir.
Etkinleştirildikten sonra, paket import'larını uygulanabilir olduğunda ECMAScript uyumlu bir biçime güncelleyebilirsiniz.

[`moment`](https://npmjs.com/package/moment) paketini örnek olarak kullanarak, aşağıdaki uygulama kodu çalışma zamanı hatalarına neden olacaktır:

```ts
import * as moment from 'moment';

console.log(moment().format());
```

Derleme, potansiyel bir sorun olduğunu bildirmek için bir uyarı üretecektir. Uyarı şuna benzer olacaktır:

```text
▲ [WARNING] Calling "moment" will crash at run-time because it's an import namespace object, not a function [call-import-namespace]

    src/main.ts:2:12:
      2 │ console.log(moment().format());
        ╵             ~~~~~~

Consider changing "moment" to a default import instead:

    src/main.ts:1:7:
      1 │ import * as moment from 'moment';
        │        ~~~~~~~~~~~
        ╵        moment

```

Ancak, uygulama için `esModuleInterop` TypeScript seçeneğini etkinleştirerek ve import'u aşağıdaki şekilde değiştirerek çalışma zamanı hatalarından ve uyarıdan kaçınabilirsiniz:

```ts
import moment from 'moment';

console.log(moment().format());
```

### Order-dependent side-effectful imports in lazy modules

Belirli bir sıralamaya bağlı olan ve birden fazla tembel modülde de kullanılan import deyimleri, üst düzey ifadelerin sıra dışı yürütülmesine neden olabilir.
Bu, yan etkili modüllerin kullanımına bağlı olduğu ve `polyfills` seçeneği için geçerli olmadığı için yaygın değildir.
Bu, temel paketleyicideki bir [kusurdan](https://github.com/evanw/esbuild/issues/399) kaynaklanır ancak gelecekteki bir güncellemede ele alınacaktır.

IMPORTANT: Kullanılan derleme sisteminden bağımsız olarak, mümkün olduğunda yerel olmayan yan etkilere sahip modüllerin (polyfill'ler dışında) kullanımından kaçınılması önerilir ve bu özel sorunu da önler. Yerel olmayan yan etkilere sahip modüller hem uygulama boyutu hem de çalışma zamanı performansı üzerinde olumsuz etkiye sahip olabilir.

### Output location changes

Varsayılan olarak, application builder'ın başarılı bir derlemesinden sonra paket `dist/<project-name>/browser` dizininde bulunur (browser builder'ı için `dist/<project-name>` yerine).
Bu, önceki konuma dayanan bazı araç zincirlerini bozabilir. Bu durumda, ihtiyaçlarınıza uygun şekilde [çıktı yolunu yapılandırabilirsiniz](reference/configs/workspace-config#output-path-configuration).

## Bug reports

Sorunları ve özellik isteklerini [GitHub](https://github.com/angular/angular-cli/issues) üzerinden bildirin.

Ekibin sorunları ele almasına yardımcı olmak için lütfen mümkün olduğunda minimal bir yeniden üretim sağlayın.
