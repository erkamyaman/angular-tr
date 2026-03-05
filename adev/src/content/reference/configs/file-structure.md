# Workspace and project file structure

Uygulamaları bir Angular çalışma alanı bağlamında geliştirirsiniz.
Bir çalışma alanı, bir veya daha fazla proje için dosyaları içerir.
Bir proje, bir uygulamayı veya paylaşılabilir bir kütüphaneyi oluşturan dosyalar kümesidir.

Angular CLI `ng new` komutu bir çalışma alanı oluşturur.

```shell
ng new my-project
```

Bu komutu çalıştırdığınızda, CLI gerekli Angular npm paketlerini ve diğer bağımlılıkları yeni bir çalışma alanına kurar ve _my-project_ adında bir kök düzey uygulama oluşturur.

Varsayılan olarak, `ng new` çalışma alanının kök düzeyinde bir başlangıç iskelet uygulaması ve uçtan uca testlerini oluşturur.
İskelet, çalıştırmaya hazır ve değiştirmesi kolay basit bir karşılama uygulaması içindir.
Kök düzey uygulama çalışma alanıyla aynı ada sahiptir ve kaynak dosyaları çalışma alanının `src/` alt klasöründe bulunur.

Bu varsayılan davranış, her uygulamanın kendi çalışma alanında bulunduğu tipik bir "multi-repo" geliştirme stili için uygundur.
Başlangıç ve orta düzey kullanıcıların her uygulama için ayrı bir çalışma alanı oluşturmak üzere `ng new` kullanmaları teşvik edilir.

Angular ayrıca [birden fazla projeli](#multiple-projects) çalışma alanlarını da destekler.
Bu tür bir geliştirme ortamı, paylaşılabilir kütüphaneler geliştiren ileri düzey kullanıcılar ve tüm Angular projeleri için tek bir depo ve genel yapılandırma kullanan "monorepo" geliştirme stilini benimseyen kuruluşlar için uygundur.

Bir monorepo çalışma alanı kurmak için kök uygulama oluşturmayı atlamalısınız.
Aşağıdaki [Çoklu proje çalışma alanı kurulumu](#multiple-projects) bölümüne bakın.

## Workspace configuration files

Bir çalışma alanındaki tüm projeler bir [yapılandırmayı](reference/configs/workspace-config) paylaşır.
Çalışma alanının en üst düzeyi, çalışma alanı genelinde yapılandırma dosyalarını, kök düzey uygulama için yapılandırma dosyalarını ve kök düzey uygulama kaynak ve test dosyaları için alt klasörleri içerir.

| Çalışma alanı yapılandırma dosyaları | Amaç                                                                                                                                                                                                                                                                                                               |
| :----------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.editorconfig`                      | Kod editörleri için yapılandırma. [EditorConfig](https://editorconfig.org) sayfasına bakın.                                                                                                                                                                                                                        |
| `.gitignore`                         | [Git](https://git-scm.com)'in yok sayması gereken, kasıtlı olarak izlenmeyen dosyaları belirtir.                                                                                                                                                                                                                   |
| `README.md`                          | Çalışma alanı için dokümantasyon.                                                                                                                                                                                                                                                                                  |
| `angular.json`                       | Çalışma alanındaki tüm projeler için CLI yapılandırması; her projenin nasıl derleneceği, sunulacağı ve test edileceğine ilişkin yapılandırma seçenekleri dahil. Ayrıntılar için [Angular Çalışma Alanı Yapılandırması](reference/configs/workspace-config) bölümüne bakın.                                         |
| `package.json`                       | Çalışma alanındaki tüm projeler için kullanılabilen [npm paket bağımlılıklarını](reference/configs/npm-packages) yapılandırır. Bu dosyanın belirli biçimi ve içeriği için [npm dokümantasyonuna](https://docs.npmjs.com/files/package.json) bakın.                                                                 |
| `package-lock.json`                  | npm istemcisi tarafından `node_modules` içine kurulan tüm paketler için sürüm bilgisi sağlar. Ayrıntılar için [npm dokümantasyonuna](https://docs.npmjs.com/files/package-lock.json) bakın.                                                                                                                        |
| `src/`                               | Kök düzey uygulama projesi için kaynak dosyaları.                                                                                                                                                                                                                                                                  |
| `public/`                            | Geliştirme sunucusu tarafından statik dosyalar olarak sunulacak ve uygulamanızı derlerken olduğu gibi kopyalanacak görüntü ve diğer varlık dosyalarını içerir.                                                                                                                                                     |
| `node_modules/`                      | Tüm çalışma alanı için kurulmuş [npm paketleri](reference/configs/npm-packages). Çalışma alanı genelindeki `node_modules` bağımlılıkları tüm projeler tarafından görülebilir.                                                                                                                                      |
| `tsconfig.json`                      | Çalışma alanındaki projeler için temel [TypeScript](https://www.typescriptlang.org) yapılandırması. Diğer tüm yapılandırma dosyaları bu temel dosyadan devralır. Daha fazla bilgi için [ilgili TypeScript dokümantasyonuna](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases) bakın. |

## Application project files

Varsayılan olarak, CLI komutu `ng new my-app` "my-app" adında bir çalışma alanı klasörü oluşturur ve çalışma alanının en üst düzeyinde bir `src/` klasöründe yeni bir uygulama iskeleti oluşturur.
Yeni oluşturulan uygulama, bir kök bileşen ve şablonla birlikte bir kök modül için kaynak dosyaları içerir.

Çalışma alanı dosya yapısı oluşturulduktan sonra, uygulamaya işlevsellik ve veri eklemek için komut satırında `ng generate` komutunu kullanabilirsiniz.
Bu başlangıç kök düzey uygulaması, CLI komutları için _varsayılan uygulamadır_ ([ek uygulamalar](#multiple-projects) oluşturduktan sonra varsayılanı değiştirmediğiniz sürece).

Tek uygulamalı bir çalışma alanı için, çalışma alanının `src` alt klasörü kök uygulama için kaynak dosyalarını (uygulama mantığı, veri ve varlıklar) içerir.
Çoklu proje çalışma alanı için, `projects` klasöründeki ek projeler aynı yapıya sahip bir `project-name/src/` alt klasörü içerir.

### Application source files

`src/` dizininin en üst düzeyindeki dosyalar uygulamanızın çalışmasını destekler.
Alt klasörler uygulama kaynağını ve uygulamaya özgü yapılandırmayı içerir.

| Uygulama destek dosyaları | Amaç                                                                                                                                                                                                                                                |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`                    | Uygulama mantığınızın ve verilerinizin tanımlandığı bileşen dosyalarını içerir. Ayrıntılar için aşağıya bakın.                                                                                                                                      |
| `favicon.ico`             | Yer işareti çubuğunda bu uygulama için kullanılacak bir simge.                                                                                                                                                                                      |
| `index.html`              | Birisi sitenizi ziyaret ettiğinde sunulan ana HTML sayfası. CLI, uygulamanızı derlerken tüm JavaScript ve CSS dosyalarını otomatik olarak ekler, bu nedenle genellikle burada manuel olarak `<script>` veya `<link>` etiketleri eklemeniz gerekmez. |
| `main.ts`                 | Uygulamanızın ana giriş noktası.                                                                                                                                                                                                                    |
| `styles.css`              | Tüm uygulamaya uygulanan genel CSS stilleri.                                                                                                                                                                                                        |

`src` klasörünün içinde, `app` klasörü projenizin mantığını ve verilerini içerir.
Angular bileşenleri, şablonları ve stilleri buraya yerleştirilir.

| `src/app/` dosyaları    | Amaç                                                                                                                                                                                                                                                                                               |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app.config.ts`         | Angular'a uygulamanın nasıl birleştirileceğini söyleyen uygulama yapılandırmasını tanımlar. Uygulamaya daha fazla sağlayıcı ekledikçe, burada bildirilmeleri gerekir.<br><br>_Yalnızca `--standalone` seçeneği kullanıldığında oluşturulur._                                                       |
| `app.component.ts`      | Uygulamanın `AppComponent` adlı kök bileşenini tanımlar. Bu kök bileşenle ilişkili görünüm, uygulamanıza bileşenler ve servisler ekledikçe görünüm hiyerarşisinin kökü olur.                                                                                                                       |
| `app.component.html`    | `AppComponent` ile ilişkili HTML şablonunu tanımlar.                                                                                                                                                                                                                                               |
| `app.component.css`     | `AppComponent` için CSS stil sayfasını tanımlar.                                                                                                                                                                                                                                                   |
| `app.component.spec.ts` | `AppComponent` için bir birim testi tanımlar.                                                                                                                                                                                                                                                      |
| `app.module.ts`         | Angular'a uygulamanın nasıl birleştirileceğini söyleyen `AppModule` adlı kök modülü tanımlar. Başlangıçta yalnızca `AppComponent`'i bildirir. Uygulamaya daha fazla bileşen ekledikçe, burada bildirilmeleri gerekir.<br><br>_Yalnızca `--standalone false` seçeneği kullanıldığında oluşturulur._ |
| `app.routes.ts`         | Uygulamanın yönlendirme yapılandırmasını tanımlar.                                                                                                                                                                                                                                                 |

### Application configuration files

Kök uygulama için uygulamaya özgü yapılandırma dosyaları çalışma alanı kök düzeyinde bulunur.
Çoklu proje çalışma alanı için, projeye özgü yapılandırma dosyaları `projects/project-name/` altındaki proje kökünde bulunur.

Projeye özgü [TypeScript](https://www.typescriptlang.org) yapılandırma dosyaları, çalışma alanı genelindeki `tsconfig.json`'dan devralır.

| Uygulamaya özgü yapılandırma dosyaları | Amaç                                                                                                                                                                                             |
| :------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsconfig.app.json`                    | [Angular derleyici seçenekleri](reference/configs/angular-compiler-options) dahil, uygulamaya özgü [TypeScript yapılandırması](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html). |
| `tsconfig.spec.json`                   | Uygulama testleri için [TypeScript yapılandırması](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).                                                                             |

## Multiple projects

Çoklu proje çalışma alanı, birden fazla Angular projesi için tek bir depo ve genel yapılandırma kullanan bir kuruluş için uygundur ("monorepo" modeli).
Çoklu proje çalışma alanı ayrıca kütüphane geliştirmeyi de destekler.

### Setting up for a multi-project workspace

Çalışma alanında birden fazla proje bulundurmayı planlıyorsanız, çalışma alanını oluştururken ilk uygulama oluşturmayı atlayabilir ve çalışma alanına benzersiz bir ad verebilirsiniz.
Aşağıdaki komut, tüm çalışma alanı genelinde yapılandırma dosyalarıyla birlikte ancak kök düzey uygulama olmadan bir çalışma alanı oluşturur.

```shell
ng new my-workspace --no-create-application
```

Daha sonra çalışma alanı içinde benzersiz adlara sahip uygulamalar ve kütüphaneler oluşturabilirsiniz.

```shell
cd my-workspace
ng generate application my-app
ng generate library my-lib
```

### Multiple project file structure

İlk açıkça oluşturulan uygulama, çalışma alanındaki diğer tüm projelerle birlikte `projects` klasörüne gider.
Yeni oluşturulan kütüphaneler de `projects` altına eklenir.
Projeleri bu şekilde oluşturduğunuzda, çalışma alanının dosya yapısı [çalışma alanı yapılandırma dosyası](reference/configs/workspace-config), `angular.json` yapısıyla tamamen tutarlıdır.

```markdown
my-workspace/
├── … (workspace-wide configuration files)
└── projects/ (applications and libraries)
├── my-app/ (an explicitly generated application)
│ └── … (application-specific code and configuration)
└── my-lib/ (a generated library)
└── … (library-specific code and configuration)
```

## Library project files

CLI kullanarak bir kütüphane oluşturduğunuzda (`ng generate library my-lib` gibi bir komutla), oluşturulan dosyalar çalışma alanının `projects/` klasörüne gider.
Kendi kütüphanelerinizi oluşturma hakkında daha fazla bilgi için [Kütüphane Oluşturma](tools/libraries/creating-libraries) bölümüne bakın.

Bir uygulamanın aksine, bir kütüphanenin kendi `package.json` yapılandırma dosyası vardır.

`projects/` klasörü altında, `my-lib` klasörü kütüphane kodunuzu içerir.

| Kütüphane kaynak dosyaları | Amaç                                                                                                                                                                                              |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/lib`                  | Kütüphane projenizin mantığını ve verilerini içerir. Bir uygulama projesi gibi, bir kütüphane projesi de bileşenler, servisler, modüller, direktifler ve pipe'lar içerebilir.                     |
| `src/public-api.ts`        | Kütüphanenizden dışa aktarılan tüm dosyaları belirtir.                                                                                                                                            |
| `ng-package.json`          | Kütüphanenizi derlemek için [ng-packagr](https://github.com/ng-packagr/ng-packagr) tarafından kullanılan yapılandırma dosyası.                                                                    |
| `package.json`             | Bu kütüphane için gerekli olan [npm paket bağımlılıklarını](reference/configs/npm-packages) yapılandırır.                                                                                         |
| `tsconfig.lib.json`        | [Angular derleyici seçenekleri](reference/configs/angular-compiler-options) dahil, kütüphaneye özgü [TypeScript Yapılandırması](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html). |
| `tsconfig.lib.prod.json`   | Kütüphane üretim modunda derlenirken kullanılan kütüphaneye özgü [TypeScript Yapılandırması](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).                                    |
| `tsconfig.spec.json`       | Kütüphanenin birim testleri için [TypeScript Yapılandırması](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).                                                                    |
