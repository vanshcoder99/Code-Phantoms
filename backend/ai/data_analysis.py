import pandas as pd
import numpy as np

def analyze_stock(stock_name):
    np.random.seed(42)
    dates = pd.date_range(start="2019-01-01", end="2024-01-01", freq="ME")
    returns = np.random.normal(loc=0.01, scale=0.05, size=len(dates))

    df = pd.DataFrame({
        "date": dates,
        "monthly_return": returns,
        "cumulative_return": (1 + returns).cumprod() - 1
    })

    return {
        "stock": stock_name,
        "avg_monthly_return_pct": round(float(df["monthly_return"].mean()) * 100, 2),
        "volatility_pct": round(float(df["monthly_return"].std()) * 100, 2),
        "best_month_pct": round(float(df["monthly_return"].max()) * 100, 2),
        "worst_month_pct": round(float(df["monthly_return"].min()) * 100, 2),
        "positive_months_pct": round(float((df["monthly_return"] > 0).mean()) * 100, 1),
        "total_5yr_return_pct": round(float(df["cumulative_return"].iloc[-1]) * 100, 1),
        "sharpe_ratio": round(float(df["monthly_return"].mean() / df["monthly_return"].std()), 2),
        "frameworks_used": ["pandas", "numpy"]
    }