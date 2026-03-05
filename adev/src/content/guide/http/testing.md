# Test requests

Herhangi bir dış bağımlılık için olduğu gibi, testlerinizin uzak bir sunucu ile etkileşimi simüle edebilmesi için HTTP arka ucunu taklit etmeniz gerekir. `@angular/common/http/testing` kütüphanesi, uygulama tarafından yapılan istekleri yakalamak, bunlar hakkında doğrulamalar yapmak ve arka ucunuzun davranışını taklit etmek için yanıtları simüle etmek amacıyla araçlar sağlar.

Test kütüphanesi, uygulamanın önce kodu yürütüp istekleri yaptığı bir kalıp için tasarlanmıştır. Ardından test, belirli isteklerin yapılıp yapılmadığını bekler, bu istekler üzerinde doğrulamalar yapar ve son olarak beklenen her isteği "temizleyerek" yanıtları sağlar.

Sonunda, testler uygulamanın beklenmeyen istekler yapmadığını doğrulayabilir.

## Setup for testing

`HttpClient` kullanımını test etmeye başlamak için `TestBed`'i yapılandırın ve testinizin kurulumuna `provideHttpClient()` ile `provideHttpClientTesting()`'i dahil edin. Bu, `HttpClient`'ı gerçek ağ yerine bir test arka ucu kullanacak şekilde yapılandırır. Ayrıca test arka ucu ile etkileşim kurmak, hangi isteklerin yapıldığına dair beklentiler belirlemek ve bu isteklere yanıtları temizlemek için kullanacağınız `HttpTestingController`'ı da sağlar. `HttpTestingController`, yapılandırıldıktan sonra `TestBed`'den enjekte edilebilir.

IMPORTANT: `provideHttpClient()`'ı `provideHttpClientTesting()`'den **önce** sağlamayı unutmayın, çünkü `provideHttpClientTesting()` `provideHttpClient()`'ın bazı kısımlarını geçersiz kılacaktır. Ters sırada yapmak testlerinizi potansiyel olarak bozabilir.

```ts
TestBed.configureTestingModule({
  providers: [
    // ... other test providers
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);
```

Artık testleriniz istek yaptığında, normal arka uç yerine test arka ucuna ulaşacaktır. `httpTesting`'i bu istekler hakkında doğrulamalar yapmak için kullanabilirsiniz.

## Expecting and answering requests

Örneğin, bir GET isteğinin oluşmasını bekleyen ve sahte bir yanıt sağlayan bir test yazabilirsiniz:

```ts
TestBed.configureTestingModule({
  providers: [ConfigService, provideHttpClient(), provideHttpClientTesting()],
});

const httpTesting = TestBed.inject(HttpTestingController);

// Load `ConfigService` and request the current configuration.
const service = TestBed.inject(ConfigService);
const config$ = service.getConfig<Config>();

// `firstValueFrom` subscribes to the `Observable`, which makes the HTTP request,
// and creates a `Promise` of the response.
const configPromise = firstValueFrom(config$);

// At this point, the request is pending, and we can assert it was made
// via the `HttpTestingController`:
const req = httpTesting.expectOne('/api/config', 'Request to load the configuration');

// We can assert various properties of the request if desired.
expect(req.request.method).toBe('GET');

// Flushing the request causes it to complete, delivering the result.
req.flush(DEFAULT_CONFIG);

// We can then assert that the response was successfully delivered by the `ConfigService`:
expect(await configPromise).toEqual(DEFAULT_CONFIG);

// Finally, we can assert that no other requests were made.
httpTesting.verify();
```

NOTE: Verilen kriterlere uyan birden fazla istek yapılmışsa `expectOne` başarısız olacaktır.

`req.method` üzerinde doğrulama yapmaya alternatif olarak, istek yöntemini de eşleştiren `expectOne`'ın genişletilmiş biçimini kullanabilirsiniz:

```ts
const req = httpTesting.expectOne(
  {
    method: 'GET',
    url: '/api/config',
  },
  'Request to load the configuration',
);
```

HELPFUL: Beklenti API'leri, sorgu parametreleri dahil isteklerin tam URL'sine göre eşleşir.

Bekleyen istek kalmadığını doğrulayan son adım, bir `afterEach()` adımına taşınabilecek kadar yaygındır:

```ts
afterEach(() => {
  // Verify that none of the tests make any extra HTTP requests.
  TestBed.inject(HttpTestingController).verify();
});
```

## Handling more than one request at once

Testinizde yinelenen isteklere yanıt vermeniz gerekiyorsa, `expectOne()` yerine `match()` API'sini kullanın. Aynı argümanları alır ancak eşleşen isteklerin bir dizisini döndürür. Döndürüldükten sonra, bu istekler gelecekteki eşleşmelerden çıkarılır ve bunları temizlemek ve doğrulamaktan siz sorumlusunuz.

```ts
const allGetRequests = httpTesting.match({method: 'GET'});
for (const req of allGetRequests) {
  // Handle responding to each request.
}
```

## Advanced matching

Tüm eşleştirme fonksiyonları, özel eşleştirme mantığı için bir yüklem fonksiyonu kabul eder:

```ts
// Look for one request that has a request body.
const requestsWithBody = httpTesting.expectOne((req) => req.body !== null);
```

`expectNone` fonksiyonu, verilen kriterlere uyan hiçbir isteğin olmadığını doğrular.

```ts
// Assert that no mutation requests have been issued.
httpTesting.expectNone((req) => req.method !== 'GET');
```

## Testing error handling

Uygulamanızın HTTP istekleri başarısız olduğundaki yanıtlarını test etmelisiniz.

### Backend errors

Arka uç hatalarını (sunucu başarısız bir durum kodu döndürdüğünde) test etmek için, arka ucunuzun bir istek başarısız olduğunda döndüreceğini taklit eden bir hata yanıtı ile istekleri temizleyin.

```ts
const req = httpTesting.expectOne('/api/config');
req.flush('Failed!', {status: 500, statusText: 'Internal Server Error'});

// Assert that the application successfully handled the backend error.
```

### Network errors

İstekler ağ hataları nedeniyle de başarısız olabilir ve bunlar `ProgressEvent` hataları olarak ortaya çıkar. Bunlar `error()` yöntemi ile iletilebilir:

```ts
const req = httpTesting.expectOne('/api/config');
req.error(new ProgressEvent('network error!'));

// Assert that the application successfully handled the network error.
```

## Testing an Interceptor

Yakalayıcılarınızın istenen koşullarda çalıştığını test etmelisiniz.

Örneğin, bir uygulamanın her giden isteğe bir servis tarafından üretilen kimlik doğrulama belirteci eklemesi gerekebilir.
Bu davranış bir yakalayıcı kullanılarak uygulanabilir:

```ts
export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  const clonedRequest = request.clone({
    headers: request.headers.append('X-Authentication-Token', authService.getAuthToken()),
  });
  return next(clonedRequest);
}
```

Bu yakalayıcı için `TestBed` yapılandırması `withInterceptors` özelliğine dayanmalıdır.

```ts
TestBed.configureTestingModule({
  providers: [
    AuthService,
    // Testing one interceptor at a time is recommended.
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClientTesting(),
  ],
});
```

`HttpTestingController`, isteğin değiştirildiğinden emin olmak için incelenebilecek istek örneğini alabilir.

```ts
const service = TestBed.inject(AuthService);
const req = httpTesting.expectOne('/api/config');

expect(req.request.headers.get('X-Authentication-Token')).toEqual(service.getAuthToken());
```

Benzer bir yakalayıcı sınıf tabanlı yakalayıcılarla da uygulanabilir:

```ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest = request.clone({
      headers: request.headers.append('X-Authentication-Token', this.authService.getAuthToken()),
    });
    return next.handle(clonedRequest);
  }
}
```

Bunu test etmek için `TestBed` yapılandırması bunun yerine şöyle olmalıdır:

```ts
TestBed.configureTestingModule({
  providers: [
    AuthService,
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    // We rely on the HTTP_INTERCEPTORS token to register the AuthInterceptor as an HttpInterceptor
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
});
```
