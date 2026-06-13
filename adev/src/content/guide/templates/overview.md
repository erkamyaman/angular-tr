<docs-decorative-header title="Şablon sözdizimi" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
Angular'da şablon, bir HTML parçasıdır.
Angular'ın birçok özelliğinden yararlanmak için şablon içinde özel sözdizimi kullanın.
</docs-decorative-header>

TIP: Bu kapsamlı rehbere dalmadan önce Angular'ın [Temel Bilgiler](essentials/templates) sayfasına göz atın.

Her Angular bileşeninin, bileşenin sayfaya işlediği [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)'u tanımlayan bir **şablonu** vardır. Angular, şablonları kullanarak veriler değiştikçe sayfanızı otomatik olarak güncel tutabilir.

Şablonlar genellikle bir `*.ts` dosyasının `template` özelliğinde veya `*.html` dosyasında bulunur. Daha fazla bilgi için [bileşenlerin derinlemesine rehberine](/guide/components) göz atın.

## Template'ler nasıl çalışır?

Şablonlar, yerleşik şablon fonksiyonları, veri bağlama, olay dinleme, değişkenler ve daha fazlası gibi ek özelliklerle [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML) sözdizimini temel alır.

Angular, uygulamanızın dahili bir anlayışını oluşturmak için şablonları JavaScript'e derler. Bunun faydalarından biri, Angular'ın uygulamanıza otomatik olarak uyguladığı yerleşik işleme optimizasyonlarıdır.

### Standart HTML'den farkları

Şablonlar ile standart HTML sözdizimi arasındaki bazı farklar şunlardır:

- Şablon kaynak kodundaki yorumlar işlenmiş çıktıda yer almaz
- Bileşen ve direktif elemanları kendini kapatan olabilir (örn. `<UserProfile />`)
- Belirli karakterlere sahip nitelikler (yani `[]`, `()`, vb.) Angular için özel anlam taşır. Daha fazla bilgi için [bağlama belgelerine](guide/templates/binding) ve [olay dinleyicileri ekleme belgelerine](guide/templates/event-listeners) bakın.
- `@` karakteri, Angular için şablonlara [kontrol akışı](guide/templates/control-flow) gibi dinamik davranış eklemek için özel bir anlam taşır. Literal bir `@` karakteri eklemek için bunu bir HTML varlık kodu (`&commat;` veya `&#64;`) olarak yazabilirsiniz.
- Angular gereksiz boşluk karakterlerini yok sayar ve daraltır. Daha fazla bilgi için [şablonlarda boşluk](guide/templates/whitespace) konusuna bakın.
- Angular, dinamik içerik için yer tutucu olarak sayfaya yorum düğümleri ekleyebilir, ancak geliştiriciler bunları yok sayabilir.

Ek olarak, çoğu HTML sözdizimi geçerli şablon sözdizimi olsa da, Angular şablonlarda `<script>` elemanını desteklemez. Daha fazla bilgi için [Güvenlik](best-practices/security) sayfasına bakın.

## Sırada ne var?

Aşağıdaki konular da ilginizi çekebilir:

| Konular                                                                     | Ayrıntılar                                                                               |
| :-------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------- |
| [Binding dynamic text, properties, and attributes](guide/templates/binding) | Dinamik verileri metne, özelliklere ve niteliklere bağlayın.                             |
| [Adding event listeners](guide/templates/event-listeners)                   | Şablonlarınızdaki olaylara yanıt verin.                                                  |
| [Two-way binding](guide/templates/two-way-binding)                          | Bir değeri eşzamanlı olarak bağlayın ve değişiklikleri iletin.                           |
| [Control flow](guide/templates/control-flow)                                | Elemanları koşullu olarak gösterin, gizleyin ve tekrarlayın.                             |
| [Pipes](guide/templates/pipes)                                              | Verileri bildirimsel olarak dönüştürün.                                                  |
| [Slotting child content with ng-content](guide/templates/ng-content)        | Bileşenlerin içeriği nasıl işlediğini kontrol edin.                                      |
| [Create template fragments with ng-template](guide/templates/ng-template)   | Bir şablon parçası bildirin.                                                             |
| [Grouping elements with ng-container](guide/templates/ng-container)         | Birden fazla elemanı gruplayın veya işleme için bir konum işaretleyin.                   |
| [Variables in templates](guide/templates/variables)                         | Değişken bildirimleri hakkında bilgi edinin.                                             |
| [Deferred loading with @defer](guide/templates/defer)                       | `@defer` ile ertelenebilir görünümler oluşturun.                                         |
| [Expression syntax](guide/templates/expression-syntax)                      | Angular ifadeleri ile standart JavaScript arasındaki benzerlik ve farklılıkları öğrenin. |
| [Whitespace in templates](guide/templates/whitespace)                       | Angular'ın boşluğu nasıl işlediğini öğrenin.                                             |
