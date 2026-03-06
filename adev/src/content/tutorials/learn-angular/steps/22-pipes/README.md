# Pipes

Pipe'lar, şablonlarda verileri dönüştürmek için kullanılan fonksiyonlardır. Genel olarak, pipe'lar yan etki oluşturmayan "saf" (pure) fonksiyonlardır. Angular, bileşenlerinizde içe aktarıp kullanabileceğiniz bir dizi faydalı yerleşik pipe'a sahiptir. Ayrıca özel bir pipe da oluşturabilirsiniz.

NOTE: [Detaylı kılavuzda pipe'lar](/guide/templates/pipes) hakkında daha fazla bilgi edinin.

Bu aktivitede, bir pipe'ı içe aktaracak ve şablonda kullanacaksınız.

<hr>

Bir şablonda pipe kullanmak için onu bir interpolasyon ifadesine dahil edin. Şu örneğe bakın:

```angular-ts {highlight:[1,5,6]}
import {UpperCasePipe} from '@angular/common';

@Component({
  ...
  template: `{{ loudMessage | uppercase }}`,
  imports: [UpperCasePipe],
})
export class App {
  loudMessage = 'we think you are doing great!'
}
```

Şimdi bunu deneme sırası sizde:

<docs-workflow>

<docs-step title="`LowerCase` pipe'ını içe aktarın">
Öncelikle, `app.ts` dosyasını `@angular/common` paketinden `LowerCasePipe` için dosya seviyesinde içe aktarma ekleyerek güncelleyin.

```ts
import {LowerCasePipe} from '@angular/common';
```

</docs-step>

<docs-step title="Pipe'ı şablon importlarına ekleyin">
Ardından, `@Component()` dekoratörünün `imports` dizisini `LowerCasePipe` referansını içerecek şekilde güncelleyin.

```ts {highlight:[3]}
@Component({
  ...
  imports: [LowerCasePipe]
})
```

</docs-step>

<docs-step title="Pipe'ı şablona ekleyin">
Son olarak, `app.ts` dosyasındaki şablonu `lowercase` pipe'ını içerecek şekilde güncelleyin:

```angular-html
template: `{{ username | lowercase }}`
```

</docs-step>

</docs-workflow>

Pipe'lar ayrıca çıktılarını yapılandırmak için kullanılabilecek parametreler de kabul edebilir. Bir sonraki aktivitede daha fazlasını öğrenin.

Not: Harika gidiyorsunuz.
