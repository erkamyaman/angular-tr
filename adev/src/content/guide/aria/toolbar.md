<docs-decorative-header title="Toolbar">
</docs-decorative-header>

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/" title="Toolbar ARIA pattern"/>
  <docs-pill href="/api/aria/toolbar/Toolbar" title="Toolbar API Reference"/>
</docs-pill-row>

## Genel Bakış

Klavye navigasyonu ile ilgili kontrolleri ve eylemleri gruplamak için kullanılan bir kapsayıcı; genellikle metin biçimlendirme, araç çubukları ve komut panelleri için kullanılır.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Usage

Toolbar, kullanıcıların sık eriştiği ilgili kontrolleri gruplamak için en iyi şekilde çalışır. Şu durumlarda toolbar kullanmayı düşünün:

- **Birden fazla ilgili eylem** - İlgili işlevleri gerçekleştiren birkaç kontrolünüz var (metin biçimlendirme düğmeleri gibi)
- **Klavye verimliliği önemli** - Kullanıcılar ok tuşları aracılığıyla hızlı klavye navigasyonundan faydalanır
- **Gruplanmış kontroller** - Kontrolleri ayırıcılarla mantıksal bölümlere organize etmeniz gerekiyor
- **Sık erişim** - Kontroller bir iş akışı içinde tekrar tekrar kullanılıyor

Şu durumlarda toolbar'dan kaçının:

- Basit bir düğme grubu yeterliyse - Sadece 2-3 ilgisiz eylem için ayrı düğmeler daha iyi çalışır
- Kontroller ilişkili değilse - Toolbar mantıksal bir gruplama ima eder; ilgisiz kontroller kullanıcıları karıştırır
- Karmaşık iç içe navigasyon - Derin hiyerarşiler menüler veya navigasyon bileşenleri tarafından daha iyi karşılanır

## Features

Angular'ın toolbar'ı tam erişilebilir bir araç çubuğu uygulaması sağlar:

- **Klavye Navigasyonu** - Ok tuşlarıyla widget'lar arasında gezinin, Enter veya Space ile etkinleştirin
- **Ekran Okuyucu Desteği** - Yardımcı teknolojiler için yerleşik ARIA öznitelikleri
- **Widget Grupları** - Radyo düğmesi grupları veya geçiş düğmesi grupları gibi ilgili widget'ları organize edin
- **Esnek Yönelim** - Otomatik klavye navigasyonu ile yatay veya dikey düzenler
- **Sinyal Tabanlı Reaktivite** - Angular sinyalleri kullanarak reaktif durum yönetimi
- **Çift Yönlü Metin Desteği** - Sağdan sola (RTL) dilleri otomatik olarak yönetir
- **Yapılandırılabilir Odak** - Kenarlarda sarmalama navigasyonu veya sert duraklar arasında seçim yapın

## Examples

### Basic horizontal toolbar

Yatay araç çubukları kontrolleri soldan sağa düzenler ve metin editörleri ve tasarım araçlarındaki yaygın kalıba uyar. Ok tuşları widget'lar arasında gezinir ve kullanıcılar bir sonraki sayfa öğesine geçmek için Tab'a basana kadar odağı araç çubuğu içinde tutar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Vertical toolbar

Dikey araç çubukları kontrolleri yukarıdan aşağıya yığar; yan paneller veya dikey komut paletleri için kullanışlıdır. Yukarı ve aşağı ok tuşları widget'lar arasında gezinir.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Widget groups

Widget grupları birlikte çalışan ilgili kontrolleri içerir; metin hizalama seçenekleri veya liste biçimlendirme seçimleri gibi. Gruplar, araç çubuğu navigasyonuna katılırken kendi iç durumlarını korur.

Yukarıdaki örneklerde hizalama düğmeleri, karşılıklı dışlayıcı bir seçim grubu oluşturmak için `role="radiogroup"` ile `ngToolbarWidgetGroup` içine sarılmıştır.

`multi` girişi, bir grup içindeki birden fazla widget'ın aynı anda seçilip seçilemeyeceğini kontrol eder:

```html {highlight: [15]}
<!-- Single selection (radio group) -->
<div ngToolbarWidgetGroup role="radiogroup" aria-label="Alignment">
  <button ngToolbarWidget value="left">Left</button>
  <button ngToolbarWidget value="center">Center</button>
  <button ngToolbarWidget value="right">Right</button>
</div>

<!-- Multiple selection (toggle group) -->
<div ngToolbarWidgetGroup [multi]="true" aria-label="Formatting">
  <button ngToolbarWidget value="bold">Bold</button>
  <button ngToolbarWidget value="italic">Italic</button>
  <button ngToolbarWidget value="underline">Underline</button>
</div>
```

### Disabled widgets

Araç çubukları iki devre dışı bırakma modunu destekler:

1. **Yumuşak devre dışı** widget'lar odaklanılabilir kalır ancak görsel olarak kullanılamaz olduklarını gösterir
2. **Sert devre dışı** widget'lar klavye navigasyonundan tamamen kaldırılır.

Varsayılan olarak `softDisabled` `true`'dur, bu da devre dışı widget'ların hala odak almasına izin verir. Sert devre dışı modunu etkinleştirmek istiyorsanız, araç çubuğunda `[softDisabled]="false"` ayarlayın.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Right-to-left (RTL) support

Araç çubukları sağdan sola dilleri otomatik olarak destekler. Düzeni ve klavye navigasyon yönünü tersine çevirmek için araç çubuğunu `dir="rtl"` içeren bir kapsayıcı ile sarın. Ok tuşu navigasyonu otomatik olarak ayarlanır: sol ok sonraki widget'a, sağ ok önceki widget'a hareket eder.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Testing

Angular Aria, araç çubuğu bileşenlerini test etmek için bileşen harness'leri sağlar.
Bir bileşen testinde harness'lerin nasıl kullanılacağına dair bir örnek:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ToolbarHarness} from '@angular/aria/toolbar/testing';
import {MyToolbarComponent} from './my-toolbar'; // Bileşeniniz

describe('MyToolbarComponent', () => {
  let fixture: ComponentFixture<MyToolbarComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyToolbarComponent],
    });

    fixture = TestBed.createComponent(MyToolbarComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should have widgets and allow selection', async () => {
    // Araç çubuğu harness'ini yükle
    const toolbar = await loader.getHarness(ToolbarHarness);

    // Tüm widget'ları al
    const widgets = await toolbar.getWidgets();
    expect(widgets.length).toBe(3);

    // İlk widget'a tıkla
    await widgets[0].click();

    // Seçim durumunu doğrula
    expect(await widgets[0].isSelected()).toBe(true);
  });
});
```

## API referansı

Ayrıntılı API belgeleri için aşağıdaki API referanslarını inceleyin:

- [`Toolbar`](/api/aria/toolbar/Toolbar)
- [`ToolbarWidget`](/api/aria/toolbar/ToolbarWidget)
- [`ToolbarWidgetGroup`](/api/aria/toolbar/ToolbarWidgetGroup)
