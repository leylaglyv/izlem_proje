@echo off
echo Backend sunucusu baslatiliyor...
cd backend
venv\Scripts\python -m uvicorn main:app --reload --port 8001
pause
