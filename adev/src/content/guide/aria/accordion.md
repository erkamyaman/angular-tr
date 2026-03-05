<docs-decorative-header title="Accordion">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" title="Accordion ARIA pattern"/>
  <docs-pill href="/api?query=accordion#angular_aria_accordion" title="Accordion API Reference"/>
</docs-pill-row>

## Overview

Bir akordeon, ilgili icerigi genisletilebilir ve daraltilabilir bolumlere duzenleyerek sayfa kaydirmayi azaltir ve kullanicilarin ilgili bilgilere odaklanmasina yardimci olur. Her bolumun bir tetikleyici butonu ve bir icerik paneli vardir. Bir tetikleyiciye tiklamak, iliskili panelin gorunurluğunu degistirir.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
</docs-code-multifile>

## Usage

Akordeonlar, kullanicilarin genellikle ayni anda bir bolumu goruntulemeye ihtiyac duyduklari mantiksal gruplara icerik duzenleme icin iyi calisir.

**Akordeon kullanin:**

- Birden fazla soru ve yanit iceren SSS gosterimi
- Uzun formlari yonetilebilir bolumlere duzenleme
- Icerik agirlikli sayfalarda kaydirmayi azaltma
- Ilgili bilgileri kademeli olarak aciklama

**Akordeondan kacinin:**

- Navigasyon menuleri olustururken (bunun yerine [Menu](guide/aria/menu) bilesenini kullanin)
- Sekmeli arayuzler olustururken (bunun yerine [Tabs](guide/aria/tabs) bilesenini kullanin)
- Tek bir daraltilabilir bolum gosterirken (bunun yerine bir aciklama kalibi kullanin)
- Kullanicilarin ayni anda birden fazla bolumu gormesi gerektiginde (farkli bir yerlesim dusunun)

## Features

- **Genisleme modlari** - Ayni anda bir veya birden fazla panelin acik olup olmayacagini kontrol edin
- **Klavye navigasyonu** - Ok tuslari, Home ve End ile tetikleyiciler arasinda gezinin
- **Tembel render** - Icerik yalnizca bir panel ilk kez genisletildiginde olusturulur, ilk yukleme performansini iyilestirir
- **Devre disi durumlar** - Tum grubu veya bireysel tetikleyicileri devre disi birakin
- **Odak yonetimi** - Devre disi birakilan ogelerin klavye odagi alip alamayacagini kontrol edin
- **Programatik kontrol** - Bilesen kodunuzdan panelleri genisletin, daraltın veya degistirin
- **RTL destegi** - Sagdan sola diller icin otomatik destek

## Examples

### Single expansion mode

Ayni anda yalnizca bir panelin acik olmasina izin vermek icin `[multiExpandable]="false"` ayarlayin. Yeni bir panel acmak, daha once acik olan paneli otomatik olarak kapatir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Bu mod, SSS'ler veya kullanicilarin ayni anda bir yanita odaklanmasini istediginiz durumlar icin iyi calisir.

### Multiple expansion mode

Birden fazla panelin ayni anda acik olmasina izin vermek icin `[multiExpandable]="true"` ayarlayin. Kullanicilar digerlerini kapatmadan ihtiyac duydugu kadar panel genisletebilir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Bu mod, form bolumleri veya kullanicilarin birden fazla panel arasinda icerigi karsilastirmasi gerektiginde kullanislidir.

NOTE: `multiExpandable` girisi varsayilan olarak `true`'dur. Tek genisleme davranisi istiyorsaniz acikca `false` olarak ayarlayin.

### Disabled accordion items

`disabled` girisini kullanarak belirli tetikleyicileri devre disi birakin. Devre disi birakilan ogelerin klavye navigasyonu sirasindaki davranisini akordeon grubundaki `softDisabled` girisi ile kontrol edin.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`[softDisabled]="true"` oldugunda (varsayilan), devre disi birakilan ogeler odak alabilir ancak etkinlestirilemez. `[softDisabled]="false"` oldugunda, devre disi birakilan ogeler klavye navigasyonu sirasinda tamamen atlanir.

### Lazy content rendering

Panel ilk kez genisletilene kadar icerik render etmeyi ertelemek icin bir `ng-template` uzerinde `ngAccordionContent` yonergesini kullanin. Bu, resimler, grafikler veya karmasik bilesenler gibi agir icerikli akordeonlar icin performansi iyilestirir.

```angular-html
<div ngAccordionGroup>
  <div>
    <button ngAccordionTrigger panelId="item-1">Trigger Text</button>
    <div ngAccordionPanel panelId="item-1">
      <ng-template ngAccordionContent>
        <!-- This content only renders when the panel first opens -->
        <img src="large-image.jpg" alt="Description" />
        <app-expensive-component />
      </ng-template>
    </div>
  </div>
</div>
```

Varsayilan olarak, panel daraltildiktan sonra icerik DOM'da kalir. Panel kapatildiginda icerigi DOM'dan kaldirmak icin `[preserveContent]="false"` ayarlayin.

## APIs

### AccordionGroup

Bir grup akordeon ogesi icin klavye navigasyonunu ve genisleme davranisini yoneten kapsayici yonerge.

#### Inputs

| Property          | Type      | Default | Description                                                                     |
| ----------------- | --------- | ------- | ------------------------------------------------------------------------------- |
| `disabled`        | `boolean` | `false` | Gruptaki tum tetikleyicileri devre disi birakir                                 |
| `multiExpandable` | `boolean` | `true`  | Birden fazla panelin ayni anda genisletilip genisletilemeyecegi                 |
| `softDisabled`    | `boolean` | `true`  | `true` oldugunda, devre disi ogelere odaklanilabilir. `false` oldugunda atlanir |
| `wrap`            | `boolean` | `false` | Klavye navigasyonunun son ogeden ilk ogeye ve tam tersi donup donmeyecegi       |

#### Methods

| Method        | Parameters | Description                                                                    |
| ------------- | ---------- | ------------------------------------------------------------------------------ |
| `expandAll`   | none       | Tum panelleri genisletir (yalnizca `multiExpandable` `true` oldugunda calisir) |
| `collapseAll` | none       | Tum panelleri daraltir                                                         |

### AccordionTrigger

Panel gorunurluğunu degistiren buton elemanina uygulanan yonerge.

#### Inputs

| Property   | Type      | Default | Description                                                       |
| ---------- | --------- | ------- | ----------------------------------------------------------------- |
| `id`       | `string`  | auto    | Tetikleyici icin benzersiz tanimlayici                            |
| `panelId`  | `string`  | —       | **Zorunlu.** Iliskili panelin `panelId`'si ile eslesmelidir       |
| `disabled` | `boolean` | `false` | Bu tetikleyiciyi devre disi birakir                               |
| `expanded` | `boolean` | `false` | Panelin genisletilmis olup olmadigi (iki yonlu baglama destekler) |

#### Signals

| Property | Type              | Description                                 |
| -------- | ----------------- | ------------------------------------------- |
| `active` | `Signal<boolean>` | Tetikleyicinin su anda odakta olup olmadigi |

#### Methods

| Method     | Parameters | Description                         |
| ---------- | ---------- | ----------------------------------- |
| `expand`   | none       | Iliskili paneli genisletir          |
| `collapse` | none       | Iliskili paneli daraltir            |
| `toggle`   | none       | Panel genisleme durumunu degistirir |

### AccordionPanel

Daraltilabilir icerigi iceren elemana uygulanan yonerge.

#### Inputs

| Property          | Type      | Default | Description                                                        |
| ----------------- | --------- | ------- | ------------------------------------------------------------------ |
| `id`              | `string`  | auto    | Panel icin benzersiz tanimlayici                                   |
| `panelId`         | `string`  | —       | **Zorunlu.** Iliskili tetikleyicinin `panelId`'si ile eslesmelidir |
| `preserveContent` | `boolean` | `true`  | Panel daraltildiktan sonra icerigin DOM'da tutulup tutulmayacagi   |

#### Signals

| Property  | Type              | Description                                 |
| --------- | ----------------- | ------------------------------------------- |
| `visible` | `Signal<boolean>` | Panelin su anda genisletilmis olup olmadigi |

#### Methods

| Method     | Parameters | Description                   |
| ---------- | ---------- | ----------------------------- |
| `expand`   | none       | Bu paneli genisletir          |
| `collapse` | none       | Bu paneli daraltir            |
| `toggle`   | none       | Genisleme durumunu degistirir |

### AccordionContent

Tembel render etmeyi etkinlestirmek icin akordeon paneli icindeki `ng-template`'e uygulanan yapisal yonerge.

Bu yonergenin girisi, ciktisi veya yontemi yoktur. Bir `ng-template` elemanina uygulayin:

```angular-html
<div ngAccordionPanel panelId="item-1">
  <ng-template ngAccordionContent>
    <!-- Content here is lazily rendered -->
  </ng-template>
</div>
```
