# Feature engineering for TrustNet AI
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

import json
import numpy as np
from backend.app.signals.semantic_similarity import semantic_similarity
from backend.app.signals.entity_overlap import entity_overlap


LABEL_MAP = {
    "grounded": 0,
    "partially_grounded": 1,
    "hallucinated": 2
}


def extract_features(sample):
    question = sample["question"]
    context = sample["context"]
    answer = sample["answer"]

    features = [
        semantic_similarity(answer, context),
        entity_overlap(answer, context),
        0.0,  # self_consistency (Phase 4+)
        0.0,  # entropy (Phase 4+)
    ]

    return np.array(features, dtype=float)


def load_dataset(path):
    X, y = [], []

    with open(path) as f:
        for line in f:
            sample = json.loads(line)
            X.append(extract_features(sample))
            y.append(LABEL_MAP[sample["label"]])

    return np.vstack(X), np.array(y)
