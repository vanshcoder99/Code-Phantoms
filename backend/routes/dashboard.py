"""
Dashboard Routes
Provides summary and analytics
"""
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1", tags=["dashboard"])


@router.get("/dashboard")
async def get_dashboard():
    """
    Get dashboard summary
    
    Returns:
        - total_simulations: Total simulations run
        - avg_risk: Average risk level
        - recent_activity: Recent user activities
    """
    return {
        "total_simulations": 5,
        "avg_risk": 0.5,
        "recent_activity": [
            {
                "action": "simulation_run",
                "risk_level": "medium",
                "timestamp": "2024-01-15T10:30:00"
            },
            {
                "action": "portfolio_explained",
                "portfolio": "50% Stocks, 30% Bonds",
                "timestamp": "2024-01-15T09:15:00"
            }
        ],
        "stats": {
            "total_invested": 50000,
            "portfolio_value": 52500,
            "gain_loss": 2500,
            "gain_loss_percent": 5.0
        }
    }
