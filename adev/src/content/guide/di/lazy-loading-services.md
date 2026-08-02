# Service'leri lazy loading ile yükleme

IMPORTANT: Lazy loading'in çalışması için, yüklediğiniz servisin otomatik olarak sağlanması (auto-provided) gerekir. Onu `@Injectable({providedIn: 'root'})` veya [`@Service()`](guide/di/creating-and-using-services#service-ve-injectable-dekoratörlerini-kullanma) ile süsleyin. Otomatik sağlama olmadan Angular'ın, servis yüklendikten sonra onu oluşturmasının bir yolu yoktur.

Angular'ın `injectAsync` fonksiyonu, bir servisi yalnızca gerçekten ihtiyaç duyulduğunda, talep üzerine yüklemenize olanak tanır. Bu, bir servis büyük bir kütüphaneye ya da nadiren kullanılan bir özelliğe bağlı olduğunda ve bunun bedelini ilk sayfa yüklemesinde ödemek istemediğinizde kullanışlıdır.

`injectAsync` kullandığınızda, servisin kodu bundler'ınız tarafından ayrı bir JavaScript chunk'ına ayrılır ve örneği ilk kez istediğinizde indirilir. Yüklendikten sonra Angular, servisi normal DI sistemi üzerinden çözer, böylece servis hâlâ diğer enjekte edilebilirlere bağlı olabilir ve diğer herhangi bir singleton gibi davranır.

## Bir service'i lazily enjekte etme

Ağır bir spreadsheet kütüphanesine bağlı olan bir `ReportExporter` düşünün. Çoğu kullanıcı raporu açar; yalnızca birkaçı **Export** düğmesine tıklar. Exporter'ı talep üzerine yükleyin:

```angular-ts
import {Component, injectAsync} from '@angular/core';

@Component({
  selector: 'app-report',
  template: `<button (click)="export()">Export</button>`,
})
export class Report {
  private exporter = injectAsync(() => import('./report-exporter').then((m) => m.ReportExporter));

  async export() {
    const exporter = await this.exporter();
    exporter.export();
  }
}
```

`this.exporter()` çağrısı ilk kez yapıldığında dinamik import tetiklenir ve servis DI'dan çözülür. Sonraki çağrılar aynı promise'i yeniden kullanır, böylece chunk yalnızca bir kez indirilir.

Lazy olarak yüklenen servis [default export](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) ise, dinamik import'u doğrudan geçirin, Angular sizin için `default`'u açar:

```ts {header: report-exporter.ts}
@Service()
export default class ReportExporter {
  /* … */
}
```

```ts {header: report.ts}
private exporter = injectAsync(() => import('./report-exporter'));
```

## Bağımlılığı önceden yükleme (prefetch) {#prefetching-the-dependency}

Varsayılan olarak lazy chunk, yalnızca döndürülen fonksiyonu çağırdığınızda indirilir. Seçeneklerde bir `prefetch` tetikleyicisi geçirerek indirmeyi daha erken başlatabilirsiniz. Bir tetikleyici, `Promise` döndüren herhangi bir fonksiyondur; promise çözüldüğünde Angular loader'ı başlatır.

Angular, tarayıcı boşta kalana kadar bekleyen yerleşik bir tetikleyici olan `onIdle` ile birlikte gelir:

```ts
import {Component, injectAsync, onIdle} from '@angular/core';

@Component({/* … */})
export class Report {
  private exporter = injectAsync(() => import('./report-exporter').then((m) => m.ReportExporter), {
    prefetch: onIdle,
  });
}
```

Ayrıca `onIdle`'ı bir maksimum bekleme süresiyle yapılandırabilirsiniz, böylece prefetch yoğun sayfalarda bile her zaman bilinen bir zaman aralığı içinde gerçekleşir:

```ts
injectAsync(loader, {prefetch: () => onIdle({timeout: 1_000})});
```

NOTE: Prefetching fırsatçıdır (opportunistic). Kullanıcı, prefetch tetiklenmeden önce özelliği çağırırsa, Angular yine de bağımlılığı hemen yükler ve hazır olur olmaz `await`'inizi çözer.

## Özel bir prefetch tetikleyicisi sağlama

Bir `PrefetchTrigger` yalnızca bir promise döndüren bir fonksiyondur; promise çözülür çözülmez loader çalışır. Prefetching'i bir hover ya da bir scheduler tick gibi kendi sinyallerinizle hizalamak için bunu kullanın:

```ts
import {PrefetchTrigger} from '@angular/core';

export function onHover(target: HTMLElement): PrefetchTrigger {
  return () =>
    new Promise<void>((resolve) => {
      target.addEventListener('pointerenter', () => resolve(), {once: true});
    });
}
```
