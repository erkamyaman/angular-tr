# Testing routing and navigation

Yönlendirme ve navigasyonu test etmek, kullanıcılar farklı rotalar arasında gezindiğinde uygulamanızın doğru şekilde davrandığından emin olmak için gereklidir. Bu kılavuz, Angular uygulamalarında yönlendirme işlevselliğini test etmek için çeşitli stratejileri kapsar.

## Prerequisites

Bu kılavuz, aşağıdaki araçlar ve kütüphanelerle tanıdık olduğunuzu varsayar:

- **[Vitest](https://vitest.dev/)** - Test söz dizimini (`describe`, `it`, `expect`) sağlayan JavaScript test framework'ü
- **[Angular Testing Utilities](guide/testing)** - Angular'ın yerleşik test araçları ([`TestBed`](api/core/testing/TestBed), [`ComponentFixture`](api/core/testing/ComponentFixture))
- **[`RouterTestingHarness`](api/router/testing/RouterTestingHarness)** - Yerleşik navigasyon ve bileşen test yetenekleriyle yönlendirilen bileşenleri test etmek için test aracı

## Testing scenarios

### Route parameters

Bileşenler genellikle veri çekmek için URL'deki rota parametrelerine bağımlıdır, örneğin profil sayfası için bir kullanıcı kimliği.

Aşağıdaki örnek, rotadan bir kullanıcı kimliği görüntüleyen bir `UserProfile` bileşeninin nasıl test edileceğini gösterir.

```ts { header: 'user-profile.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {UserProfile} from './user-profile';

describe('UserProfile', () => {
  it('should display user ID from route parameters', async () => {
    TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [provideRouter([{path: 'user/:id', component: UserProfile}])],
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/user/123', UserProfile);

    expect(harness.routeNativeElement?.textContent).toContain('User Profile: 123');
  });
});
```

```angular-ts {header: 'user-profile.ts'}
import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: '<h1>User Profile: {{userId}}</h1>',
})
export class UserProfile {
  private route = inject(ActivatedRoute);
  userId: string | null = this.route.snapshot.paramMap.get('id');
}
```

### Route guards

Rota koruyucuları, kimlik doğrulama veya izinler gibi koşullara göre rotalara erişimi kontrol eder. Koruyucuları test ederken, bağımlılıkları taklit etmeye ve navigasyon sonuçlarını doğrulamaya odaklanın.

Aşağıdaki örnek, kimliği doğrulanmış kullanıcılar için navigasyona izin veren ve doğrulanmamış kullanıcıları giriş sayfasına yönlendiren bir `authGuard`'ı test eder.

```ts {header: 'auth.guard.spec.ts'}
import {vi, type Mocked} from 'vitest';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter, Router} from '@angular/router';
import {authGuard} from './auth.guard';
import {AuthStore} from './auth-store';
import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';

@Component({template: '<h1>Protected Page</h1>'})
class Protected {}

@Component({template: '<h1>Login Page</h1>'})
class Login {}

describe('authGuard', () => {
  let authStore: Mocked<AuthStore>;
  let harness: RouterTestingHarness;

  async function setup(isAuthenticated: boolean) {
    authStore = {isAuthenticated: vi.fn().mockReturnValue(isAuthenticated)} as Mocked<AuthStore>;

    TestBed.configureTestingModule({
      providers: [
        {provide: AuthStore, useValue: authStore},
        provideRouter([
          {path: 'protected', component: Protected, canActivate: [authGuard]},
          {path: 'login', component: Login},
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  }

  it('allows navigation when user is authenticated', async () => {
    await setup(true);
    await harness.navigateByUrl('/protected', Protected);
    // The protected component should render when authenticated
    expect(harness.routeNativeElement?.textContent).toContain('Protected Page');
  });

  it('redirects to login when user is not authenticated', async () => {
    await setup(false);
    await harness.navigateByUrl('/protected', Login);
    // The login component should render after redirect
    expect(harness.routeNativeElement?.textContent).toContain('Login Page');
  });
});
```

```ts {header: 'auth.guard.ts'}
import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthStore} from './auth-store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  return authStore.isAuthenticated() ? true : router.parseUrl('/login');
};
```

### Router outlets

Router outlet testleri, esasen [`Router`](api/router/Router), outlet ve görüntülenen bileşenler arasındaki entegrasyonu test ettiğiniz için daha çok bir entegrasyon testidir.

İşte farklı rotalar için farklı bileşenlerin görüntülendiğini doğrulayan bir testin nasıl kurulacağına dair bir örnek:

```ts {header: 'app.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {Component} from '@angular/core';
import {App} from './app';

@Component({
  template: '<h1>Home Page</h1>',
})
class MockHome {}

@Component({
  template: '<h1>About Page</h1>',
})
class MockAbout {}

describe('App Router Outlet', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          {path: '', component: MockHome},
          {path: 'about', component: MockAbout},
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should display home component for default route', async () => {
    await harness.navigateByUrl('');

    expect(harness.routeNativeElement?.textContent).toContain('Home Page');
  });

  it('should display about component for about route', async () => {
    await harness.navigateByUrl('/about');

    expect(harness.routeNativeElement?.textContent).toContain('About Page');
  });
});
```

```angular-ts {header: 'app.ts'}
import {Component} from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/about">About</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
```

### Nested routes

İç içe rotaları test etmek, iç içe URL'lere navigasyon yapıldığında hem üst hem de alt bileşenlerin doğru şekilde render edilmesini sağlar. Bu, iç içe rotalar birden fazla katman içerdiği için önemlidir.

Doğrulamanız gerekenler:

1. Üst bileşenin düzgün render edilmesi.
2. Alt bileşenin içinde render edilmesi.
3. Her iki bileşenin ilgili rota verilerine erişebildiğinden emin olunması.

İşte bir üst-alt rota yapısını test etmeye dair bir örnek:

```ts {header: 'nested-routes.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {Parent, Child} from './nested-components';

describe('Nested Routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Parent, Child],
      providers: [
        provideRouter([
          {
            path: 'parent',
            component: Parent,
            children: [{path: 'child', component: Child}],
          },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should render parent and child components for nested route', async () => {
    await harness.navigateByUrl('/parent/child');

    expect(harness.routeNativeElement?.textContent).toContain('Parent Component');
    expect(harness.routeNativeElement?.textContent).toContain('Child Component');
  });
});
```

```angular-ts {header: 'nested.ts'}
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  imports: [RouterOutlet],
  template: `
    <h1>Parent Component</h1>
    <router-outlet />
  `,
})
export class Parent {}

@Component({
  template: '<h2>Child Component</h2>',
})
export class Child {}
```

### Query parameters and fragments

Sorgu parametreleri (`?search=angular&category=web` gibi) ve URL fragment'ları (`#section1` gibi), hangi bileşenin yükleneceğini etkilemeyen ancak bileşenin nasıl davranacağını etkileyen URL aracılığıyla ek veri sağlar. [`ActivatedRoute.queryParams`](api/router/ActivatedRoute#queryParams) aracılığıyla sorgu parametrelerini okuyan bileşenlerin, farklı parametre senaryolarını doğru şekilde yönettiğinden emin olmak için test edilmeleri gerekir.

Rota tanımının bir parçası olan rota parametrelerinin aksine, sorgu parametreleri isteğe bağlıdır ve rota navigasyonunu tetiklemeden değişebilir. Bu, hem ilk yüklemeyi hem de sorgu parametreleri değiştiğinde reaktif güncellemeleri test etmeniz gerektiği anlamına gelir.

İşte sorgu parametrelerini ve fragment'ları test etmeye dair bir örnek:

```ts {header: 'search.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {Router, provideRouter} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {Search} from './search';

describe('Search', () => {
  let component: Search;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Search],
      providers: [provideRouter([{path: 'search', component: Search}])],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should read search term from query parameters', async () => {
    component = await harness.navigateByUrl('/search?q=angular', Search);

    expect(component.searchTerm()).toBe('angular');
  });
});
```

```angular-ts {header: 'search.ts'}
import {Component, inject, computed} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  template: '<div>Search term: {{searchTerm()}}</div>',
})
export class Search {
  private route = inject(ActivatedRoute);
  private queryParams = toSignal(this.route.queryParams, {initialValue: {}});

  searchTerm = computed(() => this.queryParams()['q'] || null);
}
```

## Best practices for router testing

1. **RouterTestingHarness kullanın** - Yönlendirilen bileşenleri test etmek için, daha temiz bir API sağlayan ve test host bileşenleri ihtiyacını ortadan kaldıran [`RouterTestingHarness`](api/router/testing/RouterTestingHarness) kullanın. Doğrudan bileşen erişimi, yerleşik navigasyon ve daha iyi tür güvenliği sunar. Ancak, adlandırılmış outlet'leri test etme gibi bazı senaryolar için uygun olmayabilir ve özel host bileşenleri oluşturmanız gerekebilir.
2. **Harici bağımlılıkları özenle yönetin** - Daha gerçekçi testler için mümkünse gerçek uygulamaları tercih edin. Gerçek uygulamalar mümkün değilse (örn. harici API'ler), gerçek davranışa yaklaşan sahte nesneler kullanın. Mock veya stub'ları yalnızca son çare olarak kullanın, çünkü testleri kırılgan ve daha az güvenilir yapabilirler.
3. **Navigasyon durumunu test edin** - Hem navigasyon eylemini hem de sonuçta ortaya çıkan uygulama durumunu, URL değişiklikleri ve bileşen render'ı dahil olmak üzere doğrulayın.
4. **Asenkron işlemleri yönetin** - Router navigasyonu asenkrondur. Testlerinizde zamanlamayı düzgün yönetmek için `async/await` kullanın.
5. **Hata senaryolarını test edin** - Uygulamanızın uç durumları nazikçe yönettiğinden emin olmak için geçersiz rotalar, başarısız navigasyon ve koruyucu redleri için testler ekleyin.
6. **Angular Router'ı taklit etmeyin** - Bunun yerine, gerçek rota yapılandırmaları sağlayın ve navigasyon yapmak için harness'ı kullanın. Bu, testlerinizi daha sağlam yapar ve dahili Angular güncellemelerinde kırılma olasılığını azaltır, ayrıca mock'lar kırıcı değişiklikleri gizleyebildiğinden yönlendirici güncellendiğinde gerçek sorunları yakalamanızı sağlar.
