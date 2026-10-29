# Rally

Rally is a full-stack gamer community prototype built with FastAPI on the backend and React + Vite on the frontend. The app includes user authentication, a community lobby UI, and a protected AI chat assistant experience for gaming-related questions.

## Overview

- Backend: FastAPI, SQLAlchemy, Pydantic, JWT authentication
- Frontend: React, Vite, Tailwind CSS
- Database: SQLite for local development
- AI assistant: Gemini-powered chat endpoint with environment-based configuration
- Auth flow: local registration and login with bearer token validation

## Project structure

```text
.
├── auth.py
├── database.py
├── main.py
├── models.py
├── schemas.py
├── requirements.txt
├── .env.example
├── .gitignore
├── routers/
│   ├── __init__.py
│   ├── ai_chat.py
│   └── auth.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
├── tests/
│   └── test_auth.py
└── README.md
```

## Features

- User registration and login
- Protected routes using JWT bearer tokens
- SQLite-backed persistence for local development
- Community lobby and chat interface
- AI assistant chat endpoint gated by authentication
- Ready-to-run local development setup

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm

## Setup

### 1) Backend

From the project root:

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Then update the values in `.env` locally as needed. Keep secrets in your local environment file only and do not commit it to version control.

Start the backend:

```powershell
uvicorn main:app --reload
```

The API will be available at:

- Health check: http://localhost:8000/api/health
- Swagger docs: http://localhost:8000/docs

### 2) Frontend

Open a second terminal and run:

```powershell
cd frontend
npm install
npm run dev
```

The Vite dev server will print the local frontend URL, typically:

- http://localhost:5173

## Authentication

The app supports local registration and login through the API:

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

The server returns a JWT token that must be included in the Authorization header for protected routes.

## AI chat

The chat function is protected and requires a valid user token. The AI integration uses environment-based configuration and is intended for local development and testing.

## Testing

Run backend tests from the project root:

```powershell
pytest
```

Build the frontend bundle for production:

```powershell
cd frontend
npm run build
```

## Notes

- This project is designed for local development and demonstration.
- Discord OAuth is intentionally left as a stub and is not a working auth implementation.
- Do not commit local environment files containing secrets.
- For production use, add stronger auth, rate limiting, monitoring, and deployment hardening.

## License

This project is provided as a local development/demo project for learning and experimentation.