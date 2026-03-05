# Content projection with ng-content

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okudugunuzu varsayar. Angular'da yeniyseniz once onu okuyun.

Farkli icerik turleri icin kapsayici gorevi goren bilesenlere siklikla ihtiyac duyarsiniz. Ornegin, ozel bir kart bileseni olusturmak isteyebilirsiniz:

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <!-- card content goes here --> </div>',
})
export class CustomCard {
  /* ... */
}
```

**Icerigin nereye yerlestirilecegin i belirtmek icin `<ng-content>` elemanini yer tutucu olarak kullanabilirsiniz**:

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <ng-content/> </div>',
})
export class CustomCard {
  /* ... */
}
```

TIP: `<ng-content>`, [yerel `<slot>` elemani](https://developer.mozilla.org/docs/Web/HTML/Element/slot) ile benzer sekilde calisir, ancak bazi Angular'a ozgu islevselliklerle birlikte.

`<ng-content>` iceren bir bilesen kullandiginizda, bilesen host elemaninin tum alt elemanlari o `<ng-content>` konumunda render edilir veya **yansitilir** (project):

```angular-ts
// Component source
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
<!-- Using the component -->
<custom-card>
  <p>This is the projected content</p>
</custom-card>
```

```angular-html
<!-- The rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <p>This is the projected content</p>
  </div>
</custom-card>
```

Angular, bu sekilde iletilen bir bilesnenin tum alt elemanlarini o bilesnenin **icerigi** olarak adlandirir. Bu, bilesnenin sablonunda tanimlanan elemanlara karsilik gelen bilesnenin **gorunumu**nden (view) farklidir.

**`<ng-content>` elemani ne bir bilesen ne de bir DOM elemanidir**. Bunun yerine, Angular'a icerigi nerede render edecegini soyleyen ozel bir yer tutucudur. Angular'in derleyicisi tum `<ng-content>` elemanlarini derleme zamaninda isler. `<ng-content>` elemanini calisma zamaninda ekleyemez, kaldiramazsiniz veya degistiremezsiniz. `<ng-content>` uzerine direktifler, stiller veya rastgele nitelikler ekleyemezsiniz.

IMPORTANT: `<ng-content>` elemanini `@if`, `@for` veya `@switch` ile kosullu olarak dahil etmemelisiniz. Angular, `<ng-content>` yer tutucusu gizli olsa bile, o yer tutucuya render edilen icerik icin her zaman DOM dugumlerini olusturur ve baslatir. Bilesen iceriginin kosullu render edilmesi icin [Sablon parcalari](api/core/ng-template) belgesine bakin.

## Multiple content placeholders

Angular, CSS secicisine dayali olarak farkli `<ng-content>` yer tutucularina farkli elemanlarin yansitilmasini destekler. Yukaridaki kart ornegini genisleterek, `select` niteligi kullanarak kart basligi ve kart govdesi icin iki yer tutucu olusturabilirsiniz:

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
<!-- Component template -->
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
<!-- Using the component -->
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
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <card-body>Welcome to the example</card-body>
  </div>
</custom-card>
```

`<ng-content>` yer tutucusu, [bilesen secicileri](guide/components/selectors) ile ayni CSS secicilerini destekler.

`select` niteligi olan bir veya daha fazla `<ng-content>` yer tutucusu ve `select` niteligi olmayan bir `<ng-content>` yer tutucusu eklerseniz, ikincisi herhangi bir `select` niteligi ile eslesmeyen tum elemanlari yakalar:

```angular-html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <!-- capture anything except "card-title" -->
  <ng-content></ng-content>
</div>
```

```angular-html
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <img src="..." />
  <p>Welcome to the example</p>
</custom-card>
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <img src="..." />
    <p>Welcome to the example</p>
  </div>
</custom-card>
```

Bir bilesen, `select` niteligi olmayan bir `<ng-content>` yer tutucusu icermiyorsa, bilesnenin yer tutuculariyla eslesmeyen elemanlar DOM'a render edilmez.

## Fallback content

Angular, bir bilesnenin `<ng-content>` yer tutucusu icin eslesen alt icerik yoksa _yedek icerik_ gosterebilir. `<ng-content>` elemaninin kendisine alt icerik ekleyerek yedek icerik belirtebilirsiniz.

```angular-html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title">Default Title</ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body">Default Body</ng-content>
</div>
```

```angular-html
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <!-- No card-body provided -->
</custom-card>
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    Default Body
  </div>
</custom-card>
```

## Aliasing content for projection

Angular, herhangi bir eleman uzerinde bir CSS secici belirtmenize olanak taniyan ozel bir `ngProjectAs` niteligi destekler. `ngProjectAs` niteligi olan bir eleman `<ng-content>` yer tutucusuyla kontrol edildiginde, Angular elemanin kimligi yerine `ngProjectAs` degerini karsilastirir:

```angular-html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <ng-content />
</div>
```

```angular-html
<!-- Using the component -->
<custom-card>
  <h3 ngProjectAs="card-title">Hello</h3>

  <p>Welcome to the example</p>
</custom-card>
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <h3>Hello</h3>
    <div class="card-divider"></div>
    <p>Welcome to the example</p>
  </div>
</custom-card>
```

`ngProjectAs` yalnizca statik degerleri destekler ve dinamik ifadelere baglanamaz.
