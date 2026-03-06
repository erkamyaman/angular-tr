# NgStyle'dan stil bağlamalarına geçiş

Bu şematik, uygulamanızdaki NgStyle direktifi kullanımlarını stil bağlamalarına geçirir.
Yalnızca geçirilmesi güvenli kabul edilen kullanımları geçirecektir.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```bash
ng generate @angular/core:ngstyle-to-style
```

#### Önce

```html
<div [ngStyle]="{'background-color': 'red'}"></div>
```

#### Sonra

```html
<div [style]="{'background-color': 'red'}"></div>
```

## Yapılandırma seçenekleri

Geçiş, belirli ihtiyaçlarınıza göre ince ayar yapmak için birkaç seçeneği destekler.

### `--best-effort-mode`

Varsayılan olarak, geçiş `NgStyle`'ın nesne referansı kullanımlarını geçirmekten kaçınır.
`--best-effort-mode` bayrağı etkinleştirildiğinde, nesne referanslarına bağlı `ngStyle` örnekleri de geçirilir.
Bu, geçirilmesi güvenli olmayabilir, örneğin bağlı nesne değiştiriliyorsa.

```html
<div [ngStyle]="styleObject"></div>
```

şuna dönüşür:

```html
<div [style]="styleObject"></div>
```
