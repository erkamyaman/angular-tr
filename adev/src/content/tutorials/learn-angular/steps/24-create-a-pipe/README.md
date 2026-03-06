# Özel pipe oluşturma

Veri dönüştürme ihtiyaçlarınıza uygun özel pipe'lar oluşturabilirsiniz.

NOTE: [Detaylı kılavuzda özel pipe oluşturma](/guide/templates/pipes#özel-pipelar-oluşturma) hakkında daha fazla bilgi edinin.

Bu aktivitede, özel bir pipe oluşturacak ve şablonunuzda kullanacaksınız.

<hr>

Bir pipe, `@Pipe` dekoratörüne sahip bir TypeScript sınıfıdır. İşte bir örnek:

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'star',
})
export class StarPipe implements PipeTransform {
  transform(value: string): string {
    return `⭐️ ${value} ⭐️`;
  }
}
```

`StarPipe` bir string değer kabul eder ve o string'i etrafına yıldızlar ekleyerek döndürür. Şunlara dikkat edin:

- `@Pipe` dekoratör yapılandırmasındaki name, şablonda kullanılacak olan addır
- `transform` fonksiyonu, mantığınızı koyacağınız yerdir

Pekala, deneme sırası sizde - `ReversePipe`'ı oluşturacaksınız:

<docs-workflow>

<docs-step title="`ReversePipe`'ı oluşturun">

`reverse.pipe.ts` dosyasında `ReversePipe` sınıfına `@Pipe` dekoratörünü ekleyin ve aşağıdaki yapılandırmayı sağlayın:

```ts
@Pipe({
  name: 'reverse'
})
```

</docs-step>

<docs-step title="`transform` fonksiyonunu uygulayın">

Artık `ReversePipe` sınıfı bir pipe. Ters çevirme mantığını eklemek için `transform` fonksiyonunu güncelleyin:

```ts {highlight:[3,4,5,6,7,8,9]}
export class ReversePipe implements PipeTransform {
  transform(value: string): string {
    let reverse = '';

    for (let i = value.length - 1; i >= 0; i--) {
      reverse += value[i];
    }

    return reverse;
  }
}
```

</docs-step>

<docs-step title="Şablonda `ReversePipe`'ı kullanın"></docs-step>
Pipe mantığı uygulandığına göre, son adım onu şablonda kullanmaktır. `app.ts` dosyasında pipe'ı şablona dahil edin ve bileşen imports dizisine ekleyin:

```angular-ts {highlight:[3,4]}
@Component({
  ...
  template: `Reverse Machine: {{ word | reverse }}`
  imports: [ReversePipe]
})
```

</docs-workflow>

Ve bununla birlikte başardınız. Bu aktiviteyi tamamladığınız için tebrikler. Artık pipe'ları nasıl kullanacağınızı ve hatta kendi özel pipe'larınızı nasıl oluşturacağınızı biliyorsunuz.
