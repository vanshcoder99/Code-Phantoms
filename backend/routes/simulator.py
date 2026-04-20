"""
Simulator API Routes — InvestSafe Arena
========================================
All endpoints for the virtual portfolio simulator.
Prefix: /simulator (added in main.py)
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional
from sqlalchemy.orm import Session

from database import get_db
from auth import get_optional_user
from models import User, VirtualPortfolio

from services.virtual_portfolio_service import (
    create_portfolio,
    get_portfolio_state,
    execute_buy,
    execute_sell,
    advance_day,
)
from data.mock_prices import (
    ASSETS,
    get_all_current_prices,
    get_cached_history,
)
from services.price_predictor import predict_asset

# LLM — import only the NEW function we added
from ai.llm_service import explain_simulator_event

router = APIRouter()


# ── Request Schemas ──

class BuyRequest(BaseModel):
    asset_symbol: str
    amount_inr: float = Field(..., ge=100, description="Amount in INR (min ₹100)")


class SellRequest(BaseModel):
    asset_symbol: str
    shares: float = Field(..., gt=0, description="Number of shares to sell")


# ══════════════════════════════════════════════════
# POST /simulator/portfolio/create
# ══════════════════════════════════════════════════

@router.post("/portfolio/create")
def create_virtual_portfolio(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """
    Create a new virtual portfolio with ₹1,00,000 starting cash.
    Links to user account if authenticated.
    """
    user_id = current_user.id if current_user else None
    portfolio = create_portfolio(db, user_id=user_id)

    # If user is logged in, try to fetch their ML investor profile
    investor_profile = None
    if current_user and current_user.risk_tolerance:
        # Map the user's risk_tolerance to profile names
        profile_map = {
            "low": "Conservative",
            "medium": "Moderate",
            "high": "Growth",
            "very_high": "Aggressive",
        }
        investor_profile = profile_map.get(
            current_user.risk_tolerance.lower(), "Moderate"
        )
        portfolio.investor_profile = investor_profile
        db.commit()
        db.refresh(portfolio)

    return {
        "session_id": portfolio.session_id,
        "cash_balance": portfolio.cash_balance,
        "investor_profile": portfolio.investor_profile,
        "current_day": portfolio.current_day,
        "message": "Welcome to InvestSafe Arena! You have ₹1,00,000 virtual cash to practice investing. 🎯",
    }


# ══════════════════════════════════════════════════
# GET /simulator/portfolio/{session_id}
# ══════════════════════════════════════════════════

@router.get("/portfolio/{session_id}")
def get_portfolio(session_id: str, db: Session = Depends(get_db)):
    """Get full portfolio state including holdings, P&L, and transactions."""
    state = get_portfolio_state(db, session_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return state


# ══════════════════════════════════════════════════
# GET /simulator/prices
# ══════════════════════════════════════════════════

@router.get("/prices")
def get_prices(day: int = 0):
    """
    Get current prices for all 10 assets.
    Pass ?day=N to get prices at a specific simulated day.
    """
    prices = get_all_current_prices(day)
    return list(prices.values())


# ══════════════════════════════════════════════════
# GET /simulator/prices/{asset_symbol}/history
# ══════════════════════════════════════════════════

@router.get("/prices/{asset_symbol}/history")
def get_price_history(asset_symbol: str):
    """Get 90-day historical OHLCV data for charting."""
    if asset_symbol not in ASSETS:
        raise HTTPException(status_code=404, detail=f"Unknown asset: {asset_symbol}")
    return get_cached_history(asset_symbol)


# ══════════════════════════════════════════════════
# POST /simulator/portfolio/{session_id}/buy
# ══════════════════════════════════════════════════

@router.post("/portfolio/{session_id}/buy")
def buy_asset(session_id: str, req: BuyRequest, db: Session = Depends(get_db)):
    """Buy an asset with virtual cash."""
    # Load portfolio for profile check
    portfolio = db.query(VirtualPortfolio).filter(
        VirtualPortfolio.session_id == session_id
    ).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    investor_profile = portfolio.investor_profile

    # Check for profile mismatch (Conservative/Moderate buying HIGH risk)
    asset_info = ASSETS.get(req.asset_symbol)
    if not asset_info:
        raise HTTPException(status_code=404, detail=f"Unknown asset: {req.asset_symbol}")

    profile_mismatch = False
    if investor_profile in ("Conservative", "Moderate") and asset_info["risk"] == "HIGH":
        profile_mismatch = True

    # Generate mismatch warning via LLM (but still allow the buy)
    finbuddy_message = ""
    if profile_mismatch:
        try:
            finbuddy_message = explain_simulator_event(
                "profile_mismatch",
                {
                    "asset_name": asset_info["full_name"],
                    "alternative": "NIFTY_50_INDEX",
                },
                investor_profile=investor_profile,
            )
        except Exception:
            finbuddy_message = "Yeh asset thoda risky hai for your profile. Safe option try karo!"

    # Execute the buy
    try:
        result = execute_buy(db, session_id, req.asset_symbol, req.amount_inr)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Get buy confirmation message from LLM (only if no mismatch message)
    if not finbuddy_message:
        try:
            finbuddy_message = explain_simulator_event(
                "buy_confirmed",
                {
                    "asset_name": asset_info["full_name"],
                    "amount": req.amount_inr,
                    "current_price": result["price"],
                },
                investor_profile=investor_profile,
            )
        except Exception:
            finbuddy_message = "Investment journey chal rahi hai! Keep learning. 🌱"

    result["finbuddy_message"] = finbuddy_message
    result["profile_mismatch"] = profile_mismatch
    return result


# ══════════════════════════════════════════════════
# POST /simulator/portfolio/{session_id}/sell
# ══════════════════════════════════════════════════

@router.post("/portfolio/{session_id}/sell")
def sell_asset(session_id: str, req: SellRequest, db: Session = Depends(get_db)):
    """Sell shares of an asset."""
    portfolio = db.query(VirtualPortfolio).filter(
        VirtualPortfolio.session_id == session_id
    ).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    try:
        result = execute_sell(db, session_id, req.asset_symbol, req.shares)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # LLM explanation based on profit/loss
    event_type = "sell_profit" if result["realized_pnl"] >= 0 else "sell_loss"
    asset_info = ASSETS.get(req.asset_symbol, {})
    try:
        finbuddy_message = explain_simulator_event(
            event_type,
            {
                "asset_name": asset_info.get("full_name", req.asset_symbol),
                "pnl": result["realized_pnl"],
                "pnl_pct": result["realized_pnl_pct"],
                "reason": "market fluctuation",
            },
            investor_profile=portfolio.investor_profile,
        )
    except Exception:
        if result["realized_pnl"] >= 0:
            finbuddy_message = "Profit book kiya! Smart move. Keep it up! 💰"
        else:
            finbuddy_message = "Market mein thoda neeche aaya, but yeh normal hai! Long-term sochte hain. 💪"

    result["finbuddy_message"] = finbuddy_message
    return result


# ══════════════════════════════════════════════════
# POST /simulator/portfolio/{session_id}/advance-day
# ══════════════════════════════════════════════════

@router.post("/portfolio/{session_id}/advance-day")
def advance_simulation_day(session_id: str, db: Session = Depends(get_db)):
    """Advance the simulation by 1 day — recalculates all prices and P&L."""
    portfolio = db.query(VirtualPortfolio).filter(
        VirtualPortfolio.session_id == session_id
    ).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    try:
        result = advance_day(db, session_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # If crash happened, get LLM explanation
    crash_message = ""
    if result["crash_event"] and result["crash_details"]:
        first_crash = result["crash_details"][0]
        try:
            crash_message = explain_simulator_event(
                "crash_event",
                {
                    "asset_name": first_crash["full_name"],
                    "drop_pct": first_crash["drop_pct"],
                },
                investor_profile=portfolio.investor_profile,
            )
        except Exception:
            crash_message = "Market crash scary lagta hai, but yeh temporary hota hai. Panic mat karo!"

    # Daily update from LLM
    try:
        daily_message = explain_simulator_event(
            "daily_update",
            {
                "day": result["new_day"],
                "total_value": result["portfolio_value"],
                "day_pnl": result["pnl_change"],
            },
            investor_profile=portfolio.investor_profile,
        )
    except Exception:
        daily_message = "Investment journey chal rahi hai! Keep learning. 🌱"

    result["finbuddy_message"] = crash_message if crash_message else daily_message
    result["crash_message"] = crash_message
    return result


# ══════════════════════════════════════════════════
# GET /simulator/portfolio/{session_id}/prediction/{asset_symbol}
# ══════════════════════════════════════════════════

@router.get("/portfolio/{session_id}/prediction/{asset_symbol}")
def get_prediction(session_id: str, asset_symbol: str, db: Session = Depends(get_db)):
    """Get technical analysis and price prediction for an asset."""
    portfolio = db.query(VirtualPortfolio).filter(
        VirtualPortfolio.session_id == session_id
    ).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    if asset_symbol not in ASSETS:
        raise HTTPException(status_code=404, detail=f"Unknown asset: {asset_symbol}")

    try:
        prediction = predict_asset(asset_symbol, portfolio.current_day)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    return prediction


# ══════════════════════════════════════════════════
# GET /simulator/portfolio/{session_id}/analysis
# ══════════════════════════════════════════════════

@router.get("/portfolio/{session_id}/analysis")
def get_portfolio_analysis(session_id: str, db: Session = Depends(get_db)):
    """Full portfolio analysis: diversification, risk alignment, best/worst assets."""
    state = get_portfolio_state(db, session_id)
    if state is None:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    holdings = state.get("holdings", {})
    investor_profile = state.get("investor_profile", "Moderate")

    # ── Diversification by type ──
    allocation = {"STOCK": 0, "MUTUAL_FUND": 0, "CRYPTO": 0, "GOLD": 0, "CASH": state["cash_balance"]}
    for symbol, h in holdings.items():
        asset_type = ASSETS.get(symbol, {}).get("type", "STOCK")
        allocation[asset_type] = allocation.get(asset_type, 0) + h["current_value"]

    total_val = state["total_portfolio_value"]
    allocation_pct = {
        k: round(v / total_val * 100, 1) if total_val > 0 else 0
        for k, v in allocation.items()
    }

    # ── Risk Score ── (weighted by holdings)
    risk_weights = {"LOW": 1, "MEDIUM": 2, "HIGH": 3}
    if holdings:
        weighted_risk = sum(
            risk_weights.get(ASSETS.get(s, {}).get("risk", "MEDIUM"), 2) * h["current_value"]
            for s, h in holdings.items()
        )
        invested_total = sum(h["current_value"] for h in holdings.values())
        avg_risk_score = weighted_risk / invested_total if invested_total > 0 else 1.5
    else:
        avg_risk_score = 1.0

    if avg_risk_score < 1.5:
        overall_risk = "LOW"
    elif avg_risk_score < 2.3:
        overall_risk = "MEDIUM"
    else:
        overall_risk = "HIGH"

    # ── Profile alignment ──
    profile_risk_target = {
        "Conservative": 1.2, "Moderate": 1.8, "Growth": 2.3, "Aggressive": 2.8
    }
    target = profile_risk_target.get(investor_profile, 1.8)
    alignment = max(0, 100 - abs(avg_risk_score - target) * 40)
    alignment = min(100, round(alignment, 1))

    # ── Best / Worst performing ──
    best_asset = None
    worst_asset = None
    if holdings:
        sorted_holdings = sorted(holdings.values(), key=lambda x: x["unrealized_pnl_pct"])
        worst_asset = {
            "symbol": sorted_holdings[0]["symbol"],
            "name": sorted_holdings[0]["full_name"],
            "pnl_pct": sorted_holdings[0]["unrealized_pnl_pct"],
        }
        best_asset = {
            "symbol": sorted_holdings[-1]["symbol"],
            "name": sorted_holdings[-1]["full_name"],
            "pnl_pct": sorted_holdings[-1]["unrealized_pnl_pct"],
        }

    # ── LLM rebalancing advice ──
    try:
        rebalance_message = explain_simulator_event(
            "daily_update",
            {
                "day": state["current_day"],
                "total_value": total_val,
                "day_pnl": state["total_pnl"],
            },
            investor_profile=investor_profile,
        )
    except Exception:
        rebalance_message = "Portfolio review time! Check your asset allocation. 📊"

    return {
        "allocation": allocation,
        "allocation_pct": allocation_pct,
        "overall_risk": overall_risk,
        "avg_risk_score": round(avg_risk_score, 2),
        "profile_alignment_pct": alignment,
        "investor_profile": investor_profile,
        "best_asset": best_asset,
        "worst_asset": worst_asset,
        "total_portfolio_value": state["total_portfolio_value"],
        "total_pnl": state["total_pnl"],
        "total_pnl_pct": state["total_pnl_pct"],
        "finbuddy_advice": rebalance_message,
        "transactions": state.get("transactions", []),
    }
