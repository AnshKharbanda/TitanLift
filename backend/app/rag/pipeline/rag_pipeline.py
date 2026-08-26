from app.rag.query.query_rewriter import QueryRewriter
from app.rag.retrieval.hybrid_retriever import HybridRetriever
from app.rag.reranking.cross_encoder_reranker import CrossEncoderReranker
from app.rag.context.context_builder import ContextBuilder
from app.rag.generation.rag_generator import RAGGenerator


class RAGPipeline:

    def __init__(
        self,
        query_rewriter,
        retriever,
        reranker,
        context_builder,
        generator,
    ):
        self.query_rewriter = query_rewriter
        self.retriever = retriever
        self.reranker = reranker
        self.context_builder = context_builder
        self.generator = generator


    def retrieve_context(
        self,
        query: str,
    ) -> str:

        if not query.strip():
            raise ValueError(
                "Query cannot be empty."
            )

        rewritten_query = (
            self.query_rewriter.rewrite(
                query
            )
        )

        retrieved_documents = (
            self.retriever.retrieve(
                rewritten_query
            )
        )

        reranked_documents = (
            self.reranker.rerank(
                rewritten_query,
                retrieved_documents,
            )
        )

        context = (
            self.context_builder.build(
                reranked_documents
            )
        )

        return context


    def generate(
        self,
        query: str,
        context: str,
    ) -> str:

        if not query.strip():
            raise ValueError(
                "Query cannot be empty."
            )

        return self.generator.generate(
            query=query,
            context=context,
        )


    def run(
        self,
        query: str,
    ) -> str:

        context = self.retrieve_context(
            query
        )

        return self.generate(
            query=query,
            context=context,
        )