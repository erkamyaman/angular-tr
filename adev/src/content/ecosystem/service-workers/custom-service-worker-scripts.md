# Özel service worker betikleri

Angular service worker mükemmel yetenekler sunsa da, push bildirimlerini işleme, arka plan senkronizasyonu veya diğer service worker olayları gibi özel işlevsellik eklemeniz gerekebilir. Angular service worker'ı içe aktaran ve genişleten özel bir service worker betiği oluşturabilirsiniz.

## Özel bir service worker oluşturma

Angular'ın işlevselliğini genişleten özel bir service worker oluşturmak için:

1. `src` dizininizde özel bir service worker dosyası (örneğin `custom-sw.js`) oluşturun:

```js
// Angular service worker'ını içe aktar
importScripts('./ngsw-worker.js');

(function () {
  'use strict';

  // Özel bildirim tıklama işleyicisi ekle
  self.addEventListener('notificationclick', (event) => {
    console.log('Özel bildirim tıklama işleyicisi');
    console.log('Bildirim ayrıntıları:', event.notification);

    // Bildirim tıklamasını işle - URL sağlanmışsa aç
    if (clients.openWindow && event.notification.data.url) {
      event.waitUntil(clients.openWindow(event.notification.data.url));
      console.log('URL açılıyor:', event.notification.data.url);
    }
  });

  // Özel arka plan senkronizasyonu işleyicisi ekle
  self.addEventListener('sync', (event) => {
    console.log('Özel arka plan senkronizasyonu işleyicisi');

    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync());
    }
  });

  function doBackgroundSync() {
    // Arka plan senkronizasyonu mantığınızı burada uygulayın
    return fetch('https://example.com/api/sync')
      .then((response) => response.json())
      .then((data) => console.log('Arka plan senkronizasyonu tamamlandı:', data))
      .catch((error) => console.error('Arka plan senkronizasyonu başarısız:', error));
  }
})();
```

2. Özel service worker'ı kullanmak için `angular.json` dosyanızı güncelleyin:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              },
              "app/src/custom-sw.js"
            ]
          }
        }
      }
    }
  }
}
```

3. Service worker kaydını özel betiğinizi kullanacak şekilde yapılandırın:

```ts
import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideServiceWorker} from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('custom-sw.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
```

### Özel service worker'lar için en iyi uygulamalar

Angular service worker'ı genişletirken:

- Tüm önbellekleme ve güncelleme işlevselliğini aldığınızdan emin olmak için `importScripts('./ngsw-worker.js')` kullanarak **her zaman önce Angular service worker'ını içe aktarın**
- Global kapsamı kirletmemek için **özel kodunuzu bir IIFE** (Hemen Çağrılan Fonksiyon İfadesi) içine sarın
- Service worker sonlandırılmadan önce asenkron işlemlerin tamamlanmasını sağlamak için **`event.waitUntil()` kullanın**
- Hem geliştirme hem de üretim ortamlarında **kapsamlı bir şekilde test edin**
- Özel kodunuzun Angular service worker işlevselliğini bozmasını önlemek için **hataları zarif bir şekilde işleyin**

### Yaygın kullanım senaryoları

Özel service worker'lar yaygın olarak şunlar için kullanılır:

- **Push bildirimleri**: Gelen push mesajlarını işleme ve bildirimleri gösterme
- **Arka plan senkronizasyonu**: Ağ bağlantısı yeniden kurulduğunda verileri senkronize etme
- **Özel navigasyon**: Özel yönlendirme veya çevrimdışı sayfa senaryolarını işleme
