# Deferred loading with `@defer`

Ertelenebilir gorunumler, `@defer` bloklari olarak da bilinir, bir sayfanin ilk islemesi icin kesinlikle gerekli olmayan kodun yuklenmesini erteleyerek uygulamanizin ilk paket boyutunu azaltir. Bu genellikle daha hizli bir ilk yukleme ve Core Web Vitals (CWV) iyilestirmesiyle sonuclanir; ozellikle Largest Contentful Paint (LCP) ve Time to First Byte (TTFB).

Bu ozelligi kullanmak icin sablonunuzun bir bolumunu bildirimsel olarak bir @defer blogu ile sarmalayabilirsiniz:

```angular-html
@defer {
  <large-component />
}
```

`@defer` blogunun icindeki tum bilesenler, direktifler ve pipe'lar icin kod ayri bir JavaScript dosyasina ayrilir ve yalnizca gerekli oldugunda, sablonun geri kalani islendikten sonra yuklenir.

Ertelenebilir gorunumler; cesitli tetikleyicileri, on-yukleme seceneklerini ve yer tutucu, yukleme ve hata durumu yonetimi icin alt bloklari destekler.

## Which dependencies are deferred?

Bilesenler, direktifler, pipe'lar ve tum bilesen CSS stilleri bir uygulama yuklenirken ertelenebilir.

Bir `@defer` blogu icindeki bagimliliklarin ertelenmesi icin iki kosulu karsilamalari gerekir:

1. **Bagimsiz (standalone) olmalidilar.** Bagimsiz olmayan bagimliliklar ertelenemez ve `@defer` bloklari icinde olsalar bile istekli (eagerly) olarak yuklenirler.
1. **Ayni dosya icinde `@defer` bloklari disinda referans verilmemelidir.** `@defer` blogu disinda veya ViewChild sorgularinda referans verilirse, bagimliliklar istekli olarak yuklenecektir.

`@defer` blogunda kullanilan bilesenler, direktifler ve pipe'larin _gecisli_ bagimliliklari kesinlikle bagimsiz olmak zorunda degildir; gecisli bagimliliklar hala bir `NgModule`'da bildirilebilir ve ertelenmiis yuklemeye katilabilir.

Angular'in derleyicisi, `@defer` blogunda kullanilan her bilesen, direktif ve pipe icin bir [dinamik import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) ifadesi uretir. Blogun ana icerigi tum import'lar cozuldukten sonra islenir. Angular bu import'lar icin belirli bir sira garanti etmez.

## How to manage different stages of deferred loading

`@defer` bloklari, ertelenmmis yukleme surecinin farkli asamalarini zarifce yonetmenize olanak taniyan birkaC alt bloga sahiptir.

### `@defer`

Bu, tembel olarak yuklenen icerik bolumunu tanimlayan birincil bloktur. Baslangicta islenmez - ertelenmis icerik, belirtilen [tetikleyici](#controlling-deferred-content-loading-with-triggers) olustudigunda veya `when` kosulu karsilandiginda yuklenir ve islenir.

Varsayilan olarak, bir `@defer` blogu tarayici durumu [bosta](/guide/templates/defer#idle) oldugunda tetiklenir.

```angular-html
@defer {
  <large-component />
}
```

### Show placeholder content with `@placeholder`

Varsayilan olarak, defer bloklari tetiklenmeden once herhangi bir icerik islemez.

`@placeholder`, `@defer` blogu tetiklenmeden once gosterilecek icerigi bildiren istege bagli bir bloktur.

```angular-html
@defer {
  <large-component />
} @placeholder {
  <p>Placeholder content</p>
}
```

Istege bagli olsa da, belirli tetikleyiciler calisabilmek icin bir `@placeholder` veya bir [sablon referans degiskeni](/guide/templates/variables#template-reference-variables) bulunmasini gerektirebilir. Daha fazla bilgi icin [Tetikleyiciler](#controlling-deferred-content-loading-with-triggers) bolumune bakin.

Angular, yukleme tamamlandiginda yer tutucu icerigi ana icerikle degistirir. Yer tutucu bolumunde duz HTML, bilesenler, direktifler ve pipe'lar dahil herhangi bir icerik kullanabilirsiniz. _Yer tutucu blogunun bagimliliklarin istekli olarak yuklendigini_ unutmayin.

`@placeholder` blogu, yer tutucu icerigi ilk islendikten sonra bu yer tutucunun gosterilecegi `minimum` sure miktarini belirtmek icin istege bagli bir parametre kabul eder.

```angular-html
@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>Placeholder content</p>
}
```

Bu `minimum` parametresi milisaniye (ms) veya saniye (s) cinsinden zaman artimlariyla belirtilir. Ertelenms bagimliliklar hizla getirildiginde yer tutucu iceriginin hizli titresmesini onlemek icin bu parametreyi kullanabilirsiniz.

### Show loading content with `@loading`

`@loading` blogu, ertelenmis bagimliliklar yuklenirken gosterilecek icerigi bildirmenize olanak taniyan istege bagli bir bloktur. Yukleme tetiklendiginde `@placeholder` blogunun yerini alir.

```angular-html
@defer {
  <large-component />
} @loading {
  <img alt="loading..." src="loading.gif" />
} @placeholder {
  <p>Placeholder content</p>
}
```

Bagimliliklari (`@placeholder`'a benzer sekilde) istekli olarak yuklenir.

`@loading` blogu, ertelenmis bagimliliklar hizla getirildiginde olusabilecek icerik titremesini onlemeye yardimci olmak icin iki istege bagli parametre kabul eder:

- `minimum` - bu yer tutucunun gosterilecegi minimum sure miktari
- `after` - yukleme sablonunu gostermeden once yukleme basladiktan sonra bekleme suresi

```angular-html
@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="loading..." src="loading.gif" />
}
```

Her iki parametre de milisaniye (ms) veya saniye (s) cinsinden zaman artimlariyla belirtilir. Ayrica, her iki parametrenin zamanlayicilari yukleme tetiklendikten hemen sonra baslar.

### Show error state when deferred loading fails with `@error`

`@error` blogu, ertelenmis yukleme basarisiz olursa goruntulenen istege bagli bir bloktur. `@placeholder` ve `@loading`'e benzer sekilde, @error blogunun bagimliliklari istekli olarak yuklenir.

```angular-html
@defer {
  <large-component />
} @error {
  <p>Failed to load large component.</p>
}
```

## Controlling deferred content loading with triggers

Angular'in ertelenmis icerigi ne zaman yukleyip goruntuleyecegini kontrol eden **tetikleyiciler** belirtebilirsiniz.

Bir `@defer` blogu tetiklendiginde, yer tutucu icerigi tembel olarak yuklenen icerikle degistirir.

Birden fazla olay tetikleyicisi noktali virgul (`;`) ile ayrilarak tanimlanabilir ve VEYA kosullari olarak degerlendirilir.

Iki tur tetikleyici vardir: `on` ve `when`.

### `on`

`on`, `@defer` blogunun ne zaman tetiklenecegine dair bir kosul belirtir.

Kullanilabilir tetikleyiciler asagidaki gibidir:

| Tetikleyici                   | Aciklama                                                        |
| ----------------------------- | --------------------------------------------------------------- |
| [`idle`](#idle)               | Tarayici bosta oldugunda tetiklenir.                            |
| [`viewport`](#viewport)       | Belirtilen icerik gorunum alanina girdiginde tetiklenir         |
| [`interaction`](#interaction) | Kullanici belirtilen elemanla etkilesime gectiginde tetiklenir  |
| [`hover`](#hover)             | Fare belirtilen alanin uzerine geldiginde tetiklenir            |
| [`immediate`](#immediate)     | Ertelenmemis icerik islemeyi bitirdikten hemen sonra tetiklenir |
| [`timer`](#timer)             | Belirli bir sureden sonra tetiklenir                            |

#### `idle`

`idle` tetikleyicisi, tarayici requestIdleCallback'e dayali olarak bosta durumuna ulastiginda ertelenmis icerigi yukler. Bu, bir defer blogunun varsayilan davranisidir.

```angular-html
<!-- @defer (on idle) -->
@defer {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `viewport`

`viewport` tetikleyicisi, belirtilen icerik [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) kullanilarak gorunum alanina girdiginde ertelenmis icerigi yukler. Gozlemlenen icerik `@placeholder` icerigi veya acik bir eleman referansi olabilir.

Varsayilan olarak, `@defer` yer tutucunun gorunum alanina girip girmedigini izler. Bu sekilde kullanilan yer tutucularin tek bir kok elemani olmalidir.

```angular-html
@defer (on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Alternatif olarak, `@defer` bloguyla ayni sablonda bir [sablon referans degiskeni](/guide/templates/variables) belirterek gorunum alanina giris icin izlenen eleman olarak kullanabilirsiniz. Bu degisken, viewport tetikleyicisine parametre olarak gecirilir.

```angular-html
<div #greeting>Hello!</div>
@defer (on viewport(greeting)) {
  <greetings-cmp />
}
```

`IntersectionObserver` seceneklerini ozellestirmek istiyorsaniz, `viewport` tetikleyicisi bir nesne literali gecirmeyi destekler. Literal, `root` haric `IntersectionObserver`'in ikinci parametresinden tum ozellikleri destekler. Nesne literali notasyonunu kullanirken, tetikleyicinizi `trigger` ozelligini kullanarak gecirmeniz gerekir.

```angular-html
<div #greeting>Hello!</div>

<!-- With options and a trigger -->
@defer (on viewport({trigger: greeting, rootMargin: '100px', threshold: 0.5})) {
  <greetings-cmp />
}

<!-- With options and an implied trigger -->
@defer (on viewport({rootMargin: '100px', threshold: 0.5})) {
  <greetings-cmp />
} @placeholder {
  <div>Implied trigger</div>
}
```

#### `interaction`

`interaction` tetikleyicisi, kullanici belirtilen elemanla `click` veya `keydown` olaylari araciligiyla etkilesime gectiginde ertelenmis icerigi yukler.

Varsayilan olarak, yer tutucu etkilesim elemani olarak hareket eder. Bu sekilde kullanilan yer tutucularin tek bir kok elemani olmalidir.

```angular-html
@defer (on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Alternatif olarak, `@defer` bloguyla ayni sablonda bir [sablon referans degiskeni](/guide/templates/variables) belirterek etkilesimler icin izlenen eleman olarak kullanabilirsiniz. Bu degisken, viewport tetikleyicisine parametre olarak gecirilir.

```angular-html
<div #greeting>Hello!</div>
@defer (on interaction(greeting)) {
  <greetings-cmp />
}
```

#### `hover`

`hover` tetikleyicisi, fare `mouseover` ve `focusin` olaylari araciligiyla tetiklenen alanin uzerine geldiginde ertelenmis icerigi yukler.

Varsayilan olarak, yer tutucu etkilesim elemani olarak hareket eder. Bu sekilde kullanilan yer tutucularin tek bir kok elemani olmalidir.

```angular-html
@defer (on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Alternatif olarak, `@defer` bloguyla ayni sablonda bir [sablon referans degiskeni](/guide/templates/variables) belirterek gorunum alanina giris icin izlenen eleman olarak kullanabilirsiniz. Bu degisken, viewport tetikleyicisine parametre olarak gecirilir.

```angular-html
<div #greeting>Hello!</div>
@defer (on hover(greeting)) {
  <greetings-cmp />
}
```

#### `immediate`

`immediate` tetikleyicisi, ertelenmis icerigi hemen yukler. Bu, ertelenmis blogun diger tum ertelenmemis icerik islenmeyi bitirdiginde yuklendigi anlamina gelir.

```angular-html
@defer (on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `timer`

`timer` tetikleyicisi, belirtilen bir sureden sonra ertelenmis icerigi yukler.

```angular-html
@defer (on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Sure parametresi milisaniye (`ms`) veya saniye (`s`) cinsinden belirtilmelidir.

### `when`

`when` tetikleyicisi ozel bir kosul ifadesi kabul eder ve kosul truthy oldugunda ertelenmis icerigi yukler.

```angular-html
@defer (when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Bu tek seferlik bir islemdir - `@defer` blogu, kosul truthy olduktan sonra falsy bir degere donusse yer tutucuya geri donmez.

## Prefetching data with `prefetch`

Ertelenmis icerigin ne zaman gosterilecegini belirleyen bir kosul belirtmenin yani sira, istege bagli olarak bir **on-yukleme tetikleyicisi** belirtebilirsiniz. Bu tetikleyici, ertelenmis icerik gosterilmeden once `@defer` bloguyla iliskili JavaScript'i yuklemenize olanak tanir.

On-yukleme, bir kullanici bir defer blokunu henuz gormemis veya etkilesime gecmemis olsa bile, yakinda etkilesime gecebilecegi kaynaklari on-yuklemeye baslamaniz gibi daha gelismis davranislari etkinlestirir ve kaynaklari daha hizli kullanilabilir hale getirir.

Bir on-yukleme tetikleyicisini, blogun ana tetikleyicisine benzer sekilde ancak `prefetch` anahtar sozcugu ile onekli olarak belirtebilirsiniz. Blogun ana tetikleyicisi ve on-yukleme tetikleyicisi noktali virgul (`;`) karakteriyle ayrilir.

Asagidaki ornekte, tarayici bosta oldugunda on-yukleme baslar ve blogun icerigi yalnizca kullanici yer tutucu ile etkilesime gectiginde islenir.

```angular-html
@defer (on interaction; prefetch on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

## Testing `@defer` blocks

Angular, `@defer` bloklarini test etme ve test sirasinda farkli durumlari tetikleme surecini basitlestirmek icin TestBed API'leri saglar. Varsayilan olarak, testlerdeki `@defer` bloklari gercek bir uygulamadaki defer blogunun davranacagi gibi oynatilir. Durumlari manuel olarak adimlamak istiyorsaniz, TestBed yapilandirmasinda defer blok davranisini `Manual` olarak degistirebilirsiniz.

```angular-ts
it('should render a defer block in different states', async () => {
  // configures the defer block behavior to start in "paused" state for manual control.
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
  // Create component fixture.
  const componentFixture = TestBed.createComponent(ExampleA);
  // Retrieve the list of all defer block fixtures and get the first block.
  const deferBlockFixture = (await componentFixture.getDeferBlocks())[0];
  // Renders placeholder state by default.
  expect(componentFixture.nativeElement.innerHTML).toContain('Placeholder');
  // Render loading state and verify rendered output.
  await deferBlockFixture.render(DeferBlockState.Loading);
  expect(componentFixture.nativeElement.innerHTML).toContain('Loading');
  // Render final state and verify the output.
  await deferBlockFixture.render(DeferBlockState.Complete);
  expect(componentFixture.nativeElement.innerHTML).toContain('large works!');
});
```

## Does `@defer` work with `NgModule`?

`@defer` bloklari hem bagimsiz hem de NgModule tabanli bilesenler, direktifler ve pipe'larla uyumludur. Ancak, **yalnizca bagimsiz bilesenler, direktifler ve pipe'lar ertelenebilir**. NgModule tabanli bagimliliklar ertelenmez ve istekli olarak yuklenen pakete dahil edilir.

## Compatibility between `@defer` blocks and Hot Module Reload (HMR)

Hot Module Replacement (HMR) aktif oldugunda, tum `@defer` blok parcalari, yapilandirilmis tetikleyicileri geersiz kilarak istekli bir sekilde getirilir. Standart tetikleyici davranisini geri yuklemek icin uygulamanizi `--no-hmr` bayragi ile sunarak HMR'i devre disi birakmaniz gerekir.

## How does `@defer` work with server-side rendering (SSR) and static-site generation (SSG)?

Varsayilan olarak, sunucuda bir uygulama islenirken (SSR veya SSG kullanilarak), defer bloklari her zaman `@placeholder`'larini isler (veya bir yer tutucu belirtilmemisse hicbir sey isler) ve tetikleyiciler calistrilmaz. Istemci tarafinda, `@placeholder`'in icerigi hidrate edilir ve tetikleyiciler aktive edilir.

`@defer` bloklarinin ana icerigini sunucuda (hem SSR hem de SSG) islemek icin, [Artimli Hidrasyon ozelligini](/guide/incremental-hydration) etkinlestirebilir ve gerekli bloklar icin `hydrate` tetikleyicilerini yapilandirabilirsiniz.

## Best practices for deferring views

### Avoid cascading loads with nested `@defer` blocks

Ic ice `@defer` bloklariniz oldugunda, ayni anda yuklemeyi onlemek icin farkli tetikleyicilere sahip olmalidilar; aksi takdirde art arda isteklere neden olur ve sayfa yukleme performansini olumsuz etkileyebilir.

### Avoid layout shifts

Ilk yuklemede kullanicinin gorunum alaninda gorunen bilesenleri ertelemekten kacinin. Bunu yapmak, toplam duzenleme kaymasinda (CLS) artisa neden olarak Core Web Vitals'i olumsuz etkileyebilir.

Bunun gerekli olmasi durumunda, icerigin ilk sayfa islemesi sirasinda yuklenmesine neden olan `immediate`, `timer`, `viewport` ve ozel `when` tetikleyicilerinden kacinin.

### Keep accessibility in mind

`@defer` bloklarini kullanirken, ekran okuyuculari gibi yardimci teknolojiler kullanan kullanicilar uzerindeki etkiyi goz onunde bulundurun.
Ertelenmis bir bolume odaklanan ekran okuyuculari baslangicta yer tutucu veya yukleme icerigini okuyacak, ancak ertelenmis icerik yuklendiginde degisiklikleri duyuramayabilir.

Ertelenmis icerik degisikliklerinin ekran okuyucularina duyurulmasini saglamak icin, `@defer` blogunuzu canli bolge iceren bir elemanla sarmalayabilirsiniz:

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

Bu, gecisler (yer tutucu &rarr; yukleme &rarr; icerik/hata) meydana geldiginde kullaniciya degisikliklerin duyurulmasini saglar.
