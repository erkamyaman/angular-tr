# Using DOM APIs

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okudugunuzu varsayar. Angular'da yeniyseniz once onu okuyun.

Angular, DOM olusturma, guncelleme ve kaldirma islemlerinin cogunu sizin icin yonetir. Ancak nadiren bir bilesnenin DOM'u ile dogrudan etkilesime girmeniz gerekebilir. Bilesenlere, bilesnenin host elemanina bir referans almak icin ElementRef enjekte edilebilir:

```ts
@Component({
  /*...*/
})
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    console.log(elementRef.nativeElement);
  }
}
```

`nativeElement` ozelligi, host [Element](https://developer.mozilla.org/docs/Web/API/Element) ornegine referans verir.

Angular sayfayi render etmeyi bitirdiginde calisan bir **render geri cagrisi** kaydetmek icin Angular'in `afterEveryRender` ve `afterNextRender` fonksiyonlarini kullanabilirsiniz.

```ts
@Component({
  /*...*/
})
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    afterEveryRender(() => {
      // Focus the first input element in this component.
      elementRef.nativeElement.querySelector('input')?.focus();
    });
  }
}
```

`afterEveryRender` ve `afterNextRender` bir _enjeksiyon baglaminda_ cagrilmalidir, tipik olarak bilesnenin constructor'inda.

**Mumkun oldugunda dogrudan DOM manipulasyonundan kacinin.** DOM yapisinizi her zaman bilesen sablonlarinda ifade etmeyi ve o DOM'u baglamalarla guncellemeyi tercih edin.

**Render geri cagrilari, sunucu tarafi render etme veya derleme zamani on-render etme sirasinda asla calismaz.**

**Diger Angular yasam dongusu kancalari icerisinde DOM'u asla dogrudan manipule etmeyin**. Angular, render geri cagrilari disinda hicbir noktada bilesnenin DOM'unun tamamen render edildigini garanti etmez. Ayrica, diger yasam dongusu kancalari sirasinda DOM'u okumak veya degistirmek, [duzeni bozma](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing) nedeniyle sayfa performansini olumsuz etkileyebilir.

## Using a component's renderer

Bilesenlere, diger Angular ozellikleriyle baglantili belirli DOM manipulasyonlari gerceklestirmek icin bir `Renderer2` ornegi enjekte edilebilir.

Bir bilesnenin `Renderer2`'si tarafindan olusturulan tum DOM elemanlari, o bilesnenin [stil kapsullemesine](guide/components/styling#style-scoping) katilir.

Belirli `Renderer2` API'leri ayrica Angular'in animasyon sistemine baglanir. Sentetik animasyon ozelliklerini guncellemek icin `setProperty` yontemini ve sentetik animasyon olaylari icin olay dinleyicileri eklemek icin `listen` yontemini kullanabilirsiniz. Ayrintilar icin [Animasyonlar](guide/animations) rehberine bakin.

Bu iki dar kullanim alani disinda, `Renderer2` kullanmak ile yerel DOM API'lerini kullanmak arasinda hicbir fark yoktur. `Renderer2` API'leri, sunucu tarafi render etme veya derleme zamani on-render etme baglamlarinda DOM manipulasyonunu desteklemez.

## When to use DOM APIs

Angular render etme konularinin cogunu yonetse de, bazi davranislar yine de DOM API'lerinin kullanilmasini gerektirebilir. Bazi yaygin kullanim alanlari sunlardir:

- Eleman odagini yonetme
- `getBoundingClientRect` gibi eleman geometrisini olcme
- Bir elemanin metin icerigini okuma
- [`MutationObserver`](https://developer.mozilla.org/docs/Web/API/MutationObserver),
  [`ResizeObserver`](https://developer.mozilla.org/docs/Web/API/ResizeObserver) veya
  [`IntersectionObserver`](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) gibi yerel gozlemciler kurma.

DOM elemanlarini eklemekten, kaldirmaktan ve degistirmekten kacinin. Ozellikle, **bir elemanin `innerHTML` ozelligini asla dogrudan ayarlamayin**, bu uygulamanizi [siteler arasi betik calistirma (XSS) saldirilarina](https://developer.mozilla.org/docs/Glossary/Cross-site_scripting) karsi savunmasiz hale getirebilir. Angular'in sablon baglamalari, `innerHTML` icin olanlar dahil, XSS saldirilarina karsi korumaya yardimci olan guvenlik onlemleri icerir. Ayrintilar icin [Guvenlik rehberi](best-practices/security)'ne bakin.
