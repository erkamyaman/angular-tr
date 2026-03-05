# Custom build pipeline

Bir Angular uygulaması oluştururken, yapıya bağlı güncelleme işlevselliğinden ve derleme sistemi soyutlamasından yararlanmak için Angular CLI kullanmanızı şiddetle tavsiye ediyoruz. Bu sayede projeleriniz en son güvenlik, performans ve API iyileştirmelerinden ve şeffaf derleme iyileştirmelerinden faydalanır.

Bu sayfa, Angular CLI kullanmayan özel bir derleme hattına ihtiyaç duyduğunuz **nadir kullanım durumlarını** incelemektedir. Aşağıda listelenen tüm araçlar, Angular topluluğu üyeleri tarafından bakımı yapılan açık kaynaklı derleme eklentileridir. Destek modeli ve bakım durumu hakkında daha fazla bilgi edinmek için belgelerine ve GitHub deposu URL'lerine bakın.

## When should you use a custom build pipeline?

Özel bir derleme hattı kullanmak isteyebileceğiniz bazı niş kullanım durumları vardır. Örneğin:

- Farklı bir araç zinciri kullanan mevcut bir uygulamanız var ve buna Angular eklemek istiyorsunuz
- [module federation](https://module-federation.io/) ile güçlü bir bağımlılığınız var ve paketleyiciden bağımsız [native federation](https://www.npmjs.com/package/@angular-architects/native-federation) kullanmaya geçemiyorsunuz
- Favori derleme aracınızı kullanarak kısa süreli bir deney oluşturmak istiyorsunuz

## What are the options?

Şu anda, bir [Vite eklentisi](https://www.npmjs.com/package/@analogjs/vite-plugin-angular) ve [Rspack eklentisi](https://www.npmjs.com/package/@nx/angular-rspack) ile özel bir derleme hattı oluşturmanızı sağlayan iyi desteklenen iki topluluk aracı bulunmaktadır. Her ikisi de Angular CLI'yi destekleyen temel soyutlamaları kullanır. Esnek bir derleme hattı oluşturmanıza olanak tanır ve manuel bakım gerektirir, otomatik güncelleme deneyimi sunmaz.

### Rspack

Rspack, webpack eklenti ekosistemiyle uyumluluk sağlamayı amaçlayan Rust tabanlı bir paketleyicidir.

Projeniz webpack ekosistemine sıkı sıkıya bağlıysa ve özel bir webpack yapılandırmasına yoğun şekilde dayanıyorsa, derleme sürelerinizi iyileştirmek için Rspack'ten yararlanabilirsiniz.

Angular Rspack hakkında daha fazla bilgiyi projenin [dokümantasyon web sitesinde](https://nx.dev/recipes/angular/rspack/introduction) bulabilirsiniz.

### Vite

Vite, modern web projeleri için daha hızlı ve daha yalın bir geliştirme deneyimi sunmayı amaçlayan bir ön uç derleme aracıdır. Vite, ayrıca ekosistemlerin Vite ile entegrasyonlar oluşturmasına olanak tanıyan eklenti sistemiyle genişletilebilir; birim ve tarayıcı testleri için Vitest, bileşenleri izole bir şekilde geliştirmek için Storybook ve daha fazlası gibi. Angular CLI de geliştirme sunucusu olarak Vite kullanmaktadır.

[Angular için AnalogJS Vite eklentisi](https://www.npmjs.com/package/@analogjs/vite-plugin-angular), Vite kullanan veya Vite üzerine kurulmuş bir proje ya da çerçeveyle Angular'ın benimsenmesini sağlar. Bu, doğrudan Vite ile bir Angular projesini geliştirmek ve derlemekten veya mevcut bir projeye ya da hatta Angular eklemekten oluşabilir. Bir örnek, [Astro ve Starlight](https://analogjs.org/docs/packages/astro-angular/overview) kullanarak bir dokümantasyon web sitesine Angular UI bileşenlerini entegre etmektir.

AnalogJS ve eklentinin nasıl kullanılacağı hakkında daha fazla bilgiyi [dokümantasyon sayfasından](https://analogjs.org/docs/packages/vite-plugin-angular/overview) öğrenebilirsiniz.
