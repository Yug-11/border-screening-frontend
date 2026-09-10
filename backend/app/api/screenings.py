import os
import tempfile
import uuid

from fastapi import (
    APIRouter,
    Depends,
    File,
    Header,
    HTTPException,
    UploadFile,
)
from fastapi.concurrency import run_in_threadpool

from app.core.authorization import require_role
from app.core.dependencies import get_current_user

from app.schemas.screening import (
    ScreeningDecisionRequest,
)

from app.services.screening.screening_service import (
    screening_service,
)


router = APIRouter(
    prefix="/api/screenings",
    tags=["Screenings"],
)


ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


# ==========================================================
# CREATE SCREENING
# ==========================================================

@router.post("")
async def create_screening(
    document_image: UploadFile = File(...),
    verification_image: UploadFile | None = File(None),

    # Optional ID supplied by frontend/test client.
    # If not supplied, backend generates one.
    screening_id_header: str | None = Header(
        default=None,
        alias="X-Screening-ID",
    ),

    current_user: dict = Depends(
        require_role(
            "OFFICER",
            "SUPERVISOR",
            "ADMIN",
        )
    ),
):
    # ------------------------------------------------------
    # Validate document image
    # ------------------------------------------------------

    if document_image.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported document image type.",
        )

    # ------------------------------------------------------
    # Validate verification image
    # ------------------------------------------------------

    if (
        verification_image
        and verification_image.content_type
        not in ALLOWED_TYPES
    ):
        raise HTTPException(
            status_code=400,
            detail="Unsupported verification image type.",
        )

    # ------------------------------------------------------
    # Read document
    # ------------------------------------------------------

    document_data = await document_image.read()

    if not document_data:
        raise HTTPException(
            status_code=400,
            detail="Document image is empty.",
        )

    # ------------------------------------------------------
    # Read verification image
    # ------------------------------------------------------

    verification_data = None

    if verification_image:
        verification_data = (
            await verification_image.read()
        )

        if not verification_data:
            raise HTTPException(
                status_code=400,
                detail="Verification image is empty.",
            )

    document_path = None
    verification_path = None

    # ------------------------------------------------------
    # Generate screening ID BEFORE processing
    # ------------------------------------------------------
    #
    # This is important for WebSocket progress.
    #
    # Frontend/test:
    #
    #   X-Screening-ID: <uuid>
    #
    # WebSocket:
    #
    #   /api/ws/screenings/<same uuid>
    #
    # HTTP screening request:
    #
    #   uses the same uuid
    #
    # If no ID is supplied, the backend generates one.
    # ------------------------------------------------------

    screening_id = (
        screening_id_header
        or str(uuid.uuid4())
    )

    try:
        # --------------------------------------------------
        # Save document temporarily
        # --------------------------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=ALLOWED_TYPES[
                document_image.content_type
            ],
        ) as document_file:

            document_file.write(
                document_data
            )

            document_path = (
                document_file.name
            )

        # --------------------------------------------------
        # Save verification image temporarily
        # --------------------------------------------------

        if verification_data:

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=ALLOWED_TYPES[
                    verification_image.content_type
                ],
            ) as verification_file:

                verification_file.write(
                    verification_data
                )

                verification_path = (
                    verification_file.name
                )

        # --------------------------------------------------
        # Run screening in worker thread
        # --------------------------------------------------
        #
        # create_screening() is synchronous and performs
        # OCR, face processing, database work, etc.
        #
        # Running it directly inside async FastAPI code
        # would block the event loop and prevent WebSocket
        # messages from being sent in real time.
        #
        # run_in_threadpool() keeps the event loop free.
        # --------------------------------------------------

        result = await run_in_threadpool(
            screening_service.create_screening,
            document_path=document_path,
            verification_image_path=verification_path,
            officer_id=current_user[
                "username"
            ],
            checkpoint=current_user[
                "checkpoint"
            ],
            screening_id=screening_id,
        )

        return {
            "success": True,
            **result,
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except PermissionError as exc:

        raise HTTPException(
            status_code=403,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Screening failed: {exc}",
        ) from exc

    finally:

        # --------------------------------------------------
        # Remove temporary document
        # --------------------------------------------------

        if (
            document_path
            and os.path.exists(document_path)
        ):

            try:
                os.remove(
                    document_path
                )
            except OSError:
                pass

        # --------------------------------------------------
        # Remove temporary verification image
        # --------------------------------------------------

        if (
            verification_path
            and os.path.exists(
                verification_path
            )
        ):

            try:
                os.remove(
                    verification_path
                )
            except OSError:
                pass


# ==========================================================
# FINALIZE SCREENING DECISION
# ==========================================================

@router.post(
    "/{screening_id}/decision"
)
async def finalize_screening(
    screening_id: str,
    request: ScreeningDecisionRequest,
    current_user: dict = Depends(
        require_role(
            "OFFICER",
            "SUPERVISOR",
            "ADMIN",
        )
    ),
):
    """
    Record the authorized officer's final
    screening decision.
    """

    try:

        result = (
            screening_service.finalize_screening(
                screening_id=screening_id,

                decision=request.decision,

                remarks=request.remarks,

                officer_id=current_user[
                    "username"
                ],

                checkpoint=current_user[
                    "checkpoint"
                ],
            )
        )

        return {
            "success": True,

            "message": (
                "Screening decision finalized successfully."
            ),

            **result,
        }

    except ValueError as exc:

        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc

    except PermissionError as exc:

        raise HTTPException(
            status_code=403,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to finalize screening: "
                f"{exc}"
            ),
        ) from exc


# ==========================================================
# GET SCREENING
# ==========================================================

@router.get(
    "/{screening_id}"
)
async def get_screening(
    screening_id: str,
    current_user: dict = Depends(
        get_current_user
    ),
):

    result = screening_service.get_screening(
        screening_id
    )

    if result is None:

        raise HTTPException(
            status_code=404,
            detail="Screening not found.",
        )

    # --------------------------------------------------
    # Checkpoint authorization
    # --------------------------------------------------

    role = current_user.get(
        "role"
    )

    user_checkpoint = current_user.get(
        "checkpoint"
    )

    # Supervisors and admins can access screenings
    # across checkpoints.

    if role not in (
        "SUPERVISOR",
        "ADMIN",
    ):

        audit = result.get(
            "audit"
        ) or {}

        screening_checkpoint = audit.get(
            "checkpoint"
        )

        if (
            not screening_checkpoint
            or screening_checkpoint
            != user_checkpoint
        ):

            raise HTTPException(
                status_code=403,
                detail=(
                    "You are not authorized to access "
                    "this checkpoint screening."
                ),
            )

    return {
        "success": True,
        **result,
    }