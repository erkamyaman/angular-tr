# Migration from NgClass to class bindings

Bu şematik, uygulamanızdaki NgClass direktifi kullanımlarını sınıf bağlamalarına geçirir.
Yalnızca geçirilmesi güvenli kabul edilen kullanımları geçirecektir.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```bash
ng generate @angular/core:ngclass-to-class
```

#### Before

```html
<div [ngClass]="{admin: isAdmin, dense: density === 'high'}"></div>
```

#### After

```html
<div [class]="{admin: isAdmin, dense: density === 'high'}"></div>
```

## Configuration options

Geçiş, belirli ihtiyaçlarınıza göre ince ayar yapmak için birkaç seçeneği destekler.

### `--migrate-space-separated-key`

Varsayılan olarak, geçiş nesne literal anahtarlarının boşlukla ayrılmış sınıf adları içerdiği `NgClass` kullanımlarını geçirmekten kaçınır.
--migrate-space-separated-key bayrağı etkinleştirildiğinde, her bir anahtar için ayrı bir bağlama oluşturulur.

```html
<div [ngClass]="{'class1 class2': condition}"></div>
```

şuna dönüşür:

```html
<div [class.class1]="condition" [class.class2]="condition"></div>
```
