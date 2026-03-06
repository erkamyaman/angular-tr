# Zone kirliliğini çözme

**Zone.js**, Angular'ın uygulama durumunun değişmiş olabileceğini algılamak için kullandığı bir sinyal mekanizmasıdır. `setTimeout`, ağ istekleri ve olay dinleyicileri gibi asenkron işlemleri yakalar. Angular, Zone.js'den gelen sinyallere dayalı olarak değişiklik algılamasını planlar.

Bazı durumlarda planlanan [görevler](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide#tasks) veya [mikro görevler](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide#microtasks) veri modelinde herhangi bir değişiklik yapmaz, bu da değişiklik algılaması çalıştırmayı gereksiz kılar. Yaygın örnekler şunlardır:

- `requestAnimationFrame`, `setTimeout` veya `setInterval`
- Üçüncü taraf kütüphaneleri tarafından görev veya mikro görev planlaması

Bu bölüm, bu tür koşulların nasıl belirleneceğini ve gereksiz değişiklik algılama çağrılarından kaçınmak için kodun Angular zone'unun dışında nasıl çalıştırılacağını kapsamaktadır.

## Gereksiz değişiklik algılama çağrılarını belirleme

Gereksiz değişiklik algılama çağrılarını Angular DevTools ile tespit edebilirsiniz. Genellikle profil çıkarıcının zaman çizelgesinde `setTimeout`, `setInterval`, `requestAnimationFrame` veya bir olay işleyicisi kaynaklı ardışık çubuklar olarak görünürler. Bu API'lerin uygulamanız içinde sınırlı çağrıları olduğunda, değişiklik algılama çağrısı genellikle bir üçüncü taraf kütüphanesi tarafından neden olur.

<img alt="Angular DevTools profiler preview showing Zone pollution" src="assets/images/best-practices/runtime-performance/zone-pollution.png">

Yukarıdaki görüntüde, bir elemanla ilişkili olay işleyicileri tarafından tetiklenen bir dizi değişiklik algılama çağrısı vardır. Bu, `NgZone`'un varsayılan davranışını değiştirmeyen üçüncü taraf, yerel olmayan Angular bileşenleri kullanırken yaygın bir zorluktur.

## Görevleri `NgZone` dışında çalıştırma

Bu tür durumlarda, [NgZone](/api/core/NgZone) kullanarak Angular'a belirli bir kod parçası tarafından planlanan görevler için değişiklik algılaması çağırmamasını talimat verebilirsiniz.

```ts {header:"Zone dışında çalıştırma" , linenums}
import { Component, NgZone, OnInit, inject } from '@angular/core';

@Component(...)
class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => setInterval(pollForUpdates, 500));
  }
}
```

Önceki kod parçası, Angular'a `setInterval`'i Angular Zone'unun dışında çağırmasını ve `pollForUpdates` çalıştıktan sonra değişiklik algılaması çalıştırmayı atlamasını talimat verir.

Üçüncü taraf kütüphaneleri, API'leri Angular zone'u içinde çağrıldığında genellikle gereksiz değişiklik algılama döngülerine neden olur. Bu olgu özellikle olay dinleyicileri ayarlayan veya diğer görevler (zamanlayıcılar, XHR istekleri vb.) başlatan kütüphaneleri etkiler. Kütüphane API'lerini Angular zone'unun dışında çağırarak bu ekstra döngülerden kaçının:

```ts {header:"Grafik başlatmayı Zone dışına taşıma" , linenums}
import { Component, NgZone, OnInit, inject } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      Plotly.newPlot('chart', data);
    });
  }
}
```

`Plotly.newPlot('chart', data);`'yi `runOutsideAngular` içinde çalıştırmak, framework'a başlatma mantığı tarafından planlanan görevlerin çalıştırılmasından sonra değişiklik algılaması çalıştırmaması gerektiğini bildirir.

Örneğin, `Plotly.newPlot('chart', data)` bir DOM elemanına olay dinleyicileri eklerse, Angular onların işleyicilerinin çalıştırılmasından sonra değişiklik algılaması çalıştırmaz.

Ancak bazen üçüncü taraf API'leri tarafından gönderilen olayları dinlemeniz gerekebilir. Bu tür durumlarda, başlatma mantığı orada yapıldıysa bu olay dinleyicilerinin de Angular zone'unun dışında çalışacağını hatırlamak önemlidir:

```ts {header:"İşleyicinin Zone dışında çağrılıp çağrılmadığını kontrol etme" , linenums}
import { Component, NgZone, OnInit, output, inject } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  plotlyClick = output<Plotly.PlotMouseEvent>();

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.createPlotly();
    });
  }

  private async createPlotly() {
    const plotly = await Plotly.newPlot('chart', data);

    plotly.on('plotly_click', (event: Plotly.PlotMouseEvent) => {
      // Bu işleyici Angular zone'unun dışında çağrılacaktır çünkü
      // başlatma mantığı da zone'un dışında çağrılmıştır. Angular
      // zone'unda olup olmadığımızı kontrol etmek için aşağıdakini çağırabiliriz:
      console.log(NgZone.isInAngularZone());
      this.plotlyClick.emit(event);
    });
  }
}
```

Üst bileşenlere olay göndermeniz ve belirli görünüm güncelleme mantığı çalıştırmanız gerekiyorsa, framework'a değişiklik algılaması çalıştırmasını talimat vermek için Angular zone'una yeniden girmeyi veya değişiklik algılamasını manuel olarak çalıştırmayı düşünmelisiniz:

```ts {header:"Olay gönderirken Angular zone'una yeniden girme" , linenums}
import { Component, NgZone, OnInit, output, inject } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  plotlyClick = output<Plotly.PlotMouseEvent>();

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.createPlotly();
    });
  }

  private async createPlotly() {
    const plotly = await Plotly.newPlot('chart', data);

    plotly.on('plotly_click', (event: Plotly.PlotMouseEvent) => {
      this.ngZone.run(() => {
        this.plotlyClick.emit(event);
      });
    });
  }
}
```

Angular zone'unun dışında olay gönderme senaryosu da ortaya çıkabilir. Değişiklik algılamasını tetiklemenin (örneğin, manuel olarak) Angular zone'unun dışında görünümlerin oluşturulmasına/güncellenmesine yol açabileceğini hatırlamak önemlidir.
