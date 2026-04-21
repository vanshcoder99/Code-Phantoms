"""
Database Models
All tables for the Investing Fear SaaS application
"""
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    risk_tolerance = Column(String(50), default="medium")
    investment_goal = Column(String(500), default="Long-term wealth building")
    experience = Column(String(50), default="Beginner")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    simulations = relationship("Simulation", back_populates="user", cascade="all, delete-orphan")
    portfolios = relationship("Portfolio", back_populates="user", cascade="all, delete-orphan")
    chats = relationship("AIChat", back_populates="user", cascade="all, delete-orphan")


class Simulation(Base):
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    initial_amount = Column(Float, nullable=False)
    time_period = Column(Integer, nullable=False)
    risk_level = Column(String(50), nullable=False)
    best_case = Column(Float)
    worst_case = Column(Float)
    average_case = Column(Float)
    graph_data = Column(JSON)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="simulations")


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    portfolio_text = Column(Text, nullable=False)
    explanation = Column(Text)
    risk_score = Column(Float)
    suggestions = Column(Text)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="portfolios")


class AIChat(Base):
    __tablename__ = "ai_chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    role = Column(String(50), nullable=False)  # 'user' or 'assistant'
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="chats")


# ══════════════════════════════════════════════════════════════
# InvestSafe Arena — Virtual Portfolio Simulator Models
# ══════════════════════════════════════════════════════════════

class VirtualPortfolio(Base):
    __tablename__ = "virtual_portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # nullable for guest sessions
    session_id = Column(String, unique=True, index=True)  # UUID for guest access
    cash_balance = Column(Float, default=100000.0)
    current_day = Column(Integer, default=0)  # simulated day counter for advance-day
    investor_profile = Column(String, nullable=True)  # from ML model: Conservative/Moderate/Growth/Aggressive
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    transactions = relationship("VirtualTransaction", back_populates="portfolio", cascade="all, delete-orphan")


class VirtualTransaction(Base):
    __tablename__ = "virtual_transactions"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("virtual_portfolios.id"), nullable=False)
    asset_symbol = Column(String, nullable=False)
    transaction_type = Column(String, nullable=False)  # BUY or SELL
    shares = Column(Float, nullable=False)
    price_per_share = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    day_number = Column(Integer, nullable=False)  # which simulated day this happened
    realized_pnl = Column(Float, default=0.0)  # only for SELL transactions
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    portfolio = relationship("VirtualPortfolio", back_populates="transactions")


# ══════════════════════════════════════════════════════════════
# Gamification — Predictive Loot & Smart Spin Engine
# ══════════════════════════════════════════════════════════════

class UserGamification(Base):
    """Per-user gamification profile: XP, level, streaks, coins."""
    __tablename__ = "user_gamification"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    streak_days = Column(Integer, default=0)
    longest_streak = Column(Integer, default=0)
    last_login_date = Column(String(10), nullable=True)   # "YYYY-MM-DD"
    last_spin_date = Column(String(10), nullable=True)     # "YYYY-MM-DD"
    total_spins = Column(Integer, default=0)
    total_predictions = Column(Integer, default=0)
    correct_predictions = Column(Integer, default=0)
    virtual_coins = Column(Integer, default=100)
    active_multiplier = Column(Float, default=1.0)         # from spin reward
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User")
    spins = relationship("SpinHistory", back_populates="gamification", cascade="all, delete-orphan")
    predictions = relationship("PredictionChallenge", back_populates="gamification", cascade="all, delete-orphan")


class SpinHistory(Base):
    """Log of each daily spin result."""
    __tablename__ = "spin_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    gamification_id = Column(Integer, ForeignKey("user_gamification.id"), nullable=False)
    reward_type = Column(String(30), nullable=False)    # "xp", "coins", "multiplier", "tip", "jackpot"
    reward_value = Column(Integer, default=0)
    reward_label = Column(String(100), nullable=False)  # "+50 XP", "🎰 JACKPOT!"
    spin_date = Column(String(10), nullable=False)      # "YYYY-MM-DD"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    gamification = relationship("UserGamification", back_populates="spins")


class PredictionChallenge(Base):
    """Tracks each user's market prediction for the Predictive Loot system."""
    __tablename__ = "prediction_challenges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    gamification_id = Column(Integer, ForeignKey("user_gamification.id"), nullable=False)
    asset_symbol = Column(String(30), nullable=False)
    prediction = Column(String(10), nullable=False)        # "UP" or "DOWN"
    predicted_price = Column(Float, nullable=False)         # price at time of prediction
    result_price = Column(Float, nullable=True)             # price after resolution
    is_correct = Column(Integer, nullable=True)             # 0 or 1, null = pending
    xp_earned = Column(Integer, default=0)
    coins_earned = Column(Integer, default=0)
    prediction_date = Column(String(10), nullable=False)    # "YYYY-MM-DD"
    resolved = Column(Integer, default=0)                   # 0 = pending, 1 = resolved
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    gamification = relationship("UserGamification", back_populates="predictions")
