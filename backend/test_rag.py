from rag_engine import RAGEngine


rag = RAGEngine()

query = "What is Coulomb's law?"

results = rag.retrieve(query, top_k=3)

print("\nQUESTION:")
print(query)

print("\nRETRIEVED RESULTS:")

for i, item in enumerate(results, start=1):
    print("\n-----------------------------")
    print(f"Result {i}")
    print("Chunk ID:", item["chunk_id"])
    print("Page:", item["page"])
    print("Distance:", item["distance"])
    print("Text Preview:")
    print(item["text"][:800])