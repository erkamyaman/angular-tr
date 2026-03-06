# Request'leri Test Etme

Herhangi bir dış bağımlılık için olduğu gibi, testlerinizin uzak bir sunucu ile etkileşimi simüle edebilmesi için HTTP arka ucunu taklit etmeniz gerekir. `@angular/common/http/testing` kütüphanesi, uygulama tarafından yapılan istekleri yakalamak, bunlar hakkında doğrulamalar yapmak ve arka ucunuzun davranışını taklit etmek için yanıtları simüle etmek amacıyla araçlar sağlar.

Test kütüphanesi, uygulamanın önce kodu yürütüp istekleri yaptığı bir kalıp için tasarlanmıştır. Ardından test, belirli isteklerin yapılıp yapılmadığını bekler, bu istekler üzerinde doğrulamalar yapar ve son olarak beklenen her isteği "temizleyerek" yanıtları sağlar.

Sonunda, testler uygulamanın beklenmeyen istekler yapmadığını doğrulayabilir.

## Test Kurulumu

`HttpClient` kullanımını test etmeye başlamak için `TestBed`'i yapılandırın ve testinizin kurulumuna `provideHttpClient()` ile `provideHttpClientTesting()`'i dahil edin. Bu, `HttpClient`'ı gerçek ağ yerine bir test arka ucu kullanacak şekilde yapılandırır. Ayrıca test arka ucu ile etkileşim kurmak, hangi isteklerin yapıldığına dair beklentiler belirlemek ve bu isteklere yanıtları temizlemek için kullanacağınız `HttpTestingController`'ı da sağlar. `HttpTestingController`, yapılandırıldıktan sonra `TestBed`'den enjekte edilebilir.

IMPORTANT: `provideHttpClient()`'ı `provideHttpClientTesting()`'den **önce** sağlamayı unutmayın, çünkü `provideHttpClientTesting()` `provideHttpClient()`'ın bazı kısımlarını geçersiz kılacaktır. Ters sırada yapmak testlerinizi potansiyel olarak bozabilir.

```ts
TestBed.configureTestingModule({
  providers: [
    // ... diğer test sağlayıcıları
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);
```

Artık testleriniz istek yaptığında, normal arka uç yerine test arka ucuna ulaşacaktır. `httpTesting`'i bu istekler hakkında doğrulamalar yapmak için kullanabilirsiniz.

## Request'leri Bekleme ve Yanıtlama

Örneğin, bir GET isteğinin oluşmasını bekleyen ve sahte bir yanıt sağlayan bir test yazabilirsiniz:

```ts
TestBed.configureTestingModule({
  providers: [ConfigService, provideHttpClient(), provideHttpClientTesting()],
});

const httpTesting = TestBed.inject(HttpTestingController);

// `ConfigService`'i yükle ve mevcut yapılandırmayı iste.
const service = TestBed.inject(ConfigService);
const config$ = service.getConfig<Config>();

// `firstValueFrom`, HTTP isteğini yapan `Observable`'a abone olur
// ve yanıtın bir `Promise`'ini oluşturur.
const configPromise = firstValueFrom(config$);

// Bu noktada istek beklemede ve `HttpTestingController`
// aracılığıyla yapıldığını doğrulayabiliriz:
const req = httpTesting.expectOne('/api/config', 'Request to load the configuration');

// İstenirse isteğin çeşitli özelliklerini doğrulayabiliriz.
expect(req.request.method).toBe('GET');

// İsteği temizlemek tamamlanmasına ve sonucun iletilmesine neden olur.
req.flush(DEFAULT_CONFIG);

// Ardından yanıtın `ConfigService` tarafından başarıyla iletildiğini doğrulayabiliriz:
expect(await configPromise).toEqual(DEFAULT_CONFIG);

// Son olarak, başka istek yapılmadığını doğrulayabiliriz.
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
  // Testlerin hiçbirinin fazladan HTTP isteği yapmadığını doğrula.
  TestBed.inject(HttpTestingController).verify();
});
```

## Aynı Anda Birden Fazla İsteği Yönetme

Testinizde yinelenen isteklere yanıt vermeniz gerekiyorsa, `expectOne()` yerine `match()` API'sini kullanın. Aynı argümanları alır ancak eşleşen isteklerin bir dizisini döndürür. Döndürüldükten sonra, bu istekler gelecekteki eşleşmelerden çıkarılır ve bunları temizlemek ve doğrulamaktan siz sorumlusunuz.

```ts
const allGetRequests = httpTesting.match({method: 'GET'});
for (const req of allGetRequests) {
  // Her isteğe yanıt vermeyi yönet.
}
```

## Gelişmiş Eşleştirme

Tüm eşleştirme fonksiyonları, özel eşleştirme mantığı için bir yüklem fonksiyonu kabul eder:

```ts
// İstek gövdesi olan bir istek ara.
const requestsWithBody = httpTesting.expectOne((req) => req.body !== null);
```

`expectNone` fonksiyonu, verilen kriterlere uyan hiçbir isteğin olmadığını doğrular.

```ts
// Değişiklik isteği yapılmadığını doğrula.
httpTesting.expectNone((req) => req.method !== 'GET');
```

## Hata Yönetimini Test Etme

Uygulamanızın HTTP istekleri başarısız olduğundaki yanıtlarını test etmelisiniz.

### Arka Uç Hataları

Arka uç hatalarını (sunucu başarısız bir durum kodu döndürdüğünde) test etmek için, arka ucunuzun bir istek başarısız olduğunda döndüreceğini taklit eden bir hata yanıtı ile istekleri temizleyin.

```ts
const req = httpTesting.expectOne('/api/config');
req.flush('Failed!', {status: 500, statusText: 'Internal Server Error'});

// Uygulamanın arka uç hatasını başarıyla yönettiğini doğrula.
```

### Ağ Hataları

İstekler ağ hataları nedeniyle de başarısız olabilir ve bunlar `ProgressEvent` hataları olarak ortaya çıkar. Bunlar `error()` yöntemi ile iletilebilir:

```ts
const req = httpTesting.expectOne('/api/config');
req.error(new ProgressEvent('network error!'));

// Uygulamanın ağ hatasını başarıyla yönettiğini doğrula.
```

## Bir Interceptor'ı Test Etme

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
    // Aynı anda tek bir interceptor'ı test etmek önerilir.
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
    // AuthInterceptor'ı bir HttpInterceptor olarak kaydetmek için HTTP_INTERCEPTORS token'ına güveniyoruz
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
});
```
