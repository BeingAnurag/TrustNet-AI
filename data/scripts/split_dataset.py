# Script to split the dataset into train/val/test
import json
import random

INPUT_PATH = "data/processed/trustnet_dataset.jsonl"


def split_dataset():
    with open(INPUT_PATH) as f:
        data = [json.loads(line) for line in f]

    random.shuffle(data)

    n = len(data)
    train = data[:int(0.7 * n)]
    val = data[int(0.7 * n):int(0.85 * n)]
    test = data[int(0.85 * n):]

    splits = {
        "train": train,
        "val": val,
        "test": test,
    }

    for split, items in splits.items():
        with open(f"data/processed/{split}.jsonl", "w") as f:
            for item in items:
                f.write(json.dumps(item) + "\n")


if __name__ == "__main__":
    split_dataset()
