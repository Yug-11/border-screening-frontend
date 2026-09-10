import os
import tempfile

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.ocr.ocr_service import ocr_service
from app.services.validation.reference_validator import validate_document
from app.services.validation.cross_validator import cross_validate
from app.services.tampering.tampering_service import tampering_service
import json
from fastapi import Form
from app.services.tampering.tampering_service import (
    analyze_field_aware_tampering,
)
from fastapi import Depends
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"],
)


@router.post("/ocr")
async def run_ocr(file: UploadFile = File(...)):
    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be determined.",
        )

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, and WebP images are supported.",
        )

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    suffix = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }[file.content_type]

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:
            temp_file.write(contents)
            temp_path = temp_file.name

        result = ocr_service.process(temp_path)

        return {
            "success": True,
            "filename": file.filename,
            "content_type": file.content_type,
            **result,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed: {str(exc)}",
        ) from exc

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/validate")
async def validate_document_against_reference(ocr_result: dict, current_user: dict = Depends(get_current_user)):
    try:
        fields = ocr_result.get("fields", {})

        if not fields.get("passport_number"):
            raise HTTPException(
                status_code=400,
                detail="Passport number is required for validation.",
            )

        result = validate_document(fields)

        return {
            "success": True,
            **result,
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Document validation failed: {str(exc)}",
        ) from exc

@router.post("/cross-validate")
async def cross_validate_document(
    payload: dict,
    current_user: dict = Depends(get_current_user),
):
    try:
        ocr_fields = payload.get("fields", {})
        mrz = payload.get("mrz", {})

        if not ocr_fields:
            raise HTTPException(
                status_code=400,
                detail="OCR fields are required.",
            )

        result = cross_validate(ocr_fields, mrz)

        return {
            "success": True,
            **result,
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Cross-validation failed: {str(exc)}",
        ) from exc

@router.post("/tampering")
async def run_tampering_analysis(file: UploadFile = File(...)):
    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be determined.",
        )

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, and WebP images are supported.",
        )

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    suffix = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }[file.content_type]

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:
            temp_file.write(contents)
            temp_path = temp_file.name

        result = tampering_service.process(temp_path)

        return {
            "success": True,
            "filename": file.filename,
            "content_type": file.content_type,
            **result,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Tampering analysis failed: {str(exc)}",
        ) from exc

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)





@router.post("/tampering/field-aware")
async def run_field_aware_tampering(
    file: UploadFile = File(...),
    ocr_regions: str = Form(...),
):
    if not file.content_type:
        raise HTTPException(
            status_code=400,
            detail="File type could not be determined.",
        )

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
    }

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, and WebP images are supported.",
        )

    try:
        regions = json.loads(ocr_regions)

        if not isinstance(regions, list):
            raise ValueError("ocr_regions must be a JSON list.")

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid OCR regions JSON: {exc}",
        ) from exc

    contents = await file.read()

    if not contents:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    suffix = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }[file.content_type]

    temp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:
            temp_file.write(contents)
            temp_path = temp_file.name

        result = analyze_field_aware_tampering(
            temp_path,
            regions,
        )

        return {
            "success": True,
            "filename": file.filename,
            "content_type": file.content_type,
            **result,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Field-aware tampering analysis failed: {exc}",
        ) from exc

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)

