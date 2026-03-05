# Programmatically rendering components

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okudugunuzu varsayar. Angular'da yeniyseniz once onu okuyun.

Bir bileseni dogrudan sablonda kullanmanin yanisira, bilesenleri programatik olarak dinamik sekilde de render edebilirsiniz. Bu, bir bilesnenin baslangicta bilinmedigi (dolayisiyla sablonda dogrudan referans verilemez) ve bazi kosullara bagli oldugu durumlar icin yararlidir.

Bir bileseni programatik olarak render etmenin iki ana yolu vardir: sablonda `NgComponentOutlet` kullanarak veya TypeScript kodunuzda `ViewContainerRef` kullanarak.

HELPFUL: Tembel yukleme (lazy-loading) kullanim alanlari icin (ornegin agir bir bilesnenin yuklemesini geciktirmek istiyorsaniz), bunun yerine yerlesik [`@defer` ozelligini](/guide/templates/defer) kullanmayi dusunun. `@defer` ozelligi, `@defer` blogu icindeki tum bilesenlerin, direktiflerin ve pipe'larin kodunun otomatik olarak ayri JavaScript parcalarina cikarilmasina ve yalnizca gerektiginde, yapilandirilan tetikleyicilere gore yuklenmesine olanak tanir.

## Using NgComponentOutlet

`NgComponentOutlet`, bir sablonda verilen bileseni dinamik olarak render eden yapisal bir direktiftir.

```angular-ts
@Component({/*...*/})
export class AdminBio { /* ... */ }

@Component({/*...*/})
export class StandardBio { /* ... */ }

@Component({
  ...,
  template: `
    <p>Profile for {{user.name}}</p>
    <ng-container *ngComponentOutlet="getBioComponent()" /> `
})
export class CustomDialog {
  user = input.required<User>();

  getBioComponent() {
    return this.user().isAdmin ? AdminBio : StandardBio;
  }
}
```

### Passing inputs to dynamically rendered components

Dinamik olarak render edilen bilesene `ngComponentOutletInputs` ozelligini kullanarak girdiler iletebilirsiniz. Bu ozellik, anahtarlarin girdi adlari ve degerlerin girdi degerleri oldugu bir nesne kabul eder.

```angular-ts
@Component({
  selector: 'user-greeting',
  template: `
    <div>
      <p>User: {{ username() }}</p>
      <p>Role: {{ role() }}</p>
    </div>
  `,
})
export class UserGreeting {
  username = input.required<string>();
  role = input('guest');
}

@Component({
  selector: 'profile-view',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="greetingComponent; inputs: greetingInputs()" />`,
})
export class ProfileView {
  greetingComponent = UserGreeting;
  greetingInputs = signal({username: 'ngAwesome', role: 'admin'});
}
```

Girdiler, `greetingInputs` sinyali her degistiginde guncellenerek dinamik bileseni ustteki bilesnenin durumuyla senkronize tutar.

### Providing content projection

Dinamik olarak render edilen bilesene yansitilmis icerik iletmek icin `ngComponentOutletContent` kullanin. Bu, dinamik bilesen icerigi goruntulmek icin `<ng-content>` kullandiginda kullanisildir.

```angular-ts
@Component({
  selector: 'card-wrapper',
  template: `
    <div class="card">
      <ng-content />
    </div>
  `,
})
export class CardWrapper {}

@Component({
  imports: [NgComponentOutlet],
  template: `
    <ng-container *ngComponentOutlet="cardComponent; content: cardContent()" />

    <ng-template #contentTemplate>
      <h3>Dynamic Content</h3>
      <p>This content is projected into the card.</p>
    </ng-template>
  `,
})
export class DynamicCard {
  private vcr = inject(ViewContainerRef);
  cardComponent = CardWrapper;

  private contentTemplate = viewChild<TemplateRef<unknown>>('contentTemplate');

  cardContent = computed(() => {
    const template = this.contentTemplate();
    if (!template) return [];
    // Returns an array of projection slots. Each element represents one <ng-content> slot.
    // CardWrapper has one <ng-content>, so we return an array with one element.
    return [this.vcr.createEmbeddedView(template).rootNodes];
  });
}
```

NOTE: Hidrasyon, yerel DOM API'leri ile olusturulmus DOM dugumlerinin yansitilmasini desteklemez. Bu bir [NG0503 hatasi](/errors/NG0503) olusturur. Yansitilmis icerik olusturmak icin Angular API'lerini kullanin veya bilesene `ngSkipHydration` ekleyin.

### Providing injectors

`ngComponentOutletInjector` kullanarak dinamik olarak olusturulan bilesene ozel bir injector saglayabilirsiniz. Bu, bilesene ozgu hizmetler veya yapilandirma saglamak icin kullanisildir.

```angular-ts
export const THEME_DATA = new InjectionToken<string>('THEME_DATA', {
  factory: () => 'light',
});

@Component({
  selector: 'themed-panel',
  template: `<div [class]="theme">...</div>`,
})
export class ThemedPanel {
  theme = inject(THEME_DATA);
}

@Component({
  selector: 'dynamic-panel',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="panelComponent; injector: customInjector" />`,
})
export class DynamicPanel {
  panelComponent = ThemedPanel;

  customInjector = Injector.create({
    providers: [{provide: THEME_DATA, useValue: 'dark'}],
  });
}
```

### Accessing the component instance

Direktifin `exportAs` ozelligini kullanarak dinamik olarak olusturulan bilesnenin ornegine erisebilirsiniz:

```angular-ts
@Component({
  selector: 'counter',
  template: `<p>Count: {{ count() }}</p>`,
})
export class Counter {
  count = signal(0);
  increment() {
    this.count.update((c) => c + 1);
  }
}

@Component({
  imports: [NgComponentOutlet],
  template: `
    <ng-container [ngComponentOutlet]="counterComponent" #outlet="ngComponentOutlet" />

    <button (click)="outlet.componentInstance?.increment()">Increment</button>
  `,
})
export class CounterHost {
  counterComponent = Counter;
}
```

NOTE: `componentInstance` ozelligi, bilesen render edilmeden once `null` degerindedir.

Direktifin yetenekleri hakkinda daha fazla bilgi icin [NgComponentOutlet API referansi](api/common/NgComponentOutlet)'na bakin.

## Using ViewContainerRef

**Gorunum kapsayicisi** (view container), Angular'in bilesen agacinda icerik barindirabilecek bir dugumudur. Herhangi bir bilesen veya direktif, o bilesen veya direktifin DOM'daki konumuna karsilik gelen bir gorunum kapsayicisina referans almak icin `ViewContainerRef` enjekte edebilir.

Bir bileseni dinamik olarak olusturmak ve render etmek icin `ViewContainerRef` uzerindeki `createComponent` yontemini kullanabilirsiniz. `ViewContainerRef` ile yeni bir bilesen olusturdugunda, Angular onu `ViewContainerRef`'i enjekte eden bilesen veya direktifin bir sonraki kardesi olarak DOM'a ekler.

```angular-ts
@Component({
  selector: 'leaf-content',
  template: `This is the leaf content`,
})
export class LeafContent {}

@Component({
  selector: 'outer-container',
  template: `
    <p>This is the start of the outer container</p>
    <inner-item />
    <p>This is the end of the outer container</p>
  `,
})
export class OuterContainer {}

@Component({
  selector: 'inner-item',
  template: `<button (click)="loadContent()">Load content</button>`,
})
export class InnerItem {
  private viewContainer = inject(ViewContainerRef);

  loadContent() {
    this.viewContainer.createComponent(LeafContent);
  }
}
```

Yukaridaki ornekte, "Load content" butonuna tiklamak asagidaki DOM yapisini olusturur:

```angular-html
<outer-container>
  <p>This is the start of the outer container</p>
  <inner-item>
    <button>Load content</button>
  </inner-item>
  <leaf-content>This is the leaf content</leaf-content>
  <p>This is the end of the outer container</p>
</outer-container>
```

## Lazy-loading components

HELPFUL: Bazi bilesenleri tembel yuklemek istiyorsaniz, bunun yerine yerlesik [`@defer` ozelligini](/guide/templates/defer) kullanmayi dusunebilirsiniz.

Kullanim alaniniz `@defer` ozelligi tarafindan karsilanmiyorsa, standart bir JavaScript [dinamik import](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import) ile `NgComponentOutlet` veya `ViewContainerRef` kullanabilirsiniz.

```angular-ts
@Component({
  ...,
  template: `
    <section>
      <h2>Basic settings</h2>
      <basic-settings />
    </section>
    <section>
      <h2>Advanced settings</h2>
      @if(!advancedSettings) {
        <button (click)="loadAdvanced()">
          Load advanced settings
        </button>
      }
      <ng-container *ngComponentOutlet="advancedSettings" />
    </section>
  `
})
export class AdminSettings {
  advancedSettings: {new(): AdvancedSettings} | undefined;

  async loadAdvanced() {
    const { AdvancedSettings } = await import('path/to/advanced_settings.js');
    this.advancedSettings = AdvancedSettings;
  }
}
```

Yukaridaki ornek, bir buton tiklamasi uzerine `AdvancedSettings` bileseni yukler ve goruntler.

## Binding inputs, outputs and setting host directives at creation

Bilesenleri dinamik olarak olustururken, girdileri manuel olarak ayarlamak ve ciktilara abone olmak hataya acik olabilir. Bilesen orneklendikten sonra baglamalari ayarlamak icin genellikle ek kod yazmaniz gerekir.

Bunu basitlestirmek icin, hem `createComponent` hem de `ViewContainerRef.createComponent`, girdileri ve ciktilari onceden yapilandirmak icin `inputBinding()`, `outputBinding()` ve `twoWayBinding()` gibi yardimci fonksiyonlarla birlikte bir `bindings` dizisi iletmeyi destekler. Ayrica herhangi bir host direktifi uygulamak icin bir `directives` dizisi de belirtebilirsiniz. Bu, bilesenleri sablon benzeri baglamalarla tek bir bildirimsel cagri ile programatik olarak olusturmaya olanak tanir.

### Host view using `ViewContainerRef.createComponent`

`ViewContainerRef.createComponent` bir bilesen olusturur ve host gorunumunu ve host elemanini kapsayicinin gorunum hiyerarsisine, kapsayicinin konumunda otomatik olarak ekler. Dinamik bilesnenin kapsayicinin mantiksal ve gorsel yapisinin bir parcasi olmasi gerektiginde bunu kullanin (ornegin liste ogeleri veya satir ici UI ekleme).

Buna karsin, bagimsiz `createComponent` API'si yeni bileseni mevcut hicbir gorunume veya DOM konumuna eklemez -- bir `ComponentRef` dondurur ve bilesnenin host elemanini nereye yerlestireceniz konusunda acik kontrol saglar.

```angular-ts
import {Component, input, model, output} from '@angular/core';

@Component({
  selector: 'app-warning',
  template: `
    @if (isExpanded()) {
      <section>
        <p>Warning: Action needed!</p>
        <button (click)="close.emit(true)">Close</button>
      </section>
    }
  `,
})
export class AppWarning {
  readonly canClose = input.required<boolean>();
  readonly isExpanded = model<boolean>();
  readonly close = output<boolean>();
}
```

```ts
import {
  Component,
  ViewContainerRef,
  signal,
  inputBinding,
  outputBinding,
  twoWayBinding,
  inject,
} from '@angular/core';
import {FocusTrap} from '@angular/cdk/a11y';
import {ThemeDirective} from '../theme.directive';

@Component({
  template: `<ng-container #container />`,
})
export class Host {
  private vcr = inject(ViewContainerRef);
  readonly canClose = signal(true);
  readonly isExpanded = signal(true);

  showWarning() {
    const compRef = this.vcr.createComponent(AppWarning, {
      bindings: [
        inputBinding('canClose', this.canClose),
        twoWayBinding('isExpanded', this.isExpanded),
        outputBinding<boolean>('close', (confirmed) => {
          console.log('Closed with result:', confirmed);
        }),
      ],
      directives: [
        FocusTrap,
        {type: ThemeDirective, bindings: [inputBinding('theme', () => 'warning')]},
      ],
    });
  }
}
```

Yukaridaki ornekte, dinamik **AppWarning** bileseni, `canClose` girdisi reaktif bir sinyale bagli, `isExpanded` durumunda iki yonlu baglama ve `close` icin bir cikti dinleyicisi ile olusturulmustur. `FocusTrap` ve `ThemeDirective`, `directives` araciligiyla host elemanina eklenmistir.

### Popup attached to `document.body` with `createComponent` + `hostElement`

Mevcut gorunum hiyerarsisinin disinda render etme (ornegin katmanlar) icin bunu kullanin. Saglanan `hostElement` bilesnenin DOM'daki host'u olur, dolayisiyla Angular seciciyle eslesen yeni bir eleman olusturmaz. **Baglamalari** dogrudan yapilandirmaniza olanak tanir.

```ts
import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  inputBinding,
  outputBinding,
} from '@angular/core';
import {Popup} from './popup';

@Injectable({providedIn: 'root'})
export class PopupService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);

  show(message: string) {
    // Create a host element for the popup
    const host = document.createElement('popup-host');

    // Create the component and bind in one call
    const ref = createComponent(Popup, {
      environmentInjector: this.injector,
      hostElement: host,
      bindings: [
        inputBinding('message', () => message),
        outputBinding('closed', () => {
          document.body.removeChild(host);
          this.appRef.detachView(ref.hostView);
          ref.destroy();
        }),
      ],
    });

    // Registers the component's view so it participates in change detection cycle.
    this.appRef.attachView(ref.hostView);
    // Inserts the provided host element into the DOM (outside the normal Angular view hierarchy).
    // This is what makes the popup visible on screen, typically used for overlays or modals.
    document.body.appendChild(host);
  }
}
```
