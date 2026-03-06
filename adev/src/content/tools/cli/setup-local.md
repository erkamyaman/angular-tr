# Yerel ortam ve çalışma alanı kurulumu

Bu kılavuz, [Angular CLI](cli 'CLI command reference') kullanarak Angular geliştirme ortamınızı nasıl kuracağınızı açıklar.
CLI'ı yükleme, başlangıç çalışma alanı ve başlangıç uygulaması oluşturma ve kurulumunuzu doğrulamak için bu uygulamayı yerel olarak çalıştırma hakkında bilgi içerir.

<docs-callout title="Yerel kurulum olmadan Angular'ı deneyin">

Angular'da yeniyseniz, tarayıcınızda Angular'ın temellerini tanıtan [Şimdi deneyin!](tutorials/learn-angular) ile başlamak isteyebilirsiniz.
Bu bağımsız eğitim, çevrimiçi geliştirme için etkileşimli [StackBlitz](https://stackblitz.com) ortamından yararlanır.
Hazır olana kadar yerel ortamınızı kurmanıza gerek yoktur.

</docs-callout>

## Başlamadan önce

Angular CLI'ı kullanmak için aşağıdakilere aşina olmanız gerekir:

<docs-pill-row>
  <docs-pill href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" title="JavaScript"/>
  <docs-pill href="https://developer.mozilla.org/en-US/docs/Web/HTML" title="HTML"/>
  <docs-pill href="https://developer.mozilla.org/en-US/docs/Web/CSS" title="CSS"/>
</docs-pill-row>

Ayrıca komut satırı arayüzü (CLI) araçlarının kullanımına aşina olmanız ve komut kabukları hakkında genel bir anlayışa sahip olmanız gerekir.
[TypeScript](https://www.typescriptlang.org) bilgisi faydalıdır, ancak zorunlu değildir.

## Bağımlılıklar

Angular CLI'ı yerel sisteminize kurmak için [Node.js](https://nodejs.org/) yüklemeniz gerekir.
Angular CLI, tarayıcı dışında JavaScript araçlarını yüklemek ve çalıştırmak için Node ve ilişkili paket yöneticisi npm'i kullanır.

`npm` CLI'ını da içerecek olan [Node.js'i indirin ve yükleyin](https://nodejs.org/en/download).
Angular, Node.js'in [aktif LTS veya bakım LTS](https://nodejs.org/en/about/previous-releases) sürümünü gerektirir.
Daha fazla bilgi için Angular'ın [sürüm uyumluluğu](reference/versions) kılavuzuna bakın.

## Angular CLI'ı yükleme

Angular CLI'ı yüklemek için bir terminal penceresi açın ve aşağıdaki komutu çalıştırın:

<docs-code-multifile>
   <docs-code
     header="npm"
     language="shell"
     >
     npm install -g @angular/cli
     </docs-code>
   <docs-code
     header="pnpm"
     language="shell"
     >
     pnpm install -g @angular/cli
     </docs-code>
   <docs-code
     header="yarn"
     language="shell"
     >
     yarn global add @angular/cli
     </docs-code>
   <docs-code
     header="bun"
     language="shell"
     >
     bun install -g @angular/cli
     </docs-code>

 </docs-code-multifile>

### Powershell çalıştırma ilkesi

Windows istemci bilgisayarlarında, PowerShell betiklerinin çalıştırılması varsayılan olarak devre dışıdır, bu nedenle yukarıdaki komut bir hatayla başarısız olabilir.
npm global ikili dosyaları için gerekli olan PowerShell betiklerinin çalıştırılmasına izin vermek için aşağıdaki <a href="https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies">çalıştırma ilkesini</a> ayarlamanız gerekir:

```sh

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

```

Komutu çalıştırdıktan sonra görüntülenen mesajı dikkatlice okuyun ve talimatları izleyin. Bir çalıştırma ilkesi ayarlamanın etkilerini anladığınızdan emin olun.

### Unix izinleri

Bazı Unix benzeri kurulumlarda, global betikler root kullanıcısına ait olabilir, bu nedenle yukarıdaki komut bir izin hatasıyla başarısız olabilir.
Komutu root kullanıcısı olarak çalıştırmak için `sudo` ile çalıştırın ve istendiğinde parolanızı girin:

<docs-code-multifile>
   <docs-code
     header="npm"
     language="shell"
     >
     sudo npm install -g @angular/cli
     </docs-code>
   <docs-code
     header="pnpm"
     language="shell"
     >
     sudo pnpm install -g @angular/cli
     </docs-code>
   <docs-code
     header="yarn"
     language="shell"
     >
     sudo yarn global add @angular/cli
     </docs-code>
   <docs-code
     header="bun"
     language="shell"
     >
     sudo bun install -g @angular/cli
     </docs-code>

 </docs-code-multifile>

Komutları root olarak çalıştırmanın etkilerini anladığınızdan emin olun.

## Çalışma alanı ve başlangıç uygulaması oluşturma

Uygulamaları bir Angular **çalışma alanı** bağlamında geliştirirsiniz.

Yeni bir çalışma alanı ve başlangıç uygulaması oluşturmak için `ng new` CLI komutunu çalıştırın ve burada gösterildiği gibi `my-app` adını verin, ardından dahil edilecek özellikler hakkındaki istemleri yanıtlayın:

```shell

ng new my-app

```

Angular CLI, gerekli Angular npm paketlerini ve diğer bağımlılıkları yükler.
Bu birkaç dakika sürebilir.

CLI, çalışma alanıyla aynı adda yeni bir dizinde yeni bir çalışma alanı ve çalıştırılmaya hazır küçük bir karşılama uygulaması oluşturur.
Sonraki komutların bu çalışma alanını kullanması için yeni dizine gidin.

```shell

cd my-app

```

## Uygulamayı çalıştırma

Angular CLI, uygulamanızı yerel olarak derleyip sunmanız için bir geliştirme sunucusu içerir. Aşağıdaki komutu çalıştırın:

```shell

ng serve --open

```

`ng serve` komutu sunucuyu başlatır, dosyalarınızı izler ve bu dosyalarda değişiklik yaptığınızda uygulamayı yeniden derler ve tarayıcıyı yeniden yükler.

`--open` (veya sadece `-o`) seçeneği, oluşturulan uygulamayı görüntülemek için tarayıcınızı otomatik olarak `http://localhost:4200/` adresinde açar.

## Çalışma alanları ve proje dosyaları

[`ng new`](cli/new) komutu bir [Angular çalışma alanı](reference/configs/workspace-config) klasörü oluşturur ve içinde yeni bir uygulama oluşturur.
Bir çalışma alanı birden fazla uygulama ve kütüphane içerebilir.
[`ng new`](cli/new) komutu tarafından oluşturulan ilk uygulama, çalışma alanının kök dizinindedir.
Mevcut bir çalışma alanında ek bir uygulama veya kütüphane oluşturduğunuzda, varsayılan olarak bir `projects/` alt klasörüne yerleştirilir.

Yeni oluşturulan bir uygulama, bir kök bileşen ve şablon için kaynak dosyalarını içerir.
Her uygulamanın bileşenlerini, verilerini ve varlıklarını içeren bir `src` klasörü vardır.

Oluşturulan dosyaları doğrudan düzenleyebilir veya CLI komutlarını kullanarak ekleyebilir ve değiştirebilirsiniz.
Ek bileşenler, direktifler, pipe'lar, servisler ve daha fazlası için yeni dosyalar eklemek üzere [`ng generate`](cli/generate) komutunu kullanın.
Uygulamalar ve kütüphaneler oluşturan veya bunlar üzerinde işlem yapan [`ng add`](cli/add) ve [`ng generate`](cli/generate) gibi komutlar, bir çalışma alanı içinden çalıştırılmalıdır. Buna karşın, `ng new` gibi komutlar yeni bir çalışma alanı oluşturacakları için bir çalışma alanının _dışından_ çalıştırılmalıdır.

## Sonraki adımlar

- Oluşturulan çalışma alanının [dosya yapısı](reference/configs/file-structure) ve [yapılandırması](reference/configs/workspace-config) hakkında daha fazla bilgi edinin.

- Yeni uygulamanızı [`ng test`](cli/test) ile test edin.

- Bileşenler, direktifler ve pipe'lar gibi şablonları [`ng generate`](cli/generate) ile oluşturun.

- Yeni uygulamanızı [`ng deploy`](cli/deploy) ile dağıtın ve gerçek kullanıcıların erişimine sunun.

- Uygulamanızın uçtan uca testlerini [`ng e2e`](cli/e2e) ile kurun ve çalıştırın.
