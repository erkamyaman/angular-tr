# Bileşen şablonuna property binding ekleyin

Bu eğitim dersi, bir şablona özellik bağlama eklemeyi ve bileşenlere dinamik veri aktarmak için nasıl kullanılacağını gösterir.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=AsiczpWnMz5HhJqB&amp;start=599"/>

## Neler öğreneceksiniz

- Uygulamanızın `Home` şablonunda veri bağlamaları vardır.
- Uygulamanız `Home`'dan `HousingLocation`'a veri gönderir.

## Input'ların kavramsal önizlemesi

Bu derste, şablondaki özelliklere özellik bağlama kullanarak veri bağlayarak, üst bileşenden alt bileşene veri paylaşma sürecine devam edeceksiniz.

Özellik bağlama, bir değişkeni Angular şablonundaki bir `Input`'a bağlamanızı sağlar. Veriler daha sonra `Input`'a dinamik olarak bağlanır.

Daha ayrıntılı bir açıklama için lütfen [Özellik bağlama](/guide/templates/binding#css-sınıfı-ve-stil-özelliği-bağlamaları) kılavuzuna bakın.

<docs-workflow>

<docs-step title="`Home` şablonunu güncelleyin">
Bu adım, `<app-housing-location>` etiketine özellik bağlama ekler.

Kod editöründe:

1.  `src/app/home/home.ts` dosyasına gidin
1.  `@Component` dekoratörünün template özelliğinde, kodu aşağıdaki kodla eşleşecek şekilde güncelleyin:
    <docs-code language="angular-ts" header="Add housingLocation property binding" path="adev/src/content/tutorials/first-app/steps/07-dynamic-template-values/src/app/home/home.ts" visibleLines="[15,17]"/>

    Bir bileşen etiketine özellik bağlama eklerken, atanan değerin bir dize değeri değil, bileşen sınıfından bir özellik olarak ele alınması gerektiğini Angular'a bildirmek için `[attribute] = "value"` sözdizimini kullanırız.

    Sağ taraftaki değer, `Home` bileşeninden gelen özelliğin adıdır.

</docs-step>

<docs-step title="Kodun hâlâ çalıştığını doğrulayın">
1.  Değişikliklerinizi kaydedin ve uygulamanın herhangi bir hatası olmadığını doğrulayın.
1.  Bir sonraki adıma geçmeden önce tüm hataları düzeltin.
</docs-step>

</docs-workflow>

SUMMARY: Bu derste, yeni bir özellik bağlama eklediniz ve bir sınıf özelliğine referans aktardınız. Artık `HousingLocation` bileşeni, bileşenin görüntüsünü özelleştirmek için kullanabileceği verilere erişebilir.

Bu derste ele alınan konular hakkında daha fazla bilgi için:

<docs-pill-row>
  <docs-pill href="/guide/templates/binding#css-sınıfı-ve-stil-özelliği-bağlamaları" title="Property binding"/>
</docs-pill-row>
