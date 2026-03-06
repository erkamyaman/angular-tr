<docs-decorative-header title="Tabs">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" title="Tabs ARIA pattern"/>
  <docs-pill href="/api/aria/tabs/Tabs" title="Tabs API Reference"/>
</docs-pill-row>

## Genel Bakış

Sekmeler, aynı anda yalnızca bir panelin görünebildiği katmanlı içerik bölümleri gösterir. Kullanıcılar sekme butonlarına tıklayarak veya sekme listesinde gezinmek için ok tuşları kullanarak paneller arasında geçiş yapar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Kullanım

Sekmeler, kullanıcıların farklı görünümler veya kategoriler arasında geçiş yaptığı, ilişkili içeriği farklı bölümlere düzenlemek için iyi çalışır.

**Sekmeleri kullanın:**

- İlişkili içeriği farklı bölümlere düzenlerken
- Birden fazla kategoriye sahip ayar panelleri oluştururken
- Birden fazla konuya sahip dokümantasyon oluştururken
- Farklı görünümlere sahip kontrol panelleri uygularken
- Kullanıcıların bağlam değiştirmesi gerektiği içeriği gösterirken

**Sekmelerden kaçının:**

- Sıralı formlar veya sihirbazlar oluştururken (bir adım kalıbı kullanın)
- Sayfalar arasında gezinirken (yönlendirici navigasyonu kullanın)
- Tek içerik bölümleri gösterirken (sekmelere gerek yok)
- 7-8'den fazla sekme olduğunda (farklı bir yerleşim düşünün)

## Özellikler

- **Seçim modları** - Sekmeler odaklandığında otomatik olarak etkinleşir veya manuel etkinleştirme gerektirir
- **Klavye navigasyonu** - Ok tuşları, Home ve End ile verimli sekme navigasyonu
- **Yön** - Yatay veya dikey sekme listesi yerleşimi
- **Tembel içerik** - Sekme panelleri yalnızca ilk etkinleştirildiğinde oluşturulur
- **Devre dışı sekmeler** - Odak yönetimiyle bireysel sekmeleri devre dışı bırakın
- **Odak modları** - Dolaşan tabindex veya activedescendant odak stratejileri
- **RTL desteği** - Sağdan sola dil navigasyonu

## Örnekler

### Seçim odağı takip eder

Seçim odağı takip ettiğinde, ok tuşlarıyla gezindikçe sekmeler anında etkinleşir. Bu anında geri bildirim sağlar ve hafif içerik için iyi çalışır.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/selection-follows-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Bu davranışı etkinleştirmek için sekme listesinde `[selectionMode]="'follow'"` ayarlayın.

### Manuel etkinleştirme

Manuel etkinleştirmede, ok tuşları seçili sekmeyi değiştirmeden sekmeler arasında odak taşır. Kullanıcılar odaklanan sekmeyi etkinleştirmek için Boşluk veya Enter'a basar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/explicit-selection/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Gereksiz render'ı önlemek için ağır içerik panellerinde `[selectionMode]="'explicit'"` kullanın.

### Dikey sekmeler

Ayar panelleri veya navigasyon kenar çubukları gibi arayüzler için sekmeleri dikey olarak düzenleyin.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/vertical/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Sekme listesinde `[orientation]="'vertical'"` ayarlayın. Navigasyon Yukarı/Aşağı ok tuşlarına değişir.

### Tembel içerik render'ı

Sekme panellerinin ilk gösterilene kadar render edilmesini ertelemek için bir `ng-template` üzerinde `ngTabContent` yönergesini kullanın.

```angular-html
<div ngTabs>
  <ul ngTabList [(selectedTab)]="selectedTab">
    <li ngTab value="tab1">Tab 1</li>
    <li ngTab value="tab2">Tab 2</li>
  </ul>

  <div ngTabPanel value="tab1">
    <ng-template ngTabContent>
      <!-- Bu içerik yalnızca Sekme 1 ilk gösterildiğinde render edilir -->
      <app-heavy-component />
    </ng-template>
  </div>

  <div ngTabPanel value="tab2">
    <ng-template ngTabContent>
      <!-- Bu içerik yalnızca Sekme 2 ilk gösterildiğinde render edilir -->
      <app-another-component />
    </ng-template>
  </div>
</div>
```

Varsayılan olarak, panel gizlendikten sonra içerik DOM'da kalır. Panel devre dışı bırakıldığında içeriği DOM'dan kaldırmak için `[preserveContent]="false"` ayarlayın.

### Devre dışı sekmeler

Kullanıcı etkileşimini engellemek için belirli sekmeleri devre dışı bırakın. Devre dışı sekmelerin klavye odağı alıp alamayacağını kontrol edin.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/tabs/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Sekme listesinde `[softDisabled]="true"` olduğunda, devre dışı sekmeler odak alabilir ancak etkinleştirilemez. `[softDisabled]="false"` olduğunda, devre dışı sekmeler klavye navigasyonu sırasında atlanır.

## API'ler

### Tabs

Sekme listeleri ve panelleri koordine eden kapsayıcı yönerge.

Bu yönergenin girişi veya çıktısı yoktur. `ngTabList`, `ngTab` ve `ngTabPanel` yönergeleri için kök kapsayıcı görevi görür.

### TabList

Seçim ve klavye navigasyonunu yöneten sekme butonları için kapsayıcı.

#### Girişler

| Property        | Type                         | Default        | Description                                                                 |
| --------------- | ---------------------------- | -------------- | --------------------------------------------------------------------------- |
| `orientation`   | `'horizontal' \| 'vertical'` | `'horizontal'` | Sekme listesi yerleşim yönü                                                 |
| `wrap`          | `boolean`                    | `false`        | Klavye navigasyonunun son sekmeden ilk sekmeye sarılıp sarılmadığı          |
| `softDisabled`  | `boolean`                    | `true`         | `true` olduğunda, devre dışı sekmeler odaklanabilir ancak etkinleştirilemez |
| `selectionMode` | `'follow' \| 'explicit'`     | `'follow'`     | Sekmelerin odaklandığında mı yoksa açık etkinleştirme mi gerektirdiği       |
| `selectedTab`   | `any`                        | —              | Şu anda seçili sekmenin değeri (iki yönlü bağlama destekler)                |

### Tab

Bireysel bir sekme butonu.

#### Girişler

| Property   | Type      | Default | Description                                |
| ---------- | --------- | ------- | ------------------------------------------ |
| `value`    | `any`     | —       | **Zorunlu.** Bu sekme için benzersiz değer |
| `disabled` | `boolean` | `false` | Bu sekmeyi devre dışı bırakır              |

#### Sinyaller

| Property   | Type              | Description                           |
| ---------- | ----------------- | ------------------------------------- |
| `selected` | `Signal<boolean>` | Sekmenin şu anda seçili olup olmadığı |
| `active`   | `Signal<boolean>` | Sekmenin şu anda odakta olup olmadığı |

### TabPanel

Bir sekmeyle ilişkili içerik paneli.

#### Girişler

| Property          | Type      | Default | Description                                                                 |
| ----------------- | --------- | ------- | --------------------------------------------------------------------------- |
| `value`           | `any`     | —       | **Zorunlu.** İlişkili sekmenin `value` değeri ile eşleşmelidir              |
| `preserveContent` | `boolean` | `true`  | Devre dışı bırakılmadan sonra panel içeriğinin DOM'da tutulup tutulmayacağı |

#### Sinyaller

| Property  | Type              | Description                           |
| --------- | ----------------- | ------------------------------------- |
| `visible` | `Signal<boolean>` | Panelin şu anda görünür olup olmadığı |

### TabContent

Sekme panel içeriğini tembel render etmek için yapısal yönerge.

Bu yönergenin girişi, çıktısı veya yöntemi yoktur. Bir sekme paneli içindeki `ng-template` elemanına uygulayın:

```angular-html
<div ngTabPanel value="tab1">
  <ng-template ngTabContent>
    <!-- Buradaki içerik tembel olarak render edilir -->
  </ng-template>
</div>
```
