# Render templates from a parent component with `ng-content`

`<ng-content>`, isaret dili veya sablon parcasi kabul eden ve bilesenlerin icerigi nasil isledigini kontrol eden ozel bir elemandir. DOM'da gercek bir eleman islemez.

Iste ust bileseninden herhangi bir isaret dili kabul eden bir `BaseButton` bileseni ornegi.

```angular-ts
// ./base-button/base-button.ts
import {Component} from '@angular/core';

@Component({
  selector: 'button[baseButton]',
  template: `<ng-content />`,
})
export class BaseButton {}
```

```angular-ts
// ./app.ts
import {Component} from '@angular/core';
import {BaseButton} from './base-button';

@Component({
  selector: 'app-root',
  imports: [BaseButton],
  template: `<button baseButton>Next <span class="icon arrow-right"></span></button>`,
})
export class App {}
```

Daha fazla bilgi icin, bu kaliptan baska sekillerde nasil yararlanabileceginizi ogrenmek uzere [`<ng-content>` derinlemesine rehberine](/guide/components/content-projection) goz atin.
