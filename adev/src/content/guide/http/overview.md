# HTTP Kullanarak Arka Uç Servisleriyle İletişimi Anlamak

Çoğu ön yüz uygulaması, veri indirmek veya yüklemek ve diğer arka uç hizmetlerine erişmek için HTTP protokolü üzerinden bir sunucu ile iletişim kurmalıdır. Angular, Angular uygulamaları için `@angular/common/http` içindeki `HttpClient` hizmet sınıfı olan bir istemci HTTP API'si sağlar.

## HTTP İstemci Servisinin Özellikleri

HTTP istemci hizmeti aşağıdaki başlıca özellikleri sunar:

- [Tipli yanıt değerleri](guide/http/making-requests#json-verisi-alma) talep etme yeteneği
- Kolaylaştırılmış [hata yönetimi](guide/http/making-requests#istek-hatalarını-yönetme)
- İstek ve yanıt [yakalama](guide/http/interceptors)
- Güçlü [test araçları](guide/http/testing)

## Sırada Ne Var

<docs-pill-row>
  <docs-pill href="guide/http/setup" title="Setting up HttpClient"/>
  <docs-pill href="guide/http/making-requests" title="Making HTTP requests"/>
</docs-pill-row>
