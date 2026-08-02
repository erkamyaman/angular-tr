# Signal Forms'u Test Etme

Formlar çoğu zaman uygulamalar için kritiktir ve testler, kod tabanı değiştikçe formların doğru davrandığından emin olmanızı sağlar. Signal Forms mantığının çoğunu şablonda değil şemada tutar; bu da form davranışının büyük bölümünü bir bileşen render etmeden test edebileceğiniz anlamına gelir.

Bu kılavuz, önce izole mantık testleriyle başlayıp ardından DOM etkileşiminin önemli olduğu durumlar için bileşene bağlı testleri ele alarak bu testlerin nasıl kurulacağını anlatır.

## Form mantığını izole test etme

Yalnızca doğrulamayı, disabled durumunu, required durumunu veya hata çıktısını doğrulamanız gerektiğinde, bir bileşen render etmek yerine formu doğrudan test edin. İzole testler kurulumu küçük tutar ve testin formun davranışına odaklanmasını sağlar.

Temel gereksinim enjektördür. Signal Forms, form oluşturma sırasında bir enjeksiyon bağlamına ihtiyaç duyar. Bir test `form()`'u enjeksiyon bağlamı olmadan çağırırsa, test form hakkında herhangi bir iddiada bulunamadan çağrı hata fırlatır.

Bu gereksinimi karşılamanın en doğrudan yolu bir enjektörü açıkça geçirmektir. Aşağıdaki test, `required` kuralına sahip bir form oluşturur ve alanın bir değer aldıktan sonra geçerli hale geldiğini doğrular:

```ts {header: 'profile-form.spec.ts'}
import {Injector, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {form, required} from '@angular/forms/signals';
import {describe, expect, it} from 'vitest';

describe('profile form', () => {
  it('marks required fields as invalid until they have a value', () => {
    const model = signal({name: ''});

    const profileForm = form(
      model,
      (path) => {
        required(path.name);
      },
      {injector: TestBed.inject(Injector)},
    );

    expect(profileForm.name().valid()).toBe(false);
    expect(profileForm.name().errors()).toEqual([expect.objectContaining({kind: 'required'})]);

    profileForm.name().value.set('Ada');

    expect(profileForm.name().valid()).toBe(true);
    expect(profileForm.name().errors()).toEqual([]);
  });
});
```

Bu desen çoğu izole test için iyi çalışır; çünkü enjektör gereksinimi çağrı noktasında görünür kalır. Ayrıca Angular kaynak kodundaki Signal Forms birim testlerinin form oluşturma biçimini de yansıtır.

Test edilen kod `form()`'u kendi içinde çağırıyorsa, enjektörü doğrudan geçiremeyebilirsiniz. Bu durumda çağrıyı bir ortam enjeksiyon bağlamına sarın:

```ts {header: 'profile-form.spec.ts'}
import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {form, required} from '@angular/forms/signals';
import {describe, expect, it} from 'vitest';

describe('profile form', () => {
  it('can create a form inside an injection context', () => {
    const model = signal({name: ''});

    TestBed.runInInjectionContext(() => {
      const profileForm = form(model, (path) => {
        required(path.name);
      });

      expect(profileForm.name().valid()).toBe(false);
    });
  });
});
```

Her iki desen de aynı türde bir form üretir. Test formu doğrudan oluşturduğunda `{injector}` geçirmek genellikle en anlaşılır seçimdir. `TestBed.runInInjectionContext()` ise test edilen kod `form()`'u kendi içinde çağırdığında ve çevreleyen enjeksiyon bağlamını sağlamanız gerektiğinde kullanışlıdır.

Form oluştuktan sonra onu alan durumu sinyalleri üzerinden test edin. Yaygın iddialar arasında `valid()`, `invalid()`, `disabled()`, `required()` ve `errors()` bulunur. Çoğu form mantığı için bu, davranışı DOM'a girmeden doğrulamak açısından yeterlidir.

## Birden fazla kurallı bir formu test etme

Enjektör kurulumu tamamlandıktan sonra, iyi bir sonraki adım birkaç form mantığı parçasını birlikte çalıştıran eksiksiz bir testtir. Bu tür bir test hâlâ izoledir, ancak gerçek bir uygulama formuna çok daha yakın görünür.

Örneğin bu test, hem temel bir required kuralını hem de başka bir alana bağlı koşullu bir required kuralını doğrular:

```ts {header: 'profile-form.spec.ts'}
import {Injector, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {form, required} from '@angular/forms/signals';
import {describe, expect, it} from 'vitest';

describe('profile form', () => {
  it('updates validation state when related fields change', () => {
    const model = signal({
      name: '',
      age: 5,
    });

    const profileForm = form(
      model,
      (path) => {
        required(path.name);
        required(path.name, {
          error: (ctx) => ({kind: `required-${ctx.valueOf(path.age)}`}),
          when: ({valueOf}) => valueOf(path.age) > 10,
        });
      },
      {injector: TestBed.inject(Injector)},
    );

    expect(profileForm.name().invalid()).toBe(true);
    expect(profileForm.name().errors()).toEqual([expect.objectContaining({kind: 'required'})]);

    profileForm.age().value.set(15);

    expect(profileForm.name().errors()).toEqual([
      expect.objectContaining({kind: 'required'}),
      expect.objectContaining({kind: 'required-15'}),
    ]);

    profileForm.name().value.set('Ada');

    expect(profileForm.name().valid()).toBe(true);
    expect(profileForm.name().errors()).toEqual([]);
  });
});
```

Bu örnek önemli bir test desenini gösterir: bir alanı güncelleyin, ardından başka bir alanın durumuna karşı iddiada bulunun. Signal Forms kuralları reaktif olduğundan, bir alanın doğrulaması kardeş değerlere, üst değerlere veya başka türetilmiş koşullara bağlı olabilir. Testler yalnızca değişen alanı denetlemek yerine bu ilişkileri doğrudan doğrulamalıdır.

Doğrulama odaklı testlerde `errors()` genellikle en faydalı iddiadır. `valid()` ve `invalid()` alanın şu anda doğrulamayı geçip geçmediğini söyler, ancak `errors()` hangi kuralın başarısızlığa yol açtığını gösterir. Bir alanın birden fazla doğrulayıcısı ya da koşullu kuralı olduğunda bu özellikle işe yarar.

Aynı yapı günlük form testlerinin çoğunda işe yarar:

1. Davranışı yeniden üreten en küçük yapıya sahip bir model sinyali oluşturun.
1. Formu açık bir enjektörle kurun.
1. Başlangıçtaki alan durumunu doğrulayın.
1. Bir alanı `.value.set(...)` ile değiştirin; alanlar arası kuralları test ederken kardeş alanlar dahil.
1. Güncellenen durum sinyallerini, genellikle `errors()`, `valid()` veya `invalid()`, doğrulayın.

Bir test render'dan çok şema davranışıyla ilgiliyse varsayılan olarak bu izole stili kullanın. Bileşen testinden hızlıdır ve davranış değiştiğinde hangi kuralın sorumlu olduğunu görmeyi kolaylaştırır.

## Bileşenlere bağlı formları test etme

Şablon bağlamalarına, `dispatchEvent` aracılığıyla kullanıcı etkileşimine veya kendi render'ını yöneten özel form kontrollerine bağlı davranışı doğrulamanız gerektiğinde izole testler yeterli değildir. Gerçek DOM elemanlarıyla etkileşebilmek için şablonu render eden bileşene bağlı testlere ihtiyacınız vardır.

### Bir bileşen testi kurma

Bileşene bağlı testler, gerçek DOM elemanlarıyla etkileşebilmeniz için bileşeni render eder. Bileşeni `TestBed.createComponent()` ile oluşturun ve iddiada bulunmadan önce render'ın tamamlanmasını bekleyin:

```angular-ts {header: 'profile-form.ts'}
import {Component, signal} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';

@Component({
  selector: 'app-profile-form',
  imports: [FormField],
  template: `<input [formField]="profileForm.name" />`,
})
export class ProfileForm {
  readonly model = signal({name: 'Ada'});
  readonly profileForm = form(this.model, (path) => {
    required(path.name);
  });
}
```

```ts {header: 'profile-form.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';
import {ProfileForm} from './profile-form';

describe('ProfileForm', () => {
  it('reflects model values in the DOM and updates the model on user input', async () => {
    const fixture = TestBed.createComponent(ProfileForm);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    // Model → Görünüm: input, modelin başlangıç değerini yansıtır
    expect(input.value).toBe('Ada');

    // Görünüm → Model: kullanıcının alanı temizlemesini simüle et
    input.value = '';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(fixture.componentInstance.profileForm.name().value()).toBe('');
    expect(fixture.componentInstance.profileForm.name().valid()).toBe(false);
  });
});
```

Bileşenin `form()`'u açık bir enjektör olmadan kullandığına dikkat edin; çünkü bileşenin kendi enjeksiyon bağlamı bunu otomatik olarak sağlar. Her değişiklikten sonra `await fixture.whenStable()`, iddiada bulunmadan önce render'ın ve effect'lerin tamamlanmasını bekler.

Aynı desen, asenkron doğrulayıcılar ya da sunucu çağrıları gibi asenkron işlemler için de geçerlidir. Asenkron iş çözüldükten sonra `await fixture.whenStable()` çağırın.

## Hangi yaklaşım ne zaman kullanılır

| Doğrulamanız gereken şey                                | Yaklaşım       |
| ------------------------------------------------------- | -------------- |
| Doğrulama kuralları, `errors()`, `valid()`, `invalid()` | İzole          |
| Disabled, required veya readonly durumu                 | İzole          |
| Alanlar arası reaktif bağımlılıklar                     | İzole          |
| Koşullu şemalar (`applyWhen`, `applyWhenValue`)         | İzole          |
| DOM'da render edilen girdi değerleri                    | Bileşene bağlı |
| Kullanıcı yazımının modeli güncellemesi                 | Bileşene bağlı |
| Kendi şablonlarına sahip özel form kontrolleri          | Bileşene bağlı |
| Odak yönetimi veya erişilebilirlik nitelikleri          | Bileşene bağlı |

Çoğu form yalnızca izole testlere ihtiyaç duyar. Formun mantığı (doğrulama, disabled durumu, alanlar arası kurallar gibi) şemada yaşar ve şemaların çalışmak için bir şablona ihtiyacı yoktur. Bileşene bağlı testler, önemsediğiniz davranış form ile DOM arasındaki sınırı geçtiğinde değer katar.

## Sonraki adımlar

Bu kılavuz Signal Forms'u izole olarak ve bileşen şablonlarıyla test etmeyi ele aldı. Signal Forms'un diğer yönlerini inceleyen ilgili kılavuzlar:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="Doğrulama" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Alan durumu yönetimi" />
  <docs-pill href="guide/forms/signals/form-submission" title="Form gönderimi" />
</docs-pill-row>
