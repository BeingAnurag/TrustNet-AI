# Model evaluation utilities
import numpy as np


FEATURE_NAMES = [
    "semantic_similarity",
    "entity_overlap",
    "self_consistency",
    "entropy",
]


def print_logreg_importance(model):
    for idx, class_coef in enumerate(model.coef_):
        print(f"\nClass {idx}")
        for f, coef in zip(FEATURE_NAMES, class_coef):
            print(f"{f}: {coef:.4f}")


def print_xgb_importance(model):
    importance = model.feature_importances_
    for f, imp in zip(FEATURE_NAMES, importance):
        print(f"{f}: {imp:.4f}")
