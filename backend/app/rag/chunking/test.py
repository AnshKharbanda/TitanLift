from langchain_core.documents import Document

from app.rag.chunking.recursive_chunker import RecursiveChunker
from app.rag.chunking.semantic_chunker import SemanticDocumentChunker


documents = [
    Document(
        page_content="""
        Protein intake plays an important role in muscle growth.
        Resistance-trained athletes may require higher protein intake.
        Protein also supports recovery after resistance training.

        Carbohydrates are the body's major fuel source during intense exercise.
        Muscle glycogen can influence training performance.
        Athletes need sufficient carbohydrates to support demanding workouts.

        Sleep is important for recovery.
        Poor sleep can negatively affect strength and athletic performance.
        """,
        metadata={"source": "test"}
    )
]


# Recursive
recursive = RecursiveChunker(
    chunk_size=200,
    chunk_overlap=30
)

recursive_chunks = recursive.chunk(documents)


# Semantic
semantic = SemanticDocumentChunker()

semantic_chunks = semantic.chunk(documents)


print("\n===== RECURSIVE =====")

for i, chunk in enumerate(recursive_chunks):
    print(f"\nChunk {i + 1}:")
    print(chunk.page_content)


print("\n===== SEMANTIC =====")

for i, chunk in enumerate(semantic_chunks):
    print(f"\nChunk {i + 1}:")
    print(chunk.page_content)