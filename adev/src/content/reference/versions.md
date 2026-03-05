# Version compatibility

Aşağıdaki tablolar, her Angular sürümünün gerektirdiği Node.js, TypeScript ve RxJS sürümlerini
açıklar.

## Actively supported versions

Bu tablo, [aktif destek altındaki Angular sürümlerini](reference/releases#actively-supported-versions) kapsar.

| Angular                        | Node.js                             | TypeScript     | RxJS               |
| ------------------------------ | ----------------------------------- | -------------- | ------------------ |
| 22.0.x                         | ^22.22.0 \|\| >=24.13.1"            | >=5.9.0 <6.0.0 | ^6.5.3 \|\| ^7.4.0 |
| 21.0.x \|\| 21.1.x \|\| 21.2.x | ^20.19.0 \|\| ^22.12.0 \|\| ^24.0.0 | >=5.9.0 <6.0.0 | ^6.5.3 \|\| ^7.4.0 |
| 20.2.x \|\| 20.3.x             | ^20.19.0 \|\| ^22.12.0 \|\| ^24.0.0 | >=5.8.0 <6.0.0 | ^6.5.3 \|\| ^7.4.0 |
| 20.0.x \|\| 20.1.x             | ^20.19.0 \|\| ^22.12.0 \|\| ^24.0.0 | >=5.8.0 <5.9.0 | ^6.5.3 \|\| ^7.4.0 |
| 19.2.x                         | ^18.19.1 \|\| ^20.11.1 \|\| ^22.0.0 | >=5.5.0 <5.9.0 | ^6.5.3 \|\| ^7.4.0 |
| 19.1.x                         | ^18.19.1 \|\| ^20.11.1 \|\| ^22.0.0 | >=5.5.0 <5.8.0 | ^6.5.3 \|\| ^7.4.0 |
| 19.0.x                         | ^18.19.1 \|\| ^20.11.1 \|\| ^22.0.0 | >=5.5.0 <5.7.0 | ^6.5.3 \|\| ^7.4.0 |

## Unsupported Angular versions

Bu tablo, artık uzun vadeli destek (LTS) altında olmayan Angular sürümlerini kapsar. Bu
bilgiler, her sürüm LTS'den çıktığında doğruydu ve başka herhangi bir garanti olmaksızın sağlanmıştır. Burada tarihsel referans olarak listelenmiştir.

| Angular            | Node.js                              | TypeScript     | RxJS               |
| ------------------ | ------------------------------------ | -------------- | ------------------ |
| 18.1.x \|\| 18.2.x | ^18.19.1 \|\| ^20.11.1 \|\| ^22.0.0  | >=5.4.0 <5.6.0 | ^6.5.3 \|\| ^7.4.0 |
| 18.0.x             | ^18.19.1 \|\| ^20.11.1 \|\| ^22.0.0  | >=5.4.0 <5.5.0 | ^6.5.3 \|\| ^7.4.0 |
| 17.3.x             | ^18.13.0 \|\| ^20.9.0                | >=5.2.0 <5.5.0 | ^6.5.3 \|\| ^7.4.0 |
| 17.1.x \|\| 17.2.x | ^18.13.0 \|\| ^20.9.0                | >=5.2.0 <5.4.0 | ^6.5.3 \|\| ^7.4.0 |
| 17.0.x             | ^18.13.0 \|\| ^20.9.0                | >=5.2.0 <5.3.0 | ^6.5.3 \|\| ^7.4.0 |
| 16.1.x \|\| 16.2.x | ^16.14.0 \|\| ^18.10.0               | >=4.9.3 <5.2.0 | ^6.5.3 \|\| ^7.4.0 |
| 16.0.x             | ^16.14.0 \|\| ^18.10.0               | >=4.9.3 <5.1.0 | ^6.5.3 \|\| ^7.4.0 |
| 15.1.x \|\| 15.2.x | ^14.20.0 \|\| ^16.13.0 \|\| ^18.10.0 | >=4.8.2 <5.0.0 | ^6.5.3 \|\| ^7.4.0 |
| 15.0.x             | ^14.20.0 \|\| ^16.13.0 \|\| ^18.10.0 | ~4.8.2         | ^6.5.3 \|\| ^7.4.0 |
| 14.2.x \|\| 14.3.x | ^14.15.0 \|\| ^16.10.0               | >=4.6.2 <4.9.0 | ^6.5.3 \|\| ^7.4.0 |
| 14.0.x \|\| 14.1.x | ^14.15.0 \|\| ^16.10.0               | >=4.6.2 <4.8.0 | ^6.5.3 \|\| ^7.4.0 |
| 13.3.x \|\| 13.4.x | ^12.20.0 \|\| ^14.15.0 \|\| ^16.10.0 | >=4.4.3 <4.7.0 | ^6.5.3 \|\| ^7.4.0 |
| 13.1.x \|\| 13.2.x | ^12.20.0 \|\| ^14.15.0 \|\| ^16.10.0 | >=4.4.3 <4.6.0 | ^6.5.3 \|\| ^7.4.0 |
| 13.0.x             | ^12.20.0 \|\| ^14.15.0 \|\| ^16.10.0 | ~4.4.3         | ^6.5.3 \|\| ^7.4.0 |
| 12.2.x             | ^12.14.0 \|\| ^14.15.0               | >=4.2.3 <4.4.0 | ^6.5.3 \|\| ^7.0.0 |
| 12.1.x             | ^12.14.0 \|\| ^14.15.0               | >=4.2.3 <4.4.0 | ^6.5.3             |
| 12.0.x             | ^12.14.0 \|\| ^14.15.0               | ~4.2.3         | ^6.5.3             |
| 11.2.x             | ^10.13.0 \|\| ^12.11.0               | >=4.0.0 <4.2.0 | ^6.5.3             |
| 11.1.x             | ^10.13.0 \|\| ^12.11.0               | >=4.0.0 <4.2.0 | ^6.5.3             |
| 11.0.x             | ^10.13.0 \|\| ^12.11.0               | ~4.0.0         | ^6.5.3             |
| 10.2.x             | ^10.13.0 \|\| ^12.11.0               | >=3.9.0 <4.1.0 | ^6.5.3             |
| 10.1.x             | ^10.13.0 \|\| ^12.11.0               | >=3.9.0 <4.1.0 | ^6.5.3             |
| 10.0.x             | ^10.13.0 \|\| ^12.11.0               | ~3.9.0         | ^6.5.3             |
| 9.1.x              | ^10.13.0 \|\| ^12.11.0               | >=3.6.0 <3.9.0 | ^6.5.3             |
| 9.0.x              | ^10.13.0 \|\| ^12.11.0               | >=3.6.0 <3.8.0 | ^6.5.3             |

### Before v9

Angular v9'a kadar, Angular ve Angular CLI sürümleri senkronize değildi.

| Angular                     | Angular CLI                 | Node.js             | TypeScript     | RxJS   |
| --------------------------- | --------------------------- | ------------------- | -------------- | ------ |
| 8.2.x                       | 8.2.x \|\| 8.3.x            | ^10.9.0             | >=3.4.2 <3.6.0 | ^6.4.0 |
| 8.0.x \|\| 8.1.x            | 8.0.x \|\| 8.1.x            | ^10.9.0             | ~3.4.2         | ^6.4.0 |
| 7.2.x                       | 7.2.x \|\| 7.3.x            | ^8.9.0 \|\| ^10.9.0 | >=3.1.3 <3.3.0 | ^6.0.0 |
| 7.0.x \|\| 7.1.x            | 7.0.x \|\| 7.1.x            | ^8.9.0 \|\| ^10.9.0 | ~3.1.3         | ^6.0.0 |
| 6.1.x                       | 6.1.x \|\| 6.2.x            | ^8.9.0              | >=2.7.2 <3.0.0 | ^6.0.0 |
| 6.0.x                       | 6.0.x                       | ^8.9.0              | ~2.7.2         | ^6.0.0 |
| 5.2.x                       | 1.6.x \|\| 1.7.x            | ^6.9.0 \|\| ^8.9.0  | >=2.4.2 <2.7.0 | ^5.5.0 |
| 5.0.x \|\| 5.1.x            | 1.5.x                       | ^6.9.0 \|\| ^8.9.0  | ~2.4.2         | ^5.5.0 |
| 4.2.x \|\| 4.3.x \|\| 4.4.x | 1.4.x                       | ^6.9.0 \|\| ^8.9.0  | >=2.1.6 <2.5.0 | ^5.0.1 |
| 4.2.x \|\| 4.3.x \|\| 4.4.x | 1.3.x                       | ^6.9.0              | >=2.1.6 <2.5.0 | ^5.0.1 |
| 4.0.x \|\| 4.1.x            | 1.0.x \|\| 1.1.x \|\| 1.2.x | ^6.9.0              | >=2.1.6 <2.4.0 | ^5.0.1 |
| 2.x                         | -                           | ^6.9.0              | >=1.8.0 <2.2.0 | ^5.0.1 |

## Browser support

Angular, tarayıcı desteğini tanımlamak için ["yaygın olarak kullanılabilir" Baseline](https://web.dev/baseline)'ı kullanır.
Her ana sürüm için Angular, o ana sürümün yayın tarihine yakın seçilen bir tarihteki Baseline'a dahil olan tarayıcıları destekler.

"Yaygın olarak kullanılabilir" Baseline, Baseline'ın temel tarayıcı seti (Chrome, Edge, Firefox, Safari) içinde seçilen tarihten 30 aydan (2,5 yıl) daha kısa süre önce yayımlanan tarayıcıları ve yaklaşık %95 web kullanıcısını desteklemeyi hedefleyen tarayıcıları içerir.

| Angular | Baseline Tarihi | Tarayıcı Seti               |
| ------- | --------------- | --------------------------- |
| v21     | 2025-10-20      | [Browser Set][browsers-v21] |
| v20     | 2025-04-30      | [Browser Set][browsers-v20] |

[browsers-v21]: https://web-platform-dx.github.io/web-features/supported-browsers/?widelyAvailableOnDate=2025-10-20&includeDownstream=false
[browsers-v20]: https://web-platform-dx.github.io/web-features/supported-browsers/?widelyAvailableOnDate=2025-04-30&includeDownstream=false

v20 öncesi Angular sürümleri aşağıdaki belirli tarayıcı sürümlerini destekler:

| Tarayıcı | Desteklenen sürümler                          |
| :------- | :-------------------------------------------- |
| Chrome   | En son 2 sürüm                                |
| Firefox  | En son ve genişletilmiş destek sürümü \(ESR\) |
| Edge     | En son 2 ana sürüm                            |
| Safari   | En son 2 ana sürüm                            |
| iOS      | En son 2 ana sürüm                            |
| Android  | En son 2 ana sürüm                            |

## Polyfills

Angular, web platformunun en son standartları üzerine inşa edilmiştir.
Bu kadar geniş bir tarayıcı yelpazesini hedeflemek, modern tarayıcıların tüm özelliklerini desteklemedikleri için zorludur.
Desteklemeniz gereken tarayıcılar için polyfill betikleri ("polyfill'ler") yükleyerek bunu telafi edersiniz.
Projenize polyfill'leri nasıl dahil edeceğinize dair talimatlar için aşağıya bakın.

IMPORTANT: Önerilen polyfill'ler, tam Angular uygulamalarını çalıştıranlarıdır.
Bu liste tarafından kapsanmayan özellikleri desteklemek için ek polyfill'lere ihtiyacınız olabilir.

HELPFUL: Polyfill'ler eski, yavaş bir tarayıcıyı sihirli bir şekilde modern, hızlı bir tarayıcıya dönüştüremez.

## Enabling polyfills with CLI projects

[Angular CLI](tools/cli), polyfill'ler için destek sağlar.
Projelerinizi oluşturmak için CLI kullanmıyorsanız, [CLI olmayan kullanıcılar için polyfill talimatlarına](#polyfills-for-non-cli-users) bakın.

[Tarayıcı ve test oluşturucusu](tools/cli/cli-builder)'nun `polyfills` seçenekleri bir dosyanın tam yolu \(Örnek: `src/polyfills.ts`\) veya,
geçerli çalışma alanına göreceli veya modül belirleyicisi \(Örnek: `zone.js`\) olabilir.

Bir TypeScript dosyası oluşturursanız, `tsconfig` dosyanızın `files` özelliğine dahil ettiğinizden emin olun.

```json

{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    ...
  },
  "files": [
    "src/main.ts",
    "src/polyfills.ts"
  ]
  ...
}
```

## Polyfills for non-CLI users

CLI kullanmıyorsanız, polyfill betiklerinizi doğrudan ana web sayfasına \(`index.html`\) ekleyin.

Örneğin:

<docs-code header="src/index.html" language="html">
<!-- pre-zone polyfills -->
<script src="node_modules/core-js/client/shim.min.js"></script>
<script>
  /**
   * you can configure some zone flags which can disable zone interception for some
   * asynchronous activities to improve startup performance - use these options only
   * if you know what you are doing as it could result in hard to trace down bugs.
   */
  // __Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
  // __Zone_disable_on_property = true; // disable patch onProperty such as onclick
  // __zone_symbol__UNPATCHED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
  /*
   * in Edge developer tools, the addEventListener will also be wrapped by zone.js
   * with the following flag, it will bypass `zone.js` patch for Edge.
   */
  // __Zone_enable_cross_context_check = true;
</script>
<!-- zone.js required by Angular -->
<script src="node_modules/zone.js/bundles/zone.umd.js"></script>
<!-- application polyfills -->
</docs-code>
