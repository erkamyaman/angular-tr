# Resource'lar ile asenkron reaktivite

Tüm sinyal API'leri senkrondur-- `signal`, `computed`, `input`, vb. Ancak uygulamalar genellikle asenkron olarak kullanılabilen verilerle uğraşmak zorundadır. Bir `Resource`, asenkron verileri uygulamanızın sinyal tabanlı koduna dahil etmenin ve yine de verilerine senkron olarak erişmenin bir yolunu sunar.

Herhangi bir asenkron işlemi gerçekleştirmek için bir `Resource` kullanabilirsiniz, ancak `Resource` için en yaygın kullanım durumu bir sunucudan veri almaktır. Aşağıdaki örnek bazı kullanıcı verilerini almak için bir kaynak oluşturur.

Bir `Resource` oluşturmanın en kolay yolu `resource` fonksiyonudur.

```typescript
import {computed, resource, Signal} from '@angular/core';

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

### Akış (streaming) kaynakları

Bazı asenkron veri kaynakları tek bir sonuç döndürmek yerine zaman içinde birden fazla değer üretir. Örnekler arasında WebSocket'ler, Server-Sent Events (SSE) ve Firestore `onSnapshot` dinleyicileri yer alır.

Sürekli güncellenen bu veri kaynakları için `stream` kullanın. Her istek için bir kez çözümlenen `loader`'ın aksine, `stream` değeri yeni veriler geldikçe güncellenmeye devam edebilen bir sinyal döndürür.

Bir HTTP uç noktasından veri almak gibi tek seferlik asenkron işlemler için `loader` kullanın.

```typescript
const userUpdates = signal({value: 'Alice'});

const userResource = resource({
  stream: () => userUpdates,
});

// Daha sonra, yeni veri geldiğinde:
userUpdates.set({value: 'Bob'});
```

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
| `'reloading'` | Previous value    | The loader is running as a result of calling the resource's `reload` method. |
| `'resolved'`  | Resolved value    | The loader has completed.                                                    |
| `'local'`     | Locally set value | The resource's value has been set locally via `.set()` or `.update()`        |

Bu durum bilgisini, yükleme göstergeleri ve hata mesajları gibi kullanıcı arayüzü öğelerini koşullu olarak görüntülemek için kullanabilirsiniz.

## SSR ile `resource` verilerini önbelleğe alma

Bir uygulama sunucuda işlendiğinde, ilk HTML'i üretmek için bir kaynak yükleyicisi bir kez çalışır. Hidrasyon sırasında tarayıcı normalde aynı yükleyiciyi yeniden çalıştırır.

Sunucu sonucunu yeniden kullanmak için kaynak için bir `id` sağlayın. Angular, çözümlenen değeri sunucuda `TransferState` içinde saklar ve kaynağı istemcide `'resolved'` durumunda başlatmak için kullanır.

```ts
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
  id: 'user-unique-id',
});
```

`id` değeri, Angular'ın önbelleğe alınmış girişi onu isteyen kaynakla eşleştirebilmesi için uygulamanız içinde benzersiz ve sunucu ile istemcide aynı olmalıdır.

IMPORTANT: Önbelleğe alınan değer sayfanın HTML'ine serileştirildiğinden, sunucu tarafı işlemeyi tetikleyen kullanıcıya özgü veri yükleyen kaynaklarda `id` ayarlamaktan kaçının, özellikle işlenen HTML önbelleğe alınabiliyorsa veya kullanıcılar arasında paylaşılabiliyorsa.

## Resource'ları zincirleme {#chaining-resources}

Bazen bir kaynak başka bir kaynağın sonucuna bağlıdır. Bu bağımlılığı `params` bağlam nesnesinde bulunan `chain` fonksiyonunu kullanarak ifade edebilirsiniz.

```typescript
import {resource} from '@angular/core';

const userResource = resource({
  params: () => ({id: getUserId()}),
  loader: ({params}) => fetchUser(params),
});

const companyResource = resource({
  params: ({chain}) => chain(userResource)?.companyId,
  loader: ({params: companyId}) => fetchCompany(companyId),
});
```

Burada `companyResource`, yalnızca `userResource` yüklendikten sonra bilinen kullanıcının `companyId` değerine bağlıdır. `chain(userResource)`, `userResource`'un değerini okur ve durumunu otomatik olarak `companyResource`'a yayar:

- `userResource` **idle** ise, `companyResource` da `idle` olur.
- `userResource` **loading** veya **reloading** ise, `companyResource` `loading` durumuna geçer ve yükleyicisi çalışmaz. `reloading` sırasında `chain`'in önceden çözümlenmiş değeri döndürmediğini unutmayın.
- `userResource` bir **error** durumundaysa, `companyResource` da `error` durumuna geçer.
- `userResource` **resolved** veya **local** ise, `chain` onun güncel değerini döndürür ve `companyResource` bunu kendi params değeri olarak kullanır.

`chain`, `userResource`'tan bir durum yaydığında (`idle`, `loading`, `reloading` veya `error`), params fonksiyonu devam etmez. `userResource` `resolved` veya `local` olduğunda, `chain` onun değerini döndürür ve bu değerin kendisi `undefined` olabilir. Örnek bunu `chain(userResource)?.companyId` ile ele alır; böylece `undefined` bir değer `undefined` params'a yol açar ve `companyResource` `idle` olur.

NOTE: Zincirlenmiş değeri bir nesneye sarmak yerine doğrudan params değeri olarak iletin. `{companyId: undefined}` gibi bir params değeri yine de tanımlı bir değerdir, bu nedenle yükleyici kaynak `idle` olmak yerine `undefined` bir `companyId` ile çalışır.

### Zincirleme ile resource değerlerini doğrudan okuma karşılaştırması

Bir kaynağın değerini doğrudan `params` içinde okumak isteyebilirsiniz:

```typescript {avoid, header: 'durum yayılımı olmadan value() değerini doğrudan okur'}
const companyResource = resource({
  params: () => {
    const user = userResource.value(); // undefined olabilir
    return user ? {companyId: user.companyId} : undefined;
  },
  loader: ({params}) => fetchCompany(params.companyId),
});
```

Bu işe yarasa da, `params`'tan `undefined` döndürmek kaynağı, yukarı akış kaynağının gerçek durumunu yansıtmak yerine `idle` durumuna geçirir. `chain` kullanımı tercih edilir çünkü `loading` ve `error` durumlarını doğru şekilde yansıtır.

`chain`'e yalnızca aşağı akış kaynağı, yukarı akış değerine bağlı kendi asenkron işini gerçekleştirdiğinde başvurun. Bir kaynaktan yalnızca senkron olarak bir değer türetmeniz gerekiyorsa, bunun yerine `computed` kullanın.

## `httpResource` ile reaktif veri çekme

[`httpResource`](/guide/http/http-resource), `HttpClient` etrafında size istek durumunu ve yanıtı sinyal olarak veren bir sarmalayıcıdır. Yakalayıcılar dahil Angular HTTP yığını aracılığıyla HTTP istekleri yapar.

## Snapshot'lar ile Resource bileşimi {#resource-composition-with-snapshots}

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

@Component({/*... */})
export class AwesomeProfile {
  userId = input.required<number>();
  user = withPreviousValue(httpResource(() => `/user/${this.userId()}`));
  // userId değiştiğinde, user.value() yeni veri yüklenene kadar eski kullanıcı verisini korur
}
```
