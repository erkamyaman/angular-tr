# Create Home component

Bu eğitim dersi, Angular uygulamanız için nasıl yeni bir [bileşen](guide/components) oluşturacağınızı gösterir.

<docs-video src="https://www.youtube.com/embed/R0nRX8jD2D0?si=OMVaw71EIa44yIOJ"/>

## What you'll learn

Uygulamanızda yeni bir bileşen var: `Home`.

## Conceptual preview of Angular components

Angular uygulamaları, Angular'ın yapı taşları olan bileşenler etrafında oluşturulur.
Bileşenler, uygulamadaki bir öğenin işlevini ve görünümünü sağlayan kodu, HTML düzenini ve CSS stil bilgilerini içerir.
Angular'da bileşenler başka bileşenler içerebilir. Bir uygulamanın işlevleri ve görünümü bileşenlere bölünebilir ve parçalanabilir.

Angular'da bileşenler, özelliklerini tanımlayan meta verilere sahiptir.
`Home` bileşeninizi oluştururken şu özellikleri kullanırsınız:

- `selector`: Angular'ın şablonlarda bileşene nasıl başvurduğunu tanımlar.
- `standalone`: bileşenin bir `NgModule` gerektirip gerektirmediğini tanımlar.
- `imports`: bileşenin bağımlılıklarını tanımlar.
- `template`: bileşenin HTML işaretlemesini ve düzenini tanımlar.
- `styleUrls`: bileşenin kullandığı CSS dosyalarının URL'lerini bir dizi içinde listeler.

<docs-pill-row>
  <docs-pill href="api/core/Component" title="Learn more about Components"/>
</docs-pill-row>

<docs-workflow>

<docs-step title="`Home` bileşenini oluşturun">
Bu adımda, uygulamanız için yeni bir bileşen oluşturursunuz.

IDE'nizin **Terminal** bölmesinde:

1. Proje dizininizde, `first-app` dizinine gidin.
1. Yeni bir `Home` bileşeni oluşturmak için bu komutu çalıştırın

   ```shell
   ng generate component home
   ```

1. Uygulamanızı derlemek ve sunmak için bu komutu çalıştırın.

   NOTE: Bu adım yalnızca yerel ortamınız içindir!

   ```shell
   ng serve
   ```

1. Bir tarayıcı açın ve uygulamayı bulmak için `http://localhost:4200` adresine gidin.

1. Uygulamanın hatasız derlendiğini doğrulayın.

   HELPFUL: Yeni bir bileşen eklemiş olsanız bile, henüz uygulamanın şablonlarından hiçbirine dahil etmediğiniz için önceki dersteki gibi görünmesi gerekir.

1. Sonraki adımları tamamlarken `ng serve` komutunu çalışır durumda bırakın.
   </docs-step>

<docs-step title="Yeni bileşeni uygulamanızın düzenine ekleyin">
Bu adımda, yeni bileşen `Home`'u, uygulamanızın kök bileşeni `App`'e eklersiniz, böylece uygulamanızın düzeninde görüntülenir.

IDE'nizin **Edit** bölmesinde:

1.  Editörde `app.ts` dosyasını açın.
1.  `app.ts` dosyasında, bu satırı dosya düzeyindeki import'lara ekleyerek `Home`'u içe aktarın.

      <docs-code header="Import Home in src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.ts" visibleLines="[2]"/>

1.  `app.ts` dosyasında, `@Component` içindeki `imports` dizi özelliğini güncelleyin ve `Home`'u ekleyin.

      <docs-code header="Replace in src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.ts" visibleLines="[6]"/>

1.  `app.ts` dosyasında, `@Component` içindeki `template` özelliğini aşağıdaki HTML kodunu içerecek şekilde güncelleyin.

      <docs-code language="angular-ts" header="Replace in src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.ts" visibleLines="[7,16]"/>

1.  Değişikliklerinizi `app.ts` dosyasına kaydedin.
1.  `ng serve` çalışıyorsa, uygulama güncellenmelidir.
    `ng serve` çalışmıyorsa, tekrar başlatın.
    Uygulamanızdaki _Hello world_ metni, `Home` bileşeninden gelen _home works!_ metniyle değişmelidir.
1.  Tarayıcıda çalışan uygulamayı kontrol edin ve uygulamanın güncellendiğini doğrulayın.

  <img alt="browser frame of page displaying the text 'home works!'" src="assets/images/tutorials/first-app/homes-app-lesson-02-step-2.png">

</docs-step>

<docs-step title="`Home` bileşenine özellikler ekleyin">

Bu adımda `Home`'a özellikler eklersiniz.

Önceki adımda, varsayılan `Home` bileşenini uygulamanızın şablonuna eklediniz, böylece varsayılan HTML'si uygulamada göründü.
Bu adımda, ilerideki bir derste kullanılacak olan bir arama filtresi ve düğmesi eklersiniz.
Şimdilik, `Home` sadece bunlara sahip.
Bu adımın yalnızca arama öğelerini düzene eklediğini, henüz herhangi bir işlevsellik sağlamadığını unutmayın.

Başlangıç uygulamasını indirmek yerine yeni bir Angular projesinden başladıysanız
(ng new): arama düğmesi ve giriş kenarlığının görünür olması için bu genel stilleri `src/styles.css` dosyasına ekleyin:

```
:root {
  --primary-color: #605DC8;
  --secondary-color: #8B89E6;
  --accent-color: #e8e7fa;
  --shadow-color: #E8E8E8;
}

button.primary {
  padding: 10px;
  border: solid 1px var(--primary-color);
  background: var(--primary-color);
  color: white;
  border-radius: 8px;
}
```

IDE'nizin **Edit** bölmesinde:

1.  `first-app` dizininde, editörde `home.ts` dosyasını açın.
1.  `home.ts` dosyasında, `@Component` içindeki `template` özelliğini bu kodla güncelleyin.

      <docs-code language="angular-ts" header="Replace in src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/home/home.ts" visibleLines="[5,12]"/>

1.  Ardından, editörde `home.css` dosyasını açın ve içeriği bu stillerle güncelleyin.

    NOTE: Tarayıcıda, bunlar `src/app/home/home.ts` dosyasındaki `styles` dizisine eklenebilir.

       <docs-code header="Replace in src/app/home/home.css" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/home/home.css"/>

1.  Uygulamanın hatasız derlendiğini doğrulayın. Uygulamanızda filtre sorgu kutusunu ve düğmeyi bulmalı ve bunların stillendirilmiş olması gerekir. Bir sonraki adıma geçmeden önce tüm hataları düzeltin.

   <img alt="browser frame of homes-app displaying logo, filter text input box and search button" src="assets/images/tutorials/first-app/homes-app-lesson-02-step-3.png">
</docs-step>

</docs-workflow>

SUMMARY: Bu derste, uygulamanız için yeni bir bileşen oluşturdunuz ve ona bir filtre düzenleme kontrolü ve düğme eklediniz.

Bu derste ele alınan konular hakkında daha fazla bilgi için:

<docs-pill-row>
  <docs-pill href="cli/generate/component" title="`ng generate component`"/>
  <docs-pill href="api/core/Component" title="`Component` reference"/>
  <docs-pill href="guide/components" title="Angular components overview"/>
</docs-pill-row>
