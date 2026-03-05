# Reusable animations

IMPORTANT: `@angular/animations` paketi artik kullanim disidir (deprecated). Angular ekibi, tum yeni kodlar icin animasyonlarda `animate.enter` ve `animate.leave` ile yerel CSS kullanmanizi onerir. Yeni giris ve cikis [animasyon rehberinde](guide/animations) daha fazla bilgi edinin. Ayrica uygulamalarinizda saf CSS animasyonlarina nasil gecis yapabileceginizi ogrenmek icin [Angular'in Animasyon paketinden gecis](guide/animations/migration) belgesine bakin.

Bu konu, yeniden kullanilabilir animasyonlarin nasil olusturulacagina dair bazi ornekler saglar.

## Create reusable animations

Yeniden kullanilabilir bir animasyon olusturmak icin, [`animation()`](api/animations/animation) fonksiyonunu kullanarak ayri bir `.ts` dosyasinda bir animasyon tanimlayin ve bu animasyon tanimini bir `const` dis aktarim degiskeni olarak bildirin.
Daha sonra bu animasyonu [`useAnimation()`](api/animations/useAnimation) fonksiyonunu kullanarak uygulamanizin herhangi bir bileseninde iceri aktarabilir ve yeniden kullanabilirsiniz.

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="animation-const"/>

Onceki kod parcasinda, `transitionAnimation` bir dis aktarim degiskeni olarak bildirilerek yeniden kullanilabilir hale getirilmistir.

HELPFUL: `height`, `opacity`, `backgroundColor` ve `time` girisleri calisma zamaninda degistirilir.

Ayrica bir animasyonun bir bolumunu de dis aktarabilirsiniz.
Ornegin, asagidaki kod parcasi animasyon `trigger`'ini dis aktarir.

<docs-code header="animations.1.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="trigger-const"/>

Bu noktadan itibaren, bilesen sinifinizda yeniden kullanilabilir animasyon degiskenlerini iceri aktarabilirsiniz.
Ornegin, asagidaki kod parcasi `transitionAnimation` degiskenini iceri aktarir ve `useAnimation()` fonksiyonu araciligiyla kullanir.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.3.ts" region="reusable"/>

## More on Angular animations

Asagidakilerle de ilgilenebilirsiniz:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Introduction to Angular animations"/>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="Transition and triggers"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Complex animation sequences"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
  <docs-pill href="guide/animations/migration" title="Migrating to Native CSS Animations"/>
</docs-pill-row>
