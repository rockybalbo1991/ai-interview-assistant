# Interview Notes AI (ManuGPT Stealth Notes)

This project is a full‑stack **interview helper** that looks like a normal **Notes** application.

- You type questions or topics at the bottom.
- The app talks to an AI model in the backend and shows answers as **Me / AI**.
- The design is simple Notes UI + **stealth mode** so it is safer when you are sharing your screen.

---

## 1. Requirements (before you start)

You only need these tools on your machine:

1. **Git** – to download the project
2. **Python 3.10+** – for the backend (FastAPI)
3. **Node.js (LTS) + yarn** – for the frontend (React)
4. **MongoDB** – can be local MongoDB Community Server or a MongoDB Atlas URI
5. **Emergent universal key** – this will be set as `EMERGENT_LLM_KEY` in backend `.env`

> If you only want to see the UI without real AI answers, you can leave `EMERGENT_LLM_KEY` empty and later change the backend to mock responses.

---

## 2. First‑time setup (step by step)

These steps are the same whether you are on **Windows** or **macOS/Linux**, only the commands differ slightly.

### Step 1 – Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/app
```

Replace `your-username/your-repo` with your actual GitHub path.

---

### Step 2 – Create backend `.env`

Create a file: `app/backend/.env`

```env
MONGO_URL="mongodb://localhost:27017"   # or your MongoDB URI
DB_NAME="interview_notes_ai"           # any DB name you like
CORS_ORIGINS="*"
EMERGENT_LLM_KEY=sk-emergent-...        # your Emergent universal key
```

- If MongoDB runs on another host/port, update `MONGO_URL` accordingly.
- **Do not commit this file to public GitHub** because it contains your secret key.

---

### Step 3 – Create frontend `.env`

Create a file: `app/frontend/.env`

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

- This must point to your backend base URL **without** `/api`.
- When you deploy backend somewhere else, change this value to that URL.

---

### Step 4 – Install dependencies (one‑time)

#### On macOS / Linux / WSL

```bash
cd app
chmod +x install.sh run.sh
./install.sh
```

What this does:
- Creates a Python virtual environment in `backend/venv`.
- Installs all Python packages from `backend/requirements.txt`.
- Runs `yarn install` inside `frontend/`.

#### On Windows

Open **Command Prompt** or **PowerShell**, then:

```bat
cd your-repo\app
install.bat
```

What this does:
- Creates `backend\venv`.
- Installs all Python packages from `backend\requirements.txt`.
- Runs `yarn install` in `frontend\`.

Do this only once on each machine.

---

## 3. Start the application (everyday usage)

After the first‑time setup is done and `.env` files are ready, daily use is simple.

> Make sure **MongoDB** server is running (default: `mongodb://localhost:27017`).

### macOS / Linux / WSL

```bash
cd your-repo/app
./run.sh
```

This script will:
- Activate the backend virtualenv.
- Start FastAPI backend on **http://localhost:8001**.
- Start React frontend on **http://localhost:3000**.

Then open your browser at **http://localhost:3000**.

### Windows

```bat
cd your-repo\app
run.bat
```

This script will:
- Open a new window for backend (FastAPI on `http://localhost:8001`).
- Start frontend (React) in the current window on `http://localhost:3000`.

Open **http://localhost:3000** in your browser.

When you stop the frontend (`Ctrl + C`), you can close the backend window manually.

---

## 4. Optional: Desktop launcher and Windows .exe

If you want something closer to a "single application" experience on your own machine, you can use `desktop_launcher.py` and (optionally) build a Windows `.exe` from it.

### 4.1 Run the desktop launcher (without .exe)

After running the installer scripts (`install.sh` / `install.bat`) and creating `.env` files:

```bash
cd your-repo/app
python desktop_launcher.py   # or python3 desktop_launcher.py
```

This will:
- Start backend (FastAPI) on `http://localhost:8001`.
- Start frontend (React dev server) on `http://localhost:3000`.
- Try to open your default browser automatically.

You still need Python, Node, MongoDB and the dependencies installed.

### 4.2 Build Windows .exe with PyInstaller (advanced, optional)

> These steps are done **on your Windows machine**, not on Emergent.

1. Install PyInstaller in your backend virtualenv:

   ```bat
   cd your-repo\app\backend
   call venv\Scripts\activate
   pip install pyinstaller
   ```

2. Go to the `app` folder and build the exe:

   ```bat
   cd ..    REM now in your-repo\app
   pyinstaller --onefile desktop_launcher.py --name InterviewNotesAI
   ```

3. After it finishes, PyInstaller will create a `dist` folder:

   ```text
   your-repo\app\dist\InterviewNotesAI.exe
   ```

4. Double‑click `InterviewNotesAI.exe` to:
   - Start backend and frontend.
   - Open your browser at `http://localhost:3000`.

**Important:**
- The `.exe` still expects that you already ran `install.bat` once and that
  MongoDB is running and `.env` files are present.
- Do **not** hard‑code your `EMERGENT_LLM_KEY` into the code or exe; keep it only in `backend/.env`.

---

## 5. How to use the app (interview practice)

### Normal mode

1. Open **http://localhost:3000**.
2. In the left sidebar, click **New note**.
3. At the bottom input box, type your interview question or prompt.
4. Press **Enter**.
5. In the main area you will see messages as **Me** and **AI**.

Each note keeps its own history.

### Stealth mode (during screen share)

- Keyboard shortcut: **`Ctrl + Shift + H`**

When you press `Ctrl + Shift + H`:

- The whole app switches to a very simple **Notes** screen:
  - Title: `Notes`
  - Sub‑text: quick notes for the day
  - One big textarea
- No GPT / AI / chat / ManuGPT text is visible anywhere.
- The browser tab title also shows **"Notes"**.

Press **`Ctrl + Shift + H`** again to return to the full notes + AI view.

> For real interviews, best is to keep this app on a **second monitor** or a **second device (phone / tablet)**, so it never appears in your shared screen at all.

---

## 6. Project structure

Inside the `app/` folder:

```bash
app/
  backend/        # FastAPI backend, MongoDB models, AI integration
  frontend/       # React frontend (Notes UI + stealth mode)
  install.sh      # one-time installer for macOS/Linux/WSL
  install.bat     # one-time installer for Windows
  run.sh          # start backend + frontend together (macOS/Linux/WSL)
  run.bat         # start backend + frontend together (Windows)
  desktop_launcher.py  # optional desktop-style launcher for local use / exe build
```

Backend key points:
- All API routes start with `/api`.
- Uses MongoDB for conversations and messages.
- Uses `EMERGENT_LLM_KEY` (Emergent universal key) to call the AI model.

Frontend key points:
- Uses `REACT_APP_BACKEND_URL` from `.env` to call the backend.
- Renders messages in a notes‑style layout.
- Implements **stealth mode** shortcut.

---

## 7. Safety notes

This tool is designed to **help you practice** and organise your thoughts.

- Do not depend on it blindly during real interviews.
- Try to understand every answer and be ready to explain in your own words.
- Use it as a **co‑pilot**, not as a full replacement for your own knowledge.
