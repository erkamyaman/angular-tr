# Chrome DevTools ile profil çıkarma

Angular, framework'e özgü verileri ve içgörüleri doğrudan [Chrome DevTools performans panelinde](https://developer.chrome.com/docs/devtools/performance/overview) sunmak için [Chrome DevTools genişletilebilirlik API'si](https://developer.chrome.com/docs/devtools/performance/extension) ile entegre olur.

Entegrasyon etkinleştirildiğinde, iki veri seti içeren bir [performans profili kaydedebilirsiniz](https://developer.chrome.com/docs/devtools/performance#record):

- Chrome'un kodunuzun bir tarayıcıda çalışmasını anlayışına dayanan standart performans girişleri ve
- Framework'un çalışma zamanı tarafından sağlanan Angular'a özgü girişler.

Her iki veri seti de aynı sekmede ancak ayrı izlerde birlikte sunulur:

<img alt="Angular custom track in Chrome DevTools profiler" src="assets/images/best-practices/runtime-performance/angular-perf-in-chrome.png">

Angular'a özgü veriler, bir tarayıcı tarafından yakalanan daha düşük düzeyli fonksiyon ve yöntem çağrılarının yanında framework kavramları (bileşenler, değişiklik algılama, yaşam döngüsü kancaları vb.) açısından ifade edilir. Bu iki veri seti birbiriyle ilişkilidir ve farklı görünümler ile ayrıntı düzeyleri arasında geçiş yapabilirsiniz.

Kodunuzun tarayıcıda nasıl çalıştığını daha iyi anlamak için Angular izini kullanabilirsiniz, bunlar arasında:

- Belirli bir kod bloğunun Angular uygulamasının bir parçası olup olmadığını veya aynı sayfada çalışan başka bir betiğe ait olup olmadığını belirleme.
- Performans darboğazlarını belirleme ve bunları belirli bileşenlere veya servislere atama.
- Her değişiklik algılama döngüsünün görsel bir dökümüyle Angular'ın iç çalışmaları hakkında daha derin içgörü kazanma.

## Profil kaydetme

### Entegrasyonu etkinleştirme

Angular profil çıkarmayı iki yoldan biriyle etkinleştirebilirsiniz:

1. Chrome'un konsol panelinde [`ng.enableProfiling()`](api/core/enableProfiling) çalıştırın veya
1. Uygulama başlangıç kodunuza (`@angular/core`'dan içeri aktarılan) [`enableProfiling()`](api/core/enableProfiling) çağrısını ekleyin.

NOTE: Angular profil çıkarma yalnızca geliştirme modunda çalışır.

Başlangıçta çalışan tüm olayları yakalamak için uygulama bootstrap'inde entegrasyonu nasıl etkinleştirebileceğinize dair bir örnek:

```ts
import {enableProfiling} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {MyApp} from './my-app';

// Başlangıçta çalışan tüm kodu yakalamak için uygulamanızı
// başlatmadan *önce* profil çıkarmayı etkinleştirin.
enableProfiling();
bootstrapApplication(MyApp);
```

### Profil kaydetme

Chrome DevTools performans panelindeki **Record** düğmesini kullanın:

<img alt="Recording a profile" src="assets/images/best-practices/runtime-performance/recording-profile-in-chrome.png">

Profil kaydetme hakkında daha fazla ayrıntı için [Chrome DevTools belgeleri](https://developer.chrome.com/docs/devtools/performance#record)'ne bakın.

## Kaydedilmiş bir profili yorumlama

Performans sorunlarını hızla belirlemek ve teşhis etmek için "Angular" özel izini kullanabilirsiniz. Aşağıdaki bölümler bazı yaygın profil çıkarma senaryolarını tanımlamaktadır.

### Angular uygulamanız ile aynı sayfadaki diğer görevleri ayırt etme

Angular ve Chrome verileri ayrı ancak ilişkili izlerde sunulduğu için, Angular'ın uygulama kodunun ne zaman çalıştırıldığını, başka bir tarayıcı işleminin (tipik olarak düzenleme ve boyama) veya aynı sayfada çalışan diğer betiklerin (bu durumda özel Angular izinde herhangi bir veri bulunmaz) aksine görebilirsiniz:

<img alt="Profile data: Angular vs. 3rd party scripts execution" src="assets/images/best-practices/runtime-performance/profile-angular-vs-3rd-party.png">

Bu, daha fazla araştırmanın Angular uygulama koduna mı yoksa kod tabanınızın veya bağımlılıklarınızın diğer bölümlerine mi odaklanması gerektiğini belirlemenize olanak tanır.

### Renk kodlaması

Angular, görev türlerini ayırt etmek için alev grafiği grafiklerinde renkler kullanır:

- 🟦 Mavi, uygulama geliştiricisi tarafından yazılan TypeScript kodunu temsil eder (örneğin: servisler, bileşen yapıcıları ve yaşam döngüsü kancaları vb.).
- 🟪 Mor, uygulama geliştiricisi tarafından yazılan ve Angular derleyicisi tarafından dönüştürülen şablon kodunu temsil eder.
- 🟩 Yeşil, uygulama koduna giriş noktalarını temsil eder ve kod çalıştırma _nedenlerini_ belirler.

Aşağıdaki örnekler, çeşitli gerçek kayıtlarda tanımlanan renk kodlamasını göstermektedir.

#### Örnek: Uygulama başlatma

Uygulama bootstrap süreci genellikle şu öğelerden oluşur:

- `bootstrapApplication` çağrısı, kök bileşenin örneklenmesi ve ilk değişiklik algılama gibi maviye işaretlenmiş tetikleyiciler
- Bootstrap sırasında örneklenen, yeşile işaretlenmiş çeşitli DI servisleri.

<img alt="Profile data: bootstrap application" src="assets/images/best-practices/runtime-performance/profile-bootstrap-application.png">

#### Örnek: Bileşen işleme

Bir bileşenin işlenmesi tipik olarak bir giriş noktası (mavi) ve ardından şablon çalıştırması (mor) olarak temsil edilir. Bir şablon ise direktiflerin örneklenmesini ve yaşam döngüsü kancalarının çalıştırılmasını (yeşil) tetikleyebilir:

<img alt="Profile data: component processing" src="assets/images/best-practices/runtime-performance/profile-component-processing.png">

#### Örnek: Değişiklik algılama

Bir degisiklik algilama dongusu genellikle bir veya daha fazla veri senkronizasyon gecisindan (mavi) olusur; her gecis bir bilesen alt kumesini gezer.

<img alt="Profile data: change detection" src="assets/images/best-practices/runtime-performance/profile-change-detection.png">

Bu veri gorsellestirmesi ile, degisiklik algilamaya dahil olan bilesenler ve hangilerinin atlangini (tipik olarak kirli olarak isaretlenmemis `OnPush` bilesenleri) hemen belirlemek mumkundur.

Ek olarak, bir degisiklik algilama icin senkronizasyon gecisi sayisini inceleyebilirsiniz. Birden fazla senkronizasyon gecisine sahip olmak, degisiklik algilama sirasinda durumun guncellendigini gostrebilir. Bundan kacinmalisiniz, cunku sayfa guncellemelerini yavaslatir ve en kotu durumda sonsuz dongulere bile yol acabilir.
