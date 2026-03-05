# Setting up `HttpClient`

Uygulamanızda `HttpClient` kullanabilmeniz için önce onu [bağımlılık enjeksiyonu](guide/di) ile yapılandırmanız gerekir.

## Providing `HttpClient` through dependency injection

`HttpClient`, çoğu uygulamanın `app.config.ts` dosyasındaki uygulama `providers` içine dahil ettiği `provideHttpClient` yardımcı fonksiyonu kullanılarak sağlanır.

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient()],
};
```

Uygulamanız bunun yerine NgModule tabanlı önyükleme kullanıyorsa, `provideHttpClient`'ı uygulamanızın NgModule'ünün providers'ına dahil edebilirsiniz:

```ts
@NgModule({
  providers: [provideHttpClient()],
  // ... other application configuration
})
export class AppModule {}
```

Ardından `HttpClient` hizmetini bileşenlerinizin, servislerinizin veya diğer sınıflarınızın bağımlılığı olarak enjekte edebilirsiniz:

```ts
@Injectable({providedIn: 'root'})
export class ConfigService {
  private http = inject(HttpClient);
  // This service can now make HTTP requests via `this.http`.
}
```

## Configuring features of `HttpClient`

`provideHttpClient`, istemcinin farklı yönlerinin davranışını etkinleştirmek veya yapılandırmak için isteğe bağlı özellik yapılandırmalarının bir listesini kabul eder. Bu bölüm isteğe bağlı özellikleri ve kullanımlarını açıklar.

### `withFetch`

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch())],
};
```

Varsayılan olarak, `HttpClient` istekleri yapmak için [`XMLHttpRequest`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) API'sini kullanır. `withFetch` özelliği istemciyi bunun yerine [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API) API'sini kullanacak şekilde değiştirir.

`fetch` daha modern bir API'dir ve `XMLHttpRequest`'in desteklenmediği bazı ortamlarda kullanılabilir. Yükleme ilerleme olayları üretmemesi gibi bazı sınırlamaları vardır.

### `withInterceptors(...)`

`withInterceptors`, `HttpClient` üzerinden yapılan istekleri işleyecek yakalayıcı fonksiyonları kümesini yapılandırır. Daha fazla bilgi için [yakalayıcılar kılavuzuna](guide/http/interceptors) bakın.

### `withInterceptorsFromDi()`

`withInterceptorsFromDi`, eski tarz sınıf tabanlı yakalayıcıları `HttpClient` yapılandırmasına dahil eder. Daha fazla bilgi için [yakalayıcılar kılavuzuna](guide/http/interceptors) bakın.

HELPFUL: Fonksiyonel yakalayıcılar (`withInterceptors` aracılığıyla) daha öngörülebilir sıralamaya sahiptir ve bunları DI tabanlı yakalayıcılar yerine öneriyoruz.

### `withRequestsMadeViaParent()`

Varsayılan olarak, belirli bir enjektör içinde `provideHttpClient` kullanarak `HttpClient`'ı yapılandırdığınızda, bu yapılandırma üst enjektörde bulunabilecek herhangi bir `HttpClient` yapılandırmasını geçersiz kılar.

`withRequestsMadeViaParent()` eklediğinizde, `HttpClient` bu seviyedeki yapılandırılmış yakalayıcılardan geçtikten sonra istekleri üst enjektördeki `HttpClient` örneğine iletecek şekilde yapılandırılır. Bu, üst enjektörün yakalayıcılarından da geçirerek isteği gönderirken bir alt enjektörde yakalayıcılar _eklemek_ istiyorsanız kullanışlıdır.

CRITICAL: Mevcut enjektörün üstünde bir `HttpClient` örneği yapılandırmanız gerekir, aksi takdirde bu seçenek geçerli değildir ve kullanmaya çalıştığınızda çalışma zamanı hatası alırsınız.

### `withJsonpSupport()`

`withJsonpSupport` dahil edildiğinde, `HttpClient` üzerinde alan adları arası veri yükleme için [JSONP kuralı](https://en.wikipedia.org/wiki/JSONP) aracılığıyla GET isteği yapan `.jsonp()` yöntemi etkinleştirilir.

HELPFUL: Mümkün olduğunda alan adları arası istekler yapmak için JSONP yerine [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) kullanmayı tercih edin.

### `withXsrfConfiguration(...)`

Bu seçeneği dahil etmek, `HttpClient`'ın yerleşik XSRF güvenlik işlevselliğinin özelleştirilmesine olanak tanır. Daha fazla bilgi için [güvenlik kılavuzuna](best-practices/security) bakın.

### `withNoXsrfProtection()`

Bu seçeneği dahil etmek, `HttpClient`'ın yerleşik XSRF güvenlik işlevselliğini devre dışı bırakır. Daha fazla bilgi için [güvenlik kılavuzuna](best-practices/security) bakın.

## `HttpClientModule`-based configuration

Bazı uygulamalar `HttpClient`'ı NgModule'lere dayalı eski API kullanarak yapılandırabilir.

Bu tablo, `@angular/common/http`'den kullanılabilir NgModule'leri ve bunların yukarıdaki sağlayıcı yapılandırma fonksiyonlarıyla nasıl ilişkilendiğini listeler.

| **NgModule**                            | `provideHttpClient()` equivalent              |
| --------------------------------------- | --------------------------------------------- |
| `HttpClientModule`                      | `provideHttpClient(withInterceptorsFromDi())` |
| `HttpClientJsonpModule`                 | `withJsonpSupport()`                          |
| `HttpClientXsrfModule.withOptions(...)` | `withXsrfConfiguration(...)`                  |
| `HttpClientXsrfModule.disable()`        | `withNoXsrfProtection()`                      |

<docs-callout important title="Use caution when using HttpClientModule in multiple injectors">
`HttpClientModule` birden fazla enjektörde bulunduğunda, yakalayıcıların davranışı belirsizdir ve tam seçenekler ile sağlayıcı/içe aktarma sıralamasına bağlıdır.

Daha kararlı davranışa sahip olduğu için çoklu enjektör yapılandırmalarında `provideHttpClient`'ı tercih edin. Yukarıdaki `withRequestsMadeViaParent` özelliğine bakın.
</docs-callout>
