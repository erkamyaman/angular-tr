# Sunucu ve hibrit render

Angular, tüm uygulamaları varsayılan olarak istemci tarafında render edilmiş (CSR) olarak gönderir. Bu yaklaşım hafif bir başlangıç yükü sağlarken, daha yavaş yükleme süreleri, düşük performans metrikleri ve daha yüksek kaynak talepleri gibi ödünler getirir; çünkü kullanıcının cihazı hesaplamaların çoğunu yapar. Sonuç olarak, birçok uygulama sunucu tarafı render'ı (SSR) hibrit bir render stratejisine entegre ederek önemli performans iyileştirmeleri elde eder.

## Hibrit render nedir?

Hibrit render, geliştiricilerin Angular uygulamanızı optimize etmek için sunucu tarafı render (SSR), ön-render (aynı zamanda "statik site oluşturma" veya SSG olarak bilinir) ve istemci tarafı render (CSR) avantajlarından yararlanmasına olanak tanır. Uygulamanızın farklı bölümlerinin nasıl render edileceği üzerinde ayrıntılı kontrol sağlayarak kullanıcılarınıza mümkün olan en iyi deneyimi sunar.

## Hibrit render'ı kurma

`--ssr` bayrağını Angular CLI `ng new` komutuyla kullanarak hibrit render ile **yeni** bir proje oluşturabilirsiniz:

```shell
ng new --ssr
```

Mevcut bir projeye `ng add` komutuyla sunucu tarafı render ekleyerek de hibrit render'ı etkinleştirebilirsiniz:

```shell
ng add @angular/ssr
```

NOTE: Varsayılan olarak, Angular tüm uygulamanızı ön-render eder ve bir sunucu dosyası oluşturur. Bunu devre dışı bırakıp tamamen statik bir uygulama oluşturmak için `outputMode`'u `static` olarak ayarlayın. SSR'yi etkinleştirmek için sunucu rotalarını `RenderMode.Server` kullanacak şekilde güncelleyin. Daha fazla ayrıntı için [`Server routing`](#sunucu-yönlendirme) ve [`Generate a fully static application`](#generate-a-fully-static-application) bölümlerine bakın.

## Sunucu yönlendirme

### Sunucu rotalarını yapılandırma

Bir [`ServerRoute`](api/ssr/ServerRoute 'API reference') nesneleri dizisi bildirerek sunucu rota yapılandırması oluşturabilirsiniz. Bu yapılandırma genellikle `app.routes.server.ts` adlı bir dosyada bulunur.

```typescript
// app.routes.server.ts
import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '', // Bu, "/" rotasını istemcide render eder (CSR)
    renderMode: RenderMode.Client,
  },
  {
    path: 'about', // Bu sayfa statiktir, bu yüzden ön-render ediyoruz (SSG)
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'profile', // Bu sayfa kullanıcıya özel veri gerektirir, bu yüzden SSR kullanıyoruz
    renderMode: RenderMode.Server,
  },
  {
    path: '**', // Diğer tüm rotalar sunucuda render edilecektir (SSR)
    renderMode: RenderMode.Server,
  },
];
```

Bu yapılandırmayı [`withRoutes`](api/ssr/withRoutes 'API reference') fonksiyonunu kullanarak [`provideServerRendering`](api/ssr/provideServerRendering 'API reference') ile uygulamanıza ekleyebilirsiniz:

```typescript
import {provideServerRendering, withRoutes} from '@angular/ssr';
import {serverRoutes} from './app.routes.server';

// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // ... diğer sağlayıcılar ...
  ],
};
```

[App shell kalıbını](ecosystem/service-workers/app-shell) kullanırken, istemci tarafında render edilen rotalar için app shell olarak kullanılacak bileşeni belirtmeniz gerekir. Bunu yapmak için [`withAppShell`](api/ssr/withAppShell 'API reference') özelliğini kullanın:

```typescript
import {provideServerRendering, withRoutes, withAppShell} from '@angular/ssr';
import {AppShell} from './app-shell';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes), withAppShell(AppShell)),
    // ... diğer sağlayıcılar ...
  ],
};
```

### Render modları

Sunucu rota yapılandırması, uygulamanızdaki her rotanın nasıl render edileceğini bir [`RenderMode`](api/ssr/RenderMode 'API reference') ayarlayarak belirtmenize olanak tanır:

| Render modu         | Açıklama                                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Server (SSR)**    | Her istek için uygulamayı sunucuda render eder ve tarayıcıya tamamen doldurulmuş bir HTML sayfası gönderir. |
| **Client (CSR)**    | Uygulamayı tarayıcıda render eder. Bu, varsayılan Angular davranışıdır.                                     |
| **Prerender (SSG)** | Derleme zamanında uygulamayı ön-render eder ve her rota için statik HTML dosyaları oluşturur.               |

#### Render modu seçme

Her render modunun farklı avantajları ve dezavantajları vardır. Uygulamanızın belirli ihtiyaçlarına göre render modları seçebilirsiniz.

##### İstemci tarafı render (CSR)

İstemci tarafı render, en basit geliştirme modeline sahiptir çünkü her zaman bir web tarayıcısında çalıştığını varsayan kod yazabilirsiniz. Bu, tarayıcıda çalıştığını varsayan geniş bir istemci tarafı kütüphane yelpazesi kullanmanızı sağlar.

İstemci tarafı render genellikle diğer render modlarından daha kötü performansa sahiptir çünkü kullanıcı render edilmiş herhangi bir içeriği görmeden önce sayfanızın JavaScript'ini indirmesi, ayrıştırması ve çalıştırması gerekir. Sayfanız render sırasında sunucudan daha fazla veri alıyorsa, kullanıcılar tam içeriği görüntülemek için bu ek istekleri de beklemek zorundadır.

Sayfanız arama motorları tarafından dizine ekleniyorsa, istemci tarafı render arama motoru optimizasyonunu (SEO) olumsuz etkileyebilir çünkü arama motorlarının bir sayfayı dizine eklerken çalıştırdıkları JavaScript miktarında sınırlamalar vardır.

İstemci tarafı render sırasında, sunucunun statik JavaScript varlıkları sunmak dışında bir sayfa render etmek için herhangi bir iş yapması gerekmez. Sunucu maliyeti bir endişeyse bu faktörü değerlendirebilirsiniz.

[Service worker'lar](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) ile kurulabilir, çevrimdışı deneyimleri destekleyen uygulamalar, bir sunucuyla iletişim kurmaya gerek kalmadan istemci tarafı render'a güvenebilir.

##### Sunucu tarafı render (SSR)

Sunucu tarafı render, istemci tarafı render'a göre daha hızlı sayfa yüklemeleri sunar. JavaScript'in indirilmesini ve çalıştırılmasını beklemek yerine, sunucu tarayıcıdan bir istek aldığında doğrudan bir HTML belgesi render eder. Kullanıcı yalnızca sunucunun veri getirmesi ve istenen sayfayı render etmesi için gereken gecikmeyi yaşar. Bu mod ayrıca tarayıcıdan ek ağ istekleri yapma ihtiyacını da ortadan kaldırır çünkü kodunuz sunucuda render sırasında veri getirebilir.

Sunucu tarafı render genellikle mükemmel arama motoru optimizasyonuna (SEO) sahiptir çünkü arama motorları tamamen render edilmiş bir HTML belgesi alır.

Sunucu tarafı render, tarayıcı API'lerine kesinlikle bağımlı olmayan kod yazmanızı gerektirir ve tarayıcıda çalıştığını varsayan JavaScript kütüphanesi seçiminizi sınırlar.

Sunucu tarafı render sırasında, sunucunuz her istek için bir HTML yanıtı üretmek üzere Angular'ı çalıştırır ve bu da sunucu barındırma maliyetlerini artırabilir.

##### Derleme zamanı ön-render

Ön-render, hem istemci tarafı render hem de sunucu tarafı render'a göre daha hızlı sayfa yüklemeleri sunar. Ön-render, HTML belgelerini _derleme zamanında_ oluşturduğundan, sunucu herhangi bir ek iş yapmadan isteklere doğrudan statik HTML belgesiyle yanıt verebilir.

Ön-render, bir sayfayı render etmek için gerekli tüm bilgilerin _derleme zamanında_ mevcut olmasını gerektirir. Bu, ön-render edilmiş sayfaların sayfayı yükleyen belirli kullanıcıya ait herhangi bir veri içeremeyeceği anlamına gelir. Ön-render, temel olarak uygulamanızın tüm kullanıcıları için aynı olan sayfalar için kullanışlıdır.

Ön-render derleme zamanında gerçekleştiğinden, üretim derlemelerinize önemli süre ekleyebilir. Çok sayıda HTML belgesi üretmek için [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') kullanmak, dağıtımlarınızın toplam dosya boyutunu etkileyebilir ve dolayısıyla daha yavaş dağıtımlara yol açabilir.

Ön-render genellikle mükemmel arama motoru optimizasyonuna (SEO) sahiptir çünkü arama motorları tamamen render edilmiş bir HTML belgesi alır.

Ön-render, tarayıcı API'lerine kesinlikle bağımlı olmayan kod yazmanızı gerektirir ve tarayıcıda çalıştığını varsayan JavaScript kütüphanesi seçiminizi sınırlar.

Ön-render, sunucu isteği başına son derece az ek yük getirir çünkü sunucunuz statik HTML belgeleriyle yanıt verir. Statik dosyalar ayrıca daha hızlı sonraki sayfa yüklemeleri için İçerik Dağıtım Ağları (CDN'ler), tarayıcılar ve ara önbellekleme katmanları tarafından kolayca önbelleğe alınabilir. Tamamen statik siteler yalnızca bir CDN veya statik dosya sunucusu aracılığıyla da dağıtılabilir ve uygulamanız için özel bir sunucu çalışma zamanı sürdürme ihtiyacını ortadan kaldırır. Bu, bir uygulama web sunucusundan işi boşaltarak ölçeklenebilirliği artırır ve özellikle yüksek trafikli uygulamalar için faydalı olur.

NOTE: Angular service worker kullanırken, ilk istek sunucuda render edilir, ancak sonraki tüm istekler service worker tarafından işlenir ve istemci tarafında render edilir.

### Başlıkları ve durum kodlarını ayarlama

`ServerRoute` yapılandırmasındaki `headers` ve `status` özelliklerini kullanarak bireysel sunucu rotaları için özel başlıklar ve durum kodları ayarlayabilirsiniz.

```typescript
// app.routes.server.ts
import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'profile',
    renderMode: RenderMode.Server,
    headers: {
      'X-My-Custom-Header': 'some-value',
    },
    status: 201,
  },
  // ... diğer rotalar
];
```

### Yönlendirmeler

Angular, rota yapılandırmalarındaki [`redirectTo`](api/router/Route#redirectTo 'API reference') özelliği tarafından belirtilen yönlendirmeleri sunucu tarafında farklı şekilde işler.

**Server-Side Rendering (SSR)**
Yönlendirmeler, sunucu tarafı render işlemi içinde standart HTTP yönlendirmeleri (örneğin, 301, 302) kullanılarak gerçekleştirilir.

**Prerendering (SSG)**
Yönlendirmeler, ön-render edilmiş HTML'de [`<meta http-equiv="refresh">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#refresh) etiketleri kullanılarak "yumuşak yönlendirmeler" olarak uygulanır.

### Derleme zamanı ön-render'ı (SSG) özelleştirme

[`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') kullanırken, ön-render ve sunma işlemini özelleştirmek için birçok yapılandırma seçeneği belirleyebilirsiniz.

#### Parameterized routes

[`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') ile her rota için, hangi belirli parametrelerin ayrı ön-render edilmiş belgeler üreteceğini kontrol etmenize olanak tanıyan bir [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') fonksiyonu belirtebilirsiniz.

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') fonksiyonu, bir nesneler dizisine çözümlenen bir `Promise` döndürür. Her nesne, rota parametre adından değere bir anahtar-değer eşlemesidir. Örneğin, `post/:id` gibi bir rota tanımlarsanız, `getPrerenderParams` `[{id: 123}, {id: 456}]` dizisini döndürebilir ve böylece `post/123` ve `post/456` için ayrı belgeler render eder.

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') gövdesi, bağımlılıkları enjekte etmek ve hangi rotaların ön-render edileceğini belirlemek için herhangi bir iş yapmak üzere Angular'ın [`inject`](api/core/inject 'API reference') fonksiyonunu kullanabilir. Bu genellikle parametre değerleri dizisini oluşturmak için veri getirme isteklerinde bulunmayı içerir.

Bu fonksiyonu ayrıca catch-all rotalarla (örneğin, `/**`) kullanabilirsiniz; burada parametre adı `"**"` olacak ve dönüş değeri yolun segmentleri olacaktır, örneğin `foo/bar`. Bunlar daha karmaşık rota yapılandırmasını işlemek için diğer parametrelerle (örneğin, `/post/:id/**`) birleştirilebilir.

```ts
// app.routes.server.ts
import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(PostService);
      const ids = await dataService.getIds(); // Assuming this returns ['1', '2', '3']

      return ids.map((id) => ({id})); // Generates paths like: /post/1, /post/2, /post/3
    },
  },
  {
    path: 'post/:id/**',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
        {id: '1', '**': 'foo/3'},
        {id: '2', '**': 'bar/4'},
      ]; // Generates paths like: /post/1/foo/3, /post/2/bar/4
    },
  },
];
```

[`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') yalnızca [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') için geçerli olduğundan, bu fonksiyon her zaman _derleme zamanında_ çalışır. `getPrerenderParams`, veri için tarayıcıya özgü veya sunucuya özgü API'lere güvenmemelidir.

IMPORTANT: `getPrerenderParams` içinde [`inject`](api/core/inject 'API reference') kullanırken, `inject`'in senkron olarak kullanılması gerektiğini lütfen unutmayın. Asenkron geri çağırmalarda veya herhangi bir `await` ifadesinden sonra çağrılamaz. Daha fazla bilgi için `runInInjectionContext`'e bakın.

#### Fallback strategies

[`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference') modu kullanırken, ön-render edilmemiş yollar için istekleri işlemek üzere bir geri dönüş stratejisi belirleyebilirsiniz.

Kullanılabilir geri dönüş stratejileri şunlardır:

- **Server:** Sunucu tarafı render'a geri döner. Herhangi bir `fallback` özelliği belirtilmezse bu **varsayılan** davranıştır.
- **Client:** İstemci tarafı render'a geri döner.
- **None:** Geri dönüş yok. Angular, ön-render edilmemiş yollar için istekleri işlemez.

```ts
// app.routes.server.ts
import {RenderMode, PrerenderFallback, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client, // Fallback to CSR if not prerendered
    async getPrerenderParams() {
      // This function returns an array of objects representing prerendered posts at the paths:
      // `/post/1`, `/post/2`, and `/post/3`.
      // The path `/post/4` will utilize the fallback behavior if it's requested.
      return [{id: 1}, {id: 2}, {id: 3}];
    },
  },
];
```

## Authoring server-compatible components

Bazı yaygın tarayıcı API'leri ve yetenekleri sunucuda mevcut olmayabilir. Uygulamalar `window`, `document`, `navigator` veya `location` gibi tarayıcıya özgü genel nesneleri ve `HTMLElement`'in belirli özelliklerini kullanamazlar.

Genel olarak, tarayıcıya özgü sembollere dayanan kod yalnızca tarayıcıda çalıştırılmalıdır, sunucuda değil. Bu, `afterEveryRender` ve `afterNextRender` yaşam döngüsü kancaları aracılığıyla sağlanabilir. Bunlar yalnızca tarayıcıda çalıştırılır ve sunucuda atlanır.

```angular-ts
import {Component, viewChild, afterNextRender} from '@angular/core';

@Component({
  selector: 'my-cmp',
  template: `<span #content>{{ ... }}</span>`,
})
export class MyComponent {
  contentRef = viewChild.required<ElementRef>('content');

  constructor() {
    afterNextRender(() => {
      // Safe to check `scrollHeight` because this will only run in the browser, not the server.
      console.log('content height: ' + this.contentRef().nativeElement.scrollHeight);
    });
  }
}
```

NOTE: `isPlatformBrowser` veya `isPlatformServer` ile çalışma zamanı kontrolleri yerine [platforma özgü sağlayıcıları](guide/ssr#providing-platform-specific-implementations) tercih edin.

IMPORTANT: Sunucu ve istemcide farklı içerik render etmek için `@if` veya diğer koşullu ifadelerle şablonlarda `isPlatformBrowser` kullanmaktan kaçının. Bu, hidrasyon uyumsuzluklarına ve düzen kaymalarına neden olarak kullanıcı deneyimini ve [Core Web Vitals](https://web.dev/learn-core-web-vitals/) değerlerini olumsuz etkiler. Bunun yerine, tarayıcıya özgü başlatma için `afterNextRender` kullanın ve render edilen içeriği platformlar arasında tutarlı tutun.

## Setting providers on the server

Sunucu tarafında, üst düzey sağlayıcı değerleri, uygulama kodu ilk kez ayrıştırılıp değerlendirildiğinde bir kez ayarlanır.
Bu, `useValue` ile yapılandırılmış sağlayıcıların sunucu uygulaması yeniden başlatılana kadar birden fazla istek boyunca değerlerini koruyacağı anlamına gelir.

Her istek için yeni bir değer oluşturmak istiyorsanız, `useFactory` ile bir fabrika sağlayıcısı kullanın. Fabrika fonksiyonu her gelen istek için çalışır ve her seferinde yeni bir değer oluşturulup token'a atanmasını sağlar.

## Providing platform-specific implementations

Uygulamanız tarayıcı ve sunucuda farklı davranış gerektirdiğinde, her platform için ayrı servis uygulamaları sağlayın. Bu yaklaşım, platform mantığını özel servislerde merkezileştirir.

```ts
export abstract class AnalyticsService {
  abstract trackEvent(name: string): void;
}
```

Tarayıcı uygulamasını oluşturun:

```ts
@Injectable()
export class BrowserAnalyticsService implements AnalyticsService {
  trackEvent(name: string): void {
    // Sends the event to the browser-based third-party analytics provider
  }
}
```

Sunucu uygulamasını oluşturun:

```ts
@Injectable()
export class ServerAnalyticsService implements AnalyticsService {
  trackEvent(name: string): void {
    // Records the event on the server
  }
}
```

Ana uygulama yapılandırmanızda tarayıcı uygulamasını kaydedin:

```ts
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [{provide: AnalyticsService, useClass: BrowserAnalyticsService}],
};
```

Sunucu yapılandırmanızda sunucu uygulamasıyla geçersiz kılın:

```ts
// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [{provide: AnalyticsService, useClass: ServerAnalyticsService}],
};
```

Servisi bileşenlerinize enjekte edin ve kullanın:

```ts
@Component({
  /*...*/
})
export class Checkout {
  private analytics = inject(AnalyticsService);

  onAction() {
    this.analytics.trackEvent('action');
  }
}
```

## Accessing Document via DI

Sunucu tarafı render ile çalışırken, `document` gibi tarayıcıya özgü global değişkenlere doğrudan başvurmaktan kaçınmalısınız. Bunun yerine, belge nesnesine platforma agnostik bir şekilde erişmek için [`DOCUMENT`](api/core/DOCUMENT) token'ını kullanın.

```ts
import {Injectable, inject, DOCUMENT} from '@angular/core';

@Injectable({providedIn: 'root'})
export class CanonicalLinkService {
  private readonly document = inject(DOCUMENT);

  // During server rendering, inject a <link rel="canonical"> tag
  // so the generated HTML includes the correct canonical URL
  setCanonical(href: string): void {
    const link = this.document.createElement('link');
    link.rel = 'canonical';
    link.href = href;
    this.document.head.appendChild(link);
  }
}
```

HELPFUL: Meta etiketlerini yönetmek için Angular `Meta` servisini sağlar.

## Accessing Request and Response via DI

`@angular/core` paketi, sunucu tarafı render ortamıyla etkileşim için birkaç token sağlar. Bu token'lar, SSR sırasında Angular uygulamanızdaki önemli bilgilere ve nesnelere erişmenizi sağlar.

- **[`REQUEST`](api/core/REQUEST 'API reference'):** Web API'sinden [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) türünde olan mevcut istek nesnesine erişim sağlar. Bu, başlıklara, çerezlere ve diğer istek bilgilerine erişmenize olanak tanır.
- **[`RESPONSE_INIT`](api/core/RESPONSE_INIT 'API reference'):** Web API'sinden [`ResponseInit`](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#parameters) türünde olan yanıt başlatma seçeneklerine erişim sağlar. Bu, yanıt için başlıkları ve durum kodunu dinamik olarak ayarlamanıza olanak tanır. Çalışma zamanında belirlenmesi gereken başlıkları veya durum kodlarını ayarlamak için bu token'ı kullanın.
- **[`REQUEST_CONTEXT`](api/core/REQUEST_CONTEXT 'API reference'):** Mevcut istekle ilgili ek bağlam sağlar. Bu bağlam, [`handle`](api/ssr/AngularAppEngine#handle 'API reference') fonksiyonunun ikinci parametresi olarak geçirilebilir. Genellikle, standart Web API'sinin parçası olmayan ek istekle ilgili bilgi sağlamak için kullanılır.

```angular-ts
import {inject, REQUEST} from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: `<h1>My Component</h1>`,
})
export class MyComponent {
  constructor() {
    const request = inject(REQUEST);
    console.log(request?.url);
  }
}
```

<!-- UL is used below as otherwise the list will not be include as part of the note. -->
<!-- prettier-ignore-start -->

IMPORTANT: Yukarıdaki token'lar aşağıdaki senaryolarda `null` olacaktır:<ul class="docs-list">
  <li>Derleme işlemleri sırasında.</li>
  <li>Uygulama tarayıcıda (CSR) render edildiğinde.</li>
  <li>Statik site oluşturma (SSG) yapılırken.</li>
  <li>Geliştirme sırasında rota çıkarma esnasında (istek anında).</li>
</ul>

<!-- prettier-ignore-end -->

## Generate a fully static application

Varsayılan olarak, Angular tüm uygulamanızı ön-render eder ve istekleri işlemek için bir sunucu dosyası oluşturur. Bu, uygulamanızın kullanıcılara ön-render edilmiş içerik sunmasına olanak tanır. Ancak, sunucu olmadan tamamen statik bir site tercih ediyorsanız, `angular.json` yapılandırma dosyanızda `outputMode`'u `static` olarak ayarlayarak bu davranıştan çıkabilirsiniz.

`outputMode` `static` olarak ayarlandığında, Angular derleme zamanında her rota için ön-render edilmiş HTML dosyaları oluşturur, ancak bir sunucu dosyası oluşturmaz veya uygulamayı sunmak için bir Node.js sunucusu gerektirmez. Bu, bir arka uç sunucusunun gerekli olmadığı statik barındırma sağlayıcılarına dağıtım için kullanışlıdır.

Bunu yapılandırmak için `angular.json` dosyanızı aşağıdaki gibi güncelleyin:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "outputMode": "static"
          }
        }
      }
    }
  }
}
```

## Caching data when using HttpClient

`HttpClient`, sunucuda çalışırken giden ağ isteklerini önbelleğe alır. Bu bilgi serileştirilir ve sunucudan gönderilen ilk HTML'in bir parçası olarak tarayıcıya aktarılır. Tarayıcıda, `HttpClient` önbellekte veri olup olmadığını kontrol eder ve varsa, ilk uygulama render'ı sırasında yeni bir HTTP isteği yapmak yerine onu yeniden kullanır. `HttpClient`, bir uygulama tarayıcıda çalışırken [kararlı](api/core/ApplicationRef#isStable) hale geldikten sonra önbelleği kullanmayı bırakır.

### Configuring the caching options

Angular'ın sunucu tarafı render (SSR) sırasında HTTP yanıtlarını nasıl önbelleğe aldığını ve hidrasyon sırasında yeniden kullandığını `HttpTransferCacheOptions` yapılandırarak özelleştirebilirsiniz.
Bu yapılandırma, `provideClientHydration()` içinde `withHttpTransferCacheOptions` kullanılarak global olarak sağlanır.

Varsayılan olarak, `HttpClient` `Authorization` veya `Proxy-Authorization` başlıkları içermeyen tüm `HEAD` ve `GET` isteklerini önbelleğe alır. Bu ayarları hidrasyon yapılandırmasında `withHttpTransferCacheOptions` kullanarak geçersiz kılabilirsiniz.

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideClientHydration, withHttpTransferCacheOptions} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideClientHydration(
      withHttpTransferCacheOptions({
        includeHeaders: ['ETag', 'Cache-Control'],
        filter: (req) => !req.url.includes('/api/profile'),
        includePostRequests: true,
        includeRequestsWithAuthHeaders: false,
      }),
    ),
  ],
});
```

---

### `includeHeaders`

Sunucu yanıtından hangi başlıkların önbelleğe alınan girişlere dahil edilmesi gerektiğini belirtir.
Varsayılan olarak hiçbir başlık dahil edilmez.

```ts
withHttpTransferCacheOptions({
  includeHeaders: ['ETag', 'Cache-Control'],
});
```

IMPORTANT: Kimlik doğrulama token'ları gibi hassas başlıkları dahil etmekten kaçının. Bunlar, istekler arasında kullanıcıya özgü verilerin sızmasına neden olabilir.

---

### `includePostRequests`

Varsayılan olarak, yalnızca `GET` ve `HEAD` istekleri önbelleğe alınır.
GraphQL sorguları gibi okuma işlemleri olarak kullanıldığında `POST` istekleri için önbelleğe almayı etkinleştirebilirsiniz.

```ts
withHttpTransferCacheOptions({
  includePostRequests: true,
});
```

Bunu yalnızca `POST` istekleri **idempotent** olduğunda ve sunucu ile istemci render'ları arasında yeniden kullanılması güvenli olduğunda kullanın.

---

### `includeRequestsWithAuthHeaders`

`Authorization` veya `Proxy-Authorization` başlıkları içeren isteklerin önbelleğe alma için uygun olup olmadığını belirler.
Varsayılan olarak, kullanıcıya özgü yanıtların önbelleğe alınmasını önlemek için bunlar hariç tutulur.

```ts
withHttpTransferCacheOptions({
  includeRequestsWithAuthHeaders: true,
});
```

Bunu yalnızca kimlik doğrulama başlıkları yanıt içeriğini **etkilemediğinde** (örneğin, analitik API'leri için genel token'lar) etkinleştirin.

### Per‑request overrides

`transferCache` istek seçeneğini kullanarak belirli bir istek için önbelleğe alma davranışını geçersiz kılabilirsiniz.

```ts
// Include specific headers for this request
http.get('/api/profile', {transferCache: {includeHeaders: ['CustomHeader']}});
```

### Disabling caching

Sunucudan gönderilen isteklerin HTTP önbelleğe alınmasını global olarak veya bireysel olarak devre dışı bırakabilirsiniz.

#### Globally

Uygulamanızdaki tüm istekler için önbelleğe almayı devre dışı bırakmak için `withNoHttpTransferCache` özelliğini kullanın:

```ts
import {
  bootstrapApplication,
  provideClientHydration,
  withNoHttpTransferCache,
} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideClientHydration(withNoHttpTransferCache())],
});
```

#### Filtering

Belirli istekler için önbelleğe almayı seçici olarak devre dışı bırakmak amacıyla `withHttpTransferCacheOptions` içindeki [`filter`](api/common/http/HttpTransferCacheOptions) seçeneğini de kullanabilirsiniz. Örneğin, belirli bir API uç noktası için önbelleğe almayı devre dışı bırakabilirsiniz:

```ts
import {
  bootstrapApplication,
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideClientHydration(
      withHttpTransferCacheOptions({
        filter: (req) => !req.url.includes('/api/sensitive-data'),
      }),
    ),
  ],
});
```

Bu seçeneği, kullanıcıya özgü veya dinamik verilere sahip uç noktaları (örneğin `/api/profile`) hariç tutmak için kullanın.

#### Per-request

Bireysel bir istek için önbelleğe almayı devre dışı bırakmak amacıyla, bir `HttpRequest`'te [`transferCache`](api/common/http/HttpRequest#transferCache) seçeneğini belirtebilirsiniz.

```ts
httpClient.get('/api/sensitive-data', {transferCache: false});
```

NOTE: Uygulamanız sunucu ve istemcide API çağrıları yapmak için farklı HTTP kaynakları kullanıyorsa, `HTTP_TRANSFER_CACHE_ORIGIN_MAP` token'ı bu kaynaklar arasında bir eşleme oluşturmanıza olanak tanır, böylece `HttpTransferCache` özelliği bu istekleri aynı istekler olarak tanıyabilir ve istemcide hidrasyon sırasında sunucuda önbelleğe alınan verileri yeniden kullanabilir.

## Configuring a server

### Node.js

`@angular/ssr/node`, Node.js ortamları için özelleştirilmiş `@angular/ssr`'yi genişletir. Node.js uygulamanızda sunucu tarafı render'ı uygulamayı kolaylaştıran API'ler sağlar. Fonksiyonların tam listesi ve kullanım örnekleri için [`@angular/ssr/node` API referansına](api/ssr/node/AngularNodeAppEngine) bakın.

```ts
// server.ts
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use('*', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next(); // Pass control to the next middleware
      }
    })
    .catch(next);
});

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
```

### Non-Node.js

`@angular/ssr`, Node.js dışındaki platformlarda Angular uygulamanızı sunucu tarafı render etmek için temel API'ler sağlar. Web API'sinden standart [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) ve [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) nesnelerini kullanır ve Angular SSR'yi çeşitli sunucu ortamlarına entegre etmenizi sağlar. Ayrıntılı bilgi ve örnekler için [`@angular/ssr` API referansına](api/ssr/AngularAppEngine) bakın.

```ts
// server.ts
import {AngularAppEngine, createRequestHandler} from '@angular/ssr';

const angularApp = new AngularAppEngine();

/**
 * This is a request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createRequestHandler(async (req: Request) => {
  const res: Response | null = await angularApp.render(req);

  // ...
});
```

## Security

Sunucu Tarafı İstek Sahteciliğini (SSRF) önleme ve izin verilen ana bilgisayarları yapılandırma hakkında ayrıntılı bilgi için [Sunucu tarafı güvenlik](best-practices/security#sunucu-tarafı-istek-sahteciliğini-ssrf-önleme) kılavuzuna bakın.
