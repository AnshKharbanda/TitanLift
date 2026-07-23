from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document


class RecursiveChunker:

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 150
    ):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap
        )
        
    def chunk(self,documents:list[Document])->list[Document]:
        chunks = self.splitter.split_documents(documents)
        
        return chunks
    
    
    
documents = [
    Document(
        page_content=(
            "Protein intake is important for muscle growth. "
            "Resistance training increases muscle protein synthesis. "
            "Athletes require sufficient dietary protein for recovery. "
            "Carbohydrates provide energy during intense training. "
            "Adequate sleep also contributes to recovery and performance."
        ),
        metadata={
            "source": "test.pdf",
            "page": 1
        }
    )
]


chunker = RecursiveChunker(
    chunk_size=100,
    chunk_overlap=20
)

chunks = chunker.chunk(documents)


print("Total chunks:", len(chunks))

for i, chunk in enumerate(chunks):
    print(f"\n--- CHUNK {i + 1} ---")
    print(chunk.page_content)
    print("Length:", len(chunk.page_content))
    print("Metadata:", chunk.metadata)