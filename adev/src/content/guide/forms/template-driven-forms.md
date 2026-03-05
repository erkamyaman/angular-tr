# Building a template-driven form

Bu eğitim, şablon odaklı bir formun nasıl oluşturulacağını gösterir. Formdaki kontrol öğeleri, girdi doğrulamasına sahip veri özelliklerine bağlıdır. Girdi doğrulaması, veri bütünlüğünü korumaya ve kullanıcı deneyimini iyileştirmek için stil oluşturmaya yardımcı olur.

Şablon odaklı formlar, bileşendeki veri modelini şablonda yapılan değişiklikler doğrultusunda güncellemek ve tam tersini yapmak için [çift yönlü veri bağlama](guide/templates/two-way-binding) kullanır.

<docs-callout helpful title="Template vs Reactive forms">
Angular, etkileşimli formlar için iki tasarım yaklaşımını destekler. Şablon odaklı formlar, Angular şablonunuzda forma özgü direktifler kullanmanıza olanak tanır. Reaktif formlar, form oluşturmak için model odaklı bir yaklaşım sağlar.

Şablon odaklı formlar küçük veya basit formlar için harika bir seçimdir, reaktif formlar ise daha ölçeklenebilir ve karmaşık formlar için uygundur. İki yaklaşımın karşılaştırması için [Bir yaklaşım seçme](guide/forms#choosing-an-approach) bölümüne bakın
</docs-callout>

Angular şablonuyla hemen hemen her türlü formu oluşturabilirsiniz -- giriş formları, iletişim formları ve hemen hemen her iş formu.
Kontrolleri yaratıcı bir şekilde yerleştirebilir ve nesne modelinizdeki verilere bağlayabilirsiniz.
Doğrulama kuralları belirleyebilir ve doğrulama hatalarını görüntüleyebilir, belirli kontrollerden girdiyi koşullu olarak izin verebilir, yerleşik görsel geri bildirim tetikleyebilir ve çok daha fazlasını yapabilirsiniz.

## Objectives

Bu eğitim size aşağıdakileri nasıl yapacağınızı öğretir:

- Bir bileşen ve şablonla Angular formu oluşturma
- Girdi kontrol değerlerini okumak ve yazmak için çift yönlü veri bağlamaları oluşturmak üzere `ngModel` kullanma
- Kontrollerin durumunu takip eden özel CSS sınıfları kullanarak görsel geri bildirim sağlama
- Kullanıcılara doğrulama hatalarını gösterme ve form durumuna göre form kontrollerinden girdiyi koşullu olarak izin verme
- [Şablon referans değişkenleri](guide/templates/variables#template-reference-variables) kullanarak HTML öğeleri arasında bilgi paylaşma

## Build a template-driven form

Şablon odaklı formlar, `FormsModule`'da tanımlanan direktiflere dayanır.

| Direktifler    | Ayrıntılar                                                                                                                                                                                                                                                                                      |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NgModel`      | Ekli form öğesindeki değer değişikliklerini veri modelindeki değişikliklerle uzlaştırır, girdi doğrulaması ve hata yönetimi ile kullanıcı girdisine yanıt vermenize olanak tanır.                                                                                                               |
| `NgForm`       | Üst düzey bir `FormGroup` örneği oluşturur ve bunu toplu form değerini ve doğrulama durumunu takip etmek için bir `<form>` öğesine bağlar. `FormsModule`'ü içe aktardığınız anda, bu direktif varsayılan olarak tüm `<form>` etiketlerinde etkinleşir. Özel bir seçici eklemenize gerek yoktur. |
| `NgModelGroup` | Bir `FormGroup` örneği oluşturur ve bir DOM öğesine bağlar.                                                                                                                                                                                                                                     |

### Step overview

Bu eğitim boyunca, aşağıdaki adımları kullanarak örnek bir formu verilere bağlar ve kullanıcı girdisini yönetirsiniz.

1. Temel formu oluşturun.
   - Bir örnek veri modeli tanımlayın
   - `FormsModule` gibi gerekli altyapıyı dahil edin
1. `ngModel` direktifini ve çift yönlü veri bağlama sözdizimini kullanarak form kontrollerini veri özelliklerine bağlayın.
   - `ngModel`'in CSS sınıfları kullanarak kontrol durumlarını nasıl bildirdiğini inceleyin
   - Kontrolleri `ngModel` için erişilebilir kılmak üzere adlandırın
1. `ngModel` kullanarak girdi geçerliliğini ve kontrol durumunu takip edin.
   - Duruma görsel geri bildirim sağlamak için özel CSS ekleyin
   - Doğrulama hata mesajlarını gösterin ve gizleyin
1. Model verilerine ekleyerek yerel bir HTML düğme tıklama olayına yanıt verin.
1. Formun [`ngSubmit`](api/forms/NgForm#properties) çıkış özelliğini kullanarak form gönderimini yönetin.
   - Form geçerli olana kadar **Submit** düğmesini devre dışı bırakın
   - Gönderdikten sonra, tamamlanmış formu sayfadaki farklı içerikle değiştirin

## Build the form

<!-- TODO: link to preview -->
<!-- <docs-code live/> -->

1. Sağlanan örnek uygulama, formda yansıtılan veri modelini tanımlayan `Actor` sınıfını oluşturur.

   <docs-code header="actor.ts" language="typescript" path="adev/src/content/examples/forms/src/app/actor.ts"/>

1. Form düzeni ve ayrıntıları `ActorFormComponent` sınıfında tanımlanır.

   <docs-code header="actor-form.component.ts (v1)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" region="v1"/>

   Bileşenin "app-actor-form" `selector` değeri, bu formu `<app-actor-form>` etiketini kullanarak bir üst şablona yerleştirebileceğiniz anlamına gelir.

1. Aşağıdaki kod, başlangıç formunun örnek bir aktör gösterebilmesi için yeni bir aktör örneği oluşturur.

   <docs-code language="typescript" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" language="typescript" region="Marilyn"/>

   Bu demo, `model` ve `skills` için sahte veriler kullanır.
   Gerçek bir uygulamada, gerçek verileri almak ve kaydetmek için bir veri hizmeti enjekte eder veya bu özellikleri girdiler ve çıktılar olarak sunarsınız.

1. Bileşen, `FormsModule` modülünü içe aktararak Formlar özelliğini etkinleştirir.

   <docs-code language="typescript" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" language="typescript" region="imports"/>

1. Form, kök bileşenin şablonu tarafından tanımlanan uygulama düzeninde görüntülenir.

   <docs-code header="app.component.html" language="html" path="adev/src/content/examples/forms/src/app/app.component.html"/>

   Başlangıç şablonu, iki form grubu ve bir gönder düğmesi olan bir form için düzeni tanımlar.
   Form grupları, Actor veri modelinin iki özelliğine karşılık gelir: name ve studio.
   Her grubun bir etiketi ve kullanıcı girdisi için bir kutusu vardır.
   - **Name** `<input>` kontrol öğesinde HTML5 `required` niteliği bulunur
   - **Studio** `<input>` kontrol öğesinde bulunmaz çünkü `studio` isteğe bağlıdır

   **Submit** düğmesinin üzerinde stil için bazı sınıflar vardır.
   Bu noktada, form düzeni tamamen düz HTML5'tir, bağlama veya direktif yoktur.

1. Örnek form, [Twitter Bootstrap](https://getbootstrap.com/css)'tan bazı stil sınıflarını kullanır: `container`, `form-group`, `form-control` ve `btn`.
   Bu stilleri kullanmak için uygulamanın stil sayfası kütüphaneyi içe aktarır.

   <docs-code header="styles.css" path="adev/src/content/examples/forms/src/styles.1.css"/>

1. Form, bir aktörün becerisinin `ActorFormComponent` içinde dahili olarak tutulan önceden tanımlanmış bir `skills` listesinden seçilmesini gerektirir.
   Angular `@for` döngüsü, `<select>` öğesini doldurmak için veri değerleri üzerinde yineleme yapar.

   <docs-code header="actor-form.component.html (skills)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="skills"/>

Uygulamayı şimdi çalıştırırsanız, seçim kontrolünde beceri listesini görürsünüz.
Girdi öğeleri henüz veri değerlerine veya olaylara bağlı değildir, bu nedenle hala boşturlar ve davranışları yoktur.

## Bind input controls to data properties

Bir sonraki adım, girdi kontrollerini, kullanıcı girdisine yanıt olarak veri modelini güncellemeleri ve ayrıca veri modelindeki programatik değişikliklere yanıt olarak görüntüyü güncellemeleri için çift yönlü veri bağlama ile ilgili `Actor` özelliklerine bağlamaktır.

`FormsModule`'da bildirilen `ngModel` direktifi, şablon odaklı formunuzdaki kontrolleri veri modelinizdeki özelliklere bağlamanıza olanak tanır.
Çift yönlü veri bağlama sözdizimi `[(ngModel)]` ile direktifi dahil ettiğinizde, Angular kontrolün değerini ve kullanıcı etkileşimini takip edebilir ve görünümü modelle senkronize tutabilir.

1. `actor-form.component.html` şablon dosyasını düzenleyin.
1. **Name** etiketinin yanındaki `<input>` etiketini bulun.
1. Çift yönlü veri bağlama sözdizimi `[(ngModel)]="..."` kullanarak `ngModel` direktifini ekleyin.

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="ngModelName-1"/>

HELPFUL: Bu örnekte, çift yönlü veri bağlamanın çalışmasını gözlemlerken ilgili özelliğin geçerli veri değerini göstermek için her girdi etiketinden sonra geçici bir tanılama interpolasyonu `{{model.name}}` bulunur. Yorum, çalıştığını gözlemlemeyi bitirdiğinizde tanılama satırlarını kaldırmanızı hatırlatır.

### Access the overall form status

Bileşeninizde `FormsModule`'ü içe aktardığınızda, Angular otomatik olarak şablondaki `<form>` etiketine bir [NgForm](api/forms/NgForm) direktifi oluşturur ve bağlar (çünkü `NgForm`, `<form>` öğeleriyle eşleşen `form` seçicisine sahiptir).

`NgForm`'a ve genel form durumuna erişmek için bir [şablon referans değişkeni](guide/templates/variables#template-reference-variables) bildirin.

1. `actor-form.component.html` şablon dosyasını düzenleyin.
1. `<form>` etiketini `#actorForm` şablon referans değişkeniyle güncelleyin ve değerini aşağıdaki gibi ayarlayın.

   <docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="template-variable"/>

   `actorForm` şablon değişkeni artık formu bir bütün olarak yöneten `NgForm` direktif örneğine bir referanstır.

1. Uygulamayı çalıştırın.
1. **Name** girdi kutusuna yazmaya başlayın.

   Karakterleri ekleyip sildikçe, veri modelinde görünüp kaybolduklarını görebilirsiniz.

Interpolasyonlu değerleri gösteren tanılama satırı, değerlerin gerçekten girdi kutusundan modele ve geri aktığını gösterir.

### Naming control elements

Bir öğede `[(ngModel)]` kullandığınızda, o öğe için bir `name` niteliği tanımlamanız gerekir.
Angular, öğeyi üst `<form>` öğesine bağlı `NgForm` direktifine kaydetmek için atanan adı kullanır.

Örnekte, `<input>` öğesine bir `name` niteliği eklendi ve aktörün adı için mantıklı olan "name" olarak ayarlandı.
Herhangi bir benzersiz değer işe yarar, ancak açıklayıcı bir ad kullanmak yararlıdır.

1. **Studio** ve **Skill** için benzer `[(ngModel)]` bağlamaları ve `name` nitelikleri ekleyin.
1. Artık interpolasyonlu değerleri gösteren tanılama mesajlarını kaldırabilirsiniz.
1. Çift yönlü veri bağlamanın tüm aktör modeli için çalıştığını doğrulamak için, bileşenin şablonunun üstüne verileri bir dizeye serileştiren [`json`](api/common/JsonPipe) pipe'ı ile yeni bir metin bağlaması ekleyin.

Bu düzeltmelerden sonra form şablonu aşağıdaki gibi görünmelidir:

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="ngModel-2"/>

Şunları fark edeceksiniz:

- Her `<input>` öğesinin bir `id` özelliği vardır.
  Bu, `<label>` öğesinin `for` niteliği tarafından etiketi girdi kontrolüyle eşleştirmek için kullanılır.
  Bu bir [standart HTML özelliğidir](https://developer.mozilla.org/docs/Web/HTML/Element/label).

- Her `<input>` öğesinin ayrıca Angular'ın kontrolü formla kaydetmek için kullandığı gerekli `name` özelliği vardır.

Etkileri gözlemledikten sonra, `{{ model | json }}` metin bağlamasını silebilirsiniz.

## Track form states

Angular, form gönderildikten sonra `form` öğelerine `ng-submitted` sınıfını uygular. Bu sınıf, gönderildikten sonra formun stilini değiştirmek için kullanılabilir.

## Track control states

Bir kontrole `NgModel` direktifi eklemek, durumunu tanımlayan sınıf adlarını kontrole ekler.
Bu sınıflar, kontrolün stilini durumuna göre değiştirmek için kullanılabilir.

Aşağıdaki tablo, Angular'ın kontrolün durumuna göre uyguladığı sınıf adlarını açıklar.

| Durumlar                  | Doğruysa sınıf | Yanlışsa sınıf |
| :------------------------ | :------------- | :------------- |
| Kontrol ziyaret edildi.   | `ng-touched`   | `ng-untouched` |
| Kontrolün değeri değişti. | `ng-dirty`     | `ng-pristine`  |
| Kontrolün değeri geçerli. | `ng-valid`     | `ng-invalid`   |

Angular ayrıca gönderim sırasında `form` öğelerine `ng-submitted` sınıfını uygular,
ancak `form` öğesi içindeki kontrollere uygulamaz.

Bu CSS sınıflarını, kontrolünüzün stili durumuna göre tanımlamak için kullanırsınız.

### Observe control states

Sınıfların çerçeve tarafından nasıl eklenip kaldırıldığını görmek için tarayıcının geliştirici araçlarını açın ve aktör adını temsil eden `<input>` öğesini inceleyin.

1. Tarayıcınızın geliştirici araçlarını kullanarak, **Name** girdi kutusuna karşılık gelen `<input>` öğesini bulun.
   Öğenin "form-control"e ek olarak birden fazla CSS sınıfına sahip olduğunu görebilirsiniz.

1. İlk açtığınızda, sınıflar geçerli bir değere sahip olduğunu, değerin başlatma veya sıfırlamadan beri değişmediğini ve kontrolün başlatma veya sıfırlamadan beri ziyaret edilmediğini gösterir.

   ```html
   <input class="form-control ng-untouched ng-pristine ng-valid" />;
   ```

1. **Name** `<input>` kutusunda aşağıdaki eylemleri yapın ve hangi sınıfların göründüğünü gözlemleyin.
   - Bakın ama dokunmayın.
     Sınıflar, dokunulmamış, saf ve geçerli olduğunu gösterir.

   - Ad kutusunun içine tıklayın, ardından dışına tıklayın.
     Kontrol artık ziyaret edilmiştir ve öğe `ng-untouched` sınıfı yerine `ng-touched` sınıfına sahiptir.

   - Adın sonuna eğik çizgiler ekleyin.
     Artık dokunulmuş ve değiştirilmiştir.

   - Adı silin.
     Bu, değeri geçersiz yapar, bu nedenle `ng-invalid` sınıfı `ng-valid` sınıfının yerini alır.

### Create visual feedback for states

`ng-valid`/`ng-invalid` çifti özellikle ilginçtir, çünkü değerler geçersiz olduğunda güçlü bir görsel sinyal göndermek istersiniz.
Ayrıca zorunlu alanları işaretlemek istersiniz.

Zorunlu alanları ve geçersiz verileri, girdi kutusunun solundaki renkli bir çubukla aynı anda işaretleyebilirsiniz.

Görünümü bu şekilde değiştirmek için aşağıdaki adımları izleyin.

1. `ng-*` CSS sınıfları için tanımlar ekleyin.
1. Bu sınıf tanımlarını yeni bir `forms.css` dosyasına ekleyin.
1. Yeni dosyayı `index.html`'nin yanına projeye ekleyin:

   <docs-code header="forms.css" language="css" path="adev/src/content/examples/forms/src/assets/forms.css"/>

1. `index.html` dosyasında, `<head>` etiketini yeni stil sayfasını içerecek şekilde güncelleyin.

   <docs-code header="index.html (styles)" path="adev/src/content/examples/forms/src/index.html" region="styles"/>

### Show and hide validation error messages

**Name** girdi kutusu zorunludur ve temizlemek çubuğu kırmızıya çevirir.
Bu, bir şeyin yanlış olduğunu gösterir, ancak kullanıcı neyin yanlış olduğunu veya bu konuda ne yapacağını bilmez.
Kontrolün durumunu kontrol ederek ve yanıt vererek yararlı bir mesaj sağlayabilirsiniz.

**Skill** seçim kutusu da zorunludur, ancak seçim kutusu zaten seçimi geçerli değerlerle sınırladığı için bu tür bir hata yönetimine ihtiyaç duymaz.

Uygun olduğunda bir hata mesajı tanımlamak ve göstermek için aşağıdaki adımları izleyin.

<docs-workflow>
<docs-step title="Add a local reference to the input">
`input` etiketini, şablon içinden girdi kutusunun Angular kontrolüne erişmek için kullanabileceğiniz bir şablon referans değişkeni ile genişletin. Örnekte değişken `#name="ngModel"`'dır.

Şablon referans değişkeni (`#name`), `"ngModel"` olarak ayarlanmıştır çünkü bu, [`NgModel.exportAs`](api/core/Directive#exportAs) özelliğinin değeridir. Bu özellik, Angular'a bir referans değişkenini bir direktife nasıl bağlayacağını söyler.
</docs-step>

<docs-step title="Add the error message">
Uygun bir hata mesajı içeren bir `<div>` ekleyin.
</docs-step>

<docs-step title="Make the error message conditional">
`name` kontrolünün özelliklerini mesaj `<div>` öğesinin `hidden` özelliğine bağlayarak hata mesajını gösterin veya gizleyin.
</docs-step>

<docs-code header="actor-form.component.html (hidden-error-msg)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="hidden-error-msg"/>

<docs-step title="Add a conditional error message to name">
Aşağıdaki örnekte olduğu gibi, `name` girdi kutusuna koşullu bir hata mesajı ekleyin.

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="name-with-error-msg"/>
</docs-step>
</docs-workflow>

<docs-callout title='Illustrating the "pristine" state'>

Bu örnekte, kontrol ya geçerli ya da _saf_ olduğunda mesajı gizlersiniz.
Saf, kullanıcının bu formda görüntülenen değeri değiştirmediği anlamına gelir.
`pristine` durumunu göz ardı ederseniz, mesajı yalnızca değer geçerli olduğunda gizlersiniz.
Bu bileşene yeni, boş bir aktörle veya geçersiz bir aktörle gelirseniz, herhangi bir şey yapmadan önce hata mesajını hemen görürsünüz.

Mesajın yalnızca kullanıcı geçersiz bir değişiklik yaptığında görüntülenmesini isteyebilirsiniz.
Kontrol `pristine` durumundayken mesajı gizlemek bu hedefe ulaşır.
Bir sonraki adımda forma yeni bir aktör eklediğinizde bu seçimin önemini göreceksiniz.

</docs-callout>

## Add a new actor

Bu alıştırma, model verilerine ekleme yaparak yerel bir HTML düğme tıklama olayına nasıl yanıt vereceğinizi gösterir.
Form kullanıcılarının yeni bir aktör eklemesine izin vermek için, bir tıklama olayına yanıt veren bir **New Actor** düğmesi ekleyeceksiniz.

1. Şablonda, formun altına bir "New Actor" `<button>` öğesi yerleştirin.
1. Bileşen dosyasında, aktör veri modeline aktör oluşturma yöntemini ekleyin.

   <docs-code header="actor-form.component.ts (New Actor method)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" region="new-actor"/>

1. Düğmenin tıklama olayını bir aktör oluşturma yöntemi olan `newActor()`'a bağlayın.

   <docs-code header="actor-form.component.html (New Actor button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="new-actor-button-no-reset"/>

1. Uygulamayı tekrar çalıştırın ve **New Actor** düğmesine tıklayın.

   Form temizlenir ve girdi kutusunun solundaki _zorunlu_ çubuklar kırmızıdır, geçersiz `name` ve `skill` özelliklerini gösterir.
   Hata mesajlarının gizlendiğine dikkat edin.
   Bunun nedeni formun saf olmasıdır; henüz hiçbir şey değiştirmediniz.

1. Bir ad girin ve tekrar **New Actor**'a tıklayın.

   Şimdi uygulama bir `Name is required` hata mesajı görüntüler, çünkü girdi kutusu artık saf değildir.
   Form, **New Actor**'a tıklamadan önce bir ad girdiğinizi hatırlar.

1. Form kontrollerinin saf durumunu geri yüklemek için, `newActor()` yöntemini çağırdıktan sonra formun `reset()` yöntemini çağırarak tüm bayrakları zorunlu olarak temizleyin.

   <docs-code header="actor-form.component.html (Reset the form)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="new-actor-button-form-reset"/>

   Artık **New Actor**'a tıklamak hem formu hem de kontrol bayraklarını sıfırlar.

## Submit the form with `ngSubmit`

Kullanıcı formu doldurduktan sonra gönderebilmelidir.
Formun altındaki **Submit** düğmesi kendi başına hiçbir şey yapmaz, ancak türü (`type="submit"`) nedeniyle bir form gönderme olayı tetikler.

Bu olaya yanıt vermek için aşağıdaki adımları izleyin.

<docs-workflow>

<docs-step title="Listen to ngOnSubmit">
Formun [`ngSubmit`](api/forms/NgForm#properties) olay özelliğini aktör form bileşeninin `onSubmit()` yöntemine bağlayın.

<docs-code header="actor-form.component.html (ngSubmit)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="ngSubmit"/>
</docs-step>

<docs-step title="Bind the disabled property">
**Submit** düğmesini içeren forma erişmek için `#actorForm` şablon referans değişkenini kullanın ve bir olay bağlaması oluşturun.

Formun genel geçerliliğini gösteren özelliğini **Submit** düğmesinin `disabled` özelliğine bağlayacaksınız.

<docs-code header="actor-form.component.html (submit-button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="submit-button"/>
</docs-step>

<docs-step title="Run the application">
Düğmenin etkin olduğuna dikkat edin -- henüz yararlı bir şey yapmamasına rağmen.
</docs-step>

<docs-step title="Delete the Name value">
Bu, "required" kuralını ihlal eder, bu nedenle hata mesajını görüntüler -- ve dikkat edin, **Submit** düğmesini de devre dışı bırakır.

Düğmenin etkin durumunu formun geçerliliğine açıkça bağlamanız gerekmedi.
`FormsModule`, geliştirilmiş form öğesinde bir şablon referans değişkeni tanımladığınızda ve ardından düğme kontrolünde bu değişkene atıfta bulunduğunuzda bunu otomatik olarak yaptı.
</docs-step>
</docs-workflow>

### Respond to form submission

Form gönderime bir yanıt göstermek için, veri giriş alanını gizleyebilir ve yerine başka bir şey görüntüleyebilirsiniz.

<docs-workflow>
<docs-step title="Wrap the form">
Tüm formu bir `<div>` içine sarın ve `hidden` özelliğini `ActorFormComponent.submitted` özelliğine bağlayın.

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="edit-div"/>

`ActorFormComponent`'ten bu kod parçacığının gösterdiği gibi, `submitted` özelliği formu göndermeden önce false olduğundan, ana form başlangıçtan itibaren görünürdür:

<docs-code header="actor-form.component.ts (submitted)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" region="submitted"/>

**Submit** düğmesine tıkladığınızda, `submitted` bayrağı true olur ve form kaybolur.
</docs-step>

<docs-step title="Add the submitted state">
Form gönderilmiş durumdayken başka bir şey göstermek için, yeni `<div>` sarmalayıcısının altına aşağıdaki HTML'yi ekleyin.

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="submitted"/>

Bu `<div>`, interpolasyon bağlamalarıyla salt okunur bir aktör gösterir ve yalnızca bileşen gönderilmiş durumdayken görünür.

Alternatif görüntü, tıklama olayı `submitted` bayrağını temizleyen bir ifadeye bağlı olan bir _Edit_ düğmesi içerir.
</docs-step>

<docs-step title="Test the Edit button">
Görüntüyü düzenlenebilir forma geri döndürmek için *Edit* düğmesine tıklayın.
</docs-step>
</docs-workflow>

## Summary

Bu sayfada tartışılan Angular formu, veri değiştirme, doğrulama ve daha fazlası için destek sağlamak üzere aşağıdaki çerçeve özelliklerinden yararlanır.

- Bir Angular HTML form şablonu
- `@Component` dekoratörüne sahip bir form bileşeni sınıfı
- `NgForm.ngSubmit` olay özelliğine bağlanarak form gönderimini yönetme
- `#actorForm` ve `#name` gibi şablon referans değişkenleri
- Çift yönlü veri bağlama için `[(ngModel)]` sözdizimi
- Doğrulama ve form öğesi değişiklik takibi için `name` niteliklerinin kullanımı
- Referans değişkeninin girdi kontrollerindeki `valid` özelliği, bir kontrolün geçerli olup olmadığını veya hata mesajlarını gösterip göstermeyeceğini belirtir
- `NgForm` geçerliliğine bağlanarak **Submit** düğmesinin etkin durumunu kontrol etme
- Geçerli olmayan kontroller hakkında kullanıcılara görsel geri bildirim sağlayan özel CSS sınıfları

Uygulamanın son sürümü için kod:

<docs-code-multifile>
    <docs-code header="actor-form.component.ts" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" region="final"/>
    <docs-code header="actor-form.component.html" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" region="final"/>
    <docs-code header="actor.ts" path="adev/src/content/examples/forms/src/app/actor.ts"/>
    <docs-code header="app.component.html" path="adev/src/content/examples/forms/src/app/app.component.html"/>
    <docs-code header="app.component.ts" path="adev/src/content/examples/forms/src/app/app.component.ts"/>
    <docs-code header="main.ts" path="adev/src/content/examples/forms/src/main.ts"/>
    <docs-code header="forms.css" path="adev/src/content/examples/forms/src/assets/forms.css"/>
</docs-code-multifile>
