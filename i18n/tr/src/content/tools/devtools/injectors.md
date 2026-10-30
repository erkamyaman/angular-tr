<!-- source: 89b699c1ba391e4343f12792e566d03db5908aaf -->
# Injector'larınızı inceleyin

NOTE: Injector Tree, Angular 17 veya üzeri sürümlerle oluşturulmuş Angular Uygulamaları için kullanılabilir.

## Uygulamanızın injector hiyerarşisini görüntüleyin {#view-the-injector-hierarchy-of-your-application}

**Injector Tree** sekmesi, uygulamanızda yapılandırılmış Injector'ların yapısını keşfetmenizi sağlar. Burada uygulamanızın [injector hiyerarşisini](guide/di/hierarchical-dependency-injection) temsil eden iki ağaç göreceksiniz. Bir ağaç ortam (environment) hiyerarşiniz, diğeri ise öğe (element) hiyerarşinizdir.

<img src="assets/images/guide/devtools/di-injector-tree.png" alt="Angular DevTools'ta, örnek bir uygulamanın enjektör grafiğini görselleştiren enjektör ağacı sekmesini gösteren 'Profiler' sekmesinin ekran görüntüsü.">

## Çözümleme yollarını görselleştirin {#visualize-resolution-paths}

Belirli bir injector seçildiğinde, Angular'ın bağımlılık enjeksiyonu algoritmasının o injector'dan köke kadar izlediği yol vurgulanır. Öğe injector'ları için bu, bir bağımlılık öğe hiyerarşisinde çözümlenemediğinde bağımlılık enjeksiyonu algoritmasının atladığı ortam injector'larının vurgulanmasını da içerir.

Angular'ın çözümleme yollarını nasıl çözdüğü hakkında daha fazla ayrıntı için [resolution rules](guide/di/hierarchical-dependency-injection#çözümleme-kuralları) bölümüne bakın.

<img src="assets/images/guide/devtools/di-injector-tree-selected.png" alt="Bir enjektör seçildiğinde enjektör ağacı görselleştirmesinin çözümleme yollarını nasıl vurguladığını gösteren 'Profiler' sekmesinin ekran görüntüsü.">

## Injector sağlayıcılarını görüntüleyin {#view-injector-providers}

Yapılandırılmış sağlayıcıları (providers) olan bir injector'a tıklamak, bu sağlayıcıları injector ağacı görünümünün sağında bir liste olarak görüntüler. Burada sağlanan token'ı ve türünü görebilirsiniz. Her sağlayıcının sağındaki düğme, sağlayıcıyı konsola yazdırmanıza olanak tanır.

<img src="assets/images/guide/devtools/di-injector-tree-providers.png" alt="Bir enjektör seçildiğinde provider'ların nasıl görünür hale geldiğini gösteren 'Profiler' sekmesinin ekran görüntüsü.">
