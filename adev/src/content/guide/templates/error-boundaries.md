# `@boundary` ile hata sınırları

IMPORTANT: `@boundary` [geliştirici önizlemesindedir](reference/releases#geliştirici-önizlemesi).

Angular şablonları, render etme ve değişiklik algılama sırasında oluşan çalışma zamanı hatalarını zarif bir şekilde ele almak için hata sınırlarını destekler.

Hata sınırları, tek bir bileşenin başarısız olmasının tüm uygulamayı çökertmesini önler ve kullanıcıya yedek bir arayüz göstermenin bir yolunu sunar.

## `@boundary` ve `@error` ile hataları yakalama {#catching-errors-with-boundary-and-error}

`@boundary` bloğu şablonunuzun bir bölümünü sarar. Bu sınırın içindeki herhangi bir bileşen veya direktif, başlatma ya da değişiklik algılama sırasında bir hata fırlatırsa, framework hatayı yakalar ve bunun yerine `@error` bloğunu render eder.

```angular-html
@boundary {
  <app-risky-component />
} @error {
  <p>Something went wrong!</p>
}
```

## Hata nesnesine erişme {#accessing-the-error-object}

Yakalanan hataya örtük `$error` değişkeni üzerinden erişebilirsiniz:

```angular-html
@boundary {
  <app-risky-component />
} @error {
  <p>Error occurred: {{ $error.message }}</p>
}
```

## Sınırı sıfırlama {#resetting-the-boundary}

`@error` bloğunda örtük `$reset` fonksiyonunu çağırarak `@boundary` içeriğini yeniden render etmeyi deneyebilirsiniz. Bu fonksiyon çağrıldığında sınırın durumunu sıfırlar ve orijinal içeriği yeniden render etmeye çalışır.

```angular-html
@boundary {
  <app-flaky-component />
} @error {
  <p>Loading failed.</p>
  <button (click)="$reset()">Try again</button>
}
```

## `when` ile koşullu hata yönetimi {#conditional-error-handling-with-when}

Belirli hata türlerini koşullu olarak ele almak ve böylece farklı yedek arayüzler sunmak için `when` ifadelerini kullanabilirsiniz. Angular bu koşulu bir hata yakaladığında değerlendirir.

```angular-html
@boundary {
  <app-chart-dashboard />
} @error (let err; reset = $reset; when isRenderError(err)) {
  <p>Network issue. Check your connection.</p>
  <button (click)="reset()">Retry</button>
} @error {
  <p>An unexpected error occurred: {{ $error.message }}</p>
}
```

`@error` bloklarınızı en özelden en genele doğru sıralayın, çünkü Angular `when` ifadelerini sırayla değerlendirir ve true olarak değerlendirilen ilk bloğu kullanır. `when` ifadesi olmayan son bir `@error` bloğu, her şeyi yakalayan bir yedek görevi görür.

## Global hata işleyici entegrasyonu {#global-error-handler-integration}

Bir sınır bir hata yakaladığında, Angular global `ErrorHandler`'ı yine de bilgilendirebilir. Yakalanan bu hataları hata izleme servisinize kaydetmek için özel `ErrorHandler`'ınızda isteğe bağlı `onViewError` kancasını uygulayabilirsiniz.

```ts
@Injectable()
export class MyErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Yakalanmamış hataları ele al
  }

  onViewError(error: Error, details: ErrorDetails): void {
    // Bir @boundary tarafından yakalanan hataları ele al
    console.warn('Caught by boundary:', details.boundary);
    myErrorTrackingService.log(error);
  }
}
```

IMPORTANT: Bir `@error` bloğunun kendisi bir hata fırlatırsa, hata bir üstteki `@boundary`'ye iletilir ya da Angular bunu ele alınmamış bir uygulama hatası olarak değerlendirir.

## İçerik yansıtma {#content-projection}

Bileşeniniz [içerik yansıtma](guide/components/content-projection) kullanıyorsa, `<ng-content>`'i bir `@boundary` ile sarmak yansıtılan içerikten gelen hataları yakalamaz. Bu içerik, onu alan bileşenin görünümüne değil, onu bildiren görünüme aittir.

Örneğin, aşağıdaki şablona sahip bir sarmalayıcı bileşen, içine yansıtılan bileşenlerden gelen hataları yakalamaz:

```angular-html {avoid}
@boundary {
  <ng-content />
} @error {
  <p>Something went wrong!</p>
}
```

Bu hataları yakalamak için, üst şablonda sarmalayıcı bileşeni ve yansıtılan içeriğini bir `@boundary` ile sarın:

```angular-html {prefer}
@boundary {
  <app-wrapper>
    <app-risky-component />
  </app-wrapper>
} @error {
  <p>Something went wrong!</p>
}
```

## Dinamik görünümler ve programatik hata yönetimi {#dynamic-views-and-programmatic-error-handling}

Hata yönetimi şablon sözdizimiyle sınırlı değildir. Bileşenleri veya gömülü görünümleri dinamik olarak oluşturuyorsanız, hataları ele almak için `onError` seçeneğini kullanabilirsiniz. Daha fazla bilgi için programatik render etme kılavuzundaki [Render etme hatalarını ele alma](guide/components/programmatic-rendering#handling-rendering-errors) bölümüne bakın.
