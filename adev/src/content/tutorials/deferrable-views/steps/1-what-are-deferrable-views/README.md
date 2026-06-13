# Ertelenebilir görünümler nedir?

Tam olarak render edilmiş bir Angular sayfası birçok farklı bileşen, direktif ve pipe içerebilir. Sayfanın bazı bölümleri kullanıcıya hemen gösterilmesi gerekirken, bazı bölümler daha sonra gösterilmek üzere bekleyebilir.
Angular'ın _ertelenebilir görünümleri_, `@defer` sözdizimini kullanarak, sayfanın hemen gösterilmesi gerekmeyen bölümleri için JavaScript'in indirilmesini beklemesini Angular'a söyleyerek uygulamanızı hızlandırmanıza yardımcı olabilir.

Bu aktivitede, bileşen şablonunuzun bir bölümünü ertelenmiş olarak yüklemek için ertelenebilir görünümleri nasıl kullanacağınızı öğreneceksiniz.

<hr>

<docs-workflow>

<docs-step title="Add a `@defer` block to a section of a template">
`app.ts` dosyanızda, `article-comments` bileşenini ertelenmiş olarak yüklemek için bir `@defer` bloğu ile sarın.

```angular-html
@defer {
  <article-comments />
}
```

Varsayılan olarak, `@defer` tarayıcı boşta olduğunda `article-comments` bileşenini yükler.

Tarayıcınızın geliştirici konsolunda, `article-comments-component` tembel yükleme (lazy chunk) dosyasının ayrı olarak yüklendiğini görebilirsiniz (Belirli dosya adları her çalıştırmada değişebilir):

```markdown
Initial chunk files | Names | Raw size
chunk-NNSQHFIE.js | - | 769.00 kB |
main.js | main | 229.25 kB |

Lazy chunk files | Names | Raw size
chunk-T5UYXUSI.js | article-comments-component | 1.84 kB |
```

</docs-step>
</docs-workflow>

Harika iş! Ertelenebilir görünümlerin temellerini öğrendiniz.
