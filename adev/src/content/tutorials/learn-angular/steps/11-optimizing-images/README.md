# Optimizing images

Resimler birçok uygulamanın büyük bir parçasıdır ve düşük [Core Web Vitals](https://web.dev/explore/learn-core-web-vitals) puanları da dahil olmak üzere uygulama performans sorunlarına önemli bir katkıda bulunabilir.

Resim optimizasyonu karmaşık bir konu olabilir, ancak Angular bunun çoğunu `NgOptimizedImage` direktifi ile sizin yerinize halleder.

NOTE: [Ayrıntılı kılavuzdaki NgOptimizedImage ile resim optimizasyonu](/guide/image-optimization) hakkında daha fazla bilgi edinin.

Bu aktivitede, resimlerinizin verimli bir şekilde yüklenmesini sağlamak için `NgOptimizedImage`'ı nasıl kullanacağınızı öğreneceksiniz.

<hr>

<docs-workflow>

<docs-step title="NgOptimizedImage direktifini içe aktarın">

`NgOptimizedImage` direktifinden yararlanmak için, önce `@angular/common` kütüphanesinden içe aktarın ve bileşenin `imports` dizisine ekleyin.

```ts
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  ...
})
```

</docs-step>

<docs-step title="src niteliğini ngSrc olarak güncelleyin">

`NgOptimizedImage` direktifini etkinleştirmek için `src` niteliğini `ngSrc` ile değiştirin. Bu, hem statik resim kaynakları (yani `src`) hem de dinamik resim kaynakları (yani `[src]`) için geçerlidir.

```angular-ts {highlight:[[7],[11]]}
import { NgOptimizedImage } from '@angular/common';

@Component({
template: `     ...
    <li>
      Static Image:
      <img ngSrc="/logo.svg" alt="Angular logo" width="32" height="32" />
    </li>
    <li>
      Dynamic Image:
      <img [ngSrc]="logoUrl" [alt]="logoAlt" width="32" height="32" />
    </li>
    ...
  `,
imports: [NgOptimizedImage],
})
```

</docs-step>

<docs-step title="width ve height niteliklerini ekleyin">

Yukarıdaki kod örneğinde her resmin hem `width` hem de `height` niteliklerine sahip olduğuna dikkat edin. [Düzen kaymasını](https://web.dev/articles/cls) önlemek için `NgOptimizedImage` direktifi, her resimde her iki boyut niteliğini de gerektirir.

Resimler için statik bir `height` ve `width` belirleyemediğiniz veya belirlemek istemediğiniz durumlarda, resme kapsayıcı öğesini dolduran bir "arka plan resmi" gibi davranmasını söylemek için [`fill` niteliğini](https://web.dev/articles/cls) kullanabilirsiniz:

```angular-html
// Container div has 'position: "relative"'
<div class="image-container">
  <img ngSrc="www.example.com/image.png" fill />
</div>
```

NOTE: `fill` resminin düzgün görüntülenmesi için üst öğesinin `position: "relative"`, `position: "fixed"` veya `position: "absolute"` ile stillendirilmesi gerekir.

</docs-step>

<docs-step title="Önemli resimlere öncelik verin">

Yükleme performansı için en önemli optimizasyonlardan biri, sayfa yüklendiğinde ekrandaki en büyük grafik öğesi olan ["LCP öğesi"](https://web.dev/articles/optimize-lcp) olabilecek herhangi bir resme öncelik vermektir. Yükleme sürelerinizi optimize etmek için "hero resminize" veya LCP öğesi olabileceğini düşündüğünüz diğer resimlere `priority` niteliğini eklediğinizden emin olun.

```ts
<img ngSrc="www.example.com/image.png" height="600" width="800" priority />
```

</docs-step>

<docs-step title="İsteğe bağlı: Bir resim yükleyici kullanın">

`NgOptimizedImage`, direktifin resimleriniz için URL'leri nasıl biçimlendireceğini belirten bir [resim yükleyici](guide/image-optimization#ngoptimizedimage-için-görsel-yükleyici-yapılandırma) belirtmenize olanak tanır. Yükleyici kullanmak, resimlerinizi kısa, göreli URL'lerle tanımlamanızı sağlar:

```ts
providers: [provideImgixLoader('https://my.base.url/')],
```

Son URL 'https://my.base.url/image.png' olacaktır

```angular-html
<img ngSrc="image.png" height="600" width="800" />
```

Resim yükleyicileri sadece kolaylık sağlamak için değildir -- `NgOptimizedImage`'ın tüm yeteneklerini kullanmanızı sağlarlar. Bu optimizasyonlar ve popüler CDN'ler için yerleşik yükleyiciler hakkında daha fazla bilgiyi [burada](guide/image-optimization#ngoptimizedimage-için-görsel-yükleyici-yapılandırma) bulabilirsiniz.

</docs-step>

</docs-workflow>

Bu direktifi iş akışınıza ekleyerek, resimleriniz artık Angular'ın yardımıyla en iyi uygulamalar kullanılarak yükleniyor 🎉

Daha fazla bilgi edinmek isterseniz, [`NgOptimizedImage` belgelerine](guide/image-optimization) göz atın. Harika çalışmaya devam edin ve sırada yönlendirmeyi (routing) öğrenelim.
