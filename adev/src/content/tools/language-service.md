# Angular Dil Servisi

Angular Dil Servisi, kod editörlerine Angular şablonları içinde tamamlamalar, hatalar, ipuçları ve navigasyon elde etme imkanı sağlar.
Ayrı HTML dosyalarındaki harici şablonlarla ve satır içi şablonlarla çalışır.

## Angular Dil Servisi İçin Derleyici Seçeneklerini Yapılandırma

En son Dil Servisi özelliklerini etkinleştirmek için, aşağıdaki örnekte gösterildiği gibi `tsconfig.json` dosyasında `strictTemplates` seçeneğini `true` olarak ayarlayın:

```json

"angularCompilerOptions": {
  "strictTemplates": true
}

```

Daha fazla bilgi için [Angular compiler options](reference/configs/angular-compiler-options) kılavuzuna bakın.

## Özellikler

Editörünüz bir Angular dosyası açtığınızı otomatik olarak algılar.
Ardından `tsconfig.json` dosyanızı okumak, uygulamanızdaki tüm şablonları bulmak ve açtığınız herhangi bir şablon için dil hizmetleri sağlamak üzere Angular Dil Servisi'ni kullanır.

Dil hizmetleri şunları içerir:

- Tamamlama listeleri
- AOT Tanılama mesajları
- Hızlı bilgi
- Tanıma git

### Otomatik Tamamlama

Otomatik tamamlama, yazarken bağlamsal olasılıklar ve ipuçları sunarak geliştirme sürenizi hızlandırabilir.
Bu örnek, bir enterpolasyondaki otomatik tamamlamayı göstermektedir.
Yazarken tamamlamak için sekme tuşuna basabilirsiniz.

<img alt="autocompletion" src="assets/images/guide/language-service/language-completion.gif">

Öğeler içinde de tamamlamalar mevcuttur.
Bileşen seçici olarak sahip olduğunuz tüm öğeler tamamlama listesinde görünür.

### Hata Kontrolü

Angular Dil Servisi, kodunuzdaki hataları önceden size bildirebilir.
Bu örnekte Angular, `orders`'ın ne olduğunu veya nereden geldiğini bilmiyor.

<img alt="error checking" src="assets/images/guide/language-service/language-error.gif">

### Hızlı Bilgi ve Navigasyon

Hızlı bilgi özelliği, bileşenlerin, direktiflerin ve modüllerin nereden geldiğini görmek için üzerine gelmenize olanak tanır.
Ardından doğrudan tanıma gitmek için "Go to definition" seçeneğine tıklayabilir veya F12 tuşuna basabilirsiniz.

<img alt="navigation" src="assets/images/guide/language-service/language-navigation.gif">

## Editörünüzde Angular Dil Servisi

Angular Dil Servisi şu anda [Visual Studio Code](https://code.visualstudio.com), [WebStorm](https://www.jetbrains.com/webstorm), [Sublime Text](https://www.sublimetext.com), [Zed](https://zed.dev), [Neovim](https://neovim.io) ve [Eclipse IDE](https://www.eclipse.org/eclipseide) için bir uzantı olarak mevcuttur.

### Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com) içinde, uzantıyı [Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)'ten yükleyin.
Sol menü panelindeki Uzantılar simgesini kullanarak editörden marketplace'i açın veya VS Quick Open \(Mac'te ⌘+P, Windows'ta CTRL+P\) kullanın ve "? ext" yazın.
Marketplace'te Angular Language Service uzantısını arayın ve **Install** düğmesine tıklayın.

Visual Studio Code'un Angular dil servisi ile entegrasyonu Angular ekibi tarafından sürdürülmekte ve dağıtılmaktadır.

### Visual Studio

[Visual Studio](https://visualstudio.microsoft.com) içinde, uzantıyı [Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.AngularLanguageService)'ten yükleyin.
Üst menü panelinden Extensions'ı ve ardından Manage Extensions'ı seçerek editörden marketplace'i açın.
Marketplace'te Angular Language Service uzantısını arayın ve **Install** düğmesine tıklayın.

Visual Studio'nun Angular dil servisi ile entegrasyonu, Angular ekibinin yardımıyla Microsoft tarafından sürdürülmekte ve dağıtılmaktadır.
Projeye [buradan](https://github.com/microsoft/vs-ng-language-service) göz atabilirsiniz.

### WebStorm

[WebStorm](https://www.jetbrains.com/webstorm) içinde, [Angular and AngularJS](https://plugins.jetbrains.com/plugin/6971-angular-and-angularjs) eklentisini etkinleştirin.

WebStorm 2019.1'den itibaren `@angular/language-service` artık gerekli değildir ve `package.json` dosyanızdan kaldırılmalıdır.

### Sublime Text

[Sublime Text](https://www.sublimetext.com) içinde, Dil Servisi eklenti olarak yüklendiğinde yalnızca satır içi şablonları destekler.
HTML dosyalarındaki tamamlamalar için özel bir Sublime eklentisine \(veya mevcut eklentide değişikliklere\) ihtiyacınız vardır.

Satır içi şablonlar için Dil Servisi'ni kullanmak üzere önce TypeScript'e izin veren bir uzantı eklemeniz, ardından Angular Language Service eklentisini yüklemeniz gerekir.
TypeScript 2.3'ten itibaren TypeScript, dil servisinin kullanabileceği bir eklenti modeline sahiptir.

1. TypeScript'in en son sürümünü yerel bir `node_modules` dizinine yükleyin:

   ```shell
   npm install --save-dev typescript
   ```

1. Angular Language Service paketini aynı konuma yükleyin:

   ```shell

   npm install --save-dev @angular/language-service

   ```

1. Paket yüklendikten sonra, projenizin `tsconfig.json` dosyasının `"compilerOptions"` bölümüne aşağıdakini ekleyin.

   ```json {header:"tsconfig.json"}
   "plugins": [
     {"name": "@angular/language-service"}
   ]
   ```

1. Editörünüzün kullanıcı tercihlerinde \(`Cmd+,` veya `Ctrl+,`\), aşağıdakini ekleyin:

   ```json {header:"Sublime Text user preferences"}

   "typescript-tsdk": "<path to your folder>/node_modules/typescript/lib"

   ```

Bu, Angular Dil Servisi'nin `.ts` dosyalarında tanılama ve tamamlamalar sağlamasına olanak tanır.

### Eclipse IDE

Doğrudan Angular Language Server'ı içeren "Eclipse IDE for Web and JavaScript developers" paketini yükleyin veya diğer Eclipse IDE paketlerinden Help > Eclipse Marketplace'i kullanarak [Eclipse Wild Web Developer](https://marketplace.eclipse.org/content/wild-web-developer-html-css-javascript-typescript-nodejs-angular-json-yaml-kubernetes-xml)'ı bulup yükleyin.

### Neovim

#### Node.js ile Conquer of Completion

Angular Dil Servisi, LSP spesifikasyonlarını tam olarak takip etmeyen tsserver'ı kullanır. Bu nedenle, JavaScript veya TypeScript veya Angular ile neovim veya vim kullanıyorsanız, [Conquer of Completion](https://github.com/neoclide/coc.nvim) (COC)'un Angular Dil Servisi ve tsserver'ın en kapsamlı uygulamasına sahip olduğunu görebilirsiniz. Bunun nedeni, COC'un tsserver'ın uygulamasını barındıran VSCode tsserver uygulamasını taşımasıdır.

1. [Setup coc.nvim](https://github.com/neoclide/coc.nvim)

2. Angular Dil Servisi'ni yapılandırın

   Yüklendikten sonra `CocConfig` vim komut satırı komutunu çalıştırarak `coc-settings.json` yapılandırma dosyasını açın ve angular özelliğini ekleyin.

   Global `node_modules` dizinlerinize giden doğru yolları, sırasıyla `tsserver` ve `ngserver` içeren dizinlere gidecek şekilde değiştirdiğinizden emin olun.

   ```json {header:"CocConfig example file coc-settings.json"}
   {
     "languageserver": {
       "angular": {
         "command": "ngserver",
         "args": [
           "--stdio",
           "--tsProbeLocations",
           "/usr/local/lib/node_modules/typescript/lib/CHANGE/THIS/TO/YOUR/GLOBAL/NODE_MODULES",
           "--ngProbeLocations",
           "/usr/local/lib/node_modules/@angular/language-server/bin/CHANGE/THIS/TO/YOUR/GLOBAL/NODE_MODULES"
         ],
         "filetypes": ["ts", "typescript", "html"],
         "trace.server.verbosity": "verbose"
       }
     }
   }
   ```

HELPFUL: Yukarıdaki `/usr/local/lib/node_modules/typescript/lib` ve `/usr/local/lib/node_modules/@angular/language-server/bin` yolları, global node modüllerinizin konumuna işaret etmelidir ve bu konum farklı olabilir.

#### Yerleşik Neovim LSP

Angular Dil Servisi, [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig) eklentisi kullanılarak Neovim ile birlikte kullanılabilir.

1. [Install nvim-lspconfig](https://github.com/neovim/nvim-lspconfig?tab=readme-ov-file#install)

2. [Configure angularls for nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#angularls)

### Zed

[Zed](https://zed.dev) içinde, uzantıyı [Extensions: Marketplace](https://zed.dev/extensions/angular)'ten yükleyin.

## Dil Servisi Nasıl Çalışır

Bir dil servisi olan bir editör kullandığınızda, editör ayrı bir dil servisi süreci başlatır ve [Language Server Protocol](https://microsoft.github.io/language-server-protocol) kullanarak bir [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call) aracılığıyla onunla iletişim kurar.
Editöre yazdığınızda, editör projenizin durumunu takip etmek için dil servisi sürecine bilgi gönderir.

Bir şablon içinde tamamlama listesini tetiklediğinizde, editör önce şablonu bir HTML [soyut sözdizimi ağacına (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) ayrıştırır.
Angular derleyicisi, bağlamı belirlemek için bu ağacı yorumlar: şablonun hangi modülün parçası olduğunu, mevcut kapsamı, bileşen seçicisini ve imlecinizin şablon AST'sinde nerede olduğunu belirler.
Ardından o konumda potansiyel olarak bulunabilecek sembolleri belirleyebilir.

Bir enterpolasyon içindeyseniz durum biraz daha karmaşıktır.
Bir `div` içinde `{{data.---}}` enterpolasyonunuz varsa ve `data.---`'den sonraki tamamlama listesine ihtiyacınız varsa, derleyici cevabı bulmak için HTML AST'sini kullanamaz.
HTML AST'si derleyiciye yalnızca "`{{data.---}}`" karakterlerine sahip bir metin olduğunu söyleyebilir.
İşte bu noktada şablon ayrıştırıcısı, şablon AST'si içinde bulunan bir ifade AST'si üretir.
Angular Dil Servisleri daha sonra bağlamı içinde `data.---`'e bakar, TypeScript Dil Servisi'ne `data`'nın üyelerinin ne olduğunu sorar ve olasılıkların listesini döndürür.

## Daha Fazla Bilgi

- Uygulama hakkında daha ayrıntılı bilgi için [Angular Language Service source](https://github.com/angular/angular/blob/main/packages/language-service/src) sayfasına bakın
- Tasarım kararları ve niyetleri hakkında daha fazla bilgi için [design documentation here](https://github.com/angular/vscode-ng-language-service/wiki/Design) sayfasına bakın
