# Route Geçiş Animasyonları

Rota geçiş animasyonları, Angular uygulamanızda farklı görünümler arasında navigasyon yaparken yumuşak görsel geçişler sağlayarak kullanıcı deneyimini geliştirir. [Angular Router](/guide/routing), desteklenen tarayıcılarda rota değişiklikleri arasında sorunsuz animasyonlar sağlayan tarayıcının View Transitions API'si için yerleşik destek içerir.

HELPFUL: Yönlendiricinin yerel View Transitions entegrasyonu şu anda [geliştirici önizlemesindedir](/reference/releases#geliştirici-önizlemesi). Yerel View Transitions, tüm tarayıcılarda sınırlı desteğe sahip nispeten yeni bir tarayıcı özelliğidir.

## View Transitions nasıl çalışır

View transitions, uygulamanızın farklı durumları arasında yumuşak animasyonlar oluşturmak için tarayıcının yerel [`document.startViewTransition` API'sini](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) kullanır. API şu şekilde çalışır:

1. **Geçerli durumu yakalama** - Tarayıcı mevcut sayfanın bir ekran görüntüsünü alır
2. **DOM güncellemesini yürütme** - Callback fonksiyonunuz DOM'u güncellemek için çalışır
3. **Yeni durumu yakalama** - Tarayıcı güncellenmiş sayfa durumunu yakalar
4. **Geçişi oynatma** - Tarayıcı eski ve yeni durumlar arasında animasyon yapar

İşte `startViewTransition` API'sinin temel yapısı:

```ts
document.startViewTransition(async () => {
  await updateTheDOMSomehow();
});
```

Tarayıcı API'si hakkında daha fazla bilgi için [Chrome Açıklayıcısına](https://developer.chrome.com/docs/web-platform/view-transitions) bakın.

## Router view transitions'ı nasıl kullanır

Angular Router, sorunsuz rota değişiklikleri oluşturmak için view transitions'ı navigasyon yaşam döngüsüne entegre eder. Navigasyon sırasında Yönlendirici:

1. **Navigasyon hazırlığını tamamlar** - Rota eşleştirme, [tembel yükleme](guide/routing/loading-strategies#tembel-yüklenen-bileşenler-ve-routelar), [koruyucular](/guide/routing/route-guards) ve [çözücüler](/guide/routing/data-resolvers) çalışır
2. **View transition'ı başlatır** - Rotalar etkinleştirmeye hazır olduğunda Yönlendirici `startViewTransition` çağırır
3. **DOM'u günceller** - Yönlendirici, geçiş callback'i içinde yeni rotaları etkinleştirir ve eskileri devre dışı bırakır
4. **Geçişi sonlandırır** - Angular render'ı tamamladığında geçiş Promise'i çözümlenir

Yönlendiricinin view transition entegrasyonu, [aşamalı geliştirme](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) olarak işlev görür. Tarayıcılar View Transitions API'sini desteklemediğinde, Yönlendirici animasyon olmadan normal DOM güncellemelerini gerçekleştirir ve uygulamanızın tüm tarayıcılarda çalışmasını sağlar.

## Router'da View Transitions'ı etkinleştirme

[Yönlendirici yapılandırmanıza](/guide/routing/define-routes#uygulamanıza-router-ekleme) `withViewTransitions` özelliğini ekleyerek view transitions'ı etkinleştirin. Angular hem standalone hem de NgModule başlatma yaklaşımlarını destekler:

### Standalone başlatma

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withViewTransitions} from '@angular/router';
import {routes} from './app.routes';

bootstrapApplication(MyApp, {
  providers: [provideRouter(routes, withViewTransitions())],
});
```

### NgModule başlatma

```ts
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableViewTransitions: true})],
})
export class AppRouting {}
```

[StackBlitz'de "count" örneğini deneyin](https://stackblitz.com/edit/stackblitz-starters-2dnvtm?file=src%2Fmain.ts)

Bu örnek, yönlendirici navigasyonunun sayaç güncellemeleri için doğrudan `startViewTransition` çağrılarını nasıl değiştirebileceğini gösterir.

## CSS ile geçişleri özelleştirme

Benzersiz animasyon efektleri oluşturmak için CSS kullanarak view transitions'ı özelleştirebilirsiniz. Tarayıcı, CSS seçicilerle hedefleyebileceğiniz ayrı geçiş öğeleri oluşturur.

Özel geçişler oluşturmak için:

1. **view-transition-name ekleyin** - Animasyon yapmak istediğiniz öğelere benzersiz adlar atayın
2. **Global animasyonlar tanımlayın** - Global stillerinizde CSS animasyonları oluşturun
3. **Geçiş sözde öğelerini hedefleyin** - `::view-transition-old()` ve `::view-transition-new()` seçicilerini kullanın

İşte bir sayaç öğesine döndürme efekti ekleyen bir örnek:

```css
/* Keyframe animasyonlarını tanımla */
@keyframes rotate-out {
  to {
    transform: rotate(90deg);
  }
}

@keyframes rotate-in {
  from {
    transform: rotate(-90deg);
  }
}

/* View transition sözde öğelerini hedefle */
::view-transition-old(count),
::view-transition-new(count) {
  animation-duration: 200ms;
  animation-name: -ua-view-transition-fade-in, rotate-in;
}

::view-transition-old(count) {
  animation-name: -ua-view-transition-fade-out, rotate-out;
}
```

IMPORTANT: View transition animasyonlarını bileşen stillerinde değil, global stil dosyanızda tanımlayın. Angular'ın [görünüm kapsülleme](/guide/components/styling#stil-kapsamı) özelliği bileşen stillerini kapsamlar ve bu da geçiş sözde öğelerini doğru şekilde hedeflemelerini engeller.

[StackBlitz'de güncellenmiş "count" örneğini deneyin](https://stackblitz.com/edit/stackblitz-starters-fwn4i7?file=src%2Fmain.ts)

## onViewTransitionCreated ile gelişmiş geçiş kontrolü

`withViewTransitions` özelliği, view transitions üzerinde gelişmiş kontrol için `onViewTransitionCreated` callback'i olan bir seçenekler nesnesi kabul eder. Bu callback:

- Bir [enjeksiyon bağlamında](/guide/di/dependency-injection-context#bir-enjeksiyon-bağlamında-çalıştırma) çalışır
- Aşağıdakileri içeren bir [`ViewTransitionInfo`](/api/router/ViewTransitionInfo) nesnesi alır:
  - `startViewTransition`'dan gelen `ViewTransition` örneği
  - Navigasyon yapılan kaynak rota için [`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot)
  - Navigasyon yapılan hedef rota için [`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot)

Bu callback'i, navigasyon bağlamına göre geçiş davranışını özelleştirmek için kullanın. Örneğin, belirli navigasyon türleri için geçişleri atlayabilirsiniz:

```ts
import {inject} from '@angular/core';
import {Router, withViewTransitions, isActive} from '@angular/router';

withViewTransitions({
  onViewTransitionCreated: ({transition}) => {
    const router = inject(Router);
    const targetUrl = router.currentNavigation()!.finalUrl!;

    // Yalnızca fragment veya sorgu parametreleri değişiyorsa geçişi atla
    const config = {
      paths: 'exact',
      matrixParams: 'exact',
      fragment: 'ignored',
      queryParams: 'ignored',
    };

    const isTargetRouteCurrent = isActive(targetUrl, router, config);

    if (isTargetRouteCurrent()) {
      transition.skipTransition();
    }
  },
});
```

Bu örnek, navigasyon yalnızca [URL fragment veya sorgu parametrelerini](/guide/routing/read-route-state#sorgu-parametreleri) değiştirdiğinde (aynı sayfa içindeki bağlantı bağlantıları gibi) view transition'ı atlar. `skipTransition()` yöntemi, navigasyonun tamamlanmasına izin verirken animasyonu engeller.

## Chrome açıklayıcısından Angular'a uyarlanan örnekler

Aşağıdaki örnekler, Chrome ekibinin dokümantasyonundan Angular Router ile kullanım için uyarlanmış çeşitli view transition tekniklerini gösterir:

### Geçiş yapan öğelerin aynı DOM öğesi olması gerekmez

Öğeler, aynı `view-transition-name`'i paylaştıkları sürece farklı DOM öğeleri arasında sorunsuz geçiş yapabilir.

- [Chrome Açıklayıcı](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning_elements_dont_need_to_be_the_same_dom_element)
- [StackBlitz'de Angular Örneği](https://stackblitz.com/edit/stackblitz-starters-dh8npr?file=src%2Fmain.ts)

### Özel giriş ve çıkış animasyonları

Rota geçişleri sırasında görünüm alanına giren ve çıkan öğeler için benzersiz animasyonlar oluşturun.

- [Chrome Açıklayıcı](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#custom_entry_and_exit_transitions)
- [StackBlitz'de Angular Örneği](https://stackblitz.com/edit/stackblitz-starters-8kly3o)

### Asenkron DOM güncellemeleri ve içerik bekleme

Angular Router, ek içerik yüklenmesini beklemek yerine anında geçişlere öncelik verir.

- [Chrome Açıklayıcı](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#async_dom_updates_and_waiting_for_content)

NOTE: Angular Router, view transitions'ı geciktirmenin bir yolunu sağlamaz. Bu tasarım seçimi, ek içerik beklenirken sayfaların etkileşimsiz kalmasını önler. Chrome dokümantasyonunun belirttiği gibi: "Bu süre boyunca sayfa dondurulur, bu nedenle buradaki gecikmeler minimumda tutulmalıdır...bazı durumlarda gecikmeyi tamamen önlemek ve zaten sahip olduğunuz içeriği kullanmak daha iyidir."

### View transition türleri ile birden fazla view transition stilini yönetme

Navigasyon bağlamına göre farklı animasyon stilleri uygulamak için view transition türlerini kullanın.

- [Chrome Açıklayıcı](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#view-transition-types)
- [StackBlitz'de Angular Örneği](https://stackblitz.com/edit/stackblitz-starters-vxzcam)

### View transition kökünde sınıf adı ile birden fazla view transition stilini yönetme (kullanımdan kaldırıldı)

Bu yaklaşım, animasyon stillerini kontrol etmek için geçiş kök öğesinde CSS sınıfları kullanır.

- [Chrome Açıklayıcı](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#changing-on-navigation-type)
- [StackBlitz'de Angular Örneği](https://stackblitz.com/edit/stackblitz-starters-nmnzzg?file=src%2Fmain.ts)

### Diğer animasyonları dondurmadan geçiş yapma

Daha dinamik kullanıcı deneyimleri oluşturmak için view transitions sırasında diğer sayfa animasyonlarını sürdürün.

- [Chrome Açıklayıcı](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning-without-freezing)
- [StackBlitz'de Angular Örneği](https://stackblitz.com/edit/stackblitz-starters-76kgww)

### JavaScript ile animasyon yapma

Karmaşık animasyon senaryoları için JavaScript API'lerini kullanarak view transitions'ı programatik olarak kontrol edin.

- [Chrome Açıklayıcı](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#animating-with-javascript)
- [StackBlitz'de Angular Örneği](https://stackblitz.com/edit/stackblitz-starters-cklnkm)
