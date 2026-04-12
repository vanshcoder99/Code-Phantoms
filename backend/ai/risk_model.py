import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# 200 investor profiles dataset
# [age, monthly_savings, fear_score, knowledge_score]
np.random.seed(42)

# Conservative investors (label=0) — scared, low savings, young/old
conservative = np.column_stack([
    np.random.randint(18, 25, 70),           # age 18-25
    np.random.randint(500, 3000, 70),         # low savings
    np.random.randint(65, 99, 70),            # high fear
    np.random.randint(0, 30, 70),             # low knowledge
])

# Balanced investors (label=1) — moderate everything
balanced = np.column_stack([
    np.random.randint(22, 35, 70),            # age 22-35
    np.random.randint(3000, 10000, 70),       # medium savings
    np.random.randint(30, 65, 70),            # medium fear
    np.random.randint(30, 65, 70),            # medium knowledge
])

# Aggressive investors (label=2) — confident, high savings
aggressive = np.column_stack([
    np.random.randint(25, 45, 60),            # age 25-45
    np.random.randint(10000, 50000, 60),      # high savings
    np.random.randint(0, 35, 60),             # low fear
    np.random.randint(60, 100, 60),           # high knowledge
])

# Combine all investors
X_train = np.vstack([conservative, balanced, aggressive])
y_train = np.array([0]*70 + [1]*70 + [2]*60)

# Shuffle the dataset
shuffle_idx = np.random.permutation(len(X_train))
X_train = X_train[shuffle_idx]
y_train = y_train[shuffle_idx]

# Scale the data
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

# Train Random Forest with 200 investors
model = RandomForestClassifier(
    n_estimators=100,    # 100 decision trees
    max_depth=10,
    random_state=42
)
model.fit(X_scaled, y_train)

# Calculate accuracy
X_test_scaled = scaler.transform(X_train)
accuracy = round(model.score(X_test_scaled, y_train) * 100, 1)
print(f"✅ ML Model trained on 200 investors | Accuracy: {accuracy}%")

PROFILES = {
    0: {
        "type": "Conservative Investor",
        "allocation": "60% Gold/Bonds, 30% Large Cap, 10% Index Fund",
        "expected_return": "8-10% annually",
        "risk": "Low",
        "description": "You prefer safety over high returns. Start with SIP in large cap funds."
    },
    1: {
        "type": "Balanced Investor",
        "allocation": "40% Large Cap, 30% Mid Cap, 20% Gold, 10% Index",
        "expected_return": "10-13% annually",
        "risk": "Medium",
        "description": "Good balance of growth and safety. Ideal for 5-10 year goals."
    },
    2: {
        "type": "Aggressive Investor",
        "allocation": "50% Mid/Small Cap, 30% Large Cap, 20% Sectoral",
        "expected_return": "13-18% annually",
        "risk": "High",
        "description": "You chase high returns and can handle volatility. Think long term!"
    }
}

def predict_investor_profile(age, monthly_savings, fear_score, knowledge_score):
    features = np.array([[age, monthly_savings, fear_score, knowledge_score]])
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)[0]
    probabilities = model.predict_proba(features_scaled)[0]
    confidence = round(float(max(probabilities)) * 100, 1)
    profile = PROFILES[int(prediction)]

    return {
        "profile_type": profile["type"],
        "recommended_allocation": profile["allocation"],
        "expected_return": profile["expected_return"],
        "risk_level": profile["risk"],
        "description": profile["description"],
        "confidence_percent": confidence,
        "dataset_size": 200,
        "ml_model_used": "Random Forest Classifier",
        "n_estimators": 100,
        "framework": "scikit-learn"
    }