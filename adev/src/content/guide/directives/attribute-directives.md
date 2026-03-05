# Attribute directives

Nitelik direktifleri ile DOM elemanlarının ve Angular bileşenlerinin görünümünü veya davranışını değiştirin.

## Building an attribute directive

Bu bölüm, ana elemanın arka plan rengini sarıya ayarlayan bir vurgulama direktifi oluşturma sürecinde size rehberlik eder.

1. Bir direktif oluşturmak için [`ng generate directive`](tools/cli/schematics) CLI komutunu kullanın.

   ```shell
   ng generate directive highlight
   ```

   CLI, `src/app/highlight.directive.ts` ve ilgili test dosyası `src/app/highlight.directive.spec.ts`'i oluşturur.

   <docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.0.ts"/>

   `@Directive()` dekoratörünün yapılandırma özelliği, direktifin CSS nitelik seçicisini, `[appHighlight]`'ı belirtir.

1. `@angular/core`'dan `ElementRef`'i içe aktarın.
   `ElementRef`, `nativeElement` özelliği aracılığıyla ana DOM elemanına doğrudan erişim sağlar.

1. Ana DOM elemanına, `appHighlight`'ı uyguladığınız elemana bir referans [enjekte etmek](guide/di) için direktifin `constructor()`'ına `ElementRef` ekleyin.

1. `HighlightDirective` sınıfına arka planı sarıya ayarlayan mantık ekleyin.

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.1.ts"/>

HELPFUL: Direktifler ad alanlarını _desteklemez_.

<docs-code header="app.component.avoid.html (unsupported)" path="adev/src/content/examples/attribute-directives/src/app/app.component.avoid.html" region="unsupported"/>

## Applying an attribute directive

`HighlightDirective`'i kullanmak için, HTML şablonuna direktifi nitelik olarak içeren bir `<p>` elemanı ekleyin.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.html" region="applied"/>

Angular, `HighlightDirective` sınıfının bir örneğini oluşturur ve `<p>` elemanına bir referans direktifin constructor'ına enjekte eder, bu da `<p>` elemanının arka plan stilini sarıya ayarlar.

## Handling user events

Bu bölüm, kullanıcının fareyi elemanın içine veya dışına getirdiğini algılamayı ve vurgulama rengini ayarlayarak veya kaldırarak yanıt vermeyi gösterir.

1. `@Directive()` dekoratöründeki `host` özelliğini kullanarak ana olay bağlamalarını yapılandırın.

   <docs-code header="src/app/highlight.directive.ts (decorator)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" region="decorator"/>

1. İki olay işleyici yöntemi ekleyin ve `host` özelliği aracılığıyla ana eleman olaylarını bunlara eşleyin.

   <docs-code header="highlight.directive.ts (mouse-methods)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" region="mouse-methods"/>

Bir nitelik direktifini barındıran DOM elemanının (bu durumda `<p>`) olaylarına, direktifin [`host` özelliğinde](guide/components/host-elements#binding-to-the-host-element) olay dinleyicileri yapılandırarak abone olun.

HELPFUL: İşleyiciler, ana DOM elemanı `el` üzerinde rengi ayarlayan bir yardımcı yöntem olan `highlight()`'a delege eder.

Tamamlanmış direktif aşağıdaki gibidir:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts"/>

İşaretçi paragraf elemanının üzerine geldiğinde arka plan rengi görünür ve işaretçi uzaklaştığında kaybolur.

<img alt="Second Highlight" src="assets/images/guide/attribute-directives/highlight-directive-anim.gif">

## Passing values into an attribute directive

Bu bölüm, `HighlightDirective`'i uygularken vurgulama rengini ayarlama sürecinde size rehberlik eder.

1. `highlight.directive.ts`'de `@angular/core`'dan `input`'u içe aktarın.

   <docs-code header="highlight.directive.ts (imports)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="imports"/>

1. Bir `appHighlight` `input` özelliği ekleyin.

   <docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="input"/>

   `input()` fonksiyonu, direktifin `appHighlight` özelliğini bağlama için kullanılabilir kılan meta verileri sınıfa ekler.

1. `app.component.ts`'de `AppComponent`'e bir `color` özelliği ekleyin.

   <docs-code header="app.component.ts (class)" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.ts" region="class"/>

1. Direktifi ve rengi aynı anda uygulamak için, `appHighlight` direktif seçicisi ile özellik bağlaması kullanın ve `color`'a eşitleyin.

   <docs-code header="app.component.html (color)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="color"/>

   `[appHighlight]` nitelik bağlaması iki görevi yerine getirir:
   - Vurgulama direktifini `<p>` elemanına uygular
   - Direktifin vurgulama rengini bir özellik bağlaması ile ayarlar

### Setting the value with user input

Bu bölüm, renk seçiminizi `appHighlight` direktifine bağlamak için radyo düğmeleri ekleme konusunda size rehberlik eder.

1. Aşağıdaki gibi bir renk seçmek için `app.component.html`'e işaretleme ekleyin:

   <docs-code header="app.component.html (v2)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="v2"/>

2. `AppComponent.color`'ı başlangıç değeri olmayacak şekilde değiştirin.

   <docs-code header="app.component.ts (class)" path="adev/src/content/examples/attribute-directives/src/app/app.component.ts" region="class"/>

3. `highlight.directive.ts`'de, `onMouseEnter` yöntemini önce `appHighlight` ile vurgulamayı deneyen ve `appHighlight` `undefined` ise `red`'e geri dönen şekilde düzenleyin.
   <docs-code header="highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="mouse-enter"/>

4. Kullanıcının rengi radyo düğmeleriyle seçebildiğini doğrulamak için uygulamanızı sunun.

   <img alt="Animated gif of the refactored highlight directive changing color according to the radio button the user selects" src="assets/images/guide/attribute-directives/highlight-directive-v2-anim.gif">

## Binding to a second property

Bu bölüm, geliştiricinin varsayılan rengi ayarlayabilmesi için uygulamanızı yapılandırma konusunda size rehberlik eder.

1. `HighlightDirective`'e `defaultColor` adlı ikinci bir `input()` özelliği ekleyin.

   <docs-code header="highlight.directive.ts (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" region="defaultColor"/>

2. Direktifin `onMouseEnter` yöntemini, önce `appHighlight` ile, sonra `defaultColor` ile vurgulamayı deneyen ve her iki özellik de `undefined` ise `red`'e geri dönen şekilde düzenleyin.

   <docs-code header="highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" region="mouse-enter"/>

3. `AppComponent.color`'a bağlanmak ve varsayılan renk olarak "violet" kullanmak için aşağıdaki HTML'i ekleyin.
   Bu durumda, `defaultColor` bağlaması köşeli parantez `[]` kullanmaz çünkü değer dinamik bir ifade değil statik bir string'dir.

   <docs-code header="app.component.html (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="defaultColor"/>

   Bileşenlerde olduğu gibi, bir ana elemana birden fazla direktif özellik bağlaması ekleyebilirsiniz.

Varsayılan renk bağlaması yoksa varsayılan renk kırmızıdır.
Kullanıcı bir renk seçtiğinde seçilen renk aktif vurgulama rengi olur.

<img alt="Animated gif of final highlight directive that shows red color with no binding and violet with the default color set. When user selects color, the selection takes precedence." src="assets/images/guide/attribute-directives/highlight-directive-final-anim.gif">

## Deactivating Angular processing with `NgNonBindable`

Tarayıcıda ifade değerlendirmesini önlemek için ana elemana `ngNonBindable` ekleyin.
`ngNonBindable`, şablonlardaki interpolasyonu, direktifleri ve bağlamayı devre dışı bırakır.

Aşağıdaki örnekte, `{{ 1 + 1 }}` ifadesi kod editörünüzdeki gibi render edilir ve `2` görüntülemez.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="ngNonBindable"/>

`ngNonBindable`'ı bir elemana uygulamak, o elemanın çocuk elemanları için bağlamayı durdurur.
Ancak, `ngNonBindable` yine de `ngNonBindable` uyguladığınız eleman üzerinde direktiflerin çalışmasına izin verir.
Aşağıdaki örnekte, `appHighlight` direktifi hala aktiftir ancak Angular `{{ 1 + 1 }}` ifadesini değerlendirmez.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="ngNonBindable-with-directive"/>

`ngNonBindable`'ı bir üst elemana uygularsanız, Angular elemanın çocukları için özellik bağlama veya olay bağlama gibi her türlü interpolasyonu ve bağlamayı devre dışı bırakır.
