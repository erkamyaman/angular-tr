# Angular AI Tutor

Angular AI Tutor, sıfırdan eksiksiz, modern bir Angular uygulaması oluşturma sürecinde size adım adım etkileşimli olarak rehberlik etmek için tasarlanmıştır. Gerçek, somut bir proje oluşturarak en son kalıpları ve en iyi uygulamaları öğreneceksiniz: tarifleri oluşturmak ve yönetmek için bir **"Akıllı Tarif Kutusu"**.

Amacımız eleştirel düşünmeyi teşvik etmek ve öğrendiklerinizi kalıcı hale getirmenize yardımcı olmaktır. Sadece kod vermek yerine, eğitmen kavramları açıklayacak, örnekler gösterecek ve ardından kendi başınıza çözmeniz için projeye özgü alıştırmalar verecektir.

## Get Started

Yapay zeka eğitmenine [Angular MCP sunucusu](ai/mcp) aracılığıyla erişebilirsiniz.

1. Angular MCP sunucusunu [kurun](ai/mcp#get-started)
2. Yeni bir Angular projesi oluşturun `ng new <project-name>`
3. [Gemini CLI](https://geminicli.com/) gibi yapay zeka destekli bir düzenleyici veya araçta yeni projenize gidin (`cd <project-name>`)
4. `launch the Angular AI tutor` gibi bir prompt girin
   ![A screenshot demonstrating how to launch the Angular AI Tutor in the Gemini CLI.](assets/images/launch-ai-tutor.png 'Launch the Angular AI Tutor')

## Using the AI Tutor

Her modül kısa bir kavram açıklaması ile başlar.
![A screenshot of the Angular AI Tutor presenting a brief concept explanation.](assets/images/ai-tutor-preview-1.png 'Angular AI Tutor explanation')
Uygulanabilir olduğunda, eğitmen kavramı göstermek için bir kod örneği sunacaktır.
![A screenshot of the Angular AI Tutor showing a code example.](assets/images/ai-tutor-preview-2.png 'Angular AI Tutor code example')
Eğitmen ayrıca anlayışınızı test etmek için açık uçlu bir alıştırma sağlayacaktır.
![A screenshot of the Angular AI Tutor providing an exercise.](assets/images/ai-tutor-preview-3.png 'Angular AI Tutor exercise')
Son olarak, eğitmen bir sonraki modüle geçmeden önce çalışmanızı kontrol edecektir.
![A screenshot of the Angular AI Tutor checking the user's work.](assets/images/ai-tutor-preview-4.png 'Angular AI Tutor check')

## How It Works: The Learning Cycle

Her yeni konu için, öğrendiklerinizi daha iyi aklınızda tutmanıza yardımcı olmak amacıyla eleştirel düşünmeyi vurgulayan bir öğrenme döngüsü izleyeceksiniz.

1. **Learn the Concept:** Eğitmen kısaca temel bir Angular özelliğini açıklayacak ve bunu göstermek için genel bir kod örneği gösterecektir.
2. **Apply Your Knowledge:** Hemen uygulamalı bir alıştırma alacaksınız. Eğitmen bu alıştırmaları hedefler ve beklenen sonuçlarla üst düzeyde sunar ve çözümü kendiniz düşünmenizi teşvik eder.
3. **Get Feedback & Support:** Hazır olduğunuzda eğitmene bildirin. Çözümünüzün doğru olduğunu doğrulamak için **proje dosyalarınızı otomatik olarak okuyacaktır**. Takılırsanız, tamamen kontrolde olursunuz. Daha fazla rehberlik için **"hint"** isteyebilir veya **"detailed guide"** veya **"step-by-step instructions"** yazarak adım adım talimatlar alabilirsiniz.

Başarılı olduktan sonra eğitmen doğrudan bir sonraki konuya geçecektir. Ayrıca istediğiniz zaman eğitmenden bir konu hakkında daha fazla bilgi isteyebilir veya ilgili herhangi bir Angular sorusu sorabilirsiniz.

---

## **Features & Commands**

Öğrenme deneyiminizin kontrolü sizdedir. Bu özellikleri istediğiniz zaman kullanın:

### **Leave and Come Back**

Mola vermekten çekinmeyin. İlerlemeniz projenizin koduna bağlıdır. Yeni bir oturum için döndüğünüzde, eğitmen tam olarak nerede kaldığınızı belirlemek için dosyalarınızı otomatik olarak analiz edecek ve kaldığınız yerden sorunsuz bir şekilde devam etmenizi sağlayacaktır.

**Profesyonel İpucu:** İlerlemenizi kaydetmek için Git kullanmanızı şiddetle tavsiye ederiz. Bir modülü tamamladıktan sonra, değişikliklerinizi kaydetmek harika bir fikirdir (örneğin, `git commit -m "Complete Phase 1, Module 8"`). Bu, her zaman dönebileceğiniz kişisel bir kontrol noktası görevi görür.

### **Adjust Your Experience Level**

Deneyim seviyenizi **Beginner (1-3)**, **Intermediate (4-7)** veya **Experienced (8-10)** olarak ayarlayabilirsiniz. Bu ayarı oturumunuz sırasında istediğiniz zaman değiştirebilirsiniz ve eğitmen öğretme stilini hemen buna uyarlayacaktır.

**Örnek Promptlar:**

- "Set my experience level to beginner."
- "Change my rating to 8."

### **See the Full Learning Plan**

Büyük resmi görmek veya ne kadar ilerlediğinizi kontrol etmek mi istiyorsunuz? İçindekiler tablosunu sormanız yeterli.

**Örnek Promptlar:**

- "Where are we?"
- "Show the table of contents."
- "Show the plan."

Eğitmen tam öğrenme planını görüntüleyecek ve mevcut konumunuzu işaretleyecektir.

### **A Note on Styling**

Eğitmen, düzenli bir görünüm sağlamak için uygulamanıza temel stil uygulayacaktır. Uygulamayı kendinize ait hale getirmek için kendi stilinizi uygulamanız şiddetle teşvik edilmektedir.

### **Skip the Current Module**

Öğrenme yolundaki bir sonraki konuya geçmeyi tercih ediyorsanız, eğitmenden mevcut alıştırmayı atlamasını isteyebilirsiniz.

**Örnek Promptlar:**

- "Skip this section."
- "Auto-complete this step for me."

Eğitmen onay isteyecek ve ardından mevcut modülün tam kod çözümünü sunacak ve bir sonraki modüle sorunsuz devam edebilmenizi sağlamak için gerekli güncellemeleri otomatik olarak uygulamaya çalışacaktır.

### **Jump to Any Topic**

Sıra dışı belirli bir konu hakkında bilgi edinmek istiyorsanız (örneğin, temellerden formlara atlamak), yapabilirsiniz. Eğitmen, projenizi seçilen modül için doğru başlangıç noktasına güncellemek üzere gerekli kodu sağlayacak ve gerekli güncellemeleri otomatik olarak uygulamaya çalışacaktır.

**Örnek Promptlar:**

- "Take me to the forms lesson."
- "I want to learn about Route Guards now."
- "Jump to the section on Services."

---

## **Troubleshooting**

Eğitmen doğru yanıt vermezse veya uygulamanızda bir sorun olduğundan şüpheleniyorsanız, deneyebileceğiniz birkaç şey:

1. **"proceed" yazın:** Bu, eğitmenin takılması durumunda bir sonraki adıma devam etmesini sağlayabilir.
2. **Eğitmeni Düzeltin:** Eğitmen ilerlemeniz hakkında yanılıyorsa (örneğin, Modül 3'te olduğunuzu söylüyor ama siz Modül 8'i tamamladıysanız), sadece söyleyin. Örneğin: _"I'm actually on Module 8."_ Eğitmen kodunuzu yeniden değerlendirecek ve uyum sağlayacaktır.
3. **Kullanıcı Arayüzünüzü Doğrulayın:** Uygulamanızın kullanıcı arayüzünün nasıl görünmesi gerektiğini onaylamak istiyorsanız, eğitmene sorun. Örneğin: _"What should I see in my UI?"_
4. **Tarayıcı Penceresini Yeniden Yükleyin:** Bir yenileme, uygulamanızla ilgili birçok sorunu çözebilir.
5. **Tarayıcıyı Zorla Yeniden Başlatın:** Hatalar bazen yalnızca tarayıcının geliştirici konsolunda görünür. Zorla yeniden başlatma, uygulamayla ilgili altta yatan sorunları temizlemeye yardımcı olabilir.
6. **Yeni Bir Sohbet Başlatın:** Mevcut geçmişi kaldırmak ve yeniden başlamak için her zaman yeni bir sohbet başlatabilirsiniz. Eğitmen, bulunduğunuz en son adımı bulmak için dosyalarınızı okuyacaktır.

## **Your Learning Journey: The Phased Path**

Uygulamanızı beş aşamalı bir yolculuk boyunca oluşturacaksınız. Eksiksiz, tam işlevli bir Angular uygulaması oluşturmak için bu yolu baştan sona takip edebilirsiniz. Her modül mantıksal olarak bir öncekinin üzerine inşa ederek sizi temellerden gelişmiş, gerçek dünya özelliklerine taşır.

**Otomatik Kurulum Hakkında Not:** Bazı modüller, arayüzler veya sahte veriler oluşturma gibi bir kurulum adımı gerektirir. Bu durumlarda, eğitmen size kodu ve dosya talimatlarını sunacaktır. Alıştırma başlamadan önce talimat verilen şekilde bu dosyaları oluşturmak ve değiştirmek sizin sorumluluğunuzdadır.

### **Phase 1: Angular Fundamentals**

- **Module 1:** Getting Started
- **Module 2:** Dynamic Text with Interpolation
- **Module 3:** Event Listeners (`(click)`)

### **Phase 2: State and Signals**

- **Module 4:** State Management with Writable Signals (Part 1: `set`)
- **Module 5:** State Management with Writable Signals (Part 2: `update`)
- **Module 6:** Computed Signals

### **Phase 3: Component Architecture**

- **Module 7:** Template Binding (Properties & Attributes)
- **Module 8:** Creating & Nesting Components
- **Module 9:** Component Inputs with Signals
- **Module 10:** Styling Components
- **Module 11:** List Rendering with `@for`
- **Module 12:** Conditional Rendering with `@if`

### **Phase 4: Advanced Features & Architecture**

- **Module 13:** Two-Way Binding
- **Module 14:** Services & Dependency Injection (DI)
- **Module 15:** Basic Routing
- **Module 16:** Introduction to Forms
- **Module 17:** Intro to Angular Material

### **Phase 5: Experimental Signal Forms (⚠️ WARNING: Subject to Change)**

**BU AŞAMA ICIN KRITIK NOT:** Signal Forms su anda [**DENEYSEL** bir ozelliktir](/reference/releases#deneysel). API, gelecekteki Angular surumlerinde onemli olcude degisebilir. Lutfen bu bolumun son teknoloji bir ozelligi gosterdigini bilerek devam edin.

- **Module 18**: **Introduction to Signal Forms**
- **Module 19**: **Submitting & Resetting**
- **Module 20**: **Validation in Signal Forms**
- **Module 21**: **Field State & Error Messages**

---

## **A Note on AI & Feedback**

Bu egitmen bir Buyuk Dil Modeli (LLM) tarafindan desteklenmektedir. Onu bir uzman yapmak icin cok calistigimiz halde, yapay zekalar hata yapabilir. Yanlis gorunen bir aciklama veya kod ornegiyle karsilastirsaniz, lutfen bize bildirin. Egitmeni duzeltebilirsiniz ve yanitini buna gore ayarlayacaktir.

Herhangi bir teknik hata veya ozellik talebi icin lutfen [bir sorun gonderin](https://github.com/angular/angular-cli/issues).
