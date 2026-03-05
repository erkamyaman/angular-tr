# Profile your application

**Profiler** sekmesi, Angular'ın değişiklik algılama (change detection) işleminin yürütülmesini görselleştirmenizi sağlar.
Bu, değişiklik algılamanın uygulamanızın performansını ne zaman ve nasıl etkilediğini belirlemek için kullanışlıdır.

<img src="assets/images/guide/devtools/profiler.png" alt="A screenshot of the 'Profiler' tab which reads 'Click the play button to start a new recording, or upload a json file containing profiler data.' Next to this is a record button to begin recording a new profile as well as a file picker to select an existing profile.">

Profiler sekmesi, mevcut uygulamayı profillemeye başlamanızı veya önceki bir çalıştırmadan mevcut bir profili içe aktarmanızı sağlar.
Uygulamanızı profillemeye başlamak için **Profiler** sekmesindeki sol üst köşedeki dairenin üzerine gelin ve **Start recording**'a tıklayın.

Profilleme sırasında Angular DevTools, değişiklik algılama ve yaşam döngüsü kancası (lifecycle hook) yürütmesi gibi yürütme olaylarını yakalar.
Değişiklik algılamayı tetiklemek ve Angular DevTools'un kullanabileceği veriler üretmek için uygulamanızla etkileşime geçin.
Kaydı bitirmek için daireye tekrar tıklayarak **Stop recording** yapın.

Mevcut bir kaydı da içe aktarabilirsiniz.
Bu özellik hakkında daha fazla bilgi için [Import recording](tools/devtools/profiler#import-and-export-recordings) bölümünü okuyun.

## Understand your application's execution

Bir profil kaydettikten veya içe aktardıktan sonra Angular DevTools, değişiklik algılama döngülerinin bir görselleştirmesini gösterir.

<img src="assets/images/guide/devtools/default-profiler-view.png" alt="A screenshot of the 'Profiler' tab after a profile has been recorded or uploaded. It displays a bar chart illustrating various change detection cycles with some text which reads 'Select a bar to preview a particular change detection cycle'.">

Sıradaki her çubuk, uygulamanızdaki bir değişiklik algılama döngüsünü temsil eder.
Bir çubuk ne kadar uzunsa, uygulama bu döngüde değişiklik algılama çalıştırmak için o kadar fazla zaman harcamıştır.
Bir çubuğu seçtiğinizde DevTools, aşağıdakiler dahil olmak üzere hakkında yararlı bilgiler görüntüler:

- Bu döngü sırasında yakalanan tüm bileşen ve direktifleri içeren bir çubuk grafik
- Angular'ın bu döngüde değişiklik algılama çalıştırmak için harcadığı süre
- Kullanıcının deneyimlediği tahmini kare hızı (60fps'nin altındaysa)

<img src="assets/images/guide/devtools/profiler-selected-bar.png" alt="A screenshot of the 'Profiler' tab. A single bar has been selected by the user and a nearby dropdown menu displays 'Bar chart`, showing a second bar chart underneath it. The new chart has two bars which take up the majority of the space, one labeled `TodosComponent` and the other labeled `NgForOf`. The other bars are small enough to be negligible in comparison.">

## Understand component execution

Bir değişiklik algılama döngüsüne tıkladıktan sonra gösterilen çubuk grafik, uygulamanızın söz konusu bileşen veya direktifte değişiklik algılama çalıştırmak için ne kadar zaman harcadığına dair ayrıntılı bir görünüm sunar.

Bu örnek, `NgForOf` direktifinin harcadığı toplam süreyi ve üzerinde hangi yöntemin çağrıldığını gösterir.

<img src="assets/images/guide/devtools/directive-details.png" alt="A screenshot of the 'Profiler' tab where the `NgForOf` bar is selected. A detailed view of `NgForOf` is visible to the right where it lists 'Total time spent: 1.76 ms'. It includes a with exactly one row, listing `NgForOf` as a directives with an `ngDoCheck` method which took 1.76 ms. It also includes a list labeled 'Parent Hierarchy' containing the parent components of this directive.">

## Hierarchical views

<img src="assets/images/guide/devtools/flame-graph-view.png" alt="A screenshot of the 'Profiler' tab. A single bar has been selected by the user and a nearby dropdown menu now displays 'Flame graph', showing a flame graph underneath it. The flame graph starts with a row called 'Entire application' and another row called 'AppComponent'. Beneath those, the rows start to break up into multiple items, starting with `[RouterOutlet]` and `DemoAppComponent` on the third row. A few layers deep, one cell is highlighted red.">

Değişiklik algılama yürütmesini alev grafiği (flame graph) benzeri bir görünümde de görselleştirebilirsiniz.

Grafikteki her karo, render ağacında belirli bir konumdaki ekrandaki bir öğeyi temsil eder.
Örneğin, bir `LoggedOutUserComponent` bileşeninin kaldırıldığı ve yerine Angular'ın bir `LoggedInUserComponent` render ettiği bir değişiklik algılama döngüsünü düşünün. Bu senaryoda her iki bileşen de aynı karoda görüntülenecektir.

X ekseni, bu değişiklik algılama döngüsünü render etmek için geçen toplam süreyi temsil eder.
Y ekseni, öğe hiyerarşisini temsil eder. Bir öğe için değişiklik algılama çalıştırmak, onun direktiflerinin ve alt bileşenlerinin render edilmesini gerektirir.
Bu grafik birlikte, hangi bileşenlerin render edilmesinin en uzun sürdüğünü ve bu sürenin nereye harcandığını görselleştirir.

Her karo, Angular'ın orada ne kadar zaman harcadığına bağlı olarak renklendirilir.
Angular DevTools, rengin yoğunluğunu, render işleminin en uzun sürdüğü karoya göre harcanan süreye göre belirler.

Belirli bir karoya tıkladığınızda, sağdaki panelde hakkında ayrıntılar göreceksiniz.
Karoya çift tıklamak, iç içe geçmiş alt öğelerini daha kolay görüntüleyebilmeniz için yakınlaştırır.

## Debug change detection and `OnPush` components

Normalde grafik, herhangi bir değişiklik algılama karesi için bir uygulamayı _render etmek_ için geçen süreyi görselleştirir. Ancak `OnPush` bileşenleri gibi bazı bileşenler yalnızca input özellikleri değiştiğinde yeniden render edilir. Belirli kareler için bu bileşenler olmadan alev grafiğini görselleştirmek yararlı olabilir.

Bir değişiklik algılama karesinde yalnızca değişiklik algılama sürecinden geçen bileşenleri görselleştirmek için alev grafiğinin üzerindeki **Change detection** onay kutusunu seçin.

Bu görünüm, değişiklik algılamadan geçen tüm bileşenleri vurgular ve yeniden render edilmeyen `OnPush` bileşenleri gibi geçmeyenleri gri renkte gösterir.

<img src="assets/images/guide/devtools/debugging-onpush.png" alt="A screenshot of the 'Profiler' tab displaying a flame chart visualization of a change detection cycle. A checkbox labeled 'Show only change detection' is now checked. The flame graph looks very similar to before, however the color of components has changed from orange to blue. Several tiles labeled `[RouterOutlet]` are no longer highlighted with any color.">

## Import and export recordings

Dışa aktarmak için kaydedilmiş bir profilleme oturumunun sağ üst köşesindeki **Save Profile** düğmesine tıklayarak JSON dosyası olarak kaydedin.
Daha sonra, profiler'ın başlangıç görünümünde **Choose file** girişine tıklayarak dosyayı içe aktarın.

<img src="assets/images/guide/devtools/save-profile.png" alt="A screenshot of the 'Profiler' tab displaying change detection cycles. On the right side a 'Save Profile' button is visible.">
