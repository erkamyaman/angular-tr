<docs-decorative-header title="Combobox">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" title="Combobox ARIA pattern"/>
  <docs-pill href="/api?query=combobox#angular_aria_combobox" title="Combobox API Reference"/>
</docs-pill-row>

## Genel Bakış

Bir metin girişi ile bir açılır pencereyi koordine eden, otomatik tamamlama, select ve multiselect kalıpları için temel yönerge sağlayan yönerge.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Kullanım

Combobox, bir metin girişi ile bir açılır pencereyi koordine eden temel yönergedir. Otomatik tamamlama, select ve multiselect kalıpları için temel oluşturur. Şu durumlarda combobox'ı doğrudan kullanmayı düşünün:

- **Özel otomatik tamamlama kalıpları oluşturma** - Özelleştirilmiş filtreleme veya öneri davranışı oluşturma
- **Özel seçim bileşenleri oluşturma** - Benzersiz gereksinimleri olan açılır menüler geliştirme
- **Girişi açılır pencereyle koordine etme** - Metin girişini listbox, tree veya dialog içeriğiyle eşleştirme
- **Belirli filtre modları uygulama** - Manuel, otomatik seçim veya vurgulama davranışları kullanma

Bunun yerine belgelendirilmiş kalıpları kullanın:

- Filtrelemeli standart otomatik tamamlama gerektiğinde - Kullanıma hazır örnekler için [Autocomplete kalıbına](guide/aria/autocomplete) bakın
- Tek seçimli açılır menüler gerektiğinde - Eksiksiz açılır menü uygulaması için [Select kalıbına](guide/aria/select) bakın
- Çoklu seçimli açılır menüler gerektiğinde - Kompakt görüntüyle çoklu seçim için [Multiselect kalıbına](guide/aria/multiselect) bakın

NOTE: [Autocomplete](guide/aria/autocomplete), [Select](guide/aria/select) ve [Multiselect](guide/aria/multiselect) rehberleri, bu yönergeyi belirli kullanım durumları için [Listbox](guide/aria/listbox) ile birleştiren belgelendirilmiş kalıpları gösterir.

## Özellikler

Angular'ın combobox'ı, tam erişilebilir bir giriş-açılır pencere koordinasyon sistemi sağlar:

- **Açılır Pencereli Metin Girişi** - Giriş alanını açılır pencere içeriğiyle koordine eder
- **Üç Filtre Modu** - Manuel, otomatik seçim veya vurgulama davranışları
- **Klavye Navigasyonu** - Ok tuşları, Enter, Escape işlemesi
- **Ekran Okuyucu Desteği** - role="combobox" ve aria-expanded dahil yerleşik ARIA nitelikleri
- **Açılır Pencere Yönetimi** - Kullanıcı etkileşimine dayalı otomatik göster/gizle
- **Sinyal Tabanlı Reaktivite** - Angular sinyalleri kullanan reaktif durum yönetimi

## Örnekler

### Otomatik Tamamlama

Kullanıcılar yazarken seçenekleri filtreleyen ve öneren, bir listeden değer bulmalarına ve seçmelerine yardımcı olan erişilebilir bir giriş alanı.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`filterMode="manual"` ayarı filtreleme ve seçim üzerinde tam kontrol sağlar. Giriş, seçenekler listesini filtreleyen bir sinyali günceller. Kullanıcılar ok tuşlarıyla gezinir ve Enter veya tıklama ile seçer. Bu mod, özel filtreleme mantığı için en fazla esnekliği sağlar. Eksiksiz filtreleme kalıpları ve örnekleri için [Autocomplete rehberine](guide/aria/autocomplete) bakın.

### Salt Okunur Modu

Tek seçimli açılır menüler oluşturmak için klavye navigasyonu ve ekran okuyucu desteği ile salt okunur combobox'ı listbox ile birleştiren bir kalıp.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`readonly` niteliği giriş alanına yazmayı engeller. Açılır pencere tıklama veya ok tuşlarıyla açılır. Kullanıcılar klavye ile seçenekler arasında gezinir ve Enter veya tıklama ile seçer.

Bu yapılandırma, [Select](guide/aria/select) ve [Multiselect](guide/aria/multiselect) kalıpları için temeli sağlar. Tetikleyiciler ve katman konumlandırmasıyla eksiksiz açılır menü uygulamaları için bu rehberlere bakın.

### Dialog Açılır Penceresi

Açılır pencereler bazen arka plan ve odak yakalama ile modal davranışa ihtiyaç duyar. Combobox dialog yönergesi, özelleştirilmiş kullanım durumları için bu kalıbı sağlar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`ngComboboxDialog` yönergesi, yerel dialog elemanını kullanarak modal bir açılır pencere oluşturur. Bu, arka plan davranışı ve odak yakalama sağlar. Seçim arayüzü modal etkileşim gerektirdiğinde veya açılır pencere içeriği tam ekran odak gerektirecek kadar karmaşık olduğunda dialog açılır pencerelerini kullanın.

## API'ler

### Combobox Yönergesi

`ngCombobox` yönergesi bir metin girişini bir açılır pencereyle koordine eder.

#### Girdiler

| Property         | Type                                           | Default    | Description                                            |
| ---------------- | ---------------------------------------------- | ---------- | ------------------------------------------------------ |
| `filterMode`     | `'manual'` \| `'auto-select'` \| `'highlight'` | `'manual'` | Seçim davranışını kontrol eder                         |
| `disabled`       | `boolean`                                      | `false`    | Combobox'ı devre dışı bırakır                          |
| `readonly`       | `boolean`                                      | `false`    | Combobox'ı salt okunur yapar (Select/Multiselect için) |
| `firstMatch`     | `V`                                            | -          | Otomatik seçim için ilk eşleşen öğenin değeri          |
| `alwaysExpanded` | `boolean`                                      | `false`    | Açılır pencereyi her zaman açık tutar                  |

**Filtre Modları:**

- **`'manual'`** - Kullanıcı filtreleme ve seçimi açıkça kontrol eder. Açılır pencere, filtreleme mantığınıza göre seçenekleri gösterir. Kullanıcılar Enter veya tıklama ile seçer. Bu mod en fazla esnekliği sağlar.
- **`'auto-select'`** - Giriş değeri, kullanıcılar yazarken otomatik olarak ilk eşleşen seçeneğe güncellenir. Koordinasyon için `firstMatch` girişi gerektirir. Örnekler için [Autocomplete rehberine](guide/aria/autocomplete#otomatik-seçim-modu) bakın.
- **`'highlight'`** - Giriş değerini değiştirmeden eşleşen metni vurgular. Kullanıcılar ok tuşlarıyla gezinir ve Enter ile seçer.

#### Sinyaller

| Property   | Type              | Description                                  |
| ---------- | ----------------- | -------------------------------------------- |
| `expanded` | `Signal<boolean>` | Açılır pencerenin şu anda açık olup olmadığı |

#### Metodlar

| Method     | Parameters | Description           |
| ---------- | ---------- | --------------------- |
| `open`     | none       | Combobox'ı açar       |
| `close`    | none       | Combobox'ı kapatır    |
| `expand`   | none       | Combobox'ı genişletir |
| `collapse` | none       | Combobox'ı daraltır   |

### ComboboxInput Yönergesi

`ngComboboxInput` yönergesi bir giriş elemanını combobox'a bağlar.

#### Model

| Property | Type     | Description                                           |
| -------- | -------- | ----------------------------------------------------- |
| `value`  | `string` | `[(value)]` kullanılarak iki yönlü bağlanabilir değer |

Giriş elemanı klavye işlemesi ve ARIA niteliklerini otomatik olarak alır.

### ComboboxPopup Yönergesi

`ngComboboxPopup` yönergesi (ana yönerge) açılır pencere görünürlüğünü ve koordinasyonunu yönetir. Tipik olarak bir `ng-template` içinde `ngComboboxPopupContainer` ile veya CDK Overlay ile kullanılır.

### ComboboxPopupContainer Yönergesi

`ngComboboxPopupContainer` yönergesi bir `ng-template`'i açılır pencere içeriği olarak işaretler.

```html
<ng-template ngComboboxPopupContainer>
  <div ngListbox>...</div>
</ng-template>
```

Konumlandırma için Popover API veya CDK Overlay ile kullanılır.

### ComboboxDialog Yönergesi

`ngComboboxDialog` yönergesi modal bir combobox açılır penceresi oluşturur.

```html
<dialog ngComboboxDialog>
  <div ngListbox>...</div>
</dialog>
```

Arka plan ve odak yakalama ile modal açılır pencere davranışı için kullanın.

### İlgili Kalıplar ve Yönergeler

Combobox, bu belgelendirilmiş kalıplar için temel yönergedir:

- **[Autocomplete](guide/aria/autocomplete)** - Filtreleme ve öneriler kalıbı (Combobox'ı filtre modlarıyla kullanır)
- **[Select](guide/aria/select)** - Tek seçim açılır menü kalıbı (Combobox'ı `readonly` ile kullanır)
- **[Multiselect](guide/aria/multiselect)** - Çoklu seçim kalıbı (Combobox'ı `readonly` + çoklu etkin Listbox ile kullanır)

Combobox tipik olarak şunlarla birleştirilir:

- **[Listbox](guide/aria/listbox)** - En yaygın açılır pencere içeriği
- **[Tree](guide/aria/tree)** - Hiyerarşik açılır pencere içeriği (örnekler için Tree rehberine bakın)
