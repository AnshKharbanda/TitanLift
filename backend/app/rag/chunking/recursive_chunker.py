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
    
    
    
