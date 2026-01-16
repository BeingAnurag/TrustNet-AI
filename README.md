# TrustNet AI

TrustNet AI detects hallucinations in LLM-generated answers. It extracts reliability signals, runs a supervised classifier, and returns a label, trust score, and signal breakdown.

## Key Features
- FastAPI inference service exposing `/evaluate`
- Signal extraction: semantic similarity (SentenceTransformers), entity overlap (spaCy NER)
- Supervised models: XGBoost (primary), Logistic Regression (baseline); dummy fallback if artifacts are missing
- Frontends: Streamlit app and Next.js (TypeScript + Tailwind) UI

## High-Level Architecture
User → UI (Streamlit or Next.js) → FastAPI → Signals → ML model (XGBoost/LogReg or fallback) → Label + trust score

## Signal Extraction
- **Semantic similarity:** all-MiniLM-L6-v2 embeddings; cosine similarity normalized to [0, 1]
- **Entity overlap:** spaCy `en_core_web_sm` named-entity overlap, normalized to [0, 1]
- Self-consistency and entropy placeholders exist but are currently constant `0.0`

## ML Models & Evaluation
- Training scripts: `ml/models/train_xgboost.py`, `ml/models/train_logreg.py`
- Features for training/inference: `[semantic_similarity, entity_overlap, self_consistency, entropy]`
- Artifacts expected at `ml/artifacts/xgb.pkl` (or `logreg.pkl`); if missing, backend uses a DummyModel based on semantic similarity
- Evaluation utilities: `ml/evaluation/evaluate_model.py`, `baselines.py`, `ablation.py`

## Project Structure
```
backend/                # FastAPI service
	app/
		api/routes.py       # /evaluate endpoint
		core/               # evaluation, decision, features, model loading
		signals/            # semantic similarity, entity overlap
		schemas/            # Pydantic request/response models
		main.py             # app entrypoint + CORS
ml/                     # Offline training/eval
	features/             # feature extraction for datasets
	models/               # training scripts (XGBoost, LogReg)
	evaluation/           # metrics, baselines, ablation
	artifacts/            # model files (gitignored)
data/                   # raw/processed JSONL and dataset scripts
frontend/               # Next.js + Tailwind UI
ui/                     # Streamlit UI
```

## Backend API
- **POST `/evaluate`**
	- Request: `{ "question": str, "context": str, "answer": str }`
	- Response: `{ "label": str, "trust_score": float, "signals": { semantic_similarity, entity_overlap, self_consistency, entropy } }`
	- CORS allows `http://localhost:3000` for the Next.js dev server

## Local Setup & Running

### Backend
```powershell
cd backend
python -m pip install -r requirements.txt
python -m spacy download en_core_web_sm

# If you have a trained model, place it at ml/artifacts/xgb.pkl
# Otherwise the DummyModel fallback will be used
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

### Next.js Frontend
```powershell
cd frontend
npm install

# Set backend URL (already used in .env.local)
echo NEXT_PUBLIC_API_URL=http://127.0.0.1:8001 > .env.local

npm run dev  # http://localhost:3000
```

### Streamlit UI (optional)
```powershell
cd ui
pip install -r requirements.txt
streamlit run streamlit_app.py  # expects backend at http://127.0.0.1:8001/evaluate
```

### Train a Model (optional)
```powershell
python ml/models/train_xgboost.py  # writes ml/artifacts/xgb.pkl
```

## Deployment Notes
- Backend expects model artifacts under `ml/artifacts/`; ensure they are packaged or mounted
- spaCy model `en_core_web_sm` must be available in the runtime
- Configure `NEXT_PUBLIC_API_URL` for the frontend deployment (Vercel or similar)
- CORS origins are limited to localhost for development; adjust in `backend/app/main.py` for production

## License

MIT License