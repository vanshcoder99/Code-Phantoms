from ai.risk_model import predict_investor_profile
from ai.data_analysis import analyze_stock
from ai.llm_service import (
    explain_portfolio,
    react_to_loss,
    answer_question,
    reset_memory,
    deep_risk_analysis,
    explain_profile_with_shap,
)

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional

router = APIRouter()


class PortfolioRequest(BaseModel):
    portfolio: str

class LossRequest(BaseModel):
    loss_percent: float

class ChatRequest(BaseModel):
    question: str


# ENDPOINT 1 — Explain portfolio
@router.post("/ai/explain-portfolio")
def explain(req: PortfolioRequest):
    result = explain_portfolio(req.portfolio)
    return {"reply": result}


# ENDPOINT 2 — Loss reaction
@router.post("/ai/loss-reaction")
def loss(req: LossRequest):
    result = react_to_loss(req.loss_percent)
    return {"reply": result}


# ENDPOINT 3 — Chat with memory
@router.post("/ai/chat")
def chat(req: ChatRequest):
    result = answer_question(req.question)
    return {"reply": result}


# ENDPOINT 4 — Reset memory (start fresh)
@router.post("/ai/reset")
def reset():
    result = reset_memory()
    return {"reply": result}

class ProfileRequest(BaseModel):
    age: int
    monthly_savings: float
    fear_score: int
    knowledge_score: int

class StockAnalysisRequest(BaseModel):
    stock: str

@router.post("/ai/predict-profile")
def predict_profile(req: ProfileRequest):
    result = predict_investor_profile(
        req.age,
        req.monthly_savings,
        req.fear_score,
        req.knowledge_score
    )
    return result

@router.post("/ai/analyze-stock")
def analyze(req: StockAnalysisRequest):
    return analyze_stock(req.stock)


class DeepRiskAnalysisRequest(BaseModel):
    initial_amount: float
    time_period: int
    risk_level: str
    best_case: float
    worst_case: float
    average_case: float
    age: Optional[int] = None
    income: Optional[float] = None
    experience: Optional[str] = None
    risk_score: Optional[int] = None
    savings_rate: Optional[float] = None
    goals: Optional[str] = None


@router.post("/ai/deep-risk-analysis")
def deep_analysis(req: DeepRiskAnalysisRequest):
    """Advanced AI-powered deep financial risk analysis using Groq LLM"""
    result = deep_risk_analysis(req.dict())
    return result


# ╔══════════════════════════════════════════════════════════════╗
# ║  NEW v2 ENDPOINT — Advanced Prediction with SHAP            ║
# ╚══════════════════════════════════════════════════════════════╝

class AdvancedProfileRequest(BaseModel):
    """Request schema for advanced prediction with SHAP explainability."""
    age: int = Field(..., ge=18, le=80, description="User's age")
    monthly_savings: float = Field(..., ge=0, description="Monthly savings in INR")
    fear_score: int = Field(..., ge=0, le=100, description="Fear/anxiety score (0-100)")
    knowledge_score: int = Field(..., ge=0, le=100, description="Financial knowledge score (0-100)")
    include_llm_explanation: Optional[bool] = Field(
        default=False,
        description="If true, includes a Groq LLM-generated SHAP-grounded explanation"
    )


@router.post("/api/v2/predict-advanced")
def predict_advanced(req: AdvancedProfileRequest):
    """
    Advanced investor profile prediction using ML Pipeline v2.
    
    Features:
    - 20,000-record trained model (6 classifiers compared)
    - SHAP explainability for every prediction
    - Probability distribution across all 4 profiles
    - Optional LLM-generated explanation (SHAP-grounded)
    
    Returns full prediction with confidence, SHAP factors, and allocation.
    """
    from ai.risk_model_v2 import predict_advanced as ml_predict
    
    # Get ML prediction with SHAP explanation
    result = ml_predict(
        age=req.age,
        monthly_savings=req.monthly_savings,
        fear_score=req.fear_score,
        knowledge_score=req.knowledge_score
    )
    
    # Optionally add LLM-generated explanation
    if req.include_llm_explanation:
        try:
            llm_explanation = explain_profile_with_shap(result)
            result["llm_explanation"] = llm_explanation
        except Exception as e:
            result["llm_explanation"] = f"Could not generate LLM explanation: {str(e)}"
    
    return result