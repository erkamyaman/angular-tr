# Complex animation sequences

IMPORTANT: `@angular/animations` paketi artik kullanim disidir (deprecated). Angular ekibi, tum yeni kodlar icin animasyonlarda `animate.enter` ve `animate.leave` ile yerel CSS kullanmanizi onerir. Yeni giris ve cikis [animasyon rehberinde](/guide/animations) daha fazla bilgi edinin. Ayrica uygulamalarinizda saf CSS animasyonlarina nasil gecis yapabileceginizi ogrenmek icin [Angular'in Animasyon paketinden gecis](guide/animations/migration) belgesine bakin.

Simdiye kadar, tek HTML elemanlarinin basit animasyonlarini ogrendik.
Angular ayrica, sayfaya girerken ve sayfadan ayrilirken tam bir grid veya eleman listesi gibi koordineli dizileri animasyonlamaniza da olanak tanir.
Birden fazla animasyonu paralel olarak calistirmayi veya birbiri ardina sirali olarak ayrik animasyonlar calistirmayi secebilirsiniz.

Karmasik animasyon dizilerini kontrol eden fonksiyonlar sunlardir:

| Functions                         | Details                                                              |
| :-------------------------------- | :------------------------------------------------------------------- |
| `query()`                         | Bir veya daha fazla ic HTML elemani bulur.                           |
| `stagger()`                       | Birden fazla eleman icin animasyonlara kademeli bir gecikme uygular. |
| [`group()`](api/animations/group) | Birden fazla animasyon adimini paralel olarak calistirir.            |
| `sequence()`                      | Animasyon adimlarini birer birer calistirir.                         |

## The query() function

Karmasik animasyonlarin cogu, alt elemanlari bulmak ve onlara animasyon uygulamak icin `query()` fonksiyonuna dayanir, bunlarin temel ornekleri sunlardir:

| Examples                            | Details                                                                                                                                                                            |
| :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query()` ardindan `animate()`      | Basit HTML elemanlarini sorgulamak ve dogrudan animasyon uygulamak icin kullanilir.                                                                                                |
| `query()` ardindan `animateChild()` | Kendi animasyon metaverileri olan alt elemanlari sorgulamak ve bu animasyonlari tetiklemek icin kullanilir \(aksi takdirde mevcut/ust elemanin animasyonu tarafindan engellenir\). |

`query()`'nin ilk argumani, asagidaki Angular'a ozel tokenleri de icerebilen bir [css secicisi](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) dizesidir:

| Tokens                     | Details                                                           |
| :------------------------- | :---------------------------------------------------------------- |
| `:enter` <br /> `:leave`   | Giren/ayrilan elemanlar icin.                                     |
| `:animating`               | Su anda animasyonlu olan elemanlar icin.                          |
| `@*` <br /> `@triggerName` | Herhangi bir veya belirli bir tetikleyiciye sahip elemanlar icin. |
| `:self`                    | Animasyonlu elemanin kendisi.                                     |

<docs-callout title="Entering and Leaving Elements">

Tum alt elemanlar aslinda giren/ayrilan olarak kabul edilmez; bu bazen karsi-sezgisel ve kafa karistirici olabilir. Daha fazla bilgi icin lutfen [query api belgelerine](api/animations/query#entering-and-leaving-elements) bakin.

Ayrica bunu animasyonlar orneginde \(animasyonlar [giris bolumunde](guide/legacy-animations#about-this-guide) tanitilan\) Sorgulama sekmesi altinda gorebilirsiniz.

</docs-callout>

## Animate multiple elements using query() and stagger() functions

`query()` araciligiyla alt elemanlari sorguladiktan sonra, `stagger()` fonksiyonu, animasyonlu her sorgulanan oge arasinda bir zamanlama boslugu tanimlayarak elemanlari aralarinda bir gecikmeyle animasyonlar.

Asagidaki ornek, yukaridan asagiya dogru sirayla, hafif bir gecikmeyle her birini ekleyen bir listeyi \(kahramanlar\) animasyonlamak icin `query()` ve `stagger()` fonksiyonlarinin nasil kullanilacagini gostermektedir.

- Sayfaya giren ve belirli kriterleri karsilayan bir eleman aramak icin `query()` kullanin
- Bu elemanlarin her biri icin, eleman icin ayni baslangic stilini ayarlamak icin `style()` kullanin.
  Seffaf yapin ve yerine kayabilmesi icin konumundan cikarmak icin `transform` kullanin.

- Her animasyonu 30 milisaniye geciktirmek icin `stagger()` kullanin
- Ozel tanimli bir yumusaklik egrisi kullanarak ekrandaki her elemani 0.5 saniye boyunca animasyonlayin, ayni anda solarak ve donusumu geri alarak

<docs-code header="hero-list-page.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.ts" region="page-animations"/>

## Parallel animation using group() function

Art arda gelen her animasyon arasinda nasil gecikme ekleyeceginizi gordunuz.
Ancak paralel olarak gerceklesen animasyonlari yapilandirmak da isteyebilirsiniz.
Ornegin, ayni elemanin iki CSS ozelligini animasyonlamak ancak her biri icin farkli bir `easing` fonksiyonu kullanmak isteyebilirsiniz.
Bunun icin animasyon [`group()`](api/animations/group) fonksiyonunu kullanabilirsiniz.

HELPFUL: [`group()`](api/animations/group) fonksiyonu, animasyonlu elemanlar yerine animasyon _adimlarini_ gruplamak icin kullanilir.

Asagidaki ornek, iki farkli zamanlama yapilandirmasi icin hem `:enter` hem de `:leave` uzerinde [`group()`](api/animations/group) kullanir, boylece ayni elemana paralel olarak iki bagimsiz animasyon uygular.

<docs-code header="hero-list-groups.ts (excerpt)" path="adev/src/content/examples/animations/src/app/hero-list-groups.ts" region="animationdef"/>

## Sequential vs. parallel animations

Karmasik animasyonlarda ayni anda bircok sey olabilir.
Ancak biri digeri ardina gerceklesen bircok animasyon iceren bir animasyon olusturmak isterseniz ne olur? Daha once birden fazla animasyonu ayni anda, paralel olarak calistirmak icin [`group()`](api/animations/group) kullandiniz.

`sequence()` adinda ikinci bir fonksiyon, ayni animasyonlari birbiri ardina calistirmaniza olanak tanir.
`sequence()` icinde, animasyon adimlari `style()` veya `animate()` fonksiyon cagrilarindan olusur.

- Saglanan stil verilerini hemen uygulamak icin `style()` kullanin.
- Belirli bir zaman araligi boyunca stil verilerini uygulamak icin `animate()` kullanin.

## Filter animation example

Ornek sayfadaki baska bir animasyona goz atin.
Filtre/Kademeli sekmesi altinda, **Search Heroes** metin kutusuna `Magnet` veya `tornado` gibi bir metin girin.

Filtre, siz yazarken gercek zamanli olarak calisir.
Her yeni harf yazdiginizda elemanlar sayfadan ayrilir ve filtre giderek daha kati hale gelir.
Filtre kutusundaki her harfi sildiginizde kahramanlar listesi yavaş yavaş sayfaya geri doner.

HTML sablonu `filterAnimation` adinda bir tetikleyici icerir.

<docs-code header="hero-list-page.html" path="adev/src/content/examples/animations/src/app/hero-list-page.html" region="filter-animations" language="angular-html"/>

Bilesenin dekoratorundaki `filterAnimation` uc gecis icerir.

<docs-code header="hero-list-page.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.ts" region="filter-animations"/>

Bu ornekteki kod asagidaki gorevleri gerceklestirir:

- Kullanici ilk kez bu sayfayi actiginda veya bu sayfaya gittiginde animasyonlari atlar \(filtre animasyonu zaten orada olani daraltir, bu nedenle yalnizca DOM'da zaten var olan elemanlar uzerinde calisir\)
- Arama girdisinin degerine gore kahramanlari filtreler

Her degisiklik icin:

- DOM'dan ayrilan bir elemani opakligini ve genisligini 0'a ayarlayarak gizler
- DOM'a giren bir elemani 300 milisaniye boyunca animasyonlar.
  Animasyon sirasinda eleman varsayilan genisligini ve opakligini alir.

- DOM'a giren veya DOM'dan ayrilan birden fazla eleman varsa, sayfanin ustunden baslayarak her eleman arasinda 50 milisaniyelik bir gecikmeyle her animasyonu kademeli yapar

## Animating the items of a reordering list

Angular `*ngFor` liste ögelerini kutudan cikar cikmaz dogru sekilde animasyonlasa da, siralari degistiginde bunu yapamaz.
Bunun nedeni, hangi elemanin hangisi oldugunu kaybetmesi ve bu da bozuk animasyonlara yol acmasidir.
Angular'in bu elemanlari takip etmesine yardimci olmanin tek yolu, `NgForOf` yonergesine bir `TrackByFunction` atamaktir.
Bu, Angular'in hangi elemanin hangisi oldugunu her zaman bilmesini saglar ve boylece dogru animasyonlari dogru elemanlara her zaman uygulamasina olanak tanir.

IMPORTANT: Bir `*ngFor` listesinin ogelerini animasyonlamaniz gerekiyorsa ve bu ogelerin sirasinin calisma zamaninda degisme olasiligi varsa, her zaman bir `TrackByFunction` kullanin.

## Animations and Component View Encapsulation

Angular animasyonlari, bilesenlerin DOM yapisina dayanir ve [Gorünum Kapsullemeyi](guide/components/styling#style-scoping) dogrudan dikkate almaz; bu, `ViewEncapsulation.Emulated` kullanan bilesenlerin, `ViewEncapsulation.None` kullaniyorlarmis gibi davrandiklari anlamina gelir (`ViewEncapsulation.ShadowDom` ve `ViewEncapsulation.ExperimentalIsolatedShadowDom` kisaca tartisacagimiz gibi farkli davranir).

Ornegin, `query()` fonksiyonu (Animasyonlar rehberinin geri kalaninda daha fazlasini goreceksiniz) emule edilmis gorünum kapsullemesi kullanan bir bilesen agacinin en ustune uygulanirsa, boyle bir sorgu agacin herhangi bir derinligindeki DOM elemanlarini tanimlayabilir (ve dolayisiyla animasyonlayabilir).

Ote yandan, `ViewEncapsulation.ShadowDom` ve `ViewEncapsulation.ExperimentalIsolatedShadowDom`, DOM elemanlarini [`ShadowRoot`](https://developer.mozilla.org/docs/Web/API/ShadowRoot) elemanlari icinde "gizleyerek" bilesenin DOM yapisini degistirir. Bu tur DOM manipulasyonlari, basit DOM yapisina dayanan ve `ShadowRoot` elemanlarini dikkate almayan bazi animasyon uygulamalarinin duzgun calismesini engeller. Bu nedenle, ShadowDom gorünum kapsullemesini kullanan bilesenleri iceren gorünumlere animasyon uygulamaktan kacinilmasi onerilir.

## Animation sequence summary

Birden fazla elemani animasyonlamak icin Angular fonksiyonlari, ic elemanlari bulmak icin `query()` ile baslar; ornegin, bir `<div>` icindeki tum resimleri toplamak.
Kalan fonksiyonlar, `stagger()`, [`group()`](api/animations/group) ve `sequence()`, kademeler uygular veya birden fazla animasyon adiminin nasil uygulanacagini kontrol etmenize olanak tanir.

## More on Angular animations

Asagidakilerle de ilgilenebilirsiniz:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Introduction to Angular animations"/>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="Transition and triggers"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Reusable animations"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
  <docs-pill href="guide/animations/migration" title="Migrating to Native CSS Animations"/>
</docs-pill-row>
