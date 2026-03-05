# Interceptors

`HttpClient`, _yakalayıcılar_ olarak bilinen bir ara yazılım biçimini destekler.

TLDR: Yakalayıcılar, yeniden deneme, önbellekleme, günlükleme ve kimlik doğrulama gibi yaygın kalıpların bireysel isteklerden soyutlanmasına olanak tanıyan ara yazılımlardır.

`HttpClient` iki tür yakalayıcıyı destekler: fonksiyonel ve DI tabanlı. Önerimiz, özellikle karmaşık kurulumlarda daha öngörülebilir davranışa sahip olan fonksiyonel yakalayıcıları kullanmanızdır. Bu kılavuzdaki örneklerimiz fonksiyonel yakalayıcıları kullanır ve [DI tabanlı yakalayıcıları](#di-based-interceptors) sonunda kendi bölümlerinde ele alırız.

## Interceptors

Yakalayıcılar genellikle her istek için çalıştırabileceğiniz fonksiyonlardır ve istekler ile yanıtların içeriklerini ve genel akışını etkileme konusunda geniş yeteneklere sahiptirler. Birden fazla yakalayıcı kurabilirsiniz ve bunlar, her yakalayıcının isteği veya yanıtı zincirdeki bir sonraki yakalayıcıya iletmeden önce işlediği bir yakalayıcı zinciri oluşturur.

Yakalayıcıları çeşitli yaygın kalıpları uygulamak için kullanabilirsiniz, örneğin:

- Belirli bir API'ye giden isteklere kimlik doğrulama başlıkları ekleme.
- Başarısız istekleri üstel geri çekilme ile yeniden deneme.
- Yanıtları belirli bir süre boyunca veya değişikliklerle geçersiz kılınana kadar önbellekleme.
- Yanıtların ayrıştırılmasını özelleştirme.
- Sunucu yanıt sürelerini ölçme ve günlükleme.
- Ağ işlemleri devam ederken yükleme göstergesi gibi kullanıcı arayüzü öğelerini yönetme.
- Belirli bir zaman dilimi içinde yapılan istekleri toplama ve gruplama.
- Yapılandırılabilir bir son tarih veya zaman aşımından sonra istekleri otomatik olarak başarısız kılma.
- Sunucuyu düzenli olarak yoklama ve sonuçları yenileme.

## Defining an interceptor

Bir yakalayıcının temel biçimi, giden `HttpRequest`'i ve yakalayıcı zincirindeki bir sonraki işleme adımını temsil eden bir `next` fonksiyonunu alan bir fonksiyondur.

Örneğin, bu `loggingInterceptor` isteği iletmeden önce giden istek URL'sini `console.log`'a günlükler:

```ts
export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}
```

Bu yakalayıcının gerçekten istekleri yakalaması için `HttpClient`'ı bunu kullanacak şekilde yapılandırmanız gerekir.

## Configuring interceptors

Yakalayıcıları kullanacağınız kümeyi, `withInterceptors` özelliğini kullanarak bağımlılık enjeksiyonu aracılığıyla `HttpClient`'ı yapılandırırken bildirirsiniz:

```ts
bootstrapApplication(App, {
  providers: [provideHttpClient(withInterceptors([loggingInterceptor, cachingInterceptor]))],
});
```

Yapılandırdığınız yakalayıcılar, providers'da listelediğiniz sırada zincirlenir. Yukarıdaki örnekte, `loggingInterceptor` isteği işler ve ardından `cachingInterceptor`'a iletir.

### Intercepting response events

Bir yakalayıcı, yanıta erişmek veya onu değiştirmek için `next` tarafından döndürülen `HttpEvent`'lerin `Observable` akışını dönüştürebilir. Bu akış tüm yanıt olaylarını içerdiğinden, son yanıt nesnesini tanımlamak için her olayın `.type`'ını incelemek gerekebilir.

```ts
export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response) {
        console.log(req.url, 'returned a response with status', event.status);
      }
    }),
  );
}
```

TIP: Yakalayıcılar, istek nesnesini yakalayan bir closure içinde yanıt akışını dönüştürdükleri için yanıtları giden istekleriyle doğal olarak ilişkilendirir.

## Modifying requests

`HttpRequest` ve `HttpResponse` örneklerinin çoğu yönü _değiştirilemezdir_ ve yakalayıcılar bunları doğrudan değiştiremez. Bunun yerine, yakalayıcılar `.clone()` işlemini kullanarak bu nesneleri klonlayarak ve yeni örnekte hangi özelliklerin değiştirilmesi gerektiğini belirterek değişiklikleri uygular. Bu, değerin kendisinde değiştirilemez güncellemeler yapmayı içerebilir (`HttpHeaders` veya `HttpParams` gibi).

Örneğin, bir isteğe başlık eklemek için:

```ts
const reqWithHeader = req.clone({
  headers: req.headers.set('X-New-Header', 'new header value'),
});
```

Bu değiştirilemezlik, aynı `HttpRequest` yakalayıcı zincirine birden fazla kez gönderildiğinde çoğu yakalayıcının idempotent olmasını sağlar. Bu, bir isteğin başarısızlık sonrası yeniden denenmesi dahil çeşitli nedenlerle gerçekleşebilir.

CRITICAL: Bir istek veya yanıtın gövdesi derin değişikliklere karşı korunmaz. Bir yakalayıcının gövdeyi değiştirmesi gerekiyorsa, aynı istekte birden fazla kez çalışmayı ele almaya dikkat edin.

## Dependency injection in interceptors

Yakalayıcılar, onları kaydeden enjektörün _enjeksiyon bağlamında_ çalışır ve bağımlılıkları almak için Angular'ın [`inject`](/api/core/inject) API'sini kullanabilir.

Örneğin, bir uygulamanın giden istekler için kimlik doğrulama belirteçleri oluşturan `AuthService` adında bir servisi olduğunu varsayalım. Bir yakalayıcı bu servisi enjekte edip kullanabilir:

```ts
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).getAuthToken();

  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('X-Authentication-Token', authToken),
  });
  return next(newReq);
}
```

## Request and response metadata

Genellikle bir isteğe arka uca gönderilmeyen, özellikle yakalayıcılara yönelik bilgiler eklemek yararlıdır. `HttpRequest`'ler, bu tür meta verileri bir `HttpContext` örneği olarak depolayan bir `.context` nesnesine sahiptir. Bu nesne, `HttpContextToken` türünde anahtarlara sahip tipli bir harita olarak işlev görür.

Bu sistemin nasıl çalıştığını göstermek için, belirli bir istek için bir önbellekleme yakalayıcısının etkin olup olmadığını kontrol etmek üzere meta verileri kullanalım.

### Defining context tokens

Önbellekleme yakalayıcısının belirli bir isteği önbelleğe alıp almayacağını o isteğin `.context` haritasında saklamak için, anahtar olarak kullanılacak yeni bir `HttpContextToken` tanımlayın:

```ts
export const CACHING_ENABLED = new HttpContextToken<boolean>(() => true);
```

Sağlanan fonksiyon, bunun için açıkça bir değer ayarlanmamış istekler için belirtecin varsayılan değerini oluşturur. Bir fonksiyon kullanmak, belirtecin değeri bir nesne veya dizi ise her isteğin kendi örneğini almasını sağlar.

### Reading the token in an interceptor

Bir yakalayıcı daha sonra belirteci okuyabilir ve değerine göre önbellekleme mantığını uygulayıp uygulamamayı seçebilir:

```ts
export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (req.context.get(CACHING_ENABLED)) {
    // apply caching logic
    return ...;
  } else {
    // caching has been disabled for this request
    return next(req);
  }
}
```

### Setting context tokens when making a request

`HttpClient` API'si aracılığıyla istek yaparken, `HttpContextToken`'lar için değerler sağlayabilirsiniz:

```ts
const data$ = http.get('/sensitive/data', {
  context: new HttpContext().set(CACHING_ENABLED, false),
});
```

Yakalayıcılar bu değerleri isteğin `HttpContext`'inden okuyabilir.

### The request context is mutable

`HttpRequest`'lerin diğer özelliklerinden farklı olarak, ilişkili `HttpContext` _değiştirilebilirdir_. Bir yakalayıcı daha sonra yeniden denenen bir isteğin bağlamını değiştirirse, aynı yakalayıcı tekrar çalıştığında bağlam değişikliğini gözlemler. Gerektiğinde birden fazla yeniden deneme arasında durum aktarmak için bu kullanışlıdır.

## Synthetic responses

Çoğu yakalayıcı, isteği veya yanıtı dönüştürürken basitçe `next` işleyicisini çağıracaktır, ancak bu kesinlikle bir gereklilik değildir. Bu bölüm, bir yakalayıcının daha gelişmiş davranışlar içerebilmesinin çeşitli yollarını açıklar.

Yakalayıcıların `next`'i çağırması zorunlu değildir. Bunun yerine, yanıtları bir önbellekten veya isteği alternatif bir mekanizma aracılığıyla göndererek başka bir yolla oluşturmayı seçebilirler.

`HttpResponse` yapıcısını kullanarak bir yanıt oluşturmak mümkündür:

```ts
const resp = new HttpResponse({
  body: 'response body',
});
```

## Working with redirect information

`HttpClient`'ı `withFetch` sağlayıcısı ile kullanırken, yanıtlar yanıtın bir yönlendirmenin sonucu olup olmadığını gösteren bir `redirected` özelliği içerir. Bu özellik yerel Fetch API spesifikasyonu ile uyumludur ve yönlendirme senaryolarını ele almak için yakalayıcılarda kullanışlı olabilir.

Bir yakalayıcı yönlendirme bilgisine erişebilir ve buna göre davranabilir:

```ts
export function redirectTrackingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response && event.redirected) {
        console.log('Request to', req.url, 'was redirected to', event.url);
        // Handle redirect logic - maybe update analytics, security checks, etc.
      }
    }),
  );
}
```

Yakalayıcılarınızda koşullu mantık uygulamak için yönlendirme bilgisini de kullanabilirsiniz:

```ts
export function authRedirectInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    tap((event) => {
      if (event.type === HttpEventType.Response && event.redirected) {
        // Check if we were redirected to a login page
        if (event.url?.includes('/login')) {
          // Handle authentication redirect
          handleAuthRedirect();
        }
      }
    }),
  );
}
```

## Working with response types

`HttpClient`'ı `withFetch` sağlayıcısı ile kullanırken, yanıtlar tarayıcının CORS politikaları ve istek moduna göre yanıtı nasıl işlediğini gösteren bir `type` özelliği içerir. Bu özellik yerel Fetch API spesifikasyonu ile uyumludur ve CORS sorunlarını ayıklamak ve yanıt erişilebilirliğini anlamak için değerli bilgiler sağlar.

Yanıt `type` özelliği aşağıdaki değerlere sahip olabilir:

- `'basic'` - Tüm başlıkların erişilebilir olduğu aynı kökenli yanıt
- `'cors'` - CORS başlıkları doğru şekilde yapılandırılmış çapraz kökenli yanıt
- `'opaque'` - CORS olmadan çapraz kökenli yanıt, başlıklar ve gövde sınırlı olabilir
- `'opaqueredirect'` - no-cors modunda yönlendirilmiş bir istekten gelen yanıt
- `'error'` - Ağ hatası oluştu

Bir yakalayıcı, CORS ayıklama ve hata yönetimi için yanıt türü bilgisini kullanabilir:

```ts
export function responseTypeInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    map((event) => {
      if (event.type === HttpEventType.Response) {
        // Handle different response types appropriately
        switch (event.responseType) {
          case 'opaque':
            // Limited access to response data
            console.warn('Limited response data due to CORS policy');
            break;
          case 'cors':
          case 'basic':
            // Full access to response data
            break;
          case 'error':
            // Handle network errors
            console.error('Network error in response');
            break;
        }
      }
    }),
  );
}
```

## DI-based interceptors

`HttpClient` ayrıca enjekte edilebilir sınıflar olarak tanımlanan ve DI sistemi aracılığıyla yapılandırılan yakalayıcıları da destekler. DI tabanlı yakalayıcıların yetenekleri fonksiyonel yakalayıcılarla aynıdır, ancak yapılandırma mekanizması farklıdır.

DI tabanlı bir yakalayıcı, `HttpInterceptor` arayüzünü uygulayan enjekte edilebilir bir sınıftır:

```ts
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request URL: ' + req.url);
    return handler.handle(req);
  }
}
```

DI tabanlı yakalayıcılar, bir bağımlılık enjeksiyonu çoklu sağlayıcı aracılığıyla yapılandırılır:

```ts
bootstrapApplication(App, {
  providers: [
    provideHttpClient(
      // DI-based interceptors must be explicitly enabled.
      withInterceptorsFromDi(),
    ),

    {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true},
  ],
});
```

DI tabanlı yakalayıcılar, sağlayıcılarının kaydedildiği sırada çalışır. Kapsamlı ve hiyerarşik bir DI yapılandırmasına sahip bir uygulamada, bu sırayı tahmin etmek çok zor olabilir.
