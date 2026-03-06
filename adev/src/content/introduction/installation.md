<docs-decorative-header title="Kurulum" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

Çevrimiçi başlatıcılarla veya terminalinizi kullanarak yerel olarak Angular'a hızlıca başlayın.

## Çevrimiçi Deneyin

Angular'ı bir proje oluşturmadan tarayıcınızda denemek istiyorsanız, çevrimiçi deneme alanımızı kullanabilirsiniz:

<docs-card-container>
  <docs-card title="" href="/playground" link="Oyun Alanında Aç">
  Bir Angular uygulamasıyla oynamanın en hızlı yolu. Kurulum gerekmez.
  </docs-card>
</docs-card-container>

## Yerel Olarak Yeni Bir Proje Oluşturun

Yeni bir projeye başlıyorsanız, Git gibi araçları kullanabilmek için büyük olasılıkla yerel bir proje oluşturmak isteyeceksiniz.

### Ön Koşullar

- **Node.js** - [v20.19.0 veya daha yeni](/reference/versions)
- **Metin editörü** - [Visual Studio Code](https://code.visualstudio.com/) öneriyoruz
- **Terminal** - Angular CLI komutlarını çalıştırmak için gereklidir
- **Geliştirme Aracı** - Geliştirme iş akışınızı iyileştirmek için [Angular Language Service](/tools/language-service) öneriyoruz

### Talimatlar

Aşağıdaki kılavuz, yerel bir Angular projesi oluşturma adımlarında size yol gösterecektir.

#### Angular CLI'ı Yükleyin

Bir terminal açın ([Visual Studio Code](https://code.visualstudio.com/) kullanıyorsanız, [entegre terminal](https://code.visualstudio.com/docs/editor/integrated-terminal) açabilirsiniz) ve aşağıdaki komutu çalıştırın:

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

Bu komutu Windows veya Unix'te çalıştırırken sorun yaşıyorsanız, daha fazla bilgi için [CLI dokümantasyonuna](/tools/cli/setup-local#angular-cliı-yükleme) göz atın.

#### Yeni Bir Proje Oluşturun

Terminalinizde, istediğiniz proje adıyla `ng new` CLI komutunu çalıştırın. Aşağıdaki örneklerde, `my-first-angular-app` örnek proje adını kullanacağız.

```shell
ng new <project-name>
```

Projeniz için bazı yapılandırma seçenekleri sunulacaktır. Seçenekler arasında gezinmek ve istediğinizi seçmek için ok ve enter tuşlarını kullanın.

Herhangi bir tercihiniz yoksa, varsayılan seçenekleri kabul etmek ve kuruluma devam etmek için enter tuşuna basmanız yeterlidir.

Yapılandırma seçeneklerini belirledikten ve CLI kurulumu tamamladıktan sonra aşağıdaki mesajı görmelisiniz:

```text
✔ Packages installed successfully.
    Successfully initialized git.
```

Bu noktada, projenizi yerel olarak çalıştırmaya hazırsınız!

#### Yeni Projenizi Yerel Olarak Çalıştırma

Terminalinizde, yeni Angular projenize geçin.

```shell
cd my-first-angular-app
```

Bu noktada tüm bağımlılıklarınız yüklenmiş olmalıdır (bunu projenizde bir `node_modules` klasörünün varlığını kontrol ederek doğrulayabilirsiniz), böylece projenizi aşağıdaki komutu çalıştırarak başlatabilirsiniz:

```shell
npm start
```

Her şey başarılıysa, terminalinizde benzer bir onay mesajı görmelisiniz:

```text
Watch mode enabled. Watching for file changes...
NOTE: Raw file sizes do not reflect development server per-request transformations.
  ➜  Local:   http://localhost:4200/
  ➜  press h + enter to show help
```

Artık `Local` kısmındaki adresi (örneğin, `http://localhost:4200`) ziyaret ederek uygulamanızı görebilirsiniz. Keyifli kodlamalar!

### Geliştirme İçin Yapay Zeka Kullanımı

Tercih ettiğiniz yapay zeka destekli IDE'de geliştirmeye başlamak için [Angular prompt kuralları ve en iyi uygulamalarına göz atın](/ai/develop-with-ai).

## Sonraki Adımlar

Angular projenizi oluşturduğunuza göre, [Temel Bilgiler kılavuzumuzda](/essentials) Angular hakkında daha fazla bilgi edinebilir veya detaylı kılavuzlarımızdan bir konu seçebilirsiniz!
