# Yerel ayara göre verileri biçimlendirme

Angular, aşağıdaki yerleşik veri dönüştürme [pipe'larını](guide/templates/pipes) sağlar.
Veri dönüştürme pipe'ları, her yerel ayarın kurallarına göre verileri biçimlendirmek için [`LOCALE_ID`][ApiCoreLocaleId] token'ını kullanır.

| Data transformation pipe                | Details                                      |
| :-------------------------------------- | :------------------------------------------- |
| [`DatePipe`][ApiCommonDatepipe]         | Bir tarih değerini biçimlendirir.            |
| [`CurrencyPipe`][ApiCommonCurrencypipe] | Bir sayıyı para birimi dizesine dönüştürür.  |
| [`DecimalPipe`][ApiCommonDecimalpipe]   | Bir sayıyı ondalık sayı dizesine dönüştürür. |
| [`PercentPipe`][ApiCommonPercentpipe]   | Bir sayıyı yüzde dizesine dönüştürür.        |

## Geçerli tarihi görüntülemek için DatePipe kullanma

Geçerli tarihi mevcut yerel ayarın biçiminde görüntülemek için `DatePipe` için aşağıdaki biçimi kullanın.

```angular-html
{{ today | date }}
```

## CurrencyPipe için mevcut yerel ayarı geçersiz kılma

Mevcut `LOCALE_ID` token değerini geçersiz kılmak için pipe'a `locale` parametresini ekleyin.

Para birimini Amerikan İngilizcesi \(`en-US`\) kullanmaya zorlamak için `CurrencyPipe` için aşağıdaki biçimi kullanın

```angular-html
{{ amount | currency: 'en-US' }}
```

HELPFUL: `CurrencyPipe` için belirtilen yerel ayar, uygulamanızın global `LOCALE_ID` token'ını geçersiz kılar.

## Sıradaki

<docs-pill-row>
  <docs-pill href="guide/i18n/prepare" title="Prepare component for translation"/>
</docs-pill-row>

[ApiCommonCurrencypipe]: api/common/CurrencyPipe 'CurrencyPipe | Common - API | Angular'
[ApiCommonDatepipe]: api/common/DatePipe 'DatePipe | Common - API | Angular'
[ApiCommonDecimalpipe]: api/common/DecimalPipe 'DecimalPipe | Common - API | Angular'
[ApiCommonPercentpipe]: api/common/PercentPipe 'PercentPipe | Common - API | Angular'
[ApiCoreLocaleId]: api/core/LOCALE_ID 'LOCALE_ID | Core - API | Angular'
