# Angular service worker'a genel bakış

IMPORTANT: Angular Service Worker, sınırlı bir özellik kümesiyle basit çevrimdışı destek için temel bir önbellekleme aracıdır. Güvenlik düzeltmeleri dışında yeni özellik kabul etmeyeceğiz. Daha gelişmiş önbellekleme ve çevrimdışı yetenekler için doğrudan yerel tarayıcı API'lerini incelemenizi öneririz.

Service worker'lar geleneksel web dağıtım modelini güçlendirir ve uygulamaların, işletim sisteminiz ve donanımınız üzerinde çalışmak için yazılmış kodla eşdeğer güvenilirlik ve performansla kullanıcı deneyimi sunmasını sağlar.
Bir Angular uygulamasına service worker eklemek, bir uygulamayı [Progressive Web App](https://web.dev/progressive-web-apps/) (PWA olarak da bilinir) haline getirme adımlarından biridir.

En basit haliyle, service worker web tarayıcısında çalışan ve bir uygulama için önbelleklemeyi yöneten bir betiktir.

Service worker'lar bir ağ proxy'si olarak işlev görür.
Uygulama tarafından yapılan tüm giden HTTP isteklerini yakalar ve bunlara nasıl yanıt verileceğini seçebilir.
Örneğin, yerel bir önbelleği sorgulayabilir ve varsa önbelleğe alınmış bir yanıt sunabilir.
Proxy işlemi, `fetch` gibi programatik API'ler aracılığıyla yapılan isteklerle sınırlı değildir; HTML'de referans verilen kaynakları ve hatta `index.html`'e yapılan ilk isteği de kapsar.
Service worker tabanlı önbellekleme bu nedenle tamamen programlanabilirdir ve sunucu tarafından belirtilen önbellekleme başlıklarına bağlı değildir.

Bir uygulamayı oluşturan diğer betiklerin, örneğin Angular uygulama paketinin aksine, service worker kullanıcı sekmeyi kapattıktan sonra da korunur.
Tarayıcı uygulamayı bir sonraki yükleyişinde, service worker önce yüklenir ve uygulamayı yüklemek için kaynaklara yönelik her isteği yakalayabilir.
Service worker bunu yapacak şekilde tasarlanmışsa, _ağa ihtiyaç duymadan uygulamanın yüklenmesini tamamen karşılayabilir_.

Hızlı ve güvenilir bir ağda bile, gidiş-dönüş gecikmeleri uygulamayı yüklerken önemli gecikme süreleri oluşturabilir.
Ağa bağımlılığı azaltmak için bir service worker kullanmak, kullanıcı deneyimini önemli ölçüde iyileştirebilir.

## Angular'da service worker'lar

Angular uygulamaları, tek sayfa uygulamaları olarak, service worker'ların avantajlarından yararlanmak için birinci sınıf bir konumdadır. Angular, bir service worker uygulamasıyla birlikte gelir. Angular geliştiricileri bu service worker'dan yararlanabilir ve düşük seviyeli API'lere karşı kod yazmaya gerek kalmadan sağladığı artırılmış güvenilirlik ve performanstan faydalanabilir.

Angular'ın service worker'ı, yavaş veya güvenilmez ağ bağlantısı üzerinden bir uygulamayı kullanan son kullanıcı deneyimini optimize etmek ve aynı zamanda eski içerik sunma risklerini en aza indirmek için tasarlanmıştır.

Bunu başarmak için Angular service worker şu ilkeleri takip eder:

- Bir uygulamayı önbelleğe almak, yerel bir uygulama yüklemek gibidir.
  Uygulama tek bir birim olarak önbelleğe alınır ve tüm dosyalar birlikte güncellenir.

- Çalışan bir uygulama, tüm dosyaların aynı sürümüyle çalışmaya devam eder.
  Uyumsuz olması muhtemel daha yeni bir sürümden önbelleğe alınmış dosyaları aniden almaya başlamaz.

- Kullanıcılar uygulamayı yenilediğinde, en son tam olarak önbelleğe alınmış sürümü görür.
  Yeni sekmeler en son önbelleğe alınmış kodu yükler.

- Güncellemeler arka planda, değişiklikler yayınlandıktan sonra nispeten hızlı bir şekilde gerçekleşir.
  Bir güncelleme yüklenip hazır olana kadar uygulamanın önceki sürümü sunulur.

- Service worker mümkün olduğunda bant genişliğini korur.
  Kaynaklar yalnızca değiştiyse indirilir.

Bu davranışları desteklemek için Angular service worker sunucudan bir _manifest_ dosyası yükler.
`ngsw.json` adlı dosya ([web app manifest](https://developer.mozilla.org/docs/Web/Manifest) ile karıştırılmamalıdır), önbelleğe alınacak kaynakları açıklar ve her dosyanın içeriğinin hash'lerini içerir.
Uygulamaya bir güncelleme dağıtıldığında, manifestin içeriği değişir ve service worker'a uygulamanın yeni bir sürümünün indirilip önbelleğe alınması gerektiğini bildirir.
Bu manifest, `ngsw-config.json` adlı CLI tarafından oluşturulan bir yapılandırma dosyasından üretilir.

Angular service worker'ı yüklemek, [bir Angular CLI komutu çalıştırmak](ecosystem/service-workers/getting-started#projenize-service-worker-ekleme) kadar basittir.
Tarayıcıya Angular service worker'ı kaydetmenin yanı sıra, bu işlem aynı zamanda service worker ile etkileşime giren ve onu kontrol etmek için kullanılabilecek birkaç servisi enjeksiyon için kullanılabilir hale getirir.
Örneğin, bir uygulama yeni bir güncelleme mevcut olduğunda bildirilmeyi isteyebilir veya uygulama, service worker'dan sunucuda mevcut güncellemeleri kontrol etmesini isteyebilir.

## Başlamadan önce

Angular service worker'larının tüm özelliklerinden yararlanmak için Angular ve [Angular CLI](tools/cli)'nin en son sürümlerini kullanın.

Service worker'ların kaydedilebilmesi için uygulamaya HTTP değil, HTTPS üzerinden erişilmesi gerekir.
Tarayıcılar, güvenli olmayan bir bağlantı üzerinden sunulan sayfalardaki service worker'ları yok sayar.
Bunun nedeni, service worker'ların oldukça güçlü olması ve service worker betiğinin değiştirilmediğinden emin olmak için ekstra özen gösterilmesinin gerekmesidir.

Bu kuralın bir istisnası vardır: yerel geliştirmeyi daha basit hale getirmek için tarayıcılar, `localhost` üzerinden bir uygulamaya erişirken güvenli bağlantı _gerektirmez_.

### Tarayıcı desteği

Angular service worker'ından yararlanmak için uygulamanızın genel olarak service worker'ları destekleyen bir web tarayıcısında çalışması gerekir.
Şu anda service worker'lar Chrome, Firefox, Edge, Safari, Opera, UC Browser (Android sürümü) ve Samsung Internet'in en son sürümlerinde desteklenmektedir.
IE ve Opera Mini gibi tarayıcılar service worker'ları desteklememektedir.

Kullanıcı, service worker'ları desteklemeyen bir tarayıcıyla uygulamanıza erişiyorsa, service worker kaydedilmez ve çevrimdışı önbellek yönetimi ve push bildirimleri gibi ilgili davranışlar gerçekleşmez.
Daha spesifik olarak:

- Tarayıcı, service worker betiğini ve `ngsw.json` manifest dosyasını indirmez
- `SwUpdate.checkForUpdate()` çağırma gibi service worker ile etkileşim için yapılan aktif girişimler, reddedilen promise'ler döndürür
- `SwUpdate.available` gibi ilgili servislerin observable olayları tetiklenmez

Uygulamanızın tarayıcıda service worker desteği olmadan bile çalıştığından emin olmanız şiddetle tavsiye edilir.
Desteklenmeyen bir tarayıcı service worker önbelleklemesini yok saysa da, uygulama service worker ile etkileşim kurmaya çalışırsa hata raporlar.
Örneğin, `SwUpdate.checkForUpdate()` çağrısı reddedilen promise'ler döndürür.
Böyle bir hatadan kaçınmak için `SwUpdate.isEnabled` kullanarak Angular service worker'ının etkin olup olmadığını kontrol edin.

Service worker'a hazır diğer tarayıcılar hakkında daha fazla bilgi edinmek için [Can I Use](https://caniuse.com/#feat=serviceworkers) sayfasına ve [MDN belgelerine](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) bakın.

## İlgili kaynaklar

Bu bölümdeki diğer makaleler, service worker'ların Angular uygulamasını özellikle ele alır.

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="Configuration file"/>
  <docs-pill href="ecosystem/service-workers/communications" title="Communicating with the Service Worker"/>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Push notifications"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
  <docs-pill href="ecosystem/service-workers/app-shell" title="App shell pattern"/>
</docs-pill-row>

Genel olarak service worker'lar hakkında daha fazla bilgi için [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers) sayfasına bakın.

Tarayıcı desteği hakkında daha fazla bilgi için [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers) sayfasının [browser support](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support) bölümüne, Jake Archibald'ın [Is Serviceworker ready?](https://jakearchibald.github.io/isserviceworkerready) sayfasına ve [Can I Use](https://caniuse.com/serviceworkers) sayfasına bakın.

Ek öneriler ve örnekler için bakınız:

<docs-pill-row>
  <docs-pill href="https://web.dev/precaching-with-the-angular-service-worker" title="Precaching with Angular Service Worker"/>
  <docs-pill href="https://web.dev/creating-pwa-with-angular-cli" title="Creating a PWA with Angular CLI"/>
</docs-pill-row>

## Sonraki adım

Angular service worker'larını kullanmaya başlamak için [Service worker'lara başlarken](ecosystem/service-workers/getting-started) bölümüne bakın.
