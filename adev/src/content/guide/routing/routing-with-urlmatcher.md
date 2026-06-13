# Özel Route Eşleştiricileri Oluşturma

Angular Router, kullanıcılarınızın uygulamanızda gezinmesine yardımcı olmak için kullanabileceğiniz güçlü bir eşleştirme stratejisini destekler.
Bu eşleştirme stratejisi statik rotaları, parametreli değişken rotaları, joker rotaları ve daha fazlasını destekler.
Ayrıca, URL'lerin daha karmaşık olduğu durumlar için kendi özel kalıp eşleştirmenizi oluşturun.

Bu eğitimde, Angular'ın `UrlMatcher`'ını kullanarak özel bir rota eşleştirici oluşturacaksınız.
Bu eşleştirici, URL'de bir Twitter kullanıcı adı arar.

## Hedefler

Angular'ın `UrlMatcher`'ını kullanarak özel bir rota eşleştirici uygulayın.

## Örnek bir uygulama oluşturma

Angular CLI kullanarak, _angular-custom-route-match_ adlı yeni bir uygulama oluşturun.
Varsayılan Angular uygulama çerçevesine ek olarak, bir _profile_ bileşeni de oluşturacaksınız.

1. _angular-custom-route-match_ adlı yeni bir Angular projesi oluşturun.

   ```shell
   ng new angular-custom-route-match
   ```

   `Would you like to add Angular routing?` sorusu geldiğinde `Y` seçin.

   `Which stylesheet format would you like to use?` sorusu geldiğinde `CSS` seçin.

   Birkaç dakika sonra yeni proje `angular-custom-route-match` hazırdır.

1. Terminalinizden `angular-custom-route-match` dizinine gidin.
1. Bir _profile_ bileşeni oluşturun.

   ```shell
   ng generate component profile
   ```

1. Kod editörünüzde `profile.html` dosyasını bulun ve yer tutucu içeriği aşağıdaki HTML ile değiştirin.

   <docs-code header="profile.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/profile/profile.html"/>

1. Kod editörünüzde `app.html` dosyasını bulun ve yer tutucu içeriği aşağıdaki HTML ile değiştirin.

   <docs-code header="app.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.html"/>

## Uygulamanız için route'ları yapılandırma

Uygulama çerçeveniz hazır olduğunda, `app.config.ts` dosyanıza yönlendirme yetenekleri eklemeniz gerekir.
Bu işlemin bir parçası olarak, URL'de bir Twitter kullanıcı adı arayan özel bir URL eşleştirici oluşturacaksınız.
Bu kullanıcı adı, öncesinde gelen `@` sembolü ile tanımlanır.

1. Kod editörünüzde `app.config.ts` dosyanızı açın.
1. Angular'ın `provideRouter` ve `withComponentInputBinding` ile uygulama rotaları için bir `import` ifadesi ekleyin.

   ```ts
   import {provideRouter, withComponentInputBinding} from '@angular/router';

   import {routes} from './app.routes';
   ```

1. providers dizisinde bir `provideRouter(routes, withComponentInputBinding())` ifadesi ekleyin.

1. Aşağıdaki kodu uygulama rotalarına ekleyerek özel rota eşleştiriciyi tanımlayın.

   <docs-code header="app.routes.ts" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.routes.ts" region="matcher"/>

Bu özel eşleştirici, aşağıdaki görevleri yerine getiren bir fonksiyondur:

- Eşleştirici, dizinin yalnızca bir segment içerdiğini doğrular
- Eşleştirici, kullanıcı adı formatının eşleştiğinden emin olmak için bir düzenli ifade kullanır
- Eşleşme varsa, fonksiyon tüm URL'yi döndürür ve yolun bir alt dizesi olarak bir `username` rota parametresi tanımlar
- Eşleşme yoksa, fonksiyon null döndürür ve yönlendirici URL ile eşleşen diğer rotaları aramaya devam eder

HELPFUL: Özel bir URL eşleştirici, diğer herhangi bir rota tanımı gibi davranır. Alt rotaları veya tembel yüklenen rotaları, diğer herhangi bir rotada olduğu gibi tanımlayın.

## Route parametrelerini okuma

Özel eşleştirici hazır olduğunda, artık `profile` bileşeninde rota parametresini bağlayabilirsiniz.

Kod editörünüzde `profile.ts` dosyanızı açın ve `username` parametresiyle eşleşen bir `input` oluşturun.
Daha önce `provideRouter`'da `withComponentInputBinding` özelliğini eklemiştik. Bu, `Router`'ın bilgileri doğrudan rota bileşenlerine bağlamasına olanak tanır.

```ts
username = input.required<string>();
```

## Özel URL eşleştiricinizi test etme

Kodunuz hazır olduğunda, artık özel URL eşleştiricinizi test edebilirsiniz.

1. Bir terminal penceresinden `ng serve` komutunu çalıştırın.

   ```shell
   ng serve
   ```

1. Bir tarayıcıda `http://localhost:4200` adresini açın.

   `Navigate to my profile` yazan bir cümleden oluşan tek bir web sayfası görmelisiniz.

1. **my profile** bağlantısına tıklayın.

   Sayfada `Hello, Angular!` yazan yeni bir cümle belirir.

## Sonraki Adımlar

Angular Router ile kalıp eşleştirme, uygulamanızda dinamik URL'leriniz olduğunda size çok fazla esneklik sağlar.
Angular Router hakkında daha fazla bilgi edinmek için aşağıdaki konulara bakın:

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="In-app Routing and Navigation"/>
  <docs-pill href="api/router/Router" title="Router API"/>
</docs-pill-row>

HELPFUL: Bu içerik, [Brandon Roberts](https://twitter.com/brandontroberts) tarafından yazılan [Custom Route Matching with the Angular Router](https://medium.com/@brandontroberts/custom-route-matching-with-the-angular-router-fbdd48665483) makalesine dayanmaktadır.
