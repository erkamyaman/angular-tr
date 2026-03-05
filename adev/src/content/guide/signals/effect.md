## Effects

Sinyaller, değiştiklerinde ilgili tüketicileri bilgilendirdikleri için kullanışlıdır. Bir **effect**, bir veya daha fazla sinyal değeri değiştiğinde çalışan bir işlemdir. `effect` fonksiyonu ile bir effect oluşturabilirsiniz:

```ts
effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

Effect'ler her zaman **en az bir kez** çalışır. Bir effect çalıştığında, okunan sinyal değerlerini izler. Bu sinyal değerlerinden herhangi biri değiştiğinde, effect tekrar çalışır. Hesaplanmış sinyallere benzer şekilde, effect'ler bağımlılıklarını dinamik olarak izler ve yalnızca en son yürütmede okunan sinyalleri takip eder.

Effect'ler her zaman **asenkron olarak**, değişiklik algılama sürecinde yürütülür.

### Use cases for effects

Effect'ler başvurmanız gereken son API olmalıdır. Türetilmiş değerler için her zaman `computed()`'u ve hem türetilebilen hem de manuel olarak ayarlanabilen değerler için `linkedSignal()`'ı tercih edin. Kendinizi bir effect ile bir sinyalden diğerine veri kopyalarken buluyorsanız, bu doğruluk kaynağınızı daha yukarıya taşımanız ve bunun yerine `computed()` veya `linkedSignal()` kullanmanız gerektiğinin bir işaretidir. Effect'ler, sinyal durumunu zorunlu (imperative), sinyal olmayan API'lerle senkronize etmek için en iyisidir.

TIP: Effect'in iyi olduğu durumlar yoktur, yalnızca uygun olduğu durumlar vardır.

- Analitik veya hata ayıklama aracı olarak sinyal değerlerini günlükleme.
- Verileri farklı depolama türleri ile senkronize tutma: `window.localStorage`, oturum depolaması, çerezler vb.
- Şablon sözdizimi ile ifade edilemeyen özel DOM davranışı ekleme.
- Bir `<canvas>` öğesine, grafik kütüphanesine veya diğer üçüncü taraf kullanıcı arayüzü kütüphanesine özel render yapma.

<docs-callout critical title="When not to use effects">
Durum değişikliklerinin yayılması için effect kullanmaktan kaçının. Bu, `ExpressionChangedAfterItHasBeenChecked` hatalarına, sonsuz döngüsel güncellemelere veya gereksiz değişiklik algılama döngülerine yol açabilir.

Bunun yerine, diğer duruma bağlı durumu modellemek için `computed` sinyallerini kullanın.
</docs-callout>

### Injection context

Varsayılan olarak, bir `effect()` oluşturmayı yalnızca bir [enjeksiyon bağlamında](guide/di/dependency-injection-context) (`inject` fonksiyonuna erişiminizin olduğu yerde) yapabilirsiniz. Bu gereksinimi karşılamanın en kolay yolu, `effect`'i bir bileşen, direktif veya servis `constructor`'ı içinde çağırmaktır:

```ts
@Component({
  /*...*/
})
export class EffectiveCounter {
  readonly count = signal(0);

  constructor() {
    // Register a new effect.
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    });
  }
}
```

Constructor dışında bir effect oluşturmak için, seçenekleri aracılığıyla `effect`'e bir `Injector` iletebilirsiniz:

```ts
@Component({
  /*...*/
})
export class EffectiveCounter {
  readonly count = signal(0);
  private injector = inject(Injector);

  initializeLogging(): void {
    effect(
      () => {
        console.log(`The count is: ${this.count()}`);
      },
      {injector: this.injector},
    );
  }
}
```

### Execution of effects

Angular, effect'leri için oluşturuldukları bağlama göre iki örtük davranış tanımlar.

Bir "View Effect", bir bileşen örnekleme bağlamında oluşturulan bir `effect`'tir. Bu, bileşen enjektörlerine bağlı servisler tarafından oluşturulan effect'leri de içerir.<br>
Bir "Root Effect", bir kök düzeyinde sağlanan servis örnekleme bağlamında oluşturulur.

Her iki tür `effect`'in yürütülmesi de değişiklik algılama sürecine bağlıdır.

- "View effect'ler", ilgili bileşen değişiklik algılama süreci tarafından kontrol edilmeden _önce_ yürütülür.
- "Root effect'ler", tüm bileşenler değişiklik algılama süreci tarafından kontrol edilmeden _önce_ yürütülür.

Her iki durumda da, effect yürütülmesi sırasında effect bağımlılıklarından en az biri değiştiyse, effect değişiklik algılama sürecinde ilerlemeden önce yeniden çalışacaktır.

### Destroying effects

Bir bileşen veya direktif yok edildiğinde, Angular ilişkili tüm effect'leri otomatik olarak temizler.

Bir `effect`, ne zaman yok edileceğini etkileyen iki farklı bağlamda oluşturulabilir:

- Bir "View effect", bileşen yok edildiğinde yok edilir.
- Bir "Root effect", uygulama yok edildiğinde yok edilir.

Effect'ler bir `EffectRef` döndürür. Bir effect'i manuel olarak elden çıkarmak için ref'in `destroy` yöntemini kullanabilirsiniz. Otomatik temizlemeyi devre dışı bırakmak için bir effect oluştururken bunu `manualCleanup` seçeneği ile birleştirebilirsiniz. Artık gerekli olmadıklarında bu tür effect'leri gerçekten yok etmeye dikkat edin.

### Effect cleanup functions

Bir bileşen veya direktif yok edildiğinde, Angular ilişkili tüm effect'leri otomatik olarak temizler.
Effect'ler, effect yok edildiğinde veya ilk işlem tamamlanmadan tekrar çalıştığında iptal etmeniz gereken uzun süren işlemleri başlatabilir. Bir effect oluştururken, fonksiyonunuz isteğe bağlı olarak ilk parametresi olarak bir `onCleanup` fonksiyonunu kabul edebilir. Bu `onCleanup` fonksiyonu, effect'in bir sonraki çalışmasından önce veya effect yok edildiğinde çağrılan bir geri çağrı kaydetmenize olanak tanır.

```ts
effect((onCleanup) => {
  const user = currentUser();

  const timer = setTimeout(() => {
    console.log(`1 second ago, the user became ${user}`);
  }, 1000);

  onCleanup(() => {
    clearTimeout(timer);
  });
});
```

## Side effects on DOM elements

`effect` fonksiyonu, sinyal değişikliklerine tepki olarak kod çalıştırmak için genel amaçlı bir araçtır. Ancak Angular DOM'u güncellemeden _önce_ çalışır. Bazı durumlarda, DOM'u manuel olarak incelemeniz veya değiştirmeniz ya da doğrudan DOM erişimi gerektiren üçüncü taraf bir kütüphaneyi entegre etmeniz gerekebilir.

Bu durumlar için `afterRenderEffect` kullanabilirsiniz. `effect` gibi çalışır, ancak Angular render işlemini tamamlayıp değişikliklerini DOM'a uyguladıktan sonra çalışır.

```ts
@Component({
  /*...*/
})
export class MyFancyChart {
  chartData = input.required<ChartData>();
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  chart: ChartInstance;

  constructor() {
    // Run a single time to create the chart instance
    afterNextRender({
      write: () => {
        this.chart = initializeChart(this.canvas().nativeElement(), this.chartData());
      },
    });

    // Re-run after DOM has been updated whenever `chartData` changes
    afterRenderEffect(() => {
      this.chart.updateData(this.chartData());
    });
  }
}
```

Bu örnekte `afterRenderEffect`, üçüncü taraf bir kütüphane tarafından oluşturulan bir grafiği güncellemek için kullanılmaktadır.

TIP: DOM değişikliklerini kontrol etmek için genellikle `afterRenderEffect`'e ihtiyacınız yoktur. `ResizeObserver`, `MutationObserver` ve `IntersectionObserver` gibi API'ler mümkün olduğunda `effect` veya `afterRenderEffect` yerine tercih edilir.

### Render phases

DOM'a erişmek ve onu değiştirmek, uygulamanızın performansını etkileyebilir, örneğin çok fazla gereksiz [yeniden akış](https://developer.mozilla.org/en-US/docs/Glossary/Reflow) tetikleyerek.

Bu işlemleri optimize etmek için `afterRenderEffect`, geri çağrıları gruplamak ve optimize edilmiş bir sırada yürütmek üzere dört faz sunar.

Fazlar şunlardır:

| Phase            | Description                                                                                                                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `earlyRead`      | Use this phase to read from the DOM before a subsequent write callback, for example to perform custom layout that the browser doesn't natively support. Prefer the read phase if reading can wait. |
| `write`          | Use this phase to write to the DOM. **Never** read from the DOM in this phase.                                                                                                                     |
| `mixedReadWrite` | Use this phase to read from and write to the DOM simultaneously. Never use this phase if it is possible to divide the work among the other phases instead.                                         |
| `read`           | Use this phase to read from the DOM. **Never** write to the DOM in this phase.                                                                                                                     |

Bu fazları kullanmak, düzen bozulmalarını önlemeye yardımcı olur ve DOM işlemlerinizin güvenli ve verimli bir şekilde gerçekleştirilmesini sağlar.

`afterRender` veya `afterNextRender`'a bir `phase` özelliğine sahip bir nesne ileterek fazı belirtebilirsiniz:

```ts
afterRenderEffect({
  earlyRead: (cleanupFn) => {
    /* ... */
  },
  write: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
  mixedReadWrite: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
  read: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
});
```

CRITICAL: Fazı belirtmezseniz, `afterRenderEffect` geri çağrıları `mixedReadWrite` fazında çalıştırır. Bu, ek DOM yeniden akışlarına neden olarak uygulama performansını kötüleştirebilir.

#### Phase executions

`earlyRead` fazı geri çağrısı parametre almaz. Sonraki her faz, önceki fazın geri çağrısının dönüş değerini bir Signal olarak alır. Fazlar arasında çalışmayı koordine etmek için bunu kullanabilirsiniz.

Effect'ler aşağıdaki faz sırasında çalışır:

1. `earlyRead`
2. `write`
3. `mixedReadWrite`
4. `read`

Fazlardan biri `afterRenderEffect` tarafından izlenen bir sinyal değerini değiştirirse, etkilenen fazlar tekrar yürütülür.

#### Cleanup

Her faz, argüman olarak bir temizleme geri çağrı fonksiyonu sağlar. Temizleme geri çağrıları, `afterRenderEffect` yok edildiğinde veya faz effect'leri yeniden çalıştırılmadan önce yürütülür.

### Server-side rendering caveats

`afterRenderEffect`, `afterNextRender`/`afterEveryRender`'a benzer şekilde yalnızca istemcide çalışır.

NOTE: Bileşenlerin geri çağrı çalışmadan önce [hidrate](/guide/hydration) edildiği garanti edilmez. DOM'u ve düzeni doğrudan okurken veya yazarken dikkatli olmalısınız.
