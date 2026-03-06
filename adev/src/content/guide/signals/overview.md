<docs-decorative-header title="Angular Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Angular Signals, durumunuzun uygulamanız genelinde nasıl ve nerede kullanıldığını ayrıntılı olarak izleyen, çerçevenin render güncellemelerini optimize etmesine olanak tanıyan bir sistemdir.
</docs-decorative-header>

TIP: Bu kapsamlı kılavuza dalmadan önce Angular'ın [Temel Bilgiler](essentials/signals) bölümüne göz atın.

## Sinyaller nedir?

Bir **sinyal**, ilgili tüketicileri değer değiştiğinde bilgilendiren bir değer etrafındaki sarmalayıcıdır. Sinyaller, ilkel değerlerden karmaşık veri yapılarına kadar herhangi bir değer içerebilir.

Bir sinyalin değerini, getter fonksiyonunu çağırarak okursunuz ve bu, Angular'ın sinyalin nerede kullanıldığını izlemesine olanak tanır.

Sinyaller _yazılabilir_ veya _salt okunur_ olabilir.

### Writable sinyaller

Yazılabilir sinyaller, değerlerini doğrudan güncellemek için bir API sağlar. Yazılabilir sinyalleri, sinyalin başlangıç değeri ile `signal` fonksiyonunu çağırarak oluşturursunuz:

```ts
const count = signal(0);

// Sinyaller getter fonksiyonlarıdır - çağırarak değerlerini okursunuz.
console.log('The count is: ' + count());
```

Yazılabilir bir sinyalin değerini değiştirmek için doğrudan `.set()` yapabilirsiniz:

```ts
count.set(3);
```

veya önceki değerden yeni bir değer hesaplamak için `.update()` işlemini kullanabilirsiniz:

```ts
// count'u 1 artır.
count.update((value) => value + 1);
```

Yazılabilir sinyaller `WritableSignal` türüne sahiptir.

#### Writable sinyalleri readonly'ye dönüştürme

`WritableSignal`, sinyalin salt okunur bir versiyonunu döndüren bir `asReadonly()` yöntemi sağlar. Bu, bir sinyalin değerini tüketicilere doğrudan değiştirme izni vermeden sunmak istediğinizde kullanışlıdır:

```ts
@Injectable({providedIn: 'root'})
export class CounterState {
  // Private yazılabilir durum
  private readonly _count = signal(0);

  readonly count = this._count.asReadonly(); // public salt okunur

  increment() {
    this._count.update((v) => v + 1);
  }
}

@Component({
  /* ... */
})
export class AwesomeCounter {
  state = inject(CounterState);

  count = this.state.count; // okuyabilir ama değiştiremez

  increment() {
    this.state.increment();
  }
}
```

Salt okunur sinyal, orijinal yazılabilir sinyalde yapılan değişiklikleri yansıtır, ancak `set()` veya `update()` yöntemleri kullanılarak değiştirilemez.

IMPORTANT: Salt okunur sinyallerin, değerlerinin derin değişikliğini önleyecek herhangi bir yerleşik mekanizması **yoktur**.

### Computed sinyaller

**Hesaplanmış sinyaller**, değerlerini diğer sinyallerden türeten salt okunur sinyallerdir. Hesaplanmış sinyalleri `computed` fonksiyonunu kullanarak ve bir türetme belirterek tanımlarsınız:

```typescript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```

`doubleCount` sinyali `count` sinyaline bağlıdır. `count` her güncellendiğinde Angular, `doubleCount`'un da güncellenmesi gerektiğini bilir.

#### Computed sinyaller lazy değerlendirilir ve memoize edilir

`doubleCount`'un türetme fonksiyonu, `doubleCount`'u ilk kez okuyana kadar değerini hesaplamak için çalışmaz. Hesaplanan değer daha sonra önbelleğe alınır ve `doubleCount`'u tekrar okursanız, yeniden hesaplama yapmadan önbelleğe alınmış değeri döndürür.

Daha sonra `count`'u değiştirirseniz, Angular `doubleCount`'un önbelleğe alınmış değerinin artık geçerli olmadığını bilir ve `doubleCount`'u bir sonraki okuduğunuzda yeni değeri hesaplanır.

Sonuç olarak, hesaplanmış sinyallerde dizi filtreleme gibi hesaplama açısından maliyetli türetmeleri güvenle gerçekleştirebilirsiniz.

#### Computed sinyaller writable değildir

Hesaplanmış bir sinyale doğrudan değer atayamazsınız. Yani,

```ts
doubleCount.set(3);
```

`doubleCount` bir `WritableSignal` olmadığından derleme hatası üretir.

#### Computed sinyal bağımlılıkları dinamiktir

Yalnızca türetme sırasında gerçekten okunan sinyaller izlenir. Örneğin, bu `computed`'da `count` sinyali yalnızca `showCount` sinyali true ise okunur:

```ts
const showCount = signal(false);
const count = signal(0);
const conditionalCount = computed(() => {
  if (showCount()) {
    return `The count is ${count()}.`;
  } else {
    return 'Nothing to see here!';
  }
});
```

`conditionalCount`'u okuduğunuzda, `showCount` `false` ise `count` sinyali okunmadan "Nothing to see here!" mesajı döndürülür. Bu, daha sonra `count`'u güncellerseniz `conditionalCount`'un yeniden hesaplanmasına _neden olmayacağı_ anlamına gelir.

`showCount`'u `true` olarak ayarlar ve ardından `conditionalCount`'u tekrar okursanız, türetme yeniden yürütülür ve `showCount`'un `true` olduğu dalı alarak `count`'un değerini gösteren mesajı döndürür. `count`'u değiştirmek artık `conditionalCount`'un önbelleğe alınmış değerini geçersiz kılar.

Bağımlılıkların bir türetme sırasında eklenebileceği gibi kaldırılabileceğini de unutmayın. Daha sonra `showCount`'u tekrar `false` olarak ayarlarsanız, `count` artık `conditionalCount`'un bir bağımlılığı olarak değerlendirilmez.

## Reactive context'ler

Bir **reaktif bağlam**, Angular'ın bir bağımlılık kurmak için sinyal okumalarını izlediği bir çalışma zamanı durumudur. Sinyali okuyan kod _tüketicidir_ ve okunan sinyal _üreticidir_.

Angular aşağıdaki durumlarda otomatik olarak bir reaktif bağlama girer:

- Bir `effect`, `afterRenderEffect` geri çağrısı yürütürken.
- Bir `computed` sinyali değerlendirilirken.
- Bir `linkedSignal` değerlendirilirken.
- Bir `resource`'un params veya loader fonksiyonu değerlendirilirken.
- Bir bileşen şablonu oluşturulurken ([host özelliğindeki](guide/components/host-elements#host-elemanına-bağlama) bağlamalar dahil).

Bu işlemler sırasında Angular _canlı_ bir bağlantı oluşturur. İzlenen bir sinyal değişirse, Angular _sonunda_ tüketiciyi yeniden çalıştıracaktır.

### Reactive context doğrulama

Angular, kodun bir reaktif bağlam içinde yürütülmediğini doğrulamak için `assertNotInReactiveContext` yardımcı fonksiyonunu sağlar. Doğrulama başarısız olursa hata mesajının doğru API giriş noktasını göstermesi için çağıran fonksiyona bir referans iletin. Bu, genel bir reaktif bağlam hatasından daha net ve eyleme geçirilebilir bir hata mesajı üretir.

```ts
import {assertNotInReactiveContext} from '@angular/core';

function subscribeToEvents() {
  assertNotInReactiveContext(subscribeToEvents);
  // Devam etmek güvenli - subscription mantığı burada
}
```

### Dependency tracking olmadan okuma

Nadiren, `computed` veya `effect` gibi reaktif bir fonksiyon içinde sinyal okuyabilecek kodu bir bağımlılık oluşturmadan yürütmek isteyebilirsiniz.

Örneğin, `currentUser` değiştiğinde bir `counter` değerinin günlüklenmesi gerektiğini varsayalım. Her iki sinyali de okuyan bir `effect` oluşturabilirsiniz:

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${counter()}`);
});
```

Bu örnek, `currentUser` veya `counter` değiştiğinde bir mesaj günlükler. Ancak, effect yalnızca `currentUser` değiştiğinde çalışmalıysa, `counter`'ın okunması yalnızca tesadüfi olup `counter`'daki değişiklikler yeni bir mesaj günlüklememeli.

Bir sinyal okumasının izlenmesini önlemek için getter'ını `untracked` ile çağırabilirsiniz:

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${untracked(counter)}`);
});
```

`untracked` ayrıca bir effect'in bağımlılık olarak değerlendirilmemesi gereken harici kodu çağırması gerektiğinde de kullanışlıdır:

```ts
effect(() => {
  const user = currentUser();
  untracked(() => {
    // `loggingService` sinyal okursa, bu effect'in
    // bağımlılığı olarak sayılmayacaktır.
    this.loggingService.log(`User set to ${user}`);
  });
});
```

### Reactive context ve async işlemler

Reaktif bağlam yalnızca senkron kod için aktiftir. Asenkron bir sınırdan sonra gerçekleşen sinyal okumaları bağımlılık olarak izlenmeyecektir.

```ts {avoid}
effect(async () => {
  const data = await fetchUserData();
  // Reactive context burada kaybolur - theme() izlenmeyecektir
  console.log(`User: ${data.name}, Theme: ${theme()}`);
});
```

Tüm sinyal okumalarının izlenmesini sağlamak için sinyalleri `await`'ten önce okuyun. Bu, beklenen fonksiyona argüman olarak iletmeyi de içerir, çünkü argümanlar senkron olarak değerlendirilir:

```ts {prefer}
effect(async () => {
  const currentTheme = theme(); // await'ten önce oku
  const data = await fetchUserData();
  console.log(`User: ${data.name}, Theme: ${currentTheme}`);
});
```

```ts {prefer}
effect(async () => {
  // Bu da çalışır: sinyal await'ten önce okunur (fonksiyon argümanı olarak)
  await renderContent(docContent());
});
```

## İleri düzey derivation'lar

`computed` basit salt okunur türetmeleri yönetirken, diğer sinyallere bağlı olan yazılabilir bir duruma ihtiyaç duyabilirsiniz.
Daha fazla bilgi için [linkedSignal ile bağımlı durum](/guide/signals/linked-signal) kılavuzuna bakın.

Tüm sinyal API'leri senkrondur-- `signal`, `computed`, `input`, vb. Ancak uygulamalar genellikle asenkron olarak kullanılabilen verilerle uğraşmak zorundadır. Bir `Resource`, asenkron verileri uygulamanızın sinyal tabanlı koduna dahil etmenin ve yine de verilerine senkron olarak erişmenin bir yolunu sunar. Daha fazla bilgi için [Resource'larla asenkron reaktivite](/guide/signals/resource) kılavuzuna bakın.

## Non-reactive API'lerde side effect'leri çalıştırma

Durum değişikliklerine tepki vermek istediğimizde senkron veya asenkron türetmeler önerilir. Ancak bu tüm olası kullanım durumlarını kapsamaz ve bazen kendinizi reaktif olmayan API'lerdeki sinyal değişikliklerine tepki vermeniz gereken bir durumda bulabilirsiniz. Bu özel kullanım durumları için `effect` veya `afterRenderEffect` kullanın. Daha fazla bilgi için [Reaktif olmayan API'ler için yan etkiler](/guide/signals/effect) kılavuzuna bakın.

## `OnPush` bileşenlerinde signal okuma

Bir `OnPush` bileşeninin şablonunda bir sinyal okuduğunuzda, Angular sinyali o bileşenin bir bağımlılığı olarak izler. O sinyalin değeri değiştiğinde, Angular bir sonraki değişiklik algılama çalıştığında güncellendiğinden emin olmak için bileşeni otomatik olarak [işaretler](api/core/ChangeDetectorRef#markforcheck). `OnPush` bileşenleri hakkında daha fazla bilgi için [Bileşen alt ağaçlarını atlama](best-practices/skipping-subtrees) kılavuzuna bakın.

## İleri düzey konular

### Signal equality fonksiyonları

Bir sinyal oluştururken, isteğe bağlı olarak yeni değerin önceki değerden gerçekten farklı olup olmadığını kontrol etmek için kullanılacak bir eşitlik fonksiyonu sağlayabilirsiniz.

```ts
import _ from 'lodash';

const data = signal(['test'], {equal: _.isEqual});

// Bu farklı bir array instance'ı olmasına rağmen, deep equality
// fonksiyonu değerleri eşit kabul edecek ve sinyal
// herhangi bir update tetiklemeyecektir.
data.set(['test']);
```

Eşitlik fonksiyonları hem yazılabilir hem de hesaplanmış sinyallere sağlanabilir.

HELPFUL: Varsayılan olarak, sinyaller referans eşitliğini ([`Object.is()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırması) kullanır.

### Signal type kontrolü

Bir değerin `Signal` olup olmadığını kontrol etmek için `isSignal` kullanabilirsiniz:

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);

isSignal(count); // true
isSignal(doubled); // true
isSignal(42); // false
```

Bir sinyalin özellikle yazılabilir olup olmadığını kontrol etmek için `isWritableSignal` kullanın:

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);

isWritableSignal(count); // true
isWritableSignal(doubled); // false
```

## Sinyalleri RxJS ile kullanma

Sinyaller ve RxJS arasındaki birlikte çalışabilirlik hakkında ayrıntılar için [Angular sinyalleri ile RxJS birlikte çalışma](ecosystem/rxjs-interop) bölümüne bakın.
