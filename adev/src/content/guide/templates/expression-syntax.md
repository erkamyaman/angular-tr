# İfade Sözdizimi

Angular ifadeleri JavaScript'e dayalıdır, ancak bazı önemli yönlerden farklılık gösterir. Bu rehber, Angular ifadeleri ile standart JavaScript arasındaki benzerlikleri ve farklılıkları açıklar.

## Değer literalleri

Angular, JavaScript'ten bir [literal değer](https://developer.mozilla.org/en-US/docs/Glossary/Literal) alt kümesini destekler.

### Desteklenen değer literalleri

| Literal türü           | Örnek değerler                  |
| ---------------------- | ------------------------------- |
| String                 | `'Hello'`, `"World"`            |
| Boolean                | `true`, `false`                 |
| Number                 | `123`, `3.14`                   |
| Object                 | `{name: 'Alice'}`               |
| Array                  | `['Onion', 'Cheese', 'Garlic']` |
| null                   | `null`                          |
| RegExp                 | `/\d+/`                         |
| Template string        | `` `Hello ${name}` ``           |
| Tagged template string | `` tag`Hello ${name}` ``        |

### Desteklenmeyen değer literalleri

| Literal türü | Örnek değerler |
| ------------ | -------------- |
| BigInt       | `1n`           |

## Global değişkenler

Angular ifadeleri aşağıdaki [global değişkenleri](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) destekler:

- [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- [$any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

Başka hiçbir JavaScript global değişkeni desteklenmez. Yaygın JavaScript global değişkenleri arasında `Number`, `Boolean`, `NaN`, `Infinity`, `parseInt` ve daha fazlası bulunur.

## Yerel değişkenler

Angular, belirli bağlamlarda ifadelerde kullanılmak üzere özel yerel değişkenleri otomatik olarak kullanılabilir hale getirir. Bu özel değişkenler her zaman dolar işareti karakteri (`$`) ile başlar.

Örneğin, `@for` blokları döngü hakkında bilgi içeren `$index` gibi birkaç yerel değişken sağlar.

## Hangi operatörler desteklenir?

### Desteklenen operatörler

Angular, standart JavaScript'ten aşağıdaki operatörleri destekler.

| Operatör                    | Örnek(ler)                                     |
| --------------------------- | ---------------------------------------------- |
| Toplama / Birleştirme       | `1 + 2`                                        |
| Çıkarma                     | `52 - 3`                                       |
| Çarpma                      | `41 * 6`                                       |
| Bölme                       | `20 / 4`                                       |
| Kalan (Mod)                 | `17 % 5`                                       |
| Üs alma                     | `10 ** 3`                                      |
| Parantez                    | `9 * (8 + 4)`                                  |
| Koşullu (Üçlü)              | `a > b ? true : false`                         |
| Ve (Mantıksal)              | `&&`                                           |
| Veya (Mantıksal)            | `\|\|`                                         |
| Değil (Mantıksal)           | `!`                                            |
| Nullish birleştirme         | `possiblyNullValue ?? 'default'`               |
| Karşılaştırma operatörleri  | `<`, `<=`, `>`, `>=`, `==`, `===`, `!==`, `!=` |
| Tekli olumsuzlama           | `-x`                                           |
| Tekli artı                  | `+y`                                           |
| Özellik erişimi             | `person['name']`                               |
| typeof                      | `typeof 42`                                    |
| void                        | `void 1`                                       |
| in                          | `'model' in car`                               |
| instanceof                  | `car instanceof Automobile`                    |
| Atama                       | `a = b`                                        |
| Artırma                     | `a++`, `++a`                                   |
| Azaltma                     | `a--`, `--a`                                   |
| Toplama ataması             | `a += b`                                       |
| Çıkarma ataması             | `a -= b`                                       |
| Çarpma ataması              | `a *= b`                                       |
| Bölme ataması               | `a /= b`                                       |
| Kalan ataması               | `a %= b`                                       |
| Üs alma ataması             | `a **= b`                                      |
| Mantıksal VE ataması        | `a &&= b`                                      |
| Mantıksal VEYA ataması      | `a \|\|= b`                                    |
| Nullish birleştirme ataması | `a ??= b`                                      |
| Nesne literallerinde spread | `{...obj, foo: 'bar'}`                         |
| Dizi literallerinde spread  | `[...arr, 1, 2, 3]`                            |
| Fonksiyon çağrılarında rest | `fn(...args)`                                  |

Angular ifadeleri ayrıca aşağıdaki standart dışı operatörleri de destekler:

| Operatör                        | Örnek(ler)                     |
| ------------------------------- | ------------------------------ |
| [Pipe](/guide/templates/pipes)  | `{{ total \| currency }}`      |
| Optional chaining\*             | `someObj.someProp?.nestedProp` |
| Non-null assertion (TypeScript) | `someObj!.someProp`            |

### Güvenli gezinme geçişi

Angular 22'den önce, optional chaining operatörü (`?.`) sol taraf `null` veya `undefined` olduğunda `null` döndürüyordu; standart JavaScript'in `?.` operatörü ise `undefined` döndürür.
Angular 22'den itibaren, Angular ifadelerindeki optional chaining davranışı standart JavaScript davranışıyla hizalandı.

v22'ye geçiş sırasında `ng update` şematikleri, önceki davranışı korumak için mevcut ifadelere bir `$safeNavigationMigration` fonksiyonu ekler.

```html
{{ $safeNavigationMigration(foo?.bar) }}
```

`$safeNavigationMigration` **yalnızca geçici bir geçiş yardımcısıdır**. Derleyiciye, sarmalanan güvenli gezinme ifadesini standart JavaScript `?.` semantiği yerine eski `null` döndüren semantikle derlemesini söyler. Gerçek bir fonksiyon değildir ve TypeScript'ten çağrılamaz.

NOTE: `$safeNavigationMigration`'ın kaldırılabilmesi için ifadelerinizi `null` ile `undefined` ayrımına dayanmayacak şekilde geçirmeyi tercih edin. Bu fonksiyon Angular'ın gelecekteki bir sürümünde kaldırılabilir.

### Desteklenmeyen operatörler

| Operatör                | Örnek(ler)                      |
| ----------------------- | ------------------------------- |
| Tüm bitwise operatörler | `&`, `&=`, `~`, `\|=`, `^=` vb. |
| Nesne destructuring     | `const { name } = person`       |
| Dizi destructuring      | `const [firstItem] = items`     |
| Virgül operatörü        | `x = (x++, x)`                  |
| new                     | `new Car()`                     |

## İfadeler için sözcüksel bağlam

Angular ifadeleri, bileşen sınıfının bağlamı içinde ve ayrıca ilgili [şablon değişkenleri](/guide/templates/variables), yerel değişkenler ve global değişkenler içinde değerlendirilir.

Bileşen sınıf üyelerine referans verirken `this` her zaman ima edilir. Ancak, bir şablon aynı adla bir [şablon değişkeni](guide/templates/variables) bildirirse, değişken o üyeyi gölgeler. Bu tür bir sınıf üyesine belirsizlik olmadan referans vermek için açıkça `this.` kullanabilirsiniz. Bu, bir sınıf üyesini gölgeleyen bir `@let` bildirimi oluştururken, örneğin signal daraltma amaçları için faydalı olabilir.

## Bildirimler

Genel olarak, Angular ifadelerinde bildirimler desteklenmez. Bunlar arasında şu durumlar yer alır ancak bunlarla sınırlı değildir:

| Bildirimler        | Örnek(ler)                                  |
| ------------------ | ------------------------------------------- |
| Değişkenler        | `let label = 'abc'`, `const item = 'apple'` |
| Fonksiyonlar       | `function myCustomFunction() { }`           |
| Arrow fonksiyonlar | `() => { }`                                 |
| Sınıflar           | `class Rectangle { }`                       |

## Olay dinleyici ifadeleri

Olay işleyicileri ifadeler değil **ifadeler (statements)** dir. Angular ifadelerinin tüm sözdizimini desteklemelerine rağmen, iki temel fark vardır:

1. İfadeler atama operatörlerini **destekler** (ancak yapısal atama işlemlerini desteklemez)
1. İfadeler pipe'ları **desteklemez**
