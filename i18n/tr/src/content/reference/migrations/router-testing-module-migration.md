<!-- source: 96e35e1c02afbdb7d1bf02c93a2c6e8ae02c739c -->
# RouterTestingModule geçişi

Bu şematik, testlerdeki `RouterTestingModule` kullanımlarını `RouterModule`'e geçirir.

Bir test `@angular/common/testing`'den `SpyLocation`'ı içe aktarıyorsa ve `urlChanges` özelliğini kullanıyorsa, şematik orijinal davranışı korumak için `provideLocationMocks()` da ekleyecektir.

Şematiği şu komutla çalıştırın:

```shell
ng generate @angular/core:router-testing-module-migration
```

## Seçenekler {#options}

| Seçenek | Ayrıntılar                                                                                                                                  |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `path`  | Geçirilecek yol (proje köküne göreceli). Varsayılan değer `./`'dir. Projenizin bir alt kümesini aşamalı olarak geçirmek için bunu kullanın. |

## Örnekler {#examples}

### Router seçeneklerini koruma {#preserve-router-options}

Önce:

```ts
import {RouterTestingModule} from '@angular/router/testing';
import {TestBed} from '@angular/core/testing';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes, {initialNavigation: 'enabledBlocking'})],
    });
  });
});
```

Sonra:

```ts
import {RouterModule} from '@angular/router';
import {TestBed} from '@angular/core/testing';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'})],
    });
  });
});
```

### `SpyLocation` import edildiğinde ve `urlChanges` kullanıldığında provideLocationMocks ekleme {#add-providelocationmocks-when-spylocation-is-imported-and-urlchanges-is-used}

Önce:

```ts
import {RouterTestingModule} from '@angular/router/testing';
import {TestBed} from '@angular/core/testing';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  let spy: SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    spy = TestBed.inject(SpyLocation);
  });

  it('Awesome test', () => {
    expect(spy.urlChanges).toBeDefined();
  });
});
```

Sonra:

```ts
import {RouterModule} from '@angular/router';
import {TestBed} from '@angular/core/testing';
import {SpyLocation, provideLocationMocks} from '@angular/common/testing';

describe('test', () => {
  let spy: SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [provideLocationMocks()],
    });
    spy = TestBed.inject(SpyLocation);
  });

  it('Awesome test', () => {
    expect(spy.urlChanges).toBeDefined();
  });
});
```
