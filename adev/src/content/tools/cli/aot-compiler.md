# Ahead-of-time (AOT) compilation

Bir Angular uygulaması esas olarak bileşenlerden ve bunların HTML şablonlarından oluşur.
Angular tarafından sağlanan bileşenler ve şablonlar doğrudan tarayıcı tarafından anlaşılamadığından, Angular uygulamalarının tarayıcıda çalışabilmeleri için bir derleme sürecinden geçmeleri gerekir.

Angular önceden derleme (AOT) derleyicisi, tarayıcı bu kodu indirip çalıştırmadan _önce_ derleme aşamasında Angular HTML ve TypeScript kodunuzu verimli JavaScript koduna dönüştürür.
Uygulamanızı derleme sürecinde derlemek, tarayıcıda daha hızlı bir oluşturma sağlar.

Bu kılavuz, AOT derleyicisini kullanarak uygulamalarınızı verimli bir şekilde derlemek için meta verileri nasıl belirteceğinizi ve mevcut derleyici seçeneklerini nasıl uygulayacağınızı açıklar.

HELPFUL: [Alex Rickabaugh'un AngularConnect 2019'da Angular derleyicisini açıkladığını izleyin](https://www.youtube.com/watch?v=anphffaCZrQ).

AOT kullanmak istemenizin bazı nedenleri şunlardır.

| Nedenler                                  | Ayrıntılar                                                                                                                                                                                                                                        |
| :---------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Daha hızlı oluşturma                      | AOT ile tarayıcı, uygulamanın önceden derlenmiş bir sürümünü indirir. Tarayıcı çalıştırılabilir kodu yükler, böylece önce uygulamayı derlemeyi beklemeden uygulamayı hemen oluşturabilir.                                                         |
| Daha az asenkron istek                    | Derleyici, harici HTML şablonlarını ve CSS stil sayfalarını uygulama JavaScript'i içine _satır içi_ yerleştirir ve bu kaynak dosyaları için ayrı ajax isteklerini ortadan kaldırır.                                                               |
| Daha küçük Angular çerçeve indirme boyutu | Uygulama zaten derlenmişse Angular derleyicisini indirmeye gerek yoktur. Derleyici Angular'ın kabaca yarısı kadardır, bu nedenle onu atlamak uygulama yükünü önemli ölçüde azaltır.                                                               |
| Şablon hatalarını daha erken tespit etme  | AOT derleyicisi, kullanıcılar göremeden önce derleme adımında şablon bağlama hatalarını tespit eder ve bildirir.                                                                                                                                  |
| Daha iyi güvenlik                         | AOT, HTML şablonlarını ve bileşenleri istemciye sunulmadan çok önce JavaScript dosyalarına derler. Okunacak şablon ve riskli istemci tarafı HTML veya JavaScript değerlendirmesi olmadığından, enjeksiyon saldırıları için daha az fırsat vardır. |

## Choosing a compiler

Angular, uygulamanızı derlemek için iki yol sunar:

| Angular derleme       | Ayrıntılar                                                                                        |
| :-------------------- | :------------------------------------------------------------------------------------------------ |
| Just-in-Time \(JIT\)  | Uygulamanızı çalışma zamanında tarayıcıda derler. Angular 8'e kadar varsayılandı.                 |
| Ahead-of-Time \(AOT\) | Uygulamanızı ve kütüphanelerinizi derleme zamanında derler. Angular 9'dan itibaren varsayılandır. |

[`ng build`](cli/build) \(yalnızca derleme\) veya [`ng serve`](cli/serve) \(derleme ve yerel olarak sunma\) CLI komutlarını çalıştırdığınızda, derleme türü \(JIT veya AOT\) `angular.json` içindeki derleme yapılandırmanızda belirtilen `aot` özelliğinin değerine bağlıdır.
Varsayılan olarak, yeni CLI uygulamaları için `aot` değeri `true` olarak ayarlanmıştır.

Daha fazla bilgi için [CLI komut referansına](cli) ve [Angular uygulamaları derleme ve sunma](tools/cli/build) belgesine bakın.

## How AOT works

Angular AOT derleyicisi, Angular'ın yönetmesi gereken uygulama parçalarını yorumlamak için **meta veri** çıkarır.
Meta veriyi `@Component()` gibi **dekoratörlerde** açıkça veya dekoratör uygulanmış sınıfların yapıcı bildirimlerinde örtük olarak belirtebilirsiniz.
Meta veri, Angular'a uygulama sınıflarınızın örneklerini nasıl oluşturacağını ve çalışma zamanında onlarla nasıl etkileşime geçeceğini söyler.

Aşağıdaki örnekte, `@Component()` meta veri nesnesi ve sınıf yapıcısı Angular'a bir `Typical` örneğini nasıl oluşturacağını ve görüntüleyeceğini söyler.

```angular-ts
@Component({
  selector: 'app-typical',
  template: '<div>A typical component for {{data.name}}</div>',
})
export class Typical {
  data = input.required<TypicalData>();
  private someService = inject(SomeService);
}
```

Angular derleyicisi, meta veriyi _bir kez_ çıkarır ve `Typical` için bir _fabrika_ oluşturur.
Bir `Typical` örneği oluşturması gerektiğinde, Angular fabrikayı çağırır; bu fabrika, enjekte edilen bağımlılığı ile bileşen sınıfının yeni bir örneğine bağlı yeni bir görsel öğe üretir.

### Compilation phases

AOT derlemesinin üç aşaması vardır.

|     | Aşama               | Ayrıntılar                                                                                                                                                                                                                                                                                                                              |
| :-- | :------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | kod analizi         | Bu aşamada, TypeScript derleyicisi ve _AOT toplayıcısı_ kaynağın bir temsilini oluşturur. Toplayıcı, topladığı meta veriyi yorumlamaya çalışmaz. Meta veriyi olabildiğince iyi temsil eder ve bir meta veri sözdizimi ihlali tespit ettiğinde hataları kaydeder.                                                                        |
| 2   | kod oluşturma       | Bu aşamada, derleyicinin `StaticReflector`'ı 1. aşamada toplanan meta veriyi yorumlar, meta verinin ek doğrulamasını yapar ve bir meta veri kısıtlama ihlali tespit ederse bir hata fırlatır.                                                                                                                                           |
| 3   | şablon tür denetimi | Bu isteğe bağlı aşamada, Angular _şablon derleyicisi_ şablonlardaki bağlama ifadelerini doğrulamak için TypeScript derleyicisini kullanır. Bu aşamayı `strictTemplates` yapılandırma seçeneğini ayarlayarak açıkça etkinleştirebilirsiniz; [Angular derleyici seçenekleri](reference/configs/angular-compiler-options) belgesine bakın. |

### Metadata restrictions

Meta veriyi, aşağıdaki genel kısıtlamalara uyması gereken bir TypeScript _alt kümesinde_ yazarsınız:

- [İfade sözdizimini](#expression-syntax-limitations) desteklenen JavaScript alt kümesiyle sınırlayın
- [Kod katlama](#code-folding) sonrasında yalnızca dışa aktarılmış sembollere başvurun
- Yalnızca derleyici tarafından [desteklenen fonksiyonları](#supported-classes-and-functions) çağırın
- Input/Output'lar ve veriye bağlı sınıf üyeleri public veya protected olmalıdır. Bir uygulamayı AOT derleme için hazırlama hakkında ek yönergeler ve talimatlar için [Angular: AOT-dostu uygulamalar yazma](https://medium.com/sparkles-blog/angular-writing-aot-friendly-applications-7b64c8afbe3f) makalesine bakın.

HELPFUL: AOT derlemesindeki hatalar genellikle derleyicinin gereksinimlerine uymayan meta veriler nedeniyle oluşur \(aşağıda daha ayrıntılı açıklanmıştır\).
Bu sorunları anlamada ve çözmede yardım için [AOT Meta Veri Hataları](tools/cli/aot-metadata-errors) belgesine bakın.

### Configuring AOT compilation

Derleme sürecini kontrol eden [TypeScript yapılandırma dosyasında](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) seçenekler sağlayabilirsiniz.
Mevcut seçeneklerin eksiksiz listesi için [Angular derleyici seçenekleri](reference/configs/angular-compiler-options) belgesine bakın.

## Phase 1: Code analysis

TypeScript derleyicisi, ilk aşamanın analitik çalışmasının bir kısmını yapar.
AOT derleyicisinin uygulama kodu oluşturmak için ihtiyaç duyduğu tür bilgisine sahip `.d.ts` _tür tanım dosyalarını_ yayar.
Aynı zamanda, AOT **toplayıcısı** Angular dekoratörlerinde kaydedilen meta veriyi analiz eder ve her `.d.ts` dosyası için bir tane olmak üzere **`.metadata.json`** dosyalarında meta veri bilgisini çıkarır.

`.metadata.json`'ı, bir dekoratörün meta verisinin genel yapısının bir diyagramı olarak düşünebilirsiniz; [soyut sözdizim ağacı (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) olarak temsil edilir.

HELPFUL: Angular'ın [schema.ts](https://github.com/angular/angular/blob/main/packages/compiler-cli/src/metadata/schema.ts) dosyası, JSON formatını TypeScript arayüzleri koleksiyonu olarak tanımlar.

### Expression syntax limitations

AOT toplayıcısı yalnızca JavaScript'in bir alt kümesini anlar.
Meta veri nesnelerini aşağıdaki sınırlı sözdizimi ile tanımlayın:

| Sözdizimi                  | Örnek                                                      |
| :------------------------- | :--------------------------------------------------------- |
| Literal nesne              | `{cherry: true, apple: true, mincemeat: false}`            |
| Literal dizi               | `['cherries', 'flour', 'sugar']`                           |
| Literal dizide yayılma     | `['apples', 'flour', ...]`                                 |
| Çağrılar                   | `bake(ingredients)`                                        |
| New                        | `new Oven()`                                               |
| Özellik erişimi            | `pie.slice`                                                |
| Dizi indeksi               | `ingredients[0]`                                           |
| Kimlik referansı           | `Component`                                                |
| Şablon dizesi              | <code>`pie is ${multiplier} times better than cake`</code> |
| Literal dize               | `'pi'`                                                     |
| Literal sayı               | `3.14153265`                                               |
| Literal boolean            | `true`                                                     |
| Literal null               | `null`                                                     |
| Desteklenen önek operatörü | `!cake`                                                    |
| Desteklenen ikili operatör | `a+b`                                                      |
| Koşul operatörü            | `a ? b : c`                                                |
| Parantezler                | `(a+b)`                                                    |

Bir ifade desteklenmeyen sözdizimi kullanırsa, toplayıcı `.metadata.json` dosyasına bir hata düğümü yazar.
Derleyici, uygulama kodunu oluşturmak için o meta veri parçasına ihtiyaç duyarsa daha sonra hatayı bildirir.

HELPFUL: `ngc`'nin bir hatalı `.metadata.json` dosyası üretmek yerine sözdizimi hatalarını hemen bildirmesini istiyorsanız, TypeScript yapılandırma dosyasında `strictMetadataEmit` seçeneğini ayarlayın.

```json

"angularCompilerOptions": {
  …
  "strictMetadataEmit" : true
}

```

Angular kütüphaneleri, tüm Angular `.metadata.json` dosyalarının temiz olmasını sağlamak için bu seçeneğe sahiptir ve kendi kütüphanelerinizi oluştururken de aynısını yapmanız en iyi uygulamadır.

### No arrow functions

AOT derleyicisi, _lambda_ fonksiyonları olarak da adlandırılan [fonksiyon ifadelerini](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/function) ve [ok fonksiyonlarını](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions) desteklemez.

Aşağıdaki bileşen dekoratörünü düşünün:

```ts

@Component({
  …
  providers: [{provide: server, useFactory: () => new Server()}]
})

```

AOT toplayıcısı, bir meta veri ifadesindeki ok fonksiyonunu `() => new Server()` desteklemez.
Fonksiyon yerine bir hata düğümü oluşturur.
Derleyici daha sonra bu düğümü yorumladığında, ok fonksiyonunu _dışa aktarılmış bir fonksiyona_ dönüştürmenizi öneren bir hata bildirir.

Hatayı şuna dönüştürerek düzeltebilirsiniz:

```ts

export function serverFactory() {
  return new Server();
}

@Component({
  …
  providers: [{provide: server, useFactory: serverFactory}]
})

```

Sürüm 5 ve sonrasında, derleyici `.js` dosyasını yayarken bu yeniden yazmayı otomatik olarak gerçekleştirir.

### Code folding

Derleyici yalnızca **_dışa aktarılmış_** sembollere yapılan referansları çözebilir.
Ancak toplayıcı, toplama sırasında bir ifadeyi değerlendirebilir ve orijinal ifade yerine sonucu `.metadata.json`'a kaydedebilir.
Bu, ifadeler içinde dışa aktarılmamış sembollerin sınırlı kullanımına izin verir.

Örneğin, toplayıcı `1 + 2 + 3 + 4` ifadesini değerlendirebilir ve sonucu `10` ile değiştirebilir.
Bu süreç _katlama_ olarak adlandırılır.
Bu şekilde indirgenebilen bir ifade _katlanabilir_'dir.

Toplayıcı, modül-yerel `const` bildirimleri ve başlatılmış `var` ve `let` bildirimlerine yapılan referansları değerlendirebilir ve bunları `.metadata.json` dosyasından etkili bir şekilde kaldırabilir.

Aşağıdaki bileşen tanımını düşünün:

```angular-ts
const template = '<div>{{hero().name}}</div>';

@Component({
  selector: 'app-hero',
  template: template,
})
export class Hero {
  hero = input.required<Hero>();
}
```

Derleyici, dışa aktarılmadığı için `template` sabitine başvuramaz.
Ancak toplayıcı, içeriğini satır içi yerleştirerek `template` sabitini meta veri tanımına _katlayabilir_.
Etki, şöyle yazmışsınız gibi olur:

```angular-ts
@Component({
  selector: 'app-hero',
  template: '<div>{{hero().name}}</div>',
})
export class Hero {
  hero = input.required<Hero>();
}
```

Artık `template`'e bir referans yoktur ve bu nedenle derleyici daha sonra _toplayıcının_ `.metadata.json` çıktısını yorumladığında sorun yaratacak hiçbir şey yoktur.

Bu örneği, `template` sabitini başka bir ifadeye dahil ederek bir adım daha ileri götürebilirsiniz:

```angular-ts
const template = '<div>{{hero().name}}</div>';

@Component({
  selector: 'app-hero',
  template: template + '<div>{{hero().title}}</div>',
})
export class Hero {
  hero = input.required<Hero>();
}
```

Toplayıcı bu ifadeyi eşdeğer _katlanmış_ dizesine indirger:

```angular-ts
'<div>{{hero().name}}</div><div>{{hero().title}}</div>';
```

#### Foldable syntax

Aşağıdaki tablo, toplayıcının hangi ifadeleri katlayıp katlamayacağını açıklar:

| Sözdizimi                  | Katlanabilir                            |
| :------------------------- | :-------------------------------------- |
| Literal nesne              | evet                                    |
| Literal dizi               | evet                                    |
| Literal dizide yayılma     | hayır                                   |
| Çağrılar                   | hayır                                   |
| New                        | hayır                                   |
| Özellik erişimi            | evet, hedef katlanabilirse              |
| Dizi indeksi               | evet, hedef ve indeks katlanabilirse    |
| Kimlik referansı           | evet, yerel bir referans ise            |
| Değiştirmesiz şablon       | evet                                    |
| Değiştirmeli şablon        | evet, değiştirmeler katlanabilirse      |
| Literal dize               | evet                                    |
| Literal sayı               | evet                                    |
| Literal boolean            | evet                                    |
| Literal null               | evet                                    |
| Desteklenen önek operatörü | evet, işlenen katlanabilirse            |
| Desteklenen ikili operatör | evet, hem sol hem de sağ katlanabilirse |
| Koşul operatörü            | evet, koşul katlanabilirse              |
| Parantezler                | evet, ifade katlanabilirse              |

Bir ifade katlanabilir değilse, toplayıcı onu derleyicinin çözmesi için bir [AST](https://en.wikipedia.org/wiki/Abstract*syntax*tree) olarak `.metadata.json`'a yazar.

## Phase 2: code generation

Toplayıcı, topladığı ve `.metadata.json`'a çıkardığı meta veriyi anlamaya çalışmaz.
Meta veriyi olabildiğince iyi temsil eder ve bir meta veri sözdizimi ihlali tespit ettiğinde hataları kaydeder.
Kod oluşturma aşamasında `.metadata.json`'ı yorumlamak derleyicinin işidir.

Derleyici, toplayıcının desteklediği tüm sözdizimi biçimlerini anlar, ancak meta verinin _semantiği_ derleyici kurallarını ihlal ediyorsa _sözdizimsel olarak_ doğru meta veriyi reddedebilir.

### Public or protected symbols

Derleyici yalnızca \_dışa aktarılmış sembol_lere başvurabilir.

- Dekoratör uygulanmış bileşen sınıf üyeleri public veya protected olmalıdır.
  Bir `input()` özelliğini private yapamazsınız.

- Veriye bağlı özellikler de public veya protected olmalıdır

### Supported classes and functions

Toplayıcı, sözdizimi geçerli olduğu sürece bir fonksiyon çağrısını veya `new` ile nesne oluşturmayı temsil edebilir.
Ancak derleyici, daha sonra belirli bir fonksiyona çağrı yapmayı veya belirli bir nesne oluşturmayı reddedebilir.

Derleyici yalnızca belirli sınıfların örneklerini oluşturabilir, yalnızca çekirdek dekoratörleri destekler ve yalnızca ifade döndüren makrolara \(fonksiyonlar veya statik metotlar\) yapılan çağrıları destekler.

| Derleyici eylemi         | Ayrıntılar                                                                                                                                                                      |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Yeni örnekler            | Derleyici yalnızca `@angular/core`'dan `InjectionToken` sınıfının örneklerini oluşturan meta verilere izin verir.                                                               |
| Desteklenen dekoratörler | Derleyici yalnızca [`@angular/core` modülündeki Angular dekoratörleri](/api?type=decorator) için meta verileri destekler.                                                       |
| Fonksiyon çağrıları      | Fabrika fonksiyonları dışa aktarılmış, adlandırılmış fonksiyonlar olmalıdır. AOT derleyicisi, fabrika fonksiyonları için lambda ifadelerini \("ok fonksiyonları"\) desteklemez. |

### Functions and static method calls

Toplayıcı, tek bir `return` ifadesi içeren herhangi bir fonksiyonu veya statik metodu kabul eder.
Ancak derleyici, yalnızca bir _ifade_ döndüren fonksiyonlar veya statik metotlar biçimindeki makroları destekler.

Örneğin, aşağıdaki fonksiyonu düşünün:

```ts
export function wrapInArray<T>(value: T): T[] {
  return [value];
}
```

`wrapInArray`'i bir meta veri tanımında çağırabilirsiniz çünkü derleyicinin kısıtlı JavaScript alt kümesine uyan bir ifadenin değerini döndürür.

`wrapInArray()`'i şu şekilde kullanabilirsiniz:

```ts
@NgModule({
  declarations: wrapInArray(Typical),
})
export class TypicalModule {}
```

Derleyici bu kullanımı, şöyle yazmışsınız gibi değerlendirir:

```ts
@NgModule({
  declarations: [Typical],
})
export class TypicalModule {}
```

Angular [`RouterModule`](api/router/RouterModule), kök ve alt rotaları bildirmeye yardımcı olan iki makro statik metot, `forRoot` ve `forChild`, dışa aktarır.
Makroların karmaşık [NgModules](guide/ngmodules/overview) yapılandırmasını nasıl basitleştirebileceğini görmek için bu metotların [kaynak kodunu](https://github.com/angular/angular/blob/main/packages/router/src/router_module.ts#L139 'RouterModule.forRoot source code') inceleyin.

### Metadata rewriting

Derleyici, `useClass`, `useValue`, `useFactory` ve `data` alanlarını içeren nesne literallerini özel olarak ele alır ve bu alanlardan birini başlatan ifadeyi, ifadeyi dışa aktarılmış bir değişkenle değiştirir.
Bu ifadelerin yeniden yazılması süreci, içlerinde ne olabileceğine dair tüm kısıtlamaları kaldırır çünkü
derleyicinin ifadenin değerini bilmesine gerek yoktur — yalnızca değere bir referans oluşturabilmesi gerekir.

Şöyle bir şey yazabilirsiniz:

```ts
class TypicalServer {}

@NgModule({
  providers: [{provide: SERVER, useFactory: () => TypicalServer}],
})
export class TypicalModule {}
```

Yeniden yazma olmadan, lambda'lar desteklenmediği ve `TypicalServer` dışa aktarılmadığı için bu geçersiz olurdu.
Buna izin vermek için derleyici bunu otomatik olarak şöyle bir şeye yeniden yazar:

```ts
class TypicalServer {}

export const θ0 = () => new TypicalServer();

@NgModule({
  providers: [{provide: SERVER, useFactory: θ0}],
})
export class TypicalModule {}
```

Bu, derleyicinin `θ0`'ın ne içerdiğini bilmeden fabrikada `θ0`'a bir referans oluşturmasına olanak tanır.

Derleyici, `.js` dosyasının yayınlanması sırasında yeniden yazmayı gerçekleştirir.
Ancak `.d.ts` dosyasını yeniden yazmaz, bu nedenle TypeScript bunu bir dışa aktarma olarak tanımaz.
Ve ES modülünün dışa aktarılan API'sine müdahale etmez.

## Phase 3: Template type checking

Angular derleyicisinin en yararlı özelliklerinden biri, şablonlardaki ifadeleri tür denetleme ve çalışma zamanında çökmelere neden olmadan önce hataları yakalama yeteneğidir.
Şablon tür denetimi aşamasında, Angular şablon derleyicisi şablonlardaki bağlama ifadelerini doğrulamak için TypeScript derleyicisini kullanır.

Bu aşamayı, projenin TypeScript yapılandırma dosyasındaki `"angularCompilerOptions"` içine `"fullTemplateTypeCheck"` derleyici seçeneğini ekleyerek açıkça etkinleştirin
([Angular Derleyici Seçenekleri](reference/configs/angular-compiler-options) belgesine bakın).

Şablon doğrulaması, bir şablon bağlama ifadesinde bir tür hatası tespit edildiğinde, TypeScript derleyicisinin `.ts` dosyasındaki koda karşı tür hatalarını bildirmesine benzer şekilde hata mesajları üretir.

Örneğin, aşağıdaki bileşeni düşünün:

```angular-ts
@Component({
  selector: 'my-component',
  template: '{{person.addresss.street}}',
})
class MyComponent {
  person?: Person;
}
```

Bu, aşağıdaki hatayı üretir:

```shell {hideCopy}

my.component.ts.MyComponent.html(1,1): : Property 'addresss' does not exist on type 'Person'. Did you mean 'address'?

```

Hata mesajında bildirilen dosya adı `my.component.ts.MyComponent.html`, `MyComponent` sınıf şablonunun içeriğini tutan şablon derleyicisi tarafından oluşturulan sentetik bir dosyadır.
Derleyici bu dosyayı hiçbir zaman diske yazmaz.
Satır ve sütun numaraları, bu durumda `MyComponent` sınıfının `@Component` anotasyonundaki şablon dizesine göredir.
Bir bileşen `template` yerine `templateUrl` kullanıyorsa, hatalar sentetik bir dosya yerine `templateUrl` tarafından referans verilen HTML dosyasında bildirilir.

Hata konumu, hatalı enterpolasyon ifadesini içeren metin düğümünün başlangıcıdır.
Hata `[value]="person.address.street"` gibi bir öznitelik bağlamasındaysa, hata konumu hatayı içeren özniteliğin konumudur.

Doğrulama, tür doğrulamasının ne kadar ayrıntılı olacağını kontrol etmek için TypeScript tür denetleyicisini ve TypeScript derleyicisine sağlanan seçenekleri kullanır.
Örneğin, `strictTypeChecks` belirtilmişse, yukarıdaki hata mesajının yanı sıra

```shell {hideCopy}

my.component.ts.MyComponent.html(1,1): : Object is possibly 'undefined'

```

hatası da bildirilir.

### Type narrowing

Bir `ngIf` direktifinde kullanılan ifade, TypeScript'te `if` ifadesinin yaptığı gibi Angular şablon derleyicisinde tür birleşimlerini daraltmak için kullanılır.
Örneğin, yukarıdaki şablondaki `Object is possibly 'undefined'` hatasını önlemek için, aşağıda gösterildiği gibi yalnızca `person` değeri başlatılmışsa enterpolasyonu yayınlayacak şekilde değiştirin:

```angular-ts
@Component({
  selector: 'my-component',
  template: '<span *ngIf="person"> {{person.address.street}} </span>',
})
class MyComponent {
  person?: Person;
}
```

`*ngIf` kullanmak, TypeScript derleyicisinin bağlama ifadesinde kullanılan `person`'ın asla `undefined` olmayacağını çıkarsamasına olanak tanır.

Girdi tür daraltma hakkında daha fazla bilgi için [Özel direktifler için şablon tür denetimini iyileştirme](/guide/directives/structural-directives#improving-template-type-checking-for-custom-directives) belgesine bakın.

### Non-null type assertion operator

`*ngIf` kullanmanın uygun olmadığı veya bileşendeki bazı kısıtlamaların bağlama ifadesi enterpolasyon yapıldığında ifadenin her zaman non-null olmasını sağladığı durumlarda `Object is possibly 'undefined'` hatasını bastırmak için non-null tür onaylama operatörünü kullanın.

Aşağıdaki örnekte, `person` ve `address` özellikleri her zaman birlikte ayarlanır, bu da `person` non-null ise `address`'in her zaman non-null olduğu anlamına gelir.
Bu kısıtlamayı TypeScript ve şablon derleyicisine tanımlamanın uygun bir yolu yoktur, ancak örnekte `address!.street` kullanılarak hata bastırılmıştır.

```angular-ts
@Component({
  selector: 'my-component',
  template: '<span *ngIf="person"> {{person.name}} lives on {{address!.street}} </span>',
})
class MyComponent {
  person?: Person;
  address?: Address;

  setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}
```

Non-null onaylama operatörü dikkatli kullanılmalıdır çünkü bileşenin yeniden yapılandırılması bu kısıtlamayı bozabilir.

Bu örnekte, `address` kontrolünün aşağıda gösterildiği gibi `*ngIf` içine dahil edilmesi önerilir:

```angular-ts
@Component({
  selector: 'my-component',
  template: '<span *ngIf="person && address"> {{person.name}} lives on {{address.street}} </span>',
})
class MyComponent {
  person?: Person;
  address?: Address;

  setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}
```
