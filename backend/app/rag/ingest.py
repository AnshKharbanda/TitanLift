from app.rag.loader.pdf_loader import PDFLoader
from app.rag.loader.youtube_loader import YouTubeLoader

from app.rag.preprocessing.cleaner import DocumentCleaner
from app.rag.chunking.recursive_chunker import RecursiveChunker
from app.rag.vector_store.faiss_store import FAISSStore
from app.rag.pipeline.ingestion_pipeline import IngestionPipeline


PDF_PATH = "app/rag/data/pdf"
YT_URLS_PATH = "app/rag/data/yt_urls.txt"

INDEX_PATH = "app/rag/data/storage/faiss_index"
CHUNKS_PATH = "app/rag/data/storage/chunks.pkl"


def load_youtube_documents():

    documents = []

    with open(YT_URLS_PATH, "r", encoding="utf-8") as file:

        for line in file:

            url = line.strip()

            if not url:
                continue

            try:
                loader = YouTubeLoader(url)

                video_documents = loader.load()

                documents.extend(video_documents)

                print(f"Loaded YouTube: {url}")

            except Exception as error:
                print(f"Failed YouTube: {url}")
                print(error)

    return documents


def main():

    # -------------------------
    # PDF
    # -------------------------

    pdf_loader = PDFLoader(PDF_PATH)

    pdf_documents = pdf_loader.load()

    print(f"PDF documents loaded: {len(pdf_documents)}")


    # -------------------------
    # YOUTUBE
    # -------------------------

    youtube_documents = load_youtube_documents()

    print(
        f"YouTube documents loaded: "
        f"{len(youtube_documents)}"
    )


    # -------------------------
    # COMBINE
    # -------------------------

    documents = pdf_documents + youtube_documents

    print(f"Total documents: {len(documents)}")


    # -------------------------
    # INGEST
    # -------------------------

    cleaner = DocumentCleaner()

    chunker = RecursiveChunker()

    vector_store = FAISSStore()

    pipeline = IngestionPipeline(
        cleaner=cleaner,
        chunker=chunker,
        vector_store=vector_store
    )

    chunks = pipeline.run(
        documents=documents,
        index_path=INDEX_PATH,
        chunks_path=CHUNKS_PATH
    )

    print(f"Chunks created: {len(chunks)}")
    print("Ingestion completed successfully.")


if __name__ == "__main__":
    main()