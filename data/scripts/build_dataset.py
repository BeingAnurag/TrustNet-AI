# Script to build the TrustNet dataset
import json
from generate_answers import (
    generate_grounded,
    generate_partially_grounded,
    generate_hallucinated,
)

OUTPUT_PATH = "data/processed/trustnet_dataset.jsonl"


def build_dataset():
    with open("data/raw/squad_sample.json") as f:
        raw_data = json.load(f)

    samples = []

    for item in raw_data:
        q = item["question"]
        ctx = item["context"]
        gold = item["answer"]

        samples.append({
            "question": q,
            "context": ctx,
            "answer": generate_grounded(gold),
            "label": "grounded"
        })

        samples.append({
            "question": q,
            "context": ctx,
            "answer": generate_partially_grounded(gold),
            "label": "partially_grounded"
        })

        samples.append({
            "question": q,
            "context": ctx,
            "answer": generate_hallucinated(),
            "label": "hallucinated"
        })

    with open(OUTPUT_PATH, "w") as f:
        for s in samples:
            f.write(json.dumps(s) + "\n")


if __name__ == "__main__":
    build_dataset()
