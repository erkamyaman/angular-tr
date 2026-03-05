# Drag and drop

## Overview

Bu sayfa, aşağıdaki işlevlerle hızlıca sürükle ve bırak arayüzleri oluşturmanıza olanak tanıyan sürükle ve bırak direktiflerini açıklar:

- Serbest sürükleme
- Yeniden sıralanabilir sürüklenebilir öğelerin listesini oluşturma
- Sürüklenebilir öğeleri listeler arasında aktarma
- Sürükleme animasyonları
- Sürüklenebilir öğeleri bir eksen veya öğe boyunca kilitleme
- Özel sürükleme tutamaçları ekleme
- Sürükleme sırasında önizlemeler ekleme
- Özel sürükleme yer tutucusu ekleme

Tam API referansı için lütfen [Angular CDK'nin sürükle ve bırak API referans sayfasına](api#angular_cdk_drag-drop) bakın.

## Before you start

### CDK Installation

[Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories), bileşen oluşturmak için bir davranış ilkeleri setidir. Sürükle ve bırak direktiflerini kullanmak için önce npm'den `@angular/cdk` yükleyin. Bunu Angular CLI kullanarak terminalinizden yapabilirsiniz:

```shell
ng add @angular/cdk
```

### Importing drag and drop

Sürükle ve bırakı kullanmak için bileşeninizde direktiflerden ihtiyacınız olanları içe aktarın.

```ts
import {Component} from '@angular/core';
import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'drag-drop-example',
  templateUrl: 'drag-drop-example.html',
  imports: [CdkDrag],
})
export class DragDropExample {}
```

## Create draggable elements

`cdkDrag` direktifini ekleyerek herhangi bir öğeyi sürüklenebilir yapabilirsiniz. Varsayılan olarak, tüm sürüklenebilir öğeler serbest sürüklemeyi destekler.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/overview/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/overview/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/overview/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/overview/app/app.css"/>
</docs-code-multifile>

## Create a list of reorderable draggable elements

Sürüklenebilir öğeleri yeniden sıralanabilir bir koleksiyona gruplamak için bir üst öğeye `cdkDropList` direktifini ekleyin. Bu, sürüklenebilir öğelerin nereye bırakılabileceğini tanımlar. Bırakma listesi grubundaki sürüklenebilir öğeler, bir öğe hareket ettiğinde otomatik olarak yeniden düzenlenir.

Sürükle ve bırak direktifleri veri modelinizi güncellemez. Veri modelini güncellemek için `cdkDropListDropped` olayını dinleyin (kullanıcı sürüklemeyi bitirdiğinde) ve veri modelini manuel olarak güncelleyin.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/sorting/app/app.css"/>
</docs-code-multifile>

`cdkDropList` örneklerine referans vermek için kullanılabilen `CDK_DROP_LIST` enjeksiyon token'ını kullanabilirsiniz. Daha fazla bilgi için [bağımlılık enjeksiyonu kılavuzuna](/guide/di) ve [bırakma listesi enjeksiyon token'ı API'sine](api/cdk/drag-drop/CDK_DROP_LIST) bakın.

## Transfer draggable elements between lists

`cdkDropList` direktifi, bağlı bırakma listeleri arasında sürüklenebilir öğelerin aktarılmasını destekler. Bir veya daha fazla `cdkDropList` örneğini birbirine bağlamanın iki yolu vardır:

- `cdkDropListConnectedTo` özelliğini başka bir bırakma listesine ayarlayın.
- Öğeleri `cdkDropListGroup` niteliğine sahip bir öğe ile sarın.

`cdkDropListConnectedTo` direktifi hem başka bir `cdkDropList`'e doğrudan referans hem de başka bir bırakma kapsayıcısının kimliğine referans ile çalışır.

```html
<!-- This is valid -->
<div cdkDropList #listOne="cdkDropList" [cdkDropListConnectedTo]="[listTwo]"></div>
<div cdkDropList #listTwo="cdkDropList" [cdkDropListConnectedTo]="[listOne]"></div>

<!-- This is valid as well -->
<div cdkDropList id="list-one" [cdkDropListConnectedTo]="['list-two']"></div>
<div cdkDropList id="list-two" [cdkDropListConnectedTo]="['list-one']"></div>
```

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.css"/>
</docs-code-multifile>

Bilinmeyen sayıda bağlı bırakma listeniz varsa bağlantıyı otomatik olarak kurmak için `cdkDropListGroup` direktifini kullanın. Bir grup altına eklenen herhangi bir yeni `cdkDropList` otomatik olarak diğer tüm listelere bağlanır.

```angular-html
<div cdkDropListGroup>
  <!-- All lists in here will be connected. -->
  @for (list of lists; track list) {
    <div cdkDropList></div>
  }
</div>
```

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.css"/>
</docs-code-multifile>

`cdkDropListGroup` örneklerine referans vermek için kullanılabilen `CDK_DROP_LIST_GROUP` enjeksiyon token'ını kullanabilirsiniz. Daha fazla bilgi için [bağımlılık enjeksiyonu kılavuzuna](/guide/di) ve [bırakma listesi grubu enjeksiyon token'ı API'sine](api/cdk/drag-drop/CDK_DROP_LIST_GROUP) bakın.

### Selective dragging

Varsayılan olarak, bir kullanıcı `cdkDrag` öğelerini bir kapsayıcıdan bağlı başka bir kapsayıcıya taşıyabilir. Hangi öğelerin bir kapsayıcıya bırakılabileceği üzerinde daha ayrıntılı kontrol için `cdkDropListEnterPredicate` kullanın. Angular, sürüklenebilir bir öğe yeni bir kapsayıcıya her girdiğinde yüklemi çağırır. Yüklemin true veya false döndürmesine bağlı olarak, öğeye yeni kapsayıcıya girilmesine izin verilebilir veya verilmeyebilir.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.css"/>
</docs-code-multifile>

## Attach data

Sırasıyla `cdkDragData` veya `cdkDropListData` ayarlayarak hem `cdkDrag` hem de `cdkDropList` ile rastgele veriler ilişkilendirebilirsiniz. Her iki direktiften tetiklenen olaylara bağlanabilir ve bu veriler dahil olacaktır, böylece sürükleme veya bırakma etkileşiminin kaynağını kolayca tanımlayabilirsiniz.

```angular-html
@for (list of lists; track list) {
  <div cdkDropList [cdkDropListData]="list" (cdkDropListDropped)="drop($event)">
    @for (item of list; track item) {
      <div cdkDrag [cdkDragData]="item"></div>
    }
  </div>
}
```

## Dragging customizations

### Customize drag handle

Varsayılan olarak, kullanıcı onu hareket ettirmek için tüm `cdkDrag` öğesini sürükleyebilir. Kullanıcıyı bunu yalnızca bir tutamaç öğesi kullanarak yapabilmeye kısıtlamak için `cdkDrag` içindeki bir öğeye `cdkDragHandle` direktifini ekleyin. İstediğiniz kadar `cdkDragHandle` öğesine sahip olabilirsiniz.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.css"/>
</docs-code-multifile>

`cdkDragHandle` örneklerine referans vermek için kullanılabilen `CDK_DRAG_HANDLE` enjeksiyon token'ını kullanabilirsiniz. Daha fazla bilgi için [bağımlılık enjeksiyonu kılavuzuna](/guide/di) ve [sürükleme tutamacı enjeksiyon token'ı API'sine](api/cdk/drag-drop/CDK_DRAG_HANDLE) bakın.

### Customize drag preview

Bir `cdkDrag` öğesi sürüklenirken bir önizleme öğesi görünür hale gelir. Varsayılan olarak önizleme, kullanıcının imlecinin yanında konumlandırılmış orijinal öğenin bir klonudur.

Önizlemeyi özelleştirmek için `*cdkDragPreview` aracılığıyla özel bir şablon sağlayın. Özel önizleme, öğenin içeriği hakkında varsayımlar yapılmadığından orijinal sürüklenen öğenin boyutuyla eşleşmez. Öğe boyutuyla eşleştirmek için `matchSize` girişine true geçirin.

Klonlanan öğe, sayfada aynı kimliğe sahip birden fazla öğe olmasını önlemek için id niteliğini kaldırır. Bu, o kimliği hedefleyen herhangi bir CSS'in uygulanmamasına neden olur.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.css"/>
</docs-code-multifile>

`cdkDragPreview` örneklerine referans vermek için kullanılabilen `CDK_DRAG_PREVIEW` enjeksiyon token'ını kullanabilirsiniz. Daha fazla bilgi için [bağımlılık enjeksiyonu kılavuzuna](/guide/di) ve [sürükleme önizlemesi enjeksiyon token'ı API'sine](api/cdk/drag-drop/CDK_DRAG_PREVIEW) bakın.

### Customize drag insertion point

Varsayılan olarak, Angular konumlandırma ve taşma ile ilgili sorunları önlemek için `cdkDrag` önizlemesini sayfanın `<body>` öğesine ekler. Bazı durumlarda bu istenmeyebilir çünkü önizleme devralınan stilleri almayacaktır.

Angular'ın önizlemeyi nereye eklediğini `cdkDrag` üzerindeki `cdkDragPreviewContainer` girişini kullanarak değiştirebilirsiniz. Olası değerler şunlardır:

| Value                           | Description                                                                    | Advantages                                                                                                                        | Disadvantages                                                                                                                                                                                  |
| :------------------------------ | :----------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `global`                        | Varsayılan değer. Angular önizlemeyi <body> veya en yakın shadow root'a ekler. | Önizleme `z-index` veya `overflow: hidden` tarafından etkilenmez. Ayrıca `:nth-child` seçicilerini ve flex düzenlerini etkilemez. | Devralınan stilleri almaz.                                                                                                                                                                     |
| `parent`                        | Angular önizlemeyi sürüklenen öğenin üst öğesi içine ekler.                    | Önizleme sürüklenen öğe ile aynı stilleri devralır.                                                                               | Önizleme `overflow: hidden` tarafından kırpılabilir veya `z-index` nedeniyle diğer öğelerin altına yerleştirilebilir. Ayrıca `:nth-child` seçicilerini ve bazı flex düzenlerini etkileyebilir. |
| `ElementRef` veya `HTMLElement` | Angular önizlemeyi belirtilen öğeye ekler.                                     | Önizleme belirtilen kapsayıcı öğeden stilleri devralır.                                                                           | Önizleme `overflow: hidden` tarafından kırpılabilir veya `z-index` nedeniyle diğer öğelerin altına yerleştirilebilir. Ayrıca `:nth-child` seçicilerini ve bazı flex düzenlerini etkileyebilir. |

Alternatif olarak, değer `global` veya `parent` ise yapılandırma içinde `previewContainer`'ı güncellemek için `CDK_DRAG_CONFIG` enjeksiyon token'ını değiştirebilirsiniz. Daha fazla bilgi için [bağımlılık enjeksiyonu kılavuzuna](/guide/di), [sürükleme yapılandırması enjeksiyon token'ı API'sine](api/cdk/drag-drop/CDK_DRAG_CONFIG) ve [sürükle bırak yapılandırma API'sine](api/cdk/drag-drop/DragDropConfig) bakın.

### Customize drag placeholder

Bir `cdkDrag` öğesi sürüklenirken, direktif öğenin bırakıldığında nereye yerleştirileceğini gösteren bir yer tutucu öğe oluşturur. Varsayılan olarak, yer tutucu sürüklenen öğenin bir klonudur. `*cdkDragPlaceholder` direktifini kullanarak yer tutucuyu özel biriyle değiştirebilirsiniz:

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.css"/>
</docs-code-multifile>

`cdkDragPlaceholder` örneklerine referans vermek için kullanılabilen `CDK_DRAG_PLACEHOLDER` enjeksiyon token'ını kullanabilirsiniz. Daha fazla bilgi için [bağımlılık enjeksiyonu kılavuzuna](/guide/di) ve [sürükleme yer tutucusu enjeksiyon token'ı API'sine](api/cdk/drag-drop/CDK_DRAG_PLACEHOLDER) bakın.

### Customize drag root element

Sürüklenebilir yapmak istediğiniz ancak doğrudan erişiminiz olmayan bir öğe varsa `cdkDragRootElement` niteliğini ayarlayın.

Nitelik bir seçici kabul eder ve seçiciyle eşleşen bir öğe bulana kadar DOM'u yukarı doğru arar. Bir öğe bulunursa sürüklenebilir hale gelir. Bu, bir diyaloğu sürüklenebilir yapmak gibi durumlar için kullanışlıdır.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/root-element/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/root-element/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/root-element/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/root-element/app/app.css"/>
</docs-code-multifile>

Alternatif olarak, yapılandırma içinde `rootElementSelector`'ı güncellemek için `CDK_DRAG_CONFIG` enjeksiyon token'ını değiştirebilirsiniz. Daha fazla bilgi için [bağımlılık enjeksiyonu kılavuzuna](/guide/di), [sürükleme yapılandırması enjeksiyon token'ı API'sine](api/cdk/drag-drop/CDK_DRAG_CONFIG) ve [sürükle bırak yapılandırma API'sine](api/cdk/drag-drop/DragDropConfig) bakın.

### Set DOM position of a draggable element

Varsayılan olarak, `cdkDropList` içinde olmayan `cdkDrag` öğeleri yalnızca kullanıcı öğeyi manuel olarak hareket ettirdiğinde normal DOM konumlarından hareket eder. Öğenin konumunu açıkça ayarlamak için `cdkDragFreeDragPosition` girişini kullanın. Bunun yaygın bir kullanım durumu, kullanıcı uzaklaştıktan ve geri döndükten sonra sürüklenebilir bir öğenin konumunu geri yüklemektir.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.css"/>
</docs-code-multifile>

### Restrict movement within an element

Kullanıcının bir `cdkDrag` öğesini başka bir öğenin dışına sürükleyememesini sağlamak için `cdkDragBoundary` niteliğine bir CSS seçicisi geçirin. Bu nitelik bir seçici kabul eder ve eşleşen bir öğe bulana kadar DOM'u yukarı doğru arar. Bir eşleşme bulunursa, öğe sürüklenebilir öğenin `cdkDragBoundary` dışına sürüklenemeyeceği sınır haline gelir. `cdkDragBoundary`, `cdkDrag` bir `cdkDropList` içine yerleştirildiğinde de kullanılabilir.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/boundary/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/boundary/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/boundary/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/boundary/app/app.css"/>
</docs-code-multifile>

Alternatif olarak, yapılandırma içinde boundaryElement'i güncellemek için `CDK_DRAG_CONFIG` enjeksiyon token'ını değiştirebilirsiniz. Daha fazla bilgi için [bağımlılık enjeksiyonu kılavuzuna](/guide/di), [sürükleme yapılandırması enjeksiyon token'ı API'sine](api/cdk/drag-drop/CDK_DRAG_CONFIG) ve [sürükle bırak yapılandırma API'sine](api/cdk/drag-drop/DragDropConfig) bakın.

### Restrict movement along an axis

Varsayılan olarak, `cdkDrag` tüm yönlerde serbest harekete izin verir. Sürüklemeyi belirli bir eksene kısıtlamak için `cdkDrag` üzerinde `cdkDragLockAxis`'i "x" veya "y" olarak ayarlayın. `cdkDropList` içindeki birden fazla sürüklenebilir öğe için sürüklemeyi kısıtlamak amacıyla bunun yerine `cdkDropList` üzerinde `cdkDropListLockAxis` ayarlayın.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.css"/>
</docs-code-multifile>

Alternatif olarak, yapılandırma içinde `lockAxis`'i güncellemek için `CDK_DRAG_CONFIG` enjeksiyon token'ını değiştirebilirsiniz. Daha fazla bilgi için [bağımlılık enjeksiyonu kılavuzuna](/guide/di), [sürükleme yapılandırması enjeksiyon token'ı API'sine](api/cdk/drag-drop/CDK_DRAG_CONFIG) ve [sürükle bırak yapılandırma API'sine](api/cdk/drag-drop/DragDropConfig) bakın.

### Delay dragging

Varsayılan olarak kullanıcı bir `cdkDrag` öğesine işaretçisini bastığında sürükleme dizisi başlar. Bu davranış, dokunmatik cihazlarda tam ekran sürüklenebilir öğeler gibi kullanıcının sayfada kaydırma yaparken yanlışlıkla sürükleme olayı tetikleyebileceği durumlarda istenmeyebilir.

`cdkDragStartDelay` girişini kullanarak sürükleme dizisini geciktirebilirsiniz. Giriş, öğeyi sürüklemeden önce kullanıcının belirtilen milisaniye sayısı kadar işaretçisini basılı tutmasını bekler.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.css"/>
</docs-code-multifile>

Alternatif olarak, yapılandırma içinde dragStartDelay'i güncellemek için `CDK_DRAG_CONFIG` enjeksiyon token'ını değiştirebilirsiniz. Daha fazla bilgi için [bağımlılık enjeksiyonu kılavuzuna](/guide/di), [sürükleme yapılandırması enjeksiyon token'ı API'sine](api/cdk/drag-drop/CDK_DRAG_CONFIG) ve [sürükle bırak yapılandırma API'sine](api/cdk/drag-drop/DragDropConfig) bakın.

### Disable dragging

Belirli bir sürükleme öğesi için sürüklemeyi devre dışı bırakmak istiyorsanız, `cdkDrag` öğesinde `cdkDragDisabled` girişini true veya false olarak ayarlayın. `cdkDropList` üzerindeki `cdkDropListDisabled` girişini kullanarak tüm bir listeyi devre dışı bırakabilirsiniz. `cdkDragHandle` üzerindeki `cdkDragHandleDisabled` aracılığıyla belirli bir tutamacı devre dışı bırakmak da mümkündür.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.css"/>
</docs-code-multifile>

Alternatif olarak, yapılandırma içinde `draggingDisabled`'ı güncellemek için `CDK_DRAG_CONFIG` enjeksiyon token'ını değiştirebilirsiniz. Daha fazla bilgi için [bağımlılık enjeksiyonu kılavuzuna](/guide/di), [sürükleme yapılandırması enjeksiyon token'ı API'sine](api/cdk/drag-drop/CDK_DRAG_CONFIG) ve [sürükle bırak yapılandırma API'sine](api/cdk/drag-drop/DragDropConfig) bakın.

## Sorting customizations

### List orientation

Varsayılan olarak, `cdkDropList` direktifi listelerin dikey olduğunu varsayar. Bu, `cdkDropListOrientation` özelliğini horizontal olarak ayarlayarak değiştirilebilir.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.css"/>
</docs-code-multifile>

Alternatif olarak, yapılandırma içinde `listOrientation`'ı güncellemek için `CDK_DRAG_CONFIG` enjeksiyon token'ını değiştirebilirsiniz. Daha fazla bilgi için [bağımlılık enjeksiyonu kılavuzuna](/guide/di), [sürükleme yapılandırması enjeksiyon token'ı API'sine](api/cdk/drag-drop/CDK_DRAG_CONFIG) ve [sürükle bırak yapılandırma API'sine](api/cdk/drag-drop/DragDropConfig) bakın.

### List wrapping

Varsayılan olarak, `cdkDropList` sürüklenebilir öğeleri CSS dönüşümü kullanarak hareket ettirerek sıralar. Bu, sıralama işleminin animasyonlu olmasını sağlayarak daha iyi bir kullanıcı deneyimi sunar. Ancak bu, bırakma listesinin yalnızca bir yönde çalışması dezavantajını da beraberinde getirir: dikey veya yatay.

Yeni satırlara sarılması gereken sıralanabilir bir listeniz varsa, `cdkDropListOrientation` niteliğini `mixed` olarak ayarlayabilirsiniz. Bu, listenin öğeleri DOM'da hareket ettirmeyi içeren farklı bir sıralama stratejisi kullanmasına neden olur. Ancak liste artık sıralama eylemini animasyonlandıramaz.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.css"/>
</docs-code-multifile>

### Selective sorting

Varsayılan olarak, `cdkDrag` öğeleri bir `cdkDropList` içinde herhangi bir konuma sıralanır. Bu davranışı değiştirmek için bir fonksiyon alan `cdkDropListSortPredicate` niteliğini ayarlayın. Yüklem fonksiyonu, sürüklenebilir bir öğe bırakma listesi içinde yeni bir dizine taşınmak üzereyken çağrılır. Yüklem true döndürürse, öğe yeni dizine taşınır, aksi takdirde mevcut konumunu korur.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.css"/>
</docs-code-multifile>

### Disable sorting

Sürüklenebilir öğelerin bir `cdkDropList`'ten diğer bağlı bir listeye sürüklenebildiği ancak kullanıcının bunları kaynak listede sıralamaması gereken durumlar vardır. Bu durumlar için `cdkDropList`'teki sürüklenebilir öğelerin sıralanmasını engellemek amacıyla `cdkDropListSortingDisabled` niteliğini ekleyin. Bu, sürüklenen öğe yeni geçerli bir konuma sürüklenmezse kaynak listedeki ilk konumunu korur.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.css"/>
</docs-code-multifile>

Alternatif olarak, yapılandırma içinde sortingDisabled'ı güncellemek için `CDK_DRAG_CONFIG` enjeksiyon token'ını değiştirebilirsiniz. Daha fazla bilgi için [bağımlılık enjeksiyonu kılavuzuna](/guide/di), [sürükleme yapılandırması enjeksiyon token'ı API'sine](api/cdk/drag-drop/CDK_DRAG_CONFIG) ve [sürükle bırak yapılandırma API'sine](api/cdk/drag-drop/DragDropConfig) bakın.

### Copying items between lists

Varsayılan olarak, bir öğe bir listeden diğerine sürüklendiğinde, orijinal listesinden taşınır. Ancak, orijinal öğeyi kaynak listesinde bırakarak öğeyi kopyalamak için direktifleri yapılandırabilirsiniz.

Kopyalamayı etkinleştirmek için `cdkDropListHasAnchor` girişini ayarlayabilirsiniz. Bu, `cdkDropList`'e orijinal kapsayıcıda kalan ve öğeyle birlikte hareket etmeyen bir "çapa" öğesi oluşturmasını söyler. Kullanıcı öğeyi orijinal kapsayıcıya geri taşırsa, çapa otomatik olarak kaldırılır. Çapa öğesi `.cdk-drag-anchor` CSS sınıfı hedef alınarak stillenebilir.

`cdkDropListHasAnchor`'ı `cdkDropListSortingDisabled` ile birleştirmek, kullanıcının kaynak listeyi yeniden sıralayamadan öğeleri kopyalayabileceği bir liste oluşturmayı mümkün kılar (örneğin bir ürün listesi ve bir alışveriş sepeti).

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/copy-list/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.css"/>
</docs-code-multifile>

## Customize animations

Sürükle ve bırak her ikisi için de animasyonları destekler:

- Sürüklenebilir bir öğeyi liste içinde sıralama
- Sürüklenebilir öğeyi kullanıcının bıraktığı konumdan listenin içindeki son konuma taşıma

Animasyonlarınızı ayarlamak için transform özelliğini hedefleyen bir CSS geçişi tanımlayın. Animasyonlar için aşağıdaki sınıflar kullanılabilir:

| CSS class name      | Result of adding transition                                                                                                                                                                  |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .cdk-drag           | Sürüklenebilir öğeleri sıralanırken animasyonlandırın.                                                                                                                                       |
| .cdk-drag-animating | Sürüklenebilir öğeyi bırakılan konumdan `cdkDropList` içindeki son konuma animasyonlandırın.<br><br>Bu CSS sınıfı bir `cdkDrag` öğesine yalnızca sürükleme eylemi durdurulduğunda uygulanır. |

## Styling

Hem `cdkDrag` hem de `cdkDropList` direktifleri yalnızca işlevsellik için gerekli temel stilleri uygular. Uygulamalar, bu belirtilen CSS sınıflarını hedefleyerek stillerini özelleştirebilir.

| CSS class name           | Description                                                                                                                                                                                                                                            |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .cdk-drop-list           | `cdkDropList` kapsayıcı öğeleri için seçici.                                                                                                                                                                                                           |
| .cdk-drag                | `cdkDrag` öğeleri için seçici.                                                                                                                                                                                                                         |
| .cdk-drag-disabled       | Devre dışı bırakılmış `cdkDrag` öğeleri için seçici.                                                                                                                                                                                                   |
| .cdk-drag-handle         | `cdkDragHandle`'ın host öğesi için seçici.                                                                                                                                                                                                             |
| .cdk-drag-preview        | Sürükleme önizleme öğesi için seçici. Bu, kullanıcı sıralanabilir bir listede öğe sürüklerken imlecin yanında görünen öğedir.<br><br>Öğe, `*cdkDragPreview` aracılığıyla özel bir şablonla özelleştirilmedikçe sürüklenen öğeyle tamamen aynı görünür. |
| .cdk-drag-placeholder    | Sürükleme yer tutucu öğesi için seçici. Bu, sürükleme eylemi sona erdiğinde sürüklenebilir öğenin sürükleneceği noktada gösterilen öğedir.<br><br>Bu öğe, cdkDragPlaceholder direktifiyle özelleştirilmedikçe sıralanan öğeyle tamamen aynı görünür.   |
| .cdk-drop-list-dragging  | Şu anda sürüklenmekte olan bir sürüklenebilir öğeye sahip `cdkDropList` kapsayıcı öğesi için seçici.                                                                                                                                                   |
| .cdk-drop-list-disabled  | Devre dışı bırakılmış `cdkDropList` kapsayıcı öğeleri için seçici.                                                                                                                                                                                     |
| .cdk-drop-list-receiving | Şu anda sürüklenmekte olan bağlı bir bırakma listesinden alabileceği bir sürüklenebilir öğeye sahip `cdkDropList` kapsayıcı öğesi için seçici.                                                                                                         |
| .cdk-drag-anchor         | `cdkDropListHasAnchor` etkinleştirildiğinde oluşturulan çapa öğesi için seçici. Bu öğe, sürüklenen öğenin başladığı konumu gösterir.                                                                                                                   |

## Dragging in a scrollable container

Sürüklenebilir öğeleriniz kaydırılabilir bir kapsayıcı içindeyse (örneğin, `overflow: auto` ile bir `div`), kaydırılabilir kapsayıcıda `cdkScrollable` direktifi olmadıkça otomatik kaydırma çalışmaz. Bu olmadan CDK, sürükleme işlemleri sırasında kapsayıcının kaydırma davranışını algılayamaz veya kontrol edemez.

## Integrations with other components

CDK'nin sürükle ve bırak işlevselliği farklı bileşenlerle entegre edilebilir. Yaygın kullanım durumları arasında sıralanabilir `MatTable` bileşenleri ve sıralanabilir `MatTabGroup` bileşenleri bulunur.
