# Angular services

Bu eğitim dersi, bir Angular servisi oluşturmayı ve bağımlılık enjeksiyonu kullanarak uygulamanıza dahil etmeyi gösterir.

<docs-video src="https://www.youtube.com/embed/-jRxG84AzCI?si=rieGfJawp9xJ00Sz"/>

## What you'll learn

Uygulamanız, verilerinizi uygulamanıza sunan bir servise sahiptir.
Bu dersin sonunda, servis verileri yerel, statik verilerden okur.
İlerideki bir derste, servisi bir web servisinden veri alacak şekilde güncelleyeceksiniz.

## Conceptual preview of services

Bu eğitim, Angular servisleri ve bağımlılık enjeksiyonunu tanıtır.

### Angular services

_Angular servisleri_, uygulamanızdaki birden fazla bileşen tarafından kullanılabilen Angular uygulama verilerini ve işlevlerini ayırmanız için bir yol sağlar.
Birden fazla bileşen tarafından kullanılabilmesi için, bir servisin _enjekte edilebilir_ olması gerekir.
Enjekte edilebilir olan ve bir bileşen tarafından kullanılan servisler, o bileşenin bağımlılıkları haline gelir.
Bileşen bu servislere bağımlıdır ve onlar olmadan çalışamaz.

### Dependency injection

_Bağımlılık enjeksiyonu_, bir uygulamanın bileşenlerinin bağımlılıklarını ve diğer bileşenlerin kullanabileceği servisleri yöneten mekanizmadır.

<docs-workflow>

<docs-step title="Create a new service for your app">
Bu adım, uygulamanız için enjekte edilebilir bir servis oluşturur.

IDE'nizin **Terminal** bölmesinde:

1. Proje dizininizde, `first-app` dizinine gidin.
1. `first-app` dizininde, yeni servisi oluşturmak için bu komutu çalıştırın.

   ```shell
   ng generate service housing --skip-tests
   ```

1. Uygulamayı derlemek ve `http://localhost:4200` adresinde sunmak için `ng serve` komutunu çalıştırın.
1. Uygulamanın hatasız derlendiğini doğrulayın.
   Bir sonraki adıma geçmeden önce tüm hataları düzeltin.
   </docs-step>

<docs-step title="Add static data to the new service">
Bu adım, yeni servisinize bazı örnek veriler ekler.
İlerideki bir derste, statik verileri gerçek bir uygulamada yapabileceğiniz gibi veri almak için bir web arayüzüyle değiştireceksiniz.
Şimdilik, uygulamanızın yeni servisi, şimdiye kadar `Home` bileşeninde yerel olarak oluşturulan verileri kullanır.

IDE'nizin **Edit** bölmesinde:

1. `src/app/home/home.ts` dosyasından, `Home` bileşenindeki `housingLocationList` değişkenini ve dizi değerini kopyalayın.
1. `src/app/housing.service.ts` dosyasında:
   1. `HousingService` sınıfı içinde, önceki adımda `Home` bileşeninden kopyaladığınız değişkeni yapıştırın.
   1. `HousingService` sınıfı içinde, az önce kopyaladığınız veriden sonra bu fonksiyonları yapıştırın.
      Bu fonksiyonlar, bağımlılıkların servisin verilerine erişmesini sağlar.

      <docs-code header="Service functions in src/app/housing.service.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/housing.service.ts" visibleLines="[112,118]"/>

      Bu fonksiyonlara ilerideki bir derste ihtiyacınız olacak. Şimdilik, bu fonksiyonların belirli bir `HousingLocation`'ı id'ye göre veya tüm listeyi döndürdüğünü anlamak yeterlidir.

   1. `HousingLocation` için dosya düzeyinde bir import ekleyin.

      <docs-code header="Import HousingLocation type in  src/app/housing.service.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/housing.service.ts" visibleLines="[2]"/>

1. Uygulamanın hatasız derlendiğini doğrulayın.
   Bir sonraki adıma geçmeden önce tüm hataları düzeltin.
   </docs-step>

<docs-step title="Inject the new service into `Home`">
Bu adım, yeni servisi uygulamanızın `Home` bileşenine enjekte eder, böylece uygulama verilerini bir servisten okuyabilir.
İlerideki bir derste, statik verileri gerçek bir uygulamada yapabileceğiniz gibi veri almak için canlı bir veri kaynağıyla değiştireceksiniz.

IDE'nizin **Edit** bölmesinde, `src/app/home/home.ts` dosyasında:

1.  `src/app/home/home.ts` dosyasının en üstünde, `@angular/core`'dan içe aktarılan öğelere `inject`'i ekleyin. Bu, `inject` fonksiyonunu `Home` sınıfına aktaracaktır.

      <docs-code language="angular-ts" header="Update to src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.ts" visibleLines="[1]"/>

1.  `HousingService` için yeni bir dosya düzeyinde import ekleyin:

      <docs-code language="angular-ts" header="Add import to src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.ts" visibleLines="[4]"/>

1.  `Home` bileşeninden `housingLocationList` dizi girişlerini silin ve `housingLocationList`'e boş dizi (`[]`) değerini atayın. Birkaç adım sonra verileri `HousingService`'ten çekmek için kodu güncelleyeceksiniz.

1.  `Home` bileşeninde, yeni servisi enjekte etmek ve uygulama için verileri başlatmak üzere aşağıdaki kodu ekleyin. `constructor`, bu bileşen oluşturulduğunda çalışan ilk fonksiyondur. `constructor` içindeki kod, `housingLocationList`'e `getAllHousingLocations` çağrısından dönen değeri atayacaktır.

      <docs-code language="angular-ts" header="Initialize data from service in src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.ts" visibleLines="[23,30]"/>

1.  `src/app/home/home.ts` dosyasındaki değişiklikleri kaydedin ve uygulamanızın hatasız derlendiğini doğrulayın.
    Bir sonraki adıma geçmeden önce tüm hataları düzeltin.
    </docs-step>

</docs-workflow>

SUMMARY: Bu derste, uygulamanıza bir Angular servisi eklediniz ve onu `Home` sınıfına enjekte ettiniz.
Bu, uygulamanızın verilerini nasıl aldığını bölümlere ayırır.
Şimdilik, yeni servis verilerini statik bir veri dizisinden alır.
İlerideki bir derste, servisi bir API uç noktasından veri alacak şekilde yeniden düzenleyeceksiniz.

Bu derste ele alınan konular hakkında daha fazla bilgi için:

<docs-pill-row>
  <docs-pill href="guide/di/creating-and-using-services" title="Creating an injectable service"/>
  <docs-pill href="guide/di" title="Dependency injection in Angular"/>
  <docs-pill href="cli/generate/service" title="ng generate service"/>
  <docs-pill href="cli/generate" title="ng generate"/>
</docs-pill-row>
