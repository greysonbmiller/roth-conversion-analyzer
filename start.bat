@echo off
echo Starting Roth IRA Conversion Analyzer...
echo.

echo Starting Backend (FastAPI)...
start "Backend - FastAPI" cmd /k "cd backend && venv\Scripts\activate && uvicorn main:app --reload"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend (React + Vite)...
start "Frontend - React" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Close this window when you're done, or close the individual server windows.
pause
