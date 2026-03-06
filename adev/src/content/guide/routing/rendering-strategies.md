# Angular'da Render Stratejileri

Bu kılavuz, Angular uygulamanızın farklı bölümleri için doğru render stratejisini seçmenize yardımcı olur.

## Render stratejileri nedir?

Render stratejileri, Angular uygulamanızın HTML içeriğinin ne zaman ve nerede oluşturulacağını belirler. Her strateji, başlangıç sayfa yükleme performansı, etkileşim, SEO yetenekleri ve sunucu kaynak kullanımı arasında farklı dengeler sunar.

Angular üç birincil render stratejisini destekler:

- **İstemci Tarafında Render (CSR)** - İçerik tamamen tarayıcıda render edilir
- **Statik Site Oluşturma (SSG/Prerendering)** - İçerik derleme zamanında önceden render edilir
- **Sunucu Tarafında Render (SSR)** - İçerik, bir rota için ilk istek sırasında sunucuda render edilir

## İstemci Tarafında Render (CSR)

**CSR, Angular'ın varsayılanıdır.** İçerik, JavaScript yüklendikten sonra tamamen tarayıcıda render edilir.

### CSR ne zaman kullanılmalı

Uygun olabilecek durumlar:

- Etkileşimli uygulamalar (panolar, yönetici panelleri)
- Gerçek zamanlı uygulamalar
- SEO'nun önemli olmadığı dahili araçlar
- Karmaşık istemci tarafı durumuna sahip tek sayfalık uygulamalar

Mümkünse kaçınılması gereken durumlar:

- SEO'ya ihtiyaç duyan kamuya açık içerik
- İlk yükleme performansının kritik olduğu sayfalar

### CSR ödünleşimleri

| Yön                 | Etki                                                            |
| :------------------ | :-------------------------------------------------------------- |
| **SEO**             | Zayıf - JS çalışana kadar içerik tarayıcılar için görünür değil |
| **İlk yükleme**     | Daha yavaş - önce JavaScript indirilip çalıştırılmalı           |
| **Etkileşim**       | Yüklendikten sonra anında                                       |
| **Sunucu ihtiyacı** | Bazı yapılandırma dışında minimum                               |
| **Karmaşıklık**     | En basit çünkü minimum yapılandırma ile çalışır                 |

## Statik Site Oluşturma (SSG/Prerendering)

**SSG, sayfaları derleme zamanında** statik HTML dosyalarına önceden render eder. Sunucu, ilk sayfa yüklemesi için önceden oluşturulmuş HTML gönderir. Hidrasyon sonrasında uygulamanız geleneksel bir SPA gibi tamamen tarayıcıda çalışır - sonraki navigasyon, rota değişiklikleri ve API çağrıları sunucu render'ı olmadan istemci tarafında gerçekleşir.

### SSG ne zaman kullanılmalı

Uygun olabilecek durumlar:

- Pazarlama sayfaları ve açılış sayfaları
- Blog yazıları ve dokümantasyon
- Sabit içerikli ürün katalogları
- Kullanıcıya göre değişmeyen içerik

Mümkünse kaçınılması gereken durumlar:

- Kullanıcıya özel içerik
- Sık değişen veriler
- Gerçek zamanlı bilgiler

### SSG ödünleşimleri

| Yön                       | Etki                                        |
| :------------------------ | :------------------------------------------ |
| **SEO**                   | Mükemmel - tam HTML anında kullanılabilir   |
| **İlk yükleme**           | En hızlı - önceden oluşturulmuş HTML        |
| **Etkileşim**             | Hidrasyon tamamlandıktan sonra              |
| **Sunucu ihtiyacı**       | Sunma için gerekli değil (CDN dostu)        |
| **Derleme süresi**        | Daha uzun - tüm sayfaları önceden oluşturur |
| **İçerik güncellemeleri** | Yeniden derleme ve dağıtım gerektirir       |

**Uygulama:** SSR kılavuzundaki [Derleme zamanı ön render'ı özelleştirme](guide/ssr#derleme-zamanı-ön-renderı-ssg-özelleştirme) bölümüne bakın.

## Sunucu Tarafında Render (SSR)

**SSR, bir rota için ilk istek sırasında sunucuda HTML oluşturur** ve iyi SEO ile dinamik içerik sağlar. Sunucu HTML'yi render eder ve istemciye gönderir.

İstemci sayfayı render ettikten sonra, Angular uygulamayı [hidratasyon](/guide/hydration#hydration-nedir) ile canlandırır ve ardından uygulama geleneksel bir SPA gibi tamamen tarayıcıda çalışır - sonraki navigasyon, rota değişiklikleri ve API çağrıları ek sunucu render'ı olmadan istemci tarafında gerçekleşir.

### SSR ne zaman kullanılmalı

Uygun olabilecek durumlar:

- E-ticaret ürün sayfaları (dinamik fiyatlandırma/envanter)
- Haber siteleri ve sosyal medya akışları
- Sık değişen kişiselleştirilmiş içerik

Mümkünse kaçınılması gereken durumlar:

- Statik içerik (bunun yerine SSG kullanın)
- Sunucu maliyetlerinin endişe kaynağı olduğu durumlar

### SSR ödünleşimleri

| Yön                    | Etki                                                |
| :--------------------- | :-------------------------------------------------- |
| **SEO**                | Mükemmel - tarayıcılar için tam HTML                |
| **İlk yükleme**        | Hızlı - anında içerik görünürlüğü                   |
| **Etkileşim**          | Hidrasyona kadar gecikmiş                           |
| **Sunucu ihtiyacı**    | Sunucu gerektirir                                   |
| **Kişiselleştirme**    | Kullanıcı bağlamına tam erişim                      |
| **Sunucu maliyetleri** | Daha yüksek - bir rota için ilk istekte render eder |

**Uygulama:** SSR kılavuzundaki [Sunucu yönlendirme](guide/ssr#sunucu-yönlendirme) ve [Sunucu uyumlu bileşenler yazma](guide/ssr#authoring-server-compatible-components) bölümlerine bakın.

## Doğru Stratejiyi Seçme

### Karar matrisi

| İhtiyacınız...           | Kullanılacak strateji | Neden                                         |
| :----------------------- | :-------------------- | :-------------------------------------------- |
| **SEO + Statik içerik**  | SSG                   | Önceden render edilmiş HTML, en hızlı yükleme |
| **SEO + Dinamik içerik** | SSR                   | Bir rota için ilk istekte taze içerik         |
| **SEO yok + Etkileşim**  | CSR                   | En basit, sunucu gerekmez                     |
| **Karma gereksinimler**  | Hibrit                | Rota başına farklı stratejiler                |

## SSR/SSG'yi Hidrasyon ile Etkileşimli Hale Getirme

SSR veya SSG kullanırken, Angular sunucu tarafında render edilmiş HTML'yi etkileşimli hale getirmek için "hidratasyon" yapar.

**Mevcut stratejiler:**

- **Tam hidrasyon** - Tüm uygulama bir seferde etkileşimli hale gelir (varsayılan)
- **Artımlı hidrasyon** - Parçalar gerektiğinde etkileşimli hale gelir (daha iyi performans)
- **Olay tekrarı** - Hidrasyon tamamlanmadan önce tıklamaları yakalar

**Daha fazla bilgi:**

- [Hidrasyon kılavuzu](guide/hydration) - Tam hidrasyon kurulumu
- [Artımlı hidrasyon](guide/incremental-hydration) - `@defer` blokları ile gelişmiş hidrasyon

## Sonraki adımlar

<docs-pill-row>
  <docs-pill href="/guide/ssr" title="Server-Side Rendering"/>
  <docs-pill href="/guide/hydration" title="Hydration"/>
  <docs-pill href="/guide/incremental-hydration" title="Incremental Hydration"/>
</docs-pill-row>
