# `linkedSignal` ile bağımlı durum

Angular kodunuzda bir miktar durum tutmak için `signal` fonksiyonunu kullanabilirsiniz. Bazen bu durum başka bir duruma bağlıdır. Örneğin, kullanıcının bir sipariş için kargo yöntemi seçmesine olanak tanıyan bir bileşen düşünün:

```typescript
@Component({
  /* ... */
})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();

  // Varsayılan olarak ilk kargo seçeneğini seç.
  selectedOption = signal(this.shippingOptions()[0]);

  changeShipping(newOptionIndex: number) {
    this.selectedOption.set(this.shippingOptions()[newOptionIndex]);
  }
}
```

Bu örnekte, `selectedOption` varsayılan olarak ilk seçenektir, ancak kullanıcı başka bir seçenek seçerse değişir. Fakat `shippingOptions` bir sinyaldir-- değeri değişebilir! `shippingOptions` değişirse, `selectedOption` artık geçerli bir seçenek olmayan bir değer içerebilir.

**`linkedSignal` fonksiyonu, doğası gereği başka bir duruma _bağlı_ olan bir durum tutmak için bir sinyal oluşturmanıza olanak tanır.** Yukarıdaki örneği tekrar ele alırsak, `linkedSignal` `signal`'in yerini alabilir:

```ts
@Component({
  /* ... */
})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();

  // selectedOption'ı ilk kargo seçeneği ile başlat.
  selectedOption = linkedSignal(() => this.shippingOptions()[0]);

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }
}
```

`linkedSignal`, bir temel farkla `signal`'e benzer şekilde çalışır-- varsayılan bir değer iletmek yerine, tıpkı `computed` gibi bir _hesaplama fonksiyonu_ iletirsiniz. Hesaplamanın değeri değiştiğinde, `linkedSignal`'in değeri hesaplama sonucuna dönüşür. Bu, `linkedSignal`'in her zaman geçerli bir değere sahip olmasını sağlamaya yardımcı olur.

Aşağıdaki örnek, bir `linkedSignal`'in değerinin bağlı durumuna göre nasıl değişebildiğini gösterir:

```ts
const shippingOptions = signal(['Ground', 'Air', 'Sea']);
const selectedOption = linkedSignal(() => shippingOptions()[0]);
console.log(selectedOption()); // 'Ground'

selectedOption.set(shippingOptions()[2]);
console.log(selectedOption()); // 'Sea'

shippingOptions.set(['Email', 'Will Call', 'Postal service']);
console.log(selectedOption()); // 'Email'
```

## Önceki durumu dikkate alma

Bazı durumlarda, bir `linkedSignal` için hesaplama, `linkedSignal`'in önceki değerini dikkate almalıdır.

Yukarıdaki örnekte, `shippingOptions` değiştiğinde `selectedOption` her zaman ilk seçeneğe geri döner. Ancak, seçilen seçenek hala listede bir yerdeyse kullanıcının seçimini korumak isteyebilirsiniz. Bunu gerçekleştirmek için ayrı _kaynak_ ve _hesaplama_ ile bir `linkedSignal` oluşturabilirsiniz:

```ts
interface ShippingMethod {
  id: number;
  name: string;
}

@Component({
  /* ... */
})
export class ShippingMethodPicker {
  constructor() {
    this.changeShipping(2);
    this.changeShippingOptions();
    console.log(this.selectedOption()); // {"id":2,"name":"Postal Service"}
  }

  shippingOptions = signal<ShippingMethod[]>([
    {id: 0, name: 'Ground'},
    {id: 1, name: 'Air'},
    {id: 2, name: 'Sea'},
  ]);

  selectedOption = linkedSignal<ShippingMethod[], ShippingMethod>({
    // Bu `source` her değiştiğinde `selectedOption` `computation` sonucuna ayarlanır.
    source: this.shippingOptions,
    computation: (newOptions, previous) => {
      // newOptions daha önce seçilen seçeneği içeriyorsa, bu seçimi koru.
      // Aksi takdirde, ilk seçeneği varsayılan olarak kullan.
      return newOptions.find((opt) => opt.id === previous?.value.id) ?? newOptions[0];
    },
  });

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }

  changeShippingOptions() {
    this.shippingOptions.set([
      {id: 0, name: 'Email'},
      {id: 1, name: 'Sea'},
      {id: 2, name: 'Postal Service'},
    ]);
  }
}
```

Bir `linkedSignal` oluştururken, yalnızca bir hesaplama sağlamak yerine ayrı `source` ve `computation` özelliklerine sahip bir nesne iletebilirsiniz.

`source`, bir `computed` veya bileşen `input`'u gibi herhangi bir sinyal olabilir. `linkedSignal`, `source` değiştiğinde veya `computation` içinde referans verilen herhangi bir sinyal değiştiğinde değerini günceller ve sağlanan `computation`'ın sonucu ile değerini günceller.

`computation`, `source`'un yeni değerini ve bir `previous` nesnesini alan bir fonksiyondur. `previous` nesnesinin iki özelliği vardır-- `previous.source` `source`'un önceki değeridir ve `previous.value` `linkedSignal`'in önceki değeridir. Hesaplamanın yeni sonucuna karar vermek için bu önceki değerleri kullanabilirsiniz.

HELPFUL: `previous` parametresini kullanırken, `linkedSignal`'in jenerik tür argümanlarını açıkça sağlamak gereklidir. İlk jenerik tür `source`'un türüne karşılık gelir ve ikinci jenerik tür `computation`'ın çıktı türünü belirler.

## Özel eşitlik karşılaştırması

`linkedSignal`, diğer herhangi bir sinyal gibi, özel bir eşitlik fonksiyonu ile yapılandırılabilir. Bu fonksiyon, `linkedSignal`'in değerinin (hesaplama sonucu) değişip değişmediğini belirlemek için alt bağımlılıklar tarafından kullanılır:

```typescript
const activeUser = signal({id: 123, name: 'Morgan', isAdmin: true});

const activeUserEditCopy = linkedSignal(() => activeUser(), {
  // Aynı `id`'ye sahipse kullanıcıyı aynı kabul et.
  equal: (a, b) => a.id === b.id,
});

// Veya `source` ve `computation` ayrı kullanılırsa
const activeUserEditCopy = linkedSignal({
  source: activeUser,
  computation: (user) => user,
  equal: (a, b) => a.id === b.id,
});
```

## set işlemini özelleştirme

Bazen bir `linkedSignal`'ın `set` ve `update` işlemlerinin değeri doğrudan güncellemek yerine, gerçeğin kaynağına (source of truth) geri yazmasını isteyebilirsiniz. Bu davranışı, seçeneklere bir `set` fonksiyonu geçirerek özelleştirebilirsiniz.

Özel `set` fonksiyonu iki argüman alır:

1. Atanan yeni değer.
2. `linkedSignal`'ın iç durumunu doğrudan güncellemek için çağırabileceğiniz bir `rawSet` fonksiyonu (varsayılan davranışla eşleşir).

NOTE: `rawSet` kullanmak, `linkedSignal`'ın değerini doğrudan güncellemenize olanak tanır. Bu, hesaplamanın çalışmasını önlemek için yararlı olabilir; örneğin pahalı bir türetme söz konusuysa ve sonucu zaten biliyorsanız.

### Bir source signal'a geri yazma

Sıcaklığı Fahrenheit olarak gösteren ve düzenlenmesine izin veren, ancak gerçeğin kaynağı olarak bir Celsius signal kullanan bir bileşeni düşünün:

```typescript
const tempC = signal(0);
const tempF = linkedSignal(() => (tempC() * 9) / 5 + 32, {
  set: (valF) => tempC.set(((valF - 32) * 5) / 9),
});

console.log(tempF()); // 32

// Fahrenheit'i ayarlamak Celsius'u günceller, bu da reaktif olarak Fahrenheit'i günceller
tempF.set(212);
console.log(tempC()); // 100
console.log(tempF()); // 212
```

### Bir üst nesne içindeki bir özelliği güncelleme

Bir başka yaygın senaryo, bir üst nesne içindeki belirli bir özelliği güncellemektir. Üst nesne bir signal içinde tutulur ve siz iç içe geçmiş bir özelliğe bağlanırsınız:

```typescript
interface Order {
  id: number;
  shippingMethod: string;
}

const order = signal<Order>({
  id: 42,
  shippingMethod: 'Ground',
});

const shippingMethod = linkedSignal(() => order().shippingMethod, {
  set: (newMethod) => {
    // Değişikliği order'a geri yazmak için değişmez (immutable) bir güncelleme yap
    order.update((currentOrder) => ({
      ...currentOrder,
      shippingMethod: newMethod,
    }));
  },
});

console.log(shippingMethod()); // 'Ground'

// shippingMethod'u güncellemek üst order nesnesini günceller
shippingMethod.set('Air');
console.log(order()); // { id: 42, shippingMethod: 'Air' }
console.log(shippingMethod()); // 'Air'
```
