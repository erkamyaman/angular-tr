# Angular package format

Bu belge Angular Paket Formatını \(APF\) açıklar.
APF, tüm birinci taraf Angular paketleri \(`@angular/core`, `@angular/material`, vb.\) ve çoğu üçüncü taraf Angular kütüphanesi tarafından kullanılan, npm paketlerinin yapısı ve formatı için Angular'a özgü bir spesifikasyondur.

APF, bir paketin Angular kullanan en yaygın senaryolarda sorunsuz çalışmasını sağlar.
APF kullanan paketler, Angular ekibi tarafından sunulan araçlar ve daha geniş JavaScript ekosistemiyle uyumludur.
Üçüncü taraf kütüphane geliştiricilerinin aynı npm paket formatını izlemeleri önerilir.

HELPFUL: APF, Angular'ın geri kalanıyla birlikte sürümlenir ve her ana sürüm paket formatını iyileştirir.
v13 öncesi spesifikasyonun sürümlerini bu [google doc](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview)'da bulabilirsiniz.

## Why specify a package format?

Günümüz JavaScript ortamında, geliştiriciler paketleri birçok farklı araç zinciri \(webpack, Rollup, esbuild, vb.\) kullanarak çeşitli yollarla tüketir.
Bu araçlar farklı girdileri anlayabilir ve gerektirebilir - bazı araçlar en son ES dil sürümünü işleyebilirken, diğerleri doğrudan daha eski bir ES sürümünü tüketmekten fayda görebilir.

Angular dağıtım formatı, yaygın olarak kullanılan tüm geliştirme araçlarını ve iş akışlarını destekler ve daha küçük uygulama yük boyutu veya daha hızlı geliştirme iterasyon döngüsü \(derleme süresi\) ile sonuçlanan optimizasyonlara vurgu yapar.

Geliştiriciler, Angular Paket Formatında paketler üretmek için Angular CLI'ye ve [ng-packagr](https://github.com/ng-packagr/ng-packagr)'a \(Angular CLI'nin kullandığı bir derleme aracı\) güvenebilir.
Daha fazla ayrıntı için [Creating Libraries](tools/libraries/creating-libraries) kılavuzuna bakın.

## File layout

Aşağıdaki örnek, `@angular/core` paketinin dosya düzeninin basitleştirilmiş bir sürümünü ve paketteki her dosya için bir açıklama gösterir.

```markdown
node_modules/@angular/core
├── README.md
├── package.json
├── fesm2022
│ ├── core.mjs
│ ├── core.mjs.map
│ ├── testing.mjs
│ └── testing.mjs.map
└── types
│ ├── core.d.ts
│ ├── testing.d.ts
```

Bu tablo, dosya ve dizinlerin amacını açıklamak için açıklamalı `node_modules/@angular/core` altındaki dosya düzenini tanımlar:

| Files                                                                                                                                                     | Purpose                                                                                                                                                                                                                          |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                                                                                                                                               | npmjs web arayüzü tarafından kullanılan paket README dosyası.                                                                                                                                                                    |
| `package.json`                                                                                                                                            | Paketin kendisini ve tüm mevcut giriş noktalarını ve kod formatlarını açıklayan birincil `package.json`. Bu dosya, çalışma zamanları ve araçlar tarafından modül çözümlemesi yapmak için kullanılan "exports" eşlemesini içerir. |
| `fesm2022/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | Kaynak haritalarıyla birlikte düzleştirilmiş \(FESM\) ES2022 formatındaki tüm giriş noktaları için kod.                                                                                                                          |
| `types/` <br /> &nbsp;&nbsp;─ `core.d.ts` <br /> &nbsp;&nbsp;─ `testing.d.ts`                                                                             | Tüm genel giriş noktaları için paketlenmiş TypeScript tip tanımlamaları.                                                                                                                                                         |

## `package.json`

Birincil `package.json` aşağıdakiler dahil olmak üzere önemli paket meta verilerini içerir:

- Paketi EcmaScript Modülü \(ESM\) formatında olduğunu [bildirir](#esm-declaration)
- Tüm giriş noktalarının mevcut kaynak kodu formatlarını tanımlayan bir `"exports"` alanı içerir
- `"exports"`'u anlamayan araçlar için birincil `@angular/core` giriş noktasının mevcut kaynak kodu formatlarını tanımlayan [anahtarlar](#legacy-resolution-keys) içerir.
  Bu anahtarlar kullanımdan kaldırılmış olarak kabul edilir ve `"exports"` desteği ekosistem genelinde yaygınlaştıkça kaldırılabilir.

- Paketin [yan etkileri](#side-effects) içerip içermediğini bildirir

### ESM declaration

Üst düzey `package.json` şu anahtarı içerir:

```js
{
  "type": "module"
}
```

Bu, çözümleyicilere paketteki kodun CommonJS modülleri yerine EcmaScript Modülleri kullandığını bildirir.

### `"exports"`

`"exports"` alanı aşağıdaki yapıya sahiptir:

```js
"exports": {
  "./schematics/*": {
    "default": "./schematics/*.js"
  },
  "./package.json": {
    "default": "./package.json"
  },
  ".": {
    "types": "./types/core.d.ts",
    "default": "./fesm2022/core.mjs"
  },
  "./testing": {
    "types": "./types/testing.d.ts",
    "default": "./fesm2022/testing.mjs"
  }
}
```

Birincil ilgi alanı, sırasıyla `@angular/core` birincil giriş noktası ve `@angular/core/testing` ikincil giriş noktası için mevcut kod formatlarını tanımlayan `"."` ve `"./testing"` anahtarlarıdır.
Her giriş noktası için mevcut formatlar şunlardır:

| Formats                   | Details                                                                                     |
| :------------------------ | :------------------------------------------------------------------------------------------ |
| Typings \(`.d.ts` files\) | `.d.ts` dosyaları, belirli bir pakete bağımlı olunduğunda TypeScript tarafından kullanılır. |
| `default`                 | Tek bir kaynağa düzleştirilmiş ES2022 kodu.                                                 |

Bu anahtarların farkında olan araçlar, `"exports"`'tan tercih edilen bir kod formatını seçebilir.

Kütüphaneler, JavaScript tabanlı giriş noktalarının dışa aktarımları tarafından yakalanmayan Sass mixin'leri veya önceden derlenmiş CSS gibi ek statik dosyaları sunmak isteyebilir.

Daha fazla bilgi için bkz. [Managing assets in a library](tools/libraries/creating-libraries#managing-assets-in-a-library).

### Legacy resolution keys

`"exports"`'a ek olarak, üst düzey `package.json` ayrıca `"exports"`'u desteklemeyen çözümleyiciler için eski modül çözümleme anahtarları tanımlar.
`@angular/core` için bunlar şunlardır:

```js
{
  "module": "./fesm2022/core.mjs",
  "typings": "./types/core.d.ts",
}
```

Önceki kod parçacığında gösterildiği gibi, bir modül çözümleyici belirli bir kod formatını yüklemek için bu anahtarları kullanabilir.

### Side effects

`package.json`'ın son işlevi, paketin [yan etkileri](#sideeffects-flag) içerip içermediğini bildirmektir.

```js
{
  "sideEffects": false
}
```

Çoğu Angular paketi üst düzey yan etkilere bağlı olmamalıdır ve bu nedenle bu bildirimi içermelidir.

## Entrypoints and code splitting

Angular Paket Formatındaki paketler bir birincil giriş noktası ve sıfır veya daha fazla ikincil giriş noktası \(örneğin `@angular/common/http`\) içerir.
Giriş noktaları çeşitli işlevlere hizmet eder.

1. Kullanıcıların kod içe aktardığı modül belirleyicilerini tanımlarlar \(örneğin, `@angular/core` ve `@angular/core/testing`\).

   Kullanıcılar genellikle bu giriş noktalarını farklı amaçlara veya yeteneklere sahip ayrı sembol grupları olarak algılar.

   Belirli giriş noktaları yalnızca test gibi özel amaçlar için kullanılabilir.
   Bu tür API'ler, yanlışlıkla veya hatalı kullanılma olasılığını azaltmak için birincil giriş noktasından ayrılabilir.

1. Kodun tembel yüklenebildiği ayrıntı düzeyini tanımlarlar.

   Birçok modern derleme aracı yalnızca ES Modülü düzeyinde "kod bölme" \(diğer adıyla tembel yükleme\) yapabilir.
   Angular Paket Formatı, giriş noktası başına temel olarak tek bir "düz" ES Modülü kullanır. Bu, çoğu derleme aracının tek bir giriş noktasındaki kodu birden fazla çıktı parçasına bölemediği anlamına gelir.

APF paketleri için genel kural, mantıksal olarak bağlı en küçük kod kümeleri için giriş noktaları kullanmaktır.
Örneğin, Angular Material paketi her mantıksal bileşeni veya bileşen kümesini ayrı bir giriş noktası olarak yayınlar - Button için bir tane, Tabs için bir tane, vb.
Bu, istenirse her Material bileşeninin ayrı ayrı tembel yüklenmesine olanak tanır.

Tüm kütüphaneler böyle bir ayrıntı düzeyi gerektirmez.
Tek bir mantıksal amaca sahip çoğu kütüphane, tek bir giriş noktası olarak yayınlanmalıdır.
Örneğin `@angular/core`, çalışma zamanı için tek bir giriş noktası kullanır çünkü Angular çalışma zamanı genellikle tek bir varlık olarak kullanılır.

### Resolution of secondary entry points

İkincil giriş noktaları, paketin `package.json`'ındaki `"exports"` alanı aracılığıyla çözümlenebilir.

## README.md

npm ve GitHub'da bir paketin açıklamasını görüntülemek için kullanılan Markdown formatındaki README dosyası.

@angular/core paketinin örnek README içeriği:

```html
Angular &equals;&equals;&equals;&equals;&equals;&equals;&equals; The sources for this package are in
the main [Angular](https://github.com/angular/angular) repo.Please file issues and pull requests
against that repo. License: MIT
```

## Partial compilation

Angular Paket Formatındaki kütüphaneler "kısmi derleme" modunda yayınlanmalıdır.
Bu, `ngc` için Angular derleyicisi ve çalışma zamanı sürümlerinin tam olarak eşleşmesi gereken uygulamalar için kullanılan tam derlemenin aksine, belirli bir Angular çalışma zamanı sürümüne bağlı olmayan derlenmiş Angular kodu üreten bir derleme modudur.

Angular kodunu kısmen derlemek için `tsconfig.json`'unuzdaki `angularCompilerOptions` özelliğinde `compilationMode` bayrağını kullanın:

```js
{
  …
  "angularCompilerOptions": {
    "compilationMode": "partial",
  }
}
```

Kısmen derlenmiş kütüphane kodu, daha sonra uygulama derleme sürecinde Angular CLI tarafından tam olarak derlenmiş koda dönüştürülür.

Derleme süreciniz Angular CLI kullanmıyorsa [Consuming partial ivy code outside the Angular CLI](tools/libraries/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli) kılavuzuna bakın.

## Optimizations

### Flattening of ES modules

Angular Paket Formatı, kodun "düzleştirilmiş" ES modülü formatında yayınlanmasını belirtir.
Bu, Angular uygulamalarının derleme süresini ve nihai uygulama paketinin indirme ve ayrıştırma süresini önemli ölçüde azaltır.
Lütfen Nolan Lawson'ın mükemmel yazısı ["The cost of small modules"](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules)'a göz atın.

Angular derleyicisi indeks ES modülü dosyaları oluşturabilir. Rollup gibi araçlar, _Düzleştirilmiş ES Modülü_ (FESM) dosya formatında düzleştirilmiş modüller oluşturmak için bu dosyaları kullanabilir.

FESM, bir giriş noktasından erişilebilen tüm ES Modüllerinin tek bir ES Modülüne düzleştirilmesiyle oluşturulan bir dosya formatıdır.
Bir paketteki tüm içe aktarımlar izlenerek ve bu kod tek bir dosyaya kopyalanırken tüm genel ES dışa aktarımları korunarak ve tüm özel içe aktarımlar kaldırılarak oluşturulur.
Ancak bazı durumlarda FESM, birden fazla giriş noktası arasında paylaşılan bir paylaşımlı parçaya bağlı olabilir.

Kısaltılmış ad FESM, _phe-som_ olarak telaffuz edilir ve FESM2020 gibi bir sayı ile takip edilebilir.
Sayı, modül içindeki JavaScript'in dil düzeyini ifade eder.
Buna göre bir FESM2022 dosyası ESM+ES2022 olur ve import/export ifadeleri ile ES2022 kaynak kodu içerir.

Düzleştirilmiş bir ES Modülü indeks dosyası oluşturmak için tsconfig.json dosyanızda aşağıdaki yapılandırma seçeneklerini kullanın:

```js
{
  "compilerOptions": {
    …
    "module": "esnext",
    "target": "es2022",
    …
  },
  "angularCompilerOptions": {
    …
    "flatModuleOutFile": "my-ui-lib.js",
    "flatModuleId": "my-ui-lib"
  }
}
```

ngc tarafından indeks dosyası \(örneğin, `my-ui-lib.js`\) oluşturulduktan sonra, düzleştirilmiş ESM dosyasını üretmek için Rollup gibi paketleyiciler ve optimize ediciler kullanılabilir.

### "sideEffects" flag

Varsayılan olarak EcmaScript Modülleri yan etkilidir: bir modülden içe aktarmak, o modülün üst düzeyindeki herhangi bir kodun çalışmasını sağlar.
Bu genellikle istenmeyen bir durumdur çünkü tipik modüllerdeki yan etkili kodun çoğu gerçekten yan etkili değildir, bunun yerine yalnızca belirli sembolleri etkiler.
Bu semboller içe aktarılmaz ve kullanılmazsa, tree-shaking olarak bilinen bir optimizasyon sürecinde bunları kaldırmak genellikle istenir ve yan etkili kod bunu engelleyebilir.

webpack gibi derleme araçları, paketlerin modüllerinin üst düzeyinde yan etkili koda bağlı olmadıklarını bildirmelerine olanak tanıyan bir bayrağı destekler ve araçlara paketteki kodu tree-shake etme konusunda daha fazla özgürlük verir.
Bu optimizasyonların nihai sonucu, kod bölme sonrasında daha küçük paket boyutu ve paket parçalarında daha iyi kod dağılımı olmalıdır.
Bu optimizasyon, yerel olmayan yan etkiler içeriyorsa kodunuzu bozabilir - ancak bu Angular uygulamalarında yaygın değildir ve genellikle kötü tasarımın bir işaretidir.
Öneri, tüm paketlerin `sideEffects` özelliğini `false` olarak ayarlayarak yan etkisiz durumunu beyan etmesi ve geliştiricilerin doğal olarak yerel olmayan yan etkileri olmayan kodla sonuçlanan [Angular Style Guide](/style-guide)'ı izlemeleridir.

Daha fazla bilgi: [webpack docs on side effects](https://github.com/webpack/webpack/tree/master/examples/side-effects)

### ES2022 language level

ES2022 dil düzeyi artık Angular CLI ve diğer araçlar tarafından tüketilen varsayılan dil düzeyidir.
Angular CLI, paketi uygulama derleme zamanında tüm hedeflenen tarayıcılar tarafından desteklenen bir dil düzeyine düşürür.

### d.ts bundling / type definition flattening

APF v8'den itibaren TypeScript tanımlamalarının paketlenmesi önerilir.
Tip tanımlamalarının paketlenmesi, özellikle kütüphanenizde çok sayıda bireysel `.ts` kaynak dosyası varsa, kullanıcılar için derlemeleri önemli ölçüde hızlandırabilir.

Angular, `.d.ts` dosyalarını düzleştirmek için [`rollup-plugin-dts`](https://github.com/Swatinem/rollup-plugin-dts) kullanır (FESM dosyalarının oluşturulmasına benzer şekilde `rollup` kullanarak).

`.d.ts` paketlemesi için rollup kullanmak, giriş noktaları arasında kod bölmeyi desteklediği için faydalıdır.
Örneğin, aynı paylaşılan tipe dayanan birden fazla giriş noktanız olduğunu düşünün; daha büyük düzleştirilmiş `.d.ts` dosyalarıyla birlikte paylaşılan bir `.d.ts` dosyası oluşturulur.
Bu istenen bir durumdur ve tiplerin tekrarlanmasını önler.

### Tslib

APF v10'dan itibaren tslib'in birincil giriş noktanızın doğrudan bir bağımlılığı olarak eklenmesi önerilir.
Bunun nedeni, tslib sürümünün kütüphanenizi derlemek için kullanılan TypeScript sürümüne bağlı olmasıdır.

## Examples

<docs-pill-row>
  <docs-pill href="https://app.unpkg.com/@angular/core@21.0.6" title="@angular/core package"/>
  <docs-pill href="https://app.unpkg.com/@angular/material@21.0.3" title="@angular/material package"/>
</docs-pill-row>

## Definition of terms

Aşağıdaki terimler bu belge boyunca kasıtlı olarak kullanılmaktadır.
Bu bölümde, ek netlik sağlamak için hepsinin tanımları yer almaktadır.

### Package

NPM'e yayınlanan ve birlikte yüklenen en küçük dosya kümesi, örneğin `@angular/core`.
Bu paket; package.json adlı bir manifest, derlenmiş kaynak kodu, typescript tip tanımlama dosyaları, kaynak haritaları, meta veriler vb. içerir.
Paket `npm install @angular/core` ile yüklenir.

### Symbol

Bir modülde bulunan ve isteğe bağlı olarak bir modül dışa aktarımı aracılığıyla dış dünyaya görünür kılınan sınıf, fonksiyon, sabit veya değişken.

### Module

ECMAScript Modüllerinin kısaltması.
Sembolleri içe aktaran ve dışa aktaran ifadeler içeren bir dosya.
Bu, ECMAScript spesifikasyonundaki modüllerin tanımıyla aynıdır.

### ESM

ECMAScript Modüllerinin kısaltması \(yukarıya bakın\).

### FESM

Düzleştirilmiş ES Modüllerinin kısaltması ve bir giriş noktasından erişilebilen tüm ES Modüllerinin tek bir ES Modülüne düzleştirilmesiyle oluşturulan bir dosya formatından oluşur.
FESM'in tipik olarak tek bir dosya olduğunu, ancak diğer FESM'lerle paylaşılan bir paylaşımlı parçaya bağlı olabileceğini unutmayın.

### Module ID

import ifadelerinde kullanılan bir modülün tanımlayıcısı \(örneğin, `@angular/core`\).
ID genellikle doğrudan dosya sistemindeki bir yola eşlenir, ancak çeşitli modül çözümleme stratejileri nedeniyle bu her zaman böyle değildir.

### Module specifier

Bir modül tanımlayıcısı \(yukarıya bakın\).

### Module resolution strategy

Modül ID'lerini dosya sistemindeki yollara dönüştürmek için kullanılan algoritma.
Node.js'in iyi belgelenmiş ve yaygın olarak kullanılan bir stratejisi vardır, TypeScript çeşitli modül çözümleme stratejilerini destekler, [Closure Compiler](https://developers.google.com/closure/compiler)'ın ise başka bir stratejisi vardır.

### Module format

En azından bir dosyadan içe aktarma ve dışa aktarma söz dizimini kapsayan modül söz dizimi spesifikasyonu.
Yaygın modül formatları CommonJS \(CJS, genellikle Node.js uygulamaları için kullanılır\) veya ECMAScript Modülleridir \(ESM\).
Modül formatı yalnızca bireysel modüllerin paketlenmesini belirtir, modül içeriğini oluşturmak için kullanılan JavaScript dil özelliklerini değil.
Bu nedenle Angular ekibi, modül formatına genellikle dil düzeyi belirleyicisini sonek olarak kullanır, \(örneğin, ESM+ES2022, modülün ESM formatında olduğunu ve ES2022 kodu içerdiğini belirtir\).

### Bundle

Bir veya daha fazla modülden kaynaklanan sembolleri içeren, bir derleme aracı \(örneğin, [webpack](https://webpack.js.org) veya [Rollup](https://rollupjs.org)\) tarafından üretilen tek bir JS dosyası biçimindeki yapıtaşı.
Paketler, tarayıcıların yüzlerce hatta on binlerce dosyayı indirmeye başlaması durumunda oluşacak ağ yükünü azaltan tarayıcıya özgü bir çözümdür.
Node.js genellikle paketleri kullanmaz.
Yaygın paket formatları UMD ve System.register'dır.

### Language level

Kodun dili \(ES2022\).
Modül formatından bağımsızdır.

### Entry point

Kullanıcı tarafından içe aktarılması amaçlanan bir modül.
Benzersiz bir modül ID'si tarafından referans alınır ve bu modül ID'si tarafından referans alınan genel API'yi dışa aktarır.
Bir örnek `@angular/core` veya `@angular/core/testing`'dir.
Her iki giriş noktası da `@angular/core` paketinde bulunur, ancak farklı semboller dışa aktarırlar.
Bir paket birçok giriş noktasına sahip olabilir.

### Deep import

Giriş Noktası olmayan modüllerden sembol alma işlemi.
Bu modül ID'leri genellikle projenin ömrü boyunca veya verilen paket için paket oluşturulurken değişebilen özel API'ler olarak kabul edilir.

### Top-Level import

Bir giriş noktasından gelen içe aktarım.
Mevcut üst düzey içe aktarımlar, genel API'yi tanımlayan ve `@angular/core` veya `@angular/common` gibi "@angular/name" modüllerinde sunulan içe aktarımlardır.

### Tree-shaking

Bir uygulama tarafından kullanılmayan kodun belirlenmesi ve kaldırılması süreci - ölü kod eliminasyonu olarak da bilinir.
Bu, [Rollup](https://rollupjs.org), [Closure Compiler](https://developers.google.com/closure/compiler) veya [Terser](https://github.com/terser/terser) gibi araçlar kullanılarak uygulama düzeyinde gerçekleştirilen global bir optimizasyondur.

### AOT compiler

Angular'ın Ahead of Time Derleyicisi.

### Flattened type definitions

[API Extractor](https://api-extractor.com) veya [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts) gibi araçlar kullanılarak oluşturulan paketlenmiş TypeScript tip tanımlamaları.
