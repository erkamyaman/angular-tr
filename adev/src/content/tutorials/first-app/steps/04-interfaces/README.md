# Creating an interface

Bu eğitim dersi, bir arayüz oluşturmayı ve onu uygulamanızın bir bileşenine dahil etmeyi gösterir.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=YkFSeUeV8Ixtz8pm"/>

## What you'll learn

- Uygulamanızda veri türü olarak kullanabileceği yeni bir arayüz var.
- Uygulamanızda örnek verilerle yeni arayüzün bir örneği var.

## Conceptual preview of interfaces

[Arayüzler](https://www.typescriptlang.org/docs/handbook/interfaces.html) uygulamanız için özel veri türleridir.

Angular, güçlü tip denetimi olan bir programlama ortamında çalışmanın avantajlarından yararlanmak için TypeScript kullanır.
Güçlü tip denetimi, uygulamanızdaki bir öğenin başka bir öğeye yanlış biçimlendirilmiş veri göndermesi olasılığını azaltır.
Bu tür tip uyumsuzluğu hataları TypeScript derleyicisi tarafından yakalanır ve bu tür hataların çoğu IDE'nizde de yakalanabilir.

Bu derste, tek bir konut konumu hakkındaki verileri temsil eden özellikleri tanımlamak için bir arayüz oluşturacaksınız.

<docs-workflow>

<docs-step title="Create a new Angular interface">
Bu adım, uygulamanızda yeni bir arayüz oluşturur.

IDE'nizin **Terminal** bölmesinde:

1. Proje dizininizde, `first-app` dizinine gidin.
1. `first-app` dizininde, yeni arayüzü oluşturmak için bu komutu çalıştırın.

   ```shell

   ng generate interface housinglocation

   ```

1. Uygulamayı derlemek ve `http://localhost:4200` adresinde sunmak için `ng serve` komutunu çalıştırın.
1. Bir tarayıcıda, uygulamanızı görmek için `http://localhost:4200` adresini açın.
1. Uygulamanın hatasız derlendiğini doğrulayın.
   Bir sonraki adıma geçmeden önce tüm hataları düzeltin.
   </docs-step>

<docs-step title="Add properties to the new interface">
Bu adım, uygulamanızın bir konut konumunu temsil etmesi için gereken özellikleri arayüze ekler.

1.  IDE'nizin **Terminal** bölmesinde, uygulamayı derlemek ve `http://localhost:4200` adresinde sunmak için `ng serve` komutunu başlatın (zaten çalışmıyorsa).
1.  IDE'nizin **Edit** bölmesinde, `src/app/housinglocation.ts` dosyasını açın.
1.  `housinglocation.ts` dosyasında, yeni arayüzünüzün bu örnekle eşleşmesi için varsayılan içeriği aşağıdaki kodla değiştirin.

      <docs-code header="Update src/app/housinglocation.ts to match this code" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/housinglocation.ts" visibleLines="[1,10]" />

1.  Değişikliklerinizi kaydedin ve uygulamanın herhangi bir hata görüntülemediğini doğrulayın. Bir sonraki adıma geçmeden önce tüm hataları düzeltin.

Bu noktada, bir `id`, `name` ve konum bilgileri dahil olmak üzere bir konut konumu hakkındaki verileri temsil eden bir arayüz tanımladınız.
</docs-step>

<docs-step title="Create a test house for your app">
Bir arayüzünüz var, ancak henüz kullanmıyorsunuz.

Bu adımda, arayüzün bir örneğini oluşturacak ve ona bazı örnek veriler atayacaksınız.
Bu örnek verilerin uygulamanızda henüz görünmeyeceğini göreceksiniz.
Bunun gerçekleşmesi için tamamlanması gereken birkaç ders daha var.

1.  IDE'nizin **Terminal** bölmesinde, uygulamayı derlemek ve `http://localhost:4200` adresinde sunmak için `ng serve` komutunu çalıştırın (zaten çalışmıyorsa).
1.  IDE'nizin **Edit** bölmesinde, `src/app/home/home.ts` dosyasını açın.
1.  `src/app/home/home.ts` dosyasında, `Home`'un yeni arayüzü kullanabilmesi için mevcut `import` ifadelerinden sonra bu import ifadesini ekleyin.

      <docs-code language="angular-ts" header="Import Home in src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[3]"/>

1.  `src/app/home/home.ts` dosyasında, bileşende yeni arayüzün tek bir örneğini oluşturmak için boş `export class Home {}` tanımını bu kodla değiştirin.

      <docs-code language="angular-ts" header="Add sample data to src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[22,35]"/>

1.  `home.ts` dosyanızın bu örnekle eşleştiğini doğrulayın.

      <docs-code language="angular-ts" header="src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[[1,7],[9,36]]" />

    `Home` sınıfına `HousingLocation` türünde `housingLocation` özelliğini ekleyerek, verinin arayüzün tanımına uyduğunu doğrulayabilirsiniz. Eğer veri arayüzün tanımını karşılamazsa, IDE size faydalı hatalar verecek kadar bilgiye sahiptir.

1.  Değişikliklerinizi kaydedin ve uygulamanın herhangi bir hatası olmadığını doğrulayın. Tarayıcıyı açın ve uygulamanızın hala "housing-location works!" mesajını görüntülediğini doğrulayın.

      <img alt="browser frame of homes-app displaying logo, filter text input box and search button and the message 'housing-location works!'" src="assets/images/tutorials/first-app/homes-app-lesson-03-step-2.png">

1.  Bir sonraki adıma geçmeden önce tüm hataları düzeltin.
    </docs-step>

</docs-workflow>

SUMMARY: Bu derste, uygulamanız için yeni bir veri türü oluşturan bir arayüz oluşturdunuz.
Bu yeni veri türü, `HousingLocation` verisinin gerekli olduğu yerleri belirtmenizi mümkün kılar.
Bu yeni veri türü ayrıca IDE'nizin ve TypeScript derleyicisinin, `HousingLocation` verisinin gerekli olduğu yerlerde kullanılmasını sağlamasını mümkün kılar.

Bu derste ele alınan konular hakkında daha fazla bilgi için:

<docs-pill-row>
  <docs-pill href="cli/generate/interface" title="ng generate interface"/>
  <docs-pill href="cli/generate" title="ng generate"/>
</docs-pill-row>
