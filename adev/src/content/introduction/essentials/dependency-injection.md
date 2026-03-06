<docs-decorative-header title="Bağımlılık Enjeksiyonu" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
Uygulamanız ve testleriniz genelinde kodu yeniden kullanın ve davranışları kontrol edin.
</docs-decorative-header>

Bileşenler arasında mantık paylaşmanız gerektiğinde, Angular [bağımlılık enjeksiyonu](guide/di) tasarım kalıbını kullanır. Bu kalıp, tek bir doğruluk kaynağından yönetirken bileşenlere kod enjekte etmenizi sağlayan bir "servis" oluşturmanıza olanak tanır.

## Servisler Nedir?

Servisler, enjekte edilebilen yeniden kullanılabilir kod parçalarıdır.

Bir bileşen tanımlamaya benzer şekilde, servisler aşağıdakilerden oluşur:

- Sınıfı `@Injectable` aracılığıyla bir Angular servisi olarak tanımlayan ve servisin uygulamanın hangi bölümünden erişilebileceğini `providedIn` özelliği ile belirlemenize olanak tanıyan bir **TypeScript dekoratörü** (bu genellikle uygulamanın herhangi bir yerinden erişime izin vermek için `'root'` olarak ayarlanır).
- Servis enjekte edildiğinde erişilebilir olacak istenen kodu tanımlayan bir **TypeScript sınıfı**

İşte bir `Calculator` servisi örneği.

```angular-ts
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class Calculator {
  add(x: number, y: number) {
    return x + y;
  }
}
```

## Bir Servis Nasıl Kullanılır

Bir bileşende servis kullanmak istediğinizde şunları yapmanız gerekir:

1. Servisi içe aktarın
2. Servisin enjekte edildiği bir sınıf alanı tanımlayın. Sınıf alanını, servisi oluşturan yerleşik [`inject`](/api/core/inject) fonksiyonunun çağrısının sonucuna atayın

`Receipt` bileşeninde nasıl görünebileceği aşağıdadır:

```angular-ts
import {Component, inject} from '@angular/core';
import {Calculator} from './calculator';

@Component({
  selector: 'app-receipt',
  template: `<h1>The total is {{ totalCost }}</h1>`,
})
export class Receipt {
  private calculator = inject(Calculator);
  totalCost = this.calculator.add(50, 25);
}
```

Bu örnekte, `Calculator` Angular'ın [`inject`](/api/core/inject) fonksiyonu çağrılarak ve servis ona geçirilerek kullanılmaktadır.

## Sonraki Adım

<docs-pill-row>
  <docs-pill title="Temel Kavramlar Sonrası Adımlar" href="essentials/next-steps" />
  <docs-pill title="Detaylı bağımlılık enjeksiyonu kılavuzu" href="guide/di" />
</docs-pill-row>
