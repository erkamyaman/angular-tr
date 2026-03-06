# Angular derleyici seçenekleri

[Önceden derleme (AOT)](tools/cli/aot-compiler) kullandığınızda, [TypeScript yapılandırma dosyasında](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) Angular derleyici seçeneklerini belirterek uygulamanızın nasıl derleneceğini kontrol edebilirsiniz.

Angular seçenekler nesnesi `angularCompilerOptions`, TypeScript derleyicisine standart seçenekler sağlayan `compilerOptions` nesnesinin kardeşidir.

<docs-code header="tsconfig.json" path="adev/src/content/examples/angular-compiler-options/tsconfig.json" region="angular-compiler-options"/>

## `extends` ile yapılandırma devralma

TypeScript derleyicisi gibi, Angular AOT derleyicisi de TypeScript yapılandırma dosyasının `angularCompilerOptions` bölümünde `extends` özelliğini destekler.
`extends` özelliği, `compilerOptions` ve `angularCompilerOptions` ile paralel olarak en üst düzeyde bulunur.

Bir TypeScript yapılandırması, `extends` özelliğini kullanarak başka bir dosyadan ayarları devralabilir.
Temel dosyadaki yapılandırma seçenekleri önce yüklenir, ardından devralan yapılandırma dosyasındakiler tarafından geçersiz kılınır.

Örneğin:

<docs-code header="tsconfig.app.json" path="adev/src/content/examples/angular-compiler-options/tsconfig.app.json" region="angular-compiler-options-app"/>

Daha fazla bilgi için [TypeScript El Kitabı](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)'na bakın.

## Şablon seçenekleri

Aşağıdaki seçenekler Angular AOT derleyicisini yapılandırmak için kullanılabilir.

### `annotationsAs`

Angular'a özgü açıklamaların tree-shaking'i iyileştirmek için nasıl yayılacağını değiştirir.
Angular dışındaki açıklamalar etkilenmez.
`static fields` veya `decorators` değerlerinden biri. Varsayılan değer `static fields`'dır.

- Varsayılan olarak, derleyici dekoratörleri sınıfta statik bir alan ile değiştirir; bu, [Closure compiler](https://github.com/google/closure-compiler) gibi gelişmiş tree-shaker'ların kullanılmayan sınıfları kaldırmasına olanak tanır
- `decorators` değeri dekoratörleri yerinde bırakır, bu da derlemeyi daha hızlı hale getirir.
  TypeScript, `__decorate` yardımcısına çağrılar yayar.
  Çalışma zamanı yansıması için `--emitDecoratorMetadata` kullanın.

  HELPFUL: Elde edilen kodun düzgün bir şekilde tree-shake yapılamayacağını unutmayın.

### `annotateForClosureCompiler`

<!-- vale Angular.Angular_Spelling = NO -->

`true` olduğunda, yayılan JavaScript'i [Closure Compiler](https://github.com/google/closure-compiler) tarafından ihtiyaç duyulan [JSDoc](https://jsdoc.app) yorumlarıyla açıklamak için [Tsickle](https://github.com/angular/tsickle) kullanır.
Varsayılan değer `false`'tur.

<!-- vale Angular.Angular_Spelling = YES -->

### `compilationMode`

Kullanılacak derleme modunu belirtir.
Aşağıdaki modlar mevcuttur:

| Modlar      | Ayrıntılar                                                                      |
| :---------- | :------------------------------------------------------------------------------ |
| `'full'`    | Şu anda kullanılmakta olan Angular sürümüne göre tam AOT derlenmiş kod üretir.  |
| `'partial'` | Yayımlanmış bir kütüphane için uygun, kararlı ancak ara bir biçimde kod üretir. |

Varsayılan değer `'full'`'dur.

Çoğu uygulama için `'full'` doğru derleme modudur.

Bağımsız olarak yayımlanan kütüphaneler için, NPM paketleri gibi, `'partial'` kullanın.
`'partial'` derlemeleri, kütüphaneden farklı Angular sürümlerinde oluşturulan uygulamalar tarafından kullanımı daha iyi destekleyen kararlı, ara bir biçim çıktısı verir.
Uygulamalarıyla birlikte "HEAD"de oluşturulan ve mono-depo gibi aynı Angular sürümünü kullanan kütüphaneler, sürüm uyumsuzluğu riski olmadığından `'full'` kullanabilir.

### `disableExpressionLowering`

`true` olduğunda (varsayılan), bir açıklamada kullanılan veya kullanılabilecek kodu, şablon fabrika modüllerinden içe aktarılmasına izin vermek için dönüştürür.
Daha fazla bilgi için [metadata yeniden yazma](tools/cli/aot-compiler#metadata-rewriting) bölümüne bakın.

`false` olduğunda, bu yeniden yazmayı devre dışı bırakır ve yeniden yazmanın manuel olarak yapılmasını gerektirir.

### `disableTypeScriptVersionCheck`

`true` olduğunda, derleyici TypeScript sürümüne bakmaz ve desteklenmeyen bir TypeScript sürümü kullanıldığında hata bildirmez.
Desteklenmeyen TypeScript sürümlerinin tanımsız davranışlara sahip olabileceğinden önerilmez.
Varsayılan değer `false`'tur.

### `enableI18nLegacyMessageIdFormat`

Angular şablon derleyicisine, şablonlarda `i18n` özelliği ile etiketlenen mesajlar için eski kimlikler oluşturma talimatı verir.
Mesajları yerelleştirme için işaretleme hakkında daha fazla bilgi için [Bileşen şablonunda metin işaretleme][GuideI18nCommonPrepareMarkTextInComponentTemplate] bölümüne bakın.

Projeniz eski kimlikler kullanılarak oluşturulan çevirilere dayanmıyorsa bu seçeneği `false` olarak ayarlayın.
Varsayılan değer `true`'dur.

Ivy öncesi mesaj çıkarma araçları, çıkarılan mesaj kimlikleri için çeşitli eski biçimler oluşturuyordu.
Bu mesaj biçimlerinde, boşluk işleme ve bir şablonun orijinal HTML'sindeki bilgilere bağımlılık gibi bazı sorunlar vardır.

Yeni mesaj biçimi, boşluk değişikliklerine karşı daha dayanıklıdır, tüm çeviri dosyası biçimlerinde aynıdır ve doğrudan `$localize` çağrılarından oluşturulabilir.
Bu, uygulama kodundaki `$localize` mesajlarının, bileşen şablonlarındaki aynı `i18n` mesajlarıyla aynı kimliği kullanmasına olanak tanır.

### `enableResourceInlining`

`true` olduğunda, tüm `@Component` dekoratörlerindeki `templateUrl` ve `styleUrls` özelliklerini `template` ve `styles` özelliklerindeki satır içi içerikle değiştirir.

Etkinleştirildiğinde, `ngc`'nin `.js` çıktısı herhangi bir tembel yüklenen şablon veya stil URL'si içermez.

Angular CLI ile oluşturulan kütüphane projeleri için geliştirme yapılandırması varsayılanı `true`'dur.

### `enableLegacyTemplate`

`true` olduğunda, `<ng-template>` yerine kullanımdan kaldırılmış `<template>` öğesini etkinleştirir.
Varsayılan değer `false`'tur.
Bazı üçüncü taraf Angular kütüphaneleri tarafından gerekli olabilir.

### `flatModuleId`

Düz bir modülü içe aktarmak için kullanılan modül kimliği \(`flatModuleOutFile` `true` olduğunda\).
Şablon derleyicisi tarafından oluşturulan referanslar, düz modülden semboller içe aktarırken bu modül adını kullanır.
`flatModuleOutFile` `false` ise yok sayılır.

### `flatModuleOutFile`

`true` olduğunda, verilen dosya adının düz modül dizini ve karşılık gelen düz modül metadata'sını oluşturur.
`@angular/core` ve `@angular/common`'a benzer şekilde paketlenen düz modüller oluşturmak için kullanın.
Bu seçenek kullanıldığında, kütüphanenin `package.json` dosyası, kütüphane dizin dosyası yerine oluşturulan düz modül dizinine referans vermelidir.

Kütüphane dizininden dışa aktarılan semboller için gerekli tüm metadata'yı içeren yalnızca bir `.metadata.json` dosyası üretir.
Oluşturulan `.ngfactory.js` dosyalarında, sembolleri içe aktarmak için düz modül dizini kullanılır. Semboller, kütüphane dizinindeki genel API'yi ve gizlenmiş iç sembolleri içerir.

Varsayılan olarak, `files` alanında sağlanan `.ts` dosyasının kütüphane dizini olduğu varsayılır.
Birden fazla `.ts` dosyası belirtilmişse, kullanılacak dosyayı seçmek için `libraryIndex` kullanılır.
Birden fazla `.ts` dosyası `libraryIndex` olmadan sağlanırsa bir hata üretilir.

Düz modül dizini `.d.ts` ve `.js`, kütüphane dizini `.d.ts` dosyasıyla aynı konumda verilen `flatModuleOutFile` adıyla oluşturulur.

Örneğin, bir kütüphane modülün kütüphane dizini olarak `public_api.ts` dosyasını kullanıyorsa, `tsconfig.json` `files` alanı `["public_api.ts"]` olur.
`flatModuleOutFile` seçeneği daha sonra örneğin `"index.js"` olarak ayarlanabilir, bu da `index.d.ts` ve `index.metadata.json` dosyaları üretir.
Kütüphanenin `package.json`'ındaki `module` alanı `"index.js"` ve `typings` alanı `"index.d.ts"` olur.

### `fullTemplateTypeCheck`

`true` olduğunda (önerilen değer), şablon derleyicisinin bağlama ifadesi doğrulama aşamasını etkinleştirir. Bu aşama, bağlama ifadelerini doğrulamak için TypeScript kullanır.
Daha fazla bilgi için [Şablon tür denetimi](tools/cli/template-typecheck) bölümüne bakın.

Varsayılan değer `false`'tur, ancak Angular CLI komutu `ng new --strict` kullandığınızda, yeni projenin yapılandırmasında `true` olarak ayarlanır.

IMPORTANT: `fullTemplateTypeCheck` seçeneği, `strictTemplates` derleyici seçenekleri ailesi lehine Angular 13'te kullanımdan kaldırılmıştır.

### `generateCodeForLibraries`

`true` olduğunda, karşılık gelen `.metadata.json` dosyası olan `.d.ts` dosyaları için fabrika dosyaları \(`.ngfactory.js` ve `.ngstyle.js`\) oluşturur. Varsayılan değer `true`'dur.

`false` olduğunda, fabrika dosyaları yalnızca `.ts` dosyaları için oluşturulur.
Fabrika özetleri kullanırken bunu yapın.

### `preserveWhitespaces`

`false` olduğunda (varsayılan), derlenmiş şablonlardan boş metin düğümlerini kaldırır, bu da daha küçük yayılan şablon fabrika modülleriyle sonuçlanır.
Boş metin düğümlerini korumak için `true` olarak ayarlayın.

HELPFUL: Hidrasyon kullanırken, varsayılan değer olan `preserveWhitespaces: false` kullanmanız önerilir. Boşlukları korumayı `preserveWhitespaces: true` ekleyerek etkinleştirmeyi seçerseniz, hidrasyon ile ilgili sorunlarla karşılaşabilirsiniz. Bu henüz tam olarak desteklenen bir yapılandırma değildir. Bunun sunucu ve istemci tsconfig dosyaları arasında tutarlı bir şekilde ayarlandığından emin olun. Daha fazla ayrıntı için [hidrasyon kılavuzuna](guide/hydration#boşlukları-koruma-yapılandırması) bakın.

### `skipMetadataEmit`

`true` olduğunda, `.metadata.json` dosyaları üretmez.
Varsayılan değer `false`'tur.

`.metadata.json` dosyaları, TypeScript derleyicisi tarafından üretilen `.d.ts` dosyasına dahil edilmeyen, bir `.ts` dosyasından şablon derleyicisi tarafından ihtiyaç duyulan bilgileri içerir.
Bu bilgiler, örneğin bir bileşenin şablonu gibi, TypeScript'in `.js` dosyasına yayıp `.d.ts` dosyasına yaymadığı açıklamaların içeriğini kapsar.

Fabrika özetleri kullanırken `true` olarak ayarlayabilirsiniz, çünkü fabrika özetleri `.metadata.json` dosyasındaki bilgilerin bir kopyasını içerir.

TypeScript'in `--outFile` seçeneğini kullanıyorsanız `true` olarak ayarlayın, çünkü metadata dosyaları bu tarz TypeScript çıktısı için geçerli değildir.
Angular topluluğu, Angular ile `--outFile` kullanılmasını önermez.
Bunun yerine [webpack](https://webpack.js.org) gibi bir paketleyici kullanın.

### `skipTemplateCodegen`

`true` olduğunda, `.ngfactory.js` ve `.ngstyle.js` dosyalarını yaymaz.
Bu, şablon derleyicisinin çoğunu kapatır ve şablon tanılama raporlamasını devre dışı bırakır.

Şablon derleyicisine, bir `npm` paketi ile dağıtım için `.metadata.json` dosyaları üretme talimatı vermek için kullanılabilir. Bu, `npm`'e dağıtılamayan `.ngfactory.js` ve `.ngstyle.js` dosyalarının üretimini önler.

Angular CLI ile oluşturulan kütüphane projeleri için geliştirme yapılandırması varsayılanı `true`'dur.

### `strictMetadataEmit`

`true` olduğunda, `"skipMetadataEmit"` `false` ise `.metadata.json` dosyasına bir hata bildirir.
Varsayılan değer `false`'tur.
Yalnızca `"skipMetadataEmit"` `false` ve `"skipTemplateCodegen"` `true` olduğunda kullanın.

Bu seçenek, bir `npm` paketi ile paketleme için yayılan `.metadata.json` dosyalarını doğrulamayı amaçlar.
Doğrulama katıdır ve şablon derleyicisi tarafından kullanıldığında asla hata üretmeyecek metadata için hatalar yayabilir.
Bu seçenek tarafından yayılan hatayı, sembolü belgeleyen yoruma `@dynamic` ekleyerek dışa aktarılan bir sembol için bastırabilirsiniz.

`.metadata.json` dosyalarının hata içermesi geçerlidir.
Metadata, bir açıklamanın içeriğini belirlemek için kullanıldığında şablon derleyicisi bu hataları bildirir.
Metadata toplayıcı, bir açıklamada kullanılmak üzere tasarlanmış sembolleri tahmin edemez. Dışa aktarılan semboller için metadata'da önceden hata düğümlerini dahil eder.
Şablon derleyicisi daha sonra bu semboller kullanıldığında bir hata bildirmek için hata düğümlerini kullanabilir.

Bir kütüphanenin istemcisi bir açıklamada bir sembol kullanmayı amaçlıyorsa, şablon derleyicisi bunu normalde bildirmez. İstemci sembolü gerçekten kullandıktan sonra bildirilir.
Bu seçenek, kütüphanenin derleme aşamasında bu hataların algılanmasını sağlar ve örneğin Angular kütüphanelerinin kendilerinin üretilmesinde kullanılır.

Angular CLI ile oluşturulan kütüphane projeleri için geliştirme yapılandırması varsayılanı `true`'dur.

### `strictInjectionParameters`

`true` olduğunda, enjeksiyon türü belirlenemeyen sağlanan bir parametre için hata bildirir.
`false` olduğunda, türü çözümlenemeyen `@Injectable` ile işaretlenmiş sınıfların yapıcı parametreleri bir uyarı üretir.
Önerilen değer `true`'dur, ancak varsayılan değer `false`'tur.

Angular CLI komutu `ng new --strict` kullandığınızda, oluşturulan projenin yapılandırmasında `true` olarak ayarlanır.

### `strictTemplates`

`true` olduğunda, [katı şablon tür denetimini](tools/cli/template-typecheck#katı-mod) etkinleştirir.

Bu seçeneğin etkinleştirdiği katılık bayrakları, belirli katı şablon tür denetimi türlerini açıp kapatmanıza olanak tanır.
[Şablon hatalarını giderme](tools/cli/template-typecheck#şablon-hatalarını-giderme) bölümüne bakın.

Angular CLI komutu `ng new --strict` kullandığınızda, yeni projenin yapılandırmasında `true` olarak ayarlanır.

### `strictStandalone`

`true` olduğunda, bir bileşen, direktif veya pipe standalone değilse hata bildirir.

### `trace`

`true` olduğunda, şablonlar derlenirken ekstra bilgi yazdırır.
Varsayılan değer `false`'tur.

## Komut satırı seçenekleri

Çoğu zaman, Angular Derleyicisi ile dolaylı olarak [Angular CLI](reference/configs/angular-compiler-options) kullanarak etkileşimde bulunursunuz. Belirli sorunları hata ayıklarken, Angular Derleyicisini doğrudan çağırmayı faydalı bulabilirsiniz.
`@angular/compiler-cli` npm paketi tarafından sağlanan `ngc` komutunu kullanarak derleyiciyi komut satırından çağırabilirsiniz.

`ngc` komutu, TypeScript'in `tsc` derleyici komutunun bir sarmalayıcısıdır. Angular Derleyicisi öncelikle `tsconfig.json` aracılığıyla yapılandırılırken, Angular CLI öncelikle `angular.json` aracılığıyla yapılandırılır.

Yapılandırma dosyasının yanı sıra, `ngc`'yi yapılandırmak için [`tsc` komut satırı seçeneklerini](https://www.typescriptlang.org/docs/handbook/compiler-options.html) de kullanabilirsiniz.

[GuideI18nCommonPrepareMarkTextInComponentTemplate]: guide/i18n/prepare#bileşen-şablonunda-metni-işaretleme 'Mark text in component template - Prepare component for translation | Angular'
