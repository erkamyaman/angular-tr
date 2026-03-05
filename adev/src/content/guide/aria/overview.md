<docs-decorative-header title="Angular Aria">
</docs-decorative-header>

## What is Angular Aria?

Erisilebilir bilesenler olusturmak basit gorunse de, bunlari W3C Erisilebilirlik Yonergelerine gore uygulamak onemli caba ve erisilebilirlik uzmanligi gerektirir.

Angular Aria, yaygin WAI-ARIA kaliplarini uygulayan basliklsiz (headless), erisilebilir yonergeler koleksiyonudur. Yonergeler klavye etkilesimlerini, ARIA niteliklerini, odak yonetimini ve ekran okuyucu destegini ele alir. Tek yapmaniz gereken HTML yapisini, CSS stilini ve is mantigini saglamaktir!

## Installation

```shell
npm install @angular/aria
```

## Showcase

Ornegin, bir arac cubugu menusunu ele alalim. Belirli bir mantikla baglanmis "basit" bir buton satiri gibi gorunse de, klavye navigasyonu ve ekran okuyuculari, erisilebilirlige asina olmayanlar icin bircok beklenmedik karmasiklik ekler.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Bu tek senaryoda gelisitiricilerin dikkate almasi gerekenler:

- **Klavye navigasyonu**. Kullanicilarin menuyu Enter veya Bosluk ile acmasi, secenekler arasinda ok tuslariyla gezinmesi, Enter ile secmesi ve Escape ile kapatmasi gerekir.
- **Ekran okuyucularin** menunun durumunu, secenek sayisini ve hangi secenegin odakta oldugunu duyurmasi gerekir.
- **Odak yonetimi** tetikleyici ve menu ogeleri arasinda mantiksal olarak hareket etmelidir.
- **Sagdan sola diller** ters yonde gezinme yetenegini gerektirir.

## What's included?

Angular Aria, yaygin etkilesimli kalipler icin kapsamli dokumantasyon, calisan ornekler ve API referanslari ile yonergeler icerir:

### Search and selection

| Component                               | Description                                                           |
| --------------------------------------- | --------------------------------------------------------------------- |
| [Autocomplete](guide/aria/autocomplete) | Kullanicilar yazarken filtrelenmis onerilerin gorundugu metin girisi  |
| [Listbox](guide/aria/listbox)           | Klavye navigasyonu ile tekli veya coklu secim secenek listeleri       |
| [Select](guide/aria/select)             | Klavye navigasyonu ile tek secimli acilir menu kalıbi                 |
| [Multiselect](guide/aria/multiselect)   | Kompakt goruntuyle coklu secimli acilir menu kalibi                   |
| [Combobox](guide/aria/combobox)         | Bir metin girisi ile bir acilir pencereyi koordine eden temel yonerge |

### Navigation and call to actions

| Component                     | Description                                                       |
| ----------------------------- | ----------------------------------------------------------------- |
| [Menu](guide/aria/menu)       | Ic ice alt menuler ve klavye kisayollari ile acilir menuler       |
| [Menubar](guide/aria/menubar) | Kalici uygulama menuleri icin yatay navigasyon cubugu             |
| [Toolbar](guide/aria/toolbar) | Mantiksal klavye navigasyonu ile gruplandirılmis kontrol kumeleri |

### Content organization

| Component                         | Description                                                             |
| --------------------------------- | ----------------------------------------------------------------------- |
| [Accordion](guide/aria/accordion) | Tek tek veya ozel olarak genisleyebilen daraltilabilir icerik panelleri |
| [Tabs](guide/aria/tabs)           | Otomatik veya manuel etkinlestirme modlariyla sekmeli arayuzler         |
| [Tree](guide/aria/tree)           | Genisletme/daraltma islevi ile hiyerarsik listeler                      |
| [Grid](guide/aria/grid)           | Hucre hucre klavye navigasyonu ile iki boyutlu veri gosterimi           |

## When to use Angular Aria

Angular Aria, ozel stilleme ile WCAG uyumlu erisilebilir etkilesimli bilesenllere ihtiyac duydugunuzda iyi calisir. Ornekler:

- **Bir tasarim sistemi olusturmak** - Ekibiniz, erisilebilir uygulamalara ihtiyac duyan belirli gorsel standartlara sahip bir bilesen kutuphanesi yonetiyorsa
- **Kurumsal bilesen kutuphaneleri** - Bir organizasyon icindeki birden fazla uygulama icin yeniden kullanilabilir bilesenler olusturuyorsaniz
- **Ozel marka gereksinimleri** - Arayuzun, onceden stillendirilmis bilesen kutuphanelerinin kolayca karsilayamayacagi hassas tasarim ozelliklerine uymasi gerekiyorsa

## When not to use Angular Aria

Angular Aria her senaryoya uymayabilir:

- **Onceden stillendirilmis bilesenler** - Ozel stilleme olmadan eksiksiz gorunen bilesenlere ihtiyaciniz varsa, bunun yerine Angular Material kullanin
- **Basit formlar** - `<button>` ve `<input type="radio">` gibi yerel HTML form kontrolleri basit kullanim durumlari icin yerlesik erisilebilirlik saglar
- **Hizli prototipleme** - Kavramlari hizla dogrularken, onceden stillendirilmis bilesen kutuphaneleri ilk gelistirme suresini azaltir

## Next steps

Yan navigasyondan veya [yukaridaki listeden](#whats-included) bir bilesene goz atin veya Angular Aria yonergelerinin nasil calistiginın tam bir ornegini gormek icin [Toolbar](guide/aria/toolbar) ile baslayin!
