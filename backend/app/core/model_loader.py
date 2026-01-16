import joblib
import numpy as np

MODEL_PATH = "ml/artifacts/xgb.pkl"

model = joblib.load(MODEL_PATH)

LABEL_MAP = {
    0: "grounded",
    1: "partially_grounded",
    2: "hallucinated",
}


def predict(features: np.ndarray):
    probs = model.predict_proba(features.reshape(1, -1))[0]
    pred_class = int(probs.argmax())

    return {
        "label": LABEL_MAP[pred_class],
        "trust_score": float(probs[0]),  # probability of grounded
        "probabilities": probs.tolist(),
    }
