# Angular kodlama stil rehberi

## Giriş

Bu kılavuz, Angular uygulama kodu için bir dizi stil kuralını kapsamaktadır. Bu öneriler
Angular'ın çalışması için gerekli değildir, bunun yerine Angular ekosisteminde tutarlılık sağlayan bir dizi kodlama pratiğidir. Tutarlı bir pratikler seti, kod paylaşımını ve projeler arası geçişi kolaylaştırır.

Bu kılavuz, Angular ile ilgili olmayan TypeScript veya genel kodlama pratiklerini _kapsamaz_. TypeScript için
[Google'ın TypeScript stil kılavuzuna](https://google.github.io/styleguide/tsguide.html) bakın.

### Şüpheye düştüğünüzde tutarlılığı tercih edin

Bu kuralların belirli bir dosyanın stiliyle çeliştiği bir durumla karşılaştığınızda,
dosya içindeki tutarlılığı korumaya öncelik verin. Tek bir
dosyada farklı stil kurallarını karıştırmak, bu kılavuzdaki önerilerden sapmasından daha fazla karışıklığa neden olur.

## İsimlendirme

### Dosya adlarında sözcükleri tire ile ayırın

Bir dosya adındaki sözcükleri tire (`-`) ile ayırın. Örneğin, `UserProfile` adında bir bileşen
`user-profile.ts` dosya adına sahiptir.

### Dosya testleri için sonuna `.spec` ekleyerek aynı adı kullanın

Birim testleri için dosya adlarını `.spec.ts` ile bitirin. Örneğin,
`UserProfile` bileşeni için birim test dosyası `user-profile.spec.ts` dosya adına sahiptir.

### Dosya adlarını içindeki TypeScript tanımlayıcısıyla eşleştirin

Dosya adları genellikle dosyadaki kodun içeriğini tanımlamalıdır. Dosya bir
TypeScript sınıfı içerdiğinde, dosya adı o sınıf adını yansıtmalıdır. Örneğin,
`UserProfile` adında bir bileşen içeren bir dosya `user-profile.ts` adına sahiptir.

Dosya birden fazla birincil adlandırılabilir tanımlayıcı içeriyorsa, içerdeki kodun ortak temasını
tanımlayan bir ad seçin. Dosyadaki kod ortak bir tema veya özellik
alanı içinde uymuyorsa, kodu farklı dosyalara ayırmayı düşünün. `helpers.ts`, `utils.ts` veya `common.ts`
gibi aşırı genel dosya adlarından kaçının.

### Bileşenin TypeScript, şablon ve stil dosyaları için aynı dosya adını kullanın

Bileşenler tipik olarak bir TypeScript dosyası, bir şablon dosyası ve bir stil dosyasından oluşur. Bu
dosyalar farklı dosya uzantılarıyla aynı adı paylaşmalıdır. Örneğin, bir `UserProfile`
bileşeni `user-profile.ts`, `user-profile.html` ve `user-profile.css` dosyalarına sahip olabilir.

Bir bileşenin birden fazla stil dosyası varsa, o dosyaya özgü stilleri tanımlayan ek sözcüklerle adı ekleyin. Örneğin, `UserProfile`'ın
`user-profile-settings.css` ve `user-profile-subscription.css` stil dosyaları olabilir.

## Proje yapısı

### Uygulamanın tüm kodu `src` adlı bir dizinde bulunur

Tüm Angular UI kodunuz (TypeScript, HTML ve stiller) `src` adında bir dizinin
içinde yaşamalıdır. Yapılandırma dosyaları veya betikler gibi UI ile ilgili olmayan kod, `src` dizininin dışında yaşamalıdır.

Bu, kök uygulama dizinini farklı Angular projeleri arasında tutarlı tutar ve
projenizde UI kodu ile diğer kod arasında net bir ayrım oluşturur.

### Uygulamanızı doğrudan `src` içindeki `main.ts` dosyasında bootstrap edin

Bir Angular uygulamasını başlatmak veya **bootstrap** etmek için gereken kod her zaman
`main.ts` adında bir dosyada yaşamalıdır. Bu, uygulamanın birincil giriş noktasını temsil eder.

### Yakından ilişkili dosyaları aynı dizinde gruplayın

Angular bileşenleri bir TypeScript dosyası ve isteğe bağlı olarak bir şablon ve bir veya daha fazla stil
dosyasından oluşur. Bunları aynı dizinde gruplamanız gerekir.

Birim testleri, test edilen kodla aynı dizinde yaşamalıdır. İlgisiz testleri tek bir `tests` dizininde toplamaktan kaçının.

### Projenizi özellik alanlarına göre organize edin

Projenizi, uygulamanızın özelliklerine veya bu dizinlerdeki kodun ortak temalarına dayalı olarak alt dizinlere organize edin. Örneğin, bir sinema sitesi olan MovieReel'in proje yapısı şöyle görünebilir:

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

Bu dizinlerde bulunan kod türüne dayalı alt dizinler oluşturmaktan kaçının. Örneğin,
`components`, `directives` ve `services` gibi dizinler oluşturmaktan kaçının.

Bir dizine okunması veya gezinilmesi zor olacak kadar çok dosya koymaktan kaçının. Bir dizindeki dosya sayısı arttıkça, ek alt dizinlere bölmeyi düşünün.

### Dosya başına tek kavram

Kaynak dosyaları tek bir _kavrama_ odaklanmayı tercih edin. Angular sınıfları için, bu genellikle
dosya başına bir bileşen, direktif veya servis anlamına gelir. Ancak, sınıflarınız nispeten küçükse ve tek bir kavram olarak bir araya geliyorlarsa, bir dosyanın birden fazla bileşen veya direktif içermesi sorun değildir.

Şüpheliyseniz, daha küçük dosyalara yol açan yaklaşımla gidin.

## Bağımlılık enjeksiyonu

### `inject` fonksiyonunu constructor parametre enjeksiyonuna tercih edin

Constructor parametre enjeksiyonu yerine [`inject`](/api/core/inject) fonksiyonunu kullanmayı tercih edin. [`inject`](/api/core/inject) fonksiyonu constructor parametre enjeksiyonuyla aynı şekilde çalışır, ancak çeşitli stil avantajları sunar:

- [`inject`](/api/core/inject), özellikle bir sınıf çok sayıda bağımlılık enjekte ettiğinde genellikle daha okunabilirdir.
- Enjekte edilen bağımlılıklara yorum eklemek sözdizimsel olarak daha basittir
- [`inject`](/api/core/inject) daha iyi tip çıkarımı sunar.
- ES2022+ hedeflendiğinde [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig/#useDefineForClassFields) ile, enjekte edilen bağımlılıkları okuyan alanlarda alan bildirimi ve başlatma işlemini ayırmaktan kaçınabilirsiniz.

[Mevcut kodu otomatik bir araçla `inject`'e yeniden düzenleyebilirsiniz](reference/migrations/inject-function).

## Bileşenler ve direktifler

### Bileşen seçicilerini seçme

Bileşen seçimleri hakkında ayrıntılar için
[Bileşenler kılavuzuna](guide/components/selectors#seçici-seçme) bakın.

### Bileşen ve direktif üyelerini adlandırma

Bileşenler kılavuzunda
[giriş özelliklerini adlandırma](guide/components/inputs#girdi-adlarını-seçme)
ve [çıkış özelliklerini adlandırma](guide/components/outputs#olay-adlarını-seçme) hakkında ayrıntılar için bakın.

### Direktif seçicilerini seçme

Direktifler, bileşenlerinizle aynı [uygulamaya özgü öneki](guide/components/selectors#seçici-önekleri) kullanmalıdır.

Bir direktif için özellik seçici kullanırken camelCase özellik adı kullanın. Örneğin,
uygulamanız "MovieReel" olarak adlandırılıyorsa ve bir elemana araç ipucu ekleyen bir direktif oluşturuyorsanız, `[mrTooltip]` seçicisini kullanabilirsiniz.

### Angular'a özgü özellikleri yöntemlerden önce gruplayın

Bileşenler ve direktifler, Angular'a özgü özellikleri genellikle sınıf bildiriminin üst kısımlarında birlikte gruplamalıdır. Bu, enjekte edilen bağımlılıkları, girişleri, çıkışları ve sorguları içerir. Bunları ve diğer özellikleri sınıfın yöntemlerinden önce tanımlayın.

Bu uygulama, sınıfın şablon API'lerini ve bağımlılıklarını bulmayı kolaylaştırır.

### Bileşenleri ve direktifleri sunum odaklı tutun

Bileşenlerinizin ve direktiflerinizin içindeki kod genellikle sayfada gösterilen kullanıcı arayüzü ile ilgili olmalıdır. Kullanıcı arayüzünden bağımsız olarak kendi başına anlam ifade eden kod için, diğer dosyalara yeniden düzenlemeyi tercih edin. Örneğin, form doğrulama kurallarını veya veri dönüşümlerini ayrı fonksiyonlara veya sınıflara çıkarabilirsiniz.

### Şablonlarda aşırı karmaşık mantıktan kaçının

Angular şablonları, [JavaScript benzeri ifadeleri](guide/templates/expression-syntax) barındırmak üzere tasarlanmıştır.
Nispeten basit mantığı doğrudan şablon ifadelerinde yakalamak için bu ifadelerden yararlanmalısınız.

Şablondaki kod çok karmaşık hale geldiğinde, mantığı TypeScript koduna yeniden düzenleyin (tipik olarak bir [computed](guide/signals#computed-sinyaller) ile).

"Karmaşık"ın ne olduğunu belirleyen kesin ve değişmez bir kural yoktur. En iyi yargınızı kullanın.

### Yalnızca bileşenin şablonu tarafından kullanılan sınıf üyelerinde `protected` kullanın

Bir bileşen sınıfının public üyeleri, bağımlılık enjeksiyonu ve [sorgular](guide/components/queries) aracılığıyla erişilebilir bir public API tanımlar. Bileşenin şablonundan okunması amaçlanan üyeler için `protected` erişimi tercih edin.

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

### Değişmemesi gereken özellikler için `readonly` kullanın

Angular tarafından başlatılan bileşen ve direktif özelliklerini `readonly` olarak işaretleyin. Bu,
`input`, `model`, `output` ve sorgular tarafından başlatılan özellikleri içerir. readonly erişim değiştiricisi, Angular tarafından ayarlanan değerin üzerine yazılmamasını sağlar.

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

Dekoratör tabanlı `@Input`, `@Output` ve sorgu API'lerini kullanan bileşenler ve direktifler için, bu
tavsiye çıkış özelliklerine ve sorgulara uygulanır, ancak giriş özelliklerine uygulanmaz.

```ts
@Component({
  /*...*/
})
export class UserProfile {
  @Output() readonly userSaved = new EventEmitter<void>();
  @ViewChildren(PaymentMethod) readonly paymentMethods?: QueryList<PaymentMethod>;
}
```

### `ngClass` ve `ngStyle` yerine `class` ve `style` tercih edin

[`NgClass`](/api/common/NgClass) ve [`NgStyle`](/api/common/NgStyle) direktiflerini kullanmak yerine `class` ve `style` bağlamalarını tercih edin.

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

Hem `class` hem de `style` bağlamaları, standart HTML özelliklerine yakından uyum sağlayan daha basit bir sözdizimi kullanır. Bu, şablonlarınızı okumayı ve anlamayı kolaylaştırır, özellikle temel HTML'ye aşina geliştiriciler için.

Ek olarak, `NgClass` ve `NgStyle` direktifleri, yerleşik `class` ve `style` bağlama sözdizimine kıyasla ek bir performans maliyeti getirir.

Daha fazla ayrıntı için [bağlamalar kılavuzuna](/guide/templates/binding#css-sınıfı-ve-stil-özelliği-bağlamaları) bakın.

### Olay işleyicilerini tetikleyen olay için değil, yaptıkları eylem için adlandırın

Olay işleyicilerini tetikleyen olay için değil, gerçekleştirdikleri eylem için adlandırmayı tercih edin:

```html {prefer}
<button (click)="saveUserData()">Save</button>
```

```html {avoid}
<button (click)="handleClick()">Save</button>
```

Bunun gibi anlamlı adlar kullanmak, bir olayın ne yaptığını şablonu okuyarak anlamayı kolaylaştırır.

Klavye olayları için, belirli işleyici adlarıyla Angular'ın tuş olayı değiştiricilerini kullanabilirsiniz:

```html
<textarea (keydown.control.enter)="commitNotes()" (keydown.control.space)="showSuggestions()">
```

Bazen olay işleme mantığı özellikle uzun veya karmaşıktır, bu da tek bir iyi adlandırılmış işleyici bildirmeyi pratik olmaktan çıkarır. Bu durumlarda, 'handleKeydown' gibi bir ada geri dönmek ve ardından olay ayrıntılarına göre daha belirli davranışlara devretmek sorun değildir:

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

### Yaşam döngüsü yöntemlerini basit tutun

`ngOnInit` gibi yaşam döngüsü kancalarına uzun veya karmaşık mantık koymaktan kaçının. Bunun yerine, bu mantığı içeren iyi adlandırılmış yöntemler oluşturmayı ve ardından yaşam döngüsü kancalarınızda _bu yöntemleri çağırmayı_ tercih edin.
Yaşam döngüsü kanca adları _ne zaman_ çalıştıklarını tanımlar, yani içerdeki kodun ne yaptığını tanımlayan anlamlı bir adı yoktur.

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

### Yaşam döngüsü hook arayüzlerini kullanın

Angular, her yaşam döngüsü yöntemi için bir TypeScript arayüzü sağlar. Sınıflarınıza bir yaşam döngüsü kancası eklerken, yöntemlerin doğru adlandırılmasını sağlamak için bu arayüzleri içeri aktarın ve `implement` edin.

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
