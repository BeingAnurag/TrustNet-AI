# Semantic similarity signal implementation
import numpy as np
from sentence_transformers import SentenceTransformer
from numpy.linalg import norm

# Load once (important for production)
model = SentenceTransformer("all-MiniLM-L6-v2")


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return float(np.dot(a, b) / (norm(a) * norm(b)))


def semantic_similarity(answer: str, context: str) -> float:
    """
    Returns normalized semantic similarity in [0, 1]
    """
    embeddings = model.encode([answer, context])
    sim = cosine_similarity(embeddings[0], embeddings[1])

    # cosine similarity ∈ [-1, 1] → normalize to [0, 1]
    normalized = (sim + 1) / 2
    return round(normalized, 4)
