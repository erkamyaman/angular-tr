# Animasyon geçişleri ve tetikleyiciler

IMPORTANT: `@angular/animations` paketi artık kullanım dışıdır (deprecated). Angular ekibi, tüm yeni kodlar için animasyonlarda `animate.enter` ve `animate.leave` ile yerel CSS kullanmanızı önerir. Yeni giriş ve çıkış [animasyon rehberinde](guide/animations) daha fazla bilgi edinin. Ayrıca uygulamalarınızda saf CSS animasyonlarına nasıl geçiş yapabileceğinizi öğrenmek için [Angular'ın Animasyon paketinden geçiş](guide/animations/migration) belgesine bakın.

Bu rehber, `*` joker karakteri ve `void` gibi özel geçiş durumlarına derinlemesine girer. Ayrıca bu durumların bir görünüme giren ve görünümden ayrılan elemanlar için nasıl kullanıldığını da gösterir.
Bu bölüm ayrıca birden fazla animasyon tetikleyicisini, animasyon geri çağırmalarını ve anahtar kareler kullanan sıra tabanlı animasyonu inceler.

## Önceden tanımlanmış durumlar ve joker karakter eşleştirme

Angular'da, geçiş durumları [`state()`](api/animations/state) fonksiyonu aracılığıyla açıkça tanımlanabilir veya önceden tanımlanmış `*` joker karakteri ve `void` durumları kullanılarak tanımlanabilir.

### Joker karakter durumu

Bir yıldız işareti `*` veya _joker karakter_ herhangi bir animasyon durumuyla eşleşir.
Bu, HTML elemanının başlangıç veya bitiş durumundan bağımsız olarak geçerli olan geçişleri tanımlamak için kullanışlıdır.

Örneğin, `open => *` geçişi, elemanın durumu açık'tan başka herhangi bir şeye değiştiğinde geçerlidir.

<img alt="wildcard state expressions" src="assets/images/guide/animations/wildcard-state-500.png">

Aşağıda, `open` ve `closed` durumlarını kullanan önceki örnekle birlikte joker karakter durumunu kullanan başka bir kod örneği bulunmaktadır.
Her durum-durum geçiş çiftini tanımlamak yerine, `closed`'a herhangi bir geçiş 1 saniye sürer ve `open`'a herhangi bir geçiş 0.5 saniye sürer.

Bu, her biri için ayrı geçişler eklemek zorunda kalmadan yeni durumların eklenmesine olanak tanır.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-wildcard1"/>

Her iki yönde durumdan duruma geçişleri belirtmek için çift ok sözdizimini kullanın.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-wildcard2"/>

### Birden fazla geçiş durumu ile joker karakter durumu kullanma

İki durumlu buton örneğinde, yalnızca iki olası durum, `open` ve `closed` olduğu için joker karakter çok yararlı değildir.
Genel olarak, bir elemanın değişebileceği birden fazla potansiyel durumu olduğunda joker karakter durumlarını kullanın.
Buton `open`'dan `closed`'a veya `inProgress` gibi bir şeye değişebilirse, joker karakter durumu kullanmak gereken kodlama miktarını azaltabilir.

<img alt="wildcard state with 3 states" src="assets/images/guide/animations/wildcard-3-states.png">

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-transition"/>

`* => *` geçişi, iki durum arasında herhangi bir değişiklik olduğunda geçerlidir.

Geçişler tanımlandıkları sıraya göre eşleştirilir.
Bu nedenle, `* => *` geçişi üzerine başka geçişler uygulayabilirsiniz.
Örneğin, yalnızca `open => closed` için geçerli olacak stil değişiklikleri veya animasyonlar tanımlayın, ardından başka şekilde belirtilmemiş durum eşleşmeleri için `* => *`'i bir geri dönüş olarak kullanın.

Bunu yapmak için, daha spesifik geçişleri `* => *`'dan _önce_ listeleyin.

### Stillerle joker karakter kullanma

Animasyona mevcut stil değerinin ne olursa olsun onu kullanmasını ve bununla animasyon yapmasını söylemek için `*` joker karakterini bir stille kullanın.
Joker karakter, animasyonu yapılan durum tetikleyici içinde bildirilmemişse kullanılan bir geri dönüş değeridir.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition4"/>

### Void durumu

Sayfaya giren veya sayfadan ayrılan bir eleman için geçişleri yapılandırmak için `void` durumunu kullanın.
[Görünüme girme ve görünümden ayrılma animasyonları](guide/legacy-animations/transition-and-triggers#enter-ve-leave-takma-adları) konusuna bakın.

### Joker karakter ve void durumlarını birleştirme

Sayfaya giren ve sayfadan ayrılan animasyonları tetiklemek için bir geçişte joker karakter ve void durumlarını birleştirin:

- `* => void` geçişi, elemanın ayrılmadan önceki durumundan bağımsız olarak görünümden ayrıldığında geçerlidir
- `void => *` geçişi, elemanın girişte aldığı durumdan bağımsız olarak görünüme girdiğinde geçerlidir
- `*` joker karakter durumu, `void` dahil _herhangi bir_ durumla eşleşir

## Görünüme giriş ve çıkış animasyonu

Bu bölüm, sayfaya giren veya sayfadan ayrılan elemanların nasıl animasyonlanacağını gösterir.

Yeni bir davranış ekleyin:

- Kahramanlar listesine bir kahraman eklediğinizde, soldan sayfaya uçuyormuş gibi görünür
- Listeden bir kahramanı kaldırdığınızda, sağa doğru uçuyormuş gibi görünür

<docs-code header="hero-list-enter-leave.ts" path="adev/src/content/examples/animations/src/app/hero-list-enter-leave.ts" region="animationdef"/>

Önceki kodda, HTML elemanı bir görünüme bağlanmadığında `void` durumunu uyguladınız.

## :enter ve :leave takma adları

`:enter` ve `:leave`, `void => *` ve `* => void` geçişleri için takma adlardır.
Bu takma adlar birçok animasyon fonksiyonu tarafından kullanılır.

```ts {hideCopy}

transition ( ':enter', [ … ] ); // void => _ için takma ad
transition ( ':leave', [ … ] ); // _ => void için takma ad

```

Görünüme giren bir elemanı hedeflemek daha zordur çünkü henüz DOM'da değildir.
DOM'a eklenen veya DOM'dan kaldırılan HTML elemanlarını hedeflemek için `:enter` ve `:leave` takma adlarını kullanın.

### :enter ve :leave ile `*ngIf` ve `*ngFor` kullanma

`:enter` geçişi, herhangi bir `*ngIf` veya `*ngFor` görünümü sayfaya yerleştirildiğinde çalışır ve `:leave` bu görünümler sayfadan kaldırıldığında çalışır.

IMPORTANT: Giriş/çıkış davranışları bazen kafa karıştırıcı olabilir.
Genel kural olarak, Angular tarafından DOM'a eklenen herhangi bir elemanın `:enter` geçişinden geçtiğini düşünün. Yalnızca Angular tarafından doğrudan DOM'dan kaldırılan elemanlar `:leave` geçişinden geçer. Örneğin, bir elemanın görünümü, üst elemanı DOM'dan kaldırıldığı için DOM'dan kaldırılır.

Bu örnek, giriş ve çıkış animasyonu için `myInsertRemoveTrigger` adında özel bir tetikleyiciye sahiptir.
HTML şablonu aşağıdaki kodu içerir.

<docs-code header="insert-remove.html" path="adev/src/content/examples/animations/src/app/insert-remove.html" region="insert-remove"/>

Bileşen dosyasında, `:enter` geçişi 0 başlangıç opaklığını ayarlar. Ardından, eleman görünüme eklendikçe bu opaklığı 1'e değiştirmek için animasyonlar.

<docs-code header="insert-remove.ts" path="adev/src/content/examples/animations/src/app/insert-remove.ts" region="enter-leave-trigger"/>

Bu örneğin [`state()`](api/animations/state) kullanmasına gerek olmadığını unutmayın.

## :increment ve :decrement geçişleri

`transition()` fonksiyonu diğer seçici değerleri, `:increment` ve `:decrement` kabul eder.
Sayısal bir değer arttığında veya azaldığında bir geçişi başlatmak için bunları kullanın.

HELPFUL: Aşağıdaki örnek `query()` ve `stagger()` yöntemlerini kullanır.
Bu yöntemler hakkında daha fazla bilgi için [karmaşık sıralar](guide/legacy-animations/complex-sequences) sayfasına bakın.

<docs-code header="hero-list-page.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.ts" region="increment"/>

## Geçişlerde Boolean değerler

Bir tetikleyici bağlama değeri olarak bir Boolean değeri içeriyorsa, bu değer `true` ve `false` veya `1` ve `0` karşılaştıran bir `transition()` ifadesi kullanılarak eşleştirilebilir.

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.2.html" region="trigger-boolean"/>

Yukarıdaki kod parçasında, HTML şablonu bir `<div>` elemanını `isOpen` durum ifadesi ve `true` ve `false` olası değerleri ile `openClose` adında bir tetikleyiciye bağlar.
Bu desen, `open` ve `close` gibi iki adlandırılmış durum oluşturma pratiğine bir alternatiftir.

`@Component` metaverisi içindeki `animations:` özelliğinin altında, durum `true` olarak değerlendirildiğinde, ilişkili HTML elemanının yüksekliği bir joker karakter stili veya varsayılandır.
Bu durumda, animasyon elemanın animasyon başlamadan önce sahip olduğu yüksekliği kullanır.
Eleman `closed` olduğunda, eleman 0 yüksekliğe animasyonlanır, bu da onu görünmez yapar.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.2.ts" region="trigger-boolean"/>

## Birden fazla animasyon tetikleyicisi

Bir bileşen için birden fazla animasyon tetikleyicisi tanımlanabilir.
Animasyon tetikleyicilerini farklı elemanlara ekleyin ve elemanlar arasındaki üst-alt ilişkiler animasyonların nasıl ve ne zaman çalışacağını etkiler.

### Üst-alt animasyonlar

Angular'da bir animasyon her tetiklendiğinde, üst animasyon her zaman öncelik alır ve alt animasyonlar engellenir.
Bir alt animasyonun çalışması için, üst animasyonun alt animasyonlar içeren her elemanı sorgulaması gerekir. Ardından [`animateChild()`](api/animations/animateChild) fonksiyonunu kullanarak animasyonların çalışmesına izin verir.

#### Bir HTML elemanında animasyonu devre dışı bırakma

Bir HTML elemanında ve iç içe geçmiş tüm elemanlarda animasyonları kapatmak için `@.disabled` adında özel bir animasyon kontrol bağlaması yerleştirilir.
Doğru olduğunda, `@.disabled` bağlaması tüm animasyonların işlenmesini engeller.

Aşağıdaki kod örneği bu özelliğin nasıl kullanılacağını gösterir.

<docs-code-multifile>
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.4.html" region="toggle-animation"/>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.4.ts" region="toggle-animation" language="typescript"/>
</docs-code-multifile>

`@.disabled` bağlaması doğru olduğunda, `@childAnimation` tetikleyicisi başlamaz.

HTML şablonundaki bir eleman `@.disabled` ana bağlama kullanarak animasyonları kapattığında, animasyonlar tüm iç elemanlarda da kapatılır.
Tek bir eleman üzerinde birden fazla animasyonu seçici olarak kapatamazsınız.<!-- vale off -->

Seçici alt animasyonlar, devre dışı bırakılmış bir üst elemanda aşağıdaki yollardan biriyle çalıştırılabilir:

- Bir üst animasyon, HTML şablonunun devre dışı bırakılmış bölgelerinde bulunan iç elemanları toplamak için [`query()`](api/animations/query) fonksiyonunu kullanabilir.
  Bu elemanlar hala animasyonlanabilir.

<!-- vale on -->

- Bir alt animasyon bir üst tarafından sorgulanabilir ve daha sonra `animateChild()` fonksiyonuyla animasyonlanabilir

#### Tüm animasyonları devre dışı bırakma

Bir Angular uygulaması için tüm animasyonları kapatmak için, en üst Angular bileşenine `@.disabled` ana bağlamasını yerleştirin.

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="toggle-app-animations"/>

HELPFUL: Animasyonları uygulama çapında devre dışı bırakmak, uçtan uca \(E2E\) testleri sırasında faydalıdır.

## Animasyon geri çağırmaları

Animasyon `trigger()` fonksiyonu başladığında ve bittiğinde _geri çağırmalar_ yapar.
Aşağıdaki örnek, `openClose` tetikleyicisi içeren bir bileşeni göstermektedir.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="events1"/>

HTML şablonunda, animasyon olayı `@triggerName.start` ve `@triggerName.done` olarak `$event` aracılığıyla geri döndürülür; burada `triggerName` kullanılan tetikleyicinin adıdır.
Bu örnekte, `openClose` tetikleyicisi şu şekilde görünür.

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.3.html" region="callbacks"/>

Animasyon geri çağırmaları için potansiyel bir kullanım, bir veritabanı sorgusu gibi yavaş bir API çağrısı için katman oluşturmak olabilir.
Örneğin, arka plan sistemi işlemi bitene kadar kendi döngü animasyonuna sahip bir **InProgress** butonu oluşturulabilir.

Mevcut animasyon bittiğinde başka bir animasyon çağrılabilir.
Örneğin, API çağrısı tamamlandığında buton `inProgress` durumundan `closed` durumuna geçer.

Bir animasyon, aslında olmasa bile bir son kullanıcının işlemin daha _hızlı_ olduğunu algılamasını sağlayabilir.

Geri çağırmalar, bir hata ayıklama aracı olarak da kullanılabilir; örneğin tarayıcının Geliştirici JavaScript Konsolunda uygulamanın ilerlemesini görüntülemek için `console.warn()` ile birlikte.
Aşağıdaki kod parçası, `open` ve `closed` iki durumlu bir buton olan orijinal örnek için konsol log çıktısı oluşturur.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="events"/>

## Anahtar kareler

Birden fazla adımla sıralı olarak çalışan bir animasyon oluşturmak için _anahtar kareler_ kullanın.

Angular'ın `keyframe()` fonksiyonu, tek bir zamanlama bölümü içinde birçok stil değişikliğine izin verir.
Örneğin, buton solmak yerine tek bir 2 saniyelik zaman diliminde birkaç kez renk değiştirebilir.

<img alt="keyframes" src="assets/images/guide/animations/keyframes-500.png">

Bu renk değişikliği için kod şu şekilde görünebilir.

<docs-code header="status-slider.ts" path="adev/src/content/examples/animations/src/app/status-slider.ts" region="keyframes"/>

### Ofset

Anahtar kareler, animasyonda her stil değişikliğinin gerçekleştiği noktayı tanımlayan bir `offset` içerir.
Offsetler, animasyonun başlangıcını ve sonunu işaretleyen sıfırdan bire kadar göreceli ölçümlerdir. En az bir kez kullanılırsa anahtar kare adımlarının her birine uygulanmalıdır.

Anahtar kareler için offset tanımlamak isteğe bağlıdır.
Bunları atlarsanız, eşit aralıklı offsetler otomatik olarak atanır.
Örneğin, önceden tanımlanmış offsetleri olmayan üç anahtar kare 0, 0.5 ve 1 offsetlerini alır.
Önceki örnekteki orta geçiş için 0.8 offseti belirtmek şu şekilde görünebilir.

<img alt="keyframes with offset" src="assets/images/guide/animations/keyframes-offset-500.png">

Offsetleri belirtilmiş kod şu şekilde olur.

<docs-code header="status-slider.ts" path="adev/src/content/examples/animations/src/app/status-slider.ts" region="keyframesWithOffsets"/>

Tek bir animasyon içinde anahtar kareleri `duration`, `delay` ve `easing` ile birleştirebilirsiniz.

### Nabız efektli anahtar kareler

Animasyon boyunca belirli offsetlerde stiller tanımlayarak animasyonlarınızda bir nabız efekti oluşturmak için anahtar kareleri kullanın.

Nabız efekti oluşturmak için anahtar kareleri kullanmanın bir örneği:

- Orijinal `open` ve `closed` durumları, 1 saniyelik bir zaman diliminde gerçekleşen orijinal yükseklik, renk ve opaklık değişiklikleri
- Butonun aynı 1 saniyelik zaman diliminde düzensiz olarak nabız atıyormuş gibi görünmesine neden olan ortaya eklenmiş bir anahtar kare dizisi

<img alt="keyframes with irregular pulsation" src="assets/images/guide/animations/keyframes-pulsation.png">

Bu animasyon için kod parçası şu şekilde görünebilir.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.1.ts" region="trigger"/>

### Animasyonlanabilir özellikler ve birimler

Angular animasyonları web animasyonları üzerine kurulmuştur, bu nedenle tarayıcının animasyonlanabilir olarak kabul ettiği herhangi bir özelliği animasyonlayabilirsiniz.
Bu; konumlar, boyutlar, dönüşümler, renkler, kenarlıklar ve daha fazlasını içerir.
W3C, [CSS Transitions](https://www.w3.org/TR/css-transitions-1) sayfasında animasyonlanabilir özelliklerin bir listesini tutar.

Sayısal değeri olan özellikler için, değeri uygun sonek ile bir dize olarak tırnak içinde sağlayın:

- 50 piksel:
  `'50px'`

- Göreceli font boyutu:
  `'3em'`

- Yüzde:
  `'100%'`

Değeri bir sayı olarak da sağlayabilirsiniz. Bu gibi durumlarda Angular varsayılan birim olarak piksel veya `px` kabul eder.
50 pikseli `50` olarak ifade etmek `'50px'` demekle aynıdır.

HELPFUL: `"50"` dizesi ise geçerli olarak kabul edilmez\).

### Joker karakterlerle otomatik özellik hesaplama

Bazen bir boyutsal stil özelliğinin değeri çalışma zamanına kadar bilinmez.
Örneğin, elemanların genişlikleri ve yükseklikleri genellikle içeriklerine veya ekran boyutuna bağlıdır.
Bu özellikler genellikle CSS kullanarak animasyonlanması zordur.

Bu durumlarda, `style()` altında özel bir `*` joker özellik değeri kullanabilirsiniz. Bu belirli stil özelliğinin değeri çalışma zamanında hesaplanır ve ardından animasyona eklenir.

Aşağıdaki örnek, bir HTML elemanı sayfadan ayrıldığında kullanılan `shrinkOut` adında bir tetikleyiciye sahiptir.
Animasyon, elemanın ayrılmadan önce sahip olduğu yüksekliği alır ve o yükseklikten sıfıra animasyonlar.

<docs-code header="hero-list-auto.ts" path="adev/src/content/examples/animations/src/app/hero-list-auto.ts" region="auto-calc"/>

### Anahtar kareler özeti

Angular'daki `keyframes()` fonksiyonu, tek bir geçiş içinde birden fazla ara stil belirtmenize olanak tanır. Her stil değişikliğinin animasyonda nerede gerçekleşmesi gerektiğini tanımlamak için isteğe bağlı bir `offset` kullanılabilir.

## Angular animasyonları hakkında daha fazla bilgi

Aşağıdakilerle de ilgilenebilirsiniz:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Introduction to Angular animations"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Complex animation sequences"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Reusable animations"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
  <docs-pill href="guide/animations/migration" title="Migrating to Native CSS Animations"/>
</docs-pill-row>
