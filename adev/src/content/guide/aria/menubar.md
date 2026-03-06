<docs-decorative-header title="Menubar">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" title="Menubar ARIA pattern"/>
  <docs-pill href="/api/aria/menu/MenuBar" title="Menubar API Reference"/>
</docs-pill-row>

## Genel Bakış

Menü çubuğu, uygulama menülerine kalıcı erişim sağlayan yatay bir navigasyon çubuğudur. Menü çubukları komutları Dosya, Düzenle ve Görüntüle gibi mantıksal kategorilere düzenleyerek kullanıcıların klavye veya fare etkileşimi aracılığıyla uygulama özelliklerini keşfetmesine ve çalıştırmasına yardımcı olur.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Kullanım

Menü çubukları, uygulama komutlarını kalıcı ve keşfedilebilir navigasyona düzenlemek için iyi çalışır.

**Menü çubuğu kullanın:**

- Uygulama komut çubukları oluştururken (Dosya, Düzenle, Görüntüle, Ekle, Biçimlendir gibi)
- Arayüz genelinde görünen kalıcı navigasyon oluştururken
- Komutları mantıksal üst düzey kategorilere düzenlerken
- Klavye destekli yatay menü navigasyonuna ihtiyaç duyulduğunda
- Masaüstü tarzı uygulama arayüzleri oluştururken

**Menü çubuğundan kaçının:**

- Bireysel eylemler için açılır menüler oluştururken (bunun yerine [tetikleyicili Menu](guide/aria/menu) kullanın)
- Bağlam menüleri oluştururken ([Menu](guide/aria/menu) rehber kalıbını kullanın)
- Basit bağımsız eylem listeleri için (bunun yerine [Menu](guide/aria/menu) kullanın)
- Yatay alanın sınırlı olduğu mobil arayüzlerde
- Navigasyon bir kenar çubuğu veya başlık navigasyon kalıbına ait olduğunda

## Özellikler

- **Yatay navigasyon** - Sol/Sağ ok tuşları üst düzey kategoriler arasında hareket eder
- **Kalıcı görünürlük** - Her zaman görünür, modal veya kapatılabilir değil
- **Üzerine gelindiğinde açma** - İlk klavye veya tıklama etkileşiminden sonra alt menüler üzerine gelindiğinde açılır
- **İç içe alt menüler** - Birden fazla menü derinlik seviyesini destekler
- **Klavye navigasyonu** - Ok tuşları, Enter/Boşluk, Escape ve yazarak arama
- **Devre dışı durumlar** - Tüm menü çubuğunu veya bireysel öğeleri devre dışı bırakın
- **RTL desteği** - Otomatik sağdan sola dil navigasyonu

## Örnekler

### Temel menü çubuğu

Bir menü çubuğu, üst düzey kategorilere düzenlenmiş uygulama komutlarına kalıcı erişim sağlar. Kullanıcılar kategoriler arasında Sol/Sağ ok tuşlarıyla gezinir ve menüleri Enter veya Aşağı ok tuşuyla açar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Dosya, Düzenle ve Görüntüle arasında hareket etmek için Sağ ok tuşuna basın. Bir menüyü açmak ve alt menü öğeleri arasında Yukarı/Aşağı ok tuşlarıyla gezinmek için Enter veya Aşağı ok tuşuna basın.

### Devre dışı menü çubuğu öğeleri

Etkileşimi engellemek için belirli menü öğelerini veya tüm menü çubuğunu devre dışı bırakın. Devre dışı öğelerin klavye navigasyonu sırasında klavye odağı alıp alamayacağını `softDisabled` girişi ile kontrol edin.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Menü çubuğunda `[softDisabled]="true"` olduğunda, devre dışı öğeler odak alabilir ancak etkinleştirilemez. `[softDisabled]="false"` olduğunda, devre dışı öğeler klavye navigasyonu sırasında atlanır.

### RTL desteği

Menü çubukları sağdan sola (RTL) dillere otomatik olarak uyum sağlar. Ok tuşu navigasyonu yönünü tersine çevirir ve alt menüler sol tarafa konumlanır.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`dir="rtl"` niteliği RTL modunu etkinleştirir. Sol ok sağa, sağ ok sola hareket eder ve RTL dil kullanıcıları için doğal navigasyonu korur.

## API'ler

Menü çubuğu kalıbı, Angular'ın Aria kütüphanesindeki yönergeleri kullanır. Eksiksiz API dokümantasyonu için [Menu rehberine](guide/aria/menu) bakın.

### MenuBar

Üst düzey menü öğeleri için yatay kapsayıcı.

#### Girişler

| Property       | Type      | Default | Description                                                                  |
| -------------- | --------- | ------- | ---------------------------------------------------------------------------- |
| `disabled`     | `boolean` | `false` | Tüm menü çubuğunu devre dışı bırakır                                         |
| `wrap`         | `boolean` | `true`  | Klavye navigasyonunun son öğeden ilk öğeye sarılıp sarılmadığı               |
| `softDisabled` | `boolean` | `true`  | `true` olduğunda, devre dışı öğeler odaklanabilir ancak etkileşimli değildir |

Mevcut tüm girişler ve sinyaller hakkında eksiksiz bilgi için [Menu API dokümantasyonuna](guide/aria/menu#apiler) bakın.

### MenuItem

Menü çubuğu içindeki bireysel öğeler. Menu ile aynı API - [MenuItem](guide/aria/menu#menuitem) sayfasına bakın.

**Menü çubuğuna özel davranış:**

- Sol/Sağ ok tuşları menü çubuğu öğeleri arasında gezinir (dikey menülerdeki Yukarı/Aşağı yerine)
- İlk klavye etkileşimi veya tıklama alt menüler için üzerine gelindiğinde açmayı etkinleştirir
- Enter veya Aşağı ok tuşu alt menüyü açar ve ilk öğeye odaklanır
- `aria-haspopup="menu"` alt menülere sahip öğeleri gösterir

### MenuTrigger

Menü çubuklarında genellikle kullanılmaz - MenuItem, ilişkili bir alt menüsü olduğunda tetikleyici davranışını doğrudan yönetir. Bağımsız menü tetikleyici kalıpları için [MenuTrigger](guide/aria/menu#menutrigger) sayfasına bakın.
