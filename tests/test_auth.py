import os

os.environ.setdefault("SECRET_KEY", "test-secret-key-that-is-at-least-32-characters-long")

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from database import Base, get_db
from main import app

test_engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSession = sessionmaker(bind=test_engine, autoflush=False, autocommit=False)


def override_get_db():
    with TestSession() as session:
        yield session


app.dependency_overrides[get_db] = override_get_db


def setup_function():
    Base.metadata.create_all(bind=test_engine)


def teardown_function():
    Base.metadata.drop_all(bind=test_engine)


def test_register_login_and_current_user():
    with TestClient(app) as client:
        registration = client.post(
            "/api/auth/register",
            json={"username": "test_player", "email": "player@example.com", "password": "correct-horse-42"},
        )
        assert registration.status_code == 201
        token = registration.json()["access_token"]
        assert registration.json()["user"]["username"] == "test_player"

        login = client.post("/api/auth/login", json={"email": "PLAYER@example.com", "password": "correct-horse-42"})
        assert login.status_code == 200

        profile = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert profile.status_code == 200
        assert profile.json()["email"] == "player@example.com"


def test_duplicate_registration_and_protected_chat():
    with TestClient(app) as client:
        payload = {"username": "test_player", "email": "player@example.com", "password": "correct-horse-42"}
        assert client.post("/api/auth/register", json=payload).status_code == 201
        duplicate = client.post("/api/auth/register", json=payload)
        assert duplicate.status_code == 409
        assert client.post("/api/chat", json={"prompt": "suggest a game"}).status_code == 401


def test_authenticated_chat_without_gemini_key(monkeypatch):
    monkeypatch.delenv("GEMINI_API_KEY", raising=False)
    with TestClient(app) as client:
        registration = client.post(
            "/api/auth/register",
            json={"username": "chat_player", "email": "chat@example.com", "password": "correct-horse-42"},
        )
        token = registration.json()["access_token"]
        response = client.post(
            "/api/chat",
            headers={"Authorization": f"Bearer {token}"},
            json={"prompt": "Recommend a co-op game"},
        )
        assert response.status_code == 503
        assert response.json()["detail"] == (
            "AI chat is not configured. Set GEMINI_API_KEY in the backend .env and restart the API."
        )