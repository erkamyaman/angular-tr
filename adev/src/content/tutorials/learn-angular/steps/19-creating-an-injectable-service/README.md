# Injectable servis oluşturma

Angular'da bağımlılık enjeksiyonu (DI), framework'ün en güçlü özelliklerinden biridir. Bağımlılık enjeksiyonunu, Angular'ın uygulamanız için çalışma zamanında ihtiyaç duyduğunuz kaynakları _sağlama_ yeteneği olarak düşünün. Bir bağımlılık, bir servis veya başka bir kaynak olabilir.

NOTE: [Temel kılavuzda bağımlılık enjeksiyonu](/essentials/dependency-injection) hakkında daha fazla bilgi edinin.

Bu aktivitede, `injectable` (enjekte edilebilir) bir servis oluşturmayı öğreneceksiniz.

<hr>

Bir servisi kullanmanın yollarından biri, veriler ve API'lerle etkileşim kurmak için bir aracı olarak görev yapmasıdır. Bir servisi yeniden kullanılabilir kılmak için mantığı servis içinde tutmalı ve ihtiyaç duyulduğunda uygulama genelinde paylaşmalısınız.

Bir servisi DI sistemi tarafından enjekte edilmeye uygun hale getirmek için `@Injectable` dekoratörünü kullanın. Örneğin:

```ts {highlight:[1,2,3]}
@Injectable({
  providedIn: 'root',
})
class UserService {
  // methods to retrieve and return data
}
```

`@Injectable` dekoratörü, DI sistemine `UserService`'in bir sınıfta talep edilmeye hazır olduğunu bildirir. `providedIn` bu kaynağın hangi kapsamda kullanılabilir olduğunu belirler. Şimdilik, `providedIn: 'root'` ifadesinin `UserService`'in tüm uygulama genelinde kullanılabilir olduğu anlamına geldiğini anlamak yeterlidir.

Pekala, siz deneyin:

<docs-workflow>

<docs-step title="`@Injectable` dekoratörünü ekleyin">
`car.service.ts` dosyasındaki kodu `@Injectable` dekoratörünü ekleyerek güncelleyin.
</docs-step>

<docs-step title="Dekoratörü yapılandırın">
Dekoratöre aktarılan nesnedeki değerler, dekoratörün yapılandırması olarak kabul edilir.
<br>
`car.service.ts` dosyasındaki `@Injectable` dekoratörünü `providedIn: 'root'` yapılandırmasını içerecek şekilde güncelleyin.

TIP: Doğru sözdizimini bulmak için yukarıdaki örneği kullanın.

</docs-step>

</docs-workflow>

Aferin, bu servis artık `injectable` (enjekte edilebilir) ve eğlenceye katılabilir. Servis artık `injectable` olduğuna göre, bir bileşene enjekte etmeyi deneyelim.
