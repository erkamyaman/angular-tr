# Styling components

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okudugunuzu varsayar. Angular'da yeniyseniz once onu okuyun.

Bilesenlere istege bagli olarak o bilesnenin DOM'una uygulanan CSS stilleri dahil edilebilir:

```angular-ts {highlight:[4]}
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo" />`,
  styles: `
    img {
      border-radius: 50%;
    }
  `,
})
export class ProfilePhoto {}
```

Stillerinizi ayri dosyalarda yazmayi da secebilirsiniz:

```angular-ts {highlight:[4]}
@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto {}
```

Angular bilesneninizi derlediginde, bu stiller bilesneninizin JavaScript ciktisiyla birlikte yayilir. Bu, bilesen stillerinin JavaScript modul sistemine katildigi anlamina gelir. Bir Angular bilesneni render ettiginizde, bir bileseni tembel yuklerken bile framework otomatik olarak iliskili stilleri dahil eder.

Angular, CSS ciktisi ureten herhangi bir aracla calisir; bunlara [Sass](https://sass-lang.com), [less](https://lesscss.org) ve [stylus](https://stylus-lang.com) dahildir.

## Style scoping

Her bilesen, framework'un bilesnenin stillerini nasil kapsulleyecegini belirleyen bir **gorunum kapsullemesi** ayarina sahiptir. Dort gorunum kapsullemesi modu vardir: `Emulated`, `ShadowDom`, `ExperimentalIsolatedShadowDom` ve `None`.
Modu `@Component` dekoratorunde belirtebilirsiniz:

```angular-ts {highlight:[3]}
@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePhoto { }
```

### ViewEncapsulation.Emulated

Varsayilan olarak Angular, bir bilesnenin stillerinin yalnizca o bilesnenin sablonunda tanimlanan elemanlara uygulanmasi icin emule edilmis kapsulleme kullanir. Bu modda framework, her bilesen ornegi icin benzersiz bir HTML niteligi olusturur, bu niteligi bilesnenin sablonundaki elemanlara ekler ve bu niteligi bileseninizin stillerinde tanimlanan CSS secicilerine ekler.

Bu mod, bir bilesnenin stillerinin disari sizmasini ve diger bilesenleri etkilemesini onler. Ancak, bir bilesnenin disinda tanimlanan genel stiller, emule edilmis kapsullemeye sahip bir bilesnenin icerisindeki elemanlari yine de etkileyebilir.

Emule edilmis modda Angular, [`:host`](https://developer.mozilla.org/docs/Web/CSS/:host) sahte sinifini destekler. [`:host-context()`](https://developer.mozilla.org/docs/Web/CSS/:host-context) sahte sinifi modern tarayicilarda kullanimdan kaldirilmis olsa da, Angular'in derleyicisi buna tam destek saglar. Her iki sahte sinif da yerel [Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)'a bagli olmadan kullanilabilir. Derleme sirasinda framework, bu sahte siniflari niteliklere donusturur, dolayisiyla calisma zamaninda bu yerel sahte siniflarin kurallarina (ornegin tarayici uyumlulugu, ozgulluk) uymaz. Angular'in emule edilmis kapsulleme modu, `::shadow` veya `::part` gibi Shadow DOM ile ilgili diger sahte siniflari desteklemez.

#### `::ng-deep`

Angular'in emule edilmis kapsulleme modu ozel bir sahte sinif olan `::ng-deep`'i destekler.
**Angular ekibi `::ng-deep`'in yeni kullanimini kesinlikle tavsiye etmez.** Bu API'ler yalnizca geriye donuk uyumluluk icin mevcuttur.

Bir secici `::ng-deep` icerdiginde, Angular secicideki o noktadan sonra gorunum kapsulleme sinirlarini uygulamayi durdurur. `::ng-deep`'i izleyen secicinin herhangi bir bolumu, bilesnenin sablonu disindaki elemanlarla eslesebilir.

Ornegin:

- `p a` gibi bir CSS kural secicisi, emule edilmis kapsulleme ile, bilesnenin kendi sablonundaki bir `<p>` elemaninin alt elemanlari olan `<a>` elemanlarini eslestirir, her ikisi de bilesnenin kendi sablonu icerisindedir.

- `::ng-deep p a` gibi bir secici, uygulamadaki herhangi bir yerdeki bir `<p>` elemaninin alt elemanlari olan `<a>` elemanlarini eslestirir.

  Bu, etkili bir sekilde genel bir stil gibi davranmasini saglar.

- `p ::ng-deep a` ifadesinde, Angular `<p>` elemaninin bilesnenin kendi sablonundan gelmesini gerektirir, ancak `<a>` elemani uygulamadaki herhangi bir yerde olabilir.

  Dolayisiyla, `<a>` elemani bilesnenin sablonunda veya yansitilan ya da alt iceriginin herhangi birinde olabilir.

- `:host ::ng-deep p a` ifadesinde, hem `<a>` hem de `<p>` elemanlari bilesnenin host elemaninin alt elemanlari olmalidir.

  Bilesnenin sablonundan veya alt bilesenlerinin gorunumlerinden gelebilirler, ancak uygulamanin baska bir yerinden gelemezler.

### ViewEncapsulation.ShadowDom

Bu mod, [web standardi Shadow DOM API](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)'sini kullanarak bir bilesen icindeki stilleri kapsulller. Bu mod etkinlestirildiginde Angular, bilesnenin host elemanina bir golge koku (shadow root) ekler ve bilesnenin sablonunu ve stillerini karsilik gelen golge agacina render eder.

Golge agacinin icindeki stiller, o golge agacinin disindaki elemanlari etkileyemez.

Ancak `ShadowDom` kapsullemesini etkinlestirmek, stil kapsulemesinden daha fazlasini etkiler. Bileseni bir golge agacinda render etmek, olay yayilimini, [`<slot>` API](https://developer.mozilla.org/docs/Web/Web_Components/Using_templates_and_slots)'si ile etkilesimi ve tarayici gelistirici araclarinin elemanlari nasil gosterdigini etkiler. Uygulamanizda Shadow DOM kullanmanin tum sonuclarini her zaman anlayin ve bu secenegi etkinlestirmeden once bilin.

### ViewEncapsulation.ExperimentalIsolatedShadowDom

Yukaridakiyle ayni sekilde davranir, ancak bu mod yalnizca o bilesnenin stillerinin bilesnenin sablonundaki elemanlara uygulanacagini kesinlikle garanti eder. Genel stiller golge agacindaki elemanlari etkileyemez ve golge agacinin icindeki stiller o golge agacinin disindaki elemanlari etkileyemez.

### ViewEncapsulation.None

Bu mod, bilesen icin tum stil kapsullemesini devre disi birakir. Bilesne ile iliskili herhangi bir stil, genel stiller gibi davranir.

NOTE: `Emulated` ve `ShadowDom` modlarinda Angular, bilesnenizin stillerinin bilesnenin disindaki stilleri her zaman gecersiz kilacagini %100 garanti etmez. Cakisma durumunda bu stillerin bilesneninizin stilleriyle ayni ozgulluge sahip oldugu varsayilir.

## Defining styles in templates

Ek stiller tanimlamak icin bilesnenin sablonunda `<style>` elemanini kullanabilirsiniz. Bilesnenin gorunum kapsulleme modu, bu sekilde tanimlanan stillere de uygulanir.

Angular, stil elemanlari icerisindeki baglamalari desteklemez.

## Referencing external style files

Bilesen sablonlari, CSS dosyalarina referans vermek icin [`<link>` elemani](https://developer.mozilla.org/docs/Web/HTML/Element/link)'ni kullanabilir. Ek olarak, CSS'iniz CSS dosyalarina referans vermek icin [`@import` at-kurali](https://developer.mozilla.org/docs/Web/CSS/@import)'ni kullanabilir. Angular bu referanslari _harici_ stiller olarak degerlendirir. Harici stiller, emule edilmis gorunum kapsullemesinden etkilenmez.
