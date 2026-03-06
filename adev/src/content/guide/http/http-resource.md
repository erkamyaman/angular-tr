# `httpResource` ile Reaktif Veri Alma

IMPORTANT: `httpResource` [deneyseldir](reference/releases#deneysel). Denemeniz için hazırdır, ancak kararlı hale gelmeden önce değişebilir.

`httpResource`, `HttpClient` etrafında size istek durumunu ve yanıtı sinyal olarak veren reaktif bir sarmalayıcıdır. Bu sinyalleri `computed`, `effect`, `linkedSignal` veya herhangi bir reaktif API ile kullanabilirsiniz. `HttpClient` üzerine inşa edildiğinden, `httpResource` yakalayıcılar gibi aynı özelliklerin tümünü destekler.

Angular'ın `resource` kalıbı hakkında daha fazla bilgi için [`resource` ile asenkron reaktivite](/guide/signals/resource) bölümüne bakın.

## `httpResource` Kullanımı

TIP: Uygulama sağlayıcılarınıza `provideHttpClient`'ı dahil ettiğinizden emin olun. Ayrıntılar için [HttpClient Kurulumu](/guide/http/setup) bölümüne bakın.

Bir URL döndürerek bir HTTP kaynağı tanımlayabilirsiniz:

```ts
userId = input.required<string>();

user = httpResource(() => `/api/user/${userId()}`); // Argüman olarak reaktif bir fonksiyon
```

`httpResource` reaktiftir, yani bağlı olduğu sinyallerden herhangi biri (örneğin `userId`) değiştiğinde, kaynak yeni bir HTTP isteği gönderecektir.
Zaten bekleyen bir istek varsa, kaynak yeni bir istek göndermeden önce bekleyen isteği iptal eder.

HELPFUL: `httpResource`, isteği _hevesle_ başlatması bakımından `HttpClient`'tan farklıdır. Buna karşılık, `HttpClient` yalnızca döndürülen `Observable`'a abone olunduğunda istekleri başlatır.

Daha gelişmiş istekler için, `HttpClient` tarafından alınan isteğe benzer bir istek nesnesi tanımlayabilirsiniz.
İstek nesnesinin reaktif olması gereken her özelliği bir sinyal ile oluşturulmalıdır.

```ts
user = httpResource(() => ({
  url: `/api/user/${userId()}`,
  method: 'GET',
  headers: {
    'X-Special': 'true',
  },
  params: {
    'fast': 'yes',
  },
  reportProgress: true,
  transferCache: true,
  keepalive: true,
  mode: 'cors',
  redirect: 'error',
  priority: 'high',
  cache: 'force-cache',
  credentials: 'include',
  referrer: 'no-referrer',
  integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GhEXAMPLEKEY=',
  referrerPolicy: 'no-referrer',
}));
```

TIP: `POST` veya `PUT` gibi _değişiklik_ işlemleri için `httpResource` kullanmaktan kaçının. Bunun yerine doğrudan temel `HttpClient` API'lerini kullanmayı tercih edin.

`httpResource`'un sinyalleri, hangi öğelerin görüntüleneceğini kontrol etmek için şablonda kullanılabilir.

```angular-html
@if(user.hasValue()) {
  <user-details [user]="user.value()">
} @else if (user.error()) {
  <div>Could not load user information</div>
} @else if (user.isLoading()) {
  <div>Loading user info...</div>
}
```

HELPFUL: Hata durumundaki bir `resource`'da `value` sinyalini okumak çalışma zamanında hata fırlatır. `value` okumalarını `hasValue()` ile korumak önerilir.

### Response Türleri

Varsayılan olarak, `httpResource` yanıtı JSON olarak döndürür ve ayrıştırır. Ancak, `httpResource` üzerindeki ek fonksiyonlarla alternatif dönüş türleri belirtebilirsiniz:

```ts
httpResource.text(() => ({ … })); // value() içinde bir string döndürür

httpResource.blob(() => ({ … })); // value() içinde bir Blob nesnesi döndürür

httpResource.arrayBuffer(() => ({ … })); // value() içinde bir ArrayBuffer döndürür
```

## Response Ayrıştırma ve Doğrulama

Veri alırken, yanıtları genellikle [Zod](https://zod.dev) veya [Valibot](https://valibot.dev) gibi popüler açık kaynak kütüphaneleri kullanarak önceden tanımlanmış bir şemaya göre doğrulamak isteyebilirsiniz. Doğrulama kütüphanelerini bu şekilde `httpResource` ile bir `parse` seçeneği belirterek entegre edebilirsiniz. `parse` fonksiyonunun dönüş türü, kaynağın `value` türünü belirler.

Aşağıdaki örnek, [StarWars API](https://swapi.info/)'sinden gelen yanıtı ayrıştırmak ve doğrulamak için Zod kullanır. Kaynak daha sonra Zod'un ayrıştırmasının çıktı türü ile aynı şekilde tiplenir.

```ts
const starWarsPersonSchema = z.object({
  name: z.string(),
  height: z.number({coerce: true}),
  edited: z.string().datetime(),
  films: z.array(z.string()),
});

export class CharacterViewer {
  id = signal(1);

  swPersonResource = httpResource(() => `https://swapi.info/api/people/${this.id()}`, {
    parse: starWarsPersonSchema.parse,
  });
}
```

## httpResource'u Test Etme

`httpResource`, `HttpClient` etrafında bir sarmalayıcı olduğundan, `httpResource`'u `HttpClient` ile aynı API'lerle test edebilirsiniz. Ayrıntılar için [HttpClient Testi](/guide/http/testing) bölümüne bakın.

Aşağıdaki örnek, `httpResource` kullanan kod için bir birim testini gösterir.

```ts
TestBed.configureTestingModule({
  providers: [provideHttpClient(), provideHttpClientTesting()],
});

const id = signal(0);
const mockBackend = TestBed.inject(HttpTestingController);
const response = httpResource(() => `/data/${id()}`, {injector: TestBed.inject(Injector)});
TestBed.tick(); // Effect'i tetikler
const firstRequest = mockBackend.expectOne('/data/0');
firstRequest.flush(0);

// Değerlerin httpResource'a yayıldığından emin olur
await TestBed.inject(ApplicationRef).whenStable();

expect(response.value()).toEqual(0);
```
