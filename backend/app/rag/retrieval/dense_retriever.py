from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

class DenseRetriever:
    
    def __init__(self,vector_store:FAISS,k=5):
        self.vector_store=vector_store
        self.k=k
        
    def retrieve(self,query:str)->list[Document]:
        documents = self.vector_store.similarity_search(
            query=query,
            k=self.k
        )
        
        return documents
    
    