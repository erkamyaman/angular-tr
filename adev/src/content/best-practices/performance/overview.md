# Performance

Angular, kutudan cikan bircok optimizasyon icerir, ancak uygulamalar buyudukce, hem uygulamanizin ne kadar hizli yuklendigini hem de kullanim sirasinda ne kadar duyarli hissettirdigini ince ayar yapmaniz gerekebilir. Bu kilavuzlar, Angular'in hizli uygulamalar olusturmaniza yardimci olmak icin sagladigi araclari ve teknikleri kapsamaktadir.

## Loading performance

Yukleme performansi, uygulamanizin ne kadar hizli gorunur ve etkilesimli hale geldigini belirler. Yavas yukleme, Largest Contentful Paint (LCP) ve Time to First Byte (TTFB) gibi [Core Web Vitals](https://web.dev/vitals/) metriklerini dogrudan etkiler.

| Technique                                                                                               | What it does                                                                                                                                                                                                                    | When to use it                                                                                |
| :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------- |
| [Lazy-loaded routes](best-practices/performance/lazy-loaded-routes#lazily-loaded-components-and-routes) | Defers loading route components until navigation, reducing the initial bundle size                                                                                                                                              | Applications with multiple routes where not all are needed on initial load                    |
| [Deferred loading with `@defer`](best-practices/performance/defer)                                      | Splits components into separate bundles that load on demand                                                                                                                                                                     | Components not visible on initial render, heavy third-party libraries, below-the-fold content |
| [Image optimization](best-practices/performance/image-optimization)                                     | Prioritizes LCP images, lazy loads others, generates responsive `srcset` attributes                                                                                                                                             | Any application that displays images                                                          |
| [Server-side rendering](best-practices/performance/ssr)                                                 | Renders pages on the server for faster first paint and better SEO, with [hydration](guide/hydration) to restore interactivity and [incremental hydration](guide/incremental-hydration) to defer hydrating sections until needed | Content-heavy applications, pages that need search engine indexing                            |

## Runtime performance

Calisma zamani performansi, uygulamanizin yuklendikten sonra ne kadar duyarli hissettirdigini belirler. Angular'in degisiklik algilama sistemi DOM'u verilerinizle senkronize tutar ve calisma zamani performansini iyilestirmek icin birincil kaldiraci, bunun nasil ve ne zaman calistigini optimize etmektir.

| Technique                                                       | What it does                                                                                        | When to use it                                                                        |
| :-------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| [Zoneless change detection](guide/zoneless)                     | Removes ZoneJS overhead and triggers change detection only when signals or events indicate a change | New applications (default in Angular v21+), or existing applications ready to migrate |
| [Slow computations](best-practices/slow-computations)           | Identifies and optimizes expensive template expressions and lifecycle hooks                         | Profiling reveals specific components causing slow change detection cycles            |
| [Skipping component subtrees](best-practices/skipping-subtrees) | Uses `OnPush` change detection to skip unchanged component trees                                    | Applications that need finer control over change detection                            |
| [Zone pollution](best-practices/zone-pollution)                 | Prevents unnecessary change detection caused by third-party libraries or timers                     | Zone-based applications where profiling reveals excessive change detection cycles     |

## Measuring performance

Neyi optimize edeceginizi belirlemek, nasil optimize edeceginizi bilmek kadar onemlidir. Angular, darbogazlari bulmaniza yardimci olmak icin tarayici gelistirici araclariyla entegre olur.

| Tool                                                                       | What it does                                                                                                                                                                     |
| :------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Chrome DevTools profiling](best-practices/profiling-with-chrome-devtools) | Records Angular-specific performance data alongside browser profiling, with color-coded flame charts that show component rendering, change detection cycles, and lifecycle hooks |
| [Angular DevTools](tools/devtools)                                         | A browser extension that provides a component tree inspector and a profiler for visualizing change detection cycles                                                              |

## What to optimize first

Nereden baslayacaginizdan emin degilseniz, belirli darbogazlari belirlemek icin oncelikle uygulamanizi [Chrome DevTools Angular track](best-practices/profiling-with-chrome-devtools) ile profil cikartin.

Genel bir baslangic noktasi olarak:

- **Yavas ilk yukleme** — Buyuk bilesenleri ana paketten ayirmak icin [`@defer`](best-practices/performance/defer), ekranin ust kismindaki goruntulere oncelik vermek icin [`NgOptimizedImage`](best-practices/performance/image-optimization) ve icerigi daha hizli sunmak icin [sunucu tarafli render](best-practices/performance/ssr) kullanin.
- **Yukleme sonrasi yavas etkilesimler** — [Zone'suz degisiklik algilama](guide/zoneless)'nin etkin olup olmadigini kontrol edin, sablonlarda veya yasam dongusu kancalarinda [yavas hesaplamalara](best-practices/slow-computations) bakin ve gereksiz degisiklik algilamayi azaltmak icin [`OnPush`](best-practices/skipping-subtrees)'u dikkate alin.
