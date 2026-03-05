# Testing Attribute Directives

Bir _nitelik yönergesi_, bir öğenin, bileşenin veya başka bir yönergenin davranışını değiştirir.
Adı, yönergenin uygulanma biçimini yansıtır: bir ana öğe üzerinde nitelik olarak.

## Testing the `Highlight` directive

Örnek uygulamanın `Highlight` yönergesi, bir öğenin arka plan rengini veri bağlı bir renge veya varsayılan renge \(açık gri\) göre ayarlar.
Ayrıca öğenin özel bir özelliğini \(`customProperty`\) gösterebileceğinden başka bir neden olmaksızın `true` olarak ayarlar.

```ts
import {Directive, inject, input} from '@angular/core';

/**
 * Set backgroundColor for the attached element to highlight color
 * and set the element's customProperty attribute to true
 */
@Directive({
  selector: '[highlight]',
  host: {
    '[style.backgroundColor]': 'bgColor() || defaultColor',
  },
})
export class Highlight {
  readonly defaultColor = 'rgb(211, 211, 211)'; // lightgray

  readonly bgColor = input('', {alias: 'highlight'});
}
```

Uygulama genelinde kullanılır, belki de en basit şekilde `About` bileşeninde:

```ts
@Component({
  imports: [Twain, Highlight],
  template: `
    <h2 highlight="skyblue">About</h2>
    <h3>Quote of the day:</h3>
    <twain-quote />
  `,
})
export class About {}
```

`About` bileşeni içindeki `Highlight` yönergesinin belirli kullanımını test etmek, yalnızca [Bileşen test senaryolarının](guide/testing/components-scenarios) ["İç içe bileşen testleri"](guide/testing/components-scenarios#nested-component-tests) bölümünde incelenen teknikleri gerektirir.

```ts
let fixture: ComponentFixture<About>;

beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [TwainService, UserService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  fixture = TestBed.createComponent(About);
  await fixture.whenStable();
});

it('should have skyblue <h2>', () => {
  const h2: HTMLElement = fixture.nativeElement.querySelector('h2');
  const bgColor = h2.style.backgroundColor;
  expect(bgColor).toBe('skyblue');
});
```

Ancak tek bir kullanım durumunu test etmek, bir yönergenin yeteneklerinin tam kapsamını keşfetme olasılığı düşüktür.
Yönergeyi kullanan tüm bileşenleri bulup test etmek sıkıcı, kırılgan ve neredeyse tam kapsamı sağlama olasılığı aynı derecede düşüktür.

_Yalnızca sınıf testleri_ faydalı olabilir, ancak bunun gibi nitelik yönergeleri DOM'u manipüle etme eğilimindedir.
İzole birim testleri DOM'a dokunmaz ve bu nedenle yönergenin etkinliğine güven vermez.

Daha iyi bir çözüm, yönergeyi uygulamanın tüm yollarını gösteren yapay bir test bileşeni oluşturmaktır.

```angular-ts
@Component({
  imports: [Highlight],
  template: `
    <h2 highlight="yellow">Something Yellow</h2>
    <h2 highlight>The Default (Gray)</h2>
    <h2>No Highlight</h2>
    <input #box [highlight]="box.value" value="cyan" />
  `,
})
class Test {}
```

<img alt="HighlightDirective spec in action" src="assets/images/guide/testing/highlight-directive-spec.png">

HELPFUL: `<input>` durumu, `Highlight`'ı giriş kutusundaki bir renk değerinin adına bağlar.
Başlangıç değeri "cyan" kelimesidir ve bu, giriş kutusunun arka plan rengi olmalıdır.

İşte bu bileşenin bazı testleri:

```ts
let fixture: ComponentFixture<Test>;
let des: DebugElement[]; // the three elements w/ the directive

beforeEach(async () => {
  fixture = TestBed.createComponent(Test);
  await fixture.whenStable();

  // all elements with an attached Highlight
  des = fixture.debugElement.queryAll(By.directive(Highlight));
});

// color tests
it('should have three highlighted elements', () => {
  expect(des.length).toBe(3);
});

it('should color 1st <h2> background "yellow"', () => {
  const bgColor = des[0].nativeElement.style.backgroundColor;
  expect(bgColor).toBe('yellow');
});

it('should color 2nd <h2> background w/ default color', () => {
  const dir = des[1].injector.get(Highlight);
  const bgColor = des[1].nativeElement.style.backgroundColor;
  expect(bgColor).toBe(dir.defaultColor);
});

it('should bind <input> background to value color', async () => {
  // easier to work with nativeElement
  const input = des[2].nativeElement as HTMLInputElement;
  expect(input.style.backgroundColor, 'initial backgroundColor').toBe('cyan');

  input.value = 'green';

  // Dispatch a DOM event so that Angular responds to the input value change.
  input.dispatchEvent(new Event('input'));
  await fixture.whenStable();

  expect(input.style.backgroundColor, 'changed backgroundColor').toBe('green');
});

it('bare <h2> should not have a backgroundColor', () => {
  // the h2 without the Highlight directive
  const bareH2 = fixture.debugElement.query(By.css('h2:not([highlight])'));

  expect(bareH2.styles.backgroundColor).toBeUndefined();
});
```

Birkaç teknik dikkat çekicidir:

- `By.directive` yüklemi, _öğe tipleri bilinmediğinde_ bu yönergeye sahip öğeleri almanın harika bir yoludur
- `By.css('h2:not([highlight])')` içindeki [`:not` sözde sınıfı](https://developer.mozilla.org/docs/Web/CSS/:not), yönergeye sahip _olmayan_ `<h2>` öğelerini bulmaya yardımcı olur.
  `By.css('*:not([highlight])')` yönergeye sahip olmayan _herhangi bir_ öğeyi bulur.

- `DebugElement.styles`, `DebugElement` soyutlaması sayesinde gerçek bir tarayıcı olmasa bile öğe stillerine erişim sağlar.
  Ancak soyutlamadan daha kolay veya daha anlaşılır göründüğünde `nativeElement`'i kullanmaktan çekinmeyin.

- Angular, bir yönergeyi uygulandığı öğenin enjektörüne ekler.
  Varsayılan renk testi, `Highlight` örneğini ve `defaultColor` değerini almak için ikinci `<h2>`'nin enjektörünü kullanır.

- `DebugElement.properties`, yönerge tarafından ayarlanan yapay özel özelliğe erişim sağlar
