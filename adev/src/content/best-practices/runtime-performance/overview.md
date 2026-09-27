# Çalışma zamanı performans optimizasyonu

Hızlı render Angular için kritik öneme sahiptir ve performanslı uygulamalar geliştirmenize yardımcı olmak için framework'u birçok optimizasyon düşünülerek oluşturduk. Uygulamanızın performansını daha iyi anlamak için [Angular DevTools](tools/devtools) ve profil çıkarma için Chrome DevTools'un nasıl kullanılacağına dair bir [video kılavuzu](https://www.youtube.com/watch?v=FjyX_hkscII) sunuyoruz. Bu bölümde en yaygın performans optimizasyon tekniklerini ele alıyoruz.

**Değişiklik algılama**, Angular'ın uygulama durumunuzun değişip değişmediğini ve herhangi bir DOM'un güncellenmesi gerekip gerekmediğini kontrol ettiği süreçtir. Üst düzey de, Angular bileşenlerinizi yukarıdan aşağıya doğru gezerek değişiklikleri arar. Angular, veri modelindeki değişikliklerin bir uygulamanın görünümüne yansıtılması için değişiklik algılama mekanizmasını periyodik olarak çalıştırır. Değişiklik algılama, ya manuel olarak ya da bir asenkron olay (örneğin bir kullanıcı etkileşimi veya bir XMLHttpRequest tamamlanması) aracılığıyla tetiklenebilir.

Değişiklik algılama son derece optimize edilmiş ve performanslıdır, ancak uygulama onu çok sık çalıştırırsa yavaşlamalara neden olabilir.

Bu kılavuzda, uygulamanızın bölümleri atlayarak ve değişiklik algılamayı yalnızca gerekli olduğunda çalıştırarak değişiklik algılama mekanizmasını nasıl kontrol edip optimize edeceğinizi öğreneceksiniz.

Performans optimizasyonları hakkında bir medya formatında daha fazla bilgi edinmeyi tercih ediyorsanız bu videoyu izleyin:

<docs-video src="https://www.youtube.com/embed/f8sA-i6gkGQ"/>
