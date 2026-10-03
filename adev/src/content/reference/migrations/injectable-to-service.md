# `@Injectable` kullanımından `@Service` kullanımına geçiş

Bu şematik, uygun `@Injectable` sınıflarını, `@Injectable({providedIn: 'root'})` için ergonomik bir kısayol olan [`@Service`](/api/core/Service) dekoratörüne dönüştürür.
v22.1 sürümünden itibaren kullanılabilir ve yalnızca geçirilmesi güvenli kabul edilen sınıfları geçirir.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```bash
ng generate @angular/core:service
```

`providedIn: 'root'` ile bildirilen bir sınıf, seçeneksiz bir `@Service` olur.

#### Önce

```ts
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MyService {}
```

#### Sonra

```ts
import {Service} from '@angular/core';

@Service()
export class MyService {}
```

Seçeneksiz bildirilen bir sınıf otomatik olarak sağlanmaz, bu yüzden geçiş bu davranışı `autoProvided: false` ile korur.
Daha önce olduğu gibi, onu bir `providers` dizisine eklemek yine sizin sorumluluğunuzdadır.

#### Önce {#no-options-before}

```ts
import {Injectable} from '@angular/core';

@Injectable()
export class MyService {}
```

#### Sonra {#no-options-after}

```ts
import {Service} from '@angular/core';

@Service({autoProvided: false})
export class MyService {}
```

Daha fazla ayrıntı için [Otomatik sağlamadan vazgeçme](guide/di/creating-and-using-services#otomatik-sağlamadan-vazgeçme) bölümüne bakın.

## Yapılandırma seçenekleri

### `--path`

Varsayılan olarak geçiş, test dosyaları dahil tüm Angular CLI çalışma alanınızı günceller.
Bu seçeneği kullanarak geçişi belirli bir alt dizinle sınırlayabilirsiniz.

```bash
ng generate @angular/core:service --path src/app/sub-component
```

## Sınırlamalar

Uygulamanıza kırılmalar sokmamak için şematik, aşağıdaki durumlarda bir sınıfı atlar:

- Sınıf veya kendi kaynak kodunuzda bir constructor tanımlayan en yakın üst sınıfı, bağımlılıkları constructor üzerinden enjekte ediyorsa.
- `@Injectable` dekoratörü `providedIn` dışında herhangi bir seçenek alıyorsa.
- `providedIn` seçeneği `'root'` dışında bir değere ayarlanmışsa.

Bir dosyadaki tüm `@Injectable` sınıfları geçirildiğinde, geçiş `Injectable` import'unu kaldırır.
Hem geçirilen hem de atlanan sınıfları olan bir dosya her iki import'u da korur.

Geçiş geçirilecek dosya bulamadığını bildirirse hiçbir dosyayı değiştirmemiştir.
Ya dönüştürebileceği bir `@Injectable` sınıfı bulamamıştır ya da kod zaten geçirilmiştir.
Atlamanın en yaygın nedeni constructor enjeksiyonudur. Önce [`inject` fonksiyonuna geçişi](reference/migrations/inject-function) çalıştırıp ardından bunu yeniden çalıştırabilirsiniz.
