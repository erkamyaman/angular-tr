# Keeping your Angular projects up-to-date

Web ve tum web ekosistemi gibi, Angular da surekli olarak gelistirilmektedir.
Angular, surekli iyilestirmeyi guclu bir kararlilik odagi ve guncellemeleri basit hale getirme ile dengeler.
Angular uygulamanizi guncel tutmak, oncul yeni ozelliklerden, optimizasyonlardan ve hata duzeltmelerinden yararlanmanizi saglar.

Bu belge, Angular uygulamalarinizi ve kutuphanelerinizi guncel tutmaniza yardimci olacak bilgi ve kaynaklar icermektedir.

Surum politikamiz ve uygulamalarimiz hakkinda bilgi icin — destek ve kullanim disi birakma uygulamalari ile yayin takvimi dahil — [Angular surumleme ve yayinlar](reference/releases 'Angular versioning and releases') sayfasina bakin.

HELPFUL: Su anda AngularJS kullaniyorsaniz, [AngularJS'den Yukseltme](https://angular.io/guide/upgrade 'Upgrading from Angular JS') sayfasina bakin.
_AngularJS_, Angular'in tum v1.x surumlerinin adidir.

## Getting notified of new releases

Yeni surumler mevcut oldugunda bildirim almak icin X'te (eski adiyla Twitter) [@angular](https://x.com/angular '@angular on X') hesabini takip edin veya [Angular blogu](https://blog.angular.dev 'Angular blog')'na abone olun.

## Learning about new features

Yenilikler neler? Neler degisti? En onemli bilmeniz gereken seyleri [surum duyurularinda](https://blog.angular.dev/ 'Angular blog - release announcements') Angular blogunda paylasiyoruz.

Surume gore duzenlenmis degisikliklerin tam listesini incelemek icin [Angular degisiklik gunlugu](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Angular change log')'ne bakin.

## Checking your version of Angular

Uygulamanizin Angular surumunu kontrol etmek icin proje dizininizden `ng version` komutunu kullanin.

## Finding the current version of Angular

Angular'in en son kararli yayinlanmis surumu [npm'de](https://www.npmjs.com/package/@angular/core 'Angular on npm') "Version" altinda gorulur. Ornegin, `16.2.4`.

Ayrica CLI komutu [`ng update`](cli/update) kullanarak Angular'in en guncel surumunu bulabilirsiniz.
Varsayilan olarak, [`ng update`](cli/update) (ek arguman olmadan) mevcut guncellemeleri listeler.

## Updating your environment and apps

Guncellemeyi karmasik olmaktan cikarmak icin, etkilesimli [Angular Guncelleme Kilavuzu](update-guide)'nda eksiksiz talimatlar sagliyoruz.

Angular Guncelleme Kilavuzu, belirttiginiz mevcut ve hedef surumlere dayali olarak ozellesitirilmis guncelleme talimatlari saglar.
Uygulamalarinizin karmasikligina uygun temel ve gelismis guncelleme yollarini icerir.
Ayrica sorun giderme bilgileri ve yeni surumden en iyi sekilde yararlanmaniza yardimci olacak onerilen manuel degisiklikleri icerir.

Basit guncellemeler icin CLI komutu [`ng update`](cli/update) ihtiyaciniz olan tek seydir.
Ek arguman olmadan, [`ng update`](cli/update) mevcut guncellemeleri listeler ve uygulamanizi en guncel surume guncellemek icin onerilen adimlari saglar.

[Angular Surumleme ve Yayinlar](reference/releases#angular-versioning 'Angular Release Practices, Versioning'), bir surumun surum numarasina gore bekleyebileceginiz degisiklik duzeyini tanimlar.
Ayrica desteklenen guncelleme yollarini da tanimlar.

## Resource summary

- Surum duyurulari:
  [Angular blogu - surum duyurulari](https://blog.angular.dev/ 'Angular blog announcements about recent releases')

- Surum ayrintilari:
  [Angular degisiklik gunlugu](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Angular change log')

- Guncelleme talimatlari:
  [Angular Guncelleme Kilavuzu](update-guide)

- Guncelleme komutu referansları:
  [Angular CLI `ng update` komut referansları](cli/update)

- Surumleme, yayin, destek ve kullanim disi birakma uygulamalari:
  [Angular surumleme ve yayinlar](reference/releases 'Angular versioning and releases')
