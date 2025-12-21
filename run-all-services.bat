@echo off
:: ================================================================
:: CCB - Connecticut Clothing Brand
:: Run All Services Script for Windows
:: ================================================================

echo.
echo ========================================================
echo   CCB - Starting All Services
echo ========================================================
echo.

:: Navigate to project root
cd /d "%~dp0"

:: Check if virtual environment exists
if not exist ".venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found!
    echo Please run 'install-requirements.bat' first.
    pause
    exit /b 1
)

echo Starting services in separate terminals...
echo.

:: Start User Profile Service (Port 8000)
echo [1/4] Starting User Profile Service on port 8000...
start "User Profile Service - Port 8000" cmd /k "cd /d "%~dp0" && call .venv\Scripts\activate.bat && cd user-profile-service && python -m uvicorn app:app --reload --port 8000"

:: Wait a moment for the service to start
timeout /t 2 /nobreak >nul

:: Start Catalog Service (Port 8001)
echo [2/4] Starting Catalog Service on port 8001...
start "Catalog Service - Port 8001" cmd /k "cd /d "%~dp0" && call .venv\Scripts\activate.bat && cd catalog-service && python -m uvicorn app:app --reload --port 8001"

:: Wait a moment for the service to start
timeout /t 2 /nobreak >nul

:: Start Order Service (Port 8002)
echo [3/4] Starting Order Service on port 8002...
start "Order Service - Port 8002" cmd /k "cd /d "%~dp0" && call .venv\Scripts\activate.bat && cd order-service && python -m uvicorn app:app --reload --port 8002"

:: Wait a moment for the service to start
timeout /t 2 /nobreak >nul

:: Start Frontend (Port 3000)
echo [4/4] Starting Frontend on port 3000...
start "Frontend - Port 3000" cmd /k "cd /d "%~dp0\frontend-react" && npm run dev"

:: Wait for services to initialize
echo.
echo Waiting for services to initialize...
timeout /t 5 /nobreak >nul

:: Open browser to frontend
echo.
echo Opening browser to http://localhost:3000...
start "" "http://localhost:3000"

echo.
echo ========================================================
echo   ALL SERVICES STARTED!
echo ========================================================
echo.
echo Services running in separate terminal windows:
echo   - User Profile Service: http://localhost:8000 (API docs: /docs)
echo   - Catalog Service:      http://localhost:8001 (API docs: /docs)
echo   - Order Service:        http://localhost:8002 (API docs: /docs)
echo   - Frontend:             http://localhost:3000
echo.
echo To stop all services, close the terminal windows or press Ctrl+C in each.
echo.
pause
