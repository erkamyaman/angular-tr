# Passing data to components with input signals

Artık [sinyallerle asenkron veri yönetmeyi](/tutorials/signals/4-managing-async-data-with-signals) öğrendiğinize göre, üst bileşenden alt bileşene veri aktarmak için Angular'ın sinyal tabanlı `input()` API'sini keşfedelim; bu, bileşen veri akışını daha reaktif ve verimli hale getirir. Diğer framework'lerdeki bileşen prop'larına aşinaysanız, input'lar aynı fikirdir.

Bu aktivitede, bir ürün kartı bileşenine sinyal input'ları ekleyecek ve üst bileşen verilerinin reaktif olarak nasıl aktığını göreceksiniz.

<hr />

<docs-workflow>

<docs-step title="Add signal inputs to ProductCard">
`product-card` bileşeninde veri almak için sinyal `input()` fonksiyonları ekleyin.

```ts
// Add imports for signal inputs
import {Component, input, ChangeDetectionStrategy} from '@angular/core';

// Add these signal inputs
name = input.required<string>();
price = input.required<number>();
available = input<boolean>(true);
```

`input.required()` fonksiyonunun sağlanması zorunlu bir input oluşturduğuna, `input()` fonksiyonunun varsayılan değerle isteğe bağlı olduğuna dikkat edin.
</docs-step>

<docs-step title="Connect inputs to the template">
Sinyal input değerlerini görüntülemek için `product-card` içindeki şablonu güncelleyin.

```angular-html
<div class="product-card">
  <h3>{{ name() }}</h3>
  <p class="price">\${{ price() }}</p>
  <p class="status">
    Status:
    @if (available()) {
      Available
    } @else {
      Out of Stock
    }
  </p>
</div>
```

Input sinyalleri, şablonlarda normal sinyaller gibi çalışır - değerlerine erişmek için fonksiyon olarak çağırın.
</docs-step>

<docs-step title="Connect parent signals to child inputs">
`app.ts` dosyasındaki `product-card` kullanımını, statik değerler yerine dinamik sinyal değerleri geçirecek şekilde güncelleyin.

```html
<!-- Change from static values: -->
<product-card name="Static Product" price="99" available="true" />

<!-- To dynamic signals: -->
<product-card [name]="productName()" [price]="productPrice()" [available]="productAvailable()" />
```

Köşeli parantezler `[]`, mevcut sinyal değerlerini alt bileşene aktaran özellik bağlamaları oluşturur.
</docs-step>

<docs-step title="Test reactive updates">
Üst sinyalleri güncellemek ve alt bileşenin otomatik olarak nasıl tepki verdiğini görmek için `app.ts` dosyasına metotlar ekleyin.

```ts
updateProduct() {
  this.productName.set('Updated Product');
  this.productPrice.set(149);
}

toggleAvailability() {
  this.productAvailable.set(!this.productAvailable());
}
```

```html
<!-- Add controls to test reactivity -->
<div class="controls">
  <button (click)="updateProduct()">Update Product Info</button>
  <button (click)="toggleAvailability()">Toggle Availability</button>
</div>
```

Üst sinyaller değiştiğinde, alt bileşen otomatik olarak yeni değerleri alır ve görüntüler!
</docs-step>

</docs-workflow>

Mükemmel! Sinyal input'larının nasıl çalıştığını öğrendiniz:

- **Sinyal input'ları** - Üst bileşenlerden veri almak için `input()` ve `input.required()` kullanın
- **Reaktif güncellemeler** - Üst sinyal değerleri değiştiğinde alt bileşenler otomatik olarak güncellenir
- **Tür güvenliği** - Sinyal input'ları tam TypeScript tür denetimi sağlar
- **Varsayılan değerler** - İsteğe bağlı input'ların varsayılan değerleri olabilirken, zorunlu input'ların sağlanması gerekir

Sinyal input'ları bileşen iletişimini daha reaktif hale getirir ve birçok durumda `OnChanges` yaşam döngüsü kancalarına olan ihtiyacı ortadan kaldırır.

Bir sonraki derste, [model sinyalleri ile iki yönlü bağlamayı](/tutorials/signals/6-two-way-binding-with-model-signals) öğreneceksiniz!
