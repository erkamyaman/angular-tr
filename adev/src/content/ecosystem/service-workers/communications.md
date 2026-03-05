# Communicating with the Service Worker

Service worker desteğini etkinleştirmek, yalnızca service worker'ı kaydetmekten fazlasını yapar; aynı zamanda service worker ile etkileşim kurmak ve uygulamanızın önbelleklemesini kontrol etmek için kullanabileceğiniz servisler sağlar.

## `SwUpdate` service

`SwUpdate` servisi, service worker'ın uygulamanız için mevcut bir güncelleme keşfettiğini ve yüklediğini belirten olaylara erişmenizi sağlar.

`SwUpdate` servisi üç ayrı işlemi destekler:

- Güncellenmiş bir sürümün sunucuda _tespit edildiğinde_, _yüklenip yerel olarak kullanıma hazır olduğunda_ veya bir _yükleme başarısız olduğunda_ bildirim alma.
- Service worker'dan sunucuda yeni güncellemeler olup olmadığını kontrol etmesini isteme.
- Service worker'dan mevcut sekme için uygulamanın en son sürümünü etkinleştirmesini isteme.

### Version updates

`versionUpdates`, `SwUpdate`'in bir `Observable` özelliğidir ve beş olay türü yayar:

| Olay türleri                     | Ayrıntılar                                                                                                                                                                                                    |
| :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VersionDetectedEvent`           | Service worker, sunucuda uygulamanın yeni bir sürümünü tespit ettiğinde ve indirmeye başlamak üzere olduğunda yayılır.                                                                                        |
| `NoNewVersionDetectedEvent`      | Service worker, sunucudaki uygulama sürümünü kontrol ettiğinde ve yeni bir sürüm bulamadığında yayılır.                                                                                                       |
| `VersionReadyEvent`              | Uygulamanın yeni bir sürümü istemciler tarafından etkinleştirilmeye hazır olduğunda yayılır. Kullanıcıyı mevcut bir güncelleme hakkında bilgilendirmek veya sayfayı yenilemesini istemek için kullanılabilir. |
| `VersionInstallationFailedEvent` | Yeni bir sürümün yüklemesi başarısız olduğunda yayılır. Günlükleme/izleme amaçlarıyla kullanılabilir.                                                                                                         |
| `VersionFailedEvent`             | Bir sürüm, o sürümü kullanan tüm istemcileri etkileyen kritik bir hatayla (bozuk hash hataları gibi) karşılaştığında yayılır. Hata ayıklama ve şeffaflık için hata ayrıntıları sağlar.                        |

<docs-code header="log-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/log-update.service.ts" region="sw-update"/>

### Checking for updates

Service worker'dan sunucuya herhangi bir güncelleme dağıtılıp dağıtılmadığını kontrol etmesini istemek mümkündür.
Service worker, başlatma sırasında ve her navigasyon isteğinde — yani kullanıcı farklı bir adresten uygulamanıza gittiğinde — güncellemeleri kontrol eder.
Ancak, sık sık değişen bir siteniz varsa veya güncellemelerin bir programa göre yapılmasını istiyorsanız, güncellemeleri manuel olarak kontrol etmeyi seçebilirsiniz.

Bunu `checkForUpdate()` metoduyla yapın:

<docs-code header="check-for-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/check-for-update.service.ts"/>

Bu metot, etkinleştirme için bir güncellemenin mevcut olup olmadığını belirten bir `Promise<boolean>` döndürür.
Kontrol başarısız olabilir ve bu durumda `Promise` reddedilir.

<docs-callout important title="Stabilization and service worker registration">
Sayfanın ilk oluşturulmasını olumsuz etkilememek için, varsayılan olarak Angular service worker servisi, ServiceWorker betiğini kaydetmeden önce uygulamanın kararlı hale gelmesi için 30 saniyeye kadar bekler.

Güncellemeler için sürekli yoklama yapmak, örneğin [setInterval()](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) veya RxJS'in [interval()](https://rxjs.dev/api/index/function/interval) fonksiyonu ile, uygulamanın kararlı hale gelmesini engeller ve ServiceWorker betiği 30 saniyelik üst sınıra ulaşılana kadar tarayıcıya kaydedilmez.

Bu, uygulamanız tarafından yapılan her türlü yoklama için geçerlidir.
Daha fazla bilgi için [isStable](api/core/ApplicationRef#isStable) belgelerine bakın.

Bu gecikmeden kaçınmak için, önceki örnekte gösterildiği gibi, güncelleme yoklamasına başlamadan önce uygulamanın kararlı hale gelmesini bekleyin.
Alternatif olarak, ServiceWorker için farklı bir [kayıt stratejisi](api/service-worker/SwRegistrationOptions#registrationStrategy) tanımlamak isteyebilirsiniz.
</docs-callout>

### Updating to the latest version

Mevcut bir sekmeyi, yeni bir sürüm hazır olur olmaz sayfayı yenileyerek en son sürüme güncelleyebilirsiniz.
Kullanıcının ilerlemesini kesintiye uğratmamak için, genellikle kullanıcıya sormak ve sayfayı yenileyip en son sürüme güncellemenin uygun olduğunu onaylamasını sağlamak iyi bir fikirdir:

<docs-code header="prompt-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/prompt-update.service.ts" region="sw-version-ready"/>

<docs-callout important title="Safety of updating without reloading">
`activateUpdate()` çağrısı, bir sekmeyi sayfayı yeniden yüklemeden en son sürüme günceller, ancak bu uygulamayı bozabilir.

Yeniden yüklemeden güncelleme, uygulama kabuğu ile tembel yüklenen parçalar gibi diğer sayfa kaynakları arasında bir sürüm uyumsuzluğu yaratabilir; bu dosyaların isimleri sürümler arasında değişebilir.

`activateUpdate()`'i yalnızca belirli kullanım durumunuz için güvenli olduğundan eminseniz kullanmalısınız.
</docs-callout>

### Handling an unrecoverable state

Bazı durumlarda, service worker'ın bir istemciye hizmet vermek için kullandığı uygulamanın sürümü, tam bir sayfa yeniden yüklemesi olmadan kurtarılamayan bozuk bir durumda olabilir.

Örneğin, aşağıdaki senaryoyu düşünün:

1. Bir kullanıcı uygulamayı ilk kez açar ve service worker uygulamanın en son sürümünü önbelleğe alır.
   Uygulamanın önbelleğe alınmış varlıklarının `index.html`, `main.<main-hash-1>.js` ve `lazy-chunk.<lazy-hash-1>.js` içerdiğini varsayın.

1. Kullanıcı uygulamayı kapatır ve bir süre açmaz.
1. Bir süre sonra uygulamanın yeni bir sürümü sunucuya dağıtılır.
   Bu daha yeni sürüm `index.html`, `main.<main-hash-2>.js` ve `lazy-chunk.<lazy-hash-2>.js` dosyalarını içerir.

IMPORTANT: Dosyaların içeriği değiştiği için hash'ler artık farklıdır. Eski sürüm artık sunucuda mevcut değildir.

1. Bu arada kullanıcının tarayıcısı `lazy-chunk.<lazy-hash-1>.js` dosyasını önbelleğinden çıkarmaya karar verir.
   Tarayıcılar disk alanı geri kazanmak için belirli (veya tüm) kaynakları önbellekten çıkarmaya karar verebilir.

1. Kullanıcı uygulamayı tekrar açar.
   Service worker, bu noktada bildiği en son sürümü, yani eski sürümü (`index.html` ve `main.<main-hash-1>.js`) sunar.

1. Daha sonraki bir noktada uygulama tembel paketi `lazy-chunk.<lazy-hash-1>.js`'yi ister.
1. Service worker, varlığı önbellekte bulamaz (tarayıcının onu çıkardığını unutmayın).
   Sunucudan da alamaz (çünkü sunucuda artık yalnızca daha yeni sürümdeki `lazy-chunk.<lazy-hash-2>.js` vardır).

Önceki senaryoda, service worker normalde önbelleğe alınacak bir varlığı sunamaz.
Bu belirli uygulama sürümü bozuktur ve istemcinin durumunu sayfayı yeniden yüklemeden düzeltmenin bir yolu yoktur.
Bu gibi durumlarda service worker, istemciyi bir `UnrecoverableStateEvent` olayı göndererek bilgilendirir.
Bu hataları bildirim almak ve işlemek için `SwUpdate#unrecoverable`'a abone olun.

<docs-code header="handle-unrecoverable-state.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/handle-unrecoverable-state.service.ts" region="sw-unrecoverable-state"/>

## More on Angular service workers

Aşağıdakiler de ilginizi çekebilir:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Push notifications"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
</docs-pill-row>
