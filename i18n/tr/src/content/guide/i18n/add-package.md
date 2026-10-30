<!-- source: c81ff0a2d7889263a56b4cdef9169386e7238df9 -->
# Yerelleştirme paketini ekleme

Angular'ın yerelleştirme özelliklerinden yararlanmak için [Angular CLI][CliMain] kullanarak `@angular/localize` paketini projenize ekleyin.

`@angular/localize` paketini eklemek için, projenizdeki `package.json` ve TypeScript yapılandırma dosyalarını güncellemek amacıyla aşağıdaki komutu kullanın.

<docs-code language="shell" path="adev/src/content/examples/i18n/doc-files/commands.sh" region="add-localize"/>

TypeScript yapılandırma dosyalarına `types: ["@angular/localize"]` ekler.
Ayrıca, tür tanımına referans olan `/// <reference types="@angular/localize" />` satırını `main.ts` dosyasının en üstüne ekler.

HELPFUL: `package.json` ve `tsconfig.json` dosyaları hakkında daha fazla bilgi için [Çalışma alanı npm bağımlılıkları][GuideNpmPackages] ve [TypeScript Yapılandırması][GuideTsConfig] bölümlerine bakın. Üçlü eğik çizgi direktifleri hakkında bilgi edinmek için [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types-) adresini ziyaret edin.

`@angular/localize` yüklü değilse ve projenizin yerelleştirilmiş bir sürümünü derlemeye çalışırsanız (örneğin, şablonlarda `i18n` niteliklerini kullanırken), [Angular CLI][CliMain] projeniz için i18n'i etkinleştirmek üzere atacağınız adımları içeren bir hata oluşturur.

## Seçenekler {#options}

| SEÇENEK            | AÇIKLAMA                                                                                                                                                                                | DEĞER TÜRÜ | VARSAYILAN VALUE |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- | :--------------- |
| `--project`        | Projenin adı.                                                                                                                                                                           | `string`   |
| `--use-at-runtime` | Ayarlanırsa, `$localize` çalışma zamanında kullanılabilir. Ayrıca `@angular/localize`, varsayılan olan `devDependencies` yerine `package.json`'ın `dependencies` bölümüne dahil edilir. | `boolean`  | `false`          |

Daha fazla mevcut seçenek için [Angular CLI][CliMain]'daki `ng add` bölümüne bakın.

## Sıradaki {#whats-next}

<docs-pill-row>
  <docs-pill href="guide/i18n/locale-id" title="Yerel ayarlara kimlik ile başvurma"/>
</docs-pill-row>

[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[GuideNpmPackages]: reference/configs/npm-packages 'Workspace npm dependencies | Angular'
[GuideTsConfig]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html 'TypeScript Configuration'
