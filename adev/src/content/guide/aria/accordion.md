<docs-decorative-header title="Accordion">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" title="Accordion ARIA pattern"/>
  <docs-pill href="/api?query=accordion#angular_aria_accordion" title="Accordion API Reference"/>
</docs-pill-row>

## Genel Bakış

Bir akordeon, ilgili içeriği genişletilebilir ve daraltılabilir bölümlere düzenleyerek sayfa kaydırmayı azaltır ve kullanıcıların ilgili bilgilere odaklanmasına yardımcı olur. Her bölümün bir tetikleyici butonu ve bir içerik paneli vardır. Bir tetikleyiciye tıklamak, ilişkili panelin görünürlüğünü değiştirir.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
</docs-code-multifile>

## Kullanım

Akordeonlar, kullanıcıların genellikle aynı anda bir bölümü görüntülemeye ihtiyaç duydukları mantıksal gruplara içerik düzenleme için iyi çalışır.

**Akordeon kullanin:**

- Birden fazla soru ve yanıt içeren SSS gösterimi
- Uzun formları yönetilebilir bölümlere düzenleme
- İçerik ağırlıklı sayfalarda kaydırmayı azaltma
- İlgili bilgileri kademeli olarak açıklama

**Akordeondan kacinin:**

- Navigasyon menüleri oluştururken (bunun yerine [Menu](guide/aria/menu) bileşenini kullanın)
- Sekmeli arayüzler oluştururken (bunun yerine [Tabs](guide/aria/tabs) bileşenini kullanın)
- Tek bir daraltılabilir bölüm gösterirken (bunun yerine bir açıklama kalıbı kullanın)
- Kullanıcıların aynı anda birden fazla bölümü görmesi gerektiğinde (farklı bir yerleşim düşünün)

## Özellikler

- **Genişleme modları** - Aynı anda bir veya birden fazla panelin açık olup olmayacağını kontrol edin
- **Klavye navigasyonu** - Ok tuşları, Home ve End ile tetikleyiciler arasında gezinin
- **Tembel render** - İçerik yalnızca bir panel ilk kez genişletildiğinde oluşturulur, ilk yükleme performansını iyileştirir
- **Devre dışı durumlar** - Tüm grubu veya bireysel tetikleyicileri devre dışı bırakın
- **Odak yönetimi** - Devre dışı bırakılan öğelerin klavye odağı alıp alamayacağını kontrol edin
- **Programatik kontrol** - Bileşen kodunuzdan panelleri genişletin, daraltın veya değiştirin
- **RTL desteği** - Sağdan sola diller için otomatik destek

## Örnekler

### Tekli genişleme modu

Aynı anda yalnızca bir panelin açık olmasına izin vermek için `[multiExpandable]="false"` ayarlayın. Yeni bir panel açmak, daha önce açık olan paneli otomatik olarak kapatır.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Bu mod, SSS'ler veya kullanıcıların aynı anda bir yanıta odaklanmasını istediğiniz durumlar için iyi çalışır.

### Çoklu genişleme modu

Birden fazla panelin aynı anda açık olmasına izin vermek için `[multiExpandable]="true"` ayarlayın. Kullanıcılar diğerlerini kapatmadan ihtiyaç duyduğu kadar panel genişletebilir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Bu mod, form bölümleri veya kullanıcıların birden fazla panel arasında içeriği karşılaştırması gerektiğinde kullanışlıdır.

NOTE: `multiExpandable` girdisi varsayılan olarak `true`'dur. Tek genişleme davranışı istiyorsanız açıkça `false` olarak ayarlayın.

### Devre dışı akordeon öğeleri

`disabled` girdisini kullanarak belirli tetikleyicileri devre dışı bırakın. Devre dışı bırakılan öğelerin klavye navigasyonu sırasındaki davranışını akordeon grubundaki `softDisabled` girdisi ile kontrol edin.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`[softDisabled]="true"` olduğunda (varsayılan), devre dışı bırakılan öğeler odak alabilir ancak etkinleştirilemez. `[softDisabled]="false"` olduğunda, devre dışı bırakılan öğeler klavye navigasyonu sırasında tamamen atlanır.

### Tembel içerik render etme

Panel ilk kez genişletilene kadar içerik render etmeyi ertelemek için bir `ng-template` üzerinde `ngAccordionContent` yönergesini kullanın. Bu, resimler, grafikler veya karmaşık bileşenler gibi ağır içerikli akordeonlar için performansı iyileştirir.

```angular-html
<div ngAccordionGroup>
  <div>
    <button ngAccordionTrigger panelId="item-1">Trigger Text</button>
    <div ngAccordionPanel panelId="item-1">
      <ng-template ngAccordionContent>
        <!-- Bu içerik yalnızca panel ilk açıldığında render edilir -->
        <img src="large-image.jpg" alt="Description" />
        <app-expensive-component />
      </ng-template>
    </div>
  </div>
</div>
```

Varsayılan olarak, panel daraltıldıktan sonra içerik DOM'da kalır. Panel kapatıldığında içeriği DOM'dan kaldırmak için `[preserveContent]="false"` ayarlayın.

## API'ler

### AccordionGroup

Bir grup akordeon öğesi için klavye navigasyonunu ve genişleme davranışını yöneten kapsayıcı yönerge.

#### Girdiler

| Property          | Type      | Default | Description                                                                     |
| ----------------- | --------- | ------- | ------------------------------------------------------------------------------- |
| `disabled`        | `boolean` | `false` | Gruptaki tüm tetikleyicileri devre dışı bırakır                                 |
| `multiExpandable` | `boolean` | `true`  | Birden fazla panelin aynı anda genişletilip genişletilemeyeceği                 |
| `softDisabled`    | `boolean` | `true`  | `true` olduğunda, devre dışı öğelere odaklanılabilir. `false` olduğunda atlanır |
| `wrap`            | `boolean` | `false` | Klavye navigasyonunun son öğeden ilk öğeye ve tam tersi dönüp dönmeyeceği       |

#### Yöntemler

| Method        | Parameters | Description                                                                    |
| ------------- | ---------- | ------------------------------------------------------------------------------ |
| `expandAll`   | none       | Tüm panelleri genişletir (yalnızca `multiExpandable` `true` olduğunda çalışır) |
| `collapseAll` | none       | Tüm panelleri daraltır                                                         |

### AccordionTrigger

Panel görünürlüğünü değiştiren buton elemanına uygulanan yönerge.

#### Girdiler

| Property   | Type      | Default | Description                                                       |
| ---------- | --------- | ------- | ----------------------------------------------------------------- |
| `id`       | `string`  | auto    | Tetikleyici için benzersiz tanımlayıcı                            |
| `panelId`  | `string`  | —       | **Zorunlu.** İlişkili panelin `panelId`'si ile eşleşmelidir       |
| `disabled` | `boolean` | `false` | Bu tetikleyiciyi devre dışı bırakır                               |
| `expanded` | `boolean` | `false` | Panelin genişletilmiş olup olmadığı (iki yönlü bağlama destekler) |

#### Sinyaller

| Property | Type              | Description                                 |
| -------- | ----------------- | ------------------------------------------- |
| `active` | `Signal<boolean>` | Tetikleyicinin şu anda odakta olup olmadığı |

#### Yöntemler

| Method     | Parameters | Description                         |
| ---------- | ---------- | ----------------------------------- |
| `expand`   | none       | İlişkili paneli genişletir          |
| `collapse` | none       | İlişkili paneli daraltır            |
| `toggle`   | none       | Panel genişleme durumunu değiştirir |

### AccordionPanel

Daraltılabilir içeriği içeren elemana uygulanan yönerge.

#### Girdiler

| Property          | Type      | Default | Description                                                        |
| ----------------- | --------- | ------- | ------------------------------------------------------------------ |
| `id`              | `string`  | auto    | Panel için benzersiz tanımlayıcı                                   |
| `panelId`         | `string`  | —       | **Zorunlu.** İlişkili tetikleyicinin `panelId`'si ile eşleşmelidir |
| `preserveContent` | `boolean` | `true`  | Panel daraltıldıktan sonra içeriğin DOM'da tutulup tutulmayacağı   |

#### Sinyaller

| Property  | Type              | Description                                 |
| --------- | ----------------- | ------------------------------------------- |
| `visible` | `Signal<boolean>` | Panelin şu anda genişletilmiş olup olmadığı |

#### Yöntemler

| Method     | Parameters | Description                   |
| ---------- | ---------- | ----------------------------- |
| `expand`   | none       | Bu paneli genişletir          |
| `collapse` | none       | Bu paneli daraltır            |
| `toggle`   | none       | Genişleme durumunu değiştirir |

### AccordionContent

Tembel render etmeyi etkinleştirmek için akordeon paneli içindeki `ng-template`'e uygulanan yapısal yönerge.

Bu yönergenin girdisi, çıktısı veya yöntemi yoktur. Bir `ng-template` elemanına uygulayın:

```angular-html
<div ngAccordionPanel panelId="item-1">
  <ng-template ngAccordionContent>
    <!-- Buradaki içerik tembel olarak render edilir -->
  </ng-template>
</div>
```
