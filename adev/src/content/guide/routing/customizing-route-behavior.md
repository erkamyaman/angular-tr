# Rota davranışını özelleştirme

Angular Router, uygulamanızda rotaların nasıl davranacağını özelleştirmenize olanak tanıyan güçlü genişletme noktaları sağlar. Varsayılan yönlendirme davranışı çoğu uygulama için iyi çalışsa da, belirli gereksinimler genellikle performans optimizasyonu, özelleştirilmiş URL yönetimi veya karmaşık yönlendirme mantığı için özel uygulamalar gerektirir.

Rota özelleştirmesi, uygulamanızın şunlara ihtiyaç duyduğunda değerli hale gelebilir:

- Veri yeniden çekmeyi önlemek için navigasyonlar arasında **bileşen durumu koruma**
- Kullanıcı davranışına veya ağ koşullarına dayalı **stratejik tembel modül yükleme**
- **Harici URL entegrasyonu** veya Angular rotalarını eski sistemlerle birlikte yönetme
- Basit yol kalıplarının ötesinde çalışma zamanı koşullarına dayalı **dinamik rota eşleştirme**

NOTE: Özel stratejiler uygulamadan önce, varsayılan yönlendirici davranışının ihtiyaçlarınızı karşılamadığından emin olun. Angular'ın varsayılan yönlendirmesi yaygın kullanım durumları için optimize edilmiştir ve performans ile basitlik arasında en iyi dengeyi sağlar. Rota stratejilerini özelleştirmek, dikkatli yönetilmezse bellek kullanımı üzerinde ek kod karmaşıklığı ve performans etkileri oluşturabilir.

## Router yapılandırma seçenekleri

`withRouterConfig` veya `RouterModule.forRoot`, Yönlendiricinin davranışını ayarlamak için ek `RouterConfigOptions` sağlamaya olanak tanır.

### İptal edilen navigasyonları yönetme

`canceledNavigationResolution`, bir navigasyon iptal edildiğinde Yönlendiricinin tarayıcı geçmişini nasıl geri yüklediğini kontrol eder. Varsayılan değer `'replace'`'dir ve `location.replaceState` ile navigasyon öncesi URL'ye döner. Pratikte bu, adres çubuğunun navigasyon için zaten güncellenmiş olduğu durumlarda, örneğin tarayıcı geri veya ileri düğmeleriyle, navigasyon başarısız olursa veya bir koruyucu tarafından reddedilirse geçmiş girişinin "geri alma" ile üzerine yazılacağı anlamına gelir.
`'computed'`'a geçmek, uçuş halindeki geçmiş dizinini Angular navigasyonuyla senkronize tutar, böylece geri düğmesi navigasyonunu iptal etmek orijinal sayfaya dönmek için bir ileri navigasyon tetikler (ve tam tersi).

Bu ayar, uygulamanız `urlUpdateStrategy: 'eager'` kullandığında veya koruyucular tarayıcı tarafından başlatılan popstate navigasyonlarını sıkça iptal ettiğinde en yararlıdır.

```ts
provideRouter(routes, withRouterConfig({canceledNavigationResolution: 'computed'}));
```

### Aynı URL navigasyonlarına tepki verme

`onSameUrlNavigation`, kullanıcı geçerli URL'ye navigasyon istediğinde ne olması gerektiğini yapılandırır. Varsayılan `'ignore'` işlemi atlar, `'reload'` ise koruyucuları ve çözücüleri yeniden çalıştırır ve bileşen örneklerini yeniler.

Bu, bir liste filtresine, sol navigasyon öğesine veya yenile düğmesine tekrarlanan tıklamaların URL değişmese bile yeni veri çekmeyi tetiklemesini istediğinizde yararlıdır.

```ts
provideRouter(routes, withRouterConfig({onSameUrlNavigation: 'reload'}));
```

Bu davranışı global yerine bireysel navigasyonlarda da kontrol edebilirsiniz. Bu, varsayılan `'ignore'`'u korurken belirli kullanım durumları için seçici olarak yeniden yükleme davranışını etkinleştirmenize olanak tanır:

```ts
router.navigate(['/some-path'], {onSameUrlNavigation: 'reload'});
```

### Parametre devralma kontrolü

`paramsInheritanceStrategy`, rota parametrelerinin ve verilerin üst rotalardan nasıl aktığını tanımlar.

Varsayılan `'emptyOnly'` ile alt rotalar, parametreleri yalnızca yolları boşken veya üst rota bir bileşen bildirmediğinde devralır.

```ts
provideRouter(routes, withRouterConfig({paramsInheritanceStrategy: 'always'}));
```

```ts
export const routes: Routes = [
  {
    path: 'org/:orgId',
    component: Organization,
    children: [
      {
        path: 'projects/:projectId',
        component: Project,
        children: [
          {
            path: 'customers/:customerId',
            component: Customer,
          },
        ],
      },
    ],
  },
];
```

```ts
@Component({
  /* ... */
})
export class Customer {
  private route = inject(ActivatedRoute);

  // Üst rota parametrelerine erişmek için üst zincirleme gerekli
  orgId = this.route.parent?.parent?.snapshot.params['orgId'];
  projectId = this.route.parent?.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

`'always'` kullanmak, matris parametrelerinin, rota verilerinin ve çözümlenen değerlerin rota ağacında daha aşağıda kullanılabilir olmasını sağlar - şu gibi özellik alanları arasında bağlamsal tanımlayıcıları paylaştığınızda kullanışlıdır:

```text {hideCopy}
/org/:orgId/projects/:projectId/customers/:customerId
```

```ts
@Component({
  /* ... */
})
export class Customer {
  private route = inject(ActivatedRoute);

  // Tüm üst parametreler doğrudan kullanılabilir
  orgId = this.route.snapshot.params['orgId'];
  projectId = this.route.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

### URL'nin ne zaman güncelleneceğine karar verme

`urlUpdateStrategy`, Angular'ın tarayıcı adres çubuğuna ne zaman yazacağını belirler. Varsayılan `'deferred'`, URL'yi değiştirmeden önce başarılı bir navigasyonu bekler. URL'yi navigasyon başladığında hemen güncellemek için `'eager'` kullanın. Hevesli güncellemeler, koruyucular veya hatalar nedeniyle navigasyon başarısız olursa denenen URL'yi daha kolay ortaya çıkarır, ancak uzun süren koruyucularınız varsa kısa süreliğine işlem devam eden bir URL gösterebilir.

Analitik altyapınızın koruyucular engellese bile denenen rotayı görmesi gerektiğinde bunu düşünün.

```ts
provideRouter(routes, withRouterConfig({urlUpdateStrategy: 'eager'}));
```

### Varsayılan sorgu parametresi yönetimini seçme

`defaultQueryParamsHandling`, çağrı `queryParamsHandling` belirtmediğinde `Router.createUrlTree` için varsayılan davranışı ayarlar. `'replace'` varsayılandır ve mevcut sorgu dizesini değiştirir. `'merge'` sağlanan değerleri geçerli olanlarla birleştirir ve `'preserve'` açıkça yeni değerler sağlamadığınız sürece mevcut sorgu parametrelerini korur.

```ts
provideRouter(routes, withRouterConfig({defaultQueryParamsHandling: 'merge'}));
```

Bu, özellikle arama ve filtre sayfalarında ek parametreler sağlandığında mevcut filtreleri otomatik olarak korumak için yararlıdır.

### Sondaki eğik çizgi yönetimini yapılandırma

Varsayılan olarak, `Location` servisi okuma sırasında URL'lerden sondaki eğik çizgileri kaldırır.

Tarayıcıya yazılan tüm URL'lere sondaki eğik çizgi eklenmesini zorlamak için uygulamanızda `TrailingSlashPathLocationStrategy` sağlayarak `Location` servisini yapılandırabilirsiniz.

```ts
import {LocationStrategy, TrailingSlashPathLocationStrategy} from '@angular/common';

bootstrapApplication(App, {
  providers: [{provide: LocationStrategy, useClass: TrailingSlashPathLocationStrategy}],
});
```

Tarayıcıya yazılan tüm URL'lerde asla sondaki eğik çizgi olmamasını zorlamak için uygulamanızda `NoTrailingSlashPathLocationStrategy` de sağlayabilirsiniz.

```ts
import {LocationStrategy, NoTrailingSlashPathLocationStrategy} from '@angular/common';

bootstrapApplication(App, {
  providers: [{provide: LocationStrategy, useClass: NoTrailingSlashPathLocationStrategy}],
});
```

Bu stratejiler yalnızca tarayıcıya yazılan URL'yi etkiler.
`Location.path()` ve `Location.normalize()`, URL'yi okurken sondaki eğik çizgileri kaldırmaya devam edecektir.

Angular Router, özelleştirme için dört ana alan sunar:

  <docs-pill-row>
    <docs-pill href="#rota-yeniden-kullanım-stratejisi" title="Route reuse strategy"/>
    <docs-pill href="#ön-yükleme-stratejisi" title="Preloading strategy"/>
    <docs-pill href="#url-yönetim-stratejisi" title="URL handling strategy"/>
    <docs-pill href="#özel-route-eşleştiricileri" title="Custom route matchers"/>
  </docs-pill-row>

## Rota yeniden kullanım stratejisi

Rota yeniden kullanım stratejisi, Angular'ın navigasyon sırasında bileşenleri yok edip yeniden oluşturup oluşturmayacağını veya yeniden kullanım için koruyup korumayacağını kontrol eder. Varsayılan olarak Angular, bir rotadan ayrılırken bileşen örneklerini yok eder ve geri döndüğünde yeni örnekler oluşturur.

### Rota yeniden kullanımı ne zaman uygulanmalı

Özel rota yeniden kullanım stratejileri, şunlara ihtiyaç duyan uygulamalara fayda sağlar:

- **Form durumu koruma** - Kullanıcılar navigasyon yapıp geri döndüğünde kısmen tamamlanmış formları koruma
- **Pahalı veri saklama** - Büyük veri kümelerinin veya karmaşık hesaplamaların yeniden çekilmesini önleme
- **Kaydırma konumu koruma** - Uzun listelerde veya sonsuz kaydırma uygulamalarında kaydırma konumlarını koruma
- **Sekme benzeri arayüzler** - Sekmeler arasında geçiş yaparken bileşen durumunu koruma

### Özel rota yeniden kullanım stratejisi oluşturma

Angular'ın `RouteReuseStrategy` sınıfı, "ayrılmış rota tutamaçları" kavramı aracılığıyla navigasyon davranışını özelleştirmenize olanak tanır.

"Ayrılmış rota tutamaçları", Angular'ın bileşen örneklerini ve tüm görünüm hiyerarşilerini saklamasının yoludur. Bir rota ayrıldığında, Angular bileşen örneğini, alt bileşenlerini ve tüm ilişkili durumu bellekte korur. Bu korunan durum, rotaya geri navigasyon yapıldığında yeniden eklenebilir.

`RouteReuseStrategy` sınıfı, rota bileşenlerinin yaşam döngüsünü kontrol eden aşağıdaki yöntemleri sağlar:

| Yöntem                                                                         | Açıklama                                                                                                               |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| [`shouldDetach`](api/router/RouteReuseStrategy#shouldDetach)                   | Navigasyon sırasında bir rotanın daha sonra yeniden kullanım için saklanıp saklanmayacağını belirler                   |
| [`store`](api/router/RouteReuseStrategy#store)                                 | `shouldDetach` true döndürdüğünde ayrılmış rota tutamacını saklar                                                      |
| [`shouldAttach`](api/router/RouteReuseStrategy#shouldAttach)                   | Saklanan bir rotanın navigasyon yapıldığında yeniden eklenip eklenmeyeceğini belirler                                  |
| [`retrieve`](api/router/RouteReuseStrategy#retrieve)                           | Yeniden ekleme için daha önce saklanan rota tutamacını döndürür                                                        |
| [`shouldReuseRoute`](api/router/RouteReuseStrategy#shouldReuseRoute)           | Yönlendiricinin navigasyon sırasında geçerli rota örneğini yok etmek yerine yeniden kullanıp kullanmayacağını belirler |
| [`shouldDestroyInjector`](api/router/RouteReuseStrategy#shouldDestroyInjector) | (Deneysel) Yönlendiricinin artık saklanmayan ayrılmış bir rotanın enjektörünü yok edip etmeyeceğini belirler           |

Aşağıdaki örnek, rota meta verilerine göre bileşen durumunu seçici olarak koruyan özel bir rota yeniden kullanım stratejisini gösterir:

```ts
import {
  RouteReuseStrategy,
  Route,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers = new Map<Route | null, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Bir rotanın daha sonra yeniden kullanım için saklanıp saklanmayacağını belirler
    return route.data['reuse'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // shouldDetach true döndürdüğünde ayrılmış rota tutamacını saklar
    if (handle && route.data['reuse'] === true) {
      const key = this.getRouteKey(route);
      this.handlers.set(key, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // Saklanan bir rotanın yeniden eklenip eklenmeyeceğini kontrol eder
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true && this.handlers.has(key);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // Yeniden ekleme için saklanan rota tutamacını döndürür
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true ? (this.handlers.get(key) ?? null) : null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Yönlendiricinin geçerli rota örneğini yeniden kullanıp kullanmayacağını belirler
    return future.routeConfig === curr.routeConfig;
  }

  private getRouteKey(route: ActivatedRouteSnapshot): Route | null {
    return route.routeConfig;
  }
}
```

### Ayrılmış rota tutamaçlarını manuel olarak yok etme

Özel bir `RouteReuseStrategy` uygularken, yeniden eklemeden vazgeçtiğiniz bir `DetachedRouteHandle`'ı manuel olarak yok etmeniz gerekebilir. Örneğin, stratejinizin bir önbellek boyut sınırı varsa veya belirli bir süre sonra tutamaçların süresini doluruyorsa, bellek sızıntılarını önlemek için bileşenin ve durumunun düzgün şekilde yok edildiğinden emin olmalısınız.

`DetachedRouteHandle` opak bir tür olduğundan, doğrudan üzerinde bir yok etme yöntemi çağıramazsınız. Bunun yerine, Yönlendirici tarafından sağlanan `destroyDetachedRouteHandle` fonksiyonunu kullanın.

```ts
import {destroyDetachedRouteHandle} from '@angular/router';

// ... stratejinizin içinde
if (this.handles.size > MAX_CACHE_SIZE) {
  const handle = this.handles.get(oldestKey);
  if (handle) {
    destroyDetachedRouteHandle(handle);
    this.handles.delete(oldestKey);
  }
}
```

NOTE: `canMatch` koruyucuları söz konusu olduğunda anahtar olarak rota yolunu kullanmaktan kaçının, çünkü yinelenen girişlere yol açabilir.

### (Deneysel) Kullanılmayan rota enjektörlerinin otomatik temizlenmesi

Varsayılan olarak Angular, ayrılmış rotaların enjektörlerini, artık `RouteReuseStrategy` tarafından saklanmasalar bile yok etmez. Bu, öncelikle bu düzeyde bellek yönetiminin çoğu uygulama için yaygın olarak gerekli olmamasından kaynaklanmaktadır.

Kullanılmayan rota enjektörlerinin otomatik temizlenmesini etkinleştirmek için yönlendirici yapılandırmanızda `withExperimentalAutoCleanupInjectors` özelliğini kullanabilirsiniz. Bu özellik, navigasyonlardan sonra strateji tarafından şu anda hangi rotaların saklandığını kontrol eder ve yeniden kullanım stratejisi tarafından saklanmayan ayrılmış rotaların enjektörlerini yok eder.

```ts
import {provideRouter, withExperimentalAutoCleanupInjectors} from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withExperimentalAutoCleanupInjectors())],
};
```

Özel bir `RouteReuseStrategy` sağlamazsanız veya özel stratejiniz `BaseRouteReuseStrategy`'yi genişletiyorsa, rota inaktif olduğunda enjektörler artık yok edilecektir.

#### Özel bir `RouteReuseStrategy` ile temizleme

Uygulamanız özel bir `RouteReuseStrategy` kullanıyorsa _ve_ strateji `BaseRouteReuseStrategy`'yi genişletmiyorsa, hangi rotaların enjektörlerinin yok edileceğini yönlendiriciye söylemek için `shouldDestroyInjector` uygulamanız gerekir:

```ts
@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  // ... diğer yöntemler

  shouldDestroyInjector(route: Route): boolean {
    return !route.data['retainInjector'];
  }
}
```

Stratejiniz bir `DetachedRouteHandle` saklıyorsa, Yönlendiriciye bunları bildirmeniz de gerekecektir ki ayrılmış tutamaç tarafından ihtiyaç duyulan enjektörleri yok etmesin:

```ts
@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private readonly handles = new Map<Route, DetachedRouteHandle>();

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null) {
    this.handles.set(route.routeConfig!, handle);
  }

  retrieveStoredRouteHandles(): DetachedRouteHandle {
    return Array.from(this.handles.values());
  }

  // ... diğer yöntemler
}
```

### Özel rota yeniden kullanım stratejisi kullanmak için bir rota yapılandırma

Rotalar, rota yapılandırma meta verileri aracılığıyla yeniden kullanım davranışına katılabilir. Bu yaklaşım, yeniden kullanım mantığını bileşen kodundan ayrı tutar ve bileşenleri değiştirmeden davranışı ayarlamayı kolaylaştırır:

```ts
export const routes: Routes = [
  {
    path: 'products',
    component: ProductList,
    data: {reuse: true}, // Bileşen durumu navigasyonlar arasında korunur
  },
  {
    path: 'products/:id',
    component: ProductDetail,
    // Yeniden kullanım bayrağı yok - bileşen her navigasyonda yeniden oluşturulur
  },
  {
    path: 'search',
    component: Search,
    data: {reuse: true}, // Arama sonuçlarını ve filtre durumunu korur
  },
];
```

Ayrıca Angular'ın bağımlılık enjeksiyon sistemi aracılığıyla uygulama düzeyinde özel bir rota yeniden kullanım stratejisi yapılandırabilirsiniz. Bu durumda Angular, uygulama genelinde tüm rota yeniden kullanım kararlarını yöneten stratejinin tek bir örneğini oluşturur:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy},
  ],
};
```

## Ön yükleme stratejisi

Ön yükleme stratejileri, Angular'ın tembel yüklenen rota modüllerini arka planda ne zaman yükleyeceğini belirler. Tembel yükleme, modül indirmelerini erteleyerek ilk yükleme süresini iyileştirirken, kullanıcılar bir tembel rotaya ilk navigasyon yaptığında hâlâ bir gecikme yaşar. Ön yükleme stratejileri, modülleri kullanıcılar talep etmeden önce yükleyerek bu gecikmeyi ortadan kaldırır.

### Yerleşik ön yükleme stratejileri

Angular, kullanıma hazır iki ön yükleme stratejisi sağlar:

| Strateji                                            | Açıklama                                                                                                                                  |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [`NoPreloading`](api/router/NoPreloading)           | Tüm ön yüklemeyi devre dışı bırakan varsayılan strateji. Başka bir deyişle, modüller yalnızca kullanıcılar navigasyon yaptığında yüklenir |
| [`PreloadAllModules`](api/router/PreloadAllModules) | Tüm tembel yüklenen modülleri ilk navigasyondan hemen sonra yükler                                                                        |

`PreloadAllModules` stratejisi şu şekilde yapılandırılabilir:

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter, withPreloading, PreloadAllModules} from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withPreloading(PreloadAllModules))],
};
```

`PreloadAllModules` stratejisi, tüm modüllerin indirilmesinin performansı önemli ölçüde etkilemediği küçük ve orta ölçekli uygulamalar için iyi çalışır. Ancak birçok özellik modülüne sahip daha büyük uygulamalar, daha seçici ön yüklemeden fayda görebilir.

### Özel ön yükleme stratejisi oluşturma

Özel ön yükleme stratejileri, tek bir `preload` yöntemi gerektiren `PreloadingStrategy` arayüzünü uygular. Bu yöntem, rota yapılandırmasını ve gerçek modül yüklemeyi tetikleyen bir fonksiyonu alır. Strateji, ön yükleme tamamlandığında yayılan bir Observable veya ön yüklemeyi atlamak için boş bir Observable döndürür:

```ts
import {Injectable} from '@angular/core';
import {PreloadingStrategy, Route} from '@angular/router';
import {Observable, of, timer} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Injectable()
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Yalnızca data: { preload: true } ile işaretlenmiş rotaları ön yükle
    if (route.data?.['preload']) {
      return load();
    }
    return of(null);
  }
}
```

Bu seçici strateji, ön yükleme davranışını belirlemek için rota meta verilerini kontrol eder. Rotalar yapılandırmaları aracılığıyla ön yüklemeye katılabilir:

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes'),
    data: {preload: true}, // İlk navigasyondan hemen sonra ön yükle
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.routes'),
    data: {preload: false}, // Yalnızca kullanıcı raporlara navigasyon yaptığında yükle
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes'),
    // Ön yükleme bayrağı yok - ön yüklenmeyecek
  },
];
```

### Ön yükleme için performans değerlendirmeleri

Ön yükleme hem ağ kullanımını hem de bellek tüketimini etkiler. Ön yüklenen her modül bant genişliği tüketir ve uygulamanın bellek ayak izini artırır. Ölçülü bağlantılardaki mobil kullanıcılar minimum ön yüklemeyi tercih edebilirken, hızlı ağlardaki masaüstü kullanıcıları agresif ön yükleme stratejilerini kaldırabilir.

Ön yüklemenin zamanlaması da önemlidir. İlk yüklemeden hemen sonra ön yükleme, resimler veya API çağrıları gibi diğer kritik kaynaklarla yarışabilir. Stratejiler, uygulamanın yükleme sonrası davranışını dikkate almalı ve performans düşüşünü önlemek için diğer arka plan görevleriyle koordine olmalıdır.

Tarayıcı kaynak sınırları da ön yükleme davranışını etkiler. Tarayıcılar eşzamanlı HTTP bağlantılarını sınırlar, bu nedenle agresif ön yükleme diğer isteklerin arkasında sıraya girebilir. Service worker'lar, önbellek ve ağ istekleri üzerinde ayrıntılı kontrol sağlayarak ön yükleme stratejisini tamamlayabilir.

## URL yönetim stratejisi

URL yönetim stratejileri, Angular yönlendiricisinin hangi URL'leri işleyeceğini ve hangilerini yok sayacağını belirler. Varsayılan olarak Angular, uygulama içindeki tüm navigasyon olaylarını işlemeye çalışır, ancak gerçek dünya uygulamalarının genellikle diğer sistemlerle birlikte var olması, harici bağlantıları yönetmesi veya kendi rotalarını yöneten eski uygulamalarla entegre olması gerekir.

`UrlHandlingStrategy` sınıfı, Angular tarafından yönetilen rotalar ile harici URL'ler arasındaki bu sınırı kontrol etmenizi sağlar. Bu, uygulamaları Angular'a aşamalı olarak taşırken veya Angular uygulamalarının URL alanını diğer framework'lerle paylaşması gerektiğinde önemli hale gelir.

### Özel URL yönetim stratejisi uygulama

Özel URL yönetim stratejileri `UrlHandlingStrategy` sınıfını genişletir ve üç yöntem uygular. `shouldProcessUrl` yöntemi Angular'ın belirli bir URL'yi yönetip yönetmeyeceğini belirler, `extract` Angular'ın işlemesi gereken URL bölümünü döndürür ve `merge` URL parçasını URL'nin geri kalanıyla birleştirir:

```ts
import {Injectable} from '@angular/core';
import {UrlHandlingStrategy, UrlTree} from '@angular/router';

@Injectable()
export class CustomUrlHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url: UrlTree): boolean {
    // Yalnızca /app veya /admin ile başlayan URL'leri yönet
    return url.toString().startsWith('/app') || url.toString().startsWith('/admin');
  }

  extract(url: UrlTree): UrlTree {
    // İşlememiz gerekiyorsa URL'yi değiştirmeden döndür
    return url;
  }

  merge(newUrlPart: UrlTree, rawUrl: UrlTree): UrlTree {
    // URL parçasını URL'nin geri kalanıyla birleştir
    return newUrlPart;
  }
}
```

Bu strateji, URL alanında net sınırlar oluşturur. Angular `/app` ve `/admin` yollarını yönetirken diğer her şeyi yok sayar. Bu kalıp, Angular'ın belirli bölümleri kontrol ederken eski sistemin diğerlerini sürdürdüğü eski uygulamaları taşırken iyi çalışır.

### Özel bir URL yönetim stratejisi yapılandırma

Özel bir stratejiyi Angular'ın bağımlılık enjeksiyon sistemi aracılığıyla kaydettirebilirsiniz:

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {UrlHandlingStrategy} from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {provide: UrlHandlingStrategy, useClass: CustomUrlHandlingStrategy},
  ],
};
```

## Özel route eşleştiricileri

Varsayılan olarak, Angular'ın yönlendiricisi rotaları tanımlandıkları sırayla yineler ve URL yolunu her rotanın yol kalıbıyla eşleştirmeye çalışır. Statik segmentleri, parametreli segmentleri (`:id`) ve joker karakterleri (`**`) destekler. İlk eşleşen rota kazanır ve yönlendirici aramayı durdurur.

Uygulamalar çalışma zamanı koşullarına, karmaşık URL kalıplarına veya diğer özel kurallara dayalı daha sofistike eşleştirme mantığı gerektirdiğinde, özel eşleştiriciler standart rotaların basitliğinden ödün vermeden bu esnekliği sağlar.

Yönlendirici, özel eşleştiricileri rota eşleştirme aşamasında, yol eşleştirmeden önce değerlendirir. Bir eşleştirici başarılı bir eşleşme döndürdüğünde, standart rota parametreleri gibi URL'den parametreler de çıkarabilir ve bunları etkinleştirilen bileşen tarafından kullanılabilir hale getirir.

### Özel bir eşleştirici oluşturma

Özel bir eşleştirici, URL segmentlerini alan ve tüketilen segmentler ve parametrelerle bir eşleşme sonucu veya eşleşme olmadığını belirtmek için null döndüren bir fonksiyondur. Eşleştirici fonksiyon, Angular rotanın path özelliğini değerlendirmeden önce çalışır:

```ts
import {Route, UrlSegment, UrlSegmentGroup, UrlMatchResult} from '@angular/router';

export function customMatcher(
  segments: UrlSegment[],
  group: UrlSegmentGroup,
  route: Route,
): UrlMatchResult | null {
  // Eşleştirme mantığı burada
  if (matchSuccessful) {
    return {
      consumed: segments,
      posParams: {
        paramName: new UrlSegment('paramValue', {}),
      },
    };
  }
  return null;
}
```

### Sürüm tabanlı yönlendirme uygulama

URL'deki sürüm numaralarına göre yönlendirme yapması gereken bir API dokümantasyon sitesini düşünün. Farklı sürümlerin farklı bileşen yapıları veya özellik setleri olabilir:

```ts
import {Routes, UrlSegment, UrlMatchResult} from '@angular/router';

export function versionMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  // /v1/docs, /v2.1/docs, /v3.0.1/docs gibi kalıpları eşleştir
  if (segments.length >= 2 && segments[0].path.match(/^v\d+(\.\d+)*$/)) {
    return {
      consumed: segments.slice(0, 2), // Sürüm ve 'docs' segmentlerini tüket
      posParams: {
        version: segments[0], // Sürümü parametre olarak kullanılabilir yap
        section: segments[1], // Bölümü de kullanılabilir yap
      },
    };
  }
  return null;
}

// Rota yapılandırması
export const routes: Routes = [
  {
    matcher: versionMatcher,
    component: Documentation,
  },
  {
    path: 'latest/docs',
    redirectTo: 'v3/docs',
  },
];
```

Bileşen, çıkarılan parametreleri rota girişleri aracılığıyla alır:

```angular-ts
import {Component, input, inject} from '@angular/core';
import {resource} from '@angular/core';

@Component({
  selector: 'app-documentation',
  template: `
    @if (documentation.isLoading()) {
      <div>Loading documentation...</div>
    } @else if (documentation.error()) {
      <div>Error loading documentation</div>
    } @else if (documentation.value(); as docs) {
      <article>{{ docs.content }}</article>
    }
  `,
})
export class Documentation {
  // Rota parametreleri otomatik olarak sinyal girişlerine bağlanır
  version = input.required<string>(); // Sürüm parametresini alır
  section = input.required<string>(); // Bölüm parametresini alır

  private docsService = inject(DocumentationService);

  // Resource, sürüm veya bölüm değiştiğinde dokümantasyonu otomatik olarak yükler
  documentation = resource({
    params: () => {
      if (!this.version() || !this.section()) return;

      return {
        version: this.version(),
        section: this.section(),
      };
    },
    loader: ({params}) => {
      return this.docsService.loadDocumentation(params.version, params.section);
    },
  });
}
```

### Yerel ayar duyarlı yönlendirme

Uluslararası uygulamalar genellikle URL'lerde yerel ayar bilgisi kodlar. Özel bir eşleştirici, yerel ayar kodlarını çıkarabilir ve yerel ayarı parametre olarak kullanılabilir hale getirirken uygun bileşenlere yönlendirebilir:

```ts
// Desteklenen yerel ayarlar
const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh'];

export function localeMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length > 0) {
    const potentialLocale = segments[0].path;

    if (locales.includes(potentialLocale)) {
      // Bu bir yerel ayar önekidir, tüket ve eşleştirmeye devam et
      return {
        consumed: [segments[0]],
        posParams: {
          locale: segments[0],
        },
      };
    } else {
      // Yerel ayar öneki yok, varsayılan yerel ayarı kullan
      return {
        consumed: [], // Hiçbir segmenti tüketme
        posParams: {
          locale: new UrlSegment('en', {}),
        },
      };
    }
  }

  return null;
}
```

### Karmaşık iş mantığı eşleştirme

Özel eşleştiriciler, yol kalıplarında ifade edilmesi garip olacak iş kurallarını uygulamada mükemmeldir. Ürün URL'lerinin ürün türüne göre farklı kalıpları takip ettiği bir e-ticaret sitesini düşünün:

```ts
export function productMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length === 0) return null;

  const firstSegment = segments[0].path;

  // Kitaplar: /isbn-1234567890
  if (firstSegment.startsWith('isbn-')) {
    return {
      consumed: [segments[0]],
      posParams: {
        productType: new UrlSegment('book', {}),
        identifier: new UrlSegment(firstSegment.substring(5), {}),
      },
    };
  }

  // Elektronik: /sku/ABC123
  if (firstSegment === 'sku' && segments.length > 1) {
    return {
      consumed: segments.slice(0, 2),
      posParams: {
        productType: new UrlSegment('electronics', {}),
        identifier: segments[1],
      },
    };
  }

  // Giyim: /style/BRAND/ITEM
  if (firstSegment === 'style' && segments.length > 2) {
    return {
      consumed: segments.slice(0, 3),
      posParams: {
        productType: new UrlSegment('clothing', {}),
        brand: segments[1],
        identifier: segments[2],
      },
    };
  }

  return null;
}
```

### Özel eşleştiriciler için performans değerlendirmeleri

Özel eşleştiriciler, bir eşleşme bulunana kadar her navigasyon girişiminde çalışır. Sonuç olarak, karmaşık eşleştirme mantığı, özellikle birçok rotası olan uygulamalarda navigasyon performansını etkileyebilir. Eşleştiricileri odaklı ve verimli tutun:

- Eşleşme imkansız olduğunda erken dönün
- API çağrıları veya karmaşık düzenli ifadeler gibi pahalı işlemlerden kaçının
- Tekrarlanan URL kalıpları için sonuçları önbelleğe almayı düşünün

Özel eşleştiriciler karmaşık yönlendirme gereksinimlerini zarif bir şekilde çözerken, aşırı kullanım rota yapılandırmasını anlamayı ve sürdürmeyi zorlaştırabilir. Özel eşleştiricileri, standart yol eşleştirmenin gerçekten yetersiz kaldığı senaryolar için saklayın.
