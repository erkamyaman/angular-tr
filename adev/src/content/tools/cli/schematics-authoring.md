# Schematics Yazarlığı

Angular projelerinde çalışacak kendi şematiklerinizi oluşturabilirsiniz.
Kütüphane geliştiricileri genellikle şematikleri kütüphaneleriyle birlikte paketleyerek Angular CLI ile entegre ederler.
Ayrıca, Angular uygulamalarındaki dosya ve yapıları, geliştirme ortamınız için özelleştirmek ve standartlarınıza ve kısıtlamalarınıza uygun hale getirmek amacıyla manipüle etmek için bağımsız şematikler de oluşturabilirsiniz.
Şematikler zincirlenerek karmaşık işlemler gerçekleştirmek için diğer şematikleri çalıştırabilir.

Bir uygulamadaki kodu manipüle etmek hem çok güçlü hem de buna karşılık tehlikeli olma potansiyeline sahiptir.
Örneğin, zaten var olan bir dosya oluşturmak bir hata olur ve hemen uygulanırsa, o ana kadar uygulanan tüm diğer değişiklikleri iptal eder.
Angular Schematics araçları, sanal bir dosya sistemi oluşturarak yan etkilere ve hatalara karşı koruma sağlar.
Bir şematik, sanal dosya sistemine uygulanabilecek bir dönüşüm hattını tanımlar.
Bir şematik çalıştığında, dönüşümler bellekte kaydedilir ve yalnızca geçerli oldukları doğrulandıktan sonra gerçek dosya sisteminde uygulanır.

## Schematics Kavramları

Şematiklerin genel API'si, temel kavramları temsil eden sınıfları tanımlar.

- Sanal dosya sistemi bir `Tree` ile temsil edilir.
  `Tree` veri yapısı, bir _temel_ \(zaten var olan dosyalar kümesi\) ve bir _hazırlık alanı_ \(tabana uygulanacak değişikliklerin listesi\) içerir.
  Değişiklikler yaparken, aslında tabanı değiştirmezsiniz, bunun yerine bu değişiklikleri hazırlık alanına eklersiniz.

- Bir `Rule` nesnesi, bir `Tree` alan, dönüşümler uygulayan ve yeni bir `Tree` döndüren bir fonksiyon tanımlar.
  Bir şematiğin ana dosyası olan `index.ts`, şematiğin mantığını uygulayan bir kurallar kümesi tanımlar.

- Bir dönüşüm bir `Action` ile temsil edilir.
  Dört eylem türü vardır: `Create`, `Rename`, `Overwrite` ve `Delete`.

- Her şematik, bir `SchematicContext` nesnesiyle temsil edilen bir bağlamda çalışır.

Bir kurala geçirilen bağlam nesnesi, şematiğin çalışması için ihtiyaç duyabileceği yardımcı fonksiyonlara ve meta verilere erişim sağlar ve hata ayıklamaya yardımcı olan bir loglama API'si içerir.
Bağlam ayrıca, hazırlık ağacındaki değişikliklerin temel ağaca nasıl birleştirileceğini belirleyen bir _birleştirme stratejisi_ tanımlar.
Bir değişiklik kabul edilebilir, görmezden gelinebilir veya bir istisna fırlatabilir.

### Kuralları ve Eylemleri Tanımlama

[Schematics CLI](#schematics-cliı) ile yeni bir boş şematik oluşturduğunuzda, üretilen giriş fonksiyonu bir _kural fabrikasıdır_.
Bir `RuleFactory` nesnesi, bir `Rule` oluşturan üst düzey bir fonksiyon tanımlar.

```ts {header: "index.ts"}
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

// Fonksiyonu varsayılan olarak dışa aktarmanız gerekmez.
// Dosya başına birden fazla kural fabrikasına da sahip olabilirsiniz.
export function helloWorld(\_options: any): Rule {
   return (tree: Tree,\_context: SchematicContext) => {
    return tree;
  };
}
```

Kurallarınız, harici araçları çağırarak ve mantık uygulayarak projelerinizde değişiklikler yapabilir.
Örneğin, şematikteki bir şablonun barındırma projesine nasıl birleştirileceğini tanımlamak için bir kurala ihtiyacınız vardır.

Kurallar, `@schematics/angular` paketiyle sağlanan yardımcı fonksiyonları kullanabilir.
Modüller, bağımlılıklar, TypeScript, AST, JSON, Angular CLI çalışma alanları ve projeleri ile çalışmak için yardımcı fonksiyonlara bakın.

```ts {header: "index.ts"}
import {
  JsonAstObject,
  JsonObject,
  JsonValue,
  Path,
  normalize,
  parseJsonAst,
  strings,
} from '@angular-devkit/core';
```

### Şema ve Arayüzlerle Girdi Seçeneklerini Tanımlama

Kurallar, çağırandan seçenek değerlerini toplayabilir ve şablonlara enjekte edebilir.
Kurallarınız için mevcut seçenekler, izin verilen değerleri ve varsayılanlarıyla birlikte şematiğin JSON şema dosyası `<schematic>/schema.json` içinde tanımlanır.
Şema için TypeScript arayüzlerini kullanarak değişken veya numaralı veri türlerini tanımlayın.

Şema, şematikte kullanılan değişkenlerin türlerini ve varsayılan değerlerini tanımlar.
Örneğin, varsayımsal "Hello World" şematiği aşağıdaki şemaya sahip olabilir.

```json {header: "schema.json"}
{
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "default": "world"
    },
    "useColor": {
      "type": "boolean"
    }
  }
}
```

Angular CLI komut şematikleri için şema dosyalarının örneklerini [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json) içinde görebilirsiniz.

### Schematic İstemleri

Şematik _istemler_, şematik yürütmesine kullanıcı etkileşimi getirir.
Şematik seçeneklerini, kullanıcıya özelleştirilebilir bir soru görüntüleyecek şekilde yapılandırın.
İstemler, şematiğin yürütülmesinden önce görüntülenir ve ardından yanıtı seçeneğin değeri olarak kullanır.
Bu, kullanıcıların mevcut seçeneklerin tam kapsamı hakkında derinlemesine bilgiye ihtiyaç duymadan şematiğin çalışmasını yönlendirmesine olanak tanır.

"Hello World" şematiği, örneğin, kullanıcıdan adını isteyebilir ve bu adı varsayılan "world" adının yerine görüntüleyebilir.
Böyle bir istem tanımlamak için `name` değişkeninin şemasına bir `x-prompt` özelliği ekleyin.

Benzer şekilde, kullanıcının şematiğin hello eylemini gerçekleştirirken renk kullanıp kullanmayacağına karar vermesine izin vermek için bir istem ekleyebilirsiniz.
Her iki istemli şema aşağıdaki gibi olur.

```json {header: "schema.json"}
{
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "default": "world",
      "x-prompt": "What is your name?"
    },
    "useColor": {
      "type": "boolean",
      "x-prompt": "Would you like the response in color?"
    }
  }
}
```

#### İstem Kısa Biçim Sözdizimi

Bu örnekler, yalnızca sorunun metnini sağlayan kısa biçimli istem sözdizimini kullanır.
Çoğu durumda, gereken tek şey budur.
Ancak, iki istemin farklı türde girdi beklediğine dikkat edin.
Kısa biçim kullanıldığında, özelliğin şemasına göre en uygun tür otomatik olarak seçilir.
Örnekte, `name` istemi bir dize özelliği olduğu için `input` türünü kullanır.
`useColor` istemi, Boolean bir özellik olduğu için `confirmation` türünü kullanır.
Bu durumda, "yes" `true`'ya ve "no" `false`'a karşılık gelir.

Desteklenen üç girdi türü vardır.

| Girdi türü   | Ayrıntılar                                                |
| :----------- | :-------------------------------------------------------- |
| confirmation | Evet veya hayır sorusu; Boolean seçenekler için idealdir. |
| input        | Metin girdisi; dize veya sayı seçenekleri için idealdir.  |
| list         | Önceden tanımlanmış izin verilen değerler kümesi.         |

Kısa biçimde, tür özelliğin türünden ve kısıtlamalarından çıkarılır.

| Özellik şeması    | İstem türü                                      |
| :---------------- | :---------------------------------------------- |
| "type": "boolean" | confirmation \("yes"=`true`, "no"=`false`\)     |
| "type": "string"  | input                                           |
| "type": "number"  | input \(yalnızca geçerli sayılar kabul edilir\) |
| "type": "integer" | input \(yalnızca geçerli sayılar kabul edilir\) |
| "enum": [...]     | list \(enum üyeleri liste seçenekleri olur\)    |

Aşağıdaki örnekte, özellik numaralı bir değer alır, bu nedenle şematik otomatik olarak liste türünü seçer ve olası değerlerden bir menü oluşturur.

```json {header: "schema.json"}
{
  "style": {
    "description": "The file extension or preprocessor to use for style files.",
    "type": "string",
    "default": "css",
    "enum": ["css", "scss", "sass", "less", "styl"],
    "x-prompt": "Which stylesheet format would you like to use?"
  }
}
```

İstem çalışma zamanı, sağlanan yanıtı JSON şemasında sağlanan kısıtlamalara göre otomatik olarak doğrular.
Değer kabul edilebilir değilse, kullanıcıdan yeni bir değer istenir.
Bu, şematiğe geçirilen herhangi bir değerin şematiğin uygulamasının beklentilerini karşılamasını sağlar, böylece şematiğin kodu içinde ek kontroller eklemenize gerek kalmaz.

#### İstem Uzun Biçim Sözdizimi

`x-prompt` alanı sözdizimi, istem üzerinde ek özelleştirme ve kontrol gerektiren durumlar için uzun bir biçimi destekler.
Bu biçimde, `x-prompt` alanı değeri, istemin davranışını özelleştiren alt alanları olan bir JSON nesnesidir.

| Alan    | Veri değeri                                                               |
| :------ | :------------------------------------------------------------------------ |
| type    | `confirmation`, `input` veya `list` \(kısa biçimde otomatik seçilir\)     |
| message | dize \(gerekli\)                                                          |
| items   | dize ve/veya etiket/değer nesne çifti \(yalnızca `list` türüyle geçerli\) |

Aşağıdaki uzun biçim örneği, CLI'ın [uygulama oluşturmak](https://github.com/angular/angular-cli/blob/ba8a6ea59983bb52a6f1e66d105c5a77517f062e/packages/schematics/angular/application/schema.json#L56) için kullandığı şematiğin JSON şemasındandır.
Oluşturulan uygulama için kullanıcıların hangi stil ön işlemcisini kullanmak istediklerini seçmelerini sağlayan istemi tanımlar.
Uzun biçim kullanarak, şematik menü seçeneklerinin daha açık biçimlendirilmesini sağlayabilir.

```json {header: "schema.json"}
{
  "style": {
    "description": "The file extension or preprocessor to use for style files.",
    "type": "string",
    "default": "css",
    "enum": ["css", "scss", "sass", "less"],
    "x-prompt": {
      "message": "Which stylesheet format would you like to use?",
      "type": "list",
      "items": [
        {"value": "css", "label": "CSS"},
        {"value": "scss", "label": "SCSS [ https://sass-lang.com/documentation/syntax#scss ]"},
        {
          "value": "sass",
          "label": "Sass [ https://sass-lang.com/documentation/syntax#the-indented-syntax ]"
        },
        {"value": "less", "label": "Less [ https://lesscss.org/ ]"}
      ]
    }
  }
}
```

#### x-prompt Şeması

Bir şematiğin seçeneklerini tanımlayan JSON şeması, istem ve ilgili davranışlarının bildirimsel tanımına izin veren uzantıları destekler.
İstemleri desteklemek için bir şematiğin kodunda ek mantık veya değişiklik gerekmez.
Aşağıdaki JSON şeması, `x-prompt` alanı için uzun biçim sözdiziminin eksiksiz bir tanımıdır.

```json {header: "x-prompt schema"}
{
  "oneOf": [
    {
      "type": "string"
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "items": {
          "type": "array",
          "items": {
            "oneOf": [
              {
                "type": "string"
              },
              {
                "type": "object",
                "properties": {
                  "label": {
                    "type": "string"
                  },
                  "value": {}
                },
                "required": ["value"]
              }
            ]
          }
        }
      },
      "required": ["message"]
    }
  ]
}
```

## Schematics CLI'ı

Şematikler kendi komut satırı aracıyla birlikte gelir.
Node 6.9 veya üstünü kullanarak, Schematics komut satırı aracını global olarak yükleyin:

```shell

npm install -g @angular-devkit/schematics-cli

```

Bu, kendi proje klasöründe yeni bir şematik koleksiyonu oluşturmak, mevcut bir koleksiyona yeni bir şematik eklemek veya mevcut bir şematiği genişletmek için kullanabileceğiniz `schematics` çalıştırılabilir dosyasını yükler.

Aşağıdaki bölümlerde, dosyaları ve dosya yapısını tanıtmak ve bazı temel kavramları açıklamak için CLI kullanarak yeni bir şematik koleksiyonu oluşturacaksınız.

Ancak şematiklerin en yaygın kullanımı, bir Angular kütüphanesini Angular CLI ile entegre etmektir.
Bunu, Schematics CLI'ı kullanmadan doğrudan bir Angular çalışma alanındaki kütüphane projesi içinde şematik dosyalarını oluşturarak yapın.
[Kütüphaneler için Şematikler](tools/cli/schematics-for-libraries) belgesine bakın.

### Bir Schematics Koleksiyonu Oluşturma

Aşağıdaki komut, aynı adda yeni bir proje klasöründe `hello-world` adlı yeni bir şematik oluşturur.

```shell

schematics blank --name=hello-world

```

`blank` şematiği, Schematics CLI tarafından sağlanır.
Komut, yeni bir proje klasörü \(koleksiyonun kök klasörü\) ve koleksiyonda bir başlangıç adlandırılmış şematiği oluşturur.

Koleksiyon klasörüne gidin, npm bağımlılıklarınızı yükleyin ve oluşturulan dosyaları görmek için yeni koleksiyonunuzu favori editörünüzde açın.
Örneğin, VS Code kullanıyorsanız:

```shell

cd hello-world
npm install
npm run build
code .

```

Başlangıç şematiği, proje klasörüyle aynı adı alır ve `src/hello-world` içinde oluşturulur.
Bu koleksiyona ilgili şematikleri ekleyin ve şematiğinizin işlevselliğini tanımlamak için oluşturulan iskelet kodu değiştirin.
Her şematik adı koleksiyon içinde benzersiz olmalıdır.

### Bir Schematic Çalıştırma

Adlandırılmış bir şematiği çalıştırmak için `schematics` komutunu kullanın.
Proje klasörünün yolunu, şematik adını ve gerekli seçenekleri aşağıdaki biçimde sağlayın.

```shell

schematics <path-to-schematics-project>:<schematics-name> --<required-option>=<value>

```

Yol, komutun çalıştırıldığı geçerli çalışma dizinine göre mutlak veya göreli olabilir.
Örneğin, az önce oluşturduğunuz şematiği \(gerekli seçenekleri olmayan\) çalıştırmak için aşağıdaki komutu kullanın.

```shell

schematics .:hello-world

```

### Bir Koleksiyona Schematic Ekleme

Mevcut bir koleksiyona şematik eklemek için, yeni bir şematik projesi başlatmak için kullandığınız aynı komutu kullanın, ancak proje klasörü içinde çalıştırın.

```shell

cd hello-world
schematics blank --name=goodbye-world

```

Komut, koleksiyonunuz içinde ana `index.ts` dosyası ve ilişkili test spec dosyasıyla yeni adlandırılmış şematiği oluşturur.
Ayrıca yeni şematiğin adını, açıklamasını ve fabrika fonksiyonunu koleksiyonun `collection.json` dosyasındaki şemasına ekler.

## Koleksiyon İçerikleri

Bir koleksiyonun kök proje klasörünün üst düzeyi yapılandırma dosyalarını, bir `node_modules` klasörünü ve bir `src/` klasörünü içerir.
`src/` klasörü, koleksiyondaki adlandırılmış şematikler için alt klasörleri ve toplanan şematikleri açıklayan bir şema olan `collection.json`'ı içerir.
Her şematik bir ad, açıklama ve fabrika fonksiyonu ile oluşturulur.

```json
{
  "$schema": "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "hello-world": {
      "description": "A blank schematic.",
      "factory": "./hello-world/index#helloWorld"
    }
  }
}
```

- `$schema` özelliği, CLI'ın doğrulama için kullandığı şemayı belirtir.
- `schematics` özelliği, bu koleksiyona ait adlandırılmış şematikleri listeler.
  Her şematiğin düz metin bir açıklaması vardır ve ana dosyadaki oluşturulan giriş fonksiyonuna işaret eder.

- `factory` özelliği, oluşturulan giriş fonksiyonuna işaret eder.
  Bu örnekte, `helloWorld()` fabrika fonksiyonunu çağırarak `hello-world` şematiğini çağırırsınız.

- İsteğe bağlı `schema` özelliği, şematik için mevcut komut satırı seçeneklerini tanımlayan bir JSON şema dosyasına işaret eder.
- İsteğe bağlı `aliases` dizisi, şematiği çağırmak için kullanılabilecek bir veya daha fazla dize belirtir.
  Örneğin, Angular CLI "generate" komutu için şematiğin `ng g` komutunu kullanmanıza izin veren "g" takma adı vardır.

### Adlandırılmış Schematic'ler

Schematics CLI'ı kullanarak boş bir şematik projesi oluşturduğunuzda, yeni boş şematik koleksiyonun ilk üyesidir ve koleksiyonla aynı ada sahiptir.
Bu koleksiyona yeni bir adlandırılmış şematik eklediğinizde, otomatik olarak `collection.json` şemasına eklenir.

Ad ve açıklamaya ek olarak, her şematiğin şematiğin giriş noktasını tanımlayan bir `factory` özelliği vardır.
Örnekte, ana dosyadaki `hello-world/index.ts` dosyasında `helloWorld()` fonksiyonunu çağırarak şematiğin tanımlı işlevselliğini çağırırsınız.

<img alt="overview" src="assets/images/guide/schematics/collection-files.gif">

Koleksiyondaki her adlandırılmış şematiğin aşağıdaki ana parçaları vardır.

| Parçalar      | Ayrıntılar                                                       |
| :------------ | :--------------------------------------------------------------- |
| `index.ts`    | Adlandırılmış bir şematik için dönüşüm mantığını tanımlayan kod. |
| `schema.json` | Şematik değişken tanımı.                                         |
| `schema.d.ts` | Şematik değişkenleri.                                            |
| `files/`      | Çoğaltılacak isteğe bağlı bileşen/şablon dosyaları.              |

Bir şematiğin tüm mantığını ek şablonlar olmadan `index.ts` dosyasında sağlaması mümkündür.
Ancak, bağımsız Angular projelerindekine benzer şekilde `files` klasöründe bileşenler ve şablonlar sağlayarak Angular için dinamik şematikler oluşturabilirsiniz.
Index dosyasındaki mantık, veri enjekte eden ve değişkenleri değiştiren kurallar tanımlayarak bu şablonları yapılandırır.
