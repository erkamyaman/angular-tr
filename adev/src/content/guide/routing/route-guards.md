# Control route access with guards

CRITICAL: İstemci tarafı koruyucularına erişim kontrolünün tek kaynağı olarak asla güvenmeyin. Web tarayıcısında çalışan tüm JavaScript, tarayıcıyı çalıştıran kullanıcı tarafından değiştirilebilir. İstemci tarafı koruyucularına ek olarak, kullanıcı yetkilendirmesini her zaman sunucu tarafında uygulayın.

Rota koruyucuları, bir kullanıcının belirli bir rotaya gidip gidemeyeceğini veya rotadan ayrılıp ayrılamayacağını kontrol eden fonksiyonlardır. Bunlar, kullanıcının belirli rotalara erişip erişemeyeceğini yöneten kontrol noktaları gibidir. Rota koruyucularının yaygın kullanım örnekleri arasında kimlik doğrulama ve erişim kontrolü yer alır.

## Creating a route guard

Angular CLI kullanarak bir rota koruyucusu oluşturabilirsiniz:

```bash
ng generate guard CUSTOM_NAME
```

Bu, hangi [rota koruyucusu türünü](#types-of-route-guards) kullanacağınızı seçmenizi isteyecek ve ardından ilgili `CUSTOM_NAME-guard.ts` dosyasını oluşturacaktır.

TIP: Angular projenizde ayrı bir TypeScript dosyası oluşturarak da elle bir rota koruyucusu oluşturabilirsiniz. Geliştiriciler genellikle dosyayı diğer dosyalardan ayırt etmek için dosya adına `-guard.ts` son eki ekler.

## Route guard return types

Tüm rota koruyucuları aynı olası dönüş türlerini paylaşır. Bu, navigasyonu nasıl kontrol ettiğiniz konusunda esneklik sağlar:

| Dönüş türleri                     | Açıklama                                                                                |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| `boolean`                         | `true` navigasyona izin verir, `false` engeller (`CanMatch` koruyucusu için nota bakın) |
| `UrlTree` veya `RedirectCommand`  | Engellemek yerine başka bir rotaya yönlendirir                                          |
| `Promise<T>` veya `Observable<T>` | Yönlendirici ilk yayılan değeri kullanır ve ardından abonelikten çıkar                  |

NOTE: `CanMatch` farklı davranır — `false` döndürdüğünde, Angular navigasyonu tamamen engellemek yerine diğer eşleşen rotaları dener.

## Types of route guards

Angular, her biri farklı amaçlara hizmet eden dört tür rota koruyucusu sağlar:

<docs-pill-row>
  <docs-pill href="#canactivate" title="CanActivate"/>
  <docs-pill href="#canactivatechild" title="CanActivateChild"/>
  <docs-pill href="#candeactivate" title="CanDeactivate"/>
  <docs-pill href="#canmatch" title="CanMatch"/>
</docs-pill-row>

Tüm koruyucular, [rota düzeyinde sağlanan servislere](guide/di/defining-dependency-providers#route-providers) ve `route` argümanı aracılığıyla rotaya özgü bilgilere erişebilir.

### CanActivate

`CanActivate` koruyucusu, bir kullanıcının bir rotaya erişip erişemeyeceğini belirler. En yaygın olarak kimlik doğrulama ve yetkilendirme için kullanılır.

Aşağıdaki varsayılan argümanlara erişimi vardır:

- `route`: `ActivatedRouteSnapshot` - Etkinleştirilen rota hakkında bilgi içerir
- `state`: `RouterStateSnapshot` - Yönlendiricinin geçerli durumunu içerir

[Standart koruyucu dönüş türlerini](#route-guard-return-types) döndürebilir.

```ts
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

Tip: Kullanıcıyı yönlendirmeniz gerekiyorsa, bir [`URLTree`](api/router/UrlTree) veya [`RedirectCommand`](api/router/RedirectCommand) döndürün. `false` döndürüp ardından programatik olarak kullanıcıyı `navigate` etmeyin.

Daha fazla bilgi için [CanActivateFn API dokümanlarına](api/router/CanActivateFn) göz atın.

### CanActivateChild

`CanActivateChild` koruyucusu, bir kullanıcının belirli bir üst rotanın alt rotalarına erişip erişemeyeceğini belirler. Bu, iç içe rotaların tüm bir bölümünü korumak istediğinizde kullanışlıdır. Başka bir deyişle, `canActivateChild` _tüm_ alt rotalar için çalışır. Altında başka bir alt bileşen bulunan bir alt bileşen varsa, `canActivateChild` her iki bileşen için de bir kez çalışır.

Aşağıdaki varsayılan argümanlara erişimi vardır:

- `childRoute`: `ActivatedRouteSnapshot` - Etkinleştirilen alt rotanın "gelecek" anlık görüntüsü (yani yönlendiricinin navigasyon yapmaya çalıştığı durum) hakkında bilgi içerir
- `state`: `RouterStateSnapshot` - Yönlendiricinin geçerli durumunu içerir

[Standart koruyucu dönüş türlerini](#route-guard-return-types) döndürebilir.

```ts
export const adminChildGuard: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  return authService.hasRole('admin');
};
```

Daha fazla bilgi için [CanActivateChildFn API dokümanlarına](api/router/CanActivateChildFn) göz atın.

### CanDeactivate

`CanDeactivate` koruyucusu, bir kullanıcının bir rotadan ayrılıp ayrılamayacağını belirler. Yaygın bir senaryo, kaydedilmemiş formlardan navigasyonu önlemektir.

Aşağıdaki varsayılan argümanlara erişimi vardır:

- `component`: `T` - Devre dışı bırakılan bileşen örneği
- `currentRoute`: `ActivatedRouteSnapshot` - Geçerli rota hakkında bilgi içerir
- `currentState`: `RouterStateSnapshot` - Geçerli yönlendirici durumunu içerir
- `nextState`: `RouterStateSnapshot` - Navigasyon yapılan sonraki yönlendirici durumunu içerir

[Standart koruyucu dönüş türlerini](#route-guard-return-types) döndürebilir.

```ts
export const unsavedChangesGuard: CanDeactivateFn<Form> = (
  component: Form,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot,
) => {
  return component.hasUnsavedChanges()
    ? confirm('You have unsaved changes. Are you sure you want to leave?')
    : true;
};
```

Daha fazla bilgi için [CanDeactivateFn API dokümanlarına](api/router/CanDeactivateFn) göz atın.

### CanMatch

`CanMatch` koruyucusu, yol eşleştirme sırasında bir rotanın eşleşip eşleşemeyeceğini belirler. Diğer koruyuculardan farklı olarak, reddedilme navigasyonu tamamen engellemek yerine diğer eşleşen rotaları denemeye geçer. Bu, özellik bayrakları, A/B testi veya koşullu rota yüklemesi için yararlı olabilir.

Aşağıdaki varsayılan argümanlara erişimi vardır:

- `route`: `Route` - Değerlendirilen rota yapılandırması
- `segments`: `UrlSegment[]` - Önceki üst rota değerlendirmeleri tarafından tüketilmemiş URL segmentleri

[Standart koruyucu dönüş türlerini](#route-guard-return-types) döndürebilir, ancak `false` döndürdüğünde Angular navigasyonu tamamen engellemek yerine diğer eşleşen rotaları dener.

```ts
export const featureToggleGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const featureService = inject(FeatureService);
  return featureService.isFeatureEnabled('newDashboard');
};
```

Aynı yol için farklı bileşenler kullanmanıza da olanak tanır.

```ts
// 📄 routes.ts
const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboard,
    canMatch: [adminGuard],
  },
  {
    path: 'dashboard',
    component: UserDashboard,
    canMatch: [userGuard],
  },
];
```

Bu örnekte, kullanıcı `/dashboard` adresini ziyaret ettiğinde, doğru koruyucuyla eşleşen ilk rota kullanılır.

Daha fazla bilgi için [CanMatchFn API dokümanlarına](api/router/CanMatchFn) göz atın.

## Applying guards to routes

Rota koruyucularınızı oluşturduktan sonra, bunları rota tanımlarınızda yapılandırmanız gerekir.

Koruyucular, tek bir rotaya birden fazla koruyucu uygulamanıza olanak tanımak için rota yapılandırmasında dizi olarak belirtilir. Dizide göründükleri sırayla çalıştırılırlar.

```ts
import {Routes} from '@angular/router';
import {authGuard} from './guards/auth.guard';
import {adminGuard} from './guards/admin.guard';
import {canDeactivateGuard} from './guards/can-deactivate.guard';
import {featureToggleGuard} from './guards/feature-toggle.guard';

const routes: Routes = [
  // Basic CanActivate - requires authentication
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },

  // Multiple CanActivate guards - requires authentication AND admin role
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard, adminGuard],
  },

  // CanActivate + CanDeactivate - protected route with unsaved changes check
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },

  // CanActivateChild - protects all child routes
  {
    path: 'users', // /user - NOT protected
    canActivateChild: [authGuard],
    children: [
      // /users/list - PROTECTED
      {path: 'list', component: UserList},
      // /users/detail/:id - PROTECTED
      {path: 'detail/:id', component: UserDetail},
    ],
  },

  // CanMatch - conditionally matches route based on feature flag
  {
    path: 'beta-feature',
    component: BetaFeature,
    canMatch: [featureToggleGuard],
  },

  // Fallback route if beta feature is disabled
  {
    path: 'beta-feature',
    component: ComingSoon,
  },
];
```
