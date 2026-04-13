"""
Risk Simulation Routes
Handles simulation requests and calculations — saves to database per user
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from services.simulation_engine import generate_simulation, calculate_loss_probability
from database import get_db
from models import Simulation, User
from auth import get_optional_user, get_current_user

router = APIRouter(prefix="/api/v1", tags=["simulation"])


class SimulationRequest(BaseModel):
    initial_amount: float
    time_period: int
    risk_level: str


class LossProbabilityRequest(BaseModel):
    risk_level: str


@router.post("/simulate-risk")
async def simulate_risk(
    request: SimulationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_user)
):
    """
    Run a risk simulation based on parameters.
    If user is logged in, saves result to their account.
    """
    try:
        # Validate inputs
        if request.initial_amount <= 0:
            raise HTTPException(status_code=400, detail="Initial amount must be positive")
        if request.time_period <= 0:
            raise HTTPException(status_code=400, detail="Time period must be positive")
        if request.risk_level not in ['low', 'medium', 'high']:
            raise HTTPException(status_code=400, detail="Risk level must be low, medium, or high")

        # Generate simulation
        result = generate_simulation(
            request.initial_amount,
            request.time_period,
            request.risk_level
        )

        # Save to database if user is logged in
        if current_user:
            sim = Simulation(
                user_id=current_user.id,
                initial_amount=request.initial_amount,
                time_period=request.time_period,
                risk_level=request.risk_level,
                best_case=result['best_case'],
                worst_case=result['worst_case'],
                average_case=result['average_case'],
                graph_data=result['graph_data']
            )
            db.add(sim)
            db.commit()
            db.refresh(sim)
            result['simulation_id'] = sim.id
            result['saved'] = True
        else:
            result['saved'] = False

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")


@router.post("/loss-probability")
async def get_loss_probability(request: LossProbabilityRequest):
    """
    Calculate loss probability for a given risk level
    """
    try:
        if request.risk_level not in ['low', 'medium', 'high']:
            raise HTTPException(status_code=400, detail="Risk level must be low, medium, or high")

        result = calculate_loss_probability(request.risk_level)
        result['risk_level'] = request.risk_level

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation failed: {str(e)}")


@router.get("/simulations")
async def get_simulations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's simulation history from database"""
    simulations = db.query(Simulation)\
        .filter(Simulation.user_id == current_user.id)\
        .order_by(Simulation.created_at.desc())\
        .all()

    return {
        "simulations": [
            {
                "id": sim.id,
                "initial_amount": sim.initial_amount,
                "time_period": sim.time_period,
                "risk_level": sim.risk_level,
                "best_case": sim.best_case,
                "worst_case": sim.worst_case,
                "average_case": sim.average_case,
                "graph_data": sim.graph_data,
                "created_at": sim.created_at.isoformat() if sim.created_at else None
            }
            for sim in simulations
        ]
    }


@router.delete("/simulations/{simulation_id}")
async def delete_simulation(
    simulation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a simulation by ID (only if owned by current user)"""
    sim = db.query(Simulation)\
        .filter(Simulation.id == simulation_id, Simulation.user_id == current_user.id)\
        .first()

    if not sim:
        raise HTTPException(status_code=404, detail="Simulation not found")

    db.delete(sim)
    db.commit()
    return {"message": "Simulation deleted successfully"}
