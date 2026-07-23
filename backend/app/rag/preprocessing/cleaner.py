import re
from langchain_core.documents import Document


class DocumentCleaner:
    
    def clean(self,documents:list[Document])->list[Document]:
        cleaned_documents=[]
        
        for document in documents:
            content = document.page_content
            source = document.metadata.get("source_type")
            
            content = self._repair_hyphenation(content)
            
            if source == "youtube":
                content = self._remove_transcript_markers(content)
                
            content = self._normalize_whitespace(content)
        
            
                
            if content :
                cleaned_doc = Document(
                    page_content=content,
                    metadata=document.metadata
                )
                
                cleaned_documents.append(cleaned_doc)
                
        return cleaned_documents
        
    
    def _normalize_whitespace(self,text:str)->str:
        cleaned = re.sub(r"\s+"," ",text).strip()
        
        return cleaned
    
    def _repair_hyphenation(self,text:str)->str:
        repaired = re.sub(r"-\s*\n\s*","",text)
        
        return repaired
    
    def _remove_transcript_markers(self,text:str)->str:
        removed = re.sub(r"\[.*?\]","",text)
        
        return removed



documents = [
    Document(
        page_content="Muscle hyper-\ntrophy   is\n\nimportant.",
        metadata={"source_type": "pdf"}
    ),

    Document(
        page_content="[Music] Today   we're learning\npush-ups. [Applause]",
        metadata={"source_type": "youtube"}
    ),

    Document(
        page_content="     ",
        metadata={"source_type": "pdf"}
    )
]


cleaner = DocumentCleaner()

cleaned_documents = cleaner.clean(documents)


for doc in cleaned_documents:
    print(doc.page_content)
    print(doc.metadata)
    print("-----")