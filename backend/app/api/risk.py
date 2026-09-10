from fastapi import APIRouter

from app.services.risk.risk_service import (
    risk_service,
)


router = APIRouter(
    prefix="/api/risk",
    tags=["Risk Assessment"],
)


@router.post("/calculate")
async def calculate_risk(payload: dict):
    result = risk_service.calculate(
        identity=payload.get("identity"),
        validation=payload.get("validation"),
        cross_validation=payload.get(
            "cross_validation"
        ),
        face=payload.get("face"),
        tampering=payload.get("tampering"),
    )

    return {
        "success": True,
        **result,
    }