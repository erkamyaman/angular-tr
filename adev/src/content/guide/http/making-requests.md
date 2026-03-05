# Making HTTP requests

`HttpClient`, hem veri yüklemek hem de sunucuda değişiklikler uygulamak için istek yapmak üzere kullanılan farklı HTTP fiillerine karşılık gelen yöntemlere sahiptir. Her yöntem, abone olunduğunda isteği gönderen ve ardından sunucu yanıt verdiğinde sonuçları yayınlayan bir [RxJS `Observable`](https://rxjs.dev/guide/observable) döndürür.

NOTE: `HttpClient` tarafından oluşturulan `Observable`'lara istenilen sayıda abone olunabilir ve her abonelik için yeni bir arka uç isteği yapılır.

İstek yöntemine iletilen bir seçenekler nesnesi aracılığıyla, isteğin çeşitli özellikleri ve döndürülen yanıt türü ayarlanabilir.

## Fetching JSON data

Bir arka uçtan veri almak genellikle [`HttpClient.get()`](api/common/http/HttpClient#get) yöntemi kullanılarak bir GET isteği yapmayı gerektirir. Bu yöntem iki argüman alır: veri alınacak uç nokta URL'si olan bir string ve isteği yapılandırmak için _isteğe bağlı bir seçenekler_ nesnesi.

Örneğin, `HttpClient.get()` yöntemini kullanarak varsayımsal bir API'den yapılandırma verilerini almak için:

```ts
http.get<Config>('/api/config').subscribe((config) => {
  // process the configuration.
});
```

Sunucu tarafından döndürülen verilerin `Config` türünde olacağını belirten jenerik tür argümanına dikkat edin. Bu argüman isteğe bağlıdır ve atlarsanız döndürülen veri `Object` türünde olacaktır.

TIP: Belirsiz yapıya sahip verilerle ve potansiyel `undefined` veya `null` değerlerle çalışırken, yanıt türü olarak `Object` yerine `unknown` türünü kullanmayı düşünün.

CRITICAL: İstek yöntemlerinin jenerik türü, sunucu tarafından döndürülen veriler hakkında bir tür **varsayımıdır**. `HttpClient` gerçek dönüş verilerinin bu türle eşleştiğini doğrulamaz.

## Fetching other types of data

Varsayılan olarak, `HttpClient` sunucuların JSON verisi döndüreceğini varsayar. JSON olmayan bir API ile etkileşim kurarken, istek yaparken `HttpClient`'a hangi yanıt türünü bekleyip döndüreceğini söyleyebilirsiniz. Bu, `responseType` seçeneği ile yapılır.

| **`responseType` value** | **Returned response type**                                                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `'json'` (default)       | JSON data of the given generic type                                                                                                       |
| `'text'`                 | string data                                                                                                                               |
| `'arraybuffer'`          | [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) containing the raw response bytes |
| `'blob'`                 | [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) instance                                                                        |

Örneğin, `HttpClient`'tan bir `.jpeg` görüntüsünün ham baytlarını bir `ArrayBuffer`'a indirmesini isteyebilirsiniz:

```ts
http.get('/images/dog.jpg', {responseType: 'arraybuffer'}).subscribe((buffer) => {
  console.log('The image is ' + buffer.byteLength + ' bytes large');
});
```

<docs-callout important title="Literal value for `responseType`">
`responseType` değeri `HttpClient` tarafından döndürülen türü etkilediğinden, bir `string` türü değil literal bir tür olmalıdır.

İstek yöntemine iletilen seçenekler nesnesi bir literal nesne ise bu otomatik olarak gerçekleşir, ancak istek seçeneklerini bir değişkene veya yardımcı yönteme çıkarıyorsanız, bunu `responseType: 'text' as const` gibi açıkça literal olarak belirtmeniz gerekebilir.
</docs-callout>

## Mutating server state

Sunucu API'lerinde durum değişiklikleri yapan işlemler genellikle yeni durumu veya yapılacak değişikliği belirten bir istek gövdesi ile POST istekleri yapmayı gerektirir.

[`HttpClient.post()`](api/common/http/HttpClient#post) yöntemi `get()` ile benzer şekilde davranır ve seçeneklerinden önce ek bir `body` argümanı kabul eder:

```ts
http.post<Config>('/api/config', newConfig).subscribe((config) => {
  console.log('Updated config:', config);
});
```

İsteğin `body`'si olarak birçok farklı türde değer sağlanabilir ve `HttpClient` bunları buna göre serileştirir:

| **`body` type**                                                                                                               | **Serialized as**                                    |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| string                                                                                                                        | Plain text                                           |
| number, boolean, array, or plain object                                                                                       | JSON                                                 |
| [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)                       | raw data from the buffer                             |
| [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)                                                                     | raw data with the `Blob`'s content type              |
| [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData)                                                             | `multipart/form-data` encoded data                   |
| [`HttpParams`](api/common/http/HttpParams) or [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | `application/x-www-form-urlencoded` formatted string |

IMPORTANT: İsteğin gerçekten gönderilmesi için değiştirici istek `Observable`'larına `.subscribe()` yapmayı unutmayın.

## Setting URL parameters

İstek URL'sine dahil edilmesi gereken istek parametrelerini `params` seçeneğini kullanarak belirtin.

Bir nesne literali iletmek, URL parametrelerini yapılandırmanın en basit yoludur:

```ts
http
  .get('/api/config', {
    params: {filter: 'all'},
  })
  .subscribe((config) => {
    // ...
  });
```

Alternatif olarak, parametrelerin oluşturulması veya serileştirilmesi üzerinde daha fazla kontrole ihtiyacınız varsa bir `HttpParams` örneği iletin.

IMPORTANT: `HttpParams` örnekleri _değiştirilemezdir_ ve doğrudan değiştirilemez. Bunun yerine, `append()` gibi değiştirme yöntemleri, değişikliğin uygulandığı yeni bir `HttpParams` örneği döndürür.

```ts
const baseParams = new HttpParams().set('filter', 'all');

http
  .get('/api/config', {
    params: baseParams.set('details', 'enabled'),
  })
  .subscribe((config) => {
    // ...
  });
```

`HttpClient`'ın parametreleri URL'ye nasıl kodlayacağını belirleyen özel bir `HttpParameterCodec` ile `HttpParams`'ı örnekleyebilirsiniz.

### Custom parameter encoding

Varsayılan olarak, `HttpParams` parametre anahtarlarını ve değerlerini kodlamak ve çözmek için yerleşik [`HttpUrlEncodingCodec`](api/common/http/HttpUrlEncodingCodec) kullanır.

Kodlama ve çözmenin nasıl uygulanacağını özelleştirmek için kendi [`HttpParameterCodec`](api/common/http/HttpParameterCodec) uygulamanızı sağlayabilirsiniz.

```ts
import {HttpClient, HttpParams, HttpParameterCodec} from '@angular/common/http';
import {inject} from '@angular/core';

export class CustomHttpParamEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

export class ApiService {
  private http = inject(HttpClient);

  search() {
    const params = new HttpParams({
      encoder: new CustomHttpParamEncoder(),
    })
      .set('email', 'dev+alerts@example.com')
      .set('q', 'a & b? c/d = e');

    return this.http.get('/api/items', {params});
  }
}
```

## Setting request headers

İsteğe dahil edilmesi gereken istek başlıklarını `headers` seçeneğini kullanarak belirtin.

Bir nesne literali iletmek, istek başlıklarını yapılandırmanın en basit yoludur:

```ts
http
  .get('/api/config', {
    headers: {
      'X-Debug-Level': 'verbose',
    },
  })
  .subscribe((config) => {
    // ...
  });
```

Alternatif olarak, başlıkların oluşturulması üzerinde daha fazla kontrole ihtiyacınız varsa bir `HttpHeaders` örneği iletin.

IMPORTANT: `HttpHeaders` örnekleri _değiştirilemezdir_ ve doğrudan değiştirilemez. Bunun yerine, `append()` gibi değiştirme yöntemleri, değişikliğin uygulandığı yeni bir `HttpHeaders` örneği döndürür.

```ts
const baseHeaders = new HttpHeaders().set('X-Debug-Level', 'minimal');

http
  .get<Config>('/api/config', {
    headers: baseHeaders.set('X-Debug-Level', 'verbose'),
  })
  .subscribe((config) => {
    // ...
  });
```

## Interacting with the server response events

Kolaylık sağlamak için, `HttpClient` varsayılan olarak sunucu tarafından döndürülen verinin (yanıt gövdesi) bir `Observable`'ını döndürür. Bazen gerçek yanıtı incelemek istenebilir, örneğin belirli yanıt başlıklarını almak için.

Tüm yanıta erişmek için `observe` seçeneğini `'response'` olarak ayarlayın:

```ts
http.get<Config>('/api/config', {observe: 'response'}).subscribe((res) => {
  console.log('Response status:', res.status);
  console.log('Body:', res.body);
});
```

<docs-callout important title="Literal value for `observe`">
`observe` değeri `HttpClient` tarafından döndürülen türü etkilediğinden, bir `string` türü değil literal bir tür olmalıdır.

İstek yöntemine iletilen seçenekler nesnesi bir literal nesne ise bu otomatik olarak gerçekleşir, ancak istek seçeneklerini bir değişkene veya yardımcı yönteme çıkarıyorsanız, bunu `observe: 'response' as const` gibi açıkça literal olarak belirtmeniz gerekebilir.
</docs-callout>

## Receiving raw progress events

Yanıt gövdesi veya yanıt nesnesine ek olarak, `HttpClient` istek yaşam döngüsündeki belirli anlara karşılık gelen ham _olaylar_ akışını da döndürebilir. Bu olaylar isteğin ne zaman gönderildiğini, yanıt başlığının ne zaman döndüğünü ve gövdenin ne zaman tamamlandığını içerir. Bu olaylar ayrıca büyük istek veya yanıt gövdeleri için yükleme ve indirme durumunu bildiren _ilerleme olaylarını_ da içerebilir.

İlerleme olayları varsayılan olarak devre dışıdır (performans maliyeti olduğundan) ancak `reportProgress` seçeneği ile etkinleştirilebilir.

NOTE: `HttpClient`'ın isteğe bağlı `fetch` uygulaması _yükleme_ ilerleme olaylarını bildirmez.

Olay akışını gözlemlemek için `observe` seçeneğini `'events'` olarak ayarlayın:

```ts
http
  .post('/api/upload', myData, {
    reportProgress: true,
    observe: 'events',
  })
  .subscribe((event) => {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
        break;
      case HttpEventType.Response:
        console.log('Finished uploading!');
        break;
    }
  });
```

<docs-callout important title="Literal value for `observe`">
`observe` değeri `HttpClient` tarafından döndürülen türü etkilediğinden, bir `string` türü değil literal bir tür olmalıdır.

İstek yöntemine iletilen seçenekler nesnesi bir literal nesne ise bu otomatik olarak gerçekleşir, ancak istek seçeneklerini bir değişkene veya yardımcı yönteme çıkarıyorsanız, bunu `observe: 'events' as const` gibi açıkça literal olarak belirtmeniz gerekebilir.
</docs-callout>

Olay akışında bildirilen her `HttpEvent`, olayın neyi temsil ettiğini ayırt eden bir `type` özelliğine sahiptir:

| **`type` value**                 | **Event meaning**                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `HttpEventType.Sent`             | The request has been dispatched to the server                                      |
| `HttpEventType.UploadProgress`   | An `HttpUploadProgressEvent` reporting progress on uploading the request body      |
| `HttpEventType.ResponseHeader`   | The head of the response has been received, including status and headers           |
| `HttpEventType.DownloadProgress` | An `HttpDownloadProgressEvent` reporting progress on downloading the response body |
| `HttpEventType.Response`         | The entire response has been received, including the response body                 |
| `HttpEventType.User`             | A custom event from an Http interceptor.                                           |

## Handling request failure

Bir HTTP isteğinin başarısız olmasının üç yolu vardır:

- Bir ağ veya bağlantı hatası, isteğin arka uç sunucusuna ulaşmasını engelleyebilir.
- Zaman aşımı seçeneği ayarlandığında istek zamanında yanıt vermeyebilir.
- Arka uç isteği alabilir ancak işlemekte başarısız olabilir ve bir hata yanıtı döndürebilir.

`HttpClient` yukarıdaki tüm hata türlerini, `Observable`'ın hata kanalı aracılığıyla döndürdüğü bir `HttpErrorResponse` içinde yakalar. Ağ ve zaman aşımı hataları `0` `status` koduna ve [`ProgressEvent`](https://developer.mozilla.org/docs/Web/API/ProgressEvent) örneği olan bir `error`'a sahiptir. Arka uç hataları, arka uç tarafından döndürülen başarısız `status` koduna ve hata yanıtını `error` olarak içerir. Hatanın nedenini ve hatayı ele almak için uygun eylemi belirlemek üzere yanıtı inceleyin.

[RxJS kütüphanesi](https://rxjs.dev/) hata yönetimi için kullanışlı olabilecek çeşitli operatörler sunar.

Bir hata yanıtını kullanıcı arayüzü için bir değere dönüştürmek üzere `catchError` operatörünü kullanabilirsiniz. Bu değer kullanıcı arayüzüne bir hata sayfası veya değeri göstermesini söyleyebilir ve gerekirse hatanın nedenini yakalayabilir.

Bazen ağ kesintileri gibi geçici hatalar bir isteğin beklenmedik şekilde başarısız olmasına neden olabilir ve isteği basitçe yeniden denemek başarılı olmasını sağlayabilir. RxJS, başarısız bir `Observable`'a belirli koşullar altında otomatik olarak yeniden abone olan çeşitli _yeniden deneme_ operatörleri sağlar. Örneğin, `retry()` operatörü otomatik olarak belirtilen sayıda yeniden abone olmayı deneyecektir.

### Timeouts

Bir istek için zaman aşımı ayarlamak üzere, diğer istek seçenekleriyle birlikte `timeout` seçeneğini milisaniye cinsinden bir sayıya ayarlayabilirsiniz. Arka uç isteği belirtilen süre içinde tamamlanmazsa, istek iptal edilir ve bir hata yayınlanır.

NOTE: Zaman aşımı yalnızca arka uç HTTP isteğinin kendisine uygulanır. Tüm istek işleme zinciri için bir zaman aşımı değildir. Bu nedenle bu seçenek, yakalayıcılar tarafından oluşturulan herhangi bir gecikmeden etkilenmez.

```ts
http
  .get('/api/config', {
    timeout: 3000,
  })
  .subscribe({
    next: (config) => {
      console.log('Config fetched successfully:', config);
    },
    error: (err) => {
      // If the request times out, an error will have been emitted.
    },
  });
```

## Advanced fetch options

`withFetch()` sağlayıcısı kullanıldığında, Angular'ın `HttpClient`'ı performansı ve kullanıcı deneyimini iyileştirebilecek gelişmiş fetch API seçeneklerine erişim sağlar. Bu seçenekler yalnızca fetch arka ucu kullanılırken mevcuttur.

### Fetch options

Aşağıdaki seçenekler, fetch arka ucu kullanılırken istek davranışı üzerinde ayrıntılı kontrol sağlar.

#### Keep-alive connections

`keepalive` seçeneği, bir isteğin onu başlatan sayfadan daha uzun yaşamasına olanak tanır. Bu, özellikle kullanıcı sayfadan ayrılsa bile tamamlanması gereken analitik veya günlükleme istekleri için kullanışlıdır.

```ts
http
  .post('/api/analytics', analyticsData, {
    keepalive: true,
  })
  .subscribe();
```

#### HTTP caching control

`cache` seçeneği, isteğin tarayıcının HTTP önbelleği ile nasıl etkileşime gireceğini kontrol eder ve tekrarlanan istekler için performansı önemli ölçüde iyileştirebilir.

```ts
//  Use cached response regardless of freshness
http
  .get('/api/config', {
    cache: 'force-cache',
  })
  .subscribe((config) => {
    // ...
  });

// Always fetch from network, bypass cache
http
  .get('/api/live-data', {
    cache: 'no-cache',
  })
  .subscribe((data) => {
    // ...
  });

// Use cached response only, fail if not in cache
http
  .get('/api/static-data', {
    cache: 'only-if-cached',
  })
  .subscribe((data) => {
    // ...
  });
```

#### Request priority for Core Web Vitals

`priority` seçeneği, bir isteğin göreli önemini belirtmenize olanak tanır ve tarayıcıların daha iyi Core Web Vitals puanları için kaynak yüklemesini optimize etmesine yardımcı olur.

```ts
// High priority for critical resources
http
  .get('/api/user-profile', {
    priority: 'high',
  })
  .subscribe((profile) => {
    // ...
  });

// Low priority for non-critical resources
http
  .get('/api/recommendations', {
    priority: 'low',
  })
  .subscribe((recommendations) => {
    // ...
  });

// Auto priority (default) lets the browser decide
http
  .get('/api/settings', {
    priority: 'auto',
  })
  .subscribe((settings) => {
    // ...
  });
```

Kullanılabilir `priority` değerleri:

- `'high'`: Yüksek öncelik, erken yüklenir (örn. kritik kullanıcı verileri, ekranın üst kısmındaki içerik)
- `'low'`: Düşük öncelik, kaynaklar mevcut olduğunda yüklenir (örn. analitik, ön yükleme verileri)
- `'auto'`: Tarayıcı, istek bağlamına göre önceliği belirler (varsayılan)

TIP: Largest Contentful Paint (LCP) etkileyen istekler için `priority: 'high'` ve ilk kullanıcı deneyimini etkilemeyen istekler için `priority: 'low'` kullanın.

#### Request mode

`mode` seçeneği, isteğin çapraz köken isteklerini nasıl ele aldığını kontrol eder ve yanıt türünü belirler.

```ts
// Same-origin requests only
http
  .get('/api/local-data', {
    mode: 'same-origin',
  })
  .subscribe((data) => {
    // ...
  });

// CORS-enabled cross-origin requests
http
  .get('https://api.external.com/data', {
    mode: 'cors',
  })
  .subscribe((data) => {
    // ...
  });

// No-CORS mode for simple cross-origin requests
http
  .get('https://external-api.com/public-data', {
    mode: 'no-cors',
  })
  .subscribe((data) => {
    // ...
  });
```

Kullanılabilir `mode` değerleri:

- `'same-origin'`: Yalnızca aynı kökenli isteklere izin verir, çapraz köken isteklerinde başarısız olur
- `'cors'`: CORS ile çapraz köken isteklere izin verir (varsayılan)
- `'no-cors'`: CORS olmadan basit çapraz köken isteklere izin verir, yanıt opaktır

TIP: Hassas istekler için hiçbir zaman çapraz köken olmaması gereken durumlarda `mode: 'same-origin'` kullanın.

#### Redirect handling

`redirect` seçeneği, sunucudan gelen yönlendirme yanıtlarının nasıl ele alınacağını belirtir.

```ts
// Follow redirects automatically (default behavior)
http
  .get('/api/resource', {
    redirect: 'follow',
  })
  .subscribe((data) => {
    // ...
  });

// Prevent automatic redirects
http
  .get('/api/resource', {
    redirect: 'manual',
  })
  .subscribe((response) => {
    // Handle redirect manually
  });

// Treat redirects as errors
http
  .get('/api/resource', {
    redirect: 'error',
  })
  .subscribe({
    next: (data) => {
      // Success response
    },
    error: (err) => {
      // Redirect responses will trigger this error handler
    },
  });
```

Kullanılabilir `redirect` değerleri:

- `'follow'`: Yönlendirmeleri otomatik olarak takip eder (varsayılan)
- `'error'`: Yönlendirmeleri hata olarak ele alır
- `'manual'`: Yönlendirmeleri otomatik olarak takip etmez, yönlendirme yanıtını döndürür

TIP: Yönlendirmeleri özel mantıkla ele almanız gerektiğinde `redirect: 'manual'` kullanın.

#### Credentials handling

`credentials` seçeneği, çerezlerin, yetkilendirme başlıklarının ve diğer kimlik bilgilerinin çapraz köken istekleriyle gönderilip gönderilmeyeceğini kontrol eder. Bu, özellikle kimlik doğrulama senaryoları için önemlidir.

```ts
// Include credentials for cross-origin requests
http
  .get('https://api.example.com/protected-data', {
    credentials: 'include',
  })
  .subscribe((data) => {
    // ...
  });

// Never send credentials (default for cross-origin)
http
  .get('https://api.example.com/public-data', {
    credentials: 'omit',
  })
  .subscribe((data) => {
    // ...
  });

// Send credentials only for same-origin requests
http
  .get('/api/user-data', {
    credentials: 'same-origin',
  })
  .subscribe((data) => {
    // ...
  });

// withCredentials overrides credentials setting
http
  .get('https://api.example.com/data', {
    credentials: 'omit', // This will be ignored
    withCredentials: true, // This forces credentials: 'include'
  })
  .subscribe((data) => {
    // Request will include credentials despite credentials: 'omit'
  });

// Legacy approach (still supported)
http
  .get('https://api.example.com/data', {
    withCredentials: true,
  })
  .subscribe((data) => {
    // Equivalent to credentials: 'include'
  });
```

IMPORTANT: `withCredentials` seçeneği `credentials` seçeneğinden önceliklidir. Her ikisi de belirtilmişse, `withCredentials: true` açık `credentials` değerinden bağımsız olarak her zaman `credentials: 'include'` sonucunu verecektir.

Kullanılabilir `credentials` değerleri:

- `'omit'`: Kimlik bilgilerini asla göndermez
- `'same-origin'`: Kimlik bilgilerini yalnızca aynı kökenli istekler için gönderir (varsayılan)
- `'include'`: Çapraz köken istekler dahil her zaman kimlik bilgilerini gönderir

TIP: CORS'u destekleyen farklı bir alan adına kimlik doğrulama çerezleri veya başlıkları göndermeniz gerektiğinde `credentials: 'include'` kullanın. Karışıklığı önlemek için `credentials` ve `withCredentials` seçeneklerini birlikte kullanmaktan kaçının.

#### Referrer

`referrer` seçeneği, istekle birlikte hangi yönlendiren bilgisinin gönderileceğini kontrol etmenize olanak tanır. Bu, gizlilik ve güvenlik açısından önemlidir.

```ts
// Send a specific referrer URL
http
  .get('/api/data', {
    referrer: 'https://example.com/page',
  })
  .subscribe((data) => {
    // ...
  });

// Use the current page as referrer (default behavior)
http
  .get('/api/analytics', {
    referrer: 'about:client',
  })
  .subscribe((data) => {
    // ...
  });
```

`referrer` seçeneği şunları kabul eder:

- Geçerli bir URL string: Gönderilecek belirli yönlendiren URL'sini ayarlar
- Boş bir string `''`: Yönlendiren bilgisi göndermez
- `'about:client'`: Varsayılan yönlendireni (mevcut sayfa URL'si) kullanır

TIP: Yönlendiren sayfa URL'sini sızdırmak istemediğiniz hassas istekler için `referrer: ''` kullanın.

#### Referrer policy

`referrerPolicy` seçeneği, ne kadar yönlendiren bilgisinin (isteği yapan sayfanın URL'si) bir HTTP isteğiyle birlikte gönderileceğini kontrol eder. Bu ayar hem gizlilik hem de analitikleri etkiler ve veri görünürlüğü ile güvenlik değerlendirmeleri arasında denge kurmanıza olanak tanır.

```ts
// Send no referrer information regardless of the current page
http
  .get('/api/data', {
    referrerPolicy: 'no-referrer',
  })
  .subscribe();

// Send origin only (e.g. https://example.com)
http
  .get('/api/analytics', {
    referrerPolicy: 'origin',
  })
  .subscribe();
```

`referrerPolicy` seçeneği şunları kabul eder:

- `'no-referrer'` `Referer` başlığını asla göndermez.
- `'no-referrer-when-downgrade'` Aynı köken ve güvenli (HTTPS->HTTPS) istekler için yönlendireni gönderir, ancak güvenli bir kökenden daha az güvenli bir kökene (HTTPS->HTTP) geçerken atlar.
- `'origin'` Yönlendirenin yalnızca kökenini (şema, ana bilgisayar, port) gönderir, yol ve sorgu bilgilerini atlar.
- `'origin-when-cross-origin'` Aynı köken istekler için tam URL gönderir, ancak çapraz köken istekler için yalnızca kökeni gönderir.
- `'same-origin'` Aynı köken istekler için tam URL gönderir ve çapraz köken istekler için yönlendiren göndermez.
- `'strict-origin'` Yalnızca kökeni gönderir ve yalnızca protokol güvenlik seviyesi düşürülmemişse (örn. HTTPS->HTTPS). Düşürmede yönlendireni atlar.
- `'strict-origin-when-cross-origin'` Varsayılan tarayıcı davranışı. Aynı köken istekler için tam URL, düşürülmemiş çapraz köken istekler için köken gönderir ve düşürmede yönlendireni atlar.
- `'unsafe-url'` Her zaman tam URL'yi (yol ve sorgu dahil) gönderir. Bu hassas verileri açığa çıkarabilir ve dikkatli kullanılmalıdır.

TIP: Gizlilik açısından hassas istekler için `'no-referrer'`, `'origin'` veya `'strict-origin-when-cross-origin'` gibi muhafazakar değerleri tercih edin.

#### Integrity

`integrity` seçeneği, beklenen içeriğin kriptografik özetini sağlayarak yanıtın değiştirilmediğini doğrulamanıza olanak tanır. Bu, özellikle CDN'lerden betik veya diğer kaynakları yüklerken kullanışlıdır.

```ts
// Verify response integrity with SHA-256 hash
http
  .get('/api/script.js', {
    integrity: 'sha256-ABC123...',
    responseType: 'text',
  })
  .subscribe((script) => {
    // Script content is verified against the hash
  });
```

IMPORTANT: `integrity` seçeneği, yanıt içeriği ile sağlanan özet arasında tam bir eşleşme gerektirir. İçerik eşleşmezse, istek bir ağ hatası ile başarısız olur.

TIP: Değiştirilmediğinden emin olmak için harici kaynaklardan kritik kaynaklar yüklerken alt kaynak bütünlüğünü kullanın. Özetleri `openssl` gibi araçlar kullanarak oluşturun.

## Http `Observable`s

`HttpClient` üzerindeki her istek yöntemi, istenen yanıt türünün bir `Observable`'ını oluşturur ve döndürür. `HttpClient` kullanırken bu `Observable`'ların nasıl çalıştığını anlamak önemlidir.

`HttpClient`, RxJS'in "soğuk" `Observable`'lar dediği şeyi üretir, yani `Observable`'a abone olunana kadar gerçek bir istek yapılmaz. Ancak o zaman istek sunucuya gönderilir. Aynı `Observable`'a birden fazla kez abone olmak birden fazla arka uç isteğini tetikler. Her abonelik bağımsızdır.

TIP: `HttpClient` `Observable`'larını gerçek sunucu istekleri için _planlar_ olarak düşünebilirsiniz.

Abone olduktan sonra, abonelikten çıkmak devam eden isteği iptal eder. Bu, `Observable`'a `async` pipe aracılığıyla abone olunmuşsa çok kullanışlıdır, çünkü kullanıcı mevcut sayfadan ayrıldığında isteği otomatik olarak iptal eder. Ek olarak, `Observable`'ı `switchMap` gibi bir RxJS birleştiricisi ile kullanırsanız, bu iptal eski istekleri temizler.

Yanıt döndüğünde, `HttpClient`'tan gelen `Observable`'lar genellikle tamamlanır (ancak yakalayıcılar bunu etkileyebilir).

Otomatik tamamlama nedeniyle, `HttpClient` abonelikleri temizlenmezse genellikle bellek sızıntısı riski yoktur. Ancak, herhangi bir asenkron işlemde olduğu gibi, abonelik geri çağrısının aksi takdirde çalışıp yok edilmiş bileşenle etkileşime girmeye çalıştığında hatalarla karşılaşabileceğinden, onları kullanan bileşen yok edildiğinde abonelikleri temizlemenizi şiddetle öneriyoruz.

TIP: `Observable`'lara abone olmak için `async` pipe veya `toSignal` işlemini kullanmak, aboneliklerin düzgün şekilde elden çıkarılmasını sağlar.

## Best practices

`HttpClient` doğrudan bileşenlerden enjekte edilip kullanılabilse de, genellikle veri erişim mantığını izole eden ve kapsülleyen yeniden kullanılabilir, enjekte edilebilir servisler oluşturmanızı öneririz. Örneğin, bu `UserService` bir kullanıcıyı id'sine göre veri isteme mantığını kapsüller:

```ts
@Injectable({providedIn: 'root'})
export class UserService {
  private http = inject(HttpClient);

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`);
  }
}
```

Bir bileşen içinde, veri yalnızca yüklenmesi tamamlandığında kullanıcı arayüzünü oluşturmak için `@if` ile `async` pipe'ı birleştirebilirsiniz:

```angular-ts
import {AsyncPipe} from '@angular/common';

@Component({
  imports: [AsyncPipe],
  template: `
    @if (user$ | async; as user) {
      <p>Name: {{ user.name }}</p>
      <p>Biography: {{ user.biography }}</p>
    }
  `,
})
export class UserProfile {
  userId = input.required<string>();
  user$!: Observable<User>;

  private userService = inject(UserService);

  constructor(): void {
    effect(() => {
      this.user$ = this.userService.getUser(this.userId());
    });
  }
}
```
