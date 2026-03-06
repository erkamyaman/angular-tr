# Diğer Yaygın Yönlendirme Görevleri

Bu kılavuz, uygulamanızda Angular yönlendirici kullanımıyla ilişkili diğer bazı yaygın görevleri kapsar.

## Rota bilgisi alma

Genellikle, bir kullanıcı uygulamanızda gezinirken bir bileşenden diğerine bilgi aktarmak istersiniz.
Örneğin, market ürünlerinin bir alışveriş listesini görüntüleyen bir uygulama düşünün.
Listedeki her öğenin benzersiz bir `id`'si vardır.
Bir öğeyi düzenlemek için kullanıcılar, bir `EditGroceryItem` bileşeni açan Düzenle düğmesine tıklar.
Bu bileşenin, doğru bilgileri kullanıcıya gösterebilmesi için market ürününün `id`'sini almasını istersiniz.

Bu tür bilgileri uygulama bileşenlerinize aktarmak için bir rota kullanın.
Bunu yapmak için, `provideRouter` ile `withComponentInputBinding` özelliğini veya `RouterModule.forRoot`'un `bindToComponentInputs` seçeneğini kullanırsınız.

Bir rotadan bilgi almak için:

<docs-workflow>

<docs-step title="Add `withComponentInputBinding`">

`provideRouter` yöntemine `withComponentInputBinding` özelliğini ekleyin.

```ts
providers: [provideRouter(appRoutes, withComponentInputBinding())];
```

</docs-step>

<docs-step title="Add an `input` to the component">

Bileşeni, parametre adıyla eşleşen bir `input()` özelliğine sahip olacak şekilde güncelleyin.

```ts
id = input.required<string>();
hero = computed(() => this.service.getHero(id()));
```

</docs-step>
<docs-step title="Optional: Use a default value">
`withComponentInputBinding` etkinleştirildiğinde yönlendirici, geçerli rotaya göre tüm girişlere değer atar.
İsteğe bağlı bir sorgu parametresi eksik olduğunda gibi, giriş anahtarıyla eşleşen rota verisi yoksa yönlendirici `undefined` atar.
Bir girişin rota tarafından eşleştirilmeme olasılığı olduğunda `input` türüne `undefined` dahil etmelisiniz.

Girişte `transform` seçeneğini kullanarak veya `linkedSignal` ile yerel bir durum yöneterek varsayılan bir değer sağlayın.

```ts
id = input.required({
  transform: (maybeUndefined: string | undefined) => maybeUndefined ?? '0',
});
// veya
id = input<string | undefined>();
internalId = linkedSignal(() => this.id() ?? getDefaultId());
```

</docs-step>
</docs-workflow>

NOTE: Anahtar, değer çiftleri ile tüm rota verilerini bileşen girişlerine bağlayabilirsiniz: statik veya çözümlenmiş rota verileri, yol parametreleri, matris parametreleri ve sorgu parametreleri.
Üst bileşenlerin rota bilgilerini kullanmak istiyorsanız, yönlendirici `paramsInheritanceStrategy` seçeneğini ayarlamanız gerekir:
`withRouterConfig({paramsInheritanceStrategy: 'always'})`. Diğer mevcut ayarlar hakkında ayrıntılar için [yönlendirici yapılandırma seçeneklerine](guide/routing/customizing-route-behavior#router-yapılandırma-seçenekleri) bakın.

## 404 sayfası görüntüleme

404 sayfası görüntülemek için, `component` özelliğini 404 sayfanız için kullanmak istediğiniz bileşene ayarlayarak bir [joker rota](guide/routing/define-routes#joker-karakterler) kurun:

```ts
const routes: Routes = [
  {path: 'first-component', component: First},
  {path: 'second-component', component: Second},
  {path: '**', component: PageNotFound}, // 404 sayfası için joker rota
];
```

`**` `path`'ine sahip son rota bir joker rotadır.
İstenen URL, listedeki daha önceki yollardan hiçbiriyle eşleşmezse yönlendirici bu rotayı seçer ve kullanıcıyı `PageNotFound`'a yönlendirir.

## Bağlantı parametreleri dizisi

Bir bağlantı parametreleri dizisi, yönlendirici navigasyonu için aşağıdaki bileşenleri içerir:

- Hedef bileşene giden rotanın yolu
- Rota URL'sine giren zorunlu ve isteğe bağlı rota parametreleri

`RouterLink` direktifini böyle bir diziye şu şekilde bağlayın:

```angular-html
<a [routerLink]="['/heroes']">Heroes</a>
```

Bir rota parametresi belirtilirken aşağıdaki iki elemanlı bir dizidir:

```angular-html
<a [routerLink]="['/hero', hero.id]">
  <span class="badge">{{ hero.id }}</span
  >{{ hero.name }}
</a>
```

İsteğe bağlı rota parametrelerini `{ foo: 'foo' }` gibi bir nesnede sağlayın:

```angular-html
<a [routerLink]="['/crisis-center', {foo: 'foo'}]">Crisis Center</a>
```

Bu söz dizimi, belirli bir URL segmentiyle ilişkili isteğe bağlı parametreler olan matris parametrelerini aktarır. [Matris parametreleri](/guide/routing/read-route-state#matris-parametreleri) hakkında daha fazla bilgi edinin.

Bu üç örnek, tek seviyeli yönlendirmeye sahip bir uygulamanın ihtiyaçlarını karşılar.
Ancak, kriz merkezi gibi bir alt yönlendirici ile yeni bağlantı dizisi olasılıkları oluşturursunuz.

Aşağıdaki minimal `RouterLink` örneği, kriz merkezi için belirtilen varsayılan alt rota üzerine kuruludur.

```angular-html
<a [routerLink]="['/crisis-center']">Crisis Center</a>
```

Aşağıdakileri inceleyin:

- Dizideki ilk öğe üst rotayı belirler \(`/crisis-center`\)
- Bu üst rota için parametre yoktur
- Alt rota için varsayılan yoktur, bu yüzden bir tane seçmeniz gerekir
- `CrisisList`'e navigasyon yapıyorsunuz, rota yolu `/`'dir ama eğik çizgiyi açıkça eklemeniz gerekmez

Uygulamanın kökünden Dragon Crisis'e navigasyon yapan aşağıdaki router bağlantısını inceleyin:

```angular-html
<a [routerLink]="['/crisis-center', 1]">Dragon Crisis</a>
```

- Dizideki ilk öğe üst rotayı belirler \(`/crisis-center`\)
- Bu üst rota için parametre yoktur
- İkinci öğe, belirli bir kriz hakkında alt rota ayrıntılarını belirler \(`/:id`\)
- Ayrıntılar alt rotası bir `id` rota parametresi gerektirir
- Dragon Crisis'in `id`'sini diziye ikinci öğe olarak eklediniz \(`1`\)
- Sonuç yol `/crisis-center/1`'dir

`App` şablonunu yalnızca Kriz Merkezi rotalarıyla da yeniden tanımlayabilirsiniz:

```angular-ts
@Component({
  template: `
    <h1 class="title">Angular Router</h1>
    <nav>
      <a [routerLink]="['/crisis-center']">Crisis Center</a>
      <a [routerLink]="['/crisis-center/1', {foo: 'foo'}]">Dragon Crisis</a>
      <a [routerLink]="['/crisis-center/2']">Shark Crisis</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
```

Özetle, bir, iki veya daha fazla yönlendirme derinliğine sahip uygulamalar yazabilirsiniz.
Bağlantı parametreleri dizisi, herhangi bir yönlendirme derinliğini ve herhangi bir geçerli rota yolları, \(zorunlu\) yönlendirici parametreleri ve \(isteğe bağlı\) rota parametre nesneleri dizisini temsil etme esnekliği sağlar.

## `LocationStrategy` ve tarayıcı URL stilleri

Yönlendirici yeni bir bileşen görünümüne navigasyon yaptığında, tarayıcının konumunu ve geçmişini o görünüm için bir URL ile günceller.

Modern HTML5 tarayıcıları, sunucu sayfa isteği tetiklemeden tarayıcının konumunu ve geçmişini değiştiren bir teknik olan [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state')'i destekler.
Yönlendirici, normalde sayfa yüklemesi gerektirecek olandan ayırt edilemeyen "doğal" bir URL oluşturabilir.

İşte bu "HTML5 pushState" stilinde Kriz Merkezi URL'si:

```text
localhost:3002/crisis-center
```

Eski tarayıcılar, konum URL'si değiştiğinde sunucuya sayfa isteği gönderir, ancak değişiklik "#" \("hash" olarak adlandırılır\)'dan sonra gerçekleşirse bunu yapmaz.
Yönlendiriciler, hash'lerle uygulama içi rota URL'leri oluşturarak bu istisnadan yararlanabilir.
İşte Kriz Merkezi'ne yönlendiren bir "hash URL".

```text
localhost:3002/src/#/crisis-center
```

Yönlendirici, iki `LocationStrategy` sağlayıcısıyla her iki stili destekler:

| Sağlayıcılar           | Ayrıntılar                          |
| :--------------------- | :---------------------------------- |
| `PathLocationStrategy` | Varsayılan "HTML5 pushState" stili. |
| `HashLocationStrategy` | "Hash URL" stili.                   |

`RouterModule.forRoot()` fonksiyonu, `LocationStrategy`'yi `PathLocationStrategy` olarak ayarlar ve bu onu varsayılan strateji yapar.
Ayrıca başlatma işlemi sırasında bir geçersiz kılma ile `HashLocationStrategy`'ye geçme seçeneğiniz de vardır.

HELPFUL: Sağlayıcılar ve başlatma işlemi hakkında daha fazla bilgi için [Bağımlılık Enjeksiyonu](guide/di/defining-dependency-providers) bölümüne bakın.
