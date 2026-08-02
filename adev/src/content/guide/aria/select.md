<docs-decorative-header title="Select">
</docs-decorative-header>

## Genel Bakış

Klavye navigasyonu ve ekran okuyucu desteği ile tek seçimli açılır menüler oluşturmak için bir combobox'ı listbox ile birleştiren bir kalıp.

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

## Kullanım

Select kalıbı, kullanıcıların bilinen bir seçenek kümesinden tek bir değer seçmesi gerektiğinde en iyi çalışır.

Şu durumlarda bu kalıbı kullanmayı düşünün:

- **Seçenek listesi sabit** (20'den az öğe) - Kullanıcılar filtrelemeye gerek kalmadan tarayıp seçebilir
- **Seçenekler bilinir** - Kullanıcılar arama yapmadan seçimleri tanır
- **Formlar standart alanlar gerektiriyor** - Ülke, il, kategori veya durum seçimi
- **Ayarlar ve yapılandırma** - Tercihler veya seçenekler için açılır menüler
- **Açık seçenek etiketleri** - Her seçimin belirgin, taranabilir bir adı var

Şu durumlarda bu kalıptan kaçının:

- **Liste 20'den fazla öğe içerir** - Daha iyi filtreleme için [Autocomplete kalıbını](guide/aria/autocomplete) kullanın
- **Kullanıcıların seçenekleri araması gerekiyor** - [Autocomplete](guide/aria/autocomplete) metin girişi ve filtreleme sağlar
- **Çoklu seçim gerekli** - Bunun yerine [Multiselect kalıbını](guide/aria/multiselect) kullanın
- **Çok az seçenek var (2-3)** - Radyo butonları tüm seçimlerin daha iyi görünürlüğünü sağlar

## Özellikler

Select kalıbı, tam erişilebilir bir açılır menü sağlamak için [Combobox](guide/aria/combobox) ve [Listbox](guide/aria/listbox) yönergelerini birleştirir:

- **Klavye Navigasyonu** - Ok tuşlarıyla seçenekler arasında gezinin, Enter ile seçin, Escape ile kapatın
- **Ekran Okuyucu Desteği** - Yardımcı teknolojiler için yerleşik ARIA nitelikleri
- **Özel Görünüm** - Seçili değerleri simgeler, biçimlendirme veya zengin içerikle gösterin
- **Sinyal Tabanlı Reaktivite** - Angular sinyalleri kullanan reaktif durum yönetimi
- **Akıllı Konumlandırma** - CDK Overlay görünüm alanı kenarlarını ve kaydırmayı yönetir
- **Çift Yönlü Metin Desteği** - Sağdan sola (RTL) dilleri otomatik olarak işler

## Örnekler

### Temel select

Kullanıcıların bir değerler listesinden seçim yapmak için standart bir açılır menüye ihtiyacı vardır. Bir combobox, listbox ile eşleştirildiğinde, tam erişilebilirlik desteği ile tanıdık select deneyimi sağlar.

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

Metin girişi, `ngCombobox` yönergesinin bir `<input>` yerine doğrudan etkileşimli olmayan bir host elemanına (örneğin bir `div` veya bir `button`) uygulanmasıyla engellenir. Kullanıcılar, yerel select elemanı gibi ok tuşları ve Enter kullanarak açılır menüyle etkileşir.

### Özel görünümlü select

Seçeneklerin genellikle kullanıcıların seçimleri hızla tanımasına yardımcı olacak simgeler veya rozetler gibi görsel göstergelere ihtiyacı vardır. Seçenekler içindeki özel şablonlar, erişilebilirliği korurken zengin biçimlendirme sağlar.

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

Her seçenek etiketin yanında bir simge gösterir. Seçili değer, seçilen seçeneğin simgesini ve metnini göstermek üzere güncellenir ve net görsel geri bildirim sağlar.

### Devre dışı select

Belirli form koşulları karşılanmadığında kullanıcı etkileşimini engellemek için select'ler devre dışı bırakılabilir. Devre dışı durumu görsel geri bildirim sağlar ve klavye etkileşimini engeller.

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

Devre dışı bırakıldığında, select devre dışı görsel durum gösterir ve tüm kullanıcı etkileşimini engeller. Ekran okuyucuları yardımcı teknoloji kullanıcılarına devre dışı durumunu duyurur.

## Test etme

Select kalıbı, `@angular/aria/combobox/testing` ve `@angular/aria/listbox/testing` paketlerindeki `ComboboxHarness` ve `ListboxHarness` kombinasyonu kullanılarak test edilebilir.
Harness'leri kullanarak bir select bileşenini nasıl test edeceğinize dair bir örnek aşağıdadır:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MySelectComponent} from './my-select'; // Bileşeniniz

describe('MySelectComponent', () => {
  let fixture: ComponentFixture<MySelectComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MySelectComponent],
    });

    fixture = TestBed.createComponent(MySelectComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow selecting an option', async () => {
    // Combobox harness'ini yükle (select tetikleyicisi olarak davranır)
    const select = await loader.getHarness(ComboboxHarness);

    // Başlangıçta kapalı olduğunu doğrula
    expect(await select.isOpen()).toBe(false);

    // Açılır menüyü aç
    await select.open();
    expect(await select.isOpen()).toBe(true);

    // Açılır pencereden listbox harness'ini al
    const listbox = await select.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();
    expect(options.length).toBe(3);

    // İkinci seçeneğe tıkla
    await options[1].click();

    // Açılır menünün kapandığını ve değerin güncellendiğini doğrula
    expect(await select.isOpen()).toBe(false);
    expect(await (await select.host()).text()).toContain('Option 2');
  });
});
```

## API referansı

Ayrıntılı API belgeleri için aşağıdaki API referanslarını inceleyin:

- [`Combobox`](/api/aria/combobox/Combobox)
- [`ComboboxPopup`](/api/aria/combobox/ComboboxPopup)
- [`ComboboxWidget`](/api/aria/combobox/ComboboxWidget)
- [`Listbox`](/api/aria/listbox/Listbox)
- [`Option`](/api/aria/listbox/Option)

### Konumlandırma

Select deseni, akıllı konumlandırma için [CDK Overlay](https://material.angular.dev/cdk/overlay/overview) ile entegre olur. Görünüm alanı kenarlarını ve kaydırmayı otomatik olarak işlemek için `cdkConnectedOverlay` kullanın.
