# Bileşenleri programatik olarak render etme

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okuduğunuzu varsayar. Angular'da yeniyseniz önce onu okuyun.

Bir bileşeni doğrudan şablonda kullanmanın yanı sıra, bileşenleri programatik olarak dinamik şekilde de render edebilirsiniz. Bu, bir bileşenin başlangıçta bilinmediği (dolayısıyla şablonda doğrudan referans verilemez) ve bazı koşullara bağlı olduğu durumlar için yararlıdır.

Bir bileşeni programatik olarak render etmenin iki ana yolu vardır: şablonda `NgComponentOutlet` kullanarak veya TypeScript kodunuzda `ViewContainerRef` kullanarak.

HELPFUL: Tembel yükleme (lazy-loading) kullanım alanları için (örneğin ağır bir bileşenin yüklemesini geciktirmek istiyorsanız), bunun yerine yerleşik [`@defer` özelliğini](/guide/templates/defer) kullanmayı düşünün. `@defer` özelliği, `@defer` bloğu içindeki tüm bileşenlerin, direktiflerin ve pipe'ların kodunun otomatik olarak ayrı JavaScript parçalarına çıkarılmasına ve yalnızca gerektiğinde, yapılandırılan tetikleyicilere göre yüklenmesine olanak tanır.

## NgComponentOutlet kullanımı

`NgComponentOutlet`, bir şablonda verilen bileşeni dinamik olarak render eden yapısal bir direktiftir.

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

### Dinamik olarak render edilen bileşenlere girdi iletme

Dinamik olarak render edilen bileşene `ngComponentOutletInputs` özelliğini kullanarak girdiler iletebilirsiniz. Bu özellik, anahtarların girdi adları ve değerlerin girdi değerleri olduğu bir nesne kabul eder.

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

Girdiler, `greetingInputs` sinyali her değiştiğinde güncellenerek dinamik bileşeni üstteki bileşenin durumuyla senkronize tutar.

### İçerik yansıtma sağlama

Dinamik olarak render edilen bileşene yansıtılmış içerik iletmek için `ngComponentOutletContent` kullanın. Bu, dinamik bileşen içeriği görüntülemek için `<ng-content>` kullandığında kullanışlıdır.

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
    // Yansıtma slotlarının bir dizisini döndürür. Her eleman bir <ng-content> slotunu temsil eder.
    // CardWrapper bir <ng-content>'e sahip, bu yüzden tek elemanlı bir dizi döndürüyoruz.
    return [this.vcr.createEmbeddedView(template).rootNodes];
  });
}
```

NOTE: Hidrasyon, yerel DOM API'leri ile oluşturulmuş DOM düğümlerinin yansıtılmasını desteklemez. Bu bir [NG0503 hatası](/errors/NG0503) oluşturur. Yansıtılmış içerik oluşturmak için Angular API'lerini kullanın veya bileşene `ngSkipHydration` ekleyin.

### Injector'lar sağlama

`ngComponentOutletInjector` kullanarak dinamik olarak oluşturulan bileşene özel bir injector sağlayabilirsiniz. Bu, bileşene özgü hizmetler veya yapılandırma sağlamak için kullanışlıdır.

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

### Bileşen örneğine erişme

Direktifin `exportAs` özelliğini kullanarak dinamik olarak oluşturulan bileşenin örneğine erişebilirsiniz:

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

NOTE: `componentInstance` özelliği, bileşen render edilmeden önce `null` değerindedir.

Direktifin yetenekleri hakkında daha fazla bilgi için [NgComponentOutlet API referansı](api/common/NgComponentOutlet)'na bakın.

## ViewContainerRef kullanımı

**Görünüm kapsayıcısı** (view container), Angular'ın bileşen ağacında içerik barındırabilecek bir düğümdür. Herhangi bir bileşen veya direktif, o bileşen veya direktifin DOM'daki konumuna karşılık gelen bir görünüm kapsayıcısına referans almak için `ViewContainerRef` enjekte edebilir.

Bir bileşeni dinamik olarak oluşturmak ve render etmek için `ViewContainerRef` üzerindeki `createComponent` yöntemini kullanabilirsiniz. `ViewContainerRef` ile yeni bir bileşen oluşturduğunuzda, Angular onu `ViewContainerRef`'i enjekte eden bileşen veya direktifin bir sonraki kardeşi olarak DOM'a ekler.

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

Yukarıdaki örnekte, "Load content" butonuna tıklamak aşağıdaki DOM yapısını oluşturur:

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

## Bileşenleri tembel yükleme

HELPFUL: Bazı bileşenleri tembel yüklemek istiyorsanız, bunun yerine yerleşik [`@defer` özelliğini](/guide/templates/defer) kullanmayı düşünebilirsiniz.

Kullanım alanınız `@defer` özelliği tarafından karşılanmıyorsa, standart bir JavaScript [dinamik import](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import) ile `NgComponentOutlet` veya `ViewContainerRef` kullanabilirsiniz.

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

Yukarıdaki örnek, bir buton tıklaması üzerine `AdvancedSettings` bileşeni yükler ve görüntüler.

## Oluşturma sırasında girdi, çıktı bağlama ve host direktifleri ayarlama

Bileşenleri dinamik olarak oluştururken, girdileri manuel olarak ayarlamak ve çıktılara abone olmak hataya açık olabilir. Bileşen örneklendikten sonra bağlamaları ayarlamak için genellikle ek kod yazmanız gerekir.

Bunu basitleştirmek için, hem `createComponent` hem de `ViewContainerRef.createComponent`, girdileri ve çıktıları önceden yapılandırmak için `inputBinding()`, `outputBinding()` ve `twoWayBinding()` gibi yardımcı fonksiyonlarla birlikte bir `bindings` dizisi iletmeyi destekler. Ayrıca herhangi bir host direktifi uygulamak için bir `directives` dizisi de belirtebilirsiniz. Bu, bileşenleri şablon benzeri bağlamalarla tek bir bildirimsel çağrı ile programatik olarak oluşturmaya olanak tanır.

### `ViewContainerRef.createComponent` ile host görünümü

`ViewContainerRef.createComponent` bir bileşen oluşturur ve host görünümünü ve host elemanını kapsayıcının görünüm hiyerarşisine, kapsayıcının konumunda otomatik olarak ekler. Dinamik bileşenin kapsayıcının mantıksal ve görsel yapısının bir parçası olması gerektiğinde bunu kullanın (örneğin liste öğeleri veya satır içi UI ekleme).

Buna karşın, bağımsız `createComponent` API'si yeni bileşeni mevcut hiçbir görünüme veya DOM konumuna eklemez -- bir `ComponentRef` döndürür ve bileşenin host elemanını nereye yerleştireceğiniz konusunda açık kontrol sağlar.

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

Yukarıdaki örnekte, dinamik **AppWarning** bileşeni, `canClose` girdisi reaktif bir sinyale bağlı, `isExpanded` durumunda iki yönlü bağlama ve `close` için bir çıktı dinleyicisi ile oluşturulmuştur. `FocusTrap` ve `ThemeDirective`, `directives` aracılığıyla host elemanına eklenmiştir.

### `createComponent` + `hostElement` ile `document.body`'ye eklenmiş popup

Mevcut görünüm hiyerarşisinin dışında render etme (örneğin katmanlar) için bunu kullanın. Sağlanan `hostElement` bileşenin DOM'daki host'u olur, dolayısıyla Angular seçiciyle eşleşen yeni bir eleman oluşturmaz. **Bağlamaları** doğrudan yapılandırmanıza olanak tanır.

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
    // Popup için bir host elemanı oluşturun
    const host = document.createElement('popup-host');

    // Bileşeni oluşturun ve tek bir çağrıda bağlayın
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

    // Bileşenin görünümünü kaydederek değişiklik algılama döngüsüne katılmasını sağlayın.
    this.appRef.attachView(ref.hostView);
    // Sağlanan host elemanını DOM'a ekleyin (normal Angular görünüm hiyerarşisinin dışında).
    // Bu, popup'ı ekranda görünür kılan şeydir, tipik olarak katmanlar veya modal'lar için kullanılır.
    document.body.appendChild(host);
  }
}
```
