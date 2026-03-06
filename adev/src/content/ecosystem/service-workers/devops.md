# Service worker DevOps

Bu sayfa, Angular service worker'ı kullanan üretim uygulamalarını dağıtmak ve desteklemek için bir referanstır.
Angular service worker'ın daha geniş üretim ortamına nasıl uyduğunu, çeşitli koşullar altında service worker'ın davranışını ve mevcut kaynakları ve güvenlik önlemlerini açıklar.

## Service worker ve uygulama kaynaklarının önbelleklenmesi

Angular service worker'ını, son kullanıcının web tarayıcısına yüklenmiş bir ileri önbellek veya bir İçerik Dağıtım Ağı (CDN) kenarı olarak düşünün.
Service worker, ağı beklemeye gerek kalmadan Angular uygulamasının yerel bir önbellekten kaynak veya veri isteklerine yanıt verir.
Herhangi bir önbellek gibi, içeriğin nasıl süresinin dolduğu ve güncellendiği konusunda kuralları vardır.

### Uygulama sürümleri

Angular service worker bağlamında, bir "sürüm", Angular uygulamasının belirli bir derlemesini temsil eden bir kaynak koleksiyonudur.
Uygulamanın yeni bir derlemesi dağıtıldığında, service worker bu derlemeyi uygulamanın yeni bir sürümü olarak ele alır.
Bu, yalnızca tek bir dosya güncellense bile geçerlidir.
Herhangi bir zamanda, service worker önbelleğinde uygulamanın birden fazla sürümü olabilir ve bunları aynı anda sunuyor olabilir.
Daha fazla bilgi için [Uygulama sekmeleri](#uygulama-sekmeleri) bölümüne bakın.

Uygulama bütünlüğünü korumak için Angular service worker, tüm dosyaları bir sürümde birlikte gruplar.
Bir sürümde gruplanan dosyalar genellikle HTML, JS ve CSS dosyalarını içerir.
Bu dosyaların gruplandırılması bütünlük için esastır çünkü HTML, JS ve CSS dosyaları sıklıkla birbirine atıfta bulunur ve belirli içeriğe bağlıdır.
Örneğin, bir `index.html` dosyası `bundle.js`'ye referans veren bir `<script>` etiketine sahip olabilir ve o betik içinden `startApp()` fonksiyonunu çağırmaya çalışabilir.
Bu `index.html` sürümü her sunulduğunda, karşılık gelen `bundle.js` de onunla birlikte sunulmalıdır.
Örneğin, `startApp()` fonksiyonunun her iki dosyada da `runApp()` olarak yeniden adlandırıldığını varsayın.
Bu senaryoda, `startApp()` çağıran eski `index.html`'i, `runApp()` tanımlayan yeni paketle birlikte sunmak geçerli değildir.

Bu dosya bütünlüğü, tembel yükleme söz konusu olduğunda özellikle önemlidir.
Bir JS paketi birçok tembel parçaya referans verebilir ve tembel parçaların dosya adları uygulamanın belirli derlemesine özgüdür.
`X` sürümünde çalışan bir uygulama tembel bir parça yüklemeye çalışırsa, ancak sunucu zaten `X + 1` sürümüne güncellendiyse, tembel yükleme işlemi başarısız olur.

Uygulamanın sürüm tanımlayıcısı, tüm kaynakların içeriğiyle belirlenir ve herhangi biri değişirse değişir.
Pratikte, sürüm, bilinen tüm içerik için hash'ler içeren `ngsw.json` dosyasının içeriğiyle belirlenir.
Önbelleğe alınan dosyalardan herhangi biri değişirse, dosyanın hash'i `ngsw.json`'da değişir. Bu değişiklik, Angular service worker'ın etkin dosya setini yeni bir sürüm olarak ele almasına neden olur.

HELPFUL: Derleme süreci, `ngsw-config.json`'dan gelen bilgileri kullanarak manifest dosyası `ngsw.json`'u oluşturur.

Angular service worker'ın versiyonlama davranışıyla, bir uygulama sunucusu Angular uygulamasının her zaman tutarlı bir dosya setine sahip olmasını sağlayabilir.

#### Güncelleme kontrolleri

Kullanıcı uygulamayı her açtığında veya yenilediğinde, Angular service worker `ngsw.json` manifestinde güncellemeleri arayarak uygulamaya yönelik güncellemeleri kontrol eder.
Bir güncelleme bulunursa, otomatik olarak indirilip önbelleğe alınır ve uygulama bir sonraki yüklendiğinde sunulur.

### Kaynak bütünlüğü

Uzun süre önbelleklemenin potansiyel yan etkilerinden biri, geçerli olmayan bir kaynağın yanlışlıkla önbelleğe alınmasıdır.
Normal bir HTTP önbelleğinde, zorla yenileme veya önbellek süresinin dolması, geçerli olmayan bir dosyayı önbelleğe almanın olumsuz etkilerini sınırlar.
Bir service worker bu tür kısıtlamaları yok sayar ve etkili bir şekilde tüm uygulamayı uzun süre önbelleğe alır.
Service worker'ın doğru içeriği alması önemlidir, bu nedenle kaynakların bütünlüğünü korumak için hash'leri saklar.

#### Hash'lenmiş içerik

Kaynak bütünlüğünü sağlamak için Angular service worker, hash'i olan tüm kaynakların hash'lerini doğrular.
[Angular CLI](tools/cli) ile oluşturulan bir uygulama için bu, kullanıcının `src/ngsw-config.json` yapılandırması tarafından kapsanan `dist` dizinindeki her şeydir.

Belirli bir dosya doğrulamayı geçemezse, Angular service worker tarayıcı veya ara önbelleklemeyi önlemek için bir "önbellek kırma" URL parametresi kullanarak içeriği yeniden almaya çalışır.
Bu içerik de doğrulamayı geçemezse, service worker uygulamanın tüm sürümünü geçerli değil olarak kabul eder ve uygulamayı sunmayı durdurur.
Gerekirse, service worker isteklerin ağa düştüğü güvenli bir moda girer. Bozuk, güncelliğini yitirmiş veya geçerli olmayan içerik sunma riski yüksekse service worker önbelleğini kullanmaz.

Hash uyumsuzlukları çeşitli nedenlerle oluşabilir:

- Kaynak sunucu ile son kullanıcı arasındaki önbellekleme katmanları eski içerik sunabilir
- Atomik olmayan bir dağıtım, Angular service worker'ın kısmen güncellenmiş içeriği görmesine neden olabilir
- Derleme süreci sırasında oluşan hatalar, `ngsw.json` güncellenmeden kaynakların güncellenmesine neden olabilir.
  Bunun tersi de olabilir ve güncellenmiş kaynaklar olmadan güncellenmiş bir `ngsw.json` elde edilebilir.

#### Hash'lenmemiş içerik

`ngsw.json` manifestinde hash'e sahip tek kaynaklar, manifest oluşturulduğu sırada `dist` dizininde mevcut olan kaynaklardır.
CDN'lerden yüklenen kaynaklar gibi diğer kaynaklar, derleme zamanında bilinmeyen içeriğe sahiptir veya uygulamanın dağıtılmasından daha sık güncellenir.

Angular service worker, bir kaynağın geçerli olduğunu doğrulamak için bir hash'e sahip değilse, yine de içeriğini önbelleğe alır. Aynı zamanda, _yeniden doğrularken eski_ politikası kullanarak HTTP önbellekleme başlıklarına uyar.
Angular service worker, HTTP önbellekleme başlıkları artık geçerli olmadığını belirtse bile bir kaynağı sunmaya devam eder. Aynı zamanda, süresi dolmuş kaynağı arka planda yenilemeye çalışır.
Bu sayede bozuk hash'siz kaynaklar, yapılandırılmış yaşam sürelerinin ötesinde önbellekte kalmaz.

### Uygulama sekmeleri

Aldığı kaynakların sürümü aniden veya uyarı olmadan değişirse bir uygulama için sorunlu olabilir.
Bu tür sorunların bir açıklaması için [Uygulama sürümleri](#uygulama-sürümleri) bölümüne bakın.

Angular service worker bir garanti sağlar: çalışan bir uygulama, uygulamanın aynı sürümünü çalıştırmaya devam eder.
Uygulamanın başka bir örneği yeni bir web tarayıcısı sekmesinde açılırsa, uygulamanın en güncel sürümü sunulur.
Sonuç olarak, bu yeni sekme orijinal sekmeden farklı bir uygulama sürümü çalıştırıyor olabilir.

IMPORTANT: Bu garanti, normal web dağıtım modelinin sağladığından **daha güçlüdür**. Service worker olmadan, tembel yüklenen kodun uygulamanın başlangıç koduyla aynı sürümden olduğuna dair bir garanti yoktur.

Angular service worker, aşağıdaki gibi hata koşulları altında çalışan bir uygulamanın sürümünü değiştirebilir:

- Başarısız bir hash nedeniyle mevcut sürüm geçersiz hale gelir.
- İlgisiz bir hata, service worker'ın güvenli moda girmesine ve geçici olarak devre dışı kalmasına neden olur.

Angular service worker, hiçbir sekme tarafından kullanılmadığında uygulama sürümlerini temizler.

Angular service worker'ın çalışan bir uygulamanın sürümünü değiştirebileceği diğer nedenler normal olaylardır:

- Sayfa yeniden yüklenir/yenilenir.
- Sayfa, `SwUpdate` servisi kullanılarak bir güncellemenin hemen etkinleştirilmesini ister.

### Service worker güncellemeleri

Angular service worker, web tarayıcılarında çalışan küçük bir betiktir.
Zaman zaman, hata düzeltmeleri ve özellik iyileştirmeleriyle service worker güncellenir.

Angular service worker, uygulama ilk açıldığında ve bir hareketsizlik döneminden sonra uygulamaya erişildiğinde indirilir.
Service worker değişirse, arka planda güncellenir.

Angular service worker'a yapılan güncellemelerin çoğu uygulama için şeffaftır. Eski önbellekler hala geçerlidir ve içerik normal şekilde sunulur.
Nadiren, Angular service worker'daki bir hata düzeltmesi veya özellik, eski önbelleklerin geçersiz kılınmasını gerektirebilir.
Bu durumda, service worker uygulamayı şeffaf bir şekilde ağdan yeniler.

### Service worker'ı atlama

Bazı durumlarda, service worker'ı tamamen atlamak ve tarayıcının isteği işlemesine izin vermek isteyebilirsiniz.
Bir örnek, [yüklenen dosyalar üzerinde ilerleme raporlama](https://github.com/w3c/ServiceWorker/issues/1141) gibi service worker'larda şu anda desteklenmeyen bir özelliğe güvenmenizdir.

Service worker'ı atlamak için `ngsw-bypass`'ı bir istek başlığı veya sorgu parametresi olarak ayarlayın.
Başlık veya sorgu parametresinin değeri yok sayılır ve boş olabilir veya atlanabilir.

### Sunucuya ulaşılamadığında service worker istekleri

Service worker, [service worker açıkça atlanmadıkça](#service-workerı-atlama) tüm istekleri işler.
Service worker, önbelleğin durumuna ve yapılandırmasına bağlı olarak önbelleğe alınmış bir yanıt döndürür veya isteği sunucuya gönderir.
Service worker yalnızca `GET` ve `HEAD` gibi değiştirici olmayan isteklere verilen yanıtları önbelleğe alır.

Service worker, sunucudan bir hata alırsa veya yanıt alamazsa, çağrının sonucunu gösteren bir hata durumu döndürür.
Örneğin, service worker yanıt alamazsa, döndürmek üzere bir [504 Gateway Timeout](https://developer.mozilla.org/docs/Web/HTTP/Status/504) durumu oluşturur. Bu örnekteki `504` durumu, sunucunun çevrimdışı olması veya istemcinin bağlantısının kesilmiş olması nedeniyle döndürülebilir.

## Angular service worker hatalarını ayıklama

Zaman zaman, sorunları araştırmak veya tasarlandığı gibi çalışıp çalışmadığını kontrol etmek için Angular service worker'ı çalışan durumda incelemek gerekebilir.
Tarayıcılar, service worker'ların hatalarını ayıklamak için yerleşik araçlar sağlar ve Angular service worker'ın kendisi de yararlı hata ayıklama özellikleri içerir.

### Hata ayıklama bilgilerini bulma ve analiz etme

Angular service worker, `ngsw/` sanal dizini altında hata ayıklama bilgilerini açığa çıkarır.
Şu anda açığa çıkan tek URL `ngsw/state`'tir.
İşte bu hata ayıklama sayfasının içeriğine bir örnek:

```shell {hideCopy}

NGSW Debug Info:

Driver version: 13.3.7
Driver state: NORMAL ((nominal))
Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c
Last update check: never

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:

- init post-load (update, cleanup)

Debug log:

```

#### Sürücü durumu

İlk satır sürücü durumunu gösterir:

```shell {hideCopy}

Driver state: NORMAL ((nominal))

```

`NORMAL`, service worker'ın normal şekilde çalıştığını ve düşürülmüş bir durumda olmadığını gösterir.

İki olası düşürülmüş durum vardır:

| Düşürülmüş durumlar     | Ayrıntılar                                                                                                                                                                                                                                                                                                                                                                                                                     |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EXISTING_CLIENTS_ONLY` | Service worker, uygulamanın bilinen en son sürümünün temiz bir kopyasına sahip değildir. Eski önbelleğe alınmış sürümler güvenle kullanılabilir, bu nedenle mevcut sekmeler önbellekten çalışmaya devam eder, ancak uygulamanın yeni yüklemeleri ağdan sunulur. Service worker, uygulamanın yeni bir sürümü tespit edilip yüklendiğinde bu durumdan kurtulmaya çalışır. Bu, yeni bir `ngsw.json` mevcut olduğunda gerçekleşir. |
| `SAFE_MODE`             | Service worker, önbelleğe alınmış verilerin kullanılmasının güvenliğini garanti edemez. Beklenmeyen bir hata oluşmuş veya tüm önbelleğe alınmış sürümler geçersiz hale gelmiştir. Tüm trafik ağdan sunulur ve mümkün olduğunca az service worker kodu çalıştırılır.                                                                                                                                                            |

Her iki durumda da parantez içindeki açıklama, service worker'ın düşürülmüş duruma girmesine neden olan hatayı sağlar.

Her iki durum da geçicidir; yalnızca [ServiceWorker örneğinin](https://developer.mozilla.org/docs/Web/API/ServiceWorkerGlobalScope) yaşam süresi boyunca saklanır.
Tarayıcı bazen bellek ve işlemci gücünden tasarruf etmek için boş bir service worker'ı sonlandırır ve ağ olaylarına yanıt olarak yeni bir service worker örneği oluşturur.
Yeni örnek, önceki örneğin durumuna bakılmaksızın `NORMAL` modda başlar.

#### En son manifest hash'i

```shell {hideCopy}

Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c

```

Bu, service worker'ın bildiği uygulamanın en güncel sürümünün SHA1 hash'idir.

#### Son güncelleme kontrolü

```shell {hideCopy}

Last update check: never

```

Bu, service worker'ın uygulamanın yeni bir sürümünü veya güncellemesini en son ne zaman kontrol ettiğini gösterir.
`never`, service worker'ın hiç güncelleme kontrolü yapmadığını gösterir.

Bu örnek hata ayıklama dosyasında, güncelleme kontrolü şu anda planlanmıştır; bu, bir sonraki bölümde açıklanmaktadır.

#### Sürüm

```shell {hideCopy}

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

```

Bu örnekte, service worker uygulamanın önbelleğe alınmış bir sürümüne sahiptir ve iki farklı sekmeye hizmet vermek için kullanmaktadır.

HELPFUL: Bu sürüm hash'i, yukarıda listelenen "en son manifest hash"tir. Her iki istemci de en son sürümdedir. Her istemci, tarayıcıdaki `Clients` API'sinden kimliğiyle listelenir.

#### Boş görev kuyruğu

```shell {hideCopy}

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:

- init post-load (update, cleanup)

```

Boş Görev Kuyruğu, service worker'da arka planda gerçekleşen tüm bekleyen görevlerin kuyruğudur.
Kuyrukta görevler varsa, bir açıklama ile listelenir.
Bu örnekte, service worker'ın bir güncelleme kontrolü ve eski önbelleklerin temizlenmesini içeren bir başlatma sonrası işlem olmak üzere planlanmış bir görevi vardır.

Son güncelleme onay/çalıştırma sayaçları, boş kuyrukla ilgili belirli olayların gerçekleşmesinden bu yana geçen süreyi verir.
"Last update run" sayacı, boş görevlerin en son ne zaman gerçekten çalıştırıldığını gösterir.
"Last update tick", kuyruğun işlenebileceği son olaydan bu yana geçen süreyi gösterir.

#### Hata ayıklama günlüğü

```shell {hideCopy}

Debug log:

```

Service worker içinde oluşan hatalar burada günlüğe kaydedilir.

### Geliştirici araçları

Chrome gibi tarayıcılar, service worker'larla etkileşim için geliştirici araçları sağlar.
Bu tür araçlar düzgün kullanıldığında güçlü olabilir, ancak akılda tutulması gereken birkaç şey vardır.

- Geliştirici araçlarını kullanırken, service worker arka planda çalışmaya devam eder ve asla yeniden başlamaz.
  Bu, Geliştirici Araçları açıkken oluşan davranışın, kullanıcının deneyimleyebileceği davranıştan farklı olmasına neden olabilir.

- Cache Storage görüntüleyicisine bakarsanız, önbellek sıklıkla güncel değildir.
  Cache Storage başlığına sağ tıklayıp önbellekleri yenileyin.

- Service Worker panelinde service worker'ı durdurup başlatmak güncellemeleri kontrol eder

## Service worker güvenliği

Hatalar veya bozuk yapılandırmalar Angular service worker'ın beklenmedik şekillerde davranmasına neden olabilir.
Bu durumda, bir yöneticinin service worker'ı hızla devre dışı bırakması gerekirse, Angular service worker birkaç güvenlik mekanizması içerir.

### Güvenli mod

Service worker'ı devre dışı bırakmak için `ngsw.json` dosyasını yeniden adlandırın veya silin.
Service worker'ın `ngsw.json` isteği `404` döndürdüğünde, service worker tüm önbelleklerini kaldırır ve kendisini kayıttan çıkarır, esasen kendini yok eder.

### Güvenlik worker'ı

<!-- vale Angular.Google_Acronyms = NO -->

`@angular/service-worker` NPM paketinde küçük bir betik olan `safety-worker.js` de bulunmaktadır.
Yüklendiğinde, kendisini tarayıcıdan kaydını siler ve service worker önbelleklerini kaldırır.
Bu betik, istemci sayfalarında zaten yüklenmiş istenmeyen service worker'lardan kurtulmak için son çare olarak kullanılabilir.

<!-- vale Angular.Google_Acronyms = YES -->

CRITICAL: Eski istemciler, farklı worker betiğini yükleyen yeni bir `index.html` görmeyebileceğinden, bu worker'ı doğrudan kaydedemezsiniz.

Bunun yerine, `safety-worker.js`'nin içeriğini, kayıttan çıkarmaya çalıştığınız Service Worker betiğinin URL'sinde sunmalısınız. Tüm kullanıcıların eski worker'ı başarıyla kayıttan çıkardığından emin olana kadar bunu yapmaya devam etmelisiniz.
Çoğu site için bu, güvenlik worker'ını eski Service Worker URL'sinde sonsuza kadar sunmanız gerektiği anlamına gelir.
Bu betik, `@angular/service-worker`'ı devre dışı bırakmak ve ilgili önbellekleri kaldırmak için kullanılabilir. Ayrıca, sitenizde geçmişte sunulmuş olabilecek diğer Service Worker'ları da kaldırır.

### Uygulamanızın konumunu değiştirme

IMPORTANT: Service worker'lar yönlendirmenin arkasında çalışmaz.
`The script resource is behind a redirect, which is disallowed` hatasıyla zaten karşılaşmış olabilirsiniz.

Uygulamanızın konumunu değiştirmeniz gerekirse bu bir sorun olabilir.
Eski konumdan, bu örnekte `example.com`'dan yeni konuma `www.example.com`'a bir yönlendirme ayarlarsanız, worker çalışmayı durdurur.
Ayrıca, siteyi tamamen Service Worker'dan yükleyen kullanıcılar için yönlendirme tetiklenmez bile.
`example.com`'da kayıtlı olan eski worker, güncelleme yapmaya çalışır ve eski konum `example.com`'a bir istek gönderir. Bu istek yeni konum `www.example.com`'a yönlendirilir ve hatayı oluşturur: `The script resource is behind a redirect, which is disallowed`.

Bunu düzeltmek için, önceki tekniklerden birini kullanarak eski worker'ı devre dışı bırakmanız gerekebilir: [Fail-safe](#güvenli-mod) veya [Safety Worker](#güvenlik-workerı).

## Angular service worker'lar hakkında daha fazlası

Aşağıdakiler de ilginizi çekebilir:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="Configuration file"/>
  <docs-pill href="ecosystem/service-workers/communications" title="Communicating with the Service Worker"/>
</docs-pill-row>
