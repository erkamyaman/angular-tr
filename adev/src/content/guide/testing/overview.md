# Unit testing

Angular uygulamanızı test etmek, beklediğiniz gibi çalışıp çalışmadığını kontrol etmenize yardımcı olur. Birim testleri, hataları erken yakalamak, kod kalitesini sağlamak ve güvenli yeniden düzenlemeyi kolaylaştırmak için kritik öneme sahiptir.

NOTE: Bu kılavuz, Vitest kullanan yeni Angular CLI projeleri için varsayılan test kurulumunu kapsar. Mevcut bir projeyi Karma'dan taşıyorsanız, [Karma'dan Vitest'e Geçiş kılavuzuna](guide/testing/migrating-to-vitest) bakın. Karma hâlâ desteklenmektedir; daha fazla bilgi için [Karma test kılavuzuna](guide/testing/karma) bakın.

## Set up for testing

Angular CLI, bir Angular uygulamasını [Vitest test çerçevesi](https://vitest.dev) ile test etmek için ihtiyaç duyduğunuz her şeyi indirir ve yükler. Yeni projeler varsayılan olarak `vitest` ve `jsdom` içerir.

Vitest, birim testlerinizi bir Node.js ortamında çalıştırır. Tarayıcının DOM'unu simüle etmek için Vitest, `jsdom` adlı bir kütüphane kullanır. Bu, tarayıcı başlatma yükünü ortadan kaldırarak daha hızlı test yürütülmesini sağlar. `jsdom` yerine `happy-dom` gibi bir alternatifi yükleyip `jsdom`'u kaldırarak değiştirebilirsiniz. Şu anda `jsdom` ve `happy-dom` desteklenen DOM emülasyon kütüphaneleridir.

CLI ile oluşturduğunuz proje hemen teste hazırdır. [`ng test`](cli/test) komutunu çalıştırın:

```shell
ng test
```

`ng test` komutu uygulamayı _izleme modunda_ derler ve [Vitest test çalıştırıcısını](https://vitest.dev) başlatır.

Konsol çıktısı şu şekilde görünür:

```shell
 ✓ src/app/app.spec.ts (3)
   ✓ AppComponent should create the app
   ✓ AppComponent should have as title 'my-app'
   ✓ AppComponent should render title
 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  18:18:01
   Duration  2.46s (transform 615ms, setup 2ms, collect 2.21s, tests 5ms)
```

`ng test` komutu ayrıca dosyalarınızı değişiklikler için izler. Bir dosyayı değiştirip kaydederseniz, testler tekrar çalışır.

## Configuration

Angular CLI, Vitest yapılandırmasının çoğunu sizin için yönetir. `angular.json` dosyanızdaki `test` hedef seçeneklerini değiştirerek test davranışını özelleştirebilirsiniz.

### Angular.json options

- `include`: Test için dahil edilecek dosyalar için glob kalıpları. Varsayılan olarak `['**/*.spec.ts', '**/*.test.ts']` değerindedir.
- `exclude`: Testten hariç tutulacak dosyalar için glob kalıpları.
- `setupFiles`: Testlerinizden önce çalıştırılan global kurulum dosyalarına (ör. polyfill'ler veya global mock'lar) giden yolların listesi.
- `providersFile`: Test ortamı için varsayılan bir Angular sağlayıcı dizisi dışa aktaran bir dosyanın yolu. Bu, testlerinize enjekte edilen global test sağlayıcılarını ayarlamak için kullanışlıdır.
- `coverage`: Kod kapsam raporlamasını etkinleştirmek veya devre dışı bırakmak için bir boolean değer. Varsayılan olarak `false` değerindedir.
- `browsers`: Testleri gerçek bir tarayıcıda çalıştırmak için tarayıcı adları dizisi (ör. `["chromium"]`). Bir tarayıcı sağlayıcısının yüklenmesini gerektirir. Daha fazla ayrıntı için [Testleri tarayıcıda çalıştırma](#running-tests-in-a-browser) bölümüne bakın.

### Global test setup and providers

`setupFiles` ve `providersFile` seçenekleri, global test yapılandırmasını yönetmek için özellikle kullanışlıdır.

Örneğin, tüm testlerinize `provideHttpClientTesting` sağlamak için bir `src/test-providers.ts` dosyası oluşturabilirsiniz:

```typescript {header: "src/test-providers.ts"}
import {Provider} from '@angular/core';
import {provideHttpClient} from '@angular/common/http';
import {provideHttpClientTesting} from '@angular/common/http/testing';

const testProviders: Provider[] = [provideHttpClient(), provideHttpClientTesting()];

export default testProviders;
```

Ardından bu dosyayı `angular.json` dosyanızda referans gösterirsiniz:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "providersFile": "src/test-providers.ts"
          }
        }
      }
    }
  }
}
```

HELPFUL: Test kurulumu veya sağlayıcılar için `src/test-providers.ts` gibi yeni TypeScript dosyaları oluştururken, bunların projenizin test TypeScript yapılandırma dosyasına (genellikle `tsconfig.spec.json`) dahil edildiğinden emin olun. Bu, TypeScript derleyicisinin test sırasında bu dosyaları düzgün bir şekilde işlemesini sağlar.

### Advanced Vitest configuration

İleri düzey kullanım durumları için, `angular.json` dosyasındaki `configFile` seçeneğini kullanarak özel bir Vitest yapılandırma dosyası sağlayabilirsiniz.

IMPORTANT: Özel bir yapılandırma kullanmak ileri düzey seçenekleri etkinleştirirken, Angular ekibi yapılandırma dosyasının içeriği veya herhangi bir üçüncü taraf eklentisi için destek sağlamaz. CLI ayrıca düzgün entegrasyon sağlamak için belirli özellikleri (`test.projects`, `test.include`) geçersiz kılacaktır.

Bir Vitest yapılandırma dosyası (ör. `vitest-base.config.ts`) oluşturabilir ve `angular.json` dosyanızda referans gösterebilirsiniz:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "runnerConfig": "vitest-base.config.ts"
          }
        }
      }
    }
  }
}
```

CLI kullanarak bir temel yapılandırma dosyası da oluşturabilirsiniz:

```shell
ng generate config vitest
```

Bu, özelleştirebileceğiniz bir `vitest-base.config.ts` dosyası oluşturur.

HELPFUL: Vitest yapılandırması hakkında daha fazla bilgi için [resmi Vitest belgelerini](https://vitest.dev/config/) okuyun.

## Code coverage

`ng test` komutuna `--coverage` bayrağını ekleyerek bir kod kapsam raporu oluşturabilirsiniz. Rapor `coverage/` dizininde oluşturulur.

Daha ayrıntılı bilgi için [Kod kapsam kılavuzuna](guide/testing/code-coverage) bakın.

## Running tests in a browser

Varsayılan Node.js ortamı çoğu birim testi için daha hızlı olsa da, testlerinizi gerçek bir tarayıcıda da çalıştırabilirsiniz. Bu, tarayıcıya özgü API'lere (örneğin render etme) dayanan testler veya hata ayıklama için kullanışlıdır.

Testleri bir tarayıcıda çalıştırmak için önce bir tarayıcı sağlayıcısı yüklemeniz gerekir. Vitest'in tarayıcı modu hakkında daha fazla bilgi için [resmi belgeleri](https://vitest.dev/guide/browser) okuyun.

Sağlayıcı yüklendikten sonra, `angular.json` dosyasındaki `browsers` seçeneğini yapılandırarak veya `--browsers` CLI bayrağını kullanarak testlerinizi tarayıcıda çalıştırabilirsiniz. Testler varsayılan olarak görünür tarayıcıda çalışır. `CI` ortam değişkeni ayarlandıysa, bunun yerine başsız mod kullanılır. Başsız modu açıkça kontrol etmek için tarayıcı adının sonuna `Headless` ekleyebilirsiniz (ör. `chromiumHeadless`).

```bash
# Example for Playwright (headed)
ng test --browsers=chromium

# Example for Playwright (headless)
ng test --browsers=chromiumHeadless

# Example for WebdriverIO (headed)
ng test --browsers=chrome

# Example for WebdriverIO (headless)
ng test --browsers=chromeHeadless
```

İhtiyaçlarınıza göre aşağıdaki tarayıcı sağlayıcılarından birini seçin:

### Playwright

[Playwright](https://playwright.dev/), Chromium, Firefox ve WebKit'i destekleyen bir tarayıcı otomasyon kütüphanesidir.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-playwright playwright
  </docs-code>
</docs-code-multifile>

### WebdriverIO

[WebdriverIO](https://webdriver.io/), Chrome, Firefox, Safari ve Edge'i destekleyen bir tarayıcı ve mobil otomasyon test çerçevesidir.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-webdriverio webdriverio
  </docs-code>
</docs-code-multifile>

### Preview

`@vitest/browser-preview` sağlayıcısı, StackBlitz gibi Webcontainer ortamları için tasarlanmıştır ve CI/CD'de kullanılmak üzere tasarlanmamıştır.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-preview
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-preview
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-preview
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-preview
  </docs-code>
</docs-code-multifile>

HELPFUL: Daha gelişmiş tarayıcıya özgü yapılandırma için [Gelişmiş Vitest yapılandırması](#advanced-vitest-configuration) bölümüne bakın.

## Other test frameworks

Bir Angular uygulamasını diğer test kütüphaneleri ve test çalıştırıcıları ile de birim test edebilirsiniz. Her kütüphane ve çalıştırıcının kendi kurulum prosedürleri, yapılandırması ve sözdizimi vardır.

## Testing in continuous integration

Sağlam bir test paketi, sürekli entegrasyon (CI) hattının önemli bir parçasıdır. CI sunucuları, testlerinizi her commit ve pull request'te otomatik olarak çalıştırmanızı sağlar.

Angular uygulamanızı bir CI sunucusunda test etmek için standart test komutunu çalıştırın:

```shell
ng test
```

Çoğu CI sunucusu, `ng test`'in algıladığı bir `CI=true` ortam değişkeni ayarlar. Bu, testlerinizi otomatik olarak etkileşimsiz, tek çalıştırma modunda yapılandırır.

CI sunucunuz bu değişkeni ayarlamıyorsa veya tek çalıştırma modunu manuel olarak zorlamanız gerekiyorsa, `--no-watch` ve `--no-progress` bayraklarını kullanabilirsiniz:

```shell
ng test --no-watch --no-progress
```

## More information on testing

Uygulamanızı test için kurduktan sonra, aşağıdaki test kılavuzlarını faydalı bulabilirsiniz.

|                                                                    | Ayrıntılar                                                                                      |
| :----------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| [Code coverage](guide/testing/code-coverage)                       | Testlerinizin uygulamanızın ne kadarını kapsadığı ve gerekli miktarları nasıl belirleyeceğiniz. |
| [Testing services](guide/testing/services)                         | Uygulamanızın kullandığı servisleri nasıl test edeceğiniz.                                      |
| [Basics of testing components](guide/testing/components-basics)    | Angular bileşenlerini test etmenin temelleri.                                                   |
| [Component testing scenarios](guide/testing/components-scenarios)  | Çeşitli bileşen test senaryoları ve kullanım durumları.                                         |
| [Testing attribute directives](guide/testing/attribute-directives) | Nitelik yönergelerinizi nasıl test edeceğiniz.                                                  |
| [Testing pipes](guide/testing/pipes)                               | Pipe'ları nasıl test edeceğiniz.                                                                |
| [Debugging tests](guide/testing/debugging)                         | Yaygın test hataları.                                                                           |
| [Testing utility APIs](guide/testing/utility-apis)                 | Angular test özellikleri.                                                                       |
