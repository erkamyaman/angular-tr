<docs-decorative-header title="Listbox">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" title="Listbox pattern"/>
  <docs-pill href="/api?query=listbox#angular_aria_listbox" title="Listbox API Reference"/>
</docs-pill-row>

## Overview

Kullanicilarin secim yapabilecegi bir secenek listesi gosteren, klavye navigasyonu, tekli veya coklu secim ve ekran okuyucu destegi saglayan yonerge.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Usage

Listbox, [Select](guide/aria/select), [Multiselect](guide/aria/multiselect) ve [Autocomplete](guide/aria/autocomplete) kaliplari tarafindan kullanilan temel bir yonergedir. Cogu acilir menu ihtiyaci icin bunun yerine bu belgelendirilmis kaliplari kullanin.

Su durumlarda listbox'i dogrudan kullanmayi dusunun:

- **Ozel secim bilesenleri olusturma** - Belirli davranisa sahip ozellestirilmis arayuzler olusturma
- **Gorunur secim listeleri** - Secilebilir ogeleri dogrudan sayfada gosterme (acilir menulerde degil)
- **Ozel entegrasyon kaliplari** - Benzersiz acilir pencere veya yerlesim gereksinimlerile entegrasyon

Listbox'tan kacinin:

- **Navigasyon menuleri gerektiginde** - Eylemler ve komutlar icin [Menu](guide/aria/menu) yonergesini kullanin

## Features

Angular'in listbox'i tam erisilebilir bir liste uygulamasi saglar:

- **Klavye Navigasyonu** - Ok tuslariyla secenekler arasinda gezinin, Enter veya Bosluk ile secin
- **Ekran Okuyucu Destegi** - role="listbox" dahil yerlesik ARIA nitelikleri
- **Tekli veya Coklu Secim** - `multi` niteligi secim modunu kontrol eder
- **Yatay veya Dikey** - Yerlesim yonu icin `orientation` niteligi
- **Yazarak arama** - Eslesen seceneklere atlamak icin karakterleri yazin
- **Sinyal Tabanli Reaktivite** - Angular sinyalleri kullanan reaktif durum yonetimi

## Examples

### Basic listbox

Uygulamalarin bazen bir acilir menude gizlenmis yerine dogrudan sayfada gorunen secilebilir listelere ihtiyaci vardir. Bagimsiz bir listbox, bu gorunen liste arayuzleri icin klavye navigasyonu ve secim saglar.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html" />
</docs-code-multifile>

`values` model sinyali secili ogelere iki yonlu baglama saglar. `selectionMode="explicit"` ile kullanicilar secenekleri secmek icin Bosluk veya Enter'a basar. Listbox'i combobox ve katman konumlandirmasiyla birlestiren acilir menu kaliplari icin [Select](guide/aria/select) kalibina bakin.

### Horizontal listbox

Listeler bazen yatay olarak daha iyi calisir, ornegin arac cubugu benzeri arayuzler veya sekme tarzi secimler. `orientation` niteligi hem yerlesimi hem de klavye navigasyon yonunu degistirir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`orientation="horizontal"` ile yukari ve asagi ok tuslari yerine sol ve sag ok tuslari secenekler arasinda gezinir. Listbox, navigasyon yonunu tersine cevirerek sagdan sola (RTL) dilleri otomatik olarak isler.

### Selection modes

Listbox, ogelerin ne zaman secilecegini kontrol eden iki secim modunu destekler.

`'follow'` modu odaklanan ogeyi otomatik olarak secer, secim sik degistiginde daha hizli etkilesim saglar. `'explicit'` modu, gezinirken kazara degisiklikleri onlemek icin secimi onaylamak icin Bosluk veya Enter gerektirir. Acilir menu kaliplari genellikle tek secim icin `'follow'` modunu kullanir.

#### Explicit

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.html" />
</docs-code-multifile>

#### Follow

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.html" />
</docs-code-multifile>

| Mode         | Description                                                                                |
| ------------ | ------------------------------------------------------------------------------------------ |
| `'follow'`   | Odaklanan ogeyi otomatik olarak secer, secim sik degistiginde daha hizli etkilesim saglar  |
| `'explicit'` | Secimi onaylamak icin Bosluk veya Enter gerektirir, gezinirken kazara degisiklikleri onler |

TIP: Acilir menu kaliplari genellikle tek secim icin `'follow'` modunu kullanir.

## APIs

### Listbox Directive

`ngListbox` yonergesi secilebilir seceneklerden olusan erisilebilir bir liste olusturur.

#### Inputs

| Property         | Type                               | Default      | Description                                     |
| ---------------- | ---------------------------------- | ------------ | ----------------------------------------------- |
| `id`             | `string`                           | auto         | Listbox icin benzersiz tanimlayici              |
| `multi`          | `boolean`                          | `false`      | Coklu secimi etkinlestirir                      |
| `orientation`    | `'vertical'` \| `'horizontal'`     | `'vertical'` | Listenin yerlesim yonu                          |
| `wrap`           | `boolean`                          | `true`       | Odagin liste kenarlarinda sarilip sarilmadigi   |
| `selectionMode`  | `'follow'` \| `'explicit'`         | `'follow'`   | Secimin nasil tetiklendigi                      |
| `focusMode`      | `'roving'` \| `'activedescendant'` | `'roving'`   | Odak yonetim stratejisi                         |
| `softDisabled`   | `boolean`                          | `true`       | Devre disi ogelerin odaklanabilir olup olmadigi |
| `disabled`       | `boolean`                          | `false`      | Tum listbox'i devre disi birakir                |
| `readonly`       | `boolean`                          | `false`      | Listbox'i salt okunur yapar                     |
| `typeaheadDelay` | `number`                           | `500`        | Yazarak arama sifirlanmadan onceki milisaniye   |

#### Model

| Property | Type  | Description                                     |
| -------- | ----- | ----------------------------------------------- |
| `values` | `V[]` | Secili degerlerin iki yonlu baglanabilir dizisi |

#### Signals

| Property | Type          | Description                           |
| -------- | ------------- | ------------------------------------- |
| `values` | `Signal<V[]>` | Su anda secili degerler sinyal olarak |

#### Methods

| Method                     | Parameters                        | Description                   |
| -------------------------- | --------------------------------- | ----------------------------- |
| `scrollActiveItemIntoView` | `options?: ScrollIntoViewOptions` | Aktif ogeyi gorünume kaydirir |
| `gotoFirst`                | none                              | Listbox'taki ilk ogeye gider  |

### Option Directive

`ngOption` yonergesi bir listbox icindeki bir ogeyi isaretler.

#### Inputs

| Property   | Type      | Default | Description                                |
| ---------- | --------- | ------- | ------------------------------------------ |
| `id`       | `string`  | auto    | Secenek icin benzersiz tanimlayici         |
| `value`    | `V`       | -       | Bu secenekle iliskili deger (zorunlu)      |
| `label`    | `string`  | -       | Ekran okuyuculari icin istege bagli etiket |
| `disabled` | `boolean` | `false` | Bu secenegin devre disi olup olmadigi      |

#### Signals

| Property   | Type              | Description                       |
| ---------- | ----------------- | --------------------------------- |
| `selected` | `Signal<boolean>` | Bu secenegin secili olup olmadigi |
| `active`   | `Signal<boolean>` | Bu secenegin odakta olup olmadigi |

### Related patterns

Listbox, su belgelendirilmis acilir menu kaliplari tarafindan kullanilir:

- **[Select](guide/aria/select)** - Salt okunur combobox + listbox kullanan tek secimli acilir menu kalibi
- **[Multiselect](guide/aria/multiselect)** - Salt okunur combobox + `multi` ile listbox kullanan coklu secimli acilir menu kalibi
- **[Autocomplete](guide/aria/autocomplete)** - Combobox + listbox kullanan filtrelenebilir acilir menu kalibi

Tetikleyici, acilir pencere ve katman konumlandirmasiyla eksiksiz acilir menu kaliplari icin, listbox'i tek basina kullanmak yerine bu kalip rehberlerine bakin.

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" title="Listbox ARIA pattern"/>
  <docs-pill href="/api/aria/listbox/Listbox" title="Listbox API Reference"/>
</docs-pill-row>
