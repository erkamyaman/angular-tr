# Bileşen test'lerinin temelleri

Bir bileşen, Angular uygulamasının diğer tüm parçalarından farklı olarak, bir HTML şablonu ile bir TypeScript sınıfını birleştirir.
Bileşen gerçekten şablon ve sınıfın _birlikte çalışmasıdır_.
Bir bileşeni yeterince test etmek için, amaçlandığı gibi birlikte çalıştıklarını test etmelisiniz.

Bu tür testler, Angular'ın yaptığı gibi, bileşenin ana öğesini tarayıcı DOM'unda oluşturmayı ve bileşen sınıfının şablonu tarafından tanımlanan DOM ile etkileşimini incelemeyi gerektirir.

Angular `TestBed`, aşağıdaki bölümlerde göreceğiniz gibi bu tür testleri kolaylaştırır.
Ancak birçok durumda, DOM katılımı olmadan _bileşen sınıfını tek başına test etmek_, bileşenin davranışının çoğunu basit ve daha belirgin bir şekilde doğrulayabilir.

## Bileşen DOM test'i

Bir bileşen sadece sınıfından ibaret değildir.
Bir bileşen DOM ile ve diğer bileşenlerle etkileşim kurar.
Sınıflar tek başına, bileşenin düzgün render edilip edilmeyeceğini, kullanıcı girdisine ve hareketlerine yanıt verip vermeyeceğini veya üst ve alt bileşenleriyle entegre olup olmayacağını söyleyemez.

- `Lightswitch.clicked()` kullanıcının çağırabilmesi için bir şeye bağlı mı?
- `Lightswitch.message` görüntüleniyor mu?
- Kullanıcı `DashboardHero` bileşeni tarafından görüntülenen kahramanı gerçekten seçebilir mi?
- Kahraman adı beklendiği gibi görüntüleniyor mu \(örneğin büyük harfle\)?
- `Welcome` bileşeninin şablonu tarafından karşılama mesajı görüntüleniyor mu?

Bunlar, daha önce gösterilen basit bileşenler için sorunlu sorular olmayabilir.
Ancak birçok bileşen, şablonlarında tanımlanan DOM öğeleriyle karmaşık etkileşimlere sahiptir ve bileşen durumu değiştikçe HTML'nin görünüp kaybolmasına neden olur.

Bu tür soruları yanıtlamak için, bileşenlerle ilişkili DOM öğelerini oluşturmanız, bileşen durumunun uygun zamanlarda düzgün şekilde görüntülendiğini doğrulamak için DOM'u incelemeniz ve bu etkileşimlerin bileşenin beklendiği gibi davranmasına neden olup olmadığını belirlemek için ekranla kullanıcı etkileşimini simüle etmeniz gerekir.

Bu tür testleri yazmak için `TestBed`'in ek özelliklerini ve diğer test yardımcılarını kullanacaksınız.

### CLI tarafından oluşturulan test'ler

CLI, yeni bir bileşen oluşturmanızı istediğinizde varsayılan olarak sizin için bir başlangıç test dosyası oluşturur.

Örneğin, aşağıdaki CLI komutu `app/banner` klasöründe bir `Banner` bileşeni oluşturur \(satır içi şablon ve stillerle\):

```shell
ng generate component banner --inline-template --inline-style
```

Ayrıca bileşen için şu şekilde görünen bir başlangıç test dosyası olan `banner.spec.ts` oluşturur:

```ts
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Banner} from './banner';

describe('Banner', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Banner],
    }).compileComponents();

    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Kurulumu sadeleştirme

Bu dosyanın yalnızca son üç satırı bileşeni gerçekten test eder ve yaptıkları tek şey Angular'ın bileşeni oluşturabildiğini doğrulamaktır.

Dosyanın geri kalanı, bileşen önemli bir şeye dönüşürse gerekli _olabilecek_ daha gelişmiş testler için hazırlık yapan şablon kodudur.

Bu gelişmiş test özelliklerini aşağıdaki bölümlerde öğreneceksiniz.
Şimdilik, bu test dosyasını daha yönetilebilir bir boyuta radikal olarak küçültebilirsiniz:

```ts
describe('Banner (minimal)', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(Banner);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
```

Daha sonra test ihtiyaçlarınıza uygun imports, providers ve daha fazla bildirim ile `TestBed.configureTestingModule()` çağıracaksınız.
İsteğe bağlı `override` metotları yapılandırmanın özelliklerini daha da ince ayar yapabilir.

NOTE: `TestBed.compileComponents` yalnızca test edilen bileşenlerde `@defer` blokları kullanıldığında gereklidir.

### `createComponent()`

`TestBed`'i yapılandırdıktan sonra, `createComponent()` metodunu çağırırsınız.

```ts
const fixture = TestBed.createComponent(Banner);
```

`TestBed.createComponent()`, `Banner` bileşeninin bir örneğini oluşturur, test çalıştırıcısı DOM'una karşılık gelen bir öğe ekler ve bir [`ComponentFixture`](#componentfixture) döndürür.

IMPORTANT: `createComponent` çağrıldıktan sonra `TestBed`'i yeniden yapılandırmayın.

`createComponent` metodu mevcut `TestBed` tanımını dondurur ve daha fazla yapılandırmaya kapatır.

Artık başka `TestBed` yapılandırma metotları, ne `configureTestingModule()`, ne `get()`, ne de herhangi bir `override...` metodu çağıramazsınız.
Denerseniz, `TestBed` bir hata fırlatır.

### `ComponentFixture`

[`ComponentFixture`](api/core/testing/ComponentFixture), oluşturulan bileşen ve karşılık gelen öğesi ile etkileşim kurmak için bir test donanımıdır.

Fixture aracılığıyla bileşen örneğine erişin ve bir beklenti ile var olduğunu doğrulayın:

```ts
const component = fixture.componentInstance;
expect(component).toBeDefined();
```

### `beforeEach()`

Bu bileşen geliştikçe daha fazla test ekleyeceksiniz.
Her test için `TestBed` yapılandırmasını tekrarlamak yerine, kurulumu bir `beforeEach()` içine ve bazı destekleyici değişkenlere çekecek şekilde yeniden düzenlersiniz:

```ts
describe('Banner (with beforeEach)', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;

    await fixture.whenStable(); // ilk render'ı beklemek için gerekli
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
```

HELPFUL: `beforeEach` içinde `await fixture.whenStable` ile ilk render'ı bekleyerek tek testler senkron hale gelir.

Şimdi `fixture.nativeElement`'den bileşenin öğesini alan ve beklenen metni arayan bir test ekleyin.

```ts
it('should contain "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  expect(bannerElement.textContent).toContain('banner works!');
});
```

### Bir `setup` fonksiyonu oluşturma

`beforeEach`'e alternatif olarak, her testte çağıracağınız bir kurulum fonksiyonu da oluşturabilirsiniz.
Bir kurulum fonksiyonu, parametreler aracılığıyla özelleştirilebilme avantajına sahiptir.

İşte bir kurulum fonksiyonunun nasıl görünebileceğine dair bir örnek:

```ts
function setup(providers?: StaticProviders[]): ComponentFixture<Banner> {
  TestBed.configureTestingModule({providers});
  return TestBed.createComponent(Banner);
}
```

### `nativeElement`

`ComponentFixture.nativeElement` değeri `any` tipindedir.
Daha sonra `DebugElement.nativeElement` ile karşılaşacaksınız ve o da `any` tipindedir.

Angular, derleme zamanında `nativeElement`'in ne tür bir HTML öğesi olduğunu veya bir HTML öğesi olup olmadığını bilemez.
Uygulama, sunucu veya node ortamı gibi _tarayıcı olmayan bir platformda_ çalışıyor olabilir; burada öğe azaltılmış bir API'ye sahip olabilir veya hiç mevcut olmayabilir.

Bu kılavuzdaki testler tarayıcıda çalıştırılmak üzere tasarlanmıştır, bu nedenle `nativeElement` değeri her zaman bir `HTMLElement` veya türetilmiş sınıflarından biri olacaktır.

Bir tür `HTMLElement` olduğunu bilerek, öğe ağacına daha derinlemesine dalmak için standart HTML `querySelector` kullanın.

İşte paragraf öğesini almak ve banner metnini aramak için `HTMLElement.querySelector` çağıran başka bir test:

```ts
it('should have <p> with "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  const p = bannerElement.querySelector('p')!;
  expect(p.textContent).toEqual('banner works!');
});
```

### `DebugElement`

Angular _fixture_, bileşenin öğesini doğrudan `fixture.nativeElement` aracılığıyla sağlar.

```ts
const bannerElement: HTMLElement = fixture.nativeElement;
```

Bu aslında `fixture.debugElement.nativeElement` olarak uygulanan bir kolaylık metodudur.

```ts
const bannerDe: DebugElement = fixture.debugElement;
const bannerEl: HTMLElement = bannerDe.nativeElement;
```

Öğeye bu dolambaçlı yolun iyi bir nedeni vardır.

`nativeElement`'in özellikleri çalışma zamanı ortamına bağlıdır.
Bu testleri DOM'u olmayan veya DOM emülasyonu tam `HTMLElement` API'sini desteklemeyen _tarayıcı olmayan_ bir platformda çalıştırıyor olabilirsiniz.

Angular, _desteklenen tüm platformlarda_ güvenli şekilde çalışmak için `DebugElement` soyutlamasına güvenir.
Angular, bir HTML öğe ağacı oluşturmak yerine, çalışma zamanı platformu için _yerel öğeleri_ saran bir `DebugElement` ağacı oluşturur.
`nativeElement` özelliği `DebugElement`'i açar ve platforma özgü öğe nesnesini döndürür.

Bu kılavuz için örnek testler yalnızca tarayıcıda çalıştırılmak üzere tasarlandığından, bu testlerdeki `nativeElement` her zaman bir test içinde keşfedebileceğiniz tanıdık metotları ve özellikleri olan bir `HTMLElement`'dir.

İşte `fixture.debugElement.nativeElement` ile yeniden uygulanan önceki test:

```ts
it('should find the <p> with fixture.debugElement.nativeElement', () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const bannerEl: HTMLElement = bannerDe.nativeElement;
  const p = bannerEl.querySelector('p')!;
  expect(p.textContent).toEqual('banner works!');
});
```

`DebugElement`, bu kılavuzun başka yerlerinde göreceğiniz gibi, testlerde faydalı olan başka metot ve özelliklere sahiptir.

`DebugElement` sembolünü Angular çekirdek kütüphanesinden içe aktarırsınız.

```ts
import {DebugElement} from '@angular/core';
```

### `By.css()`

Bu kılavuzdaki tüm testler tarayıcıda çalışsa da, bazı uygulamalar en azından bazen farklı bir platformda çalışabilir.

Örneğin, bileşen önce sunucuda render edilebilir, uygulamanın zayıf bağlantılı cihazlarda daha hızlı başlatılmasını sağlamak için bir strateji olarak.
Sunucu tarafı render'ı tam HTML öğe API'sini desteklemeyebilir.
`querySelector`'ı desteklemiyorsa, önceki test başarısız olabilir.

`DebugElement`, desteklenen tüm platformlar için çalışan sorgu metotları sunar.
Bu sorgu metotları, `DebugElement` ağacındaki bir düğüm seçim kriterlerine uyduğunda `true` döndüren bir _yüklem_ fonksiyonu alır.

Çalışma zamanı platformu için bir kütüphaneden içe aktarılan `By` sınıfının yardımıyla bir _yüklem_ oluşturursunuz.
İşte tarayıcı platformu için `By` içe aktarma:

```ts
import {By} from '@angular/platform-browser';
```

Aşağıdaki örnek, `DebugElement.query()` ve tarayıcının `By.css` metodu ile önceki testi yeniden uygular.

```ts
it('should find the <p> with fixture.debugElement.query(By.css)', () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const paragraphDe = bannerDe.query(By.css('p'));
  const p: HTMLElement = paragraphDe.nativeElement;
  expect(p.textContent).toEqual('banner works!');
});
```

Bazı dikkat çekici gözlemler:

- `By.css()` statik metodu, [standart CSS seçici](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors 'CSS selectors') ile `DebugElement` düğümlerini seçer.
- Sorgu, paragraf için bir `DebugElement` döndürür.
- Paragraf öğesini almak için bu sonucu açmanız gerekir.

CSS seçiciye göre filtreleme yapıyorsanız ve yalnızca tarayıcının _yerel öğesinin_ özelliklerini test ediyorsanız, `By.css` yaklaşımı abartılı olabilir.

`querySelector()` veya `querySelectorAll()` gibi standart bir `HTMLElement` metodu ile filtreleme yapmak genellikle daha basit ve anlaşılırdır.
