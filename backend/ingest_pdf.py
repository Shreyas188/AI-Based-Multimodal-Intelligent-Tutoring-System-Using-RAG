import fitz
import json
import os
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

PDF_PATH = "data/textbook.pdf"
STORAGE_DIR = "storage"
CHUNKS_PATH = os.path.join(STORAGE_DIR, "chunks.json")
INDEX_PATH = os.path.join(STORAGE_DIR, "faiss_index.bin")

os.makedirs(STORAGE_DIR, exist_ok=True)

model = SentenceTransformer("all-MiniLM-L6-v2")


def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    pages = []

    for page_number, page in enumerate(doc, start=1):
        text = page.get_text()
        if text.strip():
            pages.append({
                "page": page_number,
                "text": text
            })

    return pages


def chunk_text(pages, chunk_size=700, overlap=100):
    chunks = []
    chunk_id = 0

    for page in pages:
        text = page["text"]
        words = text.split()

        start = 0
        while start < len(words):
            end = start + chunk_size
            chunk_words = words[start:end]
            chunk_text = " ".join(chunk_words)

            chunks.append({
                "chunk_id": chunk_id,
                "page": page["page"],
                "text": chunk_text
            })

            chunk_id += 1
            start += chunk_size - overlap

    return chunks


def create_faiss_index(chunks):
    texts = [chunk["text"] for chunk in chunks]

    print("Creating embeddings...")
    embeddings = model.encode(texts, show_progress_bar=True)

    embeddings = np.array(embeddings).astype("float32")

    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings)

    return index


def main():
    print("Reading PDF...")
    pages = extract_text_from_pdf(PDF_PATH)

    print("Creating chunks...")
    chunks = chunk_text(pages)

    print(f"Total chunks created: {len(chunks)}")

    print("Creating FAISS index...")
    index = create_faiss_index(chunks)

    faiss.write_index(index, INDEX_PATH)

    with open(CHUNKS_PATH, "w", encoding="utf-8") as f:
        json.dump(chunks, f, indent=4, ensure_ascii=False)

    print("PDF ingestion completed successfully.")
    print("Saved FAISS index and chunks.")


if __name__ == "__main__":
    main()