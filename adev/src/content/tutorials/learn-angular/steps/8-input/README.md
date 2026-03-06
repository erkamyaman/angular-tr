# Component input properties

Bazen uygulama geliştirme, bir bileşene veri göndermenizi gerektirir. Bu veri, bir bileşeni özelleştirmek veya bir üst bileşenden alt bileşene bilgi göndermek için kullanılabilir.

Angular, `input` adı verilen bir kavram kullanır. Bu, diğer framework'lerdeki `props` kavramına benzerdir. Bir `input` özelliği oluşturmak için `input()` fonksiyonunu kullanın.

NOTE: [Giriş özellikleri kılavuzundaki input ile veri kabul etme](/guide/components/inputs) hakkında daha fazla bilgi edinin.

Bu aktivitede, bileşenlere bilgi göndermek için `input()` fonksiyonunu nasıl kullanacağınızı öğreneceksiniz.

<hr>

Bir `input` özelliği oluşturmak için, bir bileşen sınıfının özelliğini başlatmak üzere `input()` fonksiyonunu ekleyin:

```ts {header:"user.ts"}
class User {
  occupation = input<string>();
}
```

Bir `input` aracılığıyla değer aktarmaya hazır olduğunuzda, değerler şablonlarda nitelik sözdizimi kullanılarak ayarlanabilir. İşte bir örnek:

```angular-ts {header:"app.ts", highlight:[3]}
@Component({
  ...
  template: `<app-user occupation="Angular Developer"></app-user>`
})
export class App {}
```

`input` fonksiyonu bir `InputSignal` döndürür. Sinyal çağrılarak değer okunabilir.

```angular-ts {header:"user.ts"}
@Component({
  ...
  template: `<p>The user's occupation is {{occupation()}}</p>`
})
```

<docs-workflow>

<docs-step title="Bir `input()` özelliği tanımlayın">
`user.ts` dosyasındaki kodu, `User` üzerinde `name` adında bir `input` özelliği tanımlayacak ve `string` tipini belirtecek şekilde güncelleyin. Şimdilik başlangıç değeri ayarlamayın ve `input()` fonksiyonunu argümansız çağırın. Şablonu, cümlenin sonunda `name` özelliğini çağıracak ve enterpolasyon yapacak şekilde güncellediğinizden emin olun.
</docs-step>

<docs-step title="`input` özelliğine bir değer geçirin">
`app.ts` dosyasındaki kodu, `name` özelliğine `"Simran"` değerini gönderecek şekilde güncelleyin.
<br>

Kod başarıyla güncellendiğinde, uygulama `The user's name is Simran` mesajını gösterecektir.
</docs-step>

</docs-workflow>

Bu harika olsa da bileşen iletişiminin sadece bir yönüdür. Peki bir alt bileşenden üst bileşene bilgi ve veri göndermek isterseniz ne olur? Öğrenmek için bir sonraki derse göz atın.

P.S. harika gidiyorsunuz - devam edin 🎉
