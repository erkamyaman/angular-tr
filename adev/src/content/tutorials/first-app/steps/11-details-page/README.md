# Integrate details page into application

Bu eğitim dersi, ayrıntılar sayfasını uygulamanıza nasıl bağlayacağınızı gösterir.

<docs-video src="https://www.youtube.com/embed/-jRxG84AzCI?si=CbqIpmRpwp5ZZDnu&amp;start=345"/>

IMPORTANT: Yönlendirmeyi (routing) öğrenmek için yerel ortamınızı kullanmanızı öneriyoruz.

## What you'll learn

Bu dersin sonunda uygulamanız, ayrıntılar sayfasına yönlendirme desteğine sahip olacaktır.

## Conceptual preview of routing with route parameters

Her konut konumunun, kullanıcı o öğe için ayrıntılar sayfasına gittiğinde görüntülenmesi gereken belirli ayrıntıları vardır. Bu hedefe ulaşmak için rota parametrelerini kullanmanız gerekecektir.

Rota parametreleri, rota URL'nizin bir parçası olarak dinamik bilgi eklemenizi sağlar. Kullanıcının hangi konut konumuna tıkladığını belirlemek için `HousingLocation` türünün `id` özelliğini kullanacaksınız.

<docs-workflow>

<docs-step title="Dinamik navigasyon için `routerLink` kullanın">
10. derste, `src/app/routes.ts` dosyasına rota parametresini tanımlayan özel bir segment içeren ikinci bir rota eklediniz, `id`:

```
'details/:id'
```

Bu durumda, `:id` dinamiktir ve rotanın kod tarafından nasıl istendiğine bağlı olarak değişecektir.

1.  `src/app/housing-location/housing-location.ts` dosyasında, `section` öğesine bir anchor etiketi ekleyin ve `routerLink` yönergesini dahil edin:

    <docs-code language="angular-ts" header="Add anchor with a routerLink directive to housing-location.ts" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/housing-location/housing-location.ts" visibleLines="[18]"/>

    `routerLink` yönergesi, Angular'ın router'ının uygulamada dinamik bağlantılar oluşturmasını sağlar. `routerLink`'e atanan değer, iki girişli bir dizidir: yolun statik kısmı ve dinamik veri.

    `routerLink`'in şablonda çalışması için, '@angular/router' paketinden `RouterLink` ve `RouterOutlet`'in dosya düzeyinde import'unu ekleyin, ardından bileşenin `imports` dizisini hem `RouterLink` hem de `RouterOutlet`'i içerecek şekilde güncelleyin.

1.  Bu noktada, uygulamanızda yönlendirmenin çalıştığını doğrulayabilirsiniz. Tarayıcıda, ana sayfayı yenileyin ve bir konut konumu için "Learn More" düğmesine tıklayın.

      <img alt="details page displaying the text 'details works!'" src="assets/images/tutorials/first-app/homes-app-lesson-11-step-1.png">

</docs-step>

<docs-step title="Rota parametrelerini alın">
Bu adımda, `Details` bileşeninde rota parametresini alacaksınız. Şu anda uygulama `details works!` görüntülüyor. Ardından, rota parametreleri kullanılarak aktarılan `id` değerini görüntülemek için kodu güncelleyeceksiniz.

1.  `src/app/details/details.ts` dosyasında, `Details` bileşeninde kullanacağınız fonksiyonları, sınıfları ve servisleri içe aktarmak için şablonu güncelleyin:

      <docs-code header="Update file level imports" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.ts" visibleLines="[1,4]"/>

1.  `housingLocationId` değerini görüntülemek için `@Component` dekoratörünün `template` özelliğini güncelleyin:

         ```angular-ts
         template: `<p>details works! {{ housingLocationId }}</p>`,
         ```

1.  `Details` sınıfının gövdesini aşağıdaki kodla güncelleyin:

         ```ts
         export class Details {
            route: ActivatedRoute = inject(ActivatedRoute);
            housingLocationId = -1;
            constructor() {
            this.housingLocationId = Number(this.route.snapshot.params['id']);
            }
         }
         ```

    Bu kod, `Details` bileşenine geçerli rota hakkındaki verilere erişmenizi sağlayan `ActivatedRoute` router özelliğine erişim verir. `constructor` içinde, kod rotadan alınan `id` parametresini bir dizeden sayıya dönüştürür.

1.  Tüm değişiklikleri kaydedin.

1.  Tarayıcıda, konut konumlarından birinin "Learn More" bağlantısına tıklayın ve sayfada görüntülenen sayısal değerin, verilerdeki o konumun `id` özelliğiyle eşleştiğini doğrulayın.
    </docs-step>

<docs-step title="`Details` bileşenini özelleştirin">
Artık yönlendirme uygulamada düzgün çalıştığına göre, `Details` şablonunu rota parametresi tarafından temsil edilen konut konumunun belirli verilerini görüntüleyecek şekilde güncellemek için harika bir zaman.

Verilere erişmek için `HousingService`'e bir çağrı ekleyeceksiniz.

1. Şablon kodunu aşağıdaki kodla eşleşecek şekilde güncelleyin:

   <docs-code language="angular-ts" header="Update the Details template in src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.ts" visibleLines="[8,29]"/>

   `housingLocation` özelliklerine isteğe bağlı zincirleme operatörü `?` ile erişildiğine dikkat edin. Bu, `housingLocation` değeri null veya undefined ise uygulamanın çökmemesini sağlar.

1. `Details` sınıfının gövdesini aşağıdaki kodla eşleşecek şekilde güncelleyin:

   <docs-code language="angular-ts" header="Update the Details class in src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.ts" visibleLines="[32,41]"/>

   Artık bileşen, seçilen konut konumuna göre doğru bilgileri görüntülemek için gereken koda sahiptir. `constructor` artık rota parametresini `getHousingLocationById` servis fonksiyonuna argüman olarak aktarmak için `HousingService`'e bir çağrı içermektedir.

1. Aşağıdaki stilleri `src/app/details/details.css` dosyasına kopyalayın:

   <docs-code header="Add styles for the Details" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.css" visibleLines="[1,71]"/>

   ve değişikliklerinizi kaydedin

1. `Details` bileşeninde, az önce oluşturulan `details.css` dosyasını stillerin kaynağı olarak kullanın:
   <docs-code language="angular-ts" header="Update details.ts to use the created css file" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.ts" visibleLines="[30]"/>

1. Tarayıcıda sayfayı yenileyin ve belirli bir konut konumu için "Learn More" bağlantısına tıkladığınızda, ayrıntılar sayfasının seçilen öğenin verilerine göre doğru bilgileri görüntülediğini doğrulayın.

<img alt="Details page listing home info" src="assets/images/tutorials/first-app/homes-app-lesson-11-step-3.png">

</docs-step>

<docs-step title="`Home` bileşeninde navigasyonu kontrol edin">
Önceki bir derste, `App` şablonunu bir `routerLink` içerecek şekilde güncellediniz. Bu kodu eklemek, logoya her tıklandığında `Home` bileşenine geri navigasyon yapılmasını sağlamak için uygulamanızı güncelledi.

1.  Kodunuzun aşağıdakiyle eşleştiğini doğrulayın:

      <docs-code language="angular-ts" header="Confirm the routerLink in app.ts" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/app.ts" visibleLines="[8,19]"/>

    Kodunuz zaten güncel olmalı ama emin olmak için doğrulayın.

    </docs-step>

</docs-workflow>

SUMMARY: Bu derste, ayrıntı sayfalarını göstermek için yönlendirme eklediniz.

Artık şunları biliyorsunuz:

- bir rotaya veri aktarmak için rota parametrelerini kullanma
- bir rota oluşturmak için dinamik veri kullanmak üzere `routerLink` yönergesini kullanma
- `HousingService`'ten belirli konut konumu bilgilerini görüntülemek için rota parametresi kullanma.

Şimdiye kadar gerçekten harika iş çıkardınız.

Bu derste ele alınan konular hakkında daha fazla bilgi için:

<docs-pill-row>
  <docs-pill href="guide/routing/read-route-state#activatedroute-ile-geçerli-rota-hakkında-bilgi-alma" title="Route Parameters"/>
  <docs-pill href="guide/routing" title="Routing in Angular Overview"/>
  <docs-pill href="guide/routing/common-router-tasks" title="Common Routing Tasks"/>
  <docs-pill href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Optional_chaining" title="Optional Chaining Operator"/>
</docs-pill-row>
