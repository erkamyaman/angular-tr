# Angular without ZoneJS (Zoneless)

## Why use Zoneless?

ZoneJS'i bağımlılık olarak kaldırmanın başlıca avantajları şunlardır:

- **Geliştirilmiş performans**: ZoneJS, uygulama durumunun _güncellenmiş olabileceğinin_ göstergeleri olarak DOM olaylarını ve asenkron görevleri kullanır ve ardından uygulamanın görünümlerinde değişiklik algılama çalıştırmak için uygulama senkronizasyonunu tetikler. ZoneJS'in uygulama durumunun gerçekten değişip değişmediğine dair herhangi bir içgörüsü yoktur, bu nedenle bu senkronizasyon gerekenden daha sık tetiklenir.
- **Geliştirilmiş Core Web Vitals**: ZoneJS, hem yük boyutu hem de başlatma süresi maliyeti açısından önemli miktarda ek yük getirir.
- **Geliştirilmiş hata ayıklama deneyimi**: ZoneJS, kod hata ayıklamayı zorlaştırır. Yığın izlerini ZoneJS ile anlamak daha zordur. Ayrıca kodun Angular Zone'un dışında olması nedeniyle ne zaman bozulduğunu anlamak da güçtür.
- **Daha iyi ekosistem uyumluluğu**: ZoneJS, tarayıcı API'lerini yamalayarak çalışır ancak her yeni tarayıcı API'si için otomatik olarak yamalara sahip değildir. `async`/`await` gibi bazı API'ler etkili bir şekilde yamalanamamakta ve ZoneJS ile çalışmak için alt seviyeye dönüştürülmeleri gerekmektedir. Bazen ekosistemdeki kütüphaneler de ZoneJS'in yerel API'leri yamalama biçimiyle uyumsuz olabilir. ZoneJS'i bağımlılık olarak kaldırmak, karmaşıklık, monkey patching ve süregelen bakım kaynağını ortadan kaldırarak daha iyi uzun vadeli uyumluluk sağlar.

## Enabling Zoneless in an application

Zoneless, Angular v21+'de varsayılan olduğundan etkinleştirmek için herhangi bir şey yapmanız gerekmez. Varsayılan yapılandırmayı geçersiz kılmak için `provideZoneChangeDetection`'ın hiçbir yerde kullanılmadığını doğrulamalısınız.

Angular v20 kullanıyorsanız, başlatmada `provideZonelessChangeDetection()` ekleyerek zoneless değişiklik algılamayı etkinleştirin:

```ts {header: 'standalone bootstrap'}
bootstrapApplication(MyApp, {providers: [provideZonelessChangeDetection()]});
```

```ts {header: 'NgModule bootstrap'}
platformBrowser().bootstrapModule(AppModule);

@NgModule({
  providers: [provideZonelessChangeDetection()],
})
export class AppModule {}
```

## Removing ZoneJS

Zoneless uygulamalar, paket boyutunu azaltmak için ZoneJS'i derlemeden tamamen kaldırmalıdır. ZoneJS genellikle `angular.json`'daki `polyfills` seçeneği aracılığıyla hem `build` hem de `test` hedeflerinde yüklenir. Her ikisinden de `zone.js` ve `zone.js/testing`'i kaldırarak derlemeden kaldırın. Açık bir `polyfills.ts` dosyası kullanan projeler, dosyadan `import 'zone.js';` ve `import 'zone.js/testing';` ifadelerini kaldırmalıdır.

ZoneJS'i derlemeden kaldırdıktan sonra, artık bir `zone.js` bağımlılığına da ihtiyaç yoktur ve paket tamamen kaldırılabilir:

```shell
npm uninstall zone.js
```

## Requirements for Zoneless compatibility

Angular, değişiklik algılamayı ne zaman çalıştıracağını ve hangi görünümlerde çalıştıracağını belirlemek için çekirdek API'lerden gelen bildirimlere dayanır.
Bu bildirimler şunları içerir:

- `ChangeDetectorRef.markForCheck` (`AsyncPipe` tarafından otomatik olarak çağrılır)
- `ComponentRef.setInput`
- Bir şablonda okunan bir sinyalin güncellenmesi
- Bağlı host veya şablon dinleyici geri çağırmaları
- Yukarıdakilerden biri tarafından kirli olarak işaretlenmiş bir görünümün eklenmesi

### `OnPush`-compatible components

Bir bileşenin yukarıdaki doğru bildirim mekanizmalarını kullandığından emin olmanın bir yolu [ChangeDetectionStrategy.OnPush](/best-practices/skipping-subtrees#using-onpush) kullanmaktır.

`OnPush` değişiklik algılama stratejisi zorunlu değildir, ancak uygulama bileşenleri için zoneless uyumluluğuna doğru önerilen bir adımdır. Kütüphane bileşenlerinin `ChangeDetectionStrategy.OnPush` kullanması her zaman mümkün değildir.
Bir kütüphane bileşeni, `ChangeDetectionStrategy.Eager`/`Default` kullanabilen kullanıcı bileşenleri için bir host olduğunda, `OnPush` kullanılamaz çünkü bu, alt bileşenin `OnPush` uyumlu olmaması ve değişiklik algılamayı tetiklemek için ZoneJS'e bağlı olması durumunda yenilenmesini engelleyecektir. Bileşenler, Angular'a değişiklik algılamanın ne zaman çalıştırılması gerektiğini bildirdikleri sürece (`markForCheck` çağırma, sinyal kullanma, `AsyncPipe` vb.) `Default` stratejisini kullanabilirler.
Bir kullanıcı bileşeni için host olmak, `ViewContainerRef.createComponent` gibi bir API kullanmak anlamına gelir ve bir kullanıcı bileşeninin şablonunun bir bölümünü barındırmak (yani içerik projeksiyonu veya bir şablon ref girişi kullanma) anlamına gelmez.

### Remove `NgZone.onMicrotaskEmpty`, `NgZone.onUnstable`, `NgZone.isStable`, or `NgZone.onStable`

Uygulamalar ve kütüphaneler `NgZone.onMicrotaskEmpty`, `NgZone.onUnstable` ve `NgZone.onStable` kullanımlarını kaldırmalıdır.
Bu observable'lar, bir Uygulama zoneless değişiklik algılamayı etkinleştirdiğinde asla yayın yapmayacaktır.
Benzer şekilde, `NgZone.isStable` her zaman `true` olacaktır ve kod yürütme için koşul olarak kullanılmamalıdır.

`NgZone.onMicrotaskEmpty` ve `NgZone.onStable` observable'ları çoğunlukla Angular'ın değişiklik algılamayı tamamlamasını beklemek için kullanılır. Bunun yerine, tek bir değişiklik algılama beklemeleri gerekiyorsa `afterNextRender` ile veya birkaç değişiklik algılama turuna yayılabilecek bir koşul varsa `afterEveryRender` ile değiştirilebilirler. Diğer durumlarda, bu observable'lar tanıdık oldukları ve ihtiyaç duyulana benzer zamanlamaya sahip oldukları için kullanılıyordu. Bunun yerine daha açık veya doğrudan DOM API'leri kullanılabilir, örneğin kodun belirli bir DOM durumunu beklemesi gerektiğinde (Angular'ın render kancaları aracılığıyla dolaylı olarak beklemek yerine) `MutationObserver` gibi.

<docs-callout title="NgZone.run and NgZone.runOutsideAngular are compatible with Zoneless">
`NgZone.run` ve `NgZone.runOutsideAngular`'ın Zoneless uygulamalarla uyumlu olması için kaldırılmasına gerek yoktur. Aslında, bu çağrıların kaldırılması, hâlâ ZoneJS'e dayanan uygulamalarda kullanılan kütüphaneler için performans gerilemelerine yol açabilir.
</docs-callout>

### `PendingTasks` for Server Side Rendering (SSR)

Angular ile SSR kullanıyorsanız, uygulamanın ne zaman "kararlı" olduğunu ve serileştirilebileceğini belirlemeye yardımcı olmak için ZoneJS'e dayandığını biliyor olabilirsiniz. Serileştirmeyi engellemesi gereken asenkron görevler varsa, ZoneJS kullanmayan bir uygulama Angular'ı [PendingTasks](/api/core/PendingTasks) servisi ile bunlardan haberdar etmelidir. Serileştirme, tüm bekleyen görevlerin kaldırıldığı ilk anı bekleyecektir.

Bekleyen görevlerin en basit iki kullanımı `run` yöntemidir:

```typescript
const taskService = inject(PendingTasks);
taskService.run(async () => {
  const someResult = await doSomeWorkThatNeedsToBeRendered();
  this.someState.set(someResult);
});
```

Daha karmaşık kullanım durumları için, bir bekleyen görevi manuel olarak ekleyip kaldırabilirsiniz:

```typescript
const taskService = inject(PendingTasks);
const taskCleanup = taskService.add();
try {
  await doSomeWorkThatNeedsToBeRendered();
} catch {
  // handle error
} finally {
  taskCleanup();
}
```

Ek olarak, `rxjs-interop`'taki [pendingUntilEvent](/api/core/rxjs-interop/pendingUntilEvent#) yardımcısı, observable yayın yapana, tamamlanana, hata verene veya abonelikten çıkana kadar uygulamanın kararsız kalmasını sağlar.

```typescript
readonly myObservableState = someObservable.pipe(pendingUntilEvent());
```

Framework, asenkron görevler tamamlanana kadar serileştirmeyi önlemek için bu servisi dahili olarak da kullanır. Bunlar, devam eden bir Router navigasyonu ve tamamlanmamış bir `HttpClient` isteği dahil ancak bunlarla sınırlı değildir.

## Testing and Debugging

### Using Zoneless in `TestBed`

`TestBed`, `zone.js` `polyfills` aracılığıyla yüklendiğinde varsayılan olarak Zone tabanlı değişiklik algılama kullanır.

`zone.js` mevcut değilse, `TestBed` varsayılan olarak zoneless çalışır. `zone.js` yüklendiğinde zoneless modunu zorlamak için `provideZonelessChangeDetection()` ekleyin:

```typescript
TestBed.configureTestingModule({
  // Optional: include the provider to force the testing environment
  // uses the same zoneless behavior as a zoneless application.
  providers: [provideZonelessChangeDetection()],
});

const fixture = TestBed.createComponent(MyComponent);
await fixture.whenStable();
```

Testlerin üretim koduna en benzer davranışa sahip olmasını sağlamak için, mümkün olduğunda `fixture.detectChanges()` kullanmaktan kaçının. Bu, Angular'ın aksi takdirde değişiklik algılama zamanlamayabileceği durumlarda değişiklik algılamayı çalıştırmaya zorlar. Testler, bu bildirimlerin gerçekleştiğinden emin olmalı ve durumu testte manuel olarak zorlamak yerine Angular'ın ne zaman senkronize edeceğini yönetmesine izin vermelidir.

Mevcut test setleri için `fixture.detectChanges()` kullanmak yaygın bir kalıptır ve bunları `await fixture.whenStable()`'a dönüştürmek muhtemelen çabaya değmez. `TestBed` yine de fixture'ın bileşeninin `OnPush` uyumlu olduğunu zorlayacak ve bir değişiklik bildirimi olmadan şablon değerlerinin güncellendiğini tespit ederse (yani `fixture.componentInstance.someValue = 'newValue';`) `ExpressionChangedAfterItHasBeenCheckedError` fırlatacaktır.
Bileşen üretimde kullanılıyorsa, bu sorun bileşenin durum için sinyaller kullanacak şekilde güncellenmesi veya `ChangeDetectorRef.markForCheck()` çağrılması ile giderilmelidir.
Bileşen yalnızca test sarmalayıcı olarak kullanılıyorsa ve bir uygulamada hiç kullanılmıyorsa, `fixture.changeDetectorRef.markForCheck()` kullanmak kabul edilebilir.

### Debug-mode check to ensure updates are detected

Angular ayrıca bir uygulamanın durumu zoneless uyumlu bir şekilde güncellediğini doğrulamaya yardımcı olmak için ek bir araç sağlar. `provideCheckNoChangesConfig({exhaustive: true, interval: <milliseconds>}})` periyodik olarak hiçbir bağlamanın bir bildirim olmadan güncellenmediğinden emin olmak için kontrol etmek üzere kullanılabilir. Angular, zoneless değişiklik algılama tarafından yenilenmeyecek güncellenmiş bir bağlama varsa `ExpressionChangedAfterItHasBeenCheckedError` fırlatır.
