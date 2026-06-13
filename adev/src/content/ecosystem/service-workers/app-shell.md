# App shell kalıbı

[App shell kalıbı](https://developer.chrome.com/blog/app-shell), derleme zamanında bir rota kullanarak uygulamanızın bir bölümünü render etmenin bir yoludur.
Tarayıcı istemcinin tam sürümünü indirirken ve kod yüklendikten sonra otomatik olarak ona geçerken, hızlıca statik olarak render edilmiş bir sayfa (tüm sayfalarda ortak olan bir iskelet) başlatarak kullanıcı deneyimini iyileştirebilir.

Bu, kullanıcılara uygulamanızın anlamlı bir ilk çizimini hızlıca sunar çünkü tarayıcı herhangi bir JavaScript başlatmaya gerek kalmadan HTML ve CSS'i render edebilir.

<docs-workflow>
<docs-step title="Uygulamayı hazırlayın">
Bunu aşağıdaki Angular CLI komutuyla yapın:

```shell
ng new my-app
```

Mevcut bir uygulama için `Router`'ı manuel olarak eklemeniz ve uygulamanız içinde bir `<router-outlet>` tanımlamanız gerekir.
</docs-step>
<docs-step title="Uygulama kabuğunu oluşturun">
Uygulama kabuğunu otomatik olarak oluşturmak için Angular CLI'yi kullanın.

```shell
ng generate app-shell
```

Bu komut hakkında daha fazla bilgi için [App shell komutu](cli/generate/app-shell) sayfasına bakın.

Komut, uygulama kodunu günceller ve proje yapısına ekstra dosyalar ekler.

```text
src
├── app
│ ├── app.config.server.ts # sunucu uygulama yapılandırması
│ └── app-shell # app-shell bileşeni
│   ├── app-shell.component.html
│   ├── app-shell.component.scss
│   ├── app-shell.component.spec.ts
│   └── app-shell.component.ts
└── main.server.ts # ana sunucu uygulama başlatma
```

<docs-step title="Uygulamanın kabuk içeriğiyle derlendiğini doğrulayın">

```shell
ng build --configuration=development
```

Veya üretim yapılandırmasını kullanmak için.

```shell
ng build
```

Derleme çıktısını doğrulamak için <code class="no-auto-link">dist/my-app/browser/index.html</code> dosyasını açın.
Uygulama kabuğu rotasının çıktının bir parçası olarak render edildiğini göstermek için varsayılan `app-shell works!` metnini arayın.
</docs-step>
</docs-workflow>
