<docs-decorative-header title="Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Dinamik veri oluşturun ve yönetin.
</docs-decorative-header>

Angular'da durum oluşturmak ve yönetmek için _sinyaller_ kullanırsınız. Sinyal, bir değerin etrafındaki hafif bir sarmalayıcıdır.

Yerel durumu tutmak üzere bir sinyal oluşturmak için `signal` fonksiyonunu kullanın:

```typescript
import {signal} from '@angular/core';

// Create a signal with the `signal` function.
const firstName = signal('Morgan');

// Read a signal value by calling it— signals are functions.
console.log(firstName());

// Change the value of this signal by calling its `set` method with a new value.
firstName.set('Jaime');

// You can also use the `update` method to change the value
// based on the previous value.
firstName.update((name) => name.toUpperCase());
```

Angular, sinyallerin nerede okunduğunu ve ne zaman güncellendiğini takip eder. Çerçeve, DOM'u yeni durumla güncellemek gibi ek işlemler yapmak için bu bilgiyi kullanır. Değişen sinyal değerlerine zaman içinde tepki verebilme yeteneği _reaktivite_ olarak bilinir.

## Computed expressions

`computed`, değerini diğer sinyallere göre üreten bir sinyaldir.

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());

console.log(firstNameCapitalized()); // MORGAN
```

Bir `computed` sinyali salt okunurdur; `set` veya `update` metodu yoktur. Bunun yerine, `computed` sinyalinin değeri, okuduğu sinyallerden herhangi biri değiştiğinde otomatik olarak değişir:

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());
console.log(firstNameCapitalized()); // MORGAN

firstName.set('Jaime');
console.log(firstNameCapitalized()); // JAIME
```

## Using signals in components

Durum oluşturmak ve yönetmek için bileşenlerinizin içinde `signal` ve `computed` kullanın:

```ts
@Component({
  /* ... */
})
export class UserProfile {
  isTrial = signal(false);
  isTrialExpired = signal(false);
  showTrialDuration = computed(() => this.isTrial() && !this.isTrialExpired());

  activateTrial() {
    this.isTrial.set(true);
  }
}
```

TIP: Angular Sinyalleri hakkında daha fazla bilgi edinmek ister misiniz? Tüm ayrıntılar için [Detaylı Sinyaller kılavuzuna](guide/signals) bakın.

## Next Step

Dinamik verileri nasıl tanımlayacağınızı ve yöneteceğinizi öğrendiğinize göre, bu verileri şablonlar içinde nasıl kullanacağınızı öğrenmenin zamanı geldi.

<docs-pill-row>
  <docs-pill title="Dynamic interfaces with templates" href="essentials/templates" />
  <docs-pill title="In-depth signals guide" href="guide/signals" />
</docs-pill-row>
