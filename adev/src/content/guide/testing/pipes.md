# Pipe'ları Test Etme

[Pipe'ları](guide/templates/pipes) Angular test araçları olmadan test edebilirsiniz.

## `TitleCasePipe`'ı test etme

Bir pipe sınıfı, girdi değerini dönüştürülmüş bir çıktı değerine manipüle eden tek bir `transform` metoduna sahiptir.
`transform` uygulaması nadiren DOM ile etkileşim kurar.
Çoğu pipe'ın, `@Pipe` meta verisi ve bir arayüz dışında Angular'a bağımlılığı yoktur.

Her kelimenin ilk harfini büyük yapan bir `TitleCasePipe` düşünün.
İşte düzenli ifade ile bir uygulama.

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'titlecase', pure: true})
/** Başlık Durumuna Dönüştür: bir dizedeki kelimelerin ilk harfini büyük yapar. */
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
  // Bu pipe saf, durumsuz bir fonksiyondur, bu yüzden BeforeEach'e gerek yoktur
  const pipe = new TitleCasePipe();

  it('transforms "abc" to "Abc"', () => {
    expect(pipe.transform('abc')).toBe('Abc');
  });

  it('transforms "abc def" to "Abc Def"', () => {
    expect(pipe.transform('abc def')).toBe('Abc Def');
  });

  // ... daha fazla test ...
});
```

## Bir pipe test'ini desteklemek için DOM test'leri yazma

Bunlar pipe'ın _izole_ testleridir.
`TitleCasePipe`'ın uygulama bileşenlerinde uygulandığında düzgün çalışıp çalışmadığını söyleyemezler.

Bunun gibi bileşen testleri eklemeyi düşünün:

```ts
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
