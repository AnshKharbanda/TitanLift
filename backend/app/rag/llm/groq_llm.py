from langchain_groq import ChatGroq


class GroqLLM:

    def __init__(
        self,
        api_key: str,
        model_name: str,
    ):
        self.model = ChatGroq(
            api_key=api_key,
            model=model_name,
            temperature=0.2,
        )

    def get_model(self):
        return self.model