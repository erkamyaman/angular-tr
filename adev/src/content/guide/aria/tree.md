<docs-decorative-header title="Tree">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/" title="Tree ARIA pattern"/>
  <docs-pill href="/api/aria/tree/Tree" title="Tree API Reference"/>
</docs-pill-row>

## Genel Bakış

Ağaç, öğelerin alt öğelerini ortaya çıkarmak için genişletilebileceği veya gizlemek için daraltılabileceği hiyerarşik verileri görüntüler. Kullanıcılar ok tuşlarıyla gezinir, düğümleri genişletip daraltır ve isteğe bağlı olarak navigasyon veya veri seçim senaryoları için öğeleri seçer.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.css"/>
</docs-code-multifile>

## Kullanım

Ağaçlar, kullanıcıların iç içe yapılar arasında gezinmesi gereken hiyerarşik verileri görüntülemek için iyi çalışır.

**Ağaçları şu durumlarda kullanın:**

- Dosya sistemi navigasyonu oluşturma
- Klasör ve belge hiyerarşilerini gösterme
- İç içe menü yapıları oluşturma
- Organizasyon şemalarını görüntüleme
- Hiyerarşik verilere göz atma
- İç içe bölümlerle site navigasyonu uygulama

**Ağaçlardan şu durumlarda kaçının:**

- Düz listeler görüntüleme (bunun yerine [Listbox](guide/aria/listbox) kullanın)
- Veri tabloları gösterme (bunun yerine [Grid](guide/aria/grid) kullanın)
- Basit açılır menüler oluşturma (bunun yerine [Select](guide/aria/select) kullanın)
- Breadcrumb navigasyonu oluşturma (breadcrumb kalıplarını kullanın)

## Özellikler

- **Hiyerarşik navigasyon** - Genişletme ve daraltma işlevselliğine sahip iç içe ağaç yapısı
- **Seçim modları** - Açık veya odağı takip eden davranışla tekli veya çoklu seçim
- **Seçim odağı takip eder** - Odak değiştiğinde isteğe bağlı otomatik seçim
- **Klavye navigasyonu** - Ok tuşları, Home, End ve yazarak arama
- **Genişlet/daralt** - Üst düğümleri değiştirmek için Sağ/Sol oklar veya Enter
- **Devre dışı öğeler** - Odak yönetimi ile belirli düğümleri devre dışı bırakma
- **Odak modları** - Dolaşan tabindex veya activedescendant odak stratejileri
- **RTL desteği** - Sağdan sola dil navigasyonu

## Örnekler

### Navigasyon Ağacı

Öğelere tıklamanın seçmek yerine eylem tetiklediği navigasyon için bir ağaç kullanın.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Navigasyon modunu etkinleştirmek için `[nav]="true"` ayarlayın. Bu, seçim yerine mevcut sayfayı belirtmek için `aria-current` kullanır.

### Tekli Seçim

Kullanıcıların ağaçtan bir öğe seçtiği senaryolar için tekli seçimi etkinleştirin.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Tekli seçim için `[multi]="false"` (varsayılan) olarak bırakın. Kullanıcılar odaklanılan öğeyi seçmek için Boşluk tuşuna basar.

### Çoklu Seçim

Kullanıcıların ağaçtan birden fazla öğe seçmesine izin verin.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Ağaçta `[multi]="true"` ayarlayın. Kullanıcılar Boşluk ile tek tek öğeleri seçer veya Shift+Ok tuşlarıyla aralıkları seçer.

### Seçim Odağı Takip Eder

Seçim odağı takip ettiğinde, odaklanılan öğe otomatik olarak seçilir. Bu, navigasyon senaryoları için etkileşimi basitleştirir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Ağaçta `[selectionMode]="'follow'"` ayarlayın. Kullanıcılar ok tuşlarıyla gezindikçe seçim otomatik olarak güncellenir.

### Devre Dışı Ağaç Öğeleri

Etkileşimi engellemek için belirli ağaç düğümlerini devre dışı bırakın. Devre dışı öğelerin odak alıp alamayacağını kontrol edin.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Ağaçta `[softDisabled]="true"` olduğunda, devre dışı öğeler odak alabilir ancak etkinleştirilemez veya seçilemez. `[softDisabled]="false"` olduğunda, devre dışı öğeler klavye navigasyonu sırasında atlanır.

## API'ler

### Tree

Hiyerarşik navigasyonu ve seçimi yöneten konteyner direktifi.

#### Girdiler

| Property        | Type                             | Default      | Description                                                                 |
| --------------- | -------------------------------- | ------------ | --------------------------------------------------------------------------- |
| `disabled`      | `boolean`                        | `false`      | Tüm ağacı devre dışı bırakır                                                |
| `softDisabled`  | `boolean`                        | `true`       | `true` olduğunda, devre dışı öğeler odaklanabilir ancak etkileşimsizdir     |
| `multi`         | `boolean`                        | `false`      | Birden fazla öğenin seçilip seçilemeyeceği                                  |
| `selectionMode` | `'explicit' \| 'follow'`         | `'explicit'` | Seçimin açık eylem gerektirip gerektirmediği veya odağı takip edip etmediği |
| `nav`           | `boolean`                        | `false`      | Ağacın navigasyon modunda olup olmadığı (`aria-current` kullanır)           |
| `wrap`          | `boolean`                        | `true`       | Klavye navigasyonunun son öğeden ilk öğeye sarılıp sarılmayacağı            |
| `focusMode`     | `'roving' \| 'activedescendant'` | `'roving'`   | Ağaç tarafından kullanılan odak stratejisi                                  |
| `values`        | `any[]`                          | `[]`         | Seçili öğe değerleri (çift yönlü bağlamayı destekler)                       |

#### Metodlar

| Method           | Parameters | Description                                      |
| ---------------- | ---------- | ------------------------------------------------ |
| `expandAll`      | none       | Tüm ağaç düğümlerini genişletir                  |
| `collapseAll`    | none       | Tüm ağaç düğümlerini daraltır                    |
| `selectAll`      | none       | Tüm öğeleri seçer (yalnızca çoklu seçim modunda) |
| `clearSelection` | none       | Tüm seçimi temizler                              |

### TreeItem

Ağaçta alt düğümler içerebilen bireysel bir düğüm.

#### Girdiler

| Property   | Type      | Default | Description                                                            |
| ---------- | --------- | ------- | ---------------------------------------------------------------------- |
| `value`    | `any`     | —       | **Zorunlu.** Bu ağaç öğesi için benzersiz değer                        |
| `disabled` | `boolean` | `false` | Bu öğeyi devre dışı bırakır                                            |
| `expanded` | `boolean` | `false` | Düğümün genişletilip genişletilmediği (çift yönlü bağlamayı destekler) |

#### Sinyaller

| Property      | Type              | Description                              |
| ------------- | ----------------- | ---------------------------------------- |
| `selected`    | `Signal<boolean>` | Öğenin seçili olup olmadığı              |
| `active`      | `Signal<boolean>` | Öğenin şu anda odağa sahip olup olmadığı |
| `hasChildren` | `Signal<boolean>` | Öğenin alt düğümleri olup olmadığı       |

#### Metodlar

| Method     | Parameters | Description                    |
| ---------- | ---------- | ------------------------------ |
| `expand`   | none       | Bu düğümü genişletir           |
| `collapse` | none       | Bu düğümü daraltır             |
| `toggle`   | none       | Genişletme durumunu değiştirir |

### TreeGroup

Alt ağaç öğeleri için bir konteyner.

Bu direktifin girdisi, çıktısı veya yöntemi yoktur. Alt `ngTreeItem` öğelerini düzenlemek için bir konteyner olarak hizmet eder:

```angular-html
<li ngTreeItem value="parent">
  Parent Item
  <ul ngTreeGroup>
    <li ngTreeItem value="child1">Child 1</li>
    <li ngTreeItem value="child2">Child 2</li>
  </ul>
</li>
```
