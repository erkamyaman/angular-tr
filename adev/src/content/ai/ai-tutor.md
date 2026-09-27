# Angular AI Tutor

Angular AI Tutor, sıfırdan eksiksiz, modern bir Angular uygulaması oluşturma sürecinde size adım adım etkileşimli olarak rehberlik etmek için tasarlanmıştır. Gerçek, somut bir proje oluşturarak en son kalıpları ve en iyi uygulamaları öğreneceksiniz: tarifleri oluşturmak ve yönetmek için bir **"Akıllı Tarif Kutusu"**.

Amacımız eleştirel düşünmeyi teşvik etmek ve öğrendiklerinizi kalıcı hale getirmenize yardımcı olmaktır. Sadece kod vermek yerine, eğitmen kavramları açıklayacak, örnekler gösterecek ve ardından kendi başınıza çözmeniz için projeye özgü alıştırmalar verecektir.

## Başlarken

Yapay zeka eğitmenine [Angular MCP sunucusu](ai/mcp) aracılığıyla erişebilirsiniz.

1. Angular MCP sunucusunu [kurun](ai/mcp#başlarken)
2. Yeni bir Angular projesi oluşturun `ng new <project-name>`
3. [Gemini CLI](https://geminicli.com/) gibi yapay zeka destekli bir düzenleyici veya araçta yeni projenize gidin (`cd <project-name>`)
4. `launch the Angular AI tutor` gibi bir prompt girin
   ![Gemini CLI'da Angular AI Tutor'ın nasıl başlatılacağını gösteren bir ekran görüntüsü.](assets/images/launch-ai-tutor.png 'Angular AI Tutor'ı başlatın')

## Yapay Zeka Eğitmenini Kullanma

Her modül kısa bir kavram açıklaması ile başlar.
![Angular AI Tutor'ın kısa bir kavram açıklaması sunduğu bir ekran görüntüsü.](assets/images/ai-tutor-preview-1.png 'Angular AI Tutor açıklaması')
Uygulanabilir olduğunda, eğitmen kavramı göstermek için bir kod örneği sunacaktır.
![Angular AI Tutor'ın bir kod örneği gösterdiği bir ekran görüntüsü.](assets/images/ai-tutor-preview-2.png 'Angular AI Tutor kod örneği')
Eğitmen ayrıca anlayışınızı test etmek için açık uçlu bir alıştırma sağlayacaktır.
![Angular AI Tutor'ın bir alıştırma sunduğu bir ekran görüntüsü.](assets/images/ai-tutor-preview-3.png 'Angular AI Tutor alıştırması')
Son olarak, eğitmen bir sonraki modüle geçmeden önce çalışmanızı kontrol edecektir.
![Angular AI Tutor'ın kullanıcının çalışmasını kontrol ettiği bir ekran görüntüsü.](assets/images/ai-tutor-preview-4.png 'Angular AI Tutor kontrolü')

## Nasıl Çalışır: Öğrenme Döngüsü

Her yeni konu için, öğrendiklerinizi daha iyi aklınızda tutmanıza yardımcı olmak amacıyla eleştirel düşünmeyi vurgulayan bir öğrenme döngüsü izleyeceksiniz.

1. **Kavramı Öğrenin:** Eğitmen kısaca temel bir Angular özelliğini açıklayacak ve bunu göstermek için genel bir kod örneği gösterecektir.
2. **Bilginizi Uygulayın:** Hemen uygulamalı bir alıştırma alacaksınız. Eğitmen bu alıştırmaları hedefler ve beklenen sonuçlarla üst düzeyde sunar ve çözümü kendiniz düşünmenizi teşvik eder.
3. **Geri Bildirim ve Destek Alın:** Hazır olduğunuzda eğitmene bildirin. Çözümünüzün doğru olduğunu doğrulamak için **proje dosyalarınızı otomatik olarak okuyacaktır**. Takılırsanız, tamamen kontrolde olursunuz. Daha fazla rehberlik için **"hint"** isteyebilir veya **"detailed guide"** veya **"step-by-step instructions"** yazarak adım adım talimatlar alabilirsiniz.

Başarılı olduktan sonra eğitmen doğrudan bir sonraki konuya geçecektir. Ayrıca istediğiniz zaman eğitmenden bir konu hakkında daha fazla bilgi isteyebilir veya ilgili herhangi bir Angular sorusu sorabilirsiniz.

---

## **Özellikler ve Komutlar**

Öğrenme deneyiminizin kontrolü sizdedir. Bu özellikleri istediğiniz zaman kullanın:

### **Ayrılın ve Geri Dönün**

Mola vermekten çekinmeyin. İlerlemeniz projenizin koduna bağlıdır. Yeni bir oturum için döndüğünüzde, eğitmen tam olarak nerede kaldığınızı belirlemek için dosyalarınızı otomatik olarak analiz edecek ve kaldığınız yerden sorunsuz bir şekilde devam etmenizi sağlayacaktır.

**Profesyonel İpucu:** İlerlemenizi kaydetmek için Git kullanmanızı şiddetle tavsiye ederiz. Bir modülü tamamladıktan sonra, değişikliklerinizi kaydetmek harika bir fikirdir (örneğin, `git commit -m "Complete Phase 1, Module 8"`). Bu, her zaman dönebileceğiniz kişisel bir kontrol noktası görevi görür.

### **Deneyim Seviyenizi Ayarlayın**

Deneyim seviyenizi **Beginner (1-3)**, **Intermediate (4-7)** veya **Experienced (8-10)** olarak ayarlayabilirsiniz. Bu ayarı oturumunuz sırasında istediğiniz zaman değiştirebilirsiniz ve eğitmen öğretme stilini hemen buna uyarlayacaktır.

**Örnek Promptlar:**

- "Set my experience level to beginner."
- "Change my rating to 8."

### **Tam Öğrenme Planını Görün**

Büyük resmi görmek veya ne kadar ilerlediğinizi kontrol etmek mi istiyorsunuz? İçindekiler tablosunu sormanız yeterli.

**Örnek Promptlar:**

- "Where are we?"
- "Show the table of contents."
- "Show the plan."

Eğitmen tam öğrenme planını görüntüleyecek ve mevcut konumunuzu işaretleyecektir.

### **Stillendirme Hakkında Bir Not**

Eğitmen, düzenli bir görünüm sağlamak için uygulamanıza temel stil uygulayacaktır. Uygulamayı kendinize ait hale getirmek için kendi stilinizi uygulamanız şiddetle teşvik edilmektedir.

### **Mevcut Modülü Atlayın**

Öğrenme yolundaki bir sonraki konuya geçmeyi tercih ediyorsanız, eğitmenden mevcut alıştırmayı atlamasını isteyebilirsiniz.

**Örnek Promptlar:**

- "Skip this section."
- "Auto-complete this step for me."

Eğitmen onay isteyecek ve ardından mevcut modülün tam kod çözümünü sunacak ve bir sonraki modüle sorunsuz devam edebilmenizi sağlamak için gerekli güncellemeleri otomatik olarak uygulamaya çalışacaktır.

### **Herhangi Bir Konuya Atlayın**

Sıra dışı belirli bir konu hakkında bilgi edinmek istiyorsanız (örneğin, temellerden formlara atlamak), yapabilirsiniz. Eğitmen, projenizi seçilen modül için doğru başlangıç noktasına güncellemek üzere gerekli kodu sağlayacak ve gerekli güncellemeleri otomatik olarak uygulamaya çalışacaktır.

**Örnek Promptlar:**

- "Take me to the forms lesson."
- "I want to learn about Route Guards now."
- "Jump to the section on Services."

---

## **Sorun Giderme**

### Kurulum Sorunları

**"launch the Angular AI tutor" hiçbir şey yapmıyor mu?**

Önce açık bir projeniz olduğundan emin olun. Eğitmenin çalışması için gerçek bir Angular projesine ihtiyacı vardır:

```bash
ng new my-app
cd my-app
code .
```

Ardından MCP sunucunuzun çalıştığından emin olun. VS Code'da `.vscode/mcp.json` dosyasını açın ve dosyanın üst kısmındaki **"Start"** düğmesine tıklayın.

"launch the Angular AI tutor" yazdığınızda, "Reviewed .vscode/mcp.json and ran start task"
diyen bir onay işareti ve "Allow task run?" diye soran bir istem görmelisiniz.
Allow'a tıklayıp devam edin.

**Hâlâ çalışmıyor mu?**

Önce Angular bağlamını yüklemek için `#angular-cli` yazmayı deneyin, ardından öğretici URL'sini yapıştırın: `https://angular.dev/ai/ai-tutor`

**Sunucunun çalıştığı nasıl doğrulanır**

Komut Paletini açın (`Ctrl+Shift+P`), "MCP: List Running Servers" yazın ve listede "angular-cli" olup olmadığına bakın.

---

### Genel Sorunlar

Eğitmen doğru yanıt vermezse veya uygulamanızda bir sorun olduğundan şüpheleniyorsanız, deneyebileceğiniz birkaç şey:

1. **"proceed" yazın:** Bu, eğitmenin takılması durumunda bir sonraki adıma devam etmesini sağlayabilir.
2. **Eğitmeni Düzeltin:** Eğitmen ilerlemeniz hakkında yanılıyorsa (örneğin, Modül 3'te olduğunuzu söylüyor ama siz Modül 8'i tamamladıysanız), sadece söyleyin. Örneğin: _"I'm actually on Module 8."_ Eğitmen kodunuzu yeniden değerlendirecek ve uyum sağlayacaktır.
3. **Kullanıcı Arayüzünüzü Doğrulayın:** Uygulamanızın kullanıcı arayüzünün nasıl görünmesi gerektiğini onaylamak istiyorsanız, eğitmene sorun. Örneğin: _"What should I see in my UI?"_
4. **Tarayıcı Penceresini Yeniden Yükleyin:** Bir yenileme, uygulamanızla ilgili birçok sorunu çözebilir.
5. **Tarayıcıyı Zorla Yeniden Başlatın:** Hatalar bazen yalnızca tarayıcının geliştirici konsolunda görünür. Zorla yeniden başlatma, uygulamayla ilgili altta yatan sorunları temizlemeye yardımcı olabilir.
6. **Yeni Bir Sohbet Başlatın:** Mevcut geçmişi kaldırmak ve yeniden başlamak için her zaman yeni bir sohbet başlatabilirsiniz. Eğitmen, bulunduğunuz en son adımı bulmak için dosyalarınızı okuyacaktır.

## **Öğrenme Yolculuğunuz: Aşamalı Yol**

Uygulamanızı beş aşamalı bir yolculuk boyunca oluşturacaksınız. Eksiksiz, tam işlevli bir Angular uygulaması oluşturmak için bu yolu baştan sona takip edebilirsiniz. Her modül mantıksal olarak bir öncekinin üzerine inşa ederek sizi temellerden gelişmiş, gerçek dünya özelliklerine taşır.

**Otomatik Kurulum Hakkında Not:** Bazı modüller, arayüzler veya sahte veriler oluşturma gibi bir kurulum adımı gerektirir. Bu durumlarda, eğitmen size kodu ve dosya talimatlarını sunacaktır. Alıştırma başlamadan önce talimat verilen şekilde bu dosyaları oluşturmak ve değiştirmek sizin sorumluluğunuzdadır.

### **Aşama 1: Angular Temelleri** {#phase-1-angular-fundamentals}

- **Modül 1:** Başlarken
- **Modül 2:** İnterpolasyon ile Dinamik Metin
- **Modül 3:** Olay Dinleyicileri (`(click)`)

### **Aşama 2: Durum ve Sinyaller** {#phase-2-state-and-signals}

- **Modül 4:** Yazılabilir Sinyallerle Durum Yönetimi (Bölüm 1: `set`)
- **Modül 5:** Yazılabilir Sinyallerle Durum Yönetimi (Bölüm 2: `update`)
- **Modül 6:** Hesaplanmış Sinyaller

### **Aşama 3: Bileşen Mimarisi** {#phase-3-component-architecture}

- **Modül 7:** Şablon Bağlama (Özellikler ve Nitelikler)
- **Modül 8:** Bileşen Oluşturma ve İç İçe Yerleştirme
- **Modül 9:** Sinyallerle Bileşen Girdileri
- **Modül 10:** Bileşenleri Stillendirme
- **Modül 11:** `@for` ile Liste Oluşturma
- **Modül 12:** `@if` ile Koşullu Oluşturma

### **Aşama 4: Gelişmiş Özellikler ve Mimari** {#phase-4-advanced-features--architecture}

- **Modül 13:** Çift Yönlü Bağlama
- **Modül 14:** Servisler ve Bağımlılık Enjeksiyonu (DI)
- **Modül 15:** Temel Yönlendirme
- **Modül 16:** Formlara Giriş
- **Modül 17:** Angular Material'a Giriş

### **Aşama 5: Signal Forms** {#phase-5-signal-forms}

- **Modül 18**: **Signal Forms'a Giriş**
- **Modül 19**: **Gönderme ve Sıfırlama**
- **Modül 20**: **Signal Forms'ta Doğrulama**
- **Modül 21**: **Alan Durumu ve Hata Mesajları**

---

## **Yapay Zeka ve Geri Bildirim Hakkında Bir Not**

Bu eğitmen bir Büyük Dil Modeli (LLM) tarafından desteklenmektedir. Onu bir uzman yapmak için çok çalıştığımız halde, yapay zekalar hata yapabilir. Yanlış görünen bir açıklama veya kod örneğiyle karşılaşırsanız, lütfen bize bildirin. Eğitmeni düzeltebilirsiniz ve yanıtını buna göre ayarlayacaktır.

Herhangi bir teknik hata veya özellik talebi için lütfen [bir sorun gönderin](https://github.com/angular/angular-cli/issues).
