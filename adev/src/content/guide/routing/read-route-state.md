# Read route state

Angular Router, duyarlı ve bağlama duyarlı bileşenler oluşturmak için bir rotayla ilişkili bilgileri okumanıza ve kullanmanıza olanak tanır.

## Get information about the current route with ActivatedRoute

`ActivatedRoute`, `@angular/router`'dan gelen ve geçerli rotayla ilişkili tüm bilgileri sağlayan bir servistir.

```angular-ts
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product',
})
export class Product {
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    console.log(this.activatedRoute);
  }
}
```

`ActivatedRoute`, rota hakkında farklı bilgiler sağlayabilir. Bazı yaygın özellikler şunlardır:

| Özellik       | Ayrıntılar                                                                                                            |
| :------------ | :-------------------------------------------------------------------------------------------------------------------- |
| `url`         | Rota yolunun her bir parçası için dize dizisi olarak temsil edilen, rota yollarının bir `Observable`'ıdır.            |
| `data`        | Rota için sağlanan `data` nesnesini içeren bir `Observable`. Ayrıca resolve guard'dan çözümlenen değerleri de içerir. |
| `params`      | Rotaya özgü zorunlu ve isteğe bağlı parametreleri içeren bir `Observable`.                                            |
| `queryParams` | Tüm rotalar için kullanılabilen sorgu parametrelerini içeren bir `Observable`.                                        |

Rotada erişebileceğiniz şeylerin tam listesi için [`ActivatedRoute` API dokümanlarına](/api/router/ActivatedRoute) göz atın.

## Understanding route snapshots

Sayfa navigasyonları zaman içindeki olaylardır ve belirli bir zamanda yönlendirici durumuna bir rota anlık görüntüsü alarak erişebilirsiniz.

Rota anlık görüntüleri, parametreleri, verileri ve alt rotaları dahil olmak üzere rota hakkında temel bilgiler içerir. Ayrıca anlık görüntüler statiktir ve gelecekteki değişiklikleri yansıtmaz.

İşte bir rota anlık görüntüsüne nasıl erişeceğinize dair bir örnek:

```angular-ts
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';

@Component({
  /*...*/
})
export class UserProfile {
  readonly userId: string;
  private route = inject(ActivatedRoute);

  constructor() {
    // Example URL: https://www.angular.dev/users/123?role=admin&status=active#contact

    // Access route parameters from snapshot
    this.userId = this.route.snapshot.paramMap.get('id');

    // Access multiple route elements
    const snapshot = this.route.snapshot;
    console.log({
      url: snapshot.url, // https://www.angular.dev
      // Route parameters object: {id: '123'}
      params: snapshot.params,
      // Query parameters object: {role: 'admin', status: 'active'}
      queryParams: snapshot.queryParams, // Query parameters
    });
  }
}
```

Erişebileceğiniz tüm özelliklerin tam listesi için [`ActivatedRoute` API dokümanlarına](/api/router/ActivatedRoute) ve [`ActivatedRouteSnapshot` API dokümanlarına](/api/router/ActivatedRouteSnapshot) göz atın.

## Reading parameters on a route

Geliştiricilerin bir rotadan kullanabileceği iki tür parametre vardır: rota ve sorgu parametreleri.

### Route Parameters

Rota parametreleri, URL aracılığıyla bir bileşene veri aktarmanıza olanak tanır. Bu, URL'deki bir kullanıcı kimliği veya ürün kimliği gibi bir tanımlayıcıya göre belirli içerik görüntülemek istediğinizde kullanışlıdır.

Parametre adını iki nokta üst üste (`:`) ile ön ekleyerek [rota parametreleri tanımlayabilirsiniz](/guide/routing/define-routes#define-url-paths-with-route-parameters).

```angular-ts
import {Routes} from '@angular/router';
import {Product} from './product';

const routes: Routes = [{path: 'product/:id', component: Product}];
```

`route.params`'a abone olarak parametrelere erişebilirsiniz.

```angular-ts
import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-detail',
  template: `<h1>Product Details: {{ productId() }}</h1>`,
})
export class ProductDetail {
  productId = signal('');
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    // Access route parameters
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(params['id']);
    });
  }
}
```

### Query Parameters

[Sorgu parametreleri](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams), rota yapısını etkilemeden URL'ler aracılığıyla isteğe bağlı veri aktarmanın esnek bir yolunu sağlar. Rota parametrelerinin aksine, sorgu parametreleri navigasyon olayları arasında kalıcı olabilir ve filtreleme, sıralama, sayfalama ve diğer durumlu UI öğelerini yönetmek için mükemmeldir.

```angular-ts
// Single parameter structure
// /products?category=electronics
router.navigate(['/products'], {
  queryParams: {category: 'electronics'},
});

// Multiple parameters
// /products?category=electronics&sort=price&page=1
router.navigate(['/products'], {
  queryParams: {
    category: 'electronics',
    sort: 'price',
    page: 1,
  },
});
```

`route.queryParams` ile sorgu parametrelerine erişebilirsiniz.

İşte bir ürün listesinin nasıl görüntüleneceğini etkileyen sorgu parametrelerini güncelleyen bir `ProductList` örneği:

```angular-ts
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-product-list',
  template: `
    <div>
      <select (change)="updateSort($event)">
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>
      <!-- Products list -->
    </div>
  `,
})
export class ProductList {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    // Access query parameters reactively
    this.route.queryParams.subscribe((params) => {
      const sort = params['sort'] || 'price';
      const page = Number(params['page']) || 1;
      this.loadProducts(sort, page);
    });
  }

  updateSort(event: Event) {
    const sort = (event.target as HTMLSelectElement).value;
    // Update URL with new query parameter
    this.router.navigate([], {
      queryParams: {sort},
      queryParamsHandling: 'merge', // Preserve other query parameters
    });
  }
}
```

Bu örnekte, kullanıcılar ürün listesini ada veya fiyata göre sıralamak için bir select öğesi kullanabilir. İlişkili değişiklik işleyicisi URL'nin sorgu parametrelerini günceller, bu da güncellenmiş sorgu parametrelerini okuyabilen ve ürün listesini güncelleyebilen bir değişiklik olayını tetikler.

Daha fazla bilgi için [QueryParamsHandling hakkındaki resmi dokümanlara](/api/router/QueryParamsHandling) göz atın.

### Matrix Parameters

Matris parametreleri, tüm rotaya uygulanmak yerine belirli bir URL segmentine ait olan isteğe bağlı parametrelerdir. Bir `?` sonrasında görünen ve genel olarak uygulanan sorgu parametrelerinin aksine, matris parametreleri noktalı virgül (`;`) kullanır ve bireysel yol segmentlerine kapsamlandırılmıştır.

Matris parametreleri, rota tanımını veya eşleştirme davranışını etkilemeden belirli bir rota segmentine yardımcı veri aktarmanız gerektiğinde kullanışlıdır. Sorgu parametreleri gibi, rota yapılandırmanızda tanımlanmaları gerekmez.

```ts
// URL format: /path;key=value
// Multiple parameters: /path;key1=value1;key2=value2

// Navigate with matrix parameters
this.router.navigate(['/awesome-products', {view: 'grid', filter: 'new'}]);
// Results in URL: /awesome-products;view=grid;filter=new
```

**ActivatedRoute Kullanarak**

```ts
import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component(/* ... */)
export class AwesomeProducts {
  private route = inject(ActivatedRoute);

  constructor() {
    // Access matrix parameters via params
    this.route.params.subscribe((params) => {
      const view = params['view']; // e.g., 'grid'
      const filter = params['filter']; // e.g., 'new'
    });
  }
}
```

NOTE: `ActivatedRoute` kullanmaya alternatif olarak, `withComponentInputBinding` kullanıldığında matris parametreleri bileşen girişlerine de bağlanır.

## Detect active current route with RouterLinkActive

Geçerli aktif rotaya göre navigasyon öğelerini dinamik olarak stilize etmek için `RouterLinkActive` direktifini kullanabilirsiniz. Bu, kullanıcıları aktif rotanın hangisi olduğu hakkında bilgilendirmek için navigasyon öğelerinde yaygın olarak kullanılır.

```angular-html
<nav>
  <a
    class="button"
    routerLink="/about"
    routerLinkActive="active-button"
    ariaCurrentWhenActive="page"
  >
    About
  </a>
  |
  <a
    class="button"
    routerLink="/settings"
    routerLinkActive="active-button"
    ariaCurrentWhenActive="page"
  >
    Settings
  </a>
</nav>
```

Bu örnekte, Angular Router URL ilgili `routerLink` ile eşleştiğinde doğru bağlantı öğesine `active-button` sınıfını ve `ariaCurrentWhenActive` özelliğine `page` değerini uygular.

Öğeye birden fazla sınıf eklemeniz gerekiyorsa, boşlukla ayrılmış bir dize veya bir dizi kullanabilirsiniz:

```angular-html
<!-- Space-separated string syntax -->
<a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>

<!-- Array syntax -->
<a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
```

routerLinkActive için bir değer belirttiğinizde, `ariaCurrentWhenActive` için de aynı değeri tanımlamış olursunuz. Bu, görme engelli kullanıcıların (uygulanan farklı stili algılayamayabilecek) aktif düğmeyi de tanımlayabilmesini sağlar.

aria için farklı bir değer tanımlamak istiyorsanız, `ariaCurrentWhenActive` direktifini kullanarak değeri açıkça ayarlamanız gerekir.

### Route matching strategy

Varsayılan olarak, `RouterLinkActive` rotadaki herhangi bir üst öğeyi eşleşme olarak kabul eder.

```angular-html
<a [routerLink]="['/user/jane']" routerLinkActive="active-link"> User </a>
<a [routerLink]="['/user/jane/role/admin']" routerLinkActive="active-link"> Role </a>
```

Kullanıcı `/user/jane/role/admin` adresini ziyaret ettiğinde, her iki bağlantı da `active-link` sınıfına sahip olur.

### Only apply RouterLinkActive on exact route matches

Sınıfı yalnızca tam eşleşmede uygulamak istiyorsanız, `exact: true` değerini içeren bir yapılandırma nesnesiyle `routerLinkActiveOptions` direktifini sağlamanız gerekir.

```angular-html
<a
  [routerLink]="['/user/jane']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  User
</a>
<a
  [routerLink]="['/user/jane/role/admin']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  Role
</a>
```

Bir rotanın nasıl eşleştirileceği konusunda daha hassas olmak istiyorsanız, `exact: true` ifadesinin aslında eşleştirme seçeneklerinin tam seti için sözdizimsel şeker olduğunu belirtmek gerekir:

```angular-ts
// `exact: true` is equivalent to
{
  paths: 'exact',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'exact',
}

// `exact: false` is equivalent
{
  paths: 'subset',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'subset',
}
```

Daha fazla bilgi için [isActiveMatchOptions](/api/router/IsActiveMatchOptions) resmi dokümanlarına göz atın.

### Apply RouterLinkActive to an ancestor

RouterLinkActive direktifi, geliştiricilerin öğeleri istedikleri gibi stilize etmelerine olanak tanımak için bir üst öğeye de uygulanabilir.

```angular-html
<div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
  <a routerLink="/user/jim">Jim</a>
  <a routerLink="/user/bob">Bob</a>
</div>
```

Daha fazla bilgi için [RouterLinkActive API dokümanlarına](/api/router/RouterLinkActive) göz atın.

## Check if a URL is active

`isActive` fonksiyonu, belirli bir URL'nin yönlendiricide şu anda aktif olup olmadığını izleyen hesaplanmış bir sinyal döndürür. Sinyal, yönlendirici durumu değiştikçe otomatik olarak güncellenir.

```angular-ts
import {Component, inject} from '@angular/core';
import {isActive, Router} from '@angular/router';

@Component({
  template: `
    <div [class.active]="isSettingsActive()">
      <h2>Settings</h2>
    </div>
  `,
})
export class Panel {
  private router = inject(Router);

  isSettingsActive = isActive('/settings', this.router, {
    paths: 'subset',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored',
  });
}
```
