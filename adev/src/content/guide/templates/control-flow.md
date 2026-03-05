# Control flow

Angular sablonlari, elemanlari kosullu olarak gostermenize, gizlemenize ve tekrarlamaniza olanak taniyan kontrol akisi bloklarini destekler.

## Conditionally display content with `@if`, `@else if` and `@else`

`@if` blogu, kosul ifadesi truthy oldugunda icerigini kosullu olarak goruntular:

```angular-html
@if (a > b) {
  <p>{{ a }} is greater than {{ b }}</p>
}
```

Alternatif icerik goruntulmek istiyorsaniz, istediginiz sayida `@else if` blogu ve tek bir `@else` blogu saglayarak bunu yapabilirsiniz.

```angular-html
@if (a > b) {
  {{ a }} is greater than {{ b }}
} @else if (b > a) {
  {{ a }} is less than {{ b }}
} @else {
  {{ a }} is equal to {{ b }}
}
```

### Referencing the conditional expression's result

`@if` kosulu, kosul ifadesinin sonucunu blok icinde yeniden kullanmak uzere bir degiskene kaydetmeyi destekler.

```angular-html
@if (user.profile.settings.startDate; as startDate) {
  {{ startDate }}
}
```

Bu, sablon icinde okunmasi ve bakimi daha kolay olacak uzun ifadelere referans vermek icin faydali olabilir.

## Repeat content with the `@for` block

`@for` blogu, bir koleksiyon uzerinde dongu yaparak bir blogun icerigini tekrar tekrar isler. Koleksiyon herhangi bir JavaScript [iterable](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols) olabilir, ancak Angular'in `Array` degerleri icin ek performans optimizasyonlari vardir.

Tipik bir `@for` dongusu su sekilde gorunur:

```angular-html
@for (item of items; track item.id) {
  {{ item.name }}
}
```

Angular'in `@for` blogu, JavaScript'in `continue` veya `break` gibi akis degistiren ifadelerini desteklemez.

### Why is `track` in `@for` blocks important?

`track` ifadesi, Angular'in verileriniz ile sayfadaki DOM dugumleri arasinda bir iliski surdurmusini saglar. Bu, veriler degistiginde Angular'in minimum gerekli DOM islemlerini yuruttugu optimize edilmis performans saglar.

Track'i etkili bir sekilde kullanmak, veri koleksiyonlari uzerinde dongu yaparken uygulamanizin isleme performansini onemli olcude iyilestirebilir.

`track` ifadesinde her ogeeyi benzersiz sekilde tanimlayan bir ozellik secin. Veri modeliniz benzersiz bir tanimlayici ozellik iceriyorsa (genellikle `id` veya `uuid`), bu degeri kullanin. Verilerinizde boyle bir alan yoksa, bir tane eklemeyi ciddi olarak dusunun.

Hic degismeyen statik koleksiyonlar icin, Angular'a her ogeyi koleksiyondaki indeksine gore izlemesini soylemek icin `$index` kullanabilirsiniz.

Baska bir secenek yoksa, ogeinin kendisini izleme anahtari olarak kullanabilirsiniz. Bu, Angular'a ogeyi uclu esittir operatoru (`===`) kullanarak referans kimligi ile izlemesini soyler. Mumkun oldugunda bu secenekten kacinin cunku onemli olcude daha yavas isleme guncellemelerine yol acabilir; zira Angular'in hangi veri ogesinin hangi DOM dugumune karsilik geldigini eslestirme yolu yoktur.

```angular-html
@for (item of items; track item) {
  {{ item.name }}
}
```

NOTE: `*ngFor`'dan farkli olarak, `@for` blogu gorunum yeniden kullanimina oncelik verir. Izlenen bir ozellik degisse bile nesne referansi ayni kalirsa, Angular tum elemani yok edip yeniden olusturmak yerine gorununun baglamalarini (bilesen girisleri dahil) gunceller.

### Contextual variables in `@for` blocks

`@for` bloklari icinde her zaman kullanilabilir olan birkaC ozel degisken vardir:

| Degisken | Anlami                                     |
| -------- | ------------------------------------------ |
| `$count` | Yinelenen koleksiyondaki oge sayisi        |
| `$index` | Mevcut satirin indeksi                     |
| `$first` | Mevcut satirin ilk satir olup olmadigi     |
| `$last`  | Mevcut satirin son satir olup olmadigi     |
| `$even`  | Mevcut satir indeksinin cift olup olmadigi |
| `$odd`   | Mevcut satir indeksinin tek olup olmadigi  |

Bu degiskenler her zaman bu adlarla kullanilabilir, ancak bir `let` segmenti ile takma ad verilebilir:

```angular-html
@for (item of items; track item.id; let idx = $index, e = $even) {
  <p>Item #{{ idx }}: {{ item.name }}</p>
}
```

Takma ad verme, ic ice `@for` bloklarinda faydalidir ve bir ic `@for` blogundan dis `@for` blogunun degiskenlerini okumaniza olanak tanir.

### Providing a fallback for `@for` blocks with the `@empty` block

`@for` blok iceriginin hemen ardindan istege bagli olarak bir `@empty` bolumu ekleyebilirsiniz. `@empty` blogunun icerigi, oge olmadiginda goruntulenir:

```angular-html
@for (item of items; track item.name) {
  <li>{{ item.name }}</li>
} @empty {
  <li>There are no items.</li>
}
```

## Conditionally display content with the `@switch` block

`@if` blogu cogu senaryo icin harika olsa da, `@switch` blogu verileri kosullu olarak islemek icin alternatif bir sozdizimi saglar. Sozdizimi, JavaScript'in `switch` ifadesine yakindan benzer.

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

Kosul ifadesinin degeri, case ifadesi ile uclu esittir (`===`) operatoru kullanilarak karsilastirilir.

**`@switch` gecisli degildir (fallthrough)**, bu nedenle blokta `break` veya `return` ifadesine esdeser bir seye ihtiyaciniz yoktur.

Ard arda `@case` ifadeleri yazarak tek bir blok icin birden fazla kosul belirtebilirsiniz.

Istege bagli olarak bir `@default` blogu ekleyebilirsiniz. `@default` blogunun icerigi, onceki case ifadelerinin hicbiri switch degerine eslesmedeginde goruntulenir.

Hicbir `@case` ifadeye eslesmezse ve `@default` blogu yoksa hicbir sey gosterilmez.

### Exhaustive type checking

`@switch`, kapsamli tur denetimini destekler ve Angular'in derleme zamaninda bir birlestirme turunun tum olasi degerlerinin ele alindigini dogrulamasina olanak tanir.

`@default never;` kullnarak, kalan hicbir durumun olmamasi gerektigini acikca belirtirsiniz. Birlestirme turu daha sonra genisletilirse ve yeni bir durum bir @case tarafindan karsilanmazsa, Angular'in sablon tur denetleyicisi bir hata bildirir ve eksik dallari erken yakalamaniza yardimci olur.

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

      @default never; // throws because `@case ('loading')` is missing
    }
  `,
})
export class AppComponent {
  state: 'loggedOut' | 'loading' | 'loggedIn' = 'loggedOut';
}
```
