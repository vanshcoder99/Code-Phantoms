"""
Authentication Routes
Signup, Login, Profile management
"""
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from database import get_db
from models import User
from auth import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["authentication"])


# --- Request/Response Models ---

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ProfileUpdateRequest(BaseModel):
    name: str = None
    risk_tolerance: str = None
    investment_goal: str = None
    experience: str = None

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


# --- Endpoints ---

@router.post("/signup")
async def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """Create a new user account"""
    # Check if email already exists
    existing = db.query(User).filter(User.email == request.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists"
        )

    # Validate inputs
    if len(request.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )
    if not request.name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name is required"
        )

    # Create user
    user = User(
        email=request.email.lower().strip(),
        name=request.name.strip(),
        hashed_password=hash_password(request.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Generate token
    token = create_access_token({"user_id": user.id, "email": user.email})

    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "risk_tolerance": user.risk_tolerance,
            "investment_goal": user.investment_goal,
            "experience": user.experience,
        }
    }


@router.post("/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Login and receive JWT token"""
    user = db.query(User).filter(User.email == request.email.lower().strip()).first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token({"user_id": user.id, "email": user.email})

    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "risk_tolerance": user.risk_tolerance,
            "investment_goal": user.investment_goal,
            "experience": user.experience,
        }
    }


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current logged-in user profile"""
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "risk_tolerance": current_user.risk_tolerance,
        "investment_goal": current_user.investment_goal,
        "experience": current_user.experience,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
    }


@router.put("/profile")
async def update_profile(
    request: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    if request.name is not None:
        current_user.name = request.name.strip()
    if request.risk_tolerance is not None:
        current_user.risk_tolerance = request.risk_tolerance
    if request.investment_goal is not None:
        current_user.investment_goal = request.investment_goal
    if request.experience is not None:
        current_user.experience = request.experience

    db.commit()
    db.refresh(current_user)

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "risk_tolerance": current_user.risk_tolerance,
        "investment_goal": current_user.investment_goal,
        "experience": current_user.experience,
    }


@router.put("/change-password")
async def change_password(
    request: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    if not verify_password(request.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    if len(request.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters"
        )

    current_user.hashed_password = hash_password(request.new_password)
    db.commit()

    return {"message": "Password changed successfully"}
