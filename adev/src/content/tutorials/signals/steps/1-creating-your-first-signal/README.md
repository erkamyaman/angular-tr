# Creating and updating your first signal

Angular sinyalleri öğreticisine hoş geldiniz! [Sinyaller](/essentials/signals), Angular'ın reaktif temel yapı taşıdır ve durumu yönetmenin ve bu durum değiştiğinde kullanıcı arayüzünüzü otomatik olarak güncellemenin bir yolunu sağlar.

Bu aktivitede şunları öğreneceksiniz:

- `signal()` fonksiyonunu kullanarak ilk sinyalinizi oluşturma
- Değerini bir şablonda görüntüleme
- `set()` ve `update()` metotlarını kullanarak sinyal değerini güncelleme

Sinyallerle etkileşimli bir kullanıcı durum sistemi oluşturalım!

<hr />

<docs-workflow>

<docs-step title="Signal fonksiyonunu içe aktarın">
Bileşen dosyanızın en üstüne `@angular/core` paketinden `signal` fonksiyonunu içe aktarın.

```ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="Bileşeninizde bir sinyal oluşturun">
Bileşen sınıfınıza `'offline'` değeriyle başlatılan bir `userStatus` sinyali ekleyin.

```ts
@Component({
  /* Config omitted */
})
export class App {
  userStatus = signal<'online' | 'offline'>('offline');
}
```

</docs-step>

<docs-step title="Sinyal değerini şablonda görüntüleyin">
Durum göstergesini, mevcut kullanıcı durumunu görüntüleyecek şekilde güncelleyin:
1. Sinyali class niteliğine `[class]="userStatus()"` ile bağlama
2. `???` yerine `{{ userStatus() }}` koyarak durum metnini görüntüleme

```angular-html
<!-- Update from: -->
<div class="status-indicator offline">
  <span class="status-dot"></span>
  Status: ???
</div>

<!-- To: -->
<div class="status-indicator" [class]="userStatus()">
  <span class="status-dot"></span>
  Status: {{ userStatus() }}
</div>
```

Sinyalin değerini okumak için `userStatus()` şeklinde parantezlerle çağırdığımıza dikkat edin.
</docs-step>

<docs-step title="Sinyali güncellemek için metotlar ekleyin">
`set()` metodunu kullanarak kullanıcı durumunu değiştiren metotları bileşeninize ekleyin.

```ts
goOnline() {
  this.userStatus.set('online');
}

goOffline() {
  this.userStatus.set('offline');
}
```

`set()` metodu, sinyalin değerini tamamen yeni bir değerle değiştirir.

</docs-step>

<docs-step title="Kontrol düğmelerini bağlayın">
Düğmeler zaten şablonda mevcut. Şimdi aşağıdakileri ekleyerek onları metotlarınıza bağlayın:
1. `(click)` ile tıklama işleyicileri
2. Zaten o durumda olunduğunda `[disabled]` ile devre dışı durumlar

```html
<!-- Add bindings to the existing buttons: -->
<button (click)="goOnline()" [disabled]="userStatus() === 'online'">Go Online</button>
<button (click)="goOffline()" [disabled]="userStatus() === 'offline'">Go Offline</button>
```

</docs-step>

<docs-step title="update() kullanarak bir geçiş metodu ekleyin">
`update()` metodunu kullanarak çevrimiçi ve çevrimdışı arasında geçiş yapan bir `toggleStatus()` metodu ekleyin.

```ts
toggleStatus() {
  this.userStatus.update(current => current === 'online' ? 'offline' : 'online');
}
```

`update()` metodu, mevcut değeri alan ve yeni değeri döndüren bir fonksiyon alır. Bu, mevcut değeri geçerli durumuna göre değiştirmeniz gerektiğinde kullanışlıdır.

</docs-step>

<docs-step title="Geçiş düğmesi işleyicisini ekleyin">
Geçiş düğmesi zaten şablonda mevcut. Onu `toggleStatus()` metodunuza bağlayın:

```html
<button (click)="toggleStatus()" class="toggle-btn">Toggle Status</button>
```

</docs-step>

</docs-workflow>

Tebrikler! İlk sinyalinizi oluşturdunuz ve hem `set()` hem de `update()` metotlarını kullanarak nasıl güncelleneceğini öğrendiniz. `signal()` fonksiyonu, Angular'ın izlediği reaktif bir değer oluşturur ve siz onu güncellediğinizde, kullanıcı arayüzünüz değişiklikleri otomatik olarak yansıtır.

Ardından, [computed kullanarak sinyallerden durum türetmeyi](/tutorials/signals/2-deriving-state-with-computed-signals) öğreneceksiniz!

<docs-callout helpful title="About ChangeDetectionStrategy.OnPush">

Bu öğretici boyunca bileşen dekoratöründe `ChangeDetectionStrategy.OnPush` görebilirsiniz. Bu, sinyalleri kullanan Angular bileşenleri için bir performans optimizasyonudur. Şimdilik bunu güvenle görmezden gelebilirsiniz - sadece sinyalleri kullanırken uygulamanızın daha hızlı çalışmasına yardımcı olduğunu bilin! Daha fazla bilgi için [değişiklik algılama stratejileri API belgelerine](/api/core/ChangeDetectionStrategy) bakabilirsiniz.

</docs-callout>
