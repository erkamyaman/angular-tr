# Create the application's HousingLocation component

Bu eğitim dersi, Angular uygulamanıza `HousingLocation` bileşeninin nasıl ekleneceğini gösterir.

<docs-video src="https://www.youtube.com/embed/R0nRX8jD2D0?si=U4ONEbPvtptdUHTt&amp;start=440"/>

## What you'll learn

- Uygulamanızda yeni bir bileşen var: `HousingLocation` ve bileşenin uygulamanıza eklendiğini doğrulayan bir mesaj görüntüler.

<docs-workflow>

<docs-step title="`HousingLocation` bileşenini oluşturun">
Bu adımda, uygulamanız için yeni bir bileşen oluşturursunuz.

IDE'nizin **Terminal** bölmesinde:

1. Proje dizininizde, `first-app` dizinine gidin.

1. Yeni bir `HousingLocation` bileşeni oluşturmak için bu komutu çalıştırın

   ```shell
   ng generate component housingLocation
   ```

1. Uygulamanızı derlemek ve sunmak için bu komutu çalıştırın.

   ```shell
   ng serve
   ```

   NOTE: Bu adım yalnızca yerel ortamınız içindir!

1. Bir tarayıcı açın ve uygulamayı bulmak için `http://localhost:4200` adresine gidin.
1. Uygulamanın hatasız derlendiğini doğrulayın.

   HELPFUL: Yeni bir bileşen eklemiş olsanız bile, henüz uygulamanın şablonlarından hiçbirine dahil etmediğiniz için önceki dersteki gibi görünmesi gerekir.

1. Sonraki adımları tamamlarken `ng serve` komutunu çalışır durumda bırakın.
   </docs-step>

<docs-step title="Yeni bileşeni uygulamanızın düzenine ekleyin">
Bu adımda, yeni bileşen `HousingLocation`'ı uygulamanızın `Home` bileşenine eklersiniz, böylece uygulamanızın düzeninde görüntülenir.

IDE'nizin **Edit** bölmesinde:

1.  Editörde `home.ts` dosyasını açın.
1.  `home.ts` dosyasında, bu satırı dosya düzeyindeki import'lara ekleyerek `HousingLocation`'ı içe aktarın.

      <docs-code header="Import HousingLocation in src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[2]"/>

1.  Ardından `@Component` meta verilerinin `imports` özelliğini, diziye `HousingLocation` ekleyerek güncelleyin.

      <docs-code  header="Add HousingLocation to imports array in src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[6]"/>

1.  Artık bileşen, `Home` şablonunda kullanıma hazırdır. `@Component` meta verilerinin `template` özelliğini, `<app-housing-location>` etiketine bir referans içerecek şekilde güncelleyin.

      <docs-code language="angular-ts" header="Add housing location to the component template in src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[7,17]"/>

</docs-step>

<docs-step title="Bileşen için stilleri ekleyin">
Bu adımda, uygulamanızın düzgün görüntülenmesi için `HousingLocation` bileşeninin önceden yazılmış stillerini uygulamanıza kopyalayacaksınız.

1. `src/app/housing-location/housing-location.css` dosyasını açın ve aşağıdaki stilleri dosyaya yapıştırın:

   NOTE: Tarayıcıda, bunlar `src/app/housing-location/housing-location.ts` dosyasındaki `styles` dizisine eklenebilir.

   <docs-code header="Add CSS styles to housing location to the component in src/app/housing-location/housing-location.css" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/housing-location/housing-location.css"/>

1. Kodunuzu kaydedin, tarayıcıya dönün ve uygulamanın hatasız derlendiğini doğrulayın. Ekranda "housing-location works!" mesajının görüntülendiğini görmelisiniz. Bir sonraki adıma geçmeden önce tüm hataları düzeltin.

   <img alt="browser frame of homes-app displaying logo, filter text input box and search button and the message 'housing-location works!" src="assets/images/tutorials/first-app/homes-app-lesson-03-step-2.png">

</docs-step>

</docs-workflow>

SUMMARY: Bu derste, uygulamanız için yeni bir bileşen oluşturdunuz ve onu uygulamanın düzenine eklediniz.
