# NgModules

IMPORTANT: Angular ekibi, tüm yeni kodlar için `NgModule` yerine [bağımsız bileşenler](guide/components) kullanılmasını önerir. Mevcut `@NgModule` ile oluşturulmuş kodu anlamak için bu kılavuzu kullanın.

Bir NgModule, `@NgModule` dekoratörü ile işaretlenmiş bir sınıftır. Bu dekoratör, Angular'a bileşen şablonlarını nasıl derleyeceğini ve bağımlılık enjeksiyonunu nasıl yapılandıracağını söyleyen _meta verileri_ kabul eder.

```typescript
import {NgModule} from '@angular/core';

@NgModule({
  // Metadata goes here
})
export class CustomMenuModule {}
```

Bir NgModule'ün iki ana sorumluluğu vardır:

- NgModule'e ait bileşenleri, direktifleri ve pipe'ları bildirmek
- NgModule'ü içe aktaran bileşenler, direktifler ve pipe'lar için enjektöre sağlayıcılar eklemek

## Declarations

`@NgModule` meta verisinin `declarations` özelliği, NgModule'e ait bileşenleri, direktifleri ve pipe'ları bildirir.

```typescript
@NgModule({
  /* ... */
  // CustomMenu and CustomMenuItem are components.
  declarations: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule {}
```

Yukarıdaki örnekte, `CustomMenu` ve `CustomMenuItem` bileşenleri `CustomMenuModule`'e aittir.

`declarations` özelliği ek olarak bileşen, direktif ve pipe _dizilerini_ kabul eder. Bu diziler de sırasıyla başka diziler içerebilir.

```typescript
const MENU_COMPONENTS = [CustomMenu, CustomMenuItem];
const WIDGETS = [MENU_COMPONENTS, CustomSlider];

@NgModule({
  /* ... */
  // This NgModule declares all of CustomMenu, CustomMenuItem,
  // CustomSlider, and CustomCheckbox.
  declarations: [WIDGETS, CustomCheckbox],
})
export class CustomMenuModule {}
```

Angular, birden fazla NgModule'de bildirilen herhangi bir bileşen, direktif veya pipe keşfederse bir hata bildirir.

Bir NgModule'de bildirilmek için herhangi bir bileşen, direktif veya pipe açıkça `standalone: false` olarak işaretlenmelidir.

```typescript
@Component({
  // Mark this component as `standalone: false` so that it can be declared in an NgModule.
  standalone: false,
  /* ... */
})
export class CustomMenu {
  /* ... */
}
```

### imports

Bir NgModule'de bildirilen bileşenler diğer bileşenlere, direktiflere ve pipe'lara bağımlı olabilir. Bu bağımlılıkları `@NgModule` meta verisinin `imports` özelliğine ekleyin.

```typescript
@NgModule({
  /* ... */
  // CustomMenu and CustomMenuItem depend on the PopupTrigger and SelectorIndicator components.
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule {}
```

`imports` dizisi, diğer NgModule'leri ve bağımsız bileşenleri, direktifleri ve pipe'ları kabul eder.

### exports

Bir NgModule, bildirilen bileşenlerini, direktiflerini ve pipe'larını diğer bileşenler ve NgModule'ler tarafından kullanılabilir olacak şekilde _dışa aktarabilir_.

```typescript
@NgModule({
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],

  // Make CustomMenu and CustomMenuItem available to
  // components and NgModules that import CustomMenuModule.
  exports: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule {}
```

Ancak `exports` özelliği bildirimlerle sınırlı değildir. Bir NgModule ayrıca içe aktardığı diğer bileşenleri, direktifleri, pipe'ları ve NgModule'leri de dışa aktarabilir.

```typescript
@NgModule({
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],

  // Also make PopupTrigger available to any component or NgModule that imports CustomMenuModule.
  exports: [CustomMenu, CustomMenuItem, PopupTrigger],
})
export class CustomMenuModule {}
```

## `NgModule` providers

TIP: Bağımlılık enjeksiyonu ve sağlayıcılar hakkında bilgi için [Bağımlılık Enjeksiyonu kılavuzuna](guide/di) bakın.

Bir `NgModule`, enjekte edilen bağımlılıklar için `providers` belirleyebilir. Bu sağlayıcılar aşağıdakilere sunulur:

- NgModule'ü içe aktaran herhangi bir bağımsız bileşen, direktif veya pipe, ve
- NgModule'ü içe aktaran herhangi bir _diğer_ NgModule'ün `declarations` ve `providers` değerleri.

```typescript
@NgModule({
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],

  // Provide the OverlayManager service
  providers: [OverlayManager],
  /* ... */
})
export class CustomMenuModule {}

@NgModule({
  imports: [CustomMenuModule],
  declarations: [UserProfile],
  providers: [UserDataClient],
})
export class UserProfileModule {}
```

Yukarıdaki örnekte:

- `CustomMenuModule`, `OverlayManager`'ı sağlar.
- `CustomMenu` ve `CustomMenuItem` bileşenleri, `CustomMenuModule`'de bildirildikleri için `OverlayManager`'ı enjekte edebilir.
- `UserProfile`, NgModule'ü `CustomMenuModule`'ü içe aktardığı için `OverlayManager`'ı enjekte edebilir.
- `UserDataClient`, NgModule'ü `CustomMenuModule`'ü içe aktardığı için `OverlayManager`'ı enjekte edebilir.

### The `forRoot` and `forChild` pattern

Bazı NgModule'ler, bazı yapılandırmaları kabul eden ve bir sağlayıcı dizisi döndüren statik bir `forRoot` yöntemi tanımlar. "`forRoot`" adı, bu sağlayıcıların önyükleme sırasında yalnızca uygulamanızın _köküne_ eklenmesinin amaçlandığını belirten bir kuraldır.

Bu şekilde dahil edilen sağlayıcılar hevesle yüklenir ve ilk sayfa yüklemenizin JavaScript paket boyutunu artırır.

```typescript
bootstrapApplication(MyApplicationRoot, {
  providers: [CustomMenuModule.forRoot(/* some config */)],
});
```

Benzer şekilde, bazı NgModule'ler, sağlayıcıların uygulama hiyerarşinizdeki bileşenlere eklenmesinin amaçlandığını belirten statik bir `forChild` yöntemi tanımlayabilir.

```typescript
@Component({
  /* ... */
  providers: [CustomMenuModule.forChild(/* some config */)],
})
export class UserProfile {
  /* ... */
}
```

## Bootstrapping an application

IMPORTANT: Angular ekibi, tüm yeni kodlar için `bootstrapModule` yerine [bootstrapApplication](api/platform-browser/bootstrapApplication) kullanılmasını önerir. `@NgModule` ile önyükleme yapılan mevcut uygulamaları anlamak için bu kılavuzu kullanın.

`@NgModule` dekoratörü, bir veya daha fazla bileşen içerebilen isteğe bağlı bir `bootstrap` dizisi kabul eder.

Angular uygulamasını başlatmak için [`platformBrowser`](api/platform-browser/platformBrowser) veya [`platformServer`](api/platform-server/platformServer)'dan [`bootstrapModule`](/api/core/PlatformRef#bootstrapModule) yöntemini kullanabilirsiniz. Çalıştırıldığında, bu fonksiyon listelenen bileşenlerle eşleşen bir CSS seçicisine sahip sayfadaki tüm öğeleri bulur ve bu bileşenleri sayfada render eder.

```typescript
import {platformBrowser} from '@angular/platform-browser';

@NgModule({
  bootstrap: [MyApplication],
})
export class MyApplicationModule {}

platformBrowser().bootstrapModule(MyApplicationModule);
```

`bootstrap` içinde listelenen bileşenler otomatik olarak NgModule'ün bildirimlerine dahil edilir.

Bir uygulamayı NgModule'den önyükleme yaptığınızda, bu modülün toplanan `providers` değerleri ve tüm `imports` değerlerinin `providers` değerleri hevesle yüklenir ve tüm uygulama için enjekte edilmeye hazır olur.
