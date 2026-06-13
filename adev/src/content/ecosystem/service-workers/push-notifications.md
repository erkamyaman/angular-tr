# Push bildirimleri

Push bildirimleri, kullanıcılarla etkileşim kurmanın etkileyici bir yoludur.
Service worker'ların gücüyle, uygulamanız odakta olmasa bile bir cihaza bildirimler iletilebilir.

Angular service worker'ı, push bildirimlerinin görüntülenmesini ve bildirim tıklama olaylarının işlenmesini sağlar.

HELPFUL: Angular service worker kullanılırken, push bildirim etkileşimleri `SwPush` servisi kullanılarak işlenir.
İlgili tarayıcı API'leri hakkında daha fazla bilgi edinmek için [Push API](https://developer.mozilla.org/docs/Web/API/Push_API) ve [Using the Notifications API](https://developer.mozilla.org/docs/Web/API/Notifications_API/Using_the_Notifications_API) sayfalarına bakın.

## Bildirim yükü

Geçerli bir yük ile bir mesaj göndererek push bildirimlerini tetikleyin.
Rehberlik için `SwPush` belgelerine bakın.

HELPFUL: Chrome'da, bir backend olmadan push bildirimlerini test edebilirsiniz.
Devtools -> Application -> Service Workers'ı açın ve bir JSON bildirim yükü göndermek için `Push` girdisini kullanın.

## Bildirim tıklama işleme

`notificationclick` olayı için varsayılan davranış, bildirimi kapatmak ve `SwPush.notificationClicks`'i bilgilendirmektir.

`data` nesnesine bir `onActionClick` özelliği ekleyerek ve bir `default` girişi sağlayarak `notificationclick` üzerinde yürütülecek ek bir işlem belirtebilirsiniz.
Bu, özellikle bir bildirim tıklandığında açık istemci olmadığında kullanışlıdır.

```json
{
  "notification": {
    "title": "New Notification!",
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow", "url": "foo"}
      }
    }
  }
}
```

### İşlemler

Angular service worker aşağıdaki işlemleri destekler:

| İşlemler                    | Ayrıntılar                                                                                                                       |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `openWindow`                | Belirtilen URL'de yeni bir sekme açar.                                                                                           |
| `focusLastFocusedOrOpen`    | Son odaklanılan istemciye odaklanır. Açık istemci yoksa, belirtilen URL'de yeni bir sekme açar.                                  |
| `navigateLastFocusedOrOpen` | Son odaklanılan istemciye odaklanır ve belirtilen URL'ye yönlendirir. Açık istemci yoksa, belirtilen URL'de yeni bir sekme açar. |
| `sendRequest`               | Belirtilen URL'ye basit bir GET isteği gönderir.                                                                                 |

IMPORTANT: URL'ler, service worker'ın kayıt kapsamına göre çözümlenir.<br />Bir `onActionClick` öğesi bir `url` tanımlamazsa, service worker'ın kayıt kapsamı kullanılır.

### Eylemler

Eylemler, kullanıcının bir bildirimle nasıl etkileşim kurabileceğini özelleştirmenin bir yolunu sunar.

`actions` özelliğini kullanarak, mevcut eylemlerin bir setini tanımlayabilirsiniz.
Her eylem, kullanıcının bildirimle etkileşim kurmak için tıklayabileceği bir eylem düğmesi olarak temsil edilir.

Ayrıca, `data` nesnesindeki `onActionClick` özelliğini kullanarak, ilgili eylem düğmesi tıklandığında gerçekleştirilecek bir işleme her eylemi bağlayabilirsiniz:

```json
{
  "notification": {
    "title": "New Notification!",
    "actions": [
      {"action": "foo", "title": "Open new tab"},
      {"action": "bar", "title": "Focus last"},
      {"action": "baz", "title": "Navigate last"},
      {"action": "qux", "title": "Send request in the background"},
      {"action": "other", "title": "Just notify existing clients"}
    ],
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow"},
        "foo": {"operation": "openWindow", "url": "/absolute/path"},
        "bar": {"operation": "focusLastFocusedOrOpen", "url": "relative/path"},
        "baz": {"operation": "navigateLastFocusedOrOpen", "url": "https://other.domain.com/"},
        "qux": {"operation": "sendRequest", "url": "https://yet.another.domain.com/"}
      }
    }
  }
}
```

IMPORTANT: Bir eylemin karşılık gelen `onActionClick` girişi yoksa, bildirim kapatılır ve mevcut istemcilerde `SwPush.notificationClicks` bilgilendirilir.

## Angular service worker'lar hakkında daha fazlası

Aşağıdakiler de ilginizi çekebilir:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/communications" title="Communicating with the Service Worker"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
</docs-pill-row>
