# The Angular CLI

Angular CLI, Angular uygulamalarını doğrudan bir komut kabuğundan iskele oluşturmanıza, geliştirmenize, test etmenize, dağıtmanıza ve bakımını yapmanıza olanak tanıyan bir komut satırı arayüzü aracıdır.

Angular CLI, `@angular/cli` paketi olarak npm'de yayınlanmıştır ve `ng` adlı bir ikili dosya içerir. `ng`'yi çağıran komutlar Angular CLI'ı kullanır.

<docs-callout title="Try Angular without local setup">

Angular'da yeniyseniz, hazır bir temel çevrimiçi mağaza uygulaması bağlamında Angular'ın temellerini tanıtan [Şimdi deneyin!](tutorials/learn-angular) ile başlamak isteyebilirsiniz.
Bu bağımsız eğitim, çevrimiçi geliştirme için etkileşimli [StackBlitz](https://stackblitz.com) ortamından yararlanır.
Hazır olana kadar yerel ortamınızı kurmanıza gerek yoktur.

</docs-callout>

<docs-card-container>
  <docs-card title="Getting Started" link="Get Started" href="tools/cli/setup-local">
    İlk uygulamanızı oluşturmak ve derlemek için Angular CLI'ı yükleyin.
  </docs-card>
  <docs-card title="Command Reference" link="Learn More" href="cli">
    Angular ile daha üretken olmanızı sağlayan CLI komutlarını keşfedin.
  </docs-card>
  <docs-card title="Schematics" link="Learn More" href="tools/cli/schematics">
    Uygulamanızdaki kaynak dosyalarını otomatik olarak oluşturmak ve değiştirmek için şematikler oluşturun ve çalıştırın.
  </docs-card>
  <docs-card title="Builders" link="Learn More" href="tools/cli/cli-builder">
    Kaynak kodunuzdan oluşturulan derleme çıktılarına karmaşık dönüşümler gerçekleştirmek için builder'lar oluşturun ve çalıştırın.
  </docs-card>
</docs-card-container>

## CLI command-language syntax

Angular CLI, seçenek sözdizimi için kabaca Unix/POSIX kurallarını takip eder.

### Boolean options

Boolean seçeneklerinin iki biçimi vardır: `--this-option` bayrağı `true` olarak ayarlar, `--no-this-option` ise `false` olarak ayarlar.
Ayrıca `--this-option=false` veya `--this-option=true` kullanabilirsiniz.
Hiçbir seçenek sağlanmazsa, bayrak referans belgelerinde listelenen varsayılan durumunda kalır.

### Array options

Dizi seçenekleri iki biçimde sağlanabilir: `--option value1 value2` veya `--option value1 --option value2`.

### Key/value options

`--define` gibi bazı seçenekler, değerleri olarak bir `key=value` çiftleri dizisi bekler.
Dizi seçenekleri gibi, anahtar/değer seçenekleri de iki biçimde sağlanabilir:
`--define 'KEY_1="value1"' KEY_2=true` veya `--define 'KEY_1="value1"' --define KEY_2=true`.

### Relative paths

Dosya belirten seçenekler, mutlak yollar olarak veya geçerli çalışma dizinine göre göreli yollar olarak verilebilir; bu genellikle çalışma alanı veya proje köküdür.
