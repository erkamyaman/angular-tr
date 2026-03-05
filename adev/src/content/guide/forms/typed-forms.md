# Typed Forms

Angular 14'ten itibaren, reaktif formlar varsayılan olarak kesin tür denetimine sahiptir.

Bu kılavuzun arka planı olarak, [Angular Reaktif Formları](guide/forms/reactive-forms) ile zaten tanıdık olmalısınız.

## Overview of Typed Forms

<docs-video src="https://www.youtube.com/embed/L-odCf4MfJc" alt="Typed Forms in Angular" />

Angular reaktif formlarıyla, bir _form modeli_ açıkça belirtirsiniz. Basit bir örnek olarak, bu temel kullanıcı giriş formunu düşünün:

```ts
const login = new FormGroup({
  email: new FormControl(''),
  password: new FormControl(''),
});
```

Angular, bu `FormGroup` ile etkileşim için birçok API sağlar. Örneğin, `login.value`, `login.controls`, `login.patchValue` vb. çağırabilirsiniz. (Tam API referansı için [API belgelerine](api/forms/FormGroup) bakın.)

Önceki Angular sürümlerinde, bu API'lerin çoğu türlerinde bir yerde `any` içeriyordu ve kontrollerin yapısıyla veya değerlerin kendisiyle etkileşim tür güvenli değildi. Örneğin: aşağıdaki geçersiz kodu yazabilirdiniz:

```ts
const emailDomain = login.value.email.domain;
```

Kesin türlenmiş reaktif formlarla, yukarıdaki kod derlenmez çünkü `email`'de `domain` özelliği yoktur.

Eklenen güvenliğe ek olarak, türler IDE'lerde daha iyi otomatik tamamlama ve form yapısını belirtmek için açık bir yol gibi çeşitli diğer iyileştirmeleri de mümkün kılar.

Bu iyileştirmeler şu anda yalnızca _reaktif_ formlara uygulanır ([_şablon odaklı_ formlara](guide/forms/template-driven-forms) değil).

## Untyped Forms

Türlenmemiş formlar hala desteklenmektedir ve daha önce olduğu gibi çalışmaya devam edecektir. Bunları kullanmak için `@angular/forms`'dan `Untyped` sembollerini içe aktarmanız gerekir:

```ts
const login = new UntypedFormGroup({
  email: new UntypedFormControl(''),
  password: new UntypedFormControl(''),
});
```

Her `Untyped` sembolü, önceki Angular sürümündekiyle tam olarak aynı anlama sahiptir. `Untyped` ön eklerini kaldırarak türleri kademeli olarak etkinleştirebilirsiniz.

## `FormControl`: Getting Started

En basit olası form tek bir kontrolden oluşur:

```ts
const email = new FormControl('angularrox@gmail.com');
```

Bu kontrol otomatik olarak `FormControl<string|null>` türüne sahip olarak çıkarılacaktır. TypeScript, bu türü [`FormControl` API'si](api/forms/FormControl) boyunca otomatik olarak uygulayacaktır; `email.value`, `email.valueChanges`, `email.setValue(...)` vb.

### Nullability

Merak edebilirsiniz: Bu kontrolün türü neden `null` içeriyor? Bunun nedeni, kontrolün herhangi bir zamanda reset çağrılarak `null` olabilmesidir:

```ts
const email = new FormControl('angularrox@gmail.com');
email.reset();
console.log(email.value); // null
```

TypeScript, kontrolün `null` olma olasılığını her zaman ele almanızı zorunlu kılacaktır. Bu kontrolü null olamaz yapmak istiyorsanız, `nonNullable` seçeneğini kullanabilirsiniz. Bu, kontrolün `null` yerine başlangıç değerine sıfırlanmasını sağlar:

```ts
const email = new FormControl('angularrox@gmail.com', {nonNullable: true});
email.reset();
console.log(email.value); // angularrox@gmail.com
```

Tekrar belirtmek gerekirse, bu seçenek `.reset()` çağrıldığında formunuzun çalışma zamanı davranışını etkiler ve dikkatli bir şekilde değiştirilmelidir.

### Specifying an Explicit Type

Çıkarıma güvenmek yerine türü belirtmek mümkündür. Başlangıç değeri `null` olan bir kontrolü düşünün. Başlangıç değeri `null` olduğundan, TypeScript istediğimizden daha dar olan `FormControl<null>` çıkarımını yapacaktır.

```ts
const email = new FormControl(null);
email.setValue('angularrox@gmail.com'); // Error!
```

Bunu önlemek için türü açıkça `string|null` olarak belirtiyoruz:

```ts
const email = new FormControl<string | null>(null);
email.setValue('angularrox@gmail.com');
```

## `FormArray`: Dynamic, Homogenous Collections

Bir `FormArray`, açık uçlu bir kontrol listesi içerir. Tür parametresi, her iç kontrolün türüne karşılık gelir:

```ts
const names = new FormArray([new FormControl('Alex')]);
names.push(new FormControl('Jess'));
```

Bir seferde birkaç giriş eklemeniz gerektiğinde `aliases.push()`'a bir kontrol dizisi iletin.

```ts
const aliases = new FormArray([new FormControl('ng')]);
aliases.push([new FormControl('ngDev'), new FormControl('ngAwesome')]);
```

Bu `FormArray`, `FormControl<string|null>` iç kontrol türüne sahip olacaktır.

Dizide birden fazla farklı öğe türüne sahip olmak istiyorsanız, `UntypedFormArray` kullanmalısınız çünkü TypeScript hangi öğe türünün hangi konumda olacağını çıkaramaz.

Bir `FormArray` ayrıca içerdiği tüm kontrolleri kaldırmak için bir `clear()` yöntemi sağlar:

```ts
const aliases = new FormArray([new FormControl('ngDev'), new FormControl('ngAwesome')]);
aliases.clear();
console.log(aliases.length); // 0
```

## `FormGroup` and `FormRecord`

Angular, numaralandırılmış anahtar kümesine sahip formlar için `FormGroup` türünü ve açık uçlu veya dinamik gruplar için `FormRecord` adlı bir tür sağlar.

### Partial Values

Giriş formunu tekrar düşünün:

```ts
const login = new FormGroup({
  email: new FormControl('', {nonNullable: true}),
  password: new FormControl('', {nonNullable: true}),
});
```

Herhangi bir `FormGroup`'ta, [kontrolleri devre dışı bırakmak mümkündür](api/forms/FormGroup). Devre dışı bırakılmış herhangi bir kontrol grubun değerinde görünmez.

Sonuç olarak, `login.value`'nun türü `Partial<{email: string, password: string}>`'dir. Bu türdeki `Partial`, her üyenin undefined olabileceği anlamına gelir.

Daha spesifik olarak, `login.value.email`'in türü `string|undefined`'dır ve TypeScript olası `undefined` değerini ele almanızı zorunlu kılacaktır (`strictNullChecks` etkinse).

Devre dışı bırakılmış kontrolleri _dahil eden_ değere erişmek ve böylece olası `undefined` alanlarını atlamak istiyorsanız, `login.getRawValue()` kullanabilirsiniz.

### Optional Controls and Dynamic Groups

Bazı formların mevcut olabilen veya olmayabilen, çalışma zamanında eklenip kaldırılabilen kontrolleri vardır. Bu kontrolleri _opsiyonel alanlar_ kullanarak temsil edebilirsiniz:

```ts
interface LoginForm {
  email: FormControl<string>;
  password?: FormControl<string>;
}

const login = new FormGroup<LoginForm>({
  email: new FormControl('', {nonNullable: true}),
  password: new FormControl('', {nonNullable: true}),
});

login.removeControl('password');
```

Bu formda türü açıkça belirtiyoruz, bu da `password` kontrolünü opsiyonel yapmamıza olanak tanır. TypeScript, yalnızca opsiyonel kontrollerin eklenebileceğini veya kaldırılabileceğini zorunlu kılacaktır.

### `FormRecord`

Bazı `FormGroup` kullanımları yukarıdaki kalıba uymaz çünkü anahtarlar önceden bilinmez. `FormRecord` sınıfı bu durum için tasarlanmıştır:

```ts
const addresses = new FormRecord<FormControl<string | null>>({});
addresses.addControl('Andrew', new FormControl('2340 Folsom St'));
```

`string|null` türünde herhangi bir kontrol bu `FormRecord`'a eklenebilir.

Hem dinamik (açık uçlu) hem de heterojen (kontroller farklı türlerde) bir `FormGroup`'a ihtiyacınız varsa, geliştirilmiş tür güvenliği mümkün değildir ve `UntypedFormGroup` kullanmalısınız.

Bir `FormRecord`, `FormBuilder` ile de oluşturulabilir:

```ts
const addresses = fb.record({'Andrew': '2340 Folsom St'});
```

## `FormBuilder` and `NonNullableFormBuilder`

`FormBuilder` sınıfı, yukarıdaki örneklerle aynı şekilde yeni türleri desteklemek üzere yükseltilmiştir.

Ek olarak, ek bir oluşturucu mevcuttur: `NonNullableFormBuilder`. Bu tür, her kontrolde `{nonNullable: true}` belirtmenin kısayoludur ve büyük null olamaz formlardan önemli ölçüde tekrarlayan kodu ortadan kaldırabilir. Bir `FormBuilder` üzerindeki `nonNullable` özelliğini kullanarak erişebilirsiniz:

```ts
const fb = new FormBuilder();
const login = fb.nonNullable.group({
  email: '',
  password: '',
});
```

Yukarıdaki örnekte, her iki iç kontrol de null olamaz olacaktır (yani `nonNullable` ayarlanacaktır).

Ayrıca `NonNullableFormBuilder` adını kullanarak enjekte edebilirsiniz.
