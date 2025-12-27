@echo off
echo ========================================================
echo IYI AKSAMLAR! KODLARIN GITHUB'A GONDERILIYOR...
echo ========================================================

:: 1. Degisiklikleri sepete ekle
git add .

:: 2. Mesaj iste (Kullanici ne yaptigini yszsin)
set /p mesaj="Bugun ne yaptin? (Orn: Giris butonu duzeltildi): "

:: 3. Paketle (Commit)
git commit -m "%mesaj%"

:: 4. Gonder (Push)
echo.
echo Yukleniyor... Lutfen bekleyin...
git push origin main

echo.
echo ========================================================
echo TEBRIKLER! Kodlarin guvende.
echo Simdi bilgisayarini kapatabilirsin.
echo ========================================================
pause
