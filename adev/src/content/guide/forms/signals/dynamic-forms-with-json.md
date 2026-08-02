# JSON ile Dinamik Formlar

Bazı formlar yapısını derleme zamanında tanımlayamaz. Sunucu güdümlü formlar, yönetim panelleri, çok kiracılı uygulamalar ve CMS ile yönetilen içerik; alanlarını çalışma zamanında teslim edilen yapılandırmadan render etmek zorundadır. Bu yapılandırma genellikle bir arka uçtan, bir yönetim aracından veya kiracıya özel ayarlardan JSON olarak gelir.

Bu kılavuz, modeli, şeması, doğrulaması ve render'ı tek bir çalışma zamanı yapılandırmasından türetilen formların nasıl oluşturulacağını gösterir.

## JSON güdümlü formlar ne zaman kullanılır

Bu desen şu durumlarda iyi bir seçimdir:

- Bir arka uç, hangi alanların görüneceğini kullanıcı rolüne, özellik bayraklarına veya iş kurallarına göre tanımlıyorsa
- Geliştirici olmayan kişiler form yapısını bir yönetim paneli ya da CMS üzerinden yapılandırıyorsa
- Çok kiracılı bir uygulamadaki her kiracının yapılandırma olarak saklanan kendi form yapısı varsa
- Formların ön yüzü yeniden dağıtmadan evrilmesi gerekiyorsa

Yapı derleme zamanında biliniyorsa statik bir form kullanın (alanlar doğrudan bileşeninizde tanımlanır). Statik formlar her alanda tam TypeScript denetimi, ayrıca anlaşılır test ve araç desteği sağlar.

## Türlendirilmiş bir alan yapılandırması tanımlama

Alanları çalışma zamanı yapılandırmasından render etmek istediğinizde, her alanın yapısını yakalayan bir TypeScript türüyle başlayın. `kind` üzerinden ayrımlı bir birleşim (discriminated union), her varyantın kendi doğrulama seçeneklerini bildirmesine olanak tanır:

```ts
type FieldConfig =
  | {kind: 'text'; name: string; label: string; required?: boolean}
  | {kind: 'number'; name: string; label: string; required?: boolean; min?: number; max?: number};
```

Her varyantın bir adı, etiketi ve isteğe bağlı bir `required` bayrağı vardır. Sayı alanları ek olarak `min` ve `max` sınırlarını kabul eder. Yeni `kind` dalları ekleyerek yeni varyantlar ekleyebilirsiniz.

Somut bir yapılandırma şöyle görünebilir:

```ts
const profileConfig: FieldConfig[] = [
  {kind: 'text', name: 'fullName', label: 'Full Name', required: true},
  {kind: 'number', name: 'age', label: 'Age', required: true, min: 18, max: 120},
];
```

Pratikte bu `FieldConfig[]` genellikle arka ucunuzdan, bir yönetim panelinden veya bir CMS'ten gelir. Kısalık için aşağıdaki örnekler bileşen içi bir değişmez (literal) kullanır.

## Yapılandırmadan model oluşturma

Formun modeli her alan için, alanın türüne uygun bir varsayılan değere sahip bir girdiye ihtiyaç duyar. Küçük bir yardımcı bunu halleder:

```ts
function buildModel(configs: FieldConfig[]): Record<string, string | number | null> {
  const initial: Record<string, string | number | null> = {};
  for (const config of configs) {
    initial[config.name] = config.kind === 'number' ? null : '';
  }
  return initial;
}
```

Anahtarlar önceden bilinmediği için model `Record<string, string | number | null>` kullanır.

Ayrıca sayısal alanlar, boş bir alanın boş olarak okunması için `0` yerine `null` ile başlatılır. `0` ile [`required()`](api/forms/signals/required) alanı zaten doldurulmuş sayar ve sıfırın üzerindeki herhangi bir [`min()`](api/forms/signals/min) kısıtı, kullanıcı hiçbir şey girmeden alanı geçersiz olarak işaretler.

## Yapılandırmadan şema oluşturma

Şema da yapılandırmadan türetilir. Her girdiyi dolaşıp türüne uyan doğrulayıcıları uygulayabilirsiniz:

```ts
import {required, min, max, SchemaFn} from '@angular/forms/signals';

function buildSchema(configs: FieldConfig[]): SchemaFn<Record<string, string | number | null>> {
  return (path) => {
    for (const config of configs) {
      const fieldPath = path[config.name];

      if (config.required) {
        required(fieldPath);
      }

      if (config.kind === 'number') {
        if (config.min !== undefined) min(fieldPath, config.min);
        if (config.max !== undefined) max(fieldPath, config.max);
      }
    }
  };
}
```

Ayrımlı birleşim `config`'i her dalın içinde daraltır, bu yüzden `config.kind === 'number'` olduğunda `config.min` ve `config.max` doğru şekilde türlendirilir.

## Koşullu kuralları yapılandırmada ifade etme

Bazı doğrulama kuralları yalnızca belirli koşullarda anlamlıdır. Örneğin, ABD eyalet kodlarının yalnızca ülke ABD olduğunda doğrulanması gerekir. Bu bağımlılıkları, başka bir alanı ve o alanın eşit olması gereken değeri adlandıran bir `when` ayırıcısı ekleyerek yapılandırmada ifade edin:

```ts
type WhenCondition = {field: string; equals: string | number};

type FieldConfig =
  | {kind: 'text'; name: string; label: string; required?: boolean; when?: WhenCondition}
  | {
      kind: 'number';
      name: string;
      label: string;
      required?: boolean;
      min?: number;
      max?: number;
      when?: WhenCondition;
    };
```

`buildSchema()`'yı `when`'i bir [`applyWhen()`](api/forms/signals/applyWhen) çağrısına çevirecek şekilde güncelleyin. Ortak kural uygulama mantığı küçük bir closure'a taşınır, böylece koşullu ve koşulsuz dallar aynı fonksiyonu çağırır:

```ts
import {applyWhen, required, min, max, SchemaFn} from '@angular/forms/signals';

function buildSchema(configs: FieldConfig[]): SchemaFn<Record<string, string | number | null>> {
  return (rootPath) => {
    for (const config of configs) {
      const applyRules = (path: typeof rootPath) => {
        const fieldPath = path[config.name];
        if (config.required) required(fieldPath);
        if (config.kind === 'number') {
          if (config.min !== undefined) min(fieldPath, config.min);
          if (config.max !== undefined) max(fieldPath, config.max);
        }
      };

      if (config.when) {
        const {field, equals} = config.when;
        applyWhen(rootPath, ({valueOf}) => valueOf(rootPath[field]) === equals, applyRules);
      } else {
        applyRules(rootPath);
      }
    }
  };
}
```

`applyWhen()`'in koşulu doğru olduğunda içindeki kurallar etkinleşir. Koşul yanlış hale geldiğinde kurallar devre dışı kalır ve alanın doğrulama durumu temizlenir. Koşul fonksiyonu `valueOf(rootPath[field])` üzerinden okuduğu için, referans verilen alan her değiştiğinde form kapıyı yeniden değerlendirir.

`when` kullanan bir yapılandırma şöyle görünür:

```ts
const addressConfig: FieldConfig[] = [
  {kind: 'text', name: 'country', label: 'Country', required: true},
  {
    kind: 'text',
    name: 'stateCode',
    label: 'State',
    required: true,
    when: {field: 'country', equals: 'US'},
  },
];
```

`stateCode` alanı yalnızca `country` `'US'` olduğunda bir değer gerektirir. Başka bir ülke giren kullanıcılar `stateCode`'u boş bırakarak gönderimi engellemeden devam edebilir.

Daha karmaşık koşullar için (birden fazla alan, aralıklar veya eşitlik dışı denetimler) `WhenCondition`'ı ek ayırıcılarla (`in: string[]` veya `notEquals: string | number` gibi) genişletin ve her varyantı `buildSchema()` içinde çevirin. İlke aynıdır: yapılandırma veriyi taşır, `buildSchema()` onu `applyWhen()` çağrılarına çevirir.

Doğrulama yerine görünürlüğü koşula bağlamak için, alan yolunda [`hidden()`](api/forms/signals/hidden) kullanarak aynı deseni izleyin. Ayrıntılar için [Alanlarda `hidden()` durumunu yapılandırma](guide/forms/signals/form-logic#configuring-hidden-state-on-fields) bölümüne bakın.

## Tekrarlayan alanları yapılandırmada ifade etme

Bazı yapılandırmalar, telefon numaraları listesi, etiketler veya fatura kalemleri gibi çalışma zamanında büyüyüp küçülen alanlara ihtiyaç duyar. Yapılandırmaya bir `array` türü ekleyin ve öğe başına kuralların öğeler geldikçe ve gittikçe tek biçimde uygulanması için bunu [`applyEach()`](api/forms/signals/applyEach)'e çevirin.

`FieldConfig`'i bir `array` varyantıyla genişletin. Bu örnek string dizileri kullanır; öğe yapısını bir kayıtla değiştirerek aynı yaklaşım nesne dizilerine de ölçeklenir:

```ts
type FieldConfig =
  | {kind: 'text'; name: string; label: string; required?: boolean; when?: WhenCondition}
  | {
      kind: 'number';
      name: string;
      label: string;
      required?: boolean;
      min?: number;
      max?: number;
      when?: WhenCondition;
    }
  | {kind: 'array'; name: string; label: string; itemRequired?: boolean; when?: WhenCondition};
```

`buildModel()`'i dizi alanlarını boş bir diziyle başlatacak şekilde güncelleyin. Model `string[]`'i içerecek şekilde genişler:

```ts
function buildModel(configs: FieldConfig[]): Record<string, string | number | null | string[]> {
  const initial: Record<string, string | number | null | string[]> = {};
  for (const config of configs) {
    if (config.kind === 'number') initial[config.name] = null;
    else if (config.kind === 'array') initial[config.name] = [];
    else initial[config.name] = '';
  }
  return initial;
}
```

`buildSchema()`'yı öğe başına kuralları `applyEach()` ile uygulayacak şekilde güncelleyin. `Record<string, string | number | null | string[]>` modelinden gelen yol, `applyEach()`'in (ve `min()` / `max()`'ın) doğrudan tür denetimi yapabilmesi için fazla geniştir; bu yüzden her `kind` dalının içinde `fieldPath`'i uygun yapıya dönüştürün:

```ts
import {
  applyEach,
  applyWhen,
  required,
  min,
  max,
  SchemaFn,
  SchemaPath,
} from '@angular/forms/signals';

function buildSchema(
  configs: FieldConfig[],
): SchemaFn<Record<string, string | number | null | string[]>> {
  return (rootPath) => {
    for (const config of configs) {
      const applyRules = (path: typeof rootPath) => {
        const fieldPath = path[config.name];

        if (config.kind === 'array') {
          const arrayPath = fieldPath as unknown as SchemaPath<string[]>;
          if (config.itemRequired) {
            applyEach(arrayPath, (item) => required(item));
          }
          return;
        }

        if (config.required) required(fieldPath);

        if (config.kind === 'number') {
          const numberPath = fieldPath as unknown as SchemaPath<number | null>;
          if (config.min !== undefined) min(numberPath, config.min);
          if (config.max !== undefined) max(numberPath, config.max);
        }
      };

      if (config.when) {
        const {field, equals} = config.when;
        applyWhen(rootPath, ({valueOf}) => valueOf(rootPath[field]) === equals, applyRules);
      } else {
        applyRules(rootPath);
      }
    }
  };
}
```

Her daldaki dönüşümler bilinçli birer kaçış kapısıdır: derleyicinin yapısal garantisini, çevreleyen `kind` denetiminin uyguladığı bir çalışma zamanı değişmezi karşılığında takas edersiniz. Her dönüşüm bir `kind` bloğuyla sınırlıdır, bu yüzden varsayım yerel kalır ve denetlenmesi kolaydır.

`array` türünü kullanan bir yapılandırma şöyle görünür:

```ts
const contactConfig: FieldConfig[] = [
  {kind: 'text', name: 'fullName', label: 'Full name', required: true},
  {kind: 'array', name: 'phoneNumbers', label: 'Phone numbers', itemRequired: true},
];
```

Bir dizi alanını render etmek için `@for` ile dolaşın ve model sinyalini güncelleyerek kullanıcıların öğe eklemesine ya da kaldırmasına izin verin. Yinelemenin dizi yapısını görebilmesi için [`FieldTree`](api/forms/signals/FieldTree) döndüren türlendirilmiş bir erişimci ekleyin ve modeli büyütüp küçültecek metotlar tanımlayın:

```ts
import {FieldTree} from '@angular/forms/signals';

// bileşen sınıfının içinde
asArrayField(name: string): FieldTree<string[]> {
  return this.dynamicForm[name] as unknown as FieldTree<string[]>;
}

addItem(name: string) {
  this.model.update(current => ({
    ...current,
    [name]: [...(current[name] as string[]), ''],
  }));
}

removeItem(name: string, index: number) {
  this.model.update(current => ({
    ...current,
    [name]: (current[name] as string[]).filter((_, i) => i !== index),
  }));
}
```

`FieldTree<string[]>` yinelenebilirdir, bu yüzden `@for` onu dolaşabilir; her öğe `[formField]`'i doğrudan karşılayan bir `FieldTree<string>`'tir. Yaprak alanlar bunun yerine `Field<T>` erişimcilerini kullanabilir; çünkü `Field<T>`, yineleme olmadan çağrılabilir imzadır.

Şablonda bir dizi durumunu şöyle render edin:

```angular-html
@case ('array') {
  <fieldset>
    <legend>{{ config.label }}</legend>
    @for (item of asArrayField(config.name); track item) {
      <input type="text" [formField]="item" />
      <button type="button" (click)="removeItem(config.name, $index)">Remove</button>
    }
    <button type="button" (click)="addItem(config.name)">Add</button>
  </fieldset>
}
```

`addItem()` metodu modeli genişletir; form dizinin alanlarını otomatik olarak yeniden türetir. Yeni öğeler taze doğrulama durumuyla başlar. `removeItem()` modeli filtreler; kaldırılan öğenin alan durumu da onunla birlikte gider.

### Öğe kimliğini izleme

Signal Forms, bir nesne dizisindeki her öğeyi kimliğine göre izler. Belirli bir konumdaki alana bir referans sakladığınızda, bu referans konumu değil, altındaki veriyi takip eder. Saklanan referans üzerinden durum okumak, veri taşınmış olsa bile veriyi döndürür:

```ts
const contactModel = signal([
  {name: 'Alice', phone: '555-0001'},
  {name: 'Bob', phone: '555-0002'},
]);

const contactForm = form(contactModel);

// Şu anda 0. indeksteki alana (Alice) bir referans tut.
const aliceField = contactForm[0];

// Dizi öğelerini yer değiştir: Bob 0. indekste, Alice 1. indekste.
contactModel.update(([alice, bob]) => [bob, alice]);

// Tutulan referans yer değiştirmeden sonra da hâlâ Alice'in alanına işaret ediyor.
console.log(aliceField().value().phone); // '555-0001' (Alice'in numarası)
console.log(contactForm[0]().value().phone); // '555-0002' (Bob, artık 0. indekste)
```

Bu kimlik izleme, referans verilen öğe dizide kaldığı sürece sıralama, yeniden düzenleme veya filtreleme sırasında hataları önler. Saklanan alan referansları dizi sırası değiştiğinde bile geçerli kalır; referans verilen öğenin kendisini kaldırmak ise tutulan referansı öksüz bırakır.

İlkel değerlerden oluşan diziler için (yukarıdaki `phoneNumbers` örneği) Signal Forms öğeleri konuma göre izler: 0. indeks her zaman o anda 0. konumdaki değeri ifade eder.

Buradaki kimlik, veritabanı anahtarı gibi mantıksal bir kimlik değil, JavaScript nesne referansıdır. Diziyi yeni serileştirilmiş nesnelerle değiştirirseniz (örneğin bir sunucu yeniden yüklemesinden sonra), her öğenin `id`'si değişmemiş olsa bile alan durumu mantıksal öğeyi takip etmez. Garanti; sıralama, yeniden düzenleme ve filtreleme gibi bellek içi işlemleri kapsar, veri yenilemeyi değil.

## Yapılandırmayı doğrulama

Dış kaynaklardan gelen yapılandırmaların, form oluşturulmadan önce doğrulanması gerekir. Güvenilmeyen JSON'da birkaç hata biçimi gizlenebilir:

- Yinelenen `name` değerleri önceki model girdilerinin üzerine yazar ve şablondaki `track config.name` ifadesini bozar.
- Var olmayan bir alanı adlandıran bir `when` yan tümcesi, koşul ilk değerlendirildiğinde çalışma zamanında başarısız olur.
- Bir `array` alanıyla karşılaştıran bir `when` yan tümcesinin tanımlı bir eşitlik anlamı yoktur.
- Türü, referans verilen alanın türüyle eşleşmeyen bir `when.equals` değeri sessizce hiçbir zaman eşleşmez ve koşullu davranışı kural hiç etkin değilmiş gibi gizler.

Dördünü de sınırda yakalayın:

```ts
function validateConfigs(configs: FieldConfig[]): FieldConfig[] {
  const knownNames = new Set<string>();

  for (const config of configs) {
    if (knownNames.has(config.name)) {
      throw new Error(`Duplicate field name in config: "${config.name}"`);
    }
    knownNames.add(config.name);
  }

  for (const config of configs) {
    if (!config.when) continue;
    if (!knownNames.has(config.when.field)) {
      throw new Error(
        `Field "${config.name}" references unknown field "${config.when.field}" in its 'when' condition.`,
      );
    }
    const referenced = configs.find((c) => c.name === config.when!.field)!;
    if (referenced.kind === 'array') {
      throw new Error(
        `Field "${config.name}" cannot use 'when' to compare against array field "${config.when.field}".`,
      );
    }
    const expected = referenced.kind === 'text' ? 'string' : 'number';
    if (typeof config.when.equals !== expected) {
      throw new Error(
        `Field "${config.name}" compares ${referenced.kind} field "${config.when.field}" against a ${typeof config.when.equals} value; expected a ${expected}.`,
      );
    }
  }

  return configs;
}
```

İlk geçiş benzersizliği zorunlu kılar; ikinci geçiş her `when` yan tümcesini dolaşarak referans verilen alanın var olduğunu, bir dizi olmadığını ve doğru türde bir değerle karşılaştırıldığını doğrular. Fonksiyon başarı durumunda yapılandırmaları değiştirmeden döndürür, böylece yapılandırmaları bileşende tutan alan başlatıcısıyla temiz bir şekilde birleşir. Hatalar, daha sonra anlaşılmaz form davranışları olarak değil, uygulamanız ile yukarı akış kaynağı arasındaki sınırda ortaya çıkar.

## Formu dinamik olarak render etme

Bileşende, yapılandırmaları dolaşmak için `@for` ve doğru girdi kontrolünü seçmek için `kind` üzerinde `@switch` kullanın:

```angular-ts
import {Component, signal} from '@angular/core';
import {Field, FieldTree, form, FormField, FormRoot} from '@angular/forms/signals';

@Component({
  selector: 'app-dynamic-form',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="dynamicForm">
      @for (config of configs; track config.name) {
        @switch (config.kind) {
          @case ('text') {
            <label>
              {{ config.label }}
              <input type="text" [formField]="asTextField(config.name)" />
            </label>
          }
          @case ('number') {
            <label>
              {{ config.label }}
              <input type="number" [formField]="asNumberField(config.name)" />
            </label>
          }
          @case ('array') {
            <fieldset>
              <legend>{{ config.label }}</legend>
              @for (item of asArrayField(config.name); track item; let i = $index) {
                <input type="text" [formField]="item" />
                <button type="button" (click)="removeItem(config.name, i)">Remove</button>
              }
              <button type="button" (click)="addItem(config.name)">Add</button>
            </fieldset>
          }
        }
      }
    </form>
  `,
})
export class DynamicForm {
  configs: FieldConfig[] = validateConfigs([
    {kind: 'text', name: 'fullName', label: 'Full Name', required: true},
    {kind: 'number', name: 'age', label: 'Age', required: true, min: 18, max: 120},
    {kind: 'array', name: 'phoneNumbers', label: 'Phone numbers', itemRequired: true},
  ]);

  model = signal(buildModel(this.configs));

  dynamicForm = form(this.model, buildSchema(this.configs));

  asTextField(name: string): Field<string> {
    // <input type="text"> Field<string> gerektirir.
    return this.dynamicForm[name] as unknown as Field<string>;
  }

  asNumberField(name: string): Field<number | null> {
    // <input type="number"> Field<number | null> gerektirir.
    return this.dynamicForm[name] as unknown as Field<number | null>;
  }

  asArrayField(name: string): FieldTree<string[]> {
    // @for'un diziyi dolaşabilmesi için Field değil FieldTree.
    return this.dynamicForm[name] as unknown as FieldTree<string[]>;
  }

  addItem(name: string) {
    this.model.update((current) => ({
      ...current,
      [name]: [...(current[name] as string[]), ''],
    }));
  }

  removeItem(name: string, index: number) {
    this.model.update((current) => ({
      ...current,
      [name]: (current[name] as string[]).filter((_, i) => i !== index),
    }));
  }
}
```

Şablon tür denetimi `dynamicForm[name]`'i bağımsız bir ifade olarak ele alır, bu yüzden `config.kind` üzerindeki `@switch` daraltması indeksli erişime ulaşmaz. Erişimciler bu daraltmayı bağlama noktasında bir dönüşüm olarak yeniden ifade eder ve eşleşen `kind` dalı, daraltılan türün çalışma zamanında doğru olduğunu garanti eder.

Model ve şema, bileşen oluşturulurken aynı `FieldConfig[]`'ten türetildiği için belirli bir yapılandırma açısından birbirinden ayrışamazlar. Yukarıdaki örnek, bileşen oluşturulduğunda yapılandırmanın senkron olarak hazır olduğunu varsayar.

## Sonraki adımlar

JSON güdümlü formlar, modellerini ve şemalarını aynı `FieldConfig[]`'ten türeterek hizalı tutar. Bu kılavuzdaki her genişletme (koşullu kurallar, tekrarlayan alanlar) türü genişletir ve bu hizalamayı korurken `buildSchema()` içine bir çeviri adımı ekler. Yapılandırma nereden gelirse gelsin ya da nasıl büyürse büyüsün, model ve şema birbirine kilitli kalır.

Signal Forms'un diğer yönlerini ele alan ilgili kılavuzlar için şunlara göz atın:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/schemas" title="Şemalar ve şema birleştirilebilirliği" />
  <docs-pill href="guide/forms/signals/validation" title="Doğrulama" />
  <docs-pill href="guide/forms/signals/form-logic" title="Form mantığı ekleme" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Alan durumu yönetimi" />
</docs-pill-row>

Ayrıntılı API belgeleri için bakınız:

- [`form()`](api/forms/signals/form) - Bir model sinyalinden form oluşturur
- [`applyWhen()`](api/forms/signals/applyWhen) - Reaktif duruma göre bir şemayı koşullu uygular
- [`applyEach()`](api/forms/signals/applyEach) - Bir dizi alanındaki her öğeye bir şema uygular
- [`FieldTree`](api/forms/signals/FieldTree) - `form()` tarafından sunulan, gezinilebilir alan ağacı
- [`SchemaFn`](api/forms/signals/SchemaFn) - Şema fonksiyonları için tür imzası
