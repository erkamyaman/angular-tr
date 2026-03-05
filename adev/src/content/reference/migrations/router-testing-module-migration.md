# RouterTestingModule migration

Bu şematik, testlerdeki `RouterTestingModule` kullanımlarını `RouterModule`'e geçirir.

Bir test `@angular/common/testing`'den `SpyLocation`'ı içe aktarıyorsa ve `urlChanges` özelliğini kullanıyorsa, şematik orijinal davranışı korumak için `provideLocationMocks()` da ekleyecektir.

Şematiği şu komutla çalıştırın:

```shell
ng generate @angular/core:router-testing-module-migration
```

## Options

| Seçenek | Ayrıntılar                                                                                                                                  |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `path`  | Geçirilecek yol (proje köküne göreceli). Varsayılan değer `./`'dir. Projenizin bir alt kümesini aşamalı olarak geçirmek için bunu kullanın. |

## Examples

### Preserve router options

Before:

```ts
import {RouterTestingModule} from '@angular/router/testing';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes, {initialNavigation: 'enabledBlocking'})],
    });
  });
});
```

After:

```ts
import {RouterModule} from '@angular/router';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'})],
    });
  });
});
```

### Add provideLocationMocks when `SpyLocation` is imported and `urlChanges` is used

Before:

```ts
import {RouterTestingModule} from '@angular/router/testing';
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

After:

```ts
import {RouterModule} from '@angular/router';
import {provideLocationMocks} from '@angular/common/testing';
import {SpyLocation} from '@angular/common/testing';

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
