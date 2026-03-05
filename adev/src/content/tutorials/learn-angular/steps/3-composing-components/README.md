# Composing Components

Bileşen şablonunu, bileşen mantığını ve bileşen stillerini güncellemeyi öğrendiniz, peki bir bileşeni uygulamanızda nasıl kullanırsınız?

Bileşen yapılandırmasının `selector` özelliği, bileşene başka bir şablonda referans verirken kullanabileceğiniz bir ad sağlar. `selector`'ı bir HTML etiketi gibi kullanırsınız; örneğin `app-user`, şablonda `<app-user />` şeklinde olur.

NOTE: [Temel bilgiler kılavuzundaki bileşen kullanımı](/essentials/components#using-components) hakkında daha fazla bilgi edinin.

Bu aktivitede, bileşenleri nasıl bir araya getireceğinizi öğreneceksiniz.

<hr/>

Bu örnekte iki bileşen vardır: `User` ve `App`.

<docs-workflow>

<docs-step title="Add a reference to `User`">
`App` şablonunu, `app-user` seçicisini kullanan `User` bileşenine bir referans içerecek şekilde güncelleyin. `User`'ı `App`'in imports dizisine eklediğinizden emin olun; bu, bileşenin `App` şablonunda kullanılabilir olmasını sağlar.

```angular-html
template: `<app-user />`, imports: [User]
```

Bileşen artık `Username: youngTech` mesajını gösterir. Daha fazla işaretleme eklemek için şablon kodunu güncelleyebilirsiniz.
</docs-step>

<docs-step title="Add more markup">
Bir şablonda istediğiniz herhangi bir HTML işaretlemesini kullanabildiğiniz için, `App` şablonunu daha fazla HTML öğesi içerecek şekilde güncellemeyi deneyin. Bu örnek, `<app-user>` öğesinin üst öğesi olarak bir `<section>` öğesi ekleyecektir.

```angular-html
template: `
<section><app-user /></section>
`,
```

</docs-step>

</docs-workflow>
Uygulama fikrinizi gerçeğe dönüştürmek için istediğiniz kadar HTML işaretlemesi ve bileşen kullanabilirsiniz. Aynı sayfada bileşeninizin birden fazla kopyasına bile sahip olabilirsiniz.

Bu güzel bir geçiş noktası; verilere dayalı olarak bir bileşeni koşullu olarak nasıl gösterirsiniz? Öğrenmek için bir sonraki bölüme geçin.
