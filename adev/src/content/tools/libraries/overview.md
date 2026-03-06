# Angular kütüphanelerine genel bakış

Birçok uygulamanın, birleşik bir kullanıcı arayüzü sunma, veri gösterme ve veri girişine izin verme gibi aynı genel sorunları çözmesi gerekir.
Geliştiriciler, farklı uygulamalarda yeniden kullanım için uyarlanabilecek belirli alanlar için genel çözümler oluşturabilir.
Böyle bir çözüm Angular _kütüphaneleri_ olarak oluşturulabilir ve bu kütüphaneler _npm paketleri_ olarak yayınlanıp paylaşılabilir.

Angular kütüphanesi, kendi başına çalışamaması bakımından bir uygulamadan farklı olan bir Angular projesidir.
Bir kütüphane, bir uygulamaya aktarılmalı ve o uygulama içinde kullanılmalıdır.

Kütüphaneler Angular'ın temel özelliklerini genişletir.
Örneğin, bir uygulamaya [reaktif formlar](guide/forms/reactive-forms) eklemek için `ng add @angular/forms` komutuyla kütüphane paketini ekleyin, ardından uygulama kodunuzda `@angular/forms` kütüphanesinden `ReactiveFormsModule`'ü içe aktarın.
Benzer şekilde, bir Angular uygulamasına [service worker](ecosystem/service-workers) kütüphanesini eklemek, bir uygulamayı [Progressive Web App](https://developers.google.com/web/progressive-web-apps) \(PWA\) haline getirme adımlarından biridir.
[Angular Material](https://material.angular.dev), gelişmiş, yeniden kullanılabilir ve uyarlanabilir kullanıcı arayüzü bileşenleri sağlayan büyük, genel amaçlı bir kütüphane örneğidir.

Herhangi bir uygulama geliştiricisi, Angular ekibi veya üçüncü taraflarca npm paketleri olarak yayınlanan bu ve diğer kütüphaneleri kullanabilir.
Bkz. [Using Published Libraries](tools/libraries/using-libraries).

HELPFUL: Kütüphaneler Angular uygulamaları tarafından kullanılmak üzere tasarlanmıştır. Angular olmayan web uygulamalarına Angular özellikleri eklemek için [Angular özel elemanlarını](guide/elements) kullanın.

## Kütüphane oluşturma

Yeniden kullanıma uygun özellikler geliştirdiyseniz, kendi kütüphanelerinizi oluşturabilirsiniz.
Bu kütüphaneler çalışma alanınızda yerel olarak kullanılabilir veya diğer projeler ya da diğer Angular geliştiricileriyle paylaşmak için [npm paketleri](reference/configs/npm-packages) olarak yayınlayabilirsiniz.
Bu paketler npm kayıt defterine, özel bir npm Enterprise kayıt defterine veya npm paketlerini destekleyen özel bir paket yönetim sistemine yayınlanabilir.
Bkz. [Creating Libraries](tools/libraries/creating-libraries).

Özellikleri kütüphane olarak paketlemeye karar vermek mimari bir karardır. Bir özelliğin bileşen mi yoksa servis mi olacağına veya bir bileşenin kapsamına karar vermeye benzer.

Özellikleri kütüphane olarak paketlemek, kütüphanedeki yapıtaşlarının uygulamanın iş mantığından ayrıştırılmasını zorunlu kılar.
Bu, gelecekte kodun ayrıştırılmasını ve yeniden kullanılmasını zorlaştırabilecek çeşitli kötü uygulamaları veya mimari hataları önlemeye yardımcı olabilir.

Kodu ayrı bir kütüphaneye koymak, her şeyi tek bir uygulamaya koymaktan daha karmaşıktır.
Kütüphaneyi yönetmek, sürdürmek ve güncellemek için daha fazla zaman ve düşünce yatırımı gerektirir.
Bu karmaşıklık, kütüphane birden fazla uygulamada kullanıldığında karşılığını verebilir.
