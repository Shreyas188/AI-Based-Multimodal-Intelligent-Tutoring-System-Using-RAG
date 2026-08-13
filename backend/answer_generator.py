import requests


OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
MODEL_NAME = "qwen2.5:1.5b"


def generate_student_answer(question, retrieved_context):
    context_text = "\n\n".join([item["text"] for item in retrieved_context])

    prompt = f"""
You are a friendly Class 12 Physics tutor.

Your job is to answer the student's exact doubt in simple language.

Important rules:
1. Answer only what the student asked.
2. Do not add Coulomb's law, formulas, symbols, or extra topics unless the student asks about them.
3. Do not write "based on the textbook" or "according to the context".
4. Keep the answer short and easy to understand.
5. If the student asks the meaning of a simple word, explain that word in the context of the topic.
6. If the doubt is related to the image/example, explain the example clearly.
7. Do not use markdown symbols like **, ##, ###, or LaTeX.
8. Use clean plain text only.

Reference Content:
{context_text}

Student Doubt:
{question}

Give the answer in this format:

Answer:
Write a simple direct answer in 3 to 6 lines.

Example:
Give one small example only if useful.

Remember:
Give one short memory point only if useful.
"""

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False
            },
            timeout=180
        )

        if response.status_code != 200:
            return f"Ollama error: {response.status_code} - {response.text}"

        data = response.json()
        
        # Calculate and log generation speed
        eval_count = data.get("eval_count", 0)
        eval_duration = data.get("eval_duration", 0)
        if eval_duration > 0:
            speed = eval_count / (eval_duration / 1e9)
            print(f"\n[AI Speed Log] Generated {eval_count} tokens in {eval_duration / 1e9:.2f}s ({speed:.2f} tokens/second)\n")
        else:
            print("\n[AI Speed Log] Generation completed, speed metrics not available.\n")

        answer = data.get("response", "No answer generated.")
        return clean_model_output(answer)

    except Exception as e:
        return f"Answer generation failed. Make sure Ollama is running. Error: {str(e)}"


def clean_model_output(text):
    replacements = {
        "**": "",
        "###": "",
        "##": "",
        "\\(": "",
        "\\)": "",
        "\\[": "",
        "\\]": "",
        "\\frac": "",
        "\\times": "×",
        "\\cdot": "×",
        "{": "",
        "}": "",
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    text = text.replace("q_1", "q1")
    text = text.replace("q_2", "q2")
    text = text.replace("r^2", "r²")

    return text.strip()