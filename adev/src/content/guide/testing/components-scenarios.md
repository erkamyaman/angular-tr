# Bileşen test senaryoları

Bu kılavuz yaygın bileşen test kullanım durumlarını inceler.

## Bileşen bağlama

Örnek uygulamada, `Banner` bileşeni HTML şablonunda statik başlık metni sunar.

Birkaç değişiklikten sonra, `Banner` bileşeni, bileşenin `title` özelliğine bağlanarak şu şekilde dinamik bir başlık sunar.

```angular-ts {header="banner.ts"}
import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-banner',
  template: '<h1>{{ title() }}</h1>',
  styles: ['h1 { color: green; font-size: 350%}'],
})
export class Banner {
  title = signal('Test Tour of Heroes');
}
```

Bu kadar minimal olsa da, bileşenin doğru içeriği olması gereken yerde görüntülediğini doğrulamak için bir test eklemeye karar verirsiniz.

### `<h1>` için sorgu

_title_ özelliği interpolasyon bağlamasını saran `<h1>` öğesinin değerini inceleyen bir dizi test yazacaksınız.

`beforeEach`'i, o öğeyi standart HTML `querySelector` ile bulmak ve `h1` değişkenine atamak için güncellersiniz.

```ts {header: "banner.component.spec.ts"}
let component: Banner;
let fixture: ComponentFixture<Banner>;
let h1: HTMLElement;

beforeEach(() => {
  fixture = TestBed.createComponent(Banner);
  component = fixture.componentInstance; // Banner test örneği
  h1 = fixture.nativeElement.querySelector('h1');
});
```

### `createComponent()` veri bağlamaz

İlk testinizde ekranın varsayılan `title`'ı görüntülemesini görmek istersiniz.
İçgüdünüz `<h1>`'i hemen inceleyen bir test yazmaktır:

```ts
it('should display original title', () => {
  expect(h1.textContent).toContain(component.title());
});
```

_Bu test_ şu mesajla _başarısız olur_:

```shell {hideCopy}
expected '' to contain 'Test Tour of Heroes'.
```

Bağlama, Angular **değişiklik algılama** gerçekleştirdiğinde olur.

Üretim ortamında, Angular bir bileşen oluşturduğunda veya kullanıcı bir tuşa bastığında değişiklik algılama otomatik olarak devreye girer.

`TestBed.createComponent` değişiklik algılamayı senkron olarak tetiklemez; revize edilmiş testte doğrulanan bir gerçek:

```ts
it('no title in the DOM after createComponent()', () => {
  expect(h1.textContent).toEqual('');
});
```

### `whenStable()`

`TestBed`'e `await fixture.whenStable()` ile değişiklik algılamanın çalışmasını beklemesini söyleyebilirsiniz.
Ancak o zaman `<h1>` beklenen başlığa sahip olur.

```ts
it('should display original title', async () => {
  await fixture.whenStable();
  expect(h1.textContent).toContain(component.title());
});
```

Gecikmiş değişiklik algılama kasıtlı ve kullanışlıdır.
Test yazarına, Angular veri bağlamayı başlatmadan ve [yaşam döngüsü kancalarını](guide/components/lifecycle) çağırmadan _önce_ bileşenin durumunu inceleme ve değiştirme fırsatı verir.

İşte `fixture.whenStable()` çağrılmadan _önce_ bileşenin `title` özelliğini değiştiren başka bir test.

```ts
it('should display a different test title', async () => {
  component.title.set('Test Title');
  await fixture.whenStable();
  expect(h1.textContent).toContain('Test Title');
});
```

### Signal'leri input'lara bağlama

Girdilerdeki değişiklikleri yansıtmak ve çıktıları dinlemek için sinyalleri girdilere ve fonksiyonları çıktılara dinamik olarak bağlayabilirsiniz.

```ts
import {inputBinding, outputBinding} from '@angular/core';

const fixture = TestBed.createComponent(ValueDisplay, {
  bindings: [
    inputBinding('value', value),
    outputBinding('valueChange', () =>  (/* ... */) ),
  ],
});
```

### `dispatchEvent()` ile bir input değerini değiştirme

Kullanıcı girdisini simüle etmek için girdi öğesini bulun ve `value` özelliğini ayarlayın.

Ancak önemli bir ara adım vardır.

Angular, girdi öğesinin `value` özelliğini ayarladığınızı bilmez.
`dispatchEvent()` çağrısı ile öğenin `input` olayını tetikleyene kadar o özelliği okumaz.

`TitleCasePipe` kullanan bir bileşenin aşağıdaki örneği uygun sırayı gösterir.

```ts
it('should convert hero name to Title Case', async () => {
  const hostElement = fixture.nativeElement;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // kullanıcının girdi kutusuna yeni bir ad girmesini simüle et
  nameInput.value = 'quick BROWN  fOx';

  // Angular'ın girdi değeri değişikliğini öğrenmesi için bir DOM olayı gönder.
  nameInput.dispatchEvent(new Event('input'));

  // Angular'ın title pipe üzerinden görüntü bağlamasını güncellemesini bekle
  await fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```

## Bağımlılığı olan bileşen

Bileşenler genellikle servis bağımlılıklarına sahiptir.

`Welcome` bileşeni, oturum açmış kullanıcıya bir karşılama mesajı görüntüler.
Kullanıcının kim olduğunu, enjekte edilen `UserAuthentication`'ın bir özelliğine dayanarak bilir:

```angular-ts
import {Component, inject, OnInit, signal} from '@angular/core';
import {UserAuthentication} from '../model/user.authentication';

@Component({
  selector: 'app-welcome',
  template: '<h3 class="welcome"><i>{{ welcome() }}</i></h3>',
})
export class Welcome {
  private userAuth = inject(UserAuthentication);
  welcome = signal(
    this.userAuth.isLoggedIn() ? `Welcome, ${this.userAuth.user().name}` : 'Please log in.',
  );
}
```

`Welcome` bileşeni, servis ile etkileşim kuran karar mantığına sahiptir; bu mantık, bileşeni test etmeye değer kılar.

### Servis test double'ları sağlama

_Test altındaki bileşenin_ gerçek servislerle sağlanması gerekmez.

Gerçek `UserAuthentication`'ı enjekte etmek zor olabilir.
Gerçek servis kullanıcıdan oturum açma kimlik bilgileri isteyebilir ve bir kimlik doğrulama sunucusuna ulaşmaya çalışabilir.
Bu davranışları engellemek zor olabilir. Test double'ları kullanmanın testi üretimden farklı davranmasına neden olacağını unutmayın, bu nedenle bunları idareli kullanın.

### Enjekte edilen servisleri alma

Testlerin `Welcome` bileşenine enjekte edilen `UserAuthentication`'a erişmesi gerekir.

Angular'ın hiyerarşik bir enjeksiyon sistemi vardır.
`TestBed` tarafından oluşturulan kök enjektörden bileşen ağacına kadar birden fazla seviyede enjektörler olabilir.

Enjekte edilen servisi almanın en güvenli yolu, **_her zaman çalışan_** yol, **bunu _test altındaki bileşenin_ enjektöründen almaktır**.
Bileşen enjektörü, fixture'ın `DebugElement`'inin bir özelliğidir.

```ts
// Bileşene gerçekten enjekte edilen UserAuthentication
userAuth = fixture.debugElement.injector.get(UserAuthentication);
```

HELPFUL: Bu genellikle gerekli _değildir_. Servisler genellikle kök seviyesinde veya TestBed geçersiz kılmalarında sağlanır ve `TestBed.inject()` ile daha kolay alınabilir (aşağıya bakın).

### `TestBed.inject()`

Bu, fixture'ın `DebugElement`'ini kullanarak bir servisi almaktan daha kolay hatırlanır ve daha az ayrıntılıdır.

Bu test paketinde `UserAuthentication`'ın _tek_ sağlayıcısı kök test modülüdür, bu nedenle `TestBed.inject()`'i şu şekilde çağırmak güvenlidir:

```ts
userAuth = TestBed.inject(UserAuthentication);
```

HELPFUL: `TestBed.inject()`'in çalışmadığı bir kullanım durumu için, servisi neden ve ne zaman bileşenin enjektöründen almanız gerektiğini açıklayan [_Bileşen sağlayıcılarını geçersiz kılma_](#bileşen-providerlarını-geçersiz-kılma) bölümüne bakın.

### Son kurulum ve test'ler

İşte `TestBed.inject()` kullanan tam `beforeEach()`:

```ts
let fixture: ComponentFixture<Welcome>;
let comp: Welcome;
let userAuth: UserAuthentication; // TestBed tarafından enjekte edilen servis
let el: HTMLElement; // karşılama mesajını içeren DOM öğesi

beforeEach(() => {
  fixture = TestBed.createComponent(Welcome);
  comp = fixture.componentInstance;

  // Kök enjektörden UserAuthentication
  userAuth = TestBed.inject(UserAuthentication);

  //  "welcome" öğesini CSS seçici ile al (ör. sınıf adı ile)
  el = fixture.nativeElement.querySelector('.welcome');
});
```

Ve işte bazı testler:

```ts
it('should welcome the user', async () => {
  await fixture.whenStable();
  const content = el.textContent;

  expect(content, '"Welcome ..."').toContain('Welcome');
  expect(content, 'expected name').toContain('Test User');
});

it('should welcome "Bubba"', async () => {
  userAuth.user.set({name: 'Bubba'}); // karşılama mesajı henüz gösterilmedi
  await fixture.whenStable();

  expect(el.textContent).toContain('Bubba');
});

it('should request login if not logged in', async () => {
  userAuth.isLoggedIn.set(false); // karşılama mesajı henüz gösterilmedi
  await fixture.whenStable();
  const content = el.textContent;

  expect(content, 'not welcomed').not.toContain('Welcome');
  expect(content, '"log in"').toMatch(/log in/i);
});
```

İlki bir akıl sağlığı testidir; `UserAuthentication`'ın çağrıldığını ve çalıştığını doğrular.

HELPFUL: `expect`'in 2. argümanı \(örneğin `'expected name'`\) isteğe bağlı bir başarısızlık etiketidir.
Beklenti başarısız olursa, Vitest bu etiketi beklenti başarısızlık mesajına ekler.
Birden fazla beklentiye sahip bir spesifikasyonda, neyin yanlış gittiğini ve hangi beklentinin başarısız olduğunu netleştirmeye yardımcı olabilir.

Geri kalan testler, servis farklı değerler döndürdüğünde bileşenin mantığını doğrular.
İkinci test, kullanıcı adını değiştirmenin etkisini doğrular.
Üçüncü test, oturum açmış kullanıcı olmadığında bileşenin uygun mesajı görüntülediğini kontrol eder.

## Asenkron servise sahip bileşen

Bu örnekte, `About` bileşeni şablonu bir `Twain` bileşenine ev sahipliği yapar.
`Twain` bileşeni Mark Twain alıntılarını görüntüler.

```angular-html
<p class="twain">
  <i>{{ quote | async }}</i>
</p>
<button type="button" (click)="getQuote()">Next quote</button>
@if (errorMessage()) {
  <p class="error">{{ errorMessage() }}</p>
}
```

HELPFUL: Bileşenin `quote` özelliğinin değeri bir `AsyncPipe` üzerinden geçer.
Bu, özelliğin bir `Promise` veya `Observable` döndürdüğü anlamına gelir.

Bu örnekte, `TwainQuotes.getQuote()` metodu size `quote` özelliğinin bir `Observable` döndürdüğünü söyler.

```ts
getQuote() {
  this.errorMessage.set('');
  this.quote = this.twainQuotes.getQuote().pipe(
    startWith('...'),
    catchError((err: any) => {
      this.errorMessage.set(err.message || err.toString());
      return of('...'); // reset message to placeholder
    }),
  );
}
```

`Twain` bileşeni, enjekte edilen `TwainQuotes`'dan alıntıları alır.
Bileşen, servis ilk alıntısını döndürmeden önce döndürülen `Observable`'ı bir yer tutucu değerle \(`'...'`\) başlatır.

`catchError`, servis hatalarını yakalar, bir hata mesajı hazırlar ve başarı kanalında yer tutucu değeri döndürür.

Bunların hepsi test etmek isteyeceğiniz özelliklerdir.

### `HttpTestingController` ile HTTP isteklerini mock'layarak test etme.

Bir bileşeni test ederken, yalnızca servisin genel API'si önemli olmalıdır.
Genel olarak testler, uzak sunuculara çağrı yapmamalıdır.
Bu tür çağrıları taklit etmelidirler.

Asenkron servisiniz uzak verileri yüklemek için `HttpClient`'a güveniyorsa, HTTP düzeyinde sahte yanıtlar döndürmek için `HttpTestingController` kullanılması önerilir.

`HttpBackend`'i taklit etme hakkında daha fazla ayrıntı için [özel kılavuza](guide/http/testing) başvurun.

### Bir servisin stub uygulamasını sağlayarak test etme.

HTTP düzeyinde asenkron isteği taklit etmek mümkün olmadığında, bir alternatif spy'lardan yararlanmaktır.

Bu `app/twain/twain-quotes.spec.ts`'deki kurulum, bunu yapmanın bir yolunu gösterir:

```ts {header: "twain.spec.ts"}
class TwainQuotesStub implements TwainQuotes {
  private testQuote = 'Test Quote';

  getQuote() {
    return of(this.testQuote);
  }

  // ... API'ye uyum sağlamak için her şeyi uygulayın
}

beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
  });

  fixture = TestBed.createComponent(Twain);
  component = fixture.componentInstance;
  await fixture.whenStable();
  quoteEl = fixture.nativeElement.querySelector('.twain');
});
```

Stub uygulamasının orijinalin yerini nasıl aldığına odaklanın.

```ts
TestBed.configureTestingModule({
  providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
});
```

Stub, onu enjekte eden herhangi bir bileşen veya servisin stub uygulamasını alacağı şekilde tasarlanmıştır.
Bu, `getQuote`'a yapılan herhangi bir çağrının bir test alıntısı içeren observable aldığı anlamına gelir.

Gerçek `getQuote()` metodunun aksine, bu spy sunucuyu atlar ve değeri hemen kullanılabilen senkron bir observable döndürür.

### Vitest sahte zamanlayıcıları ile asenkron test

`setTimeout` veya `Promise` gibi asenkron fonksiyonları taklit etmek için, ne zaman tetikleneceklerini kontrol etmek üzere Vitest sahte zamanlayıcılarından yararlanabilirsiniz.

```ts
it('should display error when TwainQuotes service fails', async () => {
  class TwainQuotesStub implements TwainQuotes {
    getQuote() {
      return defer(() => {
        return new Promise<string>((_, reject) => {
          setTimeout(() => reject('TwainService test failure'));
        });
      });
    }

    // ... API'ye uyum sağlamak için her şeyi uygulayın
  }

  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
  });

  vi.useFakeTimers(); // sahte zamanlayıcıları kurma
  const fixture = TestBed.createComponent(TwainComponent);

  // render asenkron değil, temizlememiz gerekiyor
  await vi.runAllTimersAsync();

  await expect(fixture.nativeElement.querySelector('.error')!.textContent).toMatch(/test failure/);
  expect(fixture.nativeElement.querySelector('.twain')!.textContent).toBe('...');

  vi.useRealTimers(); // normal asenkron yürütmeye sıfırlar
});
```

### Daha fazla asenkron test

Stub servisi asenkron observable'lar döndürdüğünde, testlerinizin çoğunun da asenkron olması gerekecektir.

İşte gerçek dünyada beklediğiniz veri akışını gösteren bir test.

```ts
it('should show quote after getQuote', async () => {
  class MockTwainQuotes implements TwainQuotes {
    private subject = new Subject<string>();

    getQuote() {
      return this.subject.asObservable();
    }

    emit(val: string) {
      this.subject.next(val);
    }
  }

  it('should show quote after getQuote (success)', async () => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      providers: [{provide: TwainQuotes, useClass: MockTwainQuotes}],
    });

    const fixture = TestBed.createComponent(TwainComponent);
    const twainQuotes = TestBed.inject(TwainQuotes) as MockTwainQuotes;
    await vi.runAllTimersAsync(); // alıntı alınmadan önce render et

    const quoteEl = fixture.nativeElement.querySelector('.twain');
    expect(quoteEl.textContent).toBe('...');

    twainQuotes.emit('Twain Quote'); // alıntıyı yayınlar
    await vi.runAllTimersAsync(); // alıntı alındıktan sonra render et

    expect(quoteEl.textContent).toBe('Twain Quote');
    expect(fixture.nativeElement.querySelector('.error')).toBeNull();

    vi.useRealTimers(); // normal asenkron yürütmeye sıfırlar
  });
});
```

Alıntı öğesinin ilk render'da yer tutucu değeri \(`'...'`\) görüntülediğine dikkat edin.
İlk alıntı henüz gelmemiştir.

Ardından alıntı öğesinin beklenen metni görüntülediğini doğrulayabilirsiniz.

### `zone.js` ve `fakeAsync` ile asenkron test'ler

`fakeAsync` yardımcı fonksiyonu, asenkron API'leri `zone.js` ile yamalayarak çalışan başka bir sahte saattir. `zone.js` tabanlı uygulamalarda test için yaygın olarak kullanılıyordu. `fakeAsync` kullanımı artık önerilmemektedir.

TIP: Yerel asenkron test stratejileri veya Vitest veya Jasmine'den olanlar gibi diğer sahte zamanlayıcıları (sahte saat olarak da adlandırılır) kullanmayı tercih edin.

IMPORTANT: Bu çalıştırıcı için `zone.js` yaması uygulanmadığından `fakeAsync` Vitest test çalıştırıcısı ile kullanılamaz.

## Input ve output'lara sahip bileşen

Girdi ve çıktılara sahip bir bileşen tipik olarak bir ana bileşenin görünüm şablonunda görünür.
Ana bileşen, girdi özelliğini ayarlamak için özellik bağlama ve çıktı özelliği tarafından oluşturulan olayları dinlemek için olay bağlama kullanır.

Test amacı, bu tür bağlamaların beklendiği gibi çalıştığını doğrulamaktır.
Testler girdi değerlerini ayarlamalı ve çıktı olaylarını dinlemelidir.

`DashboardHero` bileşeni bu roldeki bir bileşenin küçük bir örneğidir.
`Dashboard` bileşeni tarafından sağlanan bireysel bir kahramanı görüntüler.
O kahramana tıklamak, `Dashboard` bileşenine kullanıcının kahramanı seçtiğini söyler.

`DashboardHero` bileşeni `Dashboard` bileşeni şablonuna şu şekilde gömülüdür:

```angular-html
@for (hero of heroes; track hero) {
  <dashboard-hero class="col-1-4" [hero]="hero" (selected)="gotoDetail($event)" />
}
```

`DashboardHero` bileşeni bir `@for` bloğunda görünür; bu blok, her bileşenin `hero` girdi özelliğini döngü değerine ayarlar ve bileşenin `selected` olayını dinler.

İşte bileşenin tam tanımı:

```angular-ts
@Component({
  selector: 'dashboard-hero',
  imports: [UpperCasePipe],
  template: `
    <button type="button" (click)="click()" class="hero">
      {{ hero().name | uppercase }}
    </button>
  `,
})
export class DashboardHero {
  readonly hero = input.required<Hero>();
  readonly selected = output<Hero>();

  click() {
    this.selected.emit(this.hero());
  }
}
```

Bu kadar basit bir bileşeni test etmenin içsel değeri az olsa da, nasıl yapılacağını bilmek faydalıdır.
Bu yaklaşımlardan birini kullanın:

- `Dashboard` bileşeni tarafından kullanıldığı şekilde test edin
- Bağımsız bir bileşen olarak test edin
- `Dashboard` bileşeninin yedeği tarafından kullanıldığı şekilde test edin

Anlık hedef `DashboardHero` bileşenini test etmektir, `Dashboard` bileşenini değil, bu nedenle ikinci ve üçüncü seçenekleri deneyin.

### `DashboardHero` bileşenini bağımsız test etme

İşte spec dosyası kurulumunun özü.

```ts
let fixture: ComponentFixture<DashboardHero>;
let comp: DashboardHero;
let heroDe: DebugElement;
let heroEl: HTMLElement;
let expectedHero: Hero;

beforeEach(async () => {
  fixture = TestBed.createComponent(DashboardHero);
  comp = fixture.componentInstance;

  // kahramanın DebugElement ve öğesini bul
  heroDe = fixture.debugElement.query(By.css('.hero'));
  heroEl = heroDe.nativeElement;

  // üst bileşen tarafından sağlanan kahramanı mock'la
  expectedHero = {id: 42, name: 'Test Name'};

  // üst bileşenin input özelliğini bu kahramanla ayarlamasını simüle et
  fixture.componentRef.setInput('hero', expectedHero);

  // ilk veri bağlamasını bekle
  await fixture.whenStable();
});
```

Kurulum kodunun, `Dashboard`'ın tekrarlayıcısında özellik bağlama kullanarak ayarlayacağı şekilde bileşenin `hero` özelliğine bir test kahramanı \(`expectedHero`\) atadığına dikkat edin.

Aşağıdaki test, kahraman adının bir bağlama kullanılarak şablona yayıldığını doğrular.

```ts
it('should display hero name in uppercase', () => {
  const expectedPipedName = expectedHero.name.toUpperCase();
  expect(heroEl.textContent).toContain(expectedPipedName);
});
```

Şablon, kahraman adını Angular `UpperCasePipe` üzerinden geçirdiğinden, test öğe değerini büyük harfli adla eşleştirmelidir.

### Tıklama

Kahramana tıklamak, ana bileşenin \(muhtemelen `Dashboard`\) duyabileceği bir `selected` olayı oluşturmalıdır:

```ts
it('should raise selected event when clicked (triggerEventHandler)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  heroDe.triggerEventHandler('click');
  expect(selectedHero).toBe(expectedHero);
});
```

Bileşenin `selected` özelliği, tüketiciler için RxJS senkron `Observable`'ına benzeyen bir `EventEmitter` döndürür.
Test, ana bileşenin _örtük olarak_ yaptığı gibi buna _açıkça_ abone olur.

Bileşen beklendiği gibi davranırsa, kahramanın öğesine tıklamak bileşenin `selected` özelliğine `hero` nesnesini yayınlamasını söylemelidir.

Test bu olayı `selected`'a aboneliği aracılığıyla algılar.

### `triggerEventHandler`

Önceki testteki `heroDe`, kahraman `<div>`'ini temsil eden bir `DebugElement`'dir.

Yerel öğeyle etkileşimi soyutlayan Angular özellikleri ve metotlarına sahiptir.
Bu test, `DebugElement.triggerEventHandler`'ı "click" olay adıyla çağırır.
"click" olay bağlaması, `DashboardHero.click()` çağrısıyla yanıt verir.

Angular `DebugElement.triggerEventHandler`, herhangi bir _veri bağlı olayı_ _olay adıyla_ tetikleyebilir.
İkinci parametre, işleyiciye aktarılan olay nesnesidir.

Test bir "click" olayı tetikledi.

```ts
heroDe.triggerEventHandler('click');
```

Bu durumda, test çalışma zamanı olay işleyicisinin, yani bileşenin `click()` metodunun, olay nesnesiyle ilgilenmediğini doğru bir şekilde varsayar.

HELPFUL: Diğer işleyiciler daha az hoşgörülüdür.
Örneğin, `RouterLink` yönergesi, varsa hangi fare düğmesine basıldığını tanımlayan bir `button` özelliğine sahip bir nesne bekler.
Olay nesnesi eksikse `RouterLink` yönergesi bir hata fırlatır.

### Öğeye tıklama

Aşağıdaki test alternatifi, yerel öğenin kendi `click()` metodunu çağırır; bu, _bu bileşen_ için tamamen uygundur.

```ts
it('should raise selected event when clicked (element.click)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  heroEl.click();
  expect(selectedHero).toBe(expectedHero);
});
```

### `click()` yardımcı fonksiyonu

Bir düğmeye, bir bağlantıya veya rastgele bir HTML öğesine tıklamak yaygın bir test görevidir.

Bunu tutarlı ve basit hale getirmek için _tıklama tetikleme_ sürecini aşağıdaki `click()` fonksiyonu gibi bir yardımcıda kapsülleyin:

```ts
/** RouterLink olay işleyicisi için `DebugElement.triggerEventHandler`'a aktarılacak düğme olayları */
export const ButtonClickEvents = {
  left: {button: 0},
  right: {button: 2},
};

/** Öğe tıklamasını simüle eder. Varsayılan olarak fare sol düğme tıklama olayıdır. */
export function click(
  el: DebugElement | HTMLElement,
  eventObj: any = ButtonClickEvents.left,
): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}
```

İlk parametre _tıklanacak öğedir_.
İsterseniz, ikinci parametre olarak özel bir olay nesnesi aktarın.
Varsayılan, `RouterLink` yönergesi dahil birçok işleyici tarafından kabul edilen kısmi bir [sol düğme fare olay nesnesidir](https://developer.mozilla.org/docs/Web/API/MouseEvent/button).

IMPORTANT: `click()` yardımcı fonksiyonu Angular test araçlarından **değildir**.
_Bu kılavuzun örnek kodunda_ tanımlanan bir fonksiyondur.
Tüm örnek testler bunu kullanır.
Beğenirseniz, kendi yardımcılar koleksiyonunuza ekleyin.

İşte click yardımcısını kullanan önceki test, yeniden yazılmış haliyle.

```ts
it('should raise selected event when clicked (click helper with DebugElement)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  click(heroDe); // DebugElement ile click yardımcısı

  expect(selectedHero).toBe(expectedHero);
});
```

## Test host içindeki bileşen

Önceki testler ana `Dashboard` bileşeninin rolünü kendileri oynadı.
Peki `DashboardHero` bileşeni bir ana bileşene düzgün şekilde veri bağlandığında doğru çalışır mı?

```angular-ts
@Component({
  imports: [DashboardHero],
  template: ` <dashboard-hero [hero]="hero" (selected)="onSelected($event)" />`,
})
class TestHost {
  hero: Hero = {id: 42, name: 'Test Name'};
  selectedHero: Hero | undefined;

  onSelected(hero: Hero) {
    this.selectedHero = hero;
  }
}
```

Test ana bileşeni, bileşenin `hero` girdi özelliğini test kahramanıyla ayarlar.
Bileşenin `selected` olayını, yayınlanan kahramanı `selectedHero` özelliğinde kaydeden `onSelected` işleyicisine bağlar.

Daha sonra testler, `DashboardHero.selected` olayının beklenen kahramanı yayınladığını doğrulamak için `selectedHero`'yu kontrol edebilecektir.

`test-host` testleri için kurulum, bağımsız testler için kuruluma benzer:

```ts
beforeEach(async () => {
  // DashboardHero yerine TestHost oluştur
  fixture = TestBed.createComponent(TestHost);
  testHost = fixture.componentInstance;
  heroEl = fixture.nativeElement.querySelector('.hero');

  await fixture.whenStable();
});
```

Bu test modülü yapılandırması iki önemli fark gösterir:

- `DashboardHero` yerine `TestHost` bileşenini _oluşturur_
- `TestHost` bileşeni, `DashboardHero.hero`'yu bir bağlama ile ayarlar

`createComponent`, bir `DashboardHero` örneği yerine bir `TestHost` örneği tutan bir `fixture` döndürür.

`TestHost`'u oluşturmak, ikincisi birincisinin şablonunda göründüğü için bir `DashboardHero` oluşturmanın yan etkisine sahiptir.
Kahraman öğesi \(`heroEl`\) sorgusu onu hâlâ test DOM'unda bulur, ancak öğe ağacında daha derin bir yerde.

Testlerin kendileri neredeyse bağımsız sürümle aynıdır:

```ts
it('should display hero name', () => {
  const expectedPipedName = testHost.hero.name.toUpperCase();
  expect(heroEl.textContent).toContain(expectedPipedName);
});

it('should raise selected event when clicked', () => {
  click(heroEl);
  // seçilen kahraman, veri bağlı kahramanla aynı olmalı
  expect(testHost.selectedHero).toBe(testHost.hero);
});
```

Yalnızca seçili olay testi farklıdır.
Seçilen `DashboardHero` kahramanının olay bağlaması aracılığıyla gerçekten ana bileşene ulaştığını doğrular.

## Yönlendirme bileşeni

Bir _yönlendirme bileşeni_, `Router`'a başka bir bileşene navigasyon yapmasını söyleyen bir bileşendir.
`Dashboard` bileşeni bir _yönlendirme bileşenidir_ çünkü kullanıcı panodaki _kahraman düğmelerinden_ birine tıklayarak `HeroDetail` bileşenine navigasyon yapabilir.

Angular, şablon kodunu azaltmak ve `HttpClient`'a bağlı kodu daha etkili bir şekilde test etmek için test yardımcıları sağlar. `provideRouter` fonksiyonu doğrudan test modülünde de kullanılabilir.

```ts
beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([{path: '**', component: Dashboard}]),
      provideHttpClientTesting(),
      HeroService,
    ],
  });
  harness = await RouterTestingHarness.create();
  comp = await harness.navigateByUrl('/', Dashboard);
  TestBed.inject(HttpTestingController).expectOne('api/heroes').flush(getTestHeroes());
});
```

Aşağıdaki test, görüntülenen kahramana tıklar ve beklenen URL'ye navigasyon yapıldığını doğrular.

```ts
it('should tell navigate when hero clicked', async () => {
  // ilk <dashboard-hero> DebugElement'ini al
  const heroDe = harness.routeDebugElement!.query(By.css('dashboard-hero'));
  heroDe.triggerEventHandler('selected', comp.heroes[0]);

  // bileşenin ilk kahramanının id'sine navigasyon bekleniyor
  const id = comp.heroes[0].id;
  expect(TestBed.inject(Router).url, 'should nav to HeroDetail for first hero').toEqual(
    `/heroes/${id}`,
  );
});
```

## Yönlendirilmiş bileşenler

Bir _yönlendirilmiş bileşen_, `Router` navigasyonunun hedefidir.
Özellikle bileşene giden rota _parametreler içerdiğinde_ test etmek daha zor olabilir.
`HeroDetail`, böyle bir rotanın hedefi olan _yönlendirilmiş bir bileşendir_.

Kullanıcı bir _Dashboard_ kahramanına tıkladığında, `Dashboard` `Router`'a `heroes/:id` adresine navigasyon yapmasını söyler.
`:id`, düzenlenecek kahramanın `id`'si olan bir rota parametresidir.

`Router`, bu URL'yi `HeroDetail` bileşenine giden bir rota ile eşleştirir.
Yönlendirme bilgilerini içeren bir `ActivatedRoute` nesnesi oluşturur ve bunu `HeroDetail`'in yeni bir örneğine enjekte eder.

İşte `HeroDetail`'e enjekte edilen servisler:

```ts
private heroDetailService = inject(HeroDetailService);
private route = inject(ActivatedRoute);
private router = inject(Router);
```

`HeroDetail` bileşeninin, `HeroDetailService` kullanarak karşılık gelen kahramanı almak için `id` parametresine ihtiyacı vardır.
Bileşen, `Observable` olan `ActivatedRoute.paramMap` özelliğinden `id`'yi almalıdır.

`ActivatedRoute.paramMap`'in `id` özelliğine sadece referans veremez.
Bileşenin `ActivatedRoute.paramMap` observable'ına _abone olması_ ve yaşam süresi boyunca `id`'nin değişmesine hazırlıklı olması gerekir.

```ts
constructor() {
  // `id` parametresi değiştiğinde kahramanı al
  this.route.paramMap
    .pipe(takeUntilDestroyed())
    .subscribe((pmap) => this.getHero(pmap.get('id')));
}
```

Testler, farklı rotalara navigasyon yaparak `HeroDetail`'in farklı `id` parametre değerlerine nasıl yanıt verdiğini keşfedebilir.

## İç içe bileşen test'leri

Bileşen şablonlarında genellikle iç içe bileşenler bulunur ve bu bileşenlerin şablonları daha fazla bileşen içerebilir.

Bileşen ağacı çok derin olabilir ve bazen iç içe bileşenler, ağacın tepesindeki bileşenin test edilmesinde herhangi bir rol oynamaz.

Örneğin `App` bileşeni, bağlantıları ve `RouterLink` yönergeleri olan bir navigasyon çubuğu görüntüler.

```angular-html
<app-banner />
<app-welcome />

<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/heroes">Heroes</a>
  <a routerLink="/about">About</a>
</nav>

<router-outlet />
```

Bağlantıları doğrulamak ancak navigasyonu doğrulamamak için `Router`'ın navigasyon yapmasına ve `Router`'ın _yönlendirilmiş bileşenleri_ nereye eklediğini işaretlemek için `<router-outlet>`'e ihtiyacınız yoktur.

`Banner` ve `Welcome` bileşenleri \(`<app-banner>` ve `<app-welcome>` ile belirtilen\) da ilgisizdir.

Yine de DOM'da `App` bileşenini oluşturan herhangi bir test, bu üç bileşenin de örneklerini oluşturur ve buna izin verirseniz, bunları oluşturmak için `TestBed`'i yapılandırmanız gerekir.

Bunları bildirmeyi ihmal ederseniz, Angular derleyicisi `App` şablonundaki `<app-banner>`, `<app-welcome>` ve `<router-outlet>` etiketlerini tanımaz ve bir hata fırlatır.

Gerçek bileşenleri bildirirseniz, _onların_ iç içe bileşenlerini de bildirmeniz ve ağaçtaki _herhangi bir_ bileşene enjekte edilen _tüm_ servisler için sağlama yapmanız gerekir.

Bu bölüm kurulumu en aza indirmek için iki tekniği açıklar.
Birincil bileşeni test etmeye odaklanmak için bunları tek başına veya birlikte kullanın.

### Gereksiz bileşenleri stub'lama

İlk teknikte, testlerde çok az veya hiç rol oynamayan bileşenlerin ve yönergenin stub sürümlerini oluşturur ve bildirirsiniz.

```ts
@Component({selector: 'app-banner', template: ''})
class BannerStub {}

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStub {}

@Component({selector: 'app-welcome', template: ''})
class WelcomeStub {}
```

Stub seçicileri, karşılık gelen gerçek bileşenlerin seçicileriyle eşleşir.
Ancak şablonları ve sınıfları boştur.

Ardından `TestBed.overrideComponent` kullanarak bileşeninizin `imports`'ını geçersiz kılarak bunları bildirin.

```ts
let comp: App;
let fixture: ComponentFixture<App>;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    set: {
      imports: [RouterLink, BannerStub, RouterOutletStub, WelcomeStub],
    },
  });

  fixture = TestBed.createComponent(App);
  comp = fixture.componentInstance;
});
```

HELPFUL: Bu örnekteki `set` anahtarı bileşeninizdeki tüm mevcut import'ları değiştirir, yalnızca stub'ları değil tüm bağımlılıkları import ettiğinizden emin olun. Alternatif olarak import'ları seçici şekilde kaldırmak ve eklemek için `remove`/`add` anahtarlarını kullanabilirsiniz.

### `NO_ERRORS_SCHEMA`

İkinci yaklaşımda, bileşeninizin meta veri geçersiz kılmalarına `NO_ERRORS_SCHEMA` ekleyin.

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    set: {
      imports: [], // resets all imports
      schemas: [NO_ERRORS_SCHEMA],
    },
  });
});
```

`NO_ERRORS_SCHEMA`, Angular derleyicisine tanınmayan öğeleri ve nitelikleri yok saymasını söyler.

Derleyici, `<app-root>` öğesini ve `routerLink` niteliğini tanır çünkü `TestBed` yapılandırmasında karşılık gelen `App` bileşenini ve `RouterLink`'i bildirdiniz.

Ancak `<app-banner>`, `<app-welcome>` veya `<router-outlet>` ile karşılaştığında hata fırlatmaz.
Bunları boş etiketler olarak render eder ve tarayıcı bunları yok sayar.

Artık stub bileşenlere ihtiyacınız yoktur.

### Her iki tekniği birlikte kullanma

Bunlar, testler için önemli olan şablon öğelerine bileşenin görsel yüzeyini azalttıkları için _Sığ Bileşen Testi_ olarak adlandırılan tekniklerdir.

`NO_ERRORS_SCHEMA` yaklaşımı ikisinin daha kolayıdır ancak aşırı kullanmayın.

`NO_ERRORS_SCHEMA` ayrıca derleyicinin, kasıtlı veya yanlışlıkla atladığınız veya yanlış yazdığınız eksik bileşenler ve nitelikler hakkında sizi bilgilendirmesini de engeller.
Derleyicinin bir an içinde yakalayacağı hayalet hataları kovalamak için saatler harcayabilirsiniz.

_Stub bileşen_ yaklaşımının başka bir avantajı vardır.
_Bu_ örnekteki stub'lar boş olsa da, testlerinizin bunlarla bir şekilde etkileşim kurması gerekiyorsa onlara sadeleştirilmiş şablonlar ve sınıflar verebilirsiniz.

Pratikte, bu örnekte görüldüğü gibi aynı kurulumda iki tekniği birleştireceksiniz.

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    remove: {imports: [RouterOutlet, Welcome]},
    set: {schemas: [NO_ERRORS_SCHEMA]},
  });
});
```

Angular derleyicisi `<app-banner>` için `BannerStub`'ı oluşturur ve `routerLink` niteliğine sahip bağlantılara `RouterLink`'i uygular, ancak `<app-welcome>` ve `<router-outlet>` etiketlerini yok sayar.

### `By.directive` ve enjekte edilen directive'ler

Biraz daha kurulum, başlangıç veri bağlamasını tetikler ve navigasyon bağlantılarına referanslar alır:

```ts
beforeEach(async () => {
  await fixture.whenStable();

  // RouterLinkStubDirective eklenmiş DebugElement'leri bul
  linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));

  // her DebugElement'in enjektörünü kullanarak
  // eklenmiş link directive örneklerini al
  routerLinks = linkDes.map((de) => de.injector.get(RouterLink));
});
```

Özel ilgi çeken üç nokta:

- `By.directive` kullanarak bağlı yönergeli bağlantı öğelerini bulun
- Sorgu, eşleşen öğelerin etrafında `DebugElement` sarmalayıcıları döndürür
- Her `DebugElement`, o öğeye bağlı yönergenin belirli örneğini içeren bir bağımlılık enjektörü ortaya çıkarır

Doğrulanacak `App` bileşeni bağlantıları şunlardır:

```angular-html
<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/heroes">Heroes</a>
  <a routerLink="/about">About</a>
</nav>
```

İşte bu bağlantıların `routerLink` yönergelerine beklendiği gibi bağlandığını doğrulayan bazı testler:

```ts
it('can get RouterLinks from template', () => {
  expect(routerLinks.length, 'should have 3 routerLinks').toBe(3);
  expect(routerLinks[0].href).toBe('/dashboard');
  expect(routerLinks[1].href).toBe('/heroes');
  expect(routerLinks[2].href).toBe('/about');
});

it('can click Heroes link in template', async () => {
  const heroesLinkDe = linkDes[1]; // heroes link DebugElement

  TestBed.inject(Router).resetConfig([{path: '**', children: []}]);
  heroesLinkDe.triggerEventHandler('click', {button: 0});

  await fixture.whenStable();

  expect(TestBed.inject(Router).url).toBe('/heroes');
});
```

## Bir `page` nesnesi kullanma

`HeroDetail` bileşeni başlık, iki kahraman alanı ve iki düğme içeren basit bir görünümdür.

Ancak bu basit formda bile bol miktarda şablon karmaşıklığı vardır.

```angular-html
@if (hero) {
  <div>
    <h2>
      <span>{{ hero.name | titlecase }}</span> Details
    </h2>
    <div><span>id: </span>{{ hero.id }}</div>
    <div>
      <label for="name">name: </label>
      <input id="name" [(ngModel)]="hero.name" placeholder="name" />
    </div>
    <button type="button" (click)="save()">Save</button>
    <button type="button" (click)="cancel()">Cancel</button>
  </div>
}
```

Bileşeni çalıştıran testlerin ihtiyaçları:

- Öğelerin DOM'da görünmesi için kahramanın gelmesini beklemek
- Başlık metnine bir referans
- İncelemek ve ayarlamak için ad girdi kutusuna bir referans
- Tıklanabilmeleri için iki düğmeye referanslar

Böyle küçük bir form bile çetrefilli koşullu kurulum ve CSS öğe seçiminden oluşan bir karmaşa üretebilir.

Karmaşıklığı, bileşen özelliklerine erişimi ele alan ve bunları ayarlamanın mantığını kapsülleyen bir `Page` sınıfıyla yönetin.

İşte `hero-detail.component.spec.ts` için böyle bir `Page` sınıfı

```ts
class Page {
  // getter özellikleri, çağrılana kadar DOM'u sorgulamayı bekler.
  get buttons() {
    return this.queryAll<HTMLButtonElement>('button');
  }
  get saveBtn() {
    return this.buttons[0];
  }
  get cancelBtn() {
    return this.buttons[1];
  }
  get nameDisplay() {
    return this.query<HTMLElement>('span');
  }
  get nameInput() {
    return this.query<HTMLInputElement>('input');
  }

  //// sorgu yardımcıları ////
  private query<T>(selector: string): T {
    return harness.routeNativeElement!.querySelector(selector)! as T;
  }

  private queryAll<T>(selector: string): T[] {
    return harness.routeNativeElement!.querySelectorAll(selector) as any as T[];
  }
}
```

Artık bileşen manipülasyonu ve denetimi için önemli kancalar düzgün bir şekilde organize edilmiş ve bir `Page` örneğinden erişilebilir durumdadır.

Bir `createComponent` metodu, `page` nesnesini oluşturur ve `hero` geldiğinde boşlukları doldurur.

```ts
async function createComponent(id: number) {
  harness = await RouterTestingHarness.create();
  component = await harness.navigateByUrl(`/heroes/${id}`, HeroDetail);
  page = new Page();

  const request = TestBed.inject(HttpTestingController).expectOne(`api/heroes/?id=${id}`);
  const hero = getTestHeroes().find((h) => h.id === Number(id));
  request.flush(hero ? [hero] : []);
  await harness.fixture.whenStable();
}
```

İşte konuyu pekiştirmek için birkaç `HeroDetail` bileşeni testi daha.

```ts
it("should display that hero's name", () => {
  expect(page.nameDisplay.textContent).toBe(expectedHero.name);
});

it('should navigate when click cancel', () => {
  click(page.cancelBtn);
  expect(TestBed.inject(Router).url).toEqual(`/heroes/${expectedHero.id}`);
});

it('should save when click save but not navigate immediately', () => {
  click(page.saveBtn);
  expect(TestBed.inject(HttpTestingController).expectOne({method: 'PUT', url: 'api/heroes'}));
  expect(TestBed.inject(Router).url).toEqual('/heroes/41');
});

it('should navigate when click save and save resolves', async () => {
  click(page.saveBtn);
  await harness.fixture.whenStable();
  expect(TestBed.inject(Router).url).toEqual('/heroes/41');
});

it('should convert hero name to Title Case', async () => {
  // DOM'dan adın girdi ve görüntü öğelerini al
  const hostElement: HTMLElement = harness.routeNativeElement!;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // kullanıcının girdi kutusuna yeni bir ad girmesini simüle et
  nameInput.value = 'quick BROWN  fOx';

  // Angular'ın girdi değeri değişikliğini öğrenmesi için bir DOM olayı gönder.
  nameInput.dispatchEvent(new Event('input'));

  // Angular'ın title pipe üzerinden görüntü bağlamasını güncellemesini bekle
  await harness.fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```

## Bileşen provider'larını geçersiz kılma

`HeroDetail`, kendi `HeroDetailService`'ini sağlar.

```ts
@Component({
  /* ... */
  providers: [HeroDetailService],
})
export class HeroDetail {
  private heroDetailService = inject(HeroDetailService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
}
```

Bileşenin `HeroDetailService`'ini `TestBed.configureTestingModule`'un `providers`'ında stub'lamak mümkün değildir.
Bunlar bileşenin değil _test modülünün_ sağlayıcılarıdır.
_Fixture seviyesindeki_ bağımlılık enjektörünü hazırlarlar.

Angular, bileşeni fixture enjektörünün bir _alt_ enjektörü olan _kendi_ enjektörü ile oluşturur.
Bileşenin sağlayıcılarını (bu durumda `HeroDetailService`) alt enjektöre kaydeder.

Bir test, fixture enjektöründen alt enjektör servislerine ulaşamaz.
Ve `TestBed.configureTestingModule` da bunları yapılandıramaz.

Angular tüm bu süre boyunca gerçek `HeroDetailService`'in yeni örneklerini oluşturmuştur!

HELPFUL: Bu testler, `HeroDetailService` uzak bir sunucuya kendi XHR çağrıları yapıyorsa başarısız olabilir veya zaman aşımına uğrayabilir.
Çağrılacak bir uzak sunucu olmayabilir.

Neyse ki `HeroDetailService`, uzak veri erişimi sorumluluğunu enjekte edilen `HeroService`'e devreder.

```ts
@Injectable({providedIn: 'root'})
export class HeroDetailService {
  private heroService = inject(HeroService);
}
```

Önceki test yapılandırması, gerçek `HeroService`'i sunucu isteklerini yakalayan ve yanıtlarını taklit eden bir `TestHeroService` ile değiştirir.

Ya o kadar şanslı değilseniz?
`HeroService`'i taklit etmek zorsa?
`HeroDetailService` kendi sunucu isteklerini yapıyorsa?

`TestBed.overrideComponent` metodu, aşağıdaki kurulum varyasyonunda görüldüğü gibi bileşenin `providers`'ını kolay yönetilebilir _test double'larla_ değiştirebilir:

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    providers: [
      provideRouter([
        {path: 'heroes', component: HeroList},
        {path: 'heroes/:id', component: HeroDetail},
      ]),
      // Bu seviyedeki HeroDetailService İLGİSİZDİR!
      {provide: HeroDetailService, useValue: {}},
    ],
  }).overrideComponent(HeroDetail, {
    set: {providers: [{provide: HeroDetailService, useClass: HeroDetailServiceSpy}]},
  });
});
```

`TestBed.configureTestingModule`'un artık sahte bir `HeroService` sağlamadığına dikkat edin çünkü buna [ihtiyaç yoktur](#bir-spy-stub-sağlama-herodetailservicespy).

### `overrideComponent` metodu

`overrideComponent` metoduna odaklanın.

```ts
.overrideComponent(HeroDetail, {
  set: {providers: [{provide: HeroDetailService, useClass: HeroDetailServiceSpy}]},
});
```

İki argüman alır: geçersiz kılınacak bileşen tipi \(`HeroDetail`\) ve bir geçersiz kılma meta veri nesnesi.
[Geçersiz kılma meta veri nesnesi](/guide/testing/utility-apis#testbed-sınıf-özeti) şu şekilde tanımlanan bir genel tiptir:

```ts
type MetadataOverride<T> = {
  add?: Partial<T>;
  remove?: Partial<T>;
  set?: Partial<T>;
};
```

Bir meta veri geçersiz kılma nesnesi, meta veri özelliklerinde öğeleri ekleyip kaldırabilir veya bu özellikleri tamamen sıfırlayabilir.
Bu örnek, bileşenin `providers` meta verilerini sıfırlar.

Tip parametresi `T`, `@Component` dekoratörüne aktaracağınız meta veri türüdür:

```ts
selector?: string;
template?: string;
templateUrl?: string;
providers?: any[];
…
```

### Bir _spy stub_ sağlama (`HeroDetailServiceSpy`)

Bu örnek, bileşenin `providers` dizisini bir `HeroDetailServiceSpy` içeren yeni bir dizi ile tamamen değiştirir.

`HeroDetailServiceSpy`, gerçek `HeroDetailService`'in tüm gerekli özelliklerini taklit eden stub bir versiyondur.
Ne alt seviye `HeroService`'i enjekte eder ne de ona devreder, bu nedenle bunun için bir test double sağlamaya gerek yoktur.

İlgili `HeroDetail` bileşen testleri, servis metotlarını gözetleyerek `HeroDetailService` metotlarının çağrıldığını doğrulayacaktır.
Buna göre stub, metotlarını spy olarak uygular:

```ts
import {vi} from 'vitest';

class HeroDetailServiceSpy {
  testHero: Hero = {...testHero};

  /* klonlanmış test kahramanını yayınla */
  getHero = vi.fn(() => asyncData({...this.testHero}));

  /* değişiklikler birleştirilmiş test kahramanının klonunu yayınla */
  saveHero = vi.fn((hero: Hero) => asyncData(Object.assign(this.testHero, hero)));
}
```

### Geçersiz kılma test'leri

Artık testler, spy-stub'ın `testHero`'sunu doğrudan manipüle ederek bileşenin kahramanını kontrol edebilir ve servis metotlarının çağrıldığını doğrulayabilir.

```ts
let hdsSpy: HeroDetailServiceSpy;

beforeEach(async () => {
  harness = await RouterTestingHarness.create();
  component = await harness.navigateByUrl(`/heroes/${testHero.id}`, HeroDetail);
  page = new Page();
  // bileşenin enjekte edilen HeroDetailServiceSpy'ını al
  hdsSpy = harness.routeDebugElement!.injector.get(HeroDetailService) as any;

  harness.detectChanges();
});

it('should have called `getHero`', () => {
  expect(hdsSpy.getHero, 'getHero called once').toHaveBeenCalledTimes(1);
});

it("should display stub hero's name", () => {
  expect(page.nameDisplay.textContent).toBe(hdsSpy.testHero.name);
});

it('should save stub hero change', async () => {
  const origName = hdsSpy.testHero.name;
  const newName = 'New Name';

  page.nameInput.value = newName;

  page.nameInput.dispatchEvent(new Event('input')); // tell Angular

  expect(component.hero.name, 'component hero has new name').toBe(newName);
  expect(hdsSpy.testHero.name, 'service hero unchanged before save').toBe(origName);

  click(page.saveBtn);
  expect(hdsSpy.saveHero, 'saveHero called once').toHaveBeenCalledTimes(1);

  await harness.fixture.whenStable();
  expect(hdsSpy.testHero.name, 'service hero has new name after save').toBe(newName);
  expect(TestBed.inject(Router).url).toEqual('/heroes');
});
```

### Daha fazla geçersiz kılma

`TestBed.overrideComponent` metodu aynı veya farklı bileşenler için birden fazla kez çağrılabilir.
`TestBed`, bu diğer sınıfların parçalarını derinlemesine incelemek ve değiştirmek için benzer `overrideDirective`, `overrideModule` ve `overridePipe` metotları sunar.

Seçenekleri ve kombinasyonları kendiniz keşfedin.
