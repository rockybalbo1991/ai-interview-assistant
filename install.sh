#!/usr/bin/env bash
# One-click installer for Interview Notes AI (ManuGPT Stealth Notes)
# Works on macOS / Linux (or Windows WSL / Git Bash).

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

info() { echo -e "[INFO] $1"; }
error() { echo -e "[ERROR] $1" >&2; }

# Detect python
if command -v python3 >/dev/null 2>&1; then
  PYTHON_BIN="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON_BIN="python"
else
  error "Python is not installed. Please install Python 3.10+ and re-run."
  exit 1
fi

# Detect yarn
if ! command -v yarn >/dev/null 2>&1; then
  error "yarn is not installed. Please install Node.js + yarn and re-run."
  exit 1
fi

info "Using python executable: $PYTHON_BIN"

############################################
# Backend setup
############################################
info "Setting up backend (FastAPI)..."
cd "$BACKEND_DIR"

if [ ! -d "venv" ]; then
  info "Creating virtual environment in backend/venv..."
  $PYTHON_BIN -m venv venv
else
  info "Virtual environment already exists at backend/venv"
fi

# Install backend dependencies
info "Installing backend dependencies from requirements.txt..."
"$BACKEND_DIR/venv/bin/python" -m pip install --upgrade pip
"$BACKEND_DIR/venv/bin/python" -m pip install -r requirements.txt

############################################
# Frontend setup
############################################
info "Setting up frontend (React)..."
cd "$FRONTEND_DIR"
info "Installing frontend dependencies with yarn..."
yarn install

cd "$ROOT_DIR"

info "Installation complete. Next steps:"
cat << 'EOF'

To run the app locally:

1) Start MongoDB (locally or use a MongoDB URI).

2) Backend:
   cd backend
   source venv/bin/activate        # On Windows (Git Bash): source venv/Scripts/activate
   uvicorn server:app --host 0.0.0.0 --port 8001

3) Frontend (in a new terminal):
   cd frontend
   yarn start

Open http://localhost:3000 in your browser.

Stealth mode:
- Press Ctrl + Shift + H to toggle simple Notes view on/off.
EOF
