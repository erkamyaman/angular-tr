# Whitespace in templates

Varsayilan olarak, Angular sablonlari cerceevenin gereksiz kabul ettigi bosluklari korumaz. Bu genellikle iki durumda gerceklesir: elemanlar arasindaki bosluk ve metin icindeki daraltilabilir bosluk.

## Whitespace between elements

Cogu gelistirici sablonlarini okunabilir kilmak icin yeni satirlar ve girintilerle bicmlendirmeyi tercih eder:

```html
<section>
  <h3>User profile</h3>
  <label>
    User name
    <input />
  </label>
</section>
```

Bu sablon tum elemanlar arasinda bosluk icerir. Asagidaki parca, ne kadar bosluk bulundugunu vurgulamak icin her bosluk karakterinin diyez (`#`) karakteriyle degistirildigi ayni HTML'i gostermektedir:

<!-- prettier-ignore>
```html
<!-- Total Whitespace: 20 -->
<section>###<h3>User profile</h3>###<label>#####User name#####<input>###</label>#</section>
```

Boslugu sablonda yazildigi gibi korumak, bircok gereksiz [metin dugumune](https://developer.mozilla.org/en-US/docs/Web/API/Text) yol acar ve sayfa isleme yukunu arttirir. Elemanlar arasindaki bu boslugu yok sayarak, Angular sablonu sayfada islerken daha az is yapar ve genel performansi iyilestirir.

## Collapsible whitespace inside text

Web tarayiciniz HTML'i sayfada islerken, art arda gelen birden fazla bosluk karakterini tek bir karaktere daraltir:

<!-- prettier-ignore -->
```html
<!-- What it looks like in the template -->
<p>Hello         world</p>
```

Bu ornekte, tarayici "Hello" ile "world" arasinda yalnizca tek bir bosluk goruntler.

```angular-html
<!-- What shows up in the browser -->
<p>Hello world</p>
```

Bu nasil calisir hakkinda daha fazla baglam icin [Bosluk HTML, CSS ve DOM'da nasil islenir](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace) konusuna bakin.

Angular, sablonu derlerken bu gereksiz bosluk karakterlerini tek bir karaktere daraltarak tarayiciya gondermekten kacinir.

## Preserving whitespace

Angular'a bir sablondaki boslugu korumasini, bilesen icin `@Component` dekoratorunde `preserveWhitespaces: true` belirterek soyleyebilirsiniz.

```angular-ts
@Component({
  /* ... */,
  preserveWhitespaces: true,
  template: `
    <p>Hello         world</p>
  `
})
```

Kesinlikle gerekli olmadikca bu secenegi ayarlamaktan kacinin. Boslugu korumak, Angular'in isleme sirasinda onemli olcude daha fazla dugum uretmesine neden olarak uygulamanizi yavasllatabilir.

Ek olarak, Angular'a ozgu ozel bir HTML varligi olan `&ngsp;` kullanabilirsiniz. Bu varlik, derlenmis ciktida korunan tek bir bosluk karakteri uretir.
