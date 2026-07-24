import pickle

from app.rag.llm.ollama_llm import OllamaLLM
from app.rag.vector_store.faiss_store import FAISSStore

from app.rag.retrieval.dense_retriever import DenseRetriever
from app.rag.retrieval.bm_25_retriever import BM25Retriever
from app.rag.retrieval.hybrid_retriever import HybridRetriever

from app.rag.reranking.cross_encoder_reranker import CrossEncoderReranker

from app.rag.query.query_rewriter import QueryRewriter
from app.rag.context.context_builder import ContextBuilder
from app.rag.generation.rag_generator import RAGGenerator

from app.rag.pipeline.rag_pipeline import RAGPipeline


def build_rag_pipeline(
    index_path: str,
    chunks_path: str
) -> RAGPipeline:

    # --------------------------------
    # 1. Load persisted chunks
    # --------------------------------

    with open(chunks_path, "rb") as file:
        documents = pickle.load(file)


    # --------------------------------
    # 2. LLM
    # --------------------------------

    llm = OllamaLLM(
        model_name="qwen3:4b"
    ).get_model()


    # --------------------------------
    # 3. Load FAISS vector store
    # --------------------------------

    faiss_store = FAISSStore()

    vector_store = faiss_store.load(
        index_path
    )


    # --------------------------------
    # 4. Dense retriever
    # --------------------------------

    dense_retriever = DenseRetriever(
        vector_store=vector_store,
        k=10
    )


    # --------------------------------
    # 5. BM25 retriever
    # --------------------------------

    bm25_retriever = BM25Retriever(
        documents=documents,
        k=10
    )


    # --------------------------------
    # 6. Hybrid retriever
    # --------------------------------

    hybrid_retriever = HybridRetriever(
        dense_retriever=dense_retriever,
        bm25_retriever=bm25_retriever,
        k=10
    )


    # --------------------------------
    # 7. Cross-encoder reranker
    # --------------------------------

    reranker = CrossEncoderReranker(
        top_k=4
    )


    # --------------------------------
    # 8. Query rewriter
    # --------------------------------

    query_rewriter = QueryRewriter(
        llm=llm
    )


    # --------------------------------
    # 9. Context builder
    # --------------------------------

    context_builder = ContextBuilder()


    # --------------------------------
    # 10. RAG generator
    # --------------------------------

    generator = RAGGenerator(
        llm=llm
    )


    # --------------------------------
    # 11. Complete RAG pipeline
    # --------------------------------

    pipeline = RAGPipeline(
        query_rewriter=query_rewriter,
        retriever=hybrid_retriever,
        reranker=reranker,
        context_builder=context_builder,
        generator=generator
    )

    return pipeline