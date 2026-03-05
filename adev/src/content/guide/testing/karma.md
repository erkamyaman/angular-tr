# Testing with Karma and Jasmine

[Vitest](https://vitest.dev) yeni Angular projeleri için varsayılan test çalıştırıcısı olsa da, [Karma](https://karma-runner.github.io) hâlâ desteklenen ve yaygın olarak kullanılan bir test çalıştırıcısıdır. Bu kılavuz, Angular uygulamanızı [Jasmine](https://jasmine.github.io) test çerçevesi ile Karma test çalıştırıcısını kullanarak test etme talimatları sağlar.

## Setting Up Karma and Jasmine

Karma ve Jasmine'i yeni bir proje için kurabilir veya mevcut bir projeye ekleyebilirsiniz.

### For New Projects

Karma ve Jasmine önceden yapılandırılmış yeni bir proje oluşturmak için `ng new` komutunu `--test-runner=karma` seçeneği ile çalıştırın:

```shell
ng new my-karma-app --test-runner=karma
```

### For Existing Projects

Mevcut bir projeye Karma ve Jasmine eklemek için şu adımları izleyin:

1.  **Gerekli paketleri yükleyin:**

    <docs-code-multifile>
      <docs-code header="npm" language="shell">
        npm install --save-dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="yarn" language="shell">
        yarn add --dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="pnpm" language="shell">
        pnpm add -D karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="bun" language="shell">
        bun add --dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
    </docs-code-multifile>

2.  **`angular.json` dosyasında test çalıştırıcısını yapılandırın:**

    `angular.json` dosyanızda `test` hedefini bulun ve `runner` seçeneğini `karma` olarak ayarlayın:

    ```json
    {
      // ...
      "projects": {
        "your-project-name": {
          // ...
          "architect": {
            "test": {
              "builder": "@angular/build:unit-test",
              "options": {
                "runner": "karma"
                // ... other options
              }
            }
          }
        }
      }
    }
    ```

3.  **Jasmine tipleri için `tsconfig.spec.json`'ı güncelleyin:**

    TypeScript'in `describe` ve `it` gibi global test fonksiyonlarını tanımasını sağlamak için `tsconfig.spec.json` dosyanızdaki `types` dizisine `"jasmine"` ekleyin:

    ```json
    {
      // ...
      "compilerOptions": {
        // ...
        "types": ["jasmine"]
      }
      // ...
    }
    ```

## Running Tests

Projeniz yapılandırıldıktan sonra [`ng test`](cli/test) komutunu kullanarak testleri çalıştırın:

```shell
ng test
```

`ng test` komutu uygulamayı _izleme modunda_ derler ve [Karma test çalıştırıcısını](https://karma-runner.github.io) başlatır.

Konsol çıktısı aşağıdaki gibi görünür:

```shell

02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS

```

Test çıktısı, [Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter) kullanılarak tarayıcıda görüntülenir.

<img alt="Jasmine HTML Reporter in the browser" src="assets/images/guide/testing/initial-jasmine-html-reporter.png">

Sadece o testi yeniden çalıştırmak için bir test satırına tıklayın veya seçilen test grubundaki ("test paketi") testleri yeniden çalıştırmak için bir açıklamaya tıklayın.

Bu arada `ng test` komutu değişiklikleri izlemeye devam eder. Bunu çalışırken görmek için bir kaynak dosyada küçük bir değişiklik yapıp kaydedin. Testler tekrar çalışır, tarayıcı yenilenir ve yeni test sonuçları görünür.

## Configuration

Angular CLI, Jasmine ve Karma yapılandırmasını sizin için yönetir. `angular.json` dosyasında belirtilen seçeneklere dayalı olarak tam yapılandırmayı bellekte oluşturur.

### Customizing Karma Configuration

Karma'yı özelleştirmek istiyorsanız, aşağıdaki komutu çalıştırarak bir `karma.conf.js` oluşturabilirsiniz:

```shell
ng generate config karma
```

HELPFUL: Karma yapılandırması hakkında daha fazla bilgi için [Karma yapılandırma kılavuzunu](http://karma-runner.github.io/6.4/config/configuration-file.html) okuyun.

### Setting the Test Runner in `angular.json`

Projeniz için test çalıştırıcısını açıkça Karma olarak ayarlamak istiyorsanız, `angular.json` dosyanızdaki `test` hedefini bulun ve `runner` seçeneğini `karma` olarak ayarlayın:

```json
{
  // ...
  "projects": {
    "your-project-name": {
      // ...
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "runner": "karma"
            // ... other options
          }
        }
      }
    }
  }
}
```

## Code coverage enforcement

Minimum bir kod kapsam seviyesini zorunlu kılmak için `karma.conf.js` dosyanızdaki `coverageReporter` bölümünde `check` özelliğini kullanabilirsiniz.

Örneğin, minimum %80 kapsam gerektirmek için:

```javascript
coverageReporter: {
  dir: require('path').join(__dirname, './coverage/<project-name>'),
  subdir: '.',
  reporters: [
    { type: 'html' },
    { type: 'text-summary' }
  ],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

Bu, belirtilen kapsam eşikleri karşılanmazsa test çalışmasının başarısız olmasına neden olur.

## Testing in continuous integration

Karma testlerinizi bir CI ortamında çalıştırmak için aşağıdaki komutu kullanın:

```shell
ng test --no-watch --no-progress --browsers=ChromeHeadless
```

NOTE: `--no-watch` ve `--no-progress` bayrakları, testlerin bir kez çalışıp temiz bir şekilde çıkmasını sağlamak için CI ortamlarında Karma için kritik öneme sahiptir. `--browsers=ChromeHeadless` bayrağı da grafik arayüz olmadan tarayıcı ortamında testleri çalıştırmak için gereklidir.

## Debugging tests

Testleriniz beklediğiniz gibi çalışmıyorsa, bunları tarayıcıda inceleyebilir ve hata ayıklayabilirsiniz.

Karma test çalıştırıcısı ile bir uygulamada hata ayıklamak için:

1.  Karma tarayıcı penceresini açın. Bu adımda yardıma ihtiyacınız varsa [Test için kurulum](guide/testing#set-up-for-testing) bölümüne bakın.
2.  Yeni bir tarayıcı sekmesi açmak ve testleri yeniden çalıştırmak için **DEBUG** düğmesine tıklayın.
3.  Tarayıcının **Geliştirici Araçlarını** açın. Windows'ta `Ctrl-Shift-I` tuşlarına basın. macOS'ta `Command-Option-I` tuşlarına basın.
4.  **Sources** bölümünü seçin.
5.  `Control/Command-P` tuşlarına basın ve ardından test dosyanızın adını yazmaya başlayarak açın.
6.  Testte bir kesme noktası ayarlayın.
7.  Tarayıcıyı yenileyin ve kesme noktasında durduğunu fark edin.

<img alt="Karma debugging" src="assets/images/guide/testing/karma-1st-spec-debug.png">
