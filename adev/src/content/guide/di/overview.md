<docs-decorative-header title="Angular'da bağımlılık enjeksiyonu" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->

Bağımlılık Enjeksiyonu (DI), bağımlılıkları bir sınıfın içinde oluşturmak yerine sınıfa sağlayarak uygulamanız genelinde kodu düzenlemek ve paylaşmak için kullandığınız bir tasarım desenidir.
</docs-decorative-header>

TIP: Bu kapsamlı kılavuza dalmadan önce Angular'ın [Temel Bilgiler](essentials/dependency-injection) bölümüne göz atın.

Bir uygulama büyüdükçe, geliştiricilerin genellikle kod tabanının farklı bölümlerinde işlevselliği yeniden kullanması ve paylaşması gerekir. [Bağımlılık Enjeksiyonu (DI)](https://en.wikipedia.org/wiki/Dependency_injection), bir bağımlılığı doğrudan bir sınıfın içinde oluşturmak yerine sınıfa sağlamanıza olanak tanıyarak bunu başarmanıza yardımcı olur. Bu, uygulamanın farklı bölümlerini daha yeniden kullanılabilir ve yönetimi daha kolay hale getirir.

Bağımlılık enjeksiyonu, geliştiricilerin yaygın zorlukları ele almasına olanak tanıdığı için popüler bir desendir:

- **Geliştirilmiş kod bakımı**: Bağımlılık enjeksiyonu, endişelerin net bir şekilde ayrılmasını teşvik ederek kodun yeniden düzenlenmesini kolaylaştırır ve tekrarı azaltır.
- **Ölçeklenebilirlik**: Modüler işlevselliği bir uygulamanın farklı bölümlerinde yeniden kullanabilir, böylece ölçeklendirmeyi kolaylaştırabilirsiniz.
- **Daha iyi test edilebilirlik**: DI, birim testlerinin gerektiğinde gerçek uygulamaların yerine [test dublörlerini](https://en.wikipedia.org/wiki/Test_double) kullanmasına olanak tanır.

## Angular'da dependency injection nasıl çalışır?

Bağımlılık, bir sınıfın çalışması için gerektirdiği ancak kendisinin oluşturmadığı herhangi bir nesne, değer, fonksiyon veya servistir. Bunun yerine, onu dışarıdan sağlarsınız ve böylece uygulamanın farklı bölümleri arasında net bir ilişki oluşturursunuz.

Bir bağımlılık enjeksiyonu sistemiyle iki ana şekilde etkileşime girersiniz:

- Değerleri _sağlayabilir_ veya kullanılabilir hale getirebilirsiniz.
- Bu değerleri bağımlılık olarak _enjekte edebilir_ veya isteyebilirsiniz.

Bu bağlamda "değerler", nesneler, fonksiyonlar veya sınıf örnekleri dahil herhangi bir JavaScript değerine işaret edebilir. Yaygın enjekte edilen bağımlılık türleri şunlardır:

- **Yapılandırma değerleri**: Ortama özgü sabitler, API URL'leri, özellik bayrakları vb.
- **Fabrikalar**: Çalışma zamanı koşullarına göre nesneler veya değerler oluşturan fonksiyonlar
- **Servisler**: Ortak işlevsellik, iş mantığı veya durum sağlayan sınıflar

Angular bileşenleri ve direktifleri otomatik olarak DI'ye katılır; bu, onların içine bağımlılıkları enjekte edebileceğiniz ve onları enjekte edilebilir hale getirebileceğiniz anlamına gelir.

## Service'ler nedir?

Angular _servisi_, `@Service` ile dekore edilmiş ve sınıfın bir örneğini bağımlılık olarak enjekte etmenize olanak tanıyan bir TypeScript sınıfıdır. Servisler, bir uygulama genelinde veri ve işlevsellik paylaşmanın en yaygın yoludur.

Yaygın servis türleri şunlardır:

- **Veri istemcileri:** Veri alma ve değiştirme için sunucuya istek yapma detaylarını soyutlar
- **Durum yönetimi:** Birden fazla bileşen veya sayfa arasında paylaşılan durumu tanımlar
- **Kimlik doğrulama ve yetkilendirme:** Kullanıcı kimlik doğrulamasını, token depolamayı ve erişim kontrolünü yönetir
- **Günlükleme ve hata yönetimi:** Günlükleme veya hata durumlarını kullanıcıya iletmek için ortak bir API oluşturur
- **Olay işleme ve dağıtım:** Belirli bir bileşenle ilişkili olmayan olayları veya bildirimleri işler ya da [gözlemci deseni](https://en.wikipedia.org/wiki/Observer_pattern) izleyerek bileşenlere olay ve bildirim dağıtır
- **Yardımcı fonksiyonlar:** Veri biçimlendirme, doğrulama veya hesaplamalar gibi yeniden kullanılabilir yardımcı fonksiyonlar sunar

Aşağıdaki örnek, `AnalyticsLogger` adında bir servis bildirir:

```ts
import {Service} from '@angular/core';

@Service()
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

NOTE: `@Service`, bu servisi tüm uygulamanız boyunca tekil (singleton) olarak kullanılabilir hale getirir. Bu, çoğu servis için önerilen yaklaşımdır.

HELPFUL: [`@Service`](guide/di/creating-and-using-services#service-dekoratörünü-kullanma) dekoratörü, `@Injectable({providedIn: 'root'})` için ergonomik bir kısaltmadır.

## `inject()` ile bağımlılıkları enjekte etme

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

### `inject()` nerede kullanılabilir?

Bir bileşen, direktif veya servisin oluşturulması sırasında bağımlılıkları enjekte edebilirsiniz. [`inject`](/api/core/inject) çağrısı `constructor` içinde veya alan başlatıcıda görünebilir. İşte bazı yaygın örnekler:

```ts
@Component({
  /*...*/
})
export class MyComponent {
  // ✅ Sınıf alan başlatıcısında
  private service = inject(MyService);

  // ✅ Constructor gövdesinde
  private anotherService: MyService;

  constructor() {
    this.anotherService = inject(MyService);
  }
}
```

```ts
@Directive({...})
export class MyDirective {
  // ✅ Sınıf alan başlatıcısında
  private element = inject(ElementRef);
}
```

```ts
import {Service, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Service()
export class MyService {
  // ✅ Bir service içinde
  private http = inject(HttpClient);
}
```

```ts
export const authGuard = () => {
  // ✅ Bir route guard içinde
  const auth = inject(AuthService);
  return auth.isAuthenticated();
};
```

Angular, kodunuzda [`inject`](/api/core/inject) çağırabildiğiniz herhangi bir yeri tanımlamak için "enjeksiyon bağlamı" terimini kullanır. Bileşen, direktif ve servis oluşturma en yaygın olan olsa da, daha fazla ayrıntı için [enjeksiyon bağlamları](/guide/di/dependency-injection-context) bölümüne bakın.

Daha fazla bilgi için [inject API belgelerine](api/core/inject#usage-notes) bakın.

## Sonraki adımlar

Artık Angular'da bağımlılık enjeksiyonunun temellerini anladığınıza göre, kendi servislerinizi nasıl oluşturacağınızı öğrenmeye hazırsınız.

Sonraki kılavuz olan [Servisler oluşturma ve kullanma](guide/di/creating-and-using-services), size şunları gösterecek:

- Angular CLI veya elle bir servis nasıl oluşturulur
- `providedIn: 'root'` deseni nasıl çalışır
- Bileşenlere ve diğer servislere servisler nasıl enjekte edilir

Bu, Angular uygulamalarında servisler için en yaygın kullanım durumunu kapsar.
