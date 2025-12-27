@echo off
echo Backend sunucusu baslatiliyor...
cd backend
call venv\Scripts\activate.bat
uvicorn main:app --reload --port 8001
pause
