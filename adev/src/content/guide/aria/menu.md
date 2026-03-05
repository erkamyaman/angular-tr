<docs-decorative-header title="Menu">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" title="Menu ARIA pattern"/>
  <docs-pill href="/api/aria/menu/Menu" title="Menu API Reference"/>
</docs-pill-row>

## Overview

Bir menu, kullanicilara eylemler veya secenekler listesi sunar, tipik olarak bir buton tiklamasi veya sag tiklama yaniti olarak gorunur. Menuler ok tuslariyla klavye navigasyonunu, alt menuleri, onay kutularini, radyo butonlarini ve devre disi ogeleri destekler.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Usage

Menuler, kullanicilarin secebilecegi eylem veya komut listeleri sunmak icin iyi calisir.

**Menu kullanin:**

- Uygulama komut menuleri olustururken (Dosya, Duzenle, Goruntule)
- Baglam menuleri olustururken (sag tiklama eylemleri)
- Acilir eylem listeleri gosterirken
- Arac cubugu acilir menuleri uygularken
- Ayarlari veya secenekleri duzenlerken

**Menulerden kacinin:**

- Site navigasyonu olustururken (bunun yerine navigasyon yer isaretlerini kullanin)
- Form select'leri olustururken (bunun yerine [Select](guide/aria/select) bilesenini kullanin)
- Icerik panelleri arasinda gecis yaparken (bunun yerine [Tabs](guide/aria/tabs) kullanin)
- Daraltilabilir icerik gosterirken (bunun yerine [Accordion](guide/aria/accordion) kullanin)

## Features

- **Klavye navigasyonu** - Ok tuslari, Home/End ve karakter arama ile verimli navigasyon
- **Alt menuler** - Otomatik konumlandirma ile ic ice menu destegi
- **Menu turleri** - Bagimsiz menuler, tetikleyicili menuler ve menu cubukları
- **Onay kutulari ve radyolar** - Degistirme ve secim menu ogeleri
- **Devre disi ogeler** - Odak yonetimiyle yumusak veya sert devre disi durumlar
- **Otomatik kapanma davranisi** - Secimde yapilandiriabilir kapanma
- **RTL destegi** - Sagdan sola dil navigasyonu

## Examples

### Menu with trigger

Bir tetikleyici butonla bir menuyu eslestirerek acilir menu olusturun. Tetikleyici menuyu acar ve kapatir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Kullanici bir oge sectiginde veya Escape'e bastiginda menu otomatik olarak kapanir.

### Context menu

Baglam menuleri, kullanicilar bir elemana sag tikladiginda imlec konumunda gorunur.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-context/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-context/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-context/app/app.html"/>
</docs-code-multifile>

Menuyu `contextmenu` olay koordinatlarini kullanarak konumlandirin.

### Standalone menu

Bagimsiz menu bir tetikleyici gerektirmez ve arayuzde gorunur kalir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Bagimsiz menuler her zaman gorunen eylem listeleri veya navigasyon icin iyi calisir.

### Disabled menu items

`disabled` girisini kullanarak belirli menu ogelerini devre disi birakin. `softDisabled` ile odak davranisini kontrol edin.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`[softDisabled]="true"` oldugunda, devre disi ogeler odak alabilir ancak etkinlestirilemez. `[softDisabled]="false"` oldugunda, devre disi ogeler klavye navigasyonu sirasinda atlanir.

## APIs

### Menu

Menu ogeleri icin kapsayici yonerge.

#### Inputs

| Property       | Type      | Default | Description                                                                  |
| -------------- | --------- | ------- | ---------------------------------------------------------------------------- |
| `disabled`     | `boolean` | `false` | Menudeki tum ogeleri devre disi birakir                                      |
| `wrap`         | `boolean` | `true`  | Klavye navigasyonunun kenarlarda sarilip sarilmadigi                         |
| `softDisabled` | `boolean` | `true`  | `true` oldugunda, devre disi ogeler odaklanabilir ancak etkilesimli degildir |

#### Methods

| Method  | Parameters | Description    |
| ------- | ---------- | -------------- |
| `close` | none       | Menuyu kapatir |

### MenuBar

Birden fazla menu icin yatay kapsayici.

#### Inputs

| Property       | Type      | Default | Description                                                                  |
| -------------- | --------- | ------- | ---------------------------------------------------------------------------- |
| `disabled`     | `boolean` | `false` | Tum menu cubugunu devre disi birakir                                         |
| `wrap`         | `boolean` | `true`  | Klavye navigasyonunun kenarlarda sarilip sarilmadigi                         |
| `softDisabled` | `boolean` | `true`  | `true` oldugunda, devre disi ogeler odaklanabilir ancak etkilesimli degildir |

### MenuItem

Bir menu icindeki bireysel bir oge.

#### Inputs

| Property     | Type      | Default | Description                                                   |
| ------------ | --------- | ------- | ------------------------------------------------------------- |
| `value`      | `any`     | —       | **Zorunlu.** Bu ogenin degeri                                 |
| `disabled`   | `boolean` | `false` | Bu menu ogesini devre disi birakir                            |
| `submenu`    | `Menu`    | —       | Bir alt menuye referans                                       |
| `searchTerm` | `string`  | `''`    | Yazarak arama icin arama terimi (iki yonlu baglama destekler) |

#### Signals

| Property   | Type              | Description                                  |
| ---------- | ----------------- | -------------------------------------------- |
| `active`   | `Signal<boolean>` | Ogenin su anda odakta olup olmadigi          |
| `expanded` | `Signal<boolean>` | Alt menunun genisletilmis olup olmadigi      |
| `hasPopup` | `Signal<boolean>` | Ogenin iliskili bir alt menusu olup olmadigi |

NOTE: MenuItem genel yontemler sunmaz. Alt menuleri menu ogeleriyle iliskilendirmek icin `submenu` girisini kullanin.

### MenuTrigger

Bir menuyu acan buton veya eleman.

#### Inputs

| Property       | Type      | Default | Description                                            |
| -------------- | --------- | ------- | ------------------------------------------------------ |
| `menu`         | `Menu`    | —       | **Zorunlu.** Tetiklenecek menu                         |
| `disabled`     | `boolean` | `false` | Tetikleyiciyi devre disi birakir                       |
| `softDisabled` | `boolean` | `true`  | `true` oldugunda, devre disi tetikleyici odaklanabilir |

#### Signals

| Property   | Type              | Description                                      |
| ---------- | ----------------- | ------------------------------------------------ |
| `expanded` | `Signal<boolean>` | Menunun su anda acik olup olmadigi               |
| `hasPopup` | `Signal<boolean>` | Tetikleyicinin iliskili bir menusu olup olmadigi |

#### Methods

| Method   | Parameters | Description                        |
| -------- | ---------- | ---------------------------------- |
| `open`   | none       | Menuyu acar                        |
| `close`  | none       | Menuyu kapatir                     |
| `toggle` | none       | Menuyu ac/kapa durumunu degistirir |
