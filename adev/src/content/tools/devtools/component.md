# Bileşen ağacını inceleme

## Uygulamanızda hata ayıklama

**Components** sekmesi, uygulamanızın yapısını keşfetmenizi sağlar.
DOM'daki bileşen ve direktif örneklerini görselleştirebilir, durumlarını inceleyebilir veya değiştirebilirsiniz.

### Uygulama yapısını keşfetme

Bileşen ağacı, uygulamanızdaki _bileşenler ve direktifler_ arasındaki hiyerarşik ilişkiyi gösterir.

<img src="assets/images/guide/devtools/component-explorer.png" alt="A screenshot of the 'Components' tab showing a tree of Angular components and directives starting the root of the application.">

Bileşen gezgininde tek tek bileşenlere veya direktiflere tıklayarak bunları seçin ve özelliklerini önizleyin.
Angular DevTools, özellikleri ve meta verileri bileşen ağacının sağ tarafında görüntüler.

Bir bileşeni veya direktifi ada göre aramak için bileşen ağacının üzerindeki arama kutusunu kullanın.

<img src="assets/images/guide/devtools/search.png" alt="A screenshot of the 'Components' tab. The filter bar immediately underneath the tab is searching for 'todo' and all components with 'todo' in the name are highlighted in the tree. `app-todos` is currently selected and a sidebar to the right displays information about the component's properties. This includes a section of `@Output` fields and another section for other properties.">

### Ana düğüme gitme

Belirli bir bileşenin veya direktifin ana öğesine gitmek için bileşen gezgininde üzerine çift tıklayın.
Angular DevTools, Chrome'da Elements sekmesini veya Firefox'ta Inspector sekmesini açar ve ilişkili DOM düğümünü seçer.

### Kaynağa gitme

Bileşenler için Angular DevTools, Sources sekmesinde (Chrome) ve Debugger sekmesinde (Firefox) bileşen tanımına gitmenizi sağlar.
Belirli bir bileşeni seçtikten sonra, özellikler görünümünün sağ üst köşesindeki simgeye tıklayın:

<img src="assets/images/guide/devtools/navigate-source.png" alt="A screenshot of the 'Components' tab. The properties view on the right is visible for a component and the mouse rests in the upper right corner of that view on top of a `<>` icon. An adjacent tooltip reads 'Open component source'.">

### Özellik değerini güncelleme

Tarayıcıların DevTools'unda olduğu gibi, özellikler görünümü bir input, output veya diğer özelliklerin değerini düzenlemenize olanak tanır.
Özellik değerine sağ tıklayın ve bu değer türü için düzenleme işlevi mevcutsa, bir metin girişi alanı görünecektir.
Yeni değeri yazın ve özelliğe uygulamak için `Enter` tuşuna basın.

<img src="assets/images/guide/devtools/update-property.png" alt="A screenshot of the 'Components' tab with the properties view open for a component. An `@Input` named `todo` contains a `label` property which is currently selected and has been manually updated to the value 'Buy milk'.">

### Konsolda seçili bileşen veya direktife erişme

Konsolda bir kısayol olarak Angular DevTools, son seçilen bileşen veya direktif örneklerine erişim sağlar.
Şu anda seçili bileşenin veya direktifin örneğine referans almak için `$ng0` yazın, daha önce seçilen örnek için `$ng1`, ondan önce seçilen örnek için `$ng2` yazın ve bu şekilde devam edin.

<img src="assets/images/guide/devtools/access-console.png" alt="A screenshot of the 'Components' tab with the browser console underneath. In the console, the user has typed three commands, `$ng0`, `$ng1`, and `$ng2` to view the three most recently selected elements. After each statement, the console prints a different component reference.">

### Bir direktif veya bileşen seçme

Tarayıcıların DevTools'una benzer şekilde, belirli bir bileşeni veya direktifi incelemek için sayfayı denetleyebilirsiniz.
Angular DevTools içinde sol üst köşedeki **_Inspect element_** simgesine tıklayın ve sayfadaki bir DOM öğesinin üzerine gelin.
Uzantı, ilişkili direktifleri ve/veya bileşenleri tanır ve Bileşen ağacında karşılık gelen öğeyi seçmenize olanak tanır.

<img src="assets/images/guide/devtools/inspect-element.png" alt="A screenshot of the 'Components' tab with an Angular todo application visible. In the very top-left corner of Angular DevTools, an icon of a screen with a mouse icon inside it is selected. The mouse rests on a todo element in the Angular application UI. The element is highlighted with a `<TodoComponent>` label displayed in an adjacent tooltip.">

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
