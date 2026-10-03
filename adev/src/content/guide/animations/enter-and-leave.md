# `animate.enter` ve `animate.leave` ile uygulamalarınızı animasyonlama

İyi tasarlanmış animasyonlar uygulamanızı daha sezgisel ve etkileşimli hale getirebilir, ancak sadece görsel bir unsur değildir.
Animasyonlar uygulamanızı ve kullanıcı deneyimini birçok şekilde iyileştirebilir:

- Animasyonlar olmadan, web sayfası geçişleri ani ve rahatsız edici görünebilir
- Hareket, kullanıcı deneyimini büyük ölçüde geliştirir, bu nedenle animasyonlar kullanıcılara uygulamanın eylemlerine verdiği yanıtı algılama şansı tanır
- İyi animasyonlar, kullanıcının dikkatini bir iş akışı boyunca düzgünce yönlendirebilir

Angular, uygulamanızın elemanlarını animasyonlamak için `animate.enter` ve `animate.leave` sağlar. Bu iki özellik, uygun zamanlarda giriş ve çıkış CSS sınıflarını uygular veya üçüncü parti kütüphanelerden animasyonlar uygulamak için fonksiyonları çağırır. `animate.enter` ve `animate.leave` yönerge değildir. Bunlar doğrudan Angular derleyicisi tarafından desteklenen özel API'lerdir. Elemanlarda doğrudan kullanılabilir ve ayrıca bir ana bağlama olarak da kullanılabilir.

## `animate.enter`

DOM'a _giren_ elemanları animasyonlamak için `animate.enter` kullanabilirsiniz. Giriş animasyonlarını geçişler veya anahtar kare animasyonları ile CSS sınıfları kullanarak tanımlayabilirsiniz.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts">
    <docs-code header="enter.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts" />
    <docs-code header="enter.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.html" />
    <docs-code header="enter.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.css"/>
</docs-code-multifile>

Animasyon tamamlandığında, Angular `animate.enter`'da belirttiğiniz sınıf veya sınıfları DOM'dan kaldırır. Animasyon sınıfları yalnızca animasyon aktifken mevcuttur.

NOTE: Bir elemanda birden fazla anahtar kare animasyonu veya geçiş özelliği kullanıldığında, Angular tüm sınıfları yalnızca en uzun animasyon tamamlandıktan _sonra_ kaldırır.

`animate.enter`'i kontrol akışı veya dinamik ifadeler gibi diğer Angular özellikleriyle kullanabilirsiniz. `animate.enter` hem tek bir sınıf dizesini (boşlukla ayrılmış birden fazla sınıf ile) hem de bir sınıf dizesi dizisini kabul eder.

CSS geçişleri kullanımı hakkında kısa bir not: Anahtar kare animasyonları yerine geçişleri kullanmayı seçerseniz, `animate.enter` ile elemana eklenen sınıflar geçişin _hedef_ durumunu temsil eder. Temel eleman CSS'iniz, animasyon çalışmadığı zaman elemanın nasıl görüneceğini belirler, bu da muhtemelen CSS geçişinin son durumuna benzer. Bu nedenle, geçişinizin çalışması için uygun bir _başlangıç_ durumuna sahip olmak için yine de `@starting-style` ile eşleştirmeniz gerekir.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts">
    <docs-code header="enter-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts" />
    <docs-code header="enter-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.html" />
    <docs-code header="enter-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.css"/>
</docs-code-multifile>

## `animate.leave`

DOM'dan _ayrılan_ elemanları animasyonlamak için `animate.leave` kullanabilirsiniz. Çıkış animasyonlarını dönüşümler veya anahtar kare animasyonları ile CSS sınıfları kullanarak tanımlayabilirsiniz.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts">
    <docs-code header="leave.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts" />
    <docs-code header="leave.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.html" />
    <docs-code header="leave.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.css"/>
</docs-code-multifile>

Animasyon tamamlandığında, Angular animasyonlu elemanı DOM'dan otomatik olarak kaldırır.

NOTE: Bir elemanda birden fazla anahtar kare animasyonu veya geçiş özelliği kullanıldığında, Angular elemanı yalnızca bu animasyonların en uzunu tamamlandıktan _sonra_ kaldırır.

`animate.leave` sinyallerle ve diğer bağlamalarla da kullanılabilir. `animate.leave`'i tek bir sınıf veya birden fazla sınıf ile kullanabilirsiniz. Boşluklu basit bir dize veya bir dize dizisi olarak belirtin.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts">
    <docs-code header="leave-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts" />
    <docs-code header="leave-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.html" />
    <docs-code header="leave-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.css"/>
</docs-code-multifile>

### Eleman kaldırma sırası {#element-removal-order}

`animate.leave` animasyonlarının nasıl çalıştırıldığı ve bir animasyonun ne zaman gerçekleşeceği konusunda bazı incelikler vardır. `animate.leave`, kaldırılan elemanın üzerine yerleştirilmişse çalışır ve `animate.leave` _aynı bileşen şablonu içinde_ kaldırılan elemanın bir _alt öğesi_ olan bir elemana yerleştirilmişse, bu alt `animate.leave` animasyonları üst düğüm DOM'dan kaldırılmadan _önce_ gerçekleşir. Bu, üst düğüm erkenden kaybolmadan alt elemanları güvenle animasyonla kaldırabilmenizi sağlar.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.ts">
    <docs-code header="leave-parent.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.ts" />
    <docs-code header="leave-parent.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.html" />
    <docs-code header="leave-parent.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.css"/>
</docs-code-multifile>

IMPORTANT: Alt animasyonlar yalnızca aynı bileşen şablonu içindeki elemanlar için tetiklenir. Kaldırılan bir eleman alt bileşenler içeriyorsa, bu alt bileşen şablonları içinde tanımlanan `animate.leave` animasyonları üst eleman kaldırılmadan önce **çalışmaz**. Bir alt bileşeni kaldırılırken animasyonla göstermek için bunun yerine `animate.leave`'i doğrudan üst şablon içinde alt bileşenin host elemanına uygulayın ya da animasyonun tetiklenmesini alt bileşende programatik olarak yönetip üst elemanın kaldırılmasını bu animasyon tamamlanana kadar geciktirin.

## Olay bağlamaları, fonksiyonlar ve üçüncü parti kütüphaneler

Hem `animate.enter` hem de `animate.leave`, fonksiyon çağrılarına izin veren olay bağlama sözdizimini destekler. Bu sözdizimini bileşen kodunuzdaki bir fonksiyonu çağırmak veya [GSAP](https://gsap.com/), [anime.js](https://animejs.com/) veya herhangi bir JavaScript animasyon kütüphanesi gibi üçüncü parti animasyon kütüphanelerini kullanmak için kullanabilirsiniz.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts">
    <docs-code header="leave-event.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts" />
    <docs-code header="leave-event.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.html" />
    <docs-code header="leave-event.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.css"/>
</docs-code-multifile>

`$event` nesnesi `AnimationCallbackEvent` tipindedir. Elemanı `target` olarak içerir ve animasyon bittiğinde çerçeveye bildirimde bulunmak için bir `animationComplete()` fonksiyonu sağlar.

IMPORTANT: `animate.leave` kullanırken Angular'ın elemanı kaldırması için `animationComplete()` fonksiyonunu **mutlaka** çağırmanız gerekir.

`animate.leave` kullanırken `animationComplete()` çağırmazsanız, Angular dört saniyelik bir gecikmeden sonra fonksiyonu otomatik olarak çağırır. `MAX_ANIMATION_TIMEOUT` tokenini milisaniye cinsinden sağlayarak gecikme süresini yapılandırabilirsiniz.

```typescript
  { provide: MAX_ANIMATION_TIMEOUT, useValue: 6000 }
```

## Eski Angular animasyonlarıyla uyumluluk

Eski animasyonları `animate.enter` ve `animate.leave` ile aynı bileşen içinde kullanamazsınız. Bunu yapmak, giriş sınıflarının eleman üzerinde kalmasına veya ayrılan düğümlerin kaldırılmamasına yol açar. Aynı _uygulama_ içinde hem eski animasyonları hem de yeni `animate.enter` ve `animate.leave` animasyonlarını kullanmak ise sorun değildir. Tek istisna içerik projeksiyonudur. Eski animasyonları olan bir bileşenden `animate.enter` veya `animate.leave` olan başka bir bileşene içerik projeksiyonu yapıyorsanız veya tam tersi, bu aynı bileşende birlikte kullanılıyormuş gibi aynı davranışa yol açar. Bu desteklenmemektedir.

## Test etme

TestBed, test ortamınızda animasyonları etkinleştirmek veya devre dışı bırakmak için yerleşik destek sağlar. CSS animasyonları çalışmak için bir tarayıcı gerektirir ve API'lerin çoğu test ortamında mevcut değildir. Varsayılan olarak TestBed, test ortamlarınızdaki animasyonları sizin için devre dışı bırakır.

Animasyonların bir tarayıcı testinde, örneğin uçtan uca bir testte animasyonlandığını test etmek istiyorsanız, test yapılandırmanızda `animationsEnabled: true` belirterek TestBed'i animasyonları etkinleştirecek şekilde yapılandırabilirsiniz.

```typescript
TestBed.configureTestingModule({animationsEnabled: true});
```

Bu, test ortamınızda animasyonları normal şekilde davranacak şekilde yapılandırır.

NOTE: Bazı test ortamları `animationstart`, `animationend` ve bunların geçiş olay karşılıkları gibi animasyon olaylarını yayınlamaz.

## Angular animasyonları hakkında daha fazla bilgi

Aşağıdakilerle de ilgilenebilirsiniz:

<docs-pill-row>
  <docs-pill href="guide/animations/css" title="CSS ile uygulamanızı animasyonlama"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route Geçiş Animasyonları"/>
</docs-pill-row>
