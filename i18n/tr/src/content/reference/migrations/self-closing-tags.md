<!-- source: a6fdf8e0fa0363bd13c80a6dccf5056140aada73 -->
# Kendinden kapanan etiketlere geçiş

Kendinden kapanan etiketler, [v16](https://blog.angular.dev/angular-v16-is-here-4d7a28ec680d#7065)'dan beri Angular şablonlarında desteklenmektedir.

Bu şematik, uygulamanızdaki şablonları kendinden kapanan etiketler kullanacak şekilde geçirir.

Şematiği aşağıdaki komutu kullanarak çalıştırın:

```shell
ng generate @angular/core:self-closing-tag
```

#### Önce {#before}

```angular-html
<hello-world></hello-world>
```

#### Sonra {#after}

```angular-html
<hello-world />
```
