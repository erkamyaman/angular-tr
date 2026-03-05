# Grouping elements with ng-container

`<ng-container>`, Angular'da birden fazla elemani bir arada gruplayan veya DOM'da gercek bir eleman islemeden sablonda bir konum isaretleyen ozel bir elemandir.

```angular-html
<!-- Component template -->
<section>
  <ng-container>
    <h3>User bio</h3>
    <p>Here's some info about the user</p>
  </ng-container>
</section>
```

```angular-html
<!-- Rendered DOM -->
<section>
  <h3>User bio</h3>
  <p>Here's some info about the user</p>
</section>
```

Sablonunuzun bir bolumune davranislar veya yapilandirma eklemek icin `<ng-container>`'a direktifler uygulayabilirsiniz.

Angular, `<ng-container>`'a uygulanan tum nitelik baglamalarini ve olay dinleyicilerini, direktifler araciligiyla uygulananlar dahil, yok sayar.

## Using `<ng-container>` to display dynamic contents

`<ng-container>`, dinamik icerigi islemek icin bir yer tutucu olarak gorev yapabilir.

### Rendering components

Bir bileseni `<ng-container>`'in konumuna dinamik olarak islemek icin Angular'in yerlesik `NgComponentOutlet` direktifini kullanabilirsiniz.

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngComponentOutlet]="profileComponent()" />
  `,
})
export class UserProfile {
  isAdmin = input(false);
  profileComponent = computed(() => (this.isAdmin() ? AdminProfile : BasicUserProfile));
}
```

Yukaridaki ornekte, `NgComponentOutlet` direktifi `<ng-container>` elemaninin konumunda `AdminProfile` veya `BasicUserProfile`'i dinamik olarak isler.

### Rendering template fragments

Bir sablon parcasini `<ng-container>`'in konumuna dinamik olarak islemek icin Angular'in yerlesik `NgTemplateOutlet` direktifini kullanabilirsiniz.

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngTemplateOutlet]="profileTemplate()" />

    <ng-template #admin>This is the admin profile</ng-template>
    <ng-template #basic>This is the basic profile</ng-template>
  `,
})
export class UserProfile {
  isAdmin = input(false);
  adminTemplate = viewChild('admin', {read: TemplateRef});
  basicTemplate = viewChild('basic', {read: TemplateRef});
  profileTemplate = computed(() => (this.isAdmin() ? this.adminTemplate() : this.basicTemplate()));
}
```

Yukaridaki ornekte, `ngTemplateOutlet` direktifi `<ng-container>` elemaninin konumunda iki sablon parcasindan birini dinamik olarak isler.

NgTemplateOutlet hakkinda daha fazla bilgi icin [NgTemplateOutlet API dokumantasyon sayfasina](/api/common/NgTemplateOutlet) bakin.

## Using `<ng-container>` with structural directives

`<ng-container>` elemanlarina yapisal direktifler de uygulayabilirsiniz. Bunun yaygin ornekleri arasinda `ngIf` ve `ngFor` bulunur.

```angular-html
<ng-container *ngIf="permissions == 'admin'">
  <h1>Admin Dashboard</h1>
  <admin-infographic />
</ng-container>

<ng-container *ngFor="let item of items; index as i; trackBy: trackByFn">
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
</ng-container>
```

## Using `<ng-container>` for injection

Angular'in bagimlilik enjeksiyonu sistemi hakkinda daha fazla bilgi icin Bagimlilik Enjeksiyonu rehberine bakin.

Bir `<ng-container>`'a direktif uyguladiginizda, alt elemanlar direktifi veya direktifin sagladigi herhangi bir seyi enjekte edebilir. Sablonunuzun belirli bir bolumune bildirimsel olarak bir deger saglamak istediginizde bunu kullanin.

```angular-ts
@Directive({
  selector: '[theme]',
})
export class Theme {
  // Create an input that accepts 'light' or 'dark`, defaulting to 'light'.
  mode = input<'light' | 'dark'>('light');
}
```

```angular-html
<ng-container theme="dark">
  <profile-pic />
  <user-bio />
</ng-container>
```

Yukaridaki ornekte, `ProfilePic` ve `UserBio` bilesenleri `Theme` direktifini enjekte edebilir ve `mode` degerine gore stiller uygulayabilir.
