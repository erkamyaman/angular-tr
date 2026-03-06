# Service'ler oluşturma ve kullanma

Servisler, Angular uygulamanız genelinde paylaşılabilen yeniden kullanılabilir kod parçalarıdır. Genellikle veri getirme, iş mantığı veya birden fazla bileşenin erişmesi gereken diğer işlevleri yönetirler.

## Bir service oluşturma

[Angular CLI](tools/cli) ile aşağıdaki komutu kullanarak bir servis oluşturabilirsiniz:

```bash
ng generate service CUSTOM_NAME
```

Bu, `src` dizininizde özel bir `CUSTOM_NAME.ts` dosyası oluşturur.

Ayrıca bir TypeScript sınıfına `@Injectable()` dekoratörünü ekleyerek manuel olarak bir servis oluşturabilirsiniz. Bu, Angular'a servisin bir bağımlılık olarak enjekte edilebileceğini söyler.

İşte kullanıcıların veri eklemesine ve istemesine olanak tanıyan bir servis örneği:

```ts
// 📄 src/app/basic-data-store.ts
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class BasicDataStore {
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data];
  }
}
```

## Service'ler nasıl kullanılabilir hale gelir

Servisinizde `@Injectable({ providedIn: 'root' })` kullandığınızda, Angular:

- Tüm uygulamanız için **tek bir örnek** (singleton) oluşturur
- Herhangi bir ek yapılandırma olmadan **her yerde kullanılabilir** hale getirir
- **Tree-shaking'i etkinleştirir**, böylece servis yalnızca gerçekten kullanılıyorsa JavaScript paketinize dahil edilir

Bu, çoğu servis için önerilen yaklaşımdır.

## Bir service'i enjekte etme

`providedIn: 'root'` ile bir servis oluşturduktan sonra, `@angular/core`'dan `inject()` fonksiyonunu kullanarak uygulamanızın herhangi bir yerinde enjekte edebilirsiniz.

### Bir bileşene enjekte etme

```angular-ts
import {Component, inject} from '@angular/core';
import {BasicDataStore} from './basic-data-store';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>{{ dataStore.getData() }}</p>
      <button (click)="dataStore.addData('More data')">Add more data</button>
    </div>
  `,
})
export class Example {
  dataStore = inject(BasicDataStore);
}
```

### Başka bir service'e enjekte etme

```ts
import {inject, Injectable} from '@angular/core';
import {AdvancedDataStore} from './advanced-data-store';

@Injectable({
  providedIn: 'root',
})
export class BasicDataStore {
  private advancedDataStore = inject(AdvancedDataStore);
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data, ...this.advancedDataStore.getData()];
  }
}
```

## Sonraki adımlar

`providedIn: 'root'` çoğu kullanım durumunu karşılarken, Angular özel senaryolar için servisleri sağlamanın ek yollarını sunar:

- **Bileşene özgü örnekler** - Bileşenlerin kendi izole servis örneklerine ihtiyaç duyması durumunda
- **Manuel yapılandırma** - Çalışma zamanı yapılandırması gerektiren servisler için
- **Fabrika sağlayıcıları** - Çalışma zamanı koşullarına göre dinamik servis oluşturma için
- **Değer sağlayıcıları** - Yapılandırma nesneleri veya sabitler sağlamak için

Bu gelişmiş desenler hakkında daha fazla bilgiyi sonraki kılavuzda bulabilirsiniz: [bağımlılık sağlayıcılarını tanımlama](/guide/di/defining-dependency-providers).
