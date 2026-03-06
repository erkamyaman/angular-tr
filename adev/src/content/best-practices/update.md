# Angular projelerinizi güncel tutma

Web ve tüm web ekosistemi gibi, Angular da sürekli olarak geliştirilmektedir.
Angular, sürekli iyileştirmeyi güçlü bir kararlılık odağı ve güncellemeleri basit hale getirme ile dengeler.
Angular uygulamanızı güncel tutmak, öncül yeni özelliklerden, optimizasyonlardan ve hata düzeltmelerinden yararlanmanızı sağlar.

Bu belge, Angular uygulamalarınızı ve kütüphanelerinizi güncel tutmanıza yardımcı olacak bilgi ve kaynaklar içermektedir.

Sürüm politikamız ve uygulamalarımız hakkında bilgi için — destek ve kullanım dışı bırakma uygulamaları ile yayın takvimi dahil — [Angular versiyonlama ve yayınlar](reference/releases 'Angular versioning and releases') sayfasına bakın.

HELPFUL: Şu anda AngularJS kullanıyorsanız, [AngularJS'den Yükseltme](https://angular.io/guide/upgrade 'Upgrading from Angular JS') sayfasına bakın.
_AngularJS_, Angular'ın tüm v1.x sürümlerinin adıdır.

## Yeni sürümlerden bildirim alma

Yeni sürümler mevcut olduğunda bildirim almak için X'te (eski adıyla Twitter) [@angular](https://x.com/angular '@angular on X') hesabını takip edin veya [Angular blogu](https://blog.angular.dev 'Angular blog')'na abone olun.

## Yeni özellikler hakkında bilgi edinme

Yenilikler neler? Neler değişti? En önemli bilmeniz gereken şeyleri [sürüm duyurularında](https://blog.angular.dev/ 'Angular blog - release announcements') Angular blogunda paylaşıyoruz.

Sürüme göre düzenlenmiş değişikliklerin tam listesini incelemek için [Angular değişiklik günlüğü](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Angular change log')'ne bakın.

## Angular sürümünüzü kontrol etme

Uygulamanızın Angular sürümünü kontrol etmek için proje dizininizden `ng version` komutunu kullanın.

## Angular'ın güncel sürümünü bulma

Angular'ın en son kararlı yayınlanmış sürümü [npm'de](https://www.npmjs.com/package/@angular/core 'Angular on npm') "Version" altında görülür. Örneğin, `16.2.4`.

Ayrıca CLI komutu [`ng update`](cli/update) kullanarak Angular'ın en güncel sürümünü bulabilirsiniz.
Varsayılan olarak, [`ng update`](cli/update) (ek argüman olmadan) mevcut güncellemeleri listeler.

## Ortamınızı ve uygulamalarınızı güncelleme

Güncellemeyi karmaşık olmaktan çıkarmak için, etkileşimli [Angular Güncelleme Kılavuzu](update-guide)'nda eksiksiz talimatlar sağlıyoruz.

Angular Güncelleme Kılavuzu, belirttiğiniz mevcut ve hedef sürümlere dayalı olarak özelleştirilmiş güncelleme talimatları sağlar.
Uygulamalarınızın karmaşıklığına uygun temel ve gelişmiş güncelleme yollarını içerir.
Ayrıca sorun giderme bilgileri ve yeni sürümden en iyi şekilde yararlanmanıza yardımcı olacak önerilen manuel değişiklikleri içerir.

Basit güncellemeler için CLI komutu [`ng update`](cli/update) ihtiyacınız olan tek şeydir.
Ek argüman olmadan, [`ng update`](cli/update) mevcut güncellemeleri listeler ve uygulamanızı en güncel sürüme güncellemek için önerilen adımları sağlar.

[Angular Versiyonlama ve Yayınlar](reference/releases#angular-versiyonlama 'Angular Release Practices, Versioning'), bir sürümün sürüm numarasına göre bekleyebileceğiniz değişiklik düzeyini tanımlar.
Ayrıca desteklenen güncelleme yollarını da tanımlar.

## Kaynak özeti

- Sürüm duyuruları:
  [Angular blogu - sürüm duyuruları](https://blog.angular.dev/ 'Angular blog announcements about recent releases')

- Sürüm ayrıntıları:
  [Angular değişiklik günlüğü](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Angular change log')

- Güncelleme talimatları:
  [Angular Güncelleme Kılavuzu](update-guide)

- Güncelleme komutu referansları:
  [Angular CLI `ng update` komut referansları](cli/update)

- Versiyonlama, yayın, destek ve kullanım dışı bırakma uygulamaları:
  [Angular versiyonlama ve yayınlar](reference/releases 'Angular versioning and releases')
