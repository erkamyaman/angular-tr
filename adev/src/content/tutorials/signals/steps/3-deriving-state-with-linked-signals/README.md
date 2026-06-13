# Linked sinyallerle durum türetme

Artık [computed sinyalleri ile durum türetmeyi](/tutorials/signals/2-deriving-state-with-computed-signals) öğrendiğinize göre, kullanıcı durumunuzu otomatik olarak takip eden `notificationsEnabled` için bir computed sinyal oluşturdunuz. Peki ya kullanıcılar çevrimiçi olsalar bile bildirimleri manuel olarak devre dışı bırakmak isterlerse? İşte burada bağlantılı sinyaller (linked signals) devreye girer.

Bağlantılı sinyaller, kaynak sinyalleriyle reaktif bir bağlantıyı sürdüren yazılabilir sinyallerdir. Normalde bir hesaplamayı takip eden ancak gerektiğinde geçersiz kılınabilen durumlar oluşturmak için mükemmeldirler.

Bu aktivitede, önceki kullanıcı durum sistemindeki hesaplanmış `notificationsEnabled` sinyalini yazılabilir bir bağlantılı sinyale dönüştürerek `linkedSignal()` ile `computed()` arasındaki farkı öğreneceksiniz.

<hr />

<docs-workflow>

<docs-step title="linkedSignal fonksiyonunu içe aktarın">
Mevcut içe aktarmalarınıza `linkedSignal` ekleyin.

```ts
// Add linkedSignal to existing imports
import {Component, signal, computed, linkedSignal, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="computed ifadesini aynı ifadeyle linkedSignal'e dönüştürün">
Hesaplanmış `notificationsEnabled` sinyalini, aynı ifadeyi kullanarak bir linkedSignal ile değiştirin:

```ts
// Previously (from lesson 2):
// notificationsEnabled = computed(() => this.userStatus() === 'online');

// Now with linkedSignal - same expression, but writable:
notificationsEnabled = linkedSignal(() => this.userStatus() === 'online');
```

İfade aynıdır, ancak linkedSignal yazılabilir bir sinyal oluşturur. `userStatus` değiştiğinde yine otomatik olarak güncellenecektir, ancak bunu manuel olarak da ayarlayabilirsiniz.
</docs-step>

<docs-step title="Bildirimleri manuel olarak değiştirmek için bir metot ekleyin">
Bağlantılı sinyallere doğrudan yazılabileceğini gösteren bir metot ekleyin:

```ts
toggleNotifications() {
  // This works with linkedSignal but would error with computed!
  this.notificationsEnabled.set(!this.notificationsEnabled());
}
```

Temel fark budur: computed sinyaller salt okunurdur, ancak bağlantılı sinyaller reaktif bağlantılarını korurken manuel olarak güncellenebilir.
</docs-step>

<docs-step title="Manuel bildirim kontrolü eklemek için şablonu güncelleyin">
Bildirimler için bir geçiş düğmesi eklemek üzere şablonunuzu güncelleyin:

```angular-html
<div class="status-info">
  <div class="notifications">
    <strong>Notifications:</strong>
    @if (notificationsEnabled()) {
      Enabled
    } @else {
      Disabled
    }
    <button (click)="toggleNotifications()" class="override-btn">
      @if (notificationsEnabled()) {
        Disable
      } @else {
        Enable
      }
    </button>
  </div>
  <!-- existing message and working-hours divs remain -->
</div>
```

</docs-step>

<docs-step title="Reaktif davranışı gözlemleyin">
Şimdi davranışı test edin:

1. Kullanıcı durumunu değiştirin - `notificationsEnabled` sinyalinin otomatik olarak güncellendiğine dikkat edin
2. Bildirimleri manuel olarak değiştirin - hesaplanmış değeri geçersiz kılar
3. Durumu tekrar değiştirin - bağlantılı sinyal hesaplamasıyla yeniden eşleşir

Bu, bağlantılı sinyallerin manuel olarak ayarlandıktan sonra bile reaktif bağlantılarını koruduğunu gösterir!
</docs-step>

</docs-workflow>

Mükemmel! Computed ve bağlantılı sinyaller arasındaki temel farkları öğrendiniz:

- **Computed sinyaller**: Salt okunur, her zaman diğer sinyallerden türetilir
- **Bağlantılı sinyaller**: Yazılabilir, hem türetilebilir HEM DE manuel olarak güncellenebilir
- **Computed ne zaman kullanılır**: Değer her zaman hesaplanmalıysa
- **linkedSignal ne zaman kullanılır**: Geçersiz kılınabilen bir varsayılan hesaplamaya ihtiyacınız varsa

Bir sonraki derste, [sinyallerle asenkron veri yönetmeyi](/tutorials/signals/4-managing-async-data-with-signals) öğreneceksiniz!
