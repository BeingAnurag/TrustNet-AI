from fastapi import APIRouter
from app.schemas.request_response import (
    EvaluationRequest,
    EvaluationResponse,
    SignalScores,
)
from app.core.evaluator import dummy_evaluate

router = APIRouter()


@router.post("/evaluate", response_model=EvaluationResponse)
def evaluate_answer(request: EvaluationRequest):
    result = dummy_evaluate(
        request.question,
        request.context,
        request.answer,
    )

    return EvaluationResponse(
        label=result["label"],
        trust_score=result["trust_score"],
        signals=SignalScores(**result["signals"]),
    )


@router.post("/signals", response_model=SignalScores)
def extract_signals(request: EvaluationRequest):
    result = dummy_evaluate(
        request.question,
        request.context,
        request.answer,
    )
    return SignalScores(**result["signals"])
