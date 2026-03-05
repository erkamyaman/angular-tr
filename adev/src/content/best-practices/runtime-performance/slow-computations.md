# Slow computations

Her degisiklik algilama dongusunde Angular senkron olarak:

- Aksi belirtilmedikce, her bilesenin algilama stratejisine dayali olarak tum bilesenlerdeki tum sablon ifadelerini degerlendirir
- `ngDoCheck`, `ngAfterContentChecked`, `ngAfterViewChecked` ve `ngOnChanges` yasam dongusu kancalarini calistirir.
  Bir sablon veya yasam dongusu kancasi icindeki tek bir yavas hesaplama, Angular hesaplamalari sirali olarak calistirdigi icin tum degisiklik algilama surecini yavaslatabilir.

## Identifying slow computations

Agir hesaplamalari Angular DevTools'un profil cikaricisi ile belirleyebilirsiniz. Performans zaman cizelgesinde, belirli bir degisiklik algilama dongusunu onizlemek icin bir cubuga tiklayin. Bu, her bilesen icin framework'un degisiklik algilamada ne kadar zaman harcadigini gosteren bir cubuk grafik goruntler. Bir bilesene tikladiginizda, Angular'in sablonunu ve yasam dongusu kancalarini degerlendirmek icin ne kadar zaman harcadigini onizleyebilirsiniz.

<img alt="Angular DevTools profiler preview showing slow computation" src="assets/images/best-practices/runtime-performance/slow-computations.png">

Ornegin, yukaridaki ekran goruntusunde, kaydedilen ikinci degisiklik algilama dongusu secilmistir. Angular bu dongu icin 573 ms'den fazla harcamis olup, zamanin buyuk bolumu `EmployeeListComponent`'te harcanmistir. Ayrinti panelinde, Angular'in `EmployeeListComponent`'in sablonunu degerlendirmek icin 297 ms'den fazla harcadigini gorebilirsiniz.

## Optimizing slow computations

Yavas hesaplamalari ortadan kaldirmak icin birkaç teknik:

- **Temeldeki algortimayi optimize etme**. Bu onerilen yaklasimdir. Soruna neden olan algoritmayı hizlandirabilirseniz, tum degisiklik algilama mekanizmasini hizlandirabilirsiniz.
- **Saf borular kullanarak onbellekleme**. Agir hesaplamayi saf bir [boruya](guide/templates/pipes) tasiyabilirsiniz. Angular, saf bir boruyu yalnizca girislerinin degistigini algiladiginda, onceki cagirdigi zamana kiyasla yeniden degerlendirir.
- **Memoizasyon kullanma**. [Memoizasyon](https://en.wikipedia.org/wiki/Memoization), saf borulara benzer bir tekniktir; fark, saf borularin yalnizca hesaplamadan son sonucu korumasina karsin memoizasyonun birden fazla sonucu depolayabilmesidir.
- **Yasam dongusu kancalarinda yeniden boyama/yeniden akislardan kacinma**. Belirli [islemler](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/) tarayicinin sayfanin duzenini senkron olarak yeniden hesaplamasina veya yeniden render etmesine neden olur. Yeniden akislar ve yeniden boyamalar genellikle yavas oldugundan, bunlari her degisiklik algilama dongusunde gerceklestirmekten kacinmak istersiniz.

Saf borular ve memoizasyonun farkli odulusler vardır. Saf borular, genel bir yazılım mühendisliği pratigı olan fonksiyon sonuclarını önbelleğe almaya yönelik memoizasyona kıyasla Angular'a özgü bir kavramdır. Ağır hesaplamayı farklı argümanlarla sık sık çağırırsanız, memoizasyonun bellek yükü önemli olabilir.
