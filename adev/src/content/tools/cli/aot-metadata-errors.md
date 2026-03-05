# AOT metadata errors

Aşağıda, karşılaşabileceğiniz meta veri hataları, açıklamaları ve önerilen düzeltmeleri verilmiştir.

## Expression form not supported

HELPFUL: Derleyici, Angular meta verisini değerlendirirken anlamadığı bir ifadeyle karşılaştı.

Derleyicinin [kısıtlı ifade sözdizimi](tools/cli/aot-compiler) dışındaki dil özellikleri, aşağıdaki örnekte görüldüğü gibi bu hataya neden olabilir:

```ts
// ERROR
export class Fooish { … }
…
const prop = typeof Fooish; // typeof is not valid in metadata
  …
  // bracket notation is not valid in metadata
  { provide: 'token', useValue: { [prop]: 'value' } };
  …
```

Normal uygulama kodunda `typeof` ve köşeli parantez gösterimini kullanabilirsiniz.
Sadece Angular meta verisini tanımlayan ifadelerde bu özellikleri kullanamazsınız.

Angular meta verisi yazarken derleyicinin [kısıtlı ifade sözdizimi](tools/cli/aot-compiler)ne bağlı kalarak bu hatadan kaçının ve yeni veya alışılmadık TypeScript özelliklerine karşı dikkatli olun.

## Reference to a local (non-exported) symbol

HELPFUL: Reference to a local \(non-exported\) symbol 'symbol name'. Consider exporting the symbol.

Derleyici, yerel olarak tanımlanmış ancak ya dışa aktarılmamış ya da başlatılmamış bir sembole başvuru buldu.

İşte sorunun bir `provider` örneği.

```ts

// ERROR
let foo: number; // neither exported nor initialized

@Component({
  selector: 'my-component',
  template: … ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}

```

Derleyici, bileşen fabrikasını ayrı bir modülde oluşturur ve bu fabrika `useValue` sağlayıcı kodunu içerir. _O_ fabrika modülü, yerel \(dışa aktarılmamış\) `foo` değişkenine erişmek için _bu_ kaynak modüle geri dönemez.

Sorunu `foo`'yu başlatarak düzeltebilirsiniz.

```ts
let foo = 42; // initialized
```

Derleyici, ifadeyi sağlayıcıya şöyle yazmışsınız gibi [katlar](tools/cli/aot-compiler#code-folding).

```ts
providers: [{provide: Foo, useValue: 42}];
```

Alternatif olarak, `foo`'nun çalışma zamanında değerini gerçekten bildiğinizde atanacağı beklentisiyle dışa aktararak düzeltebilirsiniz.

```ts
// CORRECTED
export let foo: number; // exported

@Component({
  selector: 'my-component',
  template: … ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}
```

`export` eklemek genellikle `providers` ve `animations` gibi meta verilerde referans verilen değişkenler için işe yarar çünkü derleyici bu ifadelerde dışa aktarılmış değişkenlere _referanslar_ oluşturabilir. Bu değişkenlerin _değerlerine_ ihtiyaç duymaz.

Derleyicinin kod oluşturmak için _gerçek değere_ ihtiyaç duyduğunda `export` eklemek işe yaramaz.
Örneğin, `template` özelliği için işe yaramaz.

```ts
// ERROR
export let someTemplate: string; // exported but not initialized

@Component({
  selector: 'my-component',
  template: someTemplate,
})
export class MyComponent {}
```

Derleyicinin bileşen fabrikasını oluşturmak için `template` özelliğinin değerine _hemen şimdi_ ihtiyacı vardır.
Tek başına değişken referansı yetersizdir.
Bildirimin başına `export` eklemek yalnızca yeni bir hata üretir: "[`Only initialized variables and constants can be referenced`](#only-initialized-variables-and-constants)".

## Only initialized variables and constants

HELPFUL: _Only initialized variables and constants can be referenced because the value of this variable is needed by the template compiler._

Derleyici, dışa aktarılmış ancak başlatılmamış bir değişkene veya statik alana referans buldu.
Kod oluşturmak için o değişkenin değerine ihtiyaç duyar.

Aşağıdaki örnek, bileşenin `template` özelliğini, bildirilmiş ancak _atanmamış_ olan dışa aktarılmış `someTemplate` değişkeninin değerine ayarlamaya çalışır.

```ts
// ERROR
export let someTemplate: string;

@Component({
  selector: 'my-component',
  template: someTemplate,
})
export class MyComponent {}
```

`someTemplate`'i başka bir modülden içe aktarırsanız ve orada başlatmayı ihmal ederseniz de bu hatayı alırsınız.

```ts
// ERROR - not initialized there either
import {someTemplate} from './config';

@Component({
  selector: 'my-component',
  template: someTemplate,
})
export class MyComponent {}
```

Derleyici, şablon bilgisini almak için çalışma zamanını bekleyemez.
Şablona dayalı öğeyi oluşturma talimatlarını içeren bileşen fabrikasını üretebilmek için `someTemplate` değişkeninin değerini kaynak koddan statik olarak türetmelidir.

Bu hatayı düzeltmek için, değişkenin başlangıç değerini _aynı satırda_ bir başlatıcı yan tümcesi ile sağlayın.

```ts
// CORRECTED
export let someTemplate = '<h1>Greetings from Angular</h1>';

@Component({
  selector: 'my-component',
  template: someTemplate,
})
export class MyComponent {}
```

## Reference to a non-exported class

HELPFUL: _Reference to a non-exported class `<class name>`._
_Consider exporting the class._

Meta veri, dışa aktarılmamış bir sınıfa referans verdi.

Örneğin, bir sınıf tanımlamış ve onu bir providers dizisinde enjeksiyon belirteci olarak kullanmış ancak o sınıfı dışa aktarmayı ihmal etmiş olabilirsiniz.

```ts
// ERROR
abstract class MyStrategy { }

  …
  providers: [
    { provide: MyStrategy, useValue: … }
  ]
  …
```

Angular, ayrı bir modülde bir sınıf fabrikası oluşturur ve bu fabrika [yalnızca dışa aktarılmış sınıflara erişebilir](tools/cli/aot-compiler#public-or-protected-symbols).
Bu hatayı düzeltmek için referans verilen sınıfı dışa aktarın.

```ts
// CORRECTED
export abstract class MyStrategy { }

  …
  providers: [
    { provide: MyStrategy, useValue: … }
  ]
  …
```

## Reference to a non-exported function

HELPFUL: _Metadata referenced a function that wasn't exported._

Örneğin, bir providers `useFactory` özelliğini yerel olarak tanımlanmış ve dışa aktarmayı ihmal ettiğiniz bir fonksiyona ayarlamış olabilirsiniz.

```ts
// ERROR
function myStrategy() { … }

  …
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  …
```

Angular, ayrı bir modülde bir sınıf fabrikası oluşturur ve bu fabrika [yalnızca dışa aktarılmış fonksiyonlara erişebilir](tools/cli/aot-compiler#public-or-protected-symbols).
Bu hatayı düzeltmek için fonksiyonu dışa aktarın.

```ts
// CORRECTED
export function myStrategy() { … }

  …
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  …
```

## Destructured variable or constant not supported

HELPFUL: _Referencing an exported destructured variable or constant is not supported by the template compiler. Consider simplifying this to avoid destructuring._

Derleyici, [parçalama](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring) ile atanmış değişkenlere yapılan referansları desteklemez.

Örneğin, şöyle bir şey yazamazsınız:

```ts
// ERROR
import { configuration } from './configuration';

// destructured assignment to foo and bar
const {foo, bar} = configuration;
  …
  providers: [
    {provide: Foo, useValue: foo},
    {provide: Bar, useValue: bar},
  ]
  …
```

Bu hatayı düzeltmek için parçalanmamış değerlere başvurun.

```ts
// CORRECTED
import { configuration } from './configuration';
  …
  providers: [
    {provide: Foo, useValue: configuration.foo},
    {provide: Bar, useValue: configuration.bar},
  ]
  …
```

## Could not resolve type

HELPFUL: _The compiler encountered a type and can't determine which module exports that type._

Bu, ortam türüne başvurduğunuzda olabilir.
Örneğin, `Window` türü global `.d.ts` dosyasında bildirilen bir ortam türüdür.

Derleyicinin statik olarak analiz etmesi gereken bileşen yapıcısında başvurursanız bir hata alırsınız.

```ts
// ERROR
@Component({ })
export class MyComponent {
  constructor (private win: Window) { … }
}
```

TypeScript ortam türlerini anlar, bu nedenle onları içe aktarmazsınız.
Angular derleyicisi, dışa aktarmayı veya içe aktarmayı ihmal ettiğiniz bir türü anlamaz.

Bu durumda, derleyici `Window` belirteci ile bir şeyin nasıl enjekte edileceğini anlamaz.

Meta veri ifadelerinde ortam türlerine başvurmayın.

Bir ortam türünün örneğini enjekte etmeniz gerekiyorsa, sorunu dört adımda çözebilirsiniz:

1. Ortam türünün bir örneği için bir enjeksiyon belirteci oluşturun.
1. O örneği döndüren bir fabrika fonksiyonu oluşturun.
1. O fabrika fonksiyonuyla bir `useFactory` sağlayıcısı ekleyin.
1. Örneği enjekte etmek için `@Inject` kullanın.

İşte açıklayıcı bir örnek.

```ts
// CORRECTED
import { Inject } from '@angular/core';

export const WINDOW = new InjectionToken('Window');
export function _window() { return window; }

@Component({
  …
  providers: [
    { provide: WINDOW, useFactory: _window }
  ]
})
export class MyComponent {
  constructor (@Inject(WINDOW) private win: Window) { … }
}
```

Yapıcıdaki `Window` türü artık derleyici için sorun değildir çünkü enjeksiyon kodunu oluşturmak için `@Inject(WINDOW)`'ı kullanır.

Angular, tarayıcının `document` nesnesini \(veya uygulamanın çalıştığı platforma bağlı olarak onun bir soyutlamasını\) enjekte edebilmeniz için `DOCUMENT` belirteci ile benzer bir şey yapar.

```ts
import { Inject }   from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({ … })
export class MyComponent {
  constructor (@Inject(DOCUMENT) private doc: Document) { … }
}
```

## Name expected

HELPFUL: _The compiler expected a name in an expression it was evaluating._

Bu, aşağıdaki örnekte olduğu gibi özellik adı olarak bir sayı kullandığınızda olabilir.

```ts
// ERROR
provider: [{provide: Foo, useValue: {0: 'test'}}];
```

Özelliğin adını sayısal olmayan bir değere değiştirin.

```ts
// CORRECTED
provider: [{provide: Foo, useValue: {'0': 'test'}}];
```

## Unsupported enum member name

HELPFUL: _Angular couldn't determine the value of the [enum member](https://www.typescriptlang.org/docs/handbook/enums.html) that you referenced in metadata._

Derleyici basit enum değerlerini anlayabilir ancak hesaplanan özelliklerden türetilenler gibi karmaşık değerleri anlayamaz.

```ts
// ERROR
enum Colors {
  Red = 1,
  White,
  Blue = "Blue".length // computed
}

  …
  providers: [
    { provide: BaseColor,   useValue: Colors.White } // ok
    { provide: DangerColor, useValue: Colors.Red }   // ok
    { provide: StrongColor, useValue: Colors.Blue }  // bad
  ]
  …
```

Karmaşık başlatıcılara veya hesaplanan özelliklere sahip enum'lara başvurmaktan kaçının.

## Tagged template expressions are not supported

HELPFUL: _Tagged template expressions are not supported in metadata._

Derleyici, aşağıdaki gibi bir JavaScript ES2015 [etiketli şablon ifadesiyle](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals) karşılaştı.

```ts

// ERROR
const expression = 'funky';
const raw = String.raw`A tagged template ${expression} string`;
 …
 template: '<div>' + raw + '</div>'
 …

```

[`String.raw()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/raw), JavaScript ES2015'e özgü bir _etiket fonksiyonudur_.

AOT derleyicisi etiketli şablon ifadelerini desteklemez; meta veri ifadelerinde bunlardan kaçının.

## Symbol reference expected

HELPFUL: _The compiler expected a reference to a symbol at the location specified in the error message._

Bu hata, bir sınıfın `extends` yan tümcesinde bir ifade kullandığınızda oluşabilir.

<!--todo: Chuck: After reviewing your PR comment I'm still at a loss. See [comment there](https://github.com/angular/angular/pull/17712#discussion_r132025495). -->
