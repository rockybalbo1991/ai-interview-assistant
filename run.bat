@echo off
REM Simple runner for Interview Notes AI (local dev)
REM Starts backend (FastAPI) and frontend (React) together on Windows.

setlocal ENABLEDELAYEDEXPANSION

set ROOT_DIR=%~dp0
set BACKEND_DIR=%ROOT_DIR%backend
set FRONTEND_DIR=%ROOT_DIR%frontend

echo [INFO] Using root directory: %ROOT_DIR%

REM Check venv
if not exist "%BACKEND_DIR%venv" (
  echo [ERROR] Backend venv not found. Please run install.bat first.
  exit /b 1
)

REM Warn about MongoDB
echo [INFO] Make sure MongoDB server is running (mongod).

REM Start backend in a new window
cd /d "%BACKEND_DIR%"
echo [INFO] Starting backend (FastAPI) on http://localhost:8001 ...
start "InterviewNotesAI-Backend" cmd /k "call venv\Scripts\activate && uvicorn server:app --host 0.0.0.0 --port 8001"

REM Start frontend in current window
cd /d "%FRONTEND_DIR%"
echo [INFO] Starting frontend (React) on http://localhost:3000 ...
yarn start

REM When frontend stops, user can close backend window manually
echo [INFO] Frontend stopped. You can close the backend window (InterviewNotesAI-Backend) if it is still running.
