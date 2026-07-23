from abc import ABC, abstractmethod
from langchain_core.documents import Document


class BaseLoader(ABC):
    """
    Abstract base class for all document loaders.

    Every loader must implement the `load` method and return
    a list of LangChain Document objects.
    List as different loaders might naturally produce list of documents
    """

    @abstractmethod
    def load(self) -> list[Document]:
        """
        Load data from a source and return it as a list of Documents.

        Returns:
            list[Document]: Loaded documents with associated metadata.
        """
        pass
    
    
# All Loaders

