# Uçtan Uca Test

Uçtan uca veya (E2E) test, tüm uygulamanızın baştan sona veya _"uçtan uca"_ beklendiği gibi çalıştığını doğrulamak için kullanılan bir test biçimidir. E2E testi, kodunuzun temel uygulama ayrıntılarından tamamen bağımsız olması bakımından birim testinden farklıdır. Genellikle bir uygulamayı, kullanıcının onunla etkileşim kurma şeklini taklit eden bir biçimde doğrulamak için kullanılır. Bu sayfa, Angular CLI kullanarak Angular'da uçtan uca teste başlama kılavuzu olarak hizmet eder.

## E2E Testini Kurma

Angular CLI, Angular uygulamanız için uçtan uca testleri çalıştırmak için ihtiyacınız olan her şeyi indirir ve kurar.

```shell

ng e2e

```

`ng e2e` komutu önce projenizde "e2e" hedefini kontrol eder. Bulamazsa, CLI hangi e2e paketini kullanmak istediğinizi sorar ve kurulum sürecinde size rehberlik eder.

```text

Cannot find "e2e" target for the specified project.
You can add a package that implements these capabilities.

For example:
Cypress: ng add @cypress/schematic
Nightwatch: ng add @nightwatch/schematics
WebdriverIO: ng add @wdio/schematics
Playwright: ng add playwright-ng-schematics
Puppeteer: ng add @puppeteer/ng-schematics

Would you like to add a package with "e2e" capabilities now?
No
❯ Cypress
Nightwatch
WebdriverIO
Playwright
Puppeteer

```

Yukarıdaki listeden kullanmak istediğiniz test çalıştırıcısını bulamazsanız, `ng add` kullanarak manuel olarak bir paket ekleyebilirsiniz.

## E2E Testlerini Çalıştırma

Uygulamanız uçtan uca test için yapılandırıldığına göre, testlerinizi çalıştırmak için aynı komutu kullanabiliriz.

```shell

ng e2e

```

Entegre e2e paketlerinden herhangi biriyle testlerinizi çalıştırmanın "özel" bir tarafı olmadığını unutmayın. `ng e2e` komutu aslında arka planda `e2e` builder'ını çalıştırmaktadır. `e2e` adında her zaman [kendi özel builder'ınızı oluşturabilir](tools/cli/cli-builder#builder-oluşturma) ve `ng e2e` kullanarak çalıştırabilirsiniz.

## Uçtan Uca Test Araçları Hakkında Daha Fazla Bilgi

| Test Aracı  | Ayrıntılar                                                                                                    |
| :---------- | :------------------------------------------------------------------------------------------------------------ |
| Cypress     | [Cypress ile başlarken](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test) |
| Nightwatch  | [Nightwatch ile başlarken](https://nightwatchjs.org/guide/writing-tests/introduction.html)                    |
| WebdriverIO | [Webdriver.io ile başlarken](https://webdriver.io/docs/gettingstarted)                                        |
| Playwright  | [Playwright ile başlarken](https://playwright.dev/docs/writing-tests)                                         |
| Puppeteer   | [Puppeteer ile başlarken](https://pptr.dev)                                                                   |
