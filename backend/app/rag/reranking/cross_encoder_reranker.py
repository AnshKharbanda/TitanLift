from sentence_transformers import CrossEncoder
from langchain_core.documents import Document


class CrossEncoderReranker:

    def __init__(
        self,
        model_name: str = "cross-encoder/ms-marco-MiniLM-L-6-v2",
        top_k: int = 5
    ):
        self.model = CrossEncoder(model_name)
        self.top_k = top_k

    def rerank(
        self,
        query: str,
        documents: list[Document]
    ) -> list[Document]:

        if not documents:
            return []

        # Create query-document pairs
        pairs = [
            [query, document.page_content]
            for document in documents
        ]

        # Cross-encoder gives a relevance score to each pair
        scores = self.model.predict(pairs)

        # Attach each document to its score
        scored_documents = list(zip(documents, scores))

        # Highest relevance score first
        scored_documents.sort(
            key=lambda item: item[1],
            reverse=True
        )

        # Return only the top-k documents
        return [
            document
            for document, score in scored_documents[:self.top_k]
        ]