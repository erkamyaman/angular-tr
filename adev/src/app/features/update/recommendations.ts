/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

export enum ApplicationComplexity {
  Basic = 1,
  Medium = 2,
  Advanced = 3,
}

export interface Step {
  step: string;
  action: string;
  possibleIn: number;
  necessaryAsOf: number;
  level: ApplicationComplexity;
  angularCLI?: boolean;
  ngUpgrade?: boolean;
  pwa?: boolean;
  material?: boolean;
  renderedStep?: string;
  windows?: boolean;
}

export const RECOMMENDATIONS: Step[] = [
  {
    possibleIn: 200,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Basic,
    step: 'Extends OnInit',
    action:
      '`extends OnInit` kullanmadığınızdan veya herhangi bir yaşam döngüsü olayıyla `extends` kullanmadığınızdan emin olun. Bunun yerine `implements <yaşam döngüsü olayı>` kullanın.',
  },
  {
    possibleIn: 200,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Advanced,
    step: 'Deep Imports',
    action:
      "Derin içe aktarmaları kullanmayı bırakın, bu semboller artık ɵ ile işaretlenmiştir ve genel API'mizin bir parçası değildir.",
  },
  {
    possibleIn: 200,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Advanced,
    step: 'invokeElementMethod',
    action:
      '`Renderer.invokeElementMethod` kullanmayı bırakın çünkü bu metot kaldırılmıştır. Şu anda bir alternatifi yoktur.',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Basic,
    step: 'Non Animations Module',
    action:
      "Uygulamanızda animasyon kullanıyorsanız, `@angular/platform-browser/animations` paketinden `BrowserAnimationsModule` modülünü uygulama `NgModule`'ünüze aktarmalısınız.",
  },
  {
    possibleIn: 400,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Medium,
    step: 'Native Form Validation',
    action:
      'Angular, `FormsModule` dahil edildiğinde form elemanlarına `novalidate` özniteliği eklemeye başladı. Yerel form davranışlarını yeniden etkinleştirmek için `ngNoForm` kullanın veya `ngNativeValidate` ekleyin.',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Advanced,
    step: 'RootRenderer',
    action: '`RootRenderer` yerine `RendererFactoryV2` kullanın.',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Advanced,
    ngUpgrade: true,
    step: 'downgradeInjectable',
    action: '`upgrade/static/downgradeInjectable` dönüş değeri değişmiştir.',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 400,
    level: ApplicationComplexity.Advanced,
    step: 'Animations Tests',
    action:
      'Animasyonlar ve testler kullanıyorsanız, `TestBed.initTestEnvironment` çağrınıza `mods[1].NoopAnimationsModule` ekleyin.',
  },
  {
    possibleIn: 200,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Advanced,
    step: 'DefaultIterableDiffer',
    action:
      '`DefaultIterableDiffer`, `KeyValueDiffers#factories` veya `IterableDiffers#factories` kullanmayı bırakın',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Basic,
    step: 'Template Tag',
    action: '`template` etiketlerinizi `ng-template` olarak yeniden adlandırın',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Medium,
    step: 'OpaqueToken',
    action: 'Tüm `OpaqueToken` kullanımlarını `InjectionToken` ile değiştirin.',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Advanced,
    step: 'DifferFactory',
    action: '`DifferFactory.create(...)` çağırıyorsanız `ChangeDetectorRef` argümanını kaldırın.',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Advanced,
    step: 'ErrorHandler Parameter',
    action: 'ErrorHandler yapıcısına herhangi bir argüman geçirmeyi bırakın',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Advanced,
    step: 'ngProbeToken',
    action:
      "ngProbeToken kullanıyorsanız, @angular/platform-browser yerine @angular/core'dan içe aktardığınızdan emin olun",
  },
  {
    possibleIn: 400,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Advanced,
    step: 'TrackByFn',
    action: 'TrackByFn kullanıyorsanız, bunun yerine TrackByFunction kullanın',
  },
  {
    possibleIn: 500,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Basic,
    step: 'i18n Pipe Change',
    action:
      "Tarih, para birimi, ondalık veya yüzde pipe'larına bağımlıysanız, 5. sürümde formatta küçük değişiklikler göreceksiniz. en-us dışındaki yerel ayarları kullanan uygulamalar için `@angular/common/i18n_data/locale_fr` paketinden ilgili yerel ayarı ve isteğe bağlı olarak `locale_extended_fr` modülünü içe aktarıp registerLocaleData(local) çağırmanız gerekecektir.",
  },
  {
    possibleIn: 500,
    necessaryAsOf: 500,
    level: ApplicationComplexity.Advanced,
    step: 'gendir',
    action:
      '`gendir`\'e bağımlı olmayın, bunun yerine `skipTemplateCodeGen` kullanmayı değerlendirin. <a href=https://github.com/angular/angular/issues/19339#issuecomment-332607471" target="_blank">Daha Fazla Bilgi</a>',
  },
  {
    possibleIn: 220,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    ngUpgrade: true,
    step: 'Dynamic ngUpgrade',
    action:
      '`@angular/upgrade` paketinden içe aktarılan `downgradeComponent`, `downgradeInjectable`, `UpgradeComponent` ve `UpgradeModule` kullanımlarını değiştirin. Bunun yerine `@angular/upgrade/static` içindeki yeni sürümleri kullanın',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Medium,
    step: 'Animations in Core',
    action:
      "@angular/core'dan herhangi bir animasyon servisi veya aracı içe aktarıyorsanız, bunları @angular/animations'dan içe aktarmalısınız",
  },
  {
    possibleIn: 400,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'ngOutletContext',
    action: '`ngOutletContext` yerine `ngTemplateOutletContext` kullanın.',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'collectionChangeRecord',
    action: '`CollectionChangeRecord` yerine `IterableChangeRecord` kullanın',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    step: 'Renderer',
    action: 'Renderer kullandığınız her yerde artık Renderer2 kullanın',
  },
  {
    possibleIn: 400,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'Router Query Params',
    action: 'preserveQueryParams kullanıyorsanız, bunun yerine queryParamsHandling kullanın',
  },
  {
    possibleIn: 430,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'Http',
    action:
      "Eski `HttpModule` ve `Http` servisini kullanıyorsanız, `HttpClientModule` ve `HttpClient` servisine geçin. HttpClient varsayılan kullanımı basitleştirir (artık JSON'a dönüştürmeniz gerekmez) ve artık tipli dönüş değerleri ile interceptor'ları destekler. Daha fazla bilgi için [angular.dev](https://angular.dev/guide/http) adresini ziyaret edin.",
  },
  {
    possibleIn: 430,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'DOCUMENT in @angular/platform-browser',
    action:
      "@angular/platform-browser'dan DOCUMENT kullanıyorsanız, bunu @angular/common'dan içe aktarmaya başlamalısınız",
  },
  {
    possibleIn: 500,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'ReflectiveInjector',
    action: 'ReflectiveInjector kullandığınız her yerde artık StaticInjector kullanın',
  },
  {
    possibleIn: 500,
    necessaryAsOf: 550,
    level: ApplicationComplexity.Medium,
    step: 'Whitespace',
    action:
      "v6'da varsayılan olarak `off` olarak ayarlanan bu ayarın avantajlarından yararlanmak için `tsconfig.json` dosyanızda `angularCompilerOptions` anahtarı altında `preserveWhitespaces` için `off` değerini seçin.",
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    step: 'node 8',
    action:
      '<a href="http://www.hostingadvice.com/how-to/update-node-js-latest-version/" target="_blank">Node 8 veya üstünü</a> kullandığınızdan emin olun',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    windows: false,
    step: 'Update to CLI v6',
    action:
      'Angular CLI\'nizi güncelleyin ve aşağıdaki komutu çalıştırarak yapılandırmayı <a href="https://github.com/angular/angular-cli/wiki/angular-workspace" target="_blank">yeni angular.json formatına</a> taşıyın:<br/><br/>`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@6 update @angular/cli@6`<br/>',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    windows: true,
    step: 'Update to CLI v6',
    action:
      'Angular CLI\'nizi güncelleyin ve aşağıdaki komutu çalıştırarak yapılandırmayı <a href="https://github.com/angular/angular-cli/wiki/angular-workspace" target="_blank">yeni angular.json formatına</a> taşıyın:<br/><br/>`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@6 update @angular/cli@6 @angular/core@6"`<br/>',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Medium,
    step: 'cli v6 scripts',
    action:
      '`package.json` dosyanızdaki `scripts` bölümünü en son Angular CLI komutlarını kullanacak şekilde güncelleyin. Tüm CLI komutları artık POSIX uyumlu olması için bayraklar için iki tire kullanır (örn. `ng build --prod --source-map`).',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    windows: false,
    step: 'Update to Angular v6',
    action:
      "Tüm Angular framework paketlerinizi v6'ya ve RxJS ile TypeScript'in doğru sürümüne güncelleyin.<br/><br/>`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@6 update @angular/core@6`<br/><br/>Güncelleme sonrasında TypeScript ve RxJS, uygulamanız genelinde türleri daha doğru şekilde aktaracaktır ve bu, uygulamanızın tür tanımlarındaki mevcut hataları ortaya çıkarabilir",
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    windows: true,
    step: 'Update to Angular v6',
    action:
      'Tüm Angular framework paketlerinizi v6\'ya ve RxJS ile TypeScript\'in doğru sürümüne güncelleyin.<br/><br/>`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@6 update @angular/cli@6 @angular/core@6"`<br/><br/>Güncelleme sonrasında TypeScript ve RxJS, uygulamanız genelinde türleri daha doğru şekilde aktaracaktır ve bu, uygulamanızın tür tanımlarındaki mevcut hataları ortaya çıkarabilir',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'forms v6',
    action:
      "Angular Forms'da, `AbstractControl#markAsPending` çağırdığınızda `AbstractControl#statusChanges` artık `PENDING` olayı yayınlar. `statusChanges`'dan gelen olayları filtreliyorsanız veya kontrol ediyorsanız, `markAsPending` çağırırken yeni olayı hesaba kattığınızdan emin olun.",
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Advanced,
    step: 'animations timing',
    action:
      "Devre dışı bırakılmış bir Zone içinde `AnimationEvent`'ten totalTime kullanıyorsanız, artık 0 zamanı bildirmeyecektir. Bir animasyon olayının devre dışı bırakılmış bir animasyonu bildirip bildirmediğini tespit etmek için bunun yerine `event.disabled` özelliğini kullanabilirsiniz.",
  },
  {
    possibleIn: 600,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Advanced,
    step: 'ngModel on form control',
    action:
      "Reaktif form direktifleriyle ngModel giriş özelliği ve ngModelChange olayını kullanma desteği v6'da kullanımdan kaldırılmış ve v7'de kaldırılmıştır.",
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Medium,
    step: 'ngModelChange order',
    action:
      'ngModelChange artık beklentilere daha iyi uyması için kontrolün değeri/geçerliliği güncellenmeden önce değil, güncellendikten sonra yayınlanır. Bu olayların sırasına bağımlıysanız, bileşeninizde eski değeri takip etmeye başlamanız gerekecektir.',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    windows: false,
    material: true,
    step: 'Update Dependencies for v6',
    action:
      "Angular Material'i en son sürüme güncelleyin.<br/><br/>`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@6 update @angular/material@6`<br/><br/>Bu, kullanımdan kaldırılmış API'leri de otomatik olarak taşıyacaktır.",
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Basic,
    windows: true,
    material: true,
    step: 'Update Dependencies for v6',
    action:
      'Angular Material\'i en son sürüme güncelleyin.<br/><br/>`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@6 update @angular/material@6"`<br/><br/>Bu, kullanımdan kaldırılmış API\'leri de otomatik olarak taşıyacaktır.',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 600,
    level: ApplicationComplexity.Medium,
    step: 'strictPropertyInitializer',
    action:
      'TypeScript\'i katı (strict) olarak yapılandırdıysanız (`tsconfig.json` dosyanızda `strict` değerini `true` olarak ayarladıysanız), `tsconfig.json` dosyanızda `strictPropertyInitialization` seçeneğini devre dışı bırakın veya özellik başlatma işlemini `ngOnInit`\'ten yapıcıya taşıyın. Bu bayrak hakkında daha fazla bilgiyi <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html#strict-class-initialization">TypeScript 2.7 sürüm notlarında</a> bulabilirsiniz.',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    step: 'update to RxJS 6',
    action:
      '<a href="https://github.com/ReactiveX/rxjs-tslint" target="_blank">rxjs-tslint otomatik güncelleme kurallarını</a> kullanarak kullanımdan kaldırılmış RxJS 5 özelliklerini kaldırın<br/><br/>Çoğu uygulama için bu, aşağıdaki iki komutu çalıştırmak anlamına gelir:<br/><br/>`npx rxjs-tslint`<br/>`rxjs-5-to-6-migrate -p src/tsconfig.app.json`',
  },
  {
    possibleIn: 600,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Medium,
    step: 'remove rxjs-compat',
    action:
      "Siz ve tüm bağımlılıklarınız RxJS 6'ya güncellendikten sonra `rxjs-compat` paketini kaldırın.",
  },
  {
    possibleIn: 610,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Medium,
    step: 'use files instead of versionedFiles',
    action:
      'Angular Service Worker kullanıyorsanız, `versionedFiles` öğelerini `files` dizisine taşıyın. Davranış aynıdır.',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    step: 'TypeScript 3.1',
    action:
      'Angular artık TypeScript 3.1 kullanıyor, olası uyumsuz değişiklikler hakkında daha fazla bilgi edinin: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-1.html',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    step: 'Node 10',
    action: 'Angular artık Node 10 desteği eklemiştir: https://nodejs.org/en/blog/release/v10.0.0/',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    windows: false,
    step: 'v7 update',
    action:
      "Terminalinizde `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@7 update @angular/cli@7 @angular/core@7` komutunu çalıştırarak çekirdek framework ve CLI'yi v7'ye güncelleyin.",
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    windows: true,
    step: 'v7 update',
    action:
      'Terminalinizde `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@7 update @angular/cli@7 @angular/core@7"` komutunu çalıştırarak çekirdek framework ve CLI\'yi v7\'ye güncelleyin.',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    windows: false,
    material: true,
    step: 'v7 material update',
    action:
      "Terminalinizde `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@7 update @angular/material@7` komutunu çalıştırarak Angular Material'i v7'ye güncelleyin. Uygulamanızı boyutlandırma ve düzen değişiklikleri açısından test etmelisiniz.",
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Basic,
    windows: true,
    material: true,
    step: 'v7 material update',
    action:
      'Terminalinizde `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@7 update @angular/material@7"` komutunu çalıştırarak Angular Material\'i v7\'ye güncelleyin. Uygulamanızı boyutlandırma ve düzen değişiklikleri açısından test etmelisiniz.',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 700,
    level: ApplicationComplexity.Medium,
    material: true,
    step: 'v7 material changes',
    action:
      'Ekran görüntüsü testleri kullanıyorsanız, birçok küçük görsel düzenleme yapıldığı için ekran görüntüsü referans dosyalarınızı yeniden oluşturmanız gerekecektir.',
  },
  {
    possibleIn: 700,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v7 material deprecations',
    action:
      'Dalgalanmalar (ripple) için `matRippleSpeedFactor` ve `baseSpeedFactor` kullanmayı bırakın, bunun yerine Animasyon yapılandırmasını kullanın.',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    windows: false,
    step: 'v8 update',
    action:
      "Terminalinizde `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@8 update @angular/cli@8 @angular/core@8` komutunu çalıştırarak çekirdek framework ve CLI'yi sürüm 8'e güncelleyin, ardından değişiklikleri gözden geçirip commit edin.",
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    windows: true,
    step: 'v8 update',
    action:
      'Terminalinizde `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@8 update @angular/cli@8 @angular/core@8"` komutunu çalıştırarak çekirdek framework ve CLI\'yi sürüm 8\'e güncelleyin, ardından değişiklikleri gözden geçirip commit edin.',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'use ::ng-deep instead of /deep/',
    action:
      'Stillerinizde `/deep/` yerine `::ng-deep` kullanın, [angular bileşen stilleri ve ::ng-deep hakkında daha fazla bilgi edinin](https://angular.io/guide/component-styles#deprecated-deep--and-ng-deep). `/deep/` ve `::ng-deep` her ikisi de kullanımdan kaldırılmıştır ancak gölge delici alt öğe birleştiricisi tarayıcılar ve araçlardan [tamamen kaldırılana](https://www.chromestatus.com/features/6750456638341120) kadar `::ng-deep` kullanmak tercih edilir.',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'TypeScript 3.4',
    action:
      'Angular artık TypeScript 3.4 kullanıyor, [geliştirilmiş tür denetiminden kaynaklanabilecek hatalar hakkında daha fazla bilgi edinin](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html).',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'node 10',
    action:
      '<a href="http://www.hostingadvice.com/how-to/update-node-js-latest-version/" target="_blank">Node 10 veya üstünü</a> kullandığınızdan emin olun.',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'Differential Loading',
    action:
      "CLI'nin build komutu artık otomatik olarak minimum polyfill'lerle modern bir ES2015 derlemesi ve eski tarayıcılar için uyumlu bir ES5 derlemesi oluşturur ve tarayıcıya göre uygun dosyayı yükler. `tsconfig.json` dosyanızda `target` değerini `es5` olarak ayarlayarak bu değişikliği devre dışı bırakabilirsiniz. Daha fazla bilgi için [angular.io](https://angular.io/guide/deployment#differential-loading) adresini ziyaret edin.",
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'CLI Telemetry',
    action:
      "CLI'nin yeni sürümlerini kullanırken, CLI kullanım verilerinizi paylaşmayı kabul etmek isteyip istemediğiniz sorulacaktır. Kendi Google Analytics hesabınızı da ekleyebilirsiniz. Bu, hangi CLI özelliklerine öncelik vereceğimiz konusunda daha iyi kararlar almamızı ve iyileştirmelerimizin etkisini ölçmemizi sağlar. Daha fazla bilgi için [angular.io](https://angular.io/analytics) adresini ziyaret edin.",
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    step: 'static query timing',
    action:
      "`ViewChild` veya `ContentChild` kullanıyorsanız, geliştiricilere daha fazla kontrol sağlamak için bu sorguları çözme şeklimizi güncelliyoruz. Artık sonuçlar ayarlanmadan önce değişiklik algılamanın çalışması gerektiğini belirtmeniz gerekir. Örnek: `@ContentChild('foo', {static: false}) foo !: ElementRef;`. `ng update` sorgularınızı otomatik olarak güncelleyecektir ancak uyumluluk için sorgularınızı `static` yapma tarafında hata yapacaktır. Daha fazla bilgi için [angular.io](https://angular.io/guide/static-query-migration) adresini ziyaret edin.",
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    windows: false,
    material: true,
    step: 'v8 material update',
    action:
      "Terminalinizde `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@8 update @angular/material@8` komutunu çalıştırarak Angular Material'i sürüm 8'e güncelleyin.",
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Basic,
    windows: true,
    material: true,
    step: 'v8 material update',
    action:
      'Terminalinizde `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@8 update @angular/material@8"` komutunu çalıştırarak Angular Material\'i sürüm 8\'e güncelleyin.',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'deep imports',
    action:
      '`@angular/material` yerine belirli bileşenden derinlemesine içe aktarmalısınız. Örn. `@angular/material/button`. `ng update` bunu sizin için otomatik olarak yapacaktır.',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    step: 'new loadChildren',
    action:
      "Router üzerinden tembel yüklenen modüller için [dinamik içe aktarma kullandığınızdan](https://angular.io/guide/deprecations#loadchildren-string-syntax) emin olun. String ile içe aktarma v9'da kaldırılmıştır. `ng update` bunu otomatik olarak halletmelidir. Daha fazla bilgi için [angular.io](https://angular.io/guide/deprecations#loadchildren-string-syntax) adresini ziyaret edin.",
  },
  {
    possibleIn: 800,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    step: 'platform deprecated',
    action:
      "CLI ile uyumsuz olduğu için `@angular/platform-webworker` desteğini kullanımdan kaldırıyoruz. Angular'ın render mimarisini bir web worker'da çalıştırmak geliştirici ihtiyaçlarını karşılamadı. Yine de Angular ile web worker'ları kullanabilirsiniz. [Web worker rehberimizde](https://v9.angular.io/guide/web-worker) daha fazla bilgi edinin. Buna ihtiyaç duyduğunuz kullanım senaryolarınız varsa devrel@angular.io adresinden bize bildirin!",
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Advanced,
    step: 'node-sass',
    action:
      'Yerel Sass derleyicisinden JavaScript derleyicisine geçtik. Yerel sürüme geri dönmek için devDependency olarak yükleyin: `npm install node-sass --save-dev`.',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 800,
    level: ApplicationComplexity.Advanced,
    step: 'schematics async',
    action:
      "Kendi Schematics'lerinizi oluşturuyorsanız, bunlar daha önce *potansiyel olarak* asenkrondu. 8.0 itibarıyla tüm schematics'ler asenkron olacaktır.",
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    step: 'node 10.13',
    action:
      '<a href="http://www.hostingadvice.com/how-to/update-node-js-latest-version/" target="_blank">Node 10.13 veya üstünü</a> kullandığınızdan emin olun.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    windows: false,
    step: 'cli v8 latest',
    action:
      '`@angular/core` ve `@angular/cli` paketlerinin en son 8.x sürümüne güncellemek için çalışma alanı dizininizde `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@8 update @angular/core@8 @angular/cli@8` komutunu çalıştırın ve bu değişiklikleri kaydedin.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    windows: true,
    step: 'cli v8 latest',
    action:
      '`@angular/core` ve `@angular/cli` paketlerinin en son 8.x sürümüne güncellemek için çalışma alanı dizininizde `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@8 update @angular/cli@8 @angular/core@8"` komutunu çalıştırın ve bu değişiklikleri kaydedin.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Medium,
    step: 'create commits',
    action:
      'Her bir taşıma işlemi için ayrı bir git commit oluşturmak üzere [ng update](https://angular.io/cli/update) komutlarına isteğe bağlı olarak `--create-commits` (veya `-C`) bayrağını geçirebilirsiniz.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    windows: false,
    step: 'ng update v9',
    action:
      "Sizi Angular sürüm 9'a güncellemesi gereken `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@9 update @angular/core@9 @angular/cli@9` komutunu çalıştırın.",
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    windows: true,
    step: 'ng update v9',
    action:
      'Sizi Angular sürüm 9\'a güncellemesi gereken `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@9 update @angular/cli@9 @angular/core@9"` komutunu çalıştırın.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    step: 'typescript 3.8',
    action:
      "Projeniz artık TypeScript 3.8'e güncellendi. Kodunuzda düzeltmeniz gerekebilecek yeni derleyici kontrolleri ve hatalar hakkında daha fazla bilgi için [TypeScript 3.7](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html) veya [TypeScript 3.8](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html) duyurularını okuyun.",
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    windows: false,
    material: true,
    step: 'update @angular/material',
    action:
      '`NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@9 update @angular/material@9` komutunu çalıştırın.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    windows: true,
    material: true,
    step: 'update @angular/material',
    action:
      '`cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@9 update @angular/material@9"` komutunu çalıştırın.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    windows: false,
    step: 'update @nguniversal/hapi-engine',
    action:
      'Angular Universal kullanıyorsanız, kullandığınız motora bağlı olarak `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@9 update @nguniversal/hapi-engine@9` veya `NG_DISABLE_VERSION_CHECK=1 npx @angular/cli@9 update @nguniversal/express-engine@9` komutunu çalıştırın. Üçüncü taraf bağımlılıklarınızdan herhangi biri eş bağımlılıklarının Angular sürümünü güncellemediyse, bu adım `--force` bayrağı gerektirebilir.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    windows: true,
    step: 'update @nguniversal/hapi-engine',
    action:
      'Angular Universal kullanıyorsanız, kullandığınız motora bağlı olarak `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@9 update @nguniversal/hapi-engine@9"` veya `cmd /C "set "NG_DISABLE_VERSION_CHECK=1" && npx @angular/cli@9 update @nguniversal/express-engine@9"` komutunu çalıştırın. Üçüncü taraf bağımlılıklarınızdan herhangi biri eş bağımlılıklarının Angular sürümünü güncellemediyse, bu adım `--force` bayrağı gerektirebilir.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    step: 'dependencies update',
    action:
      'Projeniz diğer Angular kütüphanelerine bağlıysa, bunları en son sürümlerine güncellemenizi öneririz. Bazı durumlarda bu güncelleme, API uyumsuzluklarını çözmek için gerekli olabilir. Güncel olmayan kütüphanelerinizi öğrenmek için `ng update` veya `npm outdated` komutlarına başvurun.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Basic,
    step: 'ivy update',
    action:
      "Sürüm 9'a güncelleme sırasında, kod tabanınızdan uyumsuz veya kullanımdan kaldırılmış API çağrılarını kaldırmak için projeniz kod taşımaları aracılığıyla gerektiği şekilde dönüştürüldü. Artık bu değişiklikleri inceleyebilir ve değişiklikler hakkında daha fazla bilgi edinmek için [Sürüm 9'a güncelleme kılavuzu](https://v9.angular.io/guide/updating-to-version-9)na başvurabilirsiniz.",
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Medium,
    step: 'stylesUpdate',
    action:
      'Bağlı CSS stilleri ve sınıfları daha önce "son değişiklik kazanır" stratejisiyle uygulanıyordu, ancak artık tanımlanmış bir öncelik sırasını takip etmektedir. [Stil Önceliği](https://angular.io/guide/attribute-binding#styling-precedence) hakkında daha fazla bilgi edinin.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    step: 'ModuleWithProviders',
    action:
      'Bir kütüphane yazarıysanız ve `ModuleWithProviders` döndüren bir metodunuz varsa (genellikle `forRoot()` adlı bir metot aracılığıyla), genel türü belirtmeniz gerekecektir. [angular.io](https://v9.angular.io/guide/deprecations#modulewithproviders-type-without-a-generic) adresinden daha fazla bilgi edinin',
  },
  {
    possibleIn: 800,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    step: 'wtf',
    action:
      "Angular'da web izleme çerçevesi desteği sürüm 8'de kullanımdan kaldırılmıştır. Tüm `wtf*` API'lerini kullanmayı bırakmalısınız. Performans izleme için [tarayıcı performans araçları](https://developers.google.com/web/tools/lighthouse/audits/user-timing) kullanmanızı öneririz.",
  },
  {
    possibleIn: 800,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Medium,
    step: 'es5browser',
    action:
      '`angular.json` dosyanızdaki tüm `es5BrowserSupport` bayraklarını kaldırın ve `tsconfig.json` dosyanızda `target` değerini `es2015` olarak ayarlayın. Angular artık ES5 derlemesinin gerekip gerekmediğini belirlemek için browserslist dosyanızı kullanmaktadır. `ng update` sizi otomatik olarak taşıyacaktır.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Medium,
    step: 'ngForm selector',
    action:
      'Angular Formları oluşturmak için `ngForm` eleman seçicisini kullanıyorsanız, bunun yerine `ng-form` kullanmalısınız.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    step: 'typings compilation',
    action:
      'Derlenen dosyaları sınırlamak için `tsconfig.app.json` dosyasını güncelledik. Derlemeye dahil edilen diğer dosyalara (örneğin `typings.d.ts` dosyası) bağımlıysanız, bunu derlemeye manuel olarak eklemeniz gerekir.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'debug',
    action:
      'Angular 9 ile Ivy artık varsayılan işleme motorudur. Ortaya çıkabilecek uyumluluk sorunları için [Ivy uyumluluk kılavuzu](https://v9.angular.io/guide/ivy-compatibility)nu okuyun.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 900,
    level: ApplicationComplexity.Advanced,
    step: 'express-universal-server',
    action:
      "Angular Universal'ı `@nguniversal/express-engine` veya `@nguniversal/hapi-engine` ile kullanıyorsanız, birkaç yedek dosya oluşturulacaktır. Bunlardan biri `server.ts` içindir. Bu dosya varsayılandan farklıysa, `server.ts.bak` dosyasından `server.ts` dosyasına bazı değişiklikleri manuel olarak kopyalamanız gerekebilir.",
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Basic,
    step: 'ivy i18n',
    action:
      "Angular 9, Angular'ın uluslararasılaştırma (i18n) özelliğine bağımlıysanız yüklenmesi gereken global bir `$localize()` fonksiyonu tanıttı. Gerekli paketleri ve kod değişikliklerini eklemek için `ng add @angular/localize` komutunu çalıştırın. Değişiklikler hakkında daha fazla bilgi edinmek için [$localize Global Import Taşıma kılavuzu](https://v9.angular.io/guide/migration-localize)na başvurun.",
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'entryComponents',
    action:
      'Uygulama projelerinizde `entryComponents` NgModules tanımlarını ve `ANALYZE_FOR_ENTRY_COMPONENTS` kullanımlarını kaldırabilirsiniz. Ivy derleyicisi ve çalışma zamanı ile bunlar artık gerekli değildir. View Engine uygulaması tarafından tüketilecek bir kütüphane oluşturuyorsanız bunları korumanız gerekebilir.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'testbed-get',
    action:
      '`TestBed.get` kullanıyorsanız, bunun yerine `TestBed.inject` kullanmalısınız. Bu yeni metot aynı davranışa sahiptir ancak tür güvenlidir.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: '$localize',
    action:
      "[Angular'ın i18n desteğini](http://angular.io/guide/i18n) kullanıyorsanız, `@angular/localize` kullanmaya başlamanız gerekecektir. [$localize Global Import Taşıması](https://v9.angular.io/guide/migration-localize) hakkında daha fazla bilgi edinin.",
  },

  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Basic,
    step: 'v10 NodeJS 12',
    action:
      '<a href="https://nodejs.org/dist/latest-v12.x/" target="_blank">Node 12 veya üstünü</a> kullandığınızdan emin olun.',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Basic,
    step: 'ng update v10',
    action:
      "Sizi Angular sürüm 10'a güncellemesi gereken `npx @angular/cli@10 update @angular/core@10 @angular/cli@10` komutunu çalıştırın.",
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`npx @angular/cli@10 update @angular/material@10` komutunu çalıştırın.',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Basic,
    step: 'browserlist',
    action:
      'Yeni projeler `browserslist` yerine `.browserslistrc` dosya adını kullanır. `ng update` sizi otomatik olarak taşıyacaktır.',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'v10-versions',
    action:
      'Angular artık `tslint` v6, `tslib` v2 ve [TypeScript 3.9](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html) gerektirmektedir. `ng update` sizi otomatik olarak taşıyacaktır.',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'styleext',
    action:
      'Angular şemalarınızda `styleext` veya `spec` kullanmayı bırakın. `ng update` sizi otomatik olarak taşıyacaktır.',
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'classes-without-decorators',
    action:
      "Sürüm 10'da, Angular özelliklerini kullanan ancak Angular dekoratörü olmayan sınıflar artık desteklenmemektedir.  [Daha fazla bilgi](https://v10.angular.io/guide/migration-undecorated-classes).  `ng update` sizi otomatik olarak taşıyacaktır.",
  },
  {
    possibleIn: 900,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'injectable-definitions',
    action:
      'Angular 9 itibarıyla, DI için @Injectable dekoratörlerinin uygulanması daha katıdır ve eksik sağlayıcı tanımları farklı davranır. [Daha fazla bilgi](https://v9.angular.io/guide/migration-injectable). `ng update` sizi otomatik olarak taşıyacaktır.',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'closure-jsdoc-comments',
    action:
      "Angular'ın NPM paketleri artık closure derleyicisi ile kullanım için gerekli olan jsdoc yorumlarını içermemektedir (son derece nadir). Bu destek deneyseldi ve yalnızca bazı kullanım durumlarında çalışıyordu. Yakında önerilen alternatif bir yol duyurulacaktır.",
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'forms-number-input',
    action:
      'Angular formları kullanıyorsanız, `number` türündeki girdiler artık [change olaylarını](https://developer.mozilla.org/docs/Web/API/HTMLElement/change_event) dinlememektedir (bu olaylar değerdeki her değişiklik için tetiklenmeyebilir), bunun yerine [input olaylarını](https://developer.mozilla.org/docs/Web/API/HTMLElement/input_event) dinlemektedir. ',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'forms-length-input',
    action:
      'Angular form doğrulaması için `minLength` ve `maxLength` doğrulayıcıları artık form kontrolünün değerinin sayısal bir length özelliğine sahip olup olmadığını kontrol etmekte ve yalnızca bu durumda uzunluk doğrulaması yapmaktadır.',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'esm5-bundles',
    action:
      "[Angular Paket Formatı](https://g.co/ng/apf), `esm5` ve `fesm5` formatlarını kaldırmak için güncellendi. Bunlar artık npm paketlerimizde dağıtılmamaktadır. CLI kullanmıyorsanız, Angular kodunu kendiniz ES5'e dönüştürmeniz gerekebilir.",
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'console-errors',
    action:
      'Bilinmeyen öğelerle ilgili uyarılar artık hata olarak günlüğe kaydedilmektedir. Bu uygulamanızı bozmayacaktır, ancak `console.error` aracılığıyla hiçbir şeyin günlüğe kaydedilmemesini bekleyen araçları etkileyebilir.',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'router-resolver-empty',
    action:
      '`EMPTY` döndüren herhangi bir çözümleyici navigasyonu iptal edecektir. Navigasyonun devam etmesine izin vermek istiyorsanız, çözümleyicileri bir değer yayacak şekilde güncellemeniz gerekecektir (örneğin `defaultIfEmpty(...)`, `of(...)` vb.).',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'sw-vary-headers',
    action:
      "Angular service worker kullanıyorsanız ve [Vary](https://developer.mozilla.org/docs/Web/HTTP/Headers/Vary) başlıklarına sahip kaynaklara bağımlıysanız, tarayıcılar arasında öngörülemeyen davranışları önlemek için bu başlıklar artık yok sayılmaktadır. Bunu önlemek için service worker'ınızı bu kaynakları önbelleğe almayacak şekilde [yapılandırın](https://angular.io/guide/service-worker-config).",
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Medium,
    step: 'expression-changed-after-checked-new',
    action:
      '`async` pipe kullanırken daha önce tespit edilmeyen `ExpressionChangedAfterItHasBeenChecked` hataları görebilirsiniz. Bu hata daha önce fark edilmemiş olabilir çünkü kontrol amacıyla iki `WrappedValues`, sarılmış değerleri farklı olsa bile tüm durumlarda "eşit" kabul ediliyordu. Sürüm 10\'da `WrappedValue` kaldırılmıştır.',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'property-binding-change-detection',
    action:
      '`[val]=(observable | async).someProperty` gibi bir özellik bağlamanız varsa, `someProperty` değeri önceki yayınla aynıysa bu artık değişiklik algılamayı tetiklemeyecektir. Buna bağımlıysanız, ya manuel olarak abone olup gerektiğinde `markForCheck` çağırın ya da referansın değişmesini sağlamak için bağlamayı güncelleyin.',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'day-periods-crossing-midnight',
    action:
      '`formatDate()` veya `DatePipe` ve `b` veya `B` format kodlarından herhangi birini kullanıyorsanız, mantık gece yarısını kapsayan bir gün dilimine denk gelen zamanlarla eşleşecek şekilde güncellendi, böylece artık İngilizce durumunda `night` gibi doğru çıktıyı oluşturacaktır.',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Advanced,
    step: 'urlmatcher-null',
    action:
      '`UrlMatcher` kullanıyorsanız, tür artık her zaman `null` döndürebileceğini yansıtmaktadır.',
  },
  {
    possibleIn: 1000,
    necessaryAsOf: 1000,
    level: ApplicationComplexity.Basic,
    step: 'v10-more-details',
    action:
      'Kullanımdan kaldırmalar, otomatik taşımalar ve değişiklikler hakkında daha fazla ayrıntı için [angular.io kılavuzu](https://v10.angular.io/guide/updating-to-version-10)nu ziyaret edin',
  },
  {
    possibleIn: 1020,
    necessaryAsOf: 1020,
    level: ApplicationComplexity.Medium,
    step: 'universal-baseurl',
    action:
      'Angular Universal kullanıcıları için, `platform-server` kurulumunda `useAbsoluteUrl` kullanıyorsanız, artık `baseUrl` değerini de belirtmeniz gerekmektedir.',
  },

  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Basic,
    step: 'v11 ng update',
    action:
      "Sizi Angular sürüm 11'e güncellemesi gereken `ng update @angular/core@11 @angular/cli@11` komutunu çalıştırın.",
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@11` komutunu çalıştırın.',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Basic,
    step: 'v11 versions',
    action:
      'Angular artık [TypeScript 4.0](https://devblogs.microsoft.com/typescript/announcing-typescript-4-0/) gerektirmektedir. `ng update` sizi otomatik olarak taşıyacaktır.',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Basic,
    step: 'v11 browser support',
    action:
      'IE9, IE10 ve IE mobile desteği kaldırılmıştır. Bu, [v10 güncellemesinde](http://blog.angular.dev/version-10-of-angular-now-available-78960babd41#c357) duyurulmuştu. ',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'webpack5 optin',
    action:
      'Artık Yarn kullanarak ve `package.json` dosyanıza `"resolutions": {"webpack": "^5.0.0"}` ekleyerek webpack 5 kullanmayı tercih edebilirsiniz.',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'ng new strict prompt',
    action:
      'Yeni projeler oluştururken katı modunu etkinleştirmek isteyip istemediğiniz sorulacaktır. Bu, TypeScript ve Angular derleyicisini daha katı tür denetimi için yapılandıracak ve varsayılan olarak daha küçük paket bütçeleri uygulayacaktır. İstemi atlamak için `--strict=true` veya `--strict=false` kullanabilirsiniz.',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 router relativeLinkResolution',
    action:
      "Yönlendirici kullanıyorsanız, `relativeLinkResolution` varsayılan değeri `legacy`'den `corrected`'a değiştirilmiştir. Uygulamanız daha önce `ExtraOptions`'da bir değer belirtmeden varsayılanı kullanıyorsa ve boş yol rotalarının alt öğelerinden gezinirken göreli bağlantılar kullanıyorsa, `RouterModule` yapılandırmanızı `relativeLinkResolution` için özellikle `legacy` belirtecek şekilde güncellemeniz gerekecektir. Daha fazla ayrıntı için [belgelere](https://v11.angular.io/api/router/ExtraOptions#relativeLinkResolution) bakın.",
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'router initialNavigation',
    action:
      "Angular Yönlendiricisinde, `initialNavigation` için v4'te kullanımdan kaldırılan seçenekler kaldırılmıştır. Daha önce `enabled` veya `true` kullandıysanız, şimdi `enabledNonBlocking` veya `enabledBlocking` seçin. Daha önce `false` veya `legacy_disabled` kullandıysanız, şimdi `disabled` kullanın.",
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'routerlink preserveQueryParams',
    action:
      'Angular Yönlendiricisinin `routerLink` özelliğinde `preserveQueryParams` kaldırılmıştır, bunun yerine `queryParamsHandling="preserve"` kullanın.',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'routerlink queryParams typing',
    action:
      '`routerLink` öğesinin `queryParams`, `fragment` veya `queryParamsHandling` değerlerine erişiyorsanız, `undefined` ve `null` değerlerini de kabul edecek şekilde tür tanımını gevşetmeniz gerekebilir.',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'viewencapsulation native removed',
    action:
      'Bileşen görünüm kapsülleme seçeneği `ViewEncapsulation.Native` kaldırılmıştır. Bunun yerine `ViewEncapsulation.ShadowDom` kullanın. `ng update` sizi otomatik olarak taşıyacaktır.',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'ICU expressions typechecked',
    action:
      'i18n kullanıyorsanız, International Components for Unicode (ICU) ifadeleri içindeki ifadeler artık tekrar tür denetiminden geçirilmektedir. Bir ICU içinde görünen ifadelerde hatalar bulunursa bu derleme hatalarına neden olabilir. ',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'forms validators asyncValidators typing',
    action:
      '`@angular/forms` paketindeki direktifler, yapıcılarındaki beklenen `validators` ve `asyncValidators` argümanları için `any[]` türüne sahipti. Artık bu argümanlar düzgün şekilde türlendirildi, bu nedenle kodunuz form direktiflerinin yapıcı türlerine bağlıysa, tür güvenliğini artırmak için bazı güncellemeler gerekebilir.',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'forms AbstractFormControl',
    action:
      'Angular Forms kullanıyorsanız, `AbstractFormControl.parent` türü artık null içermektedir. `ng update` sizi otomatik olarak taşıyacaktır, ancak kodunuzun parent değerini katı eşitlikle undefined ile test ettiği nadir bir durumda, bunu `=== null` olarak değiştirmeniz gerekecektir, çünkü parent artık undefined bırakılmak yerine açıkça `null` ile başlatılmaktadır.',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'platform-webworker',
    action:
      "Nadiren kullanılan `@angular/platform-webworker` ve `@angular/platform-webworker-dynamic` paketleri v8'de kullanımdan kaldırılmıştı ve artık tamamen kaldırılmıştır. Angular'ın bir kısmını web worker içinde çalıştırma denemesi, yaygın kullanım senaryolarında hiçbir zaman iyi sonuç vermedi. Angular hâlâ [Web Workers](https://angular.io/guide/web-worker) için mükemmel destek sunmaktadır. ",
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 slice pipe typing',
    action:
      "`slice` pipe'ı artık tanımsız (undefined) giriş değeri için null döndürmektedir; bu davranış çoğu pipe ile tutarlıdır.",
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 keyvalue typing',
    action:
      "`keyvalue` pipe'ı, sayısal anahtarlara sahip giriş nesneleri için sonuç türünün anahtarların string temsilini içereceğini bildirmek üzere düzeltildi. Bu zaten böyleydi ve kod yalnızca bunu yansıtacak şekilde güncellendi. Hatalı türlere bağımlı olan pipe çıktı tüketicilerini lütfen güncelleyin. Bunun, giriş değerlerinin `Map` olduğu kullanım senaryolarını etkilemediğini unutmayın; bu nedenle `number` değerlerini korumanız gerekiyorsa, bu etkili bir yöntemdir.",
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 number pipe typing',
    action:
      "Sayı pipe'ları (`decimal`, `percent`, `currency`, vb.) artık hangi türlerin kabul edildiğini açıkça belirtmektedir.",
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 date pipe typing',
    action: "`date` pipe'ı artık hangi türlerin kabul edildiğini açıkça belirtmektedir.",
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 datetime rounding',
    action:
      "Milisaniyenin kesirlerini içeren bir biçimde `DatePipe`'a tarih-saat biçimli bir string geçirildiğinde, milisaniyeler artık en yakın milisaniyeye yuvarlanmak yerine her zaman aşağı yuvarlanacaktır. Çoğu uygulama bu değişiklikten etkilenmeyecektir. Bu istenen davranış değilse, string'i `DatePipe`'a geçirmeden önce milisaniye kısmını yuvarlamak için ön işleme yapmayı düşünün.",
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 async pipe typing',
    action:
      "`async` pipe'ı artık undefined olarak tanımlanan bir giriş için undefined döndürdüğünü iddia etmemektedir. Kodun aslında undefined girişlerde null döndürdüğünü unutmayın.",
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'v11 case pipe update',
    action:
      "`uppercase` ve `lowercase` pipe'ları artık falsy değerleri geçirmemektedir. Artık hem `null` hem de `undefined` değerlerini `null` olarak eşler ve geçersiz girişlerde (`0`, `false`, `NaN`) istisna fırlatır. Bu davranış diğer Angular pipe'ları ile tutarlıdır.",
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 router NavigationExtras typing',
    action:
      "Router'ı `NavigationExtras` ile kullanıyorsanız, yeni tür tanımlamaları `NavigationExtras` türünde bir değişkenin geçirilmesine izin verir, ancak yalnızca bilinen özellikler belirtebilecekleri için nesne literallerine izin vermez. Ayrıca `Pick` içindekilerle ortak özellikleri olmayan türleri de kabul etmez. Bu değişiklikten etkileniyorsanız, yalnızca ilgili fonksiyon çağrılarında gerçekten kullanılan NavigationExtras özelliklerini belirtin veya nesne ya da değişken üzerinde tür doğrulaması kullanın: `as NavigationExtras`.",
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'v11 TestBed.overrideProvider',
    action:
      'Testlerinizde TestBed başlatıldıktan sonra `TestBed.overrideProvider` çağırırsanız, sağlayıcı geçersiz kılmaları artık uygulanmamaktadır. Bu davranış diğer geçersiz kılma yöntemleriyle (örneğin `TestBed.overrideDirective`, vb.) tutarlıdır, ancak onlar bunu belirtmek için bir hata fırlatır. Bu kontrol daha önce TestBed.overrideProvider fonksiyonunda eksikti. Bu hatayı görürseniz, `TestBed.overrideProvider` çağrılarını TestBed başlatılması tamamlanmadan önceye taşımalısınız.',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'v11 router RouteReuseStrategy',
    action:
      "Router'ın RouteReuseStrategy'sini kullanıyorsanız, argüman sırası değişmiştir. Daha önce alt rotalar değerlendirilirken `RouteReuseStrategy#shouldReuseRoute` çağrıldığında, `future` ve `current` argümanları ters sırada geçiriliyordu. `RouteReuseStrategy`'niz özellikle yalnızca gelecek (future) veya mevcut (current) anlık görüntü durumuna bağlıysa, `shouldReuseRoute` uygulamanızın `future` ve `current` `ActivateRouteSnapshots` kullanımını güncellemeniz gerekebilir.",
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 locale data readonly',
    action:
      'Yerel ayar veri dizilerini kullanıyorsanız, bu API artık salt okunur (readonly) diziler döndürecektir. Bunları değiştiriyorsanız (örneğin `sort()`, `push()`, `splice()`, vb. çağırarak) kodunuz artık derlenmeyecektir. Diziyi değiştirmeniz gerekiyorsa, artık bir kopya almalı (örneğin `slice()` çağırarak) ve kopyayı değiştirmelisiniz.',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Advanced,
    step: 'v11 CollectionChangeRecord',
    action:
      'Değişiklik algılamada `CollectionChangeRecord` kaldırılmıştır, bunun yerine `IterableChangeRecord` kullanın.',
  },
  {
    possibleIn: 1100,
    necessaryAsOf: 1100,
    level: ApplicationComplexity.Medium,
    step: 'v11 forms async validators',
    action:
      "Angular Forms'u `FormControl`, `FormGroup` veya `FormArray` sınıf örneklerinde başlatma zamanında tanımlanan asenkron doğrulayıcılarla kullanıyorsanız, asenkron doğrulayıcı tamamlandığında durum değişikliği olayı daha önce yayılmıyordu. Bu, durum olayının `statusChanges` observable'ına yayılması için değiştirilmiştir. Kodunuz eski davranışa bağımlıysa, bu ek durum değişikliği olayını filtreleyebilir/yok sayabilirsiniz.",
  },

  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Basic,
    step: 'v12 ng update',
    action:
      "Angular'ın 12. sürümüne geçmenizi sağlayacak olan `ng update @angular/core@12 @angular/cli@12` komutunu çalıştırın.",
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@12` komutunu çalıştırın.',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Basic,
    step: 'v12 versions',
    action:
      'Angular artık [TypeScript 4.2](https://devblogs.microsoft.com/typescript/announcing-typescript-4-2/) gerektirmektedir. `ng update` sizi otomatik olarak güncelleyecektir.',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Basic,
    step: 'v12 browser support',
    action:
      "IE11 desteği kullanımdan kaldırılmıştır. Ayrıntıları [IE11 kaldırma RFC'sinde](https://github.com/angular/angular/issues/41840) bulabilirsiniz.",
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Basic,
    step: 'v12 minimum  Node.js version',
    action: "Artık Angular'ı Node.js 10 veya daha eski sürümlerle kullanamazsınız",
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Medium,
    step: 'v12 `XhrFactory` relocation',
    action:
      "`XhrFactory` import'unu `@angular/common/http` yerine `@angular/common` olarak değiştirin.",
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Medium,
    step: 'v12 i18n message ids',
    action:
      'Eski i18n mesaj kimliklerine bağımlıysanız, `localize-migrate` aracını kullanarak [bunlardan uzaklaşın](https://angular.io/guide/migration-legacy-message-id).',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Medium,
    step: 'v12 deprecates `emitDistinctChangesOnly`',
    action:
      "`@ContentChildren` ve `@ViewChildren` sorgularını yapılandırmak için `emitDistinctChangesOnly` kullanıyorsanız, önceki davranışıyla uyumlu olması için değerini `false` olarak güncellemeniz gerekebilir. v12'de `emitDistinctChangesOnly` varsayılan değeri `true`'dur ve gelecek sürümlerde gereksiz değişikliklerin tetiklenmesini önlemek için bu yapılandırma seçeneğini kaldıracağız.",
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Medium,
    step: 'v12 prod by default',
    action:
      'Varsayılan olarak üretim derlemelerini etkinleştirmek için isteğe bağlı taşımayı çalıştırabilirsiniz: `ng update @angular/cli@12 --migrate-only production-by-default`.',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 min and max form attributes',
    action:
      'Angular forms kullanıyorsanız, `<input type="number">` üzerindeki `min` ve `max` öznitelikleri artık doğrulama mantığını tetikleyecektir.',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 `emitEvent` in `FormArray` and `FormGroup`',
    action:
      'Uygulamanızda `FormArray` veya `FormGroup` sınıflarını genişleten ve yukarıda belirtilen yöntemleri geçersiz kılan özel sınıflar varsa, uygulamanızı güncellemeniz gerekebilir',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 zone.js minimum version',
    action:
      "zone.js'u 0.11.4 sürümüne güncelleyin. `ng update` bu bağımlılığı otomatik olarak güncelleyecektir.",
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 `HttpParams` method params update',
    action:
      '`HttpParams` sınıfını genişletiyorsanız, parametre türlerindeki değişiklikleri yansıtmak için metodunun imzasını güncellemeniz gerekebilir.',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 `routerLinkActiveOptions`',
    action:
      '`RouterLinkActive` bileşeninin `routerLinkActiveOptions` özelliği artık daha spesifik bir türe sahiptir. Değişikliklere uyum sağlamak için bu özelliğe erişen kodu güncellemeniz gerekebilir.',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 `APP_INITIALIZER` callback types',
    action:
      'Başlatıcı geri çağırma fonksiyonları artık daha spesifik dönüş türlerine sahiptir. `Injector.get` veya `TestBed.inject` aracılığıyla bir `APP_INITIALIZER` örneği alıyorsanız kodunuzu güncellemeniz gerekebilir.',
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 fragment typings',
    action:
      "Yönlendirici parçaları artık `null` olabilir. TypeScript'ın tür hatalarıyla başarısız olmasını önlemek için `null` kontrolleri ekleyin.",
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 `ng.getDirectives`',
    action:
      "`ng.getDirectives`'in belirli bir DOM düğümüyle ilişkili bir direktif bulamadığında hata fırlatmasına güvenmediğinizden emin olun.",
  },
  {
    possibleIn: 1200,
    necessaryAsOf: 1200,
    level: ApplicationComplexity.Advanced,
    step: 'v12 `optimization.styles.inlineCritical`',
    action:
      'angular.json dosyanızdaki `optimization.styles.inlineCritical` seçeneğini kontrol edin. Artık varsayılan olarak `true` değerindedir. Tüm `optimization` seçeneğinin boolean olarak ayarlanabileceğini ve bunun tüm alt seçenekleri varsayılanlara ayarlayacağını unutmayın.',
  },

  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Basic,
    step: 'v13 ng update',
    action:
      "Angular'ın 13. sürümüne geçmenizi sağlayacak olan `ng update @angular/core@13 @angular/cli@13` komutunu çalıştırın.",
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@13` komutunu çalıştırın.',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Basic,
    step: 'TypeScript 4.4',
    action:
      'Angular artık TypeScript 4.4 kullanıyor, olası kırılma değişiklikleri hakkında daha fazla bilgi edinin: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-4.html',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Basic,
    step: 'v13 node',
    action:
      '<a href="http://www.hostingadvice.com/how-to/update-node-js-latest-version/" target="_blank">Node 12.20.0 veya üstünü</a> kullandığınızdan emin olun',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Medium,
    step: 'v13 routerLink',
    action:
      "Artık `undefined` ve `null` geçirerek bir `routerLink`'in gezinmesini devre dışı bırakabilirsiniz. Daha önce `routerLink` direktifi bu iki değeri boş bir dizeye eşdeğer olarak kabul ediyordu.",
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Medium,
    step: 'v13 router loadChildren',
    action:
      "Artık `loadChildren`'a bir string değer atayarak tembel yüklenen rotaları belirtemezsiniz. Dinamik ESM import ifadelerine geçtiğinizden emin olun.",
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Medium,
    step: 'v13 service worker activated',
    action:
      "`SwUpdate`'ın `activated` observable'ı artık kullanımdan kaldırılmıştır. Bir service worker'ın etkinleştirme durumunu kontrol etmek için bunun yerine `activatedUpdate` metodunu kullanın.",
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Medium,
    step: 'v13 service worker available',
    action:
      "`SwUpdate`'ın `available` observable'ı artık kullanımdan kaldırılmıştır. Aynı bilgiyi almak için `versionUpdates` kullanın ve yalnızca `VersionReadyEvent` olaylarını filtreleyin.",
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Medium,
    step: 'v13 renderModuleFactory',
    action:
      "`@angular/platform-server`'daki `renderModuleFactory` artık Ivy ile gerekli değildir. Bunun yerine `renderModule` kullanın.",
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Advanced,
    step: 'v13 forms status',
    action:
      '`AbstractControl.status` türünü `FormControlStatus` olarak ve `AbstractControl.statusChanges` türünü `Observable<FormControlStatus>` olarak daralttık. `FormControlStatus`, form kontrolleri için tüm olası durum dizelerinin birleşimidir.',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Advanced,
    step: 'v13 router serializer',
    action:
      'URI spesifikasyonuyla uyum sağlamak için URL serileştirici artık sorgu parametrelerindeki soru işaretlerini dikkate alır. Örneğin `/path?q=hello?&q2=2` artık `{ q: `hello?`, q2: 2 }` olarak ayrıştırılacaktır',
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Advanced,
    step: 'v13 host binding',
    action:
      "`href` artık bir öznitelik bağlamasıdır. Bu, `DebugElement.properties['href']` ifadesinin artık `routerLink`'in `href` özelliğinin iç değeri yerine, yerel öğe tarafından döndürülen `href` değerini döndürdüğü anlamına gelir.",
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Advanced,
    step: 'v13 spy location',
    action:
      "`SpyLocation` artık `location.go` çağrıldığında `popstate` olayını yaymaz. Ayrıca, `simulateHashChange` artık hem `haschange` hem de `popstate` olaylarını tetikler. `location.go`'ya dayanan testlerin büyük olasılıkla `popstate`'i yakalamak için artık `simulateHashChange` kullanması gerekir.",
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Advanced,
    ngUpgrade: true,
    step: 'v13 router URL replacement',
    action:
      "Yönlendirici, yeni bir gezinme devam eden bir gezinmeyi iptal ettiğinde artık tarayıcı URL'sini değiştirmeyecektir. Angular yönlendiricisi tarafından işlenen ilk gezinmelerde `navigationId`'nin bulunmasına dayanan hibrit uygulamalar, `NavigationCancel` olaylarına abone olmalı ve `Router` durumuna `navigationId` eklemek için `location.replaceState` kullanmalıdır. Ayrıca, `SpyLocation` üzerinde `urlChanges` doğrulayan testlerin, artık tetiklenmeyen `replaceState`'i hesaba katmak için ayarlanması gerekebilir.",
  },
  {
    possibleIn: 1300,
    necessaryAsOf: 1300,
    level: ApplicationComplexity.Advanced,
    step: 'v13 removed symbols',
    action:
      'Rota paketi artık `SpyNgModuleFactoryLoader` ve `DeprecatedLoadChildren` dışa aktarmıyor. Bunları kullanıyorsanız, ilgili import ifadelerini kaldırdığınızdan emin olun.',
  },

  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Basic,
    step: 'v14 ng update',
    action:
      "Angular'un 14. sürümüne geçmenizi sağlayacak olan `ng update @angular/core@14 @angular/cli@14` komutunu çalıştırın.",
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@14` komutunu çalıştırın.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Basic,
    step: 'TypeScript 4.6',
    action:
      'Angular artık TypeScript 4.6 kullanıyor, olası kırılma değişiklikleri hakkında daha fazla bilgi edinin: https://devblogs.microsoft.com/typescript/announcing-typescript-4-6/',
  },

  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Basic,
    step: 'v14 node',
    action:
      '<a href="http://www.hostingadvice.com/how-to/update-node-js-latest-version/" target="_blank">Node 14.15.0 veya üstünü</a> kullandığınızdan emin olun',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Medium,
    step: 'v14 strict forms',
    action:
      'Form modelleri artık genel bir tür parametresi gerektiriyor. Kademeli geçiş için form model sınıflarının türsüz (untyped) sürümünü kullanarak devre dışı bırakabilirsiniz.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Medium,
    step: 'v14 aotSummaries',
    action:
      "Angular artık Ivy'de bunlara ihtiyaç duymadığı için `aotSummaries` öğesini `TestBed` üzerinden kaldırın.",
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Medium,
    material: true,
    step: 'v14 MatVertical and Horizontal Stepper',
    action:
      '`MatVerticalStepper` veya `MatHorizontalStepper` kullanıyorsanız `MatStepper` kullanmaya geçtiğinizden emin olun.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Medium,
    step: 'v14 JSONP',
    action:
      'JSONP isteklerinden başlıkları (header) kaldırın. JSONP başlıkları desteklemez ve belirtildiğinde HTTP modülü artık bunları yok saymak yerine hata fırlatır.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Medium,
    step: 'v14 resolvers',
    action:
      "Resolver'lar artık diğer guard'larla daha iyi uyum sağlamak için bir observable'dan son yayınlanan değer yerine ilk yayınlanan değeri alacak ve ardından navigasyona devam edecektir.",
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 deprecate protractor entry',
    action:
      'Kullanımdan kaldırılmış `angular/cdk/testing/protractor` giriş noktası artık kaldırıldı.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 chipInput',
    action:
      '`MatChipInputEvent` öğesinin `chipInput` özelliğini belirttiğinizden emin olun çünkü artık zorunludur.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 mixinErrorState',
    action:
      '`mixinErrorState` kullanan soyutlamalarda `stateChanges` sınıf üyesini uygulamanız gerekir çünkü mixin artık bunu sağlamıyor.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 CdkStepper orientation',
    action: '`CdkStepper._orientation` yerine `CdkStepper.orientation` kullanın.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 CdkStepper and MatStepper',
    action:
      "Constructor'da `CdkStepper` veya `MatStepper` kullanıyor veya genişletiyorsanız, artık kaldırıldığı için `_document` parametresini geçmemelisiniz.",
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 mat-list-item-avatar',
    action:
      '`mat-list-item-avatar` CSS sınıfını `mat-list-item-with-avatar` olarak yeniden adlandırın.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 MatSelectionListChange.option',
    action: '`MatSelectionListChange.option` yerine `MatSelectionListChange.options` kullanın.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 getHarnessLoaderForContent',
    action:
      '`getHarnessLoaderForContent` yerine `getChildLoader(MatListItemSection.CONTENT)` kullanın.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    material: true,
    step: 'v14 MatSelectionList',
    action:
      "`MatSelectionList` kullanıyorsanız, artık zorunlu olduğu için constructor'ında `_focusMonitor` geçtiğinizden emin olun. Ayrıca bu sınıf artık `tabIndex` özelliğine ve `tabIndex` constructor parametresine sahip değildir.",
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 initialNavigation',
    action:
      "`initialNavigation: 'enabled'` değerini `initialNavigation: 'enabledBlocking'` olarak güncelleyin.",
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 Route.pathMatch',
    action:
      'Rotaları `pathMatch` ile tanımlıyorsanız, açıkça `Route` veya `Routes` türüne dönüştürmeniz gerekebilir. `Route.pathMatch` artık `string` türü ile uyumlu değildir.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 stricter LoadChildrenCallback',
    action:
      '`LoadChildrenCallback` tarafından döndürülen promise artık `any` yerine daha katı bir tür parametresi olan `Type<any>|NgModuleFactory<any>` kullanıyor.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 router scheduling',
    action:
      'Router artık yönlendirme navigasyonunu bir `setTimeout` içinde planlamıyor. Testlerinizin bu davranışa bağlı olmadığından emin olun.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 LocationStrategy',
    action: '`LocationStrategy` arayüzünü uygulamak artık `getState()` tanımını gerektiriyor.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 http queries',
    action:
      'Sorgu parametresi olarak `+` göndermek artık geçici çözümler gerektirmiyor çünkü `+` artık boşluk göndermez.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 AnimationDriver.getParentElement',
    action: '`AnimationDriver` uygulamak artık `getParentElement` metodunu gerektiriyor.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 invalid config',
    action:
      'Tembel yüklenen (lazy-loaded) modüllerin geçersiz rota yapılandırmaları artık göz ardı edilmek yerine hata fırlatacaktır.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 router resolver',
    action:
      'Fabrika çözümleyicileri artık gerekli olmadığından `RouterOutletContract.activateWith` fonksiyonundan ve `OutletContext` sınıfından `resolver` parametresini kaldırın.',
  },
  {
    possibleIn: 1400,
    necessaryAsOf: 1400,
    level: ApplicationComplexity.Advanced,
    step: 'v14 initialUrl',
    action:
      "`Router.initialUrl` artık yalnızca `UrlTree` kabul ediyor; bu, `string` değeri atayarak API'nin yanlış kullanılmasını önlemek içindir.",
  },

  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 node support',
    action:
      'Uygulamanızı yükseltmeden önce desteklenen bir node.js sürümü kullandığınızdan emin olun. Angular v15, node.js sürümleri: 14.20.x, 16.13.x ve 18.10.x\'i destekler. <a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-01" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 ts support',
    action:
      'Uygulamanızı yükseltmeden önce desteklenen bir TypeScript sürümü kullandığınızdan emin olun. Angular v15, TypeScript sürüm 4.8 veya üstünü destekler.  <a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-02" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 ng update',
    action:
      "Uygulamanın proje dizininde, uygulamanızı Angular v15'e güncellemek için `ng update @angular/core@15 @angular/cli@15` komutunu çalıştırın.",
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'V15 update @angular/material',
    action:
      'Material bileşenlerini güncellemek için `ng update @angular/material@15` komutunu çalıştırın.',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 keyframe',
    action:
      'v15\'te Angular derleyicisi, CSS\'deki `@keyframes` ifadelerinin önüne bileşenin kapsamını ekler. Bu, `keyframes` adlarına dayanan herhangi bir TypeScript kodunun v15\'te artık çalışmayacağı anlamına gelir. Bu tür örnekleri şu şekilde güncelleyin: keyframes\'leri programatik olarak tanımlayın, global stil dosyaları kullanın veya bileşenin görünüm kapsüllemesini değiştirin. <a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-03" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 no-ivy',
    action:
      "Uygulamanızın `tsconfig.json` dosyasından `enableIvy` seçeneğini kaldırın. v15'te Ivy tek işleme motoru olduğundan `enableIvy` gerekli değildir.",
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 base-decorators',
    action:
      'Constructor\'ları miras alan ve bağımlılık enjeksiyonu kullanan alt sınıflara sahip temel sınıflarda dekoratör kullandığınızdan emin olun. Bu tür temel sınıflar `@Injectable` veya `@Directive` ile dekore edilmelidir, aksi takdirde derleyici hata döndürür. <a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-05" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 setDisabledState',
    action:
      'v15\'te, bir `ControlValueAccessor` eklendiğinde `setDisabledState` her zaman çağrılır. Bu davranışı devre dışı bırakmak için `FormsModule.withConfig` veya `ReactiveFormsModule.withConfig` kullanın. <a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-06" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Advanced,
    step: 'v15 canParse',
    action:
      '`canParse` kullanan uygulamalar bunun yerine `@angular/localize/tools` paketindeki `analyze` metodunu kullanmalıdır. v15\'te `canParse` metodu `@angular/localize/tools` içindeki tüm çeviri ayrıştırıcılarından kaldırılmıştır.  <a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-07" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 ActivatedRoutSnapshot',
    action:
      'Tüm `ActivatedRouteSnapshot` nesnelerinin bir `title` özelliğine sahip olduğundan emin olun. v15\'te `title` özelliği `ActivatedRouteSnapshot` için zorunlu bir özelliktir. <a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-08" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Advanced,
    step: 'v15 RouterOutlet',
    action:
      '`RouterOutlet` ile testleriniz bozuluyorsa, değişiklik algılamaya göre ilgili bileşenin oluşturulma sırasına bağlı olmadıklarından emin olun. v15\'te `RouterOutlet` bileşeni değişiklik algılamadan sonra oluşturur. <a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-09" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 relativeLinkResolution',
    action:
      'v15\'te `relativeLinkResolution` Router\'da yapılandırılabilir değildir. Bu seçenek, artık standart olan önceki bir hata düzeltmesini devre dışı bırakmak için kullanılıyordu.  <a href="https://v15.angular.io/guide/update-to-version-15#v15-bc-10" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 DATE_PIPE_DEFAULT_OPTIONS',
    action:
      'Saat dilimlerini yapılandırmak için `DATE_PIPE_DEFAULT_TIMEZONE` token kullanımlarını `DATE_PIPE_DEFAULT_OPTIONS` kullanacak şekilde değiştirin. v15\'te `DATE_PIPE_DEFAULT_TIMEZONE` tokeni kullanımdan kaldırılmıştır. <a href="https://v15.angular.io/guide/update-to-version-15#v15-dp-01" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 iframe',
    action:
      'Mevcut `<iframe>` örneklerinde öznitelik veya özellik bağlama olarak güvenlik açısından hassas öznitelikler uygulanmış olabilir. Bu güvenlik açısından hassas öznitelikler bir şablonda veya bir direktifin host bağlamalarında bulunabilir. Bu tür durumlar, `<iframe>` bağlamaları hakkındaki yeni ve daha katı kurallara uyumu sağlamak için güncelleme gerektirir. Daha fazla bilgi için [hata sayfasına](https://v15.angular.io/errors/NG0910) bakın.',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 Injector.get',
    action:
      '`InjectFlags` parametresi kullanan `Injector.get()` kullanımlarını `InjectOptions` parametresi kullanacak şekilde güncelleyin. `Injector.get()` metodunun `InjectFlags` parametresi v15\'te kullanımdan kaldırılmıştır. <a href="https://v15.angular.io/guide/update-to-version-15#v15-dp-02" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 TestBed.inject',
    action:
      '`InjectFlags` parametresi kullanan `TestBed.inject()` kullanımlarını `InjectOptions` parametresi kullanacak şekilde güncelleyin. `TestBed.inject()` metodunun `InjectFlags` parametresi v15\'te kullanımdan kaldırılmıştır. <a href="https://v15.angular.io/guide/update-to-version-15#v15-dp-01" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 ngModule in providedIn',
    action:
      '`@Injectable` ve `InjectionToken` için `providedIn: ngModule` kullanımı v15\'te kullanımdan kaldırılmıştır. <a href="https://v15.angular.io/guide/update-to-version-15#v15-dp-04" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 providedIn any',
    action:
      '`@Injectable` veya `InjectionToken` için `providedIn: \'any\'` kullanımı v15\'te kullanımdan kaldırılmıştır. <a href="https://v15.angular.io/guide/update-to-version-15#v15-dp-05" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Medium,
    step: 'v15 RouterLinkWithHref',
    action:
      '`RouterLinkWithHref` direktifinin kullanımlarını `RouterLink` direktifini kullanacak şekilde güncelleyin. `RouterLinkWithHref` direktifi v15\'te kullanımdan kaldırılmıştır. <a href="https://v15.angular.io/guide/update-to-version-15#v15-dp-06" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'v15 mat refactor',
    action:
      'Angular Material v15\'te birçok bileşen, resmi Material Design Components for Web (MDC) tabanlı olacak şekilde yeniden düzenlenmiştir. Bu değişiklik birçok bileşenin DOM ve CSS sınıflarını etkilemiştir. <a href="https://rc.material.angular.dev/guide/mdc-migration" alt="Bu değişiklik hakkında daha fazla bilgi bağlantısı">Daha fazla bilgi</a>',
  },
  {
    possibleIn: 1500,
    necessaryAsOf: 1500,
    level: ApplicationComplexity.Basic,
    step: 'v15 visual review',
    action:
      "Uygulamanızı v15'e güncelledikten sonra, her şeyin olması gerektiği gibi çalıştığından emin olmak için uygulamanızı ve etkileşimlerini görsel olarak gözden geçirin.",
  },

  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 node support',
    action:
      "Uygulamanızı yükseltmeden önce desteklenen bir node.js sürümü kullandığınızdan emin olun. Angular v16, node.js sürümleri: v16 ve v18'i destekler.",
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 ts support',
    action:
      'Uygulamanızı yükseltmeden önce desteklenen bir TypeScript sürümü kullandığınızdan emin olun. Angular v16, TypeScript sürüm 4.9.3 veya üstünü destekler.',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 ng update',
    action:
      "Uygulamanın proje dizininde, uygulamanızı Angular v16'ya güncellemek için `ng update @angular/core@16 @angular/cli@16` komutunu çalıştırın.",
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@16` komutunu çalıştırın.',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 zone.js support',
    action:
      'Uygulamanızı yükseltmeden önce desteklenen bir Zone.js sürümü kullandığınızdan emin olun. Angular v16, Zone.js sürüm 0.13.x veya üstünü destekler.',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 RouterEvent',
    action:
      'Event birleşimi artık `RouterEvent` içermiyor, bu da Event türünü kullanıyorsanız tür tanımını `(e: Event)` yerine `(e: Event|RouterEvent)` olarak değiştirmeniz gerekebileceği anlamına gelir',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 routerEvent prop type',
    action:
      '`NavigationEnd` ile birlikte `routerEvent` özelliği artık `NavigationSkipped` türünü de kabul ediyor',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 RendererType2',
    action:
      '`RendererType2.styles` artık iç içe dizileri kabul etmediği için yalnızca düz diziler iletin',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 BrowserPlatformLocation',
    action:
      '`MockPlatformLocation` artık testlerde varsayılan olarak sağlandığından, `BrowserPlatformLocation` kullanan testleri güncellemeniz gerekebilir. [Daha fazla bilgi](https://github.com/angular/angular/blob/main/CHANGELOG.md#common-9).',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 ngcc',
    action:
      "Angular Uyumluluk Derleyicisi (ngcc) v16'da kaldırıldığından, v16 ve sonraki sürümlerdeki projeler artık View Engine kütüphanelerini desteklememektedir.",
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 createUrlTree',
    action:
      "`Router.createUrlTree` hata düzeltmelerinden sonra `ActivatedRoute` mock'layan testleri yeniden ayarlamanız gerekebilir. [Daha fazla bilgi](https://github.com/angular/angular/blob/main/CHANGELOG.md#1600-2023-05-03)",
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 ApplicationConfig imports',
    action:
      "`ApplicationConfig` import'larını `@angular/core` üzerinden yapacak şekilde değiştirin.",
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 renderModule',
    action:
      '`renderModuleFactory` silindiği için kodunuzu `renderModule` kullanacak şekilde güncelleyin.',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 XhrFactory',
    action:
      'Kodunuzu `@angular/common/http` yerine `@angular/common` üzerinden `XhrFactory` kullanacak şekilde güncelleyin.',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 withServerTransition',
    action:
      "Aynı sayfada birden fazla Angular uygulaması çalıştırıyorsanız ve `BrowserModule.withServerTransition({ appId: 'serverApp' })` kullanıyorsanız, `withServerTransition` artık kullanımdan kaldırıldığı için bunun yerine `APP_ID` ayarladığınızdan emin olun. [Daha fazla bilgi](https://github.com/angular/angular/blob/main/CHANGELOG.md#platform-browser-4)",
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 EnvironmentInjector',
    action:
      '`EnvironmentInjector.runInContext` yerine `runInInjectionContext` kullanın ve ortam enjektörünü ilk parametre olarak iletin.',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 ViewContainerRef.createComponent',
    action:
      "Kodunuzu fabrika çözümleyici olmadan `ViewContainerRef.createComponent` kullanacak şekilde güncelleyin. `ComponentFactoryResolver` Router API'lerinden kaldırıldı.",
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 APP_ID',
    action:
      "Aynı sayfada birden fazla uygulama başlatıyorsanız, benzersiz `APP_ID`'ler ayarladığınızdan emin olun.",
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 server renderApplication',
    action:
      '`renderApplication` metodu artık ilk argüman olarak kök bileşen kabul etmeyip bunun yerine uygulamanızı başlatması gereken bir geri çağırma kabul ettiğinden kodunuzu güncelleyin. [Daha fazla bilgi](https://github.com/angular/angular/blob/main/CHANGELOG.md#platform-server-3)',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 PlatformConfig.baseUrl',
    action:
      'Kullanımdan kaldırıldığı için kodunuzdaki `PlatformConfig.baseUrl` ve `PlatformConfig.useAbsoluteUrl` platform-server yapılandırma seçeneklerine yapılan tüm referansları kaldırın.',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 moduleid',
    action:
      "`@Directive`/`@Component` `moduleId` özelliği herhangi bir etkiye sahip olmadığından ve v17'de kaldırılacağından kodunuzdaki tüm referansları kaldırın.",
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 transfer state imports',
    action:
      "Import'ları `import {makeStateKey, StateKey, TransferState} from '@angular/platform-browser'` yerine `import {makeStateKey, StateKey, TransferState} from '@angular/core'` olarak güncelleyin",
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 ComponentRef',
    action:
      '`Object.is` eşitlik kontrolüne göre aynı olsa bile bileşen girdisini ayarlamak için `ComponentRef.setInput` kullanıyorsanız, değerini kopyaladığınızdan emin olun.',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 ANALYZE_FOR_ENTRY_COMPONENTS',
    action:
      '`ANALYZE_FOR_ENTRY_COMPONENTS` enjeksiyon belirteci silindiği için kodunuzdaki tüm referansları kaldırın.',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 entry components',
    action:
      "`entryComponents` artık mevcut değildir ve `@NgModule` ile `@Component` genel API'lerinden tüm referansları kaldırılabilir.",
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 ngTemplateOutletContext',
    action:
      'ngTemplateOutletContext artık daha katı tür denetimi uygulamaktadır ve ilgili nesnedeki tüm özellikleri bildirmenizi gerektirir. [Daha fazla bilgi](https://github.com/angular/angular/blob/main/CHANGELOG.md#common-1).',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 APF',
    action:
      "Angular paketleri artık FESM2015 içermiyor ve dağıtılan ECMScript 2020'den 2022'ye güncellendi.",
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Advanced,
    step: 'v16 EventManager',
    action:
      'Kullanımdan kaldırılmış `EventManager` metodu `addGlobalEventListener`, Ivy tarafından kullanılmadığı için kaldırıldı.',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 BrowserTransferStateModule',
    action:
      '`BrowserTransferStateModule` artık mevcut değildir ve uygulamalarınızdan tüm referansları kaldırılabilir.',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Medium,
    step: 'v16 ReflectiveInjector',
    action:
      '`ReflectiveInjector` kaldırıldığı için kodunuzu `ReflectiveInjector` yerine `Injector.create` kullanacak şekilde güncelleyin.',
  },
  {
    possibleIn: 1600,
    necessaryAsOf: 1600,
    level: ApplicationComplexity.Basic,
    step: 'v16 QueryList',
    action:
      '`QueryList.filter` artık tür koruma fonksiyonlarını destekliyor. Tür daraltılacağından, eski davranışa dayanan uygulama kodunuzu güncellemeniz gerekebilir.',
  },

  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 node support',
    action:
      'Uygulamanızı yükseltmeden önce desteklenen bir node.js sürümü kullandığınızdan emin olun. Angular v17, node.js sürümleri: v18.13.0 ve üstünü destekler',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 ts support',
    action:
      'Uygulamanızı yükseltmeden önce desteklenen bir TypeScript sürümü kullandığınızdan emin olun. Angular v17, TypeScript sürüm 5.2 veya üstünü destekler.',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 zone.js support',
    action:
      'Uygulamanızı yükseltmeden önce desteklenen bir Zone.js sürümü kullandığınızdan emin olun. Angular v17, Zone.js sürüm 0.14.x veya üstünü destekler.',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 ng update',
    action:
      "Uygulamanın proje dizininde, uygulamanızı Angular v17'ye güncellemek için `ng update @angular/core@17 @angular/cli@17` komutunu çalıştırın.",
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@17` komutunu çalıştırın.',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Medium,
    step: 'v17 style removal',
    action:
      'Angular artık yok edilen bileşenlerin stillerini otomatik olarak kaldırır, bu da sızan stillere dayandığınız durumlarda mevcut uygulamalarınızı etkileyebilir. Bunu değiştirmek için `REMOVE_STYLES_ON_COMPONENT_DESTROY` sağlayıcısının değerini `false` olarak güncelleyin.',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 router removals',
    action:
      "Bu özellikler artık `Router`'ın genel API'sinin bir parçası olmadığından, `setupTestingRouter`, `canceledNavigationResolution`, `paramsInheritanceStrategy`, `titleStrategy`, `urlUpdateStrategy`, `urlHandlingStrategy` ve `malformedUriErrorHandler` yapılandırmalarını `provideRouter` veya `RouterModule.forRoot` içinde yaptığınızdan emin olun",
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Advanced,
    step: 'v17 ngDoCheck dynamic components',
    action:
      'Dinamik olarak oluşturulan bileşenler için, bileşen kirli olarak işaretlenmişse artık değişiklik algılama sırasında `ngDoCheck` çalıştırılıyor. Dinamik olarak oluşturulan bileşenler için `ngDoCheck` içindeki testlerinizi veya mantığınızı güncellemeniz gerekebilir.',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Medium,
    step: 'v17 malformedUriErrorHandler',
    action:
      '`malformedUriErrorHandler` artık genel API yüzeyinin bir parçası olduğundan, URL ayrıştırma hatalarını `malformedUriErrorHandler` yerine `UrlSerializer.parse` içinde ele alın.',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Medium,
    step: 'v17 zone deep imports',
    action:
      "`zone.js/bundles/zone-testing.js` ve `zone.js/dist/zone` gibi Zone.js derin import'larını `zone.js` ve `zone.js/testing` olarak değiştirin.",
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Advanced,
    step: 'v17 absolute redirects',
    action:
      "Mutlak yönlendirmelerden sonra sonsuz yönlendirmeleri önlemek için yönlendirici yapılandırmanızı ayarlamanız gerekebilir. v17'de mutlak yönlendirmelerden sonra ek yönlendirmeler artık engellenmemektedir.",
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Medium,
    step: 'v17 AnimationDriver',
    action:
      '`AnimationDriver.NOOP` artık kullanımdan kaldırıldığı için `AnimationDriver.NOOP` referanslarını `NoopAnimationDriver` kullanacak şekilde değiştirin.',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 switch strictness',
    action:
      '`NgSwitch` için eşitlik kontrolünü ayarlamanız gerekebilir çünkü artık varsayılan olarak `==` yerine `===` ile daha katı bir kontrol kullanılmaktadır. Angular, ayarlama yapmanız gereken kullanımlar için bir uyarı mesajı kaydedecektir.',
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Advanced,
    step: 'v17 mutate in signals',
    action:
      "Angular Signals'da `mutate` yerine `update` kullanın. Örneğin `items.mutate(itemsArray => itemsArray.push(newItem));` artık `items.update(itemsArray => [itemsArray, …newItem]);` şeklinde olacaktır.",
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Medium,
    step: 'v17 withNoDomReuse',
    action:
      "`withNoDomReuse` artık genel API'nin bir parçası olmadığından, hidrasyon'u devre dışı bırakmak için `ngSkipHydration` kullanın veya sağlayıcı listesinden `provideClientHydration` çağrısını kaldırın.",
  },
  {
    possibleIn: 1700,
    necessaryAsOf: 1700,
    level: ApplicationComplexity.Basic,
    step: 'v17 paramsInheritanceStrategy',
    action:
      "`loadComponent` rotalarının alt rotalarının üst rotalarından veri miras almasını istiyorsanız, `paramsInheritanceStrategy` değerini `always` olarak belirtin; v17'de bu değer artık `emptyOnly` olarak ayarlanmıştır.",
  },

  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Basic,
    step: 'v18 node support',
    action:
      'Uygulamanızı yükseltmeden önce desteklenen bir node.js sürümü kullandığınızdan emin olun. Angular v18, node.js sürümleri: v18.19.0 ve üstünü destekler.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Basic,
    step: 'v18 ng update',
    action:
      "Uygulamanın proje dizininde, uygulamanızı Angular v18'e güncellemek için `ng update @angular/core@18 @angular/cli@18` komutunu çalıştırın.",
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@18` komutunu çalıştırın.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Basic,
    step: '18.0.0 Upgrade TypeScript',
    action: "TypeScript'ı 5.4 veya daha yeni sürümlere güncelleyin.",
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: async has been removed, use `waitForAsync` instead',
    action: '`@angular/core` paketindeki `async` kullanımını `waitForAsync` ile değiştirin.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: Deprecated matchesElement method removed from AnimationDriver',
    action:
      '`matchesElement` artık `AnimationDriver` bileşeninin bir parçası olmadığından, `matchesElement` çağrılarını kaldırın.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0. Use `@angular/core` StateKey and TransferState',
    action:
      "`StateKey` ve `TransferState` import'larını `@angular/platform-browser` yerine `@angular/core` paketinden yapın.",
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0. Opt-in of caching for HTTP requests with auth headers',
    action:
      'Yetkilendirme gerektiren HTTP istekleri için önbelleğe almayı etkinleştirmek üzere `withHttpTransferCache` içinde `includeRequestsWithAuthHeaders: true` kullanın.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0.REMOVE_OBSOLETE_IS_WORKER',
    action:
      "`isPlatformWorkerUi` ve `isPlatformWorkerApp` artık Angular'ın bir parçası olmayan platform WebWorker'a ait olduğundan, uygulamanızdan bu kullanımları kaldırın.",
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0.FORCE_ZONE_CHANGE_DETECTION',
    action:
      "Testler, test durumunu DOM'da tam olarak yansıtmak için ek değişiklik algılama turları çalıştırabilir. Son çare olarak, TestBed sağlayıcılarına `provideZoneChangeDetection({ignoreChangesOutsideZone: true})` ekleyerek eski davranışa geri dönün.",
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0: Remove two-way binding expressions in writable bindings',
    action: '`[(ngModel)]` kullanan şablonlarda özelliklere yazan ifadeleri kaldırın.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: Use zones to track pending requests',
    action:
      '`Testability` metotları `increasePendingRequestCount`, `decreasePendingRequestCount` ve `getPendingRequestCount` çağrılarını kaldırın. Bu bilgi artık ZoneJS tarafından takip edilmektedir.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0: Move shared providers to the routed component',
    action:
      'Yönlendirilen bileşenler için kullanılabilir olması gereken ortam sağlayıcılarını, `RouterOutlet` tanımlayan bileşenden `bootstrapApplication` sağlayıcılarına veya `Route` yapılandırmasına taşıyın.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0 Use RedirectCommand or new NavigationBehaviorOptions',
    action:
      'Bir guard yönlendirme olarak `UrlTree` döndürdüğünde, ilk gezinme de `replaceUrl` seçeneğini kullanıyorsa yönlendirme gezinmesi artık `replaceUrl` kullanacaktır. Önceki davranışı tercih ediyorsanız, `UrlTree` yerine istediğiniz seçeneklerle bir `RedirectCommand` döndürerek yeni `NavigationBehaviorOptions` ile yönlendirmeyi yapılandırın.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: Remove deprecated resource cache providers',
    action:
      '`RESOURCE_CACHE_PROVIDER` artık Angular çalışma zamanının bir parçası olmadığından bağımlılıklarını kaldırın.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: Update Node.js URL parsing in `ServerPlatformLocation`',
    action:
      "`@angular/platform-server` paketinde artık `pathname` her zaman `/` son ekiyle biter ve http: ile https: için varsayılan portlar sırasıyla 80 ve 443'tür.",
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0. Use absolute URLs',
    action:
      '`PlatformConfig` paketindeki `useAbsoluteUrl` ve `baseUrl` yerine mutlak bir `url` sağlayın.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0. Switch from `platformDynamicServer` to `platformServer`.',
    action:
      '`platformDynamicServer` kullanımını `platformServer` ile değiştirin. Ayrıca `import @angular/compiler` ekleyin.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0. Remove `ServerTransferStateModule` from app imports',
    action:
      "Uygulamanızdaki tüm `ServerTransferStateModule` import'larını kaldırın. Artık buna ihtiyaç yoktur.",
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0. Update `Route.redirectTo` to accept functions',
    action:
      "`Route.redirectTo` artık bir string'e ek olarak bir fonksiyon da içerebilir. `Route` nesnelerini doğrudan okuyan ve `redirectTo` değerinin bir string olmasını bekleyen kodların fonksiyonları da hesaba katacak şekilde güncellenmesi gerekebilir.",
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: Guards can return `RedirectCommand`',
    action:
      "`Route` guard'ları ve resolver'ları artık `UrlTree` ve `boolean` değerlerine ek olarak bir `RedirectCommand` nesnesi döndürebilir. `Route` nesnelerini doğrudan okuyan ve yalnızca `boolean` veya `UrlTree` bekleyen kodların `RedirectCommand` değerini de hesaba katacak şekilde güncellenmesi gerekebilir.",
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Medium,
    step: '18.0.0: Mark `OnPush` views dirty',
    action:
      '`OnPush` değişiklik algılama kullanan bileşenler için, host binding güncellemelerini etkinleştirmek amacıyla düzgün şekilde kirli olarak işaretlendiklerinden emin olun.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0-Refresh-Newly-Created-Views',
    action:
      'Yeni oluşturulan görünümlerin veya kontrol için işaretlenip değişiklik algılama sırasında yeniden eklenen görünümlerin artık aynı değişiklik algılama döngüsünde yenilenmesinin garanti edildiğini unutmayın.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0: `ComponentFixture.whenStable` matches `ApplicationRef.isStable`',
    action:
      '`ComponentFixture.whenStable` ve `ApplicationRef.isStable` semantikleri hizalandıktan sonra, `whenStable` kullanırken testleriniz daha uzun süre bekleyebilir.',
  },
  {
    possibleIn: 1800,
    necessaryAsOf: 1800,
    level: ApplicationComplexity.Advanced,
    step: '18.0.0. `ComponentFixture.autoDetect` behavior more closely matches Application behavior',
    action:
      "`ComponentFixture.autoDetect` kullanırken değişiklik algılama yürütme sırasına dayanan testleriniz varsa test hataları yaşayabilirsiniz, çünkü artık `ApplicationRef.tick` içinde fixture'lar için değişiklik algılama yürütülmektedir. Örneğin, bu durum test fixture'ının oluşturduğu diyaloglardan önce yenilenmesine neden olacaktır; oysa geçmişte bunun tersi olabiliyordu.",
  },
  {
    action:
      "Uygulamanın proje dizininde, uygulamanızı Angular v19'a güncellemek için `ng update @angular/core@19 @angular/cli@19` komutunu çalıştırın.",
    level: ApplicationComplexity.Basic,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0_ng_update',
  },
  {
    possibleIn: 1900,
    necessaryAsOf: 1900,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@19` komutunu çalıştırın.',
  },
  {
    action:
      'Angular direktifleri, bileşenleri ve pipe\'ları artık varsayılan olarak bağımsızdır (standalone). Şu anda bir NgModule içinde bildirilen deklarasyonlar için "standalone: false" belirtin. Angular CLI kodunuzu bunu yansıtacak şekilde otomatik olarak güncelleyecektir.',
    level: ApplicationComplexity.Basic,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-standalone-declarations',
  },
  {
    action:
      'Şablon referans değişkenlerine erişirken `this.` önekini kaldırın. Örneğin, `<div #foo></div>{{ this.foo }}` ifadesini `<div #foo></div>{{ foo }}` olarak yeniden düzenleyin.',
    level: ApplicationComplexity.Medium,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-remove-this',
  },
  {
    action:
      '`BrowserModule.withServerTransition()` kullanımlarını, uygulama `id` değerini ayarlamak için `APP_ID` token enjeksiyonu ile değiştirin.',
    level: ApplicationComplexity.Basic,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-remove-browser-module-with-server-transition',
  },
  {
    action: '`KeyValueDiffers` içindeki `factories` özelliği kaldırıldı.',
    level: ApplicationComplexity.Advanced,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-remove-key-value-differs-factories',
  },
  {
    action:
      'angular.json dosyasında, `@angular/localize` oluşturucusu için "name" seçeneğini "project" ile değiştirin.',
    level: ApplicationComplexity.Medium,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0_localize_builder_project_option',
  },
  {
    action: '`ExperimentalPendingTasks` adını `PendingTasks` olarak yeniden adlandırın.',
    level: ApplicationComplexity.Advanced,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0_rename_experimental_pending_tasks',
  },
  {
    action:
      'Efektlerin `Promise` zamanlamasına dayanan testleri, `await whenStable()` kullanacak veya efektleri tetiklemek için `.detectChanges()` çağıracak şekilde güncelleyin. Değişiklik algılama sırasında tetiklenen efektler için, uygulamanın tamamen render edilmesine bağlı olmadığından emin olun veya `afterRenderEffect()` kullanmayı düşünün. Sahte saat kullanan testlerin saati ileri sarması/temizlemesi gerekebilir.',
    level: ApplicationComplexity.Medium,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0.1',
  },
  {
    action: 'TypeScript sürüm 5.5 veya daha yenisine yükseltin.',
    level: ApplicationComplexity.Basic,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0.2',
  },
  {
    action:
      'Angular zone dışında bir değişiklik olduğunda (hibrit mod zamanlama) zone birleştirme ve zamanlama ile ilgili belirli zamanlamaya dayanan `fakeAsync` kullanan testleri güncelleyin, çünkü bu zamanlayıcılar artık `tick` ve `flush` tarafından etkilenmektedir.',
    level: ApplicationComplexity.Advanced,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-timers-in-zone',
  },
  {
    action:
      "`createComponent` API kullanırken ve ilk `ng-content` için içerik geçirmediğinizde, varsayılan yedek içeriğin render edilmesini önlemek için `projectableNode` olarak `document.createTextNode('')` sağlayın.",
    level: ApplicationComplexity.Medium,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-render-default-fallback',
  },
  {
    action:
      'Özel öğeler (custom elements) etrafındaki değişiklik algılamanın belirli zamanlamasına veya sıralamasına dayanan testleri güncelleyin, çünkü hibrit zamanlayıcıya geçiş nedeniyle zamanlama değişmiş olabilir.',
    level: ApplicationComplexity.Advanced,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-hybrid-scheduler-timing',
  },
  {
    action:
      '`Router.errorHandler` kullanımından `provideRouter` içindeki `withNavigationErrorHandler` veya `RouterModule.forRoot` içindeki `errorHandler` kullanımına geçiş yapın.',
    level: ApplicationComplexity.Basic,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-router-error-handler',
  },
  {
    action:
      "`ApplicationRef.tick` sırasında fırlatılan hataları ele almak için testleri güncelleyin; değişiklik algılamayı eşzamanlı olarak tetikleyin veya bekleyen `ComponentFixture.whenStable` promise'larını reddedin.",
    level: ApplicationComplexity.Advanced,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-testbed-error-handling',
  },
  {
    action:
      '`Resolve` arayüzünün kullanımlarını, dönüş türüne `RedirectCommand` dahil edecek şekilde güncelleyin.',
    level: ApplicationComplexity.Medium,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-update-resolve-interface-return-type',
  },
  {
    action:
      '`fakeAsync` varsayılan olarak bekleyen zamanlayıcıları temizleyecektir. Önceki davranışı gerektiren testler için, seçenekler parametresinde açıkça `{flush: false}` geçirin.',
    level: ApplicationComplexity.Advanced,
    necessaryAsOf: 1900,
    possibleIn: 1900,
    step: '19.0.0-update-fakeasync-to-flush-pending-timers',
  },
  {
    action:
      "Uygulamanızın proje dizininde, Angular v20'ye güncellemek için `ng update @angular/core@20 @angular/cli@20` komutunu çalıştırın.",
    level: ApplicationComplexity.Basic,
    necessaryAsOf: 2000,
    possibleIn: 2000,
    step: '20.0.0_ng_update',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@20` komutunu çalıştırın.',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Basic,
    step: '20.0.0_rename_afterRender_to_afterEveryRender',
    action: '`afterRender` yaşam döngüsü kancasını `afterEveryRender` olarak yeniden adlandırın',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Medium,
    step: '20.0.0_replace_TestBed_flushEffects_with_tick',
    action:
      'Efektleri eşzamanlı olarak temizlemenin en yakın karşılığı olan `TestBed.tick()` ile `TestBed.flushEffects()` kullanımlarını değiştirin.',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_update_provideCheckNoChangesConfig',
    action:
      '`provideExperimentalCheckNoChangesForDebug` adını `provideCheckNoChangesConfig` olarak değiştirin. Davranışının artık tüm `checkNoChanges` çalıştırmalarına uygulandığını unutmayın. `useNgZoneOnStable` seçeneği artık mevcut değildir.',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_refactor_ng_reflect_attributes_usage',
    action:
      '`ng-reflect-*` özniteliklerine bağımlılıktan kaçınmak için uygulama ve test kodunu yeniden düzenleyin. Geçiş için geçici olarak gerekiyorsa, bunları yalnızca geliştirme modunda yeniden etkinleştirmek için önyükleme sağlayıcılarında `@angular/core` paketinden `provideNgReflectAttributes()` kullanın.',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_adjust_RedirectFn_return_type_handling',
    action:
      '`RedirectFn` döndüren fonksiyonları doğrudan çağıran kodu düzenleyin. Bu fonksiyonlar artık `Observable` veya `Promise` de döndürebilir; mantığınızın bu asenkron dönüş türlerini doğru şekilde işlediğinden emin olun.',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Basic,
    step: '20.0.0_rename_resource_request_to_param',
    action: 'Kaynaklara iletilen `request` özelliğini `params` olarak yeniden adlandırın.',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Medium,
    step: '20.0.0_rename_rxResource_loader_to_stream',
    action:
      "RxResource'a iletilen `request` ve `loader` özelliklerini `params` ve `stream` olarak yeniden adlandırın.",
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Basic,
    step: '20.0.0_replace_ResourceStatus_by_corresponding_strings',
    action:
      '`ResourceStatus` artık bir enum değildir. Bunun yerine karşılık gelen sabit string değerlerini kullanın.',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_rename_provideExperimentalZonelessChangeDetection',
    action:
      '`provideExperimentalZonelessChangeDetection` adını `provideZonelessChangeDetection` olarak değiştirin.',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_update_template_expressions_using_in_property',
    action:
      "Şablonlarınız 'in' adlı bir bileşen özelliğine başvurmak için `{{ in }}` veya ifadelerde `in` kullanıyorsa, 'in' artık JavaScript'in 'in' operatörüne karşılık geldiği için bunu `{{ this.in }}` veya `this.in` olarak değiştirin. `in`'i şablon referansı olarak kullanıyorsanız, referansı yeniden adlandırmanız gerekecektir.",
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_update_router_method_array_parameters_to_readonly',
    action:
      'Router metotlarına (`createUrlTree`, `navigate`, `createUrlTreeFromSnapshot`) iletilen komut dizilerinin türü, dizi değiştirilmediği için `readonly T[]` kullanacak şekilde güncellenmiştir. Bu türleri çıkaran kod (örn. `typeof` ile) değiştirilebilir diziler bekliyorsa ayarlanması gerekebilir.',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_update_animation_tests_for_guaranteed_flushing',
    action:
      'Animasyonlara dahil olan DOM elemanları üzerinde doğrulama yapan testleri gözden geçirip güncelleyin. Animasyonların artık değişiklik algılama veya `ApplicationRef.tick` ile temizlenmesi garanti edilmektedir ve bu, önceki test sonuçlarını değiştirebilir.',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Medium,
    step: '20.0.0_handle_uncaught_listener_errors_in_tests',
    action:
      'Testlerde, olay dinleyicilerindeki yakalanmamış hatalar artık varsayılan olarak yeniden fırlatılır. Daha önce bunlar yalnızca varsayılan olarak konsola kaydediliyordu. Test senaryosu için kasıtlıysa yakalayın veya son çare olarak `configureTestingModule` içinde `rethrowApplicationErrors: false` kullanın.',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_update_route_guards_array_types',
    action:
      "Route guard dizilerinden (canActivate, canDeactivate vb.) `any` türü kaldırılmıştır; guard'ların fonksiyon, `ProviderToken<T>` veya (kullanımdan kaldırılmış) string olduğundan emin olun. String guard'ları `ProviderToken<T>` veya fonksiyonlara dönüştürün.",
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Basic,
    step: '20.0.0_update_nodejs_version',
    action:
      "Angular v20'ye yükseltmeden önce Node.js sürümünüzün en az 20.11.1 olduğundan ve v18 veya v22.0-v22.10 olmadığından emin olun. Desteklenen Node.js sürümlerinin tam listesi için https://angular.dev/reference/versions adresini kontrol edin.",
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Basic,
    step: '20.0.0_replace_TestBed_get_with_TestBed_inject',
    action:
      'Angular testlerinizde bağımlılık enjeksiyonu için kullanımdan kaldırılmış `TestBed.get()` metodunun tüm kullanımlarını `TestBed.inject()` ile değiştirin.',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Medium,
    step: '20.0.0_remove_InjectFlags_usage',
    action:
      "`inject`, `Injector.get`, `EnvironmentInjector.get` ve `TestBed.inject` çağrılarından `InjectFlags` enum'ını ve kullanımını kaldırın. `inject` için `{optional: true}` gibi seçenekleri kullanın veya `*.get` metotları için null kontrolü yapın.",
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_update_injector_get_calls_to_use_ProviderToken',
    action:
      "Kaldırılan `any` overload'una bağımlı olmak yerine `injector.get()` çağrılarını belirli bir `ProviderToken<T>` kullanacak şekilde güncelleyin. String token'lar kullanıyorsanız (v4'ten beri kullanımdan kaldırılmış), bunları `ProviderToken<T>`'ye taşıyın.",
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Basic,
    step: '20.0.0_update_typescript_version',
    action:
      "Uyumluluk sağlamak için Angular v20'ye yükseltmeden önce projenizin TypeScript sürümünü en az 5.8'e yükseltin.",
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_review_AsyncPipe_error_handling_in_tests',
    action:
      "AsyncPipe'ın subscription/promise'larındaki yakalanmamış hatalar artık doğrudan `ErrorHandler`'a bildirilir. Bu, test sonuçlarını değiştirebilir; testlerin bu bildirilen hataları doğru şekilde işlediğinden emin olun.",
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_refactor_PendingTasks_run_usage',
    action:
      "`PendingTasks.run` dönüş değerine bağımlıysanız, `PendingTasks.add` kullanacak şekilde yeniden düzenleyin. Promise sonuçlarını/reddedilmelerini manuel olarak işleyin, özellikle SSR'de yakalanmamış reddedilmelerde node sürecinin kapanmasını önlemek için.",
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_update_template_expressions_using_void_property',
    action:
      "Şablonlarınız 'void' adlı bir bileşen özelliğine başvurmak için `{{ void }}` veya ifadelerde `void` kullanıyorsa, 'void' artık JavaScript `void` operatörüne karşılık geldiği için bunu `{{ this.void }}` veya `this.void` olarak değiştirin.",
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_review_date_pipe_formatter_Y_usage',
    action:
      '`DatePipe` kullanımlarını gözden geçirin. `Y` (hafta numaralı yıl) biçimlendiricisini `w` (hafta numarası) olmadan kullanmak artık şüpheli olarak algılanır. Amaç buysa `y` (yıl) kullanın veya `Y` ile birlikte `w` ekleyin.',
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Medium,
    step: '20.0.0_handle_uncaught_listener_errors_in_tests',
    action:
      "Şablonlarda parantezler artık her zaman dikkate alınır. Bu, nullish coalescing parantez içine yerleştirildiğinde çalışma zamanı hatalarına yol açabilir. Örn. `(foo?.bar).baz`, yerel JavaScript'te olduğu gibi `foo` nullish ise hata fırlatacaktır.",
  },
  {
    possibleIn: 2000,
    necessaryAsOf: 2000,
    level: ApplicationComplexity.Advanced,
    step: '20.0.0_router_generate_error_redirectTo_and_canMatch_incompatible_together',
    action:
      'Rota yapılandırmaları artık daha sıkı doğrulanır. `redirectTo` ve `canMatch` korumalarını birleştiren rotalar, bu özellikler varsayılan olarak birlikte uyumsuz olduğundan hata üretecektir.',
  },
  {
    action:
      "Uygulamanın proje dizininde, uygulamanızı Angular v21'e güncellemek için `ng update @angular/core@21 @angular/cli@21` komutunu çalıştırın.",
    level: ApplicationComplexity.Basic,
    necessaryAsOf: 2100,
    possibleIn: 2100,
    step: '21.0.0_ng_update',
  },

  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Basic,
    material: true,
    step: 'update @angular/material',
    action: '`ng update @angular/material@21` komutunu çalıştırın.',
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Advanced,
    step: '21.0.0-update-signal-input-access-in-custom-elements',
    action:
      'Angular özel elemanlarıyla sinyal girdileri kullanırken, dekoratör tabanlı girdilerin davranışıyla uyumlu olması için özellik erişimini fonksiyon çağrısı (`elementRef.newInput()`) yerine doğrudan erişim (`elementRef.newInput`) olarak güncelleyin.',
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Advanced,
    step: '21.0.0-zone-scheduler-behavior-change',
    action:
      "ZoneJS polyfill'i olmadan `provideZoneChangeDetection` kullanıyorsanız, dahili zamanlayıcının artık her zaman etkin olduğunu unutmayın. Daha önce devre dışı bırakılmış zamanlayıcıya dayanan davranışı değiştirebileceğinden uygulamanızın zamanlamasını gözden geçirin.",
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Basic,
    step: '21.0.0-provide-zone-change-detection-required',
    action:
      "Zone tabanlı uygulamalar, uygulamanızın kök sağlayıcılarına `provideZoneChangeDetection()` eklemelidir. Bağımsız uygulamalar için `bootstrapApplication` çağrısına ekleyin. NgModule tabanlı uygulamalar için kök `AppModule`'ünüzün `providers` dizisine ekleyin. Otomatik bir taşıma işlemi bunu halletmelidir.",
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Advanced,
    step: '21.0.0-remove-interpolation-option',
    action:
      "@Component dekoratörlerinizden 'interpolation' özelliğini kaldırın. Angular artık yalnızca varsayılan '{{' ve '}}' interpolasyon işaretçilerini destekler.",
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Medium,
    step: '21.0.0-remove-moduleid-property',
    action:
      "@Component dekoratörlerinizden 'moduleId' özelliğini kaldırın. Bu özellik, şablonlar ve stiller için göreli URL'leri çözümlemek için kullanılıyordu; bu işlevsellik artık modern derleme araçları tarafından sağlanmaktadır.",
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Medium,
    step: '21.0.0-ng-component-outlet-content-type-change',
    action:
      '`ngComponentOutletContent` girdisi `any[][]` yerine `Node[][]` olarak katı şekilde tiplendirilmiştir. Bu girdiye ilettiğiniz değeri yeni `Node[][] | undefined` türüne uyacak şekilde güncelleyin.',
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Basic,
    step: '21.0.0-stricter-host-binding-type-checking',
    action:
      'Host binding tür denetimi artık varsayılan olarak etkindir ve yeni derleme hataları ortaya çıkarabilir. Yeni tür hatalarını çözün veya `tsconfig.json` dosyanızın `angularCompilerOptions` bölümünde `typeCheckHostBindings: false` olarak ayarlayın.',
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Basic,
    step: '21.0.0-typescript-5.9-required',
    action:
      'Projenizin TypeScript sürümünü 5.9 veya üstüne güncelleyin. `ng update` komutu genellikle bunu otomatik olarak halleder.',
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Medium,
    step: '21.0.0-remove-application-config-from-platform-browser',
    action:
      '`@angular/platform-browser` paketinden `ApplicationConfig` dışa aktarımı kaldırılmıştır. İçe aktarımlarınızı bunun yerine `@angular/core` paketinden `ApplicationConfig` kullanacak şekilde güncelleyin.',
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Advanced,
    step: '21.0.0-remove-ignore-changes-outside-zone-option',
    action:
      'ZoneJS yapılandırması için `ignoreChangesOutsideZone` seçeneği artık mevcut değildir. Bu seçeneği polyfills dosyanızdaki ZoneJS yapılandırmanızdan kaldırın.',
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Medium,
    step: '21.0.0-testbed-rethrows-errors-with-provideZoneChangeDetection',
    action:
      "TestBed artık hataları yeniden fırlattığı için `provideZoneChangeDetection` kullanan testleri güncelleyin. Testlerinizdeki temel sorunları düzeltin veya son çare olarak bu davranışı devre dışı bırakmak için TestBed'i `rethrowApplicationErrors: false` ile yapılandırın.",
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Medium,
    step: '21.0.0-router-navigation-timing-changed',
    action:
      "Router navigasyon zamanlamasına dayanan testleri güncelleyin. Navigasyonların tamamlanması artık ek mikro görevler gerektirebilir. Doğrulamalar yapmadan önce navigasyonların tamamen tamamlandığından emin olun, örneğin `fakeAsync` ile `flush` kullanarak veya promise/observable'ların çözümlenmesini bekleyerek.",
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Medium,
    step: '21.0.0-test-bed-provides-fake-platform-location',
    action:
      "`TestBed` kullanan testler yeni sahte `PlatformLocation` tarafından etkilenebilir. Testleriniz başarısız olursa, `TestBed` yapılandırmanızda `{provide: PlatformLocation, useClass: MockPlatformLocation}` ile `@angular/common/testing` paketinden eski `MockPlatformLocation`'ı sağlayın.",
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Advanced,
    step: '21.0.0-remove-upgrade-adapter',
    action:
      "`UpgradeAdapter` kaldırılmıştır. Hibrit Angular/AngularJS uygulamanızı bunun yerine `@angular/upgrade/static` paketindeki statik API'leri kullanacak şekilde güncelleyin.",
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Medium,
    step: '21.0.0-form-array-directive-conflict',
    action:
      'Yeni bağımsız `formArray` direktifi mevcut özel direktifler veya girdilerle çakışabilir. Çakışmayı çözmek için reaktif formlar da kullanan elemanlardaki `FormArray` adlı özel direktifleri veya `formArray` adlı girdileri yeniden adlandırın.',
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Advanced,
    step: '21.0.0-ngmodulefactory-removed',
    action:
      "Kullanımdan kaldırılmış `NgModuleFactory` kaldırılmıştır. `NgModuleFactory` kullanan tüm kodu, dinamik bileşen yükleme senaryolarında yaygın olan `NgModule`'ü doğrudan kullanacak şekilde güncelleyin.",
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Advanced,
    step: '21.0.0-emit-declaration-only-not-supported',
    action:
      '`emitDeclarationOnly` TypeScript derleyici seçeneği desteklenmemektedir. Angular derleyicisinin düzgün çalışması için lütfen `tsconfig.json` dosyanızda bu seçeneği devre dışı bırakın.',
  },
  {
    possibleIn: 2100,
    necessaryAsOf: 2100,
    level: ApplicationComplexity.Medium,
    step: '21.0.0-lastsuccessfulnavigation-is-a-signal',
    action:
      'Router üzerindeki `lastSuccessfulNavigation` özelliği bir sinyale dönüştürülmüştür. Değerini almak için artık bunu bir fonksiyon olarak çağırmanız gerekir: `router.lastSuccessfulNavigation()`.',
  },
];
