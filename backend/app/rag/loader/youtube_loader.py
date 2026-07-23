from urllib.parse import urlparse, parse_qs

from youtube_transcript_api import YouTubeTranscriptApi
from langchain_core.documents import Document

from app.rag.loader.base_loader import BaseLoader


class YouTubeLoader(BaseLoader):

    def __init__(self, url: str):
        self.url = url
        self.ytt_api = YouTubeTranscriptApi()

    def _video_id(self) -> str:
        """Extract the video ID from common YouTube URL formats."""

        parsed = urlparse(self.url)

        host = parsed.hostname
        path = parsed.path

        # https://youtu.be/VIDEO_ID
        if host == "youtu.be":
            video_id = path.strip("/")

        # https://youtube.com/watch?v=VIDEO_ID
        elif host in ("youtube.com", "www.youtube.com") and path == "/watch":
            query = parse_qs(parsed.query)

            if "v" not in query:
                raise ValueError("YouTube URL does not contain a video ID")

            video_id = query["v"][0]

        # /shorts/VIDEO_ID
        # /embed/VIDEO_ID
        # /live/VIDEO_ID
        elif host in ("youtube.com", "www.youtube.com"):
            parts = path.strip("/").split("/")

            if len(parts) == 2 and parts[0] in ("shorts", "embed", "live"):
                video_id = parts[1]
            else:
                raise ValueError("Unsupported YouTube URL format")

        else:
            raise ValueError("Invalid YouTube URL")

        if not video_id:
            raise ValueError("Could not extract video ID")

        return video_id

    def _fetch_transcript(self, video_id: str):
        """Fetch transcript using youtube-transcript-api."""

        return self.ytt_api.fetch(video_id)

    def _convert_to_text(self, transcript) -> str:
        """Convert transcript snippets into one text string."""

        texts = []

        for snippet in transcript:
            texts.append(snippet.text)

        return " ".join(texts)

    def _create_document(self, text: str, video_id: str) -> Document:
        """Convert transcript text into a LangChain Document."""

        metadata = {
            "source": self.url,
            "source_type": "youtube",
            "video_id": video_id,
        }

        return Document(
            page_content=text,
            metadata=metadata,
        )

    def load(self) -> list[Document]:
        """Load a YouTube transcript as LangChain Documents."""

        video_id = self._video_id()

        transcript = self._fetch_transcript(video_id)

        text = self._convert_to_text(transcript)

        document = self._create_document(text, video_id)

        return [document]