import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from ai.llm_service import explain_portfolio, react_to_loss, answer_question

print("Starting tests...\n")

print("TEST 1 — Portfolio Explainer:")
print("-" * 40)
print(explain_portfolio("40% Reliance, 40% HDFC Bank, 20% Gold"))

print("\nTEST 2 — Loss Reaction:")
print("-" * 40)
print(react_to_loss(15))

print("\nTEST 3 — Question Answer:")
print("-" * 40)
print(answer_question("What is a mutual fund?"))

print("\nAll tests done!")