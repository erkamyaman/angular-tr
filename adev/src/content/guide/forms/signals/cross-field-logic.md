# Çapraz alan mantığı

**Çapraz alan mantığı**, bir alanın herhangi bir kuralı, doğrulaması veya davranışı başka bir alanın değerine ya da durumuna bağlı olduğunda gereklidir.

Signal Forms, her kural fonksiyonuna bir **alan bağlamı** (field context) sağlar. Alan bağlamı, mevcut alanın değerine ve durumuna erişim sunar ve `valueOf()`, `stateOf()` ile `fieldTreeOf()` kullanarak formdaki diğer alanları okumanıza olanak tanır.

Bu kılavuz alan bağlamı API'sini ayrıntılı olarak ele alır ve yaygın çapraz alan kalıplarını gösterir. Tek alanlı doğrulama için [Doğrulama kılavuzuna](/guide/forms/signals/validation) bakın.

## Alan bağlamını anlama {#understanding-the-field-context}

Signal Forms'taki her kural fonksiyonu, mevcut alanı tanımlayan ve formun geri kalanına erişim sağlayan bir nesne olan **alan bağlamı** parametresini alır.

Mevcut alan için erişebileceğiniz üç özellik vardır:

| Özellik     | Tür                  | Açıklama                                                             |
| ----------- | -------------------- | -------------------------------------------------------------------- |
| `value`     | `Signal<TValue>`     | Mevcut alanın değeri, sinyal olarak                                  |
| `state`     | `FieldState<TValue>` | Mevcut alanın durumu (geçerlilik, hatalar, dokunulma, kirlilik gibi) |
| `fieldTree` | `FieldTree<TValue>`  | Mevcut alanın ağacı, alt alanlara programatik erişim için            |

Çapraz alan mantığı için, aşağıdaki üç özellik formun diğer bölümlerine erişmenizi sağlar:

| Özellik         | Tür                            | Açıklama                                                                                                                                         |
| --------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `valueOf()`     | `(path) => PValue`             | En yaygın olanı. Karşılaştırmalar veya hesaplamalar için başka bir alanın ham değerine ihtiyacınız olduğunda kullanın.                           |
| `stateOf()`     | `(path) => FieldState<PValue>` | Mantığınız başka bir alanın durumuna (geçerli, dokunulmuş veya kirli olup olmadığı gibi) bağlı olduğunda kullanın.                               |
| `fieldTreeOf()` | `(path) => FieldTree<PModel>`  | Başka bir alanın ağacına programatik erişime ihtiyacınız olduğunda kullanın, örneğin validateTree ile belirli bir alt alana hata göndermek için. |

Mevcut alanın (bitiş tarihi) formdaki başlangıç tarihinden sonra geldiğini doğrulamak için `value` ve `valueOf()` kullanan bir örnek:

```ts
import {Component, signal} from '@angular/core';
import {form, validate} from '@angular/forms/signals';

@Component({/* ... */})
export class EventForm {
  eventModel = signal({
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-05'),
  });

  eventForm = form(this.eventModel, (schemaPath) => {
    validate(schemaPath.endDate, ({value, valueOf}) => {
      if (value() <= valueOf(schemaPath.startDate)) {
        return {
          kind: 'invalidDateRange',
          message: 'End date must be after start date',
        };
      }

      return null;
    });
  });
}
```

NOTE: `fieldContext` parametresi tipik olarak parçalanarak yalnızca kuralın ihtiyaç duyduğu kısımlar çıkarılır. Bu kılavuzdaki kalan örnekler bu kalıbı kullanır.

## Çapraz alan doğrulama kalıpları

Önceki bölümdeki tarih aralığı örneği, bitiş tarihini başlangıç tarihine karşı doğrular. Kural `valueOf(schemaPath.startDate)`'i okuduğu için, tarihlerden herhangi biri değiştiğinde otomatik olarak yeniden değerlendirilir. Başka bir deyişle, hata durumunu doğru tutmak için tek bir doğrulayıcı yeterlidir.

Ancak bu tek doğrulayıcı hatayı yalnızca bitiş tarihi alanına yerleştirir. Aralık geçersiz olduğunda her iki alanın da bir hata göstermesini istiyorsanız, her alana eşleşen bir doğrulama kuralı ekleyin:

```ts
import {Component, signal} from '@angular/core';
import {form, validate} from '@angular/forms/signals';

@Component({/* ... */})
export class EventForm {
  eventModel = signal({
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-05'),
  });

  eventForm = form(this.eventModel, (schemaPath) => {
    validate(schemaPath.startDate, ({value, valueOf}) => {
      if (value() >= valueOf(schemaPath.endDate)) {
        return {
          kind: 'invalidDateRange',
          message: 'Start date must be before end date',
        };
      }
      return null;
    });

    validate(schemaPath.endDate, ({value, valueOf}) => {
      if (value() <= valueOf(schemaPath.startDate)) {
        return {
          kind: 'invalidDateRange',
          message: 'End date must be after start date',
        };
      }
      return null;
    });
  });
}
```

Her iki kural da diğer alanı okumak için `valueOf()`'tan yararlanır. Her kural reaktif olduğundan, tarihlerden herhangi birini değiştirmek her iki doğrulamayı da otomatik olarak yeniden değerlendirir.

NOTE: Bir kural birden fazla alanı içerdiğinde, hatanın nereye ait olduğuna karar vermeniz gerekir: belirli bir alana, birden fazla alana veya üst alana. Genel olarak, hatayı kullanıcının sorunu düzeltmek için büyük olasılıkla gideceği yere yerleştirin.

### Koşullu gereksinimler

Bazı formlarda, belirli alanlar yalnızca belirli koşullar altında zorunludur. Örneğin, bir kayıt formu yalnızca kullanıcı bir kurumsal hesap türü seçtiğinde bir şirket adı isteyebilir:

```ts
import {Component, signal} from '@angular/core';
import {form, required} from '@angular/forms/signals';

@Component({/* ... */})
export class RegistrationForm {
  registrationModel = signal({
    accountType: 'personal' as 'personal' | 'business',
    companyName: '',
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.companyName, {
      when: ({valueOf}) => valueOf(schemaPath.accountType) === 'business',
      message: 'Company name is required for business accounts',
    });
  });
}
```

`when` seçeneği, diğer kural fonksiyonlarıyla aynı alan bağlamını alır, bu nedenle `valueOf` aynı şekilde çalışır. Kullanıcı `'personal'`'a geri döndüğünde, koşul yeniden değerlendirilir ve gereksinim (hatasıyla birlikte) otomatik olarak temizlenir.

`required()`'ı manuel bir `validate()` kontrolü yerine `when` ile kullanmak ayrıca alana uygun zorunluluk meta verisi ekler. Bu, alanı ekran okuyucular için zorunlu olarak işaretlemek gibi erişilebilirlik özelliklerini mümkün kılar.

### Başka bir alanın durumuna göre doğrulama

Şimdiye kadarki örnekler başka bir alanın değerini okumak için `valueOf()` kullanır. Bazen mantığınız bir alanın değeri yerine _durumuna_ bağlıdır: geçerli, dokunulmuş veya kirli olup olmadığı gibi. Bunun için `stateOf()` kullanın.

Örneğin, bir şifre onayı alanı yalnızca kullanıcı şifre alanıyla etkileşime girdikten sonra eşleşmeyi kontrol etmelidir. Kullanıcı henüz şifreye dokunmadıysa, onayda bir uyumsuzluğu işaretlemek erkendir:

```ts
import {Component, signal} from '@angular/core';
import {form, validate} from '@angular/forms/signals';

@Component({/* ... */})
export class PasswordForm {
  passwordModel = signal({
    password: '',
    confirmPassword: '',
  });

  passwordForm = form(this.passwordModel, (schemaPath) => {
    validate(schemaPath.confirmPassword, ({value, valueOf, stateOf}) => {
      if (!stateOf(schemaPath.password).touched()) {
        return null;
      }
      if (value() !== valueOf(schemaPath.password)) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match',
        };
      }
      return null;
    });
  });
}
```

`stateOf()` çağrısı, diğer alanın [alan durumunu](api/forms/signals/FieldState) döndürür ve `invalid()`, `touched()` ile `dirty()` gibi sinyallere erişim sağlar. Bunlar sinyal olduğundan, kural şifre alanının geçerliliği her değiştiğinde yeniden değerlendirilir.

WARNING: Kendi alanınızın doğrulamasına bağlı olan durumu okumamaya dikkat edin, çünkü bu döngüsel bir döngü oluşturur. Örneğin, üst alanın geçerli olup olmadığını kontrol eden bir doğrulayıcı sonsuz bir döngü oluşturur, çünkü üst alanın geçerliliği alt alanlarının geçerliliğine bağlıdır (bu da sizin doğrulayıcınızı içerir).

## validateTree kullanımı {#using-validatetree}

Şimdiye kadarki örnekler tek tek alanları kontrol etmek için `validate()` kullanır. Bazen, mantığı doğası gereği bir gruptaki birden fazla alanla ilgili olan bir grup alanı doğrulamanız ve hataları o gruptaki belirli alt alanlara yönlendirmeniz gerekir. `validateTree`, bu tür senaryolar için idealdir.

Örneğin, bir Sudoku bulmacasında her satır benzersiz sayılar içermelidir. Bu, grup düzeyinde bir kuraldır: tüm satırı kontrol eder, ardından onu ihlal eden belirli hücreleri işaretlersiniz. Bu tür bir doğrulama, tek tek alanlarda `validate` ile temiz bir şekilde ifade edilemez, çünkü her hücrenin diğer her hücreyi bilmesi gerekir.

```ts
import {Component, signal} from '@angular/core';
import {form, validateTree} from '@angular/forms/signals';

@Component({/* ... */})
export class SudokuRow {
  rowModel = signal({
    cell1: 1,
    cell2: 3,
    cell3: 1,
    cell4: 4,
  });

  rowForm = form(this.rowModel, (schemaPath) => {
    validateTree(schemaPath, ({value, fieldTreeOf}) => {
      const row = value();
      const entries = [
        {val: row.cell1, fieldTree: fieldTreeOf(schemaPath.cell1)},
        {val: row.cell2, fieldTree: fieldTreeOf(schemaPath.cell2)},
        {val: row.cell3, fieldTree: fieldTreeOf(schemaPath.cell3)},
        {val: row.cell4, fieldTree: fieldTreeOf(schemaPath.cell4)},
      ];

      const counts = new Map<number, number>();
      for (const {val} of entries) {
        if (val !== 0) {
          counts.set(val, (counts.get(val) ?? 0) + 1);
        }
      }

      const errors = entries
        .filter(({val}) => val !== 0 && (counts.get(val) ?? 0) > 1)
        .map(({val, fieldTree}) => ({
          kind: 'duplicateInRow',
          message: `${val} already appears in this row`,
          fieldTree,
        }));

      return errors.length > 0 ? errors : null;
    });
  });
}
```

Doğrulayıcı üst alanda (satırda) çalışır, tüm hücre değerlerini okur, tekrarları sayar ve tekrarlanan bir sayı içeren her hücre için bir hata döndürür. Her hatadaki `fieldTree` özelliği, Angular'a tam olarak hangi hücrenin hatayı göstermesi gerektiğini söyler. `fieldTree` olmadan, hatalar satırın kendisine uygulanırdı, kullanıcının görmesi gereken yere değil.

`validateTree` bir hata dizisi döndürebildiğinden, tek bir doğrulayıcı aynı anda birden fazla hücreyi işaretleyebilir. Her hata hedefine işaret eden bir `fieldTree` içerir, böylece Angular hataları doğru alanlara yönlendirir.

### validateTree ne zaman, validate ne zaman kullanılır

Hata, başka alanlardan okuma yapsa bile doğrulanan alana ait olduğunda `validate()`'i `valueOf()` ile tercih edin. Şu durumlarda `validateTree`'ye başvurun:

- Doğrulama mantığı doğası gereği bir grup alanla ilgilidir, herhangi bir tek alanla değil
- Doğrulayıcının farklı alt alanları hedefleyen hatalar döndürmesi gerekir

TIP: `validateTree`'ye ve dönüş türüne bir giriş için [Doğrulama kılavuzuna](/guide/forms/signals/validation) bakın.

## Sonraki adımlar

Bu kılavuz alan bağlamı API'sini ve yaygın çapraz alan kalıplarını ele aldı. İlgili Signal Forms kılavuzları hakkında daha fazla bilgi edinmek için şunlara göz atın:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="Doğrulama" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Alan durumu yönetimi" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Özel kontroller" />
</docs-pill-row>
