# Bileşeni çeviriye hazırlama

Projenizi çeviriye hazırlamak için aşağıdaki işlemleri tamamlayın.

- Bileşen şablonlarındaki metni işaretlemek için `i18n` niteliğini kullanın
- Bileşen şablonlarındaki nitelik metin dizelerini işaretlemek için `i18n-` niteliğini kullanın
- Bileşen kodundaki metin dizelerini işaretlemek için `$localize` etiketli mesaj dizesini kullanın

## Bileşen şablonunda metni işaretleme

Bir bileşen şablonunda, i18n meta verisi `i18n` niteliğinin değeridir.

```html
<element i18n="{i18n_metadata}">{string_to_translate}</element>
```

Bileşen şablonlarınızdaki statik bir metin mesajını çeviri için işaretlemek üzere `i18n` niteliğini kullanın.
Çevirmek istediğiniz sabit metin içeren her öğe etiketine yerleştirin.

HELPFUL: `i18n` niteliği, Angular araçlarının ve derleyicilerinin tanıdığı özel bir niteliktir.

### `i18n` örneği

Aşağıdaki `<h1>` etiketi basit bir İngilizce selamlama olan "Hello i18n!" ifadesini görüntüler.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="greeting"/>

Selamlamayı çeviri için işaretlemek üzere `<h1>` etiketine `i18n` niteliğini ekleyin.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute"/>

### `i18n` ile koşullu ifade kullanma

Aşağıdaki `<div>` etiketi, değiştirme durumuna bağlı olarak `div` ve `aria-label` kapsamında çevrilmiş metni görüntüler

<docs-code-multifile>
    <docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html"  region="i18n-conditional"/>
    <docs-code header="app.component.ts" path="adev/src/content/examples/i18n/src/app/app.component.ts" visibleLines="[[14,21],[33,37]]"/>
</docs-code-multifile>

### HTML öğesi olmadan satır içi metni çevirme

Metnin görüntülenme biçimini değiştirmeden belirli bir metin için çeviri davranışı ilişkilendirmek üzere `<ng-container>` öğesini kullanın.

HELPFUL: Her HTML öğesi yeni bir DOM öğesi oluşturur.
Yeni bir DOM öğesi oluşturmaktan kaçınmak için metni bir `<ng-container>` öğesi ile sarın.
Aşağıdaki örnek, `<ng-container>` öğesinin görüntülenmeyen bir HTML yorumuna dönüştürüldüğünü göstermektedir.

<docs-code path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-ng-container"/>

## Çeviriler için öğe niteliklerini işaretleme

Bir bileşen şablonunda, i18n meta verisi `i18n-{attribute_name}` niteliğinin değeridir.

```html
<element i18n-{attribute_name}="{i18n_metadata}" {attribute_name}="{attribute_value}" />
```

HTML öğelerinin nitelikleri, bileşen şablonundaki görüntülenen metnin geri kalanıyla birlikte çevrilmesi gereken metin içerir.

Herhangi bir öğenin herhangi bir niteliğiyle `i18n-{attribute_name}` kullanın ve `{attribute_name}` kısmını niteliğin adıyla değiştirin.
Bir anlam, açıklama ve özel kimlik atamak için aşağıdaki söz dizimini kullanın.

```html
i18n-{attribute_name}="{meaning}|{description}@@{id}"
```

### `i18n-title` örneği

Bir görüntünün başlığını çevirmek için bu örneği inceleyin.
Aşağıdaki örnek, `title` niteliğine sahip bir görüntüyü göstermektedir.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-title"/>

Title niteliğini çeviri için işaretlemek üzere aşağıdaki işlemi tamamlayın.

`i18n-title` niteliğini ekleyin

Aşağıdaki örnek, `img` etiketindeki `title` niteliğinin `i18n-title` eklenerek nasıl işaretlendiğini göstermektedir.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-title-translate"/>

## Bileşen kodundaki metni işaretleme

Bileşen kodunda, çeviri kaynak metni ve meta veriler geri tırnak \(<code>&#96;</code>\) karakterleriyle çevrelenir.

Kodunuzdaki bir dizeyi çeviri için işaretlemek üzere [`$localize`][ApiLocalizeInitLocalize] etiketli mesaj dizesini kullanın.

```ts
$localize`string_to_translate`;
```

i18n meta verisi iki nokta üst üste \(`:`\) karakterleriyle çevrelenir ve çeviri kaynak metninin önüne eklenir.

```ts
$localize`:{i18n_metadata}:string_to_translate`;
```

### Enterpolasyonlu metin ekleme

Bir [`$localize`][ApiLocalizeInitLocalize] etiketli mesaj dizesine [enterpolasyonlar](guide/templates/binding#metin-interpolasyonu-ile-dinamik-metin-işleme) ekleyin.

```ts
$localize`string_to_translate ${variable_name}`;
```

### Enterpolasyon yer tutucusunu adlandırma

```ts
$localize`string_to_translate ${variable_name}:placeholder_name:`;
```

### Çeviriler için koşullu söz dizimi

```ts
return this.show ? $localize`Show Tabs` : $localize`Hide tabs`;
```

## Çeviri için i18n meta verileri

```html
{meaning}|{description}@@{custom_id}
```

Aşağıdaki parametreler, çevirmeniniz için karışıklığı azaltmak amacıyla bağlam ve ek bilgi sağlar.

| Metadata parameter | Details                                                |
| :----------------- | :----------------------------------------------------- |
| Custom ID          | Özel bir tanımlayıcı sağlar                            |
| Description        | Ek bilgi veya bağlam sağlar                            |
| Meaning            | Metnin belirli bağlamdaki anlamını veya amacını sağlar |

Özel kimlikler hakkında ek bilgi için [Manage marked text with custom IDs][GuideI18nOptionalManageMarkedText] bölümüne bakın.

### Yardımcı açıklamalar ve anlamlar ekleme

Bir metin mesajını doğru şekilde çevirmek için çevirmene ek bilgi veya bağlam sağlayın.

`i18n` niteliğinin veya [`$localize`][ApiLocalizeInitLocalize] etiketli mesaj dizesinin değeri olarak metin mesajının bir _açıklamasını_ ekleyin.

Aşağıdaki örnek, `i18n` niteliğinin değerini göstermektedir.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-desc"/>

Aşağıdaki örnek, açıklamalı [`$localize`][ApiLocalizeInitLocalize] etiketli mesaj dizesinin değerini göstermektedir.

```ts
$localize`:An introduction header for this sample:Hello i18n!`;
```

Çevirmenin, metni aynı anlama sahip diğer metinlerle aynı şekilde çevirmek için bu belirli uygulama bağlamında metin mesajının anlamını veya amacını bilmesi de gerekebilir.
`i18n` nitelik değerini _anlam_ ile başlatın ve `|` karakteri ile _açıklamadan_ ayırın: `{meaning}|{description}`.

#### `h1` örneği

Örneğin, `<h1>` etiketinin bir başlık olarak kullanılsın veya metnin başka bir bölümünde referans verilsin, aynı şekilde çevrilmesi gereken bir site başlığı olduğunu belirtmek isteyebilirsiniz.

Aşağıdaki örnek, `<h1>` etiketinin bir başlık olarak çevrilmesi veya başka bir yerde referans verilmesi gerektiğinin nasıl belirtileceğini göstermektedir.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-meaning"/>

Sonuç olarak, _anlam_ olarak `site header` ile işaretlenmiş herhangi bir metin tam olarak aynı şekilde çevrilir.

Aşağıdaki kod örneği, anlam ve açıklama içeren [`$localize`][ApiLocalizeInitLocalize] etiketli mesaj dizesinin değerini göstermektedir.

```ts
$localize`:site header|An introduction header for this sample:Hello i18n!`;
```

<docs-callout title="Anlamların metin çıkarmayı ve birleştirmeleri nasıl kontrol ettiği">

Angular çıkarma aracı, bir şablondaki her `i18n` niteliği için bir çeviri birimi girişi oluşturur.
Angular çıkarma aracı, her çeviri birimine _anlam_ ve _açıklamaya_ dayalı benzersiz bir kimlik atar.

HELPFUL: Angular çıkarma aracı hakkında daha fazla bilgi için [Work with translation files](guide/i18n/translation-files) bölümüne bakın.

Farklı _anlamlara_ sahip aynı metin öğeleri farklı kimliklerle çıkarılır.
Örneğin, "right" kelimesi iki farklı konumda aşağıdaki iki tanımı kullanıyorsa, kelime farklı şekilde çevrilir ve farklı çeviri girişleri olarak uygulamaya geri birleştirilir.

- `correct` yani "haklısın" anlamında
- `direction` yani "sağa dön" anlamında

Aynı metin öğeleri aşağıdaki koşulları karşılıyorsa, metin öğeleri yalnızca bir kez çıkarılır ve aynı kimliği kullanır.

- Aynı anlam veya tanım
- Farklı açıklamalar

Bu tek çeviri girişi, aynı metin öğelerinin göründüğü her yerde uygulamaya geri birleştirilir.

</docs-callout>

## ICU ifadeleri

ICU ifadeleri, bileşen şablonlarında koşulları karşılamak için alternatif metin işaretlemenize yardımcı olur.
Bir ICU ifadesi, bir bileşen özelliği, bir ICU yan tümcesi ve açık süslü parantez \(`{`\) ile kapalı süslü parantez \(`}`\) karakterleriyle çevrili durum ifadelerini içerir.

```html
{ component_property, icu_clause, case_statements }
```

Bileşen özelliği değişkeni tanımlar.
Bir ICU yan tümcesi koşullu metin türünü tanımlar.

| ICU clause                                                           | Details                                                                       |
| :------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| [`plural`][GuideI18nCommonPrepareMarkPlurals]                        | Çoğul sayıların kullanımını işaretler                                         |
| [`select`][GuideI18nCommonPrepareMarkAlternatesAndNestedExpressions] | Tanımladığınız dize değerlerine dayalı alternatif metin seçimlerini işaretler |

Çeviriyi basitleştirmek için Uluslararası Unicode Bileşenleri yan tümcelerini \(ICU yan tümceleri\) düzenli ifadelerle kullanın.

HELPFUL: ICU yan tümceleri, [CLDR çoğullama kurallarında][UnicodeCldrIndexCldrSpecPluralRules] belirtilen [ICU Mesaj Formatına][GithubUnicodeOrgIcuUserguideFormatParseMessages] uyar.

### Çoğulları işaretleme

Farklı diller, çevirinin zorluğunu artıran farklı çoğullama kurallarına sahiptir.
Diğer yerel ayarlar kardinaliteyi farklı şekilde ifade ettiğinden, İngilizce ile uyumlu olmayan çoğullama kategorileri ayarlamanız gerekebilir.
Kelime kelime çevrildiğinde anlamlı olmayabilecek ifadeleri işaretlemek için `plural` yan tümcesini kullanın.

```html
{ component_property, plural, pluralization_categories }
```

Çoğullama kategorisinden sonra, açık süslü parantez \(`{`\) ve kapalı süslü parantez \(`}`\) karakterleriyle çevrili varsayılan metni \(İngilizce\) girin.

```html
pluralization_category { }
```

Aşağıdaki çoğullama kategorileri İngilizce için mevcuttur ve yerel ayara göre değişebilir.

| Pluralization category | Details                  | Example                    |
| :--------------------- | :----------------------- | :------------------------- |
| `zero`                 | Miktar sıfır             | `=0 { }` <br /> `zero { }` |
| `one`                  | Miktar 1                 | `=1 { }` <br /> `one { }`  |
| `two`                  | Miktar 2                 | `=2 { }` <br /> `two { }`  |
| `few`                  | Miktar 2 veya daha fazla | `few { }`                  |
| `many`                 | Miktar büyük bir sayı    | `many { }`                 |
| `other`                | Varsayılan miktar        | `other { }`                |

Çoğullama kategorilerinden hiçbiri eşleşmezse, Angular eksik bir kategori için standart geri dönüş olarak `other` kullanır.

```html
other { default_quantity }
```

HELPFUL: Çoğullama kategorileri hakkında daha fazla bilgi için [CLDR - Unicode Ortak Yerel Ayar Veri Deposu][UnicodeCldrMain]'ndaki [Choosing plural category names][UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames] bölümüne bakın.

<docs-callout header='Background: Locales may not support some pluralization categories'>

Birçok yerel ayar bazı çoğullama kategorilerini desteklemez.
Varsayılan yerel ayar \(`en-US`\), `few` çoğullama kategorisini desteklemeyen çok basit bir `plural()` fonksiyonu kullanır.
Basit bir `plural()` fonksiyonuna sahip başka bir yerel ayar `es`'dir.
Aşağıdaki kod örneği, [en-US `plural()`][GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18] fonksiyonunu göstermektedir.

<docs-code path="adev/src/content/examples/i18n/doc-files/locale_plural_function.ts" class="no-box" hideCopy/>

`plural()` fonksiyonu yalnızca 1 \(`one`\) veya 5 \(`other`\) döndürür.
`few` kategorisi hiçbir zaman eşleşmez.

</docs-callout>

#### `minutes` örneği

Aşağıdaki ifadeyi İngilizce olarak görüntülemek istiyorsanız, burada `x` bir sayıdır.

<!--todo: replace output docs-code with screen capture image --->

```html
updated x minutes ago
```

Ve ayrıca `x`'in kardinalitesine göre aşağıdaki ifadeleri de görüntülemek istiyorsanız.

<!--todo: replace output docs-code with screen capture image --->

```html
updated just now
```

<!--todo: replace output docs-code with screen capture image --->

```html
updated one minute ago
```

HTML işaretlemesi ve [enterpolasyonlar](guide/templates/binding#metin-interpolasyonu-ile-dinamik-metin-işleme) kullanın.
Aşağıdaki kod örneği, önceki üç durumu bir `<span>` öğesinde ifade etmek için `plural` yan tümcesinin nasıl kullanılacağını göstermektedir.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-plural"/>

Önceki kod örneğindeki aşağıdaki ayrıntıları inceleyin.

| Parameters                        | Details                                                                                                                    |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| `minutes`                         | İlk parametre, bileşen özelliğinin `minutes` olduğunu belirtir ve dakika sayısını belirler.                                |
| `plural`                          | İkinci parametre, ICU yan tümcesinin `plural` olduğunu belirtir.                                                           |
| `=0 {just now}`                   | Sıfır dakika için çoğullama kategorisi `=0`'dır. Değer `just now`'dur.                                                     |
| `=1 {one minute}`                 | Bir dakika için çoğullama kategorisi `=1`'dir. Değer `one minute`'dir.                                                     |
| `other {{{minutes}} minutes ago}` | Eşleşmeyen herhangi bir kardinalite için varsayılan çoğullama kategorisi `other`'dır. Değer `{{minutes}} minutes ago`'dur. |

`{{minutes}}` bir [enterpolasyondur](guide/templates/binding#metin-interpolasyonu-ile-dinamik-metin-işleme).

### Alternatifleri ve iç içe ifadeleri işaretleme

`select` yan tümcesi, tanımladığınız dize değerlerine dayalı alternatif metin seçimlerini işaretler.

```html
{ component_property, select, selection_categories }
```

Bir değişkenin değerine dayalı alternatif metin görüntülemek için tüm alternatifleri çevirin.

Seçim kategorisinden sonra, açık süslü parantez \(`{`\) ve kapalı süslü parantez \(`}`\) karakterleriyle çevrili metni \(İngilizce\) girin.

```html
selection_category { text }
```

Farklı diller, çevirinin zorluğunu artıran farklı dilbilgisi yapılarına sahiptir.
HTML işaretlemesi kullanın.
Seçim kategorilerinden hiçbiri eşleşmezse, Angular eksik bir kategori için standart geri dönüş olarak `other` kullanır.

```html
other { default_value }
```

#### `gender` örneği

Aşağıdaki ifadeyi İngilizce olarak görüntülemek istiyorsanız.

<!--todo: replace output docs-code with screen capture image --->

```html
The author is other
```

Ve ayrıca bileşenin `gender` özelliğine göre aşağıdaki ifadeleri de görüntülemek istiyorsanız.

<!--todo: replace output docs-code with screen capture image --->

```html
The author is female
```

<!--todo: replace output docs-code with screen capture image --->

```html
The author is male
```

Aşağıdaki kod örneği, bileşenin `gender` özelliğinin nasıl bağlanacağını ve önceki üç durumu bir `<span>` öğesinde ifade etmek için `select` yan tümcesinin nasıl kullanılacağını göstermektedir.

`gender` özelliği, çıktıları aşağıdaki dize değerlerinin her birine bağlar.

| Value  | English value |
| :----- | :------------ |
| female | `female`      |
| male   | `male`        |
| other  | `other`       |

`select` yan tümcesi değerleri uygun çevirilere eşler.
Aşağıdaki kod örneği, select yan tümcesiyle birlikte kullanılan `gender` özelliğini göstermektedir.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-select"/>

#### `gender` ve `minutes` örneği

`plural` ve `select` yan tümceleri gibi farklı yan tümceleri bir araya getirin.
Aşağıdaki kod örneği, `gender` ve `minutes` örneklerine dayalı iç içe yan tümceleri göstermektedir.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-nested"/>

## Sıradaki

<docs-pill-row>
  <docs-pill href="guide/i18n/translation-files" title="Work with translation files"/>
</docs-pill-row>

[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API  | Angular'
[GuideI18nCommonPrepareMarkAlternatesAndNestedExpressions]: guide/i18n/prepare#alternatifleri-ve-iç-içe-ifadeleri-işaretleme 'Mark alternates and nested expressions - Prepare templates for translation | Angular'
[GuideI18nCommonPrepareMarkPlurals]: guide/i18n/prepare#çoğulları-işaretleme 'Mark plurals - Prepare component for translation | Angular'
[GuideI18nOptionalManageMarkedText]: guide/i18n/manage-marked-text 'Manage marked text with custom IDs | Angular'
[GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18]: https://github.com/angular/angular/blob/ecffc3557fe1bff9718c01277498e877ca44588d/packages/core/src/i18n/locale_en.ts#L14-L18 'Line 14 to 18 - angular/packages/core/src/i18n/locale_en.ts | angular/angular | GitHub'
[GithubUnicodeOrgIcuUserguideFormatParseMessages]: https://unicode-org.github.io/icu/userguide/format_parse/messages 'ICU Message Format - ICU Documentation | Unicode | GitHub'
[UnicodeCldrMain]: https://cldr.unicode.org 'Unicode CLDR Project'
[UnicodeCldrIndexCldrSpecPluralRules]: http://cldr.unicode.org/index/cldr-spec/plural-rules 'Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode'
[UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames]: http://cldr.unicode.org/index/cldr-spec/plural-rules#TOC-Choosing-Plural-Category-Names 'Choosing Plural Category Names - Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode'
