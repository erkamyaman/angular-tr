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
    <button ngAccordionTrigger [panel]="panel1">Trigger Text</button>
    <div ngAccordionPanel #panel1="ngAccordionPanel">
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

## Test etme

Angular Aria, akordeon bileşenlerini test etmek için bileşen harness'leri sağlar.
İşte harness'lerin bir bileşen testinde nasıl kullanılacağına dair bir örnek:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {AccordionGroupHarness} from '@angular/aria/accordion/testing';
import {MyAccordionComponent} from './my-accordion'; // Sizin bileşeniniz

describe('MyAccordionComponent', () => {
  let fixture: ComponentFixture<MyAccordionComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyAccordionComponent],
    });

    fixture = TestBed.createComponent(MyAccordionComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow expanding panels', async () => {
    // Akordeon grubu harness'ini yükle
    const group = await loader.getHarness(AccordionGroupHarness);

    // Gruptaki tüm bireysel akordeonları (öğeleri) al
    const accordions = await group.getAccordions();
    expect(accordions.length).toBe(3);

    // Başlangıç durumunu doğrula (ilki genişletilmiş, diğerleri daraltılmış)
    expect(await accordions[0].isExpanded()).toBe(true);
    expect(await accordions[1].isExpanded()).toBe(false);

    // İkinci paneli genişlet
    await accordions[1].expand();

    // Güncellenmiş durumu doğrula
    expect(await accordions[1].isExpanded()).toBe(true);
    // multiExpandable false ise, ilki artık daraltılmış olmalı
    expect(await accordions[0].isExpanded()).toBe(false);
  });
});
```

## API referansı

Ayrıntılı API belgeleri için aşağıdaki API referanslarını inceleyin:

- [`AccordionGroup`](/api/aria/accordion/AccordionGroup)
- [`AccordionTrigger`](/api/aria/accordion/AccordionTrigger)
- [`AccordionPanel`](/api/aria/accordion/AccordionPanel)
- [`AccordionContent`](/api/aria/accordion/AccordionContent)
