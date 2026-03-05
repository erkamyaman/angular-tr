# Async operations

Bazı doğrulama işlemleri, backend API'leri veya üçüncü taraf hizmetler gibi harici kaynaklardan veri gerektirir. Signal Forms, asenkron doğrulama için iki fonksiyon sağlar: HTTP tabanlı doğrulama için `validateHttp()` ve özel kaynak tabanlı doğrulama için `validateAsync()`.

## When to use async validation

Doğrulama mantığınız harici veri gerektirdiğinde asenkron doğrulama kullanın. Bazı yaygın örnekler şunlardır:

- **Benzersizlik kontrolleri** - Kullanıcı adlarının veya e-postaların zaten mevcut olmadığını doğrulama
- **Veritabanı aramaları** - Değerleri sunucu tarafı verileriyle karşılaştırma
- **Harici API doğrulaması** - Adresleri, vergi numaralarını veya diğer verileri üçüncü taraf hizmetlerle doğrulama
- **Sunucu tarafı iş kuralları** - Yalnızca sunucunun doğrulayabileceği doğrulama kurallarını uygulama

İstemcide senkron olarak gerçekleştirebileceğiniz kontroller için asenkron doğrulama kullanmayın. Format doğrulaması ve statik kurallar için `pattern()`, `email()` veya `validate()` gibi senkron doğrulama kurallarını kullanın.

## How async validation works

Asenkron doğrulama, yalnızca tüm senkron doğrulama geçtikten sonra çalışır. Doğrulama yürütülürken, alanın `pending()` sinyali `true` döndürür. Doğrulama, hataları belirli alanlara hedefleyebilir ve bekleyen istekler alan değerleri değiştiğinde otomatik olarak iptal edilir.

İşte kullanıcı adı uygunluğunu kontrol eden bir örnek:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, validateHttp, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form>
      <label>
        Username:
        <input [formField]="registrationForm.username" />
      </label>

      @if (registrationForm.username().pending()) {
        <span class="checking">Checking availability...</span>
      }
      @if (registrationForm.username().invalid()) {
        @for (error of registrationForm.username().errors(); track $index) {
          <span class="error">{{ error.message }}</span>
        }
      }
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateHttp(schemaPath.username, {
      request: ({value}) => {
        const username = value();
        return username ? `/api/users/check?username=${username}` : undefined;
      },
      onSuccess: (response) => {
        return response.available
          ? null
          : {
              kind: 'usernameTaken',
              message: 'Username is already taken',
            };
      },
      onError: (error) => {
        console.error('Validation request failed:', error);
        return {
          kind: 'serverError',
          message: 'Could not verify username availability',
        };
      },
    });
  });
}
```

Doğrulama akışı şu şekilde çalışır:

1. Kullanıcı bir değer yazar
2. Önce senkron doğrulama kuralları çalışır
3. Senkron doğrulama başarısız olursa, asenkron doğrulama çalışmaz
4. Senkron doğrulama başarılı olursa, asenkron doğrulama başlar ve `pending()` `true` olur
5. İstek tamamlanır ve `pending()` `false` olur
6. Hatalar yanıta göre güncellenir

## HTTP validation with validateHttp()

`validateHttp()` fonksiyonu, asenkron doğrulamanın en yaygın biçimini sağlar. Bir REST API veya herhangi bir HTTP uç noktasına karşı doğrulama yapmanız gerektiğinde kullanın.

### Request function

`request` fonksiyonu bir URL dizesi veya bir `HttpResourceRequest` nesnesi döndürür. Doğrulamayı atlamak için `undefined` döndürün:

```ts
import {Component, signal} from '@angular/core';
import {form, validateHttp, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `...`,
})
export class Registration {
  registrationModel = signal({username: ''});

  // Cache usernames that passed validation
  private validatedUsernames = new Set<string>();

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateHttp(schemaPath.username, {
      request: ({value}) => {
        const username = value();
        // Skip HTTP request if already validated
        if (this.validatedUsernames.has(username)) return undefined;

        return `/api/users/check?username=${username}`;
      },
      onSuccess: (response, {value}) => {
        if (response.available) {
          // Cache successful validations
          this.validatedUsernames.add(value());
          return null;
        }
        return {
          kind: 'usernameTaken',
          message: 'Username is already taken',
        };
      },
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username',
      }),
    });
  });
}
```

POST istekleri veya özel başlıklar için bir `HttpResourceRequest` nesnesi döndürün:

```ts
request: ({value}) => ({
  url: '/api/validate',
  method: 'POST',
  body: {username: value()},
}) // prettier-ignore
```

### Success and error handlers

`onSuccess` fonksiyonu HTTP yanıtını alır ve doğrulama hataları veya geçerli değerler için `undefined` döndürür:

```ts
onSuccess: (response) => {
  if (response.valid) return undefined;

  return {
    kind: 'invalid',
    message: response.message || 'Validation failed',
  };
} // prettier-ignore
```

Gerektiğinde birden fazla hata döndürün:

```ts
onSuccess: (response) => {
  const errors = [];
  if (response.usernameTaken) {
    errors.push({
      kind: 'usernameTaken',
      message: 'Username taken',
    });
  }
  if (response.profanity) {
    errors.push({
      kind: 'profanity',
      message: 'Username contains inappropriate content',
    });
  }
  return errors.length > 0 ? errors : undefined;
} // prettier-ignore
```

`onError` fonksiyonu ağ hataları veya HTTP hataları gibi istek başarısızlıklarını ele alır:

```ts
onError: (error) => {
  console.error('Validation request failed:', error);
  return {
    kind: 'serverError',
    message: 'Could not verify. Please try again later.',
  };
} // prettier-ignore
```

### HTTP options

HTTP isteğini `options` parametresiyle özelleştirin:

```ts
import {HttpHeaders} from '@angular/common/http';

validateHttp(schemaPath.field, {
  request: ({value}) => `/api/validate?value=${value()}`,
  options: {
    headers: new HttpHeaders({
      Authorization: 'Bearer token',
    }),
    timeout: 5000,
  },
  onSuccess: (response) =>
    response.valid
      ? null
      : {
          kind: 'invalid',
          message: 'Invalid value',
        },
  onError: () => ({
    kind: 'requestFailed',
    message: 'Unable to reach server to validate.',
  }),
});
```

TIP: Mevcut tüm seçenekler için [httpResource API dokümantasyonuna](api/common/http/httpResource) bakın.

## Custom async validation with validateAsync()

Çoğu uygulama asenkron doğrulama için `validateHttp()` kullanmalıdır. HTTP isteklerini minimum yapılandırmayla ele alır ve kullanım durumlarının büyük çoğunluğunu kapsar.

`validateAsync()`, Angular'ın resource temel yapısını doğrudan ortaya çıkaran daha düşük seviyeli bir API'dir. Tam kontrol sunar ancak daha fazla kod ve Angular'ın resource API'si hakkında bilgi gerektirir.

`validateAsync()` kullanmayı yalnızca `validateHttp()` ihtiyaçlarınızı karşılayamadığında düşünün. Bazı örnekler şunlardır:

- **HTTP olmayan doğrulama** - WebSocket bağlantıları, IndexedDB aramaları veya Web Worker hesaplamaları
- **Özel önbellek stratejileri** - Basit memoizasyonun ötesinde uygulamaya özgü önbellekleme
- **Karmaşık yeniden deneme mantığı** - Özel geri çekilme stratejileri veya koşullu yeniden denemeler
- **Doğrudan kaynak erişimi** - Tam kaynak yaşam döngüsüne ihtiyaç duyduğunuzda

### Creating a custom validation rule

`validateAsync()` fonksiyonu dört özellik gerektirir: `params`, `factory`, `onSuccess` ve `onError`. `params` fonksiyonu kaynağınız için parametreleri döndürürken, `factory` kaynağı oluşturur:

```ts
import {Component, inject, signal, resource, Signal} from '@angular/core';
import {form, validateAsync, FormField} from '@angular/forms/signals';
import {UsernameValidator} from './username-validator';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `...`,
})
export class Registration {
  registrationModel = signal({username: ''});

  private usernameValidator = inject(UsernameValidator);
  private cache = new Map<string, {available: boolean}>();

  // Custom resource factory with caching
  createUsernameResource = (usernameSignal: Signal<string | undefined>) => {
    return resource({
      params: () => usernameSignal(),
      loader: async ({params: username}) => {
        if (!username) return undefined;

        // Check cache first
        const cached = this.cache.get(username);
        if (cached !== undefined) return cached;

        // Use injected service for validation
        const result = await this.usernameValidator.checkAvailability(username);

        // Cache result
        this.cache.set(username, result);
        return result;
      },
    });
  };

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => {
        const username = value();
        return username.length >= 3 ? username : undefined;
      },
      factory: this.createUsernameResource,
      onSuccess: (result) => {
        return result?.available
          ? null
          : {
              kind: 'usernameTaken',
              message: 'Username taken',
            };
      },
      onError: (error) => {
        console.error('Validation failed:', error);
        return {
          kind: 'serverError',
          message: 'Could not verify username',
        };
      },
    });
  });
}
```

`params` fonksiyonu her değer değişikliğinde çalışır. Doğrulamayı atlamak için `undefined` döndürün. `factory` fonksiyonu kurulum sırasında bir kez çalışır ve parametreleri sinyal olarak alır. Kaynak, parametreler değiştiğinde otomatik olarak güncellenir.

### Using Observable-based services

Uygulamanızda Observable döndüren mevcut hizmetler varsa, `@angular/core/rxjs-interop`'tan `rxResource` kullanın:

```ts
import {Component, inject, signal, Signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {form, validateAsync, FormField} from '@angular/forms/signals';
import {UsernameService} from './username-service';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `...`,
})
export class Registration {
  registrationModel = signal({username: ''});

  private usernameService = inject(UsernameService);

  private createUsernameResource = (usernameSignal: Signal<string | undefined>) => {
    return rxResource({
      request: () => usernameSignal(),
      stream: ({request: username}) => this.usernameService.checkUsername(username),
    });
  };

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => value() || undefined,
      factory: this.createUsernameResource,
      onSuccess: (result) =>
        result?.available ? null : {kind: 'usernameTaken', message: 'Username taken'},
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username',
      }),
    });
  });
}
```

`rxResource` fonksiyonu doğrudan Observable'larla çalışır ve alan değeri değiştiğinde abonelik temizliğini otomatik olarak yönetir.

## Understanding pending state

Asenkron doğrulama çalışırken, alanın `pending()` sinyali `true` döndürür. Bu süre zarfında:

- `valid()` `false` döndürür
- `invalid()` `false` döndürür
- `errors()` boş bir dizi döndürür
- `submit()` doğrulamanın tamamlanmasını bekler

Geri bildirim sağlamak için bekleyen durumu şablonunuzda gösterin:

```angular-html
<input [formField]="loginForm.username" />

@if (loginForm.username().pending()) {
  <span class="loading">Checking availability...</span>
}

@if (loginForm.username().touched() && loginForm.username().invalid()) {
  @for (error of loginForm.username().errors(); track $index) {
    <span class="error">{{ error.message }}</span>
  }
}
```

Doğrulama beklemedeyken form gönderimini devre dışı bırakın:

```angular-html
<button type="submit" [disabled]="loginForm().pending()">
  @if (loginForm().pending()) {
    Validating...
  } @else {
    Submit
  }
</button>
```

TIP: `pending()`, `valid()` ve `invalid()` sinyallerini kullanan daha fazla kalıp için [Alan Durumu Yönetimi kılavuzuna](guide/forms/signals/field-state-management) bakın.

### Validation execution order

Asenkron doğrulama yalnızca senkron doğrulama geçtikten sonra çalışır. Bu, geçersiz girdi için gereksiz sunucu isteklerini önler:

```ts
import {form, required, minLength, validateHttp} from '@angular/forms/signals';

form(model, (schemaPath) => {
  // 1. These synchronous validation rules run first
  required(schemaPath.username);
  minLength(schemaPath.username, 3);

  // 2. This async validation rule only runs if synchronous validation passes
  validateHttp(schemaPath.username, {
    request: ({value}) => `/api/check?username=${value()}`,
    onSuccess: (result) =>
      result.valid
        ? null
        : {
            kind: 'usernameTaken',
            message: 'Username taken',
          },
    onError: () => ({
      kind: 'serverError',
      message: 'Validation failed',
    }),
  });
});
```

Bu yürütme sırası, sunucu yükünü azaltarak ve format hatalarını anında yakalayarak performansı artırır.

### Request cancellation

Bir alan değeri değiştiğinde, Signal Forms o alan için bekleyen asenkron doğrulama isteğini otomatik olarak iptal eder. Bu, yarış koşullarını önler ve doğrulamanın her zaman mevcut değeri yansıtmasını sağlar. İptal mantığını kendiniz uygulamanız gerekmez.

## Best practices

### Combine with synchronous validation

Asenkron istekler yapmadan önce her zaman formatı doğrulayın. Bu, hataları anında yakalar ve gereksiz sunucu isteklerini önler:

```ts
import {form, required, email, validateHttp} from '@angular/forms/signals';

form(model, (schemaPath) => {
  // Validate format first
  required(schemaPath.email);
  email(schemaPath.email);

  // Then check availability
  validateHttp(schemaPath.email, {
    request: ({value}) => `/api/emails/check?email=${value()}`,
    onSuccess: (result) =>
      result.available
        ? null
        : {
            kind: 'emailInUse',
            message: 'Email already in use',
          },
    onError: () => ({
      kind: 'serverError',
      message: 'Could not verify email',
    }),
  });
});
```

### Skip validation when appropriate

Doğrulamayı atlamak için `request` fonksiyonundan `undefined` döndürün. Boş alanları veya minimum gereksinimleri karşılamayan değerleri doğrulamaktan kaçınmak için bunu kullanın:

```ts
import {validateHttp} from '@angular/forms/signals';

validateHttp(schemaPath.username, {
  request: ({value}) => {
    const username = value();
    // Skip validation for empty or short usernames
    if (!username || username.length < 3) return undefined;

    return `/api/users/check?username=${username}`;
  },
  onSuccess: (result) =>
    result.valid
      ? null
      : {
          kind: 'usernameTaken',
          message: 'Username taken',
        },
  onError: () => ({
    kind: 'serverError',
    message: 'Validation failed',
  }),
});
```

### Handle errors gracefully

Açık, kullanıcı dostu hata mesajları sağlayın. Hata ayıklama için teknik ayrıntıları günlüğe kaydedin ancak kullanıcılara basit mesajlar gösterin:

```ts
import {validateHttp} from '@angular/forms/signals';

validateHttp(schemaPath.field, {
  request: ({value}) => `/api/validate?field=${value()}`,
  onSuccess: (result) => {
    if (result.valid) return null;
    // Use server message when available
    return {
      kind: 'serverError',
      message: result.message || 'Validation failed',
    };
  },
  onError: (error) => {
    // Log for debugging
    console.error('Validation request failed:', error);

    // Show user-friendly message
    return {
      kind: 'serverError',
      message: 'Unable to validate. Please try again later.',
    };
  },
});
```

### Show clear feedback

Doğrulamanın ne zaman gerçekleştiğini göstermek için `pending()` sinyalini kullanın. Bu, kullanıcıların gecikmeleri anlamasına yardımcı olur ve daha iyi algılanan performans sağlar:

```angular-html
@if (field().pending()) {
  <span class="checking">
    <span class="spinner"></span>
    Checking...
  </span>
}
@if (field().valid() && !field().pending()) {
  <span class="success">Available</span>
}
@if (field().invalid()) {
  <span class="error">{{ field().errors()[0]?.message }}</span>
}
```

## Next steps

Bu kılavuz `validateHttp()` ve `validateAsync()` ile asenkron doğrulamayı ele aldı. İlgili kılavuzlar Signal Forms'un diğer yönlerini inceler:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="Validation"/>
  <docs-pill href="guide/forms/signals/field-state-management" title="Field State Management"/>
</docs-pill-row>

Ayrıntılı API dokümantasyonu için şunlara bakın:

- [`validateHttp()`](api/forms/signals/validateHttp) - HTTP tabanlı asenkron doğrulama
- [`validateAsync()`](api/forms/signals/validateAsync) - Özel kaynak tabanlı asenkron doğrulama
- [`httpResource()`](api/common/http/httpResource) - Angular'ın HTTP kaynak API'si
- [`resource()`](api/core/resource) - Angular'ın resource temel yapısı
