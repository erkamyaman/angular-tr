# Inject tabanlı DI

Enjekte edilebilir bir servis oluşturmak, Angular'daki bağımlılık enjeksiyonu (DI) sisteminin ilk kısmıdır. Bir servisi bir bileşene nasıl enjekte edersiniz? Angular'ın uygun bağlamda kullanılabilecek `inject()` adında pratik bir fonksiyonu vardır.

NOTE: Enjeksiyon bağlamları bu eğitimin kapsamı dışındadır, ancak [bağımlılık enjeksiyonu (DI) temel kılavuzundan](/essentials/dependency-injection) ve [DI bağlam kılavuzundan](guide/di/dependency-injection-context) daha fazla bilgi edinebilirsiniz.

Bu aktivitede, bir servisi nasıl enjekte edeceğinizi ve bir bileşende nasıl kullanacağınızı öğreneceksiniz.

<hr>

Sınıf özelliklerini DI sistemi tarafından sağlanan değerlerle başlatmak genellikle faydalıdır. İşte bir örnek:

```ts {highlight:[3]}
@Component({...})
class PetCareDashboard {
  petRosterService = inject(PetRosterService);
}
```

<docs-workflow>

<docs-step title="`CarService`'i enjekte edin">

`app.ts` dosyasında, `inject()` fonksiyonunu kullanarak `CarService`'i enjekte edin ve `carService` adında bir özelliğe atayın.

NOTE: `carService` özelliği ile `CarService` sınıfı arasındaki farka dikkat edin.

</docs-step>

<docs-step title="`carService` örneğini kullanın">

`inject(CarService)` çağrısı, uygulamanızda kullanabileceğiniz bir `CarService` örneği verdi ve bu `carService` özelliğinde saklandı.

`display` özelliğini aşağıdaki uygulama ile başlatın:

```ts
display = this.carService.getCars().join(' ⭐️ ');
```

</docs-step>

<docs-step title="`App` şablonunu güncelleyin">

`app.ts` dosyasındaki bileşen şablonunu aşağıdaki kodla güncelleyin:

```ts
template: `<p>Car Listing: {{ display }}</p>`,
```

</docs-step>

</docs-workflow>

İlk servisinizi bir bileşene enjekte ettiniz - harika çaba.
