from langchain_core.language_models.chat_models import BaseChatModel


class RAGGenerator:

    def __init__(self, llm: BaseChatModel):
        self.llm = llm

    def generate(self, query: str, context: str) -> str:

        if not context.strip():
            return "I couldn't find enough relevant information in the knowledge base."

        prompt = f"""
You are the answer generation component of a fitness RAG system.

Answer the user's question using the provided context.

Rules:
- Base your answer on the provided context.
- Do not invent facts that are not supported by the context.
- If the context does not contain enough information, say that the available information is insufficient.
- Give a clear and concise answer.
- Use fitness, exercise, biomechanics, and nutrition terminology when appropriate.
- Do not mention the retrieval process or the RAG system.
- When useful, refer to the provided source numbers.

Context:
{context}

User question:
{query}

Answer:
"""

        response = self.llm.invoke(prompt)

        return response.content.strip()