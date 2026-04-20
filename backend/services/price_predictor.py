"""
Price Predictor — InvestSafe Arena
====================================
Technical analysis engine: MA, RSI, Momentum, Volatility.
Generates BUY/HOLD/SELL signals and 7-day/30-day price predictions.
"""

import math
from typing import Dict, List
from data.mock_prices import ASSETS, get_cached_history, get_current_price


def _compute_sma(prices: List[float], period: int) -> float:
    """Simple Moving Average over the last `period` values."""
    if len(prices) < period:
        return sum(prices) / len(prices) if prices else 0.0
    return sum(prices[-period:]) / period


def _compute_rsi(prices: List[float], period: int = 14) -> float:
    """
    Relative Strength Index (14-period).
    RSI > 70 = overbought (SELL signal)
    RSI < 30 = oversold (BUY signal)
    """
    if len(prices) < period + 1:
        return 50.0  # neutral default

    gains = []
    losses = []
    for i in range(-period, 0):
        change = prices[i] - prices[i - 1]
        if change > 0:
            gains.append(change)
            losses.append(0.0)
        else:
            gains.append(0.0)
            losses.append(abs(change))

    avg_gain = sum(gains) / period
    avg_loss = sum(losses) / period

    if avg_loss == 0:
        return 100.0

    rs = avg_gain / avg_loss
    rsi = 100.0 - (100.0 / (1.0 + rs))
    return round(rsi, 2)


def _compute_momentum(prices: List[float], lookback: int = 7) -> float:
    """Momentum: (close[today] - close[today-lookback]) / close[today-lookback] * 100"""
    if len(prices) < lookback + 1:
        return 0.0
    old_price = prices[-(lookback + 1)]
    current_price = prices[-1]
    if old_price == 0:
        return 0.0
    return round((current_price - old_price) / old_price * 100, 4)


def _compute_volatility(prices: List[float], period: int = 14) -> float:
    """Rolling 14-day standard deviation of daily returns."""
    if len(prices) < period + 1:
        return 0.0

    returns = []
    for i in range(-period, 0):
        prev = prices[i - 1]
        curr = prices[i]
        if prev != 0:
            returns.append((curr - prev) / prev)

    if not returns:
        return 0.0

    mean_ret = sum(returns) / len(returns)
    variance = sum((r - mean_ret) ** 2 for r in returns) / len(returns)
    return round(math.sqrt(variance), 6)


def predict_asset(asset_symbol: str, current_day: int) -> Dict:
    """
    Full technical analysis and prediction for an asset.

    Returns:
        {asset, current_price, predicted_7d, predicted_30d,
         expected_change_7d, expected_change_30d, confidence,
         signal, signal_reason, technical_indicators}
    """
    if asset_symbol not in ASSETS:
        raise ValueError(f"Unknown asset: {asset_symbol}")

    asset_info = ASSETS[asset_symbol]
    history = get_cached_history(asset_symbol)

    # Get close prices up to current_day
    end_day = min(current_day, len(history) - 1)
    end_day = max(end_day, 0)
    close_prices = [h["close"] for h in history[: end_day + 1]]

    if not close_prices:
        close_prices = [asset_info["base_price"]]

    current_price = close_prices[-1]

    # ── Technical Indicators ──
    ma_7 = _compute_sma(close_prices, 7)
    ma_14 = _compute_sma(close_prices, 14)
    ma_30 = _compute_sma(close_prices, 30)
    rsi = _compute_rsi(close_prices, 14)
    momentum_7d = _compute_momentum(close_prices, 7)
    volatility_14d = _compute_volatility(close_prices, 14)

    # ── Signal Logic ──
    buy_signals = 0
    sell_signals = 0
    reasons = []

    # MA crossover
    if ma_7 > ma_14:
        buy_signals += 1
        reasons.append("Short-term trend is bullish (MA7 > MA14)")
    elif ma_7 < ma_14:
        sell_signals += 1
        reasons.append("Short-term trend is bearish (MA7 < MA14)")

    # Momentum
    if momentum_7d > 0:
        buy_signals += 1
        reasons.append(f"Positive momentum ({momentum_7d:+.2f}%)")
    elif momentum_7d < 0:
        sell_signals += 1
        reasons.append(f"Negative momentum ({momentum_7d:+.2f}%)")

    # RSI
    if rsi < 65:
        buy_signals += 1
        if rsi < 30:
            reasons.append(f"RSI oversold at {rsi:.0f} — potential bounce")
        else:
            reasons.append(f"RSI healthy at {rsi:.0f}")
    elif rsi > 55:
        sell_signals += 1
        if rsi > 70:
            reasons.append(f"RSI overbought at {rsi:.0f} — potential pullback")
        else:
            reasons.append(f"RSI elevated at {rsi:.0f}")

    # Determine signal
    if buy_signals >= 2 and ma_7 > ma_14 and momentum_7d > 0 and rsi < 65:
        signal = "BUY"
    elif sell_signals >= 2 and ma_7 < ma_14 and momentum_7d < 0 and rsi > 55:
        signal = "SELL"
    else:
        signal = "HOLD"

    # Confidence
    total_signals = buy_signals + sell_signals
    if total_signals >= 3 and (buy_signals == 3 or sell_signals == 3):
        confidence = "HIGH"
    elif max(buy_signals, sell_signals) >= 2:
        confidence = "MEDIUM"
    else:
        confidence = "LOW"

    signal_reason = ". ".join(reasons[:3]) if reasons else "Mixed signals — hold and watch."

    # ── Price Predictions ──
    trend = asset_info["trend"]
    momentum_factor = momentum_7d / 100.0  # convert percentage to decimal

    # Mean reversion: if price is far from MA30, it tends to come back
    mean_reversion = 0.0
    if ma_30 > 0 and current_price > 0:
        deviation = (current_price - ma_30) / ma_30
        mean_reversion = -deviation * 0.3  # pull toward mean

    predicted_7d = current_price * (1.0 + momentum_factor * 0.4 + trend * 7)
    predicted_30d = current_price * (1.0 + trend * 30 + mean_reversion)

    # Ensure predictions don't go negative
    predicted_7d = max(predicted_7d, current_price * 0.5)
    predicted_30d = max(predicted_30d, current_price * 0.3)

    change_7d = (predicted_7d - current_price) / current_price * 100
    change_30d = (predicted_30d - current_price) / current_price * 100

    return {
        "asset": asset_symbol,
        "asset_name": asset_info["full_name"],
        "current_price": round(current_price, 2),
        "predicted_7d": round(predicted_7d, 2),
        "predicted_30d": round(predicted_30d, 2),
        "expected_change_7d": f"{change_7d:+.2f}%",
        "expected_change_30d": f"{change_30d:+.2f}%",
        "confidence": confidence,
        "signal": signal,
        "signal_reason": signal_reason,
        "technical_indicators": {
            "rsi": round(rsi, 2),
            "momentum_7d": round(momentum_7d, 2),
            "volatility_14d": round(volatility_14d, 6),
            "ma_7": round(ma_7, 2),
            "ma_14": round(ma_14, 2),
            "ma_30": round(ma_30, 2),
        },
    }
