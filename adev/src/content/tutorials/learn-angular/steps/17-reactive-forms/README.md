# Reactive Forms

Formlarınızı tamamen şablona güvenmek yerine programatik olarak yönetmek istediğinizde, reaktif formlar çözümdür.

NOTE: [Detaylı kılavuzda reaktif formlar](/guide/forms/reactive-forms) hakkında daha fazla bilgi edinin.

Bu aktivitede, reaktif formları nasıl kuracağınızı öğreneceksiniz.

<hr>

<docs-workflow>

<docs-step title="`ReactiveForms` modülünü içe aktarın">

`app.ts` dosyasında, `ReactiveFormsModule`'ü `@angular/forms` paketinden içe aktarın ve bileşenin `imports` dizisine ekleyin.

```angular-ts
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <form>
      <label>Name
        <input type="text" />
      </label>
      <label>Email
        <input type="email" />
      </label>
      <button type="submit">Submit</button>
    </form>
  `,
  imports: [ReactiveFormsModule],
})
```

</docs-step>

<docs-step title="FormControl'lar ile `FormGroup` nesnesini oluşturun">

Reaktif formlar, form kontrollerini (örneğin giriş alanları) temsil etmek için `FormControl` sınıfını kullanır. Angular, form kontrollerini geliştiriciler için büyük formları daha kolay yönetmeyi sağlayan yardımcı bir nesne olarak gruplamak için `FormGroup` sınıfını sağlar.

`FormControl` ve `FormGroup`'u `@angular/forms` içe aktarımına ekleyin, böylece her form için `name` ve `email` özelliklerini FormControl olarak içeren bir FormGroup oluşturabilirsiniz.

```ts
import {ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
...
export class App {
  profileForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
  });
}
```

</docs-step>

<docs-step title="FormGroup ve FormControl'ları forma bağlayın">

Her `FormGroup`, `[formGroup]` direktifi kullanılarak bir forma bağlanmalıdır.

Ek olarak, her `FormControl`, `formControlName` direktifi ile bağlanabilir ve ilgili özelliğe atanabilir. Şablonu aşağıdaki form koduyla güncelleyin:

```angular-html
<form [formGroup]="profileForm">
  <label>
    Name
    <input type="text" formControlName="name" />
  </label>
  <label>
    Email
    <input type="email" formControlName="email" />
  </label>
  <button type="submit">Submit</button>
</form>
```

</docs-step>

<docs-step title="Form güncellemesini yönetin">

`FormGroup`'tan verilere erişmek istediğinizde, bunu `FormGroup`'un value özelliğine erişerek yapabilirsiniz. Form değerlerini görüntülemek için `template`'i güncelleyin:

```angular-html
...
<h2>Profile Form</h2>
<p>Name: {{ profileForm.value.name }}</p>
<p>Email: {{ profileForm.value.email }}</p>
```

</docs-step>

<docs-step title="FormGroup değerlerine erişin">
Bileşen sınıfına, daha sonra form gönderimini işlemek için kullanacağınız `handleSubmit` adında yeni bir metot ekleyin.
Bu metot formdan gelen değerleri gösterecektir, FormGroup'tan değerlere erişebilirsiniz.

Bileşen sınıfında, form gönderimini işlemek için `handleSubmit()` metodunu ekleyin.

```ts
handleSubmit() {
  alert(
    this.profileForm.value.name + ' | ' + this.profileForm.value.email
  );
}
```

</docs-step>

<docs-step title="Forma `ngSubmit` ekleyin">
Form değerlerine erişiminiz var, şimdi gönderim olayını işleme ve `handleSubmit` metodunu kullanma zamanı.
Angular'ın bu amaca özel `ngSubmit` adında bir olay işleyicisi vardır. Form gönderildiğinde `handleSubmit` metodunu çağırmak için form elementini güncelleyin.

```angular-html {highlight:[3]}
<form [formGroup]="profileForm" (ngSubmit)="handleSubmit()"></form>
```

</docs-step>

</docs-workflow>

Ve işte böylece, Angular'da reaktif formlarla nasıl çalışılacağını biliyorsunuz.

Bu aktivitede harika iş çıkardınız. Form doğrulamayı öğrenmek için devam edin.
