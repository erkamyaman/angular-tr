<docs-decorative-header title="Menubar">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" title="Menubar ARIA pattern"/>
  <docs-pill href="/api/aria/menu/MenuBar" title="Menubar API Reference"/>
</docs-pill-row>

## Overview

Menu cubugu, uygulama menulerine kalici erisim saglayan yatay bir navigasyon cubugudur. Menu cubuklari komutlari Dosya, Duzenle ve Goruntule gibi mantiksal kategorilere duzenleyerek kullanicilarin klavye veya fare etkilesimi araciligiyla uygulama ozelliklerini kesfetmesine ve calistirmasina yardimci olur.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Usage

Menu cubuklari, uygulama komutlarini kalici ve kesifeedilebilir navigasyona duzenlemek icin iyi calisir.

**Menu cubugu kullanin:**

- Uygulama komut cubuklari olustururken (Dosya, Duzenle, Goruntule, Ekle, Bicimlendir gibi)
- Arayuz genelinde gorunen kalici navigasyon olustururken
- Komutlari mantiksal ust duzey kategorilere duzenlerken
- Klavye destekli yatay menu navigasyonuna ihtiyac duyulduğunda
- Masaustu tarzi uygulama arayuzleri olustururken

**Menu cubugundan kacinin:**

- Bireysel eylemler icin acilir menuler olustururken (bunun yerine [tetikleyicili Menu](guide/aria/menu) kullanin)
- Baglam menuleri olustururken ([Menu](guide/aria/menu) rehber kalibini kullanin)
- Basit bagimsiz eylem listeleri icin (bunun yerine [Menu](guide/aria/menu) kullanin)
- Yatay alanin sinirli oldugu mobil arayuzlerde
- Navigasyon bir kenar cubugu veya baslik navigasyon kalibina ait oldugunda

## Features

- **Yatay navigasyon** - Sol/Sag ok tuslari ust duzey kategoriler arasinda hareket eder
- **Kalici gorunurluk** - Her zaman gorunur, modal veya kapatilabilir degil
- **Uzerine gelindiginde acma** - Ilk klavye veya tiklama etkilesiminden sonra alt menuler uzerine gelindiginde acilir
- **Ic ice alt menuler** - Birden fazla menu derinlik seviyesini destekler
- **Klavye navigasyonu** - Ok tuslari, Enter/Bosluk, Escape ve yazarak arama
- **Devre disi durumlar** - Tum menu cubugunu veya bireysel ogeleri devre disi birakin
- **RTL destegi** - Otomatik sagdan sola dil navigasyonu

## Examples

### Basic menubar

Bir menu cubugu, ust duzey kategorilere duzenlenmis uygulama komutlarina kalici erisim saglar. Kullanicilar kategoriler arasinda Sol/Sag ok tuslariyla gezinir ve menuleri Enter veya Asagi ok tusuyla acar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Dosya, Duzenle ve Goruntule arasinda hareket etmek icin Sag ok tusuna basin. Bir menuyu acmak ve alt menu ogeleri arasinda Yukari/Asagi ok tuslariyla gezinmek icin Enter veya Asagi ok tusuna basin.

### Disabled menubar items

Etkilesimi engellemek icin belirli menu ogelerini veya tum menu cubugunu devre disi birakin. Devre disi ogelerin klavye navigasyonu sirasinda klavye odagi alip alamayacagini `softDisabled` girisi ile kontrol edin.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Menu cubugunda `[softDisabled]="true"` oldugunda, devre disi ogeler odak alabilir ancak etkinlestirilemez. `[softDisabled]="false"` oldugunda, devre disi ogeler klavye navigasyonu sirasinda atlanir.

### RTL support

Menu cubuklari sagdan sola (RTL) dillere otomatik olarak uyum saglar. Ok tusu navigasyonu yonunu tersine cevirir ve alt menuler sol tarafa konumlanir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`dir="rtl"` niteligi RTL modunu etkinlestirir. Sol ok saga, sag ok sola hareket eder ve RTL dil kullanicilari icin dogal navigasyonu korur.

## APIs

Menu cubugu kalibi, Angular'in Aria kutuphanesindeki yonergeleri kullanir. Eksiksiz API dokumantasyonu icin [Menu rehberine](guide/aria/menu) bakin.

### MenuBar

Ust duzey menu ogeleri icin yatay kapsayici.

#### Inputs

| Property       | Type      | Default | Description                                                                  |
| -------------- | --------- | ------- | ---------------------------------------------------------------------------- |
| `disabled`     | `boolean` | `false` | Tum menu cubugunu devre disi birakir                                         |
| `wrap`         | `boolean` | `true`  | Klavye navigasyonunun son ogeden ilk ogeye sarilip sarilmadigi               |
| `softDisabled` | `boolean` | `true`  | `true` oldugunda, devre disi ogeler odaklanabilir ancak etkilesimli degildir |

Mevcut tum girisler ve sinyaller hakkinda eksiksiz bilgi icin [Menu API dokumantasyonuna](guide/aria/menu#apis) bakin.

### MenuItem

Menu cubugu icindeki bireysel ogeler. Menu ile ayni API - [MenuItem](guide/aria/menu#menuitem) sayfasina bakin.

**Menu cubuguna ozel davranis:**

- Sol/Sag ok tuslari menu cubugu ogeleri arasinda gezinir (dikey menulerdeki Yukari/Asagi yerine)
- Ilk klavye etkilesimi veya tiklama alt menuler icin uzerine gelindiginde acmayi etkinlestirir
- Enter veya Asagi ok tusu alt menuyu acar ve ilk ogeye odaklanir
- `aria-haspopup="menu"` alt menulere sahip ogeleri gosterir

### MenuTrigger

Menu cubuklarinda genellikle kullanilmaz - MenuItem, iliskili bir alt menusu oldugunda tetikleyici davranisini dogrudan yonetir. Bagimsiz menu tetikleyici kaliplari icin [MenuTrigger](guide/aria/menu#menutrigger) sayfasina bakin.
