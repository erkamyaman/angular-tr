# Nitelik direktifleri

Nitelik direktifleri, DOM elemanlarının ve Angular bileşenlerinin görünümünü veya davranışını değiştirir.

## Tek seferlik davranış için şablon bağlamalarını kullanın

Angular'ın şablon sözdizimi, tek bir elemanın sınıflarını, stillerini, özelliklerini ve olaylarını değiştirmeyi zaten kapsar:

- [Sınıf ve stil bağlamaları](guide/templates/binding#css-class-and-style-property-bindings) CSS sınıfları ve satır içi stiller ekleyip kaldırır.
- [Özellik ve nitelik bağlamaları](guide/templates/binding) DOM özelliklerini ve HTML niteliklerini ayarlar.
- [Olay dinleyicileri](guide/templates/event-listeners) kullanıcı etkileşimine yanıt verir.

Nitelik direktifleri, bu tür bir davranışı herhangi bir elemana veya bileşene uygulayabileceğiniz yeniden kullanılabilir bir birime paketlemek istediğinizde faydalıdır.

## Bir nitelik direktifi oluşturma

Özel bir nitelik direktifi, `@Directive()` dekoratörüne sahip bir JavaScript sınıfıdır. Dekoratörün `selector`'ı, direktifi uygulayan niteliği tanımlar. Köşeli parantezler bunu bir nitelik seçicisi yapar, böylece direktif o niteliği taşıyan elemanlarla eşleşir. Ad çakışmalarını önlemek için, kural olarak `app` gibi bir ön ek kullanın:

```ts
import {Directive} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {}
```

HELPFUL: [`ng generate directive`](tools/cli/schematics) CLI komutu, bir direktifi test dosyasıyla birlikte oluşturur.

Bir direktif, host elemanını host bağlamaları aracılığıyla bildirimsel olarak veya host elemanına bir referans aracılığıyla emir kipiyle değiştirebilir. Bu örnek [`ElementRef`](api/core/ElementRef) [enjekte eder](guide/di) ve arka planı sarıya ayarlamak için elemana `nativeElement` özelliği üzerinden erişir:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.1.ts"/>

IMPORTANT: Direktifler ad alanlarını _desteklemez_.

```angular-html {avoid}
<p app:Highlight>This is invalid</p>
```

## Bir nitelik direktifi uygulama

Direktifi uygulamak için, seçicisini bir elemana nitelik olarak ekleyin:

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.html" region="applied"/>

Angular o `<p>` elemanı için bir `HighlightDirective` örneği oluşturur, elemana bir referans enjekte eder ve arka planını sarıya ayarlar.

## Kullanıcı olaylarını işleme

Kullanıcı etkileşimine yanıt vermek için, host eleman olaylarını `@Directive()` dekoratörünün `host` özelliği aracılığıyla işleyici yöntemlere bağlayın. Aşağıdaki direktif, işaretçi üzerindeyken host elemanını vurgular ve işaretçi ayrıldığında vurgulamayı kaldırır:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts"/>

`host` özelliği, `mouseenter` ve `mouseleave` olaylarını, host elemanı üzerinde arka plan rengini ayarlayan bir `highlight()` yardımcısına devreden `onMouseEnter()` ve `onMouseLeave()` yöntemlerine eşler. Host olay bağlamaları hakkında daha fazla bilgi için [host elemanına bağlama](guide/components/host-elements#binding-to-the-host-element) bölümüne bakın.

## Girdi değerlerini kabul etme

Bileşenler gibi direktifler de [`input()`](guide/components/inputs) fonksiyonu aracılığıyla girdi kabul eder. Tek bir bağlamanın hem direktifi uygulaması hem de ona bir değer geçirmesi için girdiye seçiciyle aynı adı verin:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="input"/>

Girdiyi bir sinyal gibi çağırarak okuyun ve hiçbir renk ayarlanmadığında varsayılana geri dönün:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="mouse-enter"/>

Şablonda değeri seçiciye bağlayın. Girdi seçicinin adını paylaştığından, `[appHighlight]` hem direktifi uygular hem de değerini ayarlar. Burada bağlanan `color`, bileşen üzerindeki bir özelliktir:

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="color"/>

<docs-code header="app.component.ts" path="adev/src/content/examples/attribute-directives/src/app/app.component.ts" region="class"/>

Bir direktif birden fazla girdi tanımlayabilir. Aşağıdaki direktif bir `defaultColor` girdisi ekler ve sırasıyla `appHighlight`, `defaultColor` ve son olarak `red`'e geri döner:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts"/>

Her iki girdiyi de aynı elemana bağlayın. `defaultColor` dinamik bir ifade yerine statik bir string aldığından köşeli paranteze ihtiyaç duymaz:

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="defaultColor"/>

## `NgNonBindable` ile Angular işlemesini devre dışı bırakma

Tarayıcıda ifade değerlendirmesini önlemek için host elemanına `ngNonBindable` ekleyin.
`ngNonBindable`, şablonlardaki interpolasyonu, direktifleri ve bağlamayı devre dışı bırakır.

Aşağıdaki örnekte, `{{ 1 + 1 }}` ifadesi kod editörünüzdeki gibi render edilir ve `2` görüntülemez.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="ngNonBindable"/>

`ngNonBindable`'ı bir elemana uygulamak, o elemanın çocuk elemanları için bağlamayı durdurur.
Ancak, `ngNonBindable` yine de `ngNonBindable` uyguladığınız eleman üzerinde direktiflerin çalışmasına izin verir.
Aşağıdaki örnekte, `appHighlight` direktifi hala aktiftir ancak Angular `{{ 1 + 1 }}` ifadesini değerlendirmez.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="ngNonBindable-with-directive"/>

`ngNonBindable`'ı bir üst elemana uygularsanız, Angular elemanın çocukları için özellik bağlama veya olay bağlama gibi her türlü interpolasyonu ve bağlamayı devre dışı bırakır.

## Sırada ne var

<docs-pill-row>
  <docs-pill href="guide/directives/structural-directives" title="Yapısal direktifler"/>
  <docs-pill href="guide/directives/directive-composition-api" title="Direktif kompozisyon API'si"/>
</docs-pill-row>
