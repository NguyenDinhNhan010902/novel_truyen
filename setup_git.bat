@echo off
setlocal

echo ===============================================
echo    AUTO UPDATE SYSTEM (ZERO CLICK)
echo ===============================================
echo.

:: 1. Setup PATH
set "PATH=%PATH%;C:\Program Files\Git\cmd;%LOCALAPPDATA%\Programs\Git\cmd"

:: 2. Force Clean Reset
if exist .git (
    echo [INFO] Resetting git state...
    rmdir /s /q .git
)

:: 3. Re-initialize
echo [INFO] Initializing...
git init
git config user.email "deploy@novel.app"
git config user.name "Deploy Bot"

echo [INFO] Adding files...
git add .
git commit -m "Update Requirements and Fixes"

echo [INFO] Setting Remote...
git branch -M main
git remote add origin https://github.com/NguyenDinhNhan010902/novel_truyen.git

echo.
echo ===============================================
echo    PUSHING TO GITHUB...
echo ===============================================
echo.
git push -u origin main --force

if %errorlevel% neq 0 (
    echo [FAIL] Push failed. Check internet.
) else (
    echo [SUCCESS] Code updated! Render will rebuild now.
)

pause
