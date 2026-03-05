# Migration to self-closing tags

Kendinden kapanan etiketler, [v16](https://blog.angular.dev/angular-v16-is-here-4d7a28ec680d#7065)'dan beri Angular şablonlarında desteklenmektedir.

Bu şematik, uygulamanızdaki şablonları kendinden kapanan etiketler kullanacak şekilde geçirir.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```shell
ng generate @angular/core:self-closing-tag
```

#### Before

```angular-html
<hello-world></hello-world>
```

#### After

```angular-html
<hello-world />
```
