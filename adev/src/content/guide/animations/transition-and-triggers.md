# Animasyon geçişleri ve tetikleyiciler

IMPORTANT: `@angular/animations` paketi artik kullanim disidir (deprecated). Angular ekibi, tum yeni kodlar icin animasyonlarda `animate.enter` ve `animate.leave` ile yerel CSS kullanmanizi onerir. Yeni giris ve cikis [animasyon rehberinde](guide/animations) daha fazla bilgi edinin. Ayrica uygulamalarinizda saf CSS animasyonlarina nasil gecis yapabileceginizi ogrenmek icin [Angular'in Animasyon paketinden gecis](guide/animations/migration) belgesine bakin.

Bu rehber, `*` joker karakteri ve `void` gibi ozel gecis durumlarina derinlemesine girer. Bu ozel durumlarin bir gorünume giren ve gorünumden ayrilan elemanlar icin nasil kullanildigini gosterir.
Bu bolum ayrica birden fazla animasyon tetikleyicisini, animasyon geri cagirmalarini ve anahtar kareler kullanan sira tabanli animasyonu inceler.

## Önceden tanımlanmış durumlar ve joker karakter eşleştirme

Angular'da, gecis durumlari [`state()`](api/animations/state) fonksiyonu araciligiyla acikca tanimlanabilir veya onceden tanimlanmis `*` joker karakteri ve `void` durumlari kullanilarak tanimlanabilir.

### Joker karakter durumu

Bir yildiz isareti `*` veya _joker karakter_ herhangi bir animasyon durumuyla eslesir.
Bu, HTML elemaninin baslangic veya bitis durumundan bagimsiz olarak gecerli olan gecisleri tanimlamak icin kullanislidir.

Ornegin, `open => *` gecisi, elemanin durumu acik'tan baska herhangi bir seye degistiginde gecerlidir.

<img alt="wildcard state expressions" src="assets/images/guide/animations/wildcard-state-500.png">

Asagida, `open` ve `closed` durumlarini kullanan onceki ornekle birlikte joker karakter durumunu kullanan baska bir kod ornegi bulunmaktadir.
Her durum-durum gecis ciftini tanimlamak yerine, `closed`'a herhangi bir gecis 1 saniye surer ve `open`'a herhangi bir gecis 0.5 saniye surer.

Bu, her biri icin ayri gecisler eklemek zorunda kalmadan yeni durumlarin eklenmesine olanak tanir.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-wildcard1"/>

Her iki yonde durumdan duruma gecisleri belirtmek icin cift ok sozdizimini kullanin.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-wildcard2"/>

### Birden fazla geçiş durumu ile joker karakter durumu kullanma

Iki durumlu buton orneginde, yalnizca iki olasi durum, `open` ve `closed` oldugu icin joker karakter cok yararli degildir.
Genel olarak, bir elemanin degisebilecegi birden fazla potansiyel durumu oldugunda joker karakter durumlarini kullanin.
Buton `open`'dan `closed`'a veya `inProgress` gibi bir seye degisebilirse, joker karakter durumu kullanmak gereken kodlama miktarini azaltabilir.

<img alt="wildcard state with 3 states" src="assets/images/guide/animations/wildcard-3-states.png">

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-transition"/>

`* => *` gecisi, iki durum arasinda herhangi bir degisiklik oldugunda gecerlidir.

Gecisler tanimlandiklari siraya gore eslestirilir.
Bu nedenle, `* => *` gecisi uzerine baska gecisler uygulayabilirsiniz.
Ornegin, yalnizca `open => closed` icin gecerli olacak stil degisiklikleri veya animasyonlar tanimlayin, ardindan baska sekilde belirtilmemis durum esilesmeleri icin `* => *`'i bir geri donus olarak kullanin.

Bunu yapmak icin, daha spesifik gecisleri `* => *`'dan _once_ listeleyin.

### Stillerle joker karakter kullanma

Animasyona mevcut stil degerinin ne olursa olsun onu kullanmasini ve bununla animasyon yapmasini soylemek icin `*` joker karakterini bir stille kullanin.
Joker karakter, animasyonu yapilan durum tetikleyici icinde bildirılmemisse kullanilan bir geri donus degeridir.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition4"/>

### Void durumu

Sayfaya giren veya sayfadan ayrilan bir eleman icin gecisleri yapilandirmak icin `void` durumunu kullanin.
[Gorünume girme ve gorünumden ayrilma animasyonlari](guide/legacy-animations/transition-and-triggers#enter-ve-leave-takma-adları) konusuna bakin.

### Joker karakter ve void durumlarını birleştirme

Sayfaya giren ve sayfadan ayrilan animasyonlari tetiklemek icin bir geciste joker karakter ve void durumlarini birlestirin:

- `* => void` gecisi, elemanin ayrilmadan onceki durumundan bagimsiz olarak gorünumden ayrildiginda gecerlidir
- `void => *` gecisi, elemanin giriste aldigi durumdan bagimsiz olarak gorünume girdiginde gecerlidir
- `*` joker karakter durumu, `void` dahil _herhangi bir_ durumla eslesir

## Görünüme giriş ve çıkış animasyonu

Bu bolum, sayfaya giren veya sayfadan ayrilan elemanlarin nasil animasyonlanacagini gosterir.

Yeni bir davranis ekleyin:

- Kahramanlar listesine bir kahraman eklediginizde, soldan sayfaya ucuyormus gibi gorunur
- Listeden bir kahramani kaldiridginizda, saga dogru ucuyormus gibi gorunur

<docs-code header="hero-list-enter-leave.ts" path="adev/src/content/examples/animations/src/app/hero-list-enter-leave.ts" region="animationdef"/>

Onceki kodda, HTML elemani bir gorünume baglanmadiginda `void` durumunu uyguladiniz.

## :enter ve :leave takma adları

`:enter` ve `:leave`, `void => *` ve `* => void` gecisleri icin takma adlardir.
Bu takma adlar bircok animasyon fonksiyonu tarafindan kullanilir.

```ts {hideCopy}

transition ( ':enter', [ … ] ); // void => _ için takma ad
transition ( ':leave', [ … ] ); // _ => void için takma ad

```

Gorünume giren bir elemani hedeflemek daha zordur cunku henuz DOM'da degildir.
DOM'a eklenen veya DOM'dan kaldirilan HTML elemanlarini hedeflemek icin `:enter` ve `:leave` takma adlarini kullanin.

### :enter ve :leave ile `*ngIf` ve `*ngFor` kullanma

`:enter` gecisi, herhangi bir `*ngIf` veya `*ngFor` gorünumu sayfaya yerlestirildiginde calisir ve `:leave` bu gorünumler sayfadan kaldirildiginda calisir.

IMPORTANT: Giris/cikis davranislari bazen kafa karistirici olabilir.
Genel kural olarak, Angular tarafindan DOM'a eklenen herhangi bir elemanin `:enter` gecisinden gectigini dusunun. Yalnizca Angular tarafindan dogrudan DOM'dan kaldirilan elemanlar `:leave` gecisinden gecer. Ornegin, bir elemanin gorünumu, ust elemani DOM'dan kaldirildigi icin DOM'dan kaldirilir.

Bu ornek, giris ve cikis animasyonu icin `myInsertRemoveTrigger` adinda ozel bir tetikleyiciye sahiptir.
HTML sablonu asagidaki kodu icerir.

<docs-code header="insert-remove.html" path="adev/src/content/examples/animations/src/app/insert-remove.html" region="insert-remove"/>

Bilesen dosyasinda, `:enter` gecisi 0 baslangic opakligini ayarlar. Ardindan, eleman gorünume eklendikce bu opakligi 1'e degistirmek icin animasyonlar.

<docs-code header="insert-remove.ts" path="adev/src/content/examples/animations/src/app/insert-remove.ts" region="enter-leave-trigger"/>

Bu ornegin [`state()`](api/animations/state) kullanmasina gerek olmadigini unutmayin.

## :increment ve :decrement geçişleri

`transition()` fonksiyonu diger seçici degerleri, `:increment` ve `:decrement` kabul eder.
Sayisal bir deger arttiginda veya azaldiginda bir gecisi baslatmak icin bunlari kullanin.

HELPFUL: Asagidaki ornek `query()` ve `stagger()` yontemlerini kullanir.
Bu yontemler hakkinda daha fazla bilgi icin [karmasik siralar](guide/legacy-animations/complex-sequences) sayfasina bakin.

<docs-code header="hero-list-page.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.ts" region="increment"/>

## Geçişlerde Boolean değerler

Bir tetikleyici baglama degeri olarak bir Boolean degeri iceriyorsa, bu deger `true` ve `false` veya `1` ve `0` karsilastiran bir `transition()` ifadesi kullanilarak eslestirilebilir.

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.2.html" region="trigger-boolean"/>

Yukaridaki kod parcasinda, HTML sablonu bir `<div>` elemanini `isOpen` durum ifadesi ve `true` ve `false` olasi degerleri ile `openClose` adinda bir tetikleyiciye baglar.
Bu desen, `open` ve `close` gibi iki adlandirilmis durum olusturma pratiğine bir alternatiftir.

`@Component` metaverisi icindeki `animations:` ozelliginin altinda, durum `true` olarak degerlendirildiginde, iliskili HTML elemaninin yuksekligi bir joker karakter stili veya varsayilandir.
Bu durumda, animasyon elemanin animasyon baslamadan once sahip oldugu yuksekligi kullanir.
Eleman `closed` oldugunda, eleman 0 yukseklige animasyonlanir, bu da onu gorunmez yapar.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.2.ts" region="trigger-boolean"/>

## Birden fazla animasyon tetikleyicisi

Bir bilesen icin birden fazla animasyon tetikleyicisi tanimlanabilir.
Animasyon tetikleyicilerini farkli elemanlara ekleyin ve elemanlar arasindaki ust-alt iliskiler animasyonlarin nasil ve ne zaman calisacagini etkiler.

### Üst-alt animasyonlar

Angular'da bir animasyon her tetiklendiginde, ust animasyon her zaman oncelik alir ve alt animasyonlar engellenir.
Bir alt animasyonun calismasi icin, ust animasyonun alt animasyonlar iceren her elemani sorgulamasi gerekir. Ardindan [`animateChild()`](api/animations/animateChild) fonksiyonunu kullanarak animasyonlarin calismesina izin verir.

#### Bir HTML elemanında animasyonu devre dışı bırakma

Bir HTML elemaninda ve ic ice gecmis tum elemanlarda animasyonlari kapatmak icin `@.disabled` adinda ozel bir animasyon kontrol baglamasi yerlestirilir.
Dogru oldugunda, `@.disabled` baglamasi tum animasyonlarin islenmesini engeller.

Asagidaki kod ornegi bu ozelligin nasil kullanilacagini gosterir.

<docs-code-multifile>
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.4.html" region="toggle-animation"/>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.4.ts" region="toggle-animation" language="typescript"/>
</docs-code-multifile>

`@.disabled` baglamasi dogru oldugunda, `@childAnimation` tetikleyicisi baslamaz.

HTML sablonundaki bir eleman `@.disabled` ana baglama kullanarak animasyonlari kapattiginda, animasyonlar tum ic elemanlarda da kapatilir.
Tek bir eleman uzerinde birden fazla animasyonu secici olarak kapatamazsiniz.<!-- vale off -->

Secici alt animasyonlar, devre disi birakilmis bir ust elemanda asagidaki yollardan biriyle calistirilanabilir:

- Bir ust animasyon, HTML sablonunun devre disi birakilmis bolgelerinde bulunan ic elemanlari toplamak icin [`query()`](api/animations/query) fonksiyonunu kullanabilir.
Bu elemanlar hala animasyonlanabilir.
<!-- vale on -->

- Bir alt animasyon bir ust tarafindan sorgulanabilir ve daha sonra `animateChild()` fonksiyonuyla animasyonlanabilir

#### Tüm animasyonları devre dışı bırakma

Bir Angular uygulamasi icin tum animasyonlari kapatmak icin, en ust Angular bilesenine `@.disabled` ana baglamasini yerlestirin.

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="toggle-app-animations"/>

HELPFUL: Animasyonlari uygulama capinda devre disi birakmak, uctan uca \(E2E\) testleri sirasinda faydalidir.

## Animasyon geri çağırmaları

Animasyon `trigger()` fonksiyonu basladiginda ve bittiginde _geri cagirmalar_ yapar.
Asagidaki ornek, `openClose` tetikleyicisi iceren bir bileseni gostermektedir.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="events1"/>

HTML sablonunda, animasyon olayi `@triggerName.start` ve `@triggerName.done` olarak `$event` araciligiyla geri dondurulur; burada `triggerName` kullanilan tetikleyicinin adidir.
Bu ornekte, `openClose` tetikleyicisi su sekilde gorunur.

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.3.html" region="callbacks"/>

Animasyon geri cagirmalari icin potansiyel bir kullanim, bir veritabani sorgusu gibi yavas bir API cagrisi icin katman olusturmak olabilir.
Ornegin, arka plan sistemi islemi bitene kadar kendi dongu animasyonuna sahip bir **InProgress** butonu olusturulabilir.

Mevcut animasyon bittiginde baska bir animasyon cagrilabilir.
Ornegin, API cagrisi tamamlandiginda buton `inProgress` durumundan `closed` durumuna gecer.

Bir animasyon, aslinda olmasa bile bir son kullanicinin islemin daha _hizli_ oldugunu algilamasini saglayabilir.

Geri cagirmalar, bir hata ayiklama araci olarak da kullanilabilir; ornegin tarayicinin Gelistirici JavaScript Konsolunda uygulamanin ilerlemesini goruntulemek icin `console.warn()` ile birlikte.
Asagidaki kod parcasi, `open` ve `closed` iki durumlu bir buton olan orijinal ornek icin konsol log ciktisi olusturur.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="events"/>

## Anahtar kareler

Birden fazla adimla sirali olarak calisan bir animasyon olusturmak icin _anahtar kareler_ kullanin.

Angular'in `keyframe()` fonksiyonu, tek bir zamanlama bolumu icinde bircok stil degisikligine izin verir.
Ornegin, buton solmak yerine tek bir 2 saniyelik zaman diliminde birkac kez renk degistirebilir.

<img alt="keyframes" src="assets/images/guide/animations/keyframes-500.png">

Bu renk degisikligi icin kod su sekilde gorunebilir.

<docs-code header="status-slider.ts" path="adev/src/content/examples/animations/src/app/status-slider.ts" region="keyframes"/>

### Ofset

Anahtar kareler, animasyonda her stil degisikliginin gerceklestigi noktayi tanimlayan bir `offset` icerir.
Offsetler, animasyonun baslangicini ve sonunu isaretleyen sifirdan bire kadar goreceli olcumlerdir. En az bir kez kullanilirsa anahtar kare adimlarinin her birine uygulanmalidir.

Anahtar kareler icin offset tanimlamak istege baglidir.
Bunlari atlarsaniz, esit aralikli offsetler otomatik olarak atanir.
Ornegin, onceden tanimlanmis offsetleri olmayan uc anahtar kare 0, 0.5 ve 1 offsetlerini alir.
Onceki ornekteki orta gecis icin 0.8 offseti belirtmek su sekilde gorunebilir.

<img alt="keyframes with offset" src="assets/images/guide/animations/keyframes-offset-500.png">

Offsetleri belirtilmis kod su sekilde olur.

<docs-code header="status-slider.ts" path="adev/src/content/examples/animations/src/app/status-slider.ts" region="keyframesWithOffsets"/>

Tek bir animasyon icinde anahtar kareleri `duration`, `delay` ve `easing` ile birlestirebilirsiniz.

### Nabız efektli anahtar kareler

Animasyon boyunca belirli offsetlerde stiller tanimlayarak animasyonlarinizda bir nabiz efekti olusturmak icin anahtar kareleri kullanin.

Nabiz efekti olusturmak icin anahtar kareleri kullanmanin bir ornegi:

- Orijinal `open` ve `closed` durumlari, 1 saniyelik bir zaman diliminde gerceklesen orijinal yukseklik, renk ve opaklik degisiklikleri
- Butonun ayni 1 saniyelik zaman diliminde duzensiz olarak nabiz atiyormus gibi gorunmesine neden olan ortaya eklenmis bir anahtar kare dizisi

<img alt="keyframes with irregular pulsation" src="assets/images/guide/animations/keyframes-pulsation.png">

Bu animasyon icin kod parcasi su sekilde gorunebilir.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.1.ts" region="trigger"/>

### Animasyonlanabilir özellikler ve birimler

Angular animasyon destegi web animasyonlari uzerine kurulmustur, bu nedenle tarayicinin animasyonlanabilir olarak kabul ettigi herhangi bir ozelligi animasyonlayabilirsiniz.
Bu; konumlar, boyutlar, donusumler, renkler, kenarliklar ve daha fazlasini icerir.
W3C, [CSS Transitions](https://www.w3.org/TR/css-transitions-1) sayfasinda animasyonlanabilir ozelliklerin bir listesini tutar.

Sayisal degeri olan ozellikler icin, degeri uygun sonek ile bir dize olarak tirnak icinde saglayin:

- 50 piksel:
  `'50px'`

- Goreceli font boyutu:
  `'3em'`

- Yuzde:
  `'100%'`

Degeri bir sayi olarak da saglayabilirsiniz. Bu gibi durumlarda Angular varsayilan birim olarak piksel veya `px` kabul eder.
50 pikseli `50` olarak ifade etmek `'50px'` demekle aynidir.

HELPFUL: `"50"` dizesi ise gecerli olarak kabul edilmez\).

### Joker karakterlerle otomatik özellik hesaplama

Bazen bir boyutsal stil ozelliginin degeri calisma zamanina kadar bilinmez.
Ornegin, elemanlarin genislikleri ve yukseklikleri genellikle iceriklerine veya ekran boyutuna baglidir.
Bu ozellikler genellikle CSS kullanarak animasyonlanmasi zordur.

Bu durumlarda, `style()` altinda ozel bir `*` joker ozellik degeri kullanabilirsiniz. Bu belirli stil ozelliginin degeri calisma zamaninda hesaplanir ve ardindan animasyona eklenir.

Asagidaki ornek, bir HTML elemani sayfadan ayrildiginda kullanilan `shrinkOut` adinda bir tetikleyiciye sahiptir.
Animasyon, elemanin ayrilmadan once sahip oldugu yuksekligi alir ve o yukseklikten sifira animasyonlar.

<docs-code header="hero-list-auto.ts" path="adev/src/content/examples/animations/src/app/hero-list-auto.ts" region="auto-calc"/>

### Anahtar kareler özeti

Angular'daki `keyframes()` fonksiyonu, tek bir gecis icinde birden fazla ara stil belirtmenize olanak tanir. Her stil degisikliginin animasyonda nerede gerceklesmesi gerektigini tanimlamak icin istege bagli bir `offset` kullanilabilir.

## Angular animasyonları hakkında daha fazla bilgi

Asagidakilerle de ilgilenebilirsiniz:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Introduction to Angular animations"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Complex animation sequences"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Reusable animations"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
  <docs-pill href="guide/animations/migration" title="Migrating to Native CSS Animations"/>
</docs-pill-row>
