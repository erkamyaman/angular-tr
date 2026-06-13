# Angular'da Bileşenler

Bileşenler, herhangi bir Angular uygulamasının temel yapı taşlarıdır. Her bileşenin üç parçası vardır:

- TypeScript sınıfı
- HTML şablonu
- CSS stilleri

NOTE: [Temel bilgiler rehberindeki bileşenler](/essentials/components) hakkında daha fazla bilgi edinin.

Bu aktivitede, bir bileşenin şablonunu ve stillerini nasıl güncelleyeceğinizi öğreneceksiniz.

<hr />

Bu, Angular ile başlamak için harika bir fırsat.

<docs-workflow>

<docs-step title="Bileşen şablonunu güncelleyin">
`template` özelliğini `Hello Universe` olarak güncelleyin

```ts
template: `
  Hello Universe
`,
```

HTML şablonunu değiştirdiğinizde, önizleme mesajınızla güncellendi. Bir adım daha ileri gidelim: metnin rengini değiştirelim.
</docs-step>

<docs-step title="Bileşen stillerini güncelleyin">
Stil değerini güncelleyin ve `color` özelliğini `blue`'dan `#a144eb`'ye değiştirin.

```ts
styles: `
  :host {
    color: #a144eb;
  }
`,
```

Önizlemeyi kontrol ettiğinizde, metin renginin değiştiğini göreceksiniz.
</docs-step>

</docs-workflow>

Angular'da, tarayıcı tarafından desteklenen tüm CSS ve HTML'yi kullanabilirsiniz. İsterseniz, şablonunuzu ve stillerinizi ayrı dosyalarda saklayabilirsiniz.
