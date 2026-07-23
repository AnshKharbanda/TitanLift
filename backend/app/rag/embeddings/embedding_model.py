from langchain_huggingface import HuggingFaceEmbeddings


class EmbeddingModel:
    """
    Wrapper around the embedding model used by the RAG pipeline.
    """

    def __init__(
        self,
        model_name: str = "BAAI/bge-small-en-v1.5"
    ):
        self.model = HuggingFaceEmbeddings(
            model_name=model_name,
            encode_kwargs={
                "normalize_embeddings": True
            }
        )

    def get_model(self) -> HuggingFaceEmbeddings:
        return self.model