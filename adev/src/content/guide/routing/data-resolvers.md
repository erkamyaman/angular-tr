# Veri Resolver'ları

Veri çözücüler, bir rotaya navigasyon yapmadan önce veri çekmenize olanak tanır ve bileşenlerinizin render edilmeden önce ihtiyaç duydukları verileri almasını sağlar. Bu, yükleme durumları ihtiyacını önlemeye ve temel verileri önceden yükleyerek kullanıcı deneyimini iyileştirmeye yardımcı olabilir.

## Veri resolver'ları nedir?

Veri çözücü, `ResolveFn` fonksiyonunu uygulayan bir servistir. Bir rota etkinleştirilmeden önce çalışır ve API'lerden, veritabanlarından veya diğer kaynaklardan veri çekebilir. Çözümlenen veri, `ActivatedRoute` aracılığıyla bileşen tarafından kullanılabilir hale gelir.

Veri çözücüler, [rota düzeyinde sağlanan servislere](guide/di/defining-dependency-providers#rota-providerları) ve `route` argümanı aracılığıyla rotaya özgü bilgilere erişebilir.

## Veri resolver'ları neden kullanılır?

Veri çözücüler yaygın yönlendirme sorunlarını çözer:

- **Boş durumları önleme**: Bileşenler yüklendiğinde verileri anında alır
- **Daha iyi kullanıcı deneyimi**: Kritik veriler için yükleme göstergeleri gerekmez
- **Hata yönetimi**: Veri çekme hatalarını navigasyondan önce yönetin
- **Veri tutarlılığı**: SSR için önemli olan, render etmeden önce gerekli verilerin mevcut olmasını sağlayın

## Resolver oluşturma

`ResolveFn` türünde bir fonksiyon yazarak bir çözücü oluşturursunuz.

Parametre olarak `ActivatedRouteSnapshot` ve `RouterStateSnapshot` alır.

İşte [`inject`](api/core/inject) fonksiyonunu kullanarak bir rotayı render etmeden önce kullanıcı bilgilerini alan bir çözücü:

```ts
import {inject} from '@angular/core';
import {UserStore, SettingsStore} from './user-store';
import type {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import type {User, Settings} from './types';

export const userResolver: ResolveFn<User> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  return userStore.getUser(userId);
};

export const settingsResolver: ResolveFn<Settings> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const settingsStore = inject(SettingsStore);
  const userId = route.paramMap.get('id')!;
  return settingsStore.getUserSettings(userId);
};
```

## Route'ları resolver'lar ile yapılandırma

Bir rotaya bir veya daha fazla veri çözücü eklemek istediğinizde, rota yapılandırmasındaki `resolve` anahtarı altına ekleyebilirsiniz. `Routes` türü, rota yapılandırmaları için yapıyı tanımlar:

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'user/:id',
    component: UserDetail,
    resolve: {
      user: userResolver,
      settings: settingsResolver,
    },
  },
];
```

[`resolve` yapılandırması hakkında API dokümanlarından](api/router/Route#resolve) daha fazla bilgi edinebilirsiniz.

## Bileşenlerde çözümlenmiş verilere erişme

### ActivatedRoute kullanma

Çözümlenen verilere, `ActivatedRoute`'tan `signal` fonksiyonunu kullanarak anlık görüntü verilerine erişerek bir bileşende ulaşabilirsiniz:

```angular-ts
import {Component, inject, computed} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import type {User, Settings} from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `,
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  user = computed(() => this.data().user as User);
  settings = computed(() => this.data().settings as Settings);
}
```

### withComponentInputBinding kullanma

Çözümlenen verilere erişmenin farklı bir yaklaşımı, yönlendiricinizi `provideRouter` ile yapılandırırken `withComponentInputBinding()` kullanmaktır. Bu, çözümlenen verilerin doğrudan bileşen girişleri olarak aktarılmasına olanak tanır:

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {routes} from './app.routes';

bootstrapApplication(App, {
  providers: [provideRouter(routes, withComponentInputBinding())],
});
```

Bu yapılandırma ile, `input` fonksiyonu ve zorunlu girişler için `input.required` kullanarak çözücü anahtarlarıyla eşleşen girişleri bileşeninizde tanımlayabilirsiniz:

```angular-ts
import {Component, input} from '@angular/core';
import type {User, Settings} from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `,
})
export class UserDetail {
  user = input.required<User>();
  settings = input.required<Settings>();
}
```

Bu yaklaşım daha iyi tür güvenliği sağlar ve yalnızca çözümlenen verilere erişmek için `ActivatedRoute` enjekte etme ihtiyacını ortadan kaldırır.

## Resolver'larda hata yönetimi

Navigasyon hatalarında, veri çözücülerinizde hataları nazikçe yönetmek önemlidir. Aksi takdirde, bir `NavigationError` oluşur ve geçerli rotaya navigasyon başarısız olur, bu da kullanıcılarınız için kötü bir deneyime yol açar.

Veri çözücülerle hataları yönetmenin üç temel yolu vardır:

1. Hata yönetimini `withNavigationErrorHandler` ile merkezileştirme
2. Router olaylarına abonelik aracılığıyla hataları yönetme
3. Hataları doğrudan çözücüde yönetme

### `withNavigationErrorHandler` ile hata yönetimini merkezileştirme

[`withNavigationErrorHandler`](api/router/withNavigationErrorHandler) özelliği, başarısız veri çözücülerden kaynaklananlar dahil tüm navigasyon hatalarını yönetmenin merkezi bir yolunu sağlar. Bu yaklaşım, hata yönetimi mantığını tek bir yerde tutar ve çözücüler arasında tekrarlanan hata yönetimi kodunu önler.

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withNavigationErrorHandler} from '@angular/router';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {routes} from './app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(
      routes,
      withNavigationErrorHandler((error) => {
        const router = inject(Router);

        if (error?.message) {
          console.error('Navigation error occurred:', error.message);
        }

        router.navigate(['/error']);
      }),
    ),
  ],
});
```

Bu yapılandırma ile çözücüleriniz veri çekmeye odaklanabilirken merkezi işleyicinin hata senaryolarını yönetmesine izin verebilirsiniz:

```ts
export const userResolver: ResolveFn<User> = (route) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  // Açık hata yönetimi gerekli değil - hatanın yukarı çıkmasına izin ver
  return userStore.getUser(userId);
};
```

### Router olaylarına abonelik aracılığıyla hataları yönetme

Çözücü hatalarını, router olaylarına abone olarak ve `NavigationError` olaylarını dinleyerek de yönetebilirsiniz. Bu yaklaşım, hata yönetimi üzerinde daha ayrıntılı kontrol sağlar ve özel hata kurtarma mantığı uygulamanıza olanak tanır.

```angular-ts
import {Component, inject, signal} from '@angular/core';
import {Router, NavigationError} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="retryNavigation()">Retry</button>
      </div>
    }
    <router-outlet />
  `,
})
export class App {
  private router = inject(Router);
  private lastFailedUrl = signal('');

  private navigationErrors = toSignal(
    this.router.events.pipe(
      map((event) => {
        if (event instanceof NavigationError) {
          this.lastFailedUrl.set(event.url);

          if (event.error) {
            console.error('Navigation error', event.error);
          }

          return 'Navigation failed. Please try again.';
        }
        return '';
      }),
    ),
    {initialValue: ''},
  );

  errorMessage = this.navigationErrors;

  retryNavigation() {
    if (this.lastFailedUrl()) {
      this.router.navigateByUrl(this.lastFailedUrl());
    }
  }
}
```

Bu yaklaşım özellikle şu durumlarda yararlıdır:

- Başarısız navigasyon için özel yeniden deneme mantığı uygulamak
- Hata türüne göre belirli hata mesajları göstermek
- Analitik amaçlarla navigasyon hatalarını izlemek

### Hataları doğrudan resolver'da yönetme

İşte hatayı kaydeden ve `Router` servisini kullanarak genel `/users` sayfasına geri yönlendiren güncellenmiş bir `userResolver` örneği:

```ts
import {inject} from '@angular/core';
import {ResolveFn, RedirectCommand, Router} from '@angular/router';
import {catchError, of, EMPTY} from 'rxjs';
import {UserStore} from './user-store';
import type {User} from './types';

export const userResolver: ResolveFn<User | RedirectCommand> = (route) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const userId = route.paramMap.get('id')!;

  return userStore.getUser(userId).pipe(
    catchError((error) => {
      console.error('Failed to load user:', error);
      return of(new RedirectCommand(router.parseUrl('/users')));
    }),
  );
};
```

## Navigasyon yükleme değerlendirmeleri

Veri çözücüler bileşenler içindeki yükleme durumlarını önlese de, farklı bir UX değerlendirmesi ortaya çıkarır: çözücüler çalışırken navigasyon engellenir. Özellikle yavaş ağ isteklerinde, kullanıcılar bir bağlantıya tıklama ile yeni rotayı görme arasında gecikmeler yaşayabilir.

### Navigasyon geri bildirimi sağlama

Çözücü çalışması sırasında kullanıcı deneyimini iyileştirmek için router olaylarını dinleyebilir ve yükleme göstergeleri gösterebilirsiniz:

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

Bu yaklaşım, çözücüler veri çekerken kullanıcıların navigasyonun devam ettiğine dair görsel geri bildirim almasını sağlar.

## En iyi uygulamalar

- **Çözücüleri hafif tutun**: Çözücüler yalnızca temel verileri çekmeli, sayfanın ihtiyaç duyabileceği her şeyi değil
- **Hataları yönetin**: Kullanıcılara mümkün olan en iyi deneyimi sunmak için hataları her zaman nazikçe yönetmeyi unutmayın
- **Önbellek kullanın**: Performansı artırmak için çözümlenen verileri önbelleğe almayı düşünün
- **Navigasyon UX'ini düşünün**: Veri çekme sırasında navigasyon engellendiğinden çözücü çalışması için yükleme göstergeleri uygulayın
- **Makul zaman aşımları belirleyin**: Navigasyonu süresiz olarak engelleyebilecek çözücülerden kaçının
- **Tür güvenliği**: Çözümlenen veriler için TypeScript arayüzleri kullanın

## Alt resolver'larda üst çözümlenmiş verileri okuma

Çözücüler üst rotadan alt rotaya doğru çalışır. Bir üst rota bir çözücü tanımladığında, çözümlenen veriler daha sonra çalışan alt çözücüler tarafından kullanılabilir.

```ts
import { inject } from '@angular/core';
import { provideRouter , ActivatedRouteSnapshot } from '@angular/router';
import { userResolver } from './resolvers';
import { UserPosts } from './pages';
import { PostService } from './services',
import type { User } from './types';

provideRouter([
  {
    path: 'users/:id',
    resolve: { user: userResolver }, // üst rotadaki user resolver
    children: [
      {
        path: 'posts',
        component: UserPosts,
        // Bu resolver çalışırken route.data.user burada kullanılabilir
        resolve: {
          posts: (route: ActivatedRouteSnapshot) => {
            const postService = inject(PostService);
            const user = route.parent?.data['user'] as User; // üst rota verisi
            const userId = user.id;
            return postService.getPostByUser(userId);
          },
        },
      },
    ],
  },
]);
```
