<docs-decorative-header title="Combobox">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" title="Combobox ARIA pattern"/>
  <docs-pill href="/api?query=combobox#angular_aria_combobox" title="Combobox API Reference"/>
</docs-pill-row>

## Overview

Bir metin girisi ile bir acilir pencereyi koordine eden, otomatik tamamlama, select ve multiselect kaliplari icin temel yonerge saglayan yonerge.

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

## Usage

Combobox, bir metin girisi ile bir acilir pencereyi koordine eden temel yonergedir. Otomatik tamamlama, select ve multiselect kaliplari icin temel olusturur. Su durumlarda combobox'i dogrudan kullanmayi dusunun:

- **Ozel otomatik tamamlama kaliplari olusturma** - Ozellestirilmis filtreleme veya oneri davranisi olusturma
- **Ozel secim bilesenleri olusturma** - Benzersiz gereksinimleri olan acilir menuler gelistirme
- **Girisi acilir pencereyle koordine etme** - Metin girisini listbox, tree veya dialog icerigiyle eslestirme
- **Belirli filtre modlari uygulama** - Manuel, otomatik secim veya vurgulama davranislari kullanma

Bunun yerine belgelendirilmis kaliplari kullanin:

- Filtrelemeli standart otomatik tamamlama gerektiginde - Kullanima hazir ornekler icin [Autocomplete kalibina](guide/aria/autocomplete) bakin
- Tek secimli acilir menuler gerektiginde - Eksiksiz acilir menu uygulamasi icin [Select kalibina](guide/aria/select) bakin
- Coklu secimli acilir menuler gerektiginde - Kompakt goruntuyle coklu secim icin [Multiselect kalibina](guide/aria/multiselect) bakin

NOTE: [Autocomplete](guide/aria/autocomplete), [Select](guide/aria/select) ve [Multiselect](guide/aria/multiselect) rehberleri, bu yonergeyi belirli kullanim durumlari icin [Listbox](guide/aria/listbox) ile birlestiren belgelendirilmis kaliplari gosterir.

## Features

Angular'in combobox'i, tam erisilebilir bir giris-acilir pencere koordinasyon sistemi saglar:

- **Acilir Pencereli Metin Girisi** - Giris alanini acilir pencere icerigiyle koordine eder
- **Uc Filtre Modu** - Manuel, otomatik secim veya vurgulama davranislari
- **Klavye Navigasyonu** - Ok tuslari, Enter, Escape islemesi
- **Ekran Okuyucu Destegi** - role="combobox" ve aria-expanded dahil yerlesik ARIA nitelikleri
- **Acilir Pencere Yonetimi** - Kullanici etkilesimine dayali otomatik goster/gizle
- **Sinyal Tabanli Reaktivite** - Angular sinyalleri kullanan reaktif durum yonetimi

## Examples

### Autocomplete

Kullanicilar yazarken secenekleri filtreleyen ve oneren, bir listeden deger bulmalarına ve secmelerine yardimci olan erisilebilir bir giris alani.

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

`filterMode="manual"` ayari filtreleme ve secim uzerinde tam kontrol saglar. Giris, secenekler listesini filtreleyen bir sinyali gunceller. Kullanicilar ok tuslariyla gezinir ve Enter veya tiklama ile secer. Bu mod, ozel filtreleme mantigi icin en fazla esnekligi saglar. Eksiksiz filtreleme kaliplari ve ornekleri icin [Autocomplete rehberine](guide/aria/autocomplete) bakin.

### Readonly mode

Tek secimli acilir menuler olusturmak icin klavye navigasyonu ve ekran okuyucu destegi ile salt okunur combobox'i listbox ile birlestiren bir kalip.

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

`readonly` niteligi giris alanina yazmayi engeller. Acilir pencere tiklama veya ok tuslariyla acilir. Kullanicilar klavye ile secenekler arasinda gezinir ve Enter veya tiklama ile secer.

Bu yapilandirma, [Select](guide/aria/select) ve [Multiselect](guide/aria/multiselect) kaliplari icin temeli saglar. Tetikleyiciler ve katman konumlandirmasiyla eksiksiz acilir menu uygulamalari icin bu rehberlere bakin.

### Dialog popup

Acilir pencereler bazen arka plan ve odak yakalama ile modal davranisa ihtiyac duyar. Combobox dialog yonergesi, ozellestirilmis kullanim durumlari icin bu kalibi saglar.

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

`ngComboboxDialog` yonergesi, yerel dialog elemanini kullanarak modal bir acilir pencere olusturur. Bu, arka plan davranisi ve odak yakalama saglar. Secim arayuzu modal etkilesim gerektirdiginde veya acilir pencere icerigi tam ekran odak gerektiecek kadar karmasik oldugunda dialog acilir pencerelerini kullanin.

## APIs

### Combobox Directive

`ngCombobox` yonergesi bir metin girisini bir acilir pencereyle koordine eder.

#### Inputs

| Property         | Type                                           | Default    | Description                                            |
| ---------------- | ---------------------------------------------- | ---------- | ------------------------------------------------------ |
| `filterMode`     | `'manual'` \| `'auto-select'` \| `'highlight'` | `'manual'` | Secim davranisini kontrol eder                         |
| `disabled`       | `boolean`                                      | `false`    | Combobox'i devre disi birakir                          |
| `readonly`       | `boolean`                                      | `false`    | Combobox'i salt okunur yapar (Select/Multiselect icin) |
| `firstMatch`     | `V`                                            | -          | Otomatik secim icin ilk eslesen ogenin degeri          |
| `alwaysExpanded` | `boolean`                                      | `false`    | Acilir pencereyi her zaman acik tutar                  |

**Filtre Modlari:**

- **`'manual'`** - Kullanici filtreleme ve secimi acikca kontrol eder. Acilir pencere, filtreleme mantiginiza gore secenekleri gosterir. Kullanicilar Enter veya tiklama ile secer. Bu mod en fazla esnekligi saglar.
- **`'auto-select'`** - Giris degeri, kullanicilar yazarken otomatik olarak ilk eslesen secenege guncellenir. Koordinasyon icin `firstMatch` girisi gerektirir. Ornekler icin [Autocomplete rehberine](guide/aria/autocomplete#auto-select-mode) bakin.
- **`'highlight'`** - Giris degerini degistirmeden eslesen metni vurgular. Kullanicilar ok tuslariyla gezinir ve Enter ile secer.

#### Signals

| Property   | Type              | Description                                  |
| ---------- | ----------------- | -------------------------------------------- |
| `expanded` | `Signal<boolean>` | Acilir pencerenin su anda acik olup olmadigi |

#### Methods

| Method     | Parameters | Description           |
| ---------- | ---------- | --------------------- |
| `open`     | none       | Combobox'i acar       |
| `close`    | none       | Combobox'i kapatir    |
| `expand`   | none       | Combobox'i genisletir |
| `collapse` | none       | Combobox'i daraltir   |

### ComboboxInput Directive

`ngComboboxInput` yonergesi bir giris elemanini combobox'a baglar.

#### Model

| Property | Type     | Description                                           |
| -------- | -------- | ----------------------------------------------------- |
| `value`  | `string` | `[(value)]` kullanilarak iki yonlu baglanabilir deger |

Giris elemani klavye islemesi ve ARIA niteliklerini otomatik olarak alir.

### ComboboxPopup Directive

`ngComboboxPopup` yonergesi (ana yonerge) acilir pencere gorunurluğunu ve koordinasyonunu yonetir. Tipik olarak bir `ng-template` icinde `ngComboboxPopupContainer` ile veya CDK Overlay ile kullanilir.

### ComboboxPopupContainer Directive

`ngComboboxPopupContainer` yonergesi bir `ng-template`'i acilir pencere icerigi olarak isaretler.

```html
<ng-template ngComboboxPopupContainer>
  <div ngListbox>...</div>
</ng-template>
```

Konumlandirma icin Popover API veya CDK Overlay ile kullanilir.

### ComboboxDialog Directive

`ngComboboxDialog` yonergesi modal bir combobox acilir penceresi olusturur.

```html
<dialog ngComboboxDialog>
  <div ngListbox>...</div>
</dialog>
```

Arka plan ve odak yakalama ile modal acilir pencere davranisi icin kullanin.

### Related patterns and directives

Combobox, bu belgelendirilmis kalipler icin temel yonergedir:

- **[Autocomplete](guide/aria/autocomplete)** - Filtreleme ve oneriler kalibi (Combobox'i filtre modlariyla kullanir)
- **[Select](guide/aria/select)** - Tek secim acilir menu kalibi (Combobox'i `readonly` ile kullanir)
- **[Multiselect](guide/aria/multiselect)** - Coklu secim kalibi (Combobox'i `readonly` + coklu etkin Listbox ile kullanir)

Combobox tipik olarak sunlarla birlestirilir:

- **[Listbox](guide/aria/listbox)** - En yaygin acilir pencere icerigi
- **[Tree](guide/aria/tree)** - Hiyerarsik acilir pencere icerigi (ornekler icin Tree rehberine bakin)
