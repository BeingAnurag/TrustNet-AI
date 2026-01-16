# Ablation study for feature importance
import joblib
import numpy as np
from sklearn.metrics import accuracy_score
from ml.features.build_features import load_dataset


FEATURE_NAMES = [
    "semantic_similarity",
    "entity_overlap",
    "self_consistency",
    "entropy",
]


def ablation_test(model_path, dataset_path):
    model = joblib.load(model_path)
    X, y = load_dataset(dataset_path)

    base_acc = accuracy_score(y, model.predict(X))
    print(f"Base accuracy: {base_acc:.4f}\n")

    for i, name in enumerate(FEATURE_NAMES):
        X_ablated = X.copy()
        X_ablated[:, i] = 0.0

        acc = accuracy_score(y, model.predict(X_ablated))
        drop = base_acc - acc

        print(f"Removed {name}:")
        print(f"  Accuracy: {acc:.4f}")
        print(f"  Drop: {drop:.4f}\n")


if __name__ == "__main__":
    ablation_test(
        "ml/artifacts/xgb.pkl",
        "data/processed/test.jsonl"
    )
