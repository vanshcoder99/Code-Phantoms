"""
Gamification Service — Predictive Loot & Smart Spin Engine
==========================================================
Core business logic for XP, streaks, daily spins, and predictions.
"""

import random
import math
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from models import UserGamification, SpinHistory, PredictionChallenge
from data.mock_prices import get_current_price, ASSETS


# ══════════════════════════════════════════════════
# SPIN WHEEL CONFIGURATION
# ══════════════════════════════════════════════════

SPIN_SLOTS = [
    {"type": "xp",         "value": 25,  "label": "+25 XP",           "weight": 25, "color": "#3B82F6"},
    {"type": "xp",         "value": 50,  "label": "+50 XP",           "weight": 20, "color": "#2563EB"},
    {"type": "xp",         "value": 100, "label": "+100 XP",          "weight": 10, "color": "#1D4ED8"},
    {"type": "coins",      "value": 10,  "label": "+10 Coins",        "weight": 20, "color": "#059669"},
    {"type": "coins",      "value": 25,  "label": "+25 Coins",        "weight": 10, "color": "#047857"},
    {"type": "multiplier", "value": 2,   "label": "2× XP Multiplier", "weight": 8,  "color": "#7C3AED"},
    {"type": "tip",        "value": 0,   "label": "💡 Investing Tip", "weight": 5,  "color": "#D97706"},
    {"type": "jackpot",    "value": 500, "label": "🎰 JACKPOT!",      "weight": 2,  "color": "#DC2626"},
]

INVESTING_TIPS = [
    "SIP in index funds beats 90% of active fund managers over 10 years.",
    "Never invest money you'll need within 3 years in equities.",
    "Diversification is the only free lunch in investing — spread across asset classes.",
    "The best time to invest was yesterday. The second best is today.",
    "A 10% annual return doubles your money in ~7 years (Rule of 72).",
    "Emergency fund (6 months expenses) BEFORE investing — always.",
    "Compounding works best when you don't interrupt it. Stay invested.",
    "Don't check your portfolio daily — it causes panic selling.",
    "Gold is a hedge, not a growth asset. Keep it under 10% of portfolio.",
    "Mutual funds with expense ratio > 1% are eating your returns.",
    "Start with ₹500/month SIP — consistency beats amount.",
    "Bear markets are where future returns are born. Don't panic.",
]

# XP required for each level: Level N requires N^2 * 100 total XP
def calculate_level(xp: int) -> int:
    """Level = floor(sqrt(xp / 100)) + 1. Level 1 at 0 XP, Level 2 at 100 XP, etc."""
    if xp <= 0:
        return 1
    return int(math.floor(math.sqrt(xp / 100))) + 1


def xp_for_level(level: int) -> int:
    """Total XP needed to reach a given level."""
    return ((level - 1) ** 2) * 100


def xp_progress(xp: int) -> dict:
    """Returns current level, XP progress within that level, and XP needed for next."""
    level = calculate_level(xp)
    current_floor = xp_for_level(level)
    next_floor = xp_for_level(level + 1)
    return {
        "level": level,
        "current_xp": xp,
        "xp_in_level": xp - current_floor,
        "xp_needed": next_floor - current_floor,
        "progress_pct": round((xp - current_floor) / max(next_floor - current_floor, 1) * 100, 1),
    }


# ══════════════════════════════════════════════════
# PROFILE MANAGEMENT
# ══════════════════════════════════════════════════

def get_or_create_profile(db: Session, user_id: int) -> UserGamification:
    """Get existing gamification profile or create a new one."""
    profile = db.query(UserGamification).filter(
        UserGamification.user_id == user_id
    ).first()

    if not profile:
        profile = UserGamification(user_id=user_id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return profile


def get_profile_data(db: Session, user_id: int) -> dict:
    """Get full gamification profile as a dict."""
    profile = get_or_create_profile(db, user_id)
    progress = xp_progress(profile.xp)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    return {
        "user_id": profile.user_id,
        "xp": profile.xp,
        "level": progress["level"],
        "xp_in_level": progress["xp_in_level"],
        "xp_needed": progress["xp_needed"],
        "progress_pct": progress["progress_pct"],
        "streak_days": profile.streak_days,
        "longest_streak": profile.longest_streak,
        "virtual_coins": profile.virtual_coins,
        "active_multiplier": profile.active_multiplier,
        "total_spins": profile.total_spins,
        "total_predictions": profile.total_predictions,
        "correct_predictions": profile.correct_predictions,
        "prediction_accuracy": round(
            profile.correct_predictions / max(profile.total_predictions, 1) * 100, 1
        ),
        "can_spin_today": profile.last_spin_date != today,
        "has_logged_today": profile.last_login_date == today,
    }


# ══════════════════════════════════════════════════
# DAILY LOGIN & STREAK
# ══════════════════════════════════════════════════

def check_daily_login(db: Session, user_id: int) -> dict:
    """
    Record daily login. Update streak and award daily XP.
    Returns streak info and XP earned.
    """
    profile = get_or_create_profile(db, user_id)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    if profile.last_login_date == today:
        # Already logged in today
        return {
            "already_claimed": True,
            "streak_days": profile.streak_days,
            "longest_streak": profile.longest_streak,
            "xp_earned": 0,
            "total_xp": profile.xp,
            "message": "You've already claimed today's login reward!",
        }

    # Check if streak continues (login was yesterday)
    from datetime import timedelta
    yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")

    if profile.last_login_date == yesterday:
        profile.streak_days += 1
    else:
        profile.streak_days = 1  # Reset streak

    # Update longest streak
    if profile.streak_days > profile.longest_streak:
        profile.longest_streak = profile.streak_days

    # Award XP: base 10 + 5 per streak day, capped at 100
    daily_xp = min(10 + 5 * profile.streak_days, 100)
    daily_xp = int(daily_xp * profile.active_multiplier)
    profile.xp += daily_xp
    profile.level = calculate_level(profile.xp)
    profile.last_login_date = today

    # Bonus coins at streak milestones
    bonus_coins = 0
    if profile.streak_days in (3, 7, 14, 30):
        bonus_coins = profile.streak_days * 5
        profile.virtual_coins += bonus_coins

    db.commit()
    db.refresh(profile)

    milestone = profile.streak_days in (3, 7, 14, 30)

    return {
        "already_claimed": False,
        "streak_days": profile.streak_days,
        "longest_streak": profile.longest_streak,
        "xp_earned": daily_xp,
        "bonus_coins": bonus_coins,
        "total_xp": profile.xp,
        "level": calculate_level(profile.xp),
        "is_milestone": milestone,
        "message": f"🔥 Day {profile.streak_days} streak! +{daily_xp} XP"
                   + (f" + {bonus_coins} bonus coins!" if bonus_coins else ""),
    }


# ══════════════════════════════════════════════════
# SMART SPIN
# ══════════════════════════════════════════════════

def execute_spin(db: Session, user_id: int) -> dict:
    """
    Execute the daily spin wheel.
    Returns the reward and animation data (which slot index won).
    """
    profile = get_or_create_profile(db, user_id)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    if profile.last_spin_date == today:
        return {
            "already_spun": True,
            "message": "You've already spun today! Come back tomorrow. ⏳",
            "can_spin": False,
        }

    # Weighted random selection
    weights = [slot["weight"] for slot in SPIN_SLOTS]
    winning_index = random.choices(range(len(SPIN_SLOTS)), weights=weights, k=1)[0]
    reward = SPIN_SLOTS[winning_index]

    # Apply reward
    xp_gained = 0
    coins_gained = 0
    tip_text = None

    if reward["type"] == "xp":
        xp_gained = int(reward["value"] * profile.active_multiplier)
        profile.xp += xp_gained
    elif reward["type"] == "coins":
        coins_gained = reward["value"]
        profile.virtual_coins += coins_gained
    elif reward["type"] == "multiplier":
        profile.active_multiplier = reward["value"]
    elif reward["type"] == "tip":
        tip_text = random.choice(INVESTING_TIPS)
        xp_gained = 15  # small XP for getting a tip
        profile.xp += xp_gained
    elif reward["type"] == "jackpot":
        xp_gained = 500
        coins_gained = 100
        profile.xp += xp_gained
        profile.virtual_coins += coins_gained

    profile.level = calculate_level(profile.xp)
    profile.last_spin_date = today
    profile.total_spins += 1

    # Reset multiplier if it was used (consumed on next XP event)
    if reward["type"] != "multiplier" and profile.active_multiplier > 1.0:
        profile.active_multiplier = 1.0

    # Log spin
    spin_log = SpinHistory(
        user_id=user_id,
        gamification_id=profile.id,
        reward_type=reward["type"],
        reward_value=reward["value"],
        reward_label=reward["label"],
        spin_date=today,
    )
    db.add(spin_log)
    db.commit()
    db.refresh(profile)

    return {
        "already_spun": False,
        "can_spin": False,
        "winning_index": winning_index,
        "reward": {
            "type": reward["type"],
            "value": reward["value"],
            "label": reward["label"],
            "color": reward["color"],
            "xp_gained": xp_gained,
            "coins_gained": coins_gained,
            "tip_text": tip_text,
        },
        "slots": SPIN_SLOTS,
        "profile": {
            "xp": profile.xp,
            "level": profile.level,
            "virtual_coins": profile.virtual_coins,
            "active_multiplier": profile.active_multiplier,
        },
        "message": f"🎉 You won: {reward['label']}!",
    }


# ══════════════════════════════════════════════════
# PREDICTIVE LOOT — Market Predictions
# ══════════════════════════════════════════════════

def make_prediction(db: Session, user_id: int, asset_symbol: str, direction: str) -> dict:
    """
    Record a market prediction for an asset.
    direction: "UP" or "DOWN"
    User can have max 3 pending predictions.
    """
    profile = get_or_create_profile(db, user_id)

    if asset_symbol not in ASSETS:
        raise ValueError(f"Unknown asset: {asset_symbol}")

    if direction not in ("UP", "DOWN"):
        raise ValueError("Direction must be 'UP' or 'DOWN'")

    # Check pending prediction limit
    pending = db.query(PredictionChallenge).filter(
        PredictionChallenge.user_id == user_id,
        PredictionChallenge.resolved == 0,
    ).count()

    if pending >= 3:
        raise ValueError("Maximum 3 pending predictions allowed. Wait for current ones to resolve.")

    # Check no duplicate prediction for the same asset today
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    existing = db.query(PredictionChallenge).filter(
        PredictionChallenge.user_id == user_id,
        PredictionChallenge.asset_symbol == asset_symbol,
        PredictionChallenge.prediction_date == today,
    ).first()

    if existing:
        raise ValueError(f"You already predicted {asset_symbol} today.")

    # Get current price (day 0 as baseline for new predictions)
    # Use a random day between 10-70 to create variation
    price_day = random.randint(10, 70)
    current_price = get_current_price(asset_symbol, price_day)

    prediction = PredictionChallenge(
        user_id=user_id,
        gamification_id=profile.id,
        asset_symbol=asset_symbol,
        prediction=direction,
        predicted_price=current_price,
        prediction_date=today,
    )
    db.add(prediction)
    profile.total_predictions += 1
    db.commit()
    db.refresh(prediction)

    asset_info = ASSETS[asset_symbol]

    return {
        "prediction_id": prediction.id,
        "asset_symbol": asset_symbol,
        "asset_name": asset_info["full_name"],
        "direction": direction,
        "predicted_price": round(current_price, 2),
        "status": "pending",
        "message": f"📊 Prediction locked! You think {asset_info['full_name']} will go {'📈 UP' if direction == 'UP' else '📉 DOWN'}",
    }


def resolve_predictions(db: Session, user_id: int) -> dict:
    """
    Resolve all pending predictions by comparing with a future price.
    Awards XP and coins for correct predictions.
    """
    profile = get_or_create_profile(db, user_id)

    pending = db.query(PredictionChallenge).filter(
        PredictionChallenge.user_id == user_id,
        PredictionChallenge.resolved == 0,
    ).all()

    if not pending:
        return {"resolved": [], "message": "No pending predictions to resolve."}

    results = []
    total_xp = 0
    total_coins = 0

    for pred in pending:
        # Get a price from a few days ahead to simulate "next day"
        price_day = random.randint(15, 85)
        result_price = get_current_price(pred.asset_symbol, price_day)

        price_went_up = result_price > pred.predicted_price
        is_correct = (pred.prediction == "UP" and price_went_up) or \
                     (pred.prediction == "DOWN" and not price_went_up)

        xp_reward = int(30 * profile.active_multiplier) if is_correct else 5
        coin_reward = 15 if is_correct else 0

        pred.result_price = result_price
        pred.is_correct = 1 if is_correct else 0
        pred.xp_earned = xp_reward
        pred.coins_earned = coin_reward
        pred.resolved = 1

        profile.xp += xp_reward
        profile.virtual_coins += coin_reward
        total_xp += xp_reward
        total_coins += coin_reward

        if is_correct:
            profile.correct_predictions += 1

        asset_info = ASSETS.get(pred.asset_symbol, {})
        results.append({
            "prediction_id": pred.id,
            "asset_symbol": pred.asset_symbol,
            "asset_name": asset_info.get("full_name", pred.asset_symbol),
            "prediction": pred.prediction,
            "predicted_price": round(pred.predicted_price, 2),
            "result_price": round(result_price, 2),
            "is_correct": is_correct,
            "xp_earned": xp_reward,
            "coins_earned": coin_reward,
        })

    profile.level = calculate_level(profile.xp)

    # Reset multiplier after use
    if profile.active_multiplier > 1.0:
        profile.active_multiplier = 1.0

    db.commit()
    db.refresh(profile)

    return {
        "resolved": results,
        "total_xp_earned": total_xp,
        "total_coins_earned": total_coins,
        "new_xp": profile.xp,
        "new_level": profile.level,
        "new_coins": profile.virtual_coins,
        "message": f"🎯 {sum(1 for r in results if r['is_correct'])}/{len(results)} correct! +{total_xp} XP",
    }


def get_predictions(db: Session, user_id: int) -> dict:
    """Get user's recent predictions (pending + last 10 resolved)."""
    pending = db.query(PredictionChallenge).filter(
        PredictionChallenge.user_id == user_id,
        PredictionChallenge.resolved == 0,
    ).order_by(PredictionChallenge.created_at.desc()).all()

    resolved = db.query(PredictionChallenge).filter(
        PredictionChallenge.user_id == user_id,
        PredictionChallenge.resolved == 1,
    ).order_by(PredictionChallenge.created_at.desc()).limit(10).all()

    def pred_to_dict(p):
        asset_info = ASSETS.get(p.asset_symbol, {})
        return {
            "id": p.id,
            "asset_symbol": p.asset_symbol,
            "asset_name": asset_info.get("full_name", p.asset_symbol),
            "prediction": p.prediction,
            "predicted_price": round(p.predicted_price, 2),
            "result_price": round(p.result_price, 2) if p.result_price else None,
            "is_correct": bool(p.is_correct) if p.is_correct is not None else None,
            "xp_earned": p.xp_earned,
            "coins_earned": p.coins_earned,
            "prediction_date": p.prediction_date,
            "resolved": bool(p.resolved),
        }

    return {
        "pending": [pred_to_dict(p) for p in pending],
        "resolved": [pred_to_dict(p) for p in resolved],
        "pending_count": len(pending),
    }


def get_spin_history(db: Session, user_id: int) -> list:
    """Get last 10 spin results for a user."""
    spins = db.query(SpinHistory).filter(
        SpinHistory.user_id == user_id,
    ).order_by(SpinHistory.created_at.desc()).limit(10).all()

    return [
        {
            "reward_type": s.reward_type,
            "reward_value": s.reward_value,
            "reward_label": s.reward_label,
            "spin_date": s.spin_date,
        }
        for s in spins
    ]


def get_leaderboard(db: Session, limit: int = 10) -> list:
    """Get top users by XP."""
    from models import User

    profiles = db.query(UserGamification).order_by(
        UserGamification.xp.desc()
    ).limit(limit).all()

    leaderboard = []
    for i, profile in enumerate(profiles):
        user = db.query(User).filter(User.id == profile.user_id).first()
        name = user.name if user else "Unknown"
        leaderboard.append({
            "rank": i + 1,
            "name": name,
            "xp": profile.xp,
            "level": calculate_level(profile.xp),
            "streak_days": profile.streak_days,
            "predictions_accuracy": round(
                profile.correct_predictions / max(profile.total_predictions, 1) * 100, 1
            ),
        })

    return leaderboard


def get_available_assets_for_prediction(db: Session, user_id: int) -> list:
    """Get list of assets available for prediction (excluding already predicted today)."""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    today_predictions = db.query(PredictionChallenge.asset_symbol).filter(
        PredictionChallenge.user_id == user_id,
        PredictionChallenge.prediction_date == today,
    ).all()
    predicted_symbols = {p[0] for p in today_predictions}

    # Use a consistent day for showing current prices
    price_day = random.randint(20, 60)

    available = []
    for symbol, info in ASSETS.items():
        current_price = get_current_price(symbol, price_day)
        prev_price = get_current_price(symbol, max(price_day - 1, 0))
        change_pct = ((current_price - prev_price) / prev_price * 100) if prev_price else 0

        available.append({
            "symbol": symbol,
            "full_name": info["full_name"],
            "type": info["type"],
            "risk": info["risk"],
            "current_price": round(current_price, 2),
            "change_pct": round(change_pct, 2),
            "already_predicted": symbol in predicted_symbols,
        })

    return available
