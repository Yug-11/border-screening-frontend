import os
import tempfile

from fastapi import (
    APIRouter,
    File,
    HTTPException,
    UploadFile,
)

from app.services.face.face_service import face_service
from fastapi import Depends
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/api/face",
    tags=["Face Verification"],
)


ALLOWED_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}


@router.post("/verify")
async def verify_face(
    document_image: UploadFile = File(...),
    verification_image: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    if document_image.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported document image type.",
        )

    if verification_image.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported verification image type.",
        )

    document_data = await document_image.read()
    verification_data = await verification_image.read()

    if not document_data:
        raise HTTPException(
            status_code=400,
            detail="Document image is empty.",
        )

    if not verification_data:
        raise HTTPException(
            status_code=400,
            detail="Verification image is empty.",
        )

    document_path = None
    verification_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=ALLOWED_TYPES[
                document_image.content_type
            ],
        ) as document_file:
            document_file.write(document_data)
            document_path = document_file.name

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=ALLOWED_TYPES[
                verification_image.content_type
            ],
        ) as verification_file:
            verification_file.write(
                verification_data
            )
            verification_path = verification_file.name

        result = face_service.verify(
            document_image_path=document_path,
            verification_image_path=verification_path,
        )

        return {
            "success": True,
            "document_filename": document_image.filename,
            "verification_filename": (
                verification_image.filename
            ),
            **result,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Face verification failed: {exc}",
        ) from exc

    finally:
        if (
            document_path
            and os.path.exists(document_path)
        ):
            os.remove(document_path)

        if (
            verification_path
            and os.path.exists(verification_path)
        ):
            os.remove(verification_path)