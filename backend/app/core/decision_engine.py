def decision_from_trust(trust_score: float):
    if trust_score > 0.80:
        return "show"
    elif trust_score >= 0.50:
        return "show_with_warning"
    else:
        return "flag"
