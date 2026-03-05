# Deployment

Angular uygulamanızı uzak bir sunucuya dağıtmaya hazır olduğunuzda, çeşitli seçenekleriniz vardır.

## Automatic deployment with the CLI

Angular CLI komutu `ng deploy`, projenizle ilişkili `deploy` [CLI builder'ını](tools/cli/cli-builder) çalıştırır.
Birçok üçüncü taraf builder, farklı platformlara dağıtım yetenekleri uygular.
Bunlardan herhangi birini `ng add` ile projenize ekleyebilirsiniz.

Dağıtım yeteneğine sahip bir paket eklediğinizde, seçilen proje için çalışma alanı yapılandırmanızı (`angular.json` dosyası) otomatik olarak bir `deploy` bölümüyle günceller.
Ardından o projeyi dağıtmak için `ng deploy` komutunu kullanabilirsiniz.

Örneğin, aşağıdaki komut bir projeyi otomatik olarak [Firebase](https://firebase.google.com/)'e dağıtır.

```shell

ng add @angular/fire
ng deploy

```

Komut etkileşimlidir.
Bu durumda, bir Firebase hesabınız olmalı veya oluşturmalı ve bunu kullanarak kimlik doğrulaması yapmalısınız.
Komut, uygulamanızı derlemeden ve üretim varlıklarını Firebase'e yüklemeden önce dağıtım için bir Firebase projesi seçmenizi ister.

Aşağıdaki tablo, farklı platformlara dağıtım işlevselliği uygulayan araçları listeler.
Her paket için `deploy` komutu farklı komut satırı seçenekleri gerektirebilir.
Aşağıdaki paket adlarıyla ilişkili bağlantıları takip ederek daha fazla bilgi edinebilirsiniz:

| Dağıtım hedefi                                                    | Kurulum Komutu                                                                              |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| [Firebase hosting](https://firebase.google.com/docs/hosting)      | [`ng add @angular/fire`](https://npmjs.org/package/@angular/fire)                           |
| [Vercel](https://vercel.com/solutions/angular)                    | [`vercel init angular`](https://github.com/vercel/vercel/tree/main/examples/angular)        |
| [Netlify](https://www.netlify.com)                                | [`ng add @netlify-builder/deploy`](https://npmjs.org/package/@netlify-builder/deploy)       |
| [GitHub pages](https://pages.github.com)                          | [`ng add angular-cli-ghpages`](https://npmjs.org/package/angular-cli-ghpages)               |
| [Amazon Cloud S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3) | [`ng add @jefiozie/ngx-aws-deploy`](https://www.npmjs.com/package/@jefiozie/ngx-aws-deploy) |

Kendi yönettiğiniz bir sunucuya dağıtıyorsanız veya favori bulut platformunuz için bir builder yoksa, `ng deploy` komutunu kullanmanıza olanak tanıyan [bir builder oluşturabilir](tools/cli/cli-builder) veya uygulamanızı manuel olarak nasıl dağıtacağınızı öğrenmek için bu kılavuzu okuyabilirsiniz.

## Manual deployment to a remote server

Uygulamanızı manuel olarak dağıtmak için bir üretim derlemesi oluşturun ve çıktı dizinini bir web sunucusuna veya içerik dağıtım ağına (CDN) kopyalayın.
Varsayılan olarak, `ng build` `production` yapılandırmasını kullanır.
Derleme yapılandırmalarınızı özelleştirdiyseniz, dağıtımdan önce [üretim optimizasyonlarının](tools/cli/deployment#production-optimizations) uygulandığını doğrulamak isteyebilirsiniz.

`ng build` derlenen yapıtları varsayılan olarak `dist/my-app/` dizinine çıktılar, ancak bu yol `@angular-devkit/build-angular:browser` builder'ındaki `outputPath` seçeneğiyle yapılandırılabilir.
Bu dizini sunucuya kopyalayın ve dizini sunacak şekilde yapılandırın.

Bu minimal bir dağıtım çözümü olsa da, sunucunun Angular uygulamanızı doğru şekilde sunması için birkaç gereksinim vardır.

## Server configuration

Bu bölüm, Angular uygulamanızı çalıştırmak için sunucuda yapmanız gerekebilecek değişiklikleri kapsar.

### Routed apps must fall back to `index.html`

İstemci tarafında oluşturulan Angular uygulamaları, tüm içerik statik olduğundan ve derleme zamanında oluşturulduğundan, statik bir HTML sunucusuyla sunulması için mükemmel adaylardır.

Uygulama Angular yönlendirici kullanıyorsa, sunucuyu sahip olmadığı bir dosya istendiğinde uygulamanın ana sayfasını (`index.html`) döndürecek şekilde yapılandırmanız gerekir.

Yönlendirmeli bir uygulama "derin bağlantıları" desteklemelidir.
Bir _derin bağlantı_, uygulama içindeki bir bileşene giden bir yolu belirten bir URL'dir.
Örneğin, `http://my-app.test/users/42`, `id` değeri 42 olan kullanıcıyı görüntüleyen kullanıcı detay sayfasına bir _derin bağlantıdır_.

Kullanıcı başlangıçta dizin sayfasını yüklediğinde ve ardından çalışan bir istemci içinden o URL'ye gittiğinde sorun yoktur.
Angular yönlendirici navigasyonu _istemci tarafında_ gerçekleştirir ve yeni bir HTML sayfası istemez.

Ancak bir e-postadaki derin bağlantıya tıklamak, tarayıcı adres çubuğuna girmek veya zaten derin bağlantılı sayfadayken tarayıcıyı yenilemek, çalışan uygulamanın _dışında_, tarayıcının kendisi tarafından ele alınır.
Tarayıcı, Angular'ın yönlendiricisini atlayarak `/users/42` için sunucuya doğrudan bir istek yapar.

Statik bir sunucu, `http://my-app.test/` için bir istek aldığında düzenli olarak `index.html` döndürür.
Ancak çoğu sunucu varsayılan olarak `http://my-app.test/users/42` isteğini reddeder ve bunun yerine `index.html` döndürecek şekilde yapılandırılmadıkça bir `404 - Not Found` hatası döndürür.
Angular'ın derin bağlantılar için sunulabilmesi ve doğru rotayı görüntüleyebilmesi için sunucunuzda yedek rota veya 404 sayfasını `index.html` olarak yapılandırın.
Bazı sunucular bu yedek davranışı "Tek Sayfa Uygulaması" (SPA) modu olarak adlandırır.

Tarayıcı uygulamayı yüklediğinde, Angular yönlendirici hangi sayfada olduğunu belirlemek için URL'yi okuyacak ve `/users/42` sayfasını doğru şekilde görüntüleyecektir.

`http://my-app.test/does-not-exist` gibi "gerçek" 404 sayfaları için sunucunun ek yapılandırma gerektirmez.
[Angular yönlendiricide uygulanan 404 sayfaları](guide/routing/common-router-tasks#displaying-a-404-page) doğru şekilde görüntülenecektir.

### Requesting data from a different server (CORS)

Web geliştiricileri, uygulamanın kendi ana sunucusu dışında bir sunucuya ağ isteği yaparken [_çapraz kaynak kaynak paylaşımı_](https://developer.mozilla.org/docs/Web/HTTP/CORS 'Cross-origin resource sharing') hatasıyla karşılaşabilir.
Tarayıcılar, sunucu açıkça izin vermedikçe bu tür istekleri engeller.

Angular veya istemci uygulamasının bu hatalar hakkında yapabileceği bir şey yoktur.
_Sunucu_, uygulamanın isteklerini kabul edecek şekilde yapılandırılmalıdır.
Belirli sunucular için CORS'u nasıl etkinleştireceğinizi öğrenmek için [enable-cors.org](https://enable-cors.org/server.html 'Enabling CORS server') adresine bakın.

## Production optimizations

`ng build`, aksi yapılandırılmadıkça `production` yapılandırmasını kullanır. Bu yapılandırma aşağıdaki derleme optimizasyon özelliklerini etkinleştirir.

| Özellikler                                                    | Ayrıntılar                                                                                                         |
| :------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------- |
| [Ahead-of-Time (AOT) Derleme](tools/cli/aot-compiler)         | Angular bileşen şablonlarını önceden derler.                                                                       |
| [Üretim modu](tools/cli/deployment#development-only-features) | En iyi çalışma zamanı performansı için uygulamayı optimize eder                                                    |
| Paketleme                                                     | Birçok uygulama ve kütüphane dosyanızı minimum sayıda dağıtım dosyasına birleştirir.                               |
| Küçültme                                                      | Fazla boşlukları, yorumları ve isteğe bağlı belirteçleri kaldırır.                                                 |
| Karıştırma                                                    | Fonksiyonları, sınıfları ve değişkenleri daha kısa, rastgele tanımlayıcılar kullanacak şekilde yeniden adlandırır. |
| Ölü kod eliminasyonu                                          | Referans verilmeyen modülleri ve kullanılmayan kodu kaldırır.                                                      |

CLI derleme seçenekleri ve etkileri hakkında daha fazla bilgi için [`ng build`](cli/build) belgesine bakın.

### Development-only features

Bir uygulamayı `ng serve` ile yerel olarak çalıştırdığınızda, Angular çalışma zamanında şunları etkinleştiren geliştirme yapılandırmasını kullanır:

- [`expression-changed-after-checked`](errors/NG0100) algılama gibi ek güvenlik kontrolleri.
- Daha ayrıntılı hata mesajları.
- Global `ng` değişkeni ile [hata ayıklama fonksiyonları](api#core-global) ve [Angular DevTools](tools/devtools) desteği gibi ek hata ayıklama yardımcıları.

Bu özellikler geliştirme sırasında faydalıdır, ancak uygulamada ek kod gerektirirler, bu da
üretimde istenmeyen bir durumdur. Bu özelliklerin son kullanıcılar için paket boyutunu olumsuz etkilememesini sağlamak amacıyla Angular CLI, üretim için derleme yaparken yalnızca geliştirmeye özgü kodu paketten kaldırır.

Uygulamanızı `ng build` ile derlemek varsayılan olarak `production` yapılandırmasını kullanır ve bu özellikleri optimal paket boyutu için çıktıdan kaldırır.

## `--deploy-url`

`--deploy-url`, resimler, betikler ve stil sayfaları gibi varlıklar için göreli URL'lerin _derleme_ zamanında çözümlenmesi için temel yolu belirtmek üzere kullanılan bir komut satırı seçeneğidir.

```shell

ng build --deploy-url /my/assets

```

`--deploy-url`'nin etkisi ve amacı [`<base href>`](guide/routing/common-router-tasks) ile örtüşür. Her ikisi de başlangıç betikleri, stil sayfaları, tembel betikler ve CSS kaynakları için kullanılabilir.

Çalışma zamanında tek bir yerde tanımlanabilen `<base href>`'nin aksine, `--deploy-url`'nin derleme zamanında uygulamaya sabit kodlanması gerekir.
Mümkün olduğunda `<base href>` tercih edin.
