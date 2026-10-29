# Project Notes

- Backend: FastAPI, SQLAlchemy 2, and Pydantic 2. Run from the repository root with `uvicorn main:app --reload`.
- Frontend: Vite + React + Tailwind in `frontend/`; run `npm run dev` from that directory.
- Keep secrets in environment files; never commit `.env` files. Gemini is optional for API startup.
- Chat requires a valid bearer token and `GEMINI_API_KEY`.
- Discord authentication is a stub and must not be presented as working OAuth.