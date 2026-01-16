from pydantic import BaseModel
from typing import Dict


class EvaluationRequest(BaseModel):
    question: str
    context: str
    answer: str


class SignalScores(BaseModel):
    semantic_similarity: float
    entity_overlap: float
    self_consistency: float
    entropy: float


class EvaluationResponse(BaseModel):
    label: str
    trust_score: float
    signals: SignalScores
