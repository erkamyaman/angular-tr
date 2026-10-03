# Yeniden kullanılabilir animasyonlar

IMPORTANT: `@angular/animations` paketi artık kullanım dışıdır (deprecated). Angular ekibi, tüm yeni kodlar için animasyonlarda `animate.enter` ve `animate.leave` ile yerel CSS kullanmanızı önerir. Yeni giriş ve çıkış [animasyon rehberinde](guide/animations) daha fazla bilgi edinin. Ayrıca uygulamalarınızda saf CSS animasyonlarına nasıl geçiş yapabileceğinizi öğrenmek için [Angular'ın Animasyon paketinden geçiş](guide/animations/migration) belgesine bakın.

Bu konu, yeniden kullanılabilir animasyonların nasıl oluşturulacağına dair örnekler sağlar.

## Yeniden kullanılabilir animasyonlar oluşturma

Yeniden kullanılabilir bir animasyon oluşturmak için, [`animation()`](api/animations/animation) fonksiyonunu kullanarak ayrı bir `.ts` dosyasında bir animasyon tanımlayın ve bu animasyon tanımını bir `const` dış aktarım değişkeni olarak bildirin.
Daha sonra bu animasyonu [`useAnimation()`](api/animations/useAnimation) fonksiyonunu kullanarak uygulamanızın bileşenlerinde içeri aktarabilir ve yeniden kullanabilirsiniz.

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="animation-const"/>

Önceki kod parçasında, `transitionAnimation` bir dış aktarım değişkeni olarak bildirilerek yeniden kullanılabilir hale getirilmiştir.

HELPFUL: `height`, `opacity`, `backgroundColor` ve `time` girişleri çalışma zamanında değiştirilir.

Ayrıca bir animasyonun bir bölümünü de dış aktarabilirsiniz.
Örneğin, aşağıdaki kod parçası animasyon `trigger`'ını dış aktarır.

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="trigger-const"/>

Bu noktadan itibaren, yeniden kullanılabilir animasyon değişkenlerini bileşen sınıfınıza içeri aktarabilirsiniz.
Örneğin, aşağıdaki kod parçası `transitionAnimation` değişkenini içeri aktarır ve `useAnimation()` fonksiyonu aracılığıyla kullanır.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.3.ts" region="reusable"/>

## Angular animasyonları hakkında daha fazla bilgi

Aşağıdakilerle de ilgilenebilirsiniz:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Angular Animasyonlarına Giriş"/>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="Animasyon geçişleri ve tetikleyiciler"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Karmaşık animasyon dizileri"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route Geçiş Animasyonları"/>
  <docs-pill href="guide/animations/migration" title="Angular'ın Animasyon paketinden geçiş"/>
</docs-pill-row>
