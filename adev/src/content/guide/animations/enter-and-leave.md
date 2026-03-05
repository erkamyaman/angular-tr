# Animating your applications with `animate.enter` and `animate.leave`

Iyi tasarlanmis animasyonlar uygulamanizi daha eglenceli ve kullanimi kolay hale getirebilir, ancak sadece gorsel bir unsur degildir.
Animasyonlar uygulamanizi ve kullanici deneyimini bircok sekilde iyilestirebilir:

- Animasyonlar olmadan, web sayfasi gecisleri ani ve rahatsiz edici gorunebilir
- Hareket, kullanici deneyimini buyuk olcude gelistirir, bu nedenle animasyonlar kullanicilara uygulamanin eylemlerine verdigi yaniti algilama sansi tanir
- Iyi animasyonlar, kullanicinin dikkatini bir is akisi boyunca duzgunce yonlendirebilir

Angular, uygulamanizin elemanlarini animasyonlamak icin `animate.enter` ve `animate.leave` saglar. Bu iki ozellik, uygun zamanlarda giris ve cikis CSS siniflarini uygular veya ucuncu parti kutuphanelerden animasyonlar uygulamak icin fonksiyonlari cagrir. `animate.enter` ve `animate.leave` yonerge degildir. Bunlar dogrudan Angular derleyicisi tarafindan desteklenen ozel API'lerdir. Elemanlarda dogrudan kullanilabilir ve ayrica bir ana baglama olarak da kullanilabilir.

## `animate.enter`

DOM'a _giren_ elemanlari animasyonlamak icin `animate.enter` kullanabilirsiniz. Giris animasyonlarini gecisler veya anahtar kare animasyonlari ile CSS siniflari kullanarak tanimlayabilirsiniz.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts">
    <docs-code header="enter.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts" />
    <docs-code header="enter.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.html" />
    <docs-code header="enter.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.css"/>
</docs-code-multifile>

Animasyon tamamlandiginda, Angular `animate.enter`'da belirttiginiz sinif veya siniflari DOM'dan kaldirir. Animasyon siniflari yalnizca animasyon aktifken mevcuttur.

NOTE: Bir elemanda birden fazla anahtar kare animasyonu veya gecis ozelligi kullanildiginda, Angular tum siniflari yalnizca en uzun animasyon tamamlandiktan _sonra_ kaldirir.

`animate.enter`'i kontrol akisi veya dinamik ifadeler gibi diger Angular ozellikleriyle kullanabilirsiniz. `animate.enter` hem tek bir sinif dizesini (boslukla ayrilmis birden fazla sinif ile) hem de bir sinif dizesi dizisini kabul eder.

CSS gecisleri kullanimi hakkinda kisa bir not: Anahtar kare animasyonlari yerine gecisleri kullanmayi secerseniz, `animate.enter` ile elemana eklenen siniflar gecisin _hedef_ durumunu temsil eder. Temel eleman CSS'iniz, animasyon calismadigi zaman elemanin nasil gorunecegini belirler, bu da muhtemelen CSS gecisinin son durumuna benzer. Bu nedenle, gecisinizin calismasi icin uygun bir _baslangic_ durumuna sahip olmak icin yine de `@starting-style` ile eslestirmeniz gerekir.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts">
    <docs-code header="enter-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts" />
    <docs-code header="enter-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.html" />
    <docs-code header="enter-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.css"/>
</docs-code-multifile>

## `animate.leave`

DOM'dan _ayrilan_ elemanlari animasyonlamak icin `animate.leave` kullanabilirsiniz. Cikis animasyonlarini donusumler veya anahtar kare animasyonlari ile CSS siniflari kullanarak tanimlayabilirsiniz.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts">
    <docs-code header="leave.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts" />
    <docs-code header="leave.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.html" />
    <docs-code header="leave.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.css"/>
</docs-code-multifile>

Animasyon tamamlandiginda, Angular animasyonlu elemani DOM'dan otomatik olarak kaldirir.

NOTE: Bir elemanda birden fazla anahtar kare animasyonu veya gecis ozelligi kullanildiginda, Angular elemani yalnizca bu animasyonlarin en uzunu tamamlandiktan _sonra_ kaldirir.

`animate.leave` sinyallerle ve diger baglamalarla da kullanilabilir. `animate.leave`'i tek bir sinif veya birden fazla sinif ile kullanabilirsiniz. Bosluklu basit bir dize veya bir dize dizisi olarak belirtin.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts">
    <docs-code header="leave-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts" />
    <docs-code header="leave-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.html" />
    <docs-code header="leave-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.css"/>
</docs-code-multifile>

### Element removal order matters

`animate.leave` animasyonlarinin nasil calistirildiginda ve bir animasyonun ne zaman gercekleseceginde bazi incelikler vardir. `animate.leave`, kaldirilan elemanin uzerine yerlestirilmisse calisir. Ancak, `animate.leave` kaldirilan elemanin bir _alt ogesi_ olan bir elemandaysa animasyon **yapmaz**. Bunun nedeni, bir ust dugum kaldirildiginda tum alt agaci da beraberinde goturmesidir ve o ust dugumde animasyon olmadigindan hemen kaldirilacaktir. Bu, `animate.leave` ile animasyonlanacak bir eleman olmadigini gosterir. `animate.leave` kullaniminizda bunu dikkate almaniz gerekecektir.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.ts">
    <docs-code header="leave.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.ts" />
    <docs-code header="leave.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.html" />
    <docs-code header="leave.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.css"/>
</docs-code-multifile>

## Event Bindings, Functions, and Third-party Libraries

Hem `animate.enter` hem de `animate.leave`, fonksiyon cagrilarina izin veren olay baglama sozdizimini destekler. Bu sozdizimini bilesen kodunuzdaki bir fonksiyonu cagirmak veya [GSAP](https://gsap.com/), [anime.js](https://animejs.com/) veya herhangi bir JavaScript animasyon kutuphanesi gibi ucuncu parti animasyon kutuphanelerini kullanmak icin kullanabilirsiniz.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts">
    <docs-code header="leave-event.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts" />
    <docs-code header="leave-event.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.html" />
    <docs-code header="leave-event.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.css"/>
</docs-code-multifile>

`$event` nesnesi `AnimationCallbackEvent` tipindedir. Elemani `target` olarak icerir ve animasyon bittiginde cercevye bildirimde bulunmak icin bir `animationComplete()` fonksiyonu saglar.

IMPORTANT: `animate.leave` kullanirken Angular'in elemani kaldirmasi icin `animationComplete()` fonksiyonunu **mutlaka** cagirmaniz gerekir.

`animate.leave` kullanirken `animationComplete()` cagirmazsaniz, Angular dort saniyelik bir gecikmeden sonra fonksiyonu otomatik olarak cagrir. `MAX_ANIMATION_TIMEOUT` tokenini milisaniye cinsinden saglayarak gecikme suresini yapilandirabilirsiniz.

```typescript
  { provide: MAX_ANIMATION_TIMEOUT, useValue: 6000 }
```

## Compatibility with Legacy Angular Animations

Eski animasyonlari `animate.enter` ve `animate.leave` ile ayni bilesen icinde kullanamazsiniz. Bunu yapmak, giris siniflarinin eleman uzerinde kalmasina veya ayrilan dugumlerin kaldirilmamasina yol acar. Ayni _uygulama_ icinde hem eski animasyonlari hem de yeni `animate.enter` ve `animate.leave` animasyonlarini kullanmak ise sorun degildir. Tek istisna icerik projeksiyonudur. Eski animasyonlari olan bir bilesenden `animate.enter` veya `animate.leave` olan baska bir bilesene icerik projeksiyonu yapiyorsaniz veya tam tersi, bu ayni bilesende birlikte kullaniliyormus gibi ayni davranisa yol acar. Bu desteklenmemektedir.

## Testing

TestBed, test ortaminizda animasyonlari etkinlestirmek veya devre disi birakmak icin yerlesik destek saglar. CSS animasyonlari calismak icin bir tarayici gerektirir ve API'lerin cogu test ortaminda mevcut degildir. Varsayilan olarak TestBed, test ortamlarinizdaki animasyonlari sizin icin devre disi birakir.

Animasyonlarin bir tarayici testinde, ornegin uctan uca bir testte animasyonlandigini test etmek istiyorsaniz, test yapilandirmanizda `animationsEnabled: true` belirterek TestBed'i animasyonlari etkinlestirecek sekilde yapilandirabilirsiniz.

```typescript
TestBed.configureTestingModule({animationsEnabled: true});
```

Bu, test ortaminizda animasyonlari normal sekilde davranacak sekilde yapilandirir.

NOTE: Bazi test ortamlari `animationstart`, `animationend` ve bunlarin gecis olay karsiliklari gibi animasyon olaylarini yayinlamaz.

## More on Angular animations

Asagidakilerle de ilgilenebilirsiniz:

<docs-pill-row>
  <docs-pill href="guide/animations/css" title="Complex Animations with CSS"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
</docs-pill-row>
