# Routing Overview

Çoğu uygulama için, uygulamanın tek bir sayfadan fazlasına ihtiyaç duyduğu bir nokta gelir. Bu zaman kaçınılmaz olarak geldiğinde, yönlendirme (routing) kullanıcılar için performans hikayesinin büyük bir parçası haline gelir.

NOTE: [Ayrıntılı kılavuzdaki yönlendirme](/guide/routing) hakkında daha fazla bilgi edinin.

Bu aktivitede, uygulamanızı Angular Router kullanacak şekilde nasıl kuracağınızı ve yapılandıracağınızı öğreneceksiniz.

<hr>

<docs-workflow>

<docs-step title="Bir app.routes.ts dosyası oluşturun">

`app.routes.ts` dosyasının içinde aşağıdaki değişiklikleri yapın:

1. `@angular/router` paketinden `Routes`'u içe aktarın.
2. `Routes` tipinde `routes` adında bir sabit dışa aktarın ve değer olarak `[]` atayın.

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [];
```

</docs-step>

<docs-step title="Sağlayıcıya yönlendirme ekleyin">

`app.config.ts` dosyasında, uygulamayı aşağıdaki adımlarla Angular Router için yapılandırın:

1. `@angular/router`'dan `provideRouter` fonksiyonunu içe aktarın.
1. `./app.routes.ts` dosyasından `routes`'u içe aktarın.
1. `providers` dizisinde `routes`'u argüman olarak geçirerek `provideRouter` fonksiyonunu çağırın.

```ts {highlight:[2,3,6]}
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
```

</docs-step>

<docs-step title="Bileşende `RouterOutlet`'i içe aktarın">

Son olarak, uygulamanızın Angular Router'ı kullanmaya hazır olduğundan emin olmak için, uygulamaya yönlendiricinin istenen içeriği nerede göstermesini beklediğinizi söylemeniz gerekir. Bunu, `@angular/router`'dan `RouterOutlet` direktifini kullanarak gerçekleştirin.

`App` şablonunu `<router-outlet />` ekleyerek güncelleyin

```angular-ts {highlight:[11]}
import {RouterOutlet} from '@angular/router';

@Component({
...
template: `
    <nav>
      <a href="/">Home</a>
      |
      <a href="/user">User</a>
    </nav>
    <router-outlet />
  `,
imports: [RouterOutlet],
})
export class App {}
```

</docs-step>

</docs-workflow>

Uygulamanız artık Angular Router kullanmaya hazır. Harika is! 🙌

Uygulamamız için rotaları tanımlamanın bir sonraki adımını öğrenmek için devam edin.
