# Reactive forms

Reaktif formlar, değerleri zamanla değişen form girdilerini yönetmek için model odaklı bir yaklaşım sunar.
Bu kılavuz, temel bir form kontrolünü nasıl oluşturacağınızı ve güncelleyeceğinizi, bir grupta birden fazla kontrolü kullanmaya nasıl geçeceğinizi, form değerlerini nasıl doğrulayacağınızı ve çalışma zamanında kontroller ekleyip kaldırabileceğiniz dinamik formlar oluşturmayı gösterir.

## Overview of reactive forms

Reaktif formlar, belirli bir zamanda formun durumunu yönetmek için açık ve değişmez bir yaklaşım kullanır.
Form durumundaki her değişiklik yeni bir durum döndürür ve değişiklikler arasında modelin bütünlüğünü korur.
Reaktif formlar, observable akışlar etrafında inşa edilmiştir; burada form girdileri ve değerleri, senkron olarak erişilebilen girdi değeri akışları olarak sağlanır.

Reaktif formlar ayrıca test etmek için basit bir yol sağlar çünkü verilerinizin istendiğinde tutarlı ve öngörülebilir olduğundan emin olursunuz.
Akışların tüm tüketicileri bu verilere güvenli bir şekilde erişebilir ve işleyebilir.

Reaktif formlar, [şablon odaklı formlardan](guide/forms/template-driven-forms) belirgin şekillerde farklıdır.
Reaktif formlar, veri modeline senkron erişim, observable operatörleriyle değişmezlik ve observable akışlar aracılığıyla değişiklik takibi sağlar.

Şablon odaklı formlar, şablonunuzdaki verilere doğrudan erişim ve değiştirme izni verir, ancak reaktif formlardan daha az açıktır çünkü şablona gömülü direktiflere dayanırlar ve değişiklikleri asenkron olarak takip etmek için değiştirilebilir veriler kullanırlar.
İki paradigma arasındaki ayrıntılı karşılaştırmalar için [Formlara Genel Bakış](guide/forms) bölümüne bakın.

## Adding a basic form control

Form kontrollerini kullanmanın üç adımı vardır.

1. Yeni bir bileşen oluşturun ve reaktif formlar modülünü kaydedin. Bu modül, reaktif formları kullanmak için ihtiyaç duyduğunuz reaktif form direktiflerini bildirir.
1. Yeni bir `FormControl` örneği oluşturun.
1. `FormControl`'ü şablonda kaydedin.

Daha sonra bileşeni şablona ekleyerek formu görüntüleyebilirsiniz.

Aşağıdaki örnekler, tek bir form kontrolünün nasıl ekleneceğini gösterir.
Örnekte, kullanıcı bir girdi alanına adını girer, bu girdi değeri yakalanır ve form kontrol öğesinin geçerli değeri görüntülenir.

<docs-workflow>

<docs-step title="Generate a new component and import the ReactiveFormsModule">
`@angular/forms` paketinden `ReactiveFormsModule`'ü içe aktarıp Component'inizin `imports` dizisine eklemek için CLI komutu `ng generate component` kullanarak projenizde bir bileşen oluşturun.

<docs-code header="name-editor.component.ts (excerpt)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="imports" />
</docs-step>

<docs-step title="Declare a FormControl instance">
Başlangıç değerini ayarlamak için `FormControl` yapıcısını kullanın; bu örnekte boş bir dizedir. Bu kontrolleri bileşen sınıfınızda oluşturarak, form girdisinin durumunu dinlemek, güncellemek ve doğrulamak için anında erişim elde edersiniz.

<docs-code header="name-editor.component.ts" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="create-control"/>
</docs-step>

<docs-step title="Register the control in the template">
Kontrolü bileşen sınıfında oluşturduktan sonra, onu şablondaki bir form kontrol öğesiyle ilişkilendirmeniz gerekir. `ReactiveFormsModule`'de de bulunan `FormControlDirective` tarafından sağlanan `formControl` bağlamasını kullanarak şablonu form kontrolüyle güncelleyin.

<docs-code header="name-editor.component.html" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="control-binding" />

Şablon bağlama sözdizimini kullanarak, form kontrolü artık şablondaki `name` girdi öğesine kaydedilmiştir. Form kontrolü ve DOM öğesi birbirleriyle iletişim kurar: görünüm modeldeki değişiklikleri yansıtır ve model görünümdeki değişiklikleri yansıtır.
</docs-step>

<docs-step title="Display the component">
`name` özelliğine atanan `FormControl`, `<app-name-editor>` bileşeni bir şablona eklendiğinde görüntülenir.

<docs-code header="app.component.html (name editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" region="app-name-editor"/>
</docs-step>
</docs-workflow>

### Displaying a form control value

Değeri aşağıdaki yollarla görüntüleyebilirsiniz.

- `valueChanges` observable'ı aracılığıyla; şablonda `AsyncPipe` kullanarak veya bileşen sınıfında `subscribe()` yöntemiyle formun değerindeki değişiklikleri dinleyebilirsiniz
- Geçerli değerin anlık görüntüsünü veren `value` özelliğiyle

Aşağıdaki örnek, şablonda interpolasyon kullanarak geçerli değerin nasıl görüntüleneceğini gösterir.

<docs-code header="name-editor.component.html (control value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="display-value"/>

Görüntülenen değer, form kontrol öğesini güncellediğinizde değişir.

Reaktif formlar, her örnekle sağlanan özellikler ve yöntemler aracılığıyla belirli bir kontrol hakkında bilgiye erişim sağlar.
Altta yatan [AbstractControl](api/forms/AbstractControl 'API reference') sınıfının bu özellikleri ve yöntemleri, form durumunu kontrol etmek ve [girdi doğrulamasını](#validating-form-input 'Learn more about validating form input') yönetirken mesajların ne zaman görüntüleneceğini belirlemek için kullanılır.

Diğer `FormControl` özellikleri ve yöntemleri hakkında [API Referansı](api/forms/FormControl 'Detailed syntax reference') bölümünden bilgi alabilirsiniz.

### Replacing a form control value

Reaktif formlar, bir kontrolün değerini programatik olarak değiştirmek için yöntemlere sahiptir ve bu size kullanıcı etkileşimi olmadan değeri güncelleme esnekliği sağlar.
Bir form kontrol örneği, form kontrolünün değerini güncelleyen ve sağlanan değerin yapısını kontrolün yapısına göre doğrulayan bir `setValue()` yöntemi sağlar.
Örneğin, bir arka uç API'sinden veya hizmetinden form verilerini alırken, kontrolü yeni değerine güncellemek ve eski değeri tamamen değiştirmek için `setValue()` yöntemini kullanın.

Aşağıdaki örnek, `setValue()` yöntemini kullanarak kontrolün değerini _Nancy_ olarak güncellemek için bileşen sınıfına bir yöntem ekler.

<docs-code header="name-editor.component.ts (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="update-value"/>

Bir ad güncellemesini simüle etmek için şablonu bir düğmeyle güncelleyin.
**Update Name** düğmesine tıkladığınızda, form kontrol öğesine girilen değer geçerli değeri olarak yansıtılır.

<docs-code header="name-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="update-value"/>

Form modeli kontrol için doğruluk kaynağıdır, bu nedenle düğmeye tıkladığınızda girdinin değeri bileşen sınıfı içinde değiştirilir ve geçerli değerini geçersiz kılar.

HELPFUL: Bu örnekte tek bir kontrol kullanıyorsunuz.
`setValue()` yöntemini bir [form grubu](#grouping-form-controls) veya [form dizisi](#creating-dynamic-forms) örneğiyle kullanırken, değerin grubun veya dizinin yapısıyla eşleşmesi gerekir.

## Grouping form controls

Formlar genellikle birbiriyle ilişkili birkaç kontrol içerir.
Reaktif formlar, birden fazla ilişkili kontrolü tek bir girdi formunda gruplamak için iki yol sunar.

| Form grupları | Ayrıntılar                                                                                                                                                                                                                                                                              |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Form grubu    | Birlikte yönetebileceğiniz sabit bir kontrol kümesi ile bir form tanımlar. Form grubu temelleri bu bölümde tartışılmaktadır. Daha karmaşık formlar oluşturmak için [form gruplarını iç içe yerleştirebilirsiniz](#creating-nested-form-groups 'See more about nesting groups').         |
| Form dizisi   | Çalışma zamanında kontroller ekleyip kaldırabileceğiniz dinamik bir form tanımlar. Daha karmaşık formlar oluşturmak için form dizilerini de iç içe yerleştirebilirsiniz. Bu seçenek hakkında daha fazla bilgi için [Dinamik formlar oluşturma](#creating-dynamic-forms) bölümüne bakın. |

Bir form kontrol örneğinin tek bir girdi alanı üzerinde kontrol sağlaması gibi, bir form grubu örneği de bir form kontrol örnekleri grubunun form durumunu takip eder \(örneğin, bir form\).
Form grubu oluşturulurken, form grubundaki her kontrol ada göre takip edilir.
Aşağıdaki örnek, birden fazla form kontrol örneğinin tek bir grupta nasıl yönetileceğini gösterir.

Bir `ProfileEditor` bileşeni oluşturun ve `@angular/forms` paketinden `FormGroup` ve `FormControl` sınıflarını içe aktarın.

```shell
ng generate component ProfileEditor
```

<docs-code header="profile-editor.component.ts (imports)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="imports"/>

Bu bileşene bir form grubu eklemek için aşağıdaki adımları izleyin.

1. Bir `FormGroup` örneği oluşturun.
1. `FormGroup` modelini ve görünümü ilişkilendirin.
1. Form verilerini kaydedin.

<docs-workflow>

<docs-step title="Create a FormGroup instance">
Bileşen sınıfında `profileForm` adlı bir özellik oluşturun ve özelliğin değerini yeni bir form grubu örneği olarak ayarlayın. Form grubunu başlatmak için yapıcıya, adlandırılmış anahtarları kontrollerine eşleyen bir nesne sağlayın.

Profil formu için, `firstName` ve `lastName` adlarıyla iki form kontrol örneği ekleyin

<docs-code header="profile-editor.component.ts (form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup"/>

Bireysel form kontrolleri artık bir grup içinde toplanmıştır. Bir `FormGroup` örneği, model değerini gruptaki her kontrolün değerlerinden oluşan bir nesne olarak sağlar. Bir form grubu örneği, bir form kontrol örneğiyle aynı özelliklere (örneğin `value` ve `untouched`) ve yöntemlere (örneğin `setValue()`) sahiptir.
</docs-step>

<docs-step title="Associate the FormGroup model and view">
Bir form grubu, kontrollerinin her biri için durum ve değişiklikleri takip eder, bu nedenle kontrollerden biri değişirse, üst kontrol de yeni bir durum veya değer değişikliği yayar. Grubun modeli, üyelerinden sürdürülür. Modeli tanımladıktan sonra, görünümdeki modeli yansıtmak için şablonu güncellemeniz gerekir.

<docs-code header="profile-editor.component.html (template form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroup"/>

Bir form grubunun bir kontrol grubunu içermesi gibi, _profileForm_ `FormGroup`'u, `FormGroup` direktifiyle `form` öğesine bağlanır ve model ile girdileri içeren form arasında bir iletişim katmanı oluşturur. `FormControlName` direktifi tarafından sağlanan `formControlName` girdisi, her bireysel girdiyi `FormGroup`'ta tanımlanan form kontrolüne bağlar. Form kontrolleri ilgili öğeleriyle iletişim kurar. Ayrıca değişiklikleri, model değeri için doğruluk kaynağını sağlayan form grubu örneğine de iletirler.
</docs-step>

<docs-step title="Save form data">
`ProfileEditor` bileşeni kullanıcıdan girdi kabul eder, ancak gerçek bir senaryoda form değerini yakalamak ve bileşen dışında daha fazla işlem için kullanılabilir hale getirmek istersiniz. `FormGroup` direktifi, `form` öğesi tarafından yayılan `submit` olayını dinler ve bir geri çağırma fonksiyonuna bağlayabileceğiniz bir `ngSubmit` olayı yayar. `onSubmit()` geri çağırma yöntemiyle `form` etiketine bir `ngSubmit` olay dinleyicisi ekleyin.

<docs-code header="profile-editor.component.html (submit event)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="ng-submit"/>

`ProfileEditor` bileşenindeki `onSubmit()` yöntemi, `profileForm`'un geçerli değerini yakalar. Formu kapsüllenmiş tutmak ve form değerini bileşen dışında sağlamak için `EventEmitter` kullanın. Aşağıdaki örnek, tarayıcı konsoluna bir mesaj kaydetmek için `console.warn` kullanır.

<docs-code header="profile-editor.component.ts (submit method)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="on-submit"/>

`submit` olayı, yerleşik DOM olayı kullanılarak `form` etiketi tarafından yayılır. `submit` türünde bir düğmeye tıklayarak olayı tetiklersiniz. Bu, kullanıcının tamamlanmış formu göndermek için **Enter** tuşuna basmasına olanak tanır.

Form gönderimini tetiklemek için formun altına bir düğme eklemek üzere bir `button` öğesi kullanın.

<docs-code header="profile-editor.component.html (submit button)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="submit-button"/>

Önceki kod parçacığındaki düğme, `profileForm` geçersiz olduğunda düğmeyi devre dışı bırakmak için kendisine bağlı bir `disabled` bağlamasına da sahiptir. Henüz herhangi bir doğrulama yapmıyorsunuz, bu nedenle düğme her zaman etkindir. Temel form doğrulama, [Form girdisini doğrulama](#validating-form-input) bölümünde ele alınmaktadır.
</docs-step>

<docs-step title="Display the component">
Formu içeren `ProfileEditor` bileşenini görüntülemek için, onu bir bileşen şablonuna ekleyin.

<docs-code header="app.component.html (profile editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" region="app-profile-editor"/>

`ProfileEditor`, form grubu örneği içindeki `firstName` ve `lastName` kontrolleri için form kontrol örneklerini yönetmenize olanak tanır.

### Creating nested form groups

Form grupları, alt öğe olarak hem bireysel form kontrol örneklerini hem de diğer form grubu örneklerini kabul edebilir.
Bu, karmaşık form modellerinin oluşturulmasını kolaylaştırır ve mantıksal olarak birlikte gruplandırır.

Karmaşık formlar oluştururken, bilgilerin farklı alanlarını daha küçük bölümlerde yönetmek daha kolaydır.
İç içe yerleştirilmiş bir form grubu örneği kullanmak, büyük form gruplarını daha küçük, daha yönetilebilir gruplara bölmenize olanak tanır.

Daha karmaşık formlar oluşturmak için aşağıdaki adımları kullanın.

1. İç içe bir grup oluşturun.
1. İç içe formu şablonda gruplayın.

Bazı bilgi türleri doğal olarak aynı gruba düşer.
Bir ad ve adres, bu tür iç içe grupların tipik örnekleridir ve aşağıdaki örneklerde kullanılmaktadır.

<docs-workflow>
<docs-step title="Create a nested group">
`profileForm`'da iç içe bir grup oluşturmak için, form grubu örneğine iç içe bir `address` öğesi ekleyin.

<docs-code header="profile-editor.component.ts (nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="nested-formgroup"/>

Bu örnekte, `address group` mevcut `firstName` ve `lastName` kontrollerini yeni `street`, `city`, `state` ve `zip` kontrolleriyle birleştirir. Form grubundaki `address` öğesi, form grubundaki genel `profileForm` öğesinin bir alt öğesi olmasına rağmen, değer ve durum değişiklikleri için aynı kurallar geçerlidir. İç içe form grubundaki durum ve değer değişiklikleri, üst form grubuna yayılır ve genel modelle tutarlılığı korur.
</docs-step>

<docs-step title="Group the nested form in the template">
Bileşen sınıfındaki modeli güncelledikten sonra, form grubu örneğini ve girdi öğelerini bağlamak için şablonu güncelleyin. `street`, `city`, `state` ve `zip` alanlarını içeren `address` form grubunu `ProfileEditor` şablonuna ekleyin.

<docs-code header="profile-editor.component.html (template nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroupname"/>

`ProfileEditor` formu tek bir grup olarak görüntülenir, ancak model mantıksal gruplama alanlarını temsil etmek üzere daha ayrıntılı olarak bölünmüştür.

Form grubu örneğinin değerini bileşen şablonunda `value` özelliği ve `JsonPipe` kullanarak görüntüleyin.
</docs-step>
</docs-workflow>

### Updating parts of the data model

Birden fazla kontrol içeren bir form grubu örneğinin değerini güncellerken, modelin yalnızca belirli bölümlerini güncellemek isteyebilirsiniz.
Bu bölüm, form kontrol veri modelinin belirli bölümlerinin nasıl güncelleneceğini kapsar.

Model değerini güncellemenin iki yolu vardır:

| Yöntemler      | Ayrıntılar                                                                                                                                             |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setValue()`   | Bireysel bir kontrol için yeni bir değer ayarlayın. `setValue()` yöntemi, form grubunun yapısına kesinlikle uyar ve kontrolün tüm değerini değiştirir. |
| `patchValue()` | Form modelinde değişen nesne içinde tanımlanan özellikleri değiştirin.                                                                                 |

`setValue()` yönteminin katı kontrolleri, karmaşık formlardaki iç içe yerleştirme hatalarını yakalamaya yardımcı olurken, `patchValue()` bu hatalarda sessizce başarısız olur.

`ProfileEditorComponent`'te, kullanıcı için ad ve sokak adresini güncellemek üzere `updateProfile` yöntemini aşağıdaki örnekle kullanın.

<docs-code header="profile-editor.component.ts (patch value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="patch-value"/>

Kullanıcı profilini talep üzerine güncellemek için şablona bir düğme ekleyerek bir güncellemeyi simüle edin.

<docs-code header="profile-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="patch-value"/>

Kullanıcı düğmeye tıkladığında, `profileForm` modeli `firstName` ve `street` için yeni değerlerle güncellenir. `street`'in `address` özelliği içinde bir nesne olarak sağlandığına dikkat edin.
Bu gereklidir çünkü `patchValue()` yöntemi güncellemeyi model yapısına göre uygular.
`PatchValue()` yalnızca form modelinin tanımladığı özellikleri günceller.

## Using the FormBuilder service to generate controls

Birden fazla formla uğraşırken form kontrol örneklerini manuel olarak oluşturmak tekrarlayıcı hale gelebilir.
`FormBuilder` hizmeti, kontroller oluşturmak için kullanışlı yöntemler sağlar.

Bu hizmetten yararlanmak için aşağıdaki adımları kullanın.

1. `FormBuilder` sınıfını içe aktarın.
1. `FormBuilder` hizmetini enjekte edin.
1. Form içeriklerini oluşturun.

Aşağıdaki örnekler, form kontrol ve form grubu örnekleri oluşturmak için form oluşturucu hizmetini kullanmak üzere `ProfileEditor` bileşenini nasıl yeniden düzenleyeceğinizi gösterir.

<docs-workflow>
<docs-step title="Import the FormBuilder class">
`@angular/forms` paketinden `FormBuilder` sınıfını içe aktarın.

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder-imports"/>

</docs-step>

<docs-step title="Inject the FormBuilder service">
`FormBuilder` hizmeti, reaktif formlar modülünden enjekte edilebilen bir sağlayıcıdır. Bu bağımlılığı bileşeninize enjekte etmek için `inject()` fonksiyonunu kullanın.

<docs-code header="profile-editor.component.ts (property init)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="inject-form-builder"/>

</docs-step>
<docs-step title="Generate form controls">
`FormBuilder` hizmetinin üç yöntemi vardır: `control()`, `group()` ve `array()`. Bunlar, bileşen sınıflarınızda form kontrolleri, form grupları ve form dizileri dahil olmak üzere örnekler oluşturmak için fabrika yöntemleridir. `profileForm` kontrollerini oluşturmak için `group` yöntemini kullanın.

<docs-code header="profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder"/>

Önceki örnekte, modeldeki özellikleri tanımlamak için aynı nesneyle `group()` yöntemini kullanırsınız. Her kontrol adının değeri, dizideki ilk öğe olarak başlangıç değerini içeren bir dizidir.

TIP: Kontrolü yalnızca başlangıç değeriyle tanımlayabilirsiniz, ancak kontrolleriniz senkron veya asenkron doğrulamaya ihtiyaç duyuyorsa, dizide ikinci ve üçüncü öğe olarak senkron ve asenkron doğrulayıcıları ekleyin. Örnekleri manuel olarak oluşturma ile form oluşturucuyu kullanmayı karşılaştırın.

  <docs-code-multifile>
    <docs-code header="profile-editor.component.ts (instances)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup-compare"/>
    <docs-code header="profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="formgroup-compare"/>
  </docs-code-multifile>
</docs-step>

</docs-workflow>

## Validating form input

_Form doğrulama_, kullanıcı girdisinin eksiksiz ve doğru olmasını sağlamak için kullanılır.
Bu bölüm, bir form kontrolüne tek bir doğrulayıcı eklemeyi ve genel form durumunu görüntülemeyi kapsar.
Form doğrulama, [Form Doğrulama](guide/forms/form-validation) kılavuzunda daha kapsamlı olarak ele alınmaktadır.

Form doğrulama eklemek için aşağıdaki adımları kullanın.

1. Form bileşeninize bir doğrulayıcı fonksiyonu içe aktarın.
1. Doğrulayıcıyı formdaki alana ekleyin.
1. Doğrulama durumunu yönetmek için mantık ekleyin.

En yaygın doğrulama, bir alanı zorunlu yapmaktır.
Aşağıdaki örnek, `firstName` kontrolüne zorunlu doğrulama eklemeyi ve doğrulama sonucunu görüntülemeyi gösterir.

<docs-workflow>
<docs-step title="Import a validator function">
Reaktif formlar, yaygın kullanım durumları için bir dizi doğrulayıcı fonksiyon içerir. Bu fonksiyonlar, doğrulanacak bir kontrol alır ve doğrulama kontrolüne göre bir hata nesnesi veya null değer döndürür.

`@angular/forms` paketinden `Validators` sınıfını içe aktarın.

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="validator-imports"/>
</docs-step>

<docs-step title="Make a field required">
`ProfileEditor` bileşeninde, `firstName` kontrolü için dizideki ikinci öğe olarak `Validators.required` statik yöntemini ekleyin.

<docs-code header="profile-editor.component.ts (required validator)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="required-validator"/>
</docs-step>

<docs-step title="Display form status">
Form kontrolüne zorunlu bir alan eklediğinizde, başlangıç durumu geçersiz olur. Bu geçersiz durum üst form grubu öğesine yayılır ve durumunu geçersiz yapar. Form grubu örneğinin geçerli durumuna `status` özelliği aracılığıyla erişin.

`profileForm`'un geçerli durumunu interpolasyon kullanarak görüntüleyin.

<docs-code header="profile-editor.component.html (display status)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="display-status"/>

Zorunlu `firstName` form kontrolü nedeniyle `profileForm` geçersiz olduğu için **Submit** düğmesi devre dışıdır. `firstName` girdisini doldurduktan sonra form geçerli hale gelir ve **Submit** düğmesi etkinleşir.

Form doğrulama hakkında daha fazla bilgi için [Form Doğrulama](guide/forms/form-validation) kılavuzunu ziyaret edin.
</docs-step>
</docs-workflow>

## Creating dynamic forms

`FormArray`, herhangi bir sayıda adlandırılmamış kontrolü yönetmek için `FormGroup`'a bir alternatiftir.
Form grubu örneklerinde olduğu gibi, form dizisi örneklerinden kontrolleri dinamik olarak ekleyip kaldırabilirsiniz ve form dizisi örneğinin değeri ile doğrulama durumu, alt kontrollerinden hesaplanır.
Ancak, her kontrol için ada göre bir anahtar tanımlamanız gerekmez, bu nedenle önceden alt değerlerin sayısını bilmediğinizde bu harika bir seçenektir.

Dinamik bir form tanımlamak için aşağıdaki adımları izleyin.

1. `FormArray` sınıfını içe aktarın.
1. Bir `FormArray` kontrolü tanımlayın.
1. `FormArray` kontrolüne bir getter yöntemiyle erişin.
1. Form dizisini bir şablonda görüntüleyin.

Aşağıdaki örnek, `ProfileEditor`'da bir _takma adlar_ dizisini nasıl yöneteceğinizi gösterir.

<docs-workflow>
<docs-step title="Import the `FormArray` class">
Tür bilgisi için kullanmak üzere `@angular/forms`'dan `FormArray` sınıfını içe aktarın. `FormBuilder` hizmeti bir `FormArray` örneği oluşturmaya hazırdır.

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-array-imports"/>
</docs-step>

<docs-step title="Define a `FormArray` control">
Bir form dizisini sıfırdan çoğa kadar herhangi bir sayıda kontrol ile başlatabilirsiniz, bunları bir dizide tanımlayarak. Form dizisini tanımlamak için `profileForm` form grubu örneğine bir `aliases` özelliği ekleyin.

Diziyi tanımlamak için `FormBuilder.array()` yöntemini ve diziyi bir başlangıç kontrolüyle doldurmak için `FormBuilder.control()` yöntemini kullanın.

<docs-code header="profile-editor.component.ts (aliases form array)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases"/>

Form grubu örneğindeki aliases kontrolü artık tek bir kontrolle doldurulmuştur ve dinamik olarak daha fazla kontrol eklenene kadar böyle kalır.
</docs-step>

<docs-step title="Access the `FormArray` control">
Bir getter, form dizisi örneğindeki takma adlara, her örneği almak için `profileForm.get()` yöntemini tekrarlamaya kıyasla erişim sağlar. Form dizisi örneği, bir dizideki tanımlanmamış sayıda kontrolü temsil eder. Bir kontrole getter aracılığıyla erişmek uygundur ve ek kontroller için tekrarlanması kolaydır. <br />

Üst form grubundan alias form dizisi kontrolünü almak üzere bir `aliases` sınıf özelliği oluşturmak için getter sözdizimini kullanın.

<docs-code header="profile-editor.component.ts (aliases getter)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases-getter"/>

Döndürülen kontrol `AbstractControl` türünde olduğundan, form dizisi örneği için yöntem sözdizimine erişmek üzere açık bir tür sağlamanız gerekir. Alias form dizisine dinamik olarak bir alias kontrolü eklemek için bir yöntem tanımlayın. `FormArray.push()` yöntemi kontrolü diziye yeni bir öğe olarak ekler ve ayrıca birden fazla kontrolü aynı anda kaydetmek için FormArray.push() yöntemine bir kontrol dizisi de iletebilirsiniz.

<docs-code header="profile-editor.component.ts (add alias)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="add-alias"/>

Şablonda, her kontrol ayrı bir girdi alanı olarak görüntülenir.

</docs-step>

<docs-step title="Display the form array in the template">

Form modelinizdeki takma adları eklemek için bunları şablona eklemeniz gerekir. `FormGroupNameDirective` tarafından sağlanan `formGroupName` girdisine benzer şekilde, `formArrayName` form dizisi örneğinden şablona `FormArrayNameDirective` ile iletişimi bağlar.

`formGroupName` öğesini kapatan `<div>`'den sonra aşağıdaki şablon HTML'sini ekleyin.

<docs-code header="profile-editor.component.html (aliases form array template)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="formarrayname"/>

`@for` bloğu, aliases form dizisi örneği tarafından sağlanan her form kontrol örneği üzerinde yineleme yapar. Form dizisi öğeleri adlandırılmamış olduğundan, dizini `i` değişkenine atarsınız ve `formControlName` girdisine bağlamak için her kontrole iletirsiniz.

Her yeni alias örneği eklendiğinde, yeni form dizisi örneğine dizine göre kontrolü sağlanır. Bu, kök kontrolün durumunu ve değerini hesaplarken her bireysel kontrolü takip etmenize olanak tanır.

</docs-step>

### Using `FormArrayDirective` for top-level form arrays

Bir `FormArray`'i `FormArrayDirective` kullanarak doğrudan bir `<form>` öğesine bağlayabilirsiniz.
Bu, form üst düzey bir `FormGroup` kullanmadığında ve dizinin kendisi tam form modelini temsil ettiğinde kullanışlıdır.

```angular-ts
import {Component} from '@angular/core';
import {FormArray, FormControl} from '@angular/forms';

@Component({
  selector: 'form-array-example',
  template: `
    <form [formArray]="form">
      @for (control of form.controls; track $index) {
        <input [formControlName]="$index" />
      }
    </form>
  `,
})
export class FormArrayExampleComponent {
  controls = [new FormControl('fish'), new FormControl('cat'), new FormControl('dog')];

  form = new FormArray(this.controls);
}
```

<docs-step title="Add an alias">

Başlangıçta form bir `Alias` alanı içerir. Başka bir alan eklemek için **Add Alias** düğmesine tıklayın. Ayrıca şablonun altındaki `Form Value` tarafından bildirilen takma adlar dizisini de doğrulayabilirsiniz. Her takma ad için bir form kontrol örneği yerine, ek alanlarla başka bir form grubu örneği oluşturabilirsiniz. Her öğe için bir kontrol tanımlama süreci aynıdır.
</docs-step>

</docs-workflow>

## Unified control state change events

Tüm form kontrolleri, `AbstractControl` (`FormControl`, `FormGroup`, `FormArray` ve `FormRecord`) üzerindeki `events` observable'ı aracılığıyla tek bir birleşik **kontrol durum değişikliği olayları** akışı sunar.
Bu birleşik akış, **değer**, **durum**, **pristine**, **touched** ve **reset** durum değişikliklerine ve ayrıca **submit** gibi **form düzeyinde eylemlere** tepki vermenize olanak tanır; böylece birden fazla observable bağlamak yerine tek bir abonelikle tüm güncellemeleri yönetebilirsiniz.

### Event types

`events` tarafından yayılan her öğe, belirli bir olay sınıfının bir örneğidir:

- **`ValueChangeEvent`** -- kontrolün **değeri** değiştiğinde.
- **`StatusChangeEvent`** -- kontrolün **doğrulama durumu** `FormControlStatus` değerlerinden birine (`VALID`, `INVALID`, `PENDING` veya `DISABLED`) güncellendiğinde.
- **`PristineChangeEvent`** -- kontrolün **pristine/dirty** durumu değiştiğinde.
- **`TouchedChangeEvent`** -- kontrolün **touched/untouched** durumu değiştiğinde.
- **`FormResetEvent`** -- bir kontrol veya form, `reset()` API'si veya yerel bir eylem aracılığıyla sıfırlandığında.
- **`FormSubmittedEvent`** -- form gönderildiğinde.

Tüm olay sınıfları `ControlEvent`'i genişletir ve değişikliği başlatan `AbstractControl`'e bir `source` referansı içerir; bu büyük formlarda kullanışlıdır.

```ts
import {Component} from '@angular/core';
import {
  FormControl,
  ValueChangeEvent,
  StatusChangeEvent,
  PristineChangeEvent,
  TouchedChangeEvent,
  FormResetEvent,
  FormSubmittedEvent,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';

@Component({
  /*...*/
})
export class UnifiedEventsBasicComponent {
  form = new FormGroup({
    username: new FormControl(''),
  });

  constructor() {
    this.form.events.subscribe((e) => {
      if (e instanceof ValueChangeEvent) {
        console.log('Value changed to: ', e.value);
      }

      if (e instanceof StatusChangeEvent) {
        console.log('Status changed to: ', e.status);
      }

      if (e instanceof PristineChangeEvent) {
        console.log('Pristine status changed to: ', e.pristine);
      }

      if (e instanceof TouchedChangeEvent) {
        console.log('Touched status changed to: ', e.touched);
      }

      if (e instanceof FormResetEvent) {
        console.log('Form was reset');
      }

      if (e instanceof FormSubmittedEvent) {
        console.log('Form was submitted');
      }
    });
  }
}
```

### Filtering specific events

Yalnızca bir olay türü alt kümesine ihtiyacınız olduğunda RxJS operatörlerini tercih edin.

```ts
import {filter} from 'rxjs/operators';
import {StatusChangeEvent} from '@angular/forms';

control.events
  .pipe(filter((e) => e instanceof StatusChangeEvent))
  .subscribe((e) => console.log('Status:', e.status));
```

### Unifying from multiple subscriptions

**Önce**

```ts
import {combineLatest} from 'rxjs/operators';

combineLatest([control.valueChanges, control.statusChanges]).subscribe(([value, status]) => {
  /* ... */
});
```

**Sonra**

```ts
control.events.subscribe((e) => {
  // Handle ValueChangeEvent, StatusChangeEvent, etc.
});
```

NOTE: Değer değişikliğinde, yayılma bu kontrolün değeri güncellendikten hemen sonra gerçekleşir. Bir üst kontrolün değeri (örneğin bu FormControl bir FormGroup'un parçasıysa) daha sonra güncellenir, bu nedenle bu olayın geri çağırmasından bir üst kontrolün değerine (`value` özelliği kullanarak) erişmek, henüz güncellenmemiş bir değer almanızla sonuçlanabilir. Bunun yerine üst kontrolün `events`'ine abone olun.

## Managing form control state

Reaktif formlar, **touched/untouched** ve **pristine/dirty** ile kontrol durumunu takip eder. Angular bunları DOM etkileşimleri sırasında otomatik olarak günceller, ancak bunları programatik olarak da yönetebilirsiniz.

**[`markAsTouched`](api/forms/FormControl#markAsTouched)** -- Bir kontrolü veya formu, değeri değiştirmeyen odaklanma ve odak kaybetme olayları tarafından dokunulmuş olarak işaretler. Varsayılan olarak üst kontrollere yayılır.

```ts
// Show validation errors after user leaves a field
onEmailBlur() {
  const email = this.form.get('email');
  email.markAsTouched();
}
```

**[`markAsUntouched`](api/forms/FormControl#markAsUntouched)** -- Bir kontrolü veya formu dokunulmamış olarak işaretler. Tüm alt kontrollere basamaklanır ve tüm üst kontrollerin dokunulmuş durumunu yeniden hesaplar.

```ts
// Reset form state after successful submission
onSubmitSuccess() {
  this.form.markAsUntouched();
  this.form.markAsPristine();
}
```

**[`markAsDirty`](api/forms/FormControl#markAsDirty)** -- Bir kontrolü veya formu değiştirilmiş olarak işaretler, yani değer değiştirilmiştir. Varsayılan olarak üst kontrollere yayılır.

```ts
// Mark programmatically changed values as modified
autofillAddress() {
  const previousAddress = getAddress();
  this.form.patchValue(previousAddress, { emitEvent: false });
  this.form.markAsDirty();
}
```

**[`markAsPristine`](api/forms/FormControl#markAsPristine)** -- Bir kontrolü veya formu saf (pristine) olarak işaretler. Tüm alt kontrolleri saf olarak işaretler ve tüm üst kontrollerin saf durumunu yeniden hesaplar.

```ts
// Reset pristine state after saving to track new changes
saveForm() {
  this.api.save(this.form.value).subscribe(() => {
    this.form.markAsPristine();
  });
}
```

**[`markAllAsDirty`](api/forms/FormControl#markAllAsDirty)** -- Kontrolü veya formu ve tüm alt kontrollerini değiştirilmiş olarak işaretler.

```ts
// Mark imported data as dirty
loadData(data: FormData) {
  this.form.patchValue(data);
  this.form.markAllAsDirty();
}
```

**[`markAllAsTouched`](api/forms/FormControl#markAllAsTouched)** -- Kontrolü veya formu ve tüm alt kontrollerini dokunulmuş olarak işaretler. Tüm form genelinde doğrulama hatalarını göstermek için kullanışlıdır.

```ts
// Show all validation errors before submission
onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  this.saveForm();
}
```

## Controlling event emission and propagation

Form kontrollerini programatik olarak güncellerken, değişikliklerin form hiyerarşisi boyunca nasıl yayılacağı ve olayların yayılıp yayılmayacağı üzerinde hassas kontrole sahipsiniz.

### Understanding event emission

Varsayılan olarak `emitEvent: true`'dur; bir kontrole yapılan herhangi bir değişiklik, `valueChanges` ve `statusChanges` observable'ları aracılığıyla olayları yayar. `emitEvent: false` ayarı bu yayımları bastırır; bu, otomatik kaydetme gibi reaktif davranışları tetiklemeden değerleri programatik olarak ayarlamak, kontroller arasındaki döngüsel güncellemeleri önlemek veya olayların yalnızca sonunda bir kez yayılması gereken toplu güncellemeler yapmak için kullanışlıdır.

```ts
@Component({
  /* ... */
})
export class BlogPostEditor {
  postForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
  });

  constructor() {
    // Auto-save draft every time user types
    this.postForm.valueChanges.subscribe((formValue) => {
      this.autosaveDraft(formValue);
    });
  }

  loadExistingDraft(savedDraft: {title: string; content: string}) {
    // Restore draft without triggering auto-save
    this.postForm.setValue(savedDraft, {emitEvent: false});
  }
}
```

### Understanding propagation control

Varsayılan olarak `onlySelf: false`'tur; güncellemeler üst kontrollere basamaklanır ve değerleri ile doğrulama durumlarını yeniden hesaplar. `onlySelf: true` ayarı güncellemeyi geçerli kontrolle sınırlar ve üst bildirimini engeller. Bu, üst güncellemeyi bir kez manuel olarak tetiklemek istediğiniz toplu işlemler için kullanışlıdır.

```ts
updatePostalCodeValidator(country: string) {
  const postal = this.addressForm.get('postalCode');

  const validators = country === 'US'
    ? [Validators.maxLength(5)]
    : [Validators.maxLength(7)];

  postal.setValidators(validators);
  postal.updateValueAndValidity({ onlySelf: true, emitEvent: false });
}
```

## Utility functions for narrowing form control types

Angular, bir `AbstractControl`'ün somut türünü belirlemeye yardımcı olan dört yardımcı fonksiyon sağlar. Bu fonksiyonlar **tür koruyucuları** olarak hareket eder ve `true` döndürdüklerinde kontrol türünü daraltır; bu da aynı blok içinde alt tipe özgü özelliklere güvenli bir şekilde erişmenize olanak tanır.

| Yardımcı fonksiyon | Ayrıntılar                                           |
| :----------------- | :--------------------------------------------------- |
| `isFormControl`    | Kontrol bir `FormControl` olduğunda `true` döndürür. |
| `isFormGroup`      | Kontrol bir `FormGroup` olduğunda `true` döndürür    |
| `isFormRecord`     | Kontrol bir `FormRecord` olduğunda `true` döndürür   |
| `isFormArray`      | Kontrol bir `FormArray` olduğunda `true` döndürür    |

Bu yardımcılar, fonksiyon imzası bir `AbstractControl` alan ancak mantığın belirli bir kontrol türü için tasarlandığı **özel doğrulayıcılarda** özellikle kullanışlıdır.

```ts
import {AbstractControl, isFormArray} from '@angular/forms';

export function positiveValues(control: AbstractControl) {
  if (!isFormArray(control)) {
    return null; // Not a FormArray: validator is not applicable.
  }

  // Safe to access FormArray-specific API after narrowing.
  const hasNegative = control.controls.some((c) => c.value < 0);
  return hasNegative ? {positiveValues: true} : null;
}
```

## Reactive forms API summary

Aşağıdaki tablo, reaktif form kontrollerini oluşturmak ve yönetmek için kullanılan temel sınıfları ve hizmetleri listeler.
Tam sözdizimi ayrıntıları için [Forms paketi](api#forms 'API reference') API referans belgelerine bakın.

### Classes

| Sınıf             | Ayrıntılar                                                                                                                                                                      |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AbstractControl` | `FormControl`, `FormGroup` ve `FormArray` somut form kontrol sınıfları için soyut temel sınıf. Ortak davranışlarını ve özelliklerini sağlar.                                    |
| `FormControl`     | Bireysel bir form kontrolünün değerini ve geçerlilik durumunu yönetir. `<input>` veya `<select>` gibi bir HTML form kontrolüne karşılık gelir.                                  |
| `FormGroup`       | Bir `AbstractControl` örnekleri grubunun değerini ve geçerlilik durumunu yönetir. Grubun özellikleri, alt kontrollerini içerir. Bileşeninizdeki üst düzey form `FormGroup`'tur. |
| `FormArray`       | Sayısal olarak indekslenmiş bir `AbstractControl` örnekleri dizisinin değerini ve geçerlilik durumunu yönetir.                                                                  |
| `FormBuilder`     | Kontrol örnekleri oluşturmak için fabrika yöntemleri sağlayan enjekte edilebilir bir hizmet.                                                                                    |
| `FormRecord`      | Her biri aynı değer türüne sahip bir `FormControl` örnekleri koleksiyonunun değerini ve geçerlilik durumunu takip eder.                                                         |

### Directives

| Direktif               | Ayrıntılar                                                                                            |
| :--------------------- | :---------------------------------------------------------------------------------------------------- |
| `FormControlDirective` | Bağımsız bir `FormControl` örneğini bir form kontrol öğesine senkronize eder.                         |
| `FormControlName`      | Mevcut bir `FormGroup` örneğindeki `FormControl`'ü ada göre bir form kontrol öğesine senkronize eder. |
| `FormGroupDirective`   | Mevcut bir `FormGroup` örneğini bir DOM öğesine senkronize eder.                                      |
| `FormGroupName`        | İç içe bir `FormGroup` örneğini bir DOM öğesine senkronize eder.                                      |
| `FormArrayName`        | İç içe bir `FormArray` örneğini bir DOM öğesine senkronize eder.                                      |
| `FormArrayDirective`   | Bağımsız bir `FormArray` örneğini bir DOM öğesine senkronize eder.                                    |
