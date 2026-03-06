# Hydration

## Hydration nedir

Hidrasyon, sunucu tarafında render edilmiş uygulamayı istemcide geri yükleme işlemidir. Bu, sunucu tarafında render edilmiş DOM yapılarının yeniden kullanılması, uygulama durumunun korunması, sunucu tarafından zaten alınmış olan uygulama verilerinin aktarılması ve diğer işlemleri içerir.

## Hydration neden önemlidir?

Hidrasyon, DOM düğümlerini yeniden oluşturmak için gereken ekstra işi önleyerek uygulama performansını artırır. Bunun yerine, Angular mevcut DOM öğelerini çalışma zamanında uygulama yapısıyla eşleştirmeye çalışır ve mümkün olduğunda DOM düğümlerini yeniden kullanır. Bu, [Core Web Vitals (CWV)](https://web.dev/learn-core-web-vitals/) istatistikleri kullanılarak ölçülebilen bir performans iyileştirmesi sağlar; örneğin First Input Delay ([FID](https://web.dev/fid/)) ve Largest Contentful Paint ([LCP](https://web.dev/lcp/)) azaltılması ile Cumulative Layout Shift ([CLS](https://web.dev/cls/)) iyileştirilmesi gibi. Bu sayıların iyileştirilmesi ayrıca SEO performansı gibi konuları da etkiler.

Hidrasyon etkinleştirilmeden, sunucu tarafında render edilmiş Angular uygulamaları uygulamanın DOM'unu yok edip yeniden render eder ve bu da görünür bir UI titremesine neden olabilir. Bu yeniden render işlemi, [Core Web Vitals](https://web.dev/learn-core-web-vitals/) değerlerini, örneğin [LCP](https://web.dev/lcp/)'yi olumsuz etkileyebilir ve düzen kaymasına neden olabilir. Hidrasyonun etkinleştirilmesi, mevcut DOM'un yeniden kullanılmasını sağlar ve titremeyi önler.

## Angular'da hydration nasıl etkinleştirilir

Hidrasyon yalnızca sunucu tarafında render edilmiş (SSR) uygulamalar için etkinleştirilebilir. Önce sunucu tarafı render işlemini etkinleştirmek için [Angular SSR Kılavuzu](guide/ssr)'nu takip edin.

### Angular CLI kullanarak

SSR'yi etkinleştirmek için Angular CLI kullandıysanız (uygulama oluşturma sırasında veya daha sonra `ng add @angular/ssr` aracılığıyla), hidrasyonu etkinleştiren kod zaten uygulamanıza dahil edilmiş olmalıdır.

### Manuel kurulum

Özel bir kurulumunuz varsa ve SSR'yi etkinleştirmek için Angular CLI kullanmadıysanız, ana uygulama bileşeninizi veya modülünüzü ziyaret ederek ve `@angular/platform-browser`'dan `provideClientHydration`'ı içe aktararak hidrasyonu manuel olarak etkinleştirebilirsiniz. Ardından bu sağlayıcıyı uygulamanızın başlatma sağlayıcıları listesine eklersiniz.

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
...

bootstrapApplication(App, {
  providers: [provideClientHydration()]
});
```

Alternatif olarak, NgModules kullanıyorsanız, `provideClientHydration`'ı kök uygulama modülünüzün sağlayıcı listesine eklersiniz.

```typescript
import {provideClientHydration} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [App],
  exports: [App],
  bootstrap: [App],
  providers: [provideClientHydration()],
})
export class AppModule {}
```

IMPORTANT: `provideClientHydration()` çağrısının **sunucuda** uygulamayı başlatmak için kullanılan sağlayıcı setine de dahil edildiğinden emin olun. Varsayılan proje yapısına sahip uygulamalarda (`ng new` komutuyla oluşturulan), çağrıyı kök `AppModule`'e eklemek yeterli olmalıdır, çünkü bu modül sunucu modülü tarafından içe aktarılır. Özel bir kurulum kullanıyorsanız, `provideClientHydration()` çağrısını sunucu başlatma yapılandırmasındaki sağlayıcılar listesine ekleyin.

### Hydration'ın etkin olduğunu doğrulama

Hidrasyonu yapılandırdıktan ve sunucunuzu başlattıktan sonra, uygulamanızı tarayıcıda yükleyin.

HELPFUL: Hidrasyonun tam olarak çalışması için muhtemelen Doğrudan DOM Manipülasyonu örneklerini düzeltmeniz gerekecektir; bunun için Angular yapılarına geçiş yapabilir veya `ngSkipHydration` kullanabilirsiniz. Daha fazla ayrıntı için [Kısıtlamalar](#kısıtlamalar), [Doğrudan DOM Manipülasyonu](#doğrudan-dom-manipülasyonu) ve [Belirli bileşenler için hidrasyon nasıl atlanır](#belirli-bileşenler-için-hydration-nasıl-atlanır) bölümlerine bakın.

Uygulamanızı geliştirme modunda çalıştırırken, tarayıcınızda Geliştirici Araçları'nı açarak ve konsolu görüntüleyerek hidrasyonun etkin olduğunu doğrulayabilirsiniz. Hidrasyon ile ilgili istatistikleri içeren bir mesaj görmelisiniz; örneğin hidrasyon yapılan bileşen ve düğüm sayısı gibi. Angular, bir sayfada render edilen tüm bileşenlere dayalı olarak istatistikleri hesaplar ve bunlara üçüncü taraf kütüphanelerden gelen bileşenler de dahildir.

Ayrıca [Angular DevTools tarayıcı uzantısını](tools/devtools) kullanarak bir sayfadaki bileşenlerin hidrasyon durumunu görebilirsiniz. Angular DevTools, sayfanın hangi bölümlerinin hidrasyon yapıldığını gösteren bir katman etkinleştirmenize de olanak tanır. Bir hidrasyon uyumsuzluk hatası varsa, DevTools hataya neden olan bileşeni de vurgular.

## Olayları yakalama ve yeniden oynatma

Bir uygulama sunucuda render edildiğinde, üretilen HTML yüklenir yüklenmez tarayıcıda görünür hale gelir. Kullanıcılar sayfayla etkileşime geçebileceklerini varsayabilir, ancak olay dinleyicileri hidrasyon tamamlanana kadar eklenmez. v18'den itibaren, hidrasyon öncesinde gerçekleşen tüm olayları yakalayan ve hidrasyon tamamlandıktan sonra bu olayları yeniden oynatan Olay Tekrarı özelliğini etkinleştirebilirsiniz. Bunu `withEventReplay()` fonksiyonu ile etkinleştirebilirsiniz, örneğin:

```typescript
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideClientHydration(withEventReplay())],
});
```

### Olay tekrarı nasıl çalışır

Olay Tekrarı, hidrasyon işlemi tamamlanmadan önce tetiklenen kullanıcı olaylarını yakalayarak kullanıcı deneyimini iyileştiren bir özelliktir. Ardından bu olaylar yeniden oynatılır ve bu etkileşimin hiçbirinin kaybolmaması sağlanır.

Olay Tekrarı üç ana aşamaya ayrılır:

- **Kullanıcı etkileşimlerinin yakalanması**<br>
  **Hidrasyon** öncesinde, Olay Tekrarı kullanıcının gerçekleştirebileceği tıklamalar ve diğer tarayıcı yerel olayları gibi tüm etkileşimleri yakalar ve saklar.

- **Olayların saklanması**<br>
  **Olay Sözleşmesi**, bir önceki adımda kaydedilen tüm etkileşimleri bellekte tutar ve daha sonra tekrar oynatılmak üzere kaybolmamalarını sağlar.

- **Olayların yeniden başlatılması**<br>
  **Hidrasyon** tamamlandıktan sonra, Angular yakalanan olayları yeniden çağırır.

Olay tekrarı _yerel tarayıcı olaylarını_ destekler, örneğin `click`, `mouseover` ve `focusin`. Olay tekrarını güçlendiren kütüphane olan JSAction hakkında daha fazla bilgi edinmek istiyorsanız, [readme dosyasında](https://github.com/angular/angular/tree/main/packages/core/primitives/event-dispatch#readme) daha fazla bilgi bulabilirsiniz.

---

Bu özellik, Hidrasyon öncesinde gerçekleştirilen kullanıcı eylemlerinin göz ardı edilmesini önleyerek tutarlı bir kullanıcı deneyimi sağlar.

NOTE: [Artımlı hidrasyon](guide/incremental-hydration) etkinleştirdiyseniz, olay tekrarı arka planda otomatik olarak etkinleştirilir.

## Kısıtlamalar

Hidrasyon, hidrasyon etkinleştirilmeden mevcut olmayan uygulamanıza bazı kısıtlamalar getirir. Uygulamanız hem sunucuda hem de istemcide aynı üretilmiş DOM yapısına sahip olmalıdır. Hidrasyon işlemi, DOM ağacının her iki yerde de aynı yapıya sahip olmasını bekler. Bu, Angular'ın sunucuda render sırasında ürettiği boşlukları ve yorum düğümlerini de içerir. Bu boşluklar ve düğümler, sunucu tarafı render işlemi tarafından üretilen HTML'de mevcut olmalıdır.

IMPORTANT: Sunucu tarafı render işlemi tarafından üretilen HTML, sunucu ve istemci arasında **değiştirilmemelidir**.

Sunucu ve istemci DOM ağaç yapıları arasında bir uyumsuzluk varsa, hidrasyon işlemi beklenen ile DOM'da gerçekte bulunan arasında eşleştirme yapmaya çalışırken sorunlarla karşılaşır. Yerel DOM API'lerini kullanarak doğrudan DOM manipülasyonu yapan bileşenler en yaygın nedendir.

### Doğrudan DOM Manipülasyonu

Yerel DOM API'lerini kullanarak DOM'u manipüle eden veya `innerHTML` ya da `outerHTML` kullanan bileşenleriniz varsa, hidrasyon işlemi hatalarla karşılaşır. DOM manipülasyonunun sorun olduğu belirli durumlar `document`'e erişme, belirli öğeleri sorgulama ve `appendChild` kullanarak ek düğümler ekleme gibi durumlardır. DOM düğümlerini ayırma ve başka konumlara taşıma da hatalara neden olur.

Bunun nedeni, Angular'ın bu DOM değişikliklerinden haberdar olmaması ve hidrasyon işlemi sırasında bunları çözememesidir. Angular belirli bir yapı bekler, ancak hidrasyon yapmaya çalışırken farklı bir yapıyla karşılaşır. Bu uyumsuzluk, hidrasyon hatasına neden olur ve bir DOM uyumsuzluk hatası fırlatır ([aşağıya bakın](#hatalar)).

Bileşeninizi bu tür DOM manipülasyonundan kaçınmak için yeniden düzenlemeniz en iyisidir. Mümkünse bu işi yapmak için Angular API'lerini kullanmayı deneyin. Bu davranışı yeniden düzenleyemiyorsanız, hidrasyon dostu bir çözüme geçene kadar `ngSkipHydration` niteliğini ([aşağıda açıklanmıştır](#belirli-bileşenler-için-hydration-nasıl-atlanır)) kullanın.

### Geçerli HTML yapısı

Bileşen şablonunuz geçerli bir HTML yapısına sahip değilse, hidrasyon sırasında DOM uyumsuzluk hatasına neden olabilecek birkaç durum vardır.

Örneğin, bu sorunun en yaygın durumlarından bazıları şunlardır.

- `<tbody>` olmayan `<table>`
- `<p>` içinde `<div>`
- Başka bir `<a>` içinde `<a>`

HTML'inizin geçerli olup olmadığından emin değilseniz, kontrol etmek için bir [sözdizimi doğrulayıcı](https://validator.w3.org/) kullanabilirsiniz.

NOTE: HTML standardı tablolarda `<tbody>` öğesini gerektirmese de, modern tarayıcılar `<tbody>` bildirmeyen tablolarda otomatik olarak bir `<tbody>` öğesi oluşturur. Bu tutarsızlık nedeniyle, hidrasyon hatalarını önlemek için tablolarda her zaman açıkça bir `<tbody>` öğesi bildirin.

### Boşlukları Koruma Yapılandırması

Hidrasyon özelliğini kullanırken, `preserveWhitespaces` için varsayılan `false` ayarını kullanmanızı öneririz. Bu ayar tsconfig'inizde yoksa, değer `false` olacaktır ve herhangi bir değişiklik gerekmez. Tsconfig'inize `preserveWhitespaces: true` ekleyerek boşlukların korunmasını etkinleştirmeyi seçerseniz, hidrasyon ile ilgili sorunlarla karşılaşabilirsiniz. Bu henüz tam olarak desteklenen bir yapılandırma değildir.

HELPFUL: Bu ayarın, sunucunuz için `tsconfig.server.json`'da ve tarayıcı derlemeleriniz için `tsconfig.app.json`'da **tutarlı** olarak ayarlandığından emin olun. Uyumsuz bir değer hidrasyonun bozulmasına neden olur.

Bu ayarı tsconfig'inizde ayarlamayı seçerseniz, bunu yalnızca `tsconfig.app.json`'da ayarlamanızı öneririz; varsayılan olarak `tsconfig.server.json` bunu ondan devralacaktır.

### Özel veya Noop Zone.js henüz desteklenmiyor

Hidrasyon, uygulama içinde kararlı hale geldiğinde Zone.js'den gelen bir sinyale dayanır; böylece Angular sunucuda serileştirme işlemini veya istemcide hidrasyon sonrası temizliği başlatabilir ve sahipsiz kalan DOM düğümlerini kaldırabilir.

Özel veya "noop" bir Zone.js uygulaması sağlamak, "kararlı" olayının farklı zamanlamasına yol açabilir ve bu da serileştirme veya temizliğin çok erken veya çok geç tetiklenmesine neden olabilir. Bu henüz tam olarak desteklenen bir yapılandırma değildir ve özel Zone.js uygulamanızda `onStable` olayının zamanlamasını ayarlamanız gerekebilir.

## Hatalar

Düğüm uyumsuzluklarından `ngSkipHydration`'ın geçersiz bir ana düğümde kullanıldığı durumlara kadar karşılaşabileceğiniz birkaç hidrasyon ile ilgili hata vardır. Oluşabilecek en yaygın hata durumu, yerel API'ler kullanılarak doğrudan DOM manipülasyonu nedeniyle hidrasyonun istemcide sunucu tarafından render edilen beklenen DOM ağaç yapısını bulamaması veya eşleştirememesidir. Bu tür bir hatayla karşılaşabileceğiniz diğer durum, daha önce [Geçerli HTML yapısı](#geçerli-html-yapısı) bölümünde belirtilmiştir. Bu nedenle, şablonlarınızdaki HTML'in geçerli bir yapı kullandığından emin olun ve bu hata durumundan kaçınmış olursunuz.

Hidrasyon ile ilgili hataların tam referansı için [Hatalar Referans Kılavuzu](/errors)'nu ziyaret edin.

## Belirli bileşenler için hydration nasıl atlanır

Yukarıda bahsedilen [Doğrudan DOM Manipülasyonu](#doğrudan-dom-manipülasyonu) gibi bazı sorunlar nedeniyle bazı bileşenler hidrasyon etkinleştirildiğinde düzgün çalışmayabilir. Geçici çözüm olarak, bileşenin tamamının hidrasyon yapılmasını atlamak için bileşenin etiketine `ngSkipHydration` niteliğini ekleyebilirsiniz.

```angular-html
<app-example ngSkipHydration />
```

Alternatif olarak `ngSkipHydration`'ı bir host bağlayıcı olarak ayarlayabilirsiniz.

```typescript
@Component({
  ...
  host: {ngSkipHydration: 'true'},
})
class ExampleComponent {}
```

`ngSkipHydration` niteliği, Angular'ı bileşenin tamamı ve alt bileşenleri için hidrasyonu atlamaya zorlar. Bu niteliği kullanmak, bileşenin hidrasyon etkinleştirilmemiş gibi davranacağı anlamına gelir; yani kendini yok edip yeniden render edecektir.

HELPFUL: Bu, render sorunlarını düzeltecektir, ancak bu bileşen (ve alt bileşenleri) için hidrasyonun faydalarından yararlanamayacağınız anlamına gelir. Hidrasyon atlama notasyonunu kaldırabilmek için bileşeninizin uygulamasını hidrasyon bozan kalıplardan (yani Doğrudan DOM Manipülasyonu) kaçınacak şekilde ayarlamanız gerekecektir.

`ngSkipHydration` niteliği yalnızca bileşen ana düğümlerinde kullanılabilir. Angular, bu nitelik diğer düğümlere eklenirse hata fırlatır.

`ngSkipHydration` niteliğini kök uygulama bileşeninize eklemenin tüm uygulamanız için hidrasyonu etkili bir şekilde devre dışı bırakacağını unutmayın. Bu niteliği kullanırken dikkatli ve düşünceli olun. Son çare geçici çözüm olarak tasarlanmıştır. Hidrasyonu bozan bileşenler, düzeltilmesi gereken hatalar olarak değerlendirilmelidir.

## Hydration Zamanlaması ve Uygulama Kararlılığı

Uygulama kararlılığı hidrasyon sürecinin önemli bir parçasıdır. Hidrasyon ve hidrasyon sonrası işlemler yalnızca uygulama kararlılığını bildirdikten sonra gerçekleşir. Kararlılığı geciktirebilecek birçok yol vardır. Örnekler arasında zamanlayıcılar ve aralıklar ayarlama, çözülmemiş promise'ler ve bekleyen mikro görevler bulunur. Bu durumlarda, uygulamanızın 10 saniye sonra hala kararlı duruma ulaşmadığını gösteren [Uygulama kararsız kalıyor](errors/NG0506) hatasıyla karşılaşabilirsiniz. Uygulamanızın hemen hidrasyon yapmadığını fark ediyorsanız, uygulama kararlılığını neyin etkilediğine bakın ve bu gecikmelere neden olmayı önlemek için yeniden düzenleyin.

### Uygulama Kararlılığını Hata Ayıklama

`provideStabilityDebugging` yardımcı aracı, uygulamanızın neden kararlı hale gelemediğini belirlemenize yardımcı olur. Bu yardımcı araç, `provideClientHydration` kullanıldığında geliştirme modunda varsayılan olarak sağlanır. Ayrıca, örneğin üretim paketlerinde veya hidrasyon olmadan SSR kullanırken kullanmak için uygulama sağlayıcılarına manuel olarak da ekleyebilirsiniz. Bu özellik, uygulama kararlı hale gelmesi beklenenden uzun sürerse konsola bilgi kaydeder.

```typescript
import {provideStabilityDebugging} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import 'zone.js/plugins/task-tracking'; // `provideZoneChangeDetection` ile Zone.js kullanıyorsanız kullanın

bootstrapApplication(App, {
  providers: [provideStabilityDebugging()],
});
```

Etkinleştirildiğinde, yardımcı araç bekleyen görevleri (`PendingTasks`) konsola kaydeder. Uygulamanız Zone.js kullanıyorsa, Angular Zone'unun kararlı hale gelmesini engelleyen makro görevleri görmek için `zone.js/plugins/task-tracking`'i de içe aktarabilirsiniz. Bu eklenti, makro görev oluşturmanın yığın izini sağlayarak gecikmenin kaynağını etkili bir şekilde belirlemenize yardımcı olur.

IMPORTANT: Angular, zone.js görev izleme eklentisini veya bu yardımcı aracı üretim paketlerinden kaldırmaz. Bunları yalnızca geliştirme sırasında kararlılık sorunlarının geçici hata ayıklaması için kullanın; optimize edilmiş üretim derlemeleri dahil.

## I18N

HELPFUL: Varsayılan olarak Angular, i18n blokları kullanan bileşenler için hidrasyonu atlar ve bu bileşenleri sıfırdan yeniden render eder.

i18n blokları için hidrasyonu etkinleştirmek amacıyla `provideClientHydration` çağrınıza [`withI18nSupport`](/api/platform-browser/withI18nSupport) ekleyebilirsiniz.

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
  withI18nSupport,
} from '@angular/platform-browser';
...

bootstrapApplication(App, {
  providers: [provideClientHydration(withI18nSupport())]
});
```

## Sunucu tarafı ve istemci tarafı arasında tutarlı render

Sunucu tarafı render ile istemci tarafı render arasında farklı içerik görüntüleyen `@if` blokları ve diğer koşullu ifadeleri kullanmaktan kaçının; örneğin Angular'ın `isPlatformBrowser` fonksiyonu ile bir `@if` bloğu kullanmak gibi. Bu render farklılıkları düzen kaymalarına neden olur ve son kullanıcı deneyimini ve core web vitals'ı olumsuz etkiler.

## DOM Manipülasyonu Yapan Üçüncü Taraf Kütüphaneler

Render yapabilmek için DOM manipülasyonuna bağımlı birçok üçüncü taraf kütüphanesi vardır. D3 grafikleri bunun başlıca örneğidir. Bu kütüphaneler hidrasyon olmadan çalışıyordu, ancak hidrasyon etkinleştirildiğinde DOM uyumsuzluk hatalarına neden olabilirler. Şimdilik, bu kütüphanelerden birini kullanırken DOM uyumsuzluk hatalarıyla karşılaşırsanız, o kütüphaneyi kullanarak render yapan bileşene `ngSkipHydration` niteliğini ekleyebilirsiniz.

## DOM Manipülasyonu Yapan Üçüncü Taraf Betikler

Reklam takipçileri ve analitik gibi birçok üçüncü taraf betiği, hidrasyon gerçekleşmeden önce DOM'u değiştirir. Bu betikler, sayfa artık Angular'ın beklediği yapıyla eşleşmediği için hidrasyon hatalarına neden olabilir. Mümkün olduğunda bu tür betikleri hidrasyon sonrasına ertelemeyi tercih edin. Betiği hidrasyon sonrası işlemler gerçekleştikten sonra geciktirmek için [`AfterNextRender`](api/core/afterNextRender) kullanmayı düşünün.

## Artımlı Hydration

Artımlı hidrasyon, hidrasyonun ne zaman gerçekleşeceği üzerinde daha ayrıntılı kontrol sağlayan gelişmiş bir hidrasyon biçimidir. Daha fazla bilgi için [artımlı hidrasyon kılavuzuna](guide/incremental-hydration) bakın.
