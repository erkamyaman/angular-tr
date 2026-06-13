# Enjekte edilebilir bir service oluşturma

Servis, uygulamanızın ihtiyaç duyduğu herhangi bir değeri, fonksiyonu veya özelliği kapsayan geniş bir kategoridir.
Bir servis tipik olarak odaklı ve iyi tanımlanmış bir amaca sahip bir sınıftır.
Bir bileşen, bağımlılık enjeksiyonu (DI) ile kullanabileceğiniz sınıf türlerinden biridir.

Angular, modülerliği ve yeniden kullanılabilirliği artırmak için bileşenleri servislerden ayırır.
Bir bileşenin görünümle ilgili özelliklerini diğer işleme türlerinden ayırarak, bileşen sınıflarınızı yalın ve verimli tutabilirsiniz.

İdeal olarak, bileşeninizin sorumluluğu kullanıcı deneyimini etkinleştirmek ve başka hiçbir şey olmamalıdır.
Bir bileşen, görünüm (şablon tarafından render edilen) ile uygulama mantığı (genellikle bir model kavramı içeren) arasında aracılık etmek için veri bağlama için özellikler ve yöntemler sunmalıdır.

Bir bileşenden servislere, sunucudan veri getirme, kullanıcı girişini doğrulama veya konsola günlükleme gibi görevleri devredebilirsiniz.
Bu tür görevleri enjekte edilebilir bir servis sınıfında tanımlayarak, bu yetenekleri herhangi bir bileşen için kullanılabilir hale getirirsiniz.
Aynı tür servisin farklı sağlayıcılarını farklı koşullara göre yapılandırarak uygulamanızı daha uyarlanabilir hale de getirebilirsiniz.

Angular bu ilkeleri katı bir şekilde zorunlu kılmaz.
Angular, uygulama mantığınızı servisler halinde düzenlemenizi ve bu servisleri DI aracılığıyla bileşenlere sunmanızı kolaylaştırarak bu ilkeleri takip etmenize yardımcı olur.

## Service örnekleri

İşte tarayıcı konsoluna günlük kaydı yapan bir servis sınıfı örneği:

```ts {header: "logger.service.ts (class)"}
export class Logger {
  log(msg: unknown) {
    console.log(msg);
  }
  error(msg: unknown) {
    console.error(msg);
  }
  warn(msg: unknown) {
    console.warn(msg);
  }
}
```

Servisler diğer servislere bağımlı olabilir.
Örneğin, işte `Logger` servisine bağımlı olan ve ayrıca kahramanları almak için `BackendService` kullanan bir `HeroService`.
Bu servis de sunucudan asenkron olarak kahramanları getirmek için `HttpClient` servisine bağımlı olabilir:

```ts {header: "hero.service.ts", highlight="[7,8,12,13]"}
import {inject} from '@angular/core';

export class HeroService {
  private heroes: Hero[] = [];

  private backend = inject(BackendService);
  private logger = inject(Logger);

  async getHeroes() {
    // Getir
    this.heroes = await this.backend.getAll(Hero);
    // Günlükle
    this.logger.log(`Fetched ${this.heroes.length} heroes.`);
    return this.heroes;
  }
}
```

## CLI ile enjekte edilebilir bir service oluşturma

Angular CLI, yeni bir servis oluşturmak için bir komut sağlar. Aşağıdaki örnekte, mevcut bir uygulamaya yeni bir servis eklersiniz.

`src/app/heroes` klasöründe yeni bir `HeroService` sınıfı oluşturmak için şu adımları izleyin:

1. Şu [Angular CLI](/tools/cli) komutunu çalıştırın:

```sh
ng generate service heroes/hero
```

Bu komut aşağıdaki varsayılan `HeroService`'i oluşturur:

```ts {header: 'heroes/hero.service.ts (CLI-generated)'}
import {Service} from '@angular/core';

@Service()
export class HeroService {}
```

`@Service()` dekoratörü, Angular'ın bu sınıfı DI sisteminde kullanabileceğini ve `HeroService`'in uygulamanız genelinde kullanılabilir olduğunu belirtir.

`mock.heroes.ts` dosyasından kahramanları döndüren bir `getHeroes()` yöntemi ekleyerek kahraman sahte verilerini alın:

```ts {header: 'hero.service.ts'}
import {Service} from '@angular/core';
import {HEROES} from './mock-heroes';

@Service()
export class HeroService {
  getHeroes() {
    return HEROES;
  }
}
```

Netlik ve bakım kolaylığı açısından, bileşenleri ve servisleri ayrı dosyalarda tanımlamanız önerilir.

## Service'leri enjekte etme

Bir servisi bir bileşene enjekte etmek için, bağımlılık için bir sınıf alanı bildirin ve bunu başlatmak için Angular'ın [`inject`](/api/core/inject) fonksiyonunu kullanın.

Aşağıdaki örnek, `HeroList` içinde `HeroService`'i belirtir.
`heroService`'in türü `HeroService`'dir.

```ts
import {inject} from '@angular/core';

export class HeroList {
  private heroService = inject(HeroService);
}
```

Bir servisi bileşenin constructor'ı kullanarak da enjekte etmek mümkündür:

```ts {header: 'hero-list.ts (constructor signature)'}
  constructor(private heroService: HeroService)
```

[`inject`](/api/core/inject) yöntemi hem sınıflarda hem de fonksiyonlarda kullanılabilirken, constructor yöntemi doğal olarak yalnızca bir sınıf constructor'ında kullanılabilir. Ancak her iki durumda da bir bağımlılığı yalnızca geçerli bir [enjeksiyon bağlamında](guide/di/dependency-injection-context), genellikle bir bileşenin oluşturulması veya başlatılması sırasında enjekte edebilirsiniz.

## Diğer service'lerde service'leri enjekte etme

Bir servis başka bir servise bağımlı olduğunda, bir bileşene enjekte etmeyle aynı deseni izleyin.
Aşağıdaki örnekte, `HeroService` faaliyetlerini raporlamak için bir `Logger` servisine bağımlıdır:

```ts {header: 'hero.service.ts, highlight: [[3],[9],[12]]}
import {inject, Service} from '@angular/core';
import {HEROES} from './mock-heroes';
import {Logger} from '../logger.service';

@Service()
export class HeroService {
  private logger = inject(Logger);

  getHeroes() {
    this.logger.log('Getting heroes.');
    return HEROES;
  }
}
```

Bu örnekte, `getHeroes()` yöntemi kahramanları getirirken bir mesaj kaydederek `Logger` servisini kullanır.

## Sırada ne var

<docs-pill-row>
  <docs-pill href="guide/di/defining-dependency-providers" title="Configuring dependency providers"/>
  <docs-pill href="guide/di/defining-dependency-providers#sınıf-dışı-bağımlılıklar-için-otomatik-sağlama" title="`InjectionTokens`"/>
</docs-pill-row>
