# Advanced component configuration

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okudugunuzu varsayar. Angular'da yeniyseniz once onu okuyun.

## ChangeDetectionStrategy

`@Component` dekoratoru, bilesnenin **degisiklik algilama modunu** kontrol eden bir `changeDetection` secenegi kabul eder. Iki degisiklik algilama modu secenegi vardir.

**`ChangeDetectionStrategy.Eager`/`Default`**, sasirtici olmayan bir sekilde varsayilan stratejidir. Bu modda Angular, uygulama genelinde herhangi bir aktivite gerceklestiginde bilesnenin DOM'unun guncellenmesi gerekip gerekmedigini kontrol eder. Bu kontrolu tetikleyen aktiviteler arasinda kullanici etkilesimi, ag yaniti, zamanlayicilar ve daha fazlasi yer alir.

**`ChangeDetectionStrategy.OnPush`**, Angular'in yapmasi gereken kontrol miktarini azaltan istege bagli bir moddur. Bu modda framework, bir bilesnenin DOM'unun guncellenmesi gerekip gerekmedigini yalnizca su durumlarda kontrol eder:

- Bir bilesen girdisi, bir sablondaki baglama sonucunda degismisse, veya
- Bu bilesnedeki bir olay dinleyicisi calisirsa
- Bilesen, `ChangeDetectorRef.markForCheck` veya onu sarmalayan `AsyncPipe` gibi bir sey araciligiyla acikca kontrol icin isaretlenmisse.

Ek olarak, bir OnPush bileseni kontrol edildiginde, Angular uygulama agaci boyunca yukari dogru ilerleyerek tum ust bilesenleri de kontrol eder.

## PreserveWhitespaces

Varsayilan olarak Angular, sablonlardaki gereksiz bosluk karakterlerini kaldirir ve daraltir; bunlar en yaygin olarak yeni satirlar ve girintilerdir. Bu ayari, bilesnenin meta verilerinde `preserveWhitespaces` degerini acikca `true` olarak ayarlayarak degistirebilirsiniz.

## Custom element schemas

Varsayilan olarak Angular, bilinmeyen bir HTML elemani ile karsilastiginda hata verir. Bilesen meta verilerinizdeki `schemas` ozelligine `CUSTOM_ELEMENTS_SCHEMA` ekleyerek bir bilesen icin bu davranisi devre disi birakabilirsiniz.

```angular-ts
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  ...,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<some-unknown-component />'
})
export class ComponentWithCustomElements { }
```

Angular su anda baska hicbir semayi desteklememektedir.
