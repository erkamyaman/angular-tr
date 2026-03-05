# @loading, @error and @placeholder blocks

Ertelenebilir görünümler, farklı yükleme durumlarında gösterilecek içerikleri tanımlamanıza olanak tanır.

<div class="docs-table docs-scroll-track-transparent">
  <table>
    <tr>
      <td><code>@placeholder</code></td>
      <td>
        Varsayılan olarak, defer blokları tetiklenmeden önce herhangi bir içerik render etmez. <code>@placeholder</code>, ertelenmiş içerik yüklenmeden önce gösterilecek içeriği bildiren isteğe bağlı bir bloktur. Angular, yükleme tamamlandıktan sonra yer tutucuyu ertelenmiş içerikle değiştirir. Bu blok isteğe bağlı olsa da, Angular ekibi her zaman bir yer tutucu eklemenizi önerir.
        <a href="https://angular.dev/guide/templates/defer#triggers" target="_blank">
          Tam ertelenebilir görünümler belgelerinde daha fazla bilgi edinin
        </a>
      </td>
    </tr>
    <tr>
      <td><code>@loading</code></td>
      <td>
        Bu isteğe bağlı blok, ertelenmiş bağımlılıkların yüklenmesi sırasında gösterilecek içeriği bildirmenize olanak tanır.
      </td>
    </tr>
    <tr>
      <td><code>@error</code></td>
      <td>
        Bu blok, ertelenmiş yükleme başarısız olduğunda gösterilecek içeriği bildirmenize olanak tanır.
      </td>
    </tr>
  </table>
</div>

Yukarıdaki tüm alt blokların içerikleri hevesli (eagerly) olarak yüklenir. Ek olarak, bazı özellikler bir `@placeholder` bloğu gerektirir.

Bu aktivitede, ertelenebilir görünümlerin durumlarını yönetmek için `@loading`, `@error` ve `@placeholder` bloklarını nasıl kullanacağınızı öğreneceksiniz.

<hr>

<docs-workflow>

<docs-step title="Add `@placeholder` block">
`app.ts` dosyanızda, `@defer` bloğuna bir `@placeholder` bloğu ekleyin.

```angular-html {highlight:[3,4,5]}
@defer {
  <article-comments />
} @placeholder {
  <p>Placeholder for comments</p>
}
```

</docs-step>

<docs-step title="Configure the `@placeholder` block">
`@placeholder` bloğu, bu yer tutucunun gösterilmesi gereken `minimum` süreyi belirten isteğe bağlı bir parametre kabul eder. Bu `minimum` parametresi milisaniye (ms) veya saniye (s) cinsinden zaman artışlarıyla belirtilir. Bu parametre, ertelenmiş bağımlılıkların hızlıca getirilmesi durumunda yer tutucu içeriğin hızla yanıp sönmesini önlemek için mevcuttur.

```angular-html {highlight:[3,4,5]}
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
}
```

</docs-step>

<docs-step title="Add `@loading` block">
Ardından bileşen şablonuna bir `@loading` bloğu ekleyin.

`@loading` bloğu iki isteğe bağlı parametre kabul eder:

- `minimum`: bu bloğun gösterilmesi gereken süre
- `after`: yükleme şablonunu göstermeden önce yükleme başladıktan sonra beklenecek süre

Her iki parametre de milisaniye (ms) veya saniye (s) cinsinden zaman artışlarıyla belirtilir.

`app.ts` dosyasını, `1s` minimum parametresine ve `500ms` değerinde bir after parametresine sahip bir `@loading` bloğu içerecek şekilde güncelleyin.

```angular-html {highlight:[5,6,7]}
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
}
```

NOT: bu örnek, ; karakteri ile ayrılmış iki parametre kullanmaktadır.

</docs-step>

<docs-step title="Add `@error` block">
Son olarak, `@defer` bloğuna bir `@error` bloğu ekleyin.

```angular-html {highlight:[7,8,9]}
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
```

</docs-step>
</docs-workflow>

Tebrikler! Bu noktada, ertelenebilir görünümler hakkında iyi bir anlayışa sahipsiniz. Harika çalışmaya devam edin ve şimdi tetikleyicileri (triggers) öğrenelim.
