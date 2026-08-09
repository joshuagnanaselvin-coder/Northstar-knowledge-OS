@echo off
echo ==========================================
echo   NorthStar Knowledge OS - Dev Server
echo ==========================================
echo.

REM Check if ngrok is available
where ngrok >nul 2>&1
if %errorlevel%==0 (
    set NGROK_AVAILABLE=1
) else (
    set NGROK_AVAILABLE=0
)

REM Start Backend (FastAPI on port 8000)
echo [1/3] Starting Backend (http://localhost:8000)...
echo       A new window will open - watch it for errors.
echo.
cd /d "%~dp0backend"
start "NorthStar Backend - WATCH THIS WINDOW" cmd /c "python main.py 2>&1"

REM Wait for backend to be ready
echo       Waiting 4 seconds for backend to start...
timeout /t 4 /nobreak >nul

REM Test backend health
curl -s http://localhost:8000/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Backend did not start! Check the Backend window for errors.
    echo.
    pause
    exit /b 1
)
echo       Backend is running!

REM Start Frontend (Vite dev server on port 5173)
echo.
echo [2/3] Starting Frontend (http://localhost:5173)...
cd /d "%~dp0frontend"
start "NorthStar Frontend" cmd /c "npm run dev 2>&1"

REM Wait for frontend to be ready
echo       Waiting 5 seconds for frontend to compile...
timeout /t 5 /nobreak >nul

REM Start ngrok tunnel if available
if %NGROK_AVAILABLE%==1 (
    echo.
    echo [3/3] Starting Ngrok tunnel for port 5173...
    start "Ngrok Tunnel" cmd /c "ngrok http 5173"
) else (
    echo.
    echo [3/3] Ngrok not found - skipping tunnel.
    echo       Install from https://ngrok.com/download to enable external access.
)

echo.
echo ==========================================
echo   All servers started!
echo ==========================================
echo   Frontend : http://localhost:5173
echo   Backend  : http://localhost:8000
echo   API Docs : http://localhost:8000/docs
echo.
if %NGROK_AVAILABLE%==1 (
    echo   Ngrok tunnel should open automatically.
    echo   Copy the forwarding URL to share the app.
) else (
    echo   Run: npm install -g ngrok
    echo   Then: ngrok config add-authtoken YOUR_TOKEN
    echo   Then re-run this script.
)
echo.
echo   Close this window to stop all servers.
echo   IMPORTANT: If login fails, CHECK THE BACKEND WINDOW for error messages!
echo ==========================================
pause
