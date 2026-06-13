# Service'ler oluşturma ve kullanma

Servisler, Angular uygulamanız genelinde paylaşabileceğiniz yeniden kullanılabilir kod parçalarıdır. Bunları genellikle veri getirme, iş mantığı veya birden fazla bileşenin erişmesi gereken diğer işlevleri yönetmek için kullanırsınız.

## Bir service oluşturma

[Angular CLI](tools/cli) kullanarak aşağıdaki komutla bir servis oluşturabilirsiniz:

```bash
ng generate service CUSTOM_NAME
```

Bu komut, `src` dizininizde özel bir `CUSTOM_NAME.ts` dosyası oluşturur.

Ayrıca bir TypeScript sınıfına `@Service()` dekoratörünü ekleyerek manuel olarak bir servis oluşturabilirsiniz. Bu, Angular'a sınıfı enjekte edilebilir bir bağımlılık olarak kullanabileceğinizi söyler.

Aşağıdaki örnek, kullanıcıların veri eklemesine ve veri almasına olanak tanıyan bir servis tanımlar:

```ts {header: "src/app/basic-data-store.ts"}
import {Service} from '@angular/core';

@Service()
export class BasicDataStore {
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data];
  }
}
```

## Service'ler nasıl kullanılabilir hale gelir

Servisinizde `@Injectable({ providedIn: 'root' })` kullandığınızda, Angular:

- Tüm uygulama için **tek bir örnek** (bir singleton) oluşturur
- Ek yapılandırma olmadan **uygulamanız genelinde kullanılabilir** hale getirir
- **Tree-shaking'i etkinleştirir**, böylece Angular servisi yalnızca gerçekten kullanırsanız JavaScript paketinize dahil eder

Bu, çoğu servis için önerilen yaklaşımdır.

## `@Service` dekoratörünü kullanma

Uygulamanız genelinde kullanılabilen bir singleton servisin yaygın durumu için Angular, `@Injectable({providedIn: 'root'})` ifadesine daha ergonomik bir alternatif olarak `@Service` dekoratörünü sunar.

Önceki `BasicDataStore` örneği `@Service` ile yeniden yazılabilir:

```ts {header: "src/app/basic-data-store.ts"}
import {Service} from '@angular/core';

@Service()
export class BasicDataStore {
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data];
  }
}
```

Bu, yukarıdaki `@Injectable({providedIn: 'root'})` sürümüyle aynı şekilde davranır: Angular tek bir örnek oluşturur, her yerde kullanılabilir hale getirir ve hiç enjekte edilmezse paketten tree-shake eder.

### Uygulamayı bir factory ile değiştirme

Singleton'ın nasıl oluşturulduğunu kontrol etmeniz gerekiyorsa, örneğin ortama bağlı olarak farklı bir uygulamayı devreye almak için, bir `factory` fonksiyonu geçirin.

Factory bir [enjeksiyon bağlamında](guide/di/dependency-injection-context) çalışır, böylece diğer bağımlılıkları okumak için içinde [`inject()`](api/core/inject) kullanabilirsiniz.

Aşağıdaki `Analytics` servisi yerelde bir no-op'tur, böylece olaylar geliştirme sırasında konsolu kirletmez. Üretimde factory bir `ANALYTICS_ENABLED` token'ını okur ve olayları gerçek izleyiciye ileten bir `GoogleAnalytics` alt sınıfı döndürür:

```ts {header: "src/app/analytics.ts"}
import {inject, InjectionToken, Service} from '@angular/core';
import {ANALYTICS_ENABLED} from './token';

@Service({
  factory: () => (inject(ANALYTICS_ENABLED) ? new GoogleAnalytics() : new Analytics()),
})
export class Analytics {
  track(event: string, payload?: Record<string, unknown>) {
    // Varsayılan olarak no-op.
  }
}

class GoogleAnalytics extends Analytics {
  override track(event: string, payload?: Record<string, unknown>) {
    // Google Analytics'e bir analitik olayı gönderir
  }
}
```

NOTE: `factory` seçeneği, `@Injectable`'ın `useClass`, `useValue`, `useExisting` ve `useFactory` seçeneklerinin yerini alır. Bunlardan herhangi birine ihtiyacınız varsa `@Injectable` kullanmaya devam edin.

### Otomatik sağlamadan vazgeçme

Varsayılan olarak `@Service`, sınıfı kök enjektörde sağlar. Onu manuel olarak sağlamak isterseniz, örneğin belirli bir route'a veya bileşene kapsamlamak için, `autoProvided: false` olarak ayarlayın:

```ts {header: "src/app/analytics-logger.ts"}
import {Service} from '@angular/core';

@Service({autoProvided: false})
export class AnalyticsLogger {
  trackEvent(name: string) {
    console.log('event:', name);
  }
}
```

Bu durumda, tıpkı düz bir `@Injectable()` ile olduğu gibi, servisi bir `providers` dizisine eklemekten siz sorumlu olursunuz:

### `@Service` mi `@Injectable` mı kullanmalı

`inject()` fonksiyonunu bağımlılıkları için kullanan yeni bir singleton sınıfı oluşturuyorsanız `@Service`'e başvurun. Aşağıdakilerden herhangi birine ihtiyacınız olduğunda `@Injectable` kullanmaya devam edin:

- **Constructor tabanlı bağımlılık enjeksiyonu.** `@Service` yalnızca [`inject()`](api/core/inject) fonksiyonunu destekler.
- **Gelişmiş sağlayıcı yapılandırması** örneğin `useClass`, `useValue`, `useExisting` veya `useFactory`. `@Service` bunun yerine tek bir `factory` seçeneği sunar.
- **Kök dışı kapsamlar** örneğin `providedIn: 'platform'`.

## Bir service'i enjekte etme

`providedIn: 'root'` ile bir servis oluşturduktan sonra, `@angular/core`'dan `inject()` fonksiyonunu kullanarak uygulamanızın herhangi bir yerinde enjekte edebilirsiniz.

### Bir bileşene enjekte etme

```angular-ts
import {Component, inject} from '@angular/core';
import {BasicDataStore} from './basic-data-store';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>{{ dataStore.getData() }}</p>
      <button (click)="dataStore.addData('More data')">Add more data</button>
    </div>
  `,
})
export class Example {
  dataStore = inject(BasicDataStore);
}
```

### Başka bir service'e enjekte etme

```ts
import {inject, Service} from '@angular/core';
import {AdvancedDataStore} from './advanced-data-store';

@Service()
export class BasicDataStore {
  private advancedDataStore = inject(AdvancedDataStore);
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data, ...this.advancedDataStore.getData()];
  }
}
```

## Sonraki adımlar

`providedIn: 'root'` çoğu kullanım durumunu karşılarken, Angular ayrıca daha özel senaryolar için servisleri yapılandırabileceğiniz ek yollar da sunar:

- **Bileşene özgü örnekler** - Bileşenlerin kendi izole servis örneklerine ihtiyaç duyması durumunda
- **Manuel yapılandırma** - Çalışma zamanı yapılandırması gerektiren servisler için
- **Fabrika sağlayıcıları** - Çalışma zamanı koşullarına göre dinamik servis oluşturma için
- **Değer sağlayıcıları** - Yapılandırma nesneleri veya sabitler sağlamak için

Bu gelişmiş desenler hakkında daha fazla bilgiyi sonraki kılavuzda bulabilirsiniz: [bağımlılık sağlayıcılarını tanımlama](/guide/di/defining-dependency-providers).
