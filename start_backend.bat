@echo off
echo Backend sunucusu baslatiliyor...
cd /d "%~dp0backend"
call venv\Scripts\activate.bat
uvicorn main:app --reload --port 8000
pause
