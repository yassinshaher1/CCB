@echo off
REM ============================================================================
REM CCB Kubernetes Deployment Script
REM Run this after computer restart to bring up all services
REM ============================================================================

echo.
echo ============================================================
echo    CCB Kubernetes Full Deployment Script
echo ============================================================
echo.

REM Set working directory
cd /d "d:\University\Cloud computing\Project\CCB"

REM Check if Docker Desktop is running
echo [1/8] Checking Docker Desktop...
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker Desktop is not running!
    echo Please start Docker Desktop and wait for it to be ready, then run this script again.
    pause
    exit /b 1
)
echo      Docker Desktop is running

REM Check if Kubernetes is running
echo [2/8] Checking Kubernetes...
kubectl cluster-info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Kubernetes is not running!
    echo Please enable Kubernetes in Docker Desktop Settings, then run this script again.
    pause
    exit /b 1
)
echo      Kubernetes is running

REM Create namespace if not exists
echo [3/8] Setting up namespace...
kubectl create namespace ccb-dev --dry-run=client -o yaml | kubectl apply -f -

REM Create Firebase secret
echo [4/8] Creating Firebase secret...
kubectl delete secret firebase-key -n ccb-dev --ignore-not-found
kubectl create secret generic firebase-key --from-file=serviceAccountKey.json="d:\University\Cloud computing\Project\CCB\user-profile-service\serviceAccountKey.json" -n ccb-dev
echo      Firebase secret created

REM Apply Kubernetes manifests
echo [5/8] Deploying services to Kubernetes...
kubectl apply -f k8s-manifests\00-namespaces.yaml
kubectl apply -f k8s-manifests\deployments.yaml
echo      Manifests applied

REM Force pull latest images
echo [6/8] Restarting deployments to pull latest images...
kubectl rollout restart deployment user-profile-service -n ccb-dev
kubectl rollout restart deployment catalog-service -n ccb-dev
kubectl rollout restart deployment order-service -n ccb-dev
kubectl rollout restart deployment payment-service -n ccb-dev
kubectl rollout restart deployment frontend -n ccb-dev

REM Wait for pods to be ready
echo [7/8] Waiting for pods to be ready (this may take a minute)...
timeout /t 10 /nobreak >nul
kubectl wait --for=condition=ready pod -l app=frontend -n ccb-dev --timeout=120s 2>nul
kubectl wait --for=condition=ready pod -l app=user-profile-service -n ccb-dev --timeout=120s 2>nul
kubectl wait --for=condition=ready pod -l app=catalog-service -n ccb-dev --timeout=120s 2>nul
kubectl wait --for=condition=ready pod -l app=order-service -n ccb-dev --timeout=120s 2>nul

REM Show pod status
echo.
echo ============================================================
echo POD STATUS:
echo ============================================================
kubectl get pods -n ccb-dev
echo.

REM Show service URLs
echo ============================================================
echo LOCAL ACCESS URLS:
echo ============================================================
echo   Frontend:             http://localhost:30080
echo   User Profile API:     http://localhost:30000
echo   Catalog API:          http://localhost:30001
echo   Order API:            http://localhost:30002
echo ============================================================
echo.

REM Start ngrok
echo [8/8] Starting ngrok...
echo.

REM Check if ngrok is installed
where ngrok >nul 2>&1
if errorlevel 1 (
    echo ============================================================
    echo WARNING: ngrok is NOT installed or not in PATH!
    echo ============================================================
    echo.
    echo To install ngrok:
    echo   1. Download from: https://ngrok.com/download
    echo   2. Extract ngrok.exe to a folder
    echo   3. Add that folder to your system PATH, or
    echo      copy ngrok.exe to C:\Windows\System32
    echo   4. Run: ngrok authtoken YOUR_AUTH_TOKEN
    echo.
    echo Alternatively, install via Chocolatey:
    echo   choco install ngrok
    echo.
    echo Or via winget:
    echo   winget install ngrok.ngrok
    echo ============================================================
    echo.
    echo Skipping ngrok - your app is still accessible locally.
    goto :skip_ngrok
)

echo Starting ngrok to expose frontend to the internet...

REM Kill any existing ngrok processes first
taskkill /f /im ngrok.exe >nul 2>&1

REM Start ngrok in the background (minimized)
start /min "" ngrok http 30080

REM Wait for ngrok to start up
echo Waiting for ngrok to initialize...
timeout /t 5 /nobreak >nul

REM Fetch and display the ngrok public URL
echo.
echo ============================================================
echo NGROK PUBLIC URL:
echo ============================================================
curl -s http://localhost:4040/api/tunnels 2>nul | findstr /C:"public_url"
echo.
echo (If URL not shown, open http://localhost:4040 in browser)
echo ============================================================

:skip_ngrok
echo.
echo ============================================================
echo DEPLOYMENT COMPLETE!
echo ============================================================
echo.
echo Your app is now running!
echo - Local access: http://localhost:30080
if not errorlevel 1 echo - Public URL: See ngrok URL above (or check http://localhost:4040)
echo.
echo To check pod status:    kubectl get pods -n ccb-dev
echo To view logs:           kubectl logs -f deployment/frontend -n ccb-dev
echo To get ngrok URL again: curl -s http://localhost:4040/api/tunnels
echo.
pause
