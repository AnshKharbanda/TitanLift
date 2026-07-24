from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

from app.rag.embeddings.embedding_model import EmbeddingModel

class FAISSStore:
    
    def __init__(self):
        self.embeddings = EmbeddingModel().get_model()
        self.vector_store=None
        
    def build(self, documents : list[Document]):
        self.vector_store = FAISS.from_documents(
            documents=documents,
            embedding=self.embeddings
        )
        
        return self.vector_store
    
    def save(self,path:str):
        if self.vector_store is None:
            raise ValueError("Vector Store has not been built yet.")
        
        self.vector_store.save_local(path)
        
    def load(self, path: str):
        self.vector_store = FAISS.load_local(
            folder_path=path,
            embeddings=self.embeddings,
            allow_dangerous_deserialization=True
        )

        return self.vector_store
    
    