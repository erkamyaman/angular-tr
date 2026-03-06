# Şablonlarda boşluk

Varsayılan olarak, Angular şablonları çerçevenin gereksiz kabul ettiği boşlukları korumaz. Bu genellikle iki durumda gerçekleşir: elemanlar arasındaki boşluk ve metin içindeki daraltılabilir boşluk.

## Elemanlar arasındaki boşluk

Çoğu geliştirici şablonlarını okunabilir kılmak için yeni satırlar ve girintilerle biçimlendirmeyi tercih eder:

```html
<section>
  <h3>User profile</h3>
  <label>
    User name
    <input />
  </label>
</section>
```

Bu şablon tüm elemanlar arasında boşluk içerir. Aşağıdaki parça, ne kadar boşluk bulunduğunu vurgulamak için her boşluk karakterinin diyez (`#`) karakteriyle değiştirildiği aynı HTML'i göstermektedir:

<!-- prettier-ignore>
```html
<!-- Toplam Boşluk: 20 -->
<section>###<h3>User profile</h3>###<label>#####User name#####<input>###</label>#</section>
```

Boşluğu şablonda yazıldığı gibi korumak, birçok gereksiz [metin düğümüne](https://developer.mozilla.org/en-US/docs/Web/API/Text) yol açar ve sayfa işleme yükünü artırır. Elemanlar arasındaki bu boşluğu yok sayarak, Angular şablonu sayfada işlerken daha az iş yapar ve genel performansı iyileştirir.

## Metin içindeki daraltılabilir boşluk

Web tarayıcınız HTML'i sayfada işlerken, art arda gelen birden fazla boşluk karakterini tek bir karaktere daraltır:

<!-- prettier-ignore -->
```html
<!-- Şablonda nasıl göründüğü -->
<p>Hello         world</p>
```

Bu örnekte, tarayıcı "Hello" ile "world" arasında yalnızca tek bir boşluk görüntüler.

```angular-html
<!-- Tarayıcıda ne göründüğü -->
<p>Hello world</p>
```

Bu nasıl çalışır hakkında daha fazla bağlam için [Boşluk HTML, CSS ve DOM'da nasıl işlenir](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace) konusuna bakın.

Angular, şablonu derlerken bu gereksiz boşluk karakterlerini tek bir karaktere daraltarak tarayıcıya göndermekten kaçınır.

## Boşluğu koruma

Angular'a bir şablondaki boşluğu korumasını, bileşen için `@Component` dekoratöründe `preserveWhitespaces: true` belirterek söyleyebilirsiniz.

```angular-ts
@Component({
  /* ... */,
  preserveWhitespaces: true,
  template: `
    <p>Hello         world</p>
  `
})
```

Kesinlikle gerekli olmadıkça bu seçeneği ayarlamaktan kaçının. Boşluğu korumak, Angular'ın işleme sırasında önemli ölçüde daha fazla düğüm üretmesine neden olarak uygulamanızı yavaşlatabilir.

Ek olarak, Angular'a özgü özel bir HTML varlığı olan `&ngsp;` kullanabilirsiniz. Bu varlık, derlenmiş çıktıda korunan tek bir boşluk karakteri üretir.
