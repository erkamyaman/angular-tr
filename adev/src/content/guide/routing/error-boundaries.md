# Yönlendirmede hata sınırları

IMPORTANT: Router hata sınırları [geliştirici önizlemesindedir](reference/releases#geliştirici-önizlemesi).

Web uygulamaları geliştirirken bileşen başlatma, veri yükleme veya render etme sırasında çalışma zamanı hataları oluşabilir. Angular Router, **hata sınırları** kullanarak bu başarısızlıkları tekil rotalara izole etmenize olanak tanır ve tek bir başarısız bileşenin tüm uygulama kabuğunu çökertmesini önler.

NOTE: Bu kılavuz rota düzeyinde hata yönetimini ele alır. Bir bileşenin şablonunun belirli bölümlerindeki hataları yakalamak için [şablon `@boundary` bloğu kılavuzuna](/guide/templates/error-boundaries) bakın.

## Router hata sınırları nedir? {#what-are-router-error-boundaries}

Router hata sınırları, rota outlet'i düzeyinde bildirimsel hata yönetimi sağlar. Bir rotadaki bileşen, başarısız bir ağ kaynağı, şablonda beklenmeyen bir null referansı veya bağımlılık enjeksiyonu sırasında oluşan bir hata gibi bir hata fırlattığında, Angular Router hatayı yakalar ve başarısız olan görünümün yerine özel bir yedek bileşen (`errorComponent`) görüntüler.

Kardeş outlet'ler, üst düzen bileşenleri ve genel gezinme başlıkları tamamen etkileşimli ve bozulmadan kalır.

## Hata bileşenini yapılandırma {#configure-an-error-component}

Bir rota başarısız olduğunda özel bir yedek arayüz görüntülemek için rota tanımınıza `errorComponent` özelliğini ekleyin:

```ts {header:"app.routes.ts"}
import {Routes} from '@angular/router';
import {ProductDetails} from './product-details';
import {ProductErrorFallback} from './product-error-fallback';

export const routes: Routes = [
  {
    path: 'products/:id',
    component: ProductDetails,
    errorComponent: ProductErrorFallback,
  },
];
```

`/products/123` adresine gittiğinizde, `ProductDetails` oluşturulurken veya render edilirken bir hata fırlatırsa Angular Router bunun yerine `<router-outlet>` içinde `ProductErrorFallback` örneğini oluşturur.

NOTE: `errorComponent` yalnızca hata sınırlarını etkinleştirdikten sonra çalışır. Bkz. [Genel hata sınırı yapılandırması](#global-error-boundary-configuration).

NOTE: `loadComponent` ile tembel yüklenebilen rota bileşenlerinin aksine, `errorComponent` rota yapılandırmanızda eager olarak yüklenmelidir.

---

## Hata yedek bileşeni oluşturma {#create-an-error-fallback-component}

Hata yedek bileşeni, yakalanan hatanın ayrıntılarını alabilen standart bir Angular bileşenidir.

### Hata ayrıntılarına input ile erişme {#access-error-details-with-an-input}

Yakalanan hata nesnesini `error` input'u tanımlayarak alabilirsiniz:

```angular-ts {header:"product-error-fallback.ts"}
import {Component, input} from '@angular/core';

@Component({
  selector: 'app-product-error-fallback',
  template: `
    <div class="error-card">
      <h3>Ürün yüklenemedi</h3>
      <p>{{ error()?.message }}</p>
    </div>
  `,
})
export class ProductErrorFallback {
  readonly error = input<Error>();
}
```

NOTE: Rota yapılandırmanız `error` adlı parametreler, sorgu parametreleri veya rota verisi içeriyorsa, yakalanan çalışma zamanı `Error` nesnesi, hata bileşeninin `error` input'unda her zaman önceliklidir.

IMPORTANT: `errorComponent` oluşturulurken veya render edilirken kendisi bir hata fırlatırsa `RouterOutlet` bunu tekrar yakalamaz. Sonsuz hata döngülerini önlemek için istisna outlet'ten kök `ErrorHandler`'a (veya onu çevreleyen bir [şablon `@boundary` bloğuna](/guide/templates/error-boundaries)) yayılır.

## Rota parametresi ve veri bağlama {#route-parameter-and-data-binding}

`withComponentInputBinding()` kullanıldığında Angular Router, rota parametrelerini ve statik veriyi `errorComponent` üzerindeki input'lara da bağlar. Bu sayede hata arayüzünüzde bağlamsal bilgi görüntüleyebilirsiniz:

```angular-ts {header:"product-error-fallback.ts"}
import {Component, input} from '@angular/core';

@Component({
  selector: 'app-product-error-fallback',
  template: `
    <div class="error-card">
      <h3>Ürün yüklenemedi #{{ id() }}</h3>
      <p>{{ error()?.message }}</p>
    </div>
  `,
})
export class ProductErrorFallback {
  readonly id = input<string>();
  readonly error = input<Error>();
}
```

## Genel hata sınırı yapılandırması {#global-error-boundary-configuration}

Uygulamanız için router hata sınırlarını `provideRouter` içindeki `withErrorBoundaries` özelliğiyle etkinleştirin. Bu olmadan bir rotanın `errorComponent`'i yok sayılır:

```ts {header:"app.config.ts"}
import {ApplicationConfig, inject} from '@angular/core';
import {provideRouter, withComponentInputBinding, withErrorBoundaries} from '@angular/router';
import {routes} from './app.routes';
import {GlobalErrorFallback} from './global-error-fallback';
import {AnalyticsService} from './analytics.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withErrorBoundaries({
        // Kendi errorComponent'ini tanımlamayan rotalar için varsayılan yedek bileşen
        defaultErrorComponent: GlobalErrorFallback,

        // Bir rota hatası yakalandığında çağrılan genel telemetri kancası
        onError: (error, details) => {
          inject(AnalyticsService).logException(error, details);
        },
      }),
    ),
  ],
};
```

### Seçenekler {#options}

| Seçenek                 | Tür                                              | Açıklama                                                                                                                                   |
| ----------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `defaultErrorComponent` | `Type<unknown>`                                  | Kendi `errorComponent`'i olmayan bir rota hata fırlattığında render edilecek varsayılan yedek bileşen.                                     |
| `onError`               | `(error: Error, details?: ErrorDetails) => void` | Bir router hata sınırı herhangi bir hatayı yakaladığında çağrılan genel geri çağrı. İzleme servislerine telemetri göndermek için idealdir. |

---

## `RedirectCommand` ile yönlendirme {#redirecting-with-redirectcommand}

Bir kimlik doğrulama hatası veya veri koşulu başka bir sayfaya gitmeyi gerektirdiğinde, bileşenler ve rota kaynakları bir `RedirectCommand` fırlatabilir:

```angular-ts {header:"user-profile.ts"}
import {Component, inject, resource} from '@angular/core';
import {Router, RedirectCommand} from '@angular/router';

@Component({
  selector: 'app-user-profile',
  template: `...`,
})
export class UserProfile {
  private router = inject(Router);

  userData = resource({
    loader: async () => {
      const response = await fetch('/api/user');
      if (response.status === 401) {
        // Yetkisiz olduğunda otomatik olarak /login adresine yönlendirir
        throw new RedirectCommand(this.router.parseUrl('/login'));
      }
      return response.json();
    },
  });
}
```

Bir `RedirectCommand` fırlatıldığında:

1. `RouterOutlet` komutu yakalar ve belirtilen yönlendirme hedefine navigasyonu başlatır.
2. İç içe outlet'ler veya şablon hata sınırları varsa Angular, navigasyonun yalnızca bir kez tetiklenmesini sağlamak için komutu tekilleştirir.
3. Hata bileşeni (yapılandırılmışsa) geçiş sırasında render edilir.

NOTE: Bir `RedirectCommand` fırlatılır ve hiçbir `errorComponent` yapılandırılmamışsa router navigasyonu başlatır ve hatanın genel `ErrorHandler` tarafından çökme olarak kaydedilmesini önlemek için hatayı bilinçli olarak yutar.

## Hata sınırı kapsamı ve navigasyon hataları {#error-boundary-scope-vs-navigation-errors}

**Görünüm katmanı hataları** ile **navigasyon hattı hataları** arasındaki farkı anlamak faydalıdır:

- **Görünüm katmanı hataları (Hata sınırları)**: Bileşen yapıcılarında, bağımlılık enjeksiyonunda, yaşam döngüsü kancalarında (`ngOnInit`), şablon ifadelerinde ve bileşen `resource()` yükleyicilerinde oluşur. Bunlar `RouterOutlet` tarafından yakalanır ve `errorComponent` görüntülenir.
- **Navigasyon hattı hataları (`NavigationError`)**: Başarısız `canActivate` / `canMatch` guard'ları veya rota `resolve` veri fonksiyonları gibi rota etkinleştirmesinden önce oluşur. Bunlar navigasyon geçişini outlet'e ulaşmadan durdurur ve `withNavigationErrorHandler` kullanılarak özelleştirilebilir.

NOTE: Bir hata sınırı `errorComponent` görüntülediğinde, o rota için yapılandırılan `canDeactivate` guard'ları başka bir yere gidilirken çalışır. Guard, etkin `errorComponent` örneğini `component` parametresi olarak alır. Guard'ınız bileşene özgü özelliklere veya metotlara erişiyorsa bileşen türünü doğrulayın veya hata bileşeni örneğini güvenli bir şekilde ele alın.

## Sonraki adımlar {#next-steps}

<docs-pill-row>
  <docs-pill href="/guide/templates/error-boundaries" title="Şablon hata sınırları"/>
  <docs-pill href="/guide/routing/show-routes-with-outlets" title="Outlet'lerle rotaları gösterme"/>
  <docs-pill href="/guide/routing/redirecting-routes" title="Rota yönlendirmeleri"/>
  <docs-pill href="/guide/routing/data-fetching-with-resources" title="Resource'larla veri getirme"/>
</docs-pill-row>
