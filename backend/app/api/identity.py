from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.identity.identity_service import (
    identity_service,
)
from fastapi import Depends
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/api/identity",
    tags=["Identity Verification"],
)


class IdentityLookupRequest(BaseModel):
    passport_number: str

@router.post("/lookup")
async def lookup_identity(
    request: IdentityLookupRequest,
    current_user: dict = Depends(get_current_user),
):
    passport_number = request.passport_number.strip()

    if not passport_number:
        raise HTTPException(
            status_code=400,
            detail="Passport number is required.",
        )

    try:
        result = identity_service.lookup(
            passport_number
        )

        return {
            "success": True,
            **result,
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Identity lookup failed: {exc}",
        ) from exc