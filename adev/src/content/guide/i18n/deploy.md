# Birden fazla yerel ayarı dağıtma

`myapp` projenizin dağıtılabilir dosyalarını içeren dizinse, genellikle farklı yerel ayarlar için farklı sürümleri yerel ayar dizinlerinde kullanılabilir hale getirirsiniz.
Örneğin, Fransızca sürümünüz `myapp/fr` dizininde ve İspanyolca sürümünüz `myapp/es` dizininde bulunur.

`href` özniteliğine sahip HTML `base` etiketi, göreli bağlantılar için temel URI'yi veya URL'yi belirtir.
[`angular.json`][GuideWorkspaceConfig] çalışma alanı derleme yapılandırma dosyasında `"localize"` seçeneğini `true` veya bir yerel ayar kimlikleri dizisine ayarlarsanız, CLI her uygulama sürümü için temel `href`'i ayarlar.
Her uygulama sürümü için temel `href`'i ayarlamak amacıyla CLI, yapılandırılmış `"subPath"`'e yerel ayarı ekler.
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

[CliBuild]: cli/build 'ng build | CLI | Angular'
[GuideDeployment]: tools/cli/deployment 'Deployment | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
