import numpy as np
from app.signals.semantic_similarity import semantic_similarity
from app.signals.entity_overlap import entity_overlap


def build_features(question: str, context: str, answer: str):
    return np.array([
        semantic_similarity(answer, context),
        entity_overlap(answer, context),
        0.0,  # self_consistency (future)
        0.0,  # entropy (future)
    ], dtype=float)
