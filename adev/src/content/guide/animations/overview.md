# Angular Animasyonlarına Giriş

IMPORTANT: `@angular/animations` paketi artık kullanım dışıdır (deprecated). Angular ekibi, tüm yeni kodlar için animasyonlarda `animate.enter` ve `animate.leave` ile yerel CSS kullanmanızı önerir. Yeni giriş ve çıkış [animasyon rehberinde](guide/animations) daha fazla bilgi edinin. Ayrıca uygulamalarınızda saf CSS animasyonlarına nasıl geçiş yapabileceğinizi öğrenmek için [Angular'ın Animasyon paketinden geçiş](guide/animations/migration) belgesine bakın.

Animasyon, hareket yanılsaması sağlar: HTML elemanları zaman içinde stil değiştirir.
İyi tasarlanmış animasyonlar uygulamanızı daha eğlenceli ve kullanımı kolay hale getirebilir, ancak sadece görsel bir unsur değildir.
Animasyonlar uygulamanızı ve kullanıcı deneyimini birçok şekilde iyileştirebilir:

- Animasyonlar olmadan, web sayfası geçişleri ani ve rahatsız edici görünebilir
- Hareket, kullanıcı deneyimini büyük ölçüde geliştirir, bu nedenle animasyonlar kullanıcılara uygulamanın eylemlerine verdiği yanıtı algılama şansı tanır
- İyi animasyonlar, kullanıcının dikkatini sezgisel olarak ihtiyaç duyulan yere çeker

Tipik olarak, animasyonlar zaman içinde birden fazla stil _dönüşümü_ içerir.
Bir HTML elemanı hareket edebilir, renk değiştirebilir, büyüyüp küçülebilir, solabilir veya sayfadan kayabilir.
Bu değişiklikler eşanlı veya sıralı olarak gerçekleşebilir. Her dönüşümün zamanlamasını kontrol edebilirsiniz.

Angular'ın animasyon sistemi CSS işlevi üzerine kurulmuştur, bu da tarayıcının animasyonlanabilir olarak kabul ettiği herhangi bir özelliği animasyonlayabileceğiniz anlamına gelir.
Bu; konumlar, boyutlar, dönüşümler, renkler, kenarlıklar ve daha fazlasını içerir.
W3C, [CSS Transitions](https://www.w3.org/TR/css-transitions-1) sayfasında animasyonlanabilir özelliklerin bir listesini tutar.

## Bu rehber hakkında

Bu rehber, projenize Angular animasyonları eklemeye başlamanız için temel Angular animasyon özelliklerini kapsar.

## Başlarken

Animasyonlar için ana Angular modülleri `@angular/animations` ve `@angular/platform-browser`'dır.

Projenize Angular animasyonları eklemeye başlamak için, standart Angular işlevselliğiyle birlikte animasyona özel modülleri içe aktarın.

<docs-workflow>
<docs-step title="Enabling the animations module">
`@angular/platform-browser/animations/async`'den `provideAnimationsAsync`'i içe aktarın ve `bootstrapApplication` fonksiyon çağrısındaki providers listesine ekleyin.

```ts {header: "Enabling Animations", linenums}
bootstrapApplication(AppComponent, {
  providers: [provideAnimationsAsync()],
});
```

<docs-callout important title="If you need immediate animations in your application">
  Uygulamaniz yuklendiginde hemen bir animasyonun gerceklesmesi gerekiyorsa,
  hevesle yuklenen animasyonlar modulune gecmek isteyeceksiniz. Bunun yerine `@angular/platform-browser/animations`'dan `provideAnimations`'i
  iceri aktarin ve `bootstrapApplication` fonksiyon cagrisinda `provideAnimationsAsync` **yerine** `provideAnimations` kullanin.
</docs-callout>

`NgModule` tabanli uygulamalar icin, Angular kok uygulama modulunuze animasyon yeteneklerini tanitan `BrowserAnimationsModule`'u iceri aktarin.

<docs-code header="app.module.ts" path="adev/src/content/examples/animations/src/app/app.module.1.ts"/>
</docs-step>
<docs-step title="Importing animation functions into component files">
Bilesen dosyalarinda belirli animasyon fonksiyonlari kullanmayi planliyorsaniz, bu fonksiyonlari `@angular/animations`'dan iceri aktarin.

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="imports"/>

Bu rehberin sonundaki tum [kullanilabilir animasyon fonksiyonlarina](guide/legacy-animations#animasyonlar-api-özeti) bakin.

</docs-step>
<docs-step title="Adding the animation metadata property">
Bilesen dosyasinda, `@Component()` dekoratoru icinde `animations:` adinda bir metaveri ozelligi ekleyin.
Bir animasyonu tanimlayan tetikleyiciyi `animations` metaveri ozelliginin icine yerlestirirsiniz.

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="decorator"/>
</docs-step>
</docs-workflow>

## Bir geçişi animasyonlama

Tek bir HTML elemanini bir durumdan digerine degistiren bir gecisi animasyonlayalim.
Ornegin, bir butonun kullanicinin son eylemine gore **Open** veya **Closed** gosterdigini belirtebilirsiniz.
Buton `open` durumundayken gorunur ve saridir.
`closed` durumundayken yari saydam ve mavidir.

HTML'de bu nitelikler renk ve opaklik gibi siradan CSS stilleri kullanilarak ayarlanir.
Angular'da, animasyonlarla kullanmak uzere bir dizi CSS stili belirtmek icin `style()` fonksiyonunu kullanin.
Bir animasyon durumunda bir dizi stili toplayin ve duruma `open` veya `closed` gibi bir ad verin.

HELPFUL: Basit gecislerle animasyonlanacak yeni bir `open-close` bileseni olusturalim.

Bileseni olusturmak icin terminalde asagidaki komutu calistirin:

```shell
ng g component open-close
```

Bu, bileseni `src/app/open-close.ts` konumunda olusturacaktir.

### Animasyon durumu ve stilleri

Her gecisin sonunda cagrilacak farkli durumlari tanimlamak icin Angular'in [`state()`](api/animations/state) fonksiyonunu kullanin.
Bu fonksiyon iki arguman alir:
`open` veya `closed` gibi benzersiz bir ad ve bir `style()` fonksiyonu.

Belirli bir durum adiyla iliskilendirilecek bir dizi stili tanimlamak icin `style()` fonksiyonunu kullanin.
`backgroundColor` gibi tire iceren stil nitelikleri icin _camelCase_ kullanmaniz veya `'background-color'` gibi tirnak icine almaniz gerekir.

Angular'in [`state()`](api/animations/state) fonksiyonunun `style⁣­(⁠)` fonksiyonuyla CSS stil niteliklerini ayarlamak icin nasil calistigini gorelim.
Bu kod parcasinda, durum icin birden fazla stil niteligi ayni anda ayarlanir.
`open` durumunda, butonun yuksekligi 200 piksel, opakligi 1 ve arka plan rengi saridir.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state1"/>

Asagidaki `closed` durumunda, butonun yuksekligi 100 piksel, opakligi 0.8 ve arka plan rengi mavidir.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state2"/>

### Geçişler ve zamanlama

Angular'da birden fazla stili animasyon olmadan ayarlayabilirsiniz.
Ancak, daha fazla iyilestirme olmadan, buton aninda donusur; solma, kuculme veya bir degisikligin gerceklestigini gosteren baska gorunur bir gosterge olmadan.

Degisikligi daha az ani yapmak icin, bir sure boyunca bir durumdan digerine olan degisiklikleri belirten bir animasyon _gecisi_ tanimlamaniz gerekir.
`transition()` fonksiyonu iki arguman kabul eder:
Birinci arguman, iki gecis durumu arasindaki yonu tanimlayan bir ifadeyi kabul eder ve ikinci arguman bir veya bir dizi `animate()` adimini kabul eder.

Bir gecisin surecini, gecikmesini ve yumusakligini tanimlamak ve gecisler sirasinda stilleri tanimlamak icin stil fonksiyonunu belirlemek icin `animate()` fonksiyonunu kullanin.
Cok adimli animasyonlar icin `keyframes()` fonksiyonunu tanimlamak icin `animate()` fonksiyonunu kullanin.
Bu tanimlar, `animate()` fonksiyonunun ikinci argumani icine yerlestirilir.

#### Animasyon meta verileri: süre, gecikme ve yumuşaklık

`animate()` fonksiyonu \(gecis fonksiyonunun ikinci argumani\) `timings` ve `styles` girdi parametrelerini kabul eder.

`timings` parametresi uc kisimda tanimlanmis bir sayi veya dize alir.

```ts
animate(duration);
```

veya

```ts
animate('duration delay easing');
```

Birinci kisim, `duration`, zorunludur.
Sure, tirnak isareti olmadan bir sayi olarak milisaniye cinsinden veya tirnak isareti ve bir zaman belirteci ile saniye cinsinden ifade edilebilir.
Ornegin, saniyenin onda biri suresi su sekilde ifade edilebilir:

- Duz sayi olarak, milisaniye cinsinden:
  `100`

- Dize olarak, milisaniye cinsinden:
  `'100ms'`

- Dize olarak, saniye cinsinden:
  `'0.1s'`

Ikinci arguman, `delay`, `duration` ile ayni sozdizimina sahiptir.
Ornegin:

- 100ms bekle ve ardindan 200ms calis: `'0.2s 100ms'`

Ucuncu arguman, `easing`, animasyonun calisma suresi boyunca nasil [hizlandigini ve yavaslayamadigini](https://easings.net) kontrol eder.
Ornegin, `ease-in` animasyonun yavas baslamasina ve ilerledikce hiz kazanmasina neden olur.

- 100ms bekle, 200ms calis.
  Hizli baslamak ve yavasca bir dinlenme noktasina yavasmak icin bir yavaslatma egrisi kullanin:
  `'0.2s 100ms ease-out'`

- 200ms calis, gecikme yok.
  Yavas baslamak, ortada hizlanmak ve sonra sonunda yavasca yavasmak icin standart bir egri kullanin:
  `'0.2s ease-in-out'`

- Hemen basla, 200ms calis.
  Yavas baslamak ve tam hizda bitmek icin bir hizlanma egrisi kullanin:
  `'0.2s ease-in'`

HELPFUL: Yumusaklik egrileri hakkinda genel bilgi icin Material Design web sitesinin [Dogal yumusaklik egrileri](https://material.io/design/motion/speed.html#easing) konusuna bakin.

Bu ornek, durumlar arasinda 1 saniyelik bir gecisle `open`'dan `closed`'a bir durum gecisi saglar.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition1"/>

Onceki kod parcasinda, `=>` operatoru tek yonlu gecisleri gosterir ve `<=>` cift yonludur.
Gecis icinde, `animate()` gecisin ne kadar surecegini belirtir.
Bu durumda, `open`'dan `closed`'a durum degisikligi burada `1s` olarak ifade edilen 1 saniye surer.

Bu ornek, 0.5 saniyelik bir gecis animasyon yayiyla `closed` durumundan `open` durumuna bir durum gecisi ekler.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition2"/>

HELPFUL: [`state`](api/animations/state) ve `transition` fonksiyonlari icinde stil kullanimi hakkinda bazi ek notlar.

- Her gecisin sonunda uygulanan stilleri tanimlamak icin [`state()`](api/animations/state) kullanin, animasyon tamamlandiktan sonra kalicidir
- Animasyon sirasinda hareket yanilsamasi olusturan ara stilleri tanimlamak icin `transition()` kullanin
- Animasyonlar devre disi birakildiginda, `transition()` stilleri atlanabilir, ancak [`state()`](api/animations/state) stilleri atlanamaz
- Ayni `transition()` argumani icinde birden fazla durum cifti ekleyin:

  ```ts
  transition('on => off, off => void');
  ```

### Animasyonu tetikleme

Bir animasyonun ne zaman baslayacagini bilmesi icin bir _tetikleyiciye_ ihtiyaci vardir.
`trigger()` fonksiyonu durumlari ve gecisleri toplar ve animasyona bir ad verir, boylece onu HTML sablonundaki tetikleyici elemana ekleyebilirsiniz.

`trigger()` fonksiyonu degisiklikleri izlenecek ozellik adini tanimlar.
Bir degisiklik oldugunda, tetikleyici taniminda yer alan eylemleri baslatir.
Bu eylemler gecisler veya daha sonra gorecegimiz gibi diger fonksiyonlar olabilir.

Bu ornekte, tetikleyiciyi `openClose` olarak adlandirip `button` elemanina ekleyecegiz.
Tetikleyici, acik ve kapali durumlari ve iki gecis icin zamanlamalari tanimlar.

HELPFUL: Her `trigger()` fonksiyon cagrisi icinde, bir eleman herhangi bir anda yalnizca bir durumda olabilir.
Ancak, ayni anda birden fazla tetikleyicinin aktif olmasi mumkundur.

### Animasyonları tanımlama ve HTML şablonuna ekleme

Animasyonlar, animasyonlanacak HTML elemanini kontrol eden bilesenin metaverisinde tanimlanir.
Animasyonlarinizi tanimlayan kodu `@Component()` dekoratoru icindeki `animations:` ozelliginin altina yerlestirin.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="component"/>

Bir bilesen icin bir animasyon tetikleyicisi tanimladiginizda, tetikleyici adini koseli parantezlerle sararak ve onune `@` sembolunu ekleyerek o bilesenin sablonundaki bir elemana ekleyin.
Ardindan, asagida gosterildigi gibi standart Angular ozellik baglama sozdizimini kullanarak tetikleyiciyi bir sablon ifadesine baglayabilirsiniz; burada `triggerName` tetikleyicinin adi ve `expression` tanimlanmis bir animasyon durumuna deger uretir.

```angular-html
<div [@triggerName]="expression">…</div>
```

Animasyon, ifade degeri yeni bir duruma degistiginde yurutulur veya tetiklenir.

Asagidaki kod parcasi tetikleyiciyi `isOpen` ozelliginin degerine baglar.

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.1.html" region="trigger"/>

Bu ornekte, `isOpen` ifadesi `open` veya `closed` tanimli durumuna degerlendiginde, durum degisikligini `openClose` tetikleyicisine bildirir.
Ardindan, durum degisikligini ele almak ve bir durum degisikligi animasyonu baslatmak `openClose` koduna kalir.

Sayfaya giren veya sayfadan ayrilan elemanlar icin \(DOM'a eklenen veya DOM'dan kaldirilan\), animasyonlari kosullu yapabilirsiniz.
Ornegin, HTML sablonunda animasyon tetikleyicisiyle `*ngIf` kullanin.

HELPFUL: Bilesen dosyasinda, animasyonlari tanimlayan tetikleyiciyi `@Component()` dekoratorundeki `animations:` ozelliginin degeri olarak ayarlayin.

HTML sablon dosyasinda, tanimlanmis animasyonlari animasyonlanacak HTML elemanina eklemek icin tetikleyici adini kullanin.

### Kod incelemesi

Gecis orneginde tartisilan kod dosyalari asagidadir.

<docs-code-multifile>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="component"/>
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.1.html" region="trigger"/>
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/open-close.css"/>
</docs-code-multifile>

### Özet

Zamanlama icin `animate()` ile birlikte `style()` ve [`state()`](api/animations/state) kullanarak iki durum arasindaki gecise animasyon eklemeyi ogrendiniz.

Animasyonlar bolumunde Angular animasyonlarinin daha gelismis ozellikleri hakkinda bilgi edinin; [gecis ve tetikleyiciler](guide/legacy-animations/transition-and-triggers) konusundaki ileri tekniklerle baslayarak.

## Animasyonlar API özeti

`@angular/animations` modulu tarafindan saglanan fonksiyonel API, Angular uygulamalarinda animasyonlar olusturmak ve kontrol etmek icin alana ozgu bir dil \(DSL\) saglar.
Temel fonksiyonlarin ve ilgili veri yapilarinin tam listesi ve sozdizimi ayrintilari icin [API referansina](api#animations) bakin.

| Function name                     | What it does                                                                                                                                                                                                                        |
| :-------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger()`                       | Animasyonu baslatir ve diger tum animasyon fonksiyon cagrilari icin bir kapsayici gorevi gorur. HTML sablonu `triggerName`'e baglanir. Benzersiz bir tetikleyici adi bildirmek icin ilk argumani kullanin. Dizi sozdizimi kullanir. |
| `style()`                         | Animasyonlarda kullanilacak bir veya daha fazla CSS stili tanimlar. Animasyonlar sirasinda HTML elemanlarinin gorsel gorunumunu kontrol eder. Nesne sozdizimi kullanir.                                                             |
| [`state()`](api/animations/state) | Belirli bir duruma basarili geciste uygulanmasi gereken adlandirilmis bir CSS stil kumesi olusturur. Durum daha sonra diger animasyon fonksiyonlari icinde ada gore referans edilebilir.                                            |
| `animate()`                       | Bir gecis icin zamanlama bilgisini belirtir. `delay` ve `easing` icin istege bagli degerler. Icinde `style()` cagrilari icerebilir.                                                                                                 |
| `transition()`                    | Iki adlandirilmis durum arasindaki animasyon sirasini tanimlar. Dizi sozdizimi kullanir.                                                                                                                                            |
| `keyframes()`                     | Belirli bir zaman araligi icinde stiller arasinda sirali degisiklige izin verir. `animate()` icinde kullanin. Her `keyframe()` icinde birden fazla `style()` cagrisi icerebilir. Dizi sozdizimi kullanir.                           |
| [`group()`](api/animations/group) | Paralel olarak calistirilacak bir grup animasyon adimini \(_ic animasyonlar_\) belirtir. Animasyon yalnizca tum ic animasyon adimlari tamamlandiktan sonra devam eder. `sequence()` veya `transition()` icinde kullanilir.          |
| `query()`                         | Mevcut eleman icindeki bir veya daha fazla ic HTML elemanini bulur.                                                                                                                                                                 |
| `sequence()`                      | Birer birer sirali olarak calistirilan animasyon adimlarinin bir listesini belirtir.                                                                                                                                                |
| `stagger()`                       | Birden fazla eleman icin animasyonlarin baslama zamanini kademeli yapar.                                                                                                                                                            |
| `animation()`                     | Baska bir yerden cagrilabilecek yeniden kullanilabilir bir animasyon uretir. `useAnimation()` ile birlikte kullanilir.                                                                                                              |
| `useAnimation()`                  | Yeniden kullanilabilir bir animasyonu etkinlestirir. `animation()` ile kullanilir.                                                                                                                                                  |
| `animateChild()`                  | Alt bilesenlerdeki animasyonlarin ust bilesenle ayni zaman diliminde calistirilmasina izin verir.                                                                                                                                   |

</table>

## Angular animasyonları hakkında daha fazlası

HELPFUL: AngularConnect konferansinda Kasim 2017'de gosterilen bu [sunuma](https://www.youtube.com/watch?v=rnTK9meY5us) ve eslik eden [kaynak koduna](https://github.com/matsko/animationsftw.in) goz atin.

Asagidakilerle de ilgilenebilirsiniz:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="Transition and triggers"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Complex animation sequences"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Reusable animations"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
  <docs-pill href="guide/animations/migration" title="Migrating to Native CSS Animations"/>
</docs-pill-row>
