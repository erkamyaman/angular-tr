# Sorgularla bileşen alt elemanlarına referans verme

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okuduğunuzu varsayar. Angular'da yeniyseniz önce onu okuyun.

Bir bileşen, alt elemanları bulan ve injector'larından değer okuyan **sorgular** tanımlayabilir.

Geliştiriciler en yaygın olarak alt bileşenlere, direktiflere, DOM elemanlarına ve daha fazlasına referanslar almak için sorguları kullanır.

Tüm sorgu fonksiyonları, en güncel sonuçları yansıtan sinyaller döndürür. `computed` ve `effect` gibi [reaktif bağlamlar](guide/signals#reactive-contextler) dahil olmak üzere sinyal fonksiyonunu çağırarak sonucu okuyabilirsiniz.

İki sorgu kategorisi vardır: **görünüm sorguları** ve **içerik sorguları.**

## Görünüm sorguları

Görünüm sorguları, bileşenin _görünümündeki_ -- bileşenin kendi şablonunda tanımlanan -- elemanlardan sonuçları alır. Tek bir sonuç için `viewChild` fonksiyonu ile sorgulama yapabilirsiniz.

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

Bu örnekte, `CustomCard` bileşeni bir alt `CustomCardHeader` için sorgu yapar ve sonucu bir `computed` içinde kullanır.

Sorgu bir sonuç bulamazsa, değeri `undefined` olur. Bu, hedef eleman `@if` tarafından gizlenmişse gerçekleşebilir. Angular, uygulama durumunuz değiştikçe `viewChild` sonucunu güncel tutar.

`viewChildren` fonksiyonu ile birden fazla sonuç için de sorgulama yapabilirsiniz.

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

`viewChildren`, sorgu sonuçlarının bir `Array`'ini içeren bir sinyal oluşturur.

**Sorgular asla bileşen sınırlarını delmez.** Görünüm sorguları yalnızca bileşenin şablonundan sonuç alabilir.

## İçerik sorguları

İçerik sorguları, bileşenin _içeriğindeki_ -- bileşenin kullanıldığı şablonda bileşenin içerisine yuvalanan -- elemanlardan sonuçları alır. Tek bir sonuç için `contentChild` fonksiyonu ile sorgulama yapabilirsiniz.

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
  // CustomToggle, içerik olarak CustomExpando içinde kullanılır.
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `,
})
export class UserProfile {}
```

Sorgu bir sonuç bulamazsa, değeri `undefined` olur. Bu, hedef eleman mevcut değilse veya `@if` tarafından gizlenmişse gerçekleşebilir. Angular, uygulama durumunuz değiştikçe `contentChild` sonucunu güncel tutar.

Varsayılan olarak, içerik sorguları yalnızca bileşenin _doğrudan_ alt elemanlarını bulur ve alt elemanların içerisine inmez.

`contentChildren` fonksiyonu ile birden fazla sonuç için de sorgulama yapabilirsiniz.

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

`contentChildren`, sorgu sonuçlarının bir `Array`'ini içeren bir sinyal oluşturur.

**Sorgular asla bileşen sınırlarını delmez.** İçerik sorguları yalnızca bileşenin kendisi ile aynı şablondaki sonuçları alabilir.

## Zorunlu sorgular

Bir alt sorgu (`viewChild` veya `contentChild`) sonuç bulamazsa, değeri `undefined` olur. Bu, hedef eleman `@if` veya `@for` gibi bir kontrol akışı ifadesi tarafından gizlenmişse gerçekleşebilir. Bu nedenle, alt sorgular değer türlerinde `undefined` içeren bir sinyal döndürür.

Bazı durumlarda, özellikle `viewChild` ile, belirli bir alt elemanın her zaman mevcut olduğunu kesinlikle bilirsiniz. Diğer durumlarda, belirli bir alt elemanın mevcut olmasını katı bir şekilde zorunlu kılmak isteyebilirsiniz. Bu durumlar için _zorunlu sorgu_ kullanabilirsiniz.

```ts
@Component({
  /*...*/
})
export class CustomCard {
  header = viewChild.required(CustomCardHeader);
  body = contentChild.required(CustomCardBody);
}
```

Zorunlu bir sorgu eşleşen bir sonuç bulamazsa, Angular bir hata bildirir. Bu bir sonucun mevcut olduğunu garanti ettiği için, zorunlu sorgular sinyalin değer türüne otomatik olarak `undefined` eklemez.

## Sorgu konumlandırıcıları

Her sorgu dekoratörünün ilk parametresi **konumlandırıcı**sıdır (locator).

Çoğunlukla konumlandırıcı olarak bir bileşen veya direktif kullanmak istersiniz.

Alternatif olarak, bir [şablon referans değişkeni](guide/templates/variables#şablon-referans-değişkenleri)'ne karşılık gelen bir dize konumlandırıcı belirtebilirsiniz.

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

Birden fazla eleman aynı şablon referans değişkenini tanımlıyorsa, sorgu eşleşen ilk elemanı alır.

Angular, sorgu konumlandırıcıları olarak CSS seçicilerini desteklemez.

### Sorgular ve injector ağacı

TIP: Sağlayıcılar ve Angular'ın enjeksiyon ağacı hakkında arka plan bilgisi için [Bağımlılık Enjeksiyonu](guide/di) belgesine bakın.

Daha ileri durumlar için, konumlandırıcı olarak herhangi bir `ProviderToken` kullanabilirsiniz. Bu, bileşen ve direktif sağlayıcılarına dayalı olarak elemanları bulmanıza olanak tanır.

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

Yukarıdaki örnek konumlandırıcı olarak bir `InjectionToken` kullanır, ancak belirli elemanları bulmak için herhangi bir `ProviderToken` kullanabilirsiniz.

## Sorgu seçenekleri

Tüm sorgu fonksiyonları ikinci parametre olarak bir seçenekler nesnesi kabul eder. Bu seçenekler, sorgunun sonuçlarını nasıl bulacağını kontrol eder.

### Bir elemanın injector'ından belirli değerleri okuma

Varsayılan olarak, sorgu konumlandırıcısı hem aradığınız elemanı hem de alınan değeri belirtir. Konumlandırıcı tarafından eşleştirilen elemandan farklı bir değer almak için alternatif olarak `read` seçeneğini belirtebilirsiniz.

```ts
@Component({
  /*...*/
})
export class CustomExpando {
  toggle = contentChild(ExpandoContent, {read: TemplateRef});
}
```

Yukarıdaki örnek, `ExpandoContent` direktifine sahip bir eleman bulur ve o elemanla ilişkili `TemplateRef`'i alır.

Geliştiriciler en yaygın olarak `read` ile `ElementRef` ve `TemplateRef` alır.

### İçerik alt elemanları

Varsayılan olarak, `contentChildren` sorguları yalnızca bileşenin _doğrudan_ alt elemanlarını bulur ve alt elemanların içerisine inmez.
`contentChild` sorguları varsayılan olarak alt elemanların içerisine iner.

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

Yukarıdaki örnekte, `CustomExpando` `contentChildren` ile `<custom-toggle>`'ı bulamaz çünkü bu, `<custom-expando>`'nun doğrudan alt elemanı değildir. `descendants: true` ayarlayarak, sorguyu aynı şablondaki tüm alt elemanlara inecek şekilde yapılandırırsınız. Ancak sorgular, diğer şablonlardaki elemanları gezmek için _asla_ bileşenlerin içerisine girmez.

Görünüm sorguları her zaman alt elemanlara indiği için bu seçeneğe sahip değildir.

## Dekoratör tabanlı sorgular

TIP: Angular ekibi yeni projeler için sinyal tabanlı sorgu fonksiyonlarını önerse de, orijinal dekoratör tabanlı sorgu API'leri tamamen desteklenmeye devam etmektedir.

Alternatif olarak, karşılık gelen dekoratörü bir özelliğe ekleyerek sorgular bildirebilirsiniz. Dekoratör tabanlı sorgular, aşağıda açıkladığı durumlar dışında sinyal tabanlı sorgularla aynı şekilde davranır.

### Görünüm sorguları {#decorator-view-queries}

`@ViewChild` dekoratörü ile tek bir sonuç için sorgulama yapabilirsiniz.

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

Bu örnekte, `CustomCard` bileşeni bir alt `CustomCardHeader` için sorgu yapar ve sonuca `ngAfterViewInit` içinde erişir.

Angular, uygulama durumunuz değiştikçe `@ViewChild` sonucunu güncel tutar.

**Görünüm sorgu sonuçları `ngAfterViewInit` yaşam döngüsü yönteminde kullanılabilir hale gelir**. Bu noktadan önce değer `undefined` olur. Bileşen yaşam döngüsü hakkında ayrıntılar için [Yaşam Döngüsü](guide/components/lifecycle) bölümüne bakın.

`@ViewChildren` dekoratörü ile birden fazla sonuç için de sorgulama yapabilirsiniz.

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

`@ViewChildren`, sorgu sonuçlarını içeren bir `QueryList` nesnesi oluşturur. `changes` özelliği aracılığıyla sorgu sonuçlarındaki değişikliklere zaman içinde abone olabilirsiniz.

### İçerik sorguları {#decorator-content-queries}

`@ContentChild` dekoratörü ile tek bir sonuç için sorgulama yapabilirsiniz.

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

Bu örnekte, `CustomExpando` bileşeni bir alt `CustomToggle` için sorgu yapar ve sonuca `ngAfterContentInit` içinde erişir.

Angular, uygulama durumunuz değiştikçe `@ContentChild` sonucunu güncel tutar.

**İçerik sorgu sonuçları `ngAfterContentInit` yaşam döngüsü yönteminde kullanılabilir hale gelir**. Bu noktadan önce değer `undefined` olur. Bileşen yaşam döngüsü hakkında ayrıntılar için [Yaşam Döngüsü](guide/components/lifecycle) bölümüne bakın.

`@ContentChildren` dekoratörü ile birden fazla sonuç için de sorgulama yapabilirsiniz.

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

`@ContentChildren`, sorgu sonuçlarını içeren bir `QueryList` nesnesi oluşturur. `changes` özelliği aracılığıyla sorgu sonuçlarındaki değişikliklere zaman içinde abone olabilirsiniz.

### Dekoratör tabanlı sorgu seçenekleri

Tüm sorgu dekoratörleri ikinci parametre olarak bir seçenekler nesnesi kabul eder. Bu seçenekler, aşağıda açıkladığı durumlar dışında sinyal tabanlı sorgularla aynı şekilde çalışır.

### Statik sorgular

`@ViewChild` ve `@ContentChild` dekoratörleri `static` seçeneğini kabul eder.

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

`static: true` ayarlayarak, Angular'a bu sorgunun hedefinin _her zaman_ mevcut olduğunu ve koşullu olarak render edilmediğini garanti edersiniz. Bu, sonucu daha erken, `ngOnInit` yaşam döngüsü yönteminde kullanılabilir kılar.

Statik sorgu sonuçları başlatmadan sonra güncellenmez.

`static` seçeneği `@ViewChildren` ve `@ContentChildren` sorguları için mevcut değildir.

### QueryList kullanımı

`@ViewChildren` ve `@ContentChildren` her ikisi de sonuçların bir listesini içeren bir `QueryList` nesnesi sağlar.

`QueryList`, `map`, `reduce` ve `forEach` gibi sonuçlarla dizi benzeri bir şekilde çalışmanızı sağlayan bir dizi kolaylık API'si sunar. Mevcut sonuçların bir dizisini `toArray` çağırarak alabilirsiniz.

Sonuçlar her değiştiğinde bir işlem yapmak için `changes` özelliğine abone olabilirsiniz.

## Yaygın sorgu tuzakları

Sorguları kullanırken, yaygın tuzaklar kodunuzun anlaşılmasını ve bakımını zorlaştırabilir.

Birden fazla bileşen arasında paylaşılan durum için her zaman tek bir doğru kaynağı koruyun. Bu, farklı bileşenlerdeki tekrarlanan durumun senkronizasyondan çıkması senaryolarından kaçınır.

Alt bileşenlere doğrudan durum yazmayın. Bu kalıp, anlaşılması zor ve kırılgan koda ve [ExpressionChangedAfterItHasBeenChecked](errors/NG0100) hatalarına yol açabilir.

Üst veya ata bileşenlere asla doğrudan durum yazmayın. Bu kalıp, anlaşılması zor ve kırılgan koda ve [ExpressionChangedAfterItHasBeenChecked](errors/NG0100) hatalarına yol açabilir.
