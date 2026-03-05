# Rendering strategies in Angular

Bu kılavuz, Angular uygulamanızın farklı bölümleri için doğru render stratejisini seçmenize yardımcı olur.

## What are rendering strategies?

Render stratejileri, Angular uygulamanızın HTML içeriğinin ne zaman ve nerede oluşturulacağını belirler. Her strateji, başlangıç sayfa yükleme performansı, etkileşim, SEO yetenekleri ve sunucu kaynak kullanımı arasında farklı dengeler sunar.

Angular üç birincil render stratejisini destekler:

- **İstemci Tarafında Render (CSR)** - İçerik tamamen tarayıcıda render edilir
- **Statik Site Oluşturma (SSG/Prerendering)** - İçerik derleme zamanında önceden render edilir
- **Sunucu Tarafında Render (SSR)** - İçerik, bir rota için ilk istek sırasında sunucuda render edilir

## Client-Side Rendering (CSR)

**CSR, Angular'ın varsayılanıdır.** İçerik, JavaScript yüklendikten sonra tamamen tarayıcıda render edilir.

### When to use CSR

Uygun olabilecek durumlar:

- Etkileşimli uygulamalar (panolar, yönetici panelleri)
- Gerçek zamanlı uygulamalar
- SEO'nun önemli olmadığı dahili araçlar
- Karmaşık istemci tarafı durumuna sahip tek sayfalık uygulamalar

Mümkünse kaçınılması gereken durumlar:

- SEO'ya ihtiyaç duyan kamuya açık içerik
- İlk yükleme performansının kritik olduğu sayfalar

### CSR trade-offs

| Yön                 | Etki                                                            |
| :------------------ | :-------------------------------------------------------------- |
| **SEO**             | Zayıf - JS çalışana kadar içerik tarayıcılar için görünür değil |
| **İlk yükleme**     | Daha yavaş - önce JavaScript indirilip çalıştırılmalı           |
| **Etkileşim**       | Yüklendikten sonra anında                                       |
| **Sunucu ihtiyacı** | Bazı yapılandırma dışında minimum                               |
| **Karmaşıklık**     | En basit çünkü minimum yapılandırma ile çalışır                 |

## Static Site Generation (SSG/Prerendering)

**SSG, sayfaları derleme zamanında** statik HTML dosyalarına önceden render eder. Sunucu, ilk sayfa yüklemesi için önceden oluşturulmuş HTML gönderir. Hidrasyon sonrasında uygulamanız geleneksel bir SPA gibi tamamen tarayıcıda çalışır - sonraki navigasyon, rota değişiklikleri ve API çağrıları sunucu render'ı olmadan istemci tarafında gerçekleşir.

### When to use SSG

Uygun olabilecek durumlar:

- Pazarlama sayfaları ve açılış sayfaları
- Blog yazıları ve dokümantasyon
- Sabit içerikli ürün katalogları
- Kullanıcıya göre değişmeyen içerik

Mümkünse kaçınılması gereken durumlar:

- Kullanıcıya özel içerik
- Sık değişen veriler
- Gerçek zamanlı bilgiler

### SSG trade-offs

| Yön                       | Etki                                        |
| :------------------------ | :------------------------------------------ |
| **SEO**                   | Mükemmel - tam HTML anında kullanılabilir   |
| **İlk yükleme**           | En hızlı - önceden oluşturulmuş HTML        |
| **Etkileşim**             | Hidrasyon tamamlandıktan sonra              |
| **Sunucu ihtiyacı**       | Sunma için gerekli değil (CDN dostu)        |
| **Derleme süresi**        | Daha uzun - tüm sayfaları önceden oluşturur |
| **İçerik güncellemeleri** | Yeniden derleme ve dağıtım gerektirir       |

**Uygulama:** SSR kılavuzundaki [Derleme zamanı ön render'ı özelleştirme](guide/ssr#customizing-build-time-prerendering-ssg) bölümüne bakın.

## Server-Side Rendering (SSR)

**SSR, bir rota için ilk istek sırasında sunucuda HTML oluşturur** ve iyi SEO ile dinamik içerik sağlar. Sunucu HTML'yi render eder ve istemciye gönderir.

İstemci sayfayı render ettikten sonra, Angular uygulamayı [hidratasyon](/guide/hydration#what-is-hydration) ile canlandırır ve ardından uygulama geleneksel bir SPA gibi tamamen tarayıcıda çalışır - sonraki navigasyon, rota değişiklikleri ve API çağrıları ek sunucu render'ı olmadan istemci tarafında gerçekleşir.

### When to use SSR

Uygun olabilecek durumlar:

- E-ticaret ürün sayfaları (dinamik fiyatlandırma/envanter)
- Haber siteleri ve sosyal medya akışları
- Sık değişen kişiselleştirilmiş içerik

Mümkünse kaçınılması gereken durumlar:

- Statik içerik (bunun yerine SSG kullanın)
- Sunucu maliyetlerinin endişe kaynağı olduğu durumlar

### SSR trade-offs

| Yön                    | Etki                                                |
| :--------------------- | :-------------------------------------------------- |
| **SEO**                | Mükemmel - tarayıcılar için tam HTML                |
| **İlk yükleme**        | Hızlı - anında içerik görünürlüğü                   |
| **Etkileşim**          | Hidrasyona kadar gecikmiş                           |
| **Sunucu ihtiyacı**    | Sunucu gerektirir                                   |
| **Kişiselleştirme**    | Kullanıcı bağlamına tam erişim                      |
| **Sunucu maliyetleri** | Daha yüksek - bir rota için ilk istekte render eder |

**Uygulama:** SSR kılavuzundaki [Sunucu yönlendirme](guide/ssr#server-routing) ve [Sunucu uyumlu bileşenler yazma](guide/ssr#authoring-server-compatible-components) bölümlerine bakın.

## Choosing the Right Strategy

### Decision matrix

| İhtiyacınız...           | Kullanılacak strateji | Neden                                         |
| :----------------------- | :-------------------- | :-------------------------------------------- |
| **SEO + Statik içerik**  | SSG                   | Önceden render edilmiş HTML, en hızlı yükleme |
| **SEO + Dinamik içerik** | SSR                   | Bir rota için ilk istekte taze içerik         |
| **SEO yok + Etkileşim**  | CSR                   | En basit, sunucu gerekmez                     |
| **Karma gereksinimler**  | Hibrit                | Rota başına farklı stratejiler                |

## Making SSR/SSG Interactive with Hydration

SSR veya SSG kullanırken, Angular sunucu tarafında render edilmiş HTML'yi etkileşimli hale getirmek için "hidratasyon" yapar.

**Mevcut stratejiler:**

- **Tam hidrasyon** - Tüm uygulama bir seferde etkileşimli hale gelir (varsayılan)
- **Artımlı hidrasyon** - Parçalar gerektiğinde etkileşimli hale gelir (daha iyi performans)
- **Olay tekrarı** - Hidrasyon tamamlanmadan önce tıklamaları yakalar

**Daha fazla bilgi:**

- [Hidrasyon kılavuzu](guide/hydration) - Tam hidrasyon kurulumu
- [Artımlı hidrasyon](guide/incremental-hydration) - `@defer` blokları ile gelişmiş hidrasyon

## Next steps

<docs-pill-row>
  <docs-pill href="/guide/ssr" title="Server-Side Rendering"/>
  <docs-pill href="/guide/hydration" title="Hydration"/>
  <docs-pill href="/guide/incremental-hydration" title="Incremental Hydration"/>
</docs-pill-row>
