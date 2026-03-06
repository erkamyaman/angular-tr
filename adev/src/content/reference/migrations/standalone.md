# Mevcut bir Angular projesini standalone'a geçirme

**Standalone bileşenler**, Angular uygulamaları oluşturmanın basitleştirilmiş bir yolunu sağlar. Standalone bileşenler, direktifler ve pipe'lar, `NgModule`'lere olan ihtiyacı azaltarak yazım deneyimini kolaylaştırmayı amaçlar. Mevcut uygulamalar, herhangi bir kırıcı değişiklik olmadan isteğe bağlı ve aşamalı olarak yeni standalone stilini benimseyebilir.

<docs-video src="https://www.youtube.com/embed/x5PZwb4XurU" title="Getting started with standalone components"/>

Bu şematik, mevcut projelerdeki bileşenleri, direktifleri ve pipe'ları standalone hale getirmek için dönüştürmeye yardımcı olur. Şematik mümkün olduğunca çok kodu otomatik olarak dönüştürmeyi amaçlar, ancak proje yazarı tarafından bazı manuel düzeltmeler gerektirebilir.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```shell
ng generate @angular/core:standalone
```

## Güncelleme öncesi

Şematiği kullanmadan önce lütfen projenizin şu koşulları sağladığından emin olun:

1. Angular 15.2.0 veya sonraki bir sürümü kullanıyor olması.
2. Herhangi bir derleme hatası olmadan derlenmesi.
3. Temiz bir Git dalında olması ve tüm çalışmanın kaydedilmiş olması.

## Şematik seçenekleri

| Seçenek | Ayrıntılar                                                                                                                       |
| :------ | :------------------------------------------------------------------------------------------------------------------------------- |
| `mode`  | Gerçekleştirilecek dönüşüm. Mevcut seçenekler hakkında ayrıntılar için aşağıdaki [Geçiş modları](#geçiş-modları) bölümüne bakın. |
| `path`  | Proje köküne göre geçirilecek yol. Projenizi aşamalı olarak geçirmek için bu seçeneği kullanabilirsiniz.                         |

## Geçiş adımları

Geçiş süreci üç adımdan oluşur. Birden fazla kez çalıştırmanız ve projenin beklendiği gibi derlenip davrandığını manuel olarak kontrol etmeniz gerekecektir.

NOTE: Şematik çoğu kodu otomatik olarak güncelleyebilse de, bazı uç durumlar geliştirici müdahalesi gerektirir.
Geçişin her adımından sonra manuel düzeltmeler uygulamayı planlamalısınız. Ek olarak, şematik tarafından oluşturulan yeni kod, kodunuzun biçimlendirme kurallarına uymayabilir.

Geçişi aşağıda listelenen sırayla çalıştırın, her adım arasında kodunuzun derlendiğini ve çalıştığını doğrulayın:

1. `ng g @angular/core:standalone` çalıştırın ve "Convert all components, directives and pipes to standalone" seçeneğini seçin
2. `ng g @angular/core:standalone` çalıştırın ve "Remove unnecessary NgModule classes" seçeneğini seçin
3. `ng g @angular/core:standalone` çalıştırın ve "Bootstrap the project using standalone APIs" seçeneğini seçin
4. Lint ve biçimlendirme kontrollerini çalıştırın, hataları düzeltin ve sonucu kaydedin

## Geçişten sonra

Tebrikler, uygulamanız standalone'a dönüştürüldü! Şimdi yapmak isteyebileceğiniz bazı isteğe bağlı takip adımları:

- Kalan tüm `NgModule` bildirimlerini bulun ve kaldırın: ["Gereksiz NgModule'leri kaldır" adımı](#gereksiz-ngmoduleleri-kaldırma) tüm modülleri otomatik olarak kaldıramadığından, kalan bildirimleri manuel olarak kaldırmanız gerekebilir.
- Projenin birim testlerini çalıştırın ve hataları düzeltin.
- Proje otomatik biçimlendirme kullanıyorsa, kod biçimlendiricilerini çalıştırın.
- Projenizdeki linter'ları çalıştırın ve yeni uyarıları düzeltin. Bazı linter'lar, bazı uyarılarınızı otomatik olarak çözebilen bir `--fix` bayrağını destekler.

## Geçiş modları

Geçişin aşağıdaki modları vardır:

1. Bildirimleri standalone'a dönüştür.
2. Gereksiz NgModule'leri kaldır.
3. Standalone önyükleme API'sine geç.
   Bu geçişleri verilen sırayla çalıştırmalısınız.

### Bildirimleri standalone'a dönüştürme

Bu modda, geçiş tüm bileşenleri, direktifleri ve pipe'ları `standalone: false`'u kaldırarak ve bağımlılıkları `imports` dizilerine ekleyerek standalone'a dönüştürür.

HELPFUL: Şematik, bir bileşeni önyükleyen NgModule'leri bu adım sırasında yok sayar çünkü bunlar büyük olasılıkla standalone uyumlu `bootstrapApplication` yerine `bootstrapModule` tarafından kullanılan kök modüllerdir. Şematik bu bildirimleri ["Standalone önyükleme API'sine geç"](#standalone-önyükleme-apisine-geçiş) adımının parçası olarak otomatik olarak dönüştürür.

**Önce:**

```typescript
// shared.module.ts
@NgModule({
  imports: [CommonModule],
  declarations: [Greeter],
  exports: [Greeter],
})
export class SharedModule {}
```

```angular-ts
// greeter.ts
@Component({
  selector: 'greeter',
  template: '<div *ngIf="showGreeting">Hello</div>',
  standalone: false,
})
export class Greeter {
  showGreeting = true;
}
```

**Sonra:**

```typescript
// shared.module.ts
@NgModule({
  imports: [CommonModule, Greeter],
  exports: [Greeter],
})
export class SharedModule {}
```

```angular-ts
// greeter.ts
@Component({
  selector: 'greeter',
  template: '<div *ngIf="showGreeting">Hello</div>',
  imports: [NgIf],
})
export class Greeter {
  showGreeting = true;
}
```

### Gereksiz NgModule'leri kaldırma

Tüm bildirimler standalone'a dönüştürüldükten sonra, birçok NgModule güvenle kaldırılabilir. Bu adım, bu tür modül bildirimlerini ve mümkün olduğunca çok karşılık gelen referansı siler. Geçiş bir referansı otomatik olarak silemezse, NgModule'ü manuel olarak silebilmeniz için aşağıdaki TODO yorumunu bırakır:

```typescript
/* TODO(standalone-migration): kaldırılan NgModule referansını manuel olarak temizleyin */
```

Geçiş, bir modülün kaldırılmasının güvenli olduğunu şu durumlarda değerlendirir:

- `declarations` içermiyorsa.
- `providers` içermiyorsa.
- `bootstrap` bileşenleri içermiyorsa.
- `ModuleWithProviders` sembolüne veya kaldırılamayan bir modüle referans veren `imports` içermiyorsa.
- Sınıf üyeleri içermiyorsa. Boş yapıcılar yok sayılır.

**Önce:**

```typescript
// importer.module.ts
@NgModule({
  imports: [FooComponent, BarPipe],
  exports: [FooComponent, BarPipe],
})
export class ImporterModule {}
```

**Sonra:**

```typescript
// importer.module.ts
// Mevcut değil!
```

### Standalone önyükleme API'sine geçiş

Bu adım, `bootstrapModule` kullanımlarını yeni, standalone tabanlı `bootstrapApplication`'a dönüştürür. Ayrıca kök bileşenden `standalone: false`'u kaldırır ve kök NgModule'ü siler. Kök modülün herhangi bir `providers` veya `imports` değeri varsa, geçiş bu yapılandırmayı mümkün olduğunca yeni önyükleme çağrısına kopyalamaya çalışır.

**Önce:**

```typescript
// ./app/app.module.ts
import {NgModule} from '@angular/core';
import {App} from './app';

@NgModule({
  declarations: [App],
  bootstrap: [App],
})
export class AppModule {}
```

```typescript
// ./app/app.ts
@Component({
  selector: 'app',
  template: 'hello',
  standalone: false,
})
export class App {}
```

```typescript
// ./main.ts
import {platformBrowser} from '@angular/platform-browser';
import {AppModule} from './app/app.module';

platformBrowser()
  .bootstrapModule(AppModule)
  .catch((e) => console.error(e));
```

**Sonra:**

```typescript
// ./app/app.module.ts
// Mevcut değil!
```

```typescript
// ./app/app.ts
@Component({
  selector: 'app',
  template: 'hello',
})
export class App {}
```

```typescript
// ./main.ts
import {bootstrapApplication} from '@angular/platform-browser';
import {App} from './app';

bootstrapApplication(App).catch((e) => console.error(e));
```

## Yaygın sorunlar

Şematiğin doğru çalışmasını engelleyebilecek bazı yaygın sorunlar şunlardır:

- Derleme hataları - projede derleme hataları varsa Angular bunu doğru şekilde analiz edip geçiremez.
- tsconfig'e dahil edilmeyen dosyalar - şematik, projenizin `tsconfig.json` dosyalarını analiz ederek hangi dosyaların geçirileceğini belirler. Şematik, bir tsconfig tarafından yakalanmayan dosyaları hariç tutar.
- Statik olarak analiz edilemeyen kod - şematik, kodunuzu anlamak ve nerede değişiklik yapılacağını belirlemek için statik analiz kullanır. Geçiş, derleme zamanında statik olarak analiz edilemeyen metadata'ya sahip sınıfları atlayabilir.

## Sınırlamalar

Geçişin boyutu ve karmaşıklığı nedeniyle, şematiğin işleyemediği bazı durumlar vardır:

- Birim testleri önceden (AoT) derlenmediğinden, birim testlerinde bileşenlere eklenen `imports` tamamen doğru olmayabilir.
- Şematik, Angular API'lerine yapılan doğrudan çağrılara dayanır. Şematik, Angular API'leri etrafındaki özel sarmalayıcıları tanıyamaz. Örneğin, `TestBed.configureTestingModule`'ı saran özel bir `customConfigureTestModule` fonksiyonu tanımlarsanız, bildirdiği bileşenler tanınmayabilir.
