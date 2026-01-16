from app.signals.semantic_similarity import semantic_similarity
from app.signals.entity_overlap import entity_overlap


def evaluate_signals(question: str, context: str, answer: str):
    """
    Signal-only evaluation (no ML, no decisions)
    """

    signals = {
        "semantic_similarity": semantic_similarity(answer, context),
        "entity_overlap": entity_overlap(answer, context),

        
        "self_consistency": 0.0,
        "entropy": 0.0,
    }

    return signals


def dummy_evaluate(question: str, context: str, answer: str):
    """
    Temporary wrapper until ML arrives
    """
    signals = evaluate_signals(question, context, answer)

    # Temporary values — NOT LOGIC
    trust_score = round(
        (signals["semantic_similarity"] + signals["entity_overlap"]) / 2, 4
    )

    label = "partially_grounded"

    return {
        "label": label,
        "trust_score": trust_score,
        "signals": signals,
    }
