from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil

from rag_engine import RAGEngine
from evaluator import evaluate_answer
from answer_generator import generate_student_answer
from stt_engine import transcribe_audio

from database import (
    PASS_PERCENTAGE,
    init_db,
    seed_learning_data,
    create_user,
    login_user,
    initialize_student_progress,
    get_chapters,
    get_topics,
    get_study_materials,
    is_topic_unlocked,
    mark_topic_studied,
    get_topic_quiz,
    get_topic_quiz_with_answers,
    get_chapter_test,
    get_chapter_test_with_answers,
    keyword_score,
    save_topic_quiz_attempt,
    update_topic_progress_after_quiz,
    save_chapter_test_attempt,
    update_chapter_progress_after_test,
    save_result,
    get_results,
    get_connection,
    get_chapter_id_for_topic
)


app = FastAPI(title="Offline Physics Tutor Backend V2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount images and videos static files directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
image_dir = os.path.join(BASE_DIR, "images")
os.makedirs(image_dir, exist_ok=True)
app.mount("/images", StaticFiles(directory=image_dir), name="images")

video_dir = os.path.join(BASE_DIR, "data", "videos")
os.makedirs(video_dir, exist_ok=True)
app.mount("/videos", StaticFiles(directory=video_dir), name="videos")

init_db()
seed_learning_data()
rag = RAGEngine()


class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class AskRequest(BaseModel):
    question: str


class TopicDoubtRequest(BaseModel):
    student_id: int
    topic_id: int
    question: str


class MarkTopicStudiedRequest(BaseModel):
    student_id: int
    topic_id: int


class EvaluateRequest(BaseModel):
    student_name: str
    question: str
    student_answer: str


class StudentAnswerItem(BaseModel):
    question_id: int
    answer: str


class SubmitTopicQuizRequest(BaseModel):
    student_id: int
    topic_id: int
    answers: List[StudentAnswerItem]


class SubmitChapterTestRequest(BaseModel):
    student_id: int
    chapter_id: int
    answers: List[StudentAnswerItem]


class UpdateStudyMaterialContentRequest(BaseModel):
    topic_id: int
    content: str


class UpdateTopicQuizQuestionRequest(BaseModel):
    question_id: int
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    expected_answer: str
    marks: int


class UpdateChapterTestQuestionRequest(BaseModel):
    question_id: int
    question: str
    scenario_context: Optional[str] = ""
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    expected_answer: str
    marks: int
    bloom_level: str



def to_int(value):
    try:
        return int(value)
    except Exception:
        return 0


def get_topic_status_for_student(student_id: int, topic_id: int):
    """
    Finds topic progress/status for the logged-in student.
    Used to check:
    - topic unlocked or locked
    - topic studied or not
    - quiz passed or not
    """

    chapters_data = get_chapters(student_id)

    for chapter in chapters_data:
        chapter_id = chapter["id"]
        chapter_topics = get_topics(chapter_id, student_id)

        for topic in chapter_topics:
            if topic["id"] == topic_id:
                return topic

    return None


@app.get("/")
def home():
    return {
        "message": "Offline Physics Tutor Backend V2 is running",
        "pass_percentage": PASS_PERCENTAGE
    }


@app.post("/register")
def register(request: RegisterRequest):
    result = create_user(
        full_name=request.full_name,
        email=request.email,
        password=request.password
    )

    return result


@app.post("/login")
def login(request: LoginRequest):
    result = login_user(
        email=request.email,
        password=request.password
    )

    if result.get("success") and result.get("user"):
        initialize_student_progress(result["user"]["id"])

    return result


@app.get("/chapters")
def chapters(student_id: Optional[int] = None):
    return {
        "chapters": get_chapters(student_id)
    }


@app.get("/topics/{chapter_id}")
def topics(chapter_id: int, student_id: Optional[int] = None):
    return {
        "topics": get_topics(chapter_id, student_id)
    }


@app.get("/study-materials/{topic_id}")
def study_materials(topic_id: int, student_id: Optional[int] = None):
    materials = get_study_materials(topic_id)
    # Check media files and apply fallback if video doesn't exist
    for mat in materials:
        # Scan backend images directory for topic images
        images = []
        try:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT c.order_no as ch_order, t.order_no as top_order
                FROM topics t
                JOIN chapters c ON t.chapter_id = c.id
                WHERE t.id = ?
            """, (topic_id,))
            row = cursor.fetchone()
            conn.close()

            if row:
                ch_order = row["ch_order"]
                top_order = row["top_order"]
                topic_dir = os.path.join("images", f"Chapter_{ch_order}", f"topic{top_order}")
                if os.path.exists(topic_dir):
                    for f in sorted(os.listdir(topic_dir)):
                        if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
                            # Use forward slashes for static path routing
                            images.append(f"images/Chapter_{ch_order}/topic{top_order}/{f}")
        except Exception as e:
            print(f"Error scanning topic images: {e}")

        # Add images list to material dictionary
        mat["images"] = images

        # Keep legacy video fallback logic
        video_path = mat.get("video_path")
        if video_path and video_path.lower().endswith(".mp4"):
            frontend_video = os.path.join("..", "frontend", video_path)
            if not os.path.exists(frontend_video):
                filename = os.path.basename(video_path).replace(".mp4", ".png")
                fallback_image = f"images/{filename}"
                mat["video_path"] = fallback_image

    return {
        "success": True,
        "materials": materials
    }


@app.post("/mark-topic-studied")
def mark_studied(request: MarkTopicStudiedRequest):
    if not is_topic_unlocked(request.student_id, request.topic_id):
        return {
            "success": False,
            "message": "This topic is locked. You cannot mark it as studied."
        }

    return mark_topic_studied(request.student_id, request.topic_id)


@app.post("/ask")
def ask_question(request: AskRequest):
    retrieved_content = rag.retrieve(request.question, top_k=3)

    return {
        "question": request.question,
        "retrieved_content": retrieved_content
    }


@app.post("/ask-answer")
def ask_answer(request: AskRequest):
    retrieved_content = rag.retrieve(request.question, top_k=3)

    student_friendly_answer = generate_student_answer(
        question=request.question,
        retrieved_context=retrieved_content
    )

    return {
        "question": request.question,
        "answer": student_friendly_answer,
        "sources": [
            {
                "page": item["page"],
                "chunk_id": item["chunk_id"],
                "distance": item.get("distance")
            }
            for item in retrieved_content
        ]
    }


@app.post("/ask-doubt")
def ask_doubt(request: TopicDoubtRequest):
    if not is_topic_unlocked(request.student_id, request.topic_id):
        return {
            "success": False,
            "message": "This topic is locked. You cannot ask doubts for locked topics."
        }

    # Find which chapter this topic belongs to, so we search only that chapter's textbook
    chapter_id = get_chapter_id_for_topic(request.topic_id)

    retrieved_content = rag.retrieve(request.question, top_k=3, chapter_id=chapter_id)

    answer = generate_student_answer(
        question=request.question,
        retrieved_context=retrieved_content
    )

    return {
        "success": True,
        "topic_id": request.topic_id,
        "chapter_id": chapter_id,
        "question": request.question,
        "answer": answer,
        "sources": [
            {
                "page": item["page"],
                "chunk_id": item["chunk_id"]
            }
            for item in retrieved_content
        ]
    }


@app.post("/transcribe-audio")
async def transcribe_audio_endpoint(audio: UploadFile = File(...)):
    """
    Accepts an audio file recorded offline by the browser's MediaRecorder
    and returns the transcribed text using the local Whisper tiny.en model.
    Runs 100% offline on the CPU — no internet required.
    """
    # Determine the file extension from the uploaded filename (e.g. webm, wav, ogg)
    filename = audio.filename or "audio.webm"
    ext = filename.rsplit(".", 1)[-1] if "." in filename else "webm"

    audio_bytes = await audio.read()

    if not audio_bytes:
        raise HTTPException(status_code=400, detail="Empty audio file received.")

    text = transcribe_audio(audio_bytes, file_extension=ext)

    return {
        "success": True,
        "text": text
    }


@app.get("/topic-quiz/{topic_id}")
def topic_quiz(topic_id: int, student_id: Optional[int] = None):
    """
    Quiz unlock rule:

    Student can load topic quiz only if:
    1. Topic is unlocked
    2. Student clicked "I Completed This Topic"
    """

    if student_id is not None:
        if not is_topic_unlocked(student_id, topic_id):
            return {
                "success": False,
                "message": "This topic quiz is locked. Pass the previous topic quiz first.",
                "questions": []
            }

        topic_status = get_topic_status_for_student(student_id, topic_id)

        if topic_status and to_int(topic_status.get("is_studied")) != 1:
            return {
                "success": False,
                "message": "Complete the study material first. Click 'I Completed This Topic' to unlock the quiz.",
                "questions": []
            }

    return {
        "success": True,
        "pass_percentage": PASS_PERCENTAGE,
        "questions": get_topic_quiz(topic_id)
    }


@app.post("/submit-topic-quiz")
def submit_topic_quiz(request: SubmitTopicQuizRequest):
    """
    Submit quiz rule:

    Student can submit quiz only if:
    1. Topic is unlocked
    2. Topic is marked as studied
    """

    if not is_topic_unlocked(request.student_id, request.topic_id):
        return {
            "success": False,
            "message": "This topic is locked. You cannot submit quiz.",
            "total_marks": 0,
            "obtained_marks": 0,
            "percentage": 0,
            "passed": False,
            "details": []
        }

    topic_status = get_topic_status_for_student(
        student_id=request.student_id,
        topic_id=request.topic_id
    )

    if topic_status and to_int(topic_status.get("is_studied")) != 1:
        return {
            "success": False,
            "message": "Complete the study material first before submitting quiz.",
            "total_marks": 0,
            "obtained_marks": 0,
            "percentage": 0,
            "passed": False,
            "details": []
        }

    questions = get_topic_quiz_with_answers(request.topic_id)
    answer_map = {item.question_id: item.answer for item in request.answers}

    total_marks = 0
    obtained_marks = 0
    details = []

    for question in questions:
        qid = question["id"]
        student_answer = answer_map.get(qid, "").strip()
        marks = question["marks"]
        total_marks += marks

        question_type = question["question_type"]
        score = 0

        if question_type in ["mcq", "true_false"]:
            if student_answer.upper() == (question["correct_option"] or "").upper():
                score = marks

        elif question_type in ["fill_blank", "short_answer"]:
            score = keyword_score(
                student_answer=student_answer,
                expected_answer=question["expected_answer"] or "",
                marks=marks
            )

        obtained_marks += score

        details.append({
            "question_id": qid,
            "question": question["question"],
            "student_answer": student_answer,
            "correct_answer": question["correct_option"] if question_type in ["mcq", "true_false"] else question["expected_answer"],
            "obtained_marks": score,
            "marks": marks
        })

    percentage = round((obtained_marks / total_marks) * 100, 2) if total_marks else 0
    passed = percentage >= PASS_PERCENTAGE

    save_topic_quiz_attempt(
        student_id=request.student_id,
        topic_id=request.topic_id,
        total_marks=total_marks,
        obtained_marks=obtained_marks,
        percentage=percentage,
        passed=passed
    )

    update_topic_progress_after_quiz(
        student_id=request.student_id,
        topic_id=request.topic_id,
        percentage=percentage,
        passed=passed
    )

    return {
        "success": True,
        "total_marks": total_marks,
        "obtained_marks": obtained_marks,
        "percentage": percentage,
        "passed": passed,
        "message": "Passed. Next topic unlocked." if passed else "Failed. Please revise this topic and retry.",
        "details": details
    }


@app.get("/chapter-test/{chapter_id}")
def chapter_test(chapter_id: int, student_id: Optional[int] = None):
    if student_id is not None:
        chapters_data = get_chapters(student_id)

        chapter_status = None

        for ch in chapters_data:
            if ch["id"] == chapter_id:
                chapter_status = ch
                break

        if chapter_status and to_int(chapter_status.get("final_test_unlocked")) != 1:
            return {
                "success": False,
                "message": "Final chapter test is locked. Pass all topic quizzes first.",
                "questions": []
            }

    return {
        "success": True,
        "pass_percentage": PASS_PERCENTAGE,
        "questions": get_chapter_test(chapter_id)
    }


@app.post("/submit-chapter-test")
def submit_chapter_test(request: SubmitChapterTestRequest):
    questions = get_chapter_test_with_answers(request.chapter_id)
    answer_map = {item.question_id: item.answer for item in request.answers}

    total_marks = 0
    obtained_marks = 0
    details = []

    for question in questions:
        qid = question["id"]
        student_answer = answer_map.get(qid, "").strip()
        marks = question["marks"]
        total_marks += marks

        question_type = question["question_type"]
        score = 0
        feedback = ""

        if question_type == "mcq":
            if student_answer.upper() == (question["correct_option"] or "").upper():
                score = marks
                feedback = "Correct answer."
            else:
                feedback = "Wrong answer. Revise this concept."

        else:
            score = keyword_score(
                student_answer=student_answer,
                expected_answer=question["expected_answer"] or "",
                marks=marks
            )

            retrieved_content = rag.retrieve(question["question"], top_k=3)

            feedback = evaluate_answer(
                question=question["question"],
                student_answer=student_answer,
                retrieved_context=retrieved_content
            )

            # Get student name and save to results table for Evaluation History
            try:
                conn_user = get_connection()
                cur_user = conn_user.cursor()
                cur_user.execute("SELECT full_name FROM users WHERE id = ?", (request.student_id,))
                user_row = cur_user.fetchone()
                conn_user.close()
                st_name = user_row["full_name"] if user_row else f"Student #{request.student_id}"
                
                save_result(
                    student_name=st_name,
                    question=question["question"],
                    student_answer=student_answer if student_answer else "[No answer provided]",
                    evaluation=feedback
                )
            except Exception as ex:
                print(f"Failed to record evaluation history: {ex}")

        obtained_marks += score

        details.append({
            "question_id": qid,
            "question_type": question_type,
            "question": question["question"],
            "student_answer": student_answer,
            "expected_answer": question["expected_answer"],
            "obtained_marks": score,
            "marks": marks,
            "feedback": feedback
        })

    percentage = round((obtained_marks / total_marks) * 100, 2) if total_marks else 0
    passed = percentage >= PASS_PERCENTAGE

    save_chapter_test_attempt(
        student_id=request.student_id,
        chapter_id=request.chapter_id,
        total_marks=total_marks,
        obtained_marks=obtained_marks,
        percentage=percentage,
        passed=passed
    )

    update_chapter_progress_after_test(
        student_id=request.student_id,
        chapter_id=request.chapter_id,
        percentage=percentage,
        passed=passed
    )

    return {
        "success": True,
        "total_marks": total_marks,
        "obtained_marks": obtained_marks,
        "percentage": percentage,
        "passed": passed,
        "message": "Final chapter test passed. Next chapter unlocked." if passed else "Final test failed. Revise weak areas and retry.",
        "details": details
    }


@app.get("/progress/{student_id}")
def progress(student_id: int):
    chapters_data = get_chapters(student_id)

    full_progress = []

    for chapter in chapters_data:
        chapter_id = chapter["id"]
        chapter_topics = get_topics(chapter_id, student_id)

        completed_topics = sum(1 for topic in chapter_topics if to_int(topic.get("is_completed")) == 1)
        studied_topics = sum(1 for topic in chapter_topics if to_int(topic.get("is_studied")) == 1)
        unlocked_topics = sum(1 for topic in chapter_topics if to_int(topic.get("is_unlocked")) == 1)

        total_topics = len(chapter_topics)
        progress_percentage = round((completed_topics / total_topics) * 100, 2) if total_topics else 0

        full_progress.append({
            "chapter": chapter,
            "topics": chapter_topics,
            "completed_topics": completed_topics,
            "studied_topics": studied_topics,
            "unlocked_topics": unlocked_topics,
            "total_topics": total_topics,
            "progress_percentage": progress_percentage
        })

    return {
        "student_id": student_id,
        "progress": full_progress
    }


@app.post("/evaluate")
def evaluate(request: EvaluateRequest):
    retrieved_content = rag.retrieve(request.question, top_k=3)

    evaluation = evaluate_answer(
        question=request.question,
        student_answer=request.student_answer,
        retrieved_context=retrieved_content
    )

    save_result(
        student_name=request.student_name,
        question=request.question,
        student_answer=request.student_answer,
        evaluation=evaluation
    )

    return {
        "student_name": request.student_name,
        "question": request.question,
        "student_answer": request.student_answer,
        "evaluation": evaluation,
        "retrieved_pages": [item["page"] for item in retrieved_content]
    }


@app.get("/results")
def results():
    return {
        "results": get_results()
    }


class AdminLoginRequest(BaseModel):
    username: str
    password: str


class UpdateReferenceUrlRequest(BaseModel):
    topic_id: int
    reference_url: str


class UpdateTopicVideoRequest(BaseModel):
    topic_id: int
    video_path: str


@app.post("/admin/login")
def admin_login(request: AdminLoginRequest):
    from database import login_admin
    result = login_admin(request.username, request.password)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("message"))
    return result


@app.post("/admin/upload-study-material")
def upload_study_material(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".docx"):
        raise HTTPException(status_code=400, detail="Only .docx files are allowed.")

    os.makedirs("data", exist_ok=True)
    temp_path = os.path.join("data", "study_materials_temp.docx")
    dest_path = os.path.join("data", "study_materials.docx")

    try:
        # Save to temp file
        with open(temp_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Validate docx structure
        from docx_loader import extract_topics_from_docx
        topics = extract_topics_from_docx(temp_path)
        if not topics:
            if os.path.exists(temp_path):
                os.remove(temp_path)
            raise HTTPException(status_code=400, detail="No topics found in Word document. Use heading format: Topic 1: Topic Name")

        # Swap files
        if os.path.exists(dest_path):
            os.remove(dest_path)
        os.rename(temp_path, dest_path)

        # Reload database & seed data
        from database import reload_study_materials_from_docx
        reload_study_materials_from_docx()

        return {
            "success": True,
            "message": "Study materials DOCX uploaded and curriculum reseeded successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise HTTPException(status_code=500, detail=f"Failed to process DOCX: {str(e)}")


@app.post("/admin/upload-textbook")
def upload_textbook(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only .pdf files are allowed.")

    os.makedirs("data/pdfs", exist_ok=True)
    dest_path = os.path.join("data", "textbook.pdf")
    ch1_path = os.path.join("data", "pdfs", "chapter1.pdf")

    try:
        with open(dest_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        shutil.copy(dest_path, ch1_path)
        return {
            "success": True,
            "message": "Textbook PDF uploaded successfully."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save PDF: {str(e)}")

@app.post("/admin/upload-chapter-study-material/{chapter_id}")
def upload_chapter_study_material(chapter_id: int, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".docx"):
        raise HTTPException(status_code=400, detail="Only .docx files are allowed.")

    os.makedirs("data/chapters", exist_ok=True)
    dest_path = os.path.join("data", "chapters", f"chapter{chapter_id}_study_materials.docx")

    try:
        with open(dest_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Validate docx structure
        from docx_loader import extract_topics_from_docx
        topics = extract_topics_from_docx(dest_path)
        if not topics:
            if os.path.exists(dest_path):
                os.remove(dest_path)
            raise HTTPException(status_code=400, detail="No topics found in Word document. Use heading format: Topic 1: Topic Name")

        # Reload database topics for that chapter
        from database import reload_study_materials_for_chapter
        reload_study_materials_for_chapter(chapter_id, dest_path)

        return {
            "success": True,
            "message": f"Study materials DOCX uploaded and curriculum reseeded for Chapter {chapter_id} successfully."
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process DOCX: {str(e)}")

@app.post("/admin/upload-chapter-pdf/{chapter_id}")
def upload_chapter_pdf(chapter_id: int, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only .pdf files are allowed.")

    os.makedirs("data/pdfs", exist_ok=True)
    dest_path = os.path.join("data", "pdfs", f"chapter{chapter_id}.pdf")

    try:
        with open(dest_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        return {
            "success": True,
            "message": f"Chapter {chapter_id} PDF uploaded successfully."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save PDF: {str(e)}")

def extract_pdf_text(pdf_path):
    pages = []
    # Try pypdf first
    try:
        from pypdf import PdfReader
        reader = PdfReader(pdf_path)
        for page_number, page in enumerate(reader.pages, start=1):
            text = page.extract_text()
            if text and text.strip():
                pages.append({
                    "page": page_number,
                    "text": text
                })
        if pages:
            return pages
    except Exception as e:
        print(f"pypdf extraction failed or not installed for {pdf_path}: {e}")

    # Fallback to fitz (pymupdf)
    try:
        import fitz
        doc = fitz.open(pdf_path)
        for page_number, page in enumerate(doc, start=1):
            text = page.get_text()
            if text and text.strip():
                pages.append({
                    "page": page_number,
                    "text": text
                })
        return pages
    except Exception as e:
        print(f"fitz extraction failed for {pdf_path}: {e}")
        
    return pages

def chunk_text(pages, chapter_id, chapter_title, chunk_size=700, overlap=100):
    chunks = []
    for page in pages:
        text = page["text"]
        words = text.split()

        start = 0
        while start < len(words):
            end = start + chunk_size
            chunk_words = words[start:end]
            chunk_text = " ".join(chunk_words)

            chunks.append({
                "page": page["page"],
                "chapter_id": chapter_id,
                "chapter_title": chapter_title,
                "text": chunk_text
            })

            start += chunk_size - overlap

    return chunks

def build_faiss_index_for_chunks(chunks):
    from sentence_transformers import SentenceTransformer
    import faiss
    import numpy as np

    model = SentenceTransformer("all-MiniLM-L6-v2")
    texts = [chunk["text"] for chunk in chunks]

    print("Creating embeddings for RAG...")
    embeddings = model.encode(texts, show_progress_bar=False)
    embeddings = np.array(embeddings).astype("float32")

    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    return index

@app.post("/admin/rebuild-rag-index")
def rebuild_rag_index():
    import faiss
    import json
    
    pdf_dir = os.path.join("data", "pdfs")
    os.makedirs(pdf_dir, exist_ok=True)
    ch1_path = os.path.join(pdf_dir, "chapter1.pdf")
    old_textbook = os.path.join("data", "textbook.pdf")
    if not os.path.exists(ch1_path) and os.path.exists(old_textbook):
        shutil.copy(old_textbook, ch1_path)

    pdf_files = [f for f in os.listdir(pdf_dir) if f.lower().endswith(".pdf")]
    if not pdf_files:
        raise HTTPException(status_code=400, detail="No PDF files found in data/pdfs/ directory.")

    all_chunks = []
    
    from database import get_chapters
    chapters_data = get_chapters()
    chapter_title_map = {ch["order_no"]: ch["title"] for ch in chapters_data}

    for filename in pdf_files:
        chapter_id = 1
        name_lower = filename.lower()
        if "chapter" in name_lower:
            parts = name_lower.split("chapter")
            if len(parts) > 1:
                digits = ""
                for char in parts[1]:
                    if char.isdigit():
                        digits += char
                    else:
                        break
                if digits:
                    chapter_id = int(digits)
        
        chapter_title = chapter_title_map.get(chapter_id, f"Chapter {chapter_id}")
        pdf_path = os.path.join(pdf_dir, filename)
        
        pages = extract_pdf_text(pdf_path)
        if not pages:
            continue
            
        chunks = chunk_text(pages, chapter_id, chapter_title)
        all_chunks.extend(chunks)

    if not all_chunks:
        raise HTTPException(status_code=400, detail="No text could be extracted from the PDF files.")

    for idx, chunk in enumerate(all_chunks):
        chunk["chunk_id"] = idx

    try:
        index = build_faiss_index_for_chunks(all_chunks)
        
        os.makedirs("storage", exist_ok=True)
        faiss.write_index(index, "storage/faiss_index.bin")
        
        with open("storage/chunks.json", "w", encoding="utf-8") as f:
            json.dump(all_chunks, f, indent=4, ensure_ascii=False)

        global rag
        rag = RAGEngine()

        return {
            "success": True,
            "message": f"RAG search index rebuilt successfully from {len(pdf_files)} PDFs ({len(all_chunks)} chunks total)."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to rebuild RAG index: {str(e)}")


@app.get("/admin/topics")
def admin_topics():
    from database import get_admin_topics
    try:
        topics_list = get_admin_topics()
        return {
            "success": True,
            "topics": topics_list
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/admin/study-materials/{topic_id}")
def admin_study_materials(topic_id: int):
    from database import get_study_materials
    try:
        materials = get_study_materials(topic_id)
        return {
            "success": True,
            "materials": materials
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/admin/update-reference-url")
def admin_update_reference_url(request: UpdateReferenceUrlRequest):
    from database import update_reference_url
    try:
        result = update_reference_url(request.topic_id, request.reference_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/admin/update-topic-video")
def admin_update_topic_video(request: UpdateTopicVideoRequest):
    from database import update_topic_video_path
    try:
        result = update_topic_video_path(request.topic_id, request.video_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/admin/upload-topic-video/{topic_id}")
def admin_upload_topic_video(topic_id: int, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".mp4"):
        raise HTTPException(status_code=400, detail="Only .mp4 videos are allowed.")

    from database import update_topic_video_path
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT chapter_id, order_no FROM topics WHERE id = ?", (topic_id,))
    topic_row = cursor.fetchone()
    conn.close()

    if not topic_row:
        raise HTTPException(status_code=404, detail="Topic not found.")

    chapter_id = topic_row["chapter_id"]
    order_no = topic_row["order_no"]

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT order_no FROM chapters WHERE id = ?", (chapter_id,))
    ch_row = cursor.fetchone()
    conn.close()
    ch_order = ch_row["order_no"] if ch_row else 1

    os.makedirs("../frontend/videos", exist_ok=True)
    video_filename = f"chapter{ch_order}_topic{order_no}.mp4"
    dest_path = os.path.join("../frontend/videos", video_filename)
    db_video_path = f"videos/{video_filename}"

    try:
        with open(dest_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        update_topic_video_path(topic_id, db_video_path)

        return {
            "success": True,
            "message": "Video uploaded and linked successfully.",
            "video_path": db_video_path
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload video: {str(e)}")


@app.get("/admin/student-progress")
def admin_student_progress():
    from database import get_all_student_progress
    try:
        progress_data = get_all_student_progress()
        return {
            "success": True,
            "progress": progress_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/admin/delete-student/{student_id}")
def admin_delete_student(student_id: int):
    from database import delete_student_by_id
    try:
        result = delete_student_by_id(student_id)
        if result.get("success"):
            return result
        else:
            raise HTTPException(status_code=400, detail=result.get("message"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/admin/topic-quiz/{topic_id}")
def admin_topic_quiz(topic_id: int):
    from database import get_topic_quiz_with_answers
    try:
        questions = get_topic_quiz_with_answers(topic_id)
        return {
            "success": True,
            "questions": questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/admin/chapter-test/{chapter_id}")
def admin_chapter_test(chapter_id: int):
    from database import get_chapter_test_with_answers
    try:
        questions = get_chapter_test_with_answers(chapter_id)
        return {
            "success": True,
            "questions": questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/admin/update-study-material-content")
def admin_update_study_material_content(request: UpdateStudyMaterialContentRequest):
    from database import update_study_material_content
    try:
        result = update_study_material_content(request.topic_id, request.content)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/admin/update-topic-quiz-question")
def admin_update_topic_quiz_question(request: UpdateTopicQuizQuestionRequest):
    from database import update_topic_quiz_question
    try:
        result = update_topic_quiz_question(
            question_id=request.question_id,
            question=request.question,
            option_a=request.option_a,
            option_b=request.option_b,
            option_c=request.option_c,
            option_d=request.option_d,
            correct_option=request.correct_option,
            expected_answer=request.expected_answer,
            marks=request.marks
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/admin/update-chapter-test-question")
def admin_update_chapter_test_question(request: UpdateChapterTestQuestionRequest):
    from database import update_chapter_test_question
    try:
        result = update_chapter_test_question(
            question_id=request.question_id,
            question=request.question,
            scenario_context=request.scenario_context,
            option_a=request.option_a,
            option_b=request.option_b,
            option_c=request.option_c,
            option_d=request.option_d,
            correct_option=request.correct_option,
            expected_answer=request.expected_answer,
            marks=request.marks,
            bloom_level=request.bloom_level
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/admin/results")
def admin_results():
    from database import get_results
    try:
        data = get_results()
        return {
            "success": True,
            "results": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))