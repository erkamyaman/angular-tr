# Query child elements with signal queries

Artık [sinyalleri direktiflerle nasıl kullanacağınızı](/tutorials/signals/8-using-signals-with-directives) öğrendiğinize göre, sinyal tabanlı sorgu API'lerini keşfedelim. Bunlar, alt bileşenlere ve direktiflere erişmenin ve onlarla etkileşim kurmanın reaktif bir yolunu sağlar. Hem bileşenler hem de direktifler sorgu yapabilirken aynı zamanda kendileri de sorgulanabilir. Geleneksel ViewChild'ın aksine, sinyal sorguları otomatik olarak güncellenir ve alt bileşenlere ve direktiflere tür güvenli erişim sağlar.

Bu aktivitede, alt bileşenlerle programatik olarak etkileşim kurmak için viewChild sorguları ekleyeceksiniz.

<hr />

<docs-workflow>

<docs-step title="Add viewChild import">
Önce, `app.ts` dosyasında alt bileşenlere erişmek için `viewChild` içe aktarmasını ekleyin.

```ts
import {Component, signal, computed, viewChild, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="Create viewChild queries">
Alt bileşenlere erişmek için App bileşenine viewChild sorguları ekleyin.

```ts
// Query APIs to access child components
firstProduct = viewChild(ProductCard);
cartSummary = viewChild(CartSummary);
```

Bu sorgular, alt bileşen örneklerine referans veren sinyaller oluşturur.
</docs-step>

<docs-step title="Implement parent methods">
`app.ts` dosyasında alt bileşenler üzerinde metotları çağırmak için viewChild sorgularını kullanın:

```ts
showFirstProductDetails() {
  const product = this.firstProduct();
  if (product) {
    product.highlight();
  }
}

initiateCheckout() {
  const summary = this.cartSummary();
  if (summary) {
    summary.initiateCheckout();
  }
}
```

</docs-step>

<docs-step title="Test the interactions">
Kontrol düğmeleri artık çalışmalıdır:

- **"Show First Product Details"** - ProductCard üzerinde `highlight()` çağırır
- **"Initiate Checkout"** - CartSummary üzerinde `initiateCheckout()` çağırır

Düğmelere tıklayarak viewChild sorgularının üst bileşenlerin alt bileşen davranışını nasıl kontrol ettiğini görün.
</docs-step>

</docs-workflow>

Mükemmel! Alt bileşen etkileşimi için sinyal tabanlı sorgu API'lerini nasıl kullanacağınızı öğrendiniz:

Bir sonraki derste, [sinyal değişikliklerine effect ile nasıl tepki verileceğini](/tutorials/signals/10-reacting-to-signal-changes-with-effect) öğreneceksiniz!
