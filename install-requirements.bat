@echo off
:: ================================================================
:: CCB - Connecticut Clothing Brand
:: Installation Script for Windows
:: ================================================================

echo.
echo ========================================================
echo   CCB - Installing All Project Dependencies
echo ========================================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ from https://www.python.org/downloads/
    pause
    exit /b 1
)
echo [OK] Python found

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found

:: Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed or not in PATH!
    pause
    exit /b 1
)
echo [OK] npm found

echo.
echo --------------------------------------------------------
echo   Step 1: Creating Python Virtual Environment
echo --------------------------------------------------------
echo.

:: Navigate to project root
cd /d "%~dp0"

:: Create virtual environment if it doesn't exist
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo [OK] Virtual environment created
) else (
    echo [OK] Virtual environment already exists
)

:: Activate virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate.bat
if errorlevel 1 (
    echo [ERROR] Failed to activate virtual environment!
    pause
    exit /b 1
)
echo [OK] Virtual environment activated

echo.
echo --------------------------------------------------------
echo   Step 2: Installing Python Dependencies
echo --------------------------------------------------------
echo.

:: Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

:: Install user-profile-service dependencies
echo.
echo Installing user-profile-service dependencies...
pip install -r user-profile-service\requirements.txt
if errorlevel 1 (
    echo [WARNING] Some user-profile-service dependencies may have failed
)

:: Install catalog-service dependencies
echo.
echo Installing catalog-service dependencies...
pip install -r catalog-service\requirements.txt
if errorlevel 1 (
    echo [WARNING] Some catalog-service dependencies may have failed
)

:: Install order-service dependencies
echo.
echo Installing order-service dependencies...
pip install -r order-service\requirements.txt
if errorlevel 1 (
    echo [WARNING] Some order-service dependencies may have failed
)

:: Install payment-service dependencies (if requirements exist)
if exist "payment-service\requirements.txt" (
    echo.
    echo Installing payment-service dependencies...
    pip install -r payment-service\requirements.txt
)

echo.
echo [OK] Python dependencies installed

echo.
echo --------------------------------------------------------
echo   Step 3: Installing Frontend Dependencies
echo --------------------------------------------------------
echo.

cd frontend-react
echo Installing npm packages...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies!
    cd ..
    pause
    exit /b 1
)
echo [OK] Frontend dependencies installed
cd ..

echo.
echo ========================================================
echo   INSTALLATION COMPLETE!
echo ========================================================
echo.
echo Next steps:
echo   1. Make sure you have serviceAccountKey.json in each service folder
echo   2. Run 'run-all-services.bat' to start the application
echo.
pause
