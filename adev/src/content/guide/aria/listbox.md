<docs-decorative-header title="Listbox">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" title="Listbox pattern"/>
  <docs-pill href="/api?query=listbox#angular_aria_listbox" title="Listbox API Reference"/>
</docs-pill-row>

## Genel Bakış

Kullanıcıların seçim yapabileceği bir seçenek listesi gösteren, klavye navigasyonu, tekli veya çoklu seçim ve ekran okuyucu desteği sağlayan yönerge.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Kullanım

Listbox, [Select](guide/aria/select), [Multiselect](guide/aria/multiselect) ve [Autocomplete](guide/aria/autocomplete) kalıpları tarafından kullanılan temel bir yönergedir. Çoğu açılır menü ihtiyacı için bunun yerine bu belgelendirilmiş kalıpları kullanın.

Şu durumlarda listbox'ı doğrudan kullanmayı düşünün:

- **Özel seçim bileşenleri oluşturma** - Belirli davranışa sahip özelleştirilmiş arayüzler oluşturma
- **Görünür seçim listeleri** - Seçilebilir öğeleri doğrudan sayfada gösterme (açılır menülerde değil)
- **Özel entegrasyon kalıpları** - Benzersiz açılır pencere veya yerleşim gereksinimleriyle entegrasyon

Listbox'tan kaçının:

- **Navigasyon menüleri gerektiğinde** - Eylemler ve komutlar için [Menu](guide/aria/menu) yönergesini kullanın

## Özellikler

Angular'ın listbox'ı tam erişilebilir bir liste uygulaması sağlar:

- **Klavye Navigasyonu** - Ok tuşlarıyla seçenekler arasında gezinin, Enter veya Boşluk ile seçin
- **Ekran Okuyucu Desteği** - role="listbox" dahil yerleşik ARIA nitelikleri
- **Tekli veya Çoklu Seçim** - `multi` niteliği seçim modunu kontrol eder
- **Yatay veya Dikey** - Yerleşim yönü için `orientation` niteliği
- **Yazarak arama** - Eşleşen seçeneklere atlamak için karakterleri yazın
- **Sinyal Tabanlı Reaktivite** - Angular sinyalleri kullanan reaktif durum yönetimi

## Örnekler

### Temel Listbox

Uygulamaların bazen bir açılır menüde gizlenmiş yerine doğrudan sayfada görünen seçilebilir listelere ihtiyacı vardır. Bağımsız bir listbox, bu görünen liste arayüzleri için klavye navigasyonu ve seçim sağlar.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html" />
</docs-code-multifile>

`values` model sinyali seçili öğelere iki yönlü bağlama sağlar. `selectionMode="explicit"` ile kullanıcılar seçenekleri seçmek için Boşluk veya Enter'a basar. Listbox'ı combobox ve katman konumlandırmasıyla birleştiren açılır menü kalıpları için [Select](guide/aria/select) kalıbına bakın.

### Yatay Listbox

Listeler bazen yatay olarak daha iyi çalışır, örneğin araç çubuğu benzeri arayüzler veya sekme tarzı seçimler. `orientation` niteliği hem yerleşimi hem de klavye navigasyon yönünü değiştirir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`orientation="horizontal"` ile yukarı ve aşağı ok tuşları yerine sol ve sağ ok tuşları seçenekler arasında gezinir. Listbox, navigasyon yönünü tersine çevirerek sağdan sola (RTL) dilleri otomatik olarak işler.

### Seçim Modları

Listbox, öğelerin ne zaman seçileceğini kontrol eden iki seçim modunu destekler.

`'follow'` modu odaklanan öğeyi otomatik olarak seçer, seçim sık değiştiğinde daha hızlı etkileşim sağlar. `'explicit'` modu, gezinirken kazara değişiklikleri önlemek için seçimi onaylamak için Boşluk veya Enter gerektirir. Açılır menü kalıpları genellikle tek seçim için `'follow'` modunu kullanır.

#### Explicit

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.html" />
</docs-code-multifile>

#### Follow

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.html" />
</docs-code-multifile>

| Mode         | Description                                                                                |
| ------------ | ------------------------------------------------------------------------------------------ |
| `'follow'`   | Odaklanan öğeyi otomatik olarak seçer, seçim sık değiştiğinde daha hızlı etkileşim sağlar  |
| `'explicit'` | Seçimi onaylamak için Boşluk veya Enter gerektirir, gezinirken kazara değişiklikleri önler |

TIP: Açılır menü kalıpları genellikle tek seçim için `'follow'` modunu kullanır.

## API'ler

### Listbox Yönergesi

`ngListbox` yönergesi seçilebilir seçeneklerden oluşan erişilebilir bir liste oluşturur.

#### Girdiler

| Property         | Type                               | Default      | Description                                     |
| ---------------- | ---------------------------------- | ------------ | ----------------------------------------------- |
| `id`             | `string`                           | auto         | Listbox için benzersiz tanımlayıcı              |
| `multi`          | `boolean`                          | `false`      | Çoklu seçimi etkinleştirir                      |
| `orientation`    | `'vertical'` \| `'horizontal'`     | `'vertical'` | Listenin yerleşim yönü                          |
| `wrap`           | `boolean`                          | `true`       | Odağın liste kenarlarında sarılıp sarılmadığı   |
| `selectionMode`  | `'follow'` \| `'explicit'`         | `'follow'`   | Seçimin nasıl tetiklendiği                      |
| `focusMode`      | `'roving'` \| `'activedescendant'` | `'roving'`   | Odak yönetim stratejisi                         |
| `softDisabled`   | `boolean`                          | `true`       | Devre dışı öğelerin odaklanabilir olup olmadığı |
| `disabled`       | `boolean`                          | `false`      | Tüm listbox'ı devre dışı bırakır                |
| `readonly`       | `boolean`                          | `false`      | Listbox'ı salt okunur yapar                     |
| `typeaheadDelay` | `number`                           | `500`        | Yazarak arama sıfırlanmadan önceki milisaniye   |

#### Model

| Property | Type  | Description                                     |
| -------- | ----- | ----------------------------------------------- |
| `values` | `V[]` | Seçili değerlerin iki yönlü bağlanabilir dizisi |

#### Sinyaller

| Property | Type          | Description                           |
| -------- | ------------- | ------------------------------------- |
| `values` | `Signal<V[]>` | Şu anda seçili değerler sinyal olarak |

#### Metodlar

| Method                     | Parameters                        | Description                   |
| -------------------------- | --------------------------------- | ----------------------------- |
| `scrollActiveItemIntoView` | `options?: ScrollIntoViewOptions` | Aktif öğeyi görünüme kaydırır |
| `gotoFirst`                | none                              | Listbox'taki ilk öğeye gider  |

### Option Yönergesi

`ngOption` yönergesi bir listbox içindeki bir öğeyi işaretler.

#### Girdiler

| Property   | Type      | Default | Description                                |
| ---------- | --------- | ------- | ------------------------------------------ |
| `id`       | `string`  | auto    | Seçenek için benzersiz tanımlayıcı         |
| `value`    | `V`       | -       | Bu seçenekle ilişkili değer (zorunlu)      |
| `label`    | `string`  | -       | Ekran okuyucuları için isteğe bağlı etiket |
| `disabled` | `boolean` | `false` | Bu seçeneğin devre dışı olup olmadığı      |

#### Sinyaller

| Property   | Type              | Description                       |
| ---------- | ----------------- | --------------------------------- |
| `selected` | `Signal<boolean>` | Bu seçeneğin seçili olup olmadığı |
| `active`   | `Signal<boolean>` | Bu seçeneğin odakta olup olmadığı |

### İlgili Kalıplar

Listbox, şu belgelendirilmiş açılır menü kalıpları tarafından kullanılır:

- **[Select](guide/aria/select)** - Salt okunur combobox + listbox kullanan tek seçimli açılır menü kalıbı
- **[Multiselect](guide/aria/multiselect)** - Salt okunur combobox + `multi` ile listbox kullanan çoklu seçimli açılır menü kalıbı
- **[Autocomplete](guide/aria/autocomplete)** - Combobox + listbox kullanan filtrelenebilir açılır menü kalıbı

Tetikleyici, açılır pencere ve katman konumlandırmasıyla eksiksiz açılır menü kalıpları için, listbox'ı tek başına kullanmak yerine bu kalıp rehberlerine bakın.

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" title="Listbox ARIA pattern"/>
  <docs-pill href="/api/aria/listbox/Listbox" title="Listbox API Reference"/>
</docs-pill-row>
