# Migrating away from Angular's Animations package

`@angular/animations` paketi v20.2 itibariyla kullanim disi birakilmistir (deprecated). Ayni surumde uygulamaniza animasyonlar eklemek icin yeni `animate.enter` ve `animate.leave` ozelligi de tanitilmistir. Bu yeni ozellikleri kullanarak, `@angular/animations` tabanli tum animasyonlari duz CSS veya JS animasyon kutuphaneleri ile degistirebilirsiniz. `@angular/animations`'i uygulamanizdan kaldirmak JavaScript paketinizin boyutunu onemli olcude azaltabilir. Yerel CSS animasyonlari genellikle donanim hizlandirmasindan yararlanabildiikleri icin ustun performans sunar. Bu rehber, kodunuzu `@angular/animations`'dan yerel CSS animasyonlarina yeniden duzenleme surecini anlatir.

## How to write animations in native CSS

Daha once yerel CSS animasyonlari yazmadiysaniz, baslangic icin bir dizi mukemmel rehber vardir. Bunlardan birkaci:
[MDN's CSS Animations guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
[W3Schools CSS3 Animations guide](https://www.w3schools.com/css/css3_animations.asp)
[The Complete CSS Animations Tutorial](https://www.lambdatest.com/blog/css-animations-tutorial/)
[CSS Animation for Beginners](https://thoughtbot.com/blog/css-animation-for-beginners)

ve birkaç video:
[Learn CSS Animation in 9 Minutes](https://www.youtube.com/watch?v=z2LQYsZhsFw)
[Net Ninja CSS Animation Tutorial Playlist](https://www.youtube.com/watch?v=jgw82b5Y2MU&list=PL4cUxeGkcC9iGYgmEd2dm3zAKzyCGDtM5)

Bu cesitli rehber ve egitimlerin bazilarina goz atin, ardindan bu rehbere geri donun.

## Creating Reusable Animations

Animasyon paketinde oldugu gibi, uygulamaniz genelinde paylasabileceginiz yeniden kullanilabilir animasyonlar olusturabilirsiniz. Animasyon paketinin surumu, paylasilmis bir TypeScript dosyasinda `animation()` fonksiyonunu kullanmanizi gerektiriyordu. Yerel CSS surumu benzerdir, ancak paylasilmis bir CSS dosyasinda yer alir.

#### With Animations Package

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="animation-example"/>

#### With Native CSS

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-shared"/>

`animated-class` sinifini bir elemana eklemek, o eleman uzerinde animasyonu tetikler.

## Animating a Transition

### Animating State and Styles

Animasyon paketi, bir bilesen icinde [`state()`](api/animations/state) fonksiyonunu kullanarak cesitli durumlar tanimlmaniza izin veriyordu. Ornekler, her ilgili durumun taniminda yer alan stillerle birlikte `open` veya `closed` durumu olabilir. Ornegin:

#### With Animations Package

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state1"/>

Ayni davranis, anahtar kare animasyonu veya gecis stili kullanan CSS siniflari ile yerel olarak gerceklestirilebilir.

#### With Native CSS

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-states"/>

`open` veya `closed` durumunu tetiklemek, bileseninizdeki eleman uzerinde siniflari degistirerek yapilir. Bunu nasil yapacaginiza dair ornekleri [sablon rehberimizde](guide/templates/binding#css-class-and-style-property-bindings) bulabilirsiniz.

[Stilleri dogrudan animasyonlama](guide/templates/binding#css-style-properties) icin sablon rehberinde benzer ornekler gorebilirsiniz.

### Transitions, Timing, and Easing

Animasyon paketinin `animate()` fonksiyonu, sure, gecikme ve yumusaklik gibi zamanlama saglamaniza olanak tanir. Bu, CSS'de bircak CSS ozelligi veya kisayol ozellikleri kullanilarak yerel olarak yapilabilir.

CSS'de bir anahtar kare animasyonu icin `animation-duration`, `animation-delay` ve `animation-timing-function` belirtin veya alternatif olarak `animation` kisayol ozelligini kullanin.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-timing"/>

Benzer sekilde, `@keyframes` kullanmayan animasyonlar icin `transition-duration`, `transition-delay`, `transition-timing-function` ve `transition` kisayolunu kullanabilirsiniz.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="transition-timing"/>

### Triggering an Animation

Animasyon paketi, `trigger()` fonksiyonunu kullanarak tetikleyiciler belirtmeyi ve tum durumlarinizi onun icinde ic ice yerlestirmeyi gerektiriyordu. Yerel CSS ile buna gerek yoktur. Animasyonlar CSS stilleri veya siniflari degistirerek tetiklenebilir. Bir sinif bir elemanda mevcut oldigunda, animasyon gerceklesir. Sinifi kaldirmak, elemani o eleman icin tanimlanmis CSS'e geri dondurecektir. Bu, ayni animasyonu yapmak icin onemli olcude daha az kodla sonuclanir. Iste bir ornek:

#### With Animations Package

<docs-code-multifile>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/animations-package/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/animations-package/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/animations-package/open-close.css"/>
</docs-code-multifile>

#### With Native CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.ts">
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.css"/>
</docs-code-multifile>

## Transition and Triggers

### Predefined State and wildcard matching

Animasyon paketi, tanimladiginiz durumlari dizeler araciligiyla bir gecisle eslestirme yetenegini sunuyordu. Ornegin, aciktan kapaliya animasyonlamak `open => closed` seklinde olurdu. Herhangi bir durumu hedef durumla eslestirmek icin `* => closed` gibi joker karakterler kullanabilirsiniz ve giris ve cikis durumlari icin `void` anahtar sozcugu kullanilabilir. Ornegin: bir eleman gorünumden ayrilirken `* => void` veya eleman gorünume girerken `void => *`.

Bu durum esleme kaliplari, dogrudan CSS ile animasyon yaparken hic gerekli degildir. Elemanlara ayarladiginiz siniflara ve/veya stillere gore hangi gecislerin ve `@keyframes` animasyonlarinin uygulanacagini yonetebilirsiniz. Ayrica elemanin DOM'a girdigi andaki gorunumunu kontrol etmek icin `@starting-style` ekleyebilirsiniz.

### Automatic Property Calculation with Wildcards

Animasyon paketi, `height: auto`'ya animasyon yapmak gibi tarihsel olarak animasyonlanmasi zor olan seyleri animasyonlama yetenegini sunuyordu. Artik bunu saf CSS ile de yapabilirsiniz.

#### With Animations Package

<docs-code-multifile>
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.css" />
</docs-code-multifile>

Otomatik yukseklige animasyon yapmak icin css-grid kullanabilirsiniz.

#### With Native CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts">
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.css"  />
</docs-code-multifile>

Tum tarayicilari destekleme konusunda endiselenmeniz gerekmiyorsa, otomatik yukseklige animasyon yapmanin gercek cozumu olan `calc-size()`'i da inceleyebilirsiniz. Daha fazla bilgi icin [MDN belgelerine](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) ve (bu egitime)[https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/] bakin.

### Animate entering and leaving a view

Animasyon paketi, giris ve cikis icin daha once bahsedilen kalip eslemeyi sunuyordu ve ayrica `:enter` ve `:leave` kisayol takma adlarini da iceriyordu.

#### With Animations Package

<docs-code-multifile>
    <docs-code header="insert-remove.ts" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.ts" />
    <docs-code header="insert-remove.html" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.html" />
    <docs-code header="insert-remove.css" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.css" />
</docs-code-multifile>

#### With Native CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.ts">
    <docs-code header="insert.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.ts" />
    <docs-code header="insert.html" path="adev/src/content/examples/animations/src/app/native-css/insert.html" />
    <docs-code header="insert.css" path="adev/src/content/examples/animations/src/app/native-css/insert.css"  />
</docs-code-multifile>

#### With Native CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.ts">
    <docs-code header="remove.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.ts" />
    <docs-code header="remove.html" path="adev/src/content/examples/animations/src/app/native-css/remove.html" />
    <docs-code header="remove.css" path="adev/src/content/examples/animations/src/app/native-css/remove.css"  />
</docs-code-multifile>

`animate.enter` ve `animate.leave` hakkinda daha fazla bilgi icin [Giris ve Cikis animasyonlari rehberine](guide/animations) bakin.

### Animating increment and decrement

Daha once bahsedilen `:enter` ve `:leave`'e ek olarak, `:increment` ve `:decrement` de vardir. Bunlari da siniflar ekleyip kaldirarak animasyonlayabilirsiniz. Animasyon paketinin yerlesik takma adlarinin aksine, degerler yukarı veya asagi gittiginde siniflarin otomatik olarak uygulanmasi yoktur. Uygun siniflari programatik olarak uygulayabilirsiniz. Iste bir ornek:

#### With Animations Package

<docs-code-multifile>
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.css" />
</docs-code-multifile>

#### With Native CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts">
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.css" />
</docs-code-multifile>

### Parent / Child Animations

Animasyon paketinden farkli olarak, belirli bir bilesen icinde birden fazla animasyon belirlendiginde, hicbir animasyonun digerine onceligi yoktur ve hicbir sey herhangi bir animasyonun calismesini engellemez. Animasyonlarin siralanmasi, CSS animasyonunuzun tanimi, animasyon/gecis gecikmesi ve/veya sonraki animasyonlanacak CSS'i eklemeyi islemek icin `animationend` veya `transitionend` kullanilarak yonetilmelidir.

### Disabling an animation or all animations

Yerel CSS animasyonlariyla, belirttiginiz animasyonlari devre disi birakmak istiyorsaniz, birden fazla seceeneginiz vardir.

1. Animasyon ve gecisi `none` olarak zorlayan ozel bir sinif olusturun.

```css
.no-animation {
  animation: none !important;
  transition: none !important;
}
```

Bu sinifi bir elemana uygulamak, o eleman uzerindeki herhangi bir animasyonun calismesini engeller. Alternatif olarak, bu davranisi uygulamak icin bunu tum DOM'unuza veya DOM'unuzun bir bolumune kapsayabilirsiniz. Ancak bu, animasyon olaylarinin calismesini engeller. Eleman kaldirma icin animasyon olaylarini bekliyorsaniz, bu cozum ise yaramaz. Gecici bir cozum, sureleri 1 milisaniyeye ayarlamaktir.

2. Daha az animasyon tercih eden kullanicilar icin hicbir animasyonun calmamasini saglamak icin [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) medya sorgusunu kullanin.

3. Programatik olarak animasyon siniflari eklemeyi engelleyin

### Animation Callbacks

Animasyon paketi, animasyon bittiginde bir seyler yapmak istemeniz durumunda kullanmaniz icin geri cagirmalar sunuyordu. Yerel CSS animasyonlarinin da bu geri cagirmalari vardir.

[`OnAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event)
[`OnAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event)
[`OnAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationitration_event)
[`OnAnimationCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event)

[`OnTransitionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event)
[`OnTransitionRun`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event)
[`OnTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)
[`OnTransitionCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event)

Web Animations API bircok ek islev sunar. Mevcut tum animasyon API'lerini gormek icin [belgelere goz atin](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).

NOTE: Bu geri cagirmalarla kabarciklanma sorunlarina dikkat edin. Alt ve ust elemanlari animasyonluyorsaniz, olaylar alt elemanlardan ust elemanlara dogru kabarciklanir. Bir alt dugumden kabarciklanan bir olaya degil, istediginiz olay hedefine yanit verdiginizden emin olmak icin yayilimi durdurun veya olay icindeki daha fazla ayrinti inceleyin. Dogru dugumlere sahip oldugunuzu dogrulamak icin `animationname` ozelligini veya gecisi yapilan ozellikleri inceleyebilirsiniz.

## Complex Sequences

Animasyon paketi karmasik diziler olusturmak icin yerlesik islevsellige sahiptir. Bu dizilerin tumu animasyon paketi olmadan tamamen mumkundur.

### Targeting specific elements

Animasyon paketinde, [`document.querySelector()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector)'a benzer bir CSS sinif adi ile belirli elemanlari bulmak icin `query()` fonksiyonunu kullanarak belirli elemanlari hedefleyebilirdiniz. Yerel CSS animasyon dunyasinda buna gerek yoktur. Bunun yerine, alt siniflari hedeflemek ve istediginiz `transform` veya `animation`'i uygulamak icin CSS secicilerinizi kullanabilirsiniz.

Bir sablon icindeki alt dugumlerin siniflari icin degistirmek icin, animasyonlari dogru noktalarda eklemek icin sinif ve stil baglamalarini kullanabilirsiniz.

### Stagger()

`stagger()` fonksiyonu, kademeli bir etki olusturmak icin bir listedeki her ogenin animasyonunu belirtilen bir sure geciktirmenize olanak taniyordu. Bu davranisi `animation-delay` veya `transition-delay` kullanarak yerel CSS'de kopyalayabilirsiniz. Bu CSS'nin nasil gorunebilecegine dair bir ornek.

#### With Animations Package

<docs-code-multifile>
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/animations-package/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/animations-package/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/animations-package/stagger.css" />
</docs-code-multifile>

#### With Native CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.ts">
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.css" />
</docs-code-multifile>

### Parallel Animations

Animasyon paketinde ayni anda birden fazla animasyon oynatmak icin `group()` fonksiyonu vardir. CSS'de animasyon zamanlamasi uzerinde tam kontrol sahibisiniz. Tanimlanmis birden fazla animasyonunuz varsa, hepsini ayni anda uygulayabilirsiniz.

```css
.target-element {
  animation:
    rotate 3s,
    fade-in 2s;
}
```

Bu ornekte, `rotate` ve `fade-in` animasyonlari ayni anda baslar.

### Animating the items of a reordering list

Listede yeniden siralanan ogeler, daha once aciklanan teknikleri kullanarak kutudan cikar cikmaz calisir. Ek ozel bir calisma gerekmez. Bir `@for` dongusundeki ogeler duzgun sekilde kaldirilip yeniden eklenecek, bu da giris animasyonlari icin `@starting-styles` kullanilarak animasyonlari tetikleyecektir. Alternatif olarak, ayni davranis icin `animate.enter` kullanabilirsiniz. Yukaridaki ornekte gorulduğu gibi elemanlar kaldirilirken animasyonlamak icin `animate.leave` kullanin.

#### With Animations Package

<docs-code-multifile>
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/animations-package/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/animations-package/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/animations-package/reorder.css" />
</docs-code-multifile>

#### With Native CSS

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.ts">
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.css" />
</docs-code-multifile>

## Migrating usages of AnimationPlayer

`AnimationPlayer` sinifi, duraklatma, oynatma, yeniden baslatma ve bir animasyonu kod araciligiyla bitirme gibi daha gelismis seyler yapabilmek icin bir animasyona erisim saglar. Tum bunlar yerel olarak da ele alinabilir.

[`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations) kullanarak bir elemandaki animasyonlari dogrudan alabilirsiniz. Bu, o elemandaki her [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation)'in bir dizisini dondurur. Animasyon paketinin `AnimationPlayer`'inin sundugu seylerden cok daha fazlasini yapmak icin `Animation` API'sini kullanabilirsiniz. Buradan `cancel()`, `play()`, `pause()`, `reverse()` ve cok daha fazlasini yapabilirsiniz. Bu yerel API, animasyonlarinizi kontrol etmeniz icin ihtiyaciniz olan her seyi saglamalidir.

## Route Transitions

Rotalar arasinda animasyon yapmak icin gorünum gecislerini kullanabilirsiniz. Baslamak icin [Rota Gecis Animasyonlari Rehberine](guide/routing/route-transition-animations) bakin.
