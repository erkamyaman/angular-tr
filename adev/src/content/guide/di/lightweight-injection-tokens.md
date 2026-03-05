# Optimizing client application size with lightweight injection tokens

Bu sayfa, kütüphane geliştiricileri için önerilen bir bağımlılık enjeksiyonu tekniğinin kavramsal bir genel bakışını sağlar.
Kütüphanenizi _hafif enjeksiyon token'ları_ ile tasarlamak, kütüphanenizi kullanan istemci uygulamalarının paket boyutunu optimize etmeye yardımcı olur.

Tree-shakeable sağlayıcılar kullanarak bileşenleriniz ve enjekte edilebilir servisleriniz arasındaki bağımlılık yapısını yönetip paket boyutunu optimize edebilirsiniz.
Bu normalde, sağlanan bir bileşen veya servis uygulama tarafından hiçbir zaman gerçekten kullanılmıyorsa, derleyicinin kodunu paketten kaldırabilmesini sağlar.

Angular'ın enjeksiyon token'larını saklama şekli nedeniyle, böyle kullanılmayan bir bileşen veya servis yine de pakete dahil olabilir.
Bu sayfa, hafif enjeksiyon token'ları kullanarak uygun tree-shaking'i destekleyen bir bağımlılık enjeksiyonu tasarım deseni tanımlar.

Hafif enjeksiyon token'ı tasarım deseni özellikle kütüphane geliştiricileri için önemlidir.
Bir uygulama kütüphanenizin yalnızca bazı yeteneklerini kullandığında, kullanılmayan kodun istemci uygulamasının paketinden çıkarılabilmesini sağlar.

Bir uygulama kütüphanenizi kullandığında, kütüphanenizin sağladığı bazı servisler istemci uygulaması tarafından kullanılmayabilir.
Bu durumda, uygulama geliştiricisi bu servisin tree-shaken edilmesini ve derlenmiş uygulamanın boyutuna katkıda bulunmamasını bekler.
Uygulama geliştiricisi kütüphanedeki bir tree-shaking sorunu hakkında bilgi sahibi olamayacağı veya düzeltemeyeceği için, bunu yapmak kütüphane geliştiricisinin sorumluluğundadır.
Kullanılmayan bileşenlerin tutulmasını önlemek için, kütüphaneniz hafif enjeksiyon token'ı tasarım desenini kullanmalıdır.

## When tokens are retained

Token tutulmasının hangi koşullarda gerçekleştiğini daha iyi açıklamak için, bir library-card bileşeni sağlayan bir kütüphane düşünün.
Bu bileşen bir gövde içerir ve isteğe bağlı bir başlık içerebilir:

```html
<lib-card>
  <lib-header>…</lib-header>
</lib-card>
```

Muhtemel bir uygulamada, `<lib-card>` bileşeni `<lib-header>` ve `<lib-body>` almak için `contentChild` veya `contentChildren` kullanır, aşağıdaki gibi:

```ts {highlight: [14]}
import {Component, contentChild} from '@angular/core';

@Component({
  selector: 'lib-header',
  …,
})
class LibHeader {}

@Component({
  selector: 'lib-card',
  …,
})
class LibCard {
  readonly header = contentChild(LibHeader);
}
```

`<lib-header>` isteğe bağlı olduğundan, eleman şablonda minimal formunda `<lib-card />` olarak görünebilir.
Bu durumda, `<lib-header>` kullanılmaz ve tree-shaken edilmesini beklersiniz, ancak olan bu değildir.
Bunun nedeni, `LibCard`'ın aslında `LibHeader`'a iki referans içermesidir:

```ts
readonly header = contentChild(LibHeader);
```

- Bu referanslardan biri _tür konumundadır_ -- yani, `LibHeader`'ı bir tür olarak belirtir: `readonly header: Signal<LibHeader|undefined>`.
- Diğer referans _değer konumundadır_ -- yani, `LibHeader`, `contentChild` fonksiyonuna iletilen değerdir: `contentChild(LibHeader)`.

Derleyici, bu konumlardaki token referanslarını farklı şekilde ele alır:

- Derleyici, TypeScript'ten dönüştürme sonrası _tür konumundaki_ referansları siler, bu nedenle tree-shaking üzerinde etkisi yoktur.
- Derleyici, _değer konumundaki_ referansları çalışma zamanında tutmalıdır, bu da bileşenin tree-shaken edilmesini **engeller**.

Örnekte, derleyici değer konumunda oluşan `LibHeader` token'ını tutar.
Bu, uygulama aslında hiçbir yerde `<lib-header>` kullanmasa bile referans verilen bileşenin tree-shaken edilmesini engeller.
`LibHeader`'ın kodu, şablonu ve stilleri birleşerek çok büyükse, gereksiz yere dahil etmek istemci uygulamasının boyutunu önemli ölçüde artırabilir.

## When to use the lightweight injection token pattern

Tree-shaking sorunu, bir bileşen enjeksiyon token'ı olarak kullanıldığında ortaya çıkar.
Bunun gerçekleşebileceği iki durum vardır:

- Token, bir [içerik sorgusunun](guide/components/queries#content-queries) değer konumunda kullanılır.
- Token, `inject` fonksiyonu ile kullanılır.

Aşağıdaki örnekte, `CustomOther` token'ının her iki kullanımı da `CustomOther`'ın tutulmasına neden olur ve kullanılmadığında tree-shaken edilmesini engeller:

```ts {highlight: [[2],[4]]}
class App {
  private readonly other = inject(CustomOther, {optional: true});

  readonly header = contentChild(CustomOther);
}
```

Yalnızca tür belirleyici olarak kullanılan token'lar JavaScript'e dönüştürülürken kaldırılsa da, bağımlılık enjeksiyonu için kullanılan tüm token'lar çalışma zamanında gereklidir.
`inject(CustomOther)` kullanıldığında, `CustomOther` bir değer argümanı olarak iletilir.
Token artık bir değer konumundadır, bu da tree-shaker'ın referansı tutmasına neden olur.

HELPFUL: Kütüphaneler tüm servisler için [tree-shakeable sağlayıcılar](guide/di/defining-dependency-providers) kullanmalı ve bağımlılıkları bileşenler veya modüller yerine root seviyesinde sağlamalıdır.

## Using lightweight injection tokens

Hafif enjeksiyon token'ı tasarım deseni, enjeksiyon token'ı olarak küçük bir soyut sınıf kullanmaktan ve gerçek uygulamayı daha sonraki bir aşamada sağlamaktan oluşur.
Soyut sınıf tutulur, tree-shaken edilmez, ancak küçüktür ve uygulama boyutu üzerinde maddi bir etkisi yoktur.

Aşağıdaki örnek, bunun `LibHeader` için nasıl çalıştığını gösterir:

```ts {highlight: [[1],[5], [15]]}
abstract class LibHeaderToken {}

@Component({
  selector: 'lib-header',
  providers: [{provide: LibHeaderToken, useExisting: LibHeader}],
  …,
})
class LibHeader extends LibHeaderToken {}

@Component({
  selector: 'lib-card',
  …,
})
class LibCard {
  readonly header = contentChild(LibHeaderToken);
}
```

Bu örnekte, `LibCard` uygulaması artık ne tür konumunda ne de değer konumunda `LibHeader`'a referans vermez.
Bu, `LibHeader`'ın tam tree-shaking'inin gerçekleşmesine olanak tanır.
`LibHeaderToken` tutulur, ancak somut bir uygulaması olmayan yalnızca bir sınıf bildirimidir.
Küçüktür ve derleme sonrası tutulduğunda uygulama boyutunu maddi olarak etkilemez.

Bunun yerine, `LibHeader`'ın kendisi soyut `LibHeaderToken` sınıfını uygular.
Bu token'ı bileşen tanımında sağlayıcı olarak güvenle kullanabilirsiniz, bu da Angular'ın somut türü doğru şekilde enjekte etmesine olanak tanır.

Özetlemek gerekirse, hafif enjeksiyon token'ı deseni şunlardan oluşur:

1. Soyut bir sınıf olarak temsil edilen hafif bir enjeksiyon token'ı.
2. Soyut sınıfı uygulayan bir bileşen tanımı.
3. `contentChild` veya `contentChildren` kullanılarak hafif desenin enjeksiyonu.
4. Hafif enjeksiyon token'ının uygulamasında, hafif enjeksiyon token'ını uygulama ile ilişkilendiren bir sağlayıcı.

### Use the lightweight injection token for API definition

Hafif bir enjeksiyon token'ı enjekte eden bir bileşenin, enjekte edilen sınıfta bir yöntemi çağırması gerekebilir.
Token artık soyut bir sınıftır. Enjekte edilebilir bileşen bu sınıfı uyguladığından, soyut hafif enjeksiyon token'ı sınıfında da soyut bir yöntem bildirmelisiniz.
Tüm kod yükü ile yöntemin uygulaması, tree-shaken edilebilen enjekte edilebilir bileşende bulunur.
Bu, üst elementin alt elemanla, varsa, tür güvenli bir şekilde iletişim kurmasına olanak tanır.

Örneğin, `LibCard` artık `LibHeader` yerine `LibHeaderToken`'ı sorgular.
Aşağıdaki örnek, desenin `LibCard`'ın `LibHeader`'a gerçekten referans vermeden `LibHeader` ile nasıl iletişim kurmasına olanak tanıdığını gösterir:

```ts {highlight: [[2],[7],[11],[19]]}
abstract class LibHeaderToken {
  abstract doSomething(): void;
}

@Component({
  selector: 'lib-header',
  providers: [{provide: LibHeaderToken, useExisting: LibHeader}],
})
class LibHeader extends LibHeaderToken {
  doSomething(): void {
    // Concrete implementation of `doSomething`
  }
}

@Component({
  selector: 'lib-card',
})
class LibCard implements AfterContentInit {
  readonly header = contentChild(LibHeaderToken);

  ngAfterContentInit(): void {
    if (this.header() !== undefined) {
      this.header()!.doSomething();
    }
  }
}
```

Bu örnekte, üst eleman alt bileşeni almak için token'ı sorgular ve varsa ortaya çıkan bileşen referansını saklar.
Alt elemanda bir yöntem çağırmadan önce, üst bileşen alt bileşenin mevcut olup olmadığını kontrol eder.
Alt bileşen tree-shaken edilmişse, ona çalışma zamanı referansı yoktur ve yöntemine çağrı yapılmaz.

### Naming your lightweight injection token

Hafif enjeksiyon token'ları yalnızca bileşenlerle yararlıdır.
[Angular Stil Kılavuzu](style-guide), bileşenleri `Component` son eki olmadan adlandırmanızı önerir.
`LibHeader` örneği bu kuralı izler.

Bileşen ile token'ı arasındaki ilişkiyi korurken yine de aralarında ayrım yapmalısınız.
Önerilen stil, hafif enjeksiyon token'larınızı adlandırmak için bileşen temel adını `Token` son eki ile kullanmaktır: `LibHeaderToken`.
