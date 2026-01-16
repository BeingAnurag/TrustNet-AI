# Logistic Regression training script
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

import joblib
from sklearn.linear_model import LogisticRegression
from ml.features.build_features import load_dataset


X_train, y_train = load_dataset("data/processed/train.jsonl")

model = LogisticRegression(
    max_iter=1000,
)

model.fit(X_train, y_train)

joblib.dump(model, "ml/artifacts/logreg.pkl")

print("Logistic Regression trained and saved.")
