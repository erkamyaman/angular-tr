# Understanding communicating with backend services using HTTP

Çoğu ön yüz uygulaması, veri indirmek veya yüklemek ve diğer arka uç hizmetlerine erişmek için HTTP protokolü üzerinden bir sunucu ile iletişim kurmalıdır. Angular, Angular uygulamaları için `@angular/common/http` içindeki `HttpClient` hizmet sınıfı olan bir istemci HTTP API'si sağlar.

## HTTP client service features

HTTP istemci hizmeti aşağıdaki başlıca özellikleri sunar:

- [Tipli yanıt değerleri](guide/http/making-requests#fetching-json-data) talep etme yeteneği
- Kolaylaştırılmış [hata yönetimi](guide/http/making-requests#handling-request-failure)
- İstek ve yanıt [yakalama](guide/http/interceptors)
- Güçlü [test araçları](guide/http/testing)

## What's next

<docs-pill-row>
  <docs-pill href="guide/http/setup" title="Setting up HttpClient"/>
  <docs-pill href="guide/http/making-requests" title="Making HTTP requests"/>
</docs-pill-row>
