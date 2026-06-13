# Yavaş hesaplamalar

Her değişiklik algılama döngüsünde Angular senkron olarak:

- Aksi belirtilmedikçe, her bileşenin algılama stratejisine dayalı olarak tüm bileşenlerdeki tüm şablon ifadelerini değerlendirir
- `ngDoCheck`, `ngAfterContentChecked`, `ngAfterViewChecked` ve `ngOnChanges` yaşam döngüsü kancalarını çalıştırır.
  Bir şablon veya yaşam döngüsü kancası içindeki tek bir yavaş hesaplama, Angular hesaplamaları sıralı olarak çalıştırdığı için tüm değişiklik algılama sürecini yavaşlatabilir.

## Yavaş hesaplamaları belirleme

Ağır hesaplamaları Angular DevTools'un profil çıkarıcısı ile belirleyebilirsiniz. Performans zaman çizelgesinde, belirli bir değişiklik algılama döngüsünü önizlemek için bir çubuğa tıklayın. Bu, her bileşen için framework'un değişiklik algılamada ne kadar zaman harcadığını gösteren bir çubuk grafik görüntüler. Bir bileşene tıkladığınızda, Angular'ın şablonunu ve yaşam döngüsü kancalarını değerlendirmek için ne kadar zaman harcadığını önizleyebilirsiniz.

<img alt="Angular DevTools profiler preview showing slow computation" src="assets/images/best-practices/runtime-performance/slow-computations.png">

Örneğin, yukarıdaki ekran görüntüsünde, kaydedilen ikinci değişiklik algılama döngüsü seçilmiştir. Angular bu döngü için 573 ms'den fazla harcamış olup, zamanın büyük bölümü `EmployeeListComponent`'te harcanmıştır. Ayrıntı panelinde, Angular'ın `EmployeeListComponent`'in şablonunu değerlendirmek için 297 ms'den fazla harcadığını görebilirsiniz.

## Yavaş hesaplamaları optimize etme

Yavaş hesaplamaları ortadan kaldırmak için birkaç teknik:

- **Temeldeki algoritmayı optimize etme**. Bu önerilen yaklaşımdır. Soruna neden olan algoritmayı hızlandırabilirseniz, tüm değişiklik algılama mekanizmasını hızlandırabilirsiniz.
- **Saf borular kullanarak önbellekleme**. Ağır hesaplamayı saf bir [boruya](guide/templates/pipes) taşıyabilirsiniz. Angular, saf bir boruyu yalnızca girişlerinin değiştiğini algıladığında, önceki çağırdığı zamana kıyasla yeniden değerlendirir.
- **Memoizasyon kullanma**. [Memoizasyon](https://en.wikipedia.org/wiki/Memoization), saf borulara benzer bir tekniktir; fark, saf boruların yalnızca hesaplamadan son sonucu korumasına karşın memoizasyonun birden fazla sonucu depolayabilmesidir.
- **Yaşam döngüsü kancalarında yeniden boyama/yeniden akışlardan kaçınma**. Belirli [işlemler](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/) tarayıcının sayfanın düzenini senkron olarak yeniden hesaplamasına veya yeniden render etmesine neden olur. Yeniden akışlar ve yeniden boyamalar genellikle yavaş olduğundan, bunları her değişiklik algılama döngüsünde gerçekleştirmekten kaçınmak istersiniz.

Saf borular ve memoizasyonun farkli odulusler vardır. Saf borular, genel bir yazılım mühendisliği pratigı olan fonksiyon sonuclarını önbelleğe almaya yönelik memoizasyona kıyasla Angular'a özgü bir kavramdır. Ağır hesaplamayı farklı argümanlarla sık sık çağırırsanız, memoizasyonun bellek yükü önemli olabilir.
