<docs-decorative-header title="Sinyaller" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Dinamik veri oluşturun ve yönetin.
</docs-decorative-header>

Angular'da durum oluşturmak ve yönetmek için _sinyaller_ kullanırsınız. Sinyal, bir değerin etrafındaki hafif bir sarmalayıcıdır.

Yerel durumu tutmak üzere bir sinyal oluşturmak için `signal` fonksiyonunu kullanın:

```typescript
import {signal} from '@angular/core';

// `signal` fonksiyonu ile bir sinyal oluşturun.
const firstName = signal('Morgan');

// Sinyal değerini çağırarak okuyun — sinyaller fonksiyondur.
console.log(firstName());

// Bu sinyalin değerini `set` metodunu yeni bir değerle çağırarak değiştirin.
firstName.set('Jaime');

// Değeri önceki değere göre değiştirmek için
// `update` metodunu da kullanabilirsiniz.
firstName.update((name) => name.toUpperCase());
```

Angular, sinyallerin nerede okunduğunu ve ne zaman güncellendiğini takip eder. Çerçeve, DOM'u yeni durumla güncellemek gibi ek işlemler yapmak için bu bilgiyi kullanır. Değişen sinyal değerlerine zaman içinde tepki verebilme yeteneği _reaktivite_ olarak bilinir.

## Hesaplanmış İfadeler

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

## Bileşenlerde Sinyal Kullanımı

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

## Sonraki Adım

Dinamik verileri nasıl tanımlayacağınızı ve yöneteceğinizi öğrendiğinize göre, bu verileri şablonlar içinde nasıl kullanacağınızı öğrenmenin zamanı geldi.

<docs-pill-row>
  <docs-pill title="Şablonlarla dinamik arayüzler" href="essentials/templates" />
  <docs-pill title="Detaylı sinyaller kılavuzu" href="guide/signals" />
</docs-pill-row>
