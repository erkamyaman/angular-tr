# Geliştirme için Angular uygulamalarını sunma

Angular CLI uygulamanızı `ng serve` komutuyla sunabilirsiniz.
Bu, uygulamanızı derler, gereksiz optimizasyonları atlar, bir geliştirme sunucusu başlatır ve sonraki değişiklikleri otomatik olarak yeniden derler ve canlı yeniden yükler.
Sunucuyu `Ctrl+C` tuşlarına basarak durdurabilirsiniz.

`ng serve` yalnızca `angular.json` içinde belirtilen varsayılan projedeki `serve` hedefi için builder'ı çalıştırır. Burada herhangi bir builder kullanılabilir, ancak en yaygın (ve varsayılan) builder `@angular/build:dev-server`'dır.

Belirli bir proje için hangi builder'ın kullanıldığını, o projenin `serve` hedefine bakarak belirleyebilirsiniz.

```json
{
  "projects": {
    "my-app": {
      "architect": {
        // `ng serve`, `serve` adlı Architect hedefini çalıştırır.
        "serve": {
          "builder": "@angular/build:dev-server"
          // ...
        },
        "build": {
          /* ... */
        },
        "test": {
          /* ... */
        }
      }
    }
  }
}
```

## Arka uç sunucusuna proxy ile yönlendirme

Belirli URL'leri bir arka uç sunucusuna yönlendirmek için [proxy desteğini](https://vite.dev/config/server-options#server-proxy) kullanın; bunun için `--proxy-config` derleme seçeneğine bir dosya geçirin.
Örneğin, `http://localhost:4200/api` için yapılan tüm çağrıları `http://localhost:3000/api` üzerinde çalışan bir sunucuya yönlendirmek için aşağıdaki adımları izleyin.

1. Projenizin `src/` klasöründe bir `proxy.conf.json` dosyası oluşturun.
1. Yeni proxy dosyasına aşağıdaki içeriği ekleyin:

```json
{
  "/api/**": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

1. CLI yapılandırma dosyası `angular.json` içinde, `serve` hedefine `proxyConfig` seçeneğini ekleyin:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "serve": {
          "builder": "@angular/build:dev-server",
          "options": {
            "proxyConfig": "src/proxy.conf.json"
          }
        }
      }
    }
  }
}
```

1. Geliştirme sunucusunu bu proxy yapılandırmasıyla çalıştırmak için `ng serve` komutunu çağırın.

NOTE: Proxy yapılandırma dosyanızda yapılan değişiklikleri uygulamak için `ng serve` sürecini yeniden başlatmanız gerekir.

### Yol eşleme davranışı builder'a bağlıdır

**`@angular/build:dev-server`** ([Vite](https://vite.dev/config/server-options#server-proxy) tabanlı)

- `/api` yalnızca `/api` ile eşleşir.
- `/api/*` `/api/users` ile eşleşir ancak `/api/users/123` ile eşleşmez.
- `/api/**` hem `/api/users` hem de `/api/users/123` ile eşleşir.

**`@angular-devkit/build-angular:dev-server`** ([Webpack DevServer](https://webpack.js.org/configuration/dev-server/#devserverproxy) tabanlı)

- `/api` hem `/api` hem de tüm alt yollarla eşleşir (`/api/**` ile eşdeğer).
