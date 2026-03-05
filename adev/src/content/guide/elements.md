# Angular elements overview

_Angular elements_, Angular bileşenlerinin _özel öğeler_ \(aynı zamanda Web Components olarak da adlandırılır\) olarak paketlenmiş halidir; framework'ten bağımsız bir şekilde yeni HTML öğeleri tanımlamak için bir web standardıdır.

[Özel öğeler](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements), Angular tarafından desteklenen tüm tarayıcılarda kullanılabilen bir Web Platformu özelliğidir.
Özel bir öğe, içeriği JavaScript kodu tarafından oluşturulan ve kontrol edilen bir etiket tanımlamanıza olanak tanıyarak HTML'i genişletir.
Tarayıcı, bir HTML etiketini somutlaştırılabilir bir JavaScript sınıfına eşleyen tanımlı özel öğelerin bir `CustomElementRegistry`'sini tutar.

`@angular/elements` paketi, Angular'ın bileşen arayüzü ve değişiklik algılama işlevselliğinden yerleşik DOM API'sine köprü sağlayan bir `createCustomElement()` API'si dışa aktarır.

Bir bileşeni özel öğeye dönüştürmek, gerekli tüm Angular altyapısını tarayıcıya sunar.
Özel öğe oluşturmak basit ve kolaydır ve bileşen tanımlı görünümünüzü değişiklik algılama ve veri bağlama ile otomatik olarak bağlar, Angular işlevselliğini ilgili yerleşik HTML eşdeğerleriyle eşler.

## Using custom elements

Özel öğeler kendilerini başlatır - DOM'a eklendiklerinde başlarlar ve DOM'dan kaldırıldıklarında yok edilirler.
Bir özel öğe herhangi bir sayfanın DOM'una eklendiğinde, diğer herhangi bir HTML öğesi gibi görünür ve davranır ve Angular terimleri veya kullanım kuralları hakkında özel bir bilgi gerektirmez.

`@angular/elements` paketini çalışma alanınıza eklemek için aşağıdaki komutu çalıştırın:

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install @angular/elements
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add @angular/elements
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add @angular/elements
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add @angular/elements
  </docs-code>
</docs-code-multifile>

### How it works

`createCustomElement()` fonksiyonu, bir bileşeni tarayıcıda özel öğe olarak kaydedilebilen bir sınıfa dönüştürür.
Yapılandırılmış sınıfınızı tarayıcının özel öğe kayıt defterine kaydettikten sonra, yeni öğeyi doğrudan DOM'a eklediğiniz içerikte yerleşik bir HTML öğesi gibi kullanın:

```html
<my-popup message="Use Angular!"></my-popup>
```

Özel öğeniz bir sayfaya yerleştirildiğinde, tarayıcı kayıtlı sınıfın bir örneğini oluşturur ve DOM'a ekler.
İçerik, Angular şablon sözdizimini kullanan bileşenin şablonu tarafından sağlanır ve bileşen ve DOM verileri kullanılarak render edilir.
Bileşendeki giriş özellikleri, öğe için giriş niteliklerine karşılık gelir.

## Transforming components to custom elements

Angular, bir Angular bileşenini bağımlılıklarıyla birlikte özel bir öğeye dönüştürmek için `createCustomElement()` fonksiyonunu sağlar.

Dönüştürme işlemi `NgElementConstructor` arayüzünü uygular ve bileşeninizin kendi kendini başlatan bir örneğini üretmek üzere yapılandırılmış bir kurucu sınıf oluşturur.

Yapılandırılmış kurucuyu ve ilişkili özel öğe etiketini tarayıcının [`CustomElementRegistry`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry)'sine kaydetmek için tarayıcının yerel [`customElements.define()`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/define) fonksiyonunu kullanın.
Tarayıcı, kayıtlı öğe için etiketi karşılaştığında, bir özel öğe örneği oluşturmak için kurucuyu kullanır.

IMPORTANT: Bileşenin seçicisini özel öğe etiket adı olarak kullanmaktan kaçının.
Bu, Angular'ın tek bir DOM öğesi için iki bileşen örneği oluşturması nedeniyle beklenmeyen davranışlara yol açabilir:
Biri normal Angular bileşeni ve diğeri özel öğeyi kullanan.

### Mapping

Özel bir öğe, bir Angular bileşenini _barındırır_ ve bileşende tanımlanan veriler ve mantık ile standart DOM API'leri arasında bir köprü sağlar.
Bileşen özellikleri ve mantığı doğrudan HTML niteliklerine ve tarayıcının olay sistemine eşlenir.

- Oluşturma API'si, giriş özelliklerini arayan bileşeni ayrıştırır ve özel öğe için karşılık gelen nitelikleri tanımlar.
  Özellik adlarını, büyük/küçük harf ayrımlarını tanımayan özel öğelerle uyumlu hale getirmek için dönüştürür.
  Sonuçtaki nitelik adları tire ile ayrılmış küçük harf kullanır.
  Örneğin, `inputProp = input({alias: 'myInputProp'})` olan bir bileşen için karşılık gelen özel öğe `my-input-prop` niteliğini tanımlar.

- Bileşen çıktıları, özel olayın adının çıktı adıyla eşleştiği HTML [Özel Olaylar](https://developer.mozilla.org/docs/Web/API/CustomEvent) olarak gönderilir.
  Örneğin, `valueChanged = output()` olan bir bileşen için karşılık gelen özel öğe "valueChanged" adıyla olaylar gönderir ve yayınlanan veriler olayın `detail` özelliğinde saklanır.
  Bir takma ad sağlarsanız, o değer kullanılır; örneğin, `clicks = output<string>({alias: 'myClick'});` "myClick" adıyla olaylar gönderir.

Daha fazla bilgi için [Özel olay oluşturma](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events#creating_custom_events) Web Component belgelerine bakın.

## Example: A Popup Service

Daha önce, çalışma zamanında bir uygulamaya bir bileşen eklemek istediğinizde, bir _dinamik bileşen_ tanımlamanız ve ardından onu yüklemeniz, DOM'daki bir öğeye eklemeniz ve tüm bağımlılıkları, değişiklik algılamayı ve olay işlemeyi bağlamanız gerekiyordu.

Angular özel öğesi kullanmak, tüm altyapıyı ve framework'ü otomatik olarak sağlayarak süreci daha basit ve daha şeffaf hale getirir - tek yapmanız gereken istediğiniz olay işleme türünü tanımlamaktır.
\(Bileşeni uygulamanızda kullanmayacaksanız, yine de derlemeden hariç tutmanız gerekir.\)

Aşağıdaki Popup Service örnek uygulaması, dinamik olarak yükleyebileceğiniz veya özel bir öğeye dönüştürebileceğiniz bir bileşen tanımlar.

| Files              | Details                                                                                                                                                                                                                 |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `popup.ts`         | Bazı animasyon ve stillerle bir giriş mesajı görüntüleyen basit bir açılır pencere öğesi tanımlar.                                                                                                                      |
| `popup.service.ts` | `Popup`'ı çağırmak için iki farklı yol sağlayan enjekte edilebilir bir servis oluşturur; dinamik bileşen olarak veya özel öğe olarak. Dinamik yükleme yöntemi için ne kadar daha fazla kurulum gerektiğine dikkat edin. |
| `app.ts`           | Uygulamanın kök bileşenini tanımlar ve çalışma zamanında DOM'a açılır pencere eklemek için `PopupService`'i kullanır. Uygulama çalıştığında, kök bileşenin kurucusu `Popup`'ı özel öğeye dönüştürür.                    |

Karşılaştırma için demo her iki yöntemi de gösterir.
Bir düğme dinamik yükleme yöntemini kullanarak açılır pencereyi ekler ve diğeri özel öğeyi kullanır.
Sonuç aynıdır, ancak hazırlık farklıdır.

<docs-code-multifile>
    <docs-code language="angular-ts" header="popup.ts" path="adev/src/content/examples/elements/src/app/popup.ts"/>
    <docs-code header="popup.service.ts" path="adev/src/content/examples/elements/src/app/popup.service.ts"/>
    <docs-code header="app.ts" path="adev/src/content/examples/elements/src/app/app.ts"/>
</docs-code-multifile>

## Typings for custom elements

`document.createElement()` veya `document.querySelector()` gibi genel DOM API'leri, belirtilen argümanlar için uygun bir öğe türü döndürür.
Örneğin, `document.createElement('a')` çağrısı TypeScript'in `href` özelliğine sahip olduğunu bildiği bir `HTMLAnchorElement` döndürür.
Benzer şekilde, `document.createElement('div')` TypeScript'in `href` özelliğine sahip olmadığını bildiği bir `HTMLDivElement` döndürür.

Bilinmeyen öğelerle, örneğin özel bir öğe adıyla \(örneğimizdeki `popup-element`\) çağrıldığında, yöntemler `HTMLElement` gibi genel bir tür döndürür çünkü TypeScript döndürülen öğenin doğru türünü çıkaramaz.

Angular ile oluşturulan özel öğeler `NgElement`'i \(sırasıyla `HTMLElement`'i genişleten\) genişletir.
Ek olarak, bu özel öğeler ilgili bileşenin her girişi için bir özelliğe sahip olacaktır.
Örneğin, `popup-element` öğemiz `string` türünde bir `message` özelliğine sahiptir.

Özel öğeleriniz için doğru türleri almak istiyorsanız birkaç seçenek vardır.
Aşağıdaki bileşene dayalı bir `my-dialog` özel öğesi oluşturduğunuzu varsayın:

```ts
@Component(/* ... */)
class MyDialog {
  content = input('');
}
```

Doğru tip bilgisi almanın en basit yolu, ilgili DOM yöntemlerinin dönüş değerini doğru türe dönüştürmektir.
Bunun için `NgElement` ve `WithProperties` türlerini \(her ikisi de `@angular/elements`'ten dışa aktarılır\) kullanın:

```ts
const aDialog = document.createElement('my-dialog') as NgElement &
  WithProperties<{content: string}>;
aDialog.content = 'Hello, world!';
aDialog.content = 123; // <-- ERROR: TypeScript knows this should be a string.
aDialog.body = 'News'; // <-- ERROR: TypeScript knows there is no `body` property on `aDialog`.
```

Bu, özel öğeniz için tür denetimi ve otomatik tamamlama desteği gibi TypeScript özelliklerini hızlıca almanın iyi bir yoludur.
Ancak birden fazla yerde ihtiyaç duyarsanız zahmetli olabilir çünkü her oluşumda dönüş türünü dönüştürmeniz gerekir.

Her özel öğenin türünü yalnızca bir kez tanımlamayı gerektiren alternatif bir yol, TypeScript'in etiket adına dayalı olarak döndürülen öğenin türünü çıkarmak için kullandığı \(`document.createElement()`, `document.querySelector()` gibi DOM yöntemleri için\) `HTMLElementTagNameMap`'i genişletmektir:

```ts

declare global {
  interface HTMLElementTagNameMap {
    'my-dialog': NgElement & WithProperties<{content: string}>;
    'my-other-element': NgElement & WithProperties<{foo: 'bar'}>;
    …
  }
}

```

Artık TypeScript, yerleşik öğeler için yaptığı gibi doğru türü çıkarabilir:

```ts
document.createElement('div'); //--> HTMLDivElement (built-in element)
document.querySelector('foo'); //--> Element        (unknown element)
document.createElement('my-dialog'); //--> NgElement & WithProperties<{content: string}> (custom element)
document.querySelector('my-other-element'); //--> NgElement & WithProperties<{foo: 'bar'}>      (custom element)
```

## Limitations

`@angular/elements` ile oluşturulan özel öğeleri yok edip yeniden eklerken [disconnect()](https://github.com/angular/angular/issues/38778) geri çağırmasıyla ilgili sorunlar nedeniyle dikkatli olunmalıdır. Bu sorunla karşılaşabileceğiniz durumlar şunlardır:

- `AngularJS`'te bir `ng-if` veya `ng-repeat` içinde bir bileşen render etme
- Bir öğeyi DOM'dan manuel olarak ayırma ve yeniden ekleme
