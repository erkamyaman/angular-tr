# Bileşen ağacını inceleme

## Uygulamanızda hata ayıklama

**Components** sekmesi, uygulamanızın yapısını keşfetmenizi sağlar.
DOM'daki bileşen ve direktif örneklerini görselleştirebilir, durumlarını inceleyebilir veya değiştirebilirsiniz.

### Uygulama yapısını keşfetme

Bileşen ağacı, uygulamanızdaki _bileşenler ve direktifler_ arasındaki hiyerarşik ilişkiyi gösterir.

<img src="assets/images/guide/devtools/component-explorer.png" alt="'Components' sekmesinin, uygulamanın kökünden başlayan Angular bileşenleri ve direktiflerinin ağacını gösteren ekran görüntüsü.">

Bileşen gezgininde tek tek bileşenlere veya direktiflere tıklayarak bunları seçin ve özelliklerini önizleyin.
Angular DevTools, özellikleri ve meta verileri bileşen ağacının sağ tarafında görüntüler.

Bir bileşeni veya direktifi ada göre aramak için bileşen ağacının üzerindeki arama kutusunu kullanın.

<img src="assets/images/guide/devtools/search.png" alt="'Components' sekmesinin ekran görüntüsü. Sekmenin hemen altındaki filtre çubuğunda 'todo' aranıyor ve adında 'todo' geçen tüm bileşenler ağaçta vurgulanıyor. `app-todos` şu anda seçili ve sağdaki kenar çubuğu bileşenin özellikleri hakkında bilgi gösteriyor. Bu bilgiler arasında `@Output` alanlarına ayrılmış bir bölüm ve diğer özelliklere ayrılmış başka bir bölüm bulunuyor.">

### Ana düğüme gitme

Belirli bir bileşenin veya direktifin ana öğesine gitmek için bileşen gezgininde üzerine çift tıklayın.
Angular DevTools, Chrome'da Elements sekmesini veya Firefox'ta Inspector sekmesini açar ve ilişkili DOM düğümünü seçer.

### Kaynağa gitme

Bileşenler için Angular DevTools, Sources sekmesinde (Chrome) ve Debugger sekmesinde (Firefox) bileşen tanımına gitmenizi sağlar.
Belirli bir bileşeni seçtikten sonra, özellikler görünümünün sağ üst köşesindeki simgeye tıklayın:

<img src="assets/images/guide/devtools/navigate-source.png" alt="'Components' sekmesinin ekran görüntüsü. Sağdaki özellikler görünümü bir bileşen için açık ve fare, bu görünümün sağ üst köşesindeki `<>` simgesinin üzerinde duruyor. Yanındaki araç ipucunda 'Open component source' yazıyor.">

### Özellik değerini güncelleme

Tarayıcıların DevTools'unda olduğu gibi, özellikler görünümü bir input, output veya diğer özelliklerin değerini düzenlemenize olanak tanır.
Özellik değerine sağ tıklayın ve bu değer türü için düzenleme işlevi mevcutsa, bir metin girişi alanı görünecektir.
Yeni değeri yazın ve özelliğe uygulamak için `Enter` tuşuna basın.

<img src="assets/images/guide/devtools/update-property.png" alt="'Components' sekmesinin, bir bileşen için özellikler görünümü açıkken ekran görüntüsü. `todo` adlı bir `@Input`, şu anda seçili olan ve elle 'Buy milk' değerine güncellenmiş bir `label` özelliği içeriyor.">

### Konsolda seçili bileşen veya direktife erişme

Konsolda bir kısayol olarak Angular DevTools, son seçilen bileşen veya direktif örneklerine erişim sağlar.
Şu anda seçili bileşenin veya direktifin örneğine referans almak için `$ng0` yazın, daha önce seçilen örnek için `$ng1`, ondan önce seçilen örnek için `$ng2` yazın ve bu şekilde devam edin.

<img src="assets/images/guide/devtools/access-console.png" alt="'Components' sekmesinin, altında tarayıcı konsoluyla birlikte ekran görüntüsü. Konsolda kullanıcı, en son seçilen üç öğeyi görüntülemek için `$ng0`, `$ng1` ve `$ng2` olmak üzere üç komut yazmış. Her ifadeden sonra konsol farklı bir bileşen referansı yazdırıyor.">

### Bir direktif veya bileşen seçme

Tarayıcıların DevTools'una benzer şekilde, belirli bir bileşeni veya direktifi incelemek için sayfayı denetleyebilirsiniz.
Angular DevTools içinde sol üst köşedeki **_Inspect element_** simgesine tıklayın ve sayfadaki bir DOM öğesinin üzerine gelin.
Uzantı, ilişkili direktifleri ve/veya bileşenleri tanır ve Bileşen ağacında karşılık gelen öğeyi seçmenize olanak tanır.

<img src="assets/images/guide/devtools/inspect-element.png" alt="'Components' sekmesinin, bir Angular todo uygulaması görünürken ekran görüntüsü. Angular DevTools'un en sol üst köşesinde, içinde fare simgesi bulunan bir ekran simgesi seçili. Fare, Angular uygulama arayüzündeki bir todo öğesinin üzerinde duruyor. Öğe, yanındaki araç ipucunda görüntülenen bir `<TodoComponent>` etiketiyle vurgulanmış.">

### Ertelenebilir görünümleri inceleme

Direktiflerin yanı sıra, direktif ağacı [`@defer` bloklarını](/guide/templates/defer) da içerir.

<img src="assets/images/guide/devtools/defer-block.png" />

Bir defer bloğuna tıklamak, özellikler kenar çubuğunda daha fazla ayrıntı gösterir: farklı isteğe bağlı bloklar (örneğin `@loading`, `@placeholder` ve `@error`), yapılandırılmış tetikleyiciler (defer tetikleyicileri, prefetch tetikleyicileri ve hydrate tetikleyicileri) ve `minimum` ve `after` değerleri gibi zamanlama seçenekleri.

### Hidrasyon

SSR/SSG uygulamanızda [hydration](/guide/hydration) etkinleştirildiğinde, direktif ağacı her bileşenin hydration durumunu gösterir.

Hata durumunda, etkilenen bileşen üzerinde bir hata mesajı görüntülenir.

<img src="assets/images/guide/devtools/hydration-status.png" />

Hydration durumu, kaplama (overlay) etkinleştirilerek uygulamanın kendisi üzerinde de görselleştirilebilir.

<img src="assets/images/guide/devtools/hydration-overlay-ecom.png" />

İşte bir Angular e-ticaret örnek uygulamasındaki hydration kaplamalarının bir gösterimi.
