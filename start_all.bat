@echo off
echo Tum sunucular baslatiliyor...

start "Backend Server" cmd /k "call start_backend.bat"
start "Frontend Server" cmd /k "call start_frontend.bat"

echo.
echo Sunucularin acilmasi icin bekleniyor (5 saniye)...
timeout /t 5 >nul

echo Tarayici aciliyor...
start http://localhost:5173

echo.
echo Islem tamamlandi. Pencereleri kapatmayin.
pause
