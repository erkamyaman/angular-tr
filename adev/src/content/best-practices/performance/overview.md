# Performans

Angular, kutudan çıkan birçok optimizasyon içerir, ancak uygulamalar büyüdükçe, hem uygulamanızın ne kadar hızlı yüklendiğini hem de kullanım sırasında ne kadar duyarlı hissettirdiğini ince ayar yapmanız gerekebilir. Bu kılavuzlar, Angular'ın hızlı uygulamalar oluşturmanıza yardımcı olmak için sağladığı araçları ve teknikleri kapsamaktadır.

## Yükleme performansı

Yükleme performansı, uygulamanızın ne kadar hızlı görünür ve etkileşimli hale geldiğini belirler. Yavaş yükleme, Largest Contentful Paint (LCP) ve Time to First Byte (TTFB) gibi [Core Web Vitals](https://web.dev/vitals/) metriklerini doğrudan etkiler.

| Technique                                                                                                  | What it does                                                                                                                                                                                                                    | When to use it                                                                                |
| :--------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------- |
| [Lazy-loaded routes](best-practices/performance/lazy-loaded-routes#tembel-yüklenen-bileşenler-ve-routelar) | Defers loading route components until navigation, reducing the initial bundle size                                                                                                                                              | Applications with multiple routes where not all are needed on initial load                    |
| [Deferred loading with `@defer`](best-practices/performance/defer)                                         | Splits components into separate bundles that load on demand                                                                                                                                                                     | Components not visible on initial render, heavy third-party libraries, below-the-fold content |
| [Image optimization](best-practices/performance/image-optimization)                                        | Prioritizes LCP images, lazy loads others, generates responsive `srcset` attributes                                                                                                                                             | Any application that displays images                                                          |
| [Server-side rendering](best-practices/performance/ssr)                                                    | Renders pages on the server for faster first paint and better SEO, with [hydration](guide/hydration) to restore interactivity and [incremental hydration](guide/incremental-hydration) to defer hydrating sections until needed | Content-heavy applications, pages that need search engine indexing                            |

## Çalışma zamanı performansı

Çalışma zamanı performansı, uygulamanızın yüklendikten sonra ne kadar duyarlı hissettirdiğini belirler. Angular'ın değişiklik algılama sistemi DOM'u verilerinizle senkronize tutar ve çalışma zamanı performansını iyileştirmek için birincil kaldıracı, bunun nasıl ve ne zaman çalıştığını optimize etmektir.

| Technique                                                       | What it does                                                                                        | When to use it                                                                        |
| :-------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| [Zoneless change detection](guide/zoneless)                     | Removes ZoneJS overhead and triggers change detection only when signals or events indicate a change | New applications (default in Angular v21+), or existing applications ready to migrate |
| [Slow computations](best-practices/slow-computations)           | Identifies and optimizes expensive template expressions and lifecycle hooks                         | Profiling reveals specific components causing slow change detection cycles            |
| [Skipping component subtrees](best-practices/skipping-subtrees) | Uses `OnPush` change detection to skip unchanged component trees                                    | Applications that need finer control over change detection                            |
| [Zone pollution](best-practices/zone-pollution)                 | Prevents unnecessary change detection caused by third-party libraries or timers                     | Zone-based applications where profiling reveals excessive change detection cycles     |

## Performans ölçümü

Neyi optimize edeceğinizi belirlemek, nasıl optimize edeceğinizi bilmek kadar önemlidir. Angular, darboğazları bulmanıza yardımcı olmak için tarayıcı geliştirici araçlarıyla entegre olur.

| Tool                                                                       | What it does                                                                                                                                                                     |
| :------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Chrome DevTools profiling](best-practices/profiling-with-chrome-devtools) | Records Angular-specific performance data alongside browser profiling, with color-coded flame charts that show component rendering, change detection cycles, and lifecycle hooks |
| [Angular DevTools](tools/devtools)                                         | A browser extension that provides a component tree inspector and a profiler for visualizing change detection cycles                                                              |

## Önce neyi optimize etmeli

Nereden başlayacağınızdan emin değilseniz, belirli darboğazları belirlemek için öncelikle uygulamanızı [Chrome DevTools Angular track](best-practices/profiling-with-chrome-devtools) ile profil çıkartın.

Genel bir başlangıç noktası olarak:

- **Yavaş ilk yükleme** — Büyük bileşenleri ana paketten ayırmak için [`@defer`](best-practices/performance/defer), ekranın üst kısmındaki görüntülere öncelik vermek için [`NgOptimizedImage`](best-practices/performance/image-optimization) ve içeriği daha hızlı sunmak için [sunucu taraflı render](best-practices/performance/ssr) kullanın.
- **Yükleme sonrası yavaş etkileşimler** — [Zone'suz değişiklik algılama](guide/zoneless)'nın etkin olup olmadığını kontrol edin, şablonlarda veya yaşam döngüsü kancalarında [yavaş hesaplamalara](best-practices/slow-computations) bakın ve gereksiz değişiklik algılamayı azaltmak için [`OnPush`](best-practices/skipping-subtrees)'u dikkate alın.
