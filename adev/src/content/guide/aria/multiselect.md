<docs-decorative-header title="Multiselect">
</docs-decorative-header>

## Genel Bakış

Klavye navigasyonu ve ekran okuyucu desteği ile çoklu seçimli açılır menüler oluşturmak için salt okunur combobox'ı çoklu etkin listbox ile birleştiren bir kalıp.

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

Bu örnek seçimleri üç öğeyle sınırlar. Sınıra ulaşıldığında, seçilmemiş seçenekler devre dışı olur ve ek seçimleri engeller. Bir mesaj kullanıcıları kısıtlama hakkında bilgilendirir.

## API'ler

Çoklu seçim kalıbı, Angular'ın Aria kütüphanesindeki aşağıdaki yönergeleri kullanır. Bağlantılı rehberlerdeki tam API dokümantasyonuna bakın.

### Combobox Yönergeleri

Çoklu seçim kalıbı, klavye navigasyonunu korurken metin girişini engellemek için `readonly` niteliği ile `ngCombobox` kullanır.

#### Girişler

| Property   | Type      | Default | Description                                                   |
| ---------- | --------- | ------- | ------------------------------------------------------------- |
| `readonly` | `boolean` | `false` | Açılır menü davranışı oluşturmak için `true` olarak ayarlayın |
| `disabled` | `boolean` | `false` | Tüm çoklu seçimi devre dışı bırakır                           |

Mevcut tüm girişler ve sinyaller hakkında eksiksiz bilgi için [Combobox API dokümantasyonuna](guide/aria/combobox#apiler) bakın.

### Listbox Yönergeleri

Çoklu seçim kalıbı, çoklu seçim için `multi` niteliği ile `ngListbox` ve her seçilebilir öğe için `ngOption` kullanır.

#### Girişler

| Property | Type      | Default | Description                                              |
| -------- | --------- | ------- | -------------------------------------------------------- |
| `multi`  | `boolean` | `false` | Çoklu seçimi etkinleştirmek için `true` olarak ayarlayın |

#### Model

| Property | Type    | Description                                     |
| -------- | ------- | ----------------------------------------------- |
| `values` | `any[]` | Seçili değerlerin iki yönlü bağlanabilir dizisi |

`multi` true olduğunda, kullanıcılar seçimi değiştirmek için Boşluk kullanarak birden fazla seçenek seçebilir. Açılır pencere seçimden sonra açık kalır ve ek seçimlere izin verir.

Listbox yapılandırması, seçim modları ve seçenek özellikleri hakkında eksiksiz bilgi için [Listbox API dokümantasyonuna](guide/aria/listbox#apiler) bakın.

### Konumlandırma

Çoklu seçim kalıbı, akıllı konumlandırma için [CDK Overlay](api/cdk/overlay/CdkConnectedOverlay) ile entegre olur. Görünüm alanı kenarlarını ve kaydırmayı otomatik olarak yönetmek için `cdkConnectedOverlay` kullanın.
