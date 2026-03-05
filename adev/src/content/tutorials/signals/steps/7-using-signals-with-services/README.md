# Using signals with services

Artık [model sinyalleri ile iki yönlü bağlamayı](/tutorials/signals/6-two-way-binding-with-model-signals) öğrendiğinize göre, sinyalleri Angular servisleriyle nasıl kullanacağınızı keşfedelim. Servisler, birden fazla bileşen arasında reaktif durumu paylaşmak için mükemmeldir ve sinyaller, otomatik değişiklik algılama ve temiz reaktif kalıplar sağlayarak bunu daha da güçlü hale getirir.

Bu aktivitede, sepet görüntüleme bileşeninin durum değişikliklerine otomatik olarak tepki vermesini sağlayan sinyallerle bir alışveriş sepeti deposu oluşturmayı öğreneceksiniz.

<hr />

<docs-workflow>

<docs-step title="Add cart store signals">
`cart-store.ts` dosyasında sepet durumunu reaktif hale getirmek için salt okunur ve computed sinyaller ekleyin.

```ts
// Add the computed import
import {Injectable, signal, computed} from '@angular/core';

// Then add these signals to the class:

// Readonly signals
readonly cartItems = this.items.asReadonly();

// Computed signals
readonly totalQuantity = computed(() => {
  return this.items().reduce((sum, item) => sum + item.quantity, 0);
});

readonly totalPrice = computed(() => {
  return this.items().reduce((sum, item) => sum + item.price * item.quantity, 0);
});
```

Bu sinyaller, bileşenlerin sepet verilerine ve hesaplanmış toplamlara reaktif olarak erişmesini sağlar. `asReadonly()` metodu, harici kodun sepet öğelerini doğrudan değiştirmesini engeller; `computed()` ise kaynak sinyal değiştiğinde otomatik olarak güncellenen türetilmiş durum oluşturur.
</docs-step>

<docs-step title="Complete the quantity update methods">
`cart-display.ts` dosyasındaki sepet görüntüleme bileşeni, şablonunda zaten sepet deposu sinyallerini kullanıyor. Sepet öğelerini değiştirmek için miktar güncelleme metotlarını tamamlayın:

```ts
increaseQuantity(id: string) {
  const items = this.cartStore.cartItems();
  const currentItem = items.find((item) => item.id === id);
  if (currentItem) {
    this.cartStore.updateQuantity(id, currentItem.quantity + 1);
  }
}

decreaseQuantity(id: string) {
  const items = this.cartStore.cartItems();
  const currentItem = items.find((item) => item.id === id);
  if (currentItem && currentItem.quantity > 1) {
    this.cartStore.updateQuantity(id, currentItem.quantity - 1);
  }
}
```

Bu metotlar, `cartItems()` kullanarak mevcut sepet durumunu okur ve deponun metotları aracılığıyla miktarları günceller. Sinyaller değiştiğinde UI otomatik olarak güncellenir!
</docs-step>

<docs-step title="Update the main app component">
Sepet servisini kullanmak ve sepet bileşenini görüntülemek için `app.ts` dosyasındaki ana uygulama bileşenini güncelleyin.

```angular-ts
import {Component, inject} from '@angular/core';
import {CartStore} from './cart-store';
import {CartDisplay} from './cart-display';

@Component({
  selector: 'app-root',
  imports: [CartDisplay],
  template: `
    <div class="shopping-app">
      <header>
        <h1>Signals with Services Demo</h1>
        <div class="cart-badge">
          Cart: {{ cartStore.totalQuantity() }} items (\${{ cartStore.totalPrice() }})
        </div>
      </header>

      <main>
        <cart-display />
      </main>
    </div>
  `,
  styleUrl: './app.css',
})
export class App {
  cartStore = inject(CartStore);
}
```

</docs-step>

</docs-workflow>

Mükemmel! Artık sinyalleri servislerle nasıl kullanacağınızı öğrendiniz. Hatırlanması gereken temel kavramlar:

- **Servis düzeyinde sinyaller**: Servisler, reaktif durumu yönetmek için sinyalleri kullanabilir
- **Bağımlılık enjeksiyonu**: Bileşenlerde sinyallere sahip servislere erişmek için `inject()` kullanın
- **Servislerde computed sinyaller**: Otomatik olarak güncellenen türetilmiş durum oluşturun
- **Salt okunur sinyaller**: Harici değişiklikleri önlemek için sinyallerin salt okunur sürümlerini ortaya koyun

Bir sonraki derste, [sinyalleri direktiflerle nasıl kullanacağınızı](/tutorials/signals/8-using-signals-with-directives) öğreneceksiniz!
