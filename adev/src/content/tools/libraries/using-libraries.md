# npm'e yayınlanmış Angular kütüphanelerinin kullanımı

Angular uygulamanızı oluştururken, gelişmiş birinci taraf kütüphanelerinin yanı sıra zengin bir üçüncü taraf kütüphane ekosisteminden yararlanın.
[Angular Material][AngularMaterialMain], gelişmiş bir birinci taraf kütüphanesi örneğidir.

## Kütüphaneleri yükleme

Kütüphaneler, genellikle Angular CLI ile entegre eden şematiklerle birlikte [npm paketleri][GuideNpmPackages] olarak yayınlanır.
Yeniden kullanılabilir kütüphane kodunu bir uygulamaya entegre etmek için paketi yüklemeniz ve sağlanan işlevselliği kullandığınız konumda içe aktarmanız gerekir.
Yayınlanmış çoğu Angular kütüphanesi için `ng add <lib_name>` Angular CLI komutunu kullanın.

`ng add` Angular CLI komutu, kütüphane paketini yüklemek için bir paket yöneticisi kullanır ve proje kodunda diğer iskele işlemlerini gerçekleştiren pakette bulunan şematikleri çağırır.
Paket yöneticisi örnekleri arasında [npm][NpmjsMain] veya [yarn][YarnpkgMain] bulunur.
Proje kodundaki ek iskele işlemleri, içe aktarma ifadelerini, yazı tiplerini ve temaları içerir.

Yayınlanmış bir kütüphane genellikle o kütüphanenin uygulamanıza nasıl ekleneceğine dair bir `README` dosyası veya başka belgeler sağlar.
Bir örnek için [Angular Material][AngularMaterialMain] belgelerine bakın.

### Kütüphane tip tanımlamaları

Genellikle kütüphane paketleri, `.d.ts` dosyalarında tip tanımlamaları içerir; `node_modules/@angular/material` içindeki örneklere bakın.
Kütüphanenizin paketi tip tanımlamaları içermiyorsa ve IDE'niz hata veriyorsa, kütüphaneyle birlikte `@types/<lib_name>` paketini yüklemeniz gerekebilir.

Örneğin, `d3` adında bir kütüphaneniz olduğunu varsayalım:

```shell

npm install d3 --save
npm install @types/d3 --save-dev

```

Çalışma alanına yüklenen bir kütüphane için `@types/` paketinde tanımlanan tipler, o kütüphaneyi kullanan projenin TypeScript yapılandırmasına otomatik olarak eklenir.
TypeScript varsayılan olarak `node_modules/@types` dizininde tipleri arar, bu nedenle her tip paketini ayrı ayrı eklemeniz gerekmez.

Bir kütüphanenin `@types/`'da tip tanımlamaları yoksa, bunun için tip tanımlamalarını manuel olarak ekleyerek kullanabilirsiniz.
Bunu yapmak için:

1. `src/` dizininizde bir `typings.d.ts` dosyası oluşturun.
   Bu dosya otomatik olarak global tip tanımlaması olarak dahil edilir.

1. `src/typings.d.ts`'e aşağıdaki kodu ekleyin:

   ```ts
   declare module 'host' {
     export interface Host {
       protocol?: string;
       hostname?: string;
       pathname?: string;
     }
     export function parse(url: string, queryString?: string): Host;
   }
   ```

1. Kütüphaneyi kullanan bileşen veya dosyada aşağıdaki kodu ekleyin:

   ```ts
   import * as host from 'host';
   const parsedUrl = host.parse('https://angular.dev');
   console.log(parsedUrl.hostname);
   ```

Gerektiğinde daha fazla tip tanımlaması ekleyin.

## Kütüphaneleri güncelleme

Bir kütüphane yayıncısı tarafından güncellenebilir ve ayrıca güncel tutulması gereken kendi bağımlılıkları vardır.
Yüklü kütüphanelerinize yönelik güncellemeleri kontrol etmek için [`ng update`][CliUpdate] Angular CLI komutunu kullanın.

Bireysel kütüphane sürümlerini güncellemek için `ng update <lib_name>` Angular CLI komutunu kullanın.
Angular CLI kütüphanenin en son yayınlanan sürümünü kontrol eder ve en son sürüm yüklü sürümünüzden daha yeniyse indirir ve `package.json`'unuzu en son sürümle eşleşecek şekilde günceller.

Angular'ı yeni bir sürüme güncellediğinizde, kullandığınız tüm kütüphanelerin güncel olduğundan emin olmanız gerekir.
Kütüphanelerin karşılıklı bağımlılıkları varsa, bunları belirli bir sırayla güncellemeniz gerekebilir.
Yardım için [Angular Update Guide][AngularUpdateMain]'a bakın.

## Çalışma zamanı global kapsamına kütüphane ekleme

Eski bir JavaScript kütüphanesi bir uygulamaya aktarılmıyorsa, çalışma zamanı global kapsamına ekleyebilir ve bir script etiketi ile eklenmiş gibi yükleyebilirsiniz.
Angular CLI'yi, [`angular.json`][GuideWorkspaceConfig] çalışma alanı derleme yapılandırma dosyasındaki derleme hedefinin `scripts` ve `styles` seçeneklerini kullanarak derleme zamanında bunu yapacak şekilde yapılandırın.

Örneğin, [Bootstrap 4][GetbootstrapDocs40GettingStartedIntroduction] kütüphanesini kullanmak için

1. npm paket yöneticisini kullanarak kütüphaneyi ve ilişkili bağımlılıkları yükleyin:

   ```shell
     npm install jquery --save
     npm install popper.js --save
     npm install bootstrap --save
   ```

1. `angular.json` yapılandırma dosyasında, ilişkili script dosyalarını `scripts` dizisine ekleyin:

   ```json
     "scripts": [
         "node_modules/jquery/dist/jquery.slim.js",
         "node_modules/popper.js/dist/umd/popper.js",
         "node_modules/bootstrap/dist/js/bootstrap.js"
       ],
   ```

1. `bootstrap.css` CSS dosyasını `styles` dizisine ekleyin:

   ```json
     "styles": [
         "node_modules/bootstrap/dist/css/bootstrap.css",
         "src/styles.css"
     ],
   ```

1. Bootstrap 4'ün uygulamanızda çalıştığını görmek için `ng serve` Angular CLI komutunu çalıştırın veya yeniden başlatın.

### Uygulamanızda çalışma zamanı global kütüphanelerini kullanma

"scripts" dizisini kullanarak bir kütüphaneyi içe aktardıktan sonra, TypeScript kodunuzda bir import ifadesi kullanarak **içe aktarmayın**.
Aşağıdaki kod parçacığı örnek bir import ifadesidir.

```ts
import * as $ from 'jquery';
```

Import ifadeleri kullanarak içe aktarırsanız, kütüphanenin iki farklı kopyasına sahip olursunuz: biri global kütüphane olarak içe aktarılan, diğeri modül olarak içe aktarılan.
Bu, özellikle JQuery gibi eklentileri olan kütüphaneler için kötüdür çünkü her kopya farklı eklentiler içerir.

Bunun yerine, kütüphaneniz için tip tanımlamalarını indirmek üzere `npm install @types/jquery` Angular CLI komutunu çalıştırın ve ardından kütüphane kurulum adımlarını izleyin.
Bu, o kütüphane tarafından sunulan global değişkenlere erişmenizi sağlar.

### Çalışma zamanı global kütüphaneleri için tip tanımlamaları belirleme

Kullanmanız gereken global kütüphanenin global tip tanımlamaları yoksa, bunları `src/typings.d.ts`'de manuel olarak `any` olarak bildirebilirsiniz.

Örneğin:

```ts
declare var libraryName: any;
```

Bazı scriptler diğer kütüphaneleri genişletir; örneğin JQuery eklentileriyle:

```ts
$('.test').myPlugin();
```

Bu durumda, yüklü `@types/jquery` paketi `myPlugin`'i içermez, bu nedenle `src/typings.d.ts`'e bir arayüz eklemeniz gerekir.
Örneğin:

```ts
interface JQuery {
  myPlugin(options?: any): any;
}
```

Script ile tanımlanan uzantı için arayüz eklemezseniz, IDE'niz bir hata gösterir:

```text

[TS][Error] Property 'myPlugin' does not exist on type 'JQuery'

```

[CliUpdate]: cli/update 'ng update | CLI |Angular'
[GuideNpmPackages]: reference/configs/npm-packages 'Workspace npm dependencies | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
[Resources]: resources 'Explore Angular Resources | Angular'
[AngularMaterialMain]: https://material.angular.dev 'Angular Material | Angular'
[AngularUpdateMain]: /update-guide 'Angular Update Guide | Angular'
[GetbootstrapDocs40GettingStartedIntroduction]: https://getbootstrap.com/docs/4.0/getting-started/introduction 'Introduction | Bootstrap'
[NpmjsMain]: https://www.npmjs.com 'npm'
[YarnpkgMain]: https://yarnpkg.com ' Yarn'
