# Bileşene bir input parametresi ekleyin

Bu eğitim dersi, bir bileşen `input`'u oluşturmayı ve bileşeni özelleştirmek için ona veri aktarmayı gösterir.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=WvRGFSkW_7_zDIFD&amp;start=241"/>

NOTE: Bu video eski bir sözdizimini yansıtmaktadır, ancak temel kavramlar geçerliliğini korumaktadır.

## Neler öğreneceksiniz

Uygulamanızın `HousingLocation` şablonunda girdi almak için bir `HousingLocation` özelliği bulunmaktadır.

## Input'ların kavramsal önizlemesi

[Input'lar](api/core/input) bileşenlerin, bir üst bileşenden kendisine aktarılabilecek verileri belirtmesine olanak tanır.

Bu derste, `HousingLocation` bileşeninde, bileşende görüntülenen verileri özelleştirmenizi sağlayan bir `input` özelliği tanımlayacaksınız.

Daha fazla bilgi için [Input özellikleriyle veri alma](guide/components/inputs) ve [Output'larla özel olaylar](guide/components/outputs) kılavuzlarına bakın.

<docs-workflow>

<docs-step title="input() fonksiyonunu içe aktarın">
Kod editöründe, `@angular/core` paketinden `input` yardımcı metodunu `HousingLocation` bileşenine içe aktarın.

<docs-code header="Import input in housing-location.ts" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.ts" visibleLines="[1]"/>

</docs-step>

<docs-step title="Input özelliğini ekleyin">
`housingLocation` adında zorunlu bir özellik ekleyin ve bunu `HousingLocationInfo` türüyle `input.required()` kullanarak başlatın.

  <docs-code header="Declare the input property in housing-location.ts" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.ts" visibleLines="[12]"/>

Üst bileşenin bir değer sağlaması gerektiğini belirtmek için `input` üzerinde `required` metodunu çağırmalısınız. Örnek uygulamamızda, bu değerin her zaman aktarılacağını biliyoruz -- bu tasarım gereğidir. `.required()` çağrısı, TypeScript derleyicisinin bunu zorunlu kılmasını ve bu bileşen bir şablonda kullanıldığında özelliği null olmayan olarak ele almasını sağlar.

</docs-step>

<docs-step title="Input'a veri aktarın">
`housingLocation` değerini `Home` bileşeninden HousingLocation bileşeninin `housingLocation` özelliğine gönderin.

<docs-code language="angular-ts" header="Declare the input property for HousingLocation in home.ts" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/home/home.ts" visibleLines="[16]"/>

</docs-step>

</docs-workflow>

SUMMARY: Bu derste, yeni bir `input` özelliği oluşturdunuz. Ayrıca sinyal değerinin her zaman tanımlı olmasını sağlamak için `.required` metodunu kullandınız.

<docs-pill-row>
  <docs-pill href="guide/components/inputs" title="Input özellikleriyle veri kabul etme"/>
  <docs-pill href="guide/components/outputs" title="Output'larla özel olaylar"/>
</docs-pill-row>
