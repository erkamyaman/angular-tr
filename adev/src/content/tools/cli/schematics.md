# Schematics kullanarak kod oluşturma

Şematik, karmaşık mantığı destekleyen şablon tabanlı bir kod oluşturucusudur.
Kod oluşturarak veya değiştirerek bir yazılım projesini dönüştürmek için bir talimatlar kümesidir.
Şematikler koleksiyonlara paketlenir ve npm ile kurulur.

Şematik koleksiyonu, herhangi bir yazılım projesini oluşturmak, değiştirmek ve sürdürmek için güçlü bir araç olabilir, ancak özellikle Angular projelerini kendi organizasyonunuzun belirli ihtiyaçlarına göre özelleştirmek için kullanışlıdır.
Örneğin, önceden tanımlanmış şablonlar veya düzenler kullanarak yaygın kullanılan UI kalıplarını veya belirli bileşenleri oluşturmak için şematikler kullanabilirsiniz.
Mimari kuralları ve konvansiyonları uygulamak, projelerinizi tutarlı ve birlikte çalışabilir hale getirmek için şematikleri kullanın.

## Angular CLI için Schematics

Şematikler Angular ekosisteminin bir parçasıdır.
Angular CLI, bir web uygulaması projesine dönüşümler uygulamak için şematikleri kullanır.
Bu şematikleri değiştirebilir ve örneğin bir bağımlılıktaki bozucu değişiklikleri düzeltmek için kodunuzu güncellemek veya mevcut bir projeye yeni bir yapılandırma seçeneği veya çerçeve eklemek gibi şeyler yapmak üzere yenilerini tanımlayabilirsiniz.

`@schematics/angular` koleksiyonunda bulunan şematikler, `ng generate` ve `ng add` komutları tarafından varsayılan olarak çalıştırılır.
Paket, `ng generate component` ve `ng generate service` gibi `ng generate` alt komutları için CLI'a sunulan seçenekleri yapılandıran adlandırılmış şematikler içerir.
`ng generate` alt komutları, karşılık gelen şematiğin kısa yoludur.
Belirli bir şematiği veya şematik koleksiyonunu belirtmek ve oluşturmak için uzun biçimi kullanın:

```shell

ng generate my-schematic-collection:my-schematic-name

```

veya

```shell

ng generate my-schematic-name --collection collection-name

```

### CLI Schematics Yapılandırması

Bir şematikle ilişkili bir JSON şeması, Angular CLI'a komutlar ve alt komutlar için hangi seçeneklerin mevcut olduğunu söyler ve varsayılanları belirler.
Bu varsayılanlar, komut satırında bir seçenek için farklı bir değer sağlayarak geçersiz kılınabilir.
Çalışma alanınız için oluşturma seçeneği varsayılanlarını nasıl değiştireceğiniz hakkında bilgi için [Çalışma Alanı Yapılandırması](reference/configs/workspace-config) belgesine bakın.

CLI tarafından proje ve proje parçaları oluşturmak için kullanılan varsayılan şematiklerin JSON şemaları [`@schematics/angular`](https://github.com/angular/angular-cli/tree/main/packages/schematics/angular) paketinde toplanmıştır.
Şema, `--help` çıktısında gösterildiği gibi her `ng generate` alt komutu için CLI'a sunulan seçenekleri açıklar.

## Kütüphaneler için Schematics Geliştirme

Bir kütüphane geliştiricisi olarak, kütüphanenizi Angular CLI ile entegre etmek üzere kendi özel şematik koleksiyonlarınızı oluşturabilirsiniz.

- Bir _add şematiği_, geliştiricilerin kütüphanenizi `ng add` kullanarak bir Angular çalışma alanına yüklemesine olanak tanır
- _Oluşturma şematikleri_, `ng generate` alt komutlarına projeleri nasıl değiştireceğini, yapılandırmalar ve betikler nasıl ekleyeceğini ve kütüphanenizde tanımlanan yapıtları nasıl oluşturacağını söyleyebilir
- Bir _güncelleme şematiği_, `ng update` komutuna kütüphanenizin bağımlılıklarını nasıl güncelleyeceğini ve yeni bir sürüm yayınladığınızda bozucu değişikliklere nasıl uyum sağlayacağını söyleyebilir

Bunların nasıl göründüğü ve nasıl oluşturulacağı hakkında daha fazla ayrıntı için bakın:

<docs-pill-row>
  <docs-pill href="tools/cli/schematics-authoring" title="Authoring Schematics"/>
  <docs-pill href="tools/cli/schematics-for-libraries" title="Schematics for Libraries"/>
</docs-pill-row>

### Add Schematics

Bir _add şematiği_ genellikle bir kütüphaneyle birlikte sağlanır, böylece kütüphane `ng add` ile mevcut bir projeye eklenebilir.
`add` komutu, yeni bağımlılıkları indirmek için paket yöneticinizi kullanır ve bir şematik olarak uygulanan bir kurulum betiğini çağırır.

Örneğin, [`@angular/material`](https://material.angular.dev/guide/schematics) şematiği, `add` komutuna Angular Material ve temasını yüklemesini, kurmasını ve `ng generate` ile oluşturulabilecek yeni başlangıç bileşenlerini kaydetmesini söyler.
Kendi add şematiğiniz için bir örnek ve model olarak buna bakın.

Partner ve üçüncü taraf kütüphaneler de add şematikleri ile Angular CLI'ı destekler.
Örneğin, `@ng-bootstrap/schematics` bir uygulamaya [ng-bootstrap](https://ng-bootstrap.github.io) ekler ve `@clr/angular` ise [VMWare'den Clarity](https://clarity.design/documentation/get-started)'yi kurar ve yapılandırır.

Bir _add şematiği_ ayrıca bir projeyi yapılandırma değişiklikleriyle güncelleyebilir, ek bağımlılıklar \(polyfill'ler gibi\) ekleyebilir veya pakete özgü başlatma kodunu oluşturabilir.
Örneğin, `@angular/pwa` şematiği bir uygulama manifest'i ve servis worker ekleyerek uygulamanızı bir PWA'ya dönüştürür.

### Oluşturma Schematics'leri

Oluşturma şematikleri, `ng generate` komutu için talimatlardır.
Belgelenen alt komutlar varsayılan Angular oluşturma şematiklerini kullanır, ancak kütüphanenizde tanımlanan bir yapıtı oluşturmak için farklı bir şematik \(bir alt komut yerine\) belirtebilirsiniz.

Örneğin Angular Material, tanımladığı UI bileşenleri için oluşturma şematikleri sağlar.
Aşağıdaki komut, sıralama ve sayfalama için bir veri kaynağıyla önceden yapılandırılmış bir Angular Material `<mat-table>` oluşturmak için bu şematiklerden birini kullanır.

```shell

ng generate @angular/material:table <component-name>

```

### Güncelleme Schematics'leri

`ng update` komutu, çalışma alanınızın kütüphane bağımlılıklarını güncellemek için kullanılabilir.
Hiçbir seçenek sağlamazsanız veya yardım seçeneğini kullanırsanız, komut çalışma alanınızı inceler ve güncellenecek kütüphaneleri önerir.

```shell

ng update
We analyzed your package.json, there are some packages to update:

    Name                                      Version                     Command to update
    --------------------------------------------------------------------------------
    @angular/cdk                       7.2.2 -> 7.3.1           ng update @angular/cdk
    @angular/cli                       7.2.3 -> 7.3.0           ng update @angular/cli
    @angular/core                      7.2.2 -> 7.2.3           ng update @angular/core
    @angular/material                  7.2.2 -> 7.3.1           ng update @angular/material
    rxjs                                      6.3.3 -> 6.4.0           ng update rxjs

```

Komuta güncellenecek bir kütüphane kümesi verirseniz, bu kütüphaneleri, eş bağımlılıklarını ve bunlara bağımlı olan eş bağımlılıkları günceller.

HELPFUL: Tutarsızlıklar varsa \(örneğin, eş bağımlılıklar basit bir [semver](https://semver.io) aralığıyla eşleştirilemezse\), komut bir hata oluşturur ve çalışma alanında hiçbir şeyi değiştirmez.

Varsayılan olarak tüm bağımlılıkların güncellenmesini zorlamamamanızı öneririz.
Önce belirli bağımlılıkları güncellemeyi deneyin.

`ng update` komutunun nasıl çalıştığı hakkında daha fazla bilgi için [Update Command](https://github.com/angular/angular-cli/blob/main/docs/specifications/update.md) belgesine bakın.

Kütüphanenizin potansiyel bozucu değişiklikler içeren yeni bir sürümünü oluşturursanız, güncellenen projede bu tür değişikliklerin otomatik olarak çözülmesini sağlamak için `ng update` komutunu etkinleştiren bir _güncelleme şematiği_ sağlayabilirsiniz.

Örneğin, Angular Material kütüphanesini güncellemek istediğinizi varsayalım.

```shell
ng update @angular/material
```

Bu komut, çalışma alanınızın `package.json` dosyasındaki hem `@angular/material` hem de bağımlılığı olan `@angular/cdk`'yı günceller.
Her iki paket de mevcut sürümden yeni sürüme geçiş için bir güncelleme şematiği içeriyorsa, komut o şematiği çalışma alanınızda çalıştırır.
