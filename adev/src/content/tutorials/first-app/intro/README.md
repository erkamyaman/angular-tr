# Build your first Angular app

Bu eğitim, Angular'da kod yazmaya başlamak için bilmeniz gereken Angular kavramlarını tanıtan derslerden oluşmaktadır.

İstediğiniz kadar çok veya az ders yapabilir ve bunları istediğiniz sırada tamamlayabilirsiniz.

HELPFUL: Video mu tercih ediyorsunuz? Bu eğitim için eksiksiz bir [YouTube kursu](https://youtube.com/playlist?list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF&si=1q9889ulHp8VZ0e7) da mevcuttur!

<docs-video src="https://www.youtube.com/embed/xAT0lHYhHMY?si=cKUW_MGn3MesFT7o"/>

## Before you start

Bu eğitimde en iyi deneyimi yaşamak için, başarılı olmak için ihtiyacınız olanları kontrol etmek üzere bu gereksinimleri gözden geçirin.

### Your experience

Bu eğitimdeki dersler, aşağıdaki konularda deneyiminiz olduğunu varsaymaktadır:

1. HTML'yi doğrudan düzenleyerek bir HTML web sayfası oluşturmuş olmak.
1. JavaScript ile web sitesi içeriği programlamış olmak.
1. Basamaklı Stil Sayfası (CSS) içeriğini okumak ve seçicilerin nasıl kullanıldığını anlamak.
1. Bilgisayarınızda görevleri gerçekleştirmek için komut satırı talimatlarını kullanmış olmak.

### Your equipment

Bu dersler, Angular araçlarının yerel kurulumu veya gömülü editörümüz kullanılarak tamamlanabilir. Yerel Angular geliştirmesi Windows, MacOS veya Linux tabanlı sistemlerde yapılabilir.

NOTE: Bu gibi uyarılara dikkat edin, bunlar yalnızca yerel editörünüz için geçerli olabilecek adımları belirtir.

## Conceptual preview of your first Angular app

Bu eğitimdeki dersler, kiralık evleri listeleyen ve bireysel evlerin ayrıntılarını gösteren bir Angular uygulaması oluşturur.
Bu uygulama, birçok Angular uygulamasında yaygın olan özellikleri kullanır.

<img alt="Output of homes landing page" src="assets/images/tutorials/first-app/homes-app-landing-page.png">

## Local development environment

NOTE: Bu adım yalnızca yerel ortamınız içindir!

Bu eğitim için kullanmak istediğiniz bilgisayardaki komut satırı aracında bu adımları gerçekleştirin.

<docs-workflow>

<docs-step title="Identify the version of `node.js` that Angular requires">
Angular, aktif LTS veya bakım LTS sürümünde bir Node gerektirir. `node.js` sürümünüzü doğrulayalım. Belirli sürüm gereksinimleri hakkında bilgi için [package.json dosyasındaki](https://unpkg.com/browse/@angular/core@15.1.5/package.json) engines özelliğine bakın.

Bir **Terminal** penceresinden:

1. Şu komutu çalıştırın: `node --version`
1. Görüntülenen sürüm numarasının gereksinimleri karşıladığını doğrulayın.
   </docs-step>

<docs-step title="Install the correct version of `node.js` for Angular">
Eğer `node.js` sürümü yüklü değilse, lütfen [nodejs.org üzerindeki kurulum talimatlarını](https://nodejs.org/en/download/) takip edin.
</docs-step>

<docs-step title="Install the latest version of Angular">
`node.js` ve `npm` yüklendikten sonra, sıradaki adım etkili Angular geliştirmesi için araçlar sağlayan [Angular CLI](tools/cli)'yi yüklemektir.

Bir **Terminal** penceresinden şu komutu çalıştırın: `npm install -g @angular/cli`.
</docs-step>

<docs-step title="Install integrated development environment (IDE)">
Angular ile uygulama geliştirmek için tercih ettiğiniz herhangi bir aracı kullanabilirsiniz. Aşağıdakileri öneriyoruz:

1. [Visual Studio Code](https://code.visualstudio.com/)
2. İsteğe bağlı ancak önerilen bir adım olarak, [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template) yükleyerek geliştirici deneyiminizi daha da iyileştirebilirsiniz.
3. [WebStorm](https://www.jetbrains.com/webstorm/)
   </docs-step>

<docs-step title="Optional: set-up your AI powered IDE">

Bu eğitimi tercih ettiğiniz yapay zeka destekli IDE'de takip ediyorsanız, [Angular prompt kurallarına ve en iyi uygulamalarına göz atın](/ai/develop-with-ai).

</docs-step>

</docs-workflow>

Bu derste ele alınan konular hakkında daha fazla bilgi için:

<docs-pill-row>
  <docs-pill href="/overview" title="What is Angular"/>
  <docs-pill href="/tools/cli/setup-local" title="Setting up the local environment and workspace"/>
  <docs-pill href="/cli" title="Angular CLI Reference"/>
</docs-pill-row>
