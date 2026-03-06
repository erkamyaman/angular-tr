# Kalıtım

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okuduğunuzu varsayar. Angular'da yeniyseniz önce onu okuyun.

Angular bileşenleri TypeScript sınıflarıdır ve standart JavaScript kalıtım semantiklerine katılır.

Bir bileşen herhangi bir temel sınıfı genişletebilir:

```ts
export class ListboxBase {
  value: string;
}

@Component({
  /*...*/
})
export class CustomListbox extends ListboxBase {
  // CustomListbox `value` özelliğini miras alır.
}
```

## Diğer bileşen ve direktifleri genişletme

Bir bileşen başka bir bileşeni veya bir direktifi genişlettiğinde, temel sınıfın dekoratöründe tanımlanan bazı meta verileri ve temel sınıfın dekore edilmiş üyelerini miras alır. Bu; host bağlamalarını, girdileri, çıktıları ve yaşam döngüsü yöntemlerini içerir.

```angular-ts
@Component({
  selector: 'base-listbox',
  template: ` ... `,
  host: {
    '(keydown)': 'handleKey($event)',
  },
})
export class ListboxBase {
  value = input.required<string>();
  handleKey(event: KeyboardEvent) {
    /* ... */
  }
}

@Component({
  selector: 'custom-listbox',
  template: ` ... `,
  host: {
    '(click)': 'focusActiveOption()',
  },
})
export class CustomListbox extends ListboxBase {
  disabled = input(false);
  focusActiveOption() {
    /* ... */
  }
}
```

Yukarıdaki örnekte, `CustomListbox` ile ilişkili tüm bilgileri `ListboxBase`'den miras alır ve seçici ile şablonu kendi değerleriyle geçersiz kılar. `CustomListbox` iki girdiye (`value` ve `disabled`) ve iki olay dinleyicisine (`keydown` ve `click`) sahiptir.

Alt sınıflar, tüm atalarının girdilerinin, çıktılarının ve host bağlamalarının _birleşimiyle_ ve kendi girdileri, çıktıları ve host bağlamalarıyla sonuçlanır.

### Enjekte edilen bağımlılıkları iletme

Bir temel sınıf, constructor parametreleri olarak bağımlılıkları enjekte ediyorsa, alt sınıfın bu bağımlılıkları açıkça `super`'a iletmesi gerekir.

```ts
@Component({
  /*...*/
})
export class ListboxBase {
  constructor(private element: ElementRef) {}
}

@Component({
  /*...*/
})
export class CustomListbox extends ListboxBase {
  constructor(element: ElementRef) {
    super(element);
  }
}
```

### Yaşam döngüsü yöntemlerini geçersiz kılma

Bir temel sınıf `ngOnInit` gibi bir yaşam döngüsü yöntemi tanımlıyorsa, ayrıca `ngOnInit` uygulayan bir alt sınıf temel sınıfın uygulamasını _geçersiz kılar_. Temel sınıfın yaşam döngüsü yöntemini korumak istiyorsanız, `super` ile yöntemi açıkça çağırın:

```ts
@Component({
  /*...*/
})
export class ListboxBase {
  protected isInitialized = false;
  ngOnInit() {
    this.isInitialized = true;
  }
}

@Component({
  /*...*/
})
export class CustomListbox extends ListboxBase {
  override ngOnInit() {
    super.ngOnInit();
    /* ... */
  }
}
```
