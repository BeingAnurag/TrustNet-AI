# Entity overlap signal implementation
import spacy

nlp = spacy.load("en_core_web_sm")


def extract_entities(text: str) -> set:
    doc = nlp(text)
    return {ent.text.lower() for ent in doc.ents}


def entity_overlap(answer: str, context: str) -> float:
    """
    Returns normalized entity overlap score in [0, 1]
    """
    answer_entities = extract_entities(answer)
    context_entities = extract_entities(context)

    if not answer_entities:
        return 1.0

    overlap = answer_entities.intersection(context_entities)
    score = len(overlap) / len(answer_entities)
    return round(score, 4)
