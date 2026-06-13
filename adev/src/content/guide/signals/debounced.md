# `debounced` ile sinyalleri geciktirme

IMPORTANT: `debounced` [deneyseldir](reference/releases#deneysel). Denemeniz için hazırdır, ancak kararlı hale gelmeden önce değişebilir.

Bir sinyalin değerine tepki vermeyi, değer değişmeyi durdurana kadar geciktirmek için `debounced` kullanın. Değeri, kaynak sinyalin gecikmeli (debounced) değerini yansıtan bir `Resource` döndürür.

```angular-ts
import {debounced, resource, signal} from '@angular/core';

@Component({
  template: `
    <input (input)="query.set($event.target.value)" />

    @if (results.isLoading()) {
      <p>Aranıyor…</p>
    }
    @for (item of results.value(); track item.id) {
      <li>{{ item.name }}</li>
    }
  `,
})
export class Search {
  query = signal('');

  debouncedQuery = debounced(this.query, 300);

  results = resource({
    params: () => this.debouncedQuery.value(),
    loader: ({params}) => fetchResults(params),
  });
}
```

`debounced`, kaynak sinyali ve milisaniye cinsinden bir bekleme süresini alır. Döndürülen kaynağın `value()` değeri her zaman en son yerleşen (settled) değeri içerir ve `status()` size yeni bir değerin hâlâ beklemede olup olmadığını söyler.

## Gecikme sırasında durum

Gecikme zamanlayıcısı geri sayım yaparken `status()` `'loading'` olur ve `value()` önceden çözümlenmiş değeri döndürür. Zamanlayıcı sona erdiğinde kaynak `'resolved'` durumuna yerleşir. Kaynak sinyal bir hata fırlatırsa, kaynak hiçbir zamanlayıcı çalışmadan anında `'error'` durumuna geçer.

Durumların tam listesi ve `value()` davranışları için [Kaynak durumu](/guide/signals/resource#resource-durumu) bölümüne bakın.

## Özel bekleme fonksiyonu

Milisaniye cinsinden bir süre yerine, `Promise<void>` döndüren bir fonksiyon iletebilirsiniz. Promise çözümlendiğinde kaynak çözümlenir. Promise yerleşmeden önce kaynak sinyal değişirse, Angular önceki promise'i atar ve yenisini başlatır.

```ts
debouncedQuery = debounced(query, (value, lastSnapshot) => {
  // Kullanıcıyı tekrar bekletmek yerine bir hatadan sonra hemen yeniden dene.
  if (lastSnapshot.status === 'error') return;
  // Kısa sorgular daha uzun bir gecikme alır—kullanıcı muhtemelen hâlâ yazıyor.
  const ms = value.length < 3 ? 500 : 200;
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
});
```

Ayrıntılar için API referansındaki `DebounceTimer` tipine bakın.

## Eşitlik

Varsayılan olarak `debounced`, değerleri karşılaştırmak için `Object.is` kullanır.

Varsayılan kimlik kontrolü fazla katı kaldığında, `equal` seçeneğiyle özel bir eşitlik fonksiyonu sağlayın:

```ts
debouncedFilter = debounced(filter, 200, {
  equal: (a, b) => a.category === b.category && a.minPrice === b.minPrice,
});
```

## Enjeksiyon bağlamı

`debounced`, bir [enjeksiyon bağlamı](guide/di/dependency-injection-context) içinde çağrılmalıdır. Angular, enjektör yok edildiğinde gecikmeli kaynağı otomatik olarak yok eder ve bekleyen tüm zamanlayıcıları iptal eder.

`debounced`'i bir enjeksiyon bağlamı dışında kullanmak için, seçenekler aracılığıyla açık bir `Injector` iletin:

```ts
@Service()
export class SearchService {
  private injector = inject(Injector);

  createDebouncedQuery(query: Signal<string>): Resource<string> {
    return debounced(query, 300, {injector: this.injector});
  }
}
```
