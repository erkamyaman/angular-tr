# Incremental Hydration

**Artımlı hidrasyon**, uygulamanızın bölümlerini dehidrate bırakabilen ve ihtiyaç duyuldukça bu bölümlerin hidrasyonunu _artımlı olarak_ tetikleyebilen gelişmiş bir [hidrasyon](guide/hydration) türüdür.

## Why use incremental hydration?

Artımlı hidrasyon, tam uygulama hidrasyonunun üzerine inşa edilen bir performans iyileştirmesidir. Tam uygulama hidrasyon deneyimiyle karşılaştırılabilir bir son kullanıcı deneyimi sunarken daha küçük başlangıç paketleri üretebilir. Daha küçük paketler başlangıç yükleme sürelerini iyileştirir, [First Input Delay (FID)](https://web.dev/fid) ve [Cumulative Layout Shift (CLS)](https://web.dev/cls) değerlerini azaltır.

Artımlı hidrasyon ayrıca daha önce ertelenebilir olmayan içerik için ertelenebilir görünümler (`@defer`) kullanmanıza da olanak tanır. Özellikle, artık ekranın üst kısmındaki (above the fold) içerik için ertelenebilir görünümler kullanabilirsiniz. Artımlı hidrasyon öncesinde, ekranın üst kısmına bir `@defer` bloğu koymak, yer tutucu içeriğin render edilmesine ve ardından `@defer` bloğunun ana şablon içeriğiyle değiştirilmesine neden olurdu. Bu da düzen kaymasına yol açardı. Artımlı hidrasyon, `@defer` bloğunun ana şablonunun hidrasyon sırasında düzen kayması olmadan render edileceği anlamına gelir.

## How do you enable incremental hydration in Angular?

Artımlı hidrasyonu, zaten hidrasyon ile sunucu tarafı render (SSR) kullanan uygulamalar için etkinleştirebilirsiniz. Önce sunucu tarafı render'ı etkinleştirmek için [Angular SSR Kılavuzu](guide/ssr)'nu ve hidrasyonu etkinleştirmek için [Angular Hidrasyon Kılavuzu](guide/hydration)'nu takip edin.

`provideClientHydration` sağlayıcısına `withIncrementalHydration()` fonksiyonunu ekleyerek artımlı hidrasyonu etkinleştirin.

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
  withIncrementalHydration,
} from '@angular/platform-browser';
...

bootstrapApplication(App, {
  providers: [provideClientHydration(withIncrementalHydration())]
});
```

Artımlı Hidrasyon, [olay tekrarına](guide/hydration#capturing-and-replaying-events) bağımlıdır ve otomatik olarak etkinleştirir. Listenizde zaten `withEventReplay()` varsa, artımlı hidrasyonu etkinleştirdikten sonra güvenle kaldırabilirsiniz.

## How does incremental hydration work?

Artımlı hidrasyon, tam uygulama [hidrasyonu](guide/hydration), [ertelenebilir görünümler](/guide/templates/defer) ve [olay tekrarı](guide/hydration#capturing-and-replaying-events) üzerine inşa edilmiştir. Artımlı hidrasyon ile artımlı hidrasyon sınırlarını tanımlayan `@defer` bloklarına ek tetikleyiciler ekleyebilirsiniz. Bir defer bloğuna `hydrate` tetikleyicisi eklemek, Angular'a sunucu tarafı render sırasında o defer bloğunun bağımlılıklarını yüklemesi ve `@placeholder` yerine ana şablonu render etmesi gerektiğini söyler. İstemci tarafı render sırasında, bağımlılıklar hâlâ ertelenir ve defer bloğu içeriği `hydrate` tetikleyicisi tetiklenene kadar dehidrate kalır. Bu tetikleyici, defer bloğuna bağımlılıklarını getirmesini ve içeriği hidrasyon yapmasını söyler. Kullanıcı tarafından hidrasyon öncesinde tetiklenen herhangi bir tarayıcı olayı, özellikle bileşeninizde kayıtlı dinleyicilerle eşleşenler, sıraya alınır ve hidrasyon işlemi tamamlandıktan sonra yeniden oynatılır.

## Controlling hydration of content with triggers

İçeriğin ne zaman yükleneceğini ve hidrasyon yapılacağını kontrol eden **hidrasyon tetikleyicileri** belirleyebilirsiniz. Bunlar, normal `@defer` tetikleyicilerinin yanında kullanılabilen ek tetikleyicilerdir.

Her `@defer` bloğu, noktalı virgül (`;`) ile ayrılmış birden fazla hidrasyon olay tetikleyicisine sahip olabilir. Angular, tetikleyicilerden _herhangi biri_ tetiklendiğinde hidrasyonu başlatır.

Üç tür hidrasyon tetikleyicisi vardır: `hydrate on`, `hydrate when` ve `hydrate never`.

### `hydrate on`

`hydrate on`, `@defer` bloğu için hidrasyonun ne zaman tetikleneceğine ilişkin bir koşul belirtir.

Kullanılabilir tetikleyiciler aşağıdaki gibidir:

| Trigger                                             | Description                                                            |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| [`hydrate on idle`](#hydrate-on-idle)               | Tarayıcı boşta olduğunda tetiklenir.                                   |
| [`hydrate on viewport`](#hydrate-on-viewport)       | Belirtilen içerik görünüm alanına girdiğinde tetiklenir                |
| [`hydrate on interaction`](#hydrate-on-interaction) | Kullanıcı belirtilen öğeyle etkileşime geçtiğinde tetiklenir           |
| [`hydrate on hover`](#hydrate-on-hover)             | Fare belirtilen alanın üzerine geldiğinde tetiklenir                   |
| [`hydrate on immediate`](#hydrate-on-immediate)     | Ertelenmemiş içerik render edilmeyi bitirdikten hemen sonra tetiklenir |
| [`hydrate on timer`](#hydrate-on-timer)             | Belirli bir süre sonra tetiklenir                                      |

#### `hydrate on idle`

`hydrate on idle` tetikleyicisi, `requestIdleCallback`'e dayalı olarak tarayıcı boşta durumuna ulaştığında ertelenebilir görünümün bağımlılıklarını yükler ve içeriği hidrasyon yapar.

```angular-html
@defer (hydrate on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on viewport`

`hydrate on viewport` tetikleyicisi, belirtilen içerik [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) kullanılarak görünüm alanına girdiğinde ertelenebilir görünümün bağımlılıklarını yükler ve uygulamanın ilgili sayfasını hidrasyon yapar.

```angular-html
@defer (hydrate on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on interaction`

`hydrate on interaction` tetikleyicisi, kullanıcı belirtilen öğeyle `click` veya `keydown` olayları aracılığıyla etkileşime geçtiğinde ertelenebilir görünümün bağımlılıklarını yükler ve içeriği hidrasyon yapar.

```angular-html
@defer (hydrate on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on hover`

`hydrate on hover` tetikleyicisi, fare `mouseover` ve `focusin` olayları aracılığıyla tetiklenen alanın üzerine geldiğinde ertelenebilir görünümün bağımlılıklarını yükler ve içeriği hidrasyon yapar.

```angular-html
@defer (hydrate on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on immediate`

`hydrate on immediate` tetikleyicisi, ertelenebilir görünümün bağımlılıklarını hemen yükler ve içeriği hidrasyon yapar. Bu, ertelenmiş bloğun diğer tüm ertelenmemiş içerik render edilmeyi bitirdikten sonra yüklendiği anlamına gelir.

```angular-html
@defer (hydrate on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on timer`

`hydrate on timer` tetikleyicisi, belirli bir süre sonra ertelenebilir görünümün bağımlılıklarını yükler ve içeriği hidrasyon yapar.

```angular-html
@defer (hydrate on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Süre parametresi milisaniye (`ms`) veya saniye (`s`) cinsinden belirtilmelidir.

### `hydrate when`

`hydrate when` tetikleyicisi özel bir koşul ifadesi kabul eder ve koşul doğru olduğunda ertelenebilir görünümün bağımlılıklarını yükler ve içeriği hidrasyon yapar.

```angular-html
@defer (hydrate when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTE: `hydrate when` koşulları yalnızca en üstteki dehidrate `@defer` bloğu olduklarında tetiklenir. Tetikleyici için sağlanan koşul üst bileşende belirtilir ve tetiklenmeden önce mevcut olması gerekir. Üst blok dehidrate ise, bu ifade henüz Angular tarafından çözümlenemez.

### `hydrate never`

`hydrate never`, kullanıcıların defer bloğundaki içeriğin süresiz olarak dehidrate kalması gerektiğini belirtmelerine olanak tanır ve etkili bir şekilde statik içerik haline gelir. Bunun yalnızca ilk render için geçerli olduğunu unutmayın. Sonraki istemci tarafı render sırasında, `hydrate never` olan bir `@defer` bloğu yine de bağımlılıkları getirir çünkü hidrasyon yalnızca sunucu tarafında render edilmiş içeriğin ilk yüklemesi için geçerlidir. Aşağıdaki örnekte, sonraki istemci tarafı render'lar viewport'ta `@defer` bloğu bağımlılıklarını yükler.

```angular-html
@defer (on viewport; hydrate never) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTE: `hydrate never` kullanmak, verilen `@defer` bloğunun tüm iç içe geçmiş alt ağacının hidrasyonunu engeller. O bloğun altında iç içe geçmiş içerik için başka hiçbir `hydrate` tetikleyicisi tetiklenmez.

## Hydrate triggers alongside regular triggers

Hidrasyon tetikleyicileri, bir `@defer` bloğundaki normal tetikleyicilerin yanında kullanılan ek tetikleyicilerdir. Hidrasyon bir ilk yükleme optimizasyonudur ve bu, hidrasyon tetikleyicilerinin yalnızca o ilk yükleme için geçerli olduğu anlamına gelir. Sonraki herhangi bir istemci tarafı render yine de normal tetikleyiciyi kullanır.

```angular-html
@defer (on idle; hydrate on interaction) {
  <example-cmp />
} @placeholder {
  <div>Example Placeholder</div>
}
```

Bu örnekte, ilk yüklemede `hydrate on interaction` uygulanır. Hidrasyon, `<example-cmp />` bileşeni ile etkileşim sırasında tetiklenir. İstemci tarafında render edilen herhangi bir sonraki sayfa yüklemesinde, örneğin bir kullanıcının bu bileşeni içeren bir sayfayı yükleyen bir routerLink'e tıklaması durumunda, `on idle` uygulanır.

## How does incremental hydration work with nested `@defer` blocks?

Angular'ın bileşen ve bağımlılık sistemi hiyerarşiktir, yani herhangi bir bileşenin hidrasyon yapılması tüm üst bileşenlerinin de hidrasyon yapılmasını gerektirir. Bu nedenle, dehidrate `@defer` bloklarının iç içe geçmiş bir kümesinin bir alt `@defer` bloğu için hidrasyon tetiklenirse, hidrasyon en üstteki dehidrate `@defer` bloğundan tetiklenen alt bloğa kadar tetiklenir ve bu sırayla gerçekleşir.

```angular-html
@defer (hydrate on interaction) {
  <parent-block-cmp />
  @defer (hydrate on hover) {
    <child-block-cmp />
  } @placeholder {
    <div>Child placeholder</div>
  }
} @placeholder {
  <div>Parent Placeholder</div>
}
```

Yukarıdaki örnekte, iç içe geçmiş `@defer` bloğunun üzerine gelinmesi hidrasyonu tetikler. `<parent-block-cmp />` ile üst `@defer` bloğu önce hidrasyon yapar, ardından `<child-block-cmp />` ile alt `@defer` bloğu sonra hidrasyon yapar.

## Constraints

Artımlı hidrasyon, doğrudan DOM manipülasyonu sınırlamaları ve geçerli HTML yapısı gerekliliği dahil olmak üzere tam uygulama hidrasyonu ile aynı kısıtlamalara sahiptir. Daha fazla ayrıntı için [Hidrasyon kılavuzu kısıtlamaları](guide/hydration#constraints) bölümünü ziyaret edin.

## Do I still need to specify `@placeholder` blocks?

Evet. `@placeholder` bloğu içeriği artımlı hidrasyon için kullanılmaz, ancak sonraki istemci tarafı render durumları için bir `@placeholder` hâlâ gereklidir. İçeriğiniz ilk yüklemenin parçası olan rotada değilse, `@defer` bloğu içeriğinize sahip rotaya yapılan herhangi bir navigasyon normal bir `@defer` bloğu gibi render edilir. Bu nedenle `@placeholder`, bu istemci tarafı render durumlarında render edilir.
