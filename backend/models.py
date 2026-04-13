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
