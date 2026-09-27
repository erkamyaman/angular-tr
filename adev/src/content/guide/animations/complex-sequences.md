# Karmaşık animasyon dizileri

IMPORTANT: `@angular/animations` paketi artık kullanım dışıdır (deprecated). Angular ekibi, tüm yeni kodlar için animasyonlarda `animate.enter` ve `animate.leave` ile yerel CSS kullanmanızı önerir. Yeni giriş ve çıkış [animasyon rehberinde](/guide/animations) daha fazla bilgi edinin. Ayrıca uygulamalarınızda saf CSS animasyonlarına nasıl geçiş yapabileceğinizi öğrenmek için [Angular'ın Animasyon paketinden geçiş](guide/animations/migration) belgesine bakın.

Şimdiye kadar, tek HTML elemanlarının basit animasyonlarını öğrendik.
Angular ayrıca, sayfaya girerken ve sayfadan ayrılırken tam bir grid veya eleman listesi gibi koordineli dizileri animasyonlamanıza da olanak tanır.
Birden fazla animasyonu paralel olarak çalıştırmayı veya birbiri ardına sıralı olarak ayrık animasyonlar çalıştırmayı seçebilirsiniz.

Karmaşık animasyon dizilerini kontrol eden fonksiyonlar şunlardır:

| Fonksiyonlar                      | Ayrıntılar                                                           |
| :-------------------------------- | :------------------------------------------------------------------- |
| `query()`                         | Bir veya daha fazla iç HTML elemanı bulur.                           |
| `stagger()`                       | Birden fazla eleman için animasyonlara kademeli bir gecikme uygular. |
| [`group()`](api/animations/group) | Birden fazla animasyon adımını paralel olarak çalıştırır.            |
| `sequence()`                      | Animasyon adımlarını birer birer çalıştırır.                         |

## query() fonksiyonu {#the-query-function}

Karmaşık animasyonların çoğu, alt elemanları bulmak ve onlara animasyon uygulamak için `query()` fonksiyonuna dayanır. Temel örnekler şunları içerir:

| Örnekler                            | Ayrıntılar                                                                                                                                                                         |
| :---------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query()` ardından `animate()`      | Basit HTML elemanlarını sorgulamak ve doğrudan animasyon uygulamak için kullanılır.                                                                                                |
| `query()` ardından `animateChild()` | Kendi animasyon metaverileri olan alt elemanları sorgulamak ve bu animasyonları tetiklemek için kullanılır \(aksi takdirde mevcut/üst elemanın animasyonu tarafından engellenir\). |

`query()`'nin ilk argümanı, aşağıdaki Angular'a özel tokenleri de içerebilen bir [css seçicisi](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) dizesidir:

| Tokenler                   | Ayrıntılar                                                        |
| :------------------------- | :---------------------------------------------------------------- |
| `:enter` <br /> `:leave`   | Giren/ayrılan elemanlar için.                                     |
| `:animating`               | Şu anda animasyonlu olan elemanlar için.                          |
| `@*` <br /> `@triggerName` | Herhangi bir veya belirli bir tetikleyiciye sahip elemanlar için. |
| `:self`                    | Animasyonlu elemanın kendisi.                                     |

<docs-callout title="Giren ve Çıkan Elemanlar">

Tüm alt elemanlar aslında giren/ayrılan olarak kabul edilmez; bu bazen karşı-sezgisel ve kafa karıştırıcı olabilir. Daha fazla bilgi için lütfen [query api belgelerine](api/animations/query#entering-and-leaving-elements) bakın.

Ayrıca bunu animasyonlar örneğinde \(animasyonlar [giriş bölümünde](guide/legacy-animations#bu-rehber-hakkında) tanıtılan\) Sorgulama sekmesi altında görebilirsiniz.

</docs-callout>

## query() ve stagger() fonksiyonlarını kullanarak birden fazla elemanı animasyonlama {#animate-multiple-elements-using-query-and-stagger-functions}

`query()` ile alt elemanları sorguladıktan sonra, `stagger()` fonksiyonu her öğe arasında bir zamanlama boşluğu tanımlamanıza olanak tanır ve elemanları aralarında bir gecikmeyle animasyonlar.

Aşağıdaki örnek, yukarıdan aşağıya doğru sırayla, hafif bir gecikmeyle her birini ekleyen bir listeyi \(kahramanlar\) animasyonlamak için `query()` ve `stagger()` fonksiyonlarının nasıl kullanılacağını göstermektedir.

- Sayfaya giren ve belirli kriterleri karşılayan bir eleman aramak için `query()` kullanın
- Bu elemanların her biri için, eleman için aynı başlangıç stilini ayarlamak için `style()` kullanın.
  Şeffaf yapın ve yerine kayabilmesi için konumundan çıkarmak için `transform` kullanın.

- Her animasyonu 30 milisaniye geciktirmek için `stagger()` kullanın
- Özel tanımlı bir yumuşaklık eğrisi kullanarak ekrandaki her elemanı 0.5 saniye boyunca animasyonlayın, aynı anda solarak ve dönüşümü geri alarak

<docs-code header="hero-list-page.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.ts" region="page-animations"/>

## group() fonksiyonunu kullanarak paralel animasyon {#parallel-animation-using-group-function}

Art arda gelen her animasyon arasında nasıl gecikme ekleyeceğinizi gördünüz.
Ancak paralel olarak gerçekleşen animasyonları yapılandırmak da isteyebilirsiniz.
Örneğin, aynı elemanın iki CSS özelliğini animasyonlamak ancak her biri için farklı bir `easing` fonksiyonu kullanmak isteyebilirsiniz.
Bunun için animasyon [`group()`](api/animations/group) fonksiyonunu kullanabilirsiniz.

HELPFUL: [`group()`](api/animations/group) fonksiyonu, animasyonlu elemanlar yerine animasyon _adımlarını_ gruplamak için kullanılır.

Aşağıdaki örnek, iki farklı zamanlama yapılandırması için hem `:enter` hem de `:leave` üzerinde [`group()`](api/animations/group) kullanır, böylece aynı elemana paralel olarak iki bağımsız animasyon uygular.

<docs-code header="hero-list-groups.ts (excerpt)" path="adev/src/content/examples/animations/src/app/hero-list-groups.ts" region="animationdef"/>

## Sıralı ve paralel animasyonlar {#sequential-vs-parallel-animations}

Karmaşık animasyonlarda aynı anda birçok şey olabilir.
Ancak biri diğeri ardına gerçekleşen birçok animasyon içeren bir animasyon oluşturmak isterseniz ne olur? Daha önce birden fazla animasyonu aynı anda, paralel olarak çalıştırmak için [`group()`](api/animations/group) kullandınız.

`sequence()` adında ikinci bir fonksiyon, aynı animasyonları birbiri ardına çalıştırmanıza olanak tanır.
`sequence()` içinde, animasyon adımları `style()` veya `animate()` fonksiyon çağrılarından oluşur.

- Sağlanan stil verilerini hemen uygulamak için `style()` kullanın.
- Belirli bir zaman aralığı boyunca stil verilerini uygulamak için `animate()` kullanın.

## Filtre animasyonu örneği {#filter-animation-example}

Örnek sayfadaki başka bir animasyona göz atın.
Filtre/Kademeli sekmesi altında, **Search Heroes** metin kutusuna `Magnet` veya `tornado` gibi bir metin girin.

Filtre, siz yazarken gerçek zamanlı olarak çalışır.
Her yeni harf yazdığınızda elemanlar sayfadan ayrılır ve filtre giderek daha katı hale gelir.
Filtre kutusundaki her harfi sildiğinizde kahramanlar listesi yavaş yavaş sayfaya geri döner.

HTML şablonu `filterAnimation` adında bir tetikleyici içerir.

<docs-code header="hero-list-page.html" path="adev/src/content/examples/animations/src/app/hero-list-page.html" region="filter-animations" language="angular-html"/>

Bileşenin dekoratöründeki `filterAnimation` üç geçiş içerir.

<docs-code header="hero-list-page.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.ts" region="filter-animations"/>

Bu örnekteki kod aşağıdaki görevleri gerçekleştirir:

- Kullanıcı ilk kez bu sayfayı açtığında veya bu sayfaya gittiğinde animasyonları atlar \(filtre animasyonu zaten orada olanı daraltır, bu nedenle yalnızca DOM'da zaten var olan elemanlar üzerinde çalışır\)
- Arama girdisinin değerine göre kahramanları filtreler

Her değişiklik için:

- DOM'dan ayrılan bir elemanı opaklığını ve genişliğini 0'a ayarlayarak gizler
- DOM'a giren bir elemanı 300 milisaniye boyunca animasyonlar.
  Animasyon sırasında eleman varsayılan genişliğini ve opaklığını alır.

- DOM'a giren veya DOM'dan ayrılan birden fazla eleman varsa, sayfanın üstünden başlayarak her eleman arasında 50 milisaniyelik bir gecikmeyle her animasyonu kademeli yapar

## Yeniden sıralanan bir listenin öğelerini animasyonlama {#animating-the-items-of-a-reordering-list}

Angular `*ngFor` liste ögelerini kutudan çıkar çıkmaz doğru şekilde animasyonlasa da, sıraları değiştiğinde bunu yapamaz.
Bunun nedeni, hangi elemanın hangisi olduğunu kaybetmesi ve bu da bozuk animasyonlara yol açmasıdır.
Angular'ın bu elemanları takip etmesine yardımcı olmanın tek yolu, `NgForOf` yönergesine bir `TrackByFunction` atamaktır.
Bu, Angular'ın hangi elemanın hangisi olduğunu her zaman bilmesini sağlar ve böylece doğru animasyonları doğru elemanlara her zaman uygulamasına olanak tanır.

IMPORTANT: Bir `*ngFor` listesinin öğelerini animasyonlamanız gerekiyorsa ve bu öğelerin sırasının çalışma zamanında değişme olasılığı varsa, her zaman bir `TrackByFunction` kullanın.

## Animasyonlar ve Bileşen Görünüm Kapsüllemesi {#animations-and-component-view-encapsulation}

Angular animasyonları, bileşenlerin DOM yapısına dayanır ve [Görünüm Kapsüllemeyi](guide/components/styling#style-scoping) doğrudan dikkate almaz; bu, `ViewEncapsulation.Emulated` kullanan bileşenlerin, `ViewEncapsulation.None` kullanıyorlarmış gibi davrandıkları anlamına gelir (`ViewEncapsulation.ShadowDom` ve `ViewEncapsulation.ExperimentalIsolatedShadowDom` kısaca tartışacağımız gibi farklı davranır).

Örneğin, `query()` fonksiyonu (Animasyonlar rehberinin geri kalanında daha fazlasını göreceksiniz) emüle edilmiş görünüm kapsüllemesi kullanan bir bileşen ağacının en üstüne uygulanırsa, böyle bir sorgu ağacın herhangi bir derinliğindeki DOM elemanlarını tanımlayabilir (ve dolayısıyla animasyonlayabilir).

Öte yandan, `ViewEncapsulation.ShadowDom` ve `ViewEncapsulation.ExperimentalIsolatedShadowDom`, DOM elemanlarını [`ShadowRoot`](https://developer.mozilla.org/docs/Web/API/ShadowRoot) elemanları içinde "gizleyerek" bileşenin DOM yapısını değiştirir. Bu tür DOM manipülasyonları, basit DOM yapısına dayanan ve `ShadowRoot` elemanlarını dikkate almayan bazı animasyon uygulamalarının düzgün çalışmasını engeller. Bu nedenle, ShadowDom görünüm kapsüllemesini kullanan bileşenleri içeren görünümlere animasyon uygulamaktan kaçınılması önerilir.

## Animasyon dizisi özeti {#animation-sequence-summary}

Birden fazla elemanı animasyonlamak için Angular fonksiyonları, iç elemanları bulmak için `query()` ile başlar; örneğin, bir `<div>` içindeki tüm resimleri toplamak.
Kalan fonksiyonlar, `stagger()`, [`group()`](api/animations/group) ve `sequence()`, kademeler uygular veya birden fazla animasyon adımının nasıl uygulanacağını kontrol etmenize olanak tanır.

## Angular animasyonları hakkında daha fazlası {#more-on-angular-animations}

Aşağıdakilerle de ilgilenebilirsiniz:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Angular Animasyonlarına Giriş"/>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="Animasyon geçişleri ve tetikleyiciler"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Yeniden kullanılabilir animasyonlar"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Rota geçiş animasyonları"/>
  <docs-pill href="guide/animations/migration" title="Angular'ın Animasyon paketinden geçiş"/>
</docs-pill-row>
