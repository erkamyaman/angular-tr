# Add routes to the application

Bu eğitim dersi, uygulamanıza rotaların nasıl ekleneceğini gösterir.

<docs-video src="https://www.youtube.com/embed/r5DEBMuStPw?si=H6Bx6nLJoMLaMxkx" />

IMPORTANT: Yönlendirmeyi (routing) öğrenmek için yerel ortamınızı kullanmanızı öneriyoruz.

## What you'll learn

Bu dersin sonunda uygulamanız yönlendirme desteğine sahip olacaktır.

## Conceptual preview of routing

Bu eğitim, Angular'da yönlendirmeyi tanıtır. Yönlendirme, uygulamadaki bir bileşenden diğerine navigasyon yapabilme yeteneğidir. [Tek Sayfa Uygulamalarında (SPA)](guide/routing), kullanıcı için istenen görünümü temsil etmek üzere sayfanın yalnızca bazı bölümleri güncellenir.

[Angular Router](guide/routing), kullanıcıların rotalar tanımlamasına ve o rota uygulama tarafından istendiğinde ekranda hangi bileşenin görüntülenmesi gerektiğini belirtmesine olanak tanır.

Bu derste, ayrıntılar sayfasına navigasyon yapabilmek için uygulamanızda yönlendirmeyi etkinleştireceksiniz.

<docs-workflow>

<docs-step title="Varsayılan bir details bileşeni oluşturun ">
1. Terminalden, `Details` bileşenini oluşturmak için aşağıdaki komutu girin:

    ```shell
    ng generate component details
    ```

    Bu bileşen, belirli bir konut konumu hakkında daha fazla bilgi sağlayan ayrıntılar sayfasını temsil edecektir.

</docs-step>

<docs-step title="Uygulamaya yönlendirme ekleyin">
1.  `src/app` dizininde, `routes.ts` adında bir dosya oluşturun. Bu dosya, uygulamadaki rotaları tanımlayacağımız yerdir.

2.  `main.ts` dosyasında, uygulamada yönlendirmeyi etkinleştirmek için aşağıdaki güncellemeleri yapın:
    1.  Routes dosyasını ve `provideRouter` fonksiyonunu içe aktarın:

          <docs-code header="Import routing details in src/main.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/main.ts" visibleLines="[7,8]"/>

    1.  `bootstrapApplication` çağrısını yönlendirme yapılandırmasını dahil edecek şekilde güncelleyin:

          <docs-code header="Add router configuration in src/main.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/main.ts" visibleLines="[10,17]"/>

3.  `src/app/app.ts` dosyasında, bileşeni yönlendirme kullanacak şekilde güncelleyin:
    1.  Router yönergeleri `RouterOutlet` ve `RouterLink` için dosya düzeyinde import'lar ekleyin:

          <docs-code language="angular-ts" header="Import router directives in src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.ts" visibleLines="[3]"/>

    1.  `@Component` meta verileri imports'una `RouterOutlet` ve `RouterLink` ekleyin

          <docs-code language="angular-ts" header="Add router directives to component imports in src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.ts" visibleLines="[6]"/>

    1.  `template` özelliğinde, `<app-home />` etiketini `<router-outlet>` yönergesiyle değiştirin ve ana sayfaya geri dönüş bağlantısı ekleyin. Kodunuz bu kodla eşleşmelidir:

          <docs-code language="angular-ts" header="Add router-outlet in src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.ts" visibleLines="[7,18]"/>

</docs-step>

<docs-step title="Yeni bileşene rota ekleyin">
Önceki adımda, şablondaki `<app-home>` bileşenine olan referansı kaldırdınız. Bu adımda, o bileşene yeni bir rota ekleyeceksiniz.

1. `routes.ts` dosyasında, bir rota oluşturmak için aşağıdaki güncellemeleri yapın.
   1. `Home`, `Details` ve rota tanımlarında kullanacağınız `Routes` türü için dosya düzeyinde import'lar ekleyin.

      <docs-code header="Import components and Routes" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/routes.ts" visibleLines="[1,3]"/>

   1. `Routes` türünde `routeConfig` adında bir değişken tanımlayın ve uygulama için iki rota tanımlayın:
      <docs-code header="Add routes to the app" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/routes.ts" visibleLines="[5,18]"/>

      `routeConfig` dizisindeki girişler, uygulamadaki rotaları temsil eder. İlk giriş, URL `''` ile eşleştiğinde `Home` bileşenine navigasyon yapar. İkinci giriş, ilerideki bir derste tekrar ele alınacak bazı özel biçimlendirme kullanır.

1. Tüm değişiklikleri kaydedin ve uygulamanın tarayıcıda çalıştığını doğrulayın. Uygulama hala konut konumları listesini görüntülemelidir.
   </docs-step>

</docs-workflow>

SUMMARY: Bu derste, uygulamanızda yönlendirmeyi etkinleştirdiniz ve yeni rotalar tanımladınız. Artık uygulamanız görünümler arasında navigasyonu destekleyebilir. Bir sonraki derste, belirli bir konut konumu için "ayrıntılar" sayfasına navigasyon yapmayı öğreneceksiniz.

Uygulamanızla büyük ilerleme kaydediyorsunuz, aferin.

Bu derste ele alınan konular hakkında daha fazla bilgi için:

<docs-pill-row>
  <docs-pill href="guide/routing" title="Routing in Angular Overview"/>
  <docs-pill href="guide/routing/common-router-tasks" title="Common Routing Tasks"/>
</docs-pill-row>
