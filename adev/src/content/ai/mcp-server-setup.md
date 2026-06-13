# Angular CLI MCP Sunucusu kurulumu

Angular CLI, geliştirme ortamınızdaki yapay zeka asistanlarının Angular CLI ile etkileşime geçmesini sağlayan deneysel bir [Model Context Protocol (MCP) sunucusu](https://modelcontextprotocol.io/) içerir. CLI destekli kod üretimi, paket ekleme ve daha fazlası için destek ekledik.

## Mevcut Araçlar

Angular CLI MCP sunucusu, geliştirme iş akışınızda size yardımcı olmak için çeşitli araçlar sağlar. Varsayılan olarak, aşağıdaki araçlar etkindir:

| Ad                          | Açıklama                                                                                                                                                                                       | `local-only` | `read-only` |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: | :---------: |
| `ai_tutor`                  | Etkileşimli, yapay zeka destekli bir Angular eğitmeni başlatır. v20 veya sonraki bir sürümü kullanan yeni bir Angular projesinden çalıştırılması önerilir. [Daha fazla bilgi](ai/ai-tutor).    |      ✅      |     ✅      |
| `find_examples`             | Resmi, en iyi uygulama örneklerinden oluşan küratörlü bir veritabanından yetkili kod örnekleri bulur. **Modern, yeni ve yakın zamanda güncellenen** Angular özelliklerine odaklanır.           |      ✅      |     ✅      |
| `get_best_practices`        | Angular En İyi Uygulamalar Kılavuzunu getirir. Bu kılavuz, tüm kodun standalone bileşenler, tipli formlar ve modern kontrol akışı dahil modern standartlara uymasını sağlamak için gereklidir. |      ✅      |     ✅      |
| `list_projects`             | Bir Angular çalışma alanında tanımlanan tüm uygulama ve kütüphanelerin adlarını listeler. Projeleri belirlemek için `angular.json` yapılandırma dosyasını okur.                                |      ✅      |     ✅      |
| `onpush_zoneless_migration` | Angular kodunu analiz eder ve zone'suz bir uygulama için ön koşul olan `OnPush` değişiklik algılamaya geçiş için adım adım, yinelemeli bir plan sunar.                                         |      ✅      |     ✅      |
| `search_documentation`      | <https://angular.dev> adresindeki resmi Angular dokümantasyonunu arar. Bu araç, API'ler, eğitimler ve en iyi uygulamalar gibi Angular hakkındaki tüm soruları yanıtlamak için kullanılmalıdır. |      ❌      |     ✅      |

### Deneysel Araçlar

Bazı araçlar, yeni oldukları veya tam olarak test edilmedikleri için deneysel / önizleme durumunda sunulmaktadır. Bunları [`--experimental-tool`](#komut-seçenekleri) seçeneğiyle ayrı ayrı etkinleştirin ve dikkatli kullanın.

| Ad                         | Açıklama                                                                                                                                                                                                                                                                       | `local-only` | `read-only` |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: | :---------: |
| `build`                    | `ng build` kullanarak tek seferlik, izlenmesiz bir derleme gerçekleştirir.                                                                                                                                                                                                     |      ✅      |     ❌      |
| `devserver.start`          | `ng serve` çalıştırmaya benzer şekilde, çalışma alanındaki değişiklikleri izleyen bir geliştirme sunucusunu asenkron olarak başlatır. Asenkron olduğu için hemen döner. Oluşturulan sunucuyu yönetmek için `devserver.stop` ve `devserver.wait_for_build` araçlarını kullanın. |      ✅      |     ✅      |
| `devserver.stop`           | `devserver.start` tarafından başlatılan bir geliştirme sunucusunu durdurur.                                                                                                                                                                                                    |      ✅      |     ✅      |
| `devserver.wait_for_build` | `devserver.start` tarafından başlatılan çalışan bir geliştirme sunucusundaki en son derlemenin çıktı günlüklerini döndürür. Bir derleme devam ediyorsa, önce bu derlemenin tamamlanmasını bekler ve ardından günlükleri döndürür.                                              |      ✅      |     ✅      |
| `e2e`                      | Projede yapılandırılmış uçtan uca testleri çalıştırır.                                                                                                                                                                                                                         |      ✅      |     ✅      |
| `modernize`                | Kod geçişleri gerçekleştirir ve Angular kodunu en son en iyi uygulamalar ve sözdizimi ile uyumlu hale getirmek için nasıl modernize edileceğine dair ek talimatlar sağlar. [Daha fazla bilgi](https://angular.dev/reference/migrations)                                        |      ✅      |     ❌      |
| `test`                     | Projenin birim testlerini çalıştırır.                                                                                                                                                                                                                                          |      ✅      |     ✅      |

## Başlarken

Başlamak için terminalinizde aşağıdaki komutu çalıştırın:

```bash
ng mcp
```

Etkileşimli bir terminalden çalıştırıldığında, bu komut MCP sunucusunu kullanmak için bir ana bilgisayar ortamının nasıl yapılandırılacağına dair talimatlar görüntüler. Aşağıdaki bölümler, birçok popüler düzenleyici ve araç için örnek yapılandırmalar sağlar.

### Cursor

Projenizin kök dizininde `.cursor/mcp.json` adında bir dosya oluşturun ve aşağıdaki yapılandırmayı ekleyin. Ayrıca `~/.cursor/mcp.json` dosyasında global olarak da yapılandırabilirsiniz.

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

### Firebase Studio

Projenizin kök dizininde `.idx/mcp.json` adında bir dosya oluşturun ve aşağıdaki yapılandırmayı ekleyin:

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

### Gemini CLI

Projenizin kök dizininde `.gemini/settings.json` adında bir dosya oluşturun ve aşağıdaki yapılandırmayı ekleyin:

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

### JetBrains IDEs

JetBrains IDE'lerinde (IntelliJ IDEA veya WebStorm gibi), JetBrains AI Assistant eklentisini yükledikten sonra `Settings | Tools | AI Assistant | Model Context Protocol (MCP)` yoluna gidin. Yeni bir sunucu ekleyin (`+`) ve `As JSON` seçeneğini seçin. Ardından aşağıdaki yapılandırmayı yapıştırın:

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

MCP sunucularını yapılandırma hakkında en güncel talimatlar için lütfen JetBrains dokümantasyonuna bakın: [Connect to an MCP server](https://www.jetbrains.com/help/ai-assistant/mcp.html#connect-to-an-mcp-server).

### VS Code

Projenizin kök dizininde `.vscode/mcp.json` adında bir dosya oluşturun ve aşağıdaki yapılandırmayı ekleyin. `servers` özelliğinin kullanımına dikkat edin.

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

### Diğer IDE'ler

Diğer IDE'ler için, MCP yapılandırma dosyasının (genellikle `mcp.json`) uygun konumu hakkında IDE'nizin dokümantasyonunu kontrol edin. Yapılandırma aşağıdaki snippet'i içermelidir.

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

## Komut Seçenekleri

`mcp` komutu, IDE'nizin MCP yapılandırmasında argüman olarak iletilen aşağıdaki seçeneklerle yapılandırılabilir:

| Seçenek                       | Tür       | Açıklama                                                                                                                                                                                 | Varsayılan |
| :---------------------------- | :-------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------- |
| `--read-only`                 | `boolean` | Yalnızca projede değişiklik yapmayan araçları kaydeder. Düzenleyiciniz veya kodlama aracınız yine de düzenleme yapabilir.                                                                | `false`    |
| `--local-only`                | `boolean` | Yalnızca internet bağlantısı gerektirmeyen araçları kaydeder. Düzenleyiciniz veya kodlama aracınız yine de ağ üzerinden veri gönderebilir.                                               | `false`    |
| `--experimental-tool`<br>`-E` | `string`  | Bir [deneysel aracı](#deneysel-araçlar) etkinleştirir. Birden fazla seçeneği boşluklarla ayırın, örn. `-E tool_a tool_b`. Tüm `devserver.x` araçlarını `-E devserver` ile etkinleştirin. |            |

Örneğin, VS Code'da sunucuyu salt okunur modda çalıştırmak için `mcp.json` dosyanızı şu şekilde güncellersiniz:

```json
{
  "servers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp", "--read-only"]
    }
  }
}
```

## Geri Bildirim ve Yeni Fikirler

Angular ekibi, mevcut MCP yetenekleri ve yeni araçlar veya özellikler için fikirleriniz hakkında geri bildirimlerinizi memnuniyetle karşılar. Lütfen [angular/angular GitHub deposunda](https://github.com/angular/angular/issues) bir sorun açarak düşüncelerinizi paylaşın.
