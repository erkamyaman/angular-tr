# Unhandled errors in Angular

Angular uygulamaniz calisirken, kodunuzun bir kismi hata firlatabilir. Islenmeden birakilirsa, bu hatalar beklenmeyen davranislara ve yanit vermeyen bir kullanici arayuzune yol acabilir. Bu kilavuz, Angular'in uygulama kodunuz tarafindan acikca yakalanmayan hatalari nasil ele aldigini kapsamaktadir. Uygulamaniz icinde kendi hata islemne mantiginizi yazmaya yonelik rehberlik icin, JavaScript ve Angular'da hata isleme en iyi uygulamalarina basvurun.

Angular'in hata isleme stratejisinin temel bir ilkesi, hatalarin mumkun oldugunda cagirim noktasinda gelistiricilere yansitilmasi gerektigidir. Bu yaklasim, bir islemi baslatan kodun hatayi anlamak, uygun sekilde islemek ve uygun uygulama durumunun ne olmasi gerektigine karar vermek icin gerekli baglama sahip olmasini saglar. Hatalari kaynaklarinda gorunur kilarak, gelistiriciler basarisiz olan isleme ozgu hata isleme uygulayabilir ve kurtarma veya son kullaniciya bilgilendirici geri bildirim saglamak icin ilgili bilgilere erisebilir. Bu ayrica, hatalarin nedenlerini anlamak icin yeterli baglam olmadan raporlandigi "Asiri genel hata" kokusundan kacinmaya da yardimci olur.

Ornegin, bir API'den kullanici verileri getiren bir bileseni dusunun. API cagrisini yapan kod, potansiyel ag sorunlarini veya API tarafindan dondurlen hatalari yonetmek icin hata isleme (ornegin, bir `try...catch` blogu veya RxJS'deki `catchError` operatoru) icermelidir. Bu, bilesenin hatayi islenmeden yayilmasina izin vermek yerine kullanici dostu bir hata mesaji goruntulemesine veya istegi yeniden denemesine olanak tanir.

## Unhandled errors are reported to the `ErrorHandler`

Angular, islenmemis hatalari uygulamanin kok `ErrorHandler`'ina bildirir. Ozel bir `ErrorHandler` saglarken, bunu `bootstrapApplication` cagrisinin bir parcasi olarak `ApplicationConfig`'inizde saglayin.

Bir Angular uygulamasi olustururken, genellikle framework _tarafindan_ otomatik olarak cagrilan kod yazarsiniz. Ornegin, Angular, bir bilesenin bir sablonda gorundugunde yapisini ve yasam dongusu yontemlerini cagirmaktan sorumludur. Framework kodunuzu calistirdiginda, hatalari zarif bir sekilde islemek icin makul bir sekilde bir `try` blogu ekleyebileceginiz bir yer yoktur. Bunun gibi durumlarda Angular hatalari yakalar ve `ErrorHandler`'a gonderir.

Angular, dogrudan kodunuz tarafindan cagrilan API'lerin icindeki hatalari _yakalamaz_. Ornegin, hata firlatan bir yontemi olan bir servisiniz varsa ve o yontemi bileseninizde cagiriyorsaniz, Angular o hatayi otomatik olarak yakalamayacaktir. `try...catch` gibi mekanizmalar kullanarak bunu islemek sizin sorumlulugunuzdadir.

Angular, kullanici promise'leri veya observable'larindan gelen _asenkron_ hatalari yalnizca su durumlarda yakalar:

- Angular'in asenkron islemin sonucunu beklemesi ve kullanmasi icin acik bir sozlesme oldugunda ve
- Hatalar donus degerinde veya durumda sunulmadiginda.

Ornegin, `AsyncPipe` ve `PendingTasks.run` hatalari `ErrorHandler`'a iletirken, `resource` hatayi `status` ve `error` ozelliklerinde sunar.

Angular'in `ErrorHandler`'a bildirdigi hatalar _beklenmeyen_ hatalardir. Bu hatalar kurtarilamaz olabilir veya uygulamanin durumunun bozulduguna dair bir gosterge olabilir. Uygulamalar, en sik ve en uygun sekilde yalnizca potansiyel olarak olumcul hatalari hata izleme ve gunluk altyapisina raporlamak icin bir mekanizma olarak kullanilan `ErrorHandler`'a guvenmek yerine, hatanin olustugu yerde `try` bloklari veya uygun hata isleme operatorleri (RxJS'deki `catchError` gibi) kullanarak hata isleme saglamalidir.

```ts
export class GlobalErrorHandler implements ErrorHandler {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly router = inject(Router);

  handleError(error: any) {
    const url = this.router.url;
    const errorMessage = error?.message ?? 'unknown';

    this.analyticsService.trackEvent({
      eventName: 'exception',
      description: `Screen: ${url} | ${errorMessage}`,
    });

    console.error(GlobalErrorHandler.name, {error});
  }
}
```

### `TestBed` rethrows errors by default

Bircok durumda, `ErrorHandler` yalnizca hatalari gunluge kaydedebilir ve uygulamanin calismaya devam etmesine izin verebilir. Ancak testlerde, neredeyse her zaman bu hatalari yuzey cikmak istersiniz. Angular'in `TestBed`'i, framework tarafindan yakalanan hatalarin istemeden gozden kacirilamamasi veya gormezden gelinememesi icin beklenmeyen hatalari yeniden firlatir. Nadir durumlarda, bir test ozellikle hatalarin uygulamanin yanit vermemesine veya cokmesine neden olmadigini saglamaya calisabilir. Bu durumlarda, `TestBed.configureTestingModule({rethrowApplicationErrors: false})` ile [`TestBed`'i uygulama hatalarini yeniden _firlatmayacak_ sekilde yapilandirabilirsiniz](api/core/testing/TestModuleMetadata#rethrowApplicationErrors).

## Global error listeners

Ne uygulama kodu ne de framework'un uygulama ornegi tarafindan yakalanmayan hatalar global kapsama ulasabilir. Global kapsama ulasan hatalar, hesaba katilmazsa istenmeyen sonuclara yol acabilir. Tarayici disindaki ortamlarda, surecin cokmesine neden olabilirler. Tarayicida, bu hatalar raporlanmadan kalabilir ve site ziyaretcileri hatalari tarayici konsolunda gorebilir. Angular, bu sorunlari ele almak icin her iki ortam icin de global dinleyiciler saglar.

### Client-side rendering

[ApplicationConfig](guide/di/defining-dependency-providers#application-bootstrap)'e [`provideBrowserGlobalErrorListeners()`](/api/core/provideBrowserGlobalErrorListeners) eklemek, tarayici penceresine `'error'` ve `'unhandledrejection'` dinleyicileri ekler ve bu hatalari `ErrorHandler`'a iletir. Angular CLI, bu saglayici ile yeni uygulamalar olusturur. Angular ekibi, cogu uygulama icin framework'un yerlesik dinleyicileri veya kendi ozel dinleyicilerinizle bu global hatalarin islenmesini onerir. Ozel dinleyiciler saglarsaniz, `provideBrowserGlobalErrorListeners`'i kaldirabilirsizin.

### Server-side and hybrid rendering

[Angular'i SSR ile](guide/ssr) kullanirken, Angular sunucu surecine otomatik olarak `'unhandledRejection'` ve `'uncaughtException'` dinleyicilerini ekler. Bu isleyiciler sunucunun cokmesini onler ve bunun yerine yakalanan hatalari konsola gunluger.

IMPORTANT: Uygulama Zone.js kullaniyorsa, yalnizca `'unhandledRejection'` isleyicisi eklenir. Zone.js mevcut oldugunda, Uygulamanin Zone'u icindeki hatalar zaten uygulama `ErrorHandler`'ina iletilir ve sunucu surecine ulasmaz.
