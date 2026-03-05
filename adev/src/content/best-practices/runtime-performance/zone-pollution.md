# Resolving zone pollution

**Zone.js**, Angular'in uygulama durumunun degismis olabilecegini algilamak icin kullandigi bir sinyal mekanizmasidir. `setTimeout`, ag istekleri ve olay dinleyicileri gibi asenkron islemleri yakalar. Angular, Zone.js'den gelen sinyallere dayali olarak degisiklik algilamasini planlar.

Bazi durumlarda planlanan [gorevler](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide#tasks) veya [mikro gorevler](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide#microtasks) veri modelinde herhangi bir degisiklik yapmaz, bu da degisiklik algilamasi calistirmayi gereksiz kilar. Yaygin ornekler sunlardir:

- `requestAnimationFrame`, `setTimeout` veya `setInterval`
- Ucuncu taraf kutuphaneleri tarafindan gorev veya mikro gorev planlamasi

Bu bolum, bu tur kosullarin nasil belirlenegini ve gereksiz degisiklik algilama cagrilarindan kacinmak icin kodun Angular zone'unun disinda nasil calistirilacagini kapsamaktadir.

## Identifying unnecessary change detection calls

Gereksiz degisiklik algilama cagrilarini Angular DevTools ile tespit edebilirsiniz. Genellikle profil cikaricinin zaman cizelgesinde `setTimeout`, `setInterval`, `requestAnimationFrame` veya bir olay isleyicisi kaynakli ardisik cubuklar olarak gorunurler. Bu API'lerin uygulamaniz icinde sinirli cagrilari oldugunda, degisiklik algilama cagrisi genellikle bir ucuncu taraf kutuphanesi tarafindan neden olur.

<img alt="Angular DevTools profiler preview showing Zone pollution" src="assets/images/best-practices/runtime-performance/zone-pollution.png">

Yukaridaki goruntude, bir elemanla iliskili olay isleyicileri tarafindan tetiklenen bir dizi degisiklik algilama cagrisi vardir. Bu, `NgZone`'un varsayilan davranisini degistirmeyen ucuncu taraf, yerel olmayan Angular bilesenleri kullanirken yaygin bir zorluktur.

## Run tasks outside `NgZone`

Bu tur durumlarda, [NgZone](/api/core/NgZone) kullanarak Angular'a belirli bir kod parcasi tarafindan planlanan gorevler icin degisiklik algilamasi cagirmamasinni talimat verebilirsiniz.

```ts {header:"Run outside of the Zone" , linenums}
import { Component, NgZone, OnInit, inject } from '@angular/core';

@Component(...)
class AppComponent implements OnInit {
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => setInterval(pollForUpdates, 500));
  }
}
```

Onceki kod parcasi, Angular'a `setInterval`'i Angular Zone'unun disinda cagirmasini ve `pollForUpdates` calistiktan sonra degisiklik algilamasi calistirmayi atlamasini talimat verir.

Ucuncu taraf kutuphaneleri, API'leri Angular zone'u icinde cagrildiginda genellikle gereksiz degisiklik algilama dongulerine neden olur. Bu olgu ozellikle olay dinleyicileri ayarlayan veya diger gorevler (zamanlayicilar, XHR istekleri vb.) baslatan kutuphaneleri etkiler. Kutuphane API'lerini Angular zone'unun disinda cagirarak bu ekstra dongulerrden kacinin:

```ts {header:"Move the plot initialization outside of the Zone" , linenums}
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

`Plotly.newPlot('chart', data);`'yi `runOutsideAngular` icinde calistirmak, framework'a baslatma mantigi tarafindan planlanan gorevlerin calistirlimasindan sonra degisiklik algilamasi calistirmamasi gerektigini bildirir.

Ornegin, `Plotly.newPlot('chart', data)` bir DOM elemanina olay dinleyicileri eklerse, Angular onlarin isleyicilerinin calistirlimasindan sonra degisiklik algilamasi calistirmaz.

Ancak bazen ucuncu taraf API'leri tarafindan gonderilen olaylari dinlemeniz gerekebilir. Bu tur durumlarda, baslatma mantigi orada yapildiysa bu olay dinleyicilerinin de Angular zone'unun disinda calisacagini hatirlamak onemlidir:

```ts {header:"Check whether the handler is called outside of the Zone" , linenums}
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
      // This handler will be called outside of the Angular zone because
      // the initialization logic is also called outside of the zone. To check
      // whether we're in the Angular zone, we can call the following:
      console.log(NgZone.isInAngularZone());
      this.plotlyClick.emit(event);
    });
  }
}
```

Ust bilesenlere olay gondermaniz ve belirli gorunum guncelleme mantigi calistirmaniz gerekiyorsa, framework'a degisiklik algilamasi calistirmasini talimat vermek icin Angular zone'una yeniden girmeyi veya degisiklik algilamasini manuel olarak calistirmayi dusunmelisiniz:

```ts {header:"Re-enter the Angular zone when dispatching event" , linenums}
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

Angular zone'unun disinda olay gonderme senaryosu da ortaya cikabilir. Degisiklik algilamasini tetiklemenin (ornegin, manuel olarak) Angular zone'unun disinda gorunumlerin olusturulmasina/guncellenmesine yol acabileceginii hatirlamak onemlidir.
