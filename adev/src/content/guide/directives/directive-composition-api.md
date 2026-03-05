# Directive composition API

Angular direktifleri, yeniden kullanılabilir davranışları kapsüllemek için harika bir yol sunar -- direktifler bir elemana nitelikler, CSS sınıfları ve olay dinleyicileri uygulayabilir.

_Direktif bileşim API'si_, bileşen TypeScript sınıfı _içinden_ bir bileşenin ana elemanına direktifler uygulamanıza olanak tanır.

## Adding directives to a component

Bir bileşenin dekoratörüne `hostDirectives` özelliği ekleyerek bileşenlere direktifler uygularsınız. Bu tür direktiflere _ana direktifler_ diyoruz.

Bu örnekte, `MenuBehavior` direktifini `AdminMenu`'nun ana elemanına uyguluyoruz. Bu, bir şablonda `<admin-menu>` elemanına `MenuBehavior`'ı uygulamaya benzer şekilde çalışır.

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu {}
```

Framework bir bileşeni render ettiğinde, Angular her ana direktifin de bir örneğini oluşturur. Direktiflerin ana bağlamaları bileşenin ana elemanına uygulanır. Varsayılan olarak, ana direktif girdileri ve çıktıları bileşenin genel API'sinin bir parçası olarak sunulmaz. Daha fazla bilgi için aşağıdaki [Girdiler ve çıktıları dahil etme](#including-inputs-and-outputs) bölümüne bakın.

**Angular, ana direktifleri derleme zamanında statik olarak uygular.** Çalışma zamanında dinamik olarak direktif ekleyemezsiniz.

**`hostDirectives`'de kullanılan direktifler `standalone: false` belirtemez.**

**Angular, `hostDirectives` özelliğinde uygulanan direktiflerin `selector`'ını yok sayar.**

## Including inputs and outputs

Bileşeninize `hostDirectives` uyguladığınızda, ana direktiflerden gelen girdiler ve çıktılar varsayılan olarak bileşeninizin API'sine dahil edilmez. `hostDirectives` içindeki girişi genişleterek girdileri ve çıktıları bileşeninizin API'sine açıkça dahil edebilirsiniz:

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [
    {
      directive: MenuBehavior,
      inputs: ['menuId'],
      outputs: ['menuClosed'],
    },
  ],
})
export class AdminMenu {}
```

Girdileri ve çıktıları açıkça belirterek, `hostDirective` ile bileşenin tüketicileri bunları bir şablonda bağlayabilir:

```angular-html
<admin-menu menuId="top-menu" (menuClosed)="logMenuClosed()"></admin-menu>
```

Ayrıca, bileşeninizin API'sini özelleştirmek için `hostDirective`'den girdileri ve çıktıları takma adlarla kullanabilirsiniz:

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [
    {
      directive: MenuBehavior,
      inputs: ['menuId: id'],
      outputs: ['menuClosed: closed'],
    },
  ],
})
export class AdminMenu {}
```

```angular-html
<admin-menu id="top-menu" (closed)="logMenuClosed()"></admin-menu>
```

## Adding directives to another directive

Bileşenlere ek olarak diğer direktiflere de `hostDirectives` ekleyebilirsiniz. Bu, birden fazla davranışın geçişli olarak birleştirilmesini sağlar.

Aşağıdaki örnekte, `Menu` ve `Tooltip` olmak üzere iki direktif tanımlıyoruz. Ardından bu iki direktifin davranışını `MenuWithTooltip`'te birleştiriyoruz. Son olarak, `MenuWithTooltip`'i `SpecializedMenuWithTooltip`'e uyguluyoruz.

`SpecializedMenuWithTooltip` bir şablonda kullanıldığında, `Menu`, `Tooltip` ve `MenuWithTooltip`'in tümünün örneklerini oluşturur. Bu direktiflerin her birinin ana bağlamaları, `SpecializedMenuWithTooltip`'in ana elemanına uygulanır.

```typescript
@Directive({...})
export class Menu { }

@Directive({...})
export class Tooltip { }

// MenuWithTooltip can compose behaviors from multiple other directives
@Directive({
  hostDirectives: [Tooltip, Menu],
})
export class MenuWithTooltip { }

// CustomWidget can apply the already-composed behaviors from MenuWithTooltip
@Directive({
  hostDirectives: [MenuWithTooltip],
})
export class SpecializedMenuWithTooltip { }
```

## Host directive semantics

### Directive execution order

Ana direktifler, doğrudan bir şablonda kullanılan bileşenler ve direktiflerle aynı yaşam döngüsünden geçer. Ancak, ana direktifler her zaman constructor'larını, yaşam döngüsü kancalarını ve bağlamalarını uygulandıkları bileşen veya direktiften _önce_ yürütür.

Aşağıdaki örnek, bir ana direktifin minimal kullanımını gösterir:

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu {}
```

Buradaki yürütme sırası:

1. `MenuBehavior` örneklendi
2. `AdminMenu` örneklendi
3. `MenuBehavior` girdileri alır (`ngOnInit`)
4. `AdminMenu` girdileri alır (`ngOnInit`)
5. `MenuBehavior` ana bağlamalarını uygular
6. `AdminMenu` ana bağlamalarını uygular

Bu işlem sırası, `hostDirectives` ile bileşenlerin bir ana direktif tarafından belirtilen herhangi bir ana bağlamayı geçersiz kılabileceği anlamına gelir.

Bu işlem sırası, aşağıdaki örnekte gösterildiği gibi iç içe ana direktif zincirlerine de uzanır.

```typescript
@Directive({...})
export class Tooltip { }

@Directive({
  hostDirectives: [Tooltip],
})
export class CustomTooltip { }

@Directive({
  hostDirectives: [CustomTooltip],
})
export class EvenMoreCustomTooltip { }
```

Yukarıdaki örnekte yürütme sırası:

1. `Tooltip` örneklendi
2. `CustomTooltip` örneklendi
3. `EvenMoreCustomTooltip` örneklendi
4. `Tooltip` girdileri alır (`ngOnInit`)
5. `CustomTooltip` girdileri alır (`ngOnInit`)
6. `EvenMoreCustomTooltip` girdileri alır (`ngOnInit`)
7. `Tooltip` ana bağlamalarını uygular
8. `CustomTooltip` ana bağlamalarını uygular
9. `EvenMoreCustomTooltip` ana bağlamalarını uygular

### Dependency injection

`hostDirectives` belirten bir bileşen veya direktif, bu ana direktiflerin örneklerini enjekte edebilir ve tersi de geçerlidir.

Bir bileşene ana direktifler uygulanırken, hem bileşen hem de ana direktifler sağlayıcılar tanımlayabilir.

`hostDirectives` ile bir bileşen veya direktif ve bu ana direktifler aynı enjeksiyon token'ını sağlıyorsa, `hostDirectives` ile sınıf tarafından tanımlanan sağlayıcılar, ana direktifler tarafından tanımlanan sağlayıcılara göre öncelik kazanır.
