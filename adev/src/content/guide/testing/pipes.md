# Testing Pipes

[Pipe'ları](guide/templates/pipes) Angular test araçları olmadan test edebilirsiniz.

## Testing the `TitleCasePipe`

Bir pipe sınıfı, girdi değerini dönüştürülmüş bir çıktı değerine manipüle eden tek bir `transform` metoduna sahiptir.
`transform` uygulaması nadiren DOM ile etkileşim kurar.
Çoğu pipe'ın, `@Pipe` meta verisi ve bir arayüz dışında Angular'a bağımlılığı yoktur.

Her kelimenin ilk harfini büyük yapan bir `TitleCasePipe` düşünün.
İşte düzenli ifade ile bir uygulama.

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'titlecase', pure: true})
/** Transform to Title Case: uppercase the first letter of the words in a string. */
export class TitleCasePipe implements PipeTransform {
  transform(input: string): string {
    return input.length === 0
      ? ''
      : input.replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.slice(1).toLowerCase());
  }
}
```

Düzenli ifade kullanan her şey kapsamlı bir şekilde test edilmeye değerdir. Beklenen durumları ve uç durumları keşfetmek için standart birim test tekniklerini kullanabilirsiniz.

```ts
describe('TitleCasePipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  const pipe = new TitleCasePipe();

  it('transforms "abc" to "Abc"', () => {
    expect(pipe.transform('abc')).toBe('Abc');
  });

  it('transforms "abc def" to "Abc Def"', () => {
    expect(pipe.transform('abc def')).toBe('Abc Def');
  });

  // ... more tests ...
});
```

## Writing DOM tests to support a pipe test

Bunlar pipe'ın _izole_ testleridir.
`TitleCasePipe`'ın uygulama bileşenlerinde uygulandığında düzgün çalışıp çalışmadığını söyleyemezler.

Bunun gibi bileşen testleri eklemeyi düşünün:

```ts
it('should convert hero name to Title Case', async () => {
  // get the name's input and display elements from the DOM
  const hostElement: HTMLElement = harness.routeNativeElement!;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simulate user entering a new name into the input box
  nameInput.value = 'quick BROWN  fOx';

  // Dispatch a DOM event so that Angular learns of input value change.
  nameInput.dispatchEvent(new Event('input'));

  // Wait for Angular to update the display binding through the title pipe
  await harness.fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```
