# main.py
# This is the main server file
# Run this to start your AI server

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai.routes import router

app = FastAPI()

# This allows React frontend to talk to your server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect your AI routes
app.include_router(router)

# Test route — to check server is running
@app.get("/")
def home():
    return {"status": "FinBuddy AI Server is running!"}