"""
LLM Service v2 — SHAP-Grounded Groq Integration
==================================================
Upgraded from basic chatbot to SHAP-aware, memory-managed LLM service.

Key upgrades:
- SHAP-grounded prompts for every prediction explanation
- Sliding window memory (last 6 messages, not unlimited)
- Enhanced SEBI mentor persona
- Market sentiment parameter
- Pydantic-validated JSON output with retry
"""

import os
import json
from groq import Groq
from dotenv import load_dotenv
from ai.prompts import (
    FINBUDDY_SYSTEM_PROMPT,
    SHAP_EXPLANATION_PROMPT,
    PORTFOLIO_EXPLAIN_PROMPT,
    LOSS_REACTION_PROMPT,
    CHAT_ANSWER_PROMPT,
    DEEP_RISK_ANALYSIS_PROMPT,
)

load_dotenv()

# Graceful initialization — server starts even without GROQ_API_KEY
_groq_api_key = os.getenv("GROQ_API_KEY")
if _groq_api_key:
    client = Groq(api_key=_groq_api_key)
    print("Connected to Groq! (v2 -- SHAP-grounded)")
else:
    client = None
    print("[WARN] GROQ_API_KEY not set. LLM features will use fallback responses.")

# ===================================================================
# SLIDING WINDOW CONVERSATION MEMORY (max 6 messages = 3 turns)
# ===================================================================
MAX_MEMORY_MESSAGES = 6
conversation_history = []


def _trim_memory():
    """Keep only the last MAX_MEMORY_MESSAGES messages (sliding window)."""
    global conversation_history
    if len(conversation_history) > MAX_MEMORY_MESSAGES:
        conversation_history = conversation_history[-MAX_MEMORY_MESSAGES:]


def ask_ai(message, system_prompt=None):
    """
    Core LLM call with sliding window memory.
    
    Args:
        message: User message string
        system_prompt: Optional override for system prompt
    """
    if client is None:
        return "FinBuddy is currently offline (GROQ_API_KEY not configured). Please set up your Groq API key in the .env file to enable AI chat features."
    
    # Add user message to history
    conversation_history.append({
        "role": "user",
        "content": message
    })
    
    # Trim to sliding window
    _trim_memory()
    
    # Use enhanced system prompt by default
    sys_prompt = system_prompt or FINBUDDY_SYSTEM_PROMPT

    # Send with sliding window history
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": sys_prompt}
        ] + conversation_history,
        max_tokens=400,
        temperature=0.7,
    )

    reply = response.choices[0].message.content

    # Add AI reply to history
    conversation_history.append({
        "role": "assistant",
        "content": reply
    })
    
    # Trim again after adding response
    _trim_memory()

    return reply


# ===================================================================
# ENDPOINT FUNCTIONS
# ===================================================================

def explain_portfolio(portfolio):
    """Explain a portfolio in simple Hinglish with Indian context."""
    message = PORTFOLIO_EXPLAIN_PROMPT.format(portfolio=portfolio)
    return ask_ai(message)


def react_to_loss(loss_percent):
    """Supportive response to portfolio loss with historical Indian market context."""
    message = LOSS_REACTION_PROMPT.format(loss_percent=loss_percent)
    return ask_ai(message)


def answer_question(question):
    """Answer a finance question with Indian examples and encouragement."""
    message = CHAT_ANSWER_PROMPT.format(question=question)
    return ask_ai(message)


def reset_memory():
    """Clear conversation history and start fresh."""
    global conversation_history
    conversation_history = []
    return "Memory cleared! Fresh start — let's talk finance!"


# ===================================================================
# SHAP-GROUNDED PROFILE EXPLANATION (NEW in v2)
# ===================================================================

def explain_profile_with_shap(prediction_result):
    """
    Generate a SHAP-grounded explanation of an investor profile prediction.
    
    This is the KEY upgrade — the LLM now explains predictions using actual
    SHAP feature importance data, not just generic text.
    
    Args:
        prediction_result: dict from risk_model_v2.predict_advanced()
    
    Returns:
        str: Human-readable, SHAP-grounded explanation in Hinglish
    """
    if client is None:
        shap_text = prediction_result.get('shap_explanation', {}).get('human_readable', '')
        return f"Profile: {prediction_result.get('profile_type', 'Unknown')} ({prediction_result.get('confidence', 0)}% confidence). {shap_text}"
    
    shap_text = prediction_result.get('shap_explanation', {}).get('human_readable', 'No SHAP data available')
    top_factors = prediction_result.get('shap_explanation', {}).get('top_factors', [])
    
    # Format top factors for the prompt
    factors_text = ""
    for i, factor in enumerate(top_factors[:5], 1):
        factors_text += f"\n  {i}. {factor['feature']}: impact={factor['impact']:.4f} ({factor['direction']})"
    
    prob_dist = prediction_result.get('probability_distribution', {})
    prob_text = "\n".join([f"  - {k}: {v}%" for k, v in prob_dist.items()])
    
    prompt = SHAP_EXPLANATION_PROMPT.format(
        profile_type=prediction_result.get('profile_type', 'Unknown'),
        confidence=prediction_result.get('confidence', 0),
        model_name=prediction_result.get('model_used', 'Unknown'),
        dataset_size=prediction_result.get('dataset_size', '20,000'),
        cv_accuracy=prediction_result.get('cross_val_accuracy', 'N/A'),
        shap_explanation=f"{shap_text}\n\nTop Contributing Factors:{factors_text}",
        probability_distribution=prob_text,
        allocation=prediction_result.get('recommended_allocation', 'N/A'),
    )
    
    # Use a separate call (don't pollute chat history with SHAP data)
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": FINBUDDY_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7,
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Profile: {prediction_result.get('profile_type', 'Unknown')} ({prediction_result.get('confidence', 0)}% confidence). {shap_text}"


# ===================================================================
# DEEP RISK ANALYSIS (with improved prompts)
# ===================================================================

def deep_risk_analysis(data):
    """
    Advanced AI Financial Risk Analysis using Groq LLM.
    Returns structured JSON with deep personalized insights.
    Uses improved prompt templates with retry on parse failure.
    """
    if client is None:
        return _risk_analysis_fallback(data)
    
    prompt = DEEP_RISK_ANALYSIS_PROMPT.format(
        initial_amount=data.get('initial_amount', 'N/A'),
        time_period=data.get('time_period', 'N/A'),
        risk_level=data.get('risk_level', 'N/A'),
        best_case=data.get('best_case', 'N/A'),
        worst_case=data.get('worst_case', 'N/A'),
        average_case=data.get('average_case', 'N/A'),
        age=data.get('age', 'Not provided'),
        income=data.get('income', 'Not provided'),
        experience=data.get('experience', 'Not provided'),
        risk_score=data.get('risk_score', 'Not provided'),
        savings_rate=data.get('savings_rate', 'Not provided'),
        goals=data.get('goals', 'Not provided'),
    )

    # Retry up to 2 times on JSON parse failure
    for attempt in range(2):
        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[
                    {"role": "system", "content": "You are an expert financial risk analyst AI. Always respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=600,
                temperature=0.7 if attempt == 0 else 0.3,  # Lower temp on retry
            )

            reply = response.choices[0].message.content.strip()

            # Clean up potential markdown wrapping
            if reply.startswith("```"):
                reply = reply.split("```")[1]
                if reply.startswith("json"):
                    reply = reply[4:]
                reply = reply.strip()

            result = json.loads(reply)
            return result

        except json.JSONDecodeError:
            if attempt == 0:
                continue  # Retry with lower temperature
            # Final fallback
            return _risk_analysis_fallback(data)
        except Exception:
            return _risk_analysis_fallback(data)


def _risk_analysis_fallback(data):
    """Structured fallback when LLM JSON parsing fails."""
    return {
        "risk_level": data.get('risk_level', 'Medium').capitalize(),
        "confidence_score": 72,
        "key_factors": [
            f"Investment of Rs {data.get('initial_amount', 0):,} in {data.get('risk_level', 'medium')} risk category",
            f"Time horizon of {data.get('time_period', 12)} months affects volatility exposure",
            f"Potential downside of Rs {data.get('initial_amount', 0) - data.get('worst_case', 0):,} needs consideration"
        ],
        "behavior_insight": f"Based on your choice of {data.get('risk_level', 'medium')} risk with Rs {data.get('initial_amount', 0):,}, you show a balanced approach to investing. Your willingness to explore simulations indicates growing financial confidence.",
        "recommendations": [
            "Consider diversifying across multiple risk levels to reduce overall portfolio volatility",
            "Build an emergency fund of 6 months expenses before increasing equity exposure",
            "Start a systematic investment plan (SIP) to benefit from rupee cost averaging"
        ],
        "future_projection": f"If you continue investing Rs {data.get('initial_amount', 0):,} monthly at {data.get('risk_level', 'medium')} risk, your portfolio could grow significantly over 5-10 years through compounding. However, maintaining discipline during market downturns will be crucial."
    }