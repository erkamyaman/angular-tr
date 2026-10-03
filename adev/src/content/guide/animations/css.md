# CSS ile uygulamanızı animasyonlama

CSS, uygulamanızda güzel ve ilgi çekici animasyonlar oluşturmanız için güçlü bir araç seti sunar.

## Yerel CSS'de animasyonlar nasıl yazılır

Daha önce yerel CSS animasyonları yazmadıysanız, başlangıç için bir dizi mükemmel rehber vardır. Bunlardan birkaçı:
[MDN CSS Animasyonları rehberi](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
[W3Schools CSS3 Animasyonları rehberi](https://www.w3schools.com/css/css3_animations.asp)
[Eksiksiz CSS Animasyonları Eğitimi](https://www.lambdatest.com/blog/css-animations-tutorial/)
[Yeni Başlayanlar İçin CSS Animasyonu](https://thoughtbot.com/blog/css-animation-for-beginners)

ve birkaç video:
[9 Dakikada CSS Animasyonu Öğrenin](https://www.youtube.com/watch?v=z2LQYsZhsFw)
[Net Ninja CSS Animasyon Eğitimi Oynatma Listesi](https://www.youtube.com/watch?v=jgw82b5Y2MU&list=PL4cUxeGkcC9iGYgmEd2dm3zAKzyCGDtM5)

Bu çeşitli rehber ve eğitimlerin bazılarına göz atın, ardından bu rehbere geri dönün.

## Yeniden kullanılabilir animasyonlar oluşturma

`@keyframes` kullanarak uygulamanız genelinde paylaşabileceğiniz yeniden kullanılabilir animasyonlar oluşturabilirsiniz. Paylaşılmış bir CSS dosyasında anahtar kare animasyonları tanımlayın ve uygulamanızda istediğiniz her yerde bu anahtar kare animasyonlarını yeniden kullanabileceksiniz.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-shared"/>

`animated-class` sınıfını bir elemana eklemek, o eleman üzerinde animasyonu tetikler.

## Bir geçişi animasyonlama

### Durum ve stilleri animasyonlama

İki farklı durum arasında animasyon yapmak isteyebilirsiniz, örneğin bir eleman açıldığında veya kapatıldığında. Bunu anahtar kare animasyonu veya geçiş stili kullanarak CSS sınıflarıyla gerçekleştirebilirsiniz.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-states"/>

`open` veya `closed` durumunu tetiklemek, bileşeninizdeki eleman üzerinde sınıfları değiştirerek yapılır. Bunu nasıl yapacağınıza dair örnekleri [şablon rehberimizde](guide/templates/binding#css-class-and-style-property-bindings) bulabilirsiniz.

[Stilleri doğrudan animasyonlama](guide/templates/binding#css-stil-özellikleri) için şablon rehberinde benzer örnekler görebilirsiniz.

### Geçişler, zamanlama ve yumuşatma

Animasyon genellikle zamanlama, gecikme ve yumuşaklık davranışlarını ayarlamayı gerektirir. Bu, birçok CSS özelliği veya kısayol özellikleri kullanılarak yapılabilir.

CSS'de bir anahtar kare animasyonu için `animation-duration`, `animation-delay` ve `animation-timing-function` belirtin veya alternatif olarak `animation` kısayol özelliğini kullanın.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-timing"/>

Benzer şekilde, `@keyframes` kullanmayan animasyonlar için `transition-duration`, `transition-delay`, `transition-timing-function` ve `transition` kısayolunu kullanabilirsiniz.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="transition-timing"/>

### Bir animasyonu tetikleme

Animasyonlar CSS stilleri veya sınıfları değiştirerek tetiklenebilir. Bir sınıf bir elemanda mevcut olduğunda, animasyon gerçekleşir. Sınıfı kaldırmak, elemanı o eleman için tanımlanmış CSS'e geri döndürecektir. İşte bir örnek:

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.ts">
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.css"/>
</docs-code-multifile>

## Geçiş ve tetikleyiciler

### Otomatik yüksekliği animasyonlama

Otomatik yüksekliğe animasyon yapmak için CSS Grid kullanabilirsiniz.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts">
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.css"  />
</docs-code-multifile>

Tüm tarayıcıları destekleme konusunda endişelenmeniz gerekmiyorsa, otomatik yüksekliğe animasyon yapmanın gerçek çözümü olan `calc-size()`'i da inceleyebilirsiniz. Daha fazla bilgi için [MDN belgelerine](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) ve [bu eğitime](https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/) bakın.

### Görünüme giriş ve çıkış animasyonu

Bir öğe görünüme girdiğinde veya görünümden ayrıldığında animasyonlar oluşturabilirsiniz. Bir elemanın görünüme girişini animasyonlamaya bakalım. Bunu, eleman görünüme girdiğinde animasyon sınıfları uygulayacak olan `animate.enter` ile yapacağız.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.ts">
    <docs-code header="insert.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.ts" />
    <docs-code header="insert.html" path="adev/src/content/examples/animations/src/app/native-css/insert.html" />
    <docs-code header="insert.css" path="adev/src/content/examples/animations/src/app/native-css/insert.css"  />
</docs-code-multifile>

Bir elemanın görünümden ayrılırken animasyonlanması, görünüme girerken animasyonlamaya benzer. Eleman görünümden ayrılırken hangi CSS sınıflarının uygulanacağını belirtmek için `animate.leave` kullanın.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.ts">
    <docs-code header="remove.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.ts" />
    <docs-code header="remove.html" path="adev/src/content/examples/animations/src/app/native-css/remove.html" />
    <docs-code header="remove.css" path="adev/src/content/examples/animations/src/app/native-css/remove.css"  />
</docs-code-multifile>

NOTE: Alt `animate.leave` animasyonları yalnızca aynı bileşen şablonu içinde tetiklenir. Bir üst eleman kaldırıldığında iç içe bileşenlerdeki `animate.leave` animasyonları tetiklenmez.

`animate.enter` ve `animate.leave` hakkında daha fazla bilgi için [Giriş ve Çıkış animasyonları rehberine](guide/animations) bakın.

### Artırma ve azaltma animasyonu

Artırma ve azaltmada animasyon uygulamalarda yaygın bir kalıptır. Bu davranışı nasıl gerçekleştirebileceğinize dair bir örnek.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts">
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.css" />
</docs-code-multifile>

### Bir animasyonu veya tüm animasyonları devre dışı bırakma

Belirttiğiniz animasyonları devre dışı bırakmak istiyorsanız, birden fazla seçeneğiniz vardır.

1. Animasyon ve geçişi `none` olarak zorlayan özel bir sınıf oluşturun.

```css
.no-animation {
  animation: none !important;
  transition: none !important;
}
```

Bu sınıfı bir elemana uygulamak, o eleman üzerindeki herhangi bir animasyonun çalışmasını engeller. Alternatif olarak, bu davranışı uygulamak için bunu tüm DOM'unuza veya DOM'unuzun bir bölümüne kapsayabilirsiniz. Ancak bu, animasyon olaylarının çalışmasını engeller. Eleman kaldırma için animasyon olaylarını bekliyorsanız, bu çözüm işe yaramaz. Geçici bir çözüm, süreleri 1 milisaniyeye ayarlamaktır.

2. Daha az animasyon tercih eden kullanıcılar için hiçbir animasyonun çalışmamasını sağlamak için [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) medya sorgusunu kullanın.

3. Programatik olarak animasyon sınıfları eklemeyi engelleyin

### Animasyon geri çağırmaları

Animasyonlar sırasında belirli noktalarda yürütmek istediğiniz eylemleriniz varsa, dinleyebileceğiniz bir dizi mevcut olay vardır. Birkaçı:

[`OnAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event)
[`OnAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event)
[`OnAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event)
[`OnAnimationCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event)

[`OnTransitionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event)
[`OnTransitionRun`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event)
[`OnTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)
[`OnTransitionCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event)

Web Animations API birçok ek işlev sunar. Mevcut tüm animasyon API'lerini görmek için [belgelere göz atın](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).

NOTE: Bu geri çağırmalarla kabarcıklanma sorunlarına dikkat edin. Alt ve üst elemanları animasyonluyorsanız, olaylar alt elemanlardan üst elemanlara doğru kabarcıklanır. Bir alt düğümden kabarcıklanan bir olaya değil, istediğiniz olay hedefine yanıt verdiğinizden emin olmak için yayılımı durdurun veya olay içindeki daha fazla ayrıntı inceleyin. Doğru düğümlere sahip olduğunuzu doğrulamak için `animationname` özelliğini veya geçişi yapılan özellikleri inceleyebilirsiniz.

## Karmaşık diziler

Animasyonlar genellikle basit bir fade in veya fade out'tan daha karmaşıktır. Çalıştırmak isteyeceğiniz birçok karmaşık animasyon dizisi olabilir. Bu olası senaryoların bazılarına göz atalım.

### Listede kademeli animasyonlar

Yaygın efektlerden biri, kademeli bir etki oluşturmak için listedeki her öğenin animasyonlarını kademelileştirmektir. Bu, `animation-delay` veya `transition-delay` kullanılarak gerçekleştirilebilir. Bu CSS'nin nasıl görünebileceğine dair bir örnek.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.ts">
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.css" />
</docs-code-multifile>

### Paralel animasyonlar

`animation` kısayol özelliğini kullanarak bir elemana aynı anda birden fazla animasyon uygulayabilirsiniz. Her birinin kendi süresi ve gecikmesi olabilir. Bu, animasyonları bir araya getirmenize ve karmaşık efektler oluşturmanıza olanak tanır.

```css
.target-element {
  animation:
    rotate 3s,
    fade-in 2s;
}
```

Bu örnekte, `rotate` ve `fade-in` animasyonları aynı anda başlar, ancak farklı sürelere sahiptir.

### Yeniden sıralanan listenin öğelerini animasyonlama

Bir `@for` döngüsündeki öğeler kaldırılıp yeniden eklenecek, bu da giriş animasyonları için `@starting-styles` kullanılarak animasyonları tetikleyecektir. Alternatif olarak, aynı davranış için `animate.enter` kullanabilirsiniz. Aşağıdaki örnekte görüldüğü gibi elemanlar kaldırılırken animasyonlamak için `animate.leave` kullanın.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.ts">
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.css" />
</docs-code-multifile>

## Animasyonların programatik kontrolü

[`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations) kullanarak bir elemandaki animasyonları doğrudan alabilirsiniz. Bu, o elemandaki her [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation)'ın bir dizisini döndürür. Animasyon paketinin `AnimationPlayer`'inin sunduğu şeylerden çok daha fazlasını yapmak için `Animation` API'sini kullanabilirsiniz. Buradan `cancel()`, `play()`, `pause()`, `reverse()` ve çok daha fazlasını yapabilirsiniz. Bu yerel API, animasyonlarınızı kontrol etmeniz için ihtiyacınız olan her şeyi sağlamalıdır.

## Angular animasyonları hakkında daha fazla bilgi

Aşağıdakilerle de ilgilenebilirsiniz:

<docs-pill-row>
  <docs-pill href="guide/animations" title="Angular Animasyonlarına Giriş"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route Geçiş Animasyonları"/>
</docs-pill-row>
