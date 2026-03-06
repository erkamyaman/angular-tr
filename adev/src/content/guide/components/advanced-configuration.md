# Gelişmiş bileşen yapılandırması

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okuduğunuzu varsayar. Angular'da yeniyseniz önce onu okuyun.

## ChangeDetectionStrategy

`@Component` dekoratörü, bileşenin **değişiklik algılama modunu** kontrol eden bir `changeDetection` seçeneği kabul eder. İki değişiklik algılama modu seçeneği vardır.

**`ChangeDetectionStrategy.Eager`/`Default`**, şaşırtıcı olmayan bir şekilde varsayılan stratejidir. Bu modda Angular, uygulama genelinde herhangi bir aktivite gerçekleştiğinde bileşenin DOM'unun güncellenmesi gerekip gerekmediğini kontrol eder. Bu kontrolü tetikleyen aktiviteler arasında kullanıcı etkileşimi, ağ yanıtı, zamanlayıcılar ve daha fazlası yer alır.

**`ChangeDetectionStrategy.OnPush`**, Angular'ın yapması gereken kontrol miktarını azaltan isteğe bağlı bir moddur. Bu modda framework, bir bileşenin DOM'unun güncellenmesi gerekip gerekmediğini yalnızca şu durumlarda kontrol eder:

- Bir bileşen girdisi, bir şablondaki bağlama sonucunda değişmişse, veya
- Bu bileşendeki bir olay dinleyicisi çalışırsa
- Bileşen, `ChangeDetectorRef.markForCheck` veya onu sarmalayan `AsyncPipe` gibi bir şey aracılığıyla açıkça kontrol için işaretlenmişse.

Ek olarak, bir OnPush bileşeni kontrol edildiğinde, Angular uygulama ağacı boyunca yukarı doğru ilerleyerek tüm üst bileşenleri de kontrol eder.

## PreserveWhitespaces

Varsayılan olarak Angular, şablonlardaki gereksiz boşluk karakterlerini kaldırır ve daraltır; bunlar en yaygın olarak yeni satırlar ve girintilerdir. Bu ayarı, bileşenin meta verilerinde `preserveWhitespaces` değerini açıkça `true` olarak ayarlayarak değiştirebilirsiniz.

## Özel eleman şemaları

Varsayılan olarak Angular, bilinmeyen bir HTML elemanı ile karşılaştığında hata verir. Bileşen meta verilerinizdeki `schemas` özelliğine `CUSTOM_ELEMENTS_SCHEMA` ekleyerek bir bileşen için bu davranışı devre dışı bırakabilirsiniz.

```angular-ts
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  ...,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<some-unknown-component />'
})
export class ComponentWithCustomElements { }
```

Angular şu anda başka hiçbir şemayı desteklememektedir.
