<docs-decorative-header title="Template syntax" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
Angular'da sablon, bir HTML parcasidir.
Angular'in bircok ozelliginden yararlanmak icin sablon icinde ozel sozdizimi kullanin.
</docs-decorative-header>

TIP: Bu kapsamli rehbere dalmadan once Angular'in [Temel Bilgiler](essentials/templates) sayfasina goz atin.

Her Angular bileseninin, bilesenin sayfaya islediigi [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)'u tanimlayan bir **sablonu** vardir. Angular, sablonlari kullanarak veriler degistikce sayfanizi otomatik olarak guncel tutabilir.

Sablonlar genellikle bir `*.ts` dosyasinin `template` ozelliginde veya `*.html` dosyasinda bulunur. Daha fazla bilgi icin [bilesenlerin derinlemesine rehberine](/guide/components) goz atin.

## How do templates work?

Sablonlar, yerlesik sablon fonksiyonlari, veri baglama, olay dinleme, degiskenler ve daha fazlasi gibi ek ozelliklerle [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) szdizimini temel alir.

Angular, uygulamanizin dahili bir anlayisini olusturmak icin sablonlari JavaScript'e derler. Bunun faydalarindan biri, Angular'in uygulamaniza otomatik olarak uygulladigi yerlesik isleme optimizasyonlaridir.

### Differences from standard HTML

Sablonlar ile standart HTML sozdizimi arasindaki bazi farklar sunlardir:

- Sablon kaynak kodundaki yorumlar islenmis ciktida yer almaz
- Bilesen ve direktif elemanlari kendini kapatan olabilir (orn. `<UserProfile />`)
- Belirli karakterlere sahip nitelikler (yani `[]`, `()`, vb.) Angular icin ozel anlam tasir. Daha fazla bilgi icin [baglama belgelerine](guide/templates/binding) ve [olay dinleyicileri ekleme belgelerine](guide/templates/event-listeners) bakin.
- `@` karakteri, Angular icin sablonlara [kontrol akisi](guide/templates/control-flow) gibi dinamik davranis eklemek icin ozel bir anlam tasir. Literal bir `@` karakteri eklemek icin bunu bir HTML varlik kodu (`&commat;` veya `&#64;`) olarak yazabilirsiniz.
- Angular gereksiz bosluk karakterlerini yok sayar ve daraltir. Daha fazla bilgi icin [sablonlarda bosluk](guide/templates/whitespace) konusuna bakin.
- Angular, dinamik icerik icin yer tutucu olarak sayfaya yorum dugumleri ekleyebilir, ancak gelistiriciler bunlari yok sayabilir.

Ek olarak, cogu HTML sozdizimi gecerli sablon sozdizimi olsa da, Angular sablonlarda `<script>` elemanini desteklemez. Daha fazla bilgi icin [Guvenlik](best-practices/security) sayfasina bakin.

## What's next?

Asagidaki konular da ilginizi cekebilir:

| Konular                                                                     | Ayrintilar                                                                               |
| :-------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| [Binding dynamic text, properties, and attributes](guide/templates/binding) | Dinamik verileri metne, ozelliklere ve niteliklere baglayin.                             |
| [Adding event listeners](guide/templates/event-listeners)                   | Sablonlarinizdaki olaylara yanit verin.                                                  |
| [Two-way binding](guide/templates/two-way-binding)                          | Bir degeri eslasmanli olarak baglayin ve degisiklikleri iletin.                          |
| [Control flow](guide/templates/control-flow)                                | Elemanlari kosullu olarak gosterin, gizleyin ve tekrarlayin.                             |
| [Pipes](guide/templates/pipes)                                              | Verileri bildirimsel olarak donusturun.                                                  |
| [Slotting child content with ng-content](guide/templates/ng-content)        | Bilesenlerin icerigi nasil isledigini kontrol edin.                                      |
| [Create template fragments with ng-template](guide/templates/ng-template)   | Bir sablon parcasi bildirin.                                                             |
| [Grouping elements with ng-container](guide/templates/ng-container)         | Birden fazla elemani gruplayin veya isleme icin bir konum isaretleyin.                   |
| [Variables in templates](guide/templates/variables)                         | Degisken bildirimleri hakkinda bilgi edinin.                                             |
| [Deferred loading with @defer](guide/templates/defer)                       | `@defer` ile ertelenebilir gorunumler olusturun.                                         |
| [Expression syntax](guide/templates/expression-syntax)                      | Angular ifadeleri ile standart JavaScript arasindaki benzerlik ve farkliliklari ogrenin. |
| [Whitespace in templates](guide/templates/whitespace)                       | Angular'in boslugu nasil isledigini ogrenin.                                             |
