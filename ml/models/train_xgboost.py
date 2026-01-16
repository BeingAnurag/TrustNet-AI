# XGBoost training script
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

import joblib
import xgboost as xgb
from ml.features.build_features import load_dataset


X_train, y_train = load_dataset("data/processed/train.jsonl")

model = xgb.XGBClassifier(
    objective="multi:softprob",
    num_class=3,
    n_estimators=100,
    max_depth=4,
    learning_rate=0.1,
    eval_metric="mlogloss",
)

model.fit(X_train, y_train)

joblib.dump(model, "ml/artifacts/xgb.pkl")

print("XGBoost model trained and saved.")
