# Show routes with outlets

`RouterOutlet` direktifi, yönlendiricinin geçerli URL için bileşeni render etmesi gereken konumu işaretleyen bir yer tutucudur.

```html
<app-header />
<!-- Angular inserts your route content here -->
<router-outlet />
<app-footer />
```

```ts
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
```

Bu örnekte, bir uygulama aşağıdaki rotalar tanımlanmışsa:

```ts
import {Routes} from '@angular/router';
import {Home} from './home';
import {Products} from './products';

const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home Page',
  },
  {
    path: 'products',
    component: Products,
    title: 'Our Products',
  },
];
```

Kullanıcı `/products` adresini ziyaret ettiğinde, Angular şunu render eder:

```angular-html
<app-header />
<app-products />
<app-footer />
```

Kullanıcı ana sayfaya geri dönerse, Angular şunu render eder:

```angular-html
<app-header />
<app-home />
<app-footer />
```

Bir rota görüntülenirken, `<router-outlet>` öğesi gelecekteki navigasyonlar için bir referans noktası olarak DOM'da mevcut kalır. Angular, yönlendirilen içeriği outlet öğesinin hemen sonrasına kardeş eleman olarak ekler.

```angular-html
<!-- Contents of the component's template -->
<app-header />
<router-outlet />
<app-footer />
```

```angular-html
<!-- Content rendered on the page when the user visits /admin -->
<app-header />
<router-outlet />
<app-admin-page />
<app-footer />
```

## Nesting routes with child routes

Uygulamanız daha karmaşık hale geldikçe, kök bileşeniniz dışında bir bileşene göre rotalar oluşturmak isteyebilirsiniz. Bu, URL değiştiğinde kullanıcıların tüm sayfanın yenilendiğini hissetmesi yerine yalnızca uygulamanın bir bölümünün değiştiği deneyimler oluşturmanıza olanak tanır.

Bu tür iç içe rotalara alt rotalar denir. Bu, uygulamanıza AppComponent'teki `<router-outlet>` öğesine ek olarak ikinci bir `<router-outlet>` eklediğiniz anlamına gelir.

Bu örnekte, `Settings` bileşeni kullanıcının seçimine göre istenen paneli görüntüler. Alt rotalarda dikkat edeceğiniz benzersiz şeylerden biri, bileşenin genellikle kendi `<nav>` ve `<router-outlet>` öğelerine sahip olmasıdır.

```angular-html
<h1>Settings</h1>
<nav>
  <ul>
    <li><a routerLink="profile">Profile</a></li>
    <li><a routerLink="security">Security</a></li>
  </ul>
</nav>
<router-outlet />
```

Alt rota diğer herhangi bir rota gibidir; hem bir `path` hem de bir `component` gerektirir. Tek fark, alt rotaları üst rota içindeki bir children dizisine yerleştirmenizdir.

```ts
const routes: Routes = [
  {
    path: 'settings',
    component: Settings, // this is the component with the <router-outlet> in the template
    children: [
      {
        path: 'profile', // child route path
        component: Profile, // child route component that the router renders
      },
      {
        path: 'security',
        component: Security, // another child route component that the router renders
      },
    ],
  },
];
```

Hem `routes` hem de `<router-outlet>` doğru şekilde yapılandırıldığında, uygulamanız artık iç içe rotaları kullanıyor!

## Secondary routes with named outlets

Sayfaların birden fazla outlet'i olabilir — hangi içeriğin hangi outlet'e ait olduğunu belirtmek için her outlet'e bir ad atayabilirsiniz.

```angular-html
<app-header />
<router-outlet />
<router-outlet name="read-more" />
<router-outlet name="additional-actions" />
<app-footer />
```

Her outlet'in benzersiz bir adı olmalıdır. Ad dinamik olarak ayarlanamaz veya değiştirilemez. Varsayılan olarak ad `'primary'` şeklindedir.

Angular, outlet'in adını her rotada tanımlanan `outlet` özelliği ile eşleştirir:

```ts
{
  path: 'user/:id',
  component: UserDetails,
  outlet: 'additional-actions'
}
```

## Outlet lifecycle events

Bir router outlet'in yayınlayabileceği dört yaşam döngüsü olayı vardır:

| Olay         | Açıklama                                                          |
| ------------ | ----------------------------------------------------------------- |
| `activate`   | Yeni bir bileşen oluşturulduğunda                                 |
| `deactivate` | Bir bileşen yok edildiğinde                                       |
| `attach`     | `RouteReuseStrategy` outlet'e alt ağacı eklemesini söylediğinde   |
| `detach`     | `RouteReuseStrategy` outlet'ten alt ağacı ayırmasını söylediğinde |

Standart olay bağlama söz dizimi ile olay dinleyicileri ekleyebilirsiniz:

```angular-html
<router-outlet
  (activate)="onActivate($event)"
  (deactivate)="onDeactivate($event)"
  (attach)="onAttach($event)"
  (detach)="onDetach($event)"
/>
```

Daha fazla bilgi edinmek istiyorsanız [RouterOutlet için API dokümanlarına](/api/router/RouterOutlet?tab=api) göz atın.

## Passing contextual data to routed components

Yönlendirilen bileşenlere bağlamsal veri aktarmak genellikle global durum veya karmaşık rota yapılandırmaları gerektirir. Bunu kolaylaştırmak için her `RouterOutlet` bir `routerOutletData` girişini destekler. Yönlendirilen bileşenler ve alt bileşenleri, `ROUTER_OUTLET_DATA` enjeksiyon token'ını kullanarak bu veriyi sinyal olarak okuyabilir ve böylece rota tanımlarını değiştirmeden outlet'e özgü yapılandırma yapılabilir.

```angular-ts
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  template: `
    <h2>Dashboard</h2>
    <router-outlet [routerOutletData]="{layout: 'sidebar'}" />
  `,
})
export class Dashboard {}
```

Yönlendirilen bileşen, `ROUTER_OUTLET_DATA` kullanarak sağlanan outlet verisini enjekte edebilir:

```angular-ts
import {Component, inject} from '@angular/core';
import {ROUTER_OUTLET_DATA} from '@angular/router';

@Component({
  selector: 'app-stats',
  template: `<p>Stats view (layout: {{ outletData().layout }})</p>`,
})
export class Stats {
  outletData = inject(ROUTER_OUTLET_DATA) as Signal<{layout: string}>;
}
```

Angular, `Stats` bileşenini o outlet'te etkinleştirdiğinde, enjekte edilen veri olarak `{ layout: 'sidebar' }` alır.

NOTE: `routerOutletData` girişi ayarlanmadığında, enjekte edilen değer varsayılan olarak null'dur.

---

## Next steps

Angular Router ile [rotalara nasıl navigasyon yapılacağını](/guide/routing/navigate-to-routes) öğrenin.
