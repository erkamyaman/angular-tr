# Angular embedded docs tutorial

- [Tutorial files](#tutorial-files)
- [Tutorials directory structure](#tutorials-directory-structure)
- [Reserved tutorials directories](#reserved-tutorials-directories)

## Tutorial files

Öğretici içerik; öğretici metin, kaynak kod ve yapılandırmadan oluşur.

### Content: `README.md`

Öğretici içerik, öğretici dizinindeki bir `README.md` dosyasında bulunmalıdır.

Örnek olarak `learn-angular` öğreticisine bakın: [`src/content/tutorials/learn-angular/intro/README.md`](/src/content/tutorials/learn-angular/intro/README.md)

### Configuration: `config.json`

Her öğretici, aşağıdaki seçeneklere sahip olabilen bir `config.json` ile tanımlanır:

- `title`: öğretici navigasyonunda kullanılan öğretici başlığını tanımlar
- `nextTutorial`: sonraki öğreticinin yolu (yalnızca `intro/` adımında)
- `src`: gömülü düzenleyicide kullanılan öğretici kaynak kodunu tanımlayan harici bir dizine olan göreceli yol
- `answerSrc`: gömülü düzenleyicide kullanılan öğretici cevabını tanımlayan harici bir dizine olan göreceli yol
- `openFiles`: düzenleyicide açılacak dosyalar dizisi
- `type`: öğreticinin nasıl sunulacağını ve hangi bileşenlerin gerekli olduğunu belirleyen tür
  - `cli`: `cli` türündeki bir öğretici yalnızca içerik ve Angular CLI ile etkileşimli bir terminal içerir
  - `editor`: kod düzenleyici, önizleme, etkileşimli terminal ve geliştirme sunucusundan gelen çıktıları içeren konsol dahil tam gömülü düzenleyici için kullanılır
  - `local`: gömülü düzenleyiciyi devre dışı bırakır ve yalnızca içeriği gösterir
  - `editor-only`: öğretici oyun alanı ve ana sayfa oyun alanı için kullanılan özel bir yapılandırma; içeriği devre dışı bırakır ve yalnızca gömülü düzenleyiciyi gösterir

### Source code

Öğretici kaynak kodu, öğretici dizinindeki `README.md` ve `config.json` dışındaki tüm dosyaları içerir.

Öğretici kaynak kodu [`common`](#common) proje dosyasına göre önceliğe sahiptir; dolayısıyla aynı göreceli yolda hem [`common`](#common) hem de öğretici dizininde bir dosya varsa, öğretici dosyası [`common`](#common) dosyasını geçersiz kılar.

## Tutorials directory structure

Bir öğretici, bir giriş ve adımlardan oluşur. Hem giriş hem de her adım kendi içeriğini, yapılandırmasını ve kaynak kodunu barındırır.

Örnek olarak `learn-angular` öğreticisi:

### Introduction

[`src/content/tutorials/learn-angular/intro`](/src/content/tutorials/learn-angular/intro)

öğreticinin girişidir ve `/tutorials/learn-angular` rotasında yer alır.

### Steps

[`src/content/tutorials/learn-angular/steps`](/src/content/tutorials/learn-angular/steps) öğretici adımlarını içeren dizindir.

`learn-angular` öğreticisinden bazı örnekler:

- [`learn-angular/steps/1-components-in-angular`](/src/content/tutorials/learn-angular/steps/1-components-in-angular): Rota `/tutorials/learn-angular/components-in-angular` olacaktır
- [`learn-angular/steps/2-updating-the-component-class`](/src/content/tutorials/learn-angular/steps/2-updating-the-component-class): Rota `/tutorials/learn-angular/updating-the-component-class` olacaktır

Her adım dizini bir sayı ile başlamalı, ardından bir tire ve adım yol adı gelmelidir.

- Sayı, adımı belirtir ve öğretici içindeki önceki ve sonraki adımı tanımlar.
- Tire bir ayırıcıdır :).
- Dizin adından alınan yol adı, adımın URL'sini tanımlar.

## Reserved tutorials directories

### `common`

Ortak proje, tüm öğreticiler tarafından yeniden kullanılan eksiksiz bir Angular projesidir. Tüm bağımlılıkları (`package.json`, `package-lock.json`), proje yapılandırmasını (`tsconfig.json`, `angular.json`) ve uygulamayı başlatmak için ana dosyaları (`index.html`, `main.ts`, `app.module.ts`) içerir.

Ortak proje çeşitli nedenlerle kullanılır:

- Öğreticilerde dosya tekrarını önlemek.
- Ortak proje dosyalarını ve bağımlılıkları yalnızca bir kez isteyerek uygulama içi performansı optimize etmek; sonraki isteklerde tarayıcı önbelleğinden yararlanmak.
- Tüm öğreticiler için tek bir `npm install` gerektirmek, böylece farklı öğreticiler ve adımlar arasında gezinirken etkileşim süresini azaltmak.
- Tüm öğreticiler için tutarlı bir ortam sağlamak.
- Her öğreticinin proje kurulumuna değil, öğretilen konuya özgü kaynak koduna odaklanmasını sağlamak.

Bakınız: [`src/content/tutorials/common`](/src/content/tutorials/common)

### `playground`

Oyun alanı, `/playground` adresindeki öğretici oyun alanı için kaynak kodunu içerir. Herhangi bir içerik barındırmamalıdır.

Bakınız: [`src/content/tutorials/playground`](/src/content/tutorials/playground)

### `homepage`

Ana sayfa, ana sayfa oyun alanı için kaynak kodunu içerir. Herhangi bir içerik barındırmamalıdır.

Bakınız: [`src/content/tutorials/homepage`](/src/content/tutorials/homepage)

## Update dependencies

Tüm öğreticilerin bağımlılıklarını güncellemek için aşağıdaki betiği çalıştırabilirsiniz

```bash
rm ./adev/src/content/tutorials/homepage/package-lock.json  ./adev/src/content/tutorials/first-app/common/package-lock.json ./adev/src/content/tutorials/learn-angular/common/package-lock.json ./adev/src/content/tutorials/playground/common/package-lock.json ./adev/src/content/tutorials/deferrable-views/common/package-lock.json

npm i --package-lock-only --prefix ./adev/src/content/tutorials/homepage
npm i --package-lock-only --prefix ./adev/src/content/tutorials/first-app/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/learn-angular/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/playground/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/deferrable-views/common
```
