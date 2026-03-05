# Adding a form to your Angular app

Bu eğitim dersi, bir Angular uygulamasına kullanıcı verilerini toplayan bir formun nasıl ekleneceğini gösterir.
Bu ders, çalışan bir Angular uygulamasıyla başlar ve ona nasıl form ekleneceğini gösterir.

Formun topladığı veriler yalnızca uygulamanın servisine gönderilir ve bu servis verileri tarayıcının konsoluna yazar.
Form verilerini göndermek ve almak için bir REST API kullanmak bu derste ele alınmamaktadır.

<docs-video src="https://www.youtube.com/embed/kWbk-dOJaNQ?si=FYMXGdUiT-qh321h"/>

IMPORTANT: Eğitimin bu adımı için yerel ortamınızı kullanmanızı öneriyoruz.

## What you'll learn

- Uygulamanızda, kullanıcıların uygulamanızın servisine gönderilen verileri girebileceği bir form var.
- Servis, formdaki verileri tarayıcının konsol günlüğüne yazar.

<docs-workflow>

<docs-step title="Add a method to send form data">
Bu adım, uygulamanızın servisine, form verilerini verilerin hedefine göndermek için alan bir metot ekler.
Bu örnekte, metot formdaki verileri tarayıcının konsol günlüğüne yazar.

IDE'nizin **Edit** bölmesinde:

1.  `src/app/housing.service.ts` dosyasında, `HousingService` sınıfı içine bu metodu sınıf tanımının en altına yapıştırın.

       <docs-code header="Submit method in src/app/housing.service.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/housing.service.ts" visibleLines="[120,124]"/>

1.  Uygulamanın hatasız derlendiğini doğrulayın.
    Bir sonraki adıma geçmeden önce tüm hataları düzeltin.
    </docs-step>

<docs-step title="Add the form functions to the details page">
Bu adım, formun etkileşimlerini yöneten kodu ayrıntılar sayfasına ekler.

IDE'nizin **Edit** bölmesinde, `src/app/details/details.ts` dosyasında:

1.  Dosyanın en üstündeki `import` ifadelerinden sonra, Angular form sınıflarını içe aktarmak için aşağıdaki kodu ekleyin.

      <docs-code header="Forms imports in src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[5]"/>

1.  `Details` dekoratörü meta verilerinde, `imports` özelliğini aşağıdaki kodla güncelleyin:

      <docs-code header="imports directive in src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[9]"/>

1.  `Details` sınıfında, `constructor()` metodundan önce form nesnesini oluşturmak için aşağıdaki kodu ekleyin.

      <docs-code header="template directive in src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[52,56]"/>

    Angular'da `FormGroup` ve `FormControl`, form oluşturmanızı sağlayan türlerdir. `FormControl` türü, varsayılan bir değer sağlayabilir ve form verilerini şekillendirebilir. Bu örnekte `firstName` bir `string`'dir ve varsayılan değeri boş dizedir.

1.  `Details` sınıfında, `constructor()` metodundan sonra **Şimdi Başvur** tıklamasını yönetmek için aşağıdaki kodu ekleyin.

      <docs-code header="template directive in src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[62,68]"/>

    Bu düğme henüz mevcut değil - bir sonraki adımda ekleyeceksiniz. Yukarıdaki kodda, `FormControl`'ler `null` döndürebilir. Bu kod, değer `null` ise varsayılan olarak boş dize kullanmak için nullish birleştirme operatörünü kullanır.

1.  Uygulamanın hatasız derlendiğini doğrulayın.
    Bir sonraki adıma geçmeden önce tüm hataları düzeltin.
    </docs-step>

<docs-step title="Add the form's markup to the details page">
Bu adım, formu görüntüleyen işaretlemeyi ayrıntılar sayfasına ekler.

IDE'nizin **Edit** bölmesinde, `src/app/details/details.ts` dosyasında:

1. `Details` dekoratörü meta verilerinde, formun işaretlemesini eklemek için `template` HTML'ini aşağıdaki kodla eşleşecek şekilde güncelleyin.

   <docs-code language="angular-ts" header="template directive in src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[10,45]"/>

   Şablon artık bir `(submit)="submitApplication()"` olay işleyicisi içermektedir. Angular, şablon kodunda olayları tanımlamak için olay adının etrafında parantez sözdizimi kullanır. Eşittir işaretinin sağ tarafındaki kod, bu olay tetiklendiğinde yürütülmesi gereken koddur. Tarayıcı olaylarına ve özel olaylara bağlanabilirsiniz.

1. Uygulamanın hatasız derlendiğini doğrulayın.
   Bir sonraki adıma geçmeden önce tüm hataları düzeltin.

   <img alt="details page with a form for applying to live at this location" src="assets/images/tutorials/first-app/homes-app-lesson-12-step-3.png">

</docs-step>

<docs-step title="Test your app's new form">
Bu adım, form verileri uygulamaya gönderildiğinde form verilerinin konsol günlüğünde göründüğünü görmek için yeni formu test eder.

1. IDE'nizin **Terminal** bölmesinde, `ng serve` çalışmıyorsa çalıştırın.
1. Tarayıcınızda, uygulamanızı `http://localhost:4200` adresinde açın.
1. Tarayıcıda uygulamaya sağ tıklayın ve bağlam menüsünden **İncele**'yi seçin.
1. Geliştirici araçları penceresinde **Konsol** sekmesini seçin.
   Sonraki adımlar için geliştirici araçları penceresinin görünür olduğundan emin olun.
1. Uygulamanızda:
   1. Bir konut konumu seçin ve ev hakkında ayrıntıları görmek için **Learn more** tıklayın.
   1. Evin ayrıntılar sayfasında, yeni formu bulmak için en alta kaydırın.
   1. Form alanlarına veri girin - herhangi bir veri olabilir.
   1. Verileri göndermek için **Apply now** seçin.
1. Geliştirici araçları penceresinde, form verilerinizi bulmak için günlük çıktısını inceleyin.
   </docs-step>

</docs-workflow>

SUMMARY: Bu derste, Angular'ın form özelliğini kullanarak uygulamanıza bir form eklediniz ve formda yakalanan verileri bir olay işleyici kullanarak bir bileşene bağladınız.

Bu derste ele alınan konular hakkında daha fazla bilgi için:

<docs-pill-row>
  <docs-pill href="guide/forms" title="Angular Forms"/>
  <docs-pill href="guide/templates/event-listeners" title="Event Handling"/>
</docs-pill-row>
