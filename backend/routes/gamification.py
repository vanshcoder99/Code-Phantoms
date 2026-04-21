"""
Gamification API Routes — Predictive Loot & Smart Spin Engine
==============================================================
All endpoints for the gamified daily engagement system.
Prefix: /api/v1/gamification
Auth: All routes require JWT authentication.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models import User

from services.gamification_service import (
    get_profile_data,
    check_daily_login,
    execute_spin,
    make_prediction,
    resolve_predictions,
    get_predictions,
    get_spin_history,
    get_leaderboard,
    get_available_assets_for_prediction,
    SPIN_SLOTS,
)

router = APIRouter(prefix="/api/v1/gamification", tags=["gamification"])


# ── Request Schemas ──

class PredictionRequest(BaseModel):
    asset_symbol: str
    direction: str = Field(..., pattern="^(UP|DOWN)$", description="UP or DOWN")


# ══════════════════════════════════════════════════
# GET /api/v1/gamification/profile
# ══════════════════════════════════════════════════

@router.get("/profile")
def get_gamification_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get the user's full gamification profile."""
    return get_profile_data(db, current_user.id)


# ══════════════════════════════════════════════════
# POST /api/v1/gamification/daily-login
# ══════════════════════════════════════════════════

@router.post("/daily-login")
def daily_login(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Record daily login, update streak, award daily XP."""
    return check_daily_login(db, current_user.id)


# ══════════════════════════════════════════════════
# POST /api/v1/gamification/spin
# ══════════════════════════════════════════════════

@router.post("/spin")
def spin_wheel(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Execute the daily spin wheel. Returns reward and animation data."""
    return execute_spin(db, current_user.id)


# ══════════════════════════════════════════════════
# GET /api/v1/gamification/spin-history
# ══════════════════════════════════════════════════

@router.get("/spin-history")
def spin_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get last 10 spin results."""
    return get_spin_history(db, current_user.id)


# ══════════════════════════════════════════════════
# GET /api/v1/gamification/spin-slots
# ══════════════════════════════════════════════════

@router.get("/spin-slots")
def get_spin_slots():
    """Get the spin wheel slot configuration (for rendering the wheel)."""
    return SPIN_SLOTS


# ══════════════════════════════════════════════════
# POST /api/v1/gamification/predict
# ══════════════════════════════════════════════════

@router.post("/predict")
def predict_market(
    req: PredictionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Make a market prediction for an asset (UP or DOWN)."""
    try:
        return make_prediction(db, current_user.id, req.asset_symbol, req.direction)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ══════════════════════════════════════════════════
# GET /api/v1/gamification/predictions
# ══════════════════════════════════════════════════

@router.get("/predictions")
def get_user_predictions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get user's predictions (pending + last 10 resolved)."""
    return get_predictions(db, current_user.id)


# ══════════════════════════════════════════════════
# POST /api/v1/gamification/resolve-predictions
# ══════════════════════════════════════════════════

@router.post("/resolve-predictions")
def resolve_user_predictions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Resolve all pending predictions against current prices."""
    return resolve_predictions(db, current_user.id)


# ══════════════════════════════════════════════════
# GET /api/v1/gamification/assets
# ══════════════════════════════════════════════════

@router.get("/assets")
def get_prediction_assets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get available assets for predictions (with today's prediction status)."""
    return get_available_assets_for_prediction(db, current_user.id)


# ══════════════════════════════════════════════════
# GET /api/v1/gamification/leaderboard
# ══════════════════════════════════════════════════

@router.get("/leaderboard")
def leaderboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get top 10 users by XP."""
    return get_leaderboard(db, limit=10)
