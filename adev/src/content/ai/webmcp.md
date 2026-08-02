# WebMCP

Web Model Context Protocol (WebMCP), web uygulamalarının yapısal araçları doğrudan tarayıcıda yerel olarak çalışan yapay zeka ajanlarına sunmasına olanak tanıyan [yeni gelişen bir web standardıdır](https://github.com/webmachinelearning/webmcp/). Bir uygulama tarafından tanımlanan araçlar, yapay zeka asistanlarının uygulamayla doğrudan etkileşime geçmesini sağlar, ajana ek yetenekler kazandırır ve DOM etkileşimlerine olan ihtiyacı azaltır.

Örneğin, yeni bir kullanıcı kaydeden bir uygulama, tarayıcının yapay zeka ajanının kullanıcıyı DOM etkileşimleri aracılığıyla karmaşık bir sihirbaz arayüzünde gezinmek yerine doğrudan oluşturmasını sağlayan bir WebMCP aracı sağlayabilir.

Angular, WebMCP için deneysel destek sunar; bu sayede uygulamanızın bağımlılık enjeksiyonu yaşam döngüsüne bağlı araçları kolayca kaydedebilir ve Signal Form'larınızı otomatik olarak yapay zekaya hazır araçlara dönüştürebilirsiniz.

IMPORTANT: WebMCP spesifikasyonu yaşam döngüsünün çok erken bir aşamasındadır ve sık sık değişikliklere uğramaktadır. Bu nedenle, Angular'daki WebMCP desteği şu anda [**deneyseldir**](reference/releases#deneysel). API'ler ana sürümler dışında bile değişikliğe tabidir.

## Uygulama için araç sağlama

Uygulamanın tüm yaşam döngüsü boyunca araçları kaydetmek için uygulama yapılandırmanızda [`provideExperimentalWebMcpTools`](api/core/provideExperimentalWebMcpTools) kullanın. Bu şekilde sağlanan araçlar, uygulama başlatıldığında otomatik olarak kaydedilir ve uygulama yok edildiğinde kayıtları kaldırılır.

`execute` geri çağırması (callback), ilişkili `Injector`'ın enjeksiyon bağlamında çağrılır; bu da servisleri doğrudan [`inject`](api/core/inject) edebileceğiniz anlamına gelir.

```ts {header:"main.ts"}
import {Service, inject, provideExperimentalWebMcpTools} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppRoot} from './app-root';

@Service()
class Greeter {
  sayHello(): string {
    return 'Merhaba ajan!';
  }
}

bootstrapApplication(AppRoot, {
  providers: [
    provideExperimentalWebMcpTools([
      {
        name: 'greet',
        description: 'Greets the agent.',
        inputSchema: {type: 'object', properties: {}},
        execute: () => {
          const greeter = inject(Greeter);

          return {content: [{type: 'text', text: greeter.sayHello()}]};
        },
      },
    ]),
  ],
});
```

### Araç parametrelerini tanımlama

Bir araç yapay zeka asistanından girdi gerektirdiğinde, beklenen argümanları [JSON Schema](https://json-schema.org/) sözdizimini kullanarak `inputSchema` içinde tanımlayın. Angular, şema tanımına dayanarak `execute` geri çağırmanıza iletilen parametre tiplerini otomatik olarak çıkarır.

```ts {header:"main.ts"}
import {provideExperimentalWebMcpTools} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppRoot} from './app-root';

bootstrapApplication(AppRoot, {
  providers: [
    provideExperimentalWebMcpTools([
      {
        name: 'searchCatalog',
        description: 'Searches the store catalog for products matching a query.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search keywords.',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results to return.',
            },
          },
          required: ['query'],
          additionalProperties: false,
        },
        execute: ({query, maxResults}) => {
          // `query` tipi `string` olarak çıkarsanır.
          // `maxResults` tipi `number | undefined` olarak çıkarsanır.

          // Girdiler şemaya uyacak şekilde doğrulanmamış olabileceğinden, bunu çalışma zamanında doğrulamayı düşünün.
          if (typeof query !== 'string') throw new Error(`Bad query: ${query}`);
          if (typeof maxResults !== 'number' && maxResults !== undefined)
            throw new Error(`Bad maxResults: ${maxResults}`);

          const limit = maxResults ?? 5;
          return {
            content: [{type: 'text', text: `Returning up to ${limit} results for "${query}".`}],
          };
        },
      },
    ]),
  ],
});
```

TIP: Bu parametrelerin tiplerinden `undefined`'ı kaldırmak için `required: ['param1', 'param2', ...]` kullanın ve argüman nesnesinin tipini yalnızca bu parametrelerle sınırlamak için `additionalProperties: false` kullanın.

## Bir rota için araç sağlama

Karmaşık uygulamalar oluştururken, belirli araçların yalnızca kullanıcı belirli rotaları görüntülerken kullanılabilir olmasını isteyebilirsiniz. Bunu, araçları doğrudan rota tanımlarında sağlayarak başarabilirsiniz.

```ts {header:"routes.ts"}
import {provideExperimentalWebMcpTools} from '@angular/core';
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard').then((m) => m.Dashboard),
    providers: [
      provideExperimentalWebMcpTools([
        {
          name: 'exportDashboardReports',
          description: 'Exports the current dashboard analytics.',
          inputSchema: {type: 'object', properties: {}},
          execute: () => ({
            content: [{type: 'text', text: 'Dashboard export successfully triggered.'}],
          }),
        },
      ]),
    ],
  },
];
```

NOTE: Araçları belirli bir rotaya kaydederken, kullanıcı rotadan ayrıldığında araçların kayıtlarının otomatik olarak _kaldırılmasını_ sağlamak için router'ı [`withExperimentalAutoCleanupInjectors`](api/router/withExperimentalAutoCleanupInjectors) kullanacak şekilde yapılandırmayı düşünün. Bu seçenek olmadan, rotalarda tanımlanan WebMCP araçları, kullanıcı farklı bir rotaya gittikten sonra bile yapay zeka ajanları için erişilebilir kalır.

```ts {header:"app.config.ts"}
import {ApplicationConfig} from '@angular/core';
import {provideRouter, withExperimentalAutoCleanupInjectors} from '@angular/router';
import {routes} from './routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withExperimentalAutoCleanupInjectors())],
};
```

## Servisler içinde araç sağlama

Dinamik kullanım durumları için, [`declareExperimentalWebMcpTool`](api/core/declareExperimentalWebMcpTool) fonksiyonu bir aracı doğrudan bir enjeksiyon bağlamı içinde kaydeder ve o bağlam yok edildiğinde kaydını otomatik olarak kaldırır.

```ts {header:"counter.ts"}
import {Service, declareExperimentalWebMcpTool, signal, inject} from '@angular/core';

@Service()
export class Counter {
  readonly count = signal(0);

  constructor() {
    declareExperimentalWebMcpTool({
      name: 'getCounter',
      description: 'Reads the global counter.',
      inputSchema: {type: 'object', properties: {}},
      execute: () => ({
        content: [{type: 'text', text: `The count is: ${this.count()}.`}],
      }),
    });
  }
}
```

`declareExperimentalWebMcpTool` herhangi bir enjeksiyon bağlamında çalışsa da, [ad çakışmalarına](#ad-çakışmaları) dikkat edin ve onu kök servislerde kullanmayı tercih edin.

## Signal Form'larda örtük araçlar {#implicit-tools-in-signal-forms}

Mevcut bir Angular [Signal Form](essentials/signal-forms)'undan minimum yapılandırmayla örtük olarak bir WebMCP aracı oluşturabilirsiniz. Angular, form modellerinizi zengin WebMCP araçlarına dönüştürür; bu sayede JSON şemalarını veya olay işleyicilerini manuel olarak yazmanıza gerek kalmadan oldukça dinamik formları etkin biçimde destekler.

### WebMCP forms özelliğini etkinleştirme

Önce, kök uygulama sağlayıcılarınıza [`provideExperimentalWebMcpForms`](api/forms/signals/provideExperimentalWebMcpForms) ekleyin:

```ts {header:"main.ts"}
import {bootstrapApplication} from '@angular/platform-browser';
import {provideExperimentalWebMcpForms} from '@angular/forms/signals';
import {AppRoot} from './app-root';

bootstrapApplication(AppRoot, {
  providers: [provideExperimentalWebMcpForms()],
});
```

### Bir Signal Form'u dahil etme

İkinci olarak, [`form`](api/forms/signals/form) kullanarak bir Signal Form tanımlarken, örtük bir WebMCP aracını etkinleştirmek için `experimentalWebMcpTool` yapılandırma seçeneğini iletin. Angular, formunuzun veri modelini inceler ve bağlı yapay zeka ajanları için otomatik olarak bir JSON şeması üretir.

```ts {header:"user-registration.ts"}
import {Component, signal} from '@angular/core';
import {form, required, minLength} from '@angular/forms/signals';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.html',
})
export class UserRegistration {
  private readonly model = signal({
    firstName: '',
    lastName: '',
    age: 0,
    hobbies: ['Web Development'],
  });

  readonly userForm = form(
    this.model,
    (f) => {
      required(f.firstName, {message: 'First name is mandatory.'});
      required(f.lastName, {message: 'Last name is mandatory.'});
    },
    {
      // `model`'den türetilen parametrelerle `registerUser` adlı bir WebMCP aracını örtük olarak kaydeder.
      experimentalWebMcpTool: {
        name: 'registerUser',
        description: 'Registers a new user.',
      },
      submission: {
        action: async (formValue) => {
          console.log('Submitting user:', formValue);
          // ...
        },
      },
    },
  );
}
```

Bu örnekte Angular, aşağıdaki özelliklere sahip bir JSON şemasıyla bir WebMCP aracı üretir:

1. `model` signal'inin başlangıç değerinden çıkarsanan `firstName`, `lastName`, `age` ve `hobbies` parametrelerini içerir.
2. [`required`](api/forms/signals/required) doğrulayıcısından çıkarsandığı şekilde `firstName` ve `lastName`'i _zorunlu_ alanlar olarak tanımlar.
3. `hobbies`'i bir dizgi (string) dizisi olarak tanımlar; bu sayede ajan istediği sayıda hobi sağlayabilir.

Girdi şemasını çıkarsamanın ötesinde, Angular WebMCP aracını formun doğrulama mantığına ve gönderim işleyicisine de bağlar. Bu, ajanın kendi girdilerinin tetiklediği doğrulama hatalarını veya gönderim sırasında oluşan başarısızlıkları gözlemleyebileceği anlamına gelir; böylece kendini düzeltebilir ve olası yeniden denemeler yapabilir.

NOTE: Asenkron doğrulayıcılar tetiklenmez ve gönderim eylemi (submission action) tarafından ele alınmalıdır.

#### Kısıtlamalar

Angular, WebMCP şemasını form modelinizin başlangıç değerinden çıkarsar. Bu şunları gerektirir:

- Somut başlangıç değerleri (`''`, `0`, `false`): Angular, veri tiplerini `null` veya `undefined`'dan çıkaramaz.
- Boş olmayan diziler (`['Hello!']`): Angular, veri tiplerini boş bir diziden çıkaramaz ve en az bir başlangıç değeri gerektirir.

## En iyi uygulamalar

Aşağıdaki en iyi uygulamaları aklınızda bulundurun:

### Ad çakışmaları

WebMCP, her aracın benzersiz bir ada sahip olmasını gerektirir ve aynı araç adı birden fazla kez kaydedilirse hata fırlatır. Bu, `declareExperimentalWebMcpTool` veya `provideExperimentalWebMcpTools`'u birden fazla kez kaydedilebilecekleri bir bağlamda (örneğin bir bileşen yapıcısında) çağırmanın çalışma zamanında hatalara yol açabileceği anlamına gelir.

Mümkün olduğunda araçları uygulama sağlayıcılarına, rota sağlayıcılarına veya kök servislere yerleştirmeyi tercih edin. Araçları bir bileşene, [Signal Form'lardaki örtük araçlar](#implicit-tools-in-signal-forms) dahil, yerleştirirken, o bileşenin herhangi bir anda sayfada en fazla _bir_ kez render edildiğinden emin olun.

### Araç girdilerini doğrulayın

Angular, bir ajan tarafından sağlanan girdilerin gerçekten tanımlı JSON şemasıyla eşleştiğine dair örtük bir doğrulama sağlamaz. Güvenilirliği sağlamak için, kullanmadan önce `execute` fonksiyonuna gelen argümanları açıkça doğrulamayı düşünün.

### Test etme

Araçlarınızı etkili biçimde birim testine tabi tutmak için [`@mcp-b/webmcp-polyfill`](https://www.npmjs.com/package/@mcp-b/webmcp-polyfill) gibi bir sahte (mock) WebMCP implementasyonu kullanmayı düşünün.
