# Angular Animasyonlarına Giriş

IMPORTANT: `@angular/animations` paketi artık kullanım dışıdır (deprecated). Angular ekibi, tüm yeni kodlar için animasyonlarda `animate.enter` ve `animate.leave` ile yerel CSS kullanmanızı önerir. Yeni giriş ve çıkış [animasyon rehberinde](guide/animations) daha fazla bilgi edinin. Ayrıca uygulamalarınızda saf CSS animasyonlarına nasıl geçiş yapabileceğinizi öğrenmek için [Angular'ın Animasyon paketinden geçiş](guide/animations/migration) belgesine bakın.

Animasyon, hareket yanılsaması sağlar: HTML elemanları zaman içinde stil değiştirir.
İyi tasarlanmış animasyonlar uygulamanızı daha sezgisel ve ilgi çekici hale getirebilir, ancak sadece görsel bir unsur değildir.
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
  Uygulamanız yüklendiğinde hemen bir animasyonun gerçekleşmesi gerekiyorsa,
  hevesle yüklenen animasyonlar modülüne geçmek isteyeceksiniz. Bunun yerine `@angular/platform-browser/animations`'dan `provideAnimations`'i
  içeri aktarın ve `bootstrapApplication` fonksiyon çağrısında `provideAnimationsAsync` **yerine** `provideAnimations` kullanın.
</docs-callout>

`NgModule` tabanlı uygulamalar için, Angular kök uygulama modülünüze animasyon yeteneklerini tanıtan `BrowserAnimationsModule`'u içeri aktarın.

<docs-code header="app.module.ts" path="adev/src/content/examples/animations/src/app/app.module.1.ts"/>
</docs-step>
<docs-step title="Importing animation functions into component files">
Bileşen dosyalarında belirli animasyon fonksiyonları kullanmayı planlıyorsanız, bu fonksiyonları `@angular/animations`'dan içeri aktarın.

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="imports"/>

Bu rehberin sonundaki tüm [kullanılabilir animasyon fonksiyonlarına](guide/legacy-animations#animasyonlar-api-özeti) bakın.

</docs-step>
<docs-step title="Adding the animation metadata property">
Bileşen dosyasında, `@Component()` dekoratörü içinde `animations:` adında bir metaveri özelliği ekleyin.
Bir animasyonu tanımlayan tetikleyiciyi `animations` metaveri özelliğinin içine yerleştirirsiniz.

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="decorator"/>
</docs-step>
</docs-workflow>

## Bir geçişi animasyonlama

Tek bir HTML elemanını bir durumdan diğerine değiştiren bir geçişi animasyonlayalım.
Örneğin, bir butonun kullanıcının son eylemine göre **Open** veya **Closed** gösterdiğini belirtebilirsiniz.
Buton `open` durumundayken görünür ve sarıdır.
`closed` durumundayken yarı saydam ve mavidir.

HTML'de bu nitelikler renk ve opaklık gibi sıradan CSS stilleri kullanılarak ayarlanır.
Angular'da, animasyonlarla kullanmak üzere bir dizi CSS stili belirtmek için `style()` fonksiyonunu kullanın.
Bir animasyon durumunda bir dizi stili toplayın ve duruma `open` veya `closed` gibi bir ad verin.

HELPFUL: Basit geçişlerle animasyonlanacak yeni bir `open-close` bileşeni oluşturalım.

Bileşeni oluşturmak için terminalde aşağıdaki komutu çalıştırın:

```shell
ng g component open-close
```

Bu, bileşeni `src/app/open-close.ts` konumunda oluşturacaktır.

### Animasyon durumu ve stilleri

Her geçişin sonunda çağrılacak farklı durumları tanımlamak için Angular'ın [`state()`](api/animations/state) fonksiyonunu kullanın.
Bu fonksiyon iki argüman alır:
`open` veya `closed` gibi benzersiz bir ad ve bir `style()` fonksiyonu.

Belirli bir durum adıyla ilişkilendirilecek bir dizi stili tanımlamak için `style()` fonksiyonunu kullanın.
`backgroundColor` gibi tire içeren stil nitelikleri için _camelCase_ kullanmanız veya `'background-color'` gibi tırnak içine almanız gerekir.

Angular'ın [`state()`](api/animations/state) fonksiyonunun `style⁣­(⁠)` fonksiyonuyla CSS stil niteliklerini ayarlamak için nasıl çalıştığını görelim.
Bu kod parçasında, durum için birden fazla stil niteliği aynı anda ayarlanır.
`open` durumunda, butonun yüksekliği 200 piksel, opaklığı 1 ve arka plan rengi sarıdır.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state1"/>

Aşağıdaki `closed` durumunda, butonun yüksekliği 100 piksel, opaklığı 0.8 ve arka plan rengi mavidir.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state2"/>

### Geçişler ve zamanlama

Angular'da birden fazla stili animasyon olmadan ayarlayabilirsiniz.
Ancak, daha fazla iyileştirme olmadan, buton anında dönüşür; solma, küçülme veya bir değişikliğin gerçekleştiğini gösteren başka görünür bir gösterge olmadan.

Değişikliği daha az ani yapmak için, bir süre boyunca bir durumdan diğerine olan değişiklikleri belirten bir animasyon _geçişi_ tanımlamanız gerekir.
`transition()` fonksiyonu iki argüman kabul eder:
Birinci argüman, iki geçiş durumu arasındaki yönü tanımlayan bir ifadeyi kabul eder ve ikinci argüman bir veya bir dizi `animate()` adımını kabul eder.

Bir geçişin sürecini, gecikmesini ve yumuşaklığını tanımlamak ve geçişler sırasında stilleri tanımlamak için stil fonksiyonunu belirlemek için `animate()` fonksiyonunu kullanın.
Çok adımlı animasyonlar için `keyframes()` fonksiyonunu tanımlamak için `animate()` fonksiyonunu kullanın.
Bu tanımlar, `animate()` fonksiyonunun ikinci argümanı içine yerleştirilir.

#### Animasyon meta verileri: süre, gecikme ve yumuşaklık

`animate()` fonksiyonu \(geçiş fonksiyonunun ikinci argümanı\) `timings` ve `styles` girdi parametrelerini kabul eder.

`timings` parametresi üç kısımda tanımlanmış bir sayı veya dize alır.

```ts
animate(duration);
```

veya

```ts
animate('duration delay easing');
```

Birinci kısım, `duration`, zorunludur.
Süre, tırnak işareti olmadan bir sayı olarak milisaniye cinsinden veya tırnak işareti ve bir zaman belirteci ile saniye cinsinden ifade edilebilir.
Örneğin, saniyenin onda biri süresi şu şekilde ifade edilebilir:

- Düz sayı olarak, milisaniye cinsinden:
  `100`

- Dize olarak, milisaniye cinsinden:
  `'100ms'`

- Dize olarak, saniye cinsinden:
  `'0.1s'`

İkinci argüman, `delay`, `duration` ile aynı sözdizimine sahiptir.
Örneğin:

- 100ms bekle ve ardından 200ms çalış: `'0.2s 100ms'`

Üçüncü argüman, `easing`, animasyonun çalışma süresi boyunca nasıl [hızlandığını ve yavaşlayamadığını](https://easings.net) kontrol eder.
Örneğin, `ease-in` animasyonun yavaş başlamasına ve ilerledikçe hız kazanmasına neden olur.

- 100ms bekle, 200ms çalış.
  Hızlı başlamak ve yavaşça bir dinlenme noktasına yavaşmak için bir yavaşlatma eğrisi kullanın:
  `'0.2s 100ms ease-out'`

- 200ms çalış, gecikme yok.
  Yavaş başlamak, ortada hızlanmak ve sonra sonunda yavaşça yavaşmak için standart bir eğri kullanın:
  `'0.2s ease-in-out'`

- Hemen başla, 200ms çalış.
  Yavaş başlamak ve tam hızda bitmek için bir hızlanma eğrisi kullanın:
  `'0.2s ease-in'`

HELPFUL: Yumuşaklık eğrileri hakkında genel bilgi için Material Design web sitesinin [Doğal yumuşaklık eğrileri](https://material.io/design/motion/speed.html#easing) konusuna bakın.

Bu örnek, durumlar arasında 1 saniyelik bir geçişle `open`'dan `closed`'a bir durum geçişi sağlar.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition1"/>

Önceki kod parçasında, `=>` operatörü tek yönlü geçişleri gösterir ve `<=>` çift yönlüdür.
Geçiş içinde, `animate()` geçişin ne kadar süreceğini belirtir.
Bu durumda, `open`'dan `closed`'a durum değişikliği burada `1s` olarak ifade edilen 1 saniye sürer.

Bu örnek, 0.5 saniyelik bir geçiş animasyon yayıyla `closed` durumundan `open` durumuna bir durum geçişi ekler.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition2"/>

HELPFUL: [`state`](api/animations/state) ve `transition` fonksiyonları içinde stil kullanımı hakkında bazı ek notlar.

- Her geçişin sonunda uygulanan stilleri tanımlamak için [`state()`](api/animations/state) kullanın, animasyon tamamlandıktan sonra kalıcıdır
- Animasyon sırasında hareket yanılsaması oluşturan ara stilleri tanımlamak için `transition()` kullanın
- Animasyonlar devre dışı bırakıldığında, `transition()` stilleri atlanabilir, ancak [`state()`](api/animations/state) stilleri atlanamaz
- Aynı `transition()` argümanı içinde birden fazla durum çifti ekleyin:

  ```ts
  transition('on => off, off => void');
  ```

### Animasyonu tetikleme

Bir animasyonun ne zaman başlayacağını bilmesi için bir _tetikleyiciye_ ihtiyacı vardır.
`trigger()` fonksiyonu durumları ve geçişleri toplar ve animasyona bir ad verir, böylece onu HTML şablonundaki tetikleyici elemana ekleyebilirsiniz.

`trigger()` fonksiyonu değişiklikleri izlenecek özellik adını tanımlar.
Bir değişiklik olduğunda, tetikleyici tanımında yer alan eylemleri başlatır.
Bu eylemler geçişler veya daha sonra göreceğimiz gibi diğer fonksiyonlar olabilir.

Bu örnekte, tetikleyiciyi `openClose` olarak adlandırıp `button` elemanına ekleyeceğiz.
Tetikleyici, açık ve kapalı durumları ve iki geçiş için zamanlamaları tanımlar.

HELPFUL: Her `trigger()` fonksiyon çağrısı içinde, bir eleman herhangi bir anda yalnızca bir durumda olabilir.
Ancak, aynı anda birden fazla tetikleyicinin aktif olması mümkündür.

### Animasyonları tanımlama ve HTML şablonuna ekleme

Animasyonlar, animasyonlanacak HTML elemanını kontrol eden bileşenin metaverisinde tanımlanır.
Animasyonlarınızı tanımlayan kodu `@Component()` dekoratörü içindeki `animations:` özelliğinin altına yerleştirin.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="component"/>

Bir bileşen için bir animasyon tetikleyicisi tanımladığınızda, tetikleyici adını köşeli parantezlerle sararak ve önüne `@` sembolünü ekleyerek o bileşenin şablonundaki bir elemana ekleyin.
Ardından, aşağıda gösterildiği gibi standart Angular özellik bağlama sözdizimini kullanarak tetikleyiciyi bir şablon ifadesine bağlayabilirsiniz; burada `triggerName` tetikleyicinin adı ve `expression` tanımlanmış bir animasyon durumuna değer üretir.

```angular-html
<div [@triggerName]="expression">…</div>
```

Animasyon, ifade değeri yeni bir duruma değiştiğinde yürütülür veya tetiklenir.

Aşağıdaki kod parçası tetikleyiciyi `isOpen` özelliğinin değerine bağlar.

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.1.html" region="trigger"/>

Bu örnekte, `isOpen` ifadesi `open` veya `closed` tanımlı durumuna değerlendiğinde, durum değişikliğini `openClose` tetikleyicisine bildirir.
Ardından, durum değişikliğini ele almak ve bir durum değişikliği animasyonu başlatmak `openClose` koduna kalır.

Sayfaya giren veya sayfadan ayrılan elemanlar için \(DOM'a eklenen veya DOM'dan kaldırılan\), animasyonları koşullu yapabilirsiniz.
Örneğin, HTML şablonunda animasyon tetikleyicisiyle `*ngIf` kullanın.

HELPFUL: Bileşen dosyasında, animasyonları tanımlayan tetikleyiciyi `@Component()` dekoratöründeki `animations:` özelliğinin değeri olarak ayarlayın.

HTML şablon dosyasında, tanımlanmış animasyonları animasyonlanacak HTML elemanına eklemek için tetikleyici adını kullanın.

### Kod incelemesi

Geçiş örneğinde tartışılan kod dosyaları aşağıdadır.

<docs-code-multifile>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="component"/>
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.1.html" region="trigger"/>
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/open-close.css"/>
</docs-code-multifile>

### Özet

Zamanlama için `animate()` ile birlikte `style()` ve [`state()`](api/animations/state) kullanarak iki durum arasındaki geçişe animasyon eklemeyi öğrendiniz.

Animasyonlar bölümünde Angular animasyonlarının daha gelişmiş özellikleri hakkında bilgi edinin; [geçiş ve tetikleyiciler](guide/legacy-animations/transition-and-triggers) konusundaki ileri tekniklerle başlayarak.

## Animasyonlar API özeti

`@angular/animations` modülü tarafından sağlanan fonksiyonel API, Angular uygulamalarında animasyonlar oluşturmak ve kontrol etmek için alana özgü bir dil \(DSL\) sağlar.
Temel fonksiyonların ve ilgili veri yapılarının tam listesi ve sözdizimi ayrıntıları için [API referansına](api?package=angular_animations&status=8) bakın.

| Function name                     | What it does                                                                                                                                                                                                                        |
| :-------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger()`                       | Animasyonu başlatır ve diğer tüm animasyon fonksiyon çağrıları için bir kapsayıcı görevi görür. HTML şablonu `triggerName`'e bağlanır. Benzersiz bir tetikleyici adı bildirmek için ilk argümanı kullanın. Dizi sözdizimi kullanır. |
| `style()`                         | Animasyonlarda kullanılacak bir veya daha fazla CSS stili tanımlar. Animasyonlar sırasında HTML elemanlarının görsel görünümünü kontrol eder. Nesne sözdizimi kullanır.                                                             |
| [`state()`](api/animations/state) | Belirli bir duruma başarılı geçişte uygulanması gereken adlandırılmış bir CSS stil kümesi oluşturur. Durum daha sonra diğer animasyon fonksiyonları içinde ada göre referans edilebilir.                                            |
| `animate()`                       | Bir geçiş için zamanlama bilgisini belirtir. `delay` ve `easing` için isteğe bağlı değerler. İçinde `style()` çağrıları içerebilir.                                                                                                 |
| `transition()`                    | İki adlandırılmış durum arasındaki animasyon sırasını tanımlar. Dizi sözdizimi kullanır.                                                                                                                                            |
| `keyframes()`                     | Belirli bir zaman aralığı içinde stiller arasında sıralı değişikliğe izin verir. `animate()` içinde kullanın. Her `keyframe()` içinde birden fazla `style()` çağrısı içerebilir. Dizi sözdizimi kullanır.                           |
| [`group()`](api/animations/group) | Paralel olarak çalıştırılacak bir grup animasyon adımını \(_iç animasyonlar_\) belirtir. Animasyon yalnızca tüm iç animasyon adımları tamamlandıktan sonra devam eder. `sequence()` veya `transition()` içinde kullanılır.          |
| `query()`                         | Mevcut eleman içindeki bir veya daha fazla iç HTML elemanını bulur.                                                                                                                                                                 |
| `sequence()`                      | Birer birer sıralı olarak çalıştırılan animasyon adımlarının bir listesini belirtir.                                                                                                                                                |
| `stagger()`                       | Birden fazla eleman için animasyonların başlama zamanını kademeli yapar.                                                                                                                                                            |
| `animation()`                     | Başka bir yerden çağrılabilecek yeniden kullanılabilir bir animasyon üretir. `useAnimation()` ile birlikte kullanılır.                                                                                                              |
| `useAnimation()`                  | Yeniden kullanılabilir bir animasyonu etkinleştirir. `animation()` ile kullanılır.                                                                                                                                                  |
| `animateChild()`                  | Alt bileşenlerdeki animasyonların üst bileşenle aynı zaman diliminde çalıştırılmasına izin verir.                                                                                                                                   |

</table>

## Angular animasyonları hakkında daha fazlası

HELPFUL: AngularConnect konferansında Kasım 2017'de gösterilen bu [sunuma](https://www.youtube.com/watch?v=rnTK9meY5us) ve eşlik eden [kaynak koduna](https://github.com/matsko/animationsftw.in) göz atın.

Aşağıdakilerle de ilgilenebilirsiniz:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="Transition and triggers"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Complex animation sequences"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Reusable animations"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
  <docs-pill href="guide/animations/migration" title="Migrating to Native CSS Animations"/>
</docs-pill-row>
