# Service worker'lara başlarken

Bu belge, [Angular CLI](tools/cli) ile oluşturduğunuz projelerde Angular service worker desteğini nasıl etkinleştireceğinizi açıklamaktadır. Ardından, bir service worker'ı çalışırken göstermek, yükleme ve temel önbellekleme işlemlerini göstermek için bir örnek kullanır.

## Projenize service worker ekleme

Projenizde Angular service worker'ı kurmak için aşağıdaki CLI komutunu çalıştırın:

```shell

ng add @angular/pwa

```

CLI, uygulamanızı aşağıdaki işlemlerle service worker'ları kullanacak şekilde yapılandırır:

1. Projenize `@angular/service-worker` paketini ekler.
1. CLI'da service worker derleme desteğini etkinleştirir.
1. Service worker'ı uygulamanın kök sağlayıcılarına içe aktarır ve kaydeder.
1. `index.html` dosyasını günceller:
   - `manifest.webmanifest` dosyasını eklemek için bir bağlantı ekler
   - `theme-color` için bir meta etiketi ekler
1. Yüklü Progressive Web App'i (PWA) desteklemek için simge dosyalarını yükler.
1. Önbellekleme davranışlarını ve diğer ayarları belirten [`ngsw-config.json`](ecosystem/service-workers/config) adlı service worker yapılandırma dosyasını oluşturur.

Şimdi projeyi derleyin:

```shell

ng build

```

CLI projesi artık Angular service worker'ı kullanmak üzere ayarlanmıştır.

## Service worker çalışırken: bir tur

Bu bölüm, bir örnek uygulama kullanarak bir service worker'ı çalışırken gösterir. Yerel geliştirme sırasında service worker desteğini etkinleştirmek için aşağıdaki komutla üretim yapılandırmasını kullanın:

```shell

ng serve --configuration=production

```

Alternatif olarak, service worker uygulamalarını destekleyen npm'den [`http-server paketi`](https://www.npmjs.com/package/http-server) kullanabilirsiniz. Yükleme yapmadan şu şekilde çalıştırın:

```shell

npx http-server -p 8080 -c-1 dist/<project-name>/browser

```

Bu, uygulamanızı http://localhost:8080 adresinde service worker desteğiyle sunacaktır.

### İlk yükleme

Sunucu `8080` portunda çalışırken, tarayıcınızı `http://localhost:8080` adresine yönlendirin.
Uygulamanız normal şekilde yüklenmelidir.

TIP: Angular service worker'larını test ederken, service worker'ın önceki kalan bir durumdan okumadığından emin olmak için tarayıcınızda gizli veya özel pencere kullanmak iyi bir fikirdir; bu, beklenmeyen davranışlara neden olabilir.

HELPFUL: HTTPS kullanmıyorsanız, service worker yalnızca uygulamaya `localhost` üzerinden erişildiğinde kaydedilecektir.

### Ağ sorununu simüle etme

Bir ağ sorununu simüle etmek için uygulamanız için ağ etkileşimini devre dışı bırakın.

Chrome'da:

1. **Araçlar** > **Geliştirici Araçları**'nı seçin (sağ üst köşedeki Chrome menüsünden).
1. **Network sekmesine** gidin.
1. **Throttling** açılır menüsünde **Offline**'ı seçin.

<img alt="The offline option in the Network tab is selected" src="assets/images/guide/service-worker/offline-option.png">

Artık uygulamanın ağ etkileşimine erişimi yoktur.

Angular service worker'ı kullanmayan uygulamalar için şimdi yenilemek, "İnternet bağlantısı yok" yazan Chrome'un İnternet bağlantısı kesildi sayfasını gösterir.

Angular service worker'ının eklenmesiyle uygulama davranışı değişir.
Yenilemede sayfa normal şekilde yüklenir.

Service worker'ın aktif olduğunu doğrulamak için Network sekmesine bakın.

<img alt="Requests are marked as from ServiceWorker" src="assets/images/guide/service-worker/sw-active.png">

HELPFUL: "Size" sütununun altında, istek durumu `(ServiceWorker)` olarak gösterilir.
Bu, kaynakların ağdan yüklenmediği anlamına gelir.
Bunun yerine, service worker'ın önbelleğinden yüklenmektedir.

### Neler önbelleğe alınıyor?

Tarayıcının bu uygulamayı oluşturmak için ihtiyaç duyduğu tüm dosyaların önbelleğe alındığına dikkat edin.
`ngsw-config.json` şablon yapılandırması, CLI tarafından kullanılan belirli kaynakları önbelleğe alacak şekilde ayarlanmıştır:

- `index.html`
- `favicon.ico`
- Derleme çıktıları (JS ve CSS paketleri)
- `assets` altındaki her şey
- Yapılandırılmış `outputPath` (varsayılan olarak `./dist/<project-name>/`) veya `resourcesOutputPath` altındaki doğrudan resimler ve yazı tipleri.
  Bu seçenekler hakkında daha fazla bilgi için `ng build` belgelerine bakın.

IMPORTANT: Oluşturulan `ngsw-config.json`, önbelleğe alınabilir yazı tipi ve resim uzantılarının sınırlı bir listesini içerir. Bazı durumlarda, glob desenini ihtiyaçlarınıza uyacak şekilde değiştirmek isteyebilirsiniz.

IMPORTANT: Yapılandırma dosyası oluşturulduktan sonra `resourcesOutputPath` veya `assets` yolları değiştirilirse, `ngsw-config.json` içindeki yolları manuel olarak değiştirmeniz gerekir.

### Uygulamanızda değişiklik yapma

Artık service worker'ların uygulamanızı nasıl önbelleğe aldığını gördüğünüze göre, bir sonraki adım güncellemelerin nasıl çalıştığını anlamaktır.
Uygulamada bir değişiklik yapın ve service worker'ın güncellemeyi yüklediğini izleyin:

1. Gizli pencerede test ediyorsanız, ikinci bir boş sekme açın.
   Bu, testiniz sırasında gizli pencere ve önbellek durumunu canlı tutar.

1. Uygulama sekmesini kapatın, ancak pencereyi kapatmayın.
   Bu, Geliştirici Araçlarını da kapatmalıdır.

1. `http-server`'ı kapatın (Ctrl-c).
1. `src/app/app.component.html` dosyasını düzenlemek için açın.
1. `Welcome to {{title}}!` metnini `Bienvenue à {{title}}!` olarak değiştirin.
1. Sunucuyu yeniden derleyin ve çalıştırın:

```shell
    ng build
    npx http-server -p 8080 -c-1 dist/<project-name>/browser
```

### Uygulamanızı tarayıcıda güncelleme

Şimdi tarayıcının ve service worker'ın güncellenmiş uygulamayı nasıl işlediğine bakın.

1. Aynı pencerede [http://localhost:8080](http://localhost:8080) adresini tekrar açın.
   Ne olur?

   <img alt="It still says Welcome to Service Workers!" src="assets/images/guide/service-worker/welcome-msg-en.png">

   Ne yanlış gitti?
   _Aslında hiçbir şey!_
   Angular service worker işini yapıyor ve bir güncelleme mevcut olsa bile **yüklediği** uygulamanın sürümünü sunuyor.
   Hız açısından, service worker önbelleğe aldığı uygulamayı sunmadan önce güncellemeleri kontrol etmeyi beklemez.

   Service worker'ın `/ngsw.json` istediğini görmek için `http-server` günlüklerine bakın.

   ```text
   [2023-09-07T00:37:24.372Z]  "GET /ngsw.json?ngsw-cache-bust=0.9365263935102124" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
   ```

   Service worker güncellemeleri bu şekilde kontrol eder.

1. Sayfayı yenileyin.

   <img alt="The text has changed to say Bienvenue à app!" src="assets/images/guide/service-worker/welcome-msg-fr.png">

   Service worker, uygulamanızın güncellenmiş sürümünü _arka planda_ yükledi ve sayfa bir sonraki yüklendiğinde veya yenilendiğinde, service worker en son sürüme geçer.

## Service worker yapılandırması

Angular service worker'ları, `SwRegistrationOptions` arayüzü aracılığıyla kapsamlı yapılandırma seçeneklerini destekler ve kayıt davranışı, önbellekleme ve betik yürütme üzerinde ayrıntılı kontrol sağlar.

### Service worker'ları etkinleştirme ve devre dışı bırakma

`enabled` seçeneği, service worker'ın kaydedilip kaydedilmeyeceğini ve ilgili servislerin onunla iletişim kurmaya çalışıp çalışmayacağını kontrol eder.

```ts
import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideServiceWorker} from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(), // Geliştirmede devre dışı, üretimde etkin
    }),
  ],
};
```

### updateViaCache ile önbellek kontrolü

`updateViaCache` seçeneği, service worker güncellemeleri sırasında tarayıcının HTTP önbelleğine nasıl başvuracağını kontrol eder. Bu, tarayıcının güncellenmiş service worker betiklerini ve içe aktarılan modülleri ne zaman alacağı üzerinde ayrıntılı kontrol sağlar.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      updateViaCache: 'imports',
    }),
  ],
};
```

`updateViaCache` seçeneği aşağıdaki değerleri kabul eder:

- **`'imports'`** - HTTP önbelleği, service worker betiğinin içe aktarılan betikleri için sorgulanır, ancak service worker betiğinin kendisi için sorgulanmaz
- **`'all'`** - HTTP önbelleği, hem service worker betiği hem de içe aktarılan betikleri için sorgulanır
- **`'none'`** - HTTP önbelleği, service worker betiği veya içe aktarılan betikleri için sorgulanmaz

### type seçeneği ile ES Module desteği

`type` seçeneği, service worker'ları kaydederken betik türünü belirtmeyi etkinleştirerek, service worker betiklerinizde ES modül özelliklerine destek sağlar.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      type: 'module', // ES modül özelliklerini etkinleştir
    }),
  ],
};
```

`type` seçeneği aşağıdaki değerleri kabul eder:

- **`'classic'`** (varsayılan) - Geleneksel service worker betik yürütme. `import` ve `export` gibi ES modül özellikleri betikte kullanılmasına İZİN VERİLMEZ
- **`'module'`** - Betiği bir ES modülü olarak kaydeder. `import`/`export` sözdizimi ve modül özelliklerinin kullanımına izin verir

### Kayıt kapsamı kontrolü

`scope` seçeneği, service worker'ın kayıt kapsamını tanımlayarak, hangi URL aralığını kontrol edebileceğini belirler.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      scope: '/app/', // Service worker yalnızca /app/ altındaki URL'leri kontrol edecektir
    }),
  ],
};
```

- Service worker'ın hangi URL'leri yakalayıp yönetebileceğini kontrol eder
- Varsayılan olarak kapsam, service worker betiğini içeren dizindir
- `ServiceWorkerContainer.register()` çağrılırken kullanılır

### Kayıt stratejisi yapılandırması

`registrationStrategy` seçeneği, service worker'ın tarayıcıya ne zaman kaydedileceğini tanımlayarak, kayıt zamanlaması üzerinde kontrol sağlar.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
```

Mevcut kayıt stratejileri:

- **`'registerWhenStable:timeout'`** (varsayılan: `'registerWhenStable:30000'`) - Uygulama kararlı hale gelir gelmez (bekleyen mikro/makro görev kalmadığında) ancak belirtilen milisaniye cinsinden zaman aşımından geç olmamak üzere kaydeder
- **`'registerImmediately'`** - Service worker'ı hemen kaydeder
- **`'registerWithDelay:timeout'`** - Belirtilen milisaniye cinsinden bir gecikmeyle kaydeder

```ts
// Hemen kaydet
export const immediateConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
  ],
};

// 5 saniyelik gecikme ile kaydet
export const delayedConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWithDelay:5000',
    }),
  ],
};
```

Özel kayıt zamanlaması için bir Observable fabrika fonksiyonu da sağlayabilirsiniz:

```ts
import {timer} from 'rxjs';

export const customConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: () => timer(10_000), // 10 saniye sonra kaydet
    }),
  ],
};
```

## Angular service worker'lar hakkında daha fazlası

Aşağıdakiler de ilginizi çekebilir:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="Configuration file"/>
  <docs-pill href="ecosystem/service-workers/communications" title="Communicating with the Service Worker"/>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Push notifications"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
  <docs-pill href="ecosystem/service-workers/app-shell" title="App shell pattern"/>
</docs-pill-row>
