"""
Portfolio Routes
Handles portfolio explanation and analysis
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ai.llm_service import explain_portfolio as ai_explain_portfolio

router = APIRouter(prefix="/api/v1", tags=["portfolio"])


class PortfolioRequest(BaseModel):
    portfolio: str


@router.post("/explain-portfolio")
async def explain_portfolio(request: PortfolioRequest):
    """
    Get AI explanation of a portfolio
    
    Returns:
        - explanation: AI-generated explanation
        - risk_score: Estimated risk score (0-1)
        - suggestions: Improvement suggestions
    """
    try:
        if not request.portfolio or len(request.portfolio.strip()) == 0:
            raise HTTPException(status_code=400, detail="Portfolio cannot be empty")
        
        # Get AI explanation
        explanation = ai_explain_portfolio(request.portfolio)
        
        # Calculate risk score (mock for MVP)
        risk_score = 0.5  # Default medium risk
        if 'high' in request.portfolio.lower() or 'crypto' in request.portfolio.lower():
            risk_score = 0.7
        elif 'bond' in request.portfolio.lower() or 'gold' in request.portfolio.lower():
            risk_score = 0.3
        
        return {
            "explanation": explanation,
            "risk_score": risk_score,
            "suggestions": "Consider diversifying across different asset classes for better risk management."
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Portfolio analysis failed: {str(e)}")


@router.get("/portfolios")
async def get_portfolios():
    """
    Get user's portfolio history
    (In MVP, returns mock data)
    """
    return {
        "portfolios": [
            {
                "id": 1,
                "portfolio": "50% Stocks, 30% Bonds, 20% Gold",
                "risk_score": 0.5,
                "created_at": "2024-01-15"
            }
        ]
    }
