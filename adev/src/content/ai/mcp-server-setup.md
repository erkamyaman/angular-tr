# Angular CLI MCP Sunucusu

Angular CLI, yapay zeka asistanlarının (Cursor, Antigravity, JetBrains AI vb.) doğrudan Angular CLI ile etkileşime geçmesini sağlayan bir Model Context Protocol (MCP) sunucusu içerir. Kod üretimi, çalışma alanı analizi ve derleme/test çalıştırma için araçlar sağlar.

<docs-callout title="Angular AI Agent Skills ile entegrasyon">
  Ana bilgisayar ortamınız özel Agent Skills'i destekliyorsa (Antigravity gibi), Angular CLI MCP sunucusunu resmi [Angular AI Skills](https://angular.dev/ai/skills) ile birleştirebilirsiniz. Skills, ajana derin talimat düzeyinde rehberlik ve kodlama standartları sağlarken, MCP sunucusu bu yönergeleri uygulamak için eylem araçlarını (derleme, test çalıştırma ve çalışma alanı analizi gibi) sunar. Bu da eksiksiz ve güçlü bir geliştirme ajanı ortaya çıkarır.
</docs-callout>

## Başlarken

MCP sunucusunu kullanmak için, ana bilgisayar ortamınızı (IDE veya CLI) `npx @angular/cli mcp` komutunu çalıştıracak şekilde yapılandırırsınız.

<docs-tab-group>
  <docs-tab label="Antigravity IDE">
    Projenizin kök dizininde `.antigravity/mcp.json` adında bir dosya oluşturun:

    ```json
    {
      "mcpServers": {
        "angular-cli": {
          "command": "npx",
          "args": ["-y", "@angular/cli", "mcp"]
        }
      }
    }
    ```

  </docs-tab>

  <docs-tab label="Cursor">
    Proje kök dizininde `.cursor/mcp.json` oluşturun (veya `~/.cursor/mcp.json` üzerinde global olarak):

    ```json
    {
      "mcpServers": {
        "angular-cli": {
          "command": "npx",
          "args": ["-y", "@angular/cli", "mcp"]
        }
      }
    }
    ```

  </docs-tab>

  <docs-tab label="VS Code">
    `.vscode/mcp.json` oluşturun:

    ```json
    {
      "servers": {
        "angular-cli": {
          "command": "npx",
          "args": ["-y", "@angular/cli", "mcp"]
        }
      }
    }
    ```

  </docs-tab>
</docs-tab-group>

## Mevcut Araçlar (Varsayılan)

MCP sunucusu etkinleştirildiğinde, yapay zeka ajanları aşağıdaki araçlara erişebilir:

| Ad                          | Açıklama                                                                                                 |
| :-------------------------- | :------------------------------------------------------------------------------------------------------- |
| `ai_tutor`                  | Etkileşimli, yapay zeka destekli bir Angular eğitmeni başlatır.                                          |
| `devserver.start`           | Bir geliştirme sunucusunu (`ng serve`) asenkron olarak başlatır. Hemen döner.                            |
| `devserver.stop`            | Geliştirme sunucusunu durdurur.                                                                          |
| `devserver.wait_for_build`  | Çalışan bir geliştirme sunucusundaki en son derlemenin günlüklerini döndürür.                            |
| `get_best_practices`        | Angular En İyi Uygulamalar Kılavuzunu getirir (standalone bileşenler, tipli formlar vb. için kritiktir). |
| `list_projects`             | `angular.json` dosyasını okuyarak çalışma alanındaki tüm uygulama ve kütüphaneleri listeler.             |
| `onpush_zoneless_migration` | Kodu analiz eder ve `OnPush` değişiklik algılamaya (zone'suz için ön koşul) geçiş için bir plan sunar.   |
| `run_target`                | Yapılandırılmış bir hedefi çalıştırır (ör. build, test, lint, e2e, deploy).                              |
| `search_documentation`      | `https://angular.dev` adresindeki resmi dokümantasyonu arar.                                             |

## Yaygın İş Akışları

Bu iş akışları, yapay zeka asistanlarının karmaşık geliştirici senaryolarını otomatik olarak gerçekleştirmek için farklı MCP araçlarını nasıl koordine ettiğini gösterir.

### 1. Performans Ayarlaması: Zone'suz & OnPush Geçişi

Yapay zeka ajanı, değişiklik algılama performansını optimize eder ve bileşenleri zone'suza hazır bir duruma geçirir.

1. **Çalışma Alanını Keşfet**: Yapay zeka ajanı, çalışma alanındaki bileşenleri, projeleri ve stil/test yapılandırmalarını bulmak için `list_projects` çağırır.
2. **Schematic Modernizasyonu (Ön Koşul)**: Yapay zeka ajanı, standart `ng generate` komutlarını kullanarak gerekli sinyal geçişlerini çalıştırır (ör. Signal Inputs, Signal Queries).
3. **Geçişi Planla**: Yapay zeka ajanı, dizinin veya bileşen dosyasının mutlak yolu ile `onpush_zoneless_migration` çağırır.
4. **Değişiklikleri Uygula**: Yapay zeka ajanı, aracın döndürdüğü tek uygulanabilir değişikliği otomatik olarak kod tabanına uygular.
5. **Değişiklikleri Doğrula**: Yapay zeka ajanı, target parametresini `"test"` olarak ayarlayıp `run_target` çağırarak birim testlerini çalıştırır.
6. **Tekrarla**: Yapay zeka ajanı, sonraki adımı almak için `onpush_zoneless_migration` çağırır ve araç geçişin tamamlandığını belirtene kadar bunu tekrarlar.

### 2. Özellik Geliştirme & TDD Döngüsü

Yapay zeka ajanı, yeni özellikler geliştirirken araştırma, uygulama ve doğrulamayı otomatikleştirir.

1. **API & Sözdizimi Araştırması**: Yapay zeka ajanı, Angular API'lerini veya sözdizimi kurallarını aramak için `search_documentation` kullanır (ör. `@defer` blok seçenekleri).
2. **Kodlama Standartlarını Yükle**: Yapay zeka ajanı, Angular sürümüyle uyumlu kodlama kurallarını yüklemek için çalışma alanı yolu ile `get_best_practices` çağırır.
3. **Yerel Geliştirme Sunucusunu Başlat**: Yapay zeka ajanı, `devserver.start` çağırarak arka planda bir sunucu başlatır.
4. **Derlemeyi İzle**: Yapay zeka ajanı, kodu düzenlerken derleme günlüklerini izlemek ve derlemenin başarılı olduğundan emin olmak için `devserver.wait_for_build` kullanır.
5. **Test Yaz ve Çalıştır**: Yapay zeka ajanı, `list_projects` aracılığıyla projenin test çerçevesini (ör. Jasmine, Jest, Vitest) belirler, ilgili test dosyasını yazar ve `run_target` ile `"test"` kullanarak testleri çalıştırır.
6. **Geliştirme Sunucusunu Durdur**: İşi bittiğinde, yapay zeka ajanı `devserver.stop` çağırarak etkin geliştirme sunucusunu durdurur.

### 3. Geliştirici Adaptasyonu ve Öğrenme

Yapay zeka ajanı, geliştiriciyi etkileşimli bir sandbox içinde Angular kavramlarında yönlendirir.

1. **Projeleri Keşfet**: Yapay zeka ajanı, çalışma alanını taramak ve kod tabanı yapısını belirlemek için `list_projects` çağırır.
2. **Eğitmeni Başlat**: Yapay zeka ajanı, müfredat talimatlarını, personayı ve eğitim yönergelerini yüklemek için `ai_tutor` çalıştırır.
3. **Müfredatı İzle**: Yapay zeka ajanı, kullanıcıyı müfredat boyunca yönlendirir, kavramları açıklar ve hangi bileşenleri oluşturacaklarını veya değiştireceklerini söyler.
4. **Uygula & Doğrula**: Yapay zeka ajanı, sandbox kodunu uygulamaya yardımcı olur ve değişiklikleri `run_target` ile `"test"` veya `"build"` kullanarak doğrular.

## Komut Seçenekleri

Yapılandırmanızın `args` dizisinde MCP sunucusuna argümanlar iletebilirsiniz:

- `--read-only`: Yalnızca projeyi değiştirmeyen araçları kaydeder.
- `--local-only`: Yalnızca internet bağlantısı gerektirmeyen araçları kaydeder.

Salt okunur mod için örnek:

```json
"args": ["-y", "@angular/cli", "mcp", "--read-only"]
```
