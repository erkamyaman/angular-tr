# Router ağacını inceleme

**Router Tree** sekmesi, uygulamanızın yönlendirme ağacını görselleştirmenizi sağlar. Rotaların nasıl iç içe yerleştirildiğini keşfedebilir ve belirli rotalar hakkındaki ayrıntıları görüntüleyebilirsiniz.

<img src="assets/images/guide/devtools/router-tree.png" alt="A screenshot of the 'Router Tree' tab in Angular DevTools showing a tree of configured routes. The active routes are highlighted in green, while inactive ones are white.">

### Rota ayrıntılarını görüntüleme

Ağaçta belirli bir rotayı seçtiğinizde, Angular DevTools bu rotanın özelliklerini sağdaki kenar çubuğunda görüntüler. Bu bilgiler şunları içerir:

- **Path**: Rotanın URL yolu. Rota özel bir URL eşleştiricisi kullanıyorsa, DevTools bunun yerine **Matcher** değerini görüntüler.
- **Component**: Bu rota için oluşturulan bileşen. Rota bir yönlendirmeyse (redirect), DevTools bunun yerine **Redirect to** hedefini görüntüler.
- **Path Match**: Yapılandırılmışsa, yol eşleştirme stratejisi (`prefix` veya `full`).
- **Data**: Rotayla ilişkilendirilmiş statik veriler; bir JSON ağacı olarak görüntülenir.
- **Resolvers**: Rota resolver'ları; anahtar-değer çiftleri olarak görüntülenir.
- **Guards**: Rotada yapılandırılmış tüm guard'lar; türlerine göre gruplanmış şekilde — `canActivate`, `canActivateChild`, `canDeactivate` ve `canMatch`.
- **Providers**: Yapılandırılmışsa, rota düzeyindeki sağlayıcılar (providers).
- **Title**: Yapılandırılmışsa, rota başlığı.
- **RunGuardsAndResolvers**: Yapılandırılmışsa, guard'lar ve resolver'lar için yeniden çalıştırma stratejisi.
- **Active**: Bu rotanın şu anda etkin olup olmadığı.
- **Auxiliary**: Rotanın bir yardımcı (auxiliary) rota olup olmadığını belirtir (örneğin adlandırılmış bir outlet içinde).
- **Lazy**: Rotanın lazy olarak yüklenip yüklenmediğini belirtir.

Note: Path Match, Data, Resolvers, Guards, Providers, Title ve RunGuardsAndResolvers gibi özellikler kenar çubuğunda yalnızca seçili rotada yapılandırıldıklarında görünür.

### Belirli bir rotaya gitme

Doğrudan DevTools üzerinden kolayca yönlendirme tetikleyebilirsiniz. Sağdaki kenar çubuğunda bir rotanın ayrıntılarını incelerken, yol dizesinin yanındaki **Navigate** simgesine tıklayın. Bu, Angular router'ı uygulamanızda o URL'ye yönlendirmeye tetikler.

<img src="assets/images/guide/devtools/router-tree-navigate.png" alt="A screenshot showing the 'Navigate to' tooltip on the route path in the 'Routes Details' sidebar.">
