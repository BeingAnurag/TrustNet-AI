# Script to generate answers for the dataset
import random


def generate_grounded(gold_answer: str):
    return gold_answer


def generate_partially_grounded(gold_answer: str):
    hallucinations = [
        "Germany",
        "London",
        "Einstein",
        "New York"
    ]
    return f"{gold_answer} and {random.choice(hallucinations)}"


def generate_hallucinated():
    hallucinations = [
        "Berlin",
        "Isaac Newton",
        "Tokyo",
        "Albert Einstein"
    ]
    return random.choice(hallucinations)
