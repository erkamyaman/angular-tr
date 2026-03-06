# Kod coverage

Kod kapsam raporları, birim testleriniz tarafından düzgün şekilde test edilmemiş olabilecek kod tabanınızın herhangi bir bölümünü gösterir.

## Ön koşullar

Vitest ile kod kapsam raporları oluşturmak için `@vitest/coverage-v8` paketini yüklemeniz gerekir:

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/coverage-v8
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/coverage-v8
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/coverage-v8
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/coverage-v8
  </docs-code>
</docs-code-multifile>

## Rapor oluşturma

Bir kapsam raporu oluşturmak için `ng test` komutuna `--coverage` bayrağını ekleyin:

```shell
ng test --coverage
```

Testler çalıştıktan sonra komut, projede yeni bir `coverage/` dizini oluşturur. Kaynak kodunuzu ve kod kapsam değerlerini içeren bir rapor görmek için `index.html` dosyasını açın.

Her test ettiğinizde kod kapsam raporları oluşturmak istiyorsanız, `angular.json` dosyanızda `coverage` seçeneğini `true` olarak ayarlayabilirsiniz:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true
          }
        }
      }
    }
  }
}
```

## Kod coverage eşiklerini zorunlu kılma

Kod kapsam yüzdeleri, kodunuzun ne kadarının test edildiğini tahmin etmenize olanak tanır. Ekibiniz birim testi yapılması gereken minimum bir miktar belirlerse, bu minimumu yapılandırmanızda zorunlu kılabilirsiniz.

Örneğin, kod tabanının minimum %80 kod kapsamına sahip olmasını istediğinizi varsayalım. Bunu etkinleştirmek için `angular.json` dosyanıza `coverageThresholds` seçeneğini ekleyin:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true,
            "coverageThresholds": {
              "statements": 80,
              "branches": 80,
              "functions": 80,
              "lines": 80
            }
          }
        }
      }
    }
  }
}
```

Artık testlerinizi çalıştırdığınızda kapsamınız %80'in altına düşerse, komut başarısız olur.

## Gelişmiş yapılandırma

`angular.json` dosyanızda birkaç başka kapsam seçeneğini yapılandırabilirsiniz:

- `coverageInclude`: Kapsam raporuna dahil edilecek dosyaların glob kalıpları.
- `coverageReporters`: Kullanılacak muhabir dizisi (ör. `html`, `lcov`, `json`).
- `coverageWatermarks`: HTML muhabiri için `[düşük, yüksek]` filigranlarını belirten ve raporun renk kodlamasını etkileyebilen bir nesne.

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true,
            "coverageReporters": ["html", "lcov"],
            "coverageWatermarks": {
              "statements": [50, 80],
              "branches": [50, 80],
              "functions": [50, 80],
              "lines": [50, 80]
            }
          }
        }
      }
    }
  }
}
```
