# Redirecting Routes

Rota yönlendirmeleri, kullanıcıları otomatik olarak bir rotadan diğerine yönlendirmenize olanak tanır. Bunu, bir adrese gönderilen postanın farklı bir adrese iletildiği posta yönlendirmesi gibi düşünün. Bu, eski URL'leri yönetmek, varsayılan rotalar uygulamak veya erişim kontrolünü yönetmek için kullanışlıdır.

## How to configure redirects

Rota yapılandırmanızda `redirectTo` özelliği ile yönlendirmeler tanımlayabilirsiniz. Bu özellik bir dize kabul eder.

```ts
import {Routes} from '@angular/router';

const routes: Routes = [
  // Simple redirect
  {path: 'marketing', redirectTo: 'newsletter'},

  // Redirect with path parameters
  {path: 'legacy-user/:id', redirectTo: 'users/:id'},

  // Redirect any other URLs that don't match
  // (also known as a "wildcard" redirect)
  {path: '**', redirectTo: '/login'},
];
```

Bu örnekte üç yönlendirme vardır:

1. Kullanıcı `/marketing` yolunu ziyaret ettiğinde `/newsletter`'a yönlendirilir.
2. Kullanıcı herhangi bir `/legacy-user/:id` yolunu ziyaret ettiğinde ilgili `/users/:id` yoluna yönlendirilir.
3. Kullanıcı yönlendiricide tanımlanmamış herhangi bir yolu ziyaret ettiğinde, `**` joker yol tanımı nedeniyle giriş sayfasına yönlendirilir.

## Understanding `pathMatch`

Rotalardaki `pathMatch` özelliği, geliştiricilerin Angular'ın bir URL'yi rotalarla nasıl eşleştireceğini kontrol etmesini sağlar.

`pathMatch`'in kabul ettiği iki değer vardır:

| Değer      | Açıklama                                         |
| ---------- | ------------------------------------------------ |
| `'full'`   | URL yolunun tamamı tam olarak eşleşmelidir       |
| `'prefix'` | Yalnızca URL'nin başlangıcının eşleşmesi gerekir |

Varsayılan olarak tüm yönlendirmeler `prefix` stratejisini kullanır.

### `pathMatch: 'prefix'`

`pathMatch: 'prefix'` varsayılan stratejidir ve Angular Router'ın bir yönlendirme tetiklerken sonraki tüm rotaları eşleştirmesini istediğinizde idealdir.

```ts
export const routes: Routes = [
  // This redirect route is equivalent to…
  { path: 'news', redirectTo: 'blog },

  // This explicitly defined route redirect pathMatch
  { path: 'news', redirectTo: 'blog', pathMatch: 'prefix' },
];
```

Bu örnekte, `news` ön ekiyle başlayan tüm rotalar `/blog` eşdeğerlerine yönlendirilir. Kullanıcıların eski `news` ön ekini ziyaret ettiğinde yönlendirildiği bazı örnekler:

- `/news` rotası `/blog`'a yönlendirilir
- `/news/article` rotası `/blog/article`'a yönlendirilir
- `/news/article/:id` rotası `/blog/article/:id`'ye yönlendirilir

### `pathMatch: 'full'`

Öte yandan, `pathMatch: 'full'` Angular Router'ın yalnızca belirli bir yolu yönlendirmesini istediğinizde kullanışlıdır.

```ts
export const routes: Routes = [{path: '', redirectTo: '/dashboard', pathMatch: 'full'}];
```

Bu örnekte, kullanıcı kök URL'yi (yani `''`) ziyaret ettiğinde yönlendirici o kullanıcıyı `'/dashboard'` sayfasına yönlendirir.

Sonraki sayfalar (örn. `/login`, `/about`, `/product/id` vb.) yok sayılır ve bir yönlendirme tetiklemez.

TIP: Kök sayfada (yani `"/"` veya `""`) bir yönlendirme yapılandırırken dikkatli olun. `pathMatch: 'full'` ayarlamazsanız, yönlendirici tüm URL'leri yönlendirecektir.

Daha fazla açıklama için, önceki bölümdeki `news` örneği `pathMatch: 'full'` kullansaydı:

```ts
export const routes: Routes = [{path: 'news', redirectTo: '/blog', pathMatch: 'full'}];
```

Bu şu anlama gelir:

1. Yalnızca `/news` yolu `/blog`'a yönlendirilir.
2. `/news/articles` veya `/news/articles/1` gibi sonraki segmentler yeni `/blog` ön ekiyle yönlendirilmez.

## Conditional redirects

`redirectTo` özelliği, kullanıcıların nasıl yönlendirildiğine mantık eklemek için bir fonksiyon da kabul edebilir.

[Fonksiyon](api/router/RedirectFunction), [`ActivatedRouteSnapshot`](api/router/ActivatedRouteSnapshot) verilerinin yalnızca bir kısmına erişebilir çünkü bazı veriler rota eşleştirme aşamasında doğru şekilde bilinmez. Örnekler arasında çözümlenen başlıklar, tembel yüklenen bileşenler vb. bulunur.

Genellikle bir dize veya [`URLTree`](api/router/UrlTree) döndürür, ancak bir observable veya promise de döndürebilir.

İşte kullanıcının günün saatine göre farklı bir menüye yönlendirildiği bir örnek:

```ts
import {Routes} from '@angular/router';
import {Menu} from './menu';

export const routes: Routes = [
  {
    path: 'restaurant/:location/menu',
    redirectTo: (activatedRouteSnapshot) => {
      const location = activatedRouteSnapshot.params['location'];
      const currentHour = new Date().getHours();

      // Check if user requested a specific meal via query parameter
      if (activatedRouteSnapshot.queryParams['meal']) {
        return `/restaurant/${location}/menu/${queryParams['meal']}`;
      }

      // Auto-redirect based on time of day
      if (currentHour >= 5 && currentHour < 11) {
        return `/restaurant/${location}/menu/breakfast`;
      } else if (currentHour >= 11 && currentHour < 17) {
        return `/restaurant/${location}/menu/lunch`;
      } else {
        return `/restaurant/${location}/menu/dinner`;
      }
    },
  },

  // Destination routes
  {path: 'restaurant/:location/menu/breakfast', component: Menu},
  {path: 'restaurant/:location/menu/lunch', component: Menu},
  {path: 'restaurant/:location/menu/dinner', component: Menu},

  // Default redirect
  {path: '', redirectTo: '/restaurant/downtown/menu', pathMatch: 'full'},
];
```

Daha fazla bilgi için [RedirectFunction API dokümanlarına](api/router/RedirectFunction) göz atın.

## Next steps

`redirectTo` özelliği hakkında daha fazla bilgi için [API dokümanlarına](api/router/Route#redirectTo) göz atın.
