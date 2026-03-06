# `takeUntilDestroyed` ile abonelik iptali

TIP: Bu kılavuz, [bileşen ve direktif yaşam döngüsüne](guide/components/lifecycle) aşina olduğunuzu varsayar.

`@angular/core/rxjs-interop` paketindeki `takeUntilDestroyed` operatörü, bir bileşen veya direktif yok edildiğinde bir Observable'dan otomatik olarak aboneliği iptal etmenin kısa ve güvenilir bir yolunu sunar. Bu, RxJS abonelikleriyle oluşan yaygın bellek sızıntılarını önler. RxJS [`takeUntil`](https://rxjs.dev/api/operators/takeUntil) operatörüne benzer şekilde çalışır ancak ayrı bir Subject'e ihtiyaç duymaz.

```typescript
import {Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NotificationDispatcher, CustomPopupShower} from './some-shared-project-code';

@Component(/* ... */)
export class UserProfile {
  private dispatcher = inject(NotificationDispatcher);
  private popup = inject(CustomPopupShower);

  constructor() {
    // 'notifications' Observable'ına olan bu abonelik,
    // 'UserProfile' bileşeni yok edildiğinde otomatik olarak iptal edilir.
    const messages: Observable<string> = this.dispatcher.notifications;
    messages.pipe(takeUntilDestroyed()).subscribe((message) => {
      this.popup.show(message);
    });
  }
}
```

`takeUntilDestroyed` operatörü isteğe bağlı tek bir [`DestroyRef`](/api/core/DestroyRef) argümanı kabul eder. Operatör, bileşenin veya direktifin ne zaman yok edildiğini bilmek için `DestroyRef` kullanır. `takeUntilDestroyed`'ı bir [enjeksiyon bağlamında](/guide/di/dependency-injection-context) çağırırken, genellikle bir bileşen veya direktifin constructor'ı, bu argümanı atlayabilirsiniz. Kodunuz `takeUntilDestroyed`'ı bir enjeksiyon bağlamı dışında çağırabiliyorsa, her zaman bir `DestroyRef` sağlayın.

```typescript
@Component(/* ... */)
export class UserProfile {
  private dispatcher = inject(NotificationDispatcher);
  private popup = inject(CustomPopupShower);
  private destroyRef = inject(DestroyRef);

  startListeningToNotifications() {
    // `takeUntilDestroyed`'ı bir enjeksiyon bağlamı dışında çağırıyorsanız
    // her zaman bir `DestroyRef` geçirin.
    const messages: Observable<string> = this.dispatcher.notifications;
    messages.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((message) => {
      this.popup.show(message);
    });
  }
}
```
