# main.py
# Main server file for Investing Fear backend
# Run: uvicorn main:app --reload

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai.routes import router as ai_router
from routes.simulation import router as simulation_router
from routes.portfolio import router as portfolio_router
from routes.dashboard import router as dashboard_router
from routes.auth import router as auth_router
from database import engine, Base

# Create all database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Investing Fear API",
    description="Backend for Investing Fear - Risk Simulation & AI Portfolio Explainer",
    version="2.0.0"
)

# CORS middleware - allows React frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth_router)
app.include_router(ai_router)
app.include_router(simulation_router)
app.include_router(portfolio_router)
app.include_router(dashboard_router)

# Health check endpoint
@app.get("/")
def home():
    return {
        "status": "Investing Fear API is running!",
        "version": "2.0.0",
        "docs": "/docs",
        "features": ["auth", "simulations", "portfolios", "ai-chat", "dashboard"]
    }

@app.get("/health")
def health():
    return {"status": "healthy"}