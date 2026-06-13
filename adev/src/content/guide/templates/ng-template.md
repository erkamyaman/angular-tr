# ng-template ile şablon parçaları oluşturma

Yerel [`<template>` elemanından](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) esinlenen `<ng-template>` elemanı, dinamik olarak veya programatik olarak işleyebileceğiniz bir **şablon parçası** -- bir içerik bölümü -- bildirmenize olanak tanır.

## Şablon parçası oluşturma

Herhangi bir bileşen şablonu içinde `<ng-template>` elemanı ile bir şablon parçası oluşturabilirsiniz:

```angular-html
<p>This is a normal element</p>

<ng-template>
  <p>This is a template fragment</p>
</ng-template>
```

Yukarıdaki işlendiğinde, `<ng-template>` elemanının içeriği sayfada işlenmez. Bunun yerine, şablon parçasına bir referans alabilir ve onu dinamik olarak işlemek için kod yazabilirsiniz.

### Parçalar için bağlam bağlama

Şablon parçaları dinamik ifadeler içeren bağlamalar içerebilir:

```angular-ts
@Component({
  /* ... */,
  template: `<ng-template>You've selected {{count}} items.</ng-template>`,
})
export class ItemCounter {
  count: number = 0;
}
```

Bir şablon parçasındaki ifadeler veya ifade blokları, parçanın nerede işlendiğinden bağımsız olarak, parçanın bildirildiği bileşene göre değerlendirilir.

## Şablon parçasına referans alma

Bir şablon parçasına referans almanın üç yolu vardır:

- `<ng-template>` elemanı üzerinde bir [şablon referans değişkeni](/guide/templates/variables#şablon-referans-değişkenleri) bildirerek
- Parçayı [bir bileşen veya direktif sorgusu](/guide/components/queries) ile sorgulayarak
- Doğrudan bir `<ng-template>` elemanına uygulanan bir direktifte parçayı enjekte ederek.

Her üç durumda da parça bir [TemplateRef](/api/core/TemplateRef) nesnesi ile temsil edilir.

### Şablon referans değişkeni ile şablon parçasına referans verme

Aynı şablon dosyasının diğer bölümlerinde o şablon parçasına referans vermek için bir `<ng-template>` elemanına şablon referans değişkeni ekleyebilirsiniz:

```angular-html
<p>This is a normal element</p>

<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```

Daha sonra bu parçaya şablonun herhangi bir yerinde `myFragment` değişkeni aracılığıyla referans verebilirsiniz.

### Sorgularla şablon parçasına referans verme

Herhangi bir [bileşen veya direktif sorgu API'si](/guide/components/queries) kullanarak bir şablon parçasına referans alabilirsiniz.

`TemplateRef` nesnesini doğrudan bir `viewChild` sorgusu kullanarak sorgulayabilirsiniz.

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

Daha sonra bu parçaya bileşen kodunuzda veya bileşenin şablonunda diğer sınıf üyeleri gibi referans verebilirsiniz.

Bir şablon birden fazla parça içeriyorsa, her `<ng-template>` elemanına bir şablon referans değişkeni ekleyerek her parçaya bir ad atayabilir ve bu ada göre parçaları sorgulayabilirsiniz:

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

Yine, bu parçalara bileşen kodunuzda veya bileşenin şablonunda diğer sınıf üyeleri gibi referans verebilirsiniz.

### Şablon parçasını enjekte etme

Bir direktif, doğrudan bir `<ng-template>` elemanına uygulanmışsa `TemplateRef` enjekte edebilir:

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

Daha sonra bu parçaya direktif kodunuzda diğer sınıf üyeleri gibi referans verebilirsiniz.

## Şablon parçasını işleme

Bir şablon parçasının `TemplateRef` nesnesine referansınız olduğunda, bir parçayı iki yoldan biriyle işleyebilirsiniz: şablonunuzda `NgTemplateOutlet` direktifi ile veya TypeScript kodunuzda `ViewContainerRef` ile.

### `NgTemplateOutlet` kullanma

`@angular/common`'dan gelen `NgTemplateOutlet` direktifi bir `TemplateRef` kabul eder ve parçayı outlet'e sahip elemanın **kardeşi** olarak işler. `NgTemplateOutlet`'ı genellikle bir [`<ng-container>` elemanı](/guide/templates/ng-container) üzerinde kullanmalısınız.

Öncelikle `NgTemplateOutlet`'ı içeri aktarın:

```typescript
import {NgTemplateOutlet} from '@angular/common';
```

Aşağıdaki örnek, bir şablon parçası bildirir ve bu parçayı `NgTemplateOutlet` ile bir `<ng-container>` elemanına işler:

```angular-html
<p>This is a normal element</p>

<ng-template #myFragment>
  <p>This is a fragment</p>
</ng-template>

<ng-container *ngTemplateOutlet="myFragment"></ng-container>
```

Bu örnek şu işlenmiş DOM'u üretir:

```angular-html
<p>This is a normal element</p>
<p>This is a fragment</p>
```

### `ViewContainerRef` kullanma

**Görünüm kapsayıcısı (view container)**, Angular'ın bileşen ağacındaki içerik barındırabilecek bir düğümüdür. Herhangi bir bileşen veya direktif, o bileşen veya direktifin DOM'daki konumuna karşılık gelen bir görünüm kapsayıcısına referans almak için `ViewContainerRef` enjekte edebilir.

Bir şablon parçasını dinamik olarak işlemek için `ViewContainerRef` üzerindeki `createEmbeddedView` yöntemini kullanabilirsiniz. Bir parçayı `ViewContainerRef` ile işlerken, Angular onu `ViewContainerRef`'i enjekte eden bileşen veya direktifin sonraki kardeşi olarak DOM'a ekler.

Aşağıdaki örnek, bir şablon parçasına referansı giriş olarak kabul eden ve bir buton tıklamasında parçayı DOM'a işleyen bir bileşeni göstermektedir.

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

Yukarıdaki örnekte, "Show" butonuna tıklamak şu çıktıyı üretir:

```angular-html
<component-with-fragment>
  <h2>Component with a fragment>
  <my-outlet>
    <button>Show</button>
  </my-outlet>
  <p>This is the fragment</p>
</component-with-fragment>
```

## Şablon parçası işlerken parametre geçirme

`<ng-template>` ile bir şablon parçası bildirirken, ek olarak parça tarafından kabul edilen parametreler de bildirebilirsiniz. Bir parçayı işlerken, isteğe bağlı olarak bu parametrelere karşılık gelen bir `context` nesnesi geçebilirsiniz. Bu bağlam nesnesindeki verileri, parçanın bildirildiği bileşendeki verilere referans vermenin yanı sıra, bağlama ifadelerinde ve ifade bloklarında kullanabilirsiniz.

Her parametre, bağlam nesnesindeki bir özellik adıyla eşleşen bir değerle `let-` öneki ile yazılır:

```angular-html
<ng-template let-pizzaTopping="topping">
  <p>You selected: {{ pizzaTopping }}</p>
</ng-template>
```

### `NgTemplateOutlet` kullanma {#using-ngtemplateoutlet-with-parameters}

Bir bağlam nesnesini `ngTemplateOutletContext` girişine bağlayabilirsiniz:

```angular-html
<ng-template #myFragment let-pizzaTopping="topping">
  <p>You selected: {{ pizzaTopping }}</p>
</ng-template>

<ng-container [ngTemplateOutlet]="myFragment" [ngTemplateOutletContext]="{topping: 'onion'}" />
```

### `ViewContainerRef` kullanma {#using-viewcontainerref-with-parameters}

Bir bağlam nesnesini `createEmbeddedView`'a ikinci argüman olarak geçebilirsiniz:

```ts
this.viewContainer.createEmbeddedView(this.myFragment, {topping: 'onion'});
```

## Şablon parçalarına enjektör sağlama

Bir şablon parçasını işlediğinizde, enjektör bağlamı **şablonun bildirim konumundan** gelir, işlendiği yerden değil. Özel bir enjektör sağlayarak bu davranışı geçersiz kılabilirsiniz.

### `NgTemplateOutlet` kullanma {#using-ngtemplateoutlet-with-injectors}

`ngTemplateOutletInjector` girişine özel bir `Injector` geçebilirsiniz:

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

#### Outlet'ın enjektörünü devralma

Gömülü görünümün enjektörünü şablonun bildirildiği yerden değil, outlet'ın DOM'daki konumundan devralmasını sağlamak için `ngTemplateOutletInjector`'u `'outlet'` dizgesine ayarlayabilirsiniz.

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

`node` şablonunun her tekrarlayan işlemesi, çevreleyen `<item-component>`'ten enjektörü devralır ve her iç içe düzey üst bileşenine kapsamlı sağlayıcılara erişmesine olanak tanır.

NOTE: Bu, özyinelemeli yapılar veya işlenen şablonun outlet sitesindeki bileşen ağacından sağlayıcılara erişmesi gereken herhangi bir durum için faydalıdır.

### `ViewContainerRef` kullanma {#using-viewcontainerref-with-injectors}

`createEmbeddedView`'daki seçenekler nesnesinin bir parçası olarak özel bir enjektör geçebilirsiniz:

```ts
this.viewContainer.createEmbeddedView(this.myFragment, context, {
  injector: myCustomInjector,
});
```

## Yapısal direktifler

Bir **yapısal direktif**, şu özelliklere sahip herhangi bir direktiftir:

- `TemplateRef` enjekte eder
- `ViewContainerRef` enjekte eder ve enjekte edilen `TemplateRef`'i programatik olarak işler

Angular, yapısal direktifler için özel bir kısa yol sözdizimini destekler. Direktifi bir elemana uygularsanız ve direktifin seçicisine yıldız (`*`) karakteri ile önek eklerseniz, Angular tüm elemanı ve tüm içeriğini bir şablon parçası olarak yorumlar:

```angular-html
<section *myDirective>
  <p>This is a fragment</p>
</section>
```

Bu, şu ifadeye eşdeğerdir:

```angular-html
<ng-template myDirective>
  <section>
    <p>This is a fragment</p>
  </section>
</ng-template>
```

Geliştiriciler genellikle parçaları koşullu olarak işlemek veya parçaları birden fazla kez işlemek için yapısal direktifler kullanır.

Daha fazla bilgi için [Yapısal Direktifler](/guide/directives/structural-directives) konusuna bakın.

## Ek kaynaklar

`ng-template`'in diğer kütüphanelerde nasıl kullanıldığına dair örnekler için şu kaynaklara göz atın:

- [Angular Material'den Sekmeler](https://material.angular.dev/components/tabs/overview) - sekme etkinleştirilene kadar DOM'a hiçbir şey işlenmez
- [Angular Material'den Tablo](https://material.angular.dev/components/table/overview) - geliştiricilerin verileri farklı şekillerde işlemesine olanak tanır
