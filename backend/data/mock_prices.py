"""
Mock Price Data Engine — InvestSafe Arena
==========================================
Generates realistic 90-day historical prices for 10 Indian assets.
Uses the same Gaussian + crash logic as simulation_engine.py.
Prices are generated ONCE at module load and cached in memory.
"""

import random
import math
from typing import Dict, List

# Seed for reproducibility within a server session
random.seed(42)

# ══════════════════════════════════════════════════
# ASSET DEFINITIONS — 10 assets with realistic INR prices (2024)
# ══════════════════════════════════════════════════

ASSETS = {
    "RELIANCE": {
        "base_price": 2450,
        "volatility": 0.018,
        "trend": 0.003,
        "crash_prob": 0.04,
        "risk": "MEDIUM",
        "type": "STOCK",
        "full_name": "Reliance Industries",
    },
    "TCS": {
        "base_price": 3890,
        "volatility": 0.015,
        "trend": 0.003,
        "crash_prob": 0.03,
        "risk": "MEDIUM",
        "type": "STOCK",
        "full_name": "Tata Consultancy Services",
    },
    "INFOSYS": {
        "base_price": 1456,
        "volatility": 0.017,
        "trend": 0.003,
        "crash_prob": 0.03,
        "risk": "MEDIUM",
        "type": "STOCK",
        "full_name": "Infosys Ltd",
    },
    "HDFC_BANK": {
        "base_price": 1678,
        "volatility": 0.014,
        "trend": 0.002,
        "crash_prob": 0.03,
        "risk": "LOW",
        "type": "STOCK",
        "full_name": "HDFC Bank",
    },
    "NIFTY_50_INDEX": {
        "base_price": 195,
        "volatility": 0.010,
        "trend": 0.002,
        "crash_prob": 0.02,
        "risk": "LOW",
        "type": "MUTUAL_FUND",
        "full_name": "Nifty 50 Index Fund",
    },
    "MIDCAP_150": {
        "base_price": 142,
        "volatility": 0.016,
        "trend": 0.003,
        "crash_prob": 0.04,
        "risk": "MEDIUM",
        "type": "MUTUAL_FUND",
        "full_name": "Midcap 150 Index Fund",
    },
    "SMALLCAP_250": {
        "base_price": 89,
        "volatility": 0.022,
        "trend": 0.004,
        "crash_prob": 0.06,
        "risk": "HIGH",
        "type": "MUTUAL_FUND",
        "full_name": "Smallcap 250 Fund",
    },
    "GOLD_ETF": {
        "base_price": 5840,
        "volatility": 0.008,
        "trend": 0.001,
        "crash_prob": 0.01,
        "risk": "LOW",
        "type": "GOLD",
        "full_name": "Gold ETF",
    },
    "BITCOIN_INR": {
        "base_price": 5500000,
        "volatility": 0.055,
        "trend": 0.005,
        "crash_prob": 0.15,
        "risk": "HIGH",
        "type": "CRYPTO",
        "full_name": "Bitcoin",
    },
    "ETHEREUM_INR": {
        "base_price": 290000,
        "volatility": 0.060,
        "trend": 0.005,
        "crash_prob": 0.18,
        "risk": "HIGH",
        "type": "CRYPTO",
        "full_name": "Ethereum",
    },
}


# ══════════════════════════════════════════════════
# VOLUME RANGES by asset type (realistic daily volumes)
# ══════════════════════════════════════════════════

VOLUME_RANGES = {
    "STOCK": (5_000_000, 15_000_000),
    "MUTUAL_FUND": (500_000, 3_000_000),
    "GOLD": (1_000_000, 5_000_000),
    "CRYPTO": (20_000_000, 80_000_000),
}


def _generate_daily_movement(price, volatility, trend, crash_prob):
    """
    Generate a single day's price movement using the SAME Gaussian + crash logic
    as simulation_engine.py (lines 42-48), adapted for daily granularity.
    
    Returns (new_price, is_crash, is_rally)
    """
    is_crash = False
    is_rally = False

    if random.random() < crash_prob:
        # Crash event — same pattern as simulation_engine.py line 44
        drop = random.uniform(0.05, 0.15)
        new_price = price * (1 - drop)
        is_crash = True
    elif random.random() < crash_prob * 0.8:
        # Rally event (slightly less probable than crashes)
        surge = random.uniform(0.04, 0.12)
        new_price = price * (1 + surge)
        is_rally = True
    else:
        # Normal Gaussian movement — same pattern as simulation_engine.py line 47
        movement = random.gauss(trend, volatility)
        new_price = price * (1 + movement)

    # Ensure price never goes below 1% of base (safety floor)
    new_price = max(new_price, price * 0.01)

    return new_price, is_crash, is_rally


def generate_historical_prices(asset_symbol: str, n_days: int = 90) -> List[Dict]:
    """
    Generate n_days of OHLCV historical price data for a given asset.
    
    Uses the same Gaussian + crash logic as simulation_engine.py.
    Ensures at least 2 crash events and 2 rally events in the window.
    
    Returns:
        List of {day, open, high, low, close, volume} dicts
    """
    if asset_symbol not in ASSETS:
        raise ValueError(f"Unknown asset: {asset_symbol}")

    asset = ASSETS[asset_symbol]
    base_price = asset["base_price"]
    volatility = asset["volatility"]
    trend = asset["trend"]
    crash_prob = asset["crash_prob"]
    asset_type = asset["type"]
    vol_min, vol_max = VOLUME_RANGES[asset_type]

    history = []
    price = base_price
    crash_count = 0
    rally_count = 0

    # Pre-determine forced crash/rally days to guarantee at least 2 each
    forced_crash_days = set(random.sample(range(15, n_days - 5), 2))
    forced_rally_days = set(random.sample(
        [d for d in range(10, n_days - 5) if d not in forced_crash_days], 2
    ))

    for day in range(n_days):
        open_price = price

        # Check if this is a forced event day
        if day in forced_crash_days and crash_count < 2:
            drop = random.uniform(0.05, 0.12)
            close_price = price * (1 - drop)
            is_crash, is_rally = True, False
            crash_count += 1
        elif day in forced_rally_days and rally_count < 2:
            surge = random.uniform(0.04, 0.10)
            close_price = price * (1 + surge)
            is_crash, is_rally = False, True
            rally_count += 1
        else:
            close_price, is_crash, is_rally = _generate_daily_movement(
                price, volatility, trend, crash_prob
            )
            if is_crash:
                crash_count += 1
            if is_rally:
                rally_count += 1

        # Generate realistic intraday high/low
        intraday_spread = abs(close_price - open_price) + price * volatility * 0.5
        high_price = max(open_price, close_price) + random.uniform(0, intraday_spread * 0.6)
        low_price = min(open_price, close_price) - random.uniform(0, intraday_spread * 0.6)
        low_price = max(low_price, price * 0.005)  # floor

        # Volume — higher on crash/rally days
        volume_multiplier = 2.5 if (is_crash or is_rally) else random.uniform(0.7, 1.3)
        volume = int(random.randint(vol_min, vol_max) * volume_multiplier)

        history.append({
            "day": day,
            "open": round(open_price, 2),
            "high": round(high_price, 2),
            "low": round(low_price, 2),
            "close": round(close_price, 2),
            "volume": volume,
        })

        price = close_price

    return history


# ══════════════════════════════════════════════════
# MODULE-LEVEL CACHE — generated once, reused everywhere
# ══════════════════════════════════════════════════

_price_cache: Dict[str, List[Dict]] = {}


def _init_price_cache():
    """Generate and cache 90-day history for all assets at module load."""
    global _price_cache
    for symbol in ASSETS:
        _price_cache[symbol] = generate_historical_prices(symbol, n_days=90)
    print(f"[Arena] Price cache initialized: {len(_price_cache)} assets × 90 days")


def get_cached_history(asset_symbol: str) -> List[Dict]:
    """Get cached historical prices for an asset."""
    if asset_symbol not in _price_cache:
        raise ValueError(f"Unknown asset: {asset_symbol}")
    return _price_cache[asset_symbol]


def get_current_price(asset_symbol: str, day: int) -> float:
    """
    Get the close price for a given asset on a given simulated day.
    Day 0 = first day, Day 89 = last cached day.
    If day exceeds cache, returns last available price.
    """
    history = get_cached_history(asset_symbol)
    clamped_day = min(day, len(history) - 1)
    clamped_day = max(clamped_day, 0)
    return history[clamped_day]["close"]


def get_all_current_prices(day: int) -> Dict[str, Dict]:
    """
    Get current prices for ALL assets on a given day.
    Returns dict of {symbol: {price, change_24h, change_24h_pct, ...asset_info}}.
    """
    result = {}
    for symbol, asset_info in ASSETS.items():
        history = get_cached_history(symbol)
        clamped_day = min(day, len(history) - 1)
        clamped_day = max(clamped_day, 0)

        current_price = history[clamped_day]["close"]
        prev_price = history[max(clamped_day - 1, 0)]["close"]
        change_24h = current_price - prev_price
        change_24h_pct = (change_24h / prev_price * 100) if prev_price != 0 else 0.0

        result[symbol] = {
            "symbol": symbol,
            "full_name": asset_info["full_name"],
            "current_price": round(current_price, 2),
            "risk": asset_info["risk"],
            "type": asset_info["type"],
            "change_24h": round(change_24h, 2),
            "change_24h_pct": round(change_24h_pct, 2),
        }
    return result


def check_crash_events(day: int) -> List[Dict]:
    """
    Check which assets had crash events on a given day.
    A crash is defined as a daily drop > 4%.
    Returns list of {symbol, full_name, drop_pct, current_price}.
    """
    crashes = []
    for symbol in ASSETS:
        history = get_cached_history(symbol)
        clamped_day = min(day, len(history) - 1)
        if clamped_day < 1:
            continue
        prev_close = history[clamped_day - 1]["close"]
        curr_close = history[clamped_day]["close"]
        pct_change = (curr_close - prev_close) / prev_close * 100

        if pct_change < -4.0:
            crashes.append({
                "symbol": symbol,
                "full_name": ASSETS[symbol]["full_name"],
                "drop_pct": round(abs(pct_change), 2),
                "current_price": round(curr_close, 2),
                "prev_price": round(prev_close, 2),
            })

    return crashes


# Initialize cache when module is imported
_init_price_cache()
