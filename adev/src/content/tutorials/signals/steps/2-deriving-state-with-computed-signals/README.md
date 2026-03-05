# Deriving state with computed signals

Artık [sinyal oluşturmayı ve güncellemeyi](/tutorials/signals/1-creating-your-first-signal) öğrendiğinize göre, hesaplanmış (computed) sinyalleri öğrenelim. Hesaplanmış sinyaller, bağımlılıkları değiştiğinde otomatik olarak güncellenen türetilmiş değerlerdir. Diğer sinyallere dayalı reaktif hesaplamalar oluşturmak için mükemmeldirler.

Bu aktivitede, bağımlı sinyaller değiştiğinde otomatik olarak güncellenen türetilmiş durum oluşturmak için `computed()` fonksiyonunu nasıl kullanacağınızı öğreneceksiniz.

Kullanıcı durum sinyalimizden bilgi türeten hesaplanmış değerler ekleyerek kullanıcı durum sistemimizi geliştirelim. Başlangıç kodu artık üç durum seçeneği içeriyor: `'online'`, `'away'` ve `'offline'`.

<hr />

<docs-workflow>

<docs-step title="Import computed function">
Mevcut içe aktarmalarınıza `computed` ekleyin.

```ts
// Add computed to existing imports
import {Component, signal, computed, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="Create a computed signal for notifications">
Kullanıcı durumuna göre bildirimlerin etkinleştirilip etkinleştirilmeyeceğini belirleyen bir hesaplanmış sinyal ekleyin.

```ts
notificationsEnabled = computed(() => this.userStatus() === 'online');
```

Bu hesaplanmış sinyal, `userStatus` sinyali her değiştiğinde otomatik olarak yeniden hesaplanacaktır. Sinyalin değerini okumak için hesaplanmış fonksiyonun içinde `this.userStatus()` çağrısını nasıl yaptığımıza dikkat edin.
</docs-step>

<docs-step title="Create a computed signal for a descriptive message">
Kullanıcı durumuna göre açıklayıcı bir mesaj oluşturan bir hesaplanmış sinyal ekleyin.

```ts
statusMessage = computed(() => {
  const status = this.userStatus();
  switch (status) {
    case 'online':
      return 'Available for meetings and messages';
    case 'away':
      return 'Temporarily away, will respond soon';
    case 'offline':
      return 'Not available, check back later';
    default:
      return 'Status unknown';
  }
});
```

Bu, hesaplanmış sinyallerin switch ifadeleri ve dize dönüşümleriyle daha karmaşık mantığı nasıl işleyebileceğini gösterir.
</docs-step>

<docs-step title="Create a computed signal that calculates working hours availability">
Kullanıcının çalışma saatleri içinde olup olmadığını hesaplayan bir hesaplanmış sinyal ekleyin.

```ts
isWithinWorkingHours = computed(() => {
  const now = new Date();
  const hour = now.getHours();
  const isWeekday = now.getDay() > 0 && now.getDay() < 6;
  return isWeekday && hour >= 9 && hour < 17 && this.userStatus() !== 'offline';
});
```

Bu, hesaplanmış sinyallerin nasıl hesaplamalar yapabildiğini ve birden fazla veri kaynağını birleştirebildiğini gösterir. `userStatus` değiştiğinde değer otomatik olarak güncellenir.
</docs-step>

<docs-step title="Display the computed values in the template">
Şablonda zaten "Loading..." gösteren yer tutucular var. Bunları hesaplanmış sinyallerinizle değiştirin:

1. Bildirimler için, `Loading...` yerine bir `@if` bloğu koyun:

   ```angular-html
   @if (notificationsEnabled()) {
     Enabled
   } @else {
     Disabled
   }
   ```

1. Mesaj için, `Loading...` yerine şunu koyun:

   ```angular-html
   {{ statusMessage() }}
   ```

1. Çalışma saatleri için, `Loading...` yerine bir `@if` bloğu koyun:

   ```angular-html
   @if (isWithinWorkingHours()) {
     Yes
   } @else {
     No
   }
   ```

Hesaplanmış sinyallerin normal sinyaller gibi - parantezlerle - çağrıldığına dikkat edin!
</docs-step>

</docs-workflow>

Mükemmel! Artık hesaplanmış sinyaller oluşturmayı öğrendiniz.

Hatırlanması gereken bazı önemli noktalar:

- **Hesaplanmış sinyaller reaktiftir**: Bağımlılıkları değiştiğinde otomatik olarak güncellenir
- **Salt okunurdur**: Hesaplanmış değerleri doğrudan ayarlayamazsınız, diğer sinyallerden türetilirler
- **Karmaşık mantık içerebilirler**: Hesaplamalar, dönüşümler ve türetilmiş durum için kullanın
- **Dinamik duruma dayalı performanslı hesaplamalar yapmanın bir yolunu sağlarlar**: Angular, yalnızca bağımlılıkları gerçekten değiştiğinde bunları yeniden hesaplar

Bir sonraki derste, [linkedSignal ile durum türetmenin farklı bir yolunu](/tutorials/signals/3-deriving-state-with-linked-signals) öğreneceksiniz!
