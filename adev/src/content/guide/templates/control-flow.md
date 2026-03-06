# Control flow

Angular şablonları, elemanları koşullu olarak göstermenize, gizlemenize ve tekrarlamanıza olanak tanıyan kontrol akışı bloklarını destekler.

## `@if`, `@else if` ve `@else` ile içeriği koşullu gösterme

`@if` bloğu, koşul ifadesi truthy olduğunda içeriğini koşullu olarak görüntüler:

```angular-html
@if (a > b) {
  <p>{{ a }} is greater than {{ b }}</p>
}
```

Alternatif içerik görüntülemek istiyorsanız, istediğiniz sayıda `@else if` bloğu ve tek bir `@else` bloğu sağlayarak bunu yapabilirsiniz.

```angular-html
@if (a > b) {
  {{ a }} is greater than {{ b }}
} @else if (b > a) {
  {{ a }} is less than {{ b }}
} @else {
  {{ a }} is equal to {{ b }}
}
```

### Koşul ifadesinin sonucuna referans verme

`@if` koşulu, koşul ifadesinin sonucunu blok içinde yeniden kullanmak üzere bir değişkene kaydetmeyi destekler.

```angular-html
@if (user.profile.settings.startDate; as startDate) {
  {{ startDate }}
}
```

Bu, şablon içinde okunması ve bakımı daha kolay olacak uzun ifadelere referans vermek için faydalı olabilir.

## `@for` bloğu ile içeriği tekrarlama

`@for` bloğu, bir koleksiyon üzerinde döngü yaparak bir bloğun içeriğini tekrar tekrar işler. Koleksiyon herhangi bir JavaScript [iterable](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols) olabilir, ancak Angular'ın `Array` değerleri için ek performans optimizasyonları vardır.

Tipik bir `@for` döngüsü şu şekilde görünür:

```angular-html
@for (item of items; track item.id) {
  {{ item.name }}
}
```

Angular'ın `@for` bloğu, JavaScript'in `continue` veya `break` gibi akış değiştiren ifadelerini desteklemez.

### `@for` bloklarında `track` neden önemlidir?

`track` ifadesi, Angular'ın verileriniz ile sayfadaki DOM düğümleri arasında bir ilişki sürdürmesini sağlar. Bu, veriler değiştiğinde Angular'ın minimum gerekli DOM işlemlerini yürüttüğü optimize edilmiş performans sağlar.

Track'i etkili bir şekilde kullanmak, veri koleksiyonları üzerinde döngü yaparken uygulamanızın işleme performansını önemli ölçüde iyileştirebilir.

`track` ifadesinde her öğeyi benzersiz şekilde tanımlayan bir özellik seçin. Veri modeliniz benzersiz bir tanımlayıcı özellik içeriyorsa (genellikle `id` veya `uuid`), bu değeri kullanın. Verilerinizde böyle bir alan yoksa, bir tane eklemeyi ciddi olarak düşünün.

Hiç değişmeyen statik koleksiyonlar için, Angular'a her öğeyi koleksiyondaki indeksine göre izlemesini söylemek için `$index` kullanabilirsiniz.

Başka bir seçenek yoksa, öğenin kendisini izleme anahtarı olarak kullanabilirsiniz. Bu, Angular'a öğeyi üçlü eşittir operatörü (`===`) kullanarak referans kimliği ile izlemesini söyler. Mümkün olduğunda bu seçenekten kaçının çünkü önemli ölçüde daha yavaş işleme güncellemelerine yol açabilir; zira Angular'ın hangi veri öğesinin hangi DOM düğümüne karşılık geldiğini eşleştirme yolu yoktur.

```angular-html
@for (item of items; track item) {
  {{ item.name }}
}
```

NOTE: `*ngFor`'dan farklı olarak, `@for` bloğu görünüm yeniden kullanımına öncelik verir. İzlenen bir özellik değişse bile nesne referansı aynı kalırsa, Angular tüm elemanı yok edip yeniden oluşturmak yerine görünümün bağlamalarını (bileşen girişleri dahil) günceller.

### `@for` bloklarında bağlamsal değişkenler

`@for` blokları içinde her zaman kullanılabilir olan birkaç özel değişken vardır:

| Değişken | Anlamı                                     |
| -------- | ------------------------------------------ |
| `$count` | Yinelenen koleksiyondaki öğe sayısı        |
| `$index` | Mevcut satırın indeksi                     |
| `$first` | Mevcut satırın ilk satır olup olmadığı     |
| `$last`  | Mevcut satırın son satır olup olmadığı     |
| `$even`  | Mevcut satır indeksinin çift olup olmadığı |
| `$odd`   | Mevcut satır indeksinin tek olup olmadığı  |

Bu değişkenler her zaman bu adlarla kullanılabilir, ancak bir `let` segmenti ile takma ad verilebilir:

```angular-html
@for (item of items; track item.id; let idx = $index, e = $even) {
  <p>Item #{{ idx }}: {{ item.name }}</p>
}
```

Takma ad verme, iç içe `@for` bloklarında faydalıdır ve bir iç `@for` bloğundan dış `@for` bloğunun değişkenlerini okumanıza olanak tanır.

### `@empty` bloğu ile `@for` blokları için yedek sağlama

`@for` blok içeriğinin hemen ardından isteğe bağlı olarak bir `@empty` bölümü ekleyebilirsiniz. `@empty` bloğunun içeriği, öğe olmadığında görüntülenir:

```angular-html
@for (item of items; track item.name) {
  <li>{{ item.name }}</li>
} @empty {
  <li>There are no items.</li>
}
```

## `@switch` bloğu ile içeriği koşullu gösterme

`@if` bloğu çoğu senaryo için harika olsa da, `@switch` bloğu verileri koşullu olarak işlemek için alternatif bir sözdizimi sağlar. Sözdizimi, JavaScript'in `switch` ifadesine yakından benzer.

```angular-html
@switch (userPermissions) {
  @case ('admin') {
    <app-admin-dashboard />
  }
  @case ('reviewer')
  @case ('editor') {
    <app-editor-dashboard />
  }
  @default {
    <app-viewer-dashboard />
  }
}
```

Koşul ifadesinin değeri, case ifadesi ile üçlü eşittir (`===`) operatörü kullanılarak karşılaştırılır.

**`@switch` geçişli değildir (fallthrough)**, bu nedenle blokta `break` veya `return` ifadesine eşdeğer bir şeye ihtiyacınız yoktur.

Ard arda `@case` ifadeleri yazarak tek bir blok için birden fazla koşul belirtebilirsiniz.

İsteğe bağlı olarak bir `@default` bloğu ekleyebilirsiniz. `@default` bloğunun içeriği, önceki case ifadelerinin hiçbiri switch değerine eşleşmediğinde görüntülenir.

Hiçbir `@case` ifadeye eşleşmezse ve `@default` bloğu yoksa hiçbir şey gösterilmez.

### Kapsamlı tür denetimi

`@switch`, kapsamlı tür denetimini destekler ve Angular'ın derleme zamanında bir birleştirme türünün tüm olası değerlerinin ele alındığını doğrulamasına olanak tanır.

`@default never;` kullanarak, kalan hiçbir durumun olmaması gerektiğini açıkça belirtirsiniz. Birleştirme türü daha sonra genişletilirse ve yeni bir durum bir @case tarafından karşılanmazsa, Angular'ın şablon tür denetleyicisi bir hata bildirir ve eksik dalları erken yakalamanıza yardımcı olur.

```angular-html
@Component({
  template: `
    @switch (state) {
      @case ('loggedOut') {
        <button>Login</button>
      }

      @case ('loggedIn') {
        <p>Welcome back!</p>
      }

      @default never; // 'loading' @case'i eksik olduğu için hata verir
    }
  `,
})
export class AppComponent {
  state: 'loggedOut' | 'loading' | 'loggedIn' = 'loggedOut';
}
```
