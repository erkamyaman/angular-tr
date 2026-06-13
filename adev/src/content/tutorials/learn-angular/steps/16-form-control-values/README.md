# Form kontrol değerlerini alma

Formlarınız Angular ile kurulduğuna göre, bir sonraki adım form kontrollerindeki değerlere erişmektir.

NOTE: [Detaylı kılavuzda temel form kontrolü ekleme](/guide/forms/reactive-forms#temel-bir-form-kontrolü-ekleme) hakkında daha fazla bilgi edinin.

Bu aktivitede, form giriş alanınızdan değeri nasıl alacağınızı öğreneceksiniz.

<hr>

<docs-workflow>

<docs-step title="Giriş alanının değerini şablonda gösterin">

Giriş değerini bir şablonda görüntülemek için, bileşenin herhangi bir sınıf özelliğinde olduğu gibi `{{}}` interpolasyon sözdizimini kullanabilirsiniz:

```angular-ts {highlight:[5]}
@Component({
  selector: 'app-user',
  template: `
    ...
    <p>Framework: {{ favoriteFramework }}</p>
    <label for="framework">
      Favorite Framework:
      <input id="framework" type="text" [(ngModel)]="favoriteFramework" />
    </label>
  `,
})
export class User {
  favoriteFramework = '';
}
```

</docs-step>

<docs-step title="Bir giriş alanının değerini alın">

Bileşen sınıfında giriş alanı değerine referans vermeniz gerektiğinde, bunu `this` sözdizimi ile sınıf özelliğine erişerek yapabilirsiniz.

```angular-ts {highlight:[15]}
...
@Component({
  selector: 'app-user',
  template: `
    ...
    <button (click)="showFramework()">Show Framework</button>
  `,
  ...
})
export class User {
  favoriteFramework = '';
  ...

  showFramework() {
    alert(this.favoriteFramework);
  }
}
```

</docs-step>

</docs-workflow>

Giriş değerlerini şablonunuzda görüntülemeyi ve programatik olarak erişmeyi öğrendiğiniz için harika iş.

Angular ile formları yönetmenin bir sonraki yoluna geçme zamanı: reaktif formlar. Şablon odaklı formlar hakkında daha fazla bilgi edinmek isterseniz, lütfen [Angular form belgelerine](guide/forms/template-driven-forms) bakın.
