# Angular'da işlenmemiş hatalar

Angular uygulamanız çalışırken, kodunuzun bir kısmı hata fırlatabilir. İşlenmeden bırakılırsa, bu hatalar beklenmeyen davranışlara ve yanıt vermeyen bir kullanıcı arayüzüne yol açabilir. Bu kılavuz, Angular'ın uygulama kodunuz tarafından açıkça yakalanmayan hataları nasıl ele aldığını kapsamaktadır. Uygulamanız içinde kendi hata işleme mantığınızı yazmaya yönelik rehberlik için, JavaScript ve Angular'da hata işleme en iyi uygulamalarına başvurun.

Angular'ın hata işleme stratejisinin temel bir ilkesi, hataların mümkün olduğunda çağırım noktasında geliştiricilere yansıtılması gerektiğidir. Bu yaklaşım, bir işlemi başlatan kodun hatayı anlamak, uygun şekilde işlemek ve uygun uygulama durumunun ne olması gerektiğine karar vermek için gerekli bağlama sahip olmasını sağlar. Hataları kaynaklarında görünür kılarak, geliştiriciler başarısız olan işleme özgü hata işleme uygulayabilir ve kurtarma veya son kullanıcıya bilgilendirici geri bildirim sağlamak için ilgili bilgilere erişebilir. Bu ayrıca, hataların nedenlerini anlamak için yeterli bağlam olmadan raporlandığı "Aşırı genel hata" kokusundan kaçınmaya da yardımcı olur.

Örneğin, bir API'den kullanıcı verileri getiren bir bileşeni düşünün. API çağrısını yapan kod, potansiyel ağ sorunlarını veya API tarafından döndürülen hataları yönetmek için hata işleme (örneğin, bir `try...catch` bloğu veya RxJS'deki `catchError` operatörü) içermelidir. Bu, bileşenin hatayı işlenmeden yayılmasına izin vermek yerine kullanıcı dostu bir hata mesajı görüntülemesine veya isteği yeniden denemesine olanak tanır.

## İşlenmemiş hatalar `ErrorHandler`'a bildirilir

Angular, işlenmemiş hataları uygulamanın kök `ErrorHandler`'ına bildirir. Özel bir `ErrorHandler` sağlarken, bunu `bootstrapApplication` çağrısının bir parçası olarak `ApplicationConfig`'inizde sağlayın.

Bir Angular uygulaması oluştururken, genellikle framework _tarafından_ otomatik olarak çağrılan kod yazarsınız. Örneğin, Angular, bir bileşenin bir şablonda göründüğünde yapısını ve yaşam döngüsü yöntemlerini çağırmaktan sorumludur. Framework kodunuzu çalıştırdığında, hataları zarif bir şekilde işlemek için makul bir şekilde bir `try` bloğu ekleyebileceğiniz bir yer yoktur. Bunun gibi durumlarda Angular hataları yakalar ve `ErrorHandler`'a gönderir.

Angular, doğrudan kodunuz tarafından çağrılan API'lerin içindeki hataları _yakalamaz_. Örneğin, hata fırlatan bir yöntemi olan bir servisiniz varsa ve o yöntemi bileşeninizde çağırıyorsanız, Angular o hatayı otomatik olarak yakalamayacaktır. `try...catch` gibi mekanizmalar kullanarak bunu işlemek sizin sorumluluğunuzdadır.

Angular, kullanıcı promise'leri veya observable'larından gelen _asenkron_ hataları yalnızca şu durumlarda yakalar:

- Angular'ın asenkron işlemin sonucunu beklemesi ve kullanması için açık bir sözleşme olduğunda ve
- Hatalar dönüş değerinde veya durumda sunulmadığında.

Örneğin, `AsyncPipe` ve `PendingTasks.run` hataları `ErrorHandler`'a iletirken, `resource` hatayı `status` ve `error` özelliklerinde sunar.

Angular'ın `ErrorHandler`'a bildirdiği hatalar _beklenmeyen_ hatalardır. Bu hatalar kurtarılamaz olabilir veya uygulamanın durumunun bozulduğuna dair bir gösterge olabilir. Uygulamalar, en sık ve en uygun şekilde yalnızca potansiyel olarak ölümcül hataları hata izleme ve günlük altyapısına raporlamak için bir mekanizma olarak kullanılan `ErrorHandler`'a güvenmek yerine, hatanın oluştuğu yerde `try` blokları veya uygun hata işleme operatörleri (RxJS'deki `catchError` gibi) kullanarak hata işleme sağlamalıdır.

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

### `TestBed` varsayılan olarak hataları yeniden fırlatır

Birçok durumda, `ErrorHandler` yalnızca hataları günlüğe kaydedebilir ve uygulamanın çalışmaya devam etmesine izin verebilir. Ancak testlerde, neredeyse her zaman bu hataları yüzey çıkmak istersiniz. Angular'ın `TestBed`'i, framework tarafından yakalanan hataların istemeden gözden kaçırılamaması veya görmezden gelinememesi için beklenmeyen hataları yeniden fırlatır. Nadir durumlarda, bir test özellikle hataların uygulamanın yanıt vermemesine veya çökmesine neden olmadığını sağlamaya çalışabilir. Bu durumlarda, `TestBed.configureTestingModule({rethrowApplicationErrors: false})` ile [`TestBed`'i uygulama hatalarını yeniden _fırlatmayacak_ şekilde yapılandırabilirsiniz](api/core/testing/TestModuleMetadata#rethrowApplicationErrors).

### Uygulamanız henüz başlatılırken fırlatılan hatalar {#errors-thrown-while-your-app-is-still-starting-up}

Angular'ın hataları henüz `ErrorHandler`'ınıza gönderemediği kısa bir an vardır: uygulamanızın kök modülünü veya kök bileşenini oluştururken. Angular'ın sağladığınız `ErrorHandler`'ı bulabilmesi için önce bu kök örneğin var olması gerekir, bu nedenle bundan önce fırlatılan bir hatanın gidebileceği bir yer yoktur. Böyle bir hata, `ErrorHandler` aracılığıyla bildirilmek yerine normal bir yakalanmamış hata gibi davranır.

Bu durumla büyük olasılıkla [Angular elements](guide/elements) ile karşılaşırsınız. Bir özel elementi, etiketi sayfada zaten bulunurken tanımlarsanız, tarayıcı onu hemen yükseltir ve bileşenin constructor'ını ve `ngOnInit`'ini bu erken başlatma işinin bir parçası olarak çalıştırır. Orada fırlatılan herhangi bir hata kaybolabilir.

Bu durumla karşılaşırsanız, hata fırlatan kodu uygulamanızın başlatılması tamamlandıktan sonra çalışacak şekilde taşıyın, örneğin:

- Başlatma sırasında değil, kendi turunda çalışması için `setTimeout(() => /* kodunuz */)` içine sarın.
- Bir constructor'dan çalıştırmak yerine `APP_BOOTSTRAP_LISTENER` olarak sağlayın.
- Özel elementlerinizi kök modülünüzün constructor'ı yerine `ngDoBootstrap` içinde tanımlayın.

`provideBrowserGlobalErrorListeners()`'ı etkinleştirmek (aşağıya bakın) de bu hataları yakalamaya yardımcı olabilir, çünkü bunlar yine de tarayıcıya yakalanmamış hatalar olarak ulaşır.

## Global hata dinleyicileri {#global-error-listeners}

Ne uygulama kodu ne de framework'un uygulama örneği tarafından yakalanmayan hatalar global kapsama ulaşabilir. Global kapsama ulaşan hatalar, hesaba katılmazsa istenmeyen sonuçlara yol açabilir. Tarayıcı dışındaki ortamlarda, sürecin çökmesine neden olabilirler. Tarayıcıda, bu hatalar raporlanmadan kalabilir ve site ziyaretçileri hataları tarayıcı konsolunda görebilir. Angular, bu sorunları ele almak için her iki ortam için de global dinleyiciler sağlar.

### İstemci taraflı renderlama

[ApplicationConfig](guide/di/defining-dependency-providers#uygulama-başlatma)'e [`provideBrowserGlobalErrorListeners()`](/api/core/provideBrowserGlobalErrorListeners) eklemek, tarayıcı penceresine `'error'` ve `'unhandledrejection'` dinleyicileri ekler ve bu hataları `ErrorHandler`'a iletir. Angular CLI, bu sağlayıcı ile yeni uygulamalar oluşturur. Angular ekibi, çoğu uygulama için framework'un yerleşik dinleyicileri veya kendi özel dinleyicilerinizle bu global hataların işlenmesini önerir. Özel dinleyiciler sağlarsanız, `provideBrowserGlobalErrorListeners`'i kaldırabilirsiniz.

### Sunucu taraflı ve hibrit renderlama

[Angular'ı SSR ile](guide/ssr) kullanırken, Angular sunucu sürecine otomatik olarak `'unhandledRejection'` ve `'uncaughtException'` dinleyicilerini ekler. Bu işleyiciler sunucunun çökmesini önler ve bunun yerine yakalanan hataları konsola gunluger.

IMPORTANT: Uygulama Zone.js kullanıyorsa, yalnızca `'unhandledRejection'` işleyicisi eklenir. Zone.js mevcut olduğunda, Uygulamanın Zone'u içindeki hatalar zaten uygulama `ErrorHandler`'ına iletilir ve sunucu sürecine ulaşmaz.
