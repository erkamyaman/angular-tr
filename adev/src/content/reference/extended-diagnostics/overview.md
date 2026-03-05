# Extended Diagnostics

Teknik olarak derleyici veya çalışma zamanı için geçerli olan, ancak karmaşık nüansları veya uyarıları olabilen birçok kodlama kalıbı vardır.
Bu kalıplar, bir geliştiricinin beklediği etkiyi yaratmayabilir ve bu durum genellikle hatalara yol açar.
Angular derleyicisi, geliştiricileri olası sorunlar hakkında uyarmak ve bir kod tabanı içinde yaygın en iyi uygulamaları zorunlu kılmak amacıyla bu kalıpların çoğunu tanımlayan "genişletilmiş tanılama" özelliğini içerir.

## Diagnostics

Şu anda Angular aşağıdaki genişletilmiş tanılamaları desteklemektedir:

| Code     | Name                                                                  |
| :------- | :-------------------------------------------------------------------- |
| `NG8101` | [`invalidBananaInBox`](extended-diagnostics/NG8101)                   |
| `NG8102` | [`nullishCoalescingNotNullable`](extended-diagnostics/NG8102)         |
| `NG8103` | [`missingControlFlowDirective`](extended-diagnostics/NG8103)          |
| `NG8104` | [`textAttributeNotBinding`](extended-diagnostics/NG8104)              |
| `NG8105` | [`missingNgForOfLet`](extended-diagnostics/NG8105)                    |
| `NG8106` | [`suffixNotSupported`](extended-diagnostics/NG8106)                   |
| `NG8107` | [`optionalChainNotNullable`](extended-diagnostics/NG8107)             |
| `NG8108` | [`skipHydrationNotStatic`](extended-diagnostics/NG8108)               |
| `NG8109` | [`interpolatedSignalNotInvoked`](extended-diagnostics/NG8109)         |
| `NG8111` | [`uninvokedFunctionInEventBinding`](extended-diagnostics/NG8111)      |
| `NG8113` | [`unusedStandaloneImports`](extended-diagnostics/NG8113)              |
| `NG8114` | [`unparenthesizedNullishCoalescing`](extended-diagnostics/NG8114)     |
| `NG8115` | [`uninvokedTrackFunction`](extended-diagnostics/NG8115)               |
| `NG8116` | [`missingStructuralDirective`](extended-diagnostics/NG8116)           |
| `NG8117` | [`uninvokedFunctionInTextInterpolation`](extended-diagnostics/NG8117) |
| `NG8021` | [`deferTriggerMisconfiguration`](extended-diagnostics/NG8021)         |

## Configuration

Genişletilmiş tanılamalar varsayılan olarak uyarıdır ve derlemeyi engellemez.
Her tanılama şu şekilde yapılandırılabilir:

| Error category | Effect                                                                                                                                                              |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `warning`      | Varsayılan - Derleyici tanılamayı bir uyarı olarak verir ancak derlemeyi engellemez. Uyarılar verilse bile derleyici yine de 0 durum kodu ile çıkış yapar.          |
| `error`        | Derleyici tanılamayı bir hata olarak verir ve derlemeyi başarısız kılar. Bir veya daha fazla hata verilirse derleyici sıfır olmayan bir durum kodu ile çıkış yapar. |
| `suppress`     | Derleyici tanılamayı hiç _vermez_.                                                                                                                                  |

Kontrol ciddiyeti bir [Angular derleyici seçeneği](reference/configs/angular-compiler-options) olarak yapılandırılabilir:

```json
{
  "angularCompilerOptions": {
    "extendedDiagnostics": {
      "checks": {
        "invalidBananaInBox": "suppress"
      },
      "defaultCategory": "error"
    }
  }
}
```

`checks` alanı, bireysel tanılamaların adlarını ilişkili kategorileriyle eşler.
Tam bir genişletilmiş tanılama listesi ve bunları yapılandırmak için kullanılacak adlar için [Diagnostics](#diagnostics) bölümüne bakın.

`defaultCategory` alanı, `checks` altında açıkça listelenmemiş tüm tanılamalar için kullanılır.
Ayarlanmazsa, bu tür tanılamalar `warning` olarak değerlendirilir.

Genişletilmiş tanılamalar [`strictTemplates`](tools/cli/template-typecheck#strict-mode) etkinleştirildiğinde verilir.
Bu, derleyicinin Angular şablon türlerini daha iyi anlamasını ve doğru ve anlamlı tanılamalar sağlamasını mümkün kılmak için gereklidir.

## Semantic Versioning

Angular ekibi, Angular'ın **minor** sürümlerinde yeni genişletilmiş tanılamalar eklemeyi veya etkinleştirmeyi planlamaktadır (bkz. [semver](https://docs.npmjs.com/about-semantic-versioning)).
Bu, Angular'ı yükseltmenin mevcut kod tabanınızda yeni uyarılar gösterebileceği anlamına gelir.
Bu, ekibin özellikleri daha hızlı sunmasını ve genişletilmiş tanılamaları geliştiriciler için daha erişilebilir hale getirmesini sağlar.

Ancak, `"defaultCategory": "error"` ayarı bu tür uyarıları kesin hatalara yükseltir.
Bu, bir minor sürüm yükseltmesinin derleme hataları oluşturmasına neden olabilir ve bu durum semver uyumlu olmayan bir kırılma değişikliği olarak görülebilir.
Herhangi bir yeni tanılama, yukarıdaki [yapılandırma](#configuration) aracılığıyla bastırılabilir veya uyarılara düşürülebilir, bu nedenle genişletilmiş tanılamaları varsayılan olarak hata olarak değerlendiren projeler üzerindeki etkisi minimum olmalıdır.
Varsayılan olarak hata kullanmak çok güçlü bir araçtır; projeniz için `error`'ın doğru varsayılan olup olmadığına karar verirken bu semver uyarısını göz önünde bulundurun.

## New Diagnostics

Angular ekibi, eklenebilecek yeni tanılamalar hakkında önerilere her zaman açıktır.
Genişletilmiş tanılamalar genel olarak şunları yapmalıdır:

- Angular şablonlarında yaygın, belirgin olmayan bir geliştirici hatasını tespit etmelidir
- Bu kalıbın neden hatalara veya istenmeyen davranışlara yol açabileceğini açıkça belirtmelidir
- Bir veya daha fazla net çözüm önermelidir
- Düşük, tercihen sıfır, yanlış pozitif oranına sahip olmalıdır
- Angular uygulamalarının büyük çoğunluğuna uygulanmalıdır (resmi olmayan bir kütüphaneye özgü değil)
- Program doğruluğunu veya performansını iyileştirmelidir (stil değil, bu sorumluluk bir linter'a aittir)

Bu kriterlere uyan bir genişletilmiş tanılama fikriniz varsa, bir [özellik isteği](https://github.com/angular/angular/issues/new?template=2-feature-request.yaml) açmayı düşünün.
