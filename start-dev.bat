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
cd /d "%~dp0backend"
start "NorthStar Backend" cmd /c "python main.py"

REM Wait for backend to be ready
timeout /t 3 /nobreak >nul

REM Start Frontend (Vite dev server on port 5173)
echo [2/3] Starting Frontend (http://localhost:5173)...
cd /d "%~dp0frontend"
start "NorthStar Frontend" cmd /c "npm run dev"

REM Wait for frontend to be ready
timeout /t 3 /nobreak >nul

REM Start ngrok tunnel if available
if %NGROK_AVAILABLE%==1 (
    echo [3/3] Starting Ngrok tunnel for port 5173...
    start "Ngrok Tunnel" cmd /c "ngrok http 5173"
) else (
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
echo ==========================================
pause
