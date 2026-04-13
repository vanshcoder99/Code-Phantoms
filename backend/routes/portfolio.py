"""
Portfolio Routes
Handles portfolio explanation and analysis — saves to database per user
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ai.llm_service import explain_portfolio as ai_explain_portfolio
from database import get_db
from models import Portfolio, User
from auth import get_optional_user, get_current_user

router = APIRouter(prefix="/api/v1", tags=["portfolio"])


class PortfolioRequest(BaseModel):
    portfolio: str


@router.post("/explain-portfolio")
async def explain_portfolio(
    request: PortfolioRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_user)
):
    """
    Get AI explanation of a portfolio.
    If user is logged in, saves result to their account.
    """
    try:
        if not request.portfolio or len(request.portfolio.strip()) == 0:
            raise HTTPException(status_code=400, detail="Portfolio cannot be empty")

        # Get AI explanation
        explanation = ai_explain_portfolio(request.portfolio)

        # Calculate risk score
        risk_score = 0.5  # Default medium risk
        portfolio_lower = request.portfolio.lower()
        if 'high' in portfolio_lower or 'crypto' in portfolio_lower or 'small cap' in portfolio_lower:
            risk_score = 0.7
        elif 'bond' in portfolio_lower or 'gold' in portfolio_lower or 'fd' in portfolio_lower:
            risk_score = 0.3

        suggestions = "Consider diversifying across different asset classes for better risk management."

        # Save to database if user is logged in
        saved = False
        if current_user:
            portfolio_record = Portfolio(
                user_id=current_user.id,
                portfolio_text=request.portfolio,
                explanation=explanation,
                risk_score=risk_score,
                suggestions=suggestions
            )
            db.add(portfolio_record)
            db.commit()
            saved = True

        return {
            "explanation": explanation,
            "risk_score": risk_score,
            "suggestions": suggestions,
            "saved": saved
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Portfolio analysis failed: {str(e)}")


@router.get("/portfolios")
async def get_portfolios(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's portfolio analysis history from database"""
    portfolios = db.query(Portfolio)\
        .filter(Portfolio.user_id == current_user.id)\
        .order_by(Portfolio.created_at.desc())\
        .all()

    return {
        "portfolios": [
            {
                "id": p.id,
                "portfolio": p.portfolio_text,
                "explanation": p.explanation,
                "risk_score": p.risk_score,
                "suggestions": p.suggestions,
                "created_at": p.created_at.isoformat() if p.created_at else None
            }
            for p in portfolios
        ]
    }
