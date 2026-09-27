# Resource'lar ile veri çekme

Angular Router, `resources` rota yapılandırması aracılığıyla Angular sinyalleriyle entegre olur. Bu, `Resource` API'lerini kullanarak verileri reaktif olarak çekmenize olanak tanır.

## Neden rota resource'ları kullanılır? {#why-use-route-resources}

Rota resource'ları, geleneksel [veri resolver'larına](/guide/routing/data-resolvers) göre çeşitli avantajlar sunar:

- **Paralel yürütme**: Eşleşen tüm rotalardaki rota resource'ları, her seferinde tek bir rota yerine eşzamanlı olarak yüklenir.
- **Engellemeyen veri yükleme**: Rotayı hemen etkinleştirmek ve veriler arka planda yüklenirken yükleme iskeletlerini veya UI durumlarını render etmek için `nonBlocking()` kullanın.
- **Yeniden navigasyon olmadan yenileme**: Guard'ları yeniden çalıştırmadan veya rotaları yeniden eşleştirmeden verileri yenilemek için tek tek resource'lar üzerinde `.reload()` çağırın veya sinyal parametrelerini güncelleyin.
- **Reaktif veri çekme**: Resource'lar doğrudan Angular sinyalleriyle entegre olur, sinyal bağımlılıkları değiştiğinde otomatik olarak yeniden değerlendirilir ve `isLoading()` ile `error()` gibi reaktif durum sinyallerini sunar.

## Rota resource'larını etkinleştirme {#enabling-route-resources}

Rota resource'larını etkinleştirmek için router yapılandırmanıza `withRouterResources()` sağlayın:

```ts
import {provideRouter, withComponentInputBinding, withRouterResources} from '@angular/router';

bootstrapApplication(App, {
  providers: [provideRouter(routes, withComponentInputBinding(), withRouterResources())],
});
```

TIP: Router'ın çözümlenen resource'ları doğrudan bileşen input'larına bağlayabilmesi için `withComponentInputBinding()` özelliğini etkinleştirin.

## Rota resource'larını tanımlama {#defining-route-resources}

Bir rota üzerindeki resource'ları `resources` fonksiyonu ile tanımlarsınız. Fonksiyon bir enjeksiyon bağlamında çalışır, bu nedenle servislere, API istemcilerine veya store'lara doğrudan rota tanımı içinden erişmek için `inject()` kullanabilirsiniz.

```angular-ts
import {Component, inject, input, resource} from '@angular/core';
import {Routes} from '@angular/router';
import {UserService} from './user.service';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserProfile,
    resources: (ctx) => {
      const userService = inject(UserService);
      return {
        user: resource({
          params: () => ctx.params()['id'],
          loader: ({params: id}) => userService.getUser(id),
        }),
      };
    },
  },
];

@Component({
  template: `<p>User: {{ user().name }}</p>`,
})
export class UserProfile {
  // Router, engelleyen resource'lar için yalnızca değeri bağlar.
  user = input.required<User>();
}
```

### `ResourceContext` nesnesi {#the-resourcecontext-object}

`resources` fonksiyonu, reaktif rota sinyallerine erişim sağlayan bir `ResourceContext` alır: `params`, `queryParams`, `fragment` ve `data`.

### Desteklenen resource uygulamaları {#supported-resource-implementations}

`resources` fonksiyonu, `resource()`, `rxResource()` veya özel bir resource gibi herhangi bir Angular `Resource` uygulamasını döndürebilir.

```ts
import {Routes} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserProfile,
    resources: (ctx) => ({
      user: rxResource({
        params: () => ctx.params()['id'],
        stream: ({params: id}) => fetchUserObservable(id),
      }),
    }),
  },
];
```

NOTE: `rxResource`, Observable döndüren bir fonksiyonu kabul etmek için `loader` yerine `stream` özelliğini kullanır.

Resource'ları yapılandırmadan önce asenkron bir kurulum veya dinamik import yapmanız gerekiyorsa, `resources` fonksiyonu `async` da olabilir ve bir `Promise` döndürebilir:

```ts
resources: async (ctx) => {
  const {fetchUserData} = await import('./user-api');
  return {
    user: resource({
      params: () => ctx.params()['id'],
      loader: ({params: id}) => fetchUserData(id),
    }),
  };
},
```

## Sinyallerle ayrıntılı değişiklik takibi {#fine-grained-change-tracking-with-signals}

Bir resource, `params` fonksiyonunun okuduğu sinyalleri takip eder. Resource'un yalnızca o değer değiştiğinde yeniden veri çekmesi için tam olarak ihtiyacınız olan değeri okuyun:

```ts
resources: (ctx) => ({
  products: resource({
    // Yalnızca 'category' sorgu parametresini takip eder
    params: () => ctx.queryParams()['category'],
    loader: ({params: category}) => fetchProducts(category),
  }),
}),
```

`?sort=desc` veya `?page=2` gibi ilgisiz bir sorgu parametresini değiştiren bir navigasyon `category` değerini değiştirmez, bu nedenle resource yeniden veri çekmez.

TIP: Parametre nesnesinin tamamını (`ctx.params()` gibi) döndürmek yerine `ctx.params()['id']` gibi belirli özellikleri okuyun. Router her navigasyonda yeni bir nesne oluşturur, bu nedenle nesnenin tamamını döndürmek, tek tek değerler değişmemiş olsa bile resource'un yeniden veri çekmesine neden olur.

## Paralel yürütme {#parallel-execution}

Veri resolver'ları üst rotadan alt rotaya doğru sırayla çalışır. Üst rota resolver'ı 200ms ve alt rota resolver'ı 300ms sürerse, navigasyon 500ms boyunca engellenir.

Eşleşen rota hiyerarşisindeki rota resource'ları eşzamanlı olarak çalışır, bu nedenle aynı navigasyon en yavaş resource'un süresi olan 300ms içinde tamamlanır.

## Engelleyen ve engellemeyen resource'lar {#blocking-and-non-blocking-resources}

Varsayılan olarak, `resources`'tan döndürülen her resource engelleyicidir: router, rotayı ve bileşeni etkinleştirmeden önce verilerin tamamen yüklenmesini bekler.

Engelleyen bir resource için router, çözümlenen değeri bileşen input'una bağlar, bu nedenle input türü `Resource<T>` yerine `T` olur. Router resource yüklenene kadar navigasyonu engellediği için bileşen hiçbir zaman bir `loading` durumu görmez ve resource hata verdiğinde router navigasyonu iptal ettiği için hiçbir zaman bir `error` durumu da görmez.

Bunun yerine yükleme durumlarını UI'da ele almak için resource'u `nonBlocking()` içine sarın. Router bileşeni hemen etkinleştirir ve `Resource<T>` nesnesinin tamamını bileşen input'una bağlar; bu da size `isLoading()`, `error()` ve diğer resource sinyallerine erişim sağlar.

```angular-ts
import {Component, input, Resource, resource} from '@angular/core';
import {Routes, nonBlocking} from '@angular/router';

const routes: Routes = [
  {
    path: 'reports',
    component: Reports,
    resources: () => ({
      reportData: nonBlocking(
        resource({
          loader: () => fetchHeavyReportData(),
        }),
      ),
    }),
  },
];

@Component({
  template: `
    @if (reportData().isLoading()) {
      <p>Loading...</p>
    } @else if (reportData().error()) {
      <p>Error loading report.</p>
    } @else if (reportData().hasValue()) {
      <report-view [data]="reportData().value()" />
    }
  `,
})
export class Reports {
  reportData = input.required<Resource<ReportData>>();
}
```

NOTE: Engelleyen bir resource hata verirse, router navigasyonu iptal eder ve bir `NavigationError` olayı yayar. `nonBlocking()` içine sarılmış bir resource ise navigasyonu tamamlar ve hatayı `error()` sinyali aracılığıyla sunar.

### Bir resource'tan yönlendirme {#redirecting-from-a-resource}

Engelleyen bir resource'un kullanıcıyı yönlendirmesi gerekiyorsa (örneğin, bir öğe bulunamadığında), resource loader'ı içinde bir `RedirectCommand` fırlatın. Router mevcut navigasyonu iptal eder ve belirtilen URL'ye yönlendirir:

```ts
import {inject, resource} from '@angular/core';
import {RedirectCommand, Router, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserProfile,
    resources: (ctx) => {
      const router = inject(Router);

      return {
        user: resource({
          params: () => ctx.params()['id'],
          loader: async ({params: id}) => {
            const user = await fetchUser(id);
            if (!user) {
              throw new RedirectCommand(router.parseUrl('/not-found'));
            }
            return user;
          },
        }),
      };
    },
  },
];
```

## Yeniden navigasyon olmadan resource'ları yenileme {#reloading-resources-without-renavigation}

Veri resolver'larında verileri yeniden çekmek, rotaları yeniden eşleştiren ve guard'ları ile resolver'ları yeniden çalıştıran bir rota navigasyonu gerektirir (örneğin, `onSameUrlNavigation: 'reload'` ile navigasyon yapmak).

Rota resource'ları, verileri yerinde yenilemenin iki yolunu destekler:

1. **Programatik yenileme**: `Resource` örneği üzerinde `.reload()` çağırın.
2. **Reaktif yenileme**: Resource'un `params` fonksiyonunun okuduğu, uygulama filtresi veya durum sinyali gibi bir sinyali güncelleyin; bu, loader'ı yeniden çalıştırır.

Router engelleyen bir resource'un yalnızca değerini bileşen input'una bağladığından, `.reload()` çağırmanız veya durum sinyallerini incelemeniz gerektiğinde `Resource` örneğini `ActivatedRoute` veya `ActivatedRouteSnapshot` üzerinden okuyun:

```angular-ts
import {Component, inject, input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: `
    <p>User: {{ user().name }}</p>
    <button (click)="refreshUser()">Refresh</button>
  `,
})
export class UserProfile {
  user = input.required<User>();
  private userResource = inject(ActivatedRoute).resources?.['user'];

  refreshUser() {
    // Rotayı yeniden navigasyon yapmadan yalnızca bu resource'u yeniler
    this.userResource?.reload();
  }
}
```

## Bekleyen navigasyonlar sırasındaki geçiş durumları {#transitional-states-during-pending-navigations}

Bir navigasyon beklemedeyken router, `ActivatedRoute` üzerinde sunduğu resource'ları dondurur; bu da ara `loading` ve `reloading` durumlarını gizler.

`/user/1` adresinden `/user/2` adresine navigasyon yaparsanız ve router `UserProfile` bileşenini yeniden kullanırsa, bileşen `/user/2` çözümlenene kadar `/user/1` verilerini render etmeye devam eder. Ardından router resource'ların dondurmasını kaldırır ve UI, yükleme titremesi olmadan doğrudan yeni verilere geçer.

Router bu resource'ları, `resources` fonksiyonu `resource()` gibi yazılabilir bir resource döndürse bile salt okunur olarak sunar. Resource sinyallerini okuyabilir ve `reload()` çağırabilirsiniz, ancak `set()` veya `update()` çağıramazsınız. Aktif bir navigasyon veya geri alma kurtarması sırasında yapılan bir `reload()` çağrısı, router'ın geçiş takibini kesintiye uğratamaması için `false` döndürür.

### İptal durumunda geri alma kurtarması {#rollback-recovery-on-cancellation}

Bir navigasyon iptal edilirse (örneğin, bir guard tarafından), router durum ağacını önceki durumuna geri döndürür. Bu geri dönüş, rota parametreleri gibi resource'un sinyal bağımlılıklarının önceki değerlerine dönmesine neden olabilir.

Parametreler eski haline döndüğü için resource, eski parametrelere ait verileri çekmek üzere otomatik olarak yeni bir yükleme tetikleyebilir. Zaten görünür olan veriler için bir yükleme durumunun anlık olarak görünmesini önlemek amacıyla router, resource geri döndürülmüş durumda kararlı hale gelene kadar önceki resource anlık görüntüsünü UI'da tutar.

TIP: Resource loader'ının sağladığı `abortSignal`'ı asenkron çağrılarınıza (`fetch` gibi) iletin. Router parametreleri geri aldığında veya navigasyonların yerini yenileri aldığında, bekleyen istek temiz bir şekilde iptal edilir: `loader: ({params: id, abortSignal}) => fetchUser(id, {signal: abortSignal})`.
