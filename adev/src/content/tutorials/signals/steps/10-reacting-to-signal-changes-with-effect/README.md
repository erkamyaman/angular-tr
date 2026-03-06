# Reacting to signal changes with effect

Artık [sinyal sorguları ile alt elemanları sorgulamayı](/tutorials/signals/9-query-child-elements-with-signal-queries) öğrendiğinize göre, sinyal değişikliklerine efektlerle nasıl tepki verileceğini keşfedelim. Efektler, bağımlılıkları değiştiğinde otomatik olarak çalışan fonksiyonlardır ve loglama, DOM manipülasyonu veya API çağrıları gibi yan etkiler için mükemmeldirler.

**Önemli: Efektler başvuracağınız son API olmalıdır.** Türetilmiş değerler için her zaman `computed()`, hem türetilebilen hem de manuel olarak ayarlanabilen değerler için `linkedSignal()` tercih edin. Kendinizi bir efektle verileri bir sinyalden diğerine kopyalarken bulursanız, bu doğruluk kaynağınızı (source-of-truth) yukarı taşımanız ve bunun yerine `computed()` veya `linkedSignal()` kullanmanız gerektiğinin bir işaretidir. Efektler, sinyal durumunu imperatif, sinyal olmayan API'lerle senkronize etmek için en uygunudur.

Bu aktivitede, sinyal değişikliklerine tepki veren meşru yan etkiler için `effect()` fonksiyonunu nasıl uygun şekilde kullanacağınızı öğreneceksiniz.

<hr />

Sinyalleri zaten kurulmuş bir tema yöneticisi uygulamanız var. Şimdi sinyal değişikliklerine otomatik olarak tepki vermek için efektler ekleyeceksiniz.

<docs-workflow>

<docs-step title="effect fonksiyonunu içe aktarın">
Mevcut içe aktarmalarınıza `effect` ekleyin.

```ts
// Add effect to existing imports
import {Component, signal, computed, effect, ChangeDetectionStrategy} from '@angular/core';
```

`effect` fonksiyonu, okuduğu sinyallerden herhangi biri değiştiğinde otomatik olarak çalışan reaktif bir yan etki oluşturur.
</docs-step>

<docs-step title="Yerel depolama için bir efekt oluşturun">
Tema değiştiğinde otomatik olarak yerel depolamaya kaydeden bir efekt ekleyin.

```ts
constructor() {
  // Save theme to localStorage whenever it changes
  effect(() => {
    localStorage.setItem('theme', this.theme());
    console.log('Theme saved to localStorage:', this.theme());
  });
}
```

Bu efekt, tema sinyali her değiştiğinde çalışarak kullanıcının tercihini otomatik olarak kalıcı hale getirir.
</docs-step>

<docs-step title="Kullanıcı aktivitesini loglamak için bir efekt oluşturun">
Kullanıcı giriş veya çıkış yaptığında loglayan bir efekt ekleyin.

```ts
constructor() {
  // ... previous effect

  // Log user activity changes
  effect(() => {
    const status = this.isLoggedIn() ? 'logged in' : 'logged out';
    const user = this.username();
    console.log(`User ${user} is ${status}`);
  });
}
```

Bu efekt, efektlerin birden fazla sinyali nasıl okuyabildiğini ve herhangi birindeki değişikliklere nasıl tepki verdiğini gösterir.
</docs-step>

<docs-step title="Temizleme ile bir efekt oluşturun">
Bir zamanlayıcı kuran ve bileşen yok edildiğinde temizlenen bir efekt ekleyin.

```ts
constructor() {
  // ... previous effects

  // Timer effect with cleanup
  effect((onCleanup) => {
    const interval = setInterval(() => {
      console.log('Timer tick - Current theme:', this.theme());
    }, 5000);

    // Clean up the interval when the effect is destroyed
    onCleanup(() => {
      clearInterval(interval);
      console.log('Timer cleaned up');
    });
  });
}
```

Bu efekt, efektler yok edildiğinde veya yeniden çalıştırıldığında kaynakların nasıl temizlendiğini gösterir.
</docs-step>

<docs-step title="Efektleri test edin">
Tarayıcı konsolunu açın ve uygulama ile etkileşime geçin:

- **Tema Değiştir** - localStorage kayıtlarını ve zamanlayıcı loglarını görün
- **Giriş/Çıkış** - Kullanıcı aktivite loglarını görün
- **Zamanlayıcıyı İzle** - Her 5 saniyede bir periyodik tema loglamasını görün

Efektler, izlenen sinyallerden herhangi biri değiştiğinde otomatik olarak çalışır!
</docs-step>

</docs-workflow>

Mükemmel! Artık sinyallerle efektleri nasıl kullanacağınızı öğrendiniz. Hatırlanması gereken temel kavramlar:

- **Efektler reaktiftir**: Okudukları sinyallerden herhangi biri değiştiğinde otomatik olarak çalışır
- **Yalnızca yan etkiler**: Loglama, DOM manipülasyonu, API çağrıları ve imperatif API'lerle senkronizasyon için mükemmeldir
- **Temizleme**: Zamanlayıcılar veya abonelikler gibi kaynakları temizlemek için `onCleanup` geri çağrısını kullanın
- **Otomatik izleme**: Efektler, hangi sinyalleri okuduklarını otomatik olarak izler ve bu sinyaller değiştiğinde yeniden çalışır

**Unutmayın: Efektleri dikkatli kullanın!** Bu dersteki örnekler (localStorage senkronizasyonu, loglama, zamanlayıcılar) uygun kullanımlardır. Efektlerden kaçınmanız gereken durumlar:

- Diğer sinyallerden değer türetme - bunun yerine `computed()` kullanın
- Yazılabilir türetilmiş durum oluşturma - bunun yerine `linkedSignal()` kullanın
- Sinyaller arasında veri kopyalama - paylaşılan bir doğruluk kaynağı kullanacak şekilde yeniden yapılandırın

Efektler güçlüdür ancak `computed()` ve `linkedSignal()` kullanım durumunuzu çözemediğinde son çareniz olmalıdır.
