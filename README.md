# Interview Notes AI (ManuGPT Stealth Notes)

This project is a full‑stack "interview helper" web app that looks like a **simple notes application** but actually uses an AI model in the background.

You can:
- Practice interview questions.
- Keep the UI looking like normal **Notes** so it’s safer during screen share.
- Toggle a **stealth mode** that shows a plain notes page with a keyboard shortcut.

---

## 1. Features

- **Notes‑style UI**
  - Sidebar shows "Notes" and "Private Notes" instead of chat/conversation wording.
  - Each conversation appears like a **note** (Note 1, Note 2, or your custom title).
  - Main area looks like a dark notes editor.

- **AI Assistant hidden behind notes**
  - Under the hood, each note is actually a chat between **Me** and **AI**.
  - AI answers come from OpenAI (via Emergent Integrations) using the `EMERGENT_LLM_KEY`.

- **Stealth Mode (for interviews)**
  - Keyboard shortcut: **Ctrl + Shift + H**
  - When enabled:
    - The whole app switches to a very simple **Notes** page (title + textarea).
    - The browser tab title shows **"Notes"**.
    - No GPT / AI / interview wording is visible.
  - Press **Ctrl + Shift + H** again to return to the normal notes UI.

- **Multi‑note (multi‑conversation) support**
  - Create, view, and delete notes.
  - Each note keeps its own history of Me / AI messages.

---

## 2. Tech Stack

- **Frontend:** React (Create React App), TailwindCSS, shadcn/ui components
- **Backend:** FastAPI (Python)
- **Database:** MongoDB (via `motor` async driver)
- **AI Integration:** `emergentintegrations` using `EMERGENT_LLM_KEY`

Folder layout (in this repo):

```bash
/app
  ├── backend       # FastAPI app, MongoDB, AI integration
  └── frontend      # React app (Notes UI + stealth mode)
```

---

## 3. How to run locally

### 3.1. Prerequisites

- Python 3.10+
- Node.js + yarn
- MongoDB running locally (or a MongoDB URI)
- An **Emergent universal key** configured as `EMERGENT_LLM_KEY` (if you want real AI replies)

> If you just want to run the UI without AI, you can leave `EMERGENT_LLM_KEY` empty and adjust the backend to mock responses.

---

### 3.2. Backend setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/` (if not already present):

```env
MONGO_URL="mongodb://localhost:27017"   # or your MongoDB URI
DB_NAME="interview_notes_ai"           # any DB name you like
CORS_ORIGINS="*"
EMERGENT_LLM_KEY=sk-emergent-...        # your Emergent universal key
```

Run the backend server locally:

```bash
uvicorn server:app --host 0.0.0.0 --port 8001
```

The API will be available at: `http://localhost:8001/api`.

Key endpoints:

- `GET  /api/` – health check
- `POST /api/conversations` – create a new note
- `GET  /api/conversations` – list notes
- `GET  /api/conversations/{id}` – get one note with all messages
- `DELETE /api/conversations/{id}` – delete a note and its messages
- `POST /api/chat` – send a message and get an AI reply

---

### 3.3. Frontend setup (React)

```bash
cd frontend
yarn install
```

Create a `.env` file in `frontend/`:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

Run the frontend locally:

```bash
yarn start
```

Open **http://localhost:3000** in your browser.

---

## 4. How to use (for interviews)

### Normal practice mode

1. Open the app in your browser.
2. Click **New note** in the sidebar.
3. Type your interview question or prompt in the bottom input and press **Enter**.
4. You’ll see messages appear as **Me** and **AI**.

### Stealth mode during screen share

- **Shortcut:** `Ctrl + Shift + H`

Steps:

1. Before or during screen share, press **Ctrl + Shift + H**.
2. The screen changes to a simple **Notes** page:
   - Title: "Notes"
   - Textarea for writing plain notes
   - No visible AI / GPT / chat labels
3. When you are done sharing, press **Ctrl + Shift + H** again to come back to the full notes + AI view.

> Tip: For maximum safety in real interviews, keep this app on a **second monitor** or a **second device (phone/tablet)** so it never appears in your shared screen at all.

---

## 5. Deploying

This project was originally built and deployed on the **Emergent** platform.

You can:

1. Develop here on Emergent and click **"Save to GitHub"** to push code to your repo.
2. Clone the repo locally and deploy to your own hosting (Render, Railway, etc.) using:
   - `backend` as a FastAPI + MongoDB service
   - `frontend` as a static React build served by any static host

If you deploy outside Emergent, make sure:

- The backend listens on `0.0.0.0` and a known port.
- All API routes are served under `/api`.
- The frontend `REACT_APP_BACKEND_URL` points to your deployed backend URL.

---

## 6. Keyboard shortcuts

- **Ctrl + Shift + H** – toggle **Stealth Notes** view on/off.

---

## 7. Safety notes

This tool is meant to help you **practice** interviews and structure your thoughts.
Use it responsibly. In real interviews:
- Avoid reading answers word‑for‑word.
- Use the AI as a guide, not a crutch.
- Make sure you can explain and extend any answer in your own words.
