# Profiling with the Chrome DevTools

Angular, framework'e ozgu verileri ve icgoruuleri dogrudan [Chrome DevTools performans panelinde](https://developer.chrome.com/docs/devtools/performance/overview) sunmak icin [Chrome DevTools genisletilebilirlik API'si](https://developer.chrome.com/docs/devtools/performance/extension) ile entegre olur.

Entegrasyon etkinlestirildiginde, iki veri seti iceren bir [performans profili kaydedebilirsiniz](https://developer.chrome.com/docs/devtools/performance#record):

- Chrome'un kodunuzun bir tarayicida calismasini anlayisina dayanan standart performans girisleri ve
- Framework'un calisma zamani tarafindan saglanan Angular'a ozgu girisler.

Her iki veri seti de ayni sekmede ancak ayri izlerde birlikte sunulur:

<img alt="Angular custom track in Chrome DevTools profiler" src="assets/images/best-practices/runtime-performance/angular-perf-in-chrome.png">

Angular'a ozgu veriler, bir tarayici tarafindan yakalanan daha dusuk duzeyli fonksiyon ve yontem cagrilarinin yaninda framework kavramlari (bilesenler, degisiklik algilama, yasam dongusu kancalari vb.) acisindan ifade edilir. Bu iki veri seti birbiriyle iliskilidir ve farkli gorunumler ile ayrniti duzeyleri arasinda gecis yapabilirsiniz.

Kodunuzun tarayicida nasil calistigini daha iyi anlamak icin Angular izini kullanabilirsiniz, bunlar arasinda:

- Belirli bir kod blogunun Angular uygulamasinin bir parcasi olup olmadigini veya ayni sayfada calisan baska bir betige ait olup olmadigini belirleme.
- Performans darbogazlarini belirleme ve bunlari belirli bilesenlere veya servislere atama.
- Her degisiklik algilama dongusu nun gorsel bir dokumuyle Angular'in ic calismalari hakkinda daha derin icgoru kazanma.

## Recording a profile

### Enable integration

Angular profil cikarmayi iki yoldan biriyle etkinlestirebilirsiniz:

1. Chrome'un konsol panelinde [`ng.enableProfiling()`](api/core/enableProfiling) calistirin veya
1. Uygulama baslangic kodunuza (`@angular/core`'dan iceri aktarilan) [`enableProfiling()`](api/core/enableProfiling) cagrisini ekleyin.

NOTE: Angular profil cikarma yalnizca gelistirme modunda calisir.

Baslangicta calisan tum olaylari yakalamak icin uygulama bootstrap'inde entegrasyonu nasil etkinlestirebileceginize dair bir ornek:

```ts
import {enableProfiling} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {MyApp} from './my-app';

// Turn on profiling *before* bootstrapping your application
// in order to capture all of the code run on start-up.
enableProfiling();
bootstrapApplication(MyApp);
```

### Record a profile

Chrome DevTools performans panelindeki **Record** dugmesini kullanin:

<img alt="Recording a profile" src="assets/images/best-practices/runtime-performance/recording-profile-in-chrome.png">

Profil kaydetme hakkinda daha fazla ayrinti icin [Chrome DevTools belgeleri](https://developer.chrome.com/docs/devtools/performance#record)'ne bakin.

## Interpreting a recorded profile

Performans sorunlarini hizla belirlemek ve teshis etmek icin "Angular" ozel izini kullanabilirsiniz. Asagidaki bolumler bazi yaygin profil cikarma senaryolarini tanimlamaktadir.

### Differentiating between your Angular application and other tasks on the same page

Angular ve Chrome verileri ayri ancak iliskili izlerde sunuldugu icin, Angular'in uygulama kodunun ne zaman calistirildigini, baska bir tarayici isleminin (tipik olarak duzenleme ve boyama) veya ayni sayfada calisan diger betiklerin (bu durumda ozel Angular izinde herhangi bir veri bulunmaz) aksine gorebilirsiniz:

<img alt="Profile data: Angular vs. 3rd party scripts execution" src="assets/images/best-practices/runtime-performance/profile-angular-vs-3rd-party.png">

Bu, daha fazla arastirmanin Angular uygulama koduna mi yoksa kod tabaninizin veya bagimlilikiarinizin diger bolumlerne mi odaklanmasi gerektigini belirlemenize olanak tanir.

### Color-coding

Angular, gorev turlerini ayirt etmek icin alev grafigi grafiklerinde renkler kullanir:

- 🟦 Mavi, uygulama gelistiricisi tarafindan yazilan TypeScript kodunu temsil eder (ornegin: servisler, bilesen yapicilari ve yasam dongusu kancalari vb.).
- 🟪 Mor, uygulama gelistiricisi tarafindan yazilan ve Angular derleyicisi tarafindan donusturulen sablon kodunu temsil eder.
- 🟩 Yesil, uygulama koduna giris noktalarini temsil eder ve kod calistirma _nedenlerini_ belirler.

Asagidaki ornekler, cesitli gercek kayitlarda tanimlanan renk kodlamasini gostermektedir.

#### Example: Application bootstrapping

Uygulama bootstrap sureci genellikle su ogenelerden olusur:

- `bootstrapApplication` cagrisi, kok bilesenin ornekelenmesi ve ilk degisiklik algilama gibi maviye isaretlenmis tetikleyiciler
- Bootstrap sirasinda orneklenen, yesile isaretlenmis cesitli DI servisleri.

<img alt="Profile data: bootstrap application" src="assets/images/best-practices/runtime-performance/profile-bootstrap-application.png">

#### Example: Component execution

Bir bilesenin islenmesi tipik olarak bir giris noktasi (mavi) ve ardindan sablon calistirmasi (mor) olarak temsil edilir. Bir sablon ise direktiflerin orneklenmesini ve yasam dongusu kancalarinin calistirlimasini (yesil) tetikleyebilir:

<img alt="Profile data: component processing" src="assets/images/best-practices/runtime-performance/profile-component-processing.png">

#### Example: Change detection

Bir degisiklik algilama dongusu genellikle bir veya daha fazla veri senkronizasyon gecisindan (mavi) olusur; her gecis bir bilesen alt kumesini gezer.

<img alt="Profile data: change detection" src="assets/images/best-practices/runtime-performance/profile-change-detection.png">

Bu veri gorsellestirmesi ile, degisiklik algilamaya dahil olan bilesenler ve hangilerinin atlangini (tipik olarak kirli olarak isaretlenmemis `OnPush` bilesenleri) hemen belirlemek mumkundur.

Ek olarak, bir degisiklik algilama icin senkronizasyon gecisi sayisini inceleyebilirsiniz. Birden fazla senkronizasyon gecisine sahip olmak, degisiklik algilama sirasinda durumun guncellendigini gostrebilir. Bundan kacinmalisiniz, cunku sayfa guncellemelerini yavaslatir ve en kotu durumda sonsuz dongulere bile yol acabilir.
