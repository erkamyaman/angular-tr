<docs-decorative-header title="Select">
</docs-decorative-header>

## Genel Bakış

Klavye navigasyonu ve ekran okuyucu desteği ile tek seçimli açılır menüler oluşturmak için salt okunur combobox'ı listbox ile birleştiren bir kalıp.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Kullanım

Select kalıbı, kullanıcıların bilinen bir seçenek kümesinden tek bir değer seçmesi gerektiğinde en iyi çalışır.

Şu durumlarda bu kalıbı kullanmayı düşünün:

- **Seçenek listesi sabit** (20'den az öğe) - Kullanıcılar filtrelemeye gerek kalmadan tarayıp seçebilir
- **Seçenekler bilinir** - Kullanıcılar arama yapmadan seçimleri tanır
- **Formlar standart alanlar gerektiriyor** - Ülke, il, kategori veya durum seçimi
- **Ayarlar ve yapılandırma** - Tercihler veya seçenekler için açılır menüler
- **Açık seçenek etiketleri** - Her seçimin belirgin, taranabilir bir adı var

Şu durumlarda bu kalıptan kaçının:

- **Liste 20'den fazla öğe içerir** - Daha iyi filtreleme için [Autocomplete kalıbını](guide/aria/autocomplete) kullanın
- **Kullanıcıların seçenekleri araması gerekiyor** - [Autocomplete](guide/aria/autocomplete) metin girişi ve filtreleme sağlar
- **Çoklu seçim gerekli** - Bunun yerine [Multiselect kalıbını](guide/aria/multiselect) kullanın
- **Çok az seçenek var (2-3)** - Radyo butonları tüm seçimlerin daha iyi görünürlüğünü sağlar

## Özellikler

Select kalıbı, tam erişilebilir bir açılır menü sağlamak için [Combobox](guide/aria/combobox) ve [Listbox](guide/aria/listbox) yönergelerini birleştirir:

- **Klavye Navigasyonu** - Ok tuşlarıyla seçenekler arasında gezinin, Enter ile seçin, Escape ile kapatın
- **Ekran Okuyucu Desteği** - Yardımcı teknolojiler için yerleşik ARIA nitelikleri
- **Özel Görünüm** - Seçili değerleri simgeler, biçimlendirme veya zengin içerikle gösterin
- **Sinyal Tabanlı Reaktivite** - Angular sinyalleri kullanan reaktif durum yönetimi
- **Akıllı Konumlandırma** - CDK Overlay görünüm alanı kenarlarını ve kaydırmayı yönetir
- **Çift Yönlü Metin Desteği** - Sağdan sola (RTL) dilleri otomatik olarak işler

## Örnekler

### Temel select

Kullanıcıların bir değerler listesinden seçim yapmak için standart bir açılır menüye ihtiyacı vardır. Salt okunur combobox, listbox ile eşleştirildiğinde, tam erişilebilirlik desteği ile tanıdık select deneyimi sağlar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

`ngCombobox` üzerindeki `readonly` niteliği, klavye navigasyonunu korurken metin girişini engeller. Kullanıcılar, yerel select elemanı gibi ok tuşları ve Enter kullanarak açılır menüyle etkileşir.

### Özel görünümlü select

Seçeneklerin genellikle kullanıcıların seçimleri hızla tanımasına yardımcı olacak simgeler veya rozetler gibi görsel göstergelere ihtiyacı vardır. Seçenekler içindeki özel şablonlar, erişilebilirliği korurken zengin biçimlendirme sağlar.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Her seçenek etiketin yanında bir simge gösterir. Seçili değer, seçilen seçeneğin simgesini ve metnini göstermek üzere güncellenir ve net görsel geri bildirim sağlar.

### Devre dışı select

Belirli form koşulları karşılanmadığında kullanıcı etkileşimini engellemek için select'ler devre dışı bırakılabilir. Devre dışı durumu görsel geri bildirim sağlar ve klavye etkileşimini engeller.

<docs-tab-group>
  <docs-tab label="Basic">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Devre dışı bırakıldığında, select devre dışı görsel durum gösterir ve tüm kullanıcı etkileşimini engeller. Ekran okuyucuları yardımcı teknoloji kullanıcılarına devre dışı durumunu duyurur.

## API'ler

Select kalıbı, Angular'ın Aria kütüphanesindeki aşağıdaki yönergeleri kullanır. Bağlantılı rehberlerdeki tam API dokümantasyonuna bakın.

### Combobox Yönergeleri

Select kalıbı, klavye navigasyonunu korurken metin girişini engellemek için `readonly` niteliği ile `ngCombobox` kullanır.

#### Girişler

| Property   | Type      | Default | Description                                                   |
| ---------- | --------- | ------- | ------------------------------------------------------------- |
| `readonly` | `boolean` | `false` | Açılır menü davranışı oluşturmak için `true` olarak ayarlayın |
| `disabled` | `boolean` | `false` | Tüm select'i devre dışı bırakır                               |

Mevcut tüm girişler ve sinyaller hakkında eksiksiz bilgi için [Combobox API dokümantasyonuna](guide/aria/combobox#apiler) bakın.

### Listbox Yönergeleri

Select kalıbı, açılır liste için `ngListbox` ve her seçilebilir öğe için `ngOption` kullanır.

#### Model

| Property | Type    | Description                                                                    |
| -------- | ------- | ------------------------------------------------------------------------------ |
| `values` | `any[]` | Seçili değerlerin iki yönlü bağlanabilir dizisi (select için tek değer içerir) |

Listbox yapılandırması, seçim modları ve seçenek özellikleri hakkında eksiksiz bilgi için [Listbox API dokümantasyonuna](guide/aria/listbox#apiler) bakın.

### Konumlandırma

Select kalıbı, akıllı konumlandırma için [CDK Overlay](api/cdk/overlay/CdkConnectedOverlay) ile entegre olur. Görünüm alanı kenarlarını ve kaydırmayı otomatik olarak yönetmek için `cdkConnectedOverlay` kullanın.
