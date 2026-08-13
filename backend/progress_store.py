import json
from pathlib import Path

PROGRESS_FILE = Path(__file__).parent / "student_progress.json"


def load_progress():
    if not PROGRESS_FILE.exists():
        return {}

    with open(PROGRESS_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def save_progress(data):
    with open(PROGRESS_FILE, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)


def get_progress(student_id: str, chapter_id: str):
    data = load_progress()
    key = f"{student_id}_{chapter_id}"

    return data.get(key, {
        "studentId": student_id,
        "chapterId": chapter_id,
        "completedTopics": [],
        "finalScore": 0,
        "finalPercentage": 0,
        "passed": False,
        "nextChapterUnlocked": False,
        "weakTopics": []
    })


def complete_topic(student_id: str, chapter_id: str, topic_id: str):
    data = load_progress()
    key = f"{student_id}_{chapter_id}"

    progress = data.get(key, {
        "studentId": student_id,
        "chapterId": chapter_id,
        "completedTopics": [],
        "finalScore": 0,
        "finalPercentage": 0,
        "passed": False,
        "nextChapterUnlocked": False,
        "weakTopics": []
    })

    if topic_id not in progress["completedTopics"]:
        progress["completedTopics"].append(topic_id)

    data[key] = progress
    save_progress(data)

    return progress


def save_test_result(
    student_id: str,
    chapter_id: str,
    correct: int,
    total: int,
    percentage: int,
    passed: bool,
    weak_topics: list
):
    data = load_progress()
    key = f"{student_id}_{chapter_id}"

    progress = data.get(key, {
        "studentId": student_id,
        "chapterId": chapter_id,
        "completedTopics": []
    })

    progress["finalScore"] = correct
    progress["totalQuestions"] = total
    progress["finalPercentage"] = percentage
    progress["passed"] = passed
    progress["nextChapterUnlocked"] = passed
    progress["weakTopics"] = weak_topics

    data[key] = progress
    save_progress(data)

    return progress