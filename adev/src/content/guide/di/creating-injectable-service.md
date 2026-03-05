# Creating an injectable service

Servis, bir uygulamanın ihtiyaç duyduğu herhangi bir değeri, fonksiyonu veya özelliği kapsayan geniş bir kategoridir.
Bir servis tipik olarak dar ve iyi tanımlanmış bir amaca sahip bir sınıftır.
Bir bileşen, DI kullanabilen sınıf türlerinden biridir.

Angular, modülerlik ve yeniden kullanılabilirliği artırmak için bileşenleri servislerden ayırır.
Bir bileşenin görünümle ilgili özelliklerini diğer işleme türlerinden ayırarak, bileşen sınıflarınızı yalın ve verimli hale getirebilirsiniz.

İdeal olarak, bir bileşenin görevi kullanıcı deneyimini etkinleştirmek ve başka hiçbir şey olmamalıdır.
Bir bileşen, görünüm (şablon tarafından render edilen) ile uygulama mantığı (genellikle bir model kavramı içeren) arasında aracılık etmek için veri bağlama için özellikler ve yöntemler sunmalıdır.

Bir bileşen, sunucudan veri getirme, kullanıcı girişini doğrulama veya doğrudan konsola günlükleme gibi belirli görevleri servislere devredebilir.
Bu tür işleme görevlerini enjekte edilebilir bir servis sınıfında tanımlayarak, bu görevleri herhangi bir bileşen için kullanılabilir hale getirirsiniz.
Farklı koşullarda uygun olduğu şekilde aynı tür servisin farklı sağlayıcılarını yapılandırarak uygulamanızı daha uyarlanabilir hale getirebilirsiniz.

Angular bu ilkeleri zorunlu kılmaz.
Angular, uygulama mantığınızı servislere ayırmanızı ve bu servisleri DI aracılığıyla bileşenlere sunmanızı kolaylaştırarak bu ilkeleri takip etmenize yardımcı olur.

## Service examples

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
    // Fetch
    this.heroes = await this.backend.getAll(Hero);
    // Log
    this.logger.log(`Fetched ${this.heroes.length} heroes.`);
    return this.heroes;
  }
}
```

## Creating an injectable service with the CLI

Angular CLI, yeni bir servis oluşturmak için bir komut sağlar. Aşağıdaki örnekte, mevcut bir uygulamaya yeni bir servis eklersiniz.

`src/app/heroes` klasöründe yeni bir `HeroService` sınıfı oluşturmak için şu adımları izleyin:

1. Şu [Angular CLI](/tools/cli) komutunu çalıştırın:

```sh
ng generate service heroes/hero
```

Bu komut aşağıdaki varsayılan `HeroService`'i oluşturur:

```ts {header: 'heroes/hero.service.ts (CLI-generated)'}
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HeroService {}
```

`@Injectable()` dekoratörü, Angular'ın bu sınıfı DI sisteminde kullanabileceğini belirtir.
Meta veri olan `providedIn: 'root'`, `HeroService`'in uygulama genelinde sağlandığı anlamına gelir.

`mock.heroes.ts` dosyasından kahramanları döndüren bir `getHeroes()` yöntemi ekleyerek kahraman sahte verilerini alın:

```ts {header: 'hero.service.ts'}
import {Injectable} from '@angular/core';
import {HEROES} from './mock-heroes';

@Injectable({
  // declares that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class HeroService {
  getHeroes() {
    return HEROES;
  }
}
```

Netlik ve bakım kolaylığı açısından, bileşenleri ve servisleri ayrı dosyalarda tanımlamanız önerilir.

## Injecting services

Bir servisi bir bileşene bağımlılık olarak enjekte etmek için, bağımlılığı temsil eden bir sınıf alanı bildirebilir ve bunu başlatmak için Angular'ın [`inject`](/api/core/inject) fonksiyonunu kullanabilirsiniz.

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

[`inject`](/api/core/inject) yöntemi hem sınıflarda hem de fonksiyonlarda kullanılabilirken, constructor yöntemi doğal olarak yalnızca bir sınıf constructor'ında kullanılabilir. Ancak her iki durumda da bir bağımlılık yalnızca geçerli bir [enjeksiyon bağlamında](guide/di/dependency-injection-context), genellikle bir bileşenin oluşturulması veya başlatılması sırasında enjekte edilebilir.

## Injecting services in other services

Bir servis başka bir servise bağımlı olduğunda, bir bileşene enjekte etmeyle aynı deseni izleyin.
Aşağıdaki örnekte, `HeroService` faaliyetlerini raporlamak için bir `Logger` servisine bağımlıdır:

```ts {header: 'hero.service.ts, highlight: [[3],[9],[12]]}
import {inject, Injectable} from '@angular/core';
import {HEROES} from './mock-heroes';
import {Logger} from '../logger.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private logger = inject(Logger);

  getHeroes() {
    this.logger.log('Getting heroes.');
    return HEROES;
  }
}
```

Bu örnekte, `getHeroes()` yöntemi kahramanları getirirken bir mesaj kaydederek `Logger` servisini kullanır.

## What's next

<docs-pill-row>
  <docs-pill href="guide/di/defining-dependency-providers" title="Configuring dependency providers"/>
  <docs-pill href="guide/di/defining-dependency-providers#automatic-provision-for-non-class-dependencies" title="`InjectionTokens`"/>
</docs-pill-row>
