<docs-decorative-header title="Grid">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/" title="Grid ARIA pattern"/>
  <docs-pill href="/api?query=grid#angular_aria_grid" title="Grid API Reference"/>
</docs-pill-row>

## Overview

Bir grid, kullanicilarin yonlu ok tuslari, Home, End ve Page Up/Down kullanarak iki boyutlu veriler veya etkilesimli elemanlar arasinda gezinmesini saglar. Gridler veri tablolari, takvimler, hesap tablolari ve iliskili etkilesimli elemanlari gruplayan yerlesim kaliplari icin calisir.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.css"/>
</docs-code-multifile>

## Usage

Gridler, satirlar ve sutunlar halinde duzenlenmis ve kullanicilarin birden fazla yonde klavye navigasyonuna ihtiyac duyduklari veriler veya etkilesimli elemanlar icin iyi calisir.

**Grid kullanin:**

- Duzenlenebilir veya secilebilir hucrelere sahip etkilesimli veri tablolari olustururken
- Takvim veya tarih seciciler olustururken
- Hesap tablosu benzeri arayuzler uygularken
- Bir sayfadaki sekme duraklarini azaltmak icin etkilesimli elemanlari (butonlar, onay kutulari) gruplarken
- Iki boyutlu klavye navigasyonu gerektiren arayuzler olustururken

**Gridlerden kacinin:**

- Basit salt okunur tablolar gosterirken (bunun yerine semantik HTML `<table>` kullanin)
- Tek sutunlu listeler gosterirken (bunun yerine [Listbox](guide/aria/listbox) kullanin)
- Hiyerarsik veri gosterirken (bunun yerine [Tree](guide/aria/tree) kullanin)
- Tablo yerlesimi olmayan formlar olustururken (standart form kontrolleri kullanin)

## Features

- **Iki boyutlu navigasyon** - Ok tuslari tum yonlerde hucreler arasinda hareket eder
- **Odak modlari** - Dolasan tabindex veya activedescendant odak stratejileri arasinda secim yapin
- **Secim destegi** - Tekli veya coklu secim modlariyla istege bagli hucre secimi
- **Sarma davranisi** - Grid kenarlarinda navigasyonun nasil sarilacagini yapilandirin (surekli, dongu veya sarmasiz)
- **Aralik secimi** - Degistirici tuslar veya suruklemeuyle birden fazla hucre secin
- **Devre disi durumlar** - Tum gridi veya bireysel hucreleri devre disi birakin
- **RTL destegi** - Otomatik sagdan sola dil navigasyonu

## Examples

### Data table grid

Kullanicilarin ok tuslariyla hucreler arasinda gezinmesi gereken etkilesimli tablolar icin grid kullanin. Bu ornek, klavye navigasyonlu temel bir veri tablosunu gosterir.

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

`ngGrid` yonergesini tablo elemanina, `ngGridRow`'u her satira ve `ngGridCell`'i her hucreye uygulayin.

### Calendar grid

Takvimler, gridler icin yaygin bir kullanim durumudur. Bu ornek, kullanicilarin ok tuslariyla tarihler arasinda gezdigi bir ay gorunumunu gosterir.

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

Kullanicilar bir hucreye odaklandiginda Enter veya Bosluk tusuna basarak bir tarihi etkinlestirebilir.

### Layout grid

Etkilesimli elemanlari gruplamak ve sekme duraklarini azaltmak icin yerlesim gridi kullanin. Bu ornek, hap butonlarindan olusan bir gridi gosterir.

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

Her buton arasinda sekme tusuna basmak yerine, kullanicilar ok tuslariyla gezinir ve yalnizca bir buton sekme odagini alir.

### Selection and focus modes

`[enableSelection]="true"` ile secimi etkinlestirin ve odak ile secimin nasil etkilesecegini yapilandirin.

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

**Secim modlari:**

- `follow`: Odaklanan hucre otomatik olarak secilir
- `explicit`: Kullanicilar hucreleri Bosluk veya tiklama ile secer

**Odak modlari:**

- `roving`: Odak, `tabindex` kullanilarak hucrelere hareket eder (basit gridler icin daha iyidir)
- `activedescendant`: Odak grid kapsayicisinda kalir, `aria-activedescendant` aktif hucreyi gosterir (sanal kaydirma icin daha iyidir)

## APIs

### Grid

Satirlar ve hucreler icin klavye navigasyonu ve odak yonetimi saglayan kapsayici yonerge.

#### Inputs

| Property               | Type                                 | Default    | Description                                                                    |
| ---------------------- | ------------------------------------ | ---------- | ------------------------------------------------------------------------------ |
| `enableSelection`      | `boolean`                            | `false`    | Grid icin secimin etkin olup olmadigi                                          |
| `disabled`             | `boolean`                            | `false`    | Tum gridi devre disi birakir                                                   |
| `softDisabled`         | `boolean`                            | `true`     | `true` oldugunda, devre disi hucreler odaklanabilir ancak etkilesimli degildir |
| `focusMode`            | `'roving' \| 'activedescendant'`     | `'roving'` | Grid tarafindan kullanilan odak stratejisi                                     |
| `rowWrap`              | `'continuous' \| 'loop' \| 'nowrap'` | `'loop'`   | Satirlar boyunca navigasyon sarma davranisi                                    |
| `colWrap`              | `'continuous' \| 'loop' \| 'nowrap'` | `'loop'`   | Sutunlar boyunca navigasyon sarma davranisi                                    |
| `multi`                | `boolean`                            | `false`    | Birden fazla hucrenin secilebilip secilemeyecegi                               |
| `selectionMode`        | `'follow' \| 'explicit'`             | `'follow'` | Secimin odagi takip edip etmedigi veya acik eylem gerektirip gerektirmedigi    |
| `enableRangeSelection` | `boolean`                            | `false`    | Degistirici tuslar veya suruklemeuyle aralik secimlerini etkinlestirir         |

### GridRow

Bir grid icindeki bir satiri temsil eder ve grid hucreleri icin kapsayici gorevi gorur.

#### Inputs

| Property   | Type     | Default | Description                      |
| ---------- | -------- | ------- | -------------------------------- |
| `rowIndex` | `number` | auto    | Bu satirin grid icindeki indeksi |

### GridCell

Bir grid satirindaki bireysel bir hucreyi temsil eder.

#### Inputs

| Property      | Type                         | Default        | Description                                                 |
| ------------- | ---------------------------- | -------------- | ----------------------------------------------------------- |
| `id`          | `string`                     | auto           | Hucre icin benzersiz tanimlayici                            |
| `role`        | `string`                     | `'gridcell'`   | Hucre rolu: `gridcell`, `columnheader` veya `rowheader`     |
| `disabled`    | `boolean`                    | `false`        | Bu hucreyi devre disi birakir                               |
| `selected`    | `boolean`                    | `false`        | Hucrenin secili olup olmadigi (iki yonlu baglama destekler) |
| `selectable`  | `boolean`                    | `true`         | Hucrenin secilebilir olup olmadigi                          |
| `rowSpan`     | `number`                     | —              | Hucrenin kapladigi satir sayisi                             |
| `colSpan`     | `number`                     | —              | Hucrenin kapladigi sutun sayisi                             |
| `rowIndex`    | `number`                     | —              | Hucrenin satir indeksi                                      |
| `colIndex`    | `number`                     | —              | Hucrenin sutun indeksi                                      |
| `orientation` | `'vertical' \| 'horizontal'` | `'horizontal'` | Hucre icindeki widget'lar icin yon                          |
| `wrap`        | `boolean`                    | `true`         | Widget navigasyonunun hucre icinde sarilip sarilmadigi      |

#### Signals

| Property | Type              | Description                           |
| -------- | ----------------- | ------------------------------------- |
| `active` | `Signal<boolean>` | Hucrenin su anda odakta olup olmadigi |
