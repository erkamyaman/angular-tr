# Şablonlarda değişkenler

Angular'ın şablonlarda iki tür değişken bildirimi vardır: yerel şablon değişkenleri ve şablon referans değişkenleri.

## `@let` ile yerel şablon değişkenleri

Angular'ın `@let` sözdizimi, JavaScript'in [`let` sözdizimine](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) benzer şekilde yerel bir değişken tanımlamanıza ve şablon genelinde yeniden kullanmanıza olanak tanır.

### `@let` kullanma

Değeri bir şablon ifadesinin sonucuna dayanan bir değişken bildirmek için `@let` kullanın. Angular, değişkenin değerini verilen ifadeyle otomatik olarak güncel tutar, [bağlamalara](/guide/templates/binding) benzer şekilde.

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

Her `@let` bloğu tam olarak bir değişken bildirebilir. Aynı blokta virgül ile birden fazla değişken bildiremezsiniz.

### `@let` değerine referans verme

`@let` ile bir değişken bildirdikten sonra, aynı şablonda yeniden kullanabilirsiniz:

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

### Atanabilirlik

`@let` ile JavaScript'in `let`'i arasındaki temel fark, `@let`'in bildirimden sonra yeniden atanamayacak olmasıdır. Ancak Angular, değişkenin değerini verilen ifadeyle otomatik olarak güncel tutar.

```angular-html
@let value = 1;

<!-- Geçersiz - Bu çalışmaz! -->
<button (click)="value = value + 1">Increment the value</button>
```

### Değişken kapsamı

`@let` bildirimleri mevcut görünüme ve alt görünümlerine kapsamlıdır. Angular, bileşen sınırlarında ve kontrol akışı blokları, `@defer` blokları veya yapısal direktifler gibi dinamik içerik barındırabilecek her yerde yeni bir görünüm oluşturur.

`@let` bildirimleri yukarı çekilmez (hoisted), bu nedenle üst görünümler veya kardeşler tarafından **erişilemez**:

```angular-html
@let topLevel = value;

<div>
  @let insideDiv = value;
</div>

<!-- Geçerli -->
{{ topLevel }}
<!-- Geçerli -->
{{ insideDiv }}

@if (condition) {
  <!-- Geçerli -->
  {{ topLevel + insideDiv }}

  @let nested = value;

  @if (condition) {
    <!-- Geçerli -->
    {{ topLevel + insideDiv + nested }}
  }
}

<!-- Hata, @if'ten yukarı çekilmez -->
{{ nested }}
```

### Tam sözdizimi

`@let` sözdizimi resmi olarak şu şekilde tanımlanır:

- `@let` anahtar sözcüğü.
- Ardından yeni satırlar içermeyen bir veya daha fazla boşluk.
- Ardından geçerli bir JavaScript adı ve sıfır veya daha fazla boşluk.
- Ardından `=` simgesi ve sıfır veya daha fazla boşluk.
- Ardından çok satırlı olabilen bir Angular ifadesi.
- `;` simgesi ile sonlandırılır.

## Şablon referans değişkenleri

Şablon referans değişkenleri, şablonunuzdaki bir elemandan bir değere referans veren bir değişken bildirmenin bir yolunu sağlar.

Bir şablon referans değişkeni aşağıdakilere referans verebilir:

- şablon içindeki bir DOM elemanı ([özel elemanlar](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements) dahil)
- bir Angular bileşeni veya direktifi
- bir [ng-template](/api/core/ng-template)'den bir [TemplateRef](/api/core/TemplateRef)

Şablon referans değişkenlerini, şablonun bir bölümündeki bilgiyi aynı şablonun başka bir bölümünde okumak için kullanabilirsiniz.

### Şablon referans değişkeni bildirme

Şablondaki bir eleman üzerinde, diyez (`#`) karakteri ile başlayan ve ardından değişken adının geldiği bir nitelik ekleyerek bir değişken bildirebilirsiniz.

```angular-html
<!-- HTMLInputElement'e referans veren "taskInput" adında bir şablon referans değişkeni oluştur. -->
<input #taskInput placeholder="Enter task name" />
```

### Şablon referans değişkenlerine değer atama

Angular, değişkenin bildirildiği elemana göre şablon değişkenlerine bir değer atar.

Değişkeni bir Angular bileşeni üzerinde bildirirseniz, değişken bileşen örneğine referans verir.

```angular-html
<!-- `startDate` değişkeni `MyDatepicker` örneğine atanır. -->
<my-datepicker #startDate />
```

Değişkeni bir `<ng-template>` elemanı üzerinde bildirirseniz, değişken şablonu temsil eden bir TemplateRef örneğine referans verir. Daha fazla bilgi için [Angular yıldız işareti \* sözdizimini nasıl kullanır](/guide/directives/structural-directives#yapısal-direktif-kısaltılmış-sözdizimi) bölümüne [Yapısal Direktifler](/guide/directives/structural-directives) içinde bakın.

```angular-html
<!-- `myFragment` değişkeni bu şablon parçasına karşılık gelen `TemplateRef` örneğine atanır. -->
<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```

Değişkeni görünümün başka herhangi bir eleman üzerinde bildirirseniz, değişken `HTMLElement` örneğine referans verir.

```angular-html
<!-- "taskInput" değişkeni HTMLInputElement örneğine referans verir. -->
<input #taskInput placeholder="Enter task name" />
```

#### Angular direktifine referans atama

Angular direktifleri, direktifin şablonda referans verilebileceği bir ad tanımlayan `exportAs` özelliğine sahip olabilir:

```angular-ts
@Directive({
  selector: '[dropZone]',
  exportAs: 'dropZone',
})
export class DropZone {
  /* ... */
}
```

Bir eleman üzerinde şablon değişkeni bildirdiğinizde, bu `exportAs` adını belirterek değişkene bir direktif örneği atayabilirsiniz:

```angular-html
<!-- `firstZone` değişkeni `DropZone` direktif örneğine referans verir. -->
<section dropZone #firstZone="dropZone">...</section>
```

`exportAs` adı belirtmeyen bir direktife referans veremezsiniz.

### Sorgularla şablon referans değişkenlerini kullanma

Şablon değişkenlerini aynı şablonun başka bir bölümündeki değerleri okumak için kullanmanın yanı sıra, bu değişken bildirim stilini [bileşen ve direktif sorguları](/guide/components/queries) için bir elemanı "işaretlemek" amacıyla da kullanabilirsiniz.

Bir şablonda belirli bir elemanı sorgulamak istediğinizde, o eleman üzerinde bir şablon değişkeni bildirebilir ve ardından değişken adına göre elemanı sorgulayabilirsiniz.

```angular-html
<input #description value="Original description" />
```

```angular-ts
@Component({
  /* ... */,
  template: `<input #description value="Original description">`,
})
export class AppComponent {
  // Şablon değişken adına göre input elemanını sorgula.
  @ViewChild('description') input: ElementRef | undefined;
}
```

Sorgular hakkında daha fazla bilgi için [Sorgularla alt elemanlara referans verme](/guide/components/queries) bölümüne bakın.
