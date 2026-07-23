from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_core.documents import Document

from .base_loader import BaseLoader


class PDFLoader(BaseLoader):

    def __init__(self, directory_path: str):
        self.directory_path = directory_path

    def load(self) -> list[Document]:
        loader = DirectoryLoader(
            path=self.directory_path,
            glob="**/*.pdf",
            loader_cls=PyPDFLoader
        )

        documents = loader.load()

        return documents
    
    
loader = PDFLoader("app/rag/loader/data/pdf")

documents = loader.load()

print(len(documents))
print(documents[0].metadata)
print(documents[0].page_content[:500])