<docs-decorative-header title="Menu">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" title="Menu ARIA pattern"/>
  <docs-pill href="/api/aria/menu/Menu" title="Menu API Reference"/>
</docs-pill-row>

## Genel Bakış

Bir menü, kullanıcılara eylemler veya seçenekler listesi sunar, tipik olarak bir buton tıklaması veya sağ tıklama yanıtı olarak görünür. Menüler ok tuşlarıyla klavye navigasyonunu, alt menüleri, onay kutularını, radyo butonlarını ve devre dışı öğeleri destekler.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Kullanım

Menüler, kullanıcıların seçebileceği eylem veya komut listeleri sunmak için iyi çalışır.

**Menü kullanın:**

- Uygulama komut menüleri oluştururken (Dosya, Düzenle, Görüntüle)
- Bağlam menüleri oluştururken (sağ tıklama eylemleri)
- Açılır eylem listeleri gösterirken
- Araç çubuğu açılır menüleri uygularken
- Ayarları veya seçenekleri düzenlerken

**Menülerden kaçının:**

- Site navigasyonu oluştururken (bunun yerine navigasyon yer işaretlerini kullanın)
- Form select'leri oluştururken (bunun yerine [Select](guide/aria/select) bileşenini kullanın)
- İçerik panelleri arasında geçiş yaparken (bunun yerine [Tabs](guide/aria/tabs) kullanın)
- Daraltılabilir içerik gösterirken (bunun yerine [Accordion](guide/aria/accordion) kullanın)

## Özellikler

- **Klavye navigasyonu** - Ok tuşları, Home/End ve karakter arama ile verimli navigasyon
- **Alt menüler** - Otomatik konumlandırma ile iç içe menü desteği
- **Menü türleri** - Bağımsız menüler, tetikleyicili menüler ve menü çubukları
- **Onay kutuları ve radyolar** - Değiştirme ve seçim menü öğeleri
- **Devre dışı öğeler** - Odak yönetimiyle yumuşak veya sert devre dışı durumlar
- **Otomatik kapanma davranışı** - Seçimde yapılandırılabilir kapanma
- **RTL desteği** - Sağdan sola dil navigasyonu

## Örnekler

### Tetikleyicili menü

Bir tetikleyici butonla bir menüyü eşleştirerek açılır menü oluşturun. Tetikleyici menüyü açar ve kapatır.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Kullanıcı bir öğe seçtiğinde veya Escape'e bastığında menü otomatik olarak kapanır.

### Bağlam menüsü

Bağlam menüleri, kullanıcılar bir elemana sağ tıkladığında imleç konumunda görünür.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-context/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-context/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-context/app/app.html"/>
</docs-code-multifile>

Menüyü `contextmenu` olay koordinatlarını kullanarak konumlandırın.

### Bağımsız menü

Bağımsız menü bir tetikleyici gerektirmez ve arayüzde görünür kalır.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Bağımsız menüler her zaman görünen eylem listeleri veya navigasyon için iyi çalışır.

### Devre dışı menü öğeleri

`disabled` girişini kullanarak belirli menü öğelerini devre dışı bırakın. `softDisabled` ile odak davranışını kontrol edin.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`[softDisabled]="true"` olduğunda, devre dışı öğeler odak alabilir ancak etkinleştirilemez. `[softDisabled]="false"` olduğunda, devre dışı öğeler klavye navigasyonu sırasında atlanır.

## API'ler

### Menu

Menü öğeleri için kapsayıcı yönerge.

#### Girişler

| Property       | Type      | Default | Description                                                                  |
| -------------- | --------- | ------- | ---------------------------------------------------------------------------- |
| `disabled`     | `boolean` | `false` | Menüdeki tüm öğeleri devre dışı bırakır                                      |
| `wrap`         | `boolean` | `true`  | Klavye navigasyonunun kenarlarda sarılıp sarılmadığı                         |
| `softDisabled` | `boolean` | `true`  | `true` olduğunda, devre dışı öğeler odaklanabilir ancak etkileşimli değildir |

#### Yöntemler

| Method  | Parameters | Description    |
| ------- | ---------- | -------------- |
| `close` | none       | Menüyü kapatır |

### MenuBar

Birden fazla menü için yatay kapsayıcı.

#### Girişler

| Property       | Type      | Default | Description                                                                  |
| -------------- | --------- | ------- | ---------------------------------------------------------------------------- |
| `disabled`     | `boolean` | `false` | Tüm menü çubuğunu devre dışı bırakır                                         |
| `wrap`         | `boolean` | `true`  | Klavye navigasyonunun kenarlarda sarılıp sarılmadığı                         |
| `softDisabled` | `boolean` | `true`  | `true` olduğunda, devre dışı öğeler odaklanabilir ancak etkileşimli değildir |

### MenuItem

Bir menü içindeki bireysel bir öğe.

#### Girişler

| Property     | Type      | Default | Description                                                   |
| ------------ | --------- | ------- | ------------------------------------------------------------- |
| `value`      | `any`     | —       | **Zorunlu.** Bu öğenin değeri                                 |
| `disabled`   | `boolean` | `false` | Bu menü öğesini devre dışı bırakır                            |
| `submenu`    | `Menu`    | —       | Bir alt menüye referans                                       |
| `searchTerm` | `string`  | `''`    | Yazarak arama için arama terimi (iki yönlü bağlama destekler) |

#### Sinyaller

| Property   | Type              | Description                                  |
| ---------- | ----------------- | -------------------------------------------- |
| `active`   | `Signal<boolean>` | Öğenin şu anda odakta olup olmadığı          |
| `expanded` | `Signal<boolean>` | Alt menünün genişletilmiş olup olmadığı      |
| `hasPopup` | `Signal<boolean>` | Öğenin ilişkili bir alt menüsü olup olmadığı |

NOTE: MenuItem genel yöntemler sunmaz. Alt menüleri menü öğeleriyle ilişkilendirmek için `submenu` girişini kullanın.

### MenuTrigger

Bir menüyü açan buton veya eleman.

#### Girişler

| Property       | Type      | Default | Description                                            |
| -------------- | --------- | ------- | ------------------------------------------------------ |
| `menu`         | `Menu`    | —       | **Zorunlu.** Tetiklenecek menü                         |
| `disabled`     | `boolean` | `false` | Tetikleyiciyi devre dışı bırakır                       |
| `softDisabled` | `boolean` | `true`  | `true` olduğunda, devre dışı tetikleyici odaklanabilir |

#### Sinyaller

| Property   | Type              | Description                                      |
| ---------- | ----------------- | ------------------------------------------------ |
| `expanded` | `Signal<boolean>` | Menünün şu anda açık olup olmadığı               |
| `hasPopup` | `Signal<boolean>` | Tetikleyicinin ilişkili bir menüsü olup olmadığı |

#### Yöntemler

| Method   | Parameters | Description                        |
| -------- | ---------- | ---------------------------------- |
| `open`   | none       | Menüyü açar                        |
| `close`  | none       | Menüyü kapatır                     |
| `toggle` | none       | Menüyü aç/kapa durumunu değiştirir |
