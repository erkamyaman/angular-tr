# Yerel ayar verilerinin global varyantlarını içe aktarma

[Angular CLI][CliMain], [`ng build`][CliBuild] komutunu `--localize` seçeneğiyle çalıştırdığınızda yerel ayar verilerini otomatik olarak dahil eder.

```shell
ng build --localize
```

HELPFUL: Angular'ın ilk kurulumu zaten Amerika Birleşik Devletleri için İngilizce \(`en-US`\) yerel ayar verilerini içerir.
[Angular CLI][CliMain], [`ng build`][CliBuild] komutunu `--localize` seçeneğiyle kullandığınızda yerel ayar verilerini otomatik olarak dahil eder ve `LOCALE_ID` değerini ayarlar.

npm'deki `@angular/common` paketi yerel ayar veri dosyalarını içerir.
Yerel ayar verilerinin global varyantları `@angular/common/locales/global` içinde mevcuttur.

## Fransızca için `import` örneği

Örneğin, uygulamayı başlattığınız `main.ts` dosyasında Fransızca \(`fr`\) için global varyantları içe aktarabilirsiniz.

<docs-code header="src/main.ts (import locale)" path="adev/src/content/examples/i18n/src/main.ts" region="global-locale"/>

HELPFUL: Bir `NgModules` uygulamasında, bunu `app.module` dosyanızda içe aktarırsınız.

[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[CliBuild]: cli/build 'ng build | CLI | Angular'
