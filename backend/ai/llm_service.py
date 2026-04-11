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