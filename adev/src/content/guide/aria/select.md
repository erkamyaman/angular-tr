<docs-decorative-header title="Select">
</docs-decorative-header>

## Overview

Klavye navigasyonu ve ekran okuyucu destegi ile tek secimli acilir menuler olusturmak icin salt okunur combobox'i listbox ile birlestiren bir kalip.

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

## Usage

Select kalibi, kullanicilarin bilinen bir secenek kumesinden tek bir deger secmesi gerektiginde en iyi calisir.

Su durumlarda bu kalibi kullanmayi dusunun:

- **Secenek listesi sabit** (20'den az oge) - Kullanicilar filtrelemeye gerek kalmadan tarayip secebilir
- **Secenekler bilinir** - Kullanicilar arama yapmadan secimleri tanir
- **Formlar standart alanlar gerektiriyor** - Ulke, il, kategori veya durum secimi
- **Ayarlar ve yapilandirma** - Tercihler veya secenekler icin acilir menuler
- **Acik secenek etiketleri** - Her secimin belirgin, taranabilir bir adi var

Su durumlarda bu kaliptan kacinin:

- **Liste 20'den fazla oge icerir** - Daha iyi filtreleme icin [Autocomplete kalibini](guide/aria/autocomplete) kullanin
- **Kullanicilarin secenekleri aramasi gerekiyor** - [Autocomplete](guide/aria/autocomplete) metin girisi ve filtreleme saglar
- **Coklu secim gerekli** - Bunun yerine [Multiselect kalibini](guide/aria/multiselect) kullanin
- **Cok az secenek var (2-3)** - Radyo butonlari tum secimlerin daha iyi gorunurlugunu saglar

## Features

Select kalibi, tam erisilebilir bir acilir menu saglamak icin [Combobox](guide/aria/combobox) ve [Listbox](guide/aria/listbox) yonergelerini birlestirir:

- **Klavye Navigasyonu** - Ok tuslariyla secenekler arasinda gezinin, Enter ile secin, Escape ile kapatin
- **Ekran Okuyucu Destegi** - Yardimci teknolojiler icin yerlesik ARIA nitelikleri
- **Ozel Gorunum** - Secili degerleri simgeler, bicimlendirme veya zengin icerikle gosterin
- **Sinyal Tabanli Reaktivite** - Angular sinyalleri kullanan reaktif durum yonetimi
- **Akilli Konumlandirma** - CDK Overlay gorunum alani kenarlarini ve kaydirmayi yonetir
- **Cift Yonlu Metin Destegi** - Sagdan sola (RTL) dilleri otomatik olarak isler

## Examples

### Basic select

Kullanicilarin bir degerler listesinden secim yapmak icin standart bir acilir menuye ihtiyaci vardir. Salt okunur combobox, listbox ile eslestirildiginde, tam erisilebilirlik destegi ile tanidik select deneyimi saglar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`ngCombobox` uzerindeki `readonly` niteligi, klavye navigasyonunu korurken metin girisini engeller. Kullanicilar, yerel select elemani gibi ok tuslari ve Enter kullanarak acilir menuyle etkilesir.

### Select with custom display

Seceneklerin genellikle kullanicilarin secimleri hizla tanimasina yardimci olacak simgeler veya rozetler gibi gorsel gostergelere ihtiyaci vardir. Secenekler icindeki ozel sablonlar, erisilebilirligi korurken zengin bicimlendirme saglar.

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

Her secenek etiketin yaninda bir simge gosterir. Secili deger, secilen secenegin simgesini ve metnini gostermek uzere guncellenir ve net gorsel geri bildirim saglar.

### Disabled select

Belirli form kosullari karsilanmadiginda kullanici etkilesimini engellemek icin select'ler devre disi birakilabilir. Devre disi durumu gorsel geri bildirim saglar ve klavye etkilesimini engeller.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Devre disi birakildiginda, select devre disi gorsel durum gosterir ve tum kullanici etkilesimini engeller. Ekran okuyuculari yardimci teknoloji kullanicilarina devre disi durumunu duyurur.

## APIs

Select kalibi, Angular'in Aria kutuphanesindeki asagidaki yonergeleri kullanir. Baglantili rehberlerdeki tam API dokumantasyonuna bakin.

### Combobox Directives

Select kalibi, klavye navigasyonunu korurken metin girisini engellemek icin `readonly` niteligi ile `ngCombobox` kullanir.

#### Inputs

| Property   | Type      | Default | Description                                                   |
| ---------- | --------- | ------- | ------------------------------------------------------------- |
| `readonly` | `boolean` | `false` | Acilir menu davranisi olusturmak icin `true` olarak ayarlayin |
| `disabled` | `boolean` | `false` | Tum select'i devre disi birakir                               |

Mevcut tum girisler ve sinyaller hakkinda eksiksiz bilgi icin [Combobox API dokumantasyonuna](guide/aria/combobox#apis) bakin.

### Listbox Directives

Select kalibi, acilir liste icin `ngListbox` ve her secilebilir oge icin `ngOption` kullanir.

#### Model

| Property | Type    | Description                                                                    |
| -------- | ------- | ------------------------------------------------------------------------------ |
| `values` | `any[]` | Secili degerlerin iki yonlu baglanabilir dizisi (select icin tek deger icerir) |

Listbox yapilandirmasi, secim modlari ve secenek ozellikleri hakkinda eksiksiz bilgi icin [Listbox API dokumantasyonuna](guide/aria/listbox#apis) bakin.

### Positioning

Select kalibi, akilli konumlandirma icin [CDK Overlay](api/cdk/overlay/CdkConnectedOverlay) ile entegre olur. Gorunum alani kenarlarini ve kaydirmayi otomatik olarak yonetmek icin `cdkConnectedOverlay` kullanin.
