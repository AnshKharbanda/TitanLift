from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.security import get_current_user

from app.schemas.coach import (
    CoachChatRequest,
    CoachChatResponse,
)

from app.coach.query_router import (
    route_coach_query,
)

from app.coach.user_retriever import (
    retrieve_user_context,
)

from app.coach.prompts import (
    build_coach_prompt,
)


coach_router = APIRouter(
    prefix="/coach",
    tags=["AI Coach"],
)


@coach_router.post(
    "/chat",
    response_model=CoachChatResponse,
)
def coach_chat(
    payload: CoachChatRequest,
    request: Request,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    # =========================================================
    # VALIDATE REQUEST
    # =========================================================

    message = payload.message.strip()

    if not message:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty.",
        )


    # =========================================================
    # GET RAG PIPELINE
    # =========================================================

    pipeline = getattr(
        request.app.state,
        "rag_pipeline",
        None,
    )

    if pipeline is None:
        raise HTTPException(
            status_code=503,
            detail="RAG pipeline is not initialized.",
        )


    try:

        # =====================================================
        # 1. DETERMINE WHAT PERSONAL DATA IS RELEVANT
        # =====================================================

        intents = route_coach_query(
            message
        )


        # =====================================================
        # 2. RETRIEVE PERSONAL DATA FROM POSTGRESQL
        # =====================================================

        user_context = retrieve_user_context(
            intents=intents,
            current_user=current_user,
            db=db,
        )


        # =====================================================
        # 3. RETRIEVE FITNESS KNOWLEDGE
        # =====================================================

        knowledge_context = (
            pipeline.retrieve_context(
                message
            )
        )


        # =====================================================
        # 4. BUILD COACH PROMPT
        # =====================================================

        coach_prompt = build_coach_prompt(
            user_message=message,
            user_context=user_context,
            knowledge_context=knowledge_context,
        )


        # =====================================================
        # 5. GENERATE ANSWER
        # =====================================================

        answer = pipeline.generate(
            query=message,
            context=coach_prompt,
        )


        if not answer or not answer.strip():
            raise HTTPException(
                status_code=502,
                detail="AI Coach returned an empty response.",
            )


        return CoachChatResponse(
            answer=answer
        )


    except HTTPException:
        raise


    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


    except Exception as exc:
        import traceback

        traceback.print_exc()

        # Keep the actual exception visible during development.
        print(
            f"AI Coach error: {type(exc).__name__}: {exc}"
        )

        raise HTTPException(
            status_code=500,
            detail=f"AI Coach request failed: {exc}",
        ) from exc