<docs-decorative-header title="Dependency injection in Angular" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->

Bağımlılık Enjeksiyonu (DI), bir uygulama genelinde kodu düzenlemek ve paylaşmak için kullanılan bir tasarım desenidir.
</docs-decorative-header>

TIP: Bu kapsamlı kılavuza dalmadan önce Angular'ın [Temel Bilgiler](essentials/dependency-injection) bölümüne göz atın.

Bir uygulama büyüdükçe, geliştiricilerin genellikle kod tabanının farklı bölümlerinde özellikleri yeniden kullanması ve paylaşması gerekir. [Bağımlılık Enjeksiyonu (DI)](https://en.wikipedia.org/wiki/Dependency_injection), özellikleri farklı bölümlere "enjekte etmenize" olanak tanıyarak bir uygulama genelinde kodu düzenlemek ve paylaşmak için kullanılan bir tasarım desenidir.

Bağımlılık enjeksiyonu, geliştiricilerin yaygın zorlukları ele almasına olanak tanıdığı için popüler bir desendir:

- **Geliştirilmiş kod bakımı**: Bağımlılık enjeksiyonu, endişelerin daha temiz bir şekilde ayrılmasını sağlayarak daha kolay yeniden düzenleme ve kod tekrarını azaltma imkanı verir.
- **Ölçeklenebilirlik**: Modüler işlevsellik birden fazla bağlamda yeniden kullanılabilir ve daha kolay ölçeklendirme sağlar.
- **Daha iyi test edilebilirlik**: DI, birim testlerinin gerçek bir uygulamayı kullanmanın pratik olmadığı durumlar için kolayca [test dublörlerini](https://en.wikipedia.org/wiki/Test_double) kullanmasına olanak tanır.

## How does dependency injection work in Angular?

Bağımlılık, bir sınıfın çalışması için ihtiyaç duyduğu ancak kendisinin oluşturmadığı herhangi bir nesne, değer, fonksiyon veya servistir. Başka bir deyişle, uygulamanızın farklı bölümleri arasında bir ilişki oluşturur çünkü bağımlılık olmadan çalışmaz.

Herhangi bir bağımlılık enjeksiyonu sistemiyle kodun etkileşime girdiği iki yol vardır:

- Kod, değerleri _sağlayabilir_ veya kullanılabilir hale getirebilir.
- Kod, bu değerleri bağımlılık olarak _enjekte edebilir_ veya isteyebilir.

Bu bağlamda "değerler", nesneler ve fonksiyonlar dahil herhangi bir JavaScript değeri olabilir. Yaygın enjekte edilen bağımlılık türleri şunlardır:

- **Yapılandırma değerleri**: Ortama özgü sabitler, API URL'leri, özellik bayrakları vb.
- **Fabrikalar**: Çalışma zamanı koşullarına göre nesneler veya değerler oluşturan fonksiyonlar
- **Servisler**: Ortak işlevsellik, iş mantığı veya durum sağlayan sınıflar

Angular bileşenleri ve direktifleri otomatik olarak DI'ye katılır; bu, bağımlılıkları enjekte edebilecekleri _ve_ enjekte edilmeye uygun oldukları anlamına gelir.

## What are services?

Angular _servisi_, bir örneğini bağımlılık olarak enjekte edilmeye uygun hale getiren `@Injectable` ile dekore edilmiş bir TypeScript sınıfıdır. Servisler, bir uygulama genelinde veri ve işlevsellik paylaşmanın en yaygın yoludur.

Yaygın servis türleri şunlardır:

- **Veri istemcileri:** Veri alma ve değiştirme için sunucuya istek yapma detaylarını soyutlar
- **Durum yönetimi:** Birden fazla bileşen veya sayfa arasında paylaşılan durumu tanımlar
- **Kimlik doğrulama ve yetkilendirme:** Kullanıcı kimlik doğrulamasını, token depolamayı ve erişim kontrolünü yönetir
- **Günlükleme ve hata yönetimi:** Günlükleme veya hata durumlarını kullanıcıya iletmek için ortak bir API oluşturur
- **Olay işleme ve dağıtım:** Belirli bir bileşenle ilişkili olmayan olayları veya bildirimleri işler ya da [gözlemci deseni](https://en.wikipedia.org/wiki/Observer_pattern) izleyerek bileşenlere olay ve bildirim dağıtır
- **Yardımcı fonksiyonlar:** Veri biçimlendirme, doğrulama veya hesaplamalar gibi yeniden kullanılabilir yardımcı fonksiyonlar sunar

Aşağıdaki örnek, `AnalyticsLogger` adında bir servis bildirir:

```ts
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class AnalyticsLogger {
  trackEvent(category: string, value: string) {
    console.log('Analytics event logged:', {
      category,
      value,
      timestamp: new Date().toISOString(),
    });
  }
}
```

NOTE: `providedIn: 'root'` seçeneği, bu servisi tüm uygulamanız boyunca tekil (singleton) olarak kullanılabilir hale getirir. Bu, çoğu servis için önerilen yaklaşımdır.

## Injecting dependencies with `inject()`

Angular'ın `inject()` fonksiyonunu kullanarak bağımlılıkları enjekte edebilirsiniz.

İşte kullanıcıların farklı bir sayfaya gitmesine izin verirken olayı izlemek için `AnalyticsLogger` ve Angular `Router` servisini enjekte eden bir navigasyon çubuğu örneği.

```angular-ts
import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AnalyticsLogger} from './analytics-logger';

@Component({
  selector: 'app-navbar',
  template: `<a href="#" (click)="navigateToDetail($event)">Detail Page</a>`,
})
export class Navbar {
  private router = inject(Router);
  private analytics = inject(AnalyticsLogger);

  navigateToDetail(event: Event) {
    event.preventDefault();
    this.analytics.trackEvent('navigation', '/details');
    this.router.navigate(['/details']);
  }
}
```

### Where can `inject()` be used?

Bir bileşen, direktif veya servisin oluşturulması sırasında bağımlılıkları enjekte edebilirsiniz. [`inject`](/api/core/inject) çağrısı `constructor` içinde veya alan başlatıcıda görünebilir. İşte bazı yaygın örnekler:

```ts
@Component({
  /*...*/
})
export class MyComponent {
  // ✅ In class field initializer
  private service = inject(MyService);

  // ✅ In constructor body
  private anotherService: MyService;

  constructor() {
    this.anotherService = inject(MyService);
  }
}
```

```ts
@Directive({...})
export class MyDirective {
  // ✅ In class field initializer
  private element = inject(ElementRef);
}
```

```ts
import {Injectable, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class MyService {
  // ✅ In a service
  private http = inject(HttpClient);
}
```

```ts
export const authGuard = () => {
  // ✅ In a route guard
  const auth = inject(AuthService);
  return auth.isAuthenticated();
};
```

Angular, kodunuzda [`inject`](/api/core/inject) çağırabildiğiniz herhangi bir yeri tanımlamak için "enjeksiyon bağlamı" terimini kullanır. Bileşen, direktif ve servis oluşturma en yaygın olan olsa da, daha fazla ayrıntı için [enjeksiyon bağlamları](/guide/di/dependency-injection-context) bölümüne bakın.

Daha fazla bilgi için [inject API belgelerine](api/core/inject#usage-notes) bakın.

## Next steps

Artık Angular'da bağımlılık enjeksiyonunun temellerini anladığınıza göre, kendi servislerinizi nasıl oluşturacağınızı öğrenmeye hazırsınız.

Sonraki kılavuz olan [Servisler oluşturma ve kullanma](guide/di/creating-and-using-services), size şunları gösterecek:

- Angular CLI veya elle bir servis nasıl oluşturulur
- `providedIn: 'root'` deseni nasıl çalışır
- Bileşenlere ve diğer servislere servisler nasıl enjekte edilir

Bu, Angular uygulamalarında servisler için en yaygın kullanım durumunu kapsar.
