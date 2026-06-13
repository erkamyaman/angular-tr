# Test'lerde hata ayıklama

Testleriniz beklediğiniz gibi çalışmıyorsa, hem varsayılan Node.js ortamında hem de gerçek bir tarayıcıda hata ayıklayabilirsiniz.

## Node.js'de hata ayıklama

Varsayılan Node.js ortamında hata ayıklama, tarayıcıya özgü API'ler veya render ile ilgili olmayan sorunları teşhis etmenin genellikle en hızlı yoludur.

1.  `ng test` komutunu `--debug` bayrağı ile çalıştırın:
    ```shell
    ng test --debug
    ```
2.  Test çalıştırıcısı hata ayıklama modunda başlar ve bir hata ayıklayıcının bağlanmasını bekler.
3.  Artık tercih ettiğiniz hata ayıklayıcıyı bağlayabilirsiniz. Örneğin, VS Code'daki yerleşik Node.js hata ayıklayıcısını veya Node.js için Chrome DevTools'u kullanabilirsiniz.

## Tarayıcıda hata ayıklama

Node'da bir hata ayıklama oturumu başlattığınız şekilde, Vitest ve [tarayıcı modu](/guide/testing/migrating-to-vitest#5-tarayıcı-modunu-yapılandırma-isteğe-bağlı) ile `ng test`'i `--debug` bayrağı ile kullanabilirsiniz.

Test çalıştırıcısı hata ayıklama modunda başlar ve testleri hata ayıklamak için tarayıcı geliştirici araçlarını açmanızı bekler.
