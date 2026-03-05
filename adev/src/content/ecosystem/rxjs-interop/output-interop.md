# RxJS interop with component and directive outputs

TIP: Bu kılavuz, [bileşen ve direktif çıktılarına](guide/components/outputs) aşina olduğunuzu varsayar.

`@angular/rxjs-interop` paketi, bileşen ve direktif çıktılarıyla ilgili iki API sunar.

## Creating an output based on an RxJs Observable

`outputFromObservable`, bir RxJS observable'a dayalı olarak yayın yapan bir bileşen veya direktif çıktısı oluşturmanıza olanak tanır:

```ts {highlight:[11]}
import {Directive} from '@angular/core';
import {outputFromObservable} from '@angular/core/rxjs-interop';

@Directive({
  /*...*/
})
class Draggable {
  pointerMoves$: Observable<PointerMovements> = listenToPointerMoves();

  // Whenever `pointerMoves$` emits, the `pointerMove` event fires.
  pointerMove = outputFromObservable(this.pointerMoves$);
}
```

`outputFromObservable` fonksiyonunun Angular derleyicisi için özel bir anlamı vardır. **`outputFromObservable`'ı yalnızca bileşen ve direktif özellik başlatıcılarında çağırabilirsiniz.**

Çıktıya `subscribe` olduğunuzda, Angular aboneliği otomatik olarak temel observable'a yönlendirir. Angular, bileşen veya direktif yok edildiğinde değerleri yönlendirmeyi durdurur.

HELPFUL: Değerleri zorunlu olarak yayabiliyorsanız doğrudan `output()` kullanmayı düşünün.

## Creating an RxJS Observable from a component or directive output

`outputToObservable` fonksiyonu, bir bileşen çıktısından RxJS observable oluşturmanıza olanak tanır.

```ts {highlight:[11]}
import {outputToObservable} from '@angular/core/rxjs-interop';

@Component(/*...*/)
    class CustomSlider {
    valueChange = output<number>();
}

// Instance reference to `CustomSlider`.
const slider: CustomSlider = createSlider();

outputToObservable(slider.valueChange) // Observable<number>
    .pipe(...)
    .subscribe(...);
```

HELPFUL: İhtiyaçlarınızı karşılıyorsa doğrudan `OutputRef` üzerindeki `subscribe` metodunu kullanmayı düşünün.
