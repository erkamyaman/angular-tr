# Yapısal direktifler

Yapısal direktifler, bir `<ng-template>` elemanına uygulanan ve o `<ng-template>`'in içeriğini koşullu veya tekrarlı olarak render eden direktiflerdir.

## Örnek kullanım durumu

Bu kılavuzda, belirli bir veri kaynağından veri getiren ve bu veri mevcut olduğunda şablonunu render eden bir yapısal direktif oluşturacaksınız. Bu direktif, SQL anahtar kelimesi `SELECT`'ten sonra `SelectDirective` olarak adlandırılır ve `[select]` nitelik seçicisi ile eşleştirilir.

`SelectDirective`, kullanılacak veri kaynağını adlandıran bir girdiye sahip olacaktır ve buna `selectFrom` diyeceksiniz. Bu girdi için `select` öneki, [kısaltılmış sözdizimi](#yapısal-direktif-kısaltılmış-sözdizimi) açısından önemlidir. Direktif, seçilen veriyi sağlayan bir şablon bağlamı ile `<ng-template>`'ini örneklendirecektir.

Aşağıda, bu direktifin doğrudan bir `<ng-template>` üzerinde kullanılmasına bir örnek verilmiştir:

```angular-html
<ng-template select let-data [selectFrom]="source">
  <p>The data is: {{ data }}</p>
</ng-template>
```

Yapısal direktif, verinin kullanılabilir olmasını bekleyebilir ve ardından `<ng-template>`'ini render edebilir.

HELPFUL: Angular'ın `<ng-template>` elemanının varsayılan olarak hiçbir şey render etmeyen bir şablon tanımladığını unutmayın; elemanları yapısal bir direktif uygulamadan yalnızca bir `<ng-template>` içine sararsanız, bu elemanlar render edilmez.

Daha fazla bilgi için [ng-template API](api/core/ng-template) belgelerine bakın.

## Yapısal direktif kısaltılmış sözdizimi

Angular, açıkça bir `<ng-template>` elemanı yazmak gereğinden kaçınan yapısal direktifler için kısaltılmış sözdizimini destekler.

Yapısal direktifler, direktif nitelik seçicisinin önüne yıldız işareti (`*`) eklenerek doğrudan bir elemana uygulanabilir, örneğin `*select`. Angular, bir yapısal direktifin önündeki yıldız işaretini, direktifi barındıran ve elemanı ile alt öğelerini çevreleyen bir `<ng-template>`'e dönüştürür.

Bunu `SelectDirective` ile aşağıdaki gibi kullanabilirsiniz:

```angular-html
<p *select="let data; from: source">The data is: {{ data }}</p>
```

Bu örnek, bazen _mikrosözdizimi_ olarak adlandırılan yapısal direktif kısaltılmış sözdiziminin esnekliğini gösterir.

Bu şekilde kullanıldığında, `<ng-template>`'e yalnızca yapısal direktif ve bağlamaları uygulanır. `<p>` etiketindeki diğer nitelikler veya bağlamalar olduğu gibi bırakılır. Örneğin, bu iki form eşdeğerdir:

```angular-html
<!-- Kısaltılmış sözdizimi: -->
<p class="data-view" *select="let data; from: source">The data is: {{ data }}</p>

<!-- Uzun biçimli sözdizimi: -->
<ng-template select let-data [selectFrom]="source">
  <p class="data-view">The data is: {{ data }}</p>
</ng-template>
```

Kısaltılmış sözdizimi bir dizi kural aracılığıyla genişletilir. Daha kapsamlı bir [gramer](#yapısal-direktif-sözdizimi-referansı) aşağıda tanımlanmıştır, ancak yukarıdaki örnekte bu dönüşüm şu şekilde açıklanabilir:

`*select` ifadesinin ilk kısmı `let data`'dır ve bir şablon değişkeni `data` bildirir. Ardından bir atama gelmediği için, şablon değişkeni şablon bağlam özelliği `$implicit`'e bağlanır.

Sözdiziminin ikinci parçası, `from source` anahtar-ifade çiftidir. `from` bir bağlama anahtarıdır ve `source` normal bir şablon ifadesidir. Bağlama anahtarları, PascalCase'e dönüştürülerek ve yapısal direktif seçicisi eklenerek özelliklere eşlenir. `from` anahtarı `selectFrom`'a eşlenir ve ardından `source` ifadesine bağlanır. Bu nedenle birçok yapısal direktifin, yapısal direktifin seçicisi ile ön eklenmiş girdileri olacaktır.

## Her eleman için tek bir yapısal direktif

Kısaltılmış sözdizimini kullanırken her elemana yalnızca bir yapısal direktif uygulayabilirsiniz. Bunun nedeni, o direktifin açıldığı yalnızca bir `<ng-template>` elemanı olmasıdır. Birden fazla direktif, birden fazla iç içe `<ng-template>` gerektirir ve hangi direktifin önce olması gerektiği belirsizdir. Birden fazla yapısal direktifin aynı fiziksel DOM elemanı veya bileşen etrafında uygulanması gerektiğinde, kullanıcının iç içe yapıyı tanımlamasına olanak tanıyan sarma katmanları oluşturmak için `<ng-container>` kullanılabilir.

## Yapısal direktif oluşturma

Bu bölüm, `SelectDirective`'i oluşturma sürecinde size rehberlik eder.

<docs-workflow>
<docs-step title="Direktifi oluşturma">
Angular CLI'yi kullanarak, `select`'in direktifin adı olduğu aşağıdaki komutu çalıştırın:

```shell
ng generate directive select
```

Angular, direktif sınıfını oluşturur ve bir şablondaki direktifi tanımlayan CSS seçicisini `[select]` belirtir.
</docs-step>
<docs-step title="Direktifi yapısal yapma">
`TemplateRef` ve `ViewContainerRef`'i içe aktarın. `TemplateRef` ve `ViewContainerRef`'i direktife özel özellikler olarak enjekte edin.

```ts
import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[select]',
})
export class SelectDirective {
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
}
```

</docs-step>
<docs-step title="'selectFrom' girdisini ekleme">
Bir `selectFrom` `input()` özelliği ekleyin.

```ts
export class SelectDirective {
  // ...
  selectFrom = input.required<DataSource>();
}
```

</docs-step>
<docs-step title="İş mantığını ekleme">
`SelectDirective` artık girdisiyle bir yapısal direktif olarak iskelet haline getirildiğine göre, şimdi veriyi getirmek ve şablonu onunla render etmek için mantığı ekleyebilirsiniz:

```ts
export class SelectDirective {
  // ...
  async ngOnInit() {
    const data = await this.selectFrom.load();
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      // `$implicit` anahtarı aracılığıyla veriyi içeren bir bağlam nesnesiyle
      // gömülü görünümü oluşturun.
      $implicit: data,
    });
  }
}
```

</docs-step>
</docs-workflow>

Hepsi bu - `SelectDirective` çalışır durumda. Bir sonraki adım [şablon tür denetimi desteği eklemek](#direktifin-bağlamını-türlendirme) olabilir.

## Yapısal direktif sözdizimi referansı

Kendi yapısal direktiflerinizi yazarken aşağıdaki sözdizimini kullanın:

```ts {hideCopy}
_: prefix = "( :let | :expression ) (';' | ',')? ( :let | :as | :keyExp )_";
```

Aşağıdaki desenler, yapısal direktif gramerinin her bölümünü tanımlar:

```ts
as = :export "as" :local ";"?
keyExp = :key ":"? :expression ("as" :local)? ";"?
let = "let" :local "=" :export ";"?
```

| Keyword      | Details                                                         |
| :----------- | :-------------------------------------------------------------- |
| `prefix`     | HTML nitelik anahtarı                                           |
| `key`        | HTML nitelik anahtarı                                           |
| `local`      | Şablonda kullanılan yerel değişken adı                          |
| `export`     | Direktif tarafından belirli bir ad altında dışa aktarılan değer |
| `expression` | Standart Angular ifadesi                                        |

### Angular kısaltılmış sözdizimini nasıl çevirir

Angular, yapısal direktif kısaltılmış sözdizimini normal bağlama sözdizimine şu şekilde çevirir:

| Shorthand                       | Translation                                            |
| :------------------------------ | :----------------------------------------------------- |
| `prefix` and naked `expression` | `[prefix]="expression"`                                |
| `keyExp`                        | `[prefixKey]="expression"` (`prefix`, `key`'e eklenir) |
| `let local`                     | `let-local="export"`                                   |

### Kısaltılmış sözdizimi örnekleri

Aşağıdaki tablo kısaltılmış örnekler sağlar:

| Shorthand                                                             | How Angular interprets the syntax                                                                             |
| :-------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| `*myDir="let item of [1,2,3]"`                                        | `<ng-template myDir let-item [myDirOf]="[1, 2, 3]">`                                                          |
| `*myDir="let item of [1,2,3] as items; trackBy: myTrack; index as i"` | `<ng-template myDir let-item [myDirOf]="[1,2,3]" let-items="myDirOf" [myDirTrackBy]="myTrack" let-i="index">` |
| `*ngComponentOutlet="componentClass";`                                | `<ng-template [ngComponentOutlet]="componentClass">`                                                          |
| `*ngComponentOutlet="componentClass; inputs: myInputs";`              | `<ng-template [ngComponentOutlet]="componentClass" [ngComponentOutletInputs]="myInputs">`                     |
| `*myDir="exp as value"`                                               | `<ng-template [myDir]="exp" let-value="myDir">`                                                               |

## Özel direktifler için şablon tür denetimini iyileştirme

Direktif tanımınıza şablon korumaları ekleyerek özel direktifler için şablon tür denetimini iyileştirebilirsiniz.
Bu korumalar, Angular şablon tür denetleyicisinin şablondaki hataları derleme zamanında bulmasına yardımcı olur ve çalışma zamanı hatalarından kaçınabilir.
İki farklı koruma türü mümkündür:

- `ngTemplateGuard_(input)`, belirli bir girdinin türüne göre bir girdi ifadesinin nasıl daraltılacağını kontrol etmenize olanak tanır.
- `ngTemplateContextGuard`, direktifin kendi türüne göre şablon için bağlam nesnesinin türünü belirlemek için kullanılır.

Bu bölüm her iki koruma türü için örnekler sağlar.
Daha fazla bilgi için [Şablon tür denetimi](tools/cli/template-typecheck 'Template type-checking guide') bölümüne bakın.

### Şablon korumaları ile tür daraltma

Bir şablondaki yapısal direktif, o şablonun çalışma zamanında render edilip edilmeyeceğini kontrol eder. Bazı yapısal direktifler, girdi ifadesinin türüne göre tür daraltma yapmak ister.

Girdi korumaları ile iki daraltma mümkündür:

- Girdi ifadesini TypeScript tür doğrulama fonksiyonuna göre daraltma.
- Girdi ifadesini doğruluk değerine göre daraltma.

Bir tür doğrulama fonksiyonu tanımlayarak girdi ifadesini daraltmak için:

```ts
// Bu direktif şablonunu yalnızca aktör bir kullanıcı olduğunda render eder.
// Şablon içinde `actor` ifadesinin türünün `User`'a
// daraltıldığını doğrulamak istiyorsunuz.
@Directive(...)
class ActorIsUser {
  actor = input<User | Robot>();

  static ngTemplateGuard_actor(dir: ActorIsUser, expr: User | Robot): expr is User {
    // Return ifadesi pratikte gereksizdir, ancak TypeScript hatalarını
    // önlemek için dahil edilmiştir.
    return true;
  }
}
```

Tür denetimi, şablonda `ngTemplateGuard_actor`'ın girdiye bağlanan ifade üzerinde doğrulandığı gibi davranacaktır.

Bazı direktifler şablonlarını yalnızca bir girdi doğru (truthy) olduğunda render eder. Doğruluk değerinin tam semantiğini bir tür doğrulama fonksiyonunda yakalamak mümkün değildir, bu nedenle şablon tür denetleyicisine bağlama ifadesinin kendisinin koruma olarak kullanılması gerektiğini belirtmek için `'binding'` literal türü kullanılabilir:

```ts
@Directive(...)
class CustomIf {
  condition = input.required<boolean>();

  static ngTemplateGuard_condition: 'binding';
}
```

Şablon tür denetleyicisi, `condition`'a bağlanan ifadenin şablon içinde doğru olarak doğrulandığı gibi davranacaktır.

### Direktifin bağlamını türlendirme

Yapısal direktifiniz örneklenen şablona bir bağlam sağlıyorsa, statik bir `ngTemplateContextGuard` tür doğrulama fonksiyonu sağlayarak şablon içinde doğru şekilde türlendirebilirsiniz. Bu fonksiyon, bağlamın türünü türetmek için direktifin türünü kullanabilir ve bu, direktifin türü generic olduğunda yararlıdır.

Yukarıda açıklanan `SelectDirective` için, veri kaynağı generic olsa bile veri türünü doğru şekilde belirtmek üzere bir `ngTemplateContextGuard` uygulayabilirsiniz.

```ts
// Şablon bağlamı için bir arayüz bildirin:
export interface SelectTemplateContext<T> {
  $implicit: T;
}

@Directive(...)
export class SelectDirective<T> {
  // Direktifin generic türü `T`, girdiye iletilen `DataSource` türünden
  // çıkarılacaktır.
  selectFrom = input.required<DataSource<T>>();

  // Direktifin generic türünü kullanarak bağlamın türünü daraltın.
  static ngTemplateContextGuard<T>(dir: SelectDirective<T>, ctx: any): ctx is SelectTemplateContext<T> {
    // Daha önce olduğu gibi koruma gövdesi çalışma zamanında kullanılmaz ve yalnızca
    // TypeScript hatalarını önlemek için dahil edilmiştir.
    return true;
  }
}
```
