# Model evaluation script
import joblib
import numpy as np
from sklearn.metrics import (
    accuracy_score,
    precision_recall_fscore_support,
    roc_auc_score
)
from ml.features.build_features import load_dataset


def evaluate(model_path: str, dataset_path: str):
    model = joblib.load(model_path)
    X_test, y_test = load_dataset(dataset_path)

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)

    acc = accuracy_score(y_test, y_pred)

    precision, recall, f1, _ = precision_recall_fscore_support(
        y_test, y_pred, average="macro"
    )

    roc_auc = roc_auc_score(
        y_test,
        y_prob,
        multi_class="ovr",
        average="macro"
    )

    return {
        "accuracy": round(acc, 4),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1": round(f1, 4),
        "roc_auc": round(roc_auc, 4),
    }


if __name__ == "__main__":
    metrics = evaluate(
        "ml/artifacts/xgb.pkl",
        "data/processed/test.jsonl"
    )

    print("Evaluation Metrics")
    for k, v in metrics.items():
        print(f"{k}: {v}")
