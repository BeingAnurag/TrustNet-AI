import streamlit as st
import requests

BACKEND_URL = "http://127.0.0.1:8000/evaluate"

st.set_page_config(page_title="TrustNet AI", layout="centered")

st.title("TrustNet AI — Hallucination Detection")

question = st.text_area("Question")
context = st.text_area("Context (Retrieved Documents)")
answer = st.text_area("LLM Generated Answer")

if st.button("Evaluate Answer"):
    payload = {
        "question": question,
        "context": context,
        "answer": answer,
    }

    response = requests.post(BACKEND_URL, json=payload)

    if response.status_code == 200:
        data = response.json()

        st.subheader("Evaluation Result")
        st.write(f"**Label:** {data['label']}")
        st.write(f"**Trust Score:** {data['trust_score'] * 100:.2f}%")

        st.subheader("Final Decision")
        st.write(f"**Action:** {data['decision'].upper()}")

        if data["decision"] == "show_with_warning":
            st.warning("⚠️ This answer may be partially hallucinated.")

        if data["decision"] == "flag":
            st.error("❌ This answer is likely hallucinated.")

        st.subheader("Signal Breakdown")
        for k, v in data["signals"].items():
            st.write(f"{k}: {v:.2f}")
    else:
        st.error("Backend error occurred")
