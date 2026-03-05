# Manage marked text with custom IDs

Angular çıkarıcı, aşağıdaki örneklerin her biri için bir çeviri birimi girişi olan bir dosya oluşturur.

- Bir bileşen şablonundaki her `i18n` özniteliği
- Bileşen kodundaki her [`$localize`][ApiLocalizeInitLocalize] etiketli mesaj dizesi

[Anlamların metin çıkarmayı ve birleştirmeleri nasıl kontrol ettiği][GuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges] bölümünde açıklandığı gibi, Angular her çeviri birimine benzersiz bir kimlik atar.

Aşağıdaki örnek, benzersiz kimliklere sahip çeviri birimlerini gösterir.

<docs-code header="messages.fr.xlf" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="generated-id"/>

Çevrilebilir metni değiştirdiğinizde, çıkarıcı o çeviri birimi için yeni bir kimlik oluşturur.
Çoğu durumda, kaynak metindeki değişiklikler çeviride de bir değişiklik gerektirir.
Bu nedenle, yeni bir kimlik kullanmak metin değişikliğini çevirilerle senkronize tutar.

Ancak bazı çeviri sistemleri kimlik için belirli bir biçim veya söz dizimi gerektirir.
Bu gereksinimi karşılamak için metni işaretlemek üzere özel bir kimlik kullanın.
Çoğu geliştiricinin özel bir kimlik kullanmasına gerek yoktur.
Ek meta verileri iletmek için benzersiz bir söz dizimi kullanmak istiyorsanız, özel bir kimlik kullanın.
Ek meta veriler, metnin göründüğü kütüphane, bileşen veya uygulama alanını içerebilir.

`i18n` özniteliğinde veya [`$localize`][ApiLocalizeInitLocalize] etiketli mesaj dizesinde özel bir kimlik belirtmek için `@@` önekini kullanın.
Aşağıdaki örnek, bir başlık öğesinde `introductionHeader` özel kimliğini tanımlar.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-solo-id"/>

Aşağıdaki örnek, bir değişken için `introductionHeader` özel kimliğini tanımlar.

```ts
variableText1 = $localize`:@@introductionHeader:Hello i18n!`;
```

Özel bir kimlik belirttiğinizde, çıkarıcı özel kimlikle bir çeviri birimi oluşturur.

<docs-code header="messages.fr.xlf" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="custom-id"/>

Metni değiştirirseniz, çıkarıcı kimliği değiştirmez.
Sonuç olarak, çeviriyi güncelleme adımını atlamanız gerekmez.
Özel kimliklerin dezavantajı, metni değiştirirseniz çevirinizin yeni değiştirilen kaynak metinle senkronizasyonun bozulabilmesidir.

## Use a custom ID with a description

Çevirmene daha fazla yardımcı olmak için özel bir kimliği açıklama ve anlam ile birlikte kullanın.

Aşağıdaki örnek, bir açıklama ve ardından özel kimliği içerir.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-id"/>

Aşağıdaki örnek, bir değişken için `introductionHeader` özel kimliğini ve açıklamasını tanımlar.

```ts
variableText2 = $localize`:An introduction header for this sample@@introductionHeader:Hello i18n!`;
```

Aşağıdaki örnek bir anlam ekler.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-meaning-and-id"/>

Aşağıdaki örnek, bir değişken için `introductionHeader` özel kimliğini tanımlar.

```ts
variableText3 = $localize`:site header|An introduction header for this sample@@introductionHeader:Hello i18n!`;
```

### Define unique custom IDs

Benzersiz özel kimlikler tanımladığınızdan emin olun.
Aynı kimliği iki farklı metin öğesi için kullanırsanız, çıkarma aracı yalnızca ilkini çıkarır ve Angular çeviriyi her iki orijinal metin öğesinin yerine kullanır.

Örneğin, aşağıdaki kod parçacığında iki farklı metin öğesi için aynı `myId` özel kimliği tanımlanmıştır.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-duplicate-custom-id"/>

Aşağıda Fransızca çeviri gösterilmektedir.

<docs-code header="src/locale/messages.fr.xlf" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf" visibleRegion="i18n-duplicate-custom-id"/>

Her iki öğe de artık aynı çeviriyi \(`Bonjour`\) kullanır, çünkü her ikisi de aynı özel kimlikle tanımlanmıştır.

<docs-code path="adev/src/content/examples/i18n/doc-files/rendered-output.html"/>

[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API | Angular'
[GuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges]: guide/i18n/prepare#h1-example 'How meanings control text extraction and merges - Prepare components for translations | Angular'
