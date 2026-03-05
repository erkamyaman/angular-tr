# Angular CLI MCP Server setup

Angular CLI, geliştirme ortamınızdaki yapay zeka asistanlarının Angular CLI ile etkileşime geçmesini sağlayan deneysel bir [Model Context Protocol (MCP) sunucusu](https://modelcontextprotocol.io/) içerir. CLI destekli kod üretimi, paket ekleme ve daha fazlası için destek ekledik.

## Available Tools

Angular CLI MCP sunucusu, geliştirme iş akışınızda size yardımcı olmak için çeşitli araçlar sağlar. Varsayılan olarak, aşağıdaki araçlar etkindir:

| Name                        | Description                                                                                                                                                                                        | `local-only` | `read-only` |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: | :---------: |
| `ai_tutor`                  | Launches an interactive AI-powered Angular tutor. Recommended to run from a new Angular project using v20 or later. [Learn more](ai/ai-tutor).                                                     |      ✅      |     ✅      |
| `find_examples`             | Finds authoritative code examples from a curated database of official, best-practice examples, focusing on **modern, new, and recently updated** Angular features.                                 |      ✅      |     ✅      |
| `get_best_practices`        | Retrieves the Angular Best Practices Guide. This guide is essential for ensuring that all code adheres to modern standards, including standalone components, typed forms, and modern control flow. |      ✅      |     ✅      |
| `list_projects`             | Lists the names of all applications and libraries defined within an Angular workspace. It reads the `angular.json` configuration file to identify the projects.                                    |      ✅      |     ✅      |
| `onpush_zoneless_migration` | Analyzes Angular code and provides a step-by-step, iterative plan to migrate it to `OnPush` change detection, a prerequisite for a zoneless application.                                           |      ✅      |     ✅      |
| `search_documentation`      | Searches the official Angular documentation at <https://angular.dev>. This tool should be used to answer any questions about Angular, such as for APIs, tutorials, and best practices.             |      ❌      |     ✅      |

### Experimental Tools

Bazı araçlar, yeni oldukları veya tam olarak test edilmedikleri için deneysel / önizleme durumunda sunulmaktadır. Bunları [`--experimental-tool`](#command-options) seçeneğiyle ayrı ayrı etkinleştirin ve dikkatli kullanın.

| Name                       | Description                                                                                                                                                                                                                                                         | `local-only` | `read-only` |
| :------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------: | :---------: |
| `build`                    | Perform a one-off, non-watched build using `ng build`.                                                                                                                                                                                                              |      ✅      |     ❌      |
| `devserver.start`          | Asynchronously starts a development server that watches the workspace for changes, similar to running `ng serve`. Since this is asynchronous it returns immediately. To manage the resulting server, use the `devserver.stop` and `devserver.wait_for_build` tools. |      ✅      |     ✅      |
| `devserver.stop`           | Stops a development server started by `devserver.start`.                                                                                                                                                                                                            |      ✅      |     ✅      |
| `devserver.wait_for_build` | Returns the output logs of the most recent build in a running development server started by `devserver.start`. If a build is currently ongoing, it will first wait for that build to complete and then return the logs.                                             |      ✅      |     ✅      |
| `e2e`                      | Executes the end-to-end tests configured in the project.                                                                                                                                                                                                            |      ✅      |     ✅      |
| `modernize`                | Performs code migrations and provides further instructions on how to modernize Angular code to align with the latest best practices and syntax. [Learn more](https://angular.dev/reference/migrations)                                                              |      ✅      |     ❌      |
| `test`                     | Runs the project's unit tests.                                                                                                                                                                                                                                      |      ✅      |     ✅      |

## Get Started

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

### Other IDEs

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

## Command Options

`mcp` komutu, IDE'nizin MCP yapılandırmasında argüman olarak iletilen aşağıdaki seçeneklerle yapılandırılabilir:

| Option                        | Type      | Description                                                                                                                                                               | Default |
| :---------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------ |
| `--read-only`                 | `boolean` | Only register tools that do not make changes to the project. Your editor or coding agent may still perform edits.                                                         | `false` |
| `--local-only`                | `boolean` | Only register tools that do not require an internet connection. Your editor or coding agent may still send data over the network.                                         | `false` |
| `--experimental-tool`<br>`-E` | `string`  | Enable an [experimental tool](#experimental-tools). Separate multiple options by spaces, e.g. `-E tool_a tool_b`. Enable all `devserver.x` tools by using `-E devserver`. |         |

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

## Feedback and New Ideas

Angular ekibi, mevcut MCP yetenekleri ve yeni araçlar veya özellikler için fikirleriniz hakkında geri bildirimlerinizi memnuniyetle karşılar. Lütfen [angular/angular GitHub deposunda](https://github.com/angular/angular/issues) bir sorun açarak düşüncelerinizi paylaşın.
