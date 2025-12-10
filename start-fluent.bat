@echo off
echo.
echo ========================================
echo   FLUENT - Data Analysis Platform
echo ========================================
echo.

echo Starting Backend Server...
start cmd /k "cd backend && python start.py"

echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Fluent is starting up!
echo.
echo   Frontend: http://localhost:3000
echo   Backend API: http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Press any key to exit...
pause >nul
