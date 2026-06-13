# Kontrol Akışı sözdizimine geçiş

[Kontrol akışı sözdizimi](guide/templates/control-flow) Angular v17'den itibaren mevcuttur. Yeni sözdizimi şablona entegre edilmiştir, bu nedenle artık `CommonModule`'ü içe aktarmanız gerekmez.

Bu şematik, uygulamanızdaki tüm mevcut kodu yeni Kontrol Akışı Sözdizimini kullanacak şekilde geçirir.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```shell
ng generate @angular/core:control-flow
```

## Kırıcı değişiklikler

### `@for` görünüm yeniden kullanımı

`@for` bloğu kullanıldığında, `track` ifadesinde kullanılan bir özellik değişirse ancak nesne referansı aynı kalırsa (yerinde değiştirme), Angular öğeyi yok edip yeniden oluşturmak yerine görünümün bağlamalarını (bileşen girdileri dahil) günceller.

Bu, `*ngFor`'dan farklıdır; `*ngFor`, `trackBy` fonksiyonu farklı bir değer döndürdüğünde benzer bir senaryoda öğenin yeniden bağlanmasını (yok et ve yeniden oluştur) gerçekleştirirdi.
