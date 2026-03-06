# Angular Versiyonlama ve Yayınlar

Angular framework'ünden kararlılık beklediğinizi biliyoruz.
Kararlılık, yeniden kullanılabilir bileşenlerin ve kütüphanelerin, eğitimlerin, araçların ve öğrenilen pratiklerin beklenmedik şekilde kullanılmaz hale gelmemesini sağlar.
Kararlılık, Angular etrafındaki ekosistemin gelişmesi için esastır.

Angular'ın gelişmeye devam etmesi gerektiği konusunda da sizinle aynı fikirdeyiz.
Üzerine inşa ettiğiniz temelin sürekli olarak geliştiğinden ve web ekosisteminin geri kalanı ile kullanıcı ihtiyaçlarınıza ayak uydurmanızı sağladığından emin olmaya çalışıyoruz.

Bu belge, size öncü bir uygulama geliştirme platformu sağlamak için izlediğimiz uygulamaları, kararlılık ile dengeleyerek içerir.
Gelecekteki değişikliklerin her zaman öngörülebilir bir şekilde tanıtılmasını sağlamaya çalışıyoruz.
Angular'a bağımlı olan herkesin, yeni özelliklerin ne zaman ve nasıl eklendiğini bilmesini ve eskiyen özellikler kaldırıldığında iyi hazırlıklı olmasını istiyoruz.

Bazen API'lerin veya özelliklerin kaldırılması gibi _kırıcı değişiklikler_, yenilik yapmak ve gelişen en iyi uygulamalar, değişen bağımlılıklar veya web platformundaki değişimlerle güncel kalmak için gereklidir. Bu kırıcı değişiklikler, [kullanımdan kaldırma politikamızda](#kullanımdan-kaldırma-politikası) açıklanan bir kullanımdan kaldırma sürecinden geçer.

Bu geçişleri mümkün olduğunca kolay hale getirmek için Angular ekibi şu taahhütlerde bulunur:

- Kırıcı değişikliklerin sayısını en aza indirmek ve mümkün olduğunda geçiş araçları sağlamak için çok çalışıyoruz
- Burada açıklanan kullanımdan kaldırma politikasını izliyoruz, böylece uygulamalarınızı en son API'lere ve en iyi uygulamalara güncellemek için zamanınız olur

HELPFUL: Bu belgede açıklanan uygulamalar Angular 2.0 ve sonrası için geçerlidir.
Şu anda AngularJS kullanıyorsanız, [AngularJS'den Yükseltme](https://angular.io/guide/upgrade 'Upgrading from Angular JS') bölümüne bakın.
_AngularJS_, Angular'ın tüm v1.x sürümlerinin adıdır.

## Angular versiyonlama

Angular sürüm numaraları, yayının getirdiği değişikliklerin düzeyini gösterir.
[Semantik versiyonlama](https://semver.org/ 'Semantic Versioning Specification') kullanımı, yeni bir sürüme güncellemenin potansiyel etkisini anlamanıza yardımcı olur.

Angular sürüm numaraları üç bölümden oluşur: `major.minor.patch`.
Örneğin, 7.2.11 sürümü ana sürüm 7, alt sürüm 2 ve yama düzeyi 11'i gösterir.

Sürüm numarası, yayına dahil edilen değişikliğin düzeyine göre artırılır.

| Değişiklik düzeyi | Ayrıntılar                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Ana sürüm         | Önemli yeni özellikler içerir, güncelleme sırasında biraz ancak minimal düzeyde geliştirici yardımı beklenir. Yeni bir ana sürüme güncellerken güncelleme betikleri çalıştırmanız, kodu yeniden düzenlemeniz, ek testler çalıştırmanız ve yeni API'leri öğrenmeniz gerekebilir.                                                                                                                                                                               |
| Alt sürüm         | Daha küçük yeni özellikler içerir. Alt sürümler tamamen geriye dönük uyumludur; güncelleme sırasında geliştirici yardımı beklenmez, ancak yayında eklenen yeni API'leri, özellikleri ve yetenekleri kullanmaya başlamak için uygulamalarınızı ve kütüphanelerinizi isteğe bağlı olarak değiştirebilirsiniz. Eş bağımlılıkları alt sürümlerde desteklenen sürümleri genişleterek güncelleriz, ancak projelerin bu bağımlılıkları güncellemesini gerektirmeyiz. |
| Yama sürümü       | Düşük riskli, hata düzeltme sürümü. Güncelleme sırasında geliştirici yardımı beklenmez.                                                                                                                                                                                                                                                                                                                                                                       |

HELPFUL: Angular sürüm 7'den itibaren, Angular çekirdeği ve CLI'nin ana sürümleri hizalanmıştır.
Bu, bir Angular uygulaması geliştirirken CLI'yi kullanmak için `@angular/core` ve CLI sürümlerinin aynı olması gerektiği anlamına gelir.

### Ön sürümler

Her ana ve alt sürüm için "Next" ve Sürüm Adayı \(`rc`\) ön sürümler sağlayarak nelerin geleceğini önizlemenize izin veriyoruz:

| Ön sürüm türü | Ayrıntılar                                                                                                                                                           |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next          | Aktif geliştirme ve test altında olan sürüm. Sonraki sürüm, `8.1.0-next.0` gibi `-next` tanımlayıcısı eklenen bir sürüm etiketiyle belirtilir.                       |
| Sürüm adayı   | Özellik açısından tamamlanmış ve son test aşamasında olan bir sürüm. Bir sürüm adayı, `8.1.0-rc.0` gibi `-rc` tanımlayıcısı eklenen bir sürüm etiketiyle belirtilir. |

En son `next` veya `rc` ön sürüm dokümantasyonu [next.angular.dev](https://next.angular.dev) adresinde mevcuttur.

## Yayın sıklığı

Angular'ın süregelen evrimi ile güncellemelerinizi planlayabilmeniz ve koordine edebilmeniz için düzenli bir yayın takvimi doğrultusunda çalışıyoruz.

HELPFUL: Tarihler genel yönlendirme olarak sunulmuştur ve değişikliğe tabidir.

Genel olarak, aşağıdaki yayın döngüsünü bekleyin:

- Her 6 ayda bir ana sürüm
- Her ana sürüm için 1-3 alt sürüm
- Neredeyse her hafta bir yama sürümü ve ön sürüm \(`next` veya `rc`\) derlemesi

Bu yayın kadansı, hevesli geliştiricilere yeni özellikler tamamen geliştirildikten ve kod inceleme ve entegrasyon test süreçlerimizden geçtikten sonra en kısa sürede erişim sağlarken, ön sürüm derlemelerini kullanan Google ve diğer geliştiriciler tarafından doğrulandıktan sonra özellikleri almayı tercih eden üretim kullanıcıları için platformun kararlılığını ve güvenilirliğini korur.

## Destek politikası ve takvimi

HELPFUL: Yaklaşık tarihler genel yönlendirme olarak sunulmuştur ve değişikliğe tabidir.

### Yayın takvimi

<!-- Release schedule for upcoming versions is TBA. -->

| Sürüm | Tarih              |
| :---- | :----------------- |
| v21.1 | 2026-01-12 haftası |
| v21.2 | 2026-02-23 haftası |
| v22.0 | 2026-05-18 haftası |

### Destek penceresi

Tüm ana sürümler tipik olarak 18 ay desteklenir.

| Destek aşaması      | Destek zamanlaması | Ayrıntılar                                                                       |
| :------------------ | :----------------- | :------------------------------------------------------------------------------- |
| Aktif               | 6 ay               | Düzenli olarak planlanmış güncellemeler ve yamalar yayınlanır                    |
| Uzun vadeli \(LTS\) | 12 ay              | Yalnızca [kritik düzeltmeler ve güvenlik yamaları](#lts-düzeltmeleri) yayınlanır |

### Aktif olarak desteklenen sürümler

Aşağıdaki tablo, destek altındaki Angular sürümlerinin durumunu gösterir.

| Sürüm   | Durum | Yayınlandı | Aktif bitiş | LTS bitiş  |
| :------ | :---- | :--------- | :---------- | :--------- |
| ^21.0.0 | Aktif | 2025-11-19 | 2026-05-19  | 2027-05-19 |
| ^20.0.0 | LTS   | 2025-05-28 | 2025-11-19  | 2026-11-28 |
| ^19.0.0 | LTS   | 2024-11-19 | 2025-05-28  | 2026-05-19 |

Angular v2'den v18'e kadar olan sürümler artık desteklenmemektedir.

### LTS düzeltmeleri

Genel bir kural olarak, bir düzeltme aşağıdakilerden birini çözüyorsa LTS sürümü için değerlendirilir:

- Yeni tespit edilen bir güvenlik açığı,
- LTS başlangıcından itibaren, yeni bir tarayıcı sürümü gibi üçüncü taraf bir değişiklikten kaynaklanan bir regresyon.

## Kullanımdan kaldırma politikası

Angular ekibi bir API'yi veya özelliği kaldırmayı planladığında, _kullanımdan kaldırılmış_ olarak işaretlenir. Bu, bir API eskimiş olduğunda, başka bir API ile değiştirildiğinde veya başka bir şekilde durdurulduğunda gerçekleşir. Kullanımdan kaldırılmış API'ler, en az iki ana sürüm (yaklaşık bir yıl) süren kullanımdan kaldırılma aşamaları boyunca kullanılabilir olmaya devam eder.

Güncelleme için yeterli zamanınız ve net bir yolunuz olmasını sağlamaya yardımcı olmak için kullanımdan kaldırma politikamız şudur:

| Kullanımdan kaldırma aşamaları | Ayrıntılar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :----------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Duyuru                         | Kullanımdan kaldırılan API'leri ve özellikleri [değişiklik günlüğünde](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Angular change log') duyuruyoruz. Kullanımdan kaldırılan API'ler [dokümantasyonda](api?status=8) ~~üstü çizili~~ olarak görünür. Bir kullanımdan kaldırma duyurusu yaptığımızda, önerilen bir güncelleme yolu da duyururuz. Ek olarak, tüm kullanımdan kaldırılan API'ler ilgili dokümantasyonda `@deprecated` ile açıklanır; bu, projeniz bunlara bağlıysa metin editörlerinin ve IDE'lerin ipuçları sağlamasını mümkün kılar. |
| Kullanımdan kaldırma dönemi    | Bir API veya özellik kullanımdan kaldırıldığında, en az sonraki iki ana sürümde (en az 12 aylık dönem) hala mevcuttur. Bundan sonra, kullanımdan kaldırılan API'ler ve özellikler kaldırma adayıdır. Bir kullanımdan kaldırma herhangi bir sürümde duyurulabilir, ancak kullanımdan kaldırılan bir API veya özelliğin kaldırılması yalnızca ana sürümde gerçekleşir. Kullanımdan kaldırılan bir API veya özellik kaldırılana kadar, LTS destek politikasına göre sürdürülür, yani yalnızca kritik ve güvenlik sorunları düzeltilir.                               |
| npm bağımlılıkları             | Uygulamalarınızda değişiklik gerektiren npm bağımlılık güncellemelerini yalnızca ana sürümde yaparız. Alt sürümlerde, desteklenen sürümleri genişleterek eş bağımlılıkları güncelleriz, ancak projelerin bu bağımlılıkları gelecekteki bir ana sürüme kadar güncellemesini gerektirmeyiz. Bu, alt Angular sürümleri sırasında Angular uygulamaları ve kütüphaneleri içindeki npm bağımlılık güncellemelerinin isteğe bağlı olduğu anlamına gelir.                                                                                                                 |

## Uyumluluk politikası

Angular, birçok paket, alt proje ve araçtan oluşan bir koleksiyondur.
Özel API'lerin yanlışlıkla kullanılmasını önlemek ve burada açıklanan uygulamalar tarafından nelerin kapsandığını net bir şekilde anlayabilmeniz için - genel API yüzeyimiz olarak neyin kabul edilip edilmediğini belgeliyoruz.
Ayrıntılar için [Angular'ın Desteklenen Genel API Yüzeyi](https://github.com/angular/angular/blob/main/contributing-docs/public-api-surface.md 'Supported Public API Surface of Angular') bölümüne bakın.

Angular'ın geriye dönük uyumluluğunu garanti etmek için herhangi bir değişikliği birleştirmeden önce bir dizi kontrol çalıştırıyoruz:

- Birim testleri ve entegrasyon testleri
- Değişiklikten önce ve sonra genel API yüzeyinin tür tanımlarını karşılaştırma
- Google'da Angular'a bağımlı olan tüm uygulamaların testlerini çalıştırma

Genel API yüzeyindeki herhangi bir değişiklik, daha önce açıklanan versiyonlama, destek ve kullanımdan kaldırma politikalarına uygun olarak yapılır. Kritik güvenlik yamaları gibi istisnai durumlarda, düzeltmeler geriye dönük uyumsuz değişiklikler getirebilir. Bu tür istisnai durumlar, framework'ün resmi iletişim kanallarında açık bir bildirimle birlikte sunulur.

## Kırıcı değişiklik politikası ve güncelleme yolları

Kırıcı değişiklik, sonraki durumun önceki durumla geriye dönük uyumlu olmaması nedeniyle çalışma yapmanızı gerektirir. Bu kuraldan nadir istisnaları [Uyumluluk politikası](#uyumluluk-politikası) bölümünde bulabilirsiniz. Kırıcı değişikliklerin örnekleri arasında genel API'lerin kaldırılması veya Angular'ın tür tanımının diğer değişiklikleri, çağrıların zamanlamasının değiştirilmesi veya Angular'ın bir bağımlılığının kendi başına kırıcı değişiklikler içeren yeni bir sürümüne güncelleme yer alır.

Angular'daki kırıcı değişiklikler durumunda sizi desteklemek için:

- Genel bir API'yi kaldırmadan önce [kullanımdan kaldırma politikamızı](#kullanımdan-kaldırma-politikası) izliyoruz
- `ng update` komutu aracılığıyla güncelleme otomasyonunu destekliyoruz. Bu, Google'da yüz binlerce proje üzerinde önceden test ettiğimiz kod dönüşümleri sağlar
- Bir ana sürümden diğerine nasıl güncelleneceğine dair adım adım talimatlar ["Angular Güncelleme Kılavuzu"](update-guide)'nda bulunur

Aşağıdaki kriterler karşılandığında Angular'ın herhangi bir sürümüne `ng update` yapabilirsiniz:

- Güncelleme yapmak istediğiniz _hedef_ sürüm destekleniyor olmalıdır.
- Güncelleme yaptığınız _kaynak_ sürüm, hedef sürümün bir ana sürüm gerisinde olmalıdır.

Örneğin, sürüm 12 hala destekleniyorsa sürüm 11'den sürüm 12'ye güncelleyebilirsiniz.
Birden fazla ana sürüm arasında güncelleme yapmak istiyorsanız, her güncellemeyi her seferinde bir ana sürüm olarak gerçekleştirin.
Örneğin, sürüm 10'dan sürüm 12'ye güncellemek için:

1. Sürüm 10'dan sürüm 11'e güncelleyin.
1. Sürüm 11'den sürüm 12'ye güncelleyin.

## Geliştirici Önizlemesi

Zaman zaman "Geliştirici Önizlemesi" etiketi altında yeni API'ler tanıtıyoruz. Bunlar tamamen işlevsel ve cilalı API'lerdir, ancak normal kullanımdan kaldırma politikamız altında kararlı hale getirmeye hazır değiliz.

Bu, kararlılaştırmadan önce gerçek uygulamalardan geri bildirim toplamak istememizden veya ilişkili dokümantasyon ya da geçiş araçlarının tam olarak tamamlanmamış olmasından kaynaklanabilir. Geri bildirim, geliştiricilerin deneyimlerini paylaşabileceği, hata bildirebileceği veya özelliği iyileştirmek için önerilerde bulunabileceği bir [GitHub issue](https://github.com/angular/angular/issues) aracılığıyla sağlanabilir.

Bu belgede açıklanan politikalar ve uygulamalar, Geliştirici Önizlemesi olarak işaretlenen API'ler için geçerli değildir. Bu tür API'ler, framework'ün yeni yama sürümlerinde bile herhangi bir zamanda değişebilir. Ekipler, Geliştirici Önizlemesi API'lerini kullanmanın faydalarının, normal semantik versiyonlama kullanımımız dışındaki kırıcı değişiklik riskine değip değmeyeceğine kendileri karar vermelidir.

## Deneysel

Bu API'ler hiçbir zaman kararlı olmayabilir veya kararlı olmadan önce önemli değişiklikler geçirebilir.

Bu belgede açıklanan politikalar ve uygulamalar, deneysel olarak işaretlenen API'ler için geçerli değildir. Bu tür API'ler, framework'ün yeni yama sürümlerinde bile herhangi bir zamanda değişebilir. Ekipler, deneysel API'leri kullanmanın faydalarının, normal semantik versiyonlama kullanımımız dışındaki kırıcı değişiklik riskine değip değmeyeceğine kendileri karar vermelidir.
