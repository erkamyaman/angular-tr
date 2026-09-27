# Angular'ın Animasyon paketinden geçiş

`@angular/animations` paketi v20.2 itibarıyla kullanım dışı bırakılmıştır (deprecated). Aynı sürümde uygulamanıza animasyonlar eklemek için yeni `animate.enter` ve `animate.leave` özelliği de tanıtılmıştır. Bu yeni özellikleri kullanarak, `@angular/animations` tabanlı tüm animasyonları düz CSS veya JS animasyon kütüphaneleri ile değiştirebilirsiniz. `@angular/animations`'i uygulamanızdan kaldırmak JavaScript paketinizin boyutunu önemli ölçüde azaltabilir. Yerel CSS animasyonları genellikle donanım hızlandırmasından yararlanabildikleri için üstün performans sunar. Bu rehber, kodunuzu `@angular/animations`'dan yerel CSS animasyonlarına yeniden düzenleme sürecini anlatır.

## Yerel CSS'de animasyonlar nasıl yazılır

Daha önce yerel CSS animasyonları yazmadıysanız, başlangıç için bir dizi mükemmel rehber vardır. Bunlardan birkaçı:
[MDN's CSS Animations guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
[W3Schools CSS3 Animations guide](https://www.w3schools.com/css/css3_animations.asp)
[The Complete CSS Animations Tutorial](https://www.lambdatest.com/blog/css-animations-tutorial/)
[CSS Animation for Beginners](https://thoughtbot.com/blog/css-animation-for-beginners)

ve birkaç video:
[Learn CSS Animation in 9 Minutes](https://www.youtube.com/watch?v=z2LQYsZhsFw)
[Net Ninja CSS Animation Tutorial Playlist](https://www.youtube.com/watch?v=jgw82b5Y2MU&list=PL4cUxeGkcC9iGYgmEd2dm3zAKzyCGDtM5)

Bu çeşitli rehber ve eğitimlerin bazılarına göz atın, ardından bu rehbere geri dönün.

## Yeniden kullanılabilir animasyonlar oluşturma

Animasyon paketinde olduğu gibi, uygulamanız genelinde paylaşabileceğiniz yeniden kullanılabilir animasyonlar oluşturabilirsiniz. Animasyon paketinin sürümü, paylaşılmış bir TypeScript dosyasında `animation()` fonksiyonunu kullanmanızı gerektiriyordu. Yerel CSS sürümü benzerdir, ancak paylaşılmış bir CSS dosyasında yer alır.

#### Animasyon paketiyle

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="animation-example"/>

#### Yerel CSS ile

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-shared"/>

`animated-class` sınıfını bir elemana eklemek, o eleman üzerinde animasyonu tetikler.

## Bir geçişi animasyonlama

### Durum ve stilleri animasyonlama

Animasyon paketi, bir bileşen içinde [`state()`](api/animations/state) fonksiyonunu kullanarak çeşitli durumlar tanımlamanıza izin veriyordu. Örnekler, her ilgili durumun tanımında yer alan stillerle birlikte `open` veya `closed` durumu olabilir. Örneğin:

#### Animasyon paketiyle {#animating-state-and-styles-with-animations-package}

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state1"/>

Aynı davranış, anahtar kare animasyonu veya geçiş stili kullanan CSS sınıfları ile yerel olarak gerçekleştirilebilir.

#### Yerel CSS ile {#animating-state-and-styles-with-native-css}

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-states"/>

`open` veya `closed` durumunu tetiklemek, bileşeninizdeki eleman üzerinde sınıfları değiştirerek yapılır. Bunu nasıl yapacağınıza dair örnekleri [şablon rehberimizde](guide/templates/binding#css-class-and-style-property-bindings) bulabilirsiniz.

[Stilleri doğrudan animasyonlama](guide/templates/binding#css-stil-özellikleri) için şablon rehberinde benzer örnekler görebilirsiniz.

### Geçişler, zamanlama ve yumuşatma

Animasyon paketinin `animate()` fonksiyonu, süre, gecikme ve yumuşaklık gibi zamanlama sağlamanıza olanak tanır. Bu, CSS'de birçok CSS özelliği veya kısayol özellikleri kullanılarak yerel olarak yapılabilir.

CSS'de bir anahtar kare animasyonu için `animation-duration`, `animation-delay` ve `animation-timing-function` belirtin veya alternatif olarak `animation` kısayol özelliğini kullanın.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-timing"/>

Benzer şekilde, `@keyframes` kullanmayan animasyonlar için `transition-duration`, `transition-delay`, `transition-timing-function` ve `transition` kısayolunu kullanabilirsiniz.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="transition-timing"/>

### Bir animasyonu tetikleme

Animasyon paketi, `trigger()` fonksiyonunu kullanarak tetikleyiciler belirtmeyi ve tüm durumlarınızı onun içinde iç içe yerleştirmeyi gerektiriyordu. Yerel CSS ile buna gerek yoktur. Animasyonlar CSS stilleri veya sınıfları değiştirerek tetiklenebilir. Bir sınıf bir elemanda mevcut olduğunda, animasyon gerçekleşir. Sınıfı kaldırmak, elemanı o eleman için tanımlanmış CSS'e geri döndürecektir. Bu, aynı animasyonu yapmak için önemli ölçüde daha az kodla sonuçlanır. İşte bir örnek:

#### Animasyon paketiyle {#triggering-an-animation-with-animations-package}

<docs-code-multifile>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/animations-package/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/animations-package/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/animations-package/open-close.css"/>
</docs-code-multifile>

#### Yerel CSS ile {#triggering-an-animation-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.ts">
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.css"/>
</docs-code-multifile>

## Geçiş ve tetikleyiciler

### Önceden tanımlanmış durum ve joker karakter eşleştirme

Animasyon paketi, tanımladığınız durumları dizeler aracılığıyla bir geçişle eşleştirme yeteneğini sunuyordu. Örneğin, açıktan kapalıya animasyonlamak `open => closed` şeklinde olurdu. Herhangi bir durumu hedef durumla eşleştirmek için `* => closed` gibi joker karakterler kullanabilirsiniz ve giriş ve çıkış durumları için `void` anahtar sözcüğü kullanılabilir. Örneğin: bir eleman görünümden ayrılırken `* => void` veya eleman görünüme girerken `void => *`.

Bu durum eşleme kalıpları, doğrudan CSS ile animasyon yaparken hiç gerekli değildir. Elemanlara ayarladığınız sınıflara ve/veya stillere göre hangi geçişlerin ve `@keyframes` animasyonlarının uygulanacağını yönetebilirsiniz. Ayrıca elemanın DOM'a girdiği andaki görünümünü kontrol etmek için `@starting-style` ekleyebilirsiniz.

### Joker karakterlerle otomatik özellik hesaplama

Animasyon paketi, `height: auto`'ya animasyon yapmak gibi tarihsel olarak animasyonlanması zor olan şeyleri animasyonlama yeteneğini sunuyordu. Artık bunu saf CSS ile de yapabilirsiniz.

#### Animasyon paketiyle {#automatic-property-calculation-with-animations-package}

<docs-code-multifile>
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.css" />
</docs-code-multifile>

Otomatik yüksekliğe animasyon yapmak için CSS Grid kullanabilirsiniz.

#### Yerel CSS ile {#automatic-property-calculation-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts">
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.css"  />
</docs-code-multifile>

Tüm tarayıcıları destekleme konusunda endişelenmeniz gerekmiyorsa, otomatik yüksekliğe animasyon yapmanın gerçek çözümü olan `calc-size()`'i da inceleyebilirsiniz. Daha fazla bilgi için [MDN belgelerine](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) ve (bu eğitime)[https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/] bakın.

### Görünüme giriş ve çıkış animasyonu

Animasyon paketi, giriş ve çıkış için daha önce bahsedilen kalıp eşlemeyi sunuyordu ve ayrıca `:enter` ve `:leave` kısayol takma adlarını da içeriyordu.

#### Animasyon paketiyle {#enter-and-leave-with-animations-package}

<docs-code-multifile>
    <docs-code header="insert-remove.ts" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.ts" />
    <docs-code header="insert-remove.html" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.html" />
    <docs-code header="insert-remove.css" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.css" />
</docs-code-multifile>

#### Yerel CSS ile {#enter-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.ts">
    <docs-code header="insert.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.ts" />
    <docs-code header="insert.html" path="adev/src/content/examples/animations/src/app/native-css/insert.html" />
    <docs-code header="insert.css" path="adev/src/content/examples/animations/src/app/native-css/insert.css"  />
</docs-code-multifile>

#### Yerel CSS ile {#leave-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.ts">
    <docs-code header="remove.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.ts" />
    <docs-code header="remove.html" path="adev/src/content/examples/animations/src/app/native-css/remove.html" />
    <docs-code header="remove.css" path="adev/src/content/examples/animations/src/app/native-css/remove.css"  />
</docs-code-multifile>

`animate.enter` ve `animate.leave` hakkında daha fazla bilgi için [Giriş ve Çıkış animasyonları rehberine](guide/animations) bakın.

### Artırma ve azaltma animasyonu

Daha önce bahsedilen `:enter` ve `:leave`'e ek olarak, `:increment` ve `:decrement` de vardır. Bunları da sınıflar ekleyip kaldırarak animasyonlayabilirsiniz. Animasyon paketinin yerleşik takma adlarının aksine, değerler yukarı veya aşağı gittiğinde sınıfların otomatik olarak uygulanması yoktur. Uygun sınıfları programatik olarak uygulayabilirsiniz. İşte bir örnek:

#### Animasyon paketiyle {#increment-and-decrement-with-animations-package}

<docs-code-multifile>
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.css" />
</docs-code-multifile>

#### Yerel CSS ile {#increment-and-decrement-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts">
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.css" />
</docs-code-multifile>

### Üst / Alt animasyonlar

Animasyon paketinden farklı olarak, belirli bir bileşen içinde birden fazla animasyon belirlendiğinde, hiçbir animasyonun diğerine önceliği yoktur ve hiçbir şey herhangi bir animasyonun çalışmasını engellemez. Animasyonların sıralanması, CSS animasyonunuzun tanımı, animasyon/geçiş gecikmesi ve/veya sonraki animasyonlanacak CSS'i eklemeyi işlemek için `animationend` veya `transitionend` kullanılarak yönetilmelidir.

Alt animasyonlar yalnızca aynı bileşen şablonu içinde çalışır. `@angular/animations` paketinde üst animasyonlar, `query()` ve `animateChild()` kullanarak iç içe alt bileşenlerdeki animasyonları sorgulayıp tetikleyebiliyordu. `animate.leave` ve yerel CSS animasyonlarıyla, iç içe alt bileşen şablonlarında tanımlanan animasyonlar, bir üst bileşen bir elemanı veya görünümü kaldırdığında çalışmaz. Yalnızca aynı Angular bileşen şablonu içindeki iç içe animasyonlar yürütülür. Bu konuda daha fazla bilgi için [Giriş ve Çıkış animasyonları rehberine](guide/animations#element-removal-order) bakın.

### Bir animasyonu veya tüm animasyonları devre dışı bırakma

Yerel CSS animasyonlarıyla, belirttiğiniz animasyonları devre dışı bırakmak istiyorsanız, birden fazla seçeneğiniz vardır.

1. Animasyon ve geçişi `none` olarak zorlayan özel bir sınıf oluşturun.

```css
.no-animation {
  animation: none !important;
  transition: none !important;
}
```

Bu sınıfı bir elemana uygulamak, o eleman üzerindeki herhangi bir animasyonun çalışmasını engeller. Alternatif olarak, bu davranışı uygulamak için bunu tüm DOM'unuza veya DOM'unuzun bir bölümüne kapsayabilirsiniz. Ancak bu, animasyon olaylarının çalışmasını engeller. Eleman kaldırma için animasyon olaylarını bekliyorsanız, bu çözüm işe yaramaz. Geçici bir çözüm, süreleri 1 milisaniyeye ayarlamaktır.

2. Daha az animasyon tercih eden kullanıcılar için hiçbir animasyonun çalmamasını sağlamak için [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) medya sorgusunu kullanın.

3. Programatik olarak animasyon sınıfları eklemeyi engelleyin

### Animasyon geri çağırmaları

Animasyon paketi, animasyon bittiğinde bir şeyler yapmak istemeniz durumunda kullanmanız için geri çağırmalar sunuyordu. Yerel CSS animasyonlarının da bu geri çağırmaları vardır.

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

Animasyon paketi karmaşık diziler oluşturmak için yerleşik işlevselliğe sahiptir. Bu dizilerin tümü animasyon paketi olmadan tamamen mümkündür.

### Belirli elemanları hedefleme

Animasyon paketinde, [`document.querySelector()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector)'a benzer bir CSS sınıf adı ile belirli elemanları bulmak için `query()` fonksiyonunu kullanarak belirli elemanları hedefleyebilirdiniz. Yerel CSS animasyon dünyasında buna gerek yoktur. Bunun yerine, alt sınıfları hedeflemek ve istediğiniz `transform` veya `animation`'i uygulamak için CSS seçicilerinizi kullanabilirsiniz.

Bir şablon içindeki alt düğümlerin sınıfları için değiştirmek için, animasyonları doğru noktalarda eklemek için sınıf ve stil bağlamalarını kullanabilirsiniz.

### Stagger()

`stagger()` fonksiyonu, kademeli bir etki oluşturmak için bir listedeki her öğenin animasyonunu belirtilen bir süre geciktirmenize olanak tanıyordu. Bu davranışı `animation-delay` veya `transition-delay` kullanarak yerel CSS'de kopyalayabilirsiniz. Bu CSS'nin nasıl görünebileceğine dair bir örnek.

#### Animasyon paketiyle {#stagger-with-animations-package}

<docs-code-multifile>
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/animations-package/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/animations-package/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/animations-package/stagger.css" />
</docs-code-multifile>

#### Yerel CSS ile {#stagger-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.ts">
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.css" />
</docs-code-multifile>

### Paralel animasyonlar

Animasyon paketinde aynı anda birden fazla animasyon oynatmak için `group()` fonksiyonu vardır. CSS'de animasyon zamanlaması üzerinde tam kontrol sahibisiniz. Tanımlanmış birden fazla animasyonunuz varsa, hepsini aynı anda uygulayabilirsiniz.

```css
.target-element {
  animation:
    rotate 3s,
    fade-in 2s;
}
```

Bu örnekte, `rotate` ve `fade-in` animasyonları aynı anda başlar.

### Yeniden sıralanan listenin öğelerini animasyonlama

Listede yeniden sıralanan öğeler, daha önce açıklanan teknikleri kullanarak kutudan çıkar çıkmaz çalışır. Ek özel bir çalışma gerekmez. Bir `@for` döngüsündeki öğeler düzgün şekilde kaldırılıp yeniden eklenecek, bu da giriş animasyonları için `@starting-styles` kullanılarak animasyonları tetikleyecektir. Alternatif olarak, aynı davranış için `animate.enter` kullanabilirsiniz. Yukarıdaki örnekte görüldüğü gibi elemanlar kaldırılırken animasyonlamak için `animate.leave` kullanın.

#### Animasyon paketiyle {#reordering-list-with-animations-package}

<docs-code-multifile>
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/animations-package/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/animations-package/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/animations-package/reorder.css" />
</docs-code-multifile>

#### Yerel CSS ile {#reordering-list-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.ts">
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.css" />
</docs-code-multifile>

## AnimationPlayer kullanımlarını taşıma

`AnimationPlayer` sınıfı, duraklatma, oynatma, yeniden başlatma ve bir animasyonu kod aracılığıyla bitirme gibi daha gelişmiş şeyler yapabilmek için bir animasyona erişim sağlar. Tüm bunlar yerel olarak da ele alınabilir.

[`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations) kullanarak bir elemandaki animasyonları doğrudan alabilirsiniz. Bu, o elemandaki her [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation)'in bir dizisini döndürür. Animasyon paketinin `AnimationPlayer`'ının sunduğu şeylerden çok daha fazlasını yapmak için `Animation` API'sini kullanabilirsiniz. Buradan `cancel()`, `play()`, `pause()`, `reverse()` ve çok daha fazlasını yapabilirsiniz. Bu yerel API, animasyonlarınızı kontrol etmeniz için ihtiyacınız olan her şeyi sağlamalıdır.

## Rota geçişleri

Rotalar arasında animasyon yapmak için görünüm geçişlerini kullanabilirsiniz. Başlamak için [Rota Geçiş Animasyonları Rehberine](guide/routing/route-transition-animations) bakın.
