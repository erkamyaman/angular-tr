# Performans

Angular, kutudan çıkan birçok optimizasyon içerir, ancak uygulamalar büyüdükçe, hem uygulamanızın ne kadar hızlı yüklendiğini hem de kullanım sırasında ne kadar duyarlı hissettirdiğini ince ayar yapmanız gerekebilir. Bu kılavuzlar, Angular'ın hızlı uygulamalar oluşturmanıza yardımcı olmak için sağladığı araçları ve teknikleri kapsamaktadır.

## Yükleme performansı

Yükleme performansı, uygulamanızın ne kadar hızlı görünür ve etkileşimli hale geldiğini belirler. Yavaş yükleme, Largest Contentful Paint (LCP) ve Time to First Byte (TTFB) gibi [Core Web Vitals](https://web.dev/vitals/) metriklerini doğrudan etkiler.

| Teknik                                                                                                            | Ne yapar                                                                                                                                                                                                                                                       | Ne zaman kullanılmalı                                                                              |
| :---------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| [Tembel yüklenen route'lar](best-practices/performance/lazy-loaded-routes#tembel-yüklenen-bileşenler-ve-routelar) | Route bileşenlerinin yüklenmesini gezinmeye kadar erteler ve ilk paket boyutunu azaltır                                                                                                                                                                        | Tüm route'ların ilk yüklemede gerekmediği, birden fazla route içeren uygulamalar                   |
| [`@defer` ile ertelenmiş yükleme](best-practices/performance/defer)                                               | Bileşenleri talep üzerine yüklenen ayrı paketlere böler                                                                                                                                                                                                        | İlk render'da görünmeyen bileşenler, ağır üçüncü taraf kütüphaneler, ekranın alt kısmındaki içerik |
| [`injectAsync` ile service'leri tembel yükleme](guide/di/lazy-loading-services)                                   | Nadiren kullanılan service'leri ayrı parçalara böler ve talep üzerine yükler                                                                                                                                                                                   | Büyük kütüphanelere dayanan veya seyrek kullanılan özelliklere ait service'ler                     |
| [Görsel optimizasyonu](best-practices/performance/image-optimization)                                             | LCP görsellerine öncelik verir, diğerlerini tembel yükler, duyarlı `srcset` öznitelikleri üretir                                                                                                                                                               | Görsel gösteren tüm uygulamalar                                                                    |
| [Sunucu taraflı render](best-practices/performance/ssr)                                                           | Daha hızlı ilk boyama ve daha iyi SEO için sayfaları sunucuda render eder; etkileşimi geri yüklemek için [hydration](guide/hydration), bölümlerin hydrate edilmesini gerekene kadar ertelemek için [artımlı hydration](guide/incremental-hydration) kullanılır | İçerik ağırlıklı uygulamalar, arama motoru indekslemesi gereken sayfalar                           |

## Çalışma zamanı performansı

Çalışma zamanı performansı, uygulamanızın yüklendikten sonra ne kadar duyarlı hissettirdiğini belirler. Angular'ın değişiklik algılama sistemi DOM'u verilerinizle senkronize tutar ve çalışma zamanı performansını iyileştirmek için birincil kaldıracı, bunun nasıl ve ne zaman çalıştığını optimize etmektir.

| Teknik                                                            | Ne yapar                                                                                                                          | Ne zaman kullanılmalı                                                                                    |
| :---------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------- |
| [Zone'suz değişiklik algılama](guide/zoneless)                    | ZoneJS yükünü ortadan kaldırır ve değişiklik algılamayı yalnızca sinyaller veya olaylar bir değişikliğe işaret ettiğinde tetikler | Yeni uygulamalar (Angular v21+ sürümlerinde varsayılan) veya geçişe hazır mevcut uygulamalar             |
| [Yavaş hesaplamalar](best-practices/slow-computations)            | Maliyetli şablon ifadelerini ve yaşam döngüsü kancalarını belirler ve optimize eder                                               | Profil çıkarma, yavaş değişiklik algılama döngülerine neden olan belirli bileşenleri ortaya çıkardığında |
| [Bileşen alt ağaçlarını atlama](best-practices/skipping-subtrees) | Değişmemiş bileşen ağaçlarını atlamak için `OnPush` değişiklik algılamayı kullanır                                                | Değişiklik algılama üzerinde daha ince kontrol gerektiren uygulamalar                                    |
| [Zone kirliliği](best-practices/zone-pollution)                   | Üçüncü taraf kütüphaneler veya zamanlayıcıların neden olduğu gereksiz değişiklik algılamayı önler                                 | Profil çıkarmanın aşırı değişiklik algılama döngüleri ortaya çıkardığı Zone tabanlı uygulamalar          |

## Performans ölçümü

Neyi optimize edeceğinizi belirlemek, nasıl optimize edeceğinizi bilmek kadar önemlidir. Angular, darboğazları bulmanıza yardımcı olmak için tarayıcı geliştirici araçlarıyla entegre olur.

| Araç                                                                                | Ne yapar                                                                                                                                                                                                   |
| :---------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Chrome DevTools ile profil çıkarma](best-practices/profiling-with-chrome-devtools) | Tarayıcı profillemesinin yanında Angular'a özgü performans verilerini kaydeder; bileşen render'ını, değişiklik algılama döngülerini ve yaşam döngüsü kancalarını gösteren renk kodlu flame chart'lar sunar |
| [Angular DevTools](tools/devtools)                                                  | Bileşen ağacı denetleyicisi ve değişiklik algılama döngülerini görselleştiren bir profiler sağlayan tarayıcı eklentisi                                                                                     |

## Önce neyi optimize etmeli

Nereden başlayacağınızdan emin değilseniz, belirli darboğazları belirlemek için öncelikle uygulamanızı [Chrome DevTools Angular track](best-practices/profiling-with-chrome-devtools) ile profil çıkartın.

Genel bir başlangıç noktası olarak:

- **Yavaş ilk yükleme** — Büyük bileşenleri ana paketten ayırmak için [`@defer`](best-practices/performance/defer), ekranın üst kısmındaki görüntülere öncelik vermek için [`NgOptimizedImage`](best-practices/performance/image-optimization) ve içeriği daha hızlı sunmak için [sunucu taraflı render](best-practices/performance/ssr) kullanın.
- **Yükleme sonrası yavaş etkileşimler** — [Zone'suz değişiklik algılama](guide/zoneless)'nın etkin olup olmadığını kontrol edin, şablonlarda veya yaşam döngüsü kancalarında [yavaş hesaplamalara](best-practices/slow-computations) bakın ve gereksiz değişiklik algılamayı azaltmak için [`OnPush`](best-practices/skipping-subtrees)'u dikkate alın.
