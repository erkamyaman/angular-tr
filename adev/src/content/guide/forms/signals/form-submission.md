# Form gönderimi

Bir kullanıcı bir formu gönderdiğinde, uygulamanızın genellikle aynı anda birden fazla konuyu ele alması gerekir: doğrulama hatalarını gösterme, mükerrer gönderimi önleme, verileri bir sunucuya gönderme ve çok daha fazlası. Bunların her birini manuel olarak ele almak hem yorucu hem de hataya açık olabilir.

Signal Forms, form gönderim yaşam döngüsünü yönetmenize yardımcı olan bir `submit()` fonksiyonu sağlar. Bu kılavuz, onu nasıl kullanacağınızı adım adım anlatır.

## `submit()` ne yapar?

`submit()` fonksiyonu belirli bir sırayı izler:

1. **Etkileşimli alanları dokunulmuş olarak işaretler** - Yalnızca dokunulduktan sonra hata gösteren alanlar artık doğrulama hatalarını gösterir. Gizli, devre dışı ve salt okunur alanlar atlanır.
1. **Doğrulamayı kontrol eder** - Herhangi bir doğrulama kuralı başarısız olduysa, gönderim durur ve `action` fonksiyonu çalışmaz.
1. **Eylemi çalıştırır** - `action` fonksiyonu formun geçerli değeriyle yürütülür. Çalışırken `submitting()` `true` döndürür.
1. **Sonucu ele alır** - Eylem hatalar döndürürse, bunlar hedef alanlarına yönlendirilir. Hiçbir şey döndürmezse, gönderim başarılı kabul edilir.

`submit()` fonksiyonu, eylem hatasız tamamlandığında `true`, doğrulama başarısız olduğunda veya eylem hatalar döndürdüğünde `false` değerine çözümlenen bir `Promise<boolean>` döndürür.

## `FormRoot` ile form gönderimini kurma

`submit()` fonksiyonunu kullanmanın en yaygın yolu `FormRoot` direktifidir.

`FormRoot` direktifi bir `<form>` öğesine bağlandığında üç şeyi otomatik olarak ele alır:

1. **[`novalidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#novalidate) ayarlar** - Tarayıcının yerleşik doğrulamasını devre dışı bırakır, böylece doğrulamayı Signal Forms yönetir
1. **Varsayılanı engeller** - Tarayıcının form gönderiminde gezinmesini durdurur
1. **`submit()` çağırır** - Kullanıcı formu gönderdiğinde gönderim akışını tetikler

NOTE: `FormRoot` direktifi, `form` öğesindeki `novalidate` özniteliğini otomatik olarak ayarlar. `FormRoot` kullanırken bunu manuel olarak eklemeniz gerekmez.

`FormRoot` gönderim olayını ele alır, ancak yine de form verileriyle _ne yapılacağını_ ona söylemeniz gerekir. Bu üç şey gerektirir:

1. Formunuzu `FormRoot` direktifine bağlayın
1. `form()` fonksiyonuna bir `submission` seçeneği geçirin
1. `submission` seçeneği içinde, gönderilen verileri yöneten bir `action` fonksiyonu tanımlayın

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, FormRoot, required} from '@angular/forms/signals';

@Component({
  selector: 'app-contact',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="contactForm">
      <label>
        Name
        <input [formField]="contactForm.name" />
      </label>

      <label>
        Email
        <input type="email" [formField]="contactForm.email" />
      </label>

      <button type="submit">Send</button>
    </form>
  `,
})
export class Contact {
  contactModel = signal({
    name: '',
    email: '',
  });

  contactForm = form(
    this.contactModel,
    (schemaPath) => {
      required(schemaPath.name);
      required(schemaPath.email);
    },
    {
      submission: {
        action: async (field) => {
          const result = await saveContact(field().value());
          if (result.ok) return;

          return {kind: 'serverError', message: 'Failed to submit form'};
        },
      },
    },
  );
}
```

`action` fonksiyonu yalnızca hiçbir doğrulama kuralı başarısız olmadığında çalışır. Varsayılan olarak, beklemedeki asenkron doğrulayıcılar gönderimi engellemez (daha fazla ayrıntı için [Doğrulama kapısını `ignoreValidators` ile kontrol etme](#doğrulama-kapısını-ignorevalidators-ile-kontrol-etme) bölümüne bakın). Eylem, alan ağacını ve `root` ile `submitted` alan ağaçlarını içeren bir `detail` nesnesi alır; bu, bir alt form gönderirken kullanışlıdır.

Doğrulama geçtikten sonra, eylemin kendisi yine de bir ağ hatası veya mükerrer kayıt gibi senaryolar nedeniyle başarısız olabilir. Bu durumlarda, hatayı veya hataları döndürerek başarısızlığı gösterebilirsiniz. Öte yandan, başarıyı belirtmek için yalnızca `null` ya da `undefined` döndürmeniz veya boş bir `return` çağırmanız yeterlidir.

## `submitting()` ile gönderim durumunu gösterme

Formun gönderilme sürecinde olup olmadığını izlemeniz gerektiğinde, Signal Forms, `action` fonksiyonu çalışırken `true` döndüren bir `submitting()` sinyali sağlar. Yükleme göstergelerini görüntülemek veya mükerrer gönderimleri önlemek için gönder düğmesini devre dışı bırakmak için bunu kullanın.

```angular-html
<button type="submit" [disabled]="contactForm().submitting()">
  @if (contactForm().submitting()) {
    Sending...
  } @else {
    Send
  }
</button>
```

`action` fonksiyonu başarılı olduğunda veya bir hata döndürdüğünde, `submitting()` sinyali otomatik olarak `false` değerine geri döner.

## Gönderim hatalarını yönetme

### Sunucu hataları

`action` fonksiyonunuz bir sunucuyla iletişim kurduğunda, sunucu belirli alanlarda görünmesi gereken hatalar döndürebilir. Bu hataları hedef alanlarına yönlendirmek için `action`'dan döndürün.

#### Gönderilen alandaki hatalar

Varsayılan olarak, `action`'dan döndürülen hatalar gönderilen alana (yani `submit()`'e geçirdiğiniz alan ağacına) atanır:

```ts
action: async (field) => {
  const result = await saveContact(field().value());
  if (result.ok) return;

  return {kind: 'serverError', message: 'Failed to submit form'};
};
```

#### Belirli alanlardaki hatalar

Bir hatayı belirli bir alana yönlendirmek istediğinizde, o alanı işaret eden bir `fieldTree` özelliği ekleyin:

```ts
action: async (field) => {
  const result = await saveContact(field().value());
  if (result.ok) return;

  return {kind: 'taken', message: result.message, fieldTree: field.email};
};
```

#### Birden fazla hata

Birden fazla alanda hata bildirmek istediğinizde bir dizi döndürün:

```ts
action: async (field) => {
  const result = await registerUser(field().value());
  if (result.ok) return;

  return result.errors.map((err: {field: string; message: string}) => ({
    kind: 'serverError',
    message: err.message,
    fieldTree: field[err.field as keyof typeof field],
  }));
};
```

### Gönderim hatalarını otomatik temizleme

Gönderim hataları, kullanıcı alanı düzenlediğinde otomatik olarak temizlenir. `action` email alanında bir hata döndürürse, kullanıcı email değerini değiştirdiği anda o hata kaybolur.

Bu, reaktif olarak yeniden hesaplanan doğrulama hatalarından farklıdır. Doğrulama kuralları her değişiklikte yeniden çalışır ve aynı hatayı üretebilir. Gönderim hataları ise sunucudan gelen tek seferlik sonuçlardır; bir kez temizlendiklerinde, form tekrar gönderilmediği sürece yeniden görünmezler.

TIP: Gönderim hataları, alanın `errors()` sinyalinde doğrulama hatalarıyla birlikte görünür. Hataları şablonunuzda görüntüleme konusunda yol gösterici bilgi için [Alan durumu yönetimi kılavuzuna](guide/forms/signals/field-state-management) bakın.

## Geçersiz gönderimleri `onInvalid` ile ele alma

Doğrulama başarısız olduğunda, `action` fonksiyonu çalışmaz. Başarısız bir gönderim girişimine yanıt vermeniz gerekiyorsa (örneğin ilk hataya kaydırma, bir bildirim gösterme veya geçersiz bir alana odaklanma gibi), `onInvalid` geri çağırmasını kullanın.

```ts
contactForm = form(
  this.contactModel,
  (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
  },
  {
    submission: {
      action: async (field) => {
        await saveContact(field().value());
      },
      onInvalid: (field) => {
        const firstError = field().errorSummary()[0];
        firstError?.fieldTree().focusBoundControl();
      },
    },
  },
);
```

`onInvalid` geri çağırması, `action` ile aynı `(field, detail)` parametrelerini alır. Tüm etkileşimli alanlar dokunulmuş olarak işaretlendikten sonra çalışır, bu nedenle yürütüldüğünde doğrulama hataları kullanıcı arayüzünde zaten görünür durumdadır.

## Doğrulama kapısını `ignoreValidators` ile kontrol etme

Varsayılan olarak, `submit()` beklemedeki doğrulayıcıları yok sayar. Hiçbir doğrulayıcı başarısız olmadıysa, bazı asenkron doğrulayıcılar hâlâ devam ediyor olsa bile eylem çalışır. `ignoreValidators` seçeneği size bu davranış üzerinde kontrol sağlar.

| Değer       | Davranış                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------ |
| `'pending'` | Hiçbir doğrulayıcı başarısız olmadıysa, bazıları beklemede olsa bile gönder (varsayılan)   |
| `'none'`    | Yalnızca tüm doğrulayıcılar geçerse gönder - beklemedeki doğrulayıcılar gönderimi engeller |
| `'all'`     | Doğrulama durumundan bağımsız olarak her zaman gönder                                      |

```ts
contactForm = form(
  this.contactModel,
  (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
  },
  {
    submission: {
      action: async (field) => {
        await saveContact(field().value());
      },
      ignoreValidators: 'none',
    },
  },
);
```

Formunuzda asenkron doğrulayıcılar (kullanıcı adı uygunluğunu kontrol etmek gibi) olduğunda ve göndermeden önce tüm doğrulamanın tamamlanması gerektiğinde `'none'` kullanın. Doğrulama durumundan bağımsız olarak verileri kalıcı hale getirmek istediğiniz taslak kaydetme senaryoları için `'all'` kullanın.

## `submit()` ile manuel gönderim

`FormRoot` direktifi gönderimi tetiklemenin en yaygın yoludur, ancak `submit()`'i doğrudan da çağırabilirsiniz. Bu, çok adımlı sihirbazlar, otomatik kaydetme veya gönderimi form öğesinin dışından tetikleme durumlarında kullanışlıdır.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, submit} from '@angular/forms/signals';

@Component({
  selector: 'app-contact',
  imports: [FormField],
  template: `
    <label>
      Name
      <input [formField]="contactForm.name" />
    </label>

    <label>
      Email
      <input type="email" [formField]="contactForm.email" />
    </label>

    <button (click)="onSave()">Save</button>
  `,
})
export class Contact {
  contactModel = signal({
    name: '',
    email: '',
  });

  contactForm = form(this.contactModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
  });

  async onSave() {
    // `submit()`'i doğrudan çağırırken, eylemi `FormOptions` içinde
    // yapılandırmak yerine ikinci argüman olarak geçirirsiniz.
    const success = await submit(this.contactForm, async (field) => {
      const result = await saveContact(field().value());
      if (result.ok) return;

      return {kind: 'serverError', message: 'Failed to save'};
    });

    if (success) {
      // Başarıyı ele al - gezin, onay göster vb.
    }
  }
}
```

## Yan etkileri ele alma

`submit()` fonksiyonu bir `Promise<boolean>` döndürür: eylem hatasız tamamlandığında `true`, doğrulama başarısız olduğunda veya eylem hatalar döndürdüğünde `false`. Gezinme veya bildirimler gibi yan etkileri tetiklemek için bunu kullanın.

```ts
async onSave() {
  const success = await submit(this.contactForm, async (field) => {
    await saveContact(field().value());
  });

  if (success) {
    await this.router.navigate(['/confirmation']);
  }
}
```

Eylem, bir yan etkinin ihtiyaç duyduğu verileri (örneğin sunucu tarafından üretilen bir kimlik gibi) ürettiğinde, yan etkiyi eylemin içinde ele alın:

```ts
async onSave() {
  await submit(this.contactForm, async (field) => {
    const contact = await createContact(field().value());
    await this.router.navigate(['/confirmation', contact.id]);
  });
}
```

`FormRoot` kullanırken, `FormRoot` `submit()`'i dahili olarak çağırdığından, yan etkiler de `action`'ın içine girer:

```ts
submission: {
  action: async (field) => {
    const result = await saveContact(field().value());
    if (result.ok) {
      await this.router.navigate(['/confirmation']);
      return;
    }

    return {kind: 'serverError', message: 'Failed to submit form'};
  },
}
```

## Eşzamanlı gönderimler

Bir gönderim devam ederken, aynı form veya üst formlarından herhangi biri için yapılan sonraki `submit()` çağrıları eylemi çalıştırmadan hemen `false` döndürür. Bu, bir kullanıcı gönderim eylemini kısa süre içinde birden çok kez tetiklerse mükerrer gönderimleri ve yan etkileri önler.

## Sonraki adımlar

Bu kılavuz, formları gönderme ve form gönderim hatalarını ele almayı kapsadı. İlgili kılavuzlar, Signal Forms'un diğer yönlerini inceler:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="Doğrulama" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Alan durumu yönetimi" />
  <docs-pill href="guide/forms/signals/form-logic" title="Form mantığı ekleme" />
</docs-pill-row>
