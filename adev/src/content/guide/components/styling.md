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

Angular, CSS çıktısı üreten herhangi bir araçla çalışır; bunlara [Sass](https://sass-lang.com), [less](https://lesscss.org) ve [stylus](https://stylus-lang.com) dahildir.

## Stil kapsamı

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

## Şablonlarda stil tanımlama

Ek stiller tanımlamak için bileşenin şablonunda `<style>` elemanını kullanabilirsiniz. Bileşenin görünüm kapsülleme modu, bu şekilde tanımlanan stillere de uygulanır.

Angular, stil elemanları içerisindeki bağlamaları desteklemez.

## Harici stil dosyalarına referans verme

Bileşen şablonları, CSS dosyalarına referans vermek için [`<link>` elemanı](https://developer.mozilla.org/docs/Web/HTML/Element/link)'nı kullanabilir. Ek olarak, CSS'iniz CSS dosyalarına referans vermek için [`@import` at-kuralı](https://developer.mozilla.org/docs/Web/CSS/@import)'nı kullanabilir. Angular bu referansları _harici_ stiller olarak değerlendirir. Harici stiller, emüle edilmiş görünüm kapsüllemesinden etkilenmez.
