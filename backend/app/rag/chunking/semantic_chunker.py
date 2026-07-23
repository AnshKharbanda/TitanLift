from langchain_experimental.text_splitter import SemanticChunker
from langchain_core.documents import Document

from app.rag.embeddings.embedding_model import EmbeddingModel


class SemanticDocumentChunker:
    """
    Splits documents based on semantic similarity between sentences.
    """

    def __init__(
        self,
        breakpoint_threshold_type: str = "percentile",
        breakpoint_threshold_amount: float = 80.0
    ):
        embedding_model = EmbeddingModel().get_model()

        self.splitter = SemanticChunker(
            embeddings=embedding_model,
            breakpoint_threshold_type=breakpoint_threshold_type,
            breakpoint_threshold_amount=breakpoint_threshold_amount
        )

    def chunk(self, documents: list[Document]) -> list[Document]:
        return self.splitter.split_documents(documents)