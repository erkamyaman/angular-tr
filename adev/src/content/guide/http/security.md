# `HttpClient` security

`HttpClient`, iki yaygın HTTP güvenlik mekanizması için yerleşik destek içerir: XSSI koruması ve XSRF/CSRF koruması.

TIP: API'leriniz için bir [İçerik Güvenliği Politikası](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy) benimsemeyi de düşünün.

## XSSI protection

Siteler Arası Betik Dahil Etme (XSSI), bir saldırganın API uç noktalarınızdan JSON verilerini kontrol ettikleri bir sayfada `<script>` olarak yüklediği bir [Siteler Arası Betik Çalıştırma](https://en.wikipedia.org/wiki/Cross-site_scripting) saldırısı biçimidir. Bu verilere erişmek için farklı JavaScript teknikleri kullanılabilir.

XSSI'yi önlemek için yaygın bir teknik, JSON yanıtlarını yaygın olarak `)]}',\n` şeklinde olan "çalıştırılamaz bir önek" ile sunmaktır. Bu önek, JSON yanıtının geçerli çalıştırılabilir JavaScript olarak yorumlanmasını engeller. API veri olarak yüklendiğinde, JSON ayrıştırma öncesinde önek kaldırılabilir.

`HttpClient`, bir yanıttan JSON ayrıştırırken bu XSSI önekini (varsa) otomatik olarak kaldırır.

## XSRF/CSRF protection

[Siteler Arası İstek Sahteciliği (XSRF veya CSRF)](https://en.wikipedia.org/wiki/Cross-site_request_forgery), bir saldırganın kimliği doğrulanmış bir kullanıcıyı bilmeden web sitenizde eylemler gerçekleştirmeye kandırabildiği bir saldırı tekniğidir.

`HttpClient`, XSRF saldırılarını önlemek için kullanılan [yaygın bir mekanizmayı](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token) destekler. HTTP istekleri gerçekleştirirken, bir yakalayıcı varsayılan olarak `XSRF-TOKEN` adlı bir çerezden bir belirteç okur ve bunu `X-XSRF-TOKEN` HTTP başlığı olarak ayarlar. Yalnızca alan adınızda çalışan kod çerezi okuyabildiğinden, arka uç HTTP isteğinin saldırgandan değil istemci uygulamanızdan geldiğinden emin olabilir.

Varsayılan olarak, bir yakalayıcı bu başlığı tüm değiştirici isteklerde (örneğin `POST`) göreli ve aynı kökenli URL'lere gönderir, ancak `GET` veya `HEAD` isteklerinde göndermez.

<docs-callout helpful title="Why not protect GET requests?">
CSRF koruması yalnızca arka uçtaki durumu değiştirebilecek istekler için gereklidir. CSRF saldırıları doğası gereği alan adı sınırlarını aşar ve web'in [aynı köken politikası](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy), saldıran bir sayfanın kimliği doğrulanmış `GET` isteklerinin sonuçlarını almasını engelleyecektir.
</docs-callout>

Bu özellikten yararlanmak için sunucunuzun sayfa yüklendiğinde veya ilk GET isteğinde `XSRF-TOKEN` adlı JavaScript tarafından okunabilir bir oturum çerezine bir belirteç ayarlaması gerekir. Sonraki isteklerde sunucu, çerezin `X-XSRF-TOKEN` HTTP başlığıyla eşleştiğini doğrulayabilir ve böylece yalnızca alan adınızda çalışan kodun isteği göndermiş olabileceğinden emin olabilir. Belirteç her kullanıcı için benzersiz olmalı ve sunucu tarafından doğrulanabilir olmalıdır; bu, istemcinin kendi belirteçlerini oluşturmasını engeller. Ek güvenlik için belirteci sitenizin kimlik doğrulama çerezinin bir özetiyle birlikte bir tuz ile ayarlayın.

Birden fazla Angular uygulamasının aynı alan adını veya alt alan adını paylaştığı ortamlarda çakışmaları önlemek için her uygulamaya benzersiz bir çerez adı verin.

<docs-callout important title="HttpClient supports only the client half of the XSRF protection scheme">
  Arka uç hizmetiniz sayfanız için çerezi ayarlayacak ve tüm uygun isteklerde başlığın mevcut olduğunu doğrulayacak şekilde yapılandırılmalıdır. Bunu yapmamak Angular'ın varsayılan korumasını etkisiz kılar.
</docs-callout>

### Configure custom cookie/header names

Arka uç hizmetiniz XSRF belirteç çerezi veya başlığı için farklı adlar kullanıyorsa, varsayılanları geçersiz kılmak için `withXsrfConfiguration` kullanın.

Bunu `provideHttpClient` çağrısına aşağıdaki gibi ekleyin:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'CUSTOM_XSRF_TOKEN',
        headerName: 'X-Custom-Xsrf-Header',
      }),
    ),
  ],
};
```

### Disabling XSRF protection

Yerleşik XSRF koruma mekanizması uygulamanız için çalışmıyorsa, `withNoXsrfProtection` özelliğini kullanarak devre dışı bırakabilirsiniz:

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withNoXsrfProtection())],
};
```
