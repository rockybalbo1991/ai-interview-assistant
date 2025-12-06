@echo off
REM One-click installer for Interview Notes AI (ManuGPT Stealth Notes)
REM Windows batch script

setlocal ENABLEDELAYEDEXPANSION

set ROOT_DIR=%~dp0
set BACKEND_DIR=%ROOT_DIR%backend
set FRONTEND_DIR=%ROOT_DIR%frontend

echo [INFO] Using root directory: %ROOT_DIR%

REM Check python
where python >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Python is not installed or not in PATH. Please install Python 3.10+ and re-run.
  exit /b 1
)

REM Check yarn
where yarn >nul 2>nul
if errorlevel 1 (
  echo [ERROR] yarn is not installed or not in PATH. Please install Node.js + yarn and re-run.
  exit /b 1
)

REM Backend setup
cd /d "%BACKEND_DIR%"
if not exist venv (
  echo [INFO] Creating virtual environment in backend\venv...
  python -m venv venv
) else (
  echo [INFO] Virtual environment already exists at backend\venv
)

echo [INFO] Installing backend dependencies from requirements.txt...
call venv\Scripts\python -m pip install --upgrade pip
call venv\Scripts\python -m pip install -r requirements.txt

REM Frontend setup
cd /d "%FRONTEND_DIR%"
echo [INFO] Installing frontend dependencies with yarn...
yarn install

cd /d "%ROOT_DIR%"

echo.
echo [INFO] Installation complete.
echo.
echo Next steps:
echo   1^)^ Start MongoDB (local instance or connection string).
echo   2^)^ Backend:  cd backend ^&^& call venv\Scripts\activate ^&^& uvicorn server:app --host 0.0.0.0 --port 8001
echo   3^)^ Frontend: cd frontend ^&^& yarn start

echo.
echo Stealth mode:
echo   - Press Ctrl + Shift + H to toggle simple Notes view on/off.

echo Done.
