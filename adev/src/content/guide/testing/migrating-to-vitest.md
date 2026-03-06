# Karma'dan Vitest'e geçiş

Angular CLI, yeni projeler için varsayılan birim test çalıştırıcısı olarak [Vitest](https://vitest.dev/)'i kullanır. Bu kılavuz, mevcut bir projeyi Karma ve Jasmine'den Vitest'e taşıma talimatları sağlar.

IMPORTANT: Mevcut bir projeyi Vitest'e taşımak deneysel olarak kabul edilir. Bu süreç ayrıca tüm yeni oluşturulan projeler için varsayılan olan `application` derleme sisteminin kullanılmasını gerektirir.

## Manuel geçiş adımları

Otomatik yeniden düzenleme şemasını kullanmadan önce, projenizi Vitest test çalıştırıcısını kullanacak şekilde manuel olarak güncellemeniz gerekir.

### 1. Bağımlılıkları yükleme

`vitest` ve bir DOM emülasyon kütüphanesi yükleyin. Tarayıcı testi hâlâ mümkün olsa da ([adım 5](#5-tarayıcı-modunu-yapılandırma-isteğe-bağlı) bakın), Vitest daha hızlı test yürütme için Node.js içinde tarayıcı ortamını simüle etmek üzere varsayılan olarak bir DOM emülasyon kütüphanesi kullanır. CLI, yüklüyse `happy-dom`'u otomatik olarak algılayıp kullanır; aksi takdirde `jsdom`'a geri döner. Bu paketlerden birinin yüklü olması gerekir.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev vitest jsdom
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev vitest jsdom
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D vitest jsdom
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev vitest jsdom
  </docs-code>
</docs-code-multifile>

### 2. `angular.json`'ı güncelleme

`angular.json` dosyanızda projeniz için `test` hedefini bulun ve `builder`'ı `@angular/build:unit-test` olarak değiştirin.

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test"
        }
      }
    }
  }
}
```

`unit-test` builder'ı varsayılan olarak `"tsConfig": "tsconfig.spec.json"` ve `"buildTarget": "::development"` kullanır. Projeniz farklı değerler gerektiriyorsa bu seçenekleri açıkça ayarlayabilirsiniz. Örneğin, `development` derleme yapılandırması eksikse veya test için farklı seçeneklere ihtiyacınız varsa, `buildTarget` için `testing` veya benzer adda bir derleme yapılandırması oluşturabilir ve kullanabilirsiniz.

Daha önce `@angular/build:karma` builder'ı, derleme seçeneklerinin (ör. `polyfills`, `assets` veya `styles`) doğrudan `test` hedefi içinde yapılandırılmasına izin veriyordu. Yeni `@angular/build:unit-test` builder'ı bunu desteklemez. Teste özgü derleme seçenekleriniz mevcut `development` derleme yapılandırmanızdan farklıysa, bunları özel bir derleme hedefi yapılandırmasına taşımanız gerekir. Test derleme seçenekleriniz zaten `development` derleme yapılandırmanızla eşleşiyorsa, herhangi bir işlem yapmanız gerekmez.

### 3. Özel `karma.conf.js` yapılandırmalarını ele alma

`karma.conf.js` dosyasındaki özel yapılandırmalar otomatik olarak taşınmaz. `karma.conf.js` dosyanızı silmeden önce, taşınması gereken özel ayarlar için gözden geçirin.

Birçok Karma seçeneğinin, özel bir Vitest yapılandırma dosyasında (ör. `vitest.config.ts`) ayarlanabilen ve `angular.json` dosyanıza `runnerConfig` seçeneği aracılığıyla bağlanabilen Vitest eşdeğerleri vardır.

Yaygın taşıma yolları şunlardır:

- **Muhabirler**: Karma muhabirleri Vitest uyumlu muhabirlerle değiştirilmelidir. Bunlar genellikle doğrudan `angular.json` dosyanızdaki `test.options.reporters` özelliği altında yapılandırılabilir. Daha gelişmiş yapılandırmalar için özel bir `vitest.config.ts` dosyası kullanın.
- **Eklentiler**: Karma eklentilerinin bulmanız ve yüklemeniz gereken Vitest eşdeğerleri olabilir. Kod kapsamının Angular CLI'da birinci sınıf bir özellik olduğunu ve `ng test --coverage` ile etkinleştirilebileceğini unutmayın.
- **Özel Tarayıcı Başlatıcıları**: Bunlar `angular.json` dosyasındaki `browsers` seçeneği ve `@vitest/browser-playwright` gibi bir tarayıcı sağlayıcısının yüklenmesiyle değiştirilir.

Diğer ayarlar için resmi [Vitest belgelerine](https://vitest.dev/config/) başvurun.

### 4. Karma ve `test.ts` dosyalarını kaldırma

Artık `karma.conf.js` ve `src/test.ts` dosyalarını projenizden silebilir ve Karma ile ilgili paketleri kaldırabilirsiniz. Aşağıdaki komutlar yeni bir Angular CLI projesinde yüklenen paketlere dayanmaktadır; projenizde kaldırılması gereken başka Karma ile ilgili paketler olabilir.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
  <docs-code header="bun" language="shell">
    bun remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
</docs-code-multifile>

### 5. Tarayıcı modunu yapılandırma (isteğe bağlı)

Testleri gerçek bir tarayıcıda çalıştırmanız gerekiyorsa, bir tarayıcı sağlayıcısı yüklemeli ve `angular.json` dosyanızı yapılandırmalısınız.

**Bir tarayıcı sağlayıcısı yükleyin:**

İhtiyaçlarınıza göre aşağıdaki tarayıcı sağlayıcılarından birini seçin:

- **Playwright**: Chromium, Firefox ve WebKit için `@vitest/browser-playwright`.
- **WebdriverIO**: Chrome, Firefox, Safari ve Edge için `@vitest/browser-webdriverio`.
- **Preview**: Webcontainer ortamları (StackBlitz gibi) için `@vitest/browser-preview`.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-playwright
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-playwright
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-playwright
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-playwright
  </docs-code>
</docs-code-multifile>

**Tarayıcı modu için `angular.json`'ı güncelleyin:**

`test` hedefinizin seçeneklerine `browsers` seçeneğini ekleyin. Tarayıcı adı yüklediğiniz sağlayıcıya bağlıdır (ör. Playwright için `chromium`, WebdriverIO için `chrome`).

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "browsers": ["chromium"]
          }
        }
      }
    }
  }
}
```

`CI` ortam değişkeni ayarlandıysa veya tarayıcı adı "Headless" içeriyorsa (ör. `ChromeHeadless`) başsız mod otomatik olarak etkinleştirilir. Aksi takdirde testler görünür tarayıcıda çalışır.

NOTE: `ng test --debug` ile hata ayıklama, tarayıcı modu tarafından desteklenmez.

## Şemalarla otomatik test yeniden düzenleme

IMPORTANT: `refactor-jasmine-vitest` şeması deneyseldir ve tüm olası test kalıplarını kapsamayabilir. Şemanın yaptığı değişiklikleri her zaman gözden geçirin.

Angular CLI, Jasmine testlerinizi Vitest kullanacak şekilde otomatik olarak yeniden düzenlemek için `refactor-jasmine-vitest` şemasını sağlar.

### Genel bakış

Şema, test dosyalarınızdaki (`.spec.ts`) aşağıdaki dönüşümleri otomatikleştirir:

- `fit` ve `fdescribe`'ı `it.only` ve `describe.only`'ye dönüştürür.
- `xit` ve `xdescribe`'ı `it.skip` ve `describe.skip`'e dönüştürür.
- `spyOn` çağrılarını eşdeğer `vi.spyOn`'a dönüştürür.
- `jasmine.objectContaining`'i `expect.objectContaining` ile değiştirir.
- `jasmine.any`'yi `expect.any` ile değiştirir.
- `jasmine.createSpy`'ı `vi.fn` ile değiştirir.
- `beforeAll`, `beforeEach`, `afterAll` ve `afterEach`'i Vitest eşdeğerlerine günceller.
- `fail()`'i Vitest'in `vi.fail()`'ine dönüştürür.
- Beklentileri Vitest API'leriyle eşleşecek şekilde ayarlar
- Otomatik olarak dönüştürülemeyen kod için TODO yorumları ekler

Şema aşağıdaki eylemleri **gerçekleştirmez**:

- `vitest` veya ilgili diğer bağımlılıkları yüklemez.
- `angular.json` dosyanızı Vitest builder'ını kullanacak şekilde değiştirmez veya `test` hedefinden derleme seçeneklerini (ör. `polyfills` veya `styles`) taşımaz.
- `karma.conf.js` veya `test.ts` dosyalarını kaldırmaz.
- Karmaşık veya iç içe spy senaryolarını ele almaz; bunlar manuel yeniden düzenleme gerektirebilir.

### Şemayı çalıştırma

Projeniz Vitest için yapılandırıldıktan sonra, test dosyalarınızı yeniden düzenlemek için şemayı çalıştırabilirsiniz.

Varsayılan projenizdeki **tüm** test dosyalarını yeniden düzenlemek için şunu çalıştırın:

```bash
ng g @schematics/angular:refactor-jasmine-vitest
```

### Seçenekler

Şemanın davranışını özelleştirmek için aşağıdaki seçenekleri kullanabilirsiniz:

| Seçenek                  | Açıklama                                                                                                         |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `--project <name>`       | Çoklu proje çalışma alanında yeniden düzenlenecek projeyi belirtin. <br> Örnek: `--project=my-lib`               |
| `--include <path>`       | Yalnızca belirli bir dosya veya dizini yeniden düzenleyin. <br> Örnek: `--include=src/app/app.component.spec.ts` |
| `--file-suffix <suffix>` | Test dosyaları için farklı bir dosya uzantısı belirtin. <br> Örnek: `--file-suffix=.test.ts`                     |
| `--add-imports`          | Vitest yapılandırmanızda globalleri devre dışı bıraktıysanız açık `vitest` import'ları ekleyin.                  |
| `--verbose`              | Uygulanan tüm dönüşümlerin ayrıntılı günlüğünü görün.                                                            |
| `--browser-mode`         | Testleri tarayıcı modunda çalıştırmayı planlıyorsanız.                                                           |

### Geçişten sonra

Şema tamamlandıktan sonra iyi bir uygulama olarak:

1.  **Testlerinizi çalıştırın**: Yeniden düzenlemeden sonra tüm testlerin hâlâ geçtiğinden emin olmak için `ng test`'i çalıştırın.
2.  **Değişiklikleri gözden geçirin**: Şemanın yaptığı değişiklikleri, özellikle karmaşık spy'lar veya mock'lar içeren karmaşık testlere dikkat ederek gözden geçirin; bunlar daha fazla manuel ayarlama gerektirebilir.

`ng test` komutu uygulamayı _izleme modunda_ derler ve yapılandırılan çalıştırıcıyı başlatır. Etkileşimli bir terminal kullanılırken ve CI'da çalışılmadığında izleme modu varsayılan olarak etkindir.

## Yapılandırma

Angular CLI, `angular.json` dosyasındaki seçeneklere dayalı olarak yapılandırmayı bellekte oluşturarak Vitest yapılandırmasını sizin için yönetir.

### Özel Vitest yapılandırması

IMPORTANT: Özel bir yapılandırma kullanmak gelişmiş seçenekleri etkinleştirirken, Angular ekibi yapılandırma dosyasının belirli içeriği veya içinde kullanılan herhangi bir üçüncü taraf eklentisi için doğrudan destek sağlamaz. CLI ayrıca düzgün çalışmayı sağlamak için belirli özellikleri (`test.projects`, `test.include`) geçersiz kılacaktır.

Varsayılan ayarları geçersiz kılmak için özel bir Vitest yapılandırma dosyası sağlayabilirsiniz. Mevcut seçeneklerin tam listesi için resmi [Vitest belgelerine](https://vitest.dev/config/) bakın.

**1. Doğrudan yol:**
`angular.json` dosyanızda bir Vitest yapılandırma dosyasına doğrudan yol sağlayın:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {"runnerConfig": "vitest.config.ts"}
        }
      }
    }
  }
}
```

**2. Temel yapılandırma için otomatik arama:**
`runnerConfig`'i `true` olarak ayarlarsanız, builder proje ve çalışma alanı köklerinizde paylaşılan bir `vitest-base.config.*` dosyası otomatik olarak arayacaktır.

## `zone.js` tabanlı yardımcılar desteklenmez

Vitest ile testler çalıştırılırken zone.js yamaları uygulanmaz, bu nedenle `fakeAsync`, `flush` veya `waitForAsync` gibi fonksiyonları kullanamazsınız.
Vitest'e geçiş yapmak için testlerinizi yerel async ve Vitest sahte zamanlayıcılarına da geçirmeniz gerekecektir. Vitest ile sahte zamanlayıcı kullanımları için [burada bir örneğe](/guide/testing/components-scenarios#vitest-sahte-zamanlayıcıları-ile-asenkron-test) bakın.

## Hata raporları

Sorunları ve özellik isteklerini [GitHub](https://github.com/angular/angular-cli/issues) üzerinden bildirin.

Ekibin sorunları ele almasına yardımcı olmak için mümkünse minimal bir yeniden üretim sağlayın.
