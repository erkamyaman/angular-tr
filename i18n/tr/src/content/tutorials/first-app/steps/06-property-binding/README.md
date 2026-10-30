<!-- source: 17d28361f0beb51f0ec5193381986d7c949ecb06 -->
# Bileşen şablonuna property binding ekleyin

Bu eğitim dersi, bir şablona özellik bağlama eklemeyi ve bileşenlere dinamik veri aktarmak için nasıl kullanılacağını gösterir.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=AsiczpWnMz5HhJqB&amp;start=599"/>

## Neler öğreneceksiniz {#what-youll-learn}

- Uygulamanızın `Home` şablonunda veri bağlamaları vardır.
- Uygulamanız `Home`'dan `HousingLocation`'a veri gönderir.

## Input'ların kavramsal önizlemesi {#conceptual-preview-of-inputs}

Bu derste, şablondaki özelliklere özellik bağlama kullanarak veri bağlayarak, üst bileşenden alt bileşene veri paylaşma sürecine devam edeceksiniz.

Özellik bağlama, bir değişkeni Angular şablonundaki bir `Input`'a bağlamanızı sağlar. Veriler daha sonra `Input`'a dinamik olarak bağlanır.

Daha ayrıntılı bir açıklama için lütfen [Özellik bağlama](/guide/templates/binding#binding-dynamic-properties-and-attributes) kılavuzuna bakın.

<docs-workflow>

<docs-step title="`Home` şablonunu güncelleyin {#update-the-home-template}">
Bu adım, `<app-housing-location>` etiketine özellik bağlama ekler.

Kod editöründe:

1.  `src/app/home/home.ts` dosyasına gidin
1.  `@Component` dekoratörünün template özelliğinde, kodu aşağıdaki kodla eşleşecek şekilde güncelleyin:
    <docs-code language="angular-ts" header="housingLocation özellik bağlamasını ekleyin" path="adev/src/content/tutorials/first-app/steps/07-dynamic-template-values/src/app/home/home.ts" visibleLines="[15,17]"/>

    Bir bileşen etiketine özellik bağlama eklerken, atanan değerin bir dize değeri değil, bileşen sınıfından bir özellik olarak ele alınması gerektiğini Angular'a bildirmek için `[attribute] = "value"` sözdizimini kullanırız.

    Sağ taraftaki değer, `Home` bileşeninden gelen özelliğin adıdır.

</docs-step>

<docs-step title="Kodun hâlâ çalıştığını doğrulayın {#confirm-the-code-still-works}">
1.  Değişikliklerinizi kaydedin ve uygulamanın herhangi bir hatası olmadığını doğrulayın.
1.  Bir sonraki adıma geçmeden önce tüm hataları düzeltin.
</docs-step>

</docs-workflow>

SUMMARY: Bu derste, yeni bir özellik bağlama eklediniz ve bir sınıf özelliğine referans aktardınız. Artık `HousingLocation` bileşeni, bileşenin görüntüsünü özelleştirmek için kullanabileceği verilere erişebilir.

Bu derste ele alınan konular hakkında daha fazla bilgi için:

<docs-pill-row>
  <docs-pill href="/guide/templates/binding#binding-dynamic-properties-and-attributes" title="Dinamik metin, özellik ve nitelikleri bağlama"/>
</docs-pill-row>
