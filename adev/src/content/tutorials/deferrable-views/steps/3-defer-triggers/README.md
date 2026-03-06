# Defer triggers

`@defer` için varsayılan seçenekler, bileşenlerinizin bölümlerini tembel yükleme (lazy loading) için harika seçenekler sunarken, ertelenmiş yükleme deneyimini daha da özelleştirmek istenebilir.

Varsayılan olarak, ertelenmiş içerik tarayıcı boşta olduğunda yüklenir. Ancak bir **tetikleyici** belirterek bu yüklemenin ne zaman gerçekleşeceğini özelleştirebilirsiniz. Bu, bileşeninize en uygun yükleme davranışını seçmenizi sağlar.

Ertelenebilir görünümler iki tür yükleme tetikleyicisi sunar:

<div class="docs-table docs-scroll-track-transparent">
  <table>
    <tr>
      <td><code>on</code></td>
      <td>
        Yerleşik tetikleyiciler listesinden bir tetikleyici kullanan tetikleme koşulu.<br/>
        Örneğin: <code>@defer (on viewport)</code>
      </td>
    </tr>
    <tr>
      <td><code>when</code></td>
      <td>
        Doğruluk değeri için değerlendirilen bir ifade koşulu. İfade doğru olduğunda, yer tutucu tembel yüklenen içerikle değiştirilir.<br/>
        Örneğin: <code>@defer (when customizedCondition)</code>
      </td>
    </tr>
  </table>
</div>

`when` koşulu `false` olarak değerlendirilirse, `defer` bloğu yer tutucuya geri döndürülmez. Değişim tek seferlik bir işlemdir.

Aynı anda birden fazla olay tetikleyicisi tanımlayabilirsiniz; bu tetikleyiciler VEYA koşulları olarak değerlendirilir.

- Örn: `@defer (on viewport; on timer(2s))`
- Örn: `@defer (on viewport; when customizedCondition)`

Bu aktivitede, ertelenebilir görünümleri yüklemek için koşul belirlemede tetikleyicileri nasıl kullanacağınızı öğreneceksiniz.

<hr>

<docs-workflow>

<docs-step title="Add `on hover` trigger">
`app.ts` dosyanızda, `@defer` bloğuna bir `on hover` tetikleyicisi ekleyin.

```angular-html {highlight:[1]}
@defer (on hover) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
```

Artık sayfa, yer tutucunun üzerine gelene kadar yorumlar bölümünü render etmeyecektir.
</docs-step>

<docs-step title="Add a 'Show all comments' button">
Ardından, şablonu "Show all comments" etiketli bir düğme içerecek şekilde güncelleyin. Düğmeye `#showComments` adlı bir şablon değişkeni ekleyin.

```angular-html {highlight:[1]}
<button type="button" #showComments>Show all comments</button>

@defer (on hover) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
```

NOT: [şablon değişkenleri hakkında daha fazla bilgi için belgelere göz atın](/guide/templates/variables#şablon-referans-değişkeni-bildirme).

</docs-step>

<docs-step title="Add `on interaction` trigger">
Şablondaki `@defer` bloğunu `on interaction` tetikleyicisini kullanacak şekilde güncelleyin. `interaction` parametresi olarak `showComments` şablon değişkenini sağlayın.

```angular-html {highlight:[3]}
<button type="button" #showComments>Show all comments</button>

@defer (on hover; on interaction(showComments)) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
```

Bu değişikliklerle, sayfa yorumlar bölümünü render etmeden önce aşağıdaki koşullardan birini bekleyecektir:

- Kullanıcı yorumlar bölümünün yer tutucusu üzerine gelir
- Kullanıcı "Show all comments" düğmesine tıklar

Yorumlar bölümünü render etmek için farklı tetikleyicileri denemek üzere sayfayı yeniden yükleyebilirsiniz.
</docs-step>
</docs-workflow>

Daha fazla bilgi edinmek istiyorsanız, [Ertelenebilir Görünüm](/guide/templates/defer) belgelerine göz atın.
Angular'ın harika özelliklerinin daha fazlasını keşfetmek için öğrenmeye devam edin.
