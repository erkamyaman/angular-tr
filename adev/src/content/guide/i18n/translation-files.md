# Çeviri dosyalarıyla çalışma

Bir bileşeni çeviriye hazırladıktan sonra, bileşendeki işaretli metni bir _kaynak dil_ dosyasına çıkarmak için [`extract-i18n`][CliExtractI18n] [Angular CLI][CliMain] komutunu kullanın.

İşaretli metin; `i18n` ile işaretlenmiş metin, `i18n-`_nitelik_ ile işaretlenmiş nitelikler ve [Bileşeni çeviriye hazırlama][GuideI18nCommonPrepare] bölümünde açıklandığı gibi `$localize` ile etiketlenmiş metni içerir.

Projeniz için çeviri dosyaları oluşturmak ve güncellemek üzere aşağıdaki adımları tamamlayın.

1. [Kaynak dil dosyasını çıkarın][GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile].
   1. İsteğe bağlı olarak, konumu, formatı ve adı değiştirin.
1. [Her dil için bir çeviri dosyası oluşturmak][GuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage] üzere kaynak dil dosyasını kopyalayın.
1. [Her çeviri dosyasını çevirin][GuideI18nCommonTranslationFilesTranslateEachTranslationFile].
1. Çoğul ve alternatif ifadeleri ayrı ayrı çevirin.
   1. [Çoğulları çevirin][GuideI18nCommonTranslationFilesTranslatePlurals].
   1. [Alternatif ifadeleri çevirin][GuideI18nCommonTranslationFilesTranslateAlternateExpressions].
   1. [İç içe ifadeleri çevirin][GuideI18nCommonTranslationFilesTranslateNestedExpressions].

## Kaynak dil dosyasını çıkarma

Kaynak dil dosyasını çıkarmak için aşağıdaki işlemleri tamamlayın.

1. Bir terminal penceresi açın.
1. Projenizin kök dizinine geçin.
1. Aşağıdaki CLI komutunu çalıştırın.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="extract-i18n-default"/>

`extract-i18n` komutu, projenizin kök dizininde `messages.xlf` adlı bir kaynak dil dosyası oluşturur.
XML Yerelleştirme Değişim Dosyası Formatı \(XLIFF, sürüm 1.2\) hakkında daha fazla bilgi için [XLIFF][WikipediaWikiXliff] bölümüne bakın.

Kaynak dil dosyasının konumunu, formatını ve dosya adını değiştirmek için aşağıdaki [`extract-i18n`][CliExtractI18n] komut seçeneklerini kullanın.

| Command option  | Details                            |
| :-------------- | :--------------------------------- |
| `--format`      | Çıktı dosyasının formatını ayarlar |
| `--out-file`    | Çıktı dosyasının adını ayarlar     |
| `--output-path` | Çıktı dizininin yolunu ayarlar     |

### Kaynak dil dosyası konumunu değiştirme

`src/locale` dizininde bir dosya oluşturmak için çıktı yolunu bir seçenek olarak belirtin.

#### `extract-i18n --output-path` örneği

Aşağıdaki örnek, çıktı yolunu bir seçenek olarak belirtmektedir.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="extract-i18n-output-path"/>

### Kaynak dil dosyası formatını değiştirme

`extract-i18n` komutu aşağıdaki çeviri formatlarında dosyalar oluşturur.

| Translation format | Details                                                                                                          | File extension    |
| :----------------- | :--------------------------------------------------------------------------------------------------------------- | :---------------- |
| ARB                | [Application Resource Bundle][GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]           | `.arb`            |
| JSON               | [JavaScript Object Notation][JsonMain]                                                                           | `.json`           |
| XLIFF 1.2          | [XML Localization Interchange File Format, version 1.2][OasisOpenDocsXliffXliffCoreXliffCoreHtml]                | `.xlf`            |
| XLIFF 2            | [XML Localization Interchange File Format, version 2][OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html] | `.xlf`            |
| XMB                | [XML Message Bundle][UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]                                 | `.xmb` \(`.xtb`\) |

Çeviri formatını açıkça `--format` komut seçeneğiyle belirtin.

HELPFUL: XMB formatı `.xmb` kaynak dil dosyaları oluşturur, ancak `.xtb` çeviri dosyaları kullanır.

#### `extract-i18n --format` örneği

Aşağıdaki örnek, birkaç çeviri formatını göstermektedir.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="extract-i18n-formats"/>

### Kaynak dil dosyası adını değiştirme

Çıkarma aracı tarafından oluşturulan kaynak dil dosyasının adını değiştirmek için `--out-file` komut seçeneğini kullanın.

#### `extract-i18n --out-file` örneği

Aşağıdaki örnek, çıktı dosyasının adlandırılmasını göstermektedir.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="extract-i18n-out-file"/>

## Her dil için bir çeviri dosyası oluşturma

Bir yerel ayar veya dil için çeviri dosyası oluşturmak üzere aşağıdaki işlemleri tamamlayın.

1. [Kaynak dil dosyasını çıkarın][GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile].
1. Her dil için bir _çeviri_ dosyası oluşturmak üzere kaynak dil dosyasının bir kopyasını alın.
1. _Çeviri_ dosyasını yerel ayarı ekleyerek yeniden adlandırın.

   ```file {hideCopy}

   messages.xlf --> messages.{locale}.xlf

   ```

1. Proje kökünüzde `locale` adlı yeni bir dizin oluşturun.

   ```file {hideCopy}

   src/locale

   ```

1. _Çeviri_ dosyasını yeni dizine taşıyın.
1. _Çeviri_ dosyasını çevirmeninize gönderin.
1. Uygulamanıza eklemek istediğiniz her dil için yukarıdaki adımları tekrarlayın.

### Fransızca için `extract-i18n` örneği

Örneğin, bir Fransızca çeviri dosyası oluşturmak için aşağıdaki işlemleri tamamlayın.

1. `extract-i18n` komutunu çalıştırın.
1. `messages.xlf` kaynak dil dosyasının bir kopyasını alın.
1. Fransızca dil \(`fr`\) çevirisi için kopyayı `messages.fr.xlf` olarak yeniden adlandırın.
1. `fr` çeviri dosyasını `src/locale` dizinine taşıyın.
1. `fr` çeviri dosyasını çevirmene gönderin.

## Her çeviri dosyasını çevirme

Dilde akıcı olmadığınız ve çevirileri düzenleyecek zamanınız olmadığı sürece, muhtemelen aşağıdaki adımları tamamlayacaksınız.

1. Her çeviri dosyasını bir çevirmene gönderin.
1. Çevirmen, aşağıdaki işlemleri tamamlamak için bir XLIFF dosya düzenleyicisi kullanır.
   1. Çeviriyi oluşturur.
   1. Çeviriyi düzenler.

### Fransızca için çeviri süreci örneği

Süreci göstermek için [Örnek Angular Uluslararasılaştırma uygulamasındaki][GuideI18nExample] `messages.fr.xlf` dosyasını inceleyin. [Örnek Angular Uluslararasılaştırma uygulaması][GuideI18nExample], özel bir XLIFF düzenleyicisi veya Fransızca bilgisi olmadan düzenleyebileceğiniz bir Fransızca çeviri içerir.

Aşağıdaki işlemler Fransızca için çeviri sürecini açıklar.

1. `messages.fr.xlf` dosyasını açın ve ilk `<trans-unit>` öğesini bulun.
   Bu, daha önce `i18n` niteliğiyle işaretlenmiş `<h1>` selamlama etiketinin çevirisini temsil eden bir _çeviri birimi_, aynı zamanda bir _metin düğümü_ olarak da bilinir.

   <docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translated-hello-before"/>

   `id="introductionHeader"`, kaynak HTML'de gerekli olan `@@` öneki olmayan bir [özel kimlik][GuideI18nOptionalManageMarkedText]'dir.

1. Metin düğümündeki `<source>... </source>` öğesini çoğaltın, `target` olarak yeniden adlandırın ve ardından içeriği Fransızca metinle değiştirin.

   <docs-code header="src/locale/messages.fr.xlf (<trans-unit>, after translation)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translated-hello"/>

   Daha karmaşık bir çeviride, [açıklama ve anlam öğelerindeki][GuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings] bilgi ve bağlam, çeviri için doğru kelimeleri seçmenize yardımcı olur.

1. Diğer metin düğümlerini çevirin.
   Aşağıdaki örnek, çevirinin nasıl yapılacağını göstermektedir.

   <docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translated-other-nodes"/>

IMPORTANT: Çeviri birimlerinin kimliklerini değiştirmeyin.
Her `id` niteliği Angular tarafından oluşturulur ve bileşen metninin içeriğine ve atanan anlama bağlıdır.

Metni veya anlamı değiştirirseniz, `id` niteliği de değişir.
Metin güncellemelerini ve kimlikleri yönetme hakkında daha fazla bilgi için [custom IDs][GuideI18nOptionalManageMarkedText] bölümüne bakın.

## Çoğulları çevirme

Her dil için gerektiğinde çoğul durumları ekleyin veya kaldırın.

HELPFUL: Dil çoğullama kuralları için [CLDR plural rules][GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml] bölümüne bakın.

### `minute` `plural` örneği

Bir `plural` çevirmek için ICU format eşleşme değerlerini çevirin.

- `just now`
- `one minute ago`
- `<x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes ago`

Aşağıdaki örnek, çevirinin nasıl yapılacağını göstermektedir.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translated-plural"/>

## Alternatif ifadeleri çevirme

Angular ayrıca alternatif `select` ICU ifadelerini ayrı çeviri birimleri olarak çıkarır.

### `gender` `select` örneği

Aşağıdaki örnek, bileşen şablonunda bir `select` ICU ifadesini göstermektedir.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-select"/>

Bu örnekte Angular, ifadeyi iki çeviri birimine çıkarır.
İlki `select` yan tümcesinin dışındaki metni içerir ve `select` için bir yer tutucu kullanır \(`<x id="ICU">`\):

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translate-select-1"/>

IMPORTANT: Metni çevirirken, gerekirse yer tutucuyu taşıyın ancak kaldırmayın.
Yer tutucuyu kaldırırsanız, ICU ifadesi çevrilmiş uygulamanızdan kaldırılır.

Aşağıdaki örnek, `select` yan tümcesini içeren ikinci çeviri birimini göstermektedir.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translate-select-2"/>

Aşağıdaki örnek, çeviri tamamlandıktan sonra her iki çeviri birimini göstermektedir.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translated-select"/>

## İç içe ifadeleri çevirme

Angular, iç içe bir ifadeyi alternatif bir ifadeyle aynı şekilde ele alır.
Angular, ifadeyi iki çeviri birimine çıkarır.

### İç içe `plural` örneği

Aşağıdaki örnek, iç içe ifadenin dışındaki metni içeren ilk çeviri birimini göstermektedir.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translate-nested-1"/>

Aşağıdaki örnek, tam iç içe ifadeyi içeren ikinci çeviri birimini göstermektedir.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translate-nested-2"/>

Aşağıdaki örnek, çeviriden sonra her iki çeviri birimini göstermektedir.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="translate-nested"/>

## Sıradaki

<docs-pill-row>
  <docs-pill href="guide/i18n/merge" title="Merge translations into the app"/>
</docs-pill-row>

[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[CliExtractI18n]: cli/extract-i18n 'ng extract-i18n | CLI | Angular'
[GuideI18nCommonPrepare]: guide/i18n/prepare 'Prepare component for translation | Angular'
[GuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]: guide/i18n/prepare#yardımcı-açıklamalar-ve-anlamlar-ekleme 'Add helpful descriptions and meanings - Prepare component for translation | Angular'
[GuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]: guide/i18n/translation-files#her-dil-için-bir-çeviri-dosyası-oluşturma 'Create a translation file for each language - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]: guide/i18n/translation-files#kaynak-dil-dosyasını-çıkarma 'Extract the source language file - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesTranslateAlternateExpressions]: guide/i18n/translation-files#alternatif-ifadeleri-çevirme 'Translate alternate expressions - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesTranslateEachTranslationFile]: guide/i18n/translation-files#her-çeviri-dosyasını-çevirme 'Translate each translation file - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesTranslateNestedExpressions]: guide/i18n/translation-files#iç-içe-ifadeleri-çevirme 'Translate nested expressions - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesTranslatePlurals]: guide/i18n/translation-files#çoğulları-çevirme 'Translate plurals - Work with translation files | Angular'
[GuideI18nExample]: guide/i18n/example 'Example Angular Internationalization application | Angular'
[GuideI18nOptionalManageMarkedText]: guide/i18n/manage-marked-text 'Manage marked text with custom IDs | Angular'
[GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]: https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification 'ApplicationResourceBundleSpecification | google/app-resource-bundle | GitHub'
[GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml]: https://cldr.unicode.org/index/cldr-spec/plural-rules 'Language Plural Rules - CLDR Charts | Unicode | GitHub'
[JsonMain]: https://www.json.org 'Introducing JSON | JSON'
[OasisOpenDocsXliffXliffCoreXliffCoreHtml]: https://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html 'XLIFF Version 1.2 Specification | Oasis Open Docs'
[OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html]: http://docs.oasis-open.org/xliff/xliff-core/v2.0/cos01/xliff-core-v2.0-cos01.html 'XLIFF Version 2.0 | Oasis Open Docs'
[UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]: http://cldr.unicode.org/development/development-process/design-proposals/xmb 'XMB | CLDR - Unicode Common Locale Data Repository | Unicode'
[WikipediaWikiXliff]: https://en.wikipedia.org/wiki/XLIFF 'XLIFF | Wikipedia'
