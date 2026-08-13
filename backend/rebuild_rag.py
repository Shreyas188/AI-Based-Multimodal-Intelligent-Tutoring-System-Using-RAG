import sys
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

import fitz
import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
from database import get_chapters

print("Step 1: Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")


def extract_pdf_text(pdf_path):
    pages = []
    doc = fitz.open(pdf_path)
    for page_number, page in enumerate(doc, start=1):
        text = page.get_text()
        if text and text.strip():
            pages.append({"page": page_number, "text": text})
    return pages


def chunk_text(pages, chapter_id, chapter_title, chunk_size=700, overlap=100):
    chunks = []
    for page in pages:
        words = page["text"].split()
        start = 0
        while start < len(words):
            end = start + chunk_size
            chunk_words = words[start:end]
            chunks.append({
                "page": page["page"],
                "chapter_id": chapter_id,
                "chapter_title": chapter_title,
                "text": " ".join(chunk_words)
            })
            start += chunk_size - overlap
    return chunks


chapters_data = get_chapters()
chapter_title_map = {ch["order_no"]: ch["title"] for ch in chapters_data}
print("Chapters found:", chapter_title_map)

pdf_dir = "data/pdfs"
pdf_files = sorted([f for f in os.listdir(pdf_dir) if f.lower().endswith(".pdf")])
print("PDFs found:", pdf_files)

all_chunks = []

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
    print(f"\nProcessing: {filename}  ->  Chapter {chapter_id}: {chapter_title}")

    pages = extract_pdf_text(os.path.join(pdf_dir, filename))
    print(f"  Pages extracted: {len(pages)}")

    chunks = chunk_text(pages, chapter_id, chapter_title)
    print(f"  Chunks created: {len(chunks)}")

    all_chunks.extend(chunks)

for idx, chunk in enumerate(all_chunks):
    chunk["chunk_id"] = idx

print(f"\nStep 2: Total chunks from all chapters: {len(all_chunks)}")
print("Step 3: Creating embeddings - this may take a minute or two...")

texts = [c["text"] for c in all_chunks]
embeddings = model.encode(texts, show_progress_bar=True)
embeddings = np.array(embeddings).astype("float32")

dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

os.makedirs("storage", exist_ok=True)
faiss.write_index(index, "storage/faiss_index.bin")

with open("storage/chunks.json", "w", encoding="utf-8") as f:
    json.dump(all_chunks, f, indent=4, ensure_ascii=False)

ch1_count = sum(1 for c in all_chunks if c["chapter_id"] == 1)
ch2_count = sum(1 for c in all_chunks if c["chapter_id"] == 2)

print("\n=============================")
print("RAG index rebuilt successfully!")
print(f"  Chapter 1 chunks: {ch1_count}")
print(f"  Chapter 2 chunks: {ch2_count}")
print(f"  Total chunks    : {len(all_chunks)}")
print("=============================")
