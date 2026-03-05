# Expression Syntax

Angular ifadeleri JavaScript'e dayalidir, ancak bazi onemli yonlerden farklilik gosterir. Bu rehber, Angular ifadeleri ile standart JavaScript arasindaki benzerlikleri ve farkliliklari aciklar.

## Value literals

Angular, JavaScript'ten bir [literal deger](https://developer.mozilla.org/en-US/docs/Glossary/Literal) alt kumesini destekler.

### Supported value literals

| Literal turu           | Ornek degerler                  |
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

### Unsupported value literals

| Literal turu | Ornek degerler |
| ------------ | -------------- |
| BigInt       | `1n`           |

## Globals

Angular ifadeleri asagidaki [global degiskenleri](https://developer.mozilla.org/en-US/docs/Glossary/Global_object) destekler:

- [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- [$any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

Baska hicbir JavaScript global degiskeni desteklenmez. Yaygin JavaScript global degiskenleri arasinda `Number`, `Boolean`, `NaN`, `Infinity`, `parseInt` ve daha fazlasi bulunur.

## Local variables

Angular, belirli baglamlarda ifadelerde kullanilmak uzere ozel yerel degiskenleri otomatik olarak kullanilabilir hale getirir. Bu ozel degiskenler her zaman dolar isareti karakteri (`$`) ile baslar.

Ornegin, `@for` bloklari dongu hakkinda bilgi iceren `$index` gibi birkac yerel degisken saglar.

## What operators are supported?

### Supported operators

Angular, standart JavaScript'ten asagidaki operatorleri destekler.

| Operator                      | Ornek(ler)                                     |
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

Angular ifadeleri ayrica asagidaki standart disi operatorleri de destekler:

| Operator                        | Ornek(ler)                     |
| ------------------------------- | ------------------------------ |
| [Pipe](/guide/templates/pipes)  | `{{ total \| currency }}`      |
| Optional chaining\*             | `someObj.someProp?.nestedProp` |
| Non-null assertion (TypeScript) | `someObj!.someProp`            |

NOTE: Optional chaining, standart JavaScript surumunden farkli davranir; Angular'in optional chaining operatorunun sol tarafi `null` veya `undefined` ise, `undefined` yerine `null` dondurur.

### Unsupported operators

| Operator              | Ornek(ler)                        |
| --------------------- | --------------------------------- |
| All bitwise operators | `&`, `&=`, `~`, `\|=`, `^=`, etc. |
| Object destructuring  | `const { name } = person`         |
| Array destructuring   | `const [firstItem] = items`       |
| Comma operator        | `x = (x++, x)`                    |
| new                   | `new Car()`                       |

## Lexical context for expressions

Angular ifadeleri, bilesen sinifinin baglami icinde ve ayrica ilgili [sablon degiskenleri](/guide/templates/variables), yerel degiskenler ve global degiskenler icinde degerlendirilir.

Bilesen sinif uyelerine referans verirken `this` her zaman ima edilir. Ancak, bir sablon ayni adla bir [sablon degiskeni](guide/templates/variables) bildirirse, degisken o uyeyi golgelar. Bu tur bir sinif uyesine belirsizlik olmadan referans vermek icin acikca `this.` kullanabilirsiniz. Bu, bir sinif uyesini golgeleyen bir `@let` bildirimi olustururken, ornegin signal daraltma amaclari icin faydali olabilir.

## Declarations

Genel olarak, Angular ifadelerinde bildirimler desteklenmez. Bunlar arasinda su durumlar yer alir ancak bunlarla sinirli degildir:

| Bildirimler     | Ornek(ler)                                  |
| --------------- | ------------------------------------------- |
| Variables       | `let label = 'abc'`, `const item = 'apple'` |
| Functions       | `function myCustomFunction() { }`           |
| Arrow Functions | `() => { }`                                 |
| Classes         | `class Rectangle { }`                       |

# Event listener statements

Olay isleyicileri ifadeler degil **ifadeler (statements)** dir. Angular ifadelerinin tum sozdizimini desteklemelerine ragmen, iki temel fark vardir:

1. Ifadeler atama operatorlerini **destekler** (ancak yapisal atama islemlerini desteklemez)
1. Ifadeler pipe'lari **desteklemez**
