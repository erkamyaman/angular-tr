# Add HTTP communication to your app

Bu eğitim, HTTP ve bir API'yi uygulamanıza nasıl entegre edeceğinizi gösterir.

Bu noktaya kadar uygulamanız, bir Angular servisindeki statik bir diziden veri okumuştur. Bir sonraki adım, uygulamanızın HTTP üzerinden iletişim kuracağı bir JSON sunucusu kullanmaktır. HTTP isteği, bir sunucudan gelen verilerle çalışma deneyimini simüle edecektir.

<docs-video src="https://www.youtube.com/embed/5K10oYJ5Y-E?si=TiuNKx_teR9baO7k"/>

IMPORTANT: Eğitimin bu adımı için yerel ortamınızı kullanmanızı öneriyoruz.

## What you'll learn

Uygulamanız bir JSON sunucusundan veri kullanacak

<docs-workflow>

<docs-step title="JSON sunucusunu yapılandırın">
JSON Server, sahte REST API'ler oluşturmak için kullanılan açık kaynaklı bir araçtır. Bunu, şu anda konut servisinde depolanan konut konumu verilerini sunmak için kullanacaksınız.

1. Aşağıdaki komutu kullanarak npm'den `json-server` yükleyin.

   ```bash
   npm install -g json-server
   ```

1. Projenizin kök dizininde, `db.json` adında bir dosya oluşturun. Bu, `json-server` için verilerin depolanacağı yerdir.

1. `db.json` dosyasını açın ve aşağıdaki kodu dosyaya kopyalayın

   ```json
   {
     "locations": [
       {
         "id": 0,
         "name": "Acme Fresh Start Housing",
         "city": "Chicago",
         "state": "IL",
         "photo": "https://angular.dev/assets/images/tutorials/common/bernard-hermant-CLKGGwIBTaY-unsplash.jpg",
         "availableUnits": 4,
         "wifi": true,
         "laundry": true
       },
       {
         "id": 1,
         "name": "A113 Transitional Housing",
         "city": "Santa Monica",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/brandon-griggs-wR11KBaB86U-unsplash.jpg",
         "availableUnits": 0,
         "wifi": false,
         "laundry": true
       },
       {
         "id": 2,
         "name": "Warm Beds Housing Support",
         "city": "Juneau",
         "state": "AK",
         "photo": "https://angular.dev/assets/images/tutorials/common/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg",
         "availableUnits": 1,
         "wifi": false,
         "laundry": false
       },
       {
         "id": 3,
         "name": "Homesteady Housing",
         "city": "Chicago",
         "state": "IL",
         "photo": "https://angular.dev/assets/images/tutorials/common/ian-macdonald-W8z6aiwfi1E-unsplash.jpg",
         "availableUnits": 1,
         "wifi": true,
         "laundry": false
       },
       {
         "id": 4,
         "name": "Happy Homes Group",
         "city": "Gary",
         "state": "IN",
         "photo": "https://angular.dev/assets/images/tutorials/common/krzysztof-hepner-978RAXoXnH4-unsplash.jpg",
         "availableUnits": 1,
         "wifi": true,
         "laundry": false
       },
       {
         "id": 5,
         "name": "Hopeful Apartment Group",
         "city": "Oakland",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/r-architecture-JvQ0Q5IkeMM-unsplash.jpg",
         "availableUnits": 2,
         "wifi": true,
         "laundry": true
       },
       {
         "id": 6,
         "name": "Seriously Safe Towns",
         "city": "Oakland",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/phil-hearing-IYfp2Ixe9nM-unsplash.jpg",
         "availableUnits": 5,
         "wifi": true,
         "laundry": true
       },
       {
         "id": 7,
         "name": "Hopeful Housing Solutions",
         "city": "Oakland",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/r-architecture-GGupkreKwxA-unsplash.jpg",
         "availableUnits": 2,
         "wifi": true,
         "laundry": true
       },
       {
         "id": 8,
         "name": "Seriously Safe Towns",
         "city": "Oakland",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/saru-robert-9rP3mxf8qWI-unsplash.jpg",
         "availableUnits": 10,
         "wifi": false,
         "laundry": false
       },
       {
         "id": 9,
         "name": "Capital Safe Towns",
         "city": "Portland",
         "state": "OR",
         "photo": "https://angular.dev/assets/images/tutorials/common/webaliser-_TPTXZd9mOo-unsplash.jpg",
         "availableUnits": 6,
         "wifi": true,
         "laundry": true
       }
     ]
   }
   ```

1. Bu dosyayı kaydedin.

1. Yapılandırmanızı test etme zamanı. Komut satırından, projenizin kök dizininde aşağıdaki komutları çalıştırın.

   ```bash
   json-server --watch db.json
   ```

1. Web tarayıcınızda, `http://localhost:3000/locations` adresine gidin ve yanıtın `db.json` dosyasında depolanan verileri içerdiğini doğrulayın.

Yapılandırmanızda herhangi bir sorun yaşarsanız, [resmi belgelerden](https://www.npmjs.com/package/json-server) daha fazla ayrıntı bulabilirsiniz.
</docs-step>

<docs-step title="Servisi yerel dizi yerine web sunucusu kullanacak şekilde güncelleyin">
Veri kaynağı yapılandırıldı, bir sonraki adım web uygulamanızı buna bağlanacak ve verileri kullanacak şekilde güncellemektir.

1.  `src/app/housing.service.ts` dosyasında aşağıdaki değişiklikleri yapın:

1.  `housingLocationList` özelliğini ve verileri içeren diziyi, ayrıca `baseUrl` özelliğini kaldırmak için kodu güncelleyin.

1.  `url` adında bir string özelliği ekleyin ve değerini `'http://localhost:3000/locations'` olarak ayarlayın

    <docs-code header="Add url property to housing.service.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[8]"/>

    Bu kod, dosyanın geri kalanında hatalara neden olacaktır çünkü `housingLocationList` özelliğine bağımlıdır. Servis metotlarını şimdi güncelleyeceğiz.

1.  `getAllHousingLocations` fonksiyonunu, yapılandırdığınız web sunucusuna bir çağrı yapacak şekilde güncelleyin.

     <docs-code header="Update the getAllHousingLocations method in housing.service.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[10,13]"/>

    Kod artık HTTP üzerinden bir **GET** isteği yapmak için asenkron kod kullanmaktadır.

    HELPFUL: Bu örnek için kod `fetch` kullanmaktadır. Daha gelişmiş kullanım durumları için Angular tarafından sağlanan `HttpClient` kullanmayı düşünün.

1.  `getHousingLocationsById` fonksiyonunu, yapılandırdığınız web sunucusuna bir çağrı yapacak şekilde güncelleyin.

    HELPFUL: `fetch` metodunun, eşleşen `id` özellik değerine sahip konum verilerini _sorgulamak_ için güncellendiğine dikkat edin. Daha fazla bilgi için [URL Arama Parametresi](https://developer.mozilla.org/en-US/docs/Web/API/URL/search) bölümüne bakın.

     <docs-code header="Update the getHousingLocationById method in housing.service.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[15,19]"/>

1.  Tüm güncellemeler tamamlandığında, güncellenmiş servisiniz aşağıdaki kodla eşleşmelidir.

     <docs-code header="Final version of housing.service.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[1,25]" />

</docs-step>

<docs-step title="Bileşenleri konut servisine asenkron çağrılar kullanacak şekilde güncelleyin">
Sunucu artık HTTP isteğinden veri okuyor ancak servise bağımlı olan bileşenler, servisin senkron sürümünü kullanmak üzere programlandıkları için artık hata vermektedir.

1.  `src/app/home/home.ts` dosyasında, `constructor`'ı yeni asenkron `getAllHousingLocations` metodu sürümünü kullanacak şekilde güncelleyin. Durumumuz için sinyaller kullanmadığımızdan, Angular'a bir değişiklik olduğunu ve senkronizasyon gerektirdiğini bildirmeniz gerekir. Bunu yapmak için `this.changeDetectorRef.markForCheck()` çağrısını yapın.

      <docs-code header="Update constructor in home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/home/home.ts" visibleLines="[30,38]"/>

1.  `src/app/details/details.ts` dosyasında, `constructor`'ı yeni asenkron `getHousingLocationById` metodu sürümünü kullanacak şekilde güncelleyin. Daha önce olduğu gibi, değişiklikleri Angular'a bildirmek için `this.changeDetectorRef.markForCheck()` çağrısını da yapmalısınız.

      <docs-code header="Update constructor in details.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/details/details.ts" visibleLines="[60,66]"/>

1.  Kodunuzu kaydedin.

1.  Uygulamayı tarayıcıda açın ve herhangi bir hata olmadan çalıştığını doğrulayın.
    </docs-step>

</docs-workflow>

NOTE: Bu ders tarayıcı `fetch` API'sine dayanmaktadır. Interceptor desteği için lütfen [Http Client belgelerine](/guide/http) bakın.

SUMMARY: Bu derste, uygulamanızı yerel bir web sunucusu (`json-server`) kullanacak şekilde güncellediniz ve veri almak için asenkron servis metotlarını kullandınız.

Tebrikler! Bu eğitimi başarıyla tamamladınız ve daha karmaşık Angular Uygulamaları oluşturma yolculuğunuza devam etmeye hazırsınız.

Daha fazla bilgi edinmek isterseniz, Angular'ın diğer geliştirici [eğitimlerini](tutorials) ve [kılavuzlarını](overview) tamamlamayı düşünebilirsiniz.
