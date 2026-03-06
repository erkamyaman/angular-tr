# Çift yönlü binding

**Çift yönlü bağlama (two-way binding)**, bir değeri eşzamanlı olarak bir elemana bağlarken, aynı zamanda o elemana değişiklikleri bu bağlama üzerinden geri iletme yeteneği veren bir kısayoldur.

## Sözdizimi

Çift yönlü bağlama sözdizimi, köşeli parantez ve parantezlerin birleşimidir: `[()]`. Özellik bağlamasının sözdizimi olan `[]` ile olay bağlamasının sözdizimi olan `()`'yi birleştirir. Angular topluluğu bu sözdizimini resmi olmayan şekilde "kutu içindeki muz" (banana-in-a-box) olarak adlandırır.

## Form kontrolleri ile çift yönlü binding

Geliştiriciler, kullanıcı bir kontrolle etkileşime girdikçe bileşen verilerini bir form kontrolüyle senkronize tutmak için yaygın olarak çift yönlü bağlama kullanır. Örneğin, bir kullanıcı bir metin girdisini doldurduğunda, bileşendeki durumu güncellemelidir.

Aşağıdaki örnek, `firstName` niteliğini sayfada dinamik olarak günceller:

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

Yerel form kontrolleriyle çift yönlü bağlama kullanmak için:

1. `@angular/forms`'dan `FormsModule`'u içeri aktarın
1. Çift yönlü bağlama sözdizimi ile `ngModel` direktifini kullanın (örn. `[(ngModel)]`)
1. Güncellenmesini istediğiniz durumu atayın (örn. `firstName`)

Bu yapılandırıldıktan sonra, Angular metin girdisindeki herhangi bir güncellemenin bileşen durumunda doğru şekilde yansıtılmasını sağlayacaktır!

Resmi belgelerde [`NgModel`](/api/forms/NgModel) hakkında daha fazla bilgi edinin.

## Bileşenler arası çift yönlü binding

Bir üst ve alt bileşen arasında çift yönlü bağlamayı kullanmak, form elemanlarına kıyasla daha fazla yapılandırma gerektirir.

İşte `App`'in başlangıç sayaç durumunu ayarlamasından sorumlu olduğu, ancak sayacın güncelleme mantığı ve kullanıcı arayüzü işlemesinin ağırlıklı olarak alt bileşeni olan `Counter` içinde bulunduğu bir örnek.

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

### Bileşenler arası çift yönlü binding'i etkinleştirme

Yukarıdaki örneği özüne indirgersek, bileşenler için her çift yönlü bağlama aşağıdakileri gerektirir:

Alt bileşen bir `model` özelliğine sahip olmalıdır.

İşte basitleştirilmiş bir örnek:

```angular-ts
// './counter.ts';
import {Component, model} from '@angular/core';

@Component({
  /* Kısalık için atlanmıştır */
})
export class Counter {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update((currentCount) => currentCount + amount);
  }
}
```

Üst bileşen şunları yapmalıdır:

1. `model` özellik adını çift yönlü bağlama sözdizimi içine sarın.
1. `model` özelliğine bir özellik veya signal atayın.

İşte basitleştirilmiş bir örnek:

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
