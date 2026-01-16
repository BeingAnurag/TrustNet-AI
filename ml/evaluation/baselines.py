# Baseline model comparisons
import numpy as np
from sklearn.metrics import accuracy_score
from ml.features.build_features import load_dataset


def random_baseline(dataset_path):
    _, y_test = load_dataset(dataset_path)
    random_preds = np.random.choice([0, 1, 2], size=len(y_test))
    return accuracy_score(y_test, random_preds)


def similarity_only_baseline(dataset_path):
    X_test, y_test = load_dataset(dataset_path)

    # Use only semantic similarity
    sim_scores = X_test[:, 0]

    # Simple binning (baseline only, NOT final logic)
    preds = []
    for s in sim_scores:
        if s > 0.75:
            preds.append(0)  # grounded
        elif s > 0.4:
            preds.append(1)  # partially grounded
        else:
            preds.append(2)  # hallucinated

    return accuracy_score(y_test, preds)


if __name__ == "__main__":
    print("Random baseline accuracy:",
          random_baseline("data/processed/test.jsonl"))

    print("Similarity-only baseline accuracy:",
          similarity_only_baseline("data/processed/test.jsonl"))
