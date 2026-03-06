# DI uygulamada

Bu kılavuz, Angular'da bağımlılık enjeksiyonunun ek özelliklerini inceler.

NOTE: InjectionToken ve özel sağlayıcıların kapsamlı açıklaması için [bağımlılık sağlayıcılarını tanımlama kılavuzuna](guide/di/defining-dependency-providers#injection-tokenlar) bakın.

## Bileşenin DOM elemanını enjekte etme

Geliştiriciler bundan kaçınmaya çalışsa da, bazı görsel efektler ve üçüncü taraf araçlar doğrudan DOM erişimi gerektirir.
Sonuç olarak, bir bileşenin DOM elemanına erişmeniz gerekebilir.

Angular, `ElementRef` enjeksiyon token'ını kullanarak bir `@Component` veya `@Directive`'in temel elemanını enjeksiyon yoluyla sunar:

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

## Ana elemanın etiket adını enjekte etme

Bir ana elemanın etiket adına ihtiyaç duyduğunuzda, `HOST_TAG_NAME` token'ını kullanarak enjekte edin.

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

## İleri referans ile döngüsel bağımlılıkları çözme

TypeScript'te sınıf bildirim sırası önemlidir.
Bir sınıf tanımlanmadan önce doğrudan ona referans veremezsiniz.

Bu genellikle bir sorun değildir, özellikle önerilen _dosya başına bir sınıf_ kuralına uyarsanız.
Ancak bazen döngüsel referanslar kaçınılmazdır.
Örneğin, 'A' sınıfı 'B' sınıfına ve 'B' de 'A'ya referans verdiğinde, birinin önce tanımlanması gerekir.

Angular `forwardRef()` fonksiyonu, Angular'ın daha sonra çözebileceği _dolaylı_ bir referans oluşturur.

Bir sınıfın _kendisine referans vermesi_ gerektiğinde benzer bir sorunla karşılaşırsınız.
Örneğin, `providers` dizisinde.
`providers` dizisi, sınıf tanımından önce görünmesi gereken `@Component()` dekoratör fonksiyonunun bir özelliğidir.
Bu tür döngüsel referansları `forwardRef` kullanarak kırabilirsiniz.

```typescript {header: 'app.component.ts', highlight: [4]}
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
```
