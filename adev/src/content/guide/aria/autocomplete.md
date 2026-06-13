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
- **Dinamik Vurgulama Davranışı** - Satır içi seçim önerileri için yerleşik destek
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

### Signal Forms Entegrasyonu

Angular Aria, sinyal tabanlı [Signal Forms](guide/forms/signals/overview) API'siyle sorunsuz şekilde entegre olur. Karmaşık girdileri, `FormValueControl` uygulayan yeniden kullanılabilir özel kontrol bileşenlerinde kapsülleyebilirsiniz.

Aşağıdaki örnek, `FormValueControl<string>` uygulayan, `[formField]` ile üst forma bağlanan ve şema doğrulama kurallarıyla korunan bir ülke seçici bileşenini gösterir.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.html"/>
  <docs-code header="country-selector.ts" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/country-selector.ts"/>
  <docs-code header="country-selector.html" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/country-selector.html"/>
  <docs-code header="country-selector.css" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/country-selector.css"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/signal-forms/app/app.css"/>
</docs-code-multifile>

## Test Etme

Otomatik tamamlama deseni, `@angular/aria/combobox/testing` ve `@angular/aria/listbox/testing` paketlerinden `ComboboxHarness` ve `ListboxHarness` birleşimiyle test edilebilir.
Bir otomatik tamamlama bileşenini test etmek için harness'lerin nasıl kullanılacağına dair bir örnek:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MyAutocompleteComponent} from './my-autocomplete'; // Bileşeniniz

describe('MyAutocompleteComponent', () => {
  let fixture: ComponentFixture<MyAutocompleteComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyAutocompleteComponent],
    });

    fixture = TestBed.createComponent(MyAutocompleteComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should filter options based on input', async () => {
    const combobox = await loader.getHarness(ComboboxHarness);

    // Filtrelemeyi tetiklemek için girişe yazın
    await combobox.setValue('ap');
    expect(await combobox.isOpen()).toBe(true);

    // Açılır pencereden listbox harness'ini alın
    const listbox = await combobox.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();

    // Seçeneklerin filtrelendiğini doğrulayın (örn. 'Apple', 'Apricot')
    expect(options.length).toBe(2);
    expect(await options[0].getText()).toBe('Apple');

    // İlk seçeneği seçin
    await options[0].click();

    // Giriş değerinin güncellendiğini ve açılır pencerenin kapandığını doğrulayın
    expect(await combobox.isOpen()).toBe(false);
    expect(await combobox.getValue()).toBe('Apple');
  });
});
```

## APIs

### Combobox Directive

`ngCombobox` yonergesi, klavye tetikleyicilerini ve popover durumlarini yonetmek icin dogrudan duzenlenebilir metin `<input>` veya `<textarea>` uzerine uygulanir.

#### Inputs

| Property           | Type                  | Default     | Description                                                          |
| ------------------ | --------------------- | ----------- | -------------------------------------------------------------------- |
| `disabled`         | `boolean`             | `false`     | Combobox'i devre disi birakir                                        |
| `softDisabled`     | `boolean`             | `true`      | Devre disi birakildiginda odaklanilabilir                            |
| `inlineSuggestion` | `string \| undefined` | `undefined` | Otomatik tamamlama modlari icin satir ici tamamlama onerisi gosterir |

#### Models

| Property   | Type                   | Default | Description                                                                      |
| ---------- | ---------------------- | ------- | -------------------------------------------------------------------------------- |
| `value`    | `ModelSignal<string>`  | `''`    | Girisin `[(value)]` ile iki yonlu baglanabilir degeri                            |
| `expanded` | `ModelSignal<boolean>` | `false` | Acilir pencerenin `[(expanded)]` ile iki yonlu baglanabilir genisletilmis durumu |

---

### ComboboxPopup Directive

Acilir pencere olarak kullanilan kapsayiciyi isaretlemek icin `<ng-template>` uzerine uygulanan yapisal bir yonerge.

#### Inputs

| Property   | Type       | Description                       |
| ---------- | ---------- | --------------------------------- |
| `combobox` | `Combobox` | Ust `Combobox`'a zorunlu referans |

---

### ComboboxWidget Directive

Etkin alt oge (active-descendant) odak degisikliklerini giris tetikleyicisine kopruleyebilmek icin acilir pencere icerik kapsayicisina uygulanir.

#### Inputs

| Property           | Type                  | Description                                                                   |
| ------------------ | --------------------- | ----------------------------------------------------------------------------- |
| `activeDescendant` | `string \| undefined` | Su anda etkin olan alt ogenin ID'si (`listbox.activeDescendant()`'a baglanir) |

---

### Listbox Directives

Otomatik tamamlama oneri listeleri, standart bagimsiz (standalone) listbox yonergelerini kullanir.

#### Inputs

| Property        | Type                               | Default    | Description                                                                                      |
| --------------- | ---------------------------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `selectionMode` | `'follow'` \| `'explicit'`         | `'follow'` | Manuel/explicit modda, guncellemeler odagi takip etmek yerine tiklama/Enter ile acikca uygulanir |
| `focusMode`     | `'roving'` \| `'activedescendant'` | `'roving'` | Tarayici odaginin tetikleyici giriste kalmasi icin `'activedescendant'` olarak ayarlayin         |
| `tabIndex`      | `number`                           | `0`        | Klavye tab odaginin acilir listbox kapsayicisina girmesini engellemek icin `-1` olarak ayarlayin |

#### Models

| Property | Type                 | Description                                                         |
| -------- | -------------------- | ------------------------------------------------------------------- |
| `value`  | `ModelSignal<any[]>` | `[(value)]` kullanilarak iki yonlu baglanabilir secili deger dizisi |

---

### Related components

Otomatik tamamlama, standart bagimsiz (standalone) [Listbox](/api/aria/listbox/Listbox) ve [Option](/api/aria/listbox/Option) yonergelerini kullanir. Gelismis secenekler icin [Listbox dokumantasyonuna](/guide/aria/listbox) bakin.
