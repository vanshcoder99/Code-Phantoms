"""
Virtual Portfolio Service — InvestSafe Arena
=============================================
Service layer handling all portfolio logic: create, buy, sell, advance day.
Talks to SQLite via SQLAlchemy and uses mock_prices for price data.
"""

import uuid
from datetime import datetime, timezone
from typing import Dict, Optional, List
from sqlalchemy.orm import Session

from models import VirtualPortfolio, VirtualTransaction
from data.mock_prices import (
    ASSETS,
    get_current_price,
    get_all_current_prices,
    check_crash_events,
)


# ══════════════════════════════════════════════════
# 1. CREATE PORTFOLIO
# ══════════════════════════════════════════════════

def create_portfolio(db: Session, user_id: Optional[int] = None) -> VirtualPortfolio:
    """
    Create a new virtual portfolio with ₹1,00,000 starting cash.
    
    Args:
        db: SQLAlchemy session
        user_id: Optional — linked user if authenticated, None for guests
    
    Returns:
        VirtualPortfolio ORM object
    """
    session_id = str(uuid.uuid4())

    portfolio = VirtualPortfolio(
        user_id=user_id,
        session_id=session_id,
        cash_balance=100000.0,
        current_day=0,
        investor_profile=None,
    )

    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)

    return portfolio


# ══════════════════════════════════════════════════
# 2. GET PORTFOLIO STATE
# ══════════════════════════════════════════════════

def get_portfolio_state(db: Session, session_id: str) -> Dict:
    """
    Load portfolio + reconstruct current holdings from transaction history.
    
    Returns full portfolio dict with:
    - cash_balance, holdings, total_invested, total_current_value,
      total_pnl, total_pnl_pct, current_day, investor_profile, transactions
    """
    portfolio = db.query(VirtualPortfolio).filter(
        VirtualPortfolio.session_id == session_id
    ).first()

    if not portfolio:
        return None

    # Load all transactions for this portfolio
    transactions = db.query(VirtualTransaction).filter(
        VirtualTransaction.portfolio_id == portfolio.id
    ).order_by(VirtualTransaction.created_at.asc()).all()

    # Reconstruct holdings from transaction history
    holdings_data = {}  # {symbol: {total_shares, total_cost}}

    for txn in transactions:
        symbol = txn.asset_symbol
        if symbol not in holdings_data:
            holdings_data[symbol] = {"total_shares": 0.0, "total_cost": 0.0}

        if txn.transaction_type == "BUY":
            holdings_data[symbol]["total_shares"] += txn.shares
            holdings_data[symbol]["total_cost"] += txn.total_amount
        elif txn.transaction_type == "SELL":
            # Reduce shares and proportionally reduce cost basis
            if holdings_data[symbol]["total_shares"] > 0:
                avg_cost = holdings_data[symbol]["total_cost"] / holdings_data[symbol]["total_shares"]
                holdings_data[symbol]["total_shares"] -= txn.shares
                holdings_data[symbol]["total_cost"] -= avg_cost * txn.shares
                # Clamp to zero to avoid floating point negatives
                holdings_data[symbol]["total_shares"] = max(0.0, holdings_data[symbol]["total_shares"])
                holdings_data[symbol]["total_cost"] = max(0.0, holdings_data[symbol]["total_cost"])

    # Build holdings with current prices
    holdings = {}
    total_invested = 0.0
    total_current_value = 0.0

    for symbol, data in holdings_data.items():
        shares = data["total_shares"]
        if shares < 0.0001:  # effectively zero
            continue

        invested = data["total_cost"]
        avg_buy_price = invested / shares if shares > 0 else 0.0
        current_price = get_current_price(symbol, portfolio.current_day)
        current_value = shares * current_price
        unrealized_pnl = current_value - invested
        unrealized_pnl_pct = (unrealized_pnl / invested * 100) if invested > 0 else 0.0

        holdings[symbol] = {
            "symbol": symbol,
            "full_name": ASSETS[symbol]["full_name"],
            "type": ASSETS[symbol]["type"],
            "risk": ASSETS[symbol]["risk"],
            "shares": round(shares, 6),
            "avg_buy_price": round(avg_buy_price, 2),
            "current_price": round(current_price, 2),
            "invested": round(invested, 2),
            "current_value": round(current_value, 2),
            "unrealized_pnl": round(unrealized_pnl, 2),
            "unrealized_pnl_pct": round(unrealized_pnl_pct, 2),
        }

        total_invested += invested
        total_current_value += current_value

    total_pnl = total_current_value - total_invested
    total_portfolio_value = portfolio.cash_balance + total_current_value
    total_pnl_pct = (total_pnl / total_invested * 100) if total_invested > 0 else 0.0

    # Build transaction history for UI
    txn_history = [
        {
            "id": txn.id,
            "asset_symbol": txn.asset_symbol,
            "asset_name": ASSETS.get(txn.asset_symbol, {}).get("full_name", txn.asset_symbol),
            "transaction_type": txn.transaction_type,
            "shares": round(txn.shares, 6),
            "price_per_share": round(txn.price_per_share, 2),
            "total_amount": round(txn.total_amount, 2),
            "day_number": txn.day_number,
            "realized_pnl": round(txn.realized_pnl, 2),
            "created_at": txn.created_at.isoformat() if txn.created_at else None,
        }
        for txn in transactions
    ]

    return {
        "session_id": portfolio.session_id,
        "cash_balance": round(portfolio.cash_balance, 2),
        "current_day": portfolio.current_day,
        "investor_profile": portfolio.investor_profile,
        "holdings": holdings,
        "total_invested": round(total_invested, 2),
        "total_current_value": round(total_current_value, 2),
        "total_portfolio_value": round(total_portfolio_value, 2),
        "total_pnl": round(total_pnl, 2),
        "total_pnl_pct": round(total_pnl_pct, 2),
        "transactions": txn_history,
    }


# ══════════════════════════════════════════════════
# 3. EXECUTE BUY
# ══════════════════════════════════════════════════

def execute_buy(db: Session, session_id: str, asset_symbol: str, amount_inr: float) -> Dict:
    """
    Buy an asset with virtual cash.
    
    Validates:
    - Asset exists in ASSETS
    - amount_inr >= 100
    - Sufficient cash_balance
    
    Returns:
        {shares_bought, price, remaining_cash, new_holding_value, asset_name}
    """
    # Validate asset
    if asset_symbol not in ASSETS:
        raise ValueError(f"Unknown asset: {asset_symbol}")

    # Validate minimum amount
    if amount_inr < 100:
        raise ValueError("Minimum buy amount is ₹100")

    # Load portfolio
    portfolio = db.query(VirtualPortfolio).filter(
        VirtualPortfolio.session_id == session_id
    ).first()

    if not portfolio:
        raise ValueError("Portfolio not found")

    # Validate cash
    if amount_inr > portfolio.cash_balance:
        raise ValueError(
            f"Insufficient cash. Available: ₹{portfolio.cash_balance:,.2f}, "
            f"Requested: ₹{amount_inr:,.2f}"
        )

    # Get current price
    current_price = get_current_price(asset_symbol, portfolio.current_day)
    shares = amount_inr / current_price

    # Create transaction record
    txn = VirtualTransaction(
        portfolio_id=portfolio.id,
        asset_symbol=asset_symbol,
        transaction_type="BUY",
        shares=shares,
        price_per_share=current_price,
        total_amount=amount_inr,
        day_number=portfolio.current_day,
        realized_pnl=0.0,
    )
    db.add(txn)

    # Update cash balance
    portfolio.cash_balance -= amount_inr
    portfolio.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(portfolio)

    return {
        "success": True,
        "asset_symbol": asset_symbol,
        "asset_name": ASSETS[asset_symbol]["full_name"],
        "shares_bought": round(shares, 6),
        "price": round(current_price, 2),
        "total_cost": round(amount_inr, 2),
        "remaining_cash": round(portfolio.cash_balance, 2),
        "new_holding_value": round(shares * current_price, 2),
    }


# ══════════════════════════════════════════════════
# 4. EXECUTE SELL
# ══════════════════════════════════════════════════

def execute_sell(db: Session, session_id: str, asset_symbol: str, shares_to_sell: float) -> Dict:
    """
    Sell shares of an asset.
    
    Validates:
    - Asset exists
    - User holds enough shares
    
    Calculates realized P&L vs average buy price.
    
    Returns:
        {sale_value, realized_pnl, realized_pnl_pct, remaining_shares, asset_name}
    """
    if asset_symbol not in ASSETS:
        raise ValueError(f"Unknown asset: {asset_symbol}")

    portfolio = db.query(VirtualPortfolio).filter(
        VirtualPortfolio.session_id == session_id
    ).first()

    if not portfolio:
        raise ValueError("Portfolio not found")

    # Reconstruct current holdings for this asset
    transactions = db.query(VirtualTransaction).filter(
        VirtualTransaction.portfolio_id == portfolio.id,
        VirtualTransaction.asset_symbol == asset_symbol,
    ).order_by(VirtualTransaction.created_at.asc()).all()

    total_shares = 0.0
    total_cost = 0.0

    for txn in transactions:
        if txn.transaction_type == "BUY":
            total_shares += txn.shares
            total_cost += txn.total_amount
        elif txn.transaction_type == "SELL":
            if total_shares > 0:
                avg = total_cost / total_shares
                total_shares -= txn.shares
                total_cost -= avg * txn.shares
                total_shares = max(0.0, total_shares)
                total_cost = max(0.0, total_cost)

    # Validate sufficient shares
    if shares_to_sell > total_shares + 0.0001:
        raise ValueError(
            f"Insufficient shares. You hold {total_shares:.6f} shares of {asset_symbol}, "
            f"trying to sell {shares_to_sell:.6f}"
        )

    # Clamp to actual holdings
    shares_to_sell = min(shares_to_sell, total_shares)

    # Calculate P&L
    avg_buy_price = total_cost / total_shares if total_shares > 0 else 0.0
    current_price = get_current_price(asset_symbol, portfolio.current_day)
    sale_value = shares_to_sell * current_price
    cost_basis = shares_to_sell * avg_buy_price
    realized_pnl = sale_value - cost_basis
    realized_pnl_pct = (realized_pnl / cost_basis * 100) if cost_basis > 0 else 0.0

    remaining_shares = total_shares - shares_to_sell

    # Create SELL transaction
    txn = VirtualTransaction(
        portfolio_id=portfolio.id,
        asset_symbol=asset_symbol,
        transaction_type="SELL",
        shares=shares_to_sell,
        price_per_share=current_price,
        total_amount=sale_value,
        day_number=portfolio.current_day,
        realized_pnl=realized_pnl,
    )
    db.add(txn)

    # Credit cash
    portfolio.cash_balance += sale_value
    portfolio.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(portfolio)

    return {
        "success": True,
        "asset_symbol": asset_symbol,
        "asset_name": ASSETS[asset_symbol]["full_name"],
        "shares_sold": round(shares_to_sell, 6),
        "price": round(current_price, 2),
        "sale_value": round(sale_value, 2),
        "realized_pnl": round(realized_pnl, 2),
        "realized_pnl_pct": round(realized_pnl_pct, 2),
        "remaining_shares": round(remaining_shares, 6),
        "remaining_cash": round(portfolio.cash_balance, 2),
    }


# ══════════════════════════════════════════════════
# 5. ADVANCE DAY
# ══════════════════════════════════════════════════

def advance_day(db: Session, session_id: str) -> Dict:
    """
    Advance the simulation by 1 day.
    
    - Increments current_day
    - Recalculates unrealized P&L at new day's prices
    - Checks for crash events
    
    Returns:
        {new_day, new_prices, portfolio_value, pnl_change, crash_event, crash_details}
    """
    portfolio = db.query(VirtualPortfolio).filter(
        VirtualPortfolio.session_id == session_id
    ).first()

    if not portfolio:
        raise ValueError("Portfolio not found")

    # Cap at day 89 (last cached day)
    if portfolio.current_day >= 89:
        raise ValueError("Simulation complete — you've reached the end of the 90-day period!")

    old_day = portfolio.current_day

    # Get portfolio state BEFORE advancing (for P&L comparison)
    old_state = get_portfolio_state(db, session_id)
    old_total_value = old_state["total_portfolio_value"] if old_state else 100000.0

    # Advance day
    portfolio.current_day += 1
    portfolio.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(portfolio)

    new_day = portfolio.current_day

    # Get new prices
    new_prices = get_all_current_prices(new_day)

    # Get new portfolio state
    new_state = get_portfolio_state(db, session_id)
    new_total_value = new_state["total_portfolio_value"] if new_state else 100000.0

    pnl_change = new_total_value - old_total_value
    pnl_change_pct = (pnl_change / old_total_value * 100) if old_total_value > 0 else 0.0

    # Check for crash events on the new day
    crashes = check_crash_events(new_day)
    crash_event = len(crashes) > 0

    # Build price changes for each held asset
    price_changes = {}
    if new_state and new_state.get("holdings"):
        for symbol, holding in new_state["holdings"].items():
            old_price = get_current_price(symbol, old_day)
            new_price = holding["current_price"]
            change = new_price - old_price
            change_pct = (change / old_price * 100) if old_price > 0 else 0.0
            price_changes[symbol] = {
                "old_price": round(old_price, 2),
                "new_price": round(new_price, 2),
                "change": round(change, 2),
                "change_pct": round(change_pct, 2),
            }

    return {
        "new_day": new_day,
        "new_prices": new_prices,
        "portfolio_value": round(new_total_value, 2),
        "pnl_change": round(pnl_change, 2),
        "pnl_change_pct": round(pnl_change_pct, 2),
        "crash_event": crash_event,
        "crash_details": crashes if crash_event else [],
        "price_changes": price_changes,
        "holdings": new_state["holdings"] if new_state else {},
        "cash_balance": round(portfolio.cash_balance, 2),
    }


# ══════════════════════════════════════════════════
# 6. GET CURRENT PRICE (convenience wrapper)
# ══════════════════════════════════════════════════

def get_asset_price(asset_symbol: str, day: int) -> float:
    """Convenience wrapper for get_current_price from mock_prices."""
    return get_current_price(asset_symbol, day)
