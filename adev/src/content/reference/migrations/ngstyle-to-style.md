# NgStyle'dan stil bağlamalarına geçiş

Bu şematik, uygulamanızdaki NgStyle direktifi kullanımlarını stil bağlamalarına geçirir.
Yalnızca geçirilmesi güvenli kabul edilen kullanımları geçirecektir.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```bash
ng generate @angular/core:ngstyle-to-style
```

Tek anahtarlı bir nesne, yalnızca o stil özelliğine yapılan bir bağlamaya dönüşür.

#### Önce

```html
<div [ngStyle]="{'background-color': 'red'}"></div>
```

#### Sonra

```html
<div [style.background-color]="'red'"></div>
```

Birden fazla anahtarı olan bir nesne, tek bir `[style]` bağlamasına dönüşür.

#### Önce {#multiple-keys-before}

```html
<div [ngStyle]="{'color': 'blue', 'font-weight': 'bold'}"></div>
```

#### Sonra {#multiple-keys-after}

```html
<div [style]="{'color': 'blue', 'font-weight': 'bold'}"></div>
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
