# Create template fragments with ng-template

Yerel [`<template>` elemanindann](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) esinlenen `<ng-template>` elemani, dinamik olarak veya programatik olarak isleyebileceginiz bir **sablon parcasi** -- bir icerik bolumu -- bildirmenize olanak tanir.

## Creating a template fragment

Herhangi bir bilesen sablonu icinde `<ng-template>` elemani ile bir sablon parcasi olusturabilirsiniz:

```angular-html
<p>This is a normal element</p>

<ng-template>
  <p>This is a template fragment</p>
</ng-template>
```

Yukaridaki islendiginde, `<ng-template>` elemaninin icerigi sayfada islenmez. Bunun yerine, sablon parcasina bir referans alabilir ve onu dinamik olarak islemek icin kod yazabilirsiniz.

### Binding context for fragments

Sablon parcalari dinamik ifadeler iceren baglamalar icerebilir:

```angular-ts
@Component({
  /* ... */,
  template: `<ng-template>You've selected {{count}} items.</ng-template>`,
})
export class ItemCounter {
  count: number = 0;
}
```

Bir sablon parcasindaki ifadeler veya ifade bloklari, parcanin nerede islendiginden bagimsiz olarak, parcanin bildiirldigi bilesene gore degerlendirilir.

## Getting a reference to a template fragment

Bir sablon parcasina referans almanin uc yolu vardir:

- `<ng-template>` elemani uzerinde bir [sablon referans degiskeni](/guide/templates/variables#template-reference-variables) bildirerek
- Parcayi [bir bilesen veya direktif sorgusu](/guide/components/queries) ile sorgulayarak
- Dogrudan bir `<ng-template>` elemanina uygulanan bir direktifte parcayi enjekte ederek.

Her uc durumda da parca bir [TemplateRef](/api/core/TemplateRef) nesnesi ile temsil edilir.

### Referencing a template fragment with a template reference variable

Ayni sablon dosyasinin diger bolumlerinde o sablon parcasina referans vermek icin bir `<ng-template>` elemanina sablon referans degiskeni ekleyebilirsiniz:

```angular-html
<p>This is a normal element</p>

<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```

Daha sonra bu parcaya sablonun herhangi bir yerinde `myFragment` degiskeni araciligiyla referans verebilirsiniz.

### Referencing a template fragment with queries

Herhangi bir [bilesen veya direktif sorgu API'si](/guide/components/queries) kullanarak bir sablon parcasina referans alabilirsiniz.

`TemplateRef` nesnesini dogrudan bir `viewChild` sorgusu kullanarak sorgulayabilirsiniz.

```angular-ts
@Component({
  /* ... */,
  template: `
    <p>This is a normal element</p>

    <ng-template>
      <p>This is a template fragment</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
  templateRef = viewChild<TemplateRef<unknown>>(TemplateRef);
}
```

Daha sonra bu parcaya bilesen kodunuzda veya bilesenin sablonunda diger sinif uyeleri gibi referans verebilirsiniz.

Bir sablon birden fazla parca iceriyorsa, her `<ng-template>` elemanina bir sablon referans degiskeni ekleyerek her parcaya bir ad atayabilir ve bu ada gore parcalari sorgulayabilirsiniz:

```angular-ts
@Component({
  /* ... */,
  template: `
    <p>This is a normal element</p>

    <ng-template #fragmentOne>
      <p>This is one template fragment</p>
    </ng-template>

    <ng-template #fragmentTwo>
      <p>This is another template fragment</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
    fragmentOne = viewChild<TemplateRef<unknown>>('fragmentOne');
    fragmentTwo = viewChild<TemplateRef<unknown>>('fragmentTwo');
}
```

Yine, bu parcalara bilesen kodunuzda veya bilesenin sablonunda diger sinif uyeleri gibi referans verebilirsiniz.

### Injecting a template fragment

Bir direktif, dogrudan bir `<ng-template>` elemanina uygulanmissa `TemplateRef` enjekte edebilir:

```angular-ts
@Directive({
  selector: '[myDirective]',
})
export class MyDirective {
  private fragment = inject(TemplateRef);
}
```

```angular-html
<ng-template myDirective>
  <p>This is one template fragment</p>
</ng-template>
```

Daha sonra bu parcaya direktif kodunuzda diger sinif uyeleri gibi referans verebilirsiniz.

## Rendering a template fragment

Bir sablon parcasinin `TemplateRef` nesnesine referansiniz olduugunda, bir parcayi iki yoldan biriyle isleyebilirsiniz: sablonunuzda `NgTemplateOutlet` direktifi ile veya TypeScript kodunuzda `ViewContainerRef` ile.

### Using `NgTemplateOutlet`

`@angular/common`'dan gelen `NgTemplateOutlet` direktifi bir `TemplateRef` kabul eder ve parcayi outlet'e sahip elemanin **kardesi** olarak isler. `NgTemplateOutlet`'i genellikle bir [`<ng-container>` elemani](/guide/templates/ng-container) uzerinde kullanmalisiniz.

Oncelikle `NgTemplateOutlet`'i iceri aktarin:

```typescript
import {NgTemplateOutlet} from '@angular/common';
```

Asagidaki ornek, bir sablon parcasi bildirir ve bu parcayi `NgTemplateOutlet` ile bir `<ng-container>` elemanina isler:

```angular-html
<p>This is a normal element</p>

<ng-template #myFragment>
  <p>This is a fragment</p>
</ng-template>

<ng-container *ngTemplateOutlet="myFragment"></ng-container>
```

Bu ornek su islenmis DOM'u uretir:

```angular-html
<p>This is a normal element</p>
<p>This is a fragment</p>
```

### Using `ViewContainerRef`

**Gorunum kapsayicisi (view container)**, Angular'in bilesen agacindaki icerik barindirabilecek bir dugumudur. Herhangi bir bilesen veya direktif, o bilesen veya direktifin DOM'daki konumuna karsilik gelen bir gorunum kapsayicisina referans almak icin `ViewContainerRef` enjekte edebilir.

Bir sablon parcasini dinamik olarak islemek icin `ViewContainerRef` uzerindeki `createEmbeddedView` yontemini kullanabilirsiniz. Bir parcayi `ViewContainerRef` ile islerken, Angular onu `ViewContainerRef`'i enjekte eden bilesen veya direktifin sonraki kardesi olarak DOM'a ekler.

Asagidaki ornek, bir sablon parcasina referansi giris olarak kabul eden ve bir buton tiklamasinda parcayi DOM'a isleyen bir bileseni gostermektedir.

```angular-ts
@Component({
  /* ... */,
  selector: 'component-with-fragment',
  template: `
    <h2>Component with a fragment</h2>
    <ng-template #myFragment>
      <p>This is the fragment</p>
    </ng-template>
    <my-outlet [fragment]="myFragment" />
  `,
})
export class ComponentWithFragment { }

@Component({
  /* ... */,
  selector: 'my-outlet',
  template: `<button (click)="showFragment()">Show</button>`,
})
export class MyOutlet {
  private viewContainer = inject(ViewContainerRef);
  fragment = input<TemplateRef<unknown> | undefined>();

  showFragment() {
    if (this.fragment()) {
      this.viewContainer.createEmbeddedView(this.fragment());
    }
  }
}
```

Yukaridaki ornekte, "Show" butonuna tiklamak su ciktiyi uretir:

```angular-html
<component-with-fragment>
  <h2>Component with a fragment>
  <my-outlet>
    <button>Show</button>
  </my-outlet>
  <p>This is the fragment</p>
</component-with-fragment>
```

## Passing parameters when rendering a template fragment

`<ng-template>` ile bir sablon parcasi bildirirken, ek olarak parca tarafindan kabul edilen parametreler de bildirebilirsiniz. Bir parcayi islerken, istege bagli olarak bu parametrelere karsilik gelen bir `context` nesnesi gecebilirsiniz. Bu baglam nesnesindeki verileri, parcanin bildirildigi bilesendeki verilere referans vermenin yani sira, baglama ifadelerinde ve ifade bloklarinda kullanabilirsiniz.

Her parametre, baglam nesnesindeki bir ozellik adiyla eslesen bir degerle `let-` oneki ile yazilir:

```angular-html
<ng-template let-pizzaTopping="topping">
  <p>You selected: {{ pizzaTopping }}</p>
</ng-template>
```

### Using `NgTemplateOutlet` {#using-ngtemplateoutlet-with-parameters}

Bir baglam nesnesini `ngTemplateOutletContext` girisine baglayabilirsiniz:

```angular-html
<ng-template #myFragment let-pizzaTopping="topping">
  <p>You selected: {{ pizzaTopping }}</p>
</ng-template>

<ng-container [ngTemplateOutlet]="myFragment" [ngTemplateOutletContext]="{topping: 'onion'}" />
```

### Using `ViewContainerRef` {#using-viewcontainerref-with-parameters}

Bir baglam nesnesini `createEmbeddedView`'a ikinci arguman olarak gecebilirsiniz:

```ts
this.viewContainer.createEmbeddedView(this.myFragment, {topping: 'onion'});
```

## Providing injectors to template fragments

Bir sablon parcasini islediginizde, enjektyor baglami **sablonun bildirim konumundan** gelir, islendiigi yerden degil. Ozel bir enjekttor saglayarak bu davranisi geersiz kilabilirsiniz.

### Using `NgTemplateOutlet` {#using-ngtemplateoutlet-with-injectors}

`ngTemplateOutletInjector` girisine ozel bir `Injector` gecebilirsiniz:

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
  selector: 'root',
  imports: [NgTemplateOutlet, ThemedPanel],
  template: `
    <ng-template #myFragment>
      <themed-panel />
    </ng-template>
    <ng-container *ngTemplateOutlet="myFragment; injector: customInjector" />
  `,
})
export class Root {
  customInjector = Injector.create({
    providers: [{provide: THEME_DATA, useValue: 'dark'}],
  });
}
```

#### Inheriting the outlet's injector

Gomulu gorunumun enjektorunu sablonun bildirildiig yerden degil, outlet'in DOM'daki konumundan devralmasini saglamak icin `ngTemplateOutletInjector`'u `'outlet'` dizgesine ayarlayabilirsiniz.

```angular-html
<ng-template #node let-items>
  <item-component>
    @for (child of items; track $index) {
      <ng-container
        *ngTemplateOutlet="node; context: {$implicit: child.children}; injector: 'outlet'"
      />
    }
  </item-component>
</ng-template>

<ng-container *ngTemplateOutlet="node; context: {$implicit: topLevelItems}" />
```

`node` sablonunun her tekrarlayan islemesi, cevreleyen `<item-component>`'ten enjektoru devralir ve her ic ice duzey ust bilesenine kapsamli saglayicilara erismesine olanak tanir.

NOTE: Bu, ozyinelemeli yapilar veya islenen sablonun outlet sitesindeki bilesen agacindan saglayicilara erismesi gereken herhangi bir durum icin faydalidir.

### Using `ViewContainerRef` {#using-viewcontainerref-with-injectors}

`createEmbeddedView`'daki secenekler nesnesinin bir parcasi olarak ozel bir enjekttor gecebilirsiniz:

```ts
this.viewContainer.createEmbeddedView(this.myFragment, context, {
  injector: myCustomInjector,
});
```

## Structural directives

Bir **yapisal direktif**, su ozelliklere sahip herhangi bir direktiftir:

- `TemplateRef` enjekte eder
- `ViewContainerRef` enjekte eder ve enjekte edilen `TemplateRef`'i programatik olarak isler

Angular, yapisal direktifler icin ozel bir kisa yol sozdizimini destekler. Direktifi bir elemana uygularsaniz ve direktifin secicisine yildiz (`*`) karakteri ile onek eklerseniz, Angular tum elemani ve tum icerigini bir sablon parcasi olarak yorumlar:

```angular-html
<section *myDirective>
  <p>This is a fragment</p>
</section>
```

Bu, su ifadeye esdegerdir:

```angular-html
<ng-template myDirective>
  <section>
    <p>This is a fragment</p>
  </section>
</ng-template>
```

Gelistiriciler genellikle parcalari kosullu olarak islemek veya parcalari birden fazla kez islemek icin yapisal direktifler kullanir.

Daha fazla bilgi icin [Yapisal Direktifler](/guide/directives/structural-directives) konusuna bakin.

## Additional resources

`ng-template`'in diger kutuphanelerde nasil kullanildigina dair ornekler icin su kaynaklara goz atin:

- [Angular Material'den Sekmeler](https://material.angular.dev/components/tabs/overview) - sekme etkinlestirilene kadar DOM'a hicbir sey islenmez
- [Angular Material'den Tablo](https://material.angular.dev/components/table/overview) - gelistiricilerin verileri farkli sekillerde islemesine olanak tanir
