# Referencing component children with queries

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okudugunuzu varsayar. Angular'da yeniyseniz once onu okuyun.

Bir bilesen, alt elemanlari bulan ve injector'larindan deger okuyan **sorgular** tanimlayabilir.

Gelistiriciler en yaygin olarak alt bilesenlere, direktiflere, DOM elemanlarina ve daha fazlasina referanslar almak icin sorgulari kullanir.

Tum sorgu fonksiyonlari, en guncel sonuclari yansitan sinyaller dondurur. `computed` ve `effect` gibi [reaktif baglamlar](guide/signals#reactive-contextler) dahil olmak uzere sinyal fonksiyonunu cagirarak sonucu okuyabilirsiniz.

Iki sorgu kategorisi vardir: **gorunum sorgulari** ve **icerik sorgulari.**

## View queries

Gorunum sorgulari, bilesnenin _gorunumundeki_ -- bilesnenin kendi sablonunda tanimlanan -- elemanlardan sonuclari alir. Tek bir sonuc icin `viewChild` fonksiyonu ile sorgulama yapabilirsiniz.

```angular-ts {highlight: [14, 15]}
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  header = viewChild(CustomCardHeader);
  headerText = computed(() => this.header()?.text);
}
```

Bu ornekte, `CustomCard` bileseni bir alt `CustomCardHeader` icin sorgu yapar ve sonucu bir `computed` icinde kullanir.

Sorgu bir sonuc bulamazsa, degeri `undefined` olur. Bu, hedef eleman `@if` tarafindan gizlenmisse gerceklesebilir. Angular, uygulama durumunuz degistikce `viewChild` sonucunu guncel tutar.

`viewChildren` fonksiyonu ile birden fazla sonuc icin de sorgulama yapabilirsiniz.

```angular-ts {highlight: [17]}
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard {
  actions = viewChildren(CustomCardAction);
  actionsTexts = computed(() => this.actions().map((action) => action.text));
}
```

`viewChildren`, sorgu sonuclarinin bir `Array`'ini iceren bir sinyal olusturur.

**Sorgular asla bilesen sinirlarini delmez.** Gorunum sorgulari yalnizca bilesnenin sablonundan sonuc alabilir.

## Content queries

Icerik sorgulari, bilesnenin _icerigindeki_ -- bilesnenin kullanildigi sablonda bilesnenin icerisine yuvalanan -- elemanlardan sonuclari alir. Tek bir sonuc icin `contentChild` fonksiyonu ile sorgulama yapabilirsiniz.

```angular-ts {highlight: [14, 15]}
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  /* ... */
})
export class CustomExpando {
  toggle = contentChild(CustomToggle);
  toggleText = computed(() => this.toggle()?.text);
}

@Component({
  /* ... */
  // CustomToggle is used inside CustomExpando as content.
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `,
})
export class UserProfile {}
```

Sorgu bir sonuc bulamazsa, degeri `undefined` olur. Bu, hedef eleman mevcut degilse veya `@if` tarafindan gizlenmisse gerceklesebilir. Angular, uygulama durumunuz degistikce `contentChild` sonucunu guncel tutar.

Varsayilan olarak, icerik sorgulari yalnizca bilesnenin _dogrudan_ alt elemanlarini bulur ve alt elemanlarin icerisine inmez.

`contentChildren` fonksiyonu ile birden fazla sonuc icin de sorgulama yapabilirsiniz.

```angular-ts {highlight: [14, 15]}
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  /*...*/
})
export class CustomMenu {
  items = contentChildren(CustomMenuItem);
  itemTexts = computed(() => this.items().map((item) => item.text));
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `,
})
export class UserProfile {}
```

`contentChildren`, sorgu sonuclarinin bir `Array`'ini iceren bir sinyal olusturur.

**Sorgular asla bilesen sinirlarini delmez.** Icerik sorgulari yalnizca bilesnenin kendisi ile ayni sablondaki sonuclari alabilir.

## Required queries

Bir alt sorgu (`viewChild` veya `contentChild`) sonuc bulamazsa, degeri `undefined` olur. Bu, hedef eleman `@if` veya `@for` gibi bir kontrol akisi ifadesi tarafindan gizlenmisse gerceklesebilir. Bu nedenle, alt sorgular deger turlerinde `undefined` iceren bir sinyal dondurur.

Bazi durumlarda, ozellikle `viewChild` ile, belirli bir alt elemanin her zaman mevcut oldugunu kesinlikle bilirsiniz. Diger durumlarda, belirli bir alt elemanin mevcut olmasini katici bir sekilde zorunlu kilmak isteyebilirsiniz. Bu durumlar icin _zorunlu sorgu_ kullanabilirsiniz.

```ts
@Component({
  /*...*/
})
export class CustomCard {
  header = viewChild.required(CustomCardHeader);
  body = contentChild.required(CustomCardBody);
}
```

Zorunlu bir sorgu eslesen bir sonuc bulamazsa, Angular bir hata bildirir. Bu bir sonucun mevcut oldugunu garanti ettigi icin, zorunlu sorgular sinyalin deger turune otomatik olarak `undefined` eklemez.

## Query locators

Her sorgu dekoratorunun ilk parametresi **konumlandirici**sidir (locator).

Cogunlukla konumlandirici olarak bir bilesen veya direktif kullanmak istersiniz.

Alternatif olarak, bir [sablon referans degiskeni](guide/templates/variables#template-reference-variables)'ne karsilik gelen bir dize konumlandirici belirtebilirsiniz.

```angular-ts
@Component({
  /*...*/
  template: `
    <button #save>Save</button>
    <button #cancel>Cancel</button>
  `,
})
export class ActionBar {
  saveButton = viewChild<ElementRef<HTMLButtonElement>>('save');
}
```

Birden fazla eleman ayni sablon referans degiskenini tanimliyorsa, sorgu eslesen ilk elemani alir.

Angular, sorgu konumlandiricilari olarak CSS secicilerini desteklemez.

### Queries and the injector tree

TIP: Saglayicilar ve Angular'in enjeksiyon agaci hakkinda arka plan bilgisi icin [Bagimlilik Enjeksiyonu](guide/di) belgesine bakin.

Daha ileri durumlar icin, konumlandirici olarak herhangi bir `ProviderToken` kullanabilirsiniz. Bu, bilesen ve direktif saglayicilarina dayali olarak elemanlari bulmaniza olanak tanir.

```angular-ts
const SUB_ITEM = new InjectionToken<string>('sub-item');

@Component({
  /*...*/
  providers: [{provide: SUB_ITEM, useValue: 'special-item'}],
})
export class SpecialItem {}

@Component({
  /*...*/
})
export class CustomList {
  subItemType = contentChild(SUB_ITEM);
}
```

Yukaridaki ornek konumlandirici olarak bir `InjectionToken` kullanir, ancak belirli elemanlari bulmak icin herhangi bir `ProviderToken` kullanabilirsiniz.

## Query options

Tum sorgu fonksiyonlari ikinci parametre olarak bir secenekler nesnesi kabul eder. Bu secenekler, sorgunun sonuclarini nasil bulacagini kontrol eder.

### Reading specific values from an element's injector

Varsayilan olarak, sorgu konumlandiricisi hem aradiginiz elemani hem de alinan degeri belirtir. Konumlandirici tarafindan eslestirilen elemandan farkli bir deger almak icin alternatif olarak `read` secenegini belirtebilirsiniz.

```ts
@Component({
  /*...*/
})
export class CustomExpando {
  toggle = contentChild(ExpandoContent, {read: TemplateRef});
}
```

Yukaridaki ornek, `ExpandoContent` direktifine sahip bir eleman bulur ve o elemanla iliskili `TemplateRef`'i alir.

Gelistiriciler en yaygin olarak `read` ile `ElementRef` ve `TemplateRef` alir.

### Content descendants

Varsayilan olarak, `contentChildren` sorgulari yalnizca bilesnenin _dogrudan_ alt elemanlarini bulur ve alt elemanlarin icerisine inmez.
`contentChild` sorgulari varsayilan olarak alt elemanlarin icerisine iner.

```angular-ts {highlight: [13, 14, 15, 16, 17]}
@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando {
  toggle = contentChildren(CustomToggle); // none found
  // toggle = contentChild(CustomToggle); // found
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <some-other-component>
        <custom-toggle>Show</custom-toggle>
      </some-other-component>
    </custom-expando>
  `,
})
export class UserProfile {}
```

Yukaridaki ornekte, `CustomExpando` `contentChildren` ile `<custom-toggle>`'i bulamaz cunku bu, `<custom-expando>`'nun dogrudan alt elemani degildir. `descendants: true` ayarlayarak, sorguyu ayni sablondaki tum alt elemanlara inecek sekilde yapilandirirsiniz. Ancak sorgular, diger sablonlardaki elemanlari gezmek icin _asla_ bilesenlerin icerisine girmez.

Gorunum sorgulari her zaman alt elemanlara indigi icin bu secenege sahip degildir.

## Decorator-based queries

TIP: Angular ekibi yeni projeler icin sinyal tabanli sorgu fonksiyonlarini onerse de, orijinal dekorator tabanli sorgu API'leri tamamen desteklenmeye devam etmektedir.

Alternatif olarak, karsilik gelen dekoratoru bir ozellige ekleyerek sorgular bildirebilirsiniz. Dekorator tabanli sorgular, asagida acikladigi durumlar disinda sinyal tabanli sorgularla ayni sekilde davranir.

### View queries {#decorator-view-queries}

`@ViewChild` dekoratoru ile tek bir sonuc icin sorgulama yapabilirsiniz.

```angular-ts {highlight: [14, 16, 17, 18]}
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard implements AfterViewInit {
  @ViewChild(CustomCardHeader) header: CustomCardHeader;

  ngAfterViewInit() {
    console.log(this.header.text);
  }
}
```

Bu ornekte, `CustomCard` bileseni bir alt `CustomCardHeader` icin sorgu yapar ve sonuca `ngAfterViewInit` icinde erisir.

Angular, uygulama durumunuz degistikce `@ViewChild` sonucunu guncel tutar.

**Gorunum sorgu sonuclari `ngAfterViewInit` yasam dongusu yonteminde kullanilabilir hale gelir**. Bu noktadan once deger `undefined` olur. Bilesen yasam dongusu hakkinda ayrintilar icin [Yasam Dongusu](guide/components/lifecycle) bolumune bakin.

`@ViewChildren` dekoratoru ile birden fazla sonuc icin de sorgulama yapabilirsiniz.

```angular-ts {highlight: [17, 19, 20, 21, 22, 23]}
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard implements AfterViewInit {
  @ViewChildren(CustomCardAction) actions: QueryList<CustomCardAction>;

  ngAfterViewInit() {
    this.actions.forEach((action) => {
      console.log(action.text);
    });
  }
}
```

`@ViewChildren`, sorgu sonuclarini iceren bir `QueryList` nesnesi olusturur. `changes` ozelligi araciligiyla sorgu sonuclarindaki degisikliklere zaman icinde abone olabilirsiniz.

### Content queries {#decorator-content-queries}

`@ContentChild` dekoratoru ile tek bir sonuc icin sorgulama yapabilirsiniz.

```angular-ts {highlight: [14, 16, 17, 18]}
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando implements AfterContentInit {
  @ContentChild(CustomToggle) toggle: CustomToggle;

  ngAfterContentInit() {
    console.log(this.toggle.text);
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `,
})
export class UserProfile {}
```

Bu ornekte, `CustomExpando` bileseni bir alt `CustomToggle` icin sorgu yapar ve sonuca `ngAfterContentInit` icinde erisir.

Angular, uygulama durumunuz degistikce `@ContentChild` sonucunu guncel tutar.

**Icerik sorgu sonuclari `ngAfterContentInit` yasam dongusu yonteminde kullanilabilir hale gelir**. Bu noktadan once deger `undefined` olur. Bilesen yasam dongusu hakkinda ayrintilar icin [Yasam Dongusu](guide/components/lifecycle) bolumune bakin.

`@ContentChildren` dekoratoru ile birden fazla sonuc icin de sorgulama yapabilirsiniz.

```angular-ts {highlight: [14, 16, 17, 18, 19, 20]}
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  /*...*/
})
export class CustomMenu implements AfterContentInit {
  @ContentChildren(CustomMenuItem) items: QueryList<CustomMenuItem>;

  ngAfterContentInit() {
    this.items.forEach((item) => {
      console.log(item.text);
    });
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `,
})
export class UserProfile {}
```

`@ContentChildren`, sorgu sonuclarini iceren bir `QueryList` nesnesi olusturur. `changes` ozelligi araciligiyla sorgu sonuclarindaki degisikliklere zaman icinde abone olabilirsiniz.

### Decorator-based query options

Tum sorgu dekoratorleri ikinci parametre olarak bir secenekler nesnesi kabul eder. Bu secenekler, asagida acikladigi durumlar disinda sinyal tabanli sorgularla ayni sekilde calisir.

### Static queries

`@ViewChild` ve `@ContentChild` dekoratorleri `static` secenegini kabul eder.

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard implements OnInit {
  @ViewChild(CustomCardHeader, {static: true}) header: CustomCardHeader;

  ngOnInit() {
    console.log(this.header.text);
  }
}
```

`static: true` ayarlayarak, Angular'a bu sorgunun hedefinin _her zaman_ mevcut oldugunu ve kosullu olarak render edilmedigini garanti edersiniz. Bu, sonucu daha erken, `ngOnInit` yasam dongusu yonteminde kullanilabilir kilar.

Statik sorgu sonuclari baslatmadan sonra guncellenmez.

`static` secenegi `@ViewChildren` ve `@ContentChildren` sorgulari icin mevcut degildir.

### Using QueryList

`@ViewChildren` ve `@ContentChildren` her ikisi de sonuclarin bir listesini iceren bir `QueryList` nesnesi saglar.

`QueryList`, `map`, `reduce` ve `forEach` gibi sonuclarla dizi benzeri bir sekilde calismanizi saglayan bir dizi kolaylik API'si sunar. Mevcut sonuclarin bir dizisini `toArray` cagirarak alabilirsiniz.

Sonuclar her degistiginde bir islem yapmak icin `changes` ozelligine abone olabilirsiniz.

## Common query pitfalls

Sorgulari kullanirken, yaygin tuzaklar kodunuzun anlasilmasini ve bakimini zorlastirabilir.

Birden fazla bilesen arasinda paylasilan durum icin her zaman tek bir dogru kaynagi koruyun. Bu, farkli bilesenlerdeki tekrarlanan durumun senkronizasyondan cikmasi senaryolarindan kacinir.

Alt bilesenlere dogrudan durum yazmayin. Bu kalip, anlasilmasi zor ve kirilgan koda ve [ExpressionChangedAfterItHasBeenChecked](errors/NG0100) hatalarina yol acabilir.

Ust veya ata bilesenlere asla dogrudan durum yazmayin. Bu kalip, anlasilmasi zor ve kirilgan koda ve [ExpressionChangedAfterItHasBeenChecked](errors/NG0100) hatalarina yol acabilir.
