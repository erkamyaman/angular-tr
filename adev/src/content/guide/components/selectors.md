# Bileşen seçicileri

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okuduğunuzu varsayar. Angular'da yeniyseniz önce onu okuyun.

Her bileşen, bileşenin nasıl kullanılacağını belirleyen bir [CSS seçici](https://developer.mozilla.org/docs/Web/CSS/CSS_selectors) tanımlar:

```angular-ts {highlight: [2]}
@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }
```

_Diğer_ bileşenlerin şablonlarında eşleşen bir HTML elemanı oluşturarak bileşeni kullanırsınız:

```angular-ts {highlight: [3]}
@Component({
  template: `
    <profile-photo />
    <button>Upload a new profile photo</button>`,
  ...,
})
export class UserProfile { }
```

**Angular, seçicileri derleme zamanında statik olarak eşleştirir**. DOM'u çalışma zamanında, Angular bağlamaları veya DOM API'leri aracılığıyla değiştirmek, render edilen bileşenleri etkilemez.

**Bir eleman tam olarak bir bileşen seçicisiyle eşleşebilir.** Birden fazla bileşen seçicisi tek bir elemanla eşleşirse, Angular bir hata bildirir.

**Bileşen seçicileri büyük-küçük harf duyarlıdır.**

## Seçici türleri

Angular, bileşen seçicilerinde temel [CSS seçici türlerinin](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) sınırlı bir alt kümesini destekler:

| **Seçici türü** | **Açıklama**                                                                                               | **Örnekler**                  |
| --------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Tür seçici      | Elemanları HTML etiket adına veya düğüm adına göre eşleştirir.                                             | `profile-photo`               |
| Nitelik seçici  | Elemanları bir HTML niteliğinin varlığına ve isteğe bağlı olarak o niteliğin tam değerine göre eşleştirir. | `[dropzone]` `[type="reset"]` |
| Sınıf seçici    | Elemanları bir CSS sınıfının varlığına göre eşleştirir.                                                    | `.menu-item`                  |

Nitelik değerleri için Angular, eşittir (`=`) operatörü ile tam nitelik değeri eşleştirmeyi destekler. Angular diğer nitelik değeri operatörlerini desteklemez.

Angular bileşen seçicileri, [nesil birleştirici](https://developer.mozilla.org/docs/Web/CSS/Descendant_combinator) veya [alt birleştirici](https://developer.mozilla.org/docs/Web/CSS/Child_combinator) dahil olmak üzere birleştiricileri desteklemez.

Angular bileşen seçicileri [ad alanlarının](https://developer.mozilla.org/docs/Web/SVG/Namespaces_Crash_Course) belirtilmesini desteklemez.

### `:not` sahte sınıfı

Angular [:not sahte sınıfını](https://developer.mozilla.org/docs/Web/CSS/:not) destekler. Bir bileşenin seçicisinin hangi elemanlarla eşleşeceğini daraltmak için bu sahte sınıfı herhangi bir başka seçiciye ekleyebilirsiniz. Örneğin, bir `[dropzone]` nitelik seçicisi tanımlayabilir ve `textarea` elemanlarının eşleşmesini önleyebilirsiniz:

```angular-ts {highlight: [2]}
@Component({
  selector: '[dropzone]:not(textarea)',
  ...
})
export class DropZone { }
```

Angular, bileşen seçicilerinde başka hiçbir sahte sınıf veya sahte eleman desteklemez.

### Seçicileri birleştirme

Birden fazla seçiciyi birleştirerek birleştirebilirsiniz. Örneğin, `type="reset"` belirten `<button>` elemanlarını eşleştirebilirsiniz:

```angular-ts {highlight: [2]}
@Component({
  selector: 'button[type="reset"]',
  ...
})
export class ResetButton { }
```

Ayrıca virgüle ayrılmış bir liste ile birden fazla seçici tanımlayabilirsiniz:

```angular-ts {highlight: [2]}
@Component({
  selector: 'drop-zone, [dropzone]',
  ...
})
export class DropZone { }
```

Angular, listedeki seçicilerden _herhangi biriyle_ eşleşen her eleman için bir bileşen oluşturur.

## Seçici seçme

Bileşenlerin büyük çoğunluğu, seçicileri olarak özel bir eleman adı kullanmalıdır. Tüm özel eleman adları, [HTML spesifikasyonu](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) tarafından açıklandığı gibi bir tire içermelidir. Varsayılan olarak Angular, mevcut hiçbir bileşen ile eşleşmeyen özel bir etiket adıyla karşılaştığında hata bildirir ve yanlış yazılmış bileşen adlarından kaynaklanan hataları önler.

Yerel özel elemanları Angular şablonlarında kullanma hakkında ayrıntılar için [Gelişmiş bileşen yapılandırması](guide/components/advanced-configuration) belgesine bakın.

### Seçici önekleri

Angular ekibi, projenizde tanımlanan tüm özel bileşenlerin kısa ve tutarlı bir önek kullanmasını önerir. Örneğin, YouTube'u Angular ile yapacak olsanız, bileşenlerinizi `yt-` öneki ile adlandırır, `yt-menu`, `yt-player` gibi bileşenler oluştururdunuz. Seçicilerinizi bu şekilde ad alanı altında toplamak, belirli bir bileşenin nereden geldiğini hemen anlaşılır kılar. Varsayılan olarak Angular CLI `app-` önekini kullanır.

IMPORTANT: Angular kendi framework API'leri için `ng` seçici önekini kullanır. Kendi özel bileşenleriniz için seçici öneki olarak asla `ng` kullanmayın.

### Nitelik seçici ne zaman kullanılır

Standart bir yerel eleman üzerinde bileşen oluşturmak istediğinizde nitelik seçici kullanmayı düşünmelisiniz. Örneğin, özel bir buton bileşeni oluşturmak istiyorsanız, nitelik seçicisi kullanarak standart `<button>` elemanının avantajlarından yararlanabilirsiniz:

```angular-ts {highlight: [2]}
@Component({
  selector: 'button[yt-upload]',
   ...
})
export class YouTubeUploadButton { }
```

Bu yaklaşım, bileşenin tüketicilerinin ek çaba harcamadan elemanın tüm standart API'lerini doğrudan kullanmalarına olanak tanır. Bu özellikle `aria-label` gibi ARIA nitelikleri için değerlidir.

Angular, mevcut bir bileşenle eşleşmeyen özel niteliklerle karşılaştığında hata bildirmez. Nitelik seçicileri kullanan bileşenlerde, tüketiciler bileşeni veya NgModule'unu içerir (import) etmeyi unutabilir ve bileşen render edilmeyebilir.
Daha fazla bilgi için [Bileşenleri içeri aktarma ve kullanma](guide/components#component-dekoratöründe-importlar) belgesine bakın.

Nitelik seçicileri tanımlayan bileşenler küçük harf, tire ile ayrılmış nitelikler kullanmalıdır. Yukarıda açıklanan aynı önek önerilerini takip edebilirsiniz.
