<docs-decorative-header title="Tabs">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" title="Tabs ARIA pattern"/>
  <docs-pill href="/api/aria/tabs/Tabs" title="Tabs API Reference"/>
</docs-pill-row>

## Overview

Sekmeler, ayni anda yalnizca bir panelin gorunebildigi katmanli icerik bolumleri gosterir. Kullanicilar sekme butonlarina tiklayarak veya sekme listesinde gezinmek icin ok tuslari kullanarak paneller arasinda gecis yapar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Usage

Sekmeler, kullanicilarin farkli gorunumler veya kategoriler arasinda gecis yaptigi, iliskili icerigi farkli bolumlere duzenlemek icin iyi calisir.

**Sekmeleri kullanin:**

- Iliskili icerigi farkli bolumlere duzenlerken
- Birden fazla kategoriye sahip ayar panelleri olustururken
- Birden fazla konuya sahip dokumantasyon olustururken
- Farkli gorunumlere sahip kontrol panelleri uygularken
- Kullanicilarin baglam degistirmesi gerektigi icerigi gosterirken

**Sekmelerden kacinin:**

- Sirali formlar veya sihirbazlar olustururken (bir adim kalibi kullanin)
- Sayfalar arasinda gezinirken (yonlendirici navigasyonu kullanin)
- Tek icerik bolumleri gosterirken (sekmelere gerek yok)
- 7-8'den fazla sekme olduğunda (farkli bir yerlesim dusunun)

## Features

- **Secim modlari** - Sekmeler odaklandiginda otomatik olarak etkinlesir veya manuel etkinlestirme gerektirir
- **Klavye navigasyonu** - Ok tuslari, Home ve End ile verimli sekme navigasyonu
- **Yon** - Yatay veya dikey sekme listesi yerlesimi
- **Tembel icerik** - Sekme panelleri yalnizca ilk etkinlestirildiginde olusturulur
- **Devre disi sekmeler** - Odak yonetimiyle bireysel sekmeleri devre disi birakin
- **Odak modlari** - Dolasan tabindex veya activedescendant odak stratejileri
- **RTL destegi** - Sagdan sola dil navigasyonu

## Examples

### Selection follows focus

Secim odagi takip ettiginde, ok tuslariyla gezindikce sekmeler aninda etkinlesir. Bu aninda geri bildirim saglar ve hafif icerik icin iyi calisir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Bu davranisi etkinlestirmek icin sekme listesinde `[selectionMode]="'follow'"` ayarlayin.

### Manual activation

Manuel etkinlestirmede, ok tuslari secili sekmeyi degistirmeden sekmeler arasinda odak taşir. Kullanicilar odaklanan sekmeyi etkinlestirmek icin Bosluk veya Enter'a basar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Gereksiz render'i onlemek icin agir icerik panellerinde `[selectionMode]="'explicit'"` kullanin.

### Vertical tabs

Ayar panelleri veya navigasyon kenar cubuklari gibi arayuzler icin sekmeleri dikey olarak duzenleyin.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Sekme listesinde `[orientation]="'vertical'"` ayarlayin. Navigasyon Yukari/Asagi ok tuslarina degisir.

### Lazy content rendering

Sekme panellerinin ilk gosterilene kadar render edilmesini ertelemek icin bir `ng-template` uzerinde `ngTabContent` yonergesini kullanin.

```angular-html
<div ngTabs>
  <ul ngTabList [(selectedTab)]="selectedTab">
    <li ngTab value="tab1">Tab 1</li>
    <li ngTab value="tab2">Tab 2</li>
  </ul>

  <div ngTabPanel value="tab1">
    <ng-template ngTabContent>
      <!-- Bu icerik yalnizca Sekme 1 ilk gosterildiginde render edilir -->
      <app-heavy-component />
    </ng-template>
  </div>

  <div ngTabPanel value="tab2">
    <ng-template ngTabContent>
      <!-- Bu icerik yalnizca Sekme 2 ilk gosterildiginde render edilir -->
      <app-another-component />
    </ng-template>
  </div>
</div>
```

Varsayilan olarak, panel gizlendikten sonra icerik DOM'da kalir. Panel devre disi birakildiginda icerigi DOM'dan kaldirmak icin `[preserveContent]="false"` ayarlayin.

### Disabled tabs

Kullanici etkilesimini engellemek icin belirli sekmeleri devre disi birakin. Devre disi sekmelerin klavye odagi alip alamayacagini kontrol edin.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Sekme listesinde `[softDisabled]="true"` oldugunda, devre disi sekmeler odak alabilir ancak etkinlestirilemez. `[softDisabled]="false"` oldugunda, devre disi sekmeler klavye navigasyonu sirasinda atlanir.

## APIs

### Tabs

Sekme listeleri ve panelleri koordine eden kapsayici yonerge.

Bu yonergenin girisi veya ciktisi yoktur. `ngTabList`, `ngTab` ve `ngTabPanel` yonergeleri icin kok kapsayici gorevi gorur.

### TabList

Secim ve klavye navigasyonunu yoneten sekme butonlari icin kapsayici.

#### Inputs

| Property        | Type                         | Default        | Description                                                                 |
| --------------- | ---------------------------- | -------------- | --------------------------------------------------------------------------- |
| `orientation`   | `'horizontal' \| 'vertical'` | `'horizontal'` | Sekme listesi yerlesim yonu                                                 |
| `wrap`          | `boolean`                    | `false`        | Klavye navigasyonunun son sekmeden ilk sekmeye sarilip sarilmadigi          |
| `softDisabled`  | `boolean`                    | `true`         | `true` oldugunda, devre disi sekmeler odaklanabilir ancak etkinlestirilemez |
| `selectionMode` | `'follow' \| 'explicit'`     | `'follow'`     | Sekmelerin odaklandiginda mi yoksa acik etkinlestirme mi gerektirdigi       |
| `selectedTab`   | `any`                        | —              | Su anda secili sekmenin degeri (iki yonlu baglama destekler)                |

### Tab

Bireysel bir sekme butonu.

#### Inputs

| Property   | Type      | Default | Description                                |
| ---------- | --------- | ------- | ------------------------------------------ |
| `value`    | `any`     | —       | **Zorunlu.** Bu sekme icin benzersiz deger |
| `disabled` | `boolean` | `false` | Bu sekmeyi devre disi birakir              |

#### Signals

| Property   | Type              | Description                           |
| ---------- | ----------------- | ------------------------------------- |
| `selected` | `Signal<boolean>` | Sekmenin su anda secili olup olmadigi |
| `active`   | `Signal<boolean>` | Sekmenin su anda odakta olup olmadigi |

### TabPanel

Bir sekmeyle iliskili icerik paneli.

#### Inputs

| Property          | Type      | Default | Description                                                                 |
| ----------------- | --------- | ------- | --------------------------------------------------------------------------- |
| `value`           | `any`     | —       | **Zorunlu.** Iliskili sekmenin `value` degeri ile eslesmelidir              |
| `preserveContent` | `boolean` | `true`  | Devre disi birakilmadan sonra panel iceriginin DOM'da tutulup tutulmayacagi |

#### Signals

| Property  | Type              | Description                           |
| --------- | ----------------- | ------------------------------------- |
| `visible` | `Signal<boolean>` | Panelin su anda gorunur olup olmadigi |

### TabContent

Sekme panel icerigini tembel render etmek icin yapisal yonerge.

Bu yonergenin girisi, ciktisi veya yontemi yoktur. Bir sekme paneli icindeki `ng-template` elemanina uygulayin:

```angular-html
<div ngTabPanel value="tab1">
  <ng-template ngTabContent>
    <!-- Buradaki icerik tembel olarak render edilir -->
  </ng-template>
</div>
```
