# Formatting data with pipes

Pipe'ları yapılandırarak kullanımınızı daha da ileri taşıyabilirsiniz. Pipe'lar, kendilerine seçenekler aktarılarak yapılandırılabilir.

NOTE: [Detaylı kılavuzda pipe'larla veri biçimlendirme](/guide/templates/pipes) hakkında daha fazla bilgi edinin.

Bu aktivitede, bazı pipe'lar ve pipe parametreleriyle çalışacaksınız.

<hr>

Bir pipe'a parametre aktarmak için, parametre değerinin ardından `:` sözdizimini kullanın. İşte bir örnek:

```angular-html
template: `{{ date | date: 'medium' }}`;
```

Çıktı `Jun 15, 2015, 9:43:11 PM` şeklindedir.

Bazı pipe çıktılarını özelleştirme zamanı:

<docs-workflow>

<docs-step title="`DecimalPipe` ile bir sayıyı biçimlendirin">

`app.ts` dosyasında, şablonu `decimal` pipe'ı için parametre içerecek şekilde güncelleyin.

```angular-html {highlight:[3]}
template: ` ...
<li>Number with "decimal" {{ num | number: '3.2-2' }}</li>
`
```

NOTE: Bu format nedir? `DecimalPipe` için parametre `digitsInfo` olarak adlandırılır, bu parametre şu formatı kullanır: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`

</docs-step>

<docs-step title="`DatePipe` ile bir tarihi biçimlendirin">

Şimdi, şablonu `date` pipe'ını kullanacak şekilde güncelleyin.

```angular-html {highlight:[3]}
template: ` ...
<li>Date with "date" {{ birthday | date: 'medium' }}</li>
`
```

Ekstra eğlence için, `date` için farklı parametreler deneyin. Daha fazla bilgi [Angular belgelerinde](guide/templates/pipes) bulunabilir.

</docs-step>

<docs-step title="`CurrencyPipe` ile para birimini biçimlendirin">

Son göreviniz için, şablonu `currency` pipe'ını kullanacak şekilde güncelleyin.

```angular-html {highlight:[3]}
template: ` ...
<li>Currency with "currency" {{ cost | currency }}</li>
`
```

Ayrıca `currency` için farklı parametreler de deneyebilirsiniz. Daha fazla bilgi [Angular belgelerinde](guide/templates/pipes) bulunabilir.

</docs-step>

</docs-workflow>

Pipe'larla harika iş çıkardınız. Şimdiye kadar büyük ilerleme kaydettiniz.

Uygulamalarınızda kullanabileceğiniz daha fazla yerleşik pipe vardır. Listeyi [Angular belgelerinde](guide/templates/pipes) bulabilirsiniz.

Yerleşik pipe'ların ihtiyaçlarınızı karşılamaması durumunda, özel bir pipe de oluşturabilirsiniz. Daha fazlasını öğrenmek için bir sonraki derse göz atın.
