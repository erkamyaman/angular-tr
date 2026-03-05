# Navigate to routes

RouterLink direktifi, Angular'ın navigasyona bildirimsel yaklaşımıdır. Angular'ın yönlendirme sistemiyle sorunsuz bir şekilde entegre olan standart bağlantı öğelerini (`<a>`) kullanmanıza olanak tanır.

## How to use RouterLink

Bir `href` özniteliğine sahip normal bağlantı öğeleri `<a>` kullanmak yerine, Angular yönlendirmesinden yararlanmak için uygun yol ile bir RouterLink direktifi eklersiniz.

```angular-ts
import {RouterLink} from '@angular/router';

@Component({
  template: `
    <nav>
      <a routerLink="/user-profile">User profile</a>
      <a routerLink="/settings">Settings</a>
    </nav>
  `,
  imports: [RouterLink],
  ...
})
export class App {}
```

### Using absolute or relative links

Angular yönlendirmesinde **göreceli URL'ler**, geçerli rotanın konumuna göre navigasyon yolları tanımlamanıza olanak tanır. Bunun aksine **mutlak URL'ler**, protokolü (örn. `http://`) ve **kök alan adını** (örn. `google.com`) içeren tam yolu içerir.

```angular-html
<!-- Absolute URL -->
<a href="https://www.angular.dev/essentials">Angular Essentials Guide</a>

<!-- Relative URL -->
<a href="/essentials">Angular Essentials Guide</a>
```

Bu örnekte, ilk örnek essentials sayfası için protokolü (yani `https://`) ve kök alan adını (yani `angular.dev`) açıkça tanımlanmış tam yolu içerir. Buna karşılık, ikinci örnek kullanıcının zaten `/essentials` için doğru kök alan adında olduğunu varsayar.

Genel olarak, göreceli URL'ler yönlendirme hiyerarşisi içindeki mutlak konumlarını bilmeleri gerekmediğinden uygulamalar arasında daha sürdürülebilir oldukları için tercih edilir.

### How relative URLs work

Angular yönlendirme, göreceli URL'leri tanımlamak için iki söz dizimi sunar: dizeler ve diziler.

```angular-html
<!-- Navigates user to /dashboard -->
<a routerLink="dashboard">Dashboard</a>
<a [routerLink]="['dashboard']">Dashboard</a>
```

HELPFUL: Bir dize geçirmek, göreceli URL'leri tanımlamanın en yaygın yoludur.

Göreceli bir URL'de dinamik parametreler tanımlamanız gerektiğinde, dizi söz dizimini kullanın:

```angular-html
<a [routerLink]="['user', currentUserId]">Current User</a>
```

Ayrıca Angular yönlendirme, göreceli yolun eğik çizgi (`/`) ile ön eklenip eklenmemesine göre yolun geçerli URL'ye mi yoksa kök alan adına mı göreceli olmasını istediğinizi belirlemenize olanak tanır.

Örneğin, kullanıcı `example.com/settings` adresindeyse, çeşitli senaryolar için farklı göreceli yollar şöyle tanımlanabilir:

```angular-html
<!-- Navigates to /settings/notifications -->
<a routerLink="notifications">Notifications</a>
<a routerLink="/settings/notifications">Notifications</a>

<!-- Navigates to /team/:teamId/user/:userId -->
<a routerLink="/team/123/user/456">User 456</a>
<a [routerLink]="['/team', teamId, 'user', userId]">Current User</a>
```

## Programmatic navigation to routes

`RouterLink` şablonlarda bildirimsel navigasyonu yönetirken, Angular mantık, kullanıcı eylemleri veya uygulama durumuna göre gezinmeniz gereken senaryolar için programatik navigasyon sağlar. `Router` enjekte ederek, rotalara dinamik olarak gezinebilir, parametreler geçirebilir ve TypeScript kodunuzda navigasyon davranışını kontrol edebilirsiniz.

### `router.navigate()`

Bir URL yol dizisi belirleyerek rotalar arasında programatik olarak gezinmek için `router.navigate()` yöntemini kullanabilirsiniz.

```angular-ts
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: ` <button (click)="navigateToProfile()">View Profile</button> `,
})
export class AppDashboard {
  private router = inject(Router);

  navigateToProfile() {
    // Standard navigation
    this.router.navigate(['/profile']);

    // With route parameters
    this.router.navigate(['/users', userId]);

    // With query parameters
    this.router.navigate(['/search'], {
      queryParams: {category: 'books', sort: 'price'},
    });

    // With matrix parameters
    this.router.navigate(['/products', {featured: true, onSale: true}]);
  }
}
```

`router.navigate()` hem basit hem de karmaşık yönlendirme senaryolarını destekler ve rota parametreleri, [sorgu parametreleri](/guide/routing/read-route-state#query-parameters) geçirmenize ve navigasyon davranışını kontrol etmenize olanak tanır.

Ayrıca `relativeTo` seçeneğini kullanarak yönlendirme ağacındaki bileşeninizin konumuna göre dinamik navigasyon yolları oluşturabilirsiniz.

```angular-ts
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-user-detail',
  template: `
    <button (click)="navigateToEdit()">Edit User</button>
    <button (click)="navigateToParent()">Back to List</button>
  `,
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Navigate to a sibling route
  navigateToEdit() {
    // From: /users/123
    // To:   /users/123/edit
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  // Navigate to parent
  navigateToParent() {
    // From: /users/123
    // To:   /users
    this.router.navigate(['..'], {relativeTo: this.route});
  }
}
```

### `router.navigateByUrl()`

`router.navigateByUrl()` yöntemi, dizi segmentleri yerine URL yol dizeleri kullanarak programatik olarak gezinmenin doğrudan bir yolunu sağlar. Bu yöntem, tam bir URL yolunuz olduğunda ve mutlak navigasyon yapmanız gerektiğinde, özellikle harici olarak sağlanan URL'ler veya derin bağlantı senaryolarıyla çalışırken idealdir.

```ts
// Standard route navigation
router.navigateByUrl('/products');

// Navigate to nested route
router.navigateByUrl('/products/featured');

// Complete URL with parameters and fragment
router.navigateByUrl('/products/123?view=details#reviews');

// Navigate with query parameters
router.navigateByUrl('/search?category=books&sortBy=price');

// With matrix parameters
router.navigateByUrl('/sales-awesome;isOffer=true;showModal=false');
```

Geçerli URL'yi geçmişte değiştirmeniz gerektiğinde, `navigateByUrl` bir `replaceUrl` seçeneğine sahip yapılandırma nesnesi de kabul eder.

```ts
// Replace current URL in history
router.navigateByUrl('/checkout', {
  replaceUrl: true,
});
```

### Display a different URL in the address bar

Tarayıcının adres çubuğunda, rota eşleştirmesi için kullanılandan farklı bir URL görüntülemek için `navigateByUrl`'ye bir browserUrl seçeneği geçirebilirsiniz.

Bu, bir kullanıcıyı hata sayfası gibi farklı bir rotaya yönlendirmek istediğinizde, kullanıcının başlangıçta ziyaret etmeye çalıştığı URL'yi değiştirmeden kullanışlıdır.

```ts
router.navigateByUrl('/not-found', {browserUrl: '/products/missing-item'});
```

Angular `/not-found` rotasına navigasyon yapar ve render eder, ancak tarayıcı adres çubuğu `/products/missing-item` gösterir.

NOTE: `browserUrl` yalnızca tarayıcının adres çubuğunda görünen şeyi etkiler.

## Customizing the browser URL with RouterLink

`RouterLink` direktifi, bir bağlantıya tıklandığında tarayıcının adres çubuğunda görüntülenen URL'yi, Angular'ın navigasyon yaptığı rotadan bağımsız olarak kontrol etmenize olanak tanıyan bir `browserUrl` girişini de destekler.

```angular-html
<!-- Navigates to /dashboard, but the address bar shows /home -->
<a [routerLink]="['/dashboard']" [browserUrl]="'/home'">Go to Dashboard</a>
```

Daha dinamik kullanım durumları için bir `UrlTree` de bağlayabilirsiniz:

```angular-ts
import {Component, inject} from '@angular/core';
import {Router, RouterLink, UrlTree} from '@angular/router';

@Component({
  template: `
    <a [routerLink]="['/products', product.id]" [browserUrl]="displayUrl">
      {{ product.name }}
    </a>
  `,
  imports: [RouterLink],
})
export class ProductList {
  private router = inject(Router);

  product = {id: 42, name: 'Widget'};

  // Create a UrlTree to display in the address bar
  displayUrl: UrlTree = this.router.createUrlTree(['/products', 'widget']);
}
```

## Next steps

Duyarlı ve bağlama duyarlı bileşenler oluşturmak için [rota durumunu nasıl okuyacağınızı](/guide/routing/read-route-state) öğrenin.
