<!-- source: 7e12c4e8027f0510b83cdf2499ba5d9c56b7aa94 -->
# RouterLink ile Route'lara Bağlama

Uygulamanın mevcut durumunda, uygulama içinde var olan dahili bir bağlantıya tıkladığımızda tüm sayfa yenilenir. Küçük bir uygulamada bu önemsiz görünebilir, ancak daha fazla içeriğe sahip büyük sayfalarda kullanıcıların varlıkları yeniden indirmesi ve hesaplamaları tekrar çalıştırması gerektiğinden performans etkileri olabilir.

NOTE: [Ayrıntılı kılavuzdaki uygulamanıza rota ekleme](/guide/routing/define-routes#uygulamanıza-router-ekleme) hakkında daha fazla bilgi edinin.

Bu aktivitede, Angular Router'dan en iyi şekilde yararlanmak için `RouterLink` direktifini nasıl kullanacağınızı öğreneceksiniz.

<hr>

<docs-workflow>

<docs-step title="`RouterLink` direktifini içe aktarın {#import-routerlink-directive}">

`app.ts` dosyasında, `@angular/router`'dan mevcut import ifadesine `RouterLink` direktif import'unu ekleyin ve bileşen dekoratörünüzün `imports` dizisine ekleyin.

```ts
...
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterOutlet],
  ...
})
```

</docs-step>

<docs-step title="Şablona bir `routerLink` ekleyin {#add-a-routerlink-to-template}">

`RouterLink` direktifini kullanmak için `href` niteliklerini `routerLink` ile değiştirin. Şablonu bu değişiklikle güncelleyin.

```angular-ts
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  ...
  template: `
    ...
    <a routerLink="/">Home</a>
    <a routerLink="/user">User</a>
    ...
  `,
  imports: [RouterLink, RouterOutlet],
})
```

</docs-step>

</docs-workflow>

Navigasyondaki bağlantılara tıkladığınızda artık herhangi bir yanıp sönme görmemeli ve yalnızca sayfanın içeriğinin (yani `router-outlet`) değiştiğini görmelisiniz 🎉

Angular ile yönlendirme konusunda harika bir iş çıkardınız. Bu, `Router` API'sinin sadece yüzeyi; daha fazla bilgi edinmek için [Angular Router Belgelerine](guide/routing) göz atın.
