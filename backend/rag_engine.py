import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer


# Paths of saved chunks and FAISS index
CHUNKS_PATH = "storage/chunks.json"
INDEX_PATH = "storage/faiss_index.bin"

# Same embedding model used in ingest_pdf.py
model = SentenceTransformer("all-MiniLM-L6-v2")


class RAGEngine:
    def __init__(self):
        print("Loading FAISS index...")
        self.index = faiss.read_index(INDEX_PATH)

        print("Loading textbook chunks...")
        with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
            self.chunks = json.load(f)

        print("RAG Engine loaded successfully.")

    def retrieve(self, query, top_k=3, chapter_id=None):
        """
        This function takes a user question,
        converts it into embedding,
        searches FAISS,
        and returns the most relevant textbook chunks.

        If chapter_id is provided, only chunks from that chapter are searched.
        This ensures doubts asked in Chapter 1 only get answers from Chapter 1,
        and doubts asked in Chapter 2 only get answers from Chapter 2.
        """

        # Convert question into embedding
        query_embedding = model.encode([query])
        query_embedding = np.array(query_embedding).astype("float32")

        # If chapter_id is given, filter chunks to only that chapter
        if chapter_id is not None:
            filtered_chunks = [
                (original_idx, chunk)
                for original_idx, chunk in enumerate(self.chunks)
                if chunk.get("chapter_id") == chapter_id
            ]

            if not filtered_chunks:
                # Fallback: search all chunks if no chunks found for chapter
                print(f"Warning: No chunks found for chapter_id={chapter_id}. Searching all chunks.")
                filtered_chunks = list(enumerate(self.chunks))

            # Build a temporary in-memory FAISS index for this chapter only
            texts = [chunk["text"] for _, chunk in filtered_chunks]
            embeddings = model.encode(texts)
            embeddings = np.array(embeddings).astype("float32")

            dimension = embeddings.shape[1]
            temp_index = faiss.IndexFlatL2(dimension)
            temp_index.add(embeddings)

            actual_top_k = min(top_k, len(filtered_chunks))
            distances, indices = temp_index.search(query_embedding, actual_top_k)

            results = []
            for local_idx, distance in zip(indices[0], distances[0]):
                if local_idx < len(filtered_chunks):
                    _, chunk = filtered_chunks[local_idx]
                    results.append({
                        "chunk_id": chunk.get("chunk_id", local_idx),
                        "page": chunk["page"],
                        "text": chunk["text"],
                        "distance": float(distance)
                    })

            return results

        # No chapter_id: search all chunks using the main FAISS index
        distances, indices = self.index.search(query_embedding, top_k)

        results = []
        for idx, distance in zip(indices[0], distances[0]):
            if idx < len(self.chunks):
                chunk = self.chunks[idx]
                results.append({
                    "chunk_id": chunk.get("chunk_id", idx),
                    "page": chunk["page"],
                    "text": chunk["text"],
                    "distance": float(distance)
                })

        return results