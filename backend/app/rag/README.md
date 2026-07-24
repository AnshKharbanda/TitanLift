# TitanLift RAG

RAG (Retrieval-Augmented Generation) module for TitanLift. It answers
fitness, nutrition, recovery, and exercise-related questions using
information retrieved from research PDFs and YouTube transcripts.

## Pipeline

``` text
PDFs + YouTube Transcripts
          ↓
        Loader
          ↓
        Cleaner
          ↓
        Chunker
          ↓
   BGE Embeddings
          ↓
        FAISS
```

At query time:

``` text
User Query
    ↓
Query Rewriter
    ↓
FAISS + BM25
    ↓
RRF Hybrid Retrieval
    ↓
Cross-Encoder Reranker
    ↓
Context Builder
    ↓
Qwen3:4b (Ollama)
    ↓
Grounded Answer
```

## Folder Structure

``` text
rag/
├── chunking/
├── context/
├── data/
│   ├── pdf/
│   ├── yt_urls.txt
│   └── storage/
│       ├── faiss_index/
│       └── chunks.pkl
├── embeddings/
├── generation/
├── llm/
├── loader/
├── pipeline/
├── preprocessing/
├── query/
├── reranking/
├── retrieval/
├── vector_store/
├── build_pipeline.py
├── ingest.py
└── test.py
```

## Main Features

-   PDF document loading
-   YouTube transcript loading
-   Text cleaning and chunking
-   BGE embeddings
-   FAISS semantic search
-   BM25 keyword search
-   Hybrid retrieval using Reciprocal Rank Fusion (RRF)
-   Cross-encoder reranking
-   LLM query rewriting
-   Local generation using Qwen3:4b through Ollama
-   Grounded responses based on retrieved context

## Run Locally

From `TitanLift/backend`:

``` powershell
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Install Ollama and pull the model:

``` powershell
ollama pull qwen3:4b
```

Put PDFs inside:

``` text
app/rag/data/pdf/
```

Add YouTube URLs to:

``` text
app/rag/data/yt_urls.txt
```

Build the knowledge base:

``` powershell
python -m app.rag.ingest
```

This creates the FAISS index and `chunks.pkl`.

Run the RAG test:

``` powershell
python -m app.rag.test
```

You only need to rerun ingestion when the knowledge sources change.

## Current V1

The current knowledge base contains research PDFs and YouTube
transcripts and has been successfully tested end-to-end with more than
1,000 chunks.

## Future Improvements

-   Reduce response latency and unnecessary LLM calls
-   Conditional query rewriting
-   Better GPU/model optimisation
-   Query caching
-   Source citations with PDF pages and YouTube timestamps
-   Metadata filtering by nutrition, exercise, recovery, etc.
-   Conversation-aware retrieval
-   Incremental ingestion instead of rebuilding the entire index
-   Retrieval evaluation using Recall@K, MRR and nDCG
-   Compare recursive vs semantic chunking
-   Retrieval confidence and better abstention
-   Return answers together with retrieved sources

## Status

**RAG V1: Complete**

The current version supports ingestion, hybrid retrieval, reranking,
context construction, and locally generated grounded answers.
