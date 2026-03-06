<docs-decorative-header title="Grid">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/" title="Grid ARIA pattern"/>
  <docs-pill href="/api?query=grid#angular_aria_grid" title="Grid API Reference"/>
</docs-pill-row>

## Genel Bakış

Bir grid, kullanıcıların yönlü ok tuşları, Home, End ve Page Up/Down kullanarak iki boyutlu veriler veya etkileşimli elemanlar arasında gezinmesini sağlar. Gridler veri tabloları, takvimler, hesap tabloları ve ilişkili etkileşimli elemanları gruplayan yerleşim kalıpları için çalışır.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.css"/>
</docs-code-multifile>

## Kullanım

Gridler, satırlar ve sütunlar halinde düzenlenmiş ve kullanıcıların birden fazla yönde klavye navigasyonuna ihtiyaç duydukları veriler veya etkileşimli elemanlar için iyi çalışır.

**Grid kullanın:**

- Düzenlenebilir veya seçilebilir hücrelere sahip etkileşimli veri tabloları oluştururken
- Takvim veya tarih seçiciler oluştururken
- Hesap tablosu benzeri arayüzler uygularken
- Bir sayfadaki sekme duraklarını azaltmak için etkileşimli elemanları (butonlar, onay kutuları) gruplarken
- İki boyutlu klavye navigasyonu gerektiren arayüzler oluştururken

**Gridlerden kaçının:**

- Basit salt okunur tablolar gösterirken (bunun yerine semantik HTML `<table>` kullanın)
- Tek sütunlu listeler gösterirken (bunun yerine [Listbox](guide/aria/listbox) kullanın)
- Hiyerarşik veri gösterirken (bunun yerine [Tree](guide/aria/tree) kullanın)
- Tablo yerleşimi olmayan formlar oluştururken (standart form kontrolleri kullanın)

## Özellikler

- **İki boyutlu navigasyon** - Ok tuşları tüm yönlerde hücreler arasında hareket eder
- **Odak modları** - Dolaşan tabindex veya activedescendant odak stratejileri arasında seçim yapın
- **Seçim desteği** - Tekli veya çoklu seçim modlarıyla isteğe bağlı hücre seçimi
- **Sarma davranışı** - Grid kenarlarında navigasyonun nasıl sarılacağını yapılandırın (sürekli, döngü veya sarmasız)
- **Aralık seçimi** - Değiştirici tuşlar veya sürüklemeyle birden fazla hücre seçin
- **Devre dışı durumlar** - Tüm gridi veya bireysel hücreleri devre dışı bırakın
- **RTL desteği** - Otomatik sağdan sola dil navigasyonu

## Örnekler

### Veri Tablosu Gridi

Kullanıcıların ok tuşlarıyla hücreler arasında gezinmesi gereken etkileşimli tablolar için grid kullanın. Bu örnek, klavye navigasyonlu temel bir veri tablosunu gösterir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/table/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/table/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`ngGrid` yönergesini tablo elemanına, `ngGridRow`'u her satıra ve `ngGridCell`'i her hücreye uygulayın.

### Takvim Gridi

Takvimler, gridler için yaygın bir kullanım durumudur. Bu örnek, kullanıcıların ok tuşlarıyla tarihler arasında gezdiği bir ay görünümünü gösterir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Kullanıcılar bir hücreye odaklandığında Enter veya Boşluk tuşuna basarak bir tarihi etkinleştirebilir.

### Yerleşim Gridi

Etkileşimli elemanları gruplamak ve sekme duraklarını azaltmak için yerleşim gridi kullanın. Bu örnek, hap butonlarından oluşan bir gridi gösterir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Her buton arasında sekme tuşuna basmak yerine, kullanıcılar ok tuşlarıyla gezinir ve yalnızca bir buton sekme odağını alır.

### Seçim ve Odak Modları

`[enableSelection]="true"` ile seçimi etkinleştirin ve odak ile seçimin nasıl etkileşeceğini yapılandırın.

```angular-html
<table
  ngGrid
  [enableSelection]="true"
  [selectionMode]="'explicit'"
  [multi]="true"
  [focusMode]="'roving'"
>
  <tr ngGridRow>
    <td ngGridCell>Cell 1</td>
    <td ngGridCell>Cell 2</td>
  </tr>
</table>
```

**Seçim modları:**

- `follow`: Odaklanan hücre otomatik olarak seçilir
- `explicit`: Kullanıcılar hücreleri Boşluk veya tıklama ile seçer

**Odak modları:**

- `roving`: Odak, `tabindex` kullanılarak hücrelere hareket eder (basit gridler için daha iyidir)
- `activedescendant`: Odak grid kapsayıcısında kalır, `aria-activedescendant` aktif hücreyi gösterir (sanal kaydırma için daha iyidir)

## API'ler

### Grid

Satırlar ve hücreler için klavye navigasyonu ve odak yönetimi sağlayan kapsayıcı yönerge.

#### Girdiler

| Property               | Type                                 | Default    | Description                                                                    |
| ---------------------- | ------------------------------------ | ---------- | ------------------------------------------------------------------------------ |
| `enableSelection`      | `boolean`                            | `false`    | Grid için seçimin etkin olup olmadığı                                          |
| `disabled`             | `boolean`                            | `false`    | Tüm gridi devre dışı bırakır                                                   |
| `softDisabled`         | `boolean`                            | `true`     | `true` olduğunda, devre dışı hücreler odaklanabilir ancak etkileşimli değildir |
| `focusMode`            | `'roving' \| 'activedescendant'`     | `'roving'` | Grid tarafından kullanılan odak stratejisi                                     |
| `rowWrap`              | `'continuous' \| 'loop' \| 'nowrap'` | `'loop'`   | Satırlar boyunca navigasyon sarma davranışı                                    |
| `colWrap`              | `'continuous' \| 'loop' \| 'nowrap'` | `'loop'`   | Sütunlar boyunca navigasyon sarma davranışı                                    |
| `multi`                | `boolean`                            | `false`    | Birden fazla hücrenin seçilebilip seçilemeyeceği                               |
| `selectionMode`        | `'follow' \| 'explicit'`             | `'follow'` | Seçimin odağı takip edip etmediği veya açık eylem gerektirip gerektirmediği    |
| `enableRangeSelection` | `boolean`                            | `false`    | Değiştirici tuşlar veya sürüklemeyle aralık seçimlerini etkinleştirir          |

### GridRow

Bir grid içindeki bir satırı temsil eder ve grid hücreleri için kapsayıcı görevi görür.

#### Girdiler

| Property   | Type     | Default | Description                      |
| ---------- | -------- | ------- | -------------------------------- |
| `rowIndex` | `number` | auto    | Bu satırın grid içindeki indeksi |

### GridCell

Bir grid satırındaki bireysel bir hücreyi temsil eder.

#### Girdiler

| Property      | Type                         | Default        | Description                                                 |
| ------------- | ---------------------------- | -------------- | ----------------------------------------------------------- |
| `id`          | `string`                     | auto           | Hücre için benzersiz tanımlayıcı                            |
| `role`        | `string`                     | `'gridcell'`   | Hücre rolü: `gridcell`, `columnheader` veya `rowheader`     |
| `disabled`    | `boolean`                    | `false`        | Bu hücreyi devre dışı bırakır                               |
| `selected`    | `boolean`                    | `false`        | Hücrenin seçili olup olmadığı (iki yönlü bağlama destekler) |
| `selectable`  | `boolean`                    | `true`         | Hücrenin seçilebilir olup olmadığı                          |
| `rowSpan`     | `number`                     | —              | Hücrenin kapladığı satır sayısı                             |
| `colSpan`     | `number`                     | —              | Hücrenin kapladığı sütun sayısı                             |
| `rowIndex`    | `number`                     | —              | Hücrenin satır indeksi                                      |
| `colIndex`    | `number`                     | —              | Hücrenin sütun indeksi                                      |
| `orientation` | `'vertical' \| 'horizontal'` | `'horizontal'` | Hücre içindeki widget'lar için yön                          |
| `wrap`        | `boolean`                    | `true`         | Widget navigasyonunun hücre içinde sarılıp sarılmadığı      |

#### Sinyaller

| Property | Type              | Description                           |
| -------- | ----------------- | ------------------------------------- |
| `active` | `Signal<boolean>` | Hücrenin şu anda odakta olup olmadığı |
