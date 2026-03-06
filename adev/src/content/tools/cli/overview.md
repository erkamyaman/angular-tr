# Angular CLI

Angular CLI, Angular uygulamalarını doğrudan bir komut kabuğundan iskele oluşturmanıza, geliştirmenize, test etmenize, dağıtmanıza ve bakımını yapmanıza olanak tanıyan bir komut satırı arayüzü aracıdır.

Angular CLI, `@angular/cli` paketi olarak npm'de yayınlanmıştır ve `ng` adlı bir ikili dosya içerir. `ng`'yi çağıran komutlar Angular CLI'ı kullanır.

<docs-callout title="Yerel kurulum olmadan Angular'ı deneyin">

Angular'da yeniyseniz, hazır bir temel çevrimiçi mağaza uygulaması bağlamında Angular'ın temellerini tanıtan [Şimdi deneyin!](tutorials/learn-angular) ile başlamak isteyebilirsiniz.
Bu bağımsız eğitim, çevrimiçi geliştirme için etkileşimli [StackBlitz](https://stackblitz.com) ortamından yararlanır.
Hazır olana kadar yerel ortamınızı kurmanıza gerek yoktur.

</docs-callout>

<docs-card-container>
  <docs-card title="Başlarken" link="Başlayın" href="tools/cli/setup-local">
    İlk uygulamanızı oluşturmak ve derlemek için Angular CLI'ı yükleyin.
  </docs-card>
  <docs-card title="Komut Referansı" link="Daha Fazla Bilgi" href="cli">
    Angular ile daha üretken olmanızı sağlayan CLI komutlarını keşfedin.
  </docs-card>
  <docs-card title="Şematikler" link="Daha Fazla Bilgi" href="tools/cli/schematics">
    Uygulamanızdaki kaynak dosyalarını otomatik olarak oluşturmak ve değiştirmek için şematikler oluşturun ve çalıştırın.
  </docs-card>
  <docs-card title="Builder'lar" link="Daha Fazla Bilgi" href="tools/cli/cli-builder">
    Kaynak kodunuzdan oluşturulan derleme çıktılarına karmaşık dönüşümler gerçekleştirmek için builder'lar oluşturun ve çalıştırın.
  </docs-card>
</docs-card-container>

## CLI Komut Dili Sözdizimi

Angular CLI, seçenek sözdizimi için kabaca Unix/POSIX kurallarını takip eder.

### Boolean Seçenekleri

Boolean seçeneklerinin iki biçimi vardır: `--this-option` bayrağı `true` olarak ayarlar, `--no-this-option` ise `false` olarak ayarlar.
Ayrıca `--this-option=false` veya `--this-option=true` kullanabilirsiniz.
Hiçbir seçenek sağlanmazsa, bayrak referans belgelerinde listelenen varsayılan durumunda kalır.

### Dizi Seçenekleri

Dizi seçenekleri iki biçimde sağlanabilir: `--option value1 value2` veya `--option value1 --option value2`.

### Anahtar/Değer Seçenekleri

`--define` gibi bazı seçenekler, değerleri olarak bir `key=value` çiftleri dizisi bekler.
Dizi seçenekleri gibi, anahtar/değer seçenekleri de iki biçimde sağlanabilir:
`--define 'KEY_1="value1"' KEY_2=true` veya `--define 'KEY_1="value1"' --define KEY_2=true`.

### Göreli Yollar

Dosya belirten seçenekler, mutlak yollar olarak veya geçerli çalışma dizinine göre göreli yollar olarak verilebilir; bu genellikle çalışma alanı veya proje köküdür.
