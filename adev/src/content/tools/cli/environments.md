# Configuring application environments

Projeniz için `development` ve `staging` gibi farklı varsayılan değerlere sahip, farklı adlandırılmış derleme yapılandırmaları tanımlayabilirsiniz.

Her adlandırılmış yapılandırma, `build`, `serve` ve `test` gibi çeşitli builder hedeflerine uygulanan seçenekler için varsayılan değerlere sahip olabilir.
[Angular CLI](tools/cli) `build`, `serve` ve `test` komutları, hedeflenen ortamınız için dosyaları uygun sürümlerle değiştirebilir.

## Angular CLI configurations

Angular CLI builder'ları, komut satırında sağlanan yapılandırmaya göre bir builder'ın belirli seçeneklerinin üzerine yazmaya olanak tanıyan bir `configurations` nesnesini destekler.

```json

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            // By default, disable source map generation.
            "sourceMap": false
          },
          "configurations": {
            // For the `debug` configuration, enable source maps.
            "debug": {
              "sourceMap": true
            }
          }
        },
        …
      }
    }
  }
}

```

`--configuration` seçeneği ile hangi yapılandırmayı kullanacağınızı seçebilirsiniz.

```shell

ng build --configuration debug

```

Yapılandırmalar herhangi bir Angular CLI builder'ına uygulanabilir. Virgülle ayırarak birden fazla yapılandırma belirtilebilir. Yapılandırmalar sırayla uygulanır ve çakışan seçenekler son yapılandırmanın değerini kullanır.

```shell

ng build --configuration debug,production,customer-facing

```

## Configure environment-specific defaults

`@angular-devkit/build-angular:browser`, bir derleme çalıştırılmadan önce kaynak dosyaların değiştirilmesi için bir seçenek olan dosya değiştirmelerini destekler.
Bunu `--configuration` ile birlikte kullanmak, uygulamanızda ortama özgü verileri yapılandırmak için bir mekanizma sağlar.

`src/environments/` dizinini oluşturmak ve projeyi dosya değiştirmelerini kullanacak şekilde yapılandırmak için [ortam oluşturma](cli/generate/environments) komutunu çalıştırarak başlayın.

```shell

ng generate environments

```

Projenin `src/environments/` dizini, üretim için varsayılan yapılandırmayı sağlayan temel yapılandırma dosyası `environment.ts`'yi içerir.
`development` ve `staging` gibi ek ortamlar için hedefe özgü yapılandırma dosyalarında varsayılan değerleri geçersiz kılabilirsiniz.

Örneğin:

```text

my-app/src/environments
├── environment.development.ts
├── environment.staging.ts
└── environment.ts

```

Temel dosya `environment.ts`, varsayılan ortam ayarlarını içerir.
Örneğin:

```ts
export const environment = {
  production: true,
};
```

`build` komutu, hiçbir ortam belirtilmediğinde bunu derleme hedefi olarak kullanır.
Ortam nesnesinde ek özellikler olarak veya ayrı nesneler olarak daha fazla değişken ekleyebilirsiniz.
Örneğin, aşağıdaki varsayılan ortama bir değişken için varsayılan değer ekler:

```ts
export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url',
};
```

`environment.development.ts` gibi hedefe özgü yapılandırma dosyaları ekleyebilirsiniz.
Aşağıdaki içerik, geliştirme derleme hedefi için varsayılan değerleri ayarlar:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://my-dev-url',
};
```

## Using environment-specific variables in your app

Tanımladığınız ortam yapılandırmalarını kullanmak için bileşenlerinizin orijinal ortam dosyasını içe aktarması gerekir:

```ts
import {environment} from './environments/environment';
```

Bu, build ve serve komutlarının belirli derleme hedefleri için yapılandırmaları bulabilmesini sağlar.

Bileşen dosyasındaki (`app.ts`) aşağıdaki kod, yapılandırma dosyalarında tanımlanan bir ortam değişkenini kullanır.

```ts
import {environment} from './../environments/environment';

// Fetches from `http://my-prod-url` in production, `http://my-dev-url` in development.
fetch(environment.apiUrl);
```

Ana CLI yapılandırma dosyası `angular.json`, her derleme hedefinin yapılandırmasında TypeScript programındaki herhangi bir dosyayı o dosyanın hedefe özgü bir sürümüyle değiştirmenize olanak tanıyan bir `fileReplacements` bölümü içerir.
Bu, üretim veya staging gibi belirli bir ortamı hedefleyen bir derlemede hedefe özgü kod veya değişkenler dahil etmek için kullanışlıdır.

Varsayılan olarak hiçbir dosya değiştirilmez, ancak `ng generate environments` bu yapılandırmayı otomatik olarak ayarlar.
Belirli derleme hedefleri için dosya değiştirmelerini `angular.json` yapılandırmasını doğrudan düzenleyerek değiştirebilir veya ekleyebilirsiniz.

```json

  "configurations": {
    "development": {
      "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.development.ts"
          }
        ],
        …

```

Bu, `ng build --configuration development` ile geliştirme yapılandırmanızı derlediğinizde, `src/environments/environment.ts` dosyasının hedefe özgü sürüm olan `src/environments/environment.development.ts` ile değiştirildiği anlamına gelir.

Bir staging ortamı eklemek için `src/environments/environment.ts` dosyasının `src/environments/environment.staging.ts` adlı bir kopyasını oluşturun, ardından `angular.json`'a bir `staging` yapılandırması ekleyin:

```json

  "configurations": {
    "development": { … },
    "production": { … },
    "staging": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.staging.ts"
        }
      ]
    }
  }

```

Bu hedef ortamına daha fazla yapılandırma seçeneği de ekleyebilirsiniz.
Derlemenizin desteklediği herhangi bir seçenek, derleme hedef yapılandırmasında geçersiz kılınabilir.

Staging yapılandırmasını kullanarak derlemek için aşağıdaki komutu çalıştırın:

```shell

ng build --configuration staging

```

Varsayılan olarak, `build` hedefi `production` ve `development` yapılandırmalarını içerir ve `ng serve` uygulamanın geliştirme derlemesini kullanır.
`buildTarget` seçeneğini ayarlayarak `ng serve`'i hedeflenen derleme yapılandırmasını kullanacak şekilde de yapılandırabilirsiniz:

```json

  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": { … },
    "configurations": {
      "development": {
        // Use the `development` configuration of the `build` target.
        "buildTarget": "my-app:build:development"
      },
      "production": {
        // Use the `production` configuration of the `build` target.
        "buildTarget": "my-app:build:production"
      }
    },
    "defaultConfiguration": "development"
  },

```

`defaultConfiguration` seçeneği, hangi yapılandırmanın varsayılan olarak kullanılacağını belirtir.
`defaultConfiguration` ayarlanmadığında, `options` doğrudan değiştirilmeden kullanılır.
