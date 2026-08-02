# DI uygulamada

Bu kılavuz, Angular'da bağımlılık enjeksiyonunun (DI) ek özelliklerini inceler.

NOTE: InjectionToken ve özel sağlayıcıların kapsamlı açıklaması için [bağımlılık sağlayıcılarını tanımlama kılavuzuna](guide/di/defining-dependency-providers#injection-tokenlar) bakın.

## Bileşenin DOM elemanını enjekte etme

Geliştiriciler genellikle bundan kaçınsa da, bazı görsel efektler ve üçüncü taraf araçlar DOM'a doğrudan erişmenizi gerektirir.
Bu gibi durumlarda, bir bileşenin DOM elemanına erişmeniz gerekebilir.

Angular, `ElementRef` token'ını kullanarak bir `@Component` veya `@Directive`'in temel DOM elemanını enjeksiyon yoluyla sunar:

```ts {highlight:[7]}
import {Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private element = inject(ElementRef);

  update() {
    this.element.nativeElement.style.color = 'red';
  }
}
```

## Ana elemanın etiket adını enjekte etme {#inject-the-host-elements-tag-name}

Bir ana elemanın etiket adını almak için, `HOST_TAG_NAME` token'ını kullanarak enjekte edin.

```ts
import {Directive, HOST_TAG_NAME, inject} from '@angular/core';

@Directive({
  selector: '[roleButton]',
})
export class RoleButtonDirective {
  private tagName = inject(HOST_TAG_NAME);

  onAction() {
    switch (this.tagName) {
      case 'button':
        // Buton eylemini işle
        break;
      case 'a':
        // Bağlantı eylemini işle
        break;
      default:
        // Diğer elemanları işle
        break;
    }
  }
}
```

NOTE: Ana elemanın etiket adı olmayabilirse (örneğin `ng-container` veya `ng-template`), enjeksiyonu isteğe bağlı yapın.

## İleri referans ile döngüsel bağımlılıkları çözme {#resolve-circular-dependencies-with-a-forward-reference}

TypeScript'te sınıf bildirimlerinin sırası önemlidir.
Bir sınıfı tanımlamadan önce doğrudan ona referans veremezsiniz.

Bu genellikle bir sorun değildir, özellikle önerilen _dosya başına bir sınıf_ kuralına uyarsanız.
Ancak bazı durumlarda döngüsel referanslar kaçınılmazdır.
Örneğin, 'A' sınıfı 'B' sınıfına ve 'B' sınıfı da 'A' sınıfına referans verdiğinde, birinin önce tanımlanması gerekir.

Angular `forwardRef()` fonksiyonu, Angular'ın daha sonra çözebileceği _dolaylı_ bir referans oluşturur.

Bir sınıfın _kendisine referans vermesi_ gerektiğinde benzer bir sorunla karşılaşırsınız.
Örneğin, `providers` dizisinde.
`providers` dizisi, sınıf tanımından önce görünmesi gereken `@Component()` dekoratör fonksiyonunun bir özelliğidir.
Bu tür döngüsel referanslar `forwardRef` kullanılarak çözülebilir.

```typescript {header: 'app.component.ts', highlight: [4]}
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
```
