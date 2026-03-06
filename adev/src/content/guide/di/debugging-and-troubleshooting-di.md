# Bağımlılık enjeksiyonunda hata ayıklama ve sorun giderme

Bağımlılık enjeksiyonu (DI) sorunları genellikle yapılandırma hatalarından, kapsam sorunlarından veya yanlış kullanım desenlerinden kaynaklanır. Bu kılavuz, geliştiricilerin karşılaştığı yaygın DI sorunlarını tanımlamanıza ve çözmenize yardımcı olur.

## Yaygın tuzaklar ve çözümler

### Servislerin beklendiği yerde kullanılamaması

En yaygın DI sorunlarından biri, bir servisi enjekte etmeye çalıştığınızda Angular'ın bunu mevcut enjektörde veya herhangi bir üst enjektörde bulamamasıdır. Bu genellikle servisin yanlış kapsamda sağlanması veya hiç sağlanmaması durumunda gerçekleşir.

#### Provider kapsam uyumsuzluğu

Bir servisi bir bileşenin `providers` dizisinde sağladığınızda, Angular o bileşenin enjektöründe bir örnek oluşturur. Bu örnek yalnızca o bileşen ve çocukları tarafından kullanılabilir. Üst bileşenler ve kardeş bileşenler, farklı enjektörler kullandıkları için ona erişemezler.

```angular-ts {header: 'child-view.ts'}
import {Component} from '@angular/core';
import {DataStore} from './data-store';

@Component({
  selector: 'app-child',
  template: '<p>Child</p>',
  providers: [DataStore], // Yalnızca bu bileşen ve çocuklarında kullanılabilir
})
export class ChildView {}
```

```angular-ts {header: 'parent-view.ts'}
import {Component, inject} from '@angular/core';
import {DataStore} from './data-store';

@Component({
  selector: 'app-parent',
  template: '<app-child />',
})
export class ParentView {
  private dataService = inject(DataStore); // HATA: Üst bileşen için kullanılamaz
}
```

Angular yalnızca hiyerarşide yukarı doğru arama yapar, asla aşağı doğru değil. Üst bileşenler, alt bileşenlerde sağlanan servislere erişemezler.

**Çözüm:** Servisi daha üst bir seviyede (uygulama veya üst bileşen) sağlayın.

```ts {prefer}
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class DataStore {
  // Her yerde kullanılabilir
}
```

TIP: Bileşene özgü duruma ihtiyaç duymayan servisler için varsayılan olarak `providedIn: 'root'` kullanın. Bu, servisleri her yerde kullanılabilir hale getirir ve tree-shaking'i etkinleştirir.

#### Servisler ve tembel yüklenen rotalar

Bir servisi tembel yüklenen bir rotanın `providers` dizisinde sağladığınızda, Angular o rota için bir alt enjektör oluşturur. Bu enjektör ve servisleri yalnızca rota yüklendikten sonra kullanılabilir hale gelir. Uygulamanızın istekli yüklenen bölümlerindeki bileşenler, tembel yüklenen enjektör oluşturulmadan önce var olan farklı enjektörler kullandıkları için bu servislere erişemezler.

```ts {header: 'feature.routes.ts'}
import {Routes} from '@angular/router';
import {FeatureClient} from './feature-client';

export const featureRoutes: Routes = [
  {
    path: 'feature',
    providers: [FeatureClient],
    loadComponent: () => import('./feature-view'),
  },
];
```

```angular-ts {header: 'eager-view.ts'}
import {Component, inject} from '@angular/core';
import {FeatureClient} from './feature-client';

@Component({
  selector: 'app-eager',
  template: '<p>Eager Component</p>',
})
export class EagerView {
  private featureService = inject(FeatureClient); // HATA: Henüz kullanılamaz
}
```

Tembel yüklenen rotalar, yalnızca rota yüklendikten sonra kullanılabilen alt enjektörler oluşturur.

NOTE: Varsayılan olarak, rota enjektörleri ve servisleri rotadan ayrıldıktan sonra bile devam eder. Uygulama kapatılana kadar yok edilmezler. Kullanılmayan rota enjektörlerinin otomatik temizlenmesi için [rota davranışını özelleştirme](guide/routing/customizing-route-behavior#deneysel-kullanılmayan-rota-enjektörlerinin-otomatik-temizlenmesi) bölümüne bakın.

**Çözüm:** Tembel sınırlar arasında paylaşılması gereken servisler için `providedIn: 'root'` kullanın.

```ts {prefer, header: 'Provide at root for shared services'}
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class FeatureClient {
  // Her yerde kullanılabilir, tembel yüklemeden önce dahil
}
```

Servisin tembel yüklenmesi gerekiyorsa ancak istekli bileşenler tarafından da kullanılabilir olması gerekiyorsa, yalnızca gerekli yerlerde enjekte edin ve kullanılabilirliği ele almak için isteğe bağlı enjeksiyon kullanın.

### Tekil örnekler yerine birden fazla örnek

Tek bir paylaşılan örnek (singleton) bekliyorsunuz ancak farklı bileşenlerde ayrı örnekler alıyorsunuz.

#### Root yerine bileşende sağlama

Bir servisi bir bileşenin `providers` dizisine eklediğinizde, Angular o servisin her bileşen örneği için yeni bir örneğini oluşturur. Her bileşen kendi ayrı servis örneğini alır, bu da bir bileşendeki değişikliklerin diğer bileşenlerdeki servis örneğini etkilemeyeceği anlamına gelir. Bu, uygulamanız genelinde paylaşılan durum istediğinizde genellikle beklenmedik bir durumdur.

```angular-ts {avoid, header: 'Component-level provider creates multiple instances'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>Profile</p>',
  providers: [UserClient], // Her bileşen için yeni örnek oluşturur!
})
export class UserProfile {
  private userService = inject(UserClient);
}

@Component({
  selector: 'app-settings',
  template: '<p>Settings</p>',
  providers: [UserClient], // Farklı örnek!
})
export class UserSettings {
  private userService = inject(UserClient);
}
```

Her bileşen kendi `UserClient` örneğini alır. Bir bileşendeki değişiklikler diğerini etkilemez.

**Çözüm:** Tekil örnekler için `providedIn: 'root'` kullanın.

```ts {prefer, header: 'Root-level singleton'}
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class UserClient {
  // Tüm bileşenler arasında paylaşılan tek örnek
}
```

#### Birden fazla örneğin kasıtlı olduğu durumlar

Bazen bileşene özgü durum için bileşen başına ayrı örnekler isteyebilirsiniz.

```angular-ts {header: 'Intentional: Component-scoped state'}
import {Injectable, signal} from '@angular/core';

@Injectable() // providedIn yok - açıkça sağlanmalıdır
export class FormStateStore {
  private formData = signal({});

  setData(data: any) {
    this.formData.set(data);
  }

  getData() {
    return this.formData();
  }
}

@Component({
  selector: 'app-user-form',
  template: '<form>...</form>',
  providers: [FormStateStore], // Her form kendi durumunu alır
})
export class UserForm {
  private formState = inject(FormStateStore);
}
```

Bu desen şunlar için kullanışlıdır:

- Form durum yönetimi (her formun izole durumu vardır)
- Bileşene özgü önbellekleme
- Paylaşılmaması gereken geçici veriler

### Yanlış inject() kullanımı

`inject()` fonksiyonu yalnızca sınıf oluşturma ve fabrika yürütme sırasındaki belirli bağlamlarda çalışır.

#### Yaşam döngüsü kancalarında inject() kullanımı

`inject()` fonksiyonunu `ngOnInit()`, `ngAfterViewInit()` veya `ngOnDestroy()` gibi yaşam döngüsü kancaları içinde çağırdığınızda, Angular bir hata fırlatır çünkü bu yöntemler enjeksiyon bağlamı dışında çalışır. Enjeksiyon bağlamı yalnızca yaşam döngüsü kancaları çağrılmadan önce gerçekleşen sınıf oluşturmanın senkron yürütülmesi sırasında kullanılabilir.

```angular-ts {avoid, header: 'inject() in ngOnInit'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{userName}}</p>',
})
export class UserProfile {
  userName = '';

  ngOnInit() {
    const userService = inject(UserClient); // HATA: Enjeksiyon bağlamı değil
    this.userName = userService.getUser().name;
  }
}
```

**Çözüm:** Bağımlılıkları yakalayın ve değerleri alan başlatıcılarında türetin.

```angular-ts {prefer, header: 'Derive values in field initializers'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{userName}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient);
  userName = this.userService.getUser().name;
}
```

#### Ertelenmiş enjeksiyon için Injector kullanımı

Bir enjeksiyon bağlamı dışında servisleri almanız gerektiğinde, yakalanan `Injector`'ı doğrudan `injector.get()` ile kullanın:

```angular-ts
import {Component, inject, Injector} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<button (click)="delayedLoad()">Load Later</button>',
})
export class UserProfile {
  private injector = inject(Injector);

  delayedLoad() {
    setTimeout(() => {
      const userService = this.injector.get(UserClient);
      console.log(userService.getUser());
    }, 1000);
  }
}
```

#### Geri çağırmalar için runInInjectionContext kullanımı

**Diğer kodun** `inject()` çağırmasını etkinleştirmek gerektiğinde `runInInjectionContext()` kullanın. Bu, bağımlılık enjeksiyonu kullanabilecek geri çağırmaları kabul ederken yararlıdır:

```angular-ts
import {Component, inject, Injector, input} from '@angular/core';

@Component({
  selector: 'app-data-loader',
  template: '<button (click)="load()">Load</button>',
})
export class DataLoader {
  private injector = inject(Injector);
  onLoad = input<() => void>();

  load() {
    const callback = this.onLoad();
    if (callback) {
      // Geri çağırmanın inject() kullanmasını etkinleştir
      this.injector.runInInjectionContext(callback);
    }
  }
}
```

`runInInjectionContext()` yöntemi geçici bir enjeksiyon bağlamı oluşturur ve geri çağırma içindeki kodun `inject()` çağırmasına olanak tanır.

IMPORTANT: Mümkün olduğunda bağımlılıkları her zaman sınıf seviyesinde yakalayın. Basit gecikmeli alma için `injector.get()` kullanın ve yalnızca harici kodun `inject()` çağırması gerektiğinde `runInInjectionContext()` kullanın.

TIP: Kodunuzun geçerli bir enjeksiyon bağlamında çalışıp çalışmadığını doğrulamak için `assertInInjectionContext()` kullanın. Bu, `inject()` çağıran yeniden kullanılabilir fonksiyonlar oluştururken yararlıdır. Ayrıntılar için [Bağlamı doğrulama](guide/di/dependency-injection-context#bağlamı-doğrulama) bölümüne bakın.

### providers ve viewProviders karışıklığı

`providers` ve `viewProviders` arasındaki fark, içerik yansıtma senaryolarını etkiler.

#### Farkı anlamak

**providers:** Bileşenin şablonuna VE bileşene yansıtılan herhangi bir içeriğe (ng-content) kullanılabilir.

**viewProviders:** Yalnızca bileşenin şablonuna kullanılabilir, yansıtılan içeriğe DEĞİL.

```angular-ts {header: 'parent-view.ts'}
import {Component, inject} from '@angular/core';
import {ThemeStore} from './theme-store';

@Component({
  selector: 'app-parent',
  template: `
    <div>
      <p>Theme: {{ themeService.theme() }}</p>
      <ng-content />
    </div>
  `,
  providers: [ThemeStore], // İçerik çocukları için kullanılabilir
})
export class ParentView {
  protected themeService = inject(ThemeStore);
}

@Component({
  selector: 'app-parent-view',
  template: `
    <div>
      <p>Theme: {{ themeService.theme() }}</p>
      <ng-content />
    </div>
  `,
  viewProviders: [ThemeStore], // İçerik çocukları için kullanılamaz
})
export class ParentViewOnly {
  protected themeService = inject(ThemeStore);
}
```

```angular-ts {header: 'child-view.ts'}
import {Component, inject} from '@angular/core';
import {ThemeStore} from './theme-store';

@Component({
  selector: 'app-child',
  template: '<p>Child theme: {{theme()}}</p>',
})
export class ChildView {
  private themeService = inject(ThemeStore, {optional: true});
  theme = () => this.themeService?.theme() ?? 'none';
}
```

```angular-ts {header: 'app.ts'}
@Component({
  selector: 'app-root',
  template: `
    <app-parent>
      <app-child />
      <!-- ThemeStore'a erişebilir -->
    </app-parent>

    <app-parent-view>
      <app-child />
      <!-- ThemeStore'a erişemez -->
    </app-parent-view>
  `,
})
export class App {}
```

**`app-parent`'a yansıtıldığında:** Alt bileşen `ThemeStore`'u enjekte edebilir çünkü `providers` yansıtılan içerik için kullanılabilir hale getirir.

**`app-parent-view`'a yansıtıldığında:** Alt bileşen `ThemeStore`'u enjekte edemez çünkü `viewProviders` bunu yalnızca üst elemanın şablonuyla sınırlar.

#### providers ve viewProviders arasında seçim yapma

Şu durumlarda `providers` kullanın:

- Servisin yansıtılan içerik için kullanılabilir olması gerektiğinde
- İçerik çocuklarının servise erişmesini istediğinizde
- Genel amaçlı servisler sağladığınızda

Şu durumlarda `viewProviders` kullanın:

- Servisin yalnızca bileşeninizin şablonuna kullanılabilir olması gerektiğinde
- Uygulama detaylarını yansıtılan içerikten gizlemek istediğinizde
- Dışarı sızmaması gereken dahili servisler sağladığınızda

**Varsayılan öneri:** `viewProviders` ile erişimi kısıtlamak için belirli bir nedeniniz olmadıkça `providers` kullanın.

### InjectionToken sorunları

Sınıf dışı bağımlılıklar için `InjectionToken` kullanılırken, geliştiriciler genellikle token kimliği, tür güvenliği ve sağlayıcı yapılandırmasıyla ilgili sorunlarla karşılaşır. Bu sorunlar genellikle JavaScript'in nesne kimliğini nasıl ele aldığından ve TypeScript'in türleri nasıl çıkardığından kaynaklanır.

#### Token kimliği karışıklığı

Yeni bir `InjectionToken` örneği oluşturduğunuzda, JavaScript bellekte benzersiz bir nesne oluşturur. Aynı açıklama string'i ile başka bir `InjectionToken` oluştursanız bile, tamamen farklı bir nesnedir. Angular, sağlayıcıları enjeksiyon noktalarıyla eşleştirmek için token nesnesinin kimliğini (açıklamasını değil) kullanır, bu nedenle aynı açıklamaya ancak farklı nesne kimliklerine sahip token'lar birbirlerinin değerlerine erişemez.

```ts {header: 'config.token.ts'}
import {InjectionToken} from '@angular/core';

export interface AppConfig {
  apiUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app config');
```

```ts {header: 'app.config.ts'}
import {APP_CONFIG} from './config.token';

export const appConfig: AppConfig = {
  apiUrl: 'https://api.example.com',
};

bootstrapApplication(App, {
  providers: [{provide: APP_CONFIG, useValue: appConfig}],
});
```

```angular-ts {avoid, header: 'feature-view.ts'}
// Aynı açıklamayla yeni token oluşturma
import {InjectionToken, inject} from '@angular/core';
import {AppConfig} from './config.token';

const APP_CONFIG = new InjectionToken<AppConfig>('app config');

@Component({
  selector: 'app-feature',
  template: '<p>Feature</p>',
})
export class FeatureView {
  private config = inject(APP_CONFIG); // HATA: Farklı token örneği!
}
```

Her iki token da `'app config'` açıklamasına sahip olsa da, farklı nesnelerdir. Angular token'ları açıklamaya göre değil referansa göre karşılaştırır.

**Çözüm:** Aynı token örneğini içe aktarın.

```angular-ts {prefer, header: 'feature-view.ts'}
import {inject} from '@angular/core';
import {APP_CONFIG, AppConfig} from './config.token';

@Component({
  selector: 'app-feature',
  template: '<p>API: {{config.apiUrl}}</p>',
})
export class FeatureView {
  protected config = inject(APP_CONFIG); // Çalışır: Aynı token örneği
}
```

TIP: Token'ları her zaman paylaşılan bir dosyadan dışa aktarın ve ihtiyaç duyulan her yerde içe aktarın. Aynı açıklamaya sahip birden fazla `InjectionToken` örneği asla oluşturmayın.

#### Arayüzleri enjekte etmeye çalışma

Bir TypeScript arayüzü tanımladığınızda, yalnızca derleme sırasında tür denetimi için var olur. TypeScript, JavaScript'e derlerken tüm arayüz tanımlarını siler, bu nedenle çalışma zamanında Angular'ın enjeksiyon token'ı olarak kullanabileceği bir nesne yoktur. Bir arayüz türünü enjekte etmeye çalışırsanız, Angular'ın sağlayıcı yapılandırmasıyla eşleştireceği hiçbir şey yoktur.

```angular-ts {avoid, header: 'Can't inject interface'}
interface UserConfig {
  name: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  template: '<p>Profile</p>',
})
export class UserProfile {
  // HATA: Arayüzler çalışma zamanında mevcut değildir
  constructor(private config: UserConfig) {}
}
```

**Çözüm:** Arayüz türleri için `InjectionToken` kullanın.

```angular-ts {prefer, header: 'Use InjectionToken for interfaces'}
import {InjectionToken, inject} from '@angular/core';

interface UserConfig {
  name: string;
  email: string;
}

export const USER_CONFIG = new InjectionToken<UserConfig>('user configuration');

// Yapılandırmayı sağla
bootstrapApplication(App, {
  providers: [
    {
      provide: USER_CONFIG,
      useValue: {name: 'Alice', email: 'alice@example.com'},
    },
  ],
});

// Token kullanarak enjekte et
@Component({
  selector: 'app-profile',
  template: '<p>User: {{config.name}}</p>',
})
export class UserProfile {
  protected config = inject(USER_CONFIG);
}
```

`InjectionToken` çalışma zamanında var olur ve enjeksiyon için kullanılabilirken, `UserConfig` arayüzü geliştirme sırasında tür güvenliği sağlar.

### Döngüsel bağımlılıklar

Döngüsel bağımlılıklar, servisler birbirini enjekte ettiğinde ve Angular'ın çözemediği bir döngü oluşturduğunda meydana gelir. Ayrıntılı açıklamalar ve kod örnekleri için [NG0200: Döngüsel bağımlılık](errors/NG0200) bölümüne bakın.

**Çözüm stratejileri** (tercih sırasına göre):

1. **Yeniden yapılandırma** - Paylaşılan mantığı döngüyü kıran üçüncü bir servise çıkarın
2. **Olay kullanma** - Doğrudan bağımlılıkları olay tabanlı iletişimle (örneğin `Subject`) değiştirin
3. **Tembel enjeksiyon** - Bir bağımlılığı ertelemek için `Injector.get()` kullanın (son çare)

NOTE: Servis döngüsel bağımlılıkları için `forwardRef()` kullanmayın -- yalnızca standalone bileşen yapılandırmalarındaki döngüsel içe aktarmaları çözer.

## Bağımlılık çözümleme hatalarını ayıklama

### Çözümleme sürecini anlamak

Angular, enjektör hiyerarşisinde yukarı doğru yürüyerek bağımlılıkları çözer. Bir `NullInjectorError` oluştuğunda, bu arama sırasını anlamak eksik sağlayıcıyı nereye ekleyeceğinizi belirlemenize yardımcı olur.

Angular şu sırayla arama yapar:

1. **Eleman enjektörü** - Mevcut bileşen veya direktif
2. **Üst eleman enjektörleri** - DOM ağacında üst bileşenler yoluyla yukarı
3. **Ortam enjektörü** - Rota veya uygulama enjektörü
4. **NullInjector** - Bulunamazsa `NullInjectorError` fırlatır

Bir `NullInjectorError` gördüğünüzde, servis bileşenin erişebildiği hiçbir seviyede sağlanmamıştır. Şunları kontrol edin:

- Servisin `@Injectable({providedIn: 'root'})` olduğunu veya
- Servisin bileşenin ulaşabileceği bir `providers` dizisinde olduğunu

Bu arama davranışını `self`, `skipSelf`, `host` ve `optional` gibi çözümleme değiştiricileri ile değiştirebilirsiniz. Çözümleme kuralları ve değiştiricilerin tam kapsamı için [Hiyerarşik enjektörler kılavuzuna](guide/di/hierarchical-dependency-injection) bakın.

### Angular DevTools kullanımı

Angular DevTools, tüm enjektör hiyerarşisini görselleştiren ve her seviyede hangi sağlayıcıların kullanılabilir olduğunu gösteren bir enjektör ağacı denetçisi içerir. Kurulum ve genel kullanım için [Angular DevTools enjektör belgelerine](tools/devtools/injectors) bakın.

DI sorunlarını hata ayıklarken, bu soruları yanıtlamak için DevTools'u kullanın:

- **Servis sağlanıyor mu?** Enjeksiyon başarısız olan bileşeni seçin ve servisin Enjektör bölümünde görünüp görünmediğini kontrol edin.
- **Hangi seviyede?** Servisin gerçekten nerede sağlandığını (bileşen, rota veya uygulama seviyesi) bulmak için bileşen ağacında yukarı doğru ilerleyin.
- **Birden fazla örnek mi?** Bir tekil servis birden fazla bileşen enjektöründe görünüyorsa, muhtemelen `providedIn: 'root'` kullanmak yerine bileşen `providers` dizilerinde sağlanmıştır.

Bir servis hiçbir enjektörde görünmüyorsa, `providedIn: 'root'` ile `@Injectable()` dekoratörüne sahip olduğunu veya bir `providers` dizisinde listelendiğini doğrulayın.

### Enjeksiyonu günlükleme ve izleme

DevTools yeterli olmadığında, enjeksiyon davranışını izlemek için günlükleme kullanın.

#### Servis oluşturmayı günlükleme

Servislerin ne zaman oluşturulduğunu görmek için servis constructor'larına konsol günlükleri ekleyin.

```ts
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class UserClient {
  constructor() {
    console.log('UserClient oluşturuldu');
    console.trace(); // Çağrı yığınını gösterir
  }

  getUser() {
    return {name: 'Alice'};
  }
}
```

Servis oluşturulduğunda, günlük mesajını ve enjeksiyonun nerede gerçekleştiğini gösteren bir yığın izlemesini göreceksiniz.

**Nelere bakmalı:**

- Constructor kaç kez çağrılıyor? (tekil örnekler için bir kez olmalı)
- Kodda nerede enjekte ediliyor? (yığın izlemesini kontrol edin)
- Beklenen zamanda mı oluşturuluyor? (uygulama başlangıcı vs tembel)

#### Servis kullanılabilirliğini kontrol etme

Bir servisin kullanılabilir olup olmadığını belirlemek için günlükleme ile isteğe bağlı enjeksiyon kullanın.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Debug Component</p>',
})
export class DebugView {
  private userService = inject(UserClient, {optional: true});

  constructor() {
    if (this.userService) {
      console.log('UserClient kullanılabilir:', this.userService);
    } else {
      console.warn('UserClient kullanılamıyor');
      console.trace(); // Enjekte etmeye çalıştığımız yeri gösterir
    }
  }
}
```

Bu desen, uygulamayı çökertmeden bir servisin kullanılabilir olup olmadığını doğrulamanıza yardımcı olur.

#### Logging resolution modifiers

Günlükleme ile farklı çözümleme stratejilerini test edin.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Debug Component</p>',
  providers: [UserClient],
})
export class DebugView {
  // Try to get local instance
  private localService = inject(UserClient, {self: true, optional: true});

  // Try to get parent instance
  private parentService = inject(UserClient, {
    skipSelf: true,
    optional: true,
  });

  constructor() {
    console.log('Local instance:', this.localService);
    console.log('Parent instance:', this.parentService);
    console.log('Same instance?', this.localService === this.parentService);
  }
}
```

Bu, farklı enjektör seviyelerinde hangi örneklerin kullanılabilir olduğunu gösterir.

### Debugging workflow

DI başarısız olduğunda, şu sistematik yaklaşımı izleyin:

**Adım 1: Hata mesajını okuyun**

- Hata kodunu tanımlayın (NG0200, NG0203, vb.)
- Bağımlılık yolunu okuyun
- Hangi token'ın başarısız olduğunu not edin

**Adım 2: Temelleri kontrol edin**

- Servisin `@Injectable()` dekoratörü var mı?
- `providedIn` doğru ayarlanmış mı?
- İçe aktarmalar doğru mu?
- Dosya derlemeye dahil mi?

**Adım 3: Enjeksiyon bağlamını doğrulayın**

- `inject()` geçerli bir bağlamda mı çağrılıyor?
- Asenkron sorunları kontrol edin (await, setTimeout, promises)
- Zamanlamayı doğrulayın (yok edilmeden sonra değil)

**Adım 4: Hata ayıklama araçlarını kullanın**

- Angular DevTools'u açın
- Enjektör hiyerarşisini kontrol edin
- Constructor'lara konsol günlükleri ekleyin
- Kullanılabilirliği test etmek için isteğe bağlı enjeksiyon kullanın

**Adım 5: Sadeleştirin ve izole edin**

- Bağımlılıkları birer birer kaldırın
- Minimal bir bileşende test edin
- Her enjektör seviyesini ayrı ayrı kontrol edin
- Bir yeniden üretim durumu oluşturun

## DI error reference

Bu bölüm, karşılaşabileceğiniz belirli Angular DI hata kodları hakkında ayrıntılı bilgi sağlar. Konsolunuzda bu hataları gördüğünüzde bunu referans olarak kullanın.

### NullInjectorError: No provider for [Service]

**Hata kodu:** Yok (`NullInjectorError` olarak görüntülenir)

Bu hata, Angular enjektör hiyerarşisinde bir token için sağlayıcı bulamadığında oluşur. Hata mesajı, enjeksiyonun nerede denendiğini gösteren bir bağımlılık yolu içerir.

```
NullInjectorError: No provider for UserClient!
  Dependency path: App -> AuthClient -> UserClient
```

Bağımlılık yolu, `App`'ın `AuthClient`'ı enjekte ettiğini, onun da `UserClient`'ı enjekte etmeye çalıştığını ancak hiçbir sağlayıcı bulunamadığını gösterir.

#### Missing @Injectable decorator

En yaygın neden, bir servis sınıfında `@Injectable()` dekoratörünü unutmaktır.

```ts {avoid, header: 'Missing decorator'}
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

Angular, bağımlılık enjeksiyonu için gereken meta verileri oluşturmak üzere `@Injectable()` dekoratörünü gerektirir.

```ts {prefer, header: 'Include @Injectable'}
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

NOTE: Sıfır argümanlı constructor'lara sahip sınıflar `@Injectable()` olmadan çalışabilir, ancak bu önerilmez. Tutarlılık sağlamak ve daha sonra bağımlılık eklerken sorunları önlemek için her zaman dekoratörü dahil edin.

#### Missing providedIn configuration

Bir servisin `@Injectable()` dekoratörü olabilir ancak nerede sağlanacağını belirtmeyebilir.

```ts {avoid, header: 'No providedIn specified'}
import {Injectable} from '@angular/core';

@Injectable()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

Servisi uygulamanız genelinde kullanılabilir hale getirmek için `providedIn: 'root'` belirtin.

```ts {prefer, header: 'Specify providedIn'}
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

`providedIn: 'root'` yapılandırması, servisi uygulama genelinde kullanılabilir hale getirir ve tree-shaking'i etkinleştirir (servis hiç enjekte edilmezse paketten kaldırılır).

#### Standalone component missing imports

Standalone bileşenlerle Angular v20+'da, her bileşende bağımlılıkları açıkça içe aktarmanız veya sağlamanız gerekir.

```angular-ts {avoid, header: 'Missing service import'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{user().name}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient); // ERROR: No provider
  user = this.userService.getUser();
}
```

Servisin `providedIn: 'root'` kullandığından emin olun veya bileşenin `providers` dizisine ekleyin.

```angular-ts {prefer, header: 'Service uses providedIn: root'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{user().name}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient); // Works: providedIn: 'root'
  user = this.userService.getUser();
}
```

#### Debugging with the dependency path

Hata mesajındaki bağımlılık yolu, hataya yol açan enjeksiyon zincirini gösterir.

```
NullInjectorError: No provider for LoggerStore!
  Dependency path: App -> DataStore -> ApiClient -> LoggerStore
```

Bu yol size şunu söyler:

1. `App`, `DataStore`'u enjekte etti
2. `DataStore`, `ApiClient`'ı enjekte etti
3. `ApiClient`, `LoggerStore`'u enjekte etmeye çalıştı
4. `LoggerStore` için sağlayıcı bulunamadı

Araştırmanıza zincirin sonundan (`LoggerStore`) başlayın ve uygun yapılandırmaya sahip olduğunu doğrulayın.

#### Checking provider availability with optional injection

Hata fırlatmadan bir sağlayıcının var olup olmadığını kontrol etmek için isteğe bağlı enjeksiyon kullanın.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Service available: {{serviceAvailable}}</p>',
})
export class DebugView {
  private userService = inject(UserClient, {optional: true});
  serviceAvailable = this.userService !== null;
}
```

İsteğe bağlı enjeksiyon, sağlayıcı bulunamazsa `null` döndürür ve yokluğu zarifçe ele almanıza olanak tanır.

### NG0203: inject() must be called from an injection context

**Hata kodu:** NG0203

Bu hata, `inject()` fonksiyonunu geçerli bir enjeksiyon bağlamı dışında çağırdığınızda oluşur. Angular, `inject()` fonksiyonunun sınıf oluşturma veya fabrika yürütme sırasında senkron olarak çağrılmasını gerektirir.

```
NG0203: inject() must be called from an injection context such as a
constructor, a factory function, a field initializer, or a function
used with `runInInjectionContext`.
```

#### Valid injection contexts

Angular şu konumlarda `inject()` kullanımına izin verir:

1. **Sınıf alan başlatıcıları**

   ```angular-ts
   import {Component, inject} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<p>User: {{user().name}}</p>',
   })
   export class UserProfile {
     private userService = inject(UserClient); // Valid
     user = this.userService.getUser();
   }
   ```

2. **Sınıf constructor'ı**

   ```angular-ts
   import {Component, inject} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<p>User: {{user().name}}</p>',
   })
   export class UserProfile {
     private userService: UserClient;

     constructor() {
       this.userService = inject(UserClient); // Valid
     }

     user = this.userService.getUser();
   }
   ```

3. **Sağlayıcı fabrika fonksiyonları**

   ```ts
   import {inject, InjectionToken} from '@angular/core';
   import {UserClient} from './user-client';

   export const GREETING = new InjectionToken<string>('greeting', {
     factory() {
       const userService = inject(UserClient); // Valid
       const user = userService.getUser();
       return `Hello, ${user.name}`;
     },
   });
   ```

4. **runInInjectionContext() içinde**

   ```angular-ts
   import {Component, inject, Injector} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<button (click)="loadUser()">Load User</button>',
   })
   export class UserProfile {
     private injector = inject(Injector);

     loadUser() {
       this.injector.runInInjectionContext(() => {
         const userService = inject(UserClient); // Valid
         console.log(userService.getUser());
       });
     }
   }
   ```

`inject()` fonksiyonunun çalıştığı diğer enjeksiyon bağlamları şunlardır:

- [provideAppInitializer](api/core/provideAppInitializer)
- [provideEnvironmentInitializer](api/core/provideEnvironmentInitializer)
- Fonksiyonel [rota korumaları](guide/routing/route-guards)
- Fonksiyonel [veri çözücüleri](guide/routing/data-resolvers)

#### When this error occurs

Bu hata şu durumlarda oluşur:

- Yaşam döngüsü kancalarında (`ngOnInit`, `ngAfterViewInit`, vb.) `inject()` çağırma
- Asenkron fonksiyonlarda `await` sonrasında `inject()` çağırma
- Geri çağırmalarda (`setTimeout`, `Promise.then()`, vb.) `inject()` çağırma
- Sınıf oluşturma aşaması dışında `inject()` çağırma

Ayrıntılı örnekler ve çözümler için "Yanlış inject() kullanımı" bölümüne bakın.

#### Solutions and workarounds

**Çözüm 1:** Bağımlılıkları alan başlatıcılarında yakalayın (en yaygın)

```ts
private userService = inject(UserClient) // Capture at class level
```

**Çözüm 2:** Geri çağırmalar için `runInInjectionContext()` kullanın

```ts
private injector = inject(Injector)

someCallback() {
  this.injector.runInInjectionContext(() => {
    const service = inject(MyClient)
  })
}
```

**Çözüm 3:** Enjekte etmek yerine bağımlılıkları parametre olarak iletin

```ts
// Instead of injecting inside a callback
setTimeout(() => {
  const service = inject(MyClient) // ERROR
}, 1000)

// Capture first, then use
private service = inject(MyClient)

setTimeout(() => {
  this.service.doSomething() // Use captured reference
}, 1000)
```

### NG0200: Circular dependency detected

**Hata kodu:** NG0200

Bu hata, iki veya daha fazla servis birbirine bağımlı olduğunda ve Angular'ın çözemediği döngüsel bir bağımlılık oluşturduğunda meydana gelir.

```
NG0200: Circular dependency in DI detected for AuthClient
  Dependency path: AuthClient -> UserClient -> AuthClient
```

Bağımlılık yolu döngüyü gösterir: `AuthClient`, `UserClient`'a bağımlıdır ve o da `AuthClient`'a geri bağımlıdır.

#### Understanding the error

Angular, constructor'larını çağırarak ve bağımlılıkları enjekte ederek servis örnekleri oluşturur. Servisler döngüsel olarak birbirine bağımlı olduğunda, Angular hangisini önce oluşturacağını belirleyemez.

#### Common causes

- Doğrudan döngüsel bağımlılık (Servis A -> Servis B -> Servis A)
- Dolaylı döngüsel bağımlılık (Servis A -> Servis B -> Servis C -> Servis A)
- Servis bağımlılıkları olan modül dosyalarındaki içe aktarma döngüleri

#### Resolution strategies

Ayrıntılı örnekler ve çözümler için "Döngüsel bağımlılıklar" bölümüne bakın:

1. **Yeniden yapılandırma** - Paylaşılan mantığı üçüncü bir servise çıkarın (önerilen)
2. **Olay kullanma** - Doğrudan bağımlılıkları olay tabanlı iletişimle değiştirin
3. **Tembel enjeksiyon** - Bir bağımlılığı ertelemek için `Injector.get()` kullanın (son çare)

Servis döngüsel bağımlılıkları için `forwardRef()` KULLANMAYIN. Yalnızca bileşen yapılandırmalarındaki döngüsel içe aktarmaları çözer.

### Other DI error codes

Bu hatalar için ayrıntılı açıklamalar ve çözümler için [Angular hata referansına](errors) bakın:

| Error Code              | Description                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| [NG0204](errors/NG0204) | Tüm parametreler çözümlenemiyor - eksik `@Injectable()` dekoratörü                              |
| [NG0205](errors/NG0205) | Enjektör zaten yok edildi - bileşen yok edildikten sonra servislere erişim                      |
| [NG0207](errors/NG0207) | Yanlış bağlamda EnvironmentProviders - bileşen sağlayıcılarında `provideHttpClient()` kullanımı |

## Next steps

DI hatalarıyla karşılaştığınızda şunları unutmayın:

1. Hata mesajını ve bağımlılık yolunu dikkatlice okuyun
2. Temel yapılandırmayı doğrulayın (dekoratörler, `providedIn`, içe aktarmalar)
3. Enjeksiyon bağlamını ve zamanlamayı kontrol edin
4. Araştırmak için DevTools ve günlükleme kullanın
5. Sorunu sadeleştirin ve izole edin

Bağımlılık enjeksiyonuna ilişkin belirli konuların daha derin bir anlayışı için şunlara bakın:

- [Bağımlılık enjeksiyonunu anlama](guide/di) - Temel DI kavramları ve desenleri
- [Hiyerarşik bağımlılık enjeksiyonu](guide/di/hierarchical-dependency-injection) - Enjektör hiyerarşisi nasıl çalışır
- [Bağımlılık enjeksiyonu ile test etme](guide/testing) - TestBed kullanma ve bağımlılıkları taklit etme
