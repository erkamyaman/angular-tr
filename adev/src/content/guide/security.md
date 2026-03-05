# Security

Bu konu, Angular'ın siteler arası komut dosyası çalıştırma saldırıları gibi yaygın web uygulama güvenlik açıkları ve saldırılarına karşı yerleşik korumaları açıklamaktadır.
Kimlik doğrulama ve yetkilendirme gibi uygulama düzeyinde güvenliği kapsamaz.

Aşağıda açıklanan saldırılar ve azaltma yöntemleri hakkında daha fazla bilgi için [Open Web Application Security Project (OWASP) Kılavuzu](https://www.owasp.org/index.php/Category:OWASP_Guide_Project)'na bakın.

<a id="report-issues"></a>

<docs-callout title="Reporting vulnerabilities">

Angular, Google [Açık Kaynak Yazılım Güvenlik Açığı Ödül Programı](https://bughunters.google.com/about/rules/6521337925468160/google-open-source-software-vulnerability-reward-program-rules)'nın bir parçasıdır. Angular'daki güvenlik açıkları için lütfen raporunuzu [https://bughunters.google.com](https://bughunters.google.com/report) adresinden gönderin.

Google'ın güvenlik sorunlarını nasıl ele aldığı hakkında daha fazla bilgi için [Google'ın güvenlik felsefesi](https://www.google.com/about/appsecurity)'ne bakın.

</docs-callout>

## Best practices

Angular uygulamanızın güvenli olmasını sağlamak için bazı en iyi uygulamalar şunlardır.

1. **En son Angular kütüphane sürümleriyle güncel kalın** - Angular kütüphaneleri düzenli olarak güncellenir ve bu güncellemeler önceki sürümlerde keşfedilen güvenlik açıklarını düzeltebilir. Güvenlikle ilgili güncellemeler için Angular [değişiklik günlüğünü](https://github.com/angular/angular/blob/main/CHANGELOG.md) kontrol edin.
2. **Angular kopyanızı değiştirmeyin** - Özel, kişiselleştirilmiş Angular sürümleri mevcut sürümün gerisinde kalma eğilimindedir ve önemli güvenlik düzeltmeleri ve iyileştirmeler içermeyebilir. Bunun yerine, Angular iyileştirmelerinizi toplulukla paylaşın ve bir pull request yapın.
3. **Belgelerde "_Güvenlik Riski_" olarak işaretlenmiş Angular API'lerinden kaçının** - Daha fazla bilgi için bu sayfanın [Güvenli değerlere güvenme](#trusting-safe-values) bölümüne bakın.

## Preventing cross-site scripting (XSS)

[Siteler arası komut dosyası çalıştırma (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) saldırganların web sayfalarına kötü amaçlı kod enjekte etmesine olanak tanır.
Bu tür kodlar daha sonra, örneğin kullanıcı ve giriş verilerini çalabilir veya kullanıcıyı taklit eden eylemler gerçekleştirebilir.
Bu, web üzerindeki en yaygın saldırılardan biridir.

XSS saldırılarını engellemek için kötü amaçlı kodun Belge Nesne Modeli'ne (DOM) girmesini engellemeniz gerekir.
Örneğin, saldırganlar sizi DOM'a bir `<script>` etiketi eklemeye kandırabilirse, web sitenizde rastgele kod çalıştırabilirler.
Saldırı `<script>` etiketleriyle sınırlı değildir - DOM'daki birçok öğe ve özellik kod çalıştırmaya izin verir, örneğin `<img alt="" onerror="...">` ve `<a href="javascript:...">`.
Saldırgan kontrollü veriler DOM'a girerse, güvenlik açıkları bekleyin.

### Angular's cross-site scripting security model

XSS hatalarını sistematik olarak engellemek için Angular, varsayılan olarak tüm değerleri güvenilmez olarak değerlendirir.
Bir değer şablon bağlayıcı veya enterpolasyon yoluyla DOM'a eklendiğinde, Angular güvenilmez değerleri sterilize eder ve kaçırır.
Bir değer Angular dışında zaten sterilize edilmişse ve güvenli kabul ediliyorsa, değeri [güvenilir olarak işaretleyerek](#trusting-safe-values) bunu Angular'a bildirin.

Render için kullanılacak değerlerin aksine, Angular şablonları varsayılan olarak güvenilir kabul edilir ve çalıştırılabilir kod olarak değerlendirilmelidir.
Asla kullanıcı girişi ve şablon sözdizimini birleştirerek şablonlar oluşturmayın.
Bunu yapmak, saldırganların uygulamanıza [rastgele kod enjekte etmesine](https://en.wikipedia.org/wiki/Code_injection) olanak tanır.
Bu güvenlik açıklarını önlemek için üretim dağıtımlarında her zaman varsayılan [Ahead-Of-Time (AOT) şablon derleyicisini](#use-the-aot-template-compiler) kullanın.

İçerik güvenlik politikası ve Güvenilir Türler kullanımıyla ek bir koruma katmanı sağlanabilir.
Bu web platform özellikleri, XSS sorunlarını önlemek için en etkili yer olan DOM düzeyinde çalışır. Burada diğer, daha düşük seviyeli API'ler kullanılarak atlanamaz.
Bu nedenle, bu özelliklerden yararlanmanız kesinlikle teşvik edilir. Bunu yapmak için uygulama için [içerik güvenlik politikasını](#content-security-policy) yapılandırın ve [güvenilir tür uygulamasını](#enforcing-trusted-types) etkinleştirin.

### Sanitization and security contexts

_Sterilizasyon_, güvenilmez bir değerin incelenmesi ve DOM'a eklenmesi güvenli olan bir değere dönüştürülmesidir.
Birçok durumda, sterilizasyon bir değeri hiç değiştirmez.
Sterilizasyon bağlama bağlıdır.
Örneğin, CSS'de zararsız olan bir değer bir URL'de potansiyel olarak tehlikeli olabilir.

Angular aşağıdaki güvenlik bağlamlarını tanımlar:

| Security contexts | Details                                                                              |
| :---------------- | :----------------------------------------------------------------------------------- |
| HTML              | Bir değer HTML olarak yorumlandığında kullanılır, örneğin `innerHtml`'e bağlanırken. |
| Style             | CSS'yi `style` özelliğine bağlarken kullanılır.                                      |
| URL               | URL özellikleri için kullanılır, örneğin `<a href>`.                                 |
| Resource URL      | Kod olarak yüklenen ve çalıştırılan bir URL, örneğin `<script src>` içinde.          |

Angular, HTML ve URL'ler için güvenilmez değerleri sterilize eder. Kaynak URL'lerini sterilize etmek mümkün değildir çünkü rastgele kod içerirler.
Geliştirme modunda Angular, sterilizasyon sırasında bir değeri değiştirmek zorunda kaldığında konsola bir uyarı yazdırır.

### Sanitization example

Aşağıdaki şablon, `htmlSnippet`'in değerini bağlar. Bir kez bir öğenin içeriğine enterpolasyon yaparak ve bir kez bir öğenin `innerHTML` özelliğine bağlayarak:

<docs-code header="inner-html-binding.component.html" path="adev/src/content/examples/security/src/app/inner-html-binding.component.html"/>

Enterpolasyonlu içerik her zaman kaçırılır - HTML yorumlanmaz ve tarayıcı öğenin metin içeriğinde açılı parantezleri görüntüler.

HTML'in yorumlanması için, onu `innerHTML` gibi bir HTML özelliğine bağlayın.
Bir saldırganın kontrol edebileceği bir değeri `innerHTML`'e bağlamanın normalde bir XSS güvenlik açığına neden olduğunu unutmayın.
Örneğin, JavaScript aşağıdaki şekilde çalıştırılabilir:

<docs-code header="inner-html-binding.component.ts (class)" path="adev/src/content/examples/security/src/app/inner-html-binding.component.ts" region="class"/>

Angular değeri güvensiz olarak tanır ve otomatik olarak sterilize eder; `script` öğesini kaldırır ancak `<b>` öğesi gibi güvenli içeriği korur.

<img alt="A screenshot showing interpolated and bound HTML values" src="assets/images/guide/security/binding-inner-html.png#small">

### Direct use of the DOM APIs and explicit sanitization calls

Güvenilir Türleri zorlamadığınız sürece, yerleşik tarayıcı DOM API'leri sizi güvenlik açıklarından otomatik olarak korumaz.
Örneğin, `document`, `ElementRef` aracılığıyla kullanılabilir düğüm ve birçok üçüncü taraf API güvensiz yöntemler içerir.
Aynı şekilde, DOM'u manipüle eden diğer kütüphanelerle etkileşime geçerseniz, muhtemelen Angular enterpolasyonlarıyla aynı otomatik sterilizasyona sahip olmayacaksınız.
DOM ile doğrudan etkileşimden kaçının ve mümkün olduğunda Angular şablonlarını kullanın.

Bunun kaçınılmaz olduğu durumlar için yerleşik Angular sterilizasyon fonksiyonlarını kullanın.
Güvenilmez değerleri [DomSanitizer.sanitize](api/platform-browser/DomSanitizer#sanitize) yöntemi ve uygun `SecurityContext` ile sterilize edin.
Bu fonksiyon ayrıca `bypassSecurityTrust` fonksiyonları kullanılarak güvenilir olarak işaretlenmiş değerleri de kabul eder ve [aşağıda açıklandığı](#trusting-safe-values) gibi bunları sterilize etmez.

### Trusting safe values

Bazen uygulamaların gerçekten çalıştırılabilir kod içermesi, bir URL'den bir `<iframe>` görüntülemesi veya potansiyel olarak tehlikeli URL'ler oluşturması gerekir.
Bu durumlarda otomatik sterilizasyonu önlemek için Angular'a bir değeri incelediğinizi, nasıl oluşturulduğunu kontrol ettiğinizi ve güvenli olduğundan emin olduğunuzu söyleyin.
_Dikkatli_ olun.
Kötü amaçlı olabilecek bir değere güvenirseniz, uygulamanıza bir güvenlik açığı eklemiş olursunuz.
Şüpheniz varsa, profesyonel bir güvenlik uzmanı bulun.

Bir değeri güvenilir olarak işaretlemek için `DomSanitizer`'ı enjekte edin ve aşağıdaki yöntemlerden birini çağırın:

- `bypassSecurityTrustHtml`
- `bypassSecurityTrustScript`
- `bypassSecurityTrustStyle`
- `bypassSecurityTrustUrl`
- `bypassSecurityTrustResourceUrl`

Bir değerin güvenli olup olmadığının bağlama bağlı olduğunu unutmayın, bu nedenle değerinizin amaçlanan kullanımı için doğru bağlamı seçin.
Aşağıdaki şablonun bir URL'yi `javascript:alert(...)` çağrısına bağlaması gerektiğini düşünün:

<docs-code header="bypass-security.component.html (URL)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" region="URL"/>

Normalde Angular, URL'yi otomatik olarak sterilize eder, tehlikeli kodu devre dışı bırakır ve geliştirme modunda bu eylemi konsola kaydeder.
Bunu önlemek için `bypassSecurityTrustUrl` çağrısını kullanarak URL değerini güvenilir bir URL olarak işaretleyin:

<docs-code header="bypass-security.component.ts (trust-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" region="trust-url"/>

<img alt="A screenshot showing an alert box created from a trusted URL" src="assets/images/guide/security/bypass-security-component.png#medium">

Kullanıcı girişini güvenilir bir değere dönüştürmeniz gerekiyorsa, bir bileşen yöntemi kullanın.
Aşağıdaki şablon, kullanıcıların bir YouTube video kimliği girmesine ve ilgili videoyu bir `<iframe>` içinde yüklemesine olanak tanır.
`<iframe src>` niteliği bir kaynak URL güvenlik bağlamıdır çünkü güvenilmez bir kaynak, şüphelenmeyen kullanıcıların çalıştırabileceği dosya indirmelerini gizlice yerleştirebilir.
Bunu önlemek için güvenilir bir video URL'si oluşturmak için bileşen üzerinde bir yöntem çağırın; bu, Angular'ın `<iframe src>` bağlamasına izin vermesine neden olur:

<docs-code header="bypass-security.component.html (iframe)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" region="iframe"/>

<docs-code header="bypass-security.component.ts (trust-video-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" region="trust-video-url"/>

### Content security policy

İçerik Güvenlik Politikası \(CSP\), XSS'i önlemek için derinlemesine bir savunma tekniğidir.
CSP'yi etkinleştirmek için web sunucunuzu uygun bir `Content-Security-Policy` HTTP başlığı döndürecek şekilde yapılandırın.
İçerik güvenlik politikası hakkında daha fazla bilgiyi Google Developers web sitesindeki [Web Fundamentals kılavuzunda](https://developers.google.com/web/fundamentals/security/csp) bulabilirsiniz.

Yeni bir Angular uygulaması için gereken minimum politika şudur:

```txt
default-src 'self'; style-src 'self' 'nonce-randomNonceGoesHere'; script-src 'self' 'nonce-randomNonceGoesHere';
```

Angular uygulamanızı sunarken, sunucu her istek için HTTP başlığına rastgele oluşturulmuş bir nonce eklemelidir.
Bu nonce'u Angular'a sağlamalısınız, böylece framework `<style>` öğelerini render edebilir.
Angular için nonce'u aşağıdaki yollardan biriyle ayarlayabilirsiniz:

1. [Çalışma alanı yapılandırmasında](reference/configs/workspace-config#extra-build-and-test-options) `autoCsp` seçeneğini `true` olarak ayarlayın.
1. Kök uygulama öğesinde `ngCspNonce` niteliğini `<app ngCspNonce="randomNonceGoesHere"></app>` olarak ayarlayın. Yanıtı oluştururken nonce'u hem başlığa hem de `index.html`'ye ekleyebilen sunucu tarafı şablonlamaya erişiminiz varsa bu yaklaşımı kullanın.
1. `CSP_NONCE` enjeksiyon token'ını kullanarak nonce'u sağlayın. Çalışma zamanında nonce'a erişiminiz varsa ve `index.html`'yi önbelleğe alabilmek istiyorsanız bu yaklaşımı kullanın.

```ts
import {bootstrapApplication, CSP_NONCE} from '@angular/core';
import {AppComponent} from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: CSP_NONCE,
      useValue: globalThis.myRandomNonceValue,
    },
  ],
});
```

<docs-callout title="Unique nonces">

Sağladığınız nonce'ların her zaman <strong>istek başına benzersiz</strong> olduğundan ve tahmin edilemez veya kestirilemez olduğundan emin olun.
Bir saldırgan gelecekteki nonce'ları tahmin edebilirse, CSP tarafından sunulan korumaları aşabilir.

</docs-callout>

NOTE: Uygulamanızın [kritik CSS'ini satır içi yapmak](/tools/cli/build#critical-css-inlining) istiyorsanız, `CSP_NONCE` token'ını kullanamazsınız ve `autoCsp` seçeneğini veya kök uygulama öğesinde `ngCspNonce` niteliğini ayarlamayı tercih etmelisiniz.

Projenizde nonce oluşturamıyorsanız, CSP başlığının `style-src` bölümüne `'unsafe-inline'` ekleyerek satır içi stillere izin verebilirsiniz.

| Sections                                         | Details                                                                                                                                                                                                                           |
| :----------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-src 'self';`                            | Sayfanın gerekli tüm kaynaklarını aynı kaynaktan yüklemesine izin verir.                                                                                                                                                          |
| `style-src 'self' 'nonce-randomNonceGoesHere';`  | Sayfanın global stilleri aynı kaynaktan \(`'self'`\) ve Angular tarafından `nonce-randomNonceGoesHere` ile eklenen stilleri yüklemesine izin verir.                                                                               |
| `script-src 'self' 'nonce-randomNonceGoesHere';` | Sayfanın JavaScript'i aynı kaynaktan \(`'self'`\) ve Angular CLI tarafından `nonce-randomNonceGoesHere` ile eklenen komut dosyalarını yüklemesine izin verir. Bu yalnızca kritik CSS satır içi ekleme kullanıyorsanız gereklidir. |

Angular'ın düzgün çalışması için yalnızca bu ayarlar gereklidir.
Projeniz büyüdükçe, uygulamanıza özgü ekstra özellikler için CSP ayarlarınızı genişletmeniz gerekebilir.

### Enforcing Trusted Types

Uygulamalarınızı siteler arası komut dosyası çalıştırma saldırılarından korumaya yardımcı olmak için bir yol olarak [Güvenilir Türler](https://w3c.github.io/trusted-types/dist/spec/) kullanmanız önerilir.
Güvenilir Türler, daha güvenli kodlama uygulamalarını zorlayarak siteler arası komut dosyası çalıştırma saldırılarını önlemeye yardımcı olabilen bir [web platform](https://en.wikipedia.org/wiki/Web_platform) özelliğidir.
Güvenilir Türler ayrıca uygulama kodunun denetimini basitleştirmeye de yardımcı olabilir.

<docs-callout title="Trusted types">

Güvenilir Türler, uygulamanızın hedeflediği tüm tarayıcılarda henüz mevcut olmayabilir.
Güvenilir Türler etkinleştirilmiş uygulamanız Güvenilir Türleri desteklemeyen bir tarayıcıda çalışırsa, uygulamanın özellikleri korunur. Uygulamanız Angular'ın DomSanitizer'ı aracılığıyla XSS'e karşı korunur.
Güncel tarayıcı desteği için [caniuse.com/trusted-types](https://caniuse.com/trusted-types) adresine bakın.

</docs-callout>

Uygulamanız için Güvenilir Türleri zorlamak amacıyla, uygulamanızın web sunucusunu aşağıdaki Angular politikalarından biriyle HTTP başlıkları yayacak şekilde yapılandırmanız gerekir:

| Policies                 | Detail                                                                                                                                                                                                                                                                                                              |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `angular`                | Bu politika, Angular'ın iç güvenlik incelemesinden geçmiş kodunda kullanılır ve Güvenilir Türler zorlandığında Angular'ın çalışması için gereklidir. Angular tarafından sterilize edilen tüm satır içi şablon değerleri veya içerikler bu politika tarafından güvenli olarak değerlendirilir.                       |
| `angular#bundler`        | Bu politika, Angular CLI paketleyicisi tarafından tembel yük (lazy chunk) dosyaları oluştururken kullanılır.                                                                                                                                                                                                        |
| `angular#unsafe-bypass`  | Bu politika, Angular'ın [DomSanitizer](api/platform-browser/DomSanitizer) güvenliğini atlayan `bypassSecurityTrustHtml` gibi yöntemlerini kullanan uygulamalar için kullanılır. Bu yöntemleri kullanan herhangi bir uygulama bu politikayı etkinleştirmelidir.                                                      |
| `angular#unsafe-jit`     | Bu politika, [Just-In-Time (JIT) derleyici](api/core/Compiler) tarafından kullanılır. Uygulamanız doğrudan JIT derleyicisi ile etkileşime giriyorsa veya [platform browser dynamic](api/platform-browser-dynamic/platformBrowserDynamic) kullanarak JIT modunda çalışıyorsa bu politikayı etkinleştirmeniz gerekir. |
| `angular#unsafe-upgrade` | Bu politika, [@angular/upgrade](api/upgrade/static/UpgradeModule) paketi tarafından kullanılır. Uygulamanız bir AngularJS hibriti ise bu politikayı etkinleştirmeniz gerekir.                                                                                                                                       |

Güvenilir Türler için HTTP başlıklarını aşağıdaki konumlarda yapılandırmalısınız:

- Üretim sunma altyapısı
- Yerel geliştirme ve uçtan uca test için `angular.json` dosyasındaki `headers` özelliğini kullanarak Angular CLI \(`ng serve`\)
- Birim testi için `karma.config.js` dosyasındaki `customHeaders` özelliğini kullanarak Karma \(`ng test`\)

Aşağıda Güvenilir Türler ve Angular için özel olarak yapılandırılmış bir başlık örneği verilmiştir:

```html
Content-Security-Policy: trusted-types angular; require-trusted-types-for 'script';
```

Angular'ın güvenliği atlayan [DomSanitizer](api/platform-browser/DomSanitizer) yöntemlerinden herhangi birini kullanan Güvenilir Türler ve Angular uygulamaları için özel olarak yapılandırılmış bir başlık örneği:

```html
Content-Security-Policy: trusted-types angular angular#unsafe-bypass; require-trusted-types-for
'script';
```

Aşağıda JIT kullanan Güvenilir Türler ve Angular uygulamaları için özel olarak yapılandırılmış bir başlık örneği verilmiştir:

```html
Content-Security-Policy: trusted-types angular angular#unsafe-jit; require-trusted-types-for
'script';
```

Aşağıda modüllerin tembel yüklemesini kullanan Güvenilir Türler ve Angular uygulamaları için özel olarak yapılandırılmış bir başlık örneği verilmiştir:

```html
Content-Security-Policy: trusted-types angular angular#bundler; require-trusted-types-for 'script';
```

<docs-callout title="Community contributions">

Güvenilir Tür yapılandırmalarında sorun giderme hakkında daha fazla bilgi edinmek için aşağıdaki kaynak yardımcı olabilir:

[Güvenilir Türlerle DOM tabanlı siteler arası komut dosyası çalıştırma güvenlik açıklarını önleme](https://web.dev/trusted-types/#how-to-use-trusted-types)

</docs-callout>

### Use the AOT template compiler

AOT şablon derleyicisi, şablon enjeksiyonu olarak adlandırılan tüm bir güvenlik açığı sınıfını önler ve uygulama performansını büyük ölçüde artırır.
AOT şablon derleyicisi, Angular CLI uygulamaları tarafından kullanılan varsayılan derleyicidir ve tüm üretim dağıtımlarında kullanmalısınız.

AOT derleyicisine bir alternatif, çalışma zamanında tarayıcıda şablonları çalıştırılabilir şablon koduna derleyen JIT derleyicisidir.
Angular şablon koduna güvenir, bu nedenle dinamik olarak şablon oluşturmak ve derlemek, özellikle kullanıcı verisi içeren şablonlar, Angular'ın yerleşik korumalarını atlar. Bu bir güvenlik anti-kalıbıdır.
Formları güvenli bir şekilde dinamik olarak oluşturma hakkında bilgi için [Dinamik Formlar](guide/forms/dynamic-forms) kılavuzuna bakın.

### Server-side XSS protection

Sunucuda oluşturulan HTML, enjeksiyon saldırılarına karşı savunmasızdır.
Bir Angular uygulamasına şablon kodu enjekte etmek, uygulamaya çalıştırılabilir kod enjekte etmekle aynıdır:
Saldırgana uygulama üzerinde tam kontrol verir.
Bunu önlemek için sunucuda XSS güvenlik açıklarını önlemek amacıyla değerleri otomatik olarak kaçıran bir şablon dili kullanın.
Sunucu tarafında bir şablon dili kullanarak Angular şablonları oluşturmayın. Bu, şablon enjeksiyonu güvenlik açıkları oluşturma riski yüksektir.

## HTTP-level vulnerabilities

Angular, iki yaygın HTTP güvenlik açığını önlemeye yardımcı olmak için yerleşik desteğe sahiptir: siteler arası istek sahteciliği \(CSRF veya XSRF\) ve siteler arası komut dosyası dahil etme \(XSSI\).
Her ikisi de öncelikle sunucu tarafında azaltılmalıdır, ancak Angular istemci tarafındaki entegrasyonu kolaylaştırmak için yardımcılar sağlar.

### Cross-site request forgery

Siteler arası istek sahteciliğinde \(CSRF veya XSRF\), bir saldırgan kullanıcıyı kötü amaçlı koda sahip farklı bir web sayfasını \(örneğin `evil.com`\) ziyaret etmeye kandırır. Bu web sayfası gizlice uygulamanın web sunucusuna \(örneğin `example-bank.com`\) kötü amaçlı bir istek gönderir.

Kullanıcının `example-bank.com` uygulamasına giriş yapmış olduğunu varsayın.
Kullanıcı bir e-posta açar ve yeni bir sekmede açılan `evil.com`'a bir bağlantıya tıklar.

`evil.com` sayfası hemen `example-bank.com`'a kötü amaçlı bir istek gönderir.
Belki de kullanıcının hesabından saldırganın hesabına para transferi isteğidir.
Tarayıcı, kimlik doğrulama çerezi dahil `example-bank.com` çerezlerini bu istekle birlikte otomatik olarak gönderir.

`example-bank.com` sunucusu XSRF korumasına sahip değilse, uygulamadan gelen meşru bir istek ile `evil.com`'dan gelen sahte istek arasındaki farkı anlayamaz.

Bunu önlemek için uygulama, bir kullanıcı isteğinin farklı bir siteden değil, gerçek uygulamadan kaynaklandığından emin olmalıdır.
Bu saldırıyı engellemek için sunucu ve istemci işbirliği yapmalıdır.

Yaygın bir anti-XSRF tekniğinde, uygulama sunucusu bir çerezde rastgele oluşturulmuş bir kimlik doğrulama token'ı gönderir.
İstemci kodu çerezi okur ve sonraki tüm isteklerde token'lı özel bir istek başlığı ekler.
Sunucu, alınan çerez değerini istek başlığı değeriyle karşılaştırır ve değerler eksikse veya eşleşmiyorsa isteği reddeder.

Bu teknik etkilidir çünkü tüm tarayıcılar _aynı kaynak politikasını_ uygular.
Yalnızca çerezlerin ayarlandığı web sitesindeki kod, o siteden çerezleri okuyabilir ve o siteye yapılan isteklerde özel başlıklar ayarlayabilir.
Bu, yalnızca uygulamanızın bu çerez token'ını okuyabileceği ve özel başlığı ayarlayabileceği anlamına gelir.
`evil.com`'daki kötü amaçlı kod yapamaz.

### `HttpClient` XSRF/CSRF security

`HttpClient`, XSRF saldırılarını önlemek için kullanılan [yaygın bir mekanizmayı](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token) destekler. HTTP istekleri gerçekleştirirken, bir interceptor varsayılan olarak `XSRF-TOKEN` adlı bir çerezden bir token okur ve onu `X-XSRF-TOKEN` HTTP başlığı olarak ayarlar. Yalnızca alanınızda çalışan kod çerezi okuyabildiğinden, arka uç HTTP isteğinin bir saldırgandan değil istemci uygulamanızdan geldiğinden emin olabilir.

Varsayılan olarak, bir interceptor bu başlığı tüm değiştirici isteklerde (örneğin `POST`) göreceli ve aynı kaynaklı URL'lere gönderir, ancak `GET` veya `HEAD` isteklerinde göndermez.

<docs-callout helpful title="Why not protect GET requests?">
CSRF koruması yalnızca arka uçtaki durumu değiştirebilecek istekler için gereklidir. Doğası gereği, CSRF saldırıları alan sınırlarını aşar ve web'in [aynı kaynak politikası](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy) saldıran bir sayfanın kimliği doğrulanmış `GET` isteklerinin sonuçlarını almasını engeller.
</docs-callout>

Bundan yararlanmak için sunucunuzun sayfa yüklemesinde veya ilk GET isteğinde `XSRF-TOKEN` adlı JavaScript tarafından okunabilir bir oturum çerezinde bir token ayarlaması gerekir. Sonraki isteklerde sunucu, çerezin `X-XSRF-TOKEN` HTTP başlığıyla eşleştiğini doğrulayabilir ve bu nedenle yalnızca alanınızda çalışan kodun isteği gönderebileceğinden emin olabilir. Token her kullanıcı için benzersiz olmalı ve sunucu tarafından doğrulanabilir olmalıdır; bu, istemcinin kendi token'larını oluşturmasını engeller. Token'ı, ek güvenlik için bir tuz ile sitenizin kimlik doğrulama çerezinin bir özetine ayarlayın.

Birden fazla Angular uygulamasının aynı alan veya alt alanı paylaştığı ortamlarda çakışmaları önlemek için her uygulamaya benzersiz bir çerez adı verin.

<docs-callout important title="HttpClient supports only the client half of the XSRF protection scheme">
  Arka uç hizmetiniz sayfanız için çerezi ayarlayacak ve tüm uygun isteklerde başlığın mevcut olduğunu doğrulayacak şekilde yapılandırılmalıdır. Bunu yapmamak Angular'ın varsayılan korumasını etkisiz kılar.
</docs-callout>

### Configure custom cookie/header names

Arka uç hizmetiniz XSRF token çerezi veya başlığı için farklı adlar kullanıyorsa, varsayılanları geçersiz kılmak için `withXsrfConfiguration` kullanın.

`provideHttpClient` çağrısına aşağıdaki gibi ekleyin:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'CUSTOM_XSRF_TOKEN',
        headerName: 'X-Custom-Xsrf-Header',
      }),
    ),
  ],
};
```

### Disabling XSRF protection

Yerleşik XSRF koruma mekanizması uygulamanız için çalışmıyorsa, `withNoXsrfProtection` özelliğini kullanarak devre dışı bırakabilirsiniz:

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withNoXsrfProtection())],
};
```

Open Web Application Security Project \(OWASP\) adresindeki CSRF hakkında bilgi için [Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) ve [Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) sayfalarına bakın.
Stanford Üniversitesi makalesi [Robust Defenses for Cross-Site Request Forgery](https://seclab.stanford.edu/websec/csrf/csrf.pdf) zengin bir ayrıntı kaynağıdır.

Ayrıca Dave Smith'in [AngularConnect 2016'daki XSRF konuşmasına](https://www.youtube.com/watch?v=9inczw6qtpY 'Cross Site Request Funkery Securing Your Angular Apps From Evil Doers') da bakın.

### Cross-site script inclusion (XSSI)

Siteler arası komut dosyası dahil etme, JSON güvenlik açığı olarak da bilinir ve bir saldırganın web sitesinin bir JSON API'sinden veri okumasına izin verebilir.
Saldırı, yerleşik JavaScript nesne oluşturucularını geçersiz kılarak ve ardından bir `<script>` etiketi kullanarak bir API URL'si dahil ederek eski tarayıcılarda çalışır.

Bu saldırı yalnızca döndürülen JSON JavaScript olarak çalıştırılabilir olduğunda başarılıdır.
Sunucular, tüm JSON yanıtlarının önüne gelenek olarak bilinen `")]}',\n"` dizesini ekleyerek yanıtları çalıştırılamaz hale getirerek saldırıyı önleyebilir.

Angular'ın `HttpClient` kütüphanesi bu geleneği tanır ve daha fazla ayrıştırmadan önce tüm yanıtlardan `")]}',\n"` dizesini otomatik olarak çıkarır.

Daha fazla bilgi için bu [Google web güvenliği blog yazısının](https://security.googleblog.com/2011/05/website-security-for-webmasters.html) XSSI bölümüne bakın.

## Preventing Server-Side Request Forgery (SSRF)

Angular, başlık tabanlı [Sunucu Tarafı İstek Sahteciliğini (SSRF)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/SSRF) önlemek için istek işleme hattında `Host`, `X-Forwarded-Host`, `X-Forwarded-Proto`, `X-Forwarded-Prefix` ve `X-Forwarded-Port` başlıkları için katı doğrulama içerir.

Doğrulama kuralları şunlardır:

- `Host` ve `X-Forwarded-Host` başlıkları katı bir izin listesine göre doğrulanır ve yol ayırıcıları içeremez.
- `X-Forwarded-Port` başlığı sayısal olmalıdır.
- `X-Forwarded-Proto` başlığı `http` veya `https` olmalıdır.
- `X-Forwarded-Prefix` başlığı birden fazla `/` veya `\` ile başlamamalı veya `.`, `..` yol segmentleri içermemelidir.

Geçersiz veya izin verilmeyen başlıklar artık bir hata günlüğü tetikler. `allowedHosts` tanımlıysa, tanınmayan ana bilgisayar adlarına sahip istekler İstemci Tarafında Render Edilmiş (CSR) bir sayfa ile sonuçlanır; tanımlı değilse, `400 Bad Request` verilir. Gelecekteki bir büyük sürümde, tüm tanınmayan ana bilgisayar adlarının `allowedHosts` ayarlarından bağımsız olarak varsayılan olarak `400 Bad Request` ile sonuçlanacağını unutmayın.

NOTE: Çoğu bulut sağlayıcısı ve CDN sağlayıcısı, bir istek uygulama kaynağına ulaşmadan önce bu başlıkların otomatik doğrulamasını gerçekleştirir. Bu doğal filtreleme, pratik saldırı yüzeyini önemli ölçüde azaltır.

### Configuring allowed hosts

Belirli ana bilgisayar adlarına izin vermek için bunları izin listesine eklemeniz gerekir. Bu, uygulamanızın dağıtıldığında doğru ve güvenli bir şekilde çalışmasını sağlamak için kritik öneme sahiptir. Kalıplar, esnek ana bilgisayar adı eşleştirmesi için joker karakterleri destekler.

`angular.json` dosyanızda `allowedHosts` seçeneğini yapılandırabilirsiniz:

```json {hideCopy}
{
  // ...
  "projects": {
    "your-project-name": {
      // ...
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "security": {
              "allowedHosts": [
                "example.com",
                "*.example.com" // allows all subdomains of example.com
              ]
            }
            // ... other options
          }
        }
      }
    }
  }
}
```

Uygulama motorunu başlatırken de `allowedHosts` yapılandırabilirsiniz:

```typescript
const appEngine = new AngularAppEngine({
  allowedHosts: ['example.com', '*.trusted-example.com'],
});

const nodeAppEngine = new AngularNodeAppEngine({
  allowedHosts: ['example.com', '*.trusted-example.com'],
});
```

Node.js varyantı `AngularNodeAppEngine` için, ana bilgisayarları yetkilendirmek amacıyla `NG_ALLOWED_HOSTS` (virgülle ayrılmış liste) ortam değişkenini de sağlayabilirsiniz.

```bash {hideDollar}
export NG_ALLOWED_HOSTS="example.com,*.trusted-example.com"
```

## Auditing Angular applications

Angular uygulamaları, normal web uygulamalarıyla aynı güvenlik ilkelerine uymalı ve bu şekilde denetlenmelidir.
Güvenlik incelemesinde denetlenmesi gereken [_bypassSecurityTrust_](#trusting-safe-values) yöntemleri gibi Angular'a özgü API'ler, belgelerde güvenlik açısından hassas olarak işaretlenmiştir.
