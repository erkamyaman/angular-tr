# Birden fazla yerel ayarı dağıtma

`myapp` projenizin dağıtılabilir dosyalarını içeren dizinse, genellikle farklı yerel ayarlar için farklı sürümleri yerel ayar dizinlerinde kullanılabilir hale getirirsiniz.
Örneğin, Fransızca sürümünüz `myapp/fr` dizininde ve İspanyolca sürümünüz `myapp/es` dizininde bulunur.

`href` özniteliğine sahip HTML `base` etiketi, göreli bağlantılar için temel URI'yi veya URL'yi belirtir.
[`angular.json`][GuideWorkspaceConfig] çalışma alanı derleme yapılandırma dosyasında `"localize"` seçeneğini `true` veya bir yerel ayar kimlikleri dizisine ayarlarsanız, CLI her uygulama sürümü için temel `href`'i ayarlar.
Her uygulama sürümü için temel `href`'i ayarlamak amacıyla CLI, yapılandırılmış `"subPath"` değerini yerel ayar için URL segmenti olarak kullanır.
`"subPath"` ayarlamazsanız varsayılan olarak yerel ayar kimliği kullanılır.
[`angular.json`][GuideWorkspaceConfig] çalışma alanı derleme yapılandırma dosyanızda her yerel ayar için `"subPath"` belirtin.
Aşağıdaki örnek, boş bir dizeye ayarlanmış `"subPath"`'i gösterir.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="i18n-subPath"/>

## Sunucu yapılandırma

Birden fazla dilin tipik dağıtımı, her dili farklı bir alt dizinden sunar.
Kullanıcılar, `Accept-Language` HTTP başlığı kullanılarak tarayıcıda tanımlanan tercih edilen dile yönlendirilir.
Kullanıcı tercih edilen bir dil tanımlamamışsa veya tercih edilen dil mevcut değilse, sunucu varsayılan dile geri döner.
Dili değiştirmek için mevcut konumunuzu başka bir alt dizine değiştirin.
Alt dizin değişikliği genellikle uygulamada uygulanan bir menü aracılığıyla gerçekleşir.

Uygulamaları uzak bir sunucuya nasıl dağıtacağınız hakkında daha fazla bilgi için [Dağıtım][GuideDeployment] belgesine bakın.

IMPORTANT: [Sunucu tarafı oluşturma](guide/ssr) ile `outputMode` `server` olarak ayarlanmışsa, Angular `Accept-Language` HTTP başlığına dayalı olarak yeniden yönlendirmeyi otomatik olarak dinamik şekilde yönetir. Bu, manuel sunucu veya yapılandırma ayarlamalarına olan ihtiyacı ortadan kaldırarak dağıtımı basitleştirir.

### Nginx örneği

Aşağıdaki örnek bir Nginx yapılandırmasını gösterir.

<docs-code path="adev/src/content/examples/i18n/doc-files/nginx.conf" language="nginx"/>

### Apache örneği

Aşağıdaki örnek bir Apache yapılandırmasını gösterir.

<docs-code path="adev/src/content/examples/i18n/doc-files/apache2.conf" language="apache"/>

## Ön-render {#prerendering}

`outputMode` değerini `static` olarak ayarlarsanız, CLI derleme sırasında sunucu rotalarınızın `RenderMode.Prerender` ile yapılandırdığı rotaları her yerel ayar için ön-render eder ve sunucu üretmez.
Daha fazla bilgi için [Tamamen statik bir uygulama oluşturma](guide/ssr#generate-a-fully-static-application) bölümüne bakın.
Dili seçen bir sunucu olmadığından, yönlendirmeleri ve bulunamadı sayfalarını barındırma ortamınız yönetir.

### Çıktı düzeni {#output-layout}

CLI, her yerel ayarı `browser/` içinde kendi dizinine yazar.
Her dizin, ön-render edilmiş HTML'i, paketleri ve o yerel ayar için `public/` dosyalarının bir kopyasını içerir.
Ön-render edilmiş sayfaların `lang` niteliği ve `<base href>` değeri yerel ayarla eşleşir.

Aşağıdaki düzen, kaynak yerel ayarın bir sonraki bölümde açıklandığı gibi kök dizinden sunulduğunu varsayar.

```text
browser/
├── index.html
├── about/index.html
├── tr/
│   ├── index.html
│   └── about/index.html
└── es/
    ├── index.html
    └── about/index.html
```

Kök sayfalar `lang="en"` ve `<base href="/">` kullanır. `tr/` sayfaları `lang="tr"` ve `<base href="/tr/">` kullanır, `es/` sayfaları ise `lang="es"` ve `<base href="/es/">` kullanır.

### Kaynak yerel ayarı kök dizinden sunma {#serve-the-source-locale-from-the-root}

Kaynak yerel ayarı `/` altından sunmak ve diğer yerel ayarları onun altına yerleştirmek için `sourceLocale` değerinin nesne biçimini kullanın ve `"subPath"` değerini boş bir dizeye ayarlayın.

```json
{
  "i18n": {
    "sourceLocale": {
      "code": "en",
      "subPath": ""
    },
    "locales": {
      "tr": "src/locale/messages.tr.xlf",
      "es": "src/locale/messages.es.xlf"
    }
  }
}
```

Boş `"subPath"` olmadan CLI, kaynak yerel ayarı `/en/` gibi yerel ayar koduyla adlandırılmış kendi dizinine yerleştirir.

### Kullanıcıları kendi dillerine yönlendirme {#redirect-users-to-their-language}

Statik çıktı, `Accept-Language` HTTP başlığına göre yönlendirme yapmaz.
Barındırma ortamınızı bu başlığa göre yönlendirme yapacak şekilde yapılandırın.
[Nginx](#nginx-örneği) ve [Apache](#apache-örneği) örnekleri, varsayılan dahil her yerel ayarın kendi alt dizininde bulunduğunu varsayar.
Kaynak yerel ayarı kök dizinden sunuyorsanız, bu örnekleri `/` yolunu yalnızca diğer yerel ayarlar için yönlendirecek şekilde uyarlayın.

### Bulunamadı sayfaları {#not-found-pages}

CLI, `**` joker karakter rotası için bir sayfa ön-render etmez.
Bulunamadı sayfası elde etmek için `404` gibi somut bir rota tanımlayın ve sunucu rotalarınızın bu rotayı ön-render ettiğinden emin olun.
Böylece her yerel ayar kendi sayfasını alır, örneğin `/404/index.html` ve `/tr/404/index.html`.
Barındırma ortamınızı, bulunamayan URL'nin yerel ayar yoluna uyan sayfayı sunacak şekilde yapılandırın, örneğin Nginx'te `error_page` veya Apache'de `ErrorDocument` ile.

[CliBuild]: cli/build 'ng build | CLI | Angular'
[GuideDeployment]: tools/cli/deployment 'Deployment | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
