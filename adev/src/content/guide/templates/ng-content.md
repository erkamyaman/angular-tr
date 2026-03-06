# Üst bileşenden şablonları `ng-content` ile işleme

`<ng-content>`, işaret dili veya şablon parçası kabul eden ve bileşenlerin içeriği nasıl işlediğini kontrol eden özel bir elemandır. DOM'da gerçek bir eleman işlemez.

İşte üst bileşeninden herhangi bir işaret dili kabul eden bir `BaseButton` bileşeni örneği.

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

Daha fazla bilgi için, bu kalıptan başka şekillerde nasıl yararlanabileceğinizi öğrenmek üzere [`<ng-content>` derinlemesine rehberine](/guide/components/content-projection) göz atın.
