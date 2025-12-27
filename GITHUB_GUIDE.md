# GitHub Kurulum ve İşbirliği Rehberi (4 Kişilik Ekip İçin)

Harika bir adım! Projenizi GitHub’a taşıyarak aynı anda çalışabilir, hataları geri alabilir ve birbirinizin kodunu bozmadan ilerleyebilirsiniz. Hiç bilginiz olmadığını varsayarak **sıfırdan** anlatıyorum.

---

## 1. Hazırlık (Herkes İçin)

Ekibinizdeki **herkesin** (4 kişi) şu iki şeyi yapması gerekiyor:

1.  **GitHub Hesabı Açın:** [github.com](https://github.com/) adresine gidip ücretsiz bir hesap oluşturun.
2.  **Git Programını İndirin:** [git-scm.com](https://git-scm.com/downloads) adresinden Windows sürümünü indirip kurun ("Next" diyerek varsayılan ayarlarla kurabilirsiniz).

**Kurulumdan Sonra:**
Bilgisayarınızda herhangi bir klasörde sağ tıklayıp "Open Git Bash Here" veya terminali açıp şu komutları tek tek yazarak kendinizi tanıtın (Tırnak içindeki yerleri kendinize göre değiştirin):

```bash
git config --global user.name "Adiniz Soyadiniz"
git config --global user.email "email@adresiniz.com"
```

---

## 2. Projeyi Başlatma (Sadece Proje Sahibi - Kodları Tutan Kişi)

Şu an kodlar **senin** bilgisayarında olduğu için bu adımı sadece **SEN** yapacaksın.

### A. Bilgisayarında Yapacakların:
1.  Proje klasörüne (`c:\Ampps\www\proje`) gel.
2.  Burada boş bir yere sağ tıkla ve **"Open Git Bash Here"** de (veya terminalden bu klasöre git).
3.  Sırasıyla şu komutları yaz:

```bash
git init
git add .
git commit -m "İlk kurulum: Proje dosyaları eklendi"
```
*(Bu işlem, dosyalarını "paketleyip" göndermeye hazır hale getirir.)*

### B. GitHub Sitesinde Yapacakların:
1.  GitHub hesabına giriş yap.
2.  Sağ üstteki **+** işaretine tıkla ve **"New repository"** de.
3.  **Repository name:** Projene bir isim ver (örn: `antigravity-proje`).
4.  **Public** (Herkes görür) veya **Private** (Sadece ekibiniz görür) seçeneğini seç. (Private öneririm).
5.  "Create repository" butonuna bas.

### C. Bağlantıyı Kurma:
GitHub sana oluşturduğun sayfanın linkini verecek (Örn: `https://github.com/kullaniciadi/antigravity-proje.git`). O linki kopyala ve terminale şu komutu yapıştır:

```bash
git branch -M main
git remote add origin https://github.com/SENIN-KULLANICI-ADIN/antigravity-proje.git
git push -u origin main
```
*(Şifre sorarsa GitHub kullanıcı adı ve şifreni gir. Eğer hata verirse "Personal Access Token" konusuna bakmamız gerekebilir, bunu bana sorabilirsin.)*

**Tebrikler! Kodların artık bulutta.** 🎉

---

## 3. Ekip Arkadaşlarını Davet Etme (Proje Sahibi)

1.  GitHub'daki proje sayfana git.
2.  Üst menüden **Settings** > **Collaborators** kısmına tıkla.
3.  "Add people" butonuna bas.
4.  Diğer 3 arkadaşının GitHub kullanıcı adlarını yazıp davet et.
5.  Arkadaşlar email adreslerine gelen daveti kabul etmeli.

---

## 4. Ekip Arkadaşlarinin Yapacağı (Diğer 3 Kişi)

Kodları kendi bilgisayarlarına çekmek için:
1.  Bilgisayarlarında projeyi kuracakları boş bir klasöre girsinler.
2.  Sağ tık > "Open Git Bash Here".
3.  Şu komutu yazsınlar:

```bash
git clone https://github.com/PROJE-SAHIBI-KULLANICI-ADI/antigravity-proje.git .
```
*(Sonundaki nokta önemlidir, klasörün içine dosyaları döker.)*

4.  **ÖNEMLİ:** `.env` dosyası güvenlik gereği GitHub'a yüklenmez. Proje sahibi `backend/.env` dosyasının içeriğini WhatsApp/Discord üzerinden arkadaşlarına atmalı, onlarda elle bu dosyayı oluşturmalıdır.

---

## 5. Birlikte Çalışma Mantığı (Altın Kurallar) ⚠️

Aynı dosyayı aynı anda değiştirirseniz "çakışma" (conflict) çıkar. Bunu önlemek için şu düzeni izleyin:

### Güne Başlarken (Herkes):
Kod yazmaya başlamadan önce **mutlaka** başkalarının yaptığı değişiklikleri al:
```bash
git pull origin main
```

### Kod Yazarken:
Değişikliklerini yaptıktan sonra kaydetmek için:
```bash
git add .
git commit -m "Buraya ne yaptığını yaz (örn: Öğretmen girişi butonu eklendi)"
git push origin main
```

### Özet Kodlar:
*   `git status` -> Şu an hangi dosyaları değiştirdim?
*   `git pull` -> Güncellemeleri al.
*   `git add .` -> Değişiklikleri sepete at.
*   `git commit -m "mesaj"` -> Paketi mühürle.
*   `git push` -> Paketi GitHub'a gönder.

---

**Takıldığınız yerde bana sormaktan çekinmeyin!**
