## Injector'larınızı inceleyin

NOTE: Injector Tree, Angular 17 veya üzeri sürümlerle oluşturulmuş Angular Uygulamaları için kullanılabilir.

### Uygulamanızın injector hiyerarşisini görüntüleyin

**Injector Tree** sekmesi, uygulamanızda yapılandırılmış Injector'ların yapısını keşfetmenizi sağlar. Burada uygulamanızın [injector hiyerarşisini](guide/di/hierarchical-dependency-injection) temsil eden iki ağaç göreceksiniz. Bir ağaç ortam (environment) hiyerarşiniz, diğeri ise öğe (element) hiyerarşinizdir.

<img src="assets/images/guide/devtools/di-injector-tree.png" alt="A screenshot of the 'Profiler' tab displaying the injector tree tab in Angular Devtools visualizing the injector graph for an example application.">

### Çözümleme yollarını görselleştirin

Belirli bir injector seçildiğinde, Angular'ın bağımlılık enjeksiyonu algoritmasının o injector'dan köke kadar izlediği yol vurgulanır. Öğe injector'ları için bu, bir bağımlılık öğe hiyerarşisinde çözümlenemediğinde bağımlılık enjeksiyonu algoritmasının atladığı ortam injector'larının vurgulanmasını da içerir.

Angular'ın çözümleme yollarını nasıl çözdüğü hakkında daha fazla ayrıntı için [resolution rules](guide/di/hierarchical-dependency-injection#çözümleme-kuralları) bölümüne bakın.

<img src="assets/images/guide/devtools/di-injector-tree-selected.png" alt="A screenshot of the 'Profiler' tab displaying how the injector tree visualize highlights resolution paths when an injector is selected.">

### Injector sağlayıcılarını görüntüleyin

Yapılandırılmış sağlayıcıları (providers) olan bir injector'a tıklamak, bu sağlayıcıları injector ağacı görünümünün sağında bir liste olarak görüntüler. Burada sağlanan token'ı ve türünü görebilirsiniz. Her sağlayıcının sağındaki düğme, sağlayıcıyı konsola yazdırmanıza olanak tanır.

<img src="assets/images/guide/devtools/di-injector-tree-providers.png" alt="A screenshot of the 'Profiler' tab displaying how providers are made visible when an injector is selected.">
