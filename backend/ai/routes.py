from fastapi import APIRouter
from pydantic import BaseModel
from ai.llm_service import (
    explain_portfolio,
    react_to_loss,
    answer_question,
    reset_memory
)

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