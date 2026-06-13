# @output ile Bileşen İletişimi

Bileşenlerle çalışırken, diğer bileşenlere bir şeyin gerçekleştiğini bildirmek gerekebilir. Belki bir butona tıklanmış, bir öğe listeden eklenmiş/çıkarılmış veya başka önemli bir güncelleme olmuştur. Bu senaryoda bileşenlerin üst bileşenlerle iletişim kurması gerekir.

Angular bu tür bir davranışı sağlamak için `output()` fonksiyonunu kullanır.

NOTE: [Çıkış özellikleri kılavuzundaki özel olaylar](/guide/components/outputs) hakkında daha fazla bilgi edinin.

Bu aktivitede, bileşenlerle iletişim kurmak için `output()` fonksiyonunu nasıl kullanacağınızı öğreneceksiniz.

<hr />

Alt bileşenden üst bileşene iletişim yolunu oluşturmak için, bir sınıf özelliğini başlatmak üzere `output` fonksiyonunu kullanın.

```ts {header:"child.ts"}
@Component({...})
class Child {
  incrementCountEvent = output<number>();
}
```

Artık bileşen, üst bileşen tarafından dinlenebilecek olaylar üretebilir. `emit` metodunu çağırarak olayları tetikleyin:

```ts {header:"child.ts"}
class Child {
  ...

  onClick() {
    this.count++;
    this.incrementCountEvent.emit(this.count);
  }
}
```

`emit` fonksiyonu, `output` tarafından tanımlanan türle aynı türde bir olay üretecektir.

Pekala, şimdi sıra sizde. Aşağıdaki görevleri takip ederek kodu tamamlayın:

<docs-workflow>

<docs-step title="Bir `output()` özelliği ekleyin">
`child.ts` dosyasını, `addItemEvent` adında bir output özelliği ekleyerek güncelleyin ve output türünü `string` olarak ayarladığınızdan emin olun.
</docs-step>

<docs-step title="`addItem` metodunu tamamlayın">
`child.ts` dosyasında `addItem` metodunu güncelleyin; mantık olarak aşağıdaki kodu kullanın:

```ts {header:"child.ts", highlight:[2]}
addItem() {
  this.addItemEvent.emit('🐢');
}
```

</docs-step>

<docs-step title="`App` şablonunu güncelleyin">
`app.ts` dosyasında, yayılan olayı dinlemek için aşağıdaki kodu ekleyerek şablonu güncelleyin:

```angular-html
<app-child (addItemEvent)="addItem($event)" />
```

Artık "Add Item" butonuna her tıklandığında listeye yeni bir öğe eklenir.

</docs-step>

</docs-workflow>

Bu noktada bileşen temellerini tamamladınız - etkileyici 👏

Angular'ın daha fazla harika özelliğini keşfetmek için öğrenmeye devam edin.
