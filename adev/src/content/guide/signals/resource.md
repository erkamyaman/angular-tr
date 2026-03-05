# Async reactivity with resources

IMPORTANT: `resource` [deneyseldir](reference/releases#experimental). Denemeniz için hazırdır, ancak kararlı hale gelmeden önce değişebilir.

Tüm sinyal API'leri senkrondur-- `signal`, `computed`, `input`, vb. Ancak uygulamalar genellikle asenkron olarak kullanılabilen verilerle uğraşmak zorundadır. Bir `Resource`, asenkron verileri uygulamanızın sinyal tabanlı koduna dahil etmenin ve yine de verilerine senkron olarak erişmenin bir yolunu sunar.

Herhangi bir asenkron işlemi gerçekleştirmek için bir `Resource` kullanabilirsiniz, ancak `Resource` için en yaygın kullanım durumu bir sunucudan veri almaktır. Aşağıdaki örnek bazı kullanıcı verilerini almak için bir kaynak oluşturur.

Bir `Resource` oluşturmanın en kolay yolu `resource` fonksiyonudur.

```typescript
import {resource, Signal} from '@angular/core';

const userId: Signal<string> = getUserId();

const userResource = resource({
  // Define a reactive computation.
  // The params value recomputes whenever any read signals change.
  params: () => ({id: userId()}),

  // Define an async loader that retrieves data.
  // The resource calls this function every time the `params` value changes.
  loader: ({params}) => fetchUser(params),
});

// Create a computed signal based on the result of the resource's loader function.
const firstName = computed(() => {
  if (userResource.hasValue()) {
    // `hasValue` serves 2 purposes:
    // - It acts as type guard to strip `undefined` from the type
    // - If protects against reading a throwing `value` when the resource is in error state
    return userResource.value().firstName;
  }

  // fallback in case the resource value is `undefined` or if the resource is in error state
  return undefined;
});
```

`resource` fonksiyonu iki ana özelliğe sahip bir `ResourceOptions` nesnesi kabul eder: `params` ve `loader`.

`params` özelliği, bir parametre değeri üreten reaktif bir hesaplama tanımlar. Bu hesaplamada okunan sinyaller değiştiğinde, kaynak `computed`'a benzer şekilde yeni bir parametre değeri üretir.

`loader` özelliği bir `ResourceLoader` tanımlar-- bir miktar durum alan asenkron bir fonksiyon. Kaynak, `params` hesaplaması yeni bir değer ürettiğinde yükleyiciyi çağırır ve o değeri yükleyiciye iletir. Daha fazla ayrıntı için aşağıdaki [Resource yükleyicileri](#resource-loaders) bölümüne bakın.

`Resource`, yükleyicinin sonuçlarını içeren bir `value` sinyaline sahiptir.

## Resource loaders

Bir kaynak oluştururken bir `ResourceLoader` belirtirsiniz. Bu yükleyici, tek bir parametre kabul eden asenkron bir fonksiyondur-- bir `ResourceLoaderParams` nesnesi-- ve bir değer döndürür.

`ResourceLoaderParams` nesnesi üç özellik içerir: `params`, `previous` ve `abortSignal`.

| Property      | Description                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `params`      | The value of the resource's `params` computation.                                                                                                |
| `previous`    | An object with a `status` property, containing the previous `ResourceStatus`.                                                                    |
| `abortSignal` | An [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). See [Aborting requests](#aborting-requests) below for details. |

`params` hesaplaması `undefined` döndürürse, yükleyici fonksiyon çalışmaz ve kaynak durumu `'idle'` olur.

### Aborting requests

Kaynak, `params` hesaplaması yüklenme sırasında değişirse bekleyen bir yükleme işlemini iptal eder.

İptal edilen isteklere yanıt vermek için `ResourceLoaderParams` içindeki `abortSignal`'i kullanabilirsiniz. Örneğin, yerel `fetch` fonksiyonu bir `AbortSignal` kabul eder:

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params, abortSignal}): Promise<User> => {
    // fetch cancels any outstanding HTTP requests when the given `AbortSignal`
    // indicates that the request has been aborted.
    return fetch(`users/${params.id}`, {signal: abortSignal});
  },
});
```

`AbortSignal` ile istek iptali hakkında daha fazla ayrıntı için MDN'deki [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) sayfasına bakın.

### Reloading

`reload` yöntemini çağırarak bir kaynağın `loader`'ını programatik olarak tetikleyebilirsiniz.

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
});

// ...

userResource.reload();
```

## Resource status

Kaynak nesnesi, asenkron yükleyicinin durumunu okumak için çeşitli sinyal özelliklerine sahiptir.

| Property    | Description                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `value`     | The most recent value of the resource, or `undefined` if no value has been received.                            |
| `hasValue`  | Whether the resource has a value.                                                                               |
| `error`     | The most recent error encountered while running the resource's loader, or `undefined` if no error has occurred. |
| `isLoading` | Whether the resource loader is currently running.                                                               |
| `status`    | The resource's specific `ResourceStatus`, as described below.                                                   |

`status` sinyali, kaynağın durumunu bir string sabiti kullanarak tanımlayan belirli bir `ResourceStatus` sağlar.

| Status        | `value()`         | Description                                                                  |
| ------------- | :---------------- | ---------------------------------------------------------------------------- |
| `'idle'`      | `undefined`       | The resource has no valid request and the loader has not run.                |
| `'error'`     | `undefined`       | The loader has encountered an error.                                         |
| `'loading'`   | `undefined`       | The loader is running as a result of the `params` value changing.            |
| `'reloading'` | Previous value    | The loader is running as a result calling of the resource's `reload` method. |
| `'resolved'`  | Resolved value    | The loader has completed.                                                    |
| `'local'`     | Locally set value | The resource's value has been set locally via `.set()` or `.update()`        |

Bu durum bilgisini, yükleme göstergeleri ve hata mesajları gibi kullanıcı arayüzü öğelerini koşullu olarak görüntülemek için kullanabilirsiniz.

## Reactive data fetching with `httpResource`

[`httpResource`](/guide/http/http-resource), `HttpClient` etrafında size istek durumunu ve yanıtı sinyal olarak veren bir sarmalayıcıdır. Yakalayıcılar dahil Angular HTTP yığını aracılığıyla HTTP istekleri yapar.

## Resource composition with snapshots

`ResourceSnapshot`, bir kaynağın mevcut durumunun yapılandırılmış bir temsilidir. Her kaynağın mevcut durumunun sinyalini sağlayan bir `snapshot` özelliği vardır.

```ts
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
});

const userSnapshot = userResource.snapshot;
```

Her anlık görüntü bir `status` ve bir `value` veya `error` içerir.

### Composing resources with snapshots

`resourceFromSnapshots` kullanarak anlık görüntülerden yeni kaynaklar oluşturabilirsiniz. Bu, kaynak davranışını dönüştürmek için `computed` ve `linkedSignal` gibi sinyal API'leri ile bileşimi mümkün kılar.

```ts
import {linkedSignal, resourceFromSnapshots, Resource, ResourceSnapshot} from '@angular/core';

function withPreviousValue<T>(input: Resource<T>): Resource<T> {
  const derived = linkedSignal<ResourceSnapshot<T>, ResourceSnapshot<T>>({
    source: input.snapshot,
    computation: (snap, previous) => {
      if (snap.status === 'loading' && previous && previous.value.status !== 'error') {
        // When the input resource enters loading state, we keep the value
        // from its previous state, if any.
        return {status: 'loading' as const, value: previous.value.value};
      }

      // Otherwise we simply forward the state of the input resource.
      return snap;
    },
  });

  return resourceFromSnapshots(derived);
}

@Component({
  /*... */
})
export class AwesomeProfile {
  userId = input.required<number>();
  user = withPreviousValue(httpResource(() => `/user/${this.userId()}`));
  // When userId changes, user.value() keeps the old user data until the new one loads
}
```
