from rank_bm25 import BM25Okapi
from langchain_core.documents import Document


class BM25Retriever:

    def __init__(
        self,
        documents: list[Document],
        k: int = 5
    ):
        self.documents = documents
        self.k = k

        # Tokenize all document chunks
        self.tokenized_documents = [
            document.page_content.lower().split()
            for document in documents
        ]

        # Build BM25 index
        self.bm25 = BM25Okapi(self.tokenized_documents)

    def retrieve(self, query: str) -> list[Document]:

        # Tokenize query using the same strategy
        tokenized_query = query.lower().split()

        # Get BM25 relevance scores
        scores = self.bm25.get_scores(tokenized_query)

        # Sort document indices by score (highest first)
        ranked_indices = sorted(
            range(len(scores)),
            key=lambda i: scores[i],
            reverse=True
        )

        # Take top-k documents
        top_indices = ranked_indices[:self.k]

        return [
            self.documents[i]
            for i in top_indices
        ]