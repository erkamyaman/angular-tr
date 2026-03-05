# Use @for to list objects in component

Bu eğitim dersi, bir şablonda dinamik olarak tekrarlanan verileri görüntülemek için Angular şablonlarında `@for` bloğunun nasıl kullanılacağını gösterir.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=MIl5NcRxvcLjYt5f&amp;start=477"/>

NOTE: Bu video eski bir sözdizimini yansıtmaktadır, ancak temel kavramlar geçerliliğini korumaktadır.

## What you'll learn

- Uygulamaya bir veri seti eklemiş olacaksınız
- Uygulamanız, `@for` kullanarak yeni veri setindeki öğelerin bir listesini görüntüleyecek

## Conceptual preview of `@for`

Angular'da `@for`, bir şablonda verileri dinamik olarak tekrarlamak için kullanılan belirli bir [kontrol akışı bloğu](/guide/templates/control-flow) türüdür. Düz JavaScript'te bir for döngüsü kullanırsınız - `@for` Angular şablonları için benzer işlevsellik sağlar.

`@for` kullanarak diziler ve hatta asenkron değerler üzerinde yineleme yapabilirsiniz. Bu derste, üzerinde yineleme yapılacak yeni bir veri dizisi ekleyeceksiniz.

Daha ayrıntılı bir açıklama için lütfen [kontrol akışı](guide/templates/control-flow#repeat-content-with-the-for-block) kılavuzuna bakın.

<docs-workflow>

<docs-step title="Add housing data to the `Home`">

`Home` bileşeninde yalnızca tek bir konut konumu var. Bu adımda, bir `HousingLocation` girişleri dizisi ekleyeceksiniz.

1. `src/app/home/home.ts` dosyasında, `Home` sınıfından `housingLocation` özelliğini kaldırın.
1. `Home` sınıfını `housingLocationList` adında bir özelliğe sahip olacak şekilde güncelleyin. Kodunuzu aşağıdaki kodla eşleşecek şekilde güncelleyin:
   <docs-code language="angular-ts"  header="Add housingLocationList property in home.ts" path="adev/src/content/tutorials/first-app/steps/09-services/src/app/home/home.ts" visibleLines="26-131"/>

   IMPORTANT: `@Component` dekoratörünü kaldırmayın, bu kodu yaklaşan bir adımda güncelleyeceksiniz.

</docs-step>

<docs-step title="Update the `Home` template to use `@for`">
Artık uygulamanın tarayıcıdaki girişleri `@for` bloğunu kullanarak görüntülemek için kullanabileceği bir veri seti var.

1. Şablon kodundaki `<app-housing-location>` etiketini şu şekilde güncelleyin:
   <docs-code language="angular-ts"  header="Add @for to Home template in home.ts" path="adev/src/content/tutorials/first-app/steps/09-services/src/app/home/home.ts" visibleLines="[15,19]"/>

   Kodda `[housingLocation] = "housingLocation"` ifadesindeki `housingLocation` değerinin artık `@for` bloğunda kullanılan değişkene referans verdiğini unutmayın. Bu değişiklikten önce, `Home` sınıfındaki özelliğe referans veriyordu.

1. Tüm değişiklikleri kaydedin.

1. Tarayıcıyı yenileyin ve uygulamanın artık bir konut konumları ızgarası işlediğini doğrulayın.

<section class="lightbox">
<img alt="browser frame of homes-app displaying logo, filter text input box, search button and a grid of housing location cards" src="assets/images/tutorials/first-app/homes-app-lesson-08-step-2.png">
</section>

</docs-step>

</docs-workflow>

SUMMARY: Bu derste, Angular şablonlarında verileri dinamik olarak tekrarlamak için `@for` bloğunu kullandınız. Ayrıca Angular uygulamasında kullanılmak üzere yeni bir veri dizisi eklediniz. Uygulama artık tarayıcıda konut konumlarının bir listesini dinamik olarak işliyor.

Uygulama şekilleniyor, harika iş.

Bu derste ele alınan konular hakkında daha fazla bilgi için:

<docs-pill-row>
  <docs-pill href="guide/templates/control-flow" title="Control flow blocks"/>
  <docs-pill href="guide/templates/control-flow#repeat-content-with-the-for-block" title="@for guide"/>
  <docs-pill href="/api/core/@for" title="@for"/>
</docs-pill-row>
