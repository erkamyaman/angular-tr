# Alan meta verisi

Alan meta verisi, tek bir alana ekleyebileceğiniz reaktif veridir. Angular'ın `required()` ve `min()` gibi yerleşik kısıtlama doğrulayıcıları bu sistemi dahili olarak kullanır. Başka bir deyişle, bir doğrulayıcıyı her çağırdığınızda, o belirli alanın bir meta veri anahtarına katkıda bulunmuş olursunuz.

Bu kılavuz meta veri sistemini derinlemesine ele alır: indirgeyiciler (reducer) birden çok şema kuralından gelen katkıları nasıl birleştirir, özel indirgeyiciler nasıl yazılır, okuma `hasMetadata()` ile nasıl bir araya gelir ve yönetilen meta veri yaşam döngüsü farkındalığına sahip nesneleri tek tek alanlara nasıl bağlar.

## Meta veriyi zaten kullanıyordunuz

Bir şemada `required()` çağırdığınızda ve ortaya çıkan alanda bir şablonda `.required()` okuduğunuzda, meta veri sistemini kullanıyorsunuzdur. `state.required` özel durumlu bir özellik değildir. Yerleşik bir `REQUIRED` meta veri anahtarının geçerli değerini döndüren bir kolaylık getter'ıdır.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, required, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form>
      <label>
        Username
        @if (registrationForm.username().required()) {
          <span class="required-marker" aria-hidden="true">*</span>
        }
        <input [formField]="registrationForm.username" />
      </label>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (path) => {
    required(path.username);
  });
}
```

`required(path.username)` çağırmak, o alandaki `REQUIRED` meta veri anahtarına bir değer katkısında bulunur. `registrationForm.username().required()` okumak, biriken değeri döndürür. Meta veri anahtarı, ikisini birbirine bağlayan köprüdür.

Çeşitli yerleşik kısıtlama doğrulayıcıları bu kalıbı takip eder:

| Doğrulayıcı   | Meta veri anahtarı | Tür                   | `FieldState` getter'ı |
| ------------- | ------------------ | --------------------- | --------------------- |
| `required()`  | `REQUIRED`         | `boolean`             | `required`            |
| `min()`       | `MIN`              | `number \| undefined` | `min`                 |
| `max()`       | `MAX`              | `number \| undefined` | `max`                 |
| `minLength()` | `MIN_LENGTH`       | `number \| undefined` | `minLength`           |
| `maxLength()` | `MAX_LENGTH`       | `number \| undefined` | `maxLength`           |
| `pattern()`   | `PATTERN`          | `RegExp[]`            | `pattern`             |

`email()` ve `validate()` gibi kısıtlama olmayan doğrulayıcılar meta veriye katkıda bulunmaz. Kontrollerini çalıştırır ve bir doğrulama hatası ortaya çıkarırlar, ancak şablonların okuyabileceği reaktif bir değer yayımlamazlar.

## Özel meta veri ne zaman kullanılır

`valid()`, `disabled()` ve `touched()` gibi yerleşik durum sinyallerinin kapsamadığı, belirli bir alana eklenmiş reaktif veriye ihtiyaç duyduğunuzda **özel meta veri** kullanın.

Bazı örnekler şunlar olabilir:

- **Yeniden kullanılabilir alan şemalarına eklenen yapılandırma.** Bir fiyat alanındaki para birimi simgesi gibi; böylece alanı işleyen herhangi bir şablon veya özel denetim bunu görüntüleyebilir. Ya da bir tarih alanında, yeniden kullanılabilir bir aralık seçici tarafından okunan `MIN_DATE` ve `MAX_DATE`.
- **Bir alandaki kurallar arasında paylaşılan ayrıştırılmış değerler.** Bir kez E.164 biçimine ayrıştırılan bir telefon numarası gibi; böylece bir biçim doğrulayıcı ve bir benzersizlik kontrolü, yeniden ayrıştırmadan aynı kanonik biçimi okur.
- **Alanın durumundan oluşturulan görüntüleme ipuçları.** Kullanıcı arayüzünün rozetlere ve simgelere eşlediği bir önem düzeyi (`'info' | 'warning' | 'error'`) ya da kullanıcının ne yazdığına ve hangi diğer alanların dolu olduğuna göre değişen bağlama duyarlı bir yardım mesajı.

Bir alan başına bir şeyi izlemek için formunuzun yanında paralel bir `Map<fieldKey, value>` tuttuğunuzu fark ederseniz, bu meta verinin doğru araç olduğunun bir işaretidir. Meta veri şemayla aynı yerde kalır, reaktif kalır ve alanın yaşam döngüsüne katılır.

## Bir meta veri anahtarı oluşturma

Özel bir anahtar oluşturmak istediğinizde, `createMetadataKey<TWrite>()` çağırın. Tür parametresi, şema kurallarınızın katkıda bulunacağı değeri açıklar.

```ts
import {createMetadataKey} from '@angular/forms/signals';

export const USERNAME_HELP = createMetadataKey<string>();
```

Her `createMetadataKey()` çağrısı yeni bir benzersiz anahtar oluşturur. Eşleşen tür parametrelerine sahip iki çağrı yine de iki farklı anahtardır, bu yüzden her anahtarı modül kapsamında bir kez tanımlayın ve ihtiyaç duyulan her yerde içe aktarın.

NOTE: İndirgeyicisiz oluşturulan bir anahtar varsayılan olarak "geçersiz kılma" anlamını kullanır: birden çok kural anahtarı ayarlarsa son katkı kazanır.

## Bir şemadan değer ayarlama

Belirli bir alandaki anahtar için bir değer kaydetmeniz gerektiğinde, bir şema fonksiyonunun içinde `metadata(path, key, logic)` kullanın.

```angular-ts
import {Component, computed, signal} from '@angular/core';
import {form, metadata, FormField} from '@angular/forms/signals';
import {USERNAME_HELP} from './metadata-keys';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form>
      <label>
        Username
        <input [formField]="registrationForm.username" />
      </label>
      <p class="help">{{ usernameHelp() }}</p>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (path) => {
    metadata(path.username, USERNAME_HELP, ({value}) => {
      const username = value();
      if (username.length === 0) {
        return '3 ile 20 karakter arasında benzersiz bir kullanıcı adı seçin.';
      }
      if (username.length < 3) {
        return 'Yazmaya devam edin, kullanıcı adları en az 3 karakter olmalıdır.';
      }
      if (username.length > 20) {
        return 'Kullanıcı adları en fazla 20 karakter olabilir.';
      }
      return 'İyi görünüyor.';
    });
  });

  usernameHelp = computed(() => this.registrationForm.username().metadata(USERNAME_HELP)?.() ?? '');
}
```

Mantık fonksiyonu, alanın bağlamını alır; bu bağlam `value`'yu alanın geçerli değerinin bir sinyali olarak, `state`'i alanın `FieldState`'i olarak ve aynı formdaki diğer alanları okumak için `valueOf(path)` ile `stateOf(path)` gibi yöntemleri açığa çıkarır. Fonksiyonun okuduğu herhangi bir sinyal reaktif bir bağımlılık haline gelir: `value()` değiştiğinde meta veri yeniden hesaplanır ve anahtarı okuyan herhangi bir şablon güncellenir.

## Bir alandan meta veri okuma

`hasMetadata(key)`, bu alanda herhangi bir şema kuralı anahtarı kaydettiyse `true` döndürür. `state.metadata(key)`, hiçbir kural anahtarı kaydetmediğinde `undefined`, aksi takdirde geçerli indirgenmiş değerin bir sinyalini döndürür.

```ts
registrationForm.username().hasMetadata(USERNAME_HELP); // herhangi bir metadata() kuralı bu anahtarı kaydettiyse true
```

O iç değerin şekli (kendisinin `undefined` olabilip olamayacağı, hangi türü tuttuğu) anahtarın indirgeyicisine bağlıdır. İndirgeyiciler bir sonraki bölümde ele alınmaktadır.

Anahtar kaydedilmemiş olabileceğinde, okumayı `hasMetadata()` ile koruyun:

```angular-html
@if (registrationForm.username().hasMetadata(USERNAME_HELP)) {
  <p class="help">{{ registrationForm.username().metadata(USERNAME_HELP)!() }}</p>
}
```

Bir kuralın anahtarı her zaman kaydettiğini bildiğinizde (çünkü aynı dosyadaki şema bunu yapar), `hasMetadata()` kontrolünü atlayabilir ve kompakt bir alternatif olarak isteğe bağlı zincirleme (optional chaining) kullanabilirsiniz:

```ts
const message = registrationForm.username().metadata(USERNAME_HELP)?.();
// message: string | undefined
```

Ya da kuralın kaydetmiş olduğu garanti edildiğinde, isteğe bağlı zinciri bırakın ve doğrulayın (assert):

```ts
const message = registrationForm.username().metadata(USERNAME_HELP)!();
// message: string | undefined (yine de, çünkü iç değer undefined olabilir)
```

Yukarıdaki bileşen örneği, bir `computed()` içinde isteğe bağlı zincirleme kullanır; böylece şablon, ilk kare için boş bir geri dönüş değeriyle birlikte düz bir `string`'e bağlanır.

Tek bir katkıcı için tüm API budur. Bir sonraki bölüm, birden fazla şema kuralı aynı anahtara katkıda bulunduğunda ne olduğunu ve bu katkıların indirgeyicilerle nasıl birleştirileceğini ele alır.

## Katkıları indirgeyicilerle birleştirme

Geçersiz kılma anlamı, belirli bir alandaki bir anahtara yalnızca bir kural katkıda bulunduğunda işe yarar. İki kural katkıda bulunur bulunmaz, ilk değer sessizce atılır:

```ts
const HELP = createMetadataKey<string>();

form(model, (path) => {
  metadata(path.username, HELP, () => 'Sistem genelinde benzersiz bir şey seçin.');
  metadata(path.username, HELP, () => 'Kullanıcı adları 3 ile 20 karakter arasındadır.');
});
```

Her iki kural da çalıştıktan sonra, `state.metadata(HELP)!()` yalnızca ikinci mesajı döndürür. Bu neredeyse hiçbir zaman istediğiniz şey değildir. Katkılar genellikle farklı kaynaklardan gelir: her biri yardım metni ekleyen `apply()` ile birleştirilmiş iki şema ya da her biri bir ipucu katkısında bulunan birden çok doğrulama kuralı.

Katkıları birleştirmek için `createMetadataKey()`'e bir indirgeyici geçirin. Bir indirgeyici, tek tek değerleri biriken bir sonuca nasıl katlayacağını açıklar:

```ts
import {createMetadataKey, MetadataReducer} from '@angular/forms/signals';

const HELP = createMetadataKey<string, string[]>(MetadataReducer.list());

form(model, (path) => {
  metadata(path.username, HELP, () => 'Sistem genelinde benzersiz bir şey seçin.');
  metadata(path.username, HELP, () => 'Kullanıcı adları 3 ile 20 karakter arasındadır.');
});

// state.metadata(HELP)!() === [
//   'Sistem genelinde benzersiz bir şey seçin.',
//   'Kullanıcı adları 3 ile 20 karakter arasındadır.',
// ]
```

`createMetadataKey<TWrite, TAcc>` üzerindeki iki tür parametresine dikkat edin: ilki her kuralın katkıda bulunduğu tür, ikincisi indirgeyicinin ürettiği türdür. `list()` ile kurallar bir `string` katkısında bulunur ve alan bir `string[]` okur.

### Yerleşik indirgeyiciler

Angular, [`MetadataReducer`](api/forms/signals/MetadataReducer) ad alanında altı yerleşik indirgeyici sağlar. `override()`, biraz farklı anlamlara sahip iki biçime sahiptir ve tabloda ayrı ayrı listelenmiştir:

| İndirgeyici    | Biriktirici türü      | Ne yapar                                                                   | Başlangıç değeri |
| -------------- | --------------------- | -------------------------------------------------------------------------- | ---------------- |
| `list<T>()`    | `T[]`                 | `T \| undefined` katkıları kabul eder; `undefined` olmayan değerleri ekler | `[]`             |
| `or()`         | `boolean`             | Herhangi bir katkı `true` ise `true`                                       | `false`          |
| `and()`        | `boolean`             | Yalnızca her katkı `true` ise `true`                                       | `true`           |
| `min()`        | `number \| undefined` | Katkıda bulunulan en küçük sayıyı tutar                                    | `undefined`      |
| `max()`        | `number \| undefined` | Katkıda bulunulan en büyük sayıyı tutar                                    | `undefined`      |
| `override()`   | `T \| undefined`      | Son katkı öncekini değiştirir (varsayılan)                                 | `undefined`      |
| `override(fn)` | `T`                   | Aynısı, ancak sağlanan bir başlangıç değeriyle                             | `fn()`           |

`list()`, öğe türü biriktiricisinin eleman türünden daha geniş olan tek yerleşik indirgeyicidir. Bir kural `undefined` katkısında bulunabilir ve indirgeyici onu sessizce düşürür. Yerleşik `PATTERN` anahtarı, mantık fonksiyonu `undefined` döndüren dinamik `pattern()` kurallarını bu şekilde işler: `undefined` katkısı, son regex listesine dahil edilmek yerine atlanır.

### Yerleşik doğrulayıcı anahtarları indirgeyicileri nasıl kullanır

`MetadataReducer.min()` ve `MetadataReducer.max()` indirgeyici olsa da, bunların doğrulayıcı olmadığını öğrenmek sizi şaşırtabilir. `MetadataReducer.min()` bir anahtara yapılan en küçük katkıyı seçerken, `min()` doğrulayıcısı bir alanın değerine bir alt sınır uygular. Aynı adı paylaşırlar ama farklı sorunları çözerler.

Yerleşik kısıtlama anahtarları, indirgeyicilerini kısıtlama için "en katı"nın ne anlama geldiğine göre seçer; bu da çoğu zaman anahtarın adının önerdiğinin tam tersidir:

| Anahtar      | İndirgeyici      | Gerekçe                                                                                                                                     |
| ------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `REQUIRED`   | `or()`           | Herhangi bir `required()` kuralı `true` olarak değerlendirilirse, alan zorunludur.                                                          |
| `MIN`        | `max()`          | Bir minimum-değer kısıtlaması en büyük olduğunda en katıdır. Bir kural `>= 5` ve diğeri `>= 10` gerektirirse, geçerli minimum `10`'dur.     |
| `MAX`        | `min()`          | Bir maksimum-değer kısıtlaması en küçük olduğunda en katıdır. Bir kural `100` ile sınırlarsa ve diğeri `50` ile, geçerli maksimum `50`'dir. |
| `MIN_LENGTH` | `max()`          | `MIN` ile aynı mantık: gerekli en uzun uzunluk kazanır.                                                                                     |
| `MAX_LENGTH` | `min()`          | `MAX` ile aynı mantık: izin verilen en kısa uzunluk kazanır.                                                                                |
| `PATTERN`    | `list<RegExp>()` | Her `pattern()` çağrısı bir regex katkısında bulunur; değer bunların tümüyle eşleşmelidir.                                                  |

Bu "en katı olan kazanır" eşleştirmesi, iki birleştirilmiş şemada `min(path.age, 18)` ve `min(path.age, 21)` çağırmanın neden doğru çalıştığının nedenidir. Her çağrı kendi belirli sınırını uygulayan kendi doğrulayıcısını kaydeder (böylece her iki sınırın da altındaki bir değer doğrulamayı geçemez). Ayrı olarak, her çağrı genel `MIN` anahtarına katkıda bulunur ve `state.metadata(MIN)!()` toplamı (`21`) raporlar; böylece kullanıcı arayüzü ve özel denetimler geçerli minimumu okuyabilir.

### Özel bir indirgeyici yazma

Kendi indirgeyicinizi yazmak istediğinizde, `MetadataReducer<TAcc, TItem>` arayüzüyle eşleşen bir nesne uygulayın:

```ts
interface MetadataReducer<TAcc, TItem> {
  reduce: (acc: TAcc, item: TItem) => TAcc;
  getInitial: () => TAcc;
}
```

Yerleşiklerden hiçbiri ihtiyaç duyduğunuz anlamla eşleşmediğinde özel bir indirgeyici tanımlayabilirsiniz. Örneğin, herhangi bir kural tarafından katkıda bulunulan en önemli düzeyi tutan bir `SEVERITY` anahtarı:

```ts
import {createMetadataKey, type MetadataReducer} from '@angular/forms/signals';

type Severity = 'info' | 'warning' | 'error';

const SEVERITY_RANK: Record<Severity, number> = {info: 0, warning: 1, error: 2};

const maxSeverity: MetadataReducer<Severity | undefined, Severity> = {
  reduce(acc, item) {
    if (acc === undefined) return item;
    return SEVERITY_RANK[item] > SEVERITY_RANK[acc] ? item : acc;
  },
  getInitial: () => undefined,
};

export const SEVERITY = createMetadataKey<Severity, Severity | undefined>(maxSeverity);
```

Artık herhangi bir sayıda kural bir önem düzeyi katkısında bulunabilir ve alan en yükseğini raporlar:

```ts
form(model, (path) => {
  metadata(path.password, SEVERITY, () => 'info');
  metadata(path.password, SEVERITY, ({value}) => (value().length < 12 ? 'warning' : 'info'));
  metadata(path.password, SEVERITY, ({value}) =>
    /password|1234/i.test(value()) ? 'error' : 'info',
  );
});
```

İndirgeyici, herhangi bir katkının sinyalleri değiştiğinde çalışır; böylece `state.metadata(SEVERITY)!()`, tüm kurallar genelindeki geçerli en kötü durumla senkronize kalır.

TIP: İndirgeyicilerinizi saf tutun: `reduce()` yalnızca iki argümanına bağlı olmalıdır ve `getInitial()` her çağrıldığında aynı değeri döndürmelidir. İndirgeyiciler, herhangi bir katkının sinyalleri değiştiğinde yeniden yürütülen reaktif bir hesaplamanın içinde çalışır, bu yüzden saf olmayan indirgeyiciler tutarsız meta veri üretir.

## Yönetilen meta veriyle yaşam döngüsü farkındalığına sahip nesneler ekleme

Yönetilen meta veri, bir alanda reaktif bir değer yerine yaşam döngüsü farkındalığına sahip bir nesne depolar. Dış veri getiren bir `resource()`, dış bir sisteme senkronize eden bir `effect()` ya da tek bir alanla sınırlandırılmış bir servis tutamacı gibi alan başına nesneler için kullanın.

### Yönetilen bir anahtar oluşturma

Yönetilen bir anahtar tanımlamak istediğinizde, `createManagedMetadataKey<TRead, TWrite>(create)` çağırın. Geçtiğiniz `create` fonksiyonu, anahtarın tuttuğu değeri üretir.

```ts
import {Signal} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {createManagedMetadataKey} from '@angular/forms/signals';

export interface UrlPreview {
  title: string;
  description?: string;
  image?: string;
}

export const URL_PREVIEW = createManagedMetadataKey((_state, url: Signal<string | undefined>) => {
  return httpResource<UrlPreview>(() => {
    const currentUrl = url();
    return currentUrl ? {url: '/api/url-preview', params: {url: currentUrl}} : undefined;
  });
});
```

`create` fonksiyonu, alanın `FieldState`'ini ve bu anahtar için `metadata()` kurallarının katkıda bulunduğu verinin bir `Signal<TAcc>`'ını alır ve alanda yaşaması gereken nesneyi döndürür. Dönüş değeri olduğu gibi depolanır: yönetilmeyen anahtarların aksine, çerçeve onu bir `computed()` içine sarmaz.

`create`, bir alan oluşturulduğunda, alanın enjeksiyon bağlamı içinde bir kez çalışır. Bu, `create` içinde `inject()`, `resource()` ve `effect()` çağırmanıza olanak tanır ve temizlemeyi alanın yaşam döngüsüne bağlar: alan yok edildiğinde, Angular enjeksiyon bağlamını yok eder ve orada kaydettiğiniz herhangi bir `resource()`, `effect()` veya `DestroyRef` geri çağırması otomatik olarak temizlenir.

`create`'in kendisi reaktif olmadığından, sinyal değişikliklerine yanıt vermesi gereken herhangi bir davranış, o ilk çağrı sırasında kurulan bir `effect()`, `resource()` veya `httpResource()` içinde yer almalıdır. `URL_PREVIEW` bu kalıbı gösterir: `httpResource()`, URL sinyalini istek fonksiyonunun içinde okur, böylece sinyal her değiştiğinde istek yeniden çalışır. Şema kuralı (`metadata(path.url, URL_PREVIEW, ({value}) => value())`) hangi verinin besleneceğine karar verir; yönetilen anahtar onunla ne yapacağına karar verir.

### Bir formda yönetilen anahtar kullanma

Bir formda yönetilen bir anahtar kullanmanız gerektiğinde, anahtar için bir `metadata()` kuralı kaydedin ve ardından döndürülen nesneyi alan durumundan okuyun.

```angular-ts
import {Component, computed, signal} from '@angular/core';
import {applyEach, form, metadata, FormField} from '@angular/forms/signals';
import {URL_PREVIEW} from './url-preview';

@Component({
  selector: 'app-link-editor',
  imports: [FormField],
  template: `
    <form>
      @for (link of linksForm.links; track link) {
        <fieldset>
          <label>
            URL
            <input [formField]="link.url" />
          </label>
          <!-- Bu bağlantının url alanı için URL_PREVIEW anahtarını oku; sonuç, create fonksiyonunun ürettiği resource'tur -->
          @let preview = link.url().metadata(URL_PREVIEW);
          @if (preview?.isLoading()) {
            <p>Önizleme yükleniyor...</p>
          } @else if (preview?.hasValue() && preview.value(); as data) {
            <article class="preview">
              <h3>{{ data.title }}</h3>
              @if (data.description) {
                <p>{{ data.description }}</p>
              }
            </article>
          } @else if (preview?.error()) {
            <p class="error">Önizleme yüklenemedi.</p>
          }
        </fieldset>
      }
      <button type="button" (click)="addLink()">Bağlantı ekle</button>
    </form>
  `,
})
export class LinkEditor {
  linksModel = signal({links: [{url: ''}]});

  linksForm = form(this.linksModel, (path) => {
    // URL_PREVIEW anahtarını her bağlantının url alanına kaydet.
    // applyEach şemayı öğe başına çalıştırır, böylece create() her bağlantı için
    // bir kez çalışır ve her bağlantı kendi resource'unu alır.
    applyEach(path.links, (itemPath) => {
      metadata(itemPath.url, URL_PREVIEW, ({value}) => value());
    });
  });

  addLink() {
    this.linksForm.links().value.update((links) => [...links, {url: ''}]);
  }
}
```

Her dizi öğesi kendi `URL_PREVIEW` resource'unu alır çünkü `applyEach`, şema kurallarını her öğeye bağımsız olarak kaydeder. Kullanıcı bir bağlantı eklediğinde, yeni öğenin alanı için `create` çalışır. Bir bağlantı kaldırıldığında (burada gösterilmemiştir ama yaygın bir kalıptır), çerçeve o alanın enjektörünü resource ile birlikte söker.

## Sonraki adımlar

Meta verinin var olma nedeninin, reaktif verinin şema bileşimi boyunca alanla birlikte hareket edebilmesi, kurallar genelinde birikebilmesi ve alanın yaşam döngüsüyle birlikte sökülebilmesi olduğunu unutmayın. Angular'ın yerleşik doğrulayıcılarının kullandığı aynı sistemden yararlanır ve kendi kullanım durumlarınıza göre uyarlanabilir.

Ayrıntılı API belgeleri için bkz:

- [`createMetadataKey()`](api/forms/signals/createMetadataKey) - İsteğe bağlı indirgeyiciyle bir meta veri anahtarı tanımlar
- [`createManagedMetadataKey()`](api/forms/signals/createManagedMetadataKey) - Yaşam döngüsü farkındalığına sahip bir meta veri anahtarı tanımlar
- [`metadata()`](api/forms/signals/metadata) - Bir şemada bir meta veri anahtarına değer katkısında bulunur
- [`MetadataReducer`](api/forms/signals/MetadataReducer) - Katkıları birleştirmek için yerleşik indirgeyiciler

Signal Forms ile ilgili ek kılavuzlar için şuna göz atın:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/form-logic" title="Form mantığı ekleme" />
  <docs-pill href="guide/forms/signals/validation" title="Doğrulama" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Alan durumu yönetimi" />
  <docs-pill href="guide/forms/signals/async-operations" title="Asenkron işlemler" />
</docs-pill-row>
