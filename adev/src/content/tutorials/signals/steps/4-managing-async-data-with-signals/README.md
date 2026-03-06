# Managing async data with signals using the Resources API

Artık [bağlantılı sinyallerle durum türetmeyi](/tutorials/signals/3-deriving-state-with-linked-signals) öğrendiğinize göre, Resource API ile asenkron verileri nasıl yöneteceğinizi keşfedelim. Resource API, yerleşik yükleme durumları, hata yönetimi ve istek yönetimi ile sinyalleri kullanarak asenkron işlemleri yönetmenin güçlü bir yolunu sağlar.

Bu aktivitede, verileri asenkron olarak yüklemek için `resource()` fonksiyonunu ve Resource API'yi çalışırken gösteren bir kullanıcı profili yükleyicisi oluşturarak asenkron işlemlerin farklı durumlarını nasıl yöneteceğinizi öğreneceksiniz.

<hr />

<docs-workflow>

<docs-step title="resource fonksiyonunu ve API'yi içe aktarın">
Mevcut içe aktarmalarınıza `resource` ekleyin ve sahte API fonksiyonunu içe aktarın.

```ts
// Add resource to existing imports
import {Component, signal, computed, resource, ChangeDetectionStrategy} from '@angular/core';
// Import mock API function
import {getUserData} from './user-api';
```

</docs-step>

<docs-step title="Kullanıcı verileri için bir resource oluşturun">
Bileşen sınıfında, bir kullanıcı kimliği sinyaline dayalı olarak kullanıcı verilerini yükleyen bir resource oluşturan bir özellik ekleyin.

```ts
userId = signal(1);

userResource = resource({
  params: () => ({id: this.userId()}),
  loader: (params) => getUserData(params.params.id),
});
```

</docs-step>

<docs-step title="Resource ile etkileşim kurmak için metotlar ekleyin">
Kullanıcı kimliğini değiştirmek ve resource'u yeniden yüklemek için metotlar ekleyin.

```ts
loadUser(id: number) {
  this.userId.set(id);
}

reloadUser() {
  this.userResource.reload();
}
```

Params sinyalini değiştirmek otomatik olarak yeniden yüklemeyi tetikler veya `reload()` ile manuel olarak yeniden yükleyebilirsiniz.
</docs-step>

<docs-step title="Resource durumları için computed sinyaller oluşturun">
Resource'un farklı durumlarına erişmek için computed sinyaller ekleyin.

```ts
isLoading = computed(() => this.userResource.status() === 'loading');
hasError = computed(() => this.userResource.status() === 'error');
```

Resource'lar; 'loading', 'success' veya 'error' olabilen bir `status()` sinyali, yüklenen veriler için bir `value()` sinyali ve verinin mevcut olup olmadığını güvenle kontrol eden bir `hasValue()` metodu sağlar.
</docs-step>

<docs-step title="Düğmeleri bağlayın ve resource durumlarını görüntüleyin">
Şablon yapısı zaten sağlanmış. Şimdi her şeyi bağlayın:

Bölüm 1. **Düğmelere tıklama işleyicileri ekleyin:**

```html
<button (click)="loadUser(1)">Load User 1</button>
<button (click)="loadUser(2)">Load User 2</button>
<button (click)="loadUser(999)">Load Invalid User</button>
<button (click)="reloadUser()">Reload</button>
```

Bölüm 2. **Yer tutucuyu resource durum yönetimi ile değiştirin:**

```angular-html
@if (isLoading()) {
  <p>Loading user...</p>
} @else if (hasError()) {
  <p class="error">Error: {{ userResource.error()?.message }}</p>
} @else if (userResource.hasValue()) {
  <div class="user-info">
    <h3>{{ userResource.value().name }}</h3>
    <p>{{ userResource.value().email }}</p>
  </div>
}
```

Resource, durumunu kontrol etmek için farklı metotlar sağlar:

- `isLoading()` - veri getirilirken true
- `hasError()` - bir hata oluştuğunda true
- `userResource.hasValue()` - veri mevcut olduğunda true
- `userResource.value()` - yüklenen verilere erişim
- `userResource.error()` - hata bilgisine erişim

</docs-step>

</docs-workflow>

Mükemmel! Artık sinyallerle Resource API'yi nasıl kullanacağınızı öğrendiniz. Hatırlanması gereken temel kavramlar:

- **Resource'lar reaktiftir**: Parametreler değiştiğinde otomatik olarak yeniden yüklenir
- **Yerleşik durum yönetimi**: Resource'lar `status()`, `value()` ve `error()` sinyalleri sağlar
- **Otomatik temizleme**: Resource'lar istek iptalini ve temizliği otomatik olarak yönetir
- **Manuel kontrol**: Gerektiğinde istekleri manuel olarak yeniden yükleyebilir veya iptal edebilirsiniz

Bir sonraki derste, [input sinyalleri ile bileşenlere veri aktarmayı](/tutorials/signals/5-component-communication-with-signals) öğreneceksiniz!
