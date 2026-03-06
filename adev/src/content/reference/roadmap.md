<docs-decorative-header title="Angular Yol Haritası" imgSrc="adev/src/assets/images/roadmap.svg"> <!-- markdownlint-disable-line -->
Angular ekibinin web'de nasıl ivme kazandığını öğrenin.
</docs-decorative-header>

Açık kaynak bir proje olarak Angular'ın günlük commit'leri, PR'ları ve ivmesi GitHub'da izlenebilir. Bu günlük çalışmanın framework'ün geleceğiyle nasıl bağlantılı olduğuna ilişkin şeffaflığı artırmak için yol haritamız, ekibin mevcut ve gelecekte planlanmış vizyonunu bir araya getirir.

Aşağıdaki projeler belirli bir Angular sürümüyle ilişkili değildir. Tamamlandığında yayınlayacağız ve semantik versiyonlamayı izleyerek yayın takvimimize göre belirli bir sürümün parçası olacaklardır. Örneğin, özellikleri tamamlandıktan sonra bir sonraki alt sürümde veya kırıcı değişiklikler içeriyorsa bir sonraki ana sürümde yayınlarız.

Şu anda Angular'ın framework için üç hedefi vardır:

1. [Geliştiriciler için yapay zeka deneyimini](/ai) iyileştirmek
1. [Angular geliştirici deneyimini](#angular-geliştirici-deneyimini-iyileştirme) iyileştirmek
1. Framework'ün performansını iyileştirmek

Bu hedefleri belirli proje çalışmalarıyla nasıl sunmayı planladığımızı öğrenmek için okumaya devam edin.

## Modern Angular'ı Keşfedin

Yol haritamızdan en son Angular özelliklerini kullanarak geliştirmeye başlayın. Bu liste, yol haritamızdaki yeni özelliklerin mevcut durumunu temsil eder:

### Deneylenebilir

- [Signal Forms](/guide/forms/signals/overview)
- [Resource API](/guide/signals/resource)
- [httpResource](/api/common/http/httpResource)

### Üretime hazır

- [Zoneless değişiklik algılama](/guide/zoneless)
- [Linked Signal API](/guide/signals/linked-signal)
- [Artımlı hidrasyon](/guide/incremental-hydration)
- [Effect API](/api/core/effect)
- [SSR ile olay tekrarı](/api/platform-browser/withEventReplay)
- [Rota düzeyinde render modu](/guide/ssr)

## Angular Geliştiricileri için Yapay Zeka Deneyimini İyileştirme

### Yapay Zekanın En İyisini Angular'a Getirme

<docs-card-container>
  <docs-card title="Yapay Zeka Destekli Angular" href="">
  Yapay zeka, geliştirme ortamını şekillendirmeye devam ediyor. Uygulama geliştirme şeklimizi ve mümkün olan kullanıcı deneyimi türlerini değiştirdi. Geliştirici topluluğunu yapay zeka destekli kodlama ve uygulamalarına yapay zekayı entegre etme konusunda en iyi şekilde desteklemeyi planlıyoruz.
  </docs-card>
  <docs-card title="Yapay Zeka Geliştirme">
  Ekip, Google AI Studio, Gemini CLI ve Antigravity gibi Agentic IDE'ler gibi agentic araçlarla anlamlı entegrasyonlar geliştirmeye devam edecektir. Hızla gelişen sektörle uyumlu çözümler sunmayı planlıyoruz. Bazı örnekler arasında agent becerileri, yeni MCP özellikleri ve yapay zeka SDK'ları bulunmaktadır.
  </docs-card>
  <docs-card title="Kod Üretimi">
  [Araştırmamıza göre](https://blog.angular.dev/beyond-the-horizon-how-angular-is-embracing-ai-for-next-gen-apps-7a7ed706e1a3), modern LLM'lerle Angular için kod üretimi zaten yüksek kalitede. Kod üretimini iyileştirme yatırımlarımıza devam edeceğiz. Bu, mevcut modelleri kullanarak kod üretimi kalitesini düzenli olarak değerlendireceğimiz ve sistem talimatları, dokümantasyon ve taktiksel framework değişiklikleri aracılığıyla bunu iyileştirmek için çalışacağımız anlamına gelir. Ayrıca değerlendirme altyapımız olan [Web Codegen Scorer](https://github.com/angular/web-codegen-scorer)'a yatırımlarımızı sürdüreceğiz.
  </docs-card>
  <docs-card title="Yapay Zeka Destekli Deneyimler">
  Dinamik UI oluşturma gibi yeni kavramlarla Angular geliştiricileri için keşfedilecek yeni bir sınır var. A2UI için Angular desteği oluşturarak başladık ve modern uygulama deneyimlerini desteklemek için aktif olarak daha fazla fırsat arıyoruz.
  </docs-card>
</docs-card-container>

## Angular Geliştirici Deneyimini İyileştirme

### Geliştirici hızı

<docs-card-container>
  <docs-card title="Derleyici">
    Microsoft, geçtiğimiz yıl TypeScript derleyicisini Go'ya taşımak için çalıştı ve tipik TypeScript derlemeleri için 5 - 10 kat hız artışı vaat ediyor. Angular'ın TypeScript derleyicisiyle belki de en derin entegrasyonlarından birine sahiptir ve bu, hem derleyici hem de dil servisi için yeni tsgo tabanlı iş akışlarını desteklemek için daha büyük mimari değişiklikler gerektirecektir.

Bu desteğin nasıl görüneceğini prototipliyor ve keşfediyoruz ve tsgo ile uyumlu olan ve Microsoft'un yerel taşımasının performans avantajlarını Angular ekosistemine getiren bir Angular derleyicisi sunacağız.
</docs-card>

  <docs-card title="Geliştirilmiş Ekosistem uyumluluğu">
    Geliştiriciler, yapay zeka tarafından üretilen kodu manuel olarak üretilen kodla karıştırıyor ve popüler kütüphaneleri kullanmak ve yeni deneyimleri hızla entegre etmek istiyor. Angular bu ekosisteme iyi entegre olmak istiyor - geliştiriciler sevdikleri araçları kullanabilmeli ve gereksinimlerine göre framework'leri karıştırıp eşleştirebilmelidir.

Bu projenin parçası olarak, çapraz framework birlikte çalışabilirliği ve derleme araçlarımızın gereksinim alanını keşfedeceğiz. Ayrıca, [Web Codegen Scorer](https://github.com/angular/web-codegen-scorer) projesiyle sunduğumuz şeye benzer şekilde, web ekosistemindeki açık sorunlara framework-agnostik çözümler sağlayarak bu alana katkıda bulunup bulunamayacağımızı görmek istiyoruz.

  </docs-card>

  <docs-card title="Signal Forms" href="/guide/forms/signals/overview">
  Angular v21'de Signal Forms'un deneysel bir sürümünü yayınladık. Bu yeni yaklaşım, geliştiricilerin form durumunu sinyaller kullanarak yönetmesine olanak tanıyarak ergonomik bir form oluşturma deneyimi sağlar. Sonraki planlarımız arasında Signal Forms'u kararlı hale getirmek ve reaktif formlarla birlikte çalışabilirliği geliştirmek yer alıyor - ekiplerin büyük formları kendi hızlarında aşamalı olarak geçirmesini sağlamak.
  </docs-card>
  <docs-card title="Reaktivite" href="">
  Esnek asenkron veri işleme için deneysel sinyal API'leri olan resource() ve httpResource()'u tanıttık. Topluluk geri bildirimlerine dayanarak bu API'leri geliştirici önizlemesi/kararlı seviyesine yükseltmeyi planlıyoruz.
  Ayrıca ele alınmamış kullanım durumları için yeni API'leri değerlendiriyoruz, dikkatli bir değerlendirmeden sonra uygulama öncesinde topluluk faydalarını ve ödünleşimleri göz önünde bulunduruyoruz.
  </docs-card>
  <docs-card title="Değişiklik Algılama" href="">
  Zoneless kararlı ve varsayılan olarak geldiğinde, güncel en iyi uygulamaları takip etmek için varsayılan değişiklik algılama stratejisini OnPush'a kaydırmayı da planlıyoruz. [Ayrıntılar için RFC tartışmasına bakın](https://github.com/angular/angular/discussions/66779).
  </docs-card>
  <docs-card title="Bileşenler">
  Angular v21'de, erişilebilir, başsız bileşenler için sekiz desen sağlayan Angular Aria'yı geliştirici önizlemesinde yayınladık. Bu desenleri kararlı hale getirmeyi ve gerektiğinde yeni desenler tanıtmayı planlıyoruz. Geliştiricilere Angular Aria kullanarak kendi bileşenlerini geliştirmek için sağlam bir temel sağlamak istiyoruz - biz etkileşimleri sağlıyoruz, siz tasarım sisteminize uyan stili getiriyorsunuz. Geliştiriciler Angular Aria ile özel bileşenler geliştirme, CDK'dan etkileşim kalıpları kullanma veya hazır stillenmiş Material Components kullanma seçeneğine sahip olacak.

Erişilebilirlik için, bileşenleri ve kalıpları WCAG gibi erişilebilirlik standartlarına karşı sürekli olarak değerlendiriyoruz ve bu süreçten kaynaklanan sorunları düzeltmek için çalışıyoruz.
</docs-card>
</docs-card-container>

### Araçları iyileştirme

<docs-card-container>
  <docs-card title="ng test ile birim test araçlarını modernleştirme" href="">
  Angular v21'de Vitest'in kararlı sürümünün ardından, artık birincil test çalıştırıcımız olmuştur. Şimdi deneysel Karma'dan Vitest'e geçiş aracımızı kararlı hale getirmeye ve geliştirici test iş akışını daha da iyileştirmek için yeni özellikleri araştırmaya odaklanıyoruz.
</docs-card>
</docs-card-container>

## Tamamlanan projeler

<docs-card-container>
  <docs-card title="Angular DevTools'ta sinyal hata ayıklama" href="" link="2025'te tamamlandı">
  Angular'da Signals'in evrimi ile birlikte, bunları hata ayıklamak için daha iyi araçlar üzerinde çalışıyoruz. Öncelik listesinde en üstte sinyalleri inceleme ve hata ayıklama için bir UI bulunuyor.
  </docs-card>
  <docs-card title="HMR'yi (Sıcak Modül Yeniden Yükleme) iyileştirme" href="https://github.com/angular/angular/issues/39367#issuecomment-1439537306" link="2025'te tamamlandı">
  Sıcak modül değiştirmeyi etkinleştirerek daha hızlı düzenleme/yenileme döngüsüne doğru çalışıyoruz.

Angular v19'da CSS ve şablon HMR için ilk desteği sunduk ve v20'de şablon HMR'yi kararlı hale getirdik. Bu projeyi tamamlanmış olarak işaretlemeden önce geliştiricilerin ihtiyaçlarını karşıladığımızdan emin olmak için geri bildirim toplamaya devam edeceğiz.
</docs-card>
<docs-card title="Zoneless Angular" href="" link="2025 4. Çeyrek'te tamamlandı">
v18'de Angular'da deneysel zoneless desteği sunduk. Bu, geliştiricilerin zone.js'yi paketlerine dahil etmeden framework'ü kullanmalarını sağlar, bu da performansı, hata ayıklama deneyimini ve birlikte çalışabilirliği iyileştirir. İlk sürümün parçası olarak Angular CDK ve Angular Material'da da zoneless desteği tanıttık.

    v19'da sunucu tarafı render'da zoneless desteği tanıttık, bazı uç durumları ele aldık ve zoneless projeler oluşturmak için bir şematik oluşturduk. <a href="https://fonts.google.com/">Google Fonts</a>'u zoneless'a geçirdik, bu da performansı ve geliştirici deneyimini iyileştirdi ve bu özelliği geliştirici önizlemesine taşımadan önce ele almamız gereken boşlukları belirlememize olanak tanıdı.

    Angular v20.2 itibarıyla, Zoneless Angular artık kararlıdır ve hata işleme ile sunucu tarafı render'da iyileştirmeler içerir.
    </docs-card>
    <docs-card title="Sunucu rota yapılandırması" link="2025 2. Çeyrek'te tamamlandı" href="">
    Sunucuda daha ergonomik bir rota yapılandırması sağlamak için çalışıyoruz. Hangi rotaların sunucu tarafında render edileceğini, ön render edileceğini veya istemci tarafında render edileceğini bildirmeyi kolaylaştırmak istiyoruz.

Angular v19'da, hangi rotaları ön render etmek, sunucu tarafında render etmek veya istemci tarafında render etmek istediğinizi ayrıntılı olarak yapılandırmanıza olanak tanıyan rota düzeyinde render modunun geliştirici önizlemesini sunduk. Angular v20'de bunu kararlı hale getirdik.
</docs-card>
<docs-card title="Artımlı hidrasyonu etkinleştirme" link="2025 2. Çeyrek'te tamamlandı" href="">
v17'de hidrasyonu geliştirici önizlemesinden çıkardık ve tutarlı olarak %40-50 LCP iyileştirmeleri gözlemliyoruz. O zamandan beri artımlı hidrasyon prototipi oluşturmaya başladık ve ng-conf'ta sahne üzerinde bir demo paylaştık.

v19'da `@defer` blokları tarafından desteklenen artımlı hidrasyonu geliştirici önizleme modunda sunduk. Angular v20'de bunu kararlı hale getirdik!
</docs-card>
<docs-card title="Angular Signals'ı sunma" link="2025 2. Çeyrek'te tamamlandı" href="https://github.com/angular/angular/discussions/49685">
Bu proje, Angular reaktivite modelini Signals'i bir reaktivite primitifi olarak tanıtarak yeniden düşünür. İlk planlama, yüzlerce tartışma, geliştiricilerle konuşmalar, geri bildirim oturumları, kullanıcı deneyimi çalışmaları ve 1.000'den fazla yorum alan bir dizi RFC ile sonuçlandı.

Angular v20'de signal, effect, linkedSignal, sinyal tabanlı sorgular ve girdiler dahil tüm temel reaktivite primitiflerini kararlı hale getirdik.
</docs-card>
<docs-card title="İki boyutlu sürükle ve bırak desteği" link="2024 2. Çeyrek'te tamamlandı" href="https://github.com/angular/components/issues/13372">
Bu projenin parçası olarak, Angular CDK sürükle ve bırak için karışık yönlendirme desteği uyguladık. Bu, depo'nun en çok talep edilen özelliklerinden biridir.
</docs-card>
<docs-card title="SSR ve ön render ile olay tekrarı" link="2024 4. Çeyrek'te tamamlandı" href="https://angular.dev/api/platform-browser/withEventReplay">
v18'de sunucu tarafı render veya ön render kullanırken bir olay tekrarı işlevselliği tanıttık. Bu özellik için Google.com'da çalışan olay gönderme primitifine (önceden jsaction olarak bilinir) bağımlıyız.

Angular v19'da olay tekrarını kararlı hale getirdik ve tüm yeni projeler için varsayılan olarak etkinleştirdik.
</docs-card>
<docs-card title="Angular Dil Servisi'ni Şematiklerle entegre etme" link="2024 4. Çeyrek'te tamamlandı" href="">
Geliştiricilerin modern Angular API'lerini kullanmasını kolaylaştırmak için, Angular dil servisi ile şematikler arasında entegrasyon sağladık; bu, uygulamanızı tek bir tıklamayla yeniden düzenlemenize olanak tanır.
</docs-card>
<docs-card title="Dil Servisi ile standalone importları kolaylaştırma" link="2024 4. Çeyrek'te tamamlandı" href="">
Bu girişimin parçası olarak, dil servisi bileşenleri ve pipe'ları standalone ve NgModule tabanlı uygulamalarda otomatik olarak içe aktarır. Ek olarak, standalone bileşenlerde kullanılmayan içe aktarmaları vurgulamak için bir şablon tanılaması ekledik, bu da uygulama paketlerini küçültmeye yardımcı olmalıdır.
</docs-card>
<docs-card title="Yerel şablon değişkenleri" link="2024 3. Çeyrek'te tamamlandı">
Angular'da yerel şablon değişkenleri desteğini yayınladık, ek bilgi için [`@let` belgelerine](/api/core/@let) bakın.
</docs-card>
<docs-card title="Angular Material özelleştirilebilirliğini genişletme" link="2024 2. Çeyrek'te tamamlandı" href="https://material.angular.dev/guide/theming">
Angular Material bileşenlerimizin daha iyi özelleştirilmesini sağlamak ve Material 3 yeteneklerini etkinleştirmek için, token tabanlı tema API'leri tanımlamak üzere Google'ın Material Design ekibiyle işbirliği yapacağız.

v17.2'de Angular Material 3 için deneysel destek paylaştık ve v18'de bunu kararlı hale getirdik.
</docs-card>
<docs-card title="Ertelenmiş yüklemeyi tanıtma" link="2024 2. Çeyrek'te tamamlandı" href="https://next.angular.dev/guide/templates/defer">
v17'de ertelenebilir görünümleri geliştirici önizlemesinde sunduk, bunlar ertelenmiş kod yükleme için ergonomik bir API sağlar. v18'de ertelenebilir görünümleri kütüphane geliştiricileri için etkinleştirdik ve API'yi kararlı hale getirdik.
</docs-card>
<docs-card title="Angular DevTools'ta iframe desteği" link="2024 2. Çeyrek'te tamamlandı" href="">
Sayfadaki bir iframe içine gömülü Angular uygulamalarının hata ayıklamasını ve profillemesini etkinleştirdik.
</docs-card>
<docs-card title="Mevcut hibrit render projelerinin esbuild ve vite'a geçiş otomasyonu" link="2024 2. Çeyrek'te tamamlandı" href="tools/cli/build-system-migration">
v17'de vite ve esbuild tabanlı bir uygulama oluşturucu sunduk ve yeni projeler için varsayılan olarak etkinleştirdik. Hibrit render kullanan projeler için derleme süresini %87'ye kadar iyileştirir. v18'in parçası olarak, hibrit render kullanan mevcut projeleri yeni derleme hattına geçiren şematikler ve bir kılavuz sunduk.
</docs-card>
<docs-card title="Angular.dev'i Angular geliştiricileri için resmi adres yapma" link="2024 2. Çeyrek'te tamamlandı" href="https://goo.gle/angular-dot-dev">
Angular.dev, Angular geliştirme için yeni site, alan adı ve ev'dir. Yeni site, geliştiricilerin Angular'ın en son özellikleriyle inşa etmesine yardımcı olacak güncellenmiş dokümantasyon, eğitimler ve rehberlik içerir.
</docs-card>
<docs-card title="Yerleşik kontrol akışını tanıtma" link="2024 2. Çeyrek'te tamamlandı" href="https://next.angular.dev/essentials/conditionals-and-loops">
v17'de yeni bir kontrol akışının geliştirici önizleme sürümünü sunduk. Önemli performans iyileştirmeleri ve şablon yazımı için daha iyi ergonomi getiriyor. Ayrıca projenizi yeni uygulamaya taşımak için çalıştırabileceğiniz mevcut `*ngIf`, `*ngFor` ve `*ngSwitch` geçişini de sağladık. v18 itibarıyla yerleşik kontrol akışı artık kararlıdır.
</docs-card>
<docs-card title="Başlangıç eğitimini modernleştirme" link="2023 4. Çeyrek'te tamamlandı" href="">
Son iki çeyrekte, standalone bileşenlere dayalı yeni bir [video](https://www.youtube.com/watch?v=xAT0lHYhHMY&list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF) ve [metin](/tutorials/learn-angular) eğitimi geliştirdik.
</docs-card>
<docs-card title="Modern paketleyicileri araştırma" link="2023 4. Çeyrek'te tamamlandı" href="guide/hydration">
Angular v16'da, `ng build` ve `ng serve` desteği ile esbuild tabanlı bir oluşturucunun geliştirici önizlemesini yayınladık. `ng serve` geliştirme sunucusu Vite ve esbuild ile Angular derleyicisi tarafından çoklu dosya derlemesi kullanır. v17'de derleme araçlarını geliştirici önizlemesinden çıkardık ve yeni projeler için varsayılan olarak etkinleştirdik.
</docs-card>
<docs-card title="Bağımlılık enjeksiyonu hata ayıklama API'lerini tanıtma" link="2023 4. Çeyrek'te tamamlandı" href="tools/devtools">
Angular ve Angular DevTools'un hata ayıklama yardımcı programlarını iyileştirmek için, bağımlılık enjeksiyonu çalışma zamanına erişim sağlayan API'ler üzerinde çalışacağız. Projenin parçası olarak, enjektör hiyerarşisini ve ilişkili sağlayıcıları arasındaki bağımlılıkları keşfetmemize olanak tanıyan hata ayıklama yöntemleri sunacağız. v17 itibarıyla, bağımlılık enjeksiyonu yaşam döngüsüne bağlanmamızı sağlayan bir özellik sunduk. Ayrıca enjektör ağacının bir görselleştirmesini ve her bir düğüm içinde bildirilen sağlayıcıların incelenmesini de başlattık.
</docs-card>
<docs-card title="Standalone bileşenler için dokümantasyon ve şematikleri iyileştirme" link="2023 4. Çeyrek'te tamamlandı" href="components">
`ng new --standalone` şematik koleksiyonunun geliştirici önizlemesini yayınladık, NgModule'lerden bağımsız uygulamalar oluşturmanıza olanak tanır. v17'de yeni uygulama yazım biçimini standalone API'lere geçirdik ve dokümantasyonu öneriyi yansıtacak şekilde değiştirdik. Ek olarak, mevcut uygulamaları standalone bileşenlere, direktiflere ve pipe'lara güncellemeyi destekleyen şematikler sunduk. NgModule'ler öngörülebilir gelecekte kalacak olsa da, geliştirici deneyimini iyileştirmek ve onlar için oluşturduğumuz yeni özelliklerden yararlanmak için yeni API'lerin faydalarını keşfetmenizi öneririz.
</docs-card>
<docs-card title="Hidrasyon ve sunucu taraflı render iyileştirmelerini keşfetme" link="2023 4. Çeyrek'te tamamlandı">
v16'da yıkıcı olmayan tam hidrasyonun geliştirici önizlemesini yayınladık, ek bilgi için [hidrasyon kılavuzuna](guide/hydration) ve [blog yazısına](https://blog.angular.dev/whats-next-for-server-side-rendering-in-angular-2a6f27662b67) bakın. [LCP](https://web.dev/lcp) ve [CLS](https://web.dev/cls) dahil Core Web Vitals'da önemli iyileştirmeler görüyoruz. Laboratuvar testlerinde, gerçek bir uygulamanın LCP'sinde tutarlı olarak %45 daha iyi sonuç gözlemledik.

v17'de hidrasyonu geliştirici önizlemesinden çıkardık ve sunucu tarafı render hikayesinde bir dizi iyileştirme yaptık, bunlar arasında: SSG için çalışma zamanında rota keşfi, hibrit render uygulamaları için %87'ye kadar daha hızlı derleme süreleri, yeni projeler için hibrit render'ı etkinleştiren komut istemi.
</docs-card>
<docs-card title="Yıkıcı olmayan tam uygulama hidrasyonu" link="2023 1. Çeyrek'te tamamlandı" href="guide/hydration">
v16'da yıkıcı olmayan tam hidrasyonun geliştirici önizlemesini yayınladık, bu Angular'ın bir uygulamayı sıfırdan yeniden oluşturmak yerine sunucu tarafından render edilen bir sayfadaki mevcut DOM düğümlerini yeniden kullanmasına olanak tanır. Ek bilgi için hidrasyon kılavuzuna bakın.
</docs-card>
<docs-card title="Resim direktifinde iyileştirmeler" link="2023 1. Çeyrek'te tamamlandı" href="guide/image-optimization">
Angular resim direktifini v15'te kararlı olarak yayınladık. Resimlerin açık boyutlara sahip olmak yerine üst kapsayıcılarına sığmasını sağlayan yeni bir dolgu modu özelliği tanıttık. Son iki ayda, Chrome Aurora ekibi direktifi v12 ve daha yeni sürümlere geri taşıdı.
</docs-card>
<docs-card title="Dokümantasyon yeniden düzenleme" link="2023 1. Çeyrek'te tamamlandı" href="https://angular.io">
Tüm mevcut dokümantasyonun tutarlı bir içerik türleri setine uymasını sağlayın. Eğitim tarzı dokümantasyonun aşırı kullanımını bağımsız konulara güncelleyin. Ana eğitimlerin dışındaki içeriğin, bir dizi kılavuza sıkı sıkıya bağlı olmadan kendi kendine yeterli olmasını sağlamak istiyoruz. 2022'nin 2. çeyreğinde şablon içeriğini ve bağımlılık enjeksiyonunu yeniden düzenledik. 2023'ün 1. çeyreğinde HTTP kılavuzlarını iyileştirdik ve bununla birlikte dokümantasyon yeniden düzenleme projesini beklemeye aldık.
</docs-card>
<docs-card title="Resim performansını iyileştirme" link="2022 4. Çeyrek'te tamamlandı" href="guide/image-optimization">
Aurora ve Angular ekipleri, Core Web Vitals'ı iyileştirmeyi amaçlayan bir resim direktifinin uygulanması üzerinde çalışıyorlar. Resim direktifinin kararlı bir sürümünü v15'te sunduk.
</docs-card>
<docs-card title="Modern CSS" link="2022 4. Çeyrek'te tamamlandı" href="https://blog.angular.dev/modern-css-in-angular-layouts-4a259dca9127">
Web ekosistemi sürekli gelişiyor ve en son modern standartları Angular'da yansıtmak istiyoruz. Bu projede, geliştiricilerin düzen, stil vb. için en iyi uygulamaları izlemesini sağlamak amacıyla Angular'da modern CSS özelliklerini kullanma konusunda kılavuzlar sağlamayı amaçlıyoruz. Düzen için resmi kılavuzları paylaştık ve girişimin parçası olarak flex layout yayınlamayı durdurduk.
</docs-card>
<docs-card title="Ana elemanlara direktif ekleme desteği" link="2022 4. Çeyrek'te tamamlandı" href="guide/directives/directive-composition-api">
Uzun süredir talep edilen bir özellik, ana öğelere direktifler ekleme yeteneğiydi. Bu özellik, geliştiricilerin kalıtım kullanmadan kendi bileşenlerini ek davranışlarla zenginleştirmesine olanak tanır. v15'te ana öğeleri direktiflerle geliştirmeyi sağlayan direktif kompozisyon API'mizi sunduk.
</docs-card>
<docs-card title="Daha iyi yığın izleri" link="2022 4. Çeyrek'te tamamlandı" href="https://developer.chrome.com/blog/devtools-better-angular-debugging/">
Angular ve Chrome DevTools, hata mesajları için daha okunabilir yığın izleri sağlamak üzere birlikte çalışıyorlar. v15'te iyileştirilmiş ilgili ve bağlantılı yığın izleri yayınladık. Daha düşük öncelikli bir girişim olarak, şablonlar için daha doğru çağrı çerçeve adları sağlayarak yığın izlerini nasıl daha dostane hale getirebileceğimizi keşfedeceğiz.
</docs-card>
<docs-card title="MDC Web entegrasyonu ile geliştirilmiş Angular Material bileşenleri" link="2022 4. Çeyrek'te tamamlandı" href="https://material.angular.dev/guide/mdc-migration">
MDC Web, Google Material Design ekibi tarafından oluşturulan, Material Design bileşenleri oluşturmak için yeniden kullanılabilir primitifler sağlayan bir kütüphanedir. Angular ekibi bu primitifleri Angular Material'a dahil ediyor. MDC Web kullanmak, Angular Material'ı Material Design spesifikasyonuyla daha yakından hizalar, erişilebilirliği genişletir, bileşen kalitesini iyileştirir ve ekibimizin hızını artırır.
</docs-card>
<docs-card title="İsteğe bağlı NgModules için API'leri uygulama" link="2022 4. Çeyrek'te tamamlandı" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
Angular'ı basitleştirme sürecinde, geliştiricilerin NgModule'ler olmadan uygulamaları başlatmasına, bileşenleri örneklemesine ve router'ı kullanmasına olanak tanıyan API'ler tanıtmak üzerinde çalışıyoruz. Angular v14, standalone bileşenler, direktifler ve pipe'lar için API'lerin geliştirici önizlemesini tanıtır. Önümüzdeki birkaç çeyrekte geliştiricilerden geri bildirim toplayacak ve API'leri kararlı hale getirerek projeyi tamamlayacağız. Sonraki adım olarak TestBed, Angular elements vb. gibi kullanım durumlarını iyileştirmek üzerinde çalışacağız.
</docs-card>
<docs-card title="Şablonlarda korumalı alanlara bağlama izni" link="2022 2. Çeyrek'te tamamlandı" href="guide/templates/binding">
Angular bileşenlerinin kapsüllenmesini iyileştirmek için bileşen örneğinin korumalı üyelerine bağlanmayı etkinleştirdik. Bu şekilde, şablonlarınız içinde kullanmak için bir alanı veya yöntemi artık public olarak açığa çıkarmanız gerekmez.
</docs-card>
<docs-card title="İleri düzey kavramlar hakkında kılavuzlar yayınlama" link="2022 2. Çeyrek'te tamamlandı" href="https://angular.io/guide/change-detection">
Değişiklik algılama hakkında derinlemesine bir kılavuz geliştirin ve yayınlayın. Angular uygulamalarının performans profilleme içeriğini geliştirin. Değişiklik algılamanın Zone.js ile nasıl etkileşimde bulunduğunu ve ne zaman tetiklendiğini, süresinin nasıl profilleneceğini ve performans optimizasyonu için yaygın uygulamaları kapsayın.
</docs-card>
<docs-card title="@angular/forms için katı tip denetimini dağıtma" link="2022 2. Çeyrek'te tamamlandı" href="guide/forms/typed-forms">
2021'in 4. çeyreğinde formlar için katı tiplemeyi tanıtmak üzere bir çözüm tasarladık ve 2022'nin 1. çeyreğinde ilgili yorum talebini sonuçlandırdık. Şu anda, mevcut projeler için iyileştirmeleri etkinleştirecek otomatik bir geçiş adımı ile bir dağıtım stratejisi uyguluyoruz. Harici topluluk için sorunsuz bir geçiş yolu sağlamak için çözümü önce Google'da 2.500'den fazla projede test ediyoruz.
</docs-card>
<docs-card title="Eski View Engine'i kaldırma" link="2022 1. Çeyrek'te tamamlandı" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
Tüm dahili araçlarımızın Ivy'ye geçişi tamamlandıktan sonra, azaltılmış Angular kavramsal yükü, daha küçük paket boyutu, daha düşük bakım maliyeti ve daha düşük kod tabanı karmaşıklığı için eski View Engine'i kaldıracağız.
</docs-card>
<docs-card title="İsteğe bağlı NgModules ile basitleştirilmiş Angular zihinsel modeli" link="2022 1. Çeyrek'te tamamlandı" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
Angular zihinsel modelini ve öğrenme yolculuğunu basitleştirmek için NgModule'leri isteğe bağlı hale getirmek üzerinde çalışacağız. Bu çalışma, geliştiricilerin standalone bileşenler geliştirmesine ve bileşenin derleme kapsamını bildirmek için alternatif bir API uygulamasına olanak tanır. Bu projeyi bir RFC'de yakaladığımız üst düzey tasarım tartışmalarıyla başlattık.
</docs-card>
<docs-card title="@angular/forms için katı tip denetimi tasarlama" link="2022 1. Çeyrek'te tamamlandı" href="guide/forms/typed-forms">
Minimum geriye dönük uyumsuz etkilerle reaktif formlar için daha katı tür denetimi uygulamanın bir yolunu bulmak üzerinde çalışacağız. Bu şekilde, geliştiricilerin geliştirme zamanında daha fazla sorunu yakalamasına, daha iyi metin editörü ve IDE desteği sağlamasına ve reaktif formlar için tür denetimini iyileştirmesine olanak tanıyoruz.
</docs-card>
<docs-card title="Angular DevTools'un framework ile entegrasyonunu iyileştirme" link="2022 1. Çeyrek'te tamamlandı" href="tools/devtools">
Angular DevTools'un framework ile entegrasyonunu iyileştirmek için kod tabanını angular/angular mono-deposuna taşımak üzerinde çalışıyoruz. Bu, Angular DevTools'un Bazel'e geçişini ve mevcut süreçlere ve CI hattına entegrasyonunu içerir.
</docs-card>
<docs-card title="Gelişmiş derleyici tanılamalarını başlatma" link="2022 1. Çeyrek'te tamamlandı" href="reference/extended-diagnostics">
Angular derleyicisinin tanılamalarını tür denetiminin ötesine genişletin. Doğruluk ve uygunluğu daha fazla garanti etmek için diğer doğruluk ve uygunluk kontrolleri tanıtın.
</docs-card>
<docs-card title="Uçtan uca test stratejimizi güncelleme" link="2021 3. Çeyrek'te tamamlandı" href="guide/testing">
Geleceğe yönelik bir e2e test stratejisi sağladığımızdan emin olmak için Protractor'un durumunu, topluluk yeniliklerini, e2e en iyi uygulamalarını değerlendirmek ve yeni fırsatları keşfetmek istiyoruz. Çabanın ilk adımları olarak bir RFC paylaştık ve Angular CLI ile e2e test için son teknoloji araçlar arasında sorunsuz entegrasyon sağlamak üzere ortaklarla çalıştık. Sonraki adım olarak, önerileri sonuçlandırmamız ve geçiş için bir kaynak listesi derlememiz gerekiyor.
</docs-card>
<docs-card title="Angular kütüphanelerinin Ivy kullanması" link="2021 3. Çeyrek'te tamamlandı" href="tools/libraries">
2020'nin başlarında Ivy kütüphane dağıtımı için bir RFC paylaştık. Topluluktan paha biçilmez geri bildirimlerden sonra projenin tasarımını geliştirdik. Şimdi kütüphane paketi formatının Ivy derlemesini kullanacak şekilde güncellenmesi, View Engine kütüphane formatının ve ngcc'nin kullanımdan kaldırılmasının engellenmesi dahil Ivy kütüphane dağıtımının geliştirilmesine yatırım yapıyoruz.
</docs-card>
<docs-card title="Otomatik test ortamı temizliği ile test sürelerini ve hata ayıklamayı iyileştirme" link="2021 3. Çeyrek'te tamamlandı" href="guide/testing">
Test süresini iyileştirmek ve testler arasında daha iyi izolasyon oluşturmak için, TestBed'i her test çalışmasından sonra test ortamını otomatik olarak temizleyip yıkacak şekilde değiştirmek istiyoruz.
</docs-card>
<docs-card title="IE11 desteğini kullanımdan kaldırma ve kaldırma" link="2021 3. Çeyrek'te tamamlandı" href="https://github.com/angular/angular/issues/41840">
Internet Explorer 11 (IE11), Angular'ın Web platformunun bazı modern özelliklerinden yararlanmasını engelliyordu. Bu projenin parçası olarak, evergreen tarayıcıların sağladığı modern özelliklere giden yolu açmak için IE11 desteğini kullanımdan kaldıracak ve kaldıracağız. Topluluktan geri bildirim toplamak ve ilerlemek için sonraki adımlara karar vermek üzere bir RFC çalıştırdık.
</docs-card>
<docs-card title="ES2017+'yi varsayılan çıktı dili olarak kullanma" link="2021 3. Çeyrek'te tamamlandı" href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html">
Modern tarayıcıları desteklemek, JavaScript'in daha kompakt, ifade edici ve performanslı yeni sözdiziminden yararlanmamıza olanak tanır. Bu projenin parçası olarak, bu çabayla ilerlemenin engelleyicilerinin ne olduğunu araştıracak ve bunu etkinleştirmek için adımlar atacağız.
</docs-card>
<docs-card title="Angular DevTools ile hızlandırılmış hata ayıklama ve performans profilleme" link="2021 2. Çeyrek'te tamamlandı" href="tools/devtools">
Angular için hata ayıklama ve performans profilleme yardımcı programları sağlayan geliştirme araçları üzerinde çalışıyoruz. Bu proje, geliştiricilerin bir Angular uygulamasındaki bileşen yapısını ve değişiklik algılamayı anlamasına yardımcı olmayı amaçlamaktadır.
</docs-card>
<docs-card title="Birleştirilmiş Angular versiyonlama ve dallanma ile sürümleri kolaylaştırma" link="2021 2. Çeyrek'te tamamlandı" href="reference/releases">
Angular için birden fazla GitHub deposu (angular/angular, angular/angular-cli ve angular/components) arasındaki sürüm yönetimi araçlarını birleştirmek istiyoruz. Bu çaba, altyapıyı yeniden kullanmamıza, süreçleri birleştirip basitleştirmemize ve sürüm sürecimizin güvenilirliğini artırmamıza olanak tanır.
</docs-card>
<docs-card title="Commit mesajı standardizasyonu ile daha yüksek geliştirici tutarlılığı" link="2021 2. Çeyrek'te tamamlandı" href="https://github.com/angular/angular">
Geliştirme sürecimize tutarlılık getirmek ve altyapı araçlarını yeniden kullanmak için Angular depoları (angular/angular, angular/components ve angular/angular-cli) genelinde commit mesajı gereksinimlerini ve uyumluluğunu birleştirmek istiyoruz.
</docs-card>
<docs-card title="Angular dil servisini Ivy'ye geçirme" link="2021 2. Çeyrek'te tamamlandı" href="tools/language-service">
Bu projenin amacı, dil servisini Ivy'ye geçirerek deneyimi iyileştirmek ve eski bağımlılığı kaldırmaktır. Bugün dil servisi, Ivy uygulamaları için bile hala View Engine derleyicisini ve tür denetimini kullanmaktadır. Uygulama davranışıyla eşleşmesi için Angular Dil servisi için Ivy şablon ayrıştırıcısını ve geliştirilmiş tür denetimini kullanmak istiyoruz. Bu geçiş aynı zamanda View Engine'in kaldırılmasının engellenmesini kaldırma yönünde bir adımdır, bu da Angular'ı basitleştirecek, npm paket boyutunu azaltacak ve framework'ün bakılabilirliğini iyileştirecektir.
</docs-card>
<docs-card title="Angular'da yerel Trusted Types ile artırılmış güvenlik" link="2021 2. Çeyrek'te tamamlandı" href="best-practices/security">
Google güvenlik ekibiyle işbirliği içinde, yeni Trusted Types API'si için destek ekliyoruz. Bu web platformu API'si, geliştiricilerin daha güvenli web uygulamaları oluşturmasına yardımcı olur.
</docs-card>
<docs-card title="Angular CLI webpack 5 ile optimize edilmiş derleme hızı ve paket boyutları" link="2021 2. Çeyrek'te tamamlandı" href="tools/cli/build">
v11 sürümünün parçası olarak, Angular CLI'de webpack 5'in isteğe bağlı bir önizlemesini tanıttık. Kararlılığı sağlamak için, derleme hızı ve paket boyutu iyileştirmelerini etkinleştirmek üzere uygulama üzerinde yinelemeye devam edeceğiz.
</docs-card>
<docs-card title="Universal uygulamalarda kritik stilleri satır içi eklemeyle daha hızlı uygulamalar" link="2021 1. Çeyrek'te tamamlandı" href="guide/ssr">
Harici stil sayfalarını yüklemek engelleyici bir işlemdir, yani tarayıcı tüm referans verilen CSS'i yükleyene kadar uygulamanızı render etmeye başlayamaz. Bir sayfanın başlığında render engelleyen kaynakların bulunması, yükleme performansını, örneğin ilk içerikli boyamasını önemli ölçüde etkileyebilir. Uygulamaları daha hızlı hale getirmek için, kritik CSS'i satır içi ekleme ve stillerin geri kalanını asenkron olarak yükleme konusunda Google Chrome ekibiyle işbirliği yapıyoruz.
</docs-card>
<docs-card title="Daha iyi Angular hata mesajlarıyla hata ayıklamayı iyileştirme" link="2021 1. Çeyrek'te tamamlandı" href="reference/errors">
Hata mesajları genellikle geliştiricilerin bunları çözmesine yardımcı olacak sınırlı eyleme geçirilebilir bilgi sunar. İlişkili kodlar ekleyerek, kılavuzlar ve diğer materyaller geliştirerek hata mesajlarını daha keşfedilebilir hale getirmek ve daha sorunsuz bir hata ayıklama deneyimi sağlamak üzerinde çalışıyoruz.
</docs-card>
<docs-card title="Yenilenmiş giriş dokümantasyonu ile geliştirilmiş geliştirici uyumu" link="2021 1. Çeyrek'te tamamlandı" href="tutorials">
Kullanıcı öğrenme yolculuklarını yeniden tanımlayacak ve giriş dokümantasyonunu yenileyeceğiz. Angular'ın faydalarını açıkça belirteceğiz, yeteneklerini nasıl keşfedeceğiniz konusunda rehberlik sağlayacağız ve geliştiricilerin mümkün olan en kısa sürede framework'te yetkin olmasını sağlayacağız.
</docs-card>
<docs-card title="Bileşen donanımları en iyi uygulamalarını genişletme" link="2021 1. Çeyrek'te tamamlandı" href="https://material.angular.dev/guide/using-component-harnesses">
Angular CDK, sürüm 9'da Angular'a bileşen test donanımları kavramını tanıttı. Test donanımları, bileşen yazarlarının bileşen etkileşimlerini test etmek için desteklenen API'ler oluşturmasına olanak tanır. Bu donanım altyapısını iyileştirmeye ve donanımları kullanma konusundaki en iyi uygulamaları netleştirmeye devam ediyoruz. Ayrıca Google içinde daha fazla donanım benimsemesi sağlamak için de çalışıyoruz.
</docs-card>
<docs-card title="İçerik projeksiyonu için bir kılavuz yazma" link="2021 2. Çeyrek'te tamamlandı" href="https://angular.io/docs">
İçerik projeksiyonu, dokümantasyonda hak ettiği yere sahip olmayan temel bir Angular kavramıdır. Bu projenin parçası olarak, içerik projeksiyonu için temel kullanım durumlarını ve kavramları belirlemek ve bunları belgelemek istiyoruz.
</docs-card>
<docs-card title="ESLint'e geçiş" link="2020 4. Çeyrek'te tamamlandı" href="tools/cli">
TSLint'in kullanımdan kaldırılmasıyla ESLint'e geçeceğiz. Sürecin parçası olarak, mevcut önerilen TSLint yapılandırmamızla geriye dönük uyumluluğu sağlamak, mevcut Angular uygulamaları için bir geçiş stratejisi uygulamak ve Angular CLI araç zincirine yeni araçlar tanıtmak üzerinde çalışacağız.
</docs-card>
<docs-card title="İş Yığını Temizliği Operasyonu (Operasyon Byelog olarak da bilinir)" link="2020 4. Çeyrek'te tamamlandı" href="https://github.com/angular/angular/issues">
Daha geniş topluluk ihtiyaçlarını net bir şekilde anlayana kadar mühendislik kapasitemizin %50'sine kadarını sorunları ve PR'ları triyaj etmeye aktif olarak yatırıyoruz. Bundan sonra, yeni gönderimlere hızlı bir şekilde yetişmek için mühendislik kapasitemizin %20'sine kadarını ayıracağız.
</docs-card>
</docs-card-container>
