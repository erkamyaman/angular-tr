# Route Tanımlama

Uygulamayı Angular Router kullanacak şekilde kurduğunuza göre, artık rotaları tanımlamanız gerekiyor.

NOTE: [Ayrıntılı kılavuzdaki temel rota tanımlama](/guide/routing/define-routes) hakkında daha fazla bilgi edinin.

Bu aktivitede, uygulamanıza rotaları nasıl ekleyeceğinizi ve yapılandıracağınızı öğreneceksiniz.

<hr>

<docs-workflow>

<docs-step title="`app.routes.ts` dosyasında bir rota tanımlayın">

Uygulamanızda gösterilecek iki sayfa vardır: (1) Ana Sayfa ve (2) Kullanıcı Sayfası.

Bir rota tanımlamak için, `app.routes.ts` dosyasındaki `routes` dizisine aşağıdakileri içeren bir rota nesnesi ekleyin:

- Rotanın `path`'i (otomatik olarak kök yoldan (yani `/`) başlar)
- Rotanın göstermesini istediğiniz `component`

```ts
import {Routes} from '@angular/router';
import {Home} from './home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
];
```

Yukarıdaki kod, `Home`'un bir rota olarak nasıl eklenebileceğine dair bir örnektir. Şimdi devam edin ve bunu `User` ile birlikte oyun alanında uygulayın.

`User` için yol olarak `'user'` kullanın.

</docs-step>

<docs-step title="Rota tanımına başlık ekleyin">

Rotaları doğru şekilde tanımlamanın yanı sıra, Angular Router kullanıcılar navigasyon yaparken her rotaya `title` özelliği ekleyerek sayfa başlığını ayarlamanızı da sağlar.

`app.routes.ts` dosyasında, varsayılan rota (`path: ''`) ve `user` rotası için `title` özelliğini ekleyin. İşte bir örnek:

```ts {highlight:[7]}
import {Routes} from '@angular/router';
import {Home} from './home/home';

export const routes: Routes = [
  {
    path: '',
    title: 'App Home Page',
    component: Home,
  },
];
```

</docs-step>

</docs-workflow>

Bu aktivitede, Angular uygulamanızda rotaları nasıl tanımlayacağınızı ve yapılandıracağınızı öğrendiniz. Harika is. 🙌

Uygulamanızda yönlendirmeyi tamamen etkinleştirme yolculuğu neredeyse tamamlandı, devam edin.
