# Accepting data with input properties

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okudugunuzu varsayar. Angular'da yeniyseniz once onu okuyun.

TIP: Diger web framework'lerine asina iseniz, girdi ozellikleri _props_ ile benzerdir.

Bir bilesen kullandiginizda, ona genellikle bazi veriler iletmek istersiniz. Bir bilesen, kabul ettigi verileri **girdiler** bildirerek belirtir:

```ts {highlight:[8]}
import {Component, input} from '@angular/core';

@Component({
  /*...*/
})
export class CustomSlider {
  // Declare an input named 'value' with a default value of zero.
  value = input(0);
}
```

Bu, ozelligi bir sablonda baglayabilmenizi saglar:

```angular-html
<custom-slider [value]="50" />
```

Bir girdinin varsayilan degeri varsa, TypeScript turu varsayilan degerden cikarir:

```ts
@Component({
  /*...*/
})
export class CustomSlider {
  // TypeScript infers that this input is a number, returning InputSignal<number>.
  value = input(0);
}
```

Fonksiyona bir generic parametre belirterek girdi icin acikca bir tur bildirebilirsiniz.

Varsayilan degeri olmayan bir girdi ayarlanmazsa, degeri `undefined` olur:

```ts
@Component({
  /*...*/
})
export class CustomSlider {
  // Produces an InputSignal<number | undefined> because `value` may not be set.
  value = input<number>();
}
```

**Angular girdileri derleme zamaninda statik olarak kaydeder**. Girdiler calisma zamaninda eklenemez veya kaldirilamaz.

`input` fonksiyonu Angular derleyicisi icin ozel bir anlam tasir. **`input` fonksiyonunu yalnizca bilesen ve direktif ozellik baslangic degerlerinde cagirabilirsiniz.**

Bir bilesen sinifini genisletirken, **girdiler alt sinif tarafindan miras alinir.**

**Girdi adlari buyuk-kucuk harf duyarlidir.**

## Reading inputs

`input` fonksiyonu bir `InputSignal` dondurur. Sinyali cagirarak degeri okuyabilirsiniz:

```ts {highlight:[11]}
import {Component, input, computed} from '@angular/core';

@Component({
  /*...*/
})
export class CustomSlider {
  // Declare an input named 'value' with a default value of zero.
  value = input(0);

  // Create a computed expression that reads the value input
  label = computed(() => `The slider's value is ${this.value()}`);
}
```

`input` fonksiyonu tarafindan olusturulan sinyaller salt okunurdur.

## Required inputs

`input` yerine `input.required` cagirarak bir girdinin `required` (zorunlu) oldugunu bildirebilirsiniz:

```ts {highlight:[6]}
@Component({
  /*...*/
})
export class CustomSlider {
  // Declare a required input named value. Returns an `InputSignal<number>`.
  value = input.required<number>();
}
```

Angular, bilesen bir sablonda kullanildiginda zorunlu girdilerin _mutlaka_ ayarlanmis olmasini zorunlu kilar. Tum zorunlu girdilerini belirtmeden bir bilesen kullanmaya calisirsiniz, Angular derleme zamaninda bir hata bildirir.

Zorunlu girdiler, dondurilen `InputSignal`'in generic parametresine otomatik olarak `undefined` eklemez.

## Configuring inputs

`input` fonksiyonu, girdinin calisma seklini degistirmenize olanak taniyan ikinci bir parametre olarak bir yapilandirma nesnesi kabul eder.

### Input transforms

Angular tarafindan ayarlandiginda girdinin degerini degistirmek icin bir `transform` fonksiyonu belirtebilirsiniz.

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

Yukaridaki ornekte, `systemVolume` degeri her degistiginde Angular `trimString` fonksiyonunu calistirir ve `label`'i sonuca ayarlar.

Girdi donusumlerinin en yaygin kullanim alani, sablonlarda genellikle `null` ve `undefined` dahil olmak uzere daha genis bir deger turleri araligi kabul etmektir.

**Girdi donusum fonksiyonu derleme zamaninda statik olarak analiz edilebilir olmalidir.** Donusum fonksiyonlarini kosullu olarak veya bir ifade degerl endirmesinin sonucu olarak ayarlayamazsiniz.

**Girdi donusum fonksiyonlari her zaman [saf fonksiyonlar](https://en.wikipedia.org/wiki/Pure_function) olmalidir.** Donusum fonksiyonu disindaki duruma guvenme, onceden tahmin edilemeyen davranislara yol acabilir.

#### Type checking

Bir girdi donusumu belirttiginizde, donusum fonksiyonunun parametre turu, sablonda girdiye ayarlanabilecek deger turlerini belirler.

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

Yukaridaki ornekte, `widthPx` girdisi bir `number` kabul ederken `InputSignal` ozelligi bir `string` dondurur.

#### Built-in transformations

Angular, en yaygin iki senaryo icin iki yerlesik donusum fonksiyonu icerir: degerleri boolean ve sayiya zorlama.

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

`booleanAttribute`, standart HTML [boolean nitelikleri](https://developer.mozilla.org/docs/Glossary/Boolean/HTML)'nin davranisini taklit eder; niteligin _varligi_ "true" degerini gosterir. Ancak Angular'in `booleanAttribute`'u, `"false"` literal dizesini boolean `false` olarak degerlenderir.

`numberAttribute`, verilen degeri bir sayiya ayristirmayi dener, ayristirma basarisiz olursa `NaN` uretir.

### Input aliases

Sablonlarda bir girdinin adini degistirmek icin `alias` secenegini belirtebilirsiniz.

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

Bu takma ad, ozelligin TypeScript kodundaki kullanimini etkilemez.

Bilesen girdileri icin takma ad kullanmaktan genel olarak kacinmaniz gerekirken, bu ozellik ozellikleri yeniden adlandirirken orijinal ad icin bir takma ad korumak veya yerel DOM eleman ozellikleriyle ad cakismalarini onlemek icin yararli olabilir.

## Model inputs

**Model girdileri**, bir bilesnenin yeni degerleri ust bilesenine geri yaymasini saglayan ozel bir girdi turudur.

Bir bilesen olusturulurken, standart bir girdi olusturur gibi bir model girdisi tanimlayabilirsiniz.

Her iki girdi turu de birinin ozellige bir deger baglamasina izin verir. Ancak, **model girdileri bilesen yazarinin ozellige deger yazmasina izin verir**. Ozellik iki yonlu baglama ile baglanmissa, yeni deger o baglamaya yayilir.

```ts
@Component({
  /* ... */
})
export class CustomSlider {
  // Define a model input named "value".
  value = model(0);

  increment() {
    // Update the model input with a new value, propagating the value to any bindings.
    this.value.update((oldValue) => oldValue + 10);
  }
}

@Component({
  /* ... */
  // Using the two-way binding syntax means that any changes to the slider's
  // value automatically propagate back to the `volume` signal.
  // Note that this binding uses the signal *instance*, not the signal value.
  template: `<custom-slider [(value)]="volume" />`,
})
export class MediaControls {
  // Create a writable signal for the `volume` local state.
  volume = signal(0);
}
```

Yukaridaki ornekte, `CustomSlider` kendi `value` model girdisine deger yazabilir ve bu degerler `MediaControls`'daki `volume` sinyaline geri yayilir. Bu baglama, `value` ve `volume` degerlerini senkronize tutar. Baglama isleminin sinyal _ornegini_ ilettigine, sinyalin _degerini_ degil, dikkat edin.

Diger acilardan, model girdileri standart girdilere benzer sekilde calisir. `computed` ve `effect` gibi [reaktif baglamlar](guide/signals#reactive-contexts) dahil olmak uzere sinyal fonksiyonunu cagirarak degeri okuyabilirsiniz.

Sablonlarda iki yonlu baglama hakkinda daha fazla bilgi icin [Iki yonlu baglama](guide/templates/two-way-binding) belgesine bakin.

### Two-way binding with plain properties

Duz bir JavaScript ozelligini bir model girdisine baglayabilirsiniz.

```angular-ts
@Component({
  /* ... */
  // `value` is a model input.
  // The parenthesis-inside-square-brackets syntax (aka "banana-in-a-box") creates a two-way binding
  template: '<custom-slider [(value)]="volume" />',
})
export class MediaControls {
  protected volume = 0;
}
```

Yukaridaki ornekte, `CustomSlider` kendi `value` model girdisine deger yazabilir ve bu degerler `MediaControls`'daki `volume` ozelligine geri yayilir. Bu baglama, `value` ve `volume` degerlerini senkronize tutar.

### Implicit `change` events

Bir bilesen veya direktifte model girdisi bildirdiginizde, Angular otomatik olarak o model icin karsilik gelen bir [cikti](guide/components/outputs) olusturur. Ciktinin adi, model girdisinin adinin sonuna "Change" eklenmesiyle olusur.

```ts
@Directive({
  /* ... */
})
export class CustomCheckbox {
  // This automatically creates an output named "checkedChange".
  // Can be subscribed to using `(checkedChange)="handler()"` in the template.
  checked = model(false);
}
```

Angular, model girdisinin `set` veya `update` yontemlerini cagirarak yeni bir deger yazdiginizda bu degisiklik olayini yayar.

Ciktilar hakkinda daha fazla ayrinti icin [Ciktilarla ozel olaylar](guide/components/outputs) belgesine bakin.

### Customizing model inputs

Bir model girdisini zorunlu olarak isaretleyebilir veya [standart bir girdi](guide/components/inputs) ile ayni sekilde bir takma ad saglayabilirsiniz.

Model girdileri girdi donusumlerini desteklemez.

### When to use model inputs

Bir bilesnenin iki yonlu baglamayi desteklemesini istediginizde model girdilerini kullanin. Bu, genellikle bir bilesnenin kullanici etkilesime dayali olarak bir degeri degistirmek icin var oldugu durumlarda uygundur. En yaygin olarak, tarih secici veya combobox gibi ozel form kontrolleri birincil degerleri icin model girdileri kullanmalidir.

## Choosing input names

DOM elemanlarinin HTMLElement uzerindeki ozellikleriyle cakisan girdi adlari secmekten kacinin. Ad cakismalari, bagli ozelligin bilesene mi yoksa DOM elemanina mi ait oldugu konusunda kafa karisikligina neden olur.

Bilesen girdileri icin, bilesen secicilerinde yaptiginiz gibi onek eklemekten kacinin. Belirli bir eleman yalnizca bir bilesen barindirabilecegi icin, herhangi bir ozel ozelligin bilesene ait oldugu varsayilabilir.

## Declaring inputs with the `@Input` decorator

TIP: Angular ekibi yeni projeler icin sinyal tabanli `input` fonksiyonunu onerse de, orijinal dekorator tabanli `@Input` API'si tamamen desteklenmeye devam etmektedir.

Alternatif olarak, bir ozellige `@Input` dekoratoru ekleyerek bilesen girdileri bildirebilirsiniz:

```ts {highlight:[5]}
@Component({
  /*...*/
})
export class CustomSlider {
  @Input() value = 0;
}
```

Bir girdiye baglama, hem sinyal tabanli hem de dekorator tabanli girdilerde aynidir:

```angular-html
<custom-slider [value]="50" />
```

### Customizing decorator-based inputs

`@Input` dekoratoru, girdinin calisma seklini degistirmenize olanak taniyan bir yapilandirma nesnesi kabul eder.

#### Required inputs

Belirli bir girdinin her zaman bir degere sahip olmasini zorunlu kilmak icin `required` secenegini belirtebilirsiniz.

```ts {highlight:[5]}
@Component({
  /*...*/
})
export class CustomSlider {
  @Input({required: true}) value = 0;
}
```

Tum zorunlu girdilerini belirtmeden bir bilesen kullanmaya calisirsiniz, Angular derleme zamaninda bir hata bildirir.

#### Input transforms

Angular tarafindan ayarlandiginda girdinin degerini degistirmek icin bir `transform` fonksiyonu belirtebilirsiniz. Bu donusum fonksiyonu, yukarida aciklanan sinyal tabanli girdilerin donusum fonksiyonlariyla ayni sekilde calisir.

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

#### Input aliases

Sablonlarda bir girdinin adini degistirmek icin `alias` secenegini belirtebilirsiniz.

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

`@Input` dekoratoru ayrica yapilandirma nesnesi yerine ilk parametresi olarak takma adi kabul eder.

Girdi takma adlari, yukarida aciklanan sinyal tabanli girdilerle ayni sekilde calisir.

### Inputs with getters and setters

Dekorator tabanli girdiler kullanildiginda, getter ve setter ile uygulanan bir ozellik bir girdi olabilir:

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

Yalnizca bir public setter tanimlayarak _salt yazilir_ bir girdi bile olusturabilirsiniz:

```ts
export class CustomSlider {
  @Input()
  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
```

**Mumkun oldugunda getter ve setter'lar yerine girdi donusumlerini kullanmayi tercih edin.**

Karmasik veya maliyetli getter ve setter'lardan kacinin. Angular bir girdinin setter'ini birden fazla kez cagirabilir, bu da setter DOM manipulasyonu gibi maliyetli islemler gerceklestiriyorsa uygulama performansini olumsuz etkileyebilir.

## Specify inputs in the `@Component` decorator

`@Input` dekoratorune ek olarak, bir bilesnenin girdilerini `@Component` dekoratorundeki `inputs` ozelligi ile de belirtebilirsiniz. Bu, bir bilesen bir temel siniftan ozellik miras aldiginda yararli olabilir:

```ts {highlight:[4]}
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled'],
})
export class CustomSlider extends BaseSlider { }
```

Dizede iki noktadan sonra takma adi belirterek `inputs` listesinde ek olarak bir girdi takma adi belirtebilirsiniz:

```ts {highlight:[4]}
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled: sliderDisabled'],
})
export class CustomSlider extends BaseSlider { }
```
