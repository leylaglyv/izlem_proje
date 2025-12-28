@echo off
echo Calisma baslatiliyor...

:: Backend'i ayri bir pencerede baslat
start "Backend Server" cmd /k "call start_backend.bat"

:: Frontend'i ayri bir pencerede baslat
start "Frontend Server" cmd /k "call start_frontend.bat"

echo.
echo Sunucularin acilmasi bekleniyor (5 saniye)...
timeout /t 5 >nul

echo Tarayici aciliyor...
start http://localhost:5173

echo.
echo Islem tamamlandi. Calismaya baslayabilirsiniz!
pause
