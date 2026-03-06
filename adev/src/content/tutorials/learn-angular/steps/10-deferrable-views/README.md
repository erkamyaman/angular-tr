# Ertelenebilir Görünümler

Bazen uygulama geliştirmede, uygulamanızda referans vermeniz gereken çok sayıda bileşen olur, ancak bazılarının çeşitli nedenlerle hemen yüklenmesi gerekmez.

Belki görünür alanın altında kalıyorlardır veya daha sonraya kadar etkileşime girilmeyen ağır bileşenlerdir. Bu durumda, ertelenebilir görünümler ile bu kaynakların bir kısmını daha sonra yükleyebiliriz.

NOTE: [Ayrıntılı kılavuzdaki @defer ile ertelenmiş yükleme](/guide/templates/defer) hakkında daha fazla bilgi edinin.

Bu aktivitede, bileşen şablonunuzun bir bölümünü ertelenmiş olarak yüklemek için ertelenebilir görünümleri nasıl kullanacağınızı öğreneceksiniz.

<hr>

<docs-workflow>

<docs-step title="Yorumlar bileşeninin etrafına bir `@defer` bloğu ekleyin">

Uygulamanızda, blog yazısı sayfasında yazı detaylarından sonra bir yorum bileşeni bulunmaktadır.

Yorum bileşenini ertelenmiş olarak yüklemek için bir `@defer` bloğu ile sarmalayın.

```angular-html
@defer {
  <comments />
}
```

Yukarıdaki kod, temel bir `@defer` bloğunun nasıl kullanılacağına dair bir örnektir. Varsayılan olarak `@defer`, tarayıcı boşta olduğunda `comments` bileşenini yükleyecektir.

</docs-step>

<docs-step title="Bir yer tutucu ekleyin">

`@defer` bloğuna bir `@placeholder` bloğu ekleyin. `@placeholder` bloğu, ertelenmiş yükleme başlamadan önce gösterilecek HTML'i koyduğunuz yerdir. `@placeholder` bloklarındaki içerik hevesli (eager) olarak yüklenir.

```angular-html {highlight:[3,4,5]}
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
}
```

</docs-step>

<docs-step title="Bir yükleme bloğu ekleyin">

`@defer` bloğuna bir `@loading` bloğu ekleyin. `@loading` bloğu, ertelenmiş içerik aktif olarak getirilirken ancak henüz tamamlanmamışken gösterilecek HTML'i koyduğunuz yerdir. `@loading` bloklarındaki içerik hevesli (eager) olarak yüklenir.

```angular-html {highlight:[5,6,7]}
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
} @loading {
  <p>Loading comments...</p>
}
```

</docs-step>

<docs-step title="Minimum süre ekleyin">

Hem `@placeholder` hem de `@loading` bölümlerinin, yükleme hızlı gerçekleştiğinde titreşimi önlemek için isteğe bağlı parametreleri vardır. `@placeholder`'ın `minimum` parametresi, `@loading`'in ise `minimum` ve `after` parametreleri bulunur. `@loading` bloğuna en az 2 saniye boyunca gösterilmesi için bir `minimum` süre ekleyin.

```angular-html {highlight:[5]}
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
} @loading (minimum 2s) {
  <p>Loading comments...</p>
}
```

</docs-step>

<docs-step title="Bir viewport tetikleyicisi ekleyin">

Ertelenebilir görünümlerin bir dizi tetikleme seçeneği vardır. İçeriğin görünür alana girdiğinde ertelenmiş olarak yüklenmesi için bir viewport tetikleyicisi ekleyin.

```angular-html {highlight:[1]}
@defer (on viewport) {
  <comments />
}
```

</docs-step>

<docs-step title="İçerik ekleyin">

Viewport tetikleyicisi, en iyi şekilde sayfada yeterince aşağıda olan ve görmek için kaydırma gerektiren içeriği ertelerken kullanılır. Bu yüzden blog yazımıza biraz içerik ekleyelim. Kendi içeriğinizi yazabilir veya aşağıdaki içeriği kopyalayıp `<article>` öğesinin içine koyabilirsiniz.

```html {highlight:[1]}
<article>
  <p>
    Angular is my favorite framework, and this is why. Angular has the coolest deferrable view
    feature that makes defer loading content the easiest and most ergonomic it could possibly be.
    The Angular community is also filled with amazing contributors and experts that create excellent
    content. The community is welcoming and friendly, and it really is the best community out there.
  </p>
  <p>
    I can't express enough how much I enjoy working with Angular. It offers the best developer
    experience I've ever had. I love that the Angular team puts their developers first and takes
    care to make us very happy. They genuinely want Angular to be the best framework it can be, and
    they're doing such an amazing job at it, too. This statement comes from my heart and is not at
    all copied and pasted. In fact, I think I'll say these exact same things again a few times.
  </p>
  <p>
    Angular is my favorite framework, and this is why. Angular has the coolest deferrable view
    feature that makes defer loading content the easiest and most ergonomic it could possibly be.
    The Angular community is also filled with amazing contributors and experts that create excellent
    content. The community is welcoming and friendly, and it really is the best community out there.
  </p>
  <p>
    I can't express enough how much I enjoy working with Angular. It offers the best developer
    experience I've ever had. I love that the Angular team puts their developers first and takes
    care to make us very happy. They genuinely want Angular to be the best framework it can be, and
    they're doing such an amazing job at it, too. This statement comes from my heart and is not at
    all copied and pasted. In fact, I think I'll say these exact same things again a few times.
  </p>
  <p>
    Angular is my favorite framework, and this is why. Angular has the coolest deferrable view
    feature that makes defer loading content the easiest and most ergonomic it could possibly be.
    The Angular community is also filled with amazing contributors and experts that create excellent
    content. The community is welcoming and friendly, and it really is the best community out there.
  </p>
  <p>
    I can't express enough how much I enjoy working with Angular. It offers the best developer
    experience I've ever had. I love that the Angular team puts their developers first and takes
    care to make us very happy. They genuinely want Angular to be the best framework it can be, and
    they're doing such an amazing job at it, too. This statement comes from my heart and is not at
    all copied and pasted.
  </p>
</article>
```

Bu kodu ekledikten sonra, ertelenmiş içeriğin görünür alana kaydırdığınızda yüklendiğini görmek için aşağı kaydırın.

</docs-step>

</docs-workflow>

Bu aktivitede, uygulamalarınızda ertelenebilir görünümleri nasıl kullanacağınızı öğrendiniz. Harika is. 🙌

Farklı tetikleyiciler, ön yükleme (prefetching) ve `@error` blokları gibi daha fazlasını yapabilirsiniz.

Daha fazla bilgi edinmek isterseniz, [Ertelenebilir görünümler belgelerine](/guide/templates/defer) göz atın.
