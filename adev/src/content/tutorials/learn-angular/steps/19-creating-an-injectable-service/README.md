# Injectable servis oluşturma

Angular'da bağımlılık enjeksiyonu (DI), framework'ün en güçlü özelliklerinden biridir. Bağımlılık enjeksiyonunu, Angular'ın uygulamanız için çalışma zamanında ihtiyaç duyduğunuz kaynakları _sağlama_ yeteneği olarak düşünün. Bir bağımlılık, bir servis veya başka bir kaynak olabilir.

NOTE: [Temel kılavuzda bağımlılık enjeksiyonu](/essentials/dependency-injection) hakkında daha fazla bilgi edinin.

Bu aktivitede, `injectable` (enjekte edilebilir) bir servis oluşturmayı öğreneceksiniz.

<hr>

Bir servisi kullanmanın yollarından biri, veriler ve API'lerle etkileşim kurmak için bir aracı olarak görev yapmasıdır. Bir servisi yeniden kullanılabilir kılmak için mantığı servis içinde tutmalı ve ihtiyaç duyulduğunda uygulama genelinde paylaşmalısınız.

Bir sınıfı DI sistemi tarafından enjekte edilmeye uygun hale getirmek için `@Service` dekoratörünü kullanın. Örneğin:

```ts {highlight:[1]}
@Service()
class UserService {
  // methods to retrieve and return data
}
```

`@Service` dekoratörü sınıfı bir servis olarak işaretler ve DI sistemine `UserService`'e uygulamanızın herhangi bir yerinden erişilebileceğini bildirir. Angular, servisi varsayılan olarak uygulamanızın tamamına sağlar, bu nedenle ek bir yapılandırma yazmanıza gerek yoktur.

NOTE: `@Service` varsayılan olarak sınıfı kök enjektörde (root injector) sağlar. Servisi manuel olarak sağlamak isterseniz, örneğin belirli bir rota veya bileşenle sınırlandırmak için, `autoProvided: false` olarak ayarlayın. Daha fazla bilgi için [servis oluşturma ve kullanma kılavuzuna](guide/di/creating-and-using-services#service-ve-injectable-dekoratörlerini-kullanma) bakın.

Pekala, siz deneyin:

<docs-workflow>

<docs-step title="`@Service` dekoratörünü ekleyin">
`car.service.ts` dosyasındaki kodu `CarService` sınıfına `@Service()` dekoratörünü ekleyerek güncelleyin.

TIP: Doğru sözdizimini bulmak için yukarıdaki örneği kullanın.

</docs-step>

</docs-workflow>

Aferin, bu servis artık `injectable` (enjekte edilebilir) ve eğlenceye katılabilir. Servis artık `injectable` olduğuna göre, bir bileşene enjekte etmeyi deneyelim.
