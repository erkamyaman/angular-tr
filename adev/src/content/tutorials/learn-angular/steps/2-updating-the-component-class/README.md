# Updating the Component Class

Angular'da, bileşenin mantığı ve davranışı bileşenin TypeScript sınıfında tanımlanır.

NOTE: [Temel bilgiler rehberinde dinamik metin gösterme](/essentials/templates#dinamik-metin-gösterme) hakkında daha fazla bilgi edinin.

Bu aktivitede, bileşen sınıfını nasıl güncelleyeceğinizi ve [interpolasyon](/guide/templates/binding#metin-interpolasyonu-ile-dinamik-metin-işleme) kullanmayı öğreneceksiniz.

<hr />

<docs-workflow>

<docs-step title="`city` adlı bir özellik ekleyin">
`city` adında bir özellik ekleyerek bileşen sınıfını güncelleyin.

```ts
export class App {
  city = 'San Francisco';
}
```

`city` özelliği `string` türündedir ancak [TypeScript'te tür çıkarımı](https://www.typescriptlang.org/docs/handbook/type-inference.html) sayesinde türü belirtmeyebilirsiniz. `city` özelliği `App` sınıfında kullanılabilir ve bileşen şablonunda referans alınabilir.

<br>

Bir sınıf özelliğini şablonda kullanmak için `{{ }}` söz dizimini kullanmanız gerekir.
</docs-step>

<docs-step title="Bileşen şablonunu güncelleyin">
`template` özelliğini aşağıdaki HTML ile eşleşecek şekilde güncelleyin:

```ts
template: `Hello {{ city }}`,
```

Bu, interpolasyonun bir örneğidir ve Angular şablon söz diziminin bir parçasıdır. Bir şablona dinamik metin koymaktan çok daha fazlasını yapmanızı sağlar. Bu söz dizimini fonksiyon çağırmak, ifade yazmak ve daha fazlası için de kullanabilirsiniz.
</docs-step>

<docs-step title="İnterpolasyon ile daha fazla pratik">
Şunu deneyin - içeriği `1 + 1` olan başka bir `{{ }}` seti ekleyin:

```ts
template: `Hello {{ city }}, {{ 1 + 1 }}`,
```

Angular, `{{ }}` içindeki ifadeleri değerlendirir ve çıktıyı şablonda gösterir.
</docs-step>

</docs-workflow>

Bu, Angular şablonlarıyla mümkün olanın sadece başlangıcıdır, daha fazlasını öğrenmek için devam edin.
