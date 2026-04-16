@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo        Student Attendance Tracking System Setup
echo ========================================================
echo.

:: Check Node.js version
for /f "tokens=*" %%v in ('node -v 2^>nul') do set NODE_VERSION=%%v
if not defined NODE_VERSION (
    echo [ERROR] Node.js is not installed. Please install Node.js v18 or higher from https://nodejs.org/
    echo Press any key to exit...
    pause >nul
    exit /b 1
)
echo [OK] Node.js !NODE_VERSION! detected.

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
    echo.
    echo Installing required packages... This might take a minute.
    call npm install
    if !errorlevel! neq 0 (
        echo [ERROR] Failed to install dependencies. Check your internet connection or package.json.
        pause >nul
        exit /b 1
    )
    echo [OK] Dependencies installed.
) else (
    echo [OK] Dependencies already installed.
)

:: Initialize database
echo.
echo Initializing the database...
if not exist "sqlite.db" (
    echo Creating new database...
) else (
    echo Database exists. Ensuring tables and grades are set up...
)

:: Run our init script
call node scripts/init-db.js
if !errorlevel! neq 0 (
        echo [ERROR] Failed to initialize database.
        pause >nul
        exit /b 1
)

echo.
echo ========================================================
echo          Setup Complete! Starting up...
echo ========================================================
echo.
echo App will be available at: http://localhost:3000
echo Setting up dev server...
echo.

call npm run dev
