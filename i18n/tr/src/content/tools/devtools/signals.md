<!-- source: cdc1a53ff2c0b45d26dc3bd2bfcdd7eb266519e5 -->
# Signal grafiğinde hata ayıklama

**Components** sekmesi, seçili bileşen veya direktif için canlı bir signal grafiği gösterebilir.
Grafik, o bileşendeki signal'lerin, computed'ların, effect'lerin ve diğer reaktif düğümlerin birbirine nasıl bağlı olduğunu gösterir; bu da reaktif veri akışlarını anlamayı ve hatalarını ayıklamayı kolaylaştırır.

<img src="assets/images/guide/devtools/signal-graph.png" alt="Angular DevTools'ta 'Components' sekmesinin, seçili bileşen için signal grafiği açıkken ekran görüntüsü. Grafik, bileşenin şablonunun okuduğu üç computed düğümüne kenarlarla bağlı bir signal düğümü gösteriyor ve bileşenin özellikleri sağdaki bir kenar çubuğunda listeleniyor.">

## Signal grafiğini açma {#open-the-signal-graph}

**Components** sekmesinde bir bileşen veya direktif seçin.
Özellik paneli başlığında **Show Signal Graph** düğmesine tıklayın.
Signal grafiği bileşen ağacının yanında açılır.

Doğrudan belirli bir signal'e de gidebilirsiniz: özellikler görünümünde özelliğin yanındaki signal grafiği düğmesine tıklayın veya özelliğin birden fazla eylemi varsa eylemler menüsünü açıp **Show in signal graph** seçeneğini seçin.

**Show Signal Graph** düğmesi, incelenen uygulama signal grafiği API'sini desteklediğinde otomatik olarak görünür. Etkinleştirilecek bir ayar yoktur.

## Grafiği okuma {#read-the-graph}

Grafikteki düğümler, seçili bileşene katılan reaktif düğümleri temsil eder:

- **Signal**: `signal()` ile oluşturulan yazılabilir bir signal.
- **Computed**: `computed()` ile oluşturulan türetilmiş bir değer.
- **Effect**: `effect()` veya `afterRenderEffect()` ile oluşturulan bir yan etki.
- **Linked signal**: `linkedSignal()` ile oluşturulan yazılabilir bir signal.
- **Template**: render edilirken signal'leri okuyan bileşen şablonu.
- **Resource**: Bir `resource()` veya `rxResource()`'a ait signal'ler, daraltılabilir bir kümede gruplanır. İçindeki tek tek düğümleri görmek için küme düğümünde **Expand**'e tıklayın.

Düğümler arasındaki çizgiler reaktif bağımlılıkları gösterir: her düğüm, okuduğu üreticilere (yukarı akış) ve kendisini okuyan bağımlılara (aşağı akış) bağlanır.

TIP: Düğümler, reaktif düğümün `debugName` değeriyle etiketlenir. Signal'lerinize, computed'larınıza ve özellikle genellikle bir sınıf üyesine atanmayan effect'lerinize bir `debugName` vermek, grafiği okumayı çok daha kolay hale getirir:

```ts
effect(
  () => {
    // ...
  },
  {debugName: 'name in graph'},
);
```

## Grafikte arama {#search-the-graph}

Bir düğümü ada göre bulmak için grafik araç çubuğundaki arama simgesine tıklayın.
Angular DevTools tüm eşleşmeleri vurgular ve aralarında gezinmenizi sağlar.

## Bir düğümü inceleme {#inspect-a-node}

Bir düğüme tıklayarak ayrıntılar panelini açın. Panel, düğümün mevcut değerini genişletilebilir bir ağaç olarak gösterir ve şu eylemleri sunar:

- **View source**: Düğümün tanımına Sources sekmesinde (Chrome) veya Debugger sekmesinde (Firefox) gidin. Kaynak konumu mevcut değilse bu eylem devre dışıdır.
- **Set breakpoint**: Signal güncellendiğinde yürütmeyi duraklatın. Kesme noktaları yalnızca Chromium tabanlı tarayıcılarda kullanılabilir.
- **Watch signal**: Signal'in güncellemelerini ve geçersiz kılınmalarını tarayıcı konsoluna kaydedin. İzlemeyi durdurmak için eyleme tekrar tıklayın.
- **Highlight upstream / downstream**: Düğümün bağımlılıklarının veya kendisine bağımlı olanların yollarını izleyin.

Bileşen hiç signal kullanmıyorsa Angular DevTools, grafik yerine "No signals in this component" mesajını gösterir.

## Sürüm desteği {#version-support}

Signal grafiği, Angular 19 veya sonraki bir sürümle oluşturulmuş ve geliştirme modunda çalışan bir uygulama gerektirir.
