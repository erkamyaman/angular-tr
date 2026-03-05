# LLM prompts and AI IDE setup

Büyük dil modelleri (LLM'ler) ile kod üretmek, geliştiriciler için hızla büyüyen bir ilgi alanıdır. LLM'ler genellikle çalışan kod üretebilse de, Angular gibi sürekli gelişen framework'ler için tutarlı kod üretmek zor olabilir.

Gelişmiş talimatlar ve prompting, alan spesifik ayrıntılarla modern kod üretimini desteklemek için ortaya çıkan bir standarttır. Bu bölüm, Angular ve LLM'ler için daha doğru kod üretimini desteklemek üzere özenle hazırlanmış içerik ve kaynaklar içerir.

## Custom Prompts and System Instructions

Aşağıdaki özel, alan spesifik dosyalardan birini kullanarak LLM'lerle kod üretme deneyiminizi iyileştirin.

NOTE: Bu dosyalar, Angular'ın kurallarıyla güncel kalacak şekilde düzenli olarak güncellenecektir.

İşte LLM'lerin Angular en iyi uygulamalarını takip eden doğru kod üretmesine yardımcı olacak bir dizi talimat. Bu dosya, yapay zeka araçlarınıza sistem talimatları olarak eklenebilir veya bağlam olarak promptunuzla birlikte dahil edilebilir.

<docs-code language="md" path="packages/core/resources/best-practices.md" class="compact"/>

<a download href="/assets/context/best-practices.md" target="_blank">best-practices.md dosyasını indirmek için buraya tıklayın.</a>

## Rules Files

<a href="https://studio.firebase.google.com?utm_source=adev&utm_medium=website&utm_campaign=BUILD_WITH_AI_ANGULAR&utm_term=angular_devrel&utm_content=build_with_ai_angular_firebase_studio">Firebase Studio</a> gibi birçok düzenleyici, LLM'lere kritik bağlam sağlamak için yararlı kural dosyalarına sahiptir.

| Environment/IDE      | Rules File                                                                                                             | Installation Instructions                                                                                                                                       |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Firebase Studio      | <a download href="/assets/context/airules.md" target="_blank">airules.md</a>                                           | <a href="https://firebase.google.com/docs/studio/set-up-gemini#custom-instructions">Configure `airules.md`</a>                                                  |
| Copilot powered IDEs | <a download="copilot-instructions.md" href="/assets/context/guidelines.md" target="_blank">copilot-instructions.md</a> | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">Configure `.github/copilot-instructions.md`</a> |
| Cursor               | <a download href="/assets/context/angular-20.mdc" target="_blank">cursor.md</a>                                        | <a href="https://docs.cursor.com/context/rules" target="_blank">Configure `cursorrules.md`</a>                                                                  |
| JetBrains IDEs       | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>                                     | <a href="https://www.jetbrains.com/help/junie/customize-guidelines.html" target="_blank">Configure `guidelines.md`</a>                                          |
| VS Code              | <a download=".instructions.md" href="/assets/context/guidelines.md" target="_blank">.instructions.md</a>               | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">Configure `.instructions.md`</a>                |
| Windsurf             | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>                                     | <a href="https://docs.windsurf.com/windsurf/cascade/memories#rules" target="_blank">Configure `guidelines.md`</a>                                               |

## Angular CLI MCP Server setup

Angular CLI, geliştirme ortamınızdaki yapay zeka asistanlarının Angular CLI ile etkileşime geçmesini sağlayan deneysel bir [Model Context Protocol (MCP) sunucusu](https://modelcontextprotocol.io/) içerir.

[**Angular CLI MCP Sunucusunu nasıl kuracağınızı öğrenin**](/ai/mcp)

## Providing Context with `llms.txt`

`llms.txt`, LLM'lerin içeriklerini daha iyi anlamasına ve işlemesine yardımcı olmak için tasarlanmış web siteleri için önerilen bir standarttır. Angular ekibi, LLM'lerin ve kod üretimi için LLM kullanan araçların daha iyi modern Angular kodu oluşturmasına yardımcı olmak için bu dosyanın iki versiyonunu geliştirmiştir.

- <a href="/llms.txt" target="_blank">llms.txt</a> - anahtar dosyalara ve kaynaklara bağlantılar sağlayan bir indeks dosyası.
- <a href="/assets/context/llms-full.txt" target="_blank">llms-full.txt</a> - Angular'ın nasıl çalıştığını ve Angular uygulamalarının nasıl oluşturulacağını açıklayan daha kapsamlı derlenmiş bir kaynak seti.

Yapay zekayı Angular uygulamalarınıza nasıl entegre edeceğiniz hakkında daha fazla bilgi için [genel bakış sayfasına göz atın](/ai).

## Web Codegen Scorer

Angular ekibi, yapay zeka tarafından üretilen web kodunun kalitesini değerlendirmek ve puanlamak için bir araç olan [Web Codegen Scorer](https://github.com/angular/web-codegen-scorer)'ı geliştirdi ve açık kaynak olarak yayınladı. Bu aracı, Angular için LLM tarafından üretilen kodun doğruluğunu artırmak amacıyla promptları ince ayar yapmak gibi yapay zeka tarafından üretilen kodla ilgili kanıta dayalı kararlar almak için kullanabilirsiniz. Bu promptlar, yapay zeka araçlarınız için sistem talimatları olarak veya promptunuzla birlikte bağlam olarak eklenebilir. Ayrıca bu aracı, farklı modeller tarafından üretilen kodun kalitesini karşılaştırmak ve modeller ve ajanlar geliştikçe kaliteyi zaman içinde izlemek için de kullanabilirsiniz.
