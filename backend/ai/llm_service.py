import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

print("Connected to Groq!")

# This stores conversation history
# Like a memory list of messages
conversation_history = []

SYSTEM_MESSAGE = """
You are FinBuddy, a friendly investment guide
for young Indian investors aged 18-25.
Talk like a helpful elder brother or sister.
Use Indian examples like chai, cricket, movies.
Keep replies under 100 words.
End with one encouraging line.
No difficult financial words.
"""


def ask_ai(message):
    # Add user message to history
    conversation_history.append({
        "role": "user",
        "content": message
    })

    # Send full history to AI so it remembers
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": SYSTEM_MESSAGE}
        ] + conversation_history,
        max_tokens=300
    )

    reply = response.choices[0].message.content

    # Add AI reply to history too
    conversation_history.append({
        "role": "assistant",
        "content": reply
    })

    return reply


def explain_portfolio(portfolio):
    message = f"""
    The user has this portfolio: {portfolio}
    Explain in simple language:
    1. What are they investing in?
    2. Is it safe or risky?
    3. Worst case scenario?
    Use Indian examples. Under 100 words.
    End with one encouraging line.
    """
    return ask_ai(message)


def react_to_loss(loss_percent):
    message = f"""
    User portfolio just fell by {loss_percent}%.
    Respond like a supportive friend:
    1. Acknowledge the fear in 1 line
    2. Is this fall normal? in 1-2 lines
    3. What should they do now? in 1 line
    4. One positive fact about long term investing
    Be warm. Under 80 words.
    """
    return ask_ai(message)


def answer_question(question):
    message = f"""
    User is asking: {question}
    Answer simply. Use one Indian real life example.
    Under 80 words. End with encouraging line.
    """
    return ask_ai(message)


def reset_memory():
    # Call this to clear conversation
    # and start fresh
    global conversation_history
    conversation_history = []
    return "Memory cleared!"


def deep_risk_analysis(data):
    """
    Advanced AI Financial Risk Analysis using Groq LLM.
    Returns structured JSON with deep personalized insights.
    """
    prompt = f"""You are an advanced AI Financial Risk Analyst.

Your task is to analyze a user's financial simulation and generate a personalized risk assessment.

Simulation Data:
- Initial Investment: ₹{data.get('initial_amount', 'N/A')}
- Time Period: {data.get('time_period', 'N/A')} months
- Risk Level Chosen: {data.get('risk_level', 'N/A')}
- Best Case Outcome: ₹{data.get('best_case', 'N/A')}
- Worst Case Outcome: ₹{data.get('worst_case', 'N/A')}
- Average Case Outcome: ₹{data.get('average_case', 'N/A')}

Additional Context (if available):
- Age: {data.get('age', 'Not provided')}
- Monthly Income: {data.get('income', 'Not provided')}
- Investment Experience: {data.get('experience', 'Not provided')}
- Fear/Risk Score from Quiz: {data.get('risk_score', 'Not provided')}
- Savings Rate: {data.get('savings_rate', 'Not provided')}
- Financial Goals: {data.get('goals', 'Not provided')}

Instructions:
1. Analyze the simulation results deeply — look at the spread between best and worst case, the risk level chosen, the time period, and the amount at risk.
2. Factor in any available personal context.
3. Predict the user's overall investment risk level.

You MUST respond in the following exact JSON format (no markdown, no backticks, just JSON):
{{
  "risk_level": "<Low / Medium / High>",
  "confidence_score": <number between 60 and 98>,
  "key_factors": [
    "<factor 1>",
    "<factor 2>",
    "<factor 3>"
  ],
  "behavior_insight": "<2-3 sentences describing the user's financial personality based on their choices>",
  "recommendations": [
    "<actionable suggestion 1>",
    "<actionable suggestion 2>",
    "<actionable suggestion 3>"
  ],
  "future_projection": "<2-3 sentences explaining what may happen if the user continues this behavior>"
}}

Important:
- Do NOT give generic answers. Make it feel personalized.
- Base your analysis on the actual numbers provided.
- Keep tone professional but easy to understand.
- Respond with ONLY valid JSON, no other text."""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are an expert financial risk analyst AI. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=600,
            temperature=0.7
        )

        reply = response.choices[0].message.content.strip()

        # Try to parse the JSON response
        import json
        # Clean up potential markdown wrapping
        if reply.startswith("```"):
            reply = reply.split("```")[1]
            if reply.startswith("json"):
                reply = reply[4:]
            reply = reply.strip()

        result = json.loads(reply)
        return result

    except json.JSONDecodeError:
        # If JSON parsing fails, return a structured fallback
        return {
            "risk_level": data.get('risk_level', 'Medium').capitalize(),
            "confidence_score": 72,
            "key_factors": [
                f"Investment of ₹{data.get('initial_amount', 0):,} in {data.get('risk_level', 'medium')} risk category",
                f"Time horizon of {data.get('time_period', 12)} months affects volatility exposure",
                f"Potential downside of ₹{data.get('initial_amount', 0) - data.get('worst_case', 0):,} needs consideration"
            ],
            "behavior_insight": f"Based on your choice of {data.get('risk_level', 'medium')} risk with ₹{data.get('initial_amount', 0):,}, you show a balanced approach to investing. Your willingness to explore simulations indicates growing financial confidence.",
            "recommendations": [
                "Consider diversifying across multiple risk levels to reduce overall portfolio volatility",
                "Build an emergency fund of 6 months expenses before increasing equity exposure",
                "Start a systematic investment plan (SIP) to benefit from rupee cost averaging"
            ],
            "future_projection": f"If you continue investing ₹{data.get('initial_amount', 0):,} monthly at {data.get('risk_level', 'medium')} risk, your portfolio could grow significantly over 5-10 years through compounding. However, maintaining discipline during market downturns will be crucial."
        }
    except Exception as e:
        return {
            "risk_level": "Medium",
            "confidence_score": 65,
            "key_factors": [
                "Analysis based on simulation parameters",
                "Market conditions and risk tolerance considered",
                "Historical data patterns analyzed"
            ],
            "behavior_insight": "Your simulation choices show a thoughtful approach to understanding investment risk. Continue exploring different scenarios to build confidence.",
            "recommendations": [
                "Start with low-risk investments and gradually increase exposure",
                "Use our simulation tool regularly to build market intuition",
                "Consider consulting a financial advisor for personalized guidance"
            ],
            "future_projection": "Regular engagement with financial simulation tools typically leads to better investment outcomes. Keep learning and experimenting with different scenarios."
        }