<docs-decorative-header title="Multiselect">
</docs-decorative-header>

## Overview

Klavye navigasyonu ve ekran okuyucu destegi ile coklu secimli acilir menuler olusturmak icin salt okunur combobox'i coklu etkin listbox ile birlestiren bir kalip.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Usage

Coklu secim kalibi, kullanicilarin bilinen bir secenek kumesinden birden fazla iliskili oge secmesi gerektiginde en iyi calisir.

Su durumlarda bu kalibi kullanmayi dusunun:

- **Kullanicilarin birden fazla secime ihtiyaci var** - Birden fazla secimin gecerli oldugu etiketler, kategoriler, filtreler veya etiketler
- **Secenek listesi sabit** (20'den az oge) - Kullanicilar arama yapmadan secenekleri tarayabilir
- **Icerik filtreleme** - Ayni anda birden fazla kriter aktif olabilir
- **Ozellik atama** - Birden fazla degerin anlamli oldugu etiketler, izinler veya ozellikler
- **Iliskili secimler** - Mantiksal olarak birlikte calisan secenekler (birden fazla takim uyesi secmek gibi)

Su durumlarda bu kaliptan kacinin:

- **Yalnizca tek secim gerekli** - Daha basit tek secimli acilir menuler icin [Select kalibini](guide/aria/select) kullanin
- **Liste 20'den fazla oge ve arama gerekli** - Coklu secim yetenegine sahip [Autocomplete kalibini](guide/aria/autocomplete) kullanin
- **Cogu veya tum secenekler secilecek** - Bir kontrol listesi kalibi daha iyi gorunurluk saglar
- **Secimler bagimsiz ikili secenekler** - Bireysel onay kutulari secimleri daha acik iletir

## Features

Coklu secim kalibi, tam erisilebilir bir acilir menu saglamak icin [Combobox](guide/aria/combobox) ve [Listbox](guide/aria/listbox) yonergelerini birlestirir:

- **Klavye Navigasyonu** - Ok tuslariyla secenekler arasinda gezinin, Bosluk ile degistirin, Escape ile kapatin
- **Ekran Okuyucu Destegi** - aria-multiselectable dahil yerlesik ARIA nitelikleri
- **Secim Sayisi Gorunumu** - Birden fazla secim icin kompakt "Oge + 2 daha" kalibi gosterir
- **Sinyal Tabanli Reaktivite** - Angular sinyalleri kullanan reaktif durum yonetimi
- **Akilli Konumlandirma** - CDK Overlay gorunum alani kenarlarini ve kaydirmayi yonetir
- **Kalici Secim** - Secili secenekler, secimden sonra onay isaretleriyle gorunur kalir

## Examples

### Basic multiselect

Kullanicilarin bir secenek listesinden birden fazla oge secmesi gerekir. Salt okunur combobox, coklu etkin listbox ile eslestirildiginde, tam erisilebilirlik destegi ile tanidik coklu secim islevi saglar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`ngListbox` uzerindeki `multi` niteligi coklu secimi etkinlestirir. Secenekleri degistirmek icin Bosluk'a basin ve acilir pencere ek secimler icin acik kalir. Gosterim, ilk secili ogeyi ardindan kalan secimlerin sayisini gosterir.

### Multiselect with custom display

Seceneklerin genellikle kullanicilarin secimleri tanimasina yardimci olacak simgeler veya renkler gibi gorsel gostergelere ihtiyaci vardir. Secenekler icindeki ozel sablonlar, gorunum degeri kompakt bir ozet gosterirken zengin bicimlendirme saglar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Her secenek etiketinin yaninda bir simge gosterir. Gorunum degeri, secilen secenegin simgesini ve metnini, ardindan ek secimlerin sayisini gostermek uzere guncellenir. Secili secenekler net gorsel geri bildirim icin bir onay isareti gosterir.

### Controlled selection

Formlar bazen secim sayisini sinirlamak veya kullanici secimlerini dogrulamak gerektirir. Secim uzerinde programatik kontrol, erisilebilirligi korurken bu kisitlamalari saglar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Bu ornek secimleri uc ogeyle sinirlar. Sinira ulasildiginda, secilmemis secenekler devre disi olur ve ek secimleri engeller. Bir mesaj kullanicilari kisitlama hakkinda bilgilendirir.

## APIs

Coklu secim kalibi, Angular'in Aria kutuphanesindeki asagidaki yonergeleri kullanir. Baglantili rehberlerdeki tam API dokumantasyonuna bakin.

### Combobox Directives

Coklu secim kalibi, klavye navigasyonunu korurken metin girisini engellemek icin `readonly` niteligi ile `ngCombobox` kullanir.

#### Inputs

| Property   | Type      | Default | Description                                                   |
| ---------- | --------- | ------- | ------------------------------------------------------------- |
| `readonly` | `boolean` | `false` | Acilir menu davranisi olusturmak icin `true` olarak ayarlayin |
| `disabled` | `boolean` | `false` | Tum coklu secimi devre disi birakir                           |

Mevcut tum girisler ve sinyaller hakkinda eksiksiz bilgi icin [Combobox API dokumantasyonuna](guide/aria/combobox#apis) bakin.

### Listbox Directives

Coklu secim kalibi, coklu secim icin `multi` niteligi ile `ngListbox` ve her secilebilir oge icin `ngOption` kullanir.

#### Inputs

| Property | Type      | Default | Description                                              |
| -------- | --------- | ------- | -------------------------------------------------------- |
| `multi`  | `boolean` | `false` | Coklu secimi etkinlestirmek icin `true` olarak ayarlayin |

#### Model

| Property | Type    | Description                                     |
| -------- | ------- | ----------------------------------------------- |
| `values` | `any[]` | Secili degerlerin iki yonlu baglanabilir dizisi |

`multi` true oldugunda, kullanicilar secimi degistirmek icin Bosluk kullanarak birden fazla secenek secebilir. Acilir pencere secimden sonra acik kalir ve ek secimlere izin verir.

Listbox yapilandirmasi, secim modlari ve secenek ozellikleri hakkinda eksiksiz bilgi icin [Listbox API dokumantasyonuna](guide/aria/listbox#apis) bakin.

### Positioning

Coklu secim kalibi, akilli konumlandirma icin [CDK Overlay](api/cdk/overlay/CdkConnectedOverlay) ile entegre olur. Gorunum alani kenarlarini ve kaydirmayi otomatik olarak yonetmek icin `cdkConnectedOverlay` kullanin.
