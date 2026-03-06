# Girdi özellikleri ile veri kabul etme

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okuduğunuzu varsayar. Angular'da yeniyseniz önce onu okuyun.

TIP: Diğer web framework'lerine aşina iseniz, girdi özellikleri _props_ ile benzerdir.

Bir bileşen kullandığınızda, ona genellikle bazı veriler iletmek istersiniz. Bir bileşen, kabul ettiği verileri **girdiler** bildirerek belirtir:

```ts {highlight:[8]}
import {Component, input} from '@angular/core';

@Component({
  /*...*/
})
export class CustomSlider {
  // 'value' adında, varsayılan değeri sıfır olan bir girdi bildirin.
  value = input(0);
}
```

Bu, özelliği bir şablonda bağlayabilmenizi sağlar:

```angular-html
<custom-slider [value]="50" />
```

Bir girdinin varsayılan değeri varsa, TypeScript türü varsayılan değerden çıkarır:

```ts
@Component({
  /*...*/
})
export class CustomSlider {
  // TypeScript bu girdinin bir number olduğunu çıkarır, InputSignal<number> döndürür.
  value = input(0);
}
```

Fonksiyona bir generic parametre belirterek girdi için açıkça bir tür bildirebilirsiniz.

Varsayılan değeri olmayan bir girdi ayarlanmazsa, değeri `undefined` olur:

```ts
@Component({
  /*...*/
})
export class CustomSlider {
  // `value` ayarlanmayabileceği için InputSignal<number | undefined> üretir.
  value = input<number>();
}
```

**Angular girdileri derleme zamanında statik olarak kaydeder**. Girdiler çalışma zamanında eklenemez veya kaldırılamaz.

`input` fonksiyonu Angular derleyicisi için özel bir anlam taşır. **`input` fonksiyonunu yalnızca bileşen ve direktif özellik başlangıç değerlerinde çağırabilirsiniz.**

Bir bileşen sınıfını genişletirken, **girdiler alt sınıf tarafından miras alınır.**

**Girdi adları büyük-küçük harf duyarlıdır.**

## Girdileri okuma

`input` fonksiyonu bir `InputSignal` döndürür. Sinyali çağırarak değeri okuyabilirsiniz:

```ts {highlight:[11]}
import {Component, input, computed} from '@angular/core';

@Component({
  /*...*/
})
export class CustomSlider {
  // 'value' adında, varsayılan değeri sıfır olan bir girdi bildirin.
  value = input(0);

  // value girdisini okuyan bir computed ifadesi oluşturun
  label = computed(() => `The slider's value is ${this.value()}`);
}
```

`input` fonksiyonu tarafından oluşturulan sinyaller salt okunurdur.

## Zorunlu girdiler

`input` yerine `input.required` çağırarak bir girdinin `required` (zorunlu) olduğunu bildirebilirsiniz:

```ts {highlight:[6]}
@Component({
  /*...*/
})
export class CustomSlider {
  // 'value' adında zorunlu bir girdi bildirin. `InputSignal<number>` döndürür.
  value = input.required<number>();
}
```

Angular, bileşen bir şablonda kullanıldığında zorunlu girdilerin _mutlaka_ ayarlanmış olmasını zorunlu kılar. Tüm zorunlu girdilerini belirtmeden bir bileşen kullanmaya çalışırsanız, Angular derleme zamanında bir hata bildirir.

Zorunlu girdiler, döndürülen `InputSignal`'in generic parametresine otomatik olarak `undefined` eklemez.

## Girdileri yapılandırma

`input` fonksiyonu, girdinin çalışma şeklini değiştirmenize olanak tanıyan ikinci bir parametre olarak bir yapılandırma nesnesi kabul eder.

### Girdi dönüşümleri

Angular tarafından ayarlandığında girdinin değerini değiştirmek için bir `transform` fonksiyonu belirtebilirsiniz.

```ts {highlight:[6]}
@Component({
  selector: 'custom-slider',
  /*...*/
})
export class CustomSlider {
  label = input('', {transform: trimString});
}

function trimString(value: string | undefined): string {
  return value?.trim() ?? '';
}
```

```angular-html
<custom-slider [label]="systemVolume" />
```

Yukarıdaki örnekte, `systemVolume` değeri her değiştiğinde Angular `trimString` fonksiyonunu çalıştırır ve `label`'ı sonuca ayarlar.

Girdi dönüşümlerinin en yaygın kullanım alanı, şablonlarda genellikle `null` ve `undefined` dahil olmak üzere daha geniş bir değer türleri aralığı kabul etmektir.

**Girdi dönüşüm fonksiyonu derleme zamanında statik olarak analiz edilebilir olmalıdır.** Dönüşüm fonksiyonlarını koşullu olarak veya bir ifade değerlendirmesinin sonucu olarak ayarlayamazsınız.

**Girdi dönüşüm fonksiyonları her zaman [saf fonksiyonlar](https://en.wikipedia.org/wiki/Pure_function) olmalıdır.** Dönüşüm fonksiyonu dışındaki duruma güvenme, önceden tahmin edilemeyen davranışlara yol açabilir.

#### Tür denetimi

Bir girdi dönüşümü belirttiğinizde, dönüşüm fonksiyonunun parametre türü, şablonda girdiye ayarlanabilecek değer türlerini belirler.

```ts
@Component({
  /*...*/
})
export class CustomSlider {
  widthPx = input('', {transform: appendPx});
}

function appendPx(value: number): string {
  return `${value}px`;
}
```

Yukarıdaki örnekte, `widthPx` girdisi bir `number` kabul ederken `InputSignal` özelliği bir `string` döndürür.

#### Yerleşik dönüşümler

Angular, en yaygın iki senaryo için iki yerleşik dönüşüm fonksiyonu içerir: değerleri boolean ve sayıya zorlama.

```ts
import {Component, input, booleanAttribute, numberAttribute} from '@angular/core';

@Component({
  /*...*/
})
export class CustomSlider {
  disabled = input(false, {transform: booleanAttribute});
  value = input(0, {transform: numberAttribute});
}
```

`booleanAttribute`, standart HTML [boolean nitelikleri](https://developer.mozilla.org/docs/Glossary/Boolean/HTML)'nin davranışını taklit eder; niteliğin _varlığı_ "true" değerini gösterir. Ancak Angular'ın `booleanAttribute`'u, `"false"` literal dizesini boolean `false` olarak değerlendirir.

`numberAttribute`, verilen değeri bir sayıya ayrıştırmayı dener, ayrıştırma başarısız olursa `NaN` üretir.

### Girdi takma adları

Şablonlarda bir girdinin adını değiştirmek için `alias` seçeneğini belirtebilirsiniz.

```ts {highlight:[5]}
@Component({
  /*...*/
})
export class CustomSlider {
  value = input(0, {alias: 'sliderValue'});
}
```

```angular-html
<custom-slider [sliderValue]="50" />
```

Bu takma ad, özelliğin TypeScript kodundaki kullanımını etkilemez.

Bileşen girdileri için takma ad kullanmaktan genel olarak kaçınmanız gerekirken, bu özellik özellikleri yeniden adlandırırken orijinal ad için bir takma ad korumak veya yerel DOM eleman özellikleriyle ad çakışmalarını önlemek için yararlı olabilir.

## Model input'lar

**Model girdileri**, bir bileşenin yeni değerleri üst bileşenine geri yaymasını sağlayan özel bir girdi türüdür.

Bir bileşen oluşturulurken, standart bir girdi oluşturur gibi bir model girdisi tanımlayabilirsiniz.

Her iki girdi türü de birinin özelliğe bir değer bağlamasına izin verir. Ancak, **model girdileri bileşen yazarının özelliğe değer yazmasına izin verir**. Özellik iki yönlü bağlama ile bağlanmışsa, yeni değer o bağlamaya yayılır.

```ts
@Component({
  /* ... */
})
export class CustomSlider {
  // "value" adında bir model girdisi tanımlayın.
  value = model(0);

  increment() {
    // Model girdisini yeni bir değerle güncelleyin, değeri tüm bağlamalara yayın.
    this.value.update((oldValue) => oldValue + 10);
  }
}

@Component({
  /* ... */
  // İki yönlü bağlama sözdizimi kullanmak, slider'ın değerindeki
  // herhangi bir değişikliğin otomatik olarak `volume` sinyaline
  // geri yayılması anlamına gelir.
  // Bu bağlamanın sinyal *örneğini* kullandığına, sinyal değerini değil, dikkat edin.
  template: `<custom-slider [(value)]="volume" />`,
})
export class MediaControls {
  // `volume` yerel durumu için yazılabilir bir sinyal oluşturun.
  volume = signal(0);
}
```

Yukarıdaki örnekte, `CustomSlider` kendi `value` model girdisine değer yazabilir ve bu değerler `MediaControls`'daki `volume` sinyaline geri yayılır. Bu bağlama, `value` ve `volume` değerlerini senkronize tutar. Bağlama işleminin sinyal _örneğini_ ilettiğine, sinyalin _değerini_ değil, dikkat edin.

Diğer açılardan, model girdileri standart girdilere benzer şekilde çalışır. `computed` ve `effect` gibi [reaktif bağlamlar](guide/signals#reactive-contextler) dahil olmak üzere sinyal fonksiyonunu çağırarak değeri okuyabilirsiniz.

Şablonlarda iki yönlü bağlama hakkında daha fazla bilgi için [İki yönlü bağlama](guide/templates/two-way-binding) belgesine bakın.

### Düz özelliklerle iki yönlü bağlama

Düz bir JavaScript özelliğini bir model girdisine bağlayabilirsiniz.

```angular-ts
@Component({
  /* ... */
  // `value` bir model girdisidir.
  // Köşeli parantez içinde parantez sözdizimi (diğer adıyla "banana-in-a-box") iki yönlü bağlama oluşturur
  template: '<custom-slider [(value)]="volume" />',
})
export class MediaControls {
  protected volume = 0;
}
```

Yukarıdaki örnekte, `CustomSlider` kendi `value` model girdisine değer yazabilir ve bu değerler `MediaControls`'daki `volume` özelliğine geri yayılır. Bu bağlama, `value` ve `volume` değerlerini senkronize tutar.

### Örtük `change` olayları

Bir bileşen veya direktifte model girdisi bildirdiğinizde, Angular otomatik olarak o model için karşılık gelen bir [çıktı](guide/components/outputs) oluşturur. Çıktının adı, model girdisinin adının sonuna "Change" eklenmesiyle oluşur.

```ts
@Directive({
  /* ... */
})
export class CustomCheckbox {
  // Bu otomatik olarak "checkedChange" adında bir çıktı oluşturur.
  // Şablonda `(checkedChange)="handler()"` ile abone olunabilir.
  checked = model(false);
}
```

Angular, model girdisinin `set` veya `update` yöntemlerini çağırarak yeni bir değer yazdığınızda bu değişiklik olayını yayar.

Çıktılar hakkında daha fazla ayrıntı için [Çıktılarla özel olaylar](guide/components/outputs) belgesine bakın.

### Model input'ları özelleştirme

Bir model girdisini zorunlu olarak işaretleyebilir veya [standart bir girdi](guide/components/inputs) ile aynı şekilde bir takma ad sağlayabilirsiniz.

Model girdileri girdi dönüşümlerini desteklemez.

### Model input'ları ne zaman kullanılır

Bir bileşenin iki yönlü bağlamayı desteklemesini istediğinizde model girdilerini kullanın. Bu, genellikle bir bileşenin kullanıcı etkileşimine dayalı olarak bir değeri değiştirmek için var olduğu durumlarda uygundur. En yaygın olarak, tarih seçici veya combobox gibi özel form kontrolleri birincil değerleri için model girdileri kullanmalıdır.

## Girdi adlarını seçme

DOM elemanlarının HTMLElement üzerindeki özellikleriyle çakışan girdi adları seçmekten kaçının. Ad çakışmaları, bağlı özelliğin bileşene mi yoksa DOM elemanına mı ait olduğu konusunda kafa karışıklığına neden olur.

Bileşen girdileri için, bileşen seçicilerinde yaptığınız gibi önek eklemekten kaçının. Belirli bir eleman yalnızca bir bileşen barındırabilceği için, herhangi bir özel özelliğin bileşene ait olduğu varsayılabilir.

## `@Input` dekoratörü ile girdi bildirme

TIP: Angular ekibi yeni projeler için sinyal tabanlı `input` fonksiyonunu önerse de, orijinal dekoratör tabanlı `@Input` API'si tamamen desteklenmeye devam etmektedir.

Alternatif olarak, bir özelliğe `@Input` dekoratörü ekleyerek bileşen girdileri bildirebilirsiniz:

```ts {highlight:[5]}
@Component({
  /*...*/
})
export class CustomSlider {
  @Input() value = 0;
}
```

Bir girdiye bağlama, hem sinyal tabanlı hem de dekoratör tabanlı girdilerde aynıdır:

```angular-html
<custom-slider [value]="50" />
```

### Dekoratör tabanlı girdileri özelleştirme

`@Input` dekoratörü, girdinin çalışma şeklini değiştirmenize olanak tanıyan bir yapılandırma nesnesi kabul eder.

#### Zorunlu girdiler

Belirli bir girdinin her zaman bir değere sahip olmasını zorunlu kılmak için `required` seçeneğini belirtebilirsiniz.

```ts {highlight:[5]}
@Component({
  /*...*/
})
export class CustomSlider {
  @Input({required: true}) value = 0;
}
```

Tüm zorunlu girdilerini belirtmeden bir bileşen kullanmaya çalışırsanız, Angular derleme zamanında bir hata bildirir.

#### Girdi dönüşümleri

Angular tarafından ayarlandığında girdinin değerini değiştirmek için bir `transform` fonksiyonu belirtebilirsiniz. Bu dönüşüm fonksiyonu, yukarıda açıklanan sinyal tabanlı girdilerin dönüşüm fonksiyonlarıyla aynı şekilde çalışır.

```ts {highlight:[6]}
@Component({
  selector: 'custom-slider',
  ...
})
export class CustomSlider {
  @Input({transform: trimString}) label = '';
}

function trimString(value: string | undefined) {
  return value?.trim() ?? '';
}
```

#### Girdi takma adları

Şablonlarda bir girdinin adını değiştirmek için `alias` seçeneğini belirtebilirsiniz.

```ts {highlight:[5]}
@Component({
  /*...*/
})
export class CustomSlider {
  @Input({alias: 'sliderValue'}) value = 0;
}
```

```angular-html
<custom-slider [sliderValue]="50" />
```

`@Input` dekoratörü ayrıca yapılandırma nesnesi yerine ilk parametresi olarak takma adı kabul eder.

Girdi takma adları, yukarıda açıklanan sinyal tabanlı girdilerle aynı şekilde çalışır.

### Getter ve setter'lar ile girdiler

Dekoratör tabanlı girdiler kullanıldığında, getter ve setter ile uygulanan bir özellik bir girdi olabilir:

```ts
export class CustomSlider {
  @Input()
  get value(): number {
    return this.internalValue;
  }

  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
```

Yalnızca bir public setter tanımlayarak _salt yazılır_ bir girdi bile oluşturabilirsiniz:

```ts
export class CustomSlider {
  @Input()
  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
```

**Mümkün olduğunda getter ve setter'lar yerine girdi dönüşümlerini kullanmayı tercih edin.**

Karmaşık veya maliyetli getter ve setter'lardan kaçının. Angular bir girdinin setter'ını birden fazla kez çağırabilir, bu da setter DOM manipülasyonu gibi maliyetli işlemler gerçekleştiriyorsa uygulama performansını olumsuz etkileyebilir.

## `@Component` dekoratöründe girdileri belirtme

`@Input` dekoratörüne ek olarak, bir bileşenin girdilerini `@Component` dekoratöründeki `inputs` özelliği ile de belirtebilirsiniz. Bu, bir bileşen bir temel sınıftan özellik miras aldığında yararlı olabilir:

```ts {highlight:[4]}
// `CustomSlider`, `BaseSlider`'dan `disabled` özelliğini miras alır.
@Component({
  ...,
  inputs: ['disabled'],
})
export class CustomSlider extends BaseSlider { }
```

Dizede iki noktadan sonra takma adı belirterek `inputs` listesinde ek olarak bir girdi takma adı belirtebilirsiniz:

```ts {highlight:[4]}
// `CustomSlider`, `BaseSlider`'dan `disabled` özelliğini miras alır.
@Component({
  ...,
  inputs: ['disabled: sliderDisabled'],
})
export class CustomSlider extends BaseSlider { }
```
