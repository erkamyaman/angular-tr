# Bileşenleriniz için harness oluşturma

## Başlamadan önce

TIP: Bu kılavuz, [bileşen donanımları genel bakış kılavuzunu](guide/testing/component-harnesses-overview) zaten okuduğunuzu varsayar. Bileşen donanımlarını kullanmaya yeni başlıyorsanız önce onu okuyun.

### Test harness oluşturmak ne zaman mantıklıdır?

Angular ekibi, birçok yerde kullanılan ve bir miktar kullanıcı etkileşimi olan paylaşılan bileşenler için bileşen test donanımları oluşturmayı önerir. Bu en yaygın olarak widget kütüphaneleri ve benzeri yeniden kullanılabilir bileşenler için geçerlidir. Donanımlar bu durumlar için değerlidir çünkü bu paylaşılan bileşenlerin tüketicilerine bir bileşenle etkileşim kurmak için iyi desteklenen bir API sağlarlar. Donanımları kullanan testler, DOM yapısı ve belirli olay dinleyicileri gibi bu paylaşılan bileşenlerin güvenilmez uygulama ayrıntılarına bağımlı olmaktan kaçınabilir.

Yalnızca tek bir yerde görünen bileşenler, örneğin bir uygulamadaki bir sayfa için donanımlar o kadar fazla fayda sağlamaz. Bu durumlarda, testler ve bileşenler aynı anda güncellendiğinden, bir bileşenin testleri bu bileşenin uygulama ayrıntılarına makul olarak bağımlı olabilir. Ancak donanımı hem birim hem de uçtan uca testlerde kullanacaksanız, donanımlar yine de bir miktar değer sağlar.

### CDK Kurulumu

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories), bileşen oluşturmak için bir davranış temelleri setidir. Bileşen donanımlarını kullanmak için önce npm'den `@angular/cdk` yükleyin. Bunu terminalinizden Angular CLI kullanarak yapabilirsiniz:

```shell
ng add @angular/cdk
```

## `ComponentHarness`'ı genişletme

Soyut `ComponentHarness` sınıfı, tüm bileşen donanımları için temel sınıftır. Özel bir bileşen donanımı oluşturmak için `ComponentHarness`'ı genişletin ve `hostSelector` statik özelliğini uygulayın.

`hostSelector` özelliği, DOM'daki bu donanım alt sınıfıyla eşleşen öğeleri tanımlar. Çoğu durumda `hostSelector`, karşılık gelen `Component` veya `Directive`'in seçicisi ile aynı olmalıdır. Örneğin, basit bir popup bileşeni düşünün:

```ts
@Component({
  selector: 'my-popup',
  template: `
    <button (click)="toggle()">{{ triggerText() }}</button>
    @if (isOpen()) {
      <div class="my-popup-content"><ng-content></ng-content></div>
    }
  `,
})
class MyPopup {
  triggerText = input('');

  isOpen = signal(false);

  toggle() {
    this.isOpen.update((value) => !value);
  }
}
```

Bu durumda, bileşen için minimal bir donanım şu şekilde görünür:

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';
}
```

`ComponentHarness` alt sınıfları yalnızca `hostSelector` özelliğini gerektirse de, çoğu donanım `HarnessPredicate` örnekleri oluşturmak için statik bir `with` metodu da uygulamalıdır. [Donanımları filtreleme bölümü](guide/testing/using-component-harnesses#harnessları-filtreleme) bunu daha ayrıntılı ele alır.

## Bileşenin DOM'unda öğeleri bulma

Bir `ComponentHarness` alt sınıfının her örneği, karşılık gelen bileşenin belirli bir örneğini temsil eder. Bileşenin ana öğesine `ComponentHarness` temel sınıfından `host()` metodu aracılığıyla erişebilirsiniz.

`ComponentHarness` ayrıca bileşenin DOM'unda öğeleri bulmak için birçok metot sunar. Bu metotlar `locatorFor()`, `locatorForOptional()` ve `locatorForAll()`'dur. Bu metotlar öğeleri bulan fonksiyonlar oluşturur, doğrudan öğeleri bulmazlar. Bu yaklaşım, güncel olmayan öğelere referansları önbelleğe almaya karşı koruma sağlar. Örneğin, bir `@if` bloğu bir öğeyi gizleyip sonra gösterdiğinde, sonuç yeni bir DOM öğesidir; fonksiyonlar kullanmak testlerin her zaman DOM'un mevcut durumuna referans vermesini sağlar.

Farklı `locatorFor` metotlarının tam liste ayrıntıları için [ComponentHarness API referans sayfasına](/api/cdk/testing/ComponentHarness) bakın.

Örneğin, yukarıda tartışılan `MyPopupHarness` örneği, tetikleyici ve içerik öğelerini almak için şu şekilde metotlar sağlayabilir:

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

  // Tetikleyici öğeyi alır
  getTriggerElement = this.locatorFor('button');

  // İçerik öğesini alır.
  getContentElement = this.locatorForOptional('.my-popup-content');
}
```

## `TestElement` örnekleri ile çalışma

`TestElement`, farklı test ortamlarında (Birim testleri, WebDriver, vb.) çalışmak üzere tasarlanmış bir soyutlamadır. Donanımları kullanırken, tüm DOM etkileşimini bu arayüz aracılığıyla gerçekleştirmelisiniz. `document.querySelector()` gibi DOM öğelerine erişmenin diğer yolları tüm test ortamlarında çalışmaz.

`TestElement`, altta yatan DOM ile etkileşim kurmak için `blur()`, `click()`, `getAttribute()` ve daha fazlası gibi bir dizi metoda sahiptir. Metotların tam listesi için [TestElement API referans sayfasına](/api/cdk/testing/TestElement) bakın.

Bileşen tüketicisinin doğrudan tanımladığı bir öğe, örneğin bileşenin ana öğesi olmadıkça, `TestElement` örneklerini donanım kullanıcılarına açığa çıkarmayın. İç öğeler için `TestElement` örneklerini açığa çıkarmak, kullanıcıların bir bileşenin iç DOM yapısına bağımlı olmasına yol açar.

Bunun yerine, son kullanıcının yapabileceği belirli eylemler veya gözlemleyebileceği belirli durumlar için daha dar odaklı metotlar sağlayın. Örneğin, önceki bölümlerdeki `MyPopupHarness` `toggle` ve `isOpen` gibi metotlar sağlayabilir:

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

  protected getTriggerElement = this.locatorFor('button');
  protected getContentElement = this.locatorForOptional('.my-popup-content');

  /** Popup'ın açık durumunu değiştirir. */
  async toggle() {
    const trigger = await this.getTriggerElement();
    return trigger.click();
  }

  /** Popup'ın açık olup olmadığını kontrol eder. */
  async isOpen() {
    const content = await this.getContentElement();
    return !!content;
  }
}
```

## Alt bileşenler için harness'ları yükleme

Daha büyük bileşenler genellikle alt bileşenlerden oluşur. Bu yapıyı bir bileşenin donanımında da yansıtabilirsiniz. `ComponentHarness` üzerindeki `locatorFor` metotlarının her birinin, öğeler yerine alt donanımları bulmak için kullanılabilen alternatif bir imzası vardır.

Farklı locatorFor metotlarının tam listesi için [ComponentHarness API referans sayfasına](/api/cdk/testing/ComponentHarness) bakın.

Örneğin, yukarıdaki popup kullanılarak oluşturulan bir menü düşünün:

```ts
@Directive({
  selector: 'my-menu-item',
})
class MyMenuItem {}

@Component({
  selector: 'my-menu',
  template: `
    <my-popup>
      <ng-content />
    </my-popup>
  `,
})
class MyMenu {
  triggerText = input('');

  @ContentChildren(MyMenuItem) items: QueryList<MyMenuItem>;
}
```

`MyMenu` donanımı daha sonra `MyPopup` ve `MyMenuItem` için diğer donanımlardan yararlanabilir:

```ts
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

  protected getPopupHarness = this.locatorFor(MyPopupHarness);

  /** Şu anda gösterilen menü öğelerini alır (menü kapalıysa boş liste). */
  getItems = this.locatorForAll(MyMenuItemHarness);

  /** Menünün açık durumunu değiştirir. */
  async toggle() {
    const popupHarness = await this.getPopupHarness();
    return popupHarness.toggle();
  }
}

class MyMenuItemHarness extends ComponentHarness {
  static hostSelector = 'my-menu-item';
}
```

## `HarnessPredicate` ile harness örneklerini filtreleme

Bir sayfada belirli bir bileşenin birden fazla örneği olduğunda, belirli bir bileşen örneğini almak için bileşenin bazı özelliklerine göre filtreleme yapmak isteyebilirsiniz. Örneğin, belirli bir metne sahip bir düğme veya belirli bir kimliğe sahip bir menü isteyebilirsiniz. `HarnessPredicate` sınıfı, bir `ComponentHarness` alt sınıfı için bu tür kriterleri yakalayabilir. Test yazarı `HarnessPredicate` örneklerini manuel olarak oluşturabilirken, `ComponentHarness` alt sınıfının yaygın filtreler için yüklemler oluşturmak üzere bir yardımcı metot sağlaması daha kolaydır.

Her `ComponentHarness` alt sınıfında, o sınıf için bir `HarnessPredicate` döndüren statik bir `with()` metodu oluşturmalısınız. Bu, test yazarlarının kolayca anlaşılır kod yazmasına olanak tanır, ör. `loader.getHarness(MyMenuHarness.with({selector: '#menu1'}))`. Standart selector ve ancestor seçeneklerine ek olarak, `with` metodu belirli alt sınıf için anlamlı olan diğer seçenekleri de eklemelidir.

Ek seçenekler eklemesi gereken donanımlar, `BaseHarnessFilters` arayüzünü genişletmeli ve gerektiğinde ilave isteğe bağlı özellikler eklemelidir. `HarnessPredicate`, seçenek eklemek için birçok kolaylık metodu sağlar: `stringMatches()`, `addOption()` ve `add()`. Tam açıklama için [HarnessPredicate API sayfasına](/api/cdk/testing/HarnessPredicate) bakın.

Örneğin, bir menü ile çalışırken tetikleyici metnine göre filtreleme yapmak ve menü öğelerini metinlerine göre filtrelemek faydalıdır:

```ts
interface MyMenuHarnessFilters extends BaseHarnessFilters {
  /** Menünün tetikleyici metnine göre filtreler. */
  triggerText?: string | RegExp;
}

interface MyMenuItemHarnessFilters extends BaseHarnessFilters {
  /** Menü öğesinin metnine göre filtreler. */
  text?: string | RegExp;
}

class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

  /** Belirli bir `MyMenuHarness`'ı bulmak için kullanılan `HarnessPredicate` oluşturur. */
  static with(options: MyMenuHarnessFilters): HarnessPredicate<MyMenuHarness> {
    return new HarnessPredicate(MyMenuHarness, options).addOption(
      'trigger text',
      options.triggerText,
      (harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text),
    );
  }

  protected getPopupHarness = this.locatorFor(MyPopupHarness);

  /** Menü tetikleyicisinin metnini alır. */
  async getTriggerText(): Promise<string> {
    const popupHarness = await this.getPopupHarness();
    return popupHarness.getTriggerText();
  }
}

class MyMenuItemHarness extends ComponentHarness {
  static hostSelector = 'my-menu-item';

  /** Belirli bir `MyMenuItemHarness`'ı bulmak için kullanılan `HarnessPredicate` oluşturur. */
  static with(options: MyMenuItemHarnessFilters): HarnessPredicate<MyMenuItemHarness> {
    return new HarnessPredicate(MyMenuItemHarness, options).addOption(
      'text',
      options.text,
      (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text),
    );
  }

  /** Menü öğesinin metnini alır. */
  async getText(): Promise<string> {
    const host = await this.host();
    return host.text();
  }
}
```

`HarnessLoader`, `LocatorFactory` veya `ComponentHarness` üzerindeki herhangi bir API'ye `ComponentHarness` sınıfı yerine `HarnessPredicate` aktarabilirsiniz. Bu, test yazarlarının bir donanım örneği oluştururken belirli bir bileşen örneğini kolayca hedeflemesine olanak tanır. Ayrıca donanım yazarının, donanım sınıfında daha güçlü API'ler etkinleştirmek için aynı `HarnessPredicate`'den yararlanmasına olanak tanır. Örneğin, yukarıda gösterilen `MyMenuHarness` üzerindeki `getItems` metodunu düşünün. Bir filtreleme API'si eklemek, donanım kullanıcılarının belirli menü öğelerini aramasına olanak tanır:

```ts
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

  /** Menüdeki öğelerin listesini alır, isteğe bağlı olarak verilen kriterlere göre filtrelenmiş. */
  async getItems(filters: MyMenuItemHarnessFilters = {}): Promise<MyMenuItemHarness[]> {
    const getFilteredItems = this.locatorForAll(MyMenuItemHarness.with(filters));
    return getFilteredItems();
  }
  ...
}
```

## İçerik projeksiyon kullanan öğeler için `HarnessLoader` oluşturma

Bazı bileşenler, bileşenin şablonuna ek içerik projekte eder. Daha fazla bilgi için [içerik projeksiyon kılavuzuna](guide/components/content-projection) bakın.

İçerik projeksiyon kullanan bir bileşen için donanım oluştururken, `<ng-content>` içeren öğeye kapsamlı bir `HarnessLoader` örneği ekleyin. Bu, donanım kullanıcısının içerik olarak aktarılan bileşenler için ek donanımlar yüklemesine olanak tanır. `ComponentHarness`, bu gibi durumlar için HarnessLoader örnekleri oluşturmak üzere kullanılabilecek birkaç metoda sahiptir: `harnessLoaderFor()`, `harnessLoaderForOptional()`, `harnessLoaderForAll()`. Daha fazla ayrıntı için [HarnessLoader arayüzü API referans sayfasına](/api/cdk/testing/HarnessLoader) bakın.

Örneğin, yukarıdaki `MyPopupHarness` örneği, bileşenin `<ng-content>`'i içinde donanım yükleme desteği eklemek için `ContentContainerComponentHarness`'ı genişletebilir.

```ts
class MyPopupHarness extends ContentContainerComponentHarness<string> {
  static hostSelector = 'my-popup';
}
```

## Bileşenin host öğesi dışındaki öğelere erişme

Bir bileşen donanımının, karşılık gelen bileşeninin ana öğesi dışındaki öğelere erişmesi gereken zamanlar vardır. Örneğin, kayan bir öğe veya açılır pencere görüntüleyen kod genellikle DOM öğelerini doğrudan belge gövdesine ekler, örneğin Angular CDK'daki `Overlay` servisi.

Bu durumda `ComponentHarness`, belgenin kök öğesi için bir `LocatorFactory` almak üzere kullanılabilecek bir metot sağlar. `LocatorFactory`, `ComponentHarness` temel sınıfıyla aynı API'lerin çoğunu destekler ve daha sonra belgenin kök öğesine göre sorgu yapmak için kullanılabilir.

Yukarıdaki `MyPopup` bileşeninin popup içeriği için kendi şablonundaki bir öğe yerine CDK overlay'i kullandığını düşünün. Bu durumda, `MyPopupHarness`, belge kökünde köklenen bir locator factory alan `documentRootLocatorFactory()` metodu aracılığıyla içerik öğesine erişmek zorunda kalır.

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

  /** Kök öğesi popup'ın içerik öğesi olan bir `HarnessLoader` alır. */
  async getHarnessLoaderForContent(): Promise<HarnessLoader> {
    const rootLocator = this.documentRootLocatorFactory();
    return rootLocator.harnessLoaderFor('my-popup-content');
  }
}
```

## Asenkron görevleri bekleme

`TestElement` üzerindeki metotlar, Angular'ın değişiklik algılamasını otomatik olarak tetikler ve `NgZone` içindeki görevleri bekler. Çoğu durumda donanım yazarlarının asenkron görevleri beklemek için özel bir çaba göstermesi gerekmez.

Ancak bunun yeterli olmayabileceği bazı uç durumlar vardır.

Bazı koşullar altında Angular animasyonları, animasyon olaylarının tamamen temizlenmesi için ikinci bir değişiklik algılama döngüsü ve ardından `NgZone` stabilizasyonu gerektirebilir. Buna ihtiyaç duyulan durumlarda, `ComponentHarness` ikinci turu yapmak için çağrılabilecek bir `forceStabilize()` metodu sunar.

NgZone dışında görevler planlamak için `NgZone.runOutsideAngular()` kullanabilirsiniz. `NgZone` dışındaki görevleri açıkça beklemeniz gerekiyorsa, otomatik olarak gerçekleşmediğinden karşılık gelen donanımdaki `waitForTasksOutsideAngular()` metodunu çağırın.
