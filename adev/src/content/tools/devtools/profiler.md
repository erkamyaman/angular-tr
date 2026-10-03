# Uygulamanızın Profilini Çıkarma

**Profiler** sekmesi, Angular'ın değişiklik algılama (change detection) işleminin yürütülmesini görselleştirmenizi sağlar.
Bu, değişiklik algılamanın uygulamanızın performansını ne zaman ve nasıl etkilediğini belirlemek için kullanışlıdır.

<img src="assets/images/guide/devtools/profiler.png" alt="'Click the play button to start a new recording, or upload a json file containing profiler data.' yazan 'Profiler' sekmesinin ekran görüntüsü. Bunun yanında yeni bir profil kaydını başlatmak için bir kayıt düğmesi ve mevcut bir profili seçmek için bir dosya seçici bulunuyor.">

Profiler sekmesi, mevcut uygulamayı profillemeye başlamanızı veya önceki bir çalıştırmadan mevcut bir profili içe aktarmanızı sağlar.
Uygulamanızı profillemeye başlamak için **Profiler** sekmesindeki sol üst köşedeki dairenin üzerine gelin ve **Start recording**'a tıklayın.

Profilleme sırasında Angular DevTools, değişiklik algılama ve yaşam döngüsü kancası (lifecycle hook) yürütmesi gibi yürütme olaylarını yakalar.
Değişiklik algılamayı tetiklemek ve Angular DevTools'un kullanabileceği veriler üretmek için uygulamanızla etkileşime geçin.
Kaydı bitirmek için daireye tekrar tıklayarak **Stop recording** yapın.

Mevcut bir kaydı da içe aktarabilirsiniz.
Bu özellik hakkında daha fazla bilgi için [Import recording](tools/devtools/profiler#kayıtları-içe-ve-dışa-aktarma) bölümünü okuyun.

## Uygulamanızın Çalışmasını Anlama

Bir profil kaydettikten veya içe aktardıktan sonra Angular DevTools, değişiklik algılama döngülerinin bir görselleştirmesini gösterir.

<img src="assets/images/guide/devtools/default-profiler-view.png" alt="Bir profil kaydedildikten veya yüklendikten sonra 'Profiler' sekmesinin ekran görüntüsü. Çeşitli değişiklik algılama döngülerini gösteren bir çubuk grafik ve 'Select a bar to preview a particular change detection cycle' yazan bir metin görüntüleniyor.">

Sıradaki her çubuk, uygulamanızdaki bir değişiklik algılama döngüsünü temsil eder.
Bir çubuk ne kadar uzunsa, uygulama bu döngüde değişiklik algılama çalıştırmak için o kadar fazla zaman harcamıştır.
Bir çubuğu seçtiğinizde DevTools, aşağıdakiler dahil olmak üzere hakkında yararlı bilgiler görüntüler:

- Bu döngü sırasında yakalanan tüm bileşen ve direktifleri içeren bir çubuk grafik
- Angular'ın bu döngüde değişiklik algılama çalıştırmak için harcadığı süre
- Kullanıcının deneyimlediği tahmini kare hızı (60fps'nin altındaysa)

<img src="assets/images/guide/devtools/profiler-selected-bar.png" alt="'Profiler' sekmesinin ekran görüntüsü. Kullanıcı tek bir çubuğu seçmiş ve yakındaki açılır menüde 'Bar chart' görüntülenerek altında ikinci bir çubuk grafik gösteriliyor. Yeni grafikte alanın çoğunu kaplayan iki çubuk var: biri `TodosComponent`, diğeri `NgForOf` etiketli. Diğer çubuklar karşılaştırıldığında ihmal edilebilecek kadar küçük.">

## Bileşen Çalışmasını Anlama

Bir değişiklik algılama döngüsüne tıkladıktan sonra gösterilen çubuk grafik, uygulamanızın söz konusu bileşen veya direktifte değişiklik algılama çalıştırmak için ne kadar zaman harcadığına dair ayrıntılı bir görünüm sunar.

Bu örnek, `NgForOf` direktifinin harcadığı toplam süreyi ve üzerinde hangi yöntemin çağrıldığını gösterir.

<img src="assets/images/guide/devtools/directive-details.png" alt="'Profiler' sekmesinin, `NgForOf` çubuğu seçiliyken ekran görüntüsü. Sağda `NgForOf` için ayrıntılı bir görünüm var ve 'Total time spent: 1.76 ms' yazıyor. Görünümde, 1,76 ms süren bir `ngDoCheck` metoduna sahip direktif olarak `NgForOf`'u listeleyen tam olarak tek satırlık bir tablo ve bu direktifin üst bileşenlerini içeren 'Parent Hierarchy' etiketli bir liste bulunuyor.">

## Hiyerarşik Görünümler

<img src="assets/images/guide/devtools/flame-graph-view.png" alt="'Profiler' sekmesinin ekran görüntüsü. Kullanıcı tek bir çubuğu seçmiş ve yakındaki açılır menüde artık 'Flame graph' görüntülenerek altında bir alev grafiği gösteriliyor. Alev grafiği 'Entire application' adlı bir satır ve 'AppComponent' adlı başka bir satırla başlıyor. Bunların altında satırlar, üçüncü satırda `[RouterOutlet]` ve `DemoAppComponent` ile başlayarak birden çok öğeye ayrılıyor. Birkaç katman aşağıda bir hücre kırmızıyla vurgulanmış.">

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

## Değişiklik Algılama ve `OnPush` Bileşenlerinde Hata Ayıklama

Normalde grafik, herhangi bir değişiklik algılama karesi için bir uygulamayı _render etmek_ için geçen süreyi görselleştirir. Ancak `OnPush` bileşenleri gibi bazı bileşenler yalnızca input özellikleri değiştiğinde yeniden render edilir. Belirli kareler için bu bileşenler olmadan alev grafiğini görselleştirmek yararlı olabilir.

Bir değişiklik algılama karesinde yalnızca değişiklik algılama sürecinden geçen bileşenleri görselleştirmek için alev grafiğinin üzerindeki **Change detection** onay kutusunu seçin.

Bu görünüm, değişiklik algılamadan geçen tüm bileşenleri vurgular ve yeniden render edilmeyen `OnPush` bileşenleri gibi geçmeyenleri gri renkte gösterir.

<img src="assets/images/guide/devtools/debugging-onpush.png" alt="Bir değişiklik algılama döngüsünün alev grafiği görselleştirmesini gösteren 'Profiler' sekmesinin ekran görüntüsü. 'Show only change detection' etiketli bir onay kutusu artık işaretli. Alev grafiği öncekine çok benziyor, ancak bileşenlerin rengi turuncudan maviye değişmiş. `[RouterOutlet]` etiketli birkaç kutucuk artık herhangi bir renkle vurgulanmıyor.">

## Kayıtları İçe ve Dışa Aktarma

Dışa aktarmak için kaydedilmiş bir profilleme oturumunun sağ üst köşesindeki **Save Profile** düğmesine tıklayarak JSON dosyası olarak kaydedin.
Daha sonra, profiler'ın başlangıç görünümünde **Choose file** girişine tıklayarak dosyayı içe aktarın.

<img src="assets/images/guide/devtools/save-profile.png" alt="Değişiklik algılama döngülerini gösteren 'Profiler' sekmesinin ekran görüntüsü. Sağ tarafta 'Save Profile' düğmesi görünüyor.">
