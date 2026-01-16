# TrustNet AI

LLM Hallucination Detection & Trust Scoring System

TrustNet AI is a production-oriented system that evaluates the reliability of LLM-generated answers by detecting hallucinations, assigning a trust score, and providing transparent signal-level explanations.

## Highlights

- **Hallucination classification:** grounded, partially_grounded, hallucinated
- **Trust score (0–1):** probability-based confidence of answer reliability
- **Explainability:** signal-level breakdown (semantic similarity, entity overlap), extensible signals (self-consistency, token entropy)
- **Clean architecture:** UI → Backend API → ML inference → Decision Engine

## Architecture

User Input → Streamlit UI → FastAPI Backend → Signal Extraction → ML (XGBoost) → Trust Score + Label → Decision Engine

- **UI (Streamlit):** presentation only
- **Backend (FastAPI):** API + orchestration
- **ML (offline):** training and evaluation
- **Decision Engine:** product-tunable thresholds, auditable, swappable without retraining

## Project Structure

```
trustnet-ai/
├── backend/                     # FastAPI service
│   ├── app/
│   │   ├── api/                 # HTTP routes
│   │   │   └── routes.py
│   │   ├── core/                # Orchestration & business logic
│   │   │   ├── evaluator.py
│   │   │   ├── decision_engine.py
│   │   │   ├── features.py
│   │   │   └── model_loader.py
│   │   ├── signals/             # Signal extraction
│   │   │   ├── semantic_similarity.py
│   │   │   └── entity_overlap.py
│   │   ├── schemas/             # API contracts
│   │   │   └── request_response.py
│   │   └── main.py              # FastAPI entrypoint
│   └── requirements.txt
├── ml/                          # Offline ML pipeline
│   ├── features/
│   │   └── build_features.py
│   ├── models/
│   │   ├── train_logreg.py
│   │   ├── train_xgboost.py
│   │   └── evaluate_utils.py
│   ├── evaluation/
│   │   ├── evaluate_model.py
│   │   ├── baselines.py
│   │   └── ablation.py
│   └── artifacts/               # Saved models (ignored in git)
│       ├── logreg.pkl
│       └── xgb.pkl
├── data/                        # Dataset & labeling pipeline
│   ├── raw/
│   ├── processed/               # train/val/test .jsonl
│   └── scripts/                 # build/split/generate
├── ui/                          # Streamlit app
│   ├── streamlit_app.py
│   └── requirements.txt
├── .gitignore
└── README.md
```

Key files:
- API routes: [backend/app/api/routes.py](backend/app/api/routes.py)
- Evaluator: [backend/app/core/evaluator.py](backend/app/core/evaluator.py)
- Signals: [backend/app/signals](backend/app/signals)
- UI: [ui/streamlit_app.py](ui/streamlit_app.py)

## Signals

- **Semantic Similarity:** embedding similarity between answer and context (0–1)
- **Entity Overlap:** named-entity grounding score (0–1)
- **Self-Consistency (extensible):** agreement across multiple generations
- **Token Entropy (extensible):** model uncertainty estimate

## Decision Engine

| Trust Score | Action               |
|-------------|----------------------|
| > 0.80      | show                 |
| 0.50–0.80   | show_with_warning    |
| < 0.50      | flag                 |

Decision logic is cleanly separated from ML inference and can be tuned without model changes.

## Quick Start (Local)

Prerequisites: Python 3.11

1) Create and activate a virtual environment

```powershell
py -3.11 -m venv venv311
./venv311/Scripts/Activate.ps1
```

2) Install dependencies

```powershell
# Backend
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# UI
cd ../ui
pip install -r requirements.txt
```

3) Run services

```powershell
# Backend (in ./backend)
uvicorn app.main:app --reload

# UI (in ./ui)
streamlit run streamlit_app.py
```

By default the UI calls the backend at `http://127.0.0.1:8000/evaluate`. If you change the backend port, update `BACKEND_URL` in [ui/streamlit_app.py](ui/streamlit_app.py).

## API

POST `/evaluate`

Request
```json
{
	"question": "...",
	"context": "...",
	"answer": "..."
}
```

Response
```json
{
	"label": "grounded",
	"trust_score": 0.92,
	"decision": "show",
	"signals": {
		"semantic_similarity": 0.93,
		"entity_overlap": 0.88,
		"self_consistency": 0.0,
		"entropy": 0.0
	}
}
```

## ML Notes

- Task: multi-class classification (grounded, partially_grounded, hallucinated)
- Models: Logistic Regression (baseline), XGBoost (main)
- Features: `[semantic_similarity, entity_overlap, self_consistency, entropy]`

Train (optional):
```powershell
./venv311/Scripts/Activate.ps1
python ml/models/train_xgboost.py
```

Ensure processed datasets exist under `data/processed/` (e.g., `train.jsonl`). See [data/scripts](data/scripts) for helpers.

## Tech Stack

- Backend: FastAPI, Python 3.11
- UI: Streamlit
- ML: scikit-learn, XGBoost
- NLP: spaCy, SentenceTransformers

## License

MIT License
