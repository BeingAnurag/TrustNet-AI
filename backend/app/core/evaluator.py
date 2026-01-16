from app.core.features import build_features
from app.core.model_loader import predict
from app.core.decision_engine import decision_from_trust


def evaluate(question: str, context: str, answer: str):
    features = build_features(question, context, answer)
    prediction = predict(features)

    decision = decision_from_trust(prediction["trust_score"])

    return {
        "label": prediction["label"],
        "trust_score": round(prediction["trust_score"], 4),
        "decision": decision,
        "signals": {
            "semantic_similarity": features[0],
            "entity_overlap": features[1],
            "self_consistency": features[2],
            "entropy": features[3],
        },
    }
