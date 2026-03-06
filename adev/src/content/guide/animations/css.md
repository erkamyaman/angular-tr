# CSS ile uygulamanızı animasyonlama

CSS, uygulamanizda guzel ve ilgi cekici animasyonlar olusturmaniz icin guclu bir arac seti sunar.

## Yerel CSS'de animasyonlar nasıl yazılır

Daha once yerel CSS animasyonlari yazmadiysaniz, baslangic icin bir dizi mukemmel rehber vardir. Bunlardan biraci:
[MDN's CSS Animations guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
[W3Schools CSS3 Animations guide](https://www.w3schools.com/css/css3_animations.asp)
[The Complete CSS Animations Tutorial](https://www.lambdatest.com/blog/css-animations-tutorial/)
[CSS Animation for Beginners](https://thoughtbot.com/blog/css-animation-for-beginners)

ve birkaç video:
[Learn CSS Animation in 9 Minutes](https://www.youtube.com/watch?v=z2LQYsZhsFw)
[Net Ninja CSS Animation Tutorial Playlist](https://www.youtube.com/watch?v=jgw82b5Y2MU&list=PL4cUxeGkcC9iGYgmEd2dm3zAKzyCGDtM5)

Bu cesitli rehber ve egitimlerin bazilarina goz atin, ardindan bu rehbere geri donun.

## Yeniden kullanılabilir animasyonlar oluşturma

`@keyframes` kullanarak uygulamaniz genelinde paylasabileceginiz yeniden kullanilabilir animasyonlar olusturabilirsiniz. Paylasilmis bir CSS dosyasinda anahtar kare animasyonlari tanimlayin ve uygulamanizda istediginiz her yerde bu anahtar kare animasyonlarini yeniden kullanabileceksiniz.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-shared"/>

`animated-class` sinifini bir elemana eklemek, o eleman uzerinde animasyonu tetikler.

## Bir geçişi animasyonlama

### Durum ve stilleri animasyonlama

Iki farkli durum arasinda animasyon yapmak isteyebilirsiniz, ornegin bir eleman acildiginda veya kapatildiginda. Bunu anahtar kare animasyonu veya gecis stili kullanarak CSS siniflariyla gerceklestirebilirsiniz.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-states"/>

`open` veya `closed` durumunu tetiklemek, bileseninizdeki eleman uzerinde siniflari degistirerek yapilir. Bunu nasil yapacaginiza dair ornekleri [sablon rehberimizde](guide/templates/binding#css-sınıfı-ve-stil-özelliği-bağlamaları) bulabilirsiniz.

[Stilleri dogrudan animasyonlama](guide/templates/binding#css-stil-özellikleri) icin sablon rehberinde benzer ornekler gorebilirsiniz.

### Geçişler, zamanlama ve yumuşatma

Animasyon genellikle zamanlama, gecikme ve yumusaklik davranislarini ayarlamayi gerektirir. Bu, bircok CSS ozelligi veya kisayol ozellikleri kullanilarak yapilabilir.

CSS'de bir anahtar kare animasyonu icin `animation-duration`, `animation-delay` ve `animation-timing-function` belirtin veya alternatif olarak `animation` kisayol ozelligini kullanin.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-timing"/>

Benzer sekilde, `@keyframes` kullanmayan animasyonlar icin `transition-duration`, `transition-delay`, `transition-timing-function` ve `transition` kisayolunu kullanabilirsiniz.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="transition-timing"/>

### Bir animasyonu tetikleme

Animasyonlar CSS stilleri veya siniflari degistirerek tetiklenebilir. Bir sinif bir elemanda mevcut oldigunda, animasyon gerceklesir. Sinifi kaldirmak, elemani o eleman icin tanimlanmis CSS'e geri dondurecektir. Iste bir ornek:

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.ts">
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.css"/>
</docs-code-multifile>

## Geçiş ve tetikleyiciler

### Otomatik yüksekliği animasyonlama

Otomatik yukseklige animasyon yapmak icin css-grid kullanabilirsiniz.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts">
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.css"  />
</docs-code-multifile>

Tum tarayicilari destekleme konusunda endiselenmeniz gerekmiyorsa, otomatik yukseklige animasyon yapmanin gercek cozumu olan `calc-size()`'i da inceleyebilirsiniz. Daha fazla bilgi icin [MDN belgelerine](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) ve (bu egitime)[https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/] bakin.

### Görünüme giriş ve çıkış animasyonu

Bir oge gorünume girdiginde veya gorünumden ayrildiginda animasyonlar olusturabilirsiniz. Bir elemanin gorünume girisini animasyonlamaya bakalim. Bunu, eleman gorünume girdiginde animasyon siniflari uygulayacak olan `animate.enter` ile yapacagiz.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.ts">
    <docs-code header="insert.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.ts" />
    <docs-code header="insert.html" path="adev/src/content/examples/animations/src/app/native-css/insert.html" />
    <docs-code header="insert.css" path="adev/src/content/examples/animations/src/app/native-css/insert.css"  />
</docs-code-multifile>

Bir elemanin gorünumden ayrilirken animasyonlanmasi, gorünume girerken animasyonlamaya benzer. Eleman gorünumden ayrilirken hangi CSS siniflarinin uygulanacagini belirtmek icin `animate.leave` kullanin.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.ts">
    <docs-code header="remove.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.ts" />
    <docs-code header="remove.html" path="adev/src/content/examples/animations/src/app/native-css/remove.html" />
    <docs-code header="remove.css" path="adev/src/content/examples/animations/src/app/native-css/remove.css"  />
</docs-code-multifile>

`animate.enter` ve `animate.leave` hakkinda daha fazla bilgi icin [Giris ve Cikis animasyonlari rehberine](guide/animations) bakin.

### Artırma ve azaltma animasyonu

Artirma ve azaltmada animasyon uygulamalarda yaygin bir kaliptir. Bu davranisi nasil gerceklestirebileceginize dair bir ornek.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts">
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.css" />
</docs-code-multifile>

### Bir animasyonu veya tüm animasyonları devre dışı bırakma

Belirttiginiz animasyonlari devre disi birakmak istiyorsaniz, birden fazla seceeneginiz vardir.

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

### Animasyon geri çağırmaları

Animasyonlar sirasinda belirli noktalarda yurutmek istediginiz eylemleriniz varsa, dinleyebileceginiz bir dizi mevcut olay vardir. Birkazci:

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

## Karmaşık diziler

Animasyonlar genellikle basit bir fade in veya fade out'tan daha karmasiktir. Calistirmak isteyeceginiz bircok karmasik animasyon dizisi olabilir. Bu olasi senaryolarin bazilarina goz atalim.

### Listede kademeli animasyonlar

Yaygin efektlerden biri, kademeli bir etki olusturmak icin listedeki her ogenin animasyonlarini kademelilestirmektir. Bu, `animation-delay` veya `transition-delay` kullanilarak gerceklestirilebilir. Bu CSS'nin nasil gorunebilecegine dair bir ornek.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.ts">
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.css" />
</docs-code-multifile>

### Paralel animasyonlar

`animation` kisayol ozelligini kullanarak bir elemana ayni anda birden fazla animasyon uygulayabilirsiniz. Her birinin kendi suresi ve gecikmesi olabilir. Bu, animasyonlari bir araya getirmenize ve karmasik efektler olusturmaniza olanak tanir.

```css
.target-element {
  animation:
    rotate 3s,
    fade-in 2s;
}
```

Bu ornekte, `rotate` ve `fade-in` animasyonlari ayni anda baslar, ancak farkli surelere sahiptir.

### Yeniden sıralanan listenin öğelerini animasyonlama

Bir `@for` dongusundeki ogeler kaldirilip yeniden eklenecek, bu da giris animasyonlari icin `@starting-styles` kullanilarak animasyonlari tetikleyecektir. Alternatif olarak, ayni davranis icin `animate.enter` kullanabilirsiniz. Asagidaki ornekte gorulduğu gibi elemanlar kaldirilirken animasyonlamak icin `animate.leave` kullanin.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.ts">
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.css" />
</docs-code-multifile>

## Animasyonların programatik kontrolü

[`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations) kullanarak bir elemandaki animasyonlari dogrudan alabilirsiniz. Bu, o elemandaki her [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation)'in bir dizisini dondurur. Animasyon paketinin `AnimationPlayer`'inin sundugu seylerden cok daha fazlasini yapmak icin `Animation` API'sini kullanabilirsiniz. Buradan `cancel()`, `play()`, `pause()`, `reverse()` ve cok daha fazlasini yapabilirsiniz. Bu yerel API, animasyonlarinizi kontrol etmeniz icin ihtiyaciniz olan her seyi saglamalidir.

## Angular animasyonları hakkında daha fazla bilgi

Asagidakilerle de ilgilenebilirsiniz:

<docs-pill-row>
  <docs-pill href="guide/animations" title="Enter and Leave animations"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
</docs-pill-row>
