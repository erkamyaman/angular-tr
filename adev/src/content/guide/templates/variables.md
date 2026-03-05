# Variables in templates

Angular'in sablonlarda iki tur degisken bildirimi vardir: yerel sablon degiskenleri ve sablon referans degiskenleri.

## Local template variables with `@let`

Angular'in `@let` sozdizimi, JavaScript'in [`let` sozdizime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) benzer sekilde yerel bir degisken tanimlmaniza ve sablon genelinde yeniden kullanmaniza olanak tanir.

### Using `@let`

Degeri bir sablon ifadesinin sonucuna dayanan bir degisken bildirmek icin `@let` kullanin. Angular, degiskenin degerini verilen ifadeyle otomatik olarak guncel tutar, [baglamalara](/guide/templates/binding) benzer sekilde.

```angular-html
@let name = user.name;
@let greeting = 'Hello, ' + name;
@let data = data$ | async;
@let pi = 3.14159;
@let coordinates = {x: 50, y: 100};
@let longExpression =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit ' +
  'sed do eiusmod tempor incididunt ut labore et dolore magna ' +
  'Ut enim ad minim veniam...';
```

Her `@let` blogu tam olarak bir degisken bildirebilir. Ayni blokta virgul ile birden fazla degisken bildiremezsiniz.

### Referencing the value of `@let`

`@let` ile bir degisken bildirdikten sonra, ayni sablonda yeniden kullanabilirsiniz:

```angular-html
@let user = user$ | async;

@if (user) {
  <h1>Hello, {{ user.name }}</h1>
  <user-avatar [photo]="user.photo" />

  <ul>
    @for (snack of user.favoriteSnacks; track snack.id) {
      <li>{{ snack.name }}</li>
    }
  </ul>

  <button (click)="update(user)">Update profile</button>
}
```

### Assignability

`@let` ile JavaScript'in `let`'i arasindaki temel fark, `@let`'in bildirimden sonra yeniden atanamayacak olmasidir. Ancak Angular, degiskenin degerini verilen ifadeyle otomatik olarak guncel tutar.

```angular-html
@let value = 1;

<!-- Invalid - This does not work! -->
<button (click)="value = value + 1">Increment the value</button>
```

### Variable scope

`@let` bildirimleri mevcut gorunume ve alt gorunumlerine kapsamlidir. Angular, bilesen sinirlarinda ve kontrol akisi bloklari, `@defer` bloklari veya yapisal direktifler gibi dinamik icerik barindirabilecek her yerde yeni bir gorunum olusturur.

`@let` bildirimleri yukari cekilmez (hoisted), bu nedenle ust gorunumler veya kardesler tarafindan **erisilemez**:

```angular-html
@let topLevel = value;

<div>
  @let insideDiv = value;
</div>

<!-- Valid -->
{{ topLevel }}
<!-- Valid -->
{{ insideDiv }}

@if (condition) {
  <!-- Valid -->
  {{ topLevel + insideDiv }}

  @let nested = value;

  @if (condition) {
    <!-- Valid -->
    {{ topLevel + insideDiv + nested }}
  }
}

<!-- Error, not hoisted from @if -->
{{ nested }}
```

### Full syntax

`@let` sozdizimi resmi olarak su sekilde tanimlanir:

- `@let` anahtar sozcugu.
- Ardindan yeni satirlar icermeyen bir veya daha fazla bosluk.
- Ardindan gecerli bir JavaScript adi ve sifir veya daha fazla bosluk.
- Ardindan `=` simgesi ve sifir veya daha fazla bosluk.
- Ardindan cok satirli olabilen bir Angular ifadesi.
- `;` simgesi ile sonlandirilir.

## Template reference variables

Sablon referans degiskenleri, sablonunuzdaki bir elemandan bir degere referans veren bir degisken bildirmenin bir yolunu saglar.

Bir sablon referans degiskeni asagidakilere referans verebilir:

- sablon icindeki bir DOM elemani ([ozel elemanlar](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) dahil)
- bir Angular bileseni veya direktifi
- bir [ng-template](/api/core/ng-template)'den bir [TemplateRef](/api/core/TemplateRef)

Sablon referans degiskenlerini, sablonun bir bolumundeki bilgiyi ayni sablonun baska bir bolumunde okumak icin kullanabilirsiniz.

### Declaring a template reference variable

Sablondaki bir eleman uzerinde, diyez (`#`) karakteri ile baslayan ve ardindan degisken adinin geldigi bir nitelik ekleyerek bir degisken bildirebilirsiniz.

```angular-html
<!-- Create a template reference variable named "taskInput", referring to the HTMLInputElement. -->
<input #taskInput placeholder="Enter task name" />
```

### Assigning values to template reference variables

Angular, degiskenin bildirildigi elemana gore sablon degiskenlerine bir deger atar.

Degiskeni bir Angular bileseni uzerinde bildirirseniz, degisken bilesen ornegine referans verir.

```angular-html
<!-- The `startDate` variable is assigned the instance of `MyDatepicker`. -->
<my-datepicker #startDate />
```

Degiskeni bir `<ng-template>` elemani uzerinde bildirirseniz, degisken sablonu temsil eden bir TemplateRef ornegine referans verir. Daha fazla bilgi icin [Angular yildiz isareti \* sozdizimini nasil kullanir](/guide/directives/structural-directives#structural-directive-shorthand) bolumune [Yapisal Direktifler](/guide/directives/structural-directives) icinde bakin.

```angular-html
<!-- The `myFragment` variable is assigned the `TemplateRef` instance corresponding to this template fragment. -->
<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```

Degiskeni goruntulenin baska herhangi bir eleman uzerinde bildirirseniz, degisken `HTMLElement` ornegine referans verir.

```angular-html
<!-- The "taskInput" variable refers to the HTMLInputElement instance. -->
<input #taskInput placeholder="Enter task name" />
```

#### Assigning a reference to an Angular directive

Angular direktifleri, direktifin sablonda referans verilebilecegi bir ad tanimlayan `exportAs` ozelligine sahip olabilir:

```angular-ts
@Directive({
  selector: '[dropZone]',
  exportAs: 'dropZone',
})
export class DropZone {
  /* ... */
}
```

Bir eleman uzerinde sablon degiskeni bildirdiginizde, bu `exportAs` adini belirterek degiskene bir direktif ornegi atayabilirsiniz:

```angular-html
<!-- The `firstZone` variable refers to the `DropZone` directive instance. -->
<section dropZone #firstZone="dropZone">...</section>
```

`exportAs` adi belirtmeyen bir direktife referans veremezsiniz.

### Using template reference variables with queries

Sablon degiskenlerini ayni sablonun baska bir bolumundeki degerleri okumak icin kullanmanin yani sira, bu degisken bildirim stilini [bilesen ve direktif sorgulari](/guide/components/queries) icin bir elemani "isaretlemek" amaciyla da kullanabilirsiniz.

Bir sablonda belirli bir elemani sorgulamak istediginizde, o eleman uzerinde bir sablon degiskeni bildirebilir ve ardndan degisken adina gore elemani sorgulayabilirsiniz.

```angular-html
<input #description value="Original description" />
```

```angular-ts
@Component({
  /* ... */,
  template: `<input #description value="Original description">`,
})
export class AppComponent {
  // Query for the input element based on the template variable name.
  @ViewChild('description') input: ElementRef | undefined;
}
```

Sorgular hakkinda daha fazla bilgi icin [Sorgularla alt elemanlara referans verme](/guide/components/queries) bolumune bakin.
