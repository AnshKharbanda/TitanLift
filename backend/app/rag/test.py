from app.rag.build_pipeline import build_rag_pipeline


def main():

    # Build complete RAG pipeline
    pipeline = build_rag_pipeline(
        index_path="app/rag/data/storage/faiss_index",
        chunks_path="app/rag/data/storage/chunks.pkl"
    )

    # Test query
    query = "how does protein intake affect muscle growth?"

    print("\n===== QUESTION =====")
    print(query)

    # Run complete RAG pipeline
    answer = pipeline.run(query)

    print("\n===== TITANLIFT ANSWER =====")
    print(answer)


if __name__ == "__main__":
    main()