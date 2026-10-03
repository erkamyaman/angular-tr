<docs-decorative-header title="Angular Sinyalleri ile Formlar" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

Signal Forms, sinyallerin reaktif temeli üzerine kurularak Angular uygulamalarında form durumunu yönetmenize olanak tanıyan bir kütüphanedir. Otomatik çift yönlü bağlama, tür güvenli alan erişimi ve şema tabanlı doğrulama ile Signal Forms, sağlam formlar oluşturmanıza yardımcı olur.

TIP: Signal Forms'a hızlı bir giriş için [Signal Forms temel kılavuzuna](essentials/signal-forms) bakın.

## Neden Signal Form'lar?

Web uygulamalarında form oluşturmak, birbirine bağlı birkaç konuyu yönetmeyi içerir: alan değerlerini takip etme, kullanıcı girdisini doğrulama, hata durumlarını yönetme ve kullanıcı arayüzünü veri modelinizle senkronize tutma. Bu konuları ayrı ayrı yönetmek, tekrarlayan kod ve karmaşıklık oluşturur.

Signal Forms bu zorlukları şu yollarla ele alır:

- **Durumu otomatik olarak senkronize etme** - Form veri modelini bağlı form alanlarıyla otomatik olarak senkronize eder
- **Tür güvenliği sağlama** - Kullanıcı arayüzü kontrolleri ile veri modeli arasında tamamen tür güvenli şemalar ve bağlamalar destekler
- **Doğrulama mantığını merkezileştirme** - Tüm doğrulama kurallarını bir doğrulama şeması kullanarak tek bir yerde tanımlayın

Signal Forms, sinyallerle oluşturulan yeni uygulamalarda en iyi şekilde çalışır. Reaktif formlar kullanan mevcut bir uygulamayla çalışıyorsanız, reaktif formlar sağlam bir seçim olmaya devam eder.

NOTE: Şablon veya reaktif formlardan geliyorsanız, [karşılaştırma kılavuzuyla](guide/forms/signals/comparison) ilgilenebilirsiniz.

## Ön koşullar

Signal Forms şunları gerektirir:

- Angular v21 veya üstü

## Kurulum {#setup}

Signal Forms zaten `@angular/forms` paketine dahildir. Gerekli fonksiyonları ve direktifleri `@angular/forms/signals`'dan içe aktarın:

```ts
import {form, FormField, required, email} from '@angular/forms/signals';
```

`FormField` direktifi, form alanlarını HTML girdilerine bağlayan herhangi bir bileşene içe aktarılmalıdır:

```ts
@Component({
  // ...
  imports: [FormField],
})
```

## Sonraki adımlar

Signal Forms'un nasıl çalıştığı hakkında daha fazla bilgi edinmek için aşağıdaki kılavuzlara göz atın:

<docs-pill-row>
  <docs-pill href="essentials/signal-forms" title="Sinyallerle formlar" />
  <docs-pill href="guide/forms/signals/models" title="Form modelleri" />
  <docs-pill href="guide/forms/signals/model-design" title="Form modelinizi tasarlama" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Alan durumu yönetimi" />
  <docs-pill href="guide/forms/signals/validation" title="Doğrulama" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Özel Kontroller" />
  <docs-pill href="guide/forms/signals/comparison" title="Diğer form yaklaşımlarıyla karşılaştırma" />
</docs-pill-row>
