class RAGGenerator:

    def __init__(self, llm):
        self.llm = llm

    def generate(
        self,
        query: str,
        context: str,
    ) -> str:

        if not query.strip():
            raise ValueError(
                "Query cannot be empty."
            )

        prompt = f"""
You are a grounded fitness knowledge assistant.

Answer the user's question using the supplied context.

Context:
{context}

Question:
{query}

Rules:
- Use the context as factual grounding.
- Do not invent information.
- If the context is insufficient, clearly say so.
- Give concise, useful fitness guidance.
"""

        response = self.llm.invoke(prompt)

        return response.content.strip()