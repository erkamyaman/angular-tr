# Route'lara Navigasyon

RouterLink direktifi, Angular'ın navigasyona bildirimsel yaklaşımıdır. Angular'ın yönlendirme sistemiyle sorunsuz bir şekilde entegre olan standart bağlantı öğelerini (`<a>`) kullanmanıza olanak tanır.

## RouterLink nasıl kullanılır

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

### Mutlak veya göreceli bağlantılar kullanma

Angular yönlendirmesinde **göreceli URL'ler**, geçerli rotanın konumuna göre navigasyon yolları tanımlamanıza olanak tanır. Bunun aksine **mutlak URL'ler**, protokolü (örn. `http://`) ve **kök alan adını** (örn. `google.com`) içeren tam yolu içerir.

```angular-html
<!-- Mutlak URL -->
<a href="https://www.angular.dev/essentials">Angular Essentials Guide</a>

<!-- Göreceli URL -->
<a href="/essentials">Angular Essentials Guide</a>
```

Bu örnekte, ilk örnek essentials sayfası için protokolü (yani `https://`) ve kök alan adını (yani `angular.dev`) açıkça tanımlanmış tam yolu içerir. Buna karşılık, ikinci örnek kullanıcının zaten `/essentials` için doğru kök alan adında olduğunu varsayar.

Genel olarak, göreceli URL'ler yönlendirme hiyerarşisi içindeki mutlak konumlarını bilmeleri gerekmediğinden uygulamalar arasında daha sürdürülebilir oldukları için tercih edilir.

### Göreceli URL'ler nasıl çalışır

Angular yönlendirme, göreceli URL'leri tanımlamak için iki söz dizimi sunar: dizeler ve diziler.

```angular-html
<!-- Kullanıcıyı /dashboard'a yönlendirir -->
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
<!-- /settings/notifications'a yönlendirir -->
<a routerLink="notifications">Notifications</a>
<a routerLink="/settings/notifications">Notifications</a>

<!-- /team/:teamId/user/:userId'ye yönlendirir -->
<a routerLink="/team/123/user/456">User 456</a>
<a [routerLink]="['/team', teamId, 'user', userId]">Current User</a>
```

## Route'lara programatik navigasyon

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
    // Standart navigasyon
    this.router.navigate(['/profile']);

    // Route parametreleri ile
    this.router.navigate(['/users', userId]);

    // Sorgu parametreleri ile
    this.router.navigate(['/search'], {
      queryParams: {category: 'books', sort: 'price'},
    });

    // Matris parametreleri ile
    this.router.navigate(['/products', {featured: true, onSale: true}]);
  }
}
```

`router.navigate()` hem basit hem de karmaşık yönlendirme senaryolarını destekler ve rota parametreleri, [sorgu parametreleri](/guide/routing/read-route-state#sorgu-parametreleri) geçirmenize ve navigasyon davranışını kontrol etmenize olanak tanır.

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

  // Kardeş rotaya navigasyon
  navigateToEdit() {
    // Kaynak: /users/123
    // Hedef:  /users/123/edit
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  // Üst rotaya navigasyon
  navigateToParent() {
    // Kaynak: /users/123
    // Hedef:  /users
    this.router.navigate(['..'], {relativeTo: this.route});
  }
}
```

### `router.navigateByUrl()`

`router.navigateByUrl()` yöntemi, dizi segmentleri yerine URL yol dizeleri kullanarak programatik olarak gezinmenin doğrudan bir yolunu sağlar. Bu yöntem, tam bir URL yolunuz olduğunda ve mutlak navigasyon yapmanız gerektiğinde, özellikle harici olarak sağlanan URL'ler veya derin bağlantı senaryolarıyla çalışırken idealdir.

```ts
// Standart rota navigasyonu
router.navigateByUrl('/products');

// İç içe rotaya navigasyon
router.navigateByUrl('/products/featured');

// Parametreler ve fragment ile tam URL
router.navigateByUrl('/products/123?view=details#reviews');

// Sorgu parametreleri ile navigasyon
router.navigateByUrl('/search?category=books&sortBy=price');

// Matris parametreleri ile
router.navigateByUrl('/sales-awesome;isOffer=true;showModal=false');
```

Geçerli URL'yi geçmişte değiştirmeniz gerektiğinde, `navigateByUrl` bir `replaceUrl` seçeneğine sahip yapılandırma nesnesi de kabul eder.

```ts
// Geçerli URL'yi geçmişte değiştir
router.navigateByUrl('/checkout', {
  replaceUrl: true,
});
```

### Adres çubuğunda farklı bir URL görüntüleme

Tarayıcının adres çubuğunda, rota eşleştirmesi için kullanılandan farklı bir URL görüntülemek için `navigateByUrl`'ye bir browserUrl seçeneği geçirebilirsiniz.

Bu, bir kullanıcıyı hata sayfası gibi farklı bir rotaya yönlendirmek istediğinizde, kullanıcının başlangıçta ziyaret etmeye çalıştığı URL'yi değiştirmeden kullanışlıdır.

```ts
router.navigateByUrl('/not-found', {browserUrl: '/products/missing-item'});
```

Angular `/not-found` rotasına navigasyon yapar ve render eder, ancak tarayıcı adres çubuğu `/products/missing-item` gösterir.

NOTE: `browserUrl` yalnızca tarayıcının adres çubuğunda görünen şeyi etkiler.

## RouterLink ile tarayıcı URL'sini özelleştirme

`RouterLink` direktifi, bir bağlantıya tıklandığında tarayıcının adres çubuğunda görüntülenen URL'yi, Angular'ın navigasyon yaptığı rotadan bağımsız olarak kontrol etmenize olanak tanıyan bir `browserUrl` girişini de destekler.

```angular-html
<!-- /dashboard'a yönlendirir, ancak adres çubuğu /home gösterir -->
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

  // Adres çubuğunda görüntülenecek bir UrlTree oluştur
  displayUrl: UrlTree = this.router.createUrlTree(['/products', 'widget']);
}
```

## Sonraki adımlar

Duyarlı ve bağlama duyarlı bileşenler oluşturmak için [rota durumunu nasıl okuyacağınızı](/guide/routing/read-route-state) öğrenin.
