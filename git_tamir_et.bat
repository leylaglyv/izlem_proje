@echo off
echo ==============================================
echo GIT SORUN GIDERICI
echo ==============================================

:: 1. Kimlik tanimla (Eger yapilmadiysa commit calismaz)
echo Kimlik ayarlaniyor...
git config --global user.email "ogrenci@proje.com"
git config --global user.name "Proje Ekibi"

:: 2. Tekrar paketle
echo Dosyalar paketleniyor...
git add .
git commit -m "Yeniden deneme: Baslangic kodlari"

:: 3. Branch adi garanti olsun
git branch -M main

:: 4. Baglanti yenile
git remote remove origin
git remote add origin https://github.com/mehmetemindeniz/antigravity-proje.git

:: 5. Gonder
echo GitHub'a gonderiliyor...
git push -u origin main

echo.
echo Islem tamamlandi.
pause
