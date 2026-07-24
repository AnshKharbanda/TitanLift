import pickle
from pathlib import Path

from langchain_core.documents import Document

from app.rag.preprocessing.cleaner import DocumentCleaner
from app.rag.chunking.recursive_chunker import RecursiveChunker
from app.rag.vector_store.faiss_store import FAISSStore


class IngestionPipeline:

    def __init__(
        self,
        cleaner: DocumentCleaner,
        chunker: RecursiveChunker,
        vector_store: FAISSStore
    ):
        self.cleaner = cleaner
        self.chunker = chunker
        self.vector_store = vector_store

    def run(
        self,
        documents: list[Document],
        index_path: str,
        chunks_path: str
    ) -> list[Document]:

        if not documents:
            raise ValueError("No documents provided for ingestion.")

        # 1. Clean
        cleaned_documents = self.cleaner.clean(documents)

        # 2. Chunk
        chunks = self.chunker.chunk(cleaned_documents)

        if not chunks:
            raise ValueError("No chunks were produced.")

        # 3. Build dense FAISS index
        self.vector_store.build(chunks)

        # 4. Persist FAISS
        self.vector_store.save(index_path)

        # 5. Persist same chunks for BM25
        chunks_file = Path(chunks_path)
        chunks_file.parent.mkdir(parents=True, exist_ok=True)

        with chunks_file.open("wb") as file:
            pickle.dump(chunks, file)

        return chunks