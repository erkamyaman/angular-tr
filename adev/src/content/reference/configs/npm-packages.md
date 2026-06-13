# Çalışma alanı npm bağımlılıkları

Angular Framework, Angular CLI ve Angular uygulamaları tarafından kullanılan bileşenler, [npm paketleri](https://docs.npmjs.com/getting-started/what-is-npm 'What is npm?') olarak paketlenir ve [npm kayıt defteri](https://docs.npmjs.com) kullanılarak dağıtılır.

Bu npm paketlerini [npm CLI istemcisi](https://docs.npmjs.com/cli/install) kullanarak indirebilir ve kurabilirsiniz.
Varsayılan olarak, Angular CLI npm istemcisini kullanır.

HELPFUL: Gerekli `Node.js` ve `npm` sürümleri ve kurulumu hakkında bilgi için [Yerel Ortam Kurulumu](tools/cli/setup-local 'Setting up for Local Development') sayfasına bakın.

Makinenizde Node.js ve npm'in farklı sürümlerini kullanan projeleriniz varsa, birden fazla Node.js ve npm sürümünü yönetmek için [nvm](https://github.com/creationix/nvm) kullanmayı düşünün.

## `package.json`

`npm`, bir [`package.json`](https://docs.npmjs.com/files/package.json) dosyasında tanımlanan paketleri kurar.

CLI komutu `ng new`, yeni çalışma alanını oluştururken bir `package.json` dosyası oluşturur.
Bu `package.json`, çalışma alanındaki tüm projeler tarafından kullanılır; buna CLI'ın çalışma alanını oluştururken oluşturduğu ilk uygulama projesi de dahildir.
`ng generate library` ile oluşturulan kütüphaneler kendi `package.json` dosyalarını içerir.

Başlangıçta bu `package.json`, _bir başlangıç paket seti_ içerir; bunlardan bazıları Angular için gereklidir, diğerleri ise yaygın uygulama senaryolarını destekler.
Uygulamanız geliştikçe `package.json`'a paketler eklersiniz.

## Varsayılan Bağımlılıklar

Aşağıdaki Angular paketleri, yeni bir Angular çalışma alanı için varsayılan `package.json` dosyasında bağımlılık olarak dahil edilmiştir.
Angular paketlerinin tam listesi için [API referanslarına](api) bakın.

| Paket adı                                                                                      | Ayrıntılar                                                                                                                                                                                                                  |
| :--------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@angular/animations`](api#animations)                                                        | Angular'ın eski animasyonlar kütüphanesi, sayfa ve liste geçişleri gibi animasyon efektlerini tanımlamayı ve uygulamayı kolaylaştırır. Daha fazla bilgi için [Eski Animasyonlar kılavuzuna](guide/legacy-animations) bakın. |
| [`@angular/common`](api#common)                                                                | Angular ekibi tarafından sağlanan yaygın olarak ihtiyaç duyulan servisler, pipe'lar ve direktifler.                                                                                                                         |
| `@angular/compiler`                                                                            | Angular'ın şablon derleyicisi. Angular şablonlarını anlar ve bunları uygulamanın çalışmasını sağlayan koda dönüştürebilir.                                                                                                  |
| `@angular/compiler-cli`                                                                        | Angular CLI'ın `ng build` ve `ng serve` komutları tarafından çağrılan Angular derleyicisi. `@angular/compiler` ile Angular şablonlarını standart bir TypeScript derlemesi içinde işler.                                     |
| [`@angular/core`](api#core)                                                                    | Her uygulama tarafından ihtiyaç duyulan framework'ün kritik çalışma zamanı parçaları. `@Component` gibi tüm metadata dekoratörleri, bağımlılık enjeksiyonu ve bileşen yaşam döngüsü kancalarını içerir.                     |
| [`@angular/forms`](api#forms)                                                                  | Hem [şablon güdümlü](guide/forms) hem de [reaktif formlar](guide/forms/reactive-forms) desteği. [Formlara giriş](guide/forms) bölümüne bakın.                                                                               |
| [`@angular/platform-browser`](api#platform-browser)                                            | DOM ve tarayıcıyla ilgili her şey, özellikle DOM'a render etmeye yardımcı olan parçalar.                                                                                                                                    |
| [`@angular/platform-browser-dynamic`](api#platform-browser-dynamic)                            | [JIT derleyici](tools/cli/aot-compiler#choosing-a-compiler) kullanarak uygulamayı istemcide derlemek ve çalıştırmak için [sağlayıcılar](api/core/Provider) ve yöntemler içerir.                                             |
| [`@angular/router`](api#router)                                                                | Router modülü, tarayıcı URL'si değiştiğinde uygulama sayfaları arasında navigasyon sağlar. Daha fazla bilgi için [Yönlendirme ve Navigasyon](guide/routing) bölümüne bakın.                                                 |
| [`@angular/cli`](https://github.com/angular/angular-cli)                                       | `ng` komutlarını çalıştırmak için Angular CLI binary dosyasını içerir.                                                                                                                                                      |
| [`@angular-devkit/build-angular`](https://www.npmjs.com/package/@angular-devkit/build-angular) | Angular uygulamalarını ve kütüphanelerini paketleme, test etme ve sunma için varsayılan CLI oluşturucularını içerir.                                                                                                        |
| [`rxjs`](https://www.npmjs.com/package/rxjs)                                                   | `Observable`'lar kullanarak reaktif programlama için bir kütüphane.                                                                                                                                                         |
| [`zone.js`](https://github.com/angular/zone.js)                                                | Angular, yerel JavaScript işlemleri olay tetiklediğinde Angular'ın değişiklik algılama süreçlerini çalıştırmak için `zone.js`'ye bağımlıdır.                                                                                |
| [`typescript`](https://www.npmjs.com/package/typescript)                                       | TypeScript derleyicisi, dil servisi ve yerleşik tür tanımları.                                                                                                                                                              |
