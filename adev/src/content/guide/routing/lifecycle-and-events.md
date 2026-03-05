# Router Lifecycle and Events

Angular Router, navigasyon değişikliklerine yanıt vermenize ve yönlendirme süreci sırasında özel mantık çalıştırmanıza olanak tanıyan kapsamlı bir yaşam döngüsü kancaları ve olaylar seti sağlar.

## Common router events

Angular Router, navigasyon yaşam döngüsünü izlemek için abone olabileceğiniz navigasyon olayları yayınlar. Bu olaylar `Router.events` observable'ı aracılığıyla kullanılabilir. Bu bölüm, navigasyon ve hata izleme için yaygın yönlendirme yaşam döngüsü olaylarını (kronolojik sırayla) kapsar.

| Olaylar                                             | Açıklama                                                                                                                |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)     | Navigasyon başladığında gerçekleşir ve istenen URL'yi içerir.                                                           |
| [`RoutesRecognized`](api/router/RoutesRecognized)   | Yönlendirici hangi rotanın URL ile eşleştiğini belirledikten sonra gerçekleşir ve rota durum bilgisini içerir.          |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)   | Rota koruyucu aşamasını başlatır. Yönlendirici `canActivate` ve `canDeactivate` gibi rota koruyucularını değerlendirir. |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)       | Koruyucu değerlendirmesinin tamamlandığını bildirir. Sonucu (izin verildi/reddedildi) içerir.                           |
| [`ResolveStart`](api/router/ResolveStart)           | Veri çözümleme aşamasını başlatır. Rota çözücüleri veri çekmeye başlar.                                                 |
| [`ResolveEnd`](api/router/ResolveEnd)               | Veri çözümleme tamamlanır. Tüm gerekli veriler kullanılabilir hale gelir.                                               |
| [`NavigationEnd`](api/router/NavigationEnd)         | Navigasyon başarıyla tamamlandığında son olay. Yönlendirici URL'yi günceller.                                           |
| [`NavigationSkipped`](api/router/NavigationSkipped) | Yönlendirici navigasyonu atladığında gerçekleşir (örn. aynı URL navigasyonu).                                           |

Yaygın hata olayları şunlardır:

| Olay                                              | Açıklama                                                                                                           |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [`NavigationCancel`](api/router/NavigationCancel) | Yönlendirici navigasyonu iptal ettiğinde gerçekleşir. Genellikle bir koruyucunun false döndürmesinden kaynaklanır. |
| [`NavigationError`](api/router/NavigationError)   | Navigasyon başarısız olduğunda gerçekleşir. Geçersiz rotalar veya çözücü hatalarından kaynaklanabilir.             |

Tüm yaşam döngüsü olaylarının listesi için [bu kılavuzun tam tablosuna](#all-router-events) göz atın.

## How to subscribe to router events

Belirli navigasyon yaşam döngüsü olayları sırasında kod çalıştırmak istediğinizde, `router.events`'e abone olarak ve olayın örneğini kontrol ederek bunu yapabilirsiniz:

```ts
// Example of subscribing to router events
import {Component, inject, signal, effect} from '@angular/core';
import {Event, Router, NavigationStart, NavigationEnd} from '@angular/router';

@Component({
  /*...*/
})
export class RouterEvents {
  private readonly router = inject(Router);

  constructor() {
    // Subscribe to router events and react to events
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Navigation starting
        console.log('Navigation starting:', event.url);
      }
      if (event instanceof NavigationEnd) {
        // Navigation completed
        console.log('Navigation completed:', event.url);
      }
    });
  }
}
```

NOTE: `@angular/router`'dan gelen [`Event`](api/router/Event) türü, normal global [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) türü ile aynı ada sahiptir, ancak [`RouterEvent`](api/router/RouterEvent) türünden farklıdır.

## How to debug routing events

Yönlendirici navigasyon sorunlarını olay dizisi hakkında görünürlük olmadan hata ayıklamak zor olabilir. Angular, tüm yönlendirici olaylarını konsola kaydeden yerleşik bir hata ayıklama özelliği sağlar ve navigasyon akışını anlamanıza ve sorunların nerede oluştuğunu belirlemenize yardımcı olur.

Bir Yönlendirici olay dizisini incelemeniz gerektiğinde, dahili navigasyon olayları için günlüğü etkinleştirebilirsiniz. Bunu, tüm yönlendirme olaylarının ayrıntılı konsol günlüğünü etkinleştiren bir yapılandırma seçeneği (`withDebugTracing()`) geçirerek yapılandırabilirsiniz.

```ts
import {provideRouter, withDebugTracing} from '@angular/router';

const appRoutes: Routes = [];
bootstrapApplication(App, {
  providers: [provideRouter(appRoutes, withDebugTracing())],
});
```

Daha fazla bilgi için [`withDebugTracing`](api/router/withDebugTracing) resmi dokümanlarına göz atın.

## Common use cases

Router olayları, gerçek dünya uygulamalarında birçok pratik özelliği mümkün kılar. Router olaylarıyla kullanılan bazı yaygın kalıplar şunlardır.

### Loading indicators

Navigasyon sırasında yükleme göstergeleri gösterme:

```angular-ts
import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    @if (isNavigating()) {
      <div class="loading-bar">Loading...</div>
    }
    <router-outlet />
  `,
})
export class App {
  private router = inject(Router);
  isNavigating = computed(() => !!this.router.currentNavigation());
}
```

### Analytics tracking

Analitik için sayfa görüntülemelerini izleme:

```ts
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {inject, Injectable, DestroyRef} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AnalyticsService {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  startTracking() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      // Track page views when URL changes
      if (event instanceof NavigationEnd) {
        // Send page view to analytics
        this.analytics.trackPageView(event.url);
      }
    });
  }

  private analytics = {
    trackPageView: (url: string) => {
      console.log('Page view tracked:', url);
    },
  };
}
```

### Error handling

Navigasyon hatalarını nazikçe yönetme ve kullanıcı geri bildirimi sağlama:

```angular-ts
import {Component, inject, signal} from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationError,
  NavigationCancel,
  NavigationCancellationCode,
} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-error-handler',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="dismissError()">Dismiss</button>
      </div>
    }
  `,
})
export class ErrorHandler {
  private router = inject(Router);
  readonly errorMessage = signal('');

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.errorMessage.set('');
      } else if (event instanceof NavigationError) {
        console.error('Navigation error:', event.error);
        this.errorMessage.set('Failed to load page. Please try again.');
      } else if (event instanceof NavigationCancel) {
        console.warn('Navigation cancelled:', event.reason);
        if (event.code === NavigationCancellationCode.GuardRejected) {
          this.errorMessage.set('Access denied. Please check your permissions.');
        }
      }
    });
  }

  dismissError() {
    this.errorMessage.set('');
  }
}
```

## All router events

Referans olarak, Angular'da bulunan tüm router olaylarının tam listesi burada verilmiştir. Bu olaylar kategoriye göre düzenlenmiş ve navigasyon sırasında tipik olarak oluşma sırasına göre listelenmiştir.

### Navigation events

Bu olaylar, başlangıçtan rota tanıma, koruyucu kontrolleri ve veri çözümlemeye kadar temel navigasyon sürecini izler. Navigasyon yaşam döngüsünün her aşamasına görünürlük sağlar.

| Olay                                                      | Açıklama                                                               |
| --------------------------------------------------------- | ---------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)           | Navigasyon başladığında gerçekleşir                                    |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | Bir rota yapılandırması tembel yüklenmeden önce gerçekleşir            |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | Tembel yüklenen bir rota yapılandırması yüklendikten sonra gerçekleşir |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | Yönlendirici URL'yi ayrıştırıp rotaları tanıdığında gerçekleşir        |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | Koruyucu aşamasının başında gerçekleşir                                |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | Koruyucu aşamasının sonunda gerçekleşir                                |
| [`ResolveStart`](api/router/ResolveStart)                 | Çözümleme aşamasının başında gerçekleşir                               |
| [`ResolveEnd`](api/router/ResolveEnd)                     | Çözümleme aşamasının sonunda gerçekleşir                               |

### Activation events

Bu olaylar, rota bileşenlerinin oluşturulup başlatıldığı etkinleştirme aşamasında gerçekleşir. Etkinleştirme olayları, üst ve alt rotalar dahil olmak üzere rota ağacındaki her rota için tetiklenir.

| Olay                                                      | Açıklama                                        |
| --------------------------------------------------------- | ----------------------------------------------- |
| [`ActivationStart`](api/router/ActivationStart)           | Rota etkinleştirmesinin başında gerçekleşir     |
| [`ChildActivationStart`](api/router/ChildActivationStart) | Alt rota etkinleştirmesinin başında gerçekleşir |
| [`ActivationEnd`](api/router/ActivationEnd)               | Rota etkinleştirmesinin sonunda gerçekleşir     |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | Alt rota etkinleştirmesinin sonunda gerçekleşir |

### Navigation completion events

Bu olaylar, bir navigasyon girişiminin nihai sonucunu temsil eder. Her navigasyon, başarılı olup olmadığını, iptal edilip edilmediğini, başarısız olup olmadığını veya atlanıp atlanmadığını gösteren bu olaylardan tam olarak biriyle sona erer.

| Olay                                                | Açıklama                                                                     |
| --------------------------------------------------- | ---------------------------------------------------------------------------- |
| [`NavigationEnd`](api/router/NavigationEnd)         | Navigasyon başarıyla sona erdiğinde gerçekleşir                              |
| [`NavigationCancel`](api/router/NavigationCancel)   | Yönlendirici navigasyonu iptal ettiğinde gerçekleşir                         |
| [`NavigationError`](api/router/NavigationError)     | Beklenmeyen bir hata nedeniyle navigasyon başarısız olduğunda gerçekleşir    |
| [`NavigationSkipped`](api/router/NavigationSkipped) | Yönlendirici navigasyonu atladığında gerçekleşir (örn. aynı URL navigasyonu) |

### Other events

Ana navigasyon yaşam döngüsünün dışında gerçekleşen ancak yönlendiricinin olay sisteminin bir parçası olan ek bir olay daha vardır.

| Olay                          | Açıklama                       |
| ----------------------------- | ------------------------------ |
| [`Scroll`](api/router/Scroll) | Kaydırma sırasında gerçekleşir |

## Next steps

[Rota koruyucuları](/guide/routing/route-guards) ve [yaygın yönlendirici görevleri](/guide/routing/common-router-tasks) hakkında daha fazla bilgi edinin.
