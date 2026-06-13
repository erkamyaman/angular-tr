# DOM API'lerini kullanma

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okuduğunuzu varsayar. Angular'da yeniyseniz önce onu okuyun.

Angular, DOM oluşturma, güncelleme ve kaldırma işlemlerinin çoğunu sizin için yönetir. Ancak nadiren bir bileşenin DOM'u ile doğrudan etkileşime girmeniz gerekebilir. Bileşenlere, bileşenin host elemanına bir referans almak için ElementRef enjekte edilebilir:

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

`nativeElement` özelliği, host [Element](https://developer.mozilla.org/docs/Web/API/Element) örneğine referans verir.

Angular sayfayı render etmeyi bitirdiğinde çalışan bir **render geri çağrısı** kaydetmek için Angular'ın `afterEveryRender` ve `afterNextRender` fonksiyonlarını kullanabilirsiniz.

```ts
@Component({
  /*...*/
})
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    afterEveryRender(() => {
      // Bu bileşendeki ilk input elemanına odaklan.
      elementRef.nativeElement.querySelector('input')?.focus();
    });
  }
}
```

`afterEveryRender` ve `afterNextRender` bir _enjeksiyon bağlamında_ çağırılmalıdır, tipik olarak bileşenin constructor'ında.

**Mümkün olduğunda doğrudan DOM manipülasyonundan kaçının.** DOM yapısınızı her zaman bileşen şablonlarında ifade etmeyi ve o DOM'u bağlamalarla güncellemeyi tercih edin.

**Render geri çağrıları, sunucu tarafı render etme veya derleme zamanı ön-render etme sırasında asla çalışmaz.**

**Diğer Angular yaşam döngüsü kancaları içerisinde DOM'u asla doğrudan manipüle etmeyin**. Angular, render geri çağrıları dışında hiçbir noktada bileşenin DOM'unun tamamen render edildiğini garanti etmez. Ayrıca, diğer yaşam döngüsü kancaları sırasında DOM'u okumak veya değiştirmek, [düzeni bozma](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing) nedeniyle sayfa performansını olumsuz etkileyebilir.

## Bir bileşenin renderer'ını kullanma

Bileşenlere, diğer Angular özellikleriyle bağlantılı belirli DOM manipülasyonları gerçekleştirmek için bir `Renderer2` örneği enjekte edilebilir.

Bir bileşenin `Renderer2`'si tarafından oluşturulan tüm DOM elemanları, o bileşenin [stil kapsüllemesine](guide/components/styling#stil-kapsamı) katılır.

Belirli `Renderer2` API'leri ayrıca Angular'ın animasyon sistemine bağlanır. Sentetik animasyon özelliklerini güncellemek için `setProperty` yöntemini ve sentetik animasyon olayları için olay dinleyicileri eklemek için `listen` yöntemini kullanabilirsiniz. Ayrıntılar için [Animasyonlar](guide/animations) rehberine bakın.

Bu iki dar kullanım alanı dışında, `Renderer2` kullanmak ile yerel DOM API'lerini kullanmak arasında hiçbir fark yoktur. `Renderer2` API'leri, sunucu tarafı render etme veya derleme zamanı ön-render etme bağlamlarında DOM manipülasyonunu desteklemez.

## DOM API'leri ne zaman kullanılır

Angular render etme konularının çoğunu yönetse de, bazı davranışlar yine de DOM API'lerinin kullanılmasını gerektirebilir. Bazı yaygın kullanım alanları şunlardır:

- Eleman odağını yönetme
- `getBoundingClientRect` gibi eleman geometrisini ölçme
- Bir elemanın metin içeriğini okuma
- [`MutationObserver`](https://developer.mozilla.org/docs/Web/API/MutationObserver),
  [`ResizeObserver`](https://developer.mozilla.org/docs/Web/API/ResizeObserver) veya
  [`IntersectionObserver`](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API) gibi yerel gözlemciler kurma.

DOM elemanlarını eklemekten, kaldırmaktan ve değiştirmekten kaçının. Özellikle, **bir elemanın `innerHTML` özelliğini asla doğrudan ayarlamayın**, bu uygulamanızı [siteler arası betik çalıştırma (XSS) saldırılarına](https://developer.mozilla.org/docs/Glossary/Cross-site_scripting) karşı savunmasız hale getirebilir. Angular'ın şablon bağlamaları, `innerHTML` için olanlar dahil, XSS saldırılarına karşı korumaya yardımcı olan güvenlik önlemleri içerir. Ayrıntılar için [Güvenlik rehberi](best-practices/security)'ne bakın.
