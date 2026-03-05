# Two-way binding

**Cift yonlu baglama (two-way binding)**, bir degeri eslasmanli olarak bir elemana baglarken, ayni zamanda o elemana degisiklikleri bu baglama uzerinden geri iletme yeteneeiig veren bir kisayoldur.

## Syntax

Cift yonlu baglama sozdizimi, koseli parantez ve parantezlerin birlesimidir: `[()]`. Ozellik baglamasinin sozdizimi olan `[]` ile olay baglamasinin sozdizimi olan `()`'yi birlestirir. Angular toplulugu bu sozdizimini resmi olmayan sekilde "kutu icindeki muz" (banana-in-a-box) olarak adlandirir.

## Two-way binding with form controls

Gelistiriciler, kullanici bir kontrolle etkilesime girdikce bilesen verilerini bir form kontroluyle senkronize tutmak icin yaygin olarak cift yonlu baglama kullanir. Ornegin, bir kullanici bir metin girdisini doldurdugunda, bilesendeeki durumu guncellemelidir.

Asagidaki ornek, `firstName` nitelligini sayfada dinamik olarak gunceller:

```angular-ts
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  imports: [FormsModule],
  template: `
    <main>
      <h2>Hello {{ firstName }}!</h2>
      <input type="text" [(ngModel)]="firstName" />
    </main>
  `,
})
export class App {
  firstName = 'Ada';
}
```

Yerel form kontrolleriyle cift yonlu baglama kullanmak icin:

1. `@angular/forms`'dan `FormsModule`'u iceri aktarin
1. Cift yonlu baglama sozdizimi ile `ngModel` direktifini kullanin (orn. `[(ngModel)]`)
1. Guncellenmesini istediginiz durumu atayin (orn. `firstName`)

Bu yapilandirildiktan sonra, Angular metin girdisindeki herhangi bir guncellemenin bilesen durumunda dogru sekilde yansitilmasini saglayacaktir!

Resmi belgelerde [`NgModel`](/api/forms/NgModel) hakkinda daha fazla bilgi edinin.

## Two-way binding between components

Bir ust ve alt bilesen arasinda cift yonlu baglamayi kullanmak, form elemanlarina kiyasla daha fazla yapilandirma gerektirir.

Ise `App`'in baslangic sayac durumunu ayarlamasindan sorumlu oldugu, ancak sayacin guncelleme mantigi ve kullanici arayuzu islemesinin agirlikli olarak alt bileseni olan `Counter` icinde bulundugu bir ornek.

```angular-ts
// ./app.ts
import {Component} from '@angular/core';
import {Counter} from './counter';

@Component({
  selector: 'app-root',
  imports: [Counter],
  template: `
    <main>
      <h1>Counter: {{ initialCount }}</h1>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class App {
  initialCount = 18;
}
```

```angular-ts
// './counter.ts';
import {Component, model} from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="updateCount(-1)">-</button>
    <span>{{ count() }}</span>
    <button (click)="updateCount(+1)">+</button>
  `,
})
export class Counter {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update((currentCount) => currentCount + amount);
  }
}
```

### Enabling two-way binding between components

Yukaridaki ornegi ozune indirgersek, bilesenler icin her cift yonlu baglama asagidakileri gerektirir:

Alt bilesen bir `model` ozelligine sahip olmalidir.

Iste basitlestirilmis bir ornek:

```angular-ts
// './counter.ts';
import {Component, model} from '@angular/core';

@Component({
  /* Omitted for brevity */
})
export class Counter {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update((currentCount) => currentCount + amount);
  }
}
```

Ust bilesen sunlari yapmalidir:

1. `model` ozellik adini cift yonlu baglama sozdizimi icine sarin.
1. `model` ozelligine bir ozellik veya signal atayin.

Ise basitlestirilmis bir ornek:

```angular-ts
// ./app.ts
import {Component} from '@angular/core';
import {Counter} from './counter';

@Component({
  selector: 'app-root',
  imports: [Counter],
  template: `
    <main>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class App {
  initialCount = 18;
}
```
