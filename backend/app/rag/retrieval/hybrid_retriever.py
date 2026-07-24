from langchain_core.documents import Document

from app.rag.retrieval.dense_retriever import DenseRetriever
from app.rag.retrieval.bm_25_retriever import BM25Retriever


class HybridRetriever:

    def __init__(
        self,
        dense_retriever: DenseRetriever,
        bm25_retriever: BM25Retriever,
        k: int = 5,
        rrf_k: int = 60
    ):
        self.dense_retriever = dense_retriever
        self.bm25_retriever = bm25_retriever
        self.k = k
        self.rrf_k = rrf_k

    def _document_id(self, document: Document) -> str:
        source = document.metadata.get("source", "")

        return f"{source}:{document.page_content}"

    def retrieve(self, query: str) -> list[Document]:

        dense_results = self.dense_retriever.retrieve(query)
        bm25_results = self.bm25_retriever.retrieve(query)

        scores = {}
        documents = {}

        # Dense results
        for rank, document in enumerate(dense_results, start=1):

            doc_id = self._document_id(document)

            documents[doc_id] = document

            scores[doc_id] = scores.get(doc_id, 0) + (
                1 / (self.rrf_k + rank)
            )

        # BM25 results
        for rank, document in enumerate(bm25_results, start=1):

            doc_id = self._document_id(document)

            documents[doc_id] = document

            scores[doc_id] = scores.get(doc_id, 0) + (
                1 / (self.rrf_k + rank)
            )

        # Rank by combined RRF score
        ranked_ids = sorted(
            scores,
            key=scores.get,
            reverse=True
        )

        # Return final top-k documents
        return [
            documents[doc_id]
            for doc_id in ranked_ids[:self.k]
        ]