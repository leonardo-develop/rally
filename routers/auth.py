from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from auth import create_access_token, get_current_user, hash_password, verify_password
from database import get_db
from models import User
from schemas import Token, UserLogin, UserPublic, UserRegister

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _issue_token(user: User) -> Token:
    return Token(access_token=create_access_token(user.id), user=UserPublic.model_validate(user))


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(payload: UserRegister, db: Session = Depends(get_db)) -> Token:
    normalized_email = str(payload.email).strip().lower()
    normalized_username = payload.username.strip()
    existing = db.scalar(
        select(User.id).where(
            or_(func.lower(User.email) == normalized_email, func.lower(User.username) == normalized_username.lower())
        )
    )
    if existing is not None:
        raise HTTPException(status_code=409, detail="Username or email is already registered")

    user = User(
        username=normalized_username,
        email=normalized_email,
        hashed_password=hash_password(payload.password),
        auth_provider="local",
    )
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Username or email is already registered") from None
    return _issue_token(user)


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> Token:
    email = str(payload.email).strip().lower()
    user = db.scalar(select(User).where(func.lower(User.email) == email))
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password", headers={"WWW-Authenticate": "Bearer"})
    return _issue_token(user)


@router.post("/discord", status_code=status.HTTP_501_NOT_IMPLEMENTED)
def discord_stub() -> dict[str, str]:
    return {"detail": "Discord OAuth is not configured. Set up a registered OAuth application before enabling it."}


@router.get("/me", response_model=UserPublic)
def current_user(user: User = Depends(get_current_user)) -> User:
    return user