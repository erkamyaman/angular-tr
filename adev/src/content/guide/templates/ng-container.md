# ng-container ile elemanları gruplama

`<ng-container>`, Angular'da birden fazla elemanı bir arada gruplayan veya DOM'da gerçek bir eleman işlemeden şablonda bir konum işaretleyen özel bir elemandır.

```angular-html
<!-- Bileşen şablonu -->
<section>
  <ng-container>
    <h3>User bio</h3>
    <p>Here's some info about the user</p>
  </ng-container>
</section>
```

```angular-html
<!-- İşlenmiş DOM -->
<section>
  <h3>User bio</h3>
  <p>Here's some info about the user</p>
</section>
```

Şablonunuzun bir bölümüne davranışlar veya yapılandırma eklemek için `<ng-container>`'a direktifler uygulayabilirsiniz.

Angular, `<ng-container>`'a uygulanan tüm nitelik bağlamalarını ve olay dinleyicilerini, direktifler aracılığıyla uygulananlar dahil, yok sayar.

## Dinamik içerik görüntülemek için `<ng-container>` kullanma

`<ng-container>`, dinamik içeriği işlemek için bir yer tutucu olarak görev yapabilir.

### Bileşenleri işleme

Bir bileşeni `<ng-container>`'ın konumuna dinamik olarak işlemek için Angular'ın yerleşik `NgComponentOutlet` direktifini kullanabilirsiniz.

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

Yukarıdaki örnekte, `NgComponentOutlet` direktifi `<ng-container>` elemanının konumunda `AdminProfile` veya `BasicUserProfile`'ı dinamik olarak işler.

### Şablon parçalarını işleme

Bir şablon parçasını `<ng-container>`'ın konumuna dinamik olarak işlemek için Angular'ın yerleşik `NgTemplateOutlet` direktifini kullanabilirsiniz.

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

Yukarıdaki örnekte, `ngTemplateOutlet` direktifi `<ng-container>` elemanının konumunda iki şablon parçasından birini dinamik olarak işler.

NgTemplateOutlet hakkında daha fazla bilgi için [NgTemplateOutlet API dokümantasyon sayfasına](/api/common/NgTemplateOutlet) bakın.

## Yapısal direktiflerle `<ng-container>` kullanma

`<ng-container>` elemanlarına yapısal direktifler de uygulayabilirsiniz. Bunun yaygın örnekleri arasında `ngIf` ve `ngFor` bulunur.

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

## Enjeksiyon için `<ng-container>` kullanma

Angular'ın bağımlılık enjeksiyonu sistemi hakkında daha fazla bilgi için Bağımlılık Enjeksiyonu rehberine bakın.

Bir `<ng-container>`'a direktif uyguladığınızda, alt elemanlar direktifi veya direktifin sağladığı herhangi bir şeyi enjekte edebilir. Şablonunuzun belirli bir bölümüne bildirimsel olarak bir değer sağlamak istediğinizde bunu kullanın.

```angular-ts
@Directive({
  selector: '[theme]',
})
export class Theme {
  // 'light' veya 'dark' kabul eden, varsayılan olarak 'light' olan bir giriş oluştur.
  mode = input<'light' | 'dark'>('light');
}
```

```angular-html
<ng-container theme="dark">
  <profile-pic />
  <user-bio />
</ng-container>
```

Yukarıdaki örnekte, `ProfilePic` ve `UserBio` bileşenleri `Theme` direktifini enjekte edebilir ve `mode` değerine göre stiller uygulayabilir.
