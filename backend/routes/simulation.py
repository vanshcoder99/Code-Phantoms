"""
Risk Simulation Routes
Handles simulation requests and calculations
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.simulation_engine import generate_simulation, calculate_loss_probability

router = APIRouter(prefix="/api/v1", tags=["simulation"])


class SimulationRequest(BaseModel):
    initial_amount: float
    time_period: int
    risk_level: str


class LossProbabilityRequest(BaseModel):
    risk_level: str


@router.post("/simulate-risk")
async def simulate_risk(request: SimulationRequest):
    """
    Run a risk simulation based on parameters
    
    Returns:
        - best_case: Best case scenario outcome
        - worst_case: Worst case scenario outcome
        - average_case: Average case scenario outcome
        - graph_data: Month-by-month portfolio values
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
        
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")


@router.post("/loss-probability")
async def get_loss_probability(request: LossProbabilityRequest):
    """
    Calculate loss probability for a given risk level
    
    Returns:
        - loss_probability: Percentage chance of loss
        - confidence: Confidence score (0-1)
        - risk_level: The risk level provided
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
async def get_simulations():
    """
    Get user's simulation history
    (In MVP, returns mock data)
    """
    return {
        "simulations": [
            {
                "id": 1,
                "initial_amount": 10000,
                "time_period": 12,
                "risk_level": "medium",
                "created_at": "2024-01-15"
            }
        ]
    }
