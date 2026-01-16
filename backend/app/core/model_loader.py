import joblib
import numpy as np
import os

MODEL_PATH = "ml/artifacts/xgb.pkl"


class DummyModel:
    """Lightweight fallback when trained model is unavailable.
    Uses semantic similarity (feature[0]) as a proxy for trust.
    Returns soft probabilities for classes [grounded, partially_grounded, hallucinated].
    """

    def predict_proba(self, X):
        X = np.asarray(X)
        if X.ndim == 1:
            X = X.reshape(1, -1)
        # semantic_similarity in [0,1]
        sim = np.clip(X[:, 0], 0.0, 1.0)
        p0 = sim
        p2 = 1.0 - sim
        # middle class peaks around 0.5
        p1 = np.clip(0.5 - np.abs(sim - 0.5), 0.0, 0.5)
        s = p0 + p1 + p2 + 1e-12
        return np.stack([p0 / s, p1 / s, p2 / s], axis=1)


try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"[TrustNet] Model artifact not found at {MODEL_PATH}. Using DummyModel. Details: {e}")
    model = DummyModel()


LABEL_MAP = {
    0: "grounded",
    1: "partially_grounded",
    2: "hallucinated",
}


def predict(features: np.ndarray):
    probs = model.predict_proba(features.reshape(1, -1))[0]
    pred_class = int(np.argmax(probs))

    return {
        "label": LABEL_MAP[pred_class],
        "trust_score": float(probs[0]),  # probability of grounded
        "probabilities": probs.tolist(),
    }
