# Using signals with directives

Artık [sinyalleri servislerle kullanmayı](/tutorials/signals/7-using-signals-with-services) öğrendiğinize göre, direktiflerin sinyalleri nasıl kullandığını keşfedelim. **Harika haber: sinyaller direktiflerde bileşenlerdeki gibi tamamen aynı şekilde çalışır!** Temel fark, direktiflerin şablonları olmadığı için, sinyalleri ağırlıklı olarak ana eleman (host element) üzerinde reaktif güncellemeler yapmak için host bağlamalarında kullanacak olmanızdır.

Bu aktivitede, sinyallerin direktiflerde nasıl reaktif davranış oluşturduğunu gösteren bir vurgulama direktifi oluşturacaksınız.

<hr />

<docs-workflow>

<docs-step title="Set up signals just like in a component">
Sinyal fonksiyonlarını içe aktarın ve reaktif durumunuzu oluşturun. Bu, bileşenlerdeki ile tamamen aynı şekilde çalışır:

```ts
import {Directive, input, signal, computed} from '@angular/core';

@Directive({
  selector: '[highlight]',
})
export class HighlightDirective {
  // Signal inputs - same as components!
  color = input<string>('yellow');
  intensity = input<number>(0.3);

  // Internal state - same as components!
  private isHovered = signal(false);

  // Computed signals - same as components!
  backgroundStyle = computed(() => {
    const baseColor = this.color();
    const alpha = this.isHovered() ? this.intensity() : this.intensity() * 0.5;

    const colorMap: Record<string, string> = {
      'yellow': `rgba(255, 255, 0, ${alpha})`,
      'blue': `rgba(0, 100, 255, ${alpha})`,
      'green': `rgba(0, 200, 0, ${alpha})`,
      'red': `rgba(255, 0, 0, ${alpha})`,
    };

    return colorMap[baseColor] || colorMap['yellow'];
  });
}
```

Bunun bileşen kalıplarıyla aynı olduğuna dikkat edin - tek fark `@Component` yerine `@Directive` içinde olmamızdır.
</docs-step>

<docs-step title="Use signals in host bindings">
Direktiflerin şablonları olmadığı için, sinyalleri ana elemanı reaktif olarak güncellemek için **host bağlamalarında** kullanacaksınız. `host` yapılandırmasını ve olay işleyicilerini ekleyin:

```ts
@Directive({
  selector: '[highlight]',
  host: {
    '[style.backgroundColor]': 'backgroundStyle()',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HighlightDirective {
  // ... signals from previous step ...

  onMouseEnter() {
    this.isHovered.set(true);
  }

  onMouseLeave() {
    this.isHovered.set(false);
  }
}
```

Host bağlamaları, sinyaller değiştiğinde otomatik olarak yeniden değerlendirilir - tıpkı bileşenlerdeki şablon bağlamaları gibi! `isHovered` değiştiğinde, `backgroundStyle` computed sinyali yeniden hesaplanır ve host bağlaması elemanın stilini günceller.
</docs-step>

<docs-step title="Use the directive in your template">
Reaktif direktifi göstermek için uygulama şablonunu güncelleyin:

```angular-html
template: `
<div>
  <h1>Directive with Signals</h1>

  <div highlight color="yellow" [intensity]="0.2">Hover me - Yellow highlight</div>

  <div highlight color="blue" [intensity]="0.4">Hover me - Blue highlight</div>

  <div highlight color="green" [intensity]="0.6">Hover me - Green highlight</div>
</div>
`,
```

Direktif, sinyal input'larına göre otomatik olarak reaktif vurgulama uygular!
</docs-step>

</docs-workflow>

Mükemmel! Artık sinyallerin direktiflerle nasıl çalıştığını gördünüz. Bu dersten bazı önemli çıkarımlar:

- **Sinyaller evrenseldir** - Tüm sinyal API'leri (`input()`, `signal()`, `computed()`, `effect()`) hem direktiflerde hem de bileşenlerde aynı şekilde çalışır
- **Host bağlamaları birincil kullanım alanıdır** - Direktiflerin şablonları olmadığı için, ana elemanı reaktif olarak değiştirmek için sinyalleri host bağlamalarında kullanırsınız
- **Aynı reaktif kalıplar** - Sinyal güncellemeleri, bileşen şablonlarında olduğu gibi computed sinyallerin ve host bağlamalarının otomatik yeniden değerlendirilmesini tetikler

Bir sonraki derste, [sinyal sorguları ile alt elemanları nasıl sorgulayacağınızı](/tutorials/signals/9-query-child-elements-with-signal-queries) öğreneceksiniz!
