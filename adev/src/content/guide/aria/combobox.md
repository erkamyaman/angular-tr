<docs-decorative-header title="Combobox">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" title="Combobox ARIA pattern"/>
  <docs-pill href="/api?query=combobox#angular_aria_combobox" title="Combobox API Reference"/>
</docs-pill-row>

## Genel Bakış

Bir tetikleyici eleman (metin girişi, buton veya `div` gibi) ile bir açılır pencereyi koordine eden, otomatik tamamlama, select ve multiselect kalıpları için temel yönerge sağlayan yönerge.

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

## Kullanım

Combobox, etkileşimli bir tetikleyici eleman (metin girişi, buton veya `div` gibi) ile bir açılır pencereyi koordine eden temel yönergedir. Otomatik tamamlama, select ve multiselect kalıpları için temel oluşturur. Şu durumlarda combobox'ı doğrudan kullanmayı düşünün:

- **Özel otomatik tamamlama kalıpları oluşturma** - Özelleştirilmiş filtreleme veya öneri davranışı oluşturma
- **Özel seçim bileşenleri oluşturma** - Benzersiz gereksinimleri olan açılır menüler geliştirme
- **Girişi açılır pencereyle koordine etme** - Metin girişini listbox, tree veya dialog içeriğiyle eşleştirme
- **Özel filtreleme uygulama** - Eşleşen seçenekleri kullanıcı tarafında filtreleme ve düzenleme

Bunun yerine belgelendirilmiş kalıpları kullanın:

- Filtrelemeli standart otomatik tamamlama gerektiğinde - Kullanıma hazır örnekler için [Autocomplete kalıbına](guide/aria/autocomplete) bakın
- Tek seçimli açılır menüler gerektiğinde - Eksiksiz açılır menü uygulaması için [Select kalıbına](guide/aria/select) bakın
- Çoklu seçimli açılır menüler gerektiğinde - Kompakt görüntüyle çoklu seçim için [Multiselect kalıbına](guide/aria/multiselect) bakın

NOTE: [Autocomplete](guide/aria/autocomplete), [Select](guide/aria/select) ve [Multiselect](guide/aria/multiselect) rehberleri, bu yönergeyi belirli kullanım durumları için [Listbox](guide/aria/listbox) ile birleştiren belgelendirilmiş kalıpları gösterir.

## Özellikler

Angular'ın combobox'ı, tam erişilebilir bir giriş-açılır pencere koordinasyon sistemi sağlar:

- **Açılır Pencereli Tetikleyici Eleman** - Tetikleyici elemanı açılır pencere içeriğiyle koordine eder
- **Esnek Koordinasyon** - Standart yerleşimlerle (listbox, tree, grid veya dialog) sorunsuz entegre olur
- **Klavye Navigasyonu** - Ok tuşları, Enter, Escape işlemesi
- **Ekran Okuyucu Desteği** - role="combobox" ve aria-expanded dahil yerleşik ARIA nitelikleri
- **Açılır Pencere Yönetimi** - Kullanıcı etkileşimine dayalı otomatik göster/gizle
- **Sinyal Tabanlı Reaktivite** - Angular sinyalleri kullanan reaktif durum yönetimi

## Örnekler

### Otomatik Tamamlama

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

Filtreleme, seçenekler listesini reaktif olarak filtreleyen bir sinyali güncelleyerek kullanıcı tarafında yönetilir. Kullanıcılar ok tuşlarıyla gezinir ve Enter veya tıklama ile seçer. Bu, özel seçim mantığı için tam kontrol ve maksimum esneklik sağlar. Eksiksiz filtreleme kalıpları ve örnekleri için [Autocomplete rehberine](guide/aria/autocomplete) bakın.

### Salt Okunur Modu

Tek seçimli açılır menüler oluşturmak için klavye navigasyonu ve ekran okuyucu desteği ile salt okunur combobox'ı listbox ile birleştiren bir kalıp.

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

Metin girişi olmadan bir açılır menü tetikleme, ana tetikleyici olarak bir buton kullanılarak veya giriş tetikleyicisine yerel HTML `readonly` niteliği uygulanarak gerçekleştirilebilir. Açılır pencere tıklama veya ok tuşlarıyla açılır.

Bu yapılandırma, [Select](guide/aria/select) ve [Multiselect](guide/aria/multiselect) kalıpları için temeli sağlar. Tetikleyiciler ve katman konumlandırmasıyla eksiksiz açılır menü uygulamaları için bu rehberlere bakın.

### Datepicker grid

Combobox, erişilebilir datepicker'lar oluşturmak için iki boyutlu bir grid ile koordine olabilir. Kullanıcılar takvim grid tablosundaki tarihler arasında yönlü ok tuşlarıyla gezinir ve seçimi tıklama, Enter veya Boşluk tuşu ile onaylar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Dialog Açılır Penceresi

Dialog açılır pencereleri, combobox tetikleyicisini standart dialog yerleşimleri ve odak yakalayıcılarla (CDK'nın `cdkTrapFocus`'u gibi) birleştirir. Katman modal davranış veya arka plan etkileşimi gerektirdiğinde dialog açılır pencerelerini kullanın.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Test Etme

Angular Aria, combobox bileşenlerini test etmek için bir `ComboboxHarness` sağlar.
İşte harness'ı bir bileşen testinde nasıl kullanacağınıza dair bir örnek:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {MyComboboxComponent} from './my-combobox'; // Bileşeniniz

describe('MyComboboxComponent', () => {
  let fixture: ComponentFixture<MyComboboxComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyComboboxComponent],
    });

    fixture = TestBed.createComponent(MyComboboxComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow opening and closing the popup', async () => {
    const combobox = await loader.getHarness(ComboboxHarness);

    // Başlangıç durumunu doğrula
    expect(await combobox.isOpen()).toBe(false);

    // Açılır pencereyi aç
    await combobox.open();
    expect(await combobox.isOpen()).toBe(true);

    // Açılır pencereyi kapat
    await combobox.close();
    expect(await combobox.isOpen()).toBe(false);
  });
});
```

## API'ler

### Combobox Yönergesi

Etkileşimli bir tetikleyici eleman (metin girişi, buton veya div gibi) ile bir açılır pencere konteynerini koordine eder.

#### Girdiler / Model

| Property           | Type                   | Default | Description                                                            |
| ------------------ | ---------------------- | ------- | ---------------------------------------------------------------------- |
| `value`            | `ModelSignal<string>`  | `''`    | Combobox'ın iki yönlü bağlanabilir metin değeri                        |
| `expanded`         | `ModelSignal<boolean>` | `false` | Açılır pencerenin iki yönlü bağlanabilir açık/kapalı durumu            |
| `disabled`         | `boolean`              | `false` | Combobox tetikleyici elemanını devre dışı bırakır                      |
| `softDisabled`     | `boolean`              | `true`  | Elemanı klavyeyle odaklanabilir tutarken etkileşimi devre dışı bırakır |
| `alwaysExpanded`   | `boolean`              | `false` | Açılır pencereyi her zaman açık kalmaya zorlar                         |
| `inlineSuggestion` | `string \| undefined`  | -       | Girişin sonunda vurgulanacak satır içi bir öneri ayarlar               |
| `tabIndex`         | `number \| undefined`  | -       | Combobox elemanının tabindex'i (`tabindex`'e takma ad)                 |

Tüm klavye olayları, odak koordinasyonu ve ARIA durum nitelikleri (`role="combobox"`, `aria-autocomplete` ve `aria-expanded` dahil) ana eleman üzerinde otomatik olarak yönetilir.

---

### ComboboxPopup Yönergesi

Bir `<ng-template>`'i combobox için açılır pencere konteyneri olarak işaretler.

#### Girdiler

| Property    | Type                                        | Default     | Description                                       |
| ----------- | ------------------------------------------- | ----------- | ------------------------------------------------- |
| `combobox`  | `Combobox`                                  | (Zorunlu)   | Ana `Combobox` yönergesine referans               |
| `popupType` | `'listbox' \| 'tree' \| 'grid' \| 'dialog'` | `'listbox'` | Açılır pencerenin yerleşim/rol profilini belirtir |

---

### ComboboxWidget Yönergesi

Açılır pencere içeriğini (listbox veya grid gibi) ana combobox tetikleyicisiyle bağlar.

#### Girdiler

| Property           | Type                  | Description                                                                  |
| ------------------ | --------------------- | ---------------------------------------------------------------------------- |
| `activeDescendant` | `string \| undefined` | Şu anda aktif olan seçeneğin ID'si (widget'taki aktif seçenek ID'sine bağlı) |

---

### İlgili Kalıplar ve Yönergeler

Combobox, bu belgelendirilmiş kalıplar için temel yönergedir:

- **[Autocomplete](guide/aria/autocomplete)** - Filtreleme ve öneriler kalıbı (giriş yazımını seçenekler listesiyle koordine eder)
- **[Select](guide/aria/select)** - Tek seçim açılır menü kalıbı (düzenlenemeyen buton tetikleyicilerine doğrudan uygulanır)
- **[Multiselect](guide/aria/multiselect)** - Çoklu seçim kalıbı (çoklu etkin Listbox ile düzenlenemeyen tetikleyicilere uygulanır)

Combobox tipik olarak şunlarla birleştirilir:

- **[Listbox](guide/aria/listbox)** - En yaygın açılır pencere içeriği
- **[Tree](guide/aria/tree)** - Hiyerarşik açılır pencere içeriği (örnekler için Tree rehberine bakın)
