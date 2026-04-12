"""
Simulation Engine for Risk Simulation
Generates realistic market scenarios based on risk level
"""
import random
from typing import Dict, List

def generate_simulation(
    initial_amount: float,
    time_period: int,
    risk_level: str
) -> Dict:
    """
    Generate a market simulation with best, worst, and average cases
    
    Args:
        initial_amount: Starting investment amount
        time_period: Time period in months
        risk_level: 'low', 'medium', or 'high'
    
    Returns:
        Dictionary with best_case, worst_case, average_case, and graph_data
    """
    
    # Risk parameters
    risk_params = {
        'low': {'volatility': 0.01, 'trend': 0.008, 'crash_prob': 0.05},
        'medium': {'volatility': 0.03, 'trend': 0.012, 'crash_prob': 0.15},
        'high': {'volatility': 0.05, 'trend': 0.015, 'crash_prob': 0.25},
    }
    
    params = risk_params.get(risk_level, risk_params['medium'])
    
    # Generate graph data
    graph_data = []
    value = initial_amount
    
    for month in range(time_period + 1):
        graph_data.append({'month': month, 'value': round(value)})
        
        # Random market movement
        if random.random() < params['crash_prob']:
            # Market crash
            value *= (1 - random.uniform(0.05, 0.15))
        else:
            # Normal movement
            movement = random.gauss(params['trend'], params['volatility'])
            value *= (1 + movement)
    
    # Calculate scenarios
    best_case = initial_amount * (1 + (time_period / 12) * (params['trend'] + params['volatility'] * 2))
    worst_case = initial_amount * (1 - (time_period / 12) * params['volatility'] * 3)
    average_case = initial_amount * (1 + (time_period / 12) * params['trend'])
    
    return {
        'best_case': round(best_case),
        'worst_case': round(max(worst_case, initial_amount * 0.5)),  # Ensure not too negative
        'average_case': round(average_case),
        'graph_data': graph_data,
    }


def calculate_loss_probability(risk_level: str) -> Dict:
    """
    Calculate probability of loss based on risk level
    
    Args:
        risk_level: 'low', 'medium', or 'high'
    
    Returns:
        Dictionary with loss_probability and confidence_score
    """
    
    probabilities = {
        'low': {'loss_probability': 15, 'confidence': 0.92},
        'medium': {'loss_probability': 35, 'confidence': 0.85},
        'high': {'loss_probability': 60, 'confidence': 0.78},
    }
    
    return probabilities.get(risk_level, probabilities['medium'])
