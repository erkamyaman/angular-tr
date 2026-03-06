# Route'ları Tanımlama

Rotalar, bir Angular uygulamasında navigasyonun temel yapı taşlarıdır.

## Route'lar nedir?

Angular'da bir **rota**, belirli bir URL yolu veya kalıbı için hangi bileşenin render edileceğini ve kullanıcı o URL'ye gittiğinde ne olacağına dair ek yapılandırma seçeneklerini tanımlayan bir nesnedir.

İşte bir rotanın temel örneği:

```ts
import {AdminPage} from './app-admin';

const adminPage = {
  path: 'admin',
  component: AdminPage,
};
```

Bu rota için, kullanıcı `/admin` yolunu ziyaret ettiğinde uygulama `AdminPage` bileşenini görüntüler.

### Uygulamanızda route'ları yönetme

Çoğu proje, rotaları dosya adında `routes` içeren ayrı bir dosyada tanımlar.

Bir rota koleksiyonu şöyle görünür:

```ts
import {Routes} from '@angular/router';
import {HomePage} from './home-page';
import {AdminPage} from './about-page';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'admin',
    component: AdminPage,
  },
];
```

Tip: Angular CLI ile bir proje oluşturduysanız, rotalarınız `src/app/app.routes.ts` dosyasında tanımlanmıştır.

### Uygulamanıza Router ekleme

Angular CLI olmadan bir Angular uygulamasını başlatırken, `providers` dizisi içeren bir yapılandırma nesnesi geçirebilirsiniz.

`providers` dizisi içinde, rotalarınızla birlikte bir `provideRouter` fonksiyon çağrısı ekleyerek Angular yönlendiriciyi uygulamanıza ekleyebilirsiniz.

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ...
  ],
};
```

## Route URL Yolları

### Statik URL Yolları

Statik URL Yolları, dinamik parametrelere göre değişmeyen önceden tanımlanmış yollara sahip rotaları ifade eder. Bunlar, bir `path` dizesiyle tam olarak eşleşen ve sabit bir sonucu olan rotalardır.

Bunlara örnek olarak şunlar verilebilir:

- "/admin"
- "/blog"
- "/settings/account"

### Route Parametreleri ile URL Yolları Tanımlama

Parametreli URL'ler, aynı bileşene birden fazla URL'nin erişmesine izin verirken URL'deki parametrelere göre dinamik olarak veri görüntüleyen dinamik yollar tanımlamanıza olanak tanır.

Bu tür bir kalıbı, rotanızın `path` dizesine parametreler ekleyerek ve her parametreyi iki nokta üst üste (`:`) karakteriyle ön eklendirerek tanımlayabilirsiniz.

IMPORTANT: Parametreler, URL'nin [sorgu dizesindeki](https://en.wikipedia.org/wiki/Query_string) bilgilerden farklıdır.
[Bu kılavuzda Angular'daki sorgu parametreleri](/guide/routing/read-route-state#sorgu-parametreleri) hakkında daha fazla bilgi edinin.

Aşağıdaki örnek, URL aracılığıyla geçirilen kullanıcı kimliğine göre bir kullanıcı profili bileşeni görüntüler.

```ts
import {Routes} from '@angular/router';
import {UserProfile} from './user-profile/user-profile';

const routes: Routes = [{path: 'user/:id', component: UserProfile}];
```

Bu örnekte, `/user/leeroy` ve `/user/jenkins` gibi URL'ler `UserProfile` bileşenini render eder. Bu bileşen daha sonra `id` parametresini okuyabilir ve veri çekme gibi ek işlemler gerçekleştirmek için kullanabilir. Rota parametrelerini okuma hakkında ayrıntılar için [rota durumunu okuma kılavuzuna](/guide/routing/read-route-state) bakın.

Geçerli rota parametre adları bir harfle (a-z, A-Z) başlamalıdır ve yalnızca şunları içerebilir:

- Harfler (a-z, A-Z)
- Sayılar (0-9)
- Alt çizgi (\_)
- Tire (-)

Birden fazla parametreye sahip yollar da tanımlayabilirsiniz:

```ts
import {Routes} from '@angular/router';
import {UserProfile} from './user-profile';
import {SocialMediaFeed} from './social-media-feed';

const routes: Routes = [
  {path: 'user/:id/:social-media', component: SocialMediaFeed},
  {path: 'user/:id/', component: UserProfile},
];
```

Bu yeni yol ile kullanıcılar `/user/leeroy/youtube` ve `/user/leeroy/bluesky` adreslerini ziyaret edebilir ve leeroy kullanıcısı için parametreye göre ilgili sosyal medya akışlarını görebilir.

Rota parametrelerini okuma hakkında ayrıntılar için [Rota durumunu okuma](/guide/routing/read-route-state) bölümüne bakın.

### Joker Karakterler

Belirli bir yol için tüm rotaları yakalamanız gerektiğinde, çözüm çift yıldız (`**`) ile tanımlanan joker rotalardır.

Yaygın bir örnek, Sayfa Bulunamadı bileşeni tanımlamaktır.

```ts
import {Home} from './home/home';
import {UserProfile} from './user-profile';
import {NotFound} from './not-found';

const routes: Routes = [
  {path: 'home', component: Home},
  {path: 'user/:id', component: UserProfile},
  {path: '**', component: NotFound},
];
```

Bu rota dizisinde, kullanıcı `home` ve `user/:id` dışında herhangi bir yolu ziyaret ettiğinde uygulama `NotFound` bileşenini görüntüler.

Tip: Joker rotalar genellikle rota dizisinin sonuna yerleştirilir.

## Angular URL'leri nasıl eşleştirir

Rotaları tanımlarken sıra önemlidir çünkü Angular ilk eşleşme kazanır stratejisi kullanır. Bu, Angular bir URL'yi bir rota `path` ile eşleştirdiğinde, daha fazla rotayı kontrol etmeyi bıraktığı anlamına gelir. Sonuç olarak, daha spesifik rotaları her zaman daha az spesifik rotalardan önce koyun.

Aşağıdaki örnek, en spesifikten en az spesifike doğru tanımlanmış rotaları gösterir:

```ts
const routes: Routes = [
  {path: '', component: Home}, // Boş yol
  {path: 'users/new', component: NewUser}, // Statik, en spesifik
  {path: 'users/:id', component: UserDetail}, // Dinamik
  {path: 'users', component: Users}, // Statik, daha az spesifik
  {path: '**', component: NotFound}, // Joker karakter - her zaman en sonda
];
```

Bir kullanıcı `/users/new` adresini ziyaret ederse, Angular yönlendirici aşağıdaki adımları izler:

1. `''` kontrol edilir - eşleşmiyor
1. `users/new` kontrol edilir - eşleşti! Burada durur
1. `users/:id`'ye hiçbir zaman ulaşılmaz, eşleşebilecek olsa bile
1. `users`'a hiçbir zaman ulaşılmaz
1. `**`'a hiçbir zaman ulaşılmaz

## Redirect'ler

Bir bileşen render etmek yerine başka bir rotaya yönlendiren bir rota tanımlayabilirsiniz:

```ts
import {Blog} from './home/blog';

const routes: Routes = [
  {
    path: 'articles',
    redirectTo: '/blog',
  },
  {
    path: 'blog',
    component: Blog,
  },
];
```

Bir rotayı değiştirir veya kaldırırsanız, bazı kullanıcılar hâlâ o rotaya ait eski bağlantılara veya yer imlerine tıklayabilir. "Bulunamadı" sayfası yerine bu kullanıcıları uygun bir alternatif rotaya yönlendirmek için bir yeniden yönlendirme ekleyebilirsiniz.

## Sayfa başlıkları

Her rota ile bir **başlık** ilişkilendirebilirsiniz. Angular, bir rota etkinleştirildiğinde [sayfa başlığını](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) otomatik olarak günceller. Erişilebilir bir deneyim oluşturmak için gerekli olan uygun sayfa başlıklarını uygulamanız için her zaman tanımlayın.

```ts
import {Routes} from '@angular/router';
import {Home} from './home';
import {About} from './about';
import {Products} from './products';

const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home Page',
  },
  {
    path: 'about',
    component: About,
    title: 'About Us',
  },
];
```

Sayfa `title` özelliği, [`ResolveFn`](/api/router/ResolveFn) kullanılarak dinamik olarak bir resolver fonksiyonuna ayarlanabilir.

```ts
const titleResolver: ResolveFn<string> = (route) => route.queryParams['id'];
const routes: Routes = [
  ...{
    path: 'products',
    component: Products,
    title: titleResolver,
  },
];
```

Rota başlıkları, [`TitleStrategy`](/api/router/TitleStrategy) soyut sınıfını genişleten bir servis aracılığıyla da ayarlanabilir. Varsayılan olarak Angular, [`DefaultTitleStrategy`](/api/router/DefaultTitleStrategy) kullanır.

### Sayfa başlıkları için TitleStrategy kullanma

Belge başlığının nasıl oluşturulduğu üzerinde merkezi kontrol gerektiren gelişmiş senaryolarda, bir `TitleStrategy` uygulayın.

`TitleStrategy`, Angular tarafından kullanılan varsayılan başlık stratejisini geçersiz kılmak için sağlayabileceğiniz bir token'dır. Uygulama son eki ekleme, breadcrumb'lardan başlık biçimlendirme veya rota verilerinden dinamik olarak başlık oluşturma gibi kuralları uygulamak için özel bir `TitleStrategy` sağlayabilirsiniz.

```ts
import {inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TitleStrategy, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  updateTitle(snapshot: RouterStateSnapshot): void {
    // PageTitle, ayarlanmışsa rotanın "Title" değerine eşittir
    // Ayarlanmamışsa index.html'deki "title" kullanılır
    const pageTitle = this.buildTitle(snapshot) || this.title.getTitle();
    this.title.setTitle(`MyAwesomeApp - ${pageTitle}`);
  }
}
```

Özel stratejiyi kullanmak için, uygulama düzeyinde `TitleStrategy` token'ı ile sağlayın:

```ts
import {provideRouter, TitleStrategy} from '@angular/router';
import {AppTitleStrategy} from './app-title.strategy';

export const appConfig = {
  providers: [provideRouter(routes), {provide: TitleStrategy, useClass: AppTitleStrategy}],
};
```

## Bağımlılık enjeksiyonu için rota düzeyinde sağlayıcılar

Her rotanın, [bağımlılık enjeksiyonu](/guide/di) aracılığıyla o rotanın içeriğine bağımlılıklar sağlamanıza olanak tanıyan bir `providers` özelliği vardır.

Bunun yararlı olabileceği yaygın senaryolar arasında, kullanıcının yönetici olup olmamasına göre farklı servislere sahip uygulamalar yer alır.

```ts
export const ROUTES: Route[] = [
  {
    path: 'admin',
    providers: [AdminService, {provide: ADMIN_API_KEY, useValue: '12345'}],
    children: [
      {path: 'users', component: AdminUsers},
      {path: 'teams', component: AdminTeams},
    ],
  },
  // ... ADMIN_API_KEY veya AdminService'e erişimi olmayan
  //     diğer uygulama route'ları.
];
```

Bu kod örneğinde, `admin` yolu yalnızca kendi bölümündeki alt rotalara sunulan korumalı bir `ADMIN_API_KEY` veri özelliği içerir. Sonuç olarak, başka hiçbir yol `ADMIN_API_KEY` aracılığıyla sağlanan verilere erişemez.

Sağlayıcılar ve Angular'da enjeksiyon hakkında daha fazla bilgi için [Bağımlılık enjeksiyonu kılavuzuna](/guide/di) bakın.

## Route'larla veri ilişkilendirme

Rota verileri, rotalara ek bilgi eklemenizi sağlar. Bu verilere göre bileşenlerin nasıl davranacağını yapılandırabilirsiniz.

Rota verileriyle çalışmanın iki yolu vardır: sabit kalan statik veriler ve çalışma zamanı koşullarına göre değişebilen dinamik veriler.

### Statik veri

Rota bazlı meta verileri (örneğin analitik izleme, izinler vb.) merkezileştirmek amacıyla `data` özelliği aracılığıyla bir rotayla rastgele statik veriler ilişkilendirebilirsiniz:

```ts
import {Routes} from '@angular/router';
import {Home} from './home';
import {About} from './about';
import {Products} from './products';

const routes: Routes = [
  {
    path: 'about',
    component: About,
    data: {analyticsId: '456'},
  },
  {
    path: '',
    component: Home,
    data: {analyticsId: '123'},
  },
];
```

Bu kod örneğinde, ana sayfa ve hakkında sayfası, ilgili bileşenlerinde sayfa izleme analitiği için kullanılacak belirli `analyticsId` ile yapılandırılmıştır.

Bu statik verileri `ActivatedRoute` enjekte ederek okuyabilirsiniz. Ayrıntılar için [Rota durumunu okuma](/guide/routing/read-route-state) bölümüne bakın.

### Veri çözücüler ile dinamik veri

Bir rotaya dinamik veri sağlamanız gerektiğinde, [rota veri çözücüleri kılavuzuna](/guide/routing/data-resolvers) göz atın.

## İç İçe Route'lar

İç içe rotalar, alt rotalar olarak da bilinir ve URL'ye göre değişen bir alt görünüme sahip bir bileşen için daha karmaşık navigasyon rotalarını yönetmek için kullanılan yaygın bir tekniktir.

<img alt="Diagram to illustrate nested routes" src="assets/images/guide/router/nested-routing-diagram.svg">

`children` özelliği ile herhangi bir rota tanımına alt rotalar ekleyebilirsiniz:

```ts
const routes: Routes = [
  {
    path: 'product/:id',
    component: Product,
    children: [
      {
        path: 'info',
        component: ProductInfo,
      },
      {
        path: 'reviews',
        component: ProductReviews,
      },
    ],
  },
];
```

Yukarıdaki örnek, bir ürün sayfası için kullanıcının URL'ye göre ürün bilgisi veya yorumların görüntülenip görüntülenmeyeceğini değiştirmesine olanak tanıyan bir rota tanımlar.

`children` özelliği, bir `Route` nesneleri dizisi kabul eder.

Alt rotaları görüntülemek için üst bileşen (yukarıdaki örnekte `Product`) kendi `<router-outlet>` öğesini içerir.

```angular-html
<!-- Product -->
<article>
  <h1>Product {{ id }}</h1>
  <router-outlet />
</article>
```

Yapılandırmaya alt rotalar ekledikten ve bileşene bir `<router-outlet>` ekledikten sonra, alt rotalarla eşleşen URL'ler arasında navigasyon yalnızca iç içe outlet'i günceller.

## Sonraki adımlar

<docs-pill-row>
  <docs-pill href="/guide/routing/loading-strategies" title="Route Loading Strategies"/>
  <docs-pill href="/guide/routing/show-routes-with-outlets" title="Display the contents of your routes with Outlets"/>
</docs-pill-row>
