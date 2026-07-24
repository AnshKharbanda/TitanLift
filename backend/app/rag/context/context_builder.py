from langchain_core.documents import Document


class ContextBuilder:

    def build(self, documents: list[Document]) -> str:

        if not documents:
            return ""

        context_parts = []

        for index, document in enumerate(documents, start=1):

            content = document.page_content.strip()

            if not content:
                continue

            source = document.metadata.get("source", "unknown")

            context_part = (
                f"[Source {index}]\n"
                f"Source: {source}\n"
                f"{content}"
            )

            context_parts.append(context_part)

        return "\n\n".join(context_parts)