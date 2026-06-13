# Component harness'lere genel bakış

Bir <strong>component harness</strong>, testlerin bileşenlerle son kullanıcının yaptığı gibi desteklenen bir API aracılığıyla etkileşim kurmasına olanak tanıyan bir sınıftır. Küçük yeniden kullanılabilir widget'lardan tam sayfalara kadar herhangi bir bileşen için test donanımları oluşturabilirsiniz.

Donanımlar birçok avantaj sunar:

- DOM yapısı gibi bir bileşenin uygulama ayrıntılarına karşı kendilerini izole ederek testleri daha az kırılgan hale getirirler
- Testlerin daha okunabilir ve bakımının daha kolay olmasını sağlarlar
- Birden fazla test ortamında kullanılabilirler

```ts
// MyButtonComponent adlı bir bileşen için harness ile test örneği
it('should load button with exact text', async () => {
  const button = await loader.getHarness(MyButtonComponentHarness);
  expect(await button.getText()).toBe('Confirm');
});
```

Bileşen donanımları özellikle paylaşılan UI widget'ları için kullanışlıdır. Geliştiriciler genellikle DOM yapısı ve CSS sınıfları gibi widget'ların özel uygulama ayrıntılarına bağlı testler yazarlar. Bu bağımlılıklar testleri kırılgan ve bakımı zor hale getirir. Donanımlar bir alternatif sunar - widget ile son kullanıcının yaptığı şekilde etkileşim kuran desteklenen bir API. Widget uygulama değişikliklerinin artık kullanıcı testlerini bozma olasılığı daha düşüktür. Örneğin, [Angular Material](https://material.angular.dev/components/categories) kütüphanedeki her bileşen için bir test donanımı sağlar.

Bileşen donanımları birden fazla test ortamını destekler. Aynı donanım uygulamasını hem birim hem de uçtan uca testlerde kullanabilirsiniz. Test yazarlarının yalnızca bir API öğrenmesi yeterlidir ve bileşen yazarlarının ayrı birim ve uçtan uca test uygulamalarını sürdürmesi gerekmez.

Birçok geliştirici aşağıdaki geliştirici tipi kategorilerinden biriyle sınıflandırılabilir: test yazarları, bileşen donanımı yazarları ve donanım ortamı yazarları. Bu kategorilere göre bu kılavuzdaki en ilgili bölümü bulmak için aşağıdaki tabloyu kullanın:

| Geliştirici Tipi           | Açıklama                                                                                                                                                                                                                                                                                                                 | İlgili Bölüm                                                                                    |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| Test Yazarları             | Uygulamalarını test etmek için başkası tarafından yazılmış bileşen donanımlarını kullanan geliştiriciler. Örneğin, bu bir üçüncü taraf menü bileşeni kullanan ve birim testinde menü ile etkileşim kurması gereken bir uygulama geliştiricisi olabilir.                                                                  | [Testlerde bileşen donanımlarını kullanma](guide/testing/using-component-harnesses)             |
| Bileşen donanımı yazarları | Bazı yeniden kullanılabilir Angular bileşenlerini sürdüren ve kullanıcılarının testlerinde kullanması için bir test donanımı oluşturmak isteyen geliştiriciler. Örneğin, bir üçüncü taraf Angular bileşen kütüphanesinin yazarı veya büyük bir Angular uygulaması için ortak bileşenler setini sürdüren bir geliştirici. | [Bileşenleriniz için bileşen donanımları oluşturma](guide/testing/creating-component-harnesses) |
| Donanım ortamı yazarları   | Ek test ortamlarında bileşen donanımlarının kullanımı için destek eklemek isteyen geliştiriciler. Kullanıma hazır desteklenen test ortamları hakkında bilgi için [test donanımı ortamları ve yükleyicileri](guide/testing/using-component-harnesses#test-harness-ortamları-ve-yükleyicileri) bakın.                      | [Ek test ortamları için destek ekleme](guide/testing/component-harnesses-testing-environments)  |

Tam API referansı için lütfen [Angular CDK'nın bileşen donanımı API referans sayfasına](/api#angular_cdk_testing) bakın.
