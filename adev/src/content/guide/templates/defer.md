# `@defer` ile ertelenmiş yükleme

Ertelenebilir görünümler, `@defer` blokları olarak da bilinir, bir sayfanın ilk işlemesi için kesinlikle gerekli olmayan kodun yüklenmesini erteleyerek uygulamanızın ilk paket boyutunu azaltır. Bu genellikle daha hızlı bir ilk yükleme ve Core Web Vitals (CWV) iyileştirmesiyle sonuçlanır; özellikle Largest Contentful Paint (LCP) ve Time to First Byte (TTFB).

Bu özelliği kullanmak için şablonunuzun bir bölümünü bildirimsel olarak bir @defer bloğu ile sarmalayabilirsiniz:

```angular-html
@defer {
  <large-component />
}
```

`@defer` bloğunun içindeki tüm bileşenler, direktifler ve pipe'lar için kod ayrı bir JavaScript dosyasına ayrılır ve yalnızca gerekli olduğunda, şablonun geri kalanı işlendikten sonra yüklenir.

Ertelenebilir görünümler; çeşitli tetikleyicileri, ön-yükleme seçeneklerini ve yer tutucu, yükleme ve hata durumu yönetimi için alt blokları destekler.

## Hangi bağımlılıklar ertelenir?

Bileşenler, direktifler, pipe'lar ve tüm bileşen CSS stilleri bir uygulama yüklenirken ertelenebilir.

Bir `@defer` bloğu içindeki bağımlılıkların ertelenmesi için iki koşulu karşılamaları gerekir:

1. **Bağımsız (standalone) olmalıdırlar.** Bağımsız olmayan bağımlılıklar ertelenemez ve `@defer` blokları içinde olsalar bile istekli (eagerly) olarak yüklenirler.
1. **Aynı dosya içinde `@defer` blokları dışında referans verilmemelidir.** `@defer` bloğu dışında veya ViewChild sorgularında referans verilirse, bağımlılıklar istekli olarak yüklenecektir.

`@defer` bloğunda kullanılan bileşenler, direktifler ve pipe'ların _geçişli_ bağımlılıkları kesinlikle bağımsız olmak zorunda değildir; geçişli bağımlılıklar hâlâ bir `NgModule`'da bildirilebilir ve ertelenmiş yüklemeye katılabilir.

Angular'ın derleyicisi, `@defer` bloğunda kullanılan her bileşen, direktif ve pipe için bir [dinamik import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) ifadesi üretir. Bloğun ana içeriği tüm import'lar çözüldükten sonra işlenir. Angular bu import'lar için belirli bir sıra garanti etmez.

## Ertelenmiş yüklemenin farklı aşamaları nasıl yönetilir

`@defer` blokları, ertelenmiş yükleme sürecinin farklı aşamalarını zarifçe yönetmenize olanak tanıyan birkaç alt bloğa sahiptir.

### `@defer`

Bu, tembel olarak yüklenen içerik bölümünü tanımlayan birincil bloktur. Başlangıçta işlenmez - ertelenmiş içerik, belirtilen [tetikleyici](#tetikleyicilerle-ertelenmiş-içerik-yüklemeyi-kontrol-etme) oluştuğunda veya `when` koşulu karşılandığında yüklenir ve işlenir.

Varsayılan olarak, bir `@defer` bloğu tarayıcı durumu [boşta](/guide/templates/defer#idle) olduğunda tetiklenir.

```angular-html
@defer {
  <large-component />
}
```

### `@placeholder` ile yer tutucu içerik gösterme

Varsayılan olarak, defer blokları tetiklenmeden önce herhangi bir içerik işlemez.

`@placeholder`, `@defer` bloğu tetiklenmeden önce gösterilecek içeriği bildiren isteğe bağlı bir bloktur.

```angular-html
@defer {
  <large-component />
} @placeholder {
  <p>Placeholder content</p>
}
```

İsteğe bağlı olsa da, belirli tetikleyiciler çalışabilmek için bir `@placeholder` veya bir [şablon referans değişkeni](/guide/templates/variables#şablon-referans-değişkenleri) bulunmasını gerektirebilir. Daha fazla bilgi için [Tetikleyiciler](#tetikleyicilerle-ertelenmiş-içerik-yüklemeyi-kontrol-etme) bölümüne bakın.

Angular, yükleme tamamlandığında yer tutucu içeriği ana içerikle değiştirir. Yer tutucu bölümünde düz HTML, bileşenler, direktifler ve pipe'lar dahil herhangi bir içerik kullanabilirsiniz. _Yer tutucu bloğunun bağımlılıkların istekli olarak yüklendiğini_ unutmayın.

`@placeholder` bloğu, yer tutucu içeriği ilk işlendikten sonra bu yer tutucunun gösterileceği `minimum` süre miktarını belirtmek için isteğe bağlı bir parametre kabul eder.

```angular-html
@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>Placeholder content</p>
}
```

Bu `minimum` parametresi milisaniye (ms) veya saniye (s) cinsinden zaman artımlarıyla belirtilir. Ertelenmiş bağımlılıklar hızla getirildiğinde yer tutucu içeriğinin hızlı titremesini önlemek için bu parametreyi kullanabilirsiniz.

### `@loading` ile yükleme içeriği gösterme

`@loading` bloğu, ertelenmiş bağımlılıklar yüklenirken gösterilecek içeriği bildirmenize olanak tanıyan isteğe bağlı bir bloktur. Yükleme tetiklendiğinde `@placeholder` bloğunun yerini alır.

```angular-html
@defer {
  <large-component />
} @loading {
  <img alt="loading..." src="loading.gif" />
} @placeholder {
  <p>Placeholder content</p>
}
```

Bağımlılıkları (`@placeholder`'a benzer şekilde) istekli olarak yüklenir.

`@loading` bloğu, ertelenmiş bağımlılıklar hızla getirildiğinde oluşabilecek içerik titremesini önlemeye yardımcı olmak için iki isteğe bağlı parametre kabul eder:

- `minimum` - bu yer tutucunun gösterileceği minimum süre miktarı
- `after` - yükleme şablonunu göstermeden önce yükleme başladıktan sonra bekleme süresi

```angular-html
@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="loading..." src="loading.gif" />
}
```

Her iki parametre de milisaniye (ms) veya saniye (s) cinsinden zaman artımlarıyla belirtilir. Ayrıca, her iki parametrenin zamanlayıcıları yükleme tetiklendikten hemen sonra başlar.

### Ertelenmiş yükleme başarısız olduğunda `@error` ile hata durumu gösterme

`@error` bloğu, ertelenmiş yükleme başarısız olursa görüntülenen isteğe bağlı bir bloktur. `@placeholder` ve `@loading`'e benzer şekilde, @error bloğunun bağımlılıkları istekli olarak yüklenir.

```angular-html
@defer {
  <large-component />
} @error {
  <p>Failed to load large component.</p>
}
```

## Tetikleyicilerle ertelenmiş içerik yüklemeyi kontrol etme

Angular'ın ertelenmiş içeriği ne zaman yükleyip görüntüleyeceğini kontrol eden **tetikleyiciler** belirtebilirsiniz.

Bir `@defer` bloğu tetiklendiğinde, yer tutucu içeriği tembel olarak yüklenen içerikle değiştirir.

Birden fazla olay tetikleyicisi noktalı virgül (`;`) ile ayrılarak tanımlanabilir ve VEYA koşulları olarak değerlendirilir.

İki tür tetikleyici vardır: `on` ve `when`.

### `on`

`on`, `@defer` bloğunun ne zaman tetikleneceğine dair bir koşul belirtir.

Kullanılabilir tetikleyiciler aşağıdaki gibidir:

| Tetikleyici                   | Açıklama                                                        |
| ----------------------------- | --------------------------------------------------------------- |
| [`idle`](#idle)               | Tarayıcı boşta olduğunda tetiklenir.                            |
| [`viewport`](#viewport)       | Belirtilen içerik görünüm alanına girdiğinde tetiklenir         |
| [`interaction`](#interaction) | Kullanıcı belirtilen elemanla etkileşime geçtiğinde tetiklenir  |
| [`hover`](#hover)             | Fare belirtilen alanın üzerine geldiğinde tetiklenir            |
| [`immediate`](#immediate)     | Ertelenmemiş içerik işlemeyi bitirdikten hemen sonra tetiklenir |
| [`timer`](#timer)             | Belirli bir süreden sonra tetiklenir                            |

#### `idle`

`idle` tetikleyicisi, tarayıcı requestIdleCallback'e dayalı olarak boşta durumuna ulaştığında ertelenmiş içeriği yükler. Bu, bir defer bloğunun varsayılan davranışıdır.

```angular-html
<!-- @defer (on idle) -->
@defer {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `viewport`

`viewport` tetikleyicisi, belirtilen içerik [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) kullanılarak görünüm alanına girdiğinde ertelenmiş içeriği yükler. Gözlemlenen içerik `@placeholder` içeriği veya açık bir eleman referansı olabilir.

Varsayılan olarak, `@defer` yer tutucunun görünüm alanına girip girmediğini izler. Bu şekilde kullanılan yer tutucuların tek bir kök elemanı olmalıdır.

```angular-html
@defer (on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Alternatif olarak, `@defer` bloğuyla aynı şablonda bir [şablon referans değişkeni](/guide/templates/variables) belirterek görünüm alanına giriş için izlenen eleman olarak kullanabilirsiniz. Bu değişken, viewport tetikleyicisine parametre olarak geçirilir.

```angular-html
<div #greeting>Hello!</div>
@defer (on viewport(greeting)) {
  <greetings-cmp />
}
```

`IntersectionObserver` seçeneklerini özelleştirmek istiyorsanız, `viewport` tetikleyicisi bir nesne literali geçirmeyi destekler. Literal, `root` hariç `IntersectionObserver`'ın ikinci parametresinden tüm özellikleri destekler. Nesne literali notasyonunu kullanırken, tetikleyicinizi `trigger` özelliğini kullanarak geçirmeniz gerekir.

```angular-html
<div #greeting>Hello!</div>

<!-- Seçenekler ve bir tetikleyici ile -->
@defer (on viewport({trigger: greeting, rootMargin: '100px', threshold: 0.5})) {
  <greetings-cmp />
}

<!-- Seçenekler ve örtük bir tetikleyici ile -->
@defer (on viewport({rootMargin: '100px', threshold: 0.5})) {
  <greetings-cmp />
} @placeholder {
  <div>Implied trigger</div>
}
```

#### `interaction`

`interaction` tetikleyicisi, kullanıcı belirtilen elemanla `click` veya `keydown` olayları aracılığıyla etkileşime geçtiğinde ertelenmiş içeriği yükler.

Varsayılan olarak, yer tutucu etkileşim elemanı olarak hareket eder. Bu şekilde kullanılan yer tutucuların tek bir kök elemanı olmalıdır.

```angular-html
@defer (on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Alternatif olarak, `@defer` bloğuyla aynı şablonda bir [şablon referans değişkeni](/guide/templates/variables) belirterek etkileşimler için izlenen eleman olarak kullanabilirsiniz. Bu değişken, viewport tetikleyicisine parametre olarak geçirilir.

```angular-html
<div #greeting>Hello!</div>
@defer (on interaction(greeting)) {
  <greetings-cmp />
}
```

#### `hover`

`hover` tetikleyicisi, fare `mouseover` ve `focusin` olayları aracılığıyla tetiklenen alanın üzerine geldiğinde ertelenmiş içeriği yükler.

Varsayılan olarak, yer tutucu etkileşim elemanı olarak hareket eder. Bu şekilde kullanılan yer tutucuların tek bir kök elemanı olmalıdır.

```angular-html
@defer (on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Alternatif olarak, `@defer` bloğuyla aynı şablonda bir [şablon referans değişkeni](/guide/templates/variables) belirterek görünüm alanına giriş için izlenen eleman olarak kullanabilirsiniz. Bu değişken, viewport tetikleyicisine parametre olarak geçirilir.

```angular-html
<div #greeting>Hello!</div>
@defer (on hover(greeting)) {
  <greetings-cmp />
}
```

#### `immediate`

`immediate` tetikleyicisi, ertelenmiş içeriği hemen yükler. Bu, ertelenmiş bloğun diğer tüm ertelenmemiş içerik işlemeyi bitirdiğinde yüklendiği anlamına gelir.

```angular-html
@defer (on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `timer`

`timer` tetikleyicisi, belirtilen bir süreden sonra ertelenmiş içeriği yükler.

```angular-html
@defer (on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Süre parametresi milisaniye (`ms`) veya saniye (`s`) cinsinden belirtilmelidir.

### `when`

`when` tetikleyicisi özel bir koşul ifadesi kabul eder ve koşul truthy olduğunda ertelenmiş içeriği yükler.

```angular-html
@defer (when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Bu tek seferlik bir işlemdir - `@defer` bloğu, koşul truthy olduktan sonra falsy bir değere dönüşse yer tutucuya geri dönmez.

## `prefetch` ile verileri ön-yükleme

Ertelenmiş içeriğin ne zaman gösterileceğini belirleyen bir koşul belirtmenin yanı sıra, isteğe bağlı olarak bir **ön-yükleme tetikleyicisi** belirtebilirsiniz. Bu tetikleyici, ertelenmiş içerik gösterilmeden önce `@defer` bloğuyla ilişkili JavaScript'i yüklemenize olanak tanır.

Ön-yükleme, bir kullanıcı bir defer bloğunu henüz görmemiş veya etkileşime geçmemiş olsa bile, yakında etkileşime geçebileceği kaynakları ön-yüklemeye başlamanız gibi daha gelişmiş davranışları etkinleştirir ve kaynakları daha hızlı kullanılabilir hale getirir.

Bir ön-yükleme tetikleyicisini, bloğun ana tetikleyicisine benzer şekilde ancak `prefetch` anahtar sözcüğü ile önekli olarak belirtebilirsiniz. Bloğun ana tetikleyicisi ve ön-yükleme tetikleyicisi noktalı virgül (`;`) karakteriyle ayrılır.

Aşağıdaki örnekte, tarayıcı boşta olduğunda ön-yükleme başlar ve bloğun içeriği yalnızca kullanıcı yer tutucu ile etkileşime geçtiğinde işlenir.

```angular-html
@defer (on interaction; prefetch on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

## `@defer` bloklarını test etme

Angular, `@defer` bloklarını test etme ve test sırasında farklı durumları tetikleme sürecini basitleştirmek için TestBed API'leri sağlar. Varsayılan olarak, testlerdeki `@defer` blokları gerçek bir uygulamadaki defer bloğunun davranacağı gibi oynatılır. Durumları manuel olarak adımlamak istiyorsanız, TestBed yapılandırmasında defer blok davranışını `Manual` olarak değiştirebilirsiniz.

```angular-ts
it('should render a defer block in different states', async () => {
  // defer blok davranışını manuel kontrol için "duraklatılmış" durumda başlatacak şekilde yapılandırır.
  TestBed.configureTestingModule({deferBlockBehavior: DeferBlockBehavior.Manual});
  @Component({
    // ...
    template: `
      @defer {
        <large-component />
      } @placeholder {
        Placeholder
      } @loading {
        Loading...
      }
    `,
  })
  class ExampleA {}
  // Bileşen fixture'ını oluştur.
  const componentFixture = TestBed.createComponent(ExampleA);
  // Tüm defer blok fixture'larının listesini al ve ilk bloğu seç.
  const deferBlockFixture = (await componentFixture.getDeferBlocks())[0];
  // Varsayılan olarak yer tutucu durumunu işler.
  expect(componentFixture.nativeElement.innerHTML).toContain('Placeholder');
  // Yükleme durumunu işle ve işlenmiş çıktıyı doğrula.
  await deferBlockFixture.render(DeferBlockState.Loading);
  expect(componentFixture.nativeElement.innerHTML).toContain('Loading');
  // Son durumu işle ve çıktıyı doğrula.
  await deferBlockFixture.render(DeferBlockState.Complete);
  expect(componentFixture.nativeElement.innerHTML).toContain('large works!');
});
```

## `@defer` `NgModule` ile çalışır mı?

`@defer` blokları hem bağımsız hem de NgModule tabanlı bileşenler, direktifler ve pipe'larla uyumludur. Ancak, **yalnızca bağımsız bileşenler, direktifler ve pipe'lar ertelenebilir**. NgModule tabanlı bağımlılıklar ertelenmez ve istekli olarak yüklenen pakete dahil edilir.

## `@defer` blokları ve Hot Module Reload (HMR) uyumluluğu

Hot Module Replacement (HMR) aktif olduğunda, tüm `@defer` blok parçaları, yapılandırılmış tetikleyicileri geçersiz kılarak istekli bir şekilde getirilir. Standart tetikleyici davranışını geri yüklemek için uygulamanızı `--no-hmr` bayrağı ile sunarak HMR'ı devre dışı bırakmanız gerekir.

## `@defer` sunucu taraflı işleme (SSR) ve statik site oluşturma (SSG) ile nasıl çalışır?

Varsayılan olarak, sunucuda bir uygulama işlenirken (SSR veya SSG kullanılarak), defer blokları her zaman `@placeholder`'larını işler (veya bir yer tutucu belirtilmemişse hiçbir şey işler) ve tetikleyiciler çalıştırılmaz. İstemci tarafında, `@placeholder`'ın içeriği hidrate edilir ve tetikleyiciler aktive edilir.

`@defer` bloklarının ana içeriğini sunucuda (hem SSR hem de SSG) işlemek için, [Artımlı Hidrasyon özelliğini](/guide/incremental-hydration) etkinleştirebilir ve gerekli bloklar için `hydrate` tetikleyicilerini yapılandırabilirsiniz.

## Görünümleri erteleme için en iyi uygulamalar

### İç içe `@defer` blokları ile art arda yüklemelerden kaçınma

İç içe `@defer` bloklarınız olduğunda, aynı anda yüklemeyi önlemek için farklı tetikleyicilere sahip olmalıdırlar; aksi takdirde art arda isteklere neden olur ve sayfa yükleme performansını olumsuz etkileyebilir.

### Düzen kaymalarından kaçınma

İlk yüklemede kullanıcının görünüm alanında görünen bileşenleri ertelemekten kaçının. Bunu yapmak, toplam düzenleme kaymasında (CLS) artışa neden olarak Core Web Vitals'ı olumsuz etkileyebilir.

Bunun gerekli olması durumunda, içeriğin ilk sayfa işlemesi sırasında yüklenmesine neden olan `immediate`, `timer`, `viewport` ve özel `when` tetikleyicilerinden kaçının.

### Erişilebilirliği göz önünde bulundurma

`@defer` bloklarını kullanırken, ekran okuyucuları gibi yardımcı teknolojiler kullanan kullanıcılar üzerindeki etkiyi göz önünde bulundurun.
Ertelenmiş bir bölüme odaklanan ekran okuyucuları başlangıçta yer tutucu veya yükleme içeriğini okuyacak, ancak ertelenmiş içerik yüklendiğinde değişiklikleri duyuramayabilir.

Ertelenmiş içerik değişikliklerinin ekran okuyucularına duyurulmasını sağlamak için, `@defer` bloğunuzu canlı bölge içeren bir elemanla sarmalayabilirsiniz:

```angular-html
<div aria-live="polite" aria-atomic="true">
  @defer (on timer(2000)) {
    <user-profile [user]="currentUser" />
  } @placeholder {
    Loading user profile...
  } @loading {
    Please wait...
  } @error {
    Failed to load profile
  }
</div>
```

Bu, geçişler (yer tutucu &rarr; yükleme &rarr; içerik/hata) meydana geldiğinde kullanıcıya değişikliklerin duyurulmasını sağlar.
