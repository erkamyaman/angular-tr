# Output'larla özel olaylar

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okuduğunuzu varsayar. Angular'da yeniyseniz önce onu okuyun.

Angular bileşenleri, bir özelliği `output` fonksiyonuna atayarak özel olaylar tanımlayabilir:

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

`output` fonksiyonu bir `OutputEmitterRef` döndürür. `OutputEmitterRef` üzerinde `emit` yöntemini çağırarak bir olay yayabilirsiniz:

```ts
this.panelClosed.emit();
```

Angular, `output` fonksiyonu ile başlatılan özellikleri **çıktılar** olarak adlandırır. `click` gibi yerel tarayıcı olaylarına benzer şekilde özel olaylar oluşturmak için çıktıları kullanabilirsiniz.

**Angular özel olayları DOM'da yukarı doğru kabarcıklanmaz (bubble).**

**Çıktı adları büyük-küçük harf duyarlıdır.**

Bir bileşen sınıfını genişletirken, **çıktılar alt sınıf tarafından miras alınır.**

`output` fonksiyonu Angular derleyicisi için özel bir anlam taşır. **`output` fonksiyonunu yalnızca bileşen ve direktif özellik başlangıç değerlerinde çağırabilirsiniz.**

## Olay verisi yayma

`emit` çağırırken olay verisi iletebilirsiniz:

```ts
// İlkel değerler yayabilirsiniz.
this.valueChanged.emit(7);

// Özel olay nesneleri yayabilirsiniz
this.thumbDropped.emit({
  pointerX: 123,
  pointerY: 456,
});
```

Bir şablonda olay dinleyicisi tanımlarken, olay verilerine `$event` değişkeninden erişebilirsiniz:

```angular-html
<custom-slider (valueChanged)="logValue($event)" />
```

Üst bileşende olay verisini alın:

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

## Çıktı adlarını özelleştirme

`output` fonksiyonu, şablonda olay için farklı bir ad belirtmenize olanak tanıyan bir parametre kabul eder:

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

Bu takma ad, özelliğin TypeScript kodundaki kullanımını etkilemez.

Bileşen çıktıları için takma ad kullanmaktan genel olarak kaçınmanız gerekirken, bu özellik özellikleri yeniden adlandırırken orijinal ad için bir takma ad korumak veya yerel DOM olaylarıyla ad çakışmalarını önlemek için yararlı olabilir.

## Output'lara programatik olarak abone olma

Bir bileşeni dinamik olarak oluşturduğunuzda, bileşen örneğinden çıktı olaylarına programatik olarak abone olabilirsiniz. `OutputRef` türü bir `subscribe` yöntemi içerir:

```ts
const someComponentRef: ComponentRef<SomeComponent> = viewContainerRef.createComponent(/*...*/);

someComponentRef.instance.someEventProperty.subscribe((eventData) => {
  console.log(eventData);
});
```

Angular, aboneleri olan bileşenleri yok ettiğinde olay aboneliklerini otomatik olarak temizler. Alternatif olarak, bir olaydan manuel olarak aboneliği iptal edebilirsiniz. `subscribe` fonksiyonu bir `unsubscribe` yöntemi olan bir `OutputRefSubscription` döndürür:

```ts
const eventSubscription = someComponent.someEventProperty.subscribe((eventData) => {
  console.log(eventData);
});

// ...

eventSubscription.unsubscribe();
```

## Olay adlarını seçme

DOM elemanlarının HTMLElement üzerindeki olaylarıyla çakışan çıktı adları seçmekten kaçının. Ad çakışmaları, bağlı özelliğin bileşene mi yoksa DOM elemanına mı ait olduğu konusunda kafa karışıklığına neden olur.

Bileşen çıktıları için, bileşen seçicilerinde yaptığınız gibi önek eklemekten kaçının. Belirli bir eleman yalnızca bir bileşen barındırabilceği için, herhangi bir özel özelliğin bileşene ait olduğu varsayılabilir.

Çıktı adları için her zaman [camelCase](https://en.wikipedia.org/wiki/Camel_case) kullanın. Çıktı adlarına "on" öneki eklemeyin.

## RxJS ile output'ları kullanma

Çıktılar ve RxJS arasındaki birlikte çalışabilirlik hakkında ayrıntılar için [Bileşen ve direktif çıktılarıyla RxJS birlikte çalışabilirliği](ecosystem/rxjs-interop/output-interop) belgesine bakın.

## `@Output` dekoratörü ile çıktı bildirme

TIP: Angular ekibi yeni projeler için `output` fonksiyonunu önerse de, orijinal dekoratör tabanlı `@Output` API'si tamamen desteklenmeye devam etmektedir.

Alternatif olarak, bir özelliği yeni bir `EventEmitter`'a atayarak ve `@Output` dekoratörü ekleyerek özel olaylar tanımlayabilirsiniz:

```ts
@Component({
  /*...*/
})
export class ExpandablePanel {
  @Output() panelClosed = new EventEmitter<void>();
}
```

`EventEmitter` üzerinde `emit` yöntemini çağırarak bir olay yayabilirsiniz.

### `@Output` dekoratörü ile takma adlar

`@Output` dekoratörü, şablonda olay için farklı bir ad belirtmenize olanak tanıyan bir parametre kabul eder:

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

Bu takma ad, özelliğin TypeScript kodundaki kullanımını etkilemez.

## `@Component` dekoratöründe çıktıları belirtme

`@Output` dekoratörüne ek olarak, bir bileşenin çıktılarını `@Component` dekoratöründeki `outputs` özelliği ile de belirtebilirsiniz. Bu, bir bileşen bir temel sınıftan özellik miras aldığında yararlı olabilir:

```ts
// `CustomSlider`, `BaseSlider`'dan `valueChanged` özelliğini miras alır.
@Component({
  /*...*/
  outputs: ['valueChanged'],
})
export class CustomSlider extends BaseSlider {}
```

Dizede iki noktadan sonra takma adı belirterek `outputs` listesinde ek olarak bir çıktı takma adı belirtebilirsiniz:

```ts
// `CustomSlider`, `BaseSlider`'dan `valueChanged` özelliğini miras alır.
@Component({
  /*...*/
  outputs: ['valueChanged: volumeChanged'],
})
export class CustomSlider extends BaseSlider {}
```
