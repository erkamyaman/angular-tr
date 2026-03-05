# Inheritance

TIP: Bu rehber, [Temel Bilgiler Rehberi](essentials)'ni zaten okudugunuzu varsayar. Angular'da yeniyseniz once onu okuyun.

Angular bilesenleri TypeScript siniflaridir ve standart JavaScript kalitim semantiklerine katilir.

Bir bilesen herhangi bir temel sinifi genisletebilir:

```ts
export class ListboxBase {
  value: string;
}

@Component({
  /*...*/
})
export class CustomListbox extends ListboxBase {
  // CustomListbox inherits the `value` property.
}
```

## Extending other components and directives

Bir bilesen baska bir bileseni veya bir direktifi genislettiginde, temel sinifin dekoratorunde tanimlanan bazi meta verileri ve temel sinifin dekore edilmis uyelerini miras alir. Bu; host baglamalarini, girdileri, ciktilari ve yasam dongusu yontemlerini icerir.

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

Yukaridaki ornekte, `CustomListbox` ile iliskili tum bilgileri `ListboxBase`'den miras alir ve secici ile sablonu kendi degerleriyle gecersiz kilar. `CustomListbox` iki girdiye (`value` ve `disabled`) ve iki olay dinleyicisine (`keydown` ve `click`) sahiptir.

Alt siniflar, tum atalarinin girdilerinin, ciktilarinin ve host baglamalarinin _birlesimiyle_ ve kendi girdileri, ciktilari ve host baglamalariyla sonuclanir.

### Forwarding injected dependencies

Bir temel sinif, constructor parametreleri olarak bagimliliklari enjekte ediyorsa, alt sinifin bu bagimliliklari acikca `super`'a iletmesi gerekir.

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

### Overriding lifecycle methods

Bir temel sinif `ngOnInit` gibi bir yasam dongusu yontemi tanimliyorsa, ayrica `ngOnInit` uygulayan bir alt sinif temel sinifin uygulamasini _gecersiz kilar_. Temel sinifin yasam dongusu yontemini korumak istiyorsaniz, `super` ile yontemi acikca cagirin:

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
