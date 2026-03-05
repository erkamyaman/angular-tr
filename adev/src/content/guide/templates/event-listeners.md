# Adding event listeners

Angular, sablonunuzdaki bir elemanda olay dinleyicileri tanimlamayi destekler; bunun icin olay adi parantez icinde belirtilir ve olay her gerceklestiginde calisan bir ifade yazilir.

## Listening to native events

Bir HTML elemanina olay dinleyicileri eklemek istediginizde, olayi parantezlerle (`()`) sararssiniz ve bir dinleyici ifadesi belirtirsiniz.

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

Bu ornekte, `<input>` elemani her `keyup` olayi yayinladiginda Angular `updateField`'i cagirir.

`click`, `keydown`, `mouseover` gibi herhangi bir yerel olay icin dinleyici ekleyebilirsiniz. Daha fazla bilgi icin [MDN'deki elemanlar uzerindeki tum mevcut olaylara](https://developer.mozilla.org/en-US/docs/Web/API/Element#events) goz atin.

## Accessing the event argument

Her sablon olay dinleyicisinde, Angular olay nesnesine referans iceren `$event` adinda bir degisken saglar.

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

## Using key modifiers

Belirli bir tus icin belirli klavye olaylarini yakalamak istediginizde, asagidakine benzer bir kod yazabilirsiniz:

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

Ancak bu yaygin bir senaryo oldugu icin, Angular nokta (`.`) karakterini kullanarak belirli bir tus belirtmenize olanak taniyarak olaylari filtrelemenizi saglar. Boylece kod su sekilde basitlestirilebilir:

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

Ek tus degistiricileri de ekleyebilirsiniz:

```angular-html
<!-- Matches shift and enter -->
<input type="text" (keyup.shift.enter)="updateField($event)" />
```

Angular `alt`, `control`, `meta` ve `shift` degistiricilerini destekler.

Klavye olaylarina baglamak istediginiz tusu veya kodu belirtebilirsiniz. Tus ve kod alanlari, tarayicinin yerel klavye olay nesnesinin bir parcasidir. Varsayilan olarak, olay baglamasi [klavye olaylari icin Tus degerlerini](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_key_values) kullandiginizi varsayar.

Angular ayrica yerlesik bir `code` soneki saglayarak [klavye olaylari icin Kod degerlerini](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_code_values) belirtmenize de olanak tanir.

```angular-html
<!-- Matches alt and left shift -->
<input type="text" (keydown.code.alt.shiftleft)="updateField($event)" />
```

Bu, farkli isletim sistemlerinde klavye olaylarini tutarli bir sekilde islemek icin faydali olabilir. Ornegin, MacOS cihazlarinda Alt tusunu kullanirken, `key` ozelligi tusu zaten Alt tusu tarafindan degistirilmis karaktere gore bildirir. Bu, Alt + S gibi bir kombinasyonun `'ß'` `key` degerini bildirmesi anlamina gelir. Ancak `code` ozelligi, uretilen karakter yerine basilan fiziksel veya sanal butona karsilik gelir.

## Listening on global targets

Global hedef adlari bir olaya onek olarak kullanilabilir. Desteklenen 3 global hedef `window`, `document` ve `body`'dir.

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

## Preventing event default behavior

Olay isleyiciniz yerel tarayici davranisini degistirmesi gerekiyorsa, olay nesnesinin [`preventDefault` yontemini](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) kullanabilirsiniz:

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

Olay isleyicisi ifadesi `false` olarak degerlendirilirse, Angular [yerel olay isleyici niteliklerine](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes#event_handler_attributes) benzer sekilde otomatik olarak `preventDefault()` cagirir. _Her zaman acikca `preventDefault` cagirmayi tercih edin_, cunku bu yaklasim kodun amacini belirgin kilar.

## Extend event handling

Angular'in olay sistemi, `EVENT_MANAGER_PLUGINS` enjeksiyon belirteci ile kaydedilen ozel olay eklentileri araciligiyla genisletilebilir.

### Implementing Event Plugin

Ozel bir olay eklentisi olusturmak icin `EventManagerPlugin` sinifini genisletin ve gerekli yontemleri uygulayin.

```ts
import {Injectable} from '@angular/core';
import {EventManagerPlugin} from '@angular/platform-browser';

@Injectable()
export class DebounceEventPlugin extends EventManagerPlugin {
  constructor() {
    super(document);
  }

  // Define which events this plugin supports
  override supports(eventName: string) {
    return /debounce/.test(eventName);
  }

  // Handle the event registration
  override addEventListener(element: HTMLElement, eventName: string, handler: Function) {
    // Parse the event: e.g., "click.debounce.500"
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

    // Return cleanup function
    return () => {
      clearTimeout(timeoutId);
      element.removeEventListener(event, listener);
    };
  }
}
```

Ozel eklentinizi uygulamanizin saglayicilarina `EVENT_MANAGER_PLUGINS` belirtecini kullanarak kaydedin:

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

Kayit tamamlandiktan sonra, ozel olay sozdizimini sablonlarda ve ayrica `host` ozelligi ile kullanabilirsiniz:

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
