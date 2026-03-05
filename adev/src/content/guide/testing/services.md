# Testing services

Servisler genellikle bileşenlerin dayandığı uygulamanızın iş mantığını içerir. Servisleri test etmek, mantığın herhangi bir bileşen veya şablondan bağımsız olarak doğru çalıştığını doğrular.

Bu kılavuz, Angular CLI projelerinin varsayılan olarak içerdiği [Vitest](https://vitest.dev/)'i kullanır. Test kurulumu hakkında daha fazla bilgi için [test genel bakış kılavuzuna](guide/testing#set-up-for-testing) bakın.

## Testing a service

Temel aritmetik işlemleri yapan bir `Calculator` servisi düşünün:

```ts { header: 'calculator.ts' }
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}
```

Bu servisi test etmek için, her test için izole bir test ortamı oluşturan Angular'ın test aracı olan `TestBed`'i yapılandırın. Bağımlılık enjeksiyonunu kurar ve servis örneklerini almanıza olanak tanır - Angular'ın gerçek bir uygulamada her şeyi nasıl birbirine bağladığını simüle eder.

```ts { header: 'calculator.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it} from 'vitest';
import {Calculator} from './calculator';

describe('Calculator', () => {
  let service: Calculator;

  beforeEach(() => {
    // Injects the Calculator service which is available to Angular
    // because the service uses `providedIn: 'root'`
    service = TestBed.inject(Calculator);
  });

  it('adds two numbers', () => {
    expect(service.add(1, 2)).toBe(3);
  });

  it('subtracts two numbers', () => {
    expect(service.subtract(5, 3)).toBe(2);
  });
});
```

Yukarıdaki örnekte, `beforeEach` bloğu her testten önce servisin taze bir örneğini enjekte eder. Bu, her testin önceki testlerden sızmış durum olmadan izole çalışmasını sağlar.

## Testing services with dependencies

Çoğu servis, düzgün çalışmak için diğer servislere bağımlıdır. Varsayılan olarak `TestBed`, bu bağımlılıkların gerçek uygulamalarını sağlar; bu da testlerinizin uygulamanızın kullandığı gerçek kod yollarını çalıştırdığı anlamına gelir. Ancak bazen bir bağımlılık karmaşık, yavaş veya öngörülemez olabilir. Bu durumlarda, kontrollü bir yedek ile değiştirebilirsiniz.

Bir siparişin nihai fiyatını hesaplamak için `TaxCalculator`'a dayanan bir `OrderTotal` servisi düşünün:

```ts { header: 'tax-calculator.ts' }
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class TaxCalculator {
  calculate(subtotal: number): number {
    return subtotal * 0.05;
  }
}
```

```ts { header: 'order-total.ts' }
import {inject, Injectable} from '@angular/core';
import {TaxCalculator} from './tax-calculator';

@Injectable({providedIn: 'root'})
export class OrderTotal {
  private taxCalculator = inject(TaxCalculator);

  total(subtotal: number): number {
    return subtotal + this.taxCalculator.calculate(subtotal);
  }
}
```

Bu örnekte `OrderTotal`, Angular'ın bağımlılık enjeksiyon sisteminden `TaxCalculator`'ı talep etmek için `inject()` kullanır. Varsayılan olarak `TestBed`, bunun gibi basit hesaplamalar için mükemmel olan gerçek `TaxCalculator`'ı sağlar. Ancak `TaxCalculator` karmaşık mantık, ağ istekleri veya öngörülemez sonuçlar içeriyorsa, kontrollü bir yedek ile değiştirmek isteyebilirsiniz.

### Replacing a dependency with a stub

Bir stub, bir bağımlılığı veya metodu öngörülebilir değerler döndüren biriyle değiştirmenin bir yoludur ve bu da test sonuçlarının doğrulanmasını kolaylaştırabilir.

`OrderTotal`'ı gerçek `TaxCalculator`'a dayanmadan test etmek için, `TestBed` yapılandırmasında bir stub sağlayabilirsiniz.

```ts { header: 'order-total.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it, vi, type Mocked} from 'vitest';
import {OrderTotal} from './order-total';
import {TaxCalculator} from './tax-calculator';

// Vitest's `Mocked` utility type ensures the stub is type-safe,
// while `vi.fn()` creates a mock function for each method
const taxCalculatorStub: Mocked<TaxCalculator> = {
  calculate: vi.fn(),
};

describe('OrderTotal', () => {
  let service: OrderTotal;

  beforeEach(() => {
    // `mockReturnValue` sets a controlled return value for the stub
    taxCalculatorStub.calculate.mockReturnValue(5);

    TestBed.configureTestingModule({
      // The `providers` array accepts a provider object where `provide`
      // specifies the dependency to replace and `useValue` defines the stub
      providers: [{provide: TaxCalculator, useValue: taxCalculatorStub}],
    });
    service = TestBed.inject(OrderTotal);
  });

  it('adds tax to the subtotal', () => {
    expect(service.total(100)).toBe(105);
  });
});
```

Bu stub ile `OrderTotal` `TaxCalculator`'ı talep ettiğinde, `TestBed` bunun yerine `taxCalculatorStub`'ı kullanmayı bilir. Stub her zaman 5 döndürdüğünden, test `OrderTotal`'ın vergi oranının `TaxCalculator`'da değişip değişmediğinden bağımsız olarak ara toplamına vergi değerini doğru şekilde eklediğini doğrular.

### Verifying interactions with spies

Bir stub, bir bağımlılığın ne döndürdüğünü kontrol eder, ancak bazen bir servisin bağımlılığını doğru argümanlarla çağırdığını da doğrulamanız gerekir. Bu, bir fonksiyonun nasıl çağrıldığını izleyen spy'lar ile gerçekleştirilebilir. Vitest'te bu işlevsellik `vi.fn()` içine yerleştirilmiştir ve servisler arasındaki etkileşimleri doğrulamanıza olanak tanır.

```ts { header: 'order-total.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it, vi, type Mocked} from 'vitest';
import {OrderTotal} from './order-total';
import {TaxCalculator} from './tax-calculator';

const taxCalculatorStub: Mocked<TaxCalculator> = {
  calculate: vi.fn(),
};

describe('OrderTotal', () => {
  let service: OrderTotal;

  beforeEach(() => {
    taxCalculatorStub.calculate.mockReturnValue(5);

    TestBed.configureTestingModule({
      providers: [{provide: TaxCalculator, useValue: taxCalculatorStub}],
    });
    service = TestBed.inject(OrderTotal);
  });

  it('adds tax to the subtotal', () => {
    expect(service.total(100)).toBe(105);
  });

  // Verify the interaction with a spy
  it('calls the tax calculator', () => {
    service.total(100);
    expect(taxCalculatorStub.calculate).toHaveBeenCalledExactlyOnce();
  });
});
```

Yeni test, `OrderTotal`'ın toplamı hesaplarken `TaxCalculator.calculate`'i çağırdığını doğrular. Bu, servisler arasındaki etkileşimin doğru şekilde gerçekleştiğini doğrulamak istediğinizde faydalıdır.

## Testing HTTP services

Birçok servis, sunucudan veri almak için Angular'ın `HttpClient`'ını kullanır. Angular, gerçek ağ istekleri yapmadan HTTP yanıtlarını kontrol etmenize olanak tanıyan `HttpClient` için özel test araçları sağlar.

`HttpClient` kullanan servisleri test etme hakkında ayrıntılar için [HTTP test kılavuzuna](guide/http/testing) bakın.
