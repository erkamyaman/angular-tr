# Angular sinyalleri ile RxJS birlikte çalışması

`@angular/core/rxjs-interop` paketi, RxJS ve Angular sinyallerini entegre etmenize yardımcı olan API'ler sunar.

## `toSignal` ile bir RxJS Observable'dan sinyal oluşturma

Bir Observable'ın değerini takip eden bir sinyal oluşturmak için `toSignal` fonksiyonunu kullanın. Şablonlardaki `async` pipe'ına benzer şekilde davranır, ancak daha esnektir ve bir uygulamanın herhangi bir yerinde kullanılabilir.

```angular-ts
import {Component} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {interval} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  template: `{{ counter() }}`,
})
export class Ticker {
  counterObservable = interval(1000);

  // `counterObservable`'ın değerini temsil eden bir `Signal` al.
  counter = toSignal(this.counterObservable, {initialValue: 0});
}
```

`async` pipe'ı gibi, `toSignal` da Observable'a hemen abone olur ve bu yan etkileri tetikleyebilir. `toSignal` tarafından oluşturulan abonelik, `toSignal`'ı çağıran bileşen veya servis yok edildiğinde otomatik olarak verilen Observable'dan aboneliği iptal eder.

IMPORTANT: `toSignal` bir abonelik oluşturur. Aynı Observable için tekrar tekrar çağırmaktan kaçınmalı ve bunun yerine döndürdüğü sinyali yeniden kullanmalısınız.

### Enjeksiyon bağlamı

`toSignal` varsayılan olarak bir [enjeksiyon bağlamında](guide/di/dependency-injection-context) çalışmalıdır; örneğin bir bileşen veya servisin oluşturulması sırasında. Eğer bir enjeksiyon bağlamı mevcut değilse, bunun yerine kullanılacak `Injector`'ı manuel olarak belirtebilirsiniz.

### Başlangıç değerleri

Observable'lar abonelik sırasında eşzamanlı olarak bir değer üretmeyebilir, ancak sinyaller her zaman geçerli bir değere sahip olmayı gerektirir. `toSignal` sinyallerinin bu "başlangıç" değeriyle başa çıkmanın birkaç yolu vardır.

#### `initialValue` seçeneği

Yukarıdaki örnekte olduğu gibi, Observable ilk kez yayınlamadan önce sinyalin döndürmesi gereken değer için bir `initialValue` seçeneği belirtebilirsiniz.

#### `undefined` başlangıç değerleri

Bir `initialValue` sağlamazsanız, elde edilen sinyal Observable yayın yapana kadar `undefined` döndürür. Bu, `async` pipe'ının `null` döndürme davranışına benzerdir.

#### `requireSync` seçeneği

Bazı Observable'lar, `BehaviorSubject` gibi, eşzamanlı olarak yayın yapmayı garanti eder. Bu durumlarda `requireSync: true` seçeneğini belirtebilirsiniz.

`requireSync` `true` olduğunda, `toSignal` Observable'ın abonelik sırasında eşzamanlı olarak yayın yapmasını zorunlu kılar. Bu, sinyalin her zaman bir değere sahip olmasını garanti eder ve `undefined` türü veya başlangıç değeri gerekmez.

### `manualCleanup`

Varsayılan olarak, `toSignal` bileşen veya servis yok edildiğinde Observable'dan otomatik olarak aboneliği iptal eder.

Bu davranışı geçersiz kılmak için `manualCleanup` seçeneğini geçirebilirsiniz. Bu ayarı, kendiliğinden tamamlanan Observable'lar için kullanabilirsiniz.

#### Özel eşitlik karşılaştırması

Bazı observable'lar, referans veya küçük ayrıntılar açısından farklılık göstermelerine rağmen **eşit** olan değerler yayabilir. `equal` seçeneği, ardışık iki değerin ne zaman aynı kabul edilmesi gerektiğini belirlemek için **özel bir eşitlik fonksiyonu** tanımlamanızı sağlar.

Yayılan iki değer eşit kabul edildiğinde, elde edilen sinyal **güncellenmez**. Bu, gereksiz hesaplamaların, DOM güncellemelerinin veya efektlerin gereksiz yere yeniden çalışmasını önler.

```ts
import {Component} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {interval, map} from 'rxjs';

@Component(/* ... */)
export class EqualExample {
  temperature$ = interval(1000).pipe(
    map(() => ({temperature: Math.floor(Math.random() * 3) + 20})), // Rastgele 20, 21 veya 22
  );

  // Yalnızca sıcaklık değiştiğinde güncelle
  temperature = toSignal(this.temperature$, {
    initialValue: {temperature: 20},
    equal: (prev, curr) => prev.temperature === curr.temperature,
  });
}
```

### Hata ve Tamamlanma

`toSignal` içinde kullanılan bir Observable bir hata üretirse, sinyal okunduğunda bu hata fırlatılır.

`toSignal` içinde kullanılan bir Observable tamamlanırsa, sinyal tamamlanmadan önce yayılan en son değeri döndürmeye devam eder.

## `toObservable` ile bir sinyalden RxJS Observable oluşturma

Bir sinyalin değerini takip eden bir `Observable` oluşturmak için `toObservable` yardımcı fonksiyonunu kullanın. Sinyalin değeri, değiştiğinde Observable'a yayın yapan bir `effect` ile izlenir.

```ts
import {Component, signal} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';

@Component(/* ... */)
export class SearchResults {
  query: Signal<string> = inject(QueryService).query;
  query$ = toObservable(this.query);

  results$ = this.query$.pipe(switchMap((query) => this.http.get('/search?q=' + query)));
}
```

`query` sinyali değiştikçe, `query$` Observable'ı en son sorguyu yayar ve yeni bir HTTP isteği tetikler.

### Enjeksiyon bağlamı

`toObservable` varsayılan olarak bir [enjeksiyon bağlamında](guide/di/dependency-injection-context) çalışmalıdır; örneğin bir bileşen veya servisin oluşturulması sırasında. Eğer bir enjeksiyon bağlamı mevcut değilse, bunun yerine kullanılacak `Injector`'ı manuel olarak belirtebilirsiniz.

### `toObservable` zamanlaması

`toObservable`, sinyalin değerini bir `ReplaySubject` içinde takip etmek için bir efekt kullanır. Abonelik sırasında ilk değer (varsa) eşzamanlı olarak yayılabilir ve sonraki tüm değerler eşzamansız olacaktır.

Observable'ların aksine, sinyaller asla değişikliklerin eşzamanlı bildirimini sağlamaz. Bir sinyalin değerini birden çok kez güncelleseniz bile, `toObservable` yalnızca sinyal kararlı hale geldikten sonra değeri yayar.

```ts
const obs$ = toObservable(mySignal);
obs$.subscribe((value) => console.log(value));

mySignal.set(1);
mySignal.set(2);
mySignal.set(3);
```

Burada yalnızca son değer (3) günlüğe kaydedilir.

## Asenkron veri için `rxResource` kullanımı

IMPORTANT: `rxResource` [deneyseldir](reference/releases#deneysel). Denemeniz için hazır, ancak kararlı hale gelmeden önce değişebilir.

Angular'ın [`resource` fonksiyonu](/guide/signals/resource), uygulamanızın sinyal tabanlı koduna asenkron veriyi dahil etmenin bir yolunu sunar. Bu kalıbın üzerine inşa edilen `rxResource`, veri kaynağınızı bir RxJS `Observable` cinsinden tanımladığınız bir kaynak tanımlamanıza olanak tanır. Bir `loader` fonksiyonu kabul etmek yerine, `rxResource` bir RxJS `Observable` kabul eden bir `stream` fonksiyonu alır.

```typescript
import {Component, inject} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';

@Component(/* ... */)
export class UserProfile {
  // Bu bileşen, verileri bir RxJS Observable aracılığıyla sunan bir servise dayanır.
  private userData = inject(MyUserDataClient);

  protected userId = input<string>();

  private userResource = rxResource({
    params: () => ({userId: this.userId()}),

    // `stream` özelliği, bir RxJS Observable olarak veri akışı döndüren
    // bir fabrika fonksiyonu bekler.
    stream: ({params}) => this.userData.load(params.userId),
  });
}
```

`stream` özelliği, bir RxJS `Observable` için bir fabrika fonksiyonu kabul eder. Bu fabrika fonksiyonuna kaynağın `params` değeri geçirilir ve bir `Observable` döndürür. Kaynak, `params` hesaplaması her yeni değer ürettiğinde bu fabrika fonksiyonunu çağırır. Fabrika fonksiyonuna geçirilen parametreler hakkında daha fazla bilgi için [Kaynak yükleyiciler](/guide/signals/resource#resource-loaderları) bölümüne bakın.

Diğer tüm açılardan, `rxResource`, parametreleri belirlemek, değerleri okumak, yükleme durumunu kontrol etmek ve hataları incelemek için `resource` ile aynı şekilde davranır ve aynı API'leri sağlar.
