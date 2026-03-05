# Dependent state with `linkedSignal`

Angular kodunuzda bir miktar durum tutmak için `signal` fonksiyonunu kullanabilirsiniz. Bazen bu durum başka bir duruma bağlıdır. Örneğin, kullanıcının bir sipariş için kargo yöntemi seçmesine olanak tanıyan bir bileşen düşünün:

```typescript
@Component({
  /* ... */
})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();

  // Select the first shipping option by default.
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

  // Initialize selectedOption to the first shipping option.
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

## Accounting for previous state

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
    // `selectedOption` is set to the `computation` result whenever this `source` changes.
    source: this.shippingOptions,
    computation: (newOptions, previous) => {
      // If the newOptions contain the previously selected option, preserve that selection.
      // Otherwise, default to the first option.
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

## Custom equality comparison

`linkedSignal`, diğer herhangi bir sinyal gibi, özel bir eşitlik fonksiyonu ile yapılandırılabilir. Bu fonksiyon, `linkedSignal`'in değerinin (hesaplama sonucu) değişip değişmediğini belirlemek için alt bağımlılıklar tarafından kullanılır:

```typescript
const activeUser = signal({id: 123, name: 'Morgan', isAdmin: true});

const activeUserEditCopy = linkedSignal(() => activeUser(), {
  // Consider the user as the same if it's the same `id`.
  equal: (a, b) => a.id === b.id,
});

// Or, if separating `source` and `computation`
const activeUserEditCopy = linkedSignal({
  source: activeUser,
  computation: (user) => user,
  equal: (a, b) => a.id === b.id,
});
```
