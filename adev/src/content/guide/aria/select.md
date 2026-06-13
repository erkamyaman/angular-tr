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

## API'ler

Select kalıbı, Angular'ın Aria kütüphanesindeki aşağıdaki yönergeleri kullanır. Bağlantılı rehberlerdeki tam API dokümantasyonuna bakın.

### Combobox Yönergeleri

Select kalıbı, klavye navigasyonunu korurken metin girişini engellemek için `ngCombobox`'ı doğrudan etkileşimli olmayan bir host elemanına (örneğin bir `div` veya bir `button`) uygular.

#### Girişler

| Property   | Type                   | Default | Description                     |
| ---------- | ---------------------- | ------- | ------------------------------- |
| `disabled` | `boolean`              | `false` | Tüm select'i devre dışı bırakır |
| `expanded` | `ModelSignal<boolean>` | `false` | Select'in genişletilmiş durumu  |

Mevcut tüm girişler ve sinyaller hakkında eksiksiz bilgi için [Combobox API dokümantasyonuna](guide/aria/combobox#apiler) bakın.

#### Popup Yönergeleri

Yapısal `ngComboboxPopup` yönergesi, overlay şablonunu işaretler ve üst combobox'a bir referans gerektirir:

| Property   | Type       | Description                            |
| ---------- | ---------- | -------------------------------------- |
| `combobox` | `Combobox` | Üst `Combobox`'a gerekli olan referans |

#### ComboboxWidget Yönergesi

`ngComboboxWidget` yönergesi, active-descendant odak takibini desteklemek için listbox'ı combobox tetikleyicisiyle köprüler.

| Property           | Type                  | Description                                                                                                                                            |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `activeDescendant` | `string \| undefined` | Tetikleyicideki `aria-activedescendant` niteliğini güncellemek için o anda aktif olan seçeneğin ID'si (`listbox.activeDescendant()` değerine bağlanır) |

### Listbox Yönergeleri

Select kalıbı, açılır liste için `ngListbox` ve her seçilebilir öğe için `ngOption` kullanır.

#### Girişler

| Property        | Type                               | Default      | Description                                                                                                                                    |
| --------------- | ---------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `selectionMode` | `'follow'` \| `'explicit'`         | `'explicit'` | Seçeneklerin aktif odağı izlemek yerine tıklama/Enter ile açıkça değiştirilmesi için `'explicit'` olarak ayarlayın                             |
| `focusMode`     | `'roving'` \| `'activedescendant'` | `'roving'`   | Listbox tarafından kullanılan odak stratejisi. Tarayıcı odağının combobox tetikleyicisinde kalması için `'activedescendant'` olarak ayarlayın. |
| `tabIndex`      | `number`                           | `0`          | Listbox'ın tabindex'i. Active-descendant modunda klavye odağının açılır pencere kabına girmesini önlemek için `-1` olarak ayarlayın.           |

#### Model

| Property | Type                 | Description                                                                    |
| -------- | -------------------- | ------------------------------------------------------------------------------ |
| `value`  | `ModelSignal<any[]>` | Seçili değerlerin iki yönlü bağlanabilir dizisi (select için tek değer içerir) |

### Konumlandırma

Select kalıbı, akıllı konumlandırma için [CDK Overlay](https://material.angular.io/cdk/overlay/overview) ile entegre olur. Görünüm alanı kenarlarını ve kaydırmayı otomatik olarak yönetmek için `cdkConnectedOverlay` kullanın.
