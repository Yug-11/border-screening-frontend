from fastapi import APIRouter, Depends, HTTPException

from app.core.database import SessionLocal
from app.core.dependencies import get_current_user

from app.models.screening import Screening

from app.services.blockchain.integrity_service import (
    integrity_service,
)
from app.services.blockchain.blockchain_service import (
    blockchain_service,
)


router = APIRouter(
    prefix="/api/integrity",
    tags=["Integrity"],
)


@router.get("/verify/{screening_id}")
async def verify_screening_integrity(
    screening_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Verify screening integrity using two independent checks:

    1. PostgreSQL result_data vs stored SHA-256 hash.
    2. Calculated SHA-256 hash vs blockchain proof.

    Supervisors and Admins can verify screenings across
    checkpoints.

    Officers/Viewers can only verify screenings belonging
    to their assigned checkpoint.
    """

    db = SessionLocal()

    try:
        # ==================================================
        # STEP 1 — Find screening
        # ==================================================

        screening = (
            db.query(Screening)
            .filter(
                Screening.screening_id == screening_id
            )
            .first()
        )

        if not screening:
            raise HTTPException(
                status_code=404,
                detail="Screening not found.",
            )

        # ==================================================
        # STEP 2 — Check checkpoint authorization
        # ==================================================

        role = current_user.get("role")
        user_checkpoint = current_user.get("checkpoint")

        # Supervisors and Admins can access all checkpoints.
        if role not in ("SUPERVISOR", "ADMIN"):

            # The audit information is stored inside result_data.
            result_data = screening.result_data or {}

            audit_data = result_data.get(
                "audit"
            ) or {}

            screening_checkpoint = audit_data.get(
                "checkpoint"
            )

            if screening_checkpoint != user_checkpoint:
                raise HTTPException(
                    status_code=403,
                    detail=(
                        "You are not authorized to verify "
                        "this checkpoint screening."
                    ),
                )

        # ==================================================
        # STEP 3 — Check required integrity data
        # ==================================================

        if not screening.integrity_hash:
            return {
                "success": True,
                "screening_id": screening_id,
                "integrity": {
                    "status": "NOT_AVAILABLE",
                    "message": (
                        "No SHA-256 integrity hash is stored "
                        "for this screening."
                    ),
                },
            }

        if not screening.result_data:
            return {
                "success": True,
                "screening_id": screening_id,
                "integrity": {
                    "status": "NOT_VERIFIABLE",
                    "message": (
                        "Screening result data is not available "
                        "for verification."
                    ),
                },
            }

        # ==================================================
        # STEP 4 — Recalculate SHA-256
        # ==================================================

        data_to_verify = dict(
            screening.result_data
        )

        # The integrity metadata itself was not included
        # when the original hash was generated.
        data_to_verify.pop(
            "integrity",
            None,
        )

        calculated_hash = (
            integrity_service.generate_hash(
                data_to_verify
            )
        )

        stored_database_hash = (
            screening.integrity_hash
        )

        database_hash_match = (
            calculated_hash
            == stored_database_hash
        )

        # ==================================================
        # STEP 5 — Verify blockchain proof
        # ==================================================

        blockchain_result = (
            blockchain_service.verify_integrity_proof(
                screening_id=screening_id,
                integrity_hash=calculated_hash,
            )
        )

        blockchain_hash_match = (
            blockchain_result.get(
                "verified",
                False,
            )
        )

        blockchain_status = (
            blockchain_result.get(
                "status",
                "UNKNOWN",
            )
        )

        transaction_id = (
            blockchain_result.get(
                "transaction_id"
            )
        )

        # ==================================================
        # STEP 6 — Final integrity status
        # ==================================================

        if (
            database_hash_match
            and blockchain_hash_match
        ):
            final_status = "VALID"

        elif not database_hash_match:
            final_status = "DATABASE_TAMPERED"

        elif (
            database_hash_match
            and not blockchain_hash_match
        ):
            final_status = "BLOCKCHAIN_MISMATCH"

        else:
            final_status = "INVALID"

        # ==================================================
        # STEP 7 — Return verification result
        # ==================================================

        return {
            "success": True,

            "screening_id": screening_id,

            "integrity": {
                "status": final_status,
                "algorithm": "SHA-256",

                "database": {
                    "hash_match": database_hash_match,
                    "stored_hash": stored_database_hash,
                    "calculated_hash": calculated_hash,
                },

                "blockchain": {
                    "verified": blockchain_hash_match,
                    "status": blockchain_status,
                    "transaction_id": transaction_id,
                    "network": "LOCAL-DEMO",
                    "stored_hash": blockchain_result.get(
                        "stored_hash"
                    ),
                },
            },
        }

    finally:
        db.close()