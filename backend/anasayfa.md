Bir Frontend Geliştirici gibi davranmanı istiyorum. Aşağıda detaylarını verdiğim "Antigravity" projesinin başlangıç ekranını React ile kodlamanı istiyorum.

Lütfen aşağıdaki tasarım belgesindeki (prompt.md) kurallara birebir uy. Özellikle renk paletine (#87CEFA, #E6E6FA, #FFFFFF) ve animasyon isteklerine dikkat et.

ÖNEMLİ NOT: Şu an için herhangi bir "Login Formu" veya "Router" kurulumu yapma. Sadece kartların olduğu karşılama ekranını (UI) kodla. Butonlara tıklandığında sadece console.log çıktısı ver.

İşte Tasarım Belgesi:

# Antigravity Arayüzü - Aşama 1: Karşılama Ekranı (Landing Page)

## 1. Proje ve Görev Özeti
"Antigravity" projesi için React tabanlı ana giriş ekranının (Landing Page) tasarlanması.
**ÖNEMLİ:** Bu aşamada herhangi bir **Giriş Formu (Login Screen)** veya **Sayfa Yönlendirmesi (Routing)** yapılmayacaktır. Sadece görsel tasarım, kart yapısı ve animasyonlar oluşturulacaktır.

## 2. Teknoloji Yığını
* **Framework:** React.js
* **Stil:** CSS (Tercihen CSS Modules veya standart CSS).
* **Dil:** JavaScript (ES6+).

## 3. Tasarım Dili ve Renk Paleti (Kesin Kurallar)
Aşağıdaki renk paleti tasarımın temelini oluşturmalıdır:
* **Arka Plan (Lavanta):** `#E6E6FA` (Sayfanın ana zemin rengi).
* **Vurgu ve Butonlar (Açık Gök Mavisi):** `#87CEFA` (Gradientler, ikonlar ve butonlar için).
* **Kartlar ve Yüzeyler (Beyaz):** `#FFFFFF` (Buzlu cam efekti ve kart zeminleri).

**Görsel Atmosfer:**
* **Tema:** Ferah, Aydınlık, "Bulutların Üzerinde", Yerçekimsiz.
* **Stil:** Light Glassmorphism (Açık renkli buzlu cam efekti).
* **Metin Rengi:** Okunabilirlik için Koyu Gri (#2D3748) veya Lacivert tonları tercih edilmeli.

## 4. İstenen Bileşenler

### A. `App.jsx` (Ana Düzen)
* Tüm ekranı kaplayan, `#E6E6FA` ve beyaz tonlarında yumuşak geçişli bir arka plan.
* Sayfanın tam ortasında hizalanmış bir başlık ("ANTIGRAVITY") ve kart konteyneri.

### B. `SelectionCard.jsx` (Seçim Kartı Bileşeni)
* Bu bileşen hem "Öğrenci" hem de "Öğretmen" için tekrar kullanılabilir (reusable) olmalı.
* **Görünüm:** Beyaz (`#FFFFFF`) ağırlıklı, yarı saydam (`opacity: 0.8`), hafif gölgeli (`box-shadow`) ve yuvarlatılmış köşeler.
* **İçerik:**
    * Büyük bir İkon (Öğrenci/Öğretmen için).
    * Başlık.
    * Kısa bir açıklama metni.
    * "Giriş Yap" Butonu (Rengi `#87CEFA` olmalı).
* **Hover (Üzerine Gelme) Efekti:** Kart üzerine gelindiğinde hafifçe yukarı kalkmalı ve gölgesi belirginleşmeli.

## 5. Animasyon (Antigravity Efekti)
* Kartlar sabit durmamalı; CSS `@keyframes` kullanılarak sürekli ve yavaş bir şekilde yukarı-aşağı süzülmelidir (Float animation).
* Doğallık katmak için iki kartın animasyon süreleri veya başlama zamanları birbirinden farklı olmalıdır.

## 6. Aksiyon ve Davranış
* **Tıklama Olayı:** Butonlara tıklandığında sayfa değişmemeli. Sadece `console.log("Öğrenci seçildi")` gibi bir çıktı vermelidir.