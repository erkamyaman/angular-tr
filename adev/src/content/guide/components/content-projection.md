# ng-content ile içerik yansıtma

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okuduğunuzu varsayar. Angular'da yeniyseniz önce onu okuyun.

Farklı içerik türleri için kapsayıcı görevi gören bileşenlere sıklıkla ihtiyaç duyarsınız. Örneğin, özel bir kart bileşeni oluşturmak isteyebilirsiniz:

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <!-- card content goes here --> </div>',
})
export class CustomCard {
  /* ... */
}
```

**İçeriğin nereye yerleştirileceğini belirtmek için `<ng-content>` elemanını yer tutucu olarak kullanabilirsiniz**:

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <ng-content/> </div>',
})
export class CustomCard {
  /* ... */
}
```

TIP: `<ng-content>`, [yerel `<slot>` elemanı](https://developer.mozilla.org/docs/Web/HTML/Element/slot) ile benzer şekilde çalışır, ancak bazı Angular'a özgü işlevselliklerle birlikte.

`<ng-content>` içeren bir bileşen kullandığınızda, bileşen host elemanının tüm alt elemanları o `<ng-content>` konumunda render edilir veya **yansıtılır** (project):

```angular-ts
// Bileşen kaynağı
@Component({
  selector: 'custom-card',
  template: `
    <div class="card-shadow">
      <ng-content />
    </div>
  `,
})
export class CustomCard {
  /* ... */
}
```

```angular-html
<!-- Bileşeni kullanma -->
<custom-card>
  <p>This is the projected content</p>
</custom-card>
```

```angular-html
<!-- Render edilmiş DOM -->
<custom-card>
  <div class="card-shadow">
    <p>This is the projected content</p>
  </div>
</custom-card>
```

Angular, bu şekilde iletilen bir bileşenin tüm alt elemanlarını o bileşenin **içeriği** olarak adlandırır. Bu, bileşenin şablonunda tanımlanan elemanlara karşılık gelen bileşenin **görünümü**nden (view) farklıdır.

**`<ng-content>` elemanı ne bir bileşen ne de bir DOM elemanıdır**. Bunun yerine, Angular'a içeriği nerede render edeceğini söyleyen özel bir yer tutucudur. Angular'ın derleyicisi tüm `<ng-content>` elemanlarını derleme zamanında işler. `<ng-content>` elemanını çalışma zamanında ekleyemez, kaldıramazsınız veya değiştiremezsiniz. `<ng-content>` üzerine direktifler, stiller veya rastgele nitelikler ekleyemezsiniz.

IMPORTANT: `<ng-content>` elemanını `@if`, `@for` veya `@switch` ile koşullu olarak dahil etmemelisiniz. Angular, `<ng-content>` yer tutucusu gizli olsa bile, o yer tutucuya render edilen içerik için her zaman DOM düğümlerini oluşturur ve başlatır. Bileşen içeriğinin koşullu render edilmesi için [Şablon parçaları](api/core/ng-template) belgesine bakın.

## Birden fazla içerik yer tutucusu

Angular, CSS seçicisine dayalı olarak farklı `<ng-content>` yer tutucularına farklı elemanların yansıtılmasını destekler. Yukarıdaki kart örneğini genişleterek, `select` niteliği kullanarak kart başlığı ve kart gövdesi için iki yer tutucu oluşturabilirsiniz:

```angular-ts
@Component({
  selector: 'card-title',
  template: `<ng-content>card-title</ng-content>`,
})
export class CardTitle {}

@Component({
  selector: 'card-body',
  template: `<ng-content>card-body</ng-content>`,
})
export class CardBody {}
```

```angular-ts
<!-- Bileşen şablonu -->
@Component({
  selector: 'custom-card',
  template: `
  <div class="card-shadow">
    <ng-content select="card-title"></ng-content>
    <div class="card-divider"></div>
    <ng-content select="card-body"></ng-content>
  </div>
  `,
})
export class CustomCard {}
```

```angular-ts
<!-- Bileşeni kullanma -->
@Component({
  selector: 'app-root',
  imports: [CustomCard, CardTitle, CardBody],
  template: `
    <custom-card>
      <card-title>Hello</card-title>
      <card-body>Welcome to the example</card-body>
    </custom-card>
`,
})
export class App {}
```

```angular-html
<!-- Render edilmiş DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <card-body>Welcome to the example</card-body>
  </div>
</custom-card>
```

`<ng-content>` yer tutucusu, [bileşen seçicileri](guide/components/selectors) ile aynı CSS seçicilerini destekler.

`select` niteliği olan bir veya daha fazla `<ng-content>` yer tutucusu ve `select` niteliği olmayan bir `<ng-content>` yer tutucusu eklerseniz, ikincisi herhangi bir `select` niteliği ile eşleşmeyen tüm elemanları yakalar:

```angular-html
<!-- Bileşen şablonu -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <!-- "card-title" dışındaki her şeyi yakala -->
  <ng-content></ng-content>
</div>
```

```angular-html
<!-- Bileşeni kullanma -->
<custom-card>
  <card-title>Hello</card-title>
  <img src="..." />
  <p>Welcome to the example</p>
</custom-card>
```

```angular-html
<!-- Render edilmiş DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <img src="..." />
    <p>Welcome to the example</p>
  </div>
</custom-card>
```

Bir bileşen, `select` niteliği olmayan bir `<ng-content>` yer tutucusu içermiyorsa, bileşenin yer tutucularıyla eşleşmeyen elemanlar DOM'a render edilmez.

## Yedek içerik

Angular, bir bileşenin `<ng-content>` yer tutucusu için eşleşen alt içerik yoksa _yedek içerik_ gösterebilir. `<ng-content>` elemanının kendisine alt içerik ekleyerek yedek içerik belirtebilirsiniz.

```angular-html
<!-- Bileşen şablonu -->
<div class="card-shadow">
  <ng-content select="card-title">Default Title</ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body">Default Body</ng-content>
</div>
```

```angular-html
<!-- Bileşeni kullanma -->
<custom-card>
  <card-title>Hello</card-title>
  <!-- card-body sağlanmadı -->
</custom-card>
```

```angular-html
<!-- Render edilmiş DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    Default Body
  </div>
</custom-card>
```

## Yansıtma için içerik takma adı verme

Angular, herhangi bir eleman üzerinde bir CSS seçici belirtmenize olanak tanıyan özel bir `ngProjectAs` niteliği destekler. `ngProjectAs` niteliği olan bir eleman `<ng-content>` yer tutucusuyla kontrol edildiğinde, Angular elemanın kimliği yerine `ngProjectAs` değerini karşılaştırır:

```angular-html
<!-- Bileşen şablonu -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <ng-content />
</div>
```

```angular-html
<!-- Bileşeni kullanma -->
<custom-card>
  <h3 ngProjectAs="card-title">Hello</h3>

  <p>Welcome to the example</p>
</custom-card>
```

```angular-html
<!-- Render edilmiş DOM -->
<custom-card>
  <div class="card-shadow">
    <h3>Hello</h3>
    <div class="card-divider"></div>
    <p>Welcome to the example</p>
  </div>
</custom-card>
```

`ngProjectAs` yalnızca statik değerleri destekler ve dinamik ifadelere bağlanamaz.
