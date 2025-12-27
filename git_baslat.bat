@echo off
echo Git kurulumu ve baglantisi yapiliyor...

:: 1. Git'i baslat
git init

:: 2. Tum dosyalari ekle
git add .

:: 3. Paketle
git commit -m "Otomatik kurulum"

:: 4. Ana dali ayarla
git branch -M main

:: 5. ESKI baglanti varsa sil (Hata verirse onemli degil)
git remote remove origin

:: 6. YENI baglantiyi kur (Sizin verdiginiz adres)
git remote add origin https://github.com/mehmetemindeniz/antigravity-proje.git

echo.
echo ===========================================
echo KURULUM TAMAMLANDI!
echo Simdi 'github_gonder.bat' dosyasini calistirabilirsin.
echo ===========================================
pause
