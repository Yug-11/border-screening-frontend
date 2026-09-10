from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from app.core.database import SessionLocal
from app.core.dependencies import get_current_user
from app.models.audit import AuditRecord


router = APIRouter(
    prefix="/api/audit",
    tags=["Audit"],
)


@router.get("/{screening_id}")
async def get_audit(
    screening_id: str,
    current_user: dict = Depends(get_current_user),
):
    db = SessionLocal()

    try:
        records = (
            db.query(AuditRecord)
            .filter(
                AuditRecord.screening_id == screening_id
            )
            .order_by(
                AuditRecord.timestamp.asc()
            )
            .all()
        )

        if not records:
            raise HTTPException(
                status_code=404,
                detail="Audit records not found.",
            )

        # --------------------------------------------------
        # Checkpoint authorization
        # --------------------------------------------------

        role = current_user.get("role")
        user_checkpoint = current_user.get("checkpoint")

        # Supervisors and admins can access audit records
        # across checkpoints.
        if role not in ("SUPERVISOR", "ADMIN"):

            # Every audit record must belong to the
            # authenticated officer's checkpoint.
            unauthorized_record = any(
                record.checkpoint != user_checkpoint
                for record in records
            )

            if unauthorized_record:
                raise HTTPException(
                    status_code=403,
                    detail=(
                        "You are not authorized to access "
                        "this checkpoint audit record."
                    ),
                )

        return {
            "success": True,
            "screening_id": screening_id,
            "records": [
                {
                    "audit_id": record.audit_id,
                    "screening_id": record.screening_id,
                    "action": record.action,
                    "officer_id": record.officer_id,
                    "checkpoint": record.checkpoint,
                    "risk_score": record.risk_score,
                    "decision": record.decision,
                    "timestamp": record.timestamp.isoformat(),
                }
                for record in records
            ],
        }

    finally:
        db.close()