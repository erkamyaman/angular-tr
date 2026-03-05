# DevTools Overview

Angular DevTools, Angular uygulamaları için hata ayıklama ve profil oluşturma yetenekleri sağlayan bir tarayıcı uzantısıdır.

<docs-video src="https://www.youtube.com/embed/bavWOHZM6zE"/>

Angular DevTools'u [Chrome Web Mağazası](https://chrome.google.com/webstore/detail/angular-developer-tools/ienfalfjdbdpebioblfackkekamfmbnh)'ndan veya [Firefox Eklentileri](https://addons.mozilla.org/firefox/addon/angular-devtools/)'nden yükleyin.

Chrome veya Firefox DevTools'u herhangi bir web sayfasında <kbd>F12</kbd> veya <kbd><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd></kbd> (Windows veya Linux) ve <kbd><kbd>Fn</kbd>+<kbd>F12</kbd></kbd> veya <kbd><kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd></kbd> (Mac) tuşlarına basarak açabilirsiniz.
Tarayıcı DevTools açık ve Angular DevTools yüklü olduğunda, "Angular" sekmesi altında bulabilirsiniz.

HELPFUL: Chrome'un yeni sekme sayfası yüklü uzantıları çalıştırmaz, bu nedenle Angular sekmesi DevTools'ta görünmez. Görmek için başka herhangi bir sayfayı ziyaret edin.

<img src="assets/images/guide/devtools/devtools.png" alt="An overview of Angular DevTools showing a tree of components for an application.">

## Open your application

Uzantıyı açtığınızda üç ek sekme göreceksiniz:

| Sekmeler                                  | Ayrıntılar                                                                                                                     |
| :---------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------- |
| [Components](tools/devtools/component)    | Uygulamanızdaki bileşenleri ve direktifleri keşfetmenize ve durumlarını önizlemenize veya düzenlemenize olanak tanır.          |
| [Profiler](tools/devtools/profiler)       | Uygulamanızın profilini çıkarmanıza ve değişiklik algılama yürütme sırasındaki performans darboğazını anlamanıza olanak tanır. |
| [Injector Tree](tools/devtools/injectors) | Environment ve Element Injector hiyerarşisini görselleştirmenize olanak tanır                                                  |

`Router Tree` veya `Transfer State` gibi diğer sekmeler deneyseldir ve devtools ayarları üzerinden etkinleştirilebilir; henüz belgelenmemiştir.

HELPFUL: Chromium tabanlı tarayıcı kullanıcıları için, [Performans paneli entegrasyonu](/best-practices/profiling-with-chrome-devtools) ilginizi çekebilir.

<img src="assets/images/guide/devtools/devtools-tabs.png" alt="A screenshot of the top of Angular DevTools illustrating two tabs in the upper-left corner, one labeled 'Components' and another labeled 'Profiler'.">

Angular DevTools'un sağ üst köşesinde bir bilgi düğmesi bulunur ve bu düğme bir açılır pencere açar.
Bilgi açılır penceresi, diğerlerinin yanı sıra sayfada hangi Angular sürümünün çalıştığını ve devtools sürümünü içerir.

### Angular application not detected

Angular DevTools'u açarken "Angular application not detected" hata mesajı görürseniz, bu, sayfadaki bir Angular uygulamasıyla iletişim kuramadığı anlamına gelir.
Bunun en yaygın nedeni, incelediğiniz web sayfasının bir Angular uygulaması içermemesidir.
Doğru web sayfasını incelediğinizden ve Angular uygulamasının çalıştığından emin olun.

### We detected an application built with production configuration

"We detected an application built with production configuration. Angular DevTools only supports development builds." hata mesajı görürseniz, bu, sayfada bir Angular uygulaması bulunduğu ancak üretim optimizasyonlarıyla derlendiği anlamına gelir.
Üretim için derleme yaparken, Angular CLI performansı artırmak için sayfadaki JavaScript miktarını en aza indirmek amacıyla çeşitli hata ayıklama özelliklerini kaldırır. Bu, DevTools ile iletişim kurmak için gereken özellikleri de içerir.

DevTools'u çalıştırmak için uygulamanızı optimizasyonlar devre dışı bırakılmış şekilde derlemeniz gerekir. `ng serve` bunu varsayılan olarak yapar.
Dağıtılmış bir uygulamada hata ayıklamanız gerekiyorsa, yapılandırmanızda [`optimization` yapılandırma seçeneği](reference/configs/workspace-config#optimization-configuration) (`{"optimization": false}`) ile optimizasyonları devre dışı bırakın.
