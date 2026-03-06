# Bileşen şablonuna interpolation ekleyin

Bu eğitim dersi, bir şablonda dinamik verileri görüntülemek için Angular şablonlarına interpolasyon eklemeyi gösterir.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=IFAly3Ss8dwqFx8N&amp;start=338"/>

## Neler öğreneceksiniz

- Uygulamanız `HousingLocation` şablonunda interpolasyon değerlerini görüntüleyecektir.
- Uygulamanız bir konut konumu verisini tarayıcıya işleyecektir.

## İnterpolasyonun kavramsal önizlemesi

Bu adımda, interpolasyon kullanarak `input` özelliklerinden okunan değerleri bir şablonda görüntüleyeceksiniz.

Angular şablonlarında `{{ expression }}` kullanarak, özelliklerden, `input`'lardan ve geçerli JavaScript ifadelerinden değerleri işleyebilirsiniz.

Daha ayrıntılı bir açıklama için lütfen [İnterpolasyon ile değerleri görüntüleme](guide/templates/binding#metin-interpolasyonu-ile-dinamik-metin-işleme) kılavuzuna bakın.

<docs-workflow>

<docs-step title="İnterpolasyon değerlerini içerecek şekilde `HousingLocation` şablonunu güncelleyin">
Bu adım, `HousingLocation` şablonuna yeni HTML yapısı ve interpolasyon değerleri ekler.

Kod editöründe:

1.  `src/app/housing-location/housing-location.ts` dosyasına gidin
1.  `@Component` dekoratörünün template özelliğinde, mevcut HTML işaretlemesini aşağıdaki kodla değiştirin:

    <docs-code language="angular-ts"  header="Update HousingLocation template in housing-location.ts" path="adev/src/content/tutorials/first-app/steps/08-ngFor/src/app/housing-location/housing-location.ts" visibleLines="[6,17]"/>

Bu güncellenmiş şablon kodunda, `housingLocation.photo` değerini `src` niteliğine bağlamak için özellik bağlama kullandınız. `alt` niteliği, görselin alt metnine daha fazla bağlam vermek için interpolasyon kullanır.

`housingLocation` özelliğinin `name`, `city` ve `state` değerlerini dahil etmek için interpolasyon kullanırsınız.

</docs-step>

<docs-step title="Değişikliklerin tarayıcıda görüntülendiğini doğrulayın">
1.  Tüm değişiklikleri kaydedin.
1.  Tarayıcıyı açın ve uygulamanın fotoğrafı, şehri ve eyalet örnek verisini işlediğini doğrulayın.
    <img alt="browser frame of homes-app displaying logo, filter text input box, search button and the same housing location UI card" src="assets/images/tutorials/first-app/homes-app-lesson-07-step-2.png">
</docs-step>

</docs-workflow>

SUMMARY: Bu derste, yeni bir HTML yapısı eklediniz ve `HousingLocation` şablonunda değerleri işlemek için Angular şablon sözdizimini kullandınız.

Artık iki önemli beceriye sahipsiniz:

- bileşenlere veri aktarma
- bir şablonda değerleri interpolasyon ile görüntüleme

Bu becerilerle, uygulamanız artık veri paylaşabilir ve tarayıcıda dinamik değerler görüntüleyebilir. Şimdiye kadar harika iş çıkardınız.

Bu derste ele alınan konular hakkında daha fazla bilgi için:

<docs-pill-row>
  <docs-pill href="guide/templates" title="Şablon sözdizimi"/>
  <docs-pill href="guide/templates/binding#metin-interpolasyonu-ile-dinamik-metin-işleme" title="İnterpolasyon ile değerleri görüntüleme"/>
</docs-pill-row>
