import requests


OLLAMA_URL = "http://127.0.0.1:11434/api/generate"
MODEL_NAME = "qwen2.5:1.5b"


def evaluate_answer(question, student_answer, retrieved_context):
    context_text = "\n\n".join([item["text"] for item in retrieved_context])

    prompt = f"""
You are a Class 12 Physics board exam evaluator.

Your task is to evaluate the student's answer.

IMPORTANT RULES:
1. Do not say phrases like "based on the textbook context", "according to the given context", or "from the textbook".
2. Feedback and Improved Answer must be different.
3. Feedback must talk about the student's submitted answer:
   - what is correct
   - what is incomplete
   - what mistake is present
   - what the student should improve
4. Improved Answer must be a corrected final answer that the student can write in the exam.
5. Keep the language simple and student-friendly.
6. Do not give unnecessary advanced explanation.
7. Use the reference content only for checking correctness.

Reference Content:
{context_text}

Question:
{question}

Student Answer:
{student_answer}

Evaluate the student answer and give response in this exact format:

Score: __ / 5

Correct Points:
- Mention the correct points present in the student's answer.

Missing Points:
- Mention important points missing from the student's answer.

Mistakes:
- Mention any wrong or unclear statement in the student's answer.
- If there is no mistake, write "No major mistake."

Feedback:
- Give direct feedback to the student about their own answer.
- Tell what is good and what they need to improve.
- Do not repeat the improved answer here.

Improved Answer:
Write a complete, corrected, exam-ready answer.
This should be what the student should write next time.
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

        # Calculate and log evaluation speed
        eval_count = data.get("eval_count", 0)
        eval_duration = data.get("eval_duration", 0)
        if eval_duration > 0:
            speed = eval_count / (eval_duration / 1e9)
            print(f"\n[AI Speed Log] Evaluated answer: {eval_count} tokens in {eval_duration / 1e9:.2f}s ({speed:.2f} tokens/second)\n")
        else:
            print("\n[AI Speed Log] Evaluation completed, speed metrics not available.\n")

        return data.get("response", "No response generated.")

    except Exception as e:
        return f"Evaluation failed. Make sure Ollama is running. Error: {str(e)}"