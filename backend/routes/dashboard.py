"""
Dashboard Routes
Provides real summary and analytics from database
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import User, Simulation, Portfolio
from auth import get_current_user

router = APIRouter(prefix="/api/v1", tags=["dashboard"])


@router.get("/dashboard")
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get dashboard summary with real data from database
    """
    # Count simulations
    total_simulations = db.query(func.count(Simulation.id))\
        .filter(Simulation.user_id == current_user.id).scalar() or 0

    # Average risk level mapping
    risk_map = {'low': 0.3, 'medium': 0.5, 'high': 0.8}
    simulations = db.query(Simulation)\
        .filter(Simulation.user_id == current_user.id)\
        .order_by(Simulation.created_at.desc())\
        .all()

    avg_risk = 0.0
    total_invested = 0.0
    total_portfolio_value = 0.0
    if simulations:
        risk_values = [risk_map.get(s.risk_level, 0.5) for s in simulations]
        avg_risk = sum(risk_values) / len(risk_values)
        total_invested = sum(s.initial_amount for s in simulations)
        total_portfolio_value = sum(s.average_case or s.initial_amount for s in simulations)

    gain_loss = total_portfolio_value - total_invested
    gain_loss_percent = (gain_loss / total_invested * 100) if total_invested > 0 else 0

    # Recent activity - last 10 items
    recent_sims = db.query(Simulation)\
        .filter(Simulation.user_id == current_user.id)\
        .order_by(Simulation.created_at.desc())\
        .limit(5).all()

    recent_portfolios = db.query(Portfolio)\
        .filter(Portfolio.user_id == current_user.id)\
        .order_by(Portfolio.created_at.desc())\
        .limit(5).all()

    recent_activity = []
    for s in recent_sims:
        recent_activity.append({
            "action": "simulation_run",
            "risk_level": s.risk_level,
            "amount": s.initial_amount,
            "timestamp": s.created_at.isoformat() if s.created_at else None
        })
    for p in recent_portfolios:
        recent_activity.append({
            "action": "portfolio_explained",
            "portfolio": p.portfolio_text[:50] + "..." if len(p.portfolio_text) > 50 else p.portfolio_text,
            "timestamp": p.created_at.isoformat() if p.created_at else None
        })

    # Sort by timestamp descending
    recent_activity.sort(key=lambda x: x.get("timestamp") or "", reverse=True)
    recent_activity = recent_activity[:10]

    # Risk distribution
    risk_distribution = {"low": 0, "medium": 0, "high": 0}
    for s in simulations:
        risk_distribution[s.risk_level] = risk_distribution.get(s.risk_level, 0) + 1

    # Portfolio allocation from latest simulation
    total_portfolios = db.query(func.count(Portfolio.id))\
        .filter(Portfolio.user_id == current_user.id).scalar() or 0

    return {
        "total_simulations": total_simulations,
        "total_portfolios": total_portfolios,
        "avg_risk": round(avg_risk, 2),
        "recent_activity": recent_activity,
        "risk_distribution": risk_distribution,
        "stats": {
            "total_invested": round(total_invested, 2),
            "portfolio_value": round(total_portfolio_value, 2),
            "gain_loss": round(gain_loss, 2),
            "gain_loss_percent": round(gain_loss_percent, 2)
        },
        "user": {
            "name": current_user.name,
            "member_since": current_user.created_at.isoformat() if current_user.created_at else None
        }
    }
