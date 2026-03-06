# Model sinyalleriyle çift yönlü bağlama

Artık [input sinyalleri ile bileşenlere veri aktarmayı](/tutorials/signals/5-component-communication-with-signals) öğrendiğinize göre, iki yönlü bağlama için Angular'ın `model()` API'sini keşfedelim. Model sinyalleri, bileşenin hem bir değer alması HEM DE onu güncellemesi gereken onay kutuları, kaydırıcılar veya özel form kontrolleri gibi UI bileşenleri için mükemmeldir.

Bu aktivitede, üst bileşenle senkronize kalırken kendi durumunu yöneten özel bir onay kutusu bileşeni oluşturacaksınız.

<hr />

<docs-workflow>

<docs-step title="Model sinyali ile özel onay kutusunu kurun">
`custom-checkbox` bileşeninde, üst bileşenin değerini hem alabilecek hem de güncelleyebilecek bir model sinyali oluşturun.

```ts
// Add imports for model signals
import {Component, model, input, ChangeDetectionStrategy} from '@angular/core';

// Model signal for two-way binding
checked = model.required<boolean>();

// Optional input for label
label = input<string>('');
```

Salt okunur olan `input()` sinyallerinin aksine, `model()` sinyalleri hem okunabilir hem de yazılabilir.
</docs-step>

<docs-step title="Onay kutusu şablonunu oluşturun">
Tıklamalara yanıt veren ve kendi modelini güncelleyen onay kutusu şablonunu oluşturun.

```html
<label class="custom-checkbox">
  <input type="checkbox" [checked]="checked()" (change)="toggle()" />
  <span class="checkmark"></span>
  {{ label() }}
</label>
```

Bileşen, model sinyalinden okur ve onu güncellemek için bir metoda sahiptir.
</docs-step>

<docs-step title="Toggle metodunu ekleyin">
Onay kutusu tıklandığında model sinyalini güncelleyen toggle metodunu uygulayın.

```ts
toggle() {
  // This updates BOTH the component's state AND the parent's model!
  this.checked.set(!this.checked());
}
```

Alt bileşen `this.checked.set()` çağrısı yaptığında, değişiklik otomatik olarak üst bileşene yayılır. Bu, `input()` sinyallerinden temel farktır.
</docs-step>

<docs-step title="Üst bileşende iki yönlü bağlamayı kurun">
Önce, `app.ts` dosyasındaki model sinyal özelliklerini ve metotlarını yorumdan çıkarın:

```ts
// Parent signal models
agreedToTerms = model(false);
enableNotifications = model(true);

// Methods to test two-way binding
toggleTermsFromParent() {
  this.agreedToTerms.set(!this.agreedToTerms());
}

resetAll() {
  this.agreedToTerms.set(false);
  this.enableNotifications.set(false);
}
```

Ardından şablonu güncelleyin:

Bölüm 1. **Onay kutularını yorumdan çıkarın ve iki yönlü bağlama ekleyin:**

- İlk onay kutusu için `___ADD_TWO_WAY_BINDING___` yerine `[(checked)]="agreedToTerms"` koyun
- İkincisi için `___ADD_TWO_WAY_BINDING___` yerine `[(checked)]="enableNotifications"` koyun

Bölüm 2. **`???` yer tutucularını @if blokları ile değiştirin:**

```angular-html
@if (agreedToTerms()) {
  Yes
} @else {
  No
}

@if (enableNotifications()) {
  Yes
} @else {
  No
}
```

Bölüm 3. **Düğmelere tıklama işleyicileri ekleyin:**

```html
<button (click)="toggleTermsFromParent()">Toggle Terms from Parent</button>
<button (click)="resetAll()">Reset All</button>
```

`[(checked)]` sözdizimi iki yönlü bağlama oluşturur - veri bileşene aşağı akar VE değişiklikler, sinyalin kendisine referans veren ve sinyal getter'ını doğrudan _çağırmayan_ bir olay yayarak üst bileşene geri akar.
</docs-step>

<docs-step title="İki yönlü bağlamayı test edin">
İki yönlü bağlamayı çalışırken görmek için uygulamanızla etkileşime geçin:

1. **Onay kutularına tıklayın** - Bileşen kendi durumunu günceller ve üst bileşeni bilgilendirir
2. **"Toggle Terms from Parent" düğmesine tıklayın** - Üst bileşen güncellemeleri alt bileşene yayılır
3. **"Reset All" düğmesine tıklayın** - Üst bileşen her iki modeli sıfırlar ve bileşenler otomatik olarak güncellenir

Hem üst hem de alt bileşen paylaşılan durumu güncelleyebilir ve her ikisi de otomatik olarak senkronize kalır!
</docs-step>

</docs-workflow>

Mükemmel! Model sinyallerinin iki yönlü bağlamayı nasıl etkinleştirdiğini öğrendiniz:

- **Model sinyalleri** - Hem okunabilir hem de yazılabilir değerler için `model()` ve `model.required()` kullanın
- **İki yönlü bağlama** - Üst sinyalleri alt modellere bağlamak için `[(property)]` sözdizimini kullanın
- **UI bileşenleri için mükemmel** - Kendi durumunu yönetmesi gereken onay kutuları, form kontrolleri ve widget'lar
- **Otomatik senkronizasyon** - Üst ve alt bileşenler manuel olay yönetimi olmadan senkronize kalır

**`model()` ve `input()` ne zaman kullanılır:**

- Yalnızca aşağı akan veriler için `input()` kullanın (görüntüleme verileri, yapılandırma)
- Kendi değerini güncellemesi gereken UI bileşenleri için `model()` kullanın (form kontrolleri, geçişler)

Bir sonraki derste, [sinyalleri servislerle kullanmayı](/tutorials/signals/7-using-signals-with-services) öğreneceksiniz!
