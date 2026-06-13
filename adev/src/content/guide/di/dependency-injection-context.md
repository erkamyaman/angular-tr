# Enjeksiyon bağlamı

Bağımlılık enjeksiyonu (DI) sistemi, mevcut enjektörün kullanılabilir olduğu bir çalışma zamanı bağlamına dayanır.

Bu, enjektörlerin yalnızca kodu bu bağlam içinde çalıştırdığınızda çalıştığı anlamına gelir.

Aşağıdaki durumlarda kullanılabilir bir enjeksiyon bağlamınız olur:

- DI sistemi tarafından örneklenen bir sınıfın, örneğin `@Injectable` veya `@Component`, oluşturulması sırasında (`constructor` aracılığıyla).
- Bu tür sınıfların alan başlatıcılarında.
- Bir `Provider` veya `@Injectable` için `useFactory` olarak belirtilen fabrika fonksiyonunda.
- Bir `InjectionToken` için belirtilen `factory` fonksiyonunda.
- Bir enjeksiyon bağlamında çalışan bir yığın çerçevesi içinde.

Bir enjeksiyon bağlamında ne zaman olduğunuzu bilmek, bağımlılıkları almak için [`inject`](api/core/inject) fonksiyonunu kullanmanıza olanak tanır.

NOTE: Sınıf constructor'larında ve alan başlatıcılarında `inject()` kullanmanın temel örnekleri için [genel bakış kılavuzuna](/guide/di#inject-nerede-kullanılabilir) bakın.

## Bağlamdaki yığın çerçevesi

Bazı API'ler bir enjeksiyon bağlamı içinde çalışacak şekilde tasarlanmıştır. Bu, örneğin rota korumaları için geçerlidir. Bu, koruma fonksiyonu içinde servislere erişmek için [`inject`](api/core/inject) kullanmanıza olanak tanır.

İşte `CanActivateFn` için bir örnek

```ts {highlight: [3]}
const canActivateTeam: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
};
```

## Bir enjeksiyon bağlamında çalıştırma

Zaten bir enjeksiyon bağlamında olmadan bir fonksiyonu bir enjeksiyon bağlamı içinde çalıştırmanız gerekiyorsa, `runInInjectionContext` kullanabilirsiniz.
Bu, `EnvironmentInjector` gibi bir enjektöre erişim gerektirir:

```ts {highlight: [9], header:"hero.service.ts"}
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      inject(SomeService); // Enjekte edilen service ile ihtiyacınız olanı yapın
    });
  }
}
```

[`inject`](/api/core/inject)'in yalnızca enjektör istenen token'ı çözebiliyorsa bir örnek döndürdüğünü unutmayın.

## Bağlamı doğrulama

Angular, mevcut bağlamın bir enjeksiyon bağlamı olduğunu doğrulamak ve değilse net bir hata fırlatmak için `assertInInjectionContext` yardımcı fonksiyonunu sağlar. Hata mesajının doğru API giriş noktasına işaret etmesi için çağıran fonksiyona bir referans iletin. Bu, varsayılan genel enjeksiyon hatasından daha net ve uygulanabilir bir mesaj üretir.

```ts
import {ElementRef, assertInInjectionContext, inject} from '@angular/core';

export function injectNativeElement<T extends Element>(): T {
  assertInInjectionContext(injectNativeElement);
  return inject(ElementRef).nativeElement;
}
```

Bu yardımcıyı **bir enjeksiyon bağlamından** (constructor, alan başlatıcı, sağlayıcı fabrikası veya `runInInjectionContext` aracılığıyla çalıştırılan kod) çağırabilirsiniz:

```ts
import {Component, inject} from '@angular/core';
import {injectNativeElement} from './dom-helpers';

@Component({
  /* … */
})
export class PreviewCard {
  readonly hostEl = injectNativeElement<HTMLElement>(); // Alan başlatıcı bir enjeksiyon bağlamında çalışır.

  onAction() {
    const anotherRef = injectNativeElement<HTMLElement>(); // Başarısız: enjeksiyon bağlamı dışında çalışır.
  }
}
```

## Bağlam dışında DI kullanma

Bir enjeksiyon bağlamı dışında [`inject`](api/core/inject) veya `assertInInjectionContext` çağırırsanız, Angular [NG0203 hatasını](/errors/NG0203) fırlatır.
