# Kontrol Akışı - `@for`

Web uygulamaları geliştirirken sıklıkla belirli bir kodu belirli sayıda tekrarlamanız gerekir - örneğin, bir isim dizisi verildiğinde her ismi bir `<p>` etiketinde göstermek isteyebilirsiniz.

NOTE: [Temel bilgiler kılavuzundaki kontrol akışı](/essentials/templates#if-ve-for-ile-kontrol-akışı) hakkında daha fazla bilgi edinin.

Bu aktivitede, bir şablonda öğeleri tekrarlamak için `@for` kullanmayı öğreneceksiniz.

<hr/>

Bir şablonda öğelerin tekrarlanmasını sağlayan sözdizimi `@for`'dur.

İşte bir bileşende `@for` sözdiziminin nasıl kullanılacağına dair bir örnek:

```angular-ts
@Component({
  ...
  template: `
    @for (os of operatingSystems; track os.id) {
      {{ os.name }}
    }
  `,
})
export class App {
  operatingSystems = [{id: 'win', name: 'Windows'}, {id: 'osx', name: 'MacOS'}, {id: 'linux', name: 'Linux'}];
}
```

Dikkat edilmesi gereken iki nokta:

- `for` için `@` öneki vardır çünkü bu, [Angular şablon sözdizimi](guide/templates) adı verilen özel bir sözdizimidir
- v16 ve daha eski sürümleri kullanan uygulamalar için lütfen [NgFor için Angular belgelerine](guide/directives/structural-directives) bakın

<docs-workflow>

<docs-step title="`users` özelliğini ekleyin">
`App` sınıfında, kullanıcıları ve isimlerini içeren `users` adında bir özellik ekleyin.

```ts
[
  {id: 0, name: 'Sarah'},
  {id: 1, name: 'Amy'},
  {id: 2, name: 'Rachel'},
  {id: 3, name: 'Jessica'},
  {id: 4, name: 'Poornima'},
];
```

</docs-step>

<docs-step title="Şablonu güncelleyin">
`@for` şablon sözdizimini kullanarak her kullanıcı adını bir `p` öğesinde göstermek için şablonu güncelleyin.

```angular-html
@for (user of users; track user.id) {
  <p>{{ user.name }}</p>
}
```

NOTE: `track` kullanımı zorunludur; `id` veya başka bir benzersiz tanımlayıcı kullanabilirsiniz.

</docs-step>

</docs-workflow>

Bu tür bir işlevselliğe kontrol akışı denir. Sırada, bileşenleri nasıl özelleştireceğinizi ve bileşenlerle nasıl iletişim kuracağınızı öğreneceksiniz - bu arada, şimdiye kadar harika gidiyorsunuz.
