# Migration to the `inject` function

Angular'ın [`inject`](/api/core/inject) fonksiyonu, yapıcı tabanlı enjeksiyona kıyasla daha doğru türler ve standart dekoratörlerle daha iyi uyumluluk sunar.

Bu şematik, sınıflarınızdaki yapıcı tabanlı enjeksiyonu bunun yerine [`inject`](/api/core/inject) fonksiyonunu kullanacak şekilde dönüştürür.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```shell
ng generate @angular/core:inject
```

#### Before

```typescript
import {Component, Inject, Optional} from '@angular/core';
import {MyService} from './service';
import {DI_TOKEN} from './token';

@Component()
export class MyComp {
  constructor(
    private service: MyService,
    @Inject(DI_TOKEN) @Optional() readonly token: string,
  ) {}
}
```

#### After

```typescript
import {Component, inject} from '@angular/core';
import {MyService} from './service';
import {DI_TOKEN} from './token';

@Component()
export class MyComp {
  private service = inject(MyService);
  readonly token = inject(DI_TOKEN, {optional: true});
}
```

## Migration options

Geçiş, çıktısını özelleştirmek için çeşitli seçenekler içerir.

### `path`

Projenizdeki hangi alt yolun geçirileceğini belirler. Tüm dizini geçirmek için `.` iletin veya boş bırakın.

### `migrateAbstractClasses`

Angular, soyut sınıfların parametrelerinin enjekte edilebilir olduğunu doğrulamaz. Bu, geçişin bunları kırılmalara neden olmadan güvenilir bir şekilde [`inject`](/api/core/inject)'e geçiremeyeceği anlamına gelir, bu nedenle varsayılan olarak devre dışıdır. Soyut sınıfların da geçirilmesini istiyorsanız bu seçeneği etkinleştirin, ancak **bazı kırılmaları manuel olarak düzeltmeniz** gerekebileceğini unutmayın.

### `backwardsCompatibleConstructors`

Varsayılan olarak, geçiş kodu mümkün olduğunca temizlemeye çalışır, bu da yapıcıdan parametreleri silmeyi veya herhangi bir kod içermiyorsa tüm yapıcıyı silmeyi içerir.
Bazı durumlarda bu, Angular dekoratörleri olan sınıflar Angular dekoratörleri olan diğer sınıflardan miras aldığında derleme hatalarına yol açabilir. Bu seçeneği etkinleştirirseniz, geçiş daha fazla kod pahasına geriye dönük uyumluluğu korumak için ek bir yapıcı imzası oluşturacaktır.

#### Before

```typescript
import {Component} from '@angular/core';
import {MyService} from './service';

@Component()
export class MyComp {
  constructor(private service: MyService) {}
}
```

#### After

```ts
import { Component } from '@angular/core';
import { MyService } from './service';

@Component()
export class MyComp {
private service = inject(MyService);

  /\*_ Inserted by Angular inject() migration for backwards compatibility _/
  constructor(...args: unknown[]);

  constructor() {}
}
```

### `nonNullableOptional`

`@Optional` dekoratörü olan bir parametre için enjeksiyon başarısız olursa, Angular `null` döndürür, bu da herhangi bir `@Optional` parametresinin gerçek türünün `| null` olacağı anlamına gelir. Ancak dekoratörler türlerini etkileyemediğinden, türü yanlış olan çok sayıda mevcut kod vardır. Tür `inject()` içinde düzeltilmiştir, bu da yeni derleme hatalarının ortaya çıkmasına neden olabilir. Bu seçeneği etkinleştirirseniz, geçiş potansiyel tür hatalarını gizleme pahasına eski türle eşleşmesi için `inject()` çağrısından sonra null olmayan bir iddia üretecektir.

**NOTE:** Zaten nullable olarak tip atanmış parametrelere null olmayan iddialar eklenmeyecektir, çünkü bunlara bağımlı kod muhtemelen zaten null olabilirliğini hesaba katmaktadır.

#### Before

```typescript
import {Component, Inject, Optional} from '@angular/core';
import {TOKEN_ONE, TOKEN_TWO} from './token';

@Component()
export class MyComp {
  constructor(
    @Inject(TOKEN_ONE) @Optional() private tokenOne: number,
    @Inject(TOKEN_TWO) @Optional() private tokenTwo: string | null,
  ) {}
}
```

#### After

```typescript
import {Component, inject} from '@angular/core';
import {TOKEN_ONE, TOKEN_TWO} from './token';

@Component()
export class MyComp {
  // Note the `!` at the end.
  private tokenOne = inject(TOKEN_ONE, {optional: true})!;

  // Does not have `!` at the end, because the type was already nullable.
  private tokenTwo = inject(TOKEN_TWO, {optional: true});
}
```
