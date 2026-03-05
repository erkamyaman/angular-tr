# Router reference

Aşağıdaki bölümler bazı temel yönlendirici kavramlarını ve terminolojisini vurgular.

## Router events

Her navigasyon sırasında `Router`, `Router.events` özelliği aracılığıyla navigasyon olayları yayınlar.
Bu olaylar aşağıdaki tabloda gösterilmektedir.

| Yönlendirici olayı                                        | Ayrıntılar                                                                                                                                                                            |
| :-------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`NavigationStart`](api/router/NavigationStart)           | Navigasyon başladığında tetiklenir.                                                                                                                                                   |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | `Router` bir rota yapılandırmasını tembel yüklemeden önce tetiklenir.                                                                                                                 |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | Bir rota tembel yüklendikten sonra tetiklenir.                                                                                                                                        |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | Router URL'yi ayrıştırdığında ve rotalar tanındığında tetiklenir.                                                                                                                     |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | Router yönlendirmenin Koruyucu aşamasını başlattığında tetiklenir.                                                                                                                    |
| [`ChildActivationStart`](api/router/ChildActivationStart) | Router bir rotanın alt rotalarını etkinleştirmeye başladığında tetiklenir.                                                                                                            |
| [`ActivationStart`](api/router/ActivationStart)           | Router bir rotayı etkinleştirmeye başladığında tetiklenir.                                                                                                                            |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | Router yönlendirmenin Koruyucu aşamasını başarıyla bitirdiğinde tetiklenir.                                                                                                           |
| [`ResolveStart`](api/router/ResolveStart)                 | Router yönlendirmenin Çözümleme aşamasını başlattığında tetiklenir.                                                                                                                   |
| [`ResolveEnd`](api/router/ResolveEnd)                     | Router yönlendirmenin Çözümleme aşamasını başarıyla bitirdiğinde tetiklenir.                                                                                                          |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | Router bir rotanın alt rotalarını etkinleştirmeyi bitirdiğinde tetiklenir.                                                                                                            |
| [`ActivationEnd`](api/router/ActivationEnd)               | Router bir rotayı etkinleştirmeyi bitirdiğinde tetiklenir.                                                                                                                            |
| [`NavigationEnd`](api/router/NavigationEnd)               | Navigasyon başarıyla sona erdiğinde tetiklenir.                                                                                                                                       |
| [`NavigationCancel`](api/router/NavigationCancel)         | Navigasyon iptal edildiğinde tetiklenir. Bu, bir Rota Koruyucusu navigasyon sırasında false döndürdüğünde veya `UrlTree` veya `RedirectCommand` döndürerek yönlendirdiğinde olabilir. |
| [`NavigationError`](api/router/NavigationError)           | Beklenmeyen bir hata nedeniyle navigasyon başarısız olduğunda tetiklenir.                                                                                                             |
| [`Scroll`](api/router/Scroll)                             | Bir kaydırma olayını temsil eder.                                                                                                                                                     |

`withDebugTracing` özelliğini etkinleştirdiğinizde, Angular bu olayları konsola kaydeder.

## Router terminology

İşte temel `Router` terimleri ve anlamları:

| Yönlendirici bölümü           | Ayrıntılar                                                                                                                                                                                                                     |
| :---------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Router`                      | Aktif URL için uygulama bileşenini görüntüler. Bir bileşenden diğerine navigasyonu yönetir.                                                                                                                                    |
| `provideRouter`               | Uygulama görünümleri arasında navigasyon için gerekli servis sağlayıcılarını sunar.                                                                                                                                            |
| `RouterModule`                | Uygulama görünümleri arasında navigasyon için gerekli servis sağlayıcılarını ve direktifleri sunan ayrı bir NgModule.                                                                                                          |
| `Routes`                      | Her biri bir URL yolunu bir bileşene eşleyen Route dizisi tanımlar.                                                                                                                                                            |
| `Route`                       | Yönlendiricinin bir URL kalıbına göre bir bileşene nasıl navigasyon yapması gerektiğini tanımlar. Çoğu rota bir yol ve bir bileşen türünden oluşur.                                                                            |
| `RouterOutlet`                | Yönlendiricinin bir görünümü nerede göstereceğini işaretleyen direktif \(`<router-outlet>`\).                                                                                                                                  |
| `RouterLink`                  | Tıklanabilir bir HTML öğesini bir rotaya bağlama direktifi. Bir _dize_ veya _bağlantı parametreleri dizisine_ bağlı `routerLink` direktifine sahip bir öğeye tıklamak bir navigasyon tetikler.                                 |
| `RouterLinkActive`            | Öğe üzerinde veya içinde bulunan ilişkili `routerLink` aktif/inaktif olduğunda bir HTML öğesine sınıf ekleme/kaldırma direktifi. Daha iyi erişilebilirlik için aktif bir bağlantının `aria-current` değerini de ayarlayabilir. |
| `ActivatedRoute`              | Rota parametreleri, statik veriler, çözümlenmiş veriler, global sorgu parametreleri ve global fragment gibi rotaya özgü bilgileri içeren, her rota bileşenine sağlanan bir servis.                                             |
| `RouterState`                 | Rota ağacını dolaşmak için kolaylık yöntemleriyle birlikte, şu anda etkinleştirilen rotaların bir ağacını içeren yönlendiricinin geçerli durumu.                                                                               |
| Bağlantı parametreleri dizisi | Yönlendiricinin bir yönlendirme talimatı olarak yorumladığı bir dizi. Bu diziyi bir `RouterLink`'e bağlayabilir veya `Router.navigate` yöntemine argüman olarak aktarabilirsiniz.                                              |
| Yönlendirme bileşeni          | Yönlendirici navigasyonlarına göre görünümleri görüntüleyen `RouterOutlet`'e sahip bir Angular bileşeni.                                                                                                                       |

## `<base href>`

Yönlendirici, navigasyon için tarayıcının [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state') özelliğini kullanır.
`pushState`, uygulama içi URL yollarını özelleştirmenize olanak tanır; örneğin, `localhost:4200/crisis-center`.
Uygulama içi URL'ler sunucu URL'lerinden ayırt edilemez olabilir.

Modern HTML5 tarayıcıları `pushState`'i destekleyen ilk tarayıcılardı, bu yüzden birçok kişi bu URL'lere "HTML5 stili" URL'ler der.

HELPFUL: HTML5 stili navigasyon, yönlendiricinin varsayılanıdır.
[LocationStrategy ve tarayıcı URL stilleri](guide/routing/common-router-tasks#locationstrategy-and-browser-url-styles) bölümünde, HTML5 stilinin neden tercih edildiğini, davranışının nasıl ayarlanacağını ve gerekirse eski hash \(`#`\) stiline nasıl geçileceğini öğrenin.

`pushState` yönlendirmesinin çalışması için uygulamanızın `index.html` dosyasına bir [`<base href>` öğesi](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href') eklemeniz gerekir.
Tarayıcı, CSS dosyalarına, betiklere ve resimlere referans verirken göreceli URL'leri öneklemek için `<base href>` değerini kullanır.

`<base>` öğesini `<head>` etiketinin hemen sonrasına ekleyin.
Bu uygulama için olduğu gibi `app` klasörü uygulama kökü ise, `index.html`'deki `href` değerini burada gösterildiği gibi ayarlayın.

```html
<base href="/" />
```

### HTML5 URLs and the `<base href>`

Aşağıdaki yönergeler bir URL'nin farklı bölümlerine atıfta bulunacaktır.
Bu şema, bu bölümlerin neye atıfta bulunduğunu gösterir:

```text {hideCopy}
foo://example.com:8042/over/there?name=ferret#nose
\_/   \______________/\_________/ \_________/ \__/
 |           |            |            |        |
scheme    authority      path        query   fragment
```

Yönlendirici varsayılan olarak [HTML5 pushState](https://developer.mozilla.org/docs/Web/API/History_API#Adding_and_modifying_history_entries 'Browser history push-state') stilini kullansa da, bu stratejiyi bir `<base href>` ile yapılandırmanız gerekir.

Stratejiyi yapılandırmanın tercih edilen yolu, `index.html`'nin `<head>` bölümüne bir [`<base href>` öğesi](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href') etiketi eklemektir.

```angular-html
<base href="/" />
```

Bu etiket olmadan, uygulamaya "derin bağlantı" yapıldığında tarayıcı kaynakları \(resimler, CSS, betikler\) yükleyemeyebilir.

Bazı geliştiriciler, `<head>` veya `index.html` dosyasına erişimleri olmadığı için `<base>` öğesini ekleyemeyebilir.

Bu geliştiriciler aşağıdaki iki adımı izleyerek yine de HTML5 URL'lerini kullanabilir:

1. Yönlendiriciye uygun bir `APP_BASE_HREF` değeri sağlayın.
1. Tüm web kaynakları için kök URL'ler \(`authority` içeren URL'ler\) kullanın: CSS, resimler, betikler ve şablon HTML dosyaları.
   - `<base href>` `path` değeri "/" ile bitmelidir, çünkü tarayıcılar `path` içinde en sağdaki "`/`"'den sonraki karakterleri yok sayar
   - `<base href>` bir `query` bölümü içeriyorsa, `query` yalnızca sayfadaki bir bağlantının yolu boşsa ve `query`'si yoksa kullanılır.
     Bu, `<base href>` içindeki bir `query`'nin yalnızca `HashLocationStrategy` kullanılırken dahil edildiği anlamına gelir.

   - Sayfadaki bir bağlantı kök URL ise \(bir `authority`'ye sahipse\), `<base href>` kullanılmaz.
     Bu şekilde, bir authority'ye sahip `APP_BASE_HREF`, Angular tarafından oluşturulan tüm bağlantıların `<base href>` değerini yok saymasına neden olur.

   - `<base href>` içindeki bir fragment _asla_ korunmaz

`<base href>` değerinin hedef URI'ler oluşturmak için nasıl kullanıldığı hakkında daha eksiksiz bilgi için referansları dönüştürme konusundaki [RFC](https://tools.ietf.org/html/rfc3986#section-5.2.2) bölümüne bakın.

### `HashLocationStrategy`

`AppModule`'deki `RouterModule.forRoot()` fonksiyonunun ikinci argümanı olarak bir nesnede `useHash: true` sağlayarak `HashLocationStrategy` kullanın.

```ts
providers: [provideRouter(appRoutes, withHashLocation())];
```

`RouterModule.forRoot` kullanırken, bu ikinci argümandaki `useHash: true` ile yapılandırılır: `RouterModule.forRoot(routes, {useHash: true})`.
