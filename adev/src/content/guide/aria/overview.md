<docs-decorative-header title="Angular Aria">
</docs-decorative-header>

## Angular Aria Nedir?

Erişilebilir bileşenler oluşturmak basit görünse de, bunları W3C Erişilebilirlik Yönergelerine göre uygulamak önemli çaba ve erişilebilirlik uzmanlığı gerektirir.

Angular Aria, yaygın WAI-ARIA kalıplarını uygulayan başlıksız (headless), erişilebilir yönergeler koleksiyonudur. Yönergeler klavye etkileşimlerini, ARIA niteliklerini, odak yönetimini ve ekran okuyucu desteğini ele alır. Tek yapmanız gereken HTML yapısını, CSS stilini ve iş mantığını sağlamaktır!

## Kurulum

```shell
npm install @angular/aria
```

## Vitrin

Örneğin, bir araç çubuğu menüsünü ele alalım. Belirli bir mantıkla bağlanmış "basit" bir buton satırı gibi görünse de, klavye navigasyonu ve ekran okuyucuları, erişilebilirliğe aşina olmayanlar için birçok beklenmedik karmaşıklık ekler.

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

Bu tek senaryoda geliştiricilerin dikkate alması gerekenler:

- **Klavye navigasyonu**. Kullanıcıların menüyü Enter veya Boşluk ile açması, seçenekler arasında ok tuşlarıyla gezinmesi, Enter ile seçmesi ve Escape ile kapatması gerekir.
- **Ekran okuyucuların** menünün durumunu, seçenek sayısını ve hangi seçeneğin odakta olduğunu duyurması gerekir.
- **Odak yönetimi** tetikleyici ve menü öğeleri arasında mantıksal olarak hareket etmelidir.
- **Sağdan sola diller** ters yönde gezinme yeteneğini gerektirir.

## Neler dahil?

Angular Aria, yaygın etkileşimli kalıplar için kapsamlı dokümantasyon, çalışan örnekler ve API referansları ile yönergeler içerir:

### Arama ve seçim

| Component                               | Description                                                           |
| --------------------------------------- | --------------------------------------------------------------------- |
| [Autocomplete](guide/aria/autocomplete) | Kullanıcılar yazarken filtrelenmiş önerilerin göründüğü metin girişi  |
| [Listbox](guide/aria/listbox)           | Klavye navigasyonu ile tekli veya çoklu seçim seçenek listeleri       |
| [Select](guide/aria/select)             | Klavye navigasyonu ile tek seçimli açılır menü kalıbı                 |
| [Multiselect](guide/aria/multiselect)   | Kompakt görüntüyle çoklu seçimli açılır menü kalıbı                   |
| [Combobox](guide/aria/combobox)         | Bir metin girişi ile bir açılır pencereyi koordine eden temel yönerge |

### Navigasyon ve eylem çağrıları

| Component                     | Description                                                       |
| ----------------------------- | ----------------------------------------------------------------- |
| [Menu](guide/aria/menu)       | İç içe alt menüler ve klavye kısayolları ile açılır menüler       |
| [Menubar](guide/aria/menubar) | Kalıcı uygulama menüleri için yatay navigasyon çubuğu             |
| [Toolbar](guide/aria/toolbar) | Mantıksal klavye navigasyonu ile gruplandırılmış kontrol kümeleri |

### İçerik düzenleme

| Component                         | Description                                                             |
| --------------------------------- | ----------------------------------------------------------------------- |
| [Accordion](guide/aria/accordion) | Tek tek veya özel olarak genişleyebilen daraltılabilir içerik panelleri |
| [Tabs](guide/aria/tabs)           | Otomatik veya manuel etkinleştirme modlarıyla sekmeli arayüzler         |
| [Tree](guide/aria/tree)           | Genişletme/daraltma işlevi ile hiyerarşik listeler                      |
| [Grid](guide/aria/grid)           | Hücre hücre klavye navigasyonu ile iki boyutlu veri gösterimi           |

## Angular Aria ne zaman kullanılır

Angular Aria, özel stilleme ile WCAG uyumlu erişilebilir etkileşimli bileşenlere ihtiyaç duyduğunuzda iyi çalışır. Örnekler:

- **Bir tasarım sistemi oluşturmak** - Ekibiniz, erişilebilir uygulamalara ihtiyaç duyan belirli görsel standartlara sahip bir bileşen kütüphanesi yönetiyorsa
- **Kurumsal bileşen kütüphaneleri** - Bir organizasyon içindeki birden fazla uygulama için yeniden kullanılabilir bileşenler oluşturuyorsanız
- **Özel marka gereksinimleri** - Arayüzün, önceden stillendirilmiş bileşen kütüphanelerinin kolayca karşılayamayacağı hassas tasarım özelliklerine uyması gerekiyorsa

## Angular Aria ne zaman kullanılmaz

Angular Aria her senaryoya uymayabilir:

- **Önceden stillendirilmiş bileşenler** - Özel stilleme olmadan eksiksiz görünen bileşenlere ihtiyacınız varsa, bunun yerine Angular Material kullanın
- **Basit formlar** - `<button>` ve `<input type="radio">` gibi yerel HTML form kontrolleri basit kullanım durumları için yerleşik erişilebilirlik sağlar
- **Hızlı prototipleme** - Kavramları hızla doğrularken, önceden stillendirilmiş bileşen kütüphaneleri ilk geliştirme süresini azaltır

## Sonraki adımlar

Yan navigasyondan veya [yukarıdaki listeden](#neler-dahil) bir bileşene göz atın veya Angular Aria yönergelerinin nasıl çalıştığının tam bir örneğini görmek için [Toolbar](guide/aria/toolbar) ile başlayın!
