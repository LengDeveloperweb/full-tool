from datetime import datetime, timedelta, timezone
import os

import bcrypt
import jwt

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from backend.database import Base, engine, get_db
from backend.models import UserDB


# =========================
# Create database tables
# =========================

Base.metadata.create_all(bind=engine)


# =========================
# JWT settings
# =========================

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "your-super-secret-key-change-in-production"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30


# =========================
# FastAPI application
# =========================

app = FastAPI(
    title="LengTool API",
    description="Backend API for LengTool",
    version="1.0.0"
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        # Local development
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        "http://localhost:3000",
        "http://127.0.0.1:3000",

        # IMPORTANT:
        # Replace this with your real Vercel URL
        # Example:
        # "https://lengtool.vercel.app",
    ],

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# OAuth2
# =========================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="token"
)


# =========================
# Pydantic Models
# =========================

class UserCreate(BaseModel):
    username: str
    password: str


class UserResponse(BaseModel):
    username: str


class Token(BaseModel):
    access_token: str
    token_type: str


# =========================
# Password functions
# =========================

def hash_password(password: str) -> str:
    """
    Hash password using bcrypt.

    Bcrypt supports passwords up to 72 bytes.
    """

    password_bytes = password.encode("utf-8")

    if len(password_bytes) > 72:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be 72 bytes or fewer",
        )

    hashed = bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt()
    )

    return hashed.decode("utf-8")


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )

    except (ValueError, TypeError):
        return False


# =========================
# JWT functions
# =========================

def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
):

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=15)
    )

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# =========================
# Signup
# =========================

@app.post(
    "/signup",
    response_model=UserResponse
)
def signup(
    user: UserCreate,
    db: Session = Depends(get_db),
):

    # Check existing username
    existing_user = (
        db.query(UserDB)
        .filter(UserDB.username == user.username)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    # Hash password
    hashed_password = hash_password(
        user.password
    )

    # Create user
    new_user = UserDB(
        username=user.username,
        hashed_password=hashed_password,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return UserResponse(
        username=new_user.username
    )


# =========================
# Login
# =========================

@app.post(
    "/token",
    response_model=Token
)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    user = (
        db.query(UserDB)
        .filter(UserDB.username == form_data.username)
        .first()
    )

    # Check username and password
    if not user or not verify_password(
        form_data.password,
        user.hashed_password,
    ):

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={
                "WWW-Authenticate": "Bearer"
            },
        )

    # JWT expiration
    access_token_expires = timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    # Create JWT
    access_token = create_access_token(
        data={
            "sub": user.username
        },
        expires_delta=access_token_expires,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# =========================
# Current User
# =========================

@app.get(
    "/users/me",
    response_model=UserResponse
)
def read_users_me(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        },
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        username = payload.get("sub")

        if username is None:
            raise credentials_exception

    except jwt.PyJWTError:
        raise credentials_exception

    # Find user
    user = (
        db.query(UserDB)
        .filter(UserDB.username == username)
        .first()
    )

    if user is None:
        raise credentials_exception

    return UserResponse(
        username=user.username
    )


# =========================
# Visitor Counter
# =========================

@app.get("/api/visits")
def get_visitor_count(
    db: Session = Depends(get_db)
):

    # Increment visitor count
    db.execute(
        text(
            """
            UPDATE site_stats
            SET stat_value = stat_value + 1
            WHERE stat_key = 'total_visits'
            """
        )
    )

    db.commit()

    # Get updated count
    result = db.execute(
        text(
            """
            SELECT stat_value
            FROM site_stats
            WHERE stat_key = 'total_visits'
            """
        )
    ).fetchone()

    current_count = result[0] if result else 1

    return {
        "visit_count": current_count
    }


# =========================
# Health Check
# =========================

@app.get("/")
def root():

    return {
        "message": "LengTool FastAPI backend is running",
        "status": "ok"
    }