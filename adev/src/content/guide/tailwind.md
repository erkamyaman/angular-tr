# Angular ile Tailwind CSS Kullanımı

[Tailwind CSS](https://tailwindcss.com/), HTML'inizden hiç ayrılmadan modern web siteleri oluşturmak için kullanılabilen yardımcı sınıf öncelikli bir CSS framework'üdür. Bu kılavuz, Angular projenizde Tailwind CSS'i kurma adımlarını açıklayacaktır.

## `ng add` ile Otomatik Kurulum

Angular CLI, `ng add` komutunu kullanarak Tailwind CSS'i projenize entegre etmek için basitleştirilmiş bir yol sağlar. Bu komut, gerekli paketleri otomatik olarak yükler, Tailwind CSS'i yapılandırır ve projenizin derleme ayarlarını günceller.

İlk olarak, bir terminalde Angular projenizin kök dizinine gidin ve aşağıdaki komutu çalıştırın:

```shell
ng add tailwindcss
```

Bu komut aşağıdaki işlemleri gerçekleştirir:

- `tailwindcss` ve bağımlılıklarını yükler.
- Projeyi Tailwind CSS kullanacak şekilde yapılandırır.
- Stillerinize Tailwind CSS `@import` ifadesini ekler.

`ng add tailwindcss` çalıştırdıktan sonra, bileşen şablonlarınızda Tailwind'in yardımcı sınıflarını hemen kullanmaya başlayabilirsiniz.

## Manuel Kurulum (Alternatif Yöntem)

Tailwind CSS'i manuel olarak kurmayı tercih ediyorsanız şu adımları izleyin:

### 1. Angular projesi oluşturun

Henüz kurulmuş bir projeniz yoksa ilk olarak yeni bir Angular projesi oluşturun.

```shell
ng new my-project
cd my-project
```

### 2. Tailwind CSS'i yükleyin

Ardından, Angular projenizin kök dizininde bir terminal açın ve Tailwind CSS ile bağımlılıklarını yüklemek için aşağıdaki komutu çalıştırın:

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
</docs-code-multifile>

### 3. PostCSS eklentilerini yapılandırın

Ardından, projenin dosya kökünde bir `.postcssrc.json` dosyası ekleyin.
`@tailwindcss/postcss` eklentisini PostCSS yapılandırmanıza ekleyin.

```json {header: '.postcssrc.json'}
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### 4. Tailwind CSS'i içe aktarın

Tailwind CSS'i içe aktaran bir `@import` ifadesini `./src/styles.css` dosyasına ekleyin.

```css {header: "src/styles.css"}
@import 'tailwindcss';
```

SCSS kullanıyorsanız, `./src/styles.scss` dosyasına `@use` ekleyin.

```scss {header: "src/styles.scss"}
@use 'tailwindcss';
```

### 5. Projenizde Tailwind kullanmaya başlayın

Artık uygulamanızı stilize etmek için bileşen şablonlarınızda Tailwind'in yardımcı sınıflarını kullanmaya başlayabilirsiniz. Derleme işleminizi `ng serve` ile çalıştırın ve stillendirilmiş başlığı görmelisiniz.

Örneğin, `app.html` dosyanıza aşağıdakini ekleyebilirsiniz:

```html
<h1 class="text-3xl font-bold underline">Hello world!</h1>
```

## Ek Kaynaklar

- [Tailwind CSS Belgeleri](https://tailwindcss.com/docs)
