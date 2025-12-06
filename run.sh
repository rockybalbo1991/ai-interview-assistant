#!/usr/bin/env bash
# Simple runner for Interview Notes AI (local dev)
# Starts backend (FastAPI) and frontend (React) together.

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

info() { echo -e "[INFO] $1"; }
error() { echo -e "[ERROR] $1" >&2; }

# Check MongoDB (optional, just a hint)
if ! pgrep -x "mongod" >/dev/null 2>&1; then
  info "MongoDB (mongod) does not seem to be running. Make sure your MongoDB server is started."
fi

# Activate backend venv and start FastAPI
if [ ! -d "$BACKEND_DIR/venv" ]; then
  error "Backend venv not found. Please run ./install.sh first."
  exit 1
fi

info "Starting backend (FastAPI) on http://localhost:8001 ..."
cd "$BACKEND_DIR"
source venv/bin/activate

# Start uvicorn in background
uvicorn server:app --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!
info "Backend PID: $BACKEND_PID"

# Start frontend (will stay in foreground)
cd "$FRONTEND_DIR"
info "Starting frontend (React) on http://localhost:3000 ..."
yarn start

# When frontend stops, stop backend too
info "Stopping backend (PID $BACKEND_PID) ..."
kill "$BACKEND_PID" 2>/dev/null || true
