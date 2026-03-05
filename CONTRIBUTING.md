# Angular'a Katkıda Bulunma

Angular'a katkıda bulunmanızı ve bugünkünden daha iyi hale getirmenize yardımcı olmanızı çok isteriz!
Bir katkıda bulunan olarak, uymanızı istediğimiz kurallar şunlardır:

- [Davranış Kuralları](#coc)
- [Sorunuz mu Var?](#question)
- [Sorunlar ve Hatalar](#issue)
- [Özellik İstekleri](#feature)
- [Gönderim Rehberi](#submit)
- [Kodlama Kuralları](#rules)
- [Commit Mesajı Kuralları](#commit)
- [CLA İmzalama](#cla)

## <a name="coc"></a> Davranış Kuralları

Angular'ı açık ve kapsayıcı tutmamıza yardımcı olun.
Lütfen [Davranış Kurallarımızı][coc] okuyun ve uygulayın.

## <a name="question"></a> Sorunuz mu Var?

GitHub issue'larını hata raporları ve özellik istekleri için kullanmak istediğimizden, genel destek soruları için issue açmayın.
Bunun yerine, destekle ilgili sorular sormak için [Stack Overflow](https://stackoverflow.com/questions/tagged/angular) kullanmanızı öneririz. Stack Overflow'da yeni bir soru oluştururken `angular` etiketini eklediğinizden emin olun.

Stack Overflow soru sormak için çok daha iyi bir yerdir çünkü:

- Stack Overflow'da yardım etmeye istekli binlerce kişi var
- Sorular ve yanıtlar herkese açık kalır, böylece sorunuz/yanıtınız başka birine yardımcı olabilir
- Stack Overflow'un oylama sistemi en iyi yanıtların öne çıkmasını sağlar.

Zamanınızı ve zamanımızı korumak için, genel destek isteği olan tüm issue'ları sistematik olarak kapatacağız ve kişileri Stack Overflow'a yönlendireceğiz.

Soru hakkında gerçek zamanlı sohbet etmek isterseniz, [Angular topluluk Discord sunucusu][discord] üzerinden ulaşabilirsiniz.

## <a name="issue"></a> Bir Hata mı Buldunuz?

Kaynak kodunda bir hata bulursanız, [GitHub Deposuna][github] [issue göndererek](#submit-issue) bize yardımcı olabilirsiniz.
Daha da iyisi, düzeltmeyle birlikte bir [Pull Request gönderebilirsiniz](#submit-pr).

## <a name="feature"></a> Eksik Bir Özellik mi Var?

GitHub Deposuna [issue göndererek](#submit-issue) yeni bir özellik _talep edebilirsiniz_.
Yeni bir özelliği _uygulamak_ istiyorsanız, doğru adımları belirlemek için değişikliğin boyutunu göz önünde bulundurun:

- **Büyük Bir Özellik** için önce bir issue açın ve teklifinizi tartışmaya sunun.
  Bu süreç, çalışmalarımızı daha iyi koordine etmemize, işlerin tekrarlanmasını önlememize ve değişikliğinizin projeye başarıyla kabul edilmesini sağlamamıza yardımcı olur.

  **Not**: Dokümantasyona yeni bir konu eklemek veya bir konuyu önemli ölçüde yeniden yazmak büyük bir özellik sayılır.

- **Küçük Özellikler** doğrudan [Pull Request olarak gönderilebilir](#submit-pr).

## <a name="submit"></a> Gönderim Rehberi

### <a name="submit-issue"></a> Issue Gönderme

Bir issue göndermeden önce lütfen issue takip sistemini arayın. Sorununuz için zaten bir issue olabilir ve tartışma size hazır çözümler sunabilir.

Tüm sorunları mümkün olan en kısa sürede düzeltmek istiyoruz, ancak bir hatayı düzeltmeden önce onu yeniden üretmemiz ve doğrulamamız gerekir.
Hataları yeniden üretmek için minimal bir reprodüksiyon sağlamanızı istiyoruz.
Minimal bir reprodüksiyon senaryosu, ek sorularla size geri dönmeden bize önemli bilgiler sağlar.

Minimal bir reprodüksiyon, bir hatayı hızlıca doğrulamamızı (veya bir kodlama sorununu tespit etmemizi) ve doğru sorunu düzelttiğimizden emin olmamızı sağlar.

Sürdürücülerin zamanını korumak ve nihayetinde daha fazla hata düzeltebilmek için minimal bir reprodüksiyon istiyoruz.
Geliştiriciler genellikle minimal bir reprodüksiyon hazırlarken kodlama sorunlarını kendileri bulurlar.
Bazen daha büyük bir kod tabanından temel kod parçalarını çıkarmanın zor olabileceğini anlıyoruz, ancak düzeltmeden önce sorunu gerçekten izole etmemiz gerekiyor.

Ne yazık ki, minimal bir reprodüksiyon olmadan hataları araştıramıyoruz / düzeltemiyoruz, bu nedenle sizden geri dönüş almazsak, yeniden üretilecek yeterli bilgiye sahip olmayan issue'ları kapatacağız.

[Yeni issue şablonlarımızdan](https://github.com/angular/angular/issues/new/choose) birini seçerek ve issue şablonunu doldurarak yeni issue açabilirsiniz.

### <a name="pr-quality"></a> Katkı Kalitesi

Açık kaynak katkısına ve topluluk katkıda bulunanlarından gelen pull request'lere büyük değer veriyoruz. Lütfen her pull request'in ekipteki gerçek bir kişi tarafından incelenip merge edildiğini unutmayın, bu da zaman ve çaba gerektirir. Bu, diğer değerli işlerden alınan zaman ve çabadır. Bunu göz önünde bulundurarak, açılan herhangi bir topluluk katkısı pull request'inden beklenen minimum standartlar belirledik.

1. Gönderiminizle ilgili açık veya kapalı bir PR için [GitHub'da](https://github.com/angular/angular/pulls) arama yapın.
   - Mevcut çalışmaları tekrarlamak istemezsiniz.
2. Bir issue veya pull request'in düzelttiğiniz sorunu veya eklemek istediğiniz özelliğin tasarımını açıkça tanımladığından emin olun. Issue'lar _minimal_ bir reprodüksiyon gerektirir.

3. Bir issue'da tasarımı önceden tartışmak, çalışmanızı kabul etmeye hazır olmamızı sağlar. Pull request'ler tasarım çalışması yapmak için doğru yer değildir.
   - Şüpheye düştüğünüzde, herhangi bir spekülatif uygulama çalışması yapmadan önce bir issue açın

4. İdeal olarak PR bir issue'ya bağlı olmalıdır, ancak bu zorunlu değildir

5. Değişiklik, kod kalitesini iyileştirmeli (örneğin bir TODO'yu ele almak) veya bir özelliği etkilemeli / iyileştirmelidir

6. Mikro optimizasyonlar yalnızca gerçek bir benchmark ile doğrulanırsa kabul edilecektir

7. "help wanted" etiketli olmayan özellik isteklerini ele alan pull request'ler açmayın çünkü bunlar genellikle pull request'leri kabul edebilmemiz için ek tasarım çalışması gerektirir

8. Değişiklik iyi test edilmiş olmalıdır

Pull request'iniz bu minimum beklentileri karşılamıyorsa PR'ınızı kapatabiliriz. Ayrıca, PR'ınız breaking change içeriyorsa, bu breaking change'in neden olduğu değişiklik düzeyi ilerleyebilmemizi engelleyebilir. Bu durumda da PR'ınızı kapatabiliriz. Aksi takdirde, katkılarınızı ve Angular'a olan coşkunuzu görmekten heyecan duyuyoruz!

### <a name="submit-pr"></a> Pull Request (PR) Gönderme

Pull Request (PR) göndermeden önce aşağıdaki kuralları göz önünde bulundurun:

1. Lütfen PR göndermeden önce [Katkıda Bulunan Lisans Sözleşmemizi (CLA)](#cla) imzalayın.
   İmzalanmış bir CLA olmadan kodu kabul edemeyiz.
   Katkıda bulunduğunuz tüm Git commit'lerini CLA imzanızla ilişkili e-posta adresiyle yazdığınızdan emin olun.

2. [angular/angular](https://github.com/angular/angular/fork) deposunu [fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) edin.

3. Fork edilmiş deponuzda, yeni bir git branch'inde değişikliklerinizi yapın:

   ```shell
   git checkout -b my-fix-branch main
   ```

4. Patch'inizi oluşturun, **uygun test case'leri dahil edin**.

5. [Kodlama Kurallarımıza](#rules) uyun.

6. [Geliştirici dokümantasyonunda][dev-doc] açıklandığı gibi tam Angular test suite'ini çalıştırın ve tüm testlerin geçtiğinden emin olun.

7. [Commit mesajı kurallarımıza][commit-message-guidelines] uyan açıklayıcı bir commit mesajıyla değişikliklerinizi commit edin.
   Bu kurallara uyum gereklidir çünkü release notları bu mesajlardan otomatik olarak oluşturulur.

   ```shell
   git commit --all
   ```

   Not: isteğe bağlı `--all` commit seçeneği, düzenlenen dosyaları otomatik olarak "add" ve "rm" yapacaktır.

8. Branch'inizi GitHub'a push edin:

   ```shell
   git push origin my-fix-branch
   ```

9. GitHub'da `angular:main`'e bir pull request gönderin.

### Pull Request İnceleme

Angular ekibi, topluluğun iyi vatandaşları olmayan topluluk üyelerinden gelen pull request'leri kabul etmeme hakkını saklı tutar. Bu tür davranışlar, [Angular davranış kurallarına](https://github.com/angular/code-of-conduct) uymamayla ilgilidir ve Angular tarafından yönetilen kanalların içinde veya dışında geçerlidir.

#### İnceleme Geri Bildirimlerini Ele Alma

Kod incelemeleri aracılığıyla değişiklik istersek:

1. Kodda gerekli güncellemeleri yapın.

2. Testlerin hâlâ geçtiğinden emin olmak için Angular test suite'lerini yeniden çalıştırın.

3. Bir fixup commit oluşturun ve GitHub deponuza push edin (bu Pull Request'inizi güncelleyecektir):

   ```shell
   git commit --all --fixup HEAD
   git push
   ```

   Fixup commit'lerle çalışma hakkında daha fazla bilgi için [buraya](./contributing-docs/using-fixup-commits.md) bakın.

İşte bu kadar! Katkınız için teşekkürler!

##### Commit Mesajını Güncelleme

Bir incelemeci genellikle commit mesajında değişiklikler önerebilir (örneğin, bir değişiklik için daha fazla bağlam eklemek veya [commit mesajı kurallarımıza][commit-message-guidelines] uymak için).
Branch'inizdeki son commit'in mesajını güncellemek için:

1. Branch'inize geçin:

   ```shell
   git checkout my-fix-branch
   ```

2. Son commit'i amend edin ve commit mesajını değiştirin:

   ```shell
   git commit --amend
   ```

3. GitHub deponuza push edin:

   ```shell
   git push --force-with-lease
   ```

> NOT:<br />
> Daha eski bir commit'in mesajını güncellemeniz gerekiyorsa, `git rebase`'i interaktif modda kullanabilirsiniz.
> Daha fazla ayrıntı için [git dokümantasyonuna](https://git-scm.com/docs/git-rebase#_interactive_mode) bakın.

#### Pull Request'iniz Merge Edildikten Sonra

Pull request'iniz merge edildikten sonra branch'inizi güvenle silebilir ve ana (upstream) depodan değişiklikleri çekebilirsiniz:

- GitHub web arayüzü veya yerel shell'iniz aracılığıyla uzak branch'i silin:

  ```shell
  git push origin --delete my-fix-branch
  ```

- Main branch'e geçin:

  ```shell
  git checkout main -f
  ```

- Yerel branch'i silin:

  ```shell
  git branch -D my-fix-branch
  ```

- Yerel `main`'inizi en son upstream sürümüyle güncelleyin:

  ```shell
  git pull --ff upstream main
  ```

## <a name="rules"></a> Kodlama Kuralları

Kaynak kodu genelinde tutarlılık sağlamak için, çalışırken şu kuralları aklınızda tutun:

- Tüm özellikler veya hata düzeltmeleri bir veya daha fazla spec (unit-test) ile **test edilmelidir**.
- Tüm public API yöntemleri **belgelenmelidir**.
- [Google'ın TypeScript Stil Rehberini][ts-style-guide] takip ediyoruz, ancak tüm kodu **100 karakter**'de sarıyoruz.

  Otomatik bir formatlayıcı mevcuttur, [building-and-testing-angular.md](./contributing-docs/building-and-testing-angular.md#formatting-your-source-code) dosyasına bakın.

## <a name="commit"></a> Commit Mesajı Kuralları

Git commit mesajlarımızın nasıl formatlanacağına dair çok kesin kurallarımız var:

```
<type>(<scope>): <kısa özet>
```

Ayrıntılar için [Commit Mesajı Kurallarına][commit-message-guidelines] bakın.

## <a name="cla"></a> CLA İmzalama

Lütfen pull request göndermeden önce Katkıda Bulunan Lisans Sözleşmemizi (CLA) imzalayın. Herhangi bir kod değişikliğinin kabul edilmesi için CLA imzalanmış olmalıdır. Hızlı bir süreç, söz veriyoruz!

- Bireyler için [basit bir tıkla-imzala formumuz][individual-cla] var.
- Şirketler için [formu yazdırmanız, imzalamanız ve tarama+e-posta, faks veya posta yoluyla göndermeniz][corporate-cla] gerekecektir.

Birden fazla GitHub hesabınız veya tek bir GitHub hesabıyla ilişkili birden fazla e-posta adresiniz varsa, Git commit'lerini yazmak ve pull request göndermek için kullandığınız GitHub hesabının birincil e-posta adresiyle CLA'yı imzalamanız gerekir.

Aşağıdaki belgeler, GitHub hesapları ve birden fazla e-posta adresiyle ilgili sorunları çözmenize yardımcı olabilir:

- https://help.github.com/articles/setting-your-commit-email-address-in-git/
- https://stackoverflow.com/questions/37245303/what-does-usera-committed-with-userb-13-days-ago-on-github-mean
- https://help.github.com/articles/about-commit-email-addresses/
- https://help.github.com/articles/blocking-command-line-pushes-that-expose-your-personal-email-address/

[coc]: https://github.com/angular/code-of-conduct/blob/main/CODE_OF_CONDUCT.md
[corporate-cla]: https://cla.developers.google.com/about/google-corporate
[dev-doc]: ./contributing-docs/building-and-testing-angular.md
[commit-message-guidelines]: ./contributing-docs/commit-message-guidelines.md
[github]: https://github.com/angular/angular
[discord]: https://discord.gg/angular
[individual-cla]: https://cla.developers.google.com/about/google-individual
[ts-style-guide]: https://google.github.io/styleguide/tsguide.html
