# Dinamik form'lar oluşturma

Anketler gibi birçok form, biçim ve amaç açısından birbirine çok benzer olabilir.
Bu tür formların farklı sürümlerini daha hızlı ve kolay oluşturmak için, iş nesnesi modelini tanımlayan meta verilere dayalı bir _dinamik form şablonu_ oluşturabilirsiniz.
Ardından, veri modelindeki değişikliklere göre yeni formları otomatik olarak oluşturmak için şablonu kullanın.

Bu teknik, içeriğinin hızla değişen iş ve düzenleyici gereksinimleri karşılamak için sık sık değişmesi gereken bir form türüne sahip olduğunuzda özellikle kullanışlıdır.
Tipik bir kullanım durumu ankettir.
Farklı bağlamlarda kullanıcılardan girdi almanız gerekebilir.
Kullanıcının gördüğü formların biçimi ve stili sabit kalmalı, ancak sormanız gereken asıl sorular bağlama göre değişir.

Bu eğitimde, temel bir anket sunan dinamik bir form oluşturacaksınız.
İş arayan kahramanlar için çevrimiçi bir uygulama oluşturursunuz.
Ajans sürekli olarak başvuru sürecini değiştirmektedir, ancak dinamik formu kullanarak uygulama kodunu değiştirmeden anında yeni formlar oluşturabilirsiniz.

Eğitim sizi aşağıdaki adımlardan geçirir.

1. Bir proje için reaktif formları etkinleştirin.
1. Form kontrollerini temsil edecek bir veri modeli oluşturun.
1. Modeli örnek verilerle doldurun.
1. Dinamik olarak form kontrolleri oluşturacak bir bileşen geliştirin.

Oluşturduğunuz form, kullanıcı deneyimini iyileştirmek için girdi doğrulaması ve stil kullanır.
Yalnızca tüm kullanıcı girdisi geçerli olduğunda etkinleştirilen bir Gönder düğmesine sahiptir ve geçersiz girdiyi renk kodlaması ve hata mesajlarıyla işaretler.

Temel sürüm, daha zengin bir soru çeşitliliğini, daha zarif oluşturmayı ve üstün kullanıcı deneyimini desteklemek için geliştirilebilir.

## Projeniz için reactive form'ları etkinleştirme

Dinamik formlar reaktif formlara dayanır.

Uygulamaya reaktif form direktiflerine erişim vermek için, `@angular/forms` kütüphanesinden `ReactiveFormsModule`'ü gerekli bileşenlere içe aktarın.

<docs-code-multifile>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
    <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

## Form nesne modeli oluşturma

Dinamik bir form, form işlevselliğinin gerektirdiği tüm senaryoları tanımlayabilen bir nesne modeli gerektirir.
Örnek kahraman uygulama formu bir dizi sorudur -- yani formdaki her kontrol bir soru sormalı ve bir cevap kabul etmelidir.

Bu tür form için veri modeli bir soruyu temsil etmelidir.
Örnek, modeldeki temel nesne olarak soruyu tanımlayan `DynamicFormQuestionComponent`'i içerir.

Aşağıdaki `QuestionBase`, formda soruyu ve cevabını temsil edebilecek bir kontrol kümesi için temel sınıftır.

<docs-code header="question-base.ts" path="adev/src/content/examples/dynamic-form/src/app/question-base.ts"/>

### Kontrol sınıflarını tanımlama

Bu temelden, örnek farklı kontrol türlerini temsil eden `TextboxQuestion` ve `DropdownQuestion` olmak üzere iki yeni sınıf türetir.
Bir sonraki adımda form şablonunu oluşturduğunuzda, uygun kontrolleri dinamik olarak oluşturmak için bu belirli soru türlerini örneklersiniz.

`TextboxQuestion` kontrol türü, formda bir `<input>` öğesi ile temsil edilir. Bir soru sunar ve kullanıcıların girdi yapmasına olanak tanır. Öğenin `type` niteliği, `options` argümanında belirtilen `type` alanına göre tanımlanır (örneğin `text`, `email`, `url`).

<docs-code header="question-textbox.ts" path="adev/src/content/examples/dynamic-form/src/app/question-textbox.ts"/>

`DropdownQuestion` kontrol türü, bir seçim kutusunda seçeneklerin bir listesini sunar.

 <docs-code header="question-dropdown.ts" path="adev/src/content/examples/dynamic-form/src/app/question-dropdown.ts"/>

### Form gruplarını oluşturma

Dinamik bir form, form modeline dayalı olarak gruplandırılmış girdi kontrol kümeleri oluşturmak için bir hizmet kullanır.
Aşağıdaki `QuestionControlService`, soru modelinden meta verileri kullanan bir dizi `FormGroup` örneği toplar.
Varsayılan değerler ve doğrulama kuralları belirleyebilirsiniz.

<docs-code header="question-control.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question-control.service.ts"/>

## Dinamik form içeriklerini oluşturma

Dinamik formun kendisi, sonraki bir adımda eklediğiniz bir kapsayıcı bileşenle temsil edilir.
Her soru, `DynamicFormQuestionComponent`'in bir örneğiyle eşleşen bir `<app-question>` etiketi ile form bileşeninin şablonunda temsil edilir.

`DynamicFormQuestionComponent`, veri bağlı soru nesnesindeki değerlere dayalı olarak bireysel bir sorunun ayrıntılarını oluşturmaktan sorumludur.
Form, şablon HTML'sini altta yatan kontrol nesnelerine bağlamak için [`[formGroup]` direktifine](api/forms/FormGroupDirective 'API reference') dayanır.
`DynamicFormQuestionComponent`, soru modelinde tanımlanan kontrollerle doldurarak form grupları oluşturur, görüntüleme ve doğrulama kurallarını belirtir.

<docs-code-multifile>
  <docs-code header="dynamic-form-question.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.html"/>
  <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

`DynamicFormQuestionComponent`'in amacı, modelinizde tanımlanan soru türlerini sunmaktır.
Bu noktada yalnızca iki soru türünüz var ancak çok daha fazlasını hayal edebilirsiniz.
Şablondaki `@switch` bloğu hangi soru türünün görüntüleneceğini belirler.
Switch, [`formControlName`](api/forms/FormControlName 'FormControlName directive API reference') ve [`formGroup`](api/forms/FormGroupDirective 'FormGroupDirective API reference') seçicilerine sahip direktifleri kullanır.
Her iki direktif de `ReactiveFormsModule`'da tanımlanmıştır.

### Veri sağlama

Bireysel bir form oluşturmak için belirli bir soru kümesi sağlamak üzere başka bir hizmete ihtiyaç vardır.
Bu alıştırma için, sabit kodlanmış örnek verilerden bu soru dizisini sağlamak üzere `QuestionService`'i oluşturursunuz.
Gerçek dünya uygulamasında, hizmet verileri bir arka uç sisteminden alabilir.
Ancak kilit nokta, kahraman iş başvurusu sorularını tamamen `QuestionService`'ten döndürülen nesneler aracılığıyla kontrol etmenizdir.
Gereksinimler değiştikçe anketi sürdürmek için, yalnızca `questions` dizisinden nesne eklemeniz, güncellemeniz ve kaldırmanız yeterlidir.

`QuestionService`, `input()` sorularına bağlı bir dizi biçiminde bir soru kümesi sağlar.

<docs-code header="question.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question.service.ts"/>

## Dinamik form şablonu oluşturma

`DynamicFormComponent` bileşeni, formun giriş noktası ve ana kapsayıcısıdır ve şablonda `<app-dynamic-form>` kullanılarak temsil edilir.

`DynamicFormComponent` bileşeni, her birini `DynamicFormQuestionComponent` ile eşleşen bir `<app-question>` öğesine bağlayarak soruların bir listesini sunar.

<docs-code-multifile>
    <docs-code header="dynamic-form.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.html"/>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
</docs-code-multifile>

### Formu görüntüleme

Dinamik formun bir örneğini görüntülemek için, `AppComponent` kabuk şablonu `QuestionService` tarafından döndürülen `questions` dizisini form kapsayıcı bileşeni olan `<app-dynamic-form>`'a iletir.

<docs-code header="app.component.ts" path="adev/src/content/examples/dynamic-form/src/app/app.component.ts"/>

Model ve verinin bu şekilde ayrılması, _soru_ nesne modeliyle uyumlu olduğu sürece, bileşenleri herhangi bir anket türü için yeniden kullanmanıza olanak tanır.

### Geçerli verileri sağlama

Form şablonu, belirli sorular hakkında sabit kodlanmış varsayımlar yapmadan formu oluşturmak için meta verilerin dinamik veri bağlamasını kullanır.
Hem kontrol meta verilerini hem de doğrulama kriterlerini dinamik olarak ekler.

Geçerli girdi sağlamak için, _Save_ düğmesi form geçerli bir durumda olana kadar devre dışı bırakılır.
Form geçerli olduğunda, _Save_'e tıklayın ve uygulama geçerli form değerlerini JSON olarak oluşturur.

Aşağıdaki şekil son formu gösterir.

<img alt="Dynamic-Form" src="assets/images/guide/dynamic-form/dynamic-form.png">

## Sonraki adımlar

<docs-pill-row>
  <docs-pill title="Form girdisini doğrulama" href="guide/forms/reactive-forms#form-girdisini-doğrulama" />
  <docs-pill title="Form doğrulama kılavuzu" href="guide/forms/form-validation" />
</docs-pill-row>
