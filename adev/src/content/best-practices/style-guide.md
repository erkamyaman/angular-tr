# Angular coding style guide

## Introduction

Bu kilavuz, Angular uygulama kodu icin bir dizi stil kuralini kapsamaktadir. Bu oneriler
Angular'in calismasi icin gerekli degildir, bunun yerine Angular ekosisteminde tutarlilik saglayan bir dizi kodlama pratigidir. Tutarli bir pratikler seti, kod paylasiminni ve projeler arasi gecisi kolaylastirir.

Bu kilavuz, Angular ile ilgili olmayan TypeScript veya genel kodlama pratiklerini _kapsamaz_. TypeScript icin
[Google'in TypeScript stil kilavuzuna](https://google.github.io/styleguide/tsguide.html) bakin.

### When in doubt, prefer consistency

Bu kurallarin belirli bir dosyanin stiliyle celisktigi bir durumla karsilastiginizda,
dosya icindeki tutarliligi korumaya oncelik verin. Tek bir
dosyada farkli stil kurallarini karistirmak, bu kilavuzdaki onerilerden sapmasindan daha fazla karisiliga neden olur.

## Naming

### Separate words in file names with hyphens

Bir dosya adindaki sozcukleri tire (`-`) ile ayirin. Ornegin, `UserProfile` adinda bir bilesen
`user-profile.ts` dosya adina sahiptir.

### Use the same name for a file's tests with `.spec` at the end

Birim testleri icin dosya adlarini `.spec.ts` ile bitirin. Ornegin,
`UserProfile` bileseni icin birim test dosyasi `user-profile.spec.ts` dosya adina sahiptir.

### Match file names to the TypeScript identifier within

Dosya adlari genellikle dosyadaki kodun icerigini tanimlamalidir. Dosya bir
TypeScript sinifi icerdiginde, dosya adi o sinif adini yansitmalidir. Ornegin,
`UserProfile` adinda bir bilesen iceren bir dosya `user-profile.ts` adina sahiptir.

Dosya birden fazla birincil adlandirilabilir tanimlayici iceriyorsa, icerdeki kodun ortak temasini
tanimlayan bir ad secin. Dosyadaki kod ortak bir tema veya ozellik
alani icinde uymuyorsa, kodu farkli dosyalara ayirmayi dusunun. `helpers.ts`, `utils.ts` veya `common.ts`
gibi asiri genel dosya adlarindan kacinin.

### Use the same file name for a component's TypeScript, template, and styles

Bilesenler tipik olarak bir TypeScript dosyasi, bir sablon dosyasi ve bir stil dosyasindan olusur. Bu
dosyalar farkli dosya uzantilariyla ayni adi paylasmalidir. Ornegin, bir `UserProfile`
bileseni `user-profile.ts`, `user-profile.html` ve `user-profile.css` dosyalarina sahip olabilir.

Bir bilesenin birden fazla stil dosyasi varsa, o dosyaya ozgu stilleri tanimlayan ek sozcuklerle adi ekleyin. Ornegin, `UserProfile`'in
`user-profile-settings.css` ve `user-profile-subscription.css` stil dosyalari olabilir.

## Project structure

### All the application's code goes in a directory named `src`

Tum Angular UI kodunuz (TypeScript, HTML ve stiller) `src` adinda bir dizinin
icinde yasamalidir. Yapilandirma dosyalari veya betikler gibi UI ile ilgili olmayan kod, `src` dizininin disinda yasamalidir.

Bu, kok uygulama dizinini farkli Angular projeleri arasinda tutarli tutar ve
projenizde UI kodu ile diger kod arasinda net bir ayrim olusturur.

### Bootstrap your application in a file named `main.ts` directly inside `src`

Bir Angular uygulamasini baslatmak veya **bootstrap** etmek icin gereken kod her zaman
`main.ts` adinda bir dosyada yasamalidir. Bu, uygulamanin birincil giris noktasini temsil eder.

### Group closely related files together in the same directory

Angular bilesenleri bir TypeScript dosyasi ve istege bagli olarak bir sablon ve bir veya daha fazla stil
dosyasindan olusur. Bunlari ayni dizinde gruplamaniz gerekir.

Birim testleri, test edilen kodla ayni dizinde yasamalidir. Ilgisiz testleri tek bir `tests` dizininde toplamaktan kacinin.

### Organize your project by feature areas

Projenizi, uygulamanizin ozelliklerine veya bu dizinlerdeki kodun ortak temalarina dayali olarak alt dizinlere organize edin. Ornegin, bir sinema sitesi olan MovieReel'in proje yapisi soyle gorunebilir:

```
src/
├─ movie-reel/
│ ├─ show-times/
│ │ ├─ film-calendar/
│ │ ├─ film-details/
│ ├─ reserve-tickets/
│ │ ├─ payment-info/
│ │ ├─ purchase-confirmation/
```

Bu dizinlerde bulunan kod turune dayali alt dizinler olusturmaktan kacinin. Ornegin,
`components`, `directives` ve `services` gibi dizinler olusturmaktan kacinin.

Bir dizine okunmasi veya gezinilmesi zor olacak kadar cok dosya koymaktan kacinin. Bir dizindeki dosya sayisi arttikca, ek alt dizinlere bolmeyi dusunun.

### One concept per file

Kaynak dosyalari tek bir _kavrama_ odaklanmayi tercih edin. Angular siniflari icin, bu genellikle
dosya basina bir bilesen, direktif veya servis anlamina gelir. Ancak, siniflariniz nispeten kucukse ve tek bir kavram olarak bir araya geliyorlarsa, bir dosyanin birden fazla bilesen veya direktif icermesi sorun degildir.

Supheliyseniz, daha kucuk dosyalara yol acan yaklasimla gidin.

## Dependency injection

### Prefer the `inject` function over constructor parameter injection

Constructor parametre enjeksiyonu yerine [`inject`](/api/core/inject) fonksiyonunu kullanmayi tercih edin. [`inject`](/api/core/inject) fonksiyonu constructor parametre enjeksiyonuyla ayni sekilde calisir, ancak cesitli stil avantajlari sunar:

- [`inject`](/api/core/inject), ozellikle bir sinif cok sayida bagimlilik enjekte ettiginde genellikle daha okunabilirdir.
- Enjekte edilen bagimliliklara yorum eklemek soz dizimsel olarak daha basittir
- [`inject`](/api/core/inject) daha iyi tip cikarimi sunar.
- ES2022+ hedeflendiginde [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig/#useDefineForClassFields) ile, enjekte edilen bagimliliklari okuyan alanlarda alan bildirimi ve baslatma islemini ayirmaktan kacinabilirsiniz.

[Mevcut kodu otomatik bir aracla `inject`'e yeniden duzenleyebilirsiniz](reference/migrations/inject-function).

## Components and directives

### Choosing component selectors

Bilesen secimleri hakkinda ayrintilar icin
[Bilesenler kilavuzuna](guide/components/selectors#choosing-a-selector) bakin.

### Naming component and directive members

Bilesenler kilavuzunda
[giris ozelliklerini adlandirma](guide/components/inputs#choosing-input-names)
ve [cikis ozelliklerini adlandirma](guide/components/outputs#choosing-event-names) hakkinda ayrintilar icin bakin.

### Choosing directive selectors

Direktifler, bilesenlerinizle ayni [uygulamaya ozgu oneki](guide/components/selectors#selector-prefixes) kullanmalidir.

Bir direktif icin ozellik secici kullanirken camelCase ozellik adi kullanin. Ornegin,
uygulamaniz "MovieReel" olarak adlandiriliyorsa ve bir elemana araç ipucu ekleyen bir direktif olusturuyorsaniz, `[mrTooltip]` secicisini kullanabilirsiniz.

### Group Angular-specific properties before methods

Bilesenler ve direktifler, Angular'a ozgu ozellikleri genellikle sinif bildiriminin ust kisimlarinda birlikte gruplamalidir. Bu, enjekte edilen bagimliliklari, girisleri, cikislari ve sorgulari icerir. Bunlari ve diger ozellikleri sinifin yontemlerinden once tanimlayin.

Bu uygulama, sinifin sablon API'lerini ve bagimliliklerini bulmay kolaylastirir.

### Keep components and directives focused on presentation

Bilesenlerinizin ve direktiflerinizin icindeki kod genellikle sayfada gosterilen kullanici arayuzu ile ilgili olmalidir. Kullanici arayuzunden bagimsiz olarak kendi basina anlam ifade eden kod icin, diger dosyalara yeniden duzenlemeyi tercih edin. Ornegin, form dogrulama kurallarini veya veri donusumlerini ayri fonksiyonlara veya siniflara cikarabilirsiniz.

### Avoid overly complex logic in templates

Angular sablonlari, [JavaScript benzeri ifadeleri](guide/templates/expression-syntax) barindirmak uzere tasarlanmistir.
Nispeten basit mantigi dogrudan sablon ifadelerinde yakalamak icin bu ifadelerden yararlanmalisiniz.

Sablondaki kod cok karmasik hale geldiginde, mantigi TypeScript koduna yeniden duzenleyin (tipik olarak bir [computed](guide/signals#computed-signals) ile).

"Karmasik"in ne oldugunu belirleyen kesin ve degismez bir kural yoktur. En iyi yarginizi kullanin.

### Use `protected` on class members that are only used by a component's template

Bir bilesen sinifinin public uyeleri, bagimlilik enjeksiyonu ve [sorgular](guide/components/queries) araciligiyla erisilebilir bir public API tanimlar. Bilesenin sablonundan okunmasi amaclanan uyeler icin `protected` erisimi tercih edin.

```ts
@Component({
  ...,
  template: `<p>{{ fullName() }}</p>`,
})
export class UserProfile {
  firstName = input();
  lastName = input();

// `fullName` is not part of the component's public API, but is used in the template.
  protected fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
}
```

### Use `readonly` for properties that shouldn't change

Angular tarafindan baslatilan bilesen ve direktif ozelliklerini `readonly` olarak isaretleyin. Bu,
`input`, `model`, `output` ve sorgular tarafindan baslatilan ozellikleri icerir. readonly erisim degistiricisi, Angular tarafindan ayarlanan degerin uzerine yazilmamasini saglar.

```ts
@Component({
  /*...*/
})
export class UserProfile {
  readonly userId = input();
  readonly userSaved = output();
  readonly userName = model();
}
```

Dekorator tabanli `@Input`, `@Output` ve sorgu API'lerini kullanan bilesenler ve direktifler icin, bu
tavsiye cikis ozelliklerine ve sorgulara uygulanir, ancak giris ozelliklerine uygulanmaz.

```ts
@Component({
  /*...*/
})
export class UserProfile {
  @Output() readonly userSaved = new EventEmitter<void>();
  @ViewChildren(PaymentMethod) readonly paymentMethods?: QueryList<PaymentMethod>;
}
```

### Prefer `class` and `style` over `ngClass` and `ngStyle`

[`NgClass`](/api/common/NgClass) ve [`NgStyle`](/api/common/NgStyle) direktiflerini kullanmak yerine `class` ve `style` baglamalarini tercih edin.

```html {prefer}
<div [class.admin]="isAdmin" [class.dense]="density === 'high'">
  <div [style.color]="textColor" [style.background-color]="backgroundColor">
    <!-- OR -->
    <div [class]="{admin: isAdmin, dense: density === 'high'}">
      <div [style]="{'color': textColor, 'background-color': backgroundColor}"></div>
    </div>
  </div>
</div>
```

```html {avoid}
<div [ngClass]="{admin: isAdmin, dense: density === 'high'}">
  <div [ngStyle]="{'color': textColor, 'background-color': backgroundColor}"></div>
</div>
```

Hem `class` hem de `style` baglamalari, standart HTML ozelliklerine yakindan uyum saglayan daha basit bir soz dizimi kullanir. Bu, sablonlarinizi okumay ve anlamayi kolaylastirir, ozellikle temel HTML'ye asina gelistiriciler icin.

Ek olarak, `NgClass` ve `NgStyle` direktifleri, yerlesik `class` ve `style` baglama soz dizimine kiyasla ek bir performans maliyeti getirir.

Daha fazla ayrinti icin [baglamalar kilavuzuna](/guide/templates/binding#css-class-and-style-property-bindings) bakin.

### Name event handlers for what they _do_, not for the triggering event

Olay isleyicilerini tetikleyen olay icin degil, gerceklestirdikleri eylem icin adlandirmayi tercih edin:

```html {prefer}
<button (click)="saveUserData()">Save</button>
```

```html {avoid}
<button (click)="handleClick()">Save</button>
```

Bunun gibi anlamli adlar kullanmak, bir olayin ne yaptigini sablonu okuyarak anlamayi kolaylastirir.

Klavye olaylari icin, belirli isleyici adlariyla Angular'in tus olayı degistiricilerini kullanabilirsiniz:

```html
<textarea (keydown.control.enter)="commitNotes()" (keydown.control.space)="showSuggestions()">
```

Bazen olay isleme mantigi ozellikle uzun veya karmasiktir, bu da tek bir iyi adlandirilmis isleyici bildirmeyi pratik olmaktan cikarir. Bu durumlarda, 'handleKeydown' gibi bir ada geri donmek ve ardindan olay ayrintilarina gore daha belirli davranislara devredmek sorun degildir:

```ts
@Component({
  /*...*/
})
class RichText {
  handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.key === 'B') {
        this.activateBold();
      } else if (event.key === 'I') {
        this.activateItalic();
      }
      // ...
    }
  }
}
```

### Keep lifecycle methods simple

`ngOnInit` gibi yasam dongusu kancalarina uzun veya karmasik mantik koymaktan kacinin. Bunun yerine, bu mantigi iceren iyi adlandirilmis yontemler olusturmayi ve ardindan yasam dongusu kancalarinizda _bu yontemleri cagirmayi_ tercih edin.
Yasam dongusu kanca adlari _ne zaman_ calistiklarini tanimlar, yani icerdeki kodun ne yaptigini tanimlayan anlamli bir adi yoktur.

```ts {prefer}
ngOnInit() {
  this.startLogging();
  this.runBackgroundTask();
}
```

```ts {avoid}
ngOnInit() {
  this.logger.setMode('info');
  this.logger.monitorErrors();
  // ...and all the rest of the code that would be unrolled from these methods.
}
```

### Use lifecycle hook interfaces

Angular, her yasam dongusu yontemi icin bir TypeScript arayuzu saglar. Siniflariniza bir yasam dongusu kancasi eklerken, yontemlerin dogru adlandirilmasini saglamak icin bu arayuzleri iceri aktarin ve `implement` edin.

```ts
import {Component, OnInit} from '@angular/core';

@Component({
  /*...*/
})
export class UserProfile implements OnInit {
  // The `OnInit` interface ensures this method is named correctly.
  ngOnInit() {
    /* ... */
  }
}
```
