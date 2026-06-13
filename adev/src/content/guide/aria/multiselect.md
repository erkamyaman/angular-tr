<docs-decorative-header title="Multiselect">
</docs-decorative-header>

## Genel Bakış

Çoklu seçim kalıbı, klavye navigasyonu ve ekran okuyucu desteğine sahip son derece erişilebilir çoklu seçimli açılır menüler oluşturmak için salt okunur bir combobox tetikleyicisini çoklu seçimli bir listbox açılır penceresiyle birleştirir.

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

## Kullanım

Çoklu seçim kalıbı, kullanıcıların bilinen bir seçenek kümesinden birden fazla ilişkili öğe seçmesi gerektiğinde en iyi çalışır.

Şu durumlarda bu kalıbı kullanmayı düşünün:

- **Kullanıcıların birden fazla seçime ihtiyacı var** - Birden fazla seçimin geçerli olduğu etiketler, kategoriler, filtreler veya etiketler
- **Seçenek listesi sabit** (20'den az öğe) - Kullanıcılar arama yapmadan seçenekleri tarayabilir
- **İçerik filtreleme** - Aynı anda birden fazla kriter aktif olabilir
- **Özellik atama** - Birden fazla değerin anlamlı olduğu etiketler, izinler veya özellikler
- **İlişkili seçimler** - Mantıksal olarak birlikte çalışan seçenekler (birden fazla takım üyesi seçmek gibi)

Şu durumlarda bu kalıptan kaçının:

- **Yalnızca tek seçim gerekli** - Daha basit tek seçimli açılır menüler için [Select kalıbını](guide/aria/select) kullanın
- **Liste 20'den fazla öğe ve arama gerekli** - Çoklu seçim yeteneğine sahip [Autocomplete kalıbını](guide/aria/autocomplete) kullanın
- **Çoğu veya tüm seçenekler seçilecek** - Bir kontrol listesi kalıbı daha iyi görünürlük sağlar
- **Seçimler bağımsız ikili seçenekler** - Bireysel onay kutuları seçimleri daha açık iletir

## Özellikler

Çoklu seçim kalıbı, tam erişilebilir bir açılır menü sağlamak için [Combobox](guide/aria/combobox) ve [Listbox](guide/aria/listbox) yönergelerini birleştirir:

- **Klavye Navigasyonu** - Ok tuşlarıyla seçenekler arasında gezinin, Boşluk ile değiştirin, Escape ile kapatın
- **Ekran Okuyucu Desteği** - aria-multiselectable dahil yerleşik ARIA nitelikleri
- **Seçim Sayısı Görünümü** - Birden fazla seçim için kompakt "Öğe + 2 daha" kalıbı gösterir
- **Sinyal Tabanlı Reaktivite** - Angular sinyalleri kullanan reaktif durum yönetimi
- **Akıllı Konumlandırma** - CDK Overlay görünüm alanı kenarlarını ve kaydırmayı yönetir
- **Kalıcı Seçim** - Seçili seçenekler, seçimden sonra onay işaretleriyle görünür kalır

## Örnekler

### Temel çoklu seçim

Kullanıcıların bir seçenek listesinden birden fazla öğe seçmesi gerekir. Salt okunur combobox, çoklu etkin listbox ile eşleştirildiğinde, tam erişilebilirlik desteği ile tanıdık çoklu seçim işlevi sağlar.

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

`ngListbox` üzerindeki `multi` niteliği çoklu seçimi etkinleştirir. Seçenekleri değiştirmek için Boşluk'a basın ve açılır pencere ek seçimler için açık kalır. Gösterim, ilk seçili öğeyi ardından kalan seçimlerin sayısını gösterir.

### Özel görünümlü çoklu seçim

Seçeneklerin genellikle kullanıcıların seçimleri tanımasına yardımcı olacak simgeler veya renkler gibi görsel göstergelere ihtiyacı vardır. Seçenekler içindeki özel şablonlar, görünüm değeri kompakt bir özet gösterirken zengin biçimlendirme sağlar.

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

Her seçenek etiketinin yanında bir simge gösterir. Görünüm değeri, seçilen seçeneğin simgesini ve metnini, ardından ek seçimlerin sayısını göstermek üzere güncellenir. Seçili seçenekler net görsel geri bildirim için bir onay işareti gösterir.

### Kontrollü seçim

Formlar bazen seçim sayısını sınırlamak veya kullanıcı seçimlerini doğrulamak gerektirir. Seçim üzerinde programatik kontrol, erişilebilirliği korurken bu kısıtlamaları sağlar.

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

Bu örnek seçimleri iki öğeyle sınırlar. Sınıra ulaşıldığında, daha fazla seçimi engellemek için seçilmemiş seçenekler devre dışı bırakılır ve combobox gösterimi seçimleri yansıtacak şekilde güncellenir.

## Test etme

Çoklu seçim kalıbı, `@angular/aria/combobox/testing` ve `@angular/aria/listbox/testing` paketlerindeki `ComboboxHarness` ve `ListboxHarness` kombinasyonu kullanılarak test edilebilir.
Harness'leri kullanarak bir çoklu seçim bileşenini nasıl test edeceğinize dair bir örnek aşağıdadır:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MyMultiselectComponent} from './my-multiselect'; // Bileşeniniz

describe('MyMultiselectComponent', () => {
  let fixture: ComponentFixture<MyMultiselectComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyMultiselectComponent],
    });

    fixture = TestBed.createComponent(MyMultiselectComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow selecting multiple options', async () => {
    const select = await loader.getHarness(ComboboxHarness);

    // Açılır menüyü aç
    await select.open();

    // Açılır pencereden listbox harness'ini al
    const listbox = await select.getPopupWidget(ListboxHarness);
    expect(await listbox.isMulti()).toBe(true);

    const options = await listbox.getOptions();

    // Birinci ve ikinci seçenekleri seç
    await options[0].click();
    await options[1].click();

    // Her iki seçeneğin de seçili olduğunu doğrula
    expect(await options[0].isSelected()).toBe(true);
    expect(await options[1].isSelected()).toBe(true);

    // Açılır menüyü kapat
    await select.close();

    // Değerin güncellendiğini doğrula (ör. virgülle ayrılmış liste veya sayı)
    expect(await (await select.host()).text()).toContain('Option 1, Option 2');
  });
});
```

## API'ler

Çoklu seçim kalıbı, Angular'ın Aria kütüphanesindeki aşağıdaki yönergeleri kullanır. Bağlantılı rehberlerdeki tam API dokümantasyonuna bakın.

### Combobox yönergeleri

Çoklu seçim kalıbı, select benzeri bir çoklu seçim açılır menüsü oluşturmak için `ngCombobox` yönergesini doğrudan tetikleyici öğe (`div` veya `button` gibi) üzerinde kullanır.

#### Girişler

| Property   | Type      | Default | Description                         |
| ---------- | --------- | ------- | ----------------------------------- |
| `disabled` | `boolean` | `false` | Tüm çoklu seçimi devre dışı bırakır |

Mevcut tüm girişler ve sinyaller hakkında eksiksiz bilgi için [Combobox API dokümantasyonuna](guide/aria/combobox#apiler) bakın.

#### Açılır pencere yönergeleri

Yapısal `ngComboboxPopup` yönergesi, katman şablonunu işaretler ve ana combobox'a bir referans gerektirir:

| Property   | Type       | Description                       |
| ---------- | ---------- | --------------------------------- |
| `combobox` | `Combobox` | Ana `Combobox`'a zorunlu referans |

#### ComboboxWidget yönergesi

`ngComboboxWidget` yönergesi, aktif soyundan (active-descendant) odak takibini desteklemek için listbox ile combobox tetikleyicisi arasında köprü kurar.

| Property           | Type                  | Description                                                                                                                                         |
| ------------------ | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `activeDescendant` | `string \| undefined` | Tetikleyicideki `aria-activedescendant` niteliğini güncellemek için o anda aktif olan seçeneğin kimliği (`listbox.activeDescendant()` ile bağlanır) |

### Listbox yönergeleri

Çoklu seçim kalıbı, çoklu seçim için `multi` niteliği ile `ngListbox` ve her seçilebilir öğe için `ngOption` kullanır.

#### Girişler

| Property        | Type                               | Default    | Description                                                                                                                              |
| --------------- | ---------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `multi`         | `boolean`                          | `false`    | Çoklu seçimi etkinleştirmek için `true` olarak ayarlayın                                                                                 |
| `selectionMode` | `'follow'` \| `'explicit'`         | `'follow'` | Seçeneklerin aktif odağı takip etmek yerine tıklama/Boşluk ile açıkça değiştirilmesi için `'explicit'` olarak ayarlayın                  |
| `focusMode`     | `'roving'` \| `'activedescendant'` | `'roving'` | Listbox tarafından kullanılan odak stratejisi. Tarayıcı odağının combobox tetikleyicisinde kalması için `'activedescendant'` ayarlayın.  |
| `tabIndex`      | `number`                           | `0`        | Listbox'ın tabindex'i. Aktif soyundan modunda klavye odağının açılır pencere kapsayıcısına girmesini önlemek için `-1` olarak ayarlayın. |

#### Model

| Property | Type                 | Description                                     |
| -------- | -------------------- | ----------------------------------------------- |
| `value`  | `ModelSignal<any[]>` | Seçili değerlerin iki yönlü bağlanabilir dizisi |

`multi` true olduğunda, kullanıcılar seçimi değiştirmek için Boşluk kullanarak birden fazla seçenek seçebilir. Açılır pencere seçimden sonra açık kalır ve ek seçimlere izin verir.

Listbox yapılandırması, seçim modları ve seçenek özellikleri hakkında eksiksiz bilgi için [Listbox API dokümantasyonuna](guide/aria/listbox#apiler) bakın.

### Konumlandırma

Çoklu seçim kalıbı, akıllı konumlandırma için [CDK Overlay](https://material.angular.io/cdk/overlay/overview) ile entegre olur. Görünüm alanı kenarlarını ve kaydırmayı otomatik olarak yönetmek için `cdkConnectedOverlay` kullanın.
