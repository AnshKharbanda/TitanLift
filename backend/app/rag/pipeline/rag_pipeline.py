from app.rag.query.query_rewriter import QueryRewriter
from app.rag.retrieval.hybrid_retriever import HybridRetriever
from app.rag.reranking.cross_encoder_reranker import CrossEncoderReranker
from app.rag.context.context_builder import ContextBuilder
from app.rag.generation.rag_generator import RAGGenerator


class RAGPipeline:

    def __init__(
        self,
        query_rewriter: QueryRewriter,
        retriever: HybridRetriever,
        reranker: CrossEncoderReranker,
        context_builder: ContextBuilder,
        generator: RAGGenerator
    ):
        self.query_rewriter = query_rewriter
        self.retriever = retriever
        self.reranker = reranker
        self.context_builder = context_builder
        self.generator = generator

    def run(self, query: str) -> str:

        if not query.strip():
            raise ValueError("Query cannot be empty.")

        # 1. Rewrite query for better retrieval
        rewritten_query = self.query_rewriter.rewrite(query)

        # 2. Hybrid retrieval
        retrieved_documents = self.retriever.retrieve(
            rewritten_query
        )

        # 3. Rerank retrieved candidates
        reranked_documents = self.reranker.rerank(
            rewritten_query,
            retrieved_documents
        )

        # 4. Construct LLM context
        context = self.context_builder.build(
            reranked_documents
        )

        # 5. Generate answer using ORIGINAL user query
        answer = self.generator.generate(
            query=query,
            context=context
        )

        return answer