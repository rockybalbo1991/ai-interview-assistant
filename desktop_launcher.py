"""Desktop launcher for Interview Notes AI (ManuGPT Stealth Notes).

This script is meant to be run on your OWN machine, after you've cloned the
repository and run the installer scripts (install.sh / install.bat).

Purpose:
- Start FastAPI backend on http://localhost:8001
- Start React frontend dev server on http://localhost:3000
- Open the browser automatically

You can optionally turn this into a Windows .exe using PyInstaller on your
local machine (see README section "Build Windows .exe (optional)").
"""

import os
import sys
import time
import webbrowser
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"


def find_backend_python() -> str:
    """Return a python executable to use for the backend.

    Preference order:
    - backend/venv (Windows Scripts/python.exe or POSIX bin/python)
    - current interpreter (sys.executable)
    """
    win_python = BACKEND_DIR / "venv" / "Scripts" / "python.exe"
    posix_python = BACKEND_DIR / "venv" / "bin" / "python"

    if win_python.exists():
        return str(win_python)
    if posix_python.exists():
        return str(posix_python)
    return sys.executable


def main() -> None:
    print("[INFO] Root directory:", ROOT_DIR)
    print("[INFO] Backend directory:", BACKEND_DIR)
    print("[INFO] Frontend directory:", FRONTEND_DIR)

    # Simple check / reminder for MongoDB
    print("[INFO] Make sure your MongoDB server is running (e.g. mongod on localhost:27017).")

    # Start backend (FastAPI via uvicorn)
    backend_python = find_backend_python()
    print(f"[INFO] Using backend Python: {backend_python}")

    backend_cmd = [
        backend_python,
        "-m",
        "uvicorn",
        "server:app",
        "--host",
        "0.0.0.0",
        "--port",
        "8001",
    ]

    print("[INFO] Starting backend on http://localhost:8001 ...")
    backend_proc = subprocess.Popen(backend_cmd, cwd=str(BACKEND_DIR))

    # Give backend a moment to start
    time.sleep(3)

    # Start frontend (React dev server)
    print("[INFO] Starting frontend on http://localhost:3000 ...")

    if os.name == "nt":
        # On Windows, run via shell so yarn.cmd is resolved
        frontend_proc = subprocess.Popen("yarn start", cwd=str(FRONTEND_DIR), shell=True)
    else:
        frontend_proc = subprocess.Popen(["yarn", "start"], cwd=str(FRONTEND_DIR))

    # Open browser
    time.sleep(4)
    print("[INFO] Opening browser at http://localhost:3000 ...")
    try:
        webbrowser.open("http://localhost:3000")
    except Exception:
        # Not critical if this fails
        print("[WARN] Could not open browser automatically. Please open http://localhost:3000 manually.")

    try:
        # Wait for frontend to exit (user stops dev server)
        frontend_proc.wait()
    finally:
        print("[INFO] Stopping backend server ...")
        backend_proc.terminate()
        try:
            backend_proc.wait(timeout=5)
        except Exception:
            backend_proc.kill()


if __name__ == "__main__":
    main()
