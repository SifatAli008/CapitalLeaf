@echo off
echo 🔍 Checking CapitalLeaf Server Status...
echo.

echo 📡 Backend Server (Port 3000):
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:3000/health' -UseBasicParsing -TimeoutSec 3; Write-Host '✅ RUNNING - Status:' $response.StatusCode } catch { Write-Host '❌ NOT RUNNING' }"

echo.
echo 🌐 Frontend Server (Port 8080):
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:8080' -UseBasicParsing -TimeoutSec 3; Write-Host '✅ RUNNING - Status:' $response.StatusCode } catch { Write-Host '❌ NOT RUNNING' }"

echo.
echo 📋 If servers are not running, use:
echo    start-servers.bat
echo.
pause
