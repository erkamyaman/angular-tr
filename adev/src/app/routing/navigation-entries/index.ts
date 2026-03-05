/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {isDevMode} from '@angular/core';
import type {NavigationItem} from '@angular/docs';
// These imports are expected to be red because they are generated a build time
// @ts-ignore
import ERRORS_NAV_DATA from '../../../content/reference/errors/routes.json' with {type: 'json'};
// @ts-ignore
import EXT_DIAGNOSTICS_NAV_DATA from '../../../content/reference/extended-diagnostics/routes.json' with {type: 'json'};
// @ts-ignore
import FIRST_APP_TUTORIAL_NAV_DATA from '../../../content/tutorials/first-app/first-app/routes.json' with {type: 'json'};
// @ts-ignore
import LEARN_ANGULAR_TUTORIAL_NAV_DATA from '../../../content/tutorials/learn-angular/learn-angular/routes.json' with {type: 'json'};
// @ts-ignore
import DEFERRABLE_VIEWS_TUTORIAL_NAV_DATA from '../../../content/tutorials/deferrable-views/deferrable-views/routes.json' with {type: 'json'};
// @ts-ignore
import SIGNALS_TUTORIAL_NAV_DATA from '../../../content/tutorials/signals/signals/routes.json' with {type: 'json'};
// @ts-ignore
import SIGNAL_FORMS_TUTORIAL_NAV_DATA from '../../../content/tutorials/signal-forms/signal-forms/routes.json' with {type: 'json'};
// @ts-ignore
import API_MANIFEST_JSON from '../../../assets/manifest.json' with {type: 'json'};

interface SubNavigationData {
  docs: NavigationItem[];
  reference: NavigationItem[];
  tutorials: NavigationItem[];
  footer: NavigationItem[];
}

export const DOCS_SUB_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: 'Giriş',
    children: [
      {
        label: 'Angular Nedir?',
        path: 'overview',
        contentPath: 'introduction/what-is-angular',
      },
      {
        label: 'Kurulum',
        path: 'installation',
        contentPath: 'introduction/installation',
      },
      {
        label: 'Temel Bilgiler',
        children: [
          {
            label: 'Genel Bakış',
            path: 'essentials',
            contentPath: 'introduction/essentials/overview',
          },
          {
            label: 'Bileşenlerle kompozisyon',
            path: 'essentials/components',
            contentPath: 'introduction/essentials/components',
          },
          {
            label: 'Sinyallerle reaktiflik',
            path: 'essentials/signals',
            contentPath: 'introduction/essentials/signals',
          },
          {
            label: 'Şablonlarla dinamik arayüzler',
            path: 'essentials/templates',
            contentPath: 'introduction/essentials/templates',
          },
          {
            label: 'Sinyallerle formlar',
            path: 'essentials/signal-forms',
            contentPath: 'introduction/essentials/signal-forms',
            status: 'new',
          },
          {
            label: 'Bağımlılık enjeksiyonu ile modüler tasarım',
            path: 'essentials/dependency-injection',
            contentPath: 'introduction/essentials/dependency-injection',
          },
          {
            label: 'Sonraki Adımlar',
            path: 'essentials/next-steps',
            contentPath: 'introduction/essentials/next-steps',
          },
        ],
      },
      {
        label: 'Kodlamaya başla! 🚀',
        path: 'tutorials/learn-angular',
      },
    ],
  },
  {
    label: 'Detaylı Rehberler',
    children: [
      {
        label: 'Sinyaller',
        status: 'updated',
        children: [
          {
            label: 'Genel Bakış',
            path: 'guide/signals',
            contentPath: 'guide/signals/overview',
          },
          {
            label: 'linkedSignal ile bağımlı durum',
            path: 'guide/signals/linked-signal',
            contentPath: 'guide/signals/linked-signal',
          },
          {
            label: 'Kaynaklar ile asenkron reaktiflik',
            path: 'guide/signals/resource',
            contentPath: 'guide/signals/resource',
          },
          {
            label: "Reaktif olmayan API'ler için yan etkiler",
            path: 'guide/signals/effect',
            contentPath: 'guide/signals/effect',
            status: 'new',
          },
        ],
      },
      {
        label: 'Bileşenler',
        children: [
          {
            label: 'Bileşenlerin anatomisi',
            path: 'guide/components',
            contentPath: 'guide/components/anatomy-of-components',
          },
          {
            label: 'Seçiciler',
            path: 'guide/components/selectors',
            contentPath: 'guide/components/selectors',
          },
          {
            label: 'Stillendirme',
            path: 'guide/components/styling',
            contentPath: 'guide/components/styling',
          },
          {
            label: 'Input özellikleri ile veri alma',
            path: 'guide/components/inputs',
            contentPath: 'guide/components/inputs',
          },
          {
            label: "Output'lar ile özel olaylar",
            path: 'guide/components/outputs',
            contentPath: 'guide/components/outputs',
          },
          {
            label: 'ng-content ile içerik projeksiyonu',
            path: 'guide/components/content-projection',
            contentPath: 'guide/components/content-projection',
          },
          {
            label: 'Host elemanları',
            path: 'guide/components/host-elements',
            contentPath: 'guide/components/host-elements',
          },
          {
            label: 'Yaşam Döngüsü',
            path: 'guide/components/lifecycle',
            contentPath: 'guide/components/lifecycle',
          },
          {
            label: 'Sorgularla bileşen alt öğelerine başvurma',
            path: 'guide/components/queries',
            contentPath: 'guide/components/queries',
          },
          {
            label: "DOM API'lerini kullanma",
            path: 'guide/components/dom-apis',
            contentPath: 'guide/components/dom-apis',
          },
          {
            label: 'Kalıtım',
            path: 'guide/components/inheritance',
            contentPath: 'guide/components/inheritance',
          },
          {
            label: 'Bileşenleri programatik olarak oluşturma',
            path: 'guide/components/programmatic-rendering',
            contentPath: 'guide/components/programmatic-rendering',
          },
          {
            label: 'Gelişmiş yapılandırma',
            path: 'guide/components/advanced-configuration',
            contentPath: 'guide/components/advanced-configuration',
          },
          {
            label: 'Özel Elemanlar',
            path: 'guide/elements',
            contentPath: 'guide/elements',
          },
        ],
      },
      {
        label: 'Şablonlar',
        children: [
          {
            label: 'Genel Bakış',
            path: 'guide/templates',
            contentPath: 'guide/templates/overview',
          },
          {
            label: 'Dinamik metin, özellik ve nitelik bağlama',
            path: 'guide/templates/binding',
            contentPath: 'guide/templates/binding',
          },
          {
            label: 'Olay dinleyicileri ekleme',
            path: 'guide/templates/event-listeners',
            contentPath: 'guide/templates/event-listeners',
          },
          {
            label: 'İki yönlü bağlama',
            path: 'guide/templates/two-way-binding',
            contentPath: 'guide/templates/two-way-binding',
          },
          {
            label: 'Kontrol akışı',
            path: 'guide/templates/control-flow',
            contentPath: 'guide/templates/control-flow',
          },
          {
            label: "Pipe'lar",
            path: 'guide/templates/pipes',
            contentPath: 'guide/templates/pipes',
          },
          {
            label: 'ng-content ile alt içerik yerleştirme',
            path: 'guide/templates/ng-content',
            contentPath: 'guide/templates/ng-content',
          },
          {
            label: 'ng-template ile şablon parçaları oluşturma',
            path: 'guide/templates/ng-template',
            contentPath: 'guide/templates/ng-template',
          },
          {
            label: 'ng-container ile elemanları gruplama',
            path: 'guide/templates/ng-container',
            contentPath: 'guide/templates/ng-container',
          },
          {
            label: 'Şablonlarda değişkenler',
            path: 'guide/templates/variables',
            contentPath: 'guide/templates/variables',
          },
          {
            label: '@defer ile ertelenmiş yükleme',
            path: 'guide/templates/defer',
            contentPath: 'guide/templates/defer',
          },
          {
            label: 'İfade söz dizimi',
            path: 'guide/templates/expression-syntax',
            contentPath: 'guide/templates/expression-syntax',
          },
          {
            label: 'Şablonlarda boşluk',
            path: 'guide/templates/whitespace',
            contentPath: 'guide/templates/whitespace',
          },
        ],
      },
      {
        label: 'Direktifler',
        children: [
          {
            label: 'Genel Bakış',
            path: 'guide/directives',
            contentPath: 'guide/directives/overview',
          },
          {
            label: 'Nitelik direktifleri',
            path: 'guide/directives/attribute-directives',
            contentPath: 'guide/directives/attribute-directives',
          },
          {
            label: 'Yapısal direktifler',
            path: 'guide/directives/structural-directives',
            contentPath: 'guide/directives/structural-directives',
          },
          {
            label: "Direktif kompozisyon API'si",
            path: 'guide/directives/directive-composition-api',
            contentPath: 'guide/directives/directive-composition-api',
          },
          {
            label: 'NgOptimizedImage ile görsel optimizasyonu',
            path: 'guide/image-optimization',
            contentPath: 'guide/image-optimization',
          },
        ],
      },
      {
        label: 'Bağımlılık Enjeksiyonu',
        status: 'updated',
        children: [
          {
            label: 'Genel Bakış',
            path: 'guide/di',
            contentPath: 'guide/di/overview',
            status: 'updated',
          },
          {
            label: 'Servis oluşturma ve kullanma',
            path: 'guide/di/creating-and-using-services',
            contentPath: 'guide/di/creating-and-using-services',
            status: 'updated',
          },
          {
            label: 'Bağımlılık sağlayıcılarını tanımlama',
            path: 'guide/di/defining-dependency-providers',
            contentPath: 'guide/di/defining-dependency-providers',
            status: 'updated',
          },
          {
            label: 'Enjeksiyon bağlamı',
            path: 'guide/di/dependency-injection-context',
            contentPath: 'guide/di/dependency-injection-context',
          },
          {
            label: 'Hiyerarşik enjektörler',
            path: 'guide/di/hierarchical-dependency-injection',
            contentPath: 'guide/di/hierarchical-dependency-injection',
          },
          {
            label: "Enjeksiyon token'larını optimize etme",
            path: 'guide/di/lightweight-injection-tokens',
            contentPath: 'guide/di/lightweight-injection-tokens',
          },
          {
            label: 'DI uygulamada',
            path: 'guide/di/di-in-action',
            contentPath: 'guide/di/di-in-action',
          },
          {
            label: 'DI hata ayıklama ve sorun giderme',
            path: 'guide/di/debugging-and-troubleshooting-di',
            contentPath: 'guide/di/debugging-and-troubleshooting-di',
            status: 'new',
          },
        ],
      },
      {
        label: 'Yönlendirme',
        status: 'updated',
        children: [
          {
            label: 'Genel Bakış',
            path: 'guide/routing',
            contentPath: 'guide/routing/overview',
          },
          {
            label: 'Rotaları tanımlama',
            path: 'guide/routing/define-routes',
            contentPath: 'guide/routing/define-routes',
          },
          {
            label: 'Rota yükleme stratejileri',
            path: 'guide/routing/loading-strategies',
            contentPath: 'guide/routing/loading-strategies',
          },
          {
            label: "Outlet'ler ile rotaları gösterme",
            path: 'guide/routing/show-routes-with-outlets',
            contentPath: 'guide/routing/show-routes-with-outlets',
          },
          {
            label: 'Rotalara yönlendirme',
            path: 'guide/routing/navigate-to-routes',
            contentPath: 'guide/routing/navigate-to-routes',
          },
          {
            label: 'Rota durumunu okuma',
            path: 'guide/routing/read-route-state',
            contentPath: 'guide/routing/read-route-state',
          },
          {
            label: 'Rotaları yeniden yönlendirme',
            path: 'guide/routing/redirecting-routes',
            contentPath: 'guide/routing/redirecting-routes',
          },
          {
            label: "Guard'lar ile rota erişimini kontrol etme",
            path: 'guide/routing/route-guards',
            contentPath: 'guide/routing/route-guards',
          },
          {
            label: 'Rota veri çözücüleri',
            path: 'guide/routing/data-resolvers',
            contentPath: 'guide/routing/data-resolvers',
          },
          {
            label: 'Yaşam döngüsü ve olaylar',
            path: 'guide/routing/lifecycle-and-events',
            contentPath: 'guide/routing/lifecycle-and-events',
          },
          {
            label: 'Yönlendirme ve navigasyon testi',
            path: 'guide/routing/testing',
            contentPath: 'guide/routing/testing',
            status: 'new',
          },
          {
            label: 'Diğer yönlendirme görevleri',
            path: 'guide/routing/common-router-tasks',
            contentPath: 'guide/routing/common-router-tasks',
          },
          {
            label: 'Özel rota eşleştirmeleri oluşturma',
            path: 'guide/routing/routing-with-urlmatcher',
            contentPath: 'guide/routing/routing-with-urlmatcher',
          },
          {
            label: 'Oluşturma stratejileri',
            path: 'guide/routing/rendering-strategies',
            contentPath: 'guide/routing/rendering-strategies',
            status: 'new',
          },
          {
            label: 'Rota davranışını özelleştirme',
            path: 'guide/routing/customizing-route-behavior',
            contentPath: 'guide/routing/customizing-route-behavior',
            status: 'new',
          },
          {
            label: 'Router referansı',
            path: 'guide/routing/router-reference',
            contentPath: 'guide/routing/router-reference',
          },
          {
            label: 'Rota geçiş animasyonları',
            path: 'guide/routing/route-transition-animations',
            contentPath: 'guide/routing/route-transition-animations',
          },
        ],
      },
      {
        label: 'Formlar',
        status: 'updated',
        preserveOtherCategoryOrder: true,
        children: [
          {
            label: 'Genel Bakış',
            path: 'guide/forms',
            contentPath: 'guide/forms/overview',
          },

          {
            label: 'Genel Bakış',
            path: 'guide/forms/signals/overview',
            contentPath: 'guide/forms/signals/overview',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'Form modelleri',
            path: 'guide/forms/signals/models',
            contentPath: 'guide/forms/signals/models',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'Form model tasarımı',
            path: 'guide/forms/signals/model-design',
            contentPath: 'guide/forms/signals/designing-your-form-model',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'Alan durumu yönetimi',
            path: 'guide/forms/signals/field-state-management',
            contentPath: 'guide/forms/signals/field-state-management',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'Doğrulama',
            path: 'guide/forms/signals/validation',
            contentPath: 'guide/forms/signals/validation',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'Form mantığı',
            path: 'guide/forms/signals/form-logic',
            contentPath: 'guide/forms/signals/form-logic',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'Asenkron işlemler',
            path: 'guide/forms/signals/async-operations',
            contentPath: 'guide/forms/signals/async-operations',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'Özel kontroller',
            path: 'guide/forms/signals/custom-controls',
            contentPath: 'guide/forms/signals/custom-controls',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'Diğer form sistemleriyle karşılaştırma',
            path: 'guide/forms/signals/comparison',
            contentPath: 'guide/forms/signals/comparison',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: "Reactive Forms'dan geçiş",
            path: 'guide/forms/signals/migration',
            contentPath: 'guide/forms/signals/migration',
            category: 'Signal Forms',
            status: 'new',
          },
          {
            label: 'Reaktif formlar',
            path: 'guide/forms/reactive-forms',
            contentPath: 'guide/forms/reactive-forms',
            category: 'Reactive Forms',
          },
          {
            label: 'Katı tipli reaktif formlar',
            path: 'guide/forms/typed-forms',
            contentPath: 'guide/forms/typed-forms',
            category: 'Reactive Forms',
          },
          {
            label: 'Şablon güdümlü formlar',
            path: 'guide/forms/template-driven-forms',
            contentPath: 'guide/forms/template-driven-forms',
            category: 'Template driven Forms',
          },
          {
            label: 'Form girdisini doğrulama',
            path: 'guide/forms/form-validation',
            contentPath: 'guide/forms/form-validation',
            category: 'Reactive Forms',
          },
          {
            label: 'Form girdisini doğrulama',
            path: 'guide/forms/form-validation',
            contentPath: 'guide/forms/form-validation',
            category: 'Template driven Forms',
          },
          {
            label: 'Dinamik formlar oluşturma',
            path: 'guide/forms/dynamic-forms',
            contentPath: 'guide/forms/dynamic-forms',
            category: 'Reactive Forms',
          },
        ],
      },
      {
        label: 'HTTP İstemcisi',
        children: [
          {
            label: 'Genel Bakış',
            path: 'guide/http',
            contentPath: 'guide/http/overview',
          },
          {
            label: 'HttpClient kurulumu',
            path: 'guide/http/setup',
            contentPath: 'guide/http/setup',
          },
          {
            label: 'İstek yapma',
            path: 'guide/http/making-requests',
            contentPath: 'guide/http/making-requests',
          },
          {
            label: 'httpResource ile reaktif veri çekme',
            path: 'guide/http/http-resource',
            contentPath: 'guide/http/http-resource',
          },
          {
            label: 'İstek ve yanıtları yakalama',
            path: 'guide/http/interceptors',
            contentPath: 'guide/http/interceptors',
          },
          {
            label: 'Test',
            path: 'guide/http/testing',
            contentPath: 'guide/http/testing',
          },
        ],
      },
      {
        label: 'Sunucu taraflı ve hibrit oluşturma',
        children: [
          {
            label: 'Genel Bakış',
            path: 'guide/performance',
            contentPath: 'guide/performance/overview',
          },
          {
            label: 'Sunucu taraflı ve hibrit oluşturma',
            path: 'guide/ssr',
            contentPath: 'guide/ssr',
          },
          {
            label: 'Hidrasyon',
            path: 'guide/hydration',
            contentPath: 'guide/hydration',
          },
          {
            label: 'Artımlı Hidrasyon',
            path: 'guide/incremental-hydration',
            contentPath: 'guide/incremental-hydration',
          },
        ],
      },
      {
        label: 'Test',
        children: [
          {
            label: 'Genel Bakış',
            path: 'guide/testing',
            contentPath: 'guide/testing/overview',
          },
          {
            label: 'Bileşen testi temelleri',
            path: 'guide/testing/components-basics',
            contentPath: 'guide/testing/components-basics',
          },
          {
            label: 'Bileşen test senaryoları',
            path: 'guide/testing/components-scenarios',
            contentPath: 'guide/testing/components-scenarios',
          },
          {
            label: 'Servis testi',
            path: 'guide/testing/services',
            contentPath: 'guide/testing/services',
          },
          {
            label: 'Nitelik direktiflerini test etme',
            path: 'guide/testing/attribute-directives',
            contentPath: 'guide/testing/attribute-directives',
          },
          {
            label: "Pipe'ları test etme",
            path: 'guide/testing/pipes',
            contentPath: 'guide/testing/pipes',
          },
          {
            label: 'Yönlendirme ve navigasyon testi',
            path: 'guide/routing/testing',
            contentPath: 'guide/routing/testing',
            status: 'new',
          },
          {
            label: 'Testlerde hata ayıklama',
            path: 'guide/testing/debugging',
            contentPath: 'guide/testing/debugging',
          },
          {
            label: 'Kod kapsamı',
            path: 'guide/testing/code-coverage',
            contentPath: 'guide/testing/code-coverage',
          },
          {
            label: "Test yardımcı API'leri",
            path: 'guide/testing/utility-apis',
            contentPath: 'guide/testing/utility-apis',
          },
          {
            label: "Bileşen harness'larına genel bakış",
            path: 'guide/testing/component-harnesses-overview',
            contentPath: 'guide/testing/component-harnesses-overview',
          },
          {
            label: "Testlerde bileşen harness'larını kullanma",
            path: 'guide/testing/using-component-harnesses',
            contentPath: 'guide/testing/using-component-harnesses',
          },
          {
            label: 'Bileşenleriniz için harness oluşturma',
            path: 'guide/testing/creating-component-harnesses',
            contentPath: 'guide/testing/creating-component-harnesses',
          },
          {
            label: 'Ek test ortamları için harness desteği ekleme',
            path: 'guide/testing/component-harnesses-testing-environments',
            contentPath: 'guide/testing/component-harnesses-testing-environments',
          },
          {
            label: "Karma'dan Vitest'e geçiş",
            path: 'guide/testing/migrating-to-vitest',
            contentPath: 'guide/testing/migrating-to-vitest',
          },
          {
            label: 'Karma ve Jasmine ile test',
            path: 'guide/testing/karma',
            contentPath: 'guide/testing/karma',
          },
          {
            label: 'Zone.js Test Yardımcıları',
            path: 'guide/testing/zone-js-testing-utilities',
            contentPath: 'guide/testing/zone-js-testing-utilities',
          },
        ],
      },
      {
        label: 'Angular Aria',
        status: 'new',
        children: [
          {
            label: 'Genel Bakış',
            path: 'guide/aria/overview',
            contentPath: 'guide/aria/overview',
          },
          {
            label: 'Accordion',
            path: 'guide/aria/accordion',
            contentPath: 'guide/aria/accordion',
          },
          {
            label: 'Autocomplete',
            path: 'guide/aria/autocomplete',
            contentPath: 'guide/aria/autocomplete',
          },
          {
            label: 'Combobox',
            path: 'guide/aria/combobox',
            contentPath: 'guide/aria/combobox',
          },
          {
            label: 'Grid',
            path: 'guide/aria/grid',
            contentPath: 'guide/aria/grid',
          },
          {
            label: 'Listbox',
            path: 'guide/aria/listbox',
            contentPath: 'guide/aria/listbox',
          },
          {
            label: 'Menu',
            path: 'guide/aria/menu',
            contentPath: 'guide/aria/menu',
          },
          {
            label: 'Menubar',
            path: 'guide/aria/menubar',
            contentPath: 'guide/aria/menubar',
          },
          {
            label: 'Multiselect',
            path: 'guide/aria/multiselect',
            contentPath: 'guide/aria/multiselect',
          },
          {
            label: 'Select',
            path: 'guide/aria/select',
            contentPath: 'guide/aria/select',
          },
          {
            label: 'Tabs',
            path: 'guide/aria/tabs',
            contentPath: 'guide/aria/tabs',
          },
          {
            label: 'Toolbar',
            path: 'guide/aria/toolbar',
            contentPath: 'guide/aria/toolbar',
          },
          {
            label: 'Tree',
            path: 'guide/aria/tree',
            contentPath: 'guide/aria/tree',
          },
        ],
      },
      {
        label: 'Uluslararasılaştırma',
        children: [
          {
            label: 'Genel Bakış',
            path: 'guide/i18n',
            contentPath: 'guide/i18n/overview',
          },
          {
            label: 'Yerelleştirme paketini ekleme',
            path: 'guide/i18n/add-package',
            contentPath: 'guide/i18n/add-package',
          },
          {
            label: 'Yerel ayarları kimliğe göre belirtme',
            path: 'guide/i18n/locale-id',
            contentPath: 'guide/i18n/locale-id',
          },
          {
            label: 'Yerel ayara göre veri biçimlendirme',
            path: 'guide/i18n/format-data-locale',
            contentPath: 'guide/i18n/format-data-locale',
          },
          {
            label: 'Bileşeni çeviri için hazırlama',
            path: 'guide/i18n/prepare',
            contentPath: 'guide/i18n/prepare',
          },
          {
            label: 'Çeviri dosyalarıyla çalışma',
            path: 'guide/i18n/translation-files',
            contentPath: 'guide/i18n/translation-files',
          },
          {
            label: 'Çevirileri uygulamaya birleştirme',
            path: 'guide/i18n/merge',
            contentPath: 'guide/i18n/merge',
          },
          {
            label: 'Birden fazla yerel ayar dağıtma',
            path: 'guide/i18n/deploy',
            contentPath: 'guide/i18n/deploy',
          },
          {
            label: 'Yerel ayar verilerinin global varyantlarını içe aktarma',
            path: 'guide/i18n/import-global-variants',
            contentPath: 'guide/i18n/import-global-variants',
          },
          {
            label: 'İşaretlenmiş metni özel kimliklerle yönetme',
            path: 'guide/i18n/manage-marked-text',
            contentPath: 'guide/i18n/manage-marked-text',
          },
          {
            label: 'Örnek Angular uygulaması',
            path: 'guide/i18n/example',
            contentPath: 'guide/i18n/example',
          },
        ],
      },
      {
        label: 'Animasyonlar',
        status: 'updated',
        children: [
          {
            label: 'Giriş ve Çıkış animasyonları',
            path: 'guide/animations',
            contentPath: 'guide/animations/enter-and-leave',
            status: 'new',
          },
          {
            label: 'CSS ile karmaşık animasyonlar',
            path: 'guide/animations/css',
            contentPath: 'guide/animations/css',
          },
          {
            label: 'Rota geçiş animasyonları',
            path: 'guide/routing/route-transition-animations',
            contentPath: 'guide/routing/route-transition-animations',
          },
        ],
      },
      {
        label: 'Sürükle ve bırak',
        path: 'guide/drag-drop',
        contentPath: 'guide/drag-drop',
      },
    ],
  },
  {
    label: 'Yapay Zeka ile Geliştir',
    status: 'new',
    children: [
      {
        label: 'Başlangıç',
        path: 'ai',
        contentPath: 'ai/overview',
      },
      {
        label: 'LLM komutları ve AI IDE kurulumu',
        path: 'ai/develop-with-ai',
        contentPath: 'ai/develop-with-ai',
      },
      {
        label: 'Tasarım Kalıpları',
        path: 'ai/design-patterns',
        contentPath: 'ai/design-patterns',
      },
      {
        label: 'Angular CLI MCP Server kurulumu',
        path: 'ai/mcp',
        contentPath: 'ai/mcp-server-setup',
      },
      {
        label: 'Angular AI Eğitmeni',
        path: 'ai/ai-tutor',
        contentPath: 'ai/ai-tutor',
      },
    ],
  },
  {
    label: 'Geliştirici Araçları',
    children: [
      {
        label: 'Angular CLI',
        children: [
          {
            label: 'Genel Bakış',
            path: 'tools/cli',
            contentPath: 'tools/cli/overview',
          },
          {
            label: 'Yerel kurulum',
            path: 'tools/cli/setup-local',
            contentPath: 'tools/cli/setup-local',
          },
          {
            label: 'Angular uygulamalarını derleme',
            path: 'tools/cli/build',
            contentPath: 'tools/cli/build',
          },
          {
            label: 'Geliştirme için Angular uygulamalarını sunma',
            path: 'tools/cli/serve',
            contentPath: 'tools/cli/serve',
          },
          {
            label: 'Dağıtım',
            path: 'tools/cli/deployment',
            contentPath: 'tools/cli/deployment',
          },
          {
            label: 'Uçtan Uca Test',
            path: 'tools/cli/end-to-end',
            contentPath: 'tools/cli/end-to-end',
          },
          {
            label: 'Yeni derleme sistemine geçiş',
            path: 'tools/cli/build-system-migration',
            contentPath: 'tools/cli/build-system-migration',
          },
          {
            label: 'Derleme ortamları',
            path: 'tools/cli/environments',
            contentPath: 'tools/cli/environments',
          },
          {
            label: "Angular CLI builder'ları",
            path: 'tools/cli/cli-builder',
            contentPath: 'tools/cli/cli-builder',
          },
          {
            label: 'Şematiklerle kod üretme',
            path: 'tools/cli/schematics',
            contentPath: 'tools/cli/schematics',
          },
          {
            label: 'Şematik yazma',
            path: 'tools/cli/schematics-authoring',
            contentPath: 'tools/cli/schematics-authoring',
          },
          {
            label: 'Kütüphaneler için şematikler',
            path: 'tools/cli/schematics-for-libraries',
            contentPath: 'tools/cli/schematics-for-libraries',
          },
          {
            label: 'Şablon tip kontrolü',
            path: 'tools/cli/template-typecheck',
            contentPath: 'tools/cli/template-typecheck',
          },
          {
            label: 'Önceden (AOT) derleme',
            path: 'tools/cli/aot-compiler',
            contentPath: 'tools/cli/aot-compiler',
          },
          {
            label: 'AOT meta veri hataları',
            path: 'tools/cli/aot-metadata-errors',
            contentPath: 'tools/cli/aot-metadata-errors',
          },
        ],
      },
      {
        label: 'Kütüphaneler',
        children: [
          {
            label: 'Genel Bakış',
            path: 'tools/libraries',
            contentPath: 'tools/libraries/overview',
          },
          {
            label: 'Kütüphane oluşturma',
            path: 'tools/libraries/creating-libraries',
            contentPath: 'tools/libraries/creating-libraries',
          },
          {
            label: 'Kütüphane kullanma',
            path: 'tools/libraries/using-libraries',
            contentPath: 'tools/libraries/using-libraries',
          },
          {
            label: 'Angular Paket Formatı',
            path: 'tools/libraries/angular-package-format',
            contentPath: 'tools/libraries/angular-package-format',
          },
        ],
      },
      {
        label: 'DevTools',
        children: [
          {
            label: 'Genel Bakış',
            path: 'tools/devtools',
            contentPath: 'tools/devtools/overview',
          },
          {
            label: 'Bileşenler',
            path: 'tools/devtools/component',
            contentPath: 'tools/devtools/component',
          },
          {
            label: 'Profiler',
            path: 'tools/devtools/profiler',
            contentPath: 'tools/devtools/profiler',
          },
          {
            label: 'Enjektörler',
            path: 'tools/devtools/injectors',
            contentPath: 'tools/devtools/injectors',
          },
          // TODO: create those guides
          // The signal debugging docs should also be added to the signal section
          // {
          //   label: 'Signals',
          //   path: 'tools/devtools/signals',
          //   contentPath: 'tools/devtools/signals',
          // },
          // {
          //   label: 'Router',
          //   path: 'tools/devtools/router',
          //   contentPath: 'tools/devtools/router',
          // }
        ],
      },
      {
        label: 'Dil Servisi',
        path: 'tools/language-service',
        contentPath: 'tools/language-service',
      },
    ],
  },
  {
    label: 'En İyi Uygulamalar',
    children: [
      {
        label: 'Stil Rehberi',
        path: 'style-guide',
        contentPath: 'best-practices/style-guide',
        status: 'updated',
      },
      {
        label: 'Güvenlik',
        path: 'best-practices/security',
        contentPath: 'guide/security', // Have not refactored due to build issues
      },
      {
        label: 'Erişilebilirlik',
        path: 'best-practices/a11y',
        contentPath: 'best-practices/a11y',
      },
      {
        label: "Angular'da işlenmeyen hatalar",
        path: 'best-practices/error-handling',
        contentPath: 'best-practices/error-handling',
      },
      {
        label: 'Performans',
        preserveOtherCategoryOrder: true,
        children: [
          {
            label: 'Genel Bakış',
            path: 'best-practices/performance',
            contentPath: 'best-practices/performance/overview',
          },

          // Loading Performance
          {
            label: 'Tembel yüklenen rotalar',
            path: 'best-practices/performance/lazy-loaded-routes',
            contentPath: 'guide/routing/loading-strategies',
            category: 'Loading Performance',
          },
          {
            label: '@defer ile ertelenmiş yükleme',
            path: 'best-practices/performance/defer',
            contentPath: 'guide/templates/defer',
            category: 'Loading Performance',
          },
          {
            label: 'Görsel optimizasyonu',
            path: 'best-practices/performance/image-optimization',
            contentPath: 'guide/image-optimization',
            category: 'Loading Performance',
          },
          {
            label: 'Sunucu taraflı oluşturma',
            path: 'best-practices/performance/ssr',
            contentPath: 'guide/ssr',
            category: 'Loading Performance',
          },

          // Runtime Performance
          {
            label: 'Genel Bakış',
            path: 'best-practices/runtime-performance',
            contentPath: 'best-practices/runtime-performance/overview',
            category: 'Runtime Performance',
          },
          {
            label: 'Zoneless',
            path: 'guide/zoneless',
            contentPath: 'guide/zoneless',
            category: 'Runtime Performance',
          },
          {
            label: 'Yavaş hesaplamalar',
            path: 'best-practices/slow-computations',
            contentPath: 'best-practices/runtime-performance/slow-computations',
            category: 'Runtime Performance',
          },
          {
            label: 'Bileşen alt ağaçlarını atlama',
            path: 'best-practices/skipping-subtrees',
            contentPath: 'best-practices/runtime-performance/skipping-subtrees',
            category: 'Runtime Performance',
          },
          {
            label: 'Zone kirliliği',
            path: 'best-practices/zone-pollution',
            contentPath: 'best-practices/runtime-performance/zone-pollution',
            category: 'Runtime Performance',
          },

          {
            label: 'Chrome DevTools profilleme',
            path: 'best-practices/profiling-with-chrome-devtools',
            contentPath: 'best-practices/runtime-performance/profiling-with-chrome-devtools',
            category: 'Runtime Performance',
          },
        ],
      },
      {
        label: 'Güncel kalma',
        path: 'update',
        contentPath: 'best-practices/update',
      },
    ],
  },
  {
    label: 'Geliştirici Etkinlikleri',
    children: [
      {
        label: 'Angular v21 Sürümü',
        path: 'events/v21',
        contentPath: 'events/v21',
        status: 'new',
      },
    ],
  },
  {
    label: 'Genişletilmiş Ekosistem',
    children: [
      {
        label: 'NgModules',
        path: 'guide/ngmodules/overview',
        contentPath: 'guide/ngmodules/overview',
      },
      {
        label: 'Eski Animasyonlar',
        children: [
          {
            label: 'Genel Bakış',
            path: 'guide/legacy-animations',
            contentPath: 'guide/animations/overview',
          },
          {
            label: 'Geçiş ve Tetikleyiciler',
            path: 'guide/legacy-animations/transition-and-triggers',
            contentPath: 'guide/animations/transition-and-triggers',
          },
          {
            label: 'Karmaşık Diziler',
            path: 'guide/legacy-animations/complex-sequences',
            contentPath: 'guide/animations/complex-sequences',
          },
          {
            label: 'Yeniden Kullanılabilir Animasyonlar',
            path: 'guide/legacy-animations/reusable-animations',
            contentPath: 'guide/animations/reusable-animations',
          },
          {
            label: 'Yerel CSS Animasyonlarına Geçiş',
            path: 'guide/animations/migration',
            contentPath: 'guide/animations/migration',
          },
        ],
      },
      {
        label: 'Angular ile RxJS Kullanımı',
        children: [
          {
            label: 'Sinyal etkileşimi',
            path: 'ecosystem/rxjs-interop',
            contentPath: 'ecosystem/rxjs-interop/signals-interop',
          },
          {
            label: 'Bileşen output etkileşimi',
            path: 'ecosystem/rxjs-interop/output-interop',
            contentPath: 'ecosystem/rxjs-interop/output-interop',
          },
          {
            label: 'takeUntilDestroyed ile abonelik iptali',
            path: 'ecosystem/rxjs-interop/take-until-destroyed',
            contentPath: 'ecosystem/rxjs-interop/take-until-destroyed',
          },
        ],
      },
      {
        label: "Service Worker'lar ve PWA'lar",
        children: [
          {
            label: 'Genel Bakış',
            path: 'ecosystem/service-workers',
            contentPath: 'ecosystem/service-workers/overview',
          },
          {
            label: 'Başlangıç',
            path: 'ecosystem/service-workers/getting-started',
            contentPath: 'ecosystem/service-workers/getting-started',
          },
          {
            label: 'Özel service worker betikleri',
            path: 'ecosystem/service-workers/custom-service-worker-scripts',
            contentPath: 'ecosystem/service-workers/custom-service-worker-scripts',
          },
          {
            label: 'Yapılandırma dosyası',
            path: 'ecosystem/service-workers/config',
            contentPath: 'ecosystem/service-workers/config',
          },
          {
            label: 'Service worker ile iletişim',
            path: 'ecosystem/service-workers/communications',
            contentPath: 'ecosystem/service-workers/communications',
          },
          {
            label: 'Push bildirimleri',
            path: 'ecosystem/service-workers/push-notifications',
            contentPath: 'ecosystem/service-workers/push-notifications',
          },
          {
            label: 'Service worker devops',
            path: 'ecosystem/service-workers/devops',
            contentPath: 'ecosystem/service-workers/devops',
          },
          {
            label: 'App shell kalıbı',
            path: 'ecosystem/service-workers/app-shell',
            contentPath: 'ecosystem/service-workers/app-shell',
          },
        ],
      },
      {
        label: "Web worker'lar",
        path: 'ecosystem/web-workers',
        contentPath: 'ecosystem/web-workers',
      },
      {
        label: 'Özel derleme hattı',
        path: 'ecosystem/custom-build-pipeline',
        contentPath: 'ecosystem/custom-build-pipeline',
      },
      {
        label: 'Tailwind',
        path: 'guide/tailwind',
        contentPath: 'guide/tailwind',
        status: 'new',
      },
      {
        label: 'Angular Fire',
        path: 'https://github.com/angular/angularfire#readme',
      },
      {
        label: 'Google Maps',
        path: 'https://github.com/angular/components/tree/main/src/google-maps#readme',
      },
      {
        label: 'Google Pay',
        path: 'https://github.com/google-pay/google-pay-button#angular',
      },
      {
        label: 'YouTube player',
        path: 'https://github.com/angular/components/blob/main/src/youtube-player/README.md',
      },
      {
        label: 'Angular CDK',
        path: 'https://material.angular.dev/cdk/categories',
      },
      {
        label: 'Angular Material',
        path: 'https://material.angular.dev/',
      },
    ],
  },
  ...(isDevMode()
    ? [
        {
          label: 'Adev Geliştirici Rehberi',
          children: [
            {
              label: 'Kitchen Sink',
              path: 'kitchen-sink',
              contentPath: 'kitchen-sink',
            },
          ],
        },
      ]
    : []),
];

export const TUTORIALS_SUB_NAVIGATION_DATA: NavigationItem[] = [
  FIRST_APP_TUTORIAL_NAV_DATA,
  LEARN_ANGULAR_TUTORIAL_NAV_DATA,
  DEFERRABLE_VIEWS_TUTORIAL_NAV_DATA,
  SIGNALS_TUTORIAL_NAV_DATA,
  SIGNAL_FORMS_TUTORIAL_NAV_DATA,
  {
    path: 'tutorials',
    contentPath: 'tutorials/home',
    label: 'Eğitimler',
  },
];

export const REFERENCE_SUB_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: 'Yol Haritası',
    path: 'roadmap',
    contentPath: 'reference/roadmap',
  },
  {
    label: 'Katkıda bulunun',
    path: 'https://github.com/angular/angular/blob/main/CONTRIBUTING.md',
  },
  {
    label: 'API Referansı',
    preserveOtherCategoryOrder: true,
    children: [
      {
        label: 'Genel Bakış',
        path: 'api',
      },
      ...getApiNavigationItems(),
    ],
  },
  {
    label: 'CLI Referansı',
    children: [
      {
        label: 'Genel Bakış',
        path: 'cli',
        contentPath: 'reference/cli',
      },
      {
        label: 'ng add',
        path: 'cli/add',
      },
      {
        label: 'ng analytics',
        children: [
          {
            label: 'Genel Bakış',
            path: 'cli/analytics',
          },
          {
            label: 'disable',
            path: 'cli/analytics/disable',
          },
          {
            label: 'enable',
            path: 'cli/analytics/enable',
          },
          {
            label: 'info',
            path: 'cli/analytics/info',
          },
          {
            label: 'prompt',
            path: 'cli/analytics/prompt',
          },
        ],
      },
      {
        label: 'ng build',
        path: 'cli/build',
      },
      {
        label: 'ng cache',
        children: [
          {
            label: 'Genel Bakış',
            path: 'cli/cache',
          },
          {
            label: 'clean',
            path: 'cli/cache/clean',
          },
          {
            label: 'disable',
            path: 'cli/cache/disable',
          },
          {
            label: 'enable',
            path: 'cli/cache/enable',
          },
          {
            label: 'info',
            path: 'cli/cache/info',
          },
        ],
      },
      {
        label: 'ng completion',
        children: [
          {
            label: 'Genel Bakış',
            path: 'cli/completion',
          },
          {
            label: 'script',
            path: 'cli/completion/script',
          },
        ],
      },
      {
        label: 'ng config',
        path: 'cli/config',
      },
      {
        label: 'ng deploy',
        path: 'cli/deploy',
      },
      {
        label: 'ng e2e',
        path: 'cli/e2e',
      },
      {
        label: 'ng extract-i18n',
        path: 'cli/extract-i18n',
      },
      {
        label: 'ng generate',
        children: [
          {
            label: 'Genel Bakış',
            path: 'cli/generate',
          },
          {
            label: 'ai-config',
            path: 'cli/generate/ai-config',
          },
          {
            label: 'app-shell',
            path: 'cli/generate/app-shell',
          },
          {
            label: 'application',
            path: 'cli/generate/application',
          },
          {
            label: 'class',
            path: 'cli/generate/class',
          },
          {
            label: 'component',
            path: 'cli/generate/component',
          },
          {
            label: 'config',
            path: 'cli/generate/config',
          },
          {
            label: 'directive',
            path: 'cli/generate/directive',
          },
          {
            label: 'enum',
            path: 'cli/generate/enum',
          },
          {
            label: 'environments',
            path: 'cli/generate/environments',
          },
          {
            label: 'guard',
            path: 'cli/generate/guard',
          },
          {
            label: 'interceptor',
            path: 'cli/generate/interceptor',
          },
          {
            label: 'interface',
            path: 'cli/generate/interface',
          },
          {
            label: 'library',
            path: 'cli/generate/library',
          },
          {
            label: 'module',
            path: 'cli/generate/module',
          },
          {
            label: 'pipe',
            path: 'cli/generate/pipe',
          },
          {
            label: 'resolver',
            path: 'cli/generate/resolver',
          },
          {
            label: 'service-worker',
            path: 'cli/generate/service-worker',
          },
          {
            label: 'service',
            path: 'cli/generate/service',
          },
          {
            label: 'web-worker',
            path: 'cli/generate/web-worker',
          },
        ],
      },
      {
        label: 'ng lint',
        path: 'cli/lint',
      },
      {
        label: 'ng new',
        path: 'cli/new',
      },
      {
        label: 'ng run',
        path: 'cli/run',
      },
      {
        label: 'ng serve',
        path: 'cli/serve',
      },
      {
        label: 'ng test',
        path: 'cli/test',
      },
      {
        label: 'ng update',
        path: 'cli/update',
      },
      {
        label: 'ng version',
        path: 'cli/version',
      },
    ],
  },
  {
    label: 'Hata Ansiklopedisi',
    children: [
      {
        label: 'Genel Bakış',
        path: 'errors',
        contentPath: 'reference/errors/overview',
      },
      ...ERRORS_NAV_DATA,
    ],
  },
  {
    label: 'Genişletilmiş Tanılamalar',
    children: [
      {
        label: 'Genel Bakış',
        path: 'extended-diagnostics',
        contentPath: 'reference/extended-diagnostics/overview',
      },
      ...EXT_DIAGNOSTICS_NAV_DATA,
    ],
  },
  {
    label: 'Sürüm ve yayınlar',
    path: 'reference/releases',
    contentPath: 'reference/releases',
  },
  {
    label: 'Sürüm uyumluluğu',
    path: 'reference/versions',
    contentPath: 'reference/versions',
  },
  {
    label: 'Güncelleme rehberi',
    path: 'update-guide',
  },
  {
    label: 'Yapılandırmalar',
    children: [
      {
        label: 'Dosya yapısı',
        path: 'reference/configs/file-structure',
        contentPath: 'reference/configs/file-structure',
      },
      {
        label: 'Çalışma alanı yapılandırması',
        path: 'reference/configs/workspace-config',
        contentPath: 'reference/configs/workspace-config',
      },
      {
        label: 'Angular derleyici seçenekleri',
        path: 'reference/configs/angular-compiler-options',
        contentPath: 'reference/configs/angular-compiler-options',
      },
      {
        label: 'npm bağımlılıkları',
        path: 'reference/configs/npm-packages',
        contentPath: 'reference/configs/npm-packages',
      },
    ],
  },
  {
    label: 'Geçişler',
    children: [
      {
        label: 'Genel Bakış',
        path: 'reference/migrations',
        contentPath: 'reference/migrations/overview',
      },
      {
        label: 'Standalone',
        path: 'reference/migrations/standalone',
        contentPath: 'reference/migrations/standalone',
      },
      {
        label: 'Kontrol Akışı Söz Dizimi',
        path: 'reference/migrations/control-flow',
        contentPath: 'reference/migrations/control-flow',
      },
      {
        label: 'inject() Fonksiyonu',
        path: 'reference/migrations/inject-function',
        contentPath: 'reference/migrations/inject-function',
      },
      {
        label: 'Tembel yüklenen rotalar',
        path: 'reference/migrations/route-lazy-loading',
        contentPath: 'reference/migrations/route-lazy-loading',
      },
      {
        label: "Sinyal input'ları",
        path: 'reference/migrations/signal-inputs',
        contentPath: 'reference/migrations/signal-inputs',
      },
      {
        label: "Output'lar",
        path: 'reference/migrations/outputs',
        contentPath: 'reference/migrations/outputs',
      },
      {
        label: 'Sinyal sorguları',
        path: 'reference/migrations/signal-queries',
        contentPath: 'reference/migrations/signal-queries',
      },
      {
        label: "Kullanılmayan import'ları temizleme",
        path: 'reference/migrations/cleanup-unused-imports',
        contentPath: 'reference/migrations/cleanup-unused-imports',
      },
      {
        label: 'Kendini kapatan etiketler',
        path: 'reference/migrations/self-closing-tags',
        contentPath: 'reference/migrations/self-closing-tags',
      },
      {
        label: "NgClass'tan Class'a",
        path: 'reference/migrations/ngclass-to-class',
        contentPath: 'reference/migrations/ngclass-to-class',
        status: 'new',
      },
      {
        label: "NgStyle'dan Style'a",
        path: 'reference/migrations/ngstyle-to-style',
        contentPath: 'reference/migrations/ngstyle-to-style',
        status: 'new',
      },
      {
        label: 'Router Test Modülü Geçişi',
        path: 'reference/migrations/router-testing-module-migration',
        contentPath: 'reference/migrations/router-testing-module-migration',
        status: 'new',
      },
      {
        label: "CommonModule'den Standalone'a",
        path: 'reference/migrations/common-to-standalone',
        contentPath: 'reference/migrations/common-to-standalone',
        status: 'new',
      },
    ],
  },
];

export const FOOTER_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: 'Basın Kiti',
    path: 'press-kit',
    contentPath: 'reference/press-kit',
  },
  {
    label: 'Lisans',
    path: 'license',
    contentPath: 'reference/license',
  },
];

export const ALL_ITEMS = [
  ...DOCS_SUB_NAVIGATION_DATA,
  ...REFERENCE_SUB_NAVIGATION_DATA,
  ...FOOTER_NAVIGATION_DATA,
  ...TUTORIALS_SUB_NAVIGATION_DATA,
];

function getApiNavigationItems(): NavigationItem[] {
  const manifest = API_MANIFEST_JSON as any; // TODO(mri): Use proper type when the refactoring of #66252 gets in.

  const apiNavigationItems: NavigationItem[] = [];

  for (const packageEntry of manifest) {
    const packageNavigationItem: NavigationItem = {
      label: packageEntry.moduleLabel,
      children: packageEntry.entries.map((api: any) => ({
        path: getApiUrl(packageEntry, api.name),
        label: api.name,
        category: api.category,
      })),
    };

    apiNavigationItems.push(packageNavigationItem);
  }

  return apiNavigationItems;
}

function getApiUrl(packageEntry: any, apiName: string): string {
  const packageName = packageEntry.normalizedModuleName
    // packages like `angular_core` should be `core`
    // packages like `angular_animation_browser` should be `animation/browser`
    .replace('angular_', '')
    .replaceAll('_', '/');
  return `api/${packageName}/${apiName}`;
}
