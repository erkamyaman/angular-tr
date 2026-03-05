# Custom events with outputs

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okudugunuzu varsayar. Angular'da yeniyseniz once onu okuyun.

Angular bilesenleri, bir ozelligi `output` fonksiyonuna atayarak ozel olaylar tanimlayabilir:

```ts {highlight:[3]}
@Component({
  /*...*/
})
export class ExpandablePanel {
  panelClosed = output<void>();
}
```

```angular-html
<expandable-panel (panelClosed)="savePanelState()" />
```

`output` fonksiyonu bir `OutputEmitterRef` dondurur. `OutputEmitterRef` uzerinde `emit` yontemini cagirarak bir olay yayabilirsiniz:

```ts
this.panelClosed.emit();
```

Angular, `output` fonksiyonu ile baslatiilan ozellikleri **ciktilar** olarak adlandirir. `click` gibi yerel tarayici olaylarina benzer sekilde ozel olaylar olusturmak icin ciktilari kullanabilirsiniz.

**Angular ozel olaylari DOM'da yukari dogru kabarciklanmaz (bubble).**

**Cikti adlari buyuk-kucuk harf duyarlidir.**

Bir bilesen sinifini genisletirken, **ciktilar alt sinif tarafindan miras alinir.**

`output` fonksiyonu Angular derleyicisi icin ozel bir anlam tasir. **`output` fonksiyonunu yalnizca bilesen ve direktif ozellik baslangic degerlerinde cagirabilirsiniz.**

## Emitting event data

`emit` cagirirken olay verisi iletebilirsiniz:

```ts
// You can emit primitive values.
this.valueChanged.emit(7);

// You can emit custom event objects
this.thumbDropped.emit({
  pointerX: 123,
  pointerY: 456,
});
```

Bir sablonda olay dinleyicisi tanimlarken, olay verilerine `$event` degiskeninden erisebilirsiniz:

```angular-html
<custom-slider (valueChanged)="logValue($event)" />
```

Ust bilesnde olay verisini alin:

```ts
@Component({
 /*...*/
})
export class App {
  logValue(value: number) {
    ...
  }
}

```

## Customizing output names

`output` fonksiyonu, sablonda olay icin farkli bir ad belirtmenize olanak taniyan bir parametre kabul eder:

```ts
@Component({
  /*...*/
})
export class CustomSlider {
  changed = output({alias: 'valueChanged'});
}
```

```angular-html
<custom-slider (valueChanged)="saveVolume()" />
```

Bu takma ad, ozelligin TypeScript kodundaki kullanimini etkilemez.

Bilesen ciktilari icin takma ad kullanmaktan genel olarak kacinmaniz gerekirken, bu ozellik ozellikleri yeniden adlandirirken orijinal ad icin bir takma ad korumak veya yerel DOM olaylariyla ad cakismalarini onlemek icin yararli olabilir.

## Subscribing to outputs programmatically

Bir bileseni dinamik olarak olustururken, bilesen orneginden cikti olaylarina programatik olarak abone olabilirsiniz. `OutputRef` turu bir `subscribe` yontemi icerir:

```ts
const someComponentRef: ComponentRef<SomeComponent> = viewContainerRef.createComponent(/*...*/);

someComponentRef.instance.someEventProperty.subscribe((eventData) => {
  console.log(eventData);
});
```

Angular, aboneleri olan bilesenleri yok ettiginde olay aboneliklerini otomatik olarak temizler. Alternatif olarak, bir olaydan manuel olarak aboneligi iptal edebilirsiniz. `subscribe` fonksiyonu bir `unsubscribe` yontemi olan bir `OutputRefSubscription` dondurur:

```ts
const eventSubscription = someComponent.someEventProperty.subscribe((eventData) => {
  console.log(eventData);
});

// ...

eventSubscription.unsubscribe();
```

## Choosing event names

DOM elemanlarinin HTMLElement uzerindeki olaylariyla cakisan cikti adlari secmekten kacinin. Ad cakismalari, bagli ozelligin bilesene mi yoksa DOM elemanina mi ait oldugu konusunda kafa karisikligina neden olur.

Bilesen ciktilari icin, bilesen secicilerinde yaptiginiz gibi onek eklemekten kacinin. Belirli bir eleman yalnizca bir bilesen barindirabilecegi icin, herhangi bir ozel ozelligin bilesene ait oldugu varsayilabilir.

Cikti adlari icin her zaman [camelCase](https://en.wikipedia.org/wiki/Camel_case) kullanin. Cikti adlarina "on" oneki eklemeyin.

## Using outputs with RxJS

Ciktilar ve RxJS arasindaki birlikte calisabilirlik hakkinda ayrintilar icin [Bilesen ve direktif ciktilariyla RxJS birlikte calisabilirligi](ecosystem/rxjs-interop/output-interop) belgesine bakin.

## Declaring outputs with the `@Output` decorator

TIP: Angular ekibi yeni projeler icin `output` fonksiyonunu onerse de, orijinal dekorator tabanli `@Output` API'si tamamen desteklenmeye devam etmektedir.

Alternatif olarak, bir ozelligi yeni bir `EventEmitter`'a atayarak ve `@Output` dekoratoru ekleyerek ozel olaylar tanimlayabilirsiniz:

```ts
@Component({
  /*...*/
})
export class ExpandablePanel {
  @Output() panelClosed = new EventEmitter<void>();
}
```

`EventEmitter` uzerinde `emit` yontemini cagirarak bir olay yayabilirsiniz.

### Aliases with the `@Output` decorator

`@Output` dekoratoru, sablonda olay icin farkli bir ad belirtmenize olanak taniyan bir parametre kabul eder:

```ts
@Component({
  /*...*/
})
export class CustomSlider {
  @Output('valueChanged') changed = new EventEmitter<number>();
}
```

```angular-html
<custom-slider (valueChanged)="saveVolume()" />
```

Bu takma ad, ozelligin TypeScript kodundaki kullanimini etkilemez.

## Specify outputs in the `@Component` decorator

`@Output` dekoratorune ek olarak, bir bilesnenin ciktilarini `@Component` dekoratorundeki `outputs` ozelligi ile de belirtebilirsiniz. Bu, bir bilesen bir temel siniftan ozellik miras aldiginda yararli olabilir:

```ts
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  /*...*/
  outputs: ['valueChanged'],
})
export class CustomSlider extends BaseSlider {}
```

Dizede iki noktadan sonra takma adi belirterek `outputs` listesinde ek olarak bir cikti takma adi belirtebilirsiniz:

```ts
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  /*...*/
  outputs: ['valueChanged: volumeChanged'],
})
export class CustomSlider extends BaseSlider {}
```
