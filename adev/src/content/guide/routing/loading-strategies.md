# Route Yükleme Stratejileri

Angular yönlendirmesinde rotaların ve bileşenlerin nasıl ve ne zaman yüklendiğini anlamak, duyarlı web uygulamaları oluşturmak için çok önemlidir. Angular, yükleme davranışını kontrol etmek için iki temel strateji sunar:

1. **Hevesli yükleme**: Hemen yüklenen rotalar ve bileşenler
2. **Tembel yükleme**: Yalnızca ihtiyaç duyulduğunda yüklenen rotalar ve bileşenler

Her yaklaşım, farklı senaryolar için belirgin avantajlar sunar.

## Hevesli yüklenen bileşenler

[`component`](api/router/Route#component) özelliği ile bir rota tanımladığınızda, referans verilen bileşen rota yapılandırmasıyla aynı JavaScript paketinin bir parçası olarak hevesli şekilde yüklenir.

```ts
import {Routes} from '@angular/router';
import {HomePage} from './components/home/home-page';
import {LoginPage} from './components/auth/login-page';

export const routes: Routes = [
  // HomePage ve LoginPage bu yapılandırmada doğrudan referans verilmiştir,
  // bu nedenle kodları bu dosya ile aynı JavaScript paketine hevesli olarak dahil edilir.
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
];
```

Rota bileşenlerini bu şekilde hevesli yüklemek, tarayıcının ilk sayfa yüklemenizin bir parçası olarak bu bileşenler için tüm JavaScript'i indirmesi ve ayrıştırması gerektiği anlamına gelir, ancak bileşenler Angular tarafından anında kullanılabilir.

İlk sayfa yüklemenize daha fazla JavaScript dahil etmek daha yavaş ilk yükleme sürelerine yol açsa da, kullanıcı uygulama içinde gezinirken daha sorunsuz geçişlere yol açabilir.

## Tembel yüklenen bileşenler ve route'lar

Bir rota aktif hale geldiğinde bileşen için JavaScript'i tembel yüklemek için [`loadComponent`](api/router/Route#loadComponent) özelliğini kullanabilirsiniz. [`loadChildren`](api/router/Route#loadChildren) özelliği ise rota eşleştirme sırasında alt rotaları tembel yükler.

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login-page'),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component'),
    loadChildren: () => import('./admin/admin.routes'),
  },
];
```

[`loadComponent`](/api/router/Route#loadComponent) ve [`loadChildren`](/api/router/Route#loadChildren) özellikleri, sırasıyla bir Angular bileşeni veya bir rota kümesine çözümlenen bir Promise döndüren bir yükleyici fonksiyon kabul eder. Çoğu durumda bu fonksiyon standart [JavaScript dinamik import API'sini](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) kullanır. Ancak herhangi bir rastgele asenkron yükleyici fonksiyon da kullanabilirsiniz.

Tembel yüklenen dosya `default` dışa aktarma kullanıyorsa, dışa aktarılan sınıfı seçmek için ek bir `.then` çağrısı olmadan `import()` promise'ini doğrudan döndürebilirsiniz.

Rotaları tembel yüklemek, ilk paketten büyük JavaScript bölümlerini çıkararak Angular uygulamanızın yükleme hızını önemli ölçüde iyileştirebilir. Kodunuzun bu bölümleri, yönlendiricinin yalnızca kullanıcı ilgili rotayı ziyaret ettiğinde istediği ayrı JavaScript "parçalarına" derlenir.

## Enjeksiyon bağlamında lazy loading

Yönlendirici, [`loadComponent`](/api/router/Route#loadComponent) ve [`loadChildren`](/api/router/Route#loadChildren) fonksiyonlarını **geçerli rotanın enjeksiyon bağlamında** çalıştırır ve bu yükleyici fonksiyonlar içinde [`inject`](/api/core/inject) çağrısı yaparak o rotada bildirilen, hiyerarşik bağımlılık enjeksiyonu aracılığıyla üst rotalardan devralınan veya global olarak kullanılabilen sağlayıcılara erişmenize olanak tanır. Bu, bağlama duyarlı tembel yükleme sağlar.

```ts
import {Routes} from '@angular/router';
import {inject} from '@angular/core';
import {FeatureFlags} from './feature-flags';

export const routes: Routes = [
  {
    path: 'dashboard',
    // Rotanın enjeksiyon bağlamında çalışır
    loadComponent: () => {
      const flags = inject(FeatureFlags);
      return flags.isPremium
        ? import('./dashboard/premium-dashboard')
        : import('./dashboard/basic-dashboard');
    },
  },
];
```

## Hevesli mi yoksa tembel bir route mu kullanmalıyım?

Bir rotanın hevesli mi yoksa tembel mi olması gerektiğine karar verirken dikkate alınması gereken birçok faktör vardır.

Genel olarak, birincil açılış sayfası/sayfaları için hevesli yükleme, diğer sayfalar için ise tembel yükleme önerilir.

NOTE: Tembel rotalar, kullanıcının talep ettiği başlangıç veri miktarını azaltmanın ön performans avantajına sahip olsa da, istenmeyen olabilecek gelecek veri istekleri ekler. Bu, özellikle birden fazla düzeyde iç içe tembel yükleme ile uğraşırken doğrudur ve performansı önemli ölçüde etkileyebilir.

## Sonraki adımlar

[Outlet'ler ile rotalarınızın içeriğini nasıl görüntüleyeceğinizi](/guide/routing/show-routes-with-outlets) öğrenin.
