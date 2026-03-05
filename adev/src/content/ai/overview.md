<!-- TODO: need an Angular + AI logo -->

<docs-decorative-header title="Build with AI" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
Yapay zeka destekli uygulamalar geliştirin. Yapay zeka ile daha hızlı geliştirme yapın.
</docs-decorative-header>

HELPFUL: Favori yapay zeka destekli IDE'nizde geliştirmeye başlamak mı istiyorsunuz? <br>[Prompt kurallarımızı ve en iyi uygulamalarımızı](/ai/develop-with-ai) inceleyin.

Büyük dil modelleri (LLM'ler) ile üretken yapay zeka (GenAI), kişiselleştirilmiş içerik, akıllı öneriler, medya üretimi ve anlama, bilgi özetleme ve dinamik işlevsellik dahil olmak üzere sofistike ve etkileyici uygulama deneyimlerinin oluşturulmasını sağlar.

Bu tür özelliklerin geliştirilmesi daha önce derin alan uzmanlığı ve önemli mühendislik çabası gerektirirdi. Ancak yeni ürünler ve SDK'lar giriş engelini düşürmektedir. Angular, aşağıdaki özellikleri sayesinde yapay zekayı web uygulamanıza entegre etmek için çok uygundur:

- Angular'ın güçlü şablonlama API'leri, üretilen içerikten oluşan dinamik, temiz bir şekilde birleştirilmiş kullanıcı arayüzlerinin oluşturulmasını sağlar
- Verileri ve durumu dinamik olarak yönetmek için tasarlanmış güçlü, sinyal tabanlı mimari
- Angular, yapay zeka SDK'ları ve API'leri ile sorunsuz bir şekilde entegre olur

Bu kılavuz, Angular uygulamalarınıza bugün yapay zeka eklemek için [Genkit](/ai#build-ai-powered-applications-with-genkit-and-angular), [Firebase AI Logic](/ai#build-ai-powered-applications-with-firebase-ai-logic-and-angular) ve [Gemini API](/ai#build-ai-powered-applications-with-gemini-api-and-angular)'yi nasıl kullanabileceğinizi göstermektedir. Bu kılavuz, yapay zekayı Angular uygulamalarına entegre etmeye nasıl başlayacağınızı açıklayarak yapay zeka destekli web uygulaması geliştirme yolculuğunuzu hızlandıracaktır. Bu kılavuz ayrıca hızlı bir şekilde ilerlemenizi sağlayacak başlangıç kitleri, örnek kodlar ve yaygın iş akışları için tarifler gibi kaynakları paylaşmaktadır.

Başlamak için Angular hakkında temel bir anlayışa sahip olmanız gerekir. Angular'da yeni misiniz? [Temel bilgiler kılavuzumuzu](/essentials) veya [başlangıç eğitimlerimizi](/tutorials) deneyin.

NOTE: Bu sayfa Google yapay zeka ürünleriyle entegrasyonlar ve örnekler içerse de, Genkit gibi araçlar model agnostiktir ve kendi modelinizi seçmenize olanak tanır. Birçok durumda, örnekler ve kod parçacıkları diğer üçüncü taraf çözümlere de uygulanabilir.

## Getting Started

Yapay zeka destekli uygulamalar geliştirmek yeni ve hızla gelişen bir alandır. Nereden başlayacağınıza ve hangi teknolojileri seçeceğinize karar vermek zor olabilir. Aşağıdaki bölüm, aralarından seçim yapabileceğiniz üç seçenek sunmaktadır:

1. _Genkit_, tam yığın uygulamalar oluşturmak için [desteklenen model ve birleşik API ile arayüz](https://genkit.dev) seçimi sunar. Kişiselleştirilmiş öneriler gibi sofistike arka uç yapay zeka mantığı gerektiren uygulamalar için idealdir.

1. _Firebase AI Logic_, yalnızca istemci tarafı uygulamalar veya mobil uygulamalar oluşturmak için Google'ın modellerine güvenli bir istemci tarafı API'si sağlar. Gerçek zamanlı metin analizi veya temel sohbet botları gibi doğrudan tarayıcıdaki etkileşimli yapay zeka özellikleri için en iyisidir.

1. _Gemini API_, API yüzeyi aracılığıyla doğrudan sunulan yöntemleri ve işlevselliği kullanan bir uygulama oluşturmanızı sağlar; tam yığın uygulamalar için en iyisidir. Özel görüntü üretimi veya derin veri işleme gibi yapay zeka modelleri üzerinde doğrudan kontrol gerektiren uygulamalar için uygundur.

### Build AI-powered applications with Genkit and Angular

[Genkit](https://genkit.dev), web ve mobil uygulamalarda yapay zeka destekli özellikler oluşturmanıza yardımcı olmak için tasarlanmış açık kaynaklı bir araç setidir. Google, OpenAI, Anthropic, Ollama ve daha fazlasından yapay zeka modellerini entegre etmek için birleşik bir arayüz sunar, böylece ihtiyaçlarınız için en iyi modelleri keşfedebilir ve seçebilirsiniz. Sunucu tarafı bir çözüm olarak, web uygulamalarınızın Genkit ile entegre olmak için desteklenen bir sunucu ortamına, örneğin node tabanlı bir sunucuya ihtiyacı vardır. Angular SSR kullanarak tam yığın bir uygulama oluşturmak, size örneğin başlangıç sunucu tarafı kodunu verir.

Genkit ve Angular ile nasıl geliştirme yapılacağına dair örnekler:

- [Genkit ve Angular ile Ajansal Uygulamalar başlangıç kiti](https://github.com/angular/examples/tree/main/genkit-angular-starter-kit) — Yapay zeka ile geliştirmede yeni misiniz? Ajansal bir iş akışı içeren temel bir uygulama ile buradan başlayın. İlk yapay zeka geliştirme deneyiminiz için mükemmel bir başlangıç noktası.

- [Angular uygulamasında Genkit kullanma](https://genkit.dev/docs/frameworks/angular/) — Genkit Flows, Angular ve Gemini 2.5 Flash kullanan temel bir uygulama oluşturun. Bu adım adım rehber, yapay zeka özellikleri içeren tam yığın bir Angular uygulaması oluşturma sürecinde size yol gösterir.

- [Dinamik Hikaye Oluşturucu uygulaması](https://github.com/angular/examples/tree/main/genkit-angular-story-generator) — Genkit, Gemini ve Imagen 3 tarafından desteklenen, kullanıcı etkileşimine dayalı olarak dinamik bir hikaye oluşturan ve yaşanan olaylara eşlik eden güzel görüntü panelleri içeren ajansal bir Angular uygulaması oluşturmayı öğrenin. Daha gelişmiş bir kullanım senaryosuyla deney yapmak istiyorsanız buradan başlayın.

  Bu örneğin ayrıca işlevselliğin derinlemesine bir video açıklaması vardır:
  - [Watch "Building Agentic Apps with Angular and Genkit live!"](https://youtube.com/live/mx7yZoIa2n4?feature=share)
  - [Watch "Building Agentic Apps with Angular and Genkit live! PT 2"](https://youtube.com/live/YR6LN5_o3B0?feature=share)

- [Firebase ve Google Cloud ile Ajansal uygulamalar geliştirme (Barista Örneği)](https://developers.google.com/solutions/learn/agentic-barista) - Firebase ve Google Cloud ile ajansal bir kahve sipariş uygulaması oluşturmayı öğrenin. Bu örnek hem Firebase AI Logic hem de Genkit kullanır.

- [Dinamik, Sunucu Tarafından Yönetilen Kullanıcı Arayüzleri Oluşturma](https://github.com/angular/examples/tree/main/dynamic-sdui-app) - Kullanıcı girdisine dayalı olarak çalışma zamanında oluşturulan kullanıcı arayüzü görünümleri ile Ajansal Angular uygulamaları oluşturmayı öğrenin.

  Bu örneğin ayrıca işlevselliğin derinlemesine bir video açıklaması vardır:
  - [Watch "Exploring the future of web apps"](https://www.youtube.com/live/4qargCqOu70?feature=share)

### Build AI-powered applications with Firebase AI Logic and Angular

[Firebase AI Logic](https://firebase.google.com/products/vertex-ai-in-firebase), web ve mobil uygulamalarınızdan doğrudan Vertex AI Gemini API veya Imagen API ile etkileşime geçmenin güvenli bir yolunu sunar. Bu, uygulamaların hem tam yığın hem de yalnızca istemci tarafı olabilmesi nedeniyle Angular geliştiricileri için caziptir. Yalnızca istemci tarafı bir uygulama geliştiriyorsanız, Firebase AI Logic web uygulamalarınıza yapay zeka eklemek için iyi bir seçenektir.

Firebase AI Logic ve Angular ile nasıl geliştirme yapılacağına dair bir örnek:

- [Firebase AI Logic x Angular Başlangıç Kiti](https://github.com/angular/examples/tree/main/vertex-ai-firebase-angular-example) - Görevleri gerçekleştirebilen bir sohbet ajanı ile bir e-ticaret uygulaması oluşturmak için bu başlangıç kitini kullanın. Firebase AI Logic ve Angular ile geliştirme deneyiminiz yoksa buradan başlayın.

  Bu örnek, [işlevselliği açıklayan ve yeni özellikler eklemeyi gösteren derinlemesine bir video açıklaması](https://youtube.com/live/4vfDz2al_BI) içerir.

### Build AI-powered applications with Gemini API and Angular

[Gemini API](https://ai.google.dev/gemini-api/docs), ses, görüntü, video ve metin girdisini destekleyen Google'ın en son modellerine erişim sağlar. Bu modeller belirli kullanım senaryoları için optimize edilmiştir, [Gemini API dokümantasyon sitesinde daha fazla bilgi edinin](https://ai.google.dev/gemini-api/docs/models).

- [Yapay Zeka Metin Düzenleyici Angular uygulama şablonu](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-text-editor) - Metni iyileştirme, metni genişletme ve metni resmileştirme gibi yapay zeka destekli özelliklerle tam işlevli bir metin düzenleyici ile başlamak için bu şablonu kullanın. Bu, Gemini API'sini HTTP aracılığıyla çağırma deneyimi kazanmak için iyi bir başlangıç noktasıdır.

- [Yapay Zeka Sohbet Botu uygulama şablonu](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-chatbot) - Bu şablon, HTTP aracılığıyla Gemini API ile iletişim kuran bir sohbet botu kullanıcı arayüzü ile başlar.

## Best Practices

### Connecting to model providers and keeping your API Credentials Secure

Model sağlayıcılarına bağlanırken API gizli anahtarlarınızı güvende tutmanız önemlidir. _API anahtarınızı asla `environments.ts` gibi istemciye gönderilen bir dosyaya koymayın_.

Uygulamanızın mimarisi hangi yapay zeka API'lerini ve araçlarını seçeceğinizi belirler. Özellikle, uygulamanızın istemci tarafı mı yoksa sunucu tarafı mı olduğuna göre seçim yapın. Firebase AI Logic gibi araçlar, istemci tarafı kodu için model API'lerine güvenli bir bağlantı sağlar. Firebase AI Logic'ten farklı bir API kullanmak veya farklı bir model sağlayıcısı tercih etmek istiyorsanız, API anahtarlarınızı açığa çıkarmamak için bir proxy sunucu veya hatta [Cloud Functions for Firebase](https://firebase.google.com/docs/functions) oluşturmayı düşünün.

İstemci tarafı bir uygulamada bağlantı kurma örneği için koda bakın: [Firebase AI Logic Angular örnek deposu](https://github.com/angular/examples/tree/main/vertex-ai-firebase-angular-example).

API anahtarları gerektiren model API'lerine sunucu tarafı bağlantıları için `environments.ts` yerine bir gizli anahtar yöneticisi veya ortam değişkeni kullanmayı tercih edin. API anahtarlarını ve kimlik bilgilerini güvence altına almak için standart en iyi uygulamaları takip etmelisiniz. Firebase artık Firebase App Hosting'in en son güncellemeleri ile yeni bir gizli anahtar yöneticisi sunmaktadır. Daha fazla bilgi için [resmi dokümantasyona göz atın](https://firebase.google.com/docs/app-hosting/configure).

Tam yığın bir uygulamada sunucu tarafı bağlantı örneği için koda bakın: [Angular AI Örneği (Genkit ve Angular Hikaye Oluşturucu) deposu](https://github.com/angular/examples/tree/main/genkit-angular-story-generator).

### Use Tool Calling to enhance apps

Ajansal iş akışları oluşturmak istiyorsanız - burada ajanlar, promptlara dayalı olarak hareket edebilir ve sorunları çözmek için araçları kullanabilir - "araç çağrısı" kullanın. Fonksiyon çağrısı olarak da bilinen araç çağrısı, LLM'lere kendisini çağıran uygulamaya geri istek yapma yeteneği sağlamanın bir yoludur. Bir geliştirici olarak, hangi araçların mevcut olduğunu siz tanımlarsınız ve araçların nasıl veya ne zaman çağrılacağı konusunda kontrole sahipsiniz.

Araç çağrısı, yapay zeka entegrasyonunuzu bir soru-cevap tarzı sohbet botunun ötesine taşıyarak web uygulamalarınızı daha da geliştirir. Aslında, model sağlayıcınızın fonksiyon çağrısı API'sini kullanarak modelinizi fonksiyon çağrıları talep etme konusunda yetkilendirebilirsiniz. Mevcut araçlar, uygulamanızın bağlamında daha karmaşık eylemleri gerçekleştirmek için kullanılabilir.

[Angular örnekler deposunun](https://github.com/angular/examples) [e-ticaret örneğinde](https://github.com/angular/examples/blob/main/vertex-ai-firebase-angular-example/src/app/ai.service.ts#L88), LLM, bir grup mağaza ürününün ne kadara mal olacağını hesaplamak gibi daha karmaşık görevleri gerçekleştirmek için gerekli bağlamı elde etmek amacıyla envanter fonksiyonlarına çağrı yapmayı talep eder. Mevcut API'nin kapsamı, LLM tarafından talep edilen bir fonksiyonun çağrılıp çağrılmayacağı gibi, geliştirici olarak size bağlıdır. Yürütme akışının kontrolü sizde kalır. Örneğin bir servisin belirli fonksiyonlarını açığa çıkarabilir ancak o servisin tüm fonksiyonlarını açığa çıkarmayabilirsiniz.

### Handling non-deterministic responses

Modeller deterministik olmayan sonuçlar döndürebildiğinden, uygulamalarınız bunu göz önünde bulundurarak tasarlanmalıdır. Uygulama implementasyonunuzda kullanabileceğiniz birkaç strateji:

- Daha fazla veya daha az deterministik yanıtlar için promptları ve model parametrelerini ([sıcaklık](https://ai.google.dev/gemini-api/docs/prompting-strategies) gibi) ayarlayın. [Prompting stratejileri bölümünde daha fazla bilgi edinebilirsiniz](https://ai.google.dev/gemini-api/docs/prompting-strategies) - [ai.google.dev](https://ai.google.dev/).
- Bir iş akışında devam etmeden önce bir insanın çıktıları doğruladığı "döngüde insan" stratejisini kullanın. Uygulama iş akışlarınızı, operatörlerin (insanlar veya diğer modeller) çıktıları doğrulayıp önemli kararları onaylayabilecek şekilde oluşturun.
- Model yanıtlarını önceden tanımlanmış formatlara yönlendirmek ve kısıtlamak için araç (veya fonksiyon) çağrısı ve şema kısıtlamalarını kullanın, bu da yanıt öngörülebilirliğini artırır.

Bu stratejileri ve teknikleri göz önünde bulundurarak bile, uygulama tasarımınıza mantıklı geri dönüş mekanizmaları dahil edilmelidir. Mevcut uygulama dayanıklılığı standartlarını takip edin. Örneğin, bir kaynak veya API mevcut olmadığında bir uygulamanın çökmesi kabul edilemez. Bu senaryoda, kullanıcıya bir hata mesajı görüntülenir ve varsa sonraki adımlar için seçenekler de gösterilir. Yapay zeka destekli uygulamalar geliştirmek aynı değerlendirmeyi gerektirir. Yanıtın beklenen çıktıyla uyumlu olduğunu doğrulayın ve uyumlu olmaması durumunda [zarif bozulma](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation) yoluyla "güvenli iniş" sağlayın. Bu, LLM sağlayıcıları için API kesintileri için de geçerlidir.

Şu örneği düşünün: LLM sağlayıcısı yanıt vermiyor. Kesintiyi ele almak için olası bir strateji:

- Yeniden deneme senaryosunda (şimdi veya daha sonra) kullanmak üzere kullanıcıdan gelen yanıtı kaydedin
- Hassas bilgileri açığa çıkarmayan uygun bir mesajla kullanıcıyı kesinti hakkında uyarın
- Hizmetler tekrar kullanılabilir olduğunda daha sonra konuşmaya devam edin.

## Next steps

LLM promptları ve yapay zeka IDE kurulumu hakkında bilgi edinmek için aşağıdaki kılavuzlara bakın:

<docs-pill-row>
  <docs-pill href="ai/develop-with-ai" title="LLM prompts and IDE setup"/>
</docs-pill-row>
