# Uygulamanıza arama özelliği ekleyin

Bu eğitim dersi, Angular uygulamanıza arama işlevselliğinin nasıl ekleneceğini gösterir.

Uygulama, kullanıcıların uygulamanız tarafından sağlanan veriler arasında arama yapmasını ve yalnızca girilen terimle eşleşen sonuçları görüntülemesini sağlayacaktır.

<docs-video src="https://www.youtube.com/embed/5K10oYJ5Y-E?si=TiuNKx_teR9baO7k&amp;start=457"/>

IMPORTANT: Eğitimin bu adımı için yerel ortamınızı kullanmanızı öneriyoruz.

## Neler öğreneceksiniz

- Uygulamanız, eşleşen konut konumlarını aramak için bir formdaki verileri kullanacak
- Uygulamanız yalnızca eşleşen konut konumlarını görüntüleyecek

<docs-workflow>

<docs-step title="Home bileşeninin özelliklerini güncelleyin">
Bu adımda, filtreleme için kullanacağınız yeni bir dizi özelliğinde veri depolamak üzere `Home` sınıfını güncelleyeceksiniz.

1. `src/app/home/home.ts` dosyasında, sınıfa `filteredLocationList` adında yeni bir özellik ekleyin.

   <docs-code header="Add the filteredLocationList property in home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[27]"/>

   `filteredLocationList`, kullanıcı tarafından girilen arama kriterlerine uyan değerleri tutar.

1. `filteredLocationList`, sayfa yüklendiğinde varsayılan olarak tüm konut konumu değerlerini içermelidir. `Home` bileşeninin `constructor`'ını değeri ayarlamak için güncelleyin.

   <docs-code header="Set the value of filteredLocationList" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[29,32]"/>

</docs-step>

<docs-step title="Home bileşeninin şablonunu güncelleyin">
`Home` bileşeninde, kullanıcıdan girdi almak için kullanacağınız bir girdi alanı zaten var. Bu dize metin, sonuçları filtrelemek için kullanılacaktır.

1. `Home` şablonunu, `input` öğesinde `#filter` adında bir şablon değişkeni içerecek şekilde güncelleyin.

   <docs-code language="angular-ts" header="Add a template variable to the input HTML element in home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[12]"/>
   Bu örnek, `input` öğesine değeri olarak erişmek için bir [şablon referans değişkeni](guide/templates) kullanır.

1. Ardından, "Search" düğmesine bir olay işleyici eklemek için bileşen şablonunu güncelleyin.

   <docs-code language="angular-ts" header="Bind the button click event to a method in home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[13]"/>

   `button` öğesindeki `click` olayına bağlanarak, `filterResults` fonksiyonunu çağırabilirsiniz. Fonksiyonun argümanı, `filter` şablon değişkeninin `value` özelliğidir. Özellikle, `input` HTML öğesinden gelen `.value` özelliğidir.

1. Son şablon güncellemesi `@for` yönergesi içindir. `@for` yönergesini `filteredLocationList` dizisindeki değerler üzerinde yineleme yapacak şekilde güncelleyin.

   <docs-code header="Update the @for template directive in home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[17,19]" language="html"/>

</docs-step>

<docs-step title="Olay işleyici fonksiyonunu uygulayın">
Şablon, `filterResults` fonksiyonunu `click` olayına bağlamak için güncellendi. Sıradaki göreviniz, `Home` sınıfında `filterResults` fonksiyonunu uygulamaktır.

1.  `Home` sınıfını `filterResults` fonksiyonunun uygulamasını içerecek şekilde güncelleyin.

    <docs-code header="Add the filterResults function implementation" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[34,43]"/>

    Bu fonksiyon, `text` parametresinin değerini `housingLocation.city` özelliğiyle karşılaştırmak için `String` `filter` fonksiyonunu kullanır. Eğlenceli bir alıştırma olarak bu fonksiyonu herhangi bir özellik veya birden fazla özellikle eşleşecek şekilde güncelleyebilirsiniz.

1.  Kodunuzu kaydedin.

1.  Tarayıcıyı yenileyin ve metin girdikten sonra "Search" düğmesine tıkladığınızda konut konumu verilerini şehre göre arayabildiğinizi doğrulayın.

       <img alt="filtered search results based on user input" src="assets/images/tutorials/first-app/homes-app-lesson-13-step-3.png">

    </docs-step>

</docs-workflow>

SUMMARY: Bu derste, şablon değerleriyle etkileşim kurmak için şablon değişkenleri kullanmak üzere uygulamanızı güncellediniz ve olay bağlama ile dizi fonksiyonları kullanarak arama işlevselliği eklediniz.

Bu derste ele alınan konular hakkında daha fazla bilgi için:

<docs-pill-row>
  <docs-pill href="guide/templates" title="Template Variables"/>
  <docs-pill href="guide/templates/event-listeners" title="Event Handling"/>
</docs-pill-row>
