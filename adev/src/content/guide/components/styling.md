# Bileşenleri stillendirme

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okuduğunuzu varsayar. Angular'da yeniyseniz önce onu okuyun.

Bileşenlere isteğe bağlı olarak o bileşenin DOM'una uygulanan CSS stilleri dahil edilebilir:

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

Stillerinizi ayrı dosyalarda yazmayı da seçebilirsiniz:

```angular-ts {highlight:[4]}
@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto {}
```

Angular bileşeninizi derlediğinde, bu stiller bileşeninizin JavaScript çıktısıyla birlikte yayılır. Bu, bileşen stillerinin JavaScript modül sistemine katıldığı anlamına gelir. Bir Angular bileşeni render ettiğinizde, bir bileşeni tembel yüklerken bile framework otomatik olarak ilişkili stilleri dahil eder.

Angular, CSS çıktısı üreten herhangi bir araçla çalışır; bunlara [Sass](https://sass-lang.com), [Less](https://lesscss.org) ve [Stylus](https://stylus-lang.com) dahildir.

## Stil kapsamı {#style-scoping}

Her bileşen, framework'ün bileşenin stillerini nasıl kapsülleyeceğini belirleyen bir **görünüm kapsüllemesi** ayarına sahiptir. Dört görünüm kapsüllemesi modu vardır: `Emulated`, `ShadowDom`, `ExperimentalIsolatedShadowDom` ve `None`.
Modu `@Component` dekoratöründe belirtebilirsiniz:

```angular-ts {highlight:[3]}
@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePhoto { }
```

### ViewEncapsulation.Emulated

Varsayılan olarak Angular, bir bileşenin stillerinin yalnızca o bileşenin şablonunda tanımlanan elemanlara uygulanması için emüle edilmiş kapsülleme kullanır. Bu modda framework, her bileşen örneği için benzersiz bir HTML niteliği oluşturur, bu niteliği bileşenin şablonundaki elemanlara ekler ve bu niteliği bileşeninizin stillerinde tanımlanan CSS seçicilerine ekler.

Bu mod, bir bileşenin stillerinin dışarı sızmasını ve diğer bileşenleri etkilemesini önler. Ancak, bir bileşenin dışında tanımlanan genel stiller, emüle edilmiş kapsüllemeye sahip bir bileşenin içerisindeki elemanları yine de etkileyebilir.

Emüle edilmiş modda Angular, [`:host`](https://developer.mozilla.org/docs/Web/CSS/:host) sahte sınıfını destekler. [`:host-context()`](https://developer.mozilla.org/docs/Web/CSS/:host-context) sahte sınıfı modern tarayıcılarda kullanımdan kaldırılmış olsa da, Angular'ın derleyicisi buna tam destek sağlar. Her iki sahte sınıf da yerel [Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)'a bağlı olmadan kullanılabilir. Derleme sırasında framework, bu sahte sınıfları niteliklere dönüştürür, dolayısıyla çalışma zamanında bu yerel sahte sınıfların kurallarına (örneğin tarayıcı uyumluluğu, özgüllük) uymaz. Angular'ın emüle edilmiş kapsülleme modu, `::shadow` veya `::part` gibi Shadow DOM ile ilgili diğer sahte sınıfları desteklemez.

#### `::ng-deep`

Angular'ın emüle edilmiş kapsülleme modu özel bir sahte sınıf olan `::ng-deep`'i destekler.
**Angular ekibi `::ng-deep`'in yeni kullanımını kesinlikle tavsiye etmez.** Bu API'ler yalnızca geriye dönük uyumluluk için mevcuttur.

Bir seçici `::ng-deep` içerdiğinde, Angular seçicideki o noktadan sonra görünüm kapsülleme sınırlarını uygulamayı durdurur. `::ng-deep`'i izleyen seçicinin herhangi bir bölümü, bileşenin şablonu dışındaki elemanlarla eşleşebilir.

Örneğin:

- `p a` gibi bir CSS kural seçicisi, emüle edilmiş kapsülleme ile, bileşenin kendi şablonundaki bir `<p>` elemanının alt elemanları olan `<a>` elemanlarını eşleştirir, her ikisi de bileşenin kendi şablonu içerisindedir.

- `::ng-deep p a` gibi bir seçici, uygulamadaki herhangi bir yerdeki bir `<p>` elemanının alt elemanları olan `<a>` elemanlarını eşleştirir.

  Bu, etkili bir şekilde genel bir stil gibi davranmasını sağlar.

- `p ::ng-deep a` ifadesinde, Angular `<p>` elemanının bileşenin kendi şablonundan gelmesini gerektirir, ancak `<a>` elemanı uygulamadaki herhangi bir yerde olabilir.

  Dolayısıyla, `<a>` elemanı bileşenin şablonunda veya yansıtılan ya da alt içeriğinin herhangi birinde olabilir.

- `:host ::ng-deep p a` ifadesinde, hem `<a>` hem de `<p>` elemanları bileşenin host elemanının alt elemanları olmalıdır.

  Bileşenin şablonundan veya alt bileşenlerinin görünümlerinden gelebilirler, ancak uygulamanın başka bir yerinden gelemezler.

### ViewEncapsulation.ShadowDom

Bu mod, [web standartı Shadow DOM API](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM)'sini kullanarak bir bileşen içindeki stilleri kapsüller. Bu mod etkinleştirildiğinde Angular, bileşenin host elemanına bir gölge kökü (shadow root) ekler ve bileşenin şablonunu ve stillerini karşılık gelen gölge ağacına render eder.

Gölge ağacının içindeki stiller, o gölge ağacının dışındaki elemanları etkileyemez.

Ancak `ShadowDom` kapsüllemesini etkinleştirmek, stil kapsülemesinden daha fazlasını etkiler. Bileşeni bir gölge ağacında render etmek, olay yayılımını, [`<slot>` API](https://developer.mozilla.org/docs/Web/Web_Components/Using_templates_and_slots)'si ile etkileşimi ve tarayıcı geliştirici araçlarının elemanları nasıl gösterdiğini etkiler. Uygulamanızda Shadow DOM kullanmanın tüm sonuçlarını her zaman anlayın ve bu seçeneği etkinleştirmeden önce bilin.

### ViewEncapsulation.ExperimentalIsolatedShadowDom

Yukarıdakiyle aynı şekilde davranır, ancak bu mod yalnızca o bileşenin stillerinin bileşenin şablonundaki elemanlara uygulanacağını kesinlikle garanti eder. Genel stiller gölge ağacındaki elemanları etkileyemez ve gölge ağacının içindeki stiller o gölge ağacının dışındaki elemanları etkileyemez.

### ViewEncapsulation.None

Bu mod, bileşen için tüm stil kapsüllemesini devre dışı bırakır. Bileşen ile ilişkili herhangi bir stil, genel stiller gibi davranır.

NOTE: `Emulated` ve `ShadowDom` modlarında Angular, bileşenizin stillerinin bileşenin dışındaki stilleri her zaman geçersiz kılacağını %100 garanti etmez. Çakışma durumunda bu stillerin bileşeninizin stilleriyle aynı özgüllüğe sahip olduğu varsayılır.

## Şablonlarda stil tanımlama {#defining-styles-in-templates}

Ek stiller tanımlamak için bileşenin şablonunda `<style>` elemanını kullanabilirsiniz. Bileşenin görünüm kapsülleme modu, bu şekilde tanımlanan stillere de uygulanır.

Angular, stil elemanları içerisindeki bağlamaları desteklemez.

## Harici stil dosyalarına referans verme {#referencing-external-style-files}

Bileşen şablonları, CSS dosyalarına referans vermek için [`<link>` elemanı](https://developer.mozilla.org/docs/Web/HTML/Element/link)'nı kullanabilir. Ek olarak, CSS'iniz CSS dosyalarına referans vermek için [`@import` at-kuralı](https://developer.mozilla.org/docs/Web/CSS/@import)'nı kullanabilir. Angular bu referansları _harici_ stiller olarak değerlendirir. Harici stiller, emüle edilmiş görünüm kapsüllemesinden etkilenmez.

## CSS özel özelliklerini ad alanına alma {#namespacing-css-custom-properties}

Angular, bileşen stillerinizin tanımladığı ve okuduğu CSS özel özelliklerine (CSS değişkenleri olarak da
bilinir) bir önek ekleyebilir. Özel özellikler DOM ağacında aşağı doğru kalıtılır; bu nedenle uygulamanızın
dışındaki bir şey, bir üst eleman üzerinde `--primary-color` gibi bir özel özellik tanımladığında,
bileşenleriniz bu değeri okur. Bu durum, uygulamanız bir sayfayı başka bir uygulamayla veya kontrol
etmediğiniz işaretlemeyle paylaştığında önem kazanır. Angular, siz istemediğiniz sürece özel özellikleri
ad alanına almaz ve kendi sayfasının sahibi olan bir uygulamanın ad alanına almaya ihtiyacı yoktur.

Bileşen stillerinizdeki özel özellikleri uygulamanıza kapsamlamak için uygulamanızın sağlayıcılarına
[`provideCssVarNamespacing`](api/platform-browser/provideCssVarNamespacing) ekleyin. Bu, uygulamanın
[`APP_ID`](api/core/APP_ID) değerini ad alanı olarak kullanır:

```ts {header: "app.config.ts"}
import {APP_ID, ApplicationConfig} from '@angular/core';
import {provideCssVarNamespacing} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [{provide: APP_ID, useValue: 'my-app'}, provideCssVarNamespacing()],
};
```

Angular, bileşen stillerinizdeki özel özelliklere bu ad alanını ve ardından bir alt çizgiyi önek olarak
ekler; böylece `--primary-color`, `--my-app_primary-color` olur. Önek; bildirimlere, `var()`
referanslarına, `@property` kurallarına ve `[style.--primary-color]` gibi stil bağlamalarına
uygulanır. Buna, bir bileşenin `host` nesnesinde bildirdiği stil bağlamaları da dahildir.

`APP_ID`, siz ayarlamadığınız sürece `ng`'dir; bu yüzden sayfadaki her uygulamaya kendi `APP_ID`
değerini verin. Aksi halde uygulamalar aynı öneki paylaşır ve yine çakışır. Uygulama kimliğinden farklı
bir ad alanı kullanmak için bunu `provideCssVarNamespacing`'e geçirin. Alt çizgiyi Angular kendisi ekler:
`provideCssVarNamespacing('my-app_')`, `--my-app__primary-color` üretir.

Angular, bir bileşene derlediği stilleri ad alanına alır: bileşenin `styles` ve `styleUrl` değerleri,
şablonunda [bir `<style>` elemanında yazdığınız](#defining-styles-in-templates) stiller, şablonunun göreli
bir `<link rel="stylesheet">` ile referans verdiği stil dosyaları ve `ViewEncapsulation.None` kullanan
bir bileşenin stilleri. Angular, tarayıcının çalışma zamanında yüklediği bir stil dosyasını, örneğin
derleme yapılandırmanızın listelediği genel bir stil dosyasını veya derlemenizin satır içine almadığı
[harici bir stili](#referencing-external-style-files) ad alanına almaz.

Ad alanına alma, Angular'ın derlediği her bileşene uygulanır; yüklediğiniz kütüphanelerin bileşenleri
de buna dahildir. Bir kütüphanenin stilleri, genel bir stil dosyasının tanımladığı bir özel özelliği
(bir temanın özellikleri gibi) okuduğunda, referans artık eşleşmez; tarayıcı varsa `var()` yedek
değerini, yoksa
[özelliğin kalıtılan veya başlangıç değerini](https://www.w3.org/TR/css-variables-1/#invalid-variables)
kullanır ve hiçbir şey hata bildirmez. Mevcut bir uygulamada ad alanına almayı etkinleştirmeden önce,
genel stil dosyalarınız ile bileşenleriniz arasında geçen özel özellikleri gözden geçirin.

IMPORTANT: Angular, özel özellik adlarını yalnızca derlediği stillerde ve bağlamalarda yeniden yazar.
Diğer her yer, yazdığınız adı korur ve hiçbir şey uyumsuzluğu bildirmez.

Angular, adı şu yerlerde yeniden yazmaz:

- `style="--primary-color: red"` gibi statik style öznitelikleri; bir bileşenin `host` nesnesindeki
  `style` girdisi de dahildir.
- `[style]="{'--primary-color': color}"`, `[style]="'--primary-color: red'"` ve `ngStyle` gibi nesne
  ve string stil bağlamaları; bir bileşenin `host` nesnesindeki `[style]` girdisi de dahildir.
- `[style.border-color]="'var(--primary-color)'"` gibi bir bağlamanın değeri içindeki özel özellik adları.
- `Renderer2.setStyle` çağrıları.

Bunların her biri, ad alanına alınmış stillerinizin artık okumadığı bir özellik üretir. Bu adları,
[TypeScript'te ad alanlı özellikleri kullanma](#using-namespaced-properties-in-typescript) bölümünde
açıklandığı gibi kendiniz ad alanına alın.

### Ad alanına almayı devre dışı bırakma {#opting-out-of-namespacing}

Angular'ın ad alanına almadığı bir özel özelliği (örneğin genel bir stil dosyasında tanımlananı)
bildirmek veya okumak için adının önüne `--global--` ekleyin. Angular `--global` kısmını kaldırır;
kalan `--` ve adın geri kalanı değişmeden kalır:

```css
:host {
  /* Declares --accent-color and reads --brand-color, not --my-app_brand-color. */
  --global--accent-color: navy;
  color: var(--global--brand-color);
}
```

`global` sonrasına iki tire yazın. `--global-brand-color` gibi tek tire devre dışı bırakmaz ve Angular
bu adı diğer her ad gibi ad alanına alır. `--global-` ile başlayıp ardından ikinci bir tire gelmeyen
adlardan kaçının; gelecekteki bir ana sürümde bunların derleme zamanında reddedilmesi planlanmaktadır.
Angular, hiç ad alanı yapılandırmayan uygulamalar dahil her uygulamada `--global` kısmını kaldırır.

### TypeScript'te ad alanlı özellikleri kullanma {#using-namespaced-properties-in-typescript}

Angular'ın sizin için ad alanına aldığı `[style.--primary-color]` gibi bir stil bağlamasını tercih edin.
Bunun yerine bir DOM API'si kullandığınızda, stillerinizde yazdığınız adı baştaki `--` dahil
[`CssVarNamespacer`](api/platform-browser/CssVarNamespacer)'a geçirin:

```angular-ts {header: "profile-photo.ts"}
import {Component, ElementRef, inject} from '@angular/core';
import {CssVarNamespacer} from '@angular/platform-browser';

@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo" />`,
  styles: `
    img {
      border: 2px solid var(--primary-color);
    }
  `,
})
export class ProfilePhoto {
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly cssVarNamespacer = inject(CssVarNamespacer);

  setPrimaryColor(color: string): void {
    this.host.style.setProperty(this.cssVarNamespacer.namespace('--primary-color'), color);
  }
}
```

`--global--` ile bildirdiğiniz bir özellik için düz adı kullanın, çünkü Angular bunları asla ad alanına
almaz. Diğer her şey için `namespace`, bir uygulama ad alanı yapılandırmadığında adı değiştirmeden
döndürür; bu nedenle bir kütüphane, kendi stillerinin bildirdiği özel özellikler için bunu çağırabilir.
