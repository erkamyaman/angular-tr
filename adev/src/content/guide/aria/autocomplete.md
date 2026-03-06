<docs-decorative-header title="Autocomplete">
</docs-decorative-header>

## Genel Bakış

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

## Kullanım

Otomatik tamamlama, kullanıcıların yazmanın kaydırmadan daha hızlı olduğu büyük bir seçenek kümesinden seçim yapması gerektiğinde en iyi çalışır. Şu durumlarda otomatik tamamlama kullanmayı düşünün:

- **Seçenek listesi uzun** (20'den fazla öğe) - Yazmak, bir açılır menüyü kaydırmaya göre seçimleri daha hızlı daraltır
- **Kullanıcılar ne aradıklarını biliyor** - Beklenen değerin bir kısmını yazabilirler (il adı, ürün veya kullanıcı adı gibi)
- **Seçenekler tahmin edilebilir kalıpları takip ediyor** - Kullanıcılar kısmi eşleşmeleri tahmin edebilir (ülke kodları, e-posta alanları veya kategoriler gibi)
- **Hız önemli** - Formlar kapsamlı navigasyon olmadan hızlı seçimden faydalanır

Şu durumlarda otomatik tamamlamadan kaçının:

- Listede 10'dan az seçenek var - Düzgün bir açılır menü veya radyo grubu daha iyi görünürlük sağlar
- Kullanıcıların seçeneklere göz atması gerekiyor - Keşfetmek önemliyse, tüm seçenekleri önceden gösterin
- Seçenekler bilinmiyor - Kullanıcılar listede var olduğunu bilmedikleri şeyleri yazamaz

## Özellikler

Angular'ın otomatik tamamlaması, tam erişilebilir bir combobox uygulaması sağlar:

- **Klavye Navigasyonu** - Ok tuşlarıyla seçenekler arasında gezinin, Enter ile seçin, Escape ile kapatın
- **Ekran Okuyucu Desteği** - Yardımcı teknolojiler için yerleşik ARIA nitelikleri
- **Üç Filtre Modu** - Otomatik seçim, manuel seçim veya vurgulama davranışı arasında seçim yapın
- **Sinyal Tabanlı Reaktivite** - Angular sinyalleri kullanan reaktif durum yönetimi
- **Popover API Entegrasyonu** - Optimum konumlandırma için yerel HTML Popover API'sinden yararlanır
- **Çift Yönlü Metin Desteği** - Sağdan sola (RTL) dilleri otomatik olarak işler

## Örnekler

### Otomatik seçim modu

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

### Manuel seçim modu

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
