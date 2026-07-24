from langchain_core.language_models.chat_models import BaseChatModel


class QueryRewriter:

    def __init__(self, llm: BaseChatModel):
        self.llm = llm

    def rewrite(self, query: str) -> str:

        if not query.strip():
            return query

        prompt = f"""
You are a query rewriting component in a fitness RAG system.

Rewrite the user's query into a clear, precise, retrieval-optimized query.

Rules:
- Preserve the original intent.
- Use appropriate fitness, exercise, biomechanics, or nutrition terminology.
- Do not answer the question.
- Do not add information that the user did not imply.
- Return only the rewritten query.
- Keep the query concise.

User query:
{query}

Rewritten query:
"""

        response = self.llm.invoke(prompt)

        rewritten_query = response.content.strip()

        return rewritten_query