# Service Worker yapılandırma dosyası

Bu konu, service worker yapılandırma dosyasının özelliklerini açıklar.

## Yapılandırmayı değiştirme

`ngsw-config.json` JSON yapılandırma dosyası, Angular service worker'ının hangi dosyaları ve veri URL'lerini önbelleğe alması gerektiğini ve önbelleğe alınan dosyaları ve verileri nasıl güncellemesi gerektiğini belirtir.
[Angular CLI](tools/cli) bu yapılandırma dosyasını `ng build` sırasında işler.

Tüm dosya yolları `/` ile başlamalıdır; bu, dağıtım dizinine karşılık gelir — CLI projelerinde genellikle `dist/<project-name>`.

Aksi belirtilmedikçe, kalıplar dahili olarak regex'e dönüştürülecek **sınırlı\*** bir glob biçimi kullanır:

| Glob biçimleri | Ayrıntılar                                                                              |
| :------------- | :-------------------------------------------------------------------------------------- |
| `**`           | 0 veya daha fazla yol segmentiyle eşleşir                                               |
| `*`            | `/` hariç 0 veya daha fazla karakterle eşleşir                                          |
| `?`            | `/` hariç tam olarak bir karakterle eşleşir                                             |
| `!` öneki      | Kalıbı negatif olarak işaretler, yani yalnızca kalıpla eşleşmeyen dosyalar dahil edilir |

<docs-callout important title="Special characters need to be escaped">
Düzenli ifadede özel anlamı olan bazı karakterlerin kaçış karakteriyle yazılmadığına ve ayrıca dahili glob'dan regex'e dönüşümde kalıbın `^`/`$` ile sarılmadığına dikkat edin.

`$`, regex'te dizenin sonuyla eşleşen özel bir karakterdir ve glob kalıbını düzenli ifadeye dönüştürürken otomatik olarak kaçış karakteriyle yazılmaz.

`$` karakteriyle tam olarak eşleştirmek istiyorsanız, kendiniz kaçış karakteriyle yazmalısınız (`\\$` ile). Örneğin, `/foo/bar/$value` glob kalıbı eşleştirilemeyen bir ifadeyle sonuçlanır, çünkü bir dizenin sona erdikten sonra herhangi bir karaktere sahip olması imkansızdır.

Kalıp, düzenli ifadeye dönüştürülürken otomatik olarak `^` ve `$` ile sarılmaz. Bu nedenle, kalıplar istek URL'leriyle kısmen eşleşir.

Kalıplarınızın URL'lerin başlangıcı ve/veya sonuyla eşleşmesini istiyorsanız, kendiniz `^`/`$` ekleyebilirsiniz. Örneğin, `/foo/bar/*.js` glob kalıbı hem `.js` hem de `.json` dosyalarıyla eşleşir. Yalnızca `.js` dosyalarıyla eşleştirmek istiyorsanız, `/foo/bar/*.js$` kullanın.
</docs-callout>

Örnek kalıplar:

| Kalıplar     | Ayrıntılar                                 |
| :----------- | :----------------------------------------- |
| `/**/*.html` | Tüm HTML dosyalarını belirtir              |
| `/*.html`    | Yalnızca kökteki HTML dosyalarını belirtir |
| `!/**/*.map` | Tüm sourcemap'leri hariç tutar             |

## Service worker yapılandırma özellikleri

Aşağıdaki bölümler yapılandırma dosyasının her bir özelliğini açıklar.

### `appData`

Bu bölüm, uygulamanın bu belirli sürümünü tanımlayan istediğiniz herhangi bir veriyi geçirmenizi sağlar.
`SwUpdate` servisi bu veriyi güncelleme bildirimlerine dahil eder.
Birçok uygulama bu bölümü, kullanıcıları mevcut güncelleme hakkında bilgilendiren UI açılır pencerelerinin görüntülenmesi için ek bilgi sağlamak amacıyla kullanır.

### `index`

Navigasyon isteklerini karşılamak için dizin sayfası olarak hizmet veren dosyayı belirtir.
Genellikle bu `/index.html`'dir.

### `assetGroups`

_Varlıklar_, uygulamayla birlikte güncellenen uygulama sürümünün parçası olan kaynaklardır.
Sayfanın kaynağından yüklenen kaynakları ve CDN'lerden ve diğer harici URL'lerden yüklenen üçüncü taraf kaynaklarını içerebilir.
Derleme zamanında tüm bu tür harici URL'ler bilinmeyebileceğinden, URL kalıpları eşleştirilebilir.

HELPFUL: Service worker'ın farklı kaynaklardan yüklenen kaynakları işlemesi için, her kaynağın sunucusunda [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS)'un doğru şekilde yapılandırıldığından emin olun.

Bu alan, her biri bir varlık kaynağı setini ve önbelleğe alınma politikasını tanımlayan bir varlık grupları dizisi içerir.

```ts
{
  "assetGroups": [
    {
      …
    },
    {
      …
    }
  ]
}
```

HELPFUL: ServiceWorker bir isteği işlediğinde, varlık gruplarını `ngsw-config.json`'da göründükleri sırayla kontrol eder.
İstenen kaynakla eşleşen ilk varlık grubu isteği işler.

Daha spesifik varlık gruplarını listenin üstüne koymanız önerilir.
Örneğin, `/foo.js` ile eşleşen bir varlık grubu, `*.js` ile eşleşen birinden önce görünmelidir.

Her varlık grubu hem bir kaynak grubunu hem de onları yöneten bir politikayı belirtir.
Bu politika, kaynakların ne zaman alınacağını ve değişiklikler tespit edildiğinde ne olacağını belirler.

Varlık grupları burada gösterilen Typescript arayüzünü takip eder:

```ts
interface AssetGroup {
  name: string;
  installMode?: 'prefetch' | 'lazy';
  updateMode?: 'prefetch' | 'lazy';
  resources: {
    files?: string[];
    urls?: string[];
  };
  cacheQueryOptions?: {
    ignoreSearch?: boolean;
  };
}
```

Her `AssetGroup` aşağıdaki varlık grubu özellikleriyle tanımlanır.

#### `name`

Bir `name` zorunludur.
Yapılandırmanın sürümleri arasında bu belirli varlık grubunu tanımlar.

#### `installMode`

`installMode`, bu kaynakların başlangıçta nasıl önbelleğe alınacağını belirler.
`installMode` iki değerden biri olabilir:

| Değerler   | Ayrıntılar                                                                                                                                                                                                                                                                                                                                                                                          |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prefetch` | Angular service worker'a, uygulamanın geçerli sürümünü önbelleğe alırken listelenen her bir kaynağı indirmesini söyler. Bu bant genişliği yoğundur ancak tarayıcı şu anda çevrimdışı olsa bile kaynakların istendiğinde kullanılabilir olmasını sağlar.                                                                                                                                             |
| `lazy`     | Kaynakların hiçbirini önceden önbelleğe almaz. Bunun yerine, Angular service worker yalnızca istek aldığı kaynakları önbelleğe alır. Bu isteğe bağlı bir önbellekleme modudur. Hiç istenmeyen kaynaklar önbelleğe alınmaz. Bu, farklı çözünürlüklerdeki resimler gibi şeyler için kullanışlıdır, böylece service worker yalnızca belirli ekran ve yönlendirme için doğru varlıkları önbelleğe alır. |

Varsayılan değer `prefetch`'tir.

#### `updateMode`

Zaten önbellekte bulunan kaynaklar için, `updateMode`, uygulamanın yeni bir sürümü keşfedildiğinde önbellekleme davranışını belirler.
Önceki sürümden bu yana değişmiş olan gruptaki herhangi bir kaynak, `updateMode`'a uygun olarak güncellenir.

| Değerler   | Ayrıntılar                                                                                                                                                                                                                                            |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prefetch` | Service worker'a değişen kaynakları hemen indirip önbelleğe almasını söyler.                                                                                                                                                                          |
| `lazy`     | Service worker'a bu kaynakları önbelleğe almamasını söyler. Bunun yerine, onları istenmemiş olarak ele alır ve güncellenmeden önce tekrar istenene kadar bekler. `lazy` olan bir `updateMode`, yalnızca `installMode` da `lazy` olduğunda geçerlidir. |

Varsayılan değer, `installMode`'un ayarlandığı değerdir.

#### `resources`

Bu bölüm, önbelleğe alınacak kaynakları aşağıdaki gruplara ayrılmış olarak açıklar:

| Kaynak grupları | Ayrıntılar                                                                                                                                                                                                                                                                                                                                                                              |
| :-------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `files`         | Dağıtım dizinindeki dosyalarla eşleşen kalıpları listeler. Bunlar tek dosyalar veya birden çok dosyayla eşleşen glob benzeri kalıplar olabilir.                                                                                                                                                                                                                                         |
| `urls`          | Çalışma zamanında eşleştirilen hem URL'leri hem de URL kalıplarını içerir. Bu kaynaklar doğrudan alınmaz ve içerik hash'lerine sahip değildir, ancak HTTP başlıklarına göre önbelleğe alınır. Bu en çok Google Fonts servisi gibi CDN'ler için kullanışlıdır. <br /> _(Negatif glob kalıpları desteklenmez ve `?` tam anlamıyla eşleştirilir; yani yalnızca `?` karakteriyle eşleşir.)_ |

#### `cacheQueryOptions`

Bu seçenekler, isteklerin eşleştirme davranışını değiştirmek için kullanılır.
Tarayıcıların `Cache#match` fonksiyonuna geçirilir.
Ayrıntılar için [MDN](https://developer.mozilla.org/docs/Web/API/Cache/match) belgelerine bakın.
Şu anda yalnızca aşağıdaki seçenekler desteklenmektedir:

| Seçenekler     | Ayrıntılar                                                     |
| :------------- | :------------------------------------------------------------- |
| `ignoreSearch` | Sorgu parametrelerini yok sayar. Varsayılan değer `false`'tur. |

### `dataGroups`

Varlık kaynaklarının aksine, veri istekleri uygulama ile birlikte sürümlenmez.
API istekleri ve diğer veri bağımlılıkları gibi durumlar için daha kullanışlı olan manuel olarak yapılandırılmış politikalara göre önbelleğe alınır.

Bu alan, her biri bir veri kaynağı setini ve önbelleğe alınma politikasını tanımlayan bir veri grupları dizisi içerir.

```json
{
  "dataGroups": [
    {
      …
    },
    {
      …
    }
  ]
}
```

HELPFUL: ServiceWorker bir isteği işlediğinde, veri gruplarını `ngsw-config.json`'da göründükleri sırayla kontrol eder.
İstenen kaynakla eşleşen ilk veri grubu isteği işler.

Daha spesifik veri gruplarını listenin üstüne koymanız önerilir.
Örneğin, `/api/foo.json` ile eşleşen bir veri grubu, `/api/*.json` ile eşleşen birinden önce görünmelidir.

Veri grupları bu Typescript arayüzünü takip eder:

```ts
export interface DataGroup {
  name: string;
  urls: string[];
  version?: number;
  cacheConfig: {
    maxSize: number;
    maxAge: string;
    timeout?: string;
    refreshAhead?: string;
    strategy?: 'freshness' | 'performance';
  };
  cacheQueryOptions?: {
    ignoreSearch?: boolean;
  };
}
```

Her `DataGroup` aşağıdaki veri grubu özellikleriyle tanımlanır.

#### `name`

`assetGroups`'a benzer şekilde, her veri grubunun onu benzersiz şekilde tanımlayan bir `name`'i vardır.

#### `urls`

URL kalıplarının bir listesi.
Bu kalıplarla eşleşen URL'ler, bu veri grubunun politikasına göre önbelleğe alınır.
Yalnızca değiştirici olmayan istekler (GET ve HEAD) önbelleğe alınır.

- Negatif glob kalıpları desteklenmez
- `?` tam anlamıyla eşleştirilir; yani _yalnızca_ `?` karakteriyle eşleşir

#### `version`

Zaman zaman API'ler geriye dönük uyumlu olmayan bir şekilde biçim değiştirir.
Uygulamanın yeni bir sürümü eski API biçimiyle uyumlu olmayabilir ve dolayısıyla o API'den mevcut önbelleğe alınmış kaynaklarla uyumlu olmayabilir.

`version`, önbelleğe alınan kaynakların geriye dönük uyumsuz bir şekilde güncellendiğini ve eski önbellek girişlerinin — önceki sürümlerdeki girişlerin — atılması gerektiğini belirtmek için bir mekanizma sağlar.

`version` bir tam sayı alanıdır ve varsayılan değeri `1`'dir.

#### `cacheConfig`

Aşağıdaki özellikler, eşleşen isteklerin önbelleğe alınma politikasını tanımlar.

##### `maxSize`

Önbellekteki maksimum giriş veya yanıt sayısı.

CRITICAL: Açık uçlu önbellekler sınırsız şekilde büyüyebilir ve sonunda depolama kotalarını aşarak tahliyeye neden olabilir.

##### `maxAge`

`maxAge` parametresi, yanıtların geçersiz sayılıp tahliye edilmeden önce ne kadar süre önbellekte kalmasına izin verildiğini belirtir. `maxAge`, aşağıdaki birim soneklerini kullanan bir süre dizesidir:

| Sonekler | Ayrıntılar |
| :------- | :--------- |
| `d`      | Gün        |
| `h`      | Saat       |
| `m`      | Dakika     |
| `s`      | Saniye     |
| `u`      | Milisaniye |

Örneğin, `3d12h` dizesi içeriği üç buçuk güne kadar önbelleğe alır.

##### `timeout`

Bu süre dizesi ağ zaman aşımını belirtir.
Ağ zaman aşımı, Angular service worker'ın yapılandırılmışsa önbelleğe alınmış bir yanıt kullanmadan önce ağın yanıt vermesini ne kadar süre beklediğidir.
`timeout`, aşağıdaki birim soneklerini kullanan bir süre dizesidir:

| Sonekler | Ayrıntılar |
| :------- | :--------- |
| `d`      | Gün        |
| `h`      | Saat       |
| `m`      | Dakika     |
| `s`      | Saniye     |
| `u`      | Milisaniye |

Örneğin, `5s30u` dizesi beş saniye ve 30 milisaniye ağ zaman aşımına karşılık gelir.

##### `refreshAhead`

Bu süre dizesi, önbelleğe alınmış bir kaynağın süresinin dolmasından ne kadar önce Angular service worker'ın kaynağı ağdan proaktif olarak yenilemeye çalışması gerektiğini belirtir.
`refreshAhead` süresi, önbelleğe alınmış bir yanıtın süresinin dolmasından ne kadar önce service worker'ın kaynağı ağdan yenilemek için bir istek başlatması gerektiğini belirleyen isteğe bağlı bir yapılandırmadır.

| Sonekler | Ayrıntılar |
| :------- | :--------- |
| `d`      | Gün        |
| `h`      | Saat       |
| `m`      | Dakika     |
| `s`      | Saniye     |
| `u`      | Milisaniye |

Örneğin, `1h30m` dizesi süre dolma zamanından bir saat ve 30 dakika öncesine karşılık gelir.

##### `strategy`

Angular service worker, veri kaynakları için iki önbellekleme stratejisinden birini kullanabilir.

| Önbellekleme stratejileri | Ayrıntılar                                                                                                                                                                                                                                                                                                                                    |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `performance`             | Varsayılan, mümkün olduğunca hızlı yanıtlar için optimize eder. Bir kaynak önbellekte mevcutsa, önbelleğe alınmış sürüm kullanılır ve ağ isteği yapılmaz. Bu, `maxAge`'e bağlı olarak biraz eski veriye izin verir, bunun karşılığında daha iyi performans sunar. Bu, kullanıcı avatar resimleri gibi sık değişmeyen kaynaklar için uygundur. |
| `freshness`               | Verilerin güncelliği için optimize eder, istenen verileri tercihen ağdan alır. Yalnızca ağ, `timeout`'a göre zaman aşımına uğrarsa, istek önbelleğe geri döner. Bu, hesap bakiyeleri gibi sık değişen kaynaklar için kullanışlıdır.                                                                                                           |

HELPFUL: Önbelleğe alınmış veri mevcutsa döndüren ancak aynı zamanda bir sonraki sefer için arka planda ağdan taze veri alan üçüncü bir strateji olan [staleWhileRevalidate](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate)'i de emüle edebilirsiniz.
Bu stratejiyi kullanmak için `cacheConfig`'de `strategy`'yi `freshness` ve `timeout`'u `0u` olarak ayarlayın.

Bu esasen şunları yapar:

1. Önce ağdan almayı dener.
2. Ağ isteği hemen tamamlanmazsa, yani 0&nbsp;ms'lik bir zaman aşımından sonra, önbellek yaşını yok sayar ve önbelleğe alınmış değere geri döner.
3. Ağ isteği tamamlandığında, gelecek istekler için önbelleği günceller.
4. Kaynak önbellekte mevcut değilse, yine de ağ isteğini bekler.

##### `cacheOpaqueResponses`

Angular service worker'ın opak yanıtları önbelleğe alıp almayacağı.

Belirtilmezse, varsayılan değer veri grubunun yapılandırılmış stratejisine bağlıdır:

| Stratejiler                              | Ayrıntılar                                                                                                                                                                                                                                                                                                                         |
| :--------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `freshness` stratejisine sahip gruplar   | Varsayılan değer `true`'dur ve service worker opak yanıtları önbelleğe alır. Bu gruplar her seferinde veriyi isteyecek ve yalnızca çevrimdışıyken veya yavaş bir ağdayken önbelleğe alınmış yanıta geri dönecektir. Bu nedenle, service worker'ın bir hata yanıtını önbelleğe alması önemli değildir.                              |
| `performance` stratejisine sahip gruplar | Varsayılan değer `false`'tur ve service worker opak yanıtları önbelleğe almaz. Bu gruplar, hata geçici bir ağ veya sunucu sorunundan kaynaklanmış olsa bile, `maxAge` süresi dolana kadar önbelleğe alınmış bir yanıt döndürmeye devam edecektir. Bu nedenle, service worker'ın bir hata yanıtını önbelleğe alması sorunlu olurdu. |

<docs-callout title="Opak yanıtlar hakkında yorum">

Aşina değilseniz, [opak yanıt](https://fetch.spec.whatwg.org#concept-filtered-response-opaque), CORS başlıkları döndürmeyen farklı bir kaynaktaki bir kaynağı talep ederken döndürülen özel bir yanıt türüdür.
Opak yanıtın özelliklerinden biri, service worker'ın durumunu okumasına izin verilmemesidir, yani isteğin başarılı olup olmadığını kontrol edemez.
Daha fazla ayrıntı için [`fetch()`'e Giriş](https://developers.google.com/web/updates/2015/03/introduction-to-fetch#response_types) sayfasına bakın.

CORS uygulayamıyorsanız — örneğin kaynağı kontrol etmiyorsanız — opak yanıtlarla sonuçlanan kaynaklar için `freshness` stratejisini kullanmayı tercih edin.

</docs-callout>

#### `cacheQueryOptions`

Ayrıntılar için [assetGroups](#assetgroups) bölümüne bakın.

### `navigationUrls`

Bu isteğe bağlı bölüm, dizin dosyasına yönlendirilecek özel bir URL listesi belirtmenizi sağlar.

#### Navigasyon isteklerini işleme

ServiceWorker, herhangi bir `asset` veya `data` grubuyla eşleşmeyen navigasyon isteklerini belirtilen [dizin dosyasına](#index) yönlendirir.
Bir istek, aşağıdaki durumlarda navigasyon isteği olarak kabul edilir:

- [Metodu](https://developer.mozilla.org/docs/Web/API/Request/method) `GET`'tir
- [Modu](https://developer.mozilla.org/docs/Web/API/Request/mode) `navigation`'dır
- `Accept` başlığının değerine göre belirlenen şekilde bir `text/html` yanıtını kabul eder
- URL'si aşağıdaki kriterlere uygundur:
  - URL, son yol segmentinde bir dosya uzantısı (yani `.`) içermemelidir
  - URL, `__` içermemelidir

HELPFUL: Navigasyon isteklerinin ağa gönderilip gönderilmeyeceğini yapılandırmak için [navigationRequestStrategy](#navigationrequeststrategy) bölümüne ve [applicationMaxAge](#applicationmaxage) bölümlerine bakın.

#### Navigasyon isteği URL'lerini eşleştirme

Bu varsayılan kriterler çoğu durumda yeterli olsa da, bazen farklı kurallar yapılandırmak istenebilir.
Örneğin, Angular uygulamasının parçası olmayan belirli rotaları yok saymak ve bunları sunucuya iletmek isteyebilirsiniz.

Bu alan, çalışma zamanında eşleştirilen URL'ler ve [glob benzeri](#yapılandırmayı-değiştirme) URL kalıplarının bir dizisini içerir.
Hem negatif kalıpları (yani `!` ile başlayan kalıplar) hem de negatif olmayan kalıpları ve URL'leri içerebilir.

Yalnızca URL'leri negatif olmayan URL'lerden/kalıplardan _herhangi biriyle_ eşleşen ve negatif olanların _hiçbiriyle_ eşleşmeyen istekler navigasyon istekleri olarak kabul edilir.
Eşleştirme sırasında URL sorgusu yok sayılır.

Alan atlanırsa, varsayılan olarak şu değeri alır:

```ts
[
  '/**', // Tüm URL'leri dahil et.
  '!/**/*.*', // Dosyalara yönelik URL'leri hariç tut (son segmentte dosya uzantısı içerenler).
  '!/**/*__*', // Son segmentte `__` içeren URL'leri hariç tut.
  '!/**/*__*/**', // Diğer segmentlerde `__` içeren URL'leri hariç tut.
];
```

### `navigationRequestStrategy`

Bu isteğe bağlı özellik, service worker'ın navigasyon isteklerini nasıl işlediğini yapılandırmanızı sağlar:

```json
{
  "navigationRequestStrategy": "freshness"
}
```

| Olası değerler  | Ayrıntılar                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| :-------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'performance'` | Varsayılan ayar. Belirtilen [dizin dosyasını](#index) sunar ve bu genellikle önbelleğe alınmıştır.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `'freshness'`   | İstekleri ağa iletir ve çevrimdışı olduğunda `performance` davranışına geri döner. Bu değer, sunucu navigasyon isteklerini `3xx` HTTP yönlendirme durum koduyla başka bir yere yönlendirdiğinde kullanışlıdır. Bu değerin kullanılma nedenleri şunlardır: <ul> <li> Kimlik doğrulama uygulama tarafından işlenmediğinde bir kimlik doğrulama web sitesine yönlendirme </li> <li> Bir web sitesi yeniden tasarımından sonra mevcut bağlantıları/yer imlerini bozmamak için belirli URL'leri yönlendirme </li> <li> Bir sayfa geçici olarak kapalıyken farklı bir web sitesine, örneğin sunucu durum sayfasına yönlendirme </li> </ul> |

IMPORTANT: `freshness` stratejisi genellikle sunucuya daha fazla istek gönderilmesine neden olur ve bu da yanıt gecikmesini artırabilir. Mümkün olduğunda varsayılan performans stratejisini kullanmanız önerilir.

### `applicationMaxAge`

Bu isteğe bağlı özellik, service worker'ın tüm istekleri ne kadar süre önbelleğe alacağını yapılandırmanızı sağlar. `maxAge` süresi içinde dosyalar önbellekten sunulur. Bu sürenin ötesinde, varlık ve veri istekleri dahil tüm istekler yalnızca ağdan sunulur.
