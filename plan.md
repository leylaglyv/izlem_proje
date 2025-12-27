# PROJE: YAPAY ZEKA İLE DENEME SONUÇLARI ANALİZİ

## 🎯 Hedef
Öğretmenlerin tek bir PDF (içinde birden fazla öğrencinin sonuç belgesi olan) yüklediği, sistemin her sayfayı ayrı bir öğrenci olarak analiz edip sonuçları tek tek veritabanına işlediği genel bir analiz platformu.
Öğretmen öğrencilerinin deneme sonuçlarını sisteme yükler ve sistemin her sayfayı ayrı bir öğrenci olarak analiz edip sonuçları tek tek veritabanına işlediği genel bir analiz platformu. Öğretmenlerin ve öğrencilerin ayrı hesapları olur. Öğrenci kendi durumunu inceleyebilir. Deneme sonuçlarının analizine göre hangi konulara yoğunlaşması gerektiğini anlar. Öğretmenler öğrencilerin durumunu inceleyebilir. Eksikliklerini görür. Yapay zeka analizi sonucunda öğrencilerin hangi konulara yoğunlaşması gerektiğini anlar.

## 🏗️ Mimari Yapı
- **Backend:** Python FastAPI + PyMuPDF (PDF sayfalarını görsele çevirmek için).
- **Frontend:** React (Vite) + Tailwind CSS + HTML + Recharts.
- **AI:** Gemini 1.5 Flash (Çok sayfalı doküman analiz yeteneği).
- **Database:** Firebase Firestore & Auth.

## 📋 İş Akışı (Kritik)
1. **PDF İşleme:** Öğretmen PDF'i yükler. Backend, PDF'in her sayfasını birer görsel haline getirir.
2. **AI Analizi:** Gemini her sayfayı (her öğrenciyi) ayrı ayrı inceler.
   - Her öğrenci için: Ad-Soyad, No, Netler.
   - **Konu Analizi:** Yanlış yapılan soruların konu başlıklarını bulur.
   - **Öneri:** Öğrenciye özel çalışma tavsiyesi üretir.
   - **Çalışma ve Durum Analizi:** Öğrencinin yanlış yaptığı konuları analiz eder hangi konulara yoğunlaşması gerektiği ders bazında ayrı ayrı belirtilir.
3. **Kayıt:** Tüm öğrencilerin verileri Firestore'da kendi hesaplarıyla (veya öğrenci no ile) eşleşecek şekilde kaydedilir.
4. **Analiz** Öğrenci Profilinden deneme sonuçlarının analizlerini görebilir.
## 🛠️ Teknik Detay
- **Gemini Promptu:** "Bu PDF'deki her sayfa farklı bir öğrenciye aittir. Her öğrencinin derslerini ayrı ayrı analiz eder. Soruları konularına göre bakar hangi konulardan yanlış yaptığını analiz et bunun sonucunda öğrencinin hangi konulara yoğunlaşması gerektiğini belirler. Çalışma tavsiyesi üretir. Her sayfayı analiz et ve bana şu yapıda bir LISTE (Array) dön: [{student_name, student_id, results: {ders: {D, Y, N}}, weak_topics: [], suggestion: ""}]"

## Tasarımlar 
Beyaz temalı sade ama görsel açıdan da güzel bir tasarım. Bir anasayfa istiyorum bu anasayfada 2 kart olması gerekiyor sayfa ortasında büyük şekilde. Bu iki kartın birisi Öğrenci birisi Öğretmen olacak. Bu kartların altında öğrencilerin bu sistemi ne için kullanmaları gerektiği açıklayıcı bir metin olacak. Aynı şekilde öğretmenlerin ne için kullanmları gerektiği açıklayıcı bir metin olacak. Sayfanın üst tarafında bu sistemin ne için kullanılabileceği açıklayıcı bir metin olacak.  Üst header kısmında bu projenin Gaziantep Büyükşehir Belediyesi tarafından deskteklendiği ve projenin Gasmekler de denemeler için pilot olarak kullanıldığı söyleyen bir yazı olmalı.
Anasayfadan seçim yapıldığında öğrenci veya öğretmen login ekranlarına gidilecek. Öğrenci veya öğretmen şifre ve parolalarını girecek. Doğru ise profillerine gidecekler. Şifre ve kullanıcı adı da yine veri tabanından kontrol edilecek.
Öğrencinin sayfasında Sonuçlarım Derslerim Ayarlar gibi sekmeler olsun.
Öğretmenin sayfasında Sonuçlar Öğrenciler Sonuç Yükle gibi sekmeler olsun. 

## Öğretmenin Sonuç Yükle Sayfası
Bu sayfada öğretmen PDF yükleyecek. PDF yüklenirken sistemin her sayfayı ayrı ayrı analiz edip sonuçları tek tek veritabanına işlediği genel bir analiz platformu. Bu öğrencilerin sonuçları yapay zekaya analiz ettirilecek.Analizler sonuçlar kısmında analiz olarak yazılacak. Hangi derse çalışmalı hangi konulara yoğunlaşmalı hangi konulara yoğunlaşmalı gibi tavsiyeler de veritabanına kaydedilecek. Bu tavsiyeler öğretmenin öğrencinin hangi konulara yoğunlaşması gerektiğini anlatacak.

## Destek ve Süreç
bana firebase nasıl kuracağımı geminiye denemel sonuçlarını nasıl gösterceğimi vs. her şeyi anlat adım adım beni yönlendir.

## Genel şeyler

Python backend'de PDF'in her sayfasını analiz edecek yapıyı kur. PyMuPDF (fitz) kullanabiliriz.

Gemini 1.5 Flash'a her sayfayı gönderip, öğrencileri bir liste halinde (JSON array) almamız lazım.

Ardından Firebase kurulumuna geçeriz. Tasarımları oluştur hangi sayfaları kullanacağımızı belirleyelim.  