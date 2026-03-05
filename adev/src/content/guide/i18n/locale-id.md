# Refer to locales by ID

Angular, metin dizelerinin uluslararasılaştırılması için doğru yerel ayar verilerini bulmak amacıyla Unicode _yerel ayar tanımlayıcısını_ \(Unicode locale ID\) kullanır.

<docs-callout title="Unicode locale ID">

- Bir yerel ayar kimliği [Unicode Common Locale Data Repository (CLDR) çekirdek belirtimi][UnicodeCldrDevelopmentCoreSpecification]'ne uygundur.
  Yerel ayar kimlikleri hakkında daha fazla bilgi için [Unicode Language and Locale Identifiers][UnicodeCldrDevelopmentCoreSpecificationLocaleIDs] bölümüne bakın.

- CLDR ve Angular, yerel ayar kimliğinin temeli olarak [BCP 47 etiketlerini][RfcEditorInfoBcp47] kullanır

</docs-callout>

Bir yerel ayar kimliği dili, ülkeyi ve diğer varyantlar veya alt bölümler için isteğe bağlı bir kodu belirtir.
Bir yerel ayar kimliği dil tanımlayıcısı, bir tire \(`-`\) karakteri ve yerel ayar uzantısından oluşur.

```html
{language_id}-{locale_extension}
```

HELPFUL: Angular projenizi doğru bir şekilde çevirmek için uluslararasılaştırma hedefleriniz olan dillere ve yerel ayarlara karar vermelisiniz.

Birçok ülke aynı dili paylaşır ancak kullanımda farklılık gösterir.
Farklılıklar arasında dilbilgisi, noktalama, para birimi biçimleri, ondalık sayılar, tarihler ve benzeri konular yer alır.

Bu kılavuzdaki örnekler için aşağıdaki dilleri ve yerel ayarları kullanın.

| Language | Locale                   | Unicode locale ID |
| :------- | :----------------------- | :---------------- |
| English  | Canada                   | `en-CA`           |
| English  | United States of America | `en-US`           |
| French   | Canada                   | `fr-CA`           |
| French   | France                   | `fr-FR`           |

[Angular deposu][GithubAngularAngularTreeMasterPackagesCommonLocales] yaygın yerel ayarları içerir.

<docs-callout>
Dil kodlarının listesi için [ISO 639-2](https://www.loc.gov/standards/iso639-2) bölümüne bakın.
</docs-callout>

## Set the source locale ID

Bileşen şablonunu ve kodunu yazdığınız kaynak dili ayarlamak için Angular CLI'yi kullanın.

Varsayılan olarak, Angular projenizin kaynak yerel ayarı olarak `en-US` kullanır.

Derleme için projenizin kaynak yerel ayarını değiştirmek üzere aşağıdaki işlemleri tamamlayın.

1. [`angular.json`][GuideWorkspaceConfig] çalışma alanı derleme yapılandırma dosyasını açın.
2. `i18n` bölümü içinde `sourceLocale` alanını ekleyin veya değiştirin:

```json
{
  "projects": {
    "your-project": {
      "i18n": {
        "sourceLocale": "ca" // Use your desired locale code
      }
    }
  }
}
```

## What's next

<docs-pill-row>
  <docs-pill href="guide/i18n/format-data-locale" title="Format data based on locale"/>
</docs-pill-row>

[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
[GithubAngularAngularTreeMasterPackagesCommonLocales]: https://github.com/angular/angular/tree/main/packages/common/locales 'angular/packages/common/locales | angular/angular | GitHub'
[RfcEditorInfoBcp47]: https://www.rfc-editor.org/info/bcp47 'BCP 47 | RFC Editor'
[UnicodeCldrDevelopmentCoreSpecification]: https://cldr.unicode.org/index/cldr-spec 'Core Specification | Unicode CLDR Project'
[UnicodeCldrDevelopmentCoreSpecificationLocaleID]: https://cldr.unicode.org/index/cldr-spec/picking-the-right-language-code 'Unicode Language and Locale Identifiers - Core Specification | Unicode CLDR Project'
