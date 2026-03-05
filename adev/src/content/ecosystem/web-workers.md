# Background processing using web workers

[Web worker'lar](https://developer.mozilla.org/docs/Web/API/Web_Workers_API), CPU yoğun hesaplamaları bir arka plan iş parçacığında çalıştırmanıza olanak tanıyarak ana iş parçacığını kullanıcı arayüzünü güncellemek için serbest bırakır.
Bilgisayar Destekli Tasarım \(CAD\) çizimleri oluşturma veya ağır geometrik hesaplamalar yapma gibi çok sayıda hesaplama gerçekleştiren uygulamalar, performansı artırmak için web worker'ları kullanabilir.

HELPFUL: Angular CLI, kendisinin bir web worker içinde çalıştırılmasını desteklemez.

## Adding a web worker

Mevcut bir projeye web worker eklemek için Angular CLI `ng generate` komutunu kullanın.

```shell
ng generate web-worker <location>
```

Uygulamanızın herhangi bir yerine web worker ekleyebilirsiniz.
Örneğin, kök bileşen olan `src/app/app.component.ts` dosyasına bir web worker eklemek için aşağıdaki komutu çalıştırın.

```shell
ng generate web-worker app
```

Komut aşağıdaki işlemleri gerçekleştirir.

1. Projenizi web worker'ları kullanacak şekilde yapılandırır (henüz yapılandırılmadıysa).
1. Mesajları almak için `src/app/app.worker.ts` dosyasına aşağıdaki iskelet kodunu ekler.

   ```ts {header:"src/app/app.worker.ts"}
   addEventListener('message', ({data}) => {
     const response = `worker response to ${data}`;
     postMessage(response);
   });
   ```

1. Worker'ı kullanmak için `src/app/app.component.ts` dosyasına aşağıdaki iskelet kodunu ekler.

   ```ts {header:"src/app/app.component.ts"}
   if (typeof Worker !== 'undefined') {
     // Create a new
     const worker = new Worker(new URL('./app.worker', import.meta.url));
     worker.onmessage = ({data}) => {
       console.log(`page got message: ${data}`);
     };
     worker.postMessage('hello');
   } else {
     // Web workers are not supported in this environment.
     // You should add a fallback so that your program still executes correctly.
   }
   ```

Bu başlangıç iskeleti oluşturduktan sonra, worker'a mesaj göndererek ve worker'dan mesaj alarak web worker'ı kullanmak üzere kodunuzu yeniden düzenlemelisiniz.

IMPORTANT: `@angular/platform-server` gibi [Sunucu taraflı Renderlama](guide/ssr) için kullanılan bazı ortamlar veya platformlar web worker'ları desteklemez.

Uygulamanızın bu ortamlarda çalışmasını sağlamak için, worker'ın normalde gerçekleştireceği hesaplamaları yapmak üzere bir yedek mekanizma sağlamalısınız.
