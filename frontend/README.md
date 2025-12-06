# Frontend (Interview Notes AI)

This is the React frontend for the **Interview Notes AI** app.

- Built with **Create React App**.
- Styled with **TailwindCSS** and **shadcn/ui** components.
- Talks to the FastAPI backend via `REACT_APP_BACKEND_URL` (all routes under `/api`).

## Available scripts

```bash
yarn start      # run dev server on http://localhost:3000
yarn build      # production build
yarn test       # run tests (if added)
```

## Environment variables

Create a `.env` file in this `frontend` folder:

```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

- This must point to your backend base URL (without `/api`).
- In production, set this to your deployed backend URL.

## Stealth / Notes behaviour

- The app is intentionally designed to look like a **Notes** application.
- The browser tab title is **"Notes"**.
- Sidebar shows "Notes", "Personal Workspace", and "Private Notes".

### Stealth mode

- Global keyboard shortcut: **Ctrl + Shift + H**
- When active, the UI switches to a very simple **Notes** page with a textarea.
- Press the same shortcut again to return to the full notes view.

Use this if you are sharing your screen and want to hide the AI behaviour temporarily.
