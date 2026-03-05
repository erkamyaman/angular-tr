# Migrations

Mevcut Angular projenizi en son özelliklere nasıl aşamalı olarak geçirebileceğinizi öğrenin.

<docs-card-container>
  <docs-card title="Standalone" link="Migrate now" href="reference/migrations/standalone">
    Standalone bileşenler, Angular uygulamaları oluşturmanın basitleştirilmiş bir yolunu sağlar. Standalone bileşenler, bağımlılıklarını NgModules aracılığıyla almak yerine doğrudan belirtir.
  </docs-card>
  <docs-card title="Control Flow Syntax" link="Migrate now" href="reference/migrations/control-flow">
    Yerleşik Kontrol Akışı Sözdizimi, JavaScript'e yakın daha ergonomik sözdizimi ve daha iyi tür denetimi kullanmanıza olanak tanır. `*ngFor`, `*ngIf` ve `*ngSwitch` gibi işlevselliği kullanmak için `CommonModule` içe aktarma ihtiyacını ortadan kaldırır.
  </docs-card>
  <docs-card title="inject() Function" link="Migrate now" href="reference/migrations/inject-function">
    Angular'ın [`inject`](/api/core/inject) fonksiyonu, yapıcı tabanlı enjeksiyona kıyasla daha doğru türler ve standart dekoratörlerle daha iyi uyumluluk sunar.
  </docs-card>
  <docs-card title="Lazy-loaded routes" link="Migrate now" href="reference/migrations/route-lazy-loading">
    Hevesli yüklenen bileşen rotalarını tembel yüklenen rotalara dönüştürün. Bu, derleme sürecinin üretim paketlerini daha küçük parçalara bölmesine olanak tanıyarak, ilk sayfa yüklemesinde daha az JavaScript yüklenmesini sağlar.
  </docs-card>
  <docs-card title="New `input()` API" link="Migrate now" href="reference/migrations/signal-inputs">
    Mevcut `@Input` alanlarını artık üretime hazır olan yeni sinyal girdi API'sine dönüştürün.
  </docs-card>
  <docs-card title="New `output()` function" link="Migrate now" href="reference/migrations/outputs">
    Mevcut `@Output` özel olaylarını artık üretime hazır olan yeni output fonksiyonuna dönüştürün.
  </docs-card>
  <docs-card title="Queries as signal" link="Migrate now" href="reference/migrations/signal-queries">
    Mevcut dekoratör sorgu alanlarını geliştirilmiş sinyal sorguları API'sine dönüştürün. API artık üretime hazırdır.
  </docs-card>
  <docs-card title="Cleanup unused imports" link="Try it now" href="reference/migrations/cleanup-unused-imports">
    Projenizdeki kullanılmayan içe aktarmaları temizleyin.
  </docs-card>
  <docs-card title="Self-closing tags" link="Migrate now" href="reference/migrations/self-closing-tags">
    Bileşen şablonlarını mümkün olduğunda kendinden kapanan etiketler kullanacak şekilde dönüştürün.
  </docs-card>
  <docs-card title="NgClass to Class Bindings" link="Migrate now" href="reference/migrations/ngclass-to-class">
      Bileşen şablonlarını mümkün olduğunda `NgClass` direktifleri yerine sınıf bağlamalarını tercih edecek şekilde dönüştürün.
  </docs-card>
  <docs-card title="NgStyle to Style Bindings" link="Migrate now" href="reference/migrations/ngstyle-to-style">
      Bileşen şablonlarını mümkün olduğunda `NgStyle` direktifleri yerine stil bağlamalarını tercih edecek şekilde dönüştürün.
  </docs-card>
  <docs-card title="RouterTestingModule migration" link="Migrate now" href="reference/migrations/router-testing-module-migration">
    TestBed yapılandırmalarında `RouterTestingModule` kullanımlarını `RouterModule`'e dönüştürün ve uygun olduğunda `provideLocationMocks()` ekleyin.
  </docs-card>
  <docs-card title="CommonModule to standalone imports" link="Migrate now" href="reference/migrations/common-to-standalone">
    Mümkün olduğunda `CommonModule` içe aktarmalarını şablonlarda kullanılan bireysel direktif ve pipe'ların içe aktarmalarıyla değiştirin.
  </docs-card>
</docs-card-container>
