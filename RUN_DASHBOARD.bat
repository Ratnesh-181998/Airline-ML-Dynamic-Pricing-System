@echo off
echo ========================================
echo Airline Ticket Shopping Dashboard
echo Installation and Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js is installed!
    node --version
    npm --version
    echo.
    echo Installing dashboard dependencies...
    cd /d "%~dp0frontend"
    call npm install
    echo.
    echo Starting dashboard...
    call npm start
) else (
    echo [ERROR] Node.js is NOT installed!
    echo.
    echo Please install Node.js first:
    echo 1. Download from: https://nodejs.org/
    echo 2. Or run the installer from your Downloads folder
    echo 3. Look for: node-v24.11.1-x64.msi
    echo.
    echo Opening Downloads folder...
    start "" "%USERPROFILE%\Downloads"
    echo.
    echo After installing Node.js:
    echo 1. Close this window
    echo 2. Run this script again
    echo.
    pause
)
