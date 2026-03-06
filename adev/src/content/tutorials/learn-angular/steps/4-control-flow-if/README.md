# Kontrol Akışı - `@if`

Kullanıcıya ekranda neyin gösterileceğine karar vermek, uygulama geliştirmede yaygın bir görevdir. Çoğu zaman bu karar, koşullar kullanılarak programatik olarak verilir.

Şablonlarda koşullu gösterimi ifade etmek için Angular, `@if` şablon sözdizimini kullanır.

NOTE: [Temel bilgiler kılavuzundaki kontrol akışı](/essentials/templates#if-ve-for-ile-kontrol-akışı) hakkında daha fazla bilgi edinin.

Bu aktivitede, şablonlarda koşullu ifadelerin nasıl kullanılacağını öğreneceksiniz.

<hr/>

Bir şablonda öğelerin koşullu gösterimini sağlayan sözdizimi `@if`'tir.

İşte bir bileşende `@if` sözdiziminin nasıl kullanılacağına dair bir örnek:

```angular-ts
@Component({
  ...
  template: `
    @if (isLoggedIn) {
      <p>Welcome back, Friend!</p>
    }
  `,
})
export class App {
  isLoggedIn = true;
}
```

Dikkat edilmesi gereken iki nokta:

- `if` için `@` öneki vardır çünkü bu, [Angular şablon sözdizimi](guide/templates) adı verilen özel bir sözdizimi türüdür
- v16 ve daha eski sürümleri kullanan uygulamalar için lütfen daha fazla bilgi edinmek üzere [NgIf için Angular belgelerine](guide/directives/structural-directives) bakın.

<docs-workflow>

<docs-step title="`isServerRunning` adlı bir özellik oluşturun">
`App` sınıfında, `isServerRunning` adında bir `boolean` özellik ekleyin ve başlangıç değerini `true` olarak ayarlayın.
</docs-step>

<docs-step title="Şablonda `@if` kullanın">
`isServerRunning` değeri `true` ise `Yes, the server is running` mesajını göstermek için şablonu güncelleyin.

</docs-step>

<docs-step title="Şablonda `@else` kullanın">
Angular artık `@else` sözdizimi ile else durumunu tanımlamak için yerel şablon sözdizimini desteklemektedir. Else durumu olarak `No, the server is not running` mesajını göstermek için şablonu güncelleyin.

İşte bir örnek:

```angular-html
template: `
@if (isServerRunning) {
  ...
} @else {
  ...
}
`;
```

Eksik işaretlemeyi doldurmak için kodunuzu ekleyin.

</docs-step>

</docs-workflow>

Bu tür bir işlevselliğe koşullu kontrol akışı denir. Sırada, bir şablonda öğelerin nasıl tekrarlanacağını öğreneceksiniz.
