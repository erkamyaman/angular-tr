# Olay dinleyicileri ekleme

Angular, şablonunuzdaki bir elemanda olay dinleyicileri tanımlamayı destekler; bunun için olay adı parantez içinde belirtilir ve olay her gerçekleştiğinde çalışan bir ifade yazılır.

## Yerel olayları dinleme

Bir HTML elemanına olay dinleyicileri eklemek istediğinizde, olayı parantezlerle (`()`) sararsınız ve bir dinleyici ifadesi belirtirsiniz.

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField()" />
  `,
  ...
})
export class App{
  updateField(): void {
    console.log('Field is updated!');
  }
}
```

Bu örnekte, `<input>` elemanı her `keyup` olayı yayınladığında Angular `updateField`'ı çağırır.

`click`, `keydown`, `mouseover` gibi herhangi bir yerel olay için dinleyici ekleyebilirsiniz. Daha fazla bilgi için [MDN'deki elemanlar üzerindeki tüm mevcut olaylara](https://developer.mozilla.org/en-US/docs/Web/API/Element#events) göz atın.

## Olay argümanına erişme

Her şablon olay dinleyicisinde, Angular olay nesnesine referans içeren `$event` adında bir değişken sağlar.

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class App {
  updateField(event: KeyboardEvent): void {
    console.log(`The user pressed: ${event.key}`);
  }
}
```

## Tuş değiştiricilerini kullanma

Belirli bir tuş için belirli klavye olaylarını yakalamak istediğinizde, aşağıdakine benzer bir kod yazabilirsiniz:

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class App {
  updateField(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      console.log('The user pressed enter in the text field.');
    }
  }
}
```

Ancak bu yaygın bir senaryo olduğu için, Angular nokta (`.`) karakterini kullanarak belirli bir tuş belirtmenize olanak tanıyarak olayları filtrelemenizi sağlar. Böylece kod şu şekilde basitleştirilebilir:

```angular-ts
@Component({
  template: `
    <input type="text" (keyup.enter)="updateField($event)" />
  `,
  ...
})
export class App{
  updateField(event: KeyboardEvent): void {
    console.log('The user pressed enter in the text field.');
  }
}
```

Ek tuş değiştiricileri de ekleyebilirsiniz:

```angular-html
<!-- Shift ve enter'a eşleşir -->
<input type="text" (keyup.shift.enter)="updateField($event)" />
```

Angular `alt`, `control`, `meta` ve `shift` değiştiricilerini destekler.

Klavye olaylarına bağlamak istediğiniz tuşu veya kodu belirtebilirsiniz. Tuş ve kod alanları, tarayıcının yerel klavye olay nesnesinin bir parçasıdır. Varsayılan olarak, olay bağlaması [klavye olayları için Tuş değerlerini](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_key_values) kullandığınızı varsayar.

Angular ayrıca yerleşik bir `code` soneki sağlayarak [klavye olayları için Kod değerlerini](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_code_values) belirtmenize de olanak tanır.

```angular-html
<!-- Alt ve sol shift'e eşleşir -->
<input type="text" (keydown.code.alt.shiftleft)="updateField($event)" />
```

Bu, farklı işletim sistemlerinde klavye olaylarını tutarlı bir şekilde işlemek için faydalı olabilir. Örneğin, MacOS cihazlarında Alt tuşunu kullanırken, `key` özelliği tuşu zaten Alt tuşu tarafından değiştirilmiş karaktere göre bildirir. Bu, Alt + S gibi bir kombinasyonun `'ß'` `key` değerini bildirmesi anlamına gelir. Ancak `code` özelliği, üretilen karakter yerine basılan fiziksel veya sanal butona karşılık gelir.

## Global hedefleri dinleme

Global hedef adları bir olaya önek olarak kullanılabilir. Desteklenen 3 global hedef `window`, `document` ve `body`'dir.

```angular-ts
@Component({
  /* ... */
  host: {
    'window:click': 'onWindowClick()',
    'document:click': 'onDocumentClick()',
    'body:click': 'onBodyClick()',
  },
})
export class MyView {}
```

## Olayın varsayılan davranışını engelleme

Olay işleyiciniz yerel tarayıcı davranışını değiştirmesi gerekiyorsa, olay nesnesinin [`preventDefault` yöntemini](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) kullanabilirsiniz:

```angular-ts
@Component({
  template: `
    <a href="#overlay" (click)="showOverlay($event)">
  `,
  ...
})
export class App{
  showOverlay(event: PointerEvent): void {
    event.preventDefault();
    console.log('Show overlay without updating the URL!');
  }
}
```

Olay işleyicisi ifadesi `false` olarak değerlendirilirse, Angular [yerel olay işleyici niteliklerine](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes#event_handler_attributes) benzer şekilde otomatik olarak `preventDefault()` çağırır. _Her zaman açıkça `preventDefault` çağırmayı tercih edin_, çünkü bu yaklaşım kodun amacını belirgin kılar.

## Olay işlemeyi genişletme

Angular'ın olay sistemi, `EVENT_MANAGER_PLUGINS` enjeksiyon belirteci ile kaydedilen özel olay eklentileri aracılığıyla genişletilebilir.

### Olay Eklentisi Uygulama

Özel bir olay eklentisi oluşturmak için `EventManagerPlugin` sınıfını genişletin ve gerekli yöntemleri uygulayın.

```ts
import {Injectable} from '@angular/core';
import {EventManagerPlugin} from '@angular/platform-browser';

@Injectable()
export class DebounceEventPlugin extends EventManagerPlugin {
  constructor() {
    super(document);
  }

  // Bu eklentinin hangi olayları desteklediğini tanımla
  override supports(eventName: string) {
    return /debounce/.test(eventName);
  }

  // Olay kaydını işle
  override addEventListener(element: HTMLElement, eventName: string, handler: Function) {
    // Olayı ayrıştır: örn. "click.debounce.500"
    // event: "click", delay: 500
    const [event, method, delay = 300] = eventName.split('.');

    let timeoutId: number;

    const listener = (event: Event) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handler(event);
      }, delay);
    };

    element.addEventListener(event, listener);

    // Temizleme fonksiyonunu döndür
    return () => {
      clearTimeout(timeoutId);
      element.removeEventListener(event, listener);
    };
  }
}
```

Özel eklentinizi uygulamanızın sağlayıcılarına `EVENT_MANAGER_PLUGINS` belirtecini kullanarak kaydedin:

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {EVENT_MANAGER_PLUGINS} from '@angular/platform-browser';
import {App} from './app';
import {DebounceEventPlugin} from './debounce-event-plugin';

bootstrapApplication(App, {
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: DebounceEventPlugin,
      multi: true,
    },
  ],
});
```

Kayıt tamamlandıktan sonra, özel olay sözdizimini şablonlarda ve ayrıca `host` özelliği ile kullanabilirsiniz:

```angular-ts
@Component({
  template: `
    <input
      type="text"
      (input.debounce.500)="onSearch($event.target.value)"
      placeholder="Search..."
    />
  `,
  ...
})
export class Search {
 onSearch(query: string): void {
    console.log('Searching for:', query);
  }
}
```

```ts
@Component({
  ...,
  host: {
    '(click.debounce.500)': 'handleDebouncedClick()',
  },
})
export class AwesomeCard {
  handleDebouncedClick(): void {
   console.log('Debounced click!');
  }
}
```
