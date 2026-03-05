# Component selectors

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okudugunuzu varsayar. Angular'da yeniyseniz once onu okuyun.

Her bilesen, bilesnenin nasil kullanilacagini belirleyen bir [CSS secici](https://developer.mozilla.org/docs/Web/CSS/CSS_selectors) tanimlar:

```angular-ts {highlight: [2]}
@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }
```

_Diger_ bilesenlerin sablonlarinda eslesen bir HTML elemani olusturarak bileseni kullanirsiniz:

```angular-ts {highlight: [3]}
@Component({
  template: `
    <profile-photo />
    <button>Upload a new profile photo</button>`,
  ...,
})
export class UserProfile { }
```

**Angular, secicileri derleme zamaninda statik olarak eslestirir**. DOM'u calisma zamaninda, Angular baglamalari veya DOM API'leri araciligiyla degistirmek, render edilen bilesenleri etkilemez.

**Bir eleman tam olarak bir bilesen secicisiyle eslesebilir.** Birden fazla bilesen secicisi tek bir elemanla eslestirse, Angular bir hata bildirir.

**Bilesen secicileri buyuk-kucuk harf duyarlidir.**

## Types of selectors

Angular, bilesen secicilerinde temel [CSS secici turlerinin](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) sinirli bir alt kumesini destekler:

| **Secici turu** | **Aciklama**                                                                                              | **Ornekler**                  |
| --------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Tur secici      | Elemanlari HTML etiket adina veya dugum adina gore eslestirir.                                            | `profile-photo`               |
| Nitelik secici  | Elemanlari bir HTML nitelginin varligina ve istege bagli olarak o niteligin tam degerine gore eslestirir. | `[dropzone]` `[type="reset"]` |
| Sinif secici    | Elemanlari bir CSS sinifinin varligina gore eslestirir.                                                   | `.menu-item`                  |

Nitelik degerleri icin Angular, esittir (`=`) operatoru ile tam nitelik degeri eslestirmeyi destekler. Angular diger nitelik degeri operatorlerini desteklemez.

Angular bilesen secicileri, [nesil birlestirici](https://developer.mozilla.org/docs/Web/CSS/Descendant_combinator) veya [alt birlestirici](https://developer.mozilla.org/docs/Web/CSS/Child_combinator) dahil olmak uzere birlestircileri desteklemez.

Angular bilesen secicileri [ad alanlarinin](https://developer.mozilla.org/docs/Web/SVG/Namespaces_Crash_Course) belirtilmesini desteklemez.

### The `:not` pseudo-class

Angular [:not sahte sinifini](https://developer.mozilla.org/docs/Web/CSS/:not) destekler. Bir bilesnenin secicisinin hangi elemanlarla eslesecegini daraltmak icin bu sahte sinifi herhangi bir baska seciciye ekleyebilirsiniz. Ornegin, bir `[dropzone]` nitelik secicisi tanimlayabilir ve `textarea` elemanlarinin eslesmesini onleyebilirsiniz:

```angular-ts {highlight: [2]}
@Component({
  selector: '[dropzone]:not(textarea)',
  ...
})
export class DropZone { }
```

Angular, bilesen secicilerinde baska hicbir sahte sinif veya sahte eleman desteklemez.

### Combining selectors

Birden fazla seciciyi birlestirerek birlestirebilirsiniz. Ornegin, `type="reset"` belirten `<button>` elemanlarini eslestirebilirsiniz:

```angular-ts {highlight: [2]}
@Component({
  selector: 'button[type="reset"]',
  ...
})
export class ResetButton { }
```

Ayrica virgule ayrilmis bir liste ile birden fazla secici tanimlayabilirsiniz:

```angular-ts {highlight: [2]}
@Component({
  selector: 'drop-zone, [dropzone]',
  ...
})
export class DropZone { }
```

Angular, listedeki secicilerden _herhangi biriyle_ eslesen her eleman icin bir bilesen olusturur.

## Choosing a selector

Bilesenlerin buyuk cogunlugu, secicileri olarak ozel bir eleman adi kullanmalidir. Tum ozel eleman adlari, [HTML spesifikasyonu](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name) tarafindan aciklandigi gibi bir tire icermelidir. Varsayilan olarak Angular, mevcut hicbir bilesne ile eslesmeyen ozel bir etiket adiyla karsilastiginda hata bildirir ve yanlis yazilmis bilesen adlarindan kaynaklanan hatalari onler.

Yerel ozel elemanlari Angular sablonlarinda kullanma hakkinda ayrintilar icin [Gelismis bilesen yapilandirmasi](guide/components/advanced-configuration) belgesine bakin.

### Selector prefixes

Angular ekibi, projenizde tanimlanan tum ozel bilesenlerin kisa ve tutarli bir onek kullanmasini onerir. Ornegin, YouTube'u Angular ile yapacak olsaniz, bilesenlerinizi `yt-` oneki ile adlandirir, `yt-menu`, `yt-player` gibi bilesenler olustururdunuz. Secicilerinizi bu sekilde ad alani altinda toplamak, belirli bir bilesnenin nereden geldigini hemen anlasilir kilar. Varsayilan olarak Angular CLI `app-` onekini kullanir.

IMPORTANT: Angular kendi framework API'leri icin `ng` secici onekini kullanir. Kendi ozel bilesenleriniz icin secici oneki olarak asla `ng` kullanmayin.

### When to use an attribute selector

Standart bir yerel eleman uzerinde bilesen olusturmak istediginizde nitelik secici kullanmayi dusunmelisiniz. Ornegin, ozel bir buton bileseni olusturmak istiyorsaniz, nitelik secicisi kullanarak standart `<button>` elemaninin avantajlarindan yararlanabilirsiniz:

```angular-ts {highlight: [2]}
@Component({
  selector: 'button[yt-upload]',
   ...
})
export class YouTubeUploadButton { }
```

Bu yaklasim, bilesnenin tuketicilerinin ek caba harcamadan elemanin tum standart API'lerini dogrudan kullanmalarina olanak tanir. Bu ozellikle `aria-label` gibi ARIA nitelikleri icin degerlidir.

Angular, mevcut bir bilesle eslesmeyen ozel niteliklerle karsilastiginda hata bildirmez. Nitelik secicileri kullanan bilesenlerde, tuketiciler bileseni veya NgModule'unu icerir (import) etmeyi unutabilir ve bilesen render edilmeyebilir.
Daha fazla bilgi icin [Bilesenleri iceri aktarma ve kullanma](guide/components#imports-in-the-component-decorator) belgesine bakin.

Nitelik secicileri tanimlayan bilesenler kucuk harf, tire ile ayrilmis nitelikler kullanmalidir. Yukarida aciklanan ayni onek onerilerini takip edebilirsiniz.
