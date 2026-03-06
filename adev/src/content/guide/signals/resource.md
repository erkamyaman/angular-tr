# Resource'lar ile asenkron reaktivite

IMPORTANT: `resource` [deneyseldir](reference/releases#deneysel). Denemeniz için hazırdır, ancak kararlı hale gelmeden önce değişebilir.

Tüm sinyal API'leri senkrondur-- `signal`, `computed`, `input`, vb. Ancak uygulamalar genellikle asenkron olarak kullanılabilen verilerle uğraşmak zorundadır. Bir `Resource`, asenkron verileri uygulamanızın sinyal tabanlı koduna dahil etmenin ve yine de verilerine senkron olarak erişmenin bir yolunu sunar.

Herhangi bir asenkron işlemi gerçekleştirmek için bir `Resource` kullanabilirsiniz, ancak `Resource` için en yaygın kullanım durumu bir sunucudan veri almaktır. Aşağıdaki örnek bazı kullanıcı verilerini almak için bir kaynak oluşturur.

Bir `Resource` oluşturmanın en kolay yolu `resource` fonksiyonudur.

```typescript
import {resource, Signal} from '@angular/core';

const userId: Signal<string> = getUserId();

const userResource = resource({
  // Reaktif bir hesaplama tanımla.
  // params değeri, okunan sinyallerden herhangi biri değiştiğinde yeniden hesaplanır.
  params: () => ({id: userId()}),

  // Veri alan asenkron bir loader tanımla.
  // Resource, `params` değeri her değiştiğinde bu fonksiyonu çağırır.
  loader: ({params}) => fetchUser(params),
});

// Resource'un loader fonksiyonunun sonucuna dayalı bir computed sinyal oluştur.
const firstName = computed(() => {
  if (userResource.hasValue()) {
    // `hasValue` iki amaca hizmet eder:
    // - Türden `undefined`'ı çıkaran bir tür koruması görevi görür
    // - Resource hata durumundayken hata fırlatan `value` okumasına karşı korur
    return userResource.value().firstName;
  }

  // Resource değeri `undefined` ise veya resource hata durumundaysa yedek değer
  return undefined;
});
```

`resource` fonksiyonu iki ana özelliğe sahip bir `ResourceOptions` nesnesi kabul eder: `params` ve `loader`.

`params` özelliği, bir parametre değeri üreten reaktif bir hesaplama tanımlar. Bu hesaplamada okunan sinyaller değiştiğinde, kaynak `computed`'a benzer şekilde yeni bir parametre değeri üretir.

`loader` özelliği bir `ResourceLoader` tanımlar-- bir miktar durum alan asenkron bir fonksiyon. Kaynak, `params` hesaplaması yeni bir değer ürettiğinde yükleyiciyi çağırır ve o değeri yükleyiciye iletir. Daha fazla ayrıntı için aşağıdaki [Resource yükleyicileri](#resource-loaderları) bölümüne bakın.

`Resource`, yükleyicinin sonuçlarını içeren bir `value` sinyaline sahiptir.

## Resource loader'ları

Bir kaynak oluştururken bir `ResourceLoader` belirtirsiniz. Bu yükleyici, tek bir parametre kabul eden asenkron bir fonksiyondur-- bir `ResourceLoaderParams` nesnesi-- ve bir değer döndürür.

`ResourceLoaderParams` nesnesi üç özellik içerir: `params`, `previous` ve `abortSignal`.

| Property      | Description                                                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params`      | The value of the resource's `params` computation.                                                                                                     |
| `previous`    | An object with a `status` property, containing the previous `ResourceStatus`.                                                                         |
| `abortSignal` | An [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). See [Aborting requests](#requestleri-iptal-etme) below for details. |

`params` hesaplaması `undefined` döndürürse, yükleyici fonksiyon çalışmaz ve kaynak durumu `'idle'` olur.

### Request'leri iptal etme

Kaynak, `params` hesaplaması yüklenme sırasında değişirse bekleyen bir yükleme işlemini iptal eder.

İptal edilen isteklere yanıt vermek için `ResourceLoaderParams` içindeki `abortSignal`'i kullanabilirsiniz. Örneğin, yerel `fetch` fonksiyonu bir `AbortSignal` kabul eder:

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params, abortSignal}): Promise<User> => {
    // fetch, verilen `AbortSignal` request'in iptal edildiğini belirttiğinde
    // bekleyen tüm HTTP request'lerini iptal eder.
    return fetch(`users/${params.id}`, {signal: abortSignal});
  },
});
```

`AbortSignal` ile istek iptali hakkında daha fazla ayrıntı için MDN'deki [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) sayfasına bakın.

### Yeniden yükleme

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

## Resource durumu

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

## `httpResource` ile reaktif veri çekme

[`httpResource`](/guide/http/http-resource), `HttpClient` etrafında size istek durumunu ve yanıtı sinyal olarak veren bir sarmalayıcıdır. Yakalayıcılar dahil Angular HTTP yığını aracılığıyla HTTP istekleri yapar.

## Snapshot'lar ile Resource bileşimi

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

### Snapshot'lar ile resource'ları birleştirme

`resourceFromSnapshots` kullanarak anlık görüntülerden yeni kaynaklar oluşturabilirsiniz. Bu, kaynak davranışını dönüştürmek için `computed` ve `linkedSignal` gibi sinyal API'leri ile bileşimi mümkün kılar.

```ts
import {linkedSignal, resourceFromSnapshots, Resource, ResourceSnapshot} from '@angular/core';

function withPreviousValue<T>(input: Resource<T>): Resource<T> {
  const derived = linkedSignal<ResourceSnapshot<T>, ResourceSnapshot<T>>({
    source: input.snapshot,
    computation: (snap, previous) => {
      if (snap.status === 'loading' && previous && previous.value.status !== 'error') {
        // Giriş resource'u yükleme durumuna geçtiğinde, varsa
        // önceki durumundaki değeri koruruz.
        return {status: 'loading' as const, value: previous.value.value};
      }

      // Aksi takdirde giriş resource'unun durumunu olduğu gibi iletiriz.
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
  // userId değiştiğinde, user.value() yeni veri yüklenene kadar eski kullanıcı verisini korur
}
```
