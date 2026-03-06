# NgOptimizedImage ile Başlarken

`NgOptimizedImage` direktifi, görsel yükleme için performans en iyi uygulamalarını benimsemeyi kolaylaştırır.

Direktif, [Largest Contentful Paint (LCP)](http://web.dev/lcp) görselinin yüklenmesinin önceliklendirilmesini şu şekilde sağlar:

- `<img>` etiketinde `fetchpriority` niteliğini otomatik olarak ayarlama
- Diğer görselleri varsayılan olarak tembel yükleme
- Belge başlığında otomatik olarak bir preconnect bağlantı etiketi oluşturma
- Otomatik olarak bir `srcset` niteliği oluşturma
- Uygulama SSR kullanıyorsa bir [preload ipucu](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload) oluşturma

LCP görselinin yüklenmesini optimize etmenin yanı sıra, `NgOptimizedImage` aşağıdakiler gibi bir dizi görsel en iyi uygulamasını zorlar:

- [Görsel optimizasyonları uygulamak için görsel CDN URL'lerini](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options) kullanma
- `width` ve `height` gerektirerek düzen kaymasını önleme
- `width` veya `height` yanlış ayarlanmışsa uyarı verme
- Görsel render edildiğinde görsel olarak bozulacaksa uyarı verme

CSS'te bir arka plan görseli kullanıyorsanız, [buradan başlayın](#arka-plan-görselinizi-nasıl-taşırsınız).

**NOTE: `NgOptimizedImage` direktifi Angular sürüm 15'te kararlı bir özellik haline getirilmiş olsa da, geriye taşınmış ve 13.4.0 ile 14.3.0 sürümlerinde de kararlı bir özellik olarak mevcuttur.**

## Başlarken

<docs-workflow>
<docs-step title="`NgOptimizedImage` direktifini içe aktarın">
`NgOptimizedImage` direktifini `@angular/common`'dan içe aktarın:

```ts
import {NgOptimizedImage} from '@angular/common';
```

ve bağımsız bir bileşenin veya NgModule'ün `imports` dizisine ekleyin:

```ts
imports: [
  NgOptimizedImage,
  // ...
],
```

</docs-step>
<docs-step title="(İsteğe bağlı) Bir Yükleyici kurun">
NgOptimizedImage'ı kullanmak için bir görsel yükleyici **gerekli** değildir, ancak bir görsel CDN ile birini kullanmak, görselleriniz için otomatik `srcset`'ler dahil güçlü performans özelliklerini etkinleştirir.

Bir yükleyici kurma hakkında kısa bir kılavuz, bu sayfanın sonundaki [Görsel Yükleyici Yapılandırma](#ngoptimizedimage-için-görsel-yükleyici-yapılandırma) bölümünde bulunabilir.
</docs-step>
<docs-step title="Direktifi etkinleştirin">
`NgOptimizedImage` direktifini etkinleştirmek için görselinizin `src` niteliğini `ngSrc` ile değiştirin.

```html
<img ngSrc="cat.jpg" />
```

Bir [yerleşik üçüncü taraf yükleyici](#yerleşik-yükleyiciler) kullanıyorsanız, yükleyici tarafından otomatik olarak ekleneceği için `src`'den temel URL yolunu çıkardığınızdan emin olun.
</docs-step>
<docs-step title="Resimleri `priority` olarak işaretleyin">
Yüklenmesini önceliklendirmek için sayfanızdaki [LCP görselini](https://web.dev/lcp/#what-elements-are-considered) her zaman `priority` olarak işaretleyin.

```html
<img ngSrc="cat.jpg" width="400" height="200" priority />
```

Bir görseli `priority` olarak işaretlemek aşağıdaki optimizasyonları uygular:

- `fetchpriority=high` ayarlar (öncelik ipuçları hakkında daha fazla bilgi [burada](https://web.dev/priority-hints))
- `loading=eager` ayarlar (yerel tembel yükleme hakkında daha fazla bilgi [burada](https://web.dev/browser-level-image-lazy-loading))
- [Sunucuda render ediliyorsa](guide/ssr) otomatik olarak bir [preload bağlantı öğesi](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload) oluşturur.

Angular, LCP öğesi `priority` niteliğine sahip olmayan bir görsel ise geliştirme sırasında bir uyarı görüntüler. Bir sayfanın LCP öğesi, kullanıcının ekranının boyutları gibi birçok faktöre göre değişebilir, bu nedenle bir sayfada `priority` olarak işaretlenmesi gereken birden fazla görsel olabilir. Daha fazla ayrıntı için [CSS for Web Vitals](https://web.dev/css-web-vitals/#images-and-largest-contentful-paint-lcp) bölümüne bakın.
</docs-step>
<docs-step title="Genişlik ve Yükseklik ekleyin">
[Görselle ilgili düzen kaymalarını](https://web.dev/css-web-vitals/#images-and-layout-shifts) önlemek için NgOptimizedImage, görseliniz için aşağıdaki gibi bir yükseklik ve genişlik belirtmenizi gerektirir:

```html
<img ngSrc="cat.jpg" width="400" height="200" />
```

**Duyarlı görseller** (görünüm alanına göre büyüyüp küçülecek şekilde stillendirilmiş görseller) için `width` ve `height` nitelikleri görsel dosyasının gerçek boyutu olmalıdır. Duyarlı görseller için ayrıca [`sizes` için bir değer ayarlamak](#duyarlı-görseller) da önemlidir.

**Sabit boyutlu görseller** için `width` ve `height` nitelikleri görselin istenen render boyutunu yansıtmalıdır. Bu niteliklerin en-boy oranı her zaman görselin gerçek en-boy oranıyla eşleşmelidir.

NOTE: Görsellerinizin boyutunu bilmiyorsanız, üst kapsayıcının boyutunu devralmak için aşağıda açıklanan "fill modunu" kullanmayı düşünün.
</docs-step>
</docs-workflow>

## `fill` Modunu Kullanma

Bir görselin bir kapsayıcı öğeyi doldurmasını istediğiniz durumlarda `fill` niteliğini kullanabilirsiniz. Bu, genellikle bir "arka plan görseli" davranışı elde etmek istediğinizde kullanışlıdır. Ayrıca görselinizin tam genişlik ve yüksekliğini bilmediğinizde, ancak görselinizi sığdırmak istediğiniz bilinen bir boyuta sahip bir üst kapsayıcınız olduğunda da yardımcı olabilir (aşağıdaki "object-fit" bölümüne bakın).

Görselinize `fill` niteliğini eklediğinizde, bu örnekte olduğu gibi bir `width` ve `height` eklemenize gerek yoktur ve eklememelisiniz:

```html
<img ngSrc="cat.jpg" fill />
```

Görselin kapsayıcısını nasıl dolduracağını değiştirmek için [object-fit](https://developer.mozilla.org/docs/Web/CSS/object-fit) CSS özelliğini kullanabilirsiniz. Görselinizi `object-fit: "contain"` ile stillerseniz, görsel en-boy oranını koruyacak ve öğeye sığacak şekilde "letterbox" yapılacaktır. `object-fit: "cover"` ayarlarsanız, öğe en-boy oranını koruyacak, öğeyi tamamen dolduracak ve bazı içerikler "kırpılabilir".

Yukarıdakilerin görsel örnekleri için [MDN object-fit belgelerine](https://developer.mozilla.org/docs/Web/CSS/object-fit) bakın.

Ayrıca görselin kapsayıcı öğe içindeki konumunu ayarlamak için [object-position özelliğiyle](https://developer.mozilla.org/docs/Web/CSS/object-position) stilleyebilirsiniz.

IMPORTANT: "fill" görselinin düzgün render edilmesi için üst öğesi `position: "relative"`, `position: "fixed"` veya `position: "absolute"` ile stillendirilmiş **olmalıdır**.

## Arka Plan Görselinizi Nasıl Taşırsınız

`background-image`'dan `NgOptimizedImage`'a geçiş için basit bir adım adım süreç. Bu adımlar için, görsel arka planına sahip öğeyi "kapsayıcı öğe" olarak adlandıracağız:

1. `background-image` stilini kapsayıcı öğeden kaldırın.
2. Kapsayıcı öğenin `position: "relative"`, `position: "fixed"` veya `position: "absolute"` değerine sahip olduğundan emin olun.
3. `NgOptimizedImage` direktifini etkinleştirmek için `ngSrc` kullanarak kapsayıcı öğenin alt öğesi olarak yeni bir görsel öğesi oluşturun.
4. O öğeye `fill` niteliğini verin. Bir `height` ve `width` eklemeyin.
5. Bu görselin [LCP öğeniz](https://web.dev/lcp/) olabileceğini düşünüyorsanız, görsel öğesine `priority` niteliğini ekleyin.

Arka plan görselinin kapsayıcıyı nasıl doldurduğunu [Fill modunu kullanma](#fill-modunu-kullanma) bölümünde açıklandığı gibi ayarlayabilirsiniz.

## Yer Tutucuları Kullanma

### Otomatik Yer Tutucular

NgOptimizedImage, otomatik görsel yeniden boyutlandırma sağlayan bir CDN veya görsel barındırıcı kullanıyorsanız görseliniz için otomatik düşük çözünürlüklü bir yer tutucu görüntüleyebilir. Görselinize `placeholder` niteliğini ekleyerek bu özellikten yararlanın:

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder />
```

Bu niteliği eklemek, belirttiğiniz görsel yükleyicisini kullanarak otomatik olarak ikinci, daha küçük bir görsel sürümü ister. Bu küçük görsel, görseliniz yüklenirken CSS bulanıklaştırma ile bir `background-image` stili olarak uygulanır. Hiçbir görsel yükleyici sağlanmazsa, yer tutucu görsel oluşturulamaz ve bir hata fırlatılır.

Oluşturulan yer tutucular için varsayılan boyut 30px genişliktedir. Bu boyutu, aşağıda görüldüğü gibi `IMAGE_CONFIG` sağlayıcısında bir piksel değeri belirterek değiştirebilirsiniz:

```ts
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      placeholderResolution: 40
    }
  },
],
```

Bulanık yer tutucunuzun etrafında keskin kenarlar istiyorsanız, görselinizi `overflow: hidden` stiliyle bir kapsayıcı `<div>` ile sarabilirsiniz. `<div>`, görsel ile aynı boyutta olduğu sürece (örneğin `width: fit-content` stili kullanarak), yer tutucunun "bulanık kenarları" gizlenecektir.

### Data URL Yer Tutucuları

Ayrıca bir görsel yükleyici olmadan base64 [veri URL'si](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) kullanarak bir yer tutucu belirtebilirsiniz. Veri url formatı `data:image/[imagetype];[data]` şeklindedir; burada `[imagetype]` görsel formatıdır, örneğin `png`, ve `[data]` görselin base64 kodlamasıdır. Bu kodlama komut satırı veya JavaScript ile yapılabilir. Belirli komutlar için [MDN belgelerine](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs#encoding_data_into_base64_format) bakın. Kısaltılmış veriye sahip bir veri URL yer tutucu örneği aşağıda gösterilmiştir:

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder="data:image/png;base64,iVBORw0K..." />
```

Ancak, büyük veri URL'leri Angular paketlerinizin boyutunu artırır ve sayfa yüklemesini yavaşlatır. Bir görsel yükleyici kullanamıyorsanız, Angular ekibi base64 yer tutucu görsellerini 4KB'den küçük tutmanızı ve bunları yalnızca kritik görsellerde kullanmanızı önerir. Yer tutucu boyutlarını küçültmenin yanı sıra, görselleri kaydederken kullanılan görsel formatlarını veya parametreleri değiştirmeyi düşünün. Çok düşük çözünürlüklerde, bu parametreler dosya boyutu üzerinde büyük bir etkiye sahip olabilir.

### Bulanıklaştırılmamış Yer Tutucular

Varsayılan olarak, NgOptimizedImage görsel yer tutucularına CSS bulanıklaştırma efekti uygular. Bir yer tutucuyu bulanıklaştırma olmadan render etmek için, `blur` özelliğini false olarak ayarlanmış bir nesne ile bir `placeholderConfig` argümanı sağlayın. Örneğin:

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder [placeholderConfig]="{blur: false}" />
```

## Görsel Stilini Ayarlama

Görselin stiline bağlı olarak, `width` ve `height` niteliklerini eklemek görselin farklı şekilde render edilmesine neden olabilir. `NgOptimizedImage`, görsel stiliniz görseli bozulmuş bir en-boy oranıyla render ederse sizi uyarır.

Bunu genellikle görsel stillerinize `height: auto` veya `width: auto` ekleyerek düzeltebilirsiniz. Daha fazla bilgi için [`<img>` etiketi hakkında web.dev makalesine](https://web.dev/patterns/web-vitals-patterns/images/img-tag) bakın.

Görseldeki `width` ve `height` nitelikleri CSS ile görseli istediğiniz şekilde boyutlandırmanızı engelliyorsa, bunun yerine `fill` modunu kullanmayı ve görselin üst öğesini stillemeyi düşünün.

## Performans Özellikleri

NgOptimizedImage, uygulamanızda yükleme performansını artırmak için tasarlanmış birçok özellik içerir. Bu özellikler bu bölümde açıklanmaktadır.

### Kaynak İpuçları Ekleme

Görsel kaynağınız için bir [`preconnect` kaynak ipucu](https://web.dev/preconnect-and-dns-prefetch), LCP görselinin mümkün olduğunca hızlı yüklenmesini sağlar.

Preconnect bağlantıları, bir [yükleyiciye](#ngoptimizedimage-için-görsel-yükleyici-yapılandırma) argüman olarak sağlanan alanlar için otomatik olarak oluşturulur. Bir görsel kaynağı otomatik olarak tanımlanamıyorsa ve LCP görseli için bir preconnect bağlantısı algılanmıyorsa, `NgOptimizedImage` geliştirme sırasında uyarı verir. Bu durumda, belge başlığına manuel olarak bir kaynak ipucu eklemelisiniz. Belgenin `<head>` bölümünde, aşağıda gösterildiği gibi `rel="preconnect"` ile bir `link` etiketi ekleyin:

```html
<link rel="preconnect" href="https://my.cdn.origin" />
```

Preconnect uyarılarını devre dışı bırakmak için `PRECONNECT_CHECK_BLOCKLIST` token'ını enjekte edin:

```ts

providers: [
{provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'https://your-domain.com'}
],

```

Otomatik preconnect oluşturma hakkında daha fazla bilgi için [buraya](#görsel-alanım-için-neden-bir-preconnect-öğesi-oluşturulmuyor) bakın.

### Otomatik `srcset` ile Doğru Boyutta Görsel İsteme

Bir [`srcset` niteliği](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset) tanımlamak, tarayıcının kullanıcınızın görünüm alanı için doğru boyutta bir görsel istemesini sağlar, böylece çok büyük bir görseli indirmek için zaman kaybedilmez. `NgOptimizedImage`, görsel etiketindeki [`sizes` niteliğinin](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) varlığına ve değerine dayalı olarak görsel için uygun bir `srcset` oluşturur.

#### Sabit Boyutlu Görseller

Görselinizin "sabit" boyutta olması gerekiyorsa (yani cihazlar arasında aynı boyut, [piksel yoğunluğu](https://web.dev/codelab-density-descriptors/) hariç), bir `sizes` niteliği ayarlamaya gerek yoktur. Görselin genişlik ve yükseklik niteliklerinden başka bir girdi gerektirmeden otomatik olarak bir `srcset` oluşturulabilir.

Oluşturulan srcset örneği:

```html
<img ... srcset="image-400w.jpg 1x, image-800w.jpg 2x" />
```

#### Duyarlı Görseller

Görselinizin duyarlı olması gerekiyorsa (yani görünüm alanı boyutuna göre büyüyüp küçülüyorsa), `srcset`'i oluşturmak için bir [`sizes` niteliği](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) tanımlamanız gerekir.

Daha önce `sizes` kullanmadıysanız, görünüm alanı genişliğine göre ayarlamak iyi bir başlangıç noktasıdır. Örneğin, CSS'iniz görselin görünüm alanı genişliğinin %100'ünü doldurmasına neden oluyorsa, `sizes`'ı `100vw` olarak ayarlayın ve tarayıcı `srcset`'teki görünüm alanı genişliğine en yakın görseli seçecektir (piksel yoğunluğunu hesaba kattıktan sonra). Görselinizin yalnızca ekranın yarısını kaplayacağı tahmin ediliyorsa (örneğin bir kenar çubuğunda), tarayıcının daha küçük bir görsel seçmesini sağlamak için `sizes`'ı `50vw` olarak ayarlayın. Ve böyle devam eder.

Yukarıdakilerin istediğiniz görsel davranışını karşılamadığını fark ederseniz, [gelişmiş sizes değerleri](#gelişmiş-sizes-değerleri) belgelerine bakın.

`NgOptimizedImage`'ın sağlanan `sizes` değerinin başına otomatik olarak `"auto"` eklediğini unutmayın. Bu, `sizes="auto"` destekleyen tarayıcılarda srcset seçiminin doğruluğunu artıran bir optimizasyondur ve desteklemeyen tarayıcılar tarafından göz ardı edilir.

Varsayılan olarak, duyarlı kesme noktaları şunlardır:

`[16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]`

Bu kesme noktalarını özelleştirmek istiyorsanız, `IMAGE_CONFIG` sağlayıcısını kullanarak yapabilirsiniz:

```ts
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920]
    }
  },
],
```

Bir `srcset` niteliğini manuel olarak tanımlamak isterseniz, `ngSrcset` niteliğini kullanarak kendinizinkini sağlayabilirsiniz:

```html
<img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" />
```

`ngSrcset` niteliği mevcutsa, `NgOptimizedImage` dahil edilen boyutlara dayalı olarak `srcset`'i oluşturur ve ayarlar. `ngSrcset`'e görsel dosya adlarını eklemeyin - direktif bu bilgiyi `ngSrc`'den çıkarır. Direktif hem genişlik tanımlayıcılarını (örneğin `100w`) hem de yoğunluk tanımlayıcılarını (örneğin `1x`) destekler.

```html
<img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" sizes="50vw" />
```

### Otomatik srcset Oluşturmayı Devre Dışı Bırakma

Tek bir görsel için srcset oluşturmayı devre dışı bırakmak amacıyla görsele `disableOptimizedSrcset` niteliğini ekleyebilirsiniz:

```html
<img ngSrc="about.jpg" disableOptimizedSrcset />
```

### Görsel Tembel Yüklemeyi Devre Dışı Bırakma

Varsayılan olarak, `NgOptimizedImage` `priority` olarak işaretlenmeyen tüm görseller için `loading=lazy` ayarlar. Öncelikli olmayan görseller için bu davranışı `loading` niteliğini ayarlayarak devre dışı bırakabilirsiniz. Bu nitelik şu değerleri kabul eder: `eager`, `auto` ve `lazy`. [Ayrıntılar için standart görsel `loading` niteliği belgelerine bakın](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/loading#value).

```html
<img ngSrc="cat.jpg" width="400" height="200" loading="eager" />
```

### Görsel Çözümlemeyi Kontrol Etme

Varsayılan olarak, `NgOptimizedImage` tüm görseller için `decoding="auto"` ayarlar. Bu, tarayıcının bir görseli getirdikten sonra onu çözme için en uygun zamanı belirlemesine olanak tanır. Bir görsel `priority` olarak işaretlendiğinde, Angular otomatik olarak `decoding="sync"` ayarlayarak görselin en erken zamanda çözümlenmesini ve boyanmasını sağlar ve **Largest Contentful Paint (LCP)** performansını iyileştirmeye yardımcı olur.

Bu davranışı açıkça `decoding` niteliğini ayarlayarak geçersiz kılabilirsiniz.
[Ayrıntılar için standart görsel `decoding` niteliği belgelerine bakın](https://developer.mozilla.org/docs/Web/HTML/Element/img#decoding).

```html
<!-- Varsayılan: decoding 'auto' olarak ayarlıdır -->
<img ngSrc="gallery/landscape.jpg" width="1200" height="800" />

<!-- Ana iş parçacığını engellememek için görseli asenkron olarak çöz.-->
<img ngSrc="gallery/preview.jpg" width="600" height="400" decoding="async" />

<!-- Öncelikli görseller otomatik olarak decoding="sync" kullanır -->
<img ngSrc="awesome.jpg" width="500" height="625" priority />

<!-- Piksellere hemen ihtiyacınız olduğunda anında çöz (engelleyebilir) -->
<img ngSrc="hero.jpg" width="1600" height="900" decoding="sync" />
```

**İzin verilen değerler**

- `auto` (varsayılan): tarayıcının en uygun stratejiyi seçmesine izin verir.
- `async`: görseli asenkron olarak çözer, mümkün olduğunda ana iş parçacığı engellemesini önler.
- `sync`: görseli hemen çözer; render'ı engelleyebilir ancak görsel mevcut olduğunda piksellerin hazır olmasını sağlar.

### Gelişmiş 'sizes' Değerleri

Görsellerin farklı boyutlu ekranlarda farklı genişliklerde görüntülenmesini isteyebilirsiniz. Bunun yaygın bir örneği, mobil cihazlarda tek sütun ve daha büyük cihazlarda iki sütun render eden ızgara veya sütun tabanlı bir düzendir. Bu davranışı aşağıdaki gibi bir "medya sorgusu" sözdizimi kullanarak `sizes` niteliğinde yakalayabilirsiniz:

```html
<img ngSrc="cat.jpg" width="400" height="200" sizes="(max-width: 768px) 100vw, 50vw" />
```

Yukarıdaki örnekteki `sizes` niteliği "768px'den dar cihazlarda bu görselin ekran genişliğinin yüzde 100'ü olmasını bekliyorum. Aksi takdirde, ekran genişliğinin yüzde 50'si olmasını bekliyorum" demektedir.

`sizes` niteliği hakkında ek bilgi için [web.dev](https://web.dev/learn/design/responsive-images/#sizes) veya [mdn](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) adresine bakın.

## `NgOptimizedImage` için Görsel Yükleyici Yapılandırma

Bir "yükleyici", belirli bir görsel dosyası için bir [görsel dönüştürme URL'si](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options) oluşturan bir fonksiyondur. Uygun olduğunda, `NgOptimizedImage` bir görsel için boyut, format ve görsel kalitesi dönüşümlerini ayarlar.

`NgOptimizedImage`, hiçbir dönüşüm uygulamayan genel bir yükleyicinin yanı sıra çeşitli üçüncü taraf görsel servisleri için yükleyiciler sağlar. Ayrıca kendi özel yükleyicinizi yazmayı da destekler.

| Loader type                                      | Behavior                                                                                                                                                                                                                                       |
| :----------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Genel yükleyici                                  | Genel yükleyici tarafından döndürülen URL her zaman `src` değeriyle eşleşir. Başka bir deyişle, bu yükleyici hiçbir dönüşüm uygulamaz. Görselleri sunmak için Angular kullanan siteler, bu yükleyicinin birincil amaçlanan kullanım durumudur. |
| Üçüncü taraf görsel servisleri için yükleyiciler | Üçüncü taraf görsel servisleri için yükleyiciler tarafından döndürülen URL, o belirli görsel servisi tarafından kullanılan API kurallarını izler.                                                                                              |
| Özel yükleyiciler                                | Bir özel yükleyicinin davranışı geliştiricisi tarafından tanımlanır. Görsel servisiniz `NgOptimizedImage` ile önceden yapılandırılmış yükleyiciler tarafından desteklenmiyorsa özel bir yükleyici kullanmalısınız.                             |

Angular uygulamalarıyla yaygın olarak kullanılan görsel servislerine dayalı olarak, `NgOptimizedImage` aşağıdaki görsel servisleriyle çalışmak üzere önceden yapılandırılmış yükleyiciler sağlar:

| Image Service             | Angular API               | Documentation                                                               |
| :------------------------ | :------------------------ | :-------------------------------------------------------------------------- |
| Cloudflare Image Resizing | `provideCloudflareLoader` | [Documentation](https://developers.cloudflare.com/images/image-resizing/)   |
| Cloudinary                | `provideCloudinaryLoader` | [Documentation](https://cloudinary.com/documentation/resizing_and_cropping) |
| ImageKit                  | `provideImageKitLoader`   | [Documentation](https://docs.imagekit.io/)                                  |
| Imgix                     | `provideImgixLoader`      | [Documentation](https://docs.imgix.com/)                                    |
| Netlify                   | `provideNetlifyLoader`    | [Documentation](https://docs.netlify.com/image-cdn/overview/)               |

**Genel yükleyiciyi** kullanmak için ek kod değişikliği gerekmez. Bu varsayılan davranıştır.

### Yerleşik Yükleyiciler

**Üçüncü taraf görsel servisi** için mevcut bir yükleyici kullanmak üzere, seçtiğiniz servis için sağlayıcı fabrikasını `providers` dizisine ekleyin. Aşağıdaki örnekte Imgix yükleyicisi kullanılmaktadır:

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
],
```

Görsel varlıklarınızın temel URL'si, sağlayıcı fabrikasına argüman olarak geçirilmelidir. Çoğu site için bu temel URL aşağıdaki kalıplardan biriyle eşleşmelidir:

- <https://yoursite.yourcdn.com>
- <https://subdomain.yoursite.com>
- <https://subdomain.yourcdn.com/yoursite>

Temel URL yapısı hakkında daha fazla bilgiyi ilgili CDN sağlayıcısının belgelerinde öğrenebilirsiniz.

### Özel Yükleyiciler

**Özel yükleyici** kullanmak için, yükleyici fonksiyonunuzu `IMAGE_LOADER` DI token'ı için bir değer olarak sağlayın. Aşağıdaki örnekte, özel yükleyici fonksiyonu `https://example.com` ile başlayan ve URL parametreleri olarak `src`, `width` ve `height` içeren bir URL döndürür.

```ts
providers: [
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      return `https://example.com/images?src=${config.src}&width=${config.width}&height=${config.height}`;
    },
  },
],
```

`NgOptimizedImage` direktifi için bir yükleyici fonksiyonu, argüman olarak `ImageLoaderConfig` türünde (`@angular/common`'dan) bir nesne alır ve görsel varlığının mutlak URL'sini döndürür. `ImageLoaderConfig` nesnesi `src` özelliğini ve isteğe bağlı `width`, `height` ve `loaderParams` özelliklerini içerir.

NOTE: `width` özelliği her zaman mevcut olmasa da, özel bir yükleyicinin `ngSrcset`'in düzgün çalışması için çeşitli genişliklerde görsel istemeyi desteklemek üzere bunu kullanması gerekir.

### `loaderParams` Özelliği

`NgOptimizedImage` direktifi tarafından desteklenen, özellikle özel yükleyicilerin kullanımını desteklemek için tasarlanmış `loaderParams` adlı ek bir nitelik vardır. `loaderParams` niteliği, değer olarak herhangi bir özelliğe sahip bir nesne alır ve kendi başına hiçbir şey yapmaz. `loaderParams`'taki veriler, özel yükleyicinize geçirilen `ImageLoaderConfig` nesnesine eklenir ve yükleyicinin davranışını kontrol etmek için kullanılabilir.

`loaderParams` için yaygın bir kullanım, gelişmiş görsel CDN özelliklerini kontrol etmektir.

### Yerleşik Yükleyicilerde `transform` Özelliğini Kullanma

Cloudinary, Cloudflare, ImageKit ve Imgix için yerleşik yükleyiciler, `loaderParams` içinde özel bir `transform` özelliğini destekler. Bu özellik, CDN'niz tarafından sağlanan özel görsel dönüşümlerini uygulamanıza olanak tanır.

`transform` özelliği iki format kabul eder:

#### Dize Formatı

CDN'nizin dönüşüm sözdizimini kullanarak dönüşümleri virgülle ayrılmış bir dize olarak sağlayın:

```html
<img
  ngSrc="my-image.jpg"
  width="400"
  height="300"
  [loaderParams]="{transform: 'e_grayscale,r_10'}"
/>
```

#### Nesne Formatı

Dönüşümleri anahtar-değer çiftleri ile bir nesne olarak sağlayın.

```html
<img
  ngSrc="my-image.jpg"
  width="400"
  height="300"
  [loaderParams]="{transform: {e: 'grayscale', r: 10}}"
/>
```

NOTE: `transform` özelliği Netlify yükleyicisi tarafından desteklenmez çünkü Netlify'ın görsel CDN'si özel dönüşüm parametreleri sağlamaz.

### Örnek Özel Yükleyici

Aşağıda bir özel yükleyici fonksiyonu örneği gösterilmektedir. Bu örnek fonksiyon `src`, `width` ve `height`'ı birleştirir ve yuvarlatılmış köşeler için özel bir CDN özelliğini kontrol etmek üzere `loaderParams`'ı kullanır:

```ts
const myCustomLoader = (config: ImageLoaderConfig) => {
  let url = `https://example.com/images/${config.src}?`;
  let queryParams = [];
  if (config.width) {
    queryParams.push(`w=${config.width}`);
  }
  if (config.height) {
    queryParams.push(`h=${config.height}`);
  }
  if (config.loaderParams?.roundedCorners) {
    queryParams.push('mask=corners&corner-radius=5');
  }
  return url + queryParams.join('&');
};
```

Yukarıdaki örnekte, özel yükleyicimizin bir özelliğini kontrol etmek için 'roundedCorners' özellik adını icat ettik. Daha sonra bu özelliği bir görsel oluştururken aşağıdaki gibi kullanabiliriz:

```html
<img ngSrc="profile.jpg" width="300" height="300" [loaderParams]="{roundedCorners: true}" />
```

## Sıkça Sorulan Sorular

### NgOptimizedImage `background-image` CSS özelliğini destekliyor mu?

NgOptimizedImage, `background-image` CSS özelliğini doğrudan desteklemez, ancak bir görselin başka bir öğenin arka planı olarak kullanılması durumunu kolayca karşılamak için tasarlanmıştır.

`background-image`'dan `NgOptimizedImage`'a geçiş için adım adım bir süreç için yukarıdaki [Arka plan görselinizi nasıl geçirirsiniz](#arka-plan-görselinizi-nasıl-taşırsınız) bölümüne bakın.

### `NgOptimizedImage` ile neden `src` kullanamıyorum?

`ngSrc` niteliği, görsellerin tarayıcı tarafından nasıl yüklendiğiyle ilgili teknik nedenlerle NgOptimizedImage'ın tetikleyicisi olarak seçilmiştir. NgOptimizedImage, `loading` niteliğinde programatik değişiklikler yapar -- tarayıcı bu değişiklikler yapılmadan önce `src` niteliğini görürse, görsel dosyasını hevesle indirmeye başlar ve yükleme değişiklikleri göz ardı edilir.

### Görsel alanım için neden bir preconnect öğesi oluşturulmuyor?

Preconnect oluşturma, uygulamanızın statik analizine dayalı olarak gerçekleştirilir. Bu, görsel alanının aşağıdaki örnekte olduğu gibi doğrudan yükleyici parametresine dahil edilmesi gerektiği anlamına gelir:

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
],
```

Alan dizesini yükleyiciye geçirmek için bir değişken kullanırsanız veya bir yükleyici kullanmıyorsanız, statik analiz alanı tanımlayamaz ve hiçbir preconnect bağlantısı oluşturulmaz. Bu durumda, [yukarıda açıklandığı gibi](#kaynak-ipuçları-ekleme) belge başlığına manuel olarak bir preconnect bağlantısı eklemelisiniz.

### Aynı sayfada iki farklı görsel alanı kullanabilir miyim?

[Görsel yükleyicileri](#ngoptimizedimage-için-görsel-yükleyici-yapılandırma) sağlayıcı kalıbı, bir bileşen içinde yalnızca tek bir görsel CDN kullanmanın yaygın kullanım durumu için mümkün olduğunca basit olacak şekilde tasarlanmıştır. Ancak, tek bir sağlayıcı kullanarak birden fazla görsel CDN'yi yönetmek yine de oldukça mümkündür.

Bunu yapmak için, hangi görsel CDN'sinin kullanılacağını belirten bir bayrak geçirmek üzere [`loaderParams` özelliğini](#loaderparams-özelliği) kullanan bir [özel görsel yükleyici](#özel-yükleyiciler) yazmanızı ve ardından bu bayrağa göre uygun yükleyiciyi çağırmanızı öneririz.

### Tercih ettiğim CDN için yeni bir yerleşik yükleyici ekleyebilir misiniz?

Bakım nedenleriyle, şu anda Angular deposunda ek yerleşik yükleyicileri desteklemeyi planlamıyoruz. Bunun yerine, geliştiricileri ek görsel yükleyicilerini üçüncü taraf paketler olarak yayınlamaya teşvik ediyoruz.

### Bunu `<picture>` etiketiyle kullanabilir miyim?

Hayır, ancak bu yol haritamızda, bu yüzden takipte kalın.

Bu özelliği bekliyorsanız, lütfen [buradaki](https://github.com/angular/angular/issues/56594) Github sorununu oylayın.

### Chrome DevTools ile LCP görselimi nasıl bulurum?

1. Chrome DevTools'un performans sekmesini kullanarak, sol üstteki "profillemeyi başlat ve sayfayı yeniden yükle" düğmesine tıklayın. Sayfa yenileme simgesi gibi görünür.

2. Bu, Angular uygulamanızın bir profilleme anlık görüntüsünü tetikler.

3. Profilleme sonucu mevcut olduğunda, zamanlama bölümünde "LCP"yi seçin.

4. Alt panelde bir özet girişi görünmelidir. LCP öğesini "ilgili düğüm" satırında bulabilirsiniz. Üzerine tıklamak, Öğeler panelinde öğeyi gösterecektir.

<img alt="LCP in the Chrome DevTools" src="assets/images/guide/image-optimization/devtools-lcp.png">

NOTE: Bu yalnızca test ettiğiniz sayfanın görünüm alanı içindeki LCP öğesini tanımlar. Daha küçük ekranlar için LCP öğesini tanımlamak amacıyla mobil emülasyonu kullanmanız da önerilir.
