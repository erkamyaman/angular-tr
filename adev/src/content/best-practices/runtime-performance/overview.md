# Runtime performance optimization

Hizli render Angular icin kritik oneme sahiptir ve performansli uygulamalar gelistirmenize yardimci olmak icin framework'u bircok optimizasyon dusunulerek olusturduk. Uygulamanizin performansini daha iyi anlamak icin [Angular DevTools](tools/devtools) ve profil cikarma icin Chrome DevTools'un nasil kullanilacagina dair bir [video kilavuzu](https://www.youtube.com/watch?v=FjyX_hkscII) sunuyoruz. Bu bolumde en yaygin performans optimizasyon tekniklerini ele aliyoruz.

**Degisiklik algilama**, Angular'in uygulama durumunuzun degisip degismedigini ve herhangi bir DOM'un guncellenmesi gerekip gerekm edigini kontrol ettigi surectir. Ust duzey de, Angular bilesenlerinizi yukaridan asagiya dogru gezrerek degisiklikleri arar. Angular, veri modelindeki degisikliklerin bir uygulamanin gorunumune yansitilamsi icin degisiklik algilama mekanizmasini periyodik olarak calistirir. Degisiklik algilama, ya manuel olarak ya da bir asenkron olay (ornegin bir kullanici etkilesimi veya bir XMLHttpRequest tamamlanmasi) araciligiyla tetiklenebilir.

Degisiklik algilama son derece optimize edilmis ve performanslidir, ancak uygulama onu cok sik calistirirsa yavaslamalara neden olabilir.

Bu kilavuzda, uygulamanizin bolumleri atlayarak ve degisiklik algilamayi yalnizca gerekli oldugunda calistirarak degisiklik algilama mekanizmasini nasil kontrol edip optimize edeceginizi ogreneceksiniz.

Performans optimizasyonlari hakkinda bir medya formatinda daha fazla bilgi edinmeyi tercih ediyorsaniz bu videoyu izleyin:

<docs-video src="https://www.youtube.com/embed/f8sA-i6gkGQ"/>
