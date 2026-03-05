# Merge translations into the application

Tamamlanan çevirileri projenize birleştirmek için aşağıdaki işlemleri tamamlayın

1. Projenizin dağıtılabilir dosyalarının bir kopyasını oluşturmak için [Angular CLI][CliMain] kullanın
1. Tüm i18n mesajlarını geçerli çevirilerle değiştirmek ve yerelleştirilmiş bir uygulama varyantı oluşturmak için `"localize"` seçeneğini kullanın.
   Bir varyant uygulama, uygulamanızın tek bir yerel ayar için çevrilmiş dağıtılabilir dosyalarının tam bir kopyasıdır.

Çevirileri birleştirdikten sonra, sunucu tarafı dil algılama veya farklı alt dizinler kullanarak uygulamanın her dağıtılabilir kopyasını sunun.

HELPFUL: Uygulamanın her dağıtılabilir kopyasının nasıl sunulacağı hakkında daha fazla bilgi için [deploying multiple locales](guide/i18n/deploy) bölümüne bakın.

Uygulamanın derleme zamanı çevirisi için, derleme süreci küçük, hızlı ve çalıştırmaya hazır bir uygulama üretmek üzere önceden derleme (AOT) kullanır.

HELPFUL: Derleme süreci hakkında ayrıntılı bir açıklama için [Building and serving Angular apps][GuideBuild] bölümüne bakın.
Derleme süreci `.xlf` formatındaki veya Angular'ın anladığı `.xtb` gibi başka bir formattaki çeviri dosyaları için çalışır.
Angular tarafından kullanılan çeviri dosyası formatları hakkında daha fazla bilgi için [Change the source language file format][GuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat] bölümüne bakın

Her yerel ayar için ayrı bir dağıtılabilir uygulama kopyası oluşturmak üzere, projenizin [`angular.json`][GuideWorkspaceConfig] çalışma alanı derleme yapılandırma dosyasındaki [derleme yapılandırmasında yerel ayarları tanımlayın][GuideI18nCommonMergeDefineLocalesInTheBuildConfiguration].

Bu yöntem, her yerel ayar için tam bir uygulama derlemesi yapma gereksinimini ortadan kaldırarak derleme sürecini kısaltır.

[Her yerel ayar için uygulama varyantları oluşturmak][GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale] üzere, [`angular.json`][GuideWorkspaceConfig] çalışma alanı derleme yapılandırma dosyasındaki `"localize"` seçeneğini kullanın.
Ayrıca, [komut satırından derlemek][GuideI18nCommonMergeBuildFromTheCommandLine] için [`build`][CliBuild] [Angular CLI][CliMain] komutunu `--localize` seçeneğiyle kullanın.

HELPFUL: İsteğe bağlı olarak, özel bir yerel ayar yapılandırması için [yalnızca bir yerel ayar için belirli derleme seçeneklerini uygulayın][GuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale].

## Define locales in the build configuration

Bir proje için yerel ayarları tanımlamak üzere projenizin [`angular.json`][GuideWorkspaceConfig] çalışma alanı derleme yapılandırma dosyasındaki `i18n` proje seçeneğini kullanın.

Aşağıdaki alt seçenekler kaynak dili tanımlar ve derleyiciye proje için desteklenen çevirilerin nerede bulunacağını söyler.

| Suboption      | Details                                                                          |
| :------------- | :------------------------------------------------------------------------------- |
| `sourceLocale` | Uygulama kaynak kodunuzda kullandığınız yerel ayar \(varsayılan olarak `en-US`\) |
| `locales`      | Yerel ayar tanımlayıcılarının çeviri dosyalarına eşlemesi                        |

### `angular.json` for `en-US` and `fr` example

Örneğin, aşağıdaki [`angular.json`][GuideWorkspaceConfig] çalışma alanı derleme yapılandırma dosyası alıntısı, kaynak yerel ayarını `en-US` olarak ayarlar ve Fransızca \(`fr`\) yerel ayar çeviri dosyasının yolunu sağlar.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="locale-config"/>

## Generate application variants for each locale

Derleme yapılandırmasındaki yerel ayar tanımınızı kullanmak için, [`angular.json`][GuideWorkspaceConfig] çalışma alanı derleme yapılandırma dosyasındaki `"localize"` seçeneğini kullanarak CLI'ya derleme yapılandırması için hangi yerel ayarların oluşturulacağını söyleyin.

- Derleme yapılandırmasında daha önce tanımlanan tüm yerel ayarlar için `"localize"` değerini `true` olarak ayarlayın.
- Yalnızca belirli yerel ayar sürümlerini derlemek için `"localize"` değerini daha önce tanımlanmış yerel ayar tanımlayıcılarının bir alt kümesinin dizisi olarak ayarlayın.
- Yerelleştirmeyi devre dışı bırakmak ve herhangi bir yerel ayara özel sürüm oluşturmamak için `"localize"` değerini `false` olarak ayarlayın.

HELPFUL: Bileşen şablonlarını yerelleştirmek için önceden derleme (AOT) gereklidir.

Bu ayarı değiştirdiyseniz, AOT kullanmak için `"aot"` değerini `true` olarak ayarlayın.

HELPFUL: i18n'nin dağıtım karmaşıklıkları ve yeniden derleme süresini en aza indirme ihtiyacı nedeniyle, geliştirme sunucusu aynı anda yalnızca tek bir yerel ayarın yerelleştirilmesini destekler.
`"localize"` seçeneğini `true` olarak ayarlar, birden fazla yerel ayar tanımlar ve `ng serve` kullanırsanız; bir hata oluşur.
Belirli bir yerel ayara karşı geliştirme yapmak istiyorsanız, `"localize"` seçeneğini belirli bir yerel ayara ayarlayın.
Örneğin, Fransızca \(`fr`\) için `"localize": ["fr"]` belirtin.

CLI yerel ayar verilerini yükler ve kaydeder, oluşturulan her sürümü diğer yerel ayar sürümlerinden ayrı tutmak için yerel ayara özel bir dizine yerleştirir ve dizinleri proje için yapılandırılmış `outputPath` içine koyar.
Her uygulama varyantı için `html` öğesinin `lang` niteliği yerel ayara ayarlanır.
CLI ayrıca yapılandırılmış `baseHref`'e yerel ayarı ekleyerek uygulamanın her sürümü için HTML temel HREF'ini ayarlar.

`"localize"` özelliğini tüm yapılandırmalar için etkili bir şekilde miras almak üzere paylaşılan bir yapılandırma olarak ayarlayın.
Ayrıca, diğer yapılandırmaları geçersiz kılmak için özelliği ayarlayın.

### `angular.json` include all locales from build example

Aşağıdaki örnek, tüm derleme yapılandırmasında tanımlanan yerel ayarların derlenmesi için [`angular.json`][GuideWorkspaceConfig] çalışma alanı derleme yapılandırma dosyasında `"localize"` seçeneğinin `true` olarak ayarlandığını göstermektedir.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="build-localize-true"/>

## Build from the command line

Ayrıca, [`ng build`][CliBuild] komutuyla ve mevcut `production` yapılandırmanızla `--localize` seçeneğini kullanın.
CLI, derleme yapılandırmasında tanımlanan tüm yerel ayarları derler.
Derleme yapılandırmasında yerel ayarları ayarlarsanız, `"localize"` seçeneğini `true` olarak ayarladığınız zamana benzerdir.

HELPFUL: Yerel ayarların nasıl ayarlanacağı hakkında daha fazla bilgi için [Generate application variants for each locale][GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale] bölümüne bakın.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="build-localize"/>

## Apply specific build options for just one locale

Belirli derleme seçeneklerini yalnızca bir yerel ayara uygulamak için, özel bir yerel ayara özel yapılandırma oluşturmak üzere tek bir yerel ayar belirtin.

IMPORTANT: [Angular CLI][CliMain] geliştirme sunucusunu \(`ng serve`\) yalnızca tek bir yerel ayarla kullanın.

### build for French example

Aşağıdaki örnek, tek bir yerel ayar kullanan özel bir yerel ayara özel yapılandırmayı göstermektedir.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="build-single-locale"/>

Bu yapılandırmayı `ng serve` veya `ng build` komutlarına geçirin.
Aşağıdaki kod örneği, Fransızca dil dosyasının nasıl sunulacağını göstermektedir.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="serve-french"/>

Üretim derlemeleri için, her iki yapılandırmayı da çalıştırmak üzere yapılandırma bileşimini kullanın.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="build-production-french"/>

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="build-production-french" />

## Report missing translations

Bir çeviri eksik olduğunda, derleme başarılı olur ancak `Missing translation for message "{translation_text}"` gibi bir uyarı oluşturur.
Angular derleyicisi tarafından oluşturulan uyarı seviyesini yapılandırmak için aşağıdaki seviyelerden birini belirtin.

| Warning level | Details                                             | Output                                                 |
| :------------ | :-------------------------------------------------- | :----------------------------------------------------- |
| `error`       | Bir hata fırlatır ve derleme başarısız olur         | n/a                                                    |
| `ignore`      | Hiçbir şey yapmaz                                   | n/a                                                    |
| `warning`     | Konsolda veya kabukta varsayılan uyarıyı görüntüler | `Missing translation for message "{translation_text}"` |

Uyarı seviyesini projenizin [`angular.json`][GuideWorkspaceConfig] çalışma alanı derleme yapılandırma dosyasındaki `build` hedefinin `options` bölümünde belirtin.

### `angular.json` `error` warning example

Aşağıdaki örnek, uyarı seviyesinin `error` olarak nasıl ayarlanacağını göstermektedir.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="missing-translation-error" />

HELPFUL: Angular projenizi bir Angular uygulamasına derlediğinizde, `i18n` niteliğinin örnekleri [`$localize`][ApiLocalizeInitLocalize] etiketli mesaj dizesi örnekleriyle değiştirilir.
Bu, Angular uygulamanızın derlemeden sonra çevrildiği anlamına gelir.
Bu ayrıca, her yerel ayar için tüm Angular projenizi yeniden derlemeden Angular uygulamanızın yerelleştirilmiş sürümlerini oluşturabileceğiniz anlamına gelir.

Angular uygulamanızı çevirdiğinizde, _çeviri dönüşümü_ şablon literal dizesinin parçalarını \(statik dizeler ve ifadeler\) bir çeviri koleksiyonundaki dizelerle değiştirir ve yeniden sıralar.
Daha fazla bilgi için [`$localize`][ApiLocalizeInitLocalize] bölümüne bakın.

TLDR: Bir kez derleyin, ardından her yerel ayar için çevirin.

## What's next

<docs-pill-row>
  <docs-pill href="guide/i18n/deploy" title="Deploy multiple locales"/>
</docs-pill-row>

[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API | Angular'
[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[CliBuild]: cli/build 'ng build | CLI | Angular'
[GuideBuild]: tools/cli/build 'Building and serving Angular apps | Angular'
[GuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale]: guide/i18n/merge#apply-specific-build-options-for-just-one-locale 'Apply specific build options for just one locale - Merge translations into the application | Angular'
[GuideI18nCommonMergeBuildFromTheCommandLine]: guide/i18n/merge#build-from-the-command-line 'Build from the command line - Merge translations into the application | Angular'
[GuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]: guide/i18n/merge#define-locales-in-the-build-configuration 'Define locales in the build configuration - Merge translations into the application | Angular'
[GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]: guide/i18n/merge#generate-application-variants-for-each-locale 'Generate application variants for each locale - Merge translations into the application | Angular'
[GuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]: guide/i18n/translation-files#change-the-source-language-file-format 'Change the source language file format - Work with translation files | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
