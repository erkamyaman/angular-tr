# Migration to lazy-loaded routes

Bu şematik, geliştiricilerin hevesli yüklenen bileşen rotalarını tembel yüklenen rotalara dönüştürmelerine yardımcı olur. Bu, derleme sürecinin üretim paketini daha küçük parçalara bölmesine olanak tanıyarak, tüm rotaları içeren büyük JS paketini önler, bu da bir uygulamanın ilk sayfa yüklemesini olumsuz etkiler.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```shell
ng generate @angular/core:route-lazy-loading
```

### `path` config option

Varsayılan olarak, geçiş tüm uygulamayı tarayacaktır. Bu geçişi dosyaların bir alt kümesine uygulamak istiyorsanız, aşağıda gösterildiği gibi path argümanını iletebilirsiniz:

```shell
ng generate @angular/core:route-lazy-loading --path src/app/sub-component
```

path parametresinin değeri, proje içindeki göreli bir yoldur.

### How does it work?

Şematik, uygulama rotalarının tanımlandığı tüm yerleri bulmaya çalışacaktır:

- `RouterModule.forRoot` ve `RouterModule.forChild`
- `Router.resetConfig`
- `provideRouter`
- `Routes` veya `Route[]` türünde değişkenler (örn. `const routes: Routes = [{...}]`)

Geçiş, rotalardaki tüm bileşenleri kontrol edecek, standalone ve hevesli yüklenen olup olmadıklarını kontrol edecek ve öyleyse bunları tembel yüklenen rotalara dönüştürecektir.

#### Before

```typescript
// app.module.ts
import {Home} from './home';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        // Home is standalone and eagerly loaded
        component: Home,
      },
    ]),
  ],
})
export class AppModule {}
```

#### After

```typescript
// app.module.ts
@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        // ↓ Home is now lazy loaded
        loadComponent: () => import('./home').then((m) => m.Home),
      },
    ]),
  ],
})
export class AppModule {}
```

Bu geçiş ayrıca NgModule'lerde bildirilen tüm bileşenler hakkında bilgi toplayacak ve bunları kullanan rotaların listesini (dosyanın karşılık gelen konumu dahil) çıktılayacaktır. Bu bileşenleri standalone yapmayı ve bu geçişi tekrar çalıştırmayı düşünün. Bu bileşenleri standalone'a dönüştürmek için mevcut bir geçişi ([bakın](reference/migrations/standalone)) kullanabilirsiniz.
