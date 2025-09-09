@echo off
echo 🚀 Starting CapitalLeaf Zero Trust Access Control System
echo.

echo 📡 Starting Backend Server (Port 3000)...
start "CapitalLeaf Backend" cmd /k "cd /d %~dp0 && npm start"

timeout /t 3 /nobreak > nul

echo 🌐 Starting Frontend Server (Port 8080)...
start "CapitalLeaf Frontend" cmd /k "cd /d %~dp0\frontend && node server.js"

echo.
echo ✅ Both servers are starting up!
echo.
echo 🔗 Access URLs:
echo    Frontend: http://localhost:8080
echo    Backend API: http://localhost:3000/api
echo    Health Check: http://localhost:3000/health
echo.
echo 🛡️ Zero Trust Features Available:
echo    ✅ Device Fingerprinting
echo    ✅ Behavioral Analysis  
echo    ✅ Adaptive MFA
echo    ✅ Risk Assessment
echo    ✅ Security Dashboard
echo.
echo Press any key to exit...
pause > nul
