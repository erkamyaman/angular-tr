<docs-decorative-header title="Autocomplete">
</docs-decorative-header>

## Overview

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

## Usage

Otomatik tamamlama, kullanicilarin yazmanin kaydirmadan daha hizli oldugu buyuk bir secenek kumesinden secim yapmasi gerektiginde en iyi calisir. Su durumlarda otomatik tamamlama kullanmayi dusunun:

- **Secenek listesi uzun** (20'den fazla oge) - Yazmak, bir acilir menuyu kaydirmaya gore secimleri daha hizli daraltir
- **Kullanicilar ne aradıklarını biliyor** - Beklenen degerin bir kismini yazabilirler (il adi, urun veya kullanici adi gibi)
- **Secenekler tahmin edilebilir kaliplari takip ediyor** - Kullanicilar kismi eslesmeleri tahmin edebilir (ulke kodlari, e-posta alanlari veya kategoriler gibi)
- **Hiz onemli** - Formlar kapsamli navigasyon olmadan hizli secimden faydalanir

Su durumlarda otomatik tamamlamadan kacinin:

- Listede 10'dan az secenek var - Duzgun bir acilir menu veya radyo grubu daha iyi gorunurluk saglar
- Kullanicilarin seceneklere goz atmasi gerekiyor - Kesfetmek onemliyse, tum secenekleri onceden gosterin
- Secenekler bilinmiyor - Kullanicilar listede var olduğunu bilmedikleri seyleri yazamaz

## Features

Angular'in otomatik tamamlamasi, tam erisilebilir bir combobox uygulamasi saglar:

- **Klavye Navigasyonu** - Ok tuslariyla secenekler arasinda gezinin, Enter ile secin, Escape ile kapatin
- **Ekran Okuyucu Destegi** - Yardimci teknolojiler icin yerlesik ARIA nitelikleri
- **Uc Filtre Modu** - Otomatik secim, manuel secim veya vurgulama davranisi arasinda secim yapin
- **Sinyal Tabanli Reaktivite** - Angular sinyalleri kullanan reaktif durum yonetimi
- **Popover API Entegrasyonu** - Optimum konumlandirma icin yerel HTML Popover API'sinden yararlanir
- **Cift Yonlu Metin Destegi** - Sagdan sola (RTL) dilleri otomatik olarak isler

## Examples

### Auto-select mode

Kismi metin yazan kullanicilar, girdilerinin mevcut bir secenekle eslestigine dair aninda onay bekler. Otomatik secim modu, kullanicilar yazarken giris degerini ilk filtrelenmis secenekle eslesecek sekilde gunceller, gereken tus vurusu sayisini azaltir ve aramalarinin dogru yolda olduguna dair aninda geri bildirim saglar.

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

### Manual selection mode

Manuel secim modu, kullanicilar oneri listesinde gezinirken yazilan metni degistirmeden tutar ve otomatik guncellemelerden kaynaklanan karisikligi onler. Giris, yalnizca kullanicilar secimlerini Enter veya tiklamayla acikca onayladiklarinda degisir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Highlight mode

Vurgulama modu, kullanicinin Enter veya tiklama ile acikca yeni bir secenek secene kadar, ok tuslariyla secenekler arasinda gezinirken giris degerini degistirmeden gezinmesine olanak tanir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/highlight/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/highlight/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## APIs

### Combobox Directive

`ngCombobox` yonergesi otomatik tamamlama islevi icin kapsayici saglar.

#### Inputs

| Property     | Type                                           | Default    | Description                                  |
| ------------ | ---------------------------------------------- | ---------- | -------------------------------------------- |
| `filterMode` | `'auto-select'` \| `'manual'` \| `'highlight'` | `'manual'` | Secim davranisini kontrol eder               |
| `disabled`   | `boolean`                                      | `false`    | Combobox'i devre disi birakir                |
| `firstMatch` | `string`                                       | -          | Acilir penceredeki ilk eslesen ogenin degeri |

#### Outputs

| Property   | Type              | Description                                                    |
| ---------- | ----------------- | -------------------------------------------------------------- |
| `expanded` | `Signal<boolean>` | Acilir pencerenin su anda acik olup olmadigini gosteren sinyal |

### ComboboxInput Directive

`ngComboboxInput` yonergesi bir giris elemanini combobox'a baglar.

#### Model

| Property | Type     | Description                                                 |
| -------- | -------- | ----------------------------------------------------------- |
| `value`  | `string` | `[(value)]` kullanilarak iki yonlu baglanabilir dize degeri |

### ComboboxPopupContainer Directive

`ngComboboxPopupContainer` yonergesi acilir pencere icerigini sarar ve gorunumunu yonetir.

Bir popover elemani icinde `<ng-template>` ile kullanilmalidir.

### Related components

Otomatik tamamlama, oneri listesini render etmek icin [Listbox](/api/aria/listbox/Listbox) ve [Option](/api/aria/listbox/Option) yonergelerini kullanir. Ek ozellestirme secenekleri icin [Listbox dokumantasyonuna](/guide/aria/listbox) bakin.
