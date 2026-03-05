# Custom service worker scripts

Angular service worker mükemmel yetenekler sunsa da, push bildirimlerini işleme, arka plan senkronizasyonu veya diğer service worker olayları gibi özel işlevsellik eklemeniz gerekebilir. Angular service worker'ı içe aktaran ve genişleten özel bir service worker betiği oluşturabilirsiniz.

## Creating a custom service worker

Angular'ın işlevselliğini genişleten özel bir service worker oluşturmak için:

1. `src` dizininizde özel bir service worker dosyası (örneğin `custom-sw.js`) oluşturun:

```js
// Import the Angular service worker
importScripts('./ngsw-worker.js');

(function () {
  'use strict';

  // Add custom notification click handler
  self.addEventListener('notificationclick', (event) => {
    console.log('Custom notification click handler');
    console.log('Notification details:', event.notification);

    // Handle notification click - open URL if provided
    if (clients.openWindow && event.notification.data.url) {
      event.waitUntil(clients.openWindow(event.notification.data.url));
      console.log('Opening URL:', event.notification.data.url);
    }
  });

  // Add custom background sync handler
  self.addEventListener('sync', (event) => {
    console.log('Custom background sync handler');

    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync());
    }
  });

  function doBackgroundSync() {
    // Implement your background sync logic here
    return fetch('https://example.com/api/sync')
      .then((response) => response.json())
      .then((data) => console.log('Background sync completed:', data))
      .catch((error) => console.error('Background sync failed:', error));
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

### Best practices for custom service workers

Angular service worker'ı genişletirken:

- Tüm önbellekleme ve güncelleme işlevselliğini aldığınızdan emin olmak için `importScripts('./ngsw-worker.js')` kullanarak **her zaman önce Angular service worker'ını içe aktarın**
- Global kapsamı kirletmemek için **özel kodunuzu bir IIFE** (Hemen Çağrılan Fonksiyon İfadesi) içine sarın
- Service worker sonlandırılmadan önce asenkron işlemlerin tamamlanmasını sağlamak için **`event.waitUntil()` kullanın**
- Hem geliştirme hem de üretim ortamlarında **kapsamlı bir şekilde test edin**
- Özel kodunuzun Angular service worker işlevselliğini bozmasını önlemek için **hataları zarif bir şekilde işleyin**

### Common use cases

Özel service worker'lar yaygın olarak şunlar için kullanılır:

- **Push bildirimleri**: Gelen push mesajlarını işleme ve bildirimleri gösterme
- **Arka plan senkronizasyonu**: Ağ bağlantısı yeniden kurulduğunda verileri senkronize etme
- **Özel navigasyon**: Özel yönlendirme veya çevrimdışı sayfa senaryolarını işleme
