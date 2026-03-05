# Hello world

Bu ilk ders, bu eğitimdeki her dersin eksiksiz bir Angular uygulaması oluşturmak için yeni özellikler eklediği başlangıç noktası olarak hizmet eder. Bu derste, uygulamayı ünlü "Hello World" metnini görüntüleyecek şekilde güncelleyeceğiz.

<docs-video src="https://www.youtube.com/embed/UnOwDuliqZA?si=uML-cDRbrxmYdD_9"/>

## What you'll learn

Uygulamanız tarayıcıda başarıyla çalışıyorsa ve yürütülen içeriği hatasız görüntülüyorsa, geliştirme ortamınızın ve IDE'nizin bir Angular uygulaması oluşturmaya başlamak için doğru şekilde kurulduğunu doğrular.

NOTE: Gömülü editörle çalışıyorsanız, [dördüncü adıma](#create-hello-world) atlayın.
Tarayıcı oyun alanında çalışırken, uygulamayı çalıştırmak için `ng serve` komutunu kullanmanıza gerek yoktur. `ng generate` gibi diğer komutlar sağınızdaki konsol penceresinde çalıştırılabilir.

<docs-workflow>

<docs-step title="Download the default app">
Kod editörünün sağ üst köşesindeki "İndir" simgesine tıklayarak başlayın. Bu, bu eğitimin kaynak kodunu içeren bir `.zip` dosyası indirecektir. Bunu yerel Terminal ve IDE'nizde açın, ardından varsayılan uygulamayı test etmeye geçin.

Eğitimin herhangi bir adımında, o adımın kaynak kodunu indirmek ve oradan başlamak için bu simgeye tıklayabilirsiniz.
</docs-step>

<docs-step title="Test the default app">
Bu adımda, varsayılan başlangıç uygulamasını indirdikten sonra, varsayılan Angular uygulamasını derlersiniz.
Bu, geliştirme ortamınızın eğitime devam etmek için ihtiyacınız olan her şeye sahip olduğunu doğrular.

IDE'nizin **Terminal** bölmesinde:

1. Proje dizininizde, `first-app` dizinine gidin.
1. Uygulamayı çalıştırmak için gereken bağımlılıkları yüklemek üzere bu komutu çalıştırın.

   ```shell
   npm install
   ```

1. Varsayılan uygulamayı derlemek ve sunmak için bu komutu çalıştırın.

   ```shell
   ng serve
   ```

   Uygulama hatasız derlenmeli.

1. Geliştirme bilgisayarınızdaki bir web tarayıcısında `http://localhost:4200` adresini açın.
1. Varsayılan web sitesinin tarayıcıda göründüğünü doğrulayın.
1. Sonraki adımları tamamlarken `ng serve` komutunu çalışır durumda bırakabilirsiniz.
   </docs-step>

<docs-step title="Review the files in the project">
Bu adımda, varsayılan bir Angular uygulamasını oluşturan dosyaları tanıyacaksınız.

IDE'nizin **Explorer** bölmesinde:

1. Proje dizininizde, `first-app` dizinine gidin.
1. Bu dosyaları görmek için `src` dizinini açın.
   1. Dosya gezgininde Angular uygulama dosyalarını (`/src`) bulun.
      1. `index.html` uygulamanın en üst düzey HTML şablonudur.
      1. `styles.css` uygulamanın en üst düzey stil sayfasıdır.
      1. `main.ts` uygulamanın çalışmaya başladığı yerdir.
      1. `favicon.ico` herhangi bir web sitesinde olduğu gibi uygulamanın simgesidir.
   1. Dosya gezgininde Angular uygulamasının bileşen dosyalarını (`/app`) bulun.
      1. `app.ts`, `app-root` bileşenini tanımlayan kaynak dosyasıdır.
         Bu, uygulamadaki en üst düzey Angular bileşenidir. Bir bileşen, Angular uygulamasının temel yapı taşıdır.
         Bileşen tanımı, bileşenin kodunu, HTML şablonunu ve stillerini içerir; bunlar bu dosyada veya ayrı dosyalarda tanımlanabilir.

         Bu uygulamada stiller ayrı bir dosyada iken bileşenin kodu ve HTML şablonu bu dosyadadır.

      1. `app.css` bu bileşenin stil sayfasıdır.
      1. Yeni bileşenler bu dizine eklenir.

   1. Dosya gezgininde uygulama tarafından kullanılan görselleri içeren görsel dizinini (`/assets`) bulun.
   1. Dosya gezgininde bir Angular uygulamasının derlenmesi ve çalıştırılması için gereken, ancak normalde etkileşime girmediğiniz dosya ve dizinleri bulun.
      1. `.angular` Angular uygulamasını derlemek için gereken dosyaları içerir.
      1. `.e2e` uygulamayı test etmek için kullanılan dosyaları içerir.
      1. `.node_modules` uygulamanın kullandığı node.js paketlerini içerir.
      1. `angular.json` Angular uygulamasını derleme araçlarına tanımlar.
      1. `package.json`, tamamlanmış uygulamayı çalıştırmak için `npm` (node paket yöneticisi) tarafından kullanılır.
      1. `tsconfig.*` uygulamanın TypeScript derleyicisine yapılandırmasını tanımlayan dosyalardır.

Bir Angular uygulama projesini oluşturan dosyaları inceledikten sonra, bir sonraki adıma geçin.
</docs-step>

<docs-step title="Create `Hello World`">
Bu adımda, görüntülenen içeriği değiştirmek için Angular proje dosyalarını güncellersiniz.

IDE'nizde:

1. `first-app/src/index.html` dosyasını açın.
   NOTE: Bu adım ve sonraki adım yalnızca yerel ortamınız içindir!

1. `index.html` dosyasında, uygulamanın başlığını güncellemek için `<title>` öğesini bu kodla değiştirin.

   <docs-code header="Replace in src/index.html" path="adev/src/content/tutorials/first-app/steps/02-Home/src/index.html" visibleLines="[5]"/>

   Ardından, `index.html` dosyasında yaptığınız değişiklikleri kaydedin.

1. Sonra, `first-app/src/app/app.ts` dosyasını açın.
1. `app.ts` dosyasında, `@Component` tanımındaki `template` satırını, uygulama bileşenindeki metni değiştirmek için bu kodla değiştirin.

   <docs-code language="angular-ts" header="Replace in src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/02-Home/src/app/app.ts" visibleLines="[6,8]"/>

1. `app.ts` dosyasında, `App` sınıf tanımındaki `title` satırını, bileşen başlığını değiştirmek için bu kodla değiştirin.

   <docs-code header="Replace in src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/02-Home/src/app/app.ts" visibleLines="[11,13]"/>

   Ardından, `app.ts` dosyasında yaptığınız değişiklikleri kaydedin.

1. 1. adımdaki `ng serve` komutunu durdurduysanız, IDE'nizin **Terminal** penceresinde `ng serve` komutunu tekrar çalıştırın.
1. Tarayıcınızı açın ve `localhost:4200` adresine gidin; uygulamanın hatasız derlendiğini ve başlıkta _Homes_, gövdesinde _Hello world_ görüntülediğini doğrulayın:
   <img alt="browser frame of page displaying the text 'Hello World'" src="assets/images/tutorials/first-app/homes-app-lesson-01-browser.png">
   </docs-step>

</docs-workflow>

SUMMARY: Bu derste, varsayılan bir Angular uygulamasını _Hello world_ görüntüleyecek şekilde güncellediniz.
Bu süreçte, uygulamanızı test için yerel olarak sunmak üzere `ng serve` komutunu öğrendiniz.

Bu derste ele alınan konular hakkında daha fazla bilgi için:

<docs-pill-row>
  <docs-pill href="guide/components" title="Angular Components"/>
  <docs-pill href="tools/cli" title="Creating applications with the Angular CLI"/>
</docs-pill-row>
