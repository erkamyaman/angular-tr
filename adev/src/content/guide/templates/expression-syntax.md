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

| Operatör                      | Örnek(ler)                                     |
| ----------------------------- | ---------------------------------------------- |
| Add / Concatenate             | `1 + 2`                                        |
| Subtract                      | `52 - 3`                                       |
| Multiply                      | `41 * 6`                                       |
| Divide                        | `20 / 4`                                       |
| Remainder (Modulo)            | `17 % 5`                                       |
| Exponentiation                | `10 ** 3`                                      |
| Parenthesis                   | `9 * (8 + 4)`                                  |
| Conditional (Ternary)         | `a > b ? true : false`                         |
| And (Logical)                 | `&&`                                           |
| Or (Logical)                  | `\|\|`                                         |
| Not (Logical)                 | `!`                                            |
| Nullish Coalescing            | `possiblyNullValue ?? 'default'`               |
| Comparison Operators          | `<`, `<=`, `>`, `>=`, `==`, `===`, `!==`, `!=` |
| Unary Negation                | `-x`                                           |
| Unary Plus                    | `+y`                                           |
| Property Accessor             | `person['name']`                               |
| typeof                        | `typeof 42`                                    |
| void                          | `void 1`                                       |
| in                            | `'model' in car`                               |
| instanceof                    | `car instanceof Automobile`                    |
| Assignment                    | `a = b`                                        |
| Addition Assignment           | `a += b`                                       |
| Subtraction Assignment        | `a -= b`                                       |
| Multiplication Assignment     | `a *= b`                                       |
| Division Assignment           | `a /= b`                                       |
| Remainder Assignment          | `a %= b`                                       |
| Exponentiation Assignment     | `a **= b`                                      |
| Logical AND Assignment        | `a &&= b`                                      |
| Logical OR Assignment         | `a \|\|= b`                                    |
| Nullish Coalescing Assignment | `a ??= b`                                      |
| Spread in object literals     | `{...obj, foo: 'bar'}`                         |
| Spread in array literals      | `[...arr, 1, 2, 3]`                            |
| Rest in function calls        | `fn(...args)`                                  |

Angular ifadeleri ayrıca aşağıdaki standart dışı operatörleri de destekler:

| Operatör                        | Örnek(ler)                     |
| ------------------------------- | ------------------------------ |
| [Pipe](/guide/templates/pipes)  | `{{ total \| currency }}`      |
| Optional chaining\*             | `someObj.someProp?.nestedProp` |
| Non-null assertion (TypeScript) | `someObj!.someProp`            |

NOTE: Optional chaining, standart JavaScript sürümünden farklı davranır; Angular'ın optional chaining operatörünün sol tarafı `null` veya `undefined` ise, `undefined` yerine `null` döndürür.

### Desteklenmeyen operatörler

| Operatör              | Örnek(ler)                        |
| --------------------- | --------------------------------- |
| All bitwise operators | `&`, `&=`, `~`, `\|=`, `^=`, etc. |
| Object destructuring  | `const { name } = person`         |
| Array destructuring   | `const [firstItem] = items`       |
| Comma operator        | `x = (x++, x)`                    |
| new                   | `new Car()`                       |

## İfadeler için sözcüksel bağlam

Angular ifadeleri, bileşen sınıfının bağlamı içinde ve ayrıca ilgili [şablon değişkenleri](/guide/templates/variables), yerel değişkenler ve global değişkenler içinde değerlendirilir.

Bileşen sınıf üyelerine referans verirken `this` her zaman ima edilir. Ancak, bir şablon aynı adla bir [şablon değişkeni](guide/templates/variables) bildirirse, değişken o üyeyi gölgeler. Bu tür bir sınıf üyesine belirsizlik olmadan referans vermek için açıkça `this.` kullanabilirsiniz. Bu, bir sınıf üyesini gölgeleyen bir `@let` bildirimi oluştururken, örneğin signal daraltma amaçları için faydalı olabilir.

## Bildirimler

Genel olarak, Angular ifadelerinde bildirimler desteklenmez. Bunlar arasında şu durumlar yer alır ancak bunlarla sınırlı değildir:

| Bildirimler     | Örnek(ler)                                  |
| --------------- | ------------------------------------------- |
| Variables       | `let label = 'abc'`, `const item = 'apple'` |
| Functions       | `function myCustomFunction() { }`           |
| Arrow Functions | `() => { }`                                 |
| Classes         | `class Rectangle { }`                       |

# Olay dinleyici ifadeleri

Olay işleyicileri ifadeler değil **ifadeler (statements)** dir. Angular ifadelerinin tüm sözdizimini desteklemelerine rağmen, iki temel fark vardır:

1. İfadeler atama operatörlerini **destekler** (ancak yapısal atama işlemlerini desteklemez)
1. İfadeler pipe'ları **desteklemez**
