# Template type checking

## Overview of template type checking

TypeScript'in kodunuzdaki tür hatalarını yakalaması gibi, Angular da uygulamanızın şablonlarındaki ifadeleri ve bağlamaları kontrol eder ve bulduğu tür hatalarını raporlayabilir.
Angular şu anda bunu, [Angular'ın derleyici seçeneklerindeki](reference/configs/angular-compiler-options) `fullTemplateTypeCheck` ve `strictTemplates` bayraklarının değerine bağlı olarak üç modda yapmaktadır.

### Basic mode

En temel tür denetimi modunda, `fullTemplateTypeCheck` bayrağı `false` olarak ayarlandığında, Angular bir şablondaki yalnızca üst düzey ifadeleri doğrular.

`<map [city]="user.address.city">` yazarsanız, derleyici şunları doğrular:

- `user` bileşen sınıfında bir özelliktir
- `user` bir address özelliğine sahip bir nesnedir
- `user.address` bir city özelliğine sahip bir nesnedir

Derleyici, `user.address.city` değerinin `<map>` bileşeninin city girdisine atanabilir olup olmadığını doğrulamaz.

Derleyicinin bu modda bazı önemli sınırlamaları da vardır:

- Önemlisi, `*ngIf`, `*ngFor`, diğer `<ng-template>` gömülü görünümler gibi gömülü görünümleri kontrol etmez.
- `#refs` türlerini, pipe'ların sonuçlarını veya olay bağlamalarındaki `$event` türünü çözmez.

Birçok durumda bunlar `any` türü olarak sonuçlanır ve bu da ifadenin sonraki bölümlerinin denetlenmemesine neden olabilir.

### Full mode

`fullTemplateTypeCheck` bayrağı `true` olarak ayarlanırsa, Angular şablonlardaki tür denetiminde daha agresif davranır.
Özellikle:

- Gömülü görünümler \(`*ngIf` veya `*ngFor` içindekiler gibi\) denetlenir
- Pipe'lar doğru dönüş türüne sahiptir
- Direktif ve pipe'lara yapılan yerel referanslar doğru türe sahiptir \(herhangi bir genel parametre hariç, bunlar `any` olacaktır\)

Aşağıdakiler hâlâ `any` türündedir.

- DOM öğelerine yapılan yerel referanslar
- `$event` nesnesi
- Güvenli navigasyon ifadeleri

IMPORTANT: `fullTemplateTypeCheck` bayrağı Angular 13'te kullanımdan kaldırılmıştır.
Bunun yerine `strictTemplates` derleyici seçenekleri ailesi kullanılmalıdır.

### Strict mode

Angular, `fullTemplateTypeCheck` bayrağının davranışını korur ve üçüncü bir "katı mod" sunar.
Katı mod, tam modun bir üst kümesidir ve `strictTemplates` bayrağı true olarak ayarlanarak erişilir.
Bu bayrak `fullTemplateTypeCheck` bayrağının yerini alır.

Tam mod davranışına ek olarak Angular şunları yapar:

- Bileşen/direktif bağlamalarının `input()`'larına atanabilir olduğunu doğrular
- Önceki modu doğrularken TypeScript'in `strictNullChecks` bayrağına uyar
- Genel türler dahil olmak üzere bileşenlerin/direktiflerin doğru türünü çıkarsar
- Yapılandırıldığı yerlerde şablon bağlam türlerini çıkarsar \(örneğin, `NgFor`'un doğru tür denetimine izin verir\)
- Bileşen/direktif, DOM ve animasyon olay bağlamalarında `$event`'in doğru türünü çıkarsar
- Etiket adına dayalı olarak DOM öğelerine yapılan yerel referansların doğru türünü çıkarsar \(örneğin, `document.createElement`'in o etiket için döndüreceği tür\)

## Checking of `*ngFor`

Tür denetiminin üç modu gömülü görünümleri farklı şekilde ele alır.
Aşağıdaki örneği inceleyin.

```ts {header:"User interface"}
interface User {
  name: string;
  address: {
    city: string;
    state: string;
  };
}
```

```html
<div *ngFor="let user of users">
  <h2>{{config.title}}</h2>
  <span>City: {{user.address.city}}</span>
</div>
```

`<h2>` ve `<span>`, `*ngFor` gömülü görünümü içindedir.
Temel modda Angular bunların hiçbirini denetlemez.
Ancak tam modda Angular, `config` ve `user`'ın var olduğunu kontrol eder ve `any` türünü varsayar.
Katı modda Angular, `<span>` içindeki `user`'ın `User` türünde olduğunu ve `address`'in `string` türünde bir `city` özelliğine sahip bir nesne olduğunu bilir.

## Troubleshooting template errors

Katı modda, önceki modların hiçbirinde ortaya çıkmayan şablon hatalarıyla karşılaşabilirsiniz.
Bu hatalar genellikle şablonlardaki, önceki araçlar tarafından yakalanmayan gerçek tür uyumsuzluklarını temsil eder.
Bu durumda, hata mesajı sorunun şablonda nerede oluştuğunu açıkça belirtmelidir.

Ayrıca, bir Angular kütüphanesinin türlemeleri eksik veya hatalı olduğunda ya da türlemeler aşağıdaki durumlarda olduğu gibi beklentilerle tam olarak uyuşmadığında yanlış pozitifler de olabilir.

- Bir kütüphanenin türlemeleri yanlış veya eksik olduğunda \(örneğin, kütüphane `strictNullChecks` gözetilmeden yazılmışsa eksik `null | undefined`\)
- Bir kütüphanenin girdi türleri çok dar olduğunda ve kütüphane Angular'ın bunu anlaması için uygun meta veriler eklemediğinde.
  Bu genellikle devre dışı bırakılmış veya nitelik olarak kullanılan diğer yaygın Boolean girdilerinde meydana gelir, örneğin `<input disabled>`.

- DOM olayları için `$event.target` kullanıldığında \(olay kabarcıklanması olasılığı nedeniyle, DOM türlemelerinde `$event.target` beklediğiniz türe sahip değildir\)

Bunlar gibi yanlış pozitif durumlarında birkaç seçenek vardır:

- İfadenin bir bölümü için tür denetiminden çıkmak üzere belirli bağlamlarda `$any()` tür dönüştürme fonksiyonunu kullanın
- Uygulamanın TypeScript yapılandırma dosyası `tsconfig.json`'da `strictTemplates: false` ayarlayarak katı denetimleri tamamen devre dışı bırakın
- Diğer yönlerde katılığı korurken belirli tür denetimi işlemlerini bir _katılık bayrağını_ `false` olarak ayarlayarak ayrı ayrı devre dışı bırakın
- `strictTemplates` ve `strictNullChecks`'i birlikte kullanmak istiyorsanız, `strictNullInputTypes` kullanarak özellikle girdi bağlamaları için katı null tür denetiminden çıkın

Aksi belirtilmedikçe, aşağıdaki her seçenek `strictTemplates` için belirlenen değere ayarlanır \(`strictTemplates` `true` olduğunda `true` ve tersine, aksi yönde\).

| Strictness flag              | Effect                                                                                                                                                                                                                                                                                                                                                                                                         |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `strictInputTypes`           | Bir bağlama ifadesinin `@Input()` alanına atanabilirliğinin denetlenip denetlenmediği. Ayrıca direktif genel türlerinin çıkarımını da etkiler.                                                                                                                                                                                                                                                                 |
| `strictInputAccessModifiers` | Bir bağlama ifadesini bir `@Input()` veya `input()`'a atarken `private`/`protected`/`readonly` gibi erişim belirleyicilerinin dikkate alınıp alınmadığı. Devre dışı bırakılırsa girdinin erişim belirleyicileri yok sayılır; yalnızca tür denetlenir. Bu seçenek, `strictTemplates` `true` olarak ayarlansa bile varsayılan olarak `false`'tur. Not: Bu denetim yalnızca girdilere uygulanır, çıktılara değil. |
| `strictNullInputTypes`       | `@Input()` bağlamaları denetlenirken \(`strictInputTypes`'a göre\) `strictNullChecks`'in dikkate alınıp alınmadığı. Bunu kapatmak, `strictNullChecks` gözetilmeden oluşturulmuş bir kütüphane kullanıldığında faydalı olabilir.                                                                                                                                                                                |
| `strictAttributeTypes`       | Metin nitelikleri kullanılarak yapılan `@Input()` bağlamalarının denetlenip denetlenmediği. Örneğin, `<input matInput disabled="true">` \(`disabled` özelliğini `'true'` dizesine ayarlar\) ile `<input matInput [disabled]="true">` \(`disabled` özelliğini `true` boolean değerine ayarlar\) karşılaştırması.                                                                                                |
| `strictSafeNavigationTypes`  | Güvenli navigasyon işlemlerinin dönüş türünün \(örneğin, `user?.name` `user` türüne göre doğru şekilde çıkarılıp çıkarılmadığı\). Devre dışı bırakılırsa `user?.name` `any` türünde olacaktır.                                                                                                                                                                                                                 |
| `strictDomLocalRefTypes`     | DOM öğelerine yapılan yerel referansların doğru türe sahip olup olmadığı. Devre dışı bırakılırsa `<input #ref>` için `ref` `any` türünde olacaktır.                                                                                                                                                                                                                                                            |
| `strictOutputEventTypes`     | Bileşen/direktif `@Output()` veya animasyon olaylarına yapılan olay bağlamalarında `$event`'in doğru türe sahip olup olmadığı. Devre dışı bırakılırsa `any` olacaktır.                                                                                                                                                                                                                                         |
| `strictDomEventTypes`        | DOM olaylarına yapılan olay bağlamalarında `$event`'in doğru türe sahip olup olmadığı. Devre dışı bırakılırsa `any` olacaktır.                                                                                                                                                                                                                                                                                 |
| `strictContextGenerics`      | Genel bileşenlerin tür parametrelerinin doğru şekilde çıkarılıp çıkarılmadığı \(herhangi bir genel sınır dahil\). Devre dışı bırakılırsa herhangi bir tür parametresi `any` olacaktır.                                                                                                                                                                                                                         |
| `strictLiteralTypes`         | Şablonda bildirilen nesne ve dizi literallerinin türlerinin çıkarılıp çıkarılmadığı. Devre dışı bırakılırsa bu tür literallerin türü `any` olacaktır. Bu bayrak, `fullTemplateTypeCheck` veya `strictTemplates`'ten _biri_ `true` olarak ayarlandığında `true`'dur.                                                                                                                                            |

Bu bayraklarla sorun giderme yaptıktan sonra hâlâ sorunlarınız varsa, `strictTemplates`'i devre dışı bırakarak tam moda geri dönün.

Bu da işe yaramazsa, son çare olarak `fullTemplateTypeCheck: false` ile tam modu tamamen kapatma seçeneği vardır.

Önerilen yöntemlerden hiçbiriyle çözemediğiniz bir tür denetimi hatası, şablon tür denetleyicisinin kendisindeki bir hatanın sonucu olabilir.
Temel moda geri dönmeyi gerektiren hatalar alıyorsanız, bunun büyük olasılıkla böyle bir hata olduğunu gösterir.
Bu durumda, ekibin bunu ele alabilmesi için [bir sorun bildirin](https://github.com/angular/angular/issues).

## Inputs and type-checking

Şablon tür denetleyicisi, bir bağlama ifadesinin türünün ilgili direktif girdisinin türüyle uyumlu olup olmadığını kontrol eder.
Örnek olarak aşağıdaki bileşeni inceleyin:

```angular-ts
export interface User {
  name: string;
}

@Component({
  selector: 'user-detail',
  template: '{{ user.name }}',
})
export class UserDetailComponent {
  user = input.required<User>();
}
```

`AppComponent` şablonu bu bileşeni şu şekilde kullanır:

```angular-ts
@Component({
  selector: 'app-root',
  template: '<user-detail [user]="selectedUser"></user-detail>',
})
export class AppComponent {
  selectedUser: User | null = null;
}
```

Burada, `AppComponent` şablonunun tür denetimi sırasında `[user]="selectedUser"` bağlaması `UserDetailComponent.user` girdisine karşılık gelir.
Bu nedenle Angular, `selectedUser` özelliğini `UserDetailComponent.user`'a atar ve türleri uyumsuz olsaydı bu bir hataya neden olurdu.
TypeScript, atamayı kendi tür sistemine göre kontrol eder ve uygulamada yapılandırıldığı şekliyle `strictNullChecks` gibi bayraklara uyar.

Şablon tür denetleyicisine daha spesifik şablon içi tür gereksinimleri sağlayarak çalışma zamanı tür hatalarından kaçının.
Direktif tanımında şablon koruma fonksiyonları sağlayarak kendi direktifleriniz için girdi türü gereksinimlerini mümkün olduğunca spesifik hale getirin.
Bu kılavuzdaki [Improving template type checking for custom directives](/guide/directives/structural-directives#improving-template-type-checking-for-custom-directives) bölümüne bakın.

### Strict null checks

`strictTemplates`'i ve TypeScript `strictNullChecks` bayrağını etkinleştirdiğinizde, kolayca kaçınılamayacak belirli durumlar için tür denetimi hataları oluşabilir.
Örneğin:

- `strictNullChecks` etkinleştirilmeden derlenmiş bir kütüphaneden gelen bir direktife bağlanan nullable bir değer.

  `strictNullChecks` olmadan derlenen bir kütüphane için, bildirim dosyaları bir alanın `null` olup olamayacağını belirtmez.
  Kütüphanenin `null`'ı doğru şekilde ele aldığı durumlarda, bu sorunludur çünkü derleyici nullable bir değeri `null` türünü atlayan bildirim dosyalarına karşı kontrol eder.
  Bu nedenle derleyici, `strictNullChecks`'e uyduğu için bir tür denetimi hatası üretir.

- Senkron olarak değer yayacağını bildiğiniz bir Observable ile `async` pipe kullanımı.

  `async` pipe, şu anda abone olduğu Observable'ın asenkron olabileceğini varsayar, bu da henüz kullanılabilir bir değer olmayabileceği anlamına gelir.
  Bu durumda hâlâ bir şey döndürmesi gerekir, bu da `null`'dır.
  Diğer bir deyişle, `async` pipe'ın dönüş türü `null` içerir ve Observable'ın senkron olarak null olmayan bir değer yayacağının bilindiği durumlarda hatalara neden olabilir.

Yukarıdaki sorunlar için iki olası geçici çözüm vardır:

- Şablonda, nullable bir ifadenin sonuna null olmayan onaylama operatörü `!` ekleyin, örneğin

```html
<user-detail [user]="user!"></user-detail>
```

Bu örnekte, derleyici TypeScript kodunda olduğu gibi nullability'deki tür uyumsuzluklarını yok sayar.
`async` pipe durumunda, ifadenin parantez içine alınması gerektiğini unutmayın, örneğin

```html
<user-detail [user]="(user$ | async)!"></user-detail>
```

- Angular şablonlarında katı null denetimlerini tamamen devre dışı bırakın.

  `strictTemplates` etkinleştirildiğinde, tür denetiminin belirli yönlerini devre dışı bırakmak hâlâ mümkündür.
  `strictNullInputTypes` seçeneğini `false` olarak ayarlamak, Angular şablonlarındaki katı null denetimlerini devre dışı bırakır.
  Bu bayrak, uygulamanın parçası olan tüm bileşenler için geçerlidir.

### Advice for library authors

Bir kütüphane yazarı olarak, kullanıcılarınız için en iyi deneyimi sağlamak adına birkaç önlem alabilirsiniz.
İlk olarak, `strictNullChecks`'i etkinleştirmek ve girdinin türüne uygun şekilde `null` dahil etmek, tüketicilerinize nullable bir değer sağlayıp sağlayamayacaklarını iletir.
Ek olarak, şablon tür denetleyicisine özel tür ipuçları sağlamak da mümkündür.
Bu kılavuzdaki [Improving template type checking for custom directives](/guide/directives/structural-directives#improving-template-type-checking-for-custom-directives) ve [Input setter coercion](#input-setter-coercion) bölümlerine bakın.

## Input setter coercion

Bazen bir direktifin veya bileşenin `input()` özelliğinin, kendisine bağlanan değeri değiştirmesi, genellikle girdi için bir `transform` fonksiyonu kullanması istenir.
Örnek olarak bu özel düğme bileşenini inceleyin:

Aşağıdaki direktifi inceleyin:

```angular-ts
@Component({
  selector: 'submit-button',
  template: `
    <div class="wrapper">
      <button [disabled]="disabled">Submit</button>
    </div>
  `,
})
class SubmitButton {
  disabled = input.required({transform: booleanAttribute});
}
```

Burada bileşenin `disabled` girdisi şablondaki `<button>`'a aktarılmaktadır.
Girdiye bir `boolean` değer bağlandığı sürece bunların hepsi beklendiği gibi çalışır.
Ancak bir tüketicinin bu girdiyi şablonda bir nitelik olarak kullandığını varsayalım:

```html
<submit-button disabled></submit-button>
```

Bu, aşağıdaki bağlamayla aynı etkiye sahiptir:

```html
<submit-button [disabled]="''"></submit-button>
```

Çalışma zamanında girdiye boş dize atanır ki bu bir `boolean` değer değildir.
Bu sorunla ilgilenen Angular bileşen kütüphaneleri genellikle değeri setter'da doğru türe "zorlar":

```ts

set disabled(value: boolean) {
  this._disabled = (value === '') || value;
}

```

Burada `value` türünü `boolean`'dan `boolean|''`'a değiştirmek, setter tarafından gerçekten kabul edilen değer kümesiyle eşleşmesi açısından ideal olurdu.
4.3 öncesi TypeScript sürümleri, getter ve setter'ın aynı türe sahip olmasını gerektirir, bu nedenle getter bir `boolean` döndürmesi gerekiyorsa setter daha dar türle sınırlı kalır.

Tüketici Angular'ın şablonlar için en katı tür denetimini etkinleştirmişse, bu bir sorun yaratır: boş dize \(`''`\) aslında `disabled` alanına atanamaz, bu da nitelik formu kullanıldığında bir tür hatasına neden olur.

Bu sorunun geçici çözümü olarak Angular, `@Input()` için girdi alanının kendisi için bildirilen türden daha geniş ve daha müsamahakâr bir türün denetlenmesini destekler.
Bileşen sınıfına `ngAcceptInputType_` önekiyle statik bir özellik ekleyerek bunu etkinleştirin:

```ts
class SubmitButton {
  private _disabled: boolean;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value === '' || value;
  }

  static ngAcceptInputType_disabled: boolean | '';
}
```

TypeScript 4.3'ten itibaren setter'ın `boolean|''` türünü kabul edecek şekilde bildirilebilmesi, girdi setter zorlama alanını gereksiz kılmıştır.
Bu nedenle, girdi setter zorlama alanları kullanımdan kaldırılmıştır.

Bu alanın bir değere sahip olması gerekmez.
Varlığı, Angular tür denetleyicisine `disabled` girdisinin `boolean|''` türüyle eşleşen bağlamaları kabul edecek şekilde değerlendirilmesi gerektiğini iletir.
Son ek, `@Input` _alan_ adı olmalıdır.

Belirli bir girdi için bir `ngAcceptInputType_` geçersiz kılması mevcutsa, setter'ın geçersiz kılınan türün herhangi bir değerini işleyebilmesi gerektiğine dikkat edilmelidir.

## Disabling type checking using `$any()`

Bir bağlama ifadesini `$any()` dönüştürme sözde fonksiyonuna yapılan bir çağrı ile çevreleyerek ifadenin denetlenmesini devre dışı bırakın.
Derleyici bunu, TypeScript'te `<any>` veya `as any` dönüştürmesi kullanıldığında olduğu gibi `any` türüne bir dönüştürme olarak ele alır.

Aşağıdaki örnekte, `person`'ı `any` türüne dönüştürmek `Property address does not exist` hatasını bastırır.

```angular-ts
@Component({
  selector: 'my-component',
  template: '{{$any(person).address.street}}',
})
class MyComponent {
  person?: Person;
}
```
