# Design patterns for AI SDKs and signal APIs

Yapay zeka ve Büyük Dil Modeli (LLM) API'leri ile etkileşim, asenkron işlemleri yönetme, akış verilerini işleme ve potansiyel olarak yavaş veya güvenilmez ağ istekleri için duyarlı bir kullanıcı deneyimi tasarlama gibi benzersiz zorluklar ortaya çıkarır. Angular [sinyalleri](guide/signals) ve [`resource`](guide/signals/resource) API'si, bu sorunları zarif bir şekilde çözmek için güçlü araçlar sağlar.

## Triggering requests with signals

Kullanıcı tarafından sağlanan promptlarla çalışırken yaygın bir desen, kullanıcının canlı girdisini API çağrısını tetikleyen gönderilmiş değerden ayırmaktır.

1. Kullanıcı yazarken ham girdisini bir sinyalde saklayın
2. Kullanıcı gönderdiğinde (örneğin bir düğmeye tıklayarak), ikinci bir sinyali birinci sinyalin içeriğiyle güncelleyin.
3. İkinci sinyali `resource`'unuzun **`params`** alanında kullanın.

Bu kurulum, resource'un **`loader`** fonksiyonunun her tuş vuruşunda değil, yalnızca kullanıcı promptunu açıkça gönderdiğinde çalışmasını sağlar. `loader` alanında `sessionId` veya `userId` gibi ek sinyal parametreleri kullanabilirsiniz (bunlar kalıcı LLM oturumları oluşturmak için yararlı olabilir). Bu şekilde, istek her zaman bu parametrelerin güncel değerlerini kullanır ve `loader` alanında tanımlanan asenkron fonksiyonu yeniden tetiklemez.

Birçok yapay zeka SDK'sı, API çağrıları yapmak için yardımcı yöntemler sağlar. Örneğin, Genkit istemci kütüphanesi, Genkit flow'larını çağırmak için bir `runFlow` yöntemi sunar ve bunu bir resource'un `loader`'ından çağırabilirsiniz. Diğer API'ler için [`httpResource`](guide/signals/resource#httpresource-ile-reaktif-veri-çekme) kullanabilirsiniz.

Aşağıdaki örnek, yapay zeka tarafından üretilen bir hikayenin bölümlerini getiren bir `resource` gösterir. `loader`, yalnızca `storyInput` sinyali değiştiğinde tetiklenir.

```ts
// A resource that fetches three parts of an AI generated story
storyResource = resource({
  // The default value to use before the first request or on error
  defaultValue: DEFAULT_STORY,
  // The loader is re-triggered when this signal changes
  params: () => this.storyInput(),
  // The async function to fetch data
  loader: ({params}): Promise<StoryData> => {
    // The params value is the current value of the storyInput signal
    const url = this.endpoint();
    return runFlow({
      url,
      input: {
        userInput: params,
        sessionId: this.storyService.sessionId(), // Read from another signal
      },
    });
  },
});
```

## Preparing LLM data for templates

LLM API'lerini yapılandırılmış veri döndürecek şekilde yapılandırabilirsiniz. `resource`'unuzu LLM'den beklenen çıktıyla eşleşecek şekilde güçlü bir şekilde tiplemek, daha iyi tip güvenliği ve düzenleyici otomatik tamamlama sağlar.

Bir resource'tan türetilmiş durumu yönetmek için `computed` sinyali veya `linkedSignal` kullanın. `linkedSignal` [önceki değerlere erişim sağladığından](guide/signals/linked-signal), aşağıdakiler dahil çeşitli yapay zeka ile ilgili kullanım senaryolarına hizmet edebilir:

- sohbet geçmişi oluşturma
- LLM'ler içerik üretirken şablonların görüntülediği verileri koruma veya özelleştirme

Aşağıdaki örnekte, `storyParts`, `storyResource`'tan dönen en son hikaye bölümlerini mevcut hikaye bölümleri dizisine ekleyen bir `linkedSignal`'dir.

```ts
storyParts = linkedSignal<string[], string[]>({
  // The source signal that triggers the computation
  source: () => this.storyResource.value().storyParts,
  // The computation function
  computation: (newStoryParts, previous) => {
    // Get the previous value of this linkedSignal, or an empty array
    const existingStoryParts = previous?.value || [];
    // Return a new array with the old and new parts
    return [...existingStoryParts, ...newStoryParts];
  },
});
```

## Performance and user experience

LLM API'leri, geleneksel, daha deterministik API'lere göre daha yavaş ve hataya daha yatkın olabilir. Performanslı ve kullanıcı dostu bir arayüz oluşturmak için çeşitli Angular özelliklerini kullanabilirsiniz.

- **Kapsamlı Yükleme:** `resource`'u doğrudan verileri kullanan bileşene yerleştirin. Bu, değişiklik algılama döngülerini sınırlamaya yardımcı olur (özellikle zone'suz uygulamalarda) ve uygulamanızın diğer bölümlerini engellemez. Verilerin birden fazla bileşen arasında paylaşılması gerekiyorsa, `resource`'u bir servisten sağlayın.
- **SSR ve Hidrasyon:** İlk sayfa içeriğini hızlı bir şekilde render etmek için Sunucu Tarafı Render (SSR) ile artımlı hidrasyon kullanın. Yapay zeka tarafından üretilen içerik için bir yer tutucu gösterebilir ve bileşen istemcide hidrate olana kadar veri getirmeyi erteleyebilirsiniz.
- **Yükleme Durumu:** İstek devam ederken bir gösterge (örneğin bir döndürücü) göstermek için `resource` `LOADING` [durumunu](guide/signals/resource#resource-durumu) kullanın. Bu durum hem ilk yüklemeleri hem de yeniden yüklemeleri kapsar.
- **Hata Yönetimi ve Yeniden Denemeler:** Kullanıcıların başarısız istekleri yeniden denemesi için basit bir yol olarak `resource` [**`reload()`**](guide/signals/resource#yeniden-yükleme) yöntemini kullanın; yapay zeka tarafından üretilen içeriğe güvenirken bu daha yaygın olabilir.

Aşağıdaki örnek, yükleme ve yeniden deneme işlevselliği ile yapay zeka tarafından üretilen bir görüntüyü dinamik olarak görüntülemek için duyarlı bir kullanıcı arayüzünün nasıl oluşturulacağını gösterir.

```angular-html
<!-- Display a loading spinner while the LLM generates the image -->
@if (imgResource.isLoading()) {
  <div class="img-placeholder">
    <mat-spinner [diameter]="50" />
  </div>
  <!-- Dynamically populates the src attribute with the generated image URL -->
} @else if (imgResource.hasValue()) {
  <img [src]="imgResource.value()" />
  <!-- Provides a retry option if the request fails  -->
} @else {
  <div class="img-placeholder" (click)="imgResource.reload()">
    <mat-icon fontIcon="refresh" />
    <p>Failed to load image. Click to retry.</p>
  </div>
}
```

## AI patterns in action: streaming chat responses

Arayüzler genellikle LLM tabanlı API'lerden gelen kısmi sonuçları, yanıt verileri ulaştıkça kademeli olarak görüntüler. Angular'ın resource API'si, bu tür desenleri desteklemek için yanıtları akış halinde gönderme yeteneği sağlar. `resource`'un `stream` özelliği, bir sinyal değerine zaman içinde güncelleme uygulamak için kullanabileceğiniz bir asenkron fonksiyon kabul eder. Güncellenen sinyal, akış halindeki verileri temsil eder.

```ts
characters = resource({
  stream: async () => {
    const data = signal<ResourceStreamItem<string>>({value: ''});
    // Calls a Genkit streaming flow using the streamFlow method
    // exposed by the Genkit client SDK
    const response = streamFlow({
      url: '/streamCharacters',
      input: 10,
    });

    (async () => {
      for await (const chunk of response.stream) {
        data.update((prev) => {
          if ('value' in prev) {
            return {value: `${prev.value} ${chunk}`};
          } else {
            return {error: chunk as unknown as Error};
          }
        });
      }
    })();

    return data;
  },
});
```

`characters` üyesi asenkron olarak güncellenir ve şablonda görüntülenebilir.

```angular-html
@if (characters.isLoading()) {
  <p>Loading...</p>
} @else if (characters.hasValue()) {
  <p>{{ characters.value() }}</p>
} @else {
  <p>{{ characters.error() }}</p>
}
```

Sunucu tarafında, örneğin `server.ts`'de, tanımlanan uç nokta istemciye akış halinde gönderilecek verileri iletir. Aşağıdaki kod Gemini'yi Genkit framework'ü ile kullanır, ancak bu teknik LLM'lerden akış yanıtlarını destekleyen diğer API'lere de uygulanabilir:

```ts
import {startFlowServer} from '@genkit-ai/express';
import {genkit} from 'genkit/beta';
import {googleAI, gemini20Flash} from '@genkit-ai/googleai';

const ai = genkit({plugins: [googleAI()]});

export const streamCharacters = ai.defineFlow(
  {
    name: 'streamCharacters',
    inputSchema: z.number(),
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  async (count, {sendChunk}) => {
    const {response, stream} = ai.generateStream({
      model: gemini20Flash,
      config: {
        temperature: 1,
      },
      prompt: `Generate ${count} different RPG game characters.`,
    });

    (async () => {
      for await (const chunk of stream) {
        sendChunk(chunk.content[0].text!);
      }
    })();

    return (await response).text;
  },
);

startFlowServer({
  flows: [streamCharacters],
});
```
