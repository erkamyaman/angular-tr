# Migration from NgStyle to style bindings

Bu şematik, uygulamanızdaki NgStyle direktifi kullanımlarını stil bağlamalarına geçirir.
Yalnızca geçirilmesi güvenli kabul edilen kullanımları geçirecektir.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```bash
ng generate @angular/core:ngstyle-to-style
```

#### Before

```html
<div [ngStyle]="{'background-color': 'red'}"></div>
```

#### After

```html
<div [style]="{'background-color': 'red'}"></div>
```

## Configuration options

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
