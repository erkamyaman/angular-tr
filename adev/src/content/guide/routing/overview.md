<docs-decorative-header title="Angular Yönlendirme" imgSrc="adev/src/assets/images/routing.svg"> <!-- markdownlint-disable-line -->
Yönlendirme, tek sayfalık bir uygulamada kullanıcının gördüğü içeriği değiştirmenize yardımcı olur.
</docs-decorative-header>

Angular Router (`@angular/router`), Angular uygulamalarında navigasyonu yönetmek için kullanılan resmi kütüphane ve framework'ün temel bir parçasıdır. Angular CLI tarafından oluşturulan tüm projelerde varsayılan olarak dahil edilmiştir.

## Tek Sayfalık Uygulamada (SPA) yönlendirme neden gereklidir?

Web tarayıcınızda bir URL'ye gittiğinizde, tarayıcı normalde bir web sunucusuna ağ isteği gönderir ve döndürülen HTML sayfasını görüntüler. Bir bağlantıya tıklamak gibi farklı bir URL'ye gittiğinizde, tarayıcı başka bir ağ isteği gönderir ve tüm sayfayı yenisiyle değiştirir.

Tek sayfalık uygulama (SPA), tarayıcının yalnızca ilk sayfa olan `index.html` için web sunucusuna istek göndermesi bakımından farklıdır. Bundan sonra, istemci tarafındaki bir yönlendirici devreye girerek URL'ye göre hangi içeriğin görüntüleneceğini kontrol eder. Kullanıcı farklı bir URL'ye gittiğinde, yönlendirici tam sayfa yenilemesi tetiklemeden sayfanın içeriğini yerinde günceller.

## Angular yönlendirmeyi nasıl yönetir

Angular'da yönlendirme üç temel bölümden oluşur:

1. **Rotalar**, kullanıcı belirli bir URL'yi ziyaret ettiğinde hangi bileşenin görüntüleneceğini tanımlar.
2. **Outlet'ler**, şablonlarınızda aktif rotaya göre bileşenleri dinamik olarak yükleyen ve render eden yer tutuculardır.
3. **Bağlantılar**, kullanıcıların tam sayfa yenilemesi tetiklemeden uygulamanızdaki farklı rotalar arasında gezinmesini sağlar.

Buna ek olarak, Angular Yönlendirme kütüphanesi şu ek işlevleri de sunar:

- İç içe rotalar
- Programatik navigasyon
- Rota parametreleri, sorgular ve joker karakterler
- `ActivatedRoute` ile aktif rota bilgisi
- Görünüm geçiş efektleri
- Navigasyon koruyucuları

## Sonraki adımlar

[Angular router kullanarak rotaları nasıl tanımlayacağınızı](/guide/routing/define-routes) öğrenin.
