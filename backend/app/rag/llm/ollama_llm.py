from langchain_ollama import ChatOllama


class OllamaLLM:

    def __init__(
        self,
        model_name: str = "qwen3:4b",
        temperature: float = 0
    ):
        self.llm = ChatOllama(
            model=model_name,
            temperature=temperature
        )

    def get_model(self):
        return self.llm